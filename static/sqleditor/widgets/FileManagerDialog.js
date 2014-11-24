define([
    'dojo/_base/declare',
    'dijit/Dialog',
    'dojo/_base/lang',
    'sqleditor/widgets/_FileDialogMixin',
    'sqleditor/widgets/FileManagerTree',
    'dijit/popup',
    'dojo/when',
    'sqleditor/models/FileManagerModel',
    'dijit/TooltipDialog'
], function (declare, Dialog, lang, _FileDialogMixin, Tree, popup, when, FileManagerModel) {

    var isInitialized = false;

    return declare([Dialog, _FileDialogMixin], {

        tree: null,

        treeNode: 'fileManagerTree',

        fileSeperator: '/',

        title: 'Save File As',

        style: 'width: 350px; height: 360px; overflow: auto;',

        /**
         * On Tree Refresh callback.
         */
        onTreeRefresh: null,

        /**
         * A File Manager Dialog that allows users
         * to create, save and delete files and folders.
         * @param {Object} kwArgs Keyword Args
         */
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        postCreate: function () {
            this.inherited(arguments);
            this.initTree();
        },

        /**
         * OnShow and onTreeRefresh callback can be defined
         * in order to refresh the tree store data and sync
         * it with the server.
         */
        _onShow: function () {
            var that = this;

            this.inherited(arguments);
            if (!this.onTreeRefresh) {
                return;
            }

            if (!isInitialized) {
                isInitialized = true;
                return;
            }

            this.onTreeRefresh();
            when(this.tree.model.store.query({})).then(lang.hitch(that, function () {
                var model = FileManagerModel.getModel();
                this.tree.refreshModel(model);
            }));
        },

        buttonSaveClick: function () {
            var name = this.textboxFileName.get('value'),
                that = this,
                newFile = {
                    name: name + '.sql',
                    isDir: false,
                    content: this._get('fileContent'),
                    parentId: this.tree.get('selectedItem').id
                };

            when(this.tree.model.store.addItem(newFile)).then(function (data) {
                newFile.id = data;
                that.hide();
                if (that.onSave) {
                    that.onSave(newFile);
                }
            });
        },

        buttonDeleteClick: function () {
            var id = this.tree.get('selectedItem').id;
            if (!this.tree.isEmptyFolder(id)) {
                return;
            }

            this.tree.model.store.remove(id);
        },

        dropDownNewFolderClick: function () {
            this.textboxFolderNameOnChange();
        },

        buttonNewFolderClick: function () {
            var name = this.textboxFolderName.get('value'),
                that = this,
                newFolder = {
                    name: name,
                    isDir: true,
                    parentId: this.tree.get('selectedItem').id
                };

            when(this.tree.model.store.addItem(newFolder)).then(function () {
                that.textboxFolderName.set('value', '');
                popup.close(that.newFolderTooltipDialog);
            });
        },

        textboxFolderNameOnChange: function () {
            var folderName = this.textboxFolderName.get('value'),
                selectedPath = this.fileSeperator,
                selected = this.tree.get('selectedItem');

            if (this.tree.isSingleNodeSelected()) {
                selectedPath = this.tree.getDirectoryPaths()[0];
            }

            this.newFolderPath.innerHTML = selectedPath + this.fileSeperator + folderName;
            this.newFolderSubmit.set('disabled',
                            !this.textboxFolderName.isValid() ||
                            !folderName ||
                            !selected.isDir ||
                            !(selected &&
                              this.tree.isDuplicateFolder(selected.id, folderName)));
        },

        textboxFileNameOnChange: function () {
            var fileName = this.textboxFileName.get('value');

            this.updateFileDialogPath();
            this.buttonSave.set('disabled',
                    !this.textboxFileName.isValid() || !fileName);
        },

        updateFileDialogPath: function () {
            var path = this.fileSeperator,
                selected = this.tree.get('selectedItem');

            if (this.tree.isSingleNodeSelected()) {
                path = this.tree.getDirectoryPaths()[0];
            }

            if (selected && selected.isDir) {
                path += this.fileSeperator + this.textboxFileName.get('value');
            }

            this.textFileDialogPath.innerHTML = path;
        },

        onTreeNodeClick: function (item, node) {
            this.updateFileDialogPath();
            this.textboxFileName.set('disabled', !item.isDir);
            this.buttonSave.set('disabled',
                                item.isDir &&
                                this.textboxFileName.get('value') === '');
            this.deleteButton.set('disabled', !this.tree.isEmptyFolder(item.id));
            this.dropDownNewFolder.set('disabled',
                            !this.tree.isSingleNodeSelected() || !item.isDir);

            if (!item.isDir) {
                this.textboxFileName.set('value', '');
            }
        },

        initTree: function () {
            this.tree = new Tree({
                model: FileManagerModel.getModel(),
                openOnClick: false,
                openOnDblClick: true,
                onClick: lang.hitch(this, this.onTreeNodeClick)
            }, this.treeNode);
        }
    });
});

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/Tree',
    'dojo/aspect',
    'sqleditor/base64'
], function (declare, lang, Tree, aspect, base64) {

    return declare('sqleditor.widgets.FileManagerTree', Tree, {

        showRoot: false,

        persist: true,

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        /**
         * Gets the file or folder path for all selected nodes.
         * @returns {Array} An array of file and folder selected paths.
         */
        getDirectoryPaths: function () {
            var nodes = this.get('selectedNodes'),
                paths = [],
                i = 0;

            for (i; i < nodes.length; i += 1) {
                paths.push(base64.decode(nodes[i].item.id));
            }

            return paths;
        },

        /**
         * Identifies whether the folder is empty.
         * @param {string} id The folder id.
         * @returns {Boolean} A value indicating whether the folder is empty.
         */
        isEmptyFolder: function (id) {
            return id !== this.tree.model.root.id &&
                           !this.tree.model.store.query({parentId: id}).length;
        },

        /**
         * Identifies whether a folder by the same name and id already exists.
         * @param {string} id The id of the folder.
         * @param {string} name The name of thefolder.
         * @returns {Boolean} A value indicating whether the id and name already
         * exists.
         */
        isDuplicateFolder: function (id, name) {
            return !this.tree.model.store.query({
                parentId: id,
                name: name
            }).length;
        },

        /**
         * Identifies whether a single file tree node is selected.
         * @returns {Boolean} A value indicating whether only one node
         * is highlighted in the tree.
         */
        isSingleNodeSelected: function () {
            return this.tree.get('selectedNodes').length === 1;
        },

        /**
         * Expands a tree node.
         * @param {Object} item The tree item.
         */
        expandItem: function (item) {
            var that = this
            this.model.store.getCache().then(function (store) {
                var path = [];
                while (item) {
                    path.unshift(item.id);
                    item = store.query({'id': item.parentId})[0];
                }

                that.set('path', path);
            });
        },

        /**
         * Refreshes a tree with a new model.
         * @param {ObjectStoreModel} model The model.
         */
        refreshModel: function (model) {
            this.dndController.selectNone();
            this._itemNodesMap = {};
            this.rootNode.state = 'UNCHECKED';
            this.model.root.children = null;
            if (this.rootNode) {
                this.rootNode.destroyRecursive();
            }

            this.model.constructor(model);
            this.postMixInProperties();
            this.own(
                aspect.after(this.model, 'onChange', lang.hitch(this, '_onItemChange'), true),
                aspect.after(this.model, 'onChildrenChange', lang.hitch(this, '_onItemChildrenChange'), true),
                aspect.after(this.model, 'onDelete', lang.hitch(this, '_onItemDelete'), true)
            );

            this._load();
        }
    });
});

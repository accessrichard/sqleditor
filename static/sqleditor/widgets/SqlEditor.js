/*global container */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/registry',
    'sqleditor/Router',
    'sqleditor/models/DatabaseExplorerModel',
    'sqleditor/models/UserModel',
    'sqleditor/models/FileManagerStore',
    'sqleditor/models/FileManagerModel',
    'sqleditor/widgets/TabPage',
    'sqleditor/widgets/FileManagerDialog',
    'sqleditor/widgets/FileManagerTree',
    'sqleditor/widgets/LoginDialog',
    'sqleditor/widgets/_LayoutMixin',
    'sqleditor/widgets/MessageQueue',
    'sqleditor/widgets/ErrorHandler',
    'sqleditor/widgets/DatabaseExplorer',
    'sqleditor/widgets/Settings',
    'sqleditor/keyBindings'
], function (declare, lang, registry, Router, DatabaseExplorerModel,
             UserModel, FileManagerStore,  FileManagerModel, TabPage,
             FileManagerDialog, FileManagerTree, LoginDialog, _LayoutMixin) {

    var tabCount = 0,
        loginSource = '';

    return declare('sqleditor.widgets.SqlEditor', _LayoutMixin, {

        treeNode: 'fileTree',

        userModel: null,

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
            this.userModel = new UserModel();
        },

        postCreate: function () {
            this.inherited(arguments);
            this.initFileManager();
            this.initSystems();
            this.toggleLogoutButton();
            this.tabContainer.watch('selectedChildWidget',
                                    lang.hitch(this, this.tabContainerOnChange));
        },

        initSystems: function () {
            var model = new DatabaseExplorerModel(),
                that = this;

            model.getSystemModel().then(function (store) {
                that.comboBoxSystems.set('options', store);
                that.comboBoxSystems.set('value', store[0].label);
            });
        },

        initFileManager: function () {
            var that = this,
                store = new FileManagerStore(),
                model;

            store.query({}).then(function () {
                FileManagerModel.createModel(store, store.rootQuery);
                model = FileManagerModel.getModel();

                that.tree = new FileManagerTree({
                    model: model,
                    openOnClick: true,
                    onClick: lang.hitch(that, that.treeNodeOnClick)
                }, that.treeNode);

                that.tree.onLoadDeferred.then(function () {
                    that.startRouter();
                });
            });
        },

        startRouter: function () {
            var router = new Router();
            router.startup();
        },

        toggleLogoutButton: function () {
            this.buttonLogout.set('disabled', !this.userModel.getCookie());
        },

        createLoginDialog: function () {
            if (this.loginDialog) {
                return;
            }

            this.loginDialog = new LoginDialog({
                onLoginSuccess: lang.hitch(this, this.onLoginSuccess)
            });
        },

        buttonLoginClick: function (e) {
            var system = this.comboBoxSystems.get('value');
            loginSource = 'button';
            this.showLoginDialog(system);
        },

        showLoginDialog: function (system) {
            var that = this;
            this.createLoginDialog();

            this.loginDialog.show().then(function () {
                that.loginDialog.textboxSystem.set('value', system);
            });
        },

        onLoginSuccess: function () {
            this.toggleLogoutButton();
            if (loginSource === 'run') {
                this.buttonRunClick();
            }
        },

        getScratchTabName: function () {
            tabCount += 1;
            return 'Scratch (' + tabCount + ')';
        },

        treeNodeOnClick: function (item) {
            var that = this;
            if (item.isDir) {
                return;
            }

            if (item.id && !this.selectTab(item.id)
                        && this.isTabSelected(item.id)) {
                return;
            }

            this.tree.model.store.get(item.id).then(function (sql) {
                //// Handle jsonify('') => ""
                if (lang.trim(sql) === '""') {
                    sql = '';
                }

                that.createTab(item.name, item.id, sql);
            });
        },

        comboboxSystemsOnChange: function () {
            if (this.tabContainer.selectedChildWidget) {
                this.tabContainer.selectedChildWidget.
                    set('system', this.comboBoxSystems.get('value'));
            }
        },

        buttonRunClick: function () {
            var page = this.tabContainer.selectedChildWidget,
                that = this,
                limit,
                system;

            if (!this.comboBoxSystems.isValid()) {
                this.comboBoxSystems.focus();
                return;
            }

            if (!(page instanceof TabPage)) {
                return;
            }

            system = this.comboBoxSystems.get('value');
            limit = this.numberSpinnerLimit.get('value');
            page.execute(system, limit).then(function (response) {
                if (response && response.isLoginRequired) {
                    loginSource = 'run';
                    that.showLoginDialog(system);
                    return;
                }

                that.tabContainer.selectChild(page).then(function () {
                    if (!page.grid) {
                        return;
                    }

                    page.refresh();
                    page.editor.codeEditor.focus();
                });
            });
        },

        buttonLinkClick: function () {
            var page = this.tabContainer.selectedChildWidget,
                system = this.comboBoxSystems.get('value');

            if (!page) {
                alert(window.location.href);
            }

            alert(window.location.href + '#/tab/' + page.get('file') + /system/ + system);
        },

        buttonSaveClick: function () {
            var page = this.tabContainer.selectedChildWidget,
                file = page.get('file'),
                that = this;

            if (!file) {
                this.showSaveFileAsDialog(page.editor.get('value'));
                return;
            }

            this.messageQueue.addMessage('Saving');
            this.tree.model.store.putItem({
                id: file,
                content: page.editor.get('value')
            }).then(function () {
                that.messageQueue.addMessage('Saved');
            });
        },

        showSaveFileAsDialog: function (fileContent) {
            if (this.fileDialog) {
                this.fileDialog.set('fileContent', fileContent);
                this.fileDialog.show();
                return;
            }

            this.fileDialog = new FileManagerDialog({
                model: this.tree.model,
                onSave: lang.hitch(this, this.fileManagerDialogOnSave)
            });

            this.fileDialog.set('fileContent', fileContent);
            this.fileDialog.show();
        },

        fileManagerDialogOnSave: function (node) {
            this.tabContainer.selectedChildWidget.set('title', node.name);
            this.tabContainer.selectedChildWidget.set('file', node.id);
        },

        buttonNewClick: function () {
            this.createTab(this.getScratchTabName(), null, 'select\n\t*\nfrom\n\t');
        },

        buttonLogoutClick: function () {
            var that = this;
            this.userModel.logout().then(function () {
                that.toggleLogoutButton();
            });
        },

        isTabSelected: function (file) {
            return this.tabContainer.selectedChildWidget &&
                this.tabContainer.selectedChildWidget.get('file') === file;
        },

        createTab: function (name, file, contents) {
            var page;

            if (file && !this.selectTab(file) && this.isTabSelected(file)) {
                return;
            }

            page =  new TabPage();
            page.set('title', name);
            page.set('file', file);
            this.tabContainer.addChild(page);
            this.tabContainer.selectChild(page);
            page.startup();

            if (contents) {
                page.editor.set('content', contents);
            }
        },

        selectTab: function (file) {
            var tabs = this.tabContainer.getChildren(),
                i = 0;
            for (i; i < tabs.length; i +=1 ) {
                if (tabs[i].get('file') === file) {
                    this.tabContainer.selectChild(tabs[i]);
                    return;
                }
            }
        },

        tabContainerOnChange: function (name, oldTab, newTab) {
            var system = newTab.get('system');
            if (system) {
                this.comboBoxSystems.set('value', system);
            } else {
                newTab.set('system', this.comboBoxSystems.get('value'));
            }

            if (newTab.grid) {
                newTab.grid.resize();
            }

            //// Refresh code editor in case font/display changes.
            newTab.editor.codeEditor.refresh();
        },

        comboboxSearchOnChange: function () {
            var id = this.comboboxSearch.item.base64path,
                that = this;

            this.tree.model.store.query({ id: id }).then(function (item) {
                that.tree.expandItem(item[0]);
            });
        },

        toggleExplorer: function () {
            var container = registry.byId('layoutBorderContainer'),
                children = container.getChildren(),
                i;

            for (i = 0; i < children.length; i += 1) {
                if (children[i].declaredClass === 'dijit.layout.AccordionContainer') {
                    registry.byId('layoutBorderContainer').removeChild(registry.byId('leftAccordion'));
                    return;
                }
            }

            registry.byId('layoutBorderContainer').addChild(registry.byId('leftAccordion'));
        }
    });
});
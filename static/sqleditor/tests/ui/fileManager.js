require([
    'sqleditor/models/FileManagerStore',
    'sqleditor/models/FileManagerModel',
    'dojo/when',
    'dojo/dom-construct',
    'dojo/_base/window',
    'dojo/store/Memory',
    'sqleditor/widgets/FileManagerDialog',
    'dijit/form/Button'
], function (FileManagerStore, FileManagerModel, when,
             domConstruct, win, Memory, FileManagerDialog, Button) {

    domConstruct.create('div', { id: 'dialog' }, win.body());

    function addSaveButton(dialog) {
        return new Button({
            iconClass: 'dijitEditorIcon dijitEditorIconSave',
            onClick: function () {
                dialog.show();
            }
        }, 'dialog');
    }

    function getFileManagerModel() {
        var store = new FileManagerStore();
        return store.query({}).then(function () {
            return FileManagerModel.createModel(store, store.rootQuery);
        });
    }

    function getMemoryModel() {
        var store = new Memory({
            data: data.data,
            idProperty: 'id',
            getChildren: function (object) {
                return this.query({ parentId: object.id  });
            }
        });

        return FileManagerModel.createModel(store, { id: store.data[0].id });
    }

    function getModel(isMemory) {
        if (isMemory) {
            return when(getMemoryModel());
        }

        return getFileManagerModel();
    }

    getModel(false).then(function (model) {
        addSaveButton(new FileManagerDialog({ model: model }));
    });

});

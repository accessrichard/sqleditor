define([
    'dojo/_base/declare',
    'dojo/store/Observable',
    'dijit/tree/ObjectStoreModel'
], function (declare, Observable, ObjectStoreModel) {

    var FileManagerModel = declare('sqleditor/models/FileManagerStoreModel', null, { });

    /**
     * Creates an Observable ObjectStoreModel.
     * @param {} store The tree store.
     * @param {} rootQuery The root query for the tree store.
     * @returns {} The ObjectStoreModel(Observable(store));
     */
    FileManagerModel.createModel = function (store, rootQuery) {

        FileManagerModel.model =  new ObjectStoreModel({
            store: new Observable(store),
            query: rootQuery,
            labelAttr: 'name',
            mayHaveChildren: function (node) {
                return (node.isDir);
            }
        });

        return FileManagerModel.model;
    };

    /**
     * Gets the file tree model.
     * This model needs to be shared amongst
     * the file manager dialog and the file navigator
     * in the main window.
     * @returns {} The FileManagerModel.
     */
    FileManagerModel.getModel = function () {
        if (!FileManagerModel.model) {
            FileManagerModel.createModel();
        }

        return FileManagerModel.model;
    };

    return FileManagerModel;
});

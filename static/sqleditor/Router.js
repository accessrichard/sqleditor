define([
    'dojo/_base/declare',
    'dojo/router',
    'dijit/registry'
], function (declare, router, registry) {

    return declare(null, {

        startup: function () {
            var that = this;
            router.register("/tab/:id/system/:system", function (e) {
                e.preventDefault();
                that.restoreTab(e.params.id, e.params.system);
            });

            router.startup();
        },

        /**
         * Highlights the tree node for a file
         * and opens it in an editor tab page.
         * @param {String} id The file id.
         * @param {String} system The database system.
         */
        restoreTab: function (id, system) {
            var tree = registry.byId('fileTree'),
                editor = registry.byId('editor');

            tree.model.store.query({ id: id }).then(function (item) {
                tree.expandItem(item[0]);
                editor.treeNodeOnClick(item[0]);
                editor.comboBoxSystems.set('value', system);
            });
        }
    });
});
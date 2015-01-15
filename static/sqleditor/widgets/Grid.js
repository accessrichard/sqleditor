define([
    'dgrid/Grid',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnHider',
    'dgrid/extensions/Pagination',
    'dojo/_base/declare',
    'sqleditor/models/SettingsModel',
    'sqleditor/widgets/FullScreenGrid'
], function (Grid, ColumnResizer, ColumnReorder,
             ColumnHider, Pagination, declare, SettingsModel, FullScreenGrid) {

    var settings = new SettingsModel();

    return declare([Grid, ColumnResizer, ColumnReorder, ColumnHider, Pagination, FullScreenGrid], {

        rowsPerPage: settings.getPageSize(),

        pageSizeOptions: settings.getPageSizeOptions(),

        postCreate: function () {
            this.inherited(arguments);
            this.bindKeys();
        }
    });
});
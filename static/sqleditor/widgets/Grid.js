define([
    'dgrid/Grid',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnHider',
    'dgrid/extensions/Pagination',
    'dojo/_base/declare',
    'sqleditor/models/SettingsModel'
], function (Grid, ColumnResizer, ColumnReorder,
             ColumnHider, Pagination, declare, SettingsModel) {

    var settings = new SettingsModel();

    return declare([Grid, ColumnResizer, ColumnReorder, ColumnHider, Pagination], {

        rowsPerPage: settings.getPageSize(),

        pageSizeOptions: settings.getPageSizeOptions()

    });
});
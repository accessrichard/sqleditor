define([
    'dgrid/Grid',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnHider',
    'dgrid/extensions/Pagination',
    'dojo/_base/declare'
], function (Grid, ColumnResizer, ColumnReorder, ColumnHider, Pagination, declare) {

    return declare([Grid, ColumnResizer, ColumnReorder, ColumnHider, Pagination], {

        minRowsPerPage: 300,

        bufferRows: 30

    });
});
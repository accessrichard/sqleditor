define([
    'dgrid/OnDemandGrid',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnHider',
    'dojo/_base/declare'
], function (Grid, ColumnResizer, ColumnReorder, ColumnHider, declare) {

    return declare([Grid, ColumnResizer, ColumnReorder, ColumnHider], {

        minRowsPerPage: 300,

        bufferRows: 30

    });
});
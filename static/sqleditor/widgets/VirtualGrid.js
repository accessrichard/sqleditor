define([
    'dgrid/OnDemandGrid',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnHider',
    'dojo/_base/declare',
    'sqleditor/widgets/FullScreenGrid'
], function (Grid, ColumnResizer, ColumnReorder, ColumnHider, declare, FullScreenGrid) {

    return declare([Grid, ColumnResizer, ColumnReorder, ColumnHider, FullScreenGrid], {

        bufferRows: 30,

        minRowsPerPage: 100,

        postCreate: function () {
            this.inherited(arguments);
            this.bindKeys();
        }
    });
});
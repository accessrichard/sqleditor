require([
    'sqleditor/models/GridModel',
    'sqleditor/widgets/Grid',
    'dojo/dom-construct',
    'dojo/_base/window',
    'dijit/form/Button',
    'dojo/domReady!'
], function(GridModel, Grid, domConstruct, win) {

    domConstruct.create('div', { id: 'grid' }, win.body());

    var model = new GridModel();

    model.getModel('select * from person', 'sqlite').then(function (data) {
        var grid = new Grid({
            store: data.store,
            columns: data.columns
        }, 'grid');

        grid.startup();

    });
});

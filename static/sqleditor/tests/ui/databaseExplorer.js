require([
    'dojo/dom-construct',
    'dojo/_base/window',
    'sqleditor/widgets/DatabaseExplorer',
    'dojo/domReady!'
], function (domConstruct, win, DatabaseExplorer) {

    domConstruct.create('div', { id: 'explorer' }, win.body());
    var explorer = new DatabaseExplorer({}, 'explorer').startup();
});

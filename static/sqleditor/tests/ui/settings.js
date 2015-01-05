require([
    'dojo/dom-construct',
    'dojo/_base/window',
    'sqleditor/widgets/Settings',
    'dojo/domReady!'
], function (domConstruct, win, Settings) {
    domConstruct.create('div', { id: 'settings' }, win.body());
    new Settings({}, 'settings').startup();
});

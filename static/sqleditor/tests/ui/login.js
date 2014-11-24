require([
    'dojo/dom-construct',
    'dojo/_base/window',
    'dijit/form/Button',
    'sqleditor/widgets/LoginDialog'
], function (domConstruct, win, Button, LoginDialog) {

    domConstruct.create('div', { id: 'dialog' }, win.body());

    function addLoginButton(dialog) {
        return new Button({
            label: 'Login',
            onClick: function () {
                dialog.show();
            }
        }, 'dialog');
    }

    addLoginButton(new LoginDialog());
});

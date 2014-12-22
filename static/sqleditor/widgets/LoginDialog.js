define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/ConfirmDialog',
    'dojox/widget/Standby',
    'sqleditor/models/UserModel',
    'sqleditor/widgets/LoginDialogContent',
    'sqleditor/models/SystemModel'
], function (declare, lang, ConfirmDialog, Standby, UserModel, LoginDialogContent, SystemModel) {

    return declare('sqleditor.widgets.LoginDialog', [ConfirmDialog], {

        title: 'Login Required',

        style: 'width:275px',

        onLoginSuccess: null,

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
            this.userModel = new UserModel();
        },

        postCreate: function () {
            this.inherited(arguments);
            this.set('content', new LoginDialogContent({ attachScope: this }));
            this.okButton.onClick = lang.hitch(this, this.okButtonOnClick);
            this.cancelButton.onClick = lang.hitch(this, this.cancelButtonOnClick);
            this.bindOnEnterSubmitForm();
            this.initStandby();
        },

        bindOnEnterSubmitForm: function () {
            var that = this;
            this.textboxPassword.on('keyup', function (e) {
                if (e.which == 13) {
                    that.okButtonOnClick(e);
                }
            });
        },

        initStandby: function () {
            this.standby = new Standby({
                target: this.id
            });

            document.body.appendChild(this.standby.domNode);
        },

        cancelButtonOnClick: function () {
            this.resetForm();
            this.hide();
            return true;
        },

        resetForm: function () {
            this.formErrors.innerHTML = '';
            this.formLogin.reset();
        },

        okButtonOnClick: function (e) {
            var that = this,
                form;

            e.preventDefault();
            this.formErrors.innerHTML =  '';
            if (!this.formLogin.isValid()) {
                return;
            }

            this.standby.show();
            form = this.formLogin.get('value');
            this.userModel.login(form).then(function (response) {
                that.standby.hide();
                if (response.isSuccess) {
                    that.resetForm();
                    that.hide();
                    if (that.onLoginSuccess) {
                        that.onLoginSuccess();
                    }

                    return true;
                }

                that.formErrors.innerHTML = response.message;
                return false;
            });
        }
    });
});

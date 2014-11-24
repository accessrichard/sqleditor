define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/ConfirmDialog',
    'sqleditor/models/UserModel',
    'sqleditor/widgets/LoginDialogContent',
    'sqleditor/models/SystemModel'
], function (declare, lang, ConfirmDialog, UserModel, LoginDialogContent, SystemModel) {

    return declare('sqleditor.widgets.LoginDialog', [ConfirmDialog], {

        title: 'Login Required',

        style: 'width:275px',

        systemModel: null,

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
            this.comboBoxSystems.set('options', this.systemModel);
            this.bindOnEnterSubmitForm();
            this.populateSystemsComboBox();
        },

        populateSystemsComboBox: function () {
            if (!this.systemModel) {
                this.initSystems();
            }

            var model = new SystemModel(),
                that = this;

            model.getModel().then(function (store) {
                that.comboBoxSystems.set('options', store);
                that.comboBoxSystems.set('value', store[0].name);
            });
        },

        bindOnEnterSubmitForm: function () {
            var that = this;
            this.textboxPassword.on('keyup', function (e) {
                if (e.which == 13) {
                    that.okButtonOnClick(e);
                }
            });
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

            form = this.formLogin.get('value');
            this.userModel.login(form).then(function (response) {
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

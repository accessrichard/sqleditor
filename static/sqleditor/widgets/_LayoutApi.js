define([
    'dojo/_base/declare',
    'sqleditor/widgets/_LayoutMixin',
    'sqleditor/widgets/TabPage',
    'sqleditor/models/SystemModel',
    'sqleditor/models/FileManagerStore',
    'sqleditor/widgets/FileManagerDialog',
    'sqleditor/widgets/FileManagerTree',
    'sqleditor/models/FileManagerModel',
    'sqleditor/widgets/LoginDialog',
    'sqleditor/widgets/MessageQueue'
], function (declare, _LayoutMixin, TabPage, SystemModel, random,
             FileManagerStore, FileManagerDialog, FileManagerTree,
             FileManagerModel, LoginDialog) {

    return declare('', [_LayoutMixin], {

        comboboxSystemsOnChange: function () {
        },

        buttonRunClick: function () {
        },

        buttonSaveClick: function () {
        },

        buttonNewClick: function () {
        },

        buttonLinkClick: function () {
        }

    });
});

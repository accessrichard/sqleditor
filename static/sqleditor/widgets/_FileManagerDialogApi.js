define([
    'dojo/_base/declare',
    'dijit/Dialog',
    'sqleditor/widgets/_FileDialogMixin'
], function (declare, Dialog, _FileDialogMixin) {

    return declare([Dialog, _FileDialogMixin], {

        buttonSaveClick: function () {
        },

        buttonDeleteClick: function () {
        },

        dropDownNewFolderClick: function () {
        },

        buttonNewFolderClick: function () {
        },

        textboxFolderNameOnChange: function () {
        },

        textboxFileNameOnChange: function () {
        },

        updateFileDialogPath: function () {
        }

    });
});

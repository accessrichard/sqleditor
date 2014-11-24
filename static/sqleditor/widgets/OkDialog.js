define([
    'dojo/_base/declare',
    'dijit/Dialog',
    'sqleditor/widgets/_OkDialogMixin'
], function (declare, Dialog, _OkDialogMixin) {

    return declare('sqleditor/widgets/OkDialog', [Dialog, _OkDialogMixin], { });

});
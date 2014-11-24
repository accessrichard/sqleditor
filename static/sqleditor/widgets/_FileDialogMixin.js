define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/fileManagerDialog.html',
    'dijit/form/ValidationTextBox',
    'dijit/form/DropDownButton'
], function (declare, _WidgetsInTemplateMixin, fileManagerDialogMarkup) {

    return declare(_WidgetsInTemplateMixin, {

        templateString: fileManagerDialogMarkup,

        parseOnLoad: true
    });
});

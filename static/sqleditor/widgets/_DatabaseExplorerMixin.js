define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/databaseExplorer.html',
    'dijit/form/ComboBox',
    'dijit/form/Select'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    var inherited = [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin];

    return declare('sqleditor.widgets._DatabaseExplorerMixin', inherited, {

        templateString: template

    });
});




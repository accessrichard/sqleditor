define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/layout.html',
    'dijit/layout/ContentPane',
    'dijit/layout/BorderContainer',
    'dijit/layout/TabContainer',
    'dijit/layout/AccordionContainer',
    'dijit/layout/AccordionPane',
    'dijit/form/Select',
    'dijit/form/ComboButton',
    'dijit/form/NumberSpinner',
    'dijit/Menu',
    'dijit/MenuItem',
    'sqleditor/widgets/SearchComboBox'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    var inherited = [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin];

    return declare('sqleditor.widgets._LayoutMixin', inherited, {

        templateString: template

    });
});

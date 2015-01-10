define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/settings.html',
    'dijit/form/Select',
    'dijit/form/NumberSpinner'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    var inherited = [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin];

    return declare('sqleditor.widgets._SettingsMixin', inherited, {

        templateString: template

    });
});




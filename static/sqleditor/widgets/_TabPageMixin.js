define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/tabpage.html',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/layout/TabContainer'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, BorderContainer) {

    var inherited = [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin];

    return declare('sqleditor.widgets._TabPageMixin', inherited, {

        templateString: template,

        closable: true,

        resize: function () {
            this.inherited(arguments);
            this.tabPageBorderContainer.resize();
        }
    });
});

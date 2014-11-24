define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/login.html',
    'dijit/form/ValidationTextBox',
    'dijit/form/Select',
    'dijit/form/Form'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    /**
     * When you mix into a dialog with  `content: template` instead
     * of `templateString: content`, then the dialog renders fine with the
     * login form however the attach points don't mixin.
     * 
     * Therefore in the dialog under postCreate:
     *    set('content', new LoginDialogContent({ attachpoint: this }));
     * in order to render the login form and set the attach points.
     */
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        templateString: template

    });
});
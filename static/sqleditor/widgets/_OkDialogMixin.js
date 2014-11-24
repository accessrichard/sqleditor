define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!/static/sqleditor/widgets/templates/okActionBar.html',
    'dijit/form/Button'
], function(declare, _WidgetsInTemplateMixin, actionBarMarkup) {

    return declare('dijit/_ConfirmDialogMixin', _WidgetsInTemplateMixin, {

        actionBarTemplate: actionBarMarkup,

        buttonOk: "OK",

        _setButtonOkAttr: { node: 'okButton', attribute: 'label' }

    });
});
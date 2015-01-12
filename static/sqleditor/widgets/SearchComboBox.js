define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/form/ComboBox',
    'sqleditor/models/SearchModel'
], function (declare, lang, ComboBox, SearchModel) {

    var model = new SearchModel();

    return declare('sqleditor.widgets.SearchComboBox', [ComboBox], {

        constructor: function (kwArgs) {
            this.store = model.getStore();
            this.searchAttr = 'name';
            this.autocomplete = false;
            this.searchDelay = 400;
            this.queryExpr = '${0}';
            this.labelType = "html";
            this.labelAttr = 'label';
            this.placeHolder = 'Quick Navigation / Search';
            lang.mixin(this, kwArgs);
        },

        onSearch: function () {
            //// The width of the drop-down is set to a fixed width
            //// based on the first search performed.
            //// Override this setting to ensure the width is always
            //// dependent on the query results.
            this.dropDown.domNode.style.width = 'auto';
        }
    });
});
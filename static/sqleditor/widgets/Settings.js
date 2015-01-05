define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'sqleditor/widgets/_SettingsMixin',
    'sqleditor/models/SettingsModel'
], function (declare, lang, _SettingsMixin, SettingsModel) {


    var model = new SettingsModel();

    /**
     *  Populates the select lists from the model.
     */
    function init() {
        this.selectDataFormat.set('options', model.getDataFormatModel());
        this.selectDataFormat.set('value', model.getDataFormat());

        this.selectPaginationType.set('options', model.getPaginationTypeModel());
        this.selectPaginationType.set('value', model.getPaginationType());

        this.selectPageSize.set('options', model.getPageSizeModel());
        this.selectPageSize.set('value', model.getPageSize());

        this.selectKeyBindings.set('options', model.getKeyBindingModel());
        this.selectKeyBindings.set('value', model.getKeyBindingType());
    }

    return declare('sqleditor.widgets.Settings', _SettingsMixin, {

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        postCreate: function () {
            this.inherited(arguments);
            init.call(this);
        },

        selectDataFormatOnChange: function () {
            var value = this.selectDataFormat.get('value');
            model.setDataFormat(value);
        },

        selectPaginationTypeOnChange: function () {
            var value = this.selectPaginationType.get('value');
            model.setPaginationType(value);
        },

        selectPageSizeOnChange: function () {
            var value = this.selectPageSize.get('value');
            model.setPageSize(value);
        },

        selectKeyBindingsOnChange: function () {
            var value = this.selectKeyBindings.get('value');
            model.setKeyBinding(value);
        }
    });
});
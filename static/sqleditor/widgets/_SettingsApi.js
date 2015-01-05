define([
    'sqleditor/widgets/_SettingsMixin',
    'sqleditor/models/SettingsModel'
], function (_SettingsMixin, SettingsModel) {


    var model = new SettingsModel();

    return declare('', _SettingsMixin, {

        selectDataFormatOnChange: function () {
        },

        selectPaginationTypeOnChange: function () {
        },

        selectPageSizeOnChange: function () {
        },

        selectKeyBindingsOnChange: function () {
        }

    });
});

define([
    'dojo/_base/declare',
    'sqleditor/widgets/_DatabaseExplorerMixin'
], function (declare,  _DatabaseExplorerMixin) {

    return declare('', _DatabaseExplorerMixin, {

        selectSystemOnChange: function () {
        },

        selectSchemaOnChange: function () {
        },

        selectTableOnChange: function () {
        }

    });
});
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/store/JsonRest'
], function (declare, lang, JsonRest) {

    return declare('sqleditor.models.SearchModel', null, {

        target: '/search',

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        getStore: function () {
            return new JsonRest({ target: this.target });
        }
    });
});
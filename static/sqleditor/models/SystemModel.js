define([
    'dojo/_base/declare',
    'dojo/request/xhr'
], function (declare, xhr) {

    return declare('sqleditor/models/SystemModel', null, {

        /**
         * Gets a list of database systems for use in a combobox.
         * @returns {Promise->Object} 
         */
        getModel: function () {
            return xhr('/systems', {
                handleAs: 'json'
            }).then(function (data) {
                return data;
            });
        }
    });
});

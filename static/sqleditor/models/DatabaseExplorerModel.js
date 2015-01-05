define([
    'dojo/_base/declare',
    'dojo/store/JsonRest',
    'dojo/request/xhr'
], function (declare, JsonRest, xhr) {

    return declare('sqleditor.models.DatabaseExplorerModel', null, {

        /**
         * Gets a JsonRest store for database schemas.
         * @param {string} system The database system name.
         * @returns {JsonRest} A JsonRest store.
         */
        getSchemaModel: function (system) {
            return new JsonRest({
                target: '/database/' + system
            });
        },

        /**
         * Gets a JsonRest store for database tables.
         * @param {string} system The database system name.
         * @param {string} schema The database schema name.
         * @returns {JsonRest} A JsonRest store.
         */
        getTableModel: function (system, schema) {
            return new JsonRest({
                target: '/database/' + system + '/' + schema
            });
        },

        /**
         * Gets a JsonRest store for database columns.
         * @param {string} system The database system name.
         * @param {string} schema The database schema name.
         * @param {string} table The database table name.
         * @returns {JsonRest} A JsonRest store.
         */
        getColumnModel: function (system, schema, table) {
            return new JsonRest({
                target: '/database/' + system + '/' + schema + '/' + table
            });
        },

        /**
         * Gets a list of database systems for use in a combobox.
         * @returns {Promise->Object} 
         */
        getSystemModel: function () {
            return xhr('/database/systems', {
                handleAs: 'json'
            }).then(function (data) {
                return data;
            });
        }

    });
});
define([
    'dojo/request/xhr',
    'dojo/store/Memory',
    'dojo/_base/declare',
    'sqleditor/models/columnFormatter',
    'dojo/_base/array'
], function (xhr, Memory, declare, formatter, array) {

    return declare('sqleditor/models/GridModel', null, {

        target: 'database/query',

        /**
         * Applies column formatters to the grid columns. The formatters are 
         * returned by the server and applied via 
         * sqleditor/models/columnFormatters.
         * @param {Array} columns The grid columns.
         * @returns {Array} The formatter columns.
         */
        applyFormatters: function (columns) {
            array.forEach(columns, function (column) {
                column.formatter = formatter[column.formatter];
            });

            return columns;
        },

        /**
         * Gets the Grid model.
         * @param {string} sql The sql to run.
         * @param {string} system The database system.
         * @returns {Promise->Object} The dgrid model.
         */
        getModel: function (sql, system, limit) {
            var that = this,
                request = xhr(this.target, {
                    method: 'POST',
                    data: JSON.stringify({ sql: sql, system: system, limit: limit }),
                    handleAs: 'json',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/javascript, application/json'
                    }
                });

            return request.then(function (data) {
                if (!data.data) {
                    return data;
                }

                return {
                    store: new Memory({
                        data: data.data,
                        idProperty: data.idField
                    }),
                    columns: that.applyFormatters(data.columns),
                    count: data.count,
                    elapsed: data.elapsed,
                    message: data.message
                };
            });
        }
    });
});

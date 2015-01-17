define([], function () {

    /**
     * Callback to pad delimit an object.
     * @param {string} field The field to pad delimit.
     * @param {number} len The length to pad the field.
     * @param {string} chr The padding character.
     * @returns {string} A padded string.
     */
    function padDelimit(field, len, chr) {
        var padding = '',
            i;

        for (i = 0; i <= len; i += 1) {
            padding += chr;
        }

        if (!field) {
            return padding.substring(0, len);
        }

        field = field.toString();

        if (field.length > len) {
            return field.substring(0, len - 3) + '...';
        }

        return (field + padding).substring(0, len);
    }

    /**
     * Prints a table vertically similar to the MySql \G command
     * where each column is printed on a seperate line in the form:
     *  column: data
     * @param {object} tbl An object containing { columns: <Array>, data: <Array> }.
     *    Columns can have properties { field, hidden }
     * @returns {string} A text representation of the table.
     */
    function printVerticalText(tbl) {
        var result = '',
            dataLen,
            colLen,
            i,
            y;

        if (!tbl && !tbl.data) {
            return '';
        }

        dataLen = tbl.data.length;
        colLen = tbl.columns.length;
        for (i = 0; i <  dataLen; i += 1) {
            result += '================= Row (' + i + ') =================\n';

            for (y = 0; y < colLen; y += 1) {
                if (!tbl.columns[y].hidden) {
                    result += tbl.columns[y].field + ': ' + tbl.data[i][tbl.columns[y].field] + '\n';
                }
            }

            result += '\n';
        }

        return result;
    }

    /**
     * Prints a javascript table as text.
     * @param {object} tbl An object containing { columns: <Array>, data: <Array> }.
     *    Columns can have properties { field, hidden }         
     * @returns {string} A text representation of the table.
     */
    function toText(tbl, seperator) {
        var result = '',
            dataLen,
            colLen,
            i,
            y;

        if (!tbl && !tbl.data) {
            return '';
        }

        dataLen = tbl.data.length;
        colLen = tbl.columns.length;

        for (y = 0; y < colLen; y += 1) {
            if (tbl.columns[y].hidden) {
                continue;
            }

            result += seperator(tbl.columns[y].field, tbl.columns[y].len);
        }

        result += '\n';

        for (i = 0; i <  dataLen; i += 1) {
            for (y = 0; y < colLen; y += 1) {
                if (tbl.columns[y].hidden) {
                    continue;
                }

                result +=  seperator(tbl.data[i][tbl.columns[y].field], tbl.columns[y].len);
            }

            result += '\n';
        }

        return result;
    }

    /**
     * Adds a len property to each column that holds
     * the max length of the column.
     * @param {object} tbl An object containing { columns: <Array>, data: <Array> }.
     *    Columns can have properties { field, hidden }         
     */
    function addColumnLengths(tbl) {
        var i,
            y,
            record;

        for (y = 0; y < tbl.columns.length; y +=1) {
            tbl.columns[y].len = tbl.columns[y].field.length;
        }

        for (i = 0; i <  tbl.data.length; i += 1) {
            for (y = 0; y < tbl.columns.length; y += 1) {
                if (tbl.columns[y].hidden) {
                    continue;
                }

                record = tbl.data[i][tbl.columns[y].field];
                if (!record) {
                    continue;
                }

                record = record.toString();
                if (record.length > tbl.columns[y].len) {
                    tbl.columns[y].len = record.length;
                }
            }
        }
    }

    return {

        /**
         * Converts an array of objects into pad delimited text.
         * @param {object} tbl An object containing { columns: <Array>, data: <Array> }.
         *    Columns can have properties { field, hidden }         
         * @param {number} maxlen The maximum length to pad each array element property.
         * @param {string} chr The padding character.
         * @returns {string} The pad delimited array.
         */
        padDelimit: function (tbl, maxlen, chr) {
            var spacerLength = 3;
            addColumnLengths(tbl);
            return toText(tbl, function (str, colLen) {
                return padDelimit(str, Math.min(colLen + spacerLength, maxlen), chr);
            });
        },

        /**
         * Converts an array of objects into character delimited text.
         * @param {object} tbl An object containing { columns: <Array>, data: <Array> }.
         *    Columns can have properties { field, hidden }                  
         * @param {string} chr The delimiting character.
         * @returns {string} The character delimited array.
         */
        charDelimit: function (tbl, chr) {
            return toText(tbl, function (str) {
                return str + chr;
            });
        },

        /**
         * Converts an array of objects into to where each object property
         * is listed as a new row in the format: key: value.
         * This is similar to MySql's \G command delimiter
         * @param {object} tbl An object containing { columns: <Array>, data: <Array> }.
         *    Columns can have properties { field, hidden }                  
         * @returns {string} The array where each elements properties are printed
         * in a new line.
         */
        vertical: function (data) {
            return printVerticalText(data);
        }
    };
});
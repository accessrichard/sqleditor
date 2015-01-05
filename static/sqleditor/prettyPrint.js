define([
    'dojo/_base/lang'
], function (lang) {

    /**
     * Callback to print the properties (columns) of an object in the format
     * key: value \n
     * @param {object} obj The object.
     * @returns {string} A string representation of object properties.
     */
    function printRowColumns(obj) {
        var prop,
            result = '';

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result +=  prop + ':' + obj[prop] + '\n';
            }
        }

        return result;
    }

    /**
     * Callback to print a row spacer inbetween each item in the array (row).
     * @param {number} num The row number.
     * @returns {string} A string spacer.
     */
    function printRowSpacer(num) {
        return '================ (Row ' + num + ') =================\n';
    }

    /**
     * Callback to print a header for the pretty printed array.
     * @param {object} obj The object in which property names will be printed.
     * @param {function} seperator A callback which adds a delimiter inbetween 
     * property names.
     * @returns {string} The header for the pretty printed array.
     */
    function printHeader(obj, seperator) {
        var prop,
            result = '';

        for (prop in obj) {
            if (!obj.hasOwnProperty(prop)) {
                continue;
            }

            result += seperator ? seperator(prop) : prop;
        }

        return result;
    }

    /**
     * Callback to pad delimit an object.
     * @param {object} obj The object(string) to pad delimit.
     * @param {number} len The length to pad the object.
     * @param {string} chr The padding character.
     * @returns {string} A padded string.
     */
    function padDelimit(obj, len, chr) {
        var str,
            padding = '',
            i = 0;

        for (i; i <= len; i++) {
            padding += chr;
        }

        if (!obj) {
            return padding.substring(0, len);
        }

        str = obj.toString();
        if (str.length > len) {
            return str.substring(0, len - 3) + '...';
        }

        return (str + padding).substring(0, len);
    }

    /**
     * Callback to character delimit an object.
     * @param {object} obj The object to character delimit.
     * @param {string} chr The delimiter character.
     * @returns {string} The delimited string.
     */
    function charDelimit(obj, chr) {
        if (!obj) {
            return chr;
        }

        return obj.toString() + chr;
    }

    /**
     * Converts and array of objects into text.
     * Should be refactored.
     * @param {array} arr The array.
     * @param {object} options The text conversion options which contains:
     *              rowHeader function(listIndex)): callback to print for each row.
     *              row function(object): callback to print each column.
     *              header function(object, seperator(function): callback to print row header.
     *              seperator function(obj): Callback to seperate each column.
     * @returns {string} The array to text.
     */
    function toText(arr, options) {
        var i = 0,
            defaultFormatters,
            result = '';

        if (!arr.length) {
            return '';
        }

        options = options || {};
        defaultFormatters = {
            rowHeader: printRowSpacer,
            row: printRowColumns,
            header: printHeader,
            seperator: function (obj) {
                return obj;
            }
        };

        options = lang.mixin(defaultFormatters, options);
        result += options.header(arr[0]);
        for (i; i < arr.length; i += 1) {
            result += options.rowHeader(i);
            result += options.row(arr[i]);
        }

        return result;
    }

    /**
     * Converts an array to text where each array
     * item is printed in a new row.
     * @param {array} arr The array.
     * @returns {string} The array conveted into text.
     */
    function toVerticalText(arr) {
        return toText(arr, {
            header: function () {
                return '';
            }
        });
    }

    /**
     * Converts an array to text where each column is seperated
     * by a delimiter.
     * @param {array} arr The array.
     * @param {function} seperator The callback to delimit the array element.
     * @returns {string} The array conveted into text.
     */
    function toHorizontalText(arr, seperator) {
        return toText(arr, {
            row: function (obj) {
                var result = '',
                    prop;

                for (prop in obj) {
                    if (!obj.hasOwnProperty(prop)) {
                        continue;
                    }

                    result += seperator ? seperator(obj[prop]) : obj[prop];
                }

                result += '\n';
                return result;
            },

            rowHeader: function () {
                return '';
            },

            header: function (obj) {
                return printHeader(obj, seperator) + '\n';
            }
        });
    }

    return {

        /**
         * Converts an array of objects into pad delimited text.
         * @param {array} arr The array.
         * @param {number} len The length to pad each array element property.
         * @param {string} chr The padding character.
         * @returns {string} The pad delimited array.
         */
        padDelimit: function (arr, len, chr) {
            return toHorizontalText(arr, function (obj) {
                return padDelimit(obj, len, chr);
            });
        },

        /**
         * Converts an array of objects into character delimited text.
         * @param {array} arr The array.
         * @param {string} chr The delimiting character.
         * @returns {string} The character delimited array.
         */
        charDelimit: function (arr, chr) {
            return toHorizontalText(arr, function (obj) {
                return charDelimit(obj, chr);
            });
        },

        /**
         * Converts an array of objects into to where each object property
         * is listed as a new row in the format: key: value.
         * This is similar to MySql's \G command delimiter
         * @param {array} arr The array of objects.
         * @returns {string} The array where each elements properties are printed
         * in a new line.
         */
        vertical: function (arr) {
            return toVerticalText(arr);
        }
    };
});
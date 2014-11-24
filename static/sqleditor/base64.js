define([
    'dojo/_base/array',
    'dojox/encoding/base64'
], function (array, base64) {

    function stringToBytes(str) {
        var b = [],
            i = 0;

        for (i; i < str.length; i += 1) {
            b.push(str.charCodeAt(i));
        }

        return b;
    }

    function bytesToString(b) {
        var s = [];
        array.forEach(b, function (charCode) {
            s.push(String.fromCharCode(charCode));
        });

        return s.join('');
    }

    return {

        /**
         * Base64 encodes a string. Uses window.btoa if present, otherwise
         * defaults to dojo implementation for IE8/9.
         * @param {String} str The string to encode.
         * @returns {String} The encoded string.
         */
        encode: function (str) {
            if (window && window.btoa) {
                return window.btoa(str);
            }

            return base64.encode(stringToBytes(str));
        },

        /**
         * Decodes a string encoded in base64.
         * @param {String} str The string to decode.
         * @returns {String} The decoded string.
         */
        decode: function (str) {
            if (window && window.atob) {
                return window.atob(str);
            }

            return bytesToString(base64.decode(str));
        }
    };
});
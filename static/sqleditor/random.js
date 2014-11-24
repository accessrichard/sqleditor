define([], function () {

    var crypto = window.crypto || window.msCrypto;

    return {

        /**
         * Gets a random decimal between 0 and 1. Uses window.crypto or 
         * msCrypto if exists to generate the random value. 
         * @returns {Number} A random number.
         */
        getRandom: function () {
            var rand,
                offset;

            if (crypto) {
                rand = crypto.getRandomValues(new Uint32Array(1))[0];
                /// Offset will shift the random integers
                /// by {x} decimal places.
                /// 123456 -> .123456 or .23456 or .3456
                offset = Math.floor(Math.random() * 5);
                return rand / Math.pow(10, rand.toString().length - offset) % 1;
            }

            return Math.random();
        },

        /**
         * Generates a random number in a range.
         * @param {Number} min The min range.
         * @param {Number} max The max rang
         * @returns {Number} A random number between min and max. 
         */
        getRandomInRange: function (min, max) {
            var getRandom = func || this.getRandom;
            return Math.floor(getRandom() * (max - min + 1) + min);
        },

        /**
         * Generates a random string.
         * @param {Number} length The length of the string to generate.
         * @returns {String} A random n character string.
         */
        getRandomString: function (length) {
            var str = '',
                i;

            for (i = 0; i < length; i += 1) {
                str += String.fromCharCode(this.getRandomInRange(32, 126));
            }

            return str;
        }
    };
});
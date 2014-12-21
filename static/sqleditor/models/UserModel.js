define([
    'dojo/_base/declare',
    'dojo/request/xhr',
    'dojo/cookie',
    'sqleditor/random'
], function (declare, xhr, cookie, random) {

    return declare('sqleditor.models.UserModel', null, {

        cookieName: 'sqleditor',

        /**
         * Creates a cookie with a random string.
         * This is used to salt a server side encryption key
         * in order to store users database credentials on a 
         * server side session.
         */
        setCookie: function () {
            var rand = random.getRandomString(20);
            //// remove illegal cookie chars
            rand = rand.replace(';', '').replace(' ', '').replace(",", '');
            cookie("sqleditor", rand);
        },

        /**
         * Getter for the cookie.
         * @returns {string} The cookie value.
         */
        getCookie: function () {
            return cookie(this.cookieName);
        },

        /**
         * Logs a user into a database system.
         * This does not actually open a connection to
         * the database. It only tests a database connection
         * against the users credentials and stores them off
         * in the server session encrypted with the cookie 
         * string and server key for use later. 
         * @param {dijit/Form} form The login form.
         * @returns {Promise->Object} An object containing property
         * isLoginSuccess and messages containing database login failure
         * messages.
         */
        login: function (form) {
            if (!cookie(this.cookieName)) {
                this.setCookie();
            }

            return xhr('/user/login', {
                method: 'POST',
                data: form,
                handleAs: 'json'
            });
        },

        /**
         * Logs a user out by deleting the cookie
         * and clearing the server side session.
         * @returns {Promise->Boolean} Whether the logout was successful.
         */
        logout: function () {
            cookie(this.cookieName, '', { expire: -1 });

            return xhr('/user/logout', {
                method: 'POST',
                handleAs: 'json'
            }).then(function (data) {
                return data.isSuccess;
            });
        }
    });
});

define([
    'dojo/request/xhr',
    'dojo/store/Memory',
    'dojo/_base/lang',
    'dojo/store/util/QueryResults',
    'dojo/_base/declare'
], function (xhr, Memory, lang, QueryResults, declare) {

    var memory = new Memory(),
        xhrCache;

    return declare('sqleditor/models/FileManagerStore', null, {

        idProperty: 'id',

        target: '/io',

        headers: {},

        accepts: 'application/javascript, application/json',

        rootQuery: {},

        queryEngine: null,

        /**
         * A combination of a Cache, JsonRest, and Memory store.
         *
         * xhr -> Handles populating the Memory store and 
         * get/delete/put/add requests.
         * 
         * Memory -> Handles query requests
         *
         * All succesful xhr POST/PUT/DELETE requests are propogated
         * to the Memory store.
         * 
         * Methods putItem and addItem are present in order
         * to bypass the observable functionality of the Tree.
         * For example, for each PUT request, we do not want to notify
         * the tree. 
         * @param {Object} kwArgs Keyword Arguments
         * @constructor
         */
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);

            this.queryEngine = memory.queryEngine;

            this.getTarget = function (id) {
                var target = this.target;
                if (target.charAt(target.length - 1) === '/') {
                    target += id;
                } else {
                    target += '/' + id;
                }

                return target;
            };

        },

        /**
         * Gets the memory store cache. If the cache has not been initialized
         * will query the server and initialize it.
         * @returns {Promise->Memory} A memory store.
         */
        getCache: function () {
            var that = this;
            if (!xhrCache) {
                xhrCache = xhr(this.target, {
                    handleAs: 'json'
                });
            }

            return xhrCache.then(function (data) {
                if (!memory.data.length) {
                    memory.setData(data);
                    that.rootQuery = { id: memory.data[0].id };
                }

                return memory;
            });
        },

        /**
         * Clears the cache.
         */
        clearCache: function () {
            xhrCache = null;
        },

        /**
         * Gets children of a tree node.
         * @param {Object} object A tree node.
         * @returns {Promise->Array} The children of the tree node.
         */
        getChildren: function (object) {
            return this.query({ parentId: object.id });
        },

        /**
         * Gets the id property of an object.
         * @param {Object} object The object containing an id property.
         * @returns {string || number} The id property of an object.
         */
        getIdentity: function (object) {
            return object[this.idProperty];
        },

        /**
         * Gets file or folder contents.
         * If the id is for a file, returns the contents of the file.
         * If the id is for a folder, returns the files and folders in the
         * folder.
         * 
         * @param {string} id The base64 encoded path of the file or folder.
         * @param {object} options The XHR options.
         * @returns {Promise->string || array} The file contents or directory listing 
         * of the folder.
         */
        get: function (id, options) {
            options = options || {};
            return xhr(this.getTarget(id), {
                handleAs: 'json',
                headers: lang.mixin({}, this.headers, options.headers)
            });
        },

        /**
         * Adds an item to the store.
         * @param {Object} object The item to add.
         * @param {Object} options The XHR options
         * @returns {Promise->string} The id added.
         */
        add: function (object, options) {
            if (options && options.observe) {
                return object;
            }

            return this.put(object, options);
        },

        /**
         * Queries the tree store.
         * @param {Object} query The query.
         * @param {Object} options The 
         * @returns {Promise->QueryResult} The dojo store QueryResults.
         */
        query: function (query, options) {
            return new QueryResults(this.getCache().then(function (cache) {
                return cache.query(query, options);
            }));
        },

        /**
         * Removes an item from the store.
         * @param {string} id The id to remove.
         * @param {Object} options The XHR options.
         * @returns {Promise} 
         */
        remove: function (id, options) {
            var that = this,
                request;

            options = options || {};
            request = xhr(this.getTarget(id), {
                method: 'DELETE',
                headers: lang.mixin({}, this.headers, options.headers)
            });

            return request.then(function () {
                return that.getCache().then(function (cache) {
                    return cache.remove(id);
                });
            }, function () {
                return request;
            });
        },

        /**
         * Performs an XHR put to modify an item
         * in the store.
         * @param {Object} object The item to add.
         * @param {Object} options The XHR options.
         * @returns {Promise->Object} The object added.
         */
        put: function (object, options) {
            options = options || {};
            options.isFromPut = true;
            return this.putProxy(object, options);
        },

        /**
         * Same as this.add but not observed and therefore does not change the
         * dijit tree.
         * @param {Object} object The item to add.
         * @param {Object} options The XHR options.
         * @returns {Promise->Object} The item added.
         */
        addItem: function (object, options) {
            return this.putProxy(object, options);
        },

        /**
         * Same as this.put but not observed and therefore does not change the
         * dijit tree.
         * @param {Object} object The item to add.
         * @param {Object} options The XHR options.
         * @returns {Promise->Object} The item added.
         */
        putItem: function (object, options) {
            options = options || {};
            options.isFromPut = true;
            return this.putProxy(object, options);
        },

        /**
         * Adds a file or folder. When a tree store is wrapped in an observable
         * any store.add(data) calls are intercepted and dispatched to 
         * observers. In the case of a POST operation, data wont have an id as 
         * the server creates it. Unfortunately, the Tree._itemsNodeMap gets 
         * notified of the pre-server data without the id.
         * 
         * This method willn post data to the server and then call 
         * store.add(data, options['observe'] = true)) so that store.add
         * can be observed with the id, and then suppressed.
         * @param {} object The item to add.
         * @param {} options The XHR options.
         * @returns {} The added file.
         */
        putProxy: function (object, options) {
            var that = this,
                method = object.isDir || !object.id ? 'POST' : 'PUT',
                url = method === 'POST' ? this.target : this.getTarget(object.id),
                request;

            options = options || {};
            request = xhr(url, {
                method: method,
                data: JSON.stringify(object),
                handleAs: 'json',
                headers: lang.mixin({
                    'Content-Type': 'application/json',
                    Accept: this.accepts
                }, this.headers, options.headers)
            });

            return request.then(function (data) {
                return that.getCache().then(function (cache) {
                    var result = cache.put(data);
                    if (!options.isFromPut) {
                        options.observe = true;
                        that.add(data, options);
                    }

                    return result;
                });
            }, function () {
                return request;
            });
        }
    });
});

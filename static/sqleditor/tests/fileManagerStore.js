define([
    'intern!object',
    'intern/chai!assert',
    'sqleditor/models/FileManagerStore',
    'sqleditor/base64'
], function (registerSuite, assert, FileManagerStore, base64) {

    var store;

    registerSuite({

        name: 'FileManagerStore',

        setup: function () {
            store = new FileManagerStore();
        },

        '.query .get': function () {
            return store.query({}).then(function (data) {
                var root = data[0];
                return store.getCache().then(function (cache) {
                    assert.isTrue(root.id === cache.data[0].id);
                });
            });
        },

        '.query .add .remove': function () {
            return store.query({}).then(function (data) {
                var root = data[0],
                    node = {
                        parentId: root.id,
                        name: "test" + new Date().getMilliseconds().toString() + ".sql",
                        isDir: false
                    };

                return store.add(node).then(function (added) {
                    var path = base64.decode(node.parentId),
                        id = base64.encode(path + "/" + node.name);

                    assert.isTrue(id === added);
                    return store.remove(added).then(function (removed) {
                        assert.isTrue(removed);
                    });
                });
            });
        }
    });
});

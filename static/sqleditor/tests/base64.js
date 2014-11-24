define([
    'intern!object',
    'intern/chai!assert',
    'sqleditor/base64'
], function (registerSuite, assert, base64) {
    registerSuite({
        name: 'Base 64',

        '.encode .decode': function () {
            var str = 'hello world',
                encode = base64.encode(str),
                decode = base64.decode(encode);
            assert.strictEqual(str, decode, 'encode and decode should produce same result.');
        }
    });
});

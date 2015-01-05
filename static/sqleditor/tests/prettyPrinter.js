define([
    'intern!object',
    'intern/chai!assert',
    'sqleditor/prettyPrint'
], function (registerSuite, assert, prettyPrint) {

    var arr = [
        { id: 1, text: 'one' },
        { id: 2, text: 'two' },
        { id: 3, text: 'three' },
        { id: 4, text: 'four' }
    ];


    registerSuite({
        name: 'PrettyPrinter',

        '.vertical': function () {
            var text = prettyPrint.vertical(arr),
                result = '';

            result += '================ (Row 0) =================\n';
            result += 'id:1\n';
            result += 'text:one\n';
            result += '================ (Row 1) =================\n';
            result += 'id:2\n';
            result += 'text:two\n';
            result += '================ (Row 2) =================\n';
            result += 'id:3\n';
            result += 'text:three\n';
            result += '================ (Row 3) =================\n';
            result += 'id:4\n';
            result += 'text:four\n';

            assert.strictEqual(text, result, 'Pretty Print should match sample output');
        },

        '.charDelimit': function () {
            var text = prettyPrint.charDelimit(arr, '|'),
                result = '';

            result += 'id|text|\n';
            result += '1|one|\n';
            result += '2|two|\n';
            result += '3|three|\n';
            result += '4|four|\n';

            assert.strictEqual(text, result, 'Pretty Print should match sample output');
        },

        '.padDelimit': function () {
            var text = prettyPrint.padDelimit(arr, 10,  ' '),
                result = '';

            result += 'id        text      \n';
            result += '1         one       \n';
            result += '2         two       \n';
            result += '3         three     \n';
            result += '4         four      \n';

            assert.strictEqual(text, result, 'Pretty Print should match sample output');
        }
    });
});

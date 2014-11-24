define([
    'intern!object',
    'intern/chai!assert',
    'sqleditor/random'
], function (registerSuite, assert, random) {
    registerSuite({
        name: 'Random',

        '.getRandom': function () {
            var rand = random.getRandom();
            assert.isTrue(rand >= 0 && rand < 1);
        },

        '.getRandomInRange': function () {
            var rand = random.getRandomInRange(5, 10);
            assert.isTrue(rand >= 5 && rand <= 10);
        },

        '.getRandomString': function() {
            var rand = random.getRandomString(10);
            assert.isTrue(rand.length === 10);
        }
    });
});

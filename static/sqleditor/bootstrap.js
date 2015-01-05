require([
    'dojo/parser',
    'dojo/ready'
], function (parser, ready) {

    //// Display Loading

    require(['sqleditor/widgets/SqlEditor']);

    ready(function () {
        parser.parse().then(function () {
            //// Hide loading
        });
    });
});

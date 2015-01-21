require([
    'dojo/parser',
    'dojo/ready'
], function (parser, ready) {

    //// Display Loading

    require(['sqleditor/widgets/SqlEditor']);

    function onBeforeUnloadPromptUser() {
        window.onbeforeunload = function () {
            return "";
        };
    }

    ready(function () {
        parser.parse().then(function () {
            //// Hide loading
            onBeforeUnloadPromptUser();
        });
    });
});

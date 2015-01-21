require([
    'dojo/parser',
    'dojo/ready'
], function (parser, ready) {

    //// Display Loading

    require(['sqleditor/widgets/SqlEditor']);

    function onBeforeUnloadPromptUser() {
        window.onbeforeunload = function () {
            return "Are you sure you want to leave?";
        };
    }

    ready(function () {
        parser.parse().then(function () {
            //// Hide loading
            onBeforeUnloadPromptUser();
        });
    });
});

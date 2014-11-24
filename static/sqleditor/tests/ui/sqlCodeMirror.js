require([
    'sqleditor/widgets/SqlCodeMirror',
    'dojo/parser',
    'dojo/ready'
], function (SqlCodeMirror, parser, ready) {

    ready(function () {
        parser.parse();
    });

});

require([
    'dojox/widget/Standby',
    'dojo/parser',
    'dojo/ready'
], function (Standby, parser, ready) {

    var standby;
    ready(function () {
        standby = new Standby({
            target : document.body
        });
        
        document.body.appendChild(standby.domNode);
        standby.show();
    });

    require(['sqleditor/widgets/SqlEditor']);

    ready(function () {
        parser.parse().then(function () {
            standby.hide();
            standby.destroy();
        });
    });
});

define([
    'dojo/_base/declare',
    'dojo/parser',
    'sqleditor/widgets/TabPage',
    'dojo/ready'
], function(declare, parser,_TabPageApi, ready, TabPage) {

    ready(function () {
        parser.parse();
    });

    return declare('sqleditor.tests.ui.tabpage', [_TabPageApi], {

    });
});

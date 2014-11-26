define([
    'dojo/_base/window',
    'dojo/_base/declare',
    'dojo/parser',
    'sqleditor/widgets/TabPage',
    'sqleditor/widgets/_LayoutMixin',
    'sqleditor/widgets/_TabPageApi',
    'dojo/ready',
    'sqleditor/widgets/MessageQueue'
], function(win, declare, parser, TabPage, _LayoutMixin, _TabPageApi, ready, MessageQueue) {

    ready(function () {
        parser.parse();
    });

    return declare('sqleditor.tests.ui.tabpage', [_LayoutMixin, _TabPageApi], {

        buttonNewClick: function () {
            var page = new TabPage();
            page.set('title', 'hello');
            this.tabContainer.addChild(page);
            page.startup();
            this.tabContainer.selectChild(page);
        }
    });
});

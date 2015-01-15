define([
    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/query'
], function (declare, domClass, query) {

    return declare('sqleditor.widgets.FullScreenGrid', null, {

        bindKeys: function () {
            var that = this;

            this.on('keypress', function (e) {
                if (e.key === 'F11') {
                    e.preventDefault();
                    domClass.toggle('queryResults', 'fullscreen');
                    query('#layoutBorderContainer').style({
                        height: domClass.contains("queryResults", "fullscreen") ? 0 : ''
                    });

                    that.resize();
                }
            });
        }
    });
});
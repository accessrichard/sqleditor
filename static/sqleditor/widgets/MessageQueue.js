define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/fx',
    'dojo/_base/fx'
], function (declare, lang, _WidgetBase, _TemplatedMixin, fx, baseFx) {

    var chain;

    return declare('sqleditor.widgets.MessageQueue', [_WidgetBase, _TemplatedMixin], {

        text: 'Sql Editor',

        messages: [],

        templateString: '<span>Sql Editor</span>',

        startColor: '#250517',

        endColor: '#bdbcbc',

        /**
         * Fades in and out any messages in the message queue
         * until the queue is empty.
         * Useful to indicate things like a save complete however
         * is a bad user design.
         */
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        postCreate: function () {
            this.inherited(arguments);
            this.initMessages();
        },

        initMessages: function () {
            var fadeArgs,
                fadeIn,
                fadeOut;

            fadeArgs = {
                node: this.domNode,
                duration: 500,
                onEnd: lang.hitch(this, function () {
                    var opacity = parseInt(this.domNode.style.opacity, 10);
                    if (this.messages.length && !opacity) {
                        this.domNode.innerHTML = this.messages.shift();
                        this.domNode.style.color = this.startColor;
                        fadeIn.play();
                    } else if (!opacity &&
                               this.domNode.innerHTML !== this.text) {
                        this.domNode.innerHTML = this.text;
                        this.domNode.style.color = this.endColor;
                        fadeIn.play();
                    } else if (this.domNode.innerHTML !== this.text ||
                               this.messages.length) {
                        fadeOut.play();
                    }
                })
            };

            fadeIn = baseFx.fadeIn(fadeArgs);
            fadeOut = baseFx.fadeOut(fadeArgs);
            chain = fx.chain([fadeOut, fadeIn]);
        },

        addMessage: function (text) {
            this.messages.push(text);
            if (chain.status() === "stopped") {
                chain.play();
            }
        }
    });
});
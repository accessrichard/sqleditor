define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/_WidgetBase',
    'dojo/query',
    'codemirror/lib/codemirror',
    'sqleditor/models/SettingsModel',
    'codemirror/mode/sql/sql',
    'codemirror/addon/search/search',
    'codemirror/addon/search/searchcursor',
    'codemirror/addon/dialog/dialog',
    'codemirror/keymap/emacs',
    'codemirror/addon/edit/matchbrackets'
], function (declare, lang, _WidgetBase, query, CodeMirror, SettingsModel) {

    var settings = new SettingsModel();

    return declare('sqleditor.widgets.SqlCodeMirror', [_WidgetBase], {

        baseClass: 'sqlCodeMirror',

        /**
         * The file id.
         */
        file: null,

        mode: 'text/x-sql',

        _setFileAttr: function (name) {
            this._set('file', name);
        },

        _setContentAttr: function (content) {
            if (!this.codeEditor) {
                /// Before the CodeMirror is initialized if content
                /// was requested to be placed in the editor save 
                /// it off until the editor is initialized and then
                /// populate it.
                this._set('_content', content);
                return;
            }

            this.codeEditor.setValue(content);
        },

        _getValueAttr: function () {
            return this.codeEditor.getValue();
        },

        postCreate: function () {
            this.inherited(arguments);
            var options = this.options || {};
            this.options = lang.mixin({
                lineNumbers: true,
                matchBrackets: true,
                smartIndent: true,
                keyMap: this.getKeyBindingSetting(),
                extraKeys: {
                    Enter: function (cm) {
                        cm.replaceSelection('\n', 'end');
                    }
                },
                mode: this.mode
            }, options);
        },

        getKeyBindingSetting: function () {
            return settings.getKeyBindingType();
        },

        applyStyles: function () {
            var value = settings.getFontSize();
            query(".CodeMirror").style({
                fontSize: value + 'em'
            });
        },

        startup: function () {
            this.inherited(arguments);
            this.codeEditor = CodeMirror.fromTextArea(this.srcNodeRef, this.options);
            this.codeEditor.setSize('100%', '100%');
            var content = this.get('_content');
            if (content) {
                this.codeEditor.setValue(content);
                this.set('_content', null);
            }

            this.applyStyles();
        }
    });
});


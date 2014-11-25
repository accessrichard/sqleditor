define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/_WidgetBase',
    'codemirror/lib/codemirror',
    'codemirror/mode/sql/sql',
    'codemirror/addon/search/search',
    'codemirror/addon/search/searchcursor',
    'codemirror/addon/dialog/dialog',
    'codemirror/addon/edit/matchbrackets'
], function (declare, lang, _WidgetBase, CodeMirror) {

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
                extraKeys: {
                    Enter: function (cm) {
                        cm.replaceSelection('\n', 'end');
                    }
                },
                mode: this.mode
            }, options);
        },

        startup: function () {
            this.inherited(arguments);
            this.codeEditor = CodeMirror.fromTextArea(this.srcNodeRef, this.options);
            this.codeEditor.setSize('100%', '100%');
            var content = this._get('_content');
            if (content) {
                this.codeEditor.setValue(content);
                this._set('_content', null);
            }
        }
    });
});


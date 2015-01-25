/*jslint todo: true */
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
    'codemirror/addon/edit/matchbrackets',
    'codemirror/addon/display/fullscreen',
    'codemirror/keymap/emacs'
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
            var options = this.options || {},
                that = this;

            this.options = lang.mixin({
                lineNumbers: true,
                matchBrackets: true,
                keyMap: this.getKeyBindingSetting(),
                extraKeys: {
                    //// Use regular tabs for emacs since the sql
                    //// auto indentation does not indent kewords.
                    Tab: function (cm) {
                        var spaces = new Array(cm.options.tabSize + 1).join(" ");
                        cm.replaceSelection(spaces);
                    },
                    F11: function () {
                        that.toggleFullScreen();
                    }
                },
                mode: this.mode
            }, options);
        },

        toggleFullScreen: function () {
            var fullscreen = this.codeEditor.getOption('fullScreen');
            this.codeEditor.setOption('fullScreen', !fullscreen);
            this.setBorderContainerVisibility(fullscreen);
        },

        /**
         * Dijit bordercontainer uses absolute positioning and
         * therefore the z-index isn't effective.
         * Need to hack the BorderContainer (tabs, file explorer etc.) in order
         * to get them out of the viewport by setting their height to 0.
         * 
         * TODO: A dependency should not exist between BorderContainer and 
         * this class.
         * @param {Boolean} isVisible
         */
        setBorderContainerVisibility: function (isVisible) {
            query('#layoutBorderContainer').style({
                height: isVisible ? '' : 0
            });
        },

        getKeyBindingSetting: function () {
            return settings.getKeyBindingType();
        },

        /**
         * Applies settings from the sql editor.
         * TODO: A dependency shouldn't exist between
         * settings and this class.
         */
        applyStyles: function () {
            var fontSize = settings.getFontSize(),
                fontFamily = settings.getFontFamily();

            this.codeEditor.setOption('theme', settings.getEditorTheme());

            query(".CodeMirror").style({
                fontSize: fontSize + 'em',
                fontFamily: fontFamily
            });
        },

        startup: function () {
            this.inherited(arguments);
            var content = this.get('_content'),
                that = this;

            this.codeEditor = CodeMirror.fromTextArea(this.srcNodeRef, this.options);
            this.codeEditor.setSize('100%', '100%');

            if (content) {
                this.codeEditor.setValue(content);
                this.set('_content', null);
            }

            this.applyStyles();
        }
    });
});


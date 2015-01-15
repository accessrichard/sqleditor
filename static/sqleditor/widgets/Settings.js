define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dijit/registry',
    'sqleditor/widgets/_SettingsMixin',
    'sqleditor/models/SettingsModel'
], function (declare, lang, query, registry, _SettingsMixin, SettingsModel) {


    var model = new SettingsModel();

    /**
     *  Populates default values on the settings form from the model.
     */
    function init() {
        this.selectDataFormat.set('options', model.getDataFormatModel());
        this.selectDataFormat.set('value', model.getDataFormat());

        this.selectPaginationType.set('options', model.getPaginationTypeModel());
        this.selectPaginationType.set('value', model.getPaginationType());

        this.selectPageSize.set('options', model.getPageSizeModel());
        this.selectPageSize.set('value', model.getPageSize());

        this.selectKeyBindings.set('options', model.getKeyBindingModel());
        this.selectKeyBindings.set('value', model.getKeyBindingType());

        this.numberSpinnerFontSize.set('value', model.getFontSize());

        this.selectFontFamily.set('options', model.getFontFamilyModel());
        this.selectFontFamily.set('value', model.getFontFamily());

        this.selectEditorTheme.set('options', model.getEditorThemeModel());
        this.selectEditorTheme.set('value', model.getEditorTheme());
    }

    /**
     * Applies a callback to the editor on every tab page.
     * @callback callback
     * @param codemirror The codemirror instance.
     */
    function codeEditorForEach(callback) {
        var tabs = registry.byId('tabContainer').tablist.getChildren(),
            page,
            i;

        for (i = 0; i < tabs.length; i += 1) {
            page = tabs[i].page;
            if (page && page.editor && page.editor.codeEditor) {
                callback(page.editor.codeEditor);
            }
        }
    }

    return declare('sqleditor.widgets.Settings', _SettingsMixin, {

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        postCreate: function () {
            this.inherited(arguments);
            init.call(this);
        },

        selectDataFormatOnChange: function () {
            var value = this.selectDataFormat.get('value');
            model.setDataFormat(value);
        },

        selectPaginationTypeOnChange: function () {
            var value = this.selectPaginationType.get('value');
            model.setPaginationType(value);
        },

        selectPageSizeOnChange: function () {
            var value = this.selectPageSize.get('value');
            model.setPageSize(value);
        },

        selectKeyBindingsOnChange: function () {
            var value = this.selectKeyBindings.get('value');
            model.setKeyBinding(value);
            codeEditorForEach(function (codeEditor) {
                codeEditor.setOption('keyMap', value);
            });
        },

        numberSpinnerFontSizeOnChange: function () {
            var value = this.numberSpinnerFontSize.get('value'),
                tabContainer;

            model.setFontSize(value);
            query(".CodeMirror").style({
                fontSize: value + 'em'
            });

            //// After font size changes, tell the editor to refresh
            //// in order to keep the cursor size in line with the font.
            //// In addition, refresh must be called at the time of tab 
            //// selection for any other tabs preset.
            tabContainer =  registry.byId('tabContainer');
            if (tabContainer && tabContainer.selectedChildWidget) {
                tabContainer.selectedChildWidget.editor.codeEditor.refresh();
            }
        },

        selectFontFamilyOnChange: function () {
            var value = this.selectFontFamily.get('value');
            model.setFontFamily(value);
            query(".CodeMirror").style({
                fontFamily: value
            });
        },

        selectEditorThemeOnChange: function () {
            var value = this.selectEditorTheme.get('value');
            model.setEditorTheme(value);
            codeEditorForEach(function (codeEditor) {
                codeEditor.setOption('theme', value);
            });
        }
    });
});

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/cookie'
], function (declare, lang, cookie) {

    return declare('sqleditor.models.SettingsModel', null, {

        cookieName: 'sqlEditorSettings',

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
            if (!cookie(this.cookieName)){
                this.initCookieDefaults();
            }
        },

        initCookieDefaults: function () {
            var defaults = {
                dataFormat: 'Grid',
                paginationType: 'Paginated',
                pageSize: '15',
                keyBinding: 'Default',
                fontSize: '1.3em'
            };

            cookie(this.cookieName, JSON.stringify(defaults));
        },

        getDataFormatModel: function () {
            return [
                { label: 'Grid', value: 'grid' },
                { label: 'Text', value: 'text' },
                { label: 'Vertical', value: 'vertical' },
                { label: 'Comma Delimited', value: 'commaDelimited' },
                { label: 'Tab Delimited', value: 'tabDelimited' },
                { label: 'Pipe Delimited', value: 'pipeDelimited' }
            ];
        },

        getDataFormat: function () {
            return JSON.parse(cookie(this.cookieName)).outputType;
        },

        setDataFormat: function (format) {
            var obj = JSON.parse(cookie(this.cookieName));
            obj.outputType = format;
            cookie(this.cookieName, JSON.stringify(obj));
        },

        getPaginationTypeModel: function () {
            return [
                { label: 'Paginated', value: 'paginated' },
                { label: 'Virtual Scroll (unstable)', value: 'virtual' }
            ];
        },

        getPaginationType: function () {
            return JSON.parse(cookie(this.cookieName)).paginationType;
        },

        setPaginationType: function (paginationType) {
            var obj = JSON.parse(cookie(this.cookieName));
            obj.paginationType = paginationType;
            cookie(this.cookieName, JSON.stringify(obj));
        },

        getKeyBindingModel: function () {
            return [
                { label: 'Default', value: 'default' },
                { label: 'Emacs', value: 'emacs' }
            ];
        },

        getKeyBindingType: function () {
            return JSON.parse(cookie(this.cookieName)).keyBinding;
        },

        setKeyBinding: function (keyBinding) {
            var obj = JSON.parse(cookie(this.cookieName));
            obj.keyBinding = keyBinding;
            cookie(this.cookieName, JSON.stringify(obj));
        },

        getPageSizeOptions: function () {
            return [5, 10, 15, 25, 50, 100, 200];
        },

        getPageSizeModel: function () {
            var selectModel  = [],
                i = 0,
                options = this.getPageSizeOptions();

            for (i; i < options.length; i += 1) {
                selectModel.push({ label: options[i].toString(), value: options[i] });
            }

            return selectModel;
        },

        getPageSize: function () {
            return JSON.parse(cookie(this.cookieName)).pageSize;
        },

        setPageSize: function (size) {
            var obj = JSON.parse(cookie(this.cookieName));
            obj.pageSize = size;
            cookie(this.cookieName, JSON.stringify(obj));
        },

        getFontSize: function () {
            return JSON.parse(cookie(this.cookieName)).fontSize;
        },

        setFontSize: function (size) {
            var obj = JSON.parse(cookie(this.cookieName));
            obj.fontSize = size;
            cookie(this.cookieName, JSON.stringify(obj));
        }
    });
});
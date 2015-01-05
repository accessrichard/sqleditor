define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'sqleditor/widgets/_DatabaseExplorerMixin',
    'sqleditor/models/DatabaseExplorerModel',
    'sqleditor/widgets/LoginDialog'
], function (declare, lang, arrayUtil, domConstruct, 
             _DatabaseExplorerMixin, DatabaseExplorerModel, LoginDialog) {

    var model = new DatabaseExplorerModel();

    function configureSelectDataProps(select) {
        select.set('searchAttr', 'name');
        select.set('queryExpr', '${0}');
        select.set('autocomplete', true);
    }

    function initSystems() {
        var that = this;
        new model.getSystemModel().then(function (store) {
            that.selectSystem.set('options', store);
        });
    }

    return declare('sqleditor.widgets.DatabaseExplorer', _DatabaseExplorerMixin, {

        columnListDomNode: 'columnList',

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        postCreate: function () {
            this.inherited(arguments);
            configureSelectDataProps(this.selectSchema);
            configureSelectDataProps(this.selectTable);
            initSystems.call(this);
        },

        selectSystemOnChange: function () {
            var system = this.selectSystem.get('value'),
                that = this;
            this.selectSchema.set('disabled', system === '');
            this.selectSchema.set('value', '');

            model.getSchemaModel(system).query({ name: 'nothing' }).then(function (result) {
                if (result.isLoginRequired) {
                    that.showLoginDialog(system);
                }
            });

            this.selectSchema.set('store', model.getSchemaModel(system));
            this.selectTable.set('value', '');
            this.clearColumns();
        },

        createLoginDialog: function () {
            if (this.loginDialog) {
                return;
            }

            this.loginDialog = new LoginDialog({
                systemModel: this.selectSystem.get('options'),
                onLoginSuccess: lang.hitch(this, this.onLoginSuccess)
            });
        },

        showLoginDialog: function (system) {
            var that = this;
            this.createLoginDialog();

            this.loginDialog.show().then(function () {
                that.loginDialog.textboxSystem.set('value', system);
            });
        },

        onLoginSuccess: function () {
            this.selectSchemaOnChange();
        },

        selectSchemaOnChange: function () {
            var system = this.selectSystem.get('value'),
                schema = this.selectSchema.get('value');

            this.selectTable.set('disabled',  schema === '');

            if (schema === '') {
                this.selectTable.set('value', '');
                return;
            }

            this.selectTable.set('store', model.getTableModel(system, schema));
            this.clearColumns();
        },

        selectTableOnChange: function () {
            var system = this.selectSystem.get('value'),
                schema = this.selectSchema.get('value'),
                table = this.selectTable.get('value');

            this.displayColumns(system, schema, table);
        },

        displayColumns: function (system, schema, table) {
            var that = this;
            this.clearColumns();

            model.getColumnModel(system, schema, table).query({}).then(function (results) {
                var ul,
                    container = domConstruct.create('div', {
                        innerHTML: '<b>Columns:</b>'
                    }, that.columnListDomNode, 'first');

                ul = domConstruct.create('ul', null, container, 'last');
                arrayUtil.forEach(results, function (data) {
                    domConstruct.create('li', { innerHTML: data.name }, ul);
                });
            });
        },

        clearColumns: function () {
            domConstruct.empty(this.columnListDomNode);
        }
    });
});

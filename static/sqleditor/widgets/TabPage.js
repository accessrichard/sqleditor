define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojox/widget/Standby',
    'sqleditor/widgets/_TabPageMixin',
    'sqleditor/widgets/Grid',
    'sqleditor/models/GridModel',
    'sqleditor/widgets/SqlCodeMirror'
], function (declare, domConstruct, Standby, _TabPageMixin, Grid, GridModel) {

    var gridModel = new GridModel();

    function populateGrid(data) {
        if (this.grid) {
            this.grid.set('columns', data.columns);
            this.grid.set('store', data.store);
            return;
        }

        this.grid = new Grid({
            store: data.store,
            columns: data.columns
        });

        domConstruct.place(this.grid.domNode, this.gridNode);
    }

    function runQuery(sql, system, limit) {
        var that = this;

        return gridModel.getModel(sql, system, limit).then(function (data) {
            if (data.isLoginRequired) {
                return data;
            }

            populateGrid.call(that, data);
            that.contentPaneBottom.set('content', data.message);
            return data;
        }, function (error) {
            that.contentPaneBottom.set('content', error.response.data.message);
            return error;
        });
    }

    function initStandby() {
        if (this.standby) {
            return;
        }

        this.standby = new Standby({
            id: this.file,
            target : this.contentPaneGrid.domNode
        });

        this.contentPaneGrid.addChild(this.standby);
    }

    return declare('sqleditor.widgets.TabPage', _TabPageMixin, {

        standby: null,

        onClose: function () {
            if (this.standby) {
                this.standby.destroy();
            }

            return true;
        },

        execute: function (system, limit) {
            var sql = this.editor.get('value'),
                that = this;

            initStandby.call(this);
            this.standby.show();

            return runQuery.call(this, sql, system, limit).then(function (data) {
                that.standby.hide();
                return data;
            });
        },

        refresh: function () {
            if (!this.grid) {
                return;
            }

            if (this.grid._started){
                this.grid.refresh();
                return;
            }

            this.grid.startup();
        }
    });
});
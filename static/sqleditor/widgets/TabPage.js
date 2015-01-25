define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojox/widget/Standby',
    'sqleditor/widgets/_TabPageMixin',
    'sqleditor/widgets/Grid',
    'sqleditor/widgets/VirtualGrid',
    'sqleditor/models/GridModel',
    'sqleditor/prettyPrint',
    'sqleditor/models/SettingsModel',
    'dojo/dom-class',
    'dojo/query',
    'dojo/keys',
    'sqleditor/widgets/SqlCodeMirror'
], function (declare, domConstruct, Standby, _TabPageMixin, Grid,
             VirtualGrid, GridModel, prettyPrint, SettingsModel, domClass, query, keys) {

    var gridModel = new GridModel(),
        settings = new SettingsModel();


    function isGridTypeChanged() {
        if (!this.grid) {
            return false;
        }

        return settings.getPaginationType() === 'virtual' ?
                !this.grid.pagingMethod :
                !!this.grid.pagingMethod;
    }

    function destroyGrid() {
        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }

        domConstruct.empty(this.queryResultNode);
    }

    function renderGrid(data) {
        var GridCls;
        if (this.grid && !isGridTypeChanged.call(this)) {
            this.grid.set('columns', data.columns);
            this.grid.set('store', data.store);
            return;
        }

        destroyGrid.call(this);

        GridCls = settings.getPaginationType() === 'virtual' ? VirtualGrid : Grid;

        this.grid = new GridCls({
            store: data.store,
            columns: data.columns
        });

        domConstruct.place(this.grid.domNode, this.queryResultNode);
    }

    function renderText(text) {
        destroyGrid.call(this);
        domConstruct.create('pre', {
            innerHTML: text
        }, this.queryResultNode);
    }

    function render(results) {
        var format = settings.getDataFormat(),
            data = {data: results.store.data,
                    columns: results.columns},
            delimiter = { tabDelimited: '\t',
                          commaDelimited: ',',
                          pipeDelimited: '|' };

        switch (format) {
        case 'grid':
            renderGrid.call(this, results);
            break;
        case 'text':
            renderText.call(this, prettyPrint.padDelimit(data, 200, ' '));
            break;
        case 'tabDelimited':
        case 'commaDelimited':
        case 'pipeDelimited':
            renderText.call(this, prettyPrint.charDelimit(data, delimiter[format]));
            break;
        case 'vertical':
            renderText.call(this, prettyPrint.vertical(data));
            break;
        }
    }

    function runQuery(sql, system, limit) {
        var that = this;

        return gridModel.getModel(sql, system, limit).then(function (data) {
            if (data.isLoginRequired) {
                return data;
            }

            render.call(that, data);
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
            target : this.contentPaneResult.domNode
        });

        this.contentPaneResult.addChild(this.standby);
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
                this.grid.resize();
                return;
            }

            this.grid.startup();
        },

        isFullScreenResults: function () {
            if (!this.queryResultNode) {
                return false;
            }

            return domClass.contains(this.queryResultNode, "fullscreen");
        },

        toggleFullScreenResults: function () {
            var isFullScreen = this.isFullScreenResults();

            if (!this.queryResultNode) {
                return;
            }

            if (!isFullScreen) {
                domClass.add(this.queryResultNode, 'fullscreen');
            }

            //// dgrid manages it's own scrollbars so only add scroll to text results.
            if (!isFullScreen && !this.grid) {
                query(".fullscreen").style("overflow", "scroll");
            }

            if (isFullScreen) {
                query(".fullscreen").style("overflow", "initial");
                domClass.remove(this.queryResultNode, 'fullscreen');
            }

            if (this.grid) {
                this.grid.resize();
            }

            //// Hide the container as z-index property does not apply.
            query('#layoutBorderContainer').style({
                height: isFullScreen ? '' : 0
            });
        }
    });
});
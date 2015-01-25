require([
    'dojo/on',
    'dijit/registry',
    'dojo/keys',
    'dojo/domReady!'
], function (on, registry, keys) {

    //// Predeclared for lint warning: function is used before defined.
    var escapeFullScreen;

    function saveQuery() {
        registry.byId('buttonSave').onClick();
    }

    function runQuery() {
        registry.byId('buttonRun').onClick();
    }

    function openNewScratchPad() {
        registry.byId('buttonNew').onClick();
    }

    function setFocusOnEditor() {
        registry.byId('tabContainer').selectedChildWidget.editor.codeEditor.focus();
    }

    function setFocusOnQueryResults() {
        var tabPage =  registry.byId('tabContainer').selectedChildWidget;
        if (tabPage.grid) {
            tabPage.grid.bodyNode.focus();
            return;
        }

        tabPage.contentPaneResult.domNode.focus();
    }

    function setFocusOnTabList() {
        var container = registry.byId('tabContainer');
        if (container.tablist && container.tablist.getChildren().length) {
            container.tablist.getChildren()[0].focusNode.focus();
        }
    }

    function setFocusOnFileSearch() {
        if (!registry.byId('editor').isExplorerVisible()) {
            registry.byId('editor').toggleExplorer();
        }

        registry.byId('leftAccordion').selectChild(registry.byId('fileManager'));
        document.getElementById('searchCombobox').focus();
    }

    function toggleExplorer() {
        registry.byId('editor').toggleExplorer();
    }

    function toggleFullScreenEditor() {
        var tabPage =  registry.byId('tabContainer').selectedChildWidget;
        if (!tabPage || !tabPage.editor) {
            return;
        }

        if (tabPage.isFullScreenResults()) {
            escapeFullScreen();
        }

        tabPage.editor.toggleFullScreen();
    }

    function toggleFullScreenResults() {
        var tabPage =  registry.byId('tabContainer').selectedChildWidget;
        if (!tabPage || !tabPage.queryResultNode) {
            return;
        }

        if (tabPage.editor.codeEditor.getOption('fullScreen')) {
            escapeFullScreen();
        }

        tabPage.toggleFullScreenResults();
    }

    escapeFullScreen = function () {
        var tabPage =  registry.byId('tabContainer').selectedChildWidget;
        if (!tabPage || !tabPage.queryResultNode || !tabPage.editor) {
            return;
        }

        if (tabPage.isFullScreenResults()) {
            toggleFullScreenResults();
            return;
        }

        if (tabPage.editor.codeEditor.getOption('fullScreen')) {
            toggleFullScreenEditor();
            return;
        }
    };

    function populateEventKey(e) {
        switch (e.which) {
        case 188:
            e.key = ',';
            return;
        case 190:
            e.key = '.';
            return;
        case 186:
            e.key = ';';
            return;
        default:
            e.key = String.fromCharCode(e.which).toLowerCase();
        }

        return;
    }

    function bindControlKeys(e) {
        if (!e.key) {
            populateEventKey(e);
        }

        switch (e.key) {
        case 's':
            e.preventDefault();
            saveQuery();
            break;
        case '1':
            e.preventDefault();
            setFocusOnEditor();
            break;
        case '2':
            e.preventDefault();
            setFocusOnQueryResults();
            break;
        case '3':
            e.preventDefault();
            setFocusOnTabList();
            break;
        case '7':
            e.preventDefault();
            toggleFullScreenEditor();
            break;
        case '8':
            e.preventDefault();
            toggleFullScreenResults();
            break;
        case '9':
            e.preventDefault();
            toggleExplorer();
            break;
        }
    }

    function bindFunctionKeys(e) {
        switch (e.charCode || e.keyCode) {
        case keys.F8:
            e.preventDefault();
            escapeFullScreen();
            runQuery();
            break;
        case keys.F9:
            e.preventDefault();
            escapeFullScreen();
            openNewScratchPad();
            break;
        case keys.F10:
            e.preventDefault();
            escapeFullScreen();
            setFocusOnFileSearch();
            break;
        case keys.ESCAPE:
            e.preventDefault();
            escapeFullScreen();
            break;
        }
    }

    on(document.body, 'keydown', function (e) {
        if (e.ctrlKey) {
            bindControlKeys(e);
            return;
        }

        bindFunctionKeys(e);
    });
});
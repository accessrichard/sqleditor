require([
    'dojo/on',
    'dijit/registry',
    'dojo/keys',
    'dojo/domReady!'
], function (on, registry, keys) {

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
        case 83:
            e.key = 's';
            return;
        case 69:
            e.key = 'e';
            return;
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
        case ',':
            e.preventDefault();
            setFocusOnEditor();
            break;
        case '.':
            e.preventDefault();
            setFocusOnQueryResults();
            break;
        case 'e':
            e.preventDefault();
            toggleExplorer();
            break;
        case ';':
            e.preventDefault();
            setFocusOnTabList();
            break;
        }
    }

    function bindFunctionKeys(e) {
        switch (e.charCode || e.keyCode) {
        case keys.F8:
            e.preventDefault();
            runQuery();
            break;
        case keys.F9:
            e.preventDefault();
            openNewScratchPad();
            break;
        case keys.F10:
            e.preventDefault();
            setFocusOnFileSearch();
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
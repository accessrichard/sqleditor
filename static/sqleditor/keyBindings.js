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

    /**
     * Populating e.key as the character value of the key code since javascript
     * key events are so confusing.
     * According to: https://developer.mozilla.org/en-US/docs/Web/Events/keypress
     * keyCode, charCode and which are depreciated for e.key which may or may not
     * be implemented. In addition string.fromCharCode is not reliable since
     * string.fromCharCode(120) = 'w' (unicode char w) instead of F8 (js code 120)
     * so evaluate special chars seperately.
     * @param {object} e The key event.
     */
    function populateEventKey(e) {
        switch (e.which) {
        case keys.F8:
            e.key = 'F8';
            return;
        case keys.F9:
            e.key = 'F9';
            return;
        case keys.F10:
            e.key = 'F10';
            return;
        case keys.ESCAPE:
            e.key = 'Esc';
            return;
        }

        if (!e.key) {
            e.key = String.fromCharCode(e.which).toLowerCase();
        }
    }

    function bindControlKeys(e) {
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
        switch (e.key) {
        case 'F8':
            e.preventDefault();
            escapeFullScreen();
            runQuery();
            break;
        case 'F9':
            e.preventDefault();
            escapeFullScreen();
            openNewScratchPad();
            break;
        case 'F10':
            e.preventDefault();
            escapeFullScreen();
            setFocusOnFileSearch();
            break;
        case 'Esc':
            e.preventDefault();
            escapeFullScreen();
            break;
        }
    }

    on(document.body, 'keydown', function (e) {
        populateEventKey(e);

        if (e.ctrlKey) {
            bindControlKeys(e);
            return;
        }

        bindFunctionKeys(e);
    });
});
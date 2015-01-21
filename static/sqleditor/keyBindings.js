require([
    'dojo/on',
    'dijit/registry',
    'dojo/domReady!'
], function (on, registry) {

    function bindControlKeys(e) {
        switch (e.key) {
        case 's': //save
            e.preventDefault();
            registry.byId('buttonSave').onClick();
            break;
        case ',': //sql editor focus
            e.preventDefault();
            registry.byId('tabContainer').selectedChildWidget.editor.codeEditor.focus();
            break;
        case '.': //grid focus
            e.preventDefault();
            var tabPage =  registry.byId('tabContainer').selectedChildWidget;
            if (tabPage.grid) {
                tabPage.grid.bodyNode.focus();
                break;
            }

            tabPage.contentPaneResult.domNode.focus();
            break;
        case 'e': //toggle explorer
            e.preventDefault();
            registry.byId('editor').toggleExplorer();
            break;
        case '/':
            e.preventDefault();
            registry.byId('tabContainer').tablist.getChildren()[0].focusNode.focus();
            break;
        }
    }

    function bindFunctionKeys(e) {
        switch (e.key) {
        case 'F8': //run sql
            e.preventDefault();
            registry.byId('buttonRun').onClick();
            break;
        case 'F9': //new scratchpad
            e.preventDefault();
            registry.byId('buttonNew').onClick();
            break;
        case 'F10': //open file
            e.preventDefault();

            if (!registry.byId('editor').isExplorerVisible()) {
                registry.byId('editor').toggleExplorer();
            }

            registry.byId('leftAccordion').selectChild(registry.byId('fileManager'));
            document.getElementById('searchCombobox').focus();
            break;
        }
    }

    on(document.body, 'keypress', function (e) {
        if (e.ctrlKey) {
            bindControlKeys(e);
            return;
        }

        bindFunctionKeys(e);
    });
});
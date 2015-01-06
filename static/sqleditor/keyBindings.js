require([
    'dojo/on',
    'dijit/registry',
    'dojo/domReady!'
], function (on, registry) {

    on(document.body, 'keypress', function (e) {

        if (e.ctrlKey) {
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

                tabPage.contentPaneGrid.domNode.focus();
                break;
            }

            return;
        }

        switch (e.key) {
        case 'F8': //run sql
            e.preventDefault();
            registry.byId('buttonRun').onClick();
            break;
        case 'F9': //new scratchpad
            e.preventDefault();
            registry.byId('buttonNew').onClick();
            break;
        }
    });
});
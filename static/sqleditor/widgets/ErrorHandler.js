define([
    'dojo/_base/declare',
    'sqleditor/widgets/OkDialog',
    'dojo/request/notify'
], function (declare, Dialog, notify) {

    var dialog = new Dialog({
        title: 'Error',
        style: 'width:350px'
    });

    /**
     * A global XHR error handler. Will show a dialog with the error massage on
     * any XHR errors.
     */
    notify('done', function (responseOrError) {
        if (responseOrError instanceof Error && responseOrError.response.data) {
            dialog.set('content', responseOrError.response.data.message);
            dialog.show();
        }
    });
});

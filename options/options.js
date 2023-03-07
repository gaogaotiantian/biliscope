// Saves options to chrome.storage
function save_options() {
    var enableWordCloud = document.getElementById('enable-word-cloud').checked;
    chrome.storage.sync.set({
        enableWordCloud: enableWordCloud
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = '保存成功';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        enableWordCloud: true
    }, function(items) {
        document.getElementById('enable-word-cloud').checked = items.enableWordCloud;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
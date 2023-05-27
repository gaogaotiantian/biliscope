// Saves options to chrome.storage
function save_options() {
    const enableWordCloud = document.getElementById('enable-word-cloud').checked;
    const minSize = document.getElementById('min-number').value;
    chrome.storage.sync.set({
        enableWordCloud: enableWordCloud,
        minSize
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = '保存成功';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        enableWordCloud: true,
        minSize: 5
    }, function (items) {
        document.getElementById('enable-word-cloud').checked = items.enableWordCloud;
        document.getElementById('min-number').value = items.minSize;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
const decrementBtn = document.getElementById('decrement');
const incrementBtn = document.getElementById('increment');
const minNumberInput = document.getElementById('min-number');

decrementBtn.addEventListener('click', function () {
    const currentValue = parseInt(minNumberInput.value);
    if (currentValue > 5) {
        minNumberInput.value = currentValue - 1;
    }
});

incrementBtn.addEventListener('click', function () {
    const currentValue = parseInt(minNumberInput.value);
    minNumberInput.value = currentValue + 1;
});
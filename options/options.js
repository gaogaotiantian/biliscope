function show_status(text, time) {
    var status = document.getElementById('status');
    status.textContent = text;
    setTimeout(function() {
        status.textContent = '';
    }, time);
}

function clear_notes() {
    chrome.storage.local.set({
        noteData: {}
    }, function() {
        show_status('清空成功', 1500);
    });
}

function export_notes() {
    chrome.storage.local.get({
        noteData: {}
    }, function(result) {
        noteData = result.noteData;
        const blob = new Blob([JSON.stringify(noteData)], {'type': 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'note.json';
        a.style = 'display: none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        show_status('导出成功', 1500);
    });
}

function extend_notes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.style = 'display: none';
    input.accept = '.json';
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            let noteData = JSON.parse(reader.result);
            if (!noteData) {
                show_status('非法文件', 1500);
                return;
            }
            chrome.storage.local.get({
                noteData: {}
            }, function(result) {
                let origNoteData = result.noteData;
                for (let key in noteData) {
                    if (!key in origNoteData) {
                        origNoteData[key] = noteData[key];
                    }
                }
                chrome.storage.local.set({
                    noteData:origNoteData
                });
                show_status('添加成功', 1500);
            });
        })
        reader.readAsText(file);
    })

    document.body.appendChild(input);
    input.click()
    document.body.removeChild(input);
}

function import_notes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.style = 'display: none';
    input.accept = '.json';
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            let noteData = JSON.parse(reader.result);
            if (noteData) {
                chrome.storage.local.set({
                    noteData: noteData
                });
                show_status('导入成功', 1500);
            } else {
                show_status('非法文件', 1500);
            }
        })
        reader.readAsText(file);
    })

    document.body.appendChild(input);
    input.click()
    document.body.removeChild(input);
}

// Saves options to chrome.storage
function save_options() {
    const enableWordCloud = document.getElementById('enable-word-cloud').checked;
    const minSize = document.getElementById('min-number').value;
    chrome.storage.sync.set({
        enableWordCloud: enableWordCloud,
        minSize: minSize
    }, function () {
        // Update status to let user know options were saved.
        show_status('保存成功', 750);
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
document.getElementById('export-note').addEventListener('click', export_notes);
document.getElementById('import-note').addEventListener('click', import_notes);
document.getElementById('extend-note').addEventListener('click', extend_notes);
document.getElementById('clear-note').addEventListener('click', () => {
    document.getElementById('clear-note-confirm-div').hidden = false;
    document.getElementById('clear-note-button-div').hidden = true;
});
document.getElementById('clear-note-cancel').addEventListener('click', () => {
    document.getElementById('clear-note-confirm-div').hidden = true;
    document.getElementById('clear-note-button-div').hidden = false;
});
document.getElementById('clear-note-confirm').addEventListener('click', () => {
    clear_notes();
    document.getElementById('clear-note-confirm-div').hidden = true;
    document.getElementById('clear-note-button-div').hidden = false;
});

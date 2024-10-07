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
                    if (!(key in origNoteData)) {
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

// Tag color related functions

function display_tag_colors() {
    chrome.storage.sync.get({
        tagColors: {}
    }, function(result) {
        const tagColors = result.tagColors;
        const tagColorDisplay = document.getElementById('tag-color-setting-display-div');
        tagColorDisplay.innerHTML = '';
        for (let tag in tagColors) {
            let tagColor = tagColors[tag];
            let tagColorItem = document.createElement('span');
            tagColorItem.className = 'tag-color-setting-item';
            tagColorItem.setAttribute('tag', tag);
            tagColorItem.innerHTML = `<span class="tag-name">${tag}</span>` +
                                     `<input type="color" tag=${tag} value=${tagColor}>` +
                                     `<svg xmlns="http://www.w3.org/2000/svg" class="tag-delete-icon" tag=${tag} height="14px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
            tagColorDisplay.appendChild(tagColorItem);
            Array.from(tagColorDisplay.getElementsByClassName('tag-delete-icon')).forEach(element => {
                element.addEventListener('click', () => {
                    delete_tag_color(element.getAttribute('tag'));
                });
            });

            Array.from(tagColorDisplay.getElementsByTagName('input')).forEach(element => {
                element.addEventListener('change', () => {
                    add_tag_color(element.getAttribute('tag'), element.value);
                });
            });
        }
    });
}

function add_tag_color(tag, color) {
    chrome.storage.sync.get({
        tagColors: {}
    }, function(result) {
        tagColors = result.tagColors;
        tagColors[tag] = color;
        chrome.storage.sync.set({
            tagColors: tagColors
        }, function() {
            display_tag_colors();
        });
    });
}

function delete_tag_color(tag) {
    chrome.storage.sync.get({
        tagColors: {}
    }, function(result) {
        tagColors = result.tagColors;
        delete tagColors[tag];
        chrome.storage.sync.set({
            tagColors: tagColors
        }, function() {
            display_tag_colors();
        });
    });
}

document.getElementById('tag-color-setting-add-button').addEventListener('click', () => {
    const tag = document.getElementById('tag-color-setting-add-text').value;
    const color = document.getElementById('tag-color-setting-add-color').value;
    if (tag && color) {
        add_tag_color(tag, color);
    }
});

// == End tag color related functions ==

const all_options = [
    ['enable-up-card', null, true],
    ['enable-block-button', null, true],
    ['enable-rollback-feedcard', null, true],
    ['enable-word-cloud', null, true],
    ['enable-ai-summary', null, true],
    ['enable-hot-comment', null, true],
    ['ai-summary-hover-threshold', null, 800],
    ['enable-video-tag', null, true],
    ['enable-tag-color', null, true],
    ['enable-ip-label', null, true],
    ['min-number', 'minSize', 5],
]

function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

// Saves options to chrome.storage
function save_options() {
    let options = {};
    for (const option of all_options) {
        const element = document.getElementById(option[0]);
        const key = option[1] ? option[1] : toCamelCase(option[0]);
        options[key] = element.type === 'checkbox' ? element.checked : element.value;
    }
    chrome.storage.sync.set(options, function () {
        chrome.tabs.query({
            url: "https://*.bilibili.com/*"
        }).then(tabs => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {action: "reloadOptions"});
            });
        });

        show_status('保存成功', 3000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    let options = {};
    for (const option of all_options) {
        const key = option[1] ? option[1] : toCamelCase(option[0]);
        const defaultValue = option[2];
        options[key] = defaultValue;
    }
    chrome.storage.sync.get(options, function (items) {
        for (const option of all_options) {
            const element = document.getElementById(option[0]);
            const key = option[1] ? option[1] : toCamelCase(option[0]);
            if (element.type === 'checkbox') {
                element.checked = items[key];
            } else {
                element.value = items[key];
            }
        }
    });
    display_tag_colors();
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

document.getElementById('refresh-blacklist').addEventListener('click', () => {
    chrome.tabs.query({
        url: "https://*.bilibili.com/*"
    }).then(tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {action: "refreshBlackList"});
        });
        show_status('刷新成功', 3000);
    });
});

document.getElementById('report-issue').addEventListener('click', () => {
    chrome.tabs.create({url: 'https://github.com/gaogaotiantian/biliscope/issues'});
});

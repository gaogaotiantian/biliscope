function show_status(text, time) {
      const status = document.getElementById('status');
      status.textContent = text;
      setTimeout(() => {
        status.textContent = '';
      }, time);
    }

    function clear_notes() {
      chrome.storage.local.set({
        noteData: {}
      }, () => {
        show_status('清空成功', 1500);
      });
    }

    function export_notes() {
      chrome.storage.local.get({
        noteData: {}
      }, (result) => {
        const noteData = result.noteData;
        const blob = new Blob([JSON.stringify(noteData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'note.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        show_status('导出成功', 1500);
      });
    }

    function extend_notes() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';
      input.addEventListener('change', () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          let noteData;
          try {
            noteData = JSON.parse(reader.result);
          } catch {
            show_status('非法文件', 1500);
            return;
          }

          if (!noteData) {
            show_status('非法文件', 1500);
            return;
          }
          chrome.storage.local.get({ noteData: {} }, (result) => {
            let origNoteData = result.noteData;
            for (let key in noteData) {
              if (!(key in origNoteData)) {
                origNoteData[key] = noteData[key];
              }
            }
            chrome.storage.local.set({ noteData: origNoteData }, () => {
              show_status('添加成功', 1500);
            });
          });
        });
        reader.readAsText(file);
      });
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    }

    function import_notes() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';
      input.addEventListener('change', () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          let noteData;
          try {
            noteData = JSON.parse(reader.result);
          } catch {
            show_status('非法文件', 1500);
            return;
          }

          if (noteData) {
            chrome.storage.local.set({ noteData: noteData }, () => {
              show_status('导入成功', 1500);
            });
          } else {
            show_status('非法文件', 1500);
          }
        });
        reader.readAsText(file);
      });
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    }

    function display_tag_colors() {
      chrome.storage.sync.get({ tagColors: {} }, (result) => {
        const tagColors = result.tagColors;
        const displayDiv = document.getElementById('tag-color-setting-display-div');
        displayDiv.innerHTML = '';
        for (const tag in tagColors) {
          const color = tagColors[tag];
          const item = document.createElement('div');
          item.className = 'tag-color-setting-item';
          item.setAttribute('tag', tag);
          item.setAttribute('role', 'listitem');
          item.innerHTML = `
            <span class="tag-name">${tag}</span>
            <input type="color" tag="${tag}" value="${color}" aria-label="编辑标签 ${tag} 颜色" />
            <svg class="tag-delete-icon" tag="${tag}" aria-label="删除标签 ${tag}" role="button" tabindex="0" xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 0 512 512" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
          `;
          displayDiv.appendChild(item);
        }

        displayDiv.querySelectorAll('.tag-delete-icon').forEach((btn) => {
          btn.addEventListener('click', () => {
            delete_tag_color(btn.getAttribute('tag'));
          });
          btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              delete_tag_color(btn.getAttribute('tag'));
            }
          });
        });

        displayDiv.querySelectorAll('input[type=color]').forEach(input => {
          input.addEventListener('change', () => {
            add_tag_color(input.getAttribute('tag'), input.value);
          });
        });
      });
    }

    function add_tag_color(tag, color) {
      chrome.storage.sync.get({ tagColors: {} }, (result) => {
        const tagColors = result.tagColors;
        tagColors[tag] = color;
        chrome.storage.sync.set({ tagColors: tagColors }, () => {
          display_tag_colors();
        });
      });
    }

    function delete_tag_color(tag) {
      chrome.storage.sync.get({ tagColors: {} }, (result) => {
        const tagColors = result.tagColors;
        delete tagColors[tag];
        chrome.storage.sync.set({ tagColors: tagColors }, () => {
          display_tag_colors();
        });
      });
    }

    document.getElementById('tag-color-setting-add-button').addEventListener('click', () => {
      const tagInput = document.getElementById('tag-color-setting-add-text');
      const colorInput = document.getElementById('tag-color-setting-add-color');
      const tag = tagInput.value.trim();
      const color = colorInput.value;
      if (tag) {
        add_tag_color(tag, color);
        tagInput.value = '';
        tagInput.focus();
      }
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


    const decrementBtn = document.getElementById('decrement');
    const incrementBtn = document.getElementById('increment');
    const minNumberInput = document.getElementById('min-number');

    decrementBtn.addEventListener('click', () => {
      let current = parseInt(minNumberInput.value, 10);
      if (current > 5) {
        minNumberInput.value = current - 1;
      }
    });
    incrementBtn.addEventListener('click', () => {
      let current = parseInt(minNumberInput.value, 10);
      if (current < 50) {
        minNumberInput.value = current + 1;
      }
    });


    function toCamelCase(str) {
      return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

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
      ['enable-video-data', null, true],
      ['min-number', 'minSize', 5],
    ];

    function restore_options() {
      let defaultOptions = {};
      for (const option of all_options) {
        const key = option[1] ? option[1] : toCamelCase(option[0]);
        defaultOptions[key] = option[2];
      }
      chrome.storage.sync.get(defaultOptions, (items) => {
        for (const option of all_options) {
          let elem = document.getElementById(option[0]);
          const key = option[1] ? option[1] : toCamelCase(option[0]);
          if (elem.type === 'checkbox') {
            elem.checked = items[key];
          } else {
            elem.value = items[key];
          }
        }
        display_tag_colors();
      });
    }
    document.addEventListener('DOMContentLoaded', restore_options);


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
    document.getElementById('save').addEventListener('click', save_options);
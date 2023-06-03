function show_status(text, time) {
  var status = document.getElementById("status");
  status.textContent = text;
  setTimeout(function () {
    status.textContent = "";
  }, time);
}

function get_notes() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      {
        noteData: {},
      },
      function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.noteData);
        }
      }
    );
  });
}

function set_notes(noteData) {
  if (noteData) {
    chrome.storage.local.set({
      noteData: noteData,
    });
  }
}

async function export_notes() {
  const noteData = await get_notes();
  const blob = new Blob([JSON.stringify(noteData)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "note.json";
  a.style = "display: none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  show_status("导出成功", 1500);
}

function import_notes() {
  const input = document.createElement("input");
  input.type = "file";
  input.style = "display: none";
  input.accept = ".json";
  input.addEventListener("change", () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      let noteData = JSON.parse(reader.result);
      if (noteData) {
        set_notes(noteData);
        show_status("导入成功", 1500);
      } else {
        show_status("非法文件", 1500);
      }
    });
    reader.readAsText(file);
  });

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

// Saves options to chrome.storage
function save_options() {
  const enableWordCloud = document.getElementById("enable-word-cloud").checked;
  const minSize = document.getElementById("min-number").value;
  const giteeOwner = document.getElementById("gitee-owner").value ?? "";
  const giteeToken = document.getElementById("gitee-token").value ?? "";
  const giteeRepo = document.getElementById("gitee-repo").value ?? "";
  chrome.storage.sync.set(
    {
      enableWordCloud: enableWordCloud,
      minSize: minSize,
      giteeOwner,
      giteeToken,
      giteeRepo,
    },
    function () {
      // Update status to let user know options were saved.
      show_status("保存成功", 750);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(
    {
      enableWordCloud: true,
      minSize: 5,
      giteeOwner: "",
      giteeToken: "",
      giteeRepo: "BiliScope",
    },
    function (items) {
      document.getElementById("enable-word-cloud").checked =
        items.enableWordCloud;
      document.getElementById("min-number").value = items.minSize;
      document.getElementById("gitee-owner").value = items.giteeOwner ?? "";
      document.getElementById("gitee-token").value = items.giteeToken ?? "";
      document.getElementById("gitee-repo").value = items.giteeRepo ?? "";
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
const decrementBtn = document.getElementById("decrement");
const incrementBtn = document.getElementById("increment");
const minNumberInput = document.getElementById("min-number");

decrementBtn.addEventListener("click", function () {
  const currentValue = parseInt(minNumberInput.value);
  if (currentValue > 5) {
    minNumberInput.value = currentValue - 1;
  }
});

incrementBtn.addEventListener("click", function () {
  const currentValue = parseInt(minNumberInput.value);
  minNumberInput.value = currentValue + 1;
});
document.getElementById("export-note").addEventListener("click", export_notes);
document.getElementById("import-note").addEventListener("click", import_notes);

// For upload gitee and download to gitee
function get_gitee_config() {
  let owner = document.getElementById("gitee-owner").value;
  let token = document.getElementById("gitee-token").value;
  let repo = document.getElementById("gitee-repo").value;
  return { owner, token, repo };
}

async function check_gitee_api() {
  let { owner, token } = get_gitee_config();
  console.log("owner: %s, token: %s", owner, token);
  if (token) {
    let url = `https://gitee.com/api/v5/user?access_token=${token}`;
    let response = await fetch(url);
    let data = await response.json();
    if (data.code === 40001) {
      show_status("token错误", 2500);
      return false;
    } else if (data.login != owner) {
      console.log("data.login: %s", data.login);
      show_status("token与用户名不匹配", 2500);
      return false;
    }
  } else {
    show_status("邮箱或token为空", 2500);
    return false;
  }
  return true;
}

async function create_gitee_repo_if_not_exists() {
  const { owner, token, repo } = get_gitee_config();
  const url = `https://gitee.com/api/v5/repos/${owner}/${repo}?access_token=${token}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (response.status === 404) {
    // 创建
    const url = `https://gitee.com/api/v5/user/repos?access_token=${token}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        name: repo,
        description: "scan_barcode",
        private: true,
        has_issues: true,
        has_wiki: false,
        auto_init: true,
      }),
    });

    if (response.status === 201) {
      show_status("创建成功", 2500);
    }
  }
}

/**
 *
 * @param {string} srcText
 * @returns {string}
 */
function base64EncodeToString(srcText) {
  function base64ArrayBuffer(arrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(srcText);
  const base64 = base64ArrayBuffer(data);
  return base64;
}

/**
 *
 * @param {string} srcText
 * @returns {string}
 */
function base64DecodeToString(srcText) {
  function stringToArrayBuffer(str) {
    const binary_string = atob(str);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
  }

  const decoder = new TextDecoder();
  const data = stringToArrayBuffer(srcText);
  const text = decoder.decode(data);
  return text;
}

async function get_content_info() {
  const { owner, token, repo } = get_gitee_config();
  const url = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/notes.json?access_token=${token}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  }

  return null;
}

async function upload_gitee() {
  if (!check_gitee_api()) {
    return;
  }
  await create_gitee_repo_if_not_exists();

  const nodes = await get_notes();
  const { owner, token, repo } = get_gitee_config();

  const url = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/notes.json?access_token=${token}`;

  const content = JSON.stringify(nodes);
  const base64Content = base64EncodeToString(content);

  const formData = new FormData();
  formData.append("content", base64Content);
  formData.append("message", "upload notes.json");

  let method;

  const contentInfo = await get_content_info();
  if (contentInfo) {
    method = "PUT";
    formData.append("sha", contentInfo.sha);
  } else {
    method = "POST";
  }

  const response = await fetch(url, {
    method: method,
    body: formData,
  });

  if (response.status === 201 || response.status === 200) {
    show_status("上传成功", 2500);
  }
}

async function download_gitee() {
  if (!check_gitee_api()) {
    return;
  }

  const info = await get_content_info();
  if (!info) {
    show_status("未找到文件", 2500);
    return;
  }

  const content = info.content;
  const base64Content = base64DecodeToString(content);
  const nodes = JSON.parse(base64Content);
  set_notes(nodes);
}

document.getElementById("upload-gitee").onclick = upload_gitee;
document.getElementById("download-gitee").onclick = download_gitee;

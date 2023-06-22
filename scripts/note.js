var noteData = null;

chrome.storage.local.get({
    noteData: {}
}, function(result) {
    noteData = result.noteData;
});

function getUserIdFromLink(s) {
    let regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/|\/\?.*)$/;
    let userId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return userId;
}

var noteObserver = new MutationObserver((mutationList, observer) => {
    if (window.location.href.startsWith(BILIBILI_SPACE_URL) && noteData != null && document.getElementById("biliscope-profile-note") == null) {
        let userInfoWrapper = document.querySelector("#page-index > div.col-2");
        let userNoteNode = document.getElementById("biliscope-profile-note");
        let userId = getUserIdFromLink(window.location.href);
        if (userInfoWrapper && !userNoteNode) {
            let noteNode = document.createElement("div");
            noteNode.id = "biliscope-profile-note"
            noteNode.className = "section user-info"
            noteNode.innerHTML = `
                <p class="user-info-title"><span class="info-title">备注</span></div>
                <div class="be-textarea be-input--append">
                    <textarea
                        rows="${Math.max(3, (noteData[userId] || "").split("\n").length)}"
                        placeholder="请输入备注\n换行后的内容将不显示在卡片上，只能在主页中查看"
                        type="textarea"
                        maxlength="5000"
                        class="be-textarea_inner"
                        style="resize: vertical"
                        id="biliscope-note-textarea">${noteData[userId] || ""}</textarea>
                </div>
            `;
            noteNode.getElementsByTagName("textarea")[0].addEventListener("blur", (ev) => {
                // if the value is empty, delete the key
                if (ev.target.value == "") {
                    delete noteData[userId];
                } else {
                    noteData[userId] = ev.target.value;
                }
                chrome.storage.local.set({
                    noteData: noteData
                });
            })
            userInfoWrapper.appendChild(noteNode);
        }
    }
});

noteObserver.observe(document.body, {
    childList: true,
    subtree: true
});

var noteData = null;

chrome.storage.local.get({
    noteData: {}
}, function(result) {
    noteData = result.noteData;
});

var noteObserver = new MutationObserver((mutationList, observer) => {
    if (window.location.href.startsWith(BILIBILI_SPACE_URL) && noteData != null) {
        let userInfoNode = document.getElementsByClassName("section user-info")[0];
        let userNoteNode = document.getElementById("biliscope-profile-note");
        let userId = getUserIdFromLink(window.location.href);
        if (userInfoNode && !userNoteNode) {
            let noteNode = document.createElement("div");
            noteNode.id = "biliscope-profile-note"
            noteNode.className = "section user-info"
            noteNode.innerHTML = `
                <p class="user-info-title"><span class="info-title">备注</span></div>
                <div class="be-textarea be-input--append">
                    <textarea rows="3" type="textarea" maxlength="150" class="be-textarea_inner" id="biliscope-note-textarea">${noteData[userId] || ""}</textarea>
                </div>
            `;
            noteNode.getElementsByTagName("textarea")[0].addEventListener("blur", (ev) => {
                noteData[userId] = ev.target.value;
                chrome.storage.local.set({
                    noteData: noteData
                });
            })
            userInfoNode.parentNode.appendChild(noteNode);
        }
    }
});

noteObserver.observe(document.body, {
    childList: true,
    subtree: true
});

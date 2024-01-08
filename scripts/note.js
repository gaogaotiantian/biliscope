chrome.storage.local.get({
    noteData: {}
}, function(result) {
    noteData = result.noteData;
});

chrome.storage.sync.get({
    tagColors: {},
    enableTagColor: false,
}, function(result) {
    tagColors = result.tagColors;
    enableTagColor = result.enableTagColor;
});

function getUserIdFromLink(s) {
    let regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/|\/\?.*)$/;
    let match = s?.match(regex);
    if (!match) {
        return null;
    }

    return match[1];
}

let noteObserver = new MutationObserver((mutationList, observer) => {
    let userNoteNode = document.getElementById("biliscope-profile-note");

    if (window.location.href.startsWith(BILIBILI_SPACE_URL) && !userNoteNode) {
        let userInfoWrapper = document.querySelector("#page-index > div.col-2");
        let userId = getUserIdFromLink(window.location.href);
        if (!userInfoWrapper) {
            return;
        }

        let noteNode = document.createElement("div");
        let note = noteData[userId] ?? "";
        noteNode.id = "biliscope-profile-note"
        noteNode.className = "section user-info"
        noteNode.innerHTML = `
            <p class="user-info-title"><span class="info-title">备注</span></div>
            <div class="be-textarea be-input--append">
                <textarea
                    rows="${Math.max(3, note.split("\n").length)}"
                    placeholder="请输入备注\n手动换行后的内容将不显示在卡片上，只能在主页中查看\n还可以加入#标签#"
                    type="textarea"
                    maxlength="5000"
                    class="be-textarea_inner"
                    style="resize: vertical"
                    id="biliscope-note-textarea">\n${note}</textarea>
            </div>
        `;
        noteNode.getElementsByTagName("textarea")[0].addEventListener("blur", (ev) => {
            // if the value is empty, delete the key
            let note = ev.target.value;
            if (note == "") {
                delete noteData[userId];
            } else {
                noteData[userId] = note;
            }
            chrome.storage.local.set({
                noteData: noteData
            });
        })
        userInfoWrapper.appendChild(noteNode);
    }
});

function changeUsernameColor(element, userId) {
    let tags = getTags(userId);
    for (let tag of tags) {
        if (!(tagColors[tag])) {
            continue;
        }

        if (element.classList.contains("up-name__text")) {
            // Popular page
            element.style.color = tagColors[tag];
        } else {
            // Other pages
            let authorElements = element.querySelectorAll(".bili-video-card__info--author, .name");
            Array.from(authorElements).forEach((el) => {
                el.style.color = tagColors[tag];
            });
        }
        return;
    }
}

let userNameObserver = new MutationObserver((mutationList, observer) => {
    if (!enableTagColor) {
        return;
    }

    for (let el of document.querySelectorAll("[biliscope-userid]")) {
        let userId = el.getAttribute("biliscope-userid");
        if (noteData[userId]) {
            changeUsernameColor(el, userId);
        }
    }
});

window.addEventListener("load", function() {
    noteObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    userNameObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

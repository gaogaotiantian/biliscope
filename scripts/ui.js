function titleTypeToClass(titleType) {
    if (titleType == 0) {
        return "biliscope-personal-auth-icon";
    } else if (titleType == 1) {
        return "biliscope-organization-auth-icon";
    }
}

function sexToClass(sex) {
    if (sex == "男") {
        return "male";
    } else if (sex == "女") {
        return "female";
    }
    return "";
}

function relationDisplay(data) {
    if (!data["relation"] || data["relation"]["attribute"] === undefined) {
        return null;
    }

    if (data["be_relation"]["attribute"] == 128) {
        return "已被拉黑";
    }

    if (data["relation"]["attribute"] == 0) {
        if (data["be_relation"]["attribute"] == 0) {
            return "关注";
        } else if (data["be_relation"]["attribute"] == 2) {
            return "关注了你";
        }
    }

    if (data["relation"]["attribute"] == 2) {
        return "已关注";
    } else if (data["relation"]["attribute"] == 6) {
        return "已互粉";
    }

    return null;
}

function subscribeTimeToDisplay(data) {
    if (data["relation"] && data["relation"]["mtime"]) {
        return `关注时间：${timestampToDisplay(data["relation"]["mtime"])}`;
    } else {
        return '';
    }
}

function relationClass(data) {
    text = relationDisplay(data);
    if (text == null) {
        return "d-none";
    } else if (text == "已被拉黑") {
        return "biliscope-relation-black";
    } else if (text == "关注" || text == "关注了你") {
        return "biliscope-relation-follow";
    } else if (text == "已关注" || text == "已互粉") {
        return "biliscope-relation-followed";
    }
}

function blockDisplay(data) {
    if (data?.relation?.attribute === undefined) {
        return null;
    }

    if (data["relation"]["attribute"] == 128) {
        return "取消拉黑";
    } else {
        return "拉黑";
    }
}

function blockClass(data) {
    const text = blockDisplay(data);
    if (biliScopeOptions.enableBlockButton && text) {
        return "biliscope-relation-block";
    }
    return "d-none";
}

function messageClass(data) {
    if (data?.relation?.attribute == 128 || data?.be_relation?.attribute == 128) {
        return "d-none";
    }
    return "biliscope-relation-message";
}

function messageLink(data) {
    return `https://message.bilibili.com/#/whisper/mid${data["mid"]}`;
}

function noteDataToDisplay(noteData, mid) {
    if (noteData && noteData[mid]) {
        return noteData[mid].split("\n", 1)[0];
    }
    return "";
}

function getUserProfileCardDataHTML(data) {
    return `
        <div class="idc-theme-img" style="background-image: url(&quot;${data["top_photo"]}@100Q.webp&quot;);">
            <div style="position: absolute; top: 85px; right: 10px">
                <a><span id="biliscope-follow-button" 
                         class="biliscope-relation ${relationClass(data)}" 
                         ${data?.relation?.mtime ? `title="${subscribeTimeToDisplay(data)}"` : ''}>
                    ${relationDisplay(data)}
                </span></a>
                <a><span id="biliscope-block-button" class="biliscope-relation ${blockClass(data)}">${blockDisplay(data)}</span></a>
                <a href="${messageLink(data)}"><span class="biliscope-relation ${messageClass(data)}">私信</span></a>
            </div>
        </div>
        <div class="idc-info clearfix">
            <a class="idc-avatar-container" href="https://space.bilibili.com/${data["mid"]}" target="_blank">
                <img alt="${data["name"]}" src="${data["face"]}@54w_54h_1c.webp" class="idc-avatar">
                <div class="${data["live_status"] ? "": "d-none"}">
                    <div class="live-tab">
                        <img src="//s1.hdslb.com/bfs/static/jinkela/space/assets/live.gif" alt="live" class="live-gif">
                        直播中
                    </div>
                    <div class="a-cycle a-cycle-1"></div>
                    <div class="a-cycle a-cycle-2"></div>
                    <div class="a-cycle a-cycle-3"></div>
                </div>
            </a>
            <div class="idc-content h">
                <div style="white-space: nowrap">
                    <div id="biliscope-username-wrapper" style="display: inline-block">
                        <a class="idc-username">
                            <b title="点击添加备注" class="idc-uname" style="${data["vip"] ? "color: rgb(251, 114, 153);": "color: #18191C"}">
                                ${data["name"]}
                            </b>
                        </a>
                        <span class="gender biliscope-icon ${sexToClass(data["sex"])}"></span>
                        <span class="lv-wrapper">
                            <span class="lv-img-wrapper" style="position: relative; top: -${data["level"]*12}px">
                                <img style="height: 132px; vertical-align: middle" src="${chrome.runtime.getURL("img/bililv.svg")}">
                            </span>
                        </span>
                    </div>
                </div>
                <div class="idc-meta" id="biliscope-note-wrapper">
                    <div class="idc-meta-item"
                          id="biliscope-card-note-text"
                          ${noteDataToDisplay(noteData, data["mid"]) ? "": "hidden"}>${noteDataToDisplay(noteData, data["mid"])}</div>
                    <textarea class="idc-meta-item"
                              id="biliscope-card-note-textarea"
                              rows="3"
                              hidden
                              maxlength="5000"
                              placeholder="给up加个备注（手动换行前的内容都将显示在卡片上）\n或者加几个#标签#"
                              style="resize: vertical; width: 100%">\n${(data["mid"] && noteData[data["mid"]]) || ""}</textarea>
                </div>
                <div class="idc-meta">
                    <a href="https://space.bilibili.com/${data["mid"]}/fans/follow" target="_blank">
                        <span class="idc-meta-item"><data-title>关注</data-title> ${data["following"] || 0}</span>
                    </a>
                    <a href="https://space.bilibili.com/${data["mid"]}/fans/fans" target="_blank">
                        <span class="idc-meta-item"><data-title>粉丝</data-title> ${numberToDisplay(data["follower"]) || 0}</span>
                    </a>
                    <a href="https://space.bilibili.com/${data["mid"]}/video" target="_blank">
                        <span class="idc-meta-item"><data-title>投稿</data-title> ${data["count"] || 0}</span>
                    </a>
                </div>
                <div class="idc-meta" style="${data["count"] ? "": "display: none"}">
                    <span class="idc-meta-item"><data-title>近30天投稿数</data-title> ${data["lastMonthVideoCount"] || 0}</span>
                    <span class="idc-meta-item"><data-title>上次投稿</data-title> ${timestampToDisplay(data["lastVideoTimestamp"])}</span>
                </div>
                <div class="idc-meta" style="${data["count"] ? "": "display: none"}">
                    <span class="idc-meta-item"><data-title>平均稿件长度</data-title> ${secondsToDisplay(data["totalVideoLength"] / data["count"])}</span>
                </div>
            </div>
            <div id="biliscope-tag-list">
            </div>
            <div class="idc-auth-description">
                <span style="display: ${data["title"] ? "flex": "none"}">
                    <span class="biliscope-auth-icon ${titleTypeToClass(data["title_type"])}"></span>
                    ${data["title"]}
                </span>
                <span class="biliscope-profession-description" style="display: ${data["profession"] ? "flex": "none"}">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABFUExURUxpcWFlbV9lbWFlbF9ka2FlbV9nb2FmbF9jb19jbF9fb19kbGFmbV9lbV9mbF9mbWJlbmFlbV9mbGFmbWJnbmBlbGFmbSRGAiYAAAAWdFJOUwC/kN8w3yDvEEAgYJ+AcFCPz6Cvb7D9AeNOAAABvElEQVR42u1Wy7aDIAwU5C1WrS3//6k3UE9zEsB6F901OyGTZCYRGH72TXNe7tqmZDcx+6sgLwGBZqO6AhKpMhE+lbcWPy0n4+BLLVKXhdWdoUJxioSPuue18SShyqSE4csmA0d1hrK31s4t76hehf2YRgMuNNXIKFIgx40tXVaIZ855r40SgTblxfmBQz0yAoTvANBDVDVALHMOM4108Z1smnCVrkD7JNsCwurlU1F8pPTCeRCNigkr45u5dbydRzrNq5wxv2ZCx3fEQYIXV2nBxMmTxpRkB4EngW1AjQtdN8ZAYq6Iw82cGhNgYxzwJjDYJERHh0wlcevDHOSeMYLpwbBIbEIoeljUo1WkRgaoA4qPE7gR2POISpsQ2BQuqHG7kXtx0JCUec2N4UIzmRQRnw0XiufZtFnNgiuuSMkf+cmC7aM/FxMhkJ8swyZ+bKiPv7zgAxjRg6a7ESaaHmSP9rEhq4MXiR0DI3vHa+hfKlwg7FUfpzLK/PfqeFjOgMdMsUoYREJU74IAIPHwIDyvkJuTqTjJRTn4MtNxCUs3nJtpXflXXhnqTh8Y8vrTZBZbFk/v0rvhZ1+0P1TyJPe5FgeZAAAAAElFTkSuQmCC"
                         class="biliscope-profession-description-icon">
                    ${data["profession"]}
                </span>
            </div>
            <div class="idc-auth-description">
                ${data["sign"]}
            </div>
            <div>
                ${getGuardSupportHTML(data)}
            </div>
        </div>
    `
}

function getGuardSupportHTML(data) {
    if (guardInfo == null || guardInfo.length === 0) {
        return "";
    }

    let guard = guardInfo[data["mid"] % guardInfo.length];
    const guardImgs = [
        // 总督
        "ffcd832b5d7b84ea851cb8156ec0a71940439511",
        // 提督
        "98a201c14a64e860a758f089144dcf3f42e7038c",
        // 舰长
        "143f5ec3003b4080d1b5f817a9efdca46d631945",
    ]
    const bgImg = guardImgs[guard["guard_level"] - 1];

    let borderColor = "";
    if (guard["guard_level"] === 3) {
        borderColor = "rgb(103, 232, 255)";
    } else {
        borderColor = "rgb(255, 232, 84)";
    }

    let bgColor = "";
    const medalLevel = guard["medal_info"]["medal_level"];
    if (medalLevel < 25) {
        bgColor = "rgb(26, 84, 75), rgb(82, 157, 146)";
    } else if (medalLevel  < 29) {
        bgColor = "rgb(6, 21, 76), rgb(104, 136, 241)";
    } else if (medalLevel < 33) {
        bgColor = "rgb(45, 8, 85), rgb(157, 155, 255)";
    } else {
        bgColor = "rgb(122, 4, 35), rgb(233, 134, 187)";
    }

    return `
        <div class="idc-guard-info">
            <span class="support-note" style="margin-right: 6px">感谢</span>
            <span class="item dp-i-block t-over-hidden t-nowrap border-box live-skin-main-text">
                <div class="fans-medal-item" style="border-color: ${borderColor};">
                    <div class="fans-medal-label" style="background-image: linear-gradient(45deg, ${bgColor});">
                        <i class="medal-deco medal-guard" style="background-image: url(&quot;https://i0.hdslb.com/bfs/live/${bgImg}.png@44w_44h.webp&quot;);"></i>
                        <span class="fans-medal-content">天分高</span>
                    </div>
                    <div class="fans-medal-level" style="color: rgb(26, 84, 75);">
                        ${guard["medal_info"]["medal_level"]}
                    </div>
                </div>
                <span class="fans-uname">
                    ${guard["username"]}
                </span>
            </span>
            <span class="support-note">对作者的支持</span>
        </div>
    `
}

function getUserProfileCardHTML(data) {
    return `
        <div id="biliscope-id-card" style="position: absolute;">
            <div id="biliscope-id-card-data">
                ${getUserProfileCardDataHTML(data)}
            </div>
            <div id="biliscope-wordcloud-wrapper">
                <div id="word-cloud-canvas-wrapper" ${biliScopeOptions.enableWordCloud ? "": "hidden"}>
                    <canvas id="word-cloud-canvas" style="width: 100%; height: 0"></canvas>
                </div>
                <div id="word-cloud-toggler" hidden>
                    <div class="arrow-up">
                        <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 512 512" fill="#adadad"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>
                    </div>
                    <div class="arrow-down">
                        <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 512 512" fill="#adadad"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    `
}

function saveOptions() {
    chrome.storage.sync.set(biliScopeOptions);
}

function UserProfileCard() {
    this.userId = null;
    this.data = {};
    this.cursorX = 0;
    this.cursorY = 0;
    this.target = null;
    this.enabled = false;
    this.valid = true;
    this.wordCloud = null;
    this.fixed = false;
    this.cursorInside = false;
    this.el = document.createElement("div");
    this.el.style.position = "absolute";
    this.el.style.display = "none";
    this.el.innerHTML = getUserProfileCardHTML(this.data);
    this.el.addEventListener("transitionend", () => {
        this.updateCursor(this.cursorX, this.cursorY);
    })

    this.idCardObserver = new MutationObserver((mutationList, observer) => {
        this.clearOriginalCard();
    })

    this.disable();

    document.body.appendChild(this.el);

    this.initEvents();
}

UserProfileCard.prototype.disable = function() {
    if (this.fixed) {
        return false;
    }

    this.userId = null;
    this.enabled = false;
    this.data = {};
    if (this.el) {
        this.el.style.display = "none";
        let canvas = document.getElementById("word-cloud-canvas");
        if (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            canvas.parentNode.classList.remove("biliscope-canvas-show");
        }
        this.idCardObserver.disconnect();
    }
    return true;
}

UserProfileCard.prototype.enable = function() {
    if (!this.enabled) {
        this.enabled = true;
        this.idCardObserver.observe(document.body, {
            "childList": true,
            "subtree": true
        })
        return true;
    }
    return false;
}

UserProfileCard.prototype.clearOriginalCard = function() {
    while (document.getElementById("id-card")) {
        document.getElementById("id-card").remove();
    }

    for (let card of document.getElementsByClassName("user-card")) {
        card.hidden = true;
    }

    for (let card of document.getElementsByClassName("card-loaded")) {
        card.hidden = true;
    }

    for (let card of document.getElementsByClassName("bili-user-profile")) {
        card.hidden = true;
    }

    for (let card of document.getElementsByTagName("bili-user-profile")) {
        card.style.display = "none";
    }
}

UserProfileCard.prototype.initEvents = function() {
    let wordCloudCanvasWrapper = document.getElementById("word-cloud-canvas-wrapper");
    let wordCloudWrapper = document.getElementById("biliscope-wordcloud-wrapper");
    let arrowUp = wordCloudWrapper.getElementsByClassName("arrow-up")[0];
    let arrowDown = wordCloudWrapper.getElementsByClassName("arrow-down")[0];

    wordCloudWrapper.addEventListener("mouseenter", (ev) => {
        document.getElementById("word-cloud-toggler").hidden = false;
        if (biliScopeOptions.enableWordCloud) {
            arrowUp.hidden = false;
            arrowDown.hidden = true;
        } else {
            arrowUp.hidden = true;
            arrowDown.hidden = false;
        }
    });

    wordCloudWrapper.addEventListener("mouseleave", (ev) => {
        document.getElementById("word-cloud-toggler").hidden = true;
    });

    arrowUp.addEventListener("click", (ev) => {
        biliScopeOptions.enableWordCloud = false;
        wordCloudCanvasWrapper.hidden = true;
        saveOptions();
        arrowUp.hidden = true;
        arrowDown.hidden = false;
    });

    arrowDown.addEventListener("click", (ev) => {
        let canvas = document.getElementById("word-cloud-canvas");
        biliScopeOptions.enableWordCloud = true;
        wordCloudCanvasWrapper.hidden = false;
        saveOptions();
        arrowUp.hidden = false;
        arrowDown.hidden = true;
        this.drawWordCloud(canvas);
    });
}

UserProfileCard.prototype.updateUserId = function(userId) {
    let updated = this.userId != userId;
    this.userId = userId;
    return updated;
}

UserProfileCard.prototype.updateCursor = function(cursorX, cursorY) {
    this.cursorX = cursorX;
    this.cursorY = cursorY;

    displayElOutsideTarget(
        this.el,
        {left: cursorX, right: cursorX, top: cursorY, bottom: cursorY},
        ['right', 'left']
    );
}

UserProfileCard.prototype.updateTarget = function(target) {
    if (target != this.target) {
        // Calculate z-index for the card
        let node = target
        let zIndex = 1002;
        while (node && node != document) {
            if (node instanceof ShadowRoot) {
                node = node.host;
            }
            let containerIndex = window.getComputedStyle(node).getPropertyValue("z-index");
            if (containerIndex && containerIndex != "auto" && containerIndex > zIndex) {
                zIndex = containerIndex;
            }
            node = node.parentNode;
        } 
        this.el.style.zIndex = zIndex + 1;
    }

    this.target = target;
    this.setLeaveEvent();
}

UserProfileCard.prototype.setLeaveEvent = function() {
    let validTargets = [this.el, this.target];

    // The UI lives directly under document so switching to the UI will trigger
    // the leave event. We need to dispatch the event to the popover to prevent
    // the popover from disappearing.
    const dispatchToPopover = (event) => {
        const popover = this.target.closest(".v-popover");
        popover?.dispatchEvent(new Event(event));
    }

    this.leaveCallback = (ev) => {
        if (this.disable()) {
            for (let target of validTargets) {
                target.removeEventListener("mouseleave", this.disableDebounce);
                target.removeEventListener("mouseenter", this.enterCallback);
            }
            if (ev.target == this.el) {
                dispatchToPopover("mouseleave");
            }
        }
    }

    this.enterCallback = (ev) => {
        clearTimeout(this.disableDebounce.timer);
        if (ev.target == this.el) {
            dispatchToPopover("mouseenter");
        }
        this.cursorInside = true;
    }

    this.disableDebounce = (ev) => {
        this.cursorInside = false;
        this.disableDebounce.timer = setTimeout(() => {
            this.leaveCallback(ev);
        }, 400);
    }

    for (let target of validTargets) {
        target.addEventListener("mouseleave", this.disableDebounce);
        target.addEventListener("mouseenter", this.enterCallback);
    }
}

UserProfileCard.prototype.wordCloudMaxCount = function() {
    return Math.max(...this.data["wordcloud"].map(item => item[1]))
}

UserProfileCard.prototype.drawVideoTags = function() {
    let tagList = document.getElementById("biliscope-tag-list");
    let groupTagIds = [];
    let noteTags = getTags(this.data["mid"]);
    tagList.innerHTML = "";

    if (this.data?.relation?.tag) {
        groupTagIds = this.data["relation"]["tag"].filter(tagId => biliTags[tagId] !== undefined)
    }

    if (this.data["mid"] && groupTagIds.length + noteTags.length > 0) {
        for (let tagId of groupTagIds) {
            let tag = biliTags[tagId];
            let a = document.createElement("a");
            let el = document.createElement("span");
            el.className = "biliscope-badge biliscope-badge-group-tag";
            el.innerHTML = tag;
            a.href = `${BILIBILI_SPACE_URL}/${myMid}/fans/follow?tagid=${tagId}`;
            a.appendChild(el);
            tagList.appendChild(a);
        }
        for (let tag of noteTags) {
            let a = document.createElement("a");
            let el = document.createElement("span");
            el.className = "biliscope-badge biliscope-badge-note-tag";
            el.innerHTML = tag;
            if (tagColors[tag]) {
                el.style.backgroundColor = tagColors[tag];
            }
            a.href = `${BILIBILI_SEARCH_URL}/upuser?keyword=%23${encodeURIComponent(tag)}`;
            a.appendChild(el);
            tagList.appendChild(a);
        }
    } else if (this.data["video_type"]) {
        for (let d of this.data["video_type"]) {
            if (BILIBILI_VIDEO_TYPE_MAP[d[0]]) {
                let el = document.createElement("span");
                let a = document.createElement("a");
                el.className = "biliscope-badge biliscope-badge-video-tag";
                el.innerHTML = BILIBILI_VIDEO_TYPE_MAP[d[0]];
                a.href = `https://www.bilibili.com/v/${BILIBILI_VIDEO_TYPE_LINK[d[0]]}`;
                a.appendChild(el);
                tagList.appendChild(a);
            }
        }
    }
}

UserProfileCard.prototype.setupTriggers = function() {
    let userWrapper = document.getElementById("biliscope-username-wrapper");
    let text = document.getElementById("biliscope-card-note-text");
    let textarea = document.getElementById("biliscope-card-note-textarea");
    let followButton = document.getElementById("biliscope-follow-button");
    let blockButton = document.getElementById("biliscope-block-button");

    // This event uses mousedown because the event trigger sequence click event will be later than blur
    userWrapper.addEventListener("mousedown", (ev) => {
        // Blur is triggered by the default behavior of mousedown, so if there is no preventDefault here, it will be blurred immediately and the input box will never be opened
        ev.preventDefault();

        // not left-click
        if (ev.button !== 0) {
            return;
        }

        if (!textarea.hidden) {
            textarea.blur();
            return;
        }

        text.hidden = true;
        textarea.hidden = false;
        textarea.focus();
        this.fixed = true;
    });

    text.addEventListener("click", (ev) => {
        text.hidden = true;
        textarea.hidden = false;
        textarea.focus();
        this.fixed = true;
    });

    textarea.addEventListener("blur", (ev) => {
        let mid = this.data["mid"];
        // if the value is empty, delete the key
        if (mid) {
            if (textarea.value == "") {
                delete noteData[mid];
            } else {
                noteData[mid] = textarea.value;
            }
            text.innerHTML = noteDataToDisplay(noteData, mid);
            chrome.storage.local.set({
                noteData: noteData
            });
            this.drawVideoTags();
        }
        if (text.innerHTML == "") {
            text.hidden = true;
        } else {
            text.hidden = false;
        }
        textarea.hidden = true;
        this.fixed = false;
        if (!this.cursorInside) {
            this.leaveCallback();
        }
    });

    followButton.addEventListener("click", (ev) => {
        ev.stopPropagation();

        let followAction = null;
        if (ev.target.classList.contains("biliscope-relation-follow")) {
            // Follow
            followAction = 1;
        } else if (ev.target.classList.contains("biliscope-relation-followed")) {
            // Unfollow
            followAction = 2;
        }

        if (followAction) {
            biliPost("https://api.bilibili.com/x/relation/modify", {
                fid: this.data["mid"],
                act: followAction,
                re_src: 11
            })
            .then((data) => {
                if (data["code"] == 0) {
                    updateRelation(this.userId, (data) => this.updateData(data));
                }
            });
        }
    });

    blockButton.addEventListener("click", (ev) => {
        ev.stopPropagation();

        const needBlock = blockButton.innerText == "拉黑";

        biliPost("https://api.bilibili.com/x/relation/modify", {
            fid: this.data["mid"],
            act: needBlock ? 5 : 6,
            re_src: 11
        })
        .then((data) => {
            if (data["code"] == 0) {
                updateRelation(this.userId, (data) => this.updateData(data));
            }
        });
    });
}

UserProfileCard.prototype.drawWordCloud = function(canvas) {
    canvas.style.height = `${canvas.offsetWidth / 2}px`;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    canvas.parentNode.classList.add("biliscope-canvas-show");

    WordCloud(canvas, {
        list: JSON.parse(JSON.stringify(this.data["wordcloud"])),
        backgroundColor: "transparent",
        weightFactor: 100 / this.wordCloudMaxCount() * window.devicePixelRatio,
        shrinkToFit: true,
        minSize: biliScopeOptions.minSize * window.devicePixelRatio
    });
}

UserProfileCard.prototype.updateData = function (data) {
    let uid = data["uid"];
    let d = data["payload"];

    if (uid != this.userId) {
        return;
    }

    if (data["api"] == "stat") {
        this.data["follower"] = d["data"]["follower"];
        this.data["following"] = d["data"]["following"];
    } else if (data["api"] == "info") {
        if (d["code"] == -404) {
            this.valid = false;
            return;
        }
        this.valid = true;
        this.data["mid"] = d["data"]["mid"];
        this.data["name"] = d["data"]["name"];
        this.data["sex"] = d["data"]["sex"];
        this.data["face"] = d["data"]["face"].replace("http://", "https://");
        this.data["sign"] = d["data"]["sign"];
        this.data["level"] = d["data"]["level"];
        this.data["title"] = d["data"]["official"]["title"];
        this.data["title_type"] = d["data"]["official"]["type"];
        this.data["live_status"] = d["data"]["live_room"] ? d["data"]["live_room"]["liveStatus"]: 0;
        this.data["vip"] = d["data"]["vip"]["status"];
        this.data["top_photo"] = d["data"]["top_photo"].replace("http://", "https://");
        this.data["profession"] = d["data"]["profession"]["is_show"]
            ? `${d["data"]["profession"]["title"]} ${d["data"]["profession"]["department"]}`
            : "";
    } else if (data["api"] == "relation") {
        this.data["relation"] = d["data"]["relation"];
        this.data["be_relation"] = d["data"]["be_relation"];
    } else if (data["api"] == "count") {
        this.data["count"] = d["count"];
    } else if (data["api"] == "wordcloud") {
        this.data["wordcloud"] = d["word"];
        this.data["video_type"] = d["type"];
    } else if (data["api"] == "lastVideoTimestamp") {
        this.data["lastVideoTimestamp"] = d["timestamp"];
    } else if (data["api"] == "totalVideoInfo") {
        this.data["lastMonthVideoCount"] = d["lastMonthCount"];
        this.data["totalVideoLength"] = d["totalLength"];
    }

    if (data["api"] == "wordcloud") {
        let canvas = document.getElementById("word-cloud-canvas");
        if (this.data["wordcloud"].length > 0) {
            this.drawWordCloud(canvas);
            this.drawVideoTags();
        } else {
            canvas.style.height = "0px";
            canvas.height = 0;
        }
    } else if (this.data['name']) {
        // wait until name is ready
        document.getElementById("biliscope-id-card-data").innerHTML = getUserProfileCardDataHTML(this.data);
        this.setupTriggers();
        this.drawVideoTags();
    }

    if (this.enabled && this.valid && this.el && this.el.style.display != "flex") {
        this.clearOriginalCard();
        this.el.style.display = "flex";
    }

    this.updateCursor(this.cursorX, this.cursorY);
}

var guardInfo = null;

let biliTags = {};
let myMid = null;

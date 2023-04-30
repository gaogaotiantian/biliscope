function numberToDisplay(number) {
    if (number > 10000) {
        return `${(number / 10000).toFixed(1)}万`;
    }
    return number;
}

function timestampToDisplay(timestamp) {
    if (timestamp == null) {
        return ""
    }
    let date = new Date(timestamp * 1000);
    let timediff = Date.now() / 1000 - timestamp;
    const hour = 60 * 60;
    const day = 24 * hour;

    if (timediff < hour) {
        return "刚刚";
    } else if (timediff < day) {
        return `${Math.floor(timediff / hour)}小时前`;
    } else if (timediff < 30 * day) {
        return `${Math.floor(timediff / day)}天前`;
    } else {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
}

function secondsToDisplay(sec) {
    if (!sec) {
        return 0;
    }

    function digitToStr(n) {
        n = Math.floor(n);
        return n < 10 ? "0" + n : n;
    }

    sec = Math.floor(sec);

    if (sec < 60) {
        return `00:${digitToStr(sec)}`;
    } else if (sec < 60 * 60) {
        return `${digitToStr(sec / 60)}:${digitToStr(sec % 60)}`;
    } else {
        return `${digitToStr(sec / 60 / 60)}:${digitToStr(sec / 60) % 60}:${digitToStr(sec % 60)}`;
    }
}

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

function getUserProfileCardDataHTML(data) {
    return `
        <div class="idc-theme-img" style="background-image: url(&quot;${data["top_photo"]}@100Q.webp&quot;);">
        </div>
        <div class="idc-info clearfix">
            <a href="//space.bilibili.com/2051617240/" target="_blank" class="idc-avatar-container">
                <img alt="${data["name"]}" src="${data["face"]}@54w_54h_1c.webp" class="idc-avatar">
            </a>
            <div class="idc-content h">
                <div>
                    <a href="//space.bilibili.com/2051617240/" target="_blank" class="idc-username">
                        <b title="${data["name"]}" class="idc-uname" style="${data["vip"] ? "color: rgb(251, 114, 153);": "color: #18191C"}">
                            ${data["name"]}
                        </b>
                    </a>
                    <span class="gender biliscope-icon ${sexToClass(data["sex"])}"></span>
                </div>
                <div class="idc-meta">
                    <span class="idc-meta-item"><data-title>关注</data-title> ${data["following"] || 0}</span>
                    <span class="idc-meta-item"><data-title>粉丝</data-title> ${numberToDisplay(data["follower"]) || 0}</span>
                    <span class="idc-meta-item"><data-title>投稿</data-title> ${data["count"] || 0}</span>
                </div>
                <div class="idc-meta" style="${data["count"]} ? "": "display: none"}">
                    <span class="idc-meta-item"><data-title>近30天投稿数</data-title> ${data["lastMonthVideoCount"] || 0}</span>
                    <span class="idc-meta-item"><data-title>上次投稿</data-title> ${timestampToDisplay(data["lastVideoTimestamp"])}</span>
                </div>
                <div class="idc-meta" style="${data["count"]} ? "": "display: none"}">
                    <span class="idc-meta-item"><data-title>平均稿件长度</data-title> ${secondsToDisplay(data["totalVideoLength"] / data["count"])}</span>
                </div>
            </div>
            <div id="biliscope-tag-list">
            </div>
            <div class="idc-auth-description" style="${data["title"] ? "": "display: none"}">
                <span style="display: flex">
                    ${data["title"] ? `<a class="biliscope-auth-icon ${titleTypeToClass(data["title_type"])}"></a>` + data["title"] : ""}
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
    if (guardInfo == null) {
        return "";
    }

    let guard = guardInfo[data["mid"] % guardInfo.length];

    return `
        <div class="idc-guard-info">
            <span class="support-note" style="margin-right: 6px">感谢</span>
            <span class="item dp-i-block t-over-hidden t-nowrap border-box live-skin-main-text">
                <div class="fans-medal-item" style="border-color: rgb(103, 232, 255);">
                    <div class="fans-medal-label" style="background-image: linear-gradient(45deg, rgb(26, 84, 75), rgb(82, 157, 146));">
                        <i class="medal-deco medal-guard" style="background-image: url(&quot;https://i0.hdslb.com/bfs/live/143f5ec3003b4080d1b5f817a9efdca46d631945.png@44w_44h.webp&quot;);"></i>
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
            <div id="word-cloud-canvas-wrapper">
                <canvas id="word-cloud-canvas" style="width: 100%; height: 0"></canvas>
            </div>
        </div>
    `
}

function UserProfileCard() {
    this.userId = null;
    this.data = {};
    this.cursorX = 0;
    this.cursorY = 0;
    this.target = null;
    this.enabled = false;
    this.wordCloud = null;
    this.lastDisable = 0;
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
}

UserProfileCard.prototype.disable = function() {
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
}

UserProfileCard.prototype.enable = function() {
    if (!this.enabled && Date.now() - this.lastDisable > 50) {
        this.enabled = true;
        this.idCardObserver.observe(document.body, {
            "childList": true,
            "subtree": true
        })
        return true;
    }
    return false;
}

UserProfileCard.prototype.checkTargetValid = function(target) {
    if (this.enabled && this.target) {
        while (target) {
            if (target == this.target) {
                return;
            }
            target = target.parentNode;
        }
        this.disable();
    }
}

UserProfileCard.prototype.clearOriginalCard = function() {
    while (document.getElementById("id-card")) {
        document.getElementById("id-card").remove();
    }

    for (let card of document.getElementsByClassName("user-card")) {
        card.remove();
    }

    for (let card of document.getElementsByClassName("card-loaded")) {
        card.remove();
    }
}

UserProfileCard.prototype.updateUserId = function(userId) {
    this.userId = userId;
}

UserProfileCard.prototype.updateCursor = function(cursorX, cursorY) {
    const cursorPadding = 10;
    const windowPadding = 20;

    this.cursorX = cursorX;
    this.cursorY = cursorY;

    if (this.el) {
        let width = this.el.scrollWidth;
        let height = this.el.scrollHeight;

        if (this.cursorX + width + windowPadding > window.scrollX + window.innerWidth) {
            // Will overflow to the right, put it on the left
            this.el.style.left = `${this.cursorX - cursorPadding - width}px`;
        } else {
            this.el.style.left = `${this.cursorX + cursorPadding}px`;
        }

        if (this.cursorY + height + windowPadding > window.scrollY + window.innerHeight) {
            // Will overflow to the bottom, put it on the top
            this.el.style.top = `${this.cursorY - cursorPadding - height}px`;
        } else {
            this.el.style.top = `${this.cursorY + cursorPadding}px`;
        }
    }
}

UserProfileCard.prototype.updateTarget = function(target) {
    this.target = target;
    upc = this
    this.target.addEventListener("mouseleave", function leaveHandle(ev) {
        upc.disable();
        upc.lastDisable = Date.now();
        this.removeEventListener("mouseleave", leaveHandle);
    })
}

UserProfileCard.prototype.wordCloudMaxCount = function() {
    let m = 0;
    for (let d of this.data["wordcloud"]) {
        if (d[1] > m) {
            m = d[1];
        }
    }
    return m;
}

UserProfileCard.prototype.drawVideoTags = function() {
    let tagList = document.getElementById("biliscope-tag-list");
    tagList.innerHTML = "";
    if (this.data["video_type"]) {
        for (let d of this.data["video_type"]) {
            if (BILIBILI_VIDEO_TYPE_MAP[d[0]]) {
                let el = document.createElement("span");
                el.className = "biliscope-badge";
                el.innerHTML = BILIBILI_VIDEO_TYPE_MAP[d[0]];
                tagList.appendChild(el);
            }
        }
    }
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
        this.data["mid"] = d["data"]["mid"];
        this.data["name"] = d["data"]["name"];
        this.data["sex"] = d["data"]["sex"];
        this.data["face"] = d["data"]["face"].replace("http://", "https://");
        this.data["sign"] = d["data"]["sign"];
        this.data["title"] = d["data"]["official"]["title"];
        this.data["title_type"] = d["data"]["official"]["type"];
        this.data["vip"] = d["data"]["vip"]["status"];
        this.data["top_photo"] = d["data"]["top_photo"].replace("http://", "https://");
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
            canvas.style.height = `${canvas.offsetWidth / 2}px`;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            canvas.parentNode.classList.add("biliscope-canvas-show");

            WordCloud(canvas, {
                list: JSON.parse(JSON.stringify(this.data["wordcloud"])),
                backgroundColor: "transparent",
                weightFactor: 100 / this.wordCloudMaxCount(),
                shrinkToFit: true,
                minSize: 5
            });
            this.drawVideoTags();
        } else {
            canvas.style.height = "0px";
            canvas.height = 0;
        }
    } else if (this.data['name']) {
        // wait until name is ready
        document.getElementById("biliscope-id-card-data").innerHTML = getUserProfileCardDataHTML(this.data);
        this.drawVideoTags();
    }

    if (this.enabled && this.el && this.el.style.display != "flex") {
        this.clearOriginalCard();
        this.el.style.display = "flex";
    }

    this.updateCursor(this.cursorX, this.cursorY);
}

userProfileCard = new UserProfileCard();

getGuardInfo(6726252, 245645656).then((data) => {
    guardInfo = data;
    // Shuffle guardInfo
    for (let i = 0; i < guardInfo.length; i++) {
        let j = Math.floor(Math.random() * guardInfo.length);
        let t = guardInfo[i];
        guardInfo[i] = guardInfo[j];
        guardInfo[j] = t;
    }
});

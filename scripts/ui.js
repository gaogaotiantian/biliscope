function numberToDisplay(number) {
    if (number > 10000) {
        return `${(number / 10000).toFixed(1)}万`;
    }
    return number;
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
                        <b title="${data["name"]}" class="idc-uname" style="${data["vip"] ? "color: rgb(251, 114, 153);": ""}">
                            ${data["name"]}
                        </b>
                    </a>
                    <span class="gender icon ${sexToClass(data["sex"])}"></span>
                    <a lvl="6" href="//www.bilibili.com/html/help.html#k" target="_blank" class="m-level idc-m-level"></a>
                </div>
                <div class="idc-meta">
                    <span class="idc-meta-item">关注 ${data["following"]}</span>
                    <span class="idc-meta-item">粉丝 ${numberToDisplay(data["follower"])}</span>
                    <span class="idc-meta-item">投稿 ${data["count"]}</span>
                </div>
            </div>
            <div class="tag-list idc-tag-list"></div>
            <div class="idc-auth-description">
                <span style="display: flex">
                    ${data["title"] ? `<a class="biliscope-auth-icon ${titleTypeToClass(data["title_type"])}"></a>` + data["title"] : ""}
                </span>
            </div>
            <div class="idc-auth-description">
                ${data["sign"]}
            </div>
        </div>
    `
}
function getUserProfileCardHTML(data) {
    return `
        <div id="id-card" style="position: absolute;">
            <div id="id-card-data">
                ${getUserProfileCardDataHTML(data)}
            </div>
            <canvas id="word-cloud-canvas" style="width: 100%; height: 0"></canvas>
        </div>
    `
}

function UserProfileCard()
{
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
    this.el.innerHTML = getUserProfileCardHTML(this.data);
    this.disable();
    document.body.appendChild(this.el);
}

UserProfileCard.prototype.disable = function()
{
    this.userId = null;
    this.enabled = false;
    if (this.el) {
        this.el.style.display = "none";
        let canvas = document.getElementById("word-cloud-canvas");
        if (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

UserProfileCard.prototype.enable = function(userId)
{
    if (userId != null && userId != this.userId && Date.now() - this.lastDisable > 50) {
        this.enabled = true;
        return true;
    }
    return false;
}

UserProfileCard.prototype.updateUserId = function(userId)
{
    this.userId = userId;
}

UserProfileCard.prototype.updateCursor = function(cursorX, cursorY)
{
    this.cursorX = cursorX;
    this.cursorY = cursorY;
    if (this.el) {
        this.el.style.top = `${this.cursorY + 30}px`;
        this.el.style.left = `${this.cursorX + 30}px`;
    }
}

UserProfileCard.prototype.updateTarget = function(target)
{
    this.target = target;
    upc = this
    this.target.addEventListener("mouseleave", function leaveHandle(ev) {
        upc.disable();
        upc.lastDisable = Date.now();
        this.removeEventListener("mouseleave", leaveHandle);
    })
}

UserProfileCard.prototype.wordCloudMaxCount = function ()
{
    let m = 0;
    for (let d of this.data["wordcloud"]) {
        if (d[1] > m) {
            m = d[1];
        }
    }
    return m;
}

UserProfileCard.prototype.updateData = function (data)
{
    let uid = data["uid"];
    let d = data["payload"];

    if (uid != this.userId) {
        return;
    }

    if (data["api"] == "stat") {
        this.data["follower"] = d["data"]["follower"];
        this.data["following"] = d["data"]["following"];
    } else if (data["api"] == "info") {
        this.data["name"] = d["data"]["name"];
        this.data["sex"] = d["data"]["sex"];
        this.data["face"] = d["data"]["face"];
        this.data["sign"] = d["data"]["sign"];
        this.data["title"] = d["data"]["official"]["title"];
        this.data["title_type"] = d["data"]["official"]["type"];
        this.data["vip"] = d["data"]["vip"]["status"];
        this.data["top_photo"] = d["data"]["top_photo"];
    } else if (data["api"] == "count") {
        this.data["count"] = d["count"];
    } else if (data["api"] == "wordcloud") {
        this.data["wordcloud"] = d;
    }

    if (data["api"] == "wordcloud") {
        let canvas = document.getElementById("word-cloud-canvas");
        canvas.style.height = `${canvas.offsetWidth / 2}px`;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        WordCloud(canvas, {
            list: this.data["wordcloud"],
            backgroundColor: "transparent",
            weightFactor: 100 / this.wordCloudMaxCount(),
            shrinkToFit: true,
            minSize: 3
        });
    } else {
        document.getElementById("id-card-data").innerHTML = getUserProfileCardDataHTML(this.data);
    }

    if (this.enable && this.el) {
        this.el.style.display = "flex";
    }
}

userProfileCard = new UserProfileCard();

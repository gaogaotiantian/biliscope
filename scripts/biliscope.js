BILIBILI_SPACE_URL = "https://space.bilibili.com/"
BILIBILI_POPULAR_URL = "https://www.bilibili.com/v/popular"

document.addEventListener("mouseover", showProfile);
document.addEventListener("mousemove", (ev) => userProfileCard.updateCursor(ev.pageX, ev.pageY));

biliScopeOptions = null;

chrome.storage.sync.get({
    enableWordCloud: true
}, function(items) {
    biliScopeOptions = items;
});

function getUserId(s)
{
    let regex = /.*?bilibili.com\/([0-9]*)([^\/]*|\/)$/;
    let userId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return userId;
}

async function getUserTarget(target)
{
    let userId = null;

    for (let userLink of [target, target.parentNode]) {
        if (userLink.tagName == "A" && userLink.href.startsWith(BILIBILI_SPACE_URL)) {
            if (userLink.hasAttribute("report-id")) {
                // Video page, the uploader name link, avoid overlap
                return null;
            }
            userId = getUserId(userLink.href);
            if (userId) {
                return {"userId": userId, "target": userLink};
            }
        } 
    }

    if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
        // popular page, requires special treatment
        for (let userLink of [target, target.parentNode]) {
            if (userLink.classList && userLink.classList.contains("up-name__text")) {
                let node = userLink;
                while (node = node.parentNode) {
                    if (node.classList.contains("video-card")) {
                        let videoLink = node.getElementsByTagName("a")[0];
                        let userId = await getUserIdFromVideoLink(videoLink.href);
                        if (userId) {
                            return {"userId": userId, "target": userLink};
                        }
                    }
                }
            }
        }
    }

    return null;
}

function showProfile(event)
{
    if (!this.hasOwnProperty("_enable")) {
        this._enable = true;
    }

    if (this._enable) {
        this._enable = false;
        getUserTarget(event.target).then((userTarget) => {
            this._enable = true;
            if (userTarget) {
                let userId = userTarget.userId;
                let target = userTarget.target;

                if (userProfileCard.enable(userId)) {
                    userProfileCard.updateUserId(userId);
                    userProfileCard.updateCursor(event.pageX, event.pageY);
                    userProfileCard.updateTarget(target);
                    updateUserInfo(userId, (data) => userProfileCard.updateData(data));
                }
            }
        })
    }
}

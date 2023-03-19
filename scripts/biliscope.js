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

function getUserIdFromLink(s)
{
    let regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/)$/;
    let userId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return userId;
}

async function getUserId(userLink)
{
    let userId = null;

    if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
        // popular page, requires special treatment
        let node = userLink;
        while (node = node.parentNode) {
            if (node.classList.contains("video-card")) {
                let videoLink = node.getElementsByTagName("a")[0];
                userId = await getUserIdFromVideoLink(videoLink.href);
                break;
            }
        }
    } else {
        userId = getUserIdFromLink(userLink.href);
    }

    if (userId) {
        return userId;
    }

    return null;
}

function getTarget(target)
{
    if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
        // popular page, requires special treatment
        for (let userLink of [target, target.parentNode]) {
            if (userLink.classList && userLink.classList.contains("up-name__text")) {
                return userLink;
            }
        }
    } else {
        for (let userLink of [target, target.parentNode]) {
            if (userLink.tagName == "A" && userLink.href.startsWith(BILIBILI_SPACE_URL)) {
                if (userLink.hasAttribute("report-id")) {
                    // Video page, the uploader name link, avoid overlap
                    return null;
                }
                return userLink;
            }
        }
    }

    return null;
}

function showProfile(event)
{
    let target = getTarget(event.target);

    if (target && userProfileCard.enable()) {
        userProfileCard.updateCursor(event.pageX, event.pageY);
        userProfileCard.updateTarget(target);
        getUserId(target).then((userId) => {
            if (userId) {
                if (userId != userProfileCard.userId) {
                    userProfileCard.updateUserId(userId);
                    updateUserInfo(userId, (data) => userProfileCard.updateData(data));
                }
            } else {
                userProfileCard.disable();
            }
        })
    } else {
        userProfileCard.checkTargetValid(event.target);
    }
}

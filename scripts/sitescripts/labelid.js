// These could be redefined in the other site scripts so use var instead of const
var BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
var BILIBILI_NEW_DYNAMIC_URL = "https://www.bilibili.com/opus"
var BILIBILI_SPACE_URL = "https://space.bilibili.com"
var BILIBILI_POPULAR_URL = "https://www.bilibili.com/v/popular"
var BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"

function getUserIdFromLink(s) {
    let regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/|\/\?.*)$/;
    let userId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return userId;
}

function getVideoIdFromLink(s) {
    let regex = /.*?bilibili.com\/video\/(BV[1-9a-zA-Z]{10})(\/|\/\?.*)?$/;
    let videoId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return videoId;
}

function labelPopularPage() {
    for (let el of document.getElementsByClassName("video-card")) {
        let mid = el.__vue__.videoData.owner.mid;
        if (mid) {
            el.getElementsByClassName("up-name__text")[0].setAttribute("biliscope-userid", mid);
        }
    }
}

function labelDynamicPage() {
    for (let el of document.getElementsByClassName("bili-dyn-item")) {
        let mid = el.__vue__.author.mid;
        if (mid) {
            el.getElementsByClassName("bili-dyn-item__avatar")[0].setAttribute("biliscope-userid", mid);
        }
    }

    for (let el of document.getElementsByClassName("bili-dyn-title")) {
        let mid = el.__vue__.author.mid;
        if (mid) {
            el.getElementsByClassName("bili-dyn-title__text")[0].setAttribute("biliscope-userid", mid);
        }
    }

    for (let el of document.getElementsByClassName("bili-dyn-up-list")) {
        let upList = el.__vue__.list;
        let upElements = el.getElementsByClassName("bili-dyn-up-list__item");
        for (let idx = 0; idx < upList.length; idx++) {
            // It's a bit hacky, but the first element is "all", so we start from the second one
            let up = upElements[idx + 1];
            up.setAttribute("biliscope-userid", upList[idx].mid);
        }
    }

    for (let className of ["user-name", "root-reply-avatar", "sub-user-name", "sub-reply-avatar"]) {
        for (let el of document.getElementsByClassName(className)) {
            let mid = el.getAttribute("data-user-id");
            if (mid) {
                el.setAttribute("biliscope-userid", mid);
            }
        }
    }
}

function labelVideoPage() {
    for (let el of document.querySelectorAll(".user-name,.root-reply-avatar,.sub-user-name,.sub-reply-avatar")) {
        let mid = el.getAttribute("data-user-id");
        if (mid) {
            el.setAttribute("biliscope-userid", mid);
        }
    }
}

function labelLinks() {
    for (let el of document.getElementsByTagName("a")) {
        if (el.href.startsWith(BILIBILI_SPACE_URL)) {
            let userId = getUserIdFromLink(el.href);
            if (userId) {
                el.setAttribute("biliscope-userid", userId);
            }
        } else if (el.classList.contains("jump-link")) {
            let userId = el.getAttribute("data-user-id");
            if (userId) {
                el.setAttribute("biliscope-userid", userId);
            }
        } else if (el.href.startsWith(BILIBILI_VIDEO_URL)) {
            let videoId = getVideoIdFromLink(el.href);
            if (videoId) {
                el.setAttribute("biliscope-videoid", videoId);
            }
        }
    }
}


function installIdHooks() {
    let pageObserver = new MutationObserver((mutationList, observer) => {
        labelLinks();

        if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
            labelPopularPage();
        } else if (window.location.href.startsWith(BILIBILI_DYNAMIC_URL) ||
                   window.location.href.startsWith(BILIBILI_NEW_DYNAMIC_URL)) {
            labelDynamicPage();
        } else if (window.location.href.startsWith(BILIBILI_VIDEO_URL)) {
            labelVideoPage();
        }
    })

    pageObserver.observe(document.body, {
        childList: true,
        subtree: true,
    })

}

installIdHooks()

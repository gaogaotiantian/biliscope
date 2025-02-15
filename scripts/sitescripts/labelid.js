// These could be redefined in the other site scripts so use var instead of const
var BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
var BILIBILI_DYNAMIC_DETAIL_URL = "https://www.bilibili.com/opus"
var BILIBILI_SPACE_URL = "https://space.bilibili.com"
var BILIBILI_POPULAR_URL = "https://www.bilibili.com/v/popular"
var BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"
var BILIBILI_WATCH_LATER_URL = "https://www.bilibili.com/list/watchlater"
var BILIBILI_CM_URL = "https://cm.bilibili.com"

function getUserIdFromLink(s) {
    let regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/|\/\?.*)$/;
    let userId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return userId;
}

function getVideoIdFromLink(link) {
    const regexBV = /(BV[1-9a-zA-Z]{10})/g;
    return link.match(regexBV)?.[0];
}

function elementImageChildren(el) {
    return el.querySelector("img") || el.querySelector("picture");
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
        const {mid, type} = el.__vue__.author;
        if (mid && type == "AUTHOR_TYPE_NORMAL") {
            el.getElementsByClassName("bili-dyn-item__avatar")[0].setAttribute("biliscope-userid", mid);
        }
    }

    for (let el of document.getElementsByClassName("bili-dyn-title")) {
        const {mid, type} = el.__vue__.author;
        if (mid && type == "AUTHOR_TYPE_NORMAL") {
            el.getElementsByClassName("bili-dyn-title__text")[0].setAttribute("biliscope-userid", mid);
        }
    }

    for (const el of document.querySelectorAll(".dyn-orig-author__face, .dyn-orig-author__name")) {
        const uid = el?._profile?.uid;
        if (uid) {
            el.setAttribute("biliscope-userid", uid);
        }
    }

    for (const el of document.getElementsByClassName("bili-rich-text-module at")) {
        const uid = el?._profile?.uid;
        if (uid) {
            el.setAttribute("biliscope-userid", uid);
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
}

function labelOldComments() {
    for (const el of document.querySelectorAll(".user-name, .root-reply-avatar, .sub-user-name, .sub-reply-avatar")) {
        const mid = el.getAttribute("data-user-id");
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
        } else if (el.href.startsWith(BILIBILI_CM_URL)) {
            let url = new URL(el.href);
            let userId = url.searchParams.get("space_mid");
            if (userId) {
                el.setAttribute("biliscope-userid", userId);
            }
        } else if (el.href.startsWith(BILIBILI_VIDEO_URL) ||
                   el.href.startsWith(BILIBILI_WATCH_LATER_URL)) {
            const videoId = getVideoIdFromLink(el.href);
            if (videoId && elementImageChildren(el)) {
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
                   window.location.href.startsWith(BILIBILI_DYNAMIC_DETAIL_URL) ||
                   window.location.href.startsWith(BILIBILI_SPACE_URL)) {
            labelDynamicPage();
            labelOldComments();
        }
    })

    pageObserver.observe(document.body, {
        childList: true,
        subtree: true,
    })

}

installIdHooks()

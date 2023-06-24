const BILIBILI_DYNAMIC_URL = "https://t.bilibili.com/"
const BILIBILI_SPACE_URL = "https://space.bilibili.com/"
const BILIBILI_POPULAR_URL = "https://www.bilibili.com/v/popular"
const BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"
const BILIBILI_SEARCH_URL = "https://search.bilibili.com/"

var pageObserver = null;

function getUserIdFromLink(s) {
    let regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/|\/\?.*)$/;
    let userId = null;

    if (s && s.match(regex)) {
        return s.match(regex)[1];
    }
    return userId;
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
        }
    }
}

function installHooks() {
    pageObserver = new MutationObserver((mutationList, observer) => {
        labelLinks();

        if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
            labelPopularPage();
        } else if (window.location.href.startsWith(BILIBILI_DYNAMIC_URL)) {
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

installHooks()

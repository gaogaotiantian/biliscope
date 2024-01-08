const BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
const BILIBILI_SPACE_URL = "https://space.bilibili.com"
const BILIBILI_POPULAR_URL = "https://www.bilibili.com/v/popular"
const BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"

function getUserIdFromLink(s) {
    const regex = /.*?bilibili.com\/([0-9]*)(\/dynamic)?([^\/]*|\/|\/\?.*)$/;
    const match = s?.match(regex);
    if (!match) {
        return null;
    }

    return match[1];
}

function labelPopularPage() {
    for (let el of document.getElementsByClassName("video-card")) {
        let {mid} = el.__vue__.videoData.owner;
        if (mid) {
            el.getElementsByClassName("up-name__text")[0].setAttribute("biliscope-userid", mid);
        }
    }
}

function labelDynamicPage() {
    for (let el of document.getElementsByClassName("bili-dyn-item")) {
        let {mid} = el.__vue__.author;
        if (mid) {
            el.getElementsByClassName("bili-dyn-item__avatar")[0].setAttribute("biliscope-userid", mid);
        }
    }

    for (let el of document.getElementsByClassName("bili-dyn-title")) {
        let {mid} = el.__vue__.author;
        if (mid) {
            el.getElementsByClassName("bili-dyn-title__text")[0].setAttribute("biliscope-userid", mid);
        }
    }

    for (let el of document.getElementsByClassName("bili-dyn-up-list")) {
        const upList = el.__vue__.list;
        let upElements = Array.from(el.getElementsByClassName("bili-dyn-up-list__item"));

        // the first element is "all dynamics", so we start from the second one
        upElements = upElements.slice(1);

        upElements.forEach((up, index) => {
            up.setAttribute("biliscope-userid", upList[index].mid);
        })
    }

    labelVideoPage();
}

function labelVideoPage() {
    for (let el of document.querySelectorAll(".user-name, .root-reply-avatar, .sub-user-name, .sub-reply-avatar")) {
        let mid = el.getAttribute("data-user-id");
        if (mid) {
            el.setAttribute("biliscope-userid", mid);
        }
    }
}

function labelLinks() {
    for (let el of document.getElementsByTagName("a")) {
        let mid;

        if (el.href.startsWith(BILIBILI_SPACE_URL)) {
            mid = getUserIdFromLink(el.href);
        } else if (el.classList.contains("jump-link")) {
            mid = el.getAttribute("data-user-id");
        }

        if (mid) {
            el.setAttribute("biliscope-userid", mid);
        }
    }
}

function installHooks() {
    let pageObserver = new MutationObserver((mutationList, observer) => {
        labelLinks();

        let {href} = window.location;
        if (href.startsWith(BILIBILI_POPULAR_URL)) {
            labelPopularPage();
        } else if (href.startsWith(BILIBILI_DYNAMIC_URL)) {
            labelDynamicPage();
        } else if (href.startsWith(BILIBILI_VIDEO_URL)) {
            labelVideoPage();
        }
    })

    pageObserver.observe(document.body, {
        childList: true,
        subtree: true,
    })
}

installHooks()

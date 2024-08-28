// These could be redefined in the other site scripts so use var instead of const
var BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
var BILIBILI_NEW_DYNAMIC_URL = "https://www.bilibili.com/opus"
var BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"
var BILIBILI_SPACE_URL = "https://space.bilibili.com"
var BILIBILI_WATCH_LATER_URL = "https://www.bilibili.com/list/watchlater"

function labelDynamicPage() {
    for (const el of document.getElementsByClassName("bili-dyn-card-video")) {
        el.setAttribute("biliscope-display", "vertical");
    }
}

function labelSpacePage() {
    // up 空间页只有一个代表作
    document.getElementsByClassName("cover i-pin-c cover-big")[0]
            .setAttribute("biliscope-display", "vertical");
}

function labelPopularPage() {
    document.querySelector(".popular-container > :last-child")
            .querySelectorAll("[biliscope-videoid]:not(.title)")
            .forEach(el => {
        el.setAttribute("biliscope-display", "vertical");
    });
}

function labelVideoPage() {
    // 视频页右侧的推荐视频
    document.querySelectorAll("#reco_list [biliscope-videoid]")
            .forEach(el => {
        el.setAttribute("biliscope-display", "vertical");
    });
}

function installIpHooks() {
    const displayObserver = new MutationObserver((mutationList, observer) => {
        if (window.location.href.startsWith(BILIBILI_DYNAMIC_URL) ||
            window.location.href.startsWith(BILIBILI_NEW_DYNAMIC_URL) ||
            window.location.href.startsWith(BILIBILI_SPACE_URL) &&
            window.location.pathname.endsWith("/dynamic")) {
            labelDynamicPage();
        } else if (window.location.href.startsWith(BILIBILI_SPACE_URL) &&
                   window.location.pathname.match(/\/\d+/)) {
            labelSpacePage();
        } else if (window.location.href.startsWith(BILIBILI_VIDEO_URL) ||
                   window.location.href.startsWith(BILIBILI_WATCH_LATER_URL)) {
            labelVideoPage();
        }
    });
    displayObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

installIpHooks();

const BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
const BILIBILI_SPACE_URL = "https://space.bilibili.com"
const BILIBILI_POPULAR_URL = "https://www.bilibili.com/v/popular"
const BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"

var pageObserver = null;
var ipObserver = null;

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

function labelReplyIP(observer) {

    function tryObserve(root) {
        if (root) {
            observer.observe(root, {
                childList: true,
                subtree: true,
            })
        }
    }

    if (window.location.href.startsWith(BILIBILI_VIDEO_URL)) {
        const comments = document.getElementsByTagName("bili-comments")[0];
        const feed = comments?.renderRoot?.children?.contents?.children?.feed;

        tryObserve(comments?.renderRoot);

        if (!feed) {
            return;
        }

        for (const commentStack of feed.children) {
            const mainComment = commentStack.shadowRoot.children.comment;
            const replies = commentStack.shadowRoot.children?.replies;
            let roots = [];

            tryObserve(commentStack.shadowRoot);

            if (mainComment) {
                roots.push(mainComment.shadowRoot);
            }

            if (replies) {
                tryObserve(replies.children[0].shadowRoot);
                for (const reply of replies.children[0].shadowRoot.querySelectorAll("bili-comment-reply-renderer")) {
                    roots.push(reply.shadowRoot)
                }
            }

            for (let root of roots) {
                const data = root.getElementById("footer")?.children[0].__data;
                const replyControlRoot = root.getElementById("footer")?.children[0].shadowRoot;
                tryObserve(root);
                tryObserve(replyControlRoot);
                if (replyControlRoot && !replyControlRoot.getElementById("ip") && data?.reply_control?.location && replyControlRoot.children.like) {
                    const ipDiv = document.createElement("div");
                    ipDiv.id = "ip";
                    ipDiv.innerText = data?.reply_control?.location;
                    replyControlRoot.insertBefore(ipDiv, replyControlRoot.children.like);
                }
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

    ipObserver = new MutationObserver((mutationList, observer) => {
        if (window.location.href.startsWith(BILIBILI_VIDEO_URL)) {
            labelReplyIP(ipObserver);
        }
    });

    ipObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

installHooks()

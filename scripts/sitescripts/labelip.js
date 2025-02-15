// These could be redefined in the other site scripts so use var instead of const
var BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
var BILIBILI_DYNAMIC_DETAIL_URL = "https://www.bilibili.com/opus"
var BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"
var BILIBILI_SPACE_URL = "https://space.bilibili.com"
var BILIBILI_WATCH_LATER_URL = "https://www.bilibili.com/list/watchlater"

function labelVideoCommentIp(observer) {

    function tryObserve(root) {
        if (root) {
            observer.observe(root, {
                childList: true,
                subtree: true,
            })
        }
    }

    const comments = document.getElementsByTagName("bili-comments");

    for (const comment of comments) {
        const feed = comment?.shadowRoot?.children?.contents?.children?.feed;

        tryObserve(comment?.shadowRoot);

        if (!feed) {
            return;
        }

        for (const commentStack of feed.children) {
            const mainComment = commentStack.shadowRoot.children.comment;
            const replies = commentStack.shadowRoot.children?.replies;
            const roots = [];

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

            for (const root of roots) {
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

function installIpHooks() {
    if (window.location.href.startsWith(BILIBILI_SPACE_URL) ||
        window.location.href.startsWith(BILIBILI_DYNAMIC_URL) ||
        window.location.href.startsWith(BILIBILI_DYNAMIC_DETAIL_URL) ||
        window.location.href.startsWith(BILIBILI_VIDEO_URL) ||
        window.location.href.startsWith(BILIBILI_WATCH_LATER_URL)) {
        const ipObserver = new MutationObserver((mutationList, observer) => {
            labelVideoCommentIp(ipObserver);
        });
        ipObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

installIpHooks();

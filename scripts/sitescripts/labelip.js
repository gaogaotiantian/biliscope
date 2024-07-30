// These could be redefined in the other site scripts so use var instead of const
var BILIBILI_DYNAMIC_URL = "https://t.bilibili.com"
var BILIBILI_NEW_DYNAMIC_URL = "https://www.bilibili.com/opus"
var BILIBILI_VIDEO_URL = "https://www.bilibili.com/video"
var BILIBILI_SPACE_URL = "https://space.bilibili.com"

function labelVideoCommentIp(observer) {

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

function labelDynamicCommentIp() {
    const replyItems = document.getElementsByClassName("reply-item");

    for (const replyItem of replyItems) {
        const replyInfo = replyItem.getElementsByClassName("reply-info")[0];
        const replyLike = replyInfo?.getElementsByClassName("reply-like")[0];
        if (replyInfo &&
            replyLike &&
            replyInfo.getElementsByClassName("reply-ip").length == 0 &&
            replyItem?.__vue__?.props?.reply?.reply_control?.location) {
            const ip = document.createElement("span");
            ip.classList.add("reply-ip");
            ip.style.marginRight = window.getComputedStyle(replyLike).marginRight;
            ip.innerText = replyItem.__vue__.props.reply.reply_control.location;
            replyInfo.insertBefore(ip, replyLike);
        }
    }

    const subReplyItems = document.getElementsByClassName("sub-reply-item");

    for (const subReplyItem of subReplyItems) {
        const subReplyInfo = subReplyItem.getElementsByClassName("sub-reply-info")[0];
        const subReplyLike = subReplyInfo?.getElementsByClassName("sub-reply-like")[0];
        if (subReplyInfo &&
            subReplyLike &&
            subReplyInfo.getElementsByClassName("sub-reply-ip").length == 0 &&
            subReplyItem?.__vue__?.props?.subReply?.reply_control?.location) {
            const ip = document.createElement("span");
            ip.classList.add("sub-reply-ip");
            ip.style.marginRight = window.getComputedStyle(subReplyLike).marginRight;
            ip.innerText = subReplyItem.__vue__.props.subReply.reply_control.location;
            subReplyInfo.insertBefore(ip, subReplyLike);
        }
    }
}

function hookVueComponent() {
    // Edited from https://greasyfork.org/users/809466
    const realProxy = window.Proxy;

    function watchUnmount(app) {
        let value = app.isUnmounted;

        Object.defineProperty(app, "isUnmounted", {
            get() {
                return value;
            },
            set(newValue) {
                value = newValue;
                if (this?.vnode?.el) {
                    this.vnode.el.__vue__ = null;
                }
            }
        })
    }

    function watchEl(vnode) {
        let value = vnode.el;
        Object.defineProperty(vnode, "el", {
            get() {
                return value;
            },
            set(newValue) {
                value = newValue;
                if (newValue) {
                    newValue.__vue__ = this.component;
                    watchUnmount(this.component);
                }
            }
        })
    }

    window.Proxy = function() {
        const app = arguments[0]._;
        if (app?.uid >= 0) {
            const el = app.vnode.el;
            if (el) {
                el.__vue__ = app;
                watchUnmount(app);
            } else {
                watchEl(app.vnode);
            }
        }
        return new realProxy(...arguments);
    }
}

function installIpHooks() {
    const {href, pathname} = window.location;

    if (href.startsWith(BILIBILI_DYNAMIC_URL) ||
        href.startsWith(BILIBILI_NEW_DYNAMIC_URL) ||
        (href.startsWith(BILIBILI_SPACE_URL) && pathname.endsWith("dynamic"))) {
        hookVueComponent();
        let ipObserver = new MutationObserver((mutationList, observer) => {
            labelDynamicCommentIp();
        });
        ipObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    if (href.startsWith(BILIBILI_VIDEO_URL)) {
        let ipObserver = new MutationObserver((mutationList, observer) => {
            labelVideoCommentIp(ipObserver);
        });
        ipObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

installIpHooks();

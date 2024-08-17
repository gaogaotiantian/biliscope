let optionLoad = chrome.storage.sync.get({
    enableUpCard: true,
    enableBlockButton: true,
    enableRollbackFeedcard: true,
    enableWordCloud: true,
    enableAiSummary: true,
    aiSummaryHoverThreshold: 800,
    enableVideoTag: true,
    enableIpLabel: true,
    enableFoldDynamicComment: true,
    minSize: 5
});

window.addEventListener("load", function() {

    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('scripts/sitescripts/labelid.js');
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);

    optionLoad.then((items) => {
        biliScopeOptions = items;

        // Load the user profile card
        userProfileCard = new UserProfileCard();
        videoProfileCard = new VideoProfileCard();
        this.document.addEventListener("mouseover", showProfileDebounce);

        if (biliScopeOptions.enableIpLabel) {
            s = document.createElement('script');
            s.src = chrome.runtime.getURL('scripts/sitescripts/labelip.js');
            s.onload = function() { this.remove(); };
            (document.head || document.documentElement).appendChild(s);
        }

        if (biliScopeOptions.enableRollbackFeedcard && document.location.pathname == '/' && document.location.hostname == 'www.bilibili.com') {
            const feedRollBtn = document.querySelector('.feed-roll-btn');
            const rollBtn = document.querySelector('.roll-btn');
            if (feedRollBtn && rollBtn) {
                feedcardManager.addButton(feedRollBtn);
                rollBtn.addEventListener('click', () => {
                    feedcardManager.onRollFeedcard()
                });
            }
        }

        if (biliScopeOptions.enableFoldDynamicComment) {
            const selectors = [];
            if (window.location.href.startsWith(BILIBILI_SPACE_URL)) {
                selectors.push("div:has(> #page-dynamic)");
                selectors.push("#page-dynamic");
            } else if (window.location.href.startsWith(BILIBILI_DYNAMIC_URL)) {
                selectors.push("aside.left");
                selectors.push("aside.right");
            }

            const pageObserver = new MutationObserver((mutationList, observer) => {
                const targets = document.querySelectorAll(selectors.join(","));
                if (targets.length == 0) {
                    return;
                }

                for (const target of targets) {
                    target.addEventListener('click', (ev) => {
                        if (ev.target == target) {
                            // 只找有评论区的
                            for (const el of document.querySelectorAll(".bili-dyn-item:has(.bili-dyn-item__panel)")) {
                                if (el.getBoundingClientRect().top < ev.y && ev.y < el.getBoundingClientRect().bottom) {
                                    // 65为顶栏高度
                                    const topBoundary = el.querySelector(".bili-dyn-item__panel").getBoundingClientRect().top - 65;
                                    if (topBoundary < 0) {
                                        window.scrollBy({top: topBoundary});
                                    }

                                    el.getElementsByClassName("bili-dyn-action comment active")[0].click();
                                }
                            }
                        }
                    })
                }

                pageObserver.disconnect();
            })

            if (selectors.length != 0) {
                pageObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                })
            }
        }

        const hookComment = (retry) => {
            if (retry < 1) {
                return;
            }

            if (!document.querySelector("bili-comments")?.shadowRoot
                 .querySelector("bili-comment-thread-renderer")?.shadowRoot
                 .querySelector("bili-comment-renderer")) {
                setTimeout(() => hookComment(retry-1), 500);
                return;
            }

            document.querySelector("bili-comments").shadowRoot
            .querySelectorAll("bili-comment-thread-renderer")
            .forEach(element => {
                const renderer = element.shadowRoot
                                 .querySelector("bili-comment-renderer")
                const avatar = renderer.shadowRoot.getElementById("user-avatar");
                avatar.addEventListener("mouseover", showProfileDebounce);

                const userNameA = renderer.shadowRoot
                                  .querySelector("bili-comment-user-info").shadowRoot
                                  .querySelector("#user-name > a");
                userNameA.addEventListener("mouseover", showProfileDebounce);

                const replies = element.shadowRoot
                                .querySelector("bili-comment-replies-renderer").shadowRoot
                                .querySelectorAll("bili-comment-reply-renderer");
                for (const reply of replies){
                    const userInfo = reply.shadowRoot
                                     .querySelector("bili-comment-user-info");
                    const avatar = userInfo.querySelector("#user-avatar");
                    avatar.addEventListener("mouseover", showProfileDebounce);

                    const userNameA = userInfo.shadowRoot.querySelector("#user-name > a");
                    userNameA.addEventListener("mouseover", showProfileDebounce);
                }
            })
        }

        if (window.location.href.startsWith(BILIBILI_VIDEO_URL)) {
            setTimeout(() => hookComment(20), 500);
        }
    });

    getGuardInfo(6726252, 245645656).then((data) => {
        guardInfo = data;
        // Shuffle guardInfo
        let i = guardInfo.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [guardInfo[i], guardInfo[j]] = [guardInfo[j], guardInfo[i]];
        }
    });

    getTagsInfo().then((data) => {
        biliTags = data;
    });

    getMyInfo().then((data) => {
        myMid = data["profile"]["mid"];
    })

});

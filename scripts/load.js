function loadOptions() {
    chrome.storage.local.get({
        noteData: {}
    }, function(result) {
        noteData = result.noteData;
    });

    chrome.storage.sync.get({
        tagColors: {},
        enableTagColor: false,
    }, function(result) {
        tagColors = result.tagColors;
        enableTagColor = result.enableTagColor;
    });

    return chrome.storage.sync.get({
        enableUpCard: true,
        enableBlockButton: true,
        enableRollbackFeedcard: true,
        enableWordCloud: true,
        enableAiSummary: true,
        enableHotComment: true,
        aiSummaryHoverThreshold: 800,
        enableVideoTag: true,
        enableIpLabel: true,
        minSize: 5
    });
}

window.addEventListener("load", function() {

    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('scripts/sitescripts/labelid.js');
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);

    loadOptions().then((items) => {
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

        const labelComments = (observer) => {

            const tryObserve = (root) => {
                if (root) {
                    observer.observe(root, {
                        childList: true,
                        subtree: true,
                    })
                }
            };

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

                    tryObserve(commentStack.shadowRoot);

                    if (mainComment) {
                        tryObserve(mainComment.shadowRoot);
                        const avatar = mainComment.shadowRoot.getElementById("user-avatar");
                        avatar?.addEventListener("mouseover", showProfileDebounce);

                        const userNameA = mainComment.shadowRoot
                                          ?.querySelector("bili-comment-user-info")?.shadowRoot
                                          ?.querySelector("#user-name > a");
                        userNameA?.addEventListener("mouseover", showProfileDebounce);

                        const richText = mainComment.shadowRoot.querySelector("bili-rich-text");
                        if (richText) {
                            tryObserve(richText.shadowRoot);
                            const userNameAts = richText.shadowRoot.querySelectorAll("a[data-user-profile-id]");
                            for (const userNameAt of userNameAts) {
                                userNameAt.addEventListener("mouseover", showProfileDebounce);
                            }
                        }
                    }

                    if (replies) {
                        tryObserve(replies.children[0].shadowRoot);
                        for (const reply of replies.children[0].shadowRoot
                                            .querySelectorAll("bili-comment-reply-renderer")) {
                            tryObserve(reply.shadowRoot);
                            const userInfo = reply.shadowRoot.querySelector("bili-comment-user-info");
                            if (userInfo) {
                                const avatar = userInfo.querySelector("#user-avatar");
                                avatar?.addEventListener("mouseover", showProfileDebounce);

                                tryObserve(userInfo.shadowRoot);
                                const userNameA = userInfo.shadowRoot?.querySelector("#user-name > a");
                                userNameA?.addEventListener("mouseover", showProfileDebounce);
                            }

                            const richText = reply.shadowRoot.querySelector("bili-rich-text");
                            if (richText) {
                                tryObserve(richText.shadowRoot);
                                const userNameAts = richText.shadowRoot.querySelectorAll("a[data-user-profile-id]");
                                for (const userNameAt of userNameAts) {
                                    userNameAt.addEventListener("mouseover", showProfileDebounce);
                                }
                            }
                        }
                    }

                }
            }
        }

        if (window.location.href.startsWith(BILIBILI_DYNAMIC_URL) ||
            window.location.href.startsWith(BILIBILI_DYNAMIC_DETAIL_URL) ||
            window.location.href.startsWith(BILIBILI_VIDEO_URL) ||
            window.location.href.startsWith(BILIBILI_WATCH_LATER_URL)) {
            const idObserver = new MutationObserver((mutationList, observer) => {
                labelComments(idObserver);
            });
            idObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "reloadOptions") {
        loadOptions().then((items) => {
            biliScopeOptions = items;
        });
    }
});

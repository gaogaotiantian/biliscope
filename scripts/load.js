let optionLoad = chrome.storage.sync.get({
    enableUpCard: true,
    enableBlockButton: true,
    enableRollbackFeedcard: true,
    enableWordCloud: true,
    enableAiSummary: true,
    aiSummaryHoverThreshold: 800,
    enableVideoTag: true,
    enableIpLabel: true,
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

        let hookComment = () => {
            if (!document.querySelector("bili-comments")?.shadowRoot.querySelector("bili-comment-thread-renderer")
                    ?.shadowRoot.querySelector("bili-comment-renderer")) {
                setTimeout(() => hookComment(), 400);
                return;
            }

            document.querySelector("bili-comments")
                .shadowRoot.querySelectorAll("bili-comment-thread-renderer")
                .forEach(element => {
                    el = element.shadowRoot.querySelector("bili-comment-renderer")
                        .shadowRoot.getElementById("user-avatar");
                    el.addEventListener("mouseover", showProfileDebounce);

                    replies = element.shadowRoot.querySelector("bili-comment-replies-renderer")
                        .shadowRoot.querySelectorAll("bili-comment-reply-renderer");
                    for (const reply of replies){
                        el = reply.shadowRoot.querySelector("bili-comment-user-info")
                            .getElementsByTagName("a")[0];
                        el.addEventListener("mouseover", showProfileDebounce);
                    }
                })
        }

        if (window.location.href.startsWith(BILIBILI_VIDEO_URL)) {
            setTimeout(() => hookComment(), 400);
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

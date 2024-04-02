let optionLoad = chrome.storage.sync.get({
    enableUpCard: true,
    enableWordCloud: true,
    enableAiSummary: true,
    aiSummaryHoverThreshold: 800,
    minSize: 5
});

window.addEventListener("load", function() {

    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('scripts/sitescript.js');
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);

    optionLoad.then((items) => {
        biliScopeOptions = items;

        // Load the user profile card
        userProfileCard = new UserProfileCard();
        videoProfileCard = new VideoProfileCard();
        this.document.addEventListener("mouseover", showProfileDebounce);
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

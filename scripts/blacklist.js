async function getBlackList(pn) {
    return biliGet("https://api.bilibili.com/x/relation/blacks", {
        pn: pn,
        ps: NUM_PER_PAGE,
    }).then((data) => {
        if (data["code"] == 0) {
            return data;
        }
    })
}

/** @type {?number[]} */
var banMids;

chrome.storage.local.get({
    banMids: null
}, function (result) {
    if (result.banMids != null) {
        banMids = result.banMids;
        return;
    }

    updateBanMids();
});

function updateBanMids() {
    let banLists = [];
    getBlackList(1).then((data) => {
        banLists = banLists.concat(data["data"]["list"]);

        let pn = 1;
        let promises = [];
        while (pn * NUM_PER_PAGE < data["data"]["total"]) {
            pn += 1;
            promises.push(getBlackList(pn));
        }
        Promise.all(promises).then((datas) => {
            banLists = banLists.concat(...datas.map(data => data["data"]["list"]));
        })

        banMids = banLists.map(ban => ban["mid"]);

        chrome.storage.local.set({
            banMids: banMids
        });
    });
}

function hiddenElChildren(selector) {
    const target = document.querySelector(selector);
    if (target) {
        for (const el of target.children) {
            const mid = el.querySelector("[biliscope-userid]")?.getAttribute("biliscope-userid");
            el.hidden = banMids.includes(parseInt(mid));
        }
    }
}

function cleanPopularPage() {
    const { pathname } = window.location;

    if (pathname.includes("weekly")) {
        hiddenElChildren(".video-list");
    } else if (pathname.includes("rank/all")) {
        hiddenElChildren(".rank-list");
    }
}

function cleanSearchPage() {
    hiddenElChildren(".video-list");
}

function cleanPages() {
    if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
        cleanPopularPage();
    } else if (window.location.href.startsWith(BILIBILI_SEARCH_URL)) {
        cleanSearchPage();
    }
}

const pageObserver = new MutationObserver((mutationList, observer) => {
    cleanPages();
});

window.addEventListener("load", function () {
    pageObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request?.refreshBlackList) {
        cleanPages();
    }
});
document.addEventListener("mouseover", showProfileDebounce);
document.addEventListener("mousemove", (ev) => userProfileCard.updateCursor(ev.pageX, ev.pageY));

biliScopeOptions = null;

chrome.storage.sync.get({
    enableWordCloud: true,
    minSize: 5
}, function(items) {
    biliScopeOptions = items;
});

// Load the site script to label the user links
var s = document.createElement('script');
s.src = chrome.runtime.getURL('scripts/sitescript.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

function getTarget(target) {
    let maxDepth = 5;
    userLink = target;
    while (userLink && maxDepth-- >= 0 && userLink.getAttribute) {
        if (userLink.getAttribute("biliscope-userid")) {
            return userLink;
        }
        userLink = userLink.parentNode;
    }

    return null;
}

function showProfile(event) {
    let target = getTarget(event.target);

    if (target && userProfileCard.enable()) {
        userProfileCard.updateCursor(event.pageX, event.pageY);
        userProfileCard.updateTarget(target);
        let userId = target.getAttribute("biliscope-userid");
        if (userId != userProfileCard.userId) {
            userProfileCard.updateUserId(userId);
            updateUserInfo(userId, (data) => userProfileCard.updateData(data));
        }
    } else {
        userProfileCard.checkTargetValid(event.target);
    }
}

function showProfileDebounce(event) {
    clearTimeout(showProfileDebounce.timer);
    event.target.addEventListener("mouseout", () => clearTimeout(showProfileDebounce.timer));
    showProfileDebounce.timer = setTimeout(() => {
        showProfile(event)
    }, 200);
}

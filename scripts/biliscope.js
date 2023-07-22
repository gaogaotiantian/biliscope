// Load the site script to label the user links
window.addEventListener("load", function() {
    document.addEventListener("mouseover", showProfileDebounce);

    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('scripts/sitescript.js');
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);
});

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

    if (target && userProfileCard && userProfileCard.enable()) {
        let userId = target.getAttribute("biliscope-userid");
        let updated = userProfileCard.updateUserId(userId);
        userProfileCard.updateCursor(event.pageX, event.pageY);
        userProfileCard.updateTarget(target)
        if (updated) {
            updateUserInfo(userId, (data) => userProfileCard.updateData(data));
        }
    }
}

function showProfileDebounce(event) {
    clearTimeout(showProfileDebounce.timer);
    event.target.addEventListener("mouseout", () => clearTimeout(showProfileDebounce.timer));
    showProfileDebounce.timer = setTimeout(() => {
        showProfile(event)
    }, 300);
}

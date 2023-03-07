BILIBILI_SPACE_URL = "https://space.bilibili.com/"

document.addEventListener("mouseover", showProfile);
document.addEventListener("mousemove", (ev) => userProfileCard.updateCursor(ev.pageX, ev.pageY));

biliScopeOptions = null;

chrome.storage.sync.get({
  enableWordCloud: true
}, function(items) {
    biliScopeOptions = items;
});

function getUserId(target)
{
    let regex = /.*?bilibili.com\/([0-9]*)[^\/]*$/;
    let userId = target.href.match(regex)[1];

    return userId;
}

function getUserTarget(target)
{
    for (let userLink of [target, target.parentNode]) {
        if (userLink.tagName == "A" && userLink.href.startsWith(BILIBILI_SPACE_URL)) {
            return userLink;
        } 
    }
}

function showProfile(event)
{
    let target = getUserTarget(event.target);

    if (target) {
        let userId = getUserId(target);

        if (userProfileCard.enable(userId)) {
            userProfileCard.updateUserId(userId);
            userProfileCard.updateCursor(event.clientX, event.clientY);
            userProfileCard.updateTarget(target);
            updateUserInfo(userId, (data) => userProfileCard.updateData(data));
        }

    }

}
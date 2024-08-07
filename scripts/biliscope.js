function getTarget(target) {
    let maxDepth = 5;
    el = target;
    while (el && maxDepth-- >= 0 && el.getAttribute) {
        if (el.getAttribute("biliscope-userid")) {
            return {"type": "user", "target": el};
        } else if (el.getAttribute("data-user-profile-id")) {
            return {"type": "user", "target": el};
        } else if (el.getAttribute("biliscope-videoid")) {
            return {"type": "video", "target": el};
        }
        el = el.parentNode;
    }
    return null;
}

function showProfile(event, targetData) {
    if (targetData["type"] == "user") {
        if (biliScopeOptions.enableUpCard && userProfileCard && userProfileCard.enable()) {
            let target = targetData["target"];
            let userId = target.getAttribute("biliscope-userid")
                || target.getAttribute("data-user-profile-id");
            let updated = userProfileCard.updateUserId(userId);
            userProfileCard.updateCursor(event.pageX, event.pageY);
            userProfileCard.updateTarget(target);
            if (updated) {
                updateUserInfo(userId, (data) => userProfileCard.updateData(data));
            }
        }
    } else if (targetData["type"] == "video") {
        let videoInfoConsumer = [];
        const target = targetData["target"];
        const videoId = target.getAttribute("biliscope-videoid");

        if (biliScopeOptions.enableVideoTag && videoTagManager) {
            const updated = videoTagManager.updateTarget(target);
            videoTagManager.updateVideoId(videoId);
            if (updated) {
                videoInfoConsumer.push(videoTagManager);
            }
        }

        if (biliScopeOptions.enableAiSummary && videoProfileCard && videoProfileCard.enable()) {
            const updated = videoProfileCard.updateVideoId(videoId);
            videoProfileCard.updateTarget(target);
            videoProfileCard.updatePosition();
            if (updated) {
                videoInfoConsumer.push(videoProfileCard);
            }
        }

        if (videoInfoConsumer.length) {
            updateVideoInfo(videoId, (data) => {
                for (let consumer of videoInfoConsumer) {
                    consumer.updateData(data);
                }
            });
        }
    }
}

function showProfileDebounce(event) {
    clearTimeout(showProfileDebounce.timer);
    let targetData = getTarget(event.target);
    if (!targetData) {
        return;
    }

    let target = targetData["target"];
    let type = targetData["type"];
    let debounceTime = 0;

    switch (type) {
        case "user":
            debounceTime = 300;
            break;
        case "video":
            debounceTime = biliScopeOptions.aiSummaryHoverThreshold;
            break;
    }

    target.addEventListener("mouseout", () => clearTimeout(showProfileDebounce.timer));

    showProfileDebounce.timer = setTimeout(() => {
        showProfile(event, targetData);
    }, debounceTime);
}

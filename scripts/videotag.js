function VideoTagManager() {
    this.tags = [];
    this.target = null;
    this.targetHasImage = false;
    this.videoId = null;
    this.tagWrapper = null;
}

VideoTagManager.prototype.clear = function() {
    this.tags = [];
    this.target = null;
    this.videoId = null;
    if (this.tagWrapper) {
        this.tagWrapper.remove();
        this.tagWrapper = null;
    }
}

VideoTagManager.prototype.updateTarget = function(target) {
    if (target == this.target) {
        return false;
    }
    this.target = target;
    this.targetHasImage = target.getElementsByTagName("img").length > 0;
    return this.targetHasImage;
}

VideoTagManager.prototype.updateVideoId = function(videoId) {
    this.videoId = videoId;
}

VideoTagManager.prototype.targetHasImg = function(target) {
    return imgs.length > 0;
}

VideoTagManager.prototype.updateData = function(data) {
    let newTag = false;

    if (data["api"] == "reply") {
        let jumpurl = data.payload?.top?.upper?.content?.jump_url;
        if (jumpurl) {
            for (const [key, value] of Object.entries(jumpurl)) {
                if (value?.extra?.goods_item_id) {
                    if (!this.tags.includes("商单")) {
                        this.tags.push("商单");
                        newTag = true;
                        break;
                    }
                }
            }
        }
    } else if (data["api"] == "view") {
        const favorite = data.payload?.stat?.favorite;
        const coin = data.payload?.stat?.coin;

        if (favorite / coin > 10) {
            this.tags.push("低质");
            newTag = true;
        }
    }

    if (newTag) {
        if (!this.tagWrapper) {
            this.tagWrapper = document.createElement("div");
            this.tagWrapper.className = "biliscope-video-tag-wrapper";
            this.target.appendChild(this.tagWrapper);
        }

        this.tagWrapper.innerHTML = "";
        this.tags.sort();
        for (let tag of this.tags) {
            let tagElement = document.createElement("span");
            tagElement.className = "biliscope-video-tag";
            tagElement.innerHTML = tag;
            this.tagWrapper.appendChild(tagElement);
        }

        manager = this;
        this.target.addEventListener("mouseleave", function leaveEvent() {
            manager.target.removeEventListener("mouseleave", leaveEvent);
            manager.clear();
        });
    }
}

videoTagManager = new VideoTagManager();

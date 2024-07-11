function VideoTagManager() {
    this.tags = new Set();
    this.target = null;
    this.targetHasImage = false;
    this.videoId = null;
    this.tagWrapper = null;
}

VideoTagManager.prototype.clear = function() {
    this.tags = new Set();
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

VideoTagManager.prototype.updateData = function(data) {
    let newTag = false;

    if (data["api"] == "reply") {
        const member = data.payload?.top?.upper?.member;
        if (member?.official_verify?.type == 1) {
            newTag = true;
            this.tags.add("广告");
        }

        const jumpurl = data.payload?.top?.upper?.content?.jump_url;
        if (jumpurl) {
            for (const [key, value] of Object.entries(jumpurl)) {
                if (key.startsWith("BV") ||
                    key.startsWith("av") ||
                    key.startsWith("https://www.bilibili.com/")) {
                    // Internal reference, that's okay
                    continue;
                }
                if (value?.pc_url.indexOf("search.bilibili.com") != -1) {
                    // Search link, that's okay
                    continue;
                }
                if (value?.extra?.goods_item_id || value?.extra?.goods_cm_control != 0) {
                    this.tags.add("广告");
                    newTag = true;
                    break;
                }
                if(key.startsWith("https://b23.tv/")) {
                    continue;
                }
            }
        }
    } else if (data["api"] == "view") {
        const favorite = data.payload?.stat?.favorite;
        const coin = data.payload?.stat?.coin;

        if (favorite / coin > 10) {
            this.tags.add("低质");
            newTag = true;
        }
    } else {
        return;
    }

    if (newTag) {
        if (!this.tagWrapper) {
            this.tagWrapper = document.createElement("div");
            this.tagWrapper.className = "biliscope-video-tag-wrapper";
            if (this.target.getAttribute("dyn-id")){
                this.target.firstChild.appendChild(this.tagWrapper);
            } else {
                this.target.appendChild(this.tagWrapper);
            }
        }

        this.tagWrapper.innerHTML = "";
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

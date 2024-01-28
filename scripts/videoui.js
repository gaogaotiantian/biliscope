function getVideoProfileCardHTML(data) {
    return `
        <div id="biliscope-video-card" style="position: absolute;">
            <div id="biliscope-video-card-conclusion">
                <div class="biliscope-video-card-title">总结</div>
                <div id="biliscope-video-card-summary">
                </div>
                <div id=biliscope-video-card-outline>
                </div>
            </div>
        </div>
    `
}

function VideoProfileCard() {
    this.enabled = false;
    this.data = {};
    this.cursorX = 0;
    this.cursorY = 0;
    this.target = null;
    this.enabled = false;
    this.videoId = null;
    this.el = document.createElement("div");
    this.el.style.position = "absolute";
    this.el.style.display = "none";
    this.el.innerHTML = getVideoProfileCardHTML(this.data);
    document.body.appendChild(this.el);

    this.disable();
}

VideoProfileCard.prototype.enable = function() {
    if (!this.enabled) {
        this.enabled = true;
        return true;
    }
    return false;
}

VideoProfileCard.prototype.disable = function() {
    this.videoId = null;
    this.enabled = false;
    this.valid = false;
    this.data = {};
    if (this.el) {
        this.el.style.display = "none";
    }
    return true;
}

VideoProfileCard.prototype.setLeaveEvent = function() {
    let validTargets = [this.el, this.target];

    this.leaveCallback = () => {
        if (this.disable()) {
            for (let target of validTargets) {
                target.removeEventListener("mouseleave", this.disableDebounce);
                target.removeEventListener("mouseenter", this.enterCallback);
            }
        }
    }

    this.enterCallback = () => {
        clearTimeout(this.disableDebounce.timer);
        this.cursorInside = true;
    }

    this.disableDebounce = () => {
        this.cursorInside = false;
        this.disableDebounce.timer = setTimeout(() => {
            this.leaveCallback();
        }, 400);
    }

    for (let target of validTargets) {
        target.addEventListener("mouseleave", this.disableDebounce);
        target.addEventListener("mouseenter", this.enterCallback);
    }
}

VideoProfileCard.prototype.updateVideoId = function(videoId) {
    let updated = this.videoId != videoId;
    this.videoId = videoId;
    return updated;
}

VideoProfileCard.prototype.updateCursor = function(cursorX, cursorY) {
    const cursorPadding = 10;
    const windowPadding = 20;

    this.cursorX = cursorX;
    this.cursorY = cursorY;

    if (this.el) {
        let width = this.el.scrollWidth;
        let height = this.el.scrollHeight;

        if (this.cursorX + width + windowPadding > window.scrollX + window.innerWidth) {
            // Will overflow to the right, put it on the left
            this.el.style.left = `${this.cursorX - cursorPadding - width}px`;
        } else {
            this.el.style.left = `${this.cursorX + cursorPadding}px`;
        }

        if (this.cursorY + height + windowPadding > window.scrollY + window.innerHeight) {
            // Will overflow to the bottom, put it on the top
            if (this.cursorY - windowPadding - height < window.scrollY) {
                // Can't fit on top either, put it in the middle
                this.el.style.top = `${window.scrollY + (window.innerHeight - height) / 2}px`;
            } else {
                this.el.style.top = `${this.cursorY - cursorPadding - height}px`;
            }
        } else {
            this.el.style.top = `${this.cursorY + cursorPadding}px`;
        }
    }
}

VideoProfileCard.prototype.updateTarget = function(target) {
    if (target != this.target) {
        // Calculate z-index for the card
        let node = target
        let zIndex = 1002;
        while (node && node != document) {
            let containerIndex = window.getComputedStyle(node).getPropertyValue("z-index");
            if (containerIndex && containerIndex != "auto" && containerIndex > zIndex) {
                zIndex = containerIndex;
            }
            node = node.parentNode;
        } 
        this.el.style.zIndex = zIndex + 1;
    }

    this.target = target;
    this.valid = false;
    this.setLeaveEvent();
}

VideoProfileCard.prototype.drawConclusion = function() {
    let summary = this.data.conclusion?.model_result?.summary;
    let outline = this.data.conclusion?.model_result?.outline;
    document.getElementById("biliscope-video-card-summary").innerHTML = summary || "";

    if (outline && outline.length > 0) {
        let outlineHTML = "";
        document.getElementById("biliscope-video-card-outline").classList.remove("d-none");
        for (let i = 0; i < outline.length; i++) {
            outlineHTML += '<div class="biliscope-video-card-outline-item">';
            outlineHTML += `<div style="min-width: 20px">${i+1}. </div>`;
            outlineHTML += '<div class="biliscope-video-card-outline-content">';
            outlineHTML += `<div class="biliscope-video-card-outline-title">
                                ${outline[i].title}
                            </div>`;
            outlineHTML += `<div class="biliscope-video-card-outline-parts">`;
            for (let j = 0; j < outline[i].part_outline.length; j++) {
                let part = outline[i].part_outline[j];
                outlineHTML += `<div class="biliscope-video-card-outline-part-item">`;
                outlineHTML += `<div>
                                    <a href="${BILIBILI_VIDEO_URL}/${this.data.view.bvid}?t=${secondsToTimeLink(part.timestamp)}" target="_blank">
                                        <span class="bliscope-video-card-part-timestamp">${secondsToDisplay(part.timestamp)}</span>
                                    </a>
                                </div>`;
                outlineHTML += `<div class="bliscope-video-card-part-content">${part.content}</div>`;
                outlineHTML += "</div>";
            }
            outlineHTML += "</div>";
            outlineHTML += "</div>";
            outlineHTML += "</div>";
        }
        document.getElementById("biliscope-video-card-outline").innerHTML = outlineHTML;
    } else {
        document.getElementById("biliscope-video-card-outline").classList.add("d-none");
    }
}

VideoProfileCard.prototype.updateData = function(data) {
    if (data["api"] == "view") {
        this.data.view = data["payload"];
    } else if (data["api"] == "conclusion") {
        this.data.conclusion = data["payload"];
        if (this.data.conclusion.model_result.summary) {
            this.valid = true;
        } else {
            this.valid = false;
        }
        this.drawConclusion();
    }

    if (this.enabled && this.valid && this.el && this.el.style.display != "flex") {
        this.el.style.display = "flex";
    }

    this.updateCursor(this.cursorX, this.cursorY);
}

window.addEventListener("load", function() {
    videoProfileCard = new VideoProfileCard();
});

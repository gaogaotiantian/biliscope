function getVideoProfileCardHTML(data) {
    return `
        <div id="biliscope-video-card">
            <div id="biliscope-ai-summary-none">此视频不存在AI总结</div>
            <div id="biliscope-ai-summary-popup" class="biliscope-ai-summary-popup">
                <div class="biliscope-ai-summary-popup-header">
                    <div class="biliscope-ai-summary-popup-header-left">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                            xmlns="http://www.w3.org/2000/svg" class="biliscope-ai-summary-popup-icon">
                            <g clip-path="url(#clip0_8728_3421)">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.53976 2.34771C8.17618 1.81736 9.12202 1.90335 9.65237 2.53976L12.1524 5.53976C12.6827 6.17618 12.5967 7.12202 11.9603 7.65237C11.3239 8.18272 10.3781 8.09673 9.84771 7.46031L7.34771 4.46031C6.81736 3.8239 6.90335 2.87805 7.53976 2.34771Z"
                                    fill="url(#paint0_linear_8728_3421)"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M21.9602 2.34771C21.3238 1.81736 20.378 1.90335 19.8476 2.53976L17.3476 5.53976C16.8173 6.17618 16.9033 7.12202 17.5397 7.65237C18.1761 8.18272 19.1219 8.09673 19.6523 7.46031L22.1523 4.46031C22.6826 3.8239 22.5967 2.87805 21.9602 2.34771Z"
                                    fill="url(#paint1_linear_8728_3421)"></path>
                                <g opacity="0.2" filter="url(#filter0_d_8728_3421)">
                                    <path
                                        d="M27 18.2533C27 25.0206 21.6274 27 15 27C8.37258 27 3 25.0206 3 18.2533C3 11.486 3.92308 6 15 6C26.5385 6 27 11.486 27 18.2533Z"
                                        fill="#D9D9D9"></path>
                                </g>
                                <g filter="url(#filter1_ii_8728_3421)">
                                    <path
                                        d="M28 18.9489C28 26.656 22.1797 28 15 28C7.8203 28 2 26.656 2 18.9489C2 10 3 6 15 6C27.5 6 28 10 28 18.9489Z"
                                        fill="url(#paint2_linear_8728_3421)"></path>
                                </g>
                                <path
                                    d="M4.78613 14.2091C4.78613 11.9263 6.44484 9.96205 8.71139 9.6903C13.2069 9.1513 16.7678 9.13141 21.3132 9.68091C23.5697 9.95371 25.2147 11.9138 25.2147 14.1868V19.192C25.2147 21.3328 23.7551 23.2258 21.6452 23.5884C16.903 24.4032 13.1705 24.2461 8.55936 23.5137C6.36235 23.1647 4.78613 21.2323 4.78613 19.0078V14.2091Z"
                                    fill="#191924"></path>
                                <path d="M19.6426 15.3125L19.6426 18.0982" stroke="#2CFFFF" stroke-width="2.4"
                                    stroke-linecap="round"></path>
                                <path d="M10.3574 14.8516L12.2146 16.7087L10.3574 18.5658" stroke="#2CFFFF" stroke-width="1.8"
                                    stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                            <defs>
                                <filter id="filter0_d_8728_3421" x="1" y="4" width="30" height="27" filterUnits="userSpaceOnUse"
                                    color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                    <feOffset dx="1" dy="1"></feOffset>
                                    <feGaussianBlur stdDeviation="1.5"></feGaussianBlur>
                                    <feComposite in2="hardAlpha" operator="out"></feComposite>
                                    <feColorMatrix type="matrix"
                                        values="0 0 0 0 0.039545 0 0 0 0 0.0845023 0 0 0 0 0.200107 0 0 0 0.85 0">
                                    </feColorMatrix>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8728_3421">
                                    </feBlend>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8728_3421" result="shape">
                                    </feBlend>
                                </filter>
                                <filter id="filter1_ii_8728_3421" x="0" y="4.14286" width="30.7857" height="26.6429"
                                    filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                    <feOffset dx="2.78571" dy="3.71429"></feOffset>
                                    <feGaussianBlur stdDeviation="1.39286"></feGaussianBlur>
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0">
                                    </feColorMatrix>
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_8728_3421"></feBlend>
                                    <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                    <feOffset dx="-2" dy="-1.85714"></feOffset>
                                    <feGaussianBlur stdDeviation="1.85714"></feGaussianBlur>
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                    <feColorMatrix type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0.15445 0 0 0 0 0.454264 0 0 0 0.11 0"></feColorMatrix>
                                    <feBlend mode="normal" in2="effect1_innerShadow_8728_3421"
                                        result="effect2_innerShadow_8728_3421"></feBlend>
                                </filter>
                                <linearGradient id="paint0_linear_8728_3421" x1="6.80424" y1="2.84927" x2="9.01897" y2="8.29727"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#393946"></stop>
                                    <stop offset="0.401159" stop-color="#23232E"></stop>
                                    <stop offset="1" stop-color="#191924"></stop>
                                </linearGradient>
                                <linearGradient id="paint1_linear_8728_3421" x1="22.6958" y1="2.84927" x2="20.481" y2="8.29727"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#393946"></stop>
                                    <stop offset="0.401159" stop-color="#23232E"></stop>
                                    <stop offset="1" stop-color="#191924"></stop>
                                </linearGradient>
                                <linearGradient id="paint2_linear_8728_3421" x1="7.67091" y1="10.8068" x2="19.9309" y2="29.088"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F4FCFF"></stop>
                                    <stop offset="1" stop-color="#EAF5F9"></stop>
                                </linearGradient>
                                <clipPath id="clip0_8728_3421">
                                    <rect width="30" height="30" fill="white"></rect>
                                </clipPath>
                            </defs>
                        </svg>
                        <div class="biliscope-ai-summary-popup-tips">
                            <span class="biliscope-ai-summary-popup-tips-text">已为你生成视频总结</span>
                        </div>
                    </div>
                </div>
                <div class="biliscope-ai-summary-popup-body">
                    <div id="biliscope-ai-summary-abstracts" class="biliscope-ai-summary-popup-body-abstracts">
                    </div>
                    <div id="biliscope-ai-summary-outline" class="biliscope-ai-summary-popup-body-outline">
                    </div>
                </div>
            </div>
            <div id="biliscope-hot-comment">
                <span id="biliscope-hot-comment-tag">
                </span>
                <span id="biliscope-hot-comment-text">
                </span>
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
    this.el.addEventListener("click", (event) => {
        event.stopPropagation();
        let node = event.target;
        while (node && node.id != "biliscope-video-card") {
            if (node.getAttribute("biliscope-video-timestamp")) {
                let timestamp = parseInt(node.getAttribute("biliscope-video-timestamp"));
                let tLink = secondsToTimeLink(timestamp);
                window.open(`https://www.bilibili.com/video/${this.videoId}/?t=${tLink}`, "_blank");
                break;
            }
            node = node.parentNode;
        }
    });
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

    // The UI lives directly under document so switching to the UI will trigger
    // the leave event. We need to dispatch the event to the popover to prevent
    // the popover from disappearing.
    const dispatchToPopover = (event) => {
        let node = this.target;
        while (node && node != document) {
            if (node.classList && node.classList.contains("v-popover")) {
                node.dispatchEvent(new Event(event));
                break;
            }
            node = node.parentNode;
        }
    }

    this.leaveCallback = () => {
        if (this.disable()) {
            for (let target of validTargets) {
                target.removeEventListener("mouseleave", this.disableDebounce);
                target.removeEventListener("mouseenter", this.enterCallback);
            }
            dispatchToPopover("mouseleave");
        }
    }

    this.enterCallback = () => {
        clearTimeout(this.disableDebounce.timer);
        dispatchToPopover("mouseenter");
    }

    this.disableDebounce = () => {
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
    this.valid = null;
    this.setLeaveEvent();
}

VideoProfileCard.prototype.drawConclusion = function() {
    let summary = this.data.conclusion?.model_result?.summary;
    let outline = this.data.conclusion?.model_result?.outline;
    document.getElementById("biliscope-ai-summary-abstracts").innerHTML = summary || "";

    if (outline && outline.length > 0) {
        let outlineHTML = "";
        document.getElementById("biliscope-ai-summary-outline").classList.remove("d-none");
        for (let i = 0; i < outline.length; i++) {
            outlineHTML += `<div class="ai-summary-section" biliscope-video-timestamp="${outline[i].timestamp}">`;
            outlineHTML += `<div class="ai-summary-section-title">
                                ${outline[i].title}
                            </div>`;
            for (let j = 0; j < outline[i].part_outline.length; j++) {
                let part = outline[i].part_outline[j];
                outlineHTML += `<div class="bullet" biliscope-video-timestamp="${part.timestamp}">`;
                outlineHTML += `<span class="timestamp">
                                    <span class="timestamp-inner">${secondsToDisplay(part.timestamp)}</span>
                                </span>
                                <span class="content">
                                    ${part.content}
                                </span>`;
                outlineHTML += `</div>`;
            }
            outlineHTML += "</div>";
        }
        document.getElementById("biliscope-ai-summary-outline").innerHTML = outlineHTML;
    } else {
        document.getElementById("biliscope-ai-summary-outline").classList.add("d-none");
    }
}

VideoProfileCard.prototype.drawHotComment = function() {
    let hotComment, hotCommentTag;

    // 具有热评标签的
    hotComment = this.data.replies.filter(reply =>
        reply?.attr == 32768
    )?.[0]?.content.message;
    hotCommentTag = "热评：";
    // 高赞的
    if(!hotComment) {
        hotComment = this.data.replies.reduce((lReply, rReply) =>
            lReply.like > rReply.like ? lReply : rReply
        )?.content.message;
        if(hotComment) {
            hotCommentTag = "高赞：";
        }
    }

    if(hotComment) {
        document.getElementById("biliscope-hot-comment-tag").innerHTML = hotCommentTag;
        document.getElementById("biliscope-hot-comment-text").innerHTML = hotComment;
        document.getElementById("biliscope-hot-comment").classList.remove("d-none");
    }
}

VideoProfileCard.prototype.updateData = function(data) {
    if (this.valid == null) {
        document.getElementById("biliscope-hot-comment").classList.add("d-none");
        document.getElementById("biliscope-ai-summary-popup").classList.add("d-none");
        document.getElementById("biliscope-ai-summary-none").classList.add("d-none");
    }
    this.valid = true;

    if (data["api"] == "view") {
        this.data.view = data["payload"];
    } else if (data["api"] == "conclusion") {
        if (!biliScopeOptions.enableAiSummary) {
            return;
        }

        this.data.conclusion = data["payload"];
        this.drawConclusion();

        if (this.data.conclusion.model_result.summary) {
            document.getElementById("biliscope-ai-summary-popup").classList.remove("d-none");
        } else if (!biliScopeOptions.enableHotComment){
            document.getElementById("biliscope-ai-summary-none").classList.remove("d-none");
        }
    } else if (data["api"] == "reply") {
        if (!biliScopeOptions.enableHotComment) {
            return;
        }

        this.data.replies = data.payload?.replies;
        if(this.data.replies) {
            this.drawHotComment();
        }
    }

    if (this.enabled && this.el) {
        this.el.style.display = "flex";
    }

    this.updateCursor(this.cursorX, this.cursorY);
}

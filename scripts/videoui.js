function getVideoProfileCardHTML(data) {
    return `
        <div id="biliscope-video-card">
            <div id="biliscope-ai-summary-none">此视频不存在AI总结</div>
            <div id="biliscope-video-card-inner">
                ${getAiSummaryHTML(data)}
                <div id="biliscope-hot-comment-wrapper">
                    <div id="biliscope-hot-comment-icon">
                    </div>
                    <div id="biliscope-hot-comment">
                        <span id="biliscope-hot-comment-author">
                        </span>
                        <span id="biliscope-hot-comment-text">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `
}

function getAiSummaryHTML(data) {
    return `
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

VideoProfileCard.prototype.updatePosition = function() {
    const needVerticalDisplay = () => {
        if (window.location.href.startsWith(BILIBILI_DYNAMIC_URL) ||
            window.location.href.startsWith(BILIBILI_NEW_DYNAMIC_URL) ||
            window.location.href.startsWith(BILIBILI_SPACE_URL) &&
            window.location.pathname.endsWith("/dynamic")) {
            // 动态页的视频
            if (this.target.matches(".bili-dyn-card-video")) {
                return true;
            }
        } else if (window.location.href.startsWith(BILIBILI_VIDEO_URL) ||
                    window.location.href.startsWith(BILIBILI_WATCH_LATER_URL)) {
            // 视频页右侧的推荐视频
            if (this.target.matches("#reco_list [biliscope-videoid]")) {
                return true;
            }
        } else if (window.location.href.startsWith(BILIBILI_POPULAR_URL)) {
            // 热门页的视频
            if (this.target.matches(".popular-container [biliscope-videoid]")) {
                return true;
            }
        }

        return false;
    }

    if (this.el) {
        const cardWidth = this.el.scrollWidth;
        const cardHeight = this.el.scrollHeight;

        const cursorPadding = 10;
        const windowPadding = 20;
        /** @type {DOMRect} */
        const targetBounding = this.target.getBoundingClientRect();

        if (!needVerticalDisplay()) {
            // 往左右显示
            if (targetBounding.right + windowPadding + cardWidth > window.innerWidth) {
                // Will overflow to the right, put it on the left
                this.el.style.left = `${targetBounding.left - cursorPadding - cardWidth + window.scrollX}px`;
            } else {
                this.el.style.left = `${targetBounding.right + window.scrollX + cursorPadding}px`;
            }

            if (targetBounding.top + windowPadding + cardHeight < window.innerHeight) {
                // Put it on the bottom
                this.el.style.top = `${targetBounding.top + window.scrollY}px`;
            } else if (targetBounding.bottom - windowPadding - cardHeight > 0) {
                // Put it on the top
                this.el.style.top = `${targetBounding.bottom - cardHeight + window.scrollY}px`;
            } else {
                // Put it in the middle
                const middle = targetBounding.top + (targetBounding.bottom - targetBounding.top) / 2;
                this.el.style.top = `${middle - cardHeight / 2 + window.scrollY}px`;
            }
        } else {
            // 往上下显示
            if (targetBounding.bottom + cardHeight > window.innerHeight &&
                targetBounding.top - cardHeight > 0) {
                // Will overflow to the bottom and not overflow to the top, put it on the top
                this.el.style.top = `${targetBounding.top - cursorPadding - cardHeight + window.scrollY}px`;
            } else {
                this.el.style.top = `${targetBounding.bottom + window.scrollY + cursorPadding}px`;
            }

            if (targetBounding.left + cardWidth > window.innerWidth) {
                // Will overflow to the right, put it on the left
                this.el.style.left = `${targetBounding.right - cardHeight + window.scrollX}px`;
            } else {
                this.el.style.left = `${targetBounding.left + window.scrollX}px`;
            }
        }
    }
}

VideoProfileCard.prototype.updateTarget = function(target) {
    if (target != this.target) {
        // Calculate z-index for the card
        let node = target
        let zIndex = 1002;
        while (node && node != document) {
            if (node instanceof ShadowRoot) {
                node = node.host;
            }
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
    if (!biliScopeOptions.enableHotComment || !this.data.replies?.length) {
        document.getElementById("biliscope-hot-comment-wrapper").classList.add("d-none");
        return;
    }

    // 具有热评标签的
    let hotComment = this.data.replies.filter(reply =>
        reply?.attr == 32768
    )?.[0];

    // 高赞的
    if (!hotComment) {
        hotComment = this.data.replies.reduce((lReply, rReply) =>
            lReply.like > rReply.like ? lReply : rReply
        );
    }

    if (hotComment) {
        const {content, member} = hotComment;
        const hotCommentText = document.getElementById("biliscope-hot-comment-text");
        const hotCommentAuthor = document.getElementById("biliscope-hot-comment-author");

        hotCommentText.innerHTML = '';
        hotCommentAuthor.innerHTML = `${member.uname}：`;
        hotCommentAuthor.onclick = function() {
            open(`//space.bilibili.com/${member.mid}`);
        }

        const emotes = content?.emote;
        const jump_urls = content?.jump_url;
        const separators = Object.keys(emotes || {}).concat(Object.keys(jump_urls || {}));

        // 转义separators中每个元素的特殊字符，并用'|'作为分隔符连接为字符串
        const regexStr = separators.map(s =>
            s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        ).join('|');

        if (!regexStr) {
            hotCommentText.innerHTML = content.message;
        } else {
            let jump_urls_copy = {...jump_urls};

            content.message.split(new RegExp(`(${regexStr})`)).map(s => {
                let hotCommentItem;
                if (emotes?.[s]) {
                    hotCommentItem = document.createElement("img");
                    hotCommentItem.src = emotes[s].url;
                } else if (jump_urls_copy?.[s]) {
                    hotCommentItem = document.createElement("a");
                    hotCommentItem.target = "_blank";
                    hotCommentItem.href = jump_urls_copy[s].pc_url;
                    hotCommentItem.innerHTML = s;

                    // 只标注一次jump_url，其余当作普通文本
                    delete jump_urls_copy[s];
                } else {
                    hotCommentItem = document.createElement("span");
                    hotCommentItem.innerHTML = s;
                }

                hotCommentText.appendChild(hotCommentItem);
            });
        }

        document.getElementById("biliscope-hot-comment-wrapper").classList.remove("d-none");
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
    } else if (data["api"] == "reply") {
        this.data.replies = data.payload?.replies;
    }

    if (this.enabled && this.el) {
        if (this.valid != null) {
            this.el.style.display = "flex";
            if (this.valid) {
                this.drawConclusion();
                this.drawHotComment();
                document.getElementById("biliscope-video-card-inner").classList.remove("d-none");
                document.getElementById("biliscope-ai-summary-none").classList.add("d-none");
            } else {
                document.getElementById("biliscope-video-card-inner").classList.add("d-none");
                document.getElementById("biliscope-ai-summary-none").classList.remove("d-none");
            }

        }
    }

    this.updatePosition();
}

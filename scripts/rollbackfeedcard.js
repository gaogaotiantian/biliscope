function FeedcardManager() {
    this.backwardStack = [];
    this.forwardStack = [];
    this.backwardButton = null;
    this.forwardButton = null;
    this.insertParent = null;
    this.insertReference = null;
    this.adFeedcards = new Set();
    this.isRefreshing = false;
}

FeedcardManager.prototype.addButton = function (parentNode) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.innerHTML = `
        <button id="biliscope-feedcard-backward" class="primary-btn roll-btn" style="margin-top: 15px; margin-bottom: 10px; display: none">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 3px 0; scale: 0.85; transform: translateY(-1px); rotate: -90deg;">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2692 6.98965C23.0395 5.65908 24.9605 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <button id="biliscope-feedcard-forward" class="primary-btn roll-btn" style="display: none;">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 3px 0; scale: 0.85; transform: translateY(-1px); rotate: 90deg;">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2692 6.98965C23.0395 5.65908 24.9605 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <style>
            #biliscope-feedcard-backward:disabled {
                outline: none;
                background: none;
            }
            #biliscope-feedcard-backward:disabled:active {
                transform: none;
            }
            #biliscope-feedcard-backward:disabled svg path {
                stroke: gray;
            }
        </style>
    `;
    parentNode.appendChild(buttonWrapper);

    this.backwardButton = document.getElementById('biliscope-feedcard-backward');
    this.backwardButton.addEventListener('click', () => {
        this.backward();
    });

    this.forwardButton = document.getElementById('biliscope-feedcard-forward');
    this.forwardButton.addEventListener('click', () => {
        this.forward();
    });
}

FeedcardManager.prototype.refreshButtonState = function () {
    this.backwardButton.style.display = 'block';
    if (this.backwardStack.length > 0) {
        this.backwardButton.removeAttribute('disabled');
    } else {
        this.backwardButton.setAttribute('disabled', '')
    }
    if (this.forwardStack.length > 0) {
        this.forwardButton.style.display = 'block';
    } else {
        this.forwardButton.style.display = 'none';
    }
}

const isAdFeedcard = function (feedcard) {
    return !feedcard.querySelector('.bili-video-card').classList.contains('enable-no-interest');
}

FeedcardManager.prototype.onRollFeedcard = function () {
    if (this.isRefreshing) return;
    const oldFeedcards = [...document.querySelectorAll('.feed-card')];
    this.insertParent ??= oldFeedcards[0].parentElement;
    this.insertReference ??= oldFeedcards.at(-1).nextElementSibling;

    // 换一换后移除旧的feedcard
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                this.adFeedcards.clear();
                document.querySelectorAll('.feed-card').forEach(feedcard => {
                    if (isAdFeedcard(feedcard)) {
                        this.adFeedcards.add(feedcard);
                        feedcard.remove();
                    }
                });
                for (const feedcard of oldFeedcards) {
                    feedcard.remove();
                }
                for (const feedcard of this.adFeedcards) {
                    this.insertParent.insertBefore(feedcard, this.insertReference);
                }
                observer.disconnect();
                this.isRefreshing = false;
                break;
            }
        }
    });
    observer.observe(oldFeedcards[0].parentElement, { childList: true });
    this.isRefreshing = true;

    this.backwardStack.push(oldFeedcards.filter(feedcard => !isAdFeedcard(feedcard)));
    this.forwardStack = [];
    this.refreshButtonState();
}

FeedcardManager.prototype.replaceFeedcards = function (newFeedcards) {
    const oldFeedcards = [...document.querySelectorAll('.feed-card')];

    for (const feedcard of oldFeedcards) {
        feedcard.remove();
    }
    for (const feedcard of newFeedcards) {
        this.insertParent.insertBefore(feedcard, this.insertReference);
    }
    for (const feedcard of this.adFeedcards) {
        this.insertParent.insertBefore(feedcard, this.insertReference);
    }

    return oldFeedcards.filter(feedcard => !isAdFeedcard(feedcard));
}

FeedcardManager.prototype.backward = function () {
    if (this.backwardStack.length > 0 && !this.isRefreshing) {
        const newFeedcards = this.backwardStack.pop();
        const oldFeedcards = this.replaceFeedcards(newFeedcards);
        this.forwardStack.push(oldFeedcards);
        this.refreshButtonState();
    }
}

FeedcardManager.prototype.forward = function () {
    if (this.forwardStack.length > 0 && !this.isRefreshing) {
        const newFeedcards = this.forwardStack.pop();
        const oldFeedcards = this.replaceFeedcards(newFeedcards);
        this.backwardStack.push(oldFeedcards);
        this.refreshButtonState();
    }
}

feedcardManager = new FeedcardManager();

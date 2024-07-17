function FeedcardManager() {
    this.backwardStack = [];
    this.forwardStack = [];
    this.backwardButton = null;
    this.forwardButton = null;
}

FeedcardManager.prototype.addButton = function () {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.innerHTML = `
        <button disabled class="primary-btn roll-btn backward" style="margin-top: 20px; margin-bottom: 10px;">
            <span>上一页</span>
        </button>
        <button disabled class="primary-btn roll-btn forward">
            <span>下一页</span>
        </button>
        <style>
            .primary-btn.roll-btn:disabled {
                outline: none;
                color: gray;
                background: none;
            }
            .primary-btn.roll-btn:disabled:active {
                transform: none;
            }
        </style>
    `;
    const parentNode = document.querySelector('.roll-btn').parentElement;
    parentNode.appendChild(buttonWrapper);
    this.backwardButton = buttonWrapper.querySelector('.backward');
    this.forwardButton = buttonWrapper.querySelector('.forward');
    this.backwardButton.addEventListener('click', () => {
        this.backward();
    });
    this.forwardButton.addEventListener('click', () => {
        this.forward();
    });
}

FeedcardManager.prototype.refreshButtonState = function () {
    if (this.backwardStack.length > 0) {
        this.backwardButton.removeAttribute('disabled');
    } else {
        this.backwardButton.setAttribute('disabled', '');
    }
    if (this.forwardStack.length > 0) {
        this.forwardButton.removeAttribute('disabled');
    } else {
        this.forwardButton.setAttribute('disabled', '');
    }
}

FeedcardManager.prototype.onRollFeedcard = function () {
    const oldFeedcards = document.querySelectorAll('.feed-card');
    if (this.backwardStack.length > 0 && oldFeedcards[0].querySelector('a').getAttribute('biliscope-videoid') == this.backwardStack.at(-1)[0].querySelector('a').getAttribute('biliscope-videoid')) {
        return;
    }
    this.backwardStack.push(oldFeedcards);
    this.forwardStack = [];
    this.refreshButtonState();
}

FeedcardManager.prototype.backward = function () {
    if (this.backwardStack.length > 0) {
        const oldFeedcards = document.querySelectorAll('.feed-card');
        this.forwardStack.push(oldFeedcards);
        const referenceNode = [...oldFeedcards].at(-1).nextElementSibling;
        const parentNode = oldFeedcards[0].parentElement;
        for (const feedcard of oldFeedcards) {
            feedcard.remove();
        }
        const feedcards = this.backwardStack.pop();
        for (const feedcard of feedcards) {
            parentNode.insertBefore(feedcard, referenceNode);
        }
        this.refreshButtonState();
    }
}

FeedcardManager.prototype.forward = function () {
    if (this.forwardStack.length > 0) {
        const oldFeedcards = document.querySelectorAll('.feed-card');
        this.backwardStack.push(oldFeedcards);
        const referenceNode = [...oldFeedcards].at(-1).nextElementSibling;
        const parentNode = oldFeedcards[0].parentElement;
        for (const feedcard of oldFeedcards) {
            feedcard.remove();
        }
        const feedcards = this.forwardStack.pop();
        for (const feedcard of feedcards) {
            parentNode.insertBefore(feedcard, referenceNode);
        }
        this.refreshButtonState();
    }
}

feedcardManager = new FeedcardManager();
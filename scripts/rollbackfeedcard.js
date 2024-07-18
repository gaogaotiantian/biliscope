function FeedcardManager() {
    this.backwardStack = [];
    this.forwardStack = [];
    this.backwardButton = null;
    this.forwardButton = null;
    this.feedcardBatchSize = 0;
}

FeedcardManager.prototype.addButton = function (parentNode) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.innerHTML = `
        <button id="biliscope-feedcard-backward" class="primary-btn roll-btn" style="margin-top: 20px; margin-bottom: 10px; visibility: hidden; transition: visibility 0s;">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 3px 0;">
                <path d="M12 23.9917H36" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M24 36L12 24L24 12" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <button id="biliscope-feedcard-forward" class="primary-btn roll-btn" style="visibility: hidden; transition: visibility 0s;">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 3px 0;">
                <path d="M36 24.0083H12" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M24 12L36 24L24 36" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
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
    if (this.backwardStack.length > 0) {
        this.backwardButton.style.visibility = 'visible';
    } else {
        this.backwardButton.style.visibility = 'hidden';
    }
    if (this.forwardStack.length > 0) {
        this.forwardButton.style.visibility = 'visible';
    } else {
        this.forwardButton.style.visibility = 'hidden';
    }
}

FeedcardManager.prototype.onRollFeedcard = function () {
    const oldFeedcards = document.querySelectorAll('.feed-card');

    // 换一换的更新逻辑是移除上一次刷新的内容，再添加新的内容。
    // 如果正在展示的不是上一次刷新的内容则不会被移除，这会导致有多余的card留在页面上。
    // 因此限制每次入栈的card数量为刷新的数量，避免旧数据重复入栈。
    if (this.feedcardBatchSize == 0) {
        this.feedcardBatchSize = oldFeedcards.length;
    }

    // 防止连续点击换一换导致重复入栈
    if (this.backwardStack.length > 0 && oldFeedcards[0] == this.backwardStack.at(-1)[0]) {
        return;
    }

    this.backwardStack.push([...oldFeedcards].slice(0, this.feedcardBatchSize));
    this.forwardStack = [];
    this.refreshButtonState();
}

FeedcardManager.prototype.replaceFeedcards = function (newFeedcards) {
    const oldFeedcards = document.querySelectorAll('.feed-card');
    const referenceNode = [...oldFeedcards].at(-1).nextElementSibling;
    const parentNode = oldFeedcards[0].parentElement;

    for (const feedcard of oldFeedcards) {
        feedcard.remove();
    }
    for (const feedcard of newFeedcards) {
        parentNode.insertBefore(feedcard, referenceNode);
    }

    return [...oldFeedcards].slice(0, this.feedcardBatchSize);
}

FeedcardManager.prototype.backward = function () {
    if (this.backwardStack.length > 0) {
        const newFeedcards = this.backwardStack.pop();
        const oldFeedcards = this.replaceFeedcards(newFeedcards);
        this.forwardStack.push(oldFeedcards);
        this.refreshButtonState();
    }
}

FeedcardManager.prototype.forward = function () {
    if (this.forwardStack.length > 0) {
        const newFeedcards = this.forwardStack.pop();
        const oldFeedcards = this.replaceFeedcards(newFeedcards);
        this.backwardStack.push(oldFeedcards);
        this.refreshButtonState();
    }
}

feedcardManager = new FeedcardManager();

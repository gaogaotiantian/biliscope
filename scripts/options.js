chrome.storage.sync.get({
    enableWordCloud: true,
    enableAiSummary: true,
    minSize: 5
}, function(items) {
    biliScopeOptions = items;
});

function saveOptions() {
    chrome.storage.sync.set(biliScopeOptions);
}

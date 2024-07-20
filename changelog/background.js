chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "update") {
        // Get the current version from manifest
        const currentVersion = chrome.runtime.getManifest().version;
      
        // Get the previously stored version from storage
        const { previousVersion } = await chrome.storage.local.get('previousVersion');
      
        // Compare versions and show popup if different
        if (currentVersion !== previousVersion) {
      
            // Open a new tab or popup
            chrome.tabs.create({ url: `changelog/changelog.html?prev_version=${previousVersion}` });

            // Update the stored version
            await chrome.storage.local.set({ previousVersion: currentVersion });
        }
    }
});
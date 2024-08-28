.PHONY: all
all:
	make chrome
	make firefox

.PHONY: chrome
chrome:
	zip biliscope_chrome.zip css/* img/logo* img/bililv.svg options/* scripts/* scripts/sitescripts/* changelog/* manifest.json

.PHONY: firefox
firefox:
	cp manifest.json manifest-template.json
	node tools/convertManifest.js manifest.json
	zip biliscope_firefox.zip css/* img/logo* img/bililv.svg options/* scripts/* scripts/sitescripts/* changelog/* manifest.json
	mv manifest-template.json manifest.json

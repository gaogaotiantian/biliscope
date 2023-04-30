const BILIBILI_API_URL = "https://api.bilibili.com"
const NUM_PER_PAGE = 50

async function getUserIdFromVideoLink(videoLink) {
    let regex = /.*?bilibili.com\/video\/(.*)$/;
    let bvid = videoLink.match(regex)[1];

    return await fetch(`${BILIBILI_API_URL}/x/web-interface/view?bvid=${bvid}`)
        .then((response) => response.json())
        .then((data) => {
            return  data["data"]["owner"]["mid"];
        })
}

userInfoCache = new Map();

function updateWordMap(map, sentence, weight) {
    // Remove all URLs
    sentence = sentence.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

    let results = Array.from(new Intl.Segmenter('cn', { granularity: 'word' }).segment(sentence));
    let wordMap = map.get("word");

    for (let result of results) {
        if (result.isWordLike) {
            let word = result["segment"];
            if (word && !STOP_WORDS.has(word)) {
                if (wordMap.has(word)) {
                    wordMap.set(word, wordMap.get(word) + weight);
                } else {
                    wordMap.set(word, weight);
                }
            }
        }
    }
}

function updateTypeMap(map, type) {
    let typeMap = map.get("type");
    if (typeMap.has(type)) {
        typeMap.set(type, typeMap.get(type) + 1);
    } else {
        typeMap.set(type, 1);
    }
}

function videoLengthStringToSeconds(s) {
    let regex = /([0-9]*):([0-9]*)/;
    let match = s.match(regex);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
}

function convertVideoData(map) {
    let data = {};
    let typeData = Array.from(map.get("type"));

    typeData.sort((a, b) => b[1] - a[1]);

    data["word"] = Array.from(map.get("word"));
    data["type"] = typeData.slice(0, 3);

    return data;
}

async function requestSearchPage(userId, pn, map) {
    return fetch(`${BILIBILI_API_URL}/x/space/wbi/arc/search?mid=${userId}&pn=${pn}&ps=${NUM_PER_PAGE}&index=1&order=pubdate&order_avoided=true`)
        .then((response) => response.json())
        .then((data) => {
            if (data["code"] == 0) {
                for (let v of data["data"]["list"]["vlist"]) {
                    updateWordMap(map, v["description"], 1);
                    updateWordMap(map, v["title"], 3);
                    updateTypeMap(map, v["typeid"]);
                    if (v["created"] > Date.now() / 1000 - 30 * 24 * 60 * 60) {
                        map.set("lastMonthVideoCount", map.get("lastMonthVideoCount") + 1);
                    }
                    map.set("totalVideoLength", map.get("totalVideoLength") + videoLengthStringToSeconds(v["length"]));
                }
            }
            return data;
        })
}

function updateVideoData(userId, callback) {
    let map = new Map();
    map.set("word", new Map());
    map.set("type", new Map());
    map.set("lastMonthVideoCount", 0);
    map.set("totalVideoLength", 0);

    requestSearchPage(userId, 1, map).then((data) => {
        if (data["code"] == 0) {
            let count = data["data"]["page"]["count"];
            cacheAndUpdate(callback, userId, "count", {"count": count});

            if (count > 0) {
                let lastVideoTimestamp = data["data"]["list"]["vlist"][0]["created"];
                cacheAndUpdate(callback, userId, "lastVideoTimestamp", {"timestamp": lastVideoTimestamp});
            } else {
                cacheAndUpdate(callback, userId, "lastVideoTimestamp", {"timestamp": null});
            }

            if (biliScopeOptions.enableWordCloud) {
                let promises = [];
                if (count > NUM_PER_PAGE) {
                    let pn = 2;
                    while (pn * NUM_PER_PAGE < count) {
                        promises.push(requestSearchPage(userId, pn, map));
                        pn += 1;
                    }
                    Promise.all(promises).then((values) => {
                        cacheAndUpdate(callback, userId, "wordcloud", convertVideoData(map));
                        cacheAndUpdate(callback, userId, "totalVideoInfo", {
                            "lastMonthCount": map.get("lastMonthVideoCount"),
                            "totalLength": map.get("totalVideoLength")});
                    })
                } else {
                    cacheAndUpdate(callback, userId, "wordcloud", convertVideoData(map));
                    cacheAndUpdate(callback, userId, "totalVideoInfo", {
                        "lastMonthCount": map.get("lastMonthVideoCount"),
                        "totalLength": map.get("totalVideoLength")});
                }
            }
        } else {
            cacheAndUpdate(callback, userId, "count", {"count": null});
            cacheAndUpdate(callback, userId, "wordcloud", {"word": [], "type": []});
            cacheAndUpdate(callback, userId, "totalVideoInfo", {"lastMonthCount": null, "totalLength": null});
        }
    });
}

function cacheValid(cache) {
    for (let key of ["stat", "info", "wordcloud", "count"]) {
        if (!cache[key]) {
            return false;
        }
    }
    return true;
}

function cacheAndUpdate(callback, userId, api, payload) {
    let cache = {};
    if (!userInfoCache.has(userId)) {
        userInfoCache.set(userId, cache);
    } else {
        cache = userInfoCache.get(userId);
    }
    cache[api] = payload;

    callback({"uid": userId, "api": api, "payload": payload});
}

function updateUserInfo(userId, callback) {
    this._prevUserId = null;

    if (this._prevUserId != userId) {
        if (userInfoCache.has(userId) && cacheValid(userInfoCache.get(userId))) {
            let cache = userInfoCache.get(userId);
            for (let api in cache) {
                callback({"uid": userId, "api": api, "payload": cache[api]});
            }
        } else {
            fetch(`${BILIBILI_API_URL}/x/relation/stat?vmid=${userId}&jsonp=jsonp`,)
            .then((response) => response.json())
            .then((data) => cacheAndUpdate(callback, userId, "stat", data));

            fetch(`${BILIBILI_API_URL}/x/space/wbi/acc/info?mid=${userId}`,)
            .then((response) => response.json())
            .then((data) => cacheAndUpdate(callback, userId, "info", data));

            updateVideoData(userId, callback);
        }
    }
}


async function requestGuardPage(roomId, uid, pn, map) {
    return fetch(`https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=${roomId}&page=${pn}&ruid=${uid}&page_size=30`)
        .then((response) => response.json())
        .then((data) => {
            if (data["code"] == 0) {
                for (let u of data["data"]["top3"]) {
                    map.set(u.uid, u);
                }
                for (let u of data["data"]["list"]) {
                    map.set(u.uid, u);
                }
            }
            return data;
        })
}

async function getGuardInfo(roomId, uid) {
    let map = new Map();
    let promises = [];
    let pn = 1;
    return requestGuardPage(roomId, uid, pn, map).then((data) => {
        if (data["code"] == 0) {
            let count = data["data"]["info"]["num"];
            if (count > 30) {
                let pn = 2;
                while (pn * 30 < count) {
                    promises.push(requestGuardPage(roomId, uid, pn, map));
                    pn += 1;
                }
                return Promise.all(promises).then((values) => {
                    let data = Array.from(map.values());
                    return data
                })
            } else {
                return Array.from(map.values());
            }
        } else {
            return [];
        }
    });
}

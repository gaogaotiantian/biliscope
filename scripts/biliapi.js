const BILIBILI_API_URL = "https://api.bilibili.com"
const NUM_PER_PAGE = 50

ignoreWordSet = new Set([
    "的", "了", "我", "你", "他", "她", "在", "么", "哦", "是", "会", "啦", "这", "那"
])

userInfoCache = new Map()

function updateWordMap(map, sentence)
{
    let results = Array.from(new Intl.Segmenter('cn', { granularity: 'word' }).segment(sentence));
    for (let result of results) {
        if (result.isWordLike) {
            let word = result["segment"];
            if (word && !ignoreWordSet.has(word)) {
                if (map.has(word)) {
                    map.set(word, map.get(word) + 1);
                } else {
                    map.set(word, 1);
                }
            }
        }
    }
}

async function requestSearchPage(userId, pn, map)
{
    return fetch(`${BILIBILI_API_URL}/x/space/wbi/arc/search?mid=${userId}&pn=${pn}&ps=${NUM_PER_PAGE}&index=1&order=pubdate&order_avoided=true`)
            .then((response) => response.json())
            .then((data) => {
                if (data["code"] == 0) {
                    for (let v of data["data"]["list"]["vlist"]) {
                        updateWordMap(map, v["description"]);
                        updateWordMap(map, v["title"]);
                    }
                }
                return data;
            })
}

function updateWordCloud(userId, callback)
{
    let map = new Map();
    requestSearchPage(userId, 1, map).then((data) => {
        if (data["code"] == 0) {
            let count = data["data"]["page"]["count"];
            cacheAndUpdate(callback, userId, "count", {"count": count});
            let promises = [];
            if (count > NUM_PER_PAGE) {
                let pn = 2;
                while (pn * NUM_PER_PAGE < count) {
                    promises.push(requestSearchPage(userId, pn, map));
                    pn += 1;
                }
                Promise.all(promises).then((values) => {
                    cacheAndUpdate(callback, userId, "wordcloud", Array.from(map));
                })
            } else {
                cacheAndUpdate(callback, userId, "wordcloud", Array.from(map));
            }
        } else {
            cacheAndUpdate(callback, userId, "count", {"count": 0});
            cacheAndUpdate(callback, userId, "wordcloud", []);
        }
    });
}

function cacheValid(cache)
{
    for (let key of ["stat", "info", "wordcloud", "count"]) {
        if (!cache[key]) {
            return false;
        }
    }
    return true;
}

function cacheAndUpdate(callback, userId, api, payload)
{
    let cache = {};
    if (!userInfoCache.has(userId)) {
        userInfoCache.set(userId, cache);
    } else {
        cache = userInfoCache.get(userId);
    }
    cache[api] = payload;

    callback({"uid": userId, "api": api, "payload": payload});
}

function updateUserInfo(userId, callback)
{
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

            if (biliScopeOptions.enableWordCloud) {
                updateWordCloud(userId, callback);
            }
        }
    }
}

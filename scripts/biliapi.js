const BILIBILI_API_URL = "https://api.bilibili.com"
const NUM_PER_PAGE = 50

async function getUserIdFromVideoLink(videoLink)
{
    let regex = /.*?bilibili.com\/video\/(.*)$/;
    let bvid = videoLink.match(regex)[1];

    return await fetch(`${BILIBILI_API_URL}/x/web-interface/view?bvid=${bvid}`)
    .then((response) => response.json())
    .then((data) => {
        return  data["data"]["owner"]["mid"];
    })
}

userInfoCache = new Map()

function updateWordMap(map, sentence)
{
    let results = Array.from(new Intl.Segmenter('cn', { granularity: 'word' }).segment(sentence));
    let wordMap = map.get("word");

    for (let result of results) {
        if (result.isWordLike) {
            let word = result["segment"];
            if (word && !STOP_WORDS.has(word)) {
                if (wordMap.has(word)) {
                    wordMap.set(word, wordMap.get(word) + 1);
                } else {
                    wordMap.set(word, 1);
                }
            }
        }
    }
}

function updateTypeMap(map, type)
{
    let typeMap = map.get("type");
    if (typeMap.has(type)) {
        typeMap.set(type, typeMap.get(type) + 1);
    } else {
        typeMap.set(type, 1);
    }
}

function convertVideoData(map)
{
    let data = {};
    let typeData = Array.from(map.get("type"));

    typeData.sort((a, b) => b[1] - a[1]);

    data["word"] = Array.from(map.get("word"));
    data["type"] = typeData.slice(0, 3);

    return data;
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
                       updateTypeMap(map, v["typeid"]);
                   }
               }
               return data;
           })
}

function updateVideoData(userId, callback)
{
    let map = new Map();
    map.set("word", new Map());
    map.set("type", new Map());

    requestSearchPage(userId, 1, map).then((data) => {
        if (data["code"] == 0) {
            let count = data["data"]["page"]["count"];
            cacheAndUpdate(callback, userId, "count", {"count": count});
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
                    })
                } else {
                    cacheAndUpdate(callback, userId, "wordcloud", convertVideoData(map));
                }
            }
        } else {
            cacheAndUpdate(callback, userId, "count", {"count": 0});
            cacheAndUpdate(callback, userId, "wordcloud", {"word": [], "type": []});
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

            updateVideoData(userId, callback);
        }
    }
}

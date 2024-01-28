// ===========================================================================
// ==================== Data conversion related ==============================
// ===========================================================================

function numberToDisplay(number) {
    if (number > 10000) {
        return `${(number / 10000).toFixed(1)}万`;
    }
    return number;
}

function timestampToDisplay(timestamp) {
    if (timestamp == null) {
        return ""
    }
    let date = new Date(timestamp * 1000);
    let timediff = Date.now() / 1000 - timestamp;
    const hour = 60 * 60;
    const day = 24 * hour;

    if (timediff < hour) {
        return "刚刚";
    } else if (timediff < day) {
        return `${Math.floor(timediff / hour)}小时前`;
    } else if (timediff < 30 * day) {
        return `${Math.floor(timediff / day)}天前`;
    } else {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
}

function secondsToDisplay(sec) {
    if (!sec) {
        return 0;
    }

    function digitToStr(n) {
        n = Math.floor(n);
        return n < 10 ? "0" + n : n;
    }

    sec = Math.floor(sec);

    if (sec < 60) {
        return `00:${digitToStr(sec)}`;
    } else if (sec < 60 * 60) {
        return `${digitToStr(sec / 60)}:${digitToStr(sec % 60)}`;
    } else {
        return `${digitToStr(sec / 60 / 60)}:${digitToStr(sec / 60) % 60}:${digitToStr(sec % 60)}`;
    }
}

function secondsToTimeLink(sec) {
    if (!sec) {
        return 0;
    }

    function digitToStr(n) {
        n = Math.floor(n);
        return n < 10 ? "0" + n : n;
    }

    sec = Math.floor(sec);

    if (sec < 60) {
        return `${digitToStr(sec)}s`;
    } else if (sec < 60 * 60) {
        return `${digitToStr(sec / 60)}m${digitToStr(sec % 60)}s`;
    } else {
        return `${digitToStr(sec / 60 / 60)}h${digitToStr(sec / 60) % 60}m${digitToStr(sec % 60)}s`;
    }
}

// ===========================================================================
// ========================= Data query related ==============================
// ===========================================================================

function getTags(mid) {
    let note = noteData[mid];
    if (note) {
        let ret = [];
        for (match of note.matchAll(/#(.+?)#/g)) {
            ret.push(match[1]);
        }
        return ret;
    }
    return [];
}

// ===========================================================================
// =========================== Cookie Parser =================================
// ===========================================================================

function parseCookie(cookie) {
    let ret = {};
    for (let line of cookie.split(";")) {
        let [key, value] = line.split("=");
        ret[key.trim()] = value.trim();
    }
    return ret;
}

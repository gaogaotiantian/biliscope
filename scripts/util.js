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

// ===========================================================================
// ===================== Element display related =============================
// ===========================================================================

/***
 * @param {HTMLElement} el
 * @param {{left: number, right: number, top: number, bottom: number}} targetBounding
 * @param {('left' | 'right' | 'top' | 'bottom' | 'default')[]} directions
 * @param {number} cursorPadding
 * @param {number} windowPadding
 */
function displayElOutsideTarget(el, targetBounding, directions, cursorPadding = 10, windowPadding = 20) {
    const cardWidth = el.scrollWidth;
    const cardHeight = el.scrollHeight;

    const {left = 0, right = 0, top = 0, bottom = 0} = targetBounding;

    for (const direction of directions) {
        switch (direction) {
            case "left":
                if (left - windowPadding - cardWidth < 0) {
                    continue;
                }

                el.style.left = `${left - cursorPadding - cardWidth + window.scrollX}px`;
                break;
            case "right":
                if (right + windowPadding + cardWidth > window.innerWidth) {
                    continue;
                }

                el.style.left = `${right + cursorPadding + window.scrollX}px`;
                break;
            case "top":
                if (top - cardHeight < 0) {
                    continue;
                }

                el.style.top = `${top - cursorPadding - cardHeight + window.scrollY}px`;
                break;
            case "bottom":
                console.log(bottom + cardHeight, window.innerHeight);

                if (bottom + cardHeight > window.innerHeight) {
                    continue;
                }
            case "default":
                el.style.top = `${bottom + cursorPadding + window.scrollY}px`;
                break;
        }

        switch (direction) {
            case "left":
            case "right":
                if (top + windowPadding + cardHeight < window.innerHeight) {
                    // Put it on the bottom
                    el.style.top = `${top + window.scrollY}px`;
                } else if (bottom - windowPadding - cardHeight > 0) {
                    // Put it on the top
                    el.style.top = `${bottom - cardHeight + window.scrollY}px`;
                } else {
                    // Put it in the middle
                    const middle = top + (bottom - top) / 2;
                    el.style.top = `${middle - cardHeight / 2 + window.scrollY}px`;
                }
                return;
            case "top":
            case "bottom":
            case "default":
                if (left + cardWidth > window.innerWidth) {
                    // Will overflow to the right, put it on the left
                    el.style.left = `${right - cardHeight + window.scrollX}px`;
                } else {
                    el.style.left = `${left + window.scrollX}px`;
                }
                return;
        }
    }
}

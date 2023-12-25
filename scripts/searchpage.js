var myWrapper = null;

function getUserCard(data) {
    return `
    <div class="col_6 col_md_4 mb_x60 biliscope-searchcard">
        <div class="b-user-info-card flex_start">
            <a class="mr_md" href="//space.bilibili.com/${data.mid}" target="_blank" biliscope-userid="${data.mid}">
                <div class="search-user-avatar p_relative">
                    <div class="avatar-wrap p_relative">
                        <div class="avatar-inner">
                            <div class="bili-avatar" style="width: 86px;height:86px;transform: translate(0px, 0px);">
                                <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius" src="${data.face}@240w_240h_1c_1s_!web-avatar-search-user.avif">
                                <span class="bili-avatar-icon bili-avatar-right-icon ${data.avatarIconClass} bili-avatar-size-86"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
            <div class="user-content pr_md">
                <h2 class="b_text i_card_title mt_0">
                    <a class="text1 p_relative" href="//space.bilibili.com/${data.mid}" target="_blank" biliscope-userid="${data.mid}">${data.name}</a>
                    <svg class="level-icon ml_sm v_align_baseline">
                        <use xlink:href="#lv_${data.level}"></use>
                    </svg>
                    <span class="biliscope-search-tag-list" style="margin-left: 10px">${data.tagInner}</span>
                </h2>
                <p class="b_text fs_5 text2 text_ellipsis">${noteData[data.mid].split("\n", 1)[0]}</p>
                <p class="b_text fs_5 text2 text_ellipsis">${data.sign}
                    <span style="margin-left: 3px; ${data.official.title ? "": "display: none"}">${data.official.title}</span>
                </p>
            </div>
        </div>
    </div>
    `
}
function updatePage(clear=true) {
    if (!this.users || clear) {
        this.users = new Set();
    }

    if (window.location.search.includes("keyword=%23") && myWrapper) {
        const params = new URLSearchParams(window.location.search);
        const keywords = params.get("keyword").split(" ");
        let newUsers = [];

        for (let uid in noteData) {
            if (!(this.users.has(uid))) {
                let tags = getTags(uid);
                if (keywords.every(keyword => tags.includes(keyword.replaceAll("#", "")))) {
                    this.users.add(uid);
                    newUsers.push(uid);
                    if (newUsers.length >= 50) {
                        // the API can take 50 users at most
                        break;
                    }
                }
            }
        }

        let container = document.getElementById("biliscope-tag-search-result");

        if (!container || clear) {
            container = document.createElement("div");
            container.className = "media-list row mt_x40";
            container.id = "biliscope-tag-search-result";
            myWrapper.innerHTML = "";
            myWrapper.appendChild(container);
        }

        if (this.users.length == 0) {
            myWrapper.innerHTML = `
            <div class="search-nodata-container p_relative">
                <div class="no-data p_center text_center">
                    <img class="no-data-img" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/nodata.67f7a1c9.png">
                    <p class="mt_lg b_text text3">今天真是寂寞如雪啊~</p>
                </div>
            </div>
            `
        } else if (newUsers.length > 0) {
            biliGet("https://api.vc.bilibili.com/account/v1/user/cards", {"uids": newUsers.join()})
            .then(data => {
                for (let d of data.data) {
                    let tagInner = "";
                    for (let tag of getTags(d.mid)) {
                        tagInner += `<a href="//search.bilibili.com/upuser?keyword=%23${encodeURIComponent(tag)}"><span class="biliscope-search-tag">${tag}</span></a>`;
                    }
                    d.tagInner = tagInner;
                    if ([1, 2, 7, 9].includes(d.official.role)) {
                        d.avatarIconClass = "bili-avatar-icon-personal";
                    } else if ([3, 4, 5, 6].includes(d.official.role)) {
                        d.avatarIconClass = "bili-avatar-icon-business";
                    } else {
                        d.avatarIconClass = "";
                    }
                    container.innerHTML += getUserCard(d);
                }
            })
        }
    }
}

function scrollBottomCallback(event) {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1) {
        updatePage(false);
    }
}

if (window.location.href.startsWith(`${BILIBILI_SEARCH_URL}`)) {
    // Redirect to `upuser` if keyword startsWith `#` or `@`
    if (window.location.pathname != '/upuser' && (window.location.search.includes("keyword=%23") || window.location.search.includes("keyword=%40"))) {
        window.location.pathname = '/upuser';
    }

    let prevHref = null;
    let observer = new MutationObserver((mutationList, observer) => {
        if (window.location.href.startsWith(`${BILIBILI_SEARCH_URL}upuser`)) {
            let wrapper = document.getElementsByClassName("search-page-upuser")[0];
            // If the wrapper for custom search result is not created, create it
            if (wrapper && document.getElementsByClassName("biliscope-search-wrapper").length == 0) {
                myWrapper = document.createElement("div");
                myWrapper.className = "search-page search-page-upuser i_page_container i_wrapper biliscope-search-wrapper"
                document.getElementsByClassName("search-page-wrapper")[0].appendChild(myWrapper);
                updatePage();
            }

            if (window.location.href != prevHref) {
                updatePage();
                prevHref = window.location.href;
            }

            // Display the wrappers based on whether the custom search is enabled
            if (window.location.search.includes("keyword=%23")) {
                if (wrapper) {
                    wrapper.hidden = true;
                }
                if (myWrapper) {
                    myWrapper.hidden = false;
                }
                window.addEventListener("scroll", scrollBottomCallback);
            } else {
                if (wrapper) {
                    wrapper.hidden = false;
                }
                if (myWrapper) {
                    myWrapper.hidden = true;
                }
                window.removeEventListener("scroll", scrollBottomCallback);
            }
        } else {
            if (myWrapper) {
                myWrapper.hidden = true;
            }
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true
    })
}

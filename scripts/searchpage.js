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
function updatePage() {
    if (window.location.search.includes("keyword=%23")) {
        const params = new URLSearchParams(window.location.search);
        const keywords = params.get("keyword").split(" ");
        let users = [];

        for (let uid in noteData) {
            let tags = getTags(uid);
            if (keywords.every(keyword => tags.includes(keyword.replaceAll("#", "")))) {
                users.push(uid);
                if (users.length >= 50) {
                    // the API can take 50 users at most
                    break;
                }
            }
        }

        let container = document.createElement("div");
        container.className = "media-list row mt_x40";

        if (users.length == 0) {
            myWrapper.innerHTML = `
            <div class="search-nodata-container p_relative">
                <div class="no-data p_center text_center">
                    <img class="no-data-img" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/nodata.67f7a1c9.png">
                    <p class="mt_lg b_text text3">今天真是寂寞如雪啊~</p>
                </div>
            </div>
            `
        } else {
            biliGet("https://api.vc.bilibili.com/account/v1/user/cards", {"uids": users.join()})
            .then(data => {
                for (let d of data.data) {
                    let tagInner = "";
                    for (let tag of getTags(d.mid)) {
                        tagInner += `<a href="//search.bilibili.com/upuser?keyword=%23${tag}"><span class="biliscope-search-tag">${tag}</span></a>`;
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
            myWrapper.innerHTML = "";
            myWrapper.appendChild(container);
        }
    }
}

if (window.location.href.startsWith(`${BILIBILI_SEARCH_URL}`)) {
    let prevHref = null;
    let observer = new MutationObserver((mutationList, observer) => {
        if (window.location.href.startsWith(`${BILIBILI_SEARCH_URL}upuser`)) {
            let wrapper = document.getElementsByClassName("search-page-upuser")[0];
            if (wrapper && document.getElementsByClassName("biliscope-search-wrapper").length == 0) {
                myWrapper = document.createElement("div");
                myWrapper.className = "search-page search-page-upuser i_page_container i_wrapper biliscope-search-wrapper"
                document.getElementsByClassName("search-page-wrapper")[0].appendChild(myWrapper);
                updatePage();
            }
            if (window.location.href != prevHref && wrapper) {
                if (window.location.search.includes("keyword=%23")) {
                    wrapper.hidden = true;
                    myWrapper.hidden = false;
                } else {
                    wrapper.hidden = false;
                    myWrapper.hidden = true;
                }
                updatePage();
                prevHref = window.location.href;
            }
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true
    })
}

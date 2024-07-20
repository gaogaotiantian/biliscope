const BILISCOPE_CHANGE_LOG = [
    {
        version: "0.5.4",
        changes: [
            "增加了首页换一换的前进后退功能",
            "在新的动态页面中也显示IP地址",
            "把关注和拉黑按钮做的更美观了",
            "在用户卡片加入了私信按钮",
        ]
    },
    {
        version: "0.5.3",
        changes: [
            "在用户卡片增加了拉黑按钮",
            "在视频和动态页面中显示IP地址",
            "修复了一些广告的错误判断",
        ]
    },
    {
        version: "0.5.2",
        changes: [
            "增加了视频是否为广告或低质的判断",
            "修复了在动态弹出框中鼠标移至视频总结会导致动态框消失的问题",
        ]
    },
    {
        version: "0.5.1",
        changes: [
            "增加了一些控制功能的选项",
            "增加了反馈问题的按钮",
        ]
    },
    {
        version: "0.5.0",
        changes: [
            "增加了视频AI总结功能",
            "优化了标签搜索和词云的显示",
        ]
    },
    {
        version: "0.4.*",
        changes: [
            "再前面懒得写了",
        ]
    },
];
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const prevVersion = params.get("prev_version");
    const container = document.createElement("div");
    let showed = false;
    for (const log of BILISCOPE_CHANGE_LOG) {
        if (log.version === prevVersion) {
            showed = true;
        }
        const logDiv = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = `v${log.version}`;
        logDiv.appendChild(title);
        const ul = document.createElement("ul");
        logDiv.appendChild(ul);
        if (!showed) {
            logDiv.classList.add("font-weight-bold");
        }
        for (const change of log.changes) {
            const item = document.createElement("li");
            item.innerHTML = change;
            ul.appendChild(item);
        }
        container.appendChild(logDiv);
    }
    document.getElementById("changelog-list").appendChild(container);
});
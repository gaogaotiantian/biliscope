const BILISCOPE_CHANGE_LOG = [
    {
        version: "0.6.3",
        changes: [
            "修复了词云的显示问题",
            "不再会在合集上错误显示用户卡片了",
            "支持对评论区@用户的卡片显示",
        ]
    },
    {
        version: "0.6.2",
        changes: [
            "悬停在关注按钮上会显示关注时间了",
            "解决了右上角下拉菜单中卡片误关闭的问题",
            "优化了视频AI总结的触发和位置",
            "重新支持了多个评论区",
            "解决了调用API返回-352的问题",
            "增加了高分屏下词云的分辨率",
            "对于已注销用户，不再显示错误数据",
        ]
    },
    {
        version: "0.6.1",
        changes: [
            "增加了对Firefox的初步支持",
            "修复了换一换时偶尔会无法继续刷新的问题",
            "保存选项时不再需要刷新页面了",
            "在用户卡片增加了职业",
            "重新定位了视频卡片的位置，使其尽可能少遮挡信息",
            "对于已经加入黑名单的用户，增加了取消拉黑按钮",
        ]
    },
    {
        version: "0.6.0",
        changes: [
            "增加了首页换一换的前进后退功能",
            "在新的动态页面中也显示IP地址",
            "把关注和拉黑按钮做的更美观了",
            "在用户卡片加入了私信按钮",
            "增强了广告的判定",
            "修复了新版评论区中显示用户卡片的问题",
            "在视频卡片中增加了热评的显示",
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
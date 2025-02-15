# BiliScope

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ekmbchepcdggpcbdpjpijphjiiiimfga)](https://chromewebstore.google.com/detail/biliscope-bilibili%E6%8F%92%E4%BB%B6%EF%BC%8C%E7%9F%A5%E9%81%93ta/ekmbchepcdggpcbdpjpijphjiiiimfga?hl=zh-CN)
[![Edge Add-on Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fppfempmgnmhbeoanbndlackmlolejegm&query=%24.version&prefix=v&label=edge%20add-on&color=%23ee7a3b)](https://microsoftedge.microsoft.com/addons/detail/biliscope/ppfempmgnmhbeoanbndlackmlolejegm)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/biliscope-bilibili%E6%8F%92%E4%BB%B6-%E4%BD%A0%E7%9A%84b%E7%AB%99%E5%B0%8F%E5%8A%A9%E6%89%8B)](https://addons.mozilla.org/en-US/firefox/addon/biliscope-bilibili%E6%8F%92%E4%BB%B6-%E4%BD%A0%E7%9A%84b%E7%AB%99%E5%B0%8F%E5%8A%A9%E6%89%8B)

BiliScope是一个为B站打造的Chrome/Edge/Firefox插件。它可以让你在B站的任何网页轻松查询任何出现的UP的详细信息，以及查看视频的AI内容总结。

[![example_img](https://github.com/gaogaotiantian/biliscope/blob/master/img/screenshot.png)](https://github.com/gaogaotiantian/biliscope/blob/master/img/screenshot.png)

## 使用方式

你可以在Chrome Web Store找到[BiliScope](https://chrome.google.com/webstore/detail/biliscope/ekmbchepcdggpcbdpjpijphjiiiimfga)

如果你使用的是Edge，也可以在Chrome Web Store下载，或者可以去微软的Addon Store搜索[BiliScope](https://microsoftedge.microsoft.com/addons/detail/biliscope/ppfempmgnmhbeoanbndlackmlolejegm)

*微软审核的速度比Google慢很多，所以版本可能有差别*

Firefox的用户，可以去Mozilla Addon Store搜索[BiliScope](https://addons.mozilla.org/en-US/firefox/addon/biliscope-bilibili%E6%8F%92%E4%BB%B6-%E4%BD%A0%E7%9A%84b%E7%AB%99%E5%B0%8F%E5%8A%A9%E6%89%8B/)

你也可以直接clone这个project，`make`（powershell中请使用`./make`），就会打包出一个`biliscope_chrome.zip`
和一个文件`biliscope_firefox.zip`文件，可以在`chrome://extensions`（需要打开开发者模式）和`about:addons`中安装。


## 功能

当浏览B站时，把鼠标悬停到up主的链接上，会出现上图所示的信息卡片。

目前在卡片中显示的信息有

* up主的ID
* up主的等级
* 与up主的关注关系
* 快速关注/拉黑up主的按键
* up主是否在直播
* 给up主的备注
* up主的关注数，粉丝数，投稿数
* up主的标签（默认是最常投稿的分区）
* up主的认证
* up主的签名
* up主全部投稿标题和描述生成的词云

把鼠标悬停到视频上，会显示上图所示的AI内容总结。点击总结中的章节可以跳转到对应时间的视频。

自动显示动态和视频评论区的IP属地。

## 备注说明

在每个up主主页的右下角会有备注栏，可以填写备注。也可以在信息卡片上直接点击up主的名字打开备注栏。

备注的第一行（以`\n`为界限）会显示在up主的卡片上。其余部分只会显示在主页备注栏。

在备注的任何地方可以添加`#标签名#`的标签，如果up被备注了任何标签，up主卡片上就不再会显示最常投稿区，而会显示在备注中的标签。

你可以在B站以`#标签名`为关键词进行用户搜索，可以搜索到标签对应的up主。

在设置（点击浏览器扩展栏上的Biliscope图标）中可以添加标签对应的颜色，也可以开启让up主的名字显示成标签对应的颜色的功能。

## 备份备注

在设置（点击浏览器扩展栏上的Biliscope图标）中点击导出/导入备注

## LICENSE

Copyright 2023-2025 Tian Gao.

MIT

# BiliScope

BiliScope是一个为B站打造的Chrome/Edge插件。它可以让你在B站的任何网页轻松查询任何出现的UP的详细信息。

[![example_img](https://github.com/gaogaotiantian/biliscope/blob/master/img/screenshot.png)](https://github.com/gaogaotiantian/biliscope/blob/master/img/screenshot.png)

## 使用方式

你可以在Chrome Web Store找到[BiliScope](https://chrome.google.com/webstore/detail/biliscope/ekmbchepcdggpcbdpjpijphjiiiimfga)

如果你使用的是Edge，也可以在Chrome Web Store下载，或者可以去微软的Addon Store搜索[BiliScope](https://microsoftedge.microsoft.com/addons/detail/biliscope/ppfempmgnmhbeoanbndlackmlolejegm)
*微软审核的速度比Google慢很多，所以版本可能有差别*

你也可以直接clone这个project，`make`，就会打包出一个`biliscope.zip`文件，可以在`chrome://extensions`中加载（需要打开开发者模式） 


## 功能

当浏览B站时，把鼠标悬停到up主的链接上，会出现上图所示的信息卡片。

目前在卡片中显示的信息有

* up主的ID
* 与up主的关注关系
* 给up主的备注
* up主的关注数，粉丝数，投稿数
* up主最常投稿的分区
* up主的认证
* up主的签名
* up主全部投稿标题和描述生成的词云

## LICENSE

MIT
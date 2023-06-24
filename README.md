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
* up主的等级
* 与up主的关注关系
* up主是否在直播
* 给up主的备注
* up主的关注数，粉丝数，投稿数
* up主最常投稿的分区
* up主的认证
* up主的签名
* up主全部投稿标题和描述生成的词云

## 备注说明

在每个up主主页的右下角会有备注栏，可以填写备注。

备注的第一行（以`\n`为界限）会显示在up主的卡片上。其余部分只会显示在主页备注栏。

在备注的任何地方可以添加`#标签名#`的标签，如果up被备注了任何标签，up主卡片上就不再会显示最常投稿区，而会显示在备注中的标签。

你可以在B站以`#标签名`为关键词进行用户搜索，可以搜索到标签对应的up主。

## LICENSE

MIT
首先, 感谢你愿意为`biliscope`做出贡献！

## 贡献代码之前

如果你有改动多行以上代码的想法，我建议你先提交一个`issue`（议题），来谈谈你想要实现的东西。在你投入太多精力之前，我们应该讨论一下，来确认这个修改是否合适。

你还需要安装`pre-commit`钩子，来检查你的提交没有一些细节上的问题。

```
// 电脑没有python环境的话请先安装python
pip install pre-commit
pre-commit install
```

## 贡献代码

首先，你需要`fork`（复刻）此项目，然后创建一个新的分支：

```
git clone https://github.com/<your_user_name>/biliscope.git
cd biliscope
git checkout -b <your_feature_branch>
```

在你完成代码的修改之后，你需要向`gaogaotiantian/viztracer`的`master`分支发起一个`Pull Request`（拉取请求）, 我会尽快审查代码并给予反馈。

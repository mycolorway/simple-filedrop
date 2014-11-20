simple-filedrop
=============

[![Build Status](https://travis-ci.org/ichord/simple-filedrop.svg)](https://travis-ci.org/ichord/simple-filedrop)

### 配置

* `el` 投放区域元素，jQuery 对象，class, id
* `types :Array` 允许投放的文件格式, 为字符串数组(Array), 比如 [`image/png`, `image/jpeg`]
* `hints :String` 投放区域的提示文字。

### 事件

* `fileDropShown (event)` **开始拖入** 时显示投放区域 (drop zone)
* `fileDropHidden (event)` **放弃拖入后** 隐藏投放区域。
* `fileDrop (event, files)` 成功投放。
* `fileDropFail (file, message)` 投放成功后文件处理出错，比如错误的文件格式

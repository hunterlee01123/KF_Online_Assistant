// ==UserScript==
// @name        自定义侧边栏导航内容
// @version     1.0
// @trigger     start
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13082960
// @description 可为侧边栏导航添加自定义的导航内容
// ==/UserScript==
'use strict';
const Const = _interopRequireDefault(require('./Const')).default;

// 自定义侧边栏导航内容
// 格式：'<li><a href="导航链接">导航项名称</a></li>'
Const.customSideBarContent =
    '<li><a href="test1.php">导航项1</a></li>' +
    '<li><a href="test2.php">导航项2</a></li>' +
    '<li><a href="test3.php">导航项3</a></li>';

// 自定义侧边栏导航内容（手机平铺样式）
// 格式：'<a href="导航链接1">导航项名称1</a> | <a href="导航链接2">导航项名称2</a><br>'，换行：'<br>'
Const.customTileSideBarContent =
    '<a href="test1.php">导航项1</a> | <a href="test2.php">导航项2</a><br>' +
    '<a href="test3.php">导航项3</a> | <a href="test4.php">导航项4</a><br>';
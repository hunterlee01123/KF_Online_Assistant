# KF Online助手
KFOL必备！为绯月Galgame论坛增加了大量人性化、自动化的功能，更多功能开发中……

## 脚本下载地址
__注：初次安装请先阅读安装方法__  
__以下3个版本仅在数据存储类型的支持程度方面有所区别（在其它功能上并无区别），关于各存储类型的区别详见【[常见问题1](https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98#1)】__  
__关于ES5和ES6版本的区别请参见【[常见问题2](https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98#2)】（如实在不清楚应该安装哪个版本，请一律安装ES5版本）__  
1. __全功能版：__[[ES5](https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es5/Full.user.js)] [[ES6](https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/Full.user.js)]  
可使用全部的存储类型（默认、按uid、全局）__（部分浏览器可能无法使用或有功能异常，例如Firefox桌面版）__  
2. __通用版：__ [[ES5](https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es5/Common.user.js)] [[ES6](https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/Common.user.js)]  
仅能使用默认的存储类型，所有浏览器通用 __（如全功能版无法使用，请安装此版本）__  
3. __For Firefox版：__[[ES5](https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es5/ForFirefox.user.js)] [[ES6](https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/ForFirefox.user.js)]  
Firefox桌面版专用（安卓版请安装全功能版），引入了一个额外的jQuery脚本，可使用全部的存储类型 __（代价是脚本初始化用时将翻倍，如只使用默认存储类型的话，建议安装通用版）__

__注：如发现部分功能无法正常使用，请尝试安装其它版本（通用版及ES5版的兼容性最好）__

## 安装方法
1. __Firefox：__ 安装[Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)扩展，重启浏览器后打开脚本下载地址安装脚本即可
2. __Chrome（及各种采用Chrome内核的浏览器，如360、搜狗、百度、猎豹、QQ浏览器等）：__  
安装[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)扩展（需翻墙），然后打开脚本下载地址安装脚本即可  
__（注意：安装脚本的时候请点击“安装”按钮，不要点“安装在Chrome”的按钮【[见251楼](http://bbs.2dkf.com/read.php?tid=508450&spid=12484531)】）__  
_（各种采用了Chrome内核的国产浏览器也可尝试到各自的应用市场里搜索Tampermonkey扩展）_
3. __Opera：__ 安装[Violent monkey](https://addons.opera.com/zh-cn/extensions/details/violent-monkey/?display=zh)扩展，然后打开脚本下载地址安装脚本即可
4. __傲游浏览器：__ 安装[暴力猴](http://extension.maxthon.cn/detail/index.php?view_id=1680)扩展，然后打开脚本下载地址安装脚本即可
5. __手机浏览器及其它不支持油猴脚本的浏览器：__ [详情请见此贴](http://bbs.2dkf.com/read.php?tid=509273)
6. __自带脚本的反向代理服务器：__ 无需安装任何插件即可使用KFOL助手，[详情请见此贴](http://bbs.2dkf.com/read.php?tid=540148)

## 使用说明
安装完脚本后请点击论坛页面上方的助手设置链接，打开设置界面进行相应设置，如不清楚各选项的意思可将鼠标停留在其之后的问号上即可获得相应提示 __（自动捐款等功能默认关闭，请自行开启）__  
__在设置里开启定时模式后可按时进行自动操作（如不开启的话只能在刷新页面后才会进行操作）__，自动操作包括自动捐款（需开启相关功能），__只在论坛首页生效__

## 常见问题
[详细问题请参见此页面&raquo;](https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

## 更新日志
[详细日志请参见此页面&raquo;](https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97)

## 开发计划
* 暂无

## 讨论帖
http://bbs.2dkf.com/read.php?tid=508450

## License
[MIT](http://opensource.org/licenses/MIT)

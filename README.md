# KF Online助手
KFOL必备！可在绯月Galgame上自动进行争夺、抽取神秘盒子以及KFB捐款，并可使用各种便利的辅助功能，更多功能开发中……

## 脚本下载地址
* __标准版：__[点击此处安装](https://greasyfork.org/zh-CN/scripts/8615)  
设置和日志存储在浏览器的localStorage中，设置仅通过域名区分，日志通过域名和uid区分
* __ScriptStorage版：__[点击此处安装](https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_Script_Storage.user.js)  
设置和日志存储在油猴脚本的配置中，设置和日志仅通过uid区分（可用于设置经常会被浏览器清除的情况）__【Firefox下可能无法使用】__
* __GlobalStorage版：__[点击此处安装](https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant_Global_Storage.user.js)  
设置和日志存储在油猴脚本的配置中，各域名和各uid使用全局设置，日志仅通过uid区分（可用于想要使用全局设置的情况）__【Firefox下可能无法使用】__  
__注：如需要改用其它版本，可先将设置及日志导出来，在安装后再导入即可__

## 使用说明
安装完脚本后请点击KF页面上方的助手设置链接，打开设置界面进行相应设置，如不清楚各选项的意思可将鼠标停留在其之后的问号上即可获得相应提示__（自动捐款、争夺、抽取神秘盒子等功能默认关闭，请自行开启）__  
开启定时模式可按时进行自动操作（包括捐款、争夺、抽取神秘盒子、自动更换神秘颜色，需开启相关功能），只在论坛首页生效（如非必要，请勿同时使用浏览器的定时刷新功能，否则有可能会造成操作中断）  
__如安装之后发现脚本没有起效，请参见【常见问题1】__

## 常见问题
1. __我安装了脚本，却发现助手似乎没有生效的样子，该怎么办？__  
答：请尝试先删除脚本后再重新安装（删除后可能需要重启浏览器）；依然无效的话，请尝试安装[此地址的脚本(标准版)](https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/KF_Online_Assistant.user.js)；如果还不行，请尝试更新或重装一下相应的油猴扩展  
__注：删除ScriptStorage和GlobalStorage版脚本会导致设置和日志也被一同清除，标准版则无此问题__
2. __助手能按时自动进行争夺、捐款等操作吗？是否需要刷新页面才能操作？__  
答：开启定时模式后，助手可按时进行自动操作（包括捐款、争夺、抽取神秘盒子，需开启相关功能），__只在论坛首页生效__，默认情况下，在停留一分钟后页面标题会显示倒计时（如非必要，请勿同时使用浏览器的定时刷新功能，否则有可能会造成操作中断）
3. __为什么我在2dgal.com修改了助手的设置，在9baka.com下又要重新进行设置？__  
答：标准版的KFOL助手的设置对于不同域名（包括子域名）并不通用，每个（子）域名需重新进行设置，可使用导入导出设置功能进行快速设置（日志也同样无法通用）；也可改用ScriptStorage或GlobalStorage版的KFOL助手
4. __为什么助手不显示争夺的精确倒计时（只显示剩余N个多小时），之前明明可以显示分钟的？__  
答：如果在本回合内通过其它浏览器或手机领取了争夺奖励，那么助手只能显示估计时间，等下回合通过助手自动领取争夺奖励后，即可显示精确的时间
5. __助手显示的争夺（或神秘盒子）的倒计时误差太大了，该怎么办？__  
答：在正常情况下，助手显示的倒计时误差一般不会超过1个小时，如果误差过大，请打开设置界面，点击右上角的清除缓存按钮即可恢复正常
6. __为什么助手的设置经常被还原啊，有什么办法解决？__  
答：标准版KFOL助手的设置是保存在浏览器的localStorage中的，如果清除了浏览器的某些数据，可能会造成localStorage的数据被清除，助手设置也就被还原了。  
方法1：改用ScriptStorage或GlobalStorage版的KFOL助手；  
方法2：可先在设置界面里修改好相应设置，再将导入/导出设置文本框里的设置填入到脚本文件开头的`var myConfig = {};`处即可覆盖相应的默认设置（不过每次脚本更新后需要重新进行设置）；
7. __自定义CSS是什么？__  
答：可通过添加自定义CSS规则来修改论坛的界面（如果有安装Stylish扩展的话，也可使用Stylish扩展，效果会更好），可在[自定义CSS规则收集帖](http://bbs.2dgal.com/read.php?tid=500969)里寻找、分享自定义CSS规则
8. __自定义脚本是什么？__  
答：自定义脚本（在理论上）可以在不修改脚本文件本身的情况下，对脚本几乎所有地方进行修改，并可以增加助手所不具有的新功能（参见[使用及编写介绍](http://bbs.2dgal.com/read.php?tid=500653)），可在[自定义脚本收集帖](http://bbs.2dgal.com/read.php?tid=500968)里寻找、分享自定义脚本
9. __我希望能在不同时间段内采用不同的自动攻击方式（比如早上打怪时设置在距本回合结束前90分钟才进行自动攻击，而晚上打怪时则希望立即进行自动攻击），该怎么做？__  
答：可使用自定义脚本做到，具体脚本请[参见这里](http://bbs.2dgal.com/read.php?tid=500968&spid=12318348)
10. __试探攻击是什么？__  
答：试探攻击是指每隔一段时间检查当前争夺剩余的KFB，当检查到KFB不超过低保值时，进行一次试探攻击以吸引怪物的攻击，在大量肉山来袭的情况下效果尤为显著。主要适用于较低等级玩家，可有效防止最终被打成低保（不过需要一定时间用来挂机），高等级玩家效果不太明显
11. __我想在捐款时捐出当前持有KFB的一定比例，该怎么做？__  
答：将KFB捐款额度设定为百分比即可，如捐出全部现金的话，只需设定为100%即可
12. __IE或手机等不支持油猴脚本的浏览器可以用KFOL助手吗？__  
答：详情请[参见此贴](http://bbs.2dgal.com/read.php?tid=509273)的说明
13. __当发现某些操作（如定时模式）不正常时该怎样进行报告？__  
答：发现不正常的状况时，__请暂时不要刷新页面__，接着打开Web控制台（Firefox：菜单->开发者->Web控制台【快捷键：Ctrl+Shift+K】；Chrome：菜单->工具->Javascript控制台【快捷键：Ctrl+Shift+J】；其它：打开开发者工具栏后【可能的快捷键：F12】，切换到Console[或控制台]标签），将控制台里的信息复制或截图，并将其它有用的信息（如页面标题上的倒计时等）连同问题描述发表到讨论帖里

## 更新日志
* __V4.5.1 (2015-11-01)__ ([详见](http://bbs.2dgal.com/read.php?tid=508450&spid=12512323))
  * 增加了争夺攻击数值合计的功能
  * 增加了自动更换神秘颜色的功能
  * 增加了禁用动画效果的功能
  * 增强了屏蔽用户的功能
  * 改进了批量转账的功能
  * 在生命值不超过低保线时检查是否进行攻击的间隔时间可分时间段进行设置
  * 增加了导入/导出关注和屏蔽用户的功能
  * 修正了部分BUG
* __V4.4.4 (2015-09-26)__ ([详见](http://bbs.2dgal.com/read.php?tid=508450&spid=12417624))
  * 增加了统计争夺奖励收获情况的功能(日志)
  * 增加了拥有致命一击时攻击指定怪物的功能
  * 在脚本代码里增加了覆盖默认设置的功能
  * 在批量攻击提示消息和日志中显示暴击及致命一击的次数
  * 修正了道具出售价格的BUG
  * 修改了自动活期存款的触发方式
  * 增加了争夺属性数值合计的功能
  * 增加了高亮@提醒页面中未读消息的功能
  * 修正了定时模式下的一处BUG
* __V4.3.3 (2015-08-05)__ ([详见](http://bbs.2dgal.com/read.php?tid=500069&spid=12313823))
  * 增加了当生命值不超过低保线时进行试探攻击的功能
  * 增加了用户备注的功能
  * 增加了执行自定义脚本的功能
  * 增加了清除缓存的功能
  * 增加了复制代码的功能
  * 增加了显示本回合受到怪物攻击次数的功能
* __V4.2.0 (2015-07-26)__ ([详见](http://bbs.2dgal.com/read.php?tid=500069&spid=12307044))
  * 增加了在指定时间段内不自动领取争夺奖励的功能
  * 增加了导入/导出日志的功能
  * 增加了自定义CSS的功能
  * 增加了定期存款到期提醒的功能
* __V4.1.2 (2015-07-23)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12284111))
  * 增加了自动使用批量攻击后刚掉落道具的功能
  * 增加了自定义怪物名称的功能
  * 增加了在道具总览页面上批量使用道具、恢复道具、将道具转换为能量的功能
  * 修正了网络超时导致批量攻击无法完成的BUG
* __V4.0.1 (2015-07-14)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12271420))
  * 恢复了定时模式
  * 增加了在距本回合结束前指定时间内攻击的功能
  * 增加了在首页上显示争夺奖励和神秘盒子的剩余时间的功能
  * 修改了争夺奖励可领取时间的计算方式
* __V3.9.3 (2015-07-09)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12260670))
  * 增加了自动争夺的功能
  * 修改了自动攻击的触发方式
  * 修改了批量攻击的时间间隔
* __V3.8.0 (2015-07-05)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12253415))
  * 增加了批量攻击的功能
  * 增加了自定义首页@提醒消息框的处理方式的功能
* __V3.7.0 (2015-06-29)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12238308))
  * 增加了批量出售道具的功能
  * 增加了显示可领取争夺奖励时间的功能
  * 增加了批量购买帖子的功能
* __V3.6.0 (2015-06-27)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12231906))
  * 增加了批量购买道具的功能
* __V3.5.2 (2015-06-26)__ ([详见](http://bbs.2dgal.com/read.php?tid=493907&spid=12222027))
  * 增加了选择指定标题的短消息的功能
  * 增加了在首页帖子旁显示快速跳转至页末的链接的功能
  * 增加了在无VIP时去除首页的VIP标识高亮的功能
  * 增加了关注和屏蔽首页指定用户帖子链接的功能
  * 调整了自动活期存款的存款金额计算方式
  * 增加了自动领取争夺奖励的功能
  * 修改了自动领取争夺奖励的时间间隔计算方式
* __V3.4.2 (2015-06-04)__ ([详见](http://bbs.2dgal.com/read.php?tid=487899&spid=12167562))
  * 删除了抽取道具卡片相关功能、删除了批量神秘抽奖的功能、暂时禁用了定时模式
  * 修复了改版导致的一些BUG
  * 增加了有效道具和无效道具的统计
* __V3.4.1 (2015-05-24)__ ([详见](http://bbs.2dgal.com/read.php?tid=487899&spid=12130746))
  * 增加了将侧边栏修改为平铺样式的功能
  * 增加了为侧边栏添加快捷导航的功能
  * 增加了自动活期存款的功能
  * 增加了神秘等级升级提醒的功能
  * 增加了自定义各等级神秘颜色的功能
  * 增加了导入/导出各等级神秘颜色配色方案的功能（可在[此贴](http://bbs.2dgal.com/read.php?tid=488016)获取他人分享的配色方案）
  * 改进了自动活期存款的功能
* __V3.3.0 (2015-05-15)__ ([详见](http://bbs.2dgal.com/read.php?tid=482906&spid=12109748))
  * 增加了关注用户的功能
  * 增加了屏蔽用户的功能
  * 增加了购买帖子提醒的功能
  * 增加了在页面上方显示日志链接的功能(日志)
  * 增加了可按日志类别排序的功能(日志)
  * 增加了统计神秘盒子收获情况的功能(日志)
* __V3.2.0 (2015-05-10)__ ([详见](http://bbs.2dgal.com/read.php?tid=482906&spid=12095313))
  * 增加了日志系统
  * 抽取道具或卡片时显示所抽到的道具或卡片的名称
* __V3.1.0 (2015-05-06)__ ([详见](http://bbs.2dgal.com/read.php?tid=482906&spid=12084062))
  * 增加了快速取款的功能
  * 增加了将绯月其它域名的链接修改为当前域名的功能
  * 改进了多重回复和多重引用的功能
  * 支持9baka域名
* __V3.0.0 (2015-04-23)__ ([详见](http://bbs.2dgal.com/read.php?tid=482906&spid=12048559))
  * 增加了将卡片批量转换为VIP时间的功能
  * 增加了多重回复和多重引用的功能
  * 增加了复制购买人名单的功能
  * 增加了统计回帖者名单的功能
* __V2.9.1 (2015-04-19)__ ([详见](http://bbs.2dgal.com/read.php?tid=482906&spid=12037353))
  * 增加了自动使用刚抽到的道具的功能
  * 增加了调整帖子内容宽度的功能
  * 增加了自定义帖子内容字体大小的功能
  * 增加了导入/导出设置的功能
  * 修正了批量使用道具失效的BUG
* __V2.8.1 (2015-04-13)__ ([详见](http://bbs.2dgal.com/read.php?tid=478307&spid=12025529))
  * 增加了批量转账的功能
  * 增加了显示帖子页数快捷链接的功能
  * 修正了抽取盒子时上下限显示的BUG
* __V2.7.0 (2015-04-08)__ ([详见](http://bbs.2dgal.com/read.php?tid=478307&spid=12013150))
  * 增加了批量使用道具的功能
  * 增加了批量恢复道具的功能
  * 增加了统计批量神秘抽奖结果的功能
  * 增加了不抽取会中头奖的神秘盒子的功能（用于卡级，尚未验证是否确实可行）
  * 增加了自定义本人神秘颜色的功能（仅自己可见）
  * 将自动捐款的顺序移到最后
* __V2.6.2 (2015-04-01)__ ([详见](http://bbs.2dgal.com/read.php?tid=478307&spid=11991378))
  * 增加了批量神秘抽奖的功能
  * 增加了可选择指定道具批量转换为能量的功能
  * 增加了高亮今日发表的新帖的功能
  * 增加了抽取卡片时自动转换为VIP时间的功能
  * 增加了在获得VIP资格后才进行捐款的功能
  * 修正了若干BUG
* __V2.5.1 (2015-03-28)__ ([详见](http://bbs.2dgal.com/read.php?tid=478307&spid=11983854))
  * 增加了可将捐款额度设置为收入的百分比以及在指定时间之后捐款的功能
  * 增加了电梯直达的功能
  * 增加了高亮首页VIP标识的功能
  * 将定时模式修改为无刷新的方式
  * 修正电梯直达在chrome下按Enter键无法触发的BUG
  * 为高亮首页VIP标识功能加入了开关
* __V2.4.0 (2015-03-25)__ ([详见](http://bbs.2dgal.com/read.php?tid=478307&spid=11976239))
  * 增加了去除首页已读at高亮提示的功能
  * 增加了显示楼层跳转链接的功能
* __V2.3.0 (2015-03-24)__
  * 增加了设置界面
* __V2.2.0 (2015-03-21)__
  * 增加了无需访问首页即可自动抽奖的功能
  * 增加了转换本级全部已使用的道具为能量的功能
* __V2.1.1 (2015-03-17)__
  * 增加了定时模式的功能（默认关闭，需停留在首页）
  * 修正了定时模式下计算刷新间隔的BUG
* __V2.0.0 (2015-03-16)__
  * 2.0版正式发布
* __V1.0.0 (2015-03-14)__
  * 1.0版正式发布

## 开发计划
* 暂无

## 讨论帖
http://bbs.2dgal.com/read.php?tid=508450

## License
[MIT](http://opensource.org/licenses/MIT)

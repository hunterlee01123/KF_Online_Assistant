// ==UserScript==
// @name        KF Online助手
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KFOL必备！为绯月Galgame论坛增加了大量人性化、自动化的功能，更多功能开发中……
// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/ScriptStorage.meta.js
// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/ScriptStorage.user.js
// @include     http://*2dkf.com/*
// @include     http://*ddgal.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     6.0.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// @use-greasemonkey true
// ==/UserScript==
'use strict';
// 版本号
var version = '6.0.2';
/**
 * 助手设置和日志的存储位置类型
 * Default：存储在浏览器的localStorage中，设置仅通过域名区分，日志通过域名和uid区分；
 * Script：存储在油猴脚本的配置中，设置和日志仅通过uid区分（可用于设置经常会被浏览器清除的情况）;
 * Global：存储在油猴脚本的配置中，各域名和各uid使用全局设置，日志仅通过uid区分（可用于想要使用全局设置的情况）；
 */
var storageType = 'Script';
// 可先在设置界面里修改好相应设置，再将导入/导出设置文本框里的设置填入此处即可覆盖相应的默认设置（可用于设置经常会被浏览器清除或想要使用全局设置的情况）
// 例：var myConfig = {"autoDonationEnabled":true,"donationKfb":100};
var myConfig = {};

/**
 * 配置类
 */
// （注意：请到设置界面里修改相应设置，请勿在代码里修改！）
var Config = {
    // 是否开启定时模式，可按时进行自动操作（包括捐款、自动更换ID颜色，需开启相关功能），只在论坛首页生效，true：开启；false：关闭
    autoRefreshEnabled: false,
    // 在首页的网页标题上显示定时模式提示的方案，auto：停留一分钟后显示；always：总是显示；never：不显示
    showRefreshModeTipsType: 'auto',

    // 是否自动KFB捐款，true：开启；false：关闭
    autoDonationEnabled: false,
    // KFB捐款额度，取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前所持现金的百分比（最多不超过5000KFB），例：80%
    donationKfb: '1',
    // 在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）
    donationAfterTime: '00:05:00',

    // 对首页上的有人@你的消息框进行处理的方案，no_highlight：取消已读提醒高亮；no_highlight_extra：取消已读提醒高亮，并在无提醒时补上消息框；
    // hide_box_1：不显示已读提醒的消息框；hide_box_2：永不显示消息框；default：保持默认；at_change_to_cao：将@改为艹(其他和方式2相同)
    atTipsHandleType: 'no_highlight',
    // 是否在神秘等级升级后进行提醒，只在首页生效，true：开启；false：关闭
    smLevelUpAlertEnabled: false,
    // 是否在定时存款到期时进行提醒，只在首页生效，true：开启；false：关闭
    fixedDepositDueAlertEnabled: false,
    // 是否在神秘系数排名发生变化时进行提醒，只在首页生效，true：开启；false：关闭
    smRankChangeAlertEnabled: false,
    // 在首页帖子链接旁显示快速跳转至页末的链接，true：开启；false：关闭
    homePageThreadFastGotoLinkEnabled: true,
    // 是否在首页显示VIP剩余时间，true：开启；false：关闭
    showVipSurplusTimeEnabled: false,

    // 是否在版块页面中显示帖子页数快捷链接，true：开启；false：关闭
    showFastGotoThreadPageEnabled: false,
    // 在帖子页数快捷链接中显示页数链接的最大数量
    maxFastGotoThreadPageNum: 5,
    // 帖子每页楼层数量，用于电梯直达和帖子页数快捷链接功能，如果修改了KF设置里的“文章列表每页个数”，请在此修改成相同的数目
    perPageFloorNum: 10,
    // 是否在版块页面中高亮今日新发表帖子的发表时间，true：开启；false：关闭
    highlightNewPostEnabled: true,

    // 是否调整帖子内容宽度，使其保持一致，true：开启；false：关闭
    adjustThreadContentWidthEnabled: false,
    // 帖子内容字体大小，留空表示使用默认大小，推荐值：14
    threadContentFontSize: 0,
    // 自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009CFF，如无需求可留空
    customMySmColor: '',
    // 是否开启自定义各等级神秘颜色的功能，（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），true：开启；false：关闭
    customSmColorEnabled: false,
    // 自定义各等级神秘颜色的设置列表，例：[{min:'50',max:'100',color:'#009CFF'},{min:'800',max:'MAX',color:'#FF0000'}]
    customSmColorConfigList: [],
    // 是否将帖子中的绯月其它域名的链接修改为当前域名，true：开启；false：关闭
    modifyKFOtherDomainEnabled: true,
    // 是否在帖子页面开启多重回复和多重引用的功能，true：开启；false：关闭
    multiQuoteEnabled: true,
    // 是否在帖子页面开启批量购买帖子的功能，true：开启；false：关闭
    batchBuyThreadEnabled: true,
    // 是否开启显示用户的自定义备注的功能，true：开启；false：关闭
    userMemoEnabled: false,
    // 用户自定义备注列表，格式：{'用户名':'备注'}，例：{'李四':'张三的马甲','王五':'张三的另一个马甲'}
    userMemoList: {},
    // 是否在帖子页面解析多媒体标签，true：开启；false：关闭
    parseMediaTagEnabled: true,
    // 是否在帖子和搜索页面通过左右键进行翻页，true：开启；false：关闭
    turnPageViaKeyboardEnabled: false,
    // 是否在符合条件的帖子页面显示自助评分的链接（仅限自助评分测试人员使用），true：开启；false：关闭
    showSelfRatingLinkEnabled: false,
    // 是否使用Ajax的方式购买帖子（购买时页面不会跳转），true：开启；false：关闭
    buyThreadViaAjaxEnabled: true,

    // 默认提示消息的持续时间（秒），设置为-1表示永久显示
    defShowMsgDuration: -1,
    // 是否禁用jQuery的动画效果（推荐在配置较差的机器上使用），true：开启；false：关闭
    animationEffectOffEnabled: false,
    // 日志保存天数
    logSaveDays: 30,
    // 在页面上方显示助手日志的链接，true：开启；false：关闭
    showLogLinkEnabled: true,
    // 在页面上方显示搜索对话框的链接，true：开启；false：关闭
    showSearchLinkEnabled: true,
    // 日志内容的排序方式，time：按时间顺序排序；type：按日志类别排序
    logSortType: 'time',
    // 日志统计范围类型，cur：显示当天统计结果；custom：显示距该日N天内的统计结果；all：显示全部统计结果
    logStatType: 'cur',
    // 显示距该日N天内的统计结果（用于日志统计范围）
    logStatDays: 7,
    // 是否为侧边栏添加快捷导航的链接，true：开启；false：关闭
    addSideBarFastNavEnabled: true,
    // 是否将侧边栏修改为和手机相同的平铺样式，true：开启；false：关闭
    modifySideBarEnabled: false,
    // 是否为页面添加自定义的CSS内容，true：开启；false：关闭
    customCssEnabled: false,
    // 自定义CSS的内容
    customCssContent: '',
    // 是否执行自定义的脚本，true：开启；false：关闭
    customScriptEnabled: false,
    // 在脚本开始时执行的自定义脚本内容
    customScriptStartContent: '',
    // 在脚本结束时执行的自定义脚本内容
    customScriptEndContent: '',
    // 浏览器类型，auto：自动检测；desktop：桌面版；mobile：移动版
    browseType: 'auto',

    // 是否开启关注用户的功能，true：开启；false：关闭
    followUserEnabled: false,
    // 关注用户列表，格式：[{name:'用户名'}]，例：[{name:'张三'}, {name:'李四'}]
    followUserList: [],
    // 是否高亮所关注用户在首页下的帖子链接，true：开启；false：关闭
    highlightFollowUserThreadInHPEnabled: true,
    // 是否高亮所关注用户在帖子列表页面下的帖子链接，true：开启；false：关闭
    highlightFollowUserThreadLinkEnabled: true,
    // 是否开启屏蔽用户的功能，true：开启；false：关闭
    blockUserEnabled: false,
    // 屏蔽用户的默认屏蔽类型，0：屏蔽主题和回贴；1：仅屏蔽主题；2：仅屏蔽回贴
    blockUserDefaultType: 0,
    // 是否屏蔽被屏蔽用户的@提醒，true：开启；false：关闭
    blockUserAtTipsEnabled: true,
    // 屏蔽用户的版块屏蔽范围，0：所有版块；1：包括指定的版块；2：排除指定的版块
    blockUserForumType: 0,
    // 屏蔽用户的版块ID列表，例：[16, 41, 67, 57, 84, 92, 127, 68, 163, 182, 9]
    blockUserFidList: [],
    // 屏蔽用户列表，格式：[{name:'用户名', type:屏蔽类型}]，例：[{name:'张三', type:0}, {name:'李四', type:1}]
    blockUserList: [],
    // 是否开启屏蔽标题包含指定关键字的帖子的功能，true：开启；false：关闭
    blockThreadEnabled: false,
    // 屏蔽帖子的默认版块屏蔽范围，0：所有版块；1：包括指定的版块；2：排除指定的版块
    blockThreadDefForumType: 0,
    // 屏蔽帖子的默认版块ID列表，例：[16, 41, 67, 57, 84, 92, 127, 68, 163, 182, 9]
    blockThreadDefFidList: [],
    // 屏蔽帖子的关键字列表，格式：[{keyWord:'关键字', includeUser:['包括的用户名'], excludeUser:['排除的用户名'], includeFid:[包括指定的版块ID], excludeFid:[排除指定的版块ID]}]
    // 关键字可使用普通字符串或正则表达式（正则表达式请使用'/abc/'的格式），includeUser、excludeUser、includeFid和excludeFid这三项为可选
    // 例：[{keyWord: '标题1'}, {keyWord: '标题2', includeUser:['用户名1', '用户名2'], includeFid: [5, 56]}, {keyWord: '/关键字A.*关键字B/i', excludeFid: [92, 127, 68]}]
    blockThreadList: [],

    // 是否在当前收入满足指定额度之后自动将指定数额存入活期存款中，只会在首页触发，true：开启；false：关闭
    autoSaveCurrentDepositEnabled: false,
    // 在当前收入已满指定KFB额度之后自动进行活期存款，例：1000
    saveCurrentDepositAfterKfb: 0,
    // 将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800
    saveCurrentDepositKfb: 0,

    // 是否自动更换ID颜色，true：开启；false：关闭
    autoChangeSMColorEnabled: false,
    // 自动更换ID颜色的更换顺序类型，random：随机；sequence：顺序
    autoChangeSMColorType: 'random',
    // 自动更换ID颜色的时间间隔（小时）
    autoChangeSMColorInterval: 24,
    // 是否从当前所有可用的ID颜色中进行更换，true：开启；false：关闭
    changeAllAvailableSMColorEnabled: true,
    // 自定义自动更换ID颜色的ID列表，例：[1,8,13,20]
    customAutoChangeSMColorList: []
};

/**
 * 配置常量类
 */
// （注意：以下代码如非必要请勿修改）
var Const = {
    // 开启调试模式，true：开启；false：关闭
    debug: false,
    // UTC时间与论坛时间之间的时差（小时）
    forumTimezoneOffset: -8,
    // KFB捐款额度的最大值
    maxDonationKfb: 5000,
    // 定时操作结束后的再判断间隔（秒），用于在定时模式中进行下一次定时时间的再判断
    actionFinishRetryInterval: 30,
    // 在连接超时的情况下获取剩余时间失败后的重试间隔（分钟），用于定时模式
    errorRefreshInterval: 1,
    // 在网页标题上显示定时模式提示的更新间隔（分钟）
    showRefreshModeTipsInterval: 1,
    // 标记已去除首页已读at高亮提示的Cookie有效期（天）
    hideMarkReadAtTipsExpires: 3,
    // 神秘等级升级的提醒间隔（小时），设为0表示当升级时随时进行提醒
    smLevelUpAlertInterval: 3,
    // 神秘系数排名变化的提醒间隔（小时），设为0表示当排名变化时随时进行提醒
    smRankChangeAlertInterval: 22,
    // 存储VIP剩余时间的Cookie有效期（分钟）
    vipSurplusTimeExpires: 60,
    // ajax请求的默认超时时间（毫秒）
    defAjaxTimeout: 30000,
    // ajax请求的默认时间间隔（毫秒）
    defAjaxInterval: 200,
    // 特殊情况下的ajax请求（如使用、恢复、购买道具等）的时间间隔（毫秒），可设置为函数来返回值
    specialAjaxInterval: function () {
        return Math.floor(Math.random() * 150) + 200;
    },
    // 循环使用道具中每轮第一次ajax请求的时间间隔（毫秒），可设置为函数来返回值
    cycleUseItemsFirstAjaxInterval: function () {
        return Math.floor(Math.random() * 250) + 2000;
    },
    // 购买帖子提醒的最低售价（KFB）
    minBuyThreadWarningSell: 6,
    // 统计回帖者名单最大能访问的帖子页数
    statReplyersMaxPage: 300,
    // 道具样品ID列表
    sampleItemIdList: {
        '零时迷子的碎片': 2257935,
        '被遗弃的告白信': 2005272,
        '学校天台的钥匙': 2001303,
        'TMA最新作压缩包': 1990834,
        'LOLI的钱包': 1836588,
        '棒棒糖': 1942370,
        '蕾米莉亚同人漫画': 1000888,
        '十六夜同人漫画': 1002668,
        '档案室钥匙': 1013984,
        '傲娇LOLI娇蛮音CD': 4621,
        '整形优惠卷': 1003993,
        '消逝之药': 1000306
    },
    // 定期存款到期期限（天）
    fixedDepositDueTime: 90,
    // 自助评分错标范围百分比
    ratingErrorSizePercent: 3,
    // 自定义侧边栏导航内容
    // 格式：'<li><a href="导航链接">导航项名称</a></li>'
    customSideBarContent: '',
    // 自定义侧边栏导航内容（手机平铺样式）
    // 格式：'<a href="导航链接1">导航项名称1</a> | <a href="导航链接2">导航项名称2</a><br />'，换行：'<br />'
    customTileSideBarContent: '',
    // 可进行自助评分的版块ID列表
    selfRatingFidList: [41, 67, 92, 127, 68],
    // 存储多重引用数据的LocalStorage名称
    multiQuoteStorageName: 'pd_multi_quote',
    // 神秘升级提醒的临时日志名称
    smLevelUpTmpLogName: 'SmLevelUp',
    // 神秘系数排名变化提醒的临时日志名称
    smRankChangeTmpLogName: 'SmRankChange',
    // 定期存款到期时间的临时日志名称
    fixedDepositDueTmpLogName: 'FixedDepositDue',
    // 上一次自动更换神秘颜色的ID的临时日志名称
    prevAutoChangeSMColorIdTmpLogName: 'PrevAutoChangeSMColorId',
    // 标记已KFB捐款的Cookie名称
    donationCookieName: 'pd_donation',
    // 标记已去除首页已读at高亮提示的Cookie名称
    hideMarkReadAtTipsCookieName: 'pd_hide_mark_read_at_tips',
    // 存储之前已读的at提醒信息的Cookie名称
    prevReadAtTipsCookieName: 'pd_prev_read_at_tips',
    // 标记已进行定期存款到期提醒的Cookie名称
    fixedDepositDueAlertCookieName: 'pd_fixed_deposit_due_alert',
    // 存储VIP剩余时间的Cookie名称
    vipSurplusTimeCookieName: 'pd_vip_surplus_time',
    // 标记已自动更换神秘颜色的Cookie名称
    autoChangeSMColorCookieName: 'pd_auto_change_sm_color',
    // 标记已检查过期日志的Cookie名称
    checkOverdueLogCookieName: 'pd_check_overdue_log'
};

/**
 * 配置方法类
 */
var ConfigMethod = {
    // 保存设置的键值名称
    name: 'pd_config',
    // 默认的Config对象
    defConfig: {},

    /**
     * 初始化
     */
    init: function () {
        if (storageType === 'Script' || storageType === 'Global') {
            var storageName = storageType === 'Script' ? 'ByUid' : 'Global';
            if (GM_getValue('StorageType') !== storageName) GM_setValue('StorageType', storageName);
        }
        $.extend(true, ConfigMethod.defConfig, Config);
        if (myConfig && $.type(myConfig) === 'object' && !$.isEmptyObject(myConfig)) {
            var options = ConfigMethod.normalize(myConfig);
            Config = $.extend(true, {}, ConfigMethod.defConfig, options);
        }
        ConfigMethod.read();
    },

    /**
     * 读取设置
     */
    read: function () {
        var options = null;
        if (storageType === 'Script') options = GM_getValue(ConfigMethod.name + '_' + KFOL.uid);
        else if (storageType === 'Global') options = GM_getValue(ConfigMethod.name);
        else options = localStorage.getItem(ConfigMethod.name);
        if (!options) return;
        try {
            options = JSON.parse(options);
        }
        catch (ex) {
            return;
        }
        if (!options || $.type(options) !== 'object' || $.isEmptyObject(options)) return;
        options = ConfigMethod.normalize(options);
        Config = $.extend(true, {}, ConfigMethod.defConfig, options);
    },

    /**
     * 写入设置
     */
    write: function () {
        var options = Tools.getDifferentValueOfObject(ConfigMethod.defConfig, Config);
        if (storageType === 'Script') GM_setValue(ConfigMethod.name + '_' + KFOL.uid, JSON.stringify(options));
        else if (storageType === 'Global') GM_setValue(ConfigMethod.name, JSON.stringify(options));
        else localStorage.setItem(ConfigMethod.name, JSON.stringify(options));
    },

    /**
     * 清空设置
     */
    clear: function () {
        if (storageType === 'Script') GM_deleteValue(ConfigMethod.name + '_' + KFOL.uid);
        else if (storageType === 'Global') GM_deleteValue(ConfigMethod.name);
        else localStorage.removeItem(ConfigMethod.name);
    },

    /**
     * 获取经过规范化的Config对象
     * @param {Config} options 待处理的Config对象
     * @returns {Config} 经过规范化的Config对象
     */
    normalize: function (options) {
        var settings = {};
        var defConfig = ConfigMethod.defConfig;
        if ($.type(options) !== 'object') return settings;

        if (typeof options.autoRefreshEnabled !== 'undefined') {
            settings.autoRefreshEnabled = typeof options.autoRefreshEnabled === 'boolean' ?
                options.autoRefreshEnabled : defConfig.autoRefreshEnabled;
        }
        if (typeof options.showRefreshModeTipsType !== 'undefined') {
            var showRefreshModeTipsType = $.trim(options.showRefreshModeTipsType).toLowerCase();
            var allowTypes = ['auto', 'always', 'never'];
            if (showRefreshModeTipsType !== '' && $.inArray(showRefreshModeTipsType, allowTypes) > -1)
                settings.showRefreshModeTipsType = showRefreshModeTipsType;
            else settings.showRefreshModeTipsType = defConfig.showRefreshModeTipsType;
        }

        if (typeof options.autoDonationEnabled !== 'undefined') {
            settings.autoDonationEnabled = typeof options.autoDonationEnabled === 'boolean' ?
                options.autoDonationEnabled : defConfig.autoDonationEnabled;
        }
        if (typeof options.donationKfb !== 'undefined') {
            var donationKfb = options.donationKfb;
            if ($.isNumeric(donationKfb) && donationKfb > 0 && donationKfb <= Const.maxDonationKfb)
                settings.donationKfb = parseInt(donationKfb);
            else if (/^1?\d?\d%$/.test(donationKfb) && parseInt(donationKfb) > 0 && parseInt(donationKfb) <= 100)
                settings.donationKfb = parseInt(donationKfb) + '%';
            else settings.donationKfb = defConfig.donationKfb;
        }
        if (typeof options.donationAfterTime !== 'undefined') {
            var donationAfterTime = options.donationAfterTime;
            if (/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(donationAfterTime))
                settings.donationAfterTime = donationAfterTime;
            else settings.donationAfterTime = defConfig.donationAfterTime;
        }

        if (typeof options.atTipsHandleType !== 'undefined') {
            var atTipsHandleType = $.trim(options.atTipsHandleType).toLowerCase();
            var allowTypes = ['no_highlight', 'no_highlight_extra', 'hide_box_1', 'hide_box_2', 'default', 'at_change_to_cao'];
            if (atTipsHandleType !== '' && $.inArray(atTipsHandleType, allowTypes) > -1)
                settings.atTipsHandleType = atTipsHandleType;
            else settings.atTipsHandleType = defConfig.atTipsHandleType;
        }
        if (typeof options.smLevelUpAlertEnabled !== 'undefined') {
            settings.smLevelUpAlertEnabled = typeof options.smLevelUpAlertEnabled === 'boolean' ?
                options.smLevelUpAlertEnabled : defConfig.smLevelUpAlertEnabled;
        }
        if (typeof options.fixedDepositDueAlertEnabled !== 'undefined') {
            settings.fixedDepositDueAlertEnabled = typeof options.fixedDepositDueAlertEnabled === 'boolean' ?
                options.fixedDepositDueAlertEnabled : defConfig.fixedDepositDueAlertEnabled;
        }
        if (typeof options.smRankChangeAlertEnabled !== 'undefined') {
            settings.smRankChangeAlertEnabled = typeof options.smRankChangeAlertEnabled === 'boolean' ?
                options.smRankChangeAlertEnabled : defConfig.smRankChangeAlertEnabled;
        }
        if (typeof options.homePageThreadFastGotoLinkEnabled !== 'undefined') {
            settings.homePageThreadFastGotoLinkEnabled = typeof options.homePageThreadFastGotoLinkEnabled === 'boolean' ?
                options.homePageThreadFastGotoLinkEnabled : defConfig.homePageThreadFastGotoLinkEnabled;
        }
        if (typeof options.showVipSurplusTimeEnabled !== 'undefined') {
            settings.showVipSurplusTimeEnabled = typeof options.showVipSurplusTimeEnabled === 'boolean' ?
                options.showVipSurplusTimeEnabled : defConfig.showVipSurplusTimeEnabled;
        }

        if (typeof options.showFastGotoThreadPageEnabled !== 'undefined') {
            settings.showFastGotoThreadPageEnabled = typeof options.showFastGotoThreadPageEnabled === 'boolean' ?
                options.showFastGotoThreadPageEnabled : defConfig.showFastGotoThreadPageEnabled;
        }
        if (typeof options.maxFastGotoThreadPageNum !== 'undefined') {
            var maxFastGotoThreadPageNum = parseInt(options.maxFastGotoThreadPageNum);
            if (!isNaN(maxFastGotoThreadPageNum) && maxFastGotoThreadPageNum > 0)
                settings.maxFastGotoThreadPageNum = maxFastGotoThreadPageNum;
            else settings.maxFastGotoThreadPageNum = defConfig.maxFastGotoThreadPageNum;
        }
        if (typeof options.highlightNewPostEnabled !== 'undefined') {
            settings.highlightNewPostEnabled = typeof options.highlightNewPostEnabled === 'boolean' ?
                options.highlightNewPostEnabled : defConfig.highlightNewPostEnabled;
        }

        if (typeof options.perPageFloorNum !== 'undefined') {
            var perPageFloorNum = parseInt(options.perPageFloorNum);
            if ($.inArray(perPageFloorNum, [10, 20, 30]) > -1)
                settings.perPageFloorNum = perPageFloorNum;
            else settings.perPageFloorNum = defConfig.perPageFloorNum;
        }
        if (typeof options.threadContentFontSize !== 'undefined') {
            var threadContentFontSize = parseInt(options.threadContentFontSize);
            if (threadContentFontSize > 0) settings.threadContentFontSize = threadContentFontSize;
            else settings.threadContentFontSize = defConfig.threadContentFontSize;
        }
        if (typeof options.adjustThreadContentWidthEnabled !== 'undefined') {
            settings.adjustThreadContentWidthEnabled = typeof options.adjustThreadContentWidthEnabled === 'boolean' ?
                options.adjustThreadContentWidthEnabled : defConfig.adjustThreadContentWidthEnabled;
        }
        if (typeof options.turnPageViaKeyboardEnabled !== 'undefined') {
            settings.turnPageViaKeyboardEnabled = typeof options.turnPageViaKeyboardEnabled === 'boolean' ?
                options.turnPageViaKeyboardEnabled : defConfig.turnPageViaKeyboardEnabled;
        }
        if (typeof options.customMySmColor !== 'undefined') {
            var customMySmColor = options.customMySmColor;
            if (/^#[0-9a-fA-F]{6}$/.test(customMySmColor))
                settings.customMySmColor = customMySmColor;
            else settings.customMySmColor = defConfig.customMySmColor;
        }
        if (typeof options.customSmColorEnabled !== 'undefined') {
            settings.customSmColorEnabled = typeof options.customSmColorEnabled === 'boolean' ?
                options.customSmColorEnabled : defConfig.customSmColorEnabled;
        }
        if (typeof options.customSmColorConfigList !== 'undefined') {
            var customSmColorConfigList = options.customSmColorConfigList;
            if ($.isArray(customSmColorConfigList)) {
                settings.customSmColorConfigList = [];
                $.each(customSmColorConfigList, function (index, data) {
                    if ($.type(data) === 'object' && $.type(data.min) === 'string' && $.type(data.max) === 'string' && $.type(data.color) === 'string' &&
                        /^(-?\d+|MAX)$/i.test(data.min) && /^(-?\d+|MAX)$/i.test(data.max) && /^#[0-9a-fA-F]{6}$/.test(data.color) &&
                        Tools.compareSmLevel(data.min, data.max) <= 0) {
                        settings.customSmColorConfigList.push(data);
                    }
                });
            }
            else settings.customSmColorConfigList = defConfig.customSmColorConfigList;
        }
        if (typeof options.modifyKFOtherDomainEnabled !== 'undefined') {
            settings.modifyKFOtherDomainEnabled = typeof options.modifyKFOtherDomainEnabled === 'boolean' ?
                options.modifyKFOtherDomainEnabled : defConfig.modifyKFOtherDomainEnabled;
        }
        if (typeof options.multiQuoteEnabled !== 'undefined') {
            settings.multiQuoteEnabled = typeof options.multiQuoteEnabled === 'boolean' ?
                options.multiQuoteEnabled : defConfig.multiQuoteEnabled;
        }
        if (typeof options.batchBuyThreadEnabled !== 'undefined') {
            settings.batchBuyThreadEnabled = typeof options.batchBuyThreadEnabled === 'boolean' ?
                options.batchBuyThreadEnabled : defConfig.batchBuyThreadEnabled;
        }
        if (typeof options.userMemoEnabled !== 'undefined') {
            settings.userMemoEnabled = typeof options.userMemoEnabled === 'boolean' ?
                options.userMemoEnabled : defConfig.userMemoEnabled;
        }
        if (typeof options.userMemoList !== 'undefined') {
            if ($.type(options.userMemoList) === 'object') {
                settings.userMemoList = {};
                for (var user in options.userMemoList) {
                    var memo = $.trim(options.userMemoList[user]);
                    if (memo) settings.userMemoList[user] = memo;
                }
            }
            else settings.userMemoList = defConfig.userMemoList;
        }
        if (typeof options.parseMediaTagEnabled !== 'undefined') {
            settings.parseMediaTagEnabled = typeof options.parseMediaTagEnabled === 'boolean' ?
                options.parseMediaTagEnabled : defConfig.parseMediaTagEnabled;
        }
        if (typeof options.showSelfRatingLinkEnabled !== 'undefined') {
            settings.showSelfRatingLinkEnabled = typeof options.showSelfRatingLinkEnabled === 'boolean' ?
                options.showSelfRatingLinkEnabled : defConfig.showSelfRatingLinkEnabled;
        }
        if (typeof options.buyThreadViaAjaxEnabled !== 'undefined') {
            settings.buyThreadViaAjaxEnabled = typeof options.buyThreadViaAjaxEnabled === 'boolean' ?
                options.buyThreadViaAjaxEnabled : defConfig.buyThreadViaAjaxEnabled;
        }

        if (typeof options.defShowMsgDuration !== 'undefined') {
            var defShowMsgDuration = parseInt(options.defShowMsgDuration);
            if (!isNaN(defShowMsgDuration) && defShowMsgDuration >= -1)
                settings.defShowMsgDuration = defShowMsgDuration;
            else settings.defShowMsgDuration = defConfig.defShowMsgDuration;
        }
        if (typeof options.animationEffectOffEnabled !== 'undefined') {
            settings.animationEffectOffEnabled = typeof options.animationEffectOffEnabled === 'boolean' ?
                options.animationEffectOffEnabled : defConfig.animationEffectOffEnabled;
        }
        if (typeof options.logSaveDays !== 'undefined') {
            var logSaveDays = parseInt(options.logSaveDays);
            if (logSaveDays > 0) settings.logSaveDays = logSaveDays;
            else settings.logSaveDays = defConfig.logSaveDays;
        }
        if (typeof options.browseType !== 'undefined') {
            if ($.inArray(options.browseType.toLowerCase(), ['auto', 'desktop', 'mobile']) > -1)
                settings.browseType = options.browseType.toLowerCase();
            else settings.browseType = defConfig.options.browseType;
        }
        if (typeof options.showLogLinkEnabled !== 'undefined') {
            settings.showLogLinkEnabled = typeof options.showLogLinkEnabled === 'boolean' ?
                options.showLogLinkEnabled : defConfig.showLogLinkEnabled;
        }
        if (typeof options.showSearchLinkEnabled !== 'undefined') {
            settings.showSearchLinkEnabled = typeof options.showSearchLinkEnabled === 'boolean' ?
                options.showSearchLinkEnabled : defConfig.showSearchLinkEnabled;
        }
        if (typeof options.logSortType !== 'undefined') {
            var logSortType = $.trim(options.logSortType).toLowerCase();
            var allowTypes = ['time', 'type'];
            if (logSortType !== '' && $.inArray(logSortType, allowTypes) > -1)
                settings.logSortType = logSortType;
            else settings.logSortType = defConfig.logSortType;
        }
        if (typeof options.logStatType !== 'undefined') {
            var logStatType = $.trim(options.logStatType).toLowerCase();
            var allowTypes = ['cur', 'custom', 'all'];
            if (logStatType !== '' && $.inArray(logStatType, allowTypes) > -1)
                settings.logStatType = logStatType;
            else settings.logStatType = defConfig.logStatType;
        }
        if (typeof options.logStatDays !== 'undefined') {
            var logStatDays = parseInt(options.logStatDays);
            if (logStatDays > 0) settings.logStatDays = logStatDays;
            else settings.logStatDays = defConfig.logStatDays;
        }
        if (typeof options.addSideBarFastNavEnabled !== 'undefined') {
            settings.addSideBarFastNavEnabled = typeof options.addSideBarFastNavEnabled === 'boolean' ?
                options.addSideBarFastNavEnabled : defConfig.addSideBarFastNavEnabled;
        }
        if (typeof options.modifySideBarEnabled !== 'undefined') {
            settings.modifySideBarEnabled = typeof options.modifySideBarEnabled === 'boolean' ?
                options.modifySideBarEnabled : defConfig.modifySideBarEnabled;
        }
        if (typeof options.customCssEnabled !== 'undefined') {
            settings.customCssEnabled = typeof options.customCssEnabled === 'boolean' ?
                options.customCssEnabled : defConfig.customCssEnabled;
        }
        if (typeof options.customCssContent !== 'undefined') {
            var customCssContent = $.trim(options.customCssContent);
            if (customCssContent !== '') settings.customCssContent = customCssContent;
            else settings.customCssContent = defConfig.customCssContent;
        }
        if (typeof options.customScriptEnabled !== 'undefined') {
            settings.customScriptEnabled = typeof options.customScriptEnabled === 'boolean' ?
                options.customScriptEnabled : defConfig.customScriptEnabled;
        }
        if (typeof options.customScriptStartContent !== 'undefined') {
            if (typeof options.customScriptStartContent === 'string')
                settings.customScriptStartContent = options.customScriptStartContent;
            else
                settings.customScriptStartContent = defConfig.customScriptStartContent;
        }
        if (typeof options.customScriptEndContent !== 'undefined') {
            if (typeof options.customScriptEndContent === 'string')
                settings.customScriptEndContent = options.customScriptEndContent;
            else
                settings.customScriptEndContent = defConfig.customScriptEndContent;
        }

        if (typeof options.followUserEnabled !== 'undefined') {
            settings.followUserEnabled = typeof options.followUserEnabled === 'boolean' ?
                options.followUserEnabled : defConfig.followUserEnabled;
        }
        if (typeof options.highlightFollowUserThreadInHPEnabled !== 'undefined') {
            settings.highlightFollowUserThreadInHPEnabled = typeof options.highlightFollowUserThreadInHPEnabled === 'boolean' ?
                options.highlightFollowUserThreadInHPEnabled : defConfig.highlightFollowUserThreadInHPEnabled;
        }
        if (typeof options.highlightFollowUserThreadLinkEnabled !== 'undefined') {
            settings.highlightFollowUserThreadLinkEnabled = typeof options.highlightFollowUserThreadLinkEnabled === 'boolean' ?
                options.highlightFollowUserThreadLinkEnabled : defConfig.highlightFollowUserThreadLinkEnabled;
        }
        if (typeof options.followUserList !== 'undefined') {
            if ($.isArray(options.followUserList)) {
                settings.followUserList = [];
                for (var i in options.followUserList) {
                    var user = options.followUserList[i];
                    if ($.type(user) === 'object' && $.type(user.name) === 'string') {
                        var name = $.trim(user.name);
                        if (name) settings.followUserList.push({name: name});
                    }
                    else if ($.type(user) === 'string') {
                        var name = $.trim(user);
                        if (name) settings.followUserList.push({name: name});
                    }
                }
            }
            else settings.followUserList = defConfig.followUserList;
        }

        if (typeof options.blockUserEnabled !== 'undefined') {
            settings.blockUserEnabled = typeof options.blockUserEnabled === 'boolean' ?
                options.blockUserEnabled : defConfig.blockUserEnabled;
        }
        if (typeof options.blockUserDefaultType !== 'undefined') {
            var blockUserDefaultType = parseInt(options.blockUserDefaultType);
            if (!isNaN(blockUserDefaultType) && blockUserDefaultType >= 0 && blockUserDefaultType <= 2) settings.blockUserDefaultType = blockUserDefaultType;
            else settings.blockUserDefaultType = defConfig.blockUserDefaultType;
        }
        if (typeof options.blockUserAtTipsEnabled !== 'undefined') {
            settings.blockUserAtTipsEnabled = typeof options.blockUserAtTipsEnabled === 'boolean' ?
                options.blockUserAtTipsEnabled : defConfig.blockUserAtTipsEnabled;
        }
        if (typeof options.blockUserForumType !== 'undefined') {
            var blockUserForumType = parseInt(options.blockUserForumType);
            if (!isNaN(blockUserForumType) && blockUserForumType >= 0 && blockUserForumType <= 2) settings.blockUserForumType = blockUserForumType;
            else settings.blockUserForumType = defConfig.blockUserForumType;
        }
        if (typeof options.blockUserFidList !== 'undefined') {
            if ($.isArray(options.blockUserFidList)) {
                settings.blockUserFidList = [];
                for (var i in options.blockUserFidList) {
                    var fid = parseInt(options.blockUserFidList[i]);
                    if (!isNaN(fid) && fid > 0) settings.blockUserFidList.push(fid);
                }
            }
            else settings.blockUserFidList = defConfig.blockUserFidList;
        }
        if (typeof options.blockUserList !== 'undefined') {
            if ($.isArray(options.blockUserList)) {
                settings.blockUserList = [];
                for (var i in options.blockUserList) {
                    var user = options.blockUserList[i];
                    if ($.type(user) === 'object' && $.type(user.name) === 'string' && $.type(user.type) === 'number') {
                        var type = user.type;
                        if (type < 0 || type > 2) type = Config.blockUserDefaultType;
                        var name = $.trim(user.name);
                        if (name) settings.blockUserList.push({name: name, type: type});
                    }
                    else if ($.type(user) === 'string') {
                        var name = $.trim(user);
                        if (name) settings.blockUserList.push({name: name, type: Config.blockUserDefaultType});
                    }
                }
            }
            else settings.blockUserList = defConfig.blockUserList;
        }
        if (typeof options.blockThreadEnabled !== 'undefined') {
            settings.blockThreadEnabled = typeof options.blockThreadEnabled === 'boolean' ?
                options.blockThreadEnabled : defConfig.blockThreadEnabled;
        }
        if (typeof options.blockThreadDefForumType !== 'undefined') {
            var blockThreadDefForumType = parseInt(options.blockThreadDefForumType);
            if (!isNaN(blockThreadDefForumType) && blockThreadDefForumType >= 0 && blockThreadDefForumType <= 2) settings.blockThreadDefForumType = blockThreadDefForumType;
            else settings.blockThreadDefForumType = defConfig.blockThreadDefForumType;
        }
        if (typeof options.blockThreadDefFidList !== 'undefined') {
            if ($.isArray(options.blockThreadDefFidList)) {
                settings.blockThreadDefFidList = [];
                for (var i in options.blockThreadDefFidList) {
                    var fid = parseInt(options.blockThreadDefFidList[i]);
                    if (!isNaN(fid) && fid > 0) settings.blockThreadDefFidList.push(fid);
                }
            }
            else settings.blockThreadDefFidList = defConfig.blockThreadDefFidList;
        }
        if (typeof options.blockThreadList !== 'undefined') {
            if ($.isArray(options.blockThreadList)) {
                settings.blockThreadList = [];
                for (var i in options.blockThreadList) {
                    var obj = options.blockThreadList[i];
                    if ($.type(obj) === 'object' && $.type(obj.keyWord) === 'string' && $.trim(obj.keyWord) !== '') {
                        var newObj = {keyWord: obj.keyWord};
                        if ($.isArray(obj.includeUser) && obj.includeUser.length > 0) newObj.includeUser = obj.includeUser;
                        else if ($.isArray(obj.excludeUser) && obj.excludeUser.length > 0) newObj.excludeUser = obj.excludeUser;
                        else if ($.isArray(obj.userName) && obj.userName.length > 0) newObj.includeUser = obj.userName;
                        if ($.isArray(obj.includeFid) && obj.includeFid.length > 0) newObj.includeFid = obj.includeFid;
                        else if ($.isArray(obj.excludeFid) && obj.excludeFid.length > 0) newObj.excludeFid = obj.excludeFid;
                        settings.blockThreadList.push(newObj);
                    }
                }
            }
            else settings.blockThreadList = defConfig.blockThreadList;
        }

        if (typeof options.autoSaveCurrentDepositEnabled !== 'undefined') {
            settings.autoSaveCurrentDepositEnabled = typeof options.autoSaveCurrentDepositEnabled === 'boolean' ?
                options.autoSaveCurrentDepositEnabled : defConfig.autoSaveCurrentDepositEnabled;
        }
        if (typeof options.saveCurrentDepositAfterKfb !== 'undefined') {
            var saveCurrentDepositAfterKfb = parseInt(options.saveCurrentDepositAfterKfb);
            if (saveCurrentDepositAfterKfb > 0) settings.saveCurrentDepositAfterKfb = saveCurrentDepositAfterKfb;
            else settings.saveCurrentDepositAfterKfb = defConfig.saveCurrentDepositAfterKfb;
        }
        if (typeof options.saveCurrentDepositKfb !== 'undefined') {
            var saveCurrentDepositKfb = parseInt(options.saveCurrentDepositKfb);
            if (saveCurrentDepositKfb > 0 && saveCurrentDepositKfb <= settings.saveCurrentDepositAfterKfb)
                settings.saveCurrentDepositKfb = saveCurrentDepositKfb;
            else settings.saveCurrentDepositKfb = defConfig.saveCurrentDepositKfb;
        }

        if (typeof options.autoChangeSMColorEnabled !== 'undefined') {
            settings.autoChangeSMColorEnabled = typeof options.autoChangeSMColorEnabled === 'boolean' ?
                options.autoChangeSMColorEnabled : defConfig.autoChangeSMColorEnabled;
        }
        if (typeof options.autoChangeSMColorType !== 'undefined') {
            var autoChangeSMColorType = $.trim(options.autoChangeSMColorType).toLowerCase();
            var allowTypes = ['random', 'sequence'];
            if (autoChangeSMColorType !== '' && $.inArray(autoChangeSMColorType, allowTypes) > -1)
                settings.autoChangeSMColorType = autoChangeSMColorType;
            else settings.autoChangeSMColorType = defConfig.autoChangeSMColorType;
        }
        if (typeof options.autoChangeSMColorInterval !== 'undefined') {
            var autoChangeSMColorInterval = parseInt(options.autoChangeSMColorInterval);
            if (!isNaN(autoChangeSMColorInterval) && autoChangeSMColorInterval > 0) settings.autoChangeSMColorInterval = autoChangeSMColorInterval;
            else settings.autoChangeSMColorInterval = defConfig.autoChangeSMColorInterval;
        }
        if (typeof options.changeAllAvailableSMColorEnabled !== 'undefined') {
            settings.changeAllAvailableSMColorEnabled = typeof options.changeAllAvailableSMColorEnabled === 'boolean' ?
                options.changeAllAvailableSMColorEnabled : defConfig.changeAllAvailableSMColorEnabled;
        }
        if (typeof options.customAutoChangeSMColorList !== 'undefined') {
            if ($.isArray(options.customAutoChangeSMColorList)) {
                settings.customAutoChangeSMColorList = [];
                for (var i in options.customAutoChangeSMColorList) {
                    var id = parseInt(options.customAutoChangeSMColorList[i]);
                    if (!isNaN(id) && id >= 1 && id <= 20) {
                        settings.customAutoChangeSMColorList.push(id);
                    }
                }
            }
            else settings.customAutoChangeSMColorList = defConfig.customAutoChangeSMColorList;
        }

        return settings;
    }
};

/**
 * 工具类
 */
var Tools = {
    /**
     * 设置Cookie
     * @param {string} name Cookie名称
     * @param {*} value Cookie值
     * @param {?Date} [date] Cookie有效期，为空则表示有效期为浏览器进程关闭
     * @param {string} [prefix] Cookie名称前缀，留空则表示使用{@link KFOL.uid}前缀
     */
    setCookie: function (name, value, date, prefix) {
        document.cookie = '{0}{1}={2}{3};path=/;'
            .replace('{0}', typeof prefix === 'undefined' || prefix === null ? KFOL.uid + '_' : prefix)
            .replace('{1}', name)
            .replace('{2}', encodeURI(value))
            .replace('{3}', !date ? '' : ';expires=' + date.toUTCString());
    },

    /**
     * 获取Cookie
     * @param {string} name Cookie名称
     * @param {string} [prefix] Cookie名称前缀，留空则表示使用{@link KFOL.uid}前缀
     * @returns {?string} Cookie值
     */
    getCookie: function (name, prefix) {
        var regex = new RegExp('(^| ){0}{1}=([^;]*)(;|$)'
            .replace('{0}', typeof prefix === 'undefined' || prefix === null ? KFOL.uid + '_' : prefix)
            .replace('{1}', name)
        );
        var matches = document.cookie.match(regex);
        if (!matches) return null;
        else return decodeURI(matches[2]);
    },

    /**
     * 返回当天指定时间的Date对象
     * @param {string} time 指定的时间（例：22:30:00）
     * @returns {Date} 指定时间的Date对象
     */
    getDateByTime: function (time) {
        var date = new Date();
        var timeArr = time.split(':');
        if (timeArr[0]) date.setHours(parseInt(timeArr[0]));
        if (timeArr[1]) date.setMinutes(parseInt(timeArr[1]));
        if (timeArr[2]) date.setSeconds(parseInt(timeArr[2]));
        date.setMilliseconds(0);
        return date;
    },

    /**
     * 返回当天根据指定时区指定时间的Date对象
     * @param {string} time 指定的时间（例：22:30:00）
     * @param {number} [timezoneOffset={@link Const.forumTimezoneOffset}] UTC时间与本地时间之间的时间差（例：东8区为-8）
     * @returns {Date} 指定时间的Date对象
     */
    getTimezoneDateByTime: function (time, timezoneOffset) {
        if (typeof timezoneOffset === 'undefined') timezoneOffset = Const.forumTimezoneOffset;
        var date = new Date();
        var timeArr = time.split(':');
        if (timeArr[0]) date.setUTCHours(parseInt(timeArr[0]) + timezoneOffset);
        if (timeArr[1]) date.setUTCMinutes(parseInt(timeArr[1]));
        if (timeArr[2]) date.setUTCSeconds(parseInt(timeArr[2]));
        date.setUTCMilliseconds(0);
        var now = new Date();
        if (now.getDate() > date.getDate() || now.getMonth() > date.getMonth() || now.getFullYear() > date.getFullYear()) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    },

    /**
     * 获取距今N天的零时整点的Date对象
     * @param {number} days 距今的天数
     * @returns {Date} 距今N天的零时整点的Date对象
     */
    getMidnightHourDate: function (days) {
        var date = Tools.getDateByTime('00:00:00');
        date.setDate(date.getDate() + days);
        return date;
    },

    /**
     * 获取在当前时间的基础上的指定（相对）时间量的Date对象
     * @param {string} value 指定（相对）时间量，+或-：之后或之前（相对于当前时间）；无符号：绝对值；Y：完整年份；y：年；M：月；d：天；h：小时；m：分；s：秒；ms：毫秒
     * @returns {?Date} 指定（相对）时间量的Date对象
     * @example
     * Tools.getDate('+2y') 获取2年后的Date对象
     * Tools.getDate('+3M') 获取3个月后的Date对象
     * Tools.getDate('-4d') 获取4天前的Date对象
     * Tools.getDate('5h') 获取今天5点的Date对象（其它时间量与当前时间一致）
     * Tools.getDate('2015Y') 获取年份为2015年的Date对象
     */
    getDate: function (value) {
        var date = new Date();
        var matches = /^(-|\+)?(\d+)([a-zA-Z]{1,2})$/.exec(value);
        if (!matches) return null;
        var flag = typeof matches[1] === 'undefined' ? 0 : (matches[1] === '+' ? 1 : -1);
        var increment = flag === -1 ? -parseInt(matches[2]) : parseInt(matches[2]);
        var unit = matches[3];
        switch (unit) {
            case 'Y':
                date.setFullYear(increment);
                break;
            case 'y':
                date.setFullYear(flag === 0 ? increment : date.getFullYear() + increment);
                break;
            case 'M':
                date.setMonth(flag === 0 ? increment : date.getMonth() + increment);
                break;
            case 'd':
                date.setDate(flag === 0 ? increment : date.getDate() + increment);
                break;
            case 'h':
                date.setHours(flag === 0 ? increment : date.getHours() + increment);
                break;
            case 'm':
                date.setMinutes(flag === 0 ? increment : date.getMinutes() + increment);
                break;
            case 's':
                date.setSeconds(flag === 0 ? increment : date.getSeconds() + increment);
                break;
            case 'ms':
                date.setMilliseconds(flag === 0 ? increment : date.getMilliseconds() + increment);
                break;
            default:
                return null;
        }
        return date;
    },

    /**
     * 获取指定Date对象的日期字符串
     * @param {?Date} [date] 指定Date对象，留空表示现在
     * @param {string} [separator='-'] 分隔符，留空表示使用“-”作为分隔符
     * @returns {string} 日期字符串
     */
    getDateString: function (date, separator) {
        date = date ? date : new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return '{0}{3}{1}{3}{2}'
            .replace('{0}', date.getFullYear())
            .replace('{1}', month < 10 ? '0' + month : month)
            .replace('{2}', day < 10 ? '0' + day : day)
            .replace(/\{3\}/g, typeof separator !== 'undefined' ? separator : '-');
    },

    /**
     * 获取指定Date对象的时间字符串
     * @param {?Date} [date] 指定Date对象，留空表示现在
     * @param {string} [separator=':'] 分隔符，留空表示使用“:”作为分隔符
     * @param {boolean} [isShowSecond=true] 是否显示秒钟
     * @returns {string} 时间字符串
     */
    getTimeString: function (date, separator, isShowSecond) {
        date = date ? date : new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var sep = typeof separator !== 'undefined' ? separator : ':';
        isShowSecond = $.type(isShowSecond) === 'boolean' ? isShowSecond : true;
        return '{0}{3}{1}{4}{2}'
            .replace('{0}', hour < 10 ? '0' + hour : hour)
            .replace('{1}', minute < 10 ? '0' + minute : minute)
            .replace('{2}', isShowSecond ? (second < 10 ? '0' + second : second) : '')
            .replace('{3}', sep)
            .replace('{4}', isShowSecond ? sep : '');
    },

    /**
     * 获取指定时间戳距现在所剩余时间的描述
     * @param {number} timestamp 指定时间戳
     * @returns {{hours: number, minutes: number, seconds: number}} 剩余时间的描述，hours：剩余的小时数；minutes：剩余的分钟数；seconds：剩余的秒数
     */
    getTimeDiffInfo: function (timestamp) {
        var diff = timestamp - new Date().getTime();
        if (diff > 0) {
            diff = Math.floor(diff / 1000);
            var hours = Math.floor(diff / 60 / 60);
            if (hours >= 0) {
                var minutes = Math.floor((diff - hours * 60 * 60) / 60);
                if (minutes < 0) minutes = 0;
                var seconds = Math.floor(diff - hours * 60 * 60 - minutes * 60);
                if (seconds < 0) seconds = 0;
                return {hours: hours, minutes: minutes, seconds: seconds};
            }
        }
        return {hours: 0, minutes: 0, seconds: 0};
    },

    /**
     * 判断指定时间是否处于规定时间段内
     * @param {Date} time 指定时间
     * @param {string} range 规定时间段，例：'08:00:15-15:30:30'或'23:30-01:20'
     * @returns {?boolean} 是否处于规定时间段内，返回null表示规定时间段格式不正确
     */
    isBetweenInTimeRange: function (time, range) {
        var rangeArr = range.split('-');
        if (rangeArr.length !== 2) return null;
        var start = Tools.getDateByTime(rangeArr[0]);
        var end = Tools.getDateByTime(rangeArr[1]);
        if (end < start) {
            if (time > end) end.setDate(end.getDate() + 1);
            else start.setDate(start.getDate() - 1);
        }
        return time >= start && time <= end;
    },

    /**
     * 获取当前域名的URL
     * @returns {string} 当前域名的URL
     */
    getHostNameUrl: function () {
        return '{0}//{1}/'.replace('{0}', location.protocol).replace('{1}', location.host);
    },

    /**
     * 获取B对象中与A对象拥有同样字段并且值不同的新对象
     * @param {Object} a 对象A
     * @param {Object} b 对象B
     * @returns {Object} 新的对象
     */
    getDifferentValueOfObject: function (a, b) {
        var c = {};
        if ($.type(a) !== 'object' || $.type(b) !== 'object') return c;
        $.each(b, function (index, key) {
            if (typeof a[index] !== 'undefined') {
                if (!Tools.deepEqual(a[index], key)) c[index] = key;
            }
        });
        return c;
    },

    /**
     * 深度比较两个对象是否相等
     * @param {*} a
     * @param {*} b
     * @returns {boolean} 是否相等
     */
    deepEqual: function (a, b) {
        if (a === b) return true;
        if ($.type(a) !== $.type(b)) return false;
        if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
        if ($.isArray(a) && $.isArray(b) || $.type(a) === 'object' && $.type(b) === 'object') {
            if (a.length !== b.length) return false;
            var c = $.extend($.isArray(a) ? [] : {}, a, b);
            for (var i in c) {
                if (typeof a[i] === 'undefined' || typeof b[i] === 'undefined') return false;
                if (!Tools.deepEqual(a[i], b[i])) return false;
            }
            return true;
        }
        return false;
    },

    /**
     * 获取URL中的指定参数
     * @param {string} name 参数名称
     * @returns {?string} URL中的指定参数
     */
    getUrlParam: function (name) {
        var regex = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var matches = location.search.substring(1).match(regex);
        if (matches) return decodeURI(matches[2]);
        else return null;
    },

    /**
     * 获取经过GBK编码后的字符串
     * @param {string} str 待编码的字符串
     * @returns {string} 经过GBK编码后的字符串
     */
    getGBKEncodeString: function (str) {
        var img = $('<img />').appendTo('body').get(0);
        img.src = 'nothing?sp=' + str;
        var encodeStr = img.src.split('nothing?sp=').pop();
        $(img).remove();
        return encodeStr;
    },

    /**
     * HTML转义编码
     * @param {string} str 待编码的字符串
     * @returns {string} 编码后的字符串
     */
    htmlEncode: function (str) {
        if (str.length === 0) return '';
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/ /g, '&nbsp;')
            .replace(/\'/g, '&#39;')
            .replace(/\"/g, '&quot;')
            .replace(/\n/g, '<br/>');
    },

    /**
     * HTML转义解码
     * @param {string} str 待解码的字符串
     * @returns {string} 解码后的字符串
     */
    htmlDecode: function (str) {
        if (str.length === 0) return '';
        return str.replace(/<br\s*\/?>/gi, '\n')
            .replace(/&quot;/gi, '\"')
            .replace(/&#39;/gi, '\'')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&gt;/gi, '>')
            .replace(/&lt;/gi, '<')
            .replace(/&amp;/gi, '&');
    },

    /**
     * 获取指定对象的关键字列表
     * @param {Object} obj 指定对象
     * @param {number} [sortBy] 是否排序，0：不排序；1：升序；-1：降序
     * @returns {string[]} 关键字列表
     */
    getObjectKeyList: function (obj, sortBy) {
        var list = [];
        if ($.type(obj) !== 'object') return list;
        for (var key in obj) {
            list.push(key);
        }
        if (!sortBy) {
            list.sort(function (a, b) {
                return sortBy > 0 ? a > b : a < b;
            });
        }
        return list;
    },

    /**
     * 获取经过排序的指定对象的关键字列表
     * @param {string[]} sortKeyList 用于排序的关键字列表
     * @param {Object} obj 指定对象
     * @param {number} [sortBy] 是否排序，0：不排序；1：升序；-1：降序
     * @returns {string[]} 关键字列表
     */
    getSortedObjectKeyList: function (sortKeyList, obj, sortBy) {
        var list = Tools.getObjectKeyList(obj, sortBy);
        list.sort(function (a, b) {
            return $.inArray(a, sortKeyList) > $.inArray(b, sortKeyList);
        });
        return list;
    },

    /**
     * 获取经过格式化的统计数字字符串
     * @param {number} num 待处理的数字
     * @returns {string} 经过格式化的数字字符串
     */
    getStatFormatNumber: function (num) {
        var result = '';
        if (num >= 0) result = '<em>+{0}</em>'.replace('{0}', num.toLocaleString());
        else result = '<ins>{0}</ins>'.replace('{0}', num.toLocaleString());
        return result;
    },

    /**
     * 检测浏览器是否为Opera
     * @returns {boolean} 是否为Opera
     */
    isOpera: function () {
        return typeof window.opera !== 'undefined';
    },

    /**
     * 检测浏览器是否为Edge
     * @returns {boolean} 是否为Edge
     */
    isEdge: function () {
        return navigator.appVersion && navigator.appVersion.indexOf('Edge') > 0;
    },

    /**
     * 比较神秘等级高低
     * @param {string} a
     * @param {string} b
     * @returns {number} 比较结果，-1：a小于b；0：a等于b；1：a大于b
     */
    compareSmLevel: function (a, b) {
        var x = a.toUpperCase() === 'MAX' ? 99999999 : parseInt(a);
        var y = b.toUpperCase() === 'MAX' ? 99999999 : parseInt(b);
        if (x > y) return 1;
        else if (x < y) return -1;
        else return 0;
    },

    /**
     * 获取指定用户名在关注或屏蔽列表中的索引号
     * @param {string} name 指定用户名
     * @param {Array} list 指定列表
     * @returns {number} 指定用户在列表中的索引号，-1表示不在该列表中
     */
    inFollowOrBlockUserList: function (name, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].name && list[i].name === name) return i;
        }
        return -1;
    },

    /**
     * 获取帖子当前所在的页数
     * @returns {number} 帖子当前所在的页数
     */
    getCurrentThreadPage: function () {
        var matches = /- (\d+) -/.exec($('.pages:first > li > a[href="javascript:;"]').text());
        return matches ? parseInt(matches[1]) : 1;
    },

    /**
     * 获取指定小数位的本地字符串
     * @param {number} num 数字
     * @param {number} [digit=0] 指定小数位
     * @returns {string} 指定小数位的本地字符串
     */
    getFixedNumberLocaleString: function (num, digit) {
        if (!digit || digit < 0) digit = 0;
        var arr = num.toFixed(digit).split('.');
        var integerStr = parseInt(arr[0]).toLocaleString();
        var decimalStr = '';
        if (typeof arr[1] !== 'undefined') decimalStr = '.' + arr[1];
        return integerStr + decimalStr;
    },

    /**
     * 获取去除了不配对BBCode的引用内容
     * @param {string} content 引用内容
     * @returns {string} 去除了不配对BBCode的引用内容
     */
    getRemoveUnpairedBBCodeQuoteContent: function (content) {
        var startCodeList = [
            /\[color=.+?\]/g, /\[backcolor=.+?\]/g, /\[size=.+?\]/g, /\[font=.+?\]/g, /\[align=.+?\]/g, /\[b\]/g, /\[i\]/g, /\[u\]/g,
            /\[strike\]/g, /\[sup\]/g, /\[sub\]/g
        ];
        var endCodeList = [
            /\[\/color\]/g, /\[\/backcolor\]/g, /\[\/size\]/g, /\[\/font\]/g, /\[\/align\]/g, /\[\/b\]/g, /\[\/i\]/g, /\[\/u\]/g,
            /\[\/strike\]/g, /\[\/sup\]/g, /\[\/sub\]/g
        ];
        for (var i = 0; i < startCodeList.length; i++) {
            var startMatches = content.match(startCodeList[i]);
            var endMatches = content.match(endCodeList[i]);
            var startMatchesNum = startMatches ? startMatches.length : 0;
            var endMatchesNum = endMatches ? endMatches.length : 0;
            if (startMatchesNum !== endMatchesNum) {
                content = content.replace(startCodeList[i], '').replace(endCodeList[i], '');
            }
        }
        return content;
    },

    /**
     * 转换为可外链的音频URL
     * @param {string} url 音频原URL
     * @returns {string} 音频外链URL
     */
    convertToAudioExternalLinkUrl: function (url) {
        var matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(url);
        if (matches) url = 'http://music.miaola.info/163/{0}.mp3'.replace('{0}', matches[1]);
        matches = /^https?:\/\/www\.xiami\.com\/song\/(\d+)/i.exec(url);
        if (matches) url = 'http://music.miaola.info/xiami/{0}.mp3'.replace('{0}', matches[1]);
        return url;
    },

    /**
     * 转换为可外链的视频URL
     * @param {string} url 视频原URL
     * @returns {string} 视频外链URL
     */
    convertToVideoExternalLinkUrl: function (url) {
        var matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(url);
        if (matches) url = 'http://video.miaola.info/youtube/{0}'.replace('{0}', matches[1]);
        matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(url);
        if (matches) url = 'http://video.miaola.info/youtube/{0}'.replace('{0}', matches[1]);
        return url;
    },

    /**
     * 获取指定字符串的字节长度（1个GBK字符按2个字节来算）
     * @param {string} str 指定字符串
     * @returns {number} 字符串的长度
     */
    getStrByteLen: function (str) {
        var len = 0;
        var cLen = 2;
        for (var i = 0; i < str.length; i++) {
            len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? cLen : 1;
        }
        return len;
    },

    /**
     * 添加BBCode
     * @param textArea 文本框
     * @param {string} code BBCode
     * @param {string} selText 选择文本
     */
    addCode: function (textArea, code, selText) {
        var startPos = selText === '' ? code.indexOf(']') + 1 : code.indexOf(selText);
        if (typeof textArea.selectionStart !== 'undefined') {
            var prePos = textArea.selectionStart;
            textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
            textArea.selectionStart = prePos + startPos;
            textArea.selectionEnd = prePos + startPos + selText.length;
        }
        else {
            textArea.value += code;
        }
    },

    /**
     * 获取选择文本
     * @param textArea 文本框
     * @returns {string} 选择文本
     */
    getSelText: function (textArea) {
        return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
    },

    /**
     * 复制文本
     * @param {jQuery} $target 要复制文本的目标元素
     * @param {string} [msg] 复制成功的消息
     * @param {jQuery} [$excludeElem] 要排除复制的元素
     * @returns {boolean} 是否复制成功
     */
    copyText: function ($target, msg, $excludeElem) {
        if (!('execCommand' in document) || !$target.length) return false;
        var copyText = $target.data('copy-text');
        if (copyText) {
            $target = $('<span class="text-hide">' + copyText + '</span>').insertAfter($target);
        }
        if ($excludeElem) $excludeElem.prop('hidden', true);
        var s = window.getSelection();
        s.selectAllChildren($target.get(0));
        var result = document.execCommand('copy');
        s.removeAllRanges();
        if (copyText) $target.remove();
        if ($excludeElem) $excludeElem.removeProp('hidden');
        if (result) {
            alert(msg ? msg : '已复制');
        }
        return result;
    }
};

/**
 * 自定义方法类
 */
var Func = {
    // 自定义方法列表
    funcList: {},

    /**
     * 添加自定义方法
     * @param {string} name 自定义方法名称
     * @param {function} func 自定义方法
     */
    add: function (name, func) {
        name = name.replace(/\./g, '_');
        if (typeof Func.funcList[name] === 'undefined') Func.funcList[name] = [];
        Func.funcList[name].push(func);
    },

    /**
     * 执行自定义方法
     * @param {string} name 自定义方法名称
     * @param {*} [data] 自定义方法参数
     * @returns {boolean} 是否执行了自定义方法
     */
    run: function (name, data) {
        name = name.replace(/\./g, '_');
        if (typeof Func.funcList[name] !== 'undefined') {
            for (var i in Func.funcList[name]) {
                if (typeof Func.funcList[name][i] === 'function') {
                    try {
                        Func.funcList[name][i](data);
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }
            }
            return true;
        }
        else return false;
    }
};

/**
 * 对话框类
 */
var Dialog = {
    /**
     * 创建对话框
     * @param {string} id 对话框ID
     * @param {string} title 对话框标题
     * @param {string} content 对话框内容
     * @param {string} [style] 对话框样式
     * @returns {jQuery} 对话框的jQuery对象
     */
    create: function (id, title, content, style) {
        var html =
            '<form>' +
            '<div class="pd_cfg_box" id="{0}" style="{1}">'.replace('{0}', id).replace('{1}', style ? style : '') +
            '  <h1>{0}<span>&times;</span></h1>'.replace('{0}', title) +
            content +
            '</div>' +
            '</form>';
        var $dialog = $(html).appendTo('body');
        $dialog.on('click', '.pd_cfg_tips', function (e) {
            if (KFOL.isMobile) KFOL.showElementTitleTips(e, this.title);
            return false;
        }).on('click', 'a.pd_disabled_link', function () {
            return false;
        }).keydown(function (e) {
            if (e.keyCode === 27) {
                return Dialog.close(id);
            }
        }).find('h1 > span').click(function () {
            return Dialog.close(id);
        }).end().find('legend input[type="checkbox"]').click(function () {
            var $this = $(this);
            var checked = $this.prop('checked');
            if (Tools.isOpera() || Tools.isEdge())
                $this.closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);
            else
                $this.closest('fieldset').prop('disabled', !checked);
        }).end().find('input[data-disabled]').click(function () {
            var $this = $(this);
            var checked = $this.prop('checked');
            $($this.data('disabled')).each(function () {
                var $this = $(this);
                if ($this.is('a')) {
                    if (checked) $this.removeClass('pd_disabled_link');
                    else $this.addClass('pd_disabled_link');
                }
                else {
                    $this.prop('disabled', !checked);
                }
            });
        });
        if (!KFOL.isMobile) {
            $(window).on('resize.' + id, function () {
                Dialog.show(id);
            });
        }
        return $dialog;
    },

    /**
     * 显示或调整对话框
     * @param {string} id 对话框ID
     */
    show: function (id) {
        var $box = $('#' + id);
        if ($box.length === 0) return;
        $box.find('.pd_cfg_main').css('max-height', $(window).height() - 80)
            .end().find('legend input[type="checkbox"]').each(function () {
            $(this).triggerHandler('click');
        }).end().find('input[data-disabled]').each(function () {
            $(this).triggerHandler('click');
        });
        var boxWidth = $box.width(), windowWidth = $(window).width(), windowHeight = $(window).height();
        if (KFOL.isMobile && windowHeight > 1000) windowHeight /= 2;
        var scrollTop = $(window).scrollTop();
        if (scrollTop < windowHeight / 2) scrollTop = 0;
        var left = windowWidth / 2 + (KFOL.isMobile ? $(window).scrollLeft() / 3 : 0) - boxWidth / 2;
        if (left + boxWidth > windowWidth) left = windowWidth - boxWidth - 20;
        if (left < 0) left = 0;
        var top = windowHeight / 2 + (KFOL.isMobile ? scrollTop : 0) - $box.height() / 2;
        if (top < 0) top = 0;
        $box.css('top', top).css('left', left).fadeIn('fast');
    },

    /**
     * 关闭对话框
     * @param {string} id 对话框ID
     * @returns {boolean} 返回false
     */
    close: function (id) {
        $('#' + id).fadeOut('fast', function () {
            $(this).parent('form').remove();
        });
        if (!KFOL.isMobile) {
            $(window).off('resize.' + id);
        }
        return false;
    }
};

/**
 * 设置对话框类
 */
var ConfigDialog = {
    /**
     * 显示设置对话框
     */
    show: function () {
        if ($('#pd_config').length > 0) return;
        ConfigMethod.read();
        Func.run('ConfigDialog.show_before_');
        var html =
            '<div class="pd_cfg_main">' +
            '  <div class="pd_cfg_nav">' +
            '    <a title="清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）" href="#">清除缓存</a>' +
            '    <a href="#">运行命令</a>' +
            '    <a href="#">查看日志</a>' +
            '    <a href="#">导入/导出设置</a>' +
            '  </div>' +

            '  <div class="pd_cfg_panel" style="margin-bottom:5px">' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_refresh_enabled" type="checkbox" />定时模式 ' +
            '<span class="pd_cfg_tips" title="可按时进行自动操作（包括捐款、自动更换ID颜色，需开启相关功能），只在论坛首页生效' +
            '（不开启此模式的话只能在刷新页面后才会进行操作）">[?]</span></label></legend>' +
            '      <label>标题提示方案<select id="pd_cfg_show_refresh_mode_tips_type"><option value="auto">停留一分钟后显示</option>' +
            '<option value="always">总是显示</option><option value="never">不显示</option></select>' +
            '<span class="pd_cfg_tips" title="在首页的网页标题上显示定时模式提示的方案">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_donation_enabled" type="checkbox" />自动KFB捐款</label></legend>' +
            '      <label>KFB捐款额度<input id="pd_cfg_donation_kfb" maxlength="4" style="width:32px" type="text" />' +
            '<span class="pd_cfg_tips" title="取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前所持现金的百分比（最多不超过5000KFB），例：80%">[?]</span></label>' +
            '      <label style="margin-left:10px">在<input id="pd_cfg_donation_after_time" maxlength="8" style="width:55px" type="text" />' +
            '之后捐款 <span class="pd_cfg_tips" title="在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>首页相关</legend>' +
            '      <label>@提醒<select id="pd_cfg_at_tips_handle_type" style="width:130px"><option value="no_highlight">取消已读提醒高亮</option>' +
            '<option value="no_highlight_extra">取消已读提醒高亮，并在无提醒时补上消息框</option><option value="hide_box_1">不显示已读提醒的消息框</option>' +
            '<option value="hide_box_2">永不显示消息框</option><option value="default">保持默认</option>' +
            '<option value="at_change_to_cao">将@改为艹(其他和方式2相同)</option></select>' +
            '<span class="pd_cfg_tips" title="对首页上的有人@你的消息框进行处理的方案">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_sm_level_up_alert_enabled" type="checkbox" />神秘等级升级提醒 ' +
            '<span class="pd_cfg_tips" title="在神秘等级升级后进行提醒，只在首页生效">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_fixed_deposit_due_alert_enabled" type="checkbox" />定期存款到期提醒 ' +
            '<span class="pd_cfg_tips" title="在定时存款到期时进行提醒，只在首页生效">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_sm_rank_change_alert_enabled" type="checkbox" />系数排名变化提醒 ' +
            '<span class="pd_cfg_tips" title="在神秘系数排名发生变化时进行提醒，只在首页生效">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_home_page_thread_fast_goto_link_enabled" type="checkbox" />在首页帖子旁显示跳转链接 ' +
            '<span class="pd_cfg_tips" title="在首页帖子链接旁显示快速跳转至页末的链接">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_show_vip_surplus_time_enabled" type="checkbox" />显示VIP剩余时间 ' +
            '<span class="pd_cfg_tips" title="在首页显示VIP剩余时间">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>帖子页面相关</legend>' +
            '      <label>帖子每页楼层数量<select id="pd_cfg_per_page_floor_num"><option value="10">10</option>' +
            '<option value="20">20</option><option value="30">30</option></select>' +
            '<span class="pd_cfg_tips" title="用于电梯直达和帖子页数快捷链接功能，如果修改了KF设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</span></label>' +
            '      <label style="margin-left:10px">帖子内容字体大小<input id="pd_cfg_thread_content_font_size" maxlength="2" style="width:20px" type="text" />px ' +
            '<span class="pd_cfg_tips" title="帖子内容字体大小，留空表示使用默认大小，推荐值：14">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_adjust_thread_content_width_enabled" type="checkbox" />调整帖子内容宽度 ' +
            '<span class="pd_cfg_tips" title="调整帖子内容宽度，使其保持一致">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_turn_page_via_keyboard_enabled" type="checkbox" />通过左右键翻页 ' +
            '<span class="pd_cfg_tips" title="在帖子和搜索页面通过左右键进行翻页">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_auto_change_sm_color_enabled_2" type="checkbox" data-disabled="#pd_cfg_auto_change_sm_color_page" />自动更换ID颜色 ' +
            '<span class="pd_cfg_tips" title="可自动更换ID颜色，请点击详细设置前往相应页面进行自定义设置">[?]</span></label>' +
            '<a id="pd_cfg_auto_change_sm_color_page" style="margin-left:10px" target="_blank" href="kf_growup.php">详细设置&raquo;</a><br />' +
            '      <label>自定义本人的神秘颜色<input id="pd_cfg_custom_my_sm_color" maxlength="7" style="width:50px" type="text" />' +
            '<input style="margin-left:0" type="color" id="pd_cfg_custom_my_sm_color_select">' +
            '<span class="pd_cfg_tips" title="自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009CFF，如无需求可留空">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_custom_sm_color_enabled" type="checkbox" data-disabled="#pd_cfg_custom_sm_color_dialog" />自定义各等级神秘颜色 ' +
            '<span class="pd_cfg_tips" title="自定义各等级神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），请点击详细设置自定义各等级颜色">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_sm_color_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_modify_kf_other_domain_enabled" type="checkbox" />将绯月其它域名的链接修改为当前域名 ' +
            '<span class="pd_cfg_tips" title="将帖子和短消息中的绯月其它域名的链接修改为当前域名">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_multi_quote_enabled" type="checkbox" />开启多重引用功能 ' +
            '<span class="pd_cfg_tips" title="在帖子页面开启多重回复和多重引用功能">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_show_self_rating_link_enabled" type="checkbox" />显示自助评分链接 ' +
            '<span class="pd_cfg_tips" title="在符合条件的帖子页面显示自助评分的链接（仅限自助评分测试人员使用）">[?]</span></label><br>' +
            '      <label><input id="pd_cfg_user_memo_enabled" type="checkbox" data-disabled="#pd_cfg_user_memo_dialog" />显示用户备注 ' +
            '<span class="pd_cfg_tips" title="显示用户的自定义备注，请点击详细设置自定义用户备注">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_user_memo_dialog" href="#">详细设置&raquo;</a>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_parse_media_tag_enabled" type="checkbox" />解析多媒体标签 ' +
            '<span class="pd_cfg_tips" title="在帖子页面解析HTML5多媒体标签，详见【常见问题15】">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_batch_buy_thread_enabled" type="checkbox" />开启批量购买帖子功能 ' +
            '<span class="pd_cfg_tips" title="在帖子页面开启批量购买帖子的功能">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_buy_thread_via_ajax_enabled" type="checkbox" />使用Ajax购买帖子 ' +
            '<span class="pd_cfg_tips" title="使用Ajax的方式购买帖子，购买时页面不会跳转">[?]</span></label><br />' +
            '    </fieldset>' +
            '  </div>' +

            '  <div class="pd_cfg_panel">' +
            '    <fieldset>' +
            '      <legend>版块页面相关</legend>' +
            '      <label><input id="pd_cfg_show_fast_goto_thread_page_enabled" type="checkbox" data-disabled="#pd_cfg_max_fast_goto_thread_page_num" />' +
            '显示帖子页数快捷链接 <span class="pd_cfg_tips" title="在版块页面中显示帖子页数快捷链接">[?]</span></label>' +
            '      <label style="margin-left:10px">页数链接最大数量<input id="pd_cfg_max_fast_goto_thread_page_num" style="width:25px" maxlength="4" type="text" />' +
            '<span class="pd_cfg_tips" title="在帖子页数快捷链接中显示页数链接的最大数量">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_highlight_new_post_enabled" type="checkbox" />高亮今日的新帖 ' +
            '<span class="pd_cfg_tips" title="在版块页面中高亮今日新发表帖子的发表时间">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>其它设置</legend>' +
            '      <label>默认提示消息的持续时间<input id="pd_cfg_def_show_msg_duration" maxlength="5" style="width:30px" type="text" />秒 ' +
            '<span class="pd_cfg_tips" title="设置为-1表示永久显示，例：15">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_animation_effect_off_enabled" type="checkbox" />禁用动画效果 ' +
            '<span class="pd_cfg_tips" title="禁用jQuery的动画效果（推荐在配置较差的机器上使用）">[?]</span></label><br />' +
            '      <label>日志保存天数<input id="pd_cfg_log_save_days" maxlength="3" style="width:25px" type="text" />' +
            '<span class="pd_cfg_tips" title="默认值：{0}">[?]</span></label>'.replace('{0}', ConfigMethod.defConfig.logSaveDays) +
            '      <label style="margin-left:10px">浏览器类型<select id="pd_cfg_browse_type"><option value="auto">自动检测</option>' +
            '<option value="desktop">桌面版</option><option value="mobile">移动版</option></select>' +
            '<span class="pd_cfg_tips" title="用于在KFOL助手上判断浏览器的类型，一般使用自动检测即可；如果当前浏览器与自动检测的类型不相符' +
            '（移动版会在设置界面标题上显示“For Mobile”的字样），请手动设置为正确的类型">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_show_log_link_enabled" type="checkbox" />显示日志链接 ' +
            '<span class="pd_cfg_tips" title="在页面上方显示助手日志的链接">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_show_search_link_enabled" type="checkbox" />显示搜索链接 ' +
            '<span class="pd_cfg_tips" title="在页面上方显示搜索对话框的链接">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_add_side_bar_fast_nav_enabled" type="checkbox" />为侧边栏添加快捷导航 ' +
            '<span class="pd_cfg_tips" title="为侧边栏添加快捷导航的链接">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_modify_side_bar_enabled" type="checkbox" />将侧边栏修改为平铺样式 ' +
            '<span class="pd_cfg_tips" title="将侧边栏修改为和手机相同的平铺样式">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_custom_css_enabled" type="checkbox" data-disabled="#pd_cfg_custom_css_dialog" />添加自定义CSS ' +
            '<span class="pd_cfg_tips" title="为页面添加自定义的CSS内容，请点击详细设置填入自定义的CSS内容">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_css_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_custom_script_enabled" type="checkbox" data-disabled="#pd_cfg_custom_script_dialog" />执行自定义脚本 ' +
            '<span class="pd_cfg_tips" title="执行自定义的javascript脚本，请点击详细设置填入自定义的脚本内容">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_script_dialog" href="#">详细设置&raquo;</a>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>关注和屏蔽</legend>' +
            '      <label><input id="pd_cfg_follow_user_enabled" type="checkbox" data-disabled="#pd_cfg_follow_user_dialog" />关注用户 ' +
            '<span class="pd_cfg_tips" title="开启关注用户的功能，所关注的用户将被加注记号，请点击详细设置管理关注用户">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_follow_user_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_block_user_enabled" type="checkbox" data-disabled="#pd_cfg_block_user_dialog" />屏蔽用户 ' +
            '<span class="pd_cfg_tips" title="开启屏蔽用户的功能，你将看不见所屏蔽用户的发言，请点击详细设置管理屏蔽用户">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_block_user_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_block_thread_enabled" type="checkbox" data-disabled="#pd_cfg_block_thread_dialog" />屏蔽帖子 ' +
            '<span class="pd_cfg_tips" title="开启屏蔽标题包含指定关键字的帖子的功能，请点击详细设置管理屏蔽关键字">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_block_thread_dialog" href="#">详细设置&raquo;</a><br />' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_save_current_deposit_enabled" type="checkbox" />自动活期存款 ' +
            '<span class="pd_cfg_tips" title="在当前收入满足指定额度之后自动将指定数额存入活期存款中，只会在首页触发">[?]</span></label></legend>' +
            '      <label>在当前收入已满<input id="pd_cfg_save_current_deposit_after_kfb" maxlength="10" style="width:45px" type="text" />KFB之后 ' +
            '<span class="pd_cfg_tips" title="在当前收入已满指定KFB额度之后自动进行活期存款，例：1000">[?]</span></label><br />' +
            '      <label>将<input id="pd_cfg_save_current_deposit_kfb" maxlength="10" style="width:45px" type="text" />KFB存入活期存款 ' +
            '<span class="pd_cfg_tips" title="将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800">[?]</span></label>' +
            '    </fieldset>' +
            '  </div>' +
            '</div>' +

            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about">' +
            '    <a target="_blank" href="https://greasyfork.org/zh-CN/scripts/8615">By 喵拉布丁</a>' +
            '    <i style="color:#666;font-style:normal">(V{0})</i>'.replace('{0}', version) +
            '    <a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">[常见问题]</a>' +
            '    <a target="_blank" href="read.php?tid=508450">[讨论帖]</a>' +
            '  </span>' +
            '  <button>确定</button><button>取消</button><button>默认值</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_config', 'KF Online助手设置' + (KFOL.isMobile ? ' (For Mobile)' : ''), html);

        $dialog.find('.pd_cfg_btns > button:eq(1)').click(function () {
            return Dialog.close('pd_config');
        }).end().find('.pd_cfg_btns > button:eq(2)').click(function (e) {
            e.preventDefault();
            if (confirm('是否重置所有设置？')) {
                ConfigMethod.clear();
                if (typeof Extra !== 'undefined' && typeof Extra.clearConfig !== 'undefined') {
                    Extra.clearConfig();
                }
                alert('设置已重置');
                location.reload();
            }
        }).end().find('.pd_cfg_nav > a:first-child').click(function (e) {
            e.preventDefault();
            var type = prompt('可清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地缓存', 0);
            if (type === null) return;
            type = parseInt($.trim(type));
            if (!isNaN(type) && type >= 0) {
                ConfigDialog.clearCache(type);
                alert('缓存已清除');
            }
        }).next('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showRunCommandDialog();
        }).next('a').click(function (e) {
            e.preventDefault();
            Log.show();
        }).next('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportSettingDialog();
        });

        $dialog.on('click', 'a[id^="pd_cfg_"][href="#"]', function (e) {
            e.preventDefault();
            if ($(this).hasClass('pd_disabled_link')) return;
            if (this.id === 'pd_cfg_custom_monster_name_dialog') ConfigDialog.showCustomMonsterNameDialog();
            else if (this.id === 'pd_cfg_custom_sm_color_dialog') ConfigDialog.showCustomSmColorDialog();
            else if (this.id === 'pd_cfg_user_memo_dialog') ConfigDialog.showUserMemoDialog();
            else if (this.id === 'pd_cfg_custom_css_dialog') ConfigDialog.showCustomCssDialog();
            else if (this.id === 'pd_cfg_custom_script_dialog') ConfigDialog.showCustomScriptDialog();
            else if (this.id === 'pd_cfg_follow_user_dialog') ConfigDialog.showFollowUserDialog();
            else if (this.id === 'pd_cfg_block_user_dialog') ConfigDialog.showBlockUserDialog();
            else if (this.id === 'pd_cfg_block_thread_dialog') ConfigDialog.showBlockThreadDialog();
        }).end().find('#pd_cfg_custom_my_sm_color_select').change(function () {
            $('#pd_cfg_custom_my_sm_color').val($(this).val().toString().toUpperCase());
        }).end().find('pd_cfg_custom_my_sm_color').keyup(function () {
            var customMySmColor = $.trim($(this).val());
            if (/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
                $('pd_cfg_custom_my_sm_color_select').val(customMySmColor.toUpperCase());
            }
        }).end().find('#pd_cfg_auto_use_item_names').keydown(function (e) {
            if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 97)) {
                e.preventDefault();
                $(this).children().each(function () {
                    $(this).prop('selected', true);
                });
            }
        });

        ConfigDialog.setValue();
        $dialog.submit(function (e) {
            e.preventDefault();
            $('.pd_cfg_btns > button:first').click();
        }).end().find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!ConfigDialog.verify()) return;
            var oriAutoRefreshEnabled = Config.autoRefreshEnabled;
            ConfigMethod.read();
            var options = ConfigDialog.getValue();
            options = ConfigMethod.normalize(options);
            $.extend(Config, options);
            ConfigMethod.write();
            Dialog.close('pd_config');
            if (oriAutoRefreshEnabled !== options.autoRefreshEnabled) {
                if (confirm('你已修改了定时模式的设置，需要刷新页面才能生效，是否立即刷新？')) {
                    location.reload();
                }
            }
        });

        Dialog.show('pd_config');
        $dialog.find('a:first').focus();
        Func.run('ConfigDialog.show_after_');
    },

    /**
     * 设置对话框中的字段值
     */
    setValue: function () {
        $('#pd_cfg_auto_refresh_enabled').prop('checked', Config.autoRefreshEnabled);
        $('#pd_cfg_show_refresh_mode_tips_type').val(Config.showRefreshModeTipsType.toLowerCase());

        $('#pd_cfg_auto_donation_enabled').prop('checked', Config.autoDonationEnabled);
        $('#pd_cfg_donation_kfb').val(Config.donationKfb);
        $('#pd_cfg_donation_after_time').val(Config.donationAfterTime);

        $('#pd_cfg_at_tips_handle_type').val(Config.atTipsHandleType.toLowerCase());
        $('#pd_cfg_sm_level_up_alert_enabled').prop('checked', Config.smLevelUpAlertEnabled);
        $('#pd_cfg_fixed_deposit_due_alert_enabled').prop('checked', Config.fixedDepositDueAlertEnabled);
        $('#pd_cfg_sm_rank_change_alert_enabled').prop('checked', Config.smRankChangeAlertEnabled);
        $('#pd_cfg_home_page_thread_fast_goto_link_enabled').prop('checked', Config.homePageThreadFastGotoLinkEnabled);
        $('#pd_cfg_show_vip_surplus_time_enabled').prop('checked', Config.showVipSurplusTimeEnabled);

        $('#pd_cfg_show_fast_goto_thread_page_enabled').prop('checked', Config.showFastGotoThreadPageEnabled);
        $('#pd_cfg_max_fast_goto_thread_page_num').val(Config.maxFastGotoThreadPageNum);
        $('#pd_cfg_highlight_new_post_enabled').prop('checked', Config.highlightNewPostEnabled);

        $('#pd_cfg_per_page_floor_num').val(Config.perPageFloorNum);
        $('#pd_cfg_thread_content_font_size').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
        $('#pd_cfg_adjust_thread_content_width_enabled').prop('checked', Config.adjustThreadContentWidthEnabled);
        $('#pd_cfg_turn_page_via_keyboard_enabled').prop('checked', Config.turnPageViaKeyboardEnabled);
        $('#pd_cfg_auto_change_sm_color_enabled_2').prop('checked', Config.autoChangeSMColorEnabled);
        $('#pd_cfg_custom_my_sm_color').val(Config.customMySmColor);
        if (Config.customMySmColor) $('#pd_cfg_custom_my_sm_color_select').val(Config.customMySmColor);
        $('#pd_cfg_custom_sm_color_enabled').prop('checked', Config.customSmColorEnabled);
        $('#pd_cfg_modify_kf_other_domain_enabled').prop('checked', Config.modifyKFOtherDomainEnabled);
        $('#pd_cfg_multi_quote_enabled').prop('checked', Config.multiQuoteEnabled);
        $('#pd_cfg_batch_buy_thread_enabled').prop('checked', Config.batchBuyThreadEnabled);
        $('#pd_cfg_user_memo_enabled').prop('checked', Config.userMemoEnabled);
        $('#pd_cfg_parse_media_tag_enabled').prop('checked', Config.parseMediaTagEnabled);
        $('#pd_cfg_show_self_rating_link_enabled').prop('checked', Config.showSelfRatingLinkEnabled);
        $('#pd_cfg_buy_thread_via_ajax_enabled').prop('checked', Config.buyThreadViaAjaxEnabled);

        $('#pd_cfg_def_show_msg_duration').val(Config.defShowMsgDuration);
        $('#pd_cfg_animation_effect_off_enabled').prop('checked', Config.animationEffectOffEnabled);
        $('#pd_cfg_log_save_days').val(Config.logSaveDays);
        $('#pd_cfg_browse_type').val(Config.browseType);
        $('#pd_cfg_show_log_link_enabled').prop('checked', Config.showLogLinkEnabled);
        $('#pd_cfg_show_search_link_enabled').prop('checked', Config.showSearchLinkEnabled);
        $('#pd_cfg_add_side_bar_fast_nav_enabled').prop('checked', Config.addSideBarFastNavEnabled);
        $('#pd_cfg_modify_side_bar_enabled').prop('checked', Config.modifySideBarEnabled);
        $('#pd_cfg_custom_css_enabled').prop('checked', Config.customCssEnabled);
        $('#pd_cfg_custom_script_enabled').prop('checked', Config.customScriptEnabled);

        $('#pd_cfg_follow_user_enabled').prop('checked', Config.followUserEnabled);
        $('#pd_cfg_block_user_enabled').prop('checked', Config.blockUserEnabled);
        $('#pd_cfg_block_thread_enabled').prop('checked', Config.blockThreadEnabled);

        $('#pd_cfg_auto_save_current_deposit_enabled').prop('checked', Config.autoSaveCurrentDepositEnabled);
        if (Config.saveCurrentDepositAfterKfb > 0) $('#pd_cfg_save_current_deposit_after_kfb').val(Config.saveCurrentDepositAfterKfb);
        if (Config.saveCurrentDepositKfb > 0) $('#pd_cfg_save_current_deposit_kfb').val(Config.saveCurrentDepositKfb);
    },

    /**
     * 获取对话框中字段值的Config对象
     * @returns {Config} 字段值的Config对象
     */
    getValue: function () {
        var options = {};
        options.autoRefreshEnabled = $('#pd_cfg_auto_refresh_enabled').prop('checked');
        options.showRefreshModeTipsType = $('#pd_cfg_show_refresh_mode_tips_type').val();

        options.autoDonationEnabled = $('#pd_cfg_auto_donation_enabled').prop('checked');
        options.donationKfb = $.trim($('#pd_cfg_donation_kfb').val());
        options.donationKfb = $.isNumeric(options.donationKfb) ? parseInt(options.donationKfb) : options.donationKfb;
        options.donationAfterTime = $('#pd_cfg_donation_after_time').val();

        options.atTipsHandleType = $('#pd_cfg_at_tips_handle_type').val();
        options.smLevelUpAlertEnabled = $('#pd_cfg_sm_level_up_alert_enabled').prop('checked');
        options.fixedDepositDueAlertEnabled = $('#pd_cfg_fixed_deposit_due_alert_enabled').prop('checked');
        options.smRankChangeAlertEnabled = $('#pd_cfg_sm_rank_change_alert_enabled').prop('checked');
        options.homePageThreadFastGotoLinkEnabled = $('#pd_cfg_home_page_thread_fast_goto_link_enabled').prop('checked');
        options.showVipSurplusTimeEnabled = $('#pd_cfg_show_vip_surplus_time_enabled').prop('checked');

        options.showFastGotoThreadPageEnabled = $('#pd_cfg_show_fast_goto_thread_page_enabled').prop('checked');
        options.maxFastGotoThreadPageNum = parseInt($.trim($('#pd_cfg_max_fast_goto_thread_page_num').val()));
        options.highlightNewPostEnabled = $('#pd_cfg_highlight_new_post_enabled').prop('checked');

        options.perPageFloorNum = $('#pd_cfg_per_page_floor_num').val();
        options.threadContentFontSize = parseInt($.trim($('#pd_cfg_thread_content_font_size').val()));
        options.adjustThreadContentWidthEnabled = $('#pd_cfg_adjust_thread_content_width_enabled').prop('checked');
        options.turnPageViaKeyboardEnabled = $('#pd_cfg_turn_page_via_keyboard_enabled').prop('checked');
        options.autoChangeSMColorEnabled = $('#pd_cfg_auto_change_sm_color_enabled_2').prop('checked');
        options.customMySmColor = $.trim($('#pd_cfg_custom_my_sm_color').val()).toUpperCase();
        options.customSmColorEnabled = $('#pd_cfg_custom_sm_color_enabled').prop('checked');
        options.modifyKFOtherDomainEnabled = $('#pd_cfg_modify_kf_other_domain_enabled').prop('checked');
        options.multiQuoteEnabled = $('#pd_cfg_multi_quote_enabled').prop('checked');
        options.batchBuyThreadEnabled = $('#pd_cfg_batch_buy_thread_enabled').prop('checked');
        options.userMemoEnabled = $('#pd_cfg_user_memo_enabled').prop('checked');
        options.parseMediaTagEnabled = $('#pd_cfg_parse_media_tag_enabled').prop('checked');
        options.showSelfRatingLinkEnabled = $('#pd_cfg_show_self_rating_link_enabled').prop('checked');
        options.buyThreadViaAjaxEnabled = $('#pd_cfg_buy_thread_via_ajax_enabled').prop('checked');

        options.defShowMsgDuration = parseInt($.trim($('#pd_cfg_def_show_msg_duration').val()));
        options.animationEffectOffEnabled = $('#pd_cfg_animation_effect_off_enabled').prop('checked');
        options.logSaveDays = parseInt($.trim($('#pd_cfg_log_save_days').val()));
        options.browseType = $('#pd_cfg_browse_type').val();
        options.showLogLinkEnabled = $('#pd_cfg_show_log_link_enabled').prop('checked');
        options.showSearchLinkEnabled = $('#pd_cfg_show_search_link_enabled').prop('checked');
        options.addSideBarFastNavEnabled = $('#pd_cfg_add_side_bar_fast_nav_enabled').prop('checked');
        options.modifySideBarEnabled = $('#pd_cfg_modify_side_bar_enabled').prop('checked');
        options.customCssEnabled = $('#pd_cfg_custom_css_enabled').prop('checked');
        options.customScriptEnabled = $('#pd_cfg_custom_script_enabled').prop('checked');

        options.followUserEnabled = $('#pd_cfg_follow_user_enabled').prop('checked');
        options.blockUserEnabled = $('#pd_cfg_block_user_enabled').prop('checked');
        options.blockThreadEnabled = $('#pd_cfg_block_thread_enabled').prop('checked');

        options.autoSaveCurrentDepositEnabled = $('#pd_cfg_auto_save_current_deposit_enabled').prop('checked');
        options.saveCurrentDepositAfterKfb = parseInt($.trim($('#pd_cfg_save_current_deposit_after_kfb').val()));
        options.saveCurrentDepositKfb = parseInt($.trim($('#pd_cfg_save_current_deposit_kfb').val()));
        return options;
    },

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    verify: function () {
        var $txtDonationKfb = $('#pd_cfg_donation_kfb');
        var donationKfb = $.trim($txtDonationKfb.val());
        if (/%$/.test(donationKfb)) {
            if (!/^1?\d?\d%$/.test(donationKfb)) {
                alert('KFB捐款额度格式不正确');
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
            if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > 100) {
                alert('KFB捐款额度百分比的取值范围在1-100之间');
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
        }
        else {
            if (!$.isNumeric(donationKfb)) {
                alert('KFB捐款额度格式不正确');
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
            if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > Const.maxDonationKfb) {
                alert('KFB捐款额度的取值范围在1-{0}之间'.replace('{0}', Const.maxDonationKfb));
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
        }

        var $txtDonationAfterTime = $('#pd_cfg_donation_after_time');
        var donationAfterTime = $.trim($txtDonationAfterTime.val());
        if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(donationAfterTime)) {
            alert('在指定时间之后捐款格式不正确');
            $txtDonationAfterTime.select();
            $txtDonationAfterTime.focus();
            return false;
        }

        var $txtMaxFastGotoThreadPageNum = $('#pd_cfg_max_fast_goto_thread_page_num');
        var maxFastGotoThreadPageNum = $.trim($txtMaxFastGotoThreadPageNum.val());
        if (!$.isNumeric(maxFastGotoThreadPageNum) || parseInt(maxFastGotoThreadPageNum) <= 0) {
            alert('页数链接最大数量格式不正确');
            $txtMaxFastGotoThreadPageNum.select();
            $txtMaxFastGotoThreadPageNum.focus();
            return false;
        }

        var $txtThreadContentFontSize = $('#pd_cfg_thread_content_font_size');
        var threadContentFontSize = $.trim($txtThreadContentFontSize.val());
        if (threadContentFontSize && (isNaN(parseInt(threadContentFontSize)) || parseInt(threadContentFontSize) < 0)) {
            alert('帖子内容字体大小格式不正确');
            $txtThreadContentFontSize.select();
            $txtThreadContentFontSize.focus();
            return false;
        }

        var $txtCustomMySmColor = $('#pd_cfg_custom_my_sm_color');
        var customMySmColor = $.trim($txtCustomMySmColor.val());
        if (customMySmColor && !/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
            alert('自定义本人的神秘颜色格式不正确，例：#009CFF');
            $txtCustomMySmColor.select();
            $txtCustomMySmColor.focus();
            return false;
        }

        var $txtDefShowMsgDuration = $('#pd_cfg_def_show_msg_duration');
        var defShowMsgDuration = $.trim($txtDefShowMsgDuration.val());
        if (!$.isNumeric(defShowMsgDuration) || parseInt(defShowMsgDuration) < -1) {
            alert('默认提示消息的持续时间格式不正确');
            $txtDefShowMsgDuration.select();
            $txtDefShowMsgDuration.focus();
            return false;
        }

        var $txtLogSaveDays = $('#pd_cfg_log_save_days');
        var logSaveDays = $.trim($txtLogSaveDays.val());
        if (!$.isNumeric(logSaveDays) || parseInt(logSaveDays) < 1) {
            alert('日志保存天数格式不正确');
            $txtLogSaveDays.select();
            $txtLogSaveDays.focus();
            return false;
        }

        var $txtSaveCurrentDepositAfterKfb = $('#pd_cfg_save_current_deposit_after_kfb');
        var $txtSaveCurrentDepositKfb = $('#pd_cfg_save_current_deposit_kfb');
        var saveCurrentDepositAfterKfb = parseInt($.trim($txtSaveCurrentDepositAfterKfb.val()));
        var saveCurrentDepositKfb = parseInt($.trim($txtSaveCurrentDepositKfb.val()));
        if (saveCurrentDepositAfterKfb || saveCurrentDepositKfb) {
            if (!saveCurrentDepositAfterKfb || saveCurrentDepositAfterKfb <= 0) {
                alert('自动活期存款满足额度格式不正确');
                $txtSaveCurrentDepositAfterKfb.select();
                $txtSaveCurrentDepositAfterKfb.focus();
                return false;
            }
            if (!saveCurrentDepositKfb || saveCurrentDepositKfb <= 0 || saveCurrentDepositKfb > saveCurrentDepositAfterKfb) {
                alert('想要存款的金额格式不正确');
                $txtSaveCurrentDepositKfb.select();
                $txtSaveCurrentDepositKfb.focus();
                return false;
            }
        }

        return true;
    },

    /**
     * 清除缓存
     * @param {number} type 清除类别，0：全部清除；1：清除Cookies；2：清除本地缓存
     */
    clearCache: function (type) {
        if (type === 0 || type === 1) {
            for (var key in Const) {
                if (/CookieName$/.test(key)) {
                    Tools.setCookie(Const[key], '', Tools.getDate('-1d'));
                }
            }
        }
        if (type === 0 || type === 2) {
            TmpLog.clear();
            localStorage.removeItem(Const.multiQuoteStorageName);
        }
    },

    /**
     * 显示运行命令对话框
     */
    showRunCommandDialog: function () {
        if ($('#pd_run_command').length > 0) return;
        Dialog.close('pd_config');
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin:5px 0">运行命令快捷键：<b>Ctrl+Enter</b>；清除命令快捷键：<b>Ctrl+退格键</b><br />' +
            '按<b>F12键</b>可打开浏览器控制台查看消息（需切换至控制台或Console标签）</div>' +
            '  <textarea wrap="off" style="width:750px;height:300px;white-space:pre"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>运行</button><button>清除</button><button>关闭</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_run_command', '运行命令', html);
        var $textArea = $dialog.find('textarea');
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            var content = $textArea.val();
            if (!content) return;
            try {
                console.log(eval(content));
            }
            catch (ex) {
                console.log(ex);
            }
        }).next('button').click(function (e) {
            e.preventDefault();
            $textArea.val('').focus();
        }).next('button').click(function () {
            return Dialog.close('pd_run_command');
        });
        Dialog.show('pd_run_command');
        $textArea.keyup(function (e) {
            if (e.ctrlKey && e.keyCode === 13) {
                $dialog.find('.pd_cfg_btns > button:first').click();
            }
            else if (e.ctrlKey && e.keyCode === 8) {
                $dialog.find('.pd_cfg_btns > button:eq(1)').click();
            }
        }).focus();
    },

    /**
     * 显示导入或导出设置对话框
     */
    showImportOrExportSettingDialog: function () {
        if ($('#pd_im_or_ex_setting').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_setting" style="width:600px;height:400px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_setting', '导入或导出设置', html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_setting').val());
            if (!options) return;
            try {
                options = JSON.parse(options);
            }
            catch (ex) {
                alert('设置有错误');
                return;
            }
            if (!options || $.type(options) !== 'object') {
                alert('设置有错误');
                return;
            }
            options = ConfigMethod.normalize(options);
            Config = $.extend(true, {}, ConfigMethod.defConfig, options);
            ConfigMethod.write();
            alert('设置已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_im_or_ex_setting');
        });
        Dialog.show('pd_im_or_ex_setting');
        $('#pd_cfg_setting').val(JSON.stringify(Tools.getDifferentValueOfObject(ConfigMethod.defConfig, Config))).select();
    },

    /**
     * 显示自定义各等级神秘颜色设置对话框
     */
    showCustomSmColorDialog: function () {
        if ($('#pd_custom_sm_color').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="border-bottom:1px solid #9191FF;margin-bottom:7px;padding-bottom:5px"><strong>示例' +
            '（<a target="_blank" href="http://www.35ui.cn/jsnote/peise.html">常用配色表</a> / <a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a>）：' +
            '</strong><br /><b>等级范围：</b>4-4 <b>颜色：</b><span style="color:#0000FF">#0000FF</span><br /><b>等级范围：</b>10-99 <b>颜色：</b>' +
            '<span style="color:#5AD465">#5AD465</span><br /><b>等级范围：</b>5000-MAX <b>颜色：</b><span style="color:#FF0000">#FF0000</span></div>' +
            '  <ul id="pd_cfg_custom_sm_color_list"></ul>' +
            '  <div style="margin-top:5px" id="pd_cfg_custom_sm_color_add_btns"><a href="#">增加1个</a><a href="#" style="margin-left:7px">增加5个</a>' +
            '<a href="#" style="margin-left:7px">清除所有</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出配色方案</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_sm_color', '自定义各等级神秘颜色', html);
        var $customSmColorList = $dialog.find('#pd_cfg_custom_sm_color_list');
        $dialog.find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_custom_sm_color');
        });

        $customSmColorList.on('keyup', '.pd_cfg_sm_color', function () {
            var $this = $(this);
            var color = $.trim($this.val());
            if (/^#[0-9a-fA-F]{6}$/.test(color)) {
                $this.next('input[type="color"]').val(color.toUpperCase());
            }
        }).on('change', 'input[type="color"]', function () {
            var $this = $(this);
            $this.prev('input').val($this.val().toString().toUpperCase());
        }).on('click', 'a', function (e) {
            e.preventDefault();
            $(this).closest('li').remove();
        });

        var getSmColorListLine = function (data) {
            if (!data) data = {};
            return ('<li><label>等级范围<input class="pd_cfg_sm_min" type="text" maxlength="5" style="width:30px" value="{0}" /></label>' +
            '<label>-<input class="pd_cfg_sm_max" type="text" maxlength="5" style="width:30px" value="{1}" /></label>' +
            '<label>颜色<input class="pd_cfg_sm_color" type="text" maxlength="7" style="width:50px" value="{2}" />' +
            '<input style="margin-left:0" type="color" value="{2}"></label> <a href="#">删除</a></li>')
                .replace('{0}', typeof data.min === 'undefined' ? '' : data.min)
                .replace('{1}', typeof data.max === 'undefined' ? '' : data.max)
                .replace(/\{2\}/g, typeof data.color === 'undefined' ? '' : data.color);
        };

        $dialog.find('#pd_cfg_custom_sm_color_add_btns').find('a:lt(2)').click(function (e) {
            e.preventDefault();
            var num = 1;
            if ($(this).is('#pd_cfg_custom_sm_color_add_btns > a:eq(1)')) num = 5;
            for (var i = 1; i <= num; i++) {
                $customSmColorList.append(getSmColorListLine());
            }
            Dialog.show('pd_custom_sm_color');
        }).end().find('a:last').click(function (e) {
            e.preventDefault();
            if (confirm('是否清除所有设置？')) {
                $customSmColorList.empty();
                Dialog.show('pd_custom_sm_color');
            }
        });

        $dialog.find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportSmColorConfigDialog();
        });

        var smColorHtml = '';
        $.each(Config.customSmColorConfigList, function (index, data) {
            smColorHtml += getSmColorListLine(data);
        });
        $customSmColorList.html(smColorHtml);

        $dialog.submit(function (e) {
            e.preventDefault();
            var list = [];
            var verification = true;
            $customSmColorList.find('li').each(function () {
                var $this = $(this);
                var $txtSmMin = $this.find('.pd_cfg_sm_min');
                var smMin = $.trim($txtSmMin.val()).toUpperCase();
                if (smMin === '') return;
                if (!/^(-?\d+|MAX)$/i.test(smMin)) {
                    verification = false;
                    $txtSmMin.select();
                    $txtSmMin.focus();
                    alert('等级范围格式不正确');
                    return false;
                }
                var $txtSmMax = $this.find('.pd_cfg_sm_max');
                var smMax = $.trim($txtSmMax.val()).toUpperCase();
                if (smMax === '') return;
                if (!/^(-?\d+|MAX)$/i.test(smMax)) {
                    verification = false;
                    $txtSmMax.select();
                    $txtSmMax.focus();
                    alert('等级范围格式不正确');
                    return false;
                }
                if (Tools.compareSmLevel(smMax, smMin) < 0) {
                    verification = false;
                    $txtSmMin.select();
                    $txtSmMin.focus();
                    alert('等级范围格式不正确');
                    return false;
                }
                var $txtSmColor = $this.find('.pd_cfg_sm_color');
                var smColor = $.trim($txtSmColor.val()).toUpperCase();
                if (smColor === '') return;
                if (!/^#[0-9a-fA-F]{6}$/.test(smColor)) {
                    verification = false;
                    $txtSmColor.select();
                    $txtSmColor.focus();
                    alert('颜色格式不正确');
                    return false;
                }
                list.push({min: smMin, max: smMax, color: smColor});
            });
            if (verification) {
                list.sort(function (a, b) {
                    return Tools.compareSmLevel(a.min, b.min) > 0;
                });
                Config.customSmColorConfigList = list;
                ConfigMethod.write();
                Dialog.close('pd_custom_sm_color');
            }
        });

        Dialog.show('pd_custom_sm_color');
        if ($customSmColorList.find('input').length > 0) $customSmColorList.find('input:first').focus();
        else $('#pd_cfg_custom_sm_color_add_btns > a:first').focus();
    },

    /**
     * 显示导入或导出配色方案对话框
     */
    showImportOrExportSmColorConfigDialog: function () {
        if ($('#pd_im_or_ex_sm_color_config').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入配色方案：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出配色方案：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_sm_color_config" style="width:420px;height:200px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a></span>' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_sm_color_config', '导入或导出配色方案', html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_sm_color_config').val());
            if (!options) return;
            try {
                options = JSON.parse(options);
            }
            catch (ex) {
                alert('配色方案有错误');
                return;
            }
            if (!options || $.type(options) !== 'array') {
                alert('配色方案有错误');
                return;
            }
            Config.customSmColorConfigList = options;
            ConfigMethod.write();
            alert('配色方案已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_im_or_ex_sm_color_config');
        });
        Dialog.show('pd_im_or_ex_sm_color_config');
        $dialog.find('#pd_cfg_sm_color_config').val(JSON.stringify(Config.customSmColorConfigList)).select();
    },

    /**
     * 显示自定义怪物名称对话框
     */
    showCustomMonsterNameDialog: function () {
        if ($('#pd_custom_monster_name').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <table id="pd_cfg_custom_monster_name_list">' +
            '    <tbody>' +
            '      <tr><th style="width:120px">怪物</th><th>自定义名称</th></tr>' +
            '      <tr><td>Lv.1：小史莱姆</td><td><input type="text" maxlength="18" data-id="1" /></td></tr>' +
            '      <tr><td>Lv.2：笨蛋</td><td><input type="text" maxlength="18" data-id="2" /></td></tr>' +
            '      <tr><td>Lv.3：大果冻史莱姆</td><td><input type="text" maxlength="18" data-id="3" /></td></tr>' +
            '      <tr><td>Lv.4：肉山</td><td><input type="text" maxlength="18" data-id="4" /></td></tr>' +
            '      <tr><td>Lv.5：大魔王</td><td><input type="text" maxlength="18" data-id="5" /></td></tr>' +
            '    </tbody>' +
            '  </table>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>确定</button><button>取消</button><button>重置</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_monster_name', '自定义怪物名称', html);
        $dialog.submit(function (e) {
            e.preventDefault();
            Config.customMonsterNameList = {};
            $('#pd_cfg_custom_monster_name_list input').each(function () {
                var $this = $(this);
                var name = $.trim($this.val());
                if (name !== '') {
                    Config.customMonsterNameList[parseInt($this.data('id'))] = name;
                }
            });
            ConfigMethod.write();
            Dialog.close('pd_custom_monster_name');
        }).find('.pd_cfg_btns > button:eq(1)').click(function () {
            return Dialog.close('pd_custom_monster_name');
        }).next('button').click(function (e) {
            e.preventDefault();
            $('#pd_cfg_custom_monster_name_list input').val('');
        });
        $.each(Config.customMonsterNameList, function (id, name) {
            $('#pd_cfg_custom_monster_name_list input[data-id="{0}"]'.replace('{0}', id)).val(name);
        });
        Dialog.show('pd_custom_monster_name');
        $('#pd_cfg_custom_monster_name_list input:first').focus();
    },

    /**
     * 显示自定义CSS对话框
     */
    showCustomCssDialog: function () {
        if ($('#pd_custom_css').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <strong>自定义CSS内容：</strong><br />' +
            '  <textarea wrap="off" style="width:750px;height:400px;white-space:pre"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500969">其他人分享的CSS规则</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_css', '自定义CSS', html);
        var $content = $dialog.find('textarea');
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.customCssContent = $.trim($content.val());
            ConfigMethod.write();
            Dialog.close('pd_custom_css');
        }).next('button').click(function () {
            return Dialog.close('pd_custom_css');
        });
        $content.val(Config.customCssContent);
        Dialog.show('pd_custom_css');
        $content.focus();
    },

    /**
     * 显示自定义脚本对话框
     */
    showCustomScriptDialog: function () {
        if ($('#pd_custom_script').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin:5px 0">' +
            '    <label style="color:#F00"><input type="radio" name="pd_custom_script_type" value="start" checked="checked" /> 在脚本开始时执行的内容</label>' +
            '    <label style="color:#00F"><input type="radio" name="pd_custom_script_type" value="end" /> 在脚本结束时执行的内容</label>' +
            '  </div>' +
            '  <textarea wrap="off" id="pd_custom_script_start_content" style="width:750px;height:500px;white-space:pre"></textarea>' +
            '  <textarea wrap="off" id="pd_custom_script_end_content" style="width:750px;height:500px;white-space:pre;display:none"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500968">其他人分享的自定义脚本</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_script', '自定义脚本', html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.customScriptStartContent = $('#pd_custom_script_start_content').val();
            Config.customScriptEndContent = $('#pd_custom_script_end_content').val();
            ConfigMethod.write();
            Dialog.close('pd_custom_script');
        }).next('button').click(function () {
            return Dialog.close('pd_custom_script');
        });
        $dialog.find('#pd_custom_script_start_content').val(Config.customScriptStartContent)
            .end().find('#pd_custom_script_end_content').val(Config.customScriptEndContent)
            .end().find('input[name="pd_custom_script_type"]').click(function () {
            var type = $(this).val();
            $('#pd_custom_script_' + (type === 'end' ? 'start' : 'end') + '_content').hide();
            $('#pd_custom_script_' + (type === 'end' ? 'end' : 'start') + '_content').show();
        });
        Dialog.show('pd_custom_script');
        $dialog.find('#pd_custom_script_start_content').focus();
    },

    /**
     * 显示用户备注对话框
     */
    showUserMemoDialog: function () {
        if ($('#pd_user_memo').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  按照“用户名:备注”的格式（注意是英文冒号），每行一个<br />' +
            '  <textarea wrap="off" style="width:320px;height:400px;white-space:pre"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_user_memo', '用户备注', html);
        var $userMemoList = $dialog.find('textarea');
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            var content = $.trim($userMemoList.val());
            Config.userMemoList = {};
            var lines = content.split('\n');
            for (var i in lines) {
                var line = $.trim(lines[i]);
                if (!line) continue;
                if (!/.+?:.+/.test(line)) {
                    alert('用户备注格式不正确');
                    $userMemoList.focus();
                    return;
                }
                var valueArr = line.split(':');
                if (valueArr.length < 2) continue;
                var user = $.trim(valueArr[0]);
                var memo = $.trim(valueArr[1]);
                if (!user || !memo) continue;
                Config.userMemoList[user] = memo;
            }
            ConfigMethod.write();
            Dialog.close('pd_user_memo');
        }).next('button').click(function () {
            return Dialog.close('pd_user_memo');
        });
        var content = '';
        for (var user in Config.userMemoList) {
            content += '{0}:{1}\n'.replace('{0}', user).replace('{1}', Config.userMemoList[user]);
        }
        $userMemoList.val(content);
        Dialog.show('pd_user_memo');
        $userMemoList.focus();
    },

    /**
     * 显示关注用户对话框
     */
    showFollowUserDialog: function () {
        if ($('#pd_follow_user').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin-top:5px">' +
            '    <label><input id="pd_cfg_highlight_follow_user_thread_in_hp_enabled" type="checkbox" />高亮所关注用户的首页帖子链接 ' +
            '<span class="pd_cfg_tips" title="高亮所关注用户在首页下的帖子链接">[?]</span></label><br />' +
            '    <label><input id="pd_cfg_highlight_follow_user_thread_link_enabled" type="checkbox" />高亮所关注用户的帖子链接 ' +
            '<span class="pd_cfg_tips" title="高亮所关注用户在版块页面下的帖子链接">[?]</span></label><br />' +
            '  </div>' +
            '  <ul id="pd_cfg_follow_user_list" style="margin-top:5px;width:274px;line-height:24px"></ul>' +
            '  <div id="pd_cfg_follow_user_btns" style="margin-top:5px;">' +
            '    <div style="display:inline-block"><a href="#">全选</a><a style="margin-left:7px" href="#">反选</a></div>' +
            '    <div style="float:right"><a style="margin-left:7px" href="#">删除</a></div>' +
            '  </div>' +
            '  <div style="margin-top:5px" title="添加多个用户请用英文逗号分隔"><input id="pd_cfg_add_follow_user" style="width:200px" type="text" />' +
            '<a style="margin-left:7px" href="#">添加</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出关注用户</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_follow_user', '关注用户', html);
        var $followUserList = $dialog.find('#pd_cfg_follow_user_list');
        $dialog.submit(function (e) {
            e.preventDefault();
            $dialog.find('.pd_cfg_btns > button:first').click();
        }).find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.highlightFollowUserThreadInHPEnabled = $('#pd_cfg_highlight_follow_user_thread_in_hp_enabled').prop('checked');
            Config.highlightFollowUserThreadLinkEnabled = $('#pd_cfg_highlight_follow_user_thread_link_enabled').prop('checked');
            Config.followUserList = [];
            $followUserList.find('li').each(function () {
                var $this = $(this);
                var name = $.trim($this.find('input[type="text"]').val());
                if (name !== '' && Tools.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                    Config.followUserList.push({name: name});
                }
            });
            ConfigMethod.write();
            Dialog.close('pd_follow_user');
        }).end().find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_follow_user');
        });

        $('#pd_cfg_highlight_follow_user_thread_in_hp_enabled').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
        $('#pd_cfg_highlight_follow_user_thread_link_enabled').prop('checked', Config.highlightFollowUserThreadLinkEnabled);

        /**
         * 添加关注用户
         * @param {string} name 用户名
         */
        var addFollowUser = function (name) {
            $(
                ('<li><input type="checkbox" /><input type="text" style="width:178px;margin-left:5px" maxlength="15" value="{0}" />' +
                '<a style="margin-left:7px" href="#">删除</a></li>')
                    .replace('{0}', name)
            ).appendTo($followUserList);
        };

        for (var i in Config.followUserList) {
            addFollowUser(Config.followUserList[i].name);
        }

        $followUserList.on('click', 'a', function (e) {
            e.preventDefault();
            $(this).parent().remove();
        });

        $('#pd_cfg_follow_user_btns').find('a:first')
            .click(function (e) {
                e.preventDefault();
                $followUserList.find('input[type="checkbox"]').prop('checked', true);
            })
            .end()
            .find('a:eq(1)')
            .click(function (e) {
                e.preventDefault();
                $followUserList.find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            })
            .end()
            .find('a:last')
            .click(function (e) {
                e.preventDefault();
                var $checked = $followUserList.find('li:has(input[type="checkbox"]:checked)');
                if ($checked.length === 0) return;
                if (confirm('是否删除所选用户？')) {
                    $checked.remove();
                    Dialog.show('pd_follow_user');
                }
            });

        $dialog.find('#pd_cfg_add_follow_user').keydown(function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                $(this).next('a').click();
            }
        }).next('a').click(function (e) {
            e.preventDefault();
            var users = $.trim($('#pd_cfg_add_follow_user').val()).split(',');
            if (!users || $.trim(users[0]) === '') return;
            for (var i in users) {
                var name = $.trim(users[i]);
                if (name === '') continue;
                if (Tools.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                    addFollowUser(name);
                }
            }
            $('#pd_cfg_add_follow_user').val('');
            Dialog.show('pd_follow_user');
        });

        $dialog.find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCommonImportOrExportConfigDialog(1);
        });

        Dialog.show('pd_follow_user');
        $('#pd_cfg_highlight_follow_user_thread_in_hp_enabled').focus();
    },

    /**
     * 显示屏蔽用户对话框
     */
    showBlockUserDialog: function () {
        if ($('#pd_block_user').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin-top:5px;line-height:24px">' +
            '    <label>默认屏蔽类型<select id="pd_cfg_block_user_default_type"><option value="0">屏蔽主题和回帖</option>' +
            '<option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option></select></label>' +
            '    <label style="margin-left:10px"><input id="pd_cfg_block_user_at_tips_enabled" type="checkbox" />屏蔽@提醒 ' +
            '<span class="pd_cfg_tips" title="屏蔽被屏蔽用户的@提醒">[?]</span></label><br />' +
            '    <label>版块屏蔽范围<select id="pd_cfg_block_user_forum_type"><option value="0">所有版块</option><option value="1">包括指定版块</option>' +
            '<option value="2">排除指定版块</option></select></label><br />' +
            '    <label>版块ID列表<input id="pd_cfg_block_user_fid_list" type="text" style="width:220px" /> ' +
            '<span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span></label>' +
            '  </div>' +
            '  <ul id="pd_cfg_block_user_list" style="margin-top:5px;width:362px;line-height:24px"></ul>' +
            '  <div id="pd_cfg_block_user_btns" style="margin-top:5px;">' +
            '    <div style="display:inline-block"><a href="#">全选</a><a style="margin-left:7px" href="#">反选</a></div>' +
            '    <div style="float:right"><a href="#">修改为</a><select style="margin-left:7px"><option value="0">屏蔽主题和回帖</option>' +
            '<option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option></select><a style="margin-left:7px" href="#">删除</a></div>' +
            '  </div>' +
            '  <div style="margin-top:5px" title="添加多个用户请用英文逗号分隔"><input id="pd_cfg_add_block_user" style="width:200px" type="text" />' +
            '<a style="margin-left:7px" href="#">添加</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出屏蔽用户</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_block_user', '屏蔽用户', html);
        var $blockUserList = $dialog.find('#pd_cfg_block_user_list');
        $dialog.submit(function (e) {
            e.preventDefault();
            $dialog.find('.pd_cfg_btns > button:first').click();
        }).find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.blockUserDefaultType = $('#pd_cfg_block_user_default_type').val();
            Config.blockUserAtTipsEnabled = $('#pd_cfg_block_user_at_tips_enabled').prop('checked');
            Config.blockUserForumType = parseInt($('#pd_cfg_block_user_forum_type').val());
            Config.blockUserFidList = [];
            $.each($.trim($('#pd_cfg_block_user_fid_list').val()).split(','), function (i, fid) {
                fid = parseInt($.trim(fid));
                if (!isNaN(fid) && fid > 0) Config.blockUserFidList.push(fid);
            });
            Config.blockUserList = [];
            $blockUserList.find('li').each(function () {
                var $this = $(this);
                var name = $.trim($this.find('input[type="text"]').val());
                if (name !== '' && Tools.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                    var type = parseInt($this.find('select').val());
                    Config.blockUserList.push({name: name, type: type});
                }
            });
            ConfigMethod.write();
            Dialog.close('pd_block_user');
        }).end().find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_block_user');
        });

        $('#pd_cfg_block_user_default_type').val(Config.blockUserDefaultType);
        $('#pd_cfg_block_user_at_tips_enabled').prop('checked', Config.blockUserAtTipsEnabled);
        $('#pd_cfg_block_user_forum_type').val(Config.blockUserForumType);
        $('#pd_cfg_block_user_fid_list').val(Config.blockUserFidList.join(','));

        /**
         * 添加屏蔽用户
         * @param {string} name 用户名
         * @param {number} type 屏蔽类型
         */
        var addBlockUser = function (name, type) {
            $(
                ('<li><input type="checkbox" /><input type="text" style="width:150px;margin-left:5px" maxlength="15" value="{0}" />' +
                '<select style="margin-left:5px"><option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option>' +
                '<option value="2">仅屏蔽回帖</option></select><a style="margin-left:7px" href="#">删除</a></li>')
                    .replace('{0}', name)
            ).appendTo($blockUserList)
                .find('select').val(type);
        };

        for (var i in Config.blockUserList) {
            addBlockUser(Config.blockUserList[i].name, Config.blockUserList[i].type);
        }

        $blockUserList.on('click', 'a', function (e) {
            e.preventDefault();
            $(this).parent().remove();
        });

        $('#pd_cfg_block_user_btns').find('a:first')
            .click(function (e) {
                e.preventDefault();
                $blockUserList.find('input[type="checkbox"]').prop('checked', true);
            })
            .end()
            .find('a:eq(1)')
            .click(function (e) {
                e.preventDefault();
                $blockUserList.find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            })
            .end()
            .find('a:eq(2)')
            .click(function (e) {
                e.preventDefault();
                var value = $(this).next('select').val();
                $blockUserList.find('li:has(input[type="checkbox"]:checked) > select').val(value);
            })
            .end()
            .find('a:last')
            .click(function (e) {
                e.preventDefault();
                var $checked = $blockUserList.find('li:has(input[type="checkbox"]:checked)');
                if ($checked.length === 0) return;
                if (confirm('是否删除所选用户？')) {
                    $checked.remove();
                    Dialog.show('pd_block_user');
                }
            });

        $dialog.find('#pd_cfg_add_block_user').keydown(function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                $(this).next('a').click();
            }
        }).next('a').click(function (e) {
            e.preventDefault();
            var users = $.trim($('#pd_cfg_add_block_user').val()).split(',');
            var type = parseInt($('#pd_cfg_block_user_default_type').val());
            if (!users || $.trim(users[0]) === '') return;
            for (var i in users) {
                var name = $.trim(users[i]);
                if (name === '') continue;
                if (Tools.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                    addBlockUser(name, type);
                }
            }
            $('#pd_cfg_add_block_user').val('');
            Dialog.show('pd_block_user');
        });

        $dialog.find('#pd_cfg_block_user_forum_type').change(function () {
            $('#pd_cfg_block_user_fid_list').prop('disabled', parseInt($(this).val()) === 0);
        }).end().find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCommonImportOrExportConfigDialog(2);
        });

        Dialog.show('pd_block_user');
        $('#pd_cfg_block_user_forum_type').triggerHandler('change');
        $('#pd_cfg_block_user_default_type').focus();
    },

    /**
     * 显示屏蔽帖子对话框
     */
    showBlockThreadDialog: function () {
        if ($('#pd_block_thread').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="border-bottom:1px solid #9191FF;margin-bottom:7px;padding-bottom:5px">' +
            '    标题关键字可使用普通字符串或正则表达式，正则表达式请使用/abc/的格式，例：/关键字A.*关键字B/i<br />' +
            '    用户名和版块ID为可选项（多个用户名或版块ID请用英文逗号分隔）<br />' +
            '    <label>默认版块屏蔽范围<select id="pd_cfg_block_thread_def_forum_type"><option value="0">所有版块</option><option value="1">包括指定版块</option>' +
            '<option value="2">排除指定版块</option></select></label>' +
            '    <label style="margin-left:5px">默认版块ID列表<input id="pd_cfg_block_thread_def_fid_list" type="text" style="width:150px" /></label>' +
            '  </div>' +
            '  <table id="pd_cfg_block_thread_list" style="line-height:22px;text-align:center">' +
            '    <tbody>' +
            '      <tr>' +
            '        <th style="width:220px">标题关键字(必填)</th>' +
            '        <th style="width:62px">屏蔽用户</th>' +
            '        <th style="width:200px">用户名 <span class="pd_cfg_tips" title="多个用户名请用英文逗号分隔">[?]</span></th>' +
            '        <th style="width:62px">屏蔽范围</th>' +
            '        <th style="width:132px">版块ID <span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span></th>' +
            '        <th style="width:35px"></th>' +
            '      </tr>' +
            '    </tbody>' +
            '  </table>' +
            '  <div style="margin-top:5px" id="pd_cfg_block_thread_add_btns"><a href="#">增加1个</a><a href="#" style="margin-left:7px">增加5个</a>' +
            '<a href="#" style="margin-left:7px">清除所有</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出屏蔽帖子</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_block_thread', '屏蔽帖子', html, 'width:768px');
        var $blockThreadList = $dialog.find('#pd_cfg_block_thread_list');

        /**
         * 验证设置是否正确
         * @returns {boolean} 是否验证通过
         */
        var verify = function () {
            var flag = true;
            $blockThreadList.find('tr:gt(0)').each(function () {
                var $this = $(this);
                var $txtKeyWord = $this.find('td:first-child > input');
                var keyWord = $txtKeyWord.val();
                if ($.trim(keyWord) === '') return;
                if (/^\/.+\/[gimy]*$/.test(keyWord)) {
                    try {
                        eval(keyWord);
                    }
                    catch (ex) {
                        alert('正则表达式不正确');
                        $txtKeyWord.select();
                        $txtKeyWord.focus();
                        flag = false;
                        return false;
                    }
                }
            });
            return flag;
        };

        $dialog.submit(function (e) {
            e.preventDefault();
            $dialog.find('.pd_cfg_btns > button:first').click();
        }).find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!verify()) return;
            Config.blockThreadDefForumType = parseInt($('#pd_cfg_block_thread_def_forum_type').val());
            Config.blockThreadDefFidList = [];
            $.each($.trim($('#pd_cfg_block_thread_def_fid_list').val()).split(','), function (i, fid) {
                fid = parseInt($.trim(fid));
                if (!isNaN(fid) && fid > 0) Config.blockThreadDefFidList.push(fid);
            });
            Config.blockThreadList = [];
            $blockThreadList.find('tr:gt(0)').each(function () {
                var $this = $(this);
                var keyWord = $this.find('td:first-child > input').val();
                if ($.trim(keyWord) === '') return;
                var newObj = {keyWord: keyWord};

                var userType = parseInt($this.find('td:nth-child(2) > select').val());
                if (userType > 0) {
                    var userList = [];
                    $.each($.trim($this.find('td:nth-child(3) > input').val()).split(','), function (i, user) {
                        user = $.trim(user);
                        if (user) userList.push(user);
                    });
                    if (userList.length > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = userList;
                }

                var fidType = parseInt($this.find('td:nth-child(4) > select').val());
                if (fidType > 0) {
                    var fidList = [];
                    $.each($.trim($this.find('td:nth-child(5) > input').val()).split(','), function (i, fid) {
                        fid = parseInt($.trim(fid));
                        if (!isNaN(fid) && fid > 0) fidList.push(fid);
                    });
                    if (fidList.length > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = fidList;
                }
                Config.blockThreadList.push(newObj);
            });
            ConfigMethod.write();
            Dialog.close('pd_block_thread');
        }).end().find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_block_thread');
        });

        $blockThreadList.on('change', 'select', function () {
            var $this = $(this);
            $this.parent('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
        }).on('click', 'td > a', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
        });

        /**
         * 添加屏蔽帖子
         * @param {string} keyWord 标题关键字
         * @param {number} userType 屏蔽用户，0：所有；1：包括；2：排除
         * @param {string[]} userList 用户名
         * @param {number} fidType 屏蔽范围，0：所有；1：包括；2：排除
         * @param {number[]} fidList 版块ID列表
         */
        var addBlockThread = function (keyWord, userType, userList, fidType, fidList) {
            $(
                ('<tr>' +
                '  <td><input type="text" style="width:208px" value="{0}" /></td>' +
                '  <td><select><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>' +
                '  <td><input type="text" style="width:188px" value="{1}" {2} /></td>' +
                '  <td><select><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>' +
                '  <td><input type="text" style="width:120px" value="{3}" {4} /></td>' +
                '  <td><a href="#">删除</a></td>' +
                '</tr>')
                    .replace('{0}', keyWord)
                    .replace('{1}', userList.join(','))
                    .replace('{2}', userType === 0 ? 'disabled="disabled"' : '')
                    .replace('{3}', fidList.join(','))
                    .replace('{4}', fidType === 0 ? 'disabled="disabled"' : '')
            ).appendTo($blockThreadList)
                .find('td:nth-child(2) > select').val(userType)
                .end().find('td:nth-child(4) > select').val(fidType);
        };

        for (var i in Config.blockThreadList) {
            var userType = 0;
            var userList = [];
            if (typeof Config.blockThreadList[i].includeUser !== 'undefined') {
                userType = 1;
                userList = Config.blockThreadList[i].includeUser;
            }
            else if (typeof Config.blockThreadList[i].excludeUser !== 'undefined') {
                userType = 2;
                userList = Config.blockThreadList[i].excludeUser;
            }

            var fidType = 0;
            var fidList = [];
            if (typeof Config.blockThreadList[i].includeFid !== 'undefined') {
                fidType = 1;
                fidList = Config.blockThreadList[i].includeFid;
            }
            else if (typeof Config.blockThreadList[i].excludeFid !== 'undefined') {
                fidType = 2;
                fidList = Config.blockThreadList[i].excludeFid;
            }
            addBlockThread(Config.blockThreadList[i].keyWord, userType, userList, fidType, fidList);
        }

        $('#pd_cfg_block_thread_add_btns').find('a:lt(2)').click(function (e) {
            e.preventDefault();
            var num = 1;
            if ($(this).is('#pd_cfg_block_thread_add_btns > a:eq(1)')) num = 5;
            for (var i = 1; i <= num; i++) {
                addBlockThread('', 0, [], parseInt($('#pd_cfg_block_thread_def_forum_type').val()), $.trim($('#pd_cfg_block_thread_def_fid_list').val()).split(','));
            }
            Dialog.show('pd_block_thread');
        }).end().find('a:last').click(function (e) {
            e.preventDefault();
            if (confirm('是否清除所有屏蔽关键字？')) {
                $blockThreadList.find('tbody > tr:gt(0)').remove();
                Dialog.show('pd_block_thread');
            }
        });

        $dialog.find('#pd_cfg_block_thread_def_forum_type').change(function () {
            $('#pd_cfg_block_thread_def_fid_list').prop('disabled', parseInt($(this).val()) === 0);
        }).end().find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCommonImportOrExportConfigDialog(3);
        });

        Dialog.show('pd_block_thread');
        $('#pd_cfg_block_thread_def_forum_type').val(Config.blockThreadDefForumType).focus().triggerHandler('change');
        $('#pd_cfg_block_thread_def_fid_list').val(Config.blockThreadDefFidList.join(','));
    },

    /**
     * 显示通用的导入/导出设置对话框
     * @param {number} type 1：关注用户；2：屏蔽用户；3：屏蔽帖子
     */
    showCommonImportOrExportConfigDialog: function (type) {
        if ($('#pd_common_im_or_ex_config').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_common_config" style="width:420px;height:200px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var title = '关注用户';
        if (type === 2) title = '屏蔽用户';
        else if (type === 3) title = '屏蔽帖子';
        var $dialog = Dialog.create('pd_common_im_or_ex_config', '导入或导出{0}'.replace('{0}', title), html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_common_config').val());
            if (!options) return;
            try {
                options = JSON.parse(options);
            }
            catch (ex) {
                alert('设置有错误');
                return;
            }
            if (!options || $.type(options) !== 'array') {
                alert('设置有错误');
                return;
            }
            if (type === 2) Config.blockUserList = options;
            else if (type === 3) Config.blockThreadList = options;
            else Config.followUserList = options;
            ConfigMethod.write();
            alert('设置已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_common_im_or_ex_config');
        });
        Dialog.show('pd_common_im_or_ex_config');

        var options = Config.followUserList;
        if (type === 2) options = Config.blockUserList;
        else if (type === 3) options = Config.blockThreadList;
        $dialog.find('#pd_cfg_common_config').val(JSON.stringify(options)).select();
    }
};

/**
 * 日志类
 */
var Log = {
    // 保存日志的键值名称
    name: 'pd_log',
    // 日志对象
    log: {},

    /**
     * 读取日志
     */
    read: function () {
        Log.log = {};
        var log = null;
        if (storageType === 'Script' || storageType === 'Global') log = GM_getValue(Log.name + '_' + KFOL.uid);
        else log = localStorage.getItem(Log.name + '_' + KFOL.uid);
        if (!log) return;
        try {
            log = JSON.parse(log);
        }
        catch (ex) {
            return;
        }
        if (!log || $.type(log) !== 'object') return;
        Log.log = log;
        if (!Tools.getCookie(Const.checkOverdueLogCookieName)) Log.deleteOverdueLog();
    },

    /**
     * 写入日志
     */
    write: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_setValue(Log.name + '_' + KFOL.uid, JSON.stringify(Log.log));
        else localStorage.setItem(Log.name + '_' + KFOL.uid, JSON.stringify(Log.log));
    },

    /**
     * 清除日志
     */
    clear: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_deleteValue(Log.name + '_' + KFOL.uid);
        else localStorage.removeItem(Log.name + '_' + KFOL.uid);
    },

    /**
     * 删除过期日志
     */
    deleteOverdueLog: function () {
        var dateList = Tools.getObjectKeyList(Log.log, 1);
        var overdueDate = Tools.getDateString(Tools.getDate('-' + Config.logSaveDays + 'd'));
        var isDeleted = false;
        for (var i in dateList) {
            if (dateList[i] <= overdueDate) {
                delete Log.log[dateList[i]];
                isDeleted = true;
            }
            else break;
        }
        if (isDeleted) Log.write();
        Tools.setCookie(Const.checkOverdueLogCookieName, 1, Tools.getMidnightHourDate(1));
    },

    /**
     * 记录一条新日志
     * @param {string} type 日志类别
     * @param {string} action 行为
     * @param {{}} [options] 设置对象
     * @param {{}} [options.gain] 收获
     * @param {{}} [options.pay] 付出
     * @param {boolean} [options.notStat=false] 是否不参与统计
     */
    push: function (type, action, options) {
        var defaults = {
            time: 0,
            type: '',
            action: '',
            gain: {},
            pay: {},
            notStat: false
        };
        var settings = $.extend({}, defaults);
        if ($.type(options) === 'object') {
            $.extend(settings, options);
        }
        settings.type = type;
        settings.action = action;
        var date = new Date();
        settings.time = date.getTime();
        var today = Tools.getDateString(date);
        Log.read();
        if ($.type(Log.log[today]) !== 'array') Log.log[today] = [];
        Log.log[today].push(Tools.getDifferentValueOfObject(defaults, settings));
        Log.write();
    },

    /**
     * 显示日志对话框
     */
    show: function () {
        if ($('#pd_log').length > 0) return;
        Dialog.close('pd_config');
        ConfigMethod.read();
        Func.run('Log.show_before_');
        var html =
            '<div class="pd_cfg_main">' +
            '  <div class="pd_log_nav">' +
            '    <a class="pd_disabled_link" href="#">&lt;&lt;</a>' +
            '    <a style="padding:0 7px" class="pd_disabled_link" href="#">&lt;</a>' +
            '    <h2 class="pd_custom_tips">暂无日志</h2>' +
            '    <a style="padding:0 7px" class="pd_disabled_link" href="#">&gt;</a>' +
            '    <a class="pd_disabled_link" href="#">&gt;&gt;</a>' +
            '  </div>' +
            '  <fieldset>' +
            '    <legend>日志内容</legend>' +
            '    <div>' +
            '      <strong>排序方式：</strong>' +
            '      <label title="按时间顺序排序"><input type="radio" name="pd_log_sort_type" value="time" checked="checked" />按时间</label>' +
            '      <label title="按日志类别排序"><input type="radio" name="pd_log_sort_type" value="type" />按类别</label>' +
            '    </div>' +
            '    <div class="pd_stat" id="pd_log_content">暂无日志</div>' +
            '  </fieldset>' +
            '  <fieldset>' +
            '    <legend>统计结果</legend>' +
            '    <div>' +
            '      <strong>统计范围：</strong>' +
            '      <label title="显示当天的统计结果"><input type="radio" name="pd_log_stat_type" value="cur" checked="checked" />当天</label>' +
            '      <label title="显示距该日N天内的统计结果"><input type="radio" name="pd_log_stat_type" value="custom" /></label>' +
            '<label title="显示距该日N天内的统计结果"><input id="pd_log_stat_days" type="text" style="width:22px" maxlength="3" />天内</label>' +
            '      <label title="显示全部统计结果"><input type="radio" name="pd_log_stat_type" value="all" />全部</label>' +
            '    </div>' +
            '    <div class="pd_stat" id="pd_log_stat">暂无日志</div>' +
            '  </fieldset>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a id="pd_log_im_or_ex_log_dialog" href="#">导入/导出日志</a></span>' +
            '  <button>关闭</button><button>清除日志</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_log', 'KF Online助手日志', html);

        Log.read();
        var dateList = [];
        var curIndex = 0;
        if (!$.isEmptyObject(Log.log)) {
            dateList = Tools.getObjectKeyList(Log.log, 1);
            curIndex = dateList.length - 1;
            $dialog.find('.pd_log_nav h2').attr('title', '总共记录了{0}天的日志'.replace('{0}', dateList.length)).text(dateList[curIndex]);
            if (dateList.length > 1) {
                $dialog.find('.pd_log_nav > a:eq(0)').attr('title', dateList[0]).removeClass('pd_disabled_link');
                $dialog.find('.pd_log_nav > a:eq(1)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
            }
        }
        $dialog.find('.pd_log_nav a').click(function (e) {
            e.preventDefault();
            if ($(this).is('.pd_log_nav a:eq(0)')) {
                curIndex = 0;
            }
            else if ($(this).is('.pd_log_nav a:eq(1)')) {
                if (curIndex > 0) curIndex--;
                else return;
            }
            else if ($(this).is('.pd_log_nav a:eq(2)')) {
                if (curIndex < dateList.length - 1) curIndex++;
                else return;
            }
            else if ($(this).is('.pd_log_nav a:eq(3)')) {
                curIndex = dateList.length - 1;
            }
            $dialog.find('.pd_log_nav h2').text(dateList[curIndex]);
            Log.showLogContent(dateList[curIndex]);
            Log.showLogStat(dateList[curIndex]);
            if (curIndex > 0) {
                $dialog.find('.pd_log_nav > a:eq(0)').attr('title', dateList[0]).removeClass('pd_disabled_link');
                $dialog.find('.pd_log_nav > a:eq(1)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
            }
            else {
                $dialog.find('.pd_log_nav > a:lt(2)').removeAttr('title').addClass('pd_disabled_link');
            }
            if (curIndex < dateList.length - 1) {
                $dialog.find('.pd_log_nav > a:eq(2)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
                $dialog.find('.pd_log_nav > a:eq(3)').attr('title', dateList[dateList.length - 1]).removeClass('pd_disabled_link');
            }
            else {
                $dialog.find('.pd_log_nav > a:gt(1)').removeAttr('title').addClass('pd_disabled_link');
            }
        }).end().find('input[name="pd_log_sort_type"]').click(function () {
            var value = $(this).val();
            if (Config.logSortType !== value) {
                Config.logSortType = value;
                ConfigMethod.write();
                Log.showLogContent(dateList[curIndex]);
            }
        }).end().find('input[name="pd_log_stat_type"]').click(function () {
            var value = $(this).val();
            if (Config.logStatType !== value) {
                Config.logStatType = value;
                ConfigMethod.write();
                Log.showLogStat(dateList[curIndex]);
            }
        }).end().find('#pd_log_stat_days').keyup(function () {
            var days = parseInt($.trim($(this).val()));
            if (days > 0 && Config.logStatDays !== days) {
                Config.logStatDays = days;
                ConfigMethod.write();
                $('input[name="pd_log_stat_type"][value="custom"]:not(:checked)').click();
                Log.showLogStat(dateList[curIndex]);
            }
        }).end().find('input[name="pd_log_sort_type"][value="{0}"]'.replace('{0}', Config.logSortType)).click()
            .end().find('input[name="pd_log_stat_type"][value="{0}"]'.replace('{0}', Config.logStatType)).click()
            .end().find('#pd_log_stat_days').val(Config.logStatDays);

        $dialog.find('.pd_cfg_btns > button:first').click(function () {
            return Dialog.close('pd_log');
        }).next('button').click(function (e) {
            e.preventDefault();
            if (confirm('是否清除所有日志？')) {
                Log.clear();
                alert('日志已清除');
                location.reload();
            }
        });

        $('#pd_log_im_or_ex_log_dialog').click(function (e) {
            e.preventDefault();
            Log.showImportOrExportLogDialog();
        });

        Log.showLogContent(dateList[curIndex]);
        Log.showLogStat(dateList[curIndex]);

        if ($(window).height() <= 750) $dialog.find('#pd_log_content').css('height', '216px');
        Dialog.show('pd_log');
        $dialog.find('input:first').focus();
        Func.run('Log.show_after_');
    },

    /**
     * 显示指定日期的日志内容
     * @param {string} date 日志对象关键字
     */
    showLogContent: function (date) {
        if ($.type(Log.log[date]) !== 'array') return;
        $('#pd_log_content').html(Log.getLogContent(date, Config.logSortType))
            .parent().find('legend:first-child').text('日志内容 (共{0}项)'.replace('{0}', Log.log[date].length));
    },

    /**
     * 获取指定日期的日志内容
     * @param {string} date 日志对象关键字
     * @param {string} logSortType 日志内容的排序方式
     * @returns {string} 指定日期的日志内容
     */
    getLogContent: function (date, logSortType) {
        var logList = Log.log[date];
        if (logSortType === 'type') {
            var sortTypeList = ['捐款', '领取争夺奖励', '批量攻击', '试探攻击', '抽取神秘盒子', '抽取道具或卡片', '使用道具', '恢复道具', '循环使用道具', '将道具转换为能量',
                '将卡片转换为VIP时间', '购买道具', '统计道具购买价格', '出售道具', '神秘抽奖', '统计神秘抽奖结果', '神秘等级升级', '神秘系数排名变化', '批量转账', '购买帖子',
                '自动存款'];
            logList.sort(function (a, b) {
                return $.inArray(a.type, sortTypeList) > $.inArray(b.type, sortTypeList);
            });
        }
        else {
            logList.sort(function (a, b) {
                return a.time > b.time;
            });
        }

        var content = '', curType = '';
        $.each(logList, function (index, key) {
            if (typeof key.time === 'undefined' || typeof key.type === 'undefined' || typeof key.action === 'undefined') return;
            var d = new Date(key.time);
            if (logSortType === 'type') {
                if (curType !== key.type) {
                    content += '<h3>【{0}】</h3>'.replace('{0}', key.type);
                    curType = key.type;
                }
                content += '<p><b>{0}：</b>{1}'
                    .replace('{0}', Tools.getTimeString(d))
                    .replace('{1}', key.action.replace(/`([^`]+?)`/g, '<b style="color:#F00">$1</b>'));
            }
            else {
                content += '<p><b>{0} ({1})：</b>{2}'
                    .replace('{0}', Tools.getTimeString(d))
                    .replace('{1}', key.type)
                    .replace('{2}', key.action.replace(/`([^`]+?)`/g, '<b style="color:#F00">$1</b>'));
            }

            var stat = '';
            if ($.type(key.gain) === 'object' && !$.isEmptyObject(key.gain)) {
                stat += '，';
                for (var k in key.gain) {
                    if (k === 'item') {
                        for (var itemName in key.gain['item']) {
                            stat += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', key.gain['item'][itemName].toLocaleString());
                        }
                    }
                    else {
                        stat += '<i>{0}<em>+{1}</em></i> '.replace('{0}', k).replace('{1}', key.gain[k].toLocaleString());
                    }
                }
            }
            if ($.type(key.pay) === 'object' && !$.isEmptyObject(key.pay)) {
                if (!stat) stat += '，';
                for (var k in key.pay) {
                    if (k === 'item') {
                        for (var itemName in key.pay['item']) {
                            stat += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', itemName).replace('{1}', key.pay['item'][itemName].toLocaleString());
                        }
                    }
                    else {
                        stat += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', k).replace('{1}', key.pay[k].toLocaleString());
                    }
                }
            }

            content += stat + '</p>';
        });

        return content;
    },

    /**
     * 显示指定日期的日志统计结果
     * @param {string} date 日志对象关键字
     */
    showLogStat: function (date) {
        if ($.type(Log.log[date]) !== 'array') return;
        $('#pd_log_stat').html(Log.getLogStat(date, Config.logStatType));
    },

    /**
     * 获取指定日期的日志统计结果
     * @param {string} date 日志对象关键字
     * @param {string} logStatType 日志统计范围类型
     * @returns {string} 指定日期的日志统计结果
     */
    getLogStat: function (date, logStatType) {
        var log = {};

        if (logStatType === 'custom') {
            var dateList = Tools.getObjectKeyList(Log.log, 1);
            var minDate = new Date(date);
            minDate.setDate(minDate.getDate() - Config.logStatDays + 1);
            minDate = Tools.getDateString(minDate);
            for (var k in dateList) {
                if (dateList[k] >= minDate && dateList[k] <= date) {
                    log[dateList[k]] = Log.log[dateList[k]];
                }
            }
        }
        else if (logStatType === 'all') {
            log = Log.log;
        }
        else {
            log[date] = Log.log[date];
        }

        var income = {}, expense = {}, profit = {};
        var validItemNum = 0, highValidItemNum = 0, validItemStat = {}, invalidItemNum = 0, highInvalidItemNum = 0, invalidItemStat = {};
        var buyItemTotalNum = 0, buyItemTotalPrice = 0, totalBuyItemPricePercent = 0, minBuyItemPricePercent = 0,
            maxBuyItemPricePercent = 0, buyItemStat = {};
        var invalidKeyList = ['item', '夺取KFB', 'VIP小时', '神秘', '燃烧伤害', '命中', '闪避', '暴击比例', '暴击几率', '防御', '有效道具', '无效道具'];
        for (var d in log) {
            $.each(log[d], function (index, key) {
                if (key.notStat || typeof key.type === 'undefined') return;
                if ($.type(key.gain) === 'object') {
                    for (var k in key.gain) {
                        if ($.inArray(k, invalidKeyList) > -1) continue;
                        if (typeof income[k] === 'undefined') income[k] = key.gain[k];
                        else income[k] += key.gain[k];
                    }
                }
                if ($.type(key.pay) === 'object') {
                    for (var k in key.pay) {
                        if ($.inArray(k, invalidKeyList) > -1) continue;
                        if (typeof expense[k] === 'undefined') expense[k] = key.pay[k];
                        else expense[k] += key.pay[k];
                    }
                }
                if ((key.type === '使用道具' || key.type === '循环使用道具') && $.type(key.gain) === 'object') {
                    var matches = /【`Lv.(\d+)：(.+?)`】/.exec(key.action);
                    if (matches) {
                        var itemLevel = parseInt(matches[1]);
                        var itemName = matches[2];
                        if (key.gain['有效道具'] > 0) {
                            validItemNum += key.gain['有效道具'];
                            if (itemLevel >= 3) highValidItemNum += key.gain['有效道具'];
                            if (typeof validItemStat[itemName] === 'undefined') validItemStat[itemName] = 0;
                            validItemStat[itemName] += key.gain['有效道具'];
                        }
                        if (key.gain['无效道具'] > 0) {
                            invalidItemNum += key.gain['无效道具'];
                            if (itemLevel >= 3) highInvalidItemNum += key.gain['无效道具'];
                            if (typeof invalidItemStat[itemName] === 'undefined') invalidItemStat[itemName] = 0;
                            invalidItemStat[itemName] += key.gain['无效道具'];
                        }
                    }
                }
                else if (key.type === '统计道具购买价格' && $.type(key.pay) === 'object' && typeof key.pay['KFB'] !== 'undefined') {
                    var matches = /共有`(\d+)`个【`Lv.\d+：(.+?)`】道具统计成功，总计价格：`[^`]+?`，平均价格：`[^`]+?`\(`(\d+)%`\)，最低价格：`[^`]+?`\(`(\d+)%`\)，最高价格：`[^`]+?`\(`(\d+)%`\)/.exec(key.action);
                    if (matches) {
                        var itemNum = parseInt(matches[1]);
                        var itemName = matches[2];
                        if (typeof buyItemStat[itemName] === 'undefined') {
                            buyItemStat[itemName] = {
                                '道具数量': 0,
                                '总计价格': 0,
                                '总计价格比例': 0,
                                '最低价格比例': 0,
                                '最高价格比例': 0
                            };
                        }
                        buyItemTotalNum += itemNum;
                        buyItemStat[itemName]['道具数量'] += itemNum;
                        buyItemTotalPrice += Math.abs(key.pay['KFB']);
                        buyItemStat[itemName]['总计价格'] += Math.abs(key.pay['KFB']);
                        totalBuyItemPricePercent += parseInt(matches[3]) * itemNum;
                        buyItemStat[itemName]['总计价格比例'] += parseInt(matches[3]) * itemNum;
                        if (minBuyItemPricePercent <= 0 || parseInt(matches[4]) < minBuyItemPricePercent) minBuyItemPricePercent = parseInt(matches[4]);
                        if (parseInt(matches[5]) > maxBuyItemPricePercent) maxBuyItemPricePercent = parseInt(matches[5]);
                        if (buyItemStat[itemName]['最低价格比例'] <= 0 || parseInt(matches[4]) < buyItemStat[itemName]['最低价格比例'])
                            buyItemStat[itemName]['最低价格比例'] = parseInt(matches[4]);
                        if (parseInt(matches[5]) > buyItemStat[itemName]['最高价格比例']) buyItemStat[itemName]['最高价格比例'] = parseInt(matches[5]);
                    }
                }
            });
        }

        var content = '';
        var sortStatTypeList = ['KFB', '经验值', '能量', '贡献', '道具', '已使用道具', '卡片'];
        content += '<strong>收获：</strong>';
        $.each(Tools.getSortedObjectKeyList(sortStatTypeList, income), function (index, key) {
            profit[key] = income[key];
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', key).replace('{1}', income[key].toLocaleString());
        });
        content += '<br /><strong>付出：</strong>';
        $.each(Tools.getSortedObjectKeyList(sortStatTypeList, expense), function (index, key) {
            if (typeof profit[key] === 'undefined') profit[key] = expense[key];
            else profit[key] += expense[key];
            content += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', key).replace('{1}', expense[key].toLocaleString());
        });
        content += '<br /><strong>结余：</strong>';
        $.each(Tools.getSortedObjectKeyList(sortStatTypeList, profit), function (index, key) {
            content += '<i>{0}{1}</i> '.replace('{0}', key).replace('{1}', Tools.getStatFormatNumber(profit[key]));
        });

        content += '<div style="margin:5px 0;border-bottom:1px dashed #CCCCFF"></div>';

        var sortItemTypeList = ['零时迷子的碎片', '被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画',
            '十六夜同人漫画', '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药'];
        content += '\n<strong>有效道具统计：</strong><i>有效道具<span class="pd_stat_extra"><em>+{0}</em>(<em title="3级以上有效道具">+{1}</em>)</i></span> '
            .replace('{0}', validItemNum.toLocaleString())
            .replace('{1}', highValidItemNum.toLocaleString());
        $.each(Tools.getSortedObjectKeyList(sortItemTypeList, validItemStat), function (i, itemName) {
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', validItemStat[itemName].toLocaleString());
        });
        content += '<br /><strong>无效道具统计：</strong><i>无效道具<span class="pd_stat_extra"><em>+{0}</em>(<em title="3级以上无效道具">+{1}</em>)</i></span> '
            .replace('{0}', invalidItemNum.toLocaleString())
            .replace('{1}', highInvalidItemNum.toLocaleString());
        $.each(Tools.getSortedObjectKeyList(sortItemTypeList, invalidItemStat), function (i, itemName) {
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', invalidItemStat[itemName].toLocaleString());
        });

        var buyItemStatContent = '';
        var buyItemStatKeyList = Tools.getObjectKeyList(buyItemStat, 0);
        buyItemStatKeyList.sort(function (a, b) {
            return Item.getItemLevelByItemName(a) > Item.getItemLevelByItemName(b);
        });
        $.each(buyItemStatKeyList, function (index, key) {
            var item = buyItemStat[key];
            buyItemStatContent += '<i class="pd_custom_tips" title="总价：{0}，平均价格比例：{1}%，最低价格比例：{2}%，最高价格比例：{3}%">{4}<em>+{5}</em></i> '
                .replace('{0}', item['总计价格'].toLocaleString())
                .replace('{1}', item['道具数量'] > 0 ? Tools.getFixedNumberLocaleString(item['总计价格比例'] / item['道具数量'], 2) : 0)
                .replace('{2}', item['最低价格比例'])
                .replace('{3}', item['最高价格比例'])
                .replace('{4}', key)
                .replace('{5}', item['道具数量']);
        });
        content += ('<br /><strong>购买道具统计：</strong><i>道具<em>+{0}</em></i> <i>道具价格<span class="pd_stat_extra"><em title="道具总价">+{1}</em>' +
        '(<em title="平均价格比例">{2}%</em>|<em title="最低价格比例">{3}%</em>|<em title="最高价格比例">{4}%</em>)</span></i> {5}')
            .replace('{0}', buyItemTotalNum)
            .replace('{1}', buyItemTotalPrice.toLocaleString())
            .replace('{2}', buyItemTotalNum > 0 ? Tools.getFixedNumberLocaleString(totalBuyItemPricePercent / buyItemTotalNum, 2) : 0)
            .replace('{3}', minBuyItemPricePercent)
            .replace('{4}', maxBuyItemPricePercent)
            .replace('{5}', buyItemStatContent);

        return content;
    },

    /**
     * 显示导入或导出日志对话框
     */
    showImportOrExportLogDialog: function () {
        if ($('#pd_im_or_ex_log').length > 0) return;
        Log.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin-top:5px">' +
            '    <label style="color:#F00"><input type="radio" name="pd_im_or_ex_log_type" value="setting" checked="checked" /> 导入/导出日志</label>' +
            '    <label style="color:#00F"><input type="radio" name="pd_im_or_ex_log_type" value="text" /> 导出日志文本</label>' +
            '  </div>' +
            '  <div id="pd_im_or_ex_log_setting">' +
            '    <strong>导入日志：</strong>将日志内容粘贴到文本框中并点击合并或覆盖按钮即可<br />' +
            '    <strong>导出日志：</strong>复制文本框里的内容并粘贴到文本文件里即可<br />' +
            '    <textarea id="pd_log_setting" style="width:600px;height:400px;word-break:break-all"></textarea>' +
            '  </div>' +
            '  <div id="pd_im_or_ex_log_text" style="display:none">' +
            '    <strong>导出日志文本</strong>：复制文本框里的内容并粘贴到文本文件里即可' +
            '    <div>' +
            '      <label title="按时间顺序排序"><input type="radio" name="pd_log_sort_type_2" value="time" checked="checked" />按时间</label>' +
            '      <label title="按日志类别排序"><input type="radio" name="pd_log_sort_type_2" value="type" />按类别</label>' +
            '      <label title="在日志文本里显示每日以及全部数据的统计结果"><input type="checkbox" id="pd_log_show_stat" checked="checked" />显示统计</label>' +
            '    </div>' +
            '    <textarea id="pd_log_text" style="width:600px;height:400px" readonly="readonly"></textarea>' +
            '  </div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button data-action="merge">合并日志</button><button data-action="overwrite" style="color:#F00">覆盖日志</button><button>关闭</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_log', '导入或导出日志', html);
        $dialog.find('input[name="pd_log_sort_type_2"], #pd_log_show_stat').click(function () {
            Log.showLogText();
            $('#pd_log_text').select();
        }).end().find('input[name="pd_im_or_ex_log_type"]').click(function () {
            var type = $(this).val();
            $('#pd_im_or_ex_log_' + (type === 'text' ? 'setting' : 'text')).hide();
            $('#pd_im_or_ex_log_' + (type === 'text' ? 'text' : 'setting')).show();
            $('#pd_log_' + (type === 'text' ? 'text' : 'setting')).select();
        }).end().find('.pd_cfg_btns > button').click(function (e) {
            e.preventDefault();
            var action = $(this).data('action');
            if (action === 'merge' || action === 'overwrite') {
                if (!confirm('是否将文本框中的日志{0}到本地日志？'.replace('{0}', action === 'overwrite' ? '覆盖' : '合并'))) return;
                var log = $.trim($('#pd_log_setting').val());
                if (!log) return;
                try {
                    log = JSON.parse(log);
                }
                catch (ex) {
                    alert('日志有错误');
                    return;
                }
                if (!log || $.type(log) !== 'object') {
                    alert('日志有错误');
                    return;
                }
                if (action === 'merge') log = Log.getMergeLog(Log.log, log);
                Log.log = log;
                Log.write();
                alert('日志已导入');
                location.reload();
            }
            else {
                return Dialog.close('pd_im_or_ex_log');
            }
        });
        Dialog.show('pd_im_or_ex_log');
        $('#pd_log_setting').val(JSON.stringify(Log.log)).select();
        $('input[name="pd_log_sort_type_2"][value="{0}"]'.replace('{0}', Config.logSortType)).prop('checked', true).triggerHandler('click');
        Func.run('Log.showImportOrExportLogDialog_after_');
    },

    /**
     * 显示日志文本
     */
    showLogText: function () {
        var logSortType = $('input[name="pd_log_sort_type_2"]:checked').val();
        var isShowStat = $('#pd_log_show_stat').prop('checked');
        var content = '', lastDate = '';
        for (var date in Log.log) {
            if ($.type(Log.log[date]) !== 'array') continue;
            if (lastDate > date) lastDate = date;
            content +=
                '【{0}】(共{1}项)\n{2}'
                    .replace('{0}', date)
                    .replace('{1}', Log.log[date].length)
                    .replace('{2}', logSortType === 'type' ? '' : '\n') +
                Log.getLogContent(date, logSortType)
                    .replace(/<h3>/g, '\n')
                    .replace(/<\/h3>/g, '\n')
                    .replace(/<\/p>/g, '\n')
                    .replace(/(<.+?>|<\/.+?>)/g, '')
                    .replace(/`/g, '');
            if (isShowStat) {
                content +=
                    '----------------------------------------------\n' +
                    '合计：\n' +
                    Log.getLogStat(date, 'cur')
                        .replace(/<br\s*\/?>/g, '\n')
                        .replace(/(<.+?>|<\/.+?>)/g, '') +
                    '\n';
            }
            content += '==============================================\n';
        }
        if (content && isShowStat) {
            content +=
                '\n总计：\n' +
                Log.getLogStat(lastDate, 'all')
                    .replace(/<br \/>/g, '\n')
                    .replace(/(<.+?>|<\/.+?>)/g, '');
        }
        $('#pd_log_text').val(content);
    },

    /**
     * 获取合并后的日志
     * @param {{}} log 当前日志
     * @param {{}} newLog 新日志
     * @returns {{}} 合并后的日志
     */
    getMergeLog: function (log, newLog) {
        /**
         * 获取指定日志项目在指定日志项目列表中的索引号
         * @param {{}} item 指定日志项目
         * @param {[]} list 指定日志项目列表
         * @returns {number} 指定日志项目在列表中的索引号，-1表示不在该列表中
         */
        var inArray = function (item, list) {
            for (var i = 0; i < list.length; i++) {
                if (item['time'] === list[i]['time'] && item['type'] === list[i]['type']) return i;
            }
            return -1;
        };

        for (var date in newLog) {
            if ($.type(log[date]) !== 'array') {
                log[date] = newLog[date];
            }
            else {
                for (var i = 0; i < newLog[date].length; i++) {
                    if ($.type(newLog[date][i].time) !== 'number' || $.type(newLog[date][i].type) !== 'string') continue;
                    var index = inArray(newLog[date][i], log[date]);
                    if (index > -1) log[date][index] = newLog[date][i];
                    else log[date].push(newLog[date][i]);
                }
                log[date].sort(function (a, b) {
                    return a.time > b.time;
                });
            }
        }
        return log;
    }
};

/**
 * 临时日志类
 */
var TmpLog = {
    // 保存临时日志的键值名称
    name: 'pd_tmp_log',
    // 临时日志对象
    log: {},

    /**
     * 读取临时日志
     */
    read: function () {
        TmpLog.log = {};
        var log = null;
        if (storageType === 'Script' || storageType === 'Global') log = GM_getValue(TmpLog.name + '_' + KFOL.uid);
        else log = localStorage.getItem(TmpLog.name + '_' + KFOL.uid);
        if (!log) return;
        try {
            log = JSON.parse(log);
        }
        catch (ex) {
            return;
        }
        if (!log || $.type(log) !== 'object') return;
        var allowKey = [];
        for (var k in Const) {
            if (k.indexOf('TmpLogName') > -1) allowKey.push(Const[k]);
        }
        for (var k in log) {
            if ($.inArray(k, allowKey) === -1) delete log[k];
        }
        TmpLog.log = log;
    },

    /**
     * 写入临时日志
     */
    write: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_setValue(TmpLog.name + '_' + KFOL.uid, JSON.stringify(TmpLog.log));
        else localStorage.setItem(TmpLog.name + '_' + KFOL.uid, JSON.stringify(TmpLog.log));
    },

    /**
     * 清除临时日志
     */
    clear: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_deleteValue(TmpLog.name + '_' + KFOL.uid);
        else localStorage.removeItem(TmpLog.name + '_' + KFOL.uid);
    },

    /**
     * 获取指定名称的临时日志内容
     * @param {string} key 日志名称
     * @returns {*} 日志内容
     */
    getValue: function (key) {
        TmpLog.read();
        if (typeof TmpLog.log[key] !== 'undefined') return TmpLog.log[key];
        else return null;
    },

    /**
     * 设置指定名称的临时日志内容
     * @param {string} key 日志名称
     * @param {*} value 日志内容
     */
    setValue: function (key, value) {
        TmpLog.read();
        TmpLog.log[key] = value;
        TmpLog.write();
    },

    /**
     * 删除指定名称的临时日志
     * @param {string} key 日志名称
     */
    deleteValue: function (key) {
        TmpLog.read();
        if (typeof TmpLog.log[key] !== 'undefined') {
            delete TmpLog.log[key];
            TmpLog.write();
        }
    }
};

/**
 * 道具类
 */
var Item = {
    /**
     * 获得转换指定等级道具可获得的能量点
     * @param {number} itemLevel 道具等级
     * @returns {number} 能量点
     */
    getGainEnergyNumByItemLevel: function (itemLevel) {
        switch (itemLevel) {
            case 1:
                return 2;
            case 2:
                return 10;
            case 3:
                return 50;
            case 4:
                return 300;
            case 5:
                return 2000;
            default:
                return 0;
        }
    },

    /**
     * 获得恢复指定等级道具所需的能量点
     * @param {number} itemLevel 道具等级
     * @returns {number} 能量点
     */
    getRestoreEnergyNumByItemLevel: function (itemLevel) {
        switch (itemLevel) {
            case 1:
                return 10;
            case 2:
                return 50;
            case 3:
                return 300;
            case 4:
                return 2000;
            case 5:
                return 10000;
            default:
                return 0;
        }
    },

    /**
     * 获取指定等级道具的出售所得
     * @param {number} itemLevel 道具等级
     * @returns {number} 出售所得
     */
    getSellItemGainByItemLevel: function (itemLevel) {
        switch (itemLevel) {
            case 3:
                return 300;
            case 4:
                return 2000;
            case 5:
                return 10000;
            default:
                return 0;
        }
    },

    /**
     * 获取指定名称的道具种类ID
     * @param {string} itemName 道具名称
     * @returns {number} 道具种类ID
     */
    getItemTypeIdByItemName: function (itemName) {
        switch (itemName) {
            case '零时迷子的碎片':
                return 1;
            case '被遗弃的告白信':
                return 2;
            case '学校天台的钥匙':
                return 3;
            case 'TMA最新作压缩包':
                return 4;
            case 'LOLI的钱包':
                return 5;
            case '棒棒糖':
                return 6;
            case '蕾米莉亚同人漫画':
                return 11;
            case '十六夜同人漫画':
                return 7;
            case '档案室钥匙':
                return 8;
            case '傲娇LOLI娇蛮音CD':
                return 12;
            case '整形优惠卷':
                return 9;
            case '消逝之药':
                return 10;
            default:
                return 0;
        }
    },

    /**
     * 获取指定名称的道具等级
     * @param {string} itemName 道具名称
     * @returns {number} 道具等级
     */
    getItemLevelByItemName: function (itemName) {
        switch (itemName) {
            case '零时迷子的碎片':
            case '被遗弃的告白信':
            case '学校天台的钥匙':
            case 'TMA最新作压缩包':
                return 1;
            case 'LOLI的钱包':
            case '棒棒糖':
                return 2;
            case '蕾米莉亚同人漫画':
            case '十六夜同人漫画':
                return 3;
            case '档案室钥匙':
            case '傲娇LOLI娇蛮音CD':
                return 4;
            case '整形优惠卷':
            case '消逝之药':
                return 5;
            default:
                return 0;
        }
    },

    /**
     * 获取指定名称的道具使用上限个数
     * @param {string} itemName 道具名称
     * @returns {number} 道具的使用上限个数
     */
    getItemMaxUsedNumByItemName: function (itemName) {
        switch (itemName) {
            case '蕾米莉亚同人漫画':
            case '十六夜同人漫画':
                return 50;
            case '档案室钥匙':
            case '傲娇LOLI娇蛮音CD':
                return 30;
            case '整形优惠卷':
            case '消逝之药':
                return 10;
            default:
                return -1;
        }
    },

    /**
     * 从使用道具的回应消息中获取积分数据
     * @param {string} response 使用道具的回应消息
     * @param {number} itemTypeId 道具种类ID
     * @returns {Object|number} 积分对象，-1表示使用失败
     */
    getCreditsViaResponse: function (response, itemTypeId) {
        if (/(错误的物品编号|无法再使用|该道具已经被使用)/.test(response)) {
            return -1;
        }
        if (itemTypeId >= 7 && itemTypeId <= 12) {
            if (/成功！/.test(response)) return {'效果': 1};
        }
        else {
            var matches = null;
            matches = /恢复能量增加了\s*(\d+)\s*点/i.exec(response);
            if (matches) return {'能量': parseInt(matches[1])};
            matches = /(\d+)KFB/i.exec(response);
            if (matches) return {'KFB': parseInt(matches[1])};
            matches = /(\d+)点?贡献/i.exec(response);
            if (matches) return {'贡献': parseInt(matches[1])};
            matches = /贡献\+(\d+)/i.exec(response);
            if (matches) return {'贡献': parseInt(matches[1])};
        }
        return {};
    },

    /**
     * 获取本种类指定数量的道具ID列表
     * @param {string} html 道具列表页面的HTML代码
     * @param {number} [num] 指定道具数量（留空表示获取当前所有道具）
     * @returns {number[]} 道具ID列表
     */
    getItemIdList: function (html, num) {
        var itemIdList = [];
        var matches = html.match(/kf_fw_ig_my\.php\?pro=\d+/gi);
        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                if (num && i + 1 > num) break;
                var itemIdMatches = /pro=(\d+)/i.exec(matches[i]);
                if (itemIdMatches) itemIdList.push(parseInt(itemIdMatches[1]));
            }
        }
        return itemIdList;
    },

    /**
     * 使用指定的一系列道具
     * @param {{}} options 设置项
     * @param {number} options.type 使用类型，1：使用本种类指定数量的道具；2：使用本种类指定ID的道具
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {number} options.itemTypeId 道具种类ID
     * @param {string} options.itemName 道具名称
     * @param {jQuery} [options.$itemLine] 当前使用道具种类所在的表格行（用于使用类型1）
     * @param {boolean} [options.isTypeBatch=false] 是否批量使用不同种类的道具
     * @param {{}} [cycle] 循环使用道具的信息类
     * @param {number} cycle.itemNum 循环使用的道具数量
     * @param {number} cycle.round 当前循环的轮数
     * @param {number} cycle.totalEnergyNum 当前的道具恢复能量
     * @param {{}} cycle.countStat 循环使用道具的操作次数统计项
     * @param {{}} cycle.stat 循环使用道具的统计项
     * @param {number} cycle.maxEffectiveItemCount 有效道具使用次数上限（0表示不限制）
     * @param {number} cycle.maxSuccessRestoreItemCount 恢复道具成功次数上限（0表示不限制）
     */
    useItems: function (options, cycle) {
        var settings = {
            type: 1,
            itemIdList: [],
            safeId: '',
            itemLevel: 0,
            itemTypeId: 0,
            itemName: '',
            $itemLine: null,
            isTypeBatch: false
        };
        $.extend(settings, options);

        if (cycle) {
            if (cycle.round === 1) {
                console.log('循环使用道具Start，使用道具数量：{0}，有效道具使用次数上限：{1}，恢复道具成功次数上限：{2}'
                    .replace('{0}', cycle.itemNum)
                    .replace('{1}', cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制')
                    .replace('{2}', cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制')
                );
                $('.kf_fw_ig1:last').parent().append(
                    ('<ul class="pd_result"><li class="pd_stat"><strong>对<em>{0}</em>个【Lv.{1}：{2}】道具的循环使用开始（当前道具恢复能量<em>{3}</em>点）<br />' +
                    '（有效道具使用次数上限：<em>{4}</em>，恢复道具成功次数上限：<em>{5}</em>）</strong></li></ul>')
                        .replace('{0}', cycle.itemNum)
                        .replace('{1}', settings.itemLevel)
                        .replace('{2}', settings.itemName)
                        .replace('{3}', cycle.totalEnergyNum)
                        .replace('{4}', cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制')
                        .replace('{5}', cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制')
                );
            }
            else {
                $('.pd_result:last').append('<div class="pd_result_sep"></div>');
            }
            $('.pd_result:last').append('<li class="pd_stat" style="color:#FF3399"><strong>第{0}轮循环开始：</strong></li>'.replace('{0}', cycle.round));
        }
        if (cycle) {
            $('.pd_result:last').append('<li><strong>使用结果：</strong></li>');
        }
        else {
            $('.kf_fw_ig1:last').parent().append(
                '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】使用结果：</strong></li></ul>'
                    .replace('{0}', settings.itemLevel)
                    .replace('{1}', settings.itemName)
            );
        }

        var successNum = 0, failNum = 0;
        var stat = {'有效道具': 0, '无效道具': 0};
        var nextRoundItemIdList = [];
        var isStop = false;
        $(document).clearQueue('UseItems');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('UseItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_doit.php?id={0}&t={1}'.replace('{0}', itemId).replace('{1}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('使用道具', html);
                        var matches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                        if (matches && !/(错误的物品编号|无法再使用|该道具已经被使用)/.test(html)) {
                            successNum++;
                            nextRoundItemIdList.push(itemId);
                            var credits = Item.getCreditsViaResponse(matches[1], settings.itemTypeId);
                            if (credits !== -1) {
                                if ($.isEmptyObject(credits)) stat['无效道具']++;
                                else stat['有效道具']++;
                                if (settings.itemTypeId <= 6) {
                                    $.each(credits, function (key, credit) {
                                        if (typeof stat[key] === 'undefined')
                                            stat[key] = credit;
                                        else
                                            stat[key] += credit;
                                    });
                                }
                            }
                        }
                        else {
                            failNum++;
                            if (/无法再使用/.test(html)) nextRoundItemIdList = [];
                        }
                        $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'
                            .replace('{0}', index + 1)
                            .replace('{1}', matches ? matches[1] : '未能获得预期的回应')
                        );
                        if (cycle && cycle.maxEffectiveItemCount && cycle.stat['有效道具'] + stat['有效道具'] >= cycle.maxEffectiveItemCount) {
                            isStop = true;
                            console.log('有效道具使用次数到达设定上限，循环使用操作停止');
                            $('.pd_result:last').append('<li><span class="pd_notice">（有效道具使用次数到达设定上限，循环操作中止）</span></li>');
                        }
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) {
                            $(document).clearQueue('UseItems');
                            if (settings.isTypeBatch) $(document).clearQueue('UseItemTypes');
                        }

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (stat['有效道具'] === 0) delete stat['有效道具'];
                            if (stat['无效道具'] === 0) delete stat['无效道具'];
                            if (!cycle && successNum > 0) {
                                Log.push('使用道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具被使用'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {
                                        gain: $.extend({}, stat, {'已使用道具': successNum}),
                                        pay: {'道具': -successNum}
                                    }
                                );
                            }
                            var logStat = '', msgStat = '', resultStat = '';
                            for (var creditsType in stat) {
                                logStat += '，{0}+{1}'
                                    .replace('{0}', creditsType)
                                    .replace('{1}', stat[creditsType]);
                                msgStat += '<i>{0}<em>+{1}</em></i>'
                                    .replace('{0}', creditsType)
                                    .replace('{1}', stat[creditsType]);
                                resultStat += '<i>{0}<em>+{1}</em></i> '
                                    .replace('{0}', creditsType)
                                    .replace('{1}', stat[creditsType]);
                                if (cycle) {
                                    if (typeof cycle.stat[creditsType] === 'undefined') cycle.stat[creditsType] = stat[creditsType];
                                    else cycle.stat[creditsType] += stat[creditsType];
                                }
                            }
                            console.log('共有{0}个道具被使用{1}{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有{0}个道具未能使用'.replace('{0}', failNum) : '')
                                .replace('{2}', logStat)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具被使用{1}</strong>{2}'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具未能使用'.replace('{0}', failNum) : '')
                                    .replace('{2}', msgStat)
                                , -1);
                            if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                            $('.pd_result:last').append(
                                '<li class="pd_stat"><b>统计结果（共有<em>{0}</em>个道具被使用）：</b><br />{1}</li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', resultStat)
                            );

                            if (settings.type === 2) {
                                $('.kf_fw_ig1 input[type="checkbox"]:checked')
                                    .closest('tr')
                                    .fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                            }
                            else {
                                Item.setCurrentItemUsableAndUsedNum(settings.$itemLine, successNum, -successNum);
                                Item.showItemUsedInfo(settings.$itemLine.closest('tbody').find('tr:gt(1) > td:nth-child(2) > a'));
                            }
                            if (settings.itemName === '零时迷子的碎片') Item.showCurrentUsedItemNum();

                            if (cycle) {
                                settings.itemIdList = nextRoundItemIdList;
                                if (settings.itemIdList.length === 0) isStop = true;
                                cycle.countStat['被使用次数'] += successNum;
                                cycle.stat['道具'] -= successNum;
                                cycle.stat['已使用道具'] += successNum;
                                Item.cycleUseItems(isStop ? 0 : 2, settings, cycle);
                            }
                            else if (settings.isTypeBatch) {
                                $(document).dequeue('UseItemTypes');
                            }
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('UseItems');
                            }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('UseItems');
    },

    /**
     * 恢复指定的一系列道具
     * @param {{}} options 设置项
     * @param {number} options.type 恢复类型，1：恢复本种类指定数量的道具；2：恢复本种类指定ID的道具
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {number} options.itemTypeId 道具种类ID
     * @param {string} options.itemName 道具名称
     * @param {jQuery} [options.$itemLine] 当前恢复道具种类所在的表格行（用于恢复类型1）
     * @param {{}} [cycle] 循环使用道具的信息类
     * @param {number} cycle.itemNum 循环使用的道具数量
     * @param {number} cycle.round 当前循环的轮数
     * @param {number} cycle.totalEnergyNum 当前的道具恢复能量
     * @param {{}} cycle.countStat 循环使用道具的操作次数统计项
     * @param {{}} cycle.stat 循环使用道具的统计项
     * @param {number} cycle.maxEffectiveItemCount 有效道具使用次数上限（0表示不限制）
     * @param {number} cycle.maxSuccessRestoreItemCount 恢复道具成功次数上限（0表示不限制）
     */
    restoreItems: function (options, cycle) {
        var settings = {
            type: 1,
            itemIdList: [],
            safeId: '',
            itemLevel: 0,
            itemTypeId: 0,
            itemName: '',
            $itemLine: null
        };
        $.extend(settings, options);

        if (cycle) {
            $('.pd_result:last').append('<li class="pd_result_sep_inner"></li><li><strong>恢复结果：</strong></li>');
        }
        else {
            $('.kf_fw_ig1:last').parent().append(
                '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】恢复结果：</strong></li></ul>'
                    .replace('{0}', settings.itemLevel)
                    .replace('{1}', settings.itemName)
            );
        }

        var successNum = 0, failNum = 0, successEnergyNum = 0;
        var perEnergyNum = Item.getRestoreEnergyNumByItemLevel(settings.itemLevel);
        var isStop = false;
        var nextRoundItemIdList = [];
        $(document).clearQueue('RestoreItems');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('RestoreItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_doit.php?renew={0}&id={1}&t={2}'.replace('{0}', settings.safeId).replace('{1}', itemId).replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('恢复道具', html);
                        var msg = '';
                        var matches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                        if (matches) {
                            if (/该道具已经被恢复/.test(html)) {
                                msg = '该道具已经被恢复';
                                successNum++;
                                successEnergyNum += perEnergyNum;
                                nextRoundItemIdList.push(itemId);
                                if (cycle && cycle.maxSuccessRestoreItemCount && cycle.countStat['恢复成功次数'] + successNum >= cycle.maxSuccessRestoreItemCount) {
                                    isStop = true;
                                    msg += '<span class="pd_notice">（恢复道具成功次数已达到设定上限，恢复操作中止）</span>';
                                }
                            }
                            else if (/恢复失败/.test(html)) {
                                msg = '该道具恢复失败';
                                failNum++;
                            }
                            else if (/你的能量不足以恢复本道具/.test(html)) {
                                isStop = true;
                                msg = '你的能量不足以恢复本道具<span class="pd_notice">（恢复操作中止）</span>';
                            }
                            else {
                                msg = matches[1];
                            }
                        }
                        else {
                            msg = '未能获得预期的回应';
                        }
                        $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'
                            .replace('{0}', index + 1)
                            .replace('{1}', msg)
                        );
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('RestoreItems');

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (!cycle && (successNum > 0 || failNum > 0)) {
                                Log.push('恢复道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具恢复成功，共有`{3}`个道具恢复失败'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName)
                                        .replace('{3}', failNum),
                                    {
                                        gain: {'道具': successNum},
                                        pay: {'已使用道具': -(successNum + failNum), '能量': -successEnergyNum}
                                    }
                                );
                            }
                            console.log('共有{0}个道具恢复成功，共有{1}个道具恢复失败，能量-{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', successEnergyNum)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具恢复成功，共有<em>{1}</em>个道具恢复失败</strong><i>能量<ins>-{2}</ins></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum)
                                    .replace('{2}', successEnergyNum)
                                , -1);
                            $('.pd_result:last').append(
                                '<li class="pd_stat">共有<em>{0}</em>个道具恢复成功，共有<em>{1}</em>个道具恢复失败，<i>能量<ins>-{2}</ins></i></li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum)
                                    .replace('{2}', successEnergyNum)
                            );

                            if (settings.type === 2) {
                                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                    .closest('tr')
                                    .fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                            }
                            Item.setCurrentItemUsableAndUsedNum(settings.$itemLine, -(successNum + failNum), successNum, -successEnergyNum);

                            if (cycle) {
                                settings.itemIdList = nextRoundItemIdList;
                                if (settings.itemIdList.length === 0) isStop = true;
                                if (!isStop) cycle.round++;
                                cycle.totalEnergyNum -= successEnergyNum;
                                cycle.countStat['恢复成功次数'] += successNum;
                                cycle.countStat['恢复失败次数'] += failNum;
                                cycle.stat['能量'] -= successEnergyNum;
                                cycle.stat['道具'] += successNum;
                                cycle.stat['已使用道具'] -= successNum + failNum;
                                Item.cycleUseItems(isStop ? 0 : 1, settings, cycle);
                            }
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('RestoreItems');
                            }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('RestoreItems');
    },

    /**
     * 循环使用指定的一系列道具
     * @param {number} type 操作类型，1：批量使用道具；2：批量恢复道具；0：中止循环
     * @param {{}} options 设置项
     * @param {number} options.type 循环使用类型，1：循环使用本种类指定数量的道具；2：循环使用本种类指定ID的道具
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {number} options.itemTypeId 道具种类ID
     * @param {string} options.itemName 道具名称
     * @param {jQuery} [options.$itemLine] 当前使用道具种类所在的表格行（用于循环使用类型1）
     * @param {{}} cycle 循环使用道具的信息类
     * @param {number} cycle.itemNum 循环使用的道具数量
     * @param {number} cycle.round 当前循环的轮数
     * @param {number} cycle.totalEnergyNum 当前的道具恢复能量
     * @param {{}} cycle.countStat 循环使用道具的操作次数统计项
     * @param {{}} cycle.stat 循环使用道具的统计项
     * @param {number} cycle.maxEffectiveItemCount 有效道具使用次数上限（0表示不限制）
     * @param {number} cycle.maxSuccessRestoreItemCount 恢复道具成功次数上限（0表示不限制）
     */
    cycleUseItems: function (type, options, cycle) {
        if (!cycle.countStat || $.isEmptyObject(cycle.countStat)) {
            cycle.countStat = {
                '被使用次数': 0,
                '恢复成功次数': 0,
                '恢复失败次数': 0
            };
        }
        if (!cycle.stat || $.isEmptyObject(cycle.stat)) {
            cycle.stat = {
                '能量': 0,
                '道具': 0,
                '已使用道具': 0,
                '有效道具': 0,
                '无效道具': 0
            };
        }

        if ($('.pd_pop_tips').length >= 5) {
            KFOL.removePopTips($('.pd_pop_tips:first'));
        }

        var showResult = function (type, stat) {
            var resultStat = '';
            for (var key in stat) {
                if (type > 0 && (key === '道具' || key === '已使用道具')) continue;
                resultStat += '<i>{0}{1}</i> '.replace('{0}', key).replace('{1}', Tools.getStatFormatNumber(cycle.stat[key]));
            }
            $('.pd_result:last').append(
                ('<li class="pd_result_sep{0}"></li>' +
                '<li class="pd_stat"><strong>{1}（当前道具恢复能量<em>{2}</em>点）：</strong></li>' +
                '<li class="pd_stat">{3}<i>被使用次数<em>+{4}</em></i> <i>恢复成功次数<em>+{5}</em></i> <i>恢复失败次数<em>+{6}</em></i></li>' +
                '<li class="pd_stat">{7}</li>')
                    .replace('{0}', type > 0 ? '_inner' : '')
                    .replace('{1}', type > 0 ? '截至目前为止的统计' :
                        '【Lv.{0}：{1}】循环使用最终统计'.replace('{0}', options.itemLevel).replace('{1}', options.itemName)
                    )
                    .replace('{2}', cycle.totalEnergyNum)
                    .replace('{3}', type > 0 ? '' :
                        '共进行了<em>{0}</em>轮循环：'.replace('{0}', cycle.round)
                    )
                    .replace('{4}', cycle.countStat['被使用次数'])
                    .replace('{5}', cycle.countStat['恢复成功次数'])
                    .replace('{6}', cycle.countStat['恢复失败次数'])
                    .replace('{7}', resultStat)
            );
        };

        if (type === 1) {
            showResult(type, cycle.stat);
            KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', options.itemIdList.length)
                , true);
            setTimeout(function () {
                Item.useItems(options, cycle);
            }, cycle.round === 1 ? 500 : typeof Const.cycleUseItemsFirstAjaxInterval === 'function' ? Const.cycleUseItemsFirstAjaxInterval() : Const.cycleUseItemsFirstAjaxInterval);
        }
        else if (type === 2) {
            KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', options.itemIdList.length)
                , true);
            setTimeout(function () {
                Item.restoreItems(options, cycle);
            }, typeof Const.cycleUseItemsFirstAjaxInterval === 'function' ? Const.cycleUseItemsFirstAjaxInterval() : Const.cycleUseItemsFirstAjaxInterval);
        }
        else {
            if (cycle.stat['道具'] === 0) delete cycle.stat['道具'];
            if (cycle.stat['已使用道具'] === 0) delete cycle.stat['已使用道具'];
            if (cycle.stat['有效道具'] === 0) delete cycle.stat['有效道具'];
            if (cycle.stat['无效道具'] === 0) delete cycle.stat['无效道具'];
            var gain = {}, pay = {};
            for (var key in cycle.stat) {
                if (cycle.stat[key] > 0) gain[key] = cycle.stat[key];
                else pay[key] = cycle.stat[key];
            }

            if (cycle.countStat['被使用次数'] > 0) {
                Log.push('循环使用道具',
                    '对`{0}`个【`Lv.{1}：{2}`】道具进行了`{3}`轮循环使用(被使用次数`+{4}`，恢复成功次数`+{5}`，恢复失败次数`+{6}`)'
                        .replace('{0}', cycle.itemNum)
                        .replace('{1}', options.itemLevel)
                        .replace('{2}', options.itemName)
                        .replace('{3}', cycle.round)
                        .replace('{4}', cycle.countStat['被使用次数'])
                        .replace('{5}', cycle.countStat['恢复成功次数'])
                        .replace('{6}', cycle.countStat['恢复失败次数']),
                    {gain: gain, pay: pay}
                );
            }

            console.log('共进行了{0}轮循环，被使用次数+{1}，恢复成功次数+{2}，恢复失败次数+{3}，能量{4}'
                .replace('{0}', cycle.round)
                .replace('{1}', cycle.countStat['被使用次数'])
                .replace('{2}', cycle.countStat['恢复成功次数'])
                .replace('{3}', cycle.countStat['恢复失败次数'])
                .replace('{4}', cycle.stat['能量'])
            );
            var $tips = KFOL.showMsg(
                ('<strong>共进行了<em>{0}</em>轮循环</strong><i>被使用次数<em>+{1}</em></i><i>恢复成功次数<em>+{2}</em></i>' +
                '<i>恢复失败次数<em>+{3}</em></i><i>能量<ins>{4}</ins></i><a href="#">清除消息框</a>')
                    .replace('{0}', cycle.round)
                    .replace('{1}', cycle.countStat['被使用次数'])
                    .replace('{2}', cycle.countStat['恢复成功次数'])
                    .replace('{3}', cycle.countStat['恢复失败次数'])
                    .replace('{4}', cycle.stat['能量'])
                , -1);
            $tips.find('a').click(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
            });
            showResult(type, cycle.stat);
        }
    },

    /**
     * 转换指定的一系列道具为能量
     * @param {{}} options 设置项
     * @param {number} options.type 转换类型，1：转换本种类指定数量的道具为能量；2：转换本种类指定ID的道具为能量
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     * @param {jQuery} [options.$itemLine] 当前恢复道具种类所在的表格行（用于转换类型1）
     * @param {boolean} [options.isTypeBatch=false] 是否批量转换不同种类的道具
     */
    convertItemsToEnergy: function (options) {
        var settings = {
            type: 1,
            itemIdList: [],
            safeId: '',
            itemLevel: 0,
            itemName: '',
            $itemLine: null,
            isTypeBatch: false
        };
        $.extend(settings, options);
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】转换结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );

        var successNum = 0, failNum = 0;
        var energyNum = Item.getGainEnergyNumByItemLevel(settings.itemLevel);
        $(document).clearQueue('ConvertItemsToEnergy');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('ConvertItemsToEnergy', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_doit.php?tomp={0}&id={1}&t={2}'.replace('{0}', settings.safeId).replace('{1}', itemId).replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('将道具转换为能量', html);
                        if (/转换为了\s*\d+\s*点能量/i.test(html)) {
                            successNum++;
                        }
                        else failNum++;
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) {
                            $(document).clearQueue('ConvertItemsToEnergy');
                            if (settings.isTypeBatch) $(document).clearQueue('ConvertItemTypesToEnergy');
                        }

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            var successEnergyNum = successNum * energyNum;
                            if (successNum > 0) {
                                Log.push('将道具转换为能量',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具成功转换为能量'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {gain: {'能量': successEnergyNum}, pay: {'已使用道具': -successNum}}
                                );
                            }
                            console.log('共有{0}个道具成功转换为能量{1}，能量+{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有{0}个道具转换失败'.replace('{0}', failNum) : '')
                                .replace('{2}', successEnergyNum)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具成功转换为能量{1}</strong><i>能量<em>+{2}</em></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具转换失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', successEnergyNum)
                                , -1);
                            $('.pd_result:last').append(
                                '<li class="pd_stat">共有<em>{0}</em>个道具成功转换为能量{1}，<i>能量<em>+{2}</em></i></li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具转换失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', successEnergyNum)
                            );

                            if (settings.type === 2) {
                                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                    .closest('tr')
                                    .fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                            }
                            Item.setCurrentItemUsableAndUsedNum(settings.$itemLine, -successNum, null, successEnergyNum);
                            if (settings.isTypeBatch) $(document).dequeue('ConvertItemTypesToEnergy');
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('ConvertItemsToEnergy');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('ConvertItemsToEnergy');
    },

    /**
     * 出售指定的一系列道具
     * @param {{}} options 设置项
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     */
    sellItems: function (options) {
        var settings = {
            itemIdList: [],
            itemLevel: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】出售结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );

        var successNum = 0, failNum = 0, totalGain = 0;
        $(document).clearQueue('SellItems');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('SellItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_shop.php?sell=yes&id={0}&t={1}'.replace('{0}', itemId).replace('{1}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('出售道具', html);
                        if (/出售成功/.test(html)) {
                            successNum++;
                            totalGain += Item.getSellItemGainByItemLevel(settings.itemLevel);
                        }
                        else failNum++;
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('SellItems');

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('出售道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具出售成功'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {
                                        gain: {'KFB': totalGain},
                                        pay: {'道具': -successNum}
                                    }
                                );
                            }
                            $('.kf_fw_ig1 input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
                                    $(this).remove();
                                });
                            console.log('共有{0}个道具出售成功，共有{1}个道具出售失败，KFB+{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', totalGain)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具出售成功{1}</strong><i>KFB<em>+{2}</em></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具出售失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', totalGain)
                                , -1);
                            $('.pd_result:last').append(
                                '<li class="pd_stat">共有<em>{0}</em>个道具出售成功{1}，<i>KFB<em>+{2}</em></i></li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具出售失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', totalGain)
                            );
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('SellItems');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('SellItems');
    },

    /**
     * 在道具列表页面上添加批量出售和使用道具的按钮
     */
    addSellAndUseItemsButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        var $lastLine = $('.kf_fw_ig1 > tbody > tr:last-child');
        var itemName = $lastLine.find('td:first-child').text();
        if (!itemName) return;
        var matches = /(\d+)级道具/.exec($lastLine.find('td:nth-child(2)').text());
        if (!matches) return;
        var itemLevel = parseInt(matches[1]);
        var itemTypeId = parseInt(Tools.getUrlParam('lv'));
        if (!itemTypeId) return;
        $('.kf_fw_ig1 > tbody > tr > td:last-child').each(function () {
            var matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
            if (!matches) return;
            $(this).css('width', '163')
                .parent()
                .append('<td style="width:20px;padding-right:5px"><input class="pd_input" type="checkbox" value="{0}" /></td>'
                    .replace('{0}', matches[1])
                );
        });
        $('.kf_fw_ig1 > tbody > tr:lt(2)').find('td').attr('colspan', 5);
        $('<div class="pd_item_btns"><button title="批量使用指定道具">使用道具</button><button>全选</button><button>反选</button></div>')
            .insertAfter('.kf_fw_ig1')
            .find('button:first-child')
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!confirm('共选择了{0}个道具，是否批量使用道具？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.useItems({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName
                });
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1 input[type="checkbox"]').prop('checked', true);
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1 input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            });
        if (itemTypeId > 1) {
            $('<button style="color:#00F" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</button>').prependTo('.pd_item_btns').click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                var value = prompt(
                    '你要循环使用多少个道具？\n（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[上限设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）'
                    , itemIdList.length);
                if (value === null) return;
                value = $.trim(value);
                if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                    alert('格式不正确');
                    return;
                }
                var arr = value.split('|');
                var num = 0, maxEffectiveItemCount = 0, maxSuccessRestoreItemCount = 0;
                num = parseInt(arr[0]);
                if (!num) return;
                if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
                if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
                KFOL.removePopTips($('.pd_pop_tips'));

                if (num > itemIdList.length) num = itemIdList.length;
                var tmpItemIdList = [];
                for (var i = 0; i < num; i++) {
                    tmpItemIdList.push(itemIdList[i]);
                }
                itemIdList = tmpItemIdList;
                KFOL.showWaitMsg('正在获取当前道具相关信息，请稍后...', true);
                $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var totalEnergyNum = Item.getCurrentEnergyNum(html);
                    Item.showCurrentUsedItemNum(html);
                    Item.cycleUseItems(1, {
                        type: 2,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName
                    }, {
                        itemNum: itemIdList.length,
                        round: 1,
                        totalEnergyNum: totalEnergyNum,
                        countStat: {},
                        stat: {},
                        maxEffectiveItemCount: maxEffectiveItemCount,
                        maxSuccessRestoreItemCount: maxSuccessRestoreItemCount
                    });
                }, 'html');
            });
        }
        if (itemTypeId >= 7 && itemTypeId <= 12) {
            $('<button style="color:#F00" title="批量出售指定道具">出售道具</button>').prependTo('.pd_item_btns').click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!confirm('共选择了{0}个道具，是否批量出售道具？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在出售道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.sellItems({
                    itemIdList: itemIdList,
                    itemLevel: itemLevel,
                    itemName: itemName
                });
            });
        }
        Item.showCurrentUsedItemNum();
    },

    /**
     * 在已使用道具列表页面上添加批量转换能量和恢复道具的按钮
     */
    addConvertEnergyAndRestoreItemsButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        var $lastLine = $('.kf_fw_ig1:eq(1) > tbody > tr:last-child');
        var itemName = $lastLine.find('td:first-child').text();
        if (!itemName) return;
        var matches = /(\d+)级道具/.exec($lastLine.find('td:nth-child(2)').text());
        if (!matches) return;
        var itemLevel = parseInt(matches[1]);
        var itemTypeId = parseInt(Tools.getUrlParam('lv'));
        if (!itemTypeId) return;
        $('.kf_fw_ig1:eq(1) > tbody > tr > td:last-child').each(function () {
            var matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
            if (!matches) return;
            $(this).css('width', '500')
                .parent()
                .append('<td style="width:20px;padding-right:5px"><input class="pd_input" type="checkbox" value="{0}" /></td>'
                    .replace('{0}', matches[1])
                );
        });
        $('<div class="pd_item_btns"><button class="pd_highlight" title="批量将指定道具转换为能量">转换能量</button>' +
            '<button title="批量恢复指定道具">恢复道具</button><button>全选</button><button>反选</button></div>')
            .insertAfter('.kf_fw_ig1:eq(1)')
            .find('button:first-child')
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!confirm('共选择了{0}个道具，是否转换为能量？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.convertItemsToEnergy({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemName: itemName
                });
            })
            .next()
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                var totalRequiredEnergyNum = itemIdList.length * Item.getRestoreEnergyNumByItemLevel(itemLevel);
                if (!confirm('共选择了{0}个道具，共需要{1}点恢复能量，是否恢复道具？'
                        .replace('{0}', itemIdList.length)
                        .replace('{1}', totalRequiredEnergyNum)
                    )
                ) return;
                var totalEnergyNum = parseInt($('.kf_fw_ig1 td:contains("道具恢复能量")').find('span').text());
                if (!totalEnergyNum || totalEnergyNum < totalRequiredEnergyNum) {
                    alert('所需恢复能量不足');
                    return;
                }
                KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.restoreItems({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName
                });
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]').prop('checked', true);
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            });
    },

    /**
     * 在道具恢复页面上添加批量转换道具为能量和批量恢复道具的链接
     */
    addBatchConvertEnergyAndRestoreItemsLink: function () {
        var $myItems = $('.kf_fw_ig1:last');
        $myItems.find('tbody > tr').each(function (index) {
            var $this = $(this);
            if (index === 0) {
                $this.find('td').attr('colspan', 6);
            }
            else if (index === 1) {
                $this.find('td:nth-child(2)').attr('width', 200)
                    .next('td').attr('width', 100).wrapInner('<span class="pd_used_num pd_custom_tips" style="color:#000"></span>')
                    .next('td').attr('width', 130).text('批量恢复')
                    .next('td').attr('width', 160)
                    .before('<td width="160">批量转换</td>');
            }
            else {
                $this.find('td:nth-child(3)')
                    .wrapInner('<span class="pd_used_num pd_custom_tips"></span>')
                    .end()
                    .find('td:nth-child(4)')
                    .html('<a class="pd_items_batch_restore {0}" href="#" title="批量恢复指定数量的道具">批量恢复道具</a>'
                        .replace('{0}', index === 2 ? 'pd_disabled_link' : '')
                    )
                    .after('<td><a class="pd_items_batch_convert pd_highlight {0}" href="#" title="批量将指定数量的道具转换为能量">批量转换道具为能量</a></td>'
                        .replace('{0}', index === 2 ? 'pd_disabled_link' : '')
                    );
                var matches = /lv=(\d+)/i.exec($this.find('td:last-child').find('a').attr('href'));
                if (matches) $this.data('itemTypeId', parseInt(matches[1]));
            }
        });
        Item.bindItemActionLinksClick($myItems);

        var $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showUsedItemEnergyTips();
    },

    /**
     * 添加批量使用和转换指定种类的道具的按钮
     */
    addBatchUseAndConvertItemTypesButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        $('<div class="pd_item_btns"><button title="批量使用指定种类的道具" data-action="useItemTypes">批量使用</button>' +
            '<button class="pd_highlight" title="批量将指定种类的道具转换为能量" data-action="convertItemTypes">批量转换</button>' +
            '<button data-action="selectAll">全选</button><button data-action="selectInverse">反选</button></div>')
            .insertAfter('.pd_my_items')
            .on('click', 'button', function () {
                var action = $(this).data('action');
                if (action === 'useItemTypes' || action === 'convertItemTypes') {
                    var itemTypeList = [];
                    $('.pd_item_type_chk:checked').each(function () {
                        var $itemLine = $(this).closest('tr'),
                            itemLevel = parseInt($itemLine.find('td:first-child').text()),
                            itemTypeId = parseInt($itemLine.data('itemTypeId')),
                            itemName = $itemLine.find('td:nth-child(2) > a').text();
                        if (isNaN(itemTypeId) || itemTypeId <= 0) return;
                        if (action === 'convertItemTypes' && itemTypeId === 1) return;
                        var itemListUrl = $itemLine.find('td:last-child')
                                .find(action === 'useItemTypes' ? 'a:first-child' : 'a:last-child')
                                .attr('href') + '&t=' + new Date().getTime();
                        itemTypeList.push({
                            itemTypeId: itemTypeId,
                            itemLevel: itemLevel,
                            itemName: itemName,
                            $itemLine: $itemLine,
                            itemListUrl: itemListUrl
                        });
                    });
                    if (!itemTypeList.length) return;
                    var num = parseInt(prompt('在指定种类道具中你要' + (action === 'useItemTypes' ? '使用' : '转换') + '多少个道具？（0表示不限制）', 0));
                    if (isNaN(num) || num < 0) return;
                    KFOL.removePopTips($('.pd_pop_tips'));

                    var queueName = action === 'useItemTypes' ? 'UseItemTypes' : 'ConvertItemTypesToEnergy';
                    $(document).clearQueue(queueName);
                    $.each(itemTypeList, function (index, data) {
                        $(document).queue(queueName, function () {
                            var $tips = KFOL.showWaitMsg('正在获取本种类' + (action === 'useItemTypes' ? '未' : '已') + '使用道具列表，请稍后...', true);
                            $.ajax({
                                type: 'GET',
                                url: data.itemListUrl,
                                timeout: Const.defAjaxTimeout,
                                success: function (html) {
                                    KFOL.removePopTips($tips);
                                    var itemIdList = Item.getItemIdList(html, num);
                                    if (!itemIdList.length) {
                                        $(document).dequeue(queueName);
                                        return;
                                    }

                                    if (action === 'useItemTypes') {
                                        console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                                        KFOL.showWaitMsg(
                                            '<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                                                .replace('{0}', itemIdList.length)
                                            , true);
                                        Item.useItems({
                                            type: 1,
                                            itemIdList: itemIdList,
                                            safeId: safeId,
                                            itemLevel: data.itemLevel,
                                            itemTypeId: data.itemTypeId,
                                            itemName: data.itemName,
                                            $itemLine: data.$itemLine,
                                            isTypeBatch: true
                                        });
                                    }
                                    else {
                                        console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                                        KFOL.showWaitMsg(
                                            '<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                                                .replace('{0}', itemIdList.length)
                                            , true);
                                        Item.convertItemsToEnergy({
                                            type: 1,
                                            itemIdList: itemIdList,
                                            safeId: safeId,
                                            itemLevel: data.itemLevel,
                                            itemName: data.itemName,
                                            $itemLine: data.$itemLine,
                                            isTypeBatch: true
                                        });
                                    }
                                },
                                error: function () {
                                    KFOL.removePopTips($tips);
                                    $(document).dequeue(queueName);
                                }
                            });
                        });
                    });
                    $(document).dequeue(queueName);
                }
                else if (action === 'selectAll') {
                    $('.pd_item_type_chk').prop('checked', true);
                }
                else if (action === 'selectInverse') {
                    $('.pd_item_type_chk').each(function () {
                        $(this).prop('checked', !$(this).prop('checked'));
                    });
                }
            });
    },

    /**
     * 为我的道具页面中的道具操作链接绑定点击事件
     * @param {jQuery} $element 要绑定的容器元素
     */
    bindItemActionLinksClick: function ($element) {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        $element.on('click', 'a[href="#"]', function (e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.is('.pd_disabled_link')) return;
            var $itemLine = $this.closest('tr'),
                itemLevel = parseInt($itemLine.find('td:first-child').text()),
                itemTypeId = parseInt($itemLine.data('itemTypeId')),
                itemName = $itemLine.find('td:nth-child(2) > a').text(),
                itemUsableNum = parseInt($itemLine.find('td:nth-child(3) > .pd_usable_num').text()),
                itemUsedNum = parseInt($itemLine.find('td:nth-child(3) > .pd_used_num').text()),
                itemListUrl = '';
            if (isNaN(itemTypeId) || itemTypeId <= 0) return;

            if ($this.is('.pd_items_batch_use')) {
                var num = parseInt(
                    prompt('你要使用多少个【Lv.{0}：{1}】道具？（0表示不限制）'
                            .replace('{0}', itemLevel)
                            .replace('{1}', itemName)
                        , itemUsableNum ? itemUsableNum : 0)
                );
                if (isNaN(num) || num < 0) return;
                KFOL.removePopTips($('.pd_pop_tips'));

                KFOL.showWaitMsg('正在获取本种类未使用道具列表，请稍后...', true);
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有未使用的道具');
                        return;
                    }
                    console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', itemIdList.length)
                        , true);
                    Item.useItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                }, 'html');
            }
            else if ($this.is('.pd_items_cycle_use')) {
                var value = prompt(
                    ('你要循环使用多少个【Lv.{0}：{1}】道具？\n' +
                    '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）')
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                    , itemUsableNum ? itemUsableNum : 0);
                if (value === null) return;
                value = $.trim(value);
                if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                    alert('格式不正确');
                    return;
                }
                var arr = value.split('|');
                var num = 0, maxEffectiveItemCount = 0, maxSuccessRestoreItemCount = 0;
                num = parseInt(arr[0]);
                if (isNaN(num) || num < 0) return;
                if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
                if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
                KFOL.removePopTips($('.pd_pop_tips'));

                KFOL.showWaitMsg('正在获取本种类未使用道具列表，请稍后...', true);
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有未使用的道具');
                        return;
                    }
                    KFOL.showWaitMsg('正在获取当前道具相关信息，请稍后...', true);
                    $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
                        Item.showCurrentUsableItemNum(html);
                        $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            var totalEnergyNum = Item.getCurrentEnergyNum(html);
                            Item.showCurrentUsedItemNum(html);
                            Item.cycleUseItems(1, {
                                type: 1,
                                itemIdList: itemIdList,
                                safeId: safeId,
                                itemLevel: itemLevel,
                                itemTypeId: itemTypeId,
                                itemName: itemName,
                                $itemLine: $itemLine
                            }, {
                                itemNum: itemIdList.length,
                                round: 1,
                                totalEnergyNum: totalEnergyNum,
                                countStat: {},
                                stat: {},
                                maxEffectiveItemCount: maxEffectiveItemCount,
                                maxSuccessRestoreItemCount: maxSuccessRestoreItemCount
                            });
                        }, 'html');
                    }, 'html');
                }, 'html');
            }
            else if ($this.is('.pd_items_batch_restore')) {
                var num = parseInt(
                    prompt('你要恢复多少个【Lv.{0}：{1}】道具？（0表示不限制）'
                            .replace('{0}', itemLevel)
                            .replace('{1}', itemName)
                        , itemUsedNum ? itemUsedNum : 0)
                );
                if (isNaN(num) || num < 0) return;
                KFOL.removePopTips($('.pd_pop_tips'));

                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
                KFOL.showWaitMsg('正在获取本种类已使用道具列表，请稍后...', true);
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量恢复道具Start，恢复道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', itemIdList.length)
                        , true);
                    Item.restoreItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                }, 'html');
            }
            else if ($this.is('.pd_items_batch_convert')) {
                var num = parseInt(
                    prompt('你要将多少个【Lv.{0}：{1}】道具转换为能量？（0表示不限制）'
                            .replace('{0}', itemLevel)
                            .replace('{1}', itemName)
                        , itemUsedNum ? itemUsedNum : 0)
                );
                if (isNaN(num) || num < 0) return;
                KFOL.removePopTips($('.pd_pop_tips'));

                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
                KFOL.showWaitMsg('正在获取本种类已使用道具列表，请稍后...', true);
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', itemIdList.length)
                        , true);
                    Item.convertItemsToEnergy({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                }, 'html');
            }
        });
    },

    /**
     * 增强我的道具页面
     */
    enhanceMyItemsPage: function () {
        var $myItems = $('.kf_fw_ig1:last');
        $myItems.addClass('pd_my_items').find('tbody > tr').each(function (index) {
            var $this = $(this);
            if (index === 0) {
                $this.find('td').attr('colspan', 6);
            }
            else if (index === 1) {
                $this.find('td:first-child').css('width', '75px')
                    .end().find('td:nth-child(2)').css('width', '185px')
                    .end().find('td:nth-child(3)').css('width', '105px').html('<span class="pd_usable_num">可用数</span> / <span class="pd_used_num pd_custom_tips">已用数</span>')
                    .end().find('td:last-child').css('width', '165px')
                    .before('<td style="width:135px">使用道具</td><td style="width:135px">恢复道具 和 转换能量</td>');
            }
            else {
                $this.find('td:first-child').prepend('<input class="pd_input pd_item_type_chk" type="checkbox" />');
                $this.find('td:nth-child(3)')
                    .wrapInner('<span class="pd_usable_num" style="margin-left:5px"></span>')
                    .append(' / <span class="pd_used_num pd_custom_tips">?</span>')
                    .after(
                        ('<td><a class="pd_items_batch_use" href="#" title="批量使用指定数量的道具">批量使用</a>' +
                        '<a class="pd_items_cycle_use pd_highlight {0}" href="#" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</a></td>' +
                        '<td><a class="pd_items_batch_restore {0}" href="#" title="批量恢复指定数量的道具">批量恢复</a>' +
                        '<a class="pd_items_batch_convert pd_highlight {0}" href="#" title="批量将指定数量的道具转换为能量">批量转换</a></td>')
                            .replace(/\{0\}/g, index === 2 ? 'pd_disabled_link' : '')
                    );
                var $listLinkColumn = $this.find('td:last-child');
                var matches = /lv=(\d+)/i.exec($listLinkColumn.find('a').attr('href'));
                if (matches) {
                    var itemTypeId = parseInt(matches[1]);
                    $this.data('itemTypeId', itemTypeId);
                    $listLinkColumn.find('a').text('未使用列表')
                        .after('<a class="pd_highlight" href="kf_fw_ig_renew.php?lv={0}">已使用列表</a>'.replace('{0}', itemTypeId));
                }
            }
        });
        Item.bindItemActionLinksClick($myItems);

        var $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showCurrentUsedItemNum();
    },

    /**
     * 设定当前指定种类道具的未使用和已使用数量以及道具恢复能量
     * @param {?jQuery} $itemLine 当前道具所在的表格行
     * @param {?number} usedChangeNum 已使用道具的变化数量
     * @param {?number} [usableChangeNum] 未使用道具的变化数量
     * @param {?number} [energyChangeNum] 道具恢复能量的变化数量
     */
    setCurrentItemUsableAndUsedNum: function ($itemLine, usedChangeNum, usableChangeNum, energyChangeNum) {
        var flag = false;
        if ($itemLine) {
            var $itemUsed = $itemLine.find('td:nth-child(3) > .pd_used_num');
            var itemName = $itemLine.find('td:nth-child(2) > a').text();
            if ($itemUsed.length > 0 && itemName !== '零时迷子的碎片') {
                var num = parseInt($itemUsed.text());
                if (isNaN(num) || num + usedChangeNum < 0) {
                    flag = true;
                }
                else {
                    $itemUsed.text(num + usedChangeNum);
                    Item.showUsedItemEnergyTips();
                }
            }
            if (usableChangeNum) {
                var $itemUsable = $itemLine.find('td:nth-child(3) > .pd_usable_num');
                if ($itemUsable.length > 0) {
                    var num = parseInt($itemUsable.text());
                    if (isNaN(num) || num + usableChangeNum < 0) flag = true;
                    else $itemUsable.text(num + usableChangeNum);
                }
            }
        }
        if (energyChangeNum) {
            var $totalEnergy = $('.pd_total_energy_num');
            if (location.pathname === '/kf_fw_ig_renew.php')
                $totalEnergy = $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span');
            if ($totalEnergy.length > 0) {
                var num = parseInt($totalEnergy.text());
                if (isNaN(num) || num + energyChangeNum < 0) flag = true;
                else $totalEnergy.text(num + energyChangeNum);
            }
            else {
                flag = true;
            }
        }
        if (flag) {
            Item.showCurrentUsedItemNum();
            if (location.pathname === '/kf_fw_ig_my.php' && !Tools.getUrlParam('lv')) Item.showCurrentUsableItemNum();
        }
    },

    /**
     * 获取当前道具恢复能量
     * @param {string} html 恢复道具页面的HTML代码
     */
    getCurrentEnergyNum: function (html) {
        var energyNum = 0;
        var energyNumMatches = /道具恢复能量<br\s*\/><span.+?>(\d+)<\/span><br\s*\/>点/i.exec(html);
        if (energyNumMatches) energyNum = parseInt(energyNumMatches[1]);
        return energyNum;
    },

    /**
     * 显示已使用道具恢复所需和转换可得的能量的提示
     */
    showUsedItemEnergyTips: function () {
        var totalRestoreEnergy = 0, totalConvertEnergy = 0;
        $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_used_num').each(function () {
            var $this = $(this);
            var itemNum = parseInt($this.text());
            if (isNaN(itemNum) || itemNum < 0) return;
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var perRestoreEnergy = Item.getRestoreEnergyNumByItemLevel(itemLevel);
            var perConvertEnergy = Item.getGainEnergyNumByItemLevel(itemLevel);
            totalRestoreEnergy += perRestoreEnergy * itemNum;
            totalConvertEnergy += perConvertEnergy * itemNum;
            $this.attr('title', '全部恢复需要{0}点能量，全部转换可得{1}点能量'
                .replace('{0}', perRestoreEnergy * itemNum)
                .replace('{1}', perConvertEnergy * itemNum)
            );
        });
        $('.kf_fw_ig1:last > tbody > tr:nth-child(2) > td:nth-child(3) > .pd_used_num')
            .attr('title', '全部恢复需要{0}点能量，全部转换可得{1}点能量'
                .replace('{0}', totalRestoreEnergy)
                .replace('{1}', totalConvertEnergy)
            );
    },

    /**
     * 在我的道具页面中显示当前各种类已使用道具的数量
     * @param {string} [html] 恢复道具页面的HTML代码（留空表示自动获取HTML代码）
     */
    showCurrentUsedItemNum: function (html) {
        /**
         * 显示数量
         * @param {string} html 恢复道具页面的HTML代码
         */
        var show = function (html) {
            var energyNum = Item.getCurrentEnergyNum(html);
            var introMatches = /(1级道具转换得.+?点能量)。<br/.exec(html);
            if (location.pathname === '/kf_fw_ig_my.php') {
                $('.kf_fw_ig_title1:last').find('span:has(.pd_total_energy_num)').remove()
                    .end().append(
                    '<span class="pd_custom_tips" style="margin-left:7px" title="{0}">(道具恢复能量 <b class="pd_total_energy_num" style="font-size:14px">{1}</b> 点)</span>'
                        .replace('{0}', introMatches ? introMatches[1] : '')
                        .replace('{1}', energyNum)
                );
            }
            else {
                $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span').text(energyNum);
            }

            if ($('.pd_used_num').length > 0) {
                var matches = html.match(/">\d+<\/td><td>全部转换本级已使用道具为能量<\/td>/ig);
                if (matches) {
                    var usedItemNumList = [];
                    for (var i in matches) {
                        var usedItemNumMatches = /">(\d+)<\/td>/i.exec(matches[i]);
                        if (usedItemNumMatches) usedItemNumList.push(usedItemNumMatches[1]);
                    }
                    var $usedNum = $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_used_num');
                    if ($usedNum.length === matches.length) {
                        $usedNum.each(function (index) {
                            $(this).text(usedItemNumList[index]);
                        });
                        Item.showUsedItemEnergyTips();
                    }
                }
            }
        };

        if (html) {
            show(html);
        }
        else {
            $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                show(html);
            }, 'html');
        }
    },

    /**
     * 在我的道具页面中显示当前各种类可使用道具的数量
     * @param {string} [html] 我的道具页面的HTML代码（留空表示自动获取HTML代码）
     */
    showCurrentUsableItemNum: function (html) {
        /**
         * 显示数量
         * @param {string} html 我的道具页面的HTML代码
         */
        var show = function (html) {
            var matches = html.match(/">\d+<\/td><td><a href="kf_fw_ig_my\.php\?lv=/ig);
            if (!matches) return;
            var usableItemNumList = [];
            for (var i in matches) {
                var usableItemNumMatches = /">(\d+)<\/td>/i.exec(matches[i]);
                if (usableItemNumMatches) usableItemNumList.push(usableItemNumMatches[1]);
            }
            $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_usable_num').each(function (index) {
                $(this).text(usableItemNumList[index] ? usableItemNumList[index] : 0);
            });
        };

        if (html) {
            show(html);
        }
        else {
            $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
                show(html);
            }, 'html');
        }
    },

    /**
     * 获取道具使用情况
     * @param html 争夺首页的HTML代码
     * @returns {{}} 道具使用情况对象
     */
    getItemUsedInfo: function (html) {
        var itemUsedNumList = {
            '蕾米莉亚同人漫画': 0,
            '十六夜同人漫画': 0,
            '档案室钥匙': 0,
            '傲娇LOLI娇蛮音CD': 0,
            '消逝之药': 0,
            '整形优惠卷': 0
        };
        var matches = /道具：\[(蕾米莉亚同人漫画)：(\d+)]\[(十六夜同人漫画)：(\d+)]\[(档案室钥匙)：(\d+)]\[(傲娇LOLI娇蛮音CD)：(\d+)]\[(消逝之药)：(\d+)]\[(整形优惠卷)：(\d+)]/.exec(html);
        if (matches) {
            for (var i = 1; i < matches.length; i += 2) {
                itemUsedNumList[matches[i]] = parseInt(matches[i + 1]);
            }
        }
        return itemUsedNumList;
    },

    /**
     * 显示道具使用情况
     * @param {jQuery} $links 道具名称的链接列表
     */
    showItemUsedInfo: function ($links) {
        var tipsList = [
            '仅供参考', '←谁信谁傻逼', '←不管你信不信，反正我是信了', '要是失败了出门左转找XX风', '退KFOL保一生平安', '←这一切都是XX风的阴谋',
            '这样的几率大丈夫？大丈夫，萌大奶！', '玄不救非，氪不改命', '严重警告：此地的概率学已死', '←概率对非洲人是不适用的', '要相信RP守恒定律'
        ];
        $.get('kf_fw_ig_index.php?t=' + new Date().getTime(), function (html) {
            var itemUsedNumList = Item.getItemUsedInfo(html);
            $links.next('.pd_used_item_info').remove();
            $links.each(function () {
                var $this = $(this);
                var itemName = $this.text();
                if (typeof itemUsedNumList[itemName] === 'undefined') return;
                var usedNum = itemUsedNumList[itemName];
                var maxUsedNum = Item.getItemMaxUsedNumByItemName(itemName);
                var nextSuccessPercent = 0;
                if (usedNum > maxUsedNum) nextSuccessPercent = 0;
                else nextSuccessPercent = (1 - usedNum / maxUsedNum) * 100;
                var tips = '';
                if (usedNum < maxUsedNum && usedNum > 0) tips = '（' + tipsList[Math.floor(Math.random() * tipsList.length)] + '）';
                $this.after(
                    '<span class="pd_used_item_info" title="下个道具使用成功几率：{0}{4}">(<span style="{1}">{2}</span>/<span style="color:#F00">{3}</span>)</span>'
                        .replace('{0}', usedNum >= maxUsedNum ? '无' : nextSuccessPercent.toFixed(2) + '%')
                        .replace('{1}', usedNum >= maxUsedNum ? 'color:#F00' : '')
                        .replace('{2}', usedNum)
                        .replace('{3}', maxUsedNum)
                        .replace('{4}', tips)
                );
            });
        });
    },

    /**
     * 添加道具样品的链接
     * @param {jQuery} $nodes 道具名称的节点列表
     */
    addSampleItemsLink: function ($nodes) {
        $nodes.each(function () {
            var $this = $(this);
            var itemName = $.trim($this.text());
            var itemLevel = Item.getItemLevelByItemName(itemName);
            if (itemName && typeof Const.sampleItemIdList[itemName] !== 'undefined') {
                var title = '';
                if (itemName !== '零时迷子的碎片') {
                    title = '恢复此道具需{0}点能量，转换此道具可得{1}点能量'
                        .replace('{0}', Item.getRestoreEnergyNumByItemLevel(itemLevel))
                        .replace('{1}', Item.getGainEnergyNumByItemLevel(itemLevel));
                }
                else {
                    title = '此道具不可恢复和转换';
                }
                $this.html('<a href="kf_fw_ig_my.php?pro={0}&display=1" title="{1}">{2}</a>'
                    .replace('{0}', Const.sampleItemIdList[itemName])
                    .replace('{1}', title)
                    .replace('{2}', itemName)
                );
            }
        });
    },

    /**
     * 添加道具样品提示
     */
    addSampleItemTips: function () {
        var itemId = parseInt(Tools.getUrlParam('pro'));
        if (isNaN(itemId) || itemId <= 0) return;
        for (var itemName in Const.sampleItemIdList) {
            if (itemId === Const.sampleItemIdList[itemName]) {
                $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').find('span:first').after('<span class="pd_notice" style="margin-left:5px">(展示用样品)</span>');
                break;
            }
        }
    },

    /**
     * 购买指定种类的道具
     * @param {{}} options 设置项
     * @param {number} options.itemTypeId 指定的道具种类ID
     * @param {number} options.num 欲购买的道具数量
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     */
    buyItems: function (options) {
        var settings = {
            itemTypeId: 0,
            num: 0,
            safeId: '',
            itemLevel: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1').parent().append('<ul class="pd_result"><li><strong>【Lv.{0}：{1}】购买结果：</strong></li></ul>'
            .replace('{0}', settings.itemLevel)
            .replace('{1}', settings.itemName)
        );

        var successNum = 0, failNum = 0;
        var isStop = false;
        $(document).clearQueue('BatchBuyItems');
        $.each(new Array(settings.num), function (index) {
            $(document).queue('BatchBuyItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_shop.php?lvid={0}&safeid={1}&t={2}'
                        .replace('{0}', settings.itemTypeId)
                        .replace('{1}', settings.safeId)
                        .replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('购买道具', html);
                        var msg = '';
                        var matches = /<a href="kf_fw_ig_my\.php\?pro=(\d+)">/i.exec(html);
                        if (matches) {
                            successNum++;
                            msg = '获得了<a target="_blank" href="kf_fw_ig_my.php?pro={0}" data-id="{0}">一个道具</a>'.replace(/\{0\}/g, matches[1]);
                        }
                        else if (/你需要持有该道具两倍市场价的KFB/i.test(html)) {
                            msg = '你需要持有该道具两倍市场价的KFB<span class="pd_notice">（购买操作中止）</span>';
                            isStop = true;
                        }
                        else {
                            msg = '未能获得预期的回应';
                        }
                        $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'.replace('{0}', index + 1).replace('{1}', msg));
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('BatchBuyItems');

                        if (isStop || index === settings.num - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('购买道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具购买成功'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {gain: {'道具': successNum}}
                                );
                            }
                            console.log('共有{0}个【Lv.{1}：{2}】道具购买成功{3}'
                                .replace('{0}', successNum)
                                .replace('{1}', settings.itemLevel)
                                .replace('{2}', settings.itemName)
                                .replace('{3}', failNum > 0 ? '，共有{0}个道具购买失败'.replace('{0}', failNum) : '')
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个【<em>Lv.{1}</em>{2}】道具购买成功{3}</strong>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', settings.itemLevel)
                                    .replace('{2}', settings.itemName)
                                    .replace('{3}', failNum > 0 ? '，共有<em>{0}</em>个道具购买失败'.replace('{0}', failNum) : '')
                                , -1);

                            if (successNum > 0) {
                                $('<li><a href="#">统计购买价格</a></li>')
                                    .appendTo('.pd_result:last')
                                    .find('a')
                                    .click(function (e) {
                                        e.preventDefault();
                                        var $result = $(this).closest('.pd_result');
                                        $(this).parent().remove();
                                        KFOL.removePopTips($('.pd_pop_tips'));
                                        Item.statBuyItemsPrice($result, settings.itemLevel, settings.itemName);
                                    });
                                Item.showItemShopBuyInfo();
                            }
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('BatchBuyItems');
                            }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('BatchBuyItems');
    },

    /**
     * 统计批量购买道具的购买价格
     * @param {jQuery} $result 购买结果的jQuery对象
     * @param {number} itemLevel 道具等级
     * @param {string} itemName 道具名称
     */
    statBuyItemsPrice: function ($result, itemLevel, itemName) {
        var successNum = 0, failNum = 0, totalPrice = 0, minPrice = 0, maxPrice = 0, marketPrice = 0, totalNum = $result.find('li > a').length;
        $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
            var $this = $(this);
            if ($this.find('a').text() === itemName) {
                marketPrice = parseInt($.trim($this.next('td').find('.pd_item_price').text()));
                return false;
            }
        });
        if (!marketPrice) marketPrice = 1;
        KFOL.showWaitMsg('<strong>正在统计购买价格中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                .replace('{0}', totalNum)
            , true);
        $(document).clearQueue('StatBuyItemsPrice');
        $result.find('li > a').each(function (index) {
            var $this = $(this);
            var itemId = $this.data('id');
            if (!itemId) return;
            $(document).queue('StatBuyItemsPrice', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_my.php?pro={0}&t={1}'.replace('{0}', itemId).replace('{1}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var matches = /从商店购买，购买价(\d+)KFB。<br>/i.exec(html);
                        if (matches) {
                            successNum++;
                            var price = parseInt(matches[1]);
                            totalPrice += price;
                            if (minPrice === 0) minPrice = price;
                            else if (price < minPrice) minPrice = price;
                            if (price > maxPrice) maxPrice = price;
                            $this.after('（购买价：<b class="pd_highlight">{0}</b>KFB）'.replace('{0}', price));
                        }
                        else {
                            failNum++;
                            $this.after('<span class="pd_notice">（未能获得预期的回应）</span>');
                        }
                    },
                    error: function () {
                        failNum++;
                        $this.after('<span class="pd_notice">（连接超时）</span>');
                    },
                    complete: function () {
                        if (index === totalNum - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('统计道具购买价格',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具统计成功{3}，总计价格：`{4}`，平均价格：`{5}`(`{6}%`)，最低价格：`{7}`(`{8}%`)，最高价格：`{9}`(`{10}%`)'
                                        .replace('{0}', successNum)
                                        .replace('{1}', itemLevel)
                                        .replace('{2}', itemName)
                                        .replace('{3}', failNum > 0 ? '（共有`{0}`个道具未能统计成功）'.replace('{0}', failNum) : '')
                                        .replace('{4}', totalPrice.toLocaleString())
                                        .replace('{5}', successNum > 0 ? Tools.getFixedNumberLocaleString(totalPrice / successNum, 2) : 0)
                                        .replace('{6}', successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0)
                                        .replace('{7}', minPrice.toLocaleString())
                                        .replace('{8}', Math.round(minPrice / marketPrice * 100))
                                        .replace('{9}', maxPrice.toLocaleString())
                                        .replace('{10}', Math.round(maxPrice / marketPrice * 100))
                                    , {pay: {'KFB': -totalPrice}}
                                );
                            }
                            console.log('统计道具购买价格（KFB）（共有{0}个道具未能统计成功），统计成功数量：{1}，总计价格：{2}，平均价格：{3} ({4}%)，最低价格：{5} ({6}%)，最高价格：{7} ({8}%)'
                                .replace('{0}', failNum)
                                .replace('{1}', successNum)
                                .replace('{2}', totalPrice.toLocaleString())
                                .replace('{3}', successNum > 0 ? Tools.getFixedNumberLocaleString(totalPrice / successNum, 2) : 0)
                                .replace('{4}', successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0)
                                .replace('{5}', minPrice.toLocaleString())
                                .replace('{6}', Math.round(minPrice / marketPrice * 100))
                                .replace('{7}', maxPrice.toLocaleString())
                                .replace('{8}', Math.round(maxPrice / marketPrice * 100))
                            );
                            $result.append(
                                ('<li class="pd_stat"><b>统计结果{0}：</b><br /><i>统计成功数量：<em>{1}</em></i> <i>总计价格：<em>{2}</em></i> ' +
                                '<i>平均价格：<em>{3} ({4}%)</em></i> <i>最低价格：<em>{5} ({6}%)</em></i> <i>最高价格：<em>{7} ({8}%)</em></i></li>')
                                    .replace('{0}', failNum > 0 ? '<span class="pd_notice">（共有{0}个道具未能统计成功）</span>'.replace('{0}', failNum) : '')
                                    .replace('{1}', successNum)
                                    .replace('{2}', totalPrice.toLocaleString())
                                    .replace('{3}', successNum > 0 ? Tools.getFixedNumberLocaleString(totalPrice / successNum, 2) : 0)
                                    .replace('{4}', successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0)
                                    .replace('{5}', minPrice.toLocaleString())
                                    .replace('{6}', Math.round(minPrice / marketPrice * 100))
                                    .replace('{7}', maxPrice.toLocaleString())
                                    .replace('{8}', Math.round(maxPrice / marketPrice * 100))
                            );
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('StatBuyItemsPrice');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('StatBuyItemsPrice');
    },

    /**
     * 在道具商店页面上添加批量购买道具的链接
     */
    addBatchBuyItemsLink: function () {
        var $shop = $('.kf_fw_ig1:first');

        $shop.find('tbody > tr:nth-child(2)')
            .find('td:nth-child(2)').css('width', '243px')
            .end().find('td:nth-child(3)').css('width', '155px')
            .end().find('td:last-child').css('width', '110px');

        $shop.find('tbody > tr:gt(1)').each(function () {
            $(this).find('td:nth-child(3)').wrapInner('<span class="pd_item_price"></span>')
                .end().find('td:last-child').append('<a class="pd_batch_buy_items" style="margin-left:15px" href="#">批量购买</a>');
        });

        $shop.on('click', 'a[href^="kf_fw_ig_shop.php?lvid="]', function () {
            var $this = $(this);
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
            if (!itemName) return;
            if (!confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', itemLevel).replace('{1}', itemName))) {
                return false;
            }
        }).on('click', 'a.pd_batch_buy_items', function (e) {
            e.preventDefault();
            KFOL.removePopTips($('.pd_pop_tips'));
            var $this = $(this);
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
            if (!itemName) return;
            var matches = /lvid=(\d+)&safeid=(\w+)/i.exec($this.prev('a').attr('href'));
            if (!matches) return;
            var itemTypeId = parseInt(matches[1]);
            var safeId = matches[2];
            var num = parseInt(
                $.trim(prompt('你要批量购买多少个【Lv.{0}：{1}】道具？'
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                    , 0))
            );
            if (isNaN(num) || num <= 0) return;
            KFOL.showWaitMsg('<strong>正在购买道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', num)
                , true);
            Item.buyItems({itemTypeId: itemTypeId, num: num, safeId: safeId, itemLevel: itemLevel, itemName: itemName});
        });

        $shop.find('tbody > tr:gt(1) > td:nth-child(4)').each(function () {
            var $this = $(this);
            var price = parseInt($.trim($this.prev('td').text()));
            if (isNaN(price)) return;
            $this.addClass('pd_custom_tips').attr('title', '{0}~{1}（均价：{2}）'
                .replace('{0}', Math.floor(price * 0.5))
                .replace('{1}', price * 2)
                .replace('{2}', Math.floor(price * 1.25))
            );
        });

        var $itemName = $shop.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showItemShopBuyInfo();
        $shop.find('tbody > tr:first-child > td').append(
            '<br /><span class="pd_highlight">想买道具却害怕使用失败？快来试试' +
            '<a href="read.php?tid=526110" target="_blank" title="喵拉布丁：我绝对没收广告费~">道具使用险</a>吧！</span>'
        );
    },

    /**
     * 显示道具商店可购买情况
     */
    showItemShopBuyInfo: function () {
        $.get('profile.php?action=show&uid={0}&t={1}'.replace('{0}', KFOL.uid).replace('{1}', new Date().getTime()), function (html) {
            var matches = /论坛货币：(\d+)\s*KFB<br \/>/i.exec(html);
            if (!matches) return;
            var cash = parseInt(matches[1]);
            $('.kf_fw_ig_title1:last').find('span:last').remove()
                .end().append('<span style="margin-left:7px">(当前持有 <b style="font-size:14px">{0}</b> KFB)</span>'.replace('{0}', cash));
            $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(3) > .pd_item_price').each(function () {
                var $this = $(this);
                $this.next('.pd_verify_tips').remove();
                var price = parseInt($.trim($this.text()));
                if (isNaN(price)) return;
                var tips = '', title = '';
                if (price * 2 <= cash) {
                    tips = '<span style="color:#669933">可买</span>';
                    title = '有足够KFB购买此道具';
                }
                else {
                    tips = '<span style="color:#FF0033">差{0}</span>'.replace('{0}', price * 2 - cash);
                    title = '还差{0}KFB才可购买此道具'.replace('{0}', price * 2 - cash);
                }
                $this.after('<span class="pd_verify_tips" title="{0}" style="font-size:12px;margin-left:3px">({1})</span>'.replace('{0}', title).replace('{1}', tips));
            });
        });
    },

    /**
     * 修正道具描述
     */
    modifyItemDescription: function () {
        var $area = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child');
        var matches = /道具名称：(.+)/.exec($area.find('span:first').text().trim());
        if (!matches) return;
        var itemName = matches[1];
        var itemDescReplaceList = {
            '蕾米莉亚同人漫画': ['燃烧伤害+1。上限50。', '力量+1，体质+1；满50本时，追加+700生命值。'],
            '十六夜同人漫画': ['命中+3，闪避+1。上限50。', '敏捷+1，灵活+1；满50本时，追加+100攻击速度。'],
            '档案室钥匙': ['暴击伤害加成+10%。上限30。', '增加5%盒子获得概率[原概率*(100%+追加概率)]；满30枚时，增加50点可分配点数。'],
            '傲娇LOLI娇蛮音CD': ['闪避+3，命中+1。上限30。', '降低对手生命值上限的0.5%；满30张时，追加降低对手10%攻击力。'],
            '整形优惠卷': [
                '暴击几率+3%。上限10。',
                '在获得盒子时，增加3%的几率直接获得高一级的盒子；<br>满10张时，这个概率直接提升为50%(无法将传奇盒子升级为神秘盒子)。'
            ],
            '消逝之药': ['消除伤害。<br>防御效果+7%。上限10。', '所有属性+5(不含耐力、幸运)；满10瓶时，追加200点可分配点数。']
        };
        if (itemDescReplaceList[itemName]) {
            $area.html($area.html().replace(itemDescReplaceList[itemName][0], itemDescReplaceList[itemName][1]));
        }
    }
};

/**
 * 卡片类
 */
var Card = {
    /**
     * 将指定的一系列卡片转换为VIP时间
     * @param {number[]} cardList 卡片ID列表
     * @param {string} safeId 用户的SafeID
     */
    convertCardsToVipTime: function (cardList, safeId) {
        var successNum = 0, failNum = 0, totalVipTime = 0, totalEnergy = 0;
        $(document).clearQueue('ConvertCardsToVipTime');
        $.each(cardList, function (index, cardId) {
            $(document).queue('ConvertCardsToVipTime', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_card_doit.php?do=recard&id={0}&safeid={1}&t={2}'
                        .replace('{0}', cardId)
                        .replace('{1}', safeId)
                        .replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('将卡片转换为VIP时间', html);
                        var matches = /增加(\d+)小时VIP时间(?:.*?获得(\d+)点恢复能量)?/i.exec(html);
                        if (matches) {
                            successNum++;
                            totalVipTime += parseInt(matches[1]);
                            if (typeof matches[2] !== 'undefined') totalEnergy += parseInt(matches[2]);
                        }
                        else failNum++;
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('ConvertCardsToVipTime');

                        if (isStop || index === cardList.length - 1) {
                            if (successNum > 0) {
                                Log.push('将卡片转换为VIP时间', '共有`{0}`张卡片成功为VIP时间'.replace('{0}', successNum),
                                    {
                                        gain: {'VIP小时': totalVipTime, '能量': totalEnergy},
                                        pay: {'卡片': -successNum}
                                    }
                                );
                            }
                            KFOL.removePopTips($('.pd_pop_tips'));
                            console.log('共有{0}张卡片转换成功，共有{1}张卡片转换失败，VIP小时+{2}，能量+{3}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', totalVipTime)
                                .replace('{3}', totalEnergy)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>张卡片转换成功{1}</strong><i>VIP小时<em>+{2}</em></i><i>能量<em>+{3}</em></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>张卡片转换失败'.replace('{0}', failNum) : '')
                                .replace('{2}', totalVipTime)
                                .replace('{3}', totalEnergy)
                                , -1);
                            $('.kf_fw_ig2 .pd_card_chk:checked')
                                .closest('td')
                                .fadeOut('normal', function () {
                                    var $parent = $(this).parent();
                                    $(this).remove();
                                    if ($parent.children().length === 0) $parent.remove();
                                });
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('ConvertCardsToVipTime');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('ConvertCardsToVipTime');
    },

    /**
     * 添加开启批量模式的按钮
     */
    addStartBatchModeButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        if ($('.kf_fw_ig2 a[href^="kf_fw_card_my.php?id="]').length === 0) return;
        $('<div class="pd_item_btns"><button>开启批量模式</button></div>').insertAfter('.kf_fw_ig2')
            .find('button').click(function () {
            var $this = $(this);
            var $cardLines = $('.kf_fw_ig2 > tbody > tr:gt(2)');
            if ($this.text() === '开启批量模式') {
                $this.text('关闭批量模式');
                $cardLines.on('click', 'a', function (e) {
                    e.preventDefault();
                    $(this).next('.pd_card_chk').click();
                }).find('td').has('a').each(function () {
                    var matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                    if (!matches) return;
                    $(this).css('position', 'relative')
                        .append('<input class="pd_card_chk" type="checkbox" value="{0}" />'
                            .replace('{0}', matches[1]));
                });
                var playedCardList = [];
                $('.kf_fw_ig2 > tbody > tr:nth-child(2) > td').each(function () {
                    var matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                    if (!matches) return;
                    playedCardList.push(parseInt(matches[1]));
                });
                var uncheckPlayedCard = function () {
                    for (var i in playedCardList) {
                        $cardLines.find('td').has('a[href="kf_fw_card_my.php?id={0}"]'.replace('{0}', playedCardList[i]))
                            .find('input:checked').prop('checked', false);
                    }
                };
                $this.before('<label><input id="uncheckPlayedCard" type="checkbox" checked="checked" /> 不选已出战的卡片</label>' +
                        '<button>每类只保留一张</button><button>全选</button><button>反选</button><br /><button>转换为VIP时间</button>')
                    .prev()
                    .click(function () {
                        KFOL.removePopTips($('.pd_pop_tips'));
                        var cardList = [];
                        $cardLines.find('input:checked').each(function () {
                            cardList.push(parseInt($(this).val()));
                        });
                        if (cardList.length === 0) return;
                        if (!confirm('共选择了{0}张卡片，是否将卡片批量转换为VIP时间？'.replace('{0}', cardList.length))) return;
                        KFOL.showWaitMsg('<strong>正在批量转换中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', cardList.length)
                            , true);
                        Card.convertCardsToVipTime(cardList, safeId);
                    })
                    .prev()
                    .prev()
                    .click(function () {
                        $cardLines.find('input').each(function () {
                            $(this).prop('checked', !$(this).prop('checked'));
                        });
                        if ($('#uncheckPlayedCard').prop('checked')) uncheckPlayedCard();
                    })
                    .prev()
                    .click(function () {
                        $cardLines.find('input').prop('checked', true);
                        if ($('#uncheckPlayedCard').prop('checked')) uncheckPlayedCard();
                    })
                    .prev()
                    .click(function () {
                        $cardLines.find('input').prop('checked', true);
                        if ($('#uncheckPlayedCard').prop('checked')) uncheckPlayedCard();
                        var cardTypeList = [];
                        $cardLines.find('a > img').each(function () {
                            var src = $(this).attr('src');
                            if ($.inArray(src, cardTypeList) === -1) cardTypeList.push(src);
                        });
                        for (var i in cardTypeList) {
                            var $cardElems = $cardLines.find('td').has('img[src="{0}"]'.replace('{0}', cardTypeList[i]));
                            var totalNum = $cardElems.length;
                            var checkedNum = $cardElems.has('input:checked').length;
                            if (totalNum > 1) {
                                if (totalNum === checkedNum) {
                                    $cardElems.eq(0).find('input:checked').prop('checked', false);
                                }
                            }
                            else {
                                $cardElems.find('input:checked').prop('checked', false);
                            }
                        }
                    });
            }
            else {
                $this.text('开启批量模式');
                $cardLines.off('click').find('.pd_card_chk').remove();
                $this.prevAll().remove();
            }
        });
    }
};

/**
 * 银行类
 */
var Bank = {
    // 最低转账金额
    minTransferMoney: 20,

    /**
     * 给活期帐户存款
     * @param {number} money 存款金额（KFB）
     * @param {number} cash 现金（KFB）
     * @param {number} currentDeposit 现有活期存款（KFB）
     */
    saveCurrentDeposit: function (money, cash, currentDeposit) {
        var $tips = KFOL.showWaitMsg('正在存款中...', true);
        $.post('hack.php?H_name=bank',
            {action: 'save', btype: 1, savemoney: money},
            function (html) {
                if (/完成存款/.test(html)) {
                    KFOL.showFormatLog('存款', html);
                    KFOL.removePopTips($tips);
                    console.log('共有{0}KFB存入活期存款'.replace('{0}', money));
                    var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
                    $account.html($account.html().replace(/当前所持：-?\d+KFB/i,
                        '当前所持：{0}KFB'.replace('{0}', cash - money)
                        ).replace(/活期存款：-?\d+KFB/i,
                        '活期存款：{0}KFB'.replace('{0}', currentDeposit + money)
                        )
                    );
                    setTimeout(function () {
                        $(document).dequeue('Bank');
                    }, 5000);
                }
                else {
                    $(document).clearQueue('Bank');
                    alert('存款失败');
                }
            }, 'html');
    },

    /**
     * 从活期帐户取款
     * @param {number} money 取款金额（KFB）
     */
    drawCurrentDeposit: function (money) {
        var $tips = KFOL.showWaitMsg('正在取款中...', true);
        $.post('hack.php?H_name=bank',
            {action: 'draw', btype: 1, drawmoney: money},
            function (html) {
                KFOL.removePopTips($tips);
                if (/完成取款/.test(html)) {
                    KFOL.showFormatLog('取款', html);
                    console.log('从活期存款中取出了{0}KFB'.replace('{0}', money));
                    KFOL.showMsg('从活期存款中取出了<em>{0}</em>KFB'.replace('{0}', money), -1);
                }
                else if (/取款金额大于您的存款金额/.test(html)) {
                    KFOL.showMsg('取款金额大于当前活期存款金额', -1);
                }
                else if (/\d+秒内不允许重新交易/.test(html)) {
                    KFOL.showMsg('提交速度过快', -1);
                }
                else {
                    KFOL.showMsg('取款失败', -1);
                }
            }, 'html');
    },

    /**
     * 批量转账
     * @param {Array} users 用户列表
     * @param {string} msg 转帐附言
     * @param {boolean} isDeposited 是否已存款
     * @param {number} currentDeposit 现有活期存款
     */
    batchTransfer: function (users, msg, isDeposited, currentDeposit) {
        var successNum = 0, failNum = 0, successMoney = 0;
        $.each(users, function (index, key) {
            $(document).queue('Bank', function () {
                $.ajax({
                    type: 'POST',
                    url: 'hack.php?H_name=bank',
                    timeout: Const.defAjaxTimeout,
                    data: '&action=virement&pwuser={0}&to_money={1}&memo={2}'
                        .replace('{0}', Tools.getGBKEncodeString(key[0]))
                        .replace('{1}', key[1])
                        .replace('{2}', Tools.getGBKEncodeString(msg))
                    ,
                    success: function (html) {
                        KFOL.showFormatLog('批量转账', html);
                        var msg = '';
                        if (/完成转帐!<\/span>/.test(html)) {
                            successNum++;
                            successMoney += key[1];
                            msg = '{0} <em>+{1}</em>'.replace('{0}', key[0]).replace('{1}', key[1]);
                        }
                        else {
                            failNum++;
                            var errorMsg = '';
                            if (/用户<b>.+?<\/b>不存在<br \/>/.test(html)) {
                                errorMsg = '用户不存在';
                            }
                            else if (/您的存款不够支付转帐/.test(html)) {
                                errorMsg = '存款不足';
                            }
                            else if (/转账额度不足/.test(html)) {
                                errorMsg = '转账额度不足';
                            }
                            else if (/当前等级无法使用该功能/.test(html)) {
                                errorMsg = '当前等级无法使用转账功能';
                            }
                            else if (/转帐数目填写不正确/.test(html)) {
                                errorMsg = '转帐金额不正确';
                            }
                            else if (/自己无法给自己转帐/.test(html)) {
                                errorMsg = '无法给自己转帐';
                            }
                            else if (/\d+秒内不允许重新交易/.test(html)) {
                                errorMsg = '提交速度过快';
                            }
                            else {
                                errorMsg = '未能获得预期的回应';
                            }
                            msg = '{0}:{1} <span class="pd_notice">({2})</span>'
                                .replace('{0}', key[0])
                                .replace('{1}', key[1])
                                .replace('{2}', errorMsg);
                        }
                        $('.pd_result:last').append('<li>{0}</li>'.replace('{0}', msg));
                    },
                    error: function () {
                        failNum++;
                        $('.pd_result:last').append(
                            ('<li>{0}:{1} <span class="pd_notice">(连接超时，转账可能失败，请到' +
                            '<a target="_blank" href="hack.php?H_name=bank&action=log">银行日志</a>里进行确认)</span></li>')
                                .replace('{0}', key[0])
                                .replace('{1}', key[1])
                        );
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('Bank');

                        if (isStop || index === users.length - 1) {
                            if (successNum > 0) {
                                Log.push('批量转账', '共有`{0}`名用户转账成功'.replace('{0}', successNum), {pay: {'KFB': -successMoney}});
                            }
                            KFOL.removePopTips($('.pd_pop_tips'));
                            var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("活期存款：")');
                            $account.html($account.html().replace(/活期存款：-?\d+KFB/i,
                                '活期存款：{0}KFB'.replace('{0}', currentDeposit - successMoney)
                                )
                            );
                            console.log('共有{0}名用户转账成功，共有{1}名用户转账失败，KFB-{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', successMoney)
                            );
                            $('.pd_result:last').append('<li><b>共有<em>{0}</em>名用户转账成功{1}：</b>KFB <ins>-{2}</ins></li>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>名用户转账失败'.replace('{0}', failNum) : '')
                                .replace('{2}', successMoney)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>名用户转账成功{1}</strong><i>KFB<ins>-{2}</ins></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>名用户转账失败'.replace('{0}', failNum) : '')
                                .replace('{2}', successMoney)
                            );
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('Bank');
                            }, 5000);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        if (!isDeposited) $(document).dequeue('Bank');
    },

    /**
     * 验证批量转账的字段值是否正确
     * @returns {boolean} 是否正确
     */
    batchTransferVerify: function () {
        var $bankUsers = $('#pd_bank_users');
        var users = $bankUsers.val();
        if (!/^\s*\S+\s*$/m.test(users) || /^\s*:/m.test(users) || /:/.test(users) && /:(\D|$)/m.test(users)) {
            alert('用户列表格式不正确');
            $bankUsers.select();
            $bankUsers.focus();
            return false;
        }
        if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
            alert('转帐金额不能小于{0}KFB'.replace('{0}', Bank.minTransferMoney));
            $bankUsers.select();
            $bankUsers.focus();
            return false;
        }
        var $bankMoney = $('#pd_bank_money');
        var money = parseInt($.trim($bankMoney.val()));
        if (/^\s*[^:]+\s*$/m.test(users)) {
            if (!$.isNumeric(money)) {
                alert('通用转账金额格式不正确');
                $bankMoney.select();
                $bankMoney.focus();
                return false;
            }
            else if (money < Bank.minTransferMoney) {
                alert('转帐金额不能小于{0}KFB'.replace('{0}', Bank.minTransferMoney));
                $bankMoney.select();
                $bankMoney.focus();
                return false;
            }
        }
        return true;
    },

    /**
     * 添加批量转账的按钮
     */
    addBatchTransferButton: function () {
        var html =
            '<tr id="pd_bank_transfer">' +
            '  <td style="vertical-align:top">使用说明：<br />每行一名用户，<br />如需单独设定金额，<br />可写为“用户名:金额”<br />（注意是<b>英文冒号</b>）<br />' +
            '例子：<br /><pre style="border:1px solid #9999FF;padding:5px">张三\n李四:200\n王五:500\n信仰风</pre></td>' +
            '  <td>' +
            '  <form>' +
            '    <div style="display:inline-block"><label>用户列表：<br />' +
            '<textarea class="pd_textarea" id="pd_bank_users" style="width:270px;height:250px"></textarea></label></div>' +
            '    <div style="display:inline-block;margin-left:10px;">' +
            '      <label>通用转帐金额（如所有用户都已设定单独金额则可留空）：<br />' +
            '<input class="pd_input" id="pd_bank_money" type="text" style="width:217px" maxlength="15" /></label><br />' +
            '      <label style="margin-top:5px">转帐附言（可留空）：<br />' +
            '<textarea class="pd_textarea" id="pd_bank_msg" style="width:225px;height:206px" id="pd_bank_users"></textarea></label>' +
            '    </div>' +
            '    <div><label><input class="pd_input" type="submit" value="批量转账" /></label>' +
            '<label style="margin-left:3px"><input class="pd_input" type="reset" value="重置" /></label>' +
            '<label style="margin-left:3px"><input class="pd_input" type="button" value="随机金额" title="为用户列表上的每个用户设定指定范围内的随机金额" /></label>' +
            ' （活期存款不足时，将自动进行存款；批量转账金额不会从定期存款中扣除）</div>' +
            '  </form>' +
            '  </td>' +
            '</tr>';
        $(html).appendTo('.bank1 > tbody')
            .find('form')
            .submit(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
                if (!Bank.batchTransferVerify()) return;
                var commonMoney = parseInt($.trim($('#pd_bank_money').val()));
                if (!commonMoney) commonMoney = 0;
                var msg = $('#pd_bank_msg').val();
                var users = [];
                $.each($('#pd_bank_users').val().split('\n'), function (index, line) {
                    line = $.trim(line);
                    if (!line) return;
                    if (line.indexOf(':') > -1) {
                        var arr = line.split(':');
                        if (arr.length < 2) return;
                        users.push([$.trim(arr[0]), parseInt(arr[1])]);
                    }
                    else {
                        users.push([line, commonMoney]);
                    }
                });
                if (users.length === 0) return;

                var matches = /\(手续费(\d+)%\)/.exec($('td:contains("(手续费")').text());
                if (!matches) return;
                var fee = parseInt(matches[1]) / 100;
                var totalMoney = 0;
                for (var i in users) {
                    totalMoney += users[i][1];
                }
                totalMoney = Math.floor(totalMoney * (1 + fee));
                if (!confirm('共计{0}名用户，总额{1}KFB，是否转账？'
                        .replace('{0}', users.length)
                        .replace('{1}', totalMoney)
                    )
                ) return;

                var $tips = KFOL.showWaitMsg('正在获取存款信息中...', true);
                $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
                    KFOL.removePopTips($tips);
                    var cash = 0, currentDeposit = 0;
                    var matches = /当前所持：(-?\d+)KFB<br/i.exec(html);
                    if (!matches) return;
                    cash = parseInt(matches[1]);
                    matches = /活期存款：(-?\d+)KFB<br/i.exec(html);
                    if (!matches) return;
                    currentDeposit = parseInt(matches[1]);
                    if (totalMoney > cash + currentDeposit) {
                        alert('资金不足');
                        return;
                    }

                    $(document).clearQueue('Bank');
                    var isDeposited = false;
                    var difference = totalMoney - currentDeposit;
                    if (difference > 0) {
                        isDeposited = true;
                        $(document).queue('Bank', function () {
                            Bank.saveCurrentDeposit(difference, cash, currentDeposit);
                            cash -= difference;
                            currentDeposit += difference;
                        });
                        $(document).dequeue('Bank');
                    }
                    KFOL.showWaitMsg('<strong>正在批量转账中，请耐心等待...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', users.length)
                        , true);
                    $('#pd_bank_transfer > td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
                    Bank.batchTransfer(users, msg, isDeposited, currentDeposit);
                }, 'html');
            })
            .end()
            .find('.pd_input[type="button"]')
            .click(function (e) {
                e.preventDefault();
                var userList = [];
                $.each($('#pd_bank_users').val().split('\n'), function (index, line) {
                    line = $.trim(line);
                    if (!line) return;
                    userList.push($.trim(line.split(':')[0]));
                });
                if (userList.length === 0) return;

                var range = prompt('设定随机金额的范围（注：最低转账金额为20KFB）', '20-100');
                if (range === null) return;
                range = $.trim(range);
                if (!/^\d+-\d+$/.test(range)) {
                    alert('随机金额范围格式不正确');
                    return;
                }
                var arr = range.split('-');
                var min = parseInt(arr[0]), max = parseInt(arr[1]);
                if (max < min) {
                    alert('最大值不能低于最小值');
                    return;
                }

                var content = '';
                for (var i in userList) {
                    content += userList[i] + ':' + Math.floor(Math.random() * (max - min + 1) + min) + '\n';
                }
                $('#pd_bank_users').val(content);
            });
    },

    /**
     * 在银行页面对页面元素进行处理
     */
    handleInBankPage: function () {
        var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("可获利息：")');
        var interestHtml = $account.html();
        var matches = /可获利息：(\d+)\(/i.exec(interestHtml);
        var interest = 0;
        if (matches) {
            interest = parseInt(matches[1]);
            if (interest > 0) {
                $account.html(interestHtml.replace(/可获利息：\d+\(/i,
                    '可获利息：<b class="pd_highlight">{0}</b>('.replace('{0}', interest)
                    )
                );
            }
        }

        var fixedDepositHtml = $account.html();
        matches = /定期存款：(\d+)KFB/i.exec(fixedDepositHtml);
        if (matches) {
            var fixedDeposit = parseInt(matches[1]);
            if (fixedDeposit > 0 && interest === 0) {
                var time = parseInt(TmpLog.getValue(Const.fixedDepositDueTmpLogName));
                if (!isNaN(time) && time > new Date().getTime()) {
                    fixedDepositHtml = fixedDepositHtml.replace('期间不存取定期，才可以获得利息）',
                        '期间不存取定期，才可以获得利息）<span style="color:#339933"> (到期时间：{0} {1})</span>'
                            .replace('{0}', Tools.getDateString(new Date(time)))
                            .replace('{1}', Tools.getTimeString(new Date(time), ':', false))
                    );
                    $account.html(fixedDepositHtml);
                }

                matches = /定期利息：([\d\.]+)%/.exec(fixedDepositHtml);
                if (matches) {
                    var interestRate = parseFloat(matches[1]) / 100;
                    var anticipatedInterest = Math.round(fixedDeposit * interestRate * Const.fixedDepositDueTime);
                    fixedDepositHtml = fixedDepositHtml.replace('取出定期将获得该数额的KFB利息)',
                        '取出定期将获得该数额的KFB利息)<span style="color:#339933"> (预期利息：{0} KFB)</span>'
                            .replace('{0}', anticipatedInterest)
                    );
                    $account.html(fixedDepositHtml);
                }
            }
        }

        $('form[name="form1"], form[name="form2"]').submit(function () {
            var $this = $(this);
            var money = 0;
            if ($this.is('[name="form2"]')) money = parseInt($.trim($this.find('input[name="drawmoney"]').val()));
            else money = parseInt($.trim($this.find('input[name="savemoney"]').val()));
            if (parseInt($this.find('input[name="btype"]:checked').val()) === 2 && money > 0) {
                TmpLog.setValue(Const.fixedDepositDueTmpLogName, Tools.getDate('+' + Const.fixedDepositDueTime + 'd').getTime());
            }
        });

        $('form[name="form3"]').submit(function () {
            var matches = /活期存款：(-?\d+)KFB/i.exec($('td:contains("活期存款：")').text());
            if (!matches) return;
            var currentDeposit = parseInt(matches[1]);
            matches = /定期存款：(\d+)KFB/i.exec($('td:contains("定期存款：")').text());
            if (!matches) return;
            var fixedDeposit = parseInt(matches[1]);
            var money = parseInt($.trim($('input[name="to_money"]').val()));
            if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
                if (!confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                    $(this).find('input[type="submit"]').prop('disabled', false);
                    return false;
                }
            }
        });
    },

    /**
     * 定期存款到期提醒
     */
    fixedDepositDueAlert: function () {
        console.log('定期存款到期提醒Start');
        $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
            Tools.setCookie(Const.fixedDepositDueAlertCookieName, 1, Tools.getMidnightHourDate(1));
            var matches = /可获利息：(\d+)\(/.exec(html);
            if (!matches) return;
            var interest = parseInt(matches[1]);
            if (interest > 0) {
                Tools.setCookie(Const.fixedDepositDueAlertCookieName, 1, Tools.getMidnightHourDate(7));
                if (confirm('您的定期存款已到期，共产生利息{0}KFB，是否前往银行取款？'.replace('{0}', interest))) {
                    location.href = 'hack.php?H_name=bank';
                }
            }
        }, 'html');
    }
};

/**
 * 争夺类
 */
var Loot = {
    /**
     * 增强争夺首页
     */
    enhanceLootIndexPage: function () {
        var $area = $('.kf_fw_ig1');
        var $property = $area.find('> tbody > tr:nth-child(2) > td:first-child');
        var propertyList = Loot.getCurrentLootPropertyList();
        var itemUsedNumList = Item.getItemUsedInfo($area.find('> tbody > tr:nth-child(3)').html());

        $property.html(
            $property.html().replace(
                '技能伤害：攻击伤害+(体质点数*4)', '技能伤害：<span class="pd_custom_tips" id="pd_skill_attack" title="攻击伤害+(体质点数*4)"></span>'
            )
        );
        $property.find('br').each(function (index) {
            var name = '';
            switch (index) {
                case 1:
                    name = 's1';
                    break;
                case 2:
                    name = 's2';
                    break;
                case 3:
                    name = 'd1';
                    break;
                case 4:
                    name = 'd2';
                    break;
                case 6:
                    name = 'i1';
                    break;
                case 7:
                    name = 'i2';
                    break;
            }
            if (name) {
                $(this).before(' <span style="color:#777" id="pd_new_{0}"></span>'.replace('{0}', name));
            }
        });

        $area.find('[type="text"]').attr('type', 'number').attr('min', 1).attr('max', 999).prop('required', true).css('width', '60px');
        $area.find('input[readonly]').attr('min', 0).prop('disabled', true).removeProp('required', true);
        $property.next('td').prepend('<span class="pd_highlight">剩余属性点：<span id="pd_surplus_point"></span></span><br>');

        $area.on('change', '[type="number"]', function () {
            var $this = $(this);
            $('#pd_surplus_point').text(propertyList['可分配属性点'] - Loot.getCurrentAssignedPoint());
            Loot.showNewLootProperty($this, propertyList, itemUsedNumList);
            Loot.showSumOfPoint($this);

            var skillAttack = 0;
            var matches = /\d+/.exec($area.find('[name="s1"]').next('span').next('.pd_point_sum').text());
            if (matches) skillAttack = parseInt(matches[0]) * 5;
            skillAttack += parseInt($area.find('[name="s2"]').val()) * 4;
            $('#pd_skill_attack').text(skillAttack);
        }).on('click', '.pd_point_sum', function () {
            var surplusPoint = propertyList['可分配属性点'] - Loot.getCurrentAssignedPoint();
            if (!surplusPoint) return;
            var $point = $(this).prev('span').prev('[type="number"]');
            var num = parseInt($point.val());
            if (isNaN(num) || num < 0) num = 0;
            $point.val(num + surplusPoint).trigger('change');
        }).closest('form').submit(function () {
            var surplusPoint = propertyList['可分配属性点'] - Loot.getCurrentAssignedPoint();
            if (surplusPoint < 0) {
                alert('剩余属性点为负，请重新填写');
                return false;
            }
            else if (surplusPoint > 0) {
                return confirm('你的可分配属性点尚未用完，是否提交？');
            }
        }).find('[type="number"]').trigger('change');

        Loot.enhanceLootLog();
    },

    /**
     * 获取当前已分配的属性点
     * @returns {number} 当前已分配的属性点
     */
    getCurrentAssignedPoint: function () {
        var usedPoint = 0;
        $('.kf_fw_ig1').find('[type="number"]').each(function () {
            var point = parseInt($(this).val());
            if (point && point > 0) usedPoint += point;
        });
        return usedPoint;
    },

    /**
     * 显示各项属性点的和值
     */
    showSumOfPoint: function ($point) {
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        var extraNum = parseInt($point.next('span').text());
        var $sum = $point.next('span').next('.pd_point_sum');
        if (!$sum.length) {
            $sum = $('<span class="pd_point_sum" style="color:#FF0033;cursor:pointer" title="点击：给该项加上或减去剩余属性点"></span>')
                .insertAfter($point.next('span'));
        }
        $sum.text('=' + (num + extraNum));
    },

    /**
     * 获取当前的争夺属性
     * @returns {{}} 争夺属性
     */
    getCurrentLootPropertyList: function () {
        var propertyList = {
            '攻击力': 0,
            '最大生命值': 0,
            '攻击速度': 0,
            '暴击几率': 0,
            '技能释放概率': 0,
            '防御': 0,
            '可分配属性点': 0
        };
        var html = $('.kf_fw_ig1 > tbody > tr:nth-child(2) > td:first-child').html();
        var matches = /攻击力：(\d+)/.exec(html);
        if (matches) propertyList['攻击力'] = parseInt(matches[1]);
        matches = /生命值：\d+\s*\(最大(\d+)\)/.exec(html);
        if (matches) propertyList['最大生命值'] = parseInt(matches[1]);
        matches = /攻击速度：(\d+)/.exec(html);
        if (matches) propertyList['攻击速度'] = parseInt(matches[1]);
        matches = /暴击几率：(\d+)%/.exec(html);
        if (matches) propertyList['暴击几率'] = parseInt(matches[1]);
        matches = /技能释放概率：(\d+)%/.exec(html);
        if (matches) propertyList['技能释放概率'] = parseInt(matches[1]);
        matches = /防御：(\d+)%/.exec(html);
        if (matches) propertyList['防御'] = parseInt(matches[1]);
        matches = /可分配属性点：(\d+)/.exec(html);
        if (matches) propertyList['可分配属性点'] = parseInt(matches[1]);
        return propertyList;
    },

    /**
     * 显示新的争夺属性
     * @param {jQuery} $point 属性字段
     * @param {{}} currentLootProperty 当前的争夺属性
     * @param {{}} itemUsedNumList 道具使用情况对象
     */
    showNewLootProperty: function ($point, currentLootProperty, itemUsedNumList) {
        var name = $point.attr('name');
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        var oriNum = parseInt($point.get(0).defaultValue);
        var extraNum = parseInt($point.next('span').text());
        var newValue = 0, diffValue = 0, unit = '';
        switch (name) {
            case 's1':
                newValue = (num + extraNum) * 5;
                diffValue = newValue - currentLootProperty['攻击力'];
                break;
            case 's2':
                newValue = (num + extraNum) * 20 + (itemUsedNumList['蕾米莉亚同人漫画'] === 50 ? 700 : 0);
                diffValue = newValue - currentLootProperty['最大生命值'];
                break;
            case 'd1':
                newValue = (num + extraNum) * 2 + (itemUsedNumList['十六夜同人漫画'] === 50 ? 100 : 0);
                diffValue = newValue - currentLootProperty['攻击速度'];
                break;
            case 'd2':
                newValue = num + extraNum;
                newValue = Math.round(newValue / (newValue + 100) * 100);
                diffValue = newValue - currentLootProperty['暴击几率'];
                unit = '%';
                break;
            case 'i1':
                newValue = num + extraNum;
                newValue = Math.round(newValue / (newValue + 120) * 100);
                diffValue = newValue - currentLootProperty['技能释放概率'];
                unit = '%';
                break;
            case 'i2':
                newValue = num + extraNum;
                newValue = Math.round(newValue / (newValue + 150) * 100);
                diffValue = newValue - currentLootProperty['防御'];
                unit = '%';
                break;
        }
        if (num !== oriNum) {
            $('#pd_new_' + name).html(
                ' (<span style="color:#00F">{0}{1}</span>|<span style="color:{2}">{3}</span>)'
                    .replace('{0}', newValue)
                    .replace('{1}', unit)
                    .replace('{2}', diffValue >= 0 ? '#FF0033' : '#339933')
                    .replace('{3}', (diffValue >= 0 ? '+' : '') + diffValue)
            );
        }
        else {
            $('#pd_new_' + name).html('');
        }
    },

    /**
     * 增强争夺记录
     */
    enhanceLootLog: function () {
        var $log = $('.kf_fw_ig1 > tbody > tr:nth-child(4) > td');
        var matches = $log.html().match(/获得\d+经验和\d+KFB/g);
        var exp = 0, kfb = 0;
        for (var i in matches) {
            var logMatches = /获得(\d+)经验和(\d+)KFB/.exec(matches[i]);
            exp += parseInt(logMatches[1]);
            kfb += parseInt(logMatches[2]);
        }
        if (exp || kfb) {
            $log.prepend(
                '<b class="pd_stat">你总共获得了<em>{0}</em>经验和<em>{1}</em>KFB</b><br>'
                    .replace('{0}', exp.toLocaleString())
                    .replace('{1}', kfb.toLocaleString())
            );
        }
    },

    /**
     * 在争夺排行页面添加用户链接
     */
    addUserLinkInPkListPage: function () {
        $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
            var $this = $(this);
            $this.html('<a href="profile.php?action=show&username={0}" target="_blank">{0}</a>'.replace(/\{0}/g, $this.text().trim()));
        });
    }
};


/**
 * KF Online主类
 */
var KFOL = {
    // 用户ID
    uid: 0,
    // 用户名
    userName: '',
    // 是否位于首页
    isInHomePage: location.pathname === '/' || location.pathname === '/index.php',
    // 是否为移动版
    isMobile: false,
    // 当前窗口
    window: typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,

    /**
     * 获取Uid和用户名
     * @returns {boolean} 是否获取成功
     */
    getUidAndUserName: function () {
        var $user = $('.topright a[href^="profile.php?action=show&uid="]').eq(0);
        if ($user.length === 0) return false;
        KFOL.userName = $user.text();
        if (!KFOL.userName) return false;
        var matches = /&uid=(\d+)/.exec($user.attr('href'));
        if (!matches) return false;
        KFOL.uid = parseInt(matches[1]);
        return true;
    },

    /**
     * 获取用户的SafeID
     * @returns {string} 用户的SafeID
     */
    getSafeId: function () {
        var safeId = $('input#safeid').val();
        if (!safeId) {
            var matches = /safeid=(\w+)/i.exec($('a[href*="safeid="]:first').attr('href'));
            if (matches) safeId = matches[1];
        }
        return safeId ? safeId : '';
    },

    /**
     * 检查浏览器类型
     */
    checkBrowserType: function () {
        if (Config.browseType === 'auto') {
            KFOL.isMobile = /(Mobile|MIDP)/i.test(navigator.userAgent);
        }
        else {
            KFOL.isMobile = Config.browseType === 'mobile';
        }
    },

    /**
     * 添加CSS样式
     */
    appendCss: function () {
        $('head').append(
            '<style type="text/css">' +
            '.pd_mask { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1000; }' +
            '.pd_pop_box { position: {0}; width: 100%; z-index: 1001; }'.replace('{0}', KFOL.isMobile ? 'absolute' : 'fixed') +
            '.pd_pop_tips {' +
            '  border: 1px solid #6ca7c0; text-shadow: 0 0 3px rgba(0,0,0,0.1); border-radius: 3px; padding: 12px 40px; text-align: center;' +
            '  font-size: 14px; position: absolute; display: none; color: #333; background: #f8fcfe; background-repeat: no-repeat;' +
            '  background-image: -webkit-linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: -moz-linear-gradient(top, #F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: -o-linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: -ms-linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '}' +
            '.pd_pop_tips strong { margin-right: 5px; }' +
            '.pd_pop_tips i { font-style: normal; padding-left: 10px; }' +
            '.pd_pop_tips em, .pd_stat em, .pd_pop_tips ins, .pd_stat ins { font-weight: 700; font-style: normal; color:#FF6600; padding: 0 3px; }' +
            '.pd_pop_tips ins, .pd_stat ins { text-decoration: none; color: #339933; }' +
            '.pd_pop_tips a { font-weight: bold; margin-left: 15px; }' +
            '.pd_stat i { font-style: normal; margin-right: 3px; }' +
            '.pd_stat .pd_notice { margin-left: 5px; }' +
            '.pd_stat_extra em, .pd_stat_extra ins { padding: 0 2px; cursor: help; }' +
            '.pd_highlight { color: #FF0000 !important; }' +
            '.pd_notice, .pd_pop_tips .pd_notice { font-style: italic; color: #666; }' +
            '.pd_input, .pd_cfg_main input, .pd_cfg_main select { vertical-align: middle; height: auto; margin-right: 0; line-height: 22px; font-size: 12px; }' +
            '.pd_input[type="text"], .pd_cfg_main input[type="text"] { height: 18px; line-height: 18px; }' +
            '.pd_input:focus, .pd_cfg_main input[type="text"]:focus, .pd_cfg_main textarea:focus, .pd_textarea:focus { border-color: #7EB4EA; }' +
            '.pd_textarea, .pd_cfg_main textarea { border: 1px solid #CCC; font-size: 12px; }' +
            '.readlou .pd_goto_link { color: #000; }' +
            '.readlou .pd_goto_link:hover { color: #51D; }' +
            '.pd_fast_goto_floor, .pd_multi_quote_chk { margin-right: 2px; }' +
            '.pages .pd_fast_goto_page { margin-left: 8px; }' +
            '.pd_fast_goto_floor span:hover, .pd_fast_goto_page span:hover { color: #51D; cursor: pointer; text-decoration: underline; }' +
            '.pd_item_btns { text-align: right; margin-top: 5px;  }' +
            '.pd_item_btns button, .pd_item_btns input { margin-left: 3px; margin-bottom: 2px; vertical-align: middle; }' +
            '.pd_result { border: 1px solid #99F; padding: 5px; margin-top: 10px; line-height: 2em; }' +
            '.pd_result_sep { border-bottom: 1px solid #999; margin: 7px 0; }' +
            '.pd_result_sep_inner { border-bottom: 1px dashed #999; margin: 5px 0; }' +
            '.pd_thread_page { margin-left: 5px; }' +
            '.pd_thread_page a { color: #444; padding: 0 3px; }' +
            '.pd_thread_page a:hover { color: #51D; }' +
            '.pd_card_chk { position: absolute; bottom: -8px; left: 1px; }' +
            '.pd_disabled_link { color: #999 !important; text-decoration: none !important; cursor: default; }' +
            '.b_tit4 .pd_thread_goto, .b_tit4_1 .pd_thread_goto { position: absolute; top: 0; right: 0; padding: 0 15px; }' +
            '.b_tit4 .pd_thread_goto:hover, .b_tit4_1 .pd_thread_goto:hover { padding-left: 15px; }' +
            '.pd_custom_tips { cursor: help; }' +
            '.pd_user_memo { font-size: 12px; color: #999; line-height: 14px; }' +
            '.pd_user_memo_tips { font-size: 12px; color: #FFF; margin-left: 3px; cursor: help; }' +
            '.pd_user_memo_tips:hover { color: #DDD; }' +
            '.pd_sm_color_select > td { position: relative; cursor: pointer; }' +
            '.pd_sm_color_select > td > input { position: absolute; top: 18px; left: 10px; }' +
            '.pd_used_item_info { color: #666; float: right; cursor: help; margin-right: 5px; }' +
            '.pd_panel { position: absolute; overflow-y: auto; background-color: #FFF; border: 1px solid #9191FF; opacity: 0.9; }' +
            '#pd_smile_panel img { margin: 3px; cursor: pointer; }' +
            '.pd_verify_tips { cursor: help; color: #999; }' +
            '.pd_verify_tips_ok { color: #99CC66; }' +
            '.pd_verify_tips_conditional { color: #FF9900; }' +
            '.pd_verify_tips_unable { color: #FF0033; }' +
            '.pd_verify_tips_details { cursor: pointer; }' +
            '#pd_monster_loot_info_panel em { font-style: normal; cursor: help; }' +
            '#pd_attack_log_content {' +
            '  width: 850px; min-height: 160px; max-height: 500px; margin: 5px 0; padding: 5px; border: 1px solid #9191FF; overflow: auto;' +
            '  line-height: 1.6em; background-color: #FFF;' +
            '}' +
            '.pd_my_items > tbody > tr > td > a + a { margin-left: 15px; }' +
            '.pd_usable_num { color: #669933; }' +
            '.pd_used_num { color: #FF0033; }' +
            '.pd_title_tips {' +
            '  position: absolute; max-width: 470px; font-size: 12px; line-height: 1.5em;' +
            '  padding: 2px 5px; background-color: #FCFCFC; border: 1px solid #767676; z-index: 9999;' +
            '}' +
            '.pd_search_type {' +
            '  float: left; height: 26px; line-height: 26px; width: 65px; text-align: center; border: 1px solid #CCC; border-left: none; cursor: pointer;' +
            '}' +
            '.pd_search_type i { font-style: normal; margin-left: 5px; font-family: "Microsoft YaHei"; }' +
            '.pd_search_type_list {' +
            '  position: absolute; width: 63px; background-color: #FCFCFC; border: 1px solid #CCC; border-top: none; line-height: 26px;' +
            '  text-indent: 13px; cursor: pointer; z-index: 1003;' +
            '}' +
            '.pd_search_type_list li:hover { color: #FFF; background-color: #87C3CF; }' +
            '.editor-button .pd_editor_btn { background: none; text-indent: 0; line-height: 18px; cursor: default; }' +
            '.readtext img[onclick] { max-width: 550px; }' +
            '.pd_post_extra_option { text-align:left; margin-top:5px; margin-left:5px; }' +
            '.pd_post_extra_option input { vertical-align:middle; height:auto; margin-right:0; }' +
            '.read_fds { text-align: left !important; font-weight: normal !important; font-style: normal !important; }' +
            '.pd_item_type_chk { margin-right: 5px; }' +

            /* 设置对话框 */
            '.pd_cfg_box {' +
            '  position: {0}; border: 1px solid #9191FF; display: none; z-index: 1002;'.replace('{0}', KFOL.isMobile ? 'absolute' : 'fixed') +
            '  -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);' +
            '  -o-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);' +
            '}' +
            '.pd_cfg_box h1 {text-align: center; font-size: 14px; background-color: #9191FF; color: #FFF; line-height: 2em; margin: 0; padding-left: 20px; }' +
            '.pd_cfg_box h1 span { float: right; cursor: pointer; padding: 0 10px; }' +
            '#pd_custom_sm_color { width: 360px; }' +
            '.pd_cfg_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }' +
            '.pd_cfg_nav a { margin-left: 10px; }' +
            '.pd_cfg_main { background-color: #FCFCFC; padding: 0 10px; font-size: 12px; line-height: 22px; min-height: 50px; overflow: auto; }' +
            '.pd_cfg_main fieldset { border: 1px solid #CCCCFF; padding: 0 6px 6px; }' +
            '.pd_cfg_main legend { font-weight: bold; }' +
            '.pd_cfg_main label input, .pd_cfg_main legend input, .pd_cfg_main label select { margin: 0 5px; }' +
            '.pd_cfg_main input[type="color"] { height: 18px; width: 30px; padding: 0; }' +
            '.pd_cfg_main button { vertical-align: middle; }' +
            '.pd_cfg_main .pd_cfg_tips { color: #51D; text-decoration: none; cursor: help; }' +
            '.pd_cfg_main .pd_cfg_tips:hover { color: #FF0000; }' +
            '#pd_config .pd_cfg_main { overflow-x: hidden; white-space: nowrap; }' +
            '.pd_cfg_panel { display: inline-block; width: 380px; vertical-align: top; }' +
            '.pd_cfg_panel + .pd_cfg_panel { margin-left: 5px; }' +
            '.pd_cfg_btns { background-color: #FCFCFC; text-align: right; padding: 5px; }' +
            '.pd_cfg_btns button { width: 80px; margin-left: 5px; }' +
            '.pd_cfg_about { float: left; line-height: 24px; margin-left: 5px; }' +
            '#pd_cfg_custom_monster_name_list td input[type="text"] { width: 140px; }' +
            '#pd_cfg_follow_user_list, #pd_cfg_block_user_list { max-height: 480px; overflow: auto; }' +
            '#pd_auto_change_sm_color_btns label { margin-right: 10px; }' +

            /* 日志对话框 */
            '#pd_log { width: 880px; }' +
            '.pd_log_nav { text-align: center; margin: -5px 0 -12px; font-size: 14px; line-height: 44px; }' +
            '.pd_log_nav a { display: inline-block; }' +
            '.pd_log_nav h2 { display: inline; font-size: 14px; margin-left: 7px; margin-right: 7px; }' +
            '#pd_log_content { height: 308px; overflow: auto; }' +
            '#pd_log_content h3 { display: inline-block; font-size: 12px; line-height: 22px; margin: 0; }' +
            '#pd_log_content h3:not(:first-child) { margin-top: 5px; }' +
            '#pd_log_content p { line-height: 22px; margin: 0; }' +
            '#pd_log .pd_stat i { display: inline-block; }' +
            '</style>'
        );

        if (Config.customCssEnabled) {
            $('head').append(
                '<style type="text/css">' + Config.customCssContent + '</style>'
            );
        }
    },

    /**
     * 显示提示消息
     * @param {(string|Object)} options 提示消息或设置对象
     * @param {string} [options.msg] 提示消息
     * @param {number} [options.duration={@link Config.defShowMsgDuration}] 提示消息持续时间（秒），-1为永久显示
     * @param {boolean} [options.clickable=true] 消息框可否手动点击消除
     * @param {boolean} [options.preventable=false] 是否阻止点击网页上的其它元素
     * @param {number} [duration] 提示消息持续时间（秒），-1为永久显示
     * @example
     * KFOL.showMsg('<strong>抽取道具或卡片</strong><i>道具<em>+1</em></i>');
     * KFOL.showMsg({msg: '<strong>抽取神秘盒子</strong><i>KFB<em>+8</em></i>', duration: 20, clickable: false});
     * @returns {jQuery} 消息框的jQuery对象
     */
    showMsg: function (options, duration) {
        var settings = {
            msg: '',
            duration: Config.defShowMsgDuration,
            clickable: true,
            preventable: false
        };
        if ($.type(options) === 'object') {
            $.extend(settings, options);
        }
        else {
            settings.msg = options;
            settings.duration = typeof duration === 'undefined' ? Config.defShowMsgDuration : duration;
        }
        if ($('.pd_pop_tips').length > 20) KFOL.removePopTips($('.pd_pop_tips'));
        var $popBox = $('.pd_pop_box');
        var isFirst = $popBox.length === 0;
        if (!isFirst && $('.pd_mask').length === 0) {
            var $lastTips = $('.pd_pop_tips:last');
            if ($lastTips.length > 0) {
                var top = $lastTips.offset().top;
                var winScrollTop = $(window).scrollTop();
                if (top < winScrollTop || top >= winScrollTop + $(window).height() - $lastTips.outerHeight() - 10) {
                    $popBox.remove();
                    isFirst = true;
                }
            }
        }
        if (settings.preventable && $('.pd_mask').length === 0) {
            $('<div class="pd_mask"></div>').appendTo('body');
        }
        if (isFirst) {
            $popBox = $('<div class="pd_pop_box"></div>').appendTo('body');
        }
        var $popTips = $('<div class="pd_pop_tips">' + settings.msg + '</div>').appendTo($popBox);
        $popTips.on('click', 'a.pd_stop_action', function (e) {
            e.preventDefault();
            $(this).text('正在停止...').closest('.pd_pop_tips').data('stop', true);
        });
        if (settings.clickable) {
            $popTips.css('cursor', 'pointer').click(function () {
                $(this).stop(true, true).fadeOut('slow', function () {
                    KFOL.removePopTips($(this));
                });
            }).find('a').click(function (e) {
                e.stopPropagation();
            });
        }
        var windowWidth = $(window).width(), windowHeight = $(window).height();
        var popTipsWidth = $popTips.outerWidth(), popTipsHeight = $popTips.outerHeight();
        if (KFOL.isMobile && windowHeight > 1000) windowHeight /= 2;
        var scrollTop = $(window).scrollTop();
        if (scrollTop < windowHeight / 2) scrollTop = 0;
        var left = windowWidth / 2 + (KFOL.isMobile ? $(window).scrollLeft() / 3 : 0) - popTipsWidth / 2;
        if (left + popTipsWidth > windowWidth) left = windowWidth - popTipsWidth - 20;
        if (left < 0) left = 0;
        if (isFirst) {
            $popBox.css('top', windowHeight / 2 + (KFOL.isMobile ? scrollTop : 0) - popTipsHeight / 2);
        }
        else {
            $popBox.stop(false, true).animate({'top': '-=' + popTipsHeight / 1.75});
        }
        var $prev = $popTips.prev('.pd_pop_tips');
        $popTips.css('top', $prev.length > 0 ? parseInt($prev.css('top')) + $prev.outerHeight() + 5 : 0)
            .css('left', left)
            .fadeIn('slow');
        if (settings.duration !== -1) {
            $popTips.delay(settings.duration * 1000).fadeOut('slow', function () {
                KFOL.removePopTips($(this));
            });
        }
        return $popTips;
    },

    /**
     * 显示等待消息
     * @param {string} msg 等待消息
     * @param {boolean} [preventable=false] 是否阻止点击网页上的其它元素
     * @returns {jQuery} 消息框的jQuery对象
     */
    showWaitMsg: function (msg, preventable) {
        return KFOL.showMsg({msg: msg, duration: -1, clickable: false, preventable: preventable === true});
    },

    /**
     * 移除指定的提示消息框
     * @param {jQuery} $popTips 指定的消息框节点
     */
    removePopTips: function ($popTips) {
        var $parent = $popTips.parent();
        $popTips.remove();
        if ($('.pd_pop_tips').length === 0) {
            $parent.remove();
            $('.pd_mask').remove();
        }
        else if ($('#pd_remaining_num').length === 0) {
            $('.pd_mask').remove();
        }
    },

    /**
     * 在操作进行时阻止关闭页面
     */
    preventCloseWindowWhenActioning: function () {
        if (window.addEventListener) {
            window.addEventListener("beforeunload", function (e) {
                if ($('.pd_mask').length > 0) {
                    var msg = '操作正在进行中，确定要关闭页面吗？';
                    e.returnValue = msg;
                    return msg;
                }
            });
        }
    },

    /**
     * 输出经过格式化后的控制台消息
     * @param {string} msgType 消息类别
     * @param {string} html 回应的HTML源码
     */
    showFormatLog: function (msgType, html) {
        var msg = '';
        var matches = /<span style=".+?">(.+?)<\/span><br \/><a href="(.+?)">/i.exec(html);
        if (matches) {
            msg = '{0}；跳转地址：{1}{2}'.replace('{0}', matches[1]).replace('{1}', Tools.getHostNameUrl()).replace('{2}', matches[2]);
        }
        else {
            matches = /操作提示<br \/>\r\n(.+?)<br \/>\r\n<a href="javascript:history\.go\(-1\);">返回上一步操作<\/a>/i.exec(html);
            if (matches) msg = matches[1];
        }
        if (!msg) msg = '未能获得预期的回应';
        console.log('【{0}】回应：{1}'.replace('{0}', msgType).replace('{1}', msg));
    },

    /**
     * KFB捐款
     * @param {boolean} [isAutoSaveCurrentDeposit=false] 是否在捐款完毕之后自动活期存款
     */
    donation: function (isAutoSaveCurrentDeposit) {
        var now = new Date();
        var date = Tools.getDateByTime(Config.donationAfterTime);
        if (now < date) {
            if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit();
            return;
        }
        Func.run('KFOL.donation_before_');
        console.log('KFB捐款Start');
        var $tips = KFOL.showWaitMsg('<strong>正在进行捐款，请稍候...</strong>', true);

        /**
         * 获取捐款Cookies有效期
         * @returns {Date} Cookies有效期的Date对象
         */
        var getDonationCookieDate = function () {
            var now = new Date();
            var date = Tools.getTimezoneDateByTime('02:00:00');
            if (now > date) {
                date = Tools.getTimezoneDateByTime('00:00:00');
                date.setDate(date.getDate() + 1);
            }
            if (now > date) date.setDate(date.getDate() + 1);
            return date;
        };

        /**
         * 使用指定的KFB捐款
         * @param {number} kfb 指定的KFB
         */
        var donationSubmit = function (kfb) {
            $.post('kf_growup.php?ok=1', {kfb: kfb}, function (html) {
                Tools.setCookie(Const.donationCookieName, 1, getDonationCookieDate());
                KFOL.showFormatLog('捐款{0}KFB'.replace('{0}', kfb), html);
                KFOL.removePopTips($tips);

                var msg = '<strong>捐款<em>{0}</em>KFB</strong>'.replace('{0}', kfb);
                var matches = /捐款获得(\d+)经验值(?:.*?补偿期(?:.*?\+(\d+)KFB)?(?:.*?(\d+)成长经验)?)?/i.exec(html);
                if (!matches) {
                    if (/KFB不足。<br/i.test(html)) {
                        msg += '<i class="pd_notice">KFB不足</i><a target="_blank" href="kf_growup.php">手动捐款</a>';
                    }
                    else return;
                }
                else {
                    msg += '<i>经验值<em>+{0}</em></i>'.replace('{0}', matches[1]);
                    var gain = {'经验值': parseInt(matches[1])};
                    if (typeof matches[2] !== 'undefined' || typeof matches[3] !== 'undefined') {
                        msg += '<i style="margin-left:5px">(补偿期:</i>{0}{1}'
                            .replace('{0}', typeof matches[2] !== 'undefined' ?
                                '<i>KFB<em>+{0}</em>{1}</i>'
                                    .replace('{0}', matches[2])
                                    .replace('{1}', typeof matches[3] !== 'undefined' ? '' : ')')
                                : '')
                            .replace('{1}', typeof matches[3] !== 'undefined' ? '<i>经验值<em>+{0}</em>)</i>'.replace('{0}', matches[3]) : '');
                        if (typeof matches[2] !== 'undefined')
                            gain['KFB'] = parseInt(matches[2]);
                        if (typeof matches[3] !== 'undefined')
                            gain['经验值'] += parseInt(matches[3]);
                    }
                    Log.push('捐款', '捐款`{0}`KFB'.replace('{0}', kfb), {gain: gain, pay: {'KFB': -kfb}});
                }
                KFOL.showMsg(msg);
                if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit(true);
                Func.run('KFOL.donation_after_', html);
            }, 'html');
        };

        if (/%$/.test(Config.donationKfb)) {
            $.get('profile.php?action=show&uid={0}&t={1}'.replace('{0}', KFOL.uid).replace('{1}', new Date().getTime()), function (html) {
                var matches = /论坛货币：(-?\d+)\s*KFB/i.exec(html);
                var income = 1;
                if (matches) income = parseInt(matches[1]);
                else console.log('当前持有KFB获取失败');
                var donationKfb = parseInt(Config.donationKfb);
                donationKfb = Math.floor(income * donationKfb / 100);
                donationKfb = donationKfb > 0 ? donationKfb : 1;
                donationKfb = donationKfb <= Const.maxDonationKfb ? donationKfb : Const.maxDonationKfb;
                donationSubmit(donationKfb);
            }, 'html');
        }
        else {
            $.get('kf_growup.php?t=' + new Date().getTime(), function (html) {
                if (/>今天已经捐款</.test(html)) {
                    KFOL.removePopTips($tips);
                    Tools.setCookie(Const.donationCookieName, 1, getDonationCookieDate());
                    if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit();
                }
                else {
                    donationSubmit(parseInt(Config.donationKfb));
                }
            }, 'html');
        }
    },

    /**
     * 获取倒计时的最小时间间隔（秒）
     * @returns {number} 倒计时的最小时间间隔（秒）
     */
    getMinRefreshInterval: function () {
        var donationInterval = -1;
        if (Config.autoDonationEnabled) {
            var donationTime = Tools.getDateByTime(Config.donationAfterTime);
            var now = new Date();
            if (!Tools.getCookie(Const.donationCookieName) && now <= donationTime) {
                donationInterval = Math.floor((donationTime - now) / 1000);
            }
            else {
                donationTime.setDate(donationTime.getDate() + 1);
                donationInterval = Math.floor((donationTime - now) / 1000);
            }
        }

        var autoChangeSMColorInterval = -1;
        if (Config.autoChangeSMColorEnabled) {
            var nextTime = parseInt(Tools.getCookie(Const.autoChangeSMColorCookieName));
            if (!isNaN(nextTime) && nextTime > 0) {
                autoChangeSMColorInterval = Math.floor((nextTime - new Date().getTime()) / 1000);
                if (autoChangeSMColorInterval < 0) autoChangeSMColorInterval = 0;
                if (!Config.changeAllAvailableSMColorEnabled && Config.customAutoChangeSMColorList.length <= 1)
                    autoChangeSMColorInterval = -1;
            }
            else autoChangeSMColorInterval = 0;
        }

        var minArr = [donationInterval, autoChangeSMColorInterval];
        minArr.sort(function (a, b) {
            return a > b;
        });
        var min = -1;
        for (var i in minArr) {
            if (minArr[i] > -1) {
                min = minArr[i];
                break;
            }
        }
        if (min <= -1) return -1;
        else return min > 0 ? min + 1 : 0;
    },

    /**
     * 启动定时模式
     */
    startAutoRefreshMode: function () {
        var interval = KFOL.getMinRefreshInterval();
        if (interval === -1) return;
        var oriTitle = document.title;
        var titleItvFunc = null;
        var prevInterval = -1, errorNum = 0;

        /**
         * 获取经过格式化的倒计时标题
         * @param {number} type 倒计时显示类型，1：[小时:][分钟:]秒钟；2：[小时:]分钟
         * @param {number} interval 倒计时
         * @returns {string} 经过格式化的倒计时标题
         */
        var getFormatIntervalTitle = function (type, interval) {
            var textInterval = '';
            var diff = Tools.getTimeDiffInfo(Tools.getDate('+' + interval + 's').getTime());
            textInterval = diff.hours > 0 ? diff.hours + '时' : '';
            if (type === 1)
                textInterval += (diff.minutes > 0 ? diff.minutes + '分' : '') + diff.seconds + '秒';
            else
                textInterval += diff.minutes + '分';
            return textInterval;
        };

        /**
         * 显示定时模式标题提示
         * @param {number} interval 倒计时的时间间隔（秒）
         * @param {boolean} [isShowTitle=false] 是否立即显示标题
         */
        var showRefreshModeTips = function (interval, isShowTitle) {
            if (titleItvFunc) window.clearInterval(titleItvFunc);
            var showInterval = interval;
            console.log('【定时模式】倒计时：' + getFormatIntervalTitle(1, showInterval));
            if (Config.showRefreshModeTipsType.toLowerCase() !== 'never') {
                var showIntervalTitle = function () {
                    document.title = '{0} (定时: {1})'
                        .replace('{0}', oriTitle)
                        .replace('{1}', getFormatIntervalTitle(interval < 60 ? 1 : 2, showInterval));
                    showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
                };
                if (isShowTitle || Config.showRefreshModeTipsType.toLowerCase() === 'always' || interval < 60)
                    showIntervalTitle();
                else showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
                titleItvFunc = window.setInterval(showIntervalTitle, Const.showRefreshModeTipsInterval * 60 * 1000);
            }
        };

        /**
         * 处理错误
         */
        var handleError = function () {
            var interval = 0, errorText = '';
            $.ajax({
                type: 'GET',
                url: 'index.php?t=' + new Date().getTime(),
                timeout: Const.defAjaxTimeout,
                success: function (html) {
                    if (!/"kf_fw_ig_index.php"/i.test(html)) {
                        interval = 10;
                        errorText = '论坛维护或其它未知情况';
                    }
                },
                error: function () {
                    interval = Const.errorRefreshInterval;
                    errorText = '连接超时';
                },
                complete: function () {
                    if (interval > 0) {
                        console.log('定时操作失败（原因：{0}），将在{1}分钟后重试...'.replace('{0}', errorText).replace('{1}', interval));
                        KFOL.removePopTips($('.pd_refresh_notice').parent());
                        KFOL.showMsg('<strong class="pd_refresh_notice">定时操作失败（原因：{0}），将在<em>{1}</em>分钟后重试...</strong>'
                                .replace('{0}', errorText)
                                .replace('{1}', interval)
                            , -1);
                        setTimeout(handleError, interval * 60 * 1000);
                        showRefreshModeTips(interval * 60, true);
                    }
                    else {
                        if (errorNum > 6) {
                            errorNum = 0;
                            interval = 15;
                            setTimeout(checkRefreshInterval, interval * 60 * 1000);
                            showRefreshModeTips(interval * 60, true);
                        }
                        else {
                            errorNum++;
                            checkRefreshInterval();
                        }
                    }
                },
                dataType: 'html'
            });
        };

        /**
         * 检查刷新间隔
         */
        var checkRefreshInterval = function () {
            KFOL.removePopTips($('.pd_refresh_notice').parent());
            if (Config.autoDonationEnabled && !Tools.getCookie(Const.donationCookieName)) {
                KFOL.donation();
            }
            if (Config.autoChangeSMColorEnabled && !Tools.getCookie(Const.autoChangeSMColorCookieName)) KFOL.changeIdColor();

            var interval = KFOL.getMinRefreshInterval();
            if (interval > 0) errorNum = 0;
            if (interval === 0 && prevInterval === 0) {
                prevInterval = -1;
                handleError();
                return;
            }
            else prevInterval = interval;
            if (interval === -1) {
                if (titleItvFunc) window.clearInterval(titleItvFunc);
                return;
            }
            else if (interval === 0) interval = Const.actionFinishRetryInterval;
            setTimeout(checkRefreshInterval, interval * 1000);
            showRefreshModeTips(interval, true);
        };

        setTimeout(checkRefreshInterval, interval < 60 ? 60 * 1000 : interval * 1000);
        showRefreshModeTips(interval < 60 ? 60 : interval);
    },

    /**
     * 添加设置和日志对话框的链接
     */
    addConfigAndLogDialogLink: function () {
        var $login = $('a[href^="login.php?action=quit"]:first');
        $('<a href="#">助手设置</a><span> | </span>').insertBefore($login)
            .filter('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.show();
        });
        if (Config.showLogLinkEnabled) {
            $('<a href="#">助手日志</a><span> | </span>').insertBefore($login)
                .filter('a').click(function (e) {
                e.preventDefault();
                Log.show();
            });
        }
    },

    /**
     * 处理首页有人@你的消息框
     */
    handleAtTips: function () {
        var type = Config.atTipsHandleType;
        if (type === 'default') return;
        var $atTips = $('a[href^="guanjianci.php?gjc="]');
        var noHighlight = function () {
            $atTips.removeClass('indbox5').addClass('indbox6');
        };
        var hideBox = function () {
            $atTips.parent().next('div.line').addBack().remove();
        };
        var handleBox = noHighlight;
        if (type === 'hide_box_1' || type === 'hide_box_2') handleBox = hideBox;
        if (type === 'no_highlight' || type === 'no_highlight_extra' || type === 'hide_box_1' || type === 'at_change_to_cao') {
            if ($atTips.length > 0) {
                var cookieText = Tools.getCookie(Const.hideMarkReadAtTipsCookieName);
                var atTipsText = $.trim($atTips.text());
                var matches = /\d+日\d+时\d+分/.exec(atTipsText);
                if (matches) atTipsText = matches[0];
                if (cookieText && cookieText === atTipsText) {
                    handleBox();
                }
                else {
                    $atTips.click(function () {
                        var $this = $(this);
                        if ($this.data('disabled')) return;
                        var cookieText = Tools.getCookie(Const.hideMarkReadAtTipsCookieName);
                        if (!cookieText) {
                            var curDate = (new Date()).getDate();
                            Tools.setCookie(Const.prevReadAtTipsCookieName, (curDate < 10 ? '0' + curDate : curDate) + '日00时00分');
                        }
                        else if (cookieText !== atTipsText) {
                            Tools.setCookie(Const.prevReadAtTipsCookieName, cookieText);
                        }
                        Tools.setCookie(Const.hideMarkReadAtTipsCookieName,
                            atTipsText,
                            Tools.getDate('+' + Const.hideMarkReadAtTipsExpires + 'd')
                        );
                        $this.data('disabled', true);
                        handleBox();
                    });
                }
                if (type === 'at_change_to_cao') {
                    $atTips.text($atTips.text().replace('@', '艹'));
                }
            }
            else if ($atTips.length === 0 && (type === 'no_highlight_extra' || type === 'at_change_to_cao')) {
                var html = ('<div style="width:300px;"><a href="guanjianci.php?gjc={0}" target="_blank" class="indbox6">最近无人{1}你</a>' +
                '<br /><div class="line"></div><div class="c"></div></div><div class="line"></div>')
                    .replace('{0}', KFOL.userName)
                    .replace('{1}', type === 'at_change_to_cao' ? '艹' : '@');
                $('a[href="kf_givemekfb.php"][title="网站虚拟货币"]').parent().before(html);
            }
        }
        else if (type === 'hide_box_2') {
            if ($atTips.length > 0) handleBox();
        }
    },

    /**
     * 高亮at提醒页面中未读的消息
     */
    highlightUnReadAtTipsMsg: function () {
        if ($.trim($('.kf_share1:first').text()) !== '含有关键词 “{0}” 的内容'.replace('{0}', KFOL.userName)) return;
        var timeString = Tools.getCookie(Const.prevReadAtTipsCookieName);
        if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
        var prevString = '';
        $('.kf_share1:eq(1) > tbody > tr:gt(0) > td:first-child').each(function (index) {
            var $this = $(this);
            var curString = $.trim($this.text());
            if (index === 0) prevString = curString;
            if (timeString < curString && prevString >= curString) {
                $this.addClass('pd_highlight');
                prevString = curString;
            }
            else return false;
        });
        $('.kf_share1').on('click', 'td > a', function () {
            Tools.setCookie(Const.prevReadAtTipsCookieName, '', Tools.getDate('-1d'));
        });
    },

    /**
     * 为帖子里的每个楼层添加跳转链接
     */
    addFloorGotoLink: function () {
        $('.readlou > div:nth-child(2) > span').each(function () {
            var $this = $(this);
            var floorText = $this.text();
            if (!/^\d+楼$/.test(floorText)) return;
            var linkName = $this.closest('.readlou').prev().attr('name');
            if (!linkName || !/^\d+$/.test(linkName)) return;
            var url = '{0}read.php?tid={1}&spid={2}'
                .replace('{0}', Tools.getHostNameUrl())
                .replace('{1}', Tools.getUrlParam('tid'))
                .replace('{2}', linkName);
            $this.html('<a class="pd_goto_link" href="{0}" title="复制楼层链接">{1}</a>'.replace('{0}', url).replace('{1}', floorText));
            $this.find('a').click(function (e) {
                e.preventDefault();
                var $this = $(this);
                var url = $this.attr('href');
                $this.data('copy-text', url);
                if (!Tools.copyText($this, '楼层链接已复制')) {
                    prompt('本楼的跳转链接（请按Ctrl+C复制）：', url);
                }
            });
        });
    },

    /**
     * 添加快速跳转到指定楼层的输入框
     */
    addFastGotoFloorInput: function () {
        $('<form><li class="pd_fast_goto_floor">电梯直达 <input class="pd_input" style="width:30px" type="text" maxlength="8" /> ' +
            '<span>楼</span></li></form>')
            .prependTo($('.readtext:first').prev('.readlou').find('> div:first-child > ul'))
            .submit(function (e) {
                e.preventDefault();
                var floor = parseInt($.trim($(this).find('input').val()));
                if (!floor || floor <= 0) return;
                location.href = '{0}read.php?tid={1}&page={2}&floor={3}'
                    .replace('{0}', Tools.getHostNameUrl)
                    .replace('{1}', Tools.getUrlParam('tid'))
                    .replace('{2}', parseInt(floor / Config.perPageFloorNum) + 1)
                    .replace('{3}', floor);
            })
            .find('span')
            .click(function () {
                $(this).closest('form').submit();
            })
            .end()
            .closest('div').next()
            .css({'max-width': '505px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'});
    },

    /**
     * 将页面滚动到指定楼层
     */
    fastGotoFloor: function () {
        var floor = parseInt(Tools.getUrlParam('floor'));
        if (!floor || floor <= 0) return;
        var $floorNode = $('.readlou > div:nth-child(2) > span:contains("{0}楼")'.replace('{0}', floor));
        if ($floorNode.length === 0) return;
        var linkName = $floorNode.closest('.readlou').prev().attr('name');
        if (!linkName || !/^\d+$/.test(linkName)) return;
        location.hash = '#' + linkName;
    },

    /**
     * 高亮今日新发表帖子的发表时间
     */
    highlightNewPost: function () {
        $('.thread1 > tbody > tr > td:last-child').has('a.bl').each(function () {
            var html = $(this).html();
            if (/\|\s*\d{2}:\d{2}<br>\n.*\d{2}:\d{2}/.test(html)) {
                html = html.replace(/(\d{2}:\d{2})<br>/, '<span class="pd_highlight">$1</span><br />');
                $(this).html(html);
            }
        });
    },

    /**
     * 修改指定楼层的神秘颜色
     * @param {jQuery} $element 指定楼层的发帖者的用户名链接的jQuery对象
     * @param {string} color 神秘颜色
     */
    modifyFloorSmColor: function ($element, color) {
        if ($element.is('.readidmsbottom > a')) $element.css('color', color);
        $element.closest('.readtext').css('border-color', color)
            .prev('.readlou').css('border-color', color)
            .next().next('.readlou').css('border-color', color);
    },

    /**
     * 修改本人的神秘颜色
     */
    modifyMySmColor: function () {
        var $my = $('.readidmsbottom > a[href="profile.php?action=show&uid={0}"]'.replace('{0}', KFOL.uid));
        if ($my.length === 0) $my = $('.readidmleft > a[href="profile.php?action=show&uid={0}"]'.replace('{0}', KFOL.uid));
        if ($my.length > 0) KFOL.modifyFloorSmColor($my, Config.customMySmColor);
    },

    /**
     * 修改各等级神秘颜色
     */
    modifySmColor: function () {
        if (Config.customSmColorConfigList.length === 0) return;
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            var smLevel = '';
            if ($this.is('.readidmleft > a')) {
                smLevel = $this.parent().next('.readidmright').text().toUpperCase();
                if (!/(-?\d+|MAX)/i.test(smLevel)) return;
            }
            else {
                var matches = /(-?\d+|MAX)级神秘/i.exec($this.parent().contents().last().text());
                if (!matches) return;
                smLevel = matches[1].toUpperCase();
            }
            $.each(Config.customSmColorConfigList, function (index, data) {
                if (Tools.compareSmLevel(smLevel, data.min) >= 0 && Tools.compareSmLevel(smLevel, data.max) <= 0) {
                    KFOL.modifyFloorSmColor($this, data.color);
                    return false;
                }
            });
        });
    },

    /**
     * 在版块页面中添加帖子页数快捷链接
     */
    addFastGotoThreadPageLink: function () {
        $('.threadtit1 > a[href^="read.php"]').each(function () {
            var $link = $(this);
            var floorNum = $link.closest('td').next().find('ul > li > a').contents().eq(0).text();
            if (!floorNum || floorNum < Config.perPageFloorNum) return;
            var url = $link.attr('href');
            var totalPageNum = Math.floor(floorNum / Config.perPageFloorNum) + 1;
            var html = '';
            for (var i = 1; i < totalPageNum; i++) {
                if (i > Config.maxFastGotoThreadPageNum) {
                    if (i + 1 <= totalPageNum) {
                        html += '..<a href="{0}&page={1}">{2}</a>'
                            .replace('{0}', url)
                            .replace('{1}', totalPageNum)
                            .replace('{2}', totalPageNum);
                    }
                    break;
                }
                html += '<a href="{0}&page={1}">{2}</a>'.replace('{0}', url).replace('{1}', i + 1).replace('{2}', i + 1);
            }
            html = '<span class="pd_thread_page">...{0}</span>'.replace('{0}', html);
            $link.after(html).parent().css('white-space', 'normal');
        });
    },

    /**
     * 调整帖子内容宽度，使其保持一致
     */
    adjustThreadContentWidth: function () {
        $('head').append(
            '<style type="text/css">' +
            '.readtext > table > tbody > tr > td { padding-left: 192px; }' +
            '.readidms, .readidm { margin-left: -192px !important; }' +
            '</style>'
        );
    },

    /**
     * 调整帖子内容字体大小
     */
    adjustThreadContentFontSize: function () {
        if (Config.threadContentFontSize > 0 && Config.threadContentFontSize !== 12) {
            $('head').append(
                '<style type="text/css">' +
                '.readtext td { font-size: {0}px; line-height: 1.6em; }'.replace('{0}', Config.threadContentFontSize) +
                '.readtext td > div, .readtext td > .read_fds { font-size: 12px; }' +
                '</style>'
            );
        }
    },

    /**
     * 添加复制购买人名单的链接
     */
    addCopyBuyersListLink: function () {
        $('<a style="margin:0 2px 0 5px" href="#">复制名单</a>').insertAfter('.readtext select[name="buyers"]').click(function (e) {
            e.preventDefault();
            var buyerList = [];
            $(this).prev('select').children('option').each(function (index) {
                var name = $(this).text();
                if (index === 0 || name === '-----------') return;
                buyerList.push(name);
            });
            if (buyerList.length === 0) {
                alert('暂时无人购买');
                return;
            }
            if ($('#pd_copy_buyer_list').length > 0) return;
            var html =
                '<div class="pd_cfg_main">' +
                '  <textarea style="width:200px;height:300px;margin:5px 0" readonly="readonly"></textarea>' +
                '</div>';
            var $dialog = Dialog.create('pd_copy_buyer_list', '购买人名单', html);
            Dialog.show('pd_copy_buyer_list');
            $dialog.find('textarea').val(buyerList.join('\n')).select().focus();
        });
    },

    /**
     * 显示统计回帖者名单对话框
     * @param {string[]} replyerList 回帖者名单列表
     */
    showStatReplyersDialog: function (replyerList) {
        var html =
            '<div class="pd_cfg_main">' +
            '  <div id="pd_replyer_list_filter" style="margin-top:5px">' +
            '    <label><input type="checkbox" checked="checked" />显示楼层号</label>' +
            '    <label><input type="checkbox" />去除重复</label>' +
            '    <label><input type="checkbox" />去除楼主</label>' +
            '  </div>' +
            '  <div style="color:#FF0000" id="pd_replyer_list_stat"></div>' +
            '  <textarea style="width:250px;height:300px;margin:5px 0" readonly="readonly"></textarea>' +
            '</div>';
        var $dialog = Dialog.create('pd_replyer_list', '回帖者名单', html);

        var $filterNodes = $dialog.find('#pd_replyer_list_filter input');
        $filterNodes.click(function () {
            var list = replyerList.concat();
            var isShowFloor = $filterNodes.eq(0).prop('checked'),
                isDeduplication = $filterNodes.eq(1).prop('checked'),
                isRemoveTopFloor = $filterNodes.eq(2).prop('checked');
            if (isDeduplication) {
                for (var i in list) {
                    if ($.inArray(list[i], list) !== parseInt(i))
                        list[i] = null;
                }
            }
            if (isRemoveTopFloor) {
                var topFloor = $('.readtext:first').find('.readidmsbottom, .readidmleft').find('a').text();
                for (var i in list) {
                    if (list[i] === topFloor)
                        list[i] = null;
                }
            }
            var content = '';
            var num = 0;
            for (var i in list) {
                if (!list[i]) continue;
                content += (isShowFloor ? i + 'L：' : '') + list[i] + '\n';
                num++;
            }
            $dialog.find('textarea').val(content);
            $('#pd_replyer_list_stat').html('共有<b>{0}</b>条项目'.replace('{0}', num));
        });
        $dialog.find('#pd_replyer_list_filter input:first').triggerHandler('click');

        Dialog.show('pd_replyer_list');
        $dialog.find('input:first').focus();
    },

    /**
     * 添加统计回帖者名单的链接
     */
    addStatReplyersLink: function () {
        if (Tools.getCurrentThreadPage() !== 1) return;
        $('<li><a href="#" title="统计回帖者名单">[统计回帖]</a></li>').prependTo('.readtext:first + .readlou > div > .pages')
            .find('a').click(function (e) {
            e.preventDefault();
            if ($('#pd_replyer_list').length > 0) return;

            var tid = Tools.getUrlParam('tid');
            if (!tid) return;
            var value = $.trim(prompt('统计到第几楼？（0表示统计所有楼层，可用m-n的方式来设定统计楼层的区间范围）', 0));
            if (value === '') return;
            if (!/^\d+(-\d+)?$/.test(value)) {
                alert('统计楼层格式不正确');
                return;
            }
            var startFloor = 0, endFloor = 0;
            var valueArr = value.split('-');
            if (valueArr.length === 2) {
                startFloor = parseInt(valueArr[0]);
                endFloor = parseInt(valueArr[1]);
            }
            else endFloor = parseInt(valueArr[0]);
            if (endFloor < startFloor) {
                alert('统计楼层格式不正确');
                return;
            }
            var matches = /(\d+)页/.exec($('.pages:eq(0) > li:last-child > a').text());
            var maxPage = matches ? parseInt(matches[1]) : 1;
            if (startFloor === 0) startFloor = 1;
            if (endFloor === 0) endFloor = maxPage * Config.perPageFloorNum - 1;
            var startPage = Math.floor(startFloor / Config.perPageFloorNum) + 1;
            var endPage = Math.floor(endFloor / Config.perPageFloorNum) + 1;
            if (endPage > maxPage) endPage = maxPage;
            if (endPage - startPage > Const.statReplyersMaxPage) {
                alert('需访问的总页数不可超过' + Const.statReplyersMaxPage);
                return;
            }

            KFOL.showWaitMsg('<strong>正在统计回帖名单中...</strong><i>剩余页数：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', endPage - startPage + 1)
                , true);
            var isStop = false;
            $(document).clearQueue('StatReplyers');
            var replyerList = [];
            $.each(new Array(endPage), function (index) {
                if (index + 1 < startPage) return;
                $(document).queue('StatReplyers', function () {
                    var url = 'read.php?tid={0}&page={1}&t={2}'.replace('{0}', tid).replace('{1}', index + 1).replace('{2}', new Date().getTime());
                    $.ajax({
                        type: 'GET',
                        url: url,
                        timeout: Const.defAjaxTimeout,
                        success: function (html) {
                            var matches = html.match(/<span style=".+?">\d+楼<\/span> <span style=".+?">(.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+" target="_blank" style=".+?">.+?<\/a>/gi);
                            for (var i in matches) {
                                var floorMatches = /<span style=".+?">(\d+)楼<\/span>(?:.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+".+?>(.+?)<\/a>/i.exec(matches[i]);
                                if (!floorMatches) continue;
                                var floor = parseInt(floorMatches[1]);
                                if (floor < startFloor) continue;
                                if (floor > endFloor) {
                                    isStop = true;
                                    break;
                                }
                                replyerList[floor] = floorMatches[2];
                            }
                        },
                        error: function () {
                            isStop = true;
                            alert('因连接超时，统计回帖名单操作中止');
                        },
                        complete: function () {
                            var $remainingNum = $('#pd_remaining_num');
                            $remainingNum.text(parseInt($remainingNum.text()) - 1);
                            isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                            if (isStop) $(document).clearQueue('StatReplyers');

                            if (isStop || index === endPage - 1) {
                                KFOL.removePopTips($('.pd_pop_tips'));
                                KFOL.showStatReplyersDialog(replyerList);
                            }
                            else {
                                setTimeout(function () {
                                    $(document).dequeue('StatReplyers');
                                }, Const.defAjaxInterval);
                            }
                        },
                        dataType: 'html'
                    });
                });
            });
            $(document).dequeue('StatReplyers');
        });
    },

    /**
     * 获取多重引用数据
     * @returns {Object[]} 多重引用数据列表
     */
    getMultiQuoteData: function () {
        var quoteList = [];
        $('.pd_multi_quote_chk input:checked').each(function () {
            var $readLou = $(this).closest('.readlou');
            var matches = /(\d+)楼/.exec($readLou.find('.pd_goto_link').text());
            var floor = matches ? parseInt(matches[1]) : 0;
            var spid = $readLou.prev('a').attr('name');
            var userName = $readLou.next('.readtext').find('.readidmsbottom > a, .readidmleft > a').text();
            if (!userName) return;
            quoteList.push({floor: floor, spid: spid, userName: userName});
        });
        return quoteList;
    },

    /**
     * 添加多重回复和多重引用的按钮
     */
    addMultiQuoteButton: function () {
        var replyUrl = $('a[href^="post.php?action=reply"].b_tit2').attr('href');
        if (!replyUrl) return;
        $('<li class="pd_multi_quote_chk"><label title="多重引用"><input type="checkbox" /> 引</label></li>')
            .prependTo($('.readlou > div:first-child > ul').has('a[title="引用回复这个帖子"]'))
            .find('input').click(function () {
            var tid = parseInt(Tools.getUrlParam('tid'));
            var data = localStorage[Const.multiQuoteStorageName];
            if (data) {
                try {
                    data = JSON.parse(data);
                    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) data = null;
                    else if (typeof data.tid === 'undefined' || data.tid !== tid || $.type(data.quoteList) !== 'array')
                        data = null;
                }
                catch (ex) {
                    data = null;
                }
            }
            else {
                data = null;
            }
            var quoteList = KFOL.getMultiQuoteData();
            if (!data) {
                localStorage.removeItem(Const.multiQuoteStorageName);
                data = {tid: tid, quoteList: []};
            }
            var page = Tools.getCurrentThreadPage();
            if (quoteList.length > 0) data.quoteList[page] = quoteList;
            else delete data.quoteList[page];
            localStorage[Const.multiQuoteStorageName] = JSON.stringify(data);
        });
        $('.readlou:last').next('div').find('table > tbody > tr > td:last-child')
            .css({'text-align': 'right', 'width': '320px'})
            .append(('<span class="b_tit2" style="margin-left:5px"><a style="display:inline-block" href="#" title="多重回复">回复</a> ' +
            '<a style="display:inline-block" href="{0}" title="多重引用">引用</a></span>')
                .replace('{0}', replyUrl + '&multiquote=true'))
            .find('.b_tit2 > a:eq(0)').click(function (e) {
            e.preventDefault();
            KFOL.handleMultiQuote(1);
        });
    },

    /**
     * 处理多重回复和多重引用
     * @param {number} type 处理类型，1：多重回复；2：多重引用
     */
    handleMultiQuote: function (type) {
        Func.run('KFOL.handleMultiQuote_before_', type);
        if ($('#pd_clear_multi_quote_data').length === 0) {
            $('<a id="pd_clear_multi_quote_data" style="margin-left:7px" title="清除在浏览器中保存的多重引用数据" href="#">清除引用数据</a>')
                .insertAfter('input[name="diy_guanjianci"]').click(function (e) {
                e.preventDefault();
                localStorage.removeItem(Const.multiQuoteStorageName);
                $('input[name="diy_guanjianci"]').val('');
                if (type === 2) $('#textarea').val('');
                else $('textarea[name="atc_content"]').val('');
                alert('多重引用数据已被清除');
            });
        }
        var data = localStorage[Const.multiQuoteStorageName];
        if (!data) return;
        try {
            data = JSON.parse(data);
        }
        catch (ex) {
            return;
        }
        if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) return;
        var tid = parseInt(Tools.getUrlParam('tid')),
            fid = parseInt(Tools.getUrlParam('fid'));
        if (!tid || typeof data.tid === 'undefined' || data.tid !== tid || $.type(data.quoteList) !== 'array') return;
        if (type === 2 && !fid) return;
        var list = [];
        for (var i in data.quoteList) {
            if ($.type(data.quoteList[i]) !== 'array') continue;
            for (var j in data.quoteList[i]) {
                list.push(data.quoteList[i][j]);
            }
        }
        if (list.length === 0) {
            localStorage.removeItem(Const.multiQuoteStorageName);
            return;
        }
        var keyword = [];
        var content = '';
        if (type === 2) {
            KFOL.showWaitMsg('<strong>正在获取引用内容中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                    .replace('{0}', list.length)
                , true);
            $(document).clearQueue('MultiQuote');
        }
        $.each(list, function (index, quote) {
            if (typeof quote.floor === 'undefined' || typeof quote.spid === 'undefined') return;
            if ($.inArray(quote.userName, keyword) === -1) keyword.push(quote.userName);
            if (type === 2) {
                $(document).queue('MultiQuote', function () {
                    var url = 'post.php?action=quote&fid={0}&tid={1}&pid={2}&article={3}&t={4}'
                        .replace('{0}', fid)
                        .replace('{1}', tid)
                        .replace('{2}', quote.spid)
                        .replace('{3}', quote.floor)
                        .replace('{4}', new Date().getTime());
                    $.get(url, function (html) {
                        var matches = /<textarea id="textarea".*?>((.|\n)+?)<\/textarea>/i.exec(html);
                        if (matches) content += Tools.getRemoveUnpairedBBCodeQuoteContent(Tools.htmlDecode(matches[1]).replace(/\n\n/g, '\n')) + '\n';
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        if (index === list.length - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            $('#textarea').val(content).focus();
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('MultiQuote');
                            }, 100);
                        }
                    }, 'html');
                });
            }
            else {
                content += '[quote]回 {0}楼({1}) 的帖子[/quote]\n'
                    .replace('{0}', quote.floor)
                    .replace('{1}', quote.userName);
            }
        });
        $('input[name="diy_guanjianci"]').val(keyword.join(','));
        $('form[name="FORM"]').submit(function () {
            localStorage.removeItem(Const.multiQuoteStorageName);
        });
        if (type === 2) $(document).dequeue('MultiQuote');
        else $('textarea[name="atc_content"]').val(content).focus();
        Func.run('KFOL.handleMultiQuote_after_', type);
    },

    /**
     * 去除引用内容中不配对的BBCode
     */
    removeUnpairedBBCodeInQuoteContent: function () {
        var $content = $('#textarea');
        var content = $content.val();
        var matches = /\[quote\](.|\r|\n)+?\[\/quote\]/.exec(content);
        if (matches) {
            var workedContent = Tools.getRemoveUnpairedBBCodeQuoteContent(matches[0]);
            if (matches[0] !== workedContent) {
                $content.val(content.replace(matches[0], workedContent));
            }
        }
    },

    /**
     * 在短消息页面中添加快速取款的链接
     */
    addFastDrawMoneyLink: function () {
        if ($('td:contains("SYSTEM")').length === 0 || $('td:contains("收到了他人转账的KFB")').length === 0) return;
        var $msg = $('.thread2 > tbody > tr:eq(-2) > td:last');
        var html = $msg.html();
        var matches = /给你转帐(\d+)KFB/i.exec(html);
        if (matches) {
            var money = parseInt(matches[1]);
            $msg.html(html.replace(/会员\[(.+?)\]通过论坛银行/, '会员[<a target="_blank" href="profile.php?action=show&username=$1">$1</a>]通过论坛银行')
                .replace(matches[0], '给你转帐<span class="pd_stat"><em>{0}</em></span>KFB'.replace('{0}', money.toLocaleString()))
            );

            $('<br /><a title="从活期存款中取出当前转账的金额" href="#">快速取款</a> | <a title="取出银行账户中的所有活期存款" href="#">取出所有存款</a>')
                .appendTo($msg)
                .filter('a:eq(0)')
                .click(function (e) {
                    e.preventDefault();
                    KFOL.removePopTips($('.pd_pop_tips'));
                    Bank.drawCurrentDeposit(money);
                })
                .end()
                .filter('a:eq(1)')
                .click(function (e) {
                    e.preventDefault();
                    KFOL.removePopTips($('.pd_pop_tips'));
                    KFOL.showWaitMsg('<strong>正在获取当前活期存款金额...</strong>', true);
                    $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
                        KFOL.removePopTips($('.pd_pop_tips'));
                        var matches = /活期存款：(\d+)KFB<br \/>/i.exec(html);
                        if (!matches) {
                            alert('获取当前活期存款金额失败');
                            return;
                        }
                        var money = parseInt(matches[1]);
                        if (money <= 0) {
                            KFOL.showMsg('当前活期存款余额为零', -1);
                            return;
                        }
                        Bank.drawCurrentDeposit(money);
                    }, 'html');
                });

            $('a[href^="message.php?action=write&remid="]').attr('href', '#').addClass('pd_disabled_link').click(function (e) {
                e.preventDefault();
                alert('本短消息由系统发送，请勿直接回复；如需回复，请点击给你转账的用户链接，向其发送短消息');
            });
        }
    },

    /**
     * 将帖子和短消息中的绯月其它域名的链接修改为当前域名
     */
    modifyKFOtherDomainLink: function () {
        $('.readtext a, .thread2 a').each(function () {
            var $this = $(this);
            var url = $this.attr('href');
            if (/m\.miaola\.info\//i.test(url)) return;
            var matches = /^(https?:\/\/(?:[\w\.]+?\.)?(?:2dgal|ddgal|9gal|9baka|9moe|kfgal|2dkf|miaola|kfer)\.\w+?\/).+/i.exec(url);
            if (matches) $this.attr('href', url.replace(matches[1], Tools.getHostNameUrl()));
        });
    },

    /**
     * 处理购买帖子按钮
     */
    handleBuyThreadBtn: function () {
        $('.readtext input[type="button"][value="愿意购买,支付KFB"]').each(function () {
            var $this = $(this);
            var matches = /此帖售价\s*(\d+)\s*KFB/i.exec($this.closest('legend').contents().eq(0).text());
            if (!matches) return;
            var sell = parseInt(matches[1]);
            matches = /location\.href="(.+?)"/i.exec($this.attr('onclick'));
            if (!matches) return;
            $this.data('sell', sell).data('url', matches[1]).removeAttr('onclick').click(function (e) {
                e.preventDefault();
                var $this = $(this);
                var sell = $this.data('sell');
                var url = $this.data('url');
                if (!sell || !url) return;
                if (sell >= Const.minBuyThreadWarningSell && !confirm('此贴售价{0}KFB，是否购买？'.replace('{0}', sell))) return;
                if (Config.buyThreadViaAjaxEnabled) {
                    var $wait = KFOL.showWaitMsg('正在购买帖子&hellip;', true);
                    $.get(url, function (html) {
                        KFOL.removePopTips($wait);
                        if (/操作完成/.test(html)) {
                            location.reload();
                        }
                        else if (/您已经购买此帖/.test(html)) {
                            alert('你已经购买过此帖');
                            location.reload();
                        }
                        else {
                            alert('帖子购买失败');
                        }
                    });
                }
                else location.href = url;
            });
        });
    },

    /**
     * 添加批量购买帖子的按钮
     */
    addBatchBuyThreadButton: function () {
        var $btns = $('.readtext input[type="button"][value="愿意购买,支付KFB"]');
        if ($btns.length === 0) return;
        $btns.each(function () {
            var $this = $(this);
            var sell = $this.data('sell');
            var url = $this.data('url');
            if (!sell || !url) return;
            $this.after('<input class="pd_buy_thread" style="margin-left:10px;vertical-align:middle" type="checkbox" data-sell="{0}" data-url="{1}" />'
                .replace('{0}', sell)
                .replace('{1}', url)
            );
        });
        $('<span style="margin:0 5px">|</span><a class="pd_buy_thread_btn" title="批量购买所选帖子" href="#">批量购买</a>')
            .insertAfter('td > a[href^="kf_tidfavor.php?action=favor&tid="]')
            .filter('a')
            .click(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
                var threadList = [];
                var totalSell = 0;
                $('.pd_buy_thread:checked').each(function () {
                    var $this = $(this);
                    var url = $this.data('url');
                    var sell = parseInt($this.data('sell'));
                    if (url && !isNaN(sell)) {
                        threadList.push({url: url, sell: sell});
                        totalSell += sell;
                    }
                });
                if (threadList.length === 0) {
                    alert('请选择要购买的帖子');
                    return;
                }
                if (confirm('你共选择了{0}个帖子，总售价{1}KFB，均价{2}KFB，是否批量购买？'
                        .replace('{0}', threadList.length)
                        .replace('{1}', totalSell.toLocaleString())
                        .replace('{2}', Tools.getFixedNumberLocaleString(totalSell / threadList.length, 2))
                    )
                ) {
                    KFOL.showWaitMsg('<strong>正在购买帖子中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', threadList.length)
                        , true);
                    KFOL.buyThreads(threadList);
                }
            }).parent().mouseenter(function () {
            $('<span style="margin-left:5px">[<a href="#">全选</a><a style="margin-left:5px" href="#">反选</a>]</span>').insertAfter($(this).find('.pd_buy_thread_btn'))
                .find('a:first')
                .click(function (e) {
                    e.preventDefault();
                    var $buyThread = $('.pd_buy_thread');
                    $buyThread.prop('checked', true);
                    alert('共选择了{0}项'.replace('{0}', $buyThread.length));
                })
                .next('a')
                .click(function (e) {
                    e.preventDefault();
                    var totalNum = 0;
                    $('.pd_buy_thread').each(function () {
                        var $this = $(this);
                        $this.prop('checked', !$this.prop('checked'));
                        if ($this.prop('checked')) totalNum++;
                    });
                    alert('共选择了{0}项'.replace('{0}', totalNum));
                });
        }).mouseleave(function () {
            $(this).find('.pd_buy_thread_btn').next('span').remove();
        });
    },

    /**
     * 购买指定的一系列帖子
     * @param {Object[]} threadList 购买帖子列表，threadList[n][url]：购买帖子的URL；threadList[n][sell]：购买帖子的售价
     */
    buyThreads: function (threadList) {
        var successNum = 0, failNum = 0, totalSell = 0;
        $(document).clearQueue('BuyThreads');
        $.each(threadList, function (index, thread) {
            $(document).queue('BuyThreads', function () {
                $.ajax({
                    type: 'GET',
                    url: thread.url + '&t=' + new Date().getTime(),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('购买帖子', html);
                        if (/操作完成/.test(html)) {
                            successNum++;
                            totalSell += thread.sell;
                        }
                        else failNum++;
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('BuyThreads');

                        if (isStop || index === threadList.length - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('购买帖子', '共有`{0}`个帖子购买成功'.replace('{0}', successNum), {pay: {'KFB': -totalSell}});
                            }
                            console.log('共有{0}个帖子购买成功，共有{1}个帖子购买失败，KFB-{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', totalSell)
                            );
                            KFOL.showMsg({
                                msg: '<strong>共有<em>{0}</em>个帖子购买成功{1}</strong><i>KFB<ins>-{2}</ins></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个帖子购买失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', totalSell)
                                , duration: -1
                            });
                            Func.run('KFOL.buyThreads_after_', threadList);
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('BuyThreads');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('BuyThreads');
    },

    /**
     * 添加关注和屏蔽用户以及用户备注的链接
     */
    addFollowAndBlockAndMemoUserLink: function () {
        var matches = /(.+?)\s*详细信息/.exec($('td:contains("详细信息")').text());
        if (!matches) return;
        var userName = $.trim(matches[1]);
        $('<span>[<a href="#">关注用户</a>] [<a href="#">屏蔽用户</a>]</span><br /><span>[<a href="#">添加备注</a>]</span><br />')
            .appendTo($('a[href^="message.php?action=write&touid="]').parent())
            .find('a').each(function () {
            var $this = $(this);
            if ($this.is('a:contains("备注")')) {
                var memo = '';
                for (var name in Config.userMemoList) {
                    if (name === userName) {
                        memo = Config.userMemoList[name];
                        break;
                    }
                }
                if (memo !== '') {
                    $this.text('修改备注').data('memo', memo);
                    var $info = $('.log1 > tbody > tr:last-child > td:last-child');
                    $info.html('备注：' + memo + '<br />' + $info.html());
                }
            }
            else {
                var str = '关注';
                var userList = Config.followUserList;
                if ($this.text().indexOf('屏蔽') > -1) {
                    str = '屏蔽';
                    userList = Config.blockUserList;
                }
                if (Tools.inFollowOrBlockUserList(userName, userList) > -1) {
                    $this.addClass('pd_highlight').text('解除' + str);
                }
            }
        }).click(function (e) {
            e.preventDefault();
            ConfigMethod.read();
            var $this = $(this);
            if ($this.is('a:contains("备注")')) {
                var memo = $this.data('memo');
                if (!memo) memo = '';
                var value = prompt('为此用户添加备注（要删除备注请留空）：', memo);
                if (value === null) return;
                if (!Config.userMemoEnabled) Config.userMemoEnabled = true;
                value = $.trim(value);
                if (value) {
                    Config.userMemoList[userName] = value;
                    $this.text('修改备注');
                }
                else {
                    delete Config.userMemoList[userName];
                    $this.text('添加备注');
                }
                $this.data('memo', value);
                ConfigMethod.write();
            }
            else {
                var str = '关注';
                var userList = Config.followUserList;
                if ($this.text().indexOf('屏蔽') > -1) {
                    str = '屏蔽';
                    userList = Config.blockUserList;
                    if (!Config.blockUserEnabled) Config.blockUserEnabled = true;
                }
                else {
                    if (!Config.followUserEnabled) Config.followUserEnabled = true;
                }
                if ($this.text() === '解除' + str) {
                    var index = Tools.inFollowOrBlockUserList(userName, userList);
                    if (index > -1) {
                        userList.splice(index, 1);
                        ConfigMethod.write();
                    }
                    $this.removeClass('pd_highlight').text(str + '用户');
                    alert('该用户已被解除' + str);
                }
                else {
                    if (Tools.inFollowOrBlockUserList(userName, userList) === -1) {
                        if (str === '屏蔽') {
                            var type = Config.blockUserDefaultType;
                            type = prompt('请填写屏蔽类型，0：屏蔽主题和回帖；1：仅屏蔽主题；2：仅屏蔽回帖', type);
                            if (type === null) return;
                            type = parseInt($.trim(type));
                            if (isNaN(type) || type < 0 || type > 2) type = Config.blockUserDefaultType;
                            userList.push({name: userName, type: type});
                        }
                        else {
                            userList.push({name: userName});
                        }
                        ConfigMethod.write();
                    }
                    $this.addClass('pd_highlight').text('解除' + str);
                    alert('该用户已被' + str);
                }
            }
        });
    },

    /**
     * 关注用户
     */
    followUsers: function () {
        if (Config.followUserList.length === 0) return;
        if (KFOL.isInHomePage && Config.highlightFollowUserThreadInHPEnabled) {
            $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
                var $this = $(this);
                var matches = /》by：(.+)/.exec($this.attr('title'));
                if (!matches) return;
                if (Tools.inFollowOrBlockUserList(matches[1], Config.followUserList) > -1) {
                    $this.addClass('pd_highlight');
                }
            });
        }
        else if (location.pathname === '/thread.php') {
            $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
                var $this = $(this);
                if (Tools.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                    $this.addClass('pd_highlight');
                    if (Config.highlightFollowUserThreadLinkEnabled)
                        $this.parent('td').prev('td').prev('td').find('div > a[href^="read.php?tid="]').addClass('pd_highlight');
                }
            });
        }
        else if (location.pathname === '/read.php') {
            $('.readidmsbottom > a, .readidmleft > a').each(function () {
                var $this = $(this);
                if (Tools.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                    $this.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child')
                        .find('a').addBack().addClass('pd_highlight');
                }
            });
        }
        else if (location.pathname === '/guanjianci.php' || location.pathname === '/kf_share.php') {
            $('.kf_share1 > tbody > tr > td:last-child').each(function () {
                var $this = $(this);
                if (Tools.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                    $this.addClass('pd_highlight');
                }
            });
        }
        else if (location.pathname === '/search.php') {
            $('.thread1 a[href^="profile.php?action=show&uid="]').each(function () {
                var $this = $(this);
                if (Tools.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                    $this.addClass('pd_highlight');
                }
            });
        }
    },

    /**
     * 屏蔽用户
     */
    blockUsers: function () {
        if (Config.blockUserList.length === 0) return;
        var blockNum = 0;
        if (KFOL.isInHomePage) {
            $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
                var $this = $(this);
                var matches = /》by：(.+)/.exec($this.attr('title'));
                if (!matches) return;
                var i = Tools.inFollowOrBlockUserList(matches[1], Config.blockUserList);
                if (i > -1 && Config.blockUserList[i].type < 2) {
                    blockNum++;
                    $this.parent('li').remove();
                }
            });
        }
        else if (location.pathname === '/thread.php') {
            var fid = parseInt($('input[name="f_fid"]:first').val());
            if (!fid) return;
            if (Config.blockUserForumType === 1 && $.inArray(fid, Config.blockUserFidList) === -1) return;
            else if (Config.blockUserForumType === 2 && $.inArray(fid, Config.blockUserFidList) > -1) return;
            $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
                var $this = $(this);
                var i = Tools.inFollowOrBlockUserList($this.text(), Config.blockUserList);
                if (i > -1 && Config.blockUserList[i].type < 2) {
                    blockNum++;
                    $this.closest('tr').remove();
                }
            });
        }
        else if (location.pathname === '/read.php') {
            if (Config.blockUserForumType > 0) {
                var fid = parseInt($('input[name="fid"]:first').val());
                if (!fid) return;
                if (Config.blockUserForumType === 1 && $.inArray(fid, Config.blockUserFidList) === -1) return;
                else if (Config.blockUserForumType === 2 && $.inArray(fid, Config.blockUserFidList) > -1) return;
            }
            var page = Tools.getCurrentThreadPage();
            $('.readidmsbottom > a, .readidmleft > a').each(function (index) {
                var $this = $(this);
                var i = Tools.inFollowOrBlockUserList($this.text(), Config.blockUserList);
                if (i > -1) {
                    var type = Config.blockUserList[i].type;
                    if (index === 0 && page === 1 && type > 1) return;
                    else if ((index === 0 && page !== 1 || index > 0) && type === 1) return;
                    blockNum++;
                    var $lou = $this.closest('.readtext');
                    $lou.prev('.readlou').remove().end().next('.readlou').remove().end().remove();
                }
            });
            $('.readtext fieldset:has(legend:contains("Quote:"))').each(function () {
                var $this = $(this);
                var text = $this.text();
                for (var i in Config.blockUserList) {
                    if (Config.blockUserList[i].type === 1) continue;
                    try {
                        var regex1 = new RegExp('^Quote:引用(第\\d+楼|楼主)' + Config.blockUserList[i].name + '于', 'i');
                        var regex2 = new RegExp('^Quote:回\\s*\\d+楼\\(' + Config.blockUserList[i].name + '\\)\\s*的帖子', 'i');
                        if (regex1.test(text) || regex2.test(text)) {
                            $this.html('<legend>Quote:</legend><mark class="pd_custom_tips" title="被屏蔽用户：{0}">该用户已被屏蔽</mark>'
                                .replace('{0}', Config.blockUserList[i].name)
                            );
                        }
                    }
                    catch (ex) {
                    }
                }
            });
        }
        else if (location.pathname === '/guanjianci.php' && Config.blockUserAtTipsEnabled) {
            $('.kf_share1 > tbody > tr > td:last-child').each(function () {
                var $this = $(this);
                if (Tools.inFollowOrBlockUserList($this.text(), Config.blockUserList) > -1) {
                    blockNum++;
                    $this.closest('tr').remove();
                }
            });
        }
        if (blockNum > 0) console.log('【屏蔽用户】共有{0}个项目被屏蔽'.replace('{0}', blockNum));
    },

    /**
     * 屏蔽帖子
     */
    blockThread: function () {
        if (Config.blockThreadList.length === 0) return;
        /**
         * 是否屏蔽帖子
         * @param {string} title 帖子标题
         * @param {string} userName 用户名
         * @param {number} [fid] 版块ID
         * @returns {boolean} 是否屏蔽
         */
        var isBlock = function (title, userName, fid) {
            for (var i in Config.blockThreadList) {
                var keyWord = Config.blockThreadList[i].keyWord;
                var re = null;
                if (/^\/.+\/[gimy]*$/.test(keyWord)) {
                    try {
                        re = eval(keyWord);
                    }
                    catch (ex) {
                        console.log(ex);
                        continue;
                    }
                }
                if (userName) {
                    if (Config.blockThreadList[i].includeUser) {
                        if ($.inArray(userName, Config.blockThreadList[i].includeUser) === -1) continue;
                    }
                    else if (Config.blockThreadList[i].excludeUser) {
                        if ($.inArray(userName, Config.blockThreadList[i].excludeUser) > -1) continue;
                    }
                }
                if (fid) {
                    if (Config.blockThreadList[i].includeFid) {
                        if ($.inArray(fid, Config.blockThreadList[i].includeFid) === -1) continue;
                    }
                    else if (Config.blockThreadList[i].excludeFid) {
                        if ($.inArray(fid, Config.blockThreadList[i].excludeFid) > -1) continue;
                    }
                }
                if (re) {
                    if (re.test(title)) return true;
                }
                else {
                    if (title.toLowerCase().indexOf(keyWord.toLowerCase()) > -1) return true;
                }
            }
            return false;
        };

        var num = 0;
        if (KFOL.isInHomePage) {
            $('.b_tit4 a, .b_tit4_1 a').each(function () {
                var $this = $(this);
                var matches = /》by：(.+)/.exec($this.attr('title'));
                var userName = '';
                if (matches) userName = matches[1];
                if (isBlock($this.text(), userName)) {
                    num++;
                    $this.parent('li').remove();
                }
            });
        }
        else if (location.pathname === '/thread.php') {
            var fid = parseInt($('input[name="f_fid"]:first').val());
            if (!fid) return;
            $('.threadtit1 a[href^="read.php"]').each(function () {
                var $this = $(this);
                if (isBlock($this.text(), $this.closest('tr').find('td:last-child > a.bl').text(), fid)) {
                    num++;
                    $this.closest('tr').remove();
                }
            });
        }
        else if (location.pathname === '/read.php') {
            if (Tools.getCurrentThreadPage() !== 1) return;
            var $threadInfo = $('form[name="delatc"] > div:first > table > tbody');
            var title = $threadInfo.find('tr:first-child > td > span').text();
            if (!title) return;
            var $userName = $('.readidmsbottom > a, .readidmleft > a').eq(0);
            if ($userName.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child').text() !== '楼主') return;
            var userName = $userName.text();
            if (!userName) return;
            var fid = parseInt($('input[name="fid"]:first').val());
            if (!fid) return;
            if (isBlock(title, userName, fid)) {
                num++;
                var $lou = $userName.closest('.readtext');
                $lou.prev('.readlou').remove().end().next('.readlou').remove().end().remove();
            }
        }
        if (num > 0) console.log('【屏蔽帖子】共有{0}个帖子被屏蔽'.replace('{0}', num));
    },

    /**
     * 将侧边栏修改为和手机相同的平铺样式
     */
    modifySideBar: function () {
        $('#r_menu').replaceWith(
            '<div id="r_menu" style="width:140px;color:#9999FF;font-size:14px;line-height:24px;text-align:center;border:1px #DDDDFF solid;padding:5px;overflow:hidden;">' +
            '	<span style="color:#ff9999;">游戏</span><br />' +
            '	<a href="thread.php?fid=102">游戏推荐</a> | <a href="thread.php?fid=106">新作动态</a><br />' +
            '	<a href="thread.php?fid=52">游戏讨论</a> | <a href="thread.php?fid=24">疑难互助</a><br />' +
            '	<a href="thread.php?fid=16">种子下载</a> | <a href="thread.php?fid=41">网盘下载</a><br />' +
            '	<a href="thread.php?fid=67">图片共享</a> | <a href="thread.php?fid=57">同人漫本</a><br />' +
            '	<span style="color:#ff9999;">动漫音乐</span><br />' +
            '	<a href="thread.php?fid=84">动漫讨论</a> | <a href="thread.php?fid=92">动画共享</a><br />' +
            '	<a href="thread.php?fid=127">漫画小说</a> | <a href="thread.php?fid=68">音乐共享</a><br />' +
            '	<a href="thread.php?fid=163">LIVE共享</a>  | <a href="thread.php?fid=182">转载资源</a><br />' +
            '	<span style="color:#ff9999;">综合</span><br />' +
            '	<a href="thread.php?fid=94">原创美图</a> | <a href="thread.php?fid=87">宅物交流</a><br />' +
            '	<a href="thread.php?fid=86">电子产品</a> | <a href="thread.php?fid=115">文字作品</a><br />' +
            '	<a href="thread.php?fid=96">出处讨论</a>  | <a href="thread.php?fid=36">寻求资源</a><br />' +
            '	<span style="color:#ff9999;">交流</span><br />' +
            '	<a href="thread.php?fid=5">自由讨论</a> | <a href="thread.php?fid=56">个人日记</a><br />' +
            '	<a href="thread.php?fid=98">日本语版</a>  | <a href="thread.php?fid=9">我的关注</a><br />' +
            '	<a href="thread.php?fid=4">站务管理</a><br />' +
            '	<span style="color:#ff9999;">专用</span><br />' +
            '	<a href="thread.php?fid=93">管理组区</a> | <a href="thread.php?fid=59">原创组区</a><br />' +
            '	<a href="/">论坛首页</a><br />' +
            '</div>'
        );
    },

    /**
     * 为侧边栏添加快捷导航的链接
     */
    addFastNavForSideBar: function () {
        if (!$('#r_menu').hasClass('r_cmenu')) {
            if (!Config.modifySideBarEnabled) {
                $('#r_menu').append('<a href="/">论坛首页</a><br />');
            }
            $('#r_menu > a:last').before(
                '<span style="color:#ff9999;">快捷导航</span><br />' +
                '<a href="guanjianci.php?gjc={0}">@提醒</a> | <a href="personal.php?action=post">回复</a> | <a href="kf_growup.php">等级</a><br />'
                    .replace('{0}', KFOL.userName) +
                '<a href="kf_fw_ig_index.php">争夺</a> | <a href="kf_fw_ig_my.php">道具</a> | <a href="kf_fw_ig_shop.php">商店</a><br />' +
                '<a href="profile.php?action=modify">设置</a> | <a href="hack.php?H_name=bank">银行</a> | <a href="profile.php?action=favor">收藏</a><br />' +
                Const.customTileSideBarContent
            );
        }
        else {
            $('#r_menu > ul > li:last-child').before(
                '<li class="r_cmenuho"><a href="javascript:;">快捷导航</a>' +
                '  <ul class="r_cmenu2">' +
                '    <li><a href="guanjianci.php?gjc={0}">@提醒</a></li>'.replace('{0}', KFOL.userName) +
                '    <li><a href="kf_growup.php">等级经验</a></li>' +
                '    <li><a href="kf_fw_ig_index.php">争夺奖励</a></li>' +
                '    <li><a href="kf_fw_ig_my.php">我的道具</a></li>' +
                '    <li><a href="kf_fw_ig_shop.php">道具商店</a></li>' +
                '    <li><a href="profile.php?action=modify">设置</a></li>' +
                '    <li><a href="hack.php?H_name=bank">银行</a></li>' +
                '    <li><a href="profile.php?action=favor">收藏</a></li>' +
                '    <li><a href="personal.php?action=post">我的回复</a></li>' +
                Const.customSideBarContent +
                '  </ul>' +
                '</li>'
            );
        }
    },

    /**
     * 自动活期存款
     * @param {boolean} [isRead=false] 是否读取个人信息页面以获得当前所拥有KFB的信息
     */
    autoSaveCurrentDeposit: function (isRead) {
        if (!(Config.saveCurrentDepositAfterKfb > 0 && Config.saveCurrentDepositKfb > 0 && Config.saveCurrentDepositKfb <= Config.saveCurrentDepositAfterKfb))
            return;
        var $kfb = $('a[href="kf_givemekfb.php"]');

        /**
         * 活期存款
         * @param {number} income 当前拥有的KFB
         */
        var saveCurrentDeposit = function (income) {
            if (income < Config.saveCurrentDepositAfterKfb) return;
            var multiple = Math.floor((income - Config.saveCurrentDepositAfterKfb) / Config.saveCurrentDepositKfb);
            if (income - Config.saveCurrentDepositKfb * multiple >= Config.saveCurrentDepositAfterKfb)
                multiple++;
            var money = Config.saveCurrentDepositKfb * multiple;
            if (money <= 0 || money > income) return;
            console.log('自动活期存款Start');
            $.post('hack.php?H_name=bank',
                {action: 'save', btype: 1, savemoney: money},
                function (html) {
                    KFOL.showFormatLog('自动存款', html);
                    if (/完成存款/.test(html)) {
                        Log.push('自动存款', '共有`{0}`KFB已自动存入活期存款'.replace('{0}', money));
                        console.log('共有{0}KFB已自动存入活期存款'.replace('{0}', money));
                        KFOL.showMsg('共有<em>{0}</em>KFB已自动存入活期存款'.replace('{0}', money));
                        if (KFOL.isInHomePage) $kfb.text('拥有{0}KFB'.replace('{0}', income - money));
                    }
                }, 'html');
        };

        if (isRead) {
            console.log('获取当前持有KFB Start');
            $.get('profile.php?action=show&uid={0}&t={1}'.replace('{0}', KFOL.uid).replace('{1}', new Date().getTime()), function (html) {
                var matches = /论坛货币：(\d+)\s*KFB<br \/>/i.exec(html);
                if (matches) saveCurrentDeposit(parseInt(matches[1]));
            });
        }
        else {
            var matches = /拥有(\d+)KFB/i.exec($kfb.text());
            if (matches) saveCurrentDeposit(parseInt(matches[1]));
        }
    },

    /**
     * 在神秘等级升级后进行提醒
     */
    smLevelUpAlert: function () {
        var matches = /神秘(\d+)级/.exec($('a[href="kf_growup.php"]').text());
        if (!matches) return;
        var smLevel = parseInt(matches[1]);

        /**
         * 写入神秘等级数据
         * @param {number} smLevel 神秘等级
         */
        var writeData = function (smLevel) {
            TmpLog.setValue(Const.smLevelUpTmpLogName, {time: new Date().getTime(), smLevel: smLevel});
        };

        var data = TmpLog.getValue(Const.smLevelUpTmpLogName);
        if (!data || $.type(data.time) !== 'number' || $.type(data.smLevel) !== 'number') {
            writeData(smLevel);
        }
        else if (smLevel > data.smLevel) {
            var diff = Math.floor((new Date().getTime() - data.time) / 60 / 60 / 1000);
            if (diff >= Const.smLevelUpAlertInterval) {
                var date = new Date(data.time);
                writeData(smLevel);
                Log.push('神秘等级升级', '自`{0}`以来，你的神秘等级共上升了`{1}`级 (Lv.`{2}`->Lv.`{3}`)'
                    .replace('{0}', Tools.getDateString(date))
                    .replace('{1}', smLevel - data.smLevel)
                    .replace('{2}', data.smLevel)
                    .replace('{3}', smLevel)
                );
                KFOL.showMsg('自<em>{0}</em>以来，你的神秘等级共上升了<em>{1}</em>级'
                    .replace('{0}', Tools.getDateString(date))
                    .replace('{1}', smLevel - data.smLevel)
                );
            }
            else if (diff < 0) {
                writeData(smLevel);
            }
        }
        else if (smLevel < data.smLevel) {
            writeData(smLevel);
        }
    },

    /**
     * 在神秘系数排名发生变化时进行提醒
     */
    smRankChangeAlert: function () {
        var matches = /系数排名第\s*(\d+)\s*位/.exec($('a[href="kf_growup.php"]').text());
        if (!matches) return;
        var smRank = parseInt(matches[1]);

        /**
         * 写入神秘系数排名数据
         * @param {number} smRank 神秘系数排名
         */
        var writeData = function (smRank) {
            TmpLog.setValue(Const.smRankChangeTmpLogName, {time: new Date().getTime(), smRank: smRank});
        };

        var data = TmpLog.getValue(Const.smRankChangeTmpLogName);
        if (!data || $.type(data.time) !== 'number' || $.type(data.smRank) !== 'number') {
            writeData(smRank);
        }
        else if (smRank !== data.smRank) {
            var diff = Math.floor((new Date().getTime() - data.time) / 60 / 60 / 1000);
            if (diff >= Const.smRankChangeAlertInterval) {
                var date = new Date(data.time);
                var isUp = smRank < data.smRank;
                writeData(smRank);
                Log.push('神秘系数排名变化', '自`{0}`以来，你的神秘系数排名共`{1}`了`{2}`名 (No.`{3}`->No.`{4}`)'
                    .replace('{0}', Tools.getDateString(date))
                    .replace('{1}', isUp ? '上升' : '下降')
                    .replace('{2}', Math.abs(smRank - data.smRank))
                    .replace('{3}', data.smRank)
                    .replace('{4}', smRank)
                );
                KFOL.showMsg('自<em>{0}</em>以来，你的神秘系数排名共<b style="color:{1}">{2}</b>了<em>{3}</em>名'
                    .replace('{0}', Tools.getDateString(date))
                    .replace('{1}', isUp ? '#F00' : '#393')
                    .replace('{2}', isUp ? '上升' : '下降')
                    .replace('{3}', Math.abs(smRank - data.smRank))
                );
            }
            else if (diff < 0) {
                writeData(smRank);
            }
        }
    },

    /**
     * 修改我的回复页面里的帖子链接
     */
    modifyMyPostLink: function () {
        $('.t a[href^="read.php?tid="]').each(function () {
            var $this = $(this);
            $this.attr('href', $this.attr('href').replace(/&uid=\d+#(\d+)/i, '&spid=$1'));
        });
    },

    /**
     * 在短消息页面添加选择指定短消息的按钮
     */
    addMsgSelectButton: function () {
        $('<input value="自定义" type="button" style="margin-right:3px">').insertBefore('input[type="button"][value="全选"]')
            .click(function (e) {
                e.preventDefault();
                var title = $.trim(prompt('请填写所要选择的包含指定字符串的短消息标题（可用|符号分隔多个标题）', '收到了他人转账的KFB|银行汇款通知|您的文章被评分|您的文章被删除'));
                if (title !== '') {
                    $('.thread1 > tbody > tr > td:nth-child(2) > a').each(function () {
                        var $this = $(this);
                        $.each(title.split('|'), function (index, key) {
                            if ($this.text().toLowerCase().indexOf(key.toLowerCase()) > -1) {
                                $this.closest('tr').find('td:last-child > input[type="checkbox"]').prop('checked', true);
                            }
                        });
                    });
                }
            }).parent().attr('colspan', 4)
            .prev('td').attr('colspan', 3);
        $('<input value="反选" type="button" style="margin-left:5px;margin-right:1px">').insertAfter('input[type="button"][value="全选"]')
            .click(function (e) {
                e.preventDefault();
                $('.thread1 > tbody > tr > td:last-child > input[type="checkbox"]').each(function () {
                    var $this = $(this);
                    $this.prop('checked', !$this.prop('checked'));
                });
            });
    },

    /**
     * 在首页帖子链接旁添加快速跳转至页末的链接
     */
    addHomePageThreadFastGotoLink: function () {
        $('.index1').on('mouseenter', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
            var $this = $(this);
            $this.css('position', 'relative')
                .prepend('<a class="pd_thread_goto" href="{0}&page=e#a">&raquo;</a>'.replace('{0}', $this.find('a').attr('href')));
        }).on('mouseleave', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
            $(this).css('position', 'static').find('.pd_thread_goto').remove();
        });
    },

    /**
     * 添加用户自定义备注
     */
    addUserMemo: function () {
        if ($.isEmptyObject(Config.userMemoList)) return;
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            var userName = $.trim($this.text());
            var memo = '';
            for (var name in Config.userMemoList) {
                if (name === userName) {
                    memo = Config.userMemoList[name];
                    break;
                }
            }
            if (!memo) return;
            if ($this.is('.readidmleft > a')) {
                $this.after('<span class="pd_user_memo_tips" title="备注：{0}">[?]</span>'.replace('{0}', memo));
            }
            else {
                var memoText = memo;
                var maxLength = 24;
                if (memo.length > maxLength) memoText = memoText.substring(0, maxLength) + '...';
                $this.after('<br /><span class="pd_user_memo" title="备注：{0}">({1})</span>'.replace('{0}', memo).replace('{1}', memoText));
            }
        });
    },

    /**
     * 执行自定义脚本
     * @param {number} type 脚本类型，1：脚本开始时执行；2：脚本结束时执行
     */
    runCustomScript: function (type) {
        var script = '';
        if (type === 2) script = Config.customScriptEndContent;
        else script = Config.customScriptStartContent;
        if (script) {
            try {
                eval(script);
            }
            catch (ex) {
                console.log(ex);
            }
        }
    },

    /**
     * 添加复制代码的链接
     */
    addCopyCodeLink: function () {
        $('.readtext fieldset > legend:contains("Copy code")').html('<a class="pd_copy_code" href="#">复制代码</a>');
        if ($('.pd_copy_code').length === 0) return;
        $('#alldiv').on('click', 'a.pd_copy_code', function (e) {
            e.preventDefault();
            var $this = $(this);
            var $fieldset = $this.closest('fieldset');
            if (Tools.copyText($fieldset, '代码已复制', $this.parent())) return;

            var content = $fieldset.data('content');
            if (content) {
                $fieldset.html('<legend><a class="pd_copy_code" href="#">复制代码</a></legend>' + content).removeData('content');
            }
            else {
                var html = $fieldset.html();
                html = html.replace(/<legend>.+?<\/legend>/i, '');
                $fieldset.data('content', html);
                html = Tools.htmlDecode(html);
                var height = $fieldset.height();
                height -= 17;
                if (height < 50) height = 50;
                if (height > 540) height = 540;
                $fieldset.html(
                    ('<legend><a class="pd_copy_code" href="#">还原代码</a></legend><textarea wrap="off" class="pd_textarea" ' +
                    'style="width:100%;height:{0}px;line-height:1.4em;white-space:pre">{1}</textarea>')
                        .replace('{0}', height)
                        .replace('{1}', html)
                );
                $fieldset.find('textarea').select().focus();
            }
        });
    },

    /**
     * 添加自动更换ID颜色的按钮
     */
    addAutoChangeIdColorButton: function () {
        var $autoChangeIdColor = $('table div > table > tbody > tr > td:contains("自定义ID颜色")');
        $('<span class="pd_highlight">低等级没人权？没有自己喜欢的颜色？快来试试助手的<a href="#">自定义本人神秘颜色</a>的功能吧！（虽然仅限自己可见 ╮(╯▽╰)╭）</span><br />')
            .appendTo($autoChangeIdColor)
            .find('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.show();
        });

        var $idColors = $autoChangeIdColor.parent('tr').nextAll('tr').not('tr:last');
        if ($idColors.find('a').length <= 1) return;
        $('<form><div id="pd_auto_change_sm_color_btns" style="margin-top:5px">' +
            '<label><input id="pd_cfg_auto_change_sm_color_enabled" class="pd_input" type="checkbox" /> 自动更换ID颜色</label></div></form>')
            .appendTo($autoChangeIdColor)
            .find('#pd_cfg_auto_change_sm_color_enabled')
            .click(function () {
                var $this = $(this);
                var enabled = $this.prop('checked');
                if (enabled !== Config.autoChangeSMColorEnabled) {
                    ConfigMethod.read();
                    Config.autoChangeSMColorEnabled = enabled;
                    ConfigMethod.write();
                }

                if (enabled) {
                    $idColors.addClass('pd_sm_color_select').find('td:not(:has(a))').css('cursor', 'not-allowed');
                    $('<label>更换顺序 <select id="pd_cfg_auto_change_sm_color_type" style="font-size:12px"><option value="random">随机</option>' +
                        '<option value="sequence">顺序</option></select></label>' +
                        '<label>每隔 <input id="pd_cfg_auto_change_sm_color_interval" class="pd_input" style="width:25px" type="text" maxlength="5" /> 小时</label>' +
                        '<button>保存</button><button style="margin-left:3px">重置</button><br />' +
                        '<a href="#">全选</a><a style="margin-left:7px;margin-right:10px" href="#">反选</a>' +
                        '<label><input id="pd_cfg_change_all_available_sm_color_enabled" class="pd_input" type="checkbox" /> 选择当前所有可用的ID颜色</label>'
                    ).insertAfter($this.parent()).filter('button:first').click(function (e) {
                        e.preventDefault();
                        var $autoChangeSMColorInterval = $('#pd_cfg_auto_change_sm_color_interval');
                        var interval = parseInt($.trim($autoChangeSMColorInterval.val()));
                        if (isNaN(interval) || interval <= 0) {
                            alert('ID颜色更换时间间隔格式不正确');
                            $autoChangeSMColorInterval.select();
                            $autoChangeSMColorInterval.focus();
                            return;
                        }
                        var changeAllAvailableSMColorEnabled = $('#pd_cfg_change_all_available_sm_color_enabled').prop('checked');
                        var customChangeSMColorList = [];
                        $idColors.find('input[type="checkbox"]:checked').each(function () {
                            customChangeSMColorList.push(parseInt($(this).val()));
                        });
                        if (!changeAllAvailableSMColorEnabled && customChangeSMColorList.length <= 1) {
                            alert('必须选择2种或以上的ID颜色');
                            return;
                        }
                        if (customChangeSMColorList.length <= 1) customChangeSMColorList = [];

                        var oriInterval = Config.autoChangeSMColorInterval;
                        ConfigMethod.read();
                        Config.autoChangeSMColorType = $('#pd_cfg_auto_change_sm_color_type').val().toLowerCase();
                        Config.autoChangeSMColorInterval = interval;
                        Config.changeAllAvailableSMColorEnabled = changeAllAvailableSMColorEnabled;
                        Config.customAutoChangeSMColorList = customChangeSMColorList;
                        ConfigMethod.write();
                        if (oriInterval !== Config.autoChangeSMColorInterval)
                            Tools.setCookie(Const.autoChangeSMColorCookieName, 0, Tools.getDate('-1d'));
                        alert('设置保存成功');
                    }).end().filter('button:eq(1)').click(function (e) {
                        e.preventDefault();
                        ConfigMethod.read();
                        var defConfig = ConfigMethod.defConfig;
                        Config.autoChangeSMColorEnabled = defConfig.autoChangeSMColorEnabled;
                        Config.autoChangeSMColorType = defConfig.autoChangeSMColorType;
                        Config.autoChangeSMColorInterval = defConfig.autoChangeSMColorInterval;
                        Config.changeAllAvailableSMColorEnabled = defConfig.changeAllAvailableSMColorEnabled;
                        Config.customAutoChangeSMColorList = defConfig.customAutoChangeSMColorList;
                        ConfigMethod.write();
                        Tools.setCookie(Const.autoChangeSMColorCookieName, 0, Tools.getDate('-1d'));
                        TmpLog.deleteValue(Const.prevAutoChangeSMColorIdTmpLogName);
                        alert('设置已重置');
                        location.reload();
                    }).end().filter('a').click(function (e) {
                        e.preventDefault();
                        if ($idColors.find('input[disabled]').length > 0) {
                            alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                            $('#pd_cfg_change_all_available_sm_color_enabled').focus();
                            return;
                        }
                        if ($(this).is('#pd_auto_change_sm_color_btns > a:first')) {
                            $idColors.find('input[type="checkbox"]').prop('checked', true);
                        }
                        else {
                            $idColors.find('input[type="checkbox"]').each(function () {
                                $(this).prop('checked', !$(this).prop('checked'));
                            });
                        }
                    });

                    $idColors.find('td:has(a)').each(function () {
                        var $this = $(this);
                        var matches = /&color=(\d+)/i.exec($this.find('a').attr('href'));
                        if (matches) {
                            $this.append('<input type="checkbox" class="pd_input" value="{0}" />'.replace('{0}', matches[1]));
                        }
                    });

                    $('#pd_cfg_auto_change_sm_color_type').val(Config.autoChangeSMColorType);
                    $('#pd_cfg_auto_change_sm_color_interval').val(Config.autoChangeSMColorInterval);
                    $('#pd_cfg_change_all_available_sm_color_enabled').click(function () {
                        $idColors.find('input').prop('disabled', $(this).prop('checked'));
                    }).prop('checked', Config.changeAllAvailableSMColorEnabled).triggerHandler('click');
                    for (var i in Config.customAutoChangeSMColorList) {
                        $idColors.find('input[value="{0}"]'.replace('{0}', Config.customAutoChangeSMColorList[i])).prop('checked', true);
                    }
                }
                else {
                    $this.parent().nextAll().remove();
                    $idColors.removeClass('pd_sm_color_select').find('input').remove();
                }
            });

        $idColors.on('click', 'td', function (e) {
            if (!$(e.target).is('a')) {
                var $this = $(this);
                if ($this.find('input[disabled]').length > 0) {
                    alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                    $('#pd_cfg_change_all_available_sm_color_enabled').focus();
                }
                else if (!$(e.target).is('input')) {
                    $this.find('input').click();
                }
            }
        });

        if (Config.autoChangeSMColorEnabled) {
            $('#pd_cfg_auto_change_sm_color_enabled').prop('checked', true).triggerHandler('click');
        }

        $('div[style="float:right;color:#8080C0"]:contains("每天捐款附送100经验值")').html('每天捐款附送50经验值');
        $('div[style="border-bottom:#8000FF 1px dashed;"] > div:contains("帖子被奖励KFB")').html('帖子被奖励KFB(被协管评分)');
    },

    /**
     * 更换ID颜色
     */
    changeIdColor: function () {
        if (!Config.changeAllAvailableSMColorEnabled && Config.customAutoChangeSMColorList.length <= 1) return;
        /**
         * 写入Cookie
         */
        var setCookie = function () {
            var nextTime = Tools.getDate('+' + Config.autoChangeSMColorInterval + 'h');
            Tools.setCookie(Const.autoChangeSMColorCookieName, nextTime.getTime(), nextTime);
        };
        console.log('自动更换ID颜色Start');
        $.get('kf_growup.php?t=' + new Date().getTime(), function (html) {
            if (Tools.getCookie(Const.autoChangeSMColorCookieName)) return;
            var matches = html.match(/href="kf_growup\.php\?ok=2&safeid=\w+&color=\d+"/gi);
            if (matches) {
                var safeId = '';
                var safeIdMatches = /safeid=(\w+)&/i.exec(matches[0]);
                if (safeIdMatches)safeId = safeIdMatches[1];
                if (!safeId) {
                    setCookie();
                    return;
                }

                var availableIdList = [];
                for (var i in matches) {
                    var idMatches = /color=(\d+)/i.exec(matches[i]);
                    if (idMatches) availableIdList.push(parseInt(idMatches[1]));
                }

                var idList = availableIdList;
                if (!Config.changeAllAvailableSMColorEnabled) {
                    idList = [];
                    for (var i in Config.customAutoChangeSMColorList) {
                        if ($.inArray(Config.customAutoChangeSMColorList[i], availableIdList) > -1) {
                            idList.push(Config.customAutoChangeSMColorList[i]);
                        }
                    }
                }
                if (idList.length <= 1) {
                    setCookie();
                    return;
                }

                var prevId = parseInt(TmpLog.getValue(Const.prevAutoChangeSMColorIdTmpLogName));
                if (isNaN(prevId) || prevId < 0) prevId = 0;

                var nextId = 0;
                if (Config.autoChangeSMColorType.toLowerCase() === 'sequence') {
                    for (var i in idList) {
                        if (idList[i] > prevId) {
                            nextId = idList[i];
                            break;
                        }
                    }
                    if (nextId === 0) nextId = idList[0];
                }
                else {
                    for (var i in idList) {
                        if (idList[i] === prevId) {
                            idList.splice(i, 1);
                            break;
                        }
                    }
                    nextId = idList[Math.floor(Math.random() * idList.length)];
                }

                var url = 'kf_growup.php?ok=2&safeid={0}&color={1}&t={2}'
                    .replace('{0}', safeId)
                    .replace('{1}', nextId)
                    .replace('{2}', new Date().getTime());
                $.get(url, function (html) {
                    setCookie();
                    KFOL.showFormatLog('自动更换ID颜色', html);
                    if (/等级颜色修改完毕/.test(html)) {
                        console.log('ID颜色更换为：' + nextId);
                        TmpLog.setValue(Const.prevAutoChangeSMColorIdTmpLogName, nextId);
                    }
                }, 'html');
            }
            else {
                setCookie();
            }
        }, 'html');
    },

    /**
     * 在帖子页面添加更多表情的链接
     */
    addMoreSmileLink: function () {
        /**
         * 添加表情代码
         * @param {string} id 表情ID
         */
        var addSmileCode = function (id) {
            var textArea = $('textarea[name="atc_content"]').get(0);
            if (!textArea) return;
            var code = '[s:' + id + ']';
            Tools.addCode(textArea, code, '');
            if (KFOL.isMobile) textArea.blur();
            else textArea.focus();
        };

        var $parent = $('input[name="diy_guanjianci"]').parent();
        $parent.on('click', 'a[href="javascript:;"]', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            if (id) addSmileCode(id);
        }).find('a[onclick^="javascript:addsmile"]').each(function () {
            var $this = $(this);
            var matches = /addsmile\((\d+)\)/i.exec($this.attr('onclick'));
            if (matches) {
                $this.data('id', matches[1]).removeAttr('onclick').attr('href', 'javascript:;');
            }
        });

        $('<a class="pd_highlight" href="#">[更多]</a>')
            .appendTo($parent)
            .click(function (e) {
                e.preventDefault();
                var $this = $(this);
                var $panel = $('#pd_smile_panel');
                if ($panel.length > 0) {
                    $this.text('[更多]');
                    $panel.remove();
                    return;
                }
                $this.text('[关闭]');

                var smileImageIdList = ['48', '35', '34', '33', '32', '31', '30', '29', '28', '27', '26', '36', '37', '47', '46', '45', '44', '43', '42', '41', '40',
                    '39', '38', '25', '24', '11', '10', '09', '08', '01', '02', '03', '04', '05', '06', '12', '13', '23', '22', '21', '20', '19', '18', '17', '16',
                    '15', '14', '07'];
                var smileCodeIdList = [57, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 45, 46, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 34, 33, 20, 19, 18, 17, 10, 11, 12,
                    13, 14, 15, 21, 22, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 16];
                var html = '';
                for (var i = 0; i < smileImageIdList.length; i++) {
                    html += '<img src="{0}/post/smile/em/em{1}.gif" alt="[表情]" data-id="{2}" />'
                        .replace('{0}', KFOL.window.imgpath)
                        .replace('{1}', smileImageIdList[i])
                        .replace('{2}', smileCodeIdList[i]);
                }
                html = '<div class="pd_panel" id="pd_smile_panel" style="width:308px;height:185px">' + html + '</div>';

                var offset = $parent.offset();
                $panel = $(html).appendTo('body');
                $panel.css('top', offset.top + $parent.height() + 4)
                    .css('left', offset.left + $parent.width() - $panel.width() + 9)
                    .on('click', 'img', function () {
                        var id = $(this).data('id');
                        if (id) addSmileCode(id);
                    });
                Func.run('KFOL.addMoreSmileLink_after_click_');
            });
    },

    /**
     * 在首页显示VIP剩余时间
     */
    showVipSurplusTime: function () {
        /**
         * 添加VIP剩余时间的提示
         * @param {number} hours VIP剩余时间（小时）
         */
        var addVipHoursTips = function (hours) {
            $('a[href="kf_growup.php"][title="用户等级和权限"]').parent().after(
                '<div class="line"></div><div style="width:300px;"><a href="kf_vmember.php" class="indbox{0}">VIP会员 ({1})</a><div class="c"></div></div>'
                    .replace('{0}', hours > 0 ? 5 : 6)
                    .replace('{1}', hours > 0 ? '剩余' + hours + '小时' : '参与论坛获得的额外权限')
            );
        };

        var vipHours = parseInt(Tools.getCookie(Const.vipSurplusTimeCookieName));
        if (isNaN(vipHours) || vipHours < 0) {
            console.log('检查VIP剩余时间Start');
            $.get('kf_vmember.php?t=' + new Date().getTime(), function (html) {
                var hours = 0;
                var matches = /我的VIP剩余时间\s*<b>(\d+)<\/b>\s*小时/i.exec(html);
                if (matches) hours = parseInt(matches[1]);
                Tools.setCookie(Const.vipSurplusTimeCookieName, hours, Tools.getDate('+' + Const.vipSurplusTimeExpires + 'm'));
                addVipHoursTips(hours);
            }, 'html');
        }
        else {
            addVipHoursTips(vipHours);
        }
    },

    /**
     * 同步修改帖子每页楼层数量
     */
    syncModifyPerPageFloorNum: function () {
        var syncConfig = function () {
            var perPageFloorNum = parseInt($('select[name="p_num"]').val());
            if (isNaN(perPageFloorNum)) return;
            if (perPageFloorNum === 0) perPageFloorNum = 10;
            if (perPageFloorNum !== Config.perPageFloorNum) {
                Config.perPageFloorNum = perPageFloorNum;
                ConfigMethod.write();
            }
        };
        $('form#creator').submit(function () {
            ConfigMethod.read();
            syncConfig();
        });
        syncConfig();
    },

    /**
     * 显示元素的title属性提示（用于移动版浏览器）
     * @param {{}} e 点击事件
     * @param {string} title title属性
     */
    showElementTitleTips: function (e, title) {
        $('.pd_title_tips').remove();
        if (!title || !e.originalEvent) return;
        $('<div class="pd_title_tips">{0}</div>'.replace('{0}', title))
            .appendTo('body')
            .css('left', e.originalEvent.pageX - 20)
            .css('top', e.originalEvent.pageY + 15);
    },

    /**
     * 绑定包含title属性元素的点击事件（用于移动版浏览器）
     */
    bindElementTitleClick: function () {
        var excludeNodeNameList = ['A', 'IMG', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'];
        $(document).click(function (e) {
            var target = e.target;
            if (!target.title && $.inArray(target.nodeName, excludeNodeNameList) === -1 && target.parentNode && target.parentNode.title)
                target = target.parentNode;
            if (target.title && $.inArray(target.nodeName, excludeNodeNameList) === -1 &&
                (!target.id || target.id.indexOf('wy_') !== 0) && !$(target).is('.pd_editor_btn')
            ) {
                KFOL.showElementTitleTips(e, target.title);
            }
            else {
                $('.pd_title_tips').remove();
            }
        });
    },

    /**
     * 在首页上添加搜索类型选择框
     */
    addSearchTypeSelectBoxInHomePage: function () {
        var $form = $('form[action="search.php?"]');
        $form.attr('name', 'pd_search');
        var $keyWord = $form.find('input[type="text"][name="keyword"]');
        $keyWord.css('width', '116px');
        $('<div class="pd_search_type"><span>标题</span><i>&#8744;</i></div>').insertAfter($keyWord);
    },

    /**
     * 绑定搜索类型下拉菜单点击事件
     */
    bindSearchTypeSelectMenuClick: function () {
        $(document).on('click', '.pd_search_type', function () {
            var $menu = $(this);
            var $searchTypeList = $('.pd_search_type_list');
            if ($searchTypeList.length > 0) {
                $searchTypeList.remove();
                return;
            }
            var type = $menu.data('type');
            $searchTypeList = $('<ul class="pd_search_type_list"><li>标题</li><li>作者</li><li>关键词</li><li>用户名</li></ul>').appendTo('body');
            var offset = $menu.offset();
            $searchTypeList.css('top', offset.top + $menu.height() + 2).css('left', offset.left + 1);
            if (type === 'dialog') {
                $searchTypeList.css({
                    'width': '65px',
                    'left': offset.left - 1
                });
            }
            $searchTypeList.on('click', 'li', function () {
                var $this = $(this);
                var type = $.trim($this.text());
                var $form = $menu.closest('form');
                var $keyWord = $form.find('input[name="keyword"], input[name="pwuser"]');
                $menu.find('span').text(type);
                if (type !== '关键词' && type !== '用户名') $form.attr('action', 'search.php?');
                if (type === '作者') $keyWord.attr('name', 'pwuser');
                else $keyWord.attr('name', 'keyword');
                var $searchRange = $form.find('input[name="search_range"][value="current"]');
                if ($searchRange.length > 0) {
                    $searchRange.prop('disabled', type === '关键词' || type === '用户名' || !$searchRange.data('enabled'));
                }
                $searchTypeList.remove();
                $keyWord.focus();
            });
        });

        $(document).on('submit', 'form[name="pd_search"]', function () {
            var $this = $(this);
            var type = $.trim($this.find('.pd_search_type > span').text());
            if (type === '关键词') {
                $this.attr('action', 'guanjianci.php?gjc=' + $this.find('input[name="keyword"]').val());
            }
            else if (type === '用户名') {
                $this.attr('action', 'profile.php?action=show&username=' + $this.find('input[name="keyword"]').val());
            }
        });
    },

    /**
     * 可使用2个字以下的关键字进行搜索
     */
    makeSearchByBelowTwoKeyWordAvailable: function () {
        $(document).on('submit', 'form[action="search.php?"]', function () {
            var $this = $(this);
            var $keyWord = $this.find('input[name="keyword"]');
            var $method = $this.find('input[name="method"]');
            if (!$keyWord.length || !$method.length) return;
            var keyWord = $.trim($keyWord.val());
            if (!keyWord || Tools.getStrByteLen(keyWord) > 2) return;
            $keyWord.val(keyWord + ' ' + Math.floor(new Date().getTime() / 1000));
            $method.val('OR');
            setTimeout(function () {
                $keyWord.val(keyWord);
                $method.val('AND');
            }, 200);
        });
    },

    /**
     * 添加搜索对话框链接
     */
    addSearchDialogLink: function () {
        $('<span> | </span><a href="#">搜索</a>')
            .insertAfter('.topright > a[href="message.php"]')
            .filter('a')
            .click(function (e) {
                e.preventDefault();
                if ($('#pd_search').length > 0) return;
                var html =
                    '<div class="pd_cfg_main">' +
                    '  <input name="step" value="2" type="hidden" />' +
                    '  <input name="method" value="AND" type="hidden" />' +
                    '  <input name="sch_area" value="0" type="hidden" />' +
                    '  <input name="s_type" value="forum" type="hidden" />' +
                    '  <input name="f_fid" value="all" type="hidden" />' +
                    '  <input name="orderway" value="lastpost" type="hidden" />' +
                    '  <input name="asc" value="DESC" type="hidden" />' +
                    '  <div style="margin-top:15px;">' +
                    '    <input class="pd_input" name="keyword" type="search" style="float: left; width: 175px; line-height: 26px;" placeholder="关键字" />' +
                    '    <div class="pd_search_type" data-type="dialog"><span>标题</span><i>∨</i></div>' +
                    '    <button class="indloginm" name="submit" type="submit">搜索</button>' +
                    '  </div>' +
                    '  <div style="margin-bottom:8px; line-height:35px;">' +
                    '    <label><input name="search_range" type="radio" value="all" checked="checked" /> 全站 </label>' +
                    '    <label><input name="search_range" type="radio" value="current" disabled="disabled" /> 本版</label>' +
                    '  </div>' +
                    '</div>';
                var $dialog = Dialog.create('pd_search', '搜索', html);

                $dialog.closest('form').attr({
                    'name': 'pd_search',
                    'action': 'search.php?',
                    'method': 'post',
                    'target': '_blank'
                }).off('submit');

                var fid = parseInt($('input[name="f_fid"]:first, input[name="fid"]:first').val());
                if (fid) {
                    $dialog.find('input[name="search_range"]').click(function () {
                        var $this = $(this);
                        $dialog.find('input[name="f_fid"]').val($this.val() === 'current' ? fid : 'all');
                    });
                    $dialog.find('input[name="search_range"][value="current"]')
                        .prop('disabled', false)
                        .data('enabled', true)
                        .click();
                }

                $dialog.keydown(function (e) {
                    if (e.keyCode === 27) {
                        $('.pd_search_type_list').remove();
                    }
                }).find('h1 > span').click(function () {
                    $('.pd_search_type_list').remove();
                });

                Dialog.show('pd_search');
                $dialog.find('input[name="keyword"]').focus();
            });
    },

    /**
     * 在帖子页面解析多媒体标签
     */
    parseMediaTag: function () {
        $('.readtext > table > tbody > tr > td').each(function () {
            var $this = $(this);
            var html = $this.html();
            if (/\[(audio|video)\](http|ftp)[^<>]+\[\/(audio|video)\]/.test(html)) {
                $this.html(
                    html.replace(/\[audio\]((?:http|ftp)[^<>]+?)\[\/audio\](?!<\/fieldset>)/g,
                        '<audio src="$1" controls="controls" preload="none" style="margin:3px 0">[你的浏览器不支持audio标签]</audio>'
                    )
                        .replace(/\[video\]((?:http|ftp)[^<>]+?)\[\/video\](?!<\/fieldset>)/g,
                            '<video src="$1" controls="controls" preload="none" style="max-width:{0}px;margin:3px 0">[你的浏览器不支持video标签]</video>'
                                .replace('{0}', Config.adjustThreadContentWidthEnabled ? 627 : 820)
                        )
                );
            }
        });
    },

    /**
     * 在发帖页面的发帖框上添加额外的按钮
     */
    addExtraPostEditorButton: function () {
        var textArea = $('textarea[name="atc_content"]').get(0);
        if (!textArea) return;

        $('<span id="wy_post" title="插入隐藏内容" data-type="hide" style="background-position:0 -280px">插入隐藏内容</span>' +
            '<span id="wy_justifyleft" title="左对齐" data-type="left" style="background-position:0 -360px">左对齐</span>' +
            '<span id="wy_justifycenter" title="居中" data-type="center" style="background-position:0 -380px">居中</span>' +
            '<span id="wy_justifyright" title="右对齐" data-type="right" style="background-position:0 -400px">右对齐</span>' +
            '<span id="wy_subscript" title="下标" data-type="sub" style="background-position:0 -80px">下标</span>' +
            '<span id="wy_superscript" title="上标" data-type="sup" style="background-position:0 -100px">上标</span>' +
            '<span class="pd_editor_btn" title="插入飞行文字" data-type="fly">F</span>' +
            '<span class="pd_editor_btn" title="插入HTML5音频" data-type="audio">A</span>' +
            '<span class="pd_editor_btn" title="插入HTML5视频" data-type="video">V</span>'
        ).appendTo('#editor-button .editor-button').click(function () {
            var $this = $(this);
            var type = $this.data('type');
            var text = '';
            switch (type) {
                case 'hide':
                    text = prompt('请输入神秘等级：', 5);
                    break;
                case 'audio':
                    text = Tools.convertToAudioExternalLinkUrl(prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐或虾米的单曲地址，将自动转换为外链地址）', 'http://'));
                    break;
                case 'video':
                    text = Tools.convertToVideoExternalLinkUrl(prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://'));
                    break;
            }
            if (text === null) return;

            var selText = '';
            var code = '';
            switch (type) {
                case 'hide':
                    selText = Tools.getSelText(textArea);
                    code = '[hide={0}]{1}[/hide]'.replace('{0}', text).replace('{1}', selText);
                    break;
                case 'left':
                    selText = Tools.getSelText(textArea);
                    code = '[align=left]{0}[/align]'.replace('{0}', selText);
                    break;
                case 'center':
                    selText = Tools.getSelText(textArea);
                    code = '[align=center]{0}[/align]'.replace('{0}', selText);
                    break;
                case 'right':
                    selText = Tools.getSelText(textArea);
                    code = '[align=right]{0}[/align]'.replace('{0}', selText);
                    break;
                case 'fly':
                    selText = Tools.getSelText(textArea);
                    code = '[fly]{0}[/fly]'.replace('{0}', selText);
                    break;
                case 'sub':
                    selText = Tools.getSelText(textArea);
                    code = '[sub]{0}[/sub]'.replace('{0}', selText);
                    break;
                case 'sup':
                    selText = Tools.getSelText(textArea);
                    code = '[sup]{0}[/sup]'.replace('{0}', selText);
                    break;
                case 'audio':
                    code = '[audio]{0}[/audio]'.replace('{0}', text);
                    break;
                case 'video':
                    code = '[video]{0}[/video]'.replace('{0}', text);
                    break;
            }
            if (!code) return;
            Tools.addCode(textArea, code, selText);
            textArea.focus();
        }).mouseenter(function () {
            $(this).addClass('buttonHover');
        }).mouseleave(function () {
            $(this).removeClass('buttonHover');
        });
    },

    /**
     * 在发帖页面上添加额外的选项
     */
    addExtraOptionInPostPage: function () {
        $(
            '<div class="pd_post_extra_option">' +
            '  <label><input type="checkbox" id="pd_auto_analyze_url" checked="checked" /> 自动分析url</label><br />' +
            '  <label><input type="checkbox" name="pd_wind_code_auto_convert" checked="checked" /> Wind Code自动转换</label>' +
            '</div>'
        ).appendTo($('#menu_show')
            .closest('td'))
            .on('click', 'input[type="checkbox"]', function () {
                var $this = $(this);
                var inputName = $this.is('#pd_auto_analyze_url') ? 'atc_autourl' : 'atc_convert';
                $('form[name="FORM"]').find('input[name="{0}"]'.replace('{0}', inputName)).val($this.prop('checked') ? 1 : 0);
            });

        $('<input type="button" value="预览帖子" style="margin-left:7px" />')
            .insertAfter('input[type="submit"][name="Submit"]')
            .click(function (e) {
                e.preventDefault();
                var $form = $('form[name="preview"]');
                $form.find('input[name="atc_content"]').val($('#textarea').val());
                $form.submit();
            });
    },

    /**
     * 修复论坛错误代码
     */
    repairBbsErrorCode: function () {
        KFOL.window.is_ie = false;

        if (location.pathname === '/read.php') {
            KFOL.window.strlen = Tools.getStrByteLen;
        }
    },

    /**
     * 显示在购买框之外的附件图片
     */
    showAttachImageOutsideSellBox: function () {
        $('.readtext > table > tbody > tr > td').each(function () {
            var $this = $(this);
            var html = $this.html();
            if (/\[attachment=\d+\]/.test(html)) {
                var pid = $this.closest('.readtext').prev('.readlou').prev('a').attr('name');
                var tid = Tools.getUrlParam('tid');
                $this.html(
                    html.replace(/\[attachment=(\d+)\]/g,
                        ('<img src="job.php?action=download&pid={0}&tid={1}&aid=$1" alt="[附件图片]" style="max-width:550px" ' +
                        'onclick="if(this.width>=550) window.open(\'job.php?action=download&pid={0}&tid={1}&aid=$1\');" />')
                            .replace(/\{0\}/g, pid).replace(/\{1\}/g, tid)
                    )
                );
            }
        });
    },

    /**
     * 暴露接口给window对象
     */
    exposeInterface: function () {
        KFOL.window.Config = Config;
        KFOL.window.Const = Const;
        KFOL.window.ConfigMethod = ConfigMethod;
        KFOL.window.Tools = Tools;
        KFOL.window.Func = Func;
        KFOL.window.Dialog = Dialog;
        KFOL.window.ConfigDialog = ConfigDialog;
        KFOL.window.Log = Log;
        KFOL.window.TmpLog = TmpLog;
        KFOL.window.Item = Item;
        KFOL.window.Card = Card;
        KFOL.window.Bank = Bank;
        KFOL.window.Loot = Loot;
        KFOL.window.KFOL = KFOL;
    },

    /**
     * 修正发帖预览页面
     */
    modifyPostPreviewPage: function () {
        $('table > tbody > tr.tr1 > th').css({
            'text-align': 'left',
            'font-weight': 'normal',
            'border': '1px solid #9191FF',
            'padding': '10px'
        });
    },

    /**
     * 通过左右键进行翻页
     */
    turnPageViaKeyboard: function () {
        $(document).keydown(function (e) {
            if (e.keyCode !== 37 && e.keyCode !== 39) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            var $page = $('.pages:first');
            var $curPage = $page.find('li > a[href="javascript:;"]');
            if (!$curPage.length) return;
            var curPage = Tools.getCurrentThreadPage();
            var url = '';
            if (e.keyCode === 37) {
                if (curPage <= 1) return;
                url = $page.find('li > a:contains("上一页")').attr('href');
            }
            else {
                var matches = /&page=(\d+)/.exec($page.find('li:last-child > a').attr('href'));
                if (!matches) return;
                if (curPage >= parseInt(matches[1])) return;
                url = $page.find('li > a:contains("下一页")').attr('href');
            }
            if (location.pathname === '/read.php') {
                if ($.trim($('textarea[name="atc_content"]').val())) {
                    if (!confirm('发帖框尚有文字，是否继续翻页？')) return;
                }
            }
            location.href = url;
        });
    },

    /**
     * 检查自助评分文件大小
     * @param {string} title 帖子标题
     * @param {number} ratingSize 评分大小
     * @returns {{}} 检查结果
     */
    checkRatingSize: function (title, ratingSize) {
        var titleSize = 0;
        var matches = title.match(/\D(\d+(?:\.\d+)?)\s?(M|G)/ig);
        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                var sizeMatches = /(\d+(?:\.\d+)?)\s?(M|G)/i.exec(matches[i]);
                if (!sizeMatches) continue;
                var size = parseFloat(sizeMatches[1]);
                if (sizeMatches[2].toUpperCase() === 'G') size *= 1024;
                titleSize += size;
            }
        }

        if (!titleSize || !ratingSize) {
            return {result: -1};
        }
        else if (titleSize > ratingSize * (100 + Const.ratingErrorSizePercent) / 100 + 1 ||
            titleSize < ratingSize * (100 - Const.ratingErrorSizePercent) / 100 - 1
        ) {
            return {resultType: 1, titleSize: titleSize, ratingSize: ratingSize};
        }
        else return {result: 0};
    },

    /**
     * 高亮自助评分错标文件大小
     */
    highlightRatingErrorSize: function () {
        $('.adp1 a[href^="read.php?tid="]').each(function () {
            var $this = $(this);
            var title = $this.text();
            var ratingSize = 0;
            var $ratingCell = $this.parent('td').next('td');
            var matches = /认定\[(\d+)\]/i.exec($ratingCell.text());
            if (matches) {
                ratingSize = parseInt(matches[1]);
            }

            var result = KFOL.checkRatingSize(title, ratingSize);
            if (result.resultType === -1) {
                $ratingCell.css('color', '#FF9933').attr('title', '标题文件大小无法解析').addClass('pd_custom_tips');
            }
            else if (result.resultType === 1) {
                $ratingCell.addClass('pd_highlight pd_custom_tips')
                    .attr(
                        'title',
                        '标题文件大小({0}M)与认定文件大小({1}M)不一致'
                            .replace('{0}', result.titleSize.toLocaleString())
                            .replace('{1}', result.ratingSize.toLocaleString())
                    );
            }
        });
    },

    /**
     * 在提交自助评分时显示错标文件大小警告
     */
    showSelfRatingErrorSizeSubmitWarning: function () {
        $('form[name="mail1"]').submit(function () {
            var ratingSize = parseFloat($('[name="psize"]').val());
            if (isNaN(ratingSize) || ratingSize <= 0) return;
            if (parseInt($('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
            var title = $('.adp1 a[href^="read.php?tid="]').text();
            var result = KFOL.checkRatingSize(title, ratingSize);
            if (result.resultType === 1) {
                return confirm(
                    '标题文件大小({0}M)与认定文件大小({1}M)不一致，是否继续？'
                        .replace('{0}', result.titleSize.toLocaleString())
                        .replace('{1}', result.ratingSize.toLocaleString())
                );
            }
        });
    },

    /**
     * 在帖子页面添加自助评分链接
     */
    addSelfRatingLink: function () {
        var fid = parseInt($('input[name="fid"]:first').val());
        if (!fid || $.inArray(fid, Const.selfRatingFidList) === -1) return;
        var tid = parseInt($('input[name="tid"]:first').val());
        var safeId = KFOL.getSafeId();
        if (!safeId || !tid) return;
        if ($('.readtext:first fieldset legend:contains("本帖最近评分记录")').length > 0) return;
        $('a[href^="kf_tidfavor.php?action=favor"]').after(
            '<span style="margin:0 5px">|</span><a href="kf_fw_1wkfb.php?do=1&safeid={0}&ptid={1}" title="仅限自助评分测试人员使用">自助评分</a>'
                .replace('{0}', safeId).replace('{1}', tid)
        );
    },

    /**
     * 在论坛排行页面为用户名添加链接
     */
    addUserNameLinkInRankPage: function () {
        $('.kf_no11:eq(2) > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
            var $this = $(this);
            var userName = $.trim($this.text());
            $this.html('<a href="profile.php?action=show&username={0}" target="_blank">{0}</a>'.replace(/\{0\}/g, userName));
            if (userName === KFOL.userName) $this.find('a').addClass('pd_highlight');
        });
    },

    /**
     * 修改帮助页面
     */
    modifyFaq: function () {
        var id = parseInt(Tools.getUrlParam('id'));
        var $faq = $('.kf_share1 > tbody > tr:nth-child(2) > td:last-child > div:last-child');
        if (id === 1) {
            if ($faq.html().length !== 848) return;
            $faq.html(
                '你可以通过发帖/回贴、参与<a href="kf_fw_ig_index.php" target="_blank">争夺奖励</a>等方式获取KFB（论坛货币）和经验。<br><br>' +
                '发帖/回贴时会获得基本的KFB奖励，每天第一次发帖/回贴还可获得额外经验奖励。<br>' +
                '发帖请先阅读规定避免违规，在你还没有时间阅读全部规定之前，请至少注意以下几点：<br>' +
                '不要发表纯水帖；不要纯复制发帖；不要发表政治、广告、恶心的内容；不要攻击、讽刺、挑衅他人；<br>' +
                '不要发表成人图片、视频、小说等内容；不要伪造原创、盗取他人原创。<br><br>' +
                '升级（神秘系数）可以获得不同的等级权限，你可以在<a href="kf_growup.php" target="_blank">等级经验页面</a>进行KFB捐款，' +
                '根据不同的捐款数额获得相应的经验来提升神秘系数。<br>' +
                '注册初始神秘系数为0，为“通常版”等级，拥有大部分的日常权限；提升为神秘系数4时，升级为“初回限定版”等级，拥有部分追加的权限。<br>' +
                '部分板块需要一定神秘系数以上才可进入，如打开帖子时出现“error&hellip;”的提示，说明你当前的神秘系数无法进入该板块。<br><br>' +
                '神秘等级的值以神秘系数为基础，基本上是装饰用的属性，可见于帖子页面各楼层用户名称旁，还可用于选择自定义ID颜色。'
            );
        }
    },

    /**
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined') return;
        var startDate = new Date();
        //console.log('【KF Online助手】启动');
        if (!KFOL.getUidAndUserName()) return;
        ConfigMethod.init();
        KFOL.exposeInterface();
        KFOL.checkBrowserType();
        KFOL.appendCss();
        KFOL.addConfigAndLogDialogLink();
        if (Config.animationEffectOffEnabled) jQuery.fx.off = true;

        if (Config.customScriptEnabled) KFOL.runCustomScript(1);
        KFOL.repairBbsErrorCode();
        KFOL.preventCloseWindowWhenActioning();
        if (Config.showSearchLinkEnabled) KFOL.addSearchDialogLink();
        KFOL.bindSearchTypeSelectMenuClick();
        KFOL.makeSearchByBelowTwoKeyWordAvailable();
        if (Config.modifySideBarEnabled) KFOL.modifySideBar();
        if (Config.addSideBarFastNavEnabled) KFOL.addFastNavForSideBar();
        if (KFOL.isInHomePage) {
            KFOL.handleAtTips();
            KFOL.addSearchTypeSelectBoxInHomePage();
            if (Config.smLevelUpAlertEnabled) KFOL.smLevelUpAlert();
            if (Config.smRankChangeAlertEnabled) KFOL.smRankChangeAlert();
            if (Config.showVipSurplusTimeEnabled) KFOL.showVipSurplusTime();
            if (Config.homePageThreadFastGotoLinkEnabled) KFOL.addHomePageThreadFastGotoLink();
            if (Config.fixedDepositDueAlertEnabled && !Tools.getCookie(Const.fixedDepositDueAlertCookieName))
                Bank.fixedDepositDueAlert();
        }
        else if (location.pathname === '/read.php') {
            if (Config.turnPageViaKeyboardEnabled) KFOL.turnPageViaKeyboard();
            KFOL.fastGotoFloor();
            if (Config.adjustThreadContentWidthEnabled) KFOL.adjustThreadContentWidth();
            KFOL.adjustThreadContentFontSize();
            KFOL.showAttachImageOutsideSellBox();
            if (Config.parseMediaTagEnabled) KFOL.parseMediaTag();
            if (Config.modifyKFOtherDomainEnabled) KFOL.modifyKFOtherDomainLink();
            if (Config.customSmColorEnabled) KFOL.modifySmColor();
            if (Config.customMySmColor) KFOL.modifyMySmColor();
            if (Config.multiQuoteEnabled) KFOL.addMultiQuoteButton();
            KFOL.addFastGotoFloorInput();
            KFOL.addFloorGotoLink();
            KFOL.addCopyBuyersListLink();
            KFOL.addStatReplyersLink();
            KFOL.handleBuyThreadBtn();
            if (Config.batchBuyThreadEnabled) KFOL.addBatchBuyThreadButton();
            if (Config.showSelfRatingLinkEnabled) KFOL.addSelfRatingLink();
            if (Config.userMemoEnabled) KFOL.addUserMemo();
            KFOL.addCopyCodeLink();
            KFOL.addMoreSmileLink();
        }
        else if (location.pathname === '/thread.php') {
            if (Config.highlightNewPostEnabled) KFOL.highlightNewPost();
            if (Config.showFastGotoThreadPageEnabled) KFOL.addFastGotoThreadPageLink();
        }
        else if (/\/kf_fw_ig_my\.php$/i.test(location.href)) {
            Item.enhanceMyItemsPage();
            Item.addBatchUseAndConvertItemTypesButton();
        }
        else if (/\/kf_fw_ig_renew\.php$/i.test(location.href)) {
            Item.addBatchConvertEnergyAndRestoreItemsLink();
        }
        else if (/\/kf_fw_ig_renew\.php\?lv=\d+$/i.test(location.href)) {
            Item.addConvertEnergyAndRestoreItemsButton();
        }
        else if (/\/kf_fw_ig_my\.php\?lv=\d+$/i.test(location.href)) {
            Item.addSellAndUseItemsButton();
        }
        else if (/\/kf_fw_ig_my\.php\?pro=\d+/i.test(location.href)) {
            Item.modifyItemDescription();
            if (/\/kf_fw_ig_my\.php\?pro=\d+&display=1$/i.test(location.href)) {
                Item.addSampleItemTips();
            }
        }
        else if (location.pathname === '/kf_fw_ig_shop.php') {
            Item.addBatchBuyItemsLink();
        }
        else if (location.pathname === '/kf_fw_ig_index.php') {
            Loot.enhanceLootIndexPage();
        }
        else if (location.pathname === '/kf_fw_ig_pklist.php') {
            Loot.addUserLinkInPkListPage();
        }
        else if (/\/hack\.php\?H_name=bank$/i.test(location.href)) {
            Bank.addBatchTransferButton();
            Bank.handleInBankPage();
        }
        else if (/\/kf_fw_card_my\.php$/i.test(location.href)) {
            Card.addStartBatchModeButton();
        }
        else if (/\/post\.php\?action=reply&fid=\d+&tid=\d+&multiquote=true/i.test(location.href)) {
            if (Config.multiQuoteEnabled) KFOL.handleMultiQuote(2);
        }
        else if (/\/post\.php\?action=quote/i.test(location.href)) {
            KFOL.removeUnpairedBBCodeInQuoteContent();
        }
        else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
            KFOL.addFastDrawMoneyLink();
            if (Config.modifyKFOtherDomainEnabled) KFOL.modifyKFOtherDomainLink();
        }
        else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
            KFOL.addMsgSelectButton();
        }
        else if (/\/profile\.php\?action=show/i.test(location.href)) {
            KFOL.addFollowAndBlockAndMemoUserLink();
        }
        else if (/\/personal\.php\?action=post/i.test(location.href)) {
            if (Config.perPageFloorNum === 10) KFOL.modifyMyPostLink();
        }
        else if (location.pathname === '/kf_growup.php') {
            KFOL.addAutoChangeIdColorButton();
        }
        else if (location.pathname === '/guanjianci.php') {
            KFOL.highlightUnReadAtTipsMsg();
        }
        else if (/\/profile\.php\?action=modify$/i.test(location.href)) {
            KFOL.syncModifyPerPageFloorNum();
        }
        else if (/\/job\.php\?action=preview$/i.test(location.href)) {
            KFOL.modifyPostPreviewPage();
        }
        else if (location.pathname === '/search.php') {
            if (Config.turnPageViaKeyboardEnabled) KFOL.turnPageViaKeyboard();
        }
        else if (/\/kf_fw_1wkfb\.php\?ping=(2|4)/i.test(location.href)) {
            KFOL.highlightRatingErrorSize();
        }
        else if (/\/kf_fw_1wkfb\.php\?do=1/i.test(location.href)) {
            KFOL.showSelfRatingErrorSizeSubmitWarning();
        }
        else if (location.pathname === '/kf_no1.php') {
            KFOL.addUserNameLinkInRankPage();
        }
        else if (location.pathname === '/faq.php') {
            KFOL.modifyFaq();
        }
        if (location.pathname === '/post.php') {
            KFOL.addExtraPostEditorButton();
            KFOL.addExtraOptionInPostPage();
        }
        if (Config.blockUserEnabled) KFOL.blockUsers();
        if (Config.blockThreadEnabled) KFOL.blockThread();
        if (Config.followUserEnabled) KFOL.followUsers();
        if (KFOL.isMobile) KFOL.bindElementTitleClick();

        var autoSaveCurrentDepositAvailable = Config.autoSaveCurrentDepositEnabled && KFOL.isInHomePage;
        var isDonationStarted = false;
        if (Config.autoDonationEnabled && !Tools.getCookie(Const.donationCookieName)) {
            isDonationStarted = true;
            KFOL.donation(autoSaveCurrentDepositAvailable);
        }

        if (autoSaveCurrentDepositAvailable && !isDonationStarted) KFOL.autoSaveCurrentDeposit();

        if (Config.autoChangeSMColorEnabled && !Tools.getCookie(Const.autoChangeSMColorCookieName)) KFOL.changeIdColor();

        if (Config.autoRefreshEnabled && KFOL.isInHomePage) KFOL.startAutoRefreshMode();

        if (Config.customScriptEnabled) KFOL.runCustomScript(2);

        var endDate = new Date();
        console.log('【KF Online助手】加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

KFOL.init();
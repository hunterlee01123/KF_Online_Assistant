// ==UserScript==
// @name        KF Online助手
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KFOL必备！可在绯月Galgame上自动进行争夺、抽取神秘盒子以及KFB捐款，并可使用各种便利的辅助功能，更多功能开发中……
// @pd-update-url-placeholder
// @include     http://*2dgal.com/*
// @include     http://*ddgal.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @pd-require-start
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Config.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Const.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/ConfigMethod.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Tools.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Func.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Dialog.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/ConfigDialog.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Log.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/TmpLog.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Item.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Card.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Bank.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Loot.js
// @pd-require-end
// @version     5.4.1-dev
// @grant       none
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// ==/UserScript==
// 版本号
var version = '5.4.1';
/**
 * 助手设置和日志的存储位置类型
 * Default：存储在浏览器的localStorage中，设置仅通过域名区分，日志通过域名和uid区分；
 * Script：存储在油猴脚本的配置中，设置和日志仅通过uid区分（可用于设置经常会被浏览器清除的情况）;
 * Global：存储在油猴脚本的配置中，各域名和各uid使用全局设置，日志仅通过uid区分（可用于想要使用全局设置的情况）；
 */
var storageType = 'Default';
// 可先在设置界面里修改好相应设置，再将导入/导出设置文本框里的设置填入此处即可覆盖相应的默认设置（可用于设置经常会被浏览器清除或想要使用全局设置的情况）
// 例：var myConfig = {"autoDonationEnabled":true,"donationKfb":100};
var myConfig = {};

/* {PartFileContent} */
/**
 * KF Online主类
 */
var KFOL = {
    // 用户ID
    uid: 0,
    // 用户名
    userName: '',
    // 是否位于首页
    isInHomePage: false,
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
     */
    getSafeId: function () {
        var matches = /safeid=(\w+)/i.exec($('a[href*="safeid="]').eq(0).attr('href'));
        if (!matches) return '';
        else return matches[1];
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
            '.pd_input, .pd_cfg_main input, .pd_cfg_main select { vertical-align: middle; height: inherit; margin-right: 0; line-height: 22px; font-size: 12px; }' +
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
            '  position: absolute; width: 63px; background-color: #FCFCFC; border: 1px solid #CCC; border-top: none; line-height: 26px; text-indent: 13px; cursor: pointer;' +
            '}' +
            '.pd_search_type_list li:hover { color: #FFF; background-color: #87C3CF; }' +
            '.editor-button .pd_editor_btn { background: none; text-indent: 0; line-height: 18px; cursor: default; }' +
            '.readtext img[onclick] { max-width: 550px; }' +
            '.pd_post_extra_option { text-align:left; margin-top:5px; margin-left:5px; }' +
            '.pd_post_extra_option input { vertical-align:middle; height:auto; margin-right:0; }' +

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
            '.pd_cfg_main { background-color: #FCFCFC; padding: 0 10px; font-size: 12px; line-height: 22px; min-height: 180px; overflow: auto; }' +
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
        var msg = '【{0}】回应：'.replace('{0}', msgType);
        var matches = /<span style=".+?">(.+?)<\/span><br \/><a href="(.+?)">/i.exec(html);
        if (matches) {
            msg += '{0}；跳转地址：{1}{2}'
                .replace('{0}', matches[1])
                .replace('{1}', Tools.getHostNameUrl())
                .replace('{2}', matches[2]);
        }
        else {
            msg += '未能获得预期的回应';
            //msg += '\n' + html;
        }
        console.log(msg);
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
                if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit();
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
                }
                else {
                    donationSubmit(parseInt(Config.donationKfb));
                }
            }, 'html');
        }
    },

    /**
     * 获取下次抽取神秘盒子的时间对象
     * @returns {{type: number, time: number}} 下次抽取神秘盒子的时间对象，type：时间类型（0：获取失败；1：估计时间；2：精确时间）；time：下次领取时间
     */
    getNextDrawSmboxTime: function () {
        var log = Tools.getCookie(Const.drawSmboxCookieName);
        if (log) {
            log = log.split('|');
            if (log.length === 2) {
                var type = parseInt(log[0]);
                var time = parseInt(log[1]);
                if (!isNaN(type) && !isNaN(time) && type > 0 && time > 0) {
                    return {type: parseInt(type), time: parseInt(time)};
                }
            }
        }
        return {type: 0, time: 0};
    },

    /**
     * 抽取神秘盒子
     */
    drawSmbox: function () {
        Func.run('KFOL.drawSmbox_before_');
        console.log('抽取神秘盒子Start');
        $.get('kf_smbox.php?t=' + new Date().getTime(), function (html) {
            if (KFOL.getNextDrawSmboxTime().type) return;
            if (!/kf_smbox\.php\?box=\d+&safeid=\w+/i.test(html)) {
                KFOL.showFormatLog('抽取神秘盒子', html);
                return;
            }
            var smboxNumber = 0;
            var url = '';
            for (var i in Config.favorSmboxNumbers) {
                var regex = new RegExp('kf_smbox\\.php\\?box=' + Config.favorSmboxNumbers[i] + '&safeid=\\w+', 'i');
                var favorMatches = regex.exec(html);
                if (favorMatches) {
                    smboxNumber = Config.favorSmboxNumbers[i];
                    url = favorMatches[0];
                    break;
                }
            }
            if (!url) {
                var matches = html.match(/kf_smbox\.php\?box=\d+&safeid=\w+/gi);
                if (!matches) return;
                url = matches[Math.floor(Math.random() * matches.length)];
                var numberMatches = /box=(\d+)/i.exec(url);
                smboxNumber = numberMatches ? numberMatches[1] : 0;
            }

            $.get(url + '&t=' + new Date().getTime(), function (html) {
                var nextTime = Tools.getDate('+' + Const.defDrawSmboxInterval + 'm');
                Tools.setCookie(Const.drawSmboxCookieName, '2|' + nextTime.getTime(), nextTime);
                KFOL.showFormatLog('抽取神秘盒子', html);
                var kfbRegex = /获得了(\d+)KFB的奖励.*?(\(\d+\|\d+\))/i;
                var smRegex = /获得本轮的头奖/i;
                var msg = '<strong>抽取神秘盒子[<em>No.{0}</em>]</strong>'.replace('{0}', smboxNumber);
                var gain = {};
                var action = '抽取神秘盒子[`No.{0}`]'.replace('{0}', smboxNumber);
                if (kfbRegex.test(html)) {
                    var matches = kfbRegex.exec(html);
                    msg += '<i>KFB<em>+{0}</em></i><i class="pd_notice">{1}</i>'
                        .replace('{0}', matches[1])
                        .replace('{1}', matches[2]);
                    gain['KFB'] = parseInt(matches[1]);
                    action += ' ' + matches[2];
                }
                else if (smRegex.test(html)) {
                    msg += '<i class="pd_highlight" style="font-weight:bold">KFB<em>+{0}</em></i><a target="_blank" href="kf_smbox.php">查看头奖</a>'
                        .replace('{0}', Const.smboxFirstPrizeBonus);
                    gain['KFB'] = Const.smboxFirstPrizeBonus;
                }
                else {
                    nextTime = Tools.getDate('+1h');
                    Tools.setCookie(Const.drawSmboxCookieName, '1|' + nextTime.getTime(), nextTime);
                    return;
                }
                Log.push('抽取神秘盒子', action, {gain: gain});
                KFOL.showMsg(msg);
                if (KFOL.isInHomePage) {
                    $('a[href="kf_smbox.php"].indbox5').removeClass('indbox5').addClass('indbox6');
                }
                Func.run('KFOL.drawSmbox_after_', html);
            }, 'html');
        }, 'html');
    },

    /**
     * 添加神秘盒子链接点击事件
     */
    addSmboxLinkClickEvent: function () {
        $('.box1').on('click', 'a[href^="kf_smbox.php?box="]', function () {
            if (KFOL.getNextDrawSmboxTime().type) return;
            var nextTime = Tools.getDate('+' + Const.defDrawSmboxInterval + 'm').getTime() + 10 * 1000;
            Tools.setCookie(Const.drawSmboxCookieName, '2|' + nextTime, new Date(nextTime));
        });
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

        var getLootAwardInterval = -1, autoAttackInterval = -1, attackCheckInterval = -1;
        if (Config.autoLootEnabled) {
            var lootTimeLog = Loot.getNextLootAwardTime();
            if (lootTimeLog.type > 0) {
                getLootAwardInterval = Math.floor((lootTimeLog.time - new Date().getTime()) / 1000);
                if (getLootAwardInterval < 0) getLootAwardInterval = 0;
            }
            else getLootAwardInterval = 0;
            if (Config.noAutoLootWhen.length > 0) {
                var next = Tools.getDate('+' + getLootAwardInterval + 's');
                var now = new Date();
                for (var i in Config.noAutoLootWhen) {
                    var whenArr = Config.noAutoLootWhen[i].split('-');
                    if (whenArr.length !== 2) continue;
                    var start = Tools.getDateByTime(whenArr[0]);
                    var end = Tools.getDateByTime(whenArr[1]);
                    if (end < start) {
                        if (now > end) end.setDate(end.getDate() + 1);
                        else start.setDate(start.getDate() - 1);
                    }
                    if (next >= start && next <= end) {
                        getLootAwardInterval = Math.floor((end - now) / 1000);
                        break;
                    }
                }
            }
            if (Config.autoAttackEnabled && Config.attackAfterTime > 0 && !$.isEmptyObject(Config.batchAttackList)
                && Tools.getCookie(Const.autoAttackReadyCookieName) && !Tools.getCookie(Const.autoAttackingCookieName)) {
                if (lootTimeLog.type > 0) {
                    var attackAfterTime = Config.attackAfterTime;
                    if (lootTimeLog.type === 1) {
                        var diff = attackAfterTime - Const.minAttackAfterTime - 30;
                        if (diff < 0) diff = 0;
                        else if (diff > 30) diff = 30;
                        attackAfterTime -= diff;
                    }
                    autoAttackInterval = Math.floor((lootTimeLog.time - attackAfterTime * 60 * 1000 - new Date().getTime()) / 1000);
                    if (autoAttackInterval < 0) autoAttackInterval = 0;
                }
                else autoAttackInterval = 0;
                if (Config.attemptAttackEnabled && autoAttackInterval > 0) {
                    var time = parseInt(Tools.getCookie(Const.checkLifeCookieName));
                    var now = new Date();
                    if (!isNaN(time) && time > 0 && time >= now.getTime()) {
                        attackCheckInterval = Math.floor((time - now.getTime()) / 1000);
                    }
                    else attackCheckInterval = 0;
                }
            }
            if (Config.autoAttackEnabled && autoAttackInterval === -1 && Tools.getCookie(Const.autoAttackingCookieName))
                autoAttackInterval = Const.checkAutoAttackingInterval * 60 + 1;
        }

        var drawSmboxInterval = -1;
        if (Config.autoDrawSmbox2Enabled) {
            var smboxTimeLog = KFOL.getNextDrawSmboxTime();
            if (smboxTimeLog.type > 0) {
                drawSmboxInterval = Math.floor((smboxTimeLog.time - new Date().getTime()) / 1000);
                if (drawSmboxInterval < 0) drawSmboxInterval = 0;
            }
            else drawSmboxInterval = 0;
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

        var minArr = [donationInterval, getLootAwardInterval, autoAttackInterval, attackCheckInterval, drawSmboxInterval, autoChangeSMColorInterval];
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
                        window.setTimeout(handleError, interval * 60 * 1000);
                        showRefreshModeTips(interval * 60, true);
                    }
                    else {
                        if (errorNum > 6) {
                            errorNum = 0;
                            interval = 15;
                            window.setTimeout(checkRefreshInterval, interval * 60 * 1000);
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
            var isGetLootAwardStarted = false;
            var autoDonationAvailable = Config.autoDonationEnabled && !Tools.getCookie(Const.donationCookieName);
            if (Config.autoLootEnabled && !Loot.getNextLootAwardTime().type) {
                isGetLootAwardStarted = true;
                Loot.getLootAward(autoDonationAvailable, Config.autoSaveCurrentDepositEnabled);
            }
            if (Config.autoDrawSmbox2Enabled && !KFOL.getNextDrawSmboxTime().type) {
                KFOL.drawSmbox();
            }
            if (autoDonationAvailable && !isGetLootAwardStarted) {
                KFOL.donation();
            }
            if (Config.autoLootEnabled && Config.autoAttackEnabled && Tools.getCookie(Const.autoAttackReadyCookieName)
                && !Tools.getCookie(Const.autoAttackingCookieName)) {
                Loot.checkAutoAttack();
            }
            if (Config.autoChangeSMColorEnabled && !Tools.getCookie(Const.autoChangeSMColorCookieName)) KFOL.changeSMColor();

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
            window.setTimeout(checkRefreshInterval, interval * 1000);
            showRefreshModeTips(interval, true);
        };

        window.setTimeout(checkRefreshInterval, interval < 60 ? 60 * 1000 : interval * 1000);
        showRefreshModeTips(interval < 60 ? 60 : interval);
    },

    /**
     * 添加设置和日志对话框的链接
     */
    addConfigAndLogDialogLink: function () {
        var $login = $('a[href^="login.php?action=quit"]:eq(0)');
        $('<a href="#">助手设置</a><span style="margin:0 4px">|</span>').insertBefore($login)
            .filter('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.show();
        });
        if (Config.showLogLinkInPageEnabled) {
            $('<a href="#">助手日志</a><span style="margin:0 4px">|</span>').insertBefore($login)
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
            $this.html('<a class="pd_goto_link" href="{0}">{1}</a>'.replace('{0}', url).replace('{1}', floorText));
            $this.find('a').click(function (e) {
                e.preventDefault();
                window.prompt('本楼的跳转链接（请按Ctrl+C复制）：', url);
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
     * 在帖子列表页面中添加帖子页数快捷链接
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
            var value = $.trim(window.prompt('统计到第几楼？（0表示统计所有楼层，可用m-n的方式来设定统计楼层的区间范围）', 0));
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
                                window.setTimeout(function () {
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
                            window.setTimeout(function () {
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
            var matches = /^(https?:\/\/(?:[\w\.]+?\.)?(?:2dgal|ddgal|9gal|9baka|9moe|kfgal|2dkf|miaola)\.[\w\.]+?\/).+/i.exec(url);
            if (matches) $this.attr('href', url.replace(matches[1], Tools.getHostNameUrl()));
        });
    },

    /**
     * 添加购买帖子提醒
     */
    addBuyThreadWarning: function () {
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
                if (sell < Const.minBuyThreadWarningSell || window.confirm('此贴售价{0}KFB，是否购买？'.replace('{0}', sell))) {
                    location.href = url;
                }
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
        $('<span style="margin:0 5px">|</span><a class="pd_buy_thread_btn" title="批量购买所选帖子" href="#">批量购买</a>').insertAfter('td > a[href^="kf_tidfavor.php?action=favor&tid="]')
            .filter('a').click(function (e) {
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
            if (window.confirm('你共选择了{0}个帖子，总售价{1}KFB，均价{2}KFB，是否批量购买？'
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
                            window.setTimeout(function () {
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
                var value = window.prompt('为此用户添加备注（要删除备注请留空）：', memo);
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
                            type = window.prompt('请填写屏蔽类型，0：屏蔽主题和回帖；1：仅屏蔽主题；2：仅屏蔽回帖', type);
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
            var fid = parseInt(Tools.getUrlParam('fid'));
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
                var matches = /fid=(\d+)/i.exec($('form[name="delatc"] > div:first > table > tbody > tr:nth-child(2) > td > a[href^="thread.php?fid="]').attr('href'));
                if (!matches) return;
                var fid = parseInt(matches[1]);
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
            var fid = parseInt(Tools.getUrlParam('fid'));
            if (isNaN(fid) || fid <= 0) return;
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
            var fid = 0;
            var matches = /fid=(\d+)/i.exec($threadInfo.find('tr:nth-child(2) > td > a[href^="thread.php?fid="]').attr('href'));
            if (matches) fid = parseInt(matches[1]);
            if (isNaN(fid) || fid <= 0) return;
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
                '<a href="guanjianci.php?gjc={0}">@提醒</a> | <a href="personal.php?action=post">回复</a> | <a href="kf_growup.php">神秘</a><br />'
                    .replace('{0}', KFOL.userName) +
                '<a href="kf_fw_ig_index.php">争夺</a> | <a href="kf_fw_ig_my.php">道具</a> | <a href="kf_smbox.php">盒子</a><br />' +
                '<a href="profile.php?action=modify">设置</a> | <a href="hack.php?H_name=bank">银行</a> | <a href="profile.php?action=favor">收藏</a><br />'
            );
        }
        else {
            $('#r_menu > ul > li:last-child').before(
                '<li class="r_cmenuho"><a href="javascript:;">快捷导航</a>' +
                '  <ul class="r_cmenu2">' +
                '    <li><a href="guanjianci.php?gjc={0}">@提醒</a></li>'.replace('{0}', KFOL.userName) +
                '    <li><a href="kf_growup.php">神秘等级</a></li>' +
                '    <li><a href="kf_fw_ig_index.php">争夺奖励</a></li>' +
                '    <li><a href="kf_fw_ig_my.php">我的道具</a></li>' +
                '    <li><a href="kf_fw_ig_shop.php">道具商店</a></li>' +
                '    <li><a href="kf_smbox.php">神秘盒子</a></li>' +
                '    <li><a href="profile.php?action=modify">设置</a></li>' +
                '    <li><a href="hack.php?H_name=bank">银行</a></li>' +
                '    <li><a href="profile.php?action=favor">收藏</a></li>' +
                '    <li><a href="personal.php?action=post">我的回复</a></li>' +
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
            $.post('hack.php?H_name=bank',
                {action: 'save', btype: 1, savemoney: money},
                function (html) {
                    if (/完成存款/.test(html)) {
                        Log.push('自动存款', '共有`{0}`KFB已自动存入活期存款'.replace('{0}', money));
                        KFOL.showFormatLog('自动存款', html);
                        console.log('共有{0}KFB已自动存入活期存款'.replace('{0}', money));
                        KFOL.showMsg('共有<em>{0}</em>KFB已自动存入活期存款'.replace('{0}', money));
                        if (KFOL.isInHomePage) $kfb.text('拥有{0}KFB'.replace('{0}', income - money));
                    }
                }, 'html');
        };

        if (isRead) {
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
        var matches = /神秘(\d+)级/.exec($('a[href="kf_growup.php"][title="用户等级和权限"]').text());
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
        else if (smLevel < data.smLevel) {
            writeData(smLevel);
        }
    },

    /**
     * 在神秘系数排名发生变化时进行提醒
     */
    smRankChangeAlert: function () {
        var matches = /系数排名第\s*(\d+)\s*位/.exec($('a[href="kf_growup.php"][title="用户等级和权限"]').text());
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
                var title = $.trim(window.prompt('请填写所要选择的包含指定字符串的短消息标题（可用|符号分隔多个标题）', '收到了他人转账的KFB|银行汇款通知|您的文章被评分|您的文章被删除'));
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
     * 在首页上显示领取争夺奖励的剩余时间
     */
    showLootAwardInterval: function () {
        var timeLog = Loot.getNextLootAwardTime();
        if (!timeLog.type) return;
        var $msg = $('a[href="kf_fw_ig_index.php"]');
        if ($msg.length === 0) return;
        var diff = Tools.getTimeDiffInfo(timeLog.time);
        if (diff.hours === 0 && diff.minutes === 0 && diff.seconds === 0) return;
        if (timeLog.type === 2) {
            $msg.text('争夺奖励 (剩余{0}{1}分)'.replace('{0}', diff.hours < 1 ? '' : diff.hours + '小时').replace('{1}', diff.minutes));
        }
        else {
            diff.hours += 1;
            $msg.text('争夺奖励 (剩余{0})'.replace('{0}', diff.hours < 1 ? '1小时以内' : diff.hours + '个多小时'));
        }
        if (!Tools.getCookie(Const.autoAttackReadyCookieName))
            $msg.removeClass('indbox5').addClass('indbox6');
    },

    /**
     * 在首页上显示抽取神秘盒子的剩余时间
     */
    showDrawSmboxInterval: function () {
        var timeLog = KFOL.getNextDrawSmboxTime();
        if (timeLog.type !== 2) return;
        var $msg = $('a[href="kf_smbox.php"]');
        if ($msg.length === 0) return;
        var diff = Tools.getTimeDiffInfo(timeLog.time);
        if (diff.hours === 0 && diff.minutes === 0 && diff.seconds === 0) return;
        $msg.text('神秘盒子 (剩余{0}{1}分)'.replace('{0}', diff.hours < 1 ? '' : diff.hours + '小时').replace('{1}', diff.minutes))
            .removeClass('indbox5')
            .addClass('indbox6');
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
            var $fieldset = $(this).closest('fieldset');
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
     * 添加自动更换神秘颜色的按钮
     */
    addAutoChangeSmColorButton: function () {
        var $autoChangeSMColor = $('table div > table > tbody > tr > td:contains("自定义ID颜色")');
        $('<span class="pd_highlight">低等级没人权？没有自己喜欢的颜色？快来试试助手的<a href="#">自定义本人神秘颜色</a>的功能吧！（虽然仅限自己可见 ╮(╯▽╰)╭）</span><br />')
            .appendTo($autoChangeSMColor)
            .find('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.show();
        });

        var $smColors = $autoChangeSMColor.parent('tr').nextAll('tr').not('tr:last');
        if ($smColors.find('a').length <= 1) return;
        $('<form><div id="pd_auto_change_sm_color_btns" style="margin-top:5px">' +
            '<label><input id="pd_cfg_auto_change_sm_color_enabled" class="pd_input" type="checkbox" /> 自动更换神秘颜色</label></div></form>')
            .appendTo($autoChangeSMColor)
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
                    $smColors.addClass('pd_sm_color_select').find('td:not(:has(a))').css('cursor', 'not-allowed');
                    $('<label>更换顺序 <select id="pd_cfg_auto_change_sm_color_type" style="font-size:12px"><option value="random">随机</option>' +
                        '<option value="sequence">顺序</option></select></label>' +
                        '<label>每隔 <input id="pd_cfg_auto_change_sm_color_interval" class="pd_input" style="width:25px" type="text" maxlength="5" /> 小时</label>' +
                        '<button>保存</button><button style="margin-left:3px">重置</button><br />' +
                        '<a href="#">全选</a><a style="margin-left:7px;margin-right:10px" href="#">反选</a>' +
                        '<label><input id="pd_cfg_change_all_available_sm_color_enabled" class="pd_input" type="checkbox" /> 选择当前所有可用的神秘颜色</label>'
                    ).insertAfter($this.parent()).filter('button:first').click(function (e) {
                        e.preventDefault();
                        var $autoChangeSMColorInterval = $('#pd_cfg_auto_change_sm_color_interval');
                        var interval = parseInt($.trim($autoChangeSMColorInterval.val()));
                        if (isNaN(interval) || interval <= 0) {
                            alert('神秘颜色更换时间间隔格式不正确');
                            $autoChangeSMColorInterval.select();
                            $autoChangeSMColorInterval.focus();
                            return;
                        }
                        var changeAllAvailableSMColorEnabled = $('#pd_cfg_change_all_available_sm_color_enabled').prop('checked');
                        var customChangeSMColorList = [];
                        $smColors.find('input[type="checkbox"]:checked').each(function () {
                            customChangeSMColorList.push(parseInt($(this).val()));
                        });
                        if (!changeAllAvailableSMColorEnabled && customChangeSMColorList.length <= 1) {
                            alert('必须选择2种或以上的神秘颜色');
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
                        if ($smColors.find('input[disabled]').length > 0) {
                            alert('请先取消勾选“选择当前所有可用的神秘颜色”复选框');
                            $('#pd_cfg_change_all_available_sm_color_enabled').focus();
                            return;
                        }
                        if ($(this).is('#pd_auto_change_sm_color_btns > a:first')) {
                            $smColors.find('input[type="checkbox"]').prop('checked', true);
                        }
                        else {
                            $smColors.find('input[type="checkbox"]').each(function () {
                                $(this).prop('checked', !$(this).prop('checked'));
                            });
                        }
                    });

                    $smColors.find('td:has(a)').each(function () {
                        var $this = $(this);
                        var matches = /&color=(\d+)/i.exec($this.find('a').attr('href'));
                        if (matches) {
                            $this.append('<input type="checkbox" class="pd_input" value="{0}" />'.replace('{0}', matches[1]));
                        }
                    });

                    $('#pd_cfg_auto_change_sm_color_type').val(Config.autoChangeSMColorType);
                    $('#pd_cfg_auto_change_sm_color_interval').val(Config.autoChangeSMColorInterval);
                    $('#pd_cfg_change_all_available_sm_color_enabled').click(function () {
                        $smColors.find('input').prop('disabled', $(this).prop('checked'));
                    }).prop('checked', Config.changeAllAvailableSMColorEnabled).triggerHandler('click');
                    for (var i in Config.customAutoChangeSMColorList) {
                        $smColors.find('input[value="{0}"]'.replace('{0}', Config.customAutoChangeSMColorList[i])).prop('checked', true);
                    }
                }
                else {
                    $this.parent().nextAll().remove();
                    $smColors.removeClass('pd_sm_color_select').find('input').remove();
                }
            });

        $smColors.on('click', 'td', function (e) {
            if (!$(e.target).is('a')) {
                var $this = $(this);
                if ($this.find('input[disabled]').length > 0) {
                    alert('请先取消勾选“选择当前所有可用的神秘颜色”复选框');
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
    },

    /**
     * 更换神秘颜色
     */
    changeSMColor: function () {
        if (!Config.changeAllAvailableSMColorEnabled && Config.customAutoChangeSMColorList.length <= 1) return;
        /**
         * 写入Cookie
         */
        var setCookie = function () {
            var nextTime = Tools.getDate('+' + Config.autoChangeSMColorInterval + 'h');
            Tools.setCookie(Const.autoChangeSMColorCookieName, nextTime.getTime(), nextTime);
        };
        console.log('自动更换神秘颜色Start');
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
                    KFOL.showFormatLog('自动更换神秘颜色', html);
                    if (/等级颜色修改完毕/.test(html)) {
                        console.log('神秘颜色ID更换为：' + nextId);
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
            if (typeof textArea.selectionStart !== 'undefined') {
                var prePos = textArea.selectionStart;
                textArea.value = textArea.value.substr(0, prePos) + code + textArea.value.substr(prePos);
                textArea.selectionStart = prePos + code.length;
                textArea.selectionEnd = prePos + code.length;
            }
            else {
                textArea.value += code;
            }
            if (!KFOL.isMobile) textArea.focus();
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
            if (target.title && $.inArray(target.nodeName, excludeNodeNameList) === -1 && (!target.id || target.id.indexOf('wy_') !== 0) && !$(target).is('.pd_editor_btn')) {
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
    addSearchTypeSelectBox: function () {
        var $keyWord = $('input[type="text"][name="keyword"]');
        $keyWord.css('width', '116px');
        var $searchType = $('<div class="pd_search_type"><span>标题</span><i>&#8744;</i></div>').insertAfter($keyWord);
        $searchType.click(function () {
            var $searchTypeList = $('.pd_search_type_list');
            if ($searchTypeList.length > 0) {
                $searchTypeList.remove();
                return;
            }
            $searchTypeList = $('<ul class="pd_search_type_list"><li>标题</li><li>作者</li><li>关键词</li><li>用户名</li></ul>').appendTo('body');
            var offset = $searchType.offset();
            $searchTypeList.css('top', offset.top + $searchType.height() + 2).css('left', offset.left + 1);
            $searchTypeList.on('click', 'li', function () {
                var $this = $(this);
                var type = $.trim($this.text());
                $searchType.find('span').text(type);
                var $form = $keyWord.closest('form');
                if (type === '关键词') $form.attr('action', 'guanjianci.php?');
                else if (type === '用户名') $form.attr('action', 'profile.php?action=show');
                else $form.attr('action', 'search.php?');
                if (type === '作者') $keyWord.attr('name', 'pwuser');
                else if (type === '关键词') $keyWord.attr('name', 'gjc');
                else if (type === '用户名') $keyWord.attr('name', 'username');
                else $keyWord.attr('name', 'keyword');
                $searchTypeList.remove();
                $keyWord.focus();
            });
        });

        $('form[action="search.php?"]').submit(function () {
            var $this = $(this);
            var type = $.trim($searchType.find('span').text());
            if (type === '关键词') {
                $this.attr('action', 'guanjianci.php?gjc=' + $this.find('input[name="gjc"]').val());
            }
            else if (type === '用户名') {
                $this.attr('action', 'profile.php?action=show&username=' + $this.find('input[name="username"]').val());
            }
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

        /**
         * 添加BBCode
         * @param {string} code BBCode
         * @param {string} selText 选择文本
         */
        var addCode = function (code, selText) {
            var startPos = selText == '' ? code.indexOf(']') + 1 : code.indexOf(selText);
            if (typeof textArea.selectionStart !== 'undefined') {
                var prePos = textArea.selectionStart;
                textArea.value = textArea.value.substr(0, prePos) + code + textArea.value.substr(textArea.selectionEnd);
                textArea.selectionStart = prePos + startPos;
                textArea.selectionEnd = prePos + startPos + selText.length;
            }
            else {
                textArea.value += code;
            }
        };

        /**
         * 获取选择文本
         * @returns {string} 选择文本
         */
        var getSelText = function () {
            return textArea.value.substr(textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart);
        };

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
                    text = window.prompt('请输入神秘等级：', 5);
                    break;
                case 'audio':
                    text = Tools.convertToAudioExternalLinkUrl(window.prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐或虾米的单曲地址，将自动转换为外链地址）', 'http://'));
                    break;
                case 'video':
                    text = Tools.convertToVideoExternalLinkUrl(window.prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://'));
                    break;
            }
            if (text === null) return;

            var selText = '';
            var code = '';
            switch (type) {
                case 'hide':
                    selText = getSelText();
                    code = '[hide={0}]{1}[/hide]'.replace('{0}', text).replace('{1}', selText);
                    break;
                case 'left':
                    selText = getSelText();
                    code = '[align=left]{0}[/align]'.replace('{0}', selText);
                    break;
                case 'center':
                    selText = getSelText();
                    code = '[align=center]{0}[/align]'.replace('{0}', selText);
                    break;
                case 'right':
                    selText = getSelText();
                    code = '[align=right]{0}[/align]'.replace('{0}', selText);
                    break;
                case 'fly':
                    selText = getSelText();
                    code = '[fly]{0}[/fly]'.replace('{0}', selText);
                    break;
                case 'sub':
                    selText = getSelText();
                    code = '[sub]{0}[/sub]'.replace('{0}', selText);
                    break;
                case 'sup':
                    selText = getSelText();
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
            addCode(code, selText);
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
        $('form[name="FORM"]').find('input[name="atc_autourl"], input[name="atc_convert"]').remove();
        $('#menu_show').closest('td').append(
            '<div class="pd_post_extra_option">' +
            '  <label><input type="checkbox" name="atc_autourl" value="1" checked="checked" /> 自动分析url</label><br />' +
            '  <label><input type="checkbox" name="atc_convert" value="1" checked="checked" /> Wind Code自动转换</label>' +
            '</div>'
        );

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
        KFOL.window.is_ie = typeof KFOL.window.is_ie !== 'undefined' ? KFOL.window.is_ie : false;

        if (location.pathname === '/read.php') {
            KFOL.window.strlen = Tools.getStrLen;
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
     * 可使用2个字以下的关键字进行搜索
     */
    makeSearchByBelowTwoKeyWordAvailable: function () {
        $('form[action="search.php?"]').submit(function () {
            var $this = $(this);
            var $keyWord = $this.find('input[name="keyword"]');
            var $method = $this.find('input[name="method"]');
            if (!$keyWord.length || !$method.length) return;
            var keyWord = $.trim($keyWord.val());
            if (!keyWord || Tools.getStrLen(keyWord) > 2) return;
            $keyWord.val(keyWord + ' ' + Math.floor(new Date().getTime() / 1000));
            $method.val('OR');
            window.setTimeout(function () {
                $keyWord.val(keyWord);
                $method.val('AND');
            }, 500);
        });
    },

    /**
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined') return;
        var startDate = new Date();
        //console.log('【KF Online助手】启动');
        if (location.pathname === '/' || location.pathname === '/index.php') KFOL.isInHomePage = true;
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
        if (Config.modifySideBarEnabled) KFOL.modifySideBar();
        if (Config.addSideBarFastNavEnabled) KFOL.addFastNavForSideBar();
        if (KFOL.isInHomePage) {
            KFOL.handleAtTips();
            KFOL.showLootAwardInterval();
            KFOL.showDrawSmboxInterval();
            KFOL.addSearchTypeSelectBox();
            KFOL.makeSearchByBelowTwoKeyWordAvailable();
            if (Config.smLevelUpAlertEnabled) KFOL.smLevelUpAlert();
            if (Config.smRankChangeAlertEnabled) KFOL.smRankChangeAlert();
            if (Config.showVipSurplusTimeEnabled) KFOL.showVipSurplusTime();
            if (Config.homePageThreadFastGotoLinkEnabled) KFOL.addHomePageThreadFastGotoLink();
            if (Config.fixedDepositDueAlertEnabled && !Tools.getCookie(Const.fixedDepositDueAlertCookieName))
                Bank.fixedDepositDueAlert();
        }
        else if (location.pathname === '/read.php') {
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
            KFOL.addBuyThreadWarning();
            if (Config.batchBuyThreadEnabled) KFOL.addBatchBuyThreadButton();
            if (Config.userMemoEnabled) KFOL.addUserMemo();
            KFOL.addCopyCodeLink();
            KFOL.addMoreSmileLink();
        }
        else if (location.pathname === '/thread.php') {
            KFOL.makeSearchByBelowTwoKeyWordAvailable();
            if (Config.highlightNewPostEnabled) KFOL.highlightNewPost();
            if (Config.showFastGotoThreadPageEnabled) KFOL.addFastGotoThreadPageLink();
        }
        else if (/\/kf_fw_ig_my\.php$/i.test(location.href)) {
            Item.enhanceMyItemsPage();
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
        else if (/\/kf_fw_ig_my\.php\?pro=\d+&display=1$/i.test(location.href)) {
            Item.addSampleItemTips();
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
            KFOL.addAutoChangeSmColorButton();
        }
        else if (location.pathname === '/kf_fw_ig_shop.php') {
            Item.addBatchBuyItemsLink();
        }
        else if (location.pathname === '/kf_fw_ig_index.php') {
            Loot.handleInLootIndexPage();
            if (Config.customMonsterNameEnabled) Loot.customMonsterName();
        }
        else if (/\/kf_fw_ig_pklist\.php(\?l=s)?$/i.test(location.href)) {
            Loot.addBatchAttackButton();
            if (Config.customMonsterNameEnabled) Loot.customMonsterName();
            Loot.addMonsterLootInfoTips();
        }
        else if (location.pathname === '/kf_smbox.php') {
            KFOL.addSmboxLinkClickEvent();
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
        if (location.pathname === '/post.php') {
            KFOL.addExtraPostEditorButton();
            KFOL.addExtraOptionInPostPage();
        }
        if (Config.blockUserEnabled) KFOL.blockUsers();
        if (Config.blockThreadEnabled) KFOL.blockThread();
        if (Config.followUserEnabled) KFOL.followUsers();
        if (KFOL.isMobile) KFOL.bindElementTitleClick();

        var isGetLootAwardStarted = false;
        var autoDonationAvailable = Config.autoDonationEnabled && !Tools.getCookie(Const.donationCookieName);
        if (Config.autoLootEnabled && !Loot.getNextLootAwardTime().type) {
            isGetLootAwardStarted = true;
            Loot.getLootAward(autoDonationAvailable);
        }

        if (Config.autoDrawSmbox2Enabled && !KFOL.getNextDrawSmboxTime().type) {
            KFOL.drawSmbox();
        }

        var isDonationStarted = false;
        var autoSaveCurrentDepositAvailable = Config.autoSaveCurrentDepositEnabled && KFOL.isInHomePage;
        if (autoDonationAvailable && !isGetLootAwardStarted) {
            isDonationStarted = true;
            KFOL.donation(autoSaveCurrentDepositAvailable);
        }

        if (autoSaveCurrentDepositAvailable && !isDonationStarted) KFOL.autoSaveCurrentDeposit();

        if (Config.autoLootEnabled && Config.autoAttackEnabled && Tools.getCookie(Const.autoAttackReadyCookieName)
            && !Tools.getCookie(Const.autoAttackingCookieName)) {
            Loot.checkAutoAttack();
        }

        if (Config.autoChangeSMColorEnabled && !Tools.getCookie(Const.autoChangeSMColorCookieName)) KFOL.changeSMColor();

        if (Config.autoRefreshEnabled && KFOL.isInHomePage) KFOL.startAutoRefreshMode();

        if (Config.customScriptEnabled) KFOL.runCustomScript(2);

        var endDate = new Date();
        console.log('【KF Online助手】加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

KFOL.init();
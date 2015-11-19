// ==UserScript==
// @name        KF Online助手
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KFOL必备！可在绯月Galgame上自动进行争夺、抽取神秘盒子以及KFB捐款，并可使用各种便利的辅助功能，更多功能开发中……
// @updateURL   https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.meta.js
// @downloadURL https://greasyfork.org/scripts/8615-kf-online%E5%8A%A9%E6%89%8B/code/KF%20Online%E5%8A%A9%E6%89%8B.user.js
// @include     http://2dgal.com/*
// @include     http://*.2dgal.com/*
// @include     http://9baka.com/*
// @include     http://*.9baka.com/*
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Config.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/ConfigMethod.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Tools.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Dialog.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/ConfigDialog.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Log.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/TmpLog.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Item.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Card.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Bank.js
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/Loot.js
// @version     4.6.2-dev
// @grant       none
// @run-at      document-end
// @license     MIT
// ==/UserScript==
// 版本号
var version = '4.6.2';
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
        KFOL.uid = matches[1];
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
     * 添加CSS样式
     */
    appendCss: function () {
        $('head').append(
            '<style type="text/css">' +
            '.pd_layer { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1000; }' +
            '.pd_pop_box { position: fixed; width: 100%; z-index: 1001; }' +
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
            '.pd_pop_tips em, .pd_stat em, .pd_pop_tips ins, .pd_stat ins { font-weight: 700; font-style: normal; color:#FF6600; padding: 0 5px; }' +
            '.pd_pop_tips ins, .pd_stat ins { text-decoration: none; color: #339933; }' +
            '.pd_pop_tips a { font-weight: bold; margin-left: 15px; }' +
            '.pd_stat i { font-style: normal; margin-right: 3px; }' +
            '.pd_stat .pd_notice { margin-left: 5px; }' +
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
            '.pd_thread_page { margin-left: 5px; }' +
            '.pd_thread_page a { color: #444; padding: 0 3px; }' +
            '.pd_thread_page a:hover { color: #51D; }' +
            '.pd_card_chk { position: absolute; bottom: -8px; left: 1px; }' +
            '.pd_disabled_link { color: #999 !important; text-decoration: none !important; cursor: default; }' +
            '.b_tit4 .pd_thread_goto, .b_tit4_1 .pd_thread_goto { position: absolute; top: 0; right: 0; padding: 0 10px; }' +
            '.b_tit4 .pd_thread_goto:hover, .b_tit4_1 .pd_thread_goto:hover { padding-left: 10px; }' +
            '.pd_custom_tips { cursor: help; }' +
            '.pd_user_memo { font-size: 12px; color: #999; line-height: 14px; }' +
            '.pd_user_memo_tips { font-size: 12px; color: #FFF; margin-left: 3px; cursor: help; }' +
            '.pd_user_memo_tips:hover { color: #DDD; }' +
            '.pd_sm_color_select > td { position: relative; cursor: pointer; }' +
            '.pd_sm_color_select > td > input { position: absolute; top: 18px; left: 10px; }' +

                /* 设置对话框 */
            '.pd_cfg_box {' +
            '  position: fixed; border: 1px solid #9191FF; display: none; z-index: 1002;' +
            '  -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);' +
            '  -o-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);' +
            '}' +
            '.pd_cfg_box h1 {text-align: center; font-size: 14px; background-color: #9191FF; color: #FFF; line-height: 2em; margin: 0; padding-left: 20px; }' +
            '.pd_cfg_box h1 span { float: right; cursor: pointer; padding: 0 10px; }' +
            '#pd_log { width: 600px; }' +
            '#pd_custom_sm_color { width: 360px; }' +
            '.pd_cfg_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }' +
            '.pd_cfg_nav a { margin-left: 10px; }' +
            '.pd_cfg_main { background-color: #FCFCFC; padding: 0 10px; font-size: 12px; line-height: 22px; min-height: 180px; overflow: auto; }' +
            '.pd_cfg_main fieldset { border: 1px solid #CCCCFF; }' +
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
            '#pd_attack_log_content {' +
            '  width: 850px; min-height: 160px; max-height: 500px; margin: 5px 0; padding: 5px; border: 1px solid #9191FF; overflow: auto;' +
            '  line-height: 1.6em; background-color: #FFF;' +
            '}' +
            '#pd_cfg_follow_user_list, #pd_cfg_block_user_list { max-height: 480px; overflow: auto; }' +
            '#pd_auto_change_sm_color_btns label { margin-right: 10px; }' +

                /* 日志对话框 */
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
        var $popBox = $('.pd_pop_box');
        var isFirst = $popBox.length === 0;
        if (!isFirst && $('.pd_layer').length === 0) {
            var $lastTips = $('.pd_pop_tips:last');
            if ($lastTips.length > 0) {
                var top = $lastTips.offset().top;
                if (top < 0 || top >= $(window).height()) {
                    $popBox.remove();
                    isFirst = true;
                }
            }
        }
        if (settings.preventable && $('.pd_layer').length === 0) {
            $('<div class="pd_layer"></div>').appendTo('body');
        }
        if (isFirst) {
            $popBox = $('<div class="pd_pop_box"></div>').appendTo('body');
        }
        var $popTips = $('<div class="pd_pop_tips">' + settings.msg + '</div>').appendTo($popBox);
        if (settings.clickable) {
            $popTips.css('cursor', 'pointer').click(function () {
                $(this).stop(true, true).fadeOut('slow', function () {
                    KFOL.removePopTips($(this));
                });
            }).find('a').click(function (e) {
                e.stopPropagation();
            });
        }
        var popTipsHeight = $popTips.outerHeight();
        var popTipsWidth = $popTips.outerWidth();
        if (isFirst) {
            $popBox.css('top', $(window).height() / 2 - popTipsHeight / 2);
        }
        else {
            $popBox.animate({'top': '-=' + popTipsHeight / 1.5});
        }
        var $prev = $popTips.prev('.pd_pop_tips');
        $popTips.css('top', $prev.length > 0 ? parseInt($prev.css('top')) + $prev.outerHeight() + 5 : 0)
            .css('left', $(window).width() / 2 - popTipsWidth / 2)
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
            $('.pd_layer').remove();
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
        if (Config.donationAfterVipEnabled) {
            if (!KFOL.isInHomePage) return;
            if ($('a[href="kf_vmember.php"]:contains("VIP会员(参与论坛获得的额外权限)")').length > 0) {
                if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit();
                return;
            }
        }
        var now = new Date();
        var date = Tools.getDateByTime(Config.donationAfterTime);
        if (now < date) {
            if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit();
            return;
        }
        console.log('KFB捐款Start');
        /**
         * 使用指定的KFB捐款
         * @param {number} kfb 指定的KFB
         */
        var donationSubmit = function (kfb) {
            $.post('kf_growup.php?ok=1', {kfb: kfb}, function (html) {
                var date = Tools.getDateByTime('02:00:00');
                if (new Date() > date) date = Tools.getMidnightHourDate(1);
                Tools.setCookie(Config.donationCookieName, 1, date);
                KFOL.showFormatLog('捐款{0}KFB'.replace('{0}', kfb), html);
                var msg = '<strong>捐款<em>{0}</em>KFB</strong>'.replace('{0}', kfb);
                var matches = /捐款获得(\d+)经验值(?:.*?补偿期(?:.*?\+(\d+)KFB)?(?:.*?(\d+)成长经验)?)?/i.exec(html);
                if (!matches) {
                    if (/KFB不足。<br \/>/.test(html)) {
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
            }, 'html');
        };
        var donationKfb = Config.donationKfb;
        if (/%$/.test(donationKfb)) {
            $.get('profile.php?action=show&uid=' + KFOL.uid, function (html) {
                var matches = /论坛货币：(-?\d+)\s*KFB/i.exec(html);
                var income = 1;
                if (matches) income = parseInt(matches[1]);
                else console.log('KFB余额获取失败');
                donationKfb = parseInt(income * parseInt(donationKfb) / 100);
                donationKfb = donationKfb > 0 ? donationKfb : 1;
                donationKfb = donationKfb <= Config.maxDonationKfb ? donationKfb : Config.maxDonationKfb;
                donationSubmit(donationKfb);
            }, 'html');
        }
        else {
            donationSubmit(parseInt(donationKfb));
        }
    },

    /**
     * 获取下次抽取神秘盒子的时间对象
     * @returns {{type: number, time: number}} 下次抽取神秘盒子的时间对象，type：时间类型（0：获取失败；1：估计时间；2：精确时间）；time：下次领取时间
     */
    getNextDrawSmboxTime: function () {
        var log = Tools.getCookie(Config.drawSmboxCookieName);
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
        console.log('抽取神秘盒子Start');
        $.get('kf_smbox.php', function (html) {
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
            $.get(url, function (html) {
                var nextTime = Tools.getDate('+' + Config.defDrawSmboxInterval + 'm');
                Tools.setCookie(Config.drawSmboxCookieName, '2|' + nextTime.getTime(), nextTime);
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
                    msg += '<i class="pd_highlight" style="font-weight:bold">KFB<em>+2000</em></i><a target="_blank" href="kf_smbox.php">查看头奖</a>';
                    gain['KFB'] = 2000;
                }
                else {
                    nextTime = Tools.getDate('+1h');
                    Tools.setCookie(Config.drawSmboxCookieName, '1|' + nextTime.getTime(), nextTime);
                    return;
                }
                Log.push('抽取神秘盒子', action, {gain: gain});
                KFOL.showMsg(msg);
                if (KFOL.isInHomePage) {
                    $('a[href="kf_smbox.php"].indbox5').removeClass('indbox5').addClass('indbox6');
                }
            }, 'html');
        }, 'html');
    },

    /**
     * 添加神秘盒子链接点击事件
     */
    addSmboxLinkClickEvent: function () {
        $('.box1').on('click', 'a[href^="kf_smbox.php?box="]', function () {
            if (KFOL.getNextDrawSmboxTime().type) return;
            var nextTime = Tools.getDate('+' + Config.defDrawSmboxInterval + 'm').getTime() + 10 * 1000;
            Tools.setCookie(Config.drawSmboxCookieName, '2|' + nextTime, new Date(nextTime));
        });
    },

    /**
     * 获取倒计时的最小间隔时间（秒）
     * @returns {number} 倒计时的最小间隔时间（秒）
     */
    getMinRefreshInterval: function () {
        var donationInterval = -1;
        if (Config.autoDonationEnabled) {
            var donationTime = Tools.getDateByTime(Config.donationAfterTime);
            var now = new Date();
            if (!Tools.getCookie(Config.donationCookieName) && now <= donationTime) {
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
                getLootAwardInterval = Math.floor((lootTimeLog.time - (new Date()).getTime()) / 1000);
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
                && Tools.getCookie(Config.autoAttackReadyCookieName) && !Tools.getCookie(Config.autoAttackingCookieName)) {
                if (lootTimeLog.type > 0) {
                    var attackAfterTime = Config.attackAfterTime;
                    if (lootTimeLog.type === 1) {
                        var diff = attackAfterTime - Config.minAttackAfterTime - 30;
                        if (diff < 0) diff = 0;
                        else if (diff > 30) diff = 30;
                        attackAfterTime -= diff;
                    }
                    autoAttackInterval = Math.floor((lootTimeLog.time - attackAfterTime * 60 * 1000 - (new Date()).getTime()) / 1000);
                    if (autoAttackInterval < 0) autoAttackInterval = 0;
                }
                else autoAttackInterval = 0;
                if (Config.attackWhenZeroLifeEnabled && autoAttackInterval > 0) {
                    var time = parseInt(Tools.getCookie(Config.attackCheckCookieName));
                    var now = new Date();
                    if (!isNaN(time) && time > 0 && time >= now.getTime()) {
                        attackCheckInterval = Math.floor((time - now.getTime()) / 1000);
                    }
                    else attackCheckInterval = 0;
                }
            }
            if (Config.autoAttackEnabled && autoAttackInterval === -1 && Tools.getCookie(Config.autoAttackingCookieName))
                autoAttackInterval = 4 * 60 + 1;
        }

        var drawSmboxInterval = -1;
        if (Config.autoDrawSmbox2Enabled) {
            var smboxTimeLog = KFOL.getNextDrawSmboxTime();
            if (smboxTimeLog.type > 0) {
                drawSmboxInterval = Math.floor((smboxTimeLog.time - (new Date()).getTime()) / 1000);
                if (drawSmboxInterval < 0) drawSmboxInterval = 0;
            }
            else drawSmboxInterval = 0;
        }

        var autoChangeSMColorInterval = -1;
        if (Config.autoChangeSMColorEnabled) {
            var nextTime = parseInt(Tools.getCookie(Config.autoChangeSMColorCookieName));
            if (!isNaN(nextTime) && nextTime > 0) {
                autoChangeSMColorInterval = Math.floor((nextTime - (new Date()).getTime()) / 1000);
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
         * @param {number} interval 倒计时的间隔时间（秒）
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
                titleItvFunc = window.setInterval(showIntervalTitle, Config.showRefreshModeTipsInterval * 60 * 1000);
            }
        };
        var handleError = function () {
            var interval = 0, errorText = '';
            $.ajax({
                type: 'GET',
                url: 'index.php',
                success: function (html) {
                    if (!/<a href="kf_fw_ig_index.php"/i.test(html)) {
                        interval = 10;
                        errorText = '论坛维护或其它未知情况';
                    }
                },
                error: function () {
                    interval = Config.errorRefreshInterval;
                    errorText = '网络超时';
                },
                complete: function () {
                    if (interval > 0) {
                        console.log('获取剩余时间失败（原因：{0}），将在{1}分钟后重试...'.replace('{0}', errorText).replace('{1}', interval));
                        KFOL.removePopTips($('.pd_refresh_notice').parent());
                        KFOL.showMsg('<span class="pd_refresh_notice">获取剩余时间失败（原因：{0}），将在<em>{1}</em>分钟后重试...</span>'
                                .replace('{0}', errorText)
                                .replace('{1}', interval)
                            , -1);
                        window.setTimeout(handleError, interval * 60 * 1000);
                        showRefreshModeTips(interval * 60, true);
                    }
                    else {
                        if (errorNum > 3) {
                            errorNum = 0;
                            interval = 30;
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
        var checkRefreshInterval = function () {
            KFOL.removePopTips($('.pd_refresh_notice').parent());
            var isGetLootAwardStarted = false;
            var autoDonationAvailable = Config.autoDonationEnabled && !Tools.getCookie(Config.donationCookieName);
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
            if (Config.autoLootEnabled && Config.autoAttackEnabled && Tools.getCookie(Config.autoAttackReadyCookieName)
                && !Tools.getCookie(Config.autoAttackingCookieName)) {
                Loot.checkAutoAttack();
            }
            if (Config.autoChangeSMColorEnabled && !Tools.getCookie(Config.autoChangeSMColorCookieName)) KFOL.changeSMColor();

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
            else if (interval === 0) interval = Config.actionFinishRefreshInterval;
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
            $atTips.parent().prev('div').addBack().remove();
        };
        var handleBox = noHighlight;
        if (type === 'hide_box_1' || type === 'hide_box_2') handleBox = hideBox;
        if (type === 'no_highlight_1' || type === 'no_highlight_2' || type === 'hide_box_1' || type === 'at_change_to_cao') {
            if ($atTips.length > 0) {
                var cookieText = Tools.getCookie(Config.hideMarkReadAtTipsCookieName);
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
                        var cookieText = Tools.getCookie(Config.hideMarkReadAtTipsCookieName);
                        if (!cookieText) {
                            var curDate = (new Date()).getDate();
                            Tools.setCookie(Config.prevReadAtTipsCookieName, (curDate < 10 ? '0' + curDate : curDate) + '日00时00分');
                        }
                        else if (cookieText !== atTipsText) {
                            Tools.setCookie(Config.prevReadAtTipsCookieName, cookieText);
                        }
                        Tools.setCookie(Config.hideMarkReadAtTipsCookieName,
                            atTipsText,
                            Tools.getDate('+' + Config.hideMarkReadAtTipsExpires + 'd')
                        );
                        $this.data('disabled', true);
                        handleBox();
                    });
                }
                if (type === 'at_change_to_cao') {
                    $atTips.text($atTips.text().replace('@', '艹'));
                }
            }
            else if ($atTips.length === 0 && (type === 'no_highlight_1' || type === 'at_change_to_cao')) {
                var html = ('<div style="width:300px;"><a href="guanjianci.php?gjc={0}" target="_blank" class="indbox6">最近无人{1}你</a>' +
                '<br /><div class="line"></div><div class="c"></div></div><div class="line"></div>')
                    .replace('{0}', KFOL.userName)
                    .replace('{1}', type === 'at_change_to_cao' ? '艹' : '@');
                $('a[href="kf_vmember.php"]:contains("VIP会员")').parent().before(html);
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
        var timeString = Tools.getCookie(Config.prevReadAtTipsCookieName);
        if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
        $('.kf_share1:eq(1) > tbody > tr:gt(0) > td:first-child').each(function () {
            var $this = $(this);
            if (timeString < $.trim($this.text())) $this.addClass('pd_highlight');
            else return false;
        });
        $('.kf_share1').on('click', 'td > a', function () {
            Tools.setCookie(Config.prevReadAtTipsCookieName, '', Tools.getDate('-1d'));
        });
    },

    /**
     * 去除首页的VIP标识高亮
     */
    hideNoneVipTips: function () {
        $('a[href="kf_vmember.php"]:contains("VIP会员(参与论坛获得的额外权限)")').removeClass('indbox5').addClass('indbox6');
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
            .prependTo('.readlou:eq(0) > div:first-child > ul')
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
        Dialog.show('pd_replyer_list');
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
                var topFloor = $('.readtext:eq(0)').find('.readidmsbottom, .readidmleft').find('a').text();
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
    },

    /**
     * 添加统计回帖者名单的链接
     */
    addStatReplyersLink: function () {
        if (Tools.getCurrentThreadPage() !== 1) return;
        $('<li><a href="#" title="统计回帖者名单">[统计回帖]</a></li>').prependTo('.readlou:eq(1) > div > .pages')
            .find('a').click(function (e) {
                e.preventDefault();
                if ($('#pd_replyer_list').length > 0) return;
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
                if (endPage - startPage > 150) {
                    alert('需访问的总页数不可超过150');
                    return;
                }
                var tid = Tools.getUrlParam('tid');
                if (!tid) return;
                KFOL.showWaitMsg('<strong>正在统计回帖名单中...</strong><i>剩余页数：<em id="pd_remaining_num">{0}</em></i>'
                        .replace('{0}', endPage - startPage + 1)
                    , true);
                $(document).queue('StatReplyers', []);
                var replyerList = [];
                $.each(new Array(endPage), function (index) {
                    if (index + 1 < startPage) return;
                    $(document).queue('StatReplyers', function () {
                        var url = 'read.php?tid={0}&page={1}'.replace('{0}', tid).replace('{1}', index + 1);
                        $.get(url, function (html) {
                            var matches = html.match(/<span style=".+?">\d+楼<\/span> <span style=".+?">(.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+" target="_blank" style=".+?">.+?<\/a>/gi);
                            var isStop = false;
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
                            var $remainingNum = $('#pd_remaining_num');
                            $remainingNum.text(parseInt($remainingNum.text()) - 1);
                            if (isStop || index === endPage - 1) {
                                KFOL.removePopTips($('.pd_pop_tips'));
                                KFOL.showStatReplyersDialog(replyerList);
                            }
                            window.setTimeout(function () {
                                $(document).dequeue('StatReplyers');
                            }, Config.defAjaxInterval);
                        }, 'html');
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
                var data = localStorage[Config.multiQuoteStorageName];
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
                    localStorage.removeItem(Config.multiQuoteStorageName);
                    data = {tid: tid, quoteList: []};
                }
                var page = Tools.getCurrentThreadPage();
                if (quoteList.length > 0) data.quoteList[page] = quoteList;
                else delete data.quoteList[page];
                localStorage[Config.multiQuoteStorageName] = JSON.stringify(data);
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
        if ($('#pd_clear_multi_quote_data').length === 0) {
            $('<a id="pd_clear_multi_quote_data" style="margin-left:7px" title="清除在浏览器中保存的多重引用数据" href="#">清除引用数据</a>')
                .insertAfter('input[name="diy_guanjianci"]').click(function (e) {
                    e.preventDefault();
                    localStorage.removeItem(Config.multiQuoteStorageName);
                    $('input[name="diy_guanjianci"]').val('');
                    if (type === 2) $('#textarea').val('');
                    else $('textarea[name="atc_content"]').val('');
                    alert('多重引用数据已被清除');
                });
        }
        var data = localStorage[Config.multiQuoteStorageName];
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
            localStorage.removeItem(Config.multiQuoteStorageName);
            return;
        }
        var keyword = [];
        var content = '';
        if (type === 2) {
            KFOL.showWaitMsg('<strong>正在获取引用内容中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                    .replace('{0}', list.length)
                , true);
            $(document).queue('MultiQuote', []);
        }
        $.each(list, function (index, quote) {
            if (typeof quote.floor === 'undefined' || typeof quote.spid === 'undefined') return;
            if ($.inArray(quote.userName, keyword) === -1) keyword.push(quote.userName);
            if (type === 2) {
                $(document).queue('MultiQuote', function () {
                    var url = 'post.php?action=quote&fid={0}&tid={1}&pid={2}&article={3}'
                        .replace('{0}', fid)
                        .replace('{1}', tid)
                        .replace('{2}', quote.spid)
                        .replace('{3}', quote.floor);
                    $.get(url, function (html) {
                        var matches = /<textarea id="textarea".*?>((.|\n)+?)<\/textarea>/i.exec(html);
                        if (matches) content += Tools.htmlDecode(matches[1]).replace(/\n\n/g, '\n') + '\n';
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        if (index === list.length - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            $('#textarea').val(content).focus();
                        }
                        window.setTimeout(function () {
                            $(document).dequeue('MultiQuote');
                        }, 100);
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
            localStorage.removeItem(Config.multiQuoteStorageName);
        });
        if (type === 2) $(document).dequeue('MultiQuote');
        else $('textarea[name="atc_content"]').val(content).focus();
    },

    /**
     * 在短消息页面中添加快速取款的链接
     */
    addFastDrawMoneyLink: function () {
        if ($('td:contains("SYSTEM")').length === 0 || $('td:contains("收到了他人转账的KFB")').length === 0) return;
        var $msg = $('.thread2 > tbody > tr:eq(-2) > td:last');
        $msg.html($msg.html()
                .replace(/会员\[(.+?)\]通过论坛银行/, '会员[<a target="_blank" href="profile.php?action=show&username=$1">$1</a>]通过论坛银行')
                .replace(/给你转帐(\d+)KFB/i, '给你转帐<span class="pd_stat"><em>$1</em></span>KFB')
        );
        $('<br /><a title="从活期存款中取出当前转账的金额" href="#">快速取款</a> | <a title="取出银行账户中的所有活期存款" href="#">取出所有存款</a>')
            .appendTo($msg)
            .filter('a:eq(0)')
            .click(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
                var matches = /给你转帐(\d+)KFB/i.exec($msg.text());
                if (!matches) return;
                var money = parseInt(matches[1]);
                Bank.drawCurrentDeposit(money);
            })
            .end()
            .filter('a:eq(1)')
            .click(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
                KFOL.showWaitMsg('正在获取当前活期存款金额...', true);
                $.get('hack.php?H_name=bank', function (html) {
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
    },

    /**
     * 将帖子和短消息中的绯月其它域名的链接修改为当前域名
     */
    modifyKFOtherDomainLink: function () {
        $('.readtext a, .thread2 a').each(function () {
            var $this = $(this);
            var url = $this.attr('href');
            var regex = /^http:\/\/(.+?\.)?(2dgal|9gal|9baka|9moe)\.com\//i;
            if (regex.test(url)) {
                $this.attr('href', url.replace(regex, Tools.getHostNameUrl()));
            }
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
                if (sell < Config.minBuyThreadWarningSell || window.confirm('此贴售价{0}KFB，是否购买？'.replace('{0}', sell))) {
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
                            .replace('{1}', totalSell)
                            .replace('{2}', (totalSell / threadList.length).toFixed(2))
                    )
                ) {
                    KFOL.showWaitMsg('<strong>正在购买帖子中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                            .replace('{0}', threadList.length)
                        , true);
                    KFOL.buyThreads(threadList);
                }
            })
            .parent()
            .mouseenter(function () {
                $('<span style="margin-left:5px">[<a href="#">全选</a><a style="margin-left:5px" href="#">反选</a>]</span>').insertAfter($(this).find('.pd_buy_thread_btn'))
                    .find('a:first')
                    .click(function (e) {
                        e.preventDefault();
                        $('.pd_buy_thread').prop('checked', true);
                        alert('共选择了{0}项'.replace('{0}', $('.pd_buy_thread').length));
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
        $(document).queue('SellItems', []);
        $.each(threadList, function (index, thread) {
            $(document).queue('BuyThreads', function () {
                $.get(thread.url, function (html) {
                    KFOL.showFormatLog('购买帖子', html);
                    if (/操作完成/.test(html)) {
                        successNum++;
                        totalSell += thread.sell;
                    }
                    else failNum++;
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    if (index === threadList.length - 1) {
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
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('BuyThreads');
                    }, Config.defAjaxInterval);
                }, 'html');
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
                if (userName && Config.blockThreadList[i].userName) {
                    if ($.inArray(userName, Config.blockThreadList[i].userName) === -1) continue;
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
                '<li class="r_cmenuho"><a href="JavaScript:;">快捷导航</a>' +
                '  <ul class="r_cmenu2">' +
                '    <li><a href="guanjianci.php?gjc={0}">@提醒</a></li>'.replace('{0}', KFOL.userName) +
                '    <li><a href="kf_growup.php">神秘等级</a></li>' +
                '    <li><a href="kf_fw_ig_index.php">争夺奖励</a></li>' +
                '    <li><a href="kf_fw_ig_my.php">我的道具</a></li>' +
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
        var $kfb = $('a.indbox1[title="网站虚拟货币"]');
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
            $.get('profile.php?action=show&uid=' + KFOL.uid, function (html) {
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
        var matches = /神秘(\d+)级/.exec($('a.indbox1[href="kf_growup.php"]').text());
        if (!matches) return;
        var smLevel = parseInt(matches[1]);
        var data = TmpLog.getValue(Config.smLevelUpTmpLogName);
        var writeData = function () {
            TmpLog.setValue(Config.smLevelUpTmpLogName, {time: (new Date()).getTime(), smLevel: smLevel});
        };
        if (!data || $.type(data.time) !== 'number' || $.type(data.smLevel) !== 'number') {
            writeData();
        }
        else if (smLevel > data.smLevel) {
            var date = new Date(data.time);
            Log.push('神秘等级升级', '自`{0}`以来，你的神秘等级总共上升了`{1}`级'
                    .replace('{0}', Tools.getDateString(date))
                    .replace('{1}', smLevel - data.smLevel)
            );
            KFOL.showMsg('自<em>{0}</em>以来，你的神秘等级总共上升了<em>{1}</em>级'
                    .replace('{0}', Tools.getDateString(date))
                    .replace('{1}', smLevel - data.smLevel)
            );
            writeData();
        }
        else if (smLevel < data.smLevel) {
            writeData();
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
            $msg.text('争夺奖励(剩余{0}{1}分)'.replace('{0}', diff.hours < 1 ? '' : diff.hours + '小时').replace('{1}', diff.minutes));
        }
        else {
            diff.hours += 1;
            $msg.text('争夺奖励(剩余{0})'.replace('{0}', diff.hours < 1 ? '1小时以内' : diff.hours + '个多小时'));
        }
        if (!Tools.getCookie(Config.autoAttackReadyCookieName))
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
        $msg.text('神秘盒子(剩余{0}{1}分)'.replace('{0}', diff.hours < 1 ? '' : diff.hours + '小时').replace('{1}', diff.minutes))
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
     * @param {number} type 脚本类型，1：脚本开始后执行；2：脚本结束后执行
     */
    runCustomScript: function (type) {
        var script = '';
        if (type === 2) script = Config.customScriptEndContent;
        else script = Config.customScriptStartContent;
        if ($.trim(script)) {
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
                    '<label><input id="pd_cfg_change_all_available_sm_color_enabled" class="pd_input" type="checkbox" /> 选择当前所有可用的神秘颜色</label>')
                        .insertAfter($this.parent())
                        .filter('button:first').click(function (e) {
                            e.preventDefault();
                            var $autoChangeSMColorInterval = $('#pd_cfg_auto_change_sm_color_interval');
                            var interval = parseInt($.trim($autoChangeSMColorInterval.val()));
                            if (isNaN(interval) || interval <= 0) {
                                alert('神秘颜色更换间隔时间格式不正确');
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
                                Tools.setCookie(Config.autoChangeSMColorCookieName, 0, Tools.getDate('-1d'));
                            alert('设置保存成功');
                        })
                        .end()
                        .filter('button:eq(1)').click(function (e) {
                            e.preventDefault();
                            ConfigMethod.read();
                            var defConfig = ConfigMethod.defConfig;
                            Config.autoChangeSMColorEnabled = defConfig.autoChangeSMColorEnabled;
                            Config.autoChangeSMColorType = defConfig.autoChangeSMColorType;
                            Config.autoChangeSMColorInterval = defConfig.autoChangeSMColorInterval;
                            Config.changeAllAvailableSMColorEnabled = defConfig.changeAllAvailableSMColorEnabled;
                            Config.customAutoChangeSMColorList = defConfig.customAutoChangeSMColorList;
                            ConfigMethod.write();
                            Tools.setCookie(Config.autoChangeSMColorCookieName, 0, Tools.getDate('-1d'));
                            TmpLog.deleteValue(Config.prevAutoChangeSMColorIdTmpLogName);
                            alert('设置已重置');
                            location.reload();
                        })
                        .end()
                        .filter('a')
                        .click(function (e) {
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
            Tools.setCookie(Config.autoChangeSMColorCookieName, nextTime.getTime(), nextTime);
        };
        console.log('自动更换神秘颜色Start');
        $.get('kf_growup.php', function (html) {
            if (Tools.getCookie(Config.autoChangeSMColorCookieName)) return;
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

                var prevId = parseInt(TmpLog.getValue(Config.prevAutoChangeSMColorIdTmpLogName));
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

                $.get('kf_growup.php?ok=2&safeid={0}&color={1}'.replace('{0}', safeId).replace('{1}', nextId), function (html) {
                    setCookie();
                    KFOL.showFormatLog('自动更换神秘颜色', html);
                    if (/等级颜色修改完毕/.test(html)) {
                        console.log('神秘颜色ID更换为：' + nextId);
                        TmpLog.setValue(Config.prevAutoChangeSMColorIdTmpLogName, nextId);
                    }
                }, 'html');
            }
            else {
                setCookie();
            }
        }, 'html');
    },

    /**
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined') return;
        var startDate = new Date();
        //console.log('KF Online助手启动');
        if (location.pathname === '/' || location.pathname === '/index.php') KFOL.isInHomePage = true;
        if (!KFOL.getUidAndUserName()) return;
        ConfigMethod.init();
        KFOL.appendCss();
        KFOL.addConfigAndLogDialogLink();
        if (Config.animationEffectOffEnabled) jQuery.fx.off = true;

        if (Config.customScriptEnabled) KFOL.runCustomScript(1);
        if (Config.modifySideBarEnabled) KFOL.modifySideBar();
        if (Config.addSideBarFastNavEnabled) KFOL.addFastNavForSideBar();
        if (KFOL.isInHomePage) {
            KFOL.handleAtTips();
            if (Config.hideNoneVipEnabled) KFOL.hideNoneVipTips();
            KFOL.showLootAwardInterval();
            KFOL.showDrawSmboxInterval();
            if (Config.smLevelUpAlertEnabled) KFOL.smLevelUpAlert();
            if (Config.homePageThreadFastGotoLinkEnabled) KFOL.addHomePageThreadFastGotoLink();
            if (Config.fixedDepositDueAlertEnabled && !Tools.getCookie(Config.fixedDepositDueAlertCookieName))
                Bank.fixedDepositDueAlert();
        }
        else if (location.pathname === '/read.php') {
            KFOL.fastGotoFloor();
            if (Config.adjustThreadContentWidthEnabled) KFOL.adjustThreadContentWidth();
            KFOL.adjustThreadContentFontSize();
            if (Config.customSmColorEnabled) KFOL.modifySmColor();
            if (Config.customMySmColor) KFOL.modifyMySmColor();
            if (Config.multiQuoteEnabled) KFOL.addMultiQuoteButton();
            KFOL.addFastGotoFloorInput();
            KFOL.addFloorGotoLink();
            KFOL.addCopyBuyersListLink();
            KFOL.addStatReplyersLink();
            if (Config.modifyKFOtherDomainEnabled) KFOL.modifyKFOtherDomainLink();
            KFOL.addBuyThreadWarning();
            if (Config.batchBuyThreadEnabled) KFOL.addBatchBuyThreadButton();
            if (Config.userMemoEnabled) KFOL.addUserMemo();
            KFOL.addCopyCodeLink();
        }
        else if (location.pathname === '/thread.php') {
            if (Config.highlightNewPostEnabled) KFOL.highlightNewPost();
            if (Config.showFastGotoThreadPageEnabled) KFOL.addFastGotoThreadPageLink();
        }
        else if (/\/kf_fw_ig_my\.php$/i.test(location.href)) {
            Item.addUseAllItemsLink();
        }
        else if (/\/kf_fw_ig_renew\.php$/i.test(location.href)) {
            Item.addAllItemsConvertToEnergyAndRestoreLink();
        }
        else if (/\/kf_fw_ig_renew\.php\?lv=\d+$/i.test(location.href)) {
            Item.addConvertEnergyAndRestoreItemsButton();
        }
        else if (/\/kf_fw_ig_my\.php\?lv=\d+$/i.test(location.href)) {
            Item.addSellAndUseItemsButton();
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
        else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
            KFOL.addFastDrawMoneyLink();
            if (Config.modifyKFOtherDomainEnabled) KFOL.modifyKFOtherDomainLink();
        }
        else if (/\/profile\.php\?action=show/i.test(location.href)) {
            KFOL.addFollowAndBlockAndMemoUserLink();
        }
        else if (/\/personal\.php\?action=post/i.test(location.href)) {
            KFOL.modifyMyPostLink();
        }
        else if (location.pathname === '/kf_growup.php') {
            KFOL.addAutoChangeSmColorButton();
        }
        else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
            KFOL.addMsgSelectButton();
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
        }
        else if (location.pathname === '/kf_smbox.php') {
            KFOL.addSmboxLinkClickEvent();
        }
        else if (location.pathname === '/guanjianci.php') {
            KFOL.highlightUnReadAtTipsMsg();
        }
        if (Config.blockUserEnabled) KFOL.blockUsers();
        if (Config.blockThreadEnabled) KFOL.blockThread();
        if (Config.followUserEnabled) KFOL.followUsers();

        var isGetLootAwardStarted = false;
        var autoDonationAvailable = Config.autoDonationEnabled && !Tools.getCookie(Config.donationCookieName);
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

        if (Config.autoLootEnabled && Config.autoAttackEnabled && Tools.getCookie(Config.autoAttackReadyCookieName)
            && !Tools.getCookie(Config.autoAttackingCookieName)) {
            Loot.checkAutoAttack();
        }

        if (Config.autoChangeSMColorEnabled && !Tools.getCookie(Config.autoChangeSMColorCookieName)) KFOL.changeSMColor();

        if (Config.autoRefreshEnabled && KFOL.isInHomePage) KFOL.startAutoRefreshMode();

        if (Config.customScriptEnabled) KFOL.runCustomScript(2);

        var endDate = new Date();
        console.log('KF Online助手加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

KFOL.init();
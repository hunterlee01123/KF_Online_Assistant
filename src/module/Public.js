/* 公共模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import * as Dialog from './Dialog';
import * as Func from './Func';
import Const from './Const';
import {show as showConfigDialog} from './ConfigDialog';
import * as Log from './Log';
import {show as showLogDialog} from './LogDialog';
import * as TmpLog from './TmpLog';

/**
 * 获取Uid和用户名
 * @returns {boolean} 是否获取成功
 */
export const getUidAndUserName = function () {
    let $user = $('.topright a[href^="profile.php?action=show&uid="]').eq(0);
    if (!$user.length) return false;
    Info.userName = $user.text();
    if (!Info.userName) return false;
    let matches = /&uid=(\d+)/.exec($user.attr('href'));
    if (!matches) return false;
    Info.uid = parseInt(matches[1]);
    return true;
};

/**
 * 获取用户的SafeID
 * @returns {string} 用户的SafeID
 */
export const getSafeId = function () {
    let safeId = $('input#safeid').val();
    if (!safeId) {
        let matches = /safeid=(\w+)/i.exec($('a[href*="safeid="]:first').attr('href'));
        if (matches) safeId = matches[1];
    }
    return safeId ? safeId : '';
};

/**
 * 检查浏览器类型
 */
export const checkBrowserType = function () {
    if (Config.browseType === 'auto') {
        Info.isMobile = /(Mobile|MIDP)/i.test(navigator.userAgent);
    }
    else {
        Info.isMobile = Config.browseType === 'mobile';
    }
};

/**
 * 添加CSS样式
 */
export const appendCss = function () {
    $('head').append(`
<style>
  /* 通用 */
  .pd_mask { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1000; }
  .pd_msg_container { position: ${Info.isMobile ? 'absolute' : 'fixed'}; width: 100%; z-index: 1001; }
  .pd_msg {
    border: 1px solid #6ca7c0; text-shadow: 0 0 3px rgba(0, 0, 0, 0.1); border-radius: 3px; padding: 12px 40px; text-align: center;
    font-size: 14px; position: absolute; display: none; color: #333; background: #f8fcfe; background-repeat: no-repeat;
    background-image: -webkit-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);
    background-image: -moz-linear-gradient(top, #f9fcfe, #f6fbfe 25%, #eff7fc);
    background-image: -o-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);
    background-image: -ms-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);
    background-image: linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);
  }
  .pd_msg strong { margin-right: 5px; }
  .pd_msg i { font-style: normal; padding-left: 10px; }
  .pd_msg em, .pd_stat em, .pd_msg ins, .pd_stat ins { font-weight: 700; font-style: normal; color:#ff6600; padding: 0 3px; }
  .pd_msg ins, .pd_stat ins { text-decoration: none; color: #339933; }
  .pd_msg a { font-weight: bold; margin-left: 15px; }
  .pd_stat i { display: inline-block; font-style: normal; margin-right: 3px; }
  .pd_stat_extra em, .pd_stat_extra ins { padding: 0 2px; cursor: help; }
  .pd_highlight { color: #ff0000 !important; }
  .pd_notice, .pd_msg .pd_notice { font-style: italic; color: #666; }
  .pd_input, .pd_cfg_main input, .pd_cfg_main select { vertical-align: middle; height: auto; margin-right: 0; line-height: 22px; font-size: 12px; }
  .pd_input[type="text"], .pd_cfg_main input[type="text"] { height: 18px; line-height: 18px; }
  .pd_input:focus, .pd_cfg_main input[type="text"]:focus, .pd_cfg_main textarea:focus, .pd_textarea:focus { border-color: #7eb4ea; }
  .pd_textarea, .pd_cfg_main textarea { border: 1px solid #ccc; font-size: 12px; }
  .readlou .pd_goto_link { color: #000; }
  .readlou .pd_goto_link:hover { color: #51d; }
  .pd_fast_goto_floor, .pd_multi_quote_chk { margin-right: 2px; }
  .pages .pd_fast_goto_page { margin-left: 8px; }
  .pd_fast_goto_floor span:hover, .pd_fast_goto_page span:hover { color: #51d; cursor: pointer; text-decoration: underline; }
  .pd_item_btns { text-align: right; margin-top: 5px;  }
  .pd_item_btns button, .pd_item_btns input { margin-bottom: 2px; vertical-align: middle; }
  .pd_result { border: 1px solid #99f; padding: 5px; margin-top: 10px; line-height: 2em; }
  .pd_result_sep { border-bottom: 1px solid #999; margin: 7px 0; }
  .pd_result_sep_inner { border-bottom: 1px dashed #999; margin: 5px 0; }
  .pd_thread_page { margin-left: 5px; }
  .pd_thread_page a { color: #444; padding: 0 3px; }
  .pd_thread_page a:hover { color: #51d; }
  .pd_card_chk { position: absolute; bottom: -8px; left: 1px; }
  .pd_disabled_link { color: #999 !important; text-decoration: none !important; cursor: default; }
  .b_tit4 .pd_thread_goto, .b_tit4_1 .pd_thread_goto { position: absolute; top: 0; right: 0; padding: 0 15px; }
  .b_tit4 .pd_thread_goto:hover, .b_tit4_1 .pd_thread_goto:hover { padding-left: 15px; }
  .pd_custom_tips { cursor: help; }
  .pd_user_memo { font-size: 12px; color: #999; line-height: 14px; }
  .pd_user_memo_tips { font-size: 12px; color: #fff; margin-left: 3px; cursor: help; }
  .pd_user_memo_tips:hover { color: #ddd; }
  .pd_id_color_select > td { position: relative; cursor: pointer; }
  .pd_id_color_select > td > input { position: absolute; top: 18px; left: 10px; }
  .pd_used_item_info { color: #666; float: right; cursor: help; margin-right: 5px; }
  .pd_panel { position: absolute; overflow-y: auto; background-color: #fff; border: 1px solid #9191ff; opacity: 0.9; }
  #pd_smile_panel img { margin: 3px; cursor: pointer; }
  .pd_verify_tips { cursor: help; color: #999; }
  .pd_verify_tips_ok { color: #99cc66; }
  .pd_verify_tips_conditional { color: #ff9900; }
  .pd_verify_tips_unable { color: #ff0033; }
  .pd_verify_tips_details { cursor: pointer; }
  .pd_my_items > tbody > tr > td > a + a { margin-left: 15px; }
  .pd_usable_num { color: #669933; }
  .pd_used_num { color: #ff0033; }
  .pd_title_tips {
    position: absolute; max-width: 470px; font-size: 12px; line-height: 1.5em;
    padding: 2px 5px; background-color: #fcfcfc; border: 1px solid #767676; z-index: 9999;
  }
  .pd_search_type {
    float: left; height: 26px; line-height: 26px; width: 65px; text-align: center; border: 1px solid #ccc; border-left: none; cursor: pointer;
  }
  .pd_search_type i { font-style: normal; margin-left: 5px; font-family: "Microsoft YaHei"; }
  .pd_search_type_list {
    position: absolute; width: 63px; background-color: #fcfcfc; border: 1px solid #ccc; border-top: none; line-height: 26px;
    text-indent: 13px; cursor: pointer; z-index: 1003;
  }
  .pd_search_type_list li:hover { color: #fff; background-color: #87c3cf; }
  .editor-button .pd_editor_btn { background: none; text-indent: 0; line-height: 18px; cursor: default; }
  .readtext img[onclick] { max-width: 550px; }
  .pd_post_extra_option { text-align: left; margin-top: 5px; margin-left: 5px; }
  .pd_post_extra_option input { vertical-align: middle; height: auto; margin-right: 0; }
  .read_fds { text-align: left !important; font-weight: normal !important; font-style: normal !important; }
  .pd_item_type_chk { margin-right: 5px; }
  .pd_btn_link { margin-left: 4px; margin-right: 4px; }
  hr {
    box-sizing: content-box; height: 0; margin-top: 7px; margin-bottom: 7px; border: 0;
    border-top: 1px solid rgba(0, 0, 0, .2); overflow: visible;
  }

  /* 设置对话框 */
  .pd_cfg_box {
    position: ${Info.isMobile ? 'absolute' : 'fixed'}; border: 1px solid #9191ff; display: none; z-index: 1002;
    -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
    -o-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  }
  .pd_cfg_box h1 {
    text-align: center; font-size: 14px; background-color: #9191ff; color: #fff; line-height: 2em; margin: 0; padding-left: 20px;
  }
  .pd_cfg_box h1 span { float: right; cursor: pointer; padding: 0 10px; }
  .pd_cfg_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }
  .pd_cfg_main { background-color: #fcfcfc; padding: 0 10px; font-size: 12px; line-height: 22px; min-height: 50px; overflow: auto; }
  .pd_cfg_main fieldset { border: 1px solid #ccccff; padding: 0 6px 6px; }
  .pd_cfg_main legend { font-weight: bold; }
  .pd_cfg_main input[type="color"] { height: 18px; width: 30px; padding: 0; }
  .pd_cfg_main button { vertical-align: middle; }
  .pd_cfg_main .pd_cfg_tips { color: #51d; text-decoration: none; cursor: help; }
  .pd_cfg_main .pd_cfg_tips:hover { color: #ff0000; }
  #pd_config .pd_cfg_main { overflow-x: hidden; white-space: nowrap; }
  .pd_cfg_panel { display: inline-block; width: 380px; vertical-align: top; }
  .pd_cfg_panel + .pd_cfg_panel { margin-left: 5px; }
  .pd_cfg_btns { background-color: #fcfcfc; text-align: right; padding: 5px; }
  .pd_cfg_btns button { min-width: 80px; }
  .pd_cfg_about { float: left; line-height: 24px; margin-left: 5px; }
  #pd_cfg_follow_user_list, #pd_cfg_block_user_list { max-height: 480px; overflow: auto; }
  .pd_cfg_ml { margin-left: 10px; }

  /* 日志对话框 */
  #pd_log { width: 880px; }
  .pd_log_nav { text-align: center; margin: -5px 0 -12px; font-size: 14px; line-height: 44px; }
  .pd_log_nav a { display: inline-block; }
  .pd_log_nav h2 { display: inline; font-size: 14px; margin-left: 7px; margin-right: 7px; }
  .pd_log_content { height: 308px; overflow: auto; }
  .pd_log_content h3 { display: inline-block; font-size: 12px; line-height: 22px; margin: 0; }
  .pd_log_content h3:not(:first-child) { margin-top: 5px; }
  .pd_log_content p { line-height: 22px; margin: 0; }
</style>
`);

    if (Config.customCssEnabled) {
        $('head').append(`<style>${Config.customCssContent}</style>`);
    }
};

/**
 * 在操作进行时阻止关闭页面
 * @param e
 * @returns {string} 提示消息
 */
export const preventCloseWindowWhenActioning = function (e) {
    if ($('.pd_mask').length > 0) {
        let msg = '操作正在进行中，确定要关闭页面吗？';
        e.returnValue = msg;
        return msg;
    }
};

/**
 * 输出经过格式化后的控制台消息
 * @param {string} msgType 消息类别
 * @param {string} html 回应的HTML源码
 */
export const showFormatLog = function (msgType, html) {
    let {msg, url} = Util.getResponseMsg(html);
    console.log(`【${msgType}】回应：${msg}${url ? `；跳转地址：${Util.getHostNameUrl()}${url}` : ''}`);
};

/**
 * 添加兼容方法
 */
export const addPolyfill = function () {
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (searchElement /*, fromIndex = 0 */) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.includes called on null or undefined');
            }
            const O = Object(this);
            const len = parseInt(O.length) || 0;
            if (len === 0) return false;
            let n = parseInt(arguments[1]) || 0;
            let k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {
                    k = 0;
                }
            }
            let currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)
                ) {
                    return true;
                }
                k++;
            }
            return false;
        };
    }
    if (!String.prototype.padStart) {
        String.prototype.padStart = function padStart(maxLength, fillString = ' ') {
            const O = Object(this);
            const S = String(O);
            const intMaxLength = parseInt(maxLength) || 0;
            const stringLength = parseInt(S.length) || 0;
            if (intMaxLength <= stringLength) return S;
            let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
            if (filler === '') return S;
            const fillLen = intMaxLength - stringLength;
            while (filler.length < fillLen) {
                const fLen = filler.length;
                const remainingCodeUnits = fillLen - fLen;
                if (fLen > remainingCodeUnits) {
                    filler += filler.slice(0, remainingCodeUnits);
                } else {
                    filler += filler;
                }
            }
            const truncatedStringFiller = filler.slice(0, fillLen);
            return truncatedStringFiller + S;
        };
    }
    if (!String.prototype.padEnd) {
        String.prototype.padEnd = function padEnd(maxLength, fillString = ' ') {
            const O = Object(this);
            const S = String(O);
            const intMaxLength = parseInt(maxLength) || 0;
            const stringLength = parseInt(S.length) || 0;
            if (intMaxLength <= stringLength) return S;
            let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
            if (filler === '') return S;
            const fillLen = intMaxLength - stringLength;
            while (filler.length < fillLen) {
                const fLen = filler.length;
                const remainingCodeUnits = fillLen - fLen;
                if (fLen > remainingCodeUnits) {
                    filler += filler.slice(0, remainingCodeUnits);
                } else {
                    filler += filler;
                }
            }
            const truncatedStringFiller = filler.slice(0, fillLen);
            return S + truncatedStringFiller;
        };
    }
};

/**
 * KFB捐款
 * @param {boolean} isAutoSaveCurrentDeposit 是否在捐款完毕之后自动活期存款
 */
export const donation = function (isAutoSaveCurrentDeposit = false) {
    let now = new Date();
    let date = Util.getDateByTime(Config.donationAfterTime);
    if (now < date) {
        if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit();
        return;
    }
    Func.run('Public.donation_before_');
    console.log('KFB捐款Start');
    let $wait = Msg.wait('<strong>正在进行捐款，请稍候&hellip;</strong>');

    /**
     * 获取捐款Cookies有效期
     * @returns {Date} Cookies有效期的Date对象
     */
    const getDonationCookieDate = function () {
        let now = new Date();
        let date = Util.getTimezoneDateByTime('02:00:00');
        if (now > date) {
            date = Util.getTimezoneDateByTime('00:00:00');
            date.setDate(date.getDate() + 1);
        }
        if (now > date) date.setDate(date.getDate() + 1);
        return date;
    };

    /**
     * 使用指定的KFB捐款
     * @param {number} kfb 指定的KFB
     */
    const donationSubmit = function (kfb) {
        $.post('kf_growup.php?ok=1', {kfb: kfb}, function (html) {
            Util.setCookie(Const.donationCookieName, 1, getDonationCookieDate());
            showFormatLog(`捐款${kfb}KFB`, html);
            let {msg} = Util.getResponseMsg(html);
            Msg.remove($wait);

            let msgHtml = `<strong>捐款<em>${kfb}</em>KFB</strong>`;
            let matches = /捐款获得(\d+)经验值(?:.*?补偿期(?:.*?\+(\d+)KFB)?(?:.*?(\d+)成长经验)?)?/i.exec(msg);
            if (!matches) {
                if (/KFB不足。/.test(msg)) {
                    msgHtml += '<i class="pd_notice">KFB不足</i><a target="_blank" href="kf_growup.php">手动捐款</a>';
                }
                else return;
            }
            else {
                msgHtml += `<i>经验值<em>+${matches[1]}</em></i>`;
                let gain = {'经验值': parseInt(matches[1])};
                if (typeof matches[2] !== 'undefined' || typeof matches[3] !== 'undefined') {
                    msgHtml += '<i style="margin-left: 5px;">(补偿期:</i>' +
                        (typeof matches[2] !== 'undefined' ? `<i>KFB<em>+${matches[2]}</em>${typeof matches[3] !== 'undefined' ? '' : ')'}</i>` : '') +
                        (typeof matches[3] !== 'undefined' ? `<i>经验值<em>+${matches[3]}</em>)</i>` : '');
                    if (typeof matches[2] !== 'undefined') gain['KFB'] = parseInt(matches[2]);
                    if (typeof matches[3] !== 'undefined') gain['经验值'] += parseInt(matches[3]);
                }
                Log.push('捐款', `捐款\`${kfb}\`KFB`, {gain: gain, pay: {'KFB': -kfb}});
            }
            Msg.show(msgHtml);
            if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit(true);
            Func.run('Public.donation_after_', msg);
        });
    };

    if (/%$/.test(Config.donationKfb)) {
        $.get(`profile.php?action=show&uid=${Info.uid}&t=${new Date().getTime()}`, function (html) {
            let matches = /论坛货币：(-?\d+)\s*KFB/i.exec(html);
            let income = 1;
            if (matches) income = parseInt(matches[1]);
            else console.log('当前持有KFB获取失败');
            let donationKfb = parseInt(Config.donationKfb);
            donationKfb = Math.floor(income * donationKfb / 100);
            donationKfb = donationKfb > 0 ? donationKfb : 1;
            donationKfb = donationKfb <= Const.maxDonationKfb ? donationKfb : Const.maxDonationKfb;
            donationSubmit(donationKfb);
        });
    }
    else {
        $.get(`kf_growup.php?t=${new Date().getTime()}`, function (html) {
            if (/>今天已经捐款</.test(html)) {
                Msg.remove($wait);
                Util.setCookie(Const.donationCookieName, 1, getDonationCookieDate());
                if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit();
            }
            else {
                donationSubmit(parseInt(Config.donationKfb));
            }
        });
    }
};

/**
 * 获取倒计时的最小时间间隔（秒）
 * @returns {number} 倒计时的最小时间间隔（秒）
 */
export const getMinRefreshInterval = function () {
    let donationInterval = -1;
    if (Config.autoDonationEnabled) {
        let donationTime = Util.getDateByTime(Config.donationAfterTime);
        let now = new Date();
        if (!Util.getCookie(Const.donationCookieName) && now <= donationTime) {
            donationInterval = Math.floor((donationTime - now) / 1000);
        }
        else {
            donationTime.setDate(donationTime.getDate() + 1);
            donationInterval = Math.floor((donationTime - now) / 1000);
        }
    }

    let autoChangeIdColorInterval = -1;
    if (Config.autoChangeIdColorEnabled) {
        let nextTime = parseInt(Util.getCookie(Const.autoChangeIdColorCookieName));
        if (!isNaN(nextTime) && nextTime > 0) {
            autoChangeIdColorInterval = Math.floor((nextTime - new Date().getTime()) / 1000);
            if (autoChangeIdColorInterval < 0) autoChangeIdColorInterval = 0;
            if (!Config.changeAllAvailableIdColorEnabled && Config.customAutoChangeIdColorList.length <= 1)
                autoChangeIdColorInterval = -1;
        }
        else autoChangeIdColorInterval = 0;
    }

    let minArr = [donationInterval, autoChangeIdColorInterval].filter(interval => interval >= 0);
    if (minArr.length > 0) {
        let min = Math.min(...minArr);
        return min > 0 ? min + 1 : 0;
    }
    else return -1;
};

/**
 * 启动定时模式
 */
export const startAutoRefreshMode = function () {
    let interval = getMinRefreshInterval();
    if (interval === -1) return;
    let oriTitle = document.title;
    let titleItvFunc = null;
    let prevInterval = -1, errorNum = 0;

    /**
     * 获取经过格式化的倒计时标题
     * @param {number} type 倒计时显示类型，1：[小时:][分钟:]秒钟；2：[小时:]分钟
     * @param {number} interval 倒计时
     * @returns {string} 经过格式化的倒计时标题
     */
    const getFormatIntervalTitle = function (type, interval) {
        let textInterval = '';
        let diff = Util.getTimeDiffInfo(Util.getDate('+' + interval + 's').getTime());
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
     * @param {boolean} isShowTitle 是否立即显示标题
     */
    const showRefreshModeTips = function (interval, isShowTitle = false) {
        if (titleItvFunc) window.clearInterval(titleItvFunc);
        let showInterval = interval;
        console.log('【定时模式】倒计时：' + getFormatIntervalTitle(1, showInterval));
        if (Config.showRefreshModeTipsType.toLowerCase() !== 'never') {
            const showIntervalTitle = function () {
                document.title = `${oriTitle} (定时: ${getFormatIntervalTitle(interval < 60 ? 1 : 2, showInterval)})`;
                showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            };
            if (isShowTitle || Config.showRefreshModeTipsType.toLowerCase() === 'always' || interval < 60) showIntervalTitle();
            else showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            titleItvFunc = setInterval(showIntervalTitle, Const.showRefreshModeTipsInterval * 60 * 1000);
        }
    };

    /**
     * 处理错误
     */
    const handleError = function () {
        let interval = 0, errorText = '';
        $.ajax({
            type: 'GET',
            url: 'index.php?t=' + new Date().getTime(),
            timeout: Const.defAjaxTimeout,
            success (html) {
                if (!/"kf_fw_ig_index.php"/.test(html)) {
                    interval = 10;
                    errorText = '论坛维护或其它未知情况';
                }
            },
            error () {
                interval = Const.errorRefreshInterval;
                errorText = '连接超时';
            },
            complete () {
                if (interval > 0) {
                    console.log(`定时操作失败（原因：${errorText}），将在${interval}分钟后重试...`);
                    Msg.remove($('.pd_refresh_notice').parent());
                    Msg.show(`<strong class="pd_refresh_notice">定时操作失败（原因：${errorText}），将在<em>${interval}</em>分钟后重试&hellip;</strong>`, -1);
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
            }
        });
    };

    /**
     * 检查刷新间隔
     */
    const checkRefreshInterval = function () {
        Msg.remove($('.pd_refresh_notice').parent());
        if (Config.autoDonationEnabled && !Util.getCookie(Const.donationCookieName)) donation();
        if (Config.autoChangeIdColorEnabled && !Util.getCookie(Const.autoChangeIdColorCookieName)) changeIdColor();

        let interval = getMinRefreshInterval();
        if (interval > 0) errorNum = 0;
        if (interval === 0 && prevInterval === 0) {
            prevInterval = -1;
            handleError();
            return;
        }
        else prevInterval = interval;
        if (interval === -1) {
            if (titleItvFunc) clearInterval(titleItvFunc);
            return;
        }
        else if (interval === 0) interval = Const.actionFinishRetryInterval;
        setTimeout(checkRefreshInterval, interval * 1000);
        showRefreshModeTips(interval, true);
    };

    setTimeout(checkRefreshInterval, interval < 60 ? 60 * 1000 : interval * 1000);
    showRefreshModeTips(interval < 60 ? 60 : interval);
};

/**
 * 添加设置和日志对话框的链接
 */
export const addConfigAndLogDialogLink = function () {
    let $login = $('a[href^="login.php?action=quit"]:first');
    $('<a href="#">助手设置</a><span> | </span>').insertBefore($login)
        .filter('a').click(function (e) {
        e.preventDefault();
        showConfigDialog();
    });
    if (Config.showLogLinkEnabled) {
        $('<a href="#">助手日志</a><span> | </span>').insertBefore($login)
            .filter('a').click(function (e) {
            e.preventDefault();
            showLogDialog();
        });
    }
};

/**
 * 关注用户
 */
export const followUsers = function () {
    if (!Config.followUserList.length) return;
    if (Info.isInHomePage && Config.highlightFollowUserThreadInHPEnabled) {
        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            let $this = $(this);
            let matches = /》by：(.+)/.exec($this.attr('title'));
            if (!matches) return;
            if (Util.inFollowOrBlockUserList(matches[1], Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    }
    else if (location.pathname === '/thread.php') {
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
                if (Config.highlightFollowUserThreadLinkEnabled)
                    $this.parent('td').prev('td').prev('td').find('div > a[href^="read.php?tid="]').addClass('pd_highlight');
            }
        });
    }
    else if (location.pathname === '/read.php') {
        $('.readidmsbottom > a, .readidmleft > a').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child')
                    .find('a').addBack().addClass('pd_highlight');
            }
        });
    }
    else if (location.pathname === '/guanjianci.php' || location.pathname === '/kf_share.php') {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    }
    else if (location.pathname === '/search.php') {
        $('.thread1 a[href^="profile.php?action=show&uid="]').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    }
};

/**
 * 屏蔽用户
 */
export const blockUsers = function () {
    if (Config.blockUserList.length === 0) return;
    let blockNum = 0;
    if (Info.isInHomePage) {
        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            let $this = $(this);
            let matches = /》by：(.+)/.exec($this.attr('title'));
            if (!matches) return;
            let index = Util.inFollowOrBlockUserList(matches[1], Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                blockNum++;
                $this.parent('li').remove();
            }
        });
    }
    else if (location.pathname === '/thread.php') {
        let fid = parseInt($('input[name="f_fid"]:first').val());
        if (!fid) return;
        if (Config.blockUserForumType === 1 && $.inArray(fid, Config.blockUserFidList) === -1) return;
        else if (Config.blockUserForumType === 2 && $.inArray(fid, Config.blockUserFidList) > -1) return;
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                blockNum++;
                $this.closest('tr').remove();
            }
        });
    }
    else if (location.pathname === '/read.php') {
        if (Config.blockUserForumType > 0) {
            let fid = parseInt($('input[name="fid"]:first').val());
            if (!fid) return;
            if (Config.blockUserForumType === 1 && $.inArray(fid, Config.blockUserFidList) === -1) return;
            else if (Config.blockUserForumType === 2 && $.inArray(fid, Config.blockUserFidList) > -1) return;
        }
        let page = Util.getCurrentThreadPage();
        $('.readidmsbottom > a, .readidmleft > a').each(function (i) {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1) {
                let type = Config.blockUserList[index].type;
                if (i === 0 && page === 1 && type > 1) return;
                else if ((i === 0 && page !== 1 || i > 0) && type === 1) return;
                blockNum++;
                let $lou = $this.closest('.readtext');
                $lou.prev('.readlou').remove().end().next('.readlou').remove().end().remove();
            }
        });
        $('.readtext fieldset:has(legend:contains("Quote:"))').each(function () {
            let $this = $(this);
            let text = $this.text();
            for (let data of Config.blockUserList) {
                if (data.type === 1) continue;
                try {
                    let regex1 = new RegExp(`^Quote:引用(第\\d+楼|楼主)${data.name}于`, 'i');
                    let regex2 = new RegExp(`^Quote:回\\s*\\d+楼\\(${data.name}\\)\\s*的帖子`, 'i');
                    if (regex1.test(text) || regex2.test(text)) {
                        $this.html(`<legend>Quote:</legend><mark class="pd_custom_tips" title="被屏蔽用户：${data.name}">该用户已被屏蔽</mark>`);
                    }
                }
                catch (ex) {
                }
            }
        });
    }
    else if (location.pathname === '/guanjianci.php' && Config.blockUserAtTipsEnabled) {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.blockUserList) > -1) {
                blockNum++;
                $this.closest('tr').remove();
            }
        });
    }
    if (blockNum > 0) console.log('【屏蔽用户】共有{0}个项目被屏蔽'.replace('{0}', blockNum));
};

/**
 * 屏蔽帖子
 */
export const blockThread = function () {
    if (!Config.blockThreadList.length) return;
    /**
     * 是否屏蔽帖子
     * @param {string} title 帖子标题
     * @param {string} userName 用户名
     * @param {number} fid 版块ID
     * @returns {boolean} 是否屏蔽
     */
    const isBlock = function (title, userName, fid = 0) {
        for (let data of Config.blockThreadList) {
            let keyWord = data.keyWord;
            let re = null;
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
                if (data.includeUser) {
                    if (!data.includeUser.includes(userName)) continue;
                }
                else if (data.excludeUser) {
                    if (!data.excludeUser.includes(userName)) continue;
                }
            }
            if (fid) {
                if (data.includeFid) {
                    if (!data.includeFid.includes(fid)) continue;
                }
                else if (data.excludeFid) {
                    if (data.excludeFid.includes(fid)) continue;
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

    let num = 0;
    if (Info.isInHomePage) {
        $('.b_tit4 a, .b_tit4_1 a').each(function () {
            let $this = $(this);
            let matches = /》by：(.+)/.exec($this.attr('title'));
            let userName = '';
            if (matches) userName = matches[1];
            if (isBlock($this.text(), userName)) {
                num++;
                $this.parent('li').remove();
            }
        });
    }
    else if (location.pathname === '/thread.php') {
        let fid = parseInt($('input[name="f_fid"]:first').val());
        if (!fid) return;
        $('.threadtit1 a[href^="read.php"]').each(function () {
            let $this = $(this);
            if (isBlock($this.text(), $this.closest('tr').find('td:last-child > a.bl').text(), fid)) {
                num++;
                $this.closest('tr').remove();
            }
        });
    }
    else if (location.pathname === '/read.php') {
        if (Util.getCurrentThreadPage() !== 1) return;
        let $threadInfo = $('form[name="delatc"] > div:first > table > tbody');
        let title = $threadInfo.find('tr:first-child > td > span').text();
        if (!title) return;
        let $userName = $('.readidmsbottom > a, .readidmleft > a').eq(0);
        if ($userName.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child').text() !== '楼主') return;
        let userName = $userName.text();
        if (!userName) return;
        let fid = parseInt($('input[name="fid"]:first').val());
        if (!fid) return;
        if (isBlock(title, userName, fid)) {
            num++;
            let $lou = $userName.closest('.readtext');
            $lou.prev('.readlou').remove().end().next('.readlou').remove().end().remove();
        }
    }
    if (num > 0) console.log('【屏蔽帖子】共有{0}个帖子被屏蔽'.replace('{0}', num));
};

/**
 * 将侧边栏修改为和手机相同的平铺样式
 */
export const modifySideBar = function () {
    $('#r_menu').replaceWith(`
<div id="r_menu" style="width: 140px; color: #9999ff; font-size: 14px; line-height: 24px; text-align: center; border: 1px #ddddff solid; padding: 5px; overflow: hidden;">
  <span style="color: #ff9999;">游戏</span><br>
  <a href="thread.php?fid=102">游戏推荐</a> | <a href="thread.php?fid=106">新作动态</a><br>
  <a href="thread.php?fid=52">游戏讨论</a> | <a href="thread.php?fid=24">疑难互助</a><br>
  <a href="thread.php?fid=16">种子下载</a> | <a href="thread.php?fid=41">网盘下载</a><br>
  <a href="thread.php?fid=67">图片共享</a> | <a href="thread.php?fid=57">同人漫本</a><br>
  <span style="color: #ff9999;">动漫音乐</span><br>
  <a href="thread.php?fid=84">动漫讨论</a> | <a href="thread.php?fid=92">动画共享</a><br>
  <a href="thread.php?fid=127">漫画小说</a> | <a href="thread.php?fid=68">音乐共享</a><br>
  <a href="thread.php?fid=163">LIVE共享</a>  | <a href="thread.php?fid=182">转载资源</a><br>
  <span style="color: #ff9999;">综合</span><br>
  <a href="thread.php?fid=94">原创美图</a> | <a href="thread.php?fid=87">宅物交流</a><br>
  <a href="thread.php?fid=86">电子产品</a> | <a href="thread.php?fid=115">文字作品</a><br>
  <a href="thread.php?fid=96">出处讨论</a>  | <a href="thread.php?fid=36">寻求资源</a><br>
  <span style="color: #ff9999;">交流</span><br>
  <a href="thread.php?fid=5">自由讨论</a> | <a href="thread.php?fid=56">个人日记</a><br>
  <a href="thread.php?fid=98">日本语版</a>  | <a href="thread.php?fid=9">我的关注</a><br>
  <a href="thread.php?fid=4">站务管理</a><br>
  <span style="color: #ff9999;">专用</span><br>
  <a href="thread.php?fid=93">管理组区</a> | <a href="thread.php?fid=59">原创组区</a><br>
  <a href="/">论坛首页</a><br>
</div>
`);
};

/**
 * 为侧边栏添加快捷导航的链接
 */
export const addFastNavForSideBar = function () {
    let $menu = $('#r_menu');
    if (!$menu.hasClass('r_cmenu')) {
        if (!Config.modifySideBarEnabled) {
            $menu.append('<a href="/">论坛首页</a><br>');
        }
        $menu.find('> a:last').before(`
<span style="color: #ff9999;">快捷导航</span><br>
<a href="guanjianci.php?gjc=${Info.userName}">@提醒</a> | <a href="personal.php?action=post">回复</a> | <a href="kf_growup.php">等级</a><br>
<a href="kf_fw_ig_index.php">争夺</a> | <a href="kf_fw_ig_my.php">道具</a> | <a href="kf_fw_ig_shop.php">商店</a><br>
<a href="profile.php?action=modify">设置</a> | <a href="hack.php?H_name=bank">银行</a> | <a href="profile.php?action=favor">收藏</a><br>
${Const.customTileSideBarContent}
`);
    }
    else {
        $menu.find('> ul > li:last-child').before(`
<li class="r_cmenuho">
  <a href="javascript:;">快捷导航</a>
  <ul class="r_cmenu2">
    <li><a href="guanjianci.php?gjc=${Info.userName}">@提醒</a></li>
    <li><a href="kf_growup.php">等级经验</a></li>
    <li><a href="kf_fw_ig_index.php">争夺奖励</a></li>
    <li><a href="kf_fw_ig_my.php">我的道具</a></li>
    <li><a href="kf_fw_ig_shop.php">道具商店</a></li>
    <li><a href="profile.php?action=modify">设置</a></li>
    <li><a href="hack.php?H_name=bank">银行</a></li>
    <li><a href="profile.php?action=favor">收藏</a></li>
    <li><a href="personal.php?action=post">我的回复</a></li>
    ${Const.customSideBarContent}
  </ul>
</li>
`);
    }
};

/**
 * 自动活期存款
 * @param {boolean} [isRead=false] 是否读取个人信息页面以获得当前所拥有KFB的信息
 */
export const autoSaveCurrentDeposit = function (isRead) {
    if (!(Config.saveCurrentDepositAfterKfb > 0 && Config.saveCurrentDepositKfb > 0 && Config.saveCurrentDepositKfb <= Config.saveCurrentDepositAfterKfb))
        return;
    let $kfb = $('a[href="kf_givemekfb.php"]');

    /**
     * 活期存款
     * @param {number} income 当前拥有的KFB
     */
    const saveCurrentDeposit = function (income) {
        if (income < Config.saveCurrentDepositAfterKfb) return;
        let multiple = Math.floor((income - Config.saveCurrentDepositAfterKfb) / Config.saveCurrentDepositKfb);
        if (income - Config.saveCurrentDepositKfb * multiple >= Config.saveCurrentDepositAfterKfb)
            multiple++;
        let money = Config.saveCurrentDepositKfb * multiple;
        if (money <= 0 || money > income) return;
        console.log('自动活期存款Start');
        $.post('hack.php?H_name=bank',
            {action: 'save', btype: 1, savemoney: money},
            function (html) {
                showFormatLog('自动存款', html);
                let {msg} = Util.getResponseMsg(html);
                if (/完成存款/.test(msg)) {
                    Log.push('自动存款', `共有\`${money}\`KFB已自动存入活期存款`);
                    console.log(`共有${money}KFB已自动存入活期存款`);
                    Msg.show(`共有<em>${money}</em>KFB已自动存入活期存款`);
                    if (Info.isInHomePage) $kfb.text(`拥有${income - money}KFB`);
                }
            });
    };

    if (isRead) {
        console.log('获取当前持有KFB Start');
        $.get(`profile.php?action=show&uid=${Info.uid}&t=${new Date().getTime()}`, function (html) {
            let matches = /论坛货币：(\d+)\s*KFB<br/i.exec(html);
            if (matches) saveCurrentDeposit(parseInt(matches[1]));
        });
    }
    else {
        let matches = /拥有(\d+)KFB/.exec($kfb.text());
        if (matches) saveCurrentDeposit(parseInt(matches[1]));
    }
};

/**
 * 执行自定义脚本
 * @param {number} type 脚本类型，1：脚本开始时执行；2：脚本结束时执行
 */
export const runCustomScript = function (type = 1) {
    let script = '';
    if (type === 2) script = Config.customScriptEndContent;
    else script = Config.customScriptStartContent;
    if (script) runCmd(script);
};

/**
 * 更换ID颜色
 */
export const changeIdColor = function () {
    if (!Config.changeAllAvailableIdColorEnabled && Config.customAutoChangeIdColorList.length <= 1) return;
    /**
     * 写入Cookie
     */
    const setCookie = function () {
        let nextTime = Util.getDate(`+${Config.autoChangeIdColorInterval}h`);
        Util.setCookie(Const.autoChangeIdColorCookieName, nextTime.getTime(), nextTime);
    };
    console.log('自动更换ID颜色Start');
    $.get('kf_growup.php?t=' + new Date().getTime(), function (html) {
        if (Util.getCookie(Const.autoChangeIdColorCookieName)) return;
        let matches = html.match(/href="kf_growup\.php\?ok=2&safeid=\w+&color=\d+"/g);
        if (matches) {
            let safeId = '';
            let safeIdMatches = /safeid=(\w+)&/i.exec(matches[0]);
            if (safeIdMatches)safeId = safeIdMatches[1];
            if (!safeId) {
                setCookie();
                return;
            }

            let availableIdList = [];
            for (let i in matches) {
                let idMatches = /color=(\d+)/i.exec(matches[i]);
                if (idMatches) availableIdList.push(parseInt(idMatches[1]));
            }

            let idList = availableIdList;
            if (!Config.changeAllAvailableIdColorEnabled) {
                idList = [];
                for (let id of Config.customAutoChangeIdColorList) {
                    if (availableIdList.includes(id)) idList.push(id);
                }
            }
            if (idList.length <= 1) {
                setCookie();
                return;
            }

            let prevId = parseInt(TmpLog.getValue(Const.prevAutoChangeSMColorIdTmpLogName));
            if (isNaN(prevId) || prevId < 0) prevId = 0;

            let nextId = 0;
            if (Config.autoChangeIdColorType.toLowerCase() === 'sequence') {
                for (let [i, id] of idList.entries()) {
                    if (id > prevId) {
                        nextId = id;
                        break;
                    }
                }
                if (nextId === 0) nextId = idList[0];
            }
            else {
                for (let [i, id] of idList.entries()) {
                    if (id === prevId) {
                        idList.splice(i, 1);
                        break;
                    }
                }
                nextId = idList[Math.floor(Math.random() * idList.length)];
            }

            $.get(`kf_growup.php?ok=2&safeid=${safeId}&color=${nextId}&t=${new Date().getTime()}`, function (html) {
                setCookie();
                showFormatLog('自动更换ID颜色', html);
                let {msg} = Util.getResponseMsg(html);
                if (/等级颜色修改完毕/.test(msg)) {
                    console.log('ID颜色更换为：' + nextId);
                    TmpLog.setValue(Const.prevAutoChangeSMColorIdTmpLogName, nextId);
                }
            });
        }
        else {
            setCookie();
        }
    });
};

/**
 * 显示元素的title属性提示（用于移动版浏览器）
 * @param {{}} e 点击事件
 * @param {string} title title属性
 */
export const showElementTitleTips = function (e, title) {
    $('.pd_title_tips').remove();
    if (!title || !e.originalEvent) return;
    $(`<div class="pd_title_tips">${title}</div>`).appendTo('body')
        .css('left', e.originalEvent.pageX - 20).css('top', e.originalEvent.pageY + 15);
};

/**
 * 绑定包含title属性元素的点击事件（用于移动版浏览器）
 */
export const bindElementTitleClick = function () {
    let excludeNodeNameList = ['A', 'IMG', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'];
    $(document).click(function (e) {
        let target = e.target;
        if (!target.title && !excludeNodeNameList.includes(target.nodeName) && target.parentNode && target.parentNode.title)
            target = target.parentNode;
        if (target.title && !excludeNodeNameList.includes(target.nodeName) &&
            (!target.id || !target.id.startsWith('wy_')) && !$(target).is('.pd_editor_btn')
        ) {
            showElementTitleTips(e, target.title);
        }
        else {
            $('.pd_title_tips').remove();
        }
    });
};

/**
 * 绑定搜索类型下拉菜单点击事件
 */
export const bindSearchTypeSelectMenuClick = function () {
    $(document).on('click', '.pd_search_type', function () {
        let $menu = $(this);
        let $searchTypeList = $('.pd_search_type_list');
        if ($searchTypeList.length > 0) {
            $searchTypeList.remove();
            return;
        }
        let type = $menu.data('type');
        $searchTypeList = $('<ul class="pd_search_type_list"><li>标题</li><li>作者</li><li>关键词</li><li>用户名</li></ul>').appendTo('body');
        let offset = $menu.offset();
        $searchTypeList.css('top', offset.top + $menu.height() + 2).css('left', offset.left + 1);
        if (type === 'dialog') {
            $searchTypeList.css({
                'width': '65px',
                'left': offset.left - 1
            });
        }
        $searchTypeList.on('click', 'li', function () {
            let $this = $(this);
            let type = $this.text().trim();
            let $form = $menu.closest('form');
            let $keyWord = $form.find('input[name="keyword"], input[name="pwuser"]');
            $menu.find('span').text(type);
            if (type !== '关键词' && type !== '用户名') $form.attr('action', 'search.php?');
            if (type === '作者') $keyWord.attr('name', 'pwuser');
            else $keyWord.attr('name', 'keyword');
            let $searchRange = $form.find('[name="searchRange"][value="current"]');
            if ($searchRange.length > 0) {
                $searchRange.prop('disabled', type === '关键词' || type === '用户名' || !$searchRange.data('enabled'));
            }
            $searchTypeList.remove();
            $keyWord.focus();
        });
    });

    $(document).on('submit', 'form[name="pd_search"]', function () {
        let $this = $(this);
        let type = $.trim($this.find('.pd_search_type > span').text());
        if (type === '关键词') {
            $this.attr('action', 'guanjianci.php?gjc=' + $this.find('input[name="keyword"]').val());
        }
        else if (type === '用户名') {
            $this.attr('action', 'profile.php?action=show&username=' + $this.find('input[name="keyword"]').val());
        }
    });
};

/**
 * 可使用2个字以下的关键字进行搜索
 */
export const makeSearchByBelowTwoKeyWordAvailable = function () {
    $(document).on('submit', 'form[action="search.php?"]', function () {
        let $this = $(this);
        let $keyWord = $this.find('input[name="keyword"]');
        let $method = $this.find('input[name="method"]');
        if (!$keyWord.length || !$method.length) return;
        let keyWord = $.trim($keyWord.val());
        if (!keyWord || Util.getStrByteLen(keyWord) > 2) return;
        $keyWord.val(keyWord + ' ' + Math.floor(new Date().getTime() / 1000));
        $method.val('OR');
        setTimeout(() => {
            $keyWord.val(keyWord);
            $method.val('AND');
        }, 200);
    });
};

/**
 * 添加搜索对话框链接
 */
export const addSearchDialogLink = function () {
    $('<span> | </span><a href="#">搜索</a>')
        .insertAfter('.topright > a[href="message.php"]')
        .filter('a')
        .click(function (e) {
            e.preventDefault();
            const dialogName = 'pd_search';
            if ($('#' + dialogName).length > 0) return;
            let html = `
<div class="pd_cfg_main">
  <input name="step" value="2" type="hidden">
  <input name="method" value="AND" type="hidden">
  <input name="sch_area" value="0" type="hidden">
  <input name="s_type" value="forum" type="hidden">
  <input name="f_fid" value="all" type="hidden">
  <input name="orderway" value="lastpost" type="hidden">
  <input name="asc" value="DESC" type="hidden">
  <div style="margin-top: 15px;">
    <input class="pd_input" name="keyword" type="search" style="float: left; width: 175px; line-height: 26px;" placeholder="关键字">
    <div class="pd_search_type" data-type="dialog"><span>标题</span><i>∨</i></div>
    <button class="indloginm" name="submit" type="submit">搜索</button>
  </div>
  <div style="margin-bottom: 8px; line-height: 35px;">
    <label><input name="searchRange" type="radio" value="all" checked> 全站 </label>
    <label><input name="searchRange" type="radio" value="current" disabled> 本版</label>
  </div>
</div>`;
            let $dialog = Dialog.create(dialogName, '搜索', html);

            $dialog.closest('form').attr({
                'name': dialogName,
                'action': 'search.php?',
                'method': 'post',
                'target': '_blank',
            }).off('submit');

            let fid = parseInt($('input[name="f_fid"]:first, input[name="fid"]:first').val());
            if (fid) {
                $dialog.find('[name="searchRange"]').click(function () {
                    let $this = $(this);
                    $dialog.find('input[name="f_fid"]').val($this.val() === 'current' ? fid : 'all');
                });
                $dialog.find('[name="searchRange"][value="current"]').prop('disabled', false).data('enabled', true).click();
            }

            $dialog.keydown(function (e) {
                if (e.keyCode === 27) {
                    $('.pd_search_type_list').remove();
                }
            }).find('h1 > span').click(function () {
                $('.pd_search_type_list').remove();
            });

            Dialog.show(dialogName);
            $dialog.find('[name="keyword"]').focus();
        });
};

/**
 * 修复论坛错误代码
 */
export const repairBbsErrorCode = function () {
    Info.w.is_ie = false;
    if (location.pathname === '/read.php') {
        Info.w.strlen = Util.getStrByteLen;
    }
};

/**
 * 通过左右键进行翻页
 */
export const turnPageViaKeyboard = function () {
    $(document).keydown(function (e) {
        if (e.keyCode !== 37 && e.keyCode !== 39) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        let $page = $('.pages:first');
        let $curPage = $page.find('li > a[href="javascript:;"]');
        if (!$curPage.length) return;
        let curPage = Util.getCurrentThreadPage();
        let url = '';
        if (e.keyCode === 37) {
            if (curPage <= 1) return;
            url = $page.find('li > a:contains("上一页")').attr('href');
        }
        else {
            let matches = /&page=(\d+)/.exec($page.find('li:last-child > a').attr('href'));
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
};

/**
 * 检查自助评分文件大小
 * @param {string} title 帖子标题
 * @param {number} ratingSize 评分大小
 * @returns {{}} 检查结果
 */
export const checkRatingSize = function (title, ratingSize) {
    let titleSize = 0;
    let matches = title.match(/\D(\d+(?:\.\d+)?)\s?(M|G)/ig);
    if (matches) {
        for (let i = 0; i < matches.length; i++) {
            let sizeMatches = /(\d+(?:\.\d+)?)\s?(M|G)/i.exec(matches[i]);
            if (!sizeMatches) continue;
            let size = parseFloat(sizeMatches[1]);
            if (sizeMatches[2].toUpperCase() === 'G') size *= 1024;
            titleSize += size;
        }
    }

    if (!titleSize || !ratingSize) {
        return {type: -1};
    }
    else if (titleSize > ratingSize * (100 + Const.ratingErrorSizePercent) / 100 + 1 ||
        titleSize < ratingSize * (100 - Const.ratingErrorSizePercent) / 100 - 1
    ) {
        return {type: 1, titleSize, ratingSize};
    }
    else return {type: 0};
};

/**
 * 运行命令
 * @param {string} cmd 命令
 * @param {boolean} isOutput 是否在控制台上显示结果
 * @returns {string} 运行结果
 */
export const runCmd = function (cmd, isOutput = false) {
    let result = '';
    try {
        result = eval(cmd);
        if (isOutput) console.log(result);
    }
    catch (ex) {
        result = ex;
        console.log(ex);
    }
    return String(result);
};
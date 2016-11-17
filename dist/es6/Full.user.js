// ==UserScript==
// @name        KF Online助手
// @namespace   https://greasyfork.org/users/4514
// @icon        https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KFOL必备！为绯月Galgame论坛增加了大量人性化、自动化的功能，更多功能开发中……
// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/Full.meta.js
// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/Full.user.js
// @include     http://*2dkf.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     7.0.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// @use-greasemonkey true
// ==/UserScript==
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Info = require('./module/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./module/Util');

var Util = _interopRequireWildcard(_Util);

var _Const = require('./module/Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./module/Config');

var _Public = require('./module/Public');

var Public = _interopRequireWildcard(_Public);

var _Index = require('./module/Index');

var Index = _interopRequireWildcard(_Index);

var _Read = require('./module/Read');

var Read = _interopRequireWildcard(_Read);

var _Post = require('./module/Post');

var Post = _interopRequireWildcard(_Post);

var _Other = require('./module/Other');

var Other = _interopRequireWildcard(_Other);

var _Bank = require('./module/Bank');

var Bank = _interopRequireWildcard(_Bank);

var _Card = require('./module/Card');

var Card = _interopRequireWildcard(_Card);

var _Item = require('./module/Item');

var Item = _interopRequireWildcard(_Item);

var _Loot = require('./module/Loot');

var Loot = _interopRequireWildcard(_Loot);

var _Script = require('./module/Script');

var Script = _interopRequireWildcard(_Script);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 版本号
const version = '7.0.2';

$(function () {
    if (typeof jQuery === 'undefined') return;
    let startDate = new Date();
    //console.log('【KF Online助手】启动');
    _Info2.default.version = version;
    if (!Public.getUidAndUserName()) return;
    Public.addPolyfill();
    (0, _Config.init)();
    Public.checkBrowserType();
    Public.appendCss();
    Public.addConfigAndLogDialogLink();
    if (Config.animationEffectOffEnabled) $.fx.off = true;

    if (Config.customScriptEnabled) Script.runCustomScript('start');
    Public.repairBbsErrorCode();
    window.addEventListener('beforeunload', Public.preventCloseWindowWhenActioning);
    if (Config.showSearchLinkEnabled) Public.addSearchDialogLink();
    Public.bindSearchTypeSelectMenuClick();
    Public.makeSearchByBelowTwoKeyWordAvailable();
    if (Config.modifySideBarEnabled) Public.modifySideBar();
    if (Config.addSideBarFastNavEnabled) Public.addFastNavForSideBar();
    if (_Info2.default.isInHomePage) {
        Index.handleAtTips();
        Index.addSearchTypeSelectBoxInHomePage();
        if (Config.smLevelUpAlertEnabled) Index.smLevelUpAlert();
        if (Config.smRankChangeAlertEnabled) Index.smRankChangeAlert();
        if (Config.showVipSurplusTimeEnabled) Index.showVipSurplusTime();
        if (Config.homePageThreadFastGotoLinkEnabled) Index.addHomePageThreadFastGotoLink();
        if (Config.fixedDepositDueAlertEnabled && !Util.getCookie(_Const2.default.fixedDepositDueAlertCookieName)) Bank.fixedDepositDueAlert();
    } else if (location.pathname === '/read.php') {
        if (Config.turnPageViaKeyboardEnabled) Public.turnPageViaKeyboard();
        Read.fastGotoFloor();
        if (Config.adjustThreadContentWidthEnabled) Read.adjustThreadContentWidth();
        Read.adjustThreadContentFontSize();
        Read.showAttachImageOutsideSellBox();
        if (Config.parseMediaTagEnabled) Read.parseMediaTag();
        if (Config.modifyKfOtherDomainEnabled) Read.modifyKFOtherDomainLink();
        if (Config.customSmColorEnabled) Read.modifySmColor();
        if (Config.customMySmColor) Read.modifyMySmColor();
        if (Config.multiQuoteEnabled) Read.addMultiQuoteButton();
        Read.addFastGotoFloorInput();
        Read.addFloorGotoLink();
        Read.addCopyBuyersListLink();
        Read.addStatRepliersLink();
        Read.handleBuyThreadBtn();
        if (Config.batchBuyThreadEnabled) Read.addBatchBuyThreadButton();
        if (Config.showSelfRatingLinkEnabled) Read.addSelfRatingLink();
        if (Config.userMemoEnabled) Read.addUserMemo();
        Read.addCopyCodeLink();
        Read.addMoreSmileLink();
        if ($('a[href$="#install-script"]').length > 0) Script.handleInstallScriptLink();
    } else if (location.pathname === '/thread.php') {
        if (Config.highlightNewPostEnabled) Other.highlightNewPost();
        if (Config.showFastGotoThreadPageEnabled) Other.addFastGotoThreadPageLink();
    } else if (/\/kf_fw_ig_my\.php$/i.test(location.href)) {
        Item.enhanceMyItemsPage();
        Item.addBatchUseAndConvertItemTypesButton();
    } else if (/\/kf_fw_ig_renew\.php$/i.test(location.href)) {
        Item.addBatchConvertEnergyAndRestoreItemsLink();
    } else if (/\/kf_fw_ig_renew\.php\?lv=\d+$/i.test(location.href)) {
        Item.addConvertEnergyAndRestoreItemsButton();
    } else if (/\/kf_fw_ig_my\.php\?lv=\d+$/i.test(location.href)) {
        Item.addSellAndUseItemsButton();
    } else if (/\/kf_fw_ig_my\.php\?pro=\d+/i.test(location.href)) {
        Item.modifyItemDescription();
        if (/\/kf_fw_ig_my\.php\?pro=\d+&display=1$/i.test(location.href)) {
            Item.addSampleItemTips();
        }
    } else if (location.pathname === '/kf_fw_ig_shop.php') {
        Item.addBatchBuyItemsLink();
    } else if (location.pathname === '/kf_fw_ig_index.php') {
        Loot.enhanceLootIndexPage();
    } else if (location.pathname === '/kf_fw_ig_pklist.php') {
        Loot.addUserLinkInPkListPage();
    } else if (/\/hack\.php\?H_name=bank$/i.test(location.href)) {
        Bank.addBatchTransferButton();
        Bank.handleInBankPage();
    } else if (/\/kf_fw_card_my\.php$/i.test(location.href)) {
        Card.addStartBatchModeButton();
    } else if (/\/post\.php\?action=reply&fid=\d+&tid=\d+&multiquote=1/i.test(location.href)) {
        if (Config.multiQuoteEnabled) Post.handleMultiQuote(2);
    } else if (/\/post\.php\?action=quote/i.test(location.href)) {
        Post.removeUnpairedBBCodeInQuoteContent();
    } else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
        Other.addFastDrawMoneyLink();
        if (Config.modifyKfOtherDomainEnabled) Read.modifyKFOtherDomainLink();
    } else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
        Other.addMsgSelectButton();
    } else if (/\/profile\.php\?action=show/i.test(location.href)) {
        Other.addFollowAndBlockAndMemoUserLink();
    } else if (/\/personal\.php\?action=post/i.test(location.href)) {
        if (Config.perPageFloorNum === 10) Other.modifyMyPostLink();
    } else if (location.pathname === '/kf_growup.php') {
        Other.addAutoChangeIdColorButton();
    } else if (location.pathname === '/guanjianci.php') {
        Other.highlightUnReadAtTipsMsg();
    } else if (/\/profile\.php\?action=modify$/i.test(location.href)) {
        Other.syncModifyPerPageFloorNum();
        if (_Info2.default.isInMiaolaDomain) Other.addAvatarChangeAlert();
    } else if (/\/job\.php\?action=preview$/i.test(location.href)) {
        Post.modifyPostPreviewPage();
    } else if (location.pathname === '/search.php') {
        if (Config.turnPageViaKeyboardEnabled) Public.turnPageViaKeyboard();
    } else if (/\/kf_fw_1wkfb\.php\?ping=(2|4)/i.test(location.href)) {
        Other.highlightRatingErrorSize();
    } else if (/\/kf_fw_1wkfb\.php\?do=1/i.test(location.href)) {
        Other.showSelfRatingErrorSizeSubmitWarning();
    } else if (location.pathname === '/kf_no1.php') {
        Other.addUserNameLinkInRankPage();
    } else if (location.pathname === '/faq.php') {
        Other.modifyFaq();
    }
    if (location.pathname === '/post.php') {
        Post.addExtraPostEditorButton();
        Post.addExtraOptionInPostPage();
        if (_Info2.default.isInMiaolaDomain) Post.addAttachChangeAlert();
    }
    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (_Info2.default.isMobile) Public.bindElementTitleClick();
    if (_Info2.default.isInMiaolaDomain) {
        if (Config.kfSmileEnhanceExtensionEnabled && ['/read.php', '/post.php', '/message.php'].includes(location.pathname)) {
            Public.importKfSmileEnhanceExtension();
        }
    }

    let autoSaveCurrentDepositAvailable = Config.autoSaveCurrentDepositEnabled && _Info2.default.isInHomePage;
    let isDonationStarted = false;
    if (Config.autoDonationEnabled && !Util.getCookie(_Const2.default.donationCookieName)) {
        isDonationStarted = true;
        Public.donation(autoSaveCurrentDepositAvailable);
    }

    if (autoSaveCurrentDepositAvailable && !isDonationStarted) Public.autoSaveCurrentDeposit();

    if (Config.autoChangeIdColorEnabled && !Util.getCookie(_Const2.default.autoChangeIdColorCookieName)) Public.changeIdColor();

    if (Config.autoRefreshEnabled && _Info2.default.isInHomePage) Public.startAutoRefreshMode();

    if (Config.customScriptEnabled) Script.runCustomScript('end');

    let endDate = new Date();
    console.log(`【KF Online助手】加载完毕，加载耗时：${ endDate - startDate }ms`);
});

},{"./module/Bank":2,"./module/Card":3,"./module/Config":4,"./module/Const":6,"./module/Index":9,"./module/Info":10,"./module/Item":11,"./module/Loot":14,"./module/Other":16,"./module/Post":17,"./module/Public":18,"./module/Read":19,"./module/Script":20,"./module/Util":22}],2:[function(require,module,exports){
/* 银行模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fixedDepositDueAlert = exports.handleInBankPage = exports.addBatchTransferButton = exports.drawCurrentDeposit = undefined;

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 最低转账金额
const minTransferMoney = 20;

/**
 * 给活期帐户存款
 * @param {number} money 存款金额（KFB）
 * @param {number} cash 现金（KFB）
 * @param {number} currentDeposit 现有活期存款（KFB）
 */
const saveCurrentDeposit = function (money, cash, currentDeposit) {
    let $wait = Msg.wait('正在存款中&hellip;');
    $.post('hack.php?H_name=bank', { action: 'save', btype: 1, savemoney: money }, function (html) {
        Public.showFormatLog('存款', html);
        let { msg } = Util.getResponseMsg(html);
        if (/完成存款/.test(msg)) {
            Msg.remove($wait);
            console.log(`共有${ money }KFB存入活期存款`);
            let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
            $account.html($account.html().replace(/当前所持：-?\d+KFB/, `当前所持：${ cash - money }KFB`).replace(/活期存款：-?\d+KFB/, `活期存款：${ currentDeposit + money }KFB`));
            setTimeout(function () {
                $(document).dequeue('Bank');
            }, 5000);
        } else {
            $(document).clearQueue('Bank');
            alert('存款失败');
        }
    });
};

/**
 * 从活期帐户取款
 * @param {number} money 取款金额（KFB）
 */
const drawCurrentDeposit = exports.drawCurrentDeposit = function (money) {
    let $wait = Msg.wait('正在取款中&hellip;');
    $.post('hack.php?H_name=bank', { action: 'draw', btype: 1, drawmoney: money }, function (html) {
        Public.showFormatLog('取款', html);
        let { msg } = Util.getResponseMsg(html);
        Msg.remove($wait);
        if (/完成取款/.test(msg)) {
            console.log(`从活期存款中取出了${ money }KFB`);
            Msg.show(`从活期存款中取出了<em>${ money }</em>KFB`, -1);
        } else if (/取款金额大于您的存款金额/.test(msg)) {
            Msg.show('取款金额大于当前活期存款金额', -1);
        } else if (/\d+秒内不允许重新交易/.test(msg)) {
            Msg.show('提交速度过快', -1);
        } else {
            Msg.show('取款失败', -1);
        }
    });
};

/**
 * 批量转账
 * @param {Array} users 用户列表
 * @param {string} msg 转帐附言
 * @param {boolean} isDeposited 是否已存款
 * @param {number} currentDeposit 现有活期存款
 */
const batchTransfer = function (users, msg, isDeposited, currentDeposit) {
    let successNum = 0,
        failNum = 0,
        successMoney = 0;
    $.each(users, function (index, [userName, money]) {
        $(document).queue('Bank', function () {
            $.ajax({
                type: 'POST',
                url: 'hack.php?H_name=bank',
                timeout: _Const2.default.defAjaxTimeout,
                data: `&action=virement&pwuser=${ Util.getGBKEncodeString(userName) }&to_money=${ money }&memo=${ Util.getGBKEncodeString(msg) }`,
                success(html) {
                    Public.showFormatLog('批量转账', html);
                    let { msg } = Util.getResponseMsg(html);
                    let msgHtml = '';
                    if (/完成转帐!/.test(msg)) {
                        successNum++;
                        successMoney += money;
                        msgHtml = `${ userName } <em>+${ money }</em>`;
                    } else {
                        failNum++;
                        if (/用户<b>.+?<\/b>不存在<br\s*\/?>/.test(msg)) msg = '用户不存在';else if (/您的存款不够支付转帐/.test(msg)) msg = '存款不足';else if (/转账额度不足/.test(msg)) msg = '转账额度不足';else if (/当前等级无法使用该功能/.test(msg)) msg = '当前等级无法使用转账功能';else if (/转帐数目填写不正确/.test(msg)) msg = '转帐金额不正确';else if (/自己无法给自己转帐/.test(msg)) msg = '无法给自己转帐';else if (/\d+秒内不允许重新交易/.test(msg)) msg = '提交速度过快';
                        msgHtml = `${ userName }:${ money } <span class="pd_notice">(${ msg })</span>`;
                    }
                    $('.pd_result:last').append(`<li>${ msgHtml }</li>`);
                },
                error() {
                    failNum++;
                    $('.pd_result:last').append(`
<li>
  ${ userName }:${ money }
  <span class="pd_notice">(连接超时，转账可能失败，请到<a target="_blank" href="hack.php?H_name=bank&action=log">银行日志</a>里进行确认)</span>
</li>
`);
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('Bank');

                    if (isStop || index === users.length - 1) {
                        if (successNum > 0) {
                            Log.push('批量转账', `共有\`${ successNum }\`名用户转账成功`, { pay: { 'KFB': -successMoney } });
                        }
                        Msg.destroy();
                        let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("活期存款：")');
                        $account.html($account.html().replace(/活期存款：-?\d+KFB/, `活期存款：${ currentDeposit - successMoney }KFB`));
                        console.log(`共有${ successNum }名用户转账成功，共有${ failNum }名用户转账失败，KFB-${ successMoney }`);
                        $('.pd_result:last').append(`<li><b>共有<em>${ successNum }</em>名用户转账成功` + `${ failNum > 0 ? `，共有<em>${ failNum }</em>名用户转账失败` : '' }：</b>KFB <ins>-${ successMoney }</ins></li>`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>名用户转账成功` + `${ failNum > 0 ? `，共有<em>${ failNum }</em>名用户转账失败` : '' }</strong><i>KFB<ins>-${ successMoney }</ins></i>`, -1);
                    } else {
                        setTimeout(() => $(document).dequeue('Bank'), 5000);
                    }
                }
            });
        });
    });
    if (!isDeposited) $(document).dequeue('Bank');
};

/**
 * 验证批量转账的字段值是否正确
 * @param {jQuery} $transfer 批量转账区域对象
 * @returns {boolean} 是否正确
 */
const batchTransferVerify = function ($transfer) {
    let $bankUsers = $transfer.find('[name="users"]');
    let users = $bankUsers.val();
    if (!/^\s*\S+\s*$/m.test(users) || /^\s*:/m.test(users) || /:/.test(users) && /:(\D|$)/m.test(users)) {
        alert('用户列表格式不正确');
        $bankUsers.select();
        $bankUsers.focus();
        return false;
    }
    if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
        alert(`转帐金额不能小于${ minTransferMoney }KFB`);
        $bankUsers.select();
        $bankUsers.focus();
        return false;
    }
    let $bankMoney = $transfer.find('[name="money"]');
    let money = parseInt($bankMoney.val());
    if (/^\s*[^:]+\s*$/m.test(users)) {
        if (!$.isNumeric(money)) {
            alert('通用转账金额格式不正确');
            $bankMoney.select();
            $bankMoney.focus();
            return false;
        } else if (money < minTransferMoney) {
            alert(`转帐金额不能小于${ minTransferMoney }KFB`);
            $bankMoney.select();
            $bankMoney.focus();
            return false;
        }
    }
    return true;
};

/**
 * 添加批量转账的按钮
 */
const addBatchTransferButton = exports.addBatchTransferButton = function () {
    let html = `
<tr id="pd_bank_transfer">
  <td style="vertical-align: top;">
    使用说明：<br>每行一名用户，<br>如需单独设定金额，<br>可写为“用户名:金额”<br>（注意是<b>英文冒号</b>）<br>例子：<br>
    <pre style="border: 1px solid #9999ff; padding: 5px;">张三\n李四:200\n王五:500\n信仰风</pre>
  </td>
  <td>
  <form>
    <div style="display: inline-block;">
      <label>用户列表：<br>
        <textarea class="pd_textarea" name="users" style="width: 270px; height: 250px;"></textarea>
      </label>
    </div>
    <div style="display: inline-block; margin-left: 10px;">
      <label>通用转帐金额（如所有用户都已设定单独金额则可留空）：<br>
        <input class="pd_input" name="money" type="text" style="width: 217px;" maxlength="15">
      </label><br>
      <label style="margin-top: 5px;">转帐附言（可留空）：<br>
        <textarea class="pd_textarea" name="msg" style="width: 225px; height: 206px;"></textarea>
      </label>
    </div>
    <div>
      <input class="pd_input" type="submit" value="批量转账">
      <input class="pd_input" type="reset" value="重置">
      <input class="pd_input" name="random" type="button" value="随机金额" title="为用户列表上的每个用户设定指定范围内的随机金额">
      （活期存款不足时，将自动进行存款；批量转账金额不会从定期存款中扣除）
    </div>
  </form>
  </td>
</tr>`;
    let $transfer = $(html).appendTo('.bank1 > tbody');
    $transfer.find('form').submit(function (e) {
        e.preventDefault();
        Msg.destroy();
        if (!batchTransferVerify($transfer)) return;
        let commonMoney = parseInt($transfer.find('[name="money"]').val());
        if (!commonMoney) commonMoney = 0;
        let msg = $transfer.find('[name="msg"]').val();
        let users = [];
        for (let line of $transfer.find('[name="users"]').val().split('\n')) {
            line = $.trim(line);
            if (!line) continue;
            if (line.includes(':')) {
                let [userName, money] = line.split(':');
                if (typeof money === 'undefined') continue;
                users.push([$.trim(userName), parseInt(money)]);
            } else {
                users.push([line, commonMoney]);
            }
        }
        if (!users.length) return;

        let matches = /\(手续费(\d+)%\)/.exec($('td:contains("(手续费")').text());
        if (!matches) return;
        let fee = parseInt(matches[1]) / 100;
        let totalMoney = 0;
        for (let [, money] of users) {
            totalMoney += money;
        }
        totalMoney = Math.floor(totalMoney * (1 + fee));
        if (!confirm(`共计${ users.length }名用户，总额${ totalMoney.toLocaleString() }KFB，是否转账？`)) return;

        let $wait = Msg.wait('正在获取存款信息中&hellip;');
        $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
            Msg.remove($wait);
            let cash = 0,
                currentDeposit = 0;
            let matches = /当前所持：(-?\d+)KFB<br/i.exec(html);
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
            let isDeposited = false;
            let difference = totalMoney - currentDeposit;
            if (difference > 0) {
                isDeposited = true;
                $(document).queue('Bank', function () {
                    saveCurrentDeposit(difference, cash, currentDeposit);
                    cash -= difference;
                    currentDeposit += difference;
                });
                $(document).dequeue('Bank');
            }
            Msg.wait(`<strong>正在批量转账中，请耐心等待&hellip;</strong><i>剩余：<em class="pd_countdown">${ users.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
            $transfer.find('> td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
            batchTransfer(users, msg, isDeposited, currentDeposit);
        });
    }).end().find('[name="random"]').click(function (e) {
        e.preventDefault();
        let userList = [];
        for (let line of $transfer.find('[name="users"]').val().split('\n')) {
            line = $.trim(line);
            if (!line) continue;
            userList.push($.trim(line.split(':')[0]));
        }
        if (!userList.length) return;

        let range = prompt('设定随机金额的范围（注：最低转账金额为20KFB）', '20-100');
        if (range === null) return;
        range = $.trim(range);
        if (!/^\d+-\d+$/.test(range)) {
            alert('随机金额范围格式不正确');
            return;
        }
        let arr = range.split('-');
        let min = parseInt(arr[0]),
            max = parseInt(arr[1]);
        if (max < min) {
            alert('最大值不能低于最小值');
            return;
        }

        let content = '';
        for (let userName of userList) {
            content += userName + ':' + Math.floor(Math.random() * (max - min + 1) + min) + '\n';
        }
        $transfer.find('[name="users"]').val(content);
    });
};

/**
 * 在银行页面对页面元素进行处理
 */
const handleInBankPage = exports.handleInBankPage = function () {
    let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("可获利息：")');
    let interestHtml = $account.html();
    let matches = /可获利息：(\d+)\(/i.exec(interestHtml);
    let interest = 0;
    if (matches) {
        interest = parseInt(matches[1]);
        if (interest > 0) {
            $account.html(interestHtml.replace(/可获利息：\d+\(/i, `可获利息：<b class="pd_highlight">${ interest }</b>(`));
        }
    }

    let fixedDepositHtml = $account.html();
    matches = /定期存款：(\d+)KFB/i.exec(fixedDepositHtml);
    if (matches) {
        let fixedDeposit = parseInt(matches[1]);
        if (fixedDeposit > 0 && interest === 0) {
            let time = parseInt(TmpLog.getValue(_Const2.default.fixedDepositDueTmpLogName));
            if (!isNaN(time) && time > new Date().getTime()) {
                fixedDepositHtml = fixedDepositHtml.replace('期间不存取定期，才可以获得利息）', `期间不存取定期，才可以获得利息）<span style="color: #339933;"> (到期时间：${ Util.getDateString(new Date(time)) } ` + `${ Util.getTimeString(new Date(time), ':', false) })</span>`);
                $account.html(fixedDepositHtml);
            }

            matches = /定期利息：([\d\.]+)%/.exec(fixedDepositHtml);
            if (matches) {
                let interestRate = parseFloat(matches[1]) / 100;
                let anticipatedInterest = Math.round(fixedDeposit * interestRate * _Const2.default.fixedDepositDueTime);
                fixedDepositHtml = fixedDepositHtml.replace('取出定期将获得该数额的KFB利息)', `取出定期将获得该数额的KFB利息)<span style="color: #339933;"> (预期利息：${ anticipatedInterest } KFB)</span>`);
                $account.html(fixedDepositHtml);
            }
        }
    }

    $('form[name="form1"], form[name="form2"]').submit(function () {
        let $this = $(this);
        let money = 0;
        if ($this.is('[name="form2"]')) money = parseInt($this.find('input[name="drawmoney"]').val());else money = parseInt($this.find('input[name="savemoney"]').val());
        if (parseInt($this.find('input[name="btype"]:checked').val()) === 2 && money > 0) {
            TmpLog.setValue(_Const2.default.fixedDepositDueTmpLogName, Util.getDate(`+${ _Const2.default.fixedDepositDueTime }d`).getTime());
        }
    });

    $('form[name="form3"]').submit(function () {
        let matches = /活期存款：(-?\d+)KFB/.exec($('td:contains("活期存款：")').text());
        if (!matches) return;
        let currentDeposit = parseInt(matches[1]);
        matches = /定期存款：(\d+)KFB/.exec($('td:contains("定期存款：")').text());
        if (!matches) return;
        let fixedDeposit = parseInt(matches[1]);
        let money = parseInt($('input[name="to_money"]').val());
        if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
            if (!confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                $(this).find('input[type="submit"]').prop('disabled', false);
                return false;
            }
        }
    });
};

/**
 * 定期存款到期提醒
 */
const fixedDepositDueAlert = exports.fixedDepositDueAlert = function () {
    console.log('定期存款到期提醒Start');
    $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
        Util.setCookie(_Const2.default.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(1));
        let matches = /可获利息：(\d+)\(/.exec(html);
        if (!matches) return;
        let interest = parseInt(matches[1]);
        if (interest > 0) {
            Util.setCookie(_Const2.default.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(7));
            if (confirm(`您的定期存款已到期，共产生利息${ interest }KFB，是否前往银行取款？`)) {
                location.href = 'hack.php?H_name=bank';
            }
        }
    });
};

},{"./Const":6,"./Log":12,"./Msg":15,"./Public":18,"./TmpLog":21,"./Util":22}],3:[function(require,module,exports){
/* 卡片模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addStartBatchModeButton = undefined;

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 将指定的一系列卡片转换为VIP时间
 * @param {number[]} cardList 卡片ID列表
 * @param {string} safeId 用户的SafeID
 */
const convertCardsToVipTime = function (cardList, safeId) {
    let successNum = 0,
        failNum = 0,
        totalVipTime = 0,
        totalEnergy = 0;
    $(document).clearQueue('ConvertCardsToVipTime');
    $.each(cardList, function (index, cardId) {
        $(document).queue('ConvertCardsToVipTime', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_card_doit.php?do=recard&id=${ cardId }&safeid=${ safeId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('将卡片转换为VIP时间', html);
                    let { msg } = Util.getResponseMsg(html);
                    let matches = /增加(\d+)小时VIP时间(?:.*?获得(\d+)点恢复能量)?/.exec(msg);
                    if (matches) {
                        successNum++;
                        totalVipTime += parseInt(matches[1]);
                        if (typeof matches[2] !== 'undefined') totalEnergy += parseInt(matches[2]);
                    } else failNum++;
                },
                error() {
                    failNum++;
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('ConvertCardsToVipTime');

                    if (isStop || index === cardList.length - 1) {
                        if (successNum > 0) {
                            Log.push('将卡片转换为VIP时间', `共有\`${ successNum }\`张卡片成功为VIP时间`, {
                                gain: { 'VIP小时': totalVipTime, '能量': totalEnergy },
                                pay: { '卡片': -successNum }
                            });
                        }
                        Msg.destroy();
                        console.log(`共有${ successNum }张卡片转换成功，共有${ failNum }张卡片转换失败，VIP小时+${ totalVipTime }，能量+${ totalEnergy }`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>张卡片转换成功${ failNum > 0 ? `，共有<em>${ failNum }</em>张卡片转换失败` : '' }</strong>` + `<i>VIP小时<em>+${ totalVipTime }</em></i><i>能量<em>+${ totalEnergy }</em></i>`, -1);
                        $('.kf_fw_ig2 .pd_card_chk:checked').closest('td').fadeOut('normal', function () {
                            let $parent = $(this).parent();
                            $(this).remove();
                            if (!$parent.children().length) $parent.remove();
                        });
                    } else {
                        setTimeout(function () {
                            $(document).dequeue('ConvertCardsToVipTime');
                        }, _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('ConvertCardsToVipTime');
};

/**
 * 添加开启批量模式的按钮
 */
const addStartBatchModeButton = exports.addStartBatchModeButton = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    if (!$('.kf_fw_ig2 a[href^="kf_fw_card_my.php?id="]').length) return;
    $('<div class="pd_item_btns"><button>开启批量模式</button></div>').insertAfter('.kf_fw_ig2').find('button').click(function () {
        let $this = $(this);
        let $cardLines = $('.kf_fw_ig2 > tbody > tr:gt(2)');
        if ($this.text() === '开启批量模式') {
            $this.text('关闭批量模式');
            $cardLines.on('click', 'a', function (e) {
                e.preventDefault();
                $(this).next('.pd_card_chk').click();
            }).find('td').has('a').each(function () {
                let matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                if (matches) {
                    $(this).css('position', 'relative').append(`<input class="pd_card_chk" type="checkbox" value="${ matches[1] }">`);
                }
            });
            let playedCardList = [];
            $('.kf_fw_ig2 > tbody > tr:nth-child(2) > td').each(function () {
                let matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                if (!matches) return;
                playedCardList.push(parseInt(matches[1]));
            });

            /**
             * 不选择已出战的卡片
             */
            const uncheckPlayedCard = function () {
                for (let id of playedCardList) {
                    $cardLines.find('td').has(`a[href="kf_fw_card_my.php?id=${ id }"]`).find('input:checked').prop('checked', false);
                }
            };

            let $btns = $(`
<label><input name="uncheckPlayedCard" type="checkbox" checked> 不选已出战的卡片</label>
<button name="selectOnlyOne">每类只保留一张</button>
<button name="selectAll">全选</button>
<button name="selectInverse">反选</button><br>
<button name="convertCardsToVipTime">转换为VIP时间</button>
`).insertBefore($this);
            $btns.filter('[name="selectOnlyOne"]').click(function () {
                $cardLines.find('input').prop('checked', true);
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
                let cardTypeList = new Set();
                $cardLines.find('a > img').each(function () {
                    cardTypeList.add($(this).attr('src'));
                });
                for (let src of cardTypeList) {
                    let $cardElems = $cardLines.find('td').has(`img[src="${ src }"]`);
                    let totalNum = $cardElems.length;
                    let checkedNum = $cardElems.has('input:checked').length;
                    if (totalNum > 1) {
                        if (totalNum === checkedNum) {
                            $cardElems.eq(0).find('input:checked').prop('checked', false);
                        }
                    } else {
                        $cardElems.find('input:checked').prop('checked', false);
                    }
                }
            }).end().filter('[name="selectAll"]').click(function () {
                $cardLines.find('input').prop('checked', true);
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
            }).end().filter('[name="selectInverse"]').click(function () {
                $cardLines.find('input').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
            }).end().filter('[name="convertCardsToVipTime"]').click(function () {
                Msg.destroy();
                let cardList = [];
                $cardLines.find('input:checked').each(function () {
                    cardList.push(parseInt($(this).val()));
                });
                if (!cardList.length) return;
                if (!confirm(`共选择了${ cardList.length }张卡片，是否将卡片批量转换为VIP时间？`)) return;
                Msg.wait(`<strong>正在批量转换中&hellip;</strong><i>剩余：<em class="pd_countdown">${ cardList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                convertCardsToVipTime(cardList, safeId);
            });
        } else {
            $this.text('开启批量模式');
            $cardLines.off('click').find('.pd_card_chk').remove();
            $this.prevAll().remove();
        }
    });
};

},{"./Const":6,"./Log":12,"./Msg":15,"./Public":18,"./Util":22}],4:[function(require,module,exports){
/* 配置模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalize = exports.changeStorageType = exports.clear = exports.write = exports.read = exports.init = exports.Config = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 保存设置的键值名称
const name = _Const2.default.storagePrefix + 'config';

/**
 * 配置类
 */
const Config = exports.Config = {
    // 是否开启定时模式，可按时进行自动操作（包括捐款、自动更换ID颜色，需开启相关功能），只在论坛首页生效，true：开启；false：关闭
    autoRefreshEnabled: false,
    // 在首页的网页标题上显示定时模式提示的方案，auto：停留一分钟后显示；always：总是显示；never：不显示
    showRefreshModeTipsType: 'auto',

    // 是否自动KFB捐款，true：开启；false：关闭
    autoDonationEnabled: false,
    // KFB捐款额度，取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前所持现金的百分比（最多不超过5000KFB），例：80%
    donationKfb: '1',
    // 在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）
    donationAfterTime: '00:30:00',

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
    // 帖子内容字体大小，设为0表示使用默认大小，推荐值：14
    threadContentFontSize: 0,
    // 自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009cff，如无需求可留空
    customMySmColor: '',
    // 是否开启自定义各等级神秘颜色的功能，（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），true：开启；false：关闭
    customSmColorEnabled: false,
    // 自定义各等级神秘颜色的设置列表，例：[{min:'50',max:'100',color:'#009cff'},{min:'800',max:'MAX',color:'#ff0000'}]
    customSmColorConfigList: [],
    // 是否将帖子中的绯月其它域名的链接修改为当前域名，true：开启；false：关闭
    modifyKfOtherDomainEnabled: true,
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
    // 是否开启绯月表情增强插件（仅在miaola.info域名下生效），true：开启；false：关闭
    kfSmileEnhanceExtensionEnabled: false,

    // 默认的消息显示时间（秒），设置为-1表示永久显示
    defShowMsgDuration: -1,
    // 是否禁用jQuery的动画效果（推荐在配置较差的机器上使用），true：开启；false：关闭
    animationEffectOffEnabled: false,
    // 在页面上方显示搜索对话框的链接，true：开启；false：关闭
    showSearchLinkEnabled: true,
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
    // 自定义脚本列表
    customScriptList: [],
    // 在脚本开始时执行的自定义脚本内容（已废弃）
    customScriptStartContent: '',
    // 在脚本结束时执行的自定义脚本内容（已废弃）
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

    // 日志保存天数
    logSaveDays: 30,
    // 日志内容的排序方式，time：按时间顺序排序；type：按日志类别排序
    logSortType: 'time',
    // 日志统计范围类型，current：显示当天统计结果；custom：显示距该日N天内的统计结果；all：显示全部统计结果
    logStatType: 'current',
    // 显示距该日N天内的统计结果（用于日志统计范围）
    logStatDays: 7,

    // 是否自动更换ID颜色，true：开启；false：关闭
    autoChangeIdColorEnabled: false,
    // 自动更换ID颜色的更换顺序类型，random：随机；sequence：顺序
    autoChangeIdColorType: 'random',
    // 自动更换ID颜色的时间间隔（小时）
    autoChangeIdColorInterval: 24,
    // 是否从当前所有可用的ID颜色中进行更换，true：开启；false：关闭
    changeAllAvailableIdColorEnabled: true,
    // 自定义自动更换ID颜色的颜色ID列表，例：[1,8,13,20]
    customAutoChangeIdColorList: [],

    // 是否延长道具批量操作的时间间隔，以模拟手动使用和恢复道具，true：开启；false：关闭
    simulateManualHandleItemEnabled: false,

    // 争夺每层分配点数列表
    lootLevelPointList: {}
};

/**
 * 初始化
 */
const init = exports.init = function () {
    _Info2.default.w.Config = $.extend(true, {}, Config);
    if (typeof GM_getValue !== 'undefined') {
        _Info2.default.storageType = GM_getValue('StorageType');
        if (_Info2.default.storageType !== 'ByUid' && _Info2.default.storageType !== 'Global') _Info2.default.storageType = 'Default';
    }
    read();
};

/**
 * 读取设置
 */
const read = exports.read = function () {
    let options = null;
    if (_Info2.default.storageType === 'ByUid') options = GM_getValue(name + '_' + _Info2.default.uid);else if (_Info2.default.storageType === 'Global') options = GM_getValue(name);else options = localStorage.getItem(name);
    if (!options) return;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return;
    }
    if (!options || $.type(options) !== 'object' || $.isEmptyObject(options)) return;
    options = normalize(options);
    _Info2.default.w.Config = $.extend(true, {}, Config, options);
};

/**
 * 写入设置
 */
const write = exports.write = function () {
    let options = Util.getDifferenceSetOfObject(Config, _Info2.default.w.Config);
    if (_Info2.default.storageType === 'ByUid') GM_setValue(name + '_' + _Info2.default.uid, JSON.stringify(options));else if (_Info2.default.storageType === 'Global') GM_setValue(name, JSON.stringify(options));else localStorage.setItem(name, JSON.stringify(options));
};

/**
 * 清空设置
 */
const clear = exports.clear = function () {
    if (_Info2.default.storageType === 'ByUid') GM_deleteValue(name + '_' + _Info2.default.uid);else if (_Info2.default.storageType === 'Global') GM_deleteValue(name);else localStorage.removeItem(name);
};

/**
 * 更改存储类型
 * @param {string} storageType 要更改的存储类型
 */
const changeStorageType = exports.changeStorageType = function (storageType) {
    let log = Log.read();
    let tmpLog = TmpLog.read();
    _Info2.default.storageType = storageType;
    if (typeof GM_setValue !== 'undefined') GM_setValue('StorageType', _Info2.default.storageType);
    if (!Util.deepEqual(Config, _Info2.default.w.Config) || !$.isEmptyObject(log)) {
        if (confirm('是否将助手设置和日志转移到对应存储类型中？（对应存储类型中的数据将被覆盖）')) {
            write();
            Log.write(log);
            TmpLog.write(tmpLog);
        }
    }
};

/**
 * 获取经过规范化的Config对象
 * @param {{}} options 待处理的Config对象
 * @returns {{}} 经过规范化的Config对象
 */
const normalize = exports.normalize = function (options) {
    let settings = {};
    if ($.type(options) !== 'object') return settings;
    if (typeof options.donationKfb === 'number') options.donationKfb = options.donationKfb.toString();
    for (let [key, value] of Util.entries(options)) {
        if (key in Config && $.type(value) === $.type(Config[key])) {
            settings[key] = value;
        }
    }
    return settings;
};

},{"./Const":6,"./Info":10,"./Log":12,"./TmpLog":21,"./Util":22}],5:[function(require,module,exports){
/* 设置对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showCommonImportOrExportConfigDialog = exports.show = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Func = require('./Func');

var Func = _interopRequireWildcard(_Func);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 显示设置对话框
 */
const show = exports.show = function () {
    const dialogName = 'pdConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    Func.run('ConfigDialog.show_before_');
    let html = `
<div class="pd_cfg_main">
  <div class="pd_cfg_nav">
    <a class="pd_btn_link" data-name="clearTmpData" title="清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）" href="#">清除临时数据</a>
    <a class="pd_btn_link" data-name="openRumCommandDialog" href="#">运行命令</a>
    <a class="pd_btn_link" data-name="openImportOrExportSettingDialog" href="#">导入/导出设置</a>
  </div>

  <div class="pd_cfg_panel" style="margin-bottom: 5px;">
    <fieldset>
      <legend>
        <label>
          <input name="autoRefreshEnabled" type="checkbox"> 定时模式
          <span class="pd_cfg_tips" title="可按时进行自动操作（包括捐款、自动更换ID颜色，需开启相关功能），只在论坛首页生效（不开启此模式的话只能在刷新页面后才会进行操作）">[?]</span>
        </label>
      </legend>
      <label>
        标题提示方案
        <select name="showRefreshModeTipsType">
          <option value="auto">停留一分钟后显示</option>
          <option value="always">总是显示</option>
          <option value="never">不显示</option>
        </select>
        <span class="pd_cfg_tips" title="在首页的网页标题上显示定时模式提示的方案">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label><input name="autoDonationEnabled" type="checkbox"> 自动KFB捐款</label>
      </legend>
      <label>
        KFB捐款额度
        <input name="donationKfb" maxlength="4" style="width: 32px;" type="text">
        <span class="pd_cfg_tips" title="取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前所持现金的百分比（最多不超过5000KFB），例：80%">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        在 <input name="donationAfterTime" maxlength="8" style="width: 55px;" type="text"> 之后捐款
        <span class="pd_cfg_tips" title="在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>首页相关</legend>
      <label>
        @提醒
        <select name="atTipsHandleType" style="width: 130px;">
          <option value="no_highlight">取消已读提醒高亮</option>
          <option value="no_highlight_extra">取消已读提醒高亮，并在无提醒时补上消息框</option>
          <option value="hide_box_1">不显示已读提醒的消息框</option>
          <option value="hide_box_2">永不显示消息框</option>
          <option value="default">保持默认</option>
          <option value="at_change_to_cao">将@改为艹(其他和方式2相同)</option>
        </select>
        <span class="pd_cfg_tips" title="对首页上的有人@你的消息框进行处理的方案">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="smLevelUpAlertEnabled" type="checkbox"> 神秘等级升级提醒
        <span class="pd_cfg_tips" title="在神秘等级升级后进行提醒，只在首页生效">[?]</span>
      </label><br>
      <label>
        <input name="fixedDepositDueAlertEnabled" type="checkbox"> 定期存款到期提醒
        <span class="pd_cfg_tips" title="在定时存款到期时进行提醒，只在首页生效">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="smRankChangeAlertEnabled" type="checkbox"> 系数排名变化提醒
        <span class="pd_cfg_tips" title="在神秘系数排名发生变化时进行提醒，只在首页生效">[?]</span>
      </label><br>
      <label>
        <input name="homePageThreadFastGotoLinkEnabled" type="checkbox"> 在首页帖子旁显示跳转链接
        <span class="pd_cfg_tips" title="在首页帖子链接旁显示快速跳转至页末的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="showVipSurplusTimeEnabled" type="checkbox"> 显示VIP剩余时间
        <span class="pd_cfg_tips" title="在首页显示VIP剩余时间">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>帖子页面相关</legend>
      <label>
        帖子每页楼层数量
        <select name="perPageFloorNum">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <span class="pd_cfg_tips" title="用于电梯直达和帖子页数快捷链接功能，如果修改了KF设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        帖子内容字体大小 <input name="threadContentFontSize" maxlength="2" style="width: 20px;" type="text"> px
        <span class="pd_cfg_tips" title="帖子内容字体大小，留空表示使用默认大小，推荐值：14">[?]</span>
      </label><br>
      <label>
        <input name="adjustThreadContentWidthEnabled" type="checkbox"> 调整帖子内容宽度
        <span class="pd_cfg_tips" title="调整帖子内容宽度，使其保持一致">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="turnPageViaKeyboardEnabled" type="checkbox"> 通过左右键翻页
        <span class="pd_cfg_tips" title="在帖子和搜索页面通过左右键进行翻页">[?]</span>
      </label><br>
      <label>
        <input name="autoChangeIdColorEnabled" type="checkbox" data-disabled="[data-name=openAutoChangeSmColorPage]"> 自动更换ID颜色
        <span class="pd_cfg_tips" title="可自动更换ID颜色，请点击详细设置前往相应页面进行自定义设置">[?]</span>
      </label>
      <a data-name="openAutoChangeSmColorPage" class="pd_cfg_ml" target="_blank" href="kf_growup.php">详细设置&raquo;</a><br>
      <label>
        自定义本人的神秘颜色 <input name="customMySmColor" maxlength="7" style="width: 50px;" type="text">
        <input style="margin-left: 0;" type="color" data-name="customMySmColorSelect">
        <span class="pd_cfg_tips" title="自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009cff，如无需求可留空">[?]</span>
      </label><br>
      <label>
        <input name="customSmColorEnabled" type="checkbox" data-disabled="[data-name=openCustomSmColorDialog]"> 自定义各等级神秘颜色
        <span class="pd_cfg_tips" title="自定义各等级神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），请点击详细设置自定义各等级颜色">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openCustomSmColorDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="userMemoEnabled" type="checkbox" data-disabled="[data-name=openUserMemoDialog]"> 显示用户备注
        <span class="pd_cfg_tips" title="显示用户的自定义备注，请点击详细设置自定义用户备注">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openUserMemoDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="modifyKfOtherDomainEnabled" type="checkbox"> 将绯月其它域名的链接修改为当前域名
        <span class="pd_cfg_tips" title="将帖子和短消息中的绯月其它域名的链接修改为当前域名">[?]</span>
      </label><br>
      <label>
        <input name="multiQuoteEnabled" type="checkbox"> 开启多重引用功能
        <span class="pd_cfg_tips" title="在帖子页面开启多重回复和多重引用功能">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="parseMediaTagEnabled" type="checkbox"> 解析多媒体标签
        <span class="pd_cfg_tips" title="在帖子页面解析HTML5多媒体标签，详见【常见问题12】">[?]</span>
      </label><br>
      <label>
        <input name="batchBuyThreadEnabled" type="checkbox"> 开启批量购买帖子功能
        <span class="pd_cfg_tips" title="在帖子页面开启批量购买帖子的功能">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="buyThreadViaAjaxEnabled" type="checkbox"> 使用Ajax购买帖子
        <span class="pd_cfg_tips" title="使用Ajax的方式购买帖子，购买时页面不会跳转">[?]</span>
      </label><br>
      <label>
        <input name="showSelfRatingLinkEnabled" type="checkbox"> 显示自助评分链接
        <span class="pd_cfg_tips" title="在符合条件的帖子页面显示自助评分的链接（仅限自助评分测试人员使用）">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="kfSmileEnhanceExtensionEnabled" type="checkbox" ${ _Info2.default.isInMiaolaDomain ? '' : 'disabled' }> 开启绯月表情增强插件
        <span class="pd_cfg_tips" title="在发帖框上显示绯月表情增强插件（仅在miaola.info域名下生效），该插件由eddie32开发">[?]</span>
      </label>
    </fieldset>
  </div>

  <div class="pd_cfg_panel">
    <fieldset>
      <legend>版块页面相关</legend>
      <label>
        <input name="showFastGotoThreadPageEnabled" type="checkbox" data-disabled="[name=maxFastGotoThreadPageNum]"> 显示帖子页数快捷链接
        <span class="pd_cfg_tips" title="在版块页面中显示帖子页数快捷链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        页数链接最大数量 <input name="maxFastGotoThreadPageNum" style="width: 25px;" maxlength="4" type="text">
        <span class="pd_cfg_tips" title="在帖子页数快捷链接中显示页数链接的最大数量">[?]</span>
      </label><br>
      <label>
        <input name="highlightNewPostEnabled" type="checkbox"> 高亮今日的新帖
        <span class="pd_cfg_tips" title="在版块页面中高亮今日新发表帖子的发表时间">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>其它设置</legend>
      <label class="pd_highlight">
        存储类型
        <select data-name="storageType">
          <option value="Default">默认</option>
          <option value="ByUid">按uid</option>
          <option value="Global">全局</option>
        </select>
        <span class="pd_cfg_tips" title="助手设置和日志的存储方式，详情参见【常见问题1】">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        浏览器类型
        <select name="browseType">
          <option value="auto">自动检测</option>
          <option value="desktop">桌面版</option>
          <option value="mobile">移动版</option>
        </select>
        <span class="pd_cfg_tips" title="用于在KFOL助手上判断浏览器的类型，一般使用自动检测即可；
如果当前浏览器与自动检测的类型不相符（移动版会在设置界面标题上显示“For Mobile”的字样），请手动设置为正确的类型">[?]</span>
      </label><br>
      <label>
        <input name="showSearchLinkEnabled" type="checkbox"> 显示搜索链接
        <span class="pd_cfg_tips" title="在页面上方显示搜索对话框的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="animationEffectOffEnabled" type="checkbox"> 禁用动画效果
        <span class="pd_cfg_tips" title="禁用jQuery的动画效果（推荐在配置较差的机器上使用）">[?]</span>
      </label><br>
      <label>
        默认的消息显示时间 <input name="defShowMsgDuration" maxlength="5" style="width: 30px;" type="text"> 秒
        <span class="pd_cfg_tips" title="默认的消息显示时间（秒），设置为-1表示永久显示，例：15">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        日志保存天数 <input name="logSaveDays" maxlength="3" style="width: 25px;" type="text">
        <span class="pd_cfg_tips" title="默认值：${ _Config.Config.logSaveDays }">[?]</span>
      </label><br>
      <label>
        <input name="addSideBarFastNavEnabled" type="checkbox"> 为侧边栏添加快捷导航
        <span class="pd_cfg_tips" title="为侧边栏添加快捷导航的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="modifySideBarEnabled" type="checkbox"> 将侧边栏修改为平铺样式
        <span class="pd_cfg_tips" title="将侧边栏修改为和手机相同的平铺样式">[?]</span>
      </label><br>
      <label>
        <input name="customCssEnabled" type="checkbox" data-disabled="[data-name=openCustomCssDialog]"> 添加自定义CSS
        <span class="pd_cfg_tips" title="为页面添加自定义的CSS内容，请点击详细设置填入自定义的CSS内容">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openCustomCssDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="customScriptEnabled" type="checkbox" data-disabled="[data-name=openCustomScriptDialog]"> 执行自定义脚本
        <span class="pd_cfg_tips" title="执行自定义的javascript脚本，请点击详细设置填入自定义的脚本内容">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openCustomScriptDialog" href="#">详细设置&raquo;</a>
    </fieldset>
    <fieldset>
      <legend>关注和屏蔽</legend>
      <label>
        <input name="followUserEnabled" type="checkbox" data-disabled="[data-name=openFollowUserDialog]"> 关注用户
        <span class="pd_cfg_tips" title="开启关注用户的功能，所关注的用户将被加注记号，请点击详细设置管理关注用户">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openFollowUserDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="blockUserEnabled" type="checkbox" data-disabled="[data-name=openBlockUserDialog]"> 屏蔽用户
        <span class="pd_cfg_tips" title="开启屏蔽用户的功能，你将看不见所屏蔽用户的发言，请点击详细设置管理屏蔽用户">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openBlockUserDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="blockThreadEnabled" type="checkbox" data-disabled="[data-name=openBlockThreadDialog]"> 屏蔽帖子
        <span class="pd_cfg_tips" title="开启屏蔽标题包含指定关键字的帖子的功能，请点击详细设置管理屏蔽关键字">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openBlockThreadDialog" href="#">详细设置&raquo;</a><br>
    </fieldset>
    <fieldset>
      <legend>
        <label>
          <input name="autoSaveCurrentDepositEnabled" type="checkbox"> 自动活期存款
          <span class="pd_cfg_tips" title="在当前收入满足指定额度之后自动将指定数额存入活期存款中，只会在首页触发">[?]</span>
        </label>
      </legend>
      <label>
        在当前收入已满 <input name="saveCurrentDepositAfterKfb" maxlength="10" style="width: 45px;" type="text"> KFB之后
        <span class="pd_cfg_tips" title="在当前收入已满指定KFB额度之后自动进行活期存款，例：1000">[?]</span>
      </label><br>
      <label>
        将 <input name="saveCurrentDepositKfb" maxlength="10" style="width: 45px;" type="text"> KFB存入活期存款
        <span class="pd_cfg_tips" title="将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800">[?]</span>
      </label>
    </fieldset>
  </div>
</div>

<div class="pd_cfg_btns">
  <span class="pd_cfg_about">
    <a target="_blank" href="read.php?tid=508450">By 喵拉布丁</a>
    <i style="color: #666; font-style: normal;">(V${ _Info2.default.version })</i>
    <a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">[常见问题]</a>
  </span>
  <button name="ok">确定</button>
  <button name="cancel">取消</button>
  <button name="default">默认值</button>
</div>`;
    let $dialog = Dialog.create(dialogName, 'KFOL助手设置' + (_Info2.default.isMobile ? ' (For Mobile)' : ''), html);

    $dialog.find('[name="cancel"]').click(() => Dialog.close(dialogName)).end().find('[name="default"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否重置所有设置？')) {
            (0, _Config.clear)();
            alert('设置已重置');
            location.reload();
        }
    }).end().find('[data-name="clearTmpData"]').click(function (e) {
        e.preventDefault();
        let type = prompt('可清除与助手有关的Cookies和本地临时数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地临时数据', 0);
        if (type === null) return;
        type = parseInt(type);
        if (!isNaN(type) && type >= 0) {
            clearTmpData(type);
            alert('缓存已清除');
        }
    });

    $dialog.on('click', 'a[data-name^="open"][href="#"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        let name = $this.data('name');
        if (name === 'openRumCommandDialog') showRunCommandDialog();
        if (name === 'openImportOrExportSettingDialog') showImportOrExportSettingDialog();
        if (name === 'openCustomSmColorDialog') showCustomSmColorDialog();else if (name === 'openUserMemoDialog') showUserMemoDialog();else if (name === 'openCustomCssDialog') showCustomCssDialog();else if (name === 'openCustomScriptDialog') Script.showDialog();else if (name === 'openFollowUserDialog') showFollowUserDialog();else if (name === 'openBlockUserDialog') showBlockUserDialog();else if (name === 'openBlockThreadDialog') showBlockThreadDialog();
    }).end().find('[data-name="customMySmColorSelect"]').change(function () {
        $dialog.find('[name="customMySmColor"]').val($(this).val().toString().toLowerCase());
    }).end().find('[name="customMySmColor"]').change(function () {
        let color = $.trim($(this).val());
        if (/^#[0-9a-fA-F]{6}$/.test(color)) $dialog.find('[data-name="customMySmColorSelect"]').val(color.toLowerCase());
    });

    setMainConfigValue($dialog);
    $dialog.submit(function (e) {
        e.preventDefault();
        $('.pd_cfg_btns > button:first').click();
    }).end().find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        if (!verifyMainConfig($dialog)) return;
        let oriAutoRefreshEnabled = Config.autoRefreshEnabled;
        (0, _Config.read)();
        let options = getMainConfigValue($dialog);
        options = (0, _Config.normalize)(options);
        $.extend(Config, options);
        (0, _Config.write)();
        let storageType = $dialog.find('[data-name="storageType"]').val();
        if (storageType !== _Info2.default.storageType) {
            if (!confirm('是否修改存储类型？')) return;
            (0, _Config.changeStorageType)(storageType);
            alert('存储类型已修改');
            location.reload();
            return;
        }
        Dialog.close(dialogName);
        if (oriAutoRefreshEnabled !== options.autoRefreshEnabled) {
            if (confirm('你已修改了定时模式的设置，需要刷新页面才能生效，是否立即刷新？')) {
                location.reload();
            }
        }
    });

    Dialog.show(dialogName);
    $dialog.find('a:first').focus();
    Func.run('ConfigDialog.show_after_');
};

/**
 * 设置主对话框中的字段值
 * @param {jQuery} $dialog 助手设置对话框对象
 */
const setMainConfigValue = function ($dialog) {
    $dialog.find('input[name], select[name]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') $this.prop('checked', Config[name] === true);else $this.val(Config[name]);
        }
    });
    $dialog.find('[name="threadContentFontSize"]').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
    $dialog.find('[data-name="customMySmColorSelect"]').val(Config.customMySmColor);

    $dialog.find('[data-name="storageType"]').val(_Info2.default.storageType);
    if (typeof GM_getValue === 'undefined') $dialog.find('[data-name="storageType"] > option:gt(0)').prop('disabled', true);
};

/**
 * 获取主对话框中字段值的Config对象
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {{}} 字段值的Config对象
 */
const getMainConfigValue = function ($dialog) {
    let options = {};
    $dialog.find('input[name], select[name]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') options[name] = Boolean($this.prop('checked'));else if (typeof Config[name] === 'number') options[name] = parseInt($this.val());else options[name] = $.trim($this.val());
        }
    });
    return options;
};

/**
 * 验证主对话框设置是否正确
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {boolean} 是否验证通过
 */
const verifyMainConfig = function ($dialog) {
    let $txtDonationKfb = $dialog.find('[name="donationKfb"]');
    let donationKfb = $.trim($txtDonationKfb.val());
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
    } else {
        if (!$.isNumeric(donationKfb)) {
            alert('KFB捐款额度格式不正确');
            $txtDonationKfb.select();
            $txtDonationKfb.focus();
            return false;
        }
        if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > _Const2.default.maxDonationKfb) {
            alert(`KFB捐款额度的取值范围在1-${ _Const2.default.maxDonationKfb }之间`);
            $txtDonationKfb.select();
            $txtDonationKfb.focus();
            return false;
        }
    }

    let $txtDonationAfterTime = $dialog.find('[name="donationAfterTime"]');
    let donationAfterTime = $.trim($txtDonationAfterTime.val());
    if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(donationAfterTime)) {
        alert('在指定时间之后捐款格式不正确');
        $txtDonationAfterTime.select();
        $txtDonationAfterTime.focus();
        return false;
    }

    let $txtMaxFastGotoThreadPageNum = $dialog.find('[name="maxFastGotoThreadPageNum"]');
    let maxFastGotoThreadPageNum = $.trim($txtMaxFastGotoThreadPageNum.val());
    if (!$.isNumeric(maxFastGotoThreadPageNum) || parseInt(maxFastGotoThreadPageNum) <= 0) {
        alert('页数链接最大数量格式不正确');
        $txtMaxFastGotoThreadPageNum.select();
        $txtMaxFastGotoThreadPageNum.focus();
        return false;
    }

    let $txtThreadContentFontSize = $dialog.find('[name="threadContentFontSize"]');
    let threadContentFontSize = $.trim($txtThreadContentFontSize.val());
    if (threadContentFontSize && (isNaN(parseInt(threadContentFontSize)) || parseInt(threadContentFontSize) < 0)) {
        alert('帖子内容字体大小格式不正确');
        $txtThreadContentFontSize.select();
        $txtThreadContentFontSize.focus();
        return false;
    }

    let $txtCustomMySmColor = $dialog.find('[name="customMySmColor"]');
    let customMySmColor = $.trim($txtCustomMySmColor.val());
    if (customMySmColor && !/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
        alert('自定义本人的神秘颜色格式不正确，例：#009cff');
        $txtCustomMySmColor.select();
        $txtCustomMySmColor.focus();
        return false;
    }

    let $txtDefShowMsgDuration = $dialog.find('[name="defShowMsgDuration"]');
    let defShowMsgDuration = $.trim($txtDefShowMsgDuration.val());
    if (!$.isNumeric(defShowMsgDuration) || parseInt(defShowMsgDuration) < -1) {
        alert('默认的消息显示时间格式不正确');
        $txtDefShowMsgDuration.select();
        $txtDefShowMsgDuration.focus();
        return false;
    }

    let $txtLogSaveDays = $dialog.find('[name="logSaveDays"]');
    let logSaveDays = $.trim($txtLogSaveDays.val());
    if (!$.isNumeric(logSaveDays) || parseInt(logSaveDays) < 1) {
        alert('日志保存天数格式不正确');
        $txtLogSaveDays.select();
        $txtLogSaveDays.focus();
        return false;
    }

    let $txtSaveCurrentDepositAfterKfb = $dialog.find('[name="saveCurrentDepositAfterKfb"]');
    let $txtSaveCurrentDepositKfb = $dialog.find('[name="saveCurrentDepositKfb"]');
    let saveCurrentDepositAfterKfb = parseInt($txtSaveCurrentDepositAfterKfb.val());
    let saveCurrentDepositKfb = parseInt($txtSaveCurrentDepositKfb.val());
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
};

/**
 * 清除临时数据
 * @param {number} type 清除类别，0：全部清除；1：清除Cookies；2：清除本地临时数据
 */
const clearTmpData = function (type = 0) {
    if (type === 0 || type === 1) {
        for (let key in _Const2.default) {
            if (/CookieName$/.test(key)) {
                Util.deleteCookie(_Const2.default[key]);
            }
        }
    }
    if (type === 0 || type === 2) {
        TmpLog.clear();
        localStorage.removeItem(_Const2.default.multiQuoteStorageName);
    }
};

/**
 * 显示运行命令对话框
 */
const showRunCommandDialog = function () {
    const dialogName = 'pdRunCommandDialog';
    if ($('#' + dialogName).length > 0) return;
    Dialog.close('pdConfigDialog');
    let html = `
<div class="pd_cfg_main">
  <div style="margin: 5px 0;">
    运行命令快捷键：<b>Ctrl+Enter</b>；清除命令快捷键：<b>Ctrl+退格键</b><br>
    按<b>F12键</b>可打开浏览器控制台查看消息（需切换至控制台或Console标签）
  </div>
  <textarea name="cmd" wrap="off" style="width: 750px; height: 300px; white-space: pre;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button>运行</button> <button>清除</button> <button>关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '运行命令', html);
    let $cmd = $dialog.find('[name="cmd"]');
    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        let content = $cmd.val();
        if (content) Script.runCmd(content, true);
    }).next('button').click(function (e) {
        e.preventDefault();
        $cmd.val('').focus();
    }).next('button').click(() => Dialog.close(dialogName));
    Dialog.show(dialogName);
    $cmd.keyup(function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            $dialog.find('.pd_cfg_btns > button:first').click();
        } else if (e.ctrlKey && e.keyCode === 8) {
            $dialog.find('.pd_cfg_btns > button:eq(1)').click();
        }
    }).focus();
};

/**
 * 显示导入或导出设置对话框
 */
const showImportOrExportSettingDialog = function () {
    const dialogName = 'pdImOrExSettingDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <div>
    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br>
    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可
  </div>
  <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button>保存</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '导入或导出设置', html);
    let $setting = $dialog.find('[name="setting"]');
    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        let options = $.trim($setting.val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        } catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || $.type(options) !== 'object') {
            alert('设置有错误');
            return;
        }
        options = (0, _Config.normalize)(options);
        _Info2.default.w.Config = $.extend(true, {}, _Config.Config, options);
        (0, _Config.write)();
        alert('设置已导入');
        location.reload();
    }).next('button').click(() => Dialog.close(dialogName));
    Dialog.show(dialogName);
    $setting.val(JSON.stringify(Util.getDifferenceSetOfObject(_Config.Config, Config))).select();
};

/**
 * 显示自定义各等级神秘颜色设置对话框
 */
const showCustomSmColorDialog = function () {
    const dialogName = 'pdCustomSmColorDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="border-bottom: 1px solid #9191ff; margin-bottom: 7px; padding-bottom: 5px;">
    <strong>
      示例（<a target="_blank" href="http://www.35ui.cn/jsnote/peise.html">常用配色表</a> / 
      <a target="_blank" href="read.php?tid=488016">配色方案收集贴</a>）：
    </strong><br>
    <b>等级范围：</b>4-4 <b>颜色：</b><span style="color: #0000ff;">#0000ff</span><br>
    <b>等级范围：</b>10-99 <b>颜色：</b><span style="color: #5ad465;">#5ad465</span><br>
    <b>等级范围：</b>5000-MAX <b>颜色：</b><span style="color: #ff0000;">#ff0000</span>
  </div>
  <ul data-name="smColorList"></ul>
  <div style="margin-top: 5px;" data-name="customSmColorAddBtns">
    <a class="pd_btn_link" data-action="addOne" href="#">增加1个</a>
    <a class="pd_btn_link" data-action="addFive" href="#">增加5个</a>
    <a class="pd_btn_link" data-action="clear" href="#">清除所有</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a href="#">导入/导出配色方案</a></span>
  <button>确定</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义各等级神秘颜色', html, 'min-width: 327px;');
    let $customSmColorList = $dialog.find('[data-name="smColorList"]');
    $dialog.find('.pd_cfg_btns > button:last').click(() => Dialog.close(dialogName));

    $customSmColorList.on('change', '[name="color"]', function () {
        let $this = $(this);
        let color = $.trim($this.val());
        if (/^#[0-9a-fA-F]{6}$/.test(color)) {
            $this.next('[type="color"]').val(color.toLowerCase());
        }
    }).on('change', '[type="color"]', function () {
        let $this = $(this);
        $this.prev('[type="text"]').val($this.val().toString().toLowerCase());
    }).on('click', 'a', function (e) {
        e.preventDefault();
        $(this).closest('li').remove();
    });

    /**
     * 获取每列神秘颜色的HTML内容
     * @param {string} min 最小神秘等级
     * @param {string} max 最大神秘等级
     * @param {string} color 颜色
     * @returns {string} 每列神秘颜色的HTML内容
     */
    const getSmColorLineHtml = function ({ min = '', max = '', color = '' } = {}) {
        return `
<li>
  <label>等级范围 <input name="min" type="text" maxlength="5" style="width: 30px;" value="${ min }"></label>
  <label>- <input name="max" type="text" maxlength="5" style="width: 30px;" value="${ max }"></label>
  <label>
    &nbsp;颜色 <input name="color" type="text" maxlength="7" style="width: 50px;" value="${ color }">
    <input style="margin-left: 0;" type="color" value="${ color }">
  </label>
  <a href="#">删除</a>
</li>`;
    };

    $dialog.find('[data-action="addOne"], [data-action="addFive"]').click(function (e) {
        e.preventDefault();
        let num = 1;
        if ($(this).is('[data-action="addFive"]')) num = 5;
        for (let i = 1; i <= num; i++) {
            $customSmColorList.append(getSmColorLineHtml());
        }
        Dialog.show(dialogName);
    }).end().find('[data-action="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有颜色？')) {
            $customSmColorList.empty();
            Dialog.show(dialogName);
        }
    });

    $dialog.find('.pd_cfg_about > a').click(function (e) {
        e.preventDefault();
        showImportOrExportSmColorConfigDialog();
    });

    let smColorHtml = '';
    for (let data of Config.customSmColorConfigList) {
        smColorHtml += getSmColorLineHtml(data);
    }
    $customSmColorList.html(smColorHtml);

    $dialog.submit(function (e) {
        e.preventDefault();
        let list = [];
        let verification = true;
        $customSmColorList.find('li').each(function () {
            let $this = $(this);
            let $txtSmMin = $this.find('[name="min"]');
            let min = $.trim($txtSmMin.val()).toUpperCase();
            if (min === '') return;
            if (!/^(-?\d+|MAX)$/i.test(min)) {
                verification = false;
                $txtSmMin.select();
                $txtSmMin.focus();
                alert('等级范围格式不正确');
                return false;
            }
            let $txtSmMax = $this.find('[name="max"]');
            let max = $.trim($txtSmMax.val()).toUpperCase();
            if (max === '') return;
            if (!/^(-?\d+|MAX)$/i.test(max)) {
                verification = false;
                $txtSmMax.select();
                $txtSmMax.focus();
                alert('等级范围格式不正确');
                return false;
            }
            if (Util.compareSmLevel(max, min) < 0) {
                verification = false;
                $txtSmMin.select();
                $txtSmMin.focus();
                alert('等级范围格式不正确');
                return false;
            }
            let $txtSmColor = $this.find('[name="color"]');
            let color = $.trim($txtSmColor.val()).toLowerCase();
            if (color === '') return;
            if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
                verification = false;
                $txtSmColor.select();
                $txtSmColor.focus();
                alert('颜色格式不正确');
                return false;
            }
            list.push({ min, max, color });
        });
        if (verification) {
            list.sort((a, b) => Util.compareSmLevel(a.min, b.min) > 0);
            Config.customSmColorConfigList = list;
            (0, _Config.write)();
            Dialog.close(dialogName);
        }
    });

    Dialog.show(dialogName);
    if ($customSmColorList.find('input').length > 0) $customSmColorList.find('input:first').focus();else $dialog.find('[data-name="customSmColorAddBtns"] > a:first').focus();
};

/**
 * 显示导入或导出配色方案对话框
 */
const showImportOrExportSmColorConfigDialog = function () {
    const dialogName = 'pdImOrExSmColorConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <div>
    <strong>导入配色方案：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br>
    <strong>导出配色方案：</strong>复制文本框里的内容并粘贴到文本文件里即可
  </div>
  <textarea name="smColorConfig" style="width: 420px; height: 200px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a></span>
  <button>保存</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '导入或导出配色方案', html);
    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        let options = $.trim($dialog.find('[name="smColorConfig"]').val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        } catch (ex) {
            alert('配色方案有错误');
            return;
        }
        if (!options || !Array.isArray(options)) {
            alert('配色方案有错误');
            return;
        }
        Config.customSmColorConfigList = options;
        (0, _Config.write)();
        alert('配色方案已导入');
        location.reload();
    }).next('button').click(() => Dialog.close(dialogName));
    Dialog.show(dialogName);
    $dialog.find('[name="smColorConfig"]').val(JSON.stringify(Config.customSmColorConfigList)).select();
};

/**
 * 显示自定义CSS对话框
 */
const showCustomCssDialog = function () {
    const dialogName = 'pdCustomCssDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <strong>自定义CSS内容：</strong><br>
  <textarea name="customCssContent" wrap="off" style="width: 750px; height: 400px; white-space: pre;"></textarea>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500969">CSS规则收集贴</a></span>
  <button>确定</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义CSS', html);
    let $content = $dialog.find('[name="customCssContent"]');
    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        Config.customCssContent = $.trim($content.val());
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).next('button').click(() => Dialog.close(dialogName));
    $content.val(Config.customCssContent);
    Dialog.show(dialogName);
    $content.focus();
};

/**
 * 显示用户备注对话框
 */
const showUserMemoDialog = function () {
    const dialogName = 'pdUserMemoDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  按照“用户名:备注”的格式（注意是英文冒号），每行一个<br>
  <textarea name="userMemoList" wrap="off" style="width: 320px; height: 400px; white-space: pre;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button>确定</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '用户备注', html);
    let $userMemoList = $dialog.find('[name="userMemoList"]');
    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        let content = $.trim($userMemoList.val());
        Config.userMemoList = {};
        for (let line of content.split('\n')) {
            line = $.trim(line);
            if (!line) continue;
            if (!/.+?:.+/.test(line)) {
                alert('用户备注格式不正确');
                $userMemoList.focus();
                return;
            }
            let [user, memo = ''] = line.split(':');
            if (!memo) continue;
            Config.userMemoList[user.trim()] = memo.trim();
        }
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).next('button').click(() => Dialog.close(dialogName));
    let content = '';
    for (let [user, memo] of Util.entries(Config.userMemoList)) {
        content += `${ user }:${ memo }\n`;
    }
    $userMemoList.val(content);
    Dialog.show(dialogName);
    $userMemoList.focus();
};

/**
 * 显示关注用户对话框
 */
const showFollowUserDialog = function () {
    const dialogName = 'pdFollowUserDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px;">
    <label>
      <input name="highlightFollowUserThreadInHpEnabled" type="checkbox"> 高亮所关注用户的首页帖子链接
      <span class="pd_cfg_tips" title="高亮所关注用户在首页下的帖子链接">[?]</span>
    </label><br>
    <label>
      <input name="highlightFollowUserThreadLinkEnabled" type="checkbox"> 高亮所关注用户的帖子链接
      <span class="pd_cfg_tips" title="高亮所关注用户在版块页面下的帖子链接">[?]</span>
    </label><br>
  </div>
  <ul data-name="followUserList" style="margin-top: 5px; min-width: 274px; line-height: 24px;"></ul>
  <div data-name="followUserBtns" style="margin-top: 5px;">
    <div style="display: inline-block;">
      <a class="pd_btn_link" href="#">全选</a>
      <a class="pd_btn_link" href="#">反选</a>
    </div>
    <div style="float: right;">
      <a class="pd_btn_link" href="#">删除</a>
    </div>
  </div>
  <div style="margin-top: 5px;" title="添加多个用户请用英文逗号分隔">
    <input data-name="addFollowUser" style="width: 200px;" type="text">
    <a class="pd_btn_link" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a href="#">导入/导出关注用户</a></span>
  <button>确定</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '关注用户', html);
    let $followUserList = $dialog.find('[data-name="followUserList"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        $dialog.find('.pd_cfg_btns > button:first').click();
    }).find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        Config.highlightFollowUserThreadInHPEnabled = $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked');
        Config.highlightFollowUserThreadLinkEnabled = $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked');
        Config.followUserList = [];
        $followUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[type="text"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                Config.followUserList.push({ name });
            }
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).end().find('.pd_cfg_btns > button:last').click(() => Dialog.close(dialogName));

    $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
    $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked', Config.highlightFollowUserThreadLinkEnabled);

    /**
     * 添加关注用户
     * @param {string} name 用户名
     */
    const addFollowUser = function (name) {
        $(`
<li>
  <input type="checkbox">
  <input type="text" style="width: 178px; margin-left: 5px;" maxlength="15" value="${ name }">
  <a class="pd_btn_link" href="#">删除</a>
</li>
`).appendTo($followUserList);
    };

    for (let user of Config.followUserList) {
        addFollowUser(user.name);
    }

    $followUserList.on('click', 'a', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="followUserBtns"]').find('a:first').click(function (e) {
        e.preventDefault();
        $followUserList.find('[type="checkbox"]').prop('checked', true);
    }).end().find('a:eq(1)').click(function (e) {
        e.preventDefault();
        $followUserList.find('[type="checkbox"]').each(function () {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    }).end().find('a:last').click(function (e) {
        e.preventDefault();
        let $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) {
            $checked.remove();
            Dialog.show(dialogName);
        }
    });

    $dialog.find('[data-name="addFollowUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next('a').click();
        }
    }).next('a').click(function (e) {
        e.preventDefault();
        for (let name of $.trim($dialog.find('[data-name="addFollowUser"]').val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                addFollowUser(name);
            }
        }
        $dialog.find('[data-name="addFollowUser"]').val('');
        Dialog.show(dialogName);
    });

    $dialog.find('.pd_cfg_about > a').click(function (e) {
        e.preventDefault();
        showCommonImportOrExportConfigDialog('followUser');
    });

    Dialog.show(dialogName);
    $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').focus();
};

/**
 * 显示屏蔽用户对话框
 */
const showBlockUserDialog = function () {
    const dialogName = 'pdBlockUserDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px; line-height: 24px;">
    <label>
      默认屏蔽类型
      <select name="blockUserDefaultType">
        <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
      </select>
    </label>
    <label class="pd_cfg_ml">
      <input name="blockUserAtTipsEnabled" type="checkbox">屏蔽@提醒 <span class="pd_cfg_tips" title="屏蔽被屏蔽用户的@提醒">[?]</span>
    </label><br>
    <label>版块屏蔽范围
      <select name="blockUserForumType">
        <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
      </select>
    </label><br>
    <label>版块ID列表
      <input name="blockUserFidList" type="text" style="width: 220px;"> 
      <span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span>
    </label>
  </div>
  <ul data-name="blockUserList" style="margin-top: 5px; min-width: 362px; line-height: 24px;"></ul>
  <div data-name="blockUserBtns" style="margin-top: 5px;">
    <div style="display: inline-block;"><a href="#">全选</a><a style="margin-left: 7px;" href="#">反选</a></div>
    <div style="float: right;">
      <a href="#">修改为</a>
      <select style="margin-left: 7px;">
        <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
      </select>
      <a style="margin-left: 7px;" href="#">删除</a>
    </div>
  </div>
  <div style="margin-top: 5px;" title="添加多个用户请用英文逗号分隔">
    <input name="addBlockUser" style="width: 200px;" type="text">
    <a style="margin-left: 7px;" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a href="#">导入/导出屏蔽用户</a></span>
  <button>确定</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '屏蔽用户', html);
    let $blockUserList = $dialog.find('[data-name="blockUserList"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        $dialog.find('.pd_cfg_btns > button:first').click();
    }).find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        Config.blockUserDefaultType = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        Config.blockUserAtTipsEnabled = $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked');
        Config.blockUserForumType = parseInt($dialog.find('[name="blockUserForumType"]').val());
        Config.blockUserFidList = [];
        for (let fid of $.trim($dialog.find('[name="blockUserFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) Config.blockUserFidList.push(fid);
        }
        Config.blockUserList = [];
        $blockUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('input[type="text"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                let type = parseInt($this.find('select').val());
                Config.blockUserList.push({ name, type });
            }
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).end().find('.pd_cfg_btns > button:last').click(() => Dialog.close(dialogName));

    $dialog.find('[name="blockUserDefaultType"]').val(Config.blockUserDefaultType);
    $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked', Config.blockUserAtTipsEnabled);
    $dialog.find('[name="blockUserForumType"]').val(Config.blockUserForumType);
    $dialog.find('[name="blockUserFidList"]').val(Config.blockUserFidList.join(','));

    /**
     * 添加屏蔽用户
     * @param {string} name 用户名
     * @param {number} type 屏蔽类型
     */
    const addBlockUser = function (name, type) {
        $(`
<li>
  <input type="checkbox">
  <input type="text" style="width: 150px; margin-left: 5px;" maxlength="15" value="${ name }">
  <select style="margin-left: 5px;">
    <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
  </select>
  <a style="margin-left: 7px;" href="#">删除</a>
</li>`).appendTo($blockUserList).find('select').val(type);
    };

    for (let user of Config.blockUserList) {
        addBlockUser(user.name, user.type);
    }

    $blockUserList.on('click', 'a', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="blockUserBtns"]').find('a:first').click(function (e) {
        e.preventDefault();
        $blockUserList.find('input[type="checkbox"]').prop('checked', true);
    }).end().find('a:eq(1)').click(function (e) {
        e.preventDefault();
        $blockUserList.find('input[type="checkbox"]').each(function () {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    }).end().find('a:eq(2)').click(function (e) {
        e.preventDefault();
        let value = $(this).next('select').val();
        $blockUserList.find('li:has(input[type="checkbox"]:checked) > select').val(value);
    }).end().find('a:last').click(function (e) {
        e.preventDefault();
        let $checked = $blockUserList.find('li:has(input[type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) {
            $checked.remove();
            Dialog.show(dialogName);
        }
    });

    $dialog.find('[name="addBlockUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next('a').click();
        }
    }).next('a').click(function (e) {
        e.preventDefault();
        let type = parseInt($('[name="blockUserDefaultType"]').val());
        for (let name of $.trim($dialog.find('[name="addBlockUser"]').val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                addBlockUser(name, type);
            }
        }
        $dialog.find('[name="addBlockUser"]').val('');
        Dialog.show(dialogName);
    });

    $dialog.find('[name="blockUserForumType"]').change(function () {
        $('[name="blockUserFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('.pd_cfg_about > a').click(function (e) {
        e.preventDefault();
        showCommonImportOrExportConfigDialog('blockUser');
    });

    Dialog.show(dialogName);
    $dialog.find('[name="blockUserForumType"]').triggerHandler('change');
    $dialog.find('[name="blockUserDefaultType"]').focus();
};

/**
 * 显示屏蔽帖子对话框
 */
const showBlockThreadDialog = function () {
    const dialogName = 'pdBlockThreadDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="border-bottom: 1px solid #9191ff; margin-bottom: 7px; padding-bottom: 5px;">
    标题关键字可使用普通字符串或正则表达式，正则表达式请使用/abc/的格式，例：/关键字A.*关键字B/i<br>
    用户名和版块ID为可选项（多个用户名或版块ID请用英文逗号分隔）<br>
    <label>
      默认版块屏蔽范围
      <select name="blockThreadDefForumType">
        <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
      </select>
    </label>
    <label style="margin-left: 5px;">默认版块ID列表 <input name="blockThreadDefFidList" type="text" style="width: 150px;"></label>
  </div>
  <table data-name="blockThreadList" style="line-height: 22px; text-align: center;">
    <tbody>
      <tr>
        <th style="width: 220px;">标题关键字(必填)</th>
        <th style="width: 62px;">屏蔽用户</th>
        <th style="width: 200px;">用户名 <span class="pd_cfg_tips" title="多个用户名请用英文逗号分隔">[?]</span></th>
        <th style="width: 62px;">屏蔽范围</th>
        <th style="width: 132px;">版块ID <span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span></th>
        <th style="width: 35px;"></th>
      </tr>
    </tbody>
  </table>
  <div data-name="blockThreadAddBtns" style="margin-top: 5px;">
    <a class="pd_btn_link" href="#">增加1个</a>
    <a class="pd_btn_link" href="#">增加5个</a>
    <a class="pd_btn_link" href="#">清除所有</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a href="#">导入/导出屏蔽帖子</a></span>
  <button>确定</button> <button>取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '屏蔽帖子', html, 'width: 768px;');
    let $blockThreadList = $dialog.find('[data-name="blockThreadList"]');

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    const verify = function () {
        let flag = true;
        $blockThreadList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            let $txtKeyWord = $this.find('td:first-child > input');
            let keyWord = $txtKeyWord.val();
            if ($.trim(keyWord) === '') return;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    eval(keyWord);
                } catch (ex) {
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
        Config.blockThreadDefForumType = parseInt($dialog.find('[name="blockThreadDefForumType"]').val());
        Config.blockThreadDefFidList = [];
        for (let fid of $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) Config.blockThreadDefFidList.push(fid);
        }
        Config.blockThreadList = [];
        $blockThreadList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            let keyWord = $this.find('td:first-child > input').val();
            if ($.trim(keyWord) === '') return;
            let newObj = { keyWord };

            let userType = parseInt($this.find('td:nth-child(2) > select').val());
            if (userType > 0) {
                let userList = [];
                for (let user of $.trim($this.find('td:nth-child(3) > input').val()).split(',')) {
                    user = $.trim(user);
                    if (user) userList.push(user);
                }
                if (userList.length > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = userList;
            }

            let fidType = parseInt($this.find('td:nth-child(4) > select').val());
            if (fidType > 0) {
                let fidList = [];
                for (let fid of $.trim($this.find('td:nth-child(5) > input').val()).split(',')) {
                    fid = parseInt(fid);
                    if (!isNaN(fid) && fid > 0) fidList.push(fid);
                }
                if (fidList.length > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = fidList;
            }
            Config.blockThreadList.push(newObj);
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).end().find('.pd_cfg_btns > button:last').click(() => Dialog.close(dialogName));

    $blockThreadList.on('change', 'select', function () {
        let $this = $(this);
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
    const addBlockThread = function (keyWord, userType, userList, fidType, fidList) {
        $(`
<tr>
  <td><input type="text" style="width: 208px;" value="${ keyWord }"></td>
  <td><select><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>
  <td><input type="text" style="width: 188px;" value="${ userList.join(',') }" ${ userType === 0 ? 'disabled' : '' }></td>
  <td><select><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>
  <td><input type="text" style="width: 120px;" value="${ fidList.join(',') }" ${ fidType === 0 ? 'disabled' : '' }></td>
  <td><a href="#">删除</a></td>
</tr>
`).appendTo($blockThreadList).find('td:nth-child(2) > select').val(userType).end().find('td:nth-child(4) > select').val(fidType);
    };

    for (let data of Config.blockThreadList) {
        let { keyWord, includeUser, excludeUser, includeFid, excludeFid } = data;
        let userType = 0;
        let userList = [];
        if (typeof includeUser !== 'undefined') {
            userType = 1;
            userList = includeUser;
        } else if (typeof excludeUser !== 'undefined') {
            userType = 2;
            userList = excludeUser;
        }

        let fidType = 0;
        let fidList = [];
        if (typeof includeFid !== 'undefined') {
            fidType = 1;
            fidList = includeFid;
        } else if (typeof excludeFid !== 'undefined') {
            fidType = 2;
            fidList = excludeFid;
        }
        addBlockThread(keyWord, userType, userList, fidType, fidList);
    }

    $dialog.find('[data-name="blockThreadAddBtns"]').find('a:lt(2)').click(function (e) {
        e.preventDefault();
        let num = 1;
        if ($(this).is('[data-name="blockThreadAddBtns"] > a:eq(1)')) num = 5;
        for (let i = 1; i <= num; i++) {
            addBlockThread('', 0, [], parseInt($dialog.find('[name="blockThreadDefForumType"]').val()), $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(','));
        }
        Dialog.show(dialogName);
    }).end().find('a:last').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有屏蔽关键字？')) {
            $blockThreadList.find('tbody > tr:gt(0)').remove();
            Dialog.show(dialogName);
        }
    });

    $dialog.find('[name="blockThreadDefForumType"]').change(function () {
        $dialog.find('[name="blockThreadDefFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('.pd_cfg_about > a').click(function (e) {
        e.preventDefault();
        showCommonImportOrExportConfigDialog('blockThread');
    });

    Dialog.show(dialogName);
    $dialog.find('[name="blockThreadDefForumType"]').val(Config.blockThreadDefForumType).focus().triggerHandler('change');
    $dialog.find('[name="blockThreadDefFidList"]').val(Config.blockThreadDefFidList.join(','));
};

/**
 * 显示通用的导入/导出设置对话框
 * @param {string} type 对话框类别，followUser：关注用户；blockUser：屏蔽用户；blockThread：屏蔽帖子；customScript：自定义脚本
 */
const showCommonImportOrExportConfigDialog = exports.showCommonImportOrExportConfigDialog = function (type) {
    const dialogName = 'pdCommonImOrExConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <div>
    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br>
    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可
  </div>
  <textarea name="commonConfig" style="width: 420px; height: 200px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button>保存</button> <button>取消</button>
</div>`;
    let title = '';
    switch (type) {
        case 'followUser':
            title = '关注用户';
            break;
        case 'blockUser':
            title = '屏蔽用户';
            break;
        case 'blockThread':
            title = '屏蔽帖子';
            break;
        case 'customScript':
            title = '自定义脚本';
            break;
        default:
            return;
    }
    let $dialog = Dialog.create(dialogName, `导入或导出${ title }`, html);

    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        let options = $.trim($dialog.find('[name="commonConfig"]').val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        } catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || !Array.isArray(options)) {
            alert('设置有错误');
            return;
        }
        switch (type) {
            case 'followUser':
                Config.followUserList = options;
                break;
            case 'blockUser':
                Config.blockUserList = options;
                break;
            case 'blockThread':
                Config.blockThreadList = options;
                break;
            case 'customScript':
                Config.customScriptList = options;
                break;
        }
        (0, _Config.write)();
        alert('设置已导入');
        location.reload();
    }).next('button').click(() => Dialog.close(dialogName));
    Dialog.show(dialogName);

    let options = null;
    switch (type) {
        case 'followUser':
            options = Config.followUserList;
            break;
        case 'blockUser':
            options = Config.blockUserList;
            break;
        case 'blockThread':
            options = Config.blockThreadList;
            break;
        case 'customScript':
            options = Config.customScriptList;
            break;
    }
    $dialog.find('[name="commonConfig"]').val(JSON.stringify(options)).select();
};

},{"./Config":4,"./Const":6,"./Dialog":7,"./Func":8,"./Info":10,"./Script":20,"./TmpLog":21,"./Util":22}],6:[function(require,module,exports){
/* 常量模块 */
'use strict';

// 通用存储数据名称前缀

Object.defineProperty(exports, "__esModule", {
    value: true
});
const storagePrefix = 'pd_';

/**
 * 常量类
 */
const Const = {
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
    specialAjaxInterval() {
        return Math.floor(Math.random() * 150) + 200;
    },
    // 循环使用道具中每轮第一次ajax请求的时间间隔（毫秒），可设置为函数来返回值
    cycleUseItemsFirstAjaxInterval() {
        return Math.floor(Math.random() * 250) + 2000;
    },
    // 购买帖子提醒的最低售价（KFB）
    minBuyThreadWarningSell: 6,
    // 统计回帖者名单最大能访问的帖子页数
    statRepliersMaxPage: 300,
    // 道具样品ID列表
    sampleItemIdList: new Map([['零时迷子的碎片', 2257935], ['被遗弃的告白信', 2005272], ['学校天台的钥匙', 2001303], ['TMA最新作压缩包', 1990834], ['LOLI的钱包', 1836588], ['棒棒糖', 1942370], ['蕾米莉亚同人漫画', 1000888], ['十六夜同人漫画', 1002668], ['档案室钥匙', 1013984], ['傲娇LOLI娇蛮音CD', 4621], ['整形优惠卷', 1003993], ['消逝之药', 1000306]]),
    // 定期存款到期期限（天）
    fixedDepositDueTime: 90,
    // 自助评分错标范围百分比
    ratingErrorSizePercent: 3,
    // 自定义侧边栏导航内容
    // 格式：'<li><a href="导航链接">导航项名称</a></li>'
    customSideBarContent: '',
    // 自定义侧边栏导航内容（手机平铺样式）
    // 格式：'<a href="导航链接1">导航项名称1</a> | <a href="导航链接2">导航项名称2</a><br>'，换行：'<br>'
    customTileSideBarContent: '',
    // 可进行自助评分的版块ID列表
    selfRatingFidList: [41, 67, 92, 127, 68],
    // 通用存储数据名称前缀
    storagePrefix: storagePrefix,
    // 存储多重引用数据的LocalStorage名称
    multiQuoteStorageName: storagePrefix + 'multiQuote',
    // 神秘等级升级提醒的临时日志名称
    smLevelUpTmpLogName: 'SmLevelUp',
    // 神秘系数排名变化提醒的临时日志名称
    smRankChangeTmpLogName: 'SmRankChange',
    // 定期存款到期时间的临时日志名称
    fixedDepositDueTmpLogName: 'FixedDepositDue',
    // 存储上一次自动更换ID颜色的临时日志名称
    prevAutoChangeIdColorTmpLogName: 'PrevAutoChangeIdColor',
    // 标记已进行KFB捐款的Cookie名称
    donationCookieName: 'donation',
    // 标记已去除首页已读at高亮提示的Cookie名称
    hideReadAtTipsCookieName: 'hideReadAtTips',
    // 存储之前已读的at提醒信息的Cookie名称
    prevReadAtTipsCookieName: 'prevReadAtTips',
    // 标记已进行定期存款到期提醒的Cookie名称
    fixedDepositDueAlertCookieName: 'fixedDepositDueAlert',
    // 存储VIP剩余时间的Cookie名称
    vipSurplusTimeCookieName: 'vipSurplusTime',
    // 标记已自动更换ID颜色的Cookie名称
    autoChangeIdColorCookieName: 'autoChangeIdColor',
    // 标记已检查过期日志的Cookie名称
    checkOverdueLogCookieName: 'checkOverdueLog'
};

exports.default = Const;

},{}],7:[function(require,module,exports){
/* 对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = exports.show = exports.create = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 创建对话框
 * @param {string} id 对话框ID
 * @param {string} title 对话框标题
 * @param {string} content 对话框内容
 * @param {string} style 对话框样式
 * @returns {jQuery} 对话框的jQuery对象
 */
const create = exports.create = function (id, title, content, style = '') {
    let html = `
<form>
<div class="pd_cfg_box" id="${ id }" style="${ style }">
  <h1>${ title }<span>&times;</span></h1>
  ${ content }
</div>
</form>`;
    let $dialog = $(html).appendTo('body');
    $dialog.on('click', '.pd_cfg_tips', function (e) {
        if (_Info2.default.isMobile) Public.showElementTitleTips(e, this.title);
        return false;
    }).on('click', 'a.pd_disabled_link', () => false).keydown(function (e) {
        if (e.keyCode === 27) {
            return close(id);
        }
    }).find('h1 > span').click(() => close(id)).end().find('legend [type="checkbox"]').click(function () {
        let $this = $(this);
        let checked = $this.prop('checked');
        if (Util.isOpera() || Util.isEdge()) $this.closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);else $this.closest('fieldset').prop('disabled', !checked);
    }).end().find('input[data-disabled]').click(function () {
        let $this = $(this);
        let checked = $this.prop('checked');
        $($this.data('disabled')).each(function () {
            let $this = $(this);
            if ($this.is('a')) {
                if (checked) $this.removeClass('pd_disabled_link');else $this.addClass('pd_disabled_link');
            } else {
                $this.prop('disabled', !checked);
            }
        });
    });
    if (!_Info2.default.isMobile) {
        $(window).on('resize.' + id, function () {
            show(id);
        });
    }
    return $dialog;
};

/**
 * 显示或调整对话框
 * @param {string} id 对话框ID
 */
const show = exports.show = function (id) {
    let $box = $('#' + id);
    if (!$box.length) return;
    $box.find('.pd_cfg_main').css('max-height', $(window).height() - 80).end().find('legend [type="checkbox"]').each(function () {
        $(this).triggerHandler('click');
    }).end().find('input[data-disabled]').each(function () {
        $(this).triggerHandler('click');
    });
    let boxWidth = $box.width(),
        windowWidth = $(window).width();
    let left = windowWidth / 2 - boxWidth / 2;
    if (left + boxWidth > windowWidth) left = windowWidth - boxWidth - 20;
    if (left < 0) left = 0;
    let top = $(window).height() / 2 - $box.height() / 2;
    if (top < 0) top = 0;
    $box.css({ top, left }).fadeIn('fast');
};

/**
 * 关闭对话框
 * @param {string} id 对话框ID
 * @returns {boolean} 返回false
 */
const close = exports.close = function (id) {
    $('#' + id).fadeOut('fast', function () {
        $(this).parent('form').remove();
    });
    if (!_Info2.default.isMobile) {
        $(window).off('resize.' + id);
    }
    return false;
};

},{"./Info":10,"./Public":18,"./Util":22}],8:[function(require,module,exports){
/* 自定义方法模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = exports.add = undefined;

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 自定义方法列表
const funcList = new Map();

/**
 * 添加自定义方法
 * @param {string} name 自定义方法名称
 * @param {function} func 自定义方法
 */
const add = exports.add = function (name, func) {
    if (!funcList.has(name)) funcList.set(name, []);
    funcList.get(name).push(func);
};

/**
 * 执行自定义方法
 * @param {string} name 自定义方法名称
 * @param {*} [data] 自定义方法参数
 */
const run = exports.run = function (name, data) {
    if (funcList.has(name)) {
        for (let func of funcList.get(name)) {
            if (typeof func === 'function') {
                try {
                    func(data);
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
    }
};

},{"./Script":20}],9:[function(require,module,exports){
/* 首页模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addSearchTypeSelectBoxInHomePage = exports.showVipSurplusTime = exports.addHomePageThreadFastGotoLink = exports.smRankChangeAlert = exports.smLevelUpAlert = exports.handleAtTips = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 处理首页有人@你的消息框
 */
const handleAtTips = exports.handleAtTips = function () {
    let type = Config.atTipsHandleType;
    if (type === 'default') return;
    let $atTips = $('a[href^="guanjianci.php?gjc="]');
    let noHighlight = () => $atTips.removeClass('indbox5').addClass('indbox6');
    let hideBox = () => $atTips.parent().next('div.line').addBack().remove();
    let handleBox = noHighlight;
    if (type === 'hide_box_1' || type === 'hide_box_2') handleBox = hideBox;
    if (['no_highlight', 'no_highlight_extra', 'hide_box_1', 'at_change_to_cao'].includes(type)) {
        if ($atTips.length > 0) {
            let cookieText = Util.getCookie(_Const2.default.hideReadAtTipsCookieName);
            let atTipsText = $.trim($atTips.text());
            let matches = /\d+日\d+时\d+分/.exec(atTipsText);
            if (matches) atTipsText = matches[0];
            if (cookieText && cookieText === atTipsText) {
                handleBox();
            } else {
                $atTips.click(function () {
                    let $this = $(this);
                    if ($this.data('disabled')) return;
                    let cookieText = Util.getCookie(_Const2.default.hideReadAtTipsCookieName);
                    if (!cookieText) {
                        let curDate = new Date().getDate().toString();
                        Util.setCookie(_Const2.default.prevReadAtTipsCookieName, curDate.padStart(2, '0') + '日00时00分');
                    } else if (cookieText !== atTipsText) {
                        Util.setCookie(_Const2.default.prevReadAtTipsCookieName, cookieText);
                    }
                    Util.setCookie(_Const2.default.hideReadAtTipsCookieName, atTipsText, Util.getDate(`+${ _Const2.default.hideMarkReadAtTipsExpires }d`));
                    $this.data('disabled', true);
                    handleBox();
                });
            }
            if (type === 'at_change_to_cao') {
                $atTips.text($atTips.text().replace('@', '艹'));
            }
        } else if (!$atTips.length && (type === 'no_highlight_extra' || type === 'at_change_to_cao')) {
            let html = `
<div style="width: 300px;">
  <a class="indbox6" href="guanjianci.php?gjc=${ _Info2.default.userName }" target="_blank">最近无人${ type === 'at_change_to_cao' ? '艹' : '@' }你</a><br>
  <div class="line"></div>
  <div class="c"></div>
</div>
<div class="line"></div>`;
            $('a[href="kf_givemekfb.php"][title="网站虚拟货币"]').parent().before(html);
        }
    } else if (type === 'hide_box_2') {
        if ($atTips.length > 0) handleBox();
    }
};

/**
 * 在神秘等级升级后进行提醒
 */
const smLevelUpAlert = exports.smLevelUpAlert = function () {
    let matches = /神秘(\d+)级/.exec($('a[href="kf_growup.php"]').text());
    if (!matches) return;
    let smLevel = parseInt(matches[1]);

    /**
     * 写入神秘等级数据
     * @param {number} smLevel 神秘等级
     */
    const writeData = function (smLevel) {
        TmpLog.setValue(_Const2.default.smLevelUpTmpLogName, { time: new Date().getTime(), smLevel });
    };

    let data = TmpLog.getValue(_Const2.default.smLevelUpTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smLevel) !== 'number') {
        writeData(smLevel);
    } else if (smLevel > data.smLevel) {
        let diff = Math.floor((new Date().getTime() - data.time) / 60 / 60 / 1000);
        if (diff >= _Const2.default.smLevelUpAlertInterval) {
            let date = new Date(data.time);
            writeData(smLevel);
            Log.push('神秘等级升级', `自\`${ Util.getDateString(date) }\`以来，你的神秘等级共上升了\`${ smLevel - data.smLevel }\`级 (Lv.\`${ data.smLevel }\`->Lv.\`${ smLevel }\`)`);
            Msg.show(`自<em>${ Util.getDateString(date) }</em>以来，你的神秘等级共上升了<em>${ smLevel - data.smLevel }</em>级`);
        } else if (diff < 0) {
            writeData(smLevel);
        }
    } else if (smLevel < data.smLevel) {
        writeData(smLevel);
    }
};

/**
 * 在神秘系数排名发生变化时进行提醒
 */
const smRankChangeAlert = exports.smRankChangeAlert = function () {
    let matches = /系数排名第\s*(\d+)\s*位/.exec($('a[href="kf_growup.php"]').text());
    if (!matches) return;
    let smRank = parseInt(matches[1]);

    /**
     * 写入神秘系数排名数据
     * @param {number} smRank 神秘系数排名
     */
    const writeData = smRank => TmpLog.setValue(_Const2.default.smRankChangeTmpLogName, { time: new Date().getTime(), smRank });

    let data = TmpLog.getValue(_Const2.default.smRankChangeTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smRank) !== 'number') {
        writeData(smRank);
    } else if (smRank !== data.smRank) {
        let diff = Math.floor((new Date().getTime() - data.time) / 60 / 60 / 1000);
        if (diff >= _Const2.default.smRankChangeAlertInterval) {
            let date = new Date(data.time);
            let isUp = smRank < data.smRank;
            writeData(smRank);
            Log.push('神秘系数排名变化', `自\`${ Util.getDateString(date) }\`以来，你的神秘系数排名共\`${ isUp ? '上升' : '下降' }\`了\`${ Math.abs(smRank - data.smRank) }\`名 ` + `(No.\`${ data.smRank }\`->No.\`${ smRank }\`)`);
            Msg.show(`自<em>${ Util.getDateString(date) }</em>以来，你的神秘系数排名共<b style="color: ${ isUp ? '#F00' : '#393' }">${ isUp ? '上升' : '下降' }</b>了` + `<em>${ Math.abs(smRank - data.smRank) }</em>名`);
        } else if (diff < 0) {
            writeData(smRank);
        }
    }
};

/**
 * 在首页帖子链接旁添加快速跳转至页末的链接
 */
const addHomePageThreadFastGotoLink = exports.addHomePageThreadFastGotoLink = function () {
    $('.index1').on('mouseenter', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        let $this = $(this);
        $this.css('position', 'relative').prepend(`<a class="pd_thread_goto" href="${ $this.find('a').attr('href') }&page=e#a">&raquo;</a>`);
    }).on('mouseleave', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        $(this).css('position', 'static').find('.pd_thread_goto').remove();
    });
};

/**
 * 在首页显示VIP剩余时间
 */
const showVipSurplusTime = exports.showVipSurplusTime = function () {
    /**
     * 添加VIP剩余时间的提示
     * @param {number} hours VIP剩余时间（小时）
     */
    const addVipHoursTips = function (hours) {
        $('a[href="kf_growup.php"]').parent().after(`<div class="line"></div><div style="width: 300px;"><a href="kf_vmember.php" class="indbox${ hours > 0 ? 5 : 6 }">VIP会员 ` + `(${ hours > 0 ? '剩余' + hours + '小时' : '参与论坛获得的额外权限' })</a><div class="c"></div></div>`);
    };

    let vipHours = parseInt(Util.getCookie(_Const2.default.vipSurplusTimeCookieName));
    if (isNaN(vipHours) || vipHours < 0) {
        console.log('检查VIP剩余时间Start');
        $.get('kf_vmember.php?t=' + new Date().getTime(), function (html) {
            let hours = 0;
            let matches = /我的VIP剩余时间\s*<b>(\d+)<\/b>\s*小时/i.exec(html);
            if (matches) hours = parseInt(matches[1]);
            Util.setCookie(_Const2.default.vipSurplusTimeCookieName, hours, Util.getDate(`+${ _Const2.default.vipSurplusTimeExpires }m`));
            addVipHoursTips(hours);
        });
    } else {
        addVipHoursTips(vipHours);
    }
};

/**
 * 在首页上添加搜索类型选择框
 */
const addSearchTypeSelectBoxInHomePage = exports.addSearchTypeSelectBoxInHomePage = function () {
    let $form = $('form[action="search.php?"]');
    $form.attr('name', 'pdSearchForm');
    let $keyWord = $form.find('[type="text"][name="keyword"]');
    $keyWord.css('width', '116px');
    $('<div class="pd_search_type"><span>标题</span><i>&#8744;</i></div>').insertAfter($keyWord);
};

},{"./Const":6,"./Info":10,"./Log":12,"./Msg":15,"./TmpLog":21,"./Util":22}],10:[function(require,module,exports){
/* 信息模块 */
'use strict';

/**
 * 信息类
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
const Info = {
  // 用户ID
  uid: 0,
  // 用户名
  userName: '',
  // 是否位于首页
  isInHomePage: location.pathname === '/' || location.pathname === '/index.php',
  // 是否为移动版
  isMobile: false,
  // 当前域名是否在miaola.info下
  isInMiaolaDomain: location.host.endsWith('.miaola.info'),
  // 版本号
  version: '',
  // 当前窗口
  w: typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
  /**
   * 助手设置和日志的存储位置类型
   * Default：存储在浏览器的localStorage中，设置仅按域名区分，日志同时按域名和uid区分；
   * ByUid：存储在油猴脚本的数据库中，设置和日志仅按uid区分;
   * Global：存储在油猴脚本的数据库中，各域名和各uid均使用全局设置，日志仅按uid区分；
   */
  storageType: 'Default'
};

exports.default = Info;

},{}],11:[function(require,module,exports){
/* 道具模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.modifyItemDescription = exports.addBatchBuyItemsLink = exports.addSampleItemTips = exports.getItemUsedInfo = exports.enhanceMyItemsPage = exports.addBatchUseAndConvertItemTypesButton = exports.addConvertEnergyAndRestoreItemsButton = exports.addSellAndUseItemsButton = exports.getLevelByName = exports.getTypeIdByName = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获得转换指定等级道具可获得的能量点
 * @param {number} itemLevel 道具等级
 * @returns {number} 能量点
 */
const getGainEnergyNumByLevel = function (itemLevel) {
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
};

/**
 * 获得恢复指定等级道具所需的能量点
 * @param {number} itemLevel 道具等级
 * @returns {number} 能量点
 */
const getRestoreEnergyNumByLevel = function (itemLevel) {
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
};

/**
 * 获取指定等级道具的出售所得
 * @param {number} itemLevel 道具等级
 * @returns {number} 出售所得
 */
const getSellItemGainByLevel = function (itemLevel) {
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
};

/**
 * 获取指定名称的道具种类ID
 * @param {string} itemName 道具名称
 * @returns {number} 道具种类ID
 */
const getTypeIdByName = exports.getTypeIdByName = function (itemName) {
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
};

/**
 * 获取指定名称的道具等级
 * @param {string} itemName 道具名称
 * @returns {number} 道具等级
 */
const getLevelByName = exports.getLevelByName = function (itemName) {
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
};

/**
 * 获取指定名称的道具使用上限个数
 * @param {string} itemName 道具名称
 * @returns {number} 道具的使用上限个数
 */
const getMaxUsedNumByName = function (itemName) {
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
};

/**
 * 从使用道具的回应消息中获取积分数据
 * @param {string} response 使用道具的回应消息
 * @param {number} itemTypeId 道具种类ID
 * @returns {Object|number} 积分对象，-1表示使用失败
 */
const getCreditsViaResponse = function (response, itemTypeId) {
    if (/(错误的物品编号|无法再使用|该道具已经被使用)/.test(response)) {
        return -1;
    }
    if (itemTypeId >= 7 && itemTypeId <= 12) {
        if (/成功！/.test(response)) return { '效果': 1 };
    } else {
        let matches = /恢复能量增加了\s*(\d+)\s*点/i.exec(response);
        if (matches) return { '能量': parseInt(matches[1]) };
        matches = /(\d+)KFB/i.exec(response);
        if (matches) return { 'KFB': parseInt(matches[1]) };
        matches = /(\d+)点?贡献/i.exec(response);
        if (matches) return { '贡献': parseInt(matches[1]) };
        matches = /贡献\+(\d+)/i.exec(response);
        if (matches) return { '贡献': parseInt(matches[1]) };
    }
    return {};
};

/**
 * 获取本种类指定数量的道具ID列表
 * @param {string} html 道具列表页面的HTML代码
 * @param {number} num 指定道具数量（设为0表示获取当前所有道具）
 * @returns {number[]} 道具ID列表
 */
const getItemIdList = function (html, num = 0) {
    let itemIdList = [];
    let matches = html.match(/kf_fw_ig_my\.php\?pro=\d+/g);
    if (matches) {
        for (let i = 0; i < matches.length; i++) {
            if (num > 0 && i + 1 > num) break;
            let itemIdMatches = /pro=(\d+)/i.exec(matches[i]);
            if (itemIdMatches) itemIdList.push(parseInt(itemIdMatches[1]));
        }
    }
    return itemIdList;
};

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
const useItems = function (options, cycle) {
    let settings = {
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
            console.log(`循环使用道具Start，使用道具数量：${ cycle.itemNum }，有效道具使用次数上限：${ cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制' }，` + `恢复道具成功次数上限：${ cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制' }`);
            $('.kf_fw_ig1:last').parent().append(`
<ul class="pd_result">
  <li class="pd_stat">
    <strong>
    对<em>${ cycle.itemNum }</em>个【Lv.${ settings.itemLevel }：${ settings.itemName }】道具的循环使用开始（当前道具恢复能量<em>${ cycle.totalEnergyNum }</em>点）<br>
    （有效道具使用次数上限：<em>${ cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制' }</em>，
    恢复道具成功次数上限：<em>${ cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制' }</em>）
    </strong>
  </li>
</ul>
`);
        } else {
            $('.pd_result:last').append('<div class="pd_result_sep"></div>');
        }
        $('.pd_result:last').append(`<li class="pd_stat" style="color: #ff3399;"><strong>第${ cycle.round }轮循环开始：</strong></li>`);
    }
    if (cycle) {
        $('.pd_result:last').append('<li><strong>使用结果：</strong></li>');
    } else {
        $('.kf_fw_ig1:last').parent().append(`<ul class="pd_result"><li><strong>【Lv.${ settings.itemLevel }：${ settings.itemName }】使用结果：</strong></li></ul>`);
    }

    let successNum = 0,
        failNum = 0;
    let stat = { '有效道具': 0, '无效道具': 0 };
    let nextRoundItemIdList = [];
    let isStop = false;
    $(document).clearQueue('UseItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('UseItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_doit.php?id=${ itemId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('使用道具', html);
                    let { type, msg } = Util.getResponseMsg(html);
                    if (type === 1 && !/(错误的物品编号|无法再使用|该道具已经被使用)/.test(msg)) {
                        successNum++;
                        nextRoundItemIdList.push(itemId);
                        let credits = getCreditsViaResponse(msg, settings.itemTypeId);
                        if (credits !== -1) {
                            if ($.isEmptyObject(credits)) stat['无效道具']++;else stat['有效道具']++;
                            if (settings.itemTypeId <= 6) {
                                for (let key of Object.keys(credits)) {
                                    if (typeof stat[key] === 'undefined') stat[key] = credits[key];else stat[key] += credits[key];
                                }
                            }
                        }
                    } else {
                        failNum++;
                        if (/无法再使用/.test(msg)) nextRoundItemIdList = [];
                    }
                    $('.pd_result:last').append(`<li><b>第${ index + 1 }次：</b>${ msg }</li>`);
                    if (cycle && cycle.maxEffectiveItemCount && cycle.stat['有效道具'] + stat['有效道具'] >= cycle.maxEffectiveItemCount) {
                        isStop = true;
                        console.log('有效道具使用次数到达设定上限，循环使用操作停止');
                        $('.pd_result:last').append('<li><span class="pd_notice">（有效道具使用次数到达设定上限，循环操作中止）</span></li>');
                    }
                },
                error() {
                    failNum++;
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                    if (isStop) {
                        $(document).clearQueue('UseItems');
                        if (settings.isTypeBatch) $(document).clearQueue('UseItemTypes');
                    }

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (stat['有效道具'] === 0) delete stat['有效道具'];
                        if (stat['无效道具'] === 0) delete stat['无效道具'];
                        if (!cycle && successNum > 0) {
                            Log.push('使用道具', `共有\`${ successNum }\`个【\`Lv.${ settings.itemLevel }：${ settings.itemName }\`】道具被使用`, {
                                gain: $.extend({}, stat, { '已使用道具': successNum }),
                                pay: { '道具': -successNum }
                            });
                        }
                        let logStat = '',
                            msgStat = '',
                            resultStat = '';
                        for (let type of Object.keys(stat)) {
                            logStat += `，${ type }+${ stat[type] }`;
                            msgStat += `<i>${ type }<em>+${ stat[type] }</em></i>`;
                            resultStat += `<i>${ type }<em>+${ stat[type] }</em></i> `;
                            if (cycle) {
                                if (typeof cycle.stat[type] === 'undefined') cycle.stat[type] = stat[type];else cycle.stat[type] += stat[type];
                            }
                        }
                        console.log(`共有${ successNum }个道具被使用${ failNum > 0 ? `，共有${ failNum }个道具未能使用` : '' }${ logStat }`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>个道具被使用${ failNum > 0 ? `，共有<em>${ failNum }</em>个道具未能使用` : '' }</strong>${ msgStat }`, -1);
                        if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                        $('.pd_result:last').append(`<li class="pd_stat"><b>统计结果（共有<em>${ successNum }</em>个道具被使用）：</b><br>${ resultStat }</li>`);

                        if (settings.type === 2) {
                            $('.kf_fw_ig1 input[type="checkbox"]:checked').closest('tr').fadeOut('normal', function () {
                                $(this).remove();
                            });
                        } else {
                            setCurrentItemUsableAndUsedNum(settings.$itemLine, successNum, -successNum);
                            showItemUsedInfo(settings.$itemLine.closest('tbody').find('tr:gt(1) > td:nth-child(2) > a'));
                        }
                        if (settings.itemName === '零时迷子的碎片') showCurrentUsedItemNum();

                        if (cycle) {
                            settings.itemIdList = nextRoundItemIdList;
                            if (!settings.itemIdList.length) isStop = true;
                            cycle.countStat['被使用次数'] += successNum;
                            cycle.stat['道具'] -= successNum;
                            cycle.stat['已使用道具'] += successNum;
                            cycleUseItems(isStop ? 0 : 2, settings, cycle);
                        } else if (settings.isTypeBatch) {
                            $(document).dequeue('UseItemTypes');
                        }
                    } else {
                        setTimeout(() => $(document).dequeue('UseItems'), typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('UseItems');
};

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
const restoreItems = function (options, cycle) {
    let settings = {
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
    } else {
        $('.kf_fw_ig1:last').parent().append(`<ul class="pd_result"><li><strong>【Lv.${ settings.itemLevel }：${ settings.itemName }】恢复结果：</strong></li></ul>`);
    }

    let successNum = 0,
        failNum = 0,
        successEnergyNum = 0;
    let perEnergyNum = getRestoreEnergyNumByLevel(settings.itemLevel);
    let isStop = false;
    let nextRoundItemIdList = [];
    $(document).clearQueue('RestoreItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('RestoreItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_doit.php?renew=${ settings.safeId }&id=${ itemId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('恢复道具', html);
                    let { type, msg } = Util.getResponseMsg(html);
                    if (type === 1) {
                        if (/该道具已经被恢复/.test(msg)) {
                            msg = '该道具已经被恢复';
                            successNum++;
                            successEnergyNum += perEnergyNum;
                            nextRoundItemIdList.push(itemId);
                            if (cycle && cycle.maxSuccessRestoreItemCount && cycle.countStat['恢复成功次数'] + successNum >= cycle.maxSuccessRestoreItemCount) {
                                isStop = true;
                                msg += '<span class="pd_notice">（恢复道具成功次数已达到设定上限，恢复操作中止）</span>';
                            }
                        } else if (/恢复失败/.test(msg)) {
                            msg = '该道具恢复失败';
                            failNum++;
                        } else if (/你的能量不足以恢复本道具/.test(msg)) {
                            isStop = true;
                            msg = '你的能量不足以恢复本道具<span class="pd_notice">（恢复操作中止）</span>';
                        }
                    }
                    $('.pd_result:last').append(`<li><b>第${ index + 1 }次：</b>${ msg }</li>`);
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('RestoreItems');

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (!cycle && (successNum > 0 || failNum > 0)) {
                            Log.push('恢复道具', `共有\`${ successNum }\`个【\`Lv.${ settings.itemLevel }：${ settings.itemName }\`】道具恢复成功，共有\`${ failNum }\`个道具恢复失败`, {
                                gain: { '道具': successNum },
                                pay: { '已使用道具': -(successNum + failNum), '能量': -successEnergyNum }
                            });
                        }
                        console.log(`共有${ successNum }个道具恢复成功，共有${ failNum }个道具恢复失败，能量-${ successEnergyNum }`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>个道具恢复成功，共有<em>${ failNum }</em>个道具恢复失败</strong>` + `<i>能量<ins>-${ successEnergyNum }</ins></i>`, -1);
                        $('.pd_result:last').append(`<li class="pd_stat">共有<em>${ successNum }</em>个道具恢复成功，共有<em>${ failNum }</em>个道具恢复失败，` + `<i>能量<ins>-${ successEnergyNum }</ins></i></li>`);

                        if (settings.type === 2) {
                            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').closest('tr').fadeOut('normal', function () {
                                $(this).remove();
                            });
                        }
                        setCurrentItemUsableAndUsedNum(settings.$itemLine, -(successNum + failNum), successNum, -successEnergyNum);

                        if (cycle) {
                            settings.itemIdList = nextRoundItemIdList;
                            if (!settings.itemIdList.length) isStop = true;
                            if (!isStop) cycle.round++;
                            cycle.totalEnergyNum -= successEnergyNum;
                            cycle.countStat['恢复成功次数'] += successNum;
                            cycle.countStat['恢复失败次数'] += failNum;
                            cycle.stat['能量'] -= successEnergyNum;
                            cycle.stat['道具'] += successNum;
                            cycle.stat['已使用道具'] -= successNum + failNum;
                            cycleUseItems(isStop ? 0 : 1, settings, cycle);
                        }
                    } else {
                        setTimeout(() => $(document).dequeue('RestoreItems'), typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('RestoreItems');
};

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
const cycleUseItems = function (type, options, cycle) {
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

    if ($('.pd_msg').length >= 5) {
        Msg.remove($('.pd_msg:first'));
    }

    const showResult = function (type, stat) {
        let resultStat = '';
        for (let key of Object.keys(stat)) {
            if (type > 0 && (key === '道具' || key === '已使用道具')) continue;
            resultStat += `<i>${ key }${ Util.getStatFormatNumber(cycle.stat[key]) }</i> `;
        }
        $('.pd_result:last').append(`
<li class="pd_result_sep${ type > 0 ? '_inner' : '' }"></li>
<li class="pd_stat">
  <strong>
    ${ type > 0 ? '截至目前为止的统计' : `【Lv.${ options.itemLevel }：${ options.itemName }】循环使用最终统计` }（当前道具恢复能量<em>${ cycle.totalEnergyNum }</em>点）：
  </strong>
</li>
<li class="pd_stat">
  ${ type > 0 ? '' : `共进行了<em>${ cycle.round }</em>轮循环：` }
  <i>被使用次数<em>+${ cycle.countStat['被使用次数'] }</em></i>
  <i>恢复成功次数<em>+${ cycle.countStat['恢复成功次数'] }</em></i>
  <i>恢复失败次数<em>+${ cycle.countStat['恢复失败次数'] }</em></i>
</li>
<li class="pd_stat">${ resultStat }</li>
`);
    };

    if (type === 1) {
        showResult(type, cycle.stat);
        Msg.wait(`<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ options.itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        setTimeout(function () {
            useItems(options, cycle);
        }, cycle.round === 1 ? 500 : typeof _Const2.default.cycleUseItemsFirstAjaxInterval === 'function' ? _Const2.default.cycleUseItemsFirstAjaxInterval() : _Const2.default.cycleUseItemsFirstAjaxInterval);
    } else if (type === 2) {
        Msg.wait(`<strong>正在恢复道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ options.itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        setTimeout(() => restoreItems(options, cycle), typeof _Const2.default.cycleUseItemsFirstAjaxInterval === 'function' ? _Const2.default.cycleUseItemsFirstAjaxInterval() : _Const2.default.cycleUseItemsFirstAjaxInterval);
    } else {
        if (cycle.stat['道具'] === 0) delete cycle.stat['道具'];
        if (cycle.stat['已使用道具'] === 0) delete cycle.stat['已使用道具'];
        if (cycle.stat['有效道具'] === 0) delete cycle.stat['有效道具'];
        if (cycle.stat['无效道具'] === 0) delete cycle.stat['无效道具'];
        let gain = {},
            pay = {};
        for (let key in cycle.stat) {
            if (cycle.stat[key] > 0) gain[key] = cycle.stat[key];else pay[key] = cycle.stat[key];
        }

        if (cycle.countStat['被使用次数'] > 0) {
            Log.push('循环使用道具', `对\`${ cycle.itemNum }\`个【\`Lv.${ options.itemLevel }：${ options.itemName }\`】道具进行了\`${ cycle.round }\`轮循环使用` + `(被使用次数\`+${ cycle.countStat['被使用次数'] }\`，恢复成功次数\`+${ cycle.countStat['恢复成功次数'] }\`，` + `恢复失败次数\`+${ cycle.countStat['恢复失败次数'] }\`)`, { gain: gain, pay: pay });
        }

        console.log(`共进行了${ cycle.round }轮循环，被使用次数+${ cycle.countStat['被使用次数'] }，恢复成功次数+${ cycle.countStat['恢复成功次数'] }，` + `恢复失败次数+${ cycle.countStat['恢复失败次数'] }，能量${ cycle.stat['能量'] }`);
        Msg.show(`<strong>共进行了<em>${ cycle.round }</em>轮循环</strong><i>被使用次数<em>+${ cycle.countStat['被使用次数'] }</em></i>` + `<i>恢复成功次数<em>+${ cycle.countStat['恢复成功次数'] }</em></i><i>恢复失败次数<em>+${ cycle.countStat['恢复失败次数'] }</em></i>` + `<i>能量<ins>${ cycle.stat['能量'] }</ins></i><a href="#">清除消息框</a>`, -1).find('a').click(function (e) {
            e.preventDefault();
            Msg.destroy();
        });
        showResult(type, cycle.stat);
    }
};

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
const convertItemsToEnergy = function (options) {
    let settings = {
        type: 1,
        itemIdList: [],
        safeId: '',
        itemLevel: 0,
        itemName: '',
        $itemLine: null,
        isTypeBatch: false
    };
    $.extend(settings, options);
    $('.kf_fw_ig1:last').parent().append(`<ul class="pd_result"><li><strong>【Lv.${ settings.itemLevel }：${ settings.itemName }】转换结果：</strong></li></ul>`);

    let successNum = 0,
        failNum = 0;
    let energyNum = getGainEnergyNumByLevel(settings.itemLevel);
    $(document).clearQueue('ConvertItemsToEnergy');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('ConvertItemsToEnergy', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_doit.php?tomp=${ settings.safeId }&id=${ itemId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('将道具转换为能量', html);
                    let { msg } = Util.getResponseMsg(html);
                    if (/转换为了\s*\d+\s*点能量/.test(msg)) {
                        successNum++;
                    } else failNum++;
                },
                error() {
                    failNum++;
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) {
                        $(document).clearQueue('ConvertItemsToEnergy');
                        if (settings.isTypeBatch) $(document).clearQueue('ConvertItemTypesToEnergy');
                    }

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        let successEnergyNum = successNum * energyNum;
                        if (successNum > 0) {
                            Log.push('将道具转换为能量', `共有\`${ successNum }\`个【\`Lv.${ settings.itemLevel }：${ settings.itemName }\`】道具成功转换为能量`, { gain: { '能量': successEnergyNum }, pay: { '已使用道具': -successNum } });
                        }
                        console.log(`共有${ successNum }个道具成功转换为能量${ failNum > 0 ? `，共有${ failNum }个道具转换失败` : '' }，能量+${ successEnergyNum }`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>个道具成功转换为能量${ failNum > 0 ? `，共有<em>${ failNum }</em>个道具转换失败` : '' }</strong>` + `<i>能量<em>+${ successEnergyNum }</em></i>`, -1);
                        $('.pd_result:last').append(`<li class="pd_stat">共有<em>${ successNum }</em>个道具成功转换为能量${ failNum > 0 ? `，共有<em>${ failNum }</em>个道具转换失败` : '' }，` + `<i>能量<em>+${ successEnergyNum }</em></i></li>`);

                        if (settings.type === 2) {
                            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').closest('tr').fadeOut('normal', function () {
                                $(this).remove();
                            });
                        }
                        setCurrentItemUsableAndUsedNum(settings.$itemLine, -successNum, null, successEnergyNum);
                        if (settings.isTypeBatch) $(document).dequeue('ConvertItemTypesToEnergy');
                    } else {
                        setTimeout(() => $(document).dequeue('ConvertItemsToEnergy'), _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('ConvertItemsToEnergy');
};

/**
 * 出售指定的一系列道具
 * @param {{}} options 设置项
 * @param {number[]} options.itemIdList 指定的道具ID列表
 * @param {string} options.safeId 用户的SafeID
 * @param {number} options.itemLevel 道具等级
 * @param {string} options.itemName 道具名称
 */
const sellItems = function (options) {
    let settings = {
        itemIdList: [],
        itemLevel: 0,
        itemName: ''
    };
    $.extend(settings, options);
    $('.kf_fw_ig1:last').parent().append(`<ul class="pd_result"><li><strong>【Lv.${ settings.itemLevel }：${ settings.itemName }】出售结果：</strong></li></ul>`);

    let successNum = 0,
        failNum = 0,
        totalGain = 0;
    $(document).clearQueue('SellItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('SellItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_shop.php?sell=yes&id=${ itemId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('出售道具', html);
                    let { msg } = Util.getResponseMsg(html);
                    if (/出售成功/.test(msg)) {
                        successNum++;
                        totalGain += getSellItemGainByLevel(settings.itemLevel);
                    } else failNum++;
                },
                error() {
                    failNum++;
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('SellItems');

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (successNum > 0) {
                            Log.push('出售道具', `共有\`${ successNum }\`个【\`Lv.${ settings.itemLevel }：${ settings.itemName }\`】道具出售成功`, {
                                gain: { 'KFB': totalGain },
                                pay: { '道具': -successNum }
                            });
                        }
                        $('.kf_fw_ig1 input[type="checkbox"]:checked').closest('tr').fadeOut('normal', function () {
                            $(this).remove();
                        });
                        console.log(`共有${ successNum }个道具出售成功，共有${ failNum }个道具出售失败，KFB+${ totalGain }`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>个道具出售成功${ failNum > 0 ? `，共有<em>${ failNum }</em>个道具出售失败` : '' }</strong>` + `<i>KFB<em>+${ totalGain }</em></i>`, -1);
                        $('.pd_result:last').append(`<li class="pd_stat">共有<em>${ successNum }</em>个道具出售成功${ failNum > 0 ? `，共有<em>${ failNum }</em>个道具出售失败` : '' }，` + `<i>KFB<em>+${ totalGain }</em></i></li>`);
                    } else {
                        setTimeout(() => $(document).dequeue('SellItems'), _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('SellItems');
};

/**
 * 在道具列表页面上添加批量出售和使用道具的按钮
 */
const addSellAndUseItemsButton = exports.addSellAndUseItemsButton = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    let $lastLine = $('.kf_fw_ig1 > tbody > tr:last-child');
    let itemName = $lastLine.find('td:first-child').text();
    if (!itemName) return;
    let matches = /(\d+)级道具/.exec($lastLine.find('td:nth-child(2)').text());
    if (!matches) return;
    let itemLevel = parseInt(matches[1]);
    let itemTypeId = parseInt(Util.getUrlParam('lv'));
    if (!itemTypeId) return;
    $('.kf_fw_ig1 > tbody > tr > td:last-child').each(function () {
        let matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
        if (!matches) return;
        $(this).css('width', '163').parent().append(`<td style="width: 20px; padding-right: 5px;"><input class="pd_input" type="checkbox" value="${ matches[1] }"></td>`);
    });
    $('.kf_fw_ig1 > tbody > tr:lt(2)').find('td').attr('colspan', 5);

    $(`
<div class="pd_item_btns">
  ${ itemTypeId >= 7 && itemTypeId <= 12 ? '<button name="sellItem" style="color: #f00;" title="批量出售指定道具">出售道具</button>' : '' }
  ${ itemTypeId > 1 ? '<button name="cycleUseItem" style="color: #00f;" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</button>' : '' }
  <button name="useItem" title="批量使用指定道具">使用道具</button>
  <button name="selectAll">全选</button>
  <button name="selectInverse">反选</button>
</div>
`).insertAfter('.kf_fw_ig1').find('[name="useItem"]').click(function () {
        Msg.destroy();
        let itemIdList = [];
        $('.kf_fw_ig1 [type="checkbox"]:checked').each(function () {
            itemIdList.push(parseInt($(this).val()));
        });
        if (!itemIdList.length) return;
        if (!confirm(`共选择了${ itemIdList.length }个道具，是否批量使用道具？`)) return;
        Msg.wait(`<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        useItems({
            type: 2,
            itemIdList: itemIdList,
            safeId: safeId,
            itemLevel: itemLevel,
            itemTypeId: itemTypeId,
            itemName: itemName
        });
    }).end().find('[name="selectAll"]').click(function () {
        $('.kf_fw_ig1 [type="checkbox"]').prop('checked', true);
    }).end().find('[name="selectInverse"]').click(function () {
        $('.kf_fw_ig1 [type="checkbox"]').each(function () {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    }).end().find('[name="cycleUseItem"]').click(function () {
        Msg.destroy();
        let itemIdList = [];
        $('.kf_fw_ig1 [type="checkbox"]:checked').each(function () {
            itemIdList.push(parseInt($(this).val()));
        });
        if (!itemIdList.length) return;
        let value = prompt('你要循环使用多少个道具？\n' + '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）', itemIdList.length);
        if (value === null) return;
        value = $.trim(value);
        if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
            alert('格式不正确');
            return;
        }
        let arr = value.split('|');
        let num = parseInt(arr[0]),
            maxEffectiveItemCount = 0,
            maxSuccessRestoreItemCount = 0;
        if (!num) return;
        if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
        if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
        Msg.destroy();

        if (num > itemIdList.length) num = itemIdList.length;
        let tmpItemIdList = [];
        for (let i = 0; i < num; i++) {
            tmpItemIdList.push(itemIdList[i]);
        }
        itemIdList = tmpItemIdList;
        Msg.wait('正在获取当前道具相关信息，请稍后&hellip;');
        $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
            Msg.destroy();
            let totalEnergyNum = getCurrentEnergyNum(html);
            showCurrentUsedItemNum(html);
            cycleUseItems(1, {
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
        });
    }).end().find('[name="sellItem"]').click(function () {
        Msg.destroy();
        let itemIdList = [];
        $('.kf_fw_ig1 [type="checkbox"]:checked').each(function () {
            itemIdList.push(parseInt($(this).val()));
        });
        if (!itemIdList.length) return;
        if (!confirm(`共选择了${ itemIdList.length }个道具，是否批量出售道具？`)) return;
        Msg.wait(`<strong>正在出售道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        sellItems({
            itemIdList: itemIdList,
            itemLevel: itemLevel,
            itemName: itemName
        });
    });

    showCurrentUsedItemNum();
};

/**
 * 在已使用道具列表页面上添加批量转换能量和恢复道具的按钮
 */
const addConvertEnergyAndRestoreItemsButton = exports.addConvertEnergyAndRestoreItemsButton = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    let $lastLine = $('.kf_fw_ig1:eq(1) > tbody > tr:last-child');
    let itemName = $lastLine.find('td:first-child').text();
    if (!itemName) return;
    let matches = /(\d+)级道具/.exec($lastLine.find('td:nth-child(2)').text());
    if (!matches) return;
    let itemLevel = parseInt(matches[1]);
    let itemTypeId = parseInt(Util.getUrlParam('lv'));
    if (!itemTypeId) return;
    $('.kf_fw_ig1:eq(1) > tbody > tr > td:last-child').each(function () {
        let matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
        if (!matches) return;
        $(this).css('width', '500').parent().append(`<td style="width: 20px; padding-right: 5px;"><input class="pd_input" type="checkbox" value="${ matches[1] }"></td>`);
    });
    $(`
<div class="pd_item_btns">
  <button class="pd_highlight" name="convertEnergy" title="批量将指定道具转换为能量">转换能量</button>
  <button name="restoreItem" title="批量恢复指定道具">恢复道具</button>
  <button name="selectAll">全选</button>
  <button name="selectInverse">反选</button>
</div>
`).insertAfter('.kf_fw_ig1:eq(1)').find('[name="convertEnergy"]').click(function () {
        Msg.destroy();
        let itemIdList = [];
        $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
            itemIdList.push(parseInt($(this).val()));
        });
        if (!itemIdList.length) return;
        if (!confirm(`共选择了${ itemIdList.length }个道具，是否转换为能量？`)) return;
        Msg.wait(`<strong>正在转换能量中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        convertItemsToEnergy({
            type: 2,
            itemIdList: itemIdList,
            safeId: safeId,
            itemLevel: itemLevel,
            itemName: itemName
        });
    }).end().find('[name="restoreItem"]').click(function () {
        Msg.destroy();
        let itemIdList = [];
        $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
            itemIdList.push(parseInt($(this).val()));
        });
        if (!itemIdList.length) return;
        let totalRequiredEnergyNum = itemIdList.length * getRestoreEnergyNumByLevel(itemLevel);
        if (!confirm(`共选择了${ itemIdList.length }个道具，共需要${ totalRequiredEnergyNum }点恢复能量，是否恢复道具？`)) return;
        let totalEnergyNum = parseInt($('.kf_fw_ig1 td:contains("道具恢复能量")').find('span').text());
        if (!totalEnergyNum || totalEnergyNum < totalRequiredEnergyNum) {
            alert('所需恢复能量不足');
            return;
        }
        Msg.wait(`<strong>正在恢复道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        restoreItems({
            type: 2,
            itemIdList: itemIdList,
            safeId: safeId,
            itemLevel: itemLevel,
            itemTypeId: itemTypeId,
            itemName: itemName
        });
    }).end().find('[name="selectAll"]').click(function () {
        $('.kf_fw_ig1:eq(1) input[type="checkbox"]').prop('checked', true);
    }).end().find('[name="selectInverse"]').click(function () {
        $('.kf_fw_ig1:eq(1) input[type="checkbox"]').each(function () {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    });
};

/**
 * 添加批量使用和转换指定种类的道具的按钮
 */
const addBatchUseAndConvertItemTypesButton = exports.addBatchUseAndConvertItemTypesButton = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    $(`
<div class="pd_item_btns">
  <label style="margin-right: 5px;" title="延长道具批量操作的时间间隔（在2~6秒之间），以模拟手动使用和恢复道具（仅限此页面有效）">
    <input name="simulateManualHandleItemEnabled" type="checkbox" ${ Config.simulateManualHandleItemEnabled ? 'checked' : '' }>
    模拟手动操作道具
  </label>
  <button title="批量使用指定种类的道具" data-action="useItemTypes">批量使用</button>
  <button class="pd_highlight" title="批量将指定种类的道具转换为能量" data-action="convertItemTypes">批量转换</button>
  <button data-action="selectAll">全选</button>
  <button data-action="selectInverse">反选</button>
</div>
`).insertAfter('.pd_my_items').on('click', 'button', function () {
        let action = $(this).data('action');
        if (action === 'useItemTypes' || action === 'convertItemTypes') {
            let itemTypeList = [];
            $('.pd_item_type_chk:checked').each(function () {
                let $itemLine = $(this).closest('tr'),
                    itemLevel = parseInt($itemLine.find('td:first-child').text()),
                    itemTypeId = parseInt($itemLine.data('itemTypeId')),
                    itemName = $itemLine.find('td:nth-child(2) > a').text();
                if (isNaN(itemTypeId) || itemTypeId <= 0) return;
                if (action === 'convertItemTypes' && itemTypeId === 1) return;
                let itemListUrl = $itemLine.find('td:last-child').find(action === 'useItemTypes' ? 'a:first-child' : 'a:last-child').attr('href') + '&t=' + new Date().getTime();
                itemTypeList.push({
                    itemTypeId: itemTypeId,
                    itemLevel: itemLevel,
                    itemName: itemName,
                    $itemLine: $itemLine,
                    itemListUrl: itemListUrl
                });
            });
            if (!itemTypeList.length) return;
            let num = parseInt(prompt(`在指定种类道具中你要${ action === 'useItemTypes' ? '使用' : '转换' }多少个道具？（0表示不限制）`, 0));
            if (isNaN(num) || num < 0) return;
            Msg.destroy();

            let queueName = action === 'useItemTypes' ? 'UseItemTypes' : 'ConvertItemTypesToEnergy';
            $(document).clearQueue(queueName);
            $.each(itemTypeList, function (index, data) {
                $(document).queue(queueName, function () {
                    let $wait = Msg.wait(`正在获取本种类${ action === 'useItemTypes' ? '未' : '已' }使用道具列表，请稍后&hellip;`);
                    $.ajax({
                        type: 'GET',
                        url: data.itemListUrl,
                        timeout: _Const2.default.defAjaxTimeout,
                        success(html) {
                            Msg.remove($wait);
                            let itemIdList = getItemIdList(html, num);
                            if (!itemIdList.length) {
                                $(document).dequeue(queueName);
                                return;
                            }

                            if (action === 'useItemTypes') {
                                console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                                Msg.wait(`<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                                useItems({
                                    type: 1,
                                    itemIdList: itemIdList,
                                    safeId: safeId,
                                    itemLevel: data.itemLevel,
                                    itemTypeId: data.itemTypeId,
                                    itemName: data.itemName,
                                    $itemLine: data.$itemLine,
                                    isTypeBatch: true
                                });
                            } else {
                                console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                                Msg.wait(`<strong>正在转换能量中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                                convertItemsToEnergy({
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
                        error() {
                            Msg.remove($wait);
                            $(document).dequeue(queueName);
                        }
                    });
                });
            });
            $(document).dequeue(queueName);
        } else if (action === 'selectAll') {
            $('.pd_item_type_chk').prop('checked', true);
        } else if (action === 'selectInverse') {
            $('.pd_item_type_chk').each(function () {
                $(this).prop('checked', !$(this).prop('checked'));
            });
        }
    }).find('[name="simulateManualHandleItemEnabled"]').click(function () {
        if (!('_specialAjaxInterval' in _Const2.default)) _Const2.default._specialAjaxInterval = _Const2.default.specialAjaxInterval;
        let checked = $(this).prop('checked');
        if (checked) _Const2.default.specialAjaxInterval = () => Math.floor(Math.random() * 4000) + 2000;else _Const2.default.specialAjaxInterval = _Const2.default._specialAjaxInterval;
        (0, _Config.read)();
        Config.simulateManualHandleItemEnabled = checked;
        (0, _Config.write)();
    }).triggerHandler('click');
};

/**
 * 为我的道具页面中的道具操作链接绑定点击事件
 * @param {jQuery} $element 要绑定的容器元素
 */
const bindItemActionLinksClick = function ($element) {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    $element.on('click', 'a[href="#"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.is('.pd_disabled_link')) return;
        let $itemLine = $this.closest('tr'),
            itemLevel = parseInt($itemLine.find('td:first-child').text()),
            itemTypeId = parseInt($itemLine.data('itemTypeId')),
            itemName = $itemLine.find('td:nth-child(2) > a').text(),
            itemUsableNum = parseInt($itemLine.find('td:nth-child(3) > .pd_usable_num').text()),
            itemUsedNum = parseInt($itemLine.find('td:nth-child(3) > .pd_used_num').text()),
            itemListUrl = '';
        if (isNaN(itemTypeId) || itemTypeId <= 0) return;

        if ($this.is('.pd_items_batch_use')) {
            let num = parseInt(prompt(`你要使用多少个【Lv.${ itemLevel }：${ itemName }】道具？（0表示不限制）`, itemUsableNum ? itemUsableNum : 0));
            if (isNaN(num) || num < 0) return;
            Msg.destroy();

            Msg.wait('正在获取本种类未使用道具列表，请稍后&hellip;');
            itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
            $.get(itemListUrl, function (html) {
                Msg.destroy();
                let itemIdList = getItemIdList(html, num);
                if (!itemIdList.length) {
                    alert('本种类没有未使用的道具');
                    return;
                }
                console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                Msg.wait(`<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                useItems({
                    type: 1,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName,
                    $itemLine: $itemLine
                });
            });
        } else if ($this.is('.pd_items_cycle_use')) {
            let value = prompt(`你要循环使用多少个【Lv.${ itemLevel }：${ itemName }】道具？\n` + '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）', itemUsableNum ? itemUsableNum : 0);
            if (value === null) return;
            value = $.trim(value);
            if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                alert('格式不正确');
                return;
            }
            let arr = value.split('|');
            let num = 0,
                maxEffectiveItemCount = 0,
                maxSuccessRestoreItemCount = 0;
            num = parseInt(arr[0]);
            if (isNaN(num) || num < 0) return;
            if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
            if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
            Msg.destroy();

            Msg.wait('正在获取本种类未使用道具列表，请稍后&hellip;');
            itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
            $.get(itemListUrl, function (html) {
                Msg.destroy();
                let itemIdList = getItemIdList(html, num);
                if (!itemIdList.length) {
                    alert('本种类没有未使用的道具');
                    return;
                }
                Msg.wait('正在获取当前道具相关信息，请稍后&hellip;');
                $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
                    showCurrentUsableItemNum(html);
                    $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                        Msg.destroy();
                        let totalEnergyNum = getCurrentEnergyNum(html);
                        showCurrentUsedItemNum(html);
                        cycleUseItems(1, {
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
                    });
                });
            });
        } else if ($this.is('.pd_items_batch_restore')) {
            let num = parseInt(prompt(`你要恢复多少个【Lv.${ itemLevel }：${ itemName }】道具？（0表示不限制）`, itemUsedNum ? itemUsedNum : 0));
            if (isNaN(num) || num < 0) return;
            Msg.destroy();

            itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
            Msg.wait('正在获取本种类已使用道具列表，请稍后&hellip;');
            $.get(itemListUrl, function (html) {
                Msg.destroy();
                let itemIdList = getItemIdList(html, num);
                if (!itemIdList.length) {
                    alert('本种类没有已使用的道具');
                    return;
                }
                console.log('批量恢复道具Start，恢复道具数量：' + itemIdList.length);
                Msg.wait(`<strong>正在恢复道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                restoreItems({
                    type: 1,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName,
                    $itemLine: $itemLine
                });
            });
        } else if ($this.is('.pd_items_batch_convert')) {
            let num = parseInt(prompt(`你要将多少个【Lv.${ itemLevel }：${ itemName }】道具转换为能量？（0表示不限制）`, itemUsedNum ? itemUsedNum : 0));
            if (isNaN(num) || num < 0) return;
            Msg.destroy();

            itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
            Msg.wait('正在获取本种类已使用道具列表，请稍后&hellip;');
            $.get(itemListUrl, function (html) {
                Msg.destroy();
                let itemIdList = getItemIdList(html, num);
                if (!itemIdList.length) {
                    alert('本种类没有已使用的道具');
                    return;
                }
                console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                Msg.wait(`<strong>正在转换能量中&hellip;</strong><i>剩余：<em class="pd_countdown">${ itemIdList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                convertItemsToEnergy({
                    type: 1,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemName: itemName,
                    $itemLine: $itemLine
                });
            });
        }
    });
};

/**
 * 增强我的道具页面
 */
const enhanceMyItemsPage = exports.enhanceMyItemsPage = function () {
    let $myItems = $('.kf_fw_ig1:last');
    $myItems.addClass('pd_my_items').find('tbody > tr').each(function (index) {
        let $this = $(this);
        if (index === 0) {
            $this.find('td').attr('colspan', 6);
        } else if (index === 1) {
            $this.find('td:first-child').css('width', '75px').end().find('td:nth-child(2)').css('width', '185px').end().find('td:nth-child(3)').css('width', '105px').html('<span class="pd_usable_num">可用数</span> / <span class="pd_used_num pd_custom_tips">已用数</span>').end().find('td:last-child').css('width', '165px').before('<td style="width: 135px;">使用道具</td><td style="width: 135px;">恢复道具 和 转换能量</td>');
        } else {
            $this.find('td:first-child').prepend('<input class="pd_input pd_item_type_chk" type="checkbox">');
            let isDisabledLink = index === 2 ? 'pd_disabled_link' : '';
            $this.find('td:nth-child(3)').wrapInner('<span class="pd_usable_num" style="margin-left: 5px;"></span>').append(' / <span class="pd_used_num pd_custom_tips">?</span>').after(`
<td>
  <a class="pd_items_batch_use" href="#" title="批量使用指定数量的道具">批量使用</a>
  <a class="pd_items_cycle_use pd_highlight ${ isDisabledLink }" href="#" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</a>
</td>
<td>
  <a class="pd_items_batch_restore ${ isDisabledLink }" href="#" title="批量恢复指定数量的道具">批量恢复</a>
  <a class="pd_items_batch_convert pd_highlight ${ isDisabledLink }" href="#" title="批量将指定数量的道具转换为能量">批量转换</a>
</td>
`);
            let $listLinkColumn = $this.find('td:last-child');
            let matches = /lv=(\d+)/i.exec($listLinkColumn.find('a').attr('href'));
            if (matches) {
                let itemTypeId = parseInt(matches[1]);
                $this.data('itemTypeId', itemTypeId);
                $listLinkColumn.find('a').text('未使用列表').after(`<a class="pd_highlight" href="kf_fw_ig_renew.php?lv=${ itemTypeId }">已使用列表</a>`);
            }
        }
    });
    bindItemActionLinksClick($myItems);

    let $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
    addSampleItemsLink($itemName);
    showItemUsedInfo($itemName.find('a'));
    showCurrentUsedItemNum();
};

/**
 * 设定当前指定种类道具的未使用和已使用数量以及道具恢复能量
 * @param {?jQuery} $itemLine 当前道具所在的表格行
 * @param {?number} usedChangeNum 已使用道具的变化数量
 * @param {?number} [usableChangeNum] 未使用道具的变化数量
 * @param {?number} [energyChangeNum] 道具恢复能量的变化数量
 */
const setCurrentItemUsableAndUsedNum = function ($itemLine, usedChangeNum, usableChangeNum, energyChangeNum) {
    let flag = false;
    if ($itemLine) {
        let $itemUsed = $itemLine.find('td:nth-child(3) > .pd_used_num');
        let itemName = $itemLine.find('td:nth-child(2) > a').text();
        if ($itemUsed.length > 0 && itemName !== '零时迷子的碎片') {
            let num = parseInt($itemUsed.text());
            if (isNaN(num) || num + usedChangeNum < 0) {
                flag = true;
            } else {
                $itemUsed.text(num + usedChangeNum);
                showUsedItemEnergyTips();
            }
        }
        if (usableChangeNum) {
            let $itemUsable = $itemLine.find('td:nth-child(3) > .pd_usable_num');
            if ($itemUsable.length > 0) {
                let num = parseInt($itemUsable.text());
                if (isNaN(num) || num + usableChangeNum < 0) flag = true;else $itemUsable.text(num + usableChangeNum);
            }
        }
    }
    if (energyChangeNum) {
        let $totalEnergy = $('.pd_total_energy_num');
        if (location.pathname === '/kf_fw_ig_renew.php') $totalEnergy = $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span');
        if ($totalEnergy.length > 0) {
            let num = parseInt($totalEnergy.text());
            if (isNaN(num) || num + energyChangeNum < 0) flag = true;else $totalEnergy.text(num + energyChangeNum);
        } else {
            flag = true;
        }
    }
    if (flag) {
        showCurrentUsedItemNum();
        if (location.pathname === '/kf_fw_ig_my.php' && !Util.getUrlParam('lv')) showCurrentUsableItemNum();
    }
};

/**
 * 获取当前道具恢复能量
 * @param {string} html 恢复道具页面的HTML代码
 */
const getCurrentEnergyNum = function (html) {
    let energyNum = 0;
    let energyNumMatches = /道具恢复能量<br\s*\/?><span.+?>(\d+)<\/span><br\s*\/?>点/i.exec(html);
    if (energyNumMatches) energyNum = parseInt(energyNumMatches[1]);
    return energyNum;
};

/**
 * 显示已使用道具恢复所需和转换可得的能量的提示
 */
const showUsedItemEnergyTips = function () {
    let totalRestoreEnergy = 0,
        totalConvertEnergy = 0;
    $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_used_num').each(function () {
        let $this = $(this);
        let itemNum = parseInt($this.text());
        if (isNaN(itemNum) || itemNum < 0) return;
        let itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
        if (!itemLevel) return;
        let perRestoreEnergy = getRestoreEnergyNumByLevel(itemLevel);
        let perConvertEnergy = getGainEnergyNumByLevel(itemLevel);
        totalRestoreEnergy += perRestoreEnergy * itemNum;
        totalConvertEnergy += perConvertEnergy * itemNum;
        $this.attr('title', `全部恢复需要${ perRestoreEnergy * itemNum }点能量，全部转换可得${ perConvertEnergy * itemNum }点能量`);
    });
    $('.kf_fw_ig1:last > tbody > tr:nth-child(2) > td:nth-child(3) > .pd_used_num').attr('title', `全部恢复需要${ totalRestoreEnergy }点能量，全部转换可得${ totalConvertEnergy }点能量`);
};

/**
 * 在我的道具页面中显示当前各种类已使用道具的数量
 * @param {string} html 恢复道具页面的HTML代码（留空表示自动获取HTML代码）
 */
const showCurrentUsedItemNum = function (html = '') {
    /**
     * 显示数量
     * @param {string} html 恢复道具页面的HTML代码
     */
    const show = function (html) {
        let energyNum = getCurrentEnergyNum(html);
        let introMatches = /(1级道具转换得.+?点能量)。<br/.exec(html);
        if (location.pathname === '/kf_fw_ig_my.php') {
            $('.kf_fw_ig_title1:last').find('span:has(.pd_total_energy_num)').remove().end().append(`<span class="pd_custom_tips" style="margin-left: 7px;" title="${ introMatches ? introMatches[1] : '' }">` + `(道具恢复能量 <b class="pd_total_energy_num" style="font-size: 14px;">${ energyNum }</b> 点)</span>`);
        } else {
            $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span').text(energyNum);
        }

        if ($('.pd_used_num').length > 0) {
            let matches = html.match(/">\d+<\/td><td>全部转换本级已使用道具为能量<\/td>/g);
            if (matches) {
                let usedItemNumList = [];
                for (let i in matches) {
                    let usedItemNumMatches = /">(\d+)<\/td>/i.exec(matches[i]);
                    if (usedItemNumMatches) usedItemNumList.push(usedItemNumMatches[1]);
                }
                let $usedNum = $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_used_num');
                if ($usedNum.length === matches.length) {
                    $usedNum.each(function (index) {
                        $(this).text(usedItemNumList[index]);
                    });
                    showUsedItemEnergyTips();
                }
            }
        }
    };

    if (html) {
        show(html);
    } else {
        $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), html => show(html));
    }
};

/**
 * 在我的道具页面中显示当前各种类可使用道具的数量
 * @param {string} html 我的道具页面的HTML代码（留空表示自动获取HTML代码）
 */
const showCurrentUsableItemNum = function (html = '') {
    /**
     * 显示数量
     * @param {string} html 我的道具页面的HTML代码
     */
    const show = function (html) {
        let matches = html.match(/">\d+<\/td><td><a href="kf_fw_ig_my\.php\?lv=/ig);
        if (!matches) return;
        let usableItemNumList = [];
        for (let i in matches) {
            let usableItemNumMatches = /">(\d+)<\/td>/i.exec(matches[i]);
            if (usableItemNumMatches) usableItemNumList.push(usableItemNumMatches[1]);
        }
        $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_usable_num').each(function (index) {
            $(this).text(usableItemNumList[index] ? usableItemNumList[index] : 0);
        });
    };

    if (html) {
        show(html);
    } else {
        $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), html => show(html));
    }
};

/**
 * 获取道具使用情况
 * @param html 争夺首页的HTML代码
 * @returns {Map} 道具使用情况对象
 */
const getItemUsedInfo = exports.getItemUsedInfo = function (html) {
    let itemUsedNumList = new Map([['蕾米莉亚同人漫画', 0], ['十六夜同人漫画', 0], ['档案室钥匙', 0], ['傲娇LOLI娇蛮音CD', 0], ['消逝之药', 0], ['整形优惠卷', 0]]);
    let matches = /道具：\[(蕾米莉亚同人漫画)：(\d+)]\[(十六夜同人漫画)：(\d+)]\[(档案室钥匙)：(\d+)]\[(傲娇LOLI娇蛮音CD)：(\d+)]\[(消逝之药)：(\d+)]\[(整形优惠卷)：(\d+)]/.exec(html);
    if (matches) {
        for (let i = 1; i < matches.length; i += 2) {
            itemUsedNumList.set(matches[i], parseInt(matches[i + 1]));
        }
    }
    return itemUsedNumList;
};

/**
 * 显示道具使用情况
 * @param {jQuery} $links 道具名称的链接列表
 */
const showItemUsedInfo = function ($links) {
    let tipsList = ['仅供参考', '←谁信谁傻逼', '←不管你信不信，反正我是信了', '要是失败了出门左转找XX风', '退KFOL保一生平安', '←这一切都是XX风的阴谋', '这样的几率大丈夫？大丈夫，萌大奶！', '玄不救非，氪不改命', '严重警告：此地的概率学已死', '←概率对非洲人是不适用的', '要相信RP守恒定律'];
    $.get('kf_fw_ig_index.php?t=' + new Date().getTime(), function (html) {
        let itemUsedNumList = getItemUsedInfo(html);
        $links.next('.pd_used_item_info').remove();
        $links.each(function () {
            let $this = $(this);
            let itemName = $this.text();
            if (!itemUsedNumList.has(itemName)) return;
            let usedNum = itemUsedNumList.get(itemName);
            let maxUsedNum = getMaxUsedNumByName(itemName);
            let nextSuccessPercent = 0;
            if (usedNum > maxUsedNum) nextSuccessPercent = 0;else nextSuccessPercent = (1 - usedNum / maxUsedNum) * 100;
            let tips = '';
            if (usedNum < maxUsedNum && usedNum > 0) tips = `（${ tipsList[Math.floor(Math.random() * tipsList.length)] }）`;
            $this.after(`<span class="pd_used_item_info" title="下个道具使用成功几率：${ usedNum >= maxUsedNum ? '无' : nextSuccessPercent.toFixed(2) + '%' }${ tips }">` + `(<span style="${ usedNum >= maxUsedNum ? 'color: #f00;' : '' }">${ usedNum }</span>/<span style="color: #f00;">${ maxUsedNum }</span>)</span>`);
        });
    });
};

/**
 * 添加道具样品的链接
 * @param {jQuery} $nodes 道具名称的节点列表
 */
const addSampleItemsLink = function ($nodes) {
    $nodes.each(function () {
        let $this = $(this);
        let itemName = $this.text().trim();
        let itemLevel = getLevelByName(itemName);
        if (itemName && _Const2.default.sampleItemIdList.has(itemName)) {
            let title = '';
            if (itemName !== '零时迷子的碎片') {
                title = `恢复此道具需${ getRestoreEnergyNumByLevel(itemLevel) }点能量，转换此道具可得${ getGainEnergyNumByLevel(itemLevel) }点能量`;
            } else {
                title = '此道具不可恢复和转换';
            }
            $this.html(`<a href="kf_fw_ig_my.php?pro=${ _Const2.default.sampleItemIdList.get(itemName) }&display=1" title="${ title }">${ itemName }</a>`);
        }
    });
};

/**
 * 添加道具样品提示
 */
const addSampleItemTips = exports.addSampleItemTips = function () {
    let id = parseInt(Util.getUrlParam('pro'));
    if (isNaN(id) || id <= 0) return;
    for (let itemId of _Const2.default.sampleItemIdList.values()) {
        if (id === itemId) {
            $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').find('span:first').after('<span class="pd_notice" style="margin-left: 5px;">(展示用样品)</span>');
            break;
        }
    }
};

/**
 * 购买指定种类的道具
 * @param {{}} options 设置项
 * @param {number} options.itemTypeId 指定的道具种类ID
 * @param {number} options.num 欲购买的道具数量
 * @param {string} options.safeId 用户的SafeID
 * @param {number} options.itemLevel 道具等级
 * @param {string} options.itemName 道具名称
 */
const buyItems = function (options) {
    let settings = {
        itemTypeId: 0,
        num: 0,
        safeId: '',
        itemLevel: 0,
        itemName: ''
    };
    $.extend(settings, options);
    $('.kf_fw_ig1').parent().append(`<ul class="pd_result"><li><strong>【Lv.${ settings.itemLevel }：${ settings.itemName }】购买结果：</strong></li></ul>`);

    let successNum = 0,
        failNum = 0;
    let isStop = false;
    $(document).clearQueue('BatchBuyItems');
    $.each(new Array(settings.num), function (index) {
        $(document).queue('BatchBuyItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_shop.php?lvid=${ settings.itemTypeId }&safeid=${ settings.safeId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('购买道具', html);
                    let { msg, url } = Util.getResponseMsg(html);
                    let matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec(url);
                    if (matches) {
                        successNum++;
                        msg = `获得了<a target="_blank" href="kf_fw_ig_my.php?pro=${ matches[1] }" data-id="${ matches[1] }">一个道具</a>`;
                    } else if (/你需要持有该道具两倍市场价的KFB/.test(html)) {
                        msg = '你需要持有该道具两倍市场价的KFB<span class="pd_notice">（购买操作中止）</span>';
                        isStop = true;
                    }
                    $('.pd_result:last').append(`<li><b>第${ index + 1 }次：</b>${ msg }</li>`);
                },
                error() {
                    failNum++;
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('BatchBuyItems');

                    if (isStop || index === settings.num - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (successNum > 0) {
                            Log.push('购买道具', `共有\`${ successNum }\`个【\`Lv.${ settings.itemLevel }：${ settings.itemName }\`】道具购买成功`, { gain: { '道具': successNum } });
                        }
                        console.log(`共有${ successNum }个【Lv.${ settings.itemLevel }：${ settings.itemName }】道具购买成功` + (failNum > 0 ? `，共有${ failNum }个道具购买失败` : ''));
                        Msg.show(`<strong>共有<em>${ successNum }</em>个【<em>Lv.${ settings.itemLevel }</em>${ settings.itemName }】道具购买成功` + `${ failNum > 0 ? `，共有<em>${ failNum }</em>个道具购买失败` : '' }</strong>`, -1);

                        if (successNum > 0) {
                            $('<li><a href="#">统计购买价格</a></li>').appendTo('.pd_result:last').find('a').click(function (e) {
                                e.preventDefault();
                                let $result = $(this).closest('.pd_result');
                                $(this).parent().remove();
                                Msg.destroy();
                                statBuyItemsPrice($result, settings.itemLevel, settings.itemName);
                            });
                            showItemShopBuyInfo();
                        }
                    } else {
                        setTimeout(() => $(document).dequeue('BatchBuyItems'), typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('BatchBuyItems');
};

/**
 * 统计批量购买道具的购买价格
 * @param {jQuery} $result 购买结果的jQuery对象
 * @param {number} itemLevel 道具等级
 * @param {string} itemName 道具名称
 */
const statBuyItemsPrice = function ($result, itemLevel, itemName) {
    let successNum = 0,
        failNum = 0,
        totalPrice = 0,
        minPrice = 0,
        maxPrice = 0,
        marketPrice = 0,
        totalNum = $result.find('li > a').length;
    $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        if ($this.find('a').text() === itemName) {
            marketPrice = parseInt($this.next('td').find('.pd_item_price').text());
            return false;
        }
    });
    if (!marketPrice) marketPrice = 1;
    Msg.wait(`<strong>正在统计购买价格中&hellip;</strong><i>剩余：<em class="pd_countdown">${ totalNum }</em></i>`);
    $(document).clearQueue('StatBuyItemsPrice');
    $result.find('li > a').each(function (index) {
        let $this = $(this);
        let itemId = $this.data('id');
        if (!itemId) return;
        $(document).queue('StatBuyItemsPrice', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_my.php?pro=${ itemId }&t=${ new Date().getTime() }`,
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let matches = /从商店购买，购买价(\d+)KFB。<br/.exec(html);
                    if (matches) {
                        successNum++;
                        let price = parseInt(matches[1]);
                        totalPrice += price;
                        if (minPrice === 0) minPrice = price;else if (price < minPrice) minPrice = price;
                        if (price > maxPrice) maxPrice = price;
                        $this.after(`（购买价：<b class="pd_highlight">${ price }</b>KFB）`);
                    } else {
                        failNum++;
                        $this.after('<span class="pd_notice">（未能获得预期的回应）</span>');
                    }
                },
                error() {
                    failNum++;
                    $this.after('<span class="pd_notice">（连接超时）</span>');
                },
                complete() {
                    if (index === totalNum - 1) {
                        Msg.destroy();
                        if (successNum > 0) {
                            Log.push('统计道具购买价格', `共有\`${ successNum }\`个【\`Lv.${ itemLevel }：${ itemName }\`】道具统计成功` + `${ failNum > 0 ? `（共有\`${ failNum }\`个道具未能统计成功）` : '' }，总计价格：\`${ totalPrice.toLocaleString() }\`，` + `平均价格：\`${ successNum > 0 ? Util.getFixedNumLocStr(totalPrice / successNum, 2) : 0 }\`` + `(\`${ successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0 }%\`)，` + `最低价格：\`${ minPrice.toLocaleString() }\`(\`${ Math.round(minPrice / marketPrice * 100) }%\`)，` + `最高价格：\`${ maxPrice.toLocaleString() }\`(\`${ Math.round(maxPrice / marketPrice * 100) }%\`)`, { pay: { 'KFB': -totalPrice } });
                        }
                        console.log(`统计道具购买价格（KFB）（共有${ failNum }个道具未能统计成功），统计成功数量：${ successNum }，总计价格：${ totalPrice.toLocaleString() }，` + `平均价格：${ successNum > 0 ? Util.getFixedNumLocStr(totalPrice / successNum, 2) : 0 } ` + `(${ successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0 }%)，最低价格：${ minPrice.toLocaleString() } ` + `(${ Math.round(minPrice / marketPrice * 100) }%)，最高价格：${ maxPrice.toLocaleString() } (${ Math.round(maxPrice / marketPrice * 100) }%)`);
                        $result.append(`
<li class="pd_stat">
  <b>统计结果${ failNum > 0 ? `<span class="pd_notice">（共有${ failNum }个道具未能统计成功）</span>` : '' }：</b><br>
  <i>统计成功数量：<em>${ successNum }</em></i>
  <i>总计价格：<em>${ totalPrice.toLocaleString() }</em></i>
  <i>平均价格：<em>${ successNum > 0 ? Util.getFixedNumLocStr(totalPrice / successNum, 2) : 0 } 
(${ successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0 }%)</em></i>
  <i>最低价格：<em>${ minPrice.toLocaleString() } (${ Math.round(minPrice / marketPrice * 100) }%)</em></i>
  <i>最高价格：<em>${ maxPrice.toLocaleString() } (${ Math.round(maxPrice / marketPrice * 100) }%)</em></i>
</li>
`);
                    } else {
                        setTimeout(() => $(document).dequeue('StatBuyItemsPrice'), _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('StatBuyItemsPrice');
};

/**
 * 在道具商店页面上添加批量购买道具的链接
 */
const addBatchBuyItemsLink = exports.addBatchBuyItemsLink = function () {
    let $shop = $('.kf_fw_ig1:first');

    $shop.find('tbody > tr:nth-child(2)').find('td:nth-child(2)').css('width', '243px').end().find('td:nth-child(3)').css('width', '155px').end().find('td:last-child').css('width', '110px');

    $shop.find('tbody > tr:gt(1)').each(function () {
        $(this).find('td:nth-child(3)').wrapInner('<span class="pd_item_price"></span>').end().find('td:last-child').append('<a class="pd_batch_buy_items" style="margin-left: 15px;" href="#">批量购买</a>');
    });

    $shop.on('click', 'a[href^="kf_fw_ig_shop.php?lvid="]', function () {
        let $this = $(this);
        let itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
        if (!itemLevel) return;
        let itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
        if (!itemName) return;
        if (!confirm(`是否购买【Lv.${ itemLevel }：${ itemName }】道具？`)) {
            return false;
        }
    }).on('click', 'a.pd_batch_buy_items', function (e) {
        e.preventDefault();
        Msg.destroy();
        let $this = $(this);
        let itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
        if (!itemLevel) return;
        let itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
        if (!itemName) return;
        let matches = /lvid=(\d+)&safeid=(\w+)/i.exec($this.prev('a').attr('href'));
        if (!matches) return;
        let itemTypeId = parseInt(matches[1]);
        let safeId = matches[2];
        let num = parseInt(prompt(`你要批量购买多少个【Lv.${ itemLevel }：${ itemName }】道具？`, 0));
        if (!num || num < 0) return;
        Msg.wait(`<strong>正在购买道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${ num }</em></i><a class="pd_stop_action" href="#">停止操作</a>`);
        buyItems({ itemTypeId, num, safeId, itemLevel, itemName });
    });

    $shop.find('tbody > tr:gt(1) > td:nth-child(4)').each(function () {
        let $this = $(this);
        let price = parseInt($this.prev('td').text());
        if (isNaN(price)) return;
        $this.addClass('pd_custom_tips').attr('title', `${ Math.floor(price * 0.5) }~${ price * 2 }（均价：${ Math.floor(price * 1.25) }）`);
    });

    let $itemName = $shop.find('tbody > tr:gt(1) > td:nth-child(2)');
    addSampleItemsLink($itemName);
    showItemUsedInfo($itemName.find('a'));
    showItemShopBuyInfo();
    $shop.find('tbody > tr:first-child > td').append('<br><span class="pd_highlight">想买道具却害怕使用失败？快来试试' + '<a href="read.php?tid=526110" target="_blank" title="喵拉布丁：我绝对没收广告费~">道具使用险</a>吧！</span>');
};

/**
 * 显示道具商店可购买情况
 */
const showItemShopBuyInfo = function () {
    $.get(`profile.php?action=show&uid=${ _Info2.default.uid }&t=${ new Date().getTime() }`, function (html) {
        let matches = /论坛货币：(\d+)\s*KFB<br/i.exec(html);
        if (!matches) return;
        let cash = parseInt(matches[1]);
        $('.kf_fw_ig_title1:last').find('span:last').remove().end().append(`<span style="margin-left: 7px;">(当前持有 <b style="font-size: 14px;">${ cash }</b> KFB)</span>`);
        $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(3) > .pd_item_price').each(function () {
            let $this = $(this);
            $this.next('.pd_verify_tips').remove();
            let price = parseInt($this.text());
            if (isNaN(price)) return;
            let tips = '',
                title = '';
            if (price * 2 <= cash) {
                tips = '<span style="color: #669933;">可买</span>';
                title = '有足够KFB购买此道具';
            } else {
                tips = `<span style="color: #ff0033;">差${ price * 2 - cash }</span>`;
                title = `还差${ price * 2 - cash }KFB才可购买此道具`;
            }
            $this.after(`<span class="pd_verify_tips" title="${ title }" style="font-size: 12px; margin-left: 3px;">(${ tips })</span>`);
        });
    });
};

/**
 * 修正道具描述
 */
const modifyItemDescription = exports.modifyItemDescription = function () {
    let $area = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child');
    let matches = /道具名称：(.+)/.exec($area.find('span:first').text().trim());
    if (!matches) return;
    let itemName = matches[1];
    let itemDescReplaceList = new Map([['蕾米莉亚同人漫画', ['燃烧伤害+1。上限50。', '力量+1，体质+1；满50本时，追加+700生命值。']], ['十六夜同人漫画', ['命中+3，闪避+1。上限50。', '敏捷+1，灵活+1；满50本时，追加+100攻击速度。']], ['档案室钥匙', ['暴击伤害加成+10%。上限30。', '增加5%盒子获得概率[原概率*(100%+追加概率)]；满30枚时，增加50点可分配点数。']], ['傲娇LOLI娇蛮音CD', ['闪避+3，命中+1。上限30。', '降低对手生命值上限的0.5%；满30张时，追加降低对手10%攻击力。']], ['整形优惠卷', [['暴击几率+3%。上限10。'], ['在获得盒子时，增加3%的几率直接获得高一级的盒子；<br>满10张时，这个概率直接提升为50%(无法将传奇盒子升级为神秘盒子)。']]], ['消逝之药', ['消除伤害。<br>防御效果+7%。上限10。', '所有属性+5(不含耐力、幸运)；满10瓶时，追加200点可分配点数。']]]);
    if (itemDescReplaceList.has(itemName)) {
        $area.html($area.html().replace(itemDescReplaceList.get(itemName)[0], itemDescReplaceList.get(itemName)[1]));
    }
};

},{"./Config":4,"./Const":6,"./Info":10,"./Log":12,"./Msg":15,"./Public":18,"./Util":22}],12:[function(require,module,exports){
/* 日志模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMergeLog = exports.push = exports.clear = exports.write = exports.read = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 保存日志的键值名称
const name = _Const2.default.storagePrefix + 'log';

/**
 * 读取日志
 * @returns {{}} 日志对象
 */
const read = exports.read = function () {
    let log = {};
    let options = null;
    if (_Info2.default.storageType === 'ByUid' || _Info2.default.storageType === 'Global') options = GM_getValue(name + '_' + _Info2.default.uid);else options = localStorage.getItem(name + '_' + _Info2.default.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    log = options;
    if (!Util.getCookie(_Const2.default.checkOverdueLogCookieName)) deleteOverdueLog(log);
    return log;
};

/**
 * 写入日志
 * @param {{}} log 日志对象
 */
const write = exports.write = function (log) {
    if (_Info2.default.storageType === 'ByUid' || _Info2.default.storageType === 'Global') GM_setValue(name + '_' + _Info2.default.uid, JSON.stringify(log));else localStorage.setItem(name + '_' + _Info2.default.uid, JSON.stringify(log));
};

/**
 * 清除日志
 */
const clear = exports.clear = function () {
    if (_Info2.default.storageType === 'ByUid' || _Info2.default.storageType === 'Global') GM_deleteValue(name + '_' + _Info2.default.uid);else localStorage.removeItem(name + '_' + _Info2.default.uid);
};

/**
 * 删除过期日志
 * @param {{}} log 日志对象
 */
const deleteOverdueLog = function (log) {
    let dateList = Util.getObjectKeyList(log, 1);
    let overdueDate = Util.getDateString(Util.getDate(`-${ Config.logSaveDays }d`));
    let isDeleted = false;
    for (let date of dateList) {
        if (date <= overdueDate) {
            delete log[date];
            isDeleted = true;
        } else break;
    }
    if (isDeleted) write(log);
    Util.setCookie(_Const2.default.checkOverdueLogCookieName, 1, Util.getMidnightHourDate(1));
};

/**
 * 记录一条新日志
 * @param {string} type 日志类别
 * @param {string} action 行为
 * @param {?{}} gain 收获
 * @param {?{}} pay 付出
 */
const push = exports.push = function (type, action, { gain = null, pay = null } = {}) {
    let date = new Date();
    let time = date.getTime();
    let today = Util.getDateString(date);
    let obj = { time, type, action };
    if (gain) obj['gain'] = gain;
    if (pay) obj['pay'] = pay;
    let log = read();
    if (!Array.isArray(log[today])) log[today] = [];
    log[today].push(obj);
    write(log);
};

/**
 * 获取合并后的日志
 * @param {{}} log 当前日志
 * @param {{}} newLog 新日志
 * @returns {{}} 合并后的日志
 */
const getMergeLog = exports.getMergeLog = function (log, newLog) {
    for (let date in newLog) {
        if (!Array.isArray(log[date])) {
            log[date] = newLog[date];
        } else {
            for (let newItem of newLog[date]) {
                if (typeof newItem.time !== 'number' || typeof newItem.type !== 'string') continue;
                let index = log[date].findIndex(item => newItem['time'] === item['time'] && newItem['type'] === item['type']);
                if (index > -1) log[date][index] = newItem;else log[date].push(newItem);
            }
            log[date].sort((a, b) => a.time > b.time);
        }
    }
    return log;
};

},{"./Const":6,"./Info":10,"./Util":22}],13:[function(require,module,exports){
/* 日志对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = undefined;

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Func = require('./Func');

var Func = _interopRequireWildcard(_Func);

var _Config = require('./Config');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Item = require('./Item');

var Item = _interopRequireWildcard(_Item);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 显示日志对话框
 */
const show = exports.show = function () {
    const dialogName = 'pdLogDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    Func.run('LogDialog.show_before_');
    let html = `
<div class="pd_cfg_main">
  <div class="pd_log_nav">
    <a class="pd_disabled_link" href="#">&lt;&lt;</a>
    <a style="padding: 0 7px;" class="pd_disabled_link" href="#">&lt;</a>
    <h2 class="pd_custom_tips">暂无日志</h2>
    <a style="padding: 0 7px;" class="pd_disabled_link" href="#">&gt;</a>
    <a class="pd_disabled_link" href="#">&gt;&gt;</a>
  </div>
  <fieldset>
    <legend>日志内容</legend>
    <div>
      <strong>排序方式：</strong>
      <label title="按时间顺序排序"><input type="radio" name="sortType" value="time" checked> 按时间</label>
      <label title="按日志类别排序"><input type="radio" name="sortType" value="type"> 按类别</label>
    </div>
    <div class="pd_stat pd_log_content">暂无日志</div>
  </fieldset>
  <fieldset>
    <legend>统计结果</legend>
    <div>
      <strong>统计范围：</strong>
      <label title="显示当天的统计结果"><input type="radio" name="statType" value="current" checked> 当天</label>
      <label title="显示距该日N天内的统计结果"><input type="radio" name="statType" value="custom"></label>
      <label title="显示距该日N天内的统计结果"><input name="statDays" type="text" style="width: 22px;" maxlength="3"> 天内</label>
      <label title="显示全部统计结果"><input type="radio" name="statType" value="all"> 全部</label>
    </div>
    <div class="pd_stat" data-name="stat">暂无日志</div>
  </fieldset>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExLogDialog" href="#">导入/导出日志</a></span>
  <button>关闭</button> <button>清除日志</button>
</div>`;
    let $dialog = Dialog.create(dialogName, 'KFOL助手日志', html, 'width: 880px;');

    let log = Log.read();
    let dateList = [];
    let curIndex = 0;
    if (!$.isEmptyObject(log)) {
        dateList = Util.getObjectKeyList(log, 1);
        curIndex = dateList.length - 1;
        $dialog.find('.pd_log_nav h2').attr('title', `总共记录了${ dateList.length }天的日志`).text(dateList[curIndex]);
        if (dateList.length > 1) {
            $dialog.find('.pd_log_nav > a:eq(0)').attr('title', dateList[0]).removeClass('pd_disabled_link');
            $dialog.find('.pd_log_nav > a:eq(1)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
        }
    }
    $dialog.find('.pd_log_nav a').click(function (e) {
        e.preventDefault();
        if ($(this).is('.pd_log_nav a:eq(0)')) {
            curIndex = 0;
        } else if ($(this).is('.pd_log_nav a:eq(1)')) {
            if (curIndex > 0) curIndex--;else return;
        } else if ($(this).is('.pd_log_nav a:eq(2)')) {
            if (curIndex < dateList.length - 1) curIndex++;else return;
        } else if ($(this).is('.pd_log_nav a:eq(3)')) {
            curIndex = dateList.length - 1;
        }
        $dialog.find('.pd_log_nav h2').text(dateList[curIndex]);
        showLogContent(log, dateList[curIndex], $dialog);
        showLogStat(log, dateList[curIndex], $dialog);
        if (curIndex > 0) {
            $dialog.find('.pd_log_nav > a:eq(0)').attr('title', dateList[0]).removeClass('pd_disabled_link');
            $dialog.find('.pd_log_nav > a:eq(1)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
        } else {
            $dialog.find('.pd_log_nav > a:lt(2)').removeAttr('title').addClass('pd_disabled_link');
        }
        if (curIndex < dateList.length - 1) {
            $dialog.find('.pd_log_nav > a:eq(2)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
            $dialog.find('.pd_log_nav > a:eq(3)').attr('title', dateList[dateList.length - 1]).removeClass('pd_disabled_link');
        } else {
            $dialog.find('.pd_log_nav > a:gt(1)').removeAttr('title').addClass('pd_disabled_link');
        }
    }).end().find('[name="sortType"]').click(function () {
        let value = $(this).val();
        if (Config.logSortType !== value) {
            Config.logSortType = value;
            (0, _Config.write)();
            showLogContent(log, dateList[curIndex], $dialog);
        }
    }).end().find('[name="statType"]').click(function () {
        let value = $(this).val();
        if (Config.logStatType !== value) {
            Config.logStatType = value;
            (0, _Config.write)();
            showLogStat(log, dateList[curIndex], $dialog);
        }
    }).end().find('[name="statDays"]').keyup(function () {
        let days = parseInt($(this).val());
        if (days > 0 && Config.logStatDays !== days) {
            Config.logStatDays = days;
            (0, _Config.write)();
            $dialog.find('[name="statType"][value="custom"]:not(:checked)').click();
            showLogStat(log, dateList[curIndex], $dialog);
        }
    }).end().find(`[name="sortType"][value="${ Config.logSortType }"]`).click().end().find(`[name="statType"][value="${ Config.logStatType }"]`).click().end().find('[name="statDays"]').val(Config.logStatDays);

    $dialog.find('.pd_cfg_btns > button:first').click(() => Dialog.close(dialogName)).next('button').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有日志？')) {
            Log.clear();
            alert('日志已清除');
            location.reload();
        }
    });

    $dialog.find('[data-name="openImOrExLogDialog"]').click(function (e) {
        e.preventDefault();
        showImportOrExportLogDialog();
    });

    showLogContent(log, dateList[curIndex], $dialog);
    showLogStat(log, dateList[curIndex], $dialog);

    if ($(window).height() <= 750) $dialog.find('.pd_log_content').css('height', '216px');
    Dialog.show(dialogName);
    $dialog.find('input:first').focus();
    Func.run('LogDialog.show_after_');
};

/**
 * 显示指定日期的日志内容
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {jQuery} $dialog 日志对话框对象
 */
const showLogContent = function (log, date, $dialog) {
    if (!Array.isArray(log[date])) return;
    $dialog.find('.pd_log_content').html(getLogContent(log, date, Config.logSortType)).parent().find('legend:first-child').text(`日志内容 (共${ log[date].length }项)`);
};

/**
 * 获取指定日期的日志内容
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {string} logSortType 日志内容的排序方式
 * @returns {string} 指定日期的日志内容
 */
const getLogContent = function (log, date, logSortType) {
    let logList = log[date];
    if (logSortType === 'type') {
        const sortTypeList = ['捐款', '领取争夺奖励', '批量攻击', '试探攻击', '抽取神秘盒子', '抽取道具或卡片', '使用道具', '恢复道具', '循环使用道具', '将道具转换为能量', '将卡片转换为VIP时间', '购买道具', '统计道具购买价格', '出售道具', '神秘抽奖', '统计神秘抽奖结果', '神秘等级升级', '神秘系数排名变化', '批量转账', '购买帖子', '自动存款'];
        logList.sort((a, b) => sortTypeList.indexOf(a.type) > sortTypeList.indexOf(b.type));
    } else {
        logList.sort((a, b) => a.time > b.time);
    }

    let content = '',
        curType = '';
    for (let { time, type, action, gain, pay } of logList) {
        if (typeof time === 'undefined' || typeof type === 'undefined' || typeof action === 'undefined') continue;
        let d = new Date(time);
        if (logSortType === 'type') {
            if (curType !== type) {
                content += `<h3>【${ type }】</h3>`;
                curType = type;
            }
            content += `<p><b>${ Util.getTimeString(d) }：</b>${ action.replace(/`([^`]+?)`/g, '<b style="color: #f00;">$1</b>') }`;
        } else {
            content += `<p><b>${ Util.getTimeString(d) } (${ type })：</b>${ action.replace(/`([^`]+?)`/g, '<b style="color: #f00;">$1</b>') }`;
        }

        let stat = '';
        if ($.type(gain) === 'object' && !$.isEmptyObject(gain)) {
            stat += '，';
            for (let k of Object.keys(gain)) {
                if (k === 'item') {
                    for (let itemName of Object.keys(gain[k])) {
                        stat += `<i>${ itemName }<em>+${ gain[k][itemName].toLocaleString() }</em></i> `;
                    }
                } else {
                    stat += `<i>${ k }<em>+${ gain[k].toLocaleString() }</em></i> `;
                }
            }
        }
        if ($.type(pay) === 'object' && !$.isEmptyObject(pay)) {
            if (!stat) stat += '，';
            for (let k of Object.keys(pay)) {
                if (k === 'item') {
                    for (let itemName of Object.keys(pay[k])) {
                        stat += `<i>${ itemName }<ins>${ pay[k][itemName].toLocaleString() }</ins></i> `;
                    }
                } else {
                    stat += `<i>${ k }<ins>${ pay[k].toLocaleString() }</ins></i> `;
                }
            }
        }

        content += stat + '</p>';
    }

    return content;
};

/**
 * 显示指定日期的日志统计结果
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {jQuery} $dialog 日志对话框对象
 */
const showLogStat = function (log, date, $dialog) {
    if (!Array.isArray(log[date])) return;
    $dialog.find('[data-name="stat"]').html(getLogStat(log, date, Config.logStatType));
};

/**
 * 获取指定日期的日志统计结果
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {string} logStatType 日志统计范围类型
 * @returns {string} 指定日期的日志统计结果
 */
const getLogStat = function (log, date, logStatType) {
    let rangeLog = {};

    if (logStatType === 'custom') {
        let minDate = new Date(date);
        minDate.setDate(minDate.getDate() - Config.logStatDays + 1);
        minDate = Util.getDateString(minDate);
        for (let d of Util.getObjectKeyList(log, 1)) {
            if (d >= minDate && d <= date) rangeLog[d] = log[d];
        }
    } else if (logStatType === 'all') {
        rangeLog = log;
    } else {
        rangeLog[date] = log[date];
    }

    let income = {},
        expense = {},
        profit = {};
    let validItemNum = 0,
        highValidItemNum = 0,
        validItemStat = {},
        invalidItemNum = 0,
        highInvalidItemNum = 0,
        invalidItemStat = {};
    let buyItemTotalNum = 0,
        buyItemTotalPrice = 0,
        totalBuyItemPricePercent = 0,
        minBuyItemPricePercent = 0,
        maxBuyItemPricePercent = 0,
        buyItemStat = {};
    let invalidKeyList = ['item', '夺取KFB', 'VIP小时', '神秘', '燃烧伤害', '命中', '闪避', '暴击比例', '暴击几率', '防御', '有效道具', '无效道具'];
    for (let d in rangeLog) {
        for (let { type, action, gain, pay, notStat } of rangeLog[d]) {
            if (typeof type === 'undefined' || typeof notStat !== 'undefined') continue;
            if ($.type(gain) === 'object') {
                for (let k of Object.keys(gain)) {
                    if (invalidKeyList.includes(k)) continue;
                    if (typeof income[k] === 'undefined') income[k] = gain[k];else income[k] += gain[k];
                }
            }
            if ($.type(pay) === 'object') {
                for (let k of Object.keys(pay)) {
                    if (invalidKeyList.includes(k)) continue;
                    if (typeof expense[k] === 'undefined') expense[k] = pay[k];else expense[k] += pay[k];
                }
            }

            if ((type === '使用道具' || type === '循环使用道具') && $.type(gain) === 'object') {
                let matches = /【`Lv.(\d+)：(.+?)`】/.exec(action);
                if (matches) {
                    let itemLevel = parseInt(matches[1]);
                    let itemName = matches[2];
                    if (gain['有效道具'] > 0) {
                        validItemNum += gain['有效道具'];
                        if (itemLevel >= 3) highValidItemNum += gain['有效道具'];
                        if (typeof validItemStat[itemName] === 'undefined') validItemStat[itemName] = 0;
                        validItemStat[itemName] += gain['有效道具'];
                    }
                    if (gain['无效道具'] > 0) {
                        invalidItemNum += gain['无效道具'];
                        if (itemLevel >= 3) highInvalidItemNum += gain['无效道具'];
                        if (typeof invalidItemStat[itemName] === 'undefined') invalidItemStat[itemName] = 0;
                        invalidItemStat[itemName] += gain['无效道具'];
                    }
                }
            } else if (type === '统计道具购买价格' && $.type(pay) === 'object' && typeof pay['KFB'] !== 'undefined') {
                let matches = /共有`(\d+)`个【`Lv.\d+：(.+?)`】道具统计成功，总计价格：`[^`]+?`，平均价格：`[^`]+?`\(`(\d+)%`\)，最低价格：`[^`]+?`\(`(\d+)%`\)，最高价格：`[^`]+?`\(`(\d+)%`\)/.exec(action);
                if (matches) {
                    let itemNum = parseInt(matches[1]);
                    let itemName = matches[2];
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
                    buyItemTotalPrice += Math.abs(pay['KFB']);
                    buyItemStat[itemName]['总计价格'] += Math.abs(pay['KFB']);
                    totalBuyItemPricePercent += parseInt(matches[3]) * itemNum;
                    buyItemStat[itemName]['总计价格比例'] += parseInt(matches[3]) * itemNum;
                    if (minBuyItemPricePercent <= 0 || parseInt(matches[4]) < minBuyItemPricePercent) minBuyItemPricePercent = parseInt(matches[4]);
                    if (parseInt(matches[5]) > maxBuyItemPricePercent) maxBuyItemPricePercent = parseInt(matches[5]);
                    if (buyItemStat[itemName]['最低价格比例'] <= 0 || parseInt(matches[4]) < buyItemStat[itemName]['最低价格比例']) buyItemStat[itemName]['最低价格比例'] = parseInt(matches[4]);
                    if (parseInt(matches[5]) > buyItemStat[itemName]['最高价格比例']) buyItemStat[itemName]['最高价格比例'] = parseInt(matches[5]);
                }
            }
        }
    }

    let content = '';
    let sortStatTypeList = ['KFB', '经验值', '能量', '贡献', '道具', '已使用道具', '卡片'];
    content += '<strong>收获：</strong>';
    for (let key of Util.getSortedObjectKeyList(sortStatTypeList, income)) {
        profit[key] = income[key];
        content += `<i>${ key }<em>+${ income[key].toLocaleString() }</em></i> `;
    }
    content += '<br><strong>付出：</strong>';
    for (let key of Util.getSortedObjectKeyList(sortStatTypeList, expense)) {
        if (typeof profit[key] === 'undefined') profit[key] = expense[key];else profit[key] += expense[key];
        content += `<i>${ key }<ins>${ expense[key].toLocaleString() }</ins></i> `;
    }
    content += '<br><strong>结余：</strong>';
    for (let key of Util.getSortedObjectKeyList(sortStatTypeList, profit)) {
        content += `<i>${ key }${ Util.getStatFormatNumber(profit[key]) }</i> `;
    }

    content += '<div style="margin: 5px 0; border-bottom: 1px dashed #ccccff;"></div>';

    const sortItemTypeList = ['零时迷子的碎片', '被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画', '十六夜同人漫画', '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药'];
    content += `\n<strong>有效道具统计：</strong><i>有效道具<span class="pd_stat_extra"><em>+${ validItemNum.toLocaleString() }</em>` + `(<em title="3级以上有效道具">+${ highValidItemNum.toLocaleString() }</em>)</i></span> `;
    for (let itemName of Util.getSortedObjectKeyList(sortItemTypeList, validItemStat)) {
        content += `<i>${ itemName }<em>+${ validItemStat[itemName].toLocaleString() }</em></i> `;
    }
    content += `<br><strong>无效道具统计：</strong><i>无效道具<span class="pd_stat_extra"><em>+${ invalidItemNum.toLocaleString() }</em>` + `(<em title="3级以上无效道具">+${ highInvalidItemNum.toLocaleString() }</em>)</i></span> `;
    for (let itemName of Util.getSortedObjectKeyList(sortItemTypeList, invalidItemStat)) {
        content += `<i>${ itemName }<em>+${ invalidItemStat[itemName].toLocaleString() }</em></i> `;
    }

    let buyItemStatContent = '';
    let buyItemStatKeyList = Util.getObjectKeyList(buyItemStat, 0);
    buyItemStatKeyList.sort((a, b) => Item.getLevelByName(a) > Item.getLevelByName(b));
    for (let key of buyItemStatKeyList) {
        let item = buyItemStat[key];
        buyItemStatContent += `<i class="pd_custom_tips" title="总价：${ item['总计价格'].toLocaleString() }，` + `平均价格比例：${ item['道具数量'] > 0 ? Util.getFixedNumLocStr(item['总计价格比例'] / item['道具数量'], 2) : 0 }%，` + `最低价格比例：${ item['最低价格比例'] }%，最高价格比例：${ item['最高价格比例'] }%">${ key }<em>+${ item['道具数量'] }</em></i> `;
    }
    content += `<br><strong>购买道具统计：</strong><i>道具<em>+${ buyItemTotalNum }</em></i> ` + `<i>道具价格<span class="pd_stat_extra"><em title="道具总价">+${ buyItemTotalPrice.toLocaleString() }</em>` + `(<em title="平均价格比例">${ buyItemTotalNum > 0 ? Util.getFixedNumLocStr(totalBuyItemPricePercent / buyItemTotalNum, 2) : 0 }%</em>|` + `<em title="最低价格比例">${ minBuyItemPricePercent }%</em>|<em title="最高价格比例">${ maxBuyItemPricePercent }%</em>)</span></i> ${ buyItemStatContent }`;

    return content;
};

/**
 * 显示导入或导出日志对话框
 */
const showImportOrExportLogDialog = function () {
    const dialogName = 'pdImOrExLogDialog';
    if ($('#' + dialogName).length > 0) return;
    let log = Log.read();
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px;">
    <label style="color: #f00;"><input type="radio" name="logType" value="setting" checked> 导入/导出日志</label>
    <label style="color: #00f;"><input type="radio" name="logType" value="text"> 导出日志文本</label>
  </div>
  <div data-name="logSetting">
    <strong>导入日志：</strong>将日志内容粘贴到文本框中并点击合并或覆盖按钮即可<br>
    <strong>导出日志：</strong>复制文本框里的内容并粘贴到文本文件里即可<br>
    <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>
  </div>
  <div data-name="logText" style="display: none;">
    <strong>导出日志文本</strong>：复制文本框里的内容并粘贴到文本文件里即可
    <div>
      <label title="按时间顺序排序"><input type="radio" name="sortType2" value="time" checked> 按时间</label>
      <label title="按日志类别排序"><input type="radio" name="sortType2" value="type"> 按类别</label>
      <label title="在日志文本里显示每日以及全部数据的统计结果"><input type="checkbox" name="showStat" checked> 显示统计</label>
    </div>
    <textarea name="text" style="width: 600px; height: 400px;" readonly></textarea>
  </div>
</div>
<div class="pd_cfg_btns">
  <button name="merge">合并日志</button>
  <button name="overwrite" style="color: #f00;">覆盖日志</button>
  <button>关闭</button>
</div>`;

    let $dialog = Dialog.create(dialogName, '导入或导出日志', html);
    $dialog.find('[name="sortType2"], [name="showStat"]').click(function () {
        showLogText(log, $dialog);
        $dialog.find('[name="text"]').select();
    }).end().find('[name="logType"]').click(function () {
        let type = $(this).val();
        $dialog.find(`[data-name="log${ type === 'text' ? 'Setting' : 'Text' }"]`).hide();
        $dialog.find(`[data-name="log${ type === 'text' ? 'Text' : 'Setting' }"]`).show();
        $dialog.find(`[data-name="log${ type === 'text' ? 'Text' : 'Setting' }"]`).select();
    }).end().find('.pd_cfg_btns > button').click(function (e) {
        e.preventDefault();
        let name = $(this).attr('name');
        if (name === 'merge' || name === 'overwrite') {
            if (!confirm(`是否将文本框中的日志${ name === 'overwrite' ? '覆盖' : '合并' }到本地日志？`)) return;
            let newLog = $.trim($dialog.find('[name="setting"]').val());
            if (!newLog) return;
            try {
                newLog = JSON.parse(newLog);
            } catch (ex) {
                alert('日志有错误');
                return;
            }
            if (!newLog || $.type(newLog) !== 'object') {
                alert('日志有错误');
                return;
            }
            if (name === 'merge') log = Log.getMergeLog(log, newLog);else log = newLog;
            Log.write(log);
            alert('日志已导入');
            location.reload();
        } else {
            return Dialog.close(dialogName);
        }
    });
    Dialog.show(dialogName);
    $dialog.find('[name="setting"]').val(JSON.stringify(log)).select();
    $dialog.find(`[name="sortType2"][value="${ Config.logSortType }"]`).prop('checked', true).triggerHandler('click');
    Func.run('LogDialog.showImportOrExportLogDialog_after_');
};

/**
 * 显示日志文本
 * @param {{}} log 日志对象
 * @param {jQuery} $dialog 导入或导出日志对话框对象
 */
const showLogText = function (log, $dialog) {
    let logSortType = $dialog.find('input[name="sortType2"]:checked').val();
    let isShowStat = $dialog.find('[name="showStat"]').prop('checked');
    let content = '',
        lastDate = '';
    for (let date of Object.keys(log)) {
        if (!Array.isArray(log[date])) continue;
        if (lastDate > date) lastDate = date;
        content += `【${ date }】(共${ log[date].length }项)\n${ logSortType === 'type' ? '' : '\n' }` + getLogContent(log, date, logSortType).replace(/<h3>/g, '\n').replace(/<\/h3>/g, '\n').replace(/<\/p>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '').replace(/`/g, '');
        if (isShowStat) {
            content += `${ '-'.repeat(46) }\n合计：\n${ getLogStat(log, date, 'current').replace(/<br\s*\/?>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '') }\n`;
        }
        content += '='.repeat(46) + '\n';
    }
    if (content && isShowStat) {
        content += '\n总计：\n' + getLogStat(log, lastDate, 'all').replace(/<br\s*\/?>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '');
    }
    $dialog.find('[name="text"]').val(content);
};

},{"./Config":4,"./Dialog":7,"./Func":8,"./Item":11,"./Log":12,"./Util":22}],14:[function(require,module,exports){
/* 争夺模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addUserLinkInPkListPage = exports.enhanceLootIndexPage = undefined;

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Config = require('./Config');

var _Item = require('./Item');

var Item = _interopRequireWildcard(_Item);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 争夺首页区域
let $lootArea;
// 争夺属性区域
let $properties;
// 属性点区域
let $points;
// 当前争夺属性
let propertyList;
// 附加属性点列表
let extraPointList;
// 道具使用情况
let itemUsedNumList;

/**
 * 增强争夺首页
 */
const enhanceLootIndexPage = exports.enhanceLootIndexPage = function () {
    $lootArea = $('.kf_fw_ig1:first');
    $properties = $lootArea.find('> tbody > tr:nth-child(3) > td:first-child');
    $points = $lootArea.find('> tbody > tr:nth-child(3) > td:nth-child(2)');
    propertyList = getLootPropertyList();
    extraPointList = getExtraPointList();
    itemUsedNumList = Item.getItemUsedInfo($lootArea.find('> tbody > tr:nth-child(4) > td').html());
    handlePropertiesArea();
    handlePointsArea();
    addLevelPointListSelect();
    enhanceLootLog();
};

/**
 * 处理争夺属性区域
 */
const handlePropertiesArea = function () {
    let tipsIntro = '灵活和智力的抵消机制：\n战斗开始前，会重新计算战斗双方的灵活和智力；灵活=(自己的灵活值-(双方灵活值之和 x 33%))；智力=(自己的智力值-(双方智力值之和 x 33%))';
    let html = $properties.html().replace(/(攻击力：)(\d+)/, '$1<span id="pdPro_s1" title="原值：$2">$2</span> <span id="pdNew_s1"></span>').replace(/(生命值：\d+)\s*\(最大(\d+)\)/, '$1 (最大<span id="pdPro_s2" title="原值：$2">$2</span>) <span id="pdNew_s2"></span>').replace(/(攻击速度：)(\d+)/, '$1<span id="pdPro_d1" title="原值：$2">$2</span> <span id="pdNew_d1"></span>').replace(/(暴击几率：)(\d+)%\s*\(抵消机制见说明\)/, `$1<span id="pdPro_d2" title="原值：$2">$2</span>% <span class="pd_cfg_tips" title="${ tipsIntro }">[?]</span> <span id="pdNew_d2"></span>`).replace(/(技能释放概率：)(\d+)%\s*\(抵消机制见说明\)/, `$1<span id="pdPro_i1" title="原值：$2">$2</span>% <span class="pd_cfg_tips" title="${ tipsIntro }">[?]</span> <span id="pdNew_i1"></span>`).replace(/(防御：)(\d+)%减伤/, '$1<span id="pdPro_i2" title="原值：$2">$2</span>%减伤 <span id="pdNew_i2"></span>').replace('技能伤害：攻击伤害+(体质点数*6)', '技能伤害：<span class="pd_custom_tips" id="pdSkillAttack" title="攻击伤害+(体质点数*6)"></span>');
    $properties.html(html).find('br:first').after('<span>剩余属性点：<span id="pdSurplusPoint"></span></span><br>');

    $properties.on('click', '[id^="pdPro_"]', function () {
        let $this = $(this);
        $this.hide();
        let name = $this.attr('id').replace('pdPro_', '');
        let step = 1;
        if (name === 's1') step = 5;else if (name === 's2') step = 20;else if (name === 'd1') step = 2;
        $(`<input data-name="${ name }" type="number" value="${ parseInt($this.text()) }" min="1" step="${ step }" ` + `style="width: 65px; margin-right: 5px;" title="${ $this.attr('title') }">`).insertAfter($this).focus().select().blur(function () {
            let $this = $(this);
            let name = $this.data('name');
            let num = parseInt($this.val());
            if (num > 0) {
                $points.find(`[name="${ name }"]`).val(getPointByProperty(getPointNameByFieldName(name), num)).trigger('change');
            }
            $this.prev().show().end().remove();
        }).keyup(function (e) {
            let $this = $(this);
            if (e.keyCode === 13) $this.blur();else if (e.keyCode === 27) $this.val('').blur();
        });
    }).find('[id^=pdPro_]').css('cursor', 'pointer');
};

/**
 * 处理属性点区域
 */
const handlePointsArea = function () {
    $points.find('[type="text"]').attr('type', 'number').attr('min', 1).attr('max', 999).prop('required', true).css('width', '60px');
    $points.find('input[readonly]').attr('min', 0).prop('disabled', true).removeProp('required', true);

    $points.on('change', '[type="number"]', function () {
        let $this = $(this);
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('[type="number"]'));
        $('#pdSurplusPoint').text(surplusPoint).css('color', surplusPoint !== 0 ? '#f00' : '#000').css('font-weight', surplusPoint !== 0 ? 'bold' : 'normal');
        showNewLootProperty($this);
        showSumOfPoint($this);
        $('#pdSkillAttack').text(getSkillAttack(parseInt($lootArea.find('[name="s1"]').val()), parseInt($lootArea.find('[name="s2"]').val())));
    }).on('click', '.pd_point_sum', function () {
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('[type="number"]'));
        if (!surplusPoint) return;
        let $point = $(this).prev('span').prev('[type="number"]');
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        $point.val(num + surplusPoint).trigger('change');
    }).find('form').submit(function () {
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('[type="number"]'));
        if (surplusPoint < 0) {
            alert('剩余属性点为负，请重新填写');
            return false;
        } else if (surplusPoint > 0) {
            return confirm('你的可分配属性点尚未用完，是否提交？');
        }
    }).find('[type="number"]').trigger('change');
};

/**
 * 获取争夺属性列表
 * @returns {Map} 争夺属性
 */
const getLootPropertyList = function () {
    let propertyList = new Map([['攻击力', 0], ['最大生命值', 0], ['攻击速度', 0], ['暴击几率', 0], ['技能释放概率', 0], ['防御', 0], ['可分配属性点', 0]]);
    let html = $properties.html();
    let matches = /攻击力：(\d+)/.exec(html);
    if (matches) propertyList.set('攻击力', parseInt(matches[1]));
    matches = /生命值：\d+\s*\(最大(\d+)\)/.exec(html);
    if (matches) propertyList.set('最大生命值', parseInt(matches[1]));
    matches = /攻击速度：(\d+)/.exec(html);
    if (matches) propertyList.set('攻击速度', parseInt(matches[1]));
    matches = /暴击几率：(\d+)%/.exec(html);
    if (matches) propertyList.set('暴击几率', parseInt(matches[1]));
    matches = /技能释放概率：(\d+)%/.exec(html);
    if (matches) propertyList.set('技能释放概率', parseInt(matches[1]));
    matches = /防御：(\d+)%/.exec(html);
    if (matches) propertyList.set('防御', parseInt(matches[1]));
    matches = /可分配属性点：(\d+)/.exec(html);
    if (matches) propertyList.set('可分配属性点', parseInt(matches[1]));
    return propertyList;
};

/**
 * 获取当前已分配的属性点
 * @param {jQuery} $points 属性点字段对象
 * @returns {number} 当前已分配的属性点
 */
const getCurrentAssignedPoint = function ($points) {
    let usedPoint = 0;
    $points.each(function () {
        let point = parseInt($(this).val());
        if (point && point > 0) usedPoint += point;
    });
    return usedPoint;
};

/**
 * 获取技能伤害的值
 * @param {number} s1 力量
 * @param {number} s2 体质
 * @returns {number} 技能伤害的值
 */
const getSkillAttack = (s1, s2) => (s1 + extraPointList.get('力量')) * 5 + s2 * 6;

/**
 * 显示各项属性点的和值
 * @param {jQuery} $point 属性点字段对象
 */
const showSumOfPoint = function ($point) {
    let num = parseInt($point.val());
    if (isNaN(num) || num < 0) num = 0;
    let extraNum = parseInt($point.next('span').text());
    let $sum = $point.next('span').next('.pd_point_sum');
    if (!$sum.length) {
        $sum = $('<span class="pd_point_sum" style="color: #ff0033; cursor: pointer;" title="点击：给该项加上或减去剩余属性点"></span>').insertAfter($point.next('span'));
    }
    $sum.text('=' + (num + extraNum));
};

/**
 * 获取附加属性点列表
 * @returns {Map} 附加属性点列表
 */
const getExtraPointList = function () {
    let extraPointList = new Map([['力量', 0], ['体质', 0], ['敏捷', 0], ['灵活', 0], ['智力', 0], ['意志', 0], ['耐力', 0], ['幸运', 0]]);
    $points.find('[type="text"]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        let num = parseInt($this.next('span').text());
        let key = getPointNameByFieldName(name);
        if (!isNaN(num) && key) {
            extraPointList.set(key, num);
        }
    });
    return extraPointList;
};

/**
 * 根据字段名称获取属性点名称
 * @param {string} fieldName 字段名称
 * @returns {string} 属性点名称
 */
const getPointNameByFieldName = function (fieldName) {
    switch (fieldName) {
        case 's1':
            return '力量';
        case 's2':
            return '体质';
        case 'd1':
            return '敏捷';
        case 'd2':
            return '灵活';
        case 'i1':
            return '智力';
        case 'i2':
            return '意志';
        case 'p':
            return '耐力';
        case 'l':
            return '幸运';
        default:
            return '';
    }
};

/**
 * 根据属性点名称获取字段名称
 * @param {string} pointName 属性点名称
 * @returns {string} 字段名称
 */
const getFieldNameByPointName = function (pointName) {
    switch (pointName) {
        case '力量':
            return 's1';
        case '体质':
            return 's2';
        case '敏捷':
            return 'd1';
        case '灵活':
            return 'd2';
        case '智力':
            return 'i1';
        case '意志':
            return 'i2';
        case '耐力':
            return 'p';
        case '幸运':
            return 'l';
        default:
            return '';
    }
};

/**
 * 显示新的争夺属性
 * @param {jQuery} $point 属性点字段对象
 */
const showNewLootProperty = function ($point) {
    let name = $point.attr('name');
    let pointName = getPointNameByFieldName(name);
    let point = parseInt($point.val());
    if (isNaN(point) || point < 0) point = 0;
    let oriPoint = parseInt($point.get(0).defaultValue);
    let newValue = getPropertyByPoint(pointName, point),
        diffValue = 0;
    switch (pointName) {
        case '力量':
            diffValue = newValue - propertyList.get('攻击力');
            break;
        case '体质':
            diffValue = newValue - propertyList.get('最大生命值');
            break;
        case '敏捷':
            diffValue = newValue - propertyList.get('攻击速度');
            break;
        case '灵活':
            diffValue = newValue - propertyList.get('暴击几率');
            break;
        case '智力':
            diffValue = newValue - propertyList.get('技能释放概率');
            break;
        case '意志':
            diffValue = newValue - propertyList.get('防御');
            break;
    }
    $('#pdPro_' + name).text(newValue).css('color', point !== oriPoint ? '#00f' : '#000');

    if (point !== oriPoint) $('#pdNew_' + name).text(`(${ (diffValue >= 0 ? '+' : '') + diffValue })`).css('color', diffValue >= 0 ? '#ff0033' : '#339933');else $('#pdNew_' + name).text('');
};

/**
 * 根据指定的属性点获得相应争夺属性的值
 * @param pointName 属性点名称
 * @param point 属性点的值
 * @returns {number} 争夺属性的值
 */
const getPropertyByPoint = function (pointName, point) {
    let extraPoint = extraPointList.get(pointName);
    if (!extraPoint) extraPoint = 0;
    let value = 0;
    switch (pointName) {
        case '力量':
            value = (point + extraPoint) * 5;
            break;
        case '体质':
            value = (point + extraPoint) * 20 + (itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0);
            break;
        case '敏捷':
            value = (point + extraPoint) * 2 + (itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0);
            break;
        case '灵活':
            value = point + extraPoint;
            value = Math.round(value / (value + 100) * 100);
            break;
        case '智力':
            value = point + extraPoint;
            value = Math.round(value / (value + 90) * 100);
            break;
        case '意志':
            value = point + extraPoint;
            value = Math.round(value / (value + 150) * 100);
            break;
    }
    return value;
};

/**
 * 根据指定的争夺属性获得相应属性点的值
 * @param pointName 属性点名称
 * @param num 争夺属性的值
 * @returns {number} 属性点的值
 */
const getPointByProperty = function (pointName, num) {
    let value = 0;
    switch (pointName) {
        case '力量':
            value = Math.round(num / 5) - extraPointList.get('力量');
            break;
        case '体质':
            value = Math.round((itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? num - 700 : num) / 20) - extraPointList.get('体质');
            break;
        case '敏捷':
            value = Math.round((itemUsedNumList.get('十六夜同人漫画') === 50 ? num - 100 : num) / 2) - extraPointList.get('敏捷');
            break;
        case '灵活':
            value = Math.round(100 * num / (100 - num)) - extraPointList.get('灵活');
            break;
        case '智力':
            value = Math.round(90 * num / (100 - num)) - extraPointList.get('智力');
            break;
        case '意志':
            value = Math.round(150 * num / (100 - num)) - extraPointList.get('意志');
            break;
    }
    if (!isFinite(value) || value <= 0) value = 1;
    return value;
};

/**
 * 添加每层属性点列表选择框
 */
const addLevelPointListSelect = function () {
    let pointListHtml = '';
    for (let level of Object.keys(Config.lootLevelPointList)) {
        pointListHtml += `<option value="${ level }">第${ level }层</option>`;
    }
    $(`
<select id="pdLevelPointListSelect" style="margin: 5px 0;" hidden>
  <option>属性点分配方案</option>
  <option value="0">默认</option>
  <option class="pd_highlight" value="edit">编辑&hellip;</option>
  ${ pointListHtml }
</select><br hidden>
`).prependTo($points).change(function () {
        let level = $(this).val();
        if (level === '0') {
            $points.find('[type="number"]').each(function () {
                $(this).val(this.defaultValue);
            }).trigger('change');
        } else if (level === 'edit') {
            //showLevelPointListConfigDialog();
            this.selectedIndex = 0;
        } else if ($.isNumeric(level)) {
            let points = Config.lootLevelPointList[parseInt(level)];
            if (typeof points !== 'object') return;
            $points.find('[type="number"]').each(function () {
                let $this = $(this);
                $this.val(points[getPointNameByFieldName($this.attr('name'))]);
            }).trigger('change');
        }
    });
};

/**
 * 显示每层属性点分配设置对话框
 */
const showLevelPointListConfigDialog = function () {
    const dialogName = 'pdLevelPointListConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <table id="pdLevelPointList" style="text-align: center;">
    <tbody>
      <tr><th></th><th>层数</th><th>力量</th><th>体质</th><th>敏捷</th><th>灵活</th><th>智力</th><th>意志</th><th></th></tr>
    </tbody>
  </table>
  <hr>
  <div style="float: left; line-height: 27px;">
    <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
    <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
    <a class="pd_btn_link pd_highlight" data-name="add" href="#">增加</a>
  </div>
  <div data-id="modifyArea" style="float: right;">
    <input name="s1" type="text" maxlength="4" title="力量" placeholder="力量" style="width: 35px;">
    <input name="s2" type="text" maxlength="4" title="体质" placeholder="体质" style="width: 35px;">
    <input name="d1" type="text" maxlength="4" title="敏捷" placeholder="敏捷" style="width: 35px;">
    <input name="d2" type="text" maxlength="4" title="灵活" placeholder="灵活" style="width: 35px;">
    <input name="i1" type="text" maxlength="4" title="智力" placeholder="智力" style="width: 35px;">
    <input name="i2" type="text" maxlength="4" title="意志" placeholder="意志" style="width: 35px;">
    <button type="button" name="modify">修改</button>
    <span class="pd_cfg_tips" title="">[?]</span>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a href="#">导入/导出分配设置</a></span>
  <button type="submit">确定</button>
  <button type="button" name="cancel">取消</button>
  <button type="button" class="pd_highlight" name="clear">清空</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '每层属性点分配设置', html);
    let $levelPointList = $dialog.find('#pdLevelPointList > tbody');

    /**
     * 添加每层属性点分配的HTML
     * @param {number} level 层数
     * @param {{}} points 属性点对象
     */
    const addLevelPointHtml = function (level, points) {
        $(`
<tr>
  <td style="width: 25px; text-align: left;"><input type="checkbox"></td>
  <td style="text-align: left;">
    <label style="margin-right: 8px;">第 <input name="level" type="text" value="${ level ? level : '' }" style="width: 30px;"> 层</label>
  </td>
  <td><input name="s1" type="number" min="1" max="999" value="${ points['力量'] }" style="width: 50px;"></td>
  <td><input name="s2" type="number" min="1" max="999" value="${ points['体质'] }" style="width: 50px;"></td>
  <td><input name="d1" type="number" min="1" max="999" value="${ points['敏捷'] }" style="width: 50px;"></td>
  <td><input name="d2" type="number" min="1" max="999" value="${ points['灵活'] }" style="width: 50px;"></td>
  <td><input name="i1" type="number" min="1" max="999" value="${ points['智力'] }" style="width: 50px;"></td>
  <td><input name="i2" type="number" min="1" max="999" value="${ points['意志'] }" style="width: 50px;"></td>
  <td><a class="pd_btn_link" data-name="delete" href="#">删除</a></td>
</tr>
<tr>
  <td></td>
  <td class="pd_custom_tips pd_highlight" title="剩余属性点">剩余：<span data-id="surplusPoint">0</span></td>
  <td title="攻击力">攻：<span data-id="pro_s1" style="cursor: pointer;">0</span></td>
  <td title="最大生命值">命：<span data-id="pro_s2" style="cursor: pointer;">0</span></td>
  <td title="攻击速度">速：<span data-id="pro_d1" style="cursor: pointer;">0</span></td>
  <td title="暴击几率">暴：<span data-id="pro_d2" style="cursor: pointer;">0</span>%</td>
  <td title="技能释放概率">技：<span data-id="pro_i1" style="cursor: pointer;">0</span>%</td>
  <td title="防御减伤">防：<span data-id="pro_i2" style="cursor: pointer;">0</span>%</td>
  <td class="pd_custom_tips" title="技能伤害：攻击伤害+(体质点数*6)">技伤：<span data-id="skillAttack">0</span></td>
</tr>
`).appendTo($levelPointList).find('[type="number"]').trigger('change');
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        (0, _Config.read)();
        Config.lootLevelPointList = {};
        let prevPoints = {};
        let isError = false,
            isSurplus = false;
        $levelPointList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            if (!$this.find('input').length) return;
            let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($this.find('[type="number"]'));
            if (surplusPoint > 0) isSurplus = true;else if (surplusPoint < 0) isError = true;

            let level = parseInt($this.find('[name="level"]').val());
            if (!level || level < 0) return;
            let points = {};
            for (let elem of Array.from($this.find('[type="number"]'))) {
                let $elem = $(elem);
                let point = parseInt($elem.val());
                if (!point || point < 0) return;
                points[getPointNameByFieldName($elem.attr('name'))] = point;
            }
            if (Util.deepEqual(prevPoints, points)) return;
            Config.lootLevelPointList[level] = points;
            prevPoints = points;
        });
        if (isSurplus) {
            if (!confirm('部分层数的可分配属性点尚未用完，是否提交？')) return;
        }
        if (isError) {
            alert('部分层数的剩余属性点为负，请重新填写');
            return;
        }
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).find('[data-name="selectAll"]').click(() => Util.selectAll($levelPointList.find('[type="checkbox"]'))).end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($levelPointList.find('[type="checkbox"]'))).end().find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        addLevelPointHtml(0, { '力量': 1, '体质': 1, '敏捷': 1, '灵活': 1, '智力': 1, '意志': 1 });
        Dialog.show(dialogName);
    }).end().find('[name="cancel"]').click(() => Dialog.close(dialogName)).end().find('[name="clear"]').click(function () {
        if (!confirm('是否清空所有属性点分配设置？')) return;
        $levelPointList.find('tr:gt(0)').remove();
        Dialog.show(dialogName);
    });

    $levelPointList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        let $line = $(this).closest('tr');
        $line.next('tr').remove().end().remove();
        Dialog.show(dialogName);
    }).on('change', '[type="number"]', function () {
        let $this = $(this);
        let name = $this.attr('name');
        let point = parseInt($this.val());
        if (!point || point < 0) return;
        let $points = $this.closest('tr');
        let $properties = $points.next('tr');
        $properties.find(`[data-id="pro_${ name }"]`).text(getPropertyByPoint(getPointNameByFieldName(name), point)).end().find('[data-id="surplusPoint"]').text(propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('[type="number"]'))).end().find('[data-id="skillAttack"]').text(getSkillAttack(parseInt($points.find('[name="s1"]').val()), parseInt($points.find('[name="s2"]').val())));
    }).on('click', '[data-id^="pro_"]', function () {
        let $this = $(this);
        let name = $this.data('id').replace('pro_', '');
        let num = parseInt(prompt('请输入数值：', $this.text()));
        if (!num || num < 0) return;
        $this.closest('tr').prev('tr').find(`[name="${ name }"]`).val(getPointByProperty(getPointNameByFieldName(name), num)).trigger('change');
    });

    $dialog.find('[data-id="modifyArea"]').on('keydown', '[type="text"]', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).closest('div').find('[name="modify"]').click();
        }
    }).find('[name="modify"]').click(function () {
        let $checked = $levelPointList.find('[type="checkbox"]:checked');
        if (!$checked.length) return;
        let data = {};
        $dialog.find('[data-id="modifyArea"] [type="text"]').each(function () {
            let $this = $(this);
            let name = $this.attr('name');
            let value = $.trim($this.val());
            if (!value) return;
            let matches = /^(-|\+)?(\d+)$/.exec(value);
            if (!matches) {
                alert('格式不正确');
                $this.select().focus();
            }
            data[name] = {};
            if (typeof matches[1] !== 'undefined') data[name].action = matches[1] === '+' ? 'add' : 'minus';else data[name].action = 'equal';
            data[name].value = parseInt(matches[2]);
        });
        $checked.each(function () {
            let $points = $(this).closest('tr');
            $points.find('[type="number"]').each(function () {
                let $this = $(this);
                let name = $this.attr('name');
                if (!(name in data)) return;
                if (data[name].action !== 'equal') {
                    let point = parseInt($this.val());
                    if (!point || point < 0) point = 0;
                    $this.val(point + (data[name].action === 'add' ? data[name].value : -data[name].value));
                } else $this.val(data[name].value);
            }).trigger('change');
        });
    });

    for (let [level, points] of Util.entries(Config.lootLevelPointList)) {
        addLevelPointHtml(level, points);
    }

    Dialog.show(dialogName);
    $dialog.find('input:first').focus();
};

/**
 * 增强争夺记录
 */
const enhanceLootLog = function () {
    let $log = $lootArea.find('> tbody > tr:nth-child(5) > td');
    let matches = $log.html().match(/获得\d+经验和\d+KFB/g);
    let exp = 0,
        kfb = 0;
    for (let i in matches) {
        let logMatches = /获得(\d+)经验和(\d+)KFB/.exec(matches[i]);
        exp += parseInt(logMatches[1]);
        kfb += parseInt(logMatches[2]);
    }
    if (exp || kfb) {
        $log.prepend(`<b class="pd_stat">你总共获得了<em>${ exp.toLocaleString() }</em>经验和<em>${ kfb.toLocaleString() }</em>KFB</b><br>`);
    }
};

/**
 * 在争夺排行页面添加用户链接
 */
const addUserLinkInPkListPage = exports.addUserLinkInPkListPage = function () {
    $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${ userName }" target="_blank">${ userName }</a>`);
    });
};

},{"./Config":4,"./Dialog":7,"./Item":11,"./Util":22}],15:[function(require,module,exports){
/* 消息模块 */
'use strict';

/**
 * 显示消息
 * @param {string|Object} options 消息或设置对象
 * @param {string} [options.msg] 消息
 * @param {number} [options.duration={@link Config.defShowMsgDuration}] 消息显示时间（秒），-1为永久显示
 * @param {boolean} [options.clickable=true] 消息框可否手动点击消除
 * @param {boolean} [options.preventable=false] 是否阻止点击网页上的其它元素
 * @param {number} [duration] 消息显示时间（秒），-1为永久显示
 * @example
 * show('<strong>抽取道具或卡片</strong><i>道具<em>+1</em></i>', -1);
 * show({msg: '<strong>抽取神秘盒子</strong><i>KFB<em>+8</em></i>', duration: 20, clickable: false});
 * @returns {jQuery} 消息框对象
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
const show = exports.show = function (options, duration) {
    let settings = {
        msg: '',
        duration: Config.defShowMsgDuration,
        clickable: true,
        preventable: false
    };
    if ($.type(options) === 'object') {
        $.extend(settings, options);
    } else {
        settings.msg = options;
        settings.duration = typeof duration === 'undefined' ? Config.defShowMsgDuration : duration;
    }

    if ($('.pd_msg').length > 20) destroy();
    let $container = $('.pd_msg_container');
    let isFirst = $container.length === 0;
    if (!isFirst && !$('.pd_mask').length) {
        let $lastTips = $('.pd_msg:last');
        if ($lastTips.length > 0) {
            let top = $lastTips.offset().top;
            let winScrollTop = $(window).scrollTop();
            if (top < winScrollTop || top >= winScrollTop + $(window).height() - $lastTips.outerHeight() - 10) {
                destroy();
                isFirst = true;
            }
        }
    }
    if (settings.preventable && !$('.pd_mask').length) {
        $('<div class="pd_mask"></div>').appendTo('body');
    }
    if (isFirst) {
        $container = $('<div class="pd_msg_container"></div>').appendTo('body');
    }

    let $msg = $(`<div class="pd_msg">${ settings.msg }</div>`).appendTo($container);
    $msg.on('click', '.pd_stop_action', function (e) {
        e.preventDefault();
        $(this).html('正在停止&hellip;').closest('.pd_msg').data('stop', true);
    });
    if (settings.clickable) {
        $msg.css('cursor', 'pointer').click(function () {
            $(this).stop(true, true).fadeOut('slow', function () {
                remove($(this));
            });
        }).find('a').click(function (e) {
            e.stopPropagation();
        });
    }

    let windowWidth = $(window).width();
    let popTipsWidth = $msg.outerWidth(),
        popTipsHeight = $msg.outerHeight();
    let left = windowWidth / 2 - popTipsWidth / 2;
    if (left + popTipsWidth > windowWidth) left = windowWidth - popTipsWidth - 20;
    if (left < 0) left = 0;
    if (isFirst) {
        $container.css('top', $(window).height() / 2 - popTipsHeight / 2);
    } else {
        $container.stop(false, true).animate({ 'top': '-=' + popTipsHeight / 1.75 });
    }
    let $prev = $msg.prev('.pd_msg');
    $msg.css({
        'top': $prev.length > 0 ? parseInt($prev.css('top')) + $prev.outerHeight() + 5 : 0,
        left
    }).fadeIn('slow');
    if (settings.duration !== -1) {
        $msg.delay(settings.duration * 1000).fadeOut('slow', function () {
            remove($(this));
        });
    }
    return $msg;
};

/**
 * 显示等待消息
 * @param {string} msg 等待消息
 * @param {boolean} preventable 是否阻止点击网页上的其它元素
 * @returns {jQuery} 消息框对象
 */
const wait = exports.wait = function (msg, preventable = true) {
    return show({ msg, duration: -1, clickable: false, preventable });
};

/**
 * 移除指定消息框
 * @param {jQuery} $msg 消息框对象
 */
const remove = exports.remove = function ($msg) {
    let $parent = $msg.parent();
    $msg.remove();
    if (!$('.pd_msg').length) {
        $parent.remove();
        $('.pd_mask').remove();
    } else if (!$('.pd_countdown').length) {
        $('.pd_mask').remove();
    }
};

/**
 * 销毁所有消息框
 */
const destroy = exports.destroy = function () {
    $('.pd_msg_container').remove();
    $('.pd_mask').remove();
};

},{}],16:[function(require,module,exports){
/* 其它模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.modifyFaq = exports.addUserNameLinkInRankPage = exports.showSelfRatingErrorSizeSubmitWarning = exports.highlightRatingErrorSize = exports.addAvatarChangeAlert = exports.syncModifyPerPageFloorNum = exports.addAutoChangeIdColorButton = exports.addMsgSelectButton = exports.modifyMyPostLink = exports.addFollowAndBlockAndMemoUserLink = exports.addFastDrawMoneyLink = exports.highlightUnReadAtTipsMsg = exports.addFastGotoThreadPageLink = exports.highlightNewPost = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _ConfigDialog = require('./ConfigDialog');

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

var _Bank = require('./Bank');

var Bank = _interopRequireWildcard(_Bank);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 高亮今日新发表帖子的发表时间
 */
const highlightNewPost = exports.highlightNewPost = function () {
    $('.thread1 > tbody > tr > td:last-child').has('a.bl').each(function () {
        let html = $(this).html();
        if (/\|\s*\d{2}:\d{2}<br>\n.*\d{2}:\d{2}/.test(html)) {
            html = html.replace(/(\d{2}:\d{2})<br>/, '<span class="pd_highlight">$1</span><br>');
            $(this).html(html);
        }
    });
};

/**
 * 在版块页面中添加帖子页数快捷链接
 */
const addFastGotoThreadPageLink = exports.addFastGotoThreadPageLink = function () {
    $('.threadtit1 > a[href^="read.php"]').each(function () {
        let $link = $(this);
        let floorNum = $link.closest('td').next().find('ul > li > a').contents().eq(0).text();
        if (!floorNum || floorNum < Config.perPageFloorNum) return;
        let url = $link.attr('href');
        let totalPageNum = Math.floor(floorNum / Config.perPageFloorNum) + 1;
        let html = '';
        for (let i = 1; i < totalPageNum; i++) {
            if (i > Config.maxFastGotoThreadPageNum) {
                if (i + 1 <= totalPageNum) {
                    html += `..<a href="${ url }&page=${ totalPageNum }">${ totalPageNum }</a>`;
                }
                break;
            }
            html += `<a href="${ url }&page=${ i + 1 }">${ i + 1 }</a>`;
        }
        html = `<span class="pd_thread_page">&hellip;${ html }</span>`;
        $link.after(html).parent().css('white-space', 'normal');
    });
};

/**
 * 高亮at提醒页面中未读的消息
 */
const highlightUnReadAtTipsMsg = exports.highlightUnReadAtTipsMsg = function () {
    if ($('.kf_share1:first').text().trim() !== `含有关键词 “${ _Info2.default.userName }” 的内容`) return;
    let timeString = Util.getCookie(_Const2.default.prevReadAtTipsCookieName);
    if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
    let prevString = '';
    $('.kf_share1:eq(1) > tbody > tr:gt(0) > td:first-child').each(function (index) {
        let $this = $(this);
        let curString = $this.text().trim();
        if (index === 0) prevString = curString;
        if (timeString < curString && prevString >= curString) {
            $this.addClass('pd_highlight');
            prevString = curString;
        } else return false;
    });
    $('.kf_share1').on('click', 'td > a', function () {
        Util.deleteCookie(_Const2.default.prevReadAtTipsCookieName);
    });
};

/**
 * 在短消息页面中添加快速取款的链接
 */
const addFastDrawMoneyLink = exports.addFastDrawMoneyLink = function () {
    if (!$('td:contains("SYSTEM")').length || !$('td:contains("收到了他人转账的KFB")').length) return;
    let $msg = $('.thread2 > tbody > tr:eq(-2) > td:last');
    let html = $msg.html();
    let matches = /给你转帐(\d+)KFB/i.exec(html);
    if (matches) {
        let money = parseInt(matches[1]);
        $msg.html(html.replace(/会员\[(.+?)\]通过论坛银行/, '会员[<a target="_blank" href="profile.php?action=show&username=$1">$1</a>]通过论坛银行').replace(matches[0], `给你转帐<span class="pd_stat"><em>${ money.toLocaleString() }</em></span>KFB`));

        $('<br><a title="从活期存款中取出当前转账的金额" href="#">快速取款</a> | <a title="取出银行账户中的所有活期存款" href="#">取出所有存款</a>').appendTo($msg).filter('a:eq(0)').click(function (e) {
            e.preventDefault();
            Msg.destroy();
            Bank.drawCurrentDeposit(money);
        }).end().filter('a:eq(1)').click(function (e) {
            e.preventDefault();
            Msg.destroy();
            Msg.wait('<strong>正在获取当前活期存款金额&hellip;</strong>');
            $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
                Msg.destroy();
                let matches = /活期存款：(\d+)KFB<br/.exec(html);
                if (!matches) {
                    alert('获取当前活期存款金额失败');
                    return;
                }
                let money = parseInt(matches[1]);
                if (money <= 0) {
                    Msg.show('当前活期存款余额为零', -1);
                    return;
                }
                Bank.drawCurrentDeposit(money);
            });
        });

        $('a[href^="message.php?action=write&remid="]').attr('href', '#').addClass('pd_disabled_link').click(function (e) {
            e.preventDefault();
            alert('本短消息由系统发送，请勿直接回复；如需回复，请点击给你转账的用户链接，向其发送短消息');
        });
    }
};

/**
 * 添加关注和屏蔽用户以及用户备注的链接
 */
const addFollowAndBlockAndMemoUserLink = exports.addFollowAndBlockAndMemoUserLink = function () {
    let matches = /(.+?)\s*详细信息/.exec($('td:contains("详细信息")').text());
    if (!matches) return;
    let userName = $.trim(matches[1]);
    $('<span>[<a href="#">关注用户</a>] [<a href="#">屏蔽用户</a>]</span><br><span>[<a href="#">添加备注</a>]</span><br>').appendTo($('a[href^="message.php?action=write&touid="]').parent()).find('a').each(function () {
        let $this = $(this);
        if ($this.is('a:contains("备注")')) {
            let str = '';
            for (let [name, memo] of Util.entries(Config.userMemoList)) {
                if (name === userName) {
                    str = memo;
                    break;
                }
            }
            if (str !== '') {
                $this.text('修改备注').data('memo', str);
                let $info = $('.log1 > tbody > tr:last-child > td:last-child');
                $info.html(`备注：${ str }<br>${ $info.html() }`);
            }
        } else {
            let str = '关注';
            let userList = Config.followUserList;
            if ($this.text().indexOf('屏蔽') > -1) {
                str = '屏蔽';
                userList = Config.blockUserList;
            }
            if (Util.inFollowOrBlockUserList(userName, userList) > -1) {
                $this.addClass('pd_highlight').text('解除' + str);
            }
        }
    }).click(function (e) {
        e.preventDefault();
        (0, _Config.read)();
        let $this = $(this);
        if ($this.is('a:contains("备注")')) {
            let memo = $this.data('memo');
            if (!memo) memo = '';
            let value = prompt('为此用户添加备注（要删除备注请留空）：', memo);
            if (value === null) return;
            if (!Config.userMemoEnabled) Config.userMemoEnabled = true;
            value = $.trim(value);
            if (value) {
                Config.userMemoList[userName] = value;
                $this.text('修改备注');
            } else {
                delete Config.userMemoList[userName];
                $this.text('添加备注');
            }
            $this.data('memo', value);
            (0, _Config.write)();
        } else {
            let str = '关注';
            let userList = Config.followUserList;
            if ($this.text().includes('屏蔽')) {
                str = '屏蔽';
                userList = Config.blockUserList;
                if (!Config.blockUserEnabled) Config.blockUserEnabled = true;
            } else {
                if (!Config.followUserEnabled) Config.followUserEnabled = true;
            }
            if ($this.text() === '解除' + str) {
                let index = Util.inFollowOrBlockUserList(userName, userList);
                if (index > -1) {
                    userList.splice(index, 1);
                    (0, _Config.write)();
                }
                $this.removeClass('pd_highlight').text(str + '用户');
                alert('该用户已被解除' + str);
            } else {
                if (Util.inFollowOrBlockUserList(userName, userList) === -1) {
                    if (str === '屏蔽') {
                        let type = Config.blockUserDefaultType;
                        type = prompt('请填写屏蔽类型，0：屏蔽主题和回帖；1：仅屏蔽主题；2：仅屏蔽回帖', type);
                        if (type === null) return;
                        type = parseInt(type);
                        if (isNaN(type) || type < 0 || type > 2) type = Config.blockUserDefaultType;
                        userList.push({ name: userName, type: type });
                    } else {
                        userList.push({ name: userName });
                    }
                    (0, _Config.write)();
                }
                $this.addClass('pd_highlight').text('解除' + str);
                alert('该用户已被' + str);
            }
        }
    });
};

/**
 * 修改我的回复页面里的帖子链接
 */
const modifyMyPostLink = exports.modifyMyPostLink = function () {
    $('.t a[href^="read.php?tid="]').each(function () {
        let $this = $(this);
        $this.attr('href', $this.attr('href').replace(/&uid=\d+#(\d+)/, '&spid=$1'));
    });
};

/**
 * 在短消息页面添加选择指定短消息的按钮
 */
const addMsgSelectButton = exports.addMsgSelectButton = function () {
    let $checkeds = $('.thread1 > tbody > tr > td:last-child > [type="checkbox"]');
    $('<input value="自定义" type="button" style="margin-right: 3px;">').insertBefore('[type="button"][value="全选"]').click(function (e) {
        e.preventDefault();
        let value = $.trim(prompt('请填写所要选择的包含指定字符串的短消息标题（可用|符号分隔多个标题）', '收到了他人转账的KFB|银行汇款通知|您的文章被评分|您的文章被删除'));
        if (value !== '') {
            $checkeds.prop('checked', false);
            let titleArr = value.split('|');
            $('.thread1 > tbody > tr > td:nth-child(2) > a').each(function () {
                let $this = $(this);
                for (let title of titleArr) {
                    if ($this.text().toLowerCase().includes(title.toLowerCase())) {
                        $this.closest('tr').find('td:last-child > input[type="checkbox"]').prop('checked', true);
                    }
                }
            });
        }
    }).parent().attr('colspan', 4).prev('td').attr('colspan', 3);
    $('<input value="反选" type="button" style="margin-left: 5px; margin-right: 1px;">').insertAfter('[type="button"][value="全选"]').click(function (e) {
        e.preventDefault();
        $checkeds.each(function () {
            let $this = $(this);
            $this.prop('checked', !$this.prop('checked'));
        });
    });
};

/**
 * 添加自动更换ID颜色的按钮
 */
const addAutoChangeIdColorButton = exports.addAutoChangeIdColorButton = function () {
    let $autoChangeIdColor = $('table div > table > tbody > tr > td:contains("自定义ID颜色")');
    $('<span class="pd_highlight">低等级没人权？没有自己喜欢的颜色？快来试试助手的<a href="#">自定义本人神秘颜色</a>的功能吧！（虽然仅限自己可见 ╮(╯▽╰)╭）</span><br>').appendTo($autoChangeIdColor).find('a').click(function (e) {
        e.preventDefault();
        (0, _ConfigDialog.show)();
    });

    let $idColors = $autoChangeIdColor.parent('tr').nextAll('tr').not('tr:last');
    if ($idColors.find('a').length <= 1) return;
    let $area = $(`
<form>
<div data-name="autoChangeIdColorBtns" style="margin-top: 5px;">
  <label><input name="autoChangeIdColorEnabled" class="pd_input" type="checkbox"> 自动更换ID颜色</label>
</div>
</form>
`).appendTo($autoChangeIdColor);
    $area.find('[name="autoChangeIdColorEnabled"]').click(function () {
        let $this = $(this);
        let enabled = $this.prop('checked');
        if (enabled !== Config.autoChangeIdColorEnabled) {
            (0, _Config.read)();
            Config.autoChangeIdColorEnabled = enabled;
            (0, _Config.write)();
        }

        if (enabled) {
            $idColors.addClass('pd_id_color_select').find('td:not(:has(a))').css('cursor', 'not-allowed');
            $(`
<label class="pd_cfg_ml">
  更换顺序
  <select name="autoChangeIdColorType" style="font-size: 12px;">
    <option value="random">随机</option><option value="sequence">顺序</option>
  </select>
</label>&nbsp;
<label>每隔 <input name="autoChangeIdColorInterval" class="pd_input" style="width: 25px;" type="text" maxlength="5"> 小时</label>
<button>保存</button> <button style="margin-left: 3px;">重置</button><br>
<a class="pd_btn_link" href="#">全选</a> <a class="pd_btn_link" href="#">反选</a>
<label><input name="changeAllAvailableIdColorEnabled" class="pd_input" type="checkbox"> 选择当前所有可用的ID颜色</label>
`).insertAfter($this.parent()).filter('button:first').click(function (e) {
                e.preventDefault();
                let $autoChangeIdColorInterval = $area.find('[name="autoChangeIdColorInterval"]');
                let interval = parseInt($autoChangeIdColorInterval.val());
                if (isNaN(interval) || interval <= 0) {
                    alert('ID颜色更换时间间隔格式不正确');
                    $autoChangeIdColorInterval.select();
                    $autoChangeIdColorInterval.focus();
                    return;
                }
                let changeAllAvailableSMColorEnabled = $area.find('[name="changeAllAvailableIdColorEnabled"]').prop('checked');
                let customChangeSMColorList = [];
                $idColors.find('[type="checkbox"]:checked').each(function () {
                    customChangeSMColorList.push(parseInt($(this).val()));
                });
                if (!changeAllAvailableSMColorEnabled && customChangeSMColorList.length <= 1) {
                    alert('必须选择2种或以上的ID颜色');
                    return;
                }
                if (customChangeSMColorList.length <= 1) customChangeSMColorList = [];

                let oriInterval = Config.autoChangeIdColorInterval;
                (0, _Config.read)();
                Config.autoChangeIdColorType = $area.find('[name="autoChangeIdColorType"]').val().toLowerCase();
                Config.autoChangeIdColorInterval = interval;
                Config.changeAllAvailableIdColorEnabled = changeAllAvailableSMColorEnabled;
                Config.customAutoChangeIdColorList = customChangeSMColorList;
                (0, _Config.write)();
                if (oriInterval !== Config.autoChangeIdColorInterval) Util.deleteCookie(_Const2.default.autoChangeIdColorCookieName);
                alert('设置保存成功');
            }).end().filter('button:eq(1)').click(function (e) {
                e.preventDefault();
                (0, _Config.read)();
                Config.autoChangeIdColorEnabled = _Config.Config.autoChangeIdColorEnabled;
                Config.autoChangeIdColorType = _Config.Config.autoChangeIdColorType;
                Config.autoChangeIdColorInterval = _Config.Config.autoChangeIdColorInterval;
                Config.changeAllAvailableIdColorEnabled = _Config.Config.changeAllAvailableIdColorEnabled;
                Config.customAutoChangeIdColorList = _Config.Config.customAutoChangeIdColorList;
                (0, _Config.write)();
                Util.deleteCookie(_Const2.default.autoChangeIdColorCookieName);
                TmpLog.deleteValue(_Const2.default.prevAutoChangeIdColorTmpLogName);
                alert('设置已重置');
                location.reload();
            }).end().filter('a').click(function (e) {
                e.preventDefault();
                if ($idColors.find('input[disabled]').length > 0) {
                    alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                    $area.find('[name="changeAllAvailableIdColorEnabled"]').focus();
                    return;
                }
                if ($(this).is('[data-name="autoChangeIdColorBtns"] > a:first')) {
                    $idColors.find('[type="checkbox"]').prop('checked', true);
                } else {
                    $idColors.find('[type="checkbox"]').each(function () {
                        $(this).prop('checked', !$(this).prop('checked'));
                    });
                }
            });

            $idColors.find('td:has(a)').each(function () {
                let $this = $(this);
                let matches = /&color=(\d+)/i.exec($this.find('a').attr('href'));
                if (matches) $this.append(`<input type="checkbox" class="pd_input" value="${ matches[1] }">`);
            });

            $area.find('[name="autoChangeIdColorType"]').val(Config.autoChangeIdColorType);
            $area.find('[name="autoChangeIdColorInterval"]').val(Config.autoChangeIdColorInterval);
            $area.find('[name="changeAllAvailableIdColorEnabled"]').click(function () {
                $idColors.find('input').prop('disabled', $(this).prop('checked'));
            }).prop('checked', Config.changeAllAvailableIdColorEnabled).triggerHandler('click');
            for (let id of Config.customAutoChangeIdColorList) {
                $idColors.find(`input[value="${ id }"]`).prop('checked', true);
            }
        } else {
            $this.parent().nextAll().remove();
            $idColors.removeClass('pd_id_color_select').find('input').remove();
        }
    });

    $idColors.on('click', 'td', function (e) {
        if (!$(e.target).is('a')) {
            let $this = $(this);
            if ($this.find('input[disabled]').length > 0) {
                alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                $area.find('[name="changeAllAvailableIdColorEnabled"]').focus();
            } else if (!$(e.target).is('input')) {
                $this.find('input').click();
            }
        }
    });

    if (Config.autoChangeIdColorEnabled) {
        $area.find('[name="autoChangeIdColorEnabled"]').prop('checked', true).triggerHandler('click');
    }

    $('div[style="float:right;color:#8080C0"]:contains("每天捐款附送100经验值")').html('每天捐款附送50经验值');
    $('div[style="border-bottom:#8000FF 1px dashed;"] > div:contains("帖子被奖励KFB")').html('帖子被奖励KFB(被协管评分)');
};

/**
 * 同步修改帖子每页楼层数量
 */
const syncModifyPerPageFloorNum = exports.syncModifyPerPageFloorNum = function () {
    const syncConfig = function () {
        let perPageFloorNum = parseInt($('select[name="p_num"]').val());
        if (isNaN(perPageFloorNum)) return;
        if (!perPageFloorNum) perPageFloorNum = 10;
        if (perPageFloorNum !== Config.perPageFloorNum) {
            Config.perPageFloorNum = perPageFloorNum;
            (0, _Config.write)();
        }
    };
    $('form#creator').submit(() => {
        (0, _Config.read)();
        syncConfig();
    });
    syncConfig();
};

/**
 * 在设置页面添加更换头像提醒
 */
const addAvatarChangeAlert = exports.addAvatarChangeAlert = function () {
    $('input[name="uploadurl[2]"]').parent().append('<div class="pd_highlight">本反向代理服务器为了提高性能对图片设置了缓存，更换头像后可能需等待<b>最多30分钟</b>才能看到效果</div>');
};

/**
 * 高亮自助评分错标文件大小
 */
const highlightRatingErrorSize = exports.highlightRatingErrorSize = function () {
    $('.adp1 a[href^="read.php?tid="]').each(function () {
        let $this = $(this);
        let title = $this.text();
        let ratingSize = 0;
        let $ratingCell = $this.parent('td').next('td');
        let matches = /认定\[(\d+)\]/i.exec($ratingCell.text());
        if (matches) {
            ratingSize = parseInt(matches[1]);
        }

        let { type, titleSize } = Public.checkRatingSize(title, ratingSize);
        if (type === -1) {
            $ratingCell.css('color', '#ff9933').attr('title', '标题文件大小无法解析').addClass('pd_custom_tips');
        } else if (type === 1) {
            $ratingCell.addClass('pd_highlight pd_custom_tips').attr('title', `标题文件大小(${ titleSize.toLocaleString() }M)与认定文件大小(${ ratingSize.toLocaleString() }M)不一致`);
        }
    });
};

/**
 * 在提交自助评分时显示错标文件大小警告
 */
const showSelfRatingErrorSizeSubmitWarning = exports.showSelfRatingErrorSizeSubmitWarning = function () {
    $('form[name="mail1"]').submit(function () {
        let ratingSize = parseFloat($('[name="psize"]').val());
        if (isNaN(ratingSize) || ratingSize <= 0) return;
        if (parseInt($('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
        let title = $('.adp1 a[href^="read.php?tid="]').text();
        let { type, titleSize } = Public.checkRatingSize(title, ratingSize);
        if (type === 1) {
            return confirm(`标题文件大小(${ titleSize.toLocaleString() }M)与认定文件大小(${ ratingSize.toLocaleString() }M)不一致，是否继续？`);
        }
    });
};

/**
 * 在论坛排行页面为用户名添加链接
 */
const addUserNameLinkInRankPage = exports.addUserNameLinkInRankPage = function () {
    $('.kf_no11:eq(2) > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${ userName }" target="_blank">${ userName }</a>`);
        if (userName === _Info2.default.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 修改帮助页面
 */
const modifyFaq = exports.modifyFaq = function () {
    let id = parseInt(Util.getUrlParam('id'));
    let $faq = $('.kf_share1 > tbody > tr:nth-child(2) > td:last-child > div:last-child');
    if (id === 1) {
        if ($faq.html().length !== 848) return;
        $faq.html(`
你可以通过发帖/回贴、参与<a href="kf_fw_ig_index.php" target="_blank">争夺奖励</a>等方式获取KFB（论坛货币）和经验。<br><br>
发帖/回贴时会获得基本的KFB奖励，每天第一次发帖/回贴还可获得额外经验奖励。<br>
发帖请先阅读规定避免违规，在你还没有时间阅读全部规定之前，请至少注意以下几点：<br>
不要发表纯水帖；不要纯复制发帖；不要发表政治、广告、恶心的内容；不要攻击、讽刺、挑衅他人；<br>
不要发表成人图片、视频、小说等内容；不要伪造原创、盗取他人原创。<br><br>
升级（神秘系数）可以获得不同的等级权限，你可以在<a href="kf_growup.php" target="_blank">等级经验页面</a>进行KFB捐款，
根据不同的捐款数额获得相应的经验来提升神秘系数。<br>
注册初始神秘系数为0，为“通常版”等级，拥有大部分的日常权限；提升为神秘系数4时，升级为“初回限定版”等级，拥有部分追加的权限。<br>
部分板块需要一定神秘系数以上才可进入，如打开帖子时出现“error&hellip;”的提示，说明你当前的神秘系数无法进入该板块。<br><br>
神秘等级的值以神秘系数为基础，基本上是装饰用的属性，可见于帖子页面各楼层用户名称旁，还可用于选择自定义ID颜色。
`);
    }
};

},{"./Bank":2,"./Config":4,"./ConfigDialog":5,"./Const":6,"./Info":10,"./Msg":15,"./Public":18,"./TmpLog":21,"./Util":22}],17:[function(require,module,exports){
/* 发帖模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addAttachChangeAlert = exports.modifyPostPreviewPage = exports.addExtraOptionInPostPage = exports.addExtraPostEditorButton = exports.removeUnpairedBBCodeInQuoteContent = exports.handleMultiQuote = undefined;

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Func = require('./Func');

var Func = _interopRequireWildcard(_Func);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 处理多重回复和多重引用
 * @param {number} type 处理类型，1：多重回复；2：多重引用
 */
const handleMultiQuote = exports.handleMultiQuote = function (type = 1) {
    Func.run('Post.handleMultiQuote_before_', type);
    if (!$('#pdClearMultiQuoteData').length) {
        $('<a id="pdClearMultiQuoteData" style="margin-left: 7px;" title="清除在浏览器中保存的多重引用数据" href="#">清除引用数据</a>').insertAfter('input[name="diy_guanjianci"]').click(function (e) {
            e.preventDefault();
            localStorage.removeItem(_Const2.default.multiQuoteStorageName);
            $('input[name="diy_guanjianci"]').val('');
            if (type === 2) $('#textarea').val('');else $('textarea[name="atc_content"]').val('');
            alert('多重引用数据已被清除');
        });
    }
    let data = localStorage[_Const2.default.multiQuoteStorageName];
    if (!data) return;
    try {
        data = JSON.parse(data);
    } catch (ex) {
        return;
    }
    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) return;
    let tid = parseInt(Util.getUrlParam('tid')),
        fid = parseInt(Util.getUrlParam('fid'));
    if (!tid || typeof data.tid === 'undefined' || data.tid !== tid || !Array.isArray(data.quoteList)) return;
    if (type === 2 && !fid) return;
    let list = [];
    for (let quote of data.quoteList) {
        if (!Array.isArray(quote)) continue;
        for (let data of quote) {
            list.push(data);
        }
    }
    if (!list.length) {
        localStorage.removeItem(_Const2.default.multiQuoteStorageName);
        return;
    }
    let keywords = new Set();
    let content = '';
    if (type === 2) {
        Msg.wait(`<strong>正在获取引用内容中&hellip;</strong><i>剩余：<em class="pd_countdown">${ list.length }</em></i>`);
        $(document).clearQueue('MultiQuote');
    }
    $.each(list, function (index, data) {
        if (typeof data.floor === 'undefined' || typeof data.pid === 'undefined') return;
        keywords.add(data.userName);
        if (type === 2) {
            $(document).queue('MultiQuote', function () {
                $.get(`post.php?action=quote&fid=${ fid }&tid=${ tid }&pid=${ data.pid }&article=${ data.floor }&t=${ new Date().getTime() }`, function (html) {
                    let matches = /<textarea id="textarea".*?>((.|\n)+?)<\/textarea>/i.exec(html);
                    if (matches) {
                        content += Util.removeUnpairedBBCodeContent(Util.htmlDecode(matches[1]).replace(/\n{2,}/g, '\n')) + (index === list.length - 1 ? '' : '\n');
                    }
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    if (index === list.length - 1) {
                        Msg.destroy();
                        $('#textarea').val(content).focus();
                    } else {
                        setTimeout(function () {
                            $(document).dequeue('MultiQuote');
                        }, 100);
                    }
                });
            });
        } else {
            content += `[quote]回 ${ data.floor }楼(${ data.userName }) 的帖子[/quote]\n`;
        }
    });
    $('input[name="diy_guanjianci"]').val([...keywords].join(','));
    $('form[name="FORM"]').submit(function () {
        localStorage.removeItem(_Const2.default.multiQuoteStorageName);
    });
    if (type === 2) $(document).dequeue('MultiQuote');else $('textarea[name="atc_content"]').val(content).focus();
    Func.run('Post.handleMultiQuote_after_', type);
};

/**
 * 去除引用内容中不配对的BBCode
 */
const removeUnpairedBBCodeInQuoteContent = exports.removeUnpairedBBCodeInQuoteContent = function () {
    let $content = $('#textarea');
    let content = $content.val();
    let matches = /\[quote\](.|\r|\n)+?\[\/quote\]/.exec(content);
    if (matches) {
        let workedContent = Util.removeUnpairedBBCodeContent(matches[0]);
        if (matches[0] !== workedContent) {
            $content.val(content.replace(matches[0], workedContent));
        }
    }
};

/**
 * 在发帖页面的发帖框上添加额外的按钮
 */
const addExtraPostEditorButton = exports.addExtraPostEditorButton = function () {
    let textArea = $('textarea[name="atc_content"]').get(0);
    if (!textArea) return;

    $(`
<span id="wy_post" title="插入隐藏内容" data-type="hide" style="background-position: 0 -280px;">插入隐藏内容</span>
<span id="wy_justifyleft" title="左对齐" data-type="left" style="background-position: 0 -360px;">左对齐</span>
<span id="wy_justifycenter" title="居中" data-type="center" style="background-position: 0 -380px;">居中</span>
<span id="wy_justifyright" title="右对齐" data-type="right" style="background-position: 0 -400px;">右对齐</span>
<span id="wy_subscript" title="下标" data-type="sub" style="background-position: 0 -80px;">下标</span>
<span id="wy_superscript" title="上标" data-type="sup" style="background-position: 0 -100px;">上标</span>
<span class="pd_editor_btn" title="插入飞行文字" data-type="fly">F</span>
<span class="pd_editor_btn" title="插入HTML5音频" data-type="audio">A</span>
<span class="pd_editor_btn" title="插入HTML5视频" data-type="video">V</span>
`).appendTo('#editor-button .editor-button').click(function () {
        let $this = $(this);
        let type = $this.data('type');
        let text = '';
        switch (type) {
            case 'hide':
                text = prompt('请输入神秘等级：', 5);
                break;
            case 'audio':
                {
                    text = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐或虾米的单曲地址，将自动转换为外链地址）', 'http://');
                    let matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(text);
                    if (matches) text = `http://music.miaola.info/163/${ matches[1] }.mp3`;
                    matches = /^https?:\/\/www\.xiami\.com\/song\/(\d+)/i.exec(text);
                    if (matches) text = `http://music.miaola.info/xiami/${ matches[1] }.mp3`;
                }
                break;
            case 'video':
                {
                    text = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://');
                    let matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(text);
                    if (matches) text = `http://video.miaola.info/youtube/${ matches[1] }`;
                    matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(text);
                    if (matches) text = `http://video.miaola.info/youtube/${ matches[1] }`;
                }
                break;
        }
        if (text === null) return;

        let selText = '';
        let code = '';
        switch (type) {
            case 'hide':
                selText = Util.getSelText(textArea);
                code = `[hide=${ text }]${ selText }[/hide]`;
                break;
            case 'left':
                selText = Util.getSelText(textArea);
                code = `[align=left]${ selText }[/align]`;
                break;
            case 'center':
                selText = Util.getSelText(textArea);
                code = `[align=center]${ selText }[/align]`;
                break;
            case 'right':
                selText = Util.getSelText(textArea);
                code = `[align=right]${ selText }[/align]`;
                break;
            case 'fly':
                selText = Util.getSelText(textArea);
                code = `[fly]${ selText }[/fly]`;
                break;
            case 'sub':
                selText = Util.getSelText(textArea);
                code = `[sub]${ selText }[/sub]`;
                break;
            case 'sup':
                selText = Util.getSelText(textArea);
                code = `[sup]${ selText }[/sup]`;
                break;
            case 'audio':
                code = `[audio]${ text }[/audio]`;
                break;
            case 'video':
                code = `[video]${ text }[/video]`;
                break;
        }
        if (!code) return;
        Util.addCode(textArea, code, selText);
        textArea.focus();
    }).mouseenter(function () {
        $(this).addClass('buttonHover');
    }).mouseleave(function () {
        $(this).removeClass('buttonHover');
    });
};

/**
 * 在发帖页面上添加额外的选项
 */
const addExtraOptionInPostPage = exports.addExtraOptionInPostPage = function () {
    $(`
<div class="pd_post_extra_option">
  <label><input type="checkbox" name="autoAnalyzeUrl" checked> 自动分析url</label><br>
  <label><input type="checkbox" name="windCodeAutoConvert" checked> Wind Code自动转换</label>
</div>
`).appendTo($('#menu_show').closest('td')).on('click', '[type="checkbox"]', function () {
        let $this = $(this);
        let inputName = $this.is('[name="autoAnalyzeUrl"]') ? 'atc_autourl' : 'atc_convert';
        $('form[name="FORM"]').find(`[name="${ inputName }"]`).val($this.prop('checked') ? 1 : 0);
    });

    $('<input type="button" value="预览帖子" style="margin-left: 7px;">').insertAfter('[type="submit"][name="Submit"]').click(function (e) {
        e.preventDefault();
        let $form = $('form[name="preview"]');
        $form.find('input[name="atc_content"]').val($('#textarea').val());
        $form.submit();
    });
};

/**
 * 修正发帖预览页面
 */
const modifyPostPreviewPage = exports.modifyPostPreviewPage = function () {
    $('table > tbody > tr.tr1 > th').css({
        'text-align': 'left',
        'font-weight': 'normal',
        'border': '1px solid #9191ff',
        'padding': '10px'
    });
};

/**
 * 在发帖页面添加更新附件提醒
 */
const addAttachChangeAlert = exports.addAttachChangeAlert = function () {
    $(document).on('click', '.abtn[id^="md_"]', function () {
        if (!$(document).data('attachUpdateAlert')) {
            alert('本反向代理服务器为了提高性能对图片设置了缓存，更新附件图片后可能需等待最多30分钟才能看到效果');
            $(document).data('attachUpdateAlert', true);
        }
    });
};

},{"./Const":6,"./Func":8,"./Msg":15,"./Util":22}],18:[function(require,module,exports){
/* 公共模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.importKfSmileEnhanceExtension = exports.checkRatingSize = exports.turnPageViaKeyboard = exports.repairBbsErrorCode = exports.addSearchDialogLink = exports.makeSearchByBelowTwoKeyWordAvailable = exports.bindSearchTypeSelectMenuClick = exports.bindElementTitleClick = exports.showElementTitleTips = exports.changeIdColor = exports.autoSaveCurrentDeposit = exports.addFastNavForSideBar = exports.modifySideBar = exports.blockThread = exports.blockUsers = exports.followUsers = exports.startAutoRefreshMode = exports.getMinRefreshInterval = exports.donation = exports.addPolyfill = exports.showFormatLog = exports.preventCloseWindowWhenActioning = exports.addConfigAndLogDialogLink = exports.appendCss = exports.checkBrowserType = exports.getSafeId = exports.getUidAndUserName = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Func = require('./Func');

var Func = _interopRequireWildcard(_Func);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _ConfigDialog = require('./ConfigDialog');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _LogDialog = require('./LogDialog');

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Read = require('./Read');

var Read = _interopRequireWildcard(_Read);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取Uid和用户名
 * @returns {boolean} 是否获取成功
 */
const getUidAndUserName = exports.getUidAndUserName = function () {
    let $user = $('.topright a[href^="profile.php?action=show&uid="]').eq(0);
    if (!$user.length) return false;
    _Info2.default.userName = $user.text();
    if (!_Info2.default.userName) return false;
    let matches = /&uid=(\d+)/.exec($user.attr('href'));
    if (!matches) return false;
    _Info2.default.uid = parseInt(matches[1]);
    return true;
};

/**
 * 获取用户的SafeID
 * @returns {string} 用户的SafeID
 */
const getSafeId = exports.getSafeId = function () {
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
const checkBrowserType = exports.checkBrowserType = function () {
    if (Config.browseType === 'auto') {
        _Info2.default.isMobile = /(Mobile|MIDP)/i.test(navigator.userAgent);
    } else {
        _Info2.default.isMobile = Config.browseType === 'mobile';
    }
};

/**
 * 添加CSS样式
 */
const appendCss = exports.appendCss = function () {
    $('head').append(`
<style>
  /* 公共 */
  .pd_highlight { color: #f00 !important; }
  .pd_notice, .pd_msg .pd_notice { font-style: italic; color: #666; }
  .pd_input, .pd_cfg_main input, .pd_cfg_main select {
    vertical-align: middle; height: auto; margin-right: 0; line-height: 22px; font-size: 12px;
  }
  .pd_input[type="text"], .pd_cfg_main input[type="text"] { height: 22px; line-height: 22px; }
  .pd_input:focus, .pd_cfg_main input[type="text"]:focus, .pd_cfg_main textarea:focus, .pd_textarea:focus { border-color: #7eb4ea; }
  .pd_textarea, .pd_cfg_main textarea { border: 1px solid #ccc; font-size: 12px; }
  .pd_btn_link { margin-left: 4px; margin-right: 4px; }
  .pd_custom_tips { cursor: help; }
  .pd_disabled_link { color: #999 !important; text-decoration: none !important; cursor: default; }
  hr {
    box-sizing: content-box; height: 0; margin-top: 7px; margin-bottom: 7px; border: 0;
    border-top: 1px solid rgba(0, 0, 0, .2); overflow: visible;
  }
  .pd_overflow { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd_stat i { display: inline-block; font-style: normal; margin-right: 3px; }
  .pd_stat_extra em, .pd_stat_extra ins { padding: 0 2px; cursor: help; }
  .pd_panel { position: absolute; overflow-y: auto; background-color: #fff; border: 1px solid #9191ff; opacity: 0.9; }
  .pd_title_tips {
    position: absolute; max-width: 470px; font-size: 12px; line-height: 1.5em;
    padding: 2px 5px; background-color: #fcfcfc; border: 1px solid #767676; z-index: 9999;
  }
  .pd_search_type {
    float: left; height: 26px; line-height: 26px; width: 65px; text-align: center; border: 1px solid #ccc; border-left: none; cursor: pointer;
  }
  .pd_search_type i { font-style: normal; margin-left: 5px; font-family: sans-serif; }
  .pd_search_type_list {
    position: absolute; width: 63px; background-color: #fcfcfc; border: 1px solid #ccc; border-top: none; line-height: 26px;
    text-indent: 13px; cursor: pointer; z-index: 1003;
  }
  .pd_search_type_list li:hover { color: #fff; background-color: #87c3cf; }
  
  /* 消息框 */
  .pd_mask { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1000; }
  .pd_msg_container { position: ${ _Info2.default.isMobile ? 'absolute' : 'fixed' }; width: 100%; z-index: 1001; }
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
  
  /* 帖子页面 */
  .readlou .pd_goto_link { color: #000; }
  .readlou .pd_goto_link:hover { color: #51d; }
  .pd_fast_goto_floor, .pd_multi_quote_chk { margin-right: 2px; }
  .pages .pd_fast_goto_page { margin-left: 8px; }
  .pd_fast_goto_floor span:hover, .pd_fast_goto_page span:hover { color: #51d; cursor: pointer; text-decoration: underline; }
  .pd_user_memo { font-size: 12px; color: #999; line-height: 14px; }
  .pd_user_memo_tips { font-size: 12px; color: #fff; margin-left: 3px; cursor: help; }
  .pd_user_memo_tips:hover { color: #ddd; }
  .readtext img[onclick] { max-width: 550px; }
  .read_fds { text-align: left !important; font-weight: normal !important; font-style: normal !important; }
  .pd_code_area { max-height: 550px; overflow-y: auto; font-size: 12px; }
  
  /* 道具页面 */
  .pd_item_btns { text-align: right; margin-top: 5px;  }
  .pd_item_btns button, .pd_item_btns input { margin-bottom: 2px; vertical-align: middle; }
  .pd_my_items > tbody > tr > td > a + a { margin-left: 15px; }
  .pd_result { border: 1px solid #99f; padding: 5px; margin-top: 10px; line-height: 2em; }
  .pd_result_sep { border-bottom: 1px solid #999; margin: 7px 0; }
  .pd_result_sep_inner { border-bottom: 1px dashed #999; margin: 5px 0; }
  .pd_usable_num { color: #669933; }
  .pd_used_num { color: #ff0033; }
  .pd_used_item_info { color: #666; float: right; cursor: help; margin-right: 5px; }
  .pd_item_type_chk { margin-right: 5px; }
  
  /* 发帖页面 */
  #pdSmilePanel img { margin: 3px; cursor: pointer; }
  .editor-button .pd_editor_btn { background: none; text-indent: 0; line-height: 18px; cursor: default; }
  .pd_post_extra_option { text-align: left; margin-top: 5px; margin-left: 5px; }
  .pd_post_extra_option input { vertical-align: middle; height: auto; margin-right: 0; }
  
  /* 其它页面 */
  .pd_thread_page { margin-left: 5px; }
  .pd_thread_page a { color: #444; padding: 0 3px; }
  .pd_thread_page a:hover { color: #51d; }
  .pd_card_chk { position: absolute; bottom: -8px; left: 1px; }
  .b_tit4 .pd_thread_goto, .b_tit4_1 .pd_thread_goto { position: absolute; top: 0; right: 0; padding: 0 15px; }
  .b_tit4 .pd_thread_goto:hover, .b_tit4_1 .pd_thread_goto:hover { padding-left: 15px; }
  .pd_id_color_select > td { position: relative; cursor: pointer; }
  .pd_id_color_select > td > input { position: absolute; top: 18px; left: 10px; }

  /* 设置对话框 */
  .pd_cfg_ml { margin-left: 10px; }
  .pd_cfg_box {
    position: ${ _Info2.default.isMobile ? 'absolute' : 'fixed' }; border: 1px solid #9191ff; display: none; z-index: 1002;
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
  .pd_cfg_tips { color: #51d; text-decoration: none; cursor: help; }
  .pd_cfg_tips:hover { color: #ff0000; }
  #pdConfigDialog .pd_cfg_main { overflow-x: hidden; white-space: nowrap; }
  .pd_cfg_panel { display: inline-block; width: 380px; vertical-align: top; }
  .pd_cfg_panel + .pd_cfg_panel { margin-left: 5px; }
  .pd_cfg_btns { background-color: #fcfcfc; text-align: right; padding: 5px; }
  .pd_cfg_btns button { min-width: 80px; }
  .pd_cfg_about { float: left; line-height: 24px; margin-left: 5px; }
  .pd_custom_script_header { margin: 7px 0; padding: 5px; background-color: #e8e8e8; border-radius: 5px; }
  .pd_custom_script_content { display: none; width: 750px; height: 350px; white-space: pre; }

  /* 日志对话框 */
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
        $('head').append(`<style>${ Config.customCssContent }</style>`);
    }
};

/**
 * 添加设置和日志对话框的链接
 */
const addConfigAndLogDialogLink = exports.addConfigAndLogDialogLink = function () {
    $('<a data-name="openConfigDialog" href="#">助手设置</a><span> | </span><a data-name="openLogDialog" href="#">助手日志</a><span> | </span>').insertBefore($('a[href^="login.php?action=quit"]:first')).filter('[data-name="openConfigDialog"]').click(function (e) {
        e.preventDefault();
        (0, _ConfigDialog.show)();
    }).end().filter('[data-name="openLogDialog"]').click(function (e) {
        e.preventDefault();
        (0, _LogDialog.show)();
    });
};

/**
 * 在操作进行时阻止关闭页面
 * @param e
 * @returns {string} 提示消息
 */
const preventCloseWindowWhenActioning = exports.preventCloseWindowWhenActioning = function (e) {
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
const showFormatLog = exports.showFormatLog = function (msgType, html) {
    let { msg, url } = Util.getResponseMsg(html);
    console.log(`【${ msgType }】回应：${ msg }${ url ? `；跳转地址：${ Util.getHostNameUrl() }${ url }` : '' }`);
};

/**
 * 添加兼容方法
 */
const addPolyfill = exports.addPolyfill = function () {
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
                if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
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
const donation = exports.donation = function (isAutoSaveCurrentDeposit = false) {
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
        $.post('kf_growup.php?ok=1', { kfb: kfb }, function (html) {
            Util.setCookie(_Const2.default.donationCookieName, 1, getDonationCookieDate());
            showFormatLog(`捐款${ kfb }KFB`, html);
            let { msg } = Util.getResponseMsg(html);
            Msg.remove($wait);

            let msgHtml = `<strong>捐款<em>${ kfb }</em>KFB</strong>`;
            let matches = /捐款获得(\d+)经验值(?:.*?补偿期(?:.*?\+(\d+)KFB)?(?:.*?(\d+)成长经验)?)?/i.exec(msg);
            if (!matches) {
                if (/KFB不足。/.test(msg)) {
                    msgHtml += '<i class="pd_notice">KFB不足</i><a target="_blank" href="kf_growup.php">手动捐款</a>';
                } else return;
            } else {
                msgHtml += `<i>经验值<em>+${ matches[1] }</em></i>`;
                let gain = { '经验值': parseInt(matches[1]) };
                if (typeof matches[2] !== 'undefined' || typeof matches[3] !== 'undefined') {
                    msgHtml += '<i style="margin-left: 5px;">(补偿期:</i>' + (typeof matches[2] !== 'undefined' ? `<i>KFB<em>+${ matches[2] }</em>${ typeof matches[3] !== 'undefined' ? '' : ')' }</i>` : '') + (typeof matches[3] !== 'undefined' ? `<i>经验值<em>+${ matches[3] }</em>)</i>` : '');
                    if (typeof matches[2] !== 'undefined') gain['KFB'] = parseInt(matches[2]);
                    if (typeof matches[3] !== 'undefined') gain['经验值'] += parseInt(matches[3]);
                }
                Log.push('捐款', `捐款\`${ kfb }\`KFB`, { gain: gain, pay: { 'KFB': -kfb } });
            }
            Msg.show(msgHtml);
            if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit(true);
            Func.run('Public.donation_after_', msg);
        });
    };

    if (/%$/.test(Config.donationKfb)) {
        $.get(`profile.php?action=show&uid=${ _Info2.default.uid }&t=${ new Date().getTime() }`, function (html) {
            let matches = /论坛货币：(-?\d+)\s*KFB/i.exec(html);
            let income = 1;
            if (matches) income = parseInt(matches[1]);else console.log('当前持有KFB获取失败');
            let donationKfb = parseInt(Config.donationKfb);
            donationKfb = Math.floor(income * donationKfb / 100);
            donationKfb = donationKfb > 0 ? donationKfb : 1;
            donationKfb = donationKfb <= _Const2.default.maxDonationKfb ? donationKfb : _Const2.default.maxDonationKfb;
            donationSubmit(donationKfb);
        });
    } else {
        $.get(`kf_growup.php?t=${ new Date().getTime() }`, function (html) {
            if (/>今天已经捐款</.test(html)) {
                Msg.remove($wait);
                Util.setCookie(_Const2.default.donationCookieName, 1, getDonationCookieDate());
                if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit();
            } else {
                donationSubmit(parseInt(Config.donationKfb));
            }
        });
    }
};

/**
 * 获取倒计时的最小时间间隔（秒）
 * @returns {number} 倒计时的最小时间间隔（秒）
 */
const getMinRefreshInterval = exports.getMinRefreshInterval = function () {
    let donationInterval = -1;
    if (Config.autoDonationEnabled) {
        let donationTime = Util.getDateByTime(Config.donationAfterTime);
        let now = new Date();
        if (!Util.getCookie(_Const2.default.donationCookieName) && now <= donationTime) {
            donationInterval = Math.floor((donationTime - now) / 1000);
        } else {
            donationTime.setDate(donationTime.getDate() + 1);
            donationInterval = Math.floor((donationTime - now) / 1000);
        }
    }

    let autoChangeIdColorInterval = -1;
    if (Config.autoChangeIdColorEnabled) {
        let nextTime = parseInt(Util.getCookie(_Const2.default.autoChangeIdColorCookieName));
        if (!isNaN(nextTime) && nextTime > 0) {
            autoChangeIdColorInterval = Math.floor((nextTime - new Date().getTime()) / 1000);
            if (autoChangeIdColorInterval < 0) autoChangeIdColorInterval = 0;
            if (!Config.changeAllAvailableIdColorEnabled && Config.customAutoChangeIdColorList.length <= 1) autoChangeIdColorInterval = -1;
        } else autoChangeIdColorInterval = 0;
    }

    let minArr = [donationInterval, autoChangeIdColorInterval].filter(interval => interval >= 0);
    if (minArr.length > 0) {
        let min = Math.min(...minArr);
        return min > 0 ? min + 1 : 0;
    } else return -1;
};

/**
 * 启动定时模式
 */
const startAutoRefreshMode = exports.startAutoRefreshMode = function () {
    let interval = getMinRefreshInterval();
    if (interval === -1) return;
    let oriTitle = document.title;
    let titleItvFunc = null;
    let prevInterval = -1,
        errorNum = 0;

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
        if (type === 1) textInterval += (diff.minutes > 0 ? diff.minutes + '分' : '') + diff.seconds + '秒';else textInterval += diff.minutes + '分';
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
                document.title = `${ oriTitle } (定时: ${ getFormatIntervalTitle(interval < 60 ? 1 : 2, showInterval) })`;
                showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            };
            if (isShowTitle || Config.showRefreshModeTipsType.toLowerCase() === 'always' || interval < 60) showIntervalTitle();else showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            titleItvFunc = setInterval(showIntervalTitle, _Const2.default.showRefreshModeTipsInterval * 60 * 1000);
        }
    };

    /**
     * 处理错误
     */
    const handleError = function () {
        let interval = 0,
            errorText = '';
        $.ajax({
            type: 'GET',
            url: 'index.php?t=' + new Date().getTime(),
            timeout: _Const2.default.defAjaxTimeout,
            success(html) {
                if (!/"kf_fw_ig_index.php"/.test(html)) {
                    interval = 10;
                    errorText = '论坛维护或其它未知情况';
                }
            },
            error() {
                interval = _Const2.default.errorRefreshInterval;
                errorText = '连接超时';
            },
            complete() {
                if (interval > 0) {
                    console.log(`定时操作失败（原因：${ errorText }），将在${ interval }分钟后重试...`);
                    Msg.remove($('.pd_refresh_notice').parent());
                    Msg.show(`<strong class="pd_refresh_notice">定时操作失败（原因：${ errorText }），将在<em>${ interval }</em>分钟后重试&hellip;</strong>`, -1);
                    setTimeout(handleError, interval * 60 * 1000);
                    showRefreshModeTips(interval * 60, true);
                } else {
                    if (errorNum > 6) {
                        errorNum = 0;
                        interval = 15;
                        setTimeout(checkRefreshInterval, interval * 60 * 1000);
                        showRefreshModeTips(interval * 60, true);
                    } else {
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
        if (Config.autoDonationEnabled && !Util.getCookie(_Const2.default.donationCookieName)) donation();
        if (Config.autoChangeIdColorEnabled && !Util.getCookie(_Const2.default.autoChangeIdColorCookieName)) changeIdColor();

        let interval = getMinRefreshInterval();
        if (interval > 0) errorNum = 0;
        if (interval === 0 && prevInterval === 0) {
            prevInterval = -1;
            handleError();
            return;
        } else prevInterval = interval;
        if (interval === -1) {
            if (titleItvFunc) clearInterval(titleItvFunc);
            return;
        } else if (interval === 0) interval = _Const2.default.actionFinishRetryInterval;
        setTimeout(checkRefreshInterval, interval * 1000);
        showRefreshModeTips(interval, true);
    };

    setTimeout(checkRefreshInterval, interval < 60 ? 60 * 1000 : interval * 1000);
    showRefreshModeTips(interval < 60 ? 60 : interval);
};

/**
 * 关注用户
 */
const followUsers = exports.followUsers = function () {
    if (!Config.followUserList.length) return;
    if (_Info2.default.isInHomePage && Config.highlightFollowUserThreadInHPEnabled) {
        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            let $this = $(this);
            let matches = /》by：(.+)/.exec($this.attr('title'));
            if (!matches) return;
            if (Util.inFollowOrBlockUserList(matches[1], Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/thread.php') {
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
                if (Config.highlightFollowUserThreadLinkEnabled) $this.parent('td').prev('td').prev('td').find('div > a[href^="read.php?tid="]').addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/read.php') {
        $('.readidmsbottom > a, .readidmleft > a').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child').find('a').addBack().addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/guanjianci.php' || location.pathname === '/kf_share.php') {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/search.php') {
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
const blockUsers = exports.blockUsers = function () {
    if (Config.blockUserList.length === 0) return;
    let blockNum = 0;
    if (_Info2.default.isInHomePage) {
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
    } else if (location.pathname === '/thread.php') {
        let fid = parseInt($('input[name="f_fid"]:first').val());
        if (!fid) return;
        if (Config.blockUserForumType === 1 && $.inArray(fid, Config.blockUserFidList) === -1) return;else if (Config.blockUserForumType === 2 && $.inArray(fid, Config.blockUserFidList) > -1) return;
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                blockNum++;
                $this.closest('tr').remove();
            }
        });
    } else if (location.pathname === '/read.php') {
        if (Config.blockUserForumType > 0) {
            let fid = parseInt($('input[name="fid"]:first').val());
            if (!fid) return;
            if (Config.blockUserForumType === 1 && $.inArray(fid, Config.blockUserFidList) === -1) return;else if (Config.blockUserForumType === 2 && $.inArray(fid, Config.blockUserFidList) > -1) return;
        }
        let page = Util.getCurrentThreadPage();
        $('.readidmsbottom > a, .readidmleft > a').each(function (i) {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1) {
                let type = Config.blockUserList[index].type;
                if (i === 0 && page === 1 && type > 1) return;else if ((i === 0 && page !== 1 || i > 0) && type === 1) return;
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
                    let regex1 = new RegExp(`^Quote:引用(第\\d+楼|楼主)${ data.name }于`, 'i');
                    let regex2 = new RegExp(`^Quote:回\\s*\\d+楼\\(${ data.name }\\)\\s*的帖子`, 'i');
                    if (regex1.test(text) || regex2.test(text)) {
                        $this.html(`<legend>Quote:</legend><mark class="pd_custom_tips" title="被屏蔽用户：${ data.name }">该用户已被屏蔽</mark>`);
                    }
                } catch (ex) {}
            }
        });
    } else if (location.pathname === '/guanjianci.php' && Config.blockUserAtTipsEnabled) {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.blockUserList) > -1) {
                blockNum++;
                $this.closest('tr').remove();
            }
        });
    }
    if (blockNum > 0) console.log(`【屏蔽用户】共有${ blockNum }个帖子被屏蔽`);
};

/**
 * 屏蔽帖子
 */
const blockThread = exports.blockThread = function () {
    if (!Config.blockThreadList.length) return;

    /**
     * 是否屏蔽帖子
     * @param {string} title 帖子标题
     * @param {string} userName 用户名
     * @param {number} fid 版块ID
     * @returns {boolean} 是否屏蔽
     */
    const isBlock = function (title, userName, fid = 0) {
        for (let { keyWord, includeUser, excludeUser, includeFid, excludeFid } of Config.blockThreadList) {
            let regex = null;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    regex = eval(keyWord);
                } catch (ex) {
                    console.log(ex);
                    continue;
                }
            }
            if (userName) {
                if (includeUser) {
                    if (!includeUser.includes(userName)) continue;
                } else if (excludeUser) {
                    if (excludeUser.includes(userName)) continue;
                }
            }
            if (fid) {
                if (includeFid) {
                    if (!includeFid.includes(fid)) continue;
                } else if (excludeFid) {
                    if (excludeFid.includes(fid)) continue;
                }
            }
            if (regex) {
                if (regex.test(title)) return true;
            } else {
                if (title.toLowerCase().includes(keyWord.toLowerCase())) return true;
            }
        }
        return false;
    };

    let num = 0;
    if (_Info2.default.isInHomePage) {
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
    } else if (location.pathname === '/thread.php') {
        let fid = parseInt($('input[name="f_fid"]:first').val());
        if (!fid) return;
        $('.threadtit1 a[href^="read.php"]').each(function () {
            let $this = $(this);
            if (isBlock($this.text(), $this.closest('tr').find('td:last-child > a.bl').text(), fid)) {
                num++;
                $this.closest('tr').remove();
            }
        });
    } else if (location.pathname === '/read.php') {
        if (Util.getCurrentThreadPage() !== 1) return;
        let title = Read.getThreadTitle();
        if (!title) return;
        let $userName = $('.readidmsbottom > a, .readidmleft > a').eq(0);
        if ($userName.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child').text().trim() !== '楼主') return;
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
    if (num > 0) console.log(`【屏蔽帖子】共有${ num }个帖子被屏蔽`);
};

/**
 * 将侧边栏修改为和手机相同的平铺样式
 */
const modifySideBar = exports.modifySideBar = function () {
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
const addFastNavForSideBar = exports.addFastNavForSideBar = function () {
    let $menu = $('#r_menu');
    if (!$menu.hasClass('r_cmenu')) {
        if (!Config.modifySideBarEnabled) {
            $menu.append('<a href="/">论坛首页</a><br>');
        }
        $menu.find('> a:last').before(`
<span style="color: #ff9999;">快捷导航</span><br>
<a href="guanjianci.php?gjc=${ _Info2.default.userName }">@提醒</a> | <a href="personal.php?action=post">回复</a> | <a href="kf_growup.php">等级</a><br>
<a href="kf_fw_ig_index.php">争夺</a> | <a href="kf_fw_ig_my.php">道具</a> | <a href="kf_fw_ig_shop.php">商店</a><br>
<a href="profile.php?action=modify">设置</a> | <a href="hack.php?H_name=bank">银行</a> | <a href="profile.php?action=favor">收藏</a><br>
${ _Const2.default.customTileSideBarContent }
`);
    } else {
        $menu.find('> ul > li:last-child').before(`
<li class="r_cmenuho">
  <a href="javascript:;">快捷导航</a>
  <ul class="r_cmenu2">
    <li><a href="guanjianci.php?gjc=${ _Info2.default.userName }">@提醒</a></li>
    <li><a href="kf_growup.php">等级经验</a></li>
    <li><a href="kf_fw_ig_index.php">争夺奖励</a></li>
    <li><a href="kf_fw_ig_my.php">我的道具</a></li>
    <li><a href="kf_fw_ig_shop.php">道具商店</a></li>
    <li><a href="profile.php?action=modify">设置</a></li>
    <li><a href="hack.php?H_name=bank">银行</a></li>
    <li><a href="profile.php?action=favor">收藏</a></li>
    <li><a href="personal.php?action=post">我的回复</a></li>
    ${ _Const2.default.customSideBarContent }
  </ul>
</li>
`);
    }
};

/**
 * 自动活期存款
 * @param {boolean} isRead 是否读取个人信息页面以获得当前所拥有KFB的信息
 */
const autoSaveCurrentDeposit = exports.autoSaveCurrentDeposit = function (isRead = false) {
    if (!(Config.saveCurrentDepositAfterKfb > 0 && Config.saveCurrentDepositKfb > 0 && Config.saveCurrentDepositKfb <= Config.saveCurrentDepositAfterKfb)) return;
    let $kfb = $('a[href="kf_givemekfb.php"]');

    /**
     * 活期存款
     * @param {number} income 当前拥有的KFB
     */
    const saveCurrentDeposit = function (income) {
        if (income < Config.saveCurrentDepositAfterKfb) return;
        let multiple = Math.floor((income - Config.saveCurrentDepositAfterKfb) / Config.saveCurrentDepositKfb);
        if (income - Config.saveCurrentDepositKfb * multiple >= Config.saveCurrentDepositAfterKfb) multiple++;
        let money = Config.saveCurrentDepositKfb * multiple;
        if (money <= 0 || money > income) return;
        console.log('自动活期存款Start');
        $.post('hack.php?H_name=bank', { action: 'save', btype: 1, savemoney: money }, function (html) {
            showFormatLog('自动存款', html);
            let { msg } = Util.getResponseMsg(html);
            if (/完成存款/.test(msg)) {
                Log.push('自动存款', `共有\`${ money }\`KFB已自动存入活期存款`);
                console.log(`共有${ money }KFB已自动存入活期存款`);
                Msg.show(`共有<em>${ money }</em>KFB已自动存入活期存款`);
                if (_Info2.default.isInHomePage) $kfb.text(`拥有${ income - money }KFB`);
            }
        });
    };

    if (isRead) {
        console.log('获取当前持有KFB Start');
        $.get(`profile.php?action=show&uid=${ _Info2.default.uid }&t=${ new Date().getTime() }`, function (html) {
            let matches = /论坛货币：(\d+)\s*KFB<br/i.exec(html);
            if (matches) saveCurrentDeposit(parseInt(matches[1]));
        });
    } else {
        let matches = /拥有(\d+)KFB/.exec($kfb.text());
        if (matches) saveCurrentDeposit(parseInt(matches[1]));
    }
};

/**
 * 更换ID颜色
 */
const changeIdColor = exports.changeIdColor = function () {
    if (!Config.changeAllAvailableIdColorEnabled && Config.customAutoChangeIdColorList.length <= 1) return;
    /**
     * 写入Cookie
     */
    const setCookie = function () {
        let nextTime = Util.getDate(`+${ Config.autoChangeIdColorInterval }h`);
        Util.setCookie(_Const2.default.autoChangeIdColorCookieName, nextTime.getTime(), nextTime);
    };
    console.log('自动更换ID颜色Start');
    $.get('kf_growup.php?t=' + new Date().getTime(), function (html) {
        if (Util.getCookie(_Const2.default.autoChangeIdColorCookieName)) return;
        let matches = html.match(/href="kf_growup\.php\?ok=2&safeid=\w+&color=\d+"/g);
        if (matches) {
            let safeId = '';
            let safeIdMatches = /safeid=(\w+)&/i.exec(matches[0]);
            if (safeIdMatches) safeId = safeIdMatches[1];
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

            let prevId = parseInt(TmpLog.getValue(_Const2.default.prevAutoChangeIdColorTmpLogName));
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
            } else {
                for (let [i, id] of idList.entries()) {
                    if (id === prevId) {
                        idList.splice(i, 1);
                        break;
                    }
                }
                nextId = idList[Math.floor(Math.random() * idList.length)];
            }

            $.get(`kf_growup.php?ok=2&safeid=${ safeId }&color=${ nextId }&t=${ new Date().getTime() }`, function (html) {
                setCookie();
                showFormatLog('自动更换ID颜色', html);
                let { msg } = Util.getResponseMsg(html);
                if (/等级颜色修改完毕/.test(msg)) {
                    console.log('ID颜色更换为：' + nextId);
                    TmpLog.setValue(_Const2.default.prevAutoChangeIdColorTmpLogName, nextId);
                }
            });
        } else {
            setCookie();
        }
    });
};

/**
 * 显示元素的title属性提示（用于移动版浏览器）
 * @param {{}} e 点击事件
 * @param {string} title title属性
 */
const showElementTitleTips = exports.showElementTitleTips = function (e, title) {
    $('.pd_title_tips').remove();
    if (!title || !e.originalEvent) return;
    $(`<div class="pd_title_tips">${ title }</div>`).appendTo('body').css('left', e.originalEvent.pageX - 20).css('top', e.originalEvent.pageY + 15);
};

/**
 * 绑定包含title属性元素的点击事件（用于移动版浏览器）
 */
const bindElementTitleClick = exports.bindElementTitleClick = function () {
    let excludeNodeNameList = ['A', 'IMG', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'];
    $(document).click(function (e) {
        let target = e.target;
        if (!target.title && !excludeNodeNameList.includes(target.nodeName) && target.parentNode && target.parentNode.title) target = target.parentNode;
        if (target.title && !excludeNodeNameList.includes(target.nodeName) && (!target.id || !target.id.startsWith('wy_')) && !$(target).is('.pd_editor_btn')) {
            showElementTitleTips(e, target.title);
        } else {
            $('.pd_title_tips').remove();
        }
    });
};

/**
 * 绑定搜索类型下拉菜单点击事件
 */
const bindSearchTypeSelectMenuClick = exports.bindSearchTypeSelectMenuClick = function () {
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
            if (type === '作者') $keyWord.attr('name', 'pwuser');else $keyWord.attr('name', 'keyword');
            let $searchRange = $form.find('[name="searchRange"][value="current"]');
            if ($searchRange.length > 0) {
                $searchRange.prop('disabled', type === '关键词' || type === '用户名' || !$searchRange.data('enabled'));
            }
            $searchTypeList.remove();
            $keyWord.focus();
        });
    });

    $(document).on('submit', 'form[name="pdSearchForm"]', function () {
        let $this = $(this);
        let type = $.trim($this.find('.pd_search_type > span').text());
        if (type === '关键词') {
            $this.attr('action', 'guanjianci.php?gjc=' + $this.find('input[name="keyword"]').val());
        } else if (type === '用户名') {
            $this.attr('action', 'profile.php?action=show&username=' + $this.find('input[name="keyword"]').val());
        }
    });
};

/**
 * 可使用2个字以下的关键字进行搜索
 */
const makeSearchByBelowTwoKeyWordAvailable = exports.makeSearchByBelowTwoKeyWordAvailable = function () {
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
const addSearchDialogLink = exports.addSearchDialogLink = function () {
    $('<span> | </span><a href="#">搜索</a>').insertAfter('.topright > a[href="message.php"]').filter('a').click(function (e) {
        e.preventDefault();
        const dialogName = 'pdSearchDialog';
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
            'target': '_blank'
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
const repairBbsErrorCode = exports.repairBbsErrorCode = function () {
    _Info2.default.w.is_ie = false;
    if (location.pathname === '/read.php') {
        _Info2.default.w.strlen = Util.getStrByteLen;
    }
};

/**
 * 通过左右键进行翻页
 */
const turnPageViaKeyboard = exports.turnPageViaKeyboard = function () {
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
        } else {
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
const checkRatingSize = exports.checkRatingSize = function (title, ratingSize) {
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
        return { type: -1 };
    } else if (titleSize > ratingSize * (100 + _Const2.default.ratingErrorSizePercent) / 100 + 1 || titleSize < ratingSize * (100 - _Const2.default.ratingErrorSizePercent) / 100 - 1) {
        return { type: 1, titleSize, ratingSize };
    } else return { type: 0 };
};

/**
 * 引入绯月表情增强插件
 */
const importKfSmileEnhanceExtension = exports.importKfSmileEnhanceExtension = function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = 'https://kf.miaola.info/kfe.min.user.js?' + Util.getDateString(new Date(), '');
    document.body.appendChild(script);
};

},{"./ConfigDialog":5,"./Const":6,"./Dialog":7,"./Func":8,"./Info":10,"./Log":12,"./LogDialog":13,"./Msg":15,"./Read":19,"./TmpLog":21,"./Util":22}],19:[function(require,module,exports){
/* 帖子模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getThreadTitle = exports.addSelfRatingLink = exports.showAttachImageOutsideSellBox = exports.parseMediaTag = exports.addMoreSmileLink = exports.addCopyCodeLink = exports.addUserMemo = exports.buyThreads = exports.addBatchBuyThreadButton = exports.handleBuyThreadBtn = exports.modifyKFOtherDomainLink = exports.addMultiQuoteButton = exports.getMultiQuoteData = exports.addStatRepliersLink = exports.showStatRepliersDialog = exports.addCopyBuyersListLink = exports.adjustThreadContentFontSize = exports.adjustThreadContentWidth = exports.modifySmColor = exports.modifyMySmColor = exports.modifyFloorSmColor = exports.fastGotoFloor = exports.addFastGotoFloorInput = exports.addFloorGotoLink = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Func = require('./Func');

var Func = _interopRequireWildcard(_Func);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

var _Post = require('./Post');

var Post = _interopRequireWildcard(_Post);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 为帖子里的每个楼层添加跳转链接
 */
const addFloorGotoLink = exports.addFloorGotoLink = function () {
    $('.readlou > div:nth-child(2) > span').each(function () {
        let $this = $(this);
        let floorText = $this.text();
        if (!/^\d+楼$/.test(floorText)) return;
        let linkName = $this.closest('.readlou').prev().attr('name');
        if (!linkName || !/^\d+$/.test(linkName)) return;
        let url = `${ Util.getHostNameUrl() }read.php?tid=${ Util.getUrlParam('tid') }&spid=${ linkName }`;
        $this.html(`<a class="pd_goto_link" href="${ url }" title="复制楼层链接">${ floorText }</a>`);
        $this.find('a').click(function (e) {
            e.preventDefault();
            let $this = $(this);
            let url = $this.attr('href');
            $this.data('copy-text', url);
            if (!Util.copyText($this, '楼层链接已复制')) {
                prompt('本楼的跳转链接（请按Ctrl+C复制）：', url);
            }
        });
    });
};

/**
 * 添加快速跳转到指定楼层的输入框
 */
const addFastGotoFloorInput = exports.addFastGotoFloorInput = function () {
    $('<form><li class="pd_fast_goto_floor">电梯直达 <input class="pd_input" style="width:30px" type="text" maxlength="8"> <span>楼</span></li></form>').prependTo($('.readtext:first').prev('.readlou').find('> div:first-child > ul')).submit(function (e) {
        e.preventDefault();
        let floor = parseInt($(this).find('input').val());
        if (!floor || floor < 0) return;
        location.href = `${ Util.getHostNameUrl }read.php?tid=${ Util.getUrlParam('tid') }&page=${ parseInt(floor / Config.perPageFloorNum) + 1 }&floor=${ floor }`;
    }).find('span').click(function () {
        $(this).closest('form').submit();
    }).end().closest('div').next().css({ 'max-width': '505px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });
};

/**
 * 将页面滚动到指定楼层
 */
const fastGotoFloor = exports.fastGotoFloor = function () {
    let floor = parseInt(Util.getUrlParam('floor'));
    if (!floor || floor < 0) return;
    let $floorNode = $(`.readlou > div:nth-child(2) > span:contains("${ floor }楼")`);
    if (!$floorNode.length) return;
    let linkName = $floorNode.closest('.readlou').prev().attr('name');
    if (!linkName || !/^\d+$/.test(linkName)) return;
    location.hash = '#' + linkName;
};

/**
 * 修改指定楼层的神秘颜色
 * @param {jQuery} $elem 指定楼层的发帖者的用户名链接的jQuery对象
 * @param {string} color 神秘颜色
 */
const modifyFloorSmColor = exports.modifyFloorSmColor = function ($elem, color) {
    if ($elem.is('.readidmsbottom > a')) $elem.css('color', color);
    $elem.closest('.readtext').css('border-color', color).prev('.readlou').css('border-color', color).next().next('.readlou').css('border-color', color);
};

/**
 * 修改本人的神秘颜色
 */
const modifyMySmColor = exports.modifyMySmColor = function () {
    let $my = $(`.readidmsbottom > a[href="profile.php?action=show&uid=${ _Info2.default.uid }"]`);
    if (!$my.length) $my = $(`.readidmleft > a[href="profile.php?action=show&uid=${ _Info2.default.uid }"]`);
    if ($my.length > 0) modifyFloorSmColor($my, Config.customMySmColor);
};

/**
 * 修改各等级神秘颜色
 */
const modifySmColor = exports.modifySmColor = function () {
    if (!Config.customSmColorConfigList.length) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        let $this = $(this);
        let smLevel = '';
        if ($this.is('.readidmleft > a')) {
            smLevel = $this.parent().next('.readidmright').text().toUpperCase();
            if (!/(-?\d+|MAX)/i.test(smLevel)) return;
        } else {
            let matches = /(-?\d+|MAX)级神秘/i.exec($this.parent().contents().last().text());
            if (!matches) return;
            smLevel = matches[1].toUpperCase();
        }
        for (let { min, max, color } of Config.customSmColorConfigList) {
            if (Util.compareSmLevel(smLevel, min) >= 0 && Util.compareSmLevel(smLevel, max) <= 0) {
                modifyFloorSmColor($this, color);
                break;
            }
        }
    });
};

/**
 * 调整帖子内容宽度，使其保持一致
 */
const adjustThreadContentWidth = exports.adjustThreadContentWidth = function () {
    $('head').append(`
<style>
  .readtext > table > tbody > tr > td { padding-left: 192px; }
  .readidms, .readidm { margin-left: -192px !important; }
</style>
`);
};

/**
 * 调整帖子内容字体大小
 */
const adjustThreadContentFontSize = exports.adjustThreadContentFontSize = function () {
    if (Config.threadContentFontSize > 0 && Config.threadContentFontSize !== 12) {
        $('head').append(`
<style>
  .readtext td { font-size: ${ Config.threadContentFontSize }px; line-height: 1.6em; }
  .readtext td > div, .readtext td > .read_fds { font-size: 12px; }
</style>
`);
    }
};

/**
 * 添加复制购买人名单的链接
 */
const addCopyBuyersListLink = exports.addCopyBuyersListLink = function () {
    $('<a style="margin:0 2px 0 5px;" href="#">复制名单</a>').insertAfter('.readtext select[name="buyers"]').click(function (e) {
        e.preventDefault();
        let buyerList = [];
        $(this).prev('select').children('option').each(function (index) {
            let name = $(this).text();
            if (!index || name === '-'.repeat(11)) return;
            buyerList.push(name);
        });
        if (!buyerList.length) {
            alert('暂时无人购买');
            return;
        }
        const dialogName = 'pdCopyBuyerListDialog';
        if ($('#' + dialogName).length > 0) return;
        let html = `
<div class="pd_cfg_main">
  <textarea style="width: 200px; height: 300px; margin: 5px 0;" readonly></textarea>
</div>`;
        let $dialog = Dialog.create(dialogName, '购买人名单', html);
        Dialog.show(dialogName);
        $dialog.find('textarea').val(buyerList.join('\n')).select().focus();
    });
};

/**
 * 显示统计回帖者名单对话框
 * @param {string[]} replierList 回帖者名单列表
 */
const showStatRepliersDialog = exports.showStatRepliersDialog = function (replierList) {
    const dialogName = 'pdReplierListDialog';
    let html = `
<div class="pd_cfg_main">
  <div id="pdReplierListFilter" style="margin-top: 5px;">
    <label><input type="checkbox" checked> 显示楼层号</label>
    <label><input type="checkbox"> 去除重复</label>
    <label><input type="checkbox"> 去除楼主</label>
  </div>
  <div style="color: #f00;" id="pdReplierListStat"></div>
  <textarea style="width: 250px; height: 300px; margin: 5px 0;" readonly></textarea>
</div>`;
    let $dialog = Dialog.create(dialogName, '回帖者名单', html);

    let $filterNodes = $dialog.find('#pdReplierListFilter input');
    $filterNodes.click(function () {
        let list = [...replierList];
        let isShowFloor = $filterNodes.eq(0).prop('checked'),
            isRemoveRepeated = $filterNodes.eq(1).prop('checked'),
            isRemoveTopFloor = $filterNodes.eq(2).prop('checked');
        if (isRemoveRepeated) {
            list = list.map((elem, index, list) => list.indexOf(elem) === index ? elem : null);
        }
        if (isRemoveTopFloor) {
            let topFloor = $('.readtext:first').find('.readidmsbottom, .readidmleft').find('a').text();
            list = list.map(elem => elem !== topFloor ? elem : null);
        }
        let content = '';
        let num = 0;
        for (let [floor, userName] of list.entries()) {
            if (!userName) continue;
            content += (isShowFloor ? floor + 'L：' : '') + userName + '\n';
            num++;
        }
        $dialog.find('textarea').val(content);
        $dialog.find('#pdReplierListStat').html(`共有<b>${ num }</b>条项目`);
    });
    $dialog.find('#pdReplierListFilter input:first').triggerHandler('click');

    Dialog.show(dialogName);
    $dialog.find('input:first').focus();
};

/**
 * 添加统计回帖者名单的链接
 */
const addStatRepliersLink = exports.addStatRepliersLink = function () {
    if (Util.getCurrentThreadPage() !== 1) return;
    $('<li><a href="#" title="统计回帖者名单">[统计回帖]</a></li>').prependTo('.readtext:first + .readlou > div > .pages').find('a').click(function (e) {
        e.preventDefault();
        if ($('#pdReplierListDialog').length > 0) return;

        let tid = Util.getUrlParam('tid');
        if (!tid) return;
        let value = $.trim(prompt('统计到第几楼？（0表示统计所有楼层，可用m-n的方式来设定统计楼层的区间范围）', 0));
        if (value === '') return;
        if (!/^\d+(-\d+)?$/.test(value)) {
            alert('统计楼层格式不正确');
            return;
        }
        let startFloor = 0,
            endFloor = 0;
        let valueArr = value.split('-');
        if (valueArr.length === 2) {
            startFloor = parseInt(valueArr[0]);
            endFloor = parseInt(valueArr[1]);
        } else endFloor = parseInt(valueArr[0]);
        if (endFloor < startFloor) {
            alert('统计楼层格式不正确');
            return;
        }
        let matches = /(\d+)页/.exec($('.pages:eq(0) > li:last-child > a').text());
        let maxPage = matches ? parseInt(matches[1]) : 1;
        if (startFloor === 0) startFloor = 1;
        if (endFloor === 0) endFloor = maxPage * Config.perPageFloorNum - 1;
        let startPage = Math.floor(startFloor / Config.perPageFloorNum) + 1;
        let endPage = Math.floor(endFloor / Config.perPageFloorNum) + 1;
        if (endPage > maxPage) endPage = maxPage;
        if (endPage - startPage > _Const2.default.statRepliersMaxPage) {
            alert('需访问的总页数不可超过' + _Const2.default.statRepliersMaxPage);
            return;
        }

        Msg.wait(`<strong>正在统计回帖名单中&hellip;</strong><i>剩余页数：<em class="pd_countdown">${ endPage - startPage + 1 }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        let isStop = false;
        $(document).clearQueue('StatRepliers');
        let replierList = [];
        $.each(new Array(endPage), function (index) {
            if (index + 1 < startPage) return;
            $(document).queue('StatRepliers', function () {
                $.ajax({
                    type: 'GET',
                    url: `read.php?tid=${ tid }&page=${ index + 1 }&t=${ new Date().getTime() }`,
                    timeout: _Const2.default.defAjaxTimeout,
                    success(html) {
                        let matches = html.match(/<span style=".+?">\d+楼<\/span> <span style=".+?">(.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+" target="_blank" style=".+?">.+?<\/a>/gi);
                        for (let i in matches) {
                            let floorMatches = /<span style=".+?">(\d+)楼<\/span>(?:.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+".+?>(.+?)<\/a>/i.exec(matches[i]);
                            if (!floorMatches) continue;
                            let floor = parseInt(floorMatches[1]);
                            if (floor < startFloor) continue;
                            if (floor > endFloor) {
                                isStop = true;
                                break;
                            }
                            replierList[floor] = floorMatches[2];
                        }
                    },
                    error() {
                        isStop = true;
                        alert('因连接超时，统计回帖名单操作中止');
                    },
                    complete() {
                        let $countdown = $('.pd_countdown:last');
                        $countdown.text(parseInt($countdown.text()) - 1);
                        isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                        if (isStop) $(document).clearQueue('StatRepliers');

                        if (isStop || index === endPage - 1) {
                            Msg.destroy();
                            showStatRepliersDialog(replierList);
                        } else {
                            setTimeout(() => $(document).dequeue('StatRepliers'), _Const2.default.defAjaxInterval);
                        }
                    }
                });
            });
        });
        $(document).dequeue('StatRepliers');
    });
};

/**
 * 获取多重引用数据
 * @returns {Object[]} 多重引用数据列表
 */
const getMultiQuoteData = exports.getMultiQuoteData = function () {
    let quoteList = [];
    $('.pd_multi_quote_chk input:checked').each(function () {
        let $readLou = $(this).closest('.readlou');
        let matches = /(\d+)楼/.exec($readLou.find('.pd_goto_link').text());
        let floor = matches ? parseInt(matches[1]) : 0;
        let pid = $readLou.prev('a').attr('name');
        let userName = $readLou.next('.readtext').find('.readidmsbottom > a, .readidmleft > a').text();
        if (!userName) return;
        quoteList.push({ floor: floor, pid: pid, userName: userName });
    });
    return quoteList;
};

/**
 * 添加多重回复和多重引用的按钮
 */
const addMultiQuoteButton = exports.addMultiQuoteButton = function () {
    let replyUrl = $('a[href^="post.php?action=reply"].b_tit2').attr('href');
    if (!replyUrl) return;
    $('<li class="pd_multi_quote_chk"><label title="多重引用"><input type="checkbox"> 引</label></li>').prependTo($('.readlou > div:first-child > ul').has('a[title="引用回复这个帖子"]')).find('input').click(function () {
        let tid = parseInt(Util.getUrlParam('tid'));
        let data = localStorage[_Const2.default.multiQuoteStorageName];
        if (data) {
            try {
                data = JSON.parse(data);
                if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) data = null;else if (typeof data.tid === 'undefined' || data.tid !== tid || !Array.isArray(data.quoteList)) data = null;
            } catch (ex) {
                data = null;
            }
        } else {
            data = null;
        }
        let quoteList = getMultiQuoteData();
        if (!data) {
            localStorage.removeItem(_Const2.default.multiQuoteStorageName);
            data = { tid: tid, quoteList: [] };
        }
        let page = Util.getCurrentThreadPage();
        if (quoteList.length > 0) data.quoteList[page] = quoteList;else delete data.quoteList[page];
        localStorage[_Const2.default.multiQuoteStorageName] = JSON.stringify(data);
    });
    $('.readlou:last').next('div').find('table > tbody > tr > td:last-child').css({ 'text-align': 'right', 'width': '320px' }).append(`<span class="b_tit2" style="margin-left: 5px;"><a style="display: inline-block;" href="#" title="多重回复">回复</a> ` + `<a style="display: inline-block;" href="${ replyUrl }&multiquote=1" title="多重引用">引用</a></span>`).find('.b_tit2 > a:eq(0)').click(function (e) {
        e.preventDefault();
        Post.handleMultiQuote(1);
    });
};

/**
 * 将帖子和短消息中的绯月其它域名的链接修改为当前域名
 */
const modifyKFOtherDomainLink = exports.modifyKFOtherDomainLink = function () {
    $('.readtext a, .thread2 a').each(function () {
        let $this = $(this);
        let url = $this.attr('href');
        if (/m\.miaola\.info\//i.test(url)) return;
        let matches = /^(https?:\/\/(?:[\w\.]+?\.)?(?:2dgal|ddgal|9gal|9baka|9moe|kfgal|2dkf|miaola|kfer)\.\w+?\/).+/i.exec(url);
        if (matches) $this.attr('href', url.replace(matches[1], Util.getHostNameUrl()));
    });
};

/**
 * 处理购买帖子按钮
 */
const handleBuyThreadBtn = exports.handleBuyThreadBtn = function () {
    $('.readtext input[type="button"][value="愿意购买,支付KFB"]').each(function () {
        let $this = $(this);
        let matches = /此帖售价\s*(\d+)\s*KFB/i.exec($this.closest('legend').contents().eq(0).text());
        if (!matches) return;
        let sell = parseInt(matches[1]);
        matches = /location\.href="(.+?)"/i.exec($this.attr('onclick'));
        if (!matches) return;
        $this.data('sell', sell).data('url', matches[1]).removeAttr('onclick').click(function (e) {
            e.preventDefault();
            let $this = $(this);
            let sell = $this.data('sell');
            let url = $this.data('url');
            if (!sell || !url) return;
            if (sell >= _Const2.default.minBuyThreadWarningSell && !confirm(`此贴售价${ sell }KFB，是否购买？`)) return;
            if (Config.buyThreadViaAjaxEnabled) {
                let $wait = Msg.wait('正在购买帖子&hellip;');
                $.get(url, function (html) {
                    Public.showFormatLog('购买帖子', html);
                    let { msg } = Util.getResponseMsg(html);
                    Msg.remove($wait);
                    if (/操作完成/.test(msg)) {
                        location.reload();
                    } else if (/您已经购买此帖/.test(msg)) {
                        alert('你已经购买过此帖');
                        location.reload();
                    } else {
                        alert('帖子购买失败');
                    }
                });
            } else location.href = url;
        });
    });
};

/**
 * 添加批量购买帖子的按钮
 */
const addBatchBuyThreadButton = exports.addBatchBuyThreadButton = function () {
    let $btns = $('.readtext input[type="button"][value="愿意购买,支付KFB"]');
    if ($btns.length === 0) return;
    $btns.each(function () {
        let $this = $(this);
        let sell = $this.data('sell');
        let url = $this.data('url');
        if (!sell || !url) return;
        $this.after(`<input class="pd_buy_thread" style="margin-left: 10px; vertical-align: middle;" type="checkbox" data-sell="${ sell }" data-url="${ url }">`);
    });
    $('<span style="margin: 0 5px;">|</span><a class="pd_buy_thread_btn" title="批量购买所选帖子" href="#">批量购买</a>').insertAfter('td > a[href^="kf_tidfavor.php?action=favor&tid="]').filter('a').click(function (e) {
        e.preventDefault();
        Msg.destroy();
        let threadList = [];
        let totalSell = 0;
        $('.pd_buy_thread:checked').each(function () {
            let $this = $(this);
            let url = $this.data('url');
            let sell = parseInt($this.data('sell'));
            if (url && !isNaN(sell)) {
                threadList.push({ url, sell });
                totalSell += sell;
            }
        });
        if (!threadList.length) {
            alert('请选择要购买的帖子');
            return;
        }
        if (confirm(`你共选择了${ threadList.length }个帖子，总售价${ totalSell.toLocaleString() }KFB，` + `均价${ Util.getFixedNumLocStr(totalSell / threadList.length, 2) }KFB，是否批量购买？`)) {
            Msg.wait(`<strong>正在购买帖子中&hellip;</strong><i>剩余：<em class="pd_countdown">${ threadList.length }</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
            buyThreads(threadList);
        }
    }).parent().mouseenter(function () {
        $('<span style="margin-left: 5px;">[<a class="pd_btn_link" href="#">全选</a><a class="pd_btn_link" href="#">反选</a>]</span>').insertAfter($(this).find('.pd_buy_thread_btn')).find('a:first').click(function (e) {
            e.preventDefault();
            let $buyThread = $('.pd_buy_thread');
            $buyThread.prop('checked', true);
            alert(`共选择了${ $buyThread.length }项`);
        }).next('a').click(function (e) {
            e.preventDefault();
            let totalNum = 0;
            $('.pd_buy_thread').each(function () {
                let $this = $(this);
                $this.prop('checked', !$this.prop('checked'));
                if ($this.prop('checked')) totalNum++;
            });
            alert(`共选择了${ totalNum }项`);
        });
    }).mouseleave(function () {
        $(this).find('.pd_buy_thread_btn').next('span').remove();
    });
};

/**
 * 购买指定的一系列帖子
 * @param {{}[]} threadList 购买帖子列表，{url}：购买帖子的URL；{sell}：购买帖子的售价
 */
const buyThreads = exports.buyThreads = function (threadList) {
    let successNum = 0,
        failNum = 0,
        totalSell = 0;
    $(document).clearQueue('BuyThreads');
    $.each(threadList, function (index, { url, sell }) {
        $(document).queue('BuyThreads', function () {
            $.ajax({
                type: 'GET',
                url: url + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success(html) {
                    Public.showFormatLog('购买帖子', html);
                    let { msg } = Util.getResponseMsg(html);
                    if (/操作完成/.test(msg)) {
                        successNum++;
                        totalSell += sell;
                    } else failNum++;
                },
                error() {
                    failNum++;
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('BuyThreads');

                    if (isStop || index === threadList.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) {
                            Log.push('购买帖子', `共有\`${ successNum }\`个帖子购买成功`, { pay: { 'KFB': -totalSell } });
                        }
                        console.log(`共有${ successNum }个帖子购买成功，共有${ failNum }个帖子购买失败，KFB-${ totalSell }`);
                        Msg.show(`<strong>共有<em>${ successNum }</em>个帖子购买成功${ failNum > 0 ? `，共有<em>${ failNum }</em>个帖子购买失败` : '' }</strong>` + `<i>KFB<ins>-${ totalSell }</ins></i>`, -1);
                        Func.run('Read.buyThreads_after_', threadList);
                    } else {
                        setTimeout(() => $(document).dequeue('BuyThreads'), _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('BuyThreads');
};

/**
 * 添加用户自定义备注
 */
const addUserMemo = exports.addUserMemo = function () {
    if ($.isEmptyObject(Config.userMemoList)) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        let memo = '';
        for (let name of Object.keys(Config.userMemoList)) {
            if (name === userName) {
                memo = Config.userMemoList[name];
                break;
            }
        }
        if (!memo) return;
        if ($this.is('.readidmleft > a')) {
            $this.after(`<span class="pd_user_memo_tips" title="备注：${ memo }">[?]</span>`);
        } else {
            let memoText = memo;
            let maxLength = 24;
            if (memo.length > maxLength) memoText = memoText.substring(0, maxLength) + '&hellip;';
            $this.after(`<br><span class="pd_user_memo" title="备注：${ memo }">(${ memoText })</span>`);
        }
    });
};

/**
 * 添加复制代码的链接
 */
const addCopyCodeLink = exports.addCopyCodeLink = function () {
    $('.readtext fieldset > legend:contains("Copy code")').html('<a class="pd_copy_code" href="#">复制代码</a>').parent('fieldset').addClass('pd_code_area');
    if (!$('.pd_copy_code').length) return;
    $('#alldiv').on('click', 'a.pd_copy_code', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $fieldset = $this.closest('fieldset');
        if (Util.copyText($fieldset, '代码已复制', $this.parent())) return;

        let content = $fieldset.data('content');
        if (content) {
            $fieldset.html('<legend><a class="pd_copy_code" href="#">复制代码</a></legend>' + content).removeData('content');
        } else {
            let html = $fieldset.html();
            html = html.replace(/<legend>.+?<\/legend>/i, '');
            $fieldset.data('content', html);
            html = Util.htmlDecode(html);
            let height = $fieldset.height();
            height -= 17;
            if (height < 50) height = 50;
            if (height > 540) height = 540;
            $fieldset.html(`
<legend><a class="pd_copy_code" href="#">还原代码</a></legend>
<textarea wrap="off" class="pd_textarea" style="width: 100%; height: ${ height }px; line-height: 1.4em; white-space: pre;">${ html }</textarea>
`);
            $fieldset.find('textarea').select().focus();
        }
    });
};

/**
 * 在帖子页面添加更多表情的链接
 */
const addMoreSmileLink = exports.addMoreSmileLink = function () {
    /**
     * 添加表情代码
     * @param {string} id 表情ID
     */
    const addSmileCode = function (id) {
        let textArea = $('textarea[name="atc_content"]').get(0);
        if (!textArea) return;
        let code = `[s:${ id }]`;
        Util.addCode(textArea, code);
        if (_Info2.default.isMobile) textArea.blur();else textArea.focus();
    };

    let $parent = $('input[name="diy_guanjianci"]').parent();
    $parent.on('click', 'a[href="javascript:;"]', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        if (id) addSmileCode(id);
    }).find('a[onclick^="javascript:addsmile"]').each(function () {
        let $this = $(this);
        let matches = /addsmile\((\d+)\)/i.exec($this.attr('onclick'));
        if (matches) {
            $this.data('id', matches[1]).removeAttr('onclick').attr('href', 'javascript:;');
        }
    });

    $('<a class="pd_highlight" href="#">[更多]</a>').appendTo($parent).click(function (e) {
        e.preventDefault();
        let $this = $(this);
        let $panel = $('#pdSmilePanel');
        if ($panel.length > 0) {
            $this.text('[更多]');
            $panel.remove();
            return;
        }
        $this.text('[关闭]');

        let smileImageIdList = ['48', '35', '34', '33', '32', '31', '30', '29', '28', '27', '26', '36', '37', '47', '46', '45', '44', '43', '42', '41', '40', '39', '38', '25', '24', '11', '10', '09', '08', '01', '02', '03', '04', '05', '06', '12', '13', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '07'];
        let smileCodeIdList = [57, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 45, 46, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 34, 33, 20, 19, 18, 17, 10, 11, 12, 13, 14, 15, 21, 22, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 16];
        let html = '';
        for (let i = 0; i < smileImageIdList.length; i++) {
            html += `<img src="${ _Info2.default.w.imgpath }/post/smile/em/em${ smileImageIdList[i] }.gif" alt="[表情]" data-id="${ smileCodeIdList[i] }">`;
        }
        html = `<div class="pd_panel" id="pdSmilePanel" style="width: 308px; height: 185px;">${ html }</div>`;

        let offset = $parent.offset();
        $panel = $(html).appendTo('body');
        $panel.css('top', offset.top + $parent.height() + 4).css('left', offset.left + $parent.width() - $panel.width() + 9).on('click', 'img', function () {
            let id = $(this).data('id');
            if (id) addSmileCode(id);
        });
        Func.run('Read.addMoreSmileLink_after_click_');
    });
};

/**
 * 在帖子页面解析多媒体标签
 */
const parseMediaTag = exports.parseMediaTag = function () {
    $('.readtext > table > tbody > tr > td').each(function () {
        let $this = $(this);
        let html = $this.html();
        if (/\[(audio|video)\](http|ftp)[^<>]+\[\/(audio|video)\]/.test(html)) {
            $this.html(html.replace(/\[audio\]((?:http|ftp)[^<>]+?)\[\/audio\](?!<\/fieldset>)/g, '<audio src="$1" controls preload="none" style="margin: 3px 0;">[你的浏览器不支持audio标签]</audio>').replace(/\[video\]((?:http|ftp)[^<>]+?)\[\/video\](?!<\/fieldset>)/g, `<video src="$1" controls preload="none" style="max-width: ${ Config.adjustThreadContentWidthEnabled ? 627 : 820 }px; margin:3px 0;">` + `[你的浏览器不支持video标签]</video>`));
        }
    });
};

/**
 * 显示在购买框之外的附件图片
 */
const showAttachImageOutsideSellBox = exports.showAttachImageOutsideSellBox = function () {
    $('.readtext > table > tbody > tr > td').each(function () {
        let $this = $(this);
        let html = $this.html();
        if (/\[attachment=\d+\]/.test(html)) {
            let pid = $this.closest('.readtext').prev('.readlou').prev('a').attr('name');
            let tid = Util.getUrlParam('tid');
            $this.html(html.replace(/\[attachment=(\d+)\]/g, `<img src="job.php?action=download&pid=${ pid }&tid=${ tid }&aid=$1" alt="[附件图片]" style="max-width:550px" ` + `onclick="if(this.width>=550) window.open('job.php?action=download&pid=${ pid }&tid=${ tid }&aid=$1');">`));
        }
    });
};

/**
 * 在帖子页面添加自助评分链接
 */
const addSelfRatingLink = exports.addSelfRatingLink = function () {
    let fid = parseInt($('input[name="fid"]:first').val());
    if (!fid || !_Const2.default.selfRatingFidList.includes(fid)) return;
    let tid = parseInt($('input[name="tid"]:first').val());
    let safeId = Public.getSafeId();
    if (!safeId || !tid) return;
    if ($('.readtext:first fieldset legend:contains("本帖最近评分记录")').length > 0) return;
    $('a[href^="kf_tidfavor.php?action=favor"]').after(`<span style="margin: 0 5px;">|</span><a href="kf_fw_1wkfb.php?do=1&safeid=${ safeId }&ptid=${ tid }" title="仅限自助评分测试人员使用">自助评分</a>`);
};

/**
 * 获取帖子标题
 * @returns {string} 帖子标题
 */
const getThreadTitle = exports.getThreadTitle = function () {
    return $('form[name="delatc"] > div:first > table > tbody > tr > td > span').text().trim();
};

},{"./Const":6,"./Dialog":7,"./Func":8,"./Info":10,"./Log":12,"./Msg":15,"./Post":17,"./Public":18,"./Util":22}],20:[function(require,module,exports){
/* 自定义脚本模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleInstallScriptLink = exports.showDialog = exports.runCmd = exports.runCustomScript = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Config = require('./Config');

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Func = require('./Func');

var Func = _interopRequireWildcard(_Func);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

var _Index = require('./Index');

var Index = _interopRequireWildcard(_Index);

var _Read = require('./Read');

var Read = _interopRequireWildcard(_Read);

var _Post = require('./Post');

var Post = _interopRequireWildcard(_Post);

var _Other = require('./Other');

var Other = _interopRequireWildcard(_Other);

var _Bank = require('./Bank');

var Bank = _interopRequireWildcard(_Bank);

var _Card = require('./Card');

var Card = _interopRequireWildcard(_Card);

var _Item = require('./Item');

var Item = _interopRequireWildcard(_Item);

var _Loot = require('./Loot');

var Loot = _interopRequireWildcard(_Loot);

var _ConfigDialog = require('./ConfigDialog');

var ConfigDialog = _interopRequireWildcard(_ConfigDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 默认脚本名称
const defScriptName = '未命名脚本';
// 脚本meta信息的正则表达式
const metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;

/**
 * 执行自定义脚本
 * @param {string} type 脚本执行时机，start：在脚本开始时执行；end：在脚本结束时执行
 */
const runCustomScript = exports.runCustomScript = function (type = 'end') {
    for (let { enabled, trigger, content } of Config.customScriptList) {
        if (enabled && trigger === type && content) {
            runCmd(content);
        }
    }
};

/**
 * 运行命令
 * @param {string} cmd 命令
 * @param {boolean} isOutput 是否在控制台上显示结果
 * @returns {{result: boolean, response: string}} result：是否执行成功；response：执行结果
 */
const runCmd = exports.runCmd = function (cmd, isOutput = false) {
    let result = true;
    let response = '';
    try {
        response = eval(cmd);
        if (isOutput) console.log(response);
    } catch (ex) {
        result = false;
        response = ex;
        console.log(ex);
    }
    return { result, response: String(response) };
};

/**
 * 获取脚本meta信息
 * @param {string} content 脚本内容
 * @returns {{}} 脚本meta信息
 */
const getScriptMeta = function (content) {
    let meta = {
        name: defScriptName,
        version: '',
        trigger: 'end',
        homepage: '',
        author: ''
    };
    let matches = metaRegex.exec(content);
    if (!matches) return meta;
    let metaContent = matches[1];
    matches = /@name[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.name = matches[1];
    matches = /@version[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.version = matches[1];
    matches = /@trigger[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.trigger = matches[1].toLowerCase() === 'start' ? 'start' : 'end';
    matches = /@homepage[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.homepage = matches[1];
    matches = /@author[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.author = matches[1];
    return meta;
};

/**
 * 显示自定义脚本对话框
 * @param {?number} showIndex 要显示的脚本的序号（-1表示最后一个）
 */
const showDialog = exports.showDialog = function (showIndex = null) {
    const dialogName = 'pdCustomScriptDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px;">
    <a class="pd_highlight pd_btn_link" data-name="addNewScript" href="#">添加新脚本</a>
    <a class="pd_btn_link" data-name="insertSample" href="#">插入范例</a>
  </div>
  <div data-name="customScriptList"></div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about">
    <a class="pd_btn_link" href="read.php?tid=500968" target="_blank">自定义脚本收集贴</a>
    <a class="pd_btn_link" data-name="openImOrExCustomScriptDialog" href="#">导入/导出自定义脚本</a>
  </span>
  <button name="ok">确定</button> <button name="cancel">取消</button> <button class="pd_highlight" name="clear">清空</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义脚本', html, 'min-width: 776px;');
    let $customScriptList = $dialog.find('[data-name="customScriptList"]');

    $dialog.find('[name="ok"]').click(function (e) {
        e.preventDefault();
        Config.customScriptList = [];
        $customScriptList.find('.pd_custom_script_content').each(function () {
            let $this = $(this);
            let content = $this.val();
            if (!$.trim(content)) return;
            let enabled = $this.prev().find('[type="checkbox"]').prop('checked');
            Config.customScriptList.push($.extend(getScriptMeta(content), { enabled, content }));
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    }).end().find('[name="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清空所有脚本？')) {
            $customScriptList.html('');
            Dialog.show(dialogName);
        }
    }).end().find('[name="cancel"]').click(() => Dialog.close(dialogName));

    /**
     * 添加自定义脚本
     * @param {boolean} enabled 是否启用脚本
     * @param {string} name 脚本名称
     * @param {string} version 版本号
     * @param {url} homepage 首页
     * @param {string} trigger 脚本执行时机
     * @param {string} content 脚本内容
     */
    const addCustomScript = function ({
        enabled = true,
        name = defScriptName,
        version = '',
        homepage = '',
        trigger = 'end',
        content = ''
    } = {}) {
        $customScriptList.append(`
<div class="pd_custom_script_header">
  <input type="checkbox" ${ enabled ? 'checked' : '' } title="是否启用此脚本">
  <a class="pd_custom_script_name" href="#" style="margin-left: 5px;">[${ name }]</a>
  <span data-name="version" style="margin-left: 5px; color: #666;" ${ !version ? 'hidden' : '' }>${ version }</span>
  <span data-name="trigger" style="margin-left: 5px; color: ${ trigger === 'start' ? '#f00' : '#00f' };" title="脚本执行时机">
    [${ trigger === 'start' ? '开始时' : '结束时' }]
  </span>
  <a data-name="homepage" href="${ homepage }" target="_blank" style="margin-left: 5px;" ${ !homepage ? 'hidden' : '' }>[主页]</a>
  <a data-name="delete" href="#" style="margin-left: 5px; color: #666;">[删除]</a>
</div>
<textarea class="pd_custom_script_content" wrap="off">${ content }</textarea>
`);
    };

    for (let data of Config.customScriptList) {
        addCustomScript(data);
    }

    $dialog.find('[data-name="addNewScript"]').click(function (e) {
        e.preventDefault();
        $customScriptList.find('.pd_custom_script_content').hide();
        addCustomScript();
        $customScriptList.find('.pd_custom_script_content:last').show().focus();
        Dialog.show(dialogName);
    }).end().find('[data-name="insertSample"]').click(function (e) {
        e.preventDefault();
        let $content = $customScriptList.find('.pd_custom_script_content:visible');
        $content.val(`
// ==UserScript==
// @name        ${ defScriptName }
// @version     1.0
// @author      ${ _Info2.default.userName }
// @trigger     end
// @homepage    read.php?tid=500968&spid=12318348
// @description 这是一个未命名脚本
// ==/UserScript==
`.trim() + '\n' + $content.val()).focus();
    }).end().find('[data-name="openImOrExCustomScriptDialog"]').click(function (e) {
        e.preventDefault();
        ConfigDialog.showCommonImportOrExportConfigDialog('customScript');
    });

    $customScriptList.on('click', '.pd_custom_script_name', function (e) {
        e.preventDefault();
        $dialog.find('.pd_custom_script_content').hide();
        $(this).parent().next().show().focus();
        Dialog.show(dialogName);
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        if (!confirm('是否删除此脚本？')) return;
        let $header = $(this).closest('.pd_custom_script_header');
        $header.next().remove();
        $header.remove();
        Dialog.show(dialogName);
    }).on('change', '.pd_custom_script_content', function () {
        let $this = $(this);
        let { name, version, homepage, trigger } = getScriptMeta($this.val());
        let $header = $this.prev();
        $header.find('.pd_custom_script_name').text(`[${ name ? name : defScriptName }]`);
        $header.find('[data-name="version"]').text(version).prop('hidden', !version);
        $header.find('[data-name="homepage"]').attr('href', homepage ? homepage : '').prop('hidden', !homepage);
        $header.find('[data-name="trigger"]').html(`[${ trigger === 'start' ? '开始时' : '结束时' }]`).css('color', trigger === 'start' ? '#f00' : '#00f');
    });

    Dialog.show(dialogName);
    if (typeof showIndex === 'number') {
        $customScriptList.find('.pd_custom_script_name').eq(showIndex).click();
    } else {
        $dialog.find('a:first').focus();
    }
};

/**
 * 处理安装自定义脚本按钮
 */
const handleInstallScriptLink = exports.handleInstallScriptLink = function () {
    $(document).on('click', 'a[href$="#install-script"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $area = $this.nextAll('.pd_code_area').eq(0);
        if (!$area.length) return;
        let content = Util.htmlDecode($area.html().replace(/<legend>.+?<\/legend>/i, '')).trim();
        if (!metaRegex.test(content)) return;
        (0, _Config.read)();
        let meta = getScriptMeta(content);
        let index = Config.customScriptList.findIndex(script => script.name === meta.name && script.author === meta.author);
        let type = index > -1 ? 1 : 0;
        if (!confirm(`是否${ type === 1 ? '更新' : '安装' }此脚本？`)) return;
        let script = $.extend(meta, { enabled: true, content });
        if (type === 1) Config.customScriptList[index] = script;else Config.customScriptList.push(script);
        (0, _Config.write)();
        Dialog.close('pdCustomScriptDialog');
        showDialog(index);
    });
};

},{"./Bank":2,"./Card":3,"./Config":4,"./ConfigDialog":5,"./Const":6,"./Dialog":7,"./Func":8,"./Index":9,"./Info":10,"./Item":11,"./Log":12,"./Loot":14,"./Msg":15,"./Other":16,"./Post":17,"./Public":18,"./Read":19,"./TmpLog":21,"./Util":22}],21:[function(require,module,exports){
/* 临时日志模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteValue = exports.setValue = exports.getValue = exports.clear = exports.write = exports.read = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 保存临时日志的键值名称
const name = _Const2.default.storagePrefix + 'tmp_log';

/**
 * 读取临时日志
 * @returns {{}} 临时日志对象
 */
const read = exports.read = function () {
    let log = {};
    let options = null;
    if (_Info2.default.storageType === 'ByUid' || _Info2.default.storageType === 'Global') options = GM_getValue(name + '_' + _Info2.default.uid);else options = localStorage.getItem(name + '_' + _Info2.default.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    let allowKeys = [];
    for (let k in _Const2.default) {
        if (k.endsWith('TmpLogName')) allowKeys.push(_Const2.default[k]);
    }
    for (let k of Object.keys(options)) {
        if (!allowKeys.includes(k)) delete options[k];
    }
    log = options;
    return log;
};

/**
 * 写入临时日志
 */
const write = exports.write = function (log) {
    if (_Info2.default.storageType === 'ByUid' || _Info2.default.storageType === 'Global') GM_setValue(name + '_' + _Info2.default.uid, JSON.stringify(log));else localStorage.setItem(name + '_' + _Info2.default.uid, JSON.stringify(log));
};

/**
 * 清除临时日志
 */
const clear = exports.clear = function () {
    if (_Info2.default.storageType === 'ByUid' || _Info2.default.storageType === 'Global') GM_deleteValue(name + '_' + _Info2.default.uid);else localStorage.removeItem(name + '_' + _Info2.default.uid);
};

/**
 * 获取指定名称的临时日志内容
 * @param {string} key 日志名称
 * @returns {*} 日志内容
 */
const getValue = exports.getValue = function (key) {
    let log = read();
    return key in log ? log[key] : null;
};

/**
 * 设置指定名称的临时日志内容
 * @param {string} key 日志名称
 * @param {*} value 日志内容
 */
const setValue = exports.setValue = function (key, value) {
    let log = read();
    log[key] = value;
    write(log);
};

/**
 * 删除指定名称的临时日志
 * @param {string} key 日志名称
 */
const deleteValue = exports.deleteValue = function (key) {
    let log = read();
    if (key in log) {
        delete log[key];
        write(log);
    }
};

},{"./Const":6,"./Info":10}],22:[function(require,module,exports){
/* 工具模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectInverse = exports.selectAll = exports.inFollowOrBlockUserList = exports.entries = exports.getResponseMsg = exports.copyText = exports.getSelText = exports.addCode = exports.getStrByteLen = exports.removeUnpairedBBCodeContent = exports.getFixedNumLocStr = exports.getCurrentThreadPage = exports.compareSmLevel = exports.isEdge = exports.isOpera = exports.getStatFormatNumber = exports.getSortedObjectKeyList = exports.getObjectKeyList = exports.htmlDecode = exports.htmlEncode = exports.getGBKEncodeString = exports.getUrlParam = exports.deepEqual = exports.getDifferenceSetOfObject = exports.getHostNameUrl = exports.isBetweenInTimeRange = exports.getTimeDiffInfo = exports.getTimeString = exports.getDateString = exports.getDate = exports.getMidnightHourDate = exports.getTimezoneDateByTime = exports.getDateByTime = exports.deleteCookie = exports.getCookie = exports.setCookie = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 设置Cookie
 * @param {string} name Cookie名称
 * @param {*} value Cookie值
 * @param {?Date} date Cookie有效期，留空则表示有效期为浏览器进程
 * @param {string} prefix Cookie名称前缀
 */
const setCookie = exports.setCookie = function (name, value, date = null, prefix = _Info2.default.uid + '_' + _Const2.default.storagePrefix) {
    document.cookie = `${ prefix }${ name }=${ encodeURI(value) }${ !date ? '' : ';expires=' + date.toUTCString() };path=/;`;
};

/**
 * 获取Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 * @returns {?string} Cookie值
 */
const getCookie = exports.getCookie = function (name, prefix = _Info2.default.uid + '_' + _Const2.default.storagePrefix) {
    let regex = new RegExp(`(^| )${ prefix }${ name }=([^;]*)(;|$)`);
    let matches = document.cookie.match(regex);
    if (!matches) return null;else return decodeURI(matches[2]);
};

/**
 * 删除Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 */
const deleteCookie = exports.deleteCookie = function (name, prefix = _Info2.default.uid + '_' + _Const2.default.storagePrefix) {
    document.cookie = `${ prefix }${ name }=;expires=${ getDate('-1d').toUTCString() };path=/;`;
};

/**
 * 返回当天指定时间的Date对象
 * @param {string} time 指定的时间（例：22:30:00）
 * @returns {Date} 指定时间的Date对象
 */
const getDateByTime = exports.getDateByTime = function (time) {
    let date = new Date();
    let [hour, minute, second] = time.split(':');
    if (typeof hour !== 'undefined') date.setHours(parseInt(hour));
    if (typeof minute !== 'undefined') date.setMinutes(parseInt(minute));
    if (typeof second !== 'undefined') date.setSeconds(parseInt(second));
    date.setMilliseconds(0);
    return date;
};

/**
 * 返回当天根据指定时区指定时间的Date对象
 * @param {string} time 指定的时间（例：22:30:00）
 * @param {number} timezoneOffset UTC时间与本地时间之间的时间差（例：东8区为-8）
 * @returns {Date} 指定时间的Date对象
 */
const getTimezoneDateByTime = exports.getTimezoneDateByTime = function (time, timezoneOffset = _Const2.default.forumTimezoneOffset) {
    let date = new Date();
    let [hour, minute, second] = time.split(':');
    if (typeof hour !== 'undefined') date.setUTCHours(parseInt(hour) + timezoneOffset);
    if (typeof minute !== 'undefined') date.setUTCMinutes(parseInt(minute));
    if (typeof second !== 'undefined') date.setUTCSeconds(parseInt(second));
    date.setUTCMilliseconds(0);
    let now = new Date();
    if (now.getDate() > date.getDate() || now.getMonth() > date.getMonth() || now.getFullYear() > date.getFullYear()) {
        date.setDate(date.getDate() + 1);
    }
    return date;
};

/**
 * 获取距今N天的零时整点的Date对象
 * @param {number} days 距今的天数
 * @returns {Date} 距今N天的零时整点的Date对象
 */
const getMidnightHourDate = exports.getMidnightHourDate = function (days) {
    let date = getDateByTime('00:00:00');
    date.setDate(date.getDate() + days);
    return date;
};

/**
 * 获取在当前时间的基础上的指定（相对）时间量的Date对象
 * @param {string} value 指定（相对）时间量，+或-：之后或之前（相对于当前时间）；无符号：绝对值；Y：完整年份；y：年；M：月；d：天；h：小时；m：分；s：秒；ms：毫秒
 * @returns {?Date} 指定（相对）时间量的Date对象
 * @example
 * getDate('+2y') 获取2年后的Date对象
 * getDate('+3M') 获取3个月后的Date对象
 * getDate('-4d') 获取4天前的Date对象
 * getDate('5h') 获取今天5点的Date对象（其它时间量与当前时间一致）
 * getDate('2015Y') 获取年份为2015年的Date对象
 */
const getDate = exports.getDate = function (value) {
    let date = new Date();
    let matches = /^(-|\+)?(\d+)([a-zA-Z]{1,2})$/.exec(value);
    if (!matches) return null;
    let flag = typeof matches[1] === 'undefined' ? 0 : matches[1] === '+' ? 1 : -1;
    let increment = flag === -1 ? -parseInt(matches[2]) : parseInt(matches[2]);
    let unit = matches[3];
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
};

/**
 * 获取指定Date对象的日期字符串
 * @param {?Date} [date] 指定Date对象，留空表示现在
 * @param {string} separator 分隔符
 * @returns {string} 日期字符串
 */
const getDateString = exports.getDateString = function (date, separator = '-') {
    date = date ? date : new Date();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    return date.getFullYear() + separator + month.padStart(2, '0') + separator + day.padStart(2, '0');
};

/**
 * 获取指定Date对象的时间字符串
 * @param {?Date} [date] 指定Date对象，留空表示现在
 * @param {string} separator 分隔符
 * @param {boolean} isShowSecond 是否显示秒钟
 * @returns {string} 时间字符串
 */
const getTimeString = exports.getTimeString = function (date = new Date(), separator = ':', isShowSecond = true) {
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    let second = date.getSeconds().toString();
    return hour.padStart(2, '0') + separator + minute.padStart(2, '0') + (isShowSecond ? separator : '') + (isShowSecond ? second.padStart(2, '0') : '');
};

/**
 * 获取指定时间戳距现在所剩余时间的描述
 * @param {number} timestamp 指定时间戳
 * @returns {{hours: number, minutes: number, seconds: number}} 剩余时间的描述，hours：剩余的小时数；minutes：剩余的分钟数；seconds：剩余的秒数
 */
const getTimeDiffInfo = exports.getTimeDiffInfo = function (timestamp) {
    let diff = timestamp - new Date().getTime();
    if (diff > 0) {
        diff = Math.floor(diff / 1000);
        let hours = Math.floor(diff / 60 / 60);
        if (hours >= 0) {
            let minutes = Math.floor((diff - hours * 60 * 60) / 60);
            if (minutes < 0) minutes = 0;
            let seconds = Math.floor(diff - hours * 60 * 60 - minutes * 60);
            if (seconds < 0) seconds = 0;
            return { hours, minutes, seconds };
        }
    }
    return { hours: 0, minutes: 0, seconds: 0 };
};

/**
 * 判断指定时间是否处于规定时间段内
 * @param {Date} time 指定时间
 * @param {string} range 规定时间段，例：'08:00:15-15:30:30'或'23:30-01:20'
 * @returns {?boolean} 是否处于规定时间段内，返回null表示规定时间段格式不正确
 */
const isBetweenInTimeRange = exports.isBetweenInTimeRange = function (time, range) {
    let [range1, range2] = range.split('-');
    if (typeof range2 === 'undefined') return null;
    let start = getDateByTime(range1);
    let end = getDateByTime(range2);
    if (end < start) {
        if (time > end) end.setDate(end.getDate() + 1);else start.setDate(start.getDate() - 1);
    }
    return time >= start && time <= end;
};

/**
 * 获取当前域名的URL
 * @returns {string} 当前域名的URL
 */
const getHostNameUrl = exports.getHostNameUrl = function () {
    return `${ location.protocol }//${ location.host }/`;
};

/**
 * 获取对象A在对象B中的相对补集
 * @param {Object} a 对象A
 * @param {Object} b 对象B
 * @returns {Object} 相对补集
 */
const getDifferenceSetOfObject = exports.getDifferenceSetOfObject = function (a, b) {
    let c = {};
    if ($.type(a) !== 'object' || $.type(b) !== 'object') return c;
    $.each(b, (key, data) => {
        if (key in a) {
            if (!deepEqual(a[key], data)) c[key] = data;
        }
    });
    return c;
};

/**
 * 深度比较两个对象是否相等
 * @param {*} a
 * @param {*} b
 * @returns {boolean} 是否相等
 */
const deepEqual = exports.deepEqual = function (a, b) {
    if (a === b) return true;
    if ($.type(a) !== $.type(b)) return false;
    if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
    if ($.isArray(a) && $.isArray(b) || $.type(a) === 'object' && $.type(b) === 'object') {
        if (a.length !== b.length) return false;
        for (let i in $.extend($.isArray(a) ? [] : {}, a, b)) {
            if (typeof a[i] === 'undefined' || typeof b[i] === 'undefined') return false;
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    return false;
};

/**
 * 获取URL中的指定参数
 * @param {string} name 参数名称
 * @returns {?string} URL中的指定参数
 */
const getUrlParam = exports.getUrlParam = function (name) {
    let regex = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let matches = location.search.substring(1).match(regex);
    if (matches) return decodeURI(matches[2]);else return null;
};

/**
 * 获取经过GBK编码后的字符串
 * @param {string} str 待编码的字符串
 * @returns {string} 经过GBK编码后的字符串
 */
const getGBKEncodeString = exports.getGBKEncodeString = function (str) {
    let img = $('<img>').appendTo('body').get(0);
    img.src = 'nothing?sp=' + str;
    let encodeStr = img.src.split('nothing?sp=').pop();
    $(img).remove();
    return encodeStr;
};

/**
 * HTML转义编码
 * @param {string} str 待编码的字符串
 * @returns {string} 编码后的字符串
 */
const htmlEncode = exports.htmlEncode = function (str) {
    if (!str.length) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\'/g, '&#39;').replace(/\"/g, '&quot;').replace(/\n/g, '<br>');
};

/**
 * HTML转义解码
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
const htmlDecode = exports.htmlDecode = function (str) {
    if (!str.length) return '';
    return str.replace(/<br\s*\/?>/gi, '\n').replace(/&quot;/gi, '\"').replace(/&#39;/gi, '\'').replace(/&nbsp;/gi, ' ').replace(/&gt;/gi, '>').replace(/&lt;/gi, '<').replace(/&amp;/gi, '&');
};

/**
 * 获取指定对象的关键字列表
 * @param {Object} obj 指定对象
 * @param {number} sortBy 是否排序，0：不排序；1：升序；-1：降序
 * @returns {string[]} 关键字列表
 */
const getObjectKeyList = exports.getObjectKeyList = function (obj, sortBy = 0) {
    let list = [];
    if ($.type(obj) !== 'object') return list;
    for (let key in obj) {
        list.push(key);
    }
    if (sortBy !== 0) {
        list.sort((a, b) => sortBy > 0 ? a > b : a < b);
    }
    return list;
};

/**
 * 获取经过排序的指定对象的关键字列表
 * @param {string[]} sortKeyList 用于排序的关键字列表
 * @param {Object} obj 指定对象
 * @param {number} sortBy 是否排序，0：不排序；1：升序；-1：降序
 * @returns {string[]} 关键字列表
 */
const getSortedObjectKeyList = exports.getSortedObjectKeyList = function (sortKeyList, obj, sortBy = 0) {
    let list = getObjectKeyList(obj, sortBy);
    list.sort((a, b) => sortKeyList.indexOf(a) > sortKeyList.indexOf(b));
    return list;
};

/**
 * 获取经过格式化的统计数字字符串
 * @param {number} num 待处理的数字
 * @returns {string} 经过格式化的数字字符串
 */
const getStatFormatNumber = exports.getStatFormatNumber = num => num >= 0 ? `<em>+${ num.toLocaleString() }</em>` : `<ins>${ num.toLocaleString() }</ins>`;

/**
 * 检测浏览器是否为Opera
 * @returns {boolean} 是否为Opera
 */
const isOpera = exports.isOpera = () => typeof window.opera !== 'undefined';

/**
 * 检测浏览器是否为Edge
 * @returns {boolean} 是否为Edge
 */
const isEdge = exports.isEdge = () => navigator.appVersion && navigator.appVersion.indexOf('Edge') > 0;

/**
 * 比较神秘等级高低
 * @param {string} a
 * @param {string} b
 * @returns {number} 比较结果，-1：a小于b；0：a等于b；1：a大于b
 */
const compareSmLevel = exports.compareSmLevel = function (a, b) {
    let x = a.toUpperCase() === 'MAX' ? Number.MAX_VALUE : parseInt(a);
    let y = b.toUpperCase() === 'MAX' ? Number.MAX_VALUE : parseInt(b);
    if (x > y) return 1;else if (x < y) return -1;else return 0;
};

/**
 * 获取帖子当前所在的页数
 * @returns {number} 帖子当前所在的页数
 */
const getCurrentThreadPage = exports.getCurrentThreadPage = function () {
    let matches = /- (\d+) -/.exec($('.pages:first > li > a[href="javascript:;"]').text());
    return matches ? parseInt(matches[1]) : 1;
};

/**
 * 获取指定小数位的本地字符串
 * @param {number} num 数字
 * @param {number} digit 指定小数位
 * @returns {string} 指定小数位的本地字符串
 */
const getFixedNumLocStr = exports.getFixedNumLocStr = function (num, digit = 0) {
    let [iNum, dNum] = num.toFixed(digit).split('.');
    let iStr = parseInt(iNum).toLocaleString();
    let dStr = '';
    if (typeof dNum !== 'undefined') dStr = '.' + dNum;
    return iStr + dStr;
};

/**
 * 去除不配对的BBCode
 * @param {string} content 引用内容
 * @returns {string} 去除了不配对BBCode的内容
 */
const removeUnpairedBBCodeContent = exports.removeUnpairedBBCodeContent = function (content) {
    let startCodeList = [/\[color=.+?\]/g, /\[backcolor=.+?\]/g, /\[size=.+?\]/g, /\[font=.+?\]/g, /\[align=.+?\]/g, /\[b\]/g, /\[i\]/g, /\[u\]/g, /\[strike\]/g, /\[sup\]/g, /\[sub\]/g];
    let endCodeList = [/\[\/color\]/g, /\[\/backcolor\]/g, /\[\/size\]/g, /\[\/font\]/g, /\[\/align\]/g, /\[\/b\]/g, /\[\/i\]/g, /\[\/u\]/g, /\[\/strike\]/g, /\[\/sup\]/g, /\[\/sub\]/g];
    for (let i = 0; i < startCodeList.length; i++) {
        let startMatches = content.match(startCodeList[i]);
        let endMatches = content.match(endCodeList[i]);
        let startMatchesNum = startMatches ? startMatches.length : 0;
        let endMatchesNum = endMatches ? endMatches.length : 0;
        if (startMatchesNum !== endMatchesNum) {
            content = content.replace(startCodeList[i], '').replace(endCodeList[i], '');
        }
    }
    return content;
};

/**
 * 获取指定字符串的字节长度（1个GBK字符按2个字节来算）
 * @param {string} str 指定字符串
 * @returns {number} 字符串的长度
 */
const getStrByteLen = exports.getStrByteLen = function (str) {
    let len = 0;
    let cLen = 2;
    for (let i = 0; i < str.length; i++) {
        len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? cLen : 1;
    }
    return len;
};

/**
 * 添加BBCode
 * @param textArea 文本框
 * @param {string} code BBCode
 * @param {string} selText 选择文本
 */
const addCode = exports.addCode = function (textArea, code, selText = '') {
    let startPos = !selText ? code.indexOf(']') + 1 : code.indexOf(selText);
    if (typeof textArea.selectionStart !== 'undefined') {
        let prePos = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
        textArea.selectionStart = prePos + startPos;
        textArea.selectionEnd = prePos + startPos + selText.length;
    } else {
        textArea.value += code;
    }
};

/**
 * 获取选择文本
 * @param textArea 文本框
 * @returns {string} 选择文本
 */
const getSelText = exports.getSelText = function (textArea) {
    return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
};

/**
 * 复制文本
 * @param {jQuery} $target 要复制文本的目标元素
 * @param {string} msg 复制成功的消息
 * @param {jQuery} $excludeElem 要排除复制的元素
 * @returns {boolean} 是否复制成功
 */
const copyText = exports.copyText = function ($target, msg = '', $excludeElem = null) {
    if (!('execCommand' in document) || !$target.length) return false;
    let copyText = $target.data('copy-text');
    if (copyText) {
        $target = $(`<span class="text-hide">${ copyText }</span>`).insertAfter($target);
    }
    if ($excludeElem) $excludeElem.prop('hidden', true);
    let s = window.getSelection();
    s.selectAllChildren($target.get(0));
    let result = document.execCommand('copy');
    s.removeAllRanges();
    if (copyText) $target.remove();
    if ($excludeElem) $excludeElem.removeProp('hidden');
    if (result) {
        alert(msg ? msg : '已复制');
    }
    return result;
};

/**
 * 获取服务器返回的消息
 * @param {string} html HTML代码
 * @returns {{type: number, msg: string, url: string}} 服务器返回的消息对象
 */
const getResponseMsg = exports.getResponseMsg = function (html) {
    let type = 0;
    let msg = '',
        url = '';
    let matches = /<span style=".+?">(.+?)<\/span><br\s*\/?><a href="(.+?)">/i.exec(html);
    if (matches) {
        type = 1;
        msg = matches[1];
        url = matches[2];
    } else {
        let matches = /操作提示<br\s*\/?>\r\n(.+?)<br\s*\/?>\r\n<a href="javascript:history\.go\(-1\);">返回上一步操作<\/a>/i.exec(html);
        if (matches) {
            type = -1;
            msg = matches[1];
        }
    }
    return { type, msg: msg ? msg : '未能获得预期的回应', url };
};

/**
 * 返回指定对象由可枚举属性名和对应属性值组成的的键值对
 * @param {Object} obj 指定对象
 */
const entries = exports.entries = function* (obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
};

/**
 * 获取指定用户名在关注或屏蔽列表中的索引号
 * @param {string} name 指定用户名
 * @param {Array} list 指定列表
 * @returns {number} 指定用户在列表中的索引号，-1表示不在该列表中
 */
const inFollowOrBlockUserList = exports.inFollowOrBlockUserList = (name, list) => list.findIndex(data => data.name && data.name === name);

/**
 * 全选
 * @param {jQuery} $nodes 想要全选的节点的jQuery对象
 * @returns {boolean} 返回false
 */
const selectAll = exports.selectAll = function ($nodes) {
    $nodes.prop('checked', true);
    return false;
};

/**
 * 反选
 * @param {jQuery} $nodes 想要反选的节点的jQuery对象
 * @returns {boolean} 返回false
 */
const selectInverse = exports.selectInverse = function ($nodes) {
    $nodes.each(function () {
        let $this = $(this);
        $this.prop('checked', !$this.prop('checked'));
    });
    return false;
};

},{"./Const":6,"./Info":10}]},{},[1]);

// ==UserScript==
// @name        KF Online助手
// @namespace   https://greasyfork.org/users/4514
// @icon        https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KFOL必备！为绯月Galgame论坛增加了大量人性化、自动化的功能，更多功能开发中……
// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/Common.meta.js
// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es6/Common.user.js
// @include     http://*2dkf.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     11.9
// @grant       none
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// ==/UserScript==
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Info = require('./module/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Config = require('./module/Config');

var _Util = require('./module/Util');

var Util = _interopRequireWildcard(_Util);

var _Const = require('./module/Const');

var _Const2 = _interopRequireDefault(_Const);

var _Msg = require('./module/Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./module/Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Log = require('./module/Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./module/TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _LootLog = require('./module/LootLog');

var LootLog = _interopRequireWildcard(_LootLog);

var _Script = require('./module/Script');

var Script = _interopRequireWildcard(_Script);

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

var _SelfRate = require('./module/SelfRate');

var SelfRate = _interopRequireWildcard(_SelfRate);

var _ConfigDialog = require('./module/ConfigDialog');

var ConfigDialog = _interopRequireWildcard(_ConfigDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 版本号
const version = '11.9';

/**
 * 导出模块
 */
const exportModule = function () {
    try {
        _Info2.default.w.Info = require('./module/Info').default;
        _Info2.default.w.Util = require('./module/Util');
        _Info2.default.w.Const = require('./module/Const').default;
        _Info2.default.w.Msg = require('./module/Msg');
        _Info2.default.w.Dialog = require('./module/Dialog');
        _Info2.default.w.Log = require('./module/Log');
        _Info2.default.w.TmpLog = require('./module/TmpLog');
        _Info2.default.w.LootLog = require('./module/LootLog');
        _Info2.default.w.Public = require('./module/Public');
        _Info2.default.w.Index = require('./module/Index');
        _Info2.default.w.Read = require('./module/Read');
        _Info2.default.w.Post = require('./module/Post');
        _Info2.default.w.Other = require('./module/Other');
        _Info2.default.w.Bank = require('./module/Bank');
        _Info2.default.w.Card = require('./module/Card');
        _Info2.default.w.Item = require('./module/Item');
        _Info2.default.w.Loot = require('./module/Loot');
        _Info2.default.w.SelfRate = require('./module/SelfRate');
        _Info2.default.w.Script = require('./module/Script');
        const Conf = require('./module/Config');
        _Info2.default.w.readConfig = Conf.read;
        _Info2.default.w.writeConfig = Conf.write;
    } catch (ex) {
        console.log(ex);
    }
};

/**
 * 初始化
 */
const init = function () {
    let startDate = new Date();
    //console.log('【KF Online助手】启动');
    _Info2.default.version = version;
    if (!Public.getUidAndUserName()) return;
    Public.addPolyfill();
    exportModule();
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
    if (Config.addFastNavMenuEnabled) Public.addFastNavMenu();
    if (Config.modifySideBarEnabled) Public.modifySideBar();
    _Info2.default.$userMenu.find('a[href^="login.php?action=quit"]').click(() => confirm('是否退出账号？'));
    Public.changeNewRateTipsColor();

    if (_Info2.default.isInHomePage) {
        Index.handleIndexLink();
        Index.handleAtTips();
        Index.addSearchTypeSelectBox();
        if (Config.smLevelUpAlertEnabled) Index.smLevelUpAlert();
        if (Config.smRankChangeAlertEnabled) Index.smRankChangeAlert();
        if (Config.showVipSurplusTimeEnabled) Index.showVipSurplusTime();
        if (Config.homePageThreadFastGotoLinkEnabled) Index.addThreadFastGotoLink();
        if (Config.fixedDepositDueAlertEnabled && !Util.getCookie(_Const2.default.fixedDepositDueAlertCookieName)) Bank.fixedDepositDueAlert();
        if (parseInt(Util.getCookie(_Const2.default.lootCompleteCookieName)) === 2) {
            $('#pdLoot.indbox5').removeClass('indbox5').addClass('indbox6');
        }
        Index.addPromoteHaloInterval();
        if (Config.showChangePointsInfoEnabled) Index.addChangePointsInfoTips();
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
        Read.addStatAndBuyThreadBtn();
        Read.handleBuyThreadBtn();
        Read.addCopyBuyersListOption();
        if (Config.userMemoEnabled) Read.addUserMemo();
        Read.addCopyCodeLink();
        Read.addMoreSmileLink();
        Post.addRedundantKeywordWarning();
        if ($('a[href$="#install-script"]').length > 0) Script.handleInstallScriptLink();
        if (Config.preventCloseWindowWhenEditPostEnabled) Post.preventCloseWindowWhenEditPost();
        if (Config.autoSavePostContentWhenSubmitEnabled) Post.savePostContentWhenSubmit();
        if (Config.addSelfRateLinkEnabled) Read.addSelfRatingLink();
    } else if (location.pathname === '/thread.php') {
        if (Config.highlightNewPostEnabled) Other.highlightNewPost();
        if (Config.showFastGotoThreadPageEnabled) Other.addFastGotoThreadPageLink();
    } else if (location.pathname === '/post.php') {
        Post.addRedundantKeywordWarning();
        if (/\bmultiquote=1/i.test(location.href)) {
            if (Config.multiQuoteEnabled) Post.handleMultiQuote(2);
        } else if (/\baction=quote/i.test(location.href)) {
            Post.removeUnpairedBBCodeInQuoteContent();
        }
        Post.addExtraPostEditorButton();
        Post.addExtraOptionInPostPage();
        if (Config.preventCloseWindowWhenEditPostEnabled) Post.preventCloseWindowWhenEditPost();
        if (Config.autoSavePostContentWhenSubmitEnabled) Post.savePostContentWhenSubmit();
        if (_Info2.default.isInMiaolaDomain) Post.addAttachChangeAlert();
    } else if (location.pathname === '/kf_fw_ig_mybp.php') {
        Item.init();
    } else if (location.pathname === '/kf_fw_ig_shop.php') {
        Item.showMyInfoInItemShop();
    } else if (location.pathname === '/kf_fw_ig_pklist.php') {
        Loot.addUserLinkInPkListPage();
    } else if (location.pathname === '/kf_fw_ig_halo.php') {
        $('.kf_fw_ig1:first').on('click', 'a[href^="kf_fw_ig_halo.php?do=buy&id="]', () => {
            if (!confirm('是否提升战力光环？')) return false;
            TmpLog.deleteValue(_Const2.default.haloInfoTmpLogName);
        });
        Loot.addUserLinkInHaloPage();
    } else if (/\/hack\.php\?H_name=bank$/i.test(location.href)) {
        Bank.handleBankPage();
    } else if (/\/kf_fw_card_my\.php$/.test(location.href)) {
        Card.addStartBatchModeButton();
    } else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
        Other.addFastDrawMoneyLink();
        if (Config.modifyKfOtherDomainEnabled) Read.modifyKFOtherDomainLink();
    } else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
        Other.addMsgSelectButton();
    } else if (/\/profile\.php\?action=show/i.test(location.href)) {
        Other.handleProfilePage();
        Other.addFollowAndBlockAndMemoUserLink();
    } else if (/\/personal\.php\?action=post/i.test(location.href)) {
        if (Config.perPageFloorNum === 10) Other.modifyMyPostLink();
    } else if (location.pathname === '/kf_growup.php') {
        Other.addSmLevelFormula();
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
    } else if (location.pathname === '/kf_fw_1wkfb.php') {
        if (/\/kf_fw_1wkfb\.php\?ping=(2|4)/i.test(location.href)) {
            SelfRate.highlightRateErrorSize();
            if (/\/kf_fw_1wkfb\.php\?ping=2/i.test(location.href)) {
                SelfRate.refreshWaitCheckRatePage();
            }
        } else if (/\/kf_fw_1wkfb\.php\?do=1/i.test(location.href)) {
            SelfRate.addUnrecognizedSizeWarning();
            SelfRate.showErrorSizeSubmitWarning();
        }
        SelfRate.addLinksInGoodPostPage();
    } else if (location.pathname === '/kf_no1.php') {
        Other.addUserNameLinkInRankPage();
    }

    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (_Info2.default.isMobile) Public.bindElementTitleClick();
    if (_Info2.default.isInMiaolaDomain) {
        if (Config.kfSmileEnhanceExtensionEnabled && ['/read.php', '/post.php', '/message.php'].includes(location.pathname)) {
            Post.importKfSmileEnhanceExtension();
        }
    }

    let isAutoPromoteHaloStarted = false;
    if (Config.autoPromoteHaloEnabled && !Util.getCookie(_Const2.default.promoteHaloCookieName)) {
        isAutoPromoteHaloStarted = true;
        Loot.getPromoteHaloInfo(location.pathname === '/kf_fw_ig_index.php');
    }
    if (location.pathname === '/kf_fw_ig_index.php' && !isAutoPromoteHaloStarted) Loot.init();

    let isAutoLootStarted = false;
    if (location.pathname !== '/kf_fw_ig_index.php' && !Util.getCookie(_Const2.default.lootCompleteCookieName)) {
        if (Config.autoLootEnabled) {
            if (!Util.getCookie(_Const2.default.lootAttackingCookieName) && !$.isNumeric(Util.getCookie(_Const2.default.changePointsInfoCookieName)) && !isAutoPromoteHaloStarted) {
                isAutoLootStarted = true;
                Loot.checkLoot();
            }
        } else if (Config.autoSaveLootLogInSpecialCaseEnabled) {
            Loot.autoSaveLootLog();
        }
    }

    if (Config.autoGetDailyBonusEnabled && !Util.getCookie(_Const2.default.getDailyBonusCookieName)) {
        if (!Config.getBonusAfterLootCompleteEnabled || !isAutoLootStarted) Public.getDailyBonus();
    }

    if ((_Info2.default.isInHomePage || location.pathname === '/kf_fw_ig_index.php') && Config.autoBuyItemEnabled && !Util.getCookie(_Const2.default.buyItemCookieName) && !isAutoLootStarted) {
        let safeId = Public.getSafeId();
        if (safeId) Item.buyItems(Config.buyItemIdList, safeId);
    }

    if (Config.autoSaveCurrentDepositEnabled && _Info2.default.isInHomePage) Public.autoSaveCurrentDeposit();

    if (Config.autoChangeIdColorEnabled && !Util.getCookie(_Const2.default.autoChangeIdColorCookieName)) Public.changeIdColor();

    if (Config.timingModeEnabled && (_Info2.default.isInHomePage || location.pathname === '/kf_fw_ig_index.php')) Public.startTimingMode();

    if (Config.customScriptEnabled) Script.runCustomScript('end');

    let endDate = new Date();
    console.log(`【KF Online助手】初始化耗时：${endDate - startDate}ms`);
};

if (typeof jQuery !== 'undefined') $(document).ready(init);

},{"./module/Bank":2,"./module/Card":3,"./module/Config":4,"./module/ConfigDialog":5,"./module/Const":6,"./module/Dialog":7,"./module/Index":8,"./module/Info":9,"./module/Item":10,"./module/Log":11,"./module/Loot":13,"./module/LootLog":14,"./module/Msg":15,"./module/Other":16,"./module/Post":17,"./module/Public":18,"./module/Read":19,"./module/Script":20,"./module/SelfRate":21,"./module/TmpLog":22,"./module/Util":23}],2:[function(require,module,exports){
/* 银行模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fixedDepositDueAlert = exports.drawCurrentDeposit = exports.handleBankPage = undefined;

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
 * 对银行页面元素进行处理
 */
const handleBankPage = exports.handleBankPage = function () {
    let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
    if (!$account.length) return;
    let html = $account.html();
    $account.html(html.replace(/当前所持：(-?\d+)KFB/, (m, kfb) => `当前所持：<b id="pdCash" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB`).replace(/活期存款：(-?\d+)KFB/, (m, kfb) => `活期存款：<b id="pdCurrentDeposit" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB`).replace(/定期存款：(-?\d+)KFB/, (m, kfb) => `定期存款：<b id="pdFixedDeposit" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB`).replace(/可获利息：(-?\d+)/, (m, kfb) => `可获利息：<b id="pdInterest" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB `).replace(/定期利息：([\d\.]+)%/, '定期利息：<b id="pdInterestRate" data-num="$1">$1</b>%').replace(/(，才可以获得利息）)/, '$1 <span id="pdExpireTime" style="color: #393;"></span>').replace(/(，取出定期将获得该数额的KFB利息\))/, '$1 <span id="pdExpectedInterest" style="color: #393;"></span>'));
    $account.find('[data-num]').css('color', '#f60');

    let $interest = $('#pdInterest');
    let interest = parseInt($interest.data('num'));
    if (interest > 0) $interest.css('color', '#393');

    let fixedDeposit = parseInt($('#pdFixedDeposit').data('num'));
    if (fixedDeposit > 0 && interest === 0) {
        let time = parseInt(TmpLog.getValue(_Const2.default.fixedDepositDueTmpLogName));
        if (!isNaN(time) && time > $.now()) {
            $('#pdExpireTime').text(`(到期时间：${Util.getDateString(new Date(time))} ${Util.getTimeString(new Date(time), ':', false)})`);
        }

        let interestRate = parseFloat($('#pdInterestRate').data('num')) / 100;
        let anticipatedInterest = Math.round(fixedDeposit * interestRate * _Const2.default.fixedDepositDueTime);
        $('#pdExpectedInterest').text(`(预期利息：${anticipatedInterest.toLocaleString()} KFB)`);
    }

    $('form[name="form1"], form[name="form2"]').submit(function () {
        let $this = $(this);
        let money = 0;
        if ($this.is('[name="form2"]')) money = parseInt($this.find('input[name="drawmoney"]').val());else money = parseInt($this.find('input[name="savemoney"]').val());
        if (parseInt($this.find('input[name="btype"]:checked').val()) === 2 && money > 0) {
            TmpLog.setValue(_Const2.default.fixedDepositDueTmpLogName, Util.getDate(`+${_Const2.default.fixedDepositDueTime}d`).getTime());
        }
    });

    $('form[name="form3"]').submit(function () {
        let currentDeposit = parseInt($('#pdCurrentDeposit').data('num'));
        let fixedDeposit = parseInt($('#pdFixedDeposit').data('num'));
        let money = parseInt($('[name="to_money"]').val());
        if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
            if (!confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                $(this).find('[type="submit"]').prop('disabled', false);
                return false;
            }
        }
    });

    let $fee = $('a[href="hack.php?H_name=bank&action=log"]').parent();
    $fee.html($fee.html().replace(/\(手续费(\d+)%\)/, '(手续费<span id="pdFee" data-num="$1">$1</span>%)'));

    let $transferLimit = $('form[name="form3"] > span:first');
    $transferLimit.html($transferLimit.html().replace(/可转账额度：(\d+)/, (m, num) => `可转账额度：<b id="pdTransferLimit" data-num="${num}">${parseInt(num).toLocaleString()}</b>`).replace('额度通过发帖(每个主题帖200额度/回复帖10额度)和被评分（评分数x120%额度）获得', '额度可通过领取每日奖励获得'));
    addBatchTransferButton();

    $(document).on('change', '[name="savemoney"], [name="drawmoney"], [name="to_money"], [name="to_money"], [name="transfer_money"]', function () {
        let $this = $(this);
        let value = $.trim($this.val());
        if (value) $this.val(value.replace(/,/g, ''));
    });
};

/**
 * 给活期帐户存款
 * @param {number} money 存款金额（KFB）
 * @param {number} cash 现金（KFB）
 * @param {number} currentDeposit 现有活期存款（KFB）
 */
const saveCurrentDeposit = function (money, cash, currentDeposit) {
    let $wait = Msg.wait('<strong>正在存款中&hellip;</strong>');
    $.post('hack.php?H_name=bank', { action: 'save', btype: 1, savemoney: money }, function (html) {
        Public.showFormatLog('存款', html);
        let { msg } = Util.getResponseMsg(html);
        if (/完成存款/.test(msg)) {
            Msg.remove($wait);
            console.log(`共有${money}KFB存入活期存款`);
            $('#pdCash').text((cash - money).toLocaleString()).data('num', cash - money);
            $('#pdCurrentDeposit').text((currentDeposit + money).toLocaleString()).data('num', currentDeposit + money);
            setTimeout(function () {
                $(document).dequeue('Bank');
            }, _Const2.default.bankActionInterval);
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
    let $wait = Msg.wait('<strong>正在取款中&hellip;</strong>');
    $.post('hack.php?H_name=bank', { action: 'draw', btype: 1, drawmoney: money }, function (html) {
        Public.showFormatLog('取款', html);
        let { msg } = Util.getResponseMsg(html);
        Msg.remove($wait);
        if (/完成取款/.test(msg)) {
            console.log(`从活期存款中取出了${money}KFB`);
            Msg.show(`<strong>从活期存款中取出了<em>${money.toLocaleString()}</em>KFB</strong>`, -1);
        } else Msg.show(msg, -1);
    });
};

/**
 * 批量转账
 * @param {Array} users 用户列表
 * @param {string} msg 转帐附言
 * @param {boolean} isDeposited 是否已存款
 * @param {number} currentDeposit 现有活期存款
 * @param {number} transferLimit 现有转账额度
 */
const batchTransfer = function (users, msg, isDeposited, currentDeposit, transferLimit) {
    let successNum = 0,
        failNum = 0,
        successMoney = 0;
    $.each(users, function (index, [userName, money]) {
        $(document).queue('Bank', function () {
            $.ajax({
                type: 'POST',
                url: 'hack.php?H_name=bank',
                timeout: _Const2.default.defAjaxTimeout,
                data: `&action=virement&pwuser=${Util.getGBKEncodeString(userName)}&to_money=${money}&memo=${Util.getGBKEncodeString(msg)}`,
                success(html) {
                    Public.showFormatLog('批量转账', html);
                    let { msg } = Util.getResponseMsg(html);
                    let msgHtml = `${userName} <em>+${money.toLocaleString()}</em>`;
                    if (/完成转帐!/.test(msg)) {
                        successNum++;
                        successMoney += money;
                    } else {
                        failNum++;
                        if (/用户<b>.+?<\/b>不存在/.test(msg)) msg = '用户不存在';
                        msgHtml += ` <span class="pd_notice">(错误：${msg})</span>`;
                    }
                    $('.pd_result:last').append(`<li>${msgHtml}</li>`);
                },
                error() {
                    failNum++;
                    $('.pd_result:last').append(`
<li>
  ${userName}:${money.toLocaleString()}
  <span class="pd_notice">(错误：连接超时，转账可能失败，请到<a target="_blank" href="hack.php?H_name=bank&action=log">银行日志</a>里进行确认)</span>
</li>
`);
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('Bank');

                    if (isStop || index === users.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) Log.push('批量转账', `共有\`${successNum}\`名用户转账成功`, { pay: { 'KFB': -successMoney } });
                        $('#pdCurrentDeposit').text((currentDeposit - successMoney).toLocaleString()).data('num', currentDeposit - successMoney);
                        $('#pdTransferLimit').text((transferLimit - successMoney).toLocaleString()).data('num', transferLimit - successMoney);
                        console.log(`共有${successNum}名用户转账成功，共有${failNum}名用户转账失败，KFB-${successMoney}`);
                        $('.pd_result:last').append(`<li><b>共有<em>${successNum}</em>名用户转账成功` + `${failNum > 0 ? `，共有<em>${failNum}</em>名用户转账失败` : ''}：</b>KFB <ins>-${successMoney.toLocaleString()}</ins></li>`);
                        Msg.show(`<strong>共有<em>${successNum}</em>名用户转账成功` + `${failNum > 0 ? `，共有<em>${failNum}</em>名用户转账失败` : ''}</strong><i>KFB<ins>-${successMoney.toLocaleString()}</ins></i>`, -1);
                    } else {
                        setTimeout(() => $(document).dequeue('Bank'), _Const2.default.bankActionInterval);
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
        $bankUsers.select().focus();
        return false;
    }
    if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
        alert(`转帐金额不能小于${minTransferMoney}KFB`);
        $bankUsers.select().focus();
        return false;
    }
    let $bankMoney = $transfer.find('[name="transfer_money"]');
    let money = parseInt($bankMoney.val());
    if (/^\s*[^:]+\s*$/m.test(users)) {
        if (!$.isNumeric(money)) {
            alert('通用转账金额格式不正确');
            $bankMoney.select().focus();
            return false;
        } else if (money < minTransferMoney) {
            alert(`转帐金额不能小于${minTransferMoney}KFB`);
            $bankMoney.select().focus();
            return false;
        }
    }
    return true;
};

/**
 * 添加批量转账的按钮
 */
const addBatchTransferButton = function () {
    let $area = $(`
<tr id="pdBankTransferArea">
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
        <input class="pd_input" name="transfer_money" type="text" style="width: 217px;">
      </label><br>
      <label style="margin-top: 5px;">转帐附言（可留空）：<br>
        <textarea class="pd_textarea" name="msg" style="width: 225px; height: 206px;"></textarea>
      </label>
    </div>
    <div>
      <button type="submit">批量转账</button>
      <button type="reset">重置</button>
      <button name="random" type="button" title="为用户列表上的每个用户设定指定范围内的随机金额">随机金额</button>
      （活期存款不足时，将自动进行存款；批量转账金额不会从定期存款中扣除）
      ${Util.isIE() || Util.isEdge() ? '<br><span class="pd_highlight">注：IE和Edge浏览器在批量转账给中文名用户时会出现乱码，请使用其它浏览器进行批量转账</span>' : ''}
    </div>
  </form>
  </td>
</tr>
`).appendTo('.bank1 > tbody');

    $area.find('form').submit(function (e) {
        e.preventDefault();
        Msg.destroy();
        if (!batchTransferVerify($area)) return;
        let commonMoney = parseInt($area.find('[name="transfer_money"]').val());
        if (!commonMoney) commonMoney = 0;
        let msg = $area.find('[name="msg"]').val();
        let users = [];
        for (let line of $area.find('[name="users"]').val().split('\n')) {
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

        let fee = parseInt($('#pdFee').data('num'));
        if (isNaN(fee)) fee = 0;
        let totalMoney = 0;
        for (let [, money] of users) {
            totalMoney += money;
        }
        totalMoney = Math.floor(totalMoney * (1 + fee));
        if (!confirm(`共计 ${users.length} 名用户，总额 ${totalMoney.toLocaleString()} KFB，是否转账？`)) return;

        let $wait = Msg.wait('<strong>正在获取银行账户信息中&hellip;</strong>');
        $.get('hack.php?H_name=bank&t=' + $.now(), function (html) {
            Msg.remove($wait);
            let cash = 0,
                currentDeposit = 0,
                transferLimit = 0;
            let matches = /当前所持：(-?\d+)KFB/.exec(html);
            if (!matches) return;
            cash = parseInt(matches[1]);
            matches = /活期存款：(-?\d+)KFB/.exec(html);
            if (!matches) return;
            currentDeposit = parseInt(matches[1]);
            matches = /可转账额度：(\d+)/.exec(html);
            if (!matches) return;
            transferLimit = parseInt(matches[1]);
            if (totalMoney > cash + currentDeposit) {
                alert('资金不足');
                return;
            }
            if (totalMoney > transferLimit) {
                alert('转账额度不足');
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
            Msg.wait(`<strong>正在批量转账中，请耐心等待&hellip;</strong><i>剩余：<em class="pd_countdown">${users.length}</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
            $area.find('> td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
            batchTransfer(users, msg, isDeposited, currentDeposit, transferLimit);
        });
    }).find('[name="random"]').click(function () {
        let userList = [];
        for (let line of $area.find('[name="users"]').val().split('\n')) {
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
        $area.find('[name="users"]').val(content);
    });
};

/**
 * 定期存款到期提醒
 */
const fixedDepositDueAlert = exports.fixedDepositDueAlert = function () {
    console.log('定期存款到期提醒Start');
    $.get('hack.php?H_name=bank&t=' + $.now(), function (html) {
        Util.setCookie(_Const2.default.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(1));
        let matches = /可获利息：(\d+)/.exec(html);
        if (!matches) return;
        let interest = parseInt(matches[1]);
        if (interest > 0) {
            Util.setCookie(_Const2.default.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(7));
            if (confirm(`您的定期存款已到期，共产生利息 ${interest.toLocaleString()} KFB，是否前往银行取款？`)) {
                location.href = 'hack.php?H_name=bank';
            }
        }
    });
};

},{"./Const":6,"./Log":11,"./Msg":15,"./Public":18,"./TmpLog":22,"./Util":23}],3:[function(require,module,exports){
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
                url: `kf_fw_card_doit.php?do=recard&id=${cardId}&safeid=${safeId}&t=${$.now()}`,
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
                            Log.push('将卡片转换为VIP时间', `共有\`${successNum}\`张卡片成功为VIP时间`, {
                                gain: { 'VIP小时': totalVipTime, '能量': totalEnergy },
                                pay: { '卡片': -successNum }
                            });
                        }
                        Msg.destroy();
                        console.log(`共有${successNum}张卡片转换成功，共有${failNum}张卡片转换失败，VIP小时+${totalVipTime}，能量+${totalEnergy}`);
                        Msg.show(`<strong>共有<em>${successNum}</em>张卡片转换成功${failNum > 0 ? `，共有<em>${failNum}</em>张卡片转换失败` : ''}</strong>` + `<i>VIP小时<em>+${totalVipTime}</em></i><i>能量<em>+${totalEnergy}</em></i>`, -1);
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
                    $(this).css('position', 'relative').append(`<input class="pd_card_chk" type="checkbox" value="${matches[1]}">`);
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
                    $cardLines.find('td').has(`a[href="kf_fw_card_my.php?id=${id}"]`).find('[type="checkbox"]').prop('checked', false);
                }
            };

            let $btns = $(`
<label><input name="uncheckPlayedCard" type="checkbox" checked> 不选已出战的卡片</label>
<button name="selectOnlyOne" type="button">每类只保留一张</button>
<button name="selectAll" type="button">全选</button>
<button name="selectInverse" type="button">反选</button><br>
<button name="convertCardsToVipTime" type="button">转换为VIP时间</button>
`).insertBefore($this);
            $btns.filter('[name="selectOnlyOne"]').click(function () {
                Util.selectAll($cardLines.find('[type="checkbox"]'));
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
                let cardTypeList = new Set();
                $cardLines.find('a > img').each(function () {
                    cardTypeList.add($(this).attr('src'));
                });
                for (let src of cardTypeList) {
                    let $cardElems = $cardLines.find('td').has(`img[src="${src}"]`);
                    let totalNum = $cardElems.length;
                    let checkedNum = $cardElems.has('[type="checkbox"]:checked').length;
                    if (totalNum > 1) {
                        if (totalNum === checkedNum) {
                            $cardElems.eq(0).find('[type="checkbox"]:checked').prop('checked', false);
                        }
                    } else {
                        $cardElems.find('[type="checkbox"]:checked').prop('checked', false);
                    }
                }
            }).end().filter('[name="selectAll"]').click(function () {
                Util.selectAll($cardLines.find('[type="checkbox"]'));
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
            }).end().filter('[name="selectInverse"]').click(function () {
                Util.selectInverse($cardLines.find('[type="checkbox"]'));
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
            }).end().filter('[name="convertCardsToVipTime"]').click(function () {
                Msg.destroy();
                let cardList = [];
                $cardLines.find('[type="checkbox"]:checked').each(function () {
                    cardList.push(parseInt($(this).val()));
                });
                if (!cardList.length) return;
                if (!confirm(`共选择了${cardList.length}张卡片，是否将卡片批量转换为VIP时间？`)) return;
                Msg.wait(`<strong>正在批量转换中&hellip;</strong><i>剩余：<em class="pd_countdown">${cardList.length}</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
                convertCardsToVipTime(cardList, safeId);
            });
        } else {
            $this.text('开启批量模式');
            $cardLines.off('click').find('.pd_card_chk').remove();
            $this.prevAll().remove();
        }
    });
};

},{"./Const":6,"./Log":11,"./Msg":15,"./Public":18,"./Util":23}],4:[function(require,module,exports){
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

var _LootLog = require('./LootLog');

var LootLog = _interopRequireWildcard(_LootLog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 保存设置的键值名称
const name = _Const2.default.storagePrefix + 'config';

/**
 * 配置类
 */
const Config = exports.Config = {
    // 是否开启定时模式，可按时进行自动操作（包括自动领取每日奖励、自动提升战力光环、自动争夺，需开启相关功能），只在论坛首页生效（不开启此模式的话只能在刷新页面后才会进行操作），true：开启；false：关闭
    timingModeEnabled: false,
    // 在首页的网页标题上显示定时模式提示的方案，auto：停留一分钟后显示；always：总是显示；never：不显示
    showTimingModeTipsType: 'auto',

    // 是否自动领取每日奖励，true：开启；false：关闭
    autoGetDailyBonusEnabled: false,
    // 是否在完成争夺奖励后才领取每日奖励，true：开启；false：关闭
    getBonusAfterLootCompleteEnabled: false,
    // 是否在完成发言奖励后才领取每日奖励，true：开启；false：关闭
    getBonusAfterSpeakCompleteEnabled: false,

    // 是否自动提升战力光环，true：开启；false：关闭
    autoPromoteHaloEnabled: false,
    // 自动提升战力光环的花费类型，1：花费100KFB；2：花费1000KFB；11：花费0.2贡献；12：花费2贡献
    promoteHaloCostType: 1,
    // 自动提升战力光环的间隔时间（小时），最低值：8
    promoteHaloInterval: 8,
    // 是否自动判断提升战力光环的间隔时间（在有剩余次数时尽可能使用），true：开启；false：关闭
    promoteHaloAutoIntervalEnabled: true,
    // 在操作后所剩余的KFB或贡献高于指定值时才自动提升战力光环，设为0表示不限制
    promoteHaloLimit: 0,

    // 是否自动争夺，true：开启；false：关闭
    autoLootEnabled: false,
    // 自动争夺的目标攻击层数（设为0表示攻击到被击败为止）
    attackTargetLevel: 0,
    // 是否在不使用助手争夺的情况下自动保存争夺记录（使用助手进行争夺的用户请勿开启此功能），true：开启；false：关闭
    autoSaveLootLogInSpecialCaseEnabled: false,
    // 在当天的指定时间之后检查争夺情况（本地时间），例：00:05:00
    checkLootAfterTime: '00:05:00',
    // 历史争夺记录保存天数
    lootLogSaveDays: 7,
    // 是否在首页显示改点剩余次数信息（冷却时则显示倒计时），true：开启；false：关闭
    showChangePointsInfoEnabled: false,
    // 争夺各层分配点数列表，例：{1:{"力量":1,"体质":2,"敏捷":3,"灵活":4,"智力":5,"意志":6}, 10:{"力量":6,"体质":5,"敏捷":4,"灵活":3,"智力":2,"意志":1}}
    levelPointList: {},
    // 关键层列表，用于“攻击到下一关键层前”按钮，例：[1,11,15,20]
    keyLevelList: [],
    // 是否在攻击时自动修改为相应层数的点数分配方案（仅限自动攻击相关按钮有效），true：开启；false：关闭
    autoChangeLevelPointsEnabled: false,
    // 是否使用自定义点数分配脚本（在设置了相应的自定义脚本的情况下，仅限自动攻击相关按钮有效），true：开启；false：关闭
    customPointsScriptEnabled: false,
    // 是否在攻击时如有剩余属性点则进行提醒（仅限自动攻击相关按钮有效），true：开启；false：关闭
    unusedPointNumAlertEnabled: true,
    // 是否延长每次争夺攻击的时间间隔，true：开启；false：关闭
    slowAttackEnabled: false,
    // 是否总是打开个人属性/装备界面，true：开启；false：关闭
    alwaysOpenPointAreaEnabled: false,
    // 是否显示分层NPC统计，true：开启；false：关闭
    showLevelEnemyStatEnabled: false,
    // 是否显示精简争夺记录，true：开启；false：关闭
    showLiteLootLogEnabled: false,

    // 是否自动购买物品，true：开启；false：关闭
    autoBuyItemEnabled: false,
    // 购买物品ID列表，例：['101','103|102']
    buyItemIdList: [],
    // 在当天的指定时间之后购买物品（本地时间），例：00:40:00
    buyItemAfterTime: '00:40:00',

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
    // 帖子每页楼层数量，用于电梯直达和帖子页数快捷链接等功能，如果修改了论坛设置里的“文章列表每页个数”，请在此修改成相同的数目
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
    // 是否在楼层内的用户名旁显示该用户的自定义备注，true：开启；false：关闭
    userMemoEnabled: false,
    // 用户自定义备注列表，格式：{'用户名':'备注'}，例：{'李四':'张三的马甲','王五':'张三的另一个马甲'}
    userMemoList: {},
    // 是否在帖子页面解析多媒体标签，true：开启；false：关闭
    parseMediaTagEnabled: true,
    // 是否在帖子和搜索页面通过左右键进行翻页，true：开启；false：关闭
    turnPageViaKeyboardEnabled: false,
    // 是否在购买帖子时页面不跳转，true：开启；false：关闭
    buyThreadNoJumpEnabled: true,
    // 是否在撰写发帖内容时阻止关闭页面，true：开启；false：关闭
    preventCloseWindowWhenEditPostEnabled: true,
    // 是否在提交时自动保存发帖内容，以便在出现意外情况时能够恢复发帖内容，true：开启；false：关闭
    autoSavePostContentWhenSubmitEnabled: false,
    // 是否在发帖框上显示绯月表情增强插件（仅在miaola.info域名下生效），true：开启；false：关闭
    kfSmileEnhanceExtensionEnabled: false,
    // 在帖子页面添加自助评分链接（仅限评分人员使用），true：开启；false：关闭
    addSelfRateLinkEnabled: false,

    // 默认的消息显示时间（秒），设置为-1表示永久显示
    defShowMsgDuration: -1,
    // 是否禁用jQuery的动画效果（推荐在配置较差的机器上使用），true：开启；false：关闭
    animationEffectOffEnabled: false,
    // 在页面上方显示搜索对话框的链接，true：开启；false：关闭
    showSearchLinkEnabled: true,
    // 是否为顶部导航栏添加快捷导航菜单，true：开启；false：关闭
    addFastNavMenuEnabled: true,
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
    // 是否开启屏蔽标题中包含指定关键字的帖子的功能，true：开启；false：关闭
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

    // 是否延长部分批量操作的时间间隔（如使用道具、打开盒子等），true：开启；false：关闭
    slowActionEnabled: false,
    // 是否自动保存我的装备信息，true：开启；false：关闭
    autoSaveArmsInfoEnabled: false,
    // 是否分组排列装备，true：开启；false：关闭
    sortArmsByGroupEnabled: false,
    // 装备备注，格式：{装备ID:'备注信息'}，例：{123456:'备注信息'}
    armsMemo: {},
    // 是否在打开盒子后熔炼装备，true：开启；false：关闭
    smeltArmsAfterOpenBoxesEnabled: false,
    // 是否在打开盒子后使用道具，true：开启；false：关闭
    useItemsAfterOpenBoxesEnabled: false,
    // 是否在打开盒子后出售道具，true：开启；false：关闭
    sellItemsAfterOpenBoxesEnabled: false,
    // 默认的批量打开的盒子种类列表，例：['普通盒子', '幸运盒子', '稀有盒子']
    defOpenBoxTypeList: [],
    // 默认的批量熔炼的装备种类列表，例：['普通的长剑', '幸运的长剑', '普通的短弓']
    defSmeltArmTypeList: [],
    // 默认的批量使用的道具种类列表，例：['蕾米莉亚同人漫画', '整形优惠卷']
    defUseItemTypeList: [],
    // 默认的批量出售的道具种类列表，例：['蕾米莉亚同人漫画', '整形优惠卷']
    defSellItemTypeList: []
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
    let options = Util.readData(_Info2.default.storageType === 'ByUid' ? name + '_' + _Info2.default.uid : name);
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
    Util.writeData(_Info2.default.storageType === 'ByUid' ? name + '_' + _Info2.default.uid : name, JSON.stringify(options));
};

/**
 * 清空设置
 */
const clear = exports.clear = () => Util.deleteData(_Info2.default.storageType === 'ByUid' ? name + '_' + _Info2.default.uid : name);

/**
 * 更改存储类型
 * @param {string} storageType 要更改的存储类型
 */
const changeStorageType = exports.changeStorageType = function (storageType) {
    let log = Log.read();
    let tmpLog = TmpLog.read();
    let lootLog = LootLog.read();
    _Info2.default.storageType = storageType;
    if (typeof GM_setValue !== 'undefined') GM_setValue('StorageType', _Info2.default.storageType);
    if (!Util.deepEqual(Config, _Info2.default.w.Config) || !$.isEmptyObject(log)) {
        if (confirm('是否将助手设置和日志转移到对应存储类型中？（对应存储类型中的数据将被覆盖）')) {
            write();
            Log.write(log);
            TmpLog.write(tmpLog);
            LootLog.write(lootLog);
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
    for (let [key, value] of Util.entries(options)) {
        if (key in Config && $.type(value) === $.type(Config[key])) {
            settings[key] = value;
        }
    }
    if (typeof settings.lootLogSaveDays !== 'undefined' && settings.lootLogSaveDays > 20) settings.lootLogSaveDays = 20;
    return settings;
};

},{"./Const":6,"./Info":9,"./Log":11,"./LootLog":14,"./TmpLog":22,"./Util":23}],5:[function(require,module,exports){
/* 设置对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

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
    Script.runFunc('ConfigDialog.show_before_');
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
          <input name="timingModeEnabled" type="checkbox"> 定时模式
          <span class="pd_cfg_tips" title="可按时进行自动操作（包括自动领取每日奖励、自动提升战力光环、自动争夺、自动购买物品，需开启相关功能）
只在论坛首页和争夺首页生效（不开启此模式的话只能在刷新页面后才会进行操作）">[?]</span>
        </label>
      </legend>
      <label>
        标题提示方案
        <select name="showTimingModeTipsType">
          <option value="auto">停留一分钟后显示</option>
          <option value="always">总是显示</option>
          <option value="never">不显示</option>
        </select>
        <span class="pd_cfg_tips" title="在首页的网页标题上显示定时模式提示的方案">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label><input name="autoGetDailyBonusEnabled" type="checkbox"> 自动领取每日奖励</label>
      </legend>
      <label>
        <input name="getBonusAfterLootCompleteEnabled" type="checkbox"> 完成争夺后才领取
        <span class="pd_cfg_tips" title="在完成争夺奖励后才领取每日奖励">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="getBonusAfterSpeakCompleteEnabled" type="checkbox"> 完成发言后才领取
        <span class="pd_cfg_tips" title="在完成发言奖励后才领取每日奖励">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label><input name="autoPromoteHaloEnabled" type="checkbox"> 自动提升战力光环</label>
      </legend>
      <label>
        花费
        <select name="promoteHaloCostType" required>
          <option value="1">100KFB</option>
          <option value="2">1000KFB</option>
          <option value="11">0.2贡献</option>
          <option value="12">2贡献</option>
        </select>
        <span class="pd_cfg_tips" title="提升战力光环的花费类型">[?]</span>
      </label>
      <label class="pd_cfg_ml">
         高于 <input name="promoteHaloLimit" type="number" min="0" step="0.1" style="width: 55px;" required>
         <span data-id="promoteHaloLimitUnit">KFB</span>时
         <span class="pd_cfg_tips" title="在操作后所剩余的KFB或贡献高于指定值时才自动提升战力光环，设为0表示不限制">[?]</span>
      </label><br>
      <label>
        每隔 <input name="promoteHaloInterval" type="number" min="8" style="width: 40px;" required> 小时
        <span class="pd_cfg_tips" title="自动提升战力光环的间隔时间，最低值：8小时">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="promoteHaloAutoIntervalEnabled" type="checkbox" data-mutex="[name=promoteHaloInterval]"> 自动判断
        <span class="pd_cfg_tips" title="自动判断提升战力光环的间隔时间（在有剩余次数时尽可能使用）">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>争夺相关</legend>
      <label>
        <input name="autoLootEnabled" type="checkbox" data-mutex="[name=autoSaveLootLogInSpecialCaseEnabled]"> 自动争夺
        <span class="pd_cfg_tips" title="当发现可以进行争夺时，会跳转到争夺首页进行自动攻击（点数分配等相关功能请在争夺首页上设置）">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        攻击到第 <input name="attackTargetLevel" type="number" min="0" style="width: 40px;" required> 层
        <span class="pd_cfg_tips" title="自动争夺的目标攻击层数（设为0表示攻击到被击败为止）">[?]</span>
      </label><br>
      <label>
        <input name="autoSaveLootLogInSpecialCaseEnabled" type="checkbox"> 在不使用助手争夺的情况下自动保存争夺记录
        <span class="pd_cfg_tips" title="在不使用助手争夺的情况下自动检查并保存争夺记录（使用助手进行争夺的用户请勿勾选此选项）">[?]</span>
      </label><br>
      <label>
        在 <input name="checkLootAfterTime" type="text" maxlength="8" style="width: 55px;" required> 之后争夺
        <span class="pd_cfg_tips" title="在当天的指定时间之后检查争夺情况（本地时间），例：00:05:00">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        争夺记录保存天数 <input name="lootLogSaveDays" type="number" min="1" max="20" style="width: 40px;" required>
        <span class="pd_cfg_tips" title="默认值：${_Config.Config.lootLogSaveDays}，最大值：20">[?]</span>
      </label><br>
      <label>
        <input name="showChangePointsInfoEnabled" type="checkbox"> 在首页显示改点剩余次数
        <span class="pd_cfg_tips" title="在首页显示改点剩余次数，冷却时则显示倒计时">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label><input name="autoBuyItemEnabled" type="checkbox"> 自动购买物品</label>
      </legend>
      <label>
        物品ID列表 <input name="buyItemIdList" type="text" maxlength="50" style="width: 150px;">
      </label>
      <a class="pd_cfg_ml" data-name="openBuyItemTipsDialog" href="#">详细说明&raquo;</a><br>
      <label>
        在 <input name="buyItemAfterTime" type="text" maxlength="8" style="width: 55px;" required> 之后购买物品
        <span class="pd_cfg_tips" title="在当天的指定时间之后购买物品（本地时间），例：00:40:00（注：请不要设置为在此之前的时间）">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>首页相关</legend>
      <label>
        @提醒
        <select name="atTipsHandleType" style="width: 140px;">
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
      <legend>版块页面相关</legend>
      <label>
        <input name="showFastGotoThreadPageEnabled" type="checkbox" data-disabled="[name=maxFastGotoThreadPageNum]"> 显示帖子页数快捷链接
        <span class="pd_cfg_tips" title="在版块页面中显示帖子页数快捷链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        页数链接最大数量 <input name="maxFastGotoThreadPageNum" type="number" min="1" max="10" style="width: 40px;" required>
        <span class="pd_cfg_tips" title="在帖子页数快捷链接中显示页数链接的最大数量">[?]</span>
      </label><br>
      <label>
        <input name="highlightNewPostEnabled" type="checkbox"> 高亮今日的新帖
        <span class="pd_cfg_tips" title="在版块页面中高亮今日新发表帖子的发表时间">[?]</span>
      </label>
    </fieldset>
  </div>

  <div class="pd_cfg_panel">
    <fieldset>
      <legend>帖子页面相关</legend>
      <label>
        帖子每页楼层数量
        <select name="perPageFloorNum">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <span class="pd_cfg_tips" title="用于电梯直达和帖子页数快捷链接等功能，如果修改了论坛设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        帖子内容字体大小 <input name="threadContentFontSize" type="number" min="7" max="72" style="width: 40px;"> px
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
        <span class="pd_cfg_tips" title="在楼层内的用户名旁显示该用户的自定义备注，请点击详细设置自定义用户备注">[?]</span>
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
        <input name="buyThreadNoJumpEnabled" type="checkbox"> 购买帖子时不跳转
        <span class="pd_cfg_tips" title="使用Ajax的方式购买帖子，购买时页面不会跳转">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="kfSmileEnhanceExtensionEnabled" type="checkbox" ${_Info2.default.isInMiaolaDomain ? '' : 'disabled'}> 开启绯月表情增强插件
        <span class="pd_cfg_tips" title="在发帖框上显示绯月表情增强插件（仅在miaola.info域名下生效），该插件由eddie32开发">[?]</span>
      </label><br>
      <label>
        <input name="preventCloseWindowWhenEditPostEnabled" type="checkbox"> 写帖子时阻止关闭页面
        <span class="pd_cfg_tips" title="在撰写发帖内容时，如不小心关闭了页面会进行提示">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="autoSavePostContentWhenSubmitEnabled" type="checkbox"> 提交时保存发帖内容
        <span class="pd_cfg_tips" title="在提交时自动保存发帖内容，以便在出现意外情况时能够恢复发帖内容（需在不关闭当前标签页的情况下才能起效）">[?]</span>
      </label><br>
      <label>
        <input name="addSelfRateLinkEnabled" type="checkbox"> 添加自助评分链接
        <span class="pd_cfg_tips" title="在帖子页面添加自助评分链接（仅限评分人员使用）">[?]</span>
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
        消息显示时间 <input name="defShowMsgDuration" type="number" min="-1" style="width: 46px;" required> 秒
        <span class="pd_cfg_tips" title="默认的消息显示时间（秒），设置为-1表示永久显示，例：15">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        日志保存天数 <input name="logSaveDays" type="number" min="1" max="365" style="width: 46px;" required>
        <span class="pd_cfg_tips" title="默认值：${_Config.Config.logSaveDays}">[?]</span>
      </label><br>
      <label>
        <input name="showSearchLinkEnabled" type="checkbox"> 显示搜索链接
        <span class="pd_cfg_tips" title="在用户菜单上显示搜索对话框的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="animationEffectOffEnabled" type="checkbox"> 禁用动画效果
        <span class="pd_cfg_tips" title="禁用jQuery的动画效果（推荐在配置较差的机器上使用）">[?]</span>
      </label><br>
      <label>
        <input name="addFastNavMenuEnabled" type="checkbox"> 添加快捷导航菜单
        <span class="pd_cfg_tips" title="为顶部导航栏添加快捷导航菜单">[?]</span>
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
        <span class="pd_cfg_tips" title="开启屏蔽标题中包含指定关键字的帖子的功能，请点击详细设置管理屏蔽关键字">[?]</span>
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
        在当前收入已满 <input name="saveCurrentDepositAfterKfb" type="number" min="1" style="width: 80px;"> KFB之后
        <span class="pd_cfg_tips" title="在当前收入已满指定KFB额度之后自动进行活期存款，例：1000">[?]</span>
      </label><br>
      <label>
        将 <input name="saveCurrentDepositKfb" type="number" min="1" style="width: 80px;"> KFB存入活期存款
        <span class="pd_cfg_tips" title="将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800">[?]</span>
      </label>
    </fieldset>
  </div>
</div>

<div class="pd_cfg_btns">
  <span class="pd_cfg_about">
    <a target="_blank" href="read.php?tid=508450">By 喵拉布丁</a>
    <i style="color: #666; font-style: normal;">(V${_Info2.default.version})</i>
    <a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">[常见问题]</a>
  </span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
  <button name="default" type="button">默认值</button>
</div>`;
    let $dialog = Dialog.create(dialogName, 'KFOL助手设置' + (_Info2.default.isMobile ? ' (For Mobile)' : ''), html);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!verifyMainConfig($dialog)) return;
        let oriAutoRefreshEnabled = Config.timingModeEnabled;
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
        if (oriAutoRefreshEnabled !== options.timingModeEnabled) {
            if (confirm('你已修改了定时模式的设置，需要刷新页面才能生效，是否立即刷新？')) {
                location.reload();
            }
        }
    }).find('[name="default"]').click(function () {
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
        if (name === 'openRumCommandDialog') showRunCommandDialog();else if (name === 'openImportOrExportSettingDialog') showImportOrExportSettingDialog();else if (name === 'openBuyItemTipsDialog') showBuyItemTipsDialog();else if (name === 'openCustomSmColorDialog') showCustomSmColorDialog();else if (name === 'openUserMemoDialog') showUserMemoDialog();else if (name === 'openCustomCssDialog') showCustomCssDialog();else if (name === 'openCustomScriptDialog') Script.showDialog();else if (name === 'openFollowUserDialog') showFollowUserDialog();else if (name === 'openBlockUserDialog') showBlockUserDialog();else if (name === 'openBlockThreadDialog') showBlockThreadDialog();
    }).find('[name="promoteHaloCostType"]').change(function () {
        let typeId = parseInt($(this).val());
        $dialog.find('[data-id="promoteHaloLimitUnit"]').text(typeId >= 11 ? '贡献' : 'KFB');
    }).end().find('[data-name="customMySmColorSelect"]').change(function () {
        $dialog.find('[name="customMySmColor"]').val($(this).val().toString().toLowerCase());
    }).end().find('[name="customMySmColor"]').change(function () {
        let color = $.trim($(this).val());
        if (/^#[0-9a-fA-F]{6}$/.test(color)) $dialog.find('[data-name="customMySmColorSelect"]').val(color.toLowerCase());
    });

    setMainConfigValue($dialog);
    Dialog.show(dialogName);
    Script.runFunc('ConfigDialog.show_after_');
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
    $dialog.find('[name="promoteHaloCostType"]').trigger('change');
    $dialog.find('[name="buyItemIdList"]').val(Config.buyItemIdList.join(','));
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
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') {
                options[name] = Boolean($this.prop('checked'));
            } else if (typeof Config[name] === 'number') {
                let value = $.trim($this.val());
                if (/\d+\.\d+/.test(value)) options[name] = parseFloat(value);else options[name] = parseInt(value);
                if (name === 'threadContentFontSize' && isNaN(options[name])) options[name] = 0;
            } else {
                options[name] = $.trim($this.val());
            }
        }
    });
    if (options.buyItemIdList) options.buyItemIdList = options.buyItemIdList.split(',');else options.buyItemIdList = [];
    return options;
};

/**
 * 验证主对话框设置是否正确
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {boolean} 是否验证通过
 */
const verifyMainConfig = function ($dialog) {
    let $txtCheckLootAfterTime = $dialog.find('[name="checkLootAfterTime"]');
    let checkLootAfterTime = $.trim($txtCheckLootAfterTime.val());
    if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(checkLootAfterTime)) {
        alert('在指定时间之后争夺格式不正确');
        $txtCheckLootAfterTime.select().focus();
        return false;
    }

    let $txtBuyItemIdList = $dialog.find('[name="buyItemIdList"]');
    let buyItemIdList = $.trim($txtBuyItemIdList.val());
    if ($dialog.find('[name="autoBuyItemEnabled"]').prop('checked')) {
        if (!/^(\d+)(\|\d+)*(,(\d+)(\|\d+)*)?$/.test(buyItemIdList)) {
            alert('购买物品ID列表格式不正确');
            $txtBuyItemIdList.select().focus();
            return false;
        } else if (buyItemIdList.includes('901')) {
            alert('不支持自动购买重生之药');
            $txtBuyItemIdList.select().focus();
            return false;
        }
    }

    let $txtBuyItemAfterTime = $dialog.find('[name="buyItemAfterTime"]');
    let buyItemAfterTime = $.trim($txtBuyItemAfterTime.val());
    if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(buyItemAfterTime)) {
        alert('在指定时间之后购买物品格式不正确');
        $txtBuyItemAfterTime.select().focus();
        return false;
    }

    let $txtCustomMySmColor = $dialog.find('[name="customMySmColor"]');
    let customMySmColor = $.trim($txtCustomMySmColor.val());
    if (customMySmColor && !/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
        alert('自定义本人的神秘颜色格式不正确，例：#009cff');
        $txtCustomMySmColor.select().focus();
        return false;
    }

    let $txtSaveCurrentDepositAfterKfb = $dialog.find('[name="saveCurrentDepositAfterKfb"]');
    let $txtSaveCurrentDepositKfb = $dialog.find('[name="saveCurrentDepositKfb"]');
    let saveCurrentDepositAfterKfb = parseInt($txtSaveCurrentDepositAfterKfb.val());
    let saveCurrentDepositKfb = parseInt($txtSaveCurrentDepositKfb.val());
    if (saveCurrentDepositAfterKfb || saveCurrentDepositKfb) {
        if (!saveCurrentDepositAfterKfb || saveCurrentDepositAfterKfb <= 0) {
            alert('自动活期存款满足额度格式不正确');
            $txtSaveCurrentDepositAfterKfb.select().focus();
            return false;
        }
        if (!saveCurrentDepositKfb || saveCurrentDepositKfb <= 0 || saveCurrentDepositKfb > saveCurrentDepositAfterKfb) {
            alert('想要存款的金额格式不正确');
            $txtSaveCurrentDepositKfb.select().focus();
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
        localStorage.removeItem(_Const2.default.tempPointsLogListStorageName);
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
  <button type="submit">运行</button>
  <button name="clear" type="button">清除</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '运行命令', html);
    let $cmd = $dialog.find('[name="cmd"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        let content = $cmd.val();
        if (content) Script.runCmd(content, true);
    }).end().find('[name="clear"]').click(function () {
        $cmd.val('').focus();
    });

    $cmd.keydown(function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            $dialog.submit();
        } else if (e.ctrlKey && e.keyCode === 8) {
            $dialog.find('[name="clear"]').click();
        }
    });

    Dialog.show(dialogName);
    $cmd.focus();
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
    <strong>导出设置：</strong>复制文本框里的内容并粘贴到别处即可
  </div>
  <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '导入或导出设置', html);
    let $setting = $dialog.find('[name="setting"]');
    $dialog.submit(function (e) {
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
    });
    Dialog.show(dialogName);
    $setting.val(JSON.stringify(Util.getDifferenceSetOfObject(_Config.Config, Config))).select().focus();
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
  <span class="pd_cfg_about"><a data-name="openImOrExCustomSmColorConfigDialog" href="#">导入/导出配色方案</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义各等级神秘颜色', html, 'min-width: 327px;');
    let $customSmColorList = $dialog.find('[data-name="smColorList"]');

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
  <label>等级范围 <input name="min" type="text" maxlength="5" style="width: 30px;" value="${min}"></label>
  <label>- <input name="max" type="text" maxlength="5" style="width: 30px;" value="${max}"></label>
  <label>
    &nbsp;颜色 <input name="color" type="text" maxlength="7" style="width: 50px;" value="${color}">
    <input style="margin-left: 0;" type="color" value="${color}">
  </label>
  <a href="#">删除</a>
</li>`;
    };

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
                $txtSmMin.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            let $txtSmMax = $this.find('[name="max"]');
            let max = $.trim($txtSmMax.val()).toUpperCase();
            if (max === '') return;
            if (!/^(-?\d+|MAX)$/i.test(max)) {
                verification = false;
                $txtSmMax.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            if (Util.compareSmLevel(max, min) < 0) {
                verification = false;
                $txtSmMin.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            let $txtSmColor = $this.find('[name="color"]');
            let color = $.trim($txtSmColor.val()).toLowerCase();
            if (color === '') return;
            if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
                verification = false;
                $txtSmColor.select().focus();
                alert('颜色格式不正确');
                return false;
            }
            list.push({ min, max, color });
        });
        if (verification) {
            list.sort((a, b) => Util.compareSmLevel(a.min, b.min) > 0 ? 1 : -1);
            Config.customSmColorConfigList = list;
            (0, _Config.write)();
            Dialog.close(dialogName);
        }
    }).find('[data-action="addOne"], [data-action="addFive"]').click(function (e) {
        e.preventDefault();
        let num = 1;
        if ($(this).is('[data-action="addFive"]')) num = 5;
        for (let i = 1; i <= num; i++) {
            $customSmColorList.append(getSmColorLineHtml());
        }
        Dialog.resize(dialogName);
    }).end().find('[data-action="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有颜色？')) {
            $customSmColorList.empty();
            Dialog.resize(dialogName);
        }
    }).end().find('[data-name="openImOrExCustomSmColorConfigDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('配色方案', 'customSmColorConfigList', $dialog => $dialog.find('.pd_cfg_about').append('<a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a>'));
    });

    Dialog.show(dialogName);
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
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义CSS', html);
    let $content = $dialog.find('[name="customCssContent"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customCssContent = $.trim($content.val());
        (0, _Config.write)();
        Dialog.close(dialogName);
        alert('自定义CSS修改成功（需刷新页面后才可生效）');
    });
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
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '用户备注', html);
    let $userMemoList = $dialog.find('[name="userMemoList"]');
    $dialog.submit(function (e) {
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
    });
    let content = '';
    for (let [user, memo] of Util.entries(Config.userMemoList)) {
        content += `${user}:${memo}\n`;
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
  <ul id="pdFollowUserList" style="margin-top: 5px; min-width: 274px; line-height: 24px;"></ul>
  <div style="margin-top: 5px;">
    <div style="display: inline-block;">
      <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
      <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
    </div>
    <div style="float: right;">
      <a class="pd_btn_link" data-name="deleteSelect" href="#">删除</a>
    </div>
  </div>
  <div style="margin-top: 5px;" title="添加多个用户请用英文逗号分隔">
    <input name="addFollowUser" style="width: 200px;" type="text">
    <a class="pd_btn_link" data-name="add" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExFollowUserListDialog" href="#">导入/导出关注用户</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '关注用户', html);
    let $followUserList = $dialog.find('#pdFollowUserList');

    /**
     * 添加关注用户
     * @param {string} name 用户名
     */
    const addFollowUser = function (name) {
        $(`
<li>
  <input type="checkbox">
  <input name="username" type="text" style="width: 178px; margin-left: 5px;" maxlength="15" value="${name}">
  <a class="pd_btn_link" data-name="delete" href="#">删除</a>
</li>
`).appendTo($followUserList);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.highlightFollowUserThreadInHPEnabled = $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked');
        Config.highlightFollowUserThreadLinkEnabled = $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked');
        Config.followUserList = [];
        $followUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[name="username"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                Config.followUserList.push({ name });
            }
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $followUserList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="selectAll"]').click(() => Util.selectAll($followUserList.find('[type="checkbox"]'))).end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($followUserList.find('[type="checkbox"]'))).end().find('[data-name="deleteSelect"]').click(function (e) {
        e.preventDefault();
        let $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) {
            $checked.remove();
            Dialog.resize(dialogName);
        }
    });

    $dialog.find('[name="addFollowUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next('a').click();
        }
    }).end().find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        for (let name of $.trim($dialog.find('[name="addFollowUser"]').val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                addFollowUser(name);
            }
        }
        $dialog.find('[name="addFollowUser"]').val('');
        Dialog.resize(dialogName);
    }).end().find('[data-name="openImOrExFollowUserListDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('关注用户', 'followUserList');
    });

    $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
    $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked', Config.highlightFollowUserThreadLinkEnabled);
    for (let user of Config.followUserList) {
        addFollowUser(user.name);
    }
    Dialog.show(dialogName);
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
      <input name="blockUserAtTipsEnabled" type="checkbox"> 屏蔽@提醒 <span class="pd_cfg_tips" title="屏蔽被屏蔽用户的@提醒">[?]</span>
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
  <ul id="pdBlockUserList" style="margin-top: 5px; min-width: 362px; line-height: 24px;"></ul>
  <div style="margin-top: 5px;">
    <div style="display: inline-block;">
      <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
      <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
    </div>
    <div style="float: right;">
      <a class="pd_btn_link" data-name="modify" href="#">修改为</a>
      <select>
        <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
      </select>
      <a class="pd_btn_link" data-name="deleteSelect" href="#">删除</a>
    </div>
  </div>
  <div style="margin-top: 5px;" title="添加多个用户请用英文逗号分隔">
    <input name="addBlockUser" style="width: 200px;" type="text">
    <a class="pd_btn_link" data-name="add" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExBlockUserListDialog" href="#">导入/导出屏蔽用户</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '屏蔽用户', html);
    let $blockUserList = $dialog.find('#pdBlockUserList');

    /**
     * 添加屏蔽用户
     * @param {string} name 用户名
     * @param {number} type 屏蔽类型
     */
    const addBlockUser = function (name, type) {
        $(`
<li>
  <input type="checkbox">
  <input name="username" type="text" style="width: 150px; margin-left: 5px;" maxlength="15" value="${name}">
  <select name="blockType" style="margin-left: 5px;">
    <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
  </select>
  <a class="pd_btn_link" data-name="delete" href="#">删除</a>
</li>`).appendTo($blockUserList).find('[name="blockType"]').val(type);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.blockUserDefaultType = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        Config.blockUserAtTipsEnabled = $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked');
        Config.blockUserForumType = parseInt($dialog.find('[name="blockUserForumType"]').val());
        let blockUserFidList = new Set();
        for (let fid of $.trim($dialog.find('[name="blockUserFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) blockUserFidList.add(fid);
        }
        Config.blockUserFidList = [...blockUserFidList];
        Config.blockUserList = [];
        $blockUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[name="username"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                let type = parseInt($this.find('[name="blockType"]').val());
                Config.blockUserList.push({ name, type });
            }
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $blockUserList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="selectAll"]').click(() => Util.selectAll($blockUserList.find('input[type="checkbox"]'))).end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($blockUserList.find('input[type="checkbox"]'))).end().find('[data-name="modify"]').click(function (e) {
        e.preventDefault();
        let value = $(this).next('select').val();
        $blockUserList.find('li:has([type="checkbox"]:checked) > select').val(value);
    }).end().find('[data-name="deleteSelect"]').click(function (e) {
        e.preventDefault();
        let $checked = $blockUserList.find('li:has([type="checkbox"]:checked)');
        if (!$checked.length) return;
        if (confirm('是否删除所选用户？')) {
            $checked.remove();
            Dialog.resize(dialogName);
        }
    });

    $dialog.find('[name="addBlockUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next('a').click();
        }
    }).end().find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        let type = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        for (let name of $.trim($dialog.find('[name="addBlockUser"]').val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                addBlockUser(name, type);
            }
        }
        $dialog.find('[name="addBlockUser"]').val('');
        Dialog.resize(dialogName);
    }).end().find('[name="blockUserForumType"]').change(function () {
        $dialog.find('[name="blockUserFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[data-name="openImOrExBlockUserListDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('屏蔽用户', 'blockUserList');
    });

    $dialog.find('[name="blockUserDefaultType"]').val(Config.blockUserDefaultType);
    $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked', Config.blockUserAtTipsEnabled);
    $dialog.find('[name="blockUserForumType"]').val(Config.blockUserForumType).triggerHandler('change');
    $dialog.find('[name="blockUserFidList"]').val(Config.blockUserFidList.join(','));
    for (let user of Config.blockUserList) {
        addBlockUser(user.name, user.type);
    }
    Dialog.show(dialogName);
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
    标题关键字可使用普通字符串或正则表达式，正则表达式请使用<code>/abc/</code>的格式，例：<code>/关键字A.*关键字B/i</code><br>
    用户名和版块ID为可选项（多个用户名或版块ID请用英文逗号分隔）<br>
    <label>
      默认版块屏蔽范围
      <select name="blockThreadDefForumType">
        <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
      </select>
    </label>
    <label style="margin-left: 5px;">默认版块ID列表 <input name="blockThreadDefFidList" type="text" style="width: 150px;"></label>
  </div>
  <table id="pdBlockThreadList" style="line-height: 22px; text-align: center;">
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
    <a class="pd_btn_link" data-name="addOne" href="#">增加1个</a>
    <a class="pd_btn_link" data-name="addFive" href="#">增加5个</a>
    <a class="pd_btn_link pd_highlight" data-name="clear" href="#">清除所有</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExBlockThreadListDialog" href="#">导入/导出屏蔽帖子</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '屏蔽帖子', html, 'width: 768px;');
    let $blockThreadList = $dialog.find('#pdBlockThreadList');

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
  <td><input name="keyWord" type="text" style="width: 208px;" value="${keyWord}"></td>
  <td><select name="userType"><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>
  <td><input name="userList" type="text" style="width: 188px;" value="${userList.join(',')}" ${userType === 0 ? 'disabled' : ''}></td>
  <td><select name="fidType"><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>
  <td><input name="fidList" type="text" style="width: 120px;" value="${fidList.join(',')}" ${fidType === 0 ? 'disabled' : ''}></td>
  <td><a href="#" data-name="delete">删除</a></td>
</tr>
`).appendTo($blockThreadList).find('[name="userType"]').val(userType).end().find('[name="fidType"]').val(fidType);
    };

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    const verify = function () {
        let flag = true;
        $blockThreadList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            let $txtKeyWord = $this.find('[name="keyWord"]');
            let keyWord = $txtKeyWord.val();
            if ($.trim(keyWord) === '') return;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    eval(keyWord);
                } catch (ex) {
                    alert('正则表达式不正确');
                    $txtKeyWord.select().focus();
                    flag = false;
                    return false;
                }
            }
        });
        return flag;
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!verify()) return;
        Config.blockThreadDefForumType = parseInt($dialog.find('[name="blockThreadDefForumType"]').val());
        let blockThreadDefFidList = new Set();
        for (let fid of $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) blockThreadDefFidList.add(fid);
        }
        Config.blockThreadDefFidList = [...blockThreadDefFidList];
        Config.blockThreadList = [];
        $blockThreadList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            let keyWord = $this.find('[name="keyWord"]').val();
            if ($.trim(keyWord) === '') return;
            let newObj = { keyWord };

            let userType = parseInt($this.find('[name="userType"]').val());
            if (userType > 0) {
                let userList = new Set();
                for (let user of $.trim($this.find('[name="userList"]').val()).split(',')) {
                    user = $.trim(user);
                    if (user) userList.add(user);
                }
                if (userList.size > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = [...userList];
            }

            let fidType = parseInt($this.find('[name="fidType"]').val());
            if (fidType > 0) {
                let fidList = new Set();
                for (let fid of $.trim($this.find('[name="fidList"]').val()).split(',')) {
                    fid = parseInt(fid);
                    if (!isNaN(fid) && fid > 0) fidList.add(fid);
                }
                if (fidList.size > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = [...fidList];
            }
            Config.blockThreadList.push(newObj);
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $blockThreadList.on('change', 'select', function () {
        let $this = $(this);
        $this.parent('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove();
    });

    $dialog.find('[data-name="addOne"], [data-name="addFive"]').click(function (e) {
        e.preventDefault();
        let num = 1;
        if ($(this).is('[data-name="addFive"]')) num = 5;
        for (let i = 1; i <= num; i++) {
            addBlockThread('', 0, [], parseInt($dialog.find('[name="blockThreadDefForumType"]').val()), $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(','));
        }
        Dialog.resize(dialogName);
    }).end().find('[data-name="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有屏蔽关键字？')) {
            $blockThreadList.find('tbody > tr:gt(0)').remove();
            Dialog.resize(dialogName);
        }
    }).end().find('[name="blockThreadDefForumType"]').change(function () {
        $dialog.find('[name="blockThreadDefFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[data-name="openImOrExBlockThreadListDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('屏蔽帖子', 'blockThreadList');
    });

    $dialog.find('[name="blockThreadDefForumType"]').val(Config.blockThreadDefForumType).triggerHandler('change');
    $dialog.find('[name="blockThreadDefFidList"]').val(Config.blockThreadDefFidList.join(','));
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
    Dialog.show(dialogName);
};

/**
 * 显示自动购买物品详细说明对话框
 */
const showBuyItemTipsDialog = function () {
    const dialogName = 'pdBuyItemTipsDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="margin: 5px 0;">
    <strong>设置说明：</strong><br>
    在物品ID列表填入相应的物品ID，可自动购买所需的物品，每天最多可购买两次。<br>
    （即：只购买1种物品的话最多可购买2次；购买2种物品的话每种物品只能购买1次，合计2次）<br>
    <strong>各物品ID：</strong><br>
    <b>等级经验药丸</b>：101；<b>等级经验药丸（蛋）</b>：102；<b>修炼手册</b>：103。<span class="pd_notice">（注：重生之药请手动购买）</span><br>
    <strong>格式：</strong><br>
    两次购买之间的物品ID请用<b>英文逗号</b>分隔；同一次购买的物品ID如用<b>竖线</b>分隔，表示前一种物品如费用不足，可自动更换为购买另一种物品。<br>
    <strong>例子：</strong><br>
    <b>102</b>：表示只购买一次[102]物品。<br>
    <b>102,101</b>：表示第1次购买[102]物品，第2次购买[101]物品。<br>
    <b>102|101,103|102|101</b>：表示第1次先尝试购买[102]物品，如费用不足则购买[101]物品；第2次先尝试购买[103]物品，如费用不足则购买[102]物品，依然不足则购买[101]物品。<br>
  </div>
</div>`;
    Dialog.create(dialogName, '自动购买物品详细说明', html, 'max-width: 600px;');
    Dialog.show(dialogName);
};

},{"./Config":4,"./Const":6,"./Dialog":7,"./Info":9,"./Public":18,"./Script":20,"./TmpLog":22,"./Util":23}],6:[function(require,module,exports){
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
    // 在当天的指定时间之后领取每日奖励（北京时间），例：00:35:00
    getDailyBonusAfterTime: '00:35:00',
    // 遭遇敌人统计的指定最近层数
    enemyStatLatestLevelNum: 10,
    // 争夺攻击时每隔指定层数进行一次检查
    lootAttackPerCheckLevel: 20,
    // 获取自定义的争夺点数分配方案（函数），参考范例见：read.php?tid=500968&spid=13270735
    getCustomPoints: null,

    // 定时操作结束后的再判断间隔（秒），用于在定时模式中进行下一次定时时间的再判断
    actionFinishRetryInterval: 30,
    // 在连接超时的情况下获取剩余时间失败后的重试间隔（分钟），用于定时模式
    errorRefreshInterval: 1,
    // 在网页标题上显示定时模式提示的更新间隔（分钟）
    showRefreshModeTipsInterval: 1,
    // 领取每日争夺奖励时，遇见所设定的任务未完成时的重试间隔（分钟）
    getDailyBonusSpecialInterval: 60,
    // 提升战力光环的最小间隔时间（分钟）
    minPromoteHaloInterval: 480,
    // 在检测到当前持有的KFB或贡献未高于指定值时的下一次自动提升战力光环的间隔时间（分钟）
    promoteHaloLimitNextActionInterval: 480,
    // 进行批量提升战力光环操作的间隔时间（毫秒）
    promoteHaloActionInterval: 1000,
    // 临时存储的战力光环信息的有效期（分钟）
    tmpHaloInfoExpires: 210,
    // 争夺攻击进行中的有效期（分钟）
    lootAttackingExpires: 10,
    // 在尚有剩余次数情况下的存储改点剩余次数信息的Cookie有效期（分钟）
    changePointsInfoExpires: 30,
    // 检查争夺情况时，遇见争夺未结束时的重试间隔（分钟）
    checkLootInterval: 30,
    // 标记已去除首页已读at高亮提示的Cookie有效期（天）
    hideMarkReadAtTipsExpires: 3,
    // 神秘等级升级的提醒间隔（小时），设为0表示当升级时随时进行提醒
    smLevelUpAlertInterval: 3,
    // 神秘系数排名变化的提醒间隔（小时），设为0表示当排名变化时随时进行提醒
    smRankChangeAlertInterval: 22,
    // 存储VIP剩余时间的Cookie有效期（分钟）
    vipSurplusTimeExpires: 60,
    // 定期存款到期期限（天）
    fixedDepositDueTime: 90,

    // ajax请求的默认超时时间（毫秒）
    defAjaxTimeout: 30000,
    // ajax请求的默认时间间隔（毫秒）
    defAjaxInterval: 200,
    // 特殊情况下的ajax请求（如使用道具、打开盒子等）的时间间隔（毫秒），可设置为函数来返回值
    specialAjaxInterval() {
        if (Config.slowActionEnabled) return Math.floor(Math.random() * 4000) + 3000; // 慢速情况
        else return Math.floor(Math.random() * 200) + 1000; // 正常情况
    },
    // 部分操作的最小时间间隔（毫秒）
    minActionInterval: 1000,
    // 每次争夺攻击的时间间隔（毫秒），可设置为函数来返回值
    lootAttackInterval() {
        if (Config.slowAttackEnabled) return Math.floor(Math.random() * 3000) + 4000; // 慢速情况
        else return Math.floor(Math.random() * 200) + 1000; // 正常情况
    },
    // 银行相关操作的时间间隔（毫秒）
    bankActionInterval: 5000,

    // 购买帖子提醒的最低售价（KFB）
    minBuyThreadWarningSell: 6,
    // 统计楼层最大能访问的帖子页数
    statFloorMaxPage: 300,
    // 可进行自助评分的版块ID列表
    selfRateFidList: [41, 67, 92, 127, 68, 163],
    // 自助评分错标范围百分比
    ratingErrorSizePercent: 3,
    // 自定义快捷导航菜单内容
    // 格式：'<li><a href="导航链接">导航项名称</a></li>'
    customFastNavMenuContent: '',

    // 通用存储数据名称前缀
    storagePrefix: storagePrefix,
    // 存储多重引用数据的LocalStorage名称
    multiQuoteStorageName: storagePrefix + 'multiQuote',
    // 保存发帖内容的SessionStorage名称
    postContentStorageName: storagePrefix + 'postContent',
    // 存储临时点数分配记录列表的LocalStorage名称
    tempPointsLogListStorageName: storagePrefix + 'tempPointsLogList',
    // 存储临时点数分配记录列表的LocalStorage名称
    itemLogStorageName: storagePrefix + 'itemLog',

    // 神秘等级升级提醒的临时日志名称
    smLevelUpTmpLogName: 'SmLevelUp',
    // 神秘系数排名变化提醒的临时日志名称
    smRankChangeTmpLogName: 'SmRankChange',
    // 定期存款到期时间的临时日志名称
    fixedDepositDueTmpLogName: 'FixedDepositDue',
    // 存储上一次自动更换ID颜色的临时日志名称
    prevAutoChangeIdColorTmpLogName: 'PrevAutoChangeIdColor',
    // 存储战力光环信息的临时日志名称
    haloInfoTmpLogName: 'HaloInfo',

    // 标记已领取每日奖励的Cookie名称
    getDailyBonusCookieName: 'getDailyBonus',
    // 标记已提升战力光环的Cookie名称
    promoteHaloCookieName: 'promoteHalo',
    // 标记正在检查争夺情况的Cookie名称
    lootCheckingCookieName: 'lootChecking',
    // 标记正在进行争夺攻击的Cookie名称
    lootAttackingCookieName: 'lootAttacking',
    // 存储改点剩余次数信息的Cookie名称
    changePointsInfoCookieName: 'changePointsInfo',
    // 标记已完成自动争夺的Cookie名称
    lootCompleteCookieName: 'lootComplete',
    // 标记准备购买物品的Cookie名称
    buyItemReadyCookieName: 'buyItemReady',
    // 标记已购买物品的Cookie名称
    buyItemCookieName: 'buyItem',
    // 标记已去除首页已读at高亮提示的Cookie名称
    hideReadAtTipsCookieName: 'hideReadAtTips',
    // 存储之前已读的at提醒信息的Cookie名称
    prevReadAtTipsCookieName: 'prevReadAtTips',
    // 标记已进行定期存款到期提醒的Cookie名称
    fixedDepositDueAlertCookieName: 'fixedDepositDueAlert',
    // 存储VIP剩余时间的Cookie名称
    vipSurplusTimeCookieName: 'vipSurplusTime',
    // 标记已自动更换ID颜色的Cookie名称
    autoChangeIdColorCookieName: 'autoChangeIdColor'
};

exports.default = Const;

},{}],7:[function(require,module,exports){
/* 对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = exports.resize = exports.show = exports.create = undefined;

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
<div class="pd_cfg_box" id="${id}" style="${style}">
  <h1>${title}<span data-action="close">&times;</span></h1>
  ${content}
</div>
</form>`;
    let $dialog = $(html).appendTo('body');
    $dialog.on('click', '.pd_cfg_tips', function (e) {
        if (_Info2.default.isMobile) Public.showElementTitleTips(e, this.title);
        return false;
    }).on('click', 'a.pd_disabled_link', () => false).on('click', '[data-action="close"]', () => close(id)).keydown(function (e) {
        if (e.keyCode === 27) {
            return close(id);
        }
    }).find('legend [type="checkbox"]').click(function () {
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
    }).end().find('input[data-mutex]').click(function () {
        let $this = $(this);
        let checked = $this.prop('checked');
        $($this.data('mutex')).each(function () {
            let $this = $(this);
            if ($this.is('a')) {
                if (checked) $this.addClass('pd_disabled_link');else $this.removeClass('pd_disabled_link');
            } else {
                $this.prop('disabled', checked);
            }
        });
    });
    if (!_Info2.default.isMobile) {
        $(window).on('resize.' + id, () => resize(id));
    }
    return $dialog;
};

/**
 * 显示或调整对话框
 * @param {string} id 对话框ID
 */
const show = exports.show = function (id) {
    let $dialog = $('#' + id);
    if (!$dialog.length) return;
    $dialog.find('legend [type="checkbox"]').each(function () {
        $(this).triggerHandler('click');
    }).end().find('input[data-disabled], input[data-mutex]').each(function () {
        $(this).triggerHandler('click');
    });
    $dialog.fadeIn('fast');
    resize(id);
    $dialog.find('input:first, select:first, a:first, textarea:first, button:first').eq(0).focus();
};

/**
 * 调整对话框大小和位置
 * @param {string} id 对话框ID
 */
const resize = exports.resize = function (id) {
    let $dialog = $('#' + id);
    let windowHeight = $(window).height();
    $dialog.find('.pd_cfg_main').css('max-height', windowHeight - 80);
    let dialogWidth = $dialog.outerWidth(),
        windowWidth = $(window).width();
    let left = windowWidth / 2 - dialogWidth / 2;
    if (left + dialogWidth > windowWidth) left = windowWidth - dialogWidth - 20;
    if (left < 0) left = 0;
    let top = windowHeight / 2 - $dialog.outerHeight() / 2;
    if (top < 0) top = 0;
    $dialog.css({ top, left });
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

},{"./Info":9,"./Public":18,"./Util":23}],8:[function(require,module,exports){
/* 首页模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addChangePointsInfoTips = exports.addPromoteHaloInterval = exports.handleIndexLink = exports.addSearchTypeSelectBox = exports.showVipSurplusTime = exports.addThreadFastGotoLink = exports.smRankChangeAlert = exports.smLevelUpAlert = exports.handleAtTips = undefined;

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

var _Loot = require('./Loot');

var Loot = _interopRequireWildcard(_Loot);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 处理首页有人@你的消息框
 */
const handleAtTips = exports.handleAtTips = function () {
    let type = Config.atTipsHandleType;
    if (type === 'default') return;
    let $atTips = $('a.indbox5[href^="guanjianci.php?gjc="]');
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
                    Util.setCookie(_Const2.default.hideReadAtTipsCookieName, atTipsText, Util.getDate(`+${_Const2.default.hideMarkReadAtTipsExpires}d`));
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
  <a class="indbox6" href="guanjianci.php?gjc=${_Info2.default.userName}" target="_blank">最近无人${type === 'at_change_to_cao' ? '艹' : '@'}你</a><br>
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
    let smLevel = parseInt($('#pdSmLevel').data('sm-level'));
    if (!smLevel) return;

    /**
     * 写入神秘等级数据
     * @param {number} smLevel 神秘等级
     */
    const writeData = function (smLevel) {
        TmpLog.setValue(_Const2.default.smLevelUpTmpLogName, { time: $.now(), smLevel });
    };

    let data = TmpLog.getValue(_Const2.default.smLevelUpTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smLevel) !== 'number') {
        writeData(smLevel);
    } else if (smLevel > data.smLevel) {
        let diff = Math.floor(($.now() - data.time) / 60 / 60 / 1000);
        if (diff >= _Const2.default.smLevelUpAlertInterval) {
            let date = new Date(data.time);
            writeData(smLevel);
            Log.push('神秘等级升级', `自\`${Util.getDateString(date)}\`以来，你的神秘等级共上升了\`${smLevel - data.smLevel}\`级 (Lv.\`${data.smLevel}\`->Lv.\`${smLevel}\`)`);
            Msg.show(`自<em>${Util.getDateString(date)}</em>以来，你的神秘等级共上升了<em>${smLevel - data.smLevel}</em>级`);
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
    let smRank = $('#pdSmLevel').data('sm-rank');
    if (!smRank || smRank.toString().endsWith('+')) return;
    smRank = parseInt(smRank);

    /**
     * 写入神秘系数排名数据
     * @param {number} smRank 神秘系数排名
     */
    const writeData = smRank => TmpLog.setValue(_Const2.default.smRankChangeTmpLogName, { time: $.now(), smRank });

    let data = TmpLog.getValue(_Const2.default.smRankChangeTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smRank) !== 'number') {
        writeData(smRank);
    } else if (smRank !== data.smRank) {
        let diff = Math.floor(($.now() - data.time) / 60 / 60 / 1000);
        if (diff >= _Const2.default.smRankChangeAlertInterval) {
            let date = new Date(data.time);
            let isUp = smRank < data.smRank;
            writeData(smRank);
            Log.push('神秘系数排名变化', `自\`${Util.getDateString(date)}\`以来，你的神秘系数排名共\`${isUp ? '上升' : '下降'}\`了\`${Math.abs(smRank - data.smRank)}\`名 ` + `(No.\`${data.smRank}\`->No.\`${smRank}\`)`);
            Msg.show(`自<em>${Util.getDateString(date)}</em>以来，你的神秘系数排名共<b style="color: ${isUp ? '#F00' : '#393'}">${isUp ? '上升' : '下降'}</b>了` + `<em>${Math.abs(smRank - data.smRank)}</em>名`);
        } else if (diff < 0) {
            writeData(smRank);
        }
    }
};

/**
 * 在首页帖子链接旁添加快速跳转至页末的链接
 */
const addThreadFastGotoLink = exports.addThreadFastGotoLink = function () {
    $('.index1').on('mouseenter', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        let $this = $(this);
        $this.css('position', 'relative').prepend(`<a class="pd_thread_goto" href="${$this.find('a').attr('href')}&page=e#a">&raquo;</a>`);
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
        $('#pdSmLevel').parent().after(`<div class="line"></div><div style="width: 300px;"><a href="kf_vmember.php" class="indbox${hours > 0 ? 5 : 6}">VIP会员 ` + `(${hours > 0 ? '剩余' + hours + '小时' : '参与论坛获得的额外权限'})</a><div class="c"></div></div>`);
    };

    let vipHours = parseInt(Util.getCookie(_Const2.default.vipSurplusTimeCookieName));
    if (isNaN(vipHours) || vipHours < 0) {
        console.log('检查VIP剩余时间Start');
        $.get('kf_vmember.php?t=' + $.now(), function (html) {
            let hours = 0;
            let matches = /我的VIP剩余时间\s*<b>(\d+)<\/b>\s*小时/i.exec(html);
            if (matches) hours = parseInt(matches[1]);
            Util.setCookie(_Const2.default.vipSurplusTimeCookieName, hours, Util.getDate(`+${_Const2.default.vipSurplusTimeExpires}m`));
            addVipHoursTips(hours);
        });
    } else {
        addVipHoursTips(vipHours);
    }
};

/**
 * 在首页上添加搜索类型选择框
 */
const addSearchTypeSelectBox = exports.addSearchTypeSelectBox = function () {
    let $form = $('form[action="search.php?"]');
    $form.attr('name', 'pdSearchForm');
    let $keyWord = $form.find('[type="text"][name="keyword"]');
    $keyWord.css('width', '116px');
    $('<div class="pd_search_type"><span>标题</span><i>&#8744;</i></div>').insertAfter($keyWord);
};

/**
 * 处理首页链接
 */
const handleIndexLink = exports.handleIndexLink = function () {
    let $kfb = $('a[href="kf_givemekfb.php"]');
    let matches = /拥有(-?\d+)KFB/.exec($kfb.text());
    if (matches) {
        let kfb = parseInt(matches[1]);
        $kfb.html(`拥有<b>${kfb.toLocaleString()}</b>KFB`).attr('data-kfb', kfb);
    }

    let $smLevel = $('a.indbox5[href="kf_growup.php"]');
    $smLevel.attr('id', 'pdSmLevel');
    matches = /神秘(-?\d+)级 \(系数排名第\s*(\d+\+?)\s*位/.exec($smLevel.text());
    if (matches) {
        let smLevel = parseInt(matches[1]);
        let smRank = matches[2];
        $smLevel.html(`神秘<b>${smLevel}</b>级 (系数排名第<b style="color: #00f;">${smRank}</b>位)`).attr('data-sm-level', smLevel).attr('data-sm-rank', smRank);
    }

    $('a.indbox5[href="kf_fw_ig_index.php"]').attr('id', 'pdLoot');
};

/**
 * 添加提升战力光环间隔时间
 */
const addPromoteHaloInterval = exports.addPromoteHaloInterval = function () {
    let nextTime = parseInt(Util.getCookie(_Const2.default.promoteHaloCookieName));
    if (!nextTime) return;
    let interval = nextTime - $.now();
    if (interval > 0) {
        let minutes = Math.ceil(interval / 60 / 1000);
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        $('#pdLoot').append(`<span id="pdHaloInterval"> (光环：${hours > 0 ? hours + '时' : ''}${minutes}分)</span>`);
    }
};

/**
 * 添加改点剩余次数信息提示
 */
const addChangePointsInfoTips = exports.addChangePointsInfoTips = function () {
    let value = Util.getCookie(_Const2.default.changePointsInfoCookieName);
    if (!value) {
        Loot.getChangePointsCountDown().done(addChangePointsInfoTips).fail(() => setTimeout(addChangePointsInfoTips, _Const2.default.defAjaxInterval));
        return;
    }

    let tipsText = '';
    if ($.isNumeric(value)) {
        let nextTime = parseInt(value);
        let interval = nextTime - $.now();
        if (interval > 0) {
            let minutes = Math.ceil(interval / 60 / 1000);
            let hours = Math.floor(minutes / 60);
            minutes -= hours * 60;
            tipsText = `${hours > 0 ? hours + '时' : ''}${minutes}分`;
        }
    } else tipsText = parseInt(value) + '次';
    if (tipsText) $('#pdLoot').append(`<span id="pdChangePointsTips"> (改点：${tipsText})</span>`);
};

},{"./Const":6,"./Info":9,"./Log":11,"./Loot":13,"./Msg":15,"./TmpLog":22,"./Util":23}],9:[function(require,module,exports){
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
  storageType: 'Default',
  // 用户菜单区域
  $userMenu: $('.topmenuo1 > .topmenuo3:last-child > .topmenuo2')
};

exports.default = Info;

},{}],10:[function(require,module,exports){
/* 物品模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showMyInfoInItemShop = exports.buyItems = exports.getItemsUsedNumInfo = exports.getLevelByName = exports.getArmsLevelInfo = exports.getArmInfo = exports.getArmClassNameByGroupName = exports.addCommonArmsButton = exports.handleUselessSubProperties = exports.getArmParameterSetting = exports.bindArmLinkClickEvent = exports.sortArmsById = exports.sortArmsByGroup = exports.handleArmArea = exports.addSavedArmsInfo = exports.clearArmsInfo = exports.writeArmsInfo = exports.readArmsInfo = exports.getNextObjects = exports.init = exports.itemTypeList = exports.armTypeList = exports.armGroupList = exports.armClassList = exports.boxTypeList = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

var _Loot = require('./Loot');

var Loot = _interopRequireWildcard(_Loot);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 盒子区域
let $boxArea;
// 装备区域
let $armArea;
// 物品区域
let $itemArea;
// SafeID
let safeId;

// 盒子种类列表
const boxTypeList = exports.boxTypeList = ['普通盒子', '幸运盒子', '稀有盒子', '传奇盒子', '神秘盒子'];

// 装备类别列表
const armClassList = exports.armClassList = ['武器', '护甲', '项链'];
// 装备组别列表
const armGroupList = exports.armGroupList = ['长剑', '短弓', '法杖', '铠甲', '皮甲', '布甲'];
// 装备种类列表
const armTypeList = exports.armTypeList = ['普通的装备', '幸运的装备', '稀有的装备', '传奇的装备', '神秘的装备'];

// 道具种类列表
const itemTypeList = exports.itemTypeList = ['零时迷子的碎片', '被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画', '十六夜同人漫画', '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药'];

/**
 * 初始化
 */
const init = exports.init = function () {
    safeId = Public.getSafeId();
    if (!safeId) return;
    $boxArea = $('.kf_fw_ig1:eq(0)');
    $armArea = $('.kf_fw_ig4:eq(0)');
    $itemArea = $('.kf_fw_ig1:eq(1)');

    addBatchOpenBoxesLink();
    addOpenAllBoxesButton();

    // 临时措施
    let oldArmsInfo = localStorage.getItem(_Const2.default.storagePrefix + 'myArmsInfo' + '_' + _Info2.default.uid);
    if (oldArmsInfo) {
        try {
            let oldArmList = JSON.parse(oldArmsInfo);
            let armsInfo = readArmsInfo();
            armsInfo['装备列表'] = oldArmList;
            localStorage.removeItem(_Const2.default.storagePrefix + 'myArmsInfo' + '_' + _Info2.default.uid);
        } catch (ex) {
            console.log(ex);
        }
    }

    if (Config.autoSaveArmsInfoEnabled) {
        addSavedArmsInfo($armArea);
    }
    handleArmArea($armArea);
    bindArmLinkClickEvent($armArea, safeId);

    addArmsButton();
    addBatchUseAndSellItemsButton();
};

/**
 * 获取下一批物品
 * @param {number} sequence 下一批物品的插入顺序，1：向前插入；2：往后添加
 * @param {function} callback 回调函数
 */
const getNextObjects = exports.getNextObjects = function (sequence, callback = null) {
    console.log('获取下一批物品Start');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_mybp.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout
    }).done(function (html) {
        for (let index = 1; index <= 2; index++) {
            let matches = null;
            if (index === 1) {
                matches = /<tr><td width="\d+%">装备.+?\r\n(<tr.+?<\/tr>)<tr><td colspan="4">/.exec(html);
            } else {
                matches = /<tr><td width="\d+%">使用.+?\r\n(<tr.+?<\/tr>)<tr><td colspan="4">/.exec(html);
            }
            if (!matches) continue;
            let trMatches = matches[1].match(/<tr(.+?)<\/tr>/g);
            let $area = index === 1 ? $armArea : $itemArea;
            let addHtml = '';
            let newArmsInfo = { '已装备武器': 0, '已装备护甲': 0, '装备列表': {} };
            for (let i in trMatches) {
                let idMatches = /"wp_(\d+)"/.exec(trMatches[i]);
                if (!idMatches) continue;
                let id = parseInt(idMatches[1]);
                if (!$area.has(`[id="wp_${id}"]`).length) {
                    addHtml += trMatches[i];
                }
                if (index === 1) {
                    newArmsInfo['装备列表'][id] = trMatches[i];
                    let equippedArmMatches = /<tr id="wp_(\d+)">.+?（装备中）<span[^<>]*>[^<>]+的([^<>]+)<\/span>/.exec(trMatches[i]);
                    if (equippedArmMatches) {
                        let equippedArmId = parseInt(equippedArmMatches[1]);
                        let armClassName = getArmClassNameByGroupName(equippedArmMatches[2]);
                        if (armClassName) {
                            newArmsInfo[`已装备${armClassName}`] = equippedArmId;
                        }
                    }
                }
            }
            if (index === 1 && Config.autoSaveArmsInfoEnabled) {
                let armsInfo = readArmsInfo();
                if (newArmsInfo['已装备武器'] > 0) armsInfo['已装备武器'] = newArmsInfo['已装备武器'];
                if (newArmsInfo['已装备护甲'] > 0) armsInfo['已装备护甲'] = newArmsInfo['已装备护甲'];
                $.extend(armsInfo['装备列表'], newArmsInfo['装备列表']);
                writeArmsInfo(armsInfo);
            }
            if (addHtml) {
                if (sequence === 2) {
                    $area.find('> tbody > tr:last-child').before(addHtml);
                } else {
                    $area.find('> tbody > tr:nth-child(2)').after(addHtml);
                }
                if (index === 1) {
                    handleArmArea($armArea);
                }
            }
        }
        if (typeof callback === 'function') callback();
    }).fail(function () {
        setTimeout(() => getNextObjects(sequence, callback), _Const2.default.defAjaxInterval);
    });
};

/**
 * 添加批量打开盒子链接
 */
const addBatchOpenBoxesLink = function () {
    $boxArea = $('.kf_fw_ig1:first');
    $boxArea.find('> tbody > tr:nth-child(3) > td > a[onclick^="dkhz"]').each(function () {
        let $this = $(this);
        let matches = /dkhz\('(\d+)'\)/.exec($this.attr('onclick'));
        if (!matches) return;
        $this.after(`<a class="pd_highlight" href="#" data-name="openBoxes" data-id="${matches[1]}" style="margin-left: 10px;">批量打开</a>`);
    });

    $boxArea.on('click', 'a[data-name="openBoxes"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let id = parseInt($this.data('id'));
        let $info = $boxArea.find(`> tbody > tr:nth-child(2) > td:nth-child(${id})`);
        let boxType = $info.find('span:first').text().trim() + '盒子';
        if (!boxTypeList.includes(boxType)) return;
        let currentNum = parseInt($info.find('span:last').text());
        let num = parseInt(prompt(`你要打开多少个【${boxType}】？`, currentNum));
        if (!num || num < 0) return;
        if (!Config.sortArmsByGroupEnabled && !Config.autoSaveArmsInfoEnabled) {
            $armArea.find('> tbody > tr:nth-child(2)').after('<tr><td colspan="3" style="color: #777;">以上为新装备</td></tr>');
        }
        Msg.destroy();
        openBoxes({ id, boxType, num, safeId });
    });
};

/**
 * 添加一键开盒按钮
 */
const addOpenAllBoxesButton = function () {
    $(`
<div class="pd_item_btns" data-name="openBoxesBtns">
  <label>
    <input name="autoSaveArmsInfoEnabled" type="checkbox" ${Config.autoSaveArmsInfoEnabled ? 'checked' : ''}> 保存装备信息</input>
    <span class="pd_cfg_tips" title="在批量打开盒子时自动保存装备信息，可突破装备背包最多显示10件的限制">[?]</span>
  </label>
  <button name="clearMsg" type="button" title="清除页面上所有的消息框">清除消息框</button>
  <button name="openAllBoxes" type="button" style="color: #f00;" title="打开全部盒子">一键开盒</button>
</div>
`).insertAfter($boxArea).find('[name="autoSaveArmsInfoEnabled"]').click(function () {
        let checked = $(this).prop('checked');
        if (Config.autoSaveArmsInfoEnabled !== checked) {
            (0, _Config.read)();
            Config.autoSaveArmsInfoEnabled = checked;
            (0, _Config.write)();
        }
    }).end().find('[name="clearMsg"]').click(Msg.destroy).end().find('[name="openAllBoxes"]').click(showOpenAllBoxesDialog);
    Public.addSlowActionChecked($('.pd_item_btns[data-name="openBoxesBtns"]'));
};

/**
 * 显示一键开盒对话框
 */
const showOpenAllBoxesDialog = function () {
    const dialogName = 'pdOpenAllBoxesDialog';
    if ($('#' + dialogName).length > 0) return;
    Msg.destroy();
    (0, _Config.read)();

    let boxTypesOptionHtml = '';
    for (let boxName of boxTypeList.slice(0, 4)) {
        boxTypesOptionHtml += `<option>${boxName}</option>`;
    }

    let armTypesCheckedHtml = '';
    for (let group of armGroupList) {
        armTypesCheckedHtml += `<li><b>${group}：</b>`;
        for (let type of armTypeList) {
            let prefix = type.split('的')[0];
            if (prefix === '神秘') continue;
            let name = `${prefix}的${group}`;
            armTypesCheckedHtml += `
<label style="margin-right: 5px;">
  <input type="checkbox" name="smeltArmsType" value="${name}" ${Config.defSmeltArmTypeList.includes(name) ? 'checked' : ''}> ${prefix}
</label>`;
        }
        armTypesCheckedHtml += '</li>';
    }

    let itemTypesOptionHtml = '';
    for (let itemName of itemTypeList.slice(6)) {
        itemTypesOptionHtml += `<option>${itemName}</option>`;
    }

    let html = `
<div class="pd_cfg_main">
  <fieldset style="margin-top: 5px;">
    <legend>请选择想批量打开的盒子种类（按<b>Ctrl键</b>或<b>Shift键</b>可多选）：</legend>
    <select name="openBoxesTypes" size="4" style="width: 320px;" multiple>${boxTypesOptionHtml}</select>
  </fieldset>
  <div style="margin-top: 5px;"><b>请选择批量打开盒子后想要进行的操作（如无需操作可不用勾选）：</b></div>
  <fieldset>
    <legend>
      <label><input name="smeltArmsAfterOpenBoxesEnabled" type="checkbox"> 熔炼装备</label>
    </legend>
    <div>请选择想批量熔炼的装备种类：</div>
    <ul data-name="smeltArmTypeList">${armTypesCheckedHtml}</ul>
    <div>
      <a class="pd_btn_link" href="#" data-name="selectAll">全选</a>
      <a class="pd_btn_link" href="#" data-name="selectInverse">反选</a>
    </div>
  </fieldset>
  <fieldset>
    <legend>
      <label><input name="useItemsAfterOpenBoxesEnabled" type="checkbox"> 使用道具</label>
    </legend>
    <div>请选择想批量使用的道具种类（按<b>Ctrl键</b>或<b>Shift键</b>可多选）：</div>
    <select name="useItemTypes" size="6" style="width: 320px;" multiple>${itemTypesOptionHtml}</select>
  </fieldset>
  <fieldset>
    <legend>
      <label><input name="sellItemsAfterOpenBoxesEnabled" type="checkbox"> 出售道具</label>
    </legend>
    <div>请选择想批量出售的道具种类（按<b>Ctrl键</b>或<b>Shift键</b>可多选）：</div>
    <select name="sellItemTypes" size="6" style="width: 320px;" multiple>${itemTypesOptionHtml}</select>
  </fieldset>
</div>
<div class="pd_cfg_btns">
  <button name="open" type="button" style="color: #f00;">一键开盒</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '一键开盒', html);
    let $smeltArmTypeList = $dialog.find('ul[data-name="smeltArmTypeList"]');

    $dialog.find('[name="open"]').click(function () {
        (0, _Config.read)();
        let tmpBoxTypeList = $dialog.find('select[name="openBoxesTypes"]').val();
        if (!Array.isArray(tmpBoxTypeList)) tmpBoxTypeList = [];
        Config.defOpenBoxTypeList = tmpBoxTypeList;

        $dialog.find('legend [type="checkbox"]').each(function () {
            let $this = $(this);
            let name = $this.attr('name');
            if (name in Config) {
                Config[name] = Boolean($this.prop('checked'));
            }
        });

        if (Config.smeltArmsAfterOpenBoxesEnabled) {
            let typeList = [];
            $smeltArmTypeList.find('input[name="smeltArmsType"]:checked').each(function () {
                typeList.push($(this).val());
            });
            if (typeList.length > 0) Config.defSmeltArmTypeList = typeList;else Config.smeltArmsAfterOpenBoxesEnabled = false;
        }
        if (Config.useItemsAfterOpenBoxesEnabled) {
            let typeList = $dialog.find('select[name="useItemTypes"]').val();
            if (Array.isArray(typeList)) Config.defUseItemTypeList = typeList;else Config.useItemsAfterOpenBoxesEnabled = false;
        }
        if (Config.sellItemsAfterOpenBoxesEnabled) {
            let typeList = $dialog.find('select[name="sellItemTypes"]').val();
            if (Array.isArray(typeList)) Config.defSellItemTypeList = typeList;else Config.sellItemsAfterOpenBoxesEnabled = false;
        }

        (0, _Config.write)();
        if (!Config.defOpenBoxTypeList.length) {
            alert('未选择盒子种类');
            return;
        }
        if (!confirm('是否一键开盒（并执行所选操作）？')) return;
        Dialog.close(dialogName);
        if (!Config.sortArmsByGroupEnabled && !Config.autoSaveArmsInfoEnabled) {
            $armArea.find('> tbody > tr:nth-child(2)').after('<tr><td colspan="3" style="color: #777;">以上为新装备</td></tr>');
        }
        $(document).clearQueue('OpenAllBoxes');
        $boxArea.find('> tbody > tr:nth-child(2) > td').each(function (index) {
            let $this = $(this);
            let boxType = $this.find('span:first').text().trim() + '盒子';
            if (!Config.defOpenBoxTypeList.includes(boxType)) return;
            let num = parseInt($this.find('span:last').text());
            if (!num || num < 0) return;
            let id = parseInt($boxArea.find(`> tbody > tr:nth-child(3) > td:nth-child(${index + 1}) > a[data-name="openBoxes"]`).data('id'));
            if (!id) return;
            $(document).queue('OpenAllBoxes', () => openBoxes({ id, boxType, num, safeId, nextActionEnabled: true }));
        });
        $(document).dequeue('OpenAllBoxes');
    }).end().find('a[data-name="selectAll"]').click(() => Util.selectAll($smeltArmTypeList.find('input[name="smeltArmsType"]'))).end().find('a[data-name="selectInverse"]').click(() => Util.selectInverse($smeltArmTypeList.find('input[name="smeltArmsType"]')));

    $dialog.on('keydown', 'select[name$="Types"]', function (e) {
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            $(this).children().prop('selected', true);
        }
    }).find('legend [type="checkbox"]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            $this.prop('checked', Config[name] === true);
        }
    });

    $dialog.find('select[name$="Types"]').each(function (index) {
        let $this = $(this);
        let typeList = Config.defOpenBoxTypeList;
        if (index === 1) typeList = Config.defUseItemTypeList;else if (index === 2) typeList = Config.defSellItemTypeList;
        $this.find('option').each(function () {
            let $this = $(this);
            if (typeList.includes($this.val())) {
                $this.prop('selected', true);
            }
        });
    });

    Dialog.show(dialogName);
    Script.runFunc('Item.showOpenAllBoxes_after_');
};

/**
 * 打开盒子
 * @param {number} id 盒子类型ID
 * @param {string} boxType 盒子类型名称
 * @param {number} num 打开盒子数量
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const openBoxes = function ({ id, boxType, num, safeId, nextActionEnabled = false }) {
    let successNum = 0,
        failNum = 0,
        index = 0;
    let randomTotalNum = 0,
        randomTotalCount = 0;
    let isStop = false;
    let stat = { 'KFB': 0, '经验值': 0, '道具': 0, '装备': 0, item: {}, arm: {} };

    /**
     * 打开
     */
    const open = function () {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=3&id=${id}&safeid=${safeId}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            index++;
            let msg = Util.removeHtmlTag(html);
            if (msg.includes('获得')) {
                successNum++;
                let matches = /获得\[(\d+)]KFB/.exec(msg);
                if (matches) stat['KFB'] += parseInt(matches[1]);

                matches = /获得\[(\d+)]经验值/.exec(msg);
                if (matches) stat['经验值'] += parseInt(matches[1]);

                matches = /打开盒子获得了道具\[\s*(.+?)\s*]/.exec(msg);
                if (matches) {
                    stat['道具']++;
                    let itemName = matches[1];
                    if (!(itemName in stat.item)) stat.item[itemName] = 0;
                    stat.item[itemName]++;
                }

                matches = /获得一件\[(.+?)]的?装备/.exec(msg);
                if (matches) {
                    stat['装备']++;
                    let armType = matches[1] + '装备';
                    if (!(armType in stat.arm)) stat.arm[armType] = 0;
                    stat.arm[armType]++;
                }

                matches = /随机值(\d+)/.exec(msg);
                if (matches) {
                    randomTotalCount++;
                    randomTotalNum += parseInt(matches[1]);
                }
            } else if (msg.includes('操作过快')) {
                $(document).queue('OpenBoxes', open);
            } else if (msg.includes('盒子不足')) {
                $(document).clearQueue('OpenBoxes');
                isStop = true;
            } else {
                failNum++;
            }

            console.log(`第${index}次：${msg}`);
            $('.pd_result[data-name="boxResult"]:last').append(`<li><b>第${index}次：</b>${msg}</li>`);
            Script.runFunc('Item.openBoxes_success_', msg);
        }).fail(function () {
            failNum++;
        }).always(function () {
            let length = $(document).queue('OpenBoxes').length;
            let $countdown = $('.pd_countdown:last');
            $countdown.text(length);
            let isPause = $countdown.closest('.pd_msg').data('stop');
            isStop = isStop || isPause;
            if (isPause) {
                $(document).clearQueue('OpenAllBoxes');
                nextActionEnabled = false;
            }

            if (isStop || !length) {
                Msg.remove($wait);
                let avgRandomNum = randomTotalCount > 0 ? Util.getFixedNumLocStr(randomTotalNum / randomTotalCount, 2) : 0;
                for (let [key, value] of Util.entries(stat)) {
                    if (!value || $.type(value) === 'object' && $.isEmptyObject(value)) {
                        delete stat[key];
                    }
                }
                if (!$.isEmptyObject(stat)) {
                    Log.push('打开盒子', `共有\`${successNum}\`个【\`${boxType}\`】打开成功 (平均随机值【\`${avgRandomNum}\`】)`, {
                        gain: stat,
                        pay: { '盒子': -successNum }
                    });
                }

                let $currentNum = $boxArea.find(`> tbody > tr:nth-child(2) > td:nth-child(${id}) > span:last`);
                let prevNum = parseInt($currentNum.text());
                if (prevNum > 0) {
                    $currentNum.text(prevNum - successNum);
                }

                let resultStatHtml = '',
                    msgStatHtml = '';
                for (let [key, value] of Util.entries(stat)) {
                    let tmpHtml = '';
                    if ($.type(value) === 'object') {
                        resultStatHtml += resultStatHtml ? '<br>' : '';
                        msgStatHtml += msgStatHtml ? '<br>' : '';
                        resultStatHtml += `${key === 'item' ? '道具' : '装备'}：`;

                        let typeList = key === 'item' ? itemTypeList : armTypeList;
                        for (let name of Util.getSortedObjectKeyList(typeList, value)) {
                            tmpHtml += `<i>${name}<em>+${value[name].toLocaleString()}</em></i> `;
                        }
                    } else {
                        tmpHtml += `<i>${key}<em>+${value.toLocaleString()}</em></i> `;
                    }
                    resultStatHtml += tmpHtml;
                    msgStatHtml += tmpHtml.trim();
                }
                if (msgStatHtml.length < 200) {
                    msgStatHtml = msgStatHtml.replace(/(.*)<br>/, '$1');
                }
                $('.pd_result[data-name="boxResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（平均随机值【<em>${avgRandomNum}</em>】）：</b><br>
  ${resultStatHtml ? resultStatHtml : '无'}
</li>
`);
                console.log(`共有${successNum}个【${boxType}】打开成功（平均随机值【${avgRandomNum}】）${failNum > 0 ? `，共有${failNum}个盒子打开失败` : ''}`);
                Msg.show(`<strong>共有<em>${successNum}</em>个【${boxType}】打开成功（平均随机值【<em>${avgRandomNum}</em>】）` + `${failNum > 0 ? `，共有<em>${failNum}</em>个盒子打开失败` : ''}</strong>${msgStatHtml.length > 25 ? '<br>' + msgStatHtml : msgStatHtml}`, -1);

                Script.runFunc('Item.openBoxes_after_', stat);
                setTimeout(() => getNextObjects(1), _Const2.default.defAjaxInterval);
                if ($(document).queue('OpenAllBoxes').length > 0) {
                    setTimeout(() => $(document).dequeue('OpenAllBoxes'), typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
                } else if (nextActionEnabled) {
                    let action = null;
                    if (Config.smeltArmsAfterOpenBoxesEnabled) {
                        action = () => smeltArms({ typeList: Config.defSmeltArmTypeList, safeId, nextActionEnabled });
                    } else if (Config.useItemsAfterOpenBoxesEnabled) {
                        action = () => useItems({ typeList: Config.defUseItemTypeList, safeId, nextActionEnabled });
                    } else if (Config.sellItemsAfterOpenBoxesEnabled) {
                        action = () => sellItems({ typeList: Config.defSellItemTypeList, safeId, nextActionEnabled });
                    }
                    if (action) {
                        setTimeout(action, _Const2.default.minActionInterval);
                    }
                }
            } else {
                if (index % 10 === 0) {
                    setTimeout(() => getNextObjects(1), _Const2.default.defAjaxInterval);
                }
                setTimeout(() => $(document).dequeue('OpenBoxes'), typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
            }
        });
    };

    $boxArea.parent().append(`<ul class="pd_result" data-name="boxResult"><li><strong>【${boxType}】打开结果：</strong></li></ul>`);
    let $wait = Msg.wait(`<strong>正在打开盒子中&hellip;</strong><i>剩余：<em class="pd_countdown">${num}</em></i><a class="pd_stop_action" href="#">停止操作</a>`);
    $(document).clearQueue('OpenBoxes');
    $.each(new Array(num), function () {
        $(document).queue('OpenBoxes', open);
    });
    $(document).dequeue('OpenBoxes');
};

// 保存我的装备信息的键值名称
const myArmsInfoName = _Const2.default.storagePrefix + 'myArmsInfo2';

/**
 * 读取我的装备信息
 * @returns {{}} 装备信息对象
 */
const readArmsInfo = exports.readArmsInfo = function () {
    let info = { '已装备武器': 0, '已装备护甲': 0, '装备列表': {} };
    let options = Util.readData(myArmsInfoName + '_' + _Info2.default.uid);
    if (!options) return info;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return info;
    }
    if (!options || $.type(options) !== 'object' || $.type(options['装备列表']) !== 'object') return info;
    info = options;
    return info;
};

/**
 * 写入我的装备信息
 * @param {{}} info 装备信息对象
 */
const writeArmsInfo = exports.writeArmsInfo = info => Util.writeData(myArmsInfoName + '_' + _Info2.default.uid, JSON.stringify(info));

/**
 * 清除我的装备信息
 */
const clearArmsInfo = exports.clearArmsInfo = () => Util.deleteData(myArmsInfoName + '_' + _Info2.default.uid);

/**
 * 添加已保存的我的装备信息
 * @param {jQuery} $armArea 装备区域节点
 */
const addSavedArmsInfo = exports.addSavedArmsInfo = function ($armArea) {
    let armsInfo = readArmsInfo();
    let addHtml = '';
    for (let armId of Object.keys(armsInfo['装备列表']).reverse()) {
        if (!$armArea.find(`[id="wp_${armId}"]`).length) {
            addHtml += armsInfo['装备列表'][armId].replace(/(<tr(?: id="wp_\d+")?)>/, '$1 data-saved="true">');
        }
    }
    $armArea.find('> tbody > tr:last-child').before(addHtml);
};

/**
 * 移除指定ID的已保存的装备信息
 * @param armId 装备ID
 * @param {jQuery} $armArea 装备区域节点
 */
const removeSavedArmInfo = function (armId, $armArea) {
    let armsInfo = readArmsInfo();
    delete armsInfo['装备列表'][armId];
    writeArmsInfo(armsInfo);
    $armArea.find(`tr[data-id="${armId}"]`).replaceWith('<tr><td colspan="3" style="color: #777;">该装备不存在</td></tr>');
};

/**
 * 处理装备区域
 * @param {jQuery} $armArea 装备区域节点
 * @param {number} type 页面类型，0：我的物品页面；1：争夺首页点数分配对话框
 */
const handleArmArea = exports.handleArmArea = function ($armArea, type = 0) {
    $armArea.find('a[onclick^="cdzb"]').removeAttr('onclick').attr('data-name', 'equip');
    $armArea.find('a[onclick^="rlzb"]').removeAttr('onclick').attr('data-name', 'smelt');

    $armArea.find('tr[id^="wp_"]').each(function () {
        let $this = $(this);
        let id = $this.attr('id');
        let $td = $this.find('td');
        $td.removeAttr('colspan').removeAttr('style').css({ 'text-align': 'left', 'padding-left': '5px' });
        $td.html($td.html().replace('（装备中）', ''));
        $this.removeAttr('id').prepend(`<td id="${id}"><a data-name="equip" href="javascript:;">装备</a></td><td><a data-name="smelt" href="javascript:;">熔炼</a></td>`).addClass('pd_arm_equipped');
    });

    $armArea.find('tr:not([data-id]) > td[id^="wp_"]').each(function () {
        let $this = $(this);
        let matches = /wp_(\d+)/.exec($this.attr('id'));
        if (!matches) return;
        let id = parseInt(matches[1]);
        let $tr = $this.parent('tr');
        let $td = $tr.find('> td:nth-child(3)');
        let html = $td.html();
        let armInfo = getArmInfo(html);
        $tr.attr('data-id', id).attr('data-class', armInfo['类别']).attr('data-group', armInfo['组别']);
        $td.html(handleUselessSubProperties(html));
        if (Config.armsMemo[id]) {
            $td.attr('data-memo', Config.armsMemo[id].replace(/"/g, ''));
        }
        if (type === 0) {
            $this.prepend(`<input name="armCheck" type="checkbox" value="${id}">`);
        }
    });

    if (Config.sortArmsByGroupEnabled) {
        sortArmsByGroup($armArea);
    }

    if (Config.autoSaveArmsInfoEnabled) {
        if (!Config.sortArmsByGroupEnabled) {
            sortArmsById($armArea);
        }

        let armsInfo = readArmsInfo();
        let realEquippedWeaponId = parseInt($armArea.find('.pd_arm_equipped[data-class="武器"]:not([data-saved="true"])').data('id'));
        let realEquippedArmorId = parseInt($armArea.find('.pd_arm_equipped[data-class="护甲"]:not([data-saved="true"])').data('id'));
        let flag = false;
        if (realEquippedWeaponId > 0 && armsInfo['已装备武器'] !== realEquippedWeaponId) {
            flag = true;
            armsInfo['已装备武器'] = realEquippedWeaponId;
        }
        if (realEquippedArmorId > 0 && armsInfo['已装备护甲'] !== realEquippedArmorId) {
            flag = true;
            armsInfo['已装备护甲'] = realEquippedArmorId;
        }
        if (flag) {
            writeArmsInfo(armsInfo);
        }
        $armArea.find(`.pd_arm_equipped[data-saved="true"][data-class="武器"]:not([data-id="${armsInfo['已装备武器']}"])`).removeClass('pd_arm_equipped');
        $armArea.find(`.pd_arm_equipped[data-saved="true"][data-class="护甲"]:not([data-id="${armsInfo['已装备护甲']}"])`).removeClass('pd_arm_equipped');
        if (!$armArea.find('.pd_arm_equipped[data-class="武器"]').length) {
            $armArea.find(`tr[data-id="${armsInfo['已装备武器']}"]`).addClass('pd_arm_equipped');
        }
        if (!$armArea.find('.pd_arm_equipped[data-class="护甲"]').length) {
            $armArea.find(`tr[data-id="${armsInfo['已装备护甲']}"]`).addClass('pd_arm_equipped');
        }
    }

    if (type === 1) {
        $armArea.find('a[data-name="equip"]').attr('data-name', 'add').text('加入');
    }

    Script.runFunc('Item.handleArmArea_after_', { $armArea, type });
};

/**
 * 分组排列装备
 * @param {jQuery} $armArea 装备区域节点
 */
const sortArmsByGroup = exports.sortArmsByGroup = function ($armArea) {
    for (let armGroup of armGroupList) {
        $armArea.find(`tr[data-group="${armGroup}"]`).insertAfter($armArea.find('tr:nth-child(2)'));
    }
};

/**
 * 按ID顺序排列装备
 * @param {jQuery} $armArea 装备区域节点
 */
const sortArmsById = exports.sortArmsById = function ($armArea) {
    let armIdList = [];
    $armArea.find('tr[data-id]').each(function () {
        armIdList.push(parseInt($(this).data('id')));
    });
    armIdList.sort((a, b) => a - b);
    for (let armId of armIdList) {
        $armArea.find(`tr[data-id="${armId}"]`).insertAfter($armArea.find('tr:nth-child(2)'));
    }
};

/**
 * 绑定装备点击事件
 * @param {jQuery} $armArea 装备区域节点
 * @param {string} safeId SafeID
 * @param {number} type 页面类型，0：我的物品页面；1：争夺首页
 */
const bindArmLinkClickEvent = exports.bindArmLinkClickEvent = function ($armArea, safeId, type = 0) {
    $armArea.on('click', 'a[data-name="equip"]', function () {
        let $this = $(this);
        let $tr = $this.closest('tr');
        let armId = parseInt($tr.data('id'));
        let armClass = $tr.data('class');
        $.post('kf_fw_ig_mybpdt.php', `do=4&id=${armId}&safeid=${safeId}`, function (html) {
            let msg = Util.removeHtmlTag(html);
            if (/装备完毕/.test(msg)) {
                $armArea.find(`.pd_arm_equipped[data-class="${armClass}"]`).removeClass('pd_arm_equipped');
                $this.closest('tr').addClass('pd_arm_equipped');
                if (Config.autoSaveArmsInfoEnabled) {
                    let armsInfo = readArmsInfo();
                    armsInfo[`已装备${armClass}`] = armId;
                    writeArmsInfo(armsInfo);
                }
                if (type === 1) {
                    let $wait = Msg.wait('<strong>正在获取争夺首页信息&hellip;</strong>');
                    Loot.updateLootInfo(function () {
                        Msg.remove($wait);
                        Dialog.close('pdChangeArmDialog');
                        let $armId = $('input[name="armId"]:first');
                        let $armMemo = $('input[name="armMemo"]:first');
                        $armId.val(armId);
                        $armMemo.val($('#pdArmArea > span:first').text().trim());
                        $('.pd_arm_input').each(function () {
                            $(this).val('');
                            this.defaultValue = '';
                        });
                    });
                }
            } else {
                if (Config.autoSaveArmsInfoEnabled && msg === '错误的编号') {
                    removeSavedArmInfo(armId, $armArea);
                }
                alert(msg);
            }
        });
    }).on('click', 'a[data-name="smelt"]', function () {
        if (!confirm('确定熔炼此装备吗？')) return;
        let $this = $(this);
        let armId = parseInt($this.closest('tr').data('id'));
        $.post('kf_fw_ig_mybpdt.php', `do=5&id=${armId}&safeid=${safeId}`, function (html) {
            let msg = Util.removeHtmlTag(html);
            if (/装备消失/.test(msg)) {
                $this.closest('tr').replaceWith(`<tr><td colspan="3">${msg}</td></tr>`);
                if (armId in Config.armsMemo) {
                    (0, _Config.read)();
                    delete Config.armsMemo[armId];
                    (0, _Config.write)();
                }
                if (Config.autoSaveArmsInfoEnabled) {
                    removeSavedArmInfo(armId, $armArea);
                }
            } else {
                if (Config.autoSaveArmsInfoEnabled && msg === '错误的编号') {
                    removeSavedArmInfo(armId, $armArea);
                }
                alert(msg);
            }
        });
    }).on('click', 'a[data-name="add"]', function () {
        let $tr = $(this).closest('tr');
        let armId = parseInt($tr.data('id'));
        let armClass = $tr.data('class');
        let armInfo = getArmInfo($tr.find('> td:nth-child(3)').html());
        $('#pdAddArmDialog').parent().hide();
        if (armClass === '武器') {
            $('#pdAddWeaponMemo').val(armInfo['名称']);
            $('#pdAddWeaponId').val(armId).focus();
        } else if (armClass === '护甲') {
            $('#pdAddArmorMemo').val(armInfo['名称']);
            $('#pdAddArmorId').val(armId).focus();
        }
    }).on('mouseenter', 'tr[data-id]', function () {
        let $td = $(this).find('> td:nth-child(3)');
        $td.append('<a class="show_arm_info" data-name="showArmInfo" href="#" title="查看装备信息">查</a>');
    }).on('mouseleave', 'tr[data-id]', function () {
        $(this).find('> td:nth-child(3) .show_arm_info').remove();
    }).on('click', '.show_arm_info', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $td = $(this).parent('td');
        let $tr = $this.closest('tr');
        let id = parseInt($tr.data('id'));
        $this.remove();
        let html = $td.html();
        let armInfo = getArmInfo(html);
        showArmInfoDialog(id, armInfo, $armArea);
    });
};

/**
 * 显示装备信息对话框
 * @param {number} armId 装备ID
 * @param {{}} armInfo 装备信息
 * @param {jQuery} $armArea 装备区域节点
 */
const showArmInfoDialog = function (armId, armInfo, $armArea) {
    const dialogName = 'pdArmInfoDialog';
    if ($('#' + dialogName).length > 0) return;
    Msg.destroy();

    let html = `
<div class="pd_cfg_main">
  <div style="width: 550px; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid #99f;">
    <span style="color: ${armInfo['颜色']}">${armInfo['名称']}</span> - ${armInfo['描述']}
  </div>
  <div style="margin-top: 5px;">
    <label>装备ID：<input name="armId" type="text" value="${armId}" style="width: 100px;" readonly></label>
    <a class="pd_btn_link" data-name="copy" data-target="[name=armId]" href="#">复制</a>
  </div>
  <div style="margin-top: 5px;">
    <label>装备参数设置：</label>
    <a class="pd_btn_link" data-name="copy" data-target="[name=armParameterSetting]" href="#">复制</a><br>
    <textarea name="armParameterSetting" rows="6" style="width: 550px;" wrap="off" style="white-space: pre;" readonly></textarea>
  </div>
  <div style="margin-top: 5px;">
    <label>
      装备备注：<input name="armMemo" type="text" maxlength="100" style="width: 200px;">
    </label>
  </div>
</div>
<div class="pd_cfg_btns">
  <button name="saveMemo" type="submit">保存备注</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '装备信息', html, 'z-index: 1003;');

    $dialog.on('click', 'a[data-name="copy"]', function (e) {
        e.preventDefault();
        let $target = $dialog.find($(this).data('target'));
        if (!Util.copyText($target)) {
            $target.select().focus();
        }
        Script.runFunc('Item.showArmInfoDialog_copy_');
    }).submit(function (e) {
        e.preventDefault();
        (0, _Config.read)();
        let value = $.trim($dialog.find('input[name="armMemo"]').val());
        let $node = $armArea.find(`tr[data-id="${armId}"] > td:nth-child(3)`);
        if (value) {
            Config.armsMemo[armId] = value;
            $node.attr('data-memo', value.replace(/"/g, ''));
        } else {
            delete Config.armsMemo[armId];
            $node.removeAttr('data-memo');
        }
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $dialog.find('textarea[name="armParameterSetting"]').val(getArmParameterSetting(armId, armInfo));
    if (Config.armsMemo[armId]) {
        $dialog.find('input[name="armMemo"]').val(Config.armsMemo[armId]);
    }
    Dialog.show(dialogName);
    Script.runFunc('Item.showArmInfoDialog_after_');
};

// 装备属性关键词列表
const armPropertyKeyList = new Map([['增加攻击力', 'ATK'], ['增加暴击伤害', 'CRT'], ['增加技能伤害', 'SKL'], ['穿透对方意志', 'BRC'], ['生命夺取', 'LCH'], ['增加速度', 'SPD'], ['攻击', 'ATK'], ['暴击', 'CRT'], ['技能', 'SKL'], ['穿透', 'BRC'], ['吸血', 'LCH'], ['速度', 'SPD'], ['被攻击回血100+', 'HEL'], ['获得无护甲魔法盾500+', 'SLD'], ['每减少5%生命值获得额外意志', 'AMR'], ['反弹对方实际伤害15%+', 'RFL'], ['减少来自暴击的伤害10%+', 'CRD'], ['减少来自技能的伤害10%+', 'SRD'], ['回血', 'HEL'], ['护盾', 'SLD'], ['加防', 'AMR'], ['反伤', 'RFL'], ['暴减', 'CRD'], ['技减', 'SRD']]);

/**
 * 获取计算器装备参数设置
 * @param {number} armId 装备ID
 * @param {{}} armInfo 装备信息
 * @returns {string} 装备参数设置
 */
const getArmParameterSetting = exports.getArmParameterSetting = function (armId, armInfo) {
    let info = {
        '组别': '',
        '装备ID': '',
        '神秘属性数量': 0,
        '所有的神秘属性': '',
        '主属性数量': 0,
        '所有的主属性': '',
        '从属性数量': 0,
        '所有的从属性': ''
    };

    let groupKeyList = new Map([['长剑', 'Sword'], ['短弓', 'Bow'], ['法杖', 'Staff'], ['铠甲', 'Plate'], ['皮甲', 'Leather'], ['布甲', 'Cloth']]);
    info['组别'] = groupKeyList.get(armInfo['组别']);
    info['装备ID'] = '#' + armId;

    let smKeyList = new Map([['火神秘', 'FMT'], ['雷神秘', 'LMT'], ['风神秘', 'AMT'], ['冰霜神秘', 'IMT'], ['尖刺神秘', 'TMT'], ['仇恨神秘', 'HMT']]);
    for (let [key, value] of smKeyList) {
        if (key in armInfo) {
            info['神秘属性数量']++;
            info['所有的神秘属性'] += value + ' ';
        }
    }

    for (let value of armInfo['主属性']) {
        let [property = ''] = value.split('(', 1);
        property = property.trim();
        if (property) {
            info['主属性数量']++;
            info['所有的主属性'] += armPropertyKeyList.get(property) + ' ';
        }
    }

    let subPropertyKeyList = new Map([['系数(x3)', 'COF'], ['力量', 'STR'], ['敏捷', 'AGI'], ['智力', 'INT'], ['体质', 'VIT'], ['灵活', 'DEX'], ['意志', 'RES']]);
    for (let value of armInfo['从属性']) {
        value = $.trim(value);
        if (!value) continue;
        let matches = /(?:\[.])?(\S+?)\((\S+?)x([\d\.]+)%\)/.exec(value);
        if (matches) {
            info['从属性数量']++;
            info['所有的从属性'] += armPropertyKeyList.get(matches[1]) + ' ' + subPropertyKeyList.get(matches[2]) + ' ' + Math.floor(parseFloat(matches[3]) * 10) + ' ';
        }
    }

    let content = `
[组别] [装备ID]
[神秘属性数量] [所有的神秘属性]
[主属性数量] [所有的主属性]
[从属性数量] [所有的从属性]
`.trim();
    for (let [key, value] of Util.entries(info)) {
        content = content.replace(`[${key}]`, $.trim(value));
    }
    return content;
};

/**
 * 处理无用的从属性
 * @param {string} html 装备的HTML代码
 * @returns {string} 处理后的HTML代码
 */
const handleUselessSubProperties = exports.handleUselessSubProperties = function (html) {
    let armInfo = getArmInfo(html);
    let keyList = [];
    for (let value of armInfo['主属性']) {
        let [property = ''] = value.split('(', 1);
        if (property) {
            keyList.push(armPropertyKeyList.get(property));
        }
    }

    let matches = /从属性：(.+?)(<br(?: \/)?>|$)/.exec(html);
    if (matches) {
        let subPropertiesHtml = '';
        for (let value of matches[1].split('。')) {
            if (!value) continue;
            let subMatches = /([^<>]+?)\(/.exec(value);
            if (subMatches) {
                let property = subMatches[1];
                if (!keyList.includes(armPropertyKeyList.get(property))) {
                    value = `<span class="pd_useless_sub_property">${value}</span>`;
                }
            }
            subPropertiesHtml += value + '。';
        }
        html = html.replace(matches[0], '从属性：' + subPropertiesHtml + matches[2]);
    }

    return html;
};

/**
 * 添加装备相关按钮
 */
const addArmsButton = function () {
    $(`
<div class="pd_item_btns" data-name="handleArmBtns">
  <button name="clearArmsInfo" type="button" style="color: #f00;" title="清除已保存的装备信息及备注">清除信息</button>
  <button name="showArmsFinalAddition" type="button" title="显示当前页面上所有装备的最终加成信息">显示最终加成</button>
  <button name="smeltSelectArms" type="button" style="color: #00f;" title="批量熔炼当前页面上所选的装备">熔炼所选</button>
  <button name="smeltArms" type="button" style="color: #f00;" title="批量熔炼指定种类的装备">批量熔炼</button>
</div>
`).insertAfter($armArea).find('[name="clearArmsInfo"]').click(function () {
        let type = parseInt(prompt('请输入要清除的装备信息类型（1：装备信息；2：装备备注）：'));
        if (!type) return;
        if (type === 2) {
            (0, _Config.read)();
            Config.armsMemo = {};
            (0, _Config.write)();
            alert('所有装备的备注已被清除');
        } else {
            clearArmsInfo();
            alert('在本地保存的装备信息已被清除');
        }
    }).end().find('[name="showArmsFinalAddition"]').click(function () {
        if (!confirm('是否显示当前页面上所有装备的最终加成信息？')) return;
        Msg.destroy();
        let oriEquippedArmList = [];
        let armList = [];
        $armArea.find('tr[data-id]').each(function () {
            let $this = $(this);
            let armId = parseInt($this.data('id'));
            let armClass = $this.data('class');
            if (armId && armClass) {
                armList.push({ armId, armClass });
            }
            if ($this.hasClass('pd_arm_equipped')) {
                oriEquippedArmList.push({ armId, armClass });
            }
        });
        if (oriEquippedArmList.length < 2 && !confirm('未在当前页面上存在已装备的该类别装备，在操作后将装备为该页面上其类别的最后一件装备，是否继续？')) return;
        if (armList.length > 0) {
            showArmsFinalAddition(armList, oriEquippedArmList, safeId);
        }
    }).end().find('[name="smeltSelectArms"]').click(function () {
        let idList = [];
        $armArea.find('input[name="armCheck"]:checked').each(function () {
            idList.push(parseInt($(this).val()));
        });
        if (!idList.length || !confirm(`是否熔炼所选的${idList.length}件装备？`)) return;
        smeltArms({ idList, safeId });
    }).end().find('[name="smeltArms"]').click(() => showBatchSmeltArmsDialog(safeId));
    addCommonArmsButton($('.pd_item_btns[data-name="handleArmBtns"]'), $armArea);
};

/**
 * 添加装备相关的通用按钮
 * @param {jQuery} $area 要添加的区域节点
 * @param {jQuery} $armArea 装备区域节点
 */
const addCommonArmsButton = exports.addCommonArmsButton = function ($area, $armArea) {
    $(`
<label>
  <input name="sortArmsByGroupEnabled" type="checkbox" ${Config.sortArmsByGroupEnabled ? 'checked' : ''}> 分组排列</input>
  <span class="pd_cfg_tips" title="分组排列装备">[?]</span>
</label>
<select name="select" style="vertical-align: middle; margin-bottom: 2px;">
  <option>选择装备</option>
  <option value="selectAll">全选</option>
  <option value="selectInverse">反选</option>
  <option value="selectWeapon">选择武器</option>
  <option value="selectArmor">选择护甲</option>
</select>
<button name="copyArmParameterSetting" type="button" title="复制所选装备的计算器参数设置">复制装备参数</button>
`).prependTo($area).find('[name="sortArmsByGroupEnabled"]').click(function () {
        let checked = $(this).prop('checked');
        if (Config.sortArmsByGroupEnabled !== checked) {
            (0, _Config.read)();
            Config.sortArmsByGroupEnabled = checked;
            (0, _Config.write)();
        }
        if (checked) {
            sortArmsByGroup($armArea);
        } else {
            sortArmsById($armArea);
        }
    }).end().filter('[name="select"]').change(function () {
        let value = $(this).val();
        let $checkboxes = $armArea.find('input[name="armCheck"]');
        if (value === 'selectAll') {
            Util.selectAll($checkboxes);
        } else if (value === 'selectInverse') {
            Util.selectInverse($checkboxes);
        } else if (value === 'selectWeapon') {
            $checkboxes.prop('checked', false);
            Util.selectInverse($armArea.find('tr[data-class="武器"] input[name="armCheck"]'));
        } else if (value === 'selectArmor') {
            $checkboxes.prop('checked', false);
            Util.selectInverse($armArea.find('tr[data-class="护甲"] input[name="armCheck"]'));
        }
        this.selectedIndex = 0;
    }).end().filter('[name="copyArmParameterSetting"]').click(function () {
        let $this = $(this);
        let armInfoList = [];
        $armArea.find('input[name="armCheck"]:checked').each(function () {
            let $this = $(this);
            let id = parseInt($this.val());
            let html = $this.closest('tr').find('> td:nth-child(3)').html();
            if (!html) return;
            armInfoList.push({ id: id, info: getArmInfo(html) });
        });
        if (!armInfoList.length) return;
        let copyData = '';
        for (let { id, info } of armInfoList) {
            copyData += getArmParameterSetting(id, info) + '\n\n';
        }
        $this.data('copy-text', copyData.trim());
        console.log('所选装备的计算器装备参数设置：\n\n' + copyData.trim());
        if (!Util.copyText($this, '所选装备的计算器装备参数设置已复制')) {
            alert('你的浏览器不支持复制，请打开Web控制台查看');
        }
    });
    Script.runFunc('Item.addCommonArmsButton_after_');
};

/**
 * 显示装备最终加成信息
 * @param {Object[]} armList 装备列表
 * @param {Object[]} oriEquippedArmList 原先的装备列表
 * @param {string} safeId SafeID
 */
const showArmsFinalAddition = function (armList, oriEquippedArmList, safeId) {
    let index = 0;

    /**
     * 装备
     * @param {number} armId 装备ID
     * @param {string} armClass 装备类别
     * @param {boolean} isComplete 是否操作完成
     * @param {function} callback 回调函数
     */
    const equip = function ({ armId, armClass }, isComplete = false, callback = null) {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=4&id=${armId}&safeid=${safeId}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            let msg = Util.removeHtmlTag(html);
            console.log(`【装备ID[${armId}]，装备类别[${armClass}]】：${msg.replace('\n', ' ')}`);
            if (isComplete) {
                if (typeof callback === 'function') callback();
                return;
            }
            if (!/装备完毕/.test(msg)) {
                index++;
                if (Config.autoSaveArmsInfoEnabled && msg === '错误的编号') {
                    removeSavedArmInfo(armId, $armArea);
                }
            }
            if (index >= armList.length) {
                complete();
                return;
            }
            if (!/装备完毕/.test(msg)) {
                setTimeout(() => equip(armList[index]), _Const2.default.minActionInterval);
            } else {
                setTimeout(() => getFinalAddition({ armId, armClass }), _Const2.default.defAjaxInterval);
            }
        }).fail(() => setTimeout(() => equip({ armId, armClass }, isComplete, callback), _Const2.default.minActionInterval));
    };

    /**
     * 获取当前装备的最终加成
     * @param {number} armId 装备ID
     * @param {string} armClass 装备类别
     */
    const getFinalAddition = function ({ armId, armClass }) {
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_index.php?t=' + $.now(),
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            $wait.find('.pd_countdown').text(armList.length - (index + 1));
            if ($wait.data('stop')) {
                complete();
                return;
            }

            let matches = armClass === '武器' ? />(攻击伤害\+[^<>]+)</.exec(html) : />(受伤回血\+[^<>]+)</.exec(html);
            if (matches) {
                let info = matches[1];
                console.log(`【装备ID[${armId}]，装备类别[${armClass}]】：${info}`);
                let $armInfo = $armArea.find(`tr[data-id="${armId}"]`).find('td:nth-child(3)');
                $armInfo.find('.pd_final_addition_info').remove();
                $armInfo.append(`<span class="pd_final_addition_info" title="最终加成：${info}"><br>最终加成：${info}</span>`);
            }

            index++;
            if (index >= armList.length) {
                complete();
                return;
            }
            setTimeout(() => equip(armList[index]), _Const2.default.minActionInterval);
            Script.runFunc('Item.showArmsFinalAddition_show_', { armId, armClass });
        }).fail(() => setTimeout(() => getFinalAddition({ armId, armClass }), _Const2.default.defAjaxInterval));
    };

    /**
     * 操作完成
     */
    const complete = function () {
        Msg.remove($wait);
        if (oriEquippedArmList.length > 0) {
            let $wait = Msg.wait('<strong>正在还原为之前的装备&hellip;</strong>');
            setTimeout(() => equip(oriEquippedArmList[0], true, function () {
                if (!oriEquippedArmList[1]) {
                    Msg.remove($wait);
                    return;
                }
                setTimeout(() => equip(oriEquippedArmList[1], true, function () {
                    Msg.remove($wait);
                }), _Const2.default.minActionInterval);
            }), _Const2.default.minActionInterval);
        }
        Script.runFunc('Item.showArmsFinalAddition_complete_');
    };

    let $wait = Msg.wait(`<strong>正在获取装备最终加成信息&hellip;</strong><i>剩余：<em class="pd_countdown">${armList.length}</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
    equip(armList[0]);
};

/**
 * 显示批量熔炼装备对话框
 */
const showBatchSmeltArmsDialog = function () {
    const dialogName = 'pdBatchSmeltArmsDialog';
    if ($('#' + dialogName).length > 0) return;
    Msg.destroy();
    (0, _Config.read)();

    let armTypeCheckedHtml = '';
    for (let group of armGroupList) {
        armTypeCheckedHtml += `<li><b>${group}：</b>`;
        for (let type of armTypeList) {
            let prefix = type.split('的')[0];
            if (prefix === '神秘') continue;
            let name = `${prefix}的${group}`;
            armTypeCheckedHtml += `
<label style="margin-right: 5px;">
  <input type="checkbox" name="smeltArmsType" value="${name}" ${Config.defSmeltArmTypeList.includes(name) ? 'checked' : ''}> ${prefix}
</label>`;
        }
        armTypeCheckedHtml += '</li>';
    }

    let html = `
<div class="pd_cfg_main">
  <div>请选择想批量熔炼的装备种类：</div>
  <ul data-name="smeltArmTypeList">${armTypeCheckedHtml}</ul>
</div>
<div class="pd_cfg_btns">
  <button name="selectAll" type="button">全选</button>
  <button name="selectInverse" type="button">反选</button>
  <button name="smelt" type="button" style="color: #f00;">熔炼</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '批量熔炼装备', html);
    let $smeltArmTypeList = $dialog.find('ul[data-name="smeltArmTypeList"]');

    $dialog.find('[name="smelt"]').click(function () {
        let typeList = [];
        $smeltArmTypeList.find('input[name="smeltArmsType"]:checked').each(function () {
            typeList.push($(this).val());
        });
        if (!typeList.length) return;
        (0, _Config.read)();
        Config.defSmeltArmTypeList = typeList;
        (0, _Config.write)();
        if (!confirm('是否熔炼所选装备种类？')) return;
        Dialog.close(dialogName);
        smeltArms({ typeList, safeId });
    }).end().find('[name="selectAll"]').click(() => Util.selectAll($smeltArmTypeList.find('input[name="smeltArmsType"]'))).end().find('[name="selectInverse"]').click(() => Util.selectInverse($smeltArmTypeList.find('input[name="smeltArmsType"]')));

    Dialog.show(dialogName);
    Script.runFunc('Item.showBatchSmeltArmsDialog_after_');
};

/**
 * 熔炼装备
 * @param {string[]} typeList 想要熔炼的装备种类列表
 * @param {number[]} idList 想要熔炼的装备ID列表（用于熔炼所选，不要与typeList一起使用）
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const smeltArms = function ({ typeList = [], idList = [], safeId, nextActionEnabled = false }) {
    let successNum = 0,
        index = 0;
    let smeltInfo = {};
    let isDeleteMemo = false;
    let smeltedArmIdList = [];

    /**
     * 熔炼
     * @param {number} armId 装备ID
     * @param {string} armClass 装备类别
     * @param {string} armGroup 装备组别
     * @param {string} armName 装备名称
     * @param {number} armNum 本轮熔炼的装备数量
     */
    const smelt = function (armId, armClass, armGroup, armName, armNum) {
        index++;
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=5&id=${armId}&safeid=${safeId}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            if (!html) return;
            let msg = Util.removeHtmlTag(html);
            console.log(`【${armName}】 ${msg}`);
            $('.pd_result[data-name="armResult"]:last').append(`<li>【${armName}】 ${msg}</li>`);
            $armArea.find(`td[id="wp_${armId}"]`).parent('tr').fadeOut('normal', function () {
                $(this).remove();
            });
            if (Config.autoSaveArmsInfoEnabled && /装备消失|错误的编号/.test(msg)) {
                smeltedArmIdList.push(armId);
            }

            let matches = /获得对应装备经验\[\+(\d+)]/.exec(msg);
            if (!matches) return;
            successNum++;
            if (armId in Config.armsMemo) {
                isDeleteMemo = true;
                delete Config.armsMemo[armId];
            }
            if (!(armClass in smeltInfo)) smeltInfo[armClass] = {};
            if (!(armGroup in smeltInfo[armClass])) smeltInfo[armClass][armGroup] = { num: 0, exp: 0 };
            smeltInfo[armClass][armGroup].num++;
            smeltInfo[armClass][armGroup].exp += parseInt(matches[1]);
            $wait.find('.pd_countdown').text(successNum);
            Script.runFunc('Item.smeltArms_after_');
        }).fail(function () {
            $('.pd_result[data-name="armResult"]:last').append(`<li>【${armName}】 <span class="pd_notice">连接超时</span></li>`);
        }).always(function () {
            if ($wait.data('stop')) complete();else {
                if (index === armNum) setTimeout(getNextArms, _Const2.default.minActionInterval);else setTimeout(() => $(document).dequeue('SmeltArms'), _Const2.default.minActionInterval);
            }
        });
    };

    /**
     * 获取当前的装备
     */
    const getCurrentArms = function () {
        let armList = [];
        $armArea.find('td[id^="wp_"]').each(function () {
            let $this = $(this);
            let $tr = $this.parent('tr');
            if ($tr.hasClass('pd_arm_equipped')) return;
            let armId = parseInt($tr.data('id'));
            let armName = $tr.find('> td:nth-child(3) > span:first').text().trim();
            let [, armGroup] = armName.split('的');
            let armClass = getArmClassNameByGroupName(armGroup);
            if (armName && armGroup) {
                if (typeList.length > 0 && typeList.includes(armName)) {
                    armList.push({ armId, armClass, armGroup, armName });
                } else if (idList.length > 0 && idList.includes(armId)) {
                    armList.push({ armId, armClass, armGroup, armName });
                }
            }
        });
        if (!armList.length) {
            complete();
            return;
        }

        index = 0;
        $(document).clearQueue('SmeltArms');
        $.each(armList, function (i, { armId, armClass, armGroup, armName }) {
            $(document).queue('SmeltArms', () => smelt(armId, armClass, armGroup, armName, armList.length));
        });
        $(document).dequeue('SmeltArms');
    };

    /**
     * 获取下一批装备
     */
    const getNextArms = function () {
        getNextObjects(2, () => {
            if ($wait.data('stop')) complete();else setTimeout(getCurrentArms, _Const2.default.defAjaxInterval);
        });
    };

    /**
     * 执行后续操作
     */
    const nextAction = function () {
        let action = null;
        if (Config.useItemsAfterOpenBoxesEnabled) {
            action = () => useItems({ typeList: Config.defUseItemTypeList, safeId, nextActionEnabled });
        } else if (Config.sellItemsAfterOpenBoxesEnabled) {
            action = () => sellItems({ typeList: Config.defSellItemTypeList, safeId, nextActionEnabled });
        }
        if (action) {
            setTimeout(action, _Const2.default.minActionInterval);
        }
    };

    /**
     * 清除无效信息
     */
    const clearInfo = function () {
        if (isDeleteMemo) (0, _Config.write)();
        if (Config.autoSaveArmsInfoEnabled) {
            let armsInfo = readArmsInfo();
            for (let armId of smeltedArmIdList) {
                delete armsInfo['装备列表'][armId];
            }
            writeArmsInfo(armsInfo);
        }
    };

    /**
     * 操作完成
     */
    const complete = function () {
        $(document).clearQueue('SmeltArms');
        Msg.remove($wait);
        if ($.isEmptyObject(smeltInfo)) {
            console.log('没有装备被熔炼！');
            clearInfo();
            if (nextActionEnabled) nextAction();
            return;
        }

        let armGroupNum = 0;
        let resultStat = '',
            resultDetailStat = '',
            msgStat = '',
            logStat = '';
        for (let armClass of Util.getSortedObjectKeyList(armClassList, smeltInfo)) {
            resultDetailStat += `<b>【${armClass}】：</b><br>`;
            let armClassNum = 0;
            let gain = {};
            gain[`${armClass}经验`] = 0;
            for (let armGroup of Util.getSortedObjectKeyList(armGroupList, smeltInfo[armClass])) {
                armGroupNum++;
                let { exp, num } = smeltInfo[armClass][armGroup];
                armClassNum += num;
                gain[`${armClass}经验`] += exp;
                resultDetailStat += `&nbsp;&nbsp;【${armGroup}】 <i>装备<ins>-${num}</ins></i> <i>${armClass}经验<em>+${exp.toLocaleString()}</em></i><br>`;
            }
            let commonStat = `<i>${armClass}经验<em>+${gain[`${armClass}经验`].toLocaleString()}</em></i> `;
            resultStat += commonStat;
            msgStat += commonStat.trim();
            logStat += Util.removeHtmlTag(commonStat);
            Log.push('熔炼装备', `共有\`${armClassNum}\`个【\`${armClass}\`】装备熔炼成功`, { gain, pay: { '装备': -armClassNum } });
        }
        $('.pd_result[data-name="armResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（共有<em>${armGroupNum}</em>个组别中的<em>${successNum}</em>个装备熔炼成功）：</b><br>
  ${resultStat}<br>
  ${resultDetailStat}
</li>`);
        console.log(`共有${armGroupNum}个组别中的${successNum}个装备熔炼成功，${logStat}`);
        Msg.show(`<strong>共有<em>${armGroupNum}</em>个组别中的<em>${successNum}</em>个装备熔炼成功</strong>${msgStat}`, -1);

        clearInfo();
        setTimeout(() => getNextObjects(2), _Const2.default.defAjaxInterval);
        if (nextActionEnabled) nextAction();
        Script.runFunc('Item.smeltArms_complete_');
    };

    if (!$.isEmptyObject(Config.armsMemo)) (0, _Config.read)();
    $armArea.parent().append('<ul class="pd_result" data-name="armResult"><li><strong>熔炼结果：</strong></li></ul>');
    let $wait = Msg.wait('<strong>正在熔炼装备中&hellip;</strong><i>已熔炼：<em class="pd_countdown">0</em></i><a class="pd_stop_action" href="#">停止操作</a>');
    getCurrentArms();
};

/**
 * 通过装备组别名获取类别名
 * @param {string} groupName 装备组别名
 * @returns {string} 装备类别名
 */
const getArmClassNameByGroupName = exports.getArmClassNameByGroupName = function (groupName) {
    switch (groupName) {
        case '长剑':
        case '短弓':
        case '法杖':
            return '武器';
        case '铠甲':
        case '皮甲':
        case '布甲':
            return '护甲';
        default:
            return '';
    }
};

/**
 * 获取指定装备情况
 * @param html 装备的HTML代码
 * @returns {{}} 当前装备情况
 */
const getArmInfo = exports.getArmInfo = function (html) {
    let armInfo = {
        '名称': '',
        '颜色': '#000',
        '类别': '',
        '组别': '',
        '描述': '',
        '作用': '',
        '主属性': [],
        '从属性': [],
        '最终加成': []
    };
    let matches = /<span style="color:([^<>]+);">([^<>]+)<\/span>/.exec(html);
    if (!matches) return armInfo;

    armInfo['颜色'] = matches[1];
    armInfo['名称'] = matches[2];
    [, armInfo['组别'] = ''] = matches[2].split('的');
    armInfo['类别'] = getArmClassNameByGroupName(armInfo['组别']);

    [, armInfo['描述'] = ''] = html.split('</span> - ', 2);
    let description = Util.removeHtmlTag(armInfo['描述']);
    [armInfo['作用'] = ''] = description.split('\n', 1);

    matches = /主属性：(.+?)\n/.exec(description);
    if (matches) armInfo['主属性'] = matches[1].split('。');

    matches = /从属性：(.+?)(\n|$)/.exec(description);
    if (matches) armInfo['从属性'] = matches[1].split('。');

    /*matches = /最终加成：(.+?)(\n|$)/.exec(description);
    if (matches) armInfo['最终加成'] = matches[1].split(' | ');*/ // 临时禁用

    let smMatches = description.match(/([^。\s]+神秘)：(.+?)。/g);
    for (let i in smMatches) {
        let subMatches = /([^。\s]+神秘)：(.+?)。/.exec(smMatches[i]);
        if (smMatches) {
            armInfo[subMatches[1]] = subMatches[2];
        }
    }
    return armInfo;
};

/**
 * 获取装备等级情况
 * @param html 装备的HTML代码
 * @returns {Map} 装备等级情况列表
 */
const getArmsLevelInfo = exports.getArmsLevelInfo = function (html) {
    let armsLevelList = new Map([['武器', 0], ['护甲', 0], ['项链', 0]]);
    let matches = html.match(/value="(\S+?)等级\[\s*(\d+)\s*] 经验:(\d+)"/g);
    for (let i in matches) {
        let subMatches = /value="(\S+?)等级\[\s*(\d+)\s*] 经验:(\d+)"/.exec(matches[i]);
        armsLevelList.set(subMatches[1], { '等级': parseInt(subMatches[2]), '经验': parseInt(subMatches[3]) });
    }
    return armsLevelList;
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
 * 获取道具使用情况
 * @param html 争夺首页的HTML代码
 * @returns {Map} 道具使用情况列表
 */
const getItemsUsedNumInfo = exports.getItemsUsedNumInfo = function (html) {
    let itemUsedNumList = new Map([['蕾米莉亚同人漫画', 0], ['十六夜同人漫画', 0], ['档案室钥匙', 0], ['傲娇LOLI娇蛮音CD', 0], ['消逝之药', 0], ['整形优惠卷', 0]]);
    let matches = html.match(/value="\[\s*(\d+)\s*](\S+?)"/g);
    for (let i in matches) {
        let subMatches = /value="\[\s*(\d+)\s*](\S+?)"/.exec(matches[i]);
        if (itemUsedNumList.has(subMatches[2])) {
            itemUsedNumList.set(subMatches[2], parseInt(subMatches[1]));
        }
    }
    return itemUsedNumList;
};

/**
 * 添加批量使用和出售道具按钮
 */
const addBatchUseAndSellItemsButton = function () {
    $(`
<div class="pd_item_btns" data-name="handleItemsBtns">
  <button name="useItems" type="button" style="color: #00f;" title="批量使用指定道具">批量使用</button>
  <button name="sellItems" type="button" style="color: #f00;" title="批量出售指定道具">批量出售</button>
</div>
`).insertAfter($itemArea).find('[name="useItems"]').click(() => showBatchUseAndSellItemsDialog(1, safeId)).end().find('[name="sellItems"]').click(() => showBatchUseAndSellItemsDialog(2, safeId));

    Public.addSlowActionChecked($('.pd_item_btns[data-name="handleItemsBtns"]'));
};

/**
 * 显示批量使用和出售道具对话框
 * @param {number} type 对话框类型，1：批量使用；2：批量出售
 */
const showBatchUseAndSellItemsDialog = function (type) {
    const dialogName = 'pdBatchUseAndSellItemsDialog';
    if ($('#' + dialogName).length > 0) return;
    Msg.destroy();
    let typeName = type === 1 ? '使用' : '出售';
    (0, _Config.read)();

    let itemTypesOptionHtml = '';
    for (let itemName of itemTypeList.slice(6)) {
        itemTypesOptionHtml += `<option>${itemName}</option>`;
    }

    let html = `
<div class="pd_cfg_main">
  <div style="margin: 5px 0;">请选择想批量${typeName}的道具种类（按<b>Ctrl键</b>或<b>Shift键</b>可多选）：</div>
  <select name="itemTypes" size="6" style="width: 320px;" multiple>${itemTypesOptionHtml}</select>
</div>
<div class="pd_cfg_btns">
  <button name="sell" type="button">${typeName}</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, `批量${typeName}道具`, html);

    $dialog.find('[name="itemTypes"]').keydown(function (e) {
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            $(this).children().prop('selected', true);
        }
    }).end().find('[name="sell"]').click(function () {
        let typeList = $dialog.find('[name="itemTypes"]').val();
        if (!Array.isArray(typeList)) return;
        (0, _Config.read)();
        if (type === 1) Config.defUseItemTypeList = typeList;else Config.defSellItemTypeList = typeList;
        (0, _Config.write)();
        if (!confirm(`是否${typeName}所选道具种类？`)) return;
        Dialog.close(dialogName);
        if (type === 1) useItems({ typeList, safeId });else sellItems({ typeList, safeId });
    });

    $dialog.find('[name="itemTypes"] > option').each(function () {
        let $this = $(this);
        let itemTypeList = type === 1 ? Config.defUseItemTypeList : Config.defSellItemTypeList;
        if (itemTypeList.includes($this.val())) $this.prop('selected', true);
    });

    Dialog.show(dialogName);
    Script.runFunc('Item.showBatchUseAndSellItemsDialog_after_', type);
};

/**
 * 使用道具
 * @param {string[]} typeList 想要使用的道具种类列表
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const useItems = function ({ typeList, safeId, nextActionEnabled = false }) {
    let totalSuccessNum = 0,
        totalValidNum = 0,
        totalInvalidNum = 0,
        index = 0;
    let useInfo = {};
    let tmpItemTypeList = [...typeList];

    /**
     * 使用
     * @param {number} itemId 道具ID
     * @param {string} itemName 道具名称
     * @param {number} itemNum 本轮使用的道具数量
     */
    const use = function (itemId, itemName, itemNum) {
        index++;
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=1&id=${itemId}&safeid=${safeId}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            if (!html) return;
            let msg = Util.removeHtmlTag(html);
            let isDelete = false;
            if (/(成功|失败)！/.test(msg)) {
                totalSuccessNum++;
                if (!(itemName in useInfo)) useInfo[itemName] = { '道具': 0, '有效道具': 0, '无效道具': 0 };
                useInfo[itemName]['道具']++;
                if (/成功！/.test(msg)) {
                    useInfo[itemName]['有效道具']++;
                    totalValidNum++;
                } else {
                    useInfo[itemName]['无效道具']++;
                    totalInvalidNum++;
                }
                $wait.find('.pd_countdown').text(totalSuccessNum);
                isDelete = true;
            } else if (/无法再使用/.test(msg)) {
                index = itemNum;
                let typeIndex = tmpItemTypeList.indexOf(itemName);
                if (typeIndex > -1) tmpItemTypeList.splice(typeIndex, 1);
            } else {
                isDelete = true;
            }

            if (isDelete) {
                $itemArea.find(`[id="wp_${itemId}"]`).fadeOut('normal', function () {
                    $(this).remove();
                });
            }
            console.log(`【Lv.${getLevelByName(itemName)}：${itemName}】 ${msg}`);
            $('.pd_result[data-name="itemResult"]:last').append(`<li>【Lv.${getLevelByName(itemName)}：${itemName}】 ${msg}</li>`);
            Script.runFunc('Item.useItems_after_');
        }).fail(function () {
            $('.pd_result[data-name="itemResult"]:last').append(`<li>【Lv.${getLevelByName(itemName)}：${itemName}】 <span class="pd_notice">连接超时</span></li>`);
        }).always(function () {
            if ($wait.data('stop')) complete();else {
                if (index === itemNum) setTimeout(getNextItems, typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);else setTimeout(() => $(document).dequeue('UseItems'), typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
            }
        });
    };

    /**
     * 获取当前的道具
     */
    const getCurrentItems = function () {
        let itemList = [];
        $itemArea.find('tr[id^="wp_"]').each(function () {
            let $this = $(this);
            let matches = /wp_(\d+)/.exec($this.attr('id'));
            if (!matches) return;
            let itemId = parseInt(matches[1]);
            let itemName = $this.find('> td:nth-child(3)').text().trim();
            if (tmpItemTypeList.includes(itemName)) itemList.push({ itemId, itemName });
        });
        if (!itemList.length) {
            complete();
            return;
        }

        index = 0;
        $(document).clearQueue('UseItems');
        $.each(itemList, function (i, { itemId, itemName }) {
            $(document).queue('UseItems', () => use(itemId, itemName, itemList.length));
        });
        $(document).dequeue('UseItems');
    };

    /**
     * 获取下一批道具
     */
    const getNextItems = function () {
        getNextObjects(2, () => {
            if ($wait.data('stop')) complete();else setTimeout(getCurrentItems, _Const2.default.defAjaxInterval);
        });
    };

    /**
     * 执行后续操作
     */
    const nextAction = function () {
        let action = null;
        if (Config.sellItemsAfterOpenBoxesEnabled) {
            action = () => sellItems({ typeList: Config.defSellItemTypeList, safeId, nextActionEnabled });
        }
        if (action) {
            setTimeout(action, _Const2.default.minActionInterval);
        }
    };

    /**
     * 操作完成
     */
    const complete = function () {
        $(document).clearQueue('UseItems');
        Msg.remove($wait);
        if ($.isEmptyObject(useInfo)) {
            console.log('没有道具被使用！');
            if (nextActionEnabled) nextAction();
            return;
        }

        let itemTypeNum = 0;
        let resultStat = '';
        for (let itemName of Util.getSortedObjectKeyList(typeList, useInfo)) {
            itemTypeNum++;
            let itemLevel = getLevelByName(itemName);
            let stat = useInfo[itemName];
            let successNum = stat['道具'];
            delete stat['道具'];
            if (stat['有效道具'] === 0) delete stat['有效道具'];
            if (stat['无效道具'] === 0) delete stat['无效道具'];
            if (!$.isEmptyObject(stat)) {
                resultStat += `【Lv.${itemLevel}：${itemName}】 <i>道具<ins>-${successNum}</ins></i> `;
                for (let [key, num] of Util.entries(stat)) {
                    resultStat += `<i>${key}<em>+${num}</em></i> `;
                }
                resultStat += '<br>';
                Log.push('使用道具', `共有\`${successNum}\`个【\`Lv.${itemLevel}：${itemName}\`】道具被使用`, { gain: stat, pay: { '道具': -successNum } });
            }
        }
        $('.pd_result[data-name="itemResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（共有<em>${itemTypeNum}</em>个种类中的<em>${totalSuccessNum}</em>个道具被使用，
<i>有效道具<em>+${totalValidNum}</em></i><i>无效道具<em>+${totalInvalidNum}</em></i>）：</b><br>
  ${resultStat}
</li>`);
        console.log(`共有${itemTypeNum}个种类中的${totalSuccessNum}个道具被使用，有效道具+${totalValidNum}，无效道具+${totalInvalidNum}`);
        Msg.show(`<strong>共有<em>${itemTypeNum}</em>个种类中的<em>${totalSuccessNum}</em>个道具被使用</strong>` + `<i>有效道具<em>+${totalValidNum}</em></i><i>无效道具<em>+${totalInvalidNum}</em></i>`, -1);

        setTimeout(() => getNextObjects(2), _Const2.default.defAjaxInterval);
        if (nextActionEnabled) nextAction();
        Script.runFunc('Item.useItems_complete_');
    };

    $itemArea.parent().append('<ul class="pd_result" data-name="itemResult"><li><strong>使用结果：</strong></li></ul>');
    let $wait = Msg.wait('<strong>正在使用道具中&hellip;</strong><i>已使用：<em class="pd_countdown">0</em></i><a class="pd_stop_action" href="#">停止操作</a>');
    getCurrentItems();
};

/**
 * 出售道具
 * @param {string[]} typeList 想要出售的道具种类列表
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const sellItems = function ({ typeList, safeId, nextActionEnabled = false }) {
    let successNum = 0,
        index = 0;
    let sellInfo = {};

    /**
     * 出售
     * @param {number} itemId 道具ID
     * @param {string} itemName 道具名称
     * @param {number} itemNum 本轮出售的道具数量
     */
    const sell = function (itemId, itemName, itemNum) {
        index++;
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=2&id=${itemId}&safeid=${safeId}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            if (!html) return;
            let msg = Util.removeHtmlTag(html);
            console.log(`【Lv.${getLevelByName(itemName)}：${itemName}】 ${msg}`);
            $('.pd_result[data-name="itemResult"]:last').append(`<li>【Lv.${getLevelByName(itemName)}：${itemName}】 ${msg}</li>`);
            $itemArea.find(`[id="wp_${itemId}"]`).fadeOut('normal', function () {
                $(this).remove();
            });

            let matches = /出售该物品获得了\[\s*(\d+)\s*]KFB/.exec(msg);
            if (!matches) return;
            successNum++;
            if (!(itemName in sellInfo)) sellInfo[itemName] = { num: 0, sell: 0 };
            sellInfo[itemName].num++;
            sellInfo[itemName].sell += parseInt(matches[1]);
            $wait.find('.pd_countdown').text(successNum);
            Script.runFunc('Item.sellItems_after_');
        }).fail(function () {
            $('.pd_result[data-name="itemResult"]:last').append(`<li>【Lv.${getLevelByName(itemName)}：${itemName}】 <span class="pd_notice">连接超时</span></li>`);
        }).always(function () {
            if ($wait.data('stop')) {
                complete();
            } else {
                if (index === itemNum) setTimeout(getNextItems, _Const2.default.minActionInterval);else setTimeout(() => $(document).dequeue('SellItems'), _Const2.default.minActionInterval);
            }
        });
    };

    /**
     * 获取当前的道具
     */
    const getCurrentItems = function () {
        let itemList = [];
        $itemArea.find('tr[id^="wp_"]').each(function () {
            let $this = $(this);
            let matches = /wp_(\d+)/.exec($this.attr('id'));
            if (!matches) return;
            let itemId = parseInt(matches[1]);
            let itemName = $this.find('> td:nth-child(3)').text().trim();
            if (typeList.includes(itemName)) itemList.push({ itemId, itemName });
        });
        if (!itemList.length) {
            complete();
            return;
        }

        index = 0;
        $(document).clearQueue('SellItems');
        $.each(itemList, function (i, { itemId, itemName }) {
            $(document).queue('SellItems', () => sell(itemId, itemName, itemList.length));
        });
        $(document).dequeue('SellItems');
    };

    /**
     * 获取下一批道具
     */
    const getNextItems = function () {
        getNextObjects(2, () => {
            if ($wait.data('stop')) complete();else setTimeout(getCurrentItems, _Const2.default.defAjaxInterval);
        });
    };

    /**
     * 操作完成
     */
    const complete = function () {
        $(document).clearQueue('SellItems');
        Msg.remove($wait);
        if ($.isEmptyObject(sellInfo)) {
            console.log('没有道具被出售！');
            return;
        }

        let itemTypeNum = 0,
            totalSell = 0;
        let resultStat = '';
        for (let itemName of Util.getSortedObjectKeyList(typeList, sellInfo)) {
            itemTypeNum++;
            let itemLevel = getLevelByName(itemName);
            let { sell, num } = sellInfo[itemName];
            totalSell += sell;
            resultStat += `【Lv.${itemLevel}：${itemName}】 <i>道具<ins>-${num}</ins></i> <i>KFB<em>+${sell.toLocaleString()}</em></i><br>`;
            Log.push('出售道具', `共有\`${num}\`个【\`Lv.${itemLevel}：${itemName}\`】道具出售成功`, { gain: { 'KFB': sell }, pay: { '道具': -num } });
        }
        $('.pd_result[data-name="itemResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（共有<em>${itemTypeNum}</em>个种类中的<em>${successNum}</em>个道具出售成功）：</b> <i>KFB<em>+${totalSell.toLocaleString()}</em></i><br>
  ${resultStat}
</li>`);
        console.log(`共有${itemTypeNum}个种类中的${successNum}个道具出售成功，KFB+${totalSell}`);
        Msg.show(`<strong>共有<em>${itemTypeNum}</em>个种类中的<em>${successNum}</em>个道具出售成功</strong><i>KFB<em>+${totalSell.toLocaleString()}</em></i>`, -1);
        setTimeout(() => getNextObjects(2), _Const2.default.defAjaxInterval);
        Script.runFunc('Item.sellItems_complete_');
    };

    $itemArea.parent().append(`<ul class="pd_result" data-name="itemResult"><li><strong>出售结果：</strong></li></ul>`);
    let $wait = Msg.wait('<strong>正在出售道具中&hellip;</strong><i>已出售：<em class="pd_countdown">0</em></i><a class="pd_stop_action" href="#">停止操作</a>');
    getCurrentItems();
};

/**
 * 购买物品
 * @param {string[]} buyItemIdList 购买物品ID列表
 * @param {string} safeId SafeID
 */
const buyItems = exports.buyItems = function (buyItemIdList, safeId) {
    if (Util.getCookie(_Const2.default.buyItemReadyCookieName) || new Date() < Util.getDateByTime(Config.buyItemAfterTime)) return;
    let index = 0,
        subIndex = 0;
    let isStop = false;
    let itemIdList = [];

    /**
     * 通过物品ID获取物品名称
     * @param {number} itemId 物品ID
     * @returns {string} 物品名称
     */
    const getItemNameById = function (itemId) {
        switch (parseInt(itemId)) {
            case 101:
                return '等级经验药丸';
            case 102:
                return '等级经验药丸（蛋）';
            case 103:
                return '修炼手册';
            default:
                return '未知';
        }
    };

    /**
     * 通过物品ID获取购买物品的代价
     * @param {number} itemId 物品ID
     * @returns {?{}} 购买物品的代价
     */
    const getItemPayById = function (itemId) {
        switch (parseInt(itemId)) {
            case 101:
                return { 'KFB': -5000 };
            case 102:
                return { 'KFB': -10000 };
            case 103:
                return { '普通盒子': -100 };
            default:
                return null;
        }
    };

    /**
     * 获取自动购买物品的Cookies有效期
     * @returns {Date} Cookies有效期的Date对象
     */
    const getCookieDate = function () {
        let now = new Date();
        let date = Util.getTimezoneDateByTime('00:25:00');
        if (now > date) date.setDate(date.getDate() + 1);
        return date;
    };

    /**
     * 购买
     * @param {number} itemId 物品ID
     */
    const buy = function (itemId) {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_shop.php',
            data: `buy=${itemId}&safeid=${safeId}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            let msg = Util.removeHtmlTag(html);
            let itemName = getItemNameById(itemId);
            console.log(`【购买物品】【${itemName}】：${msg}`);
            let isShowMsg = false;

            if (msg.includes('购买成功')) {
                index++;
                subIndex = 0;
                let matches = /\+(\d+)(武器\/护甲经验|经验)/.exec(msg);
                if (matches) {
                    let num = parseInt(matches[1]),
                        key = matches[2];
                    let gain = {},
                        pay = getItemPayById(itemId);
                    if (key === '经验') {
                        gain['经验值'] = num;
                    } else {
                        gain['武器经验'] = num;
                        gain['护甲经验'] = num;
                    }
                    if (pay) {
                        Log.push('购买物品', `共有\`1\`个【\`${itemName}\`】购买成功`, { gain, pay });
                    }

                    let msgStat = '';
                    for (let [key, value] of Util.entries(gain)) {
                        msgStat += `<i>${key}<em>+${value.toLocaleString()}</em></i>`;
                    }
                    for (let [key, value] of Util.entries(pay)) {
                        msgStat += `<i>${key}<ins>${value.toLocaleString()}</ins></i>`;
                    }
                    isShowMsg = true;
                    Msg.show(`<strong>购买物品【${itemName}】${msgStat}`);
                    Script.runFunc('Item.buyItems_success_', msg);
                }
            } else if (msg.includes('不足')) {
                subIndex++;
                if (subIndex >= itemIdList[index].length) {
                    index++;
                    subIndex = 0;
                }
            } else {
                if (!msg.includes('操作过快')) {
                    index++;
                    subIndex = 0;
                }
                if (msg.includes('本日购买次数已用完')) {
                    if (index === 1) isShowMsg = true;
                    isStop = true;
                    Util.setCookie(_Const2.default.buyItemCookieName, 1, getCookieDate());
                }
            }
            if (!isShowMsg) {
                Msg.show(`<strong>购买物品【${itemName}】：${msg}</strong>`);
            }
        }).fail(function () {
            index++;
            subIndex = 0;
            Msg.show(`<strong>购买物品【${getItemNameById(itemId)}】：连接超时</strong>`);
        }).always(function () {
            isStop = isStop || $wait.data('stop');
            if (isStop || index >= itemIdList.length) {
                Msg.remove($wait);
                Util.deleteCookie(_Const2.default.buyItemReadyCookieName);
                Util.setCookie(_Const2.default.buyItemCookieName, 1, getCookieDate());
                Script.runFunc('Item.buyItems_complete_');
            } else {
                setTimeout(() => buy(parseInt(itemIdList[index][subIndex])), _Const2.default.minActionInterval);
            }
        });
    };

    for (let value of buyItemIdList) {
        if (!/^\d+(\|\d+)*$/.test(value)) continue;
        let arr = value.split('|').filter(id => id && getItemNameById(parseInt(id)) !== '未知');
        if (arr.length > 0) {
            itemIdList.push(arr);
        }
    }
    if (!itemIdList.length) {
        Util.setCookie(_Const2.default.buyItemCookieName, 1, getCookieDate());
        return;
    }
    Util.setCookie(_Const2.default.buyItemReadyCookieName, 1, Util.getDate('+5m'));
    let $wait = Msg.wait(`<strong>正在购买物品中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i><a class="pd_stop_action" href="#">停止操作</a>`);
    buy(parseInt(itemIdList[index][subIndex]));
};

/**
 * 在物品商店显示当前持有的KFB和贡献
 */
const showMyInfoInItemShop = exports.showMyInfoInItemShop = function () {
    $.get(`profile.php?action=show&uid=${_Info2.default.uid}&t=${$.now()}`, function (html) {
        let kfbMatches = /论坛货币：(\d+)\s*KFB/.exec(html);
        let gxMatches = /贡献数值：(\d+(?:\.\d+)?)/.exec(html);
        if (!kfbMatches && !gxMatches) return;
        let kfb = parseInt(kfbMatches[1]);
        let gx = parseFloat(gxMatches[1]);
        $('.kf_fw_ig_title1:eq(1)').append(`
<span style="margin-left: 7px;">(当前持有 <b style="font-size: 14px;">${kfb.toLocaleString()}</b> KFB 和 <b style="font-size: 14px;">${gx}</b> 贡献)</span>
`);
    });
};

},{"./Config":4,"./Const":6,"./Dialog":7,"./Info":9,"./Log":11,"./Loot":13,"./Msg":15,"./Public":18,"./Script":20,"./Util":23}],11:[function(require,module,exports){
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
    let options = Util.readData(name + '_' + _Info2.default.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    log = options;
    return log;
};

/**
 * 写入日志
 * @param {{}} log 日志对象
 */
const write = exports.write = log => Util.writeData(name + '_' + _Info2.default.uid, JSON.stringify(log));

/**
 * 清除日志
 */
const clear = exports.clear = () => Util.deleteData(name + '_' + _Info2.default.uid);

/**
 * 记录一条新日志
 * @param {string} type 日志类别
 * @param {string} action 行为
 * @param {?{}} gain 收获
 * @param {?{}} pay 付出
 */
const push = exports.push = function (type, action, { gain = null, pay = null } = {}) {
    let log = read();
    let overdueDate = Util.getDateString(Util.getDate(`-${Config.logSaveDays}d`));
    for (let date of Util.getObjectKeyList(log, 1)) {
        if (date <= overdueDate) delete log[date];else break;
    }

    let now = new Date();
    let time = now.getTime();
    let today = Util.getDateString(now);
    let obj = { time, type, action };
    if (gain) obj['gain'] = gain;
    if (pay) obj['pay'] = pay;
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
            log[date].sort((a, b) => a.time > b.time ? 1 : -1);
        }
    }
    return log;
};

},{"./Const":6,"./Info":9,"./Util":23}],12:[function(require,module,exports){
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

var _Config = require('./Config');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Item = require('./Item');

var Item = _interopRequireWildcard(_Item);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 显示日志对话框
 */
const show = exports.show = function () {
    const dialogName = 'pdLogDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    Script.runFunc('LogDialog.show_before_');
    let html = `
<div class="pd_cfg_main">
  <div class="pd_log_nav">
    <a class="pd_disabled_link" data-name="start" href="#">&lt;&lt;</a>
    <a class="pd_disabled_link" data-name="prev" href="#" style="padding: 0 7px;">&lt;</a>
    <h2 class="pd_log_date pd_custom_tips">暂无日志</h2>
    <a class="pd_disabled_link" data-name="next" href="#" style="padding: 0 7px;">&gt;</a>
    <a class="pd_disabled_link" data-name="end" href="#">&gt;&gt;</a>
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
  <button data-action="close" type="button">关闭</button>
  <button name="clear" type="button">清除日志</button>
</div>`;
    let $dialog = Dialog.create(dialogName, 'KFOL助手日志', html, 'width: 880px;');
    let $logNav = $dialog.find('.pd_log_nav');

    let log = Log.read();
    let dateList = [];
    let curIndex = 0;
    if (!$.isEmptyObject(log)) {
        dateList = Util.getObjectKeyList(log, 1);
        curIndex = dateList.length - 1;
        $logNav.find('.pd_log_date').attr('title', `总共记录了${dateList.length}天的日志`).text(dateList[curIndex]);
        if (dateList.length > 1) {
            $logNav.find('[data-name="start"]').attr('title', dateList[0]).removeClass('pd_disabled_link');
            $logNav.find('[data-name="prev"]').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
        }
    }
    $logNav.on('click', 'a[data-name]', function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        let name = $this.data('name');
        if (name === 'start') {
            curIndex = 0;
        } else if (name === 'prev') {
            if (curIndex > 0) curIndex--;else return;
        } else if (name === 'next') {
            if (curIndex < dateList.length - 1) curIndex++;else return;
        } else if (name === 'end') {
            curIndex = dateList.length - 1;
        }
        $logNav.find('.pd_log_date').text(dateList[curIndex]);
        showLogContent(log, dateList[curIndex], $dialog);
        showLogStat(log, dateList[curIndex], $dialog);
        if (curIndex > 0) {
            $logNav.find('[data-name="start"]').attr('title', dateList[0]).removeClass('pd_disabled_link');
            $logNav.find('[data-name="prev"]').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
        } else {
            $logNav.find('[data-name="start"], [data-name="prev"]').removeAttr('title').addClass('pd_disabled_link');
        }
        if (curIndex < dateList.length - 1) {
            $logNav.find('[data-name="next"]').attr('title', dateList[curIndex + 1]).removeClass('pd_disabled_link');
            $logNav.find('[data-name="end"]').attr('title', dateList[dateList.length - 1]).removeClass('pd_disabled_link');
        } else {
            $logNav.find('[data-name="next"], [data-name="end"]').removeAttr('title').addClass('pd_disabled_link');
        }
    });

    $dialog.find('[name="sortType"]').click(function () {
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
    }).end().find(`[name="sortType"][value="${Config.logSortType}"]`).click().end().find(`[name="statType"][value="${Config.logStatType}"]`).click().end().find('[name="statDays"]').val(Config.logStatDays);

    $dialog.find('[name="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有日志？')) {
            Log.clear();
            alert('日志已清除');
            location.reload();
        }
    }).end().find('[data-name="openImOrExLogDialog"]').click(function (e) {
        e.preventDefault();
        showImportOrExportLogDialog();
    });

    showLogContent(log, dateList[curIndex], $dialog);
    showLogStat(log, dateList[curIndex], $dialog);

    if ($(window).height() <= 750) $dialog.find('.pd_log_content').css('height', '192px');
    Dialog.show(dialogName);
    Script.runFunc('LogDialog.show_after_');
};

/**
 * 显示指定日期的日志内容
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {jQuery} $dialog 日志对话框对象
 */
const showLogContent = function (log, date, $dialog) {
    if (!Array.isArray(log[date])) return;
    $dialog.find('.pd_log_content').html(getLogContent(log, date, Config.logSortType)).parent().find('legend:first-child').text(`日志内容 (共${log[date].length}项)`);
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
        const sortTypeList = ['领取每日奖励', '提升战力光环', '争夺攻击', '捐款', '领取争夺奖励', '批量攻击', '试探攻击', '抽取神秘盒子', '抽取道具或卡片', '打开盒子', '购买物品', '使用道具', '恢复道具', '循环使用道具', '将道具转换为能量', '将卡片转换为VIP时间', '购买道具', '统计道具购买价格', '出售道具', '熔炼装备', '神秘抽奖', '统计神秘抽奖结果', '神秘等级升级', '神秘系数排名变化', '批量转账', '购买帖子', '自动存款'];
        logList.sort((a, b) => sortTypeList.indexOf(a.type) > sortTypeList.indexOf(b.type) ? 1 : -1);
    } else {
        logList.sort((a, b) => a.time > b.time ? 1 : -1);
    }

    let content = '',
        curType = '';
    for (let { time, type, action, gain, pay } of logList) {
        if (typeof time === 'undefined' || typeof type === 'undefined' || typeof action === 'undefined') continue;
        let d = new Date(time);
        if (logSortType === 'type') {
            if (curType !== type) {
                content += `<h3>【${type}】</h3>`;
                curType = type;
            }
            content += `<p><b>${Util.getTimeString(d)}：</b>${action.replace(/`([^`]+?)`/g, '<b style="color: #f00;">$1</b>')}`;
        } else {
            content += `<p><b>${Util.getTimeString(d)} (${type})：</b>${action.replace(/`([^`]+?)`/g, '<b style="color: #f00;">$1</b>')}`;
        }

        let stat = '';
        if ($.type(gain) === 'object' && !$.isEmptyObject(gain)) {
            stat += '，';
            for (let k of Object.keys(gain)) {
                if (k === 'item') {
                    for (let name of Util.getSortedObjectKeyList(Item.itemTypeList, gain[k])) {
                        stat += `<i>${name}<em>+${gain[k][name].toLocaleString()}</em></i> `;
                    }
                } else if (k === 'arm') {
                    for (let name of Util.getSortedObjectKeyList(Item.armTypeList, gain[k])) {
                        stat += `<i>${name}<em>+${gain[k][name].toLocaleString()}</em></i> `;
                    }
                } else if (k === 'box') {
                    for (let name of Util.getSortedObjectKeyList(Item.boxTypeList, gain[k])) {
                        stat += `<i>${name}<em>+${gain[k][name].toLocaleString()}</em></i> `;
                    }
                } else {
                    stat += `<i>${k}<em>+${gain[k].toLocaleString()}</em></i> `;
                }
            }
        }
        if ($.type(pay) === 'object' && !$.isEmptyObject(pay)) {
            if (!stat) stat += '，';
            for (let k of Object.keys(pay)) {
                if (k === 'item') {
                    for (let itemName of Object.keys(pay[k])) {
                        stat += `<i>${itemName}<ins>${pay[k][itemName].toLocaleString()}</ins></i> `;
                    }
                } else {
                    stat += `<i>${k}<ins>${pay[k].toLocaleString()}</ins></i> `;
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
    let lootCount = 0,
        lootLevelStat = { total: 0, min: 0, max: 0 },
        lootBoxTotalNum = 0,
        lootBoxStat = {};
    let boxTotalNum = 0,
        boxStat = {},
        boxGain = { 'KFB': 0, '经验值': 0, '道具': 0, '装备': 0, item: {}, arm: {} },
        boxRandomTotalNum = 0,
        boxRandomTotalCount = 0;
    let buyItemNum = 0,
        buyItemKfb = 0,
        buyItemStat = {};
    let validItemNum = 0,
        validItemStat = {},
        invalidItemNum = 0,
        invalidItemStat = {};
    let invalidKeyList = ['item', 'arm', 'box', '夺取KFB', 'VIP小时', '神秘', '燃烧伤害', '命中', '闪避', '暴击比例', '暴击几率', '防御', '有效道具', '无效道具', '长剑经验', '短弓经验', '法杖经验'];
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

            if (type === '争夺攻击' && $.type(gain) === 'object') {
                let matches = /第`(\d+)`层/.exec(action);
                if (matches) {
                    lootCount++;
                    let level = parseInt(matches[1]);
                    lootLevelStat.total += level;
                    if (lootLevelStat.max < level) lootLevelStat.max = level;
                    if (!lootLevelStat.min || lootLevelStat.min > level) lootLevelStat.min = level;
                    if ($.type(gain['box']) === 'object') {
                        for (let [key, num] of Util.entries(gain['box'])) {
                            lootBoxTotalNum += num;
                            if (!(key in lootBoxStat)) lootBoxStat[key] = { total: 0, min: -1, max: -1 };
                            lootBoxStat[key].total += num;
                            if (lootBoxStat[key].max < num) lootBoxStat[key].max = num;
                            if (lootBoxStat[key].min < 0 || lootBoxStat[key].min > num) lootBoxStat[key].min = num;
                        }
                        for (let key of Item.boxTypeList) {
                            if (!(key in gain['box']) && key in lootBoxStat) lootBoxStat[key].min = 0;
                        }
                    }
                }
            } else if (type === '打开盒子' && $.type(gain) === 'object' && $.type(pay) === 'object') {
                let matches = /【`(.+?)`】打开成功/.exec(action);
                if (!matches) continue;
                let boxType = matches[1];
                let boxNum = Math.abs(pay['盒子']);
                boxTotalNum += boxNum;
                if (!(boxType in boxStat)) boxStat[boxType] = 0;
                boxStat[boxType] += Math.abs(pay['盒子']);

                let randomMatches = /平均随机值【`([\d\.]+)`】/.exec(action);
                if (randomMatches) {
                    boxRandomTotalCount += boxNum;
                    boxRandomTotalNum += parseFloat(randomMatches[1]) * boxNum;
                }

                for (let [key, value] of Util.entries(gain)) {
                    if (!(key in boxGain)) continue;
                    if ($.type(value) === 'object') {
                        for (let [name, num] of Util.entries(value)) {
                            if (!(name in boxGain[key])) boxGain[key][name] = 0;
                            boxGain[key][name] += num;
                        }
                    } else {
                        boxGain[key] += value;
                    }
                }
            } else if (type === '购买道具' && $.type(gain) === 'object' && $.type(gain['item']) === 'object' && $.type(pay) === 'object') {
                buyItemNum += gain['道具'];
                buyItemKfb += Math.abs(pay['KFB']);
                for (let [itemName, num] of Util.entries(gain['item'])) {
                    if (!(itemName in buyItemStat)) buyItemStat[itemName] = 0;
                    buyItemStat[itemName] += num;
                }
            } else if ((type === '使用道具' || type === '循环使用道具') && $.type(gain) === 'object') {
                let matches = /【`Lv.(\d+)：(.+?)`】/.exec(action);
                if (matches) {
                    let itemLevel = parseInt(matches[1]);
                    if (itemLevel < 3) continue;
                    let itemName = matches[2];
                    if (gain['有效道具'] > 0) {
                        validItemNum += gain['有效道具'];
                        if (typeof validItemStat[itemName] === 'undefined') validItemStat[itemName] = 0;
                        validItemStat[itemName] += gain['有效道具'];
                    }
                    if (gain['无效道具'] > 0) {
                        invalidItemNum += gain['无效道具'];
                        if (typeof invalidItemStat[itemName] === 'undefined') invalidItemStat[itemName] = 0;
                        invalidItemStat[itemName] += gain['无效道具'];
                    }
                }
            }
        }
    }

    let content = '';
    let sortStatTypeList = ['KFB', '经验值', '贡献', '转账额度', '盒子', '道具', '已使用道具', '装备', '武器经验', '护甲经验', '项链经验', '能量', '卡片'];
    content += '<strong>收获：</strong>';
    for (let key of Util.getSortedObjectKeyList(sortStatTypeList, income)) {
        profit[key] = income[key];
        content += `<i>${key}<em>+${income[key].toLocaleString()}</em></i> `;
    }
    content += '<br><strong>付出：</strong>';
    for (let key of Util.getSortedObjectKeyList(sortStatTypeList, expense)) {
        if (typeof profit[key] === 'undefined') profit[key] = expense[key];else profit[key] += expense[key];
        content += `<i>${key}<ins>${expense[key].toLocaleString()}</ins></i> `;
    }
    content += '<br><strong>结余：</strong>';
    for (let key of Util.getSortedObjectKeyList(sortStatTypeList, profit)) {
        content += `<i>${key}${Util.getStatFormatNumber(profit[key])}</i> `;
    }

    content += '<div style="margin: 5px 0; border-bottom: 1px dashed #ccccff;"></div>';
    content += `\n<strong>争夺攻击统计：</strong><i>次数<em>+${lootCount}</em></i> `;
    if (lootCount > 0) {
        content += `<i>层数<span class="pd_stat_extra">(<em title="平均值">+${(lootLevelStat.total / lootCount).toFixed(2)}</em>|` + `<em title="最小值">+${lootLevelStat.min}</em>|<em title="最大值">+${lootLevelStat.max}</em>)</span></i> `;
        content += `<i>盒子<em>+${lootBoxTotalNum.toLocaleString()}</em></i> `;
        for (let key of Util.getSortedObjectKeyList(Item.boxTypeList, lootBoxStat)) {
            if (!lootBoxStat[key].total) continue;
            content += `<i>${key}<em>+${lootBoxStat[key].total.toLocaleString()}</em>` + `<span class="pd_stat_extra">(<em title="平均值">+${(lootBoxStat[key].total / lootCount).toFixed(2)}</em>|` + `<em title="最小值">+${lootBoxStat[key].min}</em>|<em title="最大值">+${lootBoxStat[key].max}</em>)</span></i> `;
        }
    }

    let boxStatContent = '';
    for (let boxType of Util.getSortedObjectKeyList(Item.boxTypeList, boxStat)) {
        if (boxStatContent) boxStatContent += '|';
        boxStatContent += `<ins title="${boxType}">-${boxStat[boxType].toLocaleString()}</ins>`;
    }
    content += `<br><strong>盒子收获统计：</strong><i>盒子<ins>-${boxTotalNum}</ins>` + `${boxStatContent ? `<span class="pd_stat_extra">(${boxStatContent})</span>` : ''}</i> `;
    if (boxRandomTotalCount > 0) {
        content += `<i>平均随机值<em>+${Util.getFixedNumLocStr(boxRandomTotalNum / boxRandomTotalCount, 2)}</em></i> `;
    }
    if (boxTotalNum > 0) {
        for (let [key, value] of Util.entries(boxGain)) {
            if (!value || $.type(value) === 'object' && $.isEmptyObject(value)) continue;
            if ($.type(value) === 'object') {
                let typeList = key === 'item' ? Item.itemTypeList : Item.armTypeList;
                for (let name of Util.getSortedObjectKeyList(typeList, value)) {
                    content += `<i>${name}<em>+${value[name].toLocaleString()}</em></i> `;
                }
            } else {
                content += `<i>${key}<span class="pd_stat_extra"><em>+${value.toLocaleString()}</em>` + `(<em title="平均值">+${Util.getFixedNumLocStr(value / boxTotalNum, 2).toLocaleString()}</em>)</span></i> `;
            }
        }
    }

    /*content += `<br><strong>购买道具统计：</strong><i>道具<em>+${buyItemNum.toLocaleString()}</em></i> ` +
        `<i>KFB<ins>-${buyItemKfb.toLocaleString()}</ins></i> `;
    for (let itemName of Util.getSortedObjectKeyList(Item.itemTypeList, buyItemStat)) {
        content += `<i>${itemName}<em>+${buyItemStat[itemName].toLocaleString()}</em></i> `;
    }*/ // 临时禁用
    content += `<br><strong>有效道具统计：</strong><i>有效道具<em>+${validItemNum.toLocaleString()}</em></i> `;
    for (let itemName of Util.getSortedObjectKeyList(Item.itemTypeList, validItemStat)) {
        content += `<i>${itemName}<em>+${validItemStat[itemName].toLocaleString()}</em></i> `;
    }
    content += `<br><strong>无效道具统计：</strong><i>无效道具<em>+${invalidItemNum.toLocaleString()}</em></i> `;
    for (let itemName of Util.getSortedObjectKeyList(Item.itemTypeList, invalidItemStat)) {
        content += `<i>${itemName}<em>+${invalidItemStat[itemName].toLocaleString()}</em></i> `;
    }

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
    <strong>导出日志：</strong>复制文本框里的内容并粘贴到别处即可<br>
    <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>
  </div>
  <div data-name="logText" style="display: none;">
    <strong>导出日志文本</strong>：复制文本框里的内容并粘贴到别处即可
    <div>
      <label title="按时间顺序排序"><input type="radio" name="sortType2" value="time" checked> 按时间</label>
      <label title="按日志类别排序"><input type="radio" name="sortType2" value="type"> 按类别</label>
      <label title="在日志文本里显示每日以及全部数据的统计结果"><input type="checkbox" name="showStat" checked> 显示统计</label>
    </div>
    <textarea name="text" style="width: 600px; height: 400px;" readonly></textarea>
  </div>
</div>
<div class="pd_cfg_btns">
  <button name="merge" type="button">合并日志</button>
  <button name="overwrite" type="button" style="color: #f00;">覆盖日志</button>
  <button data-action="close" type="button">关闭</button>
</div>`;

    let $dialog = Dialog.create(dialogName, '导入或导出日志', html);
    $dialog.find('[name="sortType2"], [name="showStat"]').click(function () {
        showLogText(log, $dialog);
        $dialog.find('[name="text"]').select();
    }).end().find('[name="logType"]').click(function () {
        let type = $(this).val();
        $dialog.find(`[data-name="log${type === 'text' ? 'Setting' : 'Text'}"]`).hide();
        $dialog.find(`[data-name="log${type === 'text' ? 'Text' : 'Setting'}"]`).show();
        $dialog.find(`[data-name="log${type === 'text' ? 'Text' : 'Setting'}"]`).select();
    }).end().find('[name="merge"], [name="overwrite"]').click(function (e) {
        e.preventDefault();
        let name = $(this).attr('name');
        if (!confirm(`是否将文本框中的日志${name === 'overwrite' ? '覆盖' : '合并'}到本地日志？`)) return;
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
    });

    Dialog.show(dialogName);
    $dialog.find(`[name="sortType2"][value="${Config.logSortType}"]`).prop('checked', true).triggerHandler('click');
    $dialog.find('[name="setting"]').val(JSON.stringify(log)).select().focus();
    Script.runFunc('LogDialog.showImportOrExportLogDialog_after_');
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
        content += `【${date}】(共${log[date].length}项)\n${logSortType === 'type' ? '' : '\n'}` + getLogContent(log, date, logSortType).replace(/<h3>/g, '\n').replace(/<\/h3>/g, '\n').replace(/<\/p>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '').replace(/`/g, '');
        if (isShowStat) {
            content += `${'-'.repeat(46)}\n合计：\n${getLogStat(log, date, 'current').replace(/<br\s*\/?>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '')}\n`;
        }
        content += '='.repeat(46) + '\n';
    }
    if (content && isShowStat) {
        content += '\n总计：\n' + getLogStat(log, lastDate, 'all').replace(/<br\s*\/?>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '');
    }
    $dialog.find('[name="text"]').val(content);
};

},{"./Config":4,"./Dialog":7,"./Item":10,"./Log":11,"./Script":20,"./Util":23}],13:[function(require,module,exports){
/* 争夺模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPromoteHaloCostByTypeId = exports.promoteHalo = exports.getPromoteHaloInfo = exports.setHaloInfo = exports.getHaloInfo = exports.addUserLinkInHaloPage = exports.addUserLinkInPkListPage = exports.getChangePointsCountDown = exports.autoSaveLootLog = exports.checkLoot = exports.getLevelInfoList = exports.getLevelInfo = exports.getLogList = exports.getLog = exports.getLootInfo = exports.updateLootInfo = exports.lootAttack = exports.getRealProperty = exports.getPointByProperty = exports.getPropertyByPoint = exports.getExtraPoint = exports.getFieldNameByPointName = exports.getPointNameByFieldName = exports.getSkillAttack = exports.getCurrentAssignedPoint = exports.enhanceLootIndexPage = exports.init = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _LootLog = require('./LootLog');

var LootLog = _interopRequireWildcard(_LootLog);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

var _Public = require('./Public');

var Public = _interopRequireWildcard(_Public);

var _Item = require('./Item');

var Item = _interopRequireWildcard(_Item);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SafeID
let safeId;
// 争夺属性区域
let $properties;
// 点数区域
let $points;
// 装备区域
let $armArea;
// 争夺记录区域容器
let $logBox;
// 争夺记录区域
let $log;
// 争夺记录
let log = '';
// 各层争夺记录列表
let logList = [];
// 各层战斗信息列表
let levelInfoList = [];
// 当前争夺属性
let propertyList = {};
// 额外点数列表
let extraPointsList = {};
// 光环信息
let haloInfo = {};
// 当前装备情况
let currentArmInfo = new Map();
// 装备等级情况列表
let armsLevelList = new Map();
// 道具使用情况列表
let itemUsedNumList = new Map();
// 修改点数可用次数
let changePointsAvailableCount = 0;
// 点数分配记录列表
let pointsLogList = [];

/**
 * 初始化
 */
const init = exports.init = function () {
    safeId = Public.getSafeId();
    if (!safeId) return;

    $properties = $('.kf_fw_ig3:first');
    $points = $('#wdsx .kf_fw_ig1:first');
    $points.find('> tbody > tr:first-child > td').attr('id', 'pdArmArea');
    $armArea = $points.find('#pdArmArea');

    let tmpHaloInfo = TmpLog.getValue(_Const2.default.haloInfoTmpLogName);
    if (tmpHaloInfo && $.type(tmpHaloInfo) === 'object') {
        let diff = $.now() - tmpHaloInfo.time;
        if (diff >= 0 && diff < _Const2.default.tmpHaloInfoExpires * 60 * 1000) {
            delete tmpHaloInfo.time;
            setHaloInfo(tmpHaloInfo);
            enhanceLootIndexPage();
        } else readHaloInfo(true);
    } else readHaloInfo(true);
};

/**
 * 增强争夺首页
 */
const enhanceLootIndexPage = exports.enhanceLootIndexPage = function () {
    Script.runFunc('Loot.enhanceLootIndexPage_before_');
    let propertiesHtml = $properties.html();
    propertyList = getLootPropertyList(propertiesHtml);
    itemUsedNumList = Item.getItemsUsedNumInfo(propertiesHtml);
    armsLevelList = Item.getArmsLevelInfo(propertiesHtml);

    let armHtml = $armArea.html();
    if (armHtml.includes('（装备中）')) {
        let [armInfoHtml] = armHtml.split('<br><br>');
        let [, weaponInfoHtml = '', armorInfoHtml = ''] = armInfoHtml.split('（装备中）');
        currentArmInfo.set('武器', Item.getArmInfo(weaponInfoHtml));
        currentArmInfo.set('护甲', Item.getArmInfo(armorInfoHtml));
    } else return;

    $logBox = $('#pk_text_div');
    $log = $('#pk_text');
    log = $log.html();
    logList = getLogList(log);
    levelInfoList = getLevelInfoList(logList);
    if (/你被击败了|本日无争夺记录|你已经复活/.test(log)) {
        localStorage.removeItem(_Const2.default.tempPointsLogListStorageName + '_' + _Info2.default.uid);
    } else {
        pointsLogList = getTempPointsLogList(logList);
    }

    handlePropertiesArea();
    handlePointsArea();
    addLevelPointListSelect();
    addAttackBtns();
    if (Config.alwaysOpenPointAreaEnabled) {
        $('#wdsx').show();
    }

    if (log.includes('本日无争夺记录') || log.includes('你已经复活')) {
        $log.html(log.replace(/点击这里/g, '点击上方的攻击按钮').replace('战斗记录框内任意地方点击自动战斗下一层', '请点击上方的攻击按钮开始争夺战斗'));
    } else if (log.includes('你被击败了') && !Config.autoLootEnabled && !Config.autoSaveLootLogInSpecialCaseEnabled && !Util.getCookie(_Const2.default.lootCompleteCookieName)) {
        Util.setCookie(_Const2.default.lootCompleteCookieName, 2, getAutoLootCookieDate());
    }
    addLootLogHeader();
    showLogStat(levelInfoList);

    if (Config.autoLootEnabled && !/你被击败了/.test(log) && !$.isNumeric(Util.getCookie(_Const2.default.changePointsInfoCookieName)) && !Util.getCookie(_Const2.default.lootAttackingCookieName)) {
        $(document).ready(() => setTimeout(autoLoot, 500));
    }
    Script.runFunc('Loot.enhanceLootIndexPage_after_');
};

/**
 * 处理争夺属性区域
 */
const handlePropertiesArea = function () {
    $properties.attr('id', 'pdPropertiesArea').find('input[value$="可分配属性"]').after('<span id="pdSurplusPoint" class="pd_property_diff" hidden>(<em></em>)</span>');

    $properties.on('change', '.pd_arm_level', function () {
        let type = $(this).data('type');
        let diffName = 'Weapon';
        if (type === '护甲') diffName = 'Armor';else if (type === '项链') diffName = 'Necklace';
        $(`#pd${diffName}ExpDiff em`).text(armsLevelList.get(type)['经验'] - Math.pow(armsLevelList.get(type)['等级'] + 1, 2) * 2);
    });
    $properties.find('input[value^="武器等级"]').addClass('pd_arm_level').attr('data-type', '武器').after(`<span id="pdWeaponExpDiff" class="pd_property_diff" title="下一级经验差值" style="color: #393;">(<em></em>)</span>`).trigger('change');
    $properties.find('input[value^="护甲等级"]').addClass('pd_arm_level').attr('data-type', '护甲').after(`<span id="pdArmorExpDiff" class="pd_property_diff" title="下一级经验差值" style="color: #393;">(<em></em>)</span>`).trigger('change');
    $properties.find('input[value^="项链等级"]').addClass('pd_arm_level').attr('data-type', '项链').after(`<span id="pdNecklaceExpDiff" class="pd_property_diff" title="下一级经验差值" style="color: #393;">(<em></em>)</span>`).trigger('change');

    $('<a data-name="copyParameterSetting" href="#" style="margin-left: -20px;" title="复制计算器的部分参数设置（包括神秘系数、光环和道具数量）">复</a>').insertAfter($properties.find('input[value$="蕾米莉亚同人漫画"]')).click(function (e) {
        e.preventDefault();
        let $this = $(this);
        let coefficient = Math.floor((propertyList['可分配属性点'] - 50 - (itemUsedNumList.get('档案室钥匙') === 30 ? 30 : 0) - (itemUsedNumList.get('消逝之药') === 10 ? 120 : 0)) / 5);
        let copyText = coefficient + ' ' + Math.floor(haloInfo['全属性'] * 1000) + '\n';
        for (let value of itemUsedNumList.values()) {
            copyText += value + ' ';
        }
        $this.data('copy-text', copyText.trim());
        console.log('KFOL计算器的部分参数设置：\n' + copyText.trim());
        if (!Util.copyText($this, 'KFOL计算器的部分参数设置已复制')) {
            alert('你的浏览器不支持复制，请打开Web控制台查看');
        }
    });

    return; // 临时禁用
    let tipsIntro = '灵活和智力的抵消机制：\n战斗开始前，会重新计算战斗双方的灵活和智力；灵活=(自己的灵活值-(双方灵活值之和 x 33%))；智力=(自己的智力值-(双方智力值之和 x 33%))';
    let html = $properties.html().replace(/(攻击力：)(\d+)/, '$1<span id="pdPro_s1" title="原值：$2">$2</span> <span id="pdNew_s1"></span>').replace(/(生命值：)(\d+)\s*\(最大(\d+)\)/, '$1<span id="pdCurrentLife">$2</span> (最大<span id="pdPro_s2" title="原值：$3">$3</span>) <span id="pdNew_s2"></span>').replace(/(攻击速度：)(\d+)/, '$1<span id="pdPro_d1" title="原值：$2">$2</span> <span id="pdNew_d1"></span>').replace(/(暴击几率：)(\d+)%\s*\(抵消机制见说明\)/, `$1<span id="pdPro_d2" title="原值：$2">$2</span>% <span class="pd_cfg_tips" id="pdReal_d2" style="color: #666;"></span> ` + `<span id="pdNew_d2"></span> <span class="pd_cfg_tips" title="${tipsIntro}">[?]</span>`).replace(/(技能释放概率：)(\d+)%\s*\(抵消机制见说明\)/, `$1<span id="pdPro_i1" title="原值：$2">$2</span>% <span class="pd_cfg_tips" id="pdReal_i1" style="color: #666;"></span> ` + `<span id="pdNew_i1"></span> <span class="pd_cfg_tips" title="${tipsIntro}">[?]</span>`).replace(/(防御：)(\d+)%减伤/, '$1<span id="pdPro_i2" title="原值：$2">$2</span>%减伤 <span id="pdNew_i2"></span>').replace('技能伤害：攻击+(体质*5)+(智力*5)', '技能伤害：<span class="pd_custom_tips" id="pdSkillAttack" title="[飞身劈斩]伤害：攻击+体质值*5+智力值*5"></span>').replace(/(可分配属性点：)(\d+)/, '$1<span id="pdDistributablePoint">$2</span>');
    $properties.html(html).find('br:first').after('<span>剩余属性点：<span id="pdSurplusPoint"></span></span><br>');

    $properties.on('click', '[id^="pdPro_"]', function () {
        let $this = $(this);
        $this.hide();
        let name = $this.attr('id').replace('pdPro_', '');
        let step = 1;
        if (name === 's1') step = 5;else if (name === 's2') step = 20;else if (name === 'd1') step = 2;
        $(`<input class="pd_input" data-name="${name}" type="number" value="${parseInt($this.text())}" min="1" step="${step}" ` + `style="width: 65px; margin-right: 5px;" title="${$this.attr('title')}">`).insertAfter($this).focus().select().blur(function () {
            let $this = $(this);
            let name = $this.data('name');
            let num = parseInt($this.val());
            if (num > 0) {
                $points.find(`[name="${name}"]`).val(getPointByProperty(getPointNameByFieldName(name), num)).trigger('change');
            }
            $this.prev().show().end().remove();
        }).keydown(function (e) {
            let $this = $(this);
            if (e.keyCode === 13) $this.blur();else if (e.keyCode === 27) $this.val('').blur();
        });
    }).find('[id^=pdPro_]').css('cursor', 'pointer');
};

/**
 * 处理点数区域
 */
const handlePointsArea = function () {
    $points.find('[type="text"]:not([readonly])').attr('type', 'number').attr('min', 1).attr('max', 9999).prop('required', true).css('width', '60px').addClass('pd_point').next('span').addClass('pd_extra_point').after('<span class="pd_sum_point" style="color: #f03; cursor: pointer;" title="点击：给该项加上或减去剩余属性点"></span>');
    $points.find('input[readonly]').attr('type', 'number').prop('disabled', true).css('width', '60px');

    let [armInfoHtml, finalAddAdditionHtml = ''] = $armArea.html().split('<br><br>', 2);
    let [, weaponInfoHtml = '', armorInfoHtml = ''] = armInfoHtml.split('（装备中）');
    let newArmHtml = '';
    if (weaponInfoHtml) newArmHtml += '（装备中）' + Item.handleUselessSubProperties(weaponInfoHtml);
    if (armorInfoHtml) newArmHtml += '（装备中）' + Item.handleUselessSubProperties(armorInfoHtml);
    if (finalAddAdditionHtml) newArmHtml += '<br><br>' + finalAddAdditionHtml;
    $armArea.html(newArmHtml);

    $(`
<tr>
  <td>
    装备ID和备注
    <span class="pd_cfg_tips" title="可点击右边的“更换装备”按钮，也可手动填写装备ID。留空表示不更换装备。
当文本框内的装备ID发生变化时，点击攻击按钮将会自动更换装备（点击“修改点数分配”按钮只会修改点数而不会更换装备）。">[?]</span>
  </td>
  <td>
    <input class="pd_arm_input" name="weaponId" type="text" value="" maxlength="15" title="武器ID" placeholder="武器ID" style="width: 70px;">
    <input class="pd_arm_input" name="weaponMemo" type="text" value="" maxlength="20" title="武器备注" placeholder="武器备注" style="width: 80px;">
    <input class="pd_arm_input" name="armorId" type="text" value="" maxlength="15" title="护甲ID" placeholder="护甲ID" style="width: 70px;">
    <input class="pd_arm_input" name="armorMemo" type="text" value="" maxlength="20" title="护甲备注" placeholder="护甲备注" style="width: 80px;">
    <a class="pd_btn_link" data-name="changeArm" href="#" title="更换当前装备">更换装备</a>
  </td>
</tr>
`).insertAfter($armArea.parent()).find('[data-name="changeArm"]').click(function (e) {
        e.preventDefault();
        addOrChangeArm(0);
    });

    $(`
<tr>
  <td>
    关键层列表
    <span class="pd_cfg_tips" title="KFOL计算器的关键层列表（各关键层以空格分隔），用于“攻击到下一关键层前”按钮">[?]</span>
  </td>
  <td>
    <input name="keyLevelList" type="text" value="${Config.keyLevelList.join(' ')}" maxlength="100" placeholder="关键层列表" style="width: 200px;">
    <a class="pd_btn_link" data-name="saveKeyLevelList" href="#" title="保存关键层设置">保存</a>
  </td>
</tr>
`).insertBefore($points.find('> tbody > tr:last-child')).find('[data-name="saveKeyLevelList"]').click(function (e) {
        e.preventDefault();
        (0, _Config.read)();
        let value = $.trim($points.find('input[name="keyLevelList"]').val());
        Config.keyLevelList = value.split(' ').map(level => parseInt(level)).filter(level => level > 0);
        (0, _Config.write)();
        alert('设置已保存');
    });

    let $changeCount = $points.find('> tbody > tr:last-child > td:last-child');
    $changeCount.wrapInner('<span id="pdChangeCount"></span>');
    let changeCountMatches = /当前修改配点可用\[(\d+)]次/.exec($changeCount.text());
    if (changeCountMatches) {
        changePointsAvailableCount = parseInt(changeCountMatches[1]);
    }
    let countDownMatches = /\(下次修改配点还需\[(\d+)]分钟\)/.exec($changeCount.text());
    if (countDownMatches) {
        let nextTime = Util.getDate(`+${countDownMatches[1]}m`);
        Util.setCookie(_Const2.default.changePointsInfoCookieName, nextTime.getTime(), nextTime);
    } else {
        let count = parseInt(Util.getCookie(_Const2.default.changePointsInfoCookieName));
        if (count !== changePointsAvailableCount) {
            Util.setCookie(_Const2.default.changePointsInfoCookieName, changePointsAvailableCount + 'c', Util.getDate(`+${_Const2.default.changePointsInfoExpires}m`));
        }
    }

    extraPointsList = {
        '耐力': parseInt($points.find('[name="p"]').next('span').text()),
        '幸运': parseInt($points.find('[name="l"]').next('span').text())
    };

    /**
     * 显示剩余属性点
     */
    const showSurplusPoint = function () {
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
        $('#pdSurplusPoint').prop('hidden', surplusPoint === 0).css('color', surplusPoint !== 0 ? surplusPoint > 0 ? '#f03' : '#393' : '#000').find('em').text((surplusPoint > 0 ? '+' : '') + surplusPoint);
    };

    /**
     * 显示各项点数的额外加成
     * @param {jQuery} $point 点数字段对象
     */
    const showExtraPoint = function ($point) {
        let num = parseInt($point.val());
        if (!num || num < 0) num = 1;
        let extraNum = getExtraPoint(getPointNameByFieldName($point.attr('name')), num);
        $point.next('.pd_extra_point').text('+' + extraNum);
    };

    /**
     * 显示各项点数的和值
     * @param {jQuery} $point 点数字段对象
     */
    const showSumOfPoint = function ($point) {
        let num = parseInt($point.val());
        if (!num || num < 0) num = 1;
        let extraNum = parseInt($point.next('.pd_extra_point').text());
        $point.next('.pd_extra_point').next('.pd_sum_point').text('=' + (num + extraNum));
    };

    /**
     * 显示技能伤害数值
     */
    const showSkillAttack = function () {
        $('#pdSkillAttack').text(getSkillAttack(parseInt($points.find('[name="s1"]').val()) + parseInt($points.find('[name="s1"]').next('.pd_extra_point').text()), parseInt($points.find('[name="s2"]').val()) + parseInt($points.find('[name="s2"]').next('.pd_extra_point').text()), parseInt($points.find('[name="i1"]').val()) + parseInt($points.find('[name="i1"]').next('.pd_extra_point').text())));
    };

    $points.on('change', '.pd_point', function () {
        let $this = $(this);
        showSurplusPoint();
        // showNewLootProperty($this); // 临时禁用
        showExtraPoint($this);
        showSumOfPoint($this);
        // showSkillAttack(); // 临时禁用
    }).on('click', '.pd_sum_point', function () {
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
        if (!surplusPoint) return;
        let $point = $(this).prev('span').prev('.pd_point');
        if (!$point.length) return;
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        num = num + surplusPoint;
        $point.val(num < 1 ? 1 : num).trigger('change');
    }).closest('form').submit(() => {
        Util.deleteCookie(_Const2.default.changePointsInfoCookieName);
        return checkPoints($points);
    }).find('.pd_point').trigger('change');
};

/**
 * 检查点数设置
 * @param {jQuery} $points 点数字段对象
 * @returns {boolean} 检查结果
 */
const checkPoints = function ($points) {
    let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
    if (surplusPoint < 0) {
        alert('剩余属性点为负，请重新填写');
        return false;
    } else if (surplusPoint > 0) {
        if (!confirm('可分配属性点尚未用完，是否继续？')) return false;
    }
    return true;
};

/**
 * 获取争夺属性列表
 * @param {string} html 争夺属性区域的HTML代码
 * @returns {{}} 争夺属性
 */
const getLootPropertyList = function (html) {
    let propertyList = {
        '攻击力': 0,
        '生命值': 0,
        '最大生命值': 0,
        '攻击速度': 0,
        '暴击几率': 0,
        '技能伤害': 0,
        '技能释放概率': 0,
        '防御': 0,
        '可分配属性点': 0
    };
    let matches = /"(\d+)攻击力"/.exec(html);
    if (matches) propertyList['攻击力'] = parseInt(matches[1]);
    matches = /"(\d+)\/(\d+)生命值"/.exec(html);
    if (matches) {
        propertyList['生命值'] = parseInt(matches[1]);
        propertyList['最大生命值'] = parseInt(matches[2]);
    }
    matches = /"(\d+)攻击速度"/.exec(html);
    if (matches) propertyList['攻击速度'] = parseInt(matches[1]);
    /*matches = /暴击几率：(\d+)%/.exec(html);
     if (matches) propertyList['暴击几率'] = parseInt(matches[1]);
     matches = /技能伤害：(\d+)/.exec(html);
     if (matches) propertyList['技能伤害'] = parseInt(matches[1]);
     matches = /技能释放概率：(\d+)%/.exec(html);
     if (matches) propertyList['技能释放概率'] = parseInt(matches[1]);*/ // 临时禁用
    matches = /"(\d+(?:\.\d+)?)%减伤"/.exec(html);
    if (matches) propertyList['防御'] = parseFloat(matches[1]);
    matches = /"(\d+)\s*可分配属性"/.exec(html);
    if (matches) propertyList['可分配属性点'] = parseInt(matches[1]);
    return propertyList;
};

/**
 * 显示新的争夺属性
 * @param {jQuery} $point 点数字段对象
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
            diffValue = newValue - propertyList['攻击力'];
            break;
        case '体质':
            diffValue = newValue - propertyList['最大生命值'];
            break;
        case '敏捷':
            diffValue = newValue - propertyList['攻击速度'];
            break;
        case '灵活':
            diffValue = newValue - propertyList['暴击几率'];
            break;
        case '智力':
            diffValue = newValue - propertyList['技能释放概率'];
            break;
        case '意志':
            diffValue = newValue - propertyList['防御'];
            break;
    }
    $properties.find('#pdPro_' + name).text(newValue).css('color', diffValue !== 0 || oriPoint !== point ? '#00f' : '#000');
    if (pointName === '灵活' || pointName === '智力') {
        let nextLevel = getCurrentLevel(logList) + 1;
        let text = '';
        let extraPoint = getExtraPoint(pointName, point);
        if (nextLevel % 10 === 0) {
            text = getRealProperty(pointName, point + extraPoint, nextLevel, 'BOSS') + '%';
        } else {
            text = getRealProperty(pointName, point + extraPoint, nextLevel, '普通') + '%';
            text += '|' + getRealProperty(pointName, point + extraPoint, nextLevel, '快速') + '%';
        }
        $properties.find('#pdReal_' + name).text(`(${text})`).attr('title', `第${nextLevel}层的实际${pointName === '灵活' ? '暴击几率' : '技能释放概率'} (${nextLevel % 10 === 0 ? 'BOSS' : '普通|快速'})`);
    }

    if (diffValue !== 0 || oriPoint !== point) $properties.find('#pdNew_' + name).text(`(${(diffValue >= 0 ? '+' : '') + diffValue})`).css('color', diffValue >= 0 ? '#f03' : '#393');else $properties.find('#pdNew_' + name).text('');
};

/**
 * 获取当前已分配的点数
 * @param {jQuery} $points 点数字段对象
 * @returns {number} 当前已分配的点数
 */
const getCurrentAssignedPoint = exports.getCurrentAssignedPoint = function ($points) {
    let usedPoint = 0;
    $points.each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        let point = parseInt($this.val());
        if (point && point > 0) usedPoint += point;
    });
    return usedPoint;
};

/**
 * 获取技能伤害的值
 * @param {number} power 力量总和
 * @param {number} life 体质总和
 * @param {number} intelligence 智力总和
 * @returns {number} 技能伤害的值
 */
const getSkillAttack = exports.getSkillAttack = (power, life, intelligence) => power * 5 + life * 5 + intelligence * 5;

/**
 * 根据字段名称获取点数名称
 * @param {string} fieldName 字段名称
 * @returns {string} 点数名称
 */
const getPointNameByFieldName = exports.getPointNameByFieldName = function (fieldName) {
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
        case 'weaponId':
            return '武器ID';
        case 'weaponMemo':
            return '武器备注';
        case 'armorId':
            return '护甲ID';
        case 'armorMemo':
            return '护甲备注';
        default:
            return '';
    }
};

/**
 * 根据点数名称获取字段名称
 * @param {string} pointName 点数名称
 * @returns {string} 字段名称
 */
const getFieldNameByPointName = exports.getFieldNameByPointName = function (pointName) {
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
        case '武器ID':
            return 'weaponId';
        case '武器备注':
            return 'weaponMemo';
        case '护甲ID':
            return 'armorId';
        case '护甲备注':
            return 'armorMemo';
        default:
            return '';
    }
};

/**
 * 根据指定的点数获得相应额外加成点数
 * @param {string} pointName 点数名称
 * @param {number} point 点数的值
 * @returns {number} 额外加成点数
 */
const getExtraPoint = exports.getExtraPoint = function (pointName, point) {
    let elapsedMedicine = itemUsedNumList.get('消逝之药') * 5;
    let haloPercent = haloInfo['全属性'];
    switch (pointName) {
        case '力量':
            return Math.floor(point * haloPercent) + itemUsedNumList.get('蕾米莉亚同人漫画') + elapsedMedicine;
        case '体质':
            return Math.floor(point * haloPercent) + itemUsedNumList.get('蕾米莉亚同人漫画') + elapsedMedicine;
        case '敏捷':
            return Math.floor(point * haloPercent) + itemUsedNumList.get('十六夜同人漫画') + elapsedMedicine;
        case '灵活':
            return Math.floor(point * haloPercent) + itemUsedNumList.get('十六夜同人漫画') + elapsedMedicine;
        case '智力':
            return Math.floor(point * haloPercent) + elapsedMedicine;
        case '意志':
            return Math.floor((Math.floor(point * haloPercent) + elapsedMedicine + point) * (currentArmInfo.get('护甲')['组别'] === '铠甲' ? 1.1 : 1)) - point;
        default:
            return 0;
    }
};

/**
 * 根据指定的点数获得相应争夺属性的值
 * @param {string} pointName 点数名称
 * @param {number} point 点数的值
 * @returns {number} 争夺属性的值
 */
const getPropertyByPoint = exports.getPropertyByPoint = function (pointName, point) {
    let pointValue = point + getExtraPoint(pointName, point);
    switch (pointName) {
        case '力量':
            return pointValue * 5 + haloInfo['攻击力'];
        case '体质':
            return pointValue * 20 + (itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0) + haloInfo['生命值'];
        case '敏捷':
            return pointValue * 2 + (itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0);
        case '灵活':
            return Math.round(pointValue / (pointValue + 100) * 100);
        case '智力':
            return Math.round(pointValue / (pointValue + 90) * 100);
        case '意志':
            return Math.round(pointValue / (pointValue + 150) * 100);
        default:
            return 0;
    }
};

/**
 * 根据指定的争夺属性获得相应点数的值
 * @param {string} pointName 点数名称
 * @param {number} num 争夺属性的值
 * @returns {number} 点数的值
 */
const getPointByProperty = exports.getPointByProperty = function (pointName, num) {
    let elapsedMedicine = itemUsedNumList.get('消逝之药') * 5;
    let haloPercent = 1 + haloInfo['全属性'];
    let value = 0;
    switch (pointName) {
        case '力量':
            value = Math.ceil((Math.ceil((num - haloInfo['攻击力']) / 5) - itemUsedNumList.get('蕾米莉亚同人漫画') - elapsedMedicine) / haloPercent);
            break;
        case '体质':
            value = Math.ceil((Math.ceil((num - haloInfo['生命值'] - (itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0)) / 20) - itemUsedNumList.get('蕾米莉亚同人漫画') - elapsedMedicine) / haloPercent);
            break;
        case '敏捷':
            value = Math.ceil((Math.ceil((num - (itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0)) / 2) - itemUsedNumList.get('十六夜同人漫画') - elapsedMedicine) / haloPercent);
            break;
        case '灵活':
            value = Math.floor((Math.round(100 * num / (100 - num)) - itemUsedNumList.get('十六夜同人漫画') - elapsedMedicine) / haloPercent);
            break;
        case '智力':
            value = Math.floor((Math.round(90 * num / (100 - num)) - elapsedMedicine) / haloPercent);
            break;
        case '意志':
            value = Math.floor((Math.round(150 * num / (100 - num)) - elapsedMedicine) / haloPercent);
            break;
    }
    if (!isFinite(value) || value < 1) value = 1;
    return value;
};

/**
 * 获取实际的争夺属性（暴击几率或技能释放概率）
 * @param {string} pointName 点数名称
 * @param {number} totalPoint 合计点数
 * @param {number} level 指定层数
 * @param {string} enemy 遭遇敌人名称
 * @returns {number} 实际的争夺属性
 */
const getRealProperty = exports.getRealProperty = function (pointName, totalPoint, level, enemy) {
    const npcStepNum = 2; // NPC递增数值
    const antiCoefficient = 3; // 抵消系数
    const coefficient = { '普通': 1, '强壮': 1, '快速': 1.5, '睿智': 1, '坚强': 1, 'BOSS': 1.2 }; // NPC强化系数列表
    const cardinalNum = pointName === '灵活' ? 100 : 90; // 基数

    let npcPoint = Math.round(level * npcStepNum * coefficient[enemy]);
    let realPoint = Math.max(totalPoint - Math.round((npcPoint + totalPoint) / antiCoefficient), 0);
    return Math.round(realPoint / (realPoint + cardinalNum) * 100);
};

/**
 * 添加各层点数分配方案选择框
 */
const addLevelPointListSelect = function () {
    $(`
<tr>
  <td colspan="2">
    <select id="pdLevelPointListSelect" style="margin: 5px 0;">
      <option>点数分配方案</option>
      <option value="0">默认</option>
    </select>
    <a class="pd_btn_link" data-name="save" href="#" title="将当前点数设置保存为新的方案">保存</a>
    <a class="pd_btn_link" data-name="edit" href="#" title="编辑各层点数分配方案">编辑</a>
    <a class="pd_btn_link" data-name="fill" href="#" title="输入一串数字按顺序填充到各个点数字段中">填充</a>
  </td>
</tr>`).prependTo($points.find('> tbody')).find('#pdLevelPointListSelect').change(function () {
        let level = parseInt($(this).val());
        if (level > 0) {
            let points = Config.levelPointList[parseInt(level)];
            if (typeof points !== 'object') return;
            $points.find('.pd_point, .pd_arm_input').each(function () {
                let $this = $(this);
                let pointName = getPointNameByFieldName($this.attr('name'));
                $this.val(points[pointName]);
            }).trigger('change');
        } else if (level === 0) {
            $points.find('.pd_point, .pd_arm_input').each(function () {
                $(this).val(this.defaultValue);
            }).trigger('change');
        }
    }).end().find('[data-name="save"]').click(function (e) {
        e.preventDefault();
        if (!checkPoints($points)) return;
        let $levelPointListSelect = $('#pdLevelPointListSelect');
        let level = parseInt($levelPointListSelect.val());
        level = parseInt(prompt('请输入层数：', level ? level : ''));
        if (!level || level < 0) return;

        (0, _Config.read)();
        if (level in Config.levelPointList) {
            if (!confirm('该层数已存在，是否覆盖？')) return;
        }
        let points = {};
        for (let elem of Array.from($points.find('.pd_point, .pd_arm_input'))) {
            let $elem = $(elem);
            let name = $elem.attr('name');
            let value = $.trim($elem.val());
            if ($elem.is('.pd_point')) {
                value = parseInt(value);
                if (!value || value < 0) return;
            } else {
                if (!value) continue;
                if (name === 'weaponId' || name === 'armorId') {
                    value = parseInt(value);
                    if (!value || value < 0) return;
                }
            }
            points[getPointNameByFieldName(name)] = value;
        }
        Config.levelPointList[level] = points;
        (0, _Config.write)();
        setLevelPointListSelect(Config.levelPointList);
        $levelPointListSelect.val(level);
    }).end().find('[data-name="edit"]').click(function (e) {
        e.preventDefault();
        showLevelPointListConfigDialog();
    }).end().find('[data-name="fill"]').click(function (e) {
        e.preventDefault();
        fillPoints($points);
    });
    setLevelPointListSelect(Config.levelPointList);
};

/**
 * 填充点数设置
 * @param $points
 */
const fillPoints = function ($points) {
    let value = $.trim(prompt(`请输入以任意字符分隔的一串数字，按顺序填充到各个点数字段中（注：5位数以上的数字将被当作装备ID）：
可直接输入计算器输出的点数设置，例：1 100 50 5 25 1  0 3 Bow #1234567 Cloth #7654321`));
    if (!value) return;
    let pointsMatches = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\d+\s+\d+\s+(\S+)\s+#(\d+)\s+(\S+)\s+#(\d+)/.exec(value);
    if (!pointsMatches) {
        pointsMatches = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\d+\s+(\S+)\s+#(\d+)/.exec(value);
    }
    if (pointsMatches) {
        $points.find('.pd_point').each(function (index) {
            if (index + 1 < pointsMatches.length) {
                $(this).val(pointsMatches[index + 1]).trigger('change');
            }
        });
        $points.find('input[name="weaponMemo"]').val(pointsMatches[7]);
        $points.find('input[name="weaponId"]').val(pointsMatches[8]);
        if (pointsMatches[9] && pointsMatches[10]) {
            $points.find('input[name="armorMemo"]').val(pointsMatches[9]);
            $points.find('input[name="armorId"]').val(pointsMatches[10]);
        }
    } else {
        let numMatches = value.match(/\b\d{1,4}\b/g);
        if (!numMatches) return;
        $points.find('.pd_point').each(function (index) {
            if (index < numMatches.length) $(this).val(parseInt(numMatches[index])).trigger('change');else return false;
        });
        let armIdMatches = value.match(/\b(\d{5,})\b/g);
        for (let i in armIdMatches) {
            let name = parseInt(i) === 0 ? 'weaponId' : 'armorId';
            $points.find(`input[name="${name}"]`).val(armIdMatches[i]);
        }
    }
};

/**
 * 设置各层点数分配方案选择框
 * @param {{}} levelPointList 各层点数分配列表
 */
const setLevelPointListSelect = function (levelPointList) {
    let pointListHtml = '';
    for (let [level, points] of Util.entries(levelPointList)) {
        if (!$.isNumeric(level)) continue;
        pointListHtml += `<option value="${level}">第${level}层 ${points['武器ID'] || points['护甲ID'] ? '(装)' : ''}</option>`;
    }
    $('#pdLevelPointListSelect').find('option:gt(1)').remove().end().append(pointListHtml);
};

/**
 * 添加攻击相关按钮
 */
const addAttackBtns = function () {
    $(`
<div id="pdAttackBtns" class="pd_result" style="margin-top: 5px;">
  <label>
    <input class="pd_input" name="autoChangeLevelPointsEnabled" type="checkbox" ${Config.autoChangeLevelPointsEnabled ? 'checked' : ''}>
    自动修改点数分配方案
    <span class="pd_cfg_tips" title="在攻击时可自动修改为相应层数的点数分配方案（仅限自动攻击相关按钮有效）">[?]</span>
  </label>
  <label>
    <input class="pd_input" name="customPointsScriptEnabled" type="checkbox" ${Config.customPointsScriptEnabled ? 'checked' : ''} 
${typeof _Const2.default.getCustomPoints !== 'function' ? 'disabled' : ''}> 使用自定义脚本
    <span class="pd_cfg_tips" title="使用自定义点数分配脚本（仅限自动攻击相关按钮有效，需正确安装自定义脚本后此项才可勾选）">[?]</span>
  </label>
  <label>
    <input class="pd_input" name="unusedPointNumAlertEnabled" type="checkbox" ${Config.unusedPointNumAlertEnabled ? 'checked' : ''}>
    有剩余属性点时提醒
    <span class="pd_cfg_tips" title="在攻击时如有剩余属性点则进行提醒（仅限自动攻击相关按钮有效）">[?]</span>
  </label>
  <label>
    <input class="pd_input" name="slowAttackEnabled" type="checkbox" ${Config.slowAttackEnabled ? 'checked' : ''}> 慢速
    <span class="pd_cfg_tips" title="延长每次攻击的时间间隔（在4~7秒之间）">[?]</span>
  </label>
  <label>
    <input class="pd_input" name="alwaysOpenPointAreaEnabled" type="checkbox" ${Config.alwaysOpenPointAreaEnabled ? 'checked' : ''}> 总是打开属性界面
    <span class="pd_cfg_tips" title="总是打开个人属性/装备界面">[?]</span>
  </label><br>
  <button name="autoAttack" type="button" title="自动攻击到指定层数">自动攻击</button>
  <button name="onceAttack" type="button" title="自动攻击一层">一层</button>
  <button name="nextKeyLevelAttack" type="button" title="攻击到下一关键层之前">到下一关键层前</button>
  <span style="color: #888;">|</span>
  <button name="manualAttack" type="button" title="手动攻击一层，会按照当前页面上发生变化了的点数设置和装备ID自动修改点数以及更换装备">手动攻击</button>
  <span class="pd_cfg_tips" title="在不勾选“自动修改点数分配方案”或“使用自定义脚本”的情况下，点击所有的攻击按钮均会按照当前页面上的点数设置和装备ID自动修改点数以及更换装备。
（注：只有在当前页面上点数设置或装备ID发生变化的情况下才会自动提交相应设置）。
在勾选上述两种选项的情况下，点击自动攻击相关按钮会自动按照预设的点数分配方案或脚本返回的值修改点数及更换装备。而手动攻击按钮则无视这俩选项，依然按照前一种情况进行操作。">[?]</span>
</div>
`).insertAfter('#wdsx').on('click', 'button[name$="Attack"]', function () {
        if (/你被击败了/.test(log)) {
            alert('你已经被击败了');
            return;
        }
        if ($('.pd_mask').length > 0) return;
        let $this = $(this);
        let name = $this.attr('name');
        let targetLevel = 0;

        let type = name === 'manualAttack' ? 'manual' : 'auto';
        if (name === 'nextKeyLevelAttack') {
            let value = $.trim($points.find('input[name="keyLevelList"]').val());
            let keyLevelList = value.split(' ').map(level => parseInt(level)).filter(level => level > 0);
            if (!keyLevelList.length) {
                alert('没有设置关键层');
                return;
            }
            let currentLevel = getCurrentLevel(logList);
            targetLevel = Math.min(...keyLevelList.filter(level => level > currentLevel + 1)) - 1;
        } else if (type === 'auto') {
            let value = '+1';
            if (name === 'autoAttack') {
                let prevTargetLevel = $this.data('prevTargetLevel');
                value = $.trim(prompt('攻击到第几层？（0表示攻击到被击败为止，+n表示攻击到当前层数+n层）', prevTargetLevel ? prevTargetLevel : Config.attackTargetLevel));
            }
            if (!/\+?\d+/.test(value)) return;
            if (value.startsWith('+')) {
                let currentLevel = getCurrentLevel(logList);
                targetLevel = currentLevel + parseInt(value);
            } else targetLevel = parseInt(value);
            if (isNaN(targetLevel) || targetLevel < 0) return;
            if (name === 'autoAttack') $this.data('prevTargetLevel', value);
        }

        Msg.destroy();
        $('#pdLootLogHeader').find('[data-name="end"]').click();
        let autoChangePointsEnabled = (Config.autoChangeLevelPointsEnabled || Config.customPointsScriptEnabled && typeof _Const2.default.getCustomPoints === 'function') && type === 'auto';
        if (!autoChangePointsEnabled && !checkPoints($points)) return;
        lootAttack({ type, targetLevel, autoChangePointsEnabled, safeId });
    }).on('click', '.pd_cfg_tips', () => false).on('click', 'input[type="checkbox"]', function () {
        let $this = $(this);
        let name = $this.attr('name');
        let checked = $this.prop('checked');
        if (name in Config && Config[name] !== checked) {
            (0, _Config.read)();
            Config[name] = checked;
            (0, _Config.write)();
        }
    }).find('[name="customPointsScriptEnabled"]').click(function () {
        let $this = $(this);
        if ($this.prop('disabled')) return;
        $('[name="autoChangeLevelPointsEnabled"]').prop('disabled', $this.prop('checked'));
    }).triggerHandler('click');
};

/**
 * 争夺攻击
 * @param {string} type 攻击类型，auto：自动攻击；manual：手动攻击
 * @param {number} targetLevel 目标层数（设为0表示攻击到被击败为止，仅限自动攻击有效）
 * @param {boolean} autoChangePointsEnabled 是否自动修改点数分配方案
 * @param {string} safeId SafeID
 */
const lootAttack = exports.lootAttack = function ({ type, targetLevel, autoChangePointsEnabled, safeId }) {
    let initCurrentLevel = getCurrentLevel(logList);
    if (targetLevel > 0 && targetLevel <= initCurrentLevel) return;
    let $wait = Msg.wait(`<strong>正在攻击中，请稍等&hellip;</strong><i>当前层数：<em class="pd_countdown">${initCurrentLevel}</em></i>` + '<a class="pd_stop_action pd_highlight" href="#">停止操作</a><a href="/" target="_blank">浏览其它页面</a>');
    let index = 0;
    let isStop = false;

    /**
     * 记录点数分配记录
     * @param {boolean} isSubmit 是否提交分配点数
     */
    const recordPointsLog = function (isSubmit = false) {
        propertyList = getLootPropertyList($properties.html());
        let armsText = '',
            pointsText = '',
            propertiesText = '';

        let weaponId = parseInt($points.find('input[name="weaponId"]').val());
        let weaponMemo = $.trim($points.find('input[name="weaponMemo"]').val());
        if (weaponId > 0) {
            armsText += `武器ID：${weaponId}${weaponMemo ? '，武器备注：' + weaponMemo : ''}`;
        }
        let armorId = parseInt($points.find('input[name="armorId"]').val());
        let armorMemo = $.trim($points.find('input[name="armorMemo"]').val());
        if (armorId > 0) {
            armsText += `${armsText ? '；' : ''}护甲ID：${armorId}${armorMemo ? '，护甲备注：' + armorMemo : ''}`;
        }

        $points.find('.pd_point').each(function () {
            let $this = $(this);
            let pointName = getPointNameByFieldName($this.attr('name'));
            let point = parseInt($this.val());
            let extraPoint = getExtraPoint(pointName, point);
            pointsText += `${pointName}：${point}+${extraPoint}=${point + extraPoint}，`;
        });

        pointsText = pointsText.replace(/，$/, '');
        for (let [key, value] of Util.entries(propertyList)) {
            if (key === '可分配属性点' || key === '生命值') continue;
            let unit = '';
            if (key.endsWith('率') || key === '防御') unit = '%';
            propertiesText += `${key}：${value}${unit}，`;
        }
        propertiesText = propertiesText.replace(/，$/, '');
        //pointsLogList[getCurrentLevel(logList) + 1] = `点数方案（${pointsText}）\n争夺属性（${propertiesText}）`;
        pointsLogList[getCurrentLevel(logList) + 1] = `${armsText ? `装备信息（${armsText}）\n` : ''}点数方案（${pointsText}）`; // 临时修改
        localStorage.setItem(_Const2.default.tempPointsLogListStorageName + '_' + _Info2.default.uid, JSON.stringify({ time: $.now(), pointsLogList }));
        //if (isSubmit) console.log(`【分配点数】点数方案（${pointsText}）；争夺属性（${propertiesText}）`);
        if (isSubmit) {
            if (armsText) {
                console.log(`【更换武器】装备信息（${armsText}）`);
            }
            console.log(`【分配点数】点数方案（${pointsText}）`);
        } // 临时修改
    };

    /**
     * 修改点数分配方案和装备
     * @param {number} nextLevel 下一层（设为-1表示采用当前点数分配方案）
     * @param {function} callback 回调函数
     */
    const changePointsAndArms = function (nextLevel, callback) {
        if (nextLevel > 0 && Config.customPointsScriptEnabled && typeof _Const2.default.getCustomPoints === 'function') {
            let points = null;
            try {
                points = _Const2.default.getCustomPoints($.extend(getLootInfo(), { getExtraPoint, getPointByProperty, getPropertyByPoint }));
            } catch (ex) {
                console.log(ex);
            }
            if ($.type(points) === 'object') {
                for (let [key, value] of Util.entries(points)) {
                    $points.find(`input[name="${getFieldNameByPointName(key)}"]`).val(value).trigger('change');
                }
                nextLevel = -1;
            } else if (typeof points === 'number') {
                nextLevel = parseInt(points);
                nextLevel = nextLevel > 1 ? nextLevel : 1;
            } else if (points === false) {
                recordPointsLog();
                return callback('ignore');
            } else return callback('error');
        }

        let nextLevelText = getCurrentLevel(logList) + 1;
        let changeLevel = nextLevel > 0 ? Math.max(...Object.keys(Config.levelPointList).filter(level => level <= nextLevel)) : -1;
        let $levelPointListSelect = $('#pdLevelPointListSelect');
        if (changeLevel > 0) $levelPointListSelect.val(changeLevel).trigger('change');else $levelPointListSelect.get(0).selectedIndex = 0;
        let isChangeWeapon = false,
            isChangeArmor = false,
            isChangePoints = false;
        $points.find('.pd_point, input[name="weaponId"], input[name="armorId"]').each(function () {
            let $this = $(this);
            let name = $this.attr('name');
            let value = $.trim($this.val());
            if (parseInt(value) > 0 && this.defaultValue !== value) {
                if (name === 'weaponId') isChangeWeapon = true;else if (name === 'armorId') isChangeArmor = true;else isChangePoints = true;
            }
        });

        if (isChangeWeapon || isChangeArmor || isChangePoints) {
            if (Config.unusedPointNumAlertEnabled && !_Info2.default.w.unusedPointNumAlert && parseInt($('#pdSurplusPoint > em').text()) > 0) {
                if (confirm('可分配属性点尚未用完，是否继续攻击？')) _Info2.default.w.unusedPointNumAlert = true;else return callback('error');
            }

            let weaponId = parseInt($points.find('input[name="weaponId"]').val());
            let armorId = parseInt($points.find('input[name="armorId"]').val());
            let ajaxList = ['ignore', 'ignore', 'ignore'];
            if (isChangeWeapon) {
                ajaxList[0] = {
                    type: 'POST',
                    url: 'kf_fw_ig_mybpdt.php',
                    timeout: _Const2.default.defAjaxTimeout,
                    data: `do=4&id=${weaponId}&safeid=${safeId}`
                };
            }
            if (isChangeArmor) {
                ajaxList[1] = {
                    type: 'POST',
                    url: 'kf_fw_ig_mybpdt.php',
                    timeout: _Const2.default.defAjaxTimeout,
                    data: `do=4&id=${armorId}&safeid=${safeId}`
                };
            }
            if (isChangePoints) {
                ajaxList[2] = {
                    type: 'POST',
                    url: 'kf_fw_ig_enter.php',
                    timeout: _Const2.default.defAjaxTimeout,
                    data: $points.closest('form').serialize()
                };
            }

            let result = 'success';
            $(document).clearQueue('ChangePointsAndArms');
            $.each(ajaxList, function (index, ajax) {
                if (ajax === 'ignore') return;
                $(document).queue('ChangePointsAndArms', function () {
                    $.ajax(ajax).done(function (html) {
                        if (index === 0) {
                            let msg = Util.removeHtmlTag(html);
                            if (/装备完毕/.test(msg)) {
                                $points.find('input[name="weaponId"], input[name="weaponMemo"]').each(function () {
                                    this.defaultValue = $(this).val();
                                });
                                if (Config.autoSaveArmsInfoEnabled) {
                                    let armsInfo = Item.readArmsInfo();
                                    armsInfo['已装备武器'] = weaponId;
                                    Item.writeArmsInfo(armsInfo);
                                }
                            } else {
                                Msg.show(`<strong>更换武器：${msg}</strong>`, -1);
                                Script.runFunc('Loot.lootAttack_changePoints_error_', msg);
                                result = 'error';
                            }
                        } else if (index === 1) {
                            let msg = Util.removeHtmlTag(html);
                            if (/装备完毕/.test(msg)) {
                                $points.find('input[name="armorId"], input[name="armorMemo"]').each(function () {
                                    this.defaultValue = $(this).val();
                                });
                                if (Config.autoSaveArmsInfoEnabled) {
                                    let armsInfo = Item.readArmsInfo();
                                    armsInfo['已装备护甲'] = armorId;
                                    Item.writeArmsInfo(armsInfo);
                                }
                            } else {
                                Msg.show(`<strong>更换护甲：${msg}</strong>`, -1);
                                Script.runFunc('Loot.lootAttack_changePoints_error_', msg);
                                result = 'error';
                            }
                        } else if (index === 2) {
                            let { msg } = Util.getResponseMsg(html);
                            if (/已经重新配置加点！/.test(msg)) {
                                Util.deleteCookie(_Const2.default.changePointsInfoCookieName);
                                $points.find('.pd_point').each(function () {
                                    this.defaultValue = $(this).val();
                                });
                            } else {
                                let matches = /你还需要等待(\d+)分钟/.exec(msg);
                                if (matches) {
                                    let nextTime = Util.getDate(`+${parseInt(matches[1])}m`);
                                    Util.setCookie(_Const2.default.changePointsInfoCookieName, nextTime.getTime(), nextTime);
                                }
                                Msg.show(`<strong>第<em>${nextLevelText}</em>层方案：${msg}</strong>`, -1);
                                Script.runFunc('Loot.lootAttack_changePoints_error_', msg);
                                result = 'error';
                            }
                        }
                    }).fail(function () {
                        result = 'timeout';
                    }).always(function () {
                        if (result === 'error' || result === 'timeout') {
                            $(document).clearQueue('ChangePointsAndArms');
                            callback(result);
                        } else if (!$(document).queue('ChangePointsAndArms').length) {
                            recordPointsLog(true);
                            Script.runFunc('Loot.lootAttack_changePoints_success_');
                            callback(result);
                        } else {
                            setTimeout(() => $(document).dequeue('ChangePointsAndArms'), _Const2.default.minActionInterval);
                        }
                    });
                });
            });
            $(document).dequeue('ChangePointsAndArms');
        } else {
            if (nextLevelText === 1) recordPointsLog();
            callback('ignore');
        }
    };

    /**
     * 准备攻击（用于自动修改点数分配方案）
     * @param {number} currentLevel 当前层数（设为-1表示采用当前点数分配方案）
     * @param {number} interval 下次攻击的间隔时间
     */
    const ready = function (currentLevel, interval = _Const2.default.lootAttackInterval) {
        changePointsAndArms(currentLevel >= 0 ? currentLevel + 1 : -1, function (result) {
            if (result === 'ignore') {
                setTimeout(attack, typeof interval === 'function' ? interval() : interval);
            } else if (result === 'timeout') {
                setTimeout(() => ready(currentLevel, interval), _Const2.default.minActionInterval);
            } else if (result === 'success') {
                setTimeout(function () {
                    updateLootInfo(function () {
                        setTimeout(attack, typeof interval === 'function' ? interval() : interval);
                    });
                }, _Const2.default.defAjaxInterval);
            }
            if (result === 'error') {
                Msg.remove($wait);
            }
        });
    };

    /**
     * 攻击
     */
    const attack = function () {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_intel.php',
            data: { 'safeid': safeId },
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            index++;
            if (Config.autoLootEnabled) Util.setCookie(_Const2.default.lootAttackingCookieName, 1, Util.getDate(`+${_Const2.default.lootAttackingExpires}m`));
            if (!/你\(\d+\)遭遇了/.test(html) || index % _Const2.default.lootAttackPerCheckLevel === 0) {
                setTimeout(() => updateLootInfo(after), _Const2.default.defAjaxInterval);
                return;
            }
            log = html + log;
            after(false);
            Script.runFunc('Loot.lootAttack_attack_after_', html);
        }).fail(function () {
            console.log('【争夺攻击】超时重试...');
            setTimeout(() => updateLootInfo(after), typeof _Const2.default.lootAttackInterval === 'function' ? _Const2.default.lootAttackInterval() : _Const2.default.lootAttackInterval);
        });
    };

    /**
     * 攻击之后
     * @param {boolean} isChecked 是否已检查过争夺记录
     */
    const after = function (isChecked = true) {
        logList = getLogList(log);
        levelInfoList = getLevelInfoList(logList);
        showEnhanceLog(logList, levelInfoList, pointsLogList);
        showLogStat(levelInfoList);
        let currentLevel = getCurrentLevel(logList);
        console.log('【争夺攻击】当前层数：' + currentLevel);
        let $countdown = $('.pd_countdown:last');
        $countdown.text(currentLevel);
        $points.find('.pd_point').each(function () {
            //showNewLootProperty($(this)); // 临时禁用
        });
        let info = levelInfoList[currentLevel];
        $properties.find('#pdCurrentLife').text(info ? info.life : 0);

        let isFail = /你被击败了/.test(log);
        isStop = isFail || isStop || type !== 'auto' || targetLevel && currentLevel >= targetLevel || $countdown.closest('.pd_msg').data('stop');
        if (isStop) {
            if (Config.autoLootEnabled) {
                Util.deleteCookie(_Const2.default.lootCheckingCookieName);
                Util.deleteCookie(_Const2.default.lootAttackingCookieName);
                Util.setCookie(_Const2.default.lootCompleteCookieName, 1, getAutoLootCookieDate());
            }
            if (isFail) {
                if (isChecked) {
                    Msg.remove($wait);
                    recordLootInfo(logList, levelInfoList, pointsLogList);
                } else setTimeout(() => updateLootInfo(after), _Const2.default.defAjaxInterval);
                Script.runFunc('Loot.lootAttack_complete_');
            } else {
                if (!isChecked) setTimeout(() => updateLootInfo, _Const2.default.defAjaxInterval);
                Msg.remove($wait);
                Msg.show(`<strong>你成功击败了第<em>${currentLevel}</em>层的NPC</strong>`, -1);
                Script.runFunc('Loot.lootAttack_after_');
            }
        } else {
            if (autoChangePointsEnabled) setTimeout(() => ready(currentLevel), _Const2.default.minActionInterval);else setTimeout(attack, typeof _Const2.default.lootAttackInterval === 'function' ? _Const2.default.lootAttackInterval() : _Const2.default.lootAttackInterval);
        }
    };

    ready(autoChangePointsEnabled ? initCurrentLevel : -1, 0);
};

/**
 * 更新争夺信息
 * @param {function} callback 回调函数
 */
const updateLootInfo = exports.updateLootInfo = function (callback = null) {
    console.log('更新争夺信息Start');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout
    }).done(function (html) {
        let $area = $('#wdsx', html).parent();
        log = $area.find('#pk_text').html();
        if (!log) {
            Msg.remove($('.pd_countdown').closest('.pd_msg'));
            return;
        }

        $area.find('.kf_fw_ig3:first input[type="text"]').each(function (index) {
            let value = $.trim($(this).val());
            if (!value) return;
            $properties.find(`input[type="text"]:eq(${index})`).val(value);
        });

        let countDownMatches = /\(下次修改配点还需\[(\d+)]分钟\)/.exec(html);
        if (countDownMatches) {
            changePointsAvailableCount = 0;
            let nextTime = Util.getDate(`+${countDownMatches[1]}m`);
            Util.setCookie(_Const2.default.changePointsInfoCookieName, nextTime.getTime(), nextTime);
            $points.find('#pdChangeCount').text(`(下次修改配点还需[${countDownMatches[1]}]分钟)`);
        }
        let changeCountMatches = /当前修改配点可用\[(\d+)]次/.exec(html);
        if (changeCountMatches) {
            changePointsAvailableCount = parseInt(changeCountMatches[1]);
            Util.setCookie(_Const2.default.changePointsInfoCookieName, changePointsAvailableCount + 'c', Util.getDate(`+${_Const2.default.changePointsInfoExpires}m`));
            $points.find('#pdChangeCount').text(`(当前修改配点可用[${changePointsAvailableCount}]次)`);
        }

        let armHtml = $area.find('.kf_fw_ig1:first > tbody > tr:first-child > td').html();
        if (armHtml.includes('（装备中）')) {
            let [armInfoHtml, finalAddAdditionHtml = ''] = armHtml.split('<br><br>', 2);
            let [, weaponInfoHtml = '', armorInfoHtml = ''] = armInfoHtml.split('（装备中）');
            let newArmHtml = '';
            if (weaponInfoHtml) newArmHtml += '（装备中）' + Item.handleUselessSubProperties(weaponInfoHtml);
            if (armorInfoHtml) newArmHtml += '（装备中）' + Item.handleUselessSubProperties(armorInfoHtml);
            if (finalAddAdditionHtml) newArmHtml += '<br><br>' + finalAddAdditionHtml;
            $armArea.html(newArmHtml);

            currentArmInfo.set('武器', Item.getArmInfo(weaponInfoHtml));
            currentArmInfo.set('护甲', Item.getArmInfo(armorInfoHtml));
        }

        let propertiesHtml = $properties.html();
        propertyList = getLootPropertyList(propertiesHtml);
        itemUsedNumList = Item.getItemsUsedNumInfo(propertiesHtml);
        armsLevelList = Item.getArmsLevelInfo(propertiesHtml);
        $properties.find('.pd_arm_level').trigger('change');
        $points.find('.pd_point').trigger('change');

        if (typeof callback === 'function') callback();
        Script.runFunc('Loot.updateLootInfo_after_', html);
    }).fail(function () {
        setTimeout(() => updateLootInfo(callback), _Const2.default.defAjaxInterval);
    });
};

/**
 * 获取当前争夺信息
 * @returns {{}} 当前争夺信息
 */
const getLootInfo = exports.getLootInfo = function () {
    let currentLevel = getCurrentLevel(logList);
    let info = levelInfoList[currentLevel];
    let currentLife = 0,
        currentInitLife = 0;
    if (info) {
        currentLife = info.life;
        currentInitLife = info.initLife;
    }
    let enemyList = getEnemyList(levelInfoList);
    return {
        currentLevel,
        currentLife,
        currentInitLife,
        levelPointList: Config.levelPointList,
        availablePoint: propertyList['可分配属性点'],
        haloInfo,
        extraPointsList,
        propertyList,
        itemUsedNumList,
        armsLevelList,
        currentArmInfo,
        changePointsAvailableCount,
        log,
        logList,
        enemyList
    };
};

/**
 * 记录争夺信息
 * @param {string[]} logList 各层争夺记录列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
const recordLootInfo = function (logList, levelInfoList, pointsLogList) {
    Util.setCookie(_Const2.default.lootCompleteCookieName, 2, getAutoLootCookieDate());
    localStorage.removeItem(_Const2.default.tempPointsLogListStorageName + '_' + _Info2.default.uid);

    let allEnemyList = {};
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList))) {
        allEnemyList[enemy] = num;
    }
    let allEnemyStat = '';
    for (let [enemy, num] of Util.entries(allEnemyList)) {
        allEnemyStat += enemy + '`+' + num + '` ';
    }

    let latestEnemyList = {};
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList.filter((elem, level) => level >= logList.length - _Const2.default.enemyStatLatestLevelNum)))) {
        latestEnemyList[enemy] = num;
    }
    let latestEnemyStat = '';
    for (let [enemy, num] of Util.entries(latestEnemyList)) {
        latestEnemyStat += enemy + '`+' + num + '` ';
    }

    let currentLevel = getCurrentLevel(logList);
    let { boxNum, boxes } = getTotalGain(levelInfoList);
    if (!$.isEmptyObject(boxes)) {
        Log.push('争夺攻击', `你成功击败了第\`${currentLevel - 1}\`层的NPC (${allEnemyStat.trim()})`, { gain: { '盒子': boxNum, 'box': boxes } });
        LootLog.record(logList, pointsLogList);
    }
    let boxesStat = '';
    for (let key of Util.getSortedObjectKeyList(Item.boxTypeList, boxes)) {
        boxesStat += `<i>${key}<em>+${boxes[key].toLocaleString()}</em></i>`;
    }
    Msg.show(`<strong>你被第<em>${currentLevel}</em>层的NPC击败了</strong>${boxesStat.length > 75 ? '<br>' : ''}${boxesStat}`, Config.autoSaveLootLogInSpecialCaseEnabled ? Config.defShowMsgDuration : -1);

    if (Config.autoGetDailyBonusEnabled && Config.getBonusAfterLootCompleteEnabled) {
        Util.deleteCookie(_Const2.default.getDailyBonusCookieName);
        Public.getDailyBonus();
    }
    Script.runFunc('Loot.recordLootLog_after_');
};

/**
 * 显示各层点数分配方案对话框
 */
const showLevelPointListConfigDialog = function (callback) {
    const dialogName = 'pdLevelPointListConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <div style="margin: 5px 0; line-height: 1.6em;">
    请填写各层对应的点数分配方案，相邻层数如数值完全相同的话，则只保留最前面的一层<br>
    （例：11-19层点数相同的话，则只保留第11层）<br>
    武器、护甲ID和备注为可选项，只在需要更换装备时填写<br>
    自定义点数分配方案脚本的参考范例请参见<a href="read.php?tid=500968&spid=13270735" target="_blank">此贴53楼</a>
  </div>
  <div style="overflow-y: auto; max-height: 400px;">
    <table id="pdLevelPointList" style="text-align: center; white-space: nowrap;">
      <tbody>
        <tr>
          <th></th><th>层数</th><th>力量</th><th>体质</th><th>敏捷</th><th>灵活</th><th>智力</th><th>意志</th>
<th>武器ID</th><th>武器备注</th><th>护甲ID</th><th>护甲备注</th><th></th>
        </tr>
      </tbody>
    </table>
  </div>
  <hr>
  <div style="float: left; line-height: 27px;">
    <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
    <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
    <a class="pd_btn_link pd_highlight" data-name="add" href="#">增加</a>
    <a class="pd_btn_link" data-name="deleteSelect" href="#">删除</a>
  </div>
  <div data-id="modifyArea" style="float: right;">
    <input name="s1" type="text" maxlength="5" title="力量" placeholder="力量" style="width: 35px;">
    <input name="s2" type="text" maxlength="5" title="体质" placeholder="体质" style="width: 35px;">
    <input name="d1" type="text" maxlength="5" title="敏捷" placeholder="敏捷" style="width: 35px;">
    <input name="d2" type="text" maxlength="5" title="灵活" placeholder="灵活" style="width: 35px;">
    <input name="i1" type="text" maxlength="5" title="智力" placeholder="智力" style="width: 35px;">
    <input name="i2" type="text" maxlength="5" title="意志" placeholder="意志" style="width: 35px;">
    <a class="pd_btn_link" data-name="clear" href="#" title="清空各修改字段">清空</a>
    <button type="button" name="modify">修改</button>
    <span class="pd_cfg_tips" title="可将所选择的层数的相应属性修改为指定的数值；数字前可设+/-号，表示增加/减少相应数量；例：100、+5或-2">[?]</span>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExLevelPointListConfigDialog" href="#">导入/导出分配方案</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '各层点数分配方案', html, 'min-width: 840px;');
    let $levelPointList = $dialog.find('#pdLevelPointList > tbody');

    /**
     * 添加各层点数分配的HTML
     * @param {number} level 层数
     * @param {{}} points 点数对象
     */
    const addLevelPointHtml = function (level, points) {
        $(`
<tr>
  <td style="width: 25px; text-align: left;"><input type="checkbox"></td>
  <td style="text-align: left;">
    <label style="margin-right: 8px;">
      第 <input name="level" type="text" value="${level ? level : ''}" style="width: 30px;"> 层
    </label>
  </td>
  <td><input class="pd_point" name="s1" type="number" value="${points['力量']}" min="1" style="width: 50px;" required></td>
  <td><input class="pd_point" name="s2" type="number" value="${points['体质']}" min="1" style="width: 50px;" required></td>
  <td><input class="pd_point" name="d1" type="number" value="${points['敏捷']}" min="1" style="width: 50px;" required></td>
  <td><input class="pd_point" name="d2" type="number" value="${points['灵活']}" min="1" style="width: 50px;" required></td>
  <td><input class="pd_point" name="i1" type="number" value="${points['智力']}" min="1" style="width: 50px;" required></td>
  <td><input class="pd_point" name="i2" type="number" value="${points['意志']}" min="1" style="width: 50px;" required></td>
  <td><input class="pd_arm_input" name="weaponId" type="text" value="${points['武器ID'] ? points['武器ID'] : ''}" maxlength="15" style="width: 65px;"></td>
  <td><input class="pd_arm_input" name="weaponMemo" type="text" value="${points['武器备注'] ? points['武器备注'] : ''}" maxlength="20" style="width: 70px;"></td>
  <td><input class="pd_arm_input" name="armorId" type="text" value="${points['护甲ID'] ? points['护甲ID'] : ''}" maxlength="15" style="width: 65px;"></td>
  <td><input class="pd_arm_input" name="armorMemo" type="text" value="${points['护甲备注'] ? points['护甲备注'] : ''}" maxlength="20" style="width: 70px;"></td>
  <td style="text-align: left;">
    <a class="pd_btn_link" data-name="fill" href="#">填充</a>
    <a class="pd_btn_link" data-name="addArm" href="#">装备</a>
    <a class="pd_btn_link pd_highlight" data-name="delete" href="#">删除</a>
  </td>
</tr>
<tr>
  <td></td>
  <td class="pd_custom_tips" title="剩余属性点">剩余：<span data-id="surplusPoint">0</span></td>
  <td title="攻击力" hidden> <!-- 临时禁用 -->
    攻：<span data-id="pro_s1" style="cursor: pointer;">0</span> <a data-id="opt_s1" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="最大生命值" hidden>
    命：<span data-id="pro_s2" style="cursor: pointer;">0</span> <a data-id="opt_s2" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="攻击速度" hidden>
    速：<span data-id="pro_d1" style="cursor: pointer;">0</span> <a data-id="opt_d1" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="暴击几率" hidden>
    暴：<span data-id="pro_d2" style="cursor: pointer;">0</span>% <a data-id="opt_d2" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="技能释放概率" hidden>
    技：<span data-id="pro_i1" style="cursor: pointer;">0</span>% <a data-id="opt_i1" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="防御减伤" hidden>
    防：<span data-id="pro_i2" style="cursor: pointer;">0</span>% <a data-id="opt_i2" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td class="pd_custom_tips" title="[飞身劈斩]伤害：攻击+体质值*5+智力值*5" hidden>技伤：<span data-id="skillAttack">0</span></td>
  <td hidden></td>
  <td hidden></td>
</tr>
`).appendTo($levelPointList).find('.pd_point').trigger('change');
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        (0, _Config.read)();
        let levelPointList = {};
        let prevPoints = {};
        let isError = false,
            isSurplus = false;
        $levelPointList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            if (!$this.find('.pd_point').length) return;
            let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($this.find('.pd_point'));
            if (surplusPoint > 0) isSurplus = true;else if (surplusPoint < 0) {
                isError = true;
                return false;
            }

            let level = parseInt($this.find('[name="level"]').val());
            if (!level || level < 0) return;
            let points = {};
            for (let elem of Array.from($this.find('.pd_point, .pd_arm_input'))) {
                let $elem = $(elem);
                let name = $elem.attr('name');
                let value = null;
                value = $.trim($elem.val());
                if ($elem.is('.pd_point')) {
                    value = parseInt(value);
                    if (!value || value < 0) return;
                } else {
                    if (!value) continue;
                    if (name === 'weaponId' || name === 'armorId') {
                        value = parseInt(value);
                        if (!value || value < 0) return;
                    }
                }
                points[getPointNameByFieldName(name)] = value;
            }
            if (Util.deepEqual(prevPoints, points)) return;

            levelPointList[level] = points;
            prevPoints = points;
        });
        if (isSurplus) {
            if (!confirm('部分层数的可分配属性点尚未用完，是否提交？')) return;
        }
        if (isError) {
            alert('部分层数的剩余属性点为负，请重新填写');
            return;
        }
        Config.levelPointList = levelPointList;
        (0, _Config.write)();
        Dialog.close(dialogName);
        setLevelPointListSelect(Config.levelPointList);
    }).find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        let points = { '力量': 1, '体质': 1, '敏捷': 1, '灵活': 1, '智力': 1, '意志': 1 };
        addLevelPointHtml(0, points);
        $levelPointList.find('[name="level"]:last').focus();
        Dialog.resize(dialogName);
    }).end().find('[data-name="deleteSelect"]').click(function (e) {
        e.preventDefault();
        let $checked = $levelPointList.find('[type="checkbox"]:checked');
        if (!$checked.length || !confirm('是否删除所选层数？')) return;
        let $line = $checked.closest('tr');
        $line.next('tr').addBack().remove();
        Dialog.resize(dialogName);
    }).end().find('[data-name="openImOrExLevelPointListConfigDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('各层点数分配方案', 'levelPointList', null, function () {
            $('#pdLevelPointListConfigDialog').remove();
            showLevelPointListConfigDialog($dialog => $dialog.submit());
        });
    }).end().find('[data-name="selectAll"]').click(() => Util.selectAll($levelPointList.find('[type="checkbox"]'))).end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($levelPointList.find('[type="checkbox"]')));

    $levelPointList.on('click', '[data-name="fill"]', function (e) {
        e.preventDefault();
        fillPoints($(this).closest('tr'));
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        let $line = $(this).closest('tr');
        $line.next('tr').addBack().remove();
        Dialog.resize(dialogName);
    }).on('click', '[data-name="addArm"]', function (e) {
        e.preventDefault();
        $levelPointList.find('#pdAddWeaponId, #pdAddWeaponMemo, #pdAddArmorId, #pdAddArmorMemo').removeAttr('id');
        let $tr = $(this).closest('tr');
        $tr.find('[name="weaponId"]').attr('id', 'pdAddWeaponId').end().find('[name="weaponMemo"]').attr('id', 'pdAddWeaponMemo').end().find('[name="armorId"]').attr('id', 'pdAddArmorId').end().find('[name="armorMemo"]').attr('id', 'pdAddArmorMemo');
        addOrChangeArm(1);
    }).on('change', '.pd_point', function () {
        let $this = $(this);
        let name = $this.attr('name');
        let point = parseInt($this.val());
        if (!point || point < 0) return;

        let $points = $this.closest('tr');
        let $properties = $points.next('tr');
        $properties.find(`[data-id="pro_${name}"]`).text(getPropertyByPoint(getPointNameByFieldName(name), point));
        let power = parseInt($points.find('[name="s1"]').val());
        let life = parseInt($points.find('[name="s2"]').val());
        let intelligence = parseInt($points.find('[name="i1"]').val());
        $properties.find('[data-id="skillAttack"]').text(getSkillAttack(power + getExtraPoint('力量', power), life + getExtraPoint('体质', life), intelligence + getExtraPoint('智力', intelligence)));

        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
        $properties.find('[data-id="surplusPoint"]').text(surplusPoint).css('color', surplusPoint !== 0 ? '#f00' : '#000');
    }).on('click', '[data-id^="pro_"]', function () {
        let $this = $(this);
        let name = $this.data('id').replace('pro_', '');
        let num = parseInt(prompt('请输入数值：', $this.text()));
        if (!num || num < 0) return;
        $this.closest('tr').prev('tr').find(`[name="${name}"]`).val(getPointByProperty(getPointNameByFieldName(name), num)).trigger('change');
    }).on('click', '[data-id^="opt_"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let name = $this.data('id').replace('opt_', '');
        let $points = $this.closest('tr').prev('tr');
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
        if (!surplusPoint) return;
        let $point = $points.find(`[name="${name}"]`);
        if (!$point.length) return;
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        num = num + surplusPoint;
        let min = parseInt($point.attr('min'));
        $point.val(num < min ? min : num).trigger('change');
    });

    $dialog.find('[name="modify"]').click(function () {
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
            $points.find('.pd_point').each(function () {
                let $this = $(this);
                let name = $this.attr('name');
                if (!(name in data)) return;
                if (data[name].action !== 'equal') {
                    let point = parseInt($this.val());
                    if (!point || point < 0) point = 0;
                    point += data[name].action === 'add' ? data[name].value : -data[name].value;
                    $this.val(point > 1 ? point : 1);
                } else $this.val(data[name].value);
            }).trigger('change');
        });
        alert('点数已修改');
    }).end().find('[data-name="clear"]').click(function (e) {
        e.preventDefault();
        $(this).closest('[data-id="modifyArea"]').find('[type="text"]').val('');
    });

    for (let [level, points] of Util.entries(Config.levelPointList)) {
        if (!$.isNumeric(level)) continue;
        addLevelPointHtml(level, points);
    }

    Dialog.show(dialogName);
    if (typeof callback === 'function') callback($dialog);
};

/**
 * 加入或更换装备
 * @param {number} type 类型，0：更换装备；1：加入装备
 */
const addOrChangeArm = function (type) {
    (0, _Config.read)();
    const dialogName = `pd${type === 1 ? 'Add' : 'Change'}ArmDialog`;
    let $dialog = $('#' + dialogName).parent();
    if ($dialog.length > 0 && type === 1) {
        $dialog.fadeIn('fast');
        Dialog.resize(dialogName);
    } else {
        let $wait = Msg.wait('<strong>正在获取装备信息&hellip;</strong>');
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_mybp.php?t=' + $.now(),
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            Msg.remove($wait);
            let matches = /<tr><td width="\d+%">装备.+?\r\n(<tr.+?<\/tr>)<tr><td colspan="4">/.exec(html);
            if (matches) {
                showAddOrChangeArmDialog(type, matches[1]);
            }
        }).fail(() => Msg.remove($wait));
    }
};

/**
 * 显示加入或更换装备对话框
 * @param {number} type 类型，0：更换装备；1：加入装备
 * @param {string} armHtml 装备的HTML代码
 */
const showAddOrChangeArmDialog = function (type, armHtml) {
    const dialogName = `pd${type === 1 ? 'Add' : 'Change'}ArmDialog`;
    if ($('#' + dialogName).length > 0) return;

    let html = `
<div class="pd_cfg_main" style="padding: 0;">
  <table class="kf_fw_ig4" data-name="armList" cellspacing="0" cellpadding="0" align="center" style="width: 800px;">
    <tbody>
      <tr hidden><td colspan="3" class="kf_fw_ig_title1">我的装备背包</td></tr>
      <tr><td width="10%">装备</td><td width="10%">熔炼</td><td width="80%">名称</td></tr>
      ${armHtml}
      <tr><td colspan="3"><span style="color:#00f;">不显示超过10件以上的物品，如物品超过10件，请熔炼掉多余的即可全部显示。</span></td></tr>
    </tbody>
  </table>
</div>
<div class="pd_cfg_btns">
  ${type === 0 ? '<button name="manualInputArmId" type="button" title="手动输入装备ID">手动输入ID</button>' : ''}
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, `${type === 1 ? '加入' : '更换'}装备`, html, 'min-width: 820px; z-index: 1003;');
    let $armArea = $dialog.find('.kf_fw_ig4[data-name="armList"]');

    Item.addCommonArmsButton($dialog.find('.pd_cfg_btns'), $armArea);
    if (type === 1) {
        $dialog.off('click', '[data-action="close"]').on('click', '[data-action="close"]', function () {
            $dialog.fadeOut('fast');
        });
    } else {
        $dialog.find('[name="manualInputArmId"]').click(function () {
            let value = $.trim(prompt('请输入装备ID（多个ID用空格分隔）：'));
            if (!value) return;
            let armIdList = value.split(' ');
            let $wait = Msg.wait('<strong>正在装备中&hellip;</strong>');
            $(document).clearQueue('ChangeArms');
            $.each(armIdList, function (i, armId) {
                if (!armId) return;
                $(document).queue('ChangeArms', function () {
                    $.post('kf_fw_ig_mybpdt.php', `do=4&id=${armId}&safeid=${safeId}`, function (html) {
                        let msg = Util.removeHtmlTag(html);
                        if (/装备完毕/.test(msg)) {
                            if (Config.autoSaveArmsInfoEnabled) {
                                let armsInfo = Item.readArmsInfo();
                                armsInfo['已装备武器'] = armsInfo['已装备护甲'] = 0;
                                Item.writeArmsInfo(armsInfo);
                            }
                        } else {
                            Msg.remove($wait);
                            alert(msg);
                        }
                    }).fail(function () {
                        $(document).clearQueue('ChangeArms');
                        Msg.remove($wait);
                        alert('连接超时');
                    }).always(function () {
                        if (!$(document).queue('ChangeArms').length) {
                            updateLootInfo(function () {
                                Msg.remove($wait);
                                Dialog.close(dialogName);
                                $('.pd_arm_input').val('');
                            });
                        } else {
                            setTimeout(() => $(document).dequeue('ChangeArms'), _Const2.default.minActionInterval);
                        }
                    });
                });
            });
            $(document).dequeue('ChangeArms');
        });
    }

    if (Config.autoSaveArmsInfoEnabled) {
        Item.addSavedArmsInfo($armArea);
    }
    Item.handleArmArea($armArea, type);
    Item.bindArmLinkClickEvent($armArea, safeId, 1);

    Dialog.show(dialogName);
    Script.runFunc(`Item.show${type === 1 ? 'Add' : 'Change'}ArmDialog_after_`);
};

/**
 * 添加争夺记录头部区域
 */
const addLootLogHeader = function () {
    $(`
<div id="pdLootLogHeader" style="padding: 0 5px 5px; line-height: 2em;">
  <div class="pd_log_nav">
    <a class="pd_disabled_link" data-name="start" href="#">&lt;&lt;</a>
    <a class="pd_disabled_link" data-name="prev" href="#" style="padding: 0 7px;">&lt;</a>
    <h2 class="pd_history_logs_key pd_custom_tips" title="共有0天的争夺记录">现在</h2>
    <a class="pd_disabled_link" data-name="next" href="#" style="padding: 0 7px;">&gt;</a>
    <a class="pd_disabled_link" data-name="end" href="#">&gt;&gt;</a>
  </div>
  <div style="text-align: right;">
    <label>
      <input class="pd_input" name="showLiteLootLogEnabled" type="checkbox" ${Config.showLiteLootLogEnabled ? 'checked' : ''}> 显示精简记录
    </label>
    <label>
      <input class="pd_input" name="showLevelEnemyStatEnabled" type="checkbox" ${Config.showLevelEnemyStatEnabled ? 'checked' : ''}> 显示分层统计
    </label>
    <a class="pd_btn_link" data-name="openImOrExLootLogDialog" href="#">导入/导出争夺记录</a>
    <a class="pd_btn_link pd_highlight" data-name="clearLootLog" href="#">清除记录</a>
  </div>
  <ul class="pd_stat" id="pdLogStat"></ul>
</div>
`).insertBefore($logBox).find('[type="checkbox"]').click(function () {
        let $this = $(this);
        let name = $this.attr('name');
        let checked = $this.prop('checked');
        if (name in Config && Config[name] !== checked) {
            (0, _Config.read)();
            Config[name] = $this.prop('checked');
            (0, _Config.write)();
            if (name === 'showLiteLootLogEnabled') showEnhanceLog(logList, levelInfoList, pointsLogList);else if (name === 'showLevelEnemyStatEnabled') showLogStat(levelInfoList);
        }
    }).end().find('[data-name="openImOrExLootLogDialog"]').click(function (e) {
        e.preventDefault();
        showImportOrExportLootLogDialog();
    }).end().find('[data-name="clearLootLog"]').click(function (e) {
        e.preventDefault();
        if (!confirm('是否清除所有争夺记录？')) return;
        LootLog.clear();
        alert('争夺记录已清除');
        location.reload();
    });

    handleLootLogNav();
};

/**
 * 显示导入或导出争夺记录对话框
 */
const showImportOrExportLootLogDialog = function () {
    const dialogName = 'pdImOrExLootLogDialog';
    if ($('#' + dialogName).length > 0) return;
    let log = LootLog.read();
    let html = `
<div class="pd_cfg_main">
  <strong>导入争夺记录：</strong>将争夺记录内容粘贴到文本框中并点击合并或覆盖按钮即可<br>
  <strong>导出争夺记录：</strong>复制文本框里的内容并粘贴到别处即可<br>
  <textarea name="lootLog" style="width: 600px; height: 400px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button name="merge" type="button">合并记录</button>
  <button name="overwrite" type="button" style="color: #f00;">覆盖记录</button>
  <button data-action="close" type="button">关闭</button>
</div>`;

    let $dialog = Dialog.create(dialogName, '导入或导出争夺记录', html);
    $dialog.find('[name="merge"], [name="overwrite"]').click(function (e) {
        e.preventDefault();
        let name = $(this).attr('name');
        if (!confirm(`是否将文本框中的争夺记录${name === 'overwrite' ? '覆盖' : '合并'}到本地争夺记录？`)) return;
        let newLog = $.trim($dialog.find('[name="lootLog"]').val());
        if (!newLog) return;
        try {
            newLog = JSON.parse(newLog);
        } catch (ex) {
            alert('争夺记录有错误');
            return;
        }
        if (!newLog || $.type(newLog) !== 'object') {
            alert('争夺记录有错误');
            return;
        }
        if (name === 'merge') log = LootLog.getMergeLog(log, newLog);else log = newLog;
        LootLog.write(log);
        alert('争夺记录已导入');
        location.reload();
    });

    Dialog.show(dialogName);
    $dialog.find('[name="lootLog"]').val(JSON.stringify(log)).select().focus();
};

/**
 * 处理争夺记录导航
 */
const handleLootLogNav = function () {
    let $logNav = $('#pdLootLogHeader').find('.pd_log_nav');

    /**
     * 获取历史争夺记录的标题字符串
     * @param {number} timestamp 争夺记录的时间戳（0表示现在）
     * @returns {string} 标题字符串
     */
    const getKeyTitleStr = timestamp => {
        if (parseInt(timestamp) === 0) return '现在';
        let date = new Date(parseInt(timestamp));
        return Util.getDateString(date) + ' ' + Util.getTimeString(date, ':', false);
    };

    let historyLogs = LootLog.read();
    let keyList = [];
    if (!$.isEmptyObject(historyLogs)) {
        keyList = Util.getObjectKeyList(historyLogs, 1);
        let latestKey = parseInt(keyList[keyList.length - 1]);
        if (!/你被击败了/.test(log) || latestKey <= Util.getDate('-1d').getTime() || historyLogs[latestKey].log.join('').trim() !== logList.join('').trim()) keyList.push(0);
    } else keyList.push(0);
    let curIndex = keyList.length - 1;

    let totalDays = keyList[curIndex] === 0 ? keyList.length - 1 : keyList.length;
    $logNav.find('.pd_history_logs_key').attr('title', `共有${totalDays}天的争夺记录`).text(getKeyTitleStr(keyList[curIndex]));
    if (keyList.length > 1) {
        $logNav.find('[data-name="start"]').attr('title', getKeyTitleStr(keyList[0])).removeClass('pd_disabled_link');
        $logNav.find('[data-name="prev"]').attr('title', getKeyTitleStr(keyList[curIndex - 1])).removeClass('pd_disabled_link');
    }
    $logNav.on('click', 'a[data-name]', function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        let name = $this.data('name');
        if (name === 'start') {
            curIndex = 0;
        } else if (name === 'prev') {
            if (curIndex > 0) curIndex--;else return;
        } else if (name === 'next') {
            if (curIndex < keyList.length - 1) curIndex++;else return;
        } else if (name === 'end') {
            curIndex = keyList.length - 1;
        }
        $logNav.find('.pd_history_logs_key').text(getKeyTitleStr(keyList[curIndex]));
        let curLogList = keyList[curIndex] === 0 ? logList : historyLogs[keyList[curIndex]].log;
        let curLevelInfoList = getLevelInfoList(curLogList);
        let curPointsLogList = keyList[curIndex] === 0 ? pointsLogList : historyLogs[keyList[curIndex]].points;
        showEnhanceLog(curLogList, curLevelInfoList, curPointsLogList);
        showLogStat(curLevelInfoList);
        if (curIndex > 0) {
            $logNav.find('[data-name="start"]').attr('title', getKeyTitleStr(keyList[0])).removeClass('pd_disabled_link');
            $logNav.find('[data-name="prev"]').attr('title', getKeyTitleStr(keyList[curIndex - 1])).removeClass('pd_disabled_link');
        } else {
            $logNav.find('[data-name="start"], [data-name="prev"]').removeAttr('title').addClass('pd_disabled_link');
        }
        if (curIndex < keyList.length - 1) {
            $logNav.find('[data-name="next"]').attr('title', getKeyTitleStr(keyList[curIndex + 1])).removeClass('pd_disabled_link');
            $logNav.find('[data-name="end"]').attr('title', getKeyTitleStr(keyList[keyList.length - 1])).removeClass('pd_disabled_link');
        } else {
            $logNav.find('[data-name="next"], [data-name="end"]').removeAttr('title').addClass('pd_disabled_link');
        }
    });

    if (!log.includes('本日无争夺记录') && !log.includes('你已经复活')) {
        let curLogList = keyList[curIndex] === 0 ? logList : historyLogs[keyList[curIndex]].log;
        let curLevelInfoList = getLevelInfoList(curLogList);
        let curPointsLogList = keyList[curIndex] === 0 ? pointsLogList : historyLogs[keyList[curIndex]].points;
        showEnhanceLog(curLogList, curLevelInfoList, curPointsLogList);

        if (Config.autoSaveLootLogInSpecialCaseEnabled && /你被击败了/.test(log) && keyList[curIndex] === 0) {
            Util.deleteCookie(_Const2.default.lootCompleteCookieName);
            autoSaveLootLog();
        }
    }
};

/**
 * 显示争夺记录统计
 * @param {{}[]} levelInfoList 各层战斗信息列表
 */
const showLogStat = function (levelInfoList) {
    let { boxNum, boxes } = getTotalGain(levelInfoList);
    let boxesStatHtml = '';
    for (let key of Util.getSortedObjectKeyList(Item.boxTypeList, boxes)) {
        boxesStatHtml += `<i>${key}<em>+${boxes[key].toLocaleString()}</em></i> `;
    }
    let allEnemyStatHtml = '';
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList))) {
        allEnemyStatHtml += `<i>${enemy}<em>+${num}</em></i> `;
    }
    let latestEnemyStatHtml = '';
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList.filter((elem, level) => level >= levelInfoList.length - _Const2.default.enemyStatLatestLevelNum)))) {
        latestEnemyStatHtml += `<i>${enemy}<em>+${num}</em></i> `;
    }
    let $logStat = $('#pdLogStat');
    $logStat.html(`
<li><b>收获统计：</b><i>盒子<em>+${boxNum}</em></i> ${boxesStatHtml ? boxesStatHtml : '无'}</li>
<li><b>全部层数：</b>${allEnemyStatHtml}<br><b>最近${_Const2.default.enemyStatLatestLevelNum}层：</b>${latestEnemyStatHtml}</li>
`);

    if (Config.showLevelEnemyStatEnabled) {
        let levelEnemyStatHtml = '';
        for (let i = 1; i < levelInfoList.length; i += 10) {
            levelEnemyStatHtml += `&nbsp;&nbsp;<b>${i}-${i + 9 < levelInfoList.length ? i + 9 : levelInfoList.length - 1}：</b>`;
            let html = '';
            for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList.filter((elem, level) => level >= i && level < i + 10)))) {
                html += `<i>${enemy}<em>+${num}</em></i> `;
            }
            levelEnemyStatHtml += (html ? html : '无') + '<br>';
        }
        $logStat.append(`<li><b>分层统计：</b>${levelEnemyStatHtml ? '<br>' + levelEnemyStatHtml : '无'}</li>`);
    }
};

/**
 * 显示经过增强的争夺记录
 * @param {string[]} logList 各层争夺记录列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
const showEnhanceLog = function (logList, levelInfoList, pointsLogList) {
    let list = [];
    $.each(logList, function (level, levelLog) {
        if (!levelLog) return;
        let matches = /\[([^\]]+)的]NPC/.exec(levelLog);
        if (!matches) return;
        let enemy = matches[1];
        let color = '';
        switch (enemy) {
            case '普通':
                color = '#09c';
                break;
            case '特别睿智':
                color = '#c96';
                break;
            case '特别坚强':
                color = '#cc587c';
                break;
            case '特别强壮':
                color = '#f93';
                break;
            case '特别快速':
                color = '#f3c';
                break;
            case 'BOSS':
                color = '#f00';
                break;
            default:
                color = '#0075ea';
        }
        list[level] = levelLog.replace(matches[0], `<span style="background-color: ${color};">[${enemy}的]</span>NPC`);

        if (pointsLogList[level]) {
            let levelPointsLog = pointsLogList[level];
            enemy = enemy.replace('特别', '');
            let pointMatches = /灵活：\d+\+\d+=(\d+)/.exec(levelPointsLog);
            if (pointMatches) {
                let realCriticalStrikePercent = getRealProperty('灵活', parseInt(pointMatches[1]), level, enemy);
                levelPointsLog = levelPointsLog.replace(/(暴击几率：\d+%)/, `$1<span class="pd_custom_tips" title="实际暴击几率">(${realCriticalStrikePercent}%)</span>`);
            }
            pointMatches = /智力：\d+\+\d+=(\d+)/.exec(levelPointsLog);
            if (pointMatches) {
                let realSkillPercent = getRealProperty('智力', parseInt(pointMatches[1]), level, enemy);
                levelPointsLog = levelPointsLog.replace(/(技能释放概率：\d+%)/, `$1<span class="pd_custom_tips" title="实际技能释放概率">(${realSkillPercent}%)</span>`);
            }
            list[level] = list[level].replace('</li>', `</li><li class="pk_log_g" style="color: #666;">${levelPointsLog}</li>`.replace(/\n/g, '<br>'));
        }
    });
    $log.html(list.reverse().join(''));

    if (Config.showLiteLootLogEnabled) {
        if (!$('#pdLiteLootLogStyle').length) {
            $('head').append('<style id="pdLiteLootLogStyle">.pk_log_g, .pk_log_i, .pk_log_u, .pk_log_v { display: none; }</style>');
        }
    } else $('#pdLiteLootLogStyle').remove();
    Script.runFunc('Loot.showEnhanceLog_after_');
};

/**
 * 获取争夺记录
 * @returns {string} 争夺记录
 */
const getLog = exports.getLog = () => log;

/**
 * 获取各层争夺记录列表
 * @param log 争夺记录
 * @returns {string[]} 各层争夺记录列表
 */
const getLogList = exports.getLogList = function (log) {
    let logList = [];
    let matches = log.match(/<li class="pk_log_j">.+?(?=\s*<li class="pk_log_j">|\s*$)/g);
    for (let i in matches) {
        let levelMatches = /在\[\s*(\d+)\s*层]/.exec(Util.removeHtmlTag(matches[i]));
        if (levelMatches) logList[parseInt(levelMatches[1])] = matches[i];
    }
    return logList;
};

/**
 * 获取该层的战斗信息
 * @param {string} levelLog 该层的争夺记录
 * @returns {{enemy: string, life: number, initLife: number, box: string}} enemy：遭遇敌人名称；life：该层剩余生命值；initLife：该层初始生命值；box：盒子名称
 */
const getLevelInfo = exports.getLevelInfo = function (levelLog) {
    let info = { enemy: '', life: 0, initLife: 0, box: '' };
    if (!levelLog) return info;
    levelLog = Util.removeHtmlTag(levelLog.replace(/<\/li>/g, '</li>\n'));

    let matches = /你\((\d+)\)遭遇了\[([^\]]+)的]NPC/.exec(levelLog);
    if (matches) {
        info.initLife = parseInt(matches[1]);
        info.enemy = matches[2];
        info.enemy = info.enemy.replace('特别', '').replace('(后续更新前此路不通)', '');
    }

    matches = /生命值\[(\d+)\s*\/\s*\d+]/.exec(levelLog);
    if (matches) info.life = parseInt(matches[1]);

    matches = /敌人掉落了一个\s*\[\s*(\S+?盒子)\s*]/.exec(levelLog);
    if (matches) info.box = matches[1];

    return info;
};

/**
 * 获取各层战斗信息列表
 * @param {string[]} logList 各层争夺记录列表
 * @returns {{}[]} 各层战斗信息列表
 */
const getLevelInfoList = exports.getLevelInfoList = function (logList) {
    let levelInfoList = [];
    $.each(logList, function (level, levelLog) {
        if (!levelLog) return;
        levelInfoList[level] = getLevelInfo(levelLog);
    });
    return levelInfoList;
};

/**
 * 获取当前的争夺总收获
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @returns {{boxes: {}}} boxes：盒子信息统计
 */
const getTotalGain = function (levelInfoList) {
    let boxNum = 0,
        boxes = {};
    $.each(levelInfoList, function (level, info) {
        if (!info || !info.box) return;
        if (!(info.box in boxes)) boxes[info.box] = 0;
        boxes[info.box]++;
        boxNum++;
    });
    return { boxNum, boxes };
};

/**
 * 获取遭遇敌人统计列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @returns {{}} 遭遇敌人列表
 */
const getEnemyStatList = function (levelInfoList) {
    let enemyStatList = {
        '普通': 0,
        '强壮': 0,
        '快速': 0,
        '睿智': 0,
        '坚强': 0,
        'BOSS': 0,
        '大魔王': 0
    };
    $.each(getEnemyList(levelInfoList), function (level, enemy) {
        if (!enemy || !(enemy in enemyStatList)) return;
        enemyStatList[enemy]++;
    });
    if (!enemyStatList['BOSS']) delete enemyStatList['BOSS'];
    if (!enemyStatList['大魔王']) delete enemyStatList['大魔王'];
    return enemyStatList;
};

/**
 * 获取各层敌人列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @returns {[]} 各层敌人列表
 */
const getEnemyList = function (levelInfoList) {
    let enemyList = [];
    $.each(levelInfoList, function (level, info) {
        if (!info) return;
        if (info.enemy) enemyList[level] = info.enemy;
    });
    return enemyList;
};

/**
 * 获取当前层数
 * @param {string[]} logList 各层争夺记录列表
 * @returns {number} 当前层数
 */
const getCurrentLevel = logList => logList.length - 1 >= 1 ? logList.length - 1 : 0;

/**
 * 获取临时点数分配记录列表
 * @param {string[]} logList 各层争夺记录列表
 * @returns {string[]} 点数分配记录列表
 */
const getTempPointsLogList = function (logList) {
    let options = localStorage.getItem(_Const2.default.tempPointsLogListStorageName + '_' + _Info2.default.uid);
    if (!options) return [];
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return [];
    }
    if (!options || $.type(options) !== 'object' || $.type(options.time) !== 'number' || !Array.isArray(options.pointsLogList)) return [];
    let diff = $.now() - options.time;
    if (options.pointsLogList.length > logList.length || diff >= 24 * 60 * 60 * 1000 || diff < 0) {
        localStorage.removeItem(_Const2.default.tempPointsLogListStorageName + '_' + _Info2.default.uid);
        return [];
    }
    return options.pointsLogList;
};

/**
 * 获取自动争夺Cookies有效期
 * @returns {Date} Cookies有效期的Date对象
 */
const getAutoLootCookieDate = function () {
    let now = new Date();
    let date = Util.getTimezoneDateByTime('02:30:00');
    if (now > date || !Config.autoLootEnabled && !Config.autoSaveLootLogInSpecialCaseEnabled) {
        date = Util.getTimezoneDateByTime('00:00:30');
        date.setDate(date.getDate() + 1);
    }
    if (now > date) date.setDate(date.getDate() + 1);
    return date;
};

/**
 * 检查争夺情况
 */
const checkLoot = exports.checkLoot = function () {
    if (new Date() < Util.getDateByTime(Config.checkLootAfterTime)) return;

    console.log('检查争夺情况Start');
    let $wait = Msg.wait('<strong>正在检查争夺情况中&hellip;</strong>');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout,
        success(html) {
            Msg.remove($wait);
            if (!/你被击败了/.test(html)) {
                if (Util.getCookie(_Const2.default.lootCheckingCookieName)) return;
                let $log = $('#pk_text', html);
                if (!$log.length) {
                    Util.setCookie(_Const2.default.lootCompleteCookieName, -1, Util.getDate(`+${_Const2.default.checkLootInterval}m`));
                    return;
                }
                if (Config.attackTargetLevel > 0) {
                    let log = $log.html();
                    let logList = getLogList(log);
                    let currentLevel = getCurrentLevel(logList);
                    if (Config.attackTargetLevel <= currentLevel) {
                        Util.setCookie(_Const2.default.lootCompleteCookieName, 1, getAutoLootCookieDate());
                        return;
                    }
                }
                Util.setCookie(_Const2.default.lootCheckingCookieName, 1, Util.getDate('+1m'));
                Msg.destroy();
                location.href = 'kf_fw_ig_index.php';
            } else {
                Util.setCookie(_Const2.default.lootCompleteCookieName, 2, getAutoLootCookieDate());
            }
        },
        error() {
            Msg.remove($wait);
            setTimeout(checkLoot, _Const2.default.defAjaxInterval);
        }
    });
};

/**
 * 自动争夺
 */
const autoLoot = function () {
    if (/你被击败了/.test(log) || new Date() < Util.getDateByTime(Config.checkLootAfterTime)) return;
    let safeId = Public.getSafeId();
    let currentLevel = getCurrentLevel(logList);
    if (!safeId || Config.attackTargetLevel > 0 && Config.attackTargetLevel <= currentLevel) {
        Util.setCookie(_Const2.default.lootCompleteCookieName, 1, getAutoLootCookieDate());
        return;
    }
    Util.setCookie(_Const2.default.lootAttackingCookieName, 1, Util.getDate(`+${_Const2.default.lootAttackingExpires}m`));
    Util.deleteCookie(_Const2.default.lootCompleteCookieName);
    let autoChangePointsEnabled = Config.autoChangeLevelPointsEnabled || Config.customPointsScriptEnabled && typeof _Const2.default.getCustomPoints === 'function';
    if (Config.unusedPointNumAlertEnabled && !autoChangePointsEnabled && !checkPoints($points)) return;
    lootAttack({ type: 'auto', targetLevel: Config.attackTargetLevel, autoChangePointsEnabled, safeId });
};

/**
 * 自动保存争夺记录
 */
const autoSaveLootLog = exports.autoSaveLootLog = function () {
    console.log('检查争夺情况Start');
    let $wait = Msg.wait('<strong>正在检查争夺情况中&hellip;</strong>');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout,
        success(html) {
            Msg.remove($wait);
            if (Util.getCookie(_Const2.default.lootCompleteCookieName)) return;
            let $log = $('#pk_text', html);
            let log = $log.html();
            if (/你被击败了/.test(log)) {
                Util.setCookie(_Const2.default.lootCompleteCookieName, 2, getAutoLootCookieDate());
                let logList = getLogList(log);
                let levelInfoList = getLevelInfoList(logList);
                let historyLogs = LootLog.read();
                if (!$.isEmptyObject(historyLogs)) {
                    let keyList = Util.getObjectKeyList(historyLogs, 1);
                    let latestKey = parseInt(keyList[keyList.length - 1]);
                    if (latestKey > Util.getDate('-1d').getTime() && historyLogs[latestKey].log.join('').trim() === logList.join('').trim()) return;
                }
                recordLootInfo(logList, levelInfoList, []);
            } else {
                Util.setCookie(_Const2.default.lootCompleteCookieName, -1, Util.getDate(`+${_Const2.default.checkLootInterval}m`));
            }
        },
        error() {
            Msg.remove($wait);
            setTimeout(autoSaveLootLog, _Const2.default.defAjaxInterval);
        }
    });
};

/**
 * 获取改点倒计时
 * @returns {Deferred} Deferred对象
 */
const getChangePointsCountDown = exports.getChangePointsCountDown = function () {
    console.log('获取改点倒计时Start');
    return $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout
    }).then(function (html) {
        let matches = /\(下次修改配点还需\[(\d+)]分钟\)/.exec(html);
        if (matches) {
            let nextTime = Util.getDate(`+${matches[1]}m`);
            Util.setCookie(_Const2.default.changePointsInfoCookieName, nextTime.getTime(), nextTime);
            return nextTime.getTime();
        }

        matches = /当前修改配点可用\[(\d+)]次/.exec(html);
        if (matches) {
            let count = parseInt(matches[1]);
            Util.setCookie(_Const2.default.changePointsInfoCookieName, count + 'c', Util.getDate(`+${_Const2.default.changePointsInfoExpires}m`));
            return count;
        }
        return 'error';
    }, () => 'timeout');
};

/**
 * 在争夺排行页面添加用户链接
 */
const addUserLinkInPkListPage = exports.addUserLinkInPkListPage = function () {
    $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === _Info2.default.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 在战力光环排行上添加用户链接
 */
const addUserLinkInHaloPage = exports.addUserLinkInHaloPage = function () {
    $('.kf_fw_ig1:eq(1) > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === _Info2.default.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 读取战力光环页面信息
 * @param {boolean} isInitLootPage 是否初始化争夺首页
 */
const readHaloInfo = function (isInitLootPage = false) {
    console.log('获取战力光环信息Start');
    let $wait = Msg.wait('<strong>正在获取战力光环信息，请稍候&hellip;</strong>');
    getHaloInfo().done(function (result) {
        if ($.type(result) === 'object') {
            setHaloInfo(result);
            if (isInitLootPage) enhanceLootIndexPage();else $points.find('.pd_point').trigger('change');
        }
    }).always(function (result) {
        Msg.remove($wait);
        if (result === 'timeout') {
            setTimeout(() => readHaloInfo(isInitLootPage), _Const2.default.defAjaxInterval);
        } else if (result === 'error') {
            Msg.show('<strong>战力光环信息获取失败！</strong>', -1);
        }
    });
};

/**
 * 获取战力光环信息
 * @returns {Deferred} Deferred对象
 */
const getHaloInfo = exports.getHaloInfo = function () {
    return $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_halo.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout
    }).then(function (html) {
        let haloInfo = { '全属性': 0, '攻击力': 0, '生命值': 0 };
        let matches = /全属性\s*\+\s*(\d+(?:\.\d+)?)%/.exec(html);
        if (matches) {
            haloInfo['全属性'] = Math.round(parseFloat(matches[1]) * 10) / 1000;
            let extraMatches = /福利加成\s*\+\s*(\d+)攻击力\s*&\s*\+\s*(\d+)生命值/.exec(html);
            if (extraMatches) {
                haloInfo['攻击力'] = parseInt(extraMatches[1]);
                haloInfo['生命值'] = parseInt(extraMatches[2]);
            }
            TmpLog.setValue(_Const2.default.haloInfoTmpLogName, $.extend(haloInfo, { time: $.now() }));
            return haloInfo;
        } else return 'error';
    }, () => 'timeout');
};

/**
 * 设置战力光环信息
 * @param {{}} newHaloInfo 光环信息对象
 */
const setHaloInfo = exports.setHaloInfo = function (newHaloInfo) {
    haloInfo = newHaloInfo;
    if (!$('#pdHaloInfo').length) {
        let $node = $properties.find('input[type="text"]:eq(13)');
        if (!$node.length || $.trim($node.val())) return;
        $node.attr('id', 'pdHaloInfo');
        $('<a data-name="reloadHaloInfo" href="#" style="margin-left: -20px;" title="如战力光环信息不正确时，请点此重新读取">读</a>').insertAfter($node).click(function (e) {
            e.preventDefault();
            if (confirm('是否重新读取战力光环信息？')) {
                TmpLog.deleteValue(_Const2.default.haloInfoTmpLogName);
                readHaloInfo();
            }
        });
    }
    $('#pdHaloInfo').val(`全属性+${Math.round(haloInfo['全属性'] * 1000) / 10}% (+${haloInfo['攻击力']}|+${haloInfo['生命值']})`);
};

/**
 * 获取战力光环页面信息
 * @param {boolean} isInitLootPage 是否初始化争夺首页
 */
const getPromoteHaloInfo = exports.getPromoteHaloInfo = function (isInitLootPage = false) {
    Script.runFunc('Loot.getPromoteHaloInfo_before_');
    console.log('获取战力光环页面信息Start');
    let $wait = Msg.wait('<strong>正在获取战力光环信息，请稍候&hellip;</strong>');

    /**
     * 写入Cookie
     * @param {string} value 指定（相对）时间量
     * @returns {boolean} 返回false
     */
    const setCookie = function (value) {
        let nextTime = Util.getDate(value);
        Util.setCookie(_Const2.default.promoteHaloCookieName, nextTime.getTime(), nextTime);
        if (isInitLootPage) init();
        return false;
    };

    /**
     * 获取个人信息
     */
    const getPersonalInfo = function () {
        $.ajax({
            type: 'GET',
            url: `profile.php?action=show&uid=${_Info2.default.uid}&t=${$.now()}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            Msg.remove($wait);
            let regex = Config.promoteHaloCostType >= 11 ? /贡献数值：(\d+(?:\.\d+)?)/ : /论坛货币：(-?\d+)\s*KFB/;
            let matches = regex.exec(html);
            if (!matches) return setCookie(`+${_Const2.default.promoteHaloLimitNextActionInterval}m`);
            let currency = parseFloat(matches[1]);
            if (currency > Config.promoteHaloLimit) {
                let { num } = getPromoteHaloCostByTypeId(Config.promoteHaloCostType);
                let maxCount = Math.floor((currency - Config.promoteHaloLimit) / num);
                if (maxCount > 0) {
                    $wait = Msg.wait('<strong>正在获取战力光环信息，请稍候&hellip;</strong>');
                    getHaloInfo(maxCount);
                } else return setCookie(`+${_Const2.default.promoteHaloLimitNextActionInterval}m`);
            } else return setCookie(`+${_Const2.default.promoteHaloLimitNextActionInterval}m`);
        }).fail(() => setTimeout(getPersonalInfo, _Const2.default.defAjaxInterval));
    };

    /**
     * 获取光环信息
     * @param {number} maxCount 最大提升战力光环次数（设为-1表示不限制）
     */
    const getHaloInfo = function (maxCount = -1) {
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_halo.php?t=' + $.now(),
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            Msg.remove($wait);

            let safeIdMatches = /safeid=(\w+)"/.exec(html);
            if (!safeIdMatches) return setCookie('+1h');
            let safeId = safeIdMatches[1];

            let surplusMatches = /下次随机还需\[(\d+)]分钟/.exec(html);
            if (surplusMatches) {
                let promoteHaloInterval = Config.promoteHaloAutoIntervalEnabled ? _Const2.default.minPromoteHaloInterval : Config.promoteHaloInterval * 60;
                promoteHaloInterval = promoteHaloInterval < _Const2.default.minPromoteHaloInterval ? _Const2.default.minPromoteHaloInterval : promoteHaloInterval;
                return setCookie(`+${promoteHaloInterval - (_Const2.default.minPromoteHaloInterval - parseInt(surplusMatches[1]))}m`);
            }

            let totalCount = 1;
            let countMatches = /当前光环随机可用\[(\d+)]次/.exec(html);
            if (Config.promoteHaloAutoIntervalEnabled && countMatches) {
                totalCount = parseInt(countMatches[1]);
                if (maxCount > -1) totalCount = totalCount > maxCount ? maxCount : totalCount;
            }

            promoteHalo(totalCount, Config.promoteHaloCostType, safeId, isInitLootPage);
        }).fail(function () {
            Msg.remove($wait);
            setTimeout(getPromoteHaloInfo, _Const2.default.defAjaxInterval);
        });
    };

    if (Config.promoteHaloLimit > 0) getPersonalInfo();else getHaloInfo();
};

/**
 * 提升战力光环
 * @param {number} totalCount 提升战力光环总次数
 * @param {number} promoteHaloCostType 自动提升战力光环的花费类型，参见{@link Config.promoteHaloCostType}
 * @param {string} safeId SafeID
 * @param {boolean} isInitLootPage 是否初始化争夺首页
 */
const promoteHalo = exports.promoteHalo = function (totalCount, promoteHaloCostType, safeId, isInitLootPage = false) {
    console.log('提升战力光环Start');
    let $wait = Msg.wait(`<strong>正在提升战力光环&hellip;</strong><i>剩余：<em class="pd_countdown">${totalCount}</em></i><a class="pd_stop_action" href="#">停止操作</a>`);
    TmpLog.deleteValue(_Const2.default.haloInfoTmpLogName);
    let isStop = false;
    let index = 0;
    let nextTime = Util.getDate('+10m').getTime();

    /**
     * 提升
     */
    const promote = function () {
        $.ajax({
            type: 'GET',
            url: `kf_fw_ig_halo.php?do=buy&id=${promoteHaloCostType}&safeid=${safeId}&t=${$.now()}`,
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            Public.showFormatLog('提升战力光环', html);
            let { msg } = Util.getResponseMsg(html);

            let matches = /(新数值为|随机值为)\[(\d+(?:\.\d+)?)%]/.exec(msg);
            if (matches) {
                let isNew = matches[1] === '新数值为';

                nextTime = Config.promoteHaloAutoIntervalEnabled ? 0 : Util.getDate(`+${Config.promoteHaloInterval}h`).getTime();
                let randomNum = parseFloat(matches[2]);
                let costResult = getPromoteHaloCostByTypeId(promoteHaloCostType);
                Msg.show('<strong>' + (isNew ? `恭喜你提升了光环的效果！新数值为【<em>${randomNum}%</em>】` : `你本次随机值为【<em>${randomNum}%</em>】，未超过光环效果`) + `</strong><i>${costResult.type}<ins>${(-costResult.num).toLocaleString()}</ins></i>`);

                let pay = {};
                pay[costResult.type] = -costResult.num;
                Log.push('提升战力光环', isNew ? `恭喜你提升了光环的效果！新数值为【\`${randomNum}%\`】` : `你本次随机值为【\`${randomNum}%\`】，未超过光环效果`, { pay });
                index++;
            } else {
                if (/两次操作间隔过短/.test(msg)) nextTime = Util.getDate('+10s').getTime();else isStop = true;

                matches = /你的(贡献点数|KFB)不足/.exec(msg);
                if (matches) {
                    nextTime = Util.getDate(`+${Config.promoteHaloInterval}h`).getTime();
                    Msg.show(`<strong>${matches[1]}不足，无法提升战力光环</strong><a href="kf_fw_ig_halo.php" target="_blank">手动选择</a>`, -1);
                }

                matches = /你还需要等待(\d+)分钟/.exec(msg);
                if (matches) {
                    let promoteHaloInterval = Config.promoteHaloInterval * 60;
                    promoteHaloInterval = promoteHaloInterval < _Const2.default.minPromoteHaloInterval ? _Const2.default.minPromoteHaloInterval : promoteHaloInterval;
                    nextTime = Util.getDate(`+${Config.promoteHaloInterval * 60 - (_Const2.default.minPromoteHaloInterval - parseInt(matches[1]))}m`).getTime();
                }
            }
        }).always(function () {
            $wait.find('.pd_countdown').text(totalCount - index);
            isStop = isStop || $wait.data('stop');
            if (isStop || index === totalCount) {
                Msg.remove($wait);
                if (nextTime > 0 || isStop) {
                    Util.setCookie(_Const2.default.promoteHaloCookieName, nextTime, new Date(nextTime));
                } else {
                    Util.deleteCookie(_Const2.default.promoteHaloCookieName);
                    getPromoteHaloInfo();
                }
                if (isInitLootPage) init();
                Script.runFunc('Loot.promoteHalo_after_');
            } else {
                setTimeout(promote, _Const2.default.promoteHaloActionInterval);
            }
        });
    };

    promote();
};

/**
 * 通过获取类型ID获取提升战力光环花费
 * @param {number} id 提升战力光环的类型ID
 * @returns {{type: string, num: number}} type：花费类型；num：花费数额
 */
const getPromoteHaloCostByTypeId = exports.getPromoteHaloCostByTypeId = function (id) {
    switch (id) {
        case 1:
            return { type: 'KFB', num: 100 };
        case 2:
            return { type: 'KFB', num: 1000 };
        case 11:
            return { type: '贡献', num: 0.2 };
        case 12:
            return { type: '贡献', num: 2 };
        default:
            return { type: 'KFB', num: 0 };
    }
};

},{"./Config":4,"./Const":6,"./Dialog":7,"./Info":9,"./Item":10,"./Log":11,"./LootLog":14,"./Msg":15,"./Public":18,"./Script":20,"./TmpLog":22,"./Util":23}],14:[function(require,module,exports){
/* 争夺记录模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMergeLog = exports.record = exports.clear = exports.write = exports.read = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 保存争夺记录的键值名称
const name = _Const2.default.storagePrefix + 'loot_log';

/**
 * 读取争夺记录
 * @returns {{}} 争夺记录对象
 */
const read = exports.read = function () {
    let log = {};
    let options = Util.readData(name + '_' + _Info2.default.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    log = options;
    return log;
};

/**
 * 写入争夺记录
 * @param {{}} log 争夺记录对象
 */
const write = exports.write = log => Util.writeData(name + '_' + _Info2.default.uid, JSON.stringify(log));

/**
 * 清除争夺记录
 */
const clear = exports.clear = () => Util.deleteData(name + '_' + _Info2.default.uid);

/**
 * 记录新的争夺记录
 * @param {string[]} logList 各层争夺记录列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
const record = exports.record = function (logList, pointsLogList) {
    let log = read();
    let overdueDate = Util.getDate(`-${Config.lootLogSaveDays}d`).getTime();
    $.each(Util.getObjectKeyList(log, 1), function (i, key) {
        key = parseInt(key);
        if (isNaN(key) || key <= overdueDate) delete log[key];else return false;
    });
    log[$.now()] = { log: logList, points: pointsLogList };
    write(log);
};

/**
 * 获取合并后的争夺记录
 * @param {{}} log 当前争夺记录
 * @param {{}} newLog 新争夺记录
 * @returns {{}} 合并后的争夺记录
 */
const getMergeLog = exports.getMergeLog = function (log, newLog) {
    for (let key in newLog) {
        if (!$.isNumeric(key) || parseInt(key) <= 0) continue;
        if ($.type(newLog[key]) !== 'object' || !Array.isArray(newLog[key].log) || !Array.isArray(newLog[key].points)) continue;
        log[key] = newLog[key];
    }
    return log;
};

},{"./Const":6,"./Info":9,"./Util":23}],15:[function(require,module,exports){
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

    let $msg = $(`<div class="pd_msg">${settings.msg}</div>`).appendTo($container);
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
    $(':focus').blur();
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
exports.handleProfilePage = exports.addUserNameLinkInRankPage = exports.addAvatarChangeAlert = exports.syncModifyPerPageFloorNum = exports.addAutoChangeIdColorButton = exports.addSmLevelFormula = exports.addMsgSelectButton = exports.modifyMyPostLink = exports.addFollowAndBlockAndMemoUserLink = exports.addFastDrawMoneyLink = exports.highlightUnReadAtTipsMsg = exports.addFastGotoThreadPageLink = exports.highlightNewPost = undefined;

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
                    html += `..<a href="${url}&page=${totalPageNum}">${totalPageNum}</a>`;
                }
                break;
            }
            html += `<a href="${url}&page=${i + 1}">${i + 1}</a>`;
        }
        html = `<span class="pd_thread_page">&hellip;${html}</span>`;
        $link.after(html).parent().css('white-space', 'normal');
    });
};

/**
 * 高亮at提醒页面中未读的消息
 */
const highlightUnReadAtTipsMsg = exports.highlightUnReadAtTipsMsg = function () {
    if ($('.kf_share1:first').text().trim() !== `含有关键词 “${_Info2.default.userName}” 的内容`) return;
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
        $msg.html(html.replace(/会员\[(.+?)\]通过论坛银行/, '会员[<a target="_blank" href="profile.php?action=show&username=$1">$1</a>]通过论坛银行').replace(matches[0], `给你转帐<span class="pd_stat"><em>${money.toLocaleString()}</em></span>KFB`));

        $('<br><a title="从活期存款中取出当前转账的金额" href="#">快速取款</a> | <a title="取出银行账户中的所有活期存款" href="#">取出所有存款</a>').appendTo($msg).filter('a:eq(0)').click(function (e) {
            e.preventDefault();
            Msg.destroy();
            Bank.drawCurrentDeposit(money);
        }).end().filter('a:eq(1)').click(function (e) {
            e.preventDefault();
            Msg.destroy();
            Msg.wait('<strong>正在获取当前活期存款金额&hellip;</strong>');
            $.get('hack.php?H_name=bank&t=' + $.now(), function (html) {
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
                $info.html(`备注：${str}<br>${$info.html()}`);
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

    $('<input value="反选" type="button" style="margin-left: 5px; margin-right: 1px;">').insertAfter('[type="button"][value="全选"]').click(() => Util.selectInverse($checkeds));
};

/**
 * 添加神秘等级计算公式
 */
const addSmLevelFormula = exports.addSmLevelFormula = function () {
    $('.gro_divlv, .gro_divhui').eq(0).closest('table').parent().prev().css('padding-bottom', '0').after('<div style="margin: 15px 0 20px; font-size: 14px; text-align: center; color: #f00;">神秘等级 = 神秘系数<sup>2</sup> + 贡献数值*10 + 发帖数量/100</div>');
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
<button name="save" type="button">保存</button>
<button name="reset" type="button" style="margin-left: 3px;">重置</button><br>
<a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
<a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
<label><input name="changeAllAvailableIdColorEnabled" class="pd_input" type="checkbox"> 选择当前所有可用的ID颜色</label>
`).insertAfter($this.parent()).filter('[name="save"]').click(function () {
                let $autoChangeIdColorInterval = $area.find('[name="autoChangeIdColorInterval"]');
                let interval = parseInt($autoChangeIdColorInterval.val());
                if (isNaN(interval) || interval <= 0) {
                    alert('ID颜色更换时间间隔格式不正确');
                    $autoChangeIdColorInterval.select().focus();
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
            }).end().filter('[name="reset"]').click(function () {
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
            }).end().filter('[data-name="selectAll"], [data-name="selectInverse"]').click(function (e) {
                e.preventDefault();
                if ($idColors.find('input[disabled]').length > 0) {
                    alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                    $area.find('[name="changeAllAvailableIdColorEnabled"]').focus();
                    return;
                }
                if ($(this).is('[data-name="selectAll"]')) Util.selectAll($idColors.find('[type="checkbox"]'));else Util.selectInverse($idColors.find('[type="checkbox"]'));
            });

            $idColors.find('td:has(a)').each(function () {
                let $this = $(this);
                let matches = /&color=(\d+)/i.exec($this.find('a').attr('href'));
                if (matches) $this.append(`<input type="checkbox" class="pd_input" value="${matches[1]}">`);
            });

            $area.find('[name="autoChangeIdColorType"]').val(Config.autoChangeIdColorType);
            $area.find('[name="autoChangeIdColorInterval"]').val(Config.autoChangeIdColorInterval);
            $area.find('[name="changeAllAvailableIdColorEnabled"]').click(function () {
                $idColors.find('input').prop('disabled', $(this).prop('checked'));
            }).prop('checked', Config.changeAllAvailableIdColorEnabled).triggerHandler('click');
            for (let id of Config.customAutoChangeIdColorList) {
                $idColors.find(`input[value="${id}"]`).prop('checked', true);
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
 * 在论坛排行页面为用户名添加链接
 */
const addUserNameLinkInRankPage = exports.addUserNameLinkInRankPage = function () {
    $('.kf_no11:eq(2) > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === _Info2.default.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 处理个人信息页面上的元素
 */
const handleProfilePage = exports.handleProfilePage = function () {
    let $area = $('.log1 > tbody > tr:last-child > td:nth-child(2)');
    $area.html($area.html().replace(/<b>在线<\/b>/, '<b style="color: #090;">在线</b>').replace(/<b>离线<\/b>/, '<b style="color: #999;">离线</b>').replace(/系统等级：(\S+)/, '系统等级：<span class="pd_highlight">$1</span>').replace(/发帖数量：(\d+)/, (m, num) => `发帖数量：<span data-num="${num}">${parseInt(num).toLocaleString()}</span>`).replace(/论坛货币：(-?\d+)/, (m, num) => `论坛货币：<span data-num="${num}">${parseInt(num).toLocaleString()}</span>`).replace(/在线时间：(\d+)/, (m, num) => `在线时间：<span data-num="${num}">${parseInt(num).toLocaleString()}</span>`).replace(/注册时间：((\d{4})-(\d{2})-(\d{2}))/, (m, date, year, month, day) => {
        let now = new Date();
        let html = date;
        if (parseInt(month) === now.getMonth() + 1 && parseInt(day) === now.getDate() && parseInt(year) <= now.getFullYear()) html = `<span class="pd_custom_tips pd_highlight" title="今天是该用户注册${now.getFullYear() - parseInt(year)}周年纪念日">${date}</span>`;
        return '注册时间：' + html;
    })).css('vertical-align', 'top');
};

},{"./Bank":2,"./Config":4,"./ConfigDialog":5,"./Const":6,"./Info":9,"./Msg":15,"./Public":18,"./TmpLog":22,"./Util":23}],17:[function(require,module,exports){
/* 发帖模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addRedundantKeywordWarning = exports.savePostContentWhenSubmit = exports.preventCloseWindowWhenEditPost = exports.importKfSmileEnhanceExtension = exports.addAttachChangeAlert = exports.modifyPostPreviewPage = exports.addExtraOptionInPostPage = exports.addExtraPostEditorButton = exports.removeUnpairedBBCodeInQuoteContent = exports.handleMultiQuote = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 处理多重回复和多重引用
 * @param {number} type 处理类型，1：多重回复；2：多重引用
 */
const handleMultiQuote = exports.handleMultiQuote = function (type = 1) {
    Script.runFunc('Post.handleMultiQuote_before_', type);
    if (!$('#pdClearMultiQuoteData').length) {
        $('<a id="pdClearMultiQuoteData" style="margin-left: 7px;" title="清除在浏览器中保存的多重引用数据" href="#">清除引用数据</a>').insertAfter('input[name="diy_guanjianci"]').click(function (e) {
            e.preventDefault();
            localStorage.removeItem(_Const2.default.multiQuoteStorageName);
            $('input[name="diy_guanjianci"]').val('');
            $(type === 2 ? '#textarea' : '[name="atc_content"]').val('');
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
    let $keywords = $('input[name="diy_guanjianci"]');
    if (type === 2) {
        Msg.wait(`<strong>正在获取引用内容中&hellip;</strong><i>剩余：<em class="pd_countdown">${list.length}</em></i>`);
        $(document).clearQueue('MultiQuote');
    }
    $.each(list, function (index, data) {
        if (typeof data.floor === 'undefined' || typeof data.pid === 'undefined') return;
        keywords.add(data.userName);
        if (type === 2) {
            $(document).queue('MultiQuote', function () {
                $.get(`post.php?action=quote&fid=${fid}&tid=${tid}&pid=${data.pid}&article=${data.floor}&t=${$.now()}`, function (html) {
                    let matches = /<textarea id="textarea".*?>((.|\n)+?)<\/textarea>/i.exec(html);
                    if (matches) {
                        content += Util.removeUnpairedBBCodeContent(Util.htmlDecode(matches[1]).replace(/\n{2,}/g, '\n')) + (index === list.length - 1 ? '' : '\n');
                    }
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    if (index === list.length - 1) {
                        Msg.destroy();
                        $('#textarea').val(content).focus();
                        $keywords.trigger('change');
                    } else {
                        setTimeout(function () {
                            $(document).dequeue('MultiQuote');
                        }, 100);
                    }
                });
            });
        } else {
            content += `[quote]回 ${data.floor}楼(${data.userName}) 的帖子[/quote]\n`;
        }
    });
    $keywords.val([...keywords].join(','));
    $('form[name="FORM"]').submit(function () {
        localStorage.removeItem(_Const2.default.multiQuoteStorageName);
    });
    if (type === 2) {
        $(document).dequeue('MultiQuote');
    } else {
        $('[name="atc_content"]').val(content).focus();
        $keywords.trigger('change');
    }
    Script.runFunc('Post.handleMultiQuote_after_', type);
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
    let textArea = $('#textarea').get(0);
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
                    text = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐的单曲地址，将自动转换为外链地址）', 'http://');
                    let matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(text);
                    if (matches) text = `http://music.miaola.info/163/${matches[1]}.mp3`;
                    matches = /^https?:\/\/www\.xiami\.com\/song\/(\w+)/i.exec(text);
                    if (matches) text = `http://music.miaola.info/xiami/${matches[1]}.mp3`;
                }
                break;
            case 'video':
                {
                    text = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://');
                    let matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(text);
                    if (matches) text = `http://video.miaola.info/youtube/${matches[1]}`;
                    matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(text);
                    if (matches) text = `http://video.miaola.info/youtube/${matches[1]}`;
                }
                break;
        }
        if (text === null) return;

        let selText = '';
        let code = '';
        switch (type) {
            case 'hide':
                selText = Util.getSelText(textArea);
                code = `[hide=${text}]${selText}[/hide]`;
                break;
            case 'left':
                selText = Util.getSelText(textArea);
                code = `[align=left]${selText}[/align]`;
                break;
            case 'center':
                selText = Util.getSelText(textArea);
                code = `[align=center]${selText}[/align]`;
                break;
            case 'right':
                selText = Util.getSelText(textArea);
                code = `[align=right]${selText}[/align]`;
                break;
            case 'fly':
                selText = Util.getSelText(textArea);
                code = `[fly]${selText}[/fly]`;
                break;
            case 'sub':
                selText = Util.getSelText(textArea);
                code = `[sub]${selText}[/sub]`;
                break;
            case 'sup':
                selText = Util.getSelText(textArea);
                code = `[sup]${selText}[/sup]`;
                break;
            case 'audio':
                code = `[audio]${text}[/audio]`;
                break;
            case 'video':
                code = `[video]${text}[/video]`;
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
        $('form[name="FORM"]').find(`[name="${inputName}"]`).val($this.prop('checked') ? 1 : 0);
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

/**
 * 引入绯月表情增强插件
 */
const importKfSmileEnhanceExtension = exports.importKfSmileEnhanceExtension = function () {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = 'https://kf.miaola.info/KfEmotion.min.user.js' + (typeof _Info2.default.w.resTimestamp !== 'undefined' ? '?ts=' + _Info2.default.w.resTimestamp : '');
    document.body.appendChild(script);
};

/**
 * 在撰写发帖内容时阻止关闭页面
 */
const preventCloseWindowWhenEditPost = exports.preventCloseWindowWhenEditPost = function () {
    window.addEventListener('beforeunload', function (e) {
        let $textArea = $(location.pathname === '/post.php' ? '#textarea' : 'input[name="atc_content"]');
        let content = $textArea.val();
        if (content && content !== $textArea.get(0).defaultValue && !/\[\/quote]\n*$/.test(content) && !_Info2.default.w.isSubmit) {
            let msg = '你可能正在撰写发帖内容中，确定要关闭页面吗？';
            e.returnValue = msg;
            return msg;
        }
    });

    $('form[action="post.php?"]').submit(function () {
        _Info2.default.w.isSubmit = true;
    });
};

/**
 * 在提交时保存发帖内容
 */
const savePostContentWhenSubmit = exports.savePostContentWhenSubmit = function () {
    let $textArea = $(location.pathname === '/post.php' ? '#textarea' : 'input[name="atc_content"]');
    $('form[action="post.php?"]').submit(function () {
        let content = $textArea.val();
        if ($.trim(content).length > 0) sessionStorage.setItem(_Const2.default.postContentStorageName, content);
    });

    let postContent = sessionStorage.getItem(_Const2.default.postContentStorageName);
    if (postContent) {
        $(`
<div style="padding: 0 10px; line-height: 2em; text-align: left; background-color: #fefee9; border: 1px solid #99f;">
  <a class="pd_btn_link" data-name="restore" href="#">[恢复上次提交的内容]</a>
  <a class="pd_btn_link" data-name="clear" href="#">[清除]</a>
</div>
`).insertBefore($textArea).find('[data-name="restore"]').click(function (e) {
            e.preventDefault();
            $textArea.val(postContent);
            $(this).parent().find('[data-name="clear"]').click();
        }).end().find('[data-name="clear"]').click(function (e) {
            e.preventDefault();
            sessionStorage.removeItem(_Const2.default.postContentStorageName);
            $(this).parent().remove();
        });
    }
};

/**
 * 添加多余关键词警告
 */
const addRedundantKeywordWarning = exports.addRedundantKeywordWarning = function () {
    $('input[name="diy_guanjianci"]').change(function () {
        let $this = $(this);
        let keywords = $.trim($this.val()).split(',').filter(str => str);
        if (keywords.length > 5) {
            alert('所填关键词已超过5个，多余的关键词将被忽略');
            $this.select().focus();
        }
    });
};

},{"./Const":6,"./Info":9,"./Msg":15,"./Script":20,"./Util":23}],18:[function(require,module,exports){
/* 公共模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addSlowActionChecked = exports.changeNewRateTipsColor = exports.showCommonImportOrExportConfigDialog = exports.turnPageViaKeyboard = exports.repairBbsErrorCode = exports.addSearchDialogLink = exports.makeSearchByBelowTwoKeyWordAvailable = exports.bindSearchTypeSelectMenuClick = exports.bindElementTitleClick = exports.showElementTitleTips = exports.changeIdColor = exports.autoSaveCurrentDeposit = exports.addFastNavMenu = exports.modifySideBar = exports.blockThread = exports.blockUsers = exports.followUsers = exports.getDailyBonus = exports.startTimingMode = exports.getNextTimingIntervalInfo = exports.addPolyfill = exports.showFormatLog = exports.preventCloseWindowWhenActioning = exports.addConfigAndLogDialogLink = exports.appendCss = exports.checkBrowserType = exports.getSafeId = exports.getUidAndUserName = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Config = require('./Config');

var _ConfigDialog = require('./ConfigDialog');

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _LogDialog = require('./LogDialog');

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

var _Read = require('./Read');

var Read = _interopRequireWildcard(_Read);

var _Loot = require('./Loot');

var Loot = _interopRequireWildcard(_Loot);

var _Item = require('./Item');

var Item = _interopRequireWildcard(_Item);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取Uid和用户名
 * @returns {boolean} 是否获取成功
 */
const getUidAndUserName = exports.getUidAndUserName = function () {
    let $userName = $('.topmenuo1 > .topmenuo3:last-child > a[href="javascript:;"]').eq(0);
    let $uid = $('.topmenuo1 > .topmenuo3:last-child a[href^="profile.php?action=show&uid="]').eq(0);
    if (!$userName.length || !$uid.length) return false;
    $userName.attr('id', 'pdUserName');
    _Info2.default.userName = $.trim($userName.contents().get(0).textContent);
    if (!_Info2.default.userName) return false;
    let matches = /&uid=(\d+)/.exec($uid.attr('href'));
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
  .pd_input[type="text"], .pd_input[type="number"], .pd_cfg_main input[type="text"], .pd_cfg_main input[type="number"] {
    height: 22px; line-height: 22px;
  }
  .pd_input:focus, .pd_cfg_main input[type="text"]:focus, .pd_cfg_main input[type="number"]:focus, .pd_cfg_main textarea:focus,
      .pd_textarea:focus { border-color: #7eb4ea; }
  .pd_textarea, .pd_cfg_main textarea { border: 1px solid #ccc; font-size: 12px; }
  .pd_btn_link { margin-left: 4px; margin-right: 4px; }
  .pd_custom_tips { cursor: help; }
  .pd_disabled_link { color: #999 !important; text-decoration: none !important; cursor: default; }
  hr {
    box-sizing: content-box; height: 0; margin-top: 7px; margin-bottom: 7px; border: 0;
    border-top: 1px solid rgba(0, 0, 0, .2); overflow: visible;
  }
  .pd_overflow { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pd_hide { width: 0 !important; height: 0 !important; font: 0/0 a; color: transparent; background-color: transparent; border: 0 !important; }
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
    text-indent: 13px; cursor: pointer; z-index: 1004;
  }
  .pd_search_type_list li:hover { color: #fff; background-color: #87c3cf; }
  ${_Info2.default.isMobile ? '.topmenu { position: static; }' : ''}
  ${_Info2.default.isMobile ? '.r_cmenu { position: static !important; }' : ''}
  .topmenu { z-index: 1001; }
  
  /* 消息框 */
  .pd_mask { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1000; }
  .pd_msg_container { position: ${_Info2.default.isMobile ? 'absolute' : 'fixed'}; width: 100%; z-index: 1003; }
  .pd_msg {
    border: 1px solid #6ca7c0; text-shadow: 0 0 3px rgba(0, 0, 0, 0.1); border-radius: 3px; padding: 10px 40px; text-align: center;
    font-size: 14px; position: absolute; display: none; color: #333; line-height: 1.6em; background: #f8fcfe; background-repeat: no-repeat;
    background-image: -webkit-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);
    background-image: -moz-linear-gradient(top, #f9fcfe, #f6fbfe 25%, #eff7fc);
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
  .pd_user_memo { font-size: 12px; color: #999; line-height: 14px; }
  .pd_user_memo_tips { font-size: 12px; color: #fff; margin-left: 3px; cursor: help; }
  .pd_user_memo_tips:hover { color: #ddd; }
  .readtext img[onclick] { max-width: 550px; }
  .read_fds { text-align: left !important; font-weight: normal !important; font-style: normal !important; }
  .pd_code_area { max-height: 550px; overflow-y: auto; font-size: 12px; font-family: Consolas, "Courier New"; }
  
  /* 我的物品页面 */
  .pd_item_btns { text-align: right; margin-top: 5px;  }
  .pd_item_btns button, .pd_item_btns input { margin-bottom: 2px; vertical-align: middle; }
  .pd_result { border: 1px solid #99f; padding: 5px; margin-top: 10px; line-height: 2em; }
  .pd_arm_equipped { background-color:#eef; -webkit-box-shadow: 0 0 7px #99f; box-shadow: 0 0 7px #99f; }
  .pd_arm_equipped > td:nth-child(3)::before { content: "（装备中）"; font-weight: bold; }
  .pd_arm_equipped a[data-name="equip"], .pd_arm_equipped a[data-name="smelt"] { color: #777; pointer-events: none; }
  .kf_fw_ig4 > tbody > tr > td { position: relative; }
  .kf_fw_ig4 > tbody > tr > td[data-memo]::after {
    content: "(" attr(data-memo) ")"; position: absolute; bottom: 0; right: 5px; padding: 0 5px; color: #777; background: rgba(252, 252, 252, .7);
  }
  .kf_fw_ig4 > tbody > .pd_arm_equipped > td[data-memo]::after { background: rgba(238, 238, 255, .7); }
  .kf_fw_ig4 > tbody > tr > td > input[name="armCheck"] { position: absolute; top: 0; left: 5px; }
  .show_arm_info { position: absolute; top: 0; right: 0; padding: 0 10px; background: rgba(252, 252, 252, .9); }
  .pd_arm_equipped .show_arm_info { background: rgba(238, 238, 255, .9); }
  .pd_useless_sub_property { color: #999; text-decoration: line-through; }
  
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
  #pdPropertiesArea td { position: relative; }
  #pdPropertiesArea input[type="text"] { width: 211px; }
  .pd_property_diff { position: absolute; top: 0px; right: 5px; }
  .pd_property_diff em { font-style: normal; }

  /* 设置对话框 */
  .pd_cfg_ml { margin-left: 10px; }
  .pd_cfg_box {
    position: ${_Info2.default.isMobile ? 'absolute' : 'fixed'}; border: 1px solid #9191ff; display: none; z-index: 1002;
    -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  }
  .pd_cfg_box h1 {
    text-align: center; font-size: 14px; background-color: #9191ff; color: #fff; line-height: 2em; margin: 0; padding-left: 20px;
  }
  .pd_cfg_box h1 span { float: right; cursor: pointer; padding: 0 10px; }
  .pd_cfg_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }
  .pd_cfg_main { background-color: #fcfcfc; padding: 0 10px; font-size: 12px; line-height: 24px; min-height: 50px; overflow: auto; }
  .pd_cfg_main fieldset { border: 1px solid #ccccff; padding: 0 6px 6px; }
  .pd_cfg_main legend { font-weight: bold; }
  .pd_cfg_main input[type="color"] { height: 18px; width: 30px; padding: 0; }
  pd_cfg_main button { vertical-align: middle; }
  .pd_cfg_tips { color: #51d; text-decoration: none; cursor: help; }
  .pd_cfg_tips:hover { color: #ff0000; }
  #pdConfigDialog .pd_cfg_main { overflow-x: hidden; white-space: nowrap; }
  .pd_cfg_panel { display: inline-block; width: 400px; vertical-align: top; }
  .pd_cfg_panel + .pd_cfg_panel { margin-left: 5px; }
  .pd_cfg_btns { background-color: #fcfcfc; text-align: right; padding: 5px; }
  .pd_cfg_btns input, .pd_cfg_btns button { vertical-align: middle; }
  .pd_cfg_btns button { min-width: 80px; }
  .pd_cfg_about { float: left; line-height: 24px; margin-left: 5px; }
  .pd_custom_script_header { margin: 7px 0; padding: 5px; background-color: #e8e8e8; border-radius: 5px; }
  .pd_custom_script_content { display: none; width: 750px; height: 350px; white-space: pre; }

  /* 日志对话框 */
  .pd_log_nav { text-align: center; margin: -5px 0 -12px; font-size: 14px; line-height: 44px; }
  .pd_log_nav a { display: inline-block; }
  .pd_log_nav h2 { display: inline; font-size: 14px; margin-left: 7px; margin-right: 7px; }
  .pd_log_content { height: 242px; overflow: auto; }
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
 * 添加设置和日志对话框的链接
 */
const addConfigAndLogDialogLink = exports.addConfigAndLogDialogLink = function () {
    $(`
<li><a data-name="openConfigDialog" href="#">助手设置</a></li>
<li><a data-name="openLogDialog" href="#">助手日志</a></li>
`).insertBefore(_Info2.default.$userMenu.find('> li:nth-last-child(1)')).find('[data-name="openConfigDialog"]').click(function (e) {
        e.preventDefault();
        (0, _ConfigDialog.show)();
    }).end().find('[data-name="openLogDialog"]').click(function (e) {
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
    console.log(`【${msgType}】回应：${msg}${url ? `；跳转地址：${Util.getHostNameUrl()}${url}` : ''}`);
};

/**
 * 添加兼容方法
 */
const addPolyfill = exports.addPolyfill = function () {
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (searchElement /*, fromIndex = 0 */) {
            if (this == null) throw new TypeError('Array.prototype.includes called on null or undefined');
            const O = Object(this);
            const len = parseInt(O.length) || 0;
            if (len === 0) return false;
            let n = parseInt(arguments[1]) || 0;
            let k;
            if (n >= 0) k = n;else {
                k = len + n;
                if (k < 0) k = 0;
            }
            let currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) return true;
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
                if (fLen > remainingCodeUnits) filler += filler.slice(0, remainingCodeUnits);else filler += filler;
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
                if (fLen > remainingCodeUnits) filler += filler.slice(0, remainingCodeUnits);else filler += filler;
            }
            const truncatedStringFiller = filler.slice(0, fillLen);
            return S + truncatedStringFiller;
        };
    }
};

/**
 * 获取定时模式下次操作的时间间隔信息
 * @returns {{action: string, interval: number}} action：下次操作的名称；interval：下次操作的时间间隔（秒）
 */
const getNextTimingIntervalInfo = exports.getNextTimingIntervalInfo = function () {
    let promoteHaloInterval = -1;
    if (Config.autoPromoteHaloEnabled) {
        let value = parseInt(Util.getCookie(_Const2.default.promoteHaloCookieName));
        if (value > 0) promoteHaloInterval = Math.floor((value - $.now()) / 1000);else promoteHaloInterval = 0;
    }

    let checkLootInterval = -1;
    if (Config.autoLootEnabled || Config.autoSaveLootLogInSpecialCaseEnabled) {
        let value = parseInt(Util.getCookie(_Const2.default.lootCompleteCookieName));
        if (value < 0) checkLootInterval = _Const2.default.checkLootInterval * 60;else {
            let date = Util.getDateByTime(Config.checkLootAfterTime);
            let now = new Date();
            if (value > 0 && now > date) date.setDate(date.getDate() + 1);
            checkLootInterval = Math.floor((date - now) / 1000);
            if (checkLootInterval < 0) checkLootInterval = 0;
        }

        if (Util.getCookie(_Const2.default.lootAttackingCookieName)) checkLootInterval = _Const2.default.lootAttackingExpires * 60;else {
            let changePointsInfo = Util.getCookie(_Const2.default.changePointsInfoCookieName);
            changePointsInfo = $.isNumeric(changePointsInfo) ? parseInt(changePointsInfo) : 0;
            if (changePointsInfo > 0) checkLootInterval = Math.floor((changePointsInfo - $.now()) / 1000);
        }
    }

    let getDailyBonusInterval = -1;
    if (Config.autoGetDailyBonusEnabled) {
        let value = parseInt(Util.getCookie(_Const2.default.getDailyBonusCookieName));
        if (value > 0) {
            let date = Util.getTimezoneDateByTime(_Const2.default.getDailyBonusAfterTime);
            date.setDate(date.getDate() + 1);
            let now = new Date();
            if (now > date) date.setDate(date.getDate() + 1);
            getDailyBonusInterval = Math.floor((date - now) / 1000);
        } else if (value < 0) getDailyBonusInterval = _Const2.default.getDailyBonusSpecialInterval * 60;else getDailyBonusInterval = 0;
    }

    let buyItemInterval = -1;
    if (Config.autoBuyItemEnabled) {
        let date = Util.getDateByTime(Config.buyItemAfterTime);
        let now = new Date();
        if (Util.getCookie(_Const2.default.buyItemCookieName) || now < date) {
            if (now > date) date.setDate(date.getDate() + 1);
            buyItemInterval = Math.floor((date - now) / 1000);
        } else buyItemInterval = 0;
    }

    let intervalList = [{ action: '提升战力光环', interval: promoteHaloInterval }, { action: '检查争夺情况', interval: checkLootInterval }, { action: '自动获取每日奖励', interval: getDailyBonusInterval }, { action: '自动购买物品', interval: buyItemInterval }];
    let minAction = '',
        minInterval = -1;
    for (let { action, interval } of intervalList.filter(data => data.interval > -1)) {
        if (minInterval < 0 || interval < minInterval) {
            minAction = action;
            minInterval = interval;
        }
    }
    return { action: minInterval > 0 ? minAction : '', interval: minInterval };
};

/**
 * 启动定时模式
 */
const startTimingMode = exports.startTimingMode = function () {
    let { action, interval } = getNextTimingIntervalInfo();
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
        let diff = Util.getTimeDiffInfo(Util.getDate('+' + interval + 's').getTime());
        let textInterval = diff.hours > 0 ? diff.hours + '时' : '';
        if (type === 1) textInterval += (diff.minutes > 0 ? diff.minutes + '分' : '') + diff.seconds + '秒';else textInterval += diff.minutes + '分';
        return textInterval;
    };

    /**
     * 显示定时模式标题提示
     * @param {number} interval 倒计时的时间间隔（秒）
     * @param {string} action 下次操作的名称
     * @param {boolean} isShowTitle 是否立即显示标题
     */
    const showRefreshModeTips = function (interval, action = '', isShowTitle = false) {
        if (titleItvFunc) window.clearInterval(titleItvFunc);
        let showInterval = interval;
        console.log(`【定时模式】倒计时${action ? `(${action})` : ''}：` + getFormatIntervalTitle(1, showInterval));
        if (Config.showTimingModeTipsType.toLowerCase() !== 'never') {
            const showIntervalTitle = function () {
                document.title = `${oriTitle} (定时: ${getFormatIntervalTitle(interval < 60 ? 1 : 2, showInterval)})`;
                showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            };
            if (isShowTitle || Config.showTimingModeTipsType.toLowerCase() === 'always' || interval < 60) showIntervalTitle();else showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
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
            url: 'index.php?t=' + $.now(),
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
                    console.log(`定时操作失败（原因：${errorText}），将在${interval}分钟后重试...`);
                    Msg.remove($('.pd_refresh_notice').parent());
                    Msg.show(`<strong class="pd_refresh_notice">定时操作失败（原因：${errorText}），将在<em>${interval}</em>分钟后重试&hellip;</strong>`, -1);
                    setTimeout(handleError, interval * 60 * 1000);
                    showRefreshModeTips(interval * 60, '', true);
                } else {
                    if (errorNum > 6) {
                        errorNum = 0;
                        interval = 15;
                        setTimeout(checkRefreshInterval, interval * 60 * 1000);
                        showRefreshModeTips(interval * 60, '', true);
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

        let isAutoPromoteHaloStarted = false;
        if (Config.autoPromoteHaloEnabled && !Util.getCookie(_Const2.default.promoteHaloCookieName)) {
            isAutoPromoteHaloStarted = true;
            Loot.getPromoteHaloInfo();
        }

        if (!Util.getCookie(_Const2.default.lootCompleteCookieName)) {
            if (Config.autoLootEnabled && !isAutoPromoteHaloStarted) {
                if (!Util.getCookie(_Const2.default.lootAttackingCookieName) && !$.isNumeric(Util.getCookie(_Const2.default.changePointsInfoCookieName))) Loot.checkLoot();
            } else if (Config.autoSaveLootLogInSpecialCaseEnabled) {
                Loot.autoSaveLootLog();
            }
        }

        if (Config.autoGetDailyBonusEnabled && !Util.getCookie(_Const2.default.getDailyBonusCookieName)) getDailyBonus();

        if (Config.autoBuyItemEnabled && !Util.getCookie(_Const2.default.buyItemCookieName)) {
            let safeId = getSafeId();
            if (safeId) Item.buyItems(Config.buyItemIdList, safeId);
        }

        let { action, interval } = getNextTimingIntervalInfo();
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
        showRefreshModeTips(interval, action, true);
    };

    setTimeout(checkRefreshInterval, interval < 60 ? 60 * 1000 : interval * 1000);
    showRefreshModeTips(interval < 60 ? 60 : interval, action);
};

/**
 * 领取每日奖励
 */
const getDailyBonus = exports.getDailyBonus = function () {
    Script.runFunc('Public.getDailyBonus_before_');
    console.log('领取每日奖励Start');
    let $wait = Msg.wait('<strong>正在领取每日奖励，请稍候&hellip;</strong>');

    /**
     * 获取领取每日奖励Cookies有效期
     * @returns {Date} Cookies有效期的Date对象
     */
    const getCookieDate = function () {
        let date = Util.getTimezoneDateByTime(_Const2.default.getDailyBonusAfterTime);
        date.setDate(date.getDate() + 1);
        if (new Date() > date) date.setDate(date.getDate() + 1);
        return date;
    };

    $.ajax({
        type: 'GET',
        url: 'kf_growup.php?t=' + $.now(),
        timeout: _Const2.default.defAjaxTimeout
    }).done(function (html) {
        let matches = /<a href="(kf_growup\.php\?ok=3&safeid=\w+)" target="_self">你可以领取\s*(\d+)KFB\s*\+\s*(\d+)经验\s*\+\s*(\d+(?:\.\d+)?)贡献\s*\+\s*(\d+)转账额度/.exec(html);
        if (matches) {
            if (Config.getBonusAfterLootCompleteEnabled && !/<div class="gro_divlv">\r\n争夺奖励/.test(html)) {
                Util.setCookie(_Const2.default.getDailyBonusCookieName, -1, Util.getDate(`+${_Const2.default.getDailyBonusSpecialInterval}m`));
                Msg.remove($wait);
                return;
            }
            if (Config.getBonusAfterSpeakCompleteEnabled && !/<div class="gro_divlv">\r\n发言奖励/.test(html)) {
                Util.setCookie(_Const2.default.getDailyBonusCookieName, -1, Util.getDate(`+${_Const2.default.getDailyBonusSpecialInterval}m`));
                Msg.remove($wait);
                return;
            }
            let url = matches[1];
            let gain = {};
            if (parseInt(matches[2]) > 0) gain['KFB'] = parseInt(matches[2]);
            if (parseInt(matches[3]) > 0) gain['经验值'] = parseInt(matches[3]);
            if (parseFloat(matches[4]) > 0) gain['贡献'] = parseFloat(matches[4]);
            if (parseInt(matches[5]) > 0) gain['转账额度'] = parseInt(matches[5]);

            $.get(`${url}&t=${$.now()}`, function (html) {
                Util.setCookie(_Const2.default.getDailyBonusCookieName, 1, getCookieDate());
                showFormatLog('领取每日奖励', html);
                let { msg } = Util.getResponseMsg(html);
                Msg.remove($wait);

                if (/领取成功/.test(msg)) {
                    let logStatText = '',
                        msgStatText = '';
                    for (let [key, num] of Util.entries(gain)) {
                        logStatText += `${key}+${num} `;
                        msgStatText += `<i>${key}<em>+${num.toLocaleString()}</em></i>`;
                    }
                    console.log('领取每日奖励，' + logStatText);
                    Msg.show('<strong>领取每日奖励</strong>' + msgStatText);
                    if (!$.isEmptyObject(gain)) Log.push('领取每日奖励', '领取每日奖励', { gain });
                    if (Config.promoteHaloLimit > 0) Util.deleteCookie(_Const2.default.promoteHaloCookieName);
                }
                Script.runFunc('Public.getDailyBonus_after_', msg);
            }).fail(() => Msg.remove($wait));
        } else {
            Msg.remove($wait);
            Util.setCookie(_Const2.default.getDailyBonusCookieName, 1, getCookieDate());
        }
    }).fail(function () {
        Msg.remove($wait);
        setTimeout(getDailyBonus, _Const2.default.defAjaxInterval);
    });
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
                if (Config.highlightFollowUserThreadLinkEnabled) {
                    $this.parent('td').prev('td').prev('td').find('div > a[href^="read.php?tid="]').addClass('pd_highlight');
                }
            }
        });
    } else if (location.pathname === '/read.php') {
        $('.readidmsbottom > a, .readidmleft > a').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.closest('.readtext').prev('div').prev('.readlou').find('div:nth-child(2) > span:first-child').find('a').addBack().addClass('pd_highlight');
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
    if (!Config.blockUserList.length) return;
    let num = 0;
    if (_Info2.default.isInHomePage) {
        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            let $this = $(this);
            let matches = /》by：(.+)/.exec($this.attr('title'));
            if (!matches) return;
            let index = Util.inFollowOrBlockUserList(matches[1], Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                num++;
                $this.parent('li').remove();
            }
        });
    } else if (location.pathname === '/thread.php') {
        let fid = parseInt($('input[name="f_fid"]:first').val());
        if (!fid) return;
        if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(fid)) return;else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(fid)) return;
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                num++;
                $this.closest('tr').remove();
            }
        });
    } else if (location.pathname === '/read.php') {
        if (Config.blockUserForumType > 0) {
            let fid = parseInt($('input[name="fid"]:first').val());
            if (!fid) return;
            if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(fid)) return;else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(fid)) return;
        }
        let page = Util.getCurrentThreadPage();
        $('.readidmsbottom > a, .readidmleft > a').each(function (i) {
            let $this = $(this);
            let index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1) {
                let type = Config.blockUserList[index].type;
                if (i === 0 && page === 1 && type > 1) return;else if ((i === 0 && page !== 1 || i > 0) && type === 1) return;
                num++;
                let $lou = $this.closest('.readtext');
                $lou.prev('div').prev('.readlou').remove();
                $lou.prev('div').remove();
                $lou.next('.readlou').remove();
                $lou.remove();
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
                } catch (ex) {}
            }
        });
    } else if (location.pathname === '/guanjianci.php' && Config.blockUserAtTipsEnabled) {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            let $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.blockUserList) > -1) {
                num++;
                $this.closest('tr').remove();
            }
        });
    }
    if (num > 0) console.log(`【屏蔽用户】共有${num}个帖子或回复被屏蔽`);
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
            let title = $this.attr('title');
            if (!title) return;
            let matches = /^《(.+)》by：(.+)$/.exec(title);
            if (matches) {
                if (isBlock(matches[1], matches[2])) {
                    num++;
                    $this.parent('li').remove();
                }
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
        if ($userName.closest('.readtext').prev('div').prev('.readlou').find('div:nth-child(2) > span:first-child').text().trim() !== '楼主') return;
        let userName = $userName.text();
        if (!userName) return;
        let fid = parseInt($('input[name="fid"]:first').val());
        if (!fid) return;
        if (isBlock(title, userName, fid)) {
            num++;
            let $lou = $userName.closest('.readtext');
            $lou.prev('div').prev('.readlou').remove();
            $lou.prev('div').remove();
            $lou.next('.readlou').remove();
            $lou.remove();
        }
    }
    if (num > 0) console.log(`【屏蔽帖子】共有${num}个帖子被屏蔽`);
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
 * 为顶部导航栏添加快捷导航菜单
 */
const addFastNavMenu = exports.addFastNavMenu = function () {
    let $menuBtn = $('.topmenuo1 > .topmenuo3:nth-last-child(2) > a:contains("本站主页")');
    if (!$menuBtn.length) return;
    let hpUrl = $menuBtn.attr('href');
    $menuBtn.text('快捷导航').attr('href', 'javascript:;').removeAttr('target').after(`
<ul class="topmenuo2">
  <li><a href="${hpUrl}" target="_blank">本站主页</a></li>
  <li><a href="guanjianci.php?gjc=${_Info2.default.userName}">@提醒</a></li>
  <li><a href="search.php?authorid=${_Info2.default.uid}">我的主题</a></li>
  <li><a href="personal.php?action=post">我的回复</a></li>
  <li><a href="kf_fw_ig_mybp.php">我的物品</a></li>
  <li><a href="kf_fw_ig_shop.php">物品商店</a></li>
  <li><a href="kf_fw_ig_halo.php">战力光环</a></li>
  <li><a href="hack.php?H_name=bank">银行</a></li>
  <li><a href="profile.php?action=favor">收藏</a></li>
  ${_Info2.default.isInMiaolaDomain ? '<li><a href="https://m.miaola.info/" target="_blank">移动版</a></li>' : ''}
  ${_Const2.default.customFastNavMenuContent}
</ul>`);
};

/**
 * 自动活期存款
 * @param {boolean} isRead 是否读取个人信息页面以获得当前所持有KFB的信息
 */
const autoSaveCurrentDeposit = exports.autoSaveCurrentDeposit = function (isRead = false) {
    if (!(Config.saveCurrentDepositAfterKfb > 0 && Config.saveCurrentDepositKfb > 0 && Config.saveCurrentDepositKfb <= Config.saveCurrentDepositAfterKfb)) {
        return;
    }
    let $kfb = $('a[href="kf_givemekfb.php"]');

    /**
     * 活期存款
     * @param {number} cash 当前持有的KFB
     */
    const saveCurrentDeposit = function (cash) {
        if (cash < Config.saveCurrentDepositAfterKfb) return;
        let multiple = Math.floor((cash - Config.saveCurrentDepositAfterKfb) / Config.saveCurrentDepositKfb);
        if (cash - Config.saveCurrentDepositKfb * multiple >= Config.saveCurrentDepositAfterKfb) multiple++;
        let money = Config.saveCurrentDepositKfb * multiple;
        if (money <= 0 || money > cash) return;
        console.log('自动活期存款Start');
        $.post('hack.php?H_name=bank', { action: 'save', btype: 1, savemoney: money }, function (html) {
            showFormatLog('自动存款', html);
            let { msg } = Util.getResponseMsg(html);
            if (/完成存款/.test(msg)) {
                Log.push('自动存款', `共有\`${money}\`KFB已自动存入活期存款`);
                console.log(`共有${money}KFB已自动存入活期存款`);
                Msg.show(`共有<em>${money.toLocaleString()}</em>KFB已自动存入活期存款`);
            }
        });
    };

    if (isRead) {
        console.log('获取当前持有KFB Start');
        $.get(`profile.php?action=show&uid=${_Info2.default.uid}&t=${$.now()}`, function (html) {
            let matches = /论坛货币：(\d+)\s*KFB/.exec(html);
            if (matches) saveCurrentDeposit(parseInt(matches[1]));
        });
    } else {
        let kfb = parseInt($kfb.data('kfb'));
        if (kfb) saveCurrentDeposit(kfb);
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
        let nextTime = Util.getDate(`+${Config.autoChangeIdColorInterval}h`);
        Util.setCookie(_Const2.default.autoChangeIdColorCookieName, nextTime.getTime(), nextTime);
    };

    console.log('自动更换ID颜色Start');
    $.get('kf_growup.php?t=' + $.now(), function (html) {
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

            $.get(`kf_growup.php?ok=2&safeid=${safeId}&color=${nextId}&t=${$.now()}`, function (html) {
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
    $(`<div class="pd_title_tips">${title.replace(/\n/g, '<br>')}</div>`).appendTo('body').css('left', e.originalEvent.pageX - 20).css('top', e.originalEvent.pageY + 15);
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
        $keyWord.val(keyWord + ' ' + Math.floor($.now() / 1000));
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
    $('<li><a data-name="search" href="#">搜索</a></li>').insertBefore(_Info2.default.$userMenu.find('a[href="profile.php?action=modify"]').parent()).find('[data-name="search"]').click(function (e) {
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
            'name': 'pdSearchForm',
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
    if (location.pathname === '/read.php') _Info2.default.w.strlen = Util.getStrByteLen;
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
        location.href = url;
    });
};

/**
 * 显示通用的导入/导出设置对话框
 * @param {string} title 对话框标题
 * @param {string} configName 设置名称
 * @param {?function} [callback] 回调方法
 * @param {?function} [callbackAfterSubmit] 在提交之后的回调方法
 */
const showCommonImportOrExportConfigDialog = exports.showCommonImportOrExportConfigDialog = function (title, configName, callback, callbackAfterSubmit) {
    const dialogName = 'pdCommonImOrExConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    let html = `
<div class="pd_cfg_main">
  <div>
    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br>
    <strong>导出设置：</strong>复制文本框里的内容并粘贴到别处即可
  </div>
  <textarea name="commonConfig" style="width: 500px; height: 300px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, `导入或导出${title}`, html);

    $dialog.submit(function (e) {
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
        if (!options || $.type(options) !== $.type(Config[configName])) {
            alert('设置有错误');
            return;
        }
        Config[configName] = options;
        (0, _Config.write)();
        alert('设置已导入');
        Dialog.close(dialogName);
        if (typeof callbackAfterSubmit === 'function') callbackAfterSubmit();else location.reload();
    });
    Dialog.show(dialogName);
    $dialog.find('[name="commonConfig"]').val(JSON.stringify(Config[configName])).select().focus();
    if (typeof callback === 'function') callback($dialog);
};

/**
 * 修改用户名旁有新的评分提醒的颜色
 */
const changeNewRateTipsColor = exports.changeNewRateTipsColor = function () {
    if (_Info2.default.$userMenu.find('a[href="kf_fw_1wkfb.php?ping=3"]:contains("有新的评分")').length > 0) {
        $('#pdUserName').find('span').attr('id', 'pdNewRateTips').css('color', '#5cb85c');
    }
};

/**
 * 添加慢速操作复选框
 * @param {jQuery} $area 待添加区域
 */
const addSlowActionChecked = exports.addSlowActionChecked = function ($area) {
    $(`
<label style="margin-right: 5px;">
  <input name="slowActionEnabled" type="checkbox" ${Config.slowActionEnabled ? 'checked' : ''}> 慢速操作
  <span class="pd_cfg_tips" title="延长部分批量操作的时间间隔（在3~7秒之间），如使用道具、打开盒子等">[?]</span>
</label>
`).prependTo($area).find('input[name="slowActionEnabled"]').click(function () {
        let checked = $(this).prop('checked');
        $('input[name="slowActionEnabled"]').not(this).prop('checked', checked);
        if (Config.slowActionEnabled !== checked) {
            (0, _Config.read)();
            Config.slowActionEnabled = checked;
            (0, _Config.write)();
        }
    });
};

},{"./Config":4,"./ConfigDialog":5,"./Const":6,"./Dialog":7,"./Info":9,"./Item":10,"./Log":11,"./LogDialog":12,"./Loot":13,"./Msg":15,"./Read":19,"./Script":20,"./TmpLog":22,"./Util":23}],19:[function(require,module,exports){
/* 帖子模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addSelfRatingLink = exports.getThreadTitle = exports.showAttachImageOutsideSellBox = exports.parseMediaTag = exports.addMoreSmileLink = exports.addCopyCodeLink = exports.addUserMemo = exports.modifyKFOtherDomainLink = exports.addMultiQuoteButton = exports.getMultiQuoteData = exports.handleBuyThreadBtn = exports.buyThreads = exports.showStatFloorDialog = exports.addStatAndBuyThreadBtn = exports.addCopyBuyersListOption = exports.adjustThreadContentFontSize = exports.adjustThreadContentWidth = exports.modifySmColor = exports.modifyMySmColor = exports.modifyFloorSmColor = exports.fastGotoFloor = exports.addFastGotoFloorInput = exports.addFloorGotoLink = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _Script = require('./Script');

var Script = _interopRequireWildcard(_Script);

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
        let url = `${Util.getHostNameUrl()}read.php?tid=${Util.getUrlParam('tid')}&spid=${linkName}`;
        $this.html(`<a class="pd_goto_link" href="${url}" title="复制楼层链接">${floorText}</a>`);
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
    $(`
<form>
<li class="pd_fast_goto_floor">
  电梯直达 <input class="pd_input" style="width: 30px;" type="text" maxlength="8">
  <span data-name="submit" style="cursor: pointer;">楼</span>
</li>
</form>
`).prependTo($('.readtext:first').prev('div').prev('.readlou').find('> div:first-child > ul')).submit(function (e) {
        e.preventDefault();
        let floor = parseInt($(this).find('input').val());
        if (!floor || floor < 0) return;
        location.href = `read.php?tid=${Util.getUrlParam('tid')}&page=${parseInt(floor / Config.perPageFloorNum) + 1}&floor=${floor}`;
    }).find('[data-name="submit"]').click(function () {
        $(this).closest('form').submit();
    }).end().closest('div').next().css({ 'max-width': '385px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });
};

/**
 * 将页面滚动到指定楼层
 */
const fastGotoFloor = exports.fastGotoFloor = function () {
    let floor = parseInt(Util.getUrlParam('floor'));
    if (!floor || floor < 0) return;
    let $floorNode = $(`.readlou > div:nth-child(2) > span:contains("${floor}楼")`);
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
    $elem.closest('.readtext').css('border-color', color).prev('div').css('border-color', color).prev('.readlou').css('border-color', color).next().next().next('.readlou').css('border-color', color);
};

/**
 * 修改本人的神秘颜色
 */
const modifyMySmColor = exports.modifyMySmColor = function () {
    let $my = $(`.readidmsbottom > a[href="profile.php?action=show&uid=${_Info2.default.uid}"]`);
    if (!$my.length) $my = $(`.readidmleft > a[href="profile.php?action=show&uid=${_Info2.default.uid}"]`);
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
  .readtext td { font-size: ${Config.threadContentFontSize}px; line-height: 1.6em; }
  .readtext td > div, .readtext td > .read_fds { font-size: 12px; }
</style>
`);
    }
};

/**
 * 添加复制购买人名单的选项
 */
const addCopyBuyersListOption = exports.addCopyBuyersListOption = function () {
    $('.readtext select[name="buyers"]').each(function () {
        $(this).find('option:first-child').after('<option value="copyList">复制名单</option>');
    });
    $(document).on('change', 'select[name="buyers"]', function () {
        let $this = $(this);
        if ($this.val() !== 'copyList') return;
        let buyerList = $this.find('option').map(function (index) {
            let name = $(this).text();
            if (index === 0 || index === 1 || name.includes('-'.repeat(11))) return null;else return name;
        }).get().join('\n');
        $this.get(0).selectedIndex = 0;
        if (!buyerList) {
            alert('暂时无人购买');
            return;
        }

        const dialogName = 'pdCopyBuyerListDialog';
        if ($('#' + dialogName).length > 0) return;
        let html = `
<div class="pd_cfg_main">
  <textarea name="buyerList" style="width: 200px; height: 300px; margin: 5px 0;" readonly>${buyerList}</textarea>
</div>`;
        let $dialog = Dialog.create(dialogName, '购买人名单', html);
        Dialog.show(dialogName);
        $dialog.find('[name="buyerList"]').select().focus();
    });
};

/**
 * 添加统计和购买帖子的按钮
 */
const addStatAndBuyThreadBtn = exports.addStatAndBuyThreadBtn = function () {
    $('<span style="margin: 0 5px;">|</span><a data-name="statAndBuyThread" title="统计回帖者名单以及批量购买帖子" href="#">统计和购买</a>').insertAfter('td > a[href^="kf_tidfavor.php?action=favor&tid="]').filter('[data-name="statAndBuyThread"]').click(function (e) {
        e.preventDefault();
        if ($('#pdStatFloorDialog').length > 0) return;

        let tid = parseInt(Util.getUrlParam('tid'));
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
        if (endPage - startPage > _Const2.default.statFloorMaxPage) {
            alert('需访问的总页数不可超过' + _Const2.default.statFloorMaxPage);
            return;
        }

        Msg.destroy();
        Msg.wait(`<strong>正在统计楼层中&hellip;</strong><i>剩余页数：<em class="pd_countdown">${endPage - startPage + 1}</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        statFloor(tid, startPage, endPage, startFloor, endFloor);
    });
};

/**
 * 统计楼层
 * @param {number} tid 帖子ID
 * @param {number} startPage 开始页数
 * @param {number} endPage 结束页数
 * @param {number} startFloor 开始楼层号
 * @param {number} endFloor 结束楼层号
 */
const statFloor = function (tid, startPage, endPage, startFloor, endFloor) {
    let isStop = false;
    let floorList = [];

    /**
     * 统计
     * @param {number} page 第几页
     */
    const stat = function (page) {
        $.ajax({
            type: 'GET',
            url: `read.php?tid=${tid}&page=${page}&t=${$.now()}`,
            timeout: _Const2.default.defAjaxTimeout,
            success(html) {
                $('.readtext', html).each(function () {
                    let data = {};
                    let $floor = $(this);
                    let $floorHeader = $floor.prev('div').prev('.readlou');
                    let floor = parseInt($floorHeader.find('> div:nth-child(2) > span:first-child').text());
                    if (!floor) return;
                    if (floor < startFloor) return;
                    if (floor > endFloor) {
                        isStop = true;
                        return false;
                    }
                    data.pid = parseInt($floorHeader.prev('a').attr('name'));
                    let $user = $floor.find('.readidms, .readidm');
                    data.userName = $user.find('a[href^="profile.php?action=show&uid="]').text();
                    data.smLevel = '';
                    if ($user.hasClass('readidms')) {
                        let matches = /(\S+)级神秘/.exec($user.find('.readidmsbottom').text());
                        if (matches) data.smLevel = matches[1];
                    } else {
                        data.smLevel = $user.find('.readidmright').text().trim();
                    }

                    let $buyer = $floor.find('[name="buyers"]:first');
                    data.status = 0;
                    if ($buyer.length > 0) {
                        let $input = $buyer.next('input');
                        data.status = $input.length > 0 ? 1 : 2;
                        if (data.status === 1) {
                            let matches = /此帖售价\s*(\d+)\s*KFB/.exec($buyer.parent('legend').text());
                            if (matches) data.sell = parseInt(matches[1]);
                            matches = /location\.href="(.+)"/i.exec($input.attr('onclick'));
                            if (matches) data.buyUrl = matches[1];
                        }
                    }
                    floorList[floor] = data;
                });

                let $countdown = $('.pd_countdown:last');
                $countdown.text(parseInt($countdown.text()) - 1);
                isStop = isStop || $countdown.closest('.pd_msg').data('stop');
            },
            error() {
                setTimeout(() => stat(page), _Const2.default.defAjaxInterval);
            },
            complete() {
                if (isStop || page >= endPage) {
                    Msg.destroy();
                    showStatFloorDialog(floorList);
                } else {
                    setTimeout(() => stat(page + 1), _Const2.default.defAjaxInterval);
                }
            }
        });
    };

    stat(startPage);
};

/**
 * 显示统计楼层对话框
 * @param {{}[]} floorList 楼层信息列表
 */
const showStatFloorDialog = exports.showStatFloorDialog = function (floorList) {
    const dialogName = 'pdStatFloorDialog';
    let html = `
<div class="pd_cfg_main">
  <div id="pdStatFloorFilter" style="margin-top: 5px;">
    <label><input name="removeRepeatedEnabled" type="checkbox"> 去除重复</label>
    <label><input name="removeTopFloorEnabled" type="checkbox"> 去除楼主</label>
  </div>
  <div id="pdStatFloorSelectBtns">
    <label style="margin-left: 3px;">售价区间：</label>
    <input name="startSell" type="number" value="1" min="1" max="100" style="width: 40px;"> -
    <input name="endSell" type="number" value="100" min="1" max="100" style="width: 40px;">
    <label style="margin-left: 3px;">
      每名用户限选 <input name="limitNum" type="number" min="0" style="width: 32px;"> 个
    </label>
    <a class="pd_btn_link" data-name="selectFilter" href="#">筛选</a><br>
    <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
    <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
  </div>
  <div class="pd_highlight" style="text-align: center;">
    共显示<b id="pdStatFloorShowCount">0</b>条项目，共选择<b id="pdStatFloorSelectCount">0</b>条项目
  </div>
  <table style="line-height: 1.8em; text-align: center;">
    <thead>
      <tr>
        <th style="width: 30px;"></th>
        <th style="width: 65px;">楼层号</th>
        <th style="width: 120px;">用户名</th>
        <th style="width: 80px;">神秘等级</th>
        <th style="width: 100px;">
          售价(KFB) <span class="pd_cfg_tips" title="注：售价信息在统计后可能会发生变化，如有必要，建议尽快购买帖子">[?]</span>
        </th>
      </tr>
    </thead>
    <tbody id="pdStatFloorList"></tbody>
  </table>
  <textarea name="statFloorListContent" style="margin-top: 8px; width: 250px; height: 300px;" hidden></textarea>
</div>

<div class="pd_cfg_btns">
  <button name="copyList" type="button" style="color: #00f;" title="复制所有或所选楼层的用户名单">复制名单</button>
  <button name="buyThread" type="button" style="color: #f00;" title="批量购买所选楼层的帖子">购买帖子</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '统计楼层', html);
    let $statFloorFilter = $dialog.find('#pdStatFloorFilter');
    let $statFloorList = $dialog.find('#pdStatFloorList');
    let $statFloorListContent = $dialog.find('[name="statFloorListContent"]');
    let tid = Util.getUrlParam('tid');

    /**
     * 显示统计楼层列表
     */
    const showStatFloorList = function () {
        let list = [...floorList];
        let isRemoveRepeated = $statFloorFilter.find('[name="removeRepeatedEnabled"]').prop('checked'),
            isRemoveTopFloor = $statFloorFilter.find('[name="removeTopFloorEnabled"]').prop('checked');
        if (isRemoveRepeated) {
            list = list.map((data, index, list) => {
                if (!data) return null;else return list.findIndex(data2 => data2 && data2.userName === data.userName) === index ? data : null;
            });
        }
        if (isRemoveTopFloor) {
            let $topFloor = $('.readtext:first');
            if ($topFloor.prev('div').prev('.readlou').prev('a').attr('name') === 'tpc') {
                let topFloorUserName = $topFloor.find('.readidmsbottom, .readidmleft').find('a[href^="profile.php?action=show&uid="]').text();
                list = list.map(data => data && data.userName !== topFloorUserName ? data : null);
            }
        }
        let content = '',
            copyContent = '';
        let num = 0;
        for (let [floor, data] of list.entries()) {
            if (!data) continue;
            content += `
<tr>
  <td>
    <label>
      <input data-status="${data.status}" data-sell="${data.sell ? data.sell : 0}" data-url="${data.buyUrl ? data.buyUrl : ''}"
        type="checkbox" value="${data.userName}">
    </label>
  </td>
  <td><a href="read.php?tid=${tid}&spid=${data.pid}" target="_blank">${floor}楼</a></td>
  <td><a href="profile.php?action=show&username=${data.userName}" target="_blank" style="color: #000;">${data.userName}</a></td>
  <td style="color: #f39;">${data.smLevel}</td>
  <td class="pd_stat">${data.status === 1 ? `<em>${data.sell}</em>` : `<span class="pd_notice">${!data.status ? '无' : '已买'}</span>`}</td>
</tr>`;
            copyContent += data.userName + '\n';
            num++;
        }
        $statFloorList.html(content);
        $statFloorListContent.val(copyContent).data('copy-text', copyContent);
        $dialog.find('#pdStatFloorShowCount').text(num);
        $dialog.find('#pdStatFloorSelectCount').text(0);
    };

    $dialog.find('#pdStatFloorSelectBtns').on('click', '[data-name]', function (e) {
        e.preventDefault();
        let name = $(this).data('name');
        if (name === 'selectAll') Util.selectAll($statFloorList.find('[type="checkbox"]'));else if (name === 'selectInverse') Util.selectInverse($statFloorList.find('[type="checkbox"]'));else if (name === 'selectFilter') {
            let startSell = parseInt($dialog.find('[name="startSell"]').val());
            let endSell = parseInt($dialog.find('[name="endSell"]').val());
            let limitNum = parseInt($dialog.find('[name="limitNum"]').val());
            if (!limitNum || limitNum < 0) limitNum = 0;
            if (!startSell || startSell < 1 || !endSell || endSell < 1) return;
            let userStat = {};
            $statFloorList.find('[type="checkbox"]').each(function () {
                let $this = $(this);
                let status = parseInt($this.data('status'));
                if (!status) return;
                let sell = parseInt($this.data('sell'));
                let userName = $this.val();
                if (!(userName in userStat)) userStat[userName] = 0;
                userStat[userName]++;
                let isChecked = status === 1 && sell >= startSell && sell <= endSell;
                if (isChecked && limitNum > 0) {
                    if (userStat[userName] > limitNum) isChecked = false;
                }
                $this.prop('checked', isChecked);
            });
        }
        $dialog.find('#pdStatFloorSelectCount').text($statFloorList.find('[type="checkbox"]:checked').length);
    }).end().find('[name="copyList"]').click(function () {
        let $this = $(this);
        if ($this.text() === '取消复制') {
            $this.text('复制名单');
            $statFloorListContent.prop('hidden', true);
            $statFloorList.closest('table').prop('hidden', false);
            Dialog.resize(dialogName);
            return;
        }
        let type = 'all';
        let checked = $statFloorList.find('[type="checkbox"]:checked');
        if (checked.length > 0) {
            type = 'select';
            let copyContent = '';
            checked.each(function () {
                copyContent += $(this).val() + '\n';
            });
            $statFloorListContent.val(copyContent).data('copy-text', copyContent);
        }
        if (!Util.copyText($statFloorListContent, (type === 'all' ? '所有' : '所选') + '用户名单已复制')) {
            $this.text('取消复制');
            $statFloorList.closest('table').prop('hidden', true);
            $statFloorListContent.prop('hidden', false).select().focus();
            Dialog.resize(dialogName);
        }
    }).end().find('[name="buyThread"]').click(function () {
        let threadList = [];
        let totalSell = 0;
        if (!$statFloorList.find('[type="checkbox"]:checked').length) $dialog.find('[data-name="selectAll"]').click();
        $statFloorList.find('[type="checkbox"]:checked').each(function () {
            let $this = $(this);
            let url = $this.data('url');
            let sell = parseInt($this.data('sell'));
            if (url && sell > 0) {
                threadList.push({ url, sell });
                totalSell += sell;
            }
        });
        if (!threadList.length) return;
        if (!confirm(`你共选择了 ${threadList.length} 个可购买项，总售价 ${totalSell.toLocaleString()} KFB，` + `均价 ${Util.getFixedNumLocStr(totalSell / threadList.length, 2)} KFB，是否批量购买？`)) return;
        Msg.destroy();
        Msg.wait(`<strong>正在购买帖子中&hellip;</strong><i>剩余：<em class="pd_countdown">${threadList.length}</em></i>` + `<a class="pd_stop_action" href="#">停止操作</a>`);
        buyThreads(threadList);
    });

    if (Util.getCurrentThreadPage() !== 1) $statFloorFilter.find('[name="removeTopFloorEnabled"]').prop('disabled', true).parent('label').attr('title', '请在第1页进行统计');
    $statFloorFilter.on('click', '[type="checkbox"]', showStatFloorList);
    showStatFloorList();
    Dialog.show(dialogName);
    Script.runFunc('Read.showStatFloorDialog_after_');
};

/**
 * 购买帖子
 * @param {{}[]} threadList 购买帖子列表，{url}：购买帖子的URL；{sell}：购买帖子的售价
 */
const buyThreads = exports.buyThreads = function (threadList) {
    let successNum = 0,
        failNum = 0,
        totalSell = 0;
    $(document).clearQueue('BuyThread');
    $.each(threadList, function (index, { url, sell }) {
        $(document).queue('BuyThread', function () {
            $.ajax({
                type: 'GET',
                url: url + '&t=' + $.now(),
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
                    if (isStop) $(document).clearQueue('BuyThread');

                    if (isStop || index === threadList.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) {
                            Log.push('购买帖子', `共有\`${successNum}\`个帖子购买成功`, { pay: { 'KFB': -totalSell } });
                        }
                        console.log(`共有${successNum}个帖子购买成功，共有${failNum}个帖子购买失败，KFB-${totalSell}`);
                        Msg.show(`<strong>共有<em>${successNum}</em>个帖子购买成功${failNum > 0 ? `，共有<em>${failNum}</em>个帖子购买失败` : ''}</strong>` + `<i>KFB<ins>-${totalSell}</ins></i>`, -1);
                        Script.runFunc('Read.buyThreads_after_', threadList);
                    } else {
                        setTimeout(() => $(document).dequeue('BuyThread'), _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('BuyThread');
};

/**
 * 处理购买帖子按钮
 */
const handleBuyThreadBtn = exports.handleBuyThreadBtn = function () {
    $('.readtext input[type="button"][value="愿意购买,支付KFB"]').each(function () {
        let $this = $(this);
        let matches = /此帖售价\s*(\d+)\s*KFB/.exec($this.closest('legend').contents().eq(0).text());
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
            if (sell >= _Const2.default.minBuyThreadWarningSell && !confirm(`此贴售价 ${sell} KFB，是否购买？`)) return;
            if (Config.buyThreadNoJumpEnabled) {
                let $wait = Msg.wait('正在购买帖子&hellip;');
                $.get(url + '&t=' + $.now(), function (html) {
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
        let userName = $readLou.next('div').next('.readtext').find('.readidmsbottom > a, .readidmleft > a').text();
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
    $('.readlou:last').next('div').find('table > tbody > tr > td:last-child').css({ 'text-align': 'right', 'width': '320px' }).append(`<span class="b_tit2" style="margin-left: 5px;"><a style="display: inline-block;" href="#" title="多重回复">回复</a> ` + `<a style="display: inline-block;" href="${replyUrl}&multiquote=1" title="多重引用">引用</a></span>`).find('.b_tit2 > a:eq(0)').click(function (e) {
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
 * 添加用户自定义备注
 */
const addUserMemo = exports.addUserMemo = function () {
    if ($.isEmptyObject(Config.userMemoList)) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        let key = Object.keys(Config.userMemoList).find(name => name === userName);
        if (!key) return;
        let memo = Config.userMemoList[key];
        if ($this.is('.readidmleft > a')) {
            $this.after(`<span class="pd_user_memo_tips" title="备注：${memo}">[?]</span>`);
        } else {
            let memoText = memo;
            let maxLength = 24;
            if (memo.length > maxLength) memoText = memoText.substring(0, maxLength) + '&hellip;';
            $this.after(`<br><span class="pd_user_memo" title="备注：${memo}">(${memoText})</span>`);
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
<textarea wrap="off" class="pd_textarea" style="width: 100%; height: ${height}px; line-height: 1.4em; white-space: pre;">${html}</textarea>
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
        let textArea = $('[name="atc_content"]').get(0);
        if (!textArea) return;
        let code = `[s:${id}]`;
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
            html += `<img src="${_Info2.default.w.imgpath}/post/smile/em/em${smileImageIdList[i]}.gif" alt="[表情]" data-id="${smileCodeIdList[i]}">`;
        }
        html = `<div class="pd_panel" id="pdSmilePanel" style="width: 308px; height: 185px;">${html}</div>`;

        let offset = $parent.offset();
        $panel = $(html).appendTo('body');
        $panel.css('top', offset.top + $parent.height() + 4).css('left', offset.left + $parent.width() - $panel.width() + 9).on('click', 'img', function () {
            let id = $(this).data('id');
            if (id) addSmileCode(id);
        });
        Script.runFunc('Read.addMoreSmileLink_after_click_');
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
            $this.html(html.replace(/\[audio\]((?:http|ftp)[^<>]+?)\[\/audio\](?!<\/fieldset>)/g, '<audio src="$1" controls preload="none" style="margin: 3px 0;">[你的浏览器不支持audio标签]</audio>').replace(/\[video\]((?:http|ftp)[^<>]+?)\[\/video\](?!<\/fieldset>)/g, `<video src="$1" controls preload="none" style="max-width: ${Config.adjustThreadContentWidthEnabled ? 627 : 820}px; margin:3px 0;">` + `[你的浏览器不支持video标签]</video>`));
        }
    });
};

/**
 * 显示在购买框之外的附件图片
 */
const showAttachImageOutsideSellBox = exports.showAttachImageOutsideSellBox = function () {
    if (Util.getCurrentThreadPage() !== 1) return;
    let $area = $('.readtext:first > table > tbody > tr > td');
    if (!$area.find('select[name="buyers"]').length) return;
    let html = $area.html();
    if (/\[attachment=\d+\]/.test(html)) {
        let pid = $area.closest('.readtext').prev('div').prev('.readlou').prev('a').attr('name');
        let tid = Util.getUrlParam('tid');
        $area.html(html.replace(/\[attachment=(\d+)\]/g, `<img src="job.php?action=download&pid=${pid}&tid=${tid}&aid=$1" alt="[附件图片]" style="max-width:550px" ` + `onclick="if(this.width>=550) window.open('job.php?action=download&pid=${pid}&tid=${tid}&aid=$1');">`));
    }
};

/**
 * 获取帖子标题
 * @returns {string} 帖子标题
 */
const getThreadTitle = exports.getThreadTitle = function () {
    return $('form[name="delatc"] > div:first > table > tbody > tr > td > span').text().trim();
};

/**
 * 在帖子页面添加自助评分链接
 */
const addSelfRatingLink = exports.addSelfRatingLink = function () {
    let fid = parseInt($('input[name="fid"]:first').val());
    if (!fid || !_Const2.default.selfRateFidList.includes(fid)) return;
    let tid = parseInt($('input[name="tid"]:first').val());
    let safeId = Public.getSafeId();
    if (!safeId || !tid) return;
    if ($('.readtext:first fieldset legend:contains("本帖最近评分记录")').length > 0) return;
    $('a[href^="kf_tidfavor.php?action=favor"]').parent().append(`<span style="margin: 0 5px;">|</span><a href="kf_fw_1wkfb.php?do=1&safeid=${safeId}&ptid=${tid}">自助评分</a>`);
};

},{"./Const":6,"./Dialog":7,"./Info":9,"./Log":11,"./Msg":15,"./Post":17,"./Public":18,"./Script":20,"./Util":23}],20:[function(require,module,exports){
/* 自定义脚本模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleInstallScriptLink = exports.showDialog = exports.runFunc = exports.addFunc = exports.runCmd = exports.runCustomScript = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Dialog = require('./Dialog');

var Dialog = _interopRequireWildcard(_Dialog);

var _Config = require('./Config');

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Log = require('./Log');

var Log = _interopRequireWildcard(_Log);

var _TmpLog = require('./TmpLog');

var TmpLog = _interopRequireWildcard(_TmpLog);

var _LootLog = require('./LootLog');

var LootLog = _interopRequireWildcard(_LootLog);

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
// 自定义方法列表
const funcList = new Map();

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
 * 添加自定义方法
 * @param {string} name 自定义方法名称
 * @param {function} func 自定义方法
 */
const addFunc = exports.addFunc = function (name, func) {
    if (!funcList.has(name)) funcList.set(name, []);
    funcList.get(name).push(func);
};

/**
 * 执行自定义方法
 * @param {string} name 自定义方法名称
 * @param {*} [data] 自定义方法参数
 */
const runFunc = exports.runFunc = function (name, data) {
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
    <a class="pd_btn_link pd_highlight" href="read.php?tid=500968" target="_blank">自定义脚本收集贴</a>
    <a class="pd_btn_link" data-name="openImOrExCustomScriptDialog" href="#">导入/导出所有脚本</a>
  </span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
  <button class="pd_highlight" name="clear" type="button">清空</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义脚本', html, 'min-width: 776px;');
    let $customScriptList = $dialog.find('[data-name="customScriptList"]');

    $dialog.submit(function (e) {
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
        alert('自定义脚本修改成功（需刷新页面后才可生效）');
    }).end().find('[name="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清空所有脚本？')) {
            $customScriptList.html('');
            Dialog.resize(dialogName);
        }
    });

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
  <input type="checkbox" ${enabled ? 'checked' : ''} title="是否启用此脚本">
  <a class="pd_custom_script_name" href="#" style="margin-left: 5px;">[${name}]</a>
  <span data-name="version" style="margin-left: 5px; color: #666;" ${!version ? 'hidden' : ''}>${version}</span>
  <span data-name="trigger" style="margin-left: 5px; color: ${trigger === 'start' ? '#f00' : '#00f'};" title="脚本执行时机">
    [${trigger === 'start' ? '开始时' : '结束时'}]
  </span>
  <a data-name="homepage" href="${homepage}" target="_blank" style="margin-left: 5px;" ${!homepage ? 'hidden' : ''}>[主页]</a>
  <a data-name="delete" href="#" style="margin-left: 5px; color: #666;">[删除]</a>
</div>
<textarea class="pd_custom_script_content" wrap="off">${content}</textarea>
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
        Dialog.resize(dialogName);
    }).end().find('[data-name="insertSample"]').click(function (e) {
        e.preventDefault();
        let $content = $customScriptList.find('.pd_custom_script_content:visible');
        $content.val(`
// ==UserScript==
// @name        ${defScriptName}
// @version     1.0
// @author      ${_Info2.default.userName}
// @trigger     end
// @homepage    read.php?tid=500968&spid=12318348
// @description 这是一个未命名脚本
// ==/UserScript==
`.trim() + '\n' + $content.val()).focus();
    }).end().find('[data-name="openImOrExCustomScriptDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('自定义脚本', 'customScriptList');
    });

    $customScriptList.on('click', '.pd_custom_script_name', function (e) {
        e.preventDefault();
        $dialog.find('.pd_custom_script_content').hide();
        $(this).parent().next().show().focus();
        Dialog.resize(dialogName);
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        if (!confirm('是否删除此脚本？')) return;
        let $header = $(this).closest('.pd_custom_script_header');
        $header.next().remove();
        $header.remove();
        Dialog.resize(dialogName);
    }).on('change', '.pd_custom_script_content', function () {
        let $this = $(this);
        let { name, version, homepage, trigger } = getScriptMeta($this.val());
        let $header = $this.prev();
        $header.find('.pd_custom_script_name').text(`[${name ? name : defScriptName}]`);
        $header.find('[data-name="version"]').text(version).prop('hidden', !version);
        $header.find('[data-name="homepage"]').attr('href', homepage ? homepage : '').prop('hidden', !homepage);
        $header.find('[data-name="trigger"]').html(`[${trigger === 'start' ? '开始时' : '结束时'}]`).css('color', trigger === 'start' ? '#f00' : '#00f');
    });

    Dialog.show(dialogName);
    if (typeof showIndex === 'number') $customScriptList.find('.pd_custom_script_name').eq(showIndex).click();
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
        if (!confirm(`是否${type === 1 ? '更新' : '安装'}此脚本？`)) return;
        Config.customScriptEnabled = true;
        let script = $.extend(meta, { enabled: true, content });
        if (type === 1) Config.customScriptList[index] = script;else Config.customScriptList.push(script);
        (0, _Config.write)();
        Dialog.close('pdCustomScriptDialog');
        showDialog(index);
    });
};

},{"./Bank":2,"./Card":3,"./Config":4,"./ConfigDialog":5,"./Const":6,"./Dialog":7,"./Index":8,"./Info":9,"./Item":10,"./Log":11,"./Loot":13,"./LootLog":14,"./Msg":15,"./Other":16,"./Post":17,"./Public":18,"./Read":19,"./TmpLog":22,"./Util":23}],21:[function(require,module,exports){
/* 自助评分模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addLinksInGoodPostPage = exports.refreshWaitCheckRatePage = exports.addUnrecognizedSizeWarning = exports.showErrorSizeSubmitWarning = exports.highlightRateErrorSize = exports.checkRateSize = undefined;

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Msg = require('./Msg');

var Msg = _interopRequireWildcard(_Msg);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 检查自助评分文件大小
 * @param {string} title 帖子标题
 * @param {number} ratingSize 评分大小
 * @returns {{}} 检查结果
 */
const checkRateSize = exports.checkRateSize = function (title, ratingSize) {
    let titleSize = 0;
    let matches = title.match(/\b(\d+(?:\.\d+)?)\s?(M|G)B?\b/ig);
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
 * 高亮自助评分错标文件大小
 */
const highlightRateErrorSize = exports.highlightRateErrorSize = function () {
    $('.adp1 a[href^="read.php?tid="]').each(function () {
        let $this = $(this);
        let title = $this.text();
        let ratingSize = 0;
        let $ratingCell = $this.parent('td').next('td');
        let matches = /认定\[(\d+)\]/i.exec($ratingCell.text());
        if (matches) {
            ratingSize = parseInt(matches[1]);
        }

        let { type, titleSize } = checkRateSize(title, ratingSize);
        if (type === -1) {
            $ratingCell.css('color', '#ff9933').attr('title', '标题文件大小无法解析').addClass('pd_custom_tips');
        } else if (type === 1) {
            $ratingCell.addClass('pd_highlight pd_custom_tips').attr('title', `标题文件大小(${titleSize.toLocaleString()}M)与认定文件大小(${ratingSize.toLocaleString()}M)不一致`);
        }
    });
};

/**
 * 在提交自助评分时显示错标文件大小警告
 */
const showErrorSizeSubmitWarning = exports.showErrorSizeSubmitWarning = function () {
    $('form[name="mail1"]').submit(function () {
        let ratingSize = parseFloat($('[name="psize"]').val());
        if (isNaN(ratingSize) || ratingSize <= 0) return;
        if (parseInt($('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
        let title = $('.adp1 a[href^="read.php?tid="]').text();
        let { type, titleSize } = checkRateSize(title, ratingSize);
        if (type === 1) {
            return confirm(`标题文件大小(${titleSize.toLocaleString()}M)与认定文件大小(${ratingSize.toLocaleString()}M)不一致，是否继续？`);
        }
    });
};

/**
 * 在自助评分页面添加无法识别标题文件大小的警告
 */
const addUnrecognizedSizeWarning = exports.addUnrecognizedSizeWarning = function () {
    let $title = $('.adp1 a[href^="read.php?tid="]');
    let title = $title.text();
    let { type } = checkRateSize(title, 1);
    if (type === -1) {
        $title.after('<span style="margin-left: 5px; color: #ff9933;">(标题文件大小无法解析)</span>');
    }
};

/**
 * 当检测到待检查的评分记录含有负数倒计时的情况下，自动刷新页面
 */
const refreshWaitCheckRatePage = exports.refreshWaitCheckRatePage = function () {
    if (!/剩余-\d+分钟/.test($('.adp1:eq(1) > tbody > tr:last-child > td:first-child').text())) return;

    /**
     * 刷新
     */
    const refresh = function () {
        console.log('自动刷新Start');
        $.ajax({
            type: 'GET',
            url: 'kf_fw_1wkfb.php?ping=2&t=' + $.now(),
            timeout: 10000
        }).done(function (html) {
            if (/剩余-\d+分钟/.test(html)) setTimeout(refresh, _Const2.default.defAjaxInterval);
        }).fail(() => setTimeout(refresh, _Const2.default.defAjaxInterval));
    };

    refresh();
};

/**
 * 在优秀帖相关页面上添加链接
 */
const addLinksInGoodPostPage = exports.addLinksInGoodPostPage = function () {
    if (/\/kf_fw_1wkfb\.php\?ping=5/.test(location.href)) {
        $('.adp1:last > tbody > tr:gt(0) > td:last-child').each(function () {
            let $this = $(this);
            let uid = parseInt($this.text());
            $this.wrapInner(`<a class="${uid === _Info2.default.uid ? 'pd_highlight' : ''}" href="profile.php?action=show&uid=${uid}" target="_blank"></a>`);
        });
    } else if (/\/kf_fw_1wkfb\.php\?ping=6/.test(location.href)) {
        $('.adp1:last > tbody > tr:gt(1) > td:nth-child(3)').each(function () {
            let $this = $(this);
            let userName = $this.text().trim();
            if (userName === '0') return;
            $this.wrapInner(`<a class="${userName === _Info2.default.userName ? 'pd_highlight' : ''}" href="profile.php?action=show&username=${userName}" target="_blank"></a>`);
        });
        $('.adp1:last > tbody > tr:gt(1) > td:last-child').each(function () {
            let $this = $(this);
            let matches = /\[(\d+)]板块/.exec($this.text());
            if (matches) $this.wrapInner(`<a href="thread.php?fid=${matches[1]}" target="_blank"></a>`);
        });
    }
};

},{"./Const":6,"./Info":9,"./Msg":15}],22:[function(require,module,exports){
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

var _Util = require('./Util');

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 保存临时日志的键值名称
const name = _Const2.default.storagePrefix + 'tmp_log';

/**
 * 读取临时日志
 * @returns {{}} 临时日志对象
 */
const read = exports.read = function () {
    let log = {};
    let options = Util.readData(name + '_' + _Info2.default.uid);
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
 * @param {{}} log 临时日志对象
 */
const write = exports.write = log => Util.writeData(name + '_' + _Info2.default.uid, JSON.stringify(log));

/**
 * 清除临时日志
 */
const clear = exports.clear = () => Util.deleteData(name + '_' + _Info2.default.uid);

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

},{"./Const":6,"./Info":9,"./Util":23}],23:[function(require,module,exports){
/* 工具模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteData = exports.writeData = exports.readData = exports.selectInverse = exports.selectAll = exports.inFollowOrBlockUserList = exports.entries = exports.getResponseMsg = exports.copyText = exports.getSelText = exports.addCode = exports.getStrByteLen = exports.removeUnpairedBBCodeContent = exports.getFixedNumLocStr = exports.getCurrentThreadPage = exports.compareSmLevel = exports.isEdge = exports.isIE = exports.isOpera = exports.getStatFormatNumber = exports.getSortedObjectKeyList = exports.getObjectKeyList = exports.removeHtmlTag = exports.htmlDecode = exports.htmlEncode = exports.getGBKEncodeString = exports.getUrlParam = exports.deepEqual = exports.getDifferenceSetOfObject = exports.getHostNameUrl = exports.isBetweenInTimeRange = exports.getTimeDiffInfo = exports.getTimeString = exports.getDateString = exports.getDate = exports.getMidnightHourDate = exports.getTimezoneDateByTime = exports.getDateByTime = exports.deleteCookie = exports.getCookie = exports.setCookie = undefined;

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
    document.cookie = `${prefix}${name}=${encodeURI(value)}${!date ? '' : ';expires=' + date.toUTCString()};path=/;`;
};

/**
 * 获取Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 * @returns {?string} Cookie值
 */
const getCookie = exports.getCookie = function (name, prefix = _Info2.default.uid + '_' + _Const2.default.storagePrefix) {
    let regex = new RegExp(`(^| )${prefix}${name}=([^;]*)(;|$)`);
    let matches = document.cookie.match(regex);
    if (!matches) return null;else return decodeURI(matches[2]);
};

/**
 * 删除Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 */
const deleteCookie = exports.deleteCookie = function (name, prefix = _Info2.default.uid + '_' + _Const2.default.storagePrefix) {
    document.cookie = `${prefix}${name}=;expires=${getDate('-1d').toUTCString()};path=/;`;
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
    let diff = timestamp - $.now();
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
    return `${location.protocol}//${location.host}/`;
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
    let img = document.createElement('img');
    img.src = 'nothing?sp=' + str;
    document.body.appendChild(img);
    let encodeStr = img.src.split('nothing?sp=').pop();
    document.body.removeChild(img);
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
 * 去除HTML标签
 * @param html HTML代码
 * @returns {string} 去除HTML标签的文本
 */
const removeHtmlTag = exports.removeHtmlTag = html => html ? html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '') : '';

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
        list.sort((a, b) => sortBy > 0 ? a > b ? 1 : -1 : a < b ? 1 : -1);
    }
    return list;
};

/**
 * 获取经过排序的指定对象的关键字列表
 * @param {string[]} sortKeyList 用于排序的关键字列表
 * @param {Object} obj 指定对象
 * @returns {string[]} 关键字列表
 */
const getSortedObjectKeyList = exports.getSortedObjectKeyList = function (sortKeyList, obj) {
    let list = getObjectKeyList(obj);
    list.sort((a, b) => sortKeyList.indexOf(a) > sortKeyList.indexOf(b) ? 1 : -1);
    return list;
};

/**
 * 获取经过格式化的统计数字字符串
 * @param {number} num 待处理的数字
 * @returns {string} 经过格式化的数字字符串
 */
const getStatFormatNumber = exports.getStatFormatNumber = num => num >= 0 ? `<em>+${num.toLocaleString()}</em>` : `<ins>${num.toLocaleString()}</ins>`;

/**
 * 检测浏览器是否为Opera
 * @returns {boolean} 是否为Opera
 */
const isOpera = exports.isOpera = () => typeof _Info2.default.w.opera !== 'undefined';

/**
 * 检测浏览器是否为IE
 * @returns {boolean} 是否为IE
 */
const isIE = exports.isIE = () => typeof navigator.msMaxTouchPoints !== 'undefined';

/**
 * 检测浏览器是否为Edge
 * @returns {boolean} 是否为Edge
 */
const isEdge = exports.isEdge = () => navigator.appVersion && navigator.appVersion.includes('Edge');

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
        $target = $(`<span class="pd_hide">${copyText.replace(/\n/g, '<br>')}</span>`).insertAfter($target);
    }
    if ($excludeElem) $excludeElem.prop('hidden', true);
    let result = null;
    if ($target.is('input, textarea')) {
        $target.select();
        result = document.execCommand('copy');
    } else {
        let s = window.getSelection();
        s.selectAllChildren($target.get(0));
        result = document.execCommand('copy');
        s.removeAllRanges();
    }
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
 * @returns {{type: number, msg: string, url: string}} type：消息类型（0：未能获得预期的回应；1：成功消息；-1：错误消息）；msg：消息内容
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

/**
 * 读取数据
 * @param {string} key 关键字
 * @param {string} storageType 存储类型
 */
const readData = exports.readData = (key, storageType = _Info2.default.storageType) => {
    return storageType === 'ByUid' || storageType === 'Global' ? GM_getValue(key) : localStorage.getItem(key);
};

/**
 * 写入数据
 * @param {string} key 关键字
 * @param {string} value 值
 * @param {string} storageType 存储类型
 */
const writeData = exports.writeData = (key, value, storageType = _Info2.default.storageType) => {
    try {
        if (storageType === 'ByUid' || storageType === 'Global') GM_setValue(key, value);else localStorage.setItem(key, value);
    } catch (ex) {
        console.log(ex);
        alert('写入数据失败，可能是浏览器不支持所设定的存储类型或localStorage超出限额');
    }
};

/**
 * 删除数据
 * @param {string} key 关键字
 * @param {string} storageType 存储类型
 */
const deleteData = exports.deleteData = (key, storageType = _Info2.default.storageType) => {
    if (storageType === 'ByUid' || storageType === 'Global') GM_deleteValue(key);else localStorage.removeItem(key);
};

},{"./Const":6,"./Info":9}]},{},[1]);

// ==UserScript==
// @name        KF Online助手
// @namespace   https://greasyfork.org/users/4514
// @icon        https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KFOL必备！为绯月Galgame论坛增加了大量人性化、自动化的功能，更多功能开发中……
// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es5/Common.meta.js
// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/es5/Common.user.js
// @require     https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/lib/polyfill.min.js?V6.20.0
// @include     http://*2dkf.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     9.4
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

var _ConfigDialog = require('./module/ConfigDialog');

var ConfigDialog = _interopRequireWildcard(_ConfigDialog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 版本号
var version = '9.4';

/**
 * 导出模块
 */
var exportModule = function exportModule() {
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
        _Info2.default.w.Script = require('./module/Script');
        var Conf = require('./module/Config');
        _Info2.default.w.readConfig = Conf.read;
        _Info2.default.w.writeConfig = Conf.write;
    } catch (ex) {
        console.log(ex);
    }
};

/**
 * 初始化
 */
var init = function init() {
    var startDate = new Date();
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
    if (Config.modifySideBarEnabled) Public.modifySideBar();
    if (Config.addSideBarFastNavEnabled) Public.addFastNavForSideBar();
    if (_Info2.default.isInHomePage) {
        Index.handleIndexPersonalInfo();
        Index.handleAtTips();
        Index.addSearchTypeSelectBox();
        if (Config.smLevelUpAlertEnabled) Index.smLevelUpAlert();
        if (Config.smRankChangeAlertEnabled) Index.smRankChangeAlert();
        if (Config.showVipSurplusTimeEnabled) Index.showVipSurplusTime();
        if (Config.homePageThreadFastGotoLinkEnabled) Index.addThreadFastGotoLink();
        if (Config.fixedDepositDueAlertEnabled && !Util.getCookie(_Const2.default.fixedDepositDueAlertCookieName)) Bank.fixedDepositDueAlert();
        if (Config.autoLootEnabled && parseInt(Util.getCookie(_Const2.default.lootCompleteCookieName)) === 2) $('a.indbox5[href="kf_fw_ig_index.php"]').removeClass('indbox5').addClass('indbox6');
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
        if ($('a[href$="#install-script"]').length > 0) Script.handleInstallScriptLink();
        if (Config.preventCloseWindowWhenEditPostEnabled) Post.preventCloseWindowWhenEditPost();
        if (Config.autoSavePostContentWhenSubmitEnabled) Post.savePostContentWhenSubmit();
    } else if (location.pathname === '/thread.php') {
        if (Config.highlightNewPostEnabled) Other.highlightNewPost();
        if (Config.showFastGotoThreadPageEnabled) Other.addFastGotoThreadPageLink();
    } else if (location.pathname === '/post.php') {
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
    } else if (/\/kf_fw_ig_my\.php$/.test(location.href)) {
        Item.enhanceMyItemsPage();
        Item.addBatchUseAndConvertOldItemTypesButton();
    } else if (location.pathname === '/kf_fw_ig_mybp.php') {
        Item.addBatchUseItemsButton();
        Item.hideItemTypes();
    } else if (location.pathname === '/kf_fw_ig_shop.php') {
        Item.addBatchBuyItemsLink();
    } else if (location.pathname === '/kf_fw_ig_index.php') {
        Loot.enhanceLootIndexPage();
    } else if (location.pathname === '/kf_fw_ig_pklist.php') {
        Loot.addUserLinkInPkListPage();
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
    }
    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (_Info2.default.isMobile) Public.bindElementTitleClick();
    if (_Info2.default.isInMiaolaDomain) {
        if (Config.kfSmileEnhanceExtensionEnabled && ['/read.php', '/post.php', '/message.php'].includes(location.pathname)) {
            Post.importKfSmileEnhanceExtension();
        }
        $('a[href^="login.php?action=quit"]:first').before('<a href="https://m.miaola.info/" target="_blank">移动版</a><span> | </span>');
    }

    var isAutoLootStarted = false;
    if (Config.autoLootEnabled && location.pathname !== '/kf_fw_ig_index.php' && !Util.getCookie(_Const2.default.lootCompleteCookieName) && !Util.getCookie(_Const2.default.lootAttackingCookieName)) {
        isAutoLootStarted = true;
        Loot.checkLoot();
    }

    if (Config.autoGetDailyBonusEnabled && !Util.getCookie(_Const2.default.getDailyBonusCookieName) && !isAutoLootStarted) Public.getDailyBonus();

    var autoSaveCurrentDepositAvailable = Config.autoSaveCurrentDepositEnabled && _Info2.default.isInHomePage;
    var isDonationStarted = false;
    /*if (Config.autoDonationEnabled && !Util.getCookie(Const.donationCookieName)) {
     isDonationStarted = true;
     Public.donation(autoSaveCurrentDepositAvailable);
     }*/

    if (autoSaveCurrentDepositAvailable && !isDonationStarted) Public.autoSaveCurrentDeposit();

    if (Config.autoChangeIdColorEnabled && !Util.getCookie(_Const2.default.autoChangeIdColorCookieName)) Public.changeIdColor();

    if (Config.timingModeEnabled && (_Info2.default.isInHomePage || location.pathname === '/kf_fw_ig_index.php')) Public.startTimingMode();

    if (Config.customScriptEnabled) Script.runCustomScript('end');

    var endDate = new Date();
    console.log('\u3010KF Online\u52A9\u624B\u3011\u52A0\u8F7D\u5B8C\u6BD5\uFF0C\u52A0\u8F7D\u8017\u65F6\uFF1A' + (endDate - startDate) + 'ms');
};

if (typeof jQuery !== 'undefined') $(document).ready(init);

},{"./module/Bank":2,"./module/Card":3,"./module/Config":4,"./module/ConfigDialog":5,"./module/Const":6,"./module/Dialog":7,"./module/Index":8,"./module/Info":9,"./module/Item":10,"./module/Log":11,"./module/Loot":13,"./module/LootLog":14,"./module/Msg":15,"./module/Other":16,"./module/Post":17,"./module/Public":18,"./module/Read":19,"./module/Script":20,"./module/TmpLog":21,"./module/Util":22}],2:[function(require,module,exports){
/* 银行模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fixedDepositDueAlert = exports.drawCurrentDeposit = exports.handleBankPage = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var minTransferMoney = 20;

/**
 * 对银行页面元素进行处理
 */
var handleBankPage = exports.handleBankPage = function handleBankPage() {
    var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
    if (!$account.length) return;
    var html = $account.html();
    $account.html(html.replace(/当前所持：(-?\d+)KFB/, function (m, kfb) {
        return '\u5F53\u524D\u6240\u6301\uFF1A<b id="pdCash" data-num="' + kfb + '">' + parseInt(kfb).toLocaleString() + '</b> KFB';
    }).replace(/活期存款：(-?\d+)KFB/, function (m, kfb) {
        return '\u6D3B\u671F\u5B58\u6B3E\uFF1A<b id="pdCurrentDeposit" data-num="' + kfb + '">' + parseInt(kfb).toLocaleString() + '</b> KFB';
    }).replace(/定期存款：(-?\d+)KFB/, function (m, kfb) {
        return '\u5B9A\u671F\u5B58\u6B3E\uFF1A<b id="pdFixedDeposit" data-num="' + kfb + '">' + parseInt(kfb).toLocaleString() + '</b> KFB';
    }).replace(/可获利息：(-?\d+)/, function (m, kfb) {
        return '\u53EF\u83B7\u5229\u606F\uFF1A<b id="pdInterest" data-num="' + kfb + '">' + parseInt(kfb).toLocaleString() + '</b> KFB ';
    }).replace(/定期利息：([\d\.]+)%/, '定期利息：<b id="pdInterestRate" data-num="$1">$1</b>%').replace(/(，才可以获得利息）)/, '$1 <span id="pdExpireTime" style="color: #393;"></span>').replace(/(，取出定期将获得该数额的KFB利息\))/, '$1 <span id="pdExpectedInterest" style="color: #393;"></span>'));
    $account.find('[data-num]').css('color', '#f60');

    var $interest = $('#pdInterest');
    var interest = parseInt($interest.data('num'));
    if (interest > 0) $interest.css('color', '#393');

    var fixedDeposit = parseInt($('#pdFixedDeposit').data('num'));
    if (fixedDeposit > 0 && interest === 0) {
        var time = parseInt(TmpLog.getValue(_Const2.default.fixedDepositDueTmpLogName));
        if (!isNaN(time) && time > new Date().getTime()) {
            $('#pdExpireTime').text('(\u5230\u671F\u65F6\u95F4\uFF1A' + Util.getDateString(new Date(time)) + ' ' + Util.getTimeString(new Date(time), ':', false) + ')');
        }

        var interestRate = parseFloat($('#pdInterestRate').data('num')) / 100;
        var anticipatedInterest = Math.round(fixedDeposit * interestRate * _Const2.default.fixedDepositDueTime);
        $('#pdExpectedInterest').text('(\u9884\u671F\u5229\u606F\uFF1A' + anticipatedInterest.toLocaleString() + ' KFB)');
    }

    $('form[name="form1"], form[name="form2"]').submit(function () {
        var $this = $(this);
        var money = 0;
        if ($this.is('[name="form2"]')) money = parseInt($this.find('input[name="drawmoney"]').val());else money = parseInt($this.find('input[name="savemoney"]').val());
        if (parseInt($this.find('input[name="btype"]:checked').val()) === 2 && money > 0) {
            TmpLog.setValue(_Const2.default.fixedDepositDueTmpLogName, Util.getDate('+' + _Const2.default.fixedDepositDueTime + 'd').getTime());
        }
    });

    $('form[name="form3"]').submit(function () {
        var currentDeposit = parseInt($('#pdCurrentDeposit').data('num'));
        var fixedDeposit = parseInt($('#pdFixedDeposit').data('num'));
        var money = parseInt($('[name="to_money"]').val());
        if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
            if (!confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                $(this).find('[type="submit"]').prop('disabled', false);
                return false;
            }
        }
    });

    var $fee = $('a[href="hack.php?H_name=bank&action=log"]').parent();
    $fee.html($fee.html().replace(/\(手续费(\d+)%\)/, '(手续费<span id="pdFee" data-num="$1">$1</span>%)'));

    var $transferLimit = $('form[name="form3"] > span:first');
    $transferLimit.html($transferLimit.html().replace(/可转账额度：(\d+)/, function (m, num) {
        return '\u53EF\u8F6C\u8D26\u989D\u5EA6\uFF1A<b id="pdTransferLimit" data-num="' + num + '">' + parseInt(num).toLocaleString() + '</b>';
    }));
    addBatchTransferButton();
};

/**
 * 给活期帐户存款
 * @param {number} money 存款金额（KFB）
 * @param {number} cash 现金（KFB）
 * @param {number} currentDeposit 现有活期存款（KFB）
 */
var saveCurrentDeposit = function saveCurrentDeposit(money, cash, currentDeposit) {
    var $wait = Msg.wait('<strong>正在存款中&hellip;</strong>');
    $.post('hack.php?H_name=bank', { action: 'save', btype: 1, savemoney: money }, function (html) {
        Public.showFormatLog('存款', html);

        var _Util$getResponseMsg = Util.getResponseMsg(html),
            msg = _Util$getResponseMsg.msg;

        if (/完成存款/.test(msg)) {
            Msg.remove($wait);
            console.log('\u5171\u6709' + money + 'KFB\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E');
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
var drawCurrentDeposit = exports.drawCurrentDeposit = function drawCurrentDeposit(money) {
    var $wait = Msg.wait('<strong>正在取款中&hellip;</strong>');
    $.post('hack.php?H_name=bank', { action: 'draw', btype: 1, drawmoney: money }, function (html) {
        Public.showFormatLog('取款', html);

        var _Util$getResponseMsg2 = Util.getResponseMsg(html),
            msg = _Util$getResponseMsg2.msg;

        Msg.remove($wait);
        if (/完成取款/.test(msg)) {
            console.log('\u4ECE\u6D3B\u671F\u5B58\u6B3E\u4E2D\u53D6\u51FA\u4E86' + money + 'KFB');
            Msg.show('<strong>\u4ECE\u6D3B\u671F\u5B58\u6B3E\u4E2D\u53D6\u51FA\u4E86<em>' + money.toLocaleString() + '</em>KFB</strong>', -1);
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
var batchTransfer = function batchTransfer(users, msg, isDeposited, currentDeposit, transferLimit) {
    var successNum = 0,
        failNum = 0,
        successMoney = 0;
    $.each(users, function (index, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            userName = _ref2[0],
            money = _ref2[1];

        $(document).queue('Bank', function () {
            $.ajax({
                type: 'POST',
                url: 'hack.php?H_name=bank',
                timeout: _Const2.default.defAjaxTimeout,
                data: '&action=virement&pwuser=' + Util.getGBKEncodeString(userName) + '&to_money=' + money + '&memo=' + Util.getGBKEncodeString(msg),
                success: function success(html) {
                    Public.showFormatLog('批量转账', html);

                    var _Util$getResponseMsg3 = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg3.msg;

                    var msgHtml = userName + ' <em>+' + money.toLocaleString() + '</em>';
                    if (/完成转帐!/.test(msg)) {
                        successNum++;
                        successMoney += money;
                    } else {
                        failNum++;
                        if (/用户<b>.+?<\/b>不存在/.test(msg)) msg = '用户不存在';
                        msgHtml += ' <span class="pd_notice">(\u9519\u8BEF\uFF1A' + msg + ')</span>';
                    }
                    $('.pd_result:last').append('<li>' + msgHtml + '</li>');
                },
                error: function error() {
                    failNum++;
                    $('.pd_result:last').append('\n<li>\n  ' + userName + ':' + money.toLocaleString() + '\n  <span class="pd_notice">(\u9519\u8BEF\uFF1A\u8FDE\u63A5\u8D85\u65F6\uFF0C\u8F6C\u8D26\u53EF\u80FD\u5931\u8D25\uFF0C\u8BF7\u5230<a target="_blank" href="hack.php?H_name=bank&action=log">\u94F6\u884C\u65E5\u5FD7</a>\u91CC\u8FDB\u884C\u786E\u8BA4)</span>\n</li>\n');
                },
                complete: function complete() {
                    var $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    var isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('Bank');

                    if (isStop || index === users.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) Log.push('批量转账', '\u5171\u6709`' + successNum + '`\u540D\u7528\u6237\u8F6C\u8D26\u6210\u529F', { pay: { 'KFB': -successMoney } });
                        $('#pdCurrentDeposit').text((currentDeposit - successMoney).toLocaleString()).data('num', currentDeposit - successMoney);
                        $('#pdTransferLimit').text((transferLimit - successMoney).toLocaleString()).data('num', transferLimit - successMoney);
                        console.log('\u5171\u6709' + successNum + '\u540D\u7528\u6237\u8F6C\u8D26\u6210\u529F\uFF0C\u5171\u6709' + failNum + '\u540D\u7528\u6237\u8F6C\u8D26\u5931\u8D25\uFF0CKFB-' + successMoney);
                        $('.pd_result:last').append('<li><b>\u5171\u6709<em>' + successNum + '</em>\u540D\u7528\u6237\u8F6C\u8D26\u6210\u529F' + ((failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u540D\u7528\u6237\u8F6C\u8D26\u5931\u8D25' : '') + '\uFF1A</b>KFB <ins>-' + successMoney.toLocaleString() + '</ins></li>'));
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u540D\u7528\u6237\u8F6C\u8D26\u6210\u529F' + ((failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u540D\u7528\u6237\u8F6C\u8D26\u5931\u8D25' : '') + '</strong><i>KFB<ins>-' + successMoney.toLocaleString() + '</ins></i>'), -1);
                    } else {
                        setTimeout(function () {
                            return $(document).dequeue('Bank');
                        }, _Const2.default.bankActionInterval);
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
var batchTransferVerify = function batchTransferVerify($transfer) {
    var $bankUsers = $transfer.find('[name="users"]');
    var users = $bankUsers.val();
    if (!/^\s*\S+\s*$/m.test(users) || /^\s*:/m.test(users) || /:/.test(users) && /:(\D|$)/m.test(users)) {
        alert('用户列表格式不正确');
        $bankUsers.select().focus();
        return false;
    }
    if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
        alert('\u8F6C\u5E10\u91D1\u989D\u4E0D\u80FD\u5C0F\u4E8E' + minTransferMoney + 'KFB');
        $bankUsers.select().focus();
        return false;
    }
    var $bankMoney = $transfer.find('[name="money"]');
    var money = parseInt($bankMoney.val());
    if (/^\s*[^:]+\s*$/m.test(users)) {
        if (!$.isNumeric(money)) {
            alert('通用转账金额格式不正确');
            $bankMoney.select().focus();
            return false;
        } else if (money < minTransferMoney) {
            alert('\u8F6C\u5E10\u91D1\u989D\u4E0D\u80FD\u5C0F\u4E8E' + minTransferMoney + 'KFB');
            $bankMoney.select().focus();
            return false;
        }
    }
    return true;
};

/**
 * 添加批量转账的按钮
 */
var addBatchTransferButton = function addBatchTransferButton() {
    var $area = $('\n<tr id="pdBankTransferArea">\n  <td style="vertical-align: top;">\n    \u4F7F\u7528\u8BF4\u660E\uFF1A<br>\u6BCF\u884C\u4E00\u540D\u7528\u6237\uFF0C<br>\u5982\u9700\u5355\u72EC\u8BBE\u5B9A\u91D1\u989D\uFF0C<br>\u53EF\u5199\u4E3A\u201C\u7528\u6237\u540D:\u91D1\u989D\u201D<br>\uFF08\u6CE8\u610F\u662F<b>\u82F1\u6587\u5192\u53F7</b>\uFF09<br>\u4F8B\u5B50\uFF1A<br>\n    <pre style="border: 1px solid #9999ff; padding: 5px;">\u5F20\u4E09\n\u674E\u56DB:200\n\u738B\u4E94:500\n\u4FE1\u4EF0\u98CE</pre>\n  </td>\n  <td>\n  <form>\n    <div style="display: inline-block;">\n      <label>\u7528\u6237\u5217\u8868\uFF1A<br>\n        <textarea class="pd_textarea" name="users" style="width: 270px; height: 250px;"></textarea>\n      </label>\n    </div>\n    <div style="display: inline-block; margin-left: 10px;">\n      <label>\u901A\u7528\u8F6C\u5E10\u91D1\u989D\uFF08\u5982\u6240\u6709\u7528\u6237\u90FD\u5DF2\u8BBE\u5B9A\u5355\u72EC\u91D1\u989D\u5219\u53EF\u7559\u7A7A\uFF09\uFF1A<br>\n        <input class="pd_input" name="money" type="number" min="20" style="width: 217px;">\n      </label><br>\n      <label style="margin-top: 5px;">\u8F6C\u5E10\u9644\u8A00\uFF08\u53EF\u7559\u7A7A\uFF09\uFF1A<br>\n        <textarea class="pd_textarea" name="msg" style="width: 225px; height: 206px;"></textarea>\n      </label>\n    </div>\n    <div>\n      <button type="submit">\u6279\u91CF\u8F6C\u8D26</button>\n      <button type="reset">\u91CD\u7F6E</button>\n      <button name="random" type="button" title="\u4E3A\u7528\u6237\u5217\u8868\u4E0A\u7684\u6BCF\u4E2A\u7528\u6237\u8BBE\u5B9A\u6307\u5B9A\u8303\u56F4\u5185\u7684\u968F\u673A\u91D1\u989D">\u968F\u673A\u91D1\u989D</button>\n      \uFF08\u6D3B\u671F\u5B58\u6B3E\u4E0D\u8DB3\u65F6\uFF0C\u5C06\u81EA\u52A8\u8FDB\u884C\u5B58\u6B3E\uFF1B\u6279\u91CF\u8F6C\u8D26\u91D1\u989D\u4E0D\u4F1A\u4ECE\u5B9A\u671F\u5B58\u6B3E\u4E2D\u6263\u9664\uFF09\n    </div>\n  </form>\n  </td>\n</tr>\n').appendTo('.bank1 > tbody');

    $area.find('form').submit(function (e) {
        e.preventDefault();
        Msg.destroy();
        if (!batchTransferVerify($area)) return;
        var commonMoney = parseInt($area.find('[name="money"]').val());
        if (!commonMoney) commonMoney = 0;
        var msg = $area.find('[name="msg"]').val();
        var users = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = $area.find('[name="users"]').val().split('\n')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var line = _step.value;

                line = $.trim(line);
                if (!line) continue;
                if (line.includes(':')) {
                    var _line$split = line.split(':'),
                        _line$split2 = _slicedToArray(_line$split, 2),
                        userName = _line$split2[0],
                        money = _line$split2[1];

                    if (typeof money === 'undefined') continue;
                    users.push([$.trim(userName), parseInt(money)]);
                } else {
                    users.push([line, commonMoney]);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (!users.length) return;

        var fee = parseInt($('#pdFee').data('num'));
        if (isNaN(fee)) fee = 0;
        var totalMoney = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = users[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    _money = _step2$value[1];

                totalMoney += _money;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        totalMoney = Math.floor(totalMoney * (1 + fee));
        if (!confirm('\u5171\u8BA1 ' + users.length + ' \u540D\u7528\u6237\uFF0C\u603B\u989D ' + totalMoney.toLocaleString() + ' KFB\uFF0C\u662F\u5426\u8F6C\u8D26\uFF1F')) return;

        var $wait = Msg.wait('<strong>正在获取银行账户信息中&hellip;</strong>');
        $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
            Msg.remove($wait);
            var cash = 0,
                currentDeposit = 0,
                transferLimit = 0;
            var matches = /当前所持：(-?\d+)KFB/.exec(html);
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
            var isDeposited = false;
            var difference = totalMoney - currentDeposit;
            if (difference > 0) {
                isDeposited = true;
                $(document).queue('Bank', function () {
                    saveCurrentDeposit(difference, cash, currentDeposit);
                    cash -= difference;
                    currentDeposit += difference;
                });
                $(document).dequeue('Bank');
            }
            Msg.wait('<strong>\u6B63\u5728\u6279\u91CF\u8F6C\u8D26\u4E2D\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + users.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
            $area.find('> td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
            batchTransfer(users, msg, isDeposited, currentDeposit, transferLimit);
        });
    }).find('[name="random"]').click(function () {
        var userList = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = $area.find('[name="users"]').val().split('\n')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var line = _step3.value;

                line = $.trim(line);
                if (!line) continue;
                userList.push($.trim(line.split(':')[0]));
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        if (!userList.length) return;

        var range = prompt('设定随机金额的范围（注：最低转账金额为20KFB）', '20-100');
        if (range === null) return;
        range = $.trim(range);
        if (!/^\d+-\d+$/.test(range)) {
            alert('随机金额范围格式不正确');
            return;
        }
        var arr = range.split('-');
        var min = parseInt(arr[0]),
            max = parseInt(arr[1]);
        if (max < min) {
            alert('最大值不能低于最小值');
            return;
        }

        var content = '';
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = userList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var userName = _step4.value;

                content += userName + ':' + Math.floor(Math.random() * (max - min + 1) + min) + '\n';
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        $area.find('[name="users"]').val(content);
    });
};

/**
 * 定期存款到期提醒
 */
var fixedDepositDueAlert = exports.fixedDepositDueAlert = function fixedDepositDueAlert() {
    console.log('定期存款到期提醒Start');
    $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
        Util.setCookie(_Const2.default.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(1));
        var matches = /可获利息：(\d+)/.exec(html);
        if (!matches) return;
        var interest = parseInt(matches[1]);
        if (interest > 0) {
            Util.setCookie(_Const2.default.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(7));
            if (confirm('\u60A8\u7684\u5B9A\u671F\u5B58\u6B3E\u5DF2\u5230\u671F\uFF0C\u5171\u4EA7\u751F\u5229\u606F ' + interest.toLocaleString() + ' KFB\uFF0C\u662F\u5426\u524D\u5F80\u94F6\u884C\u53D6\u6B3E\uFF1F')) {
                location.href = 'hack.php?H_name=bank';
            }
        }
    });
};

},{"./Const":6,"./Log":11,"./Msg":15,"./Public":18,"./TmpLog":21,"./Util":22}],3:[function(require,module,exports){
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
var convertCardsToVipTime = function convertCardsToVipTime(cardList, safeId) {
    var successNum = 0,
        failNum = 0,
        totalVipTime = 0,
        totalEnergy = 0;
    $(document).clearQueue('ConvertCardsToVipTime');
    $.each(cardList, function (index, cardId) {
        $(document).queue('ConvertCardsToVipTime', function () {
            $.ajax({
                type: 'GET',
                url: 'kf_fw_card_doit.php?do=recard&id=' + cardId + '&safeid=' + safeId + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success: function success(html) {
                    Public.showFormatLog('将卡片转换为VIP时间', html);

                    var _Util$getResponseMsg = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg.msg;

                    var matches = /增加(\d+)小时VIP时间(?:.*?获得(\d+)点恢复能量)?/.exec(msg);
                    if (matches) {
                        successNum++;
                        totalVipTime += parseInt(matches[1]);
                        if (typeof matches[2] !== 'undefined') totalEnergy += parseInt(matches[2]);
                    } else failNum++;
                },
                error: function error() {
                    failNum++;
                },
                complete: function complete() {
                    var $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    var isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('ConvertCardsToVipTime');

                    if (isStop || index === cardList.length - 1) {
                        if (successNum > 0) {
                            Log.push('将卡片转换为VIP时间', '\u5171\u6709`' + successNum + '`\u5F20\u5361\u7247\u6210\u529F\u4E3AVIP\u65F6\u95F4', {
                                gain: { 'VIP小时': totalVipTime, '能量': totalEnergy },
                                pay: { '卡片': -successNum }
                            });
                        }
                        Msg.destroy();
                        console.log('\u5171\u6709' + successNum + '\u5F20\u5361\u7247\u8F6C\u6362\u6210\u529F\uFF0C\u5171\u6709' + failNum + '\u5F20\u5361\u7247\u8F6C\u6362\u5931\u8D25\uFF0CVIP\u5C0F\u65F6+' + totalVipTime + '\uFF0C\u80FD\u91CF+' + totalEnergy);
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u5F20\u5361\u7247\u8F6C\u6362\u6210\u529F' + (failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u5F20\u5361\u7247\u8F6C\u6362\u5931\u8D25' : '') + '</strong>' + ('<i>VIP\u5C0F\u65F6<em>+' + totalVipTime + '</em></i><i>\u80FD\u91CF<em>+' + totalEnergy + '</em></i>'), -1);
                        $('.kf_fw_ig2 .pd_card_chk:checked').closest('td').fadeOut('normal', function () {
                            var $parent = $(this).parent();
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
var addStartBatchModeButton = exports.addStartBatchModeButton = function addStartBatchModeButton() {
    var safeId = Public.getSafeId();
    if (!safeId) return;
    if (!$('.kf_fw_ig2 a[href^="kf_fw_card_my.php?id="]').length) return;
    $('<div class="pd_item_btns"><button>开启批量模式</button></div>').insertAfter('.kf_fw_ig2').find('button').click(function () {
        var $this = $(this);
        var $cardLines = $('.kf_fw_ig2 > tbody > tr:gt(2)');
        if ($this.text() === '开启批量模式') {
            (function () {
                $this.text('关闭批量模式');
                $cardLines.on('click', 'a', function (e) {
                    e.preventDefault();
                    $(this).next('.pd_card_chk').click();
                }).find('td').has('a').each(function () {
                    var matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                    if (matches) {
                        $(this).css('position', 'relative').append('<input class="pd_card_chk" type="checkbox" value="' + matches[1] + '">');
                    }
                });
                var playedCardList = [];
                $('.kf_fw_ig2 > tbody > tr:nth-child(2) > td').each(function () {
                    var matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                    if (!matches) return;
                    playedCardList.push(parseInt(matches[1]));
                });

                /**
                 * 不选择已出战的卡片
                 */
                var uncheckPlayedCard = function uncheckPlayedCard() {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = playedCardList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var id = _step.value;

                            $cardLines.find('td').has('a[href="kf_fw_card_my.php?id=' + id + '"]').find('[type="checkbox"]').prop('checked', false);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                };

                var $btns = $('\n<label><input name="uncheckPlayedCard" type="checkbox" checked> \u4E0D\u9009\u5DF2\u51FA\u6218\u7684\u5361\u7247</label>\n<button name="selectOnlyOne" type="button">\u6BCF\u7C7B\u53EA\u4FDD\u7559\u4E00\u5F20</button>\n<button name="selectAll" type="button">\u5168\u9009</button>\n<button name="selectInverse" type="button">\u53CD\u9009</button><br>\n<button name="convertCardsToVipTime" type="button">\u8F6C\u6362\u4E3AVIP\u65F6\u95F4</button>\n').insertBefore($this);
                $btns.filter('[name="selectOnlyOne"]').click(function () {
                    Util.selectAll($cardLines.find('[type="checkbox"]'));
                    if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
                    var cardTypeList = new Set();
                    $cardLines.find('a > img').each(function () {
                        cardTypeList.add($(this).attr('src'));
                    });
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = cardTypeList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var src = _step2.value;

                            var $cardElems = $cardLines.find('td').has('img[src="' + src + '"]');
                            var totalNum = $cardElems.length;
                            var checkedNum = $cardElems.has('[type="checkbox"]:checked').length;
                            if (totalNum > 1) {
                                if (totalNum === checkedNum) {
                                    $cardElems.eq(0).find('[type="checkbox"]:checked').prop('checked', false);
                                }
                            } else {
                                $cardElems.find('[type="checkbox"]:checked').prop('checked', false);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
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
                    var cardList = [];
                    $cardLines.find('[type="checkbox"]:checked').each(function () {
                        cardList.push(parseInt($(this).val()));
                    });
                    if (!cardList.length) return;
                    if (!confirm('\u5171\u9009\u62E9\u4E86' + cardList.length + '\u5F20\u5361\u7247\uFF0C\u662F\u5426\u5C06\u5361\u7247\u6279\u91CF\u8F6C\u6362\u4E3AVIP\u65F6\u95F4\uFF1F')) return;
                    Msg.wait('<strong>\u6B63\u5728\u6279\u91CF\u8F6C\u6362\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + cardList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
                    convertCardsToVipTime(cardList, safeId);
                });
            })();
        } else {
            $this.text('开启批量模式');
            $cardLines.off('click').find('.pd_card_chk').remove();
            $this.prevAll().remove();
        }
    });
};

},{"./Const":6,"./Log":11,"./Msg":15,"./Public":18,"./Util":22}],4:[function(require,module,exports){
/* 配置模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalize = exports.changeStorageType = exports.clear = exports.write = exports.read = exports.init = exports.Config = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var name = _Const2.default.storagePrefix + 'config';

/**
 * 配置类
 */
var Config = exports.Config = {
    // 是否开启定时模式，可按时进行自动操作（包括自动领取每日奖励、自动争夺，需开启相关功能），只在论坛首页生效（不开启此模式的话只能在刷新页面后才会进行操作），true：开启；false：关闭
    timingModeEnabled: false,
    // 在首页的网页标题上显示定时模式提示的方案，auto：停留一分钟后显示；always：总是显示；never：不显示
    showTimingModeTipsType: 'auto',

    // 是否自动KFB捐款，true：开启；false：关闭
    //autoDonationEnabled: false,
    // KFB捐款额度，取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前所持现金的百分比（最多不超过5000KFB），例：80%
    //donationKfb: '1',
    // 在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）
    //donationAfterTime: '00:05:00',

    // 是否自动领取每日奖励，true：开启；false：关闭
    autoGetDailyBonusEnabled: false,
    // 是否在完成争夺奖励后才领取每日奖励，true：开启；false：关闭
    getBonusAfterLootCompleteEnabled: false,
    // 是否在完成发言奖励后才领取每日奖励，true：开启；false：关闭
    getBonusAfterSpeakCompleteEnabled: false,

    // 是否自动争夺，true：开启；false：关闭
    autoLootEnabled: false,
    // 自动争夺的目标攻击层数（设为0表示攻击到被击败为止）
    attackTargetLevel: 0,
    // 争夺各层分配点数列表，例：{1:{"力量":1,"体质":2,"敏捷":3,"灵活":4,"智力":5,"意志":6}, 10:{"力量":6,"体质":5,"敏捷":4,"灵活":3,"智力":2,"意志":1}}
    levelPointList: {},
    // 是否在攻击时自动修改为相应层数的点数分配方案（仅限自动攻击相关按钮有效），true：开启；false：关闭
    autoChangeLevelPointsEnabled: false,
    // 是否使用自定义点数分配脚本（在设置了相应的自定义脚本的情况下，仅限自动攻击相关按钮有效），true：开启；false：关闭
    customPointsScriptEnabled: true,
    // 是否在攻击时如有剩余属性点则进行提醒（仅限自动攻击相关按钮有效），true：开启；false：关闭
    unusedPointNumAlertEnabled: true,
    // 是否延长每次争夺攻击的时间间隔，true：开启；false：关闭
    slowAttackEnabled: false,
    // 是否显示分层NPC统计，true：开启；false：关闭
    showLevelEnemyStatEnabled: false,
    // 历史争夺记录保存天数
    lootLogSaveDays: 15,

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
    // 是否使用Ajax的方式购买帖子（购买时页面不会跳转），true：开启；false：关闭
    buyThreadViaAjaxEnabled: true,
    // 是否在撰写发帖内容时阻止关闭页面，true：开启；false：关闭
    preventCloseWindowWhenEditPostEnabled: true,
    // 是否在提交时自动保存发帖内容，以便在出现意外情况时能够恢复发帖内容，true：开启；false：关闭
    autoSavePostContentWhenSubmitEnabled: false,
    // 是否在发帖框上显示绯月表情增强插件（仅在miaola.info域名下生效），true：开启；false：关闭
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

    // 是否延长道具批量操作的时间间隔，以模拟手动使用和恢复道具，true：开启；false：关闭
    simulateManualHandleItemEnabled: false,
    // 隐藏指定的道具种类，例：['蕾米莉亚同人漫画', '整形优惠卷']
    hideItemTypeList: []
};

/**
 * 初始化
 */
var init = exports.init = function init() {
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
var read = exports.read = function read() {
    var options = Util.readData(_Info2.default.storageType === 'ByUid' ? name + '_' + _Info2.default.uid : name);
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
var write = exports.write = function write() {
    var options = Util.getDifferenceSetOfObject(Config, _Info2.default.w.Config);
    Util.writeData(_Info2.default.storageType === 'ByUid' ? name + '_' + _Info2.default.uid : name, JSON.stringify(options));
};

/**
 * 清空设置
 */
var clear = exports.clear = function clear() {
    return Util.deleteData(_Info2.default.storageType === 'ByUid' ? name + '_' + _Info2.default.uid : name);
};

/**
 * 更改存储类型
 * @param {string} storageType 要更改的存储类型
 */
var changeStorageType = exports.changeStorageType = function changeStorageType(storageType) {
    var log = Log.read();
    var tmpLog = TmpLog.read();
    var lootLog = LootLog.read();
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
var normalize = exports.normalize = function normalize(options) {
    var settings = {};
    if ($.type(options) !== 'object') return settings;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Util.entries(options)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if (key in Config && $.type(value) === $.type(Config[key])) {
                settings[key] = value;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return settings;
};

},{"./Const":6,"./Info":9,"./Log":11,"./LootLog":14,"./TmpLog":21,"./Util":22}],5:[function(require,module,exports){
/* 设置对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 显示设置对话框
 */
var show = exports.show = function show() {
    var dialogName = 'pdConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    Script.runFunc('ConfigDialog.show_before_');
    var html = '\n<div class="pd_cfg_main">\n  <div class="pd_cfg_nav">\n    <a class="pd_btn_link" data-name="clearTmpData" title="\u6E05\u9664\u4E0E\u52A9\u624B\u6709\u5173\u7684Cookies\u548C\u672C\u5730\u5B58\u50A8\u6570\u636E\uFF08\u4E0D\u5305\u62EC\u52A9\u624B\u8BBE\u7F6E\u548C\u65E5\u5FD7\uFF09" href="#">\u6E05\u9664\u4E34\u65F6\u6570\u636E</a>\n    <a class="pd_btn_link" data-name="openRumCommandDialog" href="#">\u8FD0\u884C\u547D\u4EE4</a>\n    <a class="pd_btn_link" data-name="openImportOrExportSettingDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u8BBE\u7F6E</a>\n  </div>\n\n  <div class="pd_cfg_panel" style="margin-bottom: 5px;">\n    <fieldset>\n      <legend>\n        <label>\n          <input name="timingModeEnabled" type="checkbox"> \u5B9A\u65F6\u6A21\u5F0F\n          <span class="pd_cfg_tips" title="\u53EF\u6309\u65F6\u8FDB\u884C\u81EA\u52A8\u64CD\u4F5C\uFF08\u5305\u62EC\u81EA\u52A8\u9886\u53D6\u6BCF\u65E5\u5956\u52B1\u3001\u81EA\u52A8\u4E89\u593A\uFF0C\u9700\u5F00\u542F\u76F8\u5173\u529F\u80FD\uFF09\n\u53EA\u5728\u8BBA\u575B\u9996\u9875\u548C\u4E89\u593A\u9996\u9875\u751F\u6548\uFF08\u4E0D\u5F00\u542F\u6B64\u6A21\u5F0F\u7684\u8BDD\u53EA\u80FD\u5728\u5237\u65B0\u9875\u9762\u540E\u624D\u4F1A\u8FDB\u884C\u64CD\u4F5C\uFF09">[?]</span>\n        </label>\n      </legend>\n      <label>\n        \u6807\u9898\u63D0\u793A\u65B9\u6848\n        <select name="showTimingModeTipsType">\n          <option value="auto">\u505C\u7559\u4E00\u5206\u949F\u540E\u663E\u793A</option>\n          <option value="always">\u603B\u662F\u663E\u793A</option>\n          <option value="never">\u4E0D\u663E\u793A</option>\n        </select>\n        <span class="pd_cfg_tips" title="\u5728\u9996\u9875\u7684\u7F51\u9875\u6807\u9898\u4E0A\u663E\u793A\u5B9A\u65F6\u6A21\u5F0F\u63D0\u793A\u7684\u65B9\u6848">[?]</span>\n      </label>\n    </fieldset>\n    <fieldset hidden>\n      <legend>\n        <label><input name="autoDonationEnabled" type="checkbox"> \u81EA\u52A8KFB\u6350\u6B3E</label>\n      </legend>\n      <label>\n        KFB\u6350\u6B3E\u989D\u5EA6\n        <input name="donationKfb" type="text" maxlength="4" style="width: 32px;" required>\n        <span class="pd_cfg_tips" title="\u53D6\u503C\u8303\u56F4\u57281-5000\u7684\u6574\u6570\u4E4B\u95F4\uFF1B\u53EF\u8BBE\u7F6E\u4E3A\u767E\u5206\u6BD4\uFF0C\u8868\u793A\u6350\u6B3E\u989D\u5EA6\u4E3A\u5F53\u524D\u6240\u6301\u73B0\u91D1\u7684\u767E\u5206\u6BD4\uFF08\u6700\u591A\u4E0D\u8D85\u8FC75000KFB\uFF09\uFF0C\u4F8B\uFF1A80%">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        \u5728 <input name="donationAfterTime" type="text" maxlength="8" style="width: 55px;" required> \u4E4B\u540E\u6350\u6B3E\n        <span class="pd_cfg_tips" title="\u5728\u5F53\u5929\u7684\u6307\u5B9A\u65F6\u95F4\u4E4B\u540E\u6350\u6B3E\uFF0824\u5C0F\u65F6\u5236\uFF09\uFF0C\u4F8B\uFF1A22:30:00\uFF08\u6CE8\u610F\u4E0D\u8981\u8BBE\u7F6E\u5F97\u592A\u63A5\u8FD1\u96F6\u70B9\uFF0C\u4EE5\u514D\u9519\u8FC7\u6350\u6B3E\uFF09">[?]</span>\n      </label>\n    </fieldset>\n    <fieldset>\n      <legend>\n        <label><input name="autoGetDailyBonusEnabled" type="checkbox"> \u81EA\u52A8\u9886\u53D6\u6BCF\u65E5\u5956\u52B1</label>\n      </legend>\n      <label>\n        <input name="getBonusAfterLootCompleteEnabled" type="checkbox"> \u5B8C\u6210\u4E89\u593A\u540E\u624D\u9886\u53D6\n        <span class="pd_cfg_tips" title="\u5728\u5B8C\u6210\u4E89\u593A\u5956\u52B1\u540E\u624D\u9886\u53D6\u6BCF\u65E5\u5956\u52B1">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="getBonusAfterSpeakCompleteEnabled" type="checkbox"> \u5B8C\u6210\u53D1\u8A00\u540E\u624D\u9886\u53D6\n        <span class="pd_cfg_tips" title="\u5728\u5B8C\u6210\u53D1\u8A00\u5956\u52B1\u540E\u624D\u9886\u53D6\u6BCF\u65E5\u5956\u52B1">[?]</span>\n      </label>\n    </fieldset>\n    <fieldset>\n      <legend>\u4E89\u593A\u76F8\u5173</legend>\n      <label>\n        <input name="autoLootEnabled" type="checkbox"> \u81EA\u52A8\u4E89\u593A\n        <span class="pd_cfg_tips" title="\u5F53\u53D1\u73B0\u53EF\u4EE5\u8FDB\u884C\u4E89\u593A\u65F6\uFF0C\u4F1A\u8DF3\u8F6C\u5230\u4E89\u593A\u9996\u9875\u8FDB\u884C\u81EA\u52A8\u653B\u51FB\uFF08\u70B9\u6570\u5206\u914D\u7B49\u76F8\u5173\u529F\u80FD\u8BF7\u5728\u4E89\u593A\u9996\u9875\u4E0A\u8BBE\u7F6E\uFF09">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        \u653B\u51FB\u5230\u7B2C <input name="attackTargetLevel" type="number" min="0" style="width: 40px;" required> \u5C42\n        <span class="pd_cfg_tips" title="\u81EA\u52A8\u4E89\u593A\u7684\u76EE\u6807\u653B\u51FB\u5C42\u6570\uFF08\u8BBE\u4E3A0\u8868\u793A\u653B\u51FB\u5230\u88AB\u51FB\u8D25\u4E3A\u6B62\uFF09">[?]</span>\n      </label><br>\n      <label>\n        \u4E89\u593A\u8BB0\u5F55\u4FDD\u5B58\u5929\u6570 <input name="lootLogSaveDays" type="number" min="1" max="90" style="width: 40px;" required>\n        <span class="pd_cfg_tips" title="\u9ED8\u8BA4\u503C\uFF1A' + _Config.Config.lootLogSaveDays + '">[?]</span>\n      </label>\n    </fieldset>\n    <fieldset>\n      <legend>\u9996\u9875\u76F8\u5173</legend>\n      <label>\n        @\u63D0\u9192\n        <select name="atTipsHandleType" style="width: 130px;">\n          <option value="no_highlight">\u53D6\u6D88\u5DF2\u8BFB\u63D0\u9192\u9AD8\u4EAE</option>\n          <option value="no_highlight_extra">\u53D6\u6D88\u5DF2\u8BFB\u63D0\u9192\u9AD8\u4EAE\uFF0C\u5E76\u5728\u65E0\u63D0\u9192\u65F6\u8865\u4E0A\u6D88\u606F\u6846</option>\n          <option value="hide_box_1">\u4E0D\u663E\u793A\u5DF2\u8BFB\u63D0\u9192\u7684\u6D88\u606F\u6846</option>\n          <option value="hide_box_2">\u6C38\u4E0D\u663E\u793A\u6D88\u606F\u6846</option>\n          <option value="default">\u4FDD\u6301\u9ED8\u8BA4</option>\n          <option value="at_change_to_cao">\u5C06@\u6539\u4E3A\u8279(\u5176\u4ED6\u548C\u65B9\u5F0F2\u76F8\u540C)</option>\n        </select>\n        <span class="pd_cfg_tips" title="\u5BF9\u9996\u9875\u4E0A\u7684\u6709\u4EBA@\u4F60\u7684\u6D88\u606F\u6846\u8FDB\u884C\u5904\u7406\u7684\u65B9\u6848">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="smLevelUpAlertEnabled" type="checkbox"> \u795E\u79D8\u7B49\u7EA7\u5347\u7EA7\u63D0\u9192\n        <span class="pd_cfg_tips" title="\u5728\u795E\u79D8\u7B49\u7EA7\u5347\u7EA7\u540E\u8FDB\u884C\u63D0\u9192\uFF0C\u53EA\u5728\u9996\u9875\u751F\u6548">[?]</span>\n      </label><br>\n      <label>\n        <input name="fixedDepositDueAlertEnabled" type="checkbox"> \u5B9A\u671F\u5B58\u6B3E\u5230\u671F\u63D0\u9192\n        <span class="pd_cfg_tips" title="\u5728\u5B9A\u65F6\u5B58\u6B3E\u5230\u671F\u65F6\u8FDB\u884C\u63D0\u9192\uFF0C\u53EA\u5728\u9996\u9875\u751F\u6548">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="smRankChangeAlertEnabled" type="checkbox"> \u7CFB\u6570\u6392\u540D\u53D8\u5316\u63D0\u9192\n        <span class="pd_cfg_tips" title="\u5728\u795E\u79D8\u7CFB\u6570\u6392\u540D\u53D1\u751F\u53D8\u5316\u65F6\u8FDB\u884C\u63D0\u9192\uFF0C\u53EA\u5728\u9996\u9875\u751F\u6548">[?]</span>\n      </label><br>\n      <label>\n        <input name="homePageThreadFastGotoLinkEnabled" type="checkbox"> \u5728\u9996\u9875\u5E16\u5B50\u65C1\u663E\u793A\u8DF3\u8F6C\u94FE\u63A5\n        <span class="pd_cfg_tips" title="\u5728\u9996\u9875\u5E16\u5B50\u94FE\u63A5\u65C1\u663E\u793A\u5FEB\u901F\u8DF3\u8F6C\u81F3\u9875\u672B\u7684\u94FE\u63A5">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="showVipSurplusTimeEnabled" type="checkbox"> \u663E\u793AVIP\u5269\u4F59\u65F6\u95F4\n        <span class="pd_cfg_tips" title="\u5728\u9996\u9875\u663E\u793AVIP\u5269\u4F59\u65F6\u95F4">[?]</span>\n      </label>\n    </fieldset>\n    <fieldset>\n      <legend>\u5E16\u5B50\u9875\u9762\u76F8\u5173</legend>\n      <label>\n        \u5E16\u5B50\u6BCF\u9875\u697C\u5C42\u6570\u91CF\n        <select name="perPageFloorNum">\n          <option value="10">10</option>\n          <option value="20">20</option>\n          <option value="30">30</option>\n        </select>\n        <span class="pd_cfg_tips" title="\u7528\u4E8E\u7535\u68AF\u76F4\u8FBE\u548C\u5E16\u5B50\u9875\u6570\u5FEB\u6377\u94FE\u63A5\u7B49\u529F\u80FD\uFF0C\u5982\u679C\u4FEE\u6539\u4E86\u8BBA\u575B\u8BBE\u7F6E\u91CC\u7684\u201C\u6587\u7AE0\u5217\u8868\u6BCF\u9875\u4E2A\u6570\u201D\uFF0C\u8BF7\u5728\u6B64\u4FEE\u6539\u6210\u76F8\u540C\u7684\u6570\u76EE">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        \u5E16\u5B50\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F <input name="threadContentFontSize" type="number" min="7" max="72" style="width: 40px;"> px\n        <span class="pd_cfg_tips" title="\u5E16\u5B50\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F\uFF0C\u7559\u7A7A\u8868\u793A\u4F7F\u7528\u9ED8\u8BA4\u5927\u5C0F\uFF0C\u63A8\u8350\u503C\uFF1A14">[?]</span>\n      </label><br>\n      <label>\n        <input name="adjustThreadContentWidthEnabled" type="checkbox"> \u8C03\u6574\u5E16\u5B50\u5185\u5BB9\u5BBD\u5EA6\n        <span class="pd_cfg_tips" title="\u8C03\u6574\u5E16\u5B50\u5185\u5BB9\u5BBD\u5EA6\uFF0C\u4F7F\u5176\u4FDD\u6301\u4E00\u81F4">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="turnPageViaKeyboardEnabled" type="checkbox"> \u901A\u8FC7\u5DE6\u53F3\u952E\u7FFB\u9875\n        <span class="pd_cfg_tips" title="\u5728\u5E16\u5B50\u548C\u641C\u7D22\u9875\u9762\u901A\u8FC7\u5DE6\u53F3\u952E\u8FDB\u884C\u7FFB\u9875">[?]</span>\n      </label><br>\n      <label>\n        <input name="autoChangeIdColorEnabled" type="checkbox" data-disabled="[data-name=openAutoChangeSmColorPage]"> \u81EA\u52A8\u66F4\u6362ID\u989C\u8272\n        <span class="pd_cfg_tips" title="\u53EF\u81EA\u52A8\u66F4\u6362ID\u989C\u8272\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u524D\u5F80\u76F8\u5E94\u9875\u9762\u8FDB\u884C\u81EA\u5B9A\u4E49\u8BBE\u7F6E">[?]</span>\n      </label>\n      <a data-name="openAutoChangeSmColorPage" class="pd_cfg_ml" target="_blank" href="kf_growup.php">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n      <label>\n        \u81EA\u5B9A\u4E49\u672C\u4EBA\u7684\u795E\u79D8\u989C\u8272 <input name="customMySmColor" maxlength="7" style="width: 50px;" type="text">\n        <input style="margin-left: 0;" type="color" data-name="customMySmColorSelect">\n        <span class="pd_cfg_tips" title="\u81EA\u5B9A\u4E49\u672C\u4EBA\u7684\u795E\u79D8\u989C\u8272\uFF08\u5305\u62EC\u5E16\u5B50\u9875\u9762\u7684ID\u663E\u793A\u989C\u8272\u548C\u697C\u5C42\u8FB9\u6846\u989C\u8272\uFF0C\u4EC5\u81EA\u5DF1\u53EF\u89C1\uFF09\uFF0C\u4F8B\uFF1A#009cff\uFF0C\u5982\u65E0\u9700\u6C42\u53EF\u7559\u7A7A">[?]</span>\n      </label><br>\n      <label>\n        <input name="customSmColorEnabled" type="checkbox" data-disabled="[data-name=openCustomSmColorDialog]"> \u81EA\u5B9A\u4E49\u5404\u7B49\u7EA7\u795E\u79D8\u989C\u8272\n        <span class="pd_cfg_tips" title="\u81EA\u5B9A\u4E49\u5404\u7B49\u7EA7\u795E\u79D8\u989C\u8272\uFF08\u5305\u62EC\u5E16\u5B50\u9875\u9762\u7684ID\u663E\u793A\u989C\u8272\u548C\u697C\u5C42\u8FB9\u6846\u989C\u8272\uFF0C\u4EC5\u81EA\u5DF1\u53EF\u89C1\uFF09\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u5404\u7B49\u7EA7\u989C\u8272">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openCustomSmColorDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n      <label>\n        <input name="userMemoEnabled" type="checkbox" data-disabled="[data-name=openUserMemoDialog]"> \u663E\u793A\u7528\u6237\u5907\u6CE8\n        <span class="pd_cfg_tips" title="\u5728\u697C\u5C42\u5185\u7684\u7528\u6237\u540D\u65C1\u663E\u793A\u8BE5\u7528\u6237\u7684\u81EA\u5B9A\u4E49\u5907\u6CE8\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u7528\u6237\u5907\u6CE8">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openUserMemoDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n      <label>\n        <input name="modifyKfOtherDomainEnabled" type="checkbox"> \u5C06\u7EEF\u6708\u5176\u5B83\u57DF\u540D\u7684\u94FE\u63A5\u4FEE\u6539\u4E3A\u5F53\u524D\u57DF\u540D\n        <span class="pd_cfg_tips" title="\u5C06\u5E16\u5B50\u548C\u77ED\u6D88\u606F\u4E2D\u7684\u7EEF\u6708\u5176\u5B83\u57DF\u540D\u7684\u94FE\u63A5\u4FEE\u6539\u4E3A\u5F53\u524D\u57DF\u540D">[?]</span>\n      </label><br>\n      <label>\n        <input name="multiQuoteEnabled" type="checkbox"> \u5F00\u542F\u591A\u91CD\u5F15\u7528\u529F\u80FD\n        <span class="pd_cfg_tips" title="\u5728\u5E16\u5B50\u9875\u9762\u5F00\u542F\u591A\u91CD\u56DE\u590D\u548C\u591A\u91CD\u5F15\u7528\u529F\u80FD">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="parseMediaTagEnabled" type="checkbox"> \u89E3\u6790\u591A\u5A92\u4F53\u6807\u7B7E\n        <span class="pd_cfg_tips" title="\u5728\u5E16\u5B50\u9875\u9762\u89E3\u6790HTML5\u591A\u5A92\u4F53\u6807\u7B7E\uFF0C\u8BE6\u89C1\u3010\u5E38\u89C1\u95EE\u989812\u3011">[?]</span>\n      </label><br>\n      <label>\n        <input name="buyThreadViaAjaxEnabled" type="checkbox"> \u4F7F\u7528Ajax\u8D2D\u4E70\u5E16\u5B50\n        <span class="pd_cfg_tips" title="\u4F7F\u7528Ajax\u7684\u65B9\u5F0F\u8D2D\u4E70\u5E16\u5B50\uFF0C\u8D2D\u4E70\u65F6\u9875\u9762\u4E0D\u4F1A\u8DF3\u8F6C">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="kfSmileEnhanceExtensionEnabled" type="checkbox" ' + (_Info2.default.isInMiaolaDomain ? '' : 'disabled') + '> \u5F00\u542F\u7EEF\u6708\u8868\u60C5\u589E\u5F3A\u63D2\u4EF6\n        <span class="pd_cfg_tips" title="\u5728\u53D1\u5E16\u6846\u4E0A\u663E\u793A\u7EEF\u6708\u8868\u60C5\u589E\u5F3A\u63D2\u4EF6\uFF08\u4EC5\u5728miaola.info\u57DF\u540D\u4E0B\u751F\u6548\uFF09\uFF0C\u8BE5\u63D2\u4EF6\u7531eddie32\u5F00\u53D1">[?]</span>\n      </label><br>\n      <label>\n        <input name="preventCloseWindowWhenEditPostEnabled" type="checkbox"> \u5199\u5E16\u5B50\u65F6\u963B\u6B62\u5173\u95ED\u9875\u9762\n        <span class="pd_cfg_tips" title="\u5728\u64B0\u5199\u53D1\u5E16\u5185\u5BB9\u65F6\uFF0C\u5982\u4E0D\u5C0F\u5FC3\u5173\u95ED\u4E86\u9875\u9762\u4F1A\u8FDB\u884C\u63D0\u793A">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="autoSavePostContentWhenSubmitEnabled" type="checkbox"> \u63D0\u4EA4\u65F6\u4FDD\u5B58\u53D1\u5E16\u5185\u5BB9\n        <span class="pd_cfg_tips" title="\u5728\u63D0\u4EA4\u65F6\u81EA\u52A8\u4FDD\u5B58\u53D1\u5E16\u5185\u5BB9\uFF0C\u4EE5\u4FBF\u5728\u51FA\u73B0\u610F\u5916\u60C5\u51B5\u65F6\u80FD\u591F\u6062\u590D\u53D1\u5E16\u5185\u5BB9\uFF08\u9700\u5728\u4E0D\u5173\u95ED\u5F53\u524D\u6807\u7B7E\u9875\u7684\u60C5\u51B5\u4E0B\u624D\u80FD\u8D77\u6548\uFF09">[?]</span>\n      </label>\n    </fieldset>\n  </div>\n\n  <div class="pd_cfg_panel">\n    <fieldset>\n      <legend>\u7248\u5757\u9875\u9762\u76F8\u5173</legend>\n      <label>\n        <input name="showFastGotoThreadPageEnabled" type="checkbox" data-disabled="[name=maxFastGotoThreadPageNum]"> \u663E\u793A\u5E16\u5B50\u9875\u6570\u5FEB\u6377\u94FE\u63A5\n        <span class="pd_cfg_tips" title="\u5728\u7248\u5757\u9875\u9762\u4E2D\u663E\u793A\u5E16\u5B50\u9875\u6570\u5FEB\u6377\u94FE\u63A5">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        \u9875\u6570\u94FE\u63A5\u6700\u5927\u6570\u91CF <input name="maxFastGotoThreadPageNum" type="number" min="1" max="10" style="width: 40px;" required>\n        <span class="pd_cfg_tips" title="\u5728\u5E16\u5B50\u9875\u6570\u5FEB\u6377\u94FE\u63A5\u4E2D\u663E\u793A\u9875\u6570\u94FE\u63A5\u7684\u6700\u5927\u6570\u91CF">[?]</span>\n      </label><br>\n      <label>\n        <input name="highlightNewPostEnabled" type="checkbox"> \u9AD8\u4EAE\u4ECA\u65E5\u7684\u65B0\u5E16\n        <span class="pd_cfg_tips" title="\u5728\u7248\u5757\u9875\u9762\u4E2D\u9AD8\u4EAE\u4ECA\u65E5\u65B0\u53D1\u8868\u5E16\u5B50\u7684\u53D1\u8868\u65F6\u95F4">[?]</span>\n      </label>\n    </fieldset>\n    <fieldset>\n      <legend>\u5176\u5B83\u8BBE\u7F6E</legend>\n      <label class="pd_highlight">\n        \u5B58\u50A8\u7C7B\u578B\n        <select data-name="storageType">\n          <option value="Default">\u9ED8\u8BA4</option>\n          <option value="ByUid">\u6309uid</option>\n          <option value="Global">\u5168\u5C40</option>\n        </select>\n        <span class="pd_cfg_tips" title="\u52A9\u624B\u8BBE\u7F6E\u548C\u65E5\u5FD7\u7684\u5B58\u50A8\u65B9\u5F0F\uFF0C\u8BE6\u60C5\u53C2\u89C1\u3010\u5E38\u89C1\u95EE\u98981\u3011">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        \u6D4F\u89C8\u5668\u7C7B\u578B\n        <select name="browseType">\n          <option value="auto">\u81EA\u52A8\u68C0\u6D4B</option>\n          <option value="desktop">\u684C\u9762\u7248</option>\n          <option value="mobile">\u79FB\u52A8\u7248</option>\n        </select>\n        <span class="pd_cfg_tips" title="\u7528\u4E8E\u5728KFOL\u52A9\u624B\u4E0A\u5224\u65AD\u6D4F\u89C8\u5668\u7684\u7C7B\u578B\uFF0C\u4E00\u822C\u4F7F\u7528\u81EA\u52A8\u68C0\u6D4B\u5373\u53EF\uFF1B\n\u5982\u679C\u5F53\u524D\u6D4F\u89C8\u5668\u4E0E\u81EA\u52A8\u68C0\u6D4B\u7684\u7C7B\u578B\u4E0D\u76F8\u7B26\uFF08\u79FB\u52A8\u7248\u4F1A\u5728\u8BBE\u7F6E\u754C\u9762\u6807\u9898\u4E0A\u663E\u793A\u201CFor Mobile\u201D\u7684\u5B57\u6837\uFF09\uFF0C\u8BF7\u624B\u52A8\u8BBE\u7F6E\u4E3A\u6B63\u786E\u7684\u7C7B\u578B">[?]</span>\n      </label><br>\n      <label>\n        \u6D88\u606F\u663E\u793A\u65F6\u95F4 <input name="defShowMsgDuration" type="number" min="-1" style="width: 46px;" required> \u79D2\n        <span class="pd_cfg_tips" title="\u9ED8\u8BA4\u7684\u6D88\u606F\u663E\u793A\u65F6\u95F4\uFF08\u79D2\uFF09\uFF0C\u8BBE\u7F6E\u4E3A-1\u8868\u793A\u6C38\u4E45\u663E\u793A\uFF0C\u4F8B\uFF1A15">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        \u65E5\u5FD7\u4FDD\u5B58\u5929\u6570 <input name="logSaveDays" type="number" min="1" max="365" style="width: 46px;" required>\n        <span class="pd_cfg_tips" title="\u9ED8\u8BA4\u503C\uFF1A' + _Config.Config.logSaveDays + '">[?]</span>\n      </label><br>\n      <label>\n        <input name="showSearchLinkEnabled" type="checkbox"> \u663E\u793A\u641C\u7D22\u94FE\u63A5\n        <span class="pd_cfg_tips" title="\u5728\u9875\u9762\u4E0A\u65B9\u663E\u793A\u641C\u7D22\u5BF9\u8BDD\u6846\u7684\u94FE\u63A5">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="animationEffectOffEnabled" type="checkbox"> \u7981\u7528\u52A8\u753B\u6548\u679C\n        <span class="pd_cfg_tips" title="\u7981\u7528jQuery\u7684\u52A8\u753B\u6548\u679C\uFF08\u63A8\u8350\u5728\u914D\u7F6E\u8F83\u5DEE\u7684\u673A\u5668\u4E0A\u4F7F\u7528\uFF09">[?]</span>\n      </label><br>\n      <label>\n        <input name="addSideBarFastNavEnabled" type="checkbox"> \u4E3A\u4FA7\u8FB9\u680F\u6DFB\u52A0\u5FEB\u6377\u5BFC\u822A\n        <span class="pd_cfg_tips" title="\u4E3A\u4FA7\u8FB9\u680F\u6DFB\u52A0\u5FEB\u6377\u5BFC\u822A\u7684\u94FE\u63A5">[?]</span>\n      </label>\n      <label class="pd_cfg_ml">\n        <input name="modifySideBarEnabled" type="checkbox"> \u5C06\u4FA7\u8FB9\u680F\u4FEE\u6539\u4E3A\u5E73\u94FA\u6837\u5F0F\n        <span class="pd_cfg_tips" title="\u5C06\u4FA7\u8FB9\u680F\u4FEE\u6539\u4E3A\u548C\u624B\u673A\u76F8\u540C\u7684\u5E73\u94FA\u6837\u5F0F">[?]</span>\n      </label><br>\n      <label>\n        <input name="customCssEnabled" type="checkbox" data-disabled="[data-name=openCustomCssDialog]"> \u6DFB\u52A0\u81EA\u5B9A\u4E49CSS\n        <span class="pd_cfg_tips" title="\u4E3A\u9875\u9762\u6DFB\u52A0\u81EA\u5B9A\u4E49\u7684CSS\u5185\u5BB9\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u586B\u5165\u81EA\u5B9A\u4E49\u7684CSS\u5185\u5BB9">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openCustomCssDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n      <label>\n        <input name="customScriptEnabled" type="checkbox" data-disabled="[data-name=openCustomScriptDialog]"> \u6267\u884C\u81EA\u5B9A\u4E49\u811A\u672C\n        <span class="pd_cfg_tips" title="\u6267\u884C\u81EA\u5B9A\u4E49\u7684javascript\u811A\u672C\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u586B\u5165\u81EA\u5B9A\u4E49\u7684\u811A\u672C\u5185\u5BB9">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openCustomScriptDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a>\n    </fieldset>\n    <fieldset>\n      <legend>\u5173\u6CE8\u548C\u5C4F\u853D</legend>\n      <label>\n        <input name="followUserEnabled" type="checkbox" data-disabled="[data-name=openFollowUserDialog]"> \u5173\u6CE8\u7528\u6237\n        <span class="pd_cfg_tips" title="\u5F00\u542F\u5173\u6CE8\u7528\u6237\u7684\u529F\u80FD\uFF0C\u6240\u5173\u6CE8\u7684\u7528\u6237\u5C06\u88AB\u52A0\u6CE8\u8BB0\u53F7\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5173\u6CE8\u7528\u6237">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openFollowUserDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n      <label>\n        <input name="blockUserEnabled" type="checkbox" data-disabled="[data-name=openBlockUserDialog]"> \u5C4F\u853D\u7528\u6237\n        <span class="pd_cfg_tips" title="\u5F00\u542F\u5C4F\u853D\u7528\u6237\u7684\u529F\u80FD\uFF0C\u4F60\u5C06\u770B\u4E0D\u89C1\u6240\u5C4F\u853D\u7528\u6237\u7684\u53D1\u8A00\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5C4F\u853D\u7528\u6237">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openBlockUserDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n      <label>\n        <input name="blockThreadEnabled" type="checkbox" data-disabled="[data-name=openBlockThreadDialog]"> \u5C4F\u853D\u5E16\u5B50\n        <span class="pd_cfg_tips" title="\u5F00\u542F\u5C4F\u853D\u6807\u9898\u4E2D\u5305\u542B\u6307\u5B9A\u5173\u952E\u5B57\u7684\u5E16\u5B50\u7684\u529F\u80FD\uFF0C\u8BF7\u70B9\u51FB\u8BE6\u7EC6\u8BBE\u7F6E\u7BA1\u7406\u5C4F\u853D\u5173\u952E\u5B57">[?]</span>\n      </label>\n      <a class="pd_cfg_ml" data-name="openBlockThreadDialog" href="#">\u8BE6\u7EC6\u8BBE\u7F6E&raquo;</a><br>\n    </fieldset>\n    <fieldset>\n      <legend>\n        <label>\n          <input name="autoSaveCurrentDepositEnabled" type="checkbox"> \u81EA\u52A8\u6D3B\u671F\u5B58\u6B3E\n          <span class="pd_cfg_tips" title="\u5728\u5F53\u524D\u6536\u5165\u6EE1\u8DB3\u6307\u5B9A\u989D\u5EA6\u4E4B\u540E\u81EA\u52A8\u5C06\u6307\u5B9A\u6570\u989D\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E\u4E2D\uFF0C\u53EA\u4F1A\u5728\u9996\u9875\u89E6\u53D1">[?]</span>\n        </label>\n      </legend>\n      <label>\n        \u5728\u5F53\u524D\u6536\u5165\u5DF2\u6EE1 <input name="saveCurrentDepositAfterKfb" type="number" min="1" style="width: 80px;"> KFB\u4E4B\u540E\n        <span class="pd_cfg_tips" title="\u5728\u5F53\u524D\u6536\u5165\u5DF2\u6EE1\u6307\u5B9AKFB\u989D\u5EA6\u4E4B\u540E\u81EA\u52A8\u8FDB\u884C\u6D3B\u671F\u5B58\u6B3E\uFF0C\u4F8B\uFF1A1000">[?]</span>\n      </label><br>\n      <label>\n        \u5C06 <input name="saveCurrentDepositKfb" type="number" min="1" style="width: 80px;"> KFB\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E\n        <span class="pd_cfg_tips" title="\u5C06\u6307\u5B9A\u989D\u5EA6\u7684KFB\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E\u4E2D\uFF0C\u4F8B\uFF1A900\uFF1B\u4E3E\u4F8B\uFF1A\u8BBE\u5B9A\u5DF2\u6EE11000\u5B58900\uFF0C\u5F53\u524D\u6536\u5165\u4E3A2000\uFF0C\u5219\u81EA\u52A8\u5B58\u5165\u91D1\u989D\u4E3A1800">[?]</span>\n      </label>\n    </fieldset>\n  </div>\n</div>\n\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about">\n    <a target="_blank" href="read.php?tid=508450">By \u55B5\u62C9\u5E03\u4E01</a>\n    <i style="color: #666; font-style: normal;">(V' + _Info2.default.version + ')</i>\n    <a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">[\u5E38\u89C1\u95EE\u9898]</a>\n  </span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n  <button name="default" type="button">\u9ED8\u8BA4\u503C</button>\n</div>';
    var $dialog = Dialog.create(dialogName, 'KFOL助手设置' + (_Info2.default.isMobile ? ' (For Mobile)' : ''), html);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!verifyMainConfig($dialog)) return;
        var oriAutoRefreshEnabled = Config.timingModeEnabled;
        (0, _Config.read)();
        var options = getMainConfigValue($dialog);
        options = (0, _Config.normalize)(options);
        $.extend(Config, options);
        (0, _Config.write)();
        var storageType = $dialog.find('[data-name="storageType"]').val();
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
        var type = prompt('可清除与助手有关的Cookies和本地临时数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地临时数据', 0);
        if (type === null) return;
        type = parseInt(type);
        if (!isNaN(type) && type >= 0) {
            clearTmpData(type);
            alert('缓存已清除');
        }
    });

    $dialog.on('click', 'a[data-name^="open"][href="#"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        var name = $this.data('name');
        if (name === 'openRumCommandDialog') showRunCommandDialog();
        if (name === 'openImportOrExportSettingDialog') showImportOrExportSettingDialog();
        if (name === 'openCustomSmColorDialog') showCustomSmColorDialog();else if (name === 'openUserMemoDialog') showUserMemoDialog();else if (name === 'openCustomCssDialog') showCustomCssDialog();else if (name === 'openCustomScriptDialog') Script.showDialog();else if (name === 'openFollowUserDialog') showFollowUserDialog();else if (name === 'openBlockUserDialog') showBlockUserDialog();else if (name === 'openBlockThreadDialog') showBlockThreadDialog();
    }).find('[data-name="customMySmColorSelect"]').change(function () {
        $dialog.find('[name="customMySmColor"]').val($(this).val().toString().toLowerCase());
    }).end().find('[name="customMySmColor"]').change(function () {
        var color = $.trim($(this).val());
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
var setMainConfigValue = function setMainConfigValue($dialog) {
    $dialog.find('input[name], select[name]').each(function () {
        var $this = $(this);
        var name = $this.attr('name');
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
var getMainConfigValue = function getMainConfigValue($dialog) {
    var options = {};
    $dialog.find('input[name], select[name]').each(function () {
        var $this = $(this);
        var name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') options[name] = Boolean($this.prop('checked'));else if (typeof Config[name] === 'number') {
                options[name] = parseInt($this.val());
                if (name === 'threadContentFontSize' && isNaN(options[name])) options[name] = 0;
            } else options[name] = $.trim($this.val());
        }
    });
    return options;
};

/**
 * 验证主对话框设置是否正确
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {boolean} 是否验证通过
 */
var verifyMainConfig = function verifyMainConfig($dialog) {
    /*let $txtDonationKfb = $dialog.find('[name="donationKfb"]');
     let donationKfb = $.trim($txtDonationKfb.val());
     if (/%$/.test(donationKfb)) {
     if (!/^1?\d?\d%$/.test(donationKfb)) {
     alert('KFB捐款额度格式不正确');
     $txtDonationKfb.select().focus();
     return false;
     }
     if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > 100) {
     alert('KFB捐款额度百分比的取值范围在1-100之间');
     $txtDonationKfb.select().focus();
     return false;
     }
     }
     else {
     if (!$.isNumeric(donationKfb)) {
     alert('KFB捐款额度格式不正确');
     $txtDonationKfb.select().focus();
     return false;
     }
     if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > Const.maxDonationKfb) {
     alert(`KFB捐款额度的取值范围在1-${Const.maxDonationKfb}之间`);
     $txtDonationKfb.select().focus();
     return false;
     }
     }
       let $txtDonationAfterTime = $dialog.find('[name="donationAfterTime"]');
     let donationAfterTime = $.trim($txtDonationAfterTime.val());
     if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(donationAfterTime)) {
     alert('在指定时间之后捐款格式不正确');
     $txtDonationAfterTime.select().focus();
     return false;
     }*/

    var $txtCustomMySmColor = $dialog.find('[name="customMySmColor"]');
    var customMySmColor = $.trim($txtCustomMySmColor.val());
    if (customMySmColor && !/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
        alert('自定义本人的神秘颜色格式不正确，例：#009cff');
        $txtCustomMySmColor.select().focus();
        return false;
    }

    var $txtSaveCurrentDepositAfterKfb = $dialog.find('[name="saveCurrentDepositAfterKfb"]');
    var $txtSaveCurrentDepositKfb = $dialog.find('[name="saveCurrentDepositKfb"]');
    var saveCurrentDepositAfterKfb = parseInt($txtSaveCurrentDepositAfterKfb.val());
    var saveCurrentDepositKfb = parseInt($txtSaveCurrentDepositKfb.val());
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
var clearTmpData = function clearTmpData() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (type === 0 || type === 1) {
        for (var key in _Const2.default) {
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
var showRunCommandDialog = function showRunCommandDialog() {
    var dialogName = 'pdRunCommandDialog';
    if ($('#' + dialogName).length > 0) return;
    Dialog.close('pdConfigDialog');
    var html = '\n<div class="pd_cfg_main">\n  <div style="margin: 5px 0;">\n    \u8FD0\u884C\u547D\u4EE4\u5FEB\u6377\u952E\uFF1A<b>Ctrl+Enter</b>\uFF1B\u6E05\u9664\u547D\u4EE4\u5FEB\u6377\u952E\uFF1A<b>Ctrl+\u9000\u683C\u952E</b><br>\n    \u6309<b>F12\u952E</b>\u53EF\u6253\u5F00\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u67E5\u770B\u6D88\u606F\uFF08\u9700\u5207\u6362\u81F3\u63A7\u5236\u53F0\u6216Console\u6807\u7B7E\uFF09\n  </div>\n  <textarea name="cmd" wrap="off" style="width: 750px; height: 300px; white-space: pre;"></textarea>\n</div>\n<div class="pd_cfg_btns">\n  <button type="submit">\u8FD0\u884C</button>\n  <button name="clear" type="button">\u6E05\u9664</button>\n  <button data-action="close" type="button">\u5173\u95ED</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '运行命令', html);
    var $cmd = $dialog.find('[name="cmd"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        var content = $cmd.val();
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
var showImportOrExportSettingDialog = function showImportOrExportSettingDialog() {
    var dialogName = 'pdImOrExSettingDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    var html = '\n<div class="pd_cfg_main">\n  <div>\n    <strong>\u5BFC\u5165\u8BBE\u7F6E\uFF1A</strong>\u5C06\u8BBE\u7F6E\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u4FDD\u5B58\u6309\u94AE\u5373\u53EF<br>\n    <strong>\u5BFC\u51FA\u8BBE\u7F6E\uFF1A</strong>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF\n  </div>\n  <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>\n</div>\n<div class="pd_cfg_btns">\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '导入或导出设置', html);
    var $setting = $dialog.find('[name="setting"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        var options = $.trim($setting.val());
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
var showCustomSmColorDialog = function showCustomSmColorDialog() {
    var dialogName = 'pdCustomSmColorDialog';
    if ($('#' + dialogName).length > 0) return;
    var html = '\n<div class="pd_cfg_main">\n  <div style="border-bottom: 1px solid #9191ff; margin-bottom: 7px; padding-bottom: 5px;">\n    <strong>\n      \u793A\u4F8B\uFF08<a target="_blank" href="http://www.35ui.cn/jsnote/peise.html">\u5E38\u7528\u914D\u8272\u8868</a> / \n      <a target="_blank" href="read.php?tid=488016">\u914D\u8272\u65B9\u6848\u6536\u96C6\u8D34</a>\uFF09\uFF1A\n    </strong><br>\n    <b>\u7B49\u7EA7\u8303\u56F4\uFF1A</b>4-4 <b>\u989C\u8272\uFF1A</b><span style="color: #0000ff;">#0000ff</span><br>\n    <b>\u7B49\u7EA7\u8303\u56F4\uFF1A</b>10-99 <b>\u989C\u8272\uFF1A</b><span style="color: #5ad465;">#5ad465</span><br>\n    <b>\u7B49\u7EA7\u8303\u56F4\uFF1A</b>5000-MAX <b>\u989C\u8272\uFF1A</b><span style="color: #ff0000;">#ff0000</span>\n  </div>\n  <ul data-name="smColorList"></ul>\n  <div style="margin-top: 5px;" data-name="customSmColorAddBtns">\n    <a class="pd_btn_link" data-action="addOne" href="#">\u589E\u52A01\u4E2A</a>\n    <a class="pd_btn_link" data-action="addFive" href="#">\u589E\u52A05\u4E2A</a>\n    <a class="pd_btn_link" data-action="clear" href="#">\u6E05\u9664\u6240\u6709</a>\n  </div>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a data-name="openImOrExCustomSmColorConfigDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u914D\u8272\u65B9\u6848</a></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '自定义各等级神秘颜色', html, 'min-width: 327px;');
    var $customSmColorList = $dialog.find('[data-name="smColorList"]');

    $customSmColorList.on('change', '[name="color"]', function () {
        var $this = $(this);
        var color = $.trim($this.val());
        if (/^#[0-9a-fA-F]{6}$/.test(color)) {
            $this.next('[type="color"]').val(color.toLowerCase());
        }
    }).on('change', '[type="color"]', function () {
        var $this = $(this);
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
    var getSmColorLineHtml = function getSmColorLineHtml() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$min = _ref.min,
            min = _ref$min === undefined ? '' : _ref$min,
            _ref$max = _ref.max,
            max = _ref$max === undefined ? '' : _ref$max,
            _ref$color = _ref.color,
            color = _ref$color === undefined ? '' : _ref$color;

        return '\n<li>\n  <label>\u7B49\u7EA7\u8303\u56F4 <input name="min" type="text" maxlength="5" style="width: 30px;" value="' + min + '"></label>\n  <label>- <input name="max" type="text" maxlength="5" style="width: 30px;" value="' + max + '"></label>\n  <label>\n    &nbsp;\u989C\u8272 <input name="color" type="text" maxlength="7" style="width: 50px;" value="' + color + '">\n    <input style="margin-left: 0;" type="color" value="' + color + '">\n  </label>\n  <a href="#">\u5220\u9664</a>\n</li>';
    };

    var smColorHtml = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Config.customSmColorConfigList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var data = _step.value;

            smColorHtml += getSmColorLineHtml(data);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    $customSmColorList.html(smColorHtml);

    $dialog.submit(function (e) {
        e.preventDefault();
        var list = [];
        var verification = true;
        $customSmColorList.find('li').each(function () {
            var $this = $(this);
            var $txtSmMin = $this.find('[name="min"]');
            var min = $.trim($txtSmMin.val()).toUpperCase();
            if (min === '') return;
            if (!/^(-?\d+|MAX)$/i.test(min)) {
                verification = false;
                $txtSmMin.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            var $txtSmMax = $this.find('[name="max"]');
            var max = $.trim($txtSmMax.val()).toUpperCase();
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
            var $txtSmColor = $this.find('[name="color"]');
            var color = $.trim($txtSmColor.val()).toLowerCase();
            if (color === '') return;
            if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
                verification = false;
                $txtSmColor.select().focus();
                alert('颜色格式不正确');
                return false;
            }
            list.push({ min: min, max: max, color: color });
        });
        if (verification) {
            list.sort(function (a, b) {
                return Util.compareSmLevel(a.min, b.min) > 0 ? 1 : -1;
            });
            Config.customSmColorConfigList = list;
            (0, _Config.write)();
            Dialog.close(dialogName);
        }
    }).find('[data-action="addOne"], [data-action="addFive"]').click(function (e) {
        e.preventDefault();
        var num = 1;
        if ($(this).is('[data-action="addFive"]')) num = 5;
        for (var i = 1; i <= num; i++) {
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
        Public.showCommonImportOrExportConfigDialog('配色方案', 'customSmColorConfigList', function ($dialog) {
            return $dialog.find('.pd_cfg_about').append('<a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a>');
        });
    });

    Dialog.show(dialogName);
};

/**
 * 显示自定义CSS对话框
 */
var showCustomCssDialog = function showCustomCssDialog() {
    var dialogName = 'pdCustomCssDialog';
    if ($('#' + dialogName).length > 0) return;
    var html = '\n<div class="pd_cfg_main">\n  <strong>\u81EA\u5B9A\u4E49CSS\u5185\u5BB9\uFF1A</strong><br>\n  <textarea name="customCssContent" wrap="off" style="width: 750px; height: 400px; white-space: pre;"></textarea>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500969">CSS\u89C4\u5219\u6536\u96C6\u8D34</a></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '自定义CSS', html);
    var $content = $dialog.find('[name="customCssContent"]');
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
var showUserMemoDialog = function showUserMemoDialog() {
    var dialogName = 'pdUserMemoDialog';
    if ($('#' + dialogName).length > 0) return;
    var html = '\n<div class="pd_cfg_main">\n  \u6309\u7167\u201C\u7528\u6237\u540D:\u5907\u6CE8\u201D\u7684\u683C\u5F0F\uFF08\u6CE8\u610F\u662F\u82F1\u6587\u5192\u53F7\uFF09\uFF0C\u6BCF\u884C\u4E00\u4E2A<br>\n  <textarea name="userMemoList" wrap="off" style="width: 320px; height: 400px; white-space: pre;"></textarea>\n</div>\n<div class="pd_cfg_btns">\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '用户备注', html);
    var $userMemoList = $dialog.find('[name="userMemoList"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        var content = $.trim($userMemoList.val());
        Config.userMemoList = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = content.split('\n')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var line = _step2.value;

                line = $.trim(line);
                if (!line) continue;
                if (!/.+?:.+/.test(line)) {
                    alert('用户备注格式不正确');
                    $userMemoList.focus();
                    return;
                }

                var _line$split = line.split(':'),
                    _line$split2 = _slicedToArray(_line$split, 2),
                    user = _line$split2[0],
                    _line$split2$ = _line$split2[1],
                    memo = _line$split2$ === undefined ? '' : _line$split2$;

                if (!memo) continue;
                Config.userMemoList[user.trim()] = memo.trim();
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        (0, _Config.write)();
        Dialog.close(dialogName);
    });
    var content = '';
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Util.entries(Config.userMemoList)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                user = _step3$value[0],
                memo = _step3$value[1];

            content += user + ':' + memo + '\n';
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    $userMemoList.val(content);
    Dialog.show(dialogName);
    $userMemoList.focus();
};

/**
 * 显示关注用户对话框
 */
var showFollowUserDialog = function showFollowUserDialog() {
    var dialogName = 'pdFollowUserDialog';
    if ($('#' + dialogName).length > 0) return;
    var html = '\n<div class="pd_cfg_main">\n  <div style="margin-top: 5px;">\n    <label>\n      <input name="highlightFollowUserThreadInHpEnabled" type="checkbox"> \u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u7684\u9996\u9875\u5E16\u5B50\u94FE\u63A5\n      <span class="pd_cfg_tips" title="\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u5728\u9996\u9875\u4E0B\u7684\u5E16\u5B50\u94FE\u63A5">[?]</span>\n    </label><br>\n    <label>\n      <input name="highlightFollowUserThreadLinkEnabled" type="checkbox"> \u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u7684\u5E16\u5B50\u94FE\u63A5\n      <span class="pd_cfg_tips" title="\u9AD8\u4EAE\u6240\u5173\u6CE8\u7528\u6237\u5728\u7248\u5757\u9875\u9762\u4E0B\u7684\u5E16\u5B50\u94FE\u63A5">[?]</span>\n    </label><br>\n  </div>\n  <ul id="pdFollowUserList" style="margin-top: 5px; min-width: 274px; line-height: 24px;"></ul>\n  <div style="margin-top: 5px;">\n    <div style="display: inline-block;">\n      <a class="pd_btn_link" data-name="selectAll" href="#">\u5168\u9009</a>\n      <a class="pd_btn_link" data-name="selectInverse" href="#">\u53CD\u9009</a>\n    </div>\n    <div style="float: right;">\n      <a class="pd_btn_link" data-name="deleteSelect" href="#">\u5220\u9664</a>\n    </div>\n  </div>\n  <div style="margin-top: 5px;" title="\u6DFB\u52A0\u591A\u4E2A\u7528\u6237\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">\n    <input name="addFollowUser" style="width: 200px;" type="text">\n    <a class="pd_btn_link" data-name="add" href="#">\u6DFB\u52A0</a>\n  </div>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a data-name="openImOrExFollowUserListDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u5173\u6CE8\u7528\u6237</a></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '关注用户', html);
    var $followUserList = $dialog.find('#pdFollowUserList');

    /**
     * 添加关注用户
     * @param {string} name 用户名
     */
    var addFollowUser = function addFollowUser(name) {
        $('\n<li>\n  <input type="checkbox">\n  <input name="username" type="text" style="width: 178px; margin-left: 5px;" maxlength="15" value="' + name + '">\n  <a class="pd_btn_link" data-name="delete" href="#">\u5220\u9664</a>\n</li>\n').appendTo($followUserList);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.highlightFollowUserThreadInHPEnabled = $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked');
        Config.highlightFollowUserThreadLinkEnabled = $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked');
        Config.followUserList = [];
        $followUserList.find('li').each(function () {
            var $this = $(this);
            var name = $.trim($this.find('[name="username"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                Config.followUserList.push({ name: name });
            }
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $followUserList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="selectAll"]').click(function () {
        return Util.selectAll($followUserList.find('[type="checkbox"]'));
    }).end().find('[data-name="selectInverse"]').click(function () {
        return Util.selectInverse($followUserList.find('[type="checkbox"]'));
    }).end().find('[data-name="deleteSelect"]').click(function (e) {
        e.preventDefault();
        var $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
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
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = $.trim($dialog.find('[name="addFollowUser"]').val()).split(',')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var name = _step4.value;

                name = $.trim(name);
                if (!name) continue;
                if (Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                    addFollowUser(name);
                }
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
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
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = Config.followUserList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var user = _step5.value;

            addFollowUser(user.name);
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    Dialog.show(dialogName);
};

/**
 * 显示屏蔽用户对话框
 */
var showBlockUserDialog = function showBlockUserDialog() {
    var dialogName = 'pdBlockUserDialog';
    if ($('#' + dialogName).length > 0) return;
    var html = '\n<div class="pd_cfg_main">\n  <div style="margin-top: 5px; line-height: 24px;">\n    <label>\n      \u9ED8\u8BA4\u5C4F\u853D\u7C7B\u578B\n      <select name="blockUserDefaultType">\n        <option value="0">\u5C4F\u853D\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4EC5\u5C4F\u853D\u4E3B\u9898</option><option value="2">\u4EC5\u5C4F\u853D\u56DE\u5E16</option>\n      </select>\n    </label>\n    <label class="pd_cfg_ml">\n      <input name="blockUserAtTipsEnabled" type="checkbox"> \u5C4F\u853D@\u63D0\u9192 <span class="pd_cfg_tips" title="\u5C4F\u853D\u88AB\u5C4F\u853D\u7528\u6237\u7684@\u63D0\u9192">[?]</span>\n    </label><br>\n    <label>\u7248\u5757\u5C4F\u853D\u8303\u56F4\n      <select name="blockUserForumType">\n        <option value="0">\u6240\u6709\u7248\u5757</option><option value="1">\u5305\u62EC\u6307\u5B9A\u7248\u5757</option><option value="2">\u6392\u9664\u6307\u5B9A\u7248\u5757</option>\n      </select>\n    </label><br>\n    <label>\u7248\u5757ID\u5217\u8868\n      <input name="blockUserFidList" type="text" style="width: 220px;"> \n      <span class="pd_cfg_tips" title="\u7248\u5757URL\u4E2D\u7684fid\u53C2\u6570\uFF0C\u591A\u4E2AID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">[?]</span>\n    </label>\n  </div>\n  <ul id="pdBlockUserList" style="margin-top: 5px; min-width: 362px; line-height: 24px;"></ul>\n  <div style="margin-top: 5px;">\n    <div style="display: inline-block;">\n      <a class="pd_btn_link" data-name="selectAll" href="#">\u5168\u9009</a>\n      <a class="pd_btn_link" data-name="selectInverse" href="#">\u53CD\u9009</a>\n    </div>\n    <div style="float: right;">\n      <a class="pd_btn_link" data-name="modify" href="#">\u4FEE\u6539\u4E3A</a>\n      <select>\n        <option value="0">\u5C4F\u853D\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4EC5\u5C4F\u853D\u4E3B\u9898</option><option value="2">\u4EC5\u5C4F\u853D\u56DE\u5E16</option>\n      </select>\n      <a class="pd_btn_link" data-name="deleteSelect" href="#">\u5220\u9664</a>\n    </div>\n  </div>\n  <div style="margin-top: 5px;" title="\u6DFB\u52A0\u591A\u4E2A\u7528\u6237\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">\n    <input name="addBlockUser" style="width: 200px;" type="text">\n    <a class="pd_btn_link" data-name="add" href="#">\u6DFB\u52A0</a>\n  </div>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a data-name="openImOrExBlockUserListDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u5C4F\u853D\u7528\u6237</a></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '屏蔽用户', html);
    var $blockUserList = $dialog.find('#pdBlockUserList');

    /**
     * 添加屏蔽用户
     * @param {string} name 用户名
     * @param {number} type 屏蔽类型
     */
    var addBlockUser = function addBlockUser(name, type) {
        $('\n<li>\n  <input type="checkbox">\n  <input name="username" type="text" style="width: 150px; margin-left: 5px;" maxlength="15" value="' + name + '">\n  <select name="blockType" style="margin-left: 5px;">\n    <option value="0">\u5C4F\u853D\u4E3B\u9898\u548C\u56DE\u5E16</option><option value="1">\u4EC5\u5C4F\u853D\u4E3B\u9898</option><option value="2">\u4EC5\u5C4F\u853D\u56DE\u5E16</option>\n  </select>\n  <a class="pd_btn_link" data-name="delete" href="#">\u5220\u9664</a>\n</li>').appendTo($blockUserList).find('[name="blockType"]').val(type);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.blockUserDefaultType = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        Config.blockUserAtTipsEnabled = $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked');
        Config.blockUserForumType = parseInt($dialog.find('[name="blockUserForumType"]').val());
        var blockUserFidList = new Set();
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = $.trim($dialog.find('[name="blockUserFidList"]').val()).split(',')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var fid = _step6.value;

                fid = parseInt(fid);
                if (!isNaN(fid) && fid > 0) blockUserFidList.add(fid);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        Config.blockUserFidList = [].concat(_toConsumableArray(blockUserFidList));
        Config.blockUserList = [];
        $blockUserList.find('li').each(function () {
            var $this = $(this);
            var name = $.trim($this.find('[name="username"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                var type = parseInt($this.find('[name="blockType"]').val());
                Config.blockUserList.push({ name: name, type: type });
            }
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $blockUserList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="selectAll"]').click(function () {
        return Util.selectAll($blockUserList.find('input[type="checkbox"]'));
    }).end().find('[data-name="selectInverse"]').click(function () {
        return Util.selectInverse($blockUserList.find('input[type="checkbox"]'));
    }).end().find('[data-name="modify"]').click(function (e) {
        e.preventDefault();
        var value = $(this).next('select').val();
        $blockUserList.find('li:has([type="checkbox"]:checked) > select').val(value);
    }).end().find('[data-name="deleteSelect"]').click(function (e) {
        e.preventDefault();
        var $checked = $blockUserList.find('li:has([type="checkbox"]:checked)');
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
        var type = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = $.trim($dialog.find('[name="addBlockUser"]').val()).split(',')[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var name = _step7.value;

                name = $.trim(name);
                if (!name) continue;
                if (Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                    addBlockUser(name, type);
                }
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
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
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = Config.blockUserList[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var user = _step8.value;

            addBlockUser(user.name, user.type);
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }

    Dialog.show(dialogName);
};

/**
 * 显示屏蔽帖子对话框
 */
var showBlockThreadDialog = function showBlockThreadDialog() {
    var dialogName = 'pdBlockThreadDialog';
    if ($('#' + dialogName).length > 0) return;
    var html = '\n<div class="pd_cfg_main">\n  <div style="border-bottom: 1px solid #9191ff; margin-bottom: 7px; padding-bottom: 5px;">\n    \u6807\u9898\u5173\u952E\u5B57\u53EF\u4F7F\u7528\u666E\u901A\u5B57\u7B26\u4E32\u6216\u6B63\u5219\u8868\u8FBE\u5F0F\uFF0C\u6B63\u5219\u8868\u8FBE\u5F0F\u8BF7\u4F7F\u7528<code>/abc/</code>\u7684\u683C\u5F0F\uFF0C\u4F8B\uFF1A<code>/\u5173\u952E\u5B57A.*\u5173\u952E\u5B57B/i</code><br>\n    \u7528\u6237\u540D\u548C\u7248\u5757ID\u4E3A\u53EF\u9009\u9879\uFF08\u591A\u4E2A\u7528\u6237\u540D\u6216\u7248\u5757ID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\uFF09<br>\n    <label>\n      \u9ED8\u8BA4\u7248\u5757\u5C4F\u853D\u8303\u56F4\n      <select name="blockThreadDefForumType">\n        <option value="0">\u6240\u6709\u7248\u5757</option><option value="1">\u5305\u62EC\u6307\u5B9A\u7248\u5757</option><option value="2">\u6392\u9664\u6307\u5B9A\u7248\u5757</option>\n      </select>\n    </label>\n    <label style="margin-left: 5px;">\u9ED8\u8BA4\u7248\u5757ID\u5217\u8868 <input name="blockThreadDefFidList" type="text" style="width: 150px;"></label>\n  </div>\n  <table id="pdBlockThreadList" style="line-height: 22px; text-align: center;">\n    <tbody>\n      <tr>\n        <th style="width: 220px;">\u6807\u9898\u5173\u952E\u5B57(\u5FC5\u586B)</th>\n        <th style="width: 62px;">\u5C4F\u853D\u7528\u6237</th>\n        <th style="width: 200px;">\u7528\u6237\u540D <span class="pd_cfg_tips" title="\u591A\u4E2A\u7528\u6237\u540D\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">[?]</span></th>\n        <th style="width: 62px;">\u5C4F\u853D\u8303\u56F4</th>\n        <th style="width: 132px;">\u7248\u5757ID <span class="pd_cfg_tips" title="\u7248\u5757URL\u4E2D\u7684fid\u53C2\u6570\uFF0C\u591A\u4E2AID\u8BF7\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694">[?]</span></th>\n        <th style="width: 35px;"></th>\n      </tr>\n    </tbody>\n  </table>\n  <div data-name="blockThreadAddBtns" style="margin-top: 5px;">\n    <a class="pd_btn_link" data-name="addOne" href="#">\u589E\u52A01\u4E2A</a>\n    <a class="pd_btn_link" data-name="addFive" href="#">\u589E\u52A05\u4E2A</a>\n    <a class="pd_btn_link pd_highlight" data-name="clear" href="#">\u6E05\u9664\u6240\u6709</a>\n  </div>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a data-name="openImOrExBlockThreadListDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u5C4F\u853D\u5E16\u5B50</a></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '屏蔽帖子', html, 'width: 768px;');
    var $blockThreadList = $dialog.find('#pdBlockThreadList');

    /**
     * 添加屏蔽帖子
     * @param {string} keyWord 标题关键字
     * @param {number} userType 屏蔽用户，0：所有；1：包括；2：排除
     * @param {string[]} userList 用户名
     * @param {number} fidType 屏蔽范围，0：所有；1：包括；2：排除
     * @param {number[]} fidList 版块ID列表
     */
    var addBlockThread = function addBlockThread(keyWord, userType, userList, fidType, fidList) {
        $('\n<tr>\n  <td><input name="keyWord" type="text" style="width: 208px;" value="' + keyWord + '"></td>\n  <td><select name="userType"><option value="0">\u6240\u6709</option><option value="1">\u5305\u62EC</option><option value="2">\u6392\u9664</option></select></td>\n  <td><input name="userList" type="text" style="width: 188px;" value="' + userList.join(',') + '" ' + (userType === 0 ? 'disabled' : '') + '></td>\n  <td><select name="fidType"><option value="0">\u6240\u6709</option><option value="1">\u5305\u62EC</option><option value="2">\u6392\u9664</option></select></td>\n  <td><input name="fidList" type="text" style="width: 120px;" value="' + fidList.join(',') + '" ' + (fidType === 0 ? 'disabled' : '') + '></td>\n  <td><a href="#" data-name="delete">\u5220\u9664</a></td>\n</tr>\n').appendTo($blockThreadList).find('[name="userType"]').val(userType).end().find('[name="fidType"]').val(fidType);
    };

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    var verify = function verify() {
        var flag = true;
        $blockThreadList.find('tr:gt(0)').each(function () {
            var $this = $(this);
            var $txtKeyWord = $this.find('[name="keyWord"]');
            var keyWord = $txtKeyWord.val();
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
        var blockThreadDefFidList = new Set();
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var fid = _step9.value;

                fid = parseInt(fid);
                if (!isNaN(fid) && fid > 0) blockThreadDefFidList.add(fid);
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }

        Config.blockThreadDefFidList = [].concat(_toConsumableArray(blockThreadDefFidList));
        Config.blockThreadList = [];
        $blockThreadList.find('tr:gt(0)').each(function () {
            var $this = $(this);
            var keyWord = $this.find('[name="keyWord"]').val();
            if ($.trim(keyWord) === '') return;
            var newObj = { keyWord: keyWord };

            var userType = parseInt($this.find('[name="userType"]').val());
            if (userType > 0) {
                var userList = new Set();
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = $.trim($this.find('[name="userList"]').val()).split(',')[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var user = _step10.value;

                        user = $.trim(user);
                        if (user) userList.add(user);
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }

                if (userList.size > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = [].concat(_toConsumableArray(userList));
            }

            var fidType = parseInt($this.find('[name="fidType"]').val());
            if (fidType > 0) {
                var fidList = new Set();
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = $.trim($this.find('[name="fidList"]').val()).split(',')[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var fid = _step11.value;

                        fid = parseInt(fid);
                        if (!isNaN(fid) && fid > 0) fidList.add(fid);
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }

                if (fidList.size > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = [].concat(_toConsumableArray(fidList));
            }
            Config.blockThreadList.push(newObj);
        });
        (0, _Config.write)();
        Dialog.close(dialogName);
    });

    $blockThreadList.on('change', 'select', function () {
        var $this = $(this);
        $this.parent('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove();
    });

    $dialog.find('[data-name="addOne"], [data-name="addFive"]').click(function (e) {
        e.preventDefault();
        var num = 1;
        if ($(this).is('[data-name="addFive"]')) num = 5;
        for (var i = 1; i <= num; i++) {
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
    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
        for (var _iterator12 = Config.blockThreadList[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var data = _step12.value;
            var keyWord = data.keyWord,
                includeUser = data.includeUser,
                excludeUser = data.excludeUser,
                includeFid = data.includeFid,
                excludeFid = data.excludeFid;

            var userType = 0;
            var userList = [];
            if (typeof includeUser !== 'undefined') {
                userType = 1;
                userList = includeUser;
            } else if (typeof excludeUser !== 'undefined') {
                userType = 2;
                userList = excludeUser;
            }

            var fidType = 0;
            var fidList = [];
            if (typeof includeFid !== 'undefined') {
                fidType = 1;
                fidList = includeFid;
            } else if (typeof excludeFid !== 'undefined') {
                fidType = 2;
                fidList = excludeFid;
            }
            addBlockThread(keyWord, userType, userList, fidType, fidList);
        }
    } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
            }
        } finally {
            if (_didIteratorError12) {
                throw _iteratorError12;
            }
        }
    }

    Dialog.show(dialogName);
};

},{"./Config":4,"./Const":6,"./Dialog":7,"./Info":9,"./Public":18,"./Script":20,"./TmpLog":21,"./Util":22}],6:[function(require,module,exports){
/* 常量模块 */
'use strict';

// 通用存储数据名称前缀

Object.defineProperty(exports, "__esModule", {
    value: true
});
var storagePrefix = 'pd_';

/**
 * 常量类
 */
var Const = {
    // 开启调试模式，true：开启；false：关闭
    debug: false,

    // UTC时间与论坛时间之间的时差（小时）
    forumTimezoneOffset: -8,
    // KFB捐款额度的最大值
    maxDonationKfb: 5000,
    // 在当天的指定时间之后领取每日奖励（北京时间），例：00:35:00
    getDailyBonusAfterTime: '00:35:00',
    // 在当天的指定时间之后进行自动争夺（北京时间），例：00:10:00
    lootAfterTime: '00:10:00',
    // 遭遇敌人统计的指定最近层数
    enemyStatLatestLevelNum: 10,
    // 获取自定义的争夺点数分配方案（函数），参考范例见：read.php?tid=500968&spid=13270735
    getCustomPoints: null,

    // 定时操作结束后的再判断间隔（秒），用于在定时模式中进行下一次定时时间的再判断
    actionFinishRetryInterval: 30,
    // 在连接超时的情况下获取剩余时间失败后的重试间隔（分钟），用于定时模式
    errorRefreshInterval: 1,
    // 在网页标题上显示定时模式提示的更新间隔（分钟）
    showRefreshModeTipsInterval: 1,
    // 领取每日争夺奖励时，遇见所设定的任务未完成时的重试间隔（分钟）
    getDailyBonusSpecialInterval: 30,
    // 争夺攻击进行中的有效期（分钟）
    lootAttackingExpires: 10,
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
    // 特殊情况下的ajax请求（如使用、恢复、购买道具等）的时间间隔（毫秒），可设置为函数来返回值
    specialAjaxInterval: function specialAjaxInterval() {
        if (Config.simulateManualHandleItemEnabled) return Math.floor(Math.random() * 4000) + 2000; // 模拟手动时的情况
        else return Math.floor(Math.random() * 150) + 200; // 正常情况
    },

    // 循环使用道具中每轮第一次ajax请求的时间间隔（毫秒），可设置为函数来返回值
    cycleUseItemsFirstAjaxInterval: function cycleUseItemsFirstAjaxInterval() {
        return Math.floor(Math.random() * 250) + 2000;
    },

    // 每次争夺攻击的时间间隔（毫秒），可设置为函数来返回值
    lootAttackInterval: function lootAttackInterval() {
        if (Config.slowAttackEnabled) return Math.floor(Math.random() * 2000) + 4000; // 慢速情况
        else return Math.floor(Math.random() * 200) + 200; // 正常情况
    },

    // 银行相关操作的时间间隔（毫秒）
    bankActionInterval: 5000,

    // 购买帖子提醒的最低售价（KFB）
    minBuyThreadWarningSell: 6,
    // 统计楼层最大能访问的帖子页数
    statFloorMaxPage: 300,
    // 自助评分错标范围百分比
    ratingErrorSizePercent: 3,
    // 自定义侧边栏导航内容
    // 格式：'<li><a href="导航链接">导航项名称</a></li>'
    customSideBarContent: '',
    // 自定义侧边栏导航内容（手机平铺样式）
    // 格式：'<a href="导航链接1">导航项名称1</a> | <a href="导航链接2">导航项名称2</a><br>'，换行：'<br>'
    customTileSideBarContent: '',

    // 通用存储数据名称前缀
    storagePrefix: storagePrefix,
    // 存储多重引用数据的LocalStorage名称
    multiQuoteStorageName: storagePrefix + 'multiQuote',
    // 保存发帖内容的SessionStorage名称
    postContentStorageName: storagePrefix + 'postContent',
    // 存储临时点数分配记录列表的SessionStorage名称
    tempPointsLogListStorageName: storagePrefix + 'tempPointsLogList',

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
    // 标记已领取每日奖励的Cookie名称
    getDailyBonusCookieName: 'getDailyBonus',
    // 标记正在检查争夺情况的Cookie名称
    lootCheckingCookieName: 'lootChecking',
    // 标记正在进行争夺攻击的Cookie名称
    lootAttackingCookieName: 'lootAttacking',
    // 标记已完成自动争夺的Cookie名称
    lootCompleteCookieName: 'lootComplete',
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
var create = exports.create = function create(id, title, content) {
    var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    var html = '\n<form>\n<div class="pd_cfg_box" id="' + id + '" style="' + style + '">\n  <h1>' + title + '<span data-action="close">&times;</span></h1>\n  ' + content + '\n</div>\n</form>';
    var $dialog = $(html).appendTo('body');
    $dialog.on('click', '.pd_cfg_tips', function (e) {
        if (_Info2.default.isMobile) Public.showElementTitleTips(e, this.title);
        return false;
    }).on('click', 'a.pd_disabled_link', function () {
        return false;
    }).on('click', '[data-action="close"]', function () {
        return close(id);
    }).keydown(function (e) {
        if (e.keyCode === 27) {
            return close(id);
        }
    }).find('legend [type="checkbox"]').click(function () {
        var $this = $(this);
        var checked = $this.prop('checked');
        if (Util.isOpera() || Util.isEdge()) $this.closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);else $this.closest('fieldset').prop('disabled', !checked);
    }).end().find('input[data-disabled]').click(function () {
        var $this = $(this);
        var checked = $this.prop('checked');
        $($this.data('disabled')).each(function () {
            var $this = $(this);
            if ($this.is('a')) {
                if (checked) $this.removeClass('pd_disabled_link');else $this.addClass('pd_disabled_link');
            } else {
                $this.prop('disabled', !checked);
            }
        });
    });
    if (!_Info2.default.isMobile) {
        $(window).on('resize.' + id, function () {
            return resize(id);
        });
    }
    return $dialog;
};

/**
 * 显示或调整对话框
 * @param {string} id 对话框ID
 */
var show = exports.show = function show(id) {
    var $dialog = $('#' + id);
    if (!$dialog.length) return;
    $dialog.find('legend [type="checkbox"]').each(function () {
        $(this).triggerHandler('click');
    }).end().find('input[data-disabled]').each(function () {
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
var resize = exports.resize = function resize(id) {
    var $dialog = $('#' + id);
    var windowHeight = $(window).height();
    $dialog.find('.pd_cfg_main').css('max-height', windowHeight - 80);
    var dialogWidth = $dialog.outerWidth(),
        windowWidth = $(window).width();
    var left = windowWidth / 2 - dialogWidth / 2;
    if (left + dialogWidth > windowWidth) left = windowWidth - dialogWidth - 20;
    if (left < 0) left = 0;
    var top = windowHeight / 2 - $dialog.outerHeight() / 2;
    if (top < 0) top = 0;
    $dialog.css({ top: top, left: left });
};

/**
 * 关闭对话框
 * @param {string} id 对话框ID
 * @returns {boolean} 返回false
 */
var close = exports.close = function close(id) {
    $('#' + id).fadeOut('fast', function () {
        $(this).parent('form').remove();
    });
    if (!_Info2.default.isMobile) {
        $(window).off('resize.' + id);
    }
    return false;
};

},{"./Info":9,"./Public":18,"./Util":22}],8:[function(require,module,exports){
/* 首页模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleIndexPersonalInfo = exports.addSearchTypeSelectBox = exports.showVipSurplusTime = exports.addThreadFastGotoLink = exports.smRankChangeAlert = exports.smLevelUpAlert = exports.handleAtTips = undefined;

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
var handleAtTips = exports.handleAtTips = function handleAtTips() {
    var type = Config.atTipsHandleType;
    if (type === 'default') return;
    var $atTips = $('a[href^="guanjianci.php?gjc="]');
    var noHighlight = function noHighlight() {
        return $atTips.removeClass('indbox5').addClass('indbox6');
    };
    var hideBox = function hideBox() {
        return $atTips.parent().next('div.line').addBack().remove();
    };
    var handleBox = noHighlight;
    if (type === 'hide_box_1' || type === 'hide_box_2') handleBox = hideBox;
    if (['no_highlight', 'no_highlight_extra', 'hide_box_1', 'at_change_to_cao'].includes(type)) {
        if ($atTips.length > 0) {
            (function () {
                var cookieText = Util.getCookie(_Const2.default.hideReadAtTipsCookieName);
                var atTipsText = $.trim($atTips.text());
                var matches = /\d+日\d+时\d+分/.exec(atTipsText);
                if (matches) atTipsText = matches[0];
                if (cookieText && cookieText === atTipsText) {
                    handleBox();
                } else {
                    $atTips.click(function () {
                        var $this = $(this);
                        if ($this.data('disabled')) return;
                        var cookieText = Util.getCookie(_Const2.default.hideReadAtTipsCookieName);
                        if (!cookieText) {
                            var curDate = new Date().getDate().toString();
                            Util.setCookie(_Const2.default.prevReadAtTipsCookieName, curDate.padStart(2, '0') + '日00时00分');
                        } else if (cookieText !== atTipsText) {
                            Util.setCookie(_Const2.default.prevReadAtTipsCookieName, cookieText);
                        }
                        Util.setCookie(_Const2.default.hideReadAtTipsCookieName, atTipsText, Util.getDate('+' + _Const2.default.hideMarkReadAtTipsExpires + 'd'));
                        $this.data('disabled', true);
                        handleBox();
                    });
                }
                if (type === 'at_change_to_cao') {
                    $atTips.text($atTips.text().replace('@', '艹'));
                }
            })();
        } else if (!$atTips.length && (type === 'no_highlight_extra' || type === 'at_change_to_cao')) {
            var html = '\n<div style="width: 300px;">\n  <a class="indbox6" href="guanjianci.php?gjc=' + _Info2.default.userName + '" target="_blank">\u6700\u8FD1\u65E0\u4EBA' + (type === 'at_change_to_cao' ? '艹' : '@') + '\u4F60</a><br>\n  <div class="line"></div>\n  <div class="c"></div>\n</div>\n<div class="line"></div>';
            $('a[href="kf_givemekfb.php"][title="网站虚拟货币"]').parent().before(html);
        }
    } else if (type === 'hide_box_2') {
        if ($atTips.length > 0) handleBox();
    }
};

/**
 * 在神秘等级升级后进行提醒
 */
var smLevelUpAlert = exports.smLevelUpAlert = function smLevelUpAlert() {
    var smLevel = parseInt($('a[href="kf_growup.php"]').data('smLevel'));
    if (!smLevel) return;

    /**
     * 写入神秘等级数据
     * @param {number} smLevel 神秘等级
     */
    var writeData = function writeData(smLevel) {
        TmpLog.setValue(_Const2.default.smLevelUpTmpLogName, { time: new Date().getTime(), smLevel: smLevel });
    };

    var data = TmpLog.getValue(_Const2.default.smLevelUpTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smLevel) !== 'number') {
        writeData(smLevel);
    } else if (smLevel > data.smLevel) {
        var diff = Math.floor((new Date().getTime() - data.time) / 60 / 60 / 1000);
        if (diff >= _Const2.default.smLevelUpAlertInterval) {
            var date = new Date(data.time);
            writeData(smLevel);
            Log.push('神秘等级升级', '\u81EA`' + Util.getDateString(date) + '`\u4EE5\u6765\uFF0C\u4F60\u7684\u795E\u79D8\u7B49\u7EA7\u5171\u4E0A\u5347\u4E86`' + (smLevel - data.smLevel) + '`\u7EA7 (Lv.`' + data.smLevel + '`->Lv.`' + smLevel + '`)');
            Msg.show('\u81EA<em>' + Util.getDateString(date) + '</em>\u4EE5\u6765\uFF0C\u4F60\u7684\u795E\u79D8\u7B49\u7EA7\u5171\u4E0A\u5347\u4E86<em>' + (smLevel - data.smLevel) + '</em>\u7EA7');
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
var smRankChangeAlert = exports.smRankChangeAlert = function smRankChangeAlert() {
    var smRank = $('a[href="kf_growup.php"]').data('smRank');
    if (!smRank || smRank.endsWith('+')) return;
    smRank = parseInt(smRank);

    /**
     * 写入神秘系数排名数据
     * @param {number} smRank 神秘系数排名
     */
    var writeData = function writeData(smRank) {
        return TmpLog.setValue(_Const2.default.smRankChangeTmpLogName, { time: new Date().getTime(), smRank: smRank });
    };

    var data = TmpLog.getValue(_Const2.default.smRankChangeTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smRank) !== 'number') {
        writeData(smRank);
    } else if (smRank !== data.smRank) {
        var diff = Math.floor((new Date().getTime() - data.time) / 60 / 60 / 1000);
        if (diff >= _Const2.default.smRankChangeAlertInterval) {
            var date = new Date(data.time);
            var isUp = smRank < data.smRank;
            writeData(smRank);
            Log.push('神秘系数排名变化', '\u81EA`' + Util.getDateString(date) + '`\u4EE5\u6765\uFF0C\u4F60\u7684\u795E\u79D8\u7CFB\u6570\u6392\u540D\u5171`' + (isUp ? '上升' : '下降') + '`\u4E86`' + Math.abs(smRank - data.smRank) + '`\u540D ' + ('(No.`' + data.smRank + '`->No.`' + smRank + '`)'));
            Msg.show('\u81EA<em>' + Util.getDateString(date) + '</em>\u4EE5\u6765\uFF0C\u4F60\u7684\u795E\u79D8\u7CFB\u6570\u6392\u540D\u5171<b style="color: ' + (isUp ? '#F00' : '#393') + '">' + (isUp ? '上升' : '下降') + '</b>\u4E86' + ('<em>' + Math.abs(smRank - data.smRank) + '</em>\u540D'));
        } else if (diff < 0) {
            writeData(smRank);
        }
    }
};

/**
 * 在首页帖子链接旁添加快速跳转至页末的链接
 */
var addThreadFastGotoLink = exports.addThreadFastGotoLink = function addThreadFastGotoLink() {
    $('.index1').on('mouseenter', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        var $this = $(this);
        $this.css('position', 'relative').prepend('<a class="pd_thread_goto" href="' + $this.find('a').attr('href') + '&page=e#a">&raquo;</a>');
    }).on('mouseleave', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        $(this).css('position', 'static').find('.pd_thread_goto').remove();
    });
};

/**
 * 在首页显示VIP剩余时间
 */
var showVipSurplusTime = exports.showVipSurplusTime = function showVipSurplusTime() {
    /**
     * 添加VIP剩余时间的提示
     * @param {number} hours VIP剩余时间（小时）
     */
    var addVipHoursTips = function addVipHoursTips(hours) {
        $('a[href="kf_growup.php"]').parent().after('<div class="line"></div><div style="width: 300px;"><a href="kf_vmember.php" class="indbox' + (hours > 0 ? 5 : 6) + '">VIP\u4F1A\u5458 ' + ('(' + (hours > 0 ? '剩余' + hours + '小时' : '参与论坛获得的额外权限') + ')</a><div class="c"></div></div>'));
    };

    var vipHours = parseInt(Util.getCookie(_Const2.default.vipSurplusTimeCookieName));
    if (isNaN(vipHours) || vipHours < 0) {
        console.log('检查VIP剩余时间Start');
        $.get('kf_vmember.php?t=' + new Date().getTime(), function (html) {
            var hours = 0;
            var matches = /我的VIP剩余时间\s*<b>(\d+)<\/b>\s*小时/i.exec(html);
            if (matches) hours = parseInt(matches[1]);
            Util.setCookie(_Const2.default.vipSurplusTimeCookieName, hours, Util.getDate('+' + _Const2.default.vipSurplusTimeExpires + 'm'));
            addVipHoursTips(hours);
        });
    } else {
        addVipHoursTips(vipHours);
    }
};

/**
 * 在首页上添加搜索类型选择框
 */
var addSearchTypeSelectBox = exports.addSearchTypeSelectBox = function addSearchTypeSelectBox() {
    var $form = $('form[action="search.php?"]');
    $form.attr('name', 'pdSearchForm');
    var $keyWord = $form.find('[type="text"][name="keyword"]');
    $keyWord.css('width', '116px');
    $('<div class="pd_search_type"><span>标题</span><i>&#8744;</i></div>').insertAfter($keyWord);
};

/**
 * 处理首页个人信息
 */
var handleIndexPersonalInfo = exports.handleIndexPersonalInfo = function handleIndexPersonalInfo() {
    var $kfb = $('a[href="kf_givemekfb.php"]');
    var matches = /拥有(-?\d+)KFB/.exec($kfb.text());
    if (matches) {
        var kfb = parseInt(matches[1]);
        $kfb.html('\u62E5\u6709<b>' + kfb.toLocaleString() + '</b>KFB').data('kfb', kfb);
    }

    var $smLevel = $('a[href="kf_growup.php"]');
    matches = /神秘(-?\d+)级 \(系数排名第\s*(\d+\+?)\s*位/.exec($smLevel.text());
    if (matches) {
        var smLevel = parseInt(matches[1]);
        var smRank = matches[2];
        $smLevel.html('\u795E\u79D8<b>' + smLevel + '</b>\u7EA7 (\u7CFB\u6570\u6392\u540D\u7B2C<b style="color: #00f;">' + smRank + '</b>\u4F4D)').data('smLevel', smLevel).data('smRank', smRank);
    }
};

},{"./Const":6,"./Info":9,"./Log":11,"./Msg":15,"./TmpLog":21,"./Util":22}],9:[function(require,module,exports){
/* 信息模块 */
'use strict';

/**
 * 信息类
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Info = {
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

},{}],10:[function(require,module,exports){
/* 道具模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideItemTypes = exports.addBatchUseItemsButton = exports.addBatchBuyItemsLink = exports.getItemUsedInfo = exports.enhanceMyItemsPage = exports.addBatchUseAndConvertOldItemTypesButton = exports.getLevelByName = exports.itemTypeList = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 道具种类列表
 */
var itemTypeList = exports.itemTypeList = ['零时迷子的碎片', '被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画', '十六夜同人漫画', '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药'];

/**
 * 获得转换指定等级道具可获得的能量点
 * @param {number} itemLevel 道具等级
 * @returns {number} 能量点
 */
var getGainEnergyNumByLevel = function getGainEnergyNumByLevel(itemLevel) {
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
var getRestoreEnergyNumByLevel = function getRestoreEnergyNumByLevel(itemLevel) {
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
 * 获取指定名称的道具等级
 * @param {string} itemName 道具名称
 * @returns {number} 道具等级
 */
var getLevelByName = exports.getLevelByName = function getLevelByName(itemName) {
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
var getMaxUsedNumByName = function getMaxUsedNumByName(itemName) {
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
var getCreditsViaResponse = function getCreditsViaResponse(response, itemTypeId) {
    if (/(错误的物品编号|无法再使用|该道具已经被使用)/.test(response)) {
        return -1;
    }
    if (itemTypeId >= 7 && itemTypeId <= 12) {
        if (/成功！/.test(response)) return { '有效道具': 1 };else return { '无效道具': 1 };
    } else {
        var matches = /恢复能量增加了\s*(\d+)\s*点/.exec(response);
        if (matches) return { '能量': parseInt(matches[1]) };
        matches = /(\d+)KFB/.exec(response);
        if (matches) return { 'KFB': parseInt(matches[1]) };
        matches = /(\d+)点?贡献/.exec(response);
        if (matches) return { '贡献': parseInt(matches[1]) };
        matches = /贡献\+(\d+)/.exec(response);
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
var getItemIdList = function getItemIdList(html) {
    var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var itemIdList = [];
    var matches = html.match(/kf_fw_ig_my\.php\?pro=\d+/g);
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            if (num > 0 && i + 1 > num) break;
            var itemIdMatches = /pro=(\d+)/i.exec(matches[i]);
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
var useOldItems = function useOldItems(options, cycle) {
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
            console.log('\u5FAA\u73AF\u4F7F\u7528\u9053\u5177Start\uFF0C\u4F7F\u7528\u9053\u5177\u6570\u91CF\uFF1A' + cycle.itemNum + '\uFF0C\u6709\u6548\u9053\u5177\u4F7F\u7528\u6B21\u6570\u4E0A\u9650\uFF1A' + (cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制') + '\uFF0C' + ('\u6062\u590D\u9053\u5177\u6210\u529F\u6B21\u6570\u4E0A\u9650\uFF1A' + (cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制')));
            $('.kf_fw_ig1:last').parent().append('\n<ul class="pd_result">\n  <li class="pd_stat">\n    <strong>\n    \u5BF9<em>' + cycle.itemNum + '</em>\u4E2A\u3010Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '\u3011\u9053\u5177\u7684\u5FAA\u73AF\u4F7F\u7528\u5F00\u59CB\uFF08\u5F53\u524D\u9053\u5177\u6062\u590D\u80FD\u91CF<em>' + cycle.totalEnergyNum + '</em>\u70B9\uFF09<br>\n    \uFF08\u6709\u6548\u9053\u5177\u4F7F\u7528\u6B21\u6570\u4E0A\u9650\uFF1A<em>' + (cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制') + '</em>\uFF0C\n    \u6062\u590D\u9053\u5177\u6210\u529F\u6B21\u6570\u4E0A\u9650\uFF1A<em>' + (cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制') + '</em>\uFF09\n    </strong>\n  </li>\n</ul>\n');
        } else {
            $('.pd_result:last').append('<div class="pd_result_sep"></div>');
        }
        $('.pd_result:last').append('<li class="pd_stat" style="color: #ff3399;"><strong>\u7B2C' + cycle.round + '\u8F6E\u5FAA\u73AF\u5F00\u59CB\uFF1A</strong></li>');
    }
    if (cycle) {
        $('.pd_result:last').append('<li><strong>使用结果：</strong></li>');
    } else {
        $('.kf_fw_ig1:last').parent().append('<ul class="pd_result"><li><strong>\u3010Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '\u3011\u4F7F\u7528\u7ED3\u679C\uFF1A</strong></li></ul>');
    }

    var successNum = 0,
        failNum = 0;
    var stat = { '有效道具': 0, '无效道具': 0 };
    var nextRoundItemIdList = [];
    var isStop = false;
    $(document).clearQueue('UseItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('UseItems', function () {
            $.ajax({
                type: 'GET',
                url: 'kf_fw_ig_doit.php?id=' + itemId + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success: function success(html) {
                    Public.showFormatLog('使用道具', html);

                    var _Util$getResponseMsg = Util.getResponseMsg(html),
                        type = _Util$getResponseMsg.type,
                        msg = _Util$getResponseMsg.msg;

                    if (type === 1 && !/(错误的物品编号|无法再使用|该道具已经被使用)/.test(msg)) {
                        successNum++;
                        nextRoundItemIdList.push(itemId);
                        var credits = getCreditsViaResponse(msg, settings.itemTypeId);
                        if (credits !== -1) {
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = Object.keys(credits)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var key = _step.value;

                                    if (typeof stat[key] === 'undefined') stat[key] = credits[key];else stat[key] += credits[key];
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        }
                    } else {
                        failNum++;
                        if (/无法再使用/.test(msg)) nextRoundItemIdList = [];
                    }
                    $('.pd_result:last').append('<li><b>\u7B2C' + (index + 1) + '\u6B21\uFF1A</b>' + msg + '</li>');
                    if (cycle && cycle.maxEffectiveItemCount && cycle.stat['有效道具'] + stat['有效道具'] >= cycle.maxEffectiveItemCount) {
                        isStop = true;
                        console.log('有效道具使用次数到达设定上限，循环使用操作停止');
                        $('.pd_result:last').append('<li><span class="pd_notice">（有效道具使用次数到达设定上限，循环操作中止）</span></li>');
                    }
                },
                error: function error() {
                    failNum++;
                },
                complete: function complete() {
                    var $countdown = $('.pd_countdown:last');
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
                            Log.push('使用道具', '\u5171\u6709`' + successNum + '`\u4E2A\u3010`Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '`\u3011\u9053\u5177\u88AB\u4F7F\u7528', {
                                gain: $.extend({}, stat, { '已使用道具': successNum }),
                                pay: { '道具': -successNum }
                            });
                        }
                        var logStat = '',
                            msgStat = '',
                            resultStat = '';
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = Object.keys(stat)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var type = _step2.value;

                                logStat += '\uFF0C' + type + '+' + stat[type];
                                msgStat += '<i>' + type + '<em>+' + stat[type] + '</em></i>';
                                resultStat += '<i>' + type + '<em>+' + stat[type] + '</em></i> ';
                                if (cycle) {
                                    if (typeof cycle.stat[type] === 'undefined') cycle.stat[type] = stat[type];else cycle.stat[type] += stat[type];
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        console.log('\u5171\u6709' + successNum + '\u4E2A\u9053\u5177\u88AB\u4F7F\u7528' + (failNum > 0 ? '\uFF0C\u5171\u6709' + failNum + '\u4E2A\u9053\u5177\u672A\u80FD\u4F7F\u7528' : '') + logStat);
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u88AB\u4F7F\u7528' + (failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u9053\u5177\u672A\u80FD\u4F7F\u7528' : '') + '</strong>' + msgStat, -1);
                        if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                        $('.pd_result:last').append('<li class="pd_stat"><b>\u7EDF\u8BA1\u7ED3\u679C\uFF08\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u88AB\u4F7F\u7528\uFF09\uFF1A</b><br>' + resultStat + '</li>');
                        setCurrentItemUsableAndUsedNum(settings.$itemLine, successNum, -successNum);
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
                        setTimeout(function () {
                            return $(document).dequeue('UseItems');
                        }, typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
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
var restoreItems = function restoreItems(options, cycle) {
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
    } else {
        $('.kf_fw_ig1:last').parent().append('<ul class="pd_result"><li><strong>\u3010Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '\u3011\u6062\u590D\u7ED3\u679C\uFF1A</strong></li></ul>');
    }

    var successNum = 0,
        failNum = 0,
        successEnergyNum = 0;
    var perEnergyNum = getRestoreEnergyNumByLevel(settings.itemLevel);
    var isStop = false;
    var nextRoundItemIdList = [];
    $(document).clearQueue('RestoreItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('RestoreItems', function () {
            $.ajax({
                type: 'GET',
                url: 'kf_fw_ig_doit.php?renew=' + settings.safeId + '&id=' + itemId + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success: function success(html) {
                    Public.showFormatLog('恢复道具', html);

                    var _Util$getResponseMsg2 = Util.getResponseMsg(html),
                        type = _Util$getResponseMsg2.type,
                        msg = _Util$getResponseMsg2.msg;

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
                    $('.pd_result:last').append('<li><b>\u7B2C' + (index + 1) + '\u6B21\uFF1A</b>' + msg + '</li>');
                },
                complete: function complete() {
                    var $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('RestoreItems');

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (!cycle && (successNum > 0 || failNum > 0)) {
                            Log.push('恢复道具', '\u5171\u6709`' + successNum + '`\u4E2A\u3010`Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '`\u3011\u9053\u5177\u6062\u590D\u6210\u529F\uFF0C\u5171\u6709`' + failNum + '`\u4E2A\u9053\u5177\u6062\u590D\u5931\u8D25', {
                                gain: { '道具': successNum },
                                pay: { '已使用道具': -(successNum + failNum), '能量': -successEnergyNum }
                            });
                        }
                        console.log('\u5171\u6709' + successNum + '\u4E2A\u9053\u5177\u6062\u590D\u6210\u529F\uFF0C\u5171\u6709' + failNum + '\u4E2A\u9053\u5177\u6062\u590D\u5931\u8D25\uFF0C\u80FD\u91CF-' + successEnergyNum);
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u6062\u590D\u6210\u529F\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u9053\u5177\u6062\u590D\u5931\u8D25</strong>' + ('<i>\u80FD\u91CF<ins>-' + successEnergyNum + '</ins></i>'), -1);
                        $('.pd_result:last').append('<li class="pd_stat">\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u6062\u590D\u6210\u529F\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u9053\u5177\u6062\u590D\u5931\u8D25\uFF0C' + ('<i>\u80FD\u91CF<ins>-' + successEnergyNum + '</ins></i></li>'));
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
                        setTimeout(function () {
                            return $(document).dequeue('RestoreItems');
                        }, typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
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
var cycleUseItems = function cycleUseItems(type, options, cycle) {
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

    var showResult = function showResult(type, stat) {
        var resultStat = '';
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Object.keys(stat)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var key = _step3.value;

                if (type > 0 && (key === '道具' || key === '已使用道具')) continue;
                resultStat += '<i>' + key + Util.getStatFormatNumber(cycle.stat[key]) + '</i> ';
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        $('.pd_result:last').append('\n<li class="pd_result_sep' + (type > 0 ? '_inner' : '') + '"></li>\n<li class="pd_stat">\n  <strong>\n    ' + (type > 0 ? '截至目前为止的统计' : '\u3010Lv.' + options.itemLevel + '\uFF1A' + options.itemName + '\u3011\u5FAA\u73AF\u4F7F\u7528\u6700\u7EC8\u7EDF\u8BA1') + '\uFF08\u5F53\u524D\u9053\u5177\u6062\u590D\u80FD\u91CF<em>' + cycle.totalEnergyNum + '</em>\u70B9\uFF09\uFF1A\n  </strong>\n</li>\n<li class="pd_stat">\n  ' + (type > 0 ? '' : '\u5171\u8FDB\u884C\u4E86<em>' + cycle.round + '</em>\u8F6E\u5FAA\u73AF\uFF1A') + '\n  <i>\u88AB\u4F7F\u7528\u6B21\u6570<em>+' + cycle.countStat['被使用次数'] + '</em></i>\n  <i>\u6062\u590D\u6210\u529F\u6B21\u6570<em>+' + cycle.countStat['恢复成功次数'] + '</em></i>\n  <i>\u6062\u590D\u5931\u8D25\u6B21\u6570<em>+' + cycle.countStat['恢复失败次数'] + '</em></i>\n</li>\n<li class="pd_stat">' + resultStat + '</li>\n');
    };

    if (type === 1) {
        showResult(type, cycle.stat);
        Msg.wait('<strong>\u6B63\u5728\u4F7F\u7528\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + options.itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
        setTimeout(function () {
            useOldItems(options, cycle);
        }, cycle.round === 1 ? 500 : typeof _Const2.default.cycleUseItemsFirstAjaxInterval === 'function' ? _Const2.default.cycleUseItemsFirstAjaxInterval() : _Const2.default.cycleUseItemsFirstAjaxInterval);
    } else if (type === 2) {
        Msg.wait('<strong>\u6B63\u5728\u6062\u590D\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + options.itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
        setTimeout(function () {
            return restoreItems(options, cycle);
        }, typeof _Const2.default.cycleUseItemsFirstAjaxInterval === 'function' ? _Const2.default.cycleUseItemsFirstAjaxInterval() : _Const2.default.cycleUseItemsFirstAjaxInterval);
    } else {
        if (cycle.stat['道具'] === 0) delete cycle.stat['道具'];
        if (cycle.stat['已使用道具'] === 0) delete cycle.stat['已使用道具'];
        if (cycle.stat['有效道具'] === 0) delete cycle.stat['有效道具'];
        if (cycle.stat['无效道具'] === 0) delete cycle.stat['无效道具'];
        var gain = {},
            pay = {};
        for (var key in cycle.stat) {
            if (cycle.stat[key] > 0) gain[key] = cycle.stat[key];else pay[key] = cycle.stat[key];
        }

        if (cycle.countStat['被使用次数'] > 0) {
            Log.push('循环使用道具', '\u5BF9`' + cycle.itemNum + '`\u4E2A\u3010`Lv.' + options.itemLevel + '\uFF1A' + options.itemName + '`\u3011\u9053\u5177\u8FDB\u884C\u4E86`' + cycle.round + '`\u8F6E\u5FAA\u73AF\u4F7F\u7528' + ('(\u88AB\u4F7F\u7528\u6B21\u6570`+' + cycle.countStat['被使用次数'] + '`\uFF0C\u6062\u590D\u6210\u529F\u6B21\u6570`+' + cycle.countStat['恢复成功次数'] + '`\uFF0C') + ('\u6062\u590D\u5931\u8D25\u6B21\u6570`+' + cycle.countStat['恢复失败次数'] + '`)'), { gain: gain, pay: pay });
        }

        console.log('\u5171\u8FDB\u884C\u4E86' + cycle.round + '\u8F6E\u5FAA\u73AF\uFF0C\u88AB\u4F7F\u7528\u6B21\u6570+' + cycle.countStat['被使用次数'] + '\uFF0C\u6062\u590D\u6210\u529F\u6B21\u6570+' + cycle.countStat['恢复成功次数'] + '\uFF0C' + ('\u6062\u590D\u5931\u8D25\u6B21\u6570+' + cycle.countStat['恢复失败次数'] + '\uFF0C\u80FD\u91CF' + cycle.stat['能量']));
        Msg.show('<strong>\u5171\u8FDB\u884C\u4E86<em>' + cycle.round + '</em>\u8F6E\u5FAA\u73AF</strong><i>\u88AB\u4F7F\u7528\u6B21\u6570<em>+' + cycle.countStat['被使用次数'] + '</em></i>' + ('<i>\u6062\u590D\u6210\u529F\u6B21\u6570<em>+' + cycle.countStat['恢复成功次数'] + '</em></i><i>\u6062\u590D\u5931\u8D25\u6B21\u6570<em>+' + cycle.countStat['恢复失败次数'] + '</em></i>') + ('<i>\u80FD\u91CF<ins>' + cycle.stat['能量'] + '</ins></i><a href="#">\u6E05\u9664\u6D88\u606F\u6846</a>'), -1).find('a').click(function (e) {
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
var convertItemsToEnergy = function convertItemsToEnergy(options) {
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
    $('.kf_fw_ig1:last').parent().append('<ul class="pd_result"><li><strong>\u3010Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '\u3011\u8F6C\u6362\u7ED3\u679C\uFF1A</strong></li></ul>');

    var successNum = 0,
        failNum = 0;
    var energyNum = getGainEnergyNumByLevel(settings.itemLevel);
    $(document).clearQueue('ConvertItemsToEnergy');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('ConvertItemsToEnergy', function () {
            $.ajax({
                type: 'GET',
                url: 'kf_fw_ig_doit.php?tomp=' + settings.safeId + '&id=' + itemId + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success: function success(html) {
                    Public.showFormatLog('将道具转换为能量', html);

                    var _Util$getResponseMsg3 = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg3.msg;

                    if (/转换为了\s*\d+\s*点能量/.test(msg)) {
                        successNum++;
                    } else failNum++;
                },
                error: function error() {
                    failNum++;
                },
                complete: function complete() {
                    var $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    var isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) {
                        $(document).clearQueue('ConvertItemsToEnergy');
                        if (settings.isTypeBatch) $(document).clearQueue('ConvertItemTypesToEnergy');
                    }

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        var successEnergyNum = successNum * energyNum;
                        if (successNum > 0) {
                            Log.push('将道具转换为能量', '\u5171\u6709`' + successNum + '`\u4E2A\u3010`Lv.' + settings.itemLevel + '\uFF1A' + settings.itemName + '`\u3011\u9053\u5177\u6210\u529F\u8F6C\u6362\u4E3A\u80FD\u91CF', { gain: { '能量': successEnergyNum }, pay: { '已使用道具': -successNum } });
                        }
                        console.log('\u5171\u6709' + successNum + '\u4E2A\u9053\u5177\u6210\u529F\u8F6C\u6362\u4E3A\u80FD\u91CF' + (failNum > 0 ? '\uFF0C\u5171\u6709' + failNum + '\u4E2A\u9053\u5177\u8F6C\u6362\u5931\u8D25' : '') + '\uFF0C\u80FD\u91CF+' + successEnergyNum);
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u6210\u529F\u8F6C\u6362\u4E3A\u80FD\u91CF' + (failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u9053\u5177\u8F6C\u6362\u5931\u8D25' : '') + '</strong>' + ('<i>\u80FD\u91CF<em>+' + successEnergyNum + '</em></i>'), -1);
                        $('.pd_result:last').append('<li class="pd_stat">\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u6210\u529F\u8F6C\u6362\u4E3A\u80FD\u91CF' + (failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u9053\u5177\u8F6C\u6362\u5931\u8D25' : '') + '\uFF0C' + ('<i>\u80FD\u91CF<em>+' + successEnergyNum + '</em></i></li>'));
                        setCurrentItemUsableAndUsedNum(settings.$itemLine, -successNum, null, successEnergyNum);
                        if (settings.isTypeBatch) $(document).dequeue('ConvertItemTypesToEnergy');
                    } else {
                        setTimeout(function () {
                            return $(document).dequeue('ConvertItemsToEnergy');
                        }, _Const2.default.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('ConvertItemsToEnergy');
};

/**
 * 添加批量使用和转换指定种类的道具的按钮
 */
var addBatchUseAndConvertOldItemTypesButton = exports.addBatchUseAndConvertOldItemTypesButton = function addBatchUseAndConvertOldItemTypesButton() {
    var safeId = Public.getSafeId();
    if (!safeId) return;
    $('\n<div class="pd_item_btns">\n  <button name="useItemTypes" type="button" title="\u6279\u91CF\u4F7F\u7528\u6307\u5B9A\u79CD\u7C7B\u7684\u9053\u5177">\u6279\u91CF\u4F7F\u7528</button>\n  <button class="pd_highlight" name="convertItemTypes" type="button" title="\u6279\u91CF\u5C06\u6307\u5B9A\u79CD\u7C7B\u7684\u9053\u5177\u8F6C\u6362\u4E3A\u80FD\u91CF">\u6279\u91CF\u8F6C\u6362</button>\n  <button name="selectAll" type="button">\u5168\u9009</button>\n  <button name="selectInverse" type="button">\u53CD\u9009</button>\n</div>\n').insertAfter('.pd_items').on('click', 'button', function () {
        var name = $(this).attr('name');
        if (name === 'useItemTypes' || name === 'convertItemTypes') {
            var _ret = function () {
                var itemTypeList = [];
                $('.pd_item_type_chk:checked').each(function () {
                    var $itemLine = $(this).closest('tr'),
                        itemLevel = parseInt($itemLine.find('td:first-child').text()),
                        itemTypeId = parseInt($itemLine.data('itemTypeId')),
                        itemName = $itemLine.find('td:nth-child(2)').text().trim();
                    if (isNaN(itemTypeId) || itemTypeId <= 0) return;
                    if (name === 'convertItemTypes' && itemTypeId === 1) return;
                    var itemListUrl = $itemLine.find('td:last-child').find(name === 'useItemTypes' ? 'a:first-child' : 'a:last-child').attr('href') + '&t=' + new Date().getTime();
                    itemTypeList.push({
                        itemTypeId: itemTypeId,
                        itemLevel: itemLevel,
                        itemName: itemName,
                        $itemLine: $itemLine,
                        itemListUrl: itemListUrl
                    });
                });
                if (!itemTypeList.length) return {
                        v: void 0
                    };
                var num = parseInt(prompt('\u5728\u6307\u5B9A\u79CD\u7C7B\u9053\u5177\u4E2D\u4F60\u8981' + (name === 'useItemTypes' ? '使用' : '转换') + '\u591A\u5C11\u4E2A\u9053\u5177\uFF1F\uFF080\u8868\u793A\u4E0D\u9650\u5236\uFF09', 0));
                if (isNaN(num) || num < 0) return {
                        v: void 0
                    };
                Msg.destroy();

                var queueName = name === 'useItemTypes' ? 'UseItemTypes' : 'ConvertItemTypesToEnergy';
                $(document).clearQueue(queueName);
                $.each(itemTypeList, function (index, data) {
                    $(document).queue(queueName, function () {
                        var $wait = Msg.wait('\u6B63\u5728\u83B7\u53D6\u672C\u79CD\u7C7B' + (name === 'useItemTypes' ? '未' : '已') + '\u4F7F\u7528\u9053\u5177\u5217\u8868\uFF0C\u8BF7\u7A0D\u540E&hellip;');
                        $.ajax({
                            type: 'GET',
                            url: data.itemListUrl,
                            timeout: _Const2.default.defAjaxTimeout,
                            success: function success(html) {
                                Msg.remove($wait);
                                var itemIdList = getItemIdList(html, num);
                                if (!itemIdList.length) {
                                    $(document).dequeue(queueName);
                                    return;
                                }

                                if (name === 'useItemTypes') {
                                    console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                                    Msg.wait('<strong>\u6B63\u5728\u4F7F\u7528\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
                                    useOldItems({
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
                                    Msg.wait('<strong>\u6B63\u5728\u8F6C\u6362\u80FD\u91CF\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
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
                            error: function error() {
                                Msg.remove($wait);
                                $(document).dequeue(queueName);
                            }
                        });
                    });
                });
                $(document).dequeue(queueName);
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else if (name === 'selectAll') {
            Util.selectAll($('.pd_item_type_chk'));
        } else if (name === 'selectInverse') {
            Util.selectInverse($('.pd_item_type_chk'));
        }
    });
    addSimulateManualHandleItemChecked();
};

/**
 * 为我的道具页面中的道具操作链接绑定点击事件
 * @param {jQuery} $element 要绑定的容器元素
 */
var bindItemActionLinksClick = function bindItemActionLinksClick($element) {
    var safeId = Public.getSafeId();
    if (!safeId) return;
    $element.on('click', 'a[href="#"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.is('.pd_disabled_link')) return;
        var $itemLine = $this.closest('tr'),
            itemLevel = parseInt($itemLine.find('td:first-child').text()),
            itemTypeId = parseInt($itemLine.data('itemTypeId')),
            itemName = $itemLine.find('td:nth-child(2)').text().trim(),
            itemUsableNum = parseInt($itemLine.find('td:nth-child(3) > .pd_usable_num').text()),
            itemUsedNum = parseInt($itemLine.find('td:nth-child(3) > .pd_used_num').text()),
            itemListUrl = '';
        if (isNaN(itemTypeId) || itemTypeId <= 0) return;

        if ($this.is('.pd_items_batch_use')) {
            var _ret2 = function () {
                var num = parseInt(prompt('\u4F60\u8981\u4F7F\u7528\u591A\u5C11\u4E2A\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u9053\u5177\uFF1F\uFF080\u8868\u793A\u4E0D\u9650\u5236\uFF09', itemUsableNum ? itemUsableNum : 0));
                if (isNaN(num) || num < 0) return {
                        v: void 0
                    };
                Msg.destroy();

                Msg.wait('正在获取本种类未使用道具列表，请稍后&hellip;');
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
                $.get(itemListUrl, function (html) {
                    Msg.destroy();
                    var itemIdList = getItemIdList(html, num);
                    if (!itemIdList.length) {
                        alert('本种类没有未使用的道具');
                        return;
                    }
                    console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                    Msg.wait('<strong>\u6B63\u5728\u4F7F\u7528\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
                    useOldItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                });
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
        } else if ($this.is('.pd_items_cycle_use')) {
            var _ret3 = function () {
                var value = prompt('\u4F60\u8981\u5FAA\u73AF\u4F7F\u7528\u591A\u5C11\u4E2A\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u9053\u5177\uFF1F\n' + '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）', itemUsableNum ? itemUsableNum : 0);
                if (value === null) return {
                        v: void 0
                    };
                value = $.trim(value);
                if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                    alert('格式不正确');
                    return {
                        v: void 0
                    };
                }
                var arr = value.split('|');
                var num = 0,
                    maxEffectiveItemCount = 0,
                    maxSuccessRestoreItemCount = 0;
                num = parseInt(arr[0]);
                if (isNaN(num) || num < 0) return {
                        v: void 0
                    };
                if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
                if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
                Msg.destroy();

                Msg.wait('正在获取本种类未使用道具列表，请稍后&hellip;');
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
                $.get(itemListUrl, function (html) {
                    Msg.destroy();
                    var itemIdList = getItemIdList(html, num);
                    if (!itemIdList.length) {
                        alert('本种类没有未使用的道具');
                        return;
                    }
                    Msg.wait('正在获取当前道具相关信息，请稍后&hellip;');
                    $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
                        showCurrentUsableItemNum(html);
                        $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                            Msg.destroy();
                            var totalEnergyNum = getCurrentEnergyNum(html);
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
            }();

            if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
        } else if ($this.is('.pd_items_batch_restore')) {
            var _ret4 = function () {
                var num = parseInt(prompt('\u4F60\u8981\u6062\u590D\u591A\u5C11\u4E2A\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u9053\u5177\uFF1F\uFF080\u8868\u793A\u4E0D\u9650\u5236\uFF09', itemUsedNum ? itemUsedNum : 0));
                if (isNaN(num) || num < 0) return {
                        v: void 0
                    };
                Msg.destroy();

                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
                Msg.wait('正在获取本种类已使用道具列表，请稍后&hellip;');
                $.get(itemListUrl, function (html) {
                    Msg.destroy();
                    var itemIdList = getItemIdList(html, num);
                    if (!itemIdList.length) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量恢复道具Start，恢复道具数量：' + itemIdList.length);
                    Msg.wait('<strong>\u6B63\u5728\u6062\u590D\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
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
            }();

            if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
        } else if ($this.is('.pd_items_batch_convert')) {
            var _ret5 = function () {
                var num = parseInt(prompt('\u4F60\u8981\u5C06\u591A\u5C11\u4E2A\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u9053\u5177\u8F6C\u6362\u4E3A\u80FD\u91CF\uFF1F\uFF080\u8868\u793A\u4E0D\u9650\u5236\uFF09', itemUsedNum ? itemUsedNum : 0));
                if (isNaN(num) || num < 0) return {
                        v: void 0
                    };
                Msg.destroy();

                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
                Msg.wait('正在获取本种类已使用道具列表，请稍后&hellip;');
                $.get(itemListUrl, function (html) {
                    Msg.destroy();
                    var itemIdList = getItemIdList(html, num);
                    if (!itemIdList.length) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                    Msg.wait('<strong>\u6B63\u5728\u8F6C\u6362\u80FD\u91CF\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
                    convertItemsToEnergy({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                });
            }();

            if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
        }
    });
};

/**
 * 增强我的道具页面
 */
var enhanceMyItemsPage = exports.enhanceMyItemsPage = function enhanceMyItemsPage() {
    var $myItems = $('.kf_fw_ig1:last');
    $myItems.addClass('pd_items').find('tbody > tr').each(function (index) {
        var $this = $(this);
        if (index === 0) {
            $this.find('td').attr('colspan', 6);
        } else if (index === 1) {
            $this.find('td:first-child').css('width', '75px').end().find('td:nth-child(2)').css('width', '185px').end().find('td:nth-child(3)').css('width', '105px').html('<span class="pd_usable_num">可用数</span> / <span class="pd_used_num pd_custom_tips">已用数</span>').end().find('td:last-child').css('width', '165px').before('<td style="width: 135px;">使用道具</td><td style="width: 135px;">恢复道具 和 转换能量</td>');
        } else {
            $this.find('td:first-child').prepend('<input class="pd_input pd_item_type_chk" type="checkbox">');
            var isDisabledLink = index === 2 ? 'pd_disabled_link' : '';
            $this.find('td:nth-child(3)').wrapInner('<span class="pd_usable_num" style="margin-left: 5px;"></span>').append(' / <span class="pd_used_num pd_custom_tips">?</span>').after('\n<td>\n  <a class="pd_items_batch_use" href="#" title="\u6279\u91CF\u4F7F\u7528\u6307\u5B9A\u6570\u91CF\u7684\u9053\u5177">\u6279\u91CF\u4F7F\u7528</a>\n  <a class="pd_items_cycle_use pd_highlight ' + isDisabledLink + '" href="#" title="\u5FAA\u73AF\u4F7F\u7528\u548C\u6062\u590D\u6307\u5B9A\u6570\u91CF\u7684\u9053\u5177\uFF0C\u76F4\u81F3\u505C\u6B62\u64CD\u4F5C\u6216\u6CA1\u6709\u9053\u5177\u53EF\u4EE5\u6062\u590D">\u5FAA\u73AF\u4F7F\u7528</a>\n</td>\n<td>\n  <a class="pd_items_batch_restore ' + isDisabledLink + '" href="#" title="\u6279\u91CF\u6062\u590D\u6307\u5B9A\u6570\u91CF\u7684\u9053\u5177">\u6279\u91CF\u6062\u590D</a>\n  <a class="pd_items_batch_convert pd_highlight ' + isDisabledLink + '" href="#" title="\u6279\u91CF\u5C06\u6307\u5B9A\u6570\u91CF\u7684\u9053\u5177\u8F6C\u6362\u4E3A\u80FD\u91CF">\u6279\u91CF\u8F6C\u6362</a>\n</td>\n');
            var $listLinkColumn = $this.find('td:last-child');
            var matches = /lv=(\d+)/i.exec($listLinkColumn.find('a').attr('href'));
            if (matches) {
                var itemTypeId = parseInt(matches[1]);
                $this.data('itemTypeId', itemTypeId);
                $listLinkColumn.find('a').text('未使用列表').after('<a class="pd_highlight" href="kf_fw_ig_renew.php?lv=' + itemTypeId + '">\u5DF2\u4F7F\u7528\u5217\u8868</a>');
            }
        }
    });
    bindItemActionLinksClick($myItems);
    showCurrentUsedItemNum();
};

/**
 * 设定当前指定种类道具的未使用和已使用数量以及道具恢复能量
 * @param {?jQuery} $itemLine 当前道具所在的表格行
 * @param {?number} usedChangeNum 已使用道具的变化数量
 * @param {?number} [usableChangeNum] 未使用道具的变化数量
 * @param {?number} [energyChangeNum] 道具恢复能量的变化数量
 */
var setCurrentItemUsableAndUsedNum = function setCurrentItemUsableAndUsedNum($itemLine, usedChangeNum, usableChangeNum, energyChangeNum) {
    var flag = false;
    if ($itemLine) {
        var $itemUsed = $itemLine.find('td:nth-child(3) > .pd_used_num');
        var itemName = $itemLine.find('td:nth-child(2)').text().trim();
        if ($itemUsed.length > 0 && itemName !== '零时迷子的碎片') {
            var num = parseInt($itemUsed.text());
            if (isNaN(num) || num + usedChangeNum < 0) {
                flag = true;
            } else {
                $itemUsed.text(num + usedChangeNum);
                showUsedItemEnergyTips();
            }
        }
        if (usableChangeNum) {
            var $itemUsable = $itemLine.find('td:nth-child(3) > .pd_usable_num');
            if ($itemUsable.length > 0) {
                var _num = parseInt($itemUsable.text());
                if (isNaN(_num) || _num + usableChangeNum < 0) flag = true;else $itemUsable.text(_num + usableChangeNum);
            }
        }
    }
    if (energyChangeNum) {
        var $totalEnergy = $('.pd_total_energy_num');
        if ($totalEnergy.length > 0) {
            var _num2 = parseInt($totalEnergy.text());
            if (isNaN(_num2) || _num2 + energyChangeNum < 0) flag = true;else $totalEnergy.text(_num2 + energyChangeNum);
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
var getCurrentEnergyNum = function getCurrentEnergyNum(html) {
    var energyNum = 0;
    var energyNumMatches = /道具恢复能量<br\s*\/?><span.+?>(\d+)<\/span><br\s*\/?>点/i.exec(html);
    if (energyNumMatches) energyNum = parseInt(energyNumMatches[1]);
    return energyNum;
};

/**
 * 显示已使用道具恢复所需和转换可得的能量的提示
 */
var showUsedItemEnergyTips = function showUsedItemEnergyTips() {
    var totalRestoreEnergy = 0,
        totalConvertEnergy = 0;
    $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_used_num').each(function () {
        var $this = $(this);
        var itemNum = parseInt($this.text());
        if (isNaN(itemNum) || itemNum < 0) return;
        var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
        if (!itemLevel) return;
        var perRestoreEnergy = getRestoreEnergyNumByLevel(itemLevel);
        var perConvertEnergy = getGainEnergyNumByLevel(itemLevel);
        totalRestoreEnergy += perRestoreEnergy * itemNum;
        totalConvertEnergy += perConvertEnergy * itemNum;
        $this.attr('title', '\u5168\u90E8\u6062\u590D\u9700\u8981' + perRestoreEnergy * itemNum + '\u70B9\u80FD\u91CF\uFF0C\u5168\u90E8\u8F6C\u6362\u53EF\u5F97' + perConvertEnergy * itemNum + '\u70B9\u80FD\u91CF');
    });
    $('.kf_fw_ig1:last > tbody > tr:nth-child(2) > td:nth-child(3) > .pd_used_num').attr('title', '\u5168\u90E8\u6062\u590D\u9700\u8981' + totalRestoreEnergy + '\u70B9\u80FD\u91CF\uFF0C\u5168\u90E8\u8F6C\u6362\u53EF\u5F97' + totalConvertEnergy + '\u70B9\u80FD\u91CF');
};

/**
 * 在我的道具页面中显示当前各种类已使用道具的数量
 * @param {string} html 恢复道具页面的HTML代码（留空表示自动获取HTML代码）
 */
var showCurrentUsedItemNum = function showCurrentUsedItemNum() {
    var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    /**
     * 显示数量
     * @param {string} html 恢复道具页面的HTML代码
     */
    var show = function show(html) {
        var energyNum = getCurrentEnergyNum(html);
        var introMatches = /(1级道具转换得.+?点能量)。<br/.exec(html);
        if (location.pathname === '/kf_fw_ig_my.php') {
            $('.kf_fw_ig_title1:last').find('span:has(.pd_total_energy_num)').remove().end().append('<span class="pd_custom_tips" style="margin-left: 7px;" title="' + (introMatches ? introMatches[1] : '') + '">' + ('(\u9053\u5177\u6062\u590D\u80FD\u91CF <b class="pd_total_energy_num" style="font-size: 14px;">' + energyNum + '</b> \u70B9)</span>'));
        }

        if ($('.pd_used_num').length > 0) {
            var matches = html.match(/">\d+<\/td><td>全部转换本级已使用道具为能量<\/td>/g);
            if (matches) {
                (function () {
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
                        showUsedItemEnergyTips();
                    }
                })();
            }
        }
    };

    if (html) {
        show(html);
    } else {
        $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
            return show(html);
        });
    }
};

/**
 * 在我的道具页面中显示当前各种类可使用道具的数量
 * @param {string} html 我的道具页面的HTML代码（留空表示自动获取HTML代码）
 */
var showCurrentUsableItemNum = function showCurrentUsableItemNum() {
    var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    /**
     * 显示数量
     * @param {string} html 我的道具页面的HTML代码
     */
    var show = function show(html) {
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
    } else {
        $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
            return show(html);
        });
    }
};

/**
 * 获取道具使用情况
 * @param html 争夺首页的HTML代码
 * @returns {Map} 道具使用情况列表
 */
var getItemUsedInfo = exports.getItemUsedInfo = function getItemUsedInfo(html) {
    var itemUsedNumList = new Map([['蕾米莉亚同人漫画', 0], ['十六夜同人漫画', 0], ['档案室钥匙', 0], ['傲娇LOLI娇蛮音CD', 0], ['消逝之药', 0], ['整形优惠卷', 0]]);
    var matches = /道具：\[(蕾米莉亚同人漫画)：(\d+)]\[(十六夜同人漫画)：(\d+)]\[(档案室钥匙)：(\d+)]\[(傲娇LOLI娇蛮音CD)：(\d+)]\[(消逝之药)：(\d+)]\[(整形优惠卷)：(\d+)]/.exec(html);
    if (matches) {
        for (var i = 1; i < matches.length; i += 2) {
            itemUsedNumList.set(matches[i], parseInt(matches[i + 1]));
        }
    }
    return itemUsedNumList;
};

/**
 * 添加批量购买道具链接
 */
var addBatchBuyItemsLink = exports.addBatchBuyItemsLink = function addBatchBuyItemsLink() {
    var $area = $('.kf_fw_ig1').addClass('pd_items');
    $area.find('> tbody > tr:first-child > td:nth-child(2)').css('width', '430px').next('td').next('td').css('width', '120px');
    $area.find('a[href^="kf_fw_ig_shop.php?do=buy&id="]').after('<a data-name="batchBuyItem" href="#">批量购买</a>');
    $area.on('click', '[data-name="batchBuyItem"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $line = $this.closest('tr');
        var type = $line.find('td:first-child').text().trim();
        var kfb = parseInt($line.find('td:nth-child(3)').text());
        var url = $this.prev('a').attr('href');
        if (!type.includes('道具') || !kfb || !url) return;
        var num = parseInt(prompt('\u4F60\u8981\u8D2D\u4E70\u591A\u5C11\u4E2A\u3010' + type + '\u3011\uFF1F\uFF08\u5355\u4EF7\uFF1A' + kfb.toLocaleString() + ' KFB\uFF09', 0));
        if (!num || num < 0) return;

        Msg.wait('<strong>\u6B63\u5728\u8D2D\u4E70\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + num + '</em></i><a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
        buyItems(num, type, kfb, url);
    }).on('click', 'a[href^="kf_fw_ig_shop.php?do=buy&id="]', function () {
        return confirm('是否购买该物品？');
    });
    $area.after('<div class="pd_item_btns"></div>');
    addSimulateManualHandleItemChecked();
    showKfbInItemShop();
};

/**
 * 购买道具
 * @param {number} buyNum 购买数量
 * @param {string} type 购买项目
 * @param {number} kfb 道具单价
 * @param {string} url 购买URL
 */
var buyItems = function buyItems(buyNum, type, kfb, url) {
    var successNum = 0,
        totalKfb = 0;
    var myItemUrlList = [];
    var itemList = {};
    var isStop = false;

    /**
     * 购买
     */
    var buy = function buy() {
        $.ajax({
            type: 'GET',
            url: url + '&t=' + new Date().getTime(),
            timeout: _Const2.default.defAjaxTimeout,
            success: function success(html) {
                Public.showFormatLog('购买道具', html);

                var _Util$getResponseMsg4 = Util.getResponseMsg(html),
                    msg = _Util$getResponseMsg4.msg;

                if (/购买成功，返回我的背包/.test(msg)) {
                    successNum++;
                    totalKfb += kfb;
                } else {
                    isStop = true;
                    $('.pd_result:last').append('<li>' + msg + '<span class="pd_notice">\uFF08\u8D2D\u4E70\u4E2D\u6B62\uFF09</span></li>');
                }
                setTimeout(getNewItemInfo, _Const2.default.defAjaxInterval);
            },
            error: function error() {
                setTimeout(buy, _Const2.default.defAjaxInterval);
            }
        });
    };

    /**
     * 获取新道具的信息
     * @param {boolean} isFirst 购买前第一次获取信息
     */
    var getNewItemInfo = function getNewItemInfo() {
        var isFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_mybp.php?t=' + new Date().getTime(),
            timeout: _Const2.default.defAjaxTimeout,
            success: function success(html) {
                var list = [];
                $('.kf_fw_ig1 a[href^="kf_fw_ig_mybp.php?do=1&id="]', html).each(function () {
                    var $this = $(this);
                    var url = $this.attr('href');
                    list.push(url);
                    if (isFirst || myItemUrlList.includes(url)) return;
                    var itemName = $this.closest('tr').find('td:nth-child(2)').text().trim();
                    if (!itemTypeList.includes(itemName)) return;
                    if (!(itemName in itemList)) itemList[itemName] = 0;
                    itemList[itemName]++;
                    console.log('\u83B7\u5F97\u4E86\u4E00\u4E2A\u3010Lv.' + getLevelByName(itemName) + '\uFF1A' + itemName + '\u3011\u9053\u5177');
                    $('.pd_result:last').append('<li>\u83B7\u5F97\u4E86\u4E00\u4E2A\u3010<b class="pd_highlight">Lv.' + getLevelByName(itemName) + '\uFF1A' + itemName + '</b>\u3011\u9053\u5177</li>');
                });
                myItemUrlList = list;

                var $countdown = $('.pd_countdown:last');
                $countdown.text(buyNum - successNum);
                isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                if (isStop || successNum === buyNum) {
                    Msg.remove($countdown.closest('.pd_msg'));
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = Util.entries(itemList)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _step4$value = _slicedToArray(_step4.value, 2),
                                itemName = _step4$value[0],
                                num = _step4$value[1];

                            if (!num) delete itemList[itemName];
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    if (successNum > 0 && !$.isEmptyObject(itemList)) {
                        Log.push('购买道具', '\u5171\u6709`' + successNum + '`\u4E2A\u3010`' + type + '`\u3011\u8D2D\u4E70\u6210\u529F', { gain: { '道具': successNum, 'item': itemList }, pay: { 'KFB': -totalKfb } });
                    }

                    var itemStatHtml = '';
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = Util.getSortedObjectKeyList(itemTypeList, itemList)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var itemName = _step5.value;

                            itemStatHtml += '<i>' + itemName + '<em>+' + itemList[itemName] + '</em></i> ';
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    $('.pd_result:last').append('\n<li class="pd_stat">\n  <b>\u7EDF\u8BA1\u7ED3\u679C\uFF1A</b><br>\n  \u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u8D2D\u4E70\u6210\u529F\uFF0C<i>KFB<ins>-' + totalKfb.toLocaleString() + '</ins></i> ' + itemStatHtml + '<br>\n  <span style="color: #666;">(\u8BF7\u5230<a href="kf_fw_ig_mybp.php">\u89D2\u8272/\u7269\u54C1\u9875\u9762</a>\u67E5\u770B)</span>\n</li>\n');

                    console.log('\u5171\u6709' + successNum + '\u4E2A\u3010' + type + '\u3011\u8D2D\u4E70\u6210\u529F\uFF0CKFB-' + totalKfb);
                    Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u4E2A\u3010' + type + '\u3011\u8D2D\u4E70\u6210\u529F</strong><i>KFB<ins>-' + totalKfb.toLocaleString() + '</ins></i>', -1);
                    showKfbInItemShop();
                } else {
                    var interval = typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval;
                    setTimeout(buy, isFirst ? _Const2.default.defAjaxInterval : interval);
                }
            },
            error: function error() {
                setTimeout(function () {
                    return getNewItemInfo(isFirst);
                }, _Const2.default.defAjaxInterval);
            }
        });
    };

    $('.kf_fw_ig1:last').parent().append('<ul class="pd_result"><li><strong>\u3010' + type + '\u3011\u8D2D\u4E70\u7ED3\u679C\uFF1A</strong></li></ul>');
    getNewItemInfo(true);
};

/**
 * 在道具商店显示当前持有的KFB
 */
var showKfbInItemShop = function showKfbInItemShop() {
    $.get('profile.php?action=show&uid=' + _Info2.default.uid + '&t=' + new Date().getTime(), function (html) {
        var matches = /论坛货币：(\d+)\s*KFB<br/i.exec(html);
        if (!matches) return;
        var cash = parseInt(matches[1]);
        $('.kf_fw_ig_title1:last').find('span:last').remove().end().append('<span style="margin-left: 7px;">(\u5F53\u524D\u6301\u6709 <b style="font-size: 14px;">' + cash.toLocaleString() + '</b> KFB)</span>');
    });
};

/**
 * 添加模拟手动操作道具复选框
 */
var addSimulateManualHandleItemChecked = function addSimulateManualHandleItemChecked() {
    $('\n<label style="margin-right: 5px;">\n  <input name="simulateManualHandleItemEnabled" type="checkbox" ' + (Config.simulateManualHandleItemEnabled ? 'checked' : '') + '> \u6A21\u62DF\u624B\u52A8\u64CD\u4F5C\u9053\u5177\n  <span class="pd_cfg_tips" title="\u5EF6\u957F\u9053\u5177\u6279\u91CF\u64CD\u4F5C\u7684\u65F6\u95F4\u95F4\u9694\uFF08\u57282~6\u79D2\u4E4B\u95F4\uFF09\uFF0C\u4EE5\u6A21\u62DF\u624B\u52A8\u4F7F\u7528\u3001\u6062\u590D\u548C\u8D2D\u4E70\u9053\u5177">[?]</span>\n</label>\n').prependTo('.pd_item_btns').find('[name="simulateManualHandleItemEnabled"]').click(function () {
        var checked = $(this).prop('checked');
        if (Config.simulateManualHandleItemEnabled !== checked) {
            (0, _Config.read)();
            Config.simulateManualHandleItemEnabled = checked;
            (0, _Config.write)();
        }
    });
};

/**
 * 在物品装备页面上添加批量使用道具按钮
 */
var addBatchUseItemsButton = exports.addBatchUseItemsButton = function addBatchUseItemsButton() {
    var $area = $('.kf_fw_ig1:first');
    $area.find('> tbody > tr:gt(1)').each(function () {
        var $this = $(this);
        var matches = /id=(\d+)/.exec($this.find('td:nth-child(3) > a').attr('href'));
        if (!matches) return;
        var id = parseInt(matches[1]);
        var itemName = $this.find('td:nth-child(2)').text().trim();
        $this.find('td:first-child').prepend('<input class="pd_input" data-name="' + itemName + '" type="checkbox" value="' + id + '">');
    });

    $('\n<div class="pd_item_btns">\n  <button name="useItems" type="button" style="color: #00f;" title="\u6279\u91CF\u4F7F\u7528\u6307\u5B9A\u9053\u5177">\u6279\u91CF\u4F7F\u7528</button>\n  <button name="hideItemTypes" type="button" style="color: #f00;" title="\u9690\u85CF\u6307\u5B9A\u79CD\u7C7B\u7684\u9053\u5177">\u9690\u85CF\u9053\u5177</button>\n  <button name="selectAll" type="button">\u5168\u9009</button>\n  <button name="selectInverse" type="button">\u53CD\u9009</button>\n</div>\n').insertAfter($area).find('[name="useItems"]').click(function () {
        var $checked = $area.find('[type="checkbox"]:checked');
        if (!$checked.length) return;
        var itemList = new Map();
        $checked.each(function () {
            var $this = $(this);
            var itemId = parseInt($this.val());
            var itemName = $this.data('name');
            if (!itemTypeList.includes(itemName)) return;
            if (!itemList.has(itemName)) itemList.set(itemName, []);
            itemList.get(itemName).push(itemId);
        });
        if (!confirm('\u4F60\u5171\u9009\u62E9\u4E86' + itemList.size + '\u4E2A\u79CD\u7C7B\u4E2D\u7684' + $checked.length + '\u4E2A\u9053\u5177\uFF0C\u662F\u5426\u6279\u91CF\u4F7F\u7528\uFF1F')) return;
        Msg.destroy();

        $(document).clearQueue('UseItemTypes');
        $.each([].concat(_toConsumableArray(itemList)), function (index, _ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                itemName = _ref2[0],
                itemIdList = _ref2[1];

            $(document).queue('UseItemTypes', function () {
                var $wait = Msg.wait('<strong>\u6B63\u5728\u4F7F\u7528\u9053\u5177\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + itemIdList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
                var itemLevel = getLevelByName(itemName);
                var interval = 0;
                if (index > 0) interval = typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval;
                setTimeout(function () {
                    return useItems({ itemLevel: itemLevel, itemName: itemName, itemIdList: itemIdList, $wait: $wait });
                }, interval);
            });
        });
        $(document).dequeue('UseItemTypes');
    }).end().find('[name="hideItemTypes"]').click(function () {
        (0, _Config.read)();
        var value = prompt('请输入你要隐藏的道具种类：\n（多个种类请用英文逗号分隔，留空表示不隐藏，例：蕾米莉亚同人漫画,整形优惠卷）', Config.hideItemTypeList.join(','));
        if (value === null) return;
        Config.hideItemTypeList = [];
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = value.split(',')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var itemType = _step6.value;

                itemType = itemType.trim();
                if (!itemTypeList.includes(itemType)) continue;
                Config.hideItemTypeList.push(itemType);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        (0, _Config.write)();
        alert('指定道具种类已被隐藏（需刷新页面后才可生效）');
    }).end().find('[name="selectAll"]').click(function () {
        return Util.selectAll($area.find('[type="checkbox"]'));
    }).end().find('[name="selectInverse"]').click(function () {
        return Util.selectInverse($area.find('[type="checkbox"]'));
    });

    addSimulateManualHandleItemChecked();
};

/**
 * 使用道具
 * @param {number} itemLevel 道具等级
 * @param {string} itemName 道具名称
 * @param {number[]} itemIdList 道具ID列表
 * @param {jQuery} $wait 等待消息框对象
 */
var useItems = function useItems(_ref3) {
    var itemLevel = _ref3.itemLevel,
        itemName = _ref3.itemName,
        itemIdList = _ref3.itemIdList,
        $wait = _ref3.$wait;

    var $area = $('.kf_fw_ig1:first');
    $area.parent().append('<ul class="pd_result"><li><strong>\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u4F7F\u7528\u7ED3\u679C\uFF1A</strong></li></ul>');
    var successNum = 0,
        failNum = 0;
    var isStop = false;
    var stat = { '有效道具': 0, '无效道具': 0 };
    $(document).clearQueue('UseItems');
    $.each(itemIdList, function (index, itemId) {
        $(document).queue('UseItems', function () {
            $.ajax({
                type: 'GET',
                url: 'kf_fw_ig_mybp.php?do=1&id=' + itemId + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success: function success(html) {
                    Public.showFormatLog('使用道具', html);

                    var _Util$getResponseMsg5 = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg5.msg;

                    if (/(成功|失败)！/.test(msg)) {
                        successNum++;
                        if (/成功！/.test(msg)) stat['有效道具']++;else stat['无效道具']++;
                        $area.find('[type="checkbox"][value="' + itemId + '"]').closest('tr').fadeOut('normal', function () {
                            $(this).remove();
                        });
                    } else {
                        failNum++;
                        if (/无法再使用/.test(msg)) {
                            isStop = true;
                            $(document).clearQueue('UseItems');
                        }
                    }
                    $('.pd_result:last').append('<li><b>\u7B2C' + (index + 1) + '\u6B21\uFF1A</b>' + msg + '</li>');
                },
                error: function error() {
                    failNum++;
                },
                complete: function complete() {
                    var $countdown = $wait.find('.pd_countdown');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    var isAllStop = $wait.data('stop');
                    if (isAllStop) {
                        isStop = true;
                        $(document).clearQueue('UseItems');
                        $(document).clearQueue('UseItemTypes');
                    }

                    if (isStop || index === itemIdList.length - 1) {
                        Msg.remove($wait);
                        if (stat['有效道具'] === 0) delete stat['有效道具'];
                        if (stat['无效道具'] === 0) delete stat['无效道具'];
                        if (successNum > 0) {
                            Log.push('使用道具', '\u5171\u6709`' + successNum + '`\u4E2A\u3010`Lv.' + itemLevel + '\uFF1A' + itemName + '`\u3011\u9053\u5177\u88AB\u4F7F\u7528', { gain: stat, pay: { '道具': -successNum } });
                        }

                        var logStat = '',
                            msgStat = '',
                            resultStat = '';
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = Util.entries(stat)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var _step7$value = _slicedToArray(_step7.value, 2),
                                    key = _step7$value[0],
                                    num = _step7$value[1];

                                logStat += '\uFF0C' + key + '+' + num;
                                msgStat += '<i>' + key + '<em>+' + num + '</em></i>';
                                resultStat += '<i>' + key + '<em>+' + num + '</em></i> ';
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }

                        console.log('\u5171\u6709' + successNum + '\u4E2A\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u9053\u5177\u88AB\u4F7F\u7528' + (failNum > 0 ? '\uFF0C\u5171\u6709' + failNum + '\u4E2A\u9053\u5177\u672A\u80FD\u4F7F\u7528' : '') + logStat);
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u4E2A\u3010Lv.' + itemLevel + '\uFF1A' + itemName + '\u3011\u9053\u5177\u88AB\u4F7F\u7528' + ((failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u9053\u5177\u672A\u80FD\u4F7F\u7528' : '') + '</strong>' + msgStat), -1);
                        if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                        $('.pd_result:last').append('<li class="pd_stat"><b>\u7EDF\u8BA1\u7ED3\u679C\uFF08\u5171\u6709<em>' + successNum + '</em>\u4E2A\u9053\u5177\u88AB\u4F7F\u7528\uFF09\uFF1A</b>' + resultStat + '</li>');
                        $(document).dequeue('UseItemTypes');
                    } else {
                        setTimeout(function () {
                            return $(document).dequeue('UseItems');
                        }, typeof _Const2.default.specialAjaxInterval === 'function' ? _Const2.default.specialAjaxInterval() : _Const2.default.specialAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('UseItems');
};

/**
 * 隐藏指定道具种类
 */
var hideItemTypes = exports.hideItemTypes = function hideItemTypes() {
    var $area = $('.kf_fw_ig1:first');
    var num = 0;
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = Config.hideItemTypeList[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var itemType = _step8.value;

            var $item = $area.find('> tbody > tr:gt(1):has(td:nth-child(2):contains("' + itemType + '"))');
            num += $item.length;
            $item.remove();
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }

    if (num > 0) {
        $area.find('> tbody').append('<tr><td colspan="4" style="color: #666; text-align: center;">\u5171\u6709' + num + '\u4E2A\u9053\u5177\u5DF2\u88AB\u9690\u85CF&hellip;</td></tr>');
    }
};

},{"./Config":4,"./Const":6,"./Info":9,"./Log":11,"./Msg":15,"./Public":18,"./Util":22}],11:[function(require,module,exports){
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
var name = _Const2.default.storagePrefix + 'log';

/**
 * 读取日志
 * @returns {{}} 日志对象
 */
var read = exports.read = function read() {
    var log = {};
    var options = Util.readData(name + '_' + _Info2.default.uid);
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
var write = exports.write = function write(log) {
    return Util.writeData(name + '_' + _Info2.default.uid, JSON.stringify(log));
};

/**
 * 清除日志
 */
var clear = exports.clear = function clear() {
    return Util.deleteData(name + '_' + _Info2.default.uid);
};

/**
 * 记录一条新日志
 * @param {string} type 日志类别
 * @param {string} action 行为
 * @param {?{}} gain 收获
 * @param {?{}} pay 付出
 */
var push = exports.push = function push(type, action) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$gain = _ref.gain,
        gain = _ref$gain === undefined ? null : _ref$gain,
        _ref$pay = _ref.pay,
        pay = _ref$pay === undefined ? null : _ref$pay;

    var log = read();
    var overdueDate = Util.getDateString(Util.getDate('-' + Config.logSaveDays + 'd'));
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Util.getObjectKeyList(log, 1)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var date = _step.value;

            if (date <= overdueDate) delete log[date];else break;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var now = new Date();
    var time = now.getTime();
    var today = Util.getDateString(now);
    var obj = { time: time, type: type, action: action };
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
var getMergeLog = exports.getMergeLog = function getMergeLog(log, newLog) {
    for (var date in newLog) {
        if (!Array.isArray(log[date])) {
            log[date] = newLog[date];
        } else {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var newItem = _step2.value;

                    if (typeof newItem.time !== 'number' || typeof newItem.type !== 'string') return 'continue';
                    var index = log[date].findIndex(function (item) {
                        return newItem['time'] === item['time'] && newItem['type'] === item['type'];
                    });
                    if (index > -1) log[date][index] = newItem;else log[date].push(newItem);
                };

                for (var _iterator2 = newLog[date][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ret = _loop();

                    if (_ret === 'continue') continue;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            log[date].sort(function (a, b) {
                return a.time > b.time ? 1 : -1;
            });
        }
    }
    return log;
};

},{"./Const":6,"./Info":9,"./Util":22}],12:[function(require,module,exports){
/* 日志对话框模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var show = exports.show = function show() {
    var dialogName = 'pdLogDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    Script.runFunc('LogDialog.show_before_');
    var html = '\n<div class="pd_cfg_main">\n  <div class="pd_log_nav">\n    <a class="pd_disabled_link" data-name="start" href="#">&lt;&lt;</a>\n    <a class="pd_disabled_link" data-name="prev" href="#" style="padding: 0 7px;">&lt;</a>\n    <h2 class="pd_log_date pd_custom_tips">\u6682\u65E0\u65E5\u5FD7</h2>\n    <a class="pd_disabled_link" data-name="next" href="#" style="padding: 0 7px;">&gt;</a>\n    <a class="pd_disabled_link" data-name="end" href="#">&gt;&gt;</a>\n  </div>\n  <fieldset>\n    <legend>\u65E5\u5FD7\u5185\u5BB9</legend>\n    <div>\n      <strong>\u6392\u5E8F\u65B9\u5F0F\uFF1A</strong>\n      <label title="\u6309\u65F6\u95F4\u987A\u5E8F\u6392\u5E8F"><input type="radio" name="sortType" value="time" checked> \u6309\u65F6\u95F4</label>\n      <label title="\u6309\u65E5\u5FD7\u7C7B\u522B\u6392\u5E8F"><input type="radio" name="sortType" value="type"> \u6309\u7C7B\u522B</label>\n    </div>\n    <div class="pd_stat pd_log_content">\u6682\u65E0\u65E5\u5FD7</div>\n  </fieldset>\n  <fieldset>\n    <legend>\u7EDF\u8BA1\u7ED3\u679C</legend>\n    <div>\n      <strong>\u7EDF\u8BA1\u8303\u56F4\uFF1A</strong>\n      <label title="\u663E\u793A\u5F53\u5929\u7684\u7EDF\u8BA1\u7ED3\u679C"><input type="radio" name="statType" value="current" checked> \u5F53\u5929</label>\n      <label title="\u663E\u793A\u8DDD\u8BE5\u65E5N\u5929\u5185\u7684\u7EDF\u8BA1\u7ED3\u679C"><input type="radio" name="statType" value="custom"></label>\n      <label title="\u663E\u793A\u8DDD\u8BE5\u65E5N\u5929\u5185\u7684\u7EDF\u8BA1\u7ED3\u679C"><input name="statDays" type="text" style="width: 22px;" maxlength="3"> \u5929\u5185</label>\n      <label title="\u663E\u793A\u5168\u90E8\u7EDF\u8BA1\u7ED3\u679C"><input type="radio" name="statType" value="all"> \u5168\u90E8</label>\n    </div>\n    <div class="pd_stat" data-name="stat">\u6682\u65E0\u65E5\u5FD7</div>\n  </fieldset>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a data-name="openImOrExLogDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u65E5\u5FD7</a></span>\n  <button data-action="close" type="button">\u5173\u95ED</button>\n  <button name="clear" type="button">\u6E05\u9664\u65E5\u5FD7</button>\n</div>';
    var $dialog = Dialog.create(dialogName, 'KFOL助手日志', html, 'width: 880px;');
    var $logNav = $dialog.find('.pd_log_nav');

    var log = Log.read();
    var dateList = [];
    var curIndex = 0;
    if (!$.isEmptyObject(log)) {
        dateList = Util.getObjectKeyList(log, 1);
        curIndex = dateList.length - 1;
        $logNav.find('.pd_log_date').attr('title', '\u603B\u5171\u8BB0\u5F55\u4E86' + dateList.length + '\u5929\u7684\u65E5\u5FD7').text(dateList[curIndex]);
        if (dateList.length > 1) {
            $logNav.find('[data-name="start"]').attr('title', dateList[0]).removeClass('pd_disabled_link');
            $logNav.find('[data-name="prev"]').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
        }
    }
    $logNav.on('click', 'a[data-name]', function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        var name = $this.data('name');
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
        var value = $(this).val();
        if (Config.logSortType !== value) {
            Config.logSortType = value;
            (0, _Config.write)();
            showLogContent(log, dateList[curIndex], $dialog);
        }
    }).end().find('[name="statType"]').click(function () {
        var value = $(this).val();
        if (Config.logStatType !== value) {
            Config.logStatType = value;
            (0, _Config.write)();
            showLogStat(log, dateList[curIndex], $dialog);
        }
    }).end().find('[name="statDays"]').keyup(function () {
        var days = parseInt($(this).val());
        if (days > 0 && Config.logStatDays !== days) {
            Config.logStatDays = days;
            (0, _Config.write)();
            $dialog.find('[name="statType"][value="custom"]:not(:checked)').click();
            showLogStat(log, dateList[curIndex], $dialog);
        }
    }).end().find('[name="sortType"][value="' + Config.logSortType + '"]').click().end().find('[name="statType"][value="' + Config.logStatType + '"]').click().end().find('[name="statDays"]').val(Config.logStatDays);

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
var showLogContent = function showLogContent(log, date, $dialog) {
    if (!Array.isArray(log[date])) return;
    $dialog.find('.pd_log_content').html(getLogContent(log, date, Config.logSortType)).parent().find('legend:first-child').text('\u65E5\u5FD7\u5185\u5BB9 (\u5171' + log[date].length + '\u9879)');
};

/**
 * 获取指定日期的日志内容
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {string} logSortType 日志内容的排序方式
 * @returns {string} 指定日期的日志内容
 */
var getLogContent = function getLogContent(log, date, logSortType) {
    var logList = log[date];
    if (logSortType === 'type') {
        (function () {
            var sortTypeList = ['捐款', '领取每日奖励', '争夺攻击', '领取争夺奖励', '批量攻击', '试探攻击', '抽取神秘盒子', '抽取道具或卡片', '使用道具', '恢复道具', '循环使用道具', '将道具转换为能量', '将卡片转换为VIP时间', '购买道具', '统计道具购买价格', '出售道具', '神秘抽奖', '统计神秘抽奖结果', '神秘等级升级', '神秘系数排名变化', '批量转账', '购买帖子', '自动存款'];
            logList.sort(function (a, b) {
                return sortTypeList.indexOf(a.type) > sortTypeList.indexOf(b.type) ? 1 : -1;
            });
        })();
    } else {
        logList.sort(function (a, b) {
            return a.time > b.time ? 1 : -1;
        });
    }

    var content = '',
        curType = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = logList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value,
                time = _step$value.time,
                type = _step$value.type,
                action = _step$value.action,
                gain = _step$value.gain,
                pay = _step$value.pay;

            if (typeof time === 'undefined' || typeof type === 'undefined' || typeof action === 'undefined') continue;
            var d = new Date(time);
            if (logSortType === 'type') {
                if (curType !== type) {
                    content += '<h3>\u3010' + type + '\u3011</h3>';
                    curType = type;
                }
                content += '<p><b>' + Util.getTimeString(d) + '\uFF1A</b>' + action.replace(/`([^`]+?)`/g, '<b style="color: #f00;">$1</b>');
            } else {
                content += '<p><b>' + Util.getTimeString(d) + ' (' + type + ')\uFF1A</b>' + action.replace(/`([^`]+?)`/g, '<b style="color: #f00;">$1</b>');
            }

            var stat = '';
            if ($.type(gain) === 'object' && !$.isEmptyObject(gain)) {
                stat += '，';
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Object.keys(gain)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var k = _step2.value;

                        if (k === 'item') {
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = Util.getSortedObjectKeyList(Item.itemTypeList, gain[k])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var itemName = _step3.value;

                                    stat += '<i>' + itemName + '<em>+' + gain[k][itemName].toLocaleString() + '</em></i> ';
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                        _iterator3.return();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }
                        } else {
                            stat += '<i>' + k + '<em>+' + gain[k].toLocaleString() + '</em></i> ';
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            if ($.type(pay) === 'object' && !$.isEmptyObject(pay)) {
                if (!stat) stat += '，';
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = Object.keys(pay)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _k = _step4.value;

                        if (_k === 'item') {
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = Object.keys(pay[_k])[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var _itemName = _step5.value;

                                    stat += '<i>' + _itemName + '<ins>' + pay[_k][_itemName].toLocaleString() + '</ins></i> ';
                                }
                            } catch (err) {
                                _didIteratorError5 = true;
                                _iteratorError5 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                        _iterator5.return();
                                    }
                                } finally {
                                    if (_didIteratorError5) {
                                        throw _iteratorError5;
                                    }
                                }
                            }
                        } else {
                            stat += '<i>' + _k + '<ins>' + pay[_k].toLocaleString() + '</ins></i> ';
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }

            content += stat + '</p>';
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return content;
};

/**
 * 显示指定日期的日志统计结果
 * @param {{}} log 日志对象
 * @param {string} date 日志对象关键字
 * @param {jQuery} $dialog 日志对话框对象
 */
var showLogStat = function showLogStat(log, date, $dialog) {
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
var getLogStat = function getLogStat(log, date, logStatType) {
    var rangeLog = {};

    if (logStatType === 'custom') {
        var minDate = new Date(date);
        minDate.setDate(minDate.getDate() - Config.logStatDays + 1);
        minDate = Util.getDateString(minDate);
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = Util.getObjectKeyList(log, 1)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var d = _step6.value;

                if (d >= minDate && d <= date) rangeLog[d] = log[d];
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    } else if (logStatType === 'all') {
        rangeLog = log;
    } else {
        rangeLog[date] = log[date];
    }

    var income = {},
        expense = {},
        profit = {};
    var lootCount = 0,
        lootLevelStat = { total: 0, min: 0, max: 0 },
        lootExpStat = { total: 0, min: 0, max: 0 },
        lootKfbStat = { total: 0, min: 0, max: 0 };
    var buyItemNum = 0,
        buyItemKfb = 0,
        buyItemStat = {};
    var validItemNum = 0,
        highValidItemNum = 0,
        validItemStat = {},
        invalidItemNum = 0,
        highInvalidItemNum = 0,
        invalidItemStat = {};
    var invalidKeyList = ['item', '夺取KFB', 'VIP小时', '神秘', '燃烧伤害', '命中', '闪避', '暴击比例', '暴击几率', '防御', '有效道具', '无效道具'];
    for (var _d in rangeLog) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = rangeLog[_d][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _step7$value = _step7.value,
                    type = _step7$value.type,
                    action = _step7$value.action,
                    gain = _step7$value.gain,
                    pay = _step7$value.pay,
                    notStat = _step7$value.notStat;

                if (typeof type === 'undefined' || typeof notStat !== 'undefined') continue;
                if ($.type(gain) === 'object') {
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = Object.keys(gain)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var k = _step8.value;

                            if (invalidKeyList.includes(k)) continue;
                            if (typeof income[k] === 'undefined') income[k] = gain[k];else income[k] += gain[k];
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                }
                if ($.type(pay) === 'object') {
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = Object.keys(pay)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var _k2 = _step9.value;

                            if (invalidKeyList.includes(_k2)) continue;
                            if (typeof expense[_k2] === 'undefined') expense[_k2] = pay[_k2];else expense[_k2] += pay[_k2];
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
                    }
                }

                if (type === '争夺攻击' && $.type(gain) === 'object') {
                    var matches = /第`(\d+)`层/.exec(action);
                    if (matches) {
                        lootCount++;
                        var level = parseInt(matches[1]);
                        lootLevelStat.total += level;
                        if (lootLevelStat.max < level) lootLevelStat.max = level;
                        if (!lootLevelStat.min || lootLevelStat.min > level) lootLevelStat.min = level;
                        if (gain['KFB'] > 0) {
                            lootKfbStat.total += gain['KFB'];
                            if (lootKfbStat.max < gain['KFB']) lootKfbStat.max = gain['KFB'];
                            if (!lootKfbStat.min || lootKfbStat.min > gain['KFB']) lootKfbStat.min = gain['KFB'];
                        }
                        if (gain['经验值'] > 0) {
                            lootExpStat.total += gain['经验值'];
                            if (lootExpStat.max < gain['经验值']) lootExpStat.max = gain['经验值'];
                            if (!lootExpStat.min || lootExpStat.min > gain['经验值']) lootExpStat.min = gain['经验值'];
                        }
                    }
                } else if (type === '购买道具' && $.type(gain) === 'object' && $.type(gain['item']) === 'object' && $.type(pay) === 'object') {
                    buyItemNum += gain['道具'];
                    buyItemKfb += Math.abs(pay['KFB']);
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = Util.entries(gain['item'])[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var _step10$value = _slicedToArray(_step10.value, 2),
                                itemName = _step10$value[0],
                                num = _step10$value[1];

                            if (!(itemName in buyItemStat)) buyItemStat[itemName] = 0;
                            buyItemStat[itemName] += num;
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }
                } else if ((type === '使用道具' || type === '循环使用道具') && $.type(gain) === 'object') {
                    var _matches = /【`Lv.(\d+)：(.+?)`】/.exec(action);
                    if (_matches) {
                        var itemLevel = parseInt(_matches[1]);
                        var itemName = _matches[2];
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
                }
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }
    }

    var content = '';
    var sortStatTypeList = ['KFB', '经验值', '贡献', '转账额度', '能量', '道具', '已使用道具', '卡片'];
    content += '<strong>收获：</strong>';
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
        for (var _iterator11 = Util.getSortedObjectKeyList(sortStatTypeList, income)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var key = _step11.value;

            profit[key] = income[key];
            content += '<i>' + key + '<em>+' + income[key].toLocaleString() + '</em></i> ';
        }
    } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
            }
        } finally {
            if (_didIteratorError11) {
                throw _iteratorError11;
            }
        }
    }

    content += '<br><strong>付出：</strong>';
    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
        for (var _iterator12 = Util.getSortedObjectKeyList(sortStatTypeList, expense)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var _key = _step12.value;

            if (typeof profit[_key] === 'undefined') profit[_key] = expense[_key];else profit[_key] += expense[_key];
            content += '<i>' + _key + '<ins>' + expense[_key].toLocaleString() + '</ins></i> ';
        }
    } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
            }
        } finally {
            if (_didIteratorError12) {
                throw _iteratorError12;
            }
        }
    }

    content += '<br><strong>结余：</strong>';
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
        for (var _iterator13 = Util.getSortedObjectKeyList(sortStatTypeList, profit)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var _key2 = _step13.value;

            content += '<i>' + _key2 + Util.getStatFormatNumber(profit[_key2]) + '</i> ';
        }
    } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
            }
        } finally {
            if (_didIteratorError13) {
                throw _iteratorError13;
            }
        }
    }

    content += '<div style="margin: 5px 0; border-bottom: 1px dashed #ccccff;"></div>';
    content += '\n<strong>\u4E89\u593A\u653B\u51FB\u7EDF\u8BA1\uFF1A</strong><i>\u6B21\u6570<em>+' + lootCount + '</em></i> ';
    if (lootCount > 0) {
        content += '<i>\u5C42\u6570<span class="pd_stat_extra">(<em title="\u5E73\u5747\u503C">+' + (lootLevelStat.total / lootCount).toFixed(2) + '</em>|' + ('<em title="\u6700\u5C0F\u503C">+' + lootLevelStat.min + '</em>|<em title="\u6700\u5927\u503C">+' + lootLevelStat.max + '</em>)</span></i> ');
        content += '<i>KFB<em>+' + lootKfbStat.total.toLocaleString() + '</em><span class="pd_stat_extra">' + ('(<em title="\u5E73\u5747\u503C">+' + Util.getFixedNumLocStr(lootKfbStat.total / lootCount) + '</em>|') + ('<em title="\u6700\u5C0F\u503C">+' + lootKfbStat.min.toLocaleString() + '</em>|<em title="\u6700\u5927\u503C">+' + lootKfbStat.max.toLocaleString() + '</em>)</span></i> ');
        content += '<i>\u7ECF\u9A8C\u503C<em>+' + lootExpStat.total.toLocaleString() + '</em><span class="pd_stat_extra">' + ('(<em title="\u5E73\u5747\u503C">+' + Util.getFixedNumLocStr(lootExpStat.total / lootCount) + '</em>|') + ('<em title="\u6700\u5C0F\u503C">+' + lootExpStat.min.toLocaleString() + '</em>|<em title="\u6700\u5927\u503C">+' + lootExpStat.max.toLocaleString() + '</em>)</span></i> ');
    }

    content += '<br><strong>\u8D2D\u4E70\u9053\u5177\u7EDF\u8BA1\uFF1A</strong><i>\u9053\u5177<em>+' + buyItemNum.toLocaleString() + '</em></i> ' + ('<i>KFB<ins>-' + buyItemKfb.toLocaleString() + '</ins></i> ');
    var _iteratorNormalCompletion14 = true;
    var _didIteratorError14 = false;
    var _iteratorError14 = undefined;

    try {
        for (var _iterator14 = Util.getSortedObjectKeyList(Item.itemTypeList, buyItemStat)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var _itemName2 = _step14.value;

            content += '<i>' + _itemName2 + '<em>+' + buyItemStat[_itemName2].toLocaleString() + '</em></i> ';
        }
    } catch (err) {
        _didIteratorError14 = true;
        _iteratorError14 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion14 && _iterator14.return) {
                _iterator14.return();
            }
        } finally {
            if (_didIteratorError14) {
                throw _iteratorError14;
            }
        }
    }

    content += '<br><strong>\u6709\u6548\u9053\u5177\u7EDF\u8BA1\uFF1A</strong><i>\u6709\u6548\u9053\u5177<span class="pd_stat_extra"><em>+' + validItemNum.toLocaleString() + '</em>' + ('(<em title="3\u7EA7\u4EE5\u4E0A\u6709\u6548\u9053\u5177">+' + highValidItemNum.toLocaleString() + '</em>)</span></i> ');
    var _iteratorNormalCompletion15 = true;
    var _didIteratorError15 = false;
    var _iteratorError15 = undefined;

    try {
        for (var _iterator15 = Util.getSortedObjectKeyList(Item.itemTypeList, validItemStat)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
            var _itemName3 = _step15.value;

            content += '<i>' + _itemName3 + '<em>+' + validItemStat[_itemName3].toLocaleString() + '</em></i> ';
        }
    } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion15 && _iterator15.return) {
                _iterator15.return();
            }
        } finally {
            if (_didIteratorError15) {
                throw _iteratorError15;
            }
        }
    }

    content += '<br><strong>\u65E0\u6548\u9053\u5177\u7EDF\u8BA1\uFF1A</strong><i>\u65E0\u6548\u9053\u5177<span class="pd_stat_extra"><em>+' + invalidItemNum.toLocaleString() + '</em>' + ('(<em title="3\u7EA7\u4EE5\u4E0A\u65E0\u6548\u9053\u5177">+' + highInvalidItemNum.toLocaleString() + '</em>)</span></i> ');
    var _iteratorNormalCompletion16 = true;
    var _didIteratorError16 = false;
    var _iteratorError16 = undefined;

    try {
        for (var _iterator16 = Util.getSortedObjectKeyList(Item.itemTypeList, invalidItemStat)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
            var _itemName4 = _step16.value;

            content += '<i>' + _itemName4 + '<em>+' + invalidItemStat[_itemName4].toLocaleString() + '</em></i> ';
        }
    } catch (err) {
        _didIteratorError16 = true;
        _iteratorError16 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion16 && _iterator16.return) {
                _iterator16.return();
            }
        } finally {
            if (_didIteratorError16) {
                throw _iteratorError16;
            }
        }
    }

    return content;
};

/**
 * 显示导入或导出日志对话框
 */
var showImportOrExportLogDialog = function showImportOrExportLogDialog() {
    var dialogName = 'pdImOrExLogDialog';
    if ($('#' + dialogName).length > 0) return;
    var log = Log.read();
    var html = '\n<div class="pd_cfg_main">\n  <div style="margin-top: 5px;">\n    <label style="color: #f00;"><input type="radio" name="logType" value="setting" checked> \u5BFC\u5165/\u5BFC\u51FA\u65E5\u5FD7</label>\n    <label style="color: #00f;"><input type="radio" name="logType" value="text"> \u5BFC\u51FA\u65E5\u5FD7\u6587\u672C</label>\n  </div>\n  <div data-name="logSetting">\n    <strong>\u5BFC\u5165\u65E5\u5FD7\uFF1A</strong>\u5C06\u65E5\u5FD7\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u5408\u5E76\u6216\u8986\u76D6\u6309\u94AE\u5373\u53EF<br>\n    <strong>\u5BFC\u51FA\u65E5\u5FD7\uFF1A</strong>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF<br>\n    <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>\n  </div>\n  <div data-name="logText" style="display: none;">\n    <strong>\u5BFC\u51FA\u65E5\u5FD7\u6587\u672C</strong>\uFF1A\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF\n    <div>\n      <label title="\u6309\u65F6\u95F4\u987A\u5E8F\u6392\u5E8F"><input type="radio" name="sortType2" value="time" checked> \u6309\u65F6\u95F4</label>\n      <label title="\u6309\u65E5\u5FD7\u7C7B\u522B\u6392\u5E8F"><input type="radio" name="sortType2" value="type"> \u6309\u7C7B\u522B</label>\n      <label title="\u5728\u65E5\u5FD7\u6587\u672C\u91CC\u663E\u793A\u6BCF\u65E5\u4EE5\u53CA\u5168\u90E8\u6570\u636E\u7684\u7EDF\u8BA1\u7ED3\u679C"><input type="checkbox" name="showStat" checked> \u663E\u793A\u7EDF\u8BA1</label>\n    </div>\n    <textarea name="text" style="width: 600px; height: 400px;" readonly></textarea>\n  </div>\n</div>\n<div class="pd_cfg_btns">\n  <button name="merge" type="button">\u5408\u5E76\u65E5\u5FD7</button>\n  <button name="overwrite" type="button" style="color: #f00;">\u8986\u76D6\u65E5\u5FD7</button>\n  <button data-action="close" type="button">\u5173\u95ED</button>\n</div>';

    var $dialog = Dialog.create(dialogName, '导入或导出日志', html);
    $dialog.find('[name="sortType2"], [name="showStat"]').click(function () {
        showLogText(log, $dialog);
        $dialog.find('[name="text"]').select();
    }).end().find('[name="logType"]').click(function () {
        var type = $(this).val();
        $dialog.find('[data-name="log' + (type === 'text' ? 'Setting' : 'Text') + '"]').hide();
        $dialog.find('[data-name="log' + (type === 'text' ? 'Text' : 'Setting') + '"]').show();
        $dialog.find('[data-name="log' + (type === 'text' ? 'Text' : 'Setting') + '"]').select();
    }).end().find('[name="merge"], [name="overwrite"]').click(function (e) {
        e.preventDefault();
        var name = $(this).attr('name');
        if (!confirm('\u662F\u5426\u5C06\u6587\u672C\u6846\u4E2D\u7684\u65E5\u5FD7' + (name === 'overwrite' ? '覆盖' : '合并') + '\u5230\u672C\u5730\u65E5\u5FD7\uFF1F')) return;
        var newLog = $.trim($dialog.find('[name="setting"]').val());
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
    $dialog.find('[name="sortType2"][value="' + Config.logSortType + '"]').prop('checked', true).triggerHandler('click');
    $dialog.find('[name="setting"]').val(JSON.stringify(log)).select().focus();
    Script.runFunc('LogDialog.showImportOrExportLogDialog_after_');
};

/**
 * 显示日志文本
 * @param {{}} log 日志对象
 * @param {jQuery} $dialog 导入或导出日志对话框对象
 */
var showLogText = function showLogText(log, $dialog) {
    var logSortType = $dialog.find('input[name="sortType2"]:checked').val();
    var isShowStat = $dialog.find('[name="showStat"]').prop('checked');
    var content = '',
        lastDate = '';
    var _iteratorNormalCompletion17 = true;
    var _didIteratorError17 = false;
    var _iteratorError17 = undefined;

    try {
        for (var _iterator17 = Object.keys(log)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
            var date = _step17.value;

            if (!Array.isArray(log[date])) continue;
            if (lastDate > date) lastDate = date;
            content += '\u3010' + date + '\u3011(\u5171' + log[date].length + '\u9879)\n' + (logSortType === 'type' ? '' : '\n') + getLogContent(log, date, logSortType).replace(/<h3>/g, '\n').replace(/<\/h3>/g, '\n').replace(/<\/p>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '').replace(/`/g, '');
            if (isShowStat) {
                content += '-'.repeat(46) + '\n\u5408\u8BA1\uFF1A\n' + getLogStat(log, date, 'current').replace(/<br\s*\/?>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '') + '\n';
            }
            content += '='.repeat(46) + '\n';
        }
    } catch (err) {
        _didIteratorError17 = true;
        _iteratorError17 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion17 && _iterator17.return) {
                _iterator17.return();
            }
        } finally {
            if (_didIteratorError17) {
                throw _iteratorError17;
            }
        }
    }

    if (content && isShowStat) {
        content += '\n总计：\n' + getLogStat(log, lastDate, 'all').replace(/<br\s*\/?>/g, '\n').replace(/(<.+?>|<\/.+?>)/g, '');
    }
    $dialog.find('[name="text"]').val(content);
};

},{"./Config":4,"./Dialog":7,"./Item":10,"./Log":11,"./Script":20,"./Util":22}],13:[function(require,module,exports){
/* 争夺模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addUserLinkInPkListPage = exports.checkLoot = exports.getLevelInfoList = exports.getLevelInfo = exports.getLogList = exports.getLog = exports.lootAttack = exports.getRealProperty = exports.enhanceLootIndexPage = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// 争夺首页区域
var $lootArea = void 0;
// 争夺属性区域
var $properties = void 0;
// 点数区域
var $points = void 0;
// 争夺记录区域容器
var $logBox = void 0;
// 争夺记录区域
var $log = void 0;
// 争夺记录
var log = '';
// 各层争夺记录列表
var logList = [];
// 各层战斗信息列表
var levelInfoList = [];
// 当前争夺属性
var propertyList = new Map();
// 道具加成点数列表
var extraPointList = new Map();
// 道具使用情况列表
var itemUsedNumList = new Map();
// 点数分配记录列表
var pointsLogList = [];

/**
 * 增强争夺首页
 */
var enhanceLootIndexPage = exports.enhanceLootIndexPage = function enhanceLootIndexPage() {
    $lootArea = $('.kf_fw_ig1:first');
    $properties = $lootArea.find('> tbody > tr:nth-child(2) > td:first-child');
    $points = $lootArea.find('> tbody > tr:nth-child(2) > td:nth-child(2)');
    propertyList = getLootPropertyList();
    extraPointList = getExtraPointList();
    itemUsedNumList = Item.getItemUsedInfo($lootArea.find('> tbody > tr:nth-child(3) > td').html());

    $logBox = $('#pk_text_div');
    $log = $('#pk_text');
    log = $log.html();
    logList = getLogList(log);
    levelInfoList = getLevelInfoList(logList);
    pointsLogList = getTempPointsLogList(logList);

    handlePropertiesArea();
    handlePointsArea();
    addLevelPointListSelect();
    addAttackBtns();

    if (log.includes('本日无争夺记录')) $log.html(log.replace(/点击这里/g, '点击上方的攻击按钮').replace('战斗记录框内任意地方点击自动战斗下一层', '请点击上方的攻击按钮开始争夺战斗'));
    addLootLogHeader();
    showLogStat(levelInfoList);

    if (Config.autoLootEnabled && !/你被击败了/.test(log) && !Util.getCookie(_Const2.default.lootAttackingCookieName)) {
        $(document).ready(setTimeout(autoLoot, 500));
    }
};

/**
 * 处理争夺属性区域
 */
var handlePropertiesArea = function handlePropertiesArea() {
    var tipsIntro = '灵活和智力的抵消机制：\n战斗开始前，会重新计算战斗双方的灵活和智力；灵活=(自己的灵活值-(双方灵活值之和 x 33%))；智力=(自己的智力值-(双方智力值之和 x 33%))';
    var html = $properties.html().replace(/(攻击力：)(\d+)/, '$1<span id="pdPro_s1" title="原值：$2">$2</span> <span id="pdNew_s1"></span>').replace(/(生命值：)(\d+)\s*\(最大(\d+)\)/, '$1<span id="pdCurrentLife">$2</span> (最大<span id="pdPro_s2" title="原值：$3">$3</span>) <span id="pdNew_s2"></span>').replace(/(攻击速度：)(\d+)/, '$1<span id="pdPro_d1" title="原值：$2">$2</span> <span id="pdNew_d1"></span>').replace(/(暴击几率：)(\d+)%\s*\(抵消机制见说明\)/, '$1<span id="pdPro_d2" title="\u539F\u503C\uFF1A$2">$2</span>% <span class="pd_cfg_tips" id="pdReal_d2" style="color: #666;"></span> ' + ('<span id="pdNew_d2"></span> <span class="pd_cfg_tips" title="' + tipsIntro + '">[?]</span>')).replace(/(技能释放概率：)(\d+)%\s*\(抵消机制见说明\)/, '$1<span id="pdPro_i1" title="\u539F\u503C\uFF1A$2">$2</span>% <span class="pd_cfg_tips" id="pdReal_i1" style="color: #666;"></span> ' + ('<span id="pdNew_i1"></span> <span class="pd_cfg_tips" title="' + tipsIntro + '">[?]</span>')).replace(/(防御：)(\d+)%减伤/, '$1<span id="pdPro_i2" title="原值：$2">$2</span>%减伤 <span id="pdNew_i2"></span>').replace('技能伤害：攻击+(体质*5)+(智力*5)', '技能伤害：<span class="pd_custom_tips" id="pdSkillAttack" title="技能伤害：攻击+(体质*5)+(智力*5)"></span>');
    $properties.html(html).find('br:first').after('<span>剩余属性点：<span id="pdSurplusPoint"></span></span><br>');

    $properties.on('click', '[id^="pdPro_"]', function () {
        var $this = $(this);
        $this.hide();
        var name = $this.attr('id').replace('pdPro_', '');
        var step = 1;
        if (name === 's1') step = 5;else if (name === 's2') step = 20;else if (name === 'd1') step = 2;
        $('<input class="pd_input" data-name="' + name + '" type="number" value="' + parseInt($this.text()) + '" min="1" step="' + step + '" ' + ('style="width: 65px; margin-right: 5px;" title="' + $this.attr('title') + '">')).insertAfter($this).focus().select().blur(function () {
            var $this = $(this);
            var name = $this.data('name');
            var num = parseInt($this.val());
            if (num > 0) {
                $points.find('[name="' + name + '"]').val(getPointByProperty(getPointNameByFieldName(name), num)).trigger('change');
            }
            $this.prev().show().end().remove();
        }).keydown(function (e) {
            var $this = $(this);
            if (e.keyCode === 13) $this.blur();else if (e.keyCode === 27) $this.val('').blur();
        });
    }).find('[id^=pdPro_]').css('cursor', 'pointer');
};

/**
 * 处理点数区域
 */
var handlePointsArea = function handlePointsArea() {
    $points.find('[type="text"]:not([readonly])').attr('type', 'number').attr('min', 1).attr('max', 9999).prop('required', true).css('width', '60px').addClass('pd_point');
    $points.find('input[readonly]').attr('type', 'number').prop('disabled', true).css('width', '60px');

    /**
     * 显示各项点数的和值
     * @param {jQuery} $point 点数字段对象
     */
    var showSumOfPoint = function showSumOfPoint($point) {
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        var extraNum = parseInt($point.next('span').text());
        var $sum = $point.next('span').next('.pd_point_sum');
        if (!$sum.length) {
            $sum = $('<span class="pd_point_sum" style="color: #ff0033; cursor: pointer;" title="点击：给该项加上或减去剩余属性点"></span>').insertAfter($point.next('span'));
        }
        $sum.text('=' + (num + extraNum));
    };

    $points.on('change', '.pd_point', function () {
        var $this = $(this);
        var surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
        $('#pdSurplusPoint').text(surplusPoint).css('color', surplusPoint !== 0 ? '#f00' : '#000').css('font-weight', surplusPoint !== 0 ? 'bold' : 'normal');
        showNewLootProperty($this);
        showSumOfPoint($this);
        $('#pdSkillAttack').text(getSkillAttack(parseInt($lootArea.find('[name="s1"]').val()), parseInt($lootArea.find('[name="s2"]').val()), parseInt($lootArea.find('[name="i1"]').val())));
    }).on('click', '.pd_point_sum', function () {
        var surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
        if (!surplusPoint) return;
        var $point = $(this).prev('span').prev('.pd_point');
        if (!$point.length) return;
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        num = num + surplusPoint;
        $point.val(num < 1 ? 1 : num).trigger('change');
    }).find('form').submit(function () {
        return checkPoints($points);
    }).find('.pd_point').trigger('change');
};

/**
 * 检查点数设置
 * @param {jQuery} $points 点数字段对象
 * @returns {boolean} 检查结果
 */
var checkPoints = function checkPoints($points) {
    var surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
    if (surplusPoint < 0) {
        alert('剩余属性点为负，请重新填写');
        return false;
    } else if (surplusPoint > 0) {
        return confirm('可分配属性点尚未用完，是否继续？');
    }
    return true;
};

/**
 * 获取争夺属性列表
 * @returns {Map} 争夺属性
 */
var getLootPropertyList = function getLootPropertyList() {
    var propertyList = new Map([['攻击力', 0], ['生命值', 0], ['最大生命值', 0], ['攻击速度', 0], ['暴击几率', 0], ['技能伤害', 0], ['技能释放概率', 0], ['防御', 0], ['可分配属性点', 0]]);
    var content = $properties.text();
    var matches = /攻击力：(\d+)/.exec(content);
    if (matches) propertyList.set('攻击力', parseInt(matches[1]));
    matches = /生命值：(\d+)\s*\(最大(\d+)\)/.exec(content);
    if (matches) {
        propertyList.set('生命值', parseInt(matches[1]));
        propertyList.set('最大生命值', parseInt(matches[2]));
    }
    matches = /攻击速度：(\d+)/.exec(content);
    if (matches) propertyList.set('攻击速度', parseInt(matches[1]));
    matches = /暴击几率：(\d+)%/.exec(content);
    if (matches) propertyList.set('暴击几率', parseInt(matches[1]));
    matches = /技能伤害：(\d+)/.exec(content);
    if (matches) propertyList.set('技能伤害', parseInt(matches[1]));
    matches = /技能释放概率：(\d+)%/.exec(content);
    if (matches) propertyList.set('技能释放概率', parseInt(matches[1]));
    matches = /防御：(\d+)%/.exec(content);
    if (matches) propertyList.set('防御', parseInt(matches[1]));
    matches = /可分配属性点：(\d+)/.exec(content);
    if (matches) propertyList.set('可分配属性点', parseInt(matches[1]));
    return propertyList;
};

/**
 * 获取当前已分配的点数
 * @param {jQuery} $points 点数字段对象
 * @param {number} type 类型，0：仅点数；1：点数+道具
 * @returns {number} 当前已分配的点数
 */
var getCurrentAssignedPoint = function getCurrentAssignedPoint($points) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var usedPoint = 0;
    $points.each(function () {
        var $this = $(this);
        var name = $this.attr('name');
        var point = parseInt($this.val());
        if (point && point > 0) usedPoint += point - (type === 1 ? extraPointList.get(getPointNameByFieldName(name)) : 0);
    });
    return usedPoint;
};

/**
 * 获取技能伤害的值
 * @param {number} s1 力量
 * @param {number} s2 体质
 * @param {number} i1 智力
 * @param {number} type 类型，0：仅点数；1：点数+道具
 * @returns {number} 技能伤害的值
 */
var getSkillAttack = function getSkillAttack(s1, s2, i1) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    return (s1 + (type === 1 ? 0 : extraPointList.get('力量'))) * 5 + (s2 - (type === 1 ? extraPointList.get('体质') : 0)) * 5 + (i1 - (type === 1 ? extraPointList.get('智力') : 0)) * 5;
};

/**
 * 获取附加点数列表
 * @returns {Map} 附加点数列表
 */
var getExtraPointList = function getExtraPointList() {
    var extraPointList = new Map([['力量', 0], ['体质', 0], ['敏捷', 0], ['灵活', 0], ['智力', 0], ['意志', 0], ['耐力', 0], ['幸运', 0]]);
    $points.find('[type="text"]').each(function () {
        var $this = $(this);
        var name = $this.attr('name');
        var num = parseInt($this.next('span').text());
        var key = getPointNameByFieldName(name);
        if (!isNaN(num) && key) {
            extraPointList.set(key, num);
        }
    });
    return extraPointList;
};

/**
 * 根据字段名称获取点数名称
 * @param {string} fieldName 字段名称
 * @returns {string} 点数名称
 */
var getPointNameByFieldName = function getPointNameByFieldName(fieldName) {
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
 * 根据点数名称获取字段名称
 * @param {string} pointName 点数名称
 * @returns {string} 字段名称
 */
var getFieldNameByPointName = function getFieldNameByPointName(pointName) {
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
 * @param {jQuery} $point 点数字段对象
 */
var showNewLootProperty = function showNewLootProperty($point) {
    var name = $point.attr('name');
    var pointName = getPointNameByFieldName(name);
    var point = parseInt($point.val());
    if (isNaN(point) || point < 0) point = 0;
    var oriPoint = parseInt($point.get(0).defaultValue);
    var newValue = getPropertyByPoint(pointName, point),
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
    $properties.find('#pdPro_' + name).text(newValue).css('color', point !== oriPoint ? '#00f' : '#000');

    if (pointName === '灵活' || pointName === '智力') {
        var nextLevel = getCurrentLevel(logList) + 1;
        var text = '';
        if (nextLevel % 10 === 0) {
            text = getRealProperty(pointName, point + extraPointList.get(pointName), nextLevel, 'BOSS') + '%';
        } else {
            text = getRealProperty(pointName, point + extraPointList.get(pointName), nextLevel, '普通') + '%';
            text += '|' + getRealProperty(pointName, point + extraPointList.get(pointName), nextLevel, '快速') + '%';
        }
        $properties.find('#pdReal_' + name).text('(' + text + ')').attr('title', '\u7B2C' + nextLevel + '\u5C42\u7684\u5B9E\u9645' + (pointName === '灵活' ? '暴击几率' : '技能释放概率') + ' (' + (nextLevel % 10 === 0 ? 'BOSS' : '普通|快速') + ')');
    }

    if (point !== oriPoint) $properties.find('#pdNew_' + name).text('(' + ((diffValue >= 0 ? '+' : '') + diffValue) + ')').css('color', diffValue >= 0 ? '#f03' : '#393');else $properties.find('#pdNew_' + name).text('');
};

/**
 * 根据指定的点数获得相应争夺属性的值
 * @param {string} pointName 点数名称
 * @param {number} point 点数的值
 * @param {number} type 类型，0：仅点数；1：点数+道具
 * @returns {number} 争夺属性的值
 */
var getPropertyByPoint = function getPropertyByPoint(pointName, point) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var extraPoint = extraPointList.get(pointName);
    if (!extraPoint || type === 1) extraPoint = 0;
    var value = 0;
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
 * 根据指定的争夺属性获得相应点数的值
 * @param {string} pointName 点数名称
 * @param {number} num 争夺属性的值
 * @param {number} type 类型，0：仅点数；1：点数+道具
 * @returns {number} 点数的值
 */
var getPointByProperty = function getPointByProperty(pointName, num) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var value = 0;
    var extraPoint = extraPointList.get(pointName);
    if (!extraPoint || type === 1) extraPoint = 0;
    switch (pointName) {
        case '力量':
            value = Math.ceil(num / 5) - extraPoint;
            break;
        case '体质':
            value = Math.ceil((itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? num - 700 : num) / 20) - extraPoint;
            break;
        case '敏捷':
            value = Math.ceil((itemUsedNumList.get('十六夜同人漫画') === 50 ? num - 100 : num) / 2) - extraPoint;
            break;
        case '灵活':
            value = Math.ceil(100 * num / (100 - num)) - extraPoint;
            break;
        case '智力':
            value = Math.ceil(90 * num / (100 - num)) - extraPoint;
            break;
        case '意志':
            value = Math.ceil(150 * num / (100 - num)) - extraPoint;
            break;
    }
    if (!isFinite(value) || value < 1) value = 1;
    if (type === 1 && value <= extraPointList.get(pointName)) value = extraPointList.get(pointName) + 1;
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
var getRealProperty = exports.getRealProperty = function getRealProperty(pointName, totalPoint, level, enemy) {
    var npcStepNum = 2; // NPC递增数值
    var antiCoefficient = 3; // 抵消系数
    var coefficient = { '普通': 1, '强壮': 1, '快速': 1.5, '脆弱': 1, '缓慢': 1, 'BOSS': 1.2 }; // NPC强化系数列表
    var cardinalNum = pointName === '灵活' ? 100 : 90; // 基数

    var npcPoint = Math.round(level * npcStepNum * coefficient[enemy]);
    var realPoint = Math.max(totalPoint - Math.round((npcPoint + totalPoint) / antiCoefficient), 0);
    return Math.round(realPoint / (realPoint + cardinalNum) * 100);
};

/**
 * 添加各层点数分配方案选择框
 */
var addLevelPointListSelect = function addLevelPointListSelect() {
    $('\n<select id="pdLevelPointListSelect" style="margin: 5px 0;">\n  <option>\u70B9\u6570\u5206\u914D\u65B9\u6848' + (Config.levelPointList.type == 1 ? '(*)' : '') + '</option>\n  <option value="0">\u9ED8\u8BA4</option>\n</select>\n<a class="pd_btn_link" data-name="save" href="#" title="\u5C06\u5F53\u524D\u70B9\u6570\u8BBE\u7F6E\u4FDD\u5B58\u4E3A\u65B0\u7684\u65B9\u6848">\u4FDD\u5B58</a>\n<a class="pd_btn_link" data-name="edit" href="#" title="\u7F16\u8F91\u5404\u5C42\u70B9\u6570\u5206\u914D\u65B9\u6848">\u7F16\u8F91</a><br>\n').prependTo($points).filter('#pdLevelPointListSelect').change(function () {
        var level = parseInt($(this).val());
        if (level > 0) {
            var _ret = function () {
                var points = Config.levelPointList[parseInt(level)];
                if ((typeof points === 'undefined' ? 'undefined' : _typeof(points)) !== 'object') return {
                        v: void 0
                    };
                $points.find('.pd_point').each(function () {
                    var $this = $(this);
                    var pointName = getPointNameByFieldName($this.attr('name'));
                    $this.val(points[pointName] - (Config.levelPointList.type === 1 ? extraPointList.get(pointName) : 0));
                }).trigger('change');
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else if (level === 0) {
            $points.find('.pd_point').each(function () {
                $(this).val(this.defaultValue);
            }).trigger('change');
        }
    }).end().filter('[data-name="save"]').click(function (e) {
        e.preventDefault();
        if (!checkPoints($points)) return;
        var $levelPointListSelect = $('#pdLevelPointListSelect');
        var level = parseInt($levelPointListSelect.val());
        level = parseInt(prompt('请输入层数：', level ? level : ''));
        if (!level || level < 0) return;

        (0, _Config.read)();
        if (level in Config.levelPointList) {
            if (!confirm('该层数已存在，是否覆盖？')) return;
        }
        var points = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Array.from($points.find('.pd_point'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                var $elem = $(elem);
                var point = parseInt($elem.val());
                if (!point || point < 0) return;
                var pointName = getPointNameByFieldName($elem.attr('name'));
                points[pointName] = point + (Config.levelPointList.type === 1 ? extraPointList.get(pointName) : 0);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        Config.levelPointList[level] = points;
        (0, _Config.write)();
        setLevelPointListSelect(Config.levelPointList);
        $levelPointListSelect.val(level);
    }).end().filter('[data-name="edit"]').click(function (e) {
        e.preventDefault();
        showLevelPointListConfigDialog();
    });
    setLevelPointListSelect(Config.levelPointList);
};

/**
 * 设置各层点数分配方案选择框
 * @param {{}} levelPointList 各层点数分配列表
 */
var setLevelPointListSelect = function setLevelPointListSelect(levelPointList) {
    var pointListHtml = '';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(levelPointList)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var level = _step2.value;

            if (!$.isNumeric(level)) continue;
            pointListHtml += '<option value="' + level + '">\u7B2C' + level + '\u5C42</option>';
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    $('#pdLevelPointListSelect').find('option:first').text('点数分配方案' + (Config.levelPointList.type === 1 ? '(*)' : '')).end().find('option:gt(1)').remove().end().append(pointListHtml);
};

/**
 * 显示各层点数分配方案对话框
 */
var showLevelPointListConfigDialog = function showLevelPointListConfigDialog(callback) {
    var dialogName = 'pdLevelPointListConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    var html = '\n<div class="pd_cfg_main">\n  <div style="margin: 5px 0; line-height: 1.6em;">\n    \u8BF7\u586B\u5199\u5404\u5C42\u5BF9\u5E94\u7684\u70B9\u6570\u5206\u914D\u65B9\u6848\uFF0C\u76F8\u90BB\u5C42\u6570\u5982\u6570\u503C\u5B8C\u5168\u76F8\u540C\u7684\u8BDD\uFF0C\u5219\u53EA\u4FDD\u7559\u6700\u524D\u9762\u7684\u4E00\u5C42<br>\n    \uFF08\u4F8B\uFF1A11-19\u5C42\u70B9\u6570\u76F8\u540C\u7684\u8BDD\uFF0C\u5219\u53EA\u4FDD\u7559\u7B2C11\u5C42\uFF09<br>\n    \u81EA\u5B9A\u4E49\u70B9\u6570\u5206\u914D\u65B9\u6848\u811A\u672C\u7684\u53C2\u8003\u8303\u4F8B\u8BF7\u53C2\u89C1<a href="read.php?tid=500968&spid=13270735" target="_blank">\u6B64\u8D3453\u697C</a><br>\n    <label class="pd_highlight" style="line-height: 2em;">\n      \u4FDD\u5B58\u65B9\u5F0F\uFF1A <select name="saveType"><option value="0">\u4EC5\u70B9\u6570</option><option value="1">\u70B9\u6570+\u9053\u5177</option></select>\n      <span class="pd_cfg_tips" title="\u5404\u5C42\u70B9\u6570\u5206\u914D\u65B9\u6848\u4E2D\u6570\u503C\u7684\u4FDD\u5B58\u65B9\u5F0F\uFF0C\u4EC5\u70B9\u6570\uFF1A\u4EC5\u6309\u7167\u70B9\u6570\u6765\u4FDD\u5B58\uFF1B\u70B9\u6570+\u9053\u5177\uFF1A\u6309\u7167\u70B9\u6570\u4E0E\u9053\u5177\u52A0\u6210\u4E4B\u548C\u6765\u4FDD\u5B58">[?]</span>\n    </label>\n  </div>\n  <div style="overflow-y: auto; max-height: 400px;">\n    <table id="pdLevelPointList" style="text-align: center; white-space: nowrap;">\n      <tbody>\n        <tr><th></th><th>\u5C42\u6570</th><th>\u529B\u91CF</th><th>\u4F53\u8D28</th><th>\u654F\u6377</th><th>\u7075\u6D3B</th><th>\u667A\u529B</th><th>\u610F\u5FD7</th><th></th></tr>\n      </tbody>\n    </table>\n  </div>\n  <hr>\n  <div style="float: left; line-height: 27px;">\n    <a class="pd_btn_link" data-name="selectAll" href="#">\u5168\u9009</a>\n    <a class="pd_btn_link" data-name="selectInverse" href="#">\u53CD\u9009</a>\n    <a class="pd_btn_link pd_highlight" data-name="add" href="#">\u589E\u52A0</a>\n    <a class="pd_btn_link" data-name="deleteSelect" href="#">\u5220\u9664</a>\n  </div>\n  <div data-id="modifyArea" style="float: right;">\n    <input name="s1" type="text" maxlength="5" title="\u529B\u91CF" placeholder="\u529B\u91CF" style="width: 35px;">\n    <input name="s2" type="text" maxlength="5" title="\u4F53\u8D28" placeholder="\u4F53\u8D28" style="width: 35px;">\n    <input name="d1" type="text" maxlength="5" title="\u654F\u6377" placeholder="\u654F\u6377" style="width: 35px;">\n    <input name="d2" type="text" maxlength="5" title="\u7075\u6D3B" placeholder="\u7075\u6D3B" style="width: 35px;">\n    <input name="i1" type="text" maxlength="5" title="\u667A\u529B" placeholder="\u667A\u529B" style="width: 35px;">\n    <input name="i2" type="text" maxlength="5" title="\u610F\u5FD7" placeholder="\u610F\u5FD7" style="width: 35px;">\n    <a class="pd_btn_link" data-name="clear" href="#" title="\u6E05\u7A7A\u5404\u4FEE\u6539\u5B57\u6BB5">\u6E05\u7A7A</a>\n    <button type="button" name="modify">\u4FEE\u6539</button>\n    <span class="pd_cfg_tips" title="\u53EF\u5C06\u6240\u9009\u62E9\u7684\u5C42\u6570\u7684\u76F8\u5E94\u5C5E\u6027\u4FEE\u6539\u4E3A\u6307\u5B9A\u7684\u6570\u503C\uFF1B\u6570\u5B57\u524D\u53EF\u8BBE+/-\u53F7\uFF0C\u8868\u793A\u589E\u52A0/\u51CF\u5C11\u76F8\u5E94\u6570\u91CF\uFF1B\u4F8B\uFF1A100\u3001+5\u6216-2">[?]</span>\n  </div>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"><a data-name="openImOrExLevelPointListConfigDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u5206\u914D\u65B9\u6848</a></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '各层点数分配方案', html, 'min-width: 665px;');
    var $levelPointList = $dialog.find('#pdLevelPointList > tbody');
    var saveType = Config.levelPointList.type === 1 ? 1 : 0;

    /**
     * 添加各层点数分配的HTML
     * @param {number} level 层数
     * @param {{}} points 点数对象
     */
    var addLevelPointHtml = function addLevelPointHtml(level, points) {
        var $points = $('\n<tr>\n  <td style="width: 25px; text-align: left;"><input type="checkbox"></td>\n  <td style="text-align: left;">\n    <label style="margin-right: 8px;">\n      \u7B2C <input name="level" type="text" value="' + (level ? level : '') + '" style="width: 30px;"> \u5C42\n    </label>\n  </td>\n  <td><input class="pd_point" name="s1" type="number" value="' + points['力量'] + '" style="width: 50px;" required></td>\n  <td><input class="pd_point" name="s2" type="number" value="' + points['体质'] + '" style="width: 50px;" required></td>\n  <td><input class="pd_point" name="d1" type="number" value="' + points['敏捷'] + '" style="width: 50px;" required></td>\n  <td><input class="pd_point" name="d2" type="number" value="' + points['灵活'] + '" style="width: 50px;" required></td>\n  <td><input class="pd_point" name="i1" type="number" value="' + points['智力'] + '" style="width: 50px;" required></td>\n  <td><input class="pd_point" name="i2" type="number" value="' + points['意志'] + '" style="width: 50px;" required></td>\n  <td style="text-align: left;"><a class="pd_btn_link" data-name="delete" href="#">\u5220\u9664</a></td>\n</tr>\n<tr>\n  <td></td>\n  <td class="pd_custom_tips" title="\u5269\u4F59\u5C5E\u6027\u70B9">\u5269\u4F59\uFF1A<span data-id="surplusPoint">0</span></td>\n  <td title="\u653B\u51FB\u529B">\n    \u653B\uFF1A<span data-id="pro_s1" style="cursor: pointer;">0</span> <a data-id="opt_s1" href="#" title="\u70B9\u51FB\uFF1A\u7ED9\u8BE5\u9879\u52A0\u4E0A\u6216\u51CF\u53BB\u5269\u4F59\u5C5E\u6027\u70B9">&#177;</a>\n  </td>\n  <td title="\u6700\u5927\u751F\u547D\u503C">\n    \u547D\uFF1A<span data-id="pro_s2" style="cursor: pointer;">0</span> <a data-id="opt_s2" href="#" title="\u70B9\u51FB\uFF1A\u7ED9\u8BE5\u9879\u52A0\u4E0A\u6216\u51CF\u53BB\u5269\u4F59\u5C5E\u6027\u70B9">&#177;</a>\n  </td>\n  <td title="\u653B\u51FB\u901F\u5EA6">\n    \u901F\uFF1A<span data-id="pro_d1" style="cursor: pointer;">0</span> <a data-id="opt_d1" href="#" title="\u70B9\u51FB\uFF1A\u7ED9\u8BE5\u9879\u52A0\u4E0A\u6216\u51CF\u53BB\u5269\u4F59\u5C5E\u6027\u70B9">&#177;</a>\n  </td>\n  <td title="\u66B4\u51FB\u51E0\u7387">\n    \u66B4\uFF1A<span data-id="pro_d2" style="cursor: pointer;">0</span>% <a data-id="opt_d2" href="#" title="\u70B9\u51FB\uFF1A\u7ED9\u8BE5\u9879\u52A0\u4E0A\u6216\u51CF\u53BB\u5269\u4F59\u5C5E\u6027\u70B9">&#177;</a>\n  </td>\n  <td title="\u6280\u80FD\u91CA\u653E\u6982\u7387">\n    \u6280\uFF1A<span data-id="pro_i1" style="cursor: pointer;">0</span>% <a data-id="opt_i1" href="#" title="\u70B9\u51FB\uFF1A\u7ED9\u8BE5\u9879\u52A0\u4E0A\u6216\u51CF\u53BB\u5269\u4F59\u5C5E\u6027\u70B9">&#177;</a>\n  </td>\n  <td title="\u9632\u5FA1\u51CF\u4F24">\n    \u9632\uFF1A<span data-id="pro_i2" style="cursor: pointer;">0</span>% <a data-id="opt_i2" href="#" title="\u70B9\u51FB\uFF1A\u7ED9\u8BE5\u9879\u52A0\u4E0A\u6216\u51CF\u53BB\u5269\u4F59\u5C5E\u6027\u70B9">&#177;</a>\n  </td>\n  <td class="pd_custom_tips" title="\u6280\u80FD\u4F24\u5BB3\uFF1A\u653B\u51FB+(\u4F53\u8D28*5)+(\u667A\u529B*5)">\u6280\u4F24\uFF1A<span data-id="skillAttack">0</span></td>\n</tr>\n').appendTo($levelPointList).find('.pd_point').trigger('change');
        setPointsRange($points);
    };

    /**
     * 设置各点数字段的取值范围
     * @param {jQuery} $points 点数字段集合
     */
    var setPointsRange = function setPointsRange($points) {
        $points.each(function () {
            var $this = $(this);
            var name = $this.attr('name');
            if (saveType === 1) $this.attr('min', extraPointList.get(getPointNameByFieldName(name)) + 1).removeAttr('max');else $this.attr('min', 1).attr('max', 9999);
        });
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        (0, _Config.read)();
        var levelPointList = {};
        var prevPoints = {};
        var isError = false,
            isSurplus = false;
        if (saveType === 1) levelPointList.type = 1;
        $levelPointList.find('tr:gt(0)').each(function () {
            var $this = $(this);
            if (!$this.find('.pd_point').length) return;
            var surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($this.find('.pd_point'), saveType);
            if (surplusPoint > 0) isSurplus = true;else if (surplusPoint < 0) {
                isError = true;
                return false;
            }

            var level = parseInt($this.find('[name="level"]').val());
            if (!level || level < 0) return;
            var points = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Array.from($this.find('.pd_point'))[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var elem = _step3.value;

                    var $elem = $(elem);
                    var point = parseInt($elem.val());
                    if (!point || point < 0) return;
                    points[getPointNameByFieldName($elem.attr('name'))] = point;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
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
        var points = { '力量': 1, '体质': 1, '敏捷': 1, '灵活': 1, '智力': 1, '意志': 1 };
        if (saveType === 1) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = extraPointList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _step4$value = _slicedToArray(_step4.value, 2),
                        key = _step4$value[0],
                        num = _step4$value[1];

                    if (key in points) points[key] = num + 1;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
        addLevelPointHtml(0, points);
        $levelPointList.find('[name="level"]:last').focus();
        Dialog.resize(dialogName);
    }).end().find('[data-name="deleteSelect"]').click(function (e) {
        e.preventDefault();
        var $checked = $levelPointList.find('[type="checkbox"]:checked');
        if (!$checked.length || !confirm('是否删除所选层数？')) return;
        var $line = $checked.closest('tr');
        $line.next('tr').addBack().remove();
        Dialog.resize(dialogName);
    }).end().find('[data-name="openImOrExLevelPointListConfigDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('各层点数分配方案', 'levelPointList', null, function () {
            $('#pdLevelPointListConfigDialog').remove();
            showLevelPointListConfigDialog(function ($dialog) {
                return $dialog.submit();
            });
        });
    }).end().find('[data-name="selectAll"]').click(function () {
        return Util.selectAll($levelPointList.find('[type="checkbox"]'));
    }).end().find('[data-name="selectInverse"]').click(function () {
        return Util.selectInverse($levelPointList.find('[type="checkbox"]'));
    });

    $levelPointList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        var $line = $(this).closest('tr');
        $line.next('tr').addBack().remove();
        Dialog.resize(dialogName);
    }).on('change', '.pd_point', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var point = parseInt($this.val());
        if (!point || point < 0) return;

        var $points = $this.closest('tr');
        var $properties = $points.next('tr');
        $properties.find('[data-id="pro_' + name + '"]').text(getPropertyByPoint(getPointNameByFieldName(name), point, saveType)).end().find('[data-id="skillAttack"]').text(getSkillAttack(parseInt($points.find('[name="s1"]').val()), parseInt($points.find('[name="s2"]').val()), parseInt($points.find('[name="i1"]').val()), saveType));

        var surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'), saveType);
        $properties.find('[data-id="surplusPoint"]').text(surplusPoint).css('color', surplusPoint !== 0 ? '#f00' : '#000');
    }).on('click', '[data-id^="pro_"]', function () {
        var $this = $(this);
        var name = $this.data('id').replace('pro_', '');
        var num = parseInt(prompt('请输入数值：', $this.text()));
        if (!num || num < 0) return;
        $this.closest('tr').prev('tr').find('[name="' + name + '"]').val(getPointByProperty(getPointNameByFieldName(name), num, saveType)).trigger('change');
    }).on('click', '[data-id^="opt_"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        var name = $this.data('id').replace('opt_', '');
        var $points = $this.closest('tr').prev('tr');
        var surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'), saveType);
        if (!surplusPoint) return;
        var $point = $points.find('[name="' + name + '"]');
        if (!$point.length) return;
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        num = num + surplusPoint;
        var min = parseInt($point.attr('min'));
        $point.val(num < min ? min : num).trigger('change');
    });

    $dialog.find('[name="saveType"]').change(function () {
        saveType = parseInt($(this).val());
        setPointsRange($levelPointList.find('.pd_point'));
        $dialog.find('.pd_point').each(function () {
            var $this = $(this);
            var name = $this.attr('name');
            var point = parseInt($this.val());
            if (!point || point < 0) point = 0;
            if (saveType === 1) point += extraPointList.get(getPointNameByFieldName(name));else point -= extraPointList.get(getPointNameByFieldName(name));
            $this.val(point);
        }).trigger('change');
    }).end().find('[name="modify"]').click(function () {
        var $checked = $levelPointList.find('[type="checkbox"]:checked');
        if (!$checked.length) return;
        var data = {};
        $dialog.find('[data-id="modifyArea"] [type="text"]').each(function () {
            var $this = $(this);
            var name = $this.attr('name');
            var value = $.trim($this.val());
            if (!value) return;
            var matches = /^(-|\+)?(\d+)$/.exec(value);
            if (!matches) {
                alert('格式不正确');
                $this.select().focus();
            }
            data[name] = {};
            if (typeof matches[1] !== 'undefined') data[name].action = matches[1] === '+' ? 'add' : 'minus';else data[name].action = 'equal';
            data[name].value = parseInt(matches[2]);
        });
        $checked.each(function () {
            var $points = $(this).closest('tr');
            $points.find('.pd_point').each(function () {
                var $this = $(this);
                var name = $this.attr('name');
                if (!(name in data)) return;
                if (data[name].action !== 'equal') {
                    var point = parseInt($this.val());
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

    $dialog.find('[name="saveType"]').val(saveType);
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = Util.entries(Config.levelPointList)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = _slicedToArray(_step5.value, 2),
                level = _step5$value[0],
                points = _step5$value[1];

            if (!$.isNumeric(level)) continue;
            addLevelPointHtml(level, points);
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    Dialog.show(dialogName);
    if (typeof callback === 'function') callback($dialog);
};

/**
 * 添加攻击相关按钮
 */
var addAttackBtns = function addAttackBtns() {
    var safeId = Public.getSafeId();
    if (!safeId) return;
    $logBox.off('click');

    $('\n<div id="pdAttackBtns" style="line-height: 2.2em; margin-bottom: 5px;">\n  <label>\n    <input class="pd_input" name="autoChangeLevelPointsEnabled" type="checkbox" ' + (Config.autoChangeLevelPointsEnabled ? 'checked' : '') + '>\n    \u81EA\u52A8\u4FEE\u6539\u70B9\u6570\u5206\u914D\u65B9\u6848\n    <span class="pd_cfg_tips" title="\u5728\u653B\u51FB\u65F6\u53EF\u81EA\u52A8\u4FEE\u6539\u4E3A\u76F8\u5E94\u5C42\u6570\u7684\u70B9\u6570\u5206\u914D\u65B9\u6848\uFF08\u4EC5\u9650\u81EA\u52A8\u653B\u51FB\u76F8\u5173\u6309\u94AE\u6709\u6548\uFF09">[?]</span>\n  </label>\n  <label>\n    <input class="pd_input" name="customPointsScriptEnabled" type="checkbox" ' + (Config.customPointsScriptEnabled ? 'checked' : '') + ' \n' + (typeof _Const2.default.getCustomPoints !== 'function' ? 'disabled' : '') + '> \u4F7F\u7528\u81EA\u5B9A\u4E49\u811A\u672C\n    <span class="pd_cfg_tips" title="\u4F7F\u7528\u81EA\u5B9A\u4E49\u70B9\u6570\u5206\u914D\u811A\u672C\uFF08\u4EC5\u9650\u81EA\u52A8\u653B\u51FB\u76F8\u5173\u6309\u94AE\u6709\u6548\uFF0C\u9700\u6B63\u786E\u5B89\u88C5\u81EA\u5B9A\u4E49\u811A\u672C\u540E\u6B64\u9879\u624D\u53EF\u52FE\u9009\uFF09">[?]</span>\n  </label><br>\n  <label>\n    <input class="pd_input" name="unusedPointNumAlertEnabled" type="checkbox" ' + (Config.unusedPointNumAlertEnabled ? 'checked' : '') + '>\n    \u6709\u5269\u4F59\u5C5E\u6027\u70B9\u65F6\u63D0\u9192\n    <span class="pd_cfg_tips" title="\u5728\u653B\u51FB\u65F6\u5982\u6709\u5269\u4F59\u5C5E\u6027\u70B9\u5219\u8FDB\u884C\u63D0\u9192\uFF08\u4EC5\u9650\u81EA\u52A8\u653B\u51FB\u76F8\u5173\u6309\u94AE\u6709\u6548\uFF09">[?]</span>\n  </label>\n  <label>\n    <input class="pd_input" name="slowAttackEnabled" type="checkbox" ' + (Config.slowAttackEnabled ? 'checked' : '') + '> \u6162\u901F\n    <span class="pd_cfg_tips" title="\u5EF6\u957F\u6BCF\u6B21\u653B\u51FB\u7684\u65F6\u95F4\u95F4\u9694\uFF08\u57284~6\u79D2\u4E4B\u95F4\uFF09">[?]</span>\n  </label><br>\n  <button name="autoAttack" type="button" title="\u81EA\u52A8\u653B\u51FB\u5230\u6307\u5B9A\u5C42\u6570">\u81EA\u52A8\u653B\u51FB</button>\n  <button name="onceAttack" type="button" title="\u81EA\u52A8\u653B\u51FB\u4E00\u5C42">\u4E00\u5C42</button>\n  <span style="color: #888;">|</span>\n  <button name="manualAttack" type="button" title="\u624B\u52A8\u653B\u51FB\u4E00\u5C42\uFF0C\u4F1A\u81EA\u52A8\u63D0\u4EA4\u5F53\u524D\u9875\u9762\u4E0A\u7684\u70B9\u6570\u8BBE\u7F6E">\u624B\u52A8\u653B\u51FB</button>\n</div>\n').appendTo($points).on('click', 'button[name$="Attack"]', function () {
        if (/你被击败了/.test(log)) {
            alert('你已经被击败了');
            return;
        }
        if ($('.pd_mask').length > 0) return;
        var $this = $(this);
        var name = $this.attr('name');
        var type = name === 'manualAttack' ? 'manual' : 'auto';
        var targetLevel = 0;
        if (type === 'auto') {
            var value = '+1';
            if (name === 'autoAttack') {
                var prevTargetLevel = $this.data('prevTargetLevel');
                value = $.trim(prompt('攻击到第几层？（0表示攻击到被击败为止，+n表示攻击到当前层数+n层）', prevTargetLevel ? prevTargetLevel : Config.attackTargetLevel));
            }
            if (!/\+?\d+/.test(value)) return;
            if (value.startsWith('+')) {
                var currentLevel = getCurrentLevel(logList);
                targetLevel = currentLevel + parseInt(value);
            } else targetLevel = parseInt(value);
            if (isNaN(targetLevel) || targetLevel < 0) return;
            if (name === 'autoAttack') $this.data('prevTargetLevel', value);
        }
        Msg.destroy();
        $('#pdLootLogHeader').find('[data-name="end"]').click();
        var autoChangePointsEnabled = (Config.autoChangeLevelPointsEnabled || Config.customPointsScriptEnabled && typeof _Const2.default.getCustomPoints === 'function') && type === 'auto';
        if (!autoChangePointsEnabled && !checkPoints($points)) return;
        lootAttack({ type: type, targetLevel: targetLevel, autoChangePointsEnabled: autoChangePointsEnabled, safeId: safeId });
    }).on('click', '.pd_cfg_tips', function () {
        return false;
    }).on('click', '[type="checkbox"]', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var checked = $this.prop('checked');
        if (name in Config && Config[name] !== checked) {
            (0, _Config.read)();
            Config[name] = $this.prop('checked');
            (0, _Config.write)();
        }
    }).find('[name="customPointsScriptEnabled"]').click(function () {
        var $this = $(this);
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
var lootAttack = exports.lootAttack = function lootAttack(_ref) {
    var type = _ref.type,
        targetLevel = _ref.targetLevel,
        autoChangePointsEnabled = _ref.autoChangePointsEnabled,
        safeId = _ref.safeId;

    var initCurrentLevel = getCurrentLevel(logList);
    if (targetLevel > 0 && targetLevel <= initCurrentLevel) return;
    var $wait = Msg.wait('<strong>\u6B63\u5728\u653B\u51FB\u4E2D\uFF0C\u8BF7\u7A0D\u7B49&hellip;</strong><i>\u5F53\u524D\u5C42\u6570\uFF1A<em class="pd_countdown">' + initCurrentLevel + '</em></i>' + '<a class="pd_stop_action pd_highlight" href="#">停止操作</a><a href="/" target="_blank">浏览其它页面</a>');

    /**
     * 记录点数分配记录
     * @param {boolean} isSubmit 是否提交分配点数
     */
    var recordPointsLog = function recordPointsLog() {
        var isSubmit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        propertyList = getLootPropertyList();
        var pointsText = '',
            propertiesText = '';
        $points.find('.pd_point').each(function () {
            var $this = $(this);
            var pointName = getPointNameByFieldName($this.attr('name'));
            var point = parseInt($.trim($this.val()));
            var extraPoint = extraPointList.get(pointName);
            pointsText += pointName + '\uFF1A' + point + '+' + extraPoint + '=' + (point + extraPoint) + '\uFF0C';
        });
        pointsText = pointsText.replace(/，$/, '');
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = propertyList[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _step6$value = _slicedToArray(_step6.value, 2),
                    key = _step6$value[0],
                    value = _step6$value[1];

                if (key === '可分配属性点' || key === '生命值') continue;
                var unit = '';
                if (key.endsWith('率') || key === '防御') unit = '%';
                propertiesText += key + '\uFF1A' + value + unit + '\uFF0C';
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        propertiesText = propertiesText.replace(/，$/, '');
        pointsLogList[getCurrentLevel(logList) + 1] = '\u70B9\u6570\u65B9\u6848\uFF08' + pointsText + '\uFF09\n\u4E89\u593A\u5C5E\u6027\uFF08' + propertiesText + '\uFF09';
        sessionStorage.setItem(_Const2.default.tempPointsLogListStorageName, JSON.stringify(pointsLogList));
        if (isSubmit) console.log('\u3010\u5206\u914D\u70B9\u6570\u3011\u70B9\u6570\u65B9\u6848\uFF08' + pointsText + '\uFF09\uFF1B\u4E89\u593A\u5C5E\u6027\uFF08' + propertiesText + '\uFF09');
    };

    /**
     * 修改点数分配方案
     * @param {number} nextLevel 下一层（设为-1表示采用当前点数分配方案）
     * @returns {Deferred} Deferred对象
     */
    var changePoints = function changePoints(nextLevel) {
        if (nextLevel > 0 && Config.customPointsScriptEnabled && typeof _Const2.default.getCustomPoints === 'function') {
            var currentLevel = getCurrentLevel(logList);
            var info = levelInfoList[currentLevel];
            var currentLife = 0,
                currentInitLife = 0;
            if (info) {
                currentLife = info.life;
                currentInitLife = info.initLife;
            }
            var enemyList = getEnemyList(levelInfoList);
            var points = null;
            try {
                points = _Const2.default.getCustomPoints({
                    currentLevel: currentLevel,
                    currentLife: currentLife,
                    currentInitLife: currentInitLife,
                    levelPointList: Config.levelPointList,
                    availablePoint: propertyList.get('可分配属性点'),
                    propertyList: propertyList,
                    extraPointList: extraPointList,
                    itemUsedNumList: itemUsedNumList,
                    log: log,
                    logList: logList,
                    enemyList: enemyList,
                    getPointByProperty: getPointByProperty,
                    getPropertyByPoint: getPropertyByPoint
                });
            } catch (ex) {
                console.log(ex);
            }
            if ($.type(points) === 'object') {
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = Object.keys(points)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var key = _step7.value;

                        $points.find('[name="' + getFieldNameByPointName(key) + '"]').val(points[key]).trigger('change');
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                nextLevel = -1;
            } else if (typeof points === 'number') {
                nextLevel = parseInt(points);
                nextLevel = nextLevel > 1 ? nextLevel : 1;
            } else if (points === false) {
                recordPointsLog();
                return $.Deferred().resolve('success');
            } else return $.Deferred().resolve('error');
        }

        var changeLevel = nextLevel > 0 ? Math.max.apply(Math, _toConsumableArray(Object.keys(Config.levelPointList).filter(function (level) {
            return level <= nextLevel;
        }))) : -1;
        var isChange = false;
        $points.find('.pd_point').each(function () {
            if (this.defaultValue !== $(this).val()) {
                isChange = true;
                return false;
            }
        });
        var $levelPointListSelect = $('#pdLevelPointListSelect');
        if (isChange || changeLevel > 0 && changeLevel !== parseInt($levelPointListSelect.val())) {
            if (changeLevel > 0) $levelPointListSelect.val(changeLevel).trigger('change');else $levelPointListSelect.get(0).selectedIndex = 0;
            if (Config.unusedPointNumAlertEnabled && !_Info2.default.w.unusedPointNumAlert && parseInt($('#pdSurplusPoint').text()) > 0) {
                if (confirm('可分配属性点尚未用完，是否继续？')) _Info2.default.w.unusedPointNumAlert = true;else return $.Deferred().resolve('error');
            }
            return $.ajax({
                type: 'POST',
                url: 'kf_fw_ig_enter.php',
                timeout: _Const2.default.defAjaxTimeout,
                data: $points.find('form').serialize()
            }).then(function (html) {
                var _Util$getResponseMsg = Util.getResponseMsg(html),
                    msg = _Util$getResponseMsg.msg;

                if (/已经重新配置加点！/.test(msg)) {
                    recordPointsLog(true);
                    $points.find('.pd_point').each(function () {
                        this.defaultValue = $(this).val();
                    });
                    return 'success';
                } else {
                    alert((changeLevel ? '\u7B2C' + changeLevel + '\u5C42\u65B9\u6848\uFF1A' : '') + msg);
                    return 'error';
                }
            }, function () {
                return 'timeout';
            });
        } else {
            recordPointsLog();
            return $.Deferred().resolve('success');
        }
    };

    /**
     * 准备攻击（用于自动修改点数分配方案）
     * @param {number} currentLevel 当前层数（设为-1表示采用当前点数分配方案）
     * @param {number} interval 下次攻击的间隔时间
     */
    var ready = function ready(currentLevel) {
        var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Const2.default.lootAttackInterval;

        changePoints(currentLevel >= 0 ? currentLevel + 1 : -1).done(function (result) {
            if (result === 'success') setTimeout(attack, typeof interval === 'function' ? interval() : interval);
        }).fail(function (result) {
            if (result === 'timeout') setTimeout(function () {
                return ready(currentLevel, interval);
            }, _Const2.default.defAjaxInterval);
        }).always(function (result) {
            if (result !== 'success' && result !== 'timeout') {
                Msg.remove($wait);
            }
        });
    };

    /**
     * 攻击
     */
    var attack = function attack() {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_intel.php',
            data: { 'safeid': safeId },
            timeout: _Const2.default.defAjaxTimeout
        }).done(function (html) {
            if (Config.autoLootEnabled) Util.setCookie(_Const2.default.lootAttackingCookieName, 1, Util.getDate('+' + _Const2.default.lootAttackingExpires + 'm'));
            if (!/你\(\d+\)遭遇了/.test(html)) {
                setTimeout(check, _Const2.default.defAjaxInterval);
                return;
            }
            log = html + log;
            after();
        }).fail(function () {
            console.log('【争夺攻击】超时重试...');
            setTimeout(check, typeof _Const2.default.lootAttackInterval === 'function' ? _Const2.default.lootAttackInterval() : _Const2.default.lootAttackInterval);
        });
    };

    /**
     * 攻击之后
     * @param {boolean} isChecked 是否已检查过争夺记录
     */
    var after = function after() {
        var isChecked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        logList = getLogList(log);
        levelInfoList = getLevelInfoList(logList);
        showEnhanceLog(logList, levelInfoList, pointsLogList);
        showLogStat(levelInfoList);
        var currentLevel = getCurrentLevel(logList);
        console.log('【争夺攻击】当前层数：' + currentLevel);
        var $countdown = $('.pd_countdown:last');
        $countdown.text(currentLevel);
        $points.find('.pd_point').each(function () {
            showNewLootProperty($(this));
        });
        var info = levelInfoList[currentLevel];
        $properties.find('#pdCurrentLife').text(info ? info.life : 0);

        var isFail = /你被击败了/.test(log);
        var isStop = isFail || type !== 'auto' || targetLevel && currentLevel >= targetLevel || $countdown.closest('.pd_msg').data('stop');
        if (isStop) {
            if (Config.autoLootEnabled) {
                Util.deleteCookie(_Const2.default.lootCheckingCookieName);
                Util.deleteCookie(_Const2.default.lootAttackingCookieName);
                Util.setCookie(_Const2.default.lootCompleteCookieName, 1, getAutoLootCookieDate());
            }
            if (isFail) {
                if (isChecked) finish();else setTimeout(check, _Const2.default.defAjaxInterval);
            } else {
                Msg.remove($wait);
                Msg.show('<strong>\u4F60\u6210\u529F\u51FB\u8D25\u4E86\u7B2C<em>' + currentLevel + '</em>\u5C42\u7684NPC</strong>', -1);
            }
        } else {
            if (autoChangePointsEnabled) setTimeout(function () {
                return ready(currentLevel);
            }, _Const2.default.defAjaxInterval);else setTimeout(attack, typeof _Const2.default.lootAttackInterval === 'function' ? _Const2.default.lootAttackInterval() : _Const2.default.lootAttackInterval);
        }
    };

    /**
     * 检查争夺记录
     */
    var check = function check() {
        console.log('检查争夺记录Start');
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
            timeout: _Const2.default.defAjaxTimeout,
            success: function success(html) {
                var $log = $('#pk_text', html);
                if (!$log.length) {
                    Msg.remove($wait);
                    return;
                }
                log = $log.html();
                after(true);
            },
            error: function error() {
                setTimeout(check, _Const2.default.defAjaxInterval);
            }
        });
    };

    /**
     * 完成攻击（被击败后）
     */
    var finish = function finish() {
        Msg.remove($wait);
        if (Config.autoLootEnabled) Util.setCookie(_Const2.default.lootCompleteCookieName, 2, getAutoLootCookieDate());
        sessionStorage.removeItem(_Const2.default.tempPointsLogListStorageName);

        var allEnemyList = {};
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = Util.entries(getEnemyStatList(levelInfoList))[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var _step8$value = _slicedToArray(_step8.value, 2),
                    enemy = _step8$value[0],
                    num = _step8$value[1];

                allEnemyList[enemy] = num;
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }

        var allEnemyStat = '';
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = Util.entries(allEnemyList)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var _step9$value = _slicedToArray(_step9.value, 2),
                    enemy = _step9$value[0],
                    num = _step9$value[1];

                allEnemyStat += enemy + '`+' + num + '` ';
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }

        var latestEnemyList = {};
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = Util.entries(getEnemyStatList(levelInfoList.filter(function (elem, level) {
                return level >= logList.length - _Const2.default.enemyStatLatestLevelNum;
            })))[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _step10$value = _slicedToArray(_step10.value, 2),
                    enemy = _step10$value[0],
                    num = _step10$value[1];

                latestEnemyList[enemy] = num;
            }
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                    _iterator10.return();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }

        var latestEnemyStat = '';
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = Util.entries(latestEnemyList)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var _step11$value = _slicedToArray(_step11.value, 2),
                    enemy = _step11$value[0],
                    num = _step11$value[1];

                latestEnemyStat += enemy + '`+' + num + '` ';
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                    _iterator11.return();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }

        var currentLevel = getCurrentLevel(logList);

        var _getTotalGain = getTotalGain(levelInfoList),
            exp = _getTotalGain.exp,
            kfb = _getTotalGain.kfb;

        if (exp > 0 && kfb > 0) {
            Log.push('争夺攻击', '\u4F60\u6210\u529F\u51FB\u8D25\u4E86\u7B2C`' + (currentLevel - 1) + '`\u5C42\u7684NPC (\u5168\u90E8\uFF1A' + allEnemyStat.trim() + '\uFF1B\u6700\u8FD1' + _Const2.default.enemyStatLatestLevelNum + '\u5C42\uFF1A' + latestEnemyStat.trim() + ')', { gain: { 'KFB': kfb, '经验值': exp } });
            LootLog.record(logList, pointsLogList);
        }
        Msg.show('<strong>\u4F60\u88AB\u7B2C<em>' + currentLevel + '</em>\u5C42\u7684NPC\u51FB\u8D25\u4E86</strong>', -1);

        if (Config.autoGetDailyBonusEnabled && Config.getBonusAfterLootCompleteEnabled) {
            Util.deleteCookie(_Const2.default.getDailyBonusCookieName);
            Public.getDailyBonus();
        }
        Script.runFunc('Loot.lootAttack_complete_');
    };

    ready(autoChangePointsEnabled ? initCurrentLevel : -1, 0);
};

/**
 * 添加争夺记录头部区域
 */
var addLootLogHeader = function addLootLogHeader() {
    $('\n<div id="pdLootLogHeader" style="padding: 0 5px 5px; line-height: 2em;">\n  <div class="pd_log_nav">\n    <a class="pd_disabled_link" data-name="start" href="#">&lt;&lt;</a>\n    <a class="pd_disabled_link" data-name="prev" href="#" style="padding: 0 7px;">&lt;</a>\n    <h2 class="pd_history_logs_key pd_custom_tips" title="\u5171\u67090\u5929\u7684\u4E89\u593A\u8BB0\u5F55">\u73B0\u5728</h2>\n    <a class="pd_disabled_link" data-name="next" href="#" style="padding: 0 7px;">&gt;</a>\n    <a class="pd_disabled_link" data-name="end" href="#">&gt;&gt;</a>\n  </div>\n  <div style="text-align: right;">\n    <label>\n      <input class="pd_input" name="showLevelEnemyStatEnabled" type="checkbox" ' + (Config.showLevelEnemyStatEnabled ? 'checked' : '') + '> \u663E\u793A\u5206\u5C42\u7EDF\u8BA1\n    </label>\n    <a class="pd_btn_link" data-name="openImOrExLootLogDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u4E89\u593A\u8BB0\u5F55</a>\n    <a class="pd_btn_link pd_highlight" data-name="clearLootLog" href="#">\u6E05\u9664\u8BB0\u5F55</a>\n  </div>\n  <ul class="pd_stat" id="pdLogStat"></ul>\n</div>\n').insertBefore($logBox).find('[name="showLevelEnemyStatEnabled"]').click(function () {
        var checked = $(this).prop('checked');
        if (Config.showLevelEnemyStatEnabled !== checked) {
            (0, _Config.read)();
            Config.showLevelEnemyStatEnabled = checked;
            (0, _Config.write)();
            showLogStat(levelInfoList);
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
var showImportOrExportLootLogDialog = function showImportOrExportLootLogDialog() {
    var dialogName = 'pdImOrExLootLogDialog';
    if ($('#' + dialogName).length > 0) return;
    var log = LootLog.read();
    var html = '\n<div class="pd_cfg_main">\n  <strong>\u5BFC\u5165\u4E89\u593A\u8BB0\u5F55\uFF1A</strong>\u5C06\u4E89\u593A\u8BB0\u5F55\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u5408\u5E76\u6216\u8986\u76D6\u6309\u94AE\u5373\u53EF<br>\n  <strong>\u5BFC\u51FA\u4E89\u593A\u8BB0\u5F55\uFF1A</strong>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF<br>\n  <textarea name="lootLog" style="width: 600px; height: 400px; word-break: break-all;"></textarea>\n</div>\n<div class="pd_cfg_btns">\n  <button name="merge" type="button">\u5408\u5E76\u8BB0\u5F55</button>\n  <button name="overwrite" type="button" style="color: #f00;">\u8986\u76D6\u8BB0\u5F55</button>\n  <button data-action="close" type="button">\u5173\u95ED</button>\n</div>';

    var $dialog = Dialog.create(dialogName, '导入或导出争夺记录', html);
    $dialog.find('[name="merge"], [name="overwrite"]').click(function (e) {
        e.preventDefault();
        var name = $(this).attr('name');
        if (!confirm('\u662F\u5426\u5C06\u6587\u672C\u6846\u4E2D\u7684\u4E89\u593A\u8BB0\u5F55' + (name === 'overwrite' ? '覆盖' : '合并') + '\u5230\u672C\u5730\u4E89\u593A\u8BB0\u5F55\uFF1F')) return;
        var newLog = $.trim($dialog.find('[name="lootLog"]').val());
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
var handleLootLogNav = function handleLootLogNav() {
    var $logNav = $('#pdLootLogHeader').find('.pd_log_nav');

    /**
     * 获取历史争夺记录的标题字符串
     * @param {number} timestamp 争夺记录的时间戳（0表示现在）
     * @returns {string} 标题字符串
     */
    var getKeyTitleStr = function getKeyTitleStr(timestamp) {
        if (parseInt(timestamp) === 0) return '现在';
        var date = new Date(parseInt(timestamp));
        return Util.getDateString(date) + ' ' + Util.getTimeString(date, ':', false);
    };

    var historyLogs = LootLog.read();
    var keyList = [];
    if (!$.isEmptyObject(historyLogs)) {
        keyList = Util.getObjectKeyList(historyLogs, 1);
        var latestKey = parseInt(keyList[keyList.length - 1]);
        if (!/你被击败了/.test(log) || latestKey <= Util.getDate('-1d').getTime() || historyLogs[latestKey].log.join('').trim() !== logList.join('').trim()) keyList.push(0);
    } else keyList.push(0);
    var curIndex = keyList.length - 1;

    var totalDays = keyList[curIndex] === 0 ? keyList.length - 1 : keyList.length;
    $logNav.find('.pd_history_logs_key').attr('title', '\u5171\u6709' + totalDays + '\u5929\u7684\u4E89\u593A\u8BB0\u5F55').text(getKeyTitleStr(keyList[curIndex]));
    if (keyList.length > 1) {
        $logNav.find('[data-name="start"]').attr('title', getKeyTitleStr(keyList[0])).removeClass('pd_disabled_link');
        $logNav.find('[data-name="prev"]').attr('title', getKeyTitleStr(keyList[curIndex - 1])).removeClass('pd_disabled_link');
    }
    $logNav.on('click', 'a[data-name]', function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        var name = $this.data('name');
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
        var curLogList = keyList[curIndex] === 0 ? logList : historyLogs[keyList[curIndex]].log;
        var curLevelInfoList = getLevelInfoList(curLogList);
        var curPointsLogList = keyList[curIndex] === 0 ? pointsLogList : historyLogs[keyList[curIndex]].points;
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

    if (!log.includes('本日无争夺记录')) {
        var curLogList = keyList[curIndex] === 0 ? logList : historyLogs[keyList[curIndex]].log;
        var curLevelInfoList = getLevelInfoList(curLogList);
        var curPointsLogList = keyList[curIndex] === 0 ? pointsLogList : historyLogs[keyList[curIndex]].points;
        showEnhanceLog(curLogList, curLevelInfoList, curPointsLogList);
    }
};

/**
 * 显示争夺记录统计
 * @param {{}[]} levelInfoList 各层战斗信息列表
 */
var showLogStat = function showLogStat(levelInfoList) {
    var _getTotalGain2 = getTotalGain(levelInfoList),
        exp = _getTotalGain2.exp,
        kfb = _getTotalGain2.kfb;

    var allEnemyStatHtml = '';
    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
        for (var _iterator12 = Util.entries(getEnemyStatList(levelInfoList))[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var _step12$value = _slicedToArray(_step12.value, 2),
                enemy = _step12$value[0],
                num = _step12$value[1];

            allEnemyStatHtml += '<i>' + enemy + '<em>+' + num + '</em></i> ';
        }
    } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
            }
        } finally {
            if (_didIteratorError12) {
                throw _iteratorError12;
            }
        }
    }

    var latestEnemyStatHtml = '';
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;
    var _iteratorError13 = undefined;

    try {
        for (var _iterator13 = Util.entries(getEnemyStatList(levelInfoList.filter(function (elem, level) {
            return level >= levelInfoList.length - _Const2.default.enemyStatLatestLevelNum;
        })))[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var _step13$value = _slicedToArray(_step13.value, 2),
                enemy = _step13$value[0],
                num = _step13$value[1];

            latestEnemyStatHtml += '<i>' + enemy + '<em>+' + num + '</em></i> ';
        }
    } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
            }
        } finally {
            if (_didIteratorError13) {
                throw _iteratorError13;
            }
        }
    }

    var $logStat = $('#pdLogStat');
    $logStat.html('\n<li><b>\u6536\u83B7\u7EDF\u8BA1\uFF1A</b><i>KFB<em>+' + kfb.toLocaleString() + '</em></i> <i>\u7ECF\u9A8C\u503C<em>+' + exp.toLocaleString() + '</em></i></li>\n<li>\n  <b>\u5168\u90E8\u5C42\u6570\uFF1A</b>' + allEnemyStatHtml + '<br>\n  <b>\u6700\u8FD1' + _Const2.default.enemyStatLatestLevelNum + '\u5C42\uFF1A</b>' + latestEnemyStatHtml + '\n</li>\n');

    if (Config.showLevelEnemyStatEnabled) {
        var levelEnemyStatHtml = '';

        var _loop = function _loop(i) {
            levelEnemyStatHtml += '&nbsp;&nbsp;<b>' + i + '-' + (i + 9 < levelInfoList.length ? i + 9 : levelInfoList.length - 1) + '\uFF1A</b>';
            var html = '';
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = Util.entries(getEnemyStatList(levelInfoList.filter(function (elem, level) {
                    return level >= i && level < i + 10;
                })))[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var _step14$value = _slicedToArray(_step14.value, 2),
                        enemy = _step14$value[0],
                        num = _step14$value[1];

                    html += '<i>' + enemy + '<em>+' + num + '</em></i> ';
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }

            levelEnemyStatHtml += (html ? html : '无') + '<br>';
        };

        for (var i = 1; i < levelInfoList.length; i += 10) {
            _loop(i);
        }
        $logStat.append('<li><b>\u5206\u5C42\u7EDF\u8BA1\uFF1A</b>' + (levelEnemyStatHtml ? '<br>' + levelEnemyStatHtml : '无') + '</li>');
    }
};

/**
 * 显示经过增强的争夺记录
 * @param {string[]} logList 各层争夺记录列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
var showEnhanceLog = function showEnhanceLog(logList, levelInfoList, pointsLogList) {
    var list = [];
    $.each(logList, function (level, levelLog) {
        if (!levelLog) return;
        var matches = /\[([^\]]+)的]NPC/.exec(levelLog);
        if (!matches) return;
        var enemy = matches[1];
        var color = '';
        switch (enemy) {
            case '普通':
                color = '#09c';
                break;
            case '特别脆弱':
                color = '#c96';
                break;
            case '特别缓慢':
                color = '#c69';
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
        list[level] = levelLog.replace(matches[0], '<span style="background-color: ' + color + ';">[' + enemy + '\u7684]</span>NPC');

        if (pointsLogList[level]) {
            var levelPointsLog = pointsLogList[level];
            enemy = enemy.replace('特别', '');
            var pointMatches = /灵活：\d+\+\d+=(\d+)/.exec(levelPointsLog);
            if (pointMatches) {
                var realCriticalStrikePercent = getRealProperty('灵活', parseInt(pointMatches[1]), level, enemy);
                levelPointsLog = levelPointsLog.replace(/(暴击几率：\d+%)/, '$1<span class="pd_custom_tips" title="\u5B9E\u9645\u66B4\u51FB\u51E0\u7387">(' + realCriticalStrikePercent + '%)</span>');
            }
            pointMatches = /智力：\d+\+\d+=(\d+)/.exec(levelPointsLog);
            if (pointMatches) {
                var realSkillPercent = getRealProperty('智力', parseInt(pointMatches[1]), level, enemy);
                levelPointsLog = levelPointsLog.replace(/(技能释放概率：\d+%)/, '$1<span class="pd_custom_tips" title="\u5B9E\u9645\u6280\u80FD\u91CA\u653E\u6982\u7387">(' + realSkillPercent + '%)</span>');
            }
            list[level] = list[level].replace('</li>', ('</li><li class="pk_log_g" style="color: #666;">' + levelPointsLog + '</li>').replace(/\n/g, '<br>'));
        }
    });
    $log.html(list.reverse().join(''));
};

/**
 * 获取争夺记录
 * @returns {string} 争夺记录
 */
var getLog = exports.getLog = function getLog() {
    return log;
};

/**
 * 获取各层争夺记录列表
 * @param log 争夺记录
 * @returns {string[]} 各层争夺记录列表
 */
var getLogList = exports.getLogList = function getLogList(log) {
    var logList = [];
    var matches = log.match(/<li class="pk_log_j">.+?(?=\s*<li class="pk_log_j">|\s*$)/g);
    for (var i in matches) {
        var levelMatches = /在\[\s*(\d+)\s*层]/.exec(Util.removeHtmlTag(matches[i]));
        if (levelMatches) logList[parseInt(levelMatches[1])] = matches[i];
    }
    return logList;
};

/**
 * 获取该层的战斗信息
 * @param {string} levelLog 该层的争夺记录
 * @returns {{enemy: string, life: number, initLife: number, kfb: number, exp: number}} enemy：遭遇敌人名称；life：该层剩余生命值；initLife：该层初始生命值；kfb：KFB；exp：经验
 */
var getLevelInfo = exports.getLevelInfo = function getLevelInfo(levelLog) {
    var info = { enemy: '', life: 0, initLife: 0, kfb: 0, exp: 0 };
    if (!levelLog) return info;
    levelLog = Util.removeHtmlTag(levelLog.replace(/<\/li>/g, '</li>\n'));

    var matches = /你\((\d+)\)遭遇了\[([^\]]+)的]NPC/.exec(levelLog);
    if (matches) {
        info.initLife = parseInt(matches[1]);
        info.enemy = matches[2];
        info.enemy = info.enemy.replace('特别', '').replace('(后续更新前此路不通)', '');
    }

    matches = /生命值\[(\d+)\s*\/\s*\d+]/.exec(levelLog);
    if (matches) info.life = parseInt(matches[1]);

    matches = /获得\s*\[\s*(\d+)\s*]\s*经验和\s*\[\s*(\d+)\s*]\s*KFB/.exec(levelLog);
    if (matches) {
        info.exp += parseInt(matches[1]);
        info.kfb += parseInt(matches[2]);
    }

    return info;
};

/**
 * 获取各层战斗信息列表
 * @param {string[]} logList 各层争夺记录列表
 * @returns {{}[]} 各层战斗信息列表
 */
var getLevelInfoList = exports.getLevelInfoList = function getLevelInfoList(logList) {
    var levelInfoList = [];
    $.each(logList, function (level, levelLog) {
        if (!levelLog) return;
        levelInfoList[level] = getLevelInfo(levelLog);
    });
    return levelInfoList;
};

/**
 * 获取当前的争夺总收获
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @returns {{kfb: number, exp: number}} kfb：KFB；exp：经验
 */
var getTotalGain = function getTotalGain(levelInfoList) {
    var totalKfb = 0,
        totalExp = 0;
    $.each(levelInfoList, function (level, info) {
        if (!info) return;
        totalKfb += info.kfb;
        totalExp += info.exp;
    });
    return { kfb: totalKfb, exp: totalExp };
};

/**
 * 获取遭遇敌人统计列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @returns {{}} 遭遇敌人列表
 */
var getEnemyStatList = function getEnemyStatList(levelInfoList) {
    var enemyStatList = {
        '普通': 0,
        '强壮': 0,
        '快速': 0,
        '脆弱': 0,
        '缓慢': 0,
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
var getEnemyList = function getEnemyList(levelInfoList) {
    var enemyList = [];
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
var getCurrentLevel = function getCurrentLevel(logList) {
    return logList.length - 1 >= 1 ? logList.length - 1 : 0;
};

/**
 * 获取临时点数分配记录列表
 * @param {string[]} logList 各层争夺记录列表
 * @returns {string[]} 点数分配记录列表
 */
var getTempPointsLogList = function getTempPointsLogList(logList) {
    var pointsLogList = sessionStorage.getItem(_Const2.default.tempPointsLogListStorageName);
    if (!pointsLogList) return [];
    try {
        pointsLogList = JSON.parse(pointsLogList);
    } catch (ex) {
        return [];
    }
    if (!pointsLogList || !Array.isArray(pointsLogList)) return [];
    if (pointsLogList.length > logList.length) {
        sessionStorage.removeItem(_Const2.default.tempPointsLogListStorageName);
        return [];
    }
    return pointsLogList;
};

/**
 * 获取自动争夺Cookies有效期
 * @returns {Date} Cookies有效期的Date对象
 */
var getAutoLootCookieDate = function getAutoLootCookieDate() {
    var now = new Date();
    var date = Util.getTimezoneDateByTime('02:30:00');
    if (now > date) {
        date = Util.getTimezoneDateByTime('00:00:30');
        date.setDate(date.getDate() + 1);
    }
    if (now > date) date.setDate(date.getDate() + 1);
    return date;
};

/**
 * 检查争夺情况
 */
var checkLoot = exports.checkLoot = function checkLoot() {
    console.log('检查争夺情况Start');
    var $wait = Msg.wait('<strong>正在检查争夺情况中&hellip;</strong>');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
        timeout: _Const2.default.defAjaxTimeout,
        success: function success(html) {
            Msg.remove($wait);
            if (!/你被击败了/.test(html)) {
                if (Util.getCookie(_Const2.default.lootCheckingCookieName)) return;
                var _$log = $('#pk_text', html);
                if (!_$log.length) {
                    Util.setCookie(_Const2.default.lootCompleteCookieName, -1, Util.getDate('+1h'));
                    return;
                }
                if (Config.attackTargetLevel > 0) {
                    var _log = _$log.html();
                    var _logList = getLogList(_log);
                    var currentLevel = getCurrentLevel(_logList);
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
        error: function error() {
            Msg.remove($wait);
            setTimeout(checkLoot, _Const2.default.defAjaxInterval);
        }
    });
};

/**
 * 自动争夺
 */
var autoLoot = function autoLoot() {
    if (/你被击败了/.test(log)) return;
    var safeId = Public.getSafeId();
    var currentLevel = getCurrentLevel(logList);
    if (!safeId || Config.attackTargetLevel > 0 && Config.attackTargetLevel <= currentLevel) {
        Util.setCookie(_Const2.default.lootCompleteCookieName, 1, getAutoLootCookieDate());
        return;
    }
    Util.setCookie(_Const2.default.lootAttackingCookieName, 1, Util.getDate('+' + _Const2.default.lootAttackingExpires + 'm'));
    Util.deleteCookie(_Const2.default.lootCompleteCookieName);
    var autoChangePointsEnabled = Config.autoChangeLevelPointsEnabled || Config.customPointsScriptEnabled && typeof _Const2.default.getCustomPoints === 'function';
    lootAttack({ type: 'auto', targetLevel: Config.attackTargetLevel, autoChangePointsEnabled: autoChangePointsEnabled, safeId: safeId });
};

/**
 * 在争夺排行页面添加用户链接
 */
var addUserLinkInPkListPage = exports.addUserLinkInPkListPage = function addUserLinkInPkListPage() {
    $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        var $this = $(this);
        var userName = $this.text().trim();
        $this.html('<a href="profile.php?action=show&username=' + userName + '" target="_blank">' + userName + '</a>');
        if (userName === _Info2.default.userName) $this.find('a').addClass('pd_highlight');
    });
};

},{"./Config":4,"./Const":6,"./Dialog":7,"./Info":9,"./Item":10,"./Log":11,"./LootLog":14,"./Msg":15,"./Public":18,"./Script":20,"./Util":22}],14:[function(require,module,exports){
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
var name = _Const2.default.storagePrefix + 'loot_log';

/**
 * 读取争夺记录
 * @returns {{}} 争夺记录对象
 */
var read = exports.read = function read() {
    var log = {};
    var options = Util.readData(name + '_' + _Info2.default.uid);
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
var write = exports.write = function write(log) {
    return Util.writeData(name + '_' + _Info2.default.uid, JSON.stringify(log));
};

/**
 * 清除临时日志
 */
var clear = exports.clear = function clear() {
    return Util.deleteData(name + '_' + _Info2.default.uid);
};

/**
 * 记录新的争夺记录
 * @param {string[]} logList 各层争夺记录列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
var record = exports.record = function record(logList, pointsLogList) {
    var log = read();
    var overdueDate = Util.getDate('-' + Config.lootLogSaveDays + 'd').getTime();
    $.each(Util.getObjectKeyList(log, 1), function (i, key) {
        key = parseInt(key);
        if (isNaN(key) || key <= overdueDate) delete log[key];else return false;
    });
    log[new Date().getTime()] = { log: logList, points: pointsLogList };
    write(log);
};

/**
 * 获取合并后的争夺记录
 * @param {{}} log 当前争夺记录
 * @param {{}} newLog 新争夺记录
 * @returns {{}} 合并后的争夺记录
 */
var getMergeLog = exports.getMergeLog = function getMergeLog(log, newLog) {
    for (var key in newLog) {
        if (!$.isNumeric(key) || parseInt(key) <= 0) continue;
        if ($.type(newLog[key]) !== 'object' || !Array.isArray(newLog[key].log) || !Array.isArray(newLog[key].points)) continue;
        log[key] = newLog[key];
    }
    return log;
};

},{"./Const":6,"./Info":9,"./Util":22}],15:[function(require,module,exports){
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
var show = exports.show = function show(options, duration) {
    var settings = {
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
    var $container = $('.pd_msg_container');
    var isFirst = $container.length === 0;
    if (!isFirst && !$('.pd_mask').length) {
        var $lastTips = $('.pd_msg:last');
        if ($lastTips.length > 0) {
            var top = $lastTips.offset().top;
            var winScrollTop = $(window).scrollTop();
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

    var $msg = $('<div class="pd_msg">' + settings.msg + '</div>').appendTo($container);
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

    var windowWidth = $(window).width();
    var popTipsWidth = $msg.outerWidth(),
        popTipsHeight = $msg.outerHeight();
    var left = windowWidth / 2 - popTipsWidth / 2;
    if (left + popTipsWidth > windowWidth) left = windowWidth - popTipsWidth - 20;
    if (left < 0) left = 0;
    if (isFirst) {
        $container.css('top', $(window).height() / 2 - popTipsHeight / 2);
    } else {
        $container.stop(false, true).animate({ 'top': '-=' + popTipsHeight / 1.75 });
    }
    var $prev = $msg.prev('.pd_msg');
    $msg.css({
        'top': $prev.length > 0 ? parseInt($prev.css('top')) + $prev.outerHeight() + 5 : 0,
        left: left
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
var wait = exports.wait = function wait(msg) {
    var preventable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return show({ msg: msg, duration: -1, clickable: false, preventable: preventable });
};

/**
 * 移除指定消息框
 * @param {jQuery} $msg 消息框对象
 */
var remove = exports.remove = function remove($msg) {
    var $parent = $msg.parent();
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
var destroy = exports.destroy = function destroy() {
    $('.pd_msg_container').remove();
    $('.pd_mask').remove();
};

},{}],16:[function(require,module,exports){
/* 其它模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleProfilePage = exports.addUserNameLinkInRankPage = exports.showSelfRatingErrorSizeSubmitWarning = exports.highlightRatingErrorSize = exports.addAvatarChangeAlert = exports.syncModifyPerPageFloorNum = exports.addAutoChangeIdColorButton = exports.addMsgSelectButton = exports.modifyMyPostLink = exports.addFollowAndBlockAndMemoUserLink = exports.addFastDrawMoneyLink = exports.highlightUnReadAtTipsMsg = exports.addFastGotoThreadPageLink = exports.highlightNewPost = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var highlightNewPost = exports.highlightNewPost = function highlightNewPost() {
    $('.thread1 > tbody > tr > td:last-child').has('a.bl').each(function () {
        var html = $(this).html();
        if (/\|\s*\d{2}:\d{2}<br>\n.*\d{2}:\d{2}/.test(html)) {
            html = html.replace(/(\d{2}:\d{2})<br>/, '<span class="pd_highlight">$1</span><br>');
            $(this).html(html);
        }
    });
};

/**
 * 在版块页面中添加帖子页数快捷链接
 */
var addFastGotoThreadPageLink = exports.addFastGotoThreadPageLink = function addFastGotoThreadPageLink() {
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
                    html += '..<a href="' + url + '&page=' + totalPageNum + '">' + totalPageNum + '</a>';
                }
                break;
            }
            html += '<a href="' + url + '&page=' + (i + 1) + '">' + (i + 1) + '</a>';
        }
        html = '<span class="pd_thread_page">&hellip;' + html + '</span>';
        $link.after(html).parent().css('white-space', 'normal');
    });
};

/**
 * 高亮at提醒页面中未读的消息
 */
var highlightUnReadAtTipsMsg = exports.highlightUnReadAtTipsMsg = function highlightUnReadAtTipsMsg() {
    if ($('.kf_share1:first').text().trim() !== '\u542B\u6709\u5173\u952E\u8BCD \u201C' + _Info2.default.userName + '\u201D \u7684\u5185\u5BB9') return;
    var timeString = Util.getCookie(_Const2.default.prevReadAtTipsCookieName);
    if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
    var prevString = '';
    $('.kf_share1:eq(1) > tbody > tr:gt(0) > td:first-child').each(function (index) {
        var $this = $(this);
        var curString = $this.text().trim();
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
var addFastDrawMoneyLink = exports.addFastDrawMoneyLink = function addFastDrawMoneyLink() {
    if (!$('td:contains("SYSTEM")').length || !$('td:contains("收到了他人转账的KFB")').length) return;
    var $msg = $('.thread2 > tbody > tr:eq(-2) > td:last');
    var html = $msg.html();
    var matches = /给你转帐(\d+)KFB/i.exec(html);
    if (matches) {
        (function () {
            var money = parseInt(matches[1]);
            $msg.html(html.replace(/会员\[(.+?)\]通过论坛银行/, '会员[<a target="_blank" href="profile.php?action=show&username=$1">$1</a>]通过论坛银行').replace(matches[0], '\u7ED9\u4F60\u8F6C\u5E10<span class="pd_stat"><em>' + money.toLocaleString() + '</em></span>KFB'));

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
                    var matches = /活期存款：(\d+)KFB<br/.exec(html);
                    if (!matches) {
                        alert('获取当前活期存款金额失败');
                        return;
                    }
                    var money = parseInt(matches[1]);
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
        })();
    }
};

/**
 * 添加关注和屏蔽用户以及用户备注的链接
 */
var addFollowAndBlockAndMemoUserLink = exports.addFollowAndBlockAndMemoUserLink = function addFollowAndBlockAndMemoUserLink() {
    var matches = /(.+?)\s*详细信息/.exec($('td:contains("详细信息")').text());
    if (!matches) return;
    var userName = $.trim(matches[1]);
    $('<span>[<a href="#">关注用户</a>] [<a href="#">屏蔽用户</a>]</span><br><span>[<a href="#">添加备注</a>]</span><br>').appendTo($('a[href^="message.php?action=write&touid="]').parent()).find('a').each(function () {
        var $this = $(this);
        if ($this.is('a:contains("备注")')) {
            var str = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Util.entries(Config.userMemoList)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        name = _step$value[0],
                        memo = _step$value[1];

                    if (name === userName) {
                        str = memo;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (str !== '') {
                $this.text('修改备注').data('memo', str);
                var $info = $('.log1 > tbody > tr:last-child > td:last-child');
                $info.html('\u5907\u6CE8\uFF1A' + str + '<br>' + $info.html());
            }
        } else {
            var _str = '关注';
            var userList = Config.followUserList;
            if ($this.text().indexOf('屏蔽') > -1) {
                _str = '屏蔽';
                userList = Config.blockUserList;
            }
            if (Util.inFollowOrBlockUserList(userName, userList) > -1) {
                $this.addClass('pd_highlight').text('解除' + _str);
            }
        }
    }).click(function (e) {
        e.preventDefault();
        (0, _Config.read)();
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
            } else {
                delete Config.userMemoList[userName];
                $this.text('添加备注');
            }
            $this.data('memo', value);
            (0, _Config.write)();
        } else {
            var str = '关注';
            var userList = Config.followUserList;
            if ($this.text().includes('屏蔽')) {
                str = '屏蔽';
                userList = Config.blockUserList;
                if (!Config.blockUserEnabled) Config.blockUserEnabled = true;
            } else {
                if (!Config.followUserEnabled) Config.followUserEnabled = true;
            }
            if ($this.text() === '解除' + str) {
                var index = Util.inFollowOrBlockUserList(userName, userList);
                if (index > -1) {
                    userList.splice(index, 1);
                    (0, _Config.write)();
                }
                $this.removeClass('pd_highlight').text(str + '用户');
                alert('该用户已被解除' + str);
            } else {
                if (Util.inFollowOrBlockUserList(userName, userList) === -1) {
                    if (str === '屏蔽') {
                        var type = Config.blockUserDefaultType;
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
var modifyMyPostLink = exports.modifyMyPostLink = function modifyMyPostLink() {
    $('.t a[href^="read.php?tid="]').each(function () {
        var $this = $(this);
        $this.attr('href', $this.attr('href').replace(/&uid=\d+#(\d+)/, '&spid=$1'));
    });
};

/**
 * 在短消息页面添加选择指定短消息的按钮
 */
var addMsgSelectButton = exports.addMsgSelectButton = function addMsgSelectButton() {
    var $checkeds = $('.thread1 > tbody > tr > td:last-child > [type="checkbox"]');
    $('<input value="自定义" type="button" style="margin-right: 3px;">').insertBefore('[type="button"][value="全选"]').click(function (e) {
        e.preventDefault();
        var value = $.trim(prompt('请填写所要选择的包含指定字符串的短消息标题（可用|符号分隔多个标题）', '收到了他人转账的KFB|银行汇款通知|您的文章被评分|您的文章被删除'));
        if (value !== '') {
            (function () {
                $checkeds.prop('checked', false);
                var titleArr = value.split('|');
                $('.thread1 > tbody > tr > td:nth-child(2) > a').each(function () {
                    var $this = $(this);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = titleArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var title = _step2.value;

                            if ($this.text().toLowerCase().includes(title.toLowerCase())) {
                                $this.closest('tr').find('td:last-child > input[type="checkbox"]').prop('checked', true);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                });
            })();
        }
    }).parent().attr('colspan', 4).prev('td').attr('colspan', 3);

    $('<input value="反选" type="button" style="margin-left: 5px; margin-right: 1px;">').insertAfter('[type="button"][value="全选"]').click(function () {
        return Util.selectInverse($checkeds);
    });
};

/**
 * 添加自动更换ID颜色的按钮
 */
var addAutoChangeIdColorButton = exports.addAutoChangeIdColorButton = function addAutoChangeIdColorButton() {
    var $autoChangeIdColor = $('table div > table > tbody > tr > td:contains("自定义ID颜色")');
    $('<span class="pd_highlight">低等级没人权？没有自己喜欢的颜色？快来试试助手的<a href="#">自定义本人神秘颜色</a>的功能吧！（虽然仅限自己可见 ╮(╯▽╰)╭）</span><br>').appendTo($autoChangeIdColor).find('a').click(function (e) {
        e.preventDefault();
        (0, _ConfigDialog.show)();
    });

    var $idColors = $autoChangeIdColor.parent('tr').nextAll('tr').not('tr:last');
    if ($idColors.find('a').length <= 1) return;
    var $area = $('\n<form>\n<div data-name="autoChangeIdColorBtns" style="margin-top: 5px;">\n  <label><input name="autoChangeIdColorEnabled" class="pd_input" type="checkbox"> \u81EA\u52A8\u66F4\u6362ID\u989C\u8272</label>\n</div>\n</form>\n').appendTo($autoChangeIdColor);
    $area.find('[name="autoChangeIdColorEnabled"]').click(function () {
        var $this = $(this);
        var enabled = $this.prop('checked');
        if (enabled !== Config.autoChangeIdColorEnabled) {
            (0, _Config.read)();
            Config.autoChangeIdColorEnabled = enabled;
            (0, _Config.write)();
        }

        if (enabled) {
            $idColors.addClass('pd_id_color_select').find('td:not(:has(a))').css('cursor', 'not-allowed');
            $('\n<label class="pd_cfg_ml">\n  \u66F4\u6362\u987A\u5E8F\n  <select name="autoChangeIdColorType" style="font-size: 12px;">\n    <option value="random">\u968F\u673A</option><option value="sequence">\u987A\u5E8F</option>\n  </select>\n</label>&nbsp;\n<label>\u6BCF\u9694 <input name="autoChangeIdColorInterval" class="pd_input" style="width: 25px;" type="text" maxlength="5"> \u5C0F\u65F6</label>\n<button name="save" type="button">\u4FDD\u5B58</button>\n<button name="reset" type="button" style="margin-left: 3px;">\u91CD\u7F6E</button><br>\n<a class="pd_btn_link" data-name="selectAll" href="#">\u5168\u9009</a>\n<a class="pd_btn_link" data-name="selectInverse" href="#">\u53CD\u9009</a>\n<label><input name="changeAllAvailableIdColorEnabled" class="pd_input" type="checkbox"> \u9009\u62E9\u5F53\u524D\u6240\u6709\u53EF\u7528\u7684ID\u989C\u8272</label>\n').insertAfter($this.parent()).filter('[name="save"]').click(function () {
                var $autoChangeIdColorInterval = $area.find('[name="autoChangeIdColorInterval"]');
                var interval = parseInt($autoChangeIdColorInterval.val());
                if (isNaN(interval) || interval <= 0) {
                    alert('ID颜色更换时间间隔格式不正确');
                    $autoChangeIdColorInterval.select().focus();
                    return;
                }
                var changeAllAvailableSMColorEnabled = $area.find('[name="changeAllAvailableIdColorEnabled"]').prop('checked');
                var customChangeSMColorList = [];
                $idColors.find('[type="checkbox"]:checked').each(function () {
                    customChangeSMColorList.push(parseInt($(this).val()));
                });
                if (!changeAllAvailableSMColorEnabled && customChangeSMColorList.length <= 1) {
                    alert('必须选择2种或以上的ID颜色');
                    return;
                }
                if (customChangeSMColorList.length <= 1) customChangeSMColorList = [];

                var oriInterval = Config.autoChangeIdColorInterval;
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
                var $this = $(this);
                var matches = /&color=(\d+)/i.exec($this.find('a').attr('href'));
                if (matches) $this.append('<input type="checkbox" class="pd_input" value="' + matches[1] + '">');
            });

            $area.find('[name="autoChangeIdColorType"]').val(Config.autoChangeIdColorType);
            $area.find('[name="autoChangeIdColorInterval"]').val(Config.autoChangeIdColorInterval);
            $area.find('[name="changeAllAvailableIdColorEnabled"]').click(function () {
                $idColors.find('input').prop('disabled', $(this).prop('checked'));
            }).prop('checked', Config.changeAllAvailableIdColorEnabled).triggerHandler('click');
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Config.customAutoChangeIdColorList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var id = _step3.value;

                    $idColors.find('input[value="' + id + '"]').prop('checked', true);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        } else {
            $this.parent().nextAll().remove();
            $idColors.removeClass('pd_id_color_select').find('input').remove();
        }
    });

    $idColors.on('click', 'td', function (e) {
        if (!$(e.target).is('a')) {
            var $this = $(this);
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
var syncModifyPerPageFloorNum = exports.syncModifyPerPageFloorNum = function syncModifyPerPageFloorNum() {
    var syncConfig = function syncConfig() {
        var perPageFloorNum = parseInt($('select[name="p_num"]').val());
        if (isNaN(perPageFloorNum)) return;
        if (!perPageFloorNum) perPageFloorNum = 10;
        if (perPageFloorNum !== Config.perPageFloorNum) {
            Config.perPageFloorNum = perPageFloorNum;
            (0, _Config.write)();
        }
    };
    $('form#creator').submit(function () {
        (0, _Config.read)();
        syncConfig();
    });
    syncConfig();
};

/**
 * 在设置页面添加更换头像提醒
 */
var addAvatarChangeAlert = exports.addAvatarChangeAlert = function addAvatarChangeAlert() {
    $('input[name="uploadurl[2]"]').parent().append('<div class="pd_highlight">本反向代理服务器为了提高性能对图片设置了缓存，更换头像后可能需等待<b>最多30分钟</b>才能看到效果</div>');
};

/**
 * 高亮自助评分错标文件大小
 */
var highlightRatingErrorSize = exports.highlightRatingErrorSize = function highlightRatingErrorSize() {
    $('.adp1 a[href^="read.php?tid="]').each(function () {
        var $this = $(this);
        var title = $this.text();
        var ratingSize = 0;
        var $ratingCell = $this.parent('td').next('td');
        var matches = /认定\[(\d+)\]/i.exec($ratingCell.text());
        if (matches) {
            ratingSize = parseInt(matches[1]);
        }

        var _Public$checkRatingSi = Public.checkRatingSize(title, ratingSize),
            type = _Public$checkRatingSi.type,
            titleSize = _Public$checkRatingSi.titleSize;

        if (type === -1) {
            $ratingCell.css('color', '#ff9933').attr('title', '标题文件大小无法解析').addClass('pd_custom_tips');
        } else if (type === 1) {
            $ratingCell.addClass('pd_highlight pd_custom_tips').attr('title', '\u6807\u9898\u6587\u4EF6\u5927\u5C0F(' + titleSize.toLocaleString() + 'M)\u4E0E\u8BA4\u5B9A\u6587\u4EF6\u5927\u5C0F(' + ratingSize.toLocaleString() + 'M)\u4E0D\u4E00\u81F4');
        }
    });
};

/**
 * 在提交自助评分时显示错标文件大小警告
 */
var showSelfRatingErrorSizeSubmitWarning = exports.showSelfRatingErrorSizeSubmitWarning = function showSelfRatingErrorSizeSubmitWarning() {
    $('form[name="mail1"]').submit(function () {
        var ratingSize = parseFloat($('[name="psize"]').val());
        if (isNaN(ratingSize) || ratingSize <= 0) return;
        if (parseInt($('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
        var title = $('.adp1 a[href^="read.php?tid="]').text();

        var _Public$checkRatingSi2 = Public.checkRatingSize(title, ratingSize),
            type = _Public$checkRatingSi2.type,
            titleSize = _Public$checkRatingSi2.titleSize;

        if (type === 1) {
            return confirm('\u6807\u9898\u6587\u4EF6\u5927\u5C0F(' + titleSize.toLocaleString() + 'M)\u4E0E\u8BA4\u5B9A\u6587\u4EF6\u5927\u5C0F(' + ratingSize.toLocaleString() + 'M)\u4E0D\u4E00\u81F4\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F');
        }
    });
};

/**
 * 在论坛排行页面为用户名添加链接
 */
var addUserNameLinkInRankPage = exports.addUserNameLinkInRankPage = function addUserNameLinkInRankPage() {
    $('.kf_no11:eq(2) > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
        var $this = $(this);
        var userName = $this.text().trim();
        $this.html('<a href="profile.php?action=show&username=' + userName + '" target="_blank">' + userName + '</a>');
        if (userName === _Info2.default.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 处理个人信息页面上的元素
 */
var handleProfilePage = exports.handleProfilePage = function handleProfilePage() {
    var $area = $('.log1 > tbody > tr:last-child > td:nth-child(2)');
    $area.html($area.html().replace(/系统等级：(\S+)/, '系统等级：<span class="pd_highlight">$1</span>').replace(/发帖数量：(\d+)/, function (m, num) {
        return '\u53D1\u5E16\u6570\u91CF\uFF1A<span data-num="' + num + '">' + parseInt(num).toLocaleString() + '</span>';
    }).replace(/论坛货币：(-?\d+)/, function (m, num) {
        return '\u8BBA\u575B\u8D27\u5E01\uFF1A<span data-num="' + num + '">' + parseInt(num).toLocaleString() + '</span>';
    }).replace(/在线时间：(\d+)/, function (m, num) {
        return '\u5728\u7EBF\u65F6\u95F4\uFF1A<span data-num="' + num + '">' + parseInt(num).toLocaleString() + '</span>';
    }).replace(/注册时间：((\d{4})-(\d{2})-(\d{2}))/, function (m, date, year, month, day) {
        var now = new Date();
        var html = date;
        if (parseInt(month) === now.getMonth() + 1 && parseInt(day) === now.getDate() && parseInt(year) <= now.getFullYear()) html = '<span class="pd_custom_tips pd_highlight" title="\u4ECA\u5929\u662F\u8BE5\u7528\u6237\u6CE8\u518C' + (now.getFullYear() - parseInt(year)) + '\u5468\u5E74\u7EAA\u5FF5\u65E5">' + date + '</span>';
        return '注册时间：' + html;
    }));
};

},{"./Bank":2,"./Config":4,"./ConfigDialog":5,"./Const":6,"./Info":9,"./Msg":15,"./Public":18,"./TmpLog":21,"./Util":22}],17:[function(require,module,exports){
/* 发帖模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.savePostContentWhenSubmit = exports.preventCloseWindowWhenEditPost = exports.importKfSmileEnhanceExtension = exports.addAttachChangeAlert = exports.modifyPostPreviewPage = exports.addExtraOptionInPostPage = exports.addExtraPostEditorButton = exports.removeUnpairedBBCodeInQuoteContent = exports.handleMultiQuote = undefined;

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 处理多重回复和多重引用
 * @param {number} type 处理类型，1：多重回复；2：多重引用
 */
var handleMultiQuote = exports.handleMultiQuote = function handleMultiQuote() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

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
    var data = localStorage[_Const2.default.multiQuoteStorageName];
    if (!data) return;
    try {
        data = JSON.parse(data);
    } catch (ex) {
        return;
    }
    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) return;
    var tid = parseInt(Util.getUrlParam('tid')),
        fid = parseInt(Util.getUrlParam('fid'));
    if (!tid || typeof data.tid === 'undefined' || data.tid !== tid || !Array.isArray(data.quoteList)) return;
    if (type === 2 && !fid) return;
    var list = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = data.quoteList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var quote = _step.value;

            if (!Array.isArray(quote)) continue;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = quote[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _data = _step2.value;

                    list.push(_data);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (!list.length) {
        localStorage.removeItem(_Const2.default.multiQuoteStorageName);
        return;
    }
    var keywords = new Set();
    var content = '';
    if (type === 2) {
        Msg.wait('<strong>\u6B63\u5728\u83B7\u53D6\u5F15\u7528\u5185\u5BB9\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + list.length + '</em></i>');
        $(document).clearQueue('MultiQuote');
    }
    $.each(list, function (index, data) {
        if (typeof data.floor === 'undefined' || typeof data.pid === 'undefined') return;
        keywords.add(data.userName);
        if (type === 2) {
            $(document).queue('MultiQuote', function () {
                $.get('post.php?action=quote&fid=' + fid + '&tid=' + tid + '&pid=' + data.pid + '&article=' + data.floor + '&t=' + new Date().getTime(), function (html) {
                    var matches = /<textarea id="textarea".*?>((.|\n)+?)<\/textarea>/i.exec(html);
                    if (matches) {
                        content += Util.removeUnpairedBBCodeContent(Util.htmlDecode(matches[1]).replace(/\n{2,}/g, '\n')) + (index === list.length - 1 ? '' : '\n');
                    }
                    var $countdown = $('.pd_countdown:last');
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
            content += '[quote]\u56DE ' + data.floor + '\u697C(' + data.userName + ') \u7684\u5E16\u5B50[/quote]\n';
        }
    });
    $('input[name="diy_guanjianci"]').val([].concat(_toConsumableArray(keywords)).join(','));
    $('form[name="FORM"]').submit(function () {
        localStorage.removeItem(_Const2.default.multiQuoteStorageName);
    });
    if (type === 2) $(document).dequeue('MultiQuote');else $('[name="atc_content"]').val(content).focus();
    Script.runFunc('Post.handleMultiQuote_after_', type);
};

/**
 * 去除引用内容中不配对的BBCode
 */
var removeUnpairedBBCodeInQuoteContent = exports.removeUnpairedBBCodeInQuoteContent = function removeUnpairedBBCodeInQuoteContent() {
    var $content = $('#textarea');
    var content = $content.val();
    var matches = /\[quote\](.|\r|\n)+?\[\/quote\]/.exec(content);
    if (matches) {
        var workedContent = Util.removeUnpairedBBCodeContent(matches[0]);
        if (matches[0] !== workedContent) {
            $content.val(content.replace(matches[0], workedContent));
        }
    }
};

/**
 * 在发帖页面的发帖框上添加额外的按钮
 */
var addExtraPostEditorButton = exports.addExtraPostEditorButton = function addExtraPostEditorButton() {
    var textArea = $('#textarea').get(0);
    if (!textArea) return;

    $('\n<span id="wy_post" title="\u63D2\u5165\u9690\u85CF\u5185\u5BB9" data-type="hide" style="background-position: 0 -280px;">\u63D2\u5165\u9690\u85CF\u5185\u5BB9</span>\n<span id="wy_justifyleft" title="\u5DE6\u5BF9\u9F50" data-type="left" style="background-position: 0 -360px;">\u5DE6\u5BF9\u9F50</span>\n<span id="wy_justifycenter" title="\u5C45\u4E2D" data-type="center" style="background-position: 0 -380px;">\u5C45\u4E2D</span>\n<span id="wy_justifyright" title="\u53F3\u5BF9\u9F50" data-type="right" style="background-position: 0 -400px;">\u53F3\u5BF9\u9F50</span>\n<span id="wy_subscript" title="\u4E0B\u6807" data-type="sub" style="background-position: 0 -80px;">\u4E0B\u6807</span>\n<span id="wy_superscript" title="\u4E0A\u6807" data-type="sup" style="background-position: 0 -100px;">\u4E0A\u6807</span>\n<span class="pd_editor_btn" title="\u63D2\u5165\u98DE\u884C\u6587\u5B57" data-type="fly">F</span>\n<span class="pd_editor_btn" title="\u63D2\u5165HTML5\u97F3\u9891" data-type="audio">A</span>\n<span class="pd_editor_btn" title="\u63D2\u5165HTML5\u89C6\u9891" data-type="video">V</span>\n').appendTo('#editor-button .editor-button').click(function () {
        var $this = $(this);
        var type = $this.data('type');
        var text = '';
        switch (type) {
            case 'hide':
                text = prompt('请输入神秘等级：', 5);
                break;
            case 'audio':
                {
                    text = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐或虾米的单曲地址，将自动转换为外链地址）', 'http://');
                    var matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(text);
                    if (matches) text = 'http://music.miaola.info/163/' + matches[1] + '.mp3';
                    matches = /^https?:\/\/www\.xiami\.com\/song\/(\d+)/i.exec(text);
                    if (matches) text = 'http://music.miaola.info/xiami/' + matches[1] + '.mp3';
                }
                break;
            case 'video':
                {
                    text = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://');
                    var _matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(text);
                    if (_matches) text = 'http://video.miaola.info/youtube/' + _matches[1];
                    _matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(text);
                    if (_matches) text = 'http://video.miaola.info/youtube/' + _matches[1];
                }
                break;
        }
        if (text === null) return;

        var selText = '';
        var code = '';
        switch (type) {
            case 'hide':
                selText = Util.getSelText(textArea);
                code = '[hide=' + text + ']' + selText + '[/hide]';
                break;
            case 'left':
                selText = Util.getSelText(textArea);
                code = '[align=left]' + selText + '[/align]';
                break;
            case 'center':
                selText = Util.getSelText(textArea);
                code = '[align=center]' + selText + '[/align]';
                break;
            case 'right':
                selText = Util.getSelText(textArea);
                code = '[align=right]' + selText + '[/align]';
                break;
            case 'fly':
                selText = Util.getSelText(textArea);
                code = '[fly]' + selText + '[/fly]';
                break;
            case 'sub':
                selText = Util.getSelText(textArea);
                code = '[sub]' + selText + '[/sub]';
                break;
            case 'sup':
                selText = Util.getSelText(textArea);
                code = '[sup]' + selText + '[/sup]';
                break;
            case 'audio':
                code = '[audio]' + text + '[/audio]';
                break;
            case 'video':
                code = '[video]' + text + '[/video]';
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
var addExtraOptionInPostPage = exports.addExtraOptionInPostPage = function addExtraOptionInPostPage() {
    $('\n<div class="pd_post_extra_option">\n  <label><input type="checkbox" name="autoAnalyzeUrl" checked> \u81EA\u52A8\u5206\u6790url</label><br>\n  <label><input type="checkbox" name="windCodeAutoConvert" checked> Wind Code\u81EA\u52A8\u8F6C\u6362</label>\n</div>\n').appendTo($('#menu_show').closest('td')).on('click', '[type="checkbox"]', function () {
        var $this = $(this);
        var inputName = $this.is('[name="autoAnalyzeUrl"]') ? 'atc_autourl' : 'atc_convert';
        $('form[name="FORM"]').find('[name="' + inputName + '"]').val($this.prop('checked') ? 1 : 0);
    });

    $('<input type="button" value="预览帖子" style="margin-left: 7px;">').insertAfter('[type="submit"][name="Submit"]').click(function (e) {
        e.preventDefault();
        var $form = $('form[name="preview"]');
        $form.find('input[name="atc_content"]').val($('#textarea').val());
        $form.submit();
    });
};

/**
 * 修正发帖预览页面
 */
var modifyPostPreviewPage = exports.modifyPostPreviewPage = function modifyPostPreviewPage() {
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
var addAttachChangeAlert = exports.addAttachChangeAlert = function addAttachChangeAlert() {
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
var importKfSmileEnhanceExtension = exports.importKfSmileEnhanceExtension = function importKfSmileEnhanceExtension() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = 'https://kf.miaola.info/KfEmotion.min.user.js' + (typeof _Info2.default.w.resTimestamp !== 'undefined' ? '?ts=' + _Info2.default.w.resTimestamp : '');
    document.body.appendChild(script);
};

/**
 * 在撰写发帖内容时阻止关闭页面
 */
var preventCloseWindowWhenEditPost = exports.preventCloseWindowWhenEditPost = function preventCloseWindowWhenEditPost() {
    window.addEventListener('beforeunload', function (e) {
        var $textArea = $(location.pathname === '/post.php' ? '#textarea' : '[name="atc_content"]');
        var content = $textArea.val();
        if (content && content !== $textArea.get(0).defaultValue && !/\[\/quote]\n*$/.test(content) && !_Info2.default.w.isSubmit) {
            var msg = '你可能正在撰写发帖内容中，确定要关闭页面吗？';
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
var savePostContentWhenSubmit = exports.savePostContentWhenSubmit = function savePostContentWhenSubmit() {
    var $textArea = $(location.pathname === '/post.php' ? '#textarea' : '[name="atc_content"]');
    $('form[action="post.php?"]').submit(function () {
        var content = $textArea.val();
        if ($.trim(content).length > 0) sessionStorage.setItem(_Const2.default.postContentStorageName, content);
    });

    var postContent = sessionStorage.getItem(_Const2.default.postContentStorageName);
    if (postContent) {
        $('\n<div style="padding: 0 10px; line-height: 2em; text-align: left; background-color: #fefee9; border: 1px solid #99f;">\n  <a class="pd_btn_link" data-name="restore" href="#">[\u6062\u590D\u4E0A\u6B21\u63D0\u4EA4\u7684\u5185\u5BB9]</a>\n  <a class="pd_btn_link" data-name="clear" href="#">[\u6E05\u9664]</a>\n</div>\n').insertBefore($textArea).find('[data-name="restore"]').click(function (e) {
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

},{"./Const":6,"./Info":9,"./Msg":15,"./Script":20,"./Util":22}],18:[function(require,module,exports){
/* 公共模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showCommonImportOrExportConfigDialog = exports.checkRatingSize = exports.turnPageViaKeyboard = exports.repairBbsErrorCode = exports.addSearchDialogLink = exports.makeSearchByBelowTwoKeyWordAvailable = exports.bindSearchTypeSelectMenuClick = exports.bindElementTitleClick = exports.showElementTitleTips = exports.changeIdColor = exports.autoSaveCurrentDeposit = exports.addFastNavForSideBar = exports.modifySideBar = exports.blockThread = exports.blockUsers = exports.followUsers = exports.getDailyBonus = exports.donation = exports.startTimingMode = exports.getNextTimingInterval = exports.addPolyfill = exports.showFormatLog = exports.preventCloseWindowWhenActioning = exports.addConfigAndLogDialogLink = exports.appendCss = exports.checkBrowserType = exports.getSafeId = exports.getUidAndUserName = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 获取Uid和用户名
 * @returns {boolean} 是否获取成功
 */
var getUidAndUserName = exports.getUidAndUserName = function getUidAndUserName() {
    var $user = $('.topright a[href^="profile.php?action=show&uid="]').eq(0);
    if (!$user.length) return false;
    _Info2.default.userName = $user.text();
    if (!_Info2.default.userName) return false;
    var matches = /&uid=(\d+)/.exec($user.attr('href'));
    if (!matches) return false;
    _Info2.default.uid = parseInt(matches[1]);
    return true;
};

/**
 * 获取用户的SafeID
 * @returns {string} 用户的SafeID
 */
var getSafeId = exports.getSafeId = function getSafeId() {
    var safeId = $('input#safeid').val();
    if (!safeId) {
        var matches = /safeid=(\w+)/i.exec($('a[href*="safeid="]:first').attr('href'));
        if (matches) safeId = matches[1];
    }
    return safeId ? safeId : '';
};

/**
 * 检查浏览器类型
 */
var checkBrowserType = exports.checkBrowserType = function checkBrowserType() {
    if (Config.browseType === 'auto') {
        _Info2.default.isMobile = /(Mobile|MIDP)/i.test(navigator.userAgent);
    } else {
        _Info2.default.isMobile = Config.browseType === 'mobile';
    }
};

/**
 * 添加CSS样式
 */
var appendCss = exports.appendCss = function appendCss() {
    $('head').append('\n<style>\n  /* \u516C\u5171 */\n  .pd_highlight { color: #f00 !important; }\n  .pd_notice, .pd_msg .pd_notice { font-style: italic; color: #666; }\n  .pd_input, .pd_cfg_main input, .pd_cfg_main select {\n    vertical-align: middle; height: auto; margin-right: 0; line-height: 22px; font-size: 12px;\n  }\n  .pd_input[type="text"], .pd_input[type="number"], .pd_cfg_main input[type="text"], .pd_cfg_main input[type="number"] {\n    height: 22px; line-height: 22px;\n  }\n  .pd_input:focus, .pd_cfg_main input[type="text"]:focus, .pd_cfg_main input[type="number"]:focus, .pd_cfg_main textarea:focus,\n      .pd_textarea:focus { border-color: #7eb4ea; }\n  .pd_textarea, .pd_cfg_main textarea { border: 1px solid #ccc; font-size: 12px; }\n  .pd_btn_link { margin-left: 4px; margin-right: 4px; }\n  .pd_custom_tips { cursor: help; }\n  .pd_disabled_link { color: #999 !important; text-decoration: none !important; cursor: default; }\n  hr {\n    box-sizing: content-box; height: 0; margin-top: 7px; margin-bottom: 7px; border: 0;\n    border-top: 1px solid rgba(0, 0, 0, .2); overflow: visible;\n  }\n  .pd_overflow { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n  .pd_hide { width: 0 !important; height: 0 !important; font: 0/0 a; color: transparent; background-color: transparent; border: 0 !important; }\n  .pd_stat i { display: inline-block; font-style: normal; margin-right: 3px; }\n  .pd_stat_extra em, .pd_stat_extra ins { padding: 0 2px; cursor: help; }\n  .pd_panel { position: absolute; overflow-y: auto; background-color: #fff; border: 1px solid #9191ff; opacity: 0.9; }\n  .pd_title_tips {\n    position: absolute; max-width: 470px; font-size: 12px; line-height: 1.5em;\n    padding: 2px 5px; background-color: #fcfcfc; border: 1px solid #767676; z-index: 9999;\n  }\n  .pd_search_type {\n    float: left; height: 26px; line-height: 26px; width: 65px; text-align: center; border: 1px solid #ccc; border-left: none; cursor: pointer;\n  }\n  .pd_search_type i { font-style: normal; margin-left: 5px; font-family: sans-serif; }\n  .pd_search_type_list {\n    position: absolute; width: 63px; background-color: #fcfcfc; border: 1px solid #ccc; border-top: none; line-height: 26px;\n    text-indent: 13px; cursor: pointer; z-index: 1003;\n  }\n  .pd_search_type_list li:hover { color: #fff; background-color: #87c3cf; }\n  \n  /* \u6D88\u606F\u6846 */\n  .pd_mask { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1001; }\n  .pd_msg_container { position: ' + (_Info2.default.isMobile ? 'absolute' : 'fixed') + '; width: 100%; z-index: 1002; }\n  .pd_msg {\n    border: 1px solid #6ca7c0; text-shadow: 0 0 3px rgba(0, 0, 0, 0.1); border-radius: 3px; padding: 12px 40px; text-align: center;\n    font-size: 14px; position: absolute; display: none; color: #333; background: #f8fcfe; background-repeat: no-repeat;\n    background-image: -webkit-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);\n    background-image: -moz-linear-gradient(top, #f9fcfe, #f6fbfe 25%, #eff7fc);\n    background-image: -o-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);\n    background-image: -ms-linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);\n    background-image: linear-gradient(#f9fcfe, #f6fbfe 25%, #eff7fc);\n  }\n  .pd_msg strong { margin-right: 5px; }\n  .pd_msg i { font-style: normal; padding-left: 10px; }\n  .pd_msg em, .pd_stat em, .pd_msg ins, .pd_stat ins { font-weight: 700; font-style: normal; color:#ff6600; padding: 0 3px; }\n  .pd_msg ins, .pd_stat ins { text-decoration: none; color: #339933; }\n  .pd_msg a { font-weight: bold; margin-left: 15px; }\n  \n  /* \u5E16\u5B50\u9875\u9762 */\n  .readlou .pd_goto_link { color: #000; }\n  .readlou .pd_goto_link:hover { color: #51d; }\n  .pd_fast_goto_floor, .pd_multi_quote_chk { margin-right: 2px; }\n  .pd_user_memo { font-size: 12px; color: #999; line-height: 14px; }\n  .pd_user_memo_tips { font-size: 12px; color: #fff; margin-left: 3px; cursor: help; }\n  .pd_user_memo_tips:hover { color: #ddd; }\n  .readtext img[onclick] { max-width: 550px; }\n  .read_fds { text-align: left !important; font-weight: normal !important; font-style: normal !important; }\n  .pd_code_area { max-height: 550px; overflow-y: auto; font-size: 12px; font-family: Consolas, "Courier New"; }\n  \n  /* \u9053\u5177\u9875\u9762 */\n  .pd_item_btns { text-align: right; margin-top: 5px;  }\n  .pd_item_btns button, .pd_item_btns input { margin-bottom: 2px; vertical-align: middle; }\n  .pd_items > tbody > tr > td > a + a { margin-left: 15px; }\n  .pd_result { border: 1px solid #99f; padding: 5px; margin-top: 10px; line-height: 2em; }\n  .pd_result_sep { border-bottom: 1px solid #999; margin: 7px 0; }\n  .pd_result_sep_inner { border-bottom: 1px dashed #999; margin: 5px 0; }\n  .pd_usable_num { color: #669933; }\n  .pd_used_num { color: #ff0033; }\n  .pd_used_item_info { color: #666; float: right; cursor: help; margin-right: 5px; }\n  .pd_item_type_chk { margin-right: 5px; }\n  \n  /* \u53D1\u5E16\u9875\u9762 */\n  #pdSmilePanel img { margin: 3px; cursor: pointer; }\n  .editor-button .pd_editor_btn { background: none; text-indent: 0; line-height: 18px; cursor: default; }\n  .pd_post_extra_option { text-align: left; margin-top: 5px; margin-left: 5px; }\n  .pd_post_extra_option input { vertical-align: middle; height: auto; margin-right: 0; }\n  \n  /* \u5176\u5B83\u9875\u9762 */\n  .pd_thread_page { margin-left: 5px; }\n  .pd_thread_page a { color: #444; padding: 0 3px; }\n  .pd_thread_page a:hover { color: #51d; }\n  .pd_card_chk { position: absolute; bottom: -8px; left: 1px; }\n  .b_tit4 .pd_thread_goto, .b_tit4_1 .pd_thread_goto { position: absolute; top: 0; right: 0; padding: 0 15px; }\n  .b_tit4 .pd_thread_goto:hover, .b_tit4_1 .pd_thread_goto:hover { padding-left: 15px; }\n  .pd_id_color_select > td { position: relative; cursor: pointer; }\n  .pd_id_color_select > td > input { position: absolute; top: 18px; left: 10px; }\n\n  /* \u8BBE\u7F6E\u5BF9\u8BDD\u6846 */\n  .pd_cfg_ml { margin-left: 10px; }\n  .pd_cfg_box {\n    position: ' + (_Info2.default.isMobile ? 'absolute' : 'fixed') + '; border: 1px solid #9191ff; display: none; z-index: 1000;\n    -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);\n    -o-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);\n  }\n  .pd_cfg_box h1 {\n    text-align: center; font-size: 14px; background-color: #9191ff; color: #fff; line-height: 2em; margin: 0; padding-left: 20px;\n  }\n  .pd_cfg_box h1 span { float: right; cursor: pointer; padding: 0 10px; }\n  .pd_cfg_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }\n  .pd_cfg_main { background-color: #fcfcfc; padding: 0 10px; font-size: 12px; line-height: 24px; min-height: 50px; overflow: auto; }\n  .pd_cfg_main fieldset { border: 1px solid #ccccff; padding: 0 6px 6px; }\n  .pd_cfg_main legend { font-weight: bold; }\n  .pd_cfg_main input[type="color"] { height: 18px; width: 30px; padding: 0; }\n  .pd_cfg_main button { vertical-align: middle; }\n  .pd_cfg_tips { color: #51d; text-decoration: none; cursor: help; }\n  .pd_cfg_tips:hover { color: #ff0000; }\n  #pdConfigDialog .pd_cfg_main { overflow-x: hidden; white-space: nowrap; }\n  .pd_cfg_panel { display: inline-block; width: 380px; vertical-align: top; }\n  .pd_cfg_panel + .pd_cfg_panel { margin-left: 5px; }\n  .pd_cfg_btns { background-color: #fcfcfc; text-align: right; padding: 5px; }\n  .pd_cfg_btns button { min-width: 80px; }\n  .pd_cfg_about { float: left; line-height: 24px; margin-left: 5px; }\n  .pd_custom_script_header { margin: 7px 0; padding: 5px; background-color: #e8e8e8; border-radius: 5px; }\n  .pd_custom_script_content { display: none; width: 750px; height: 350px; white-space: pre; }\n\n  /* \u65E5\u5FD7\u5BF9\u8BDD\u6846 */\n  .pd_log_nav { text-align: center; margin: -5px 0 -12px; font-size: 14px; line-height: 44px; }\n  .pd_log_nav a { display: inline-block; }\n  .pd_log_nav h2 { display: inline; font-size: 14px; margin-left: 7px; margin-right: 7px; }\n  .pd_log_content { height: 242px; overflow: auto; }\n  .pd_log_content h3 { display: inline-block; font-size: 12px; line-height: 22px; margin: 0; }\n  .pd_log_content h3:not(:first-child) { margin-top: 5px; }\n  .pd_log_content p { line-height: 22px; margin: 0; }\n</style>\n');

    if (Config.customCssEnabled) {
        $('head').append('<style>' + Config.customCssContent + '</style>');
    }
};

/**
 * 添加设置和日志对话框的链接
 */
var addConfigAndLogDialogLink = exports.addConfigAndLogDialogLink = function addConfigAndLogDialogLink() {
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
var preventCloseWindowWhenActioning = exports.preventCloseWindowWhenActioning = function preventCloseWindowWhenActioning(e) {
    if ($('.pd_mask').length > 0) {
        var msg = '操作正在进行中，确定要关闭页面吗？';
        e.returnValue = msg;
        return msg;
    }
};

/**
 * 输出经过格式化后的控制台消息
 * @param {string} msgType 消息类别
 * @param {string} html 回应的HTML源码
 */
var showFormatLog = exports.showFormatLog = function showFormatLog(msgType, html) {
    var _Util$getResponseMsg = Util.getResponseMsg(html),
        msg = _Util$getResponseMsg.msg,
        url = _Util$getResponseMsg.url;

    console.log('\u3010' + msgType + '\u3011\u56DE\u5E94\uFF1A' + msg + (url ? '\uFF1B\u8DF3\u8F6C\u5730\u5740\uFF1A' + Util.getHostNameUrl() + url : ''));
};

/**
 * 添加兼容方法
 */
var addPolyfill = exports.addPolyfill = function addPolyfill() {
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (searchElement /*, fromIndex = 0 */) {
            'use strict';

            if (this == null) {
                throw new TypeError('Array.prototype.includes called on null or undefined');
            }
            var O = Object(this);
            var len = parseInt(O.length) || 0;
            if (len === 0) return false;
            var n = parseInt(arguments[1]) || 0;
            var k = void 0;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {
                    k = 0;
                }
            }
            var currentElement = void 0;
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
        String.prototype.padStart = function padStart(maxLength) {
            var fillString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

            var O = Object(this);
            var S = String(O);
            var intMaxLength = parseInt(maxLength) || 0;
            var stringLength = parseInt(S.length) || 0;
            if (intMaxLength <= stringLength) return S;
            var filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
            if (filler === '') return S;
            var fillLen = intMaxLength - stringLength;
            while (filler.length < fillLen) {
                var fLen = filler.length;
                var remainingCodeUnits = fillLen - fLen;
                if (fLen > remainingCodeUnits) {
                    filler += filler.slice(0, remainingCodeUnits);
                } else {
                    filler += filler;
                }
            }
            var truncatedStringFiller = filler.slice(0, fillLen);
            return truncatedStringFiller + S;
        };
    }
    if (!String.prototype.padEnd) {
        String.prototype.padEnd = function padEnd(maxLength) {
            var fillString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

            var O = Object(this);
            var S = String(O);
            var intMaxLength = parseInt(maxLength) || 0;
            var stringLength = parseInt(S.length) || 0;
            if (intMaxLength <= stringLength) return S;
            var filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
            if (filler === '') return S;
            var fillLen = intMaxLength - stringLength;
            while (filler.length < fillLen) {
                var fLen = filler.length;
                var remainingCodeUnits = fillLen - fLen;
                if (fLen > remainingCodeUnits) {
                    filler += filler.slice(0, remainingCodeUnits);
                } else {
                    filler += filler;
                }
            }
            var truncatedStringFiller = filler.slice(0, fillLen);
            return S + truncatedStringFiller;
        };
    }
};

/**
 * 获取定时模式下次操作的时间间隔（秒）
 * @returns {number} 定时模式下次操作的时间间隔（秒）
 */
var getNextTimingInterval = exports.getNextTimingInterval = function getNextTimingInterval() {
    /*let donationInterval = -1;
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
     }*/

    var lootInterval = -1;
    if (Config.autoLootEnabled) {
        var value = parseInt(Util.getCookie(_Const2.default.lootCompleteCookieName));
        if (value > 0) {
            var date = Util.getTimezoneDateByTime(_Const2.default.lootAfterTime);
            date.setDate(date.getDate() + 1);
            var now = new Date();
            if (now > date) date.setDate(date.getDate() + 1);
            lootInterval = Math.floor((date - now) / 1000);
        } else if (value < 0) lootInterval = 60 * 60;else if (Util.getCookie(_Const2.default.lootAttackingCookieName)) lootInterval = _Const2.default.lootAttackingExpires * 60;else lootInterval = 0;
    }

    var getDailyBonusInterval = -1;
    if (Config.autoGetDailyBonusEnabled) {
        var _value = parseInt(Util.getCookie(_Const2.default.getDailyBonusCookieName));
        if (_value > 0) {
            var _date = Util.getTimezoneDateByTime(_Const2.default.getDailyBonusAfterTime);
            _date.setDate(_date.getDate() + 1);
            var _now = new Date();
            if (_now > _date) _date.setDate(_date.getDate() + 1);
            getDailyBonusInterval = Math.floor((_date - _now) / 1000);
        } else if (_value < 0) getDailyBonusInterval = _Const2.default.getDailyBonusSpecialInterval * 60;else getDailyBonusInterval = 0;
    }

    var minArr = [lootInterval, getDailyBonusInterval].filter(function (interval) {
        return interval >= 0;
    });
    if (minArr.length > 0) {
        var min = Math.min.apply(Math, _toConsumableArray(minArr));
        return min > 0 ? min + 1 : 0;
    } else return -1;
};

/**
 * 启动定时模式
 */
var startTimingMode = exports.startTimingMode = function startTimingMode() {
    var interval = getNextTimingInterval();
    if (interval === -1) return;
    var oriTitle = document.title;
    var titleItvFunc = null;
    var prevInterval = -1,
        errorNum = 0;

    /**
     * 获取经过格式化的倒计时标题
     * @param {number} type 倒计时显示类型，1：[小时:][分钟:]秒钟；2：[小时:]分钟
     * @param {number} interval 倒计时
     * @returns {string} 经过格式化的倒计时标题
     */
    var getFormatIntervalTitle = function getFormatIntervalTitle(type, interval) {
        var diff = Util.getTimeDiffInfo(Util.getDate('+' + interval + 's').getTime());
        var textInterval = diff.hours > 0 ? diff.hours + '时' : '';
        if (type === 1) textInterval += (diff.minutes > 0 ? diff.minutes + '分' : '') + diff.seconds + '秒';else textInterval += diff.minutes + '分';
        return textInterval;
    };

    /**
     * 显示定时模式标题提示
     * @param {number} interval 倒计时的时间间隔（秒）
     * @param {boolean} isShowTitle 是否立即显示标题
     */
    var showRefreshModeTips = function showRefreshModeTips(interval) {
        var isShowTitle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (titleItvFunc) window.clearInterval(titleItvFunc);
        var showInterval = interval;
        console.log('【定时模式】倒计时：' + getFormatIntervalTitle(1, showInterval));
        if (Config.showTimingModeTipsType.toLowerCase() !== 'never') {
            var showIntervalTitle = function showIntervalTitle() {
                document.title = oriTitle + ' (\u5B9A\u65F6: ' + getFormatIntervalTitle(interval < 60 ? 1 : 2, showInterval) + ')';
                showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            };
            if (isShowTitle || Config.showTimingModeTipsType.toLowerCase() === 'always' || interval < 60) showIntervalTitle();else showInterval = interval < 60 ? showInterval - 1 : showInterval - 60;
            titleItvFunc = setInterval(showIntervalTitle, _Const2.default.showRefreshModeTipsInterval * 60 * 1000);
        }
    };

    /**
     * 处理错误
     */
    var handleError = function handleError() {
        var interval = 0,
            errorText = '';
        $.ajax({
            type: 'GET',
            url: 'index.php?t=' + new Date().getTime(),
            timeout: _Const2.default.defAjaxTimeout,
            success: function success(html) {
                if (!/"kf_fw_ig_index.php"/.test(html)) {
                    interval = 10;
                    errorText = '论坛维护或其它未知情况';
                }
            },
            error: function error() {
                interval = _Const2.default.errorRefreshInterval;
                errorText = '连接超时';
            },
            complete: function complete() {
                if (interval > 0) {
                    console.log('\u5B9A\u65F6\u64CD\u4F5C\u5931\u8D25\uFF08\u539F\u56E0\uFF1A' + errorText + '\uFF09\uFF0C\u5C06\u5728' + interval + '\u5206\u949F\u540E\u91CD\u8BD5...');
                    Msg.remove($('.pd_refresh_notice').parent());
                    Msg.show('<strong class="pd_refresh_notice">\u5B9A\u65F6\u64CD\u4F5C\u5931\u8D25\uFF08\u539F\u56E0\uFF1A' + errorText + '\uFF09\uFF0C\u5C06\u5728<em>' + interval + '</em>\u5206\u949F\u540E\u91CD\u8BD5&hellip;</strong>', -1);
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
    var checkRefreshInterval = function checkRefreshInterval() {
        Msg.remove($('.pd_refresh_notice').parent());
        //if (Config.autoDonationEnabled && !Util.getCookie(Const.donationCookieName)) donation();
        if (Config.autoLootEnabled && !Util.getCookie(_Const2.default.lootCompleteCookieName) && !Util.getCookie(_Const2.default.lootAttackingCookieName)) Loot.checkLoot();
        if (Config.autoGetDailyBonusEnabled && !Util.getCookie(_Const2.default.getDailyBonusCookieName)) getDailyBonus();

        var interval = getNextTimingInterval();
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
 * KFB捐款
 * @param {boolean} isAutoSaveCurrentDeposit 是否在捐款完毕之后自动活期存款
 */
var donation = exports.donation = function donation() {
    var isAutoSaveCurrentDeposit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var now = new Date();
    var date = Util.getDateByTime(Config.donationAfterTime);
    if (now < date) {
        if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit();
        return;
    }
    Script.runFunc('Public.donation_before_');
    console.log('KFB捐款Start');
    var $wait = Msg.wait('<strong>正在进行捐款，请稍候&hellip;</strong>');

    /**
     * 获取捐款Cookies有效期
     * @returns {Date} Cookies有效期的Date对象
     */
    var getCookieDate = function getCookieDate() {
        var now = new Date();
        var date = Util.getTimezoneDateByTime('02:30:00');
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
    var donationSubmit = function donationSubmit(kfb) {
        $.post('kf_growup.php?ok=1', { kfb: kfb }, function (html) {
            Util.setCookie(_Const2.default.donationCookieName, 1, getCookieDate());
            showFormatLog('\u6350\u6B3E' + kfb + 'KFB', html);

            var _Util$getResponseMsg2 = Util.getResponseMsg(html),
                msg = _Util$getResponseMsg2.msg;

            Msg.remove($wait);

            var msgHtml = '<strong>\u6350\u6B3E<em>' + kfb + '</em>KFB</strong>';
            var matches = /捐款获得(\d+)经验值(?:.*?补偿期(?:.*?\+(\d+)KFB)?(?:.*?(\d+)成长经验)?)?/i.exec(msg);
            if (!matches) {
                if (/KFB不足。/.test(msg)) {
                    msgHtml += '<i class="pd_notice">KFB不足</i><a target="_blank" href="kf_growup.php">手动捐款</a>';
                } else return;
            } else {
                msgHtml += '<i>\u7ECF\u9A8C\u503C<em>+' + matches[1] + '</em></i>';
                var gain = { '经验值': parseInt(matches[1]) };
                if (typeof matches[2] !== 'undefined' || typeof matches[3] !== 'undefined') {
                    msgHtml += '<i style="margin-left: 5px;">(补偿期:</i>' + (typeof matches[2] !== 'undefined' ? '<i>KFB<em>+' + matches[2] + '</em>' + (typeof matches[3] !== 'undefined' ? '' : ')') + '</i>' : '') + (typeof matches[3] !== 'undefined' ? '<i>\u7ECF\u9A8C\u503C<em>+' + matches[3] + '</em>)</i>' : '');
                    if (typeof matches[2] !== 'undefined') gain['KFB'] = parseInt(matches[2]);
                    if (typeof matches[3] !== 'undefined') gain['经验值'] += parseInt(matches[3]);
                }
                Log.push('捐款', '\u6350\u6B3E`' + kfb + '`KFB', { gain: gain, pay: { 'KFB': -kfb } });
            }
            Msg.show(msgHtml);
            if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit(true);
            Script.runFunc('Public.donation_after_', msg);
        });
    };

    if (/%$/.test(Config.donationKfb)) {
        $.get('profile.php?action=show&uid=' + _Info2.default.uid + '&t=' + new Date().getTime(), function (html) {
            var matches = /论坛货币：(-?\d+)\s*KFB/i.exec(html);
            var income = 1;
            if (matches) income = parseInt(matches[1]);else console.log('当前持有KFB获取失败');
            var donationKfb = parseInt(Config.donationKfb);
            donationKfb = Math.floor(income * donationKfb / 100);
            donationKfb = donationKfb > 0 ? donationKfb : 1;
            donationKfb = donationKfb <= _Const2.default.maxDonationKfb ? donationKfb : _Const2.default.maxDonationKfb;
            donationSubmit(donationKfb);
        });
    } else {
        $.get('kf_growup.php?t=' + new Date().getTime(), function (html) {
            if (/>今天已经捐款</.test(html)) {
                Msg.remove($wait);
                Util.setCookie(_Const2.default.donationCookieName, 1, getCookieDate());
                if (isAutoSaveCurrentDeposit) autoSaveCurrentDeposit();
            } else {
                donationSubmit(parseInt(Config.donationKfb));
            }
        });
    }
};

/**
 * 领取每日奖励
 */
var getDailyBonus = exports.getDailyBonus = function getDailyBonus() {
    Script.runFunc('Public.getDailyBonus_before_');
    console.log('领取每日奖励Start');
    var $wait = Msg.wait('<strong>正在领取每日奖励，请稍候&hellip;</strong>');

    /**
     * 获取领取每日奖励Cookies有效期
     * @returns {Date} Cookies有效期的Date对象
     */
    var getCookieDate = function getCookieDate() {
        var date = Util.getTimezoneDateByTime(_Const2.default.getDailyBonusAfterTime);
        date.setDate(date.getDate() + 1);
        if (new Date() > date) date.setDate(date.getDate() + 1);
        return date;
    };

    $.ajax({
        type: 'GET',
        url: 'kf_growup.php?t=' + new Date().getTime(),
        timeout: _Const2.default.defAjaxTimeout
    }).done(function (html) {
        var matches = /<a href="(kf_growup\.php\?ok=3&safeid=\w+)" target="_self">你可以领取\s*(\d+)KFB\s*\+\s*(\d+)经验\s*\+\s*(\d+)贡献\s*\+\s*(\d+)转账额度/.exec(html);
        if (matches) {
            var _ret = function () {
                if (Config.getBonusAfterLootCompleteEnabled && !/<div class="gro_divlv">\r\n争夺奖励/.test(html)) {
                    Util.setCookie(_Const2.default.getDailyBonusCookieName, -1, Util.getDate('+' + _Const2.default.getDailyBonusSpecialInterval + 'm'));
                    Msg.remove($wait);
                    return {
                        v: void 0
                    };
                }
                if (Config.getBonusAfterSpeakCompleteEnabled && !/<div class="gro_divlv">\r\n发言奖励/.test(html)) {
                    Util.setCookie(_Const2.default.getDailyBonusCookieName, -1, Util.getDate('+' + _Const2.default.getDailyBonusSpecialInterval + 'm'));
                    Msg.remove($wait);
                    return {
                        v: void 0
                    };
                }
                var url = matches[1];
                var gain = {};
                if (parseInt(matches[2]) > 0) gain['KFB'] = parseInt(matches[2]);
                if (parseInt(matches[3]) > 0) gain['经验值'] = parseInt(matches[3]);
                if (parseInt(matches[4]) > 0) gain['贡献'] = parseInt(matches[4]);
                if (parseInt(matches[5]) > 0) gain['转账额度'] = parseInt(matches[5]);

                $.get(url + '&t=' + new Date().getTime(), function (html) {
                    Util.setCookie(_Const2.default.getDailyBonusCookieName, 1, getCookieDate());
                    showFormatLog('领取每日奖励', html);

                    var _Util$getResponseMsg3 = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg3.msg;

                    Msg.remove($wait);

                    if (/领取成功/.test(msg)) {
                        var logStatText = '',
                            msgStatText = '';
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Util.entries(gain)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _step$value = _slicedToArray(_step.value, 2),
                                    key = _step$value[0],
                                    num = _step$value[1];

                                logStatText += key + '+' + num + ' ';
                                msgStatText += '<i>' + key + '<em>+' + num.toLocaleString() + '</em></i>';
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        console.log('领取每日奖励，' + logStatText);
                        Msg.show('<strong>领取每日奖励</strong>' + msgStatText, -1);
                        if (!$.isEmptyObject(gain)) Log.push('领取每日奖励', '领取每日奖励', { gain: gain });
                    }
                    Script.runFunc('Public.getDailyBonus_after_', msg);
                }).fail(function () {
                    return Msg.remove($wait);
                });
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
var followUsers = exports.followUsers = function followUsers() {
    if (!Config.followUserList.length) return;
    if (_Info2.default.isInHomePage && Config.highlightFollowUserThreadInHPEnabled) {
        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            var $this = $(this);
            var matches = /》by：(.+)/.exec($this.attr('title'));
            if (!matches) return;
            if (Util.inFollowOrBlockUserList(matches[1], Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/thread.php') {
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
                if (Config.highlightFollowUserThreadLinkEnabled) {
                    $this.parent('td').prev('td').prev('td').find('div > a[href^="read.php?tid="]').addClass('pd_highlight');
                }
            }
        });
    } else if (location.pathname === '/read.php') {
        $('.readidmsbottom > a, .readidmleft > a').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child').find('a').addBack().addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/guanjianci.php' || location.pathname === '/kf_share.php') {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    } else if (location.pathname === '/search.php') {
        $('.thread1 a[href^="profile.php?action=show&uid="]').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.followUserList) > -1) {
                $this.addClass('pd_highlight');
            }
        });
    }
};

/**
 * 屏蔽用户
 */
var blockUsers = exports.blockUsers = function blockUsers() {
    if (!Config.blockUserList.length) return;
    var num = 0;
    if (_Info2.default.isInHomePage) {
        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            var $this = $(this);
            var matches = /》by：(.+)/.exec($this.attr('title'));
            if (!matches) return;
            var index = Util.inFollowOrBlockUserList(matches[1], Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                num++;
                $this.parent('li').remove();
            }
        });
    } else if (location.pathname === '/thread.php') {
        var fid = parseInt($('input[name="f_fid"]:first').val());
        if (!fid) return;
        if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(fid)) return;else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(fid)) return;
        $('a.bl[href^="profile.php?action=show&uid="]').each(function () {
            var $this = $(this);
            var index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
            if (index > -1 && Config.blockUserList[index].type < 2) {
                num++;
                $this.closest('tr').remove();
            }
        });
    } else if (location.pathname === '/read.php') {
        var _ret2 = function () {
            if (Config.blockUserForumType > 0) {
                var _fid = parseInt($('input[name="fid"]:first').val());
                if (!_fid) return {
                        v: void 0
                    };
                if (Config.blockUserForumType === 1 && !Config.blockUserFidList.includes(_fid)) return {
                        v: void 0
                    };else if (Config.blockUserForumType === 2 && Config.blockUserFidList.includes(_fid)) return {
                        v: void 0
                    };
            }
            var page = Util.getCurrentThreadPage();
            $('.readidmsbottom > a, .readidmleft > a').each(function (i) {
                var $this = $(this);
                var index = Util.inFollowOrBlockUserList($this.text(), Config.blockUserList);
                if (index > -1) {
                    var type = Config.blockUserList[index].type;
                    if (i === 0 && page === 1 && type > 1) return;else if ((i === 0 && page !== 1 || i > 0) && type === 1) return;
                    num++;
                    var $lou = $this.closest('.readtext');
                    $lou.prev('.readlou').remove().end().next('.readlou').remove().end().remove();
                }
            });
            $('.readtext fieldset:has(legend:contains("Quote:"))').each(function () {
                var $this = $(this);
                var text = $this.text();
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Config.blockUserList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var data = _step2.value;

                        if (data.type === 1) continue;
                        try {
                            var regex1 = new RegExp('^Quote:\u5F15\u7528(\u7B2C\\d+\u697C|\u697C\u4E3B)' + data.name + '\u4E8E', 'i');
                            var regex2 = new RegExp('^Quote:\u56DE\\s*\\d+\u697C\\(' + data.name + '\\)\\s*\u7684\u5E16\u5B50', 'i');
                            if (regex1.test(text) || regex2.test(text)) {
                                $this.html('<legend>Quote:</legend><mark class="pd_custom_tips" title="\u88AB\u5C4F\u853D\u7528\u6237\uFF1A' + data.name + '">\u8BE5\u7528\u6237\u5DF2\u88AB\u5C4F\u853D</mark>');
                            }
                        } catch (ex) {}
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            });
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    } else if (location.pathname === '/guanjianci.php' && Config.blockUserAtTipsEnabled) {
        $('.kf_share1 > tbody > tr > td:last-child').each(function () {
            var $this = $(this);
            if (Util.inFollowOrBlockUserList($this.text(), Config.blockUserList) > -1) {
                num++;
                $this.closest('tr').remove();
            }
        });
    }
    if (num > 0) console.log('\u3010\u5C4F\u853D\u7528\u6237\u3011\u5171\u6709' + num + '\u4E2A\u5E16\u5B50\u6216\u56DE\u590D\u88AB\u5C4F\u853D');
};

/**
 * 屏蔽帖子
 */
var blockThread = exports.blockThread = function blockThread() {
    if (!Config.blockThreadList.length) return;

    /**
     * 是否屏蔽帖子
     * @param {string} title 帖子标题
     * @param {string} userName 用户名
     * @param {number} fid 版块ID
     * @returns {boolean} 是否屏蔽
     */
    var isBlock = function isBlock(title, userName) {
        var fid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Config.blockThreadList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _step3$value = _step3.value,
                    keyWord = _step3$value.keyWord,
                    includeUser = _step3$value.includeUser,
                    excludeUser = _step3$value.excludeUser,
                    includeFid = _step3$value.includeFid,
                    excludeFid = _step3$value.excludeFid;

                var regex = null;
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
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return false;
    };

    var num = 0;
    if (_Info2.default.isInHomePage) {
        $('.b_tit4 a, .b_tit4_1 a').each(function () {
            var $this = $(this);
            var title = $this.attr('title');
            if (!title) return;
            var matches = /^《(.+)》by：(.+)$/.exec(title);
            if (matches) {
                if (isBlock(matches[1], matches[2])) {
                    num++;
                    $this.parent('li').remove();
                }
            }
        });
    } else if (location.pathname === '/thread.php') {
        var _ret3 = function () {
            var fid = parseInt($('input[name="f_fid"]:first').val());
            if (!fid) return {
                    v: void 0
                };
            $('.threadtit1 a[href^="read.php"]').each(function () {
                var $this = $(this);
                if (isBlock($this.text(), $this.closest('tr').find('td:last-child > a.bl').text(), fid)) {
                    num++;
                    $this.closest('tr').remove();
                }
            });
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
    } else if (location.pathname === '/read.php') {
        if (Util.getCurrentThreadPage() !== 1) return;
        var title = Read.getThreadTitle();
        if (!title) return;
        var $userName = $('.readidmsbottom > a, .readidmleft > a').eq(0);
        if ($userName.closest('.readtext').prev('.readlou').find('div:nth-child(2) > span:first-child').text().trim() !== '楼主') return;
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
    if (num > 0) console.log('\u3010\u5C4F\u853D\u5E16\u5B50\u3011\u5171\u6709' + num + '\u4E2A\u5E16\u5B50\u88AB\u5C4F\u853D');
};

/**
 * 将侧边栏修改为和手机相同的平铺样式
 */
var modifySideBar = exports.modifySideBar = function modifySideBar() {
    $('#r_menu').replaceWith('\n<div id="r_menu" style="width: 140px; color: #9999ff; font-size: 14px; line-height: 24px; text-align: center; border: 1px #ddddff solid; padding: 5px; overflow: hidden;">\n  <span style="color: #ff9999;">\u6E38\u620F</span><br>\n  <a href="thread.php?fid=102">\u6E38\u620F\u63A8\u8350</a> | <a href="thread.php?fid=106">\u65B0\u4F5C\u52A8\u6001</a><br>\n  <a href="thread.php?fid=52">\u6E38\u620F\u8BA8\u8BBA</a> | <a href="thread.php?fid=24">\u7591\u96BE\u4E92\u52A9</a><br>\n  <a href="thread.php?fid=16">\u79CD\u5B50\u4E0B\u8F7D</a> | <a href="thread.php?fid=41">\u7F51\u76D8\u4E0B\u8F7D</a><br>\n  <a href="thread.php?fid=67">\u56FE\u7247\u5171\u4EAB</a> | <a href="thread.php?fid=57">\u540C\u4EBA\u6F2B\u672C</a><br>\n  <span style="color: #ff9999;">\u52A8\u6F2B\u97F3\u4E50</span><br>\n  <a href="thread.php?fid=84">\u52A8\u6F2B\u8BA8\u8BBA</a> | <a href="thread.php?fid=92">\u52A8\u753B\u5171\u4EAB</a><br>\n  <a href="thread.php?fid=127">\u6F2B\u753B\u5C0F\u8BF4</a> | <a href="thread.php?fid=68">\u97F3\u4E50\u5171\u4EAB</a><br>\n  <a href="thread.php?fid=163">LIVE\u5171\u4EAB</a>  | <a href="thread.php?fid=182">\u8F6C\u8F7D\u8D44\u6E90</a><br>\n  <span style="color: #ff9999;">\u7EFC\u5408</span><br>\n  <a href="thread.php?fid=94">\u539F\u521B\u7F8E\u56FE</a> | <a href="thread.php?fid=87">\u5B85\u7269\u4EA4\u6D41</a><br>\n  <a href="thread.php?fid=86">\u7535\u5B50\u4EA7\u54C1</a> | <a href="thread.php?fid=115">\u6587\u5B57\u4F5C\u54C1</a><br>\n  <a href="thread.php?fid=96">\u51FA\u5904\u8BA8\u8BBA</a>  | <a href="thread.php?fid=36">\u5BFB\u6C42\u8D44\u6E90</a><br>\n  <span style="color: #ff9999;">\u4EA4\u6D41</span><br>\n  <a href="thread.php?fid=5">\u81EA\u7531\u8BA8\u8BBA</a> | <a href="thread.php?fid=56">\u4E2A\u4EBA\u65E5\u8BB0</a><br>\n  <a href="thread.php?fid=98">\u65E5\u672C\u8BED\u7248</a>  | <a href="thread.php?fid=9">\u6211\u7684\u5173\u6CE8</a><br>\n  <a href="thread.php?fid=4">\u7AD9\u52A1\u7BA1\u7406</a><br>\n  <span style="color: #ff9999;">\u4E13\u7528</span><br>\n  <a href="thread.php?fid=93">\u7BA1\u7406\u7EC4\u533A</a> | <a href="thread.php?fid=59">\u539F\u521B\u7EC4\u533A</a><br>\n  <a href="/">\u8BBA\u575B\u9996\u9875</a><br>\n</div>\n');
};

/**
 * 为侧边栏添加快捷导航的链接
 */
var addFastNavForSideBar = exports.addFastNavForSideBar = function addFastNavForSideBar() {
    var $menu = $('#r_menu');
    if (!$menu.hasClass('r_cmenu')) {
        if (!Config.modifySideBarEnabled) {
            $menu.append('<a href="/">论坛首页</a><br>');
        }
        $menu.find('> a:last').before('\n<span style="color: #ff9999;">\u5FEB\u6377\u5BFC\u822A</span><br>\n<a href="guanjianci.php?gjc=' + _Info2.default.userName + '">@\u63D0\u9192</a> | <a href="personal.php?action=post">\u56DE\u590D</a> | <a href="kf_growup.php">\u7B49\u7EA7</a><br>\n<a href="kf_fw_ig_index.php">\u4E89\u593A</a> | <a href="kf_fw_ig_mybp.php">\u7269\u54C1</a> | <a href="kf_fw_ig_shop.php">\u5546\u5E97</a><br>\n<a href="profile.php?action=modify">\u8BBE\u7F6E</a> | <a href="hack.php?H_name=bank">\u94F6\u884C</a> | <a href="profile.php?action=favor">\u6536\u85CF</a><br>\n' + _Const2.default.customTileSideBarContent + '\n');
    } else {
        $menu.find('> ul > li:last-child').before('\n<li class="r_cmenuho">\n  <a href="javascript:;">\u5FEB\u6377\u5BFC\u822A</a>\n  <ul class="r_cmenu2">\n    <li><a href="guanjianci.php?gjc=' + _Info2.default.userName + '">@\u63D0\u9192</a></li>\n    <li><a href="kf_growup.php">\u7B49\u7EA7\u7ECF\u9A8C</a></li>\n    <li><a href="kf_fw_ig_index.php">\u4E89\u593A\u5956\u52B1</a></li>\n    <li><a href="kf_fw_ig_mybp.php">\u89D2\u8272/\u7269\u54C1</a></li>\n    <li><a href="kf_fw_ig_shop.php">\u7269\u54C1\u5546\u5E97</a></li>\n    <li><a href="profile.php?action=modify">\u8BBE\u7F6E</a></li>\n    <li><a href="hack.php?H_name=bank">\u94F6\u884C</a></li>\n    <li><a href="profile.php?action=favor">\u6536\u85CF</a></li>\n    <li><a href="personal.php?action=post">\u6211\u7684\u56DE\u590D</a></li>\n    ' + _Const2.default.customSideBarContent + '\n  </ul>\n</li>\n');
    }
};

/**
 * 自动活期存款
 * @param {boolean} isRead 是否读取个人信息页面以获得当前所持有KFB的信息
 */
var autoSaveCurrentDeposit = exports.autoSaveCurrentDeposit = function autoSaveCurrentDeposit() {
    var isRead = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!(Config.saveCurrentDepositAfterKfb > 0 && Config.saveCurrentDepositKfb > 0 && Config.saveCurrentDepositKfb <= Config.saveCurrentDepositAfterKfb)) {
        return;
    }
    var $kfb = $('a[href="kf_givemekfb.php"]');

    /**
     * 活期存款
     * @param {number} cash 当前持有的KFB
     */
    var saveCurrentDeposit = function saveCurrentDeposit(cash) {
        if (cash < Config.saveCurrentDepositAfterKfb) return;
        var multiple = Math.floor((cash - Config.saveCurrentDepositAfterKfb) / Config.saveCurrentDepositKfb);
        if (cash - Config.saveCurrentDepositKfb * multiple >= Config.saveCurrentDepositAfterKfb) multiple++;
        var money = Config.saveCurrentDepositKfb * multiple;
        if (money <= 0 || money > cash) return;
        console.log('自动活期存款Start');
        $.post('hack.php?H_name=bank', { action: 'save', btype: 1, savemoney: money }, function (html) {
            showFormatLog('自动存款', html);

            var _Util$getResponseMsg4 = Util.getResponseMsg(html),
                msg = _Util$getResponseMsg4.msg;

            if (/完成存款/.test(msg)) {
                Log.push('自动存款', '\u5171\u6709`' + money + '`KFB\u5DF2\u81EA\u52A8\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E');
                console.log('\u5171\u6709' + money + 'KFB\u5DF2\u81EA\u52A8\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E');
                Msg.show('\u5171\u6709<em>' + money.toLocaleString() + '</em>KFB\u5DF2\u81EA\u52A8\u5B58\u5165\u6D3B\u671F\u5B58\u6B3E');
            }
        });
    };

    if (isRead) {
        console.log('获取当前持有KFB Start');
        $.get('profile.php?action=show&uid=' + _Info2.default.uid + '&t=' + new Date().getTime(), function (html) {
            var matches = /论坛货币：(\d+)\s*KFB/.exec(html);
            if (matches) saveCurrentDeposit(parseInt(matches[1]));
        });
    } else {
        var kfb = parseInt($kfb.data('kfb'));
        if (kfb) saveCurrentDeposit(kfb);
    }
};

/**
 * 更换ID颜色
 */
var changeIdColor = exports.changeIdColor = function changeIdColor() {
    if (!Config.changeAllAvailableIdColorEnabled && Config.customAutoChangeIdColorList.length <= 1) return;

    /**
     * 写入Cookie
     */
    var setCookie = function setCookie() {
        var nextTime = Util.getDate('+' + Config.autoChangeIdColorInterval + 'h');
        Util.setCookie(_Const2.default.autoChangeIdColorCookieName, nextTime.getTime(), nextTime);
    };

    console.log('自动更换ID颜色Start');
    $.get('kf_growup.php?t=' + new Date().getTime(), function (html) {
        if (Util.getCookie(_Const2.default.autoChangeIdColorCookieName)) return;
        var matches = html.match(/href="kf_growup\.php\?ok=2&safeid=\w+&color=\d+"/g);
        if (matches) {
            var _ret4 = function () {
                var safeId = '';
                var safeIdMatches = /safeid=(\w+)&/i.exec(matches[0]);
                if (safeIdMatches) safeId = safeIdMatches[1];
                if (!safeId) {
                    setCookie();
                    return {
                        v: void 0
                    };
                }

                var availableIdList = [];
                for (var i in matches) {
                    var idMatches = /color=(\d+)/i.exec(matches[i]);
                    if (idMatches) availableIdList.push(parseInt(idMatches[1]));
                }

                var idList = availableIdList;
                if (!Config.changeAllAvailableIdColorEnabled) {
                    idList = [];
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = Config.customAutoChangeIdColorList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var id = _step4.value;

                            if (availableIdList.includes(id)) idList.push(id);
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }
                if (idList.length <= 1) {
                    setCookie();
                    return {
                        v: void 0
                    };
                }

                var prevId = parseInt(TmpLog.getValue(_Const2.default.prevAutoChangeIdColorTmpLogName));
                if (isNaN(prevId) || prevId < 0) prevId = 0;

                var nextId = 0;
                if (Config.autoChangeIdColorType.toLowerCase() === 'sequence') {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = idList.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _step5$value = _slicedToArray(_step5.value, 2),
                                _i = _step5$value[0],
                                _id = _step5$value[1];

                            if (_id > prevId) {
                                nextId = _id;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    if (nextId === 0) nextId = idList[0];
                } else {
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = idList.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var _step6$value = _slicedToArray(_step6.value, 2),
                                _i2 = _step6$value[0],
                                _id2 = _step6$value[1];

                            if (_id2 === prevId) {
                                idList.splice(_i2, 1);
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }

                    nextId = idList[Math.floor(Math.random() * idList.length)];
                }

                $.get('kf_growup.php?ok=2&safeid=' + safeId + '&color=' + nextId + '&t=' + new Date().getTime(), function (html) {
                    setCookie();
                    showFormatLog('自动更换ID颜色', html);

                    var _Util$getResponseMsg5 = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg5.msg;

                    if (/等级颜色修改完毕/.test(msg)) {
                        console.log('ID颜色更换为：' + nextId);
                        TmpLog.setValue(_Const2.default.prevAutoChangeIdColorTmpLogName, nextId);
                    }
                });
            }();

            if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
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
var showElementTitleTips = exports.showElementTitleTips = function showElementTitleTips(e, title) {
    $('.pd_title_tips').remove();
    if (!title || !e.originalEvent) return;
    $('<div class="pd_title_tips">' + title.replace(/\n/g, '<br>') + '</div>').appendTo('body').css('left', e.originalEvent.pageX - 20).css('top', e.originalEvent.pageY + 15);
};

/**
 * 绑定包含title属性元素的点击事件（用于移动版浏览器）
 */
var bindElementTitleClick = exports.bindElementTitleClick = function bindElementTitleClick() {
    var excludeNodeNameList = ['A', 'IMG', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'];
    $(document).click(function (e) {
        var target = e.target;
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
var bindSearchTypeSelectMenuClick = exports.bindSearchTypeSelectMenuClick = function bindSearchTypeSelectMenuClick() {
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
            var type = $this.text().trim();
            var $form = $menu.closest('form');
            var $keyWord = $form.find('input[name="keyword"], input[name="pwuser"]');
            $menu.find('span').text(type);
            if (type !== '关键词' && type !== '用户名') $form.attr('action', 'search.php?');
            if (type === '作者') $keyWord.attr('name', 'pwuser');else $keyWord.attr('name', 'keyword');
            var $searchRange = $form.find('[name="searchRange"][value="current"]');
            if ($searchRange.length > 0) {
                $searchRange.prop('disabled', type === '关键词' || type === '用户名' || !$searchRange.data('enabled'));
            }
            $searchTypeList.remove();
            $keyWord.focus();
        });
    });

    $(document).on('submit', 'form[name="pdSearchForm"]', function () {
        var $this = $(this);
        var type = $.trim($this.find('.pd_search_type > span').text());
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
var makeSearchByBelowTwoKeyWordAvailable = exports.makeSearchByBelowTwoKeyWordAvailable = function makeSearchByBelowTwoKeyWordAvailable() {
    $(document).on('submit', 'form[action="search.php?"]', function () {
        var $this = $(this);
        var $keyWord = $this.find('input[name="keyword"]');
        var $method = $this.find('input[name="method"]');
        if (!$keyWord.length || !$method.length) return;
        var keyWord = $.trim($keyWord.val());
        if (!keyWord || Util.getStrByteLen(keyWord) > 2) return;
        $keyWord.val(keyWord + ' ' + Math.floor(new Date().getTime() / 1000));
        $method.val('OR');
        setTimeout(function () {
            $keyWord.val(keyWord);
            $method.val('AND');
        }, 200);
    });
};

/**
 * 添加搜索对话框链接
 */
var addSearchDialogLink = exports.addSearchDialogLink = function addSearchDialogLink() {
    $('<span> | </span><a href="#">搜索</a>').insertAfter('.topright > a[href="message.php"]').filter('a').click(function (e) {
        e.preventDefault();
        var dialogName = 'pdSearchDialog';
        if ($('#' + dialogName).length > 0) return;
        var html = '\n<div class="pd_cfg_main">\n  <input name="step" value="2" type="hidden">\n  <input name="method" value="AND" type="hidden">\n  <input name="sch_area" value="0" type="hidden">\n  <input name="s_type" value="forum" type="hidden">\n  <input name="f_fid" value="all" type="hidden">\n  <input name="orderway" value="lastpost" type="hidden">\n  <input name="asc" value="DESC" type="hidden">\n  <div style="margin-top: 15px;">\n    <input class="pd_input" name="keyword" type="search" style="float: left; width: 175px; line-height: 26px;" placeholder="\u5173\u952E\u5B57">\n    <div class="pd_search_type" data-type="dialog"><span>\u6807\u9898</span><i>\u2228</i></div>\n    <button class="indloginm" name="submit" type="submit">\u641C\u7D22</button>\n  </div>\n  <div style="margin-bottom: 8px; line-height: 35px;">\n    <label><input name="searchRange" type="radio" value="all" checked> \u5168\u7AD9 </label>\n    <label><input name="searchRange" type="radio" value="current" disabled> \u672C\u7248</label>\n  </div>\n</div>';
        var $dialog = Dialog.create(dialogName, '搜索', html);

        $dialog.closest('form').attr({
            'name': 'pdSearchForm',
            'action': 'search.php?',
            'method': 'post',
            'target': '_blank'
        }).off('submit');

        var fid = parseInt($('input[name="f_fid"]:first, input[name="fid"]:first').val());
        if (fid) {
            $dialog.find('[name="searchRange"]').click(function () {
                var $this = $(this);
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
var repairBbsErrorCode = exports.repairBbsErrorCode = function repairBbsErrorCode() {
    _Info2.default.w.is_ie = false;
    if (location.pathname === '/read.php') _Info2.default.w.strlen = Util.getStrByteLen;
};

/**
 * 通过左右键进行翻页
 */
var turnPageViaKeyboard = exports.turnPageViaKeyboard = function turnPageViaKeyboard() {
    $(document).keydown(function (e) {
        if (e.keyCode !== 37 && e.keyCode !== 39) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        var $page = $('.pages:first');
        var $curPage = $page.find('li > a[href="javascript:;"]');
        if (!$curPage.length) return;
        var curPage = Util.getCurrentThreadPage();
        var url = '';
        if (e.keyCode === 37) {
            if (curPage <= 1) return;
            url = $page.find('li > a:contains("上一页")').attr('href');
        } else {
            var matches = /&page=(\d+)/.exec($page.find('li:last-child > a').attr('href'));
            if (!matches) return;
            if (curPage >= parseInt(matches[1])) return;
            url = $page.find('li > a:contains("下一页")').attr('href');
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
var checkRatingSize = exports.checkRatingSize = function checkRatingSize(title, ratingSize) {
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
        return { type: -1 };
    } else if (titleSize > ratingSize * (100 + _Const2.default.ratingErrorSizePercent) / 100 + 1 || titleSize < ratingSize * (100 - _Const2.default.ratingErrorSizePercent) / 100 - 1) {
        return { type: 1, titleSize: titleSize, ratingSize: ratingSize };
    } else return { type: 0 };
};

/**
 * 显示通用的导入/导出设置对话框
 * @param {string} title 对话框标题
 * @param {string} configName 设置名称
 * @param {?function} [callback] 回调方法
 * @param {?function} [callbackAfterSubmit] 在提交之后的回调方法
 */
var showCommonImportOrExportConfigDialog = exports.showCommonImportOrExportConfigDialog = function showCommonImportOrExportConfigDialog(title, configName, callback, callbackAfterSubmit) {
    var dialogName = 'pdCommonImOrExConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    var html = '\n<div class="pd_cfg_main">\n  <div>\n    <strong>\u5BFC\u5165\u8BBE\u7F6E\uFF1A</strong>\u5C06\u8BBE\u7F6E\u5185\u5BB9\u7C98\u8D34\u5230\u6587\u672C\u6846\u4E2D\u5E76\u70B9\u51FB\u4FDD\u5B58\u6309\u94AE\u5373\u53EF<br>\n    <strong>\u5BFC\u51FA\u8BBE\u7F6E\uFF1A</strong>\u590D\u5236\u6587\u672C\u6846\u91CC\u7684\u5185\u5BB9\u5E76\u7C98\u8D34\u5230\u522B\u5904\u5373\u53EF\n  </div>\n  <textarea name="commonConfig" style="width: 500px; height: 300px; word-break: break-all;"></textarea>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about"></span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '\u5BFC\u5165\u6216\u5BFC\u51FA' + title, html);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        var options = $.trim($dialog.find('[name="commonConfig"]').val());
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

},{"./Config":4,"./ConfigDialog":5,"./Const":6,"./Dialog":7,"./Info":9,"./Log":11,"./LogDialog":12,"./Loot":13,"./Msg":15,"./Read":19,"./Script":20,"./TmpLog":21,"./Util":22}],19:[function(require,module,exports){
/* 帖子模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getThreadTitle = exports.showAttachImageOutsideSellBox = exports.parseMediaTag = exports.addMoreSmileLink = exports.addCopyCodeLink = exports.addUserMemo = exports.modifyKFOtherDomainLink = exports.addMultiQuoteButton = exports.getMultiQuoteData = exports.handleBuyThreadBtn = exports.buyThreads = exports.showStatFloorDialog = exports.addStatAndBuyThreadBtn = exports.addCopyBuyersListOption = exports.adjustThreadContentFontSize = exports.adjustThreadContentWidth = exports.modifySmColor = exports.modifyMySmColor = exports.modifyFloorSmColor = exports.fastGotoFloor = exports.addFastGotoFloorInput = exports.addFloorGotoLink = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 为帖子里的每个楼层添加跳转链接
 */
var addFloorGotoLink = exports.addFloorGotoLink = function addFloorGotoLink() {
    $('.readlou > div:nth-child(2) > span').each(function () {
        var $this = $(this);
        var floorText = $this.text();
        if (!/^\d+楼$/.test(floorText)) return;
        var linkName = $this.closest('.readlou').prev().attr('name');
        if (!linkName || !/^\d+$/.test(linkName)) return;
        var url = Util.getHostNameUrl() + 'read.php?tid=' + Util.getUrlParam('tid') + '&spid=' + linkName;
        $this.html('<a class="pd_goto_link" href="' + url + '" title="\u590D\u5236\u697C\u5C42\u94FE\u63A5">' + floorText + '</a>');
        $this.find('a').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var url = $this.attr('href');
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
var addFastGotoFloorInput = exports.addFastGotoFloorInput = function addFastGotoFloorInput() {
    $('\n<form>\n<li class="pd_fast_goto_floor">\n  \u7535\u68AF\u76F4\u8FBE <input class="pd_input" style="width: 30px;" type="text" maxlength="8">\n  <span data-name="submit" style="cursor: pointer;">\u697C</span>\n</li>\n</form>\n').prependTo($('.readtext:first').prev('.readlou').find('> div:first-child > ul')).submit(function (e) {
        e.preventDefault();
        var floor = parseInt($(this).find('input').val());
        if (!floor || floor < 0) return;
        location.href = 'read.php?tid=' + Util.getUrlParam('tid') + '&page=' + (parseInt(floor / Config.perPageFloorNum) + 1) + '&floor=' + floor;
    }).find('[data-name="submit"]').click(function () {
        $(this).closest('form').submit();
    }).end().closest('div').next().css({ 'max-width': '505px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' });
};

/**
 * 将页面滚动到指定楼层
 */
var fastGotoFloor = exports.fastGotoFloor = function fastGotoFloor() {
    var floor = parseInt(Util.getUrlParam('floor'));
    if (!floor || floor < 0) return;
    var $floorNode = $('.readlou > div:nth-child(2) > span:contains("' + floor + '\u697C")');
    if (!$floorNode.length) return;
    var linkName = $floorNode.closest('.readlou').prev().attr('name');
    if (!linkName || !/^\d+$/.test(linkName)) return;
    location.hash = '#' + linkName;
};

/**
 * 修改指定楼层的神秘颜色
 * @param {jQuery} $elem 指定楼层的发帖者的用户名链接的jQuery对象
 * @param {string} color 神秘颜色
 */
var modifyFloorSmColor = exports.modifyFloorSmColor = function modifyFloorSmColor($elem, color) {
    if ($elem.is('.readidmsbottom > a')) $elem.css('color', color);
    $elem.closest('.readtext').css('border-color', color).prev('.readlou').css('border-color', color).next().next('.readlou').css('border-color', color);
};

/**
 * 修改本人的神秘颜色
 */
var modifyMySmColor = exports.modifyMySmColor = function modifyMySmColor() {
    var $my = $('.readidmsbottom > a[href="profile.php?action=show&uid=' + _Info2.default.uid + '"]');
    if (!$my.length) $my = $('.readidmleft > a[href="profile.php?action=show&uid=' + _Info2.default.uid + '"]');
    if ($my.length > 0) modifyFloorSmColor($my, Config.customMySmColor);
};

/**
 * 修改各等级神秘颜色
 */
var modifySmColor = exports.modifySmColor = function modifySmColor() {
    if (!Config.customSmColorConfigList.length) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        var $this = $(this);
        var smLevel = '';
        if ($this.is('.readidmleft > a')) {
            smLevel = $this.parent().next('.readidmright').text().toUpperCase();
            if (!/(-?\d+|MAX)/i.test(smLevel)) return;
        } else {
            var matches = /(-?\d+|MAX)级神秘/i.exec($this.parent().contents().last().text());
            if (!matches) return;
            smLevel = matches[1].toUpperCase();
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Config.customSmColorConfigList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _step.value,
                    min = _step$value.min,
                    max = _step$value.max,
                    color = _step$value.color;

                if (Util.compareSmLevel(smLevel, min) >= 0 && Util.compareSmLevel(smLevel, max) <= 0) {
                    modifyFloorSmColor($this, color);
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });
};

/**
 * 调整帖子内容宽度，使其保持一致
 */
var adjustThreadContentWidth = exports.adjustThreadContentWidth = function adjustThreadContentWidth() {
    $('head').append('\n<style>\n  .readtext > table > tbody > tr > td { padding-left: 192px; }\n  .readidms, .readidm { margin-left: -192px !important; }\n</style>\n');
};

/**
 * 调整帖子内容字体大小
 */
var adjustThreadContentFontSize = exports.adjustThreadContentFontSize = function adjustThreadContentFontSize() {
    if (Config.threadContentFontSize > 0 && Config.threadContentFontSize !== 12) {
        $('head').append('\n<style>\n  .readtext td { font-size: ' + Config.threadContentFontSize + 'px; line-height: 1.6em; }\n  .readtext td > div, .readtext td > .read_fds { font-size: 12px; }\n</style>\n');
    }
};

/**
 * 添加复制购买人名单的选项
 */
var addCopyBuyersListOption = exports.addCopyBuyersListOption = function addCopyBuyersListOption() {
    $('.readtext select[name="buyers"]').each(function () {
        $(this).find('option:first-child').after('<option value="copyList">复制名单</option>');
    });
    $(document).on('change', 'select[name="buyers"]', function () {
        var $this = $(this);
        if ($this.val() !== 'copyList') return;
        var buyerList = $this.find('option').map(function (index) {
            var name = $(this).text();
            if (index === 0 || index === 1 || name.includes('-'.repeat(11))) return null;else return name;
        }).get().join('\n');
        $this.get(0).selectedIndex = 0;
        if (!buyerList) {
            alert('暂时无人购买');
            return;
        }

        var dialogName = 'pdCopyBuyerListDialog';
        if ($('#' + dialogName).length > 0) return;
        var html = '\n<div class="pd_cfg_main">\n  <textarea name="buyerList" style="width: 200px; height: 300px; margin: 5px 0;" readonly>' + buyerList + '</textarea>\n</div>';
        var $dialog = Dialog.create(dialogName, '购买人名单', html);
        Dialog.show(dialogName);
        $dialog.find('[name="buyerList"]').select().focus();
    });
};

/**
 * 添加统计和购买帖子的按钮
 */
var addStatAndBuyThreadBtn = exports.addStatAndBuyThreadBtn = function addStatAndBuyThreadBtn() {
    $('<span style="margin: 0 5px;">|</span><a data-name="statAndBuyThread" title="统计回帖者名单以及批量购买帖子" href="#">统计和购买</a>').insertAfter('td > a[href^="kf_tidfavor.php?action=favor&tid="]').filter('[data-name="statAndBuyThread"]').click(function (e) {
        e.preventDefault();
        if ($('#pdStatFloorDialog').length > 0) return;

        var tid = parseInt(Util.getUrlParam('tid'));
        if (!tid) return;
        var value = $.trim(prompt('统计到第几楼？（0表示统计所有楼层，可用m-n的方式来设定统计楼层的区间范围）', 0));
        if (value === '') return;
        if (!/^\d+(-\d+)?$/.test(value)) {
            alert('统计楼层格式不正确');
            return;
        }
        var startFloor = 0,
            endFloor = 0;
        var valueArr = value.split('-');
        if (valueArr.length === 2) {
            startFloor = parseInt(valueArr[0]);
            endFloor = parseInt(valueArr[1]);
        } else endFloor = parseInt(valueArr[0]);
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
        if (endPage - startPage > _Const2.default.statFloorMaxPage) {
            alert('需访问的总页数不可超过' + _Const2.default.statFloorMaxPage);
            return;
        }

        Msg.destroy();
        Msg.wait('<strong>\u6B63\u5728\u7EDF\u8BA1\u697C\u5C42\u4E2D&hellip;</strong><i>\u5269\u4F59\u9875\u6570\uFF1A<em class="pd_countdown">' + (endPage - startPage + 1) + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
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
var statFloor = function statFloor(tid, startPage, endPage, startFloor, endFloor) {
    var isStop = false;
    var floorList = [];

    /**
     * 统计
     * @param {number} page 第几页
     */
    var stat = function stat(page) {
        $.ajax({
            type: 'GET',
            url: 'read.php?tid=' + tid + '&page=' + page + '&t=' + new Date().getTime(),
            timeout: _Const2.default.defAjaxTimeout,
            success: function success(html) {
                $('.readtext', html).each(function () {
                    var data = {};
                    var $floor = $(this);
                    var $floorHeader = $floor.prev('.readlou');
                    var floor = parseInt($floor.prev('.readlou').find('> div:nth-child(2) > span:first-child').text());
                    if (!floor) return;
                    if (floor < startFloor) return;
                    if (floor > endFloor) {
                        isStop = true;
                        return false;
                    }
                    data.pid = parseInt($floorHeader.prev('a').attr('name'));
                    var $user = $floor.find('.readidms, .readidm');
                    data.userName = $user.find('a[href^="profile.php?action=show&uid="]').text();
                    data.smLevel = '';
                    if ($user.hasClass('readidms')) {
                        var matches = /(\S+)级神秘/.exec($user.find('.readidmsbottom').text());
                        if (matches) data.smLevel = matches[1];
                    } else {
                        data.smLevel = $user.find('.readidmright').text().trim();
                    }

                    var $buy = $floor.find('[value="愿意购买,支付KFB"]:first');
                    if ($buy.length > 0) {
                        var _matches = /此帖售价\s*(\d+)\s*KFB/.exec($buy.parent('legend').text());
                        if (_matches) data.sell = parseInt(_matches[1]);
                        _matches = /location\.href="(.+)"/i.exec($buy.attr('onclick'));
                        if (_matches) data.buyUrl = _matches[1];
                    }
                    floorList[floor] = data;
                });

                var $countdown = $('.pd_countdown:last');
                $countdown.text(parseInt($countdown.text()) - 1);
                isStop = isStop || $countdown.closest('.pd_msg').data('stop');
            },
            error: function error() {
                setTimeout(function () {
                    return stat(page);
                }, _Const2.default.defAjaxInterval);
            },
            complete: function complete() {
                if (isStop || page >= endPage) {
                    Msg.destroy();
                    showStatFloorDialog(floorList);
                } else {
                    setTimeout(function () {
                        return stat(page + 1);
                    }, _Const2.default.defAjaxInterval);
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
var showStatFloorDialog = exports.showStatFloorDialog = function showStatFloorDialog(floorList) {
    var dialogName = 'pdStatFloorDialog';
    var html = '\n<div class="pd_cfg_main">\n  <div id="pdStatFloorFilter" style="margin-top: 5px;">\n    <label><input name="removeRepeatedEnabled" type="checkbox"> \u53BB\u9664\u91CD\u590D</label>\n    <label><input name="removeTopFloorEnabled" type="checkbox"> \u53BB\u9664\u697C\u4E3B</label>\n  </div>\n  <div id="pdStatFloorSelectBtns">\n    <label style="margin-left: 3px;">\u552E\u4EF7\u533A\u95F4\uFF1A</label>\n    <input name="startSell" type="number" value="1" min="1" max="100" style="width: 45px;"> -\n    <input name="endSell" type="number" value="100" min="1" max="100" style="width: 45px;">\n    <label style="margin-left: 3px;">\n    \u6BCF\u540D\u7528\u6237\u9650\u9009 <input name="limitNum" type="number" min="0" style="width: 35px;"> \u4E2A\n    </label>\n    <a class="pd_btn_link" data-name="selectFilter" href="#">\u7B5B\u9009</a><br>\n    <a class="pd_btn_link" data-name="selectAll" href="#">\u5168\u9009</a>\n    <a class="pd_btn_link" data-name="selectInverse" href="#">\u53CD\u9009</a>\n  </div>\n  <div class="pd_highlight" style="text-align: center;">\n    \u5171\u663E\u793A<b id="pdStatFloorShowCount">0</b>\u6761\u9879\u76EE\uFF0C\u5171\u9009\u62E9<b id="pdStatFloorSelectCount">0</b>\u6761\u9879\u76EE\n  </div>\n  <table style="line-height: 1.8em; text-align: center;">\n    <thead>\n      <tr>\n        <th style="width: 30px;"></th>\n        <th style="width: 70px;">\u697C\u5C42\u53F7</th>\n        <th style="width: 120px;">\u7528\u6237\u540D</th>\n        <th style="width: 80px;">\u795E\u79D8\u7B49\u7EA7</th>\n        <th style="width: 90px;">\u552E\u4EF7(KFB) <span class="pd_cfg_tips" title="\u6CE8\uFF1A\u552E\u4EF7\u4FE1\u606F\u5728\u7EDF\u8BA1\u540E\u53EF\u80FD\u4F1A\u53D1\u751F\u53D8\u5316\uFF0C\u5EFA\u8BAE\u5C3D\u5FEB\u8D2D\u4E70\u5E16\u5B50">[?]</span></th>\n      </tr>\n    </thead>\n    <tbody id="pdStatFloorList"></tbody>\n  </table>\n  <textarea name="statFloorListContent" style="margin-top: 8px; width: 250px; height: 300px;" hidden></textarea>\n</div>\n\n<div class="pd_cfg_btns">\n  <button name="copyList" type="button" style="color: #00f;" title="\u590D\u5236\u6240\u6709\u6216\u6240\u9009\u697C\u5C42\u7684\u7528\u6237\u540D\u5355">\u590D\u5236\u540D\u5355</button>\n  <button name="buyThread" type="button" style="color: #f00;" title="\u6279\u91CF\u8D2D\u4E70\u6240\u9009\u697C\u5C42\u7684\u5E16\u5B50">\u8D2D\u4E70\u5E16\u5B50</button>\n  <button data-action="close" type="button">\u5173\u95ED</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '统计楼层', html);
    var $statFloorFilter = $dialog.find('#pdStatFloorFilter');
    var $statFloorList = $dialog.find('#pdStatFloorList');
    var $statFloorListContent = $dialog.find('[name="statFloorListContent"]');
    var tid = Util.getUrlParam('tid');

    /**
     * 显示统计楼层列表
     */
    var showStatFloorList = function showStatFloorList() {
        var list = [].concat(_toConsumableArray(floorList));
        var isRemoveRepeated = $statFloorFilter.find('[name="removeRepeatedEnabled"]').prop('checked'),
            isRemoveTopFloor = $statFloorFilter.find('[name="removeTopFloorEnabled"]').prop('checked');
        if (isRemoveRepeated) {
            list = list.map(function (data, index, list) {
                if (!data) return null;else return list.findIndex(function (data2) {
                    return data2 && data2.userName === data.userName;
                }) === index ? data : null;
            });
        }
        if (isRemoveTopFloor) {
            var $topFloor = $('.readtext:first');
            if ($topFloor.prev('.readlou').prev('a').attr('name') === 'tpc') {
                (function () {
                    var topFloorUserName = $topFloor.find('.readidmsbottom, .readidmleft').find('a[href^="profile.php?action=show&uid="]').text();
                    list = list.map(function (data) {
                        return data && data.userName !== topFloorUserName ? data : null;
                    });
                })();
            }
        }
        var content = '',
            copyContent = '';
        var num = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = list.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    floor = _step2$value[0],
                    data = _step2$value[1];

                if (!data) continue;
                content += '\n<tr>\n  <td>\n    <label>\n      <input data-sell="' + (data.sell ? data.sell : 0) + '" data-url="' + (data.buyUrl ? data.buyUrl : '') + '" type="checkbox" value="' + data.userName + '">\n    </label>\n  </td>\n  <td><a href="read.php?tid=' + tid + '&spid=' + data.pid + '" target="_blank">' + floor + '\u697C</a></td>\n  <td><a href="profile.php?action=show&username=' + data.userName + '" target="_blank" style="color: #000;">' + data.userName + '</a></td>\n  <td style="color: #f39;">' + data.smLevel + '</td>\n  <td class="pd_stat">' + (data.sell ? '<em>' + data.sell + '</em>' : '<span class="pd_notice">无</span>') + '</td>\n</tr>';
                copyContent += data.userName + '\n';
                num++;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        $statFloorList.html(content);
        $statFloorListContent.val(copyContent).data('copy-text', copyContent);
        $dialog.find('#pdStatFloorShowCount').text(num);
        $dialog.find('#pdStatFloorSelectCount').text(0);
    };

    $dialog.find('#pdStatFloorSelectBtns').on('click', '[data-name]', function (e) {
        e.preventDefault();
        var name = $(this).data('name');
        if (name === 'selectAll') Util.selectAll($statFloorList.find('[type="checkbox"]'));else if (name === 'selectInverse') Util.selectInverse($statFloorList.find('[type="checkbox"]'));else if (name === 'selectFilter') {
            var _ret2 = function () {
                var startSell = parseInt($dialog.find('[name="startSell"]').val());
                var endSell = parseInt($dialog.find('[name="endSell"]').val());
                var limitNum = parseInt($dialog.find('[name="limitNum"]').val());
                if (!limitNum || limitNum < 0) limitNum = 0;
                if (!startSell || startSell < 1 || !endSell || endSell < 1) return {
                        v: void 0
                    };
                var userStat = {};
                $statFloorList.find('[type="checkbox"]').each(function () {
                    var $this = $(this);
                    var sell = parseInt($this.data('sell'));
                    var isChecked = sell > 0 && sell >= startSell && sell <= endSell;
                    if (isChecked && limitNum > 0) {
                        var userName = $this.val();
                        if (!(userName in userStat)) userStat[userName] = 0;
                        userStat[userName]++;
                        if (userStat[userName] > limitNum) isChecked = false;
                    }
                    $this.prop('checked', isChecked);
                });
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
        }
        $dialog.find('#pdStatFloorSelectCount').text($statFloorList.find('[type="checkbox"]:checked').length);
    }).end().find('[name="copyList"]').click(function () {
        var $this = $(this);
        if ($this.text() === '取消复制') {
            $this.text('复制名单');
            $statFloorListContent.prop('hidden', true);
            $statFloorList.closest('table').prop('hidden', false);
            Dialog.resize(dialogName);
            return;
        }
        var type = 'all';
        var checked = $statFloorList.find('[type="checkbox"]:checked');
        if (checked.length > 0) {
            type = 'select';
            var copyContent = '';
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
        var threadList = [];
        var totalSell = 0;
        $statFloorList.find('[type="checkbox"]:checked').each(function () {
            var $this = $(this);
            var url = $this.data('url');
            var sell = parseInt($this.data('sell'));
            if (url && sell > 0) {
                threadList.push({ url: url, sell: sell });
                totalSell += sell;
            }
        });
        if (!threadList.length) {
            alert('请选择要购买的楼层');
            return;
        }
        if (!confirm('\u4F60\u5171\u9009\u62E9\u4E86' + threadList.length + '\u4E2A\u697C\u5C42\uFF0C\u603B\u552E\u4EF7' + totalSell.toLocaleString() + 'KFB\uFF0C' + ('\u5747\u4EF7' + Util.getFixedNumLocStr(totalSell / threadList.length, 2) + 'KFB\uFF0C\u662F\u5426\u6279\u91CF\u8D2D\u4E70\uFF1F'))) return;
        Msg.destroy();
        Msg.wait('<strong>\u6B63\u5728\u8D2D\u4E70\u5E16\u5B50\u4E2D&hellip;</strong><i>\u5269\u4F59\uFF1A<em class="pd_countdown">' + threadList.length + '</em></i>' + '<a class="pd_stop_action" href="#">\u505C\u6B62\u64CD\u4F5C</a>');
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
var buyThreads = exports.buyThreads = function buyThreads(threadList) {
    var successNum = 0,
        failNum = 0,
        totalSell = 0;
    $(document).clearQueue('BuyThread');
    $.each(threadList, function (index, _ref) {
        var url = _ref.url,
            sell = _ref.sell;

        $(document).queue('BuyThread', function () {
            $.ajax({
                type: 'GET',
                url: url + '&t=' + new Date().getTime(),
                timeout: _Const2.default.defAjaxTimeout,
                success: function success(html) {
                    Public.showFormatLog('购买帖子', html);

                    var _Util$getResponseMsg = Util.getResponseMsg(html),
                        msg = _Util$getResponseMsg.msg;

                    if (/操作完成/.test(msg)) {
                        successNum++;
                        totalSell += sell;
                    } else failNum++;
                },
                error: function error() {
                    failNum++;
                },
                complete: function complete() {
                    var $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    var isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('BuyThread');

                    if (isStop || index === threadList.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) {
                            Log.push('购买帖子', '\u5171\u6709`' + successNum + '`\u4E2A\u5E16\u5B50\u8D2D\u4E70\u6210\u529F', { pay: { 'KFB': -totalSell } });
                        }
                        console.log('\u5171\u6709' + successNum + '\u4E2A\u5E16\u5B50\u8D2D\u4E70\u6210\u529F\uFF0C\u5171\u6709' + failNum + '\u4E2A\u5E16\u5B50\u8D2D\u4E70\u5931\u8D25\uFF0CKFB-' + totalSell);
                        Msg.show('<strong>\u5171\u6709<em>' + successNum + '</em>\u4E2A\u5E16\u5B50\u8D2D\u4E70\u6210\u529F' + (failNum > 0 ? '\uFF0C\u5171\u6709<em>' + failNum + '</em>\u4E2A\u5E16\u5B50\u8D2D\u4E70\u5931\u8D25' : '') + '</strong>' + ('<i>KFB<ins>-' + totalSell + '</ins></i>'), -1);
                        Script.runFunc('Read.buyThreads_after_', threadList);
                    } else {
                        setTimeout(function () {
                            return $(document).dequeue('BuyThread');
                        }, _Const2.default.defAjaxInterval);
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
var handleBuyThreadBtn = exports.handleBuyThreadBtn = function handleBuyThreadBtn() {
    $('.readtext input[type="button"][value="愿意购买,支付KFB"]').each(function () {
        var $this = $(this);
        var matches = /此帖售价\s*(\d+)\s*KFB/.exec($this.closest('legend').contents().eq(0).text());
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
            if (sell >= _Const2.default.minBuyThreadWarningSell && !confirm('\u6B64\u8D34\u552E\u4EF7' + sell + 'KFB\uFF0C\u662F\u5426\u8D2D\u4E70\uFF1F')) return;
            if (Config.buyThreadViaAjaxEnabled) {
                (function () {
                    var $wait = Msg.wait('正在购买帖子&hellip;');
                    $.get(url + '&t=' + new Date().getTime(), function (html) {
                        Public.showFormatLog('购买帖子', html);

                        var _Util$getResponseMsg2 = Util.getResponseMsg(html),
                            msg = _Util$getResponseMsg2.msg;

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
                })();
            } else location.href = url;
        });
    });
};

/**
 * 获取多重引用数据
 * @returns {Object[]} 多重引用数据列表
 */
var getMultiQuoteData = exports.getMultiQuoteData = function getMultiQuoteData() {
    var quoteList = [];
    $('.pd_multi_quote_chk input:checked').each(function () {
        var $readLou = $(this).closest('.readlou');
        var matches = /(\d+)楼/.exec($readLou.find('.pd_goto_link').text());
        var floor = matches ? parseInt(matches[1]) : 0;
        var pid = $readLou.prev('a').attr('name');
        var userName = $readLou.next('.readtext').find('.readidmsbottom > a, .readidmleft > a').text();
        if (!userName) return;
        quoteList.push({ floor: floor, pid: pid, userName: userName });
    });
    return quoteList;
};

/**
 * 添加多重回复和多重引用的按钮
 */
var addMultiQuoteButton = exports.addMultiQuoteButton = function addMultiQuoteButton() {
    var replyUrl = $('a[href^="post.php?action=reply"].b_tit2').attr('href');
    if (!replyUrl) return;
    $('<li class="pd_multi_quote_chk"><label title="多重引用"><input type="checkbox"> 引</label></li>').prependTo($('.readlou > div:first-child > ul').has('a[title="引用回复这个帖子"]')).find('input').click(function () {
        var tid = parseInt(Util.getUrlParam('tid'));
        var data = localStorage[_Const2.default.multiQuoteStorageName];
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
        var quoteList = getMultiQuoteData();
        if (!data) {
            localStorage.removeItem(_Const2.default.multiQuoteStorageName);
            data = { tid: tid, quoteList: [] };
        }
        var page = Util.getCurrentThreadPage();
        if (quoteList.length > 0) data.quoteList[page] = quoteList;else delete data.quoteList[page];
        localStorage[_Const2.default.multiQuoteStorageName] = JSON.stringify(data);
    });
    $('.readlou:last').next('div').find('table > tbody > tr > td:last-child').css({ 'text-align': 'right', 'width': '320px' }).append('<span class="b_tit2" style="margin-left: 5px;"><a style="display: inline-block;" href="#" title="\u591A\u91CD\u56DE\u590D">\u56DE\u590D</a> ' + ('<a style="display: inline-block;" href="' + replyUrl + '&multiquote=1" title="\u591A\u91CD\u5F15\u7528">\u5F15\u7528</a></span>')).find('.b_tit2 > a:eq(0)').click(function (e) {
        e.preventDefault();
        Post.handleMultiQuote(1);
    });
};

/**
 * 将帖子和短消息中的绯月其它域名的链接修改为当前域名
 */
var modifyKFOtherDomainLink = exports.modifyKFOtherDomainLink = function modifyKFOtherDomainLink() {
    $('.readtext a, .thread2 a').each(function () {
        var $this = $(this);
        var url = $this.attr('href');
        if (/m\.miaola\.info\//i.test(url)) return;
        var matches = /^(https?:\/\/(?:[\w\.]+?\.)?(?:2dgal|ddgal|9gal|9baka|9moe|kfgal|2dkf|miaola|kfer)\.\w+?\/).+/i.exec(url);
        if (matches) $this.attr('href', url.replace(matches[1], Util.getHostNameUrl()));
    });
};

/**
 * 添加用户自定义备注
 */
var addUserMemo = exports.addUserMemo = function addUserMemo() {
    if ($.isEmptyObject(Config.userMemoList)) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        var $this = $(this);
        var userName = $this.text().trim();
        var key = Object.keys(Config.userMemoList).find(function (name) {
            return name === userName;
        });
        if (!key) return;
        var memo = Config.userMemoList[key];
        if ($this.is('.readidmleft > a')) {
            $this.after('<span class="pd_user_memo_tips" title="\u5907\u6CE8\uFF1A' + memo + '">[?]</span>');
        } else {
            var memoText = memo;
            var maxLength = 24;
            if (memo.length > maxLength) memoText = memoText.substring(0, maxLength) + '&hellip;';
            $this.after('<br><span class="pd_user_memo" title="\u5907\u6CE8\uFF1A' + memo + '">(' + memoText + ')</span>');
        }
    });
};

/**
 * 添加复制代码的链接
 */
var addCopyCodeLink = exports.addCopyCodeLink = function addCopyCodeLink() {
    $('.readtext fieldset > legend:contains("Copy code")').html('<a class="pd_copy_code" href="#">复制代码</a>').parent('fieldset').addClass('pd_code_area');
    if (!$('.pd_copy_code').length) return;
    $('#alldiv').on('click', 'a.pd_copy_code', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $fieldset = $this.closest('fieldset');
        if (Util.copyText($fieldset, '代码已复制', $this.parent())) return;

        var content = $fieldset.data('content');
        if (content) {
            $fieldset.html('<legend><a class="pd_copy_code" href="#">复制代码</a></legend>' + content).removeData('content');
        } else {
            var html = $fieldset.html();
            html = html.replace(/<legend>.+?<\/legend>/i, '');
            $fieldset.data('content', html);
            html = Util.htmlDecode(html);
            var height = $fieldset.height();
            height -= 17;
            if (height < 50) height = 50;
            if (height > 540) height = 540;
            $fieldset.html('\n<legend><a class="pd_copy_code" href="#">\u8FD8\u539F\u4EE3\u7801</a></legend>\n<textarea wrap="off" class="pd_textarea" style="width: 100%; height: ' + height + 'px; line-height: 1.4em; white-space: pre;">' + html + '</textarea>\n');
            $fieldset.find('textarea').select().focus();
        }
    });
};

/**
 * 在帖子页面添加更多表情的链接
 */
var addMoreSmileLink = exports.addMoreSmileLink = function addMoreSmileLink() {
    /**
     * 添加表情代码
     * @param {string} id 表情ID
     */
    var addSmileCode = function addSmileCode(id) {
        var textArea = $('[name="atc_content"]').get(0);
        if (!textArea) return;
        var code = '[s:' + id + ']';
        Util.addCode(textArea, code);
        if (_Info2.default.isMobile) textArea.blur();else textArea.focus();
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

    $('<a class="pd_highlight" href="#">[更多]</a>').appendTo($parent).click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var $panel = $('#pdSmilePanel');
        if ($panel.length > 0) {
            $this.text('[更多]');
            $panel.remove();
            return;
        }
        $this.text('[关闭]');

        var smileImageIdList = ['48', '35', '34', '33', '32', '31', '30', '29', '28', '27', '26', '36', '37', '47', '46', '45', '44', '43', '42', '41', '40', '39', '38', '25', '24', '11', '10', '09', '08', '01', '02', '03', '04', '05', '06', '12', '13', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '07'];
        var smileCodeIdList = [57, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 45, 46, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 34, 33, 20, 19, 18, 17, 10, 11, 12, 13, 14, 15, 21, 22, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 16];
        var html = '';
        for (var i = 0; i < smileImageIdList.length; i++) {
            html += '<img src="' + _Info2.default.w.imgpath + '/post/smile/em/em' + smileImageIdList[i] + '.gif" alt="[\u8868\u60C5]" data-id="' + smileCodeIdList[i] + '">';
        }
        html = '<div class="pd_panel" id="pdSmilePanel" style="width: 308px; height: 185px;">' + html + '</div>';

        var offset = $parent.offset();
        $panel = $(html).appendTo('body');
        $panel.css('top', offset.top + $parent.height() + 4).css('left', offset.left + $parent.width() - $panel.width() + 9).on('click', 'img', function () {
            var id = $(this).data('id');
            if (id) addSmileCode(id);
        });
        Script.runFunc('Read.addMoreSmileLink_after_click_');
    });
};

/**
 * 在帖子页面解析多媒体标签
 */
var parseMediaTag = exports.parseMediaTag = function parseMediaTag() {
    $('.readtext > table > tbody > tr > td').each(function () {
        var $this = $(this);
        var html = $this.html();
        if (/\[(audio|video)\](http|ftp)[^<>]+\[\/(audio|video)\]/.test(html)) {
            $this.html(html.replace(/\[audio\]((?:http|ftp)[^<>]+?)\[\/audio\](?!<\/fieldset>)/g, '<audio src="$1" controls preload="none" style="margin: 3px 0;">[你的浏览器不支持audio标签]</audio>').replace(/\[video\]((?:http|ftp)[^<>]+?)\[\/video\](?!<\/fieldset>)/g, '<video src="$1" controls preload="none" style="max-width: ' + (Config.adjustThreadContentWidthEnabled ? 627 : 820) + 'px; margin:3px 0;">' + '[\u4F60\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301video\u6807\u7B7E]</video>'));
        }
    });
};

/**
 * 显示在购买框之外的附件图片
 */
var showAttachImageOutsideSellBox = exports.showAttachImageOutsideSellBox = function showAttachImageOutsideSellBox() {
    $('.readtext > table > tbody > tr > td').each(function () {
        var $this = $(this);
        var html = $this.html();
        if (/\[attachment=\d+\]/.test(html)) {
            var pid = $this.closest('.readtext').prev('.readlou').prev('a').attr('name');
            var tid = Util.getUrlParam('tid');
            $this.html(html.replace(/\[attachment=(\d+)\]/g, '<img src="job.php?action=download&pid=' + pid + '&tid=' + tid + '&aid=$1" alt="[\u9644\u4EF6\u56FE\u7247]" style="max-width:550px" ' + ('onclick="if(this.width>=550) window.open(\'job.php?action=download&pid=' + pid + '&tid=' + tid + '&aid=$1\');">')));
        }
    });
};

/**
 * 获取帖子标题
 * @returns {string} 帖子标题
 */
var getThreadTitle = exports.getThreadTitle = function getThreadTitle() {
    return $('form[name="delatc"] > div:first > table > tbody > tr > td > span').text().trim();
};

},{"./Const":6,"./Dialog":7,"./Info":9,"./Log":11,"./Msg":15,"./Post":17,"./Public":18,"./Script":20,"./Util":22}],20:[function(require,module,exports){
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
var defScriptName = '未命名脚本';
// 脚本meta信息的正则表达式
var metaRegex = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;
// 自定义方法列表
var funcList = new Map();

/**
 * 执行自定义脚本
 * @param {string} type 脚本执行时机，start：在脚本开始时执行；end：在脚本结束时执行
 */
var runCustomScript = exports.runCustomScript = function runCustomScript() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'end';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Config.customScriptList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value,
                enabled = _step$value.enabled,
                trigger = _step$value.trigger,
                content = _step$value.content;

            if (enabled && trigger === type && content) {
                runCmd(content);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

/**
 * 运行命令
 * @param {string} cmd 命令
 * @param {boolean} isOutput 是否在控制台上显示结果
 * @returns {{result: boolean, response: string}} result：是否执行成功；response：执行结果
 */
var runCmd = exports.runCmd = function runCmd(cmd) {
    var isOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var result = true;
    var response = '';
    try {
        response = eval(cmd);
        if (isOutput) console.log(response);
    } catch (ex) {
        result = false;
        response = ex;
        console.log(ex);
    }
    return { result: result, response: String(response) };
};

/**
 * 添加自定义方法
 * @param {string} name 自定义方法名称
 * @param {function} func 自定义方法
 */
var addFunc = exports.addFunc = function addFunc(name, func) {
    if (!funcList.has(name)) funcList.set(name, []);
    funcList.get(name).push(func);
};

/**
 * 执行自定义方法
 * @param {string} name 自定义方法名称
 * @param {*} [data] 自定义方法参数
 */
var runFunc = exports.runFunc = function runFunc(name, data) {
    if (funcList.has(name)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = funcList.get(name)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var func = _step2.value;

                if (typeof func === 'function') {
                    try {
                        func(data);
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
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
var getScriptMeta = function getScriptMeta(content) {
    var meta = {
        name: defScriptName,
        version: '',
        trigger: 'end',
        homepage: '',
        author: ''
    };
    var matches = metaRegex.exec(content);
    if (!matches) return meta;
    var metaContent = matches[1];
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
var showDialog = exports.showDialog = function showDialog() {
    var showIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var dialogName = 'pdCustomScriptDialog';
    if ($('#' + dialogName).length > 0) return;
    (0, _Config.read)();
    var html = '\n<div class="pd_cfg_main">\n  <div style="margin-top: 5px;">\n    <a class="pd_highlight pd_btn_link" data-name="addNewScript" href="#">\u6DFB\u52A0\u65B0\u811A\u672C</a>\n    <a class="pd_btn_link" data-name="insertSample" href="#">\u63D2\u5165\u8303\u4F8B</a>\n  </div>\n  <div data-name="customScriptList"></div>\n</div>\n<div class="pd_cfg_btns">\n  <span class="pd_cfg_about">\n    <a class="pd_btn_link pd_highlight" href="read.php?tid=500968" target="_blank">\u81EA\u5B9A\u4E49\u811A\u672C\u6536\u96C6\u8D34</a>\n    <a class="pd_btn_link" data-name="openImOrExCustomScriptDialog" href="#">\u5BFC\u5165/\u5BFC\u51FA\u6240\u6709\u811A\u672C</a>\n  </span>\n  <button type="submit">\u4FDD\u5B58</button>\n  <button data-action="close" type="button">\u53D6\u6D88</button>\n  <button class="pd_highlight" name="clear" type="button">\u6E05\u7A7A</button>\n</div>';
    var $dialog = Dialog.create(dialogName, '自定义脚本', html, 'min-width: 776px;');
    var $customScriptList = $dialog.find('[data-name="customScriptList"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customScriptList = [];
        $customScriptList.find('.pd_custom_script_content').each(function () {
            var $this = $(this);
            var content = $this.val();
            if (!$.trim(content)) return;
            var enabled = $this.prev().find('[type="checkbox"]').prop('checked');
            Config.customScriptList.push($.extend(getScriptMeta(content), { enabled: enabled, content: content }));
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
    var addCustomScript = function addCustomScript() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$enabled = _ref.enabled,
            enabled = _ref$enabled === undefined ? true : _ref$enabled,
            _ref$name = _ref.name,
            name = _ref$name === undefined ? defScriptName : _ref$name,
            _ref$version = _ref.version,
            version = _ref$version === undefined ? '' : _ref$version,
            _ref$homepage = _ref.homepage,
            homepage = _ref$homepage === undefined ? '' : _ref$homepage,
            _ref$trigger = _ref.trigger,
            trigger = _ref$trigger === undefined ? 'end' : _ref$trigger,
            _ref$content = _ref.content,
            content = _ref$content === undefined ? '' : _ref$content;

        $customScriptList.append('\n<div class="pd_custom_script_header">\n  <input type="checkbox" ' + (enabled ? 'checked' : '') + ' title="\u662F\u5426\u542F\u7528\u6B64\u811A\u672C">\n  <a class="pd_custom_script_name" href="#" style="margin-left: 5px;">[' + name + ']</a>\n  <span data-name="version" style="margin-left: 5px; color: #666;" ' + (!version ? 'hidden' : '') + '>' + version + '</span>\n  <span data-name="trigger" style="margin-left: 5px; color: ' + (trigger === 'start' ? '#f00' : '#00f') + ';" title="\u811A\u672C\u6267\u884C\u65F6\u673A">\n    [' + (trigger === 'start' ? '开始时' : '结束时') + ']\n  </span>\n  <a data-name="homepage" href="' + homepage + '" target="_blank" style="margin-left: 5px;" ' + (!homepage ? 'hidden' : '') + '>[\u4E3B\u9875]</a>\n  <a data-name="delete" href="#" style="margin-left: 5px; color: #666;">[\u5220\u9664]</a>\n</div>\n<textarea class="pd_custom_script_content" wrap="off">' + content + '</textarea>\n');
    };

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Config.customScriptList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var data = _step3.value;

            addCustomScript(data);
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    $dialog.find('[data-name="addNewScript"]').click(function (e) {
        e.preventDefault();
        $customScriptList.find('.pd_custom_script_content').hide();
        addCustomScript();
        $customScriptList.find('.pd_custom_script_content:last').show().focus();
        Dialog.resize(dialogName);
    }).end().find('[data-name="insertSample"]').click(function (e) {
        e.preventDefault();
        var $content = $customScriptList.find('.pd_custom_script_content:visible');
        $content.val(('\n// ==UserScript==\n// @name        ' + defScriptName + '\n// @version     1.0\n// @author      ' + _Info2.default.userName + '\n// @trigger     end\n// @homepage    read.php?tid=500968&spid=12318348\n// @description \u8FD9\u662F\u4E00\u4E2A\u672A\u547D\u540D\u811A\u672C\n// ==/UserScript==\n').trim() + '\n' + $content.val()).focus();
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
        var $header = $(this).closest('.pd_custom_script_header');
        $header.next().remove();
        $header.remove();
        Dialog.resize(dialogName);
    }).on('change', '.pd_custom_script_content', function () {
        var $this = $(this);

        var _getScriptMeta = getScriptMeta($this.val()),
            name = _getScriptMeta.name,
            version = _getScriptMeta.version,
            homepage = _getScriptMeta.homepage,
            trigger = _getScriptMeta.trigger;

        var $header = $this.prev();
        $header.find('.pd_custom_script_name').text('[' + (name ? name : defScriptName) + ']');
        $header.find('[data-name="version"]').text(version).prop('hidden', !version);
        $header.find('[data-name="homepage"]').attr('href', homepage ? homepage : '').prop('hidden', !homepage);
        $header.find('[data-name="trigger"]').html('[' + (trigger === 'start' ? '开始时' : '结束时') + ']').css('color', trigger === 'start' ? '#f00' : '#00f');
    });

    Dialog.show(dialogName);
    if (typeof showIndex === 'number') $customScriptList.find('.pd_custom_script_name').eq(showIndex).click();
};

/**
 * 处理安装自定义脚本按钮
 */
var handleInstallScriptLink = exports.handleInstallScriptLink = function handleInstallScriptLink() {
    $(document).on('click', 'a[href$="#install-script"]', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $area = $this.nextAll('.pd_code_area').eq(0);
        if (!$area.length) return;
        var content = Util.htmlDecode($area.html().replace(/<legend>.+?<\/legend>/i, '')).trim();
        if (!metaRegex.test(content)) return;
        (0, _Config.read)();
        var meta = getScriptMeta(content);
        var index = Config.customScriptList.findIndex(function (script) {
            return script.name === meta.name && script.author === meta.author;
        });
        var type = index > -1 ? 1 : 0;
        if (!confirm('\u662F\u5426' + (type === 1 ? '更新' : '安装') + '\u6B64\u811A\u672C\uFF1F')) return;
        var script = $.extend(meta, { enabled: true, content: content });
        if (type === 1) Config.customScriptList[index] = script;else Config.customScriptList.push(script);
        (0, _Config.write)();
        Dialog.close('pdCustomScriptDialog');
        showDialog(index);
    });
};

},{"./Bank":2,"./Card":3,"./Config":4,"./ConfigDialog":5,"./Const":6,"./Dialog":7,"./Index":8,"./Info":9,"./Item":10,"./Log":11,"./Loot":13,"./LootLog":14,"./Msg":15,"./Other":16,"./Post":17,"./Public":18,"./Read":19,"./TmpLog":21,"./Util":22}],21:[function(require,module,exports){
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
var name = _Const2.default.storagePrefix + 'tmp_log';

/**
 * 读取临时日志
 * @returns {{}} 临时日志对象
 */
var read = exports.read = function read() {
    var log = {};
    var options = Util.readData(name + '_' + _Info2.default.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    } catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    var allowKeys = [];
    for (var k in _Const2.default) {
        if (k.endsWith('TmpLogName')) allowKeys.push(_Const2.default[k]);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(options)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _k = _step.value;

            if (!allowKeys.includes(_k)) delete options[_k];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    log = options;
    return log;
};

/**
 * 写入临时日志
 * @param {{}} log 临时日志对象
 */
var write = exports.write = function write(log) {
    return Util.writeData(name + '_' + _Info2.default.uid, JSON.stringify(log));
};

/**
 * 清除临时日志
 */
var clear = exports.clear = function clear() {
    return Util.deleteData(name + '_' + _Info2.default.uid);
};

/**
 * 获取指定名称的临时日志内容
 * @param {string} key 日志名称
 * @returns {*} 日志内容
 */
var getValue = exports.getValue = function getValue(key) {
    var log = read();
    return key in log ? log[key] : null;
};

/**
 * 设置指定名称的临时日志内容
 * @param {string} key 日志名称
 * @param {*} value 日志内容
 */
var setValue = exports.setValue = function setValue(key, value) {
    var log = read();
    log[key] = value;
    write(log);
};

/**
 * 删除指定名称的临时日志
 * @param {string} key 日志名称
 */
var deleteValue = exports.deleteValue = function deleteValue(key) {
    var log = read();
    if (key in log) {
        delete log[key];
        write(log);
    }
};

},{"./Const":6,"./Info":9,"./Util":22}],22:[function(require,module,exports){
/* 工具模块 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteData = exports.writeData = exports.readData = exports.selectInverse = exports.selectAll = exports.inFollowOrBlockUserList = exports.entries = exports.getResponseMsg = exports.copyText = exports.getSelText = exports.addCode = exports.getStrByteLen = exports.removeUnpairedBBCodeContent = exports.getFixedNumLocStr = exports.getCurrentThreadPage = exports.compareSmLevel = exports.isEdge = exports.isOpera = exports.getStatFormatNumber = exports.getSortedObjectKeyList = exports.getObjectKeyList = exports.removeHtmlTag = exports.htmlDecode = exports.htmlEncode = exports.getGBKEncodeString = exports.getUrlParam = exports.deepEqual = exports.getDifferenceSetOfObject = exports.getHostNameUrl = exports.isBetweenInTimeRange = exports.getTimeDiffInfo = exports.getTimeString = exports.getDateString = exports.getDate = exports.getMidnightHourDate = exports.getTimezoneDateByTime = exports.getDateByTime = exports.deleteCookie = exports.getCookie = exports.setCookie = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var setCookie = exports.setCookie = function setCookie(name, value) {
    var date = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _Info2.default.uid + '_' + _Const2.default.storagePrefix;

    document.cookie = '' + prefix + name + '=' + encodeURI(value) + (!date ? '' : ';expires=' + date.toUTCString()) + ';path=/;';
};

/**
 * 获取Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 * @returns {?string} Cookie值
 */
var getCookie = exports.getCookie = function getCookie(name) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Info2.default.uid + '_' + _Const2.default.storagePrefix;

    var regex = new RegExp('(^| )' + prefix + name + '=([^;]*)(;|$)');
    var matches = document.cookie.match(regex);
    if (!matches) return null;else return decodeURI(matches[2]);
};

/**
 * 删除Cookie
 * @param {string} name Cookie名称
 * @param {string} prefix Cookie名称前缀
 */
var deleteCookie = exports.deleteCookie = function deleteCookie(name) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Info2.default.uid + '_' + _Const2.default.storagePrefix;

    document.cookie = '' + prefix + name + '=;expires=' + getDate('-1d').toUTCString() + ';path=/;';
};

/**
 * 返回当天指定时间的Date对象
 * @param {string} time 指定的时间（例：22:30:00）
 * @returns {Date} 指定时间的Date对象
 */
var getDateByTime = exports.getDateByTime = function getDateByTime(time) {
    var date = new Date();

    var _time$split = time.split(':'),
        _time$split2 = _slicedToArray(_time$split, 3),
        hour = _time$split2[0],
        minute = _time$split2[1],
        second = _time$split2[2];

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
var getTimezoneDateByTime = exports.getTimezoneDateByTime = function getTimezoneDateByTime(time) {
    var timezoneOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Const2.default.forumTimezoneOffset;

    var date = new Date();

    var _time$split3 = time.split(':'),
        _time$split4 = _slicedToArray(_time$split3, 3),
        hour = _time$split4[0],
        minute = _time$split4[1],
        second = _time$split4[2];

    if (typeof hour !== 'undefined') date.setUTCHours(parseInt(hour) + timezoneOffset);
    if (typeof minute !== 'undefined') date.setUTCMinutes(parseInt(minute));
    if (typeof second !== 'undefined') date.setUTCSeconds(parseInt(second));
    date.setUTCMilliseconds(0);
    var now = new Date();
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
var getMidnightHourDate = exports.getMidnightHourDate = function getMidnightHourDate(days) {
    var date = getDateByTime('00:00:00');
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
var getDate = exports.getDate = function getDate(value) {
    var date = new Date();
    var matches = /^(-|\+)?(\d+)([a-zA-Z]{1,2})$/.exec(value);
    if (!matches) return null;
    var flag = typeof matches[1] === 'undefined' ? 0 : matches[1] === '+' ? 1 : -1;
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
};

/**
 * 获取指定Date对象的日期字符串
 * @param {?Date} [date] 指定Date对象，留空表示现在
 * @param {string} separator 分隔符
 * @returns {string} 日期字符串
 */
var getDateString = exports.getDateString = function getDateString(date) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';

    date = date ? date : new Date();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    return date.getFullYear() + separator + month.padStart(2, '0') + separator + day.padStart(2, '0');
};

/**
 * 获取指定Date对象的时间字符串
 * @param {?Date} [date] 指定Date对象，留空表示现在
 * @param {string} separator 分隔符
 * @param {boolean} isShowSecond 是否显示秒钟
 * @returns {string} 时间字符串
 */
var getTimeString = exports.getTimeString = function getTimeString() {
    var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ':';
    var isShowSecond = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds().toString();
    return hour.padStart(2, '0') + separator + minute.padStart(2, '0') + (isShowSecond ? separator : '') + (isShowSecond ? second.padStart(2, '0') : '');
};

/**
 * 获取指定时间戳距现在所剩余时间的描述
 * @param {number} timestamp 指定时间戳
 * @returns {{hours: number, minutes: number, seconds: number}} 剩余时间的描述，hours：剩余的小时数；minutes：剩余的分钟数；seconds：剩余的秒数
 */
var getTimeDiffInfo = exports.getTimeDiffInfo = function getTimeDiffInfo(timestamp) {
    var diff = timestamp - new Date().getTime();
    if (diff > 0) {
        diff = Math.floor(diff / 1000);
        var hours = Math.floor(diff / 60 / 60);
        if (hours >= 0) {
            var minutes = Math.floor((diff - hours * 60 * 60) / 60);
            if (minutes < 0) minutes = 0;
            var seconds = Math.floor(diff - hours * 60 * 60 - minutes * 60);
            if (seconds < 0) seconds = 0;
            return { hours: hours, minutes: minutes, seconds: seconds };
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
var isBetweenInTimeRange = exports.isBetweenInTimeRange = function isBetweenInTimeRange(time, range) {
    var _range$split = range.split('-'),
        _range$split2 = _slicedToArray(_range$split, 2),
        range1 = _range$split2[0],
        range2 = _range$split2[1];

    if (typeof range2 === 'undefined') return null;
    var start = getDateByTime(range1);
    var end = getDateByTime(range2);
    if (end < start) {
        if (time > end) end.setDate(end.getDate() + 1);else start.setDate(start.getDate() - 1);
    }
    return time >= start && time <= end;
};

/**
 * 获取当前域名的URL
 * @returns {string} 当前域名的URL
 */
var getHostNameUrl = exports.getHostNameUrl = function getHostNameUrl() {
    return location.protocol + '//' + location.host + '/';
};

/**
 * 获取对象A在对象B中的相对补集
 * @param {Object} a 对象A
 * @param {Object} b 对象B
 * @returns {Object} 相对补集
 */
var getDifferenceSetOfObject = exports.getDifferenceSetOfObject = function getDifferenceSetOfObject(a, b) {
    var c = {};
    if ($.type(a) !== 'object' || $.type(b) !== 'object') return c;
    $.each(b, function (key, data) {
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
var deepEqual = exports.deepEqual = function deepEqual(a, b) {
    if (a === b) return true;
    if ($.type(a) !== $.type(b)) return false;
    if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
    if ($.isArray(a) && $.isArray(b) || $.type(a) === 'object' && $.type(b) === 'object') {
        if (a.length !== b.length) return false;
        for (var i in $.extend($.isArray(a) ? [] : {}, a, b)) {
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
var getUrlParam = exports.getUrlParam = function getUrlParam(name) {
    var regex = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var matches = location.search.substring(1).match(regex);
    if (matches) return decodeURI(matches[2]);else return null;
};

/**
 * 获取经过GBK编码后的字符串
 * @param {string} str 待编码的字符串
 * @returns {string} 经过GBK编码后的字符串
 */
var getGBKEncodeString = exports.getGBKEncodeString = function getGBKEncodeString(str) {
    var img = $('<img>').appendTo('body').get(0);
    img.src = 'nothing?sp=' + str;
    var encodeStr = img.src.split('nothing?sp=').pop();
    $(img).remove();
    return encodeStr;
};

/**
 * HTML转义编码
 * @param {string} str 待编码的字符串
 * @returns {string} 编码后的字符串
 */
var htmlEncode = exports.htmlEncode = function htmlEncode(str) {
    if (!str.length) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\'/g, '&#39;').replace(/\"/g, '&quot;').replace(/\n/g, '<br>');
};

/**
 * HTML转义解码
 * @param {string} str 待解码的字符串
 * @returns {string} 解码后的字符串
 */
var htmlDecode = exports.htmlDecode = function htmlDecode(str) {
    if (!str.length) return '';
    return str.replace(/<br\s*\/?>/gi, '\n').replace(/&quot;/gi, '\"').replace(/&#39;/gi, '\'').replace(/&nbsp;/gi, ' ').replace(/&gt;/gi, '>').replace(/&lt;/gi, '<').replace(/&amp;/gi, '&');
};

/**
 * 去除HTML标签
 * @param html HTML代码
 * @returns {string} 去除HTML标签的文本
 */
var removeHtmlTag = exports.removeHtmlTag = function removeHtmlTag(html) {
    return html.replace(/<br.*\/?>/g, '\n').replace(/<[^>]+>/g, '');
};

/**
 * 获取指定对象的关键字列表
 * @param {Object} obj 指定对象
 * @param {number} sortBy 是否排序，0：不排序；1：升序；-1：降序
 * @returns {string[]} 关键字列表
 */
var getObjectKeyList = exports.getObjectKeyList = function getObjectKeyList(obj) {
    var sortBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var list = [];
    if ($.type(obj) !== 'object') return list;
    for (var key in obj) {
        list.push(key);
    }
    if (sortBy !== 0) {
        list.sort(function (a, b) {
            return sortBy > 0 ? a > b ? 1 : -1 : a < b ? 1 : -1;
        });
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
var getSortedObjectKeyList = exports.getSortedObjectKeyList = function getSortedObjectKeyList(sortKeyList, obj) {
    var sortBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var list = getObjectKeyList(obj, sortBy);
    list.sort(function (a, b) {
        return sortKeyList.indexOf(a) > sortKeyList.indexOf(b) ? 1 : -1;
    });
    return list;
};

/**
 * 获取经过格式化的统计数字字符串
 * @param {number} num 待处理的数字
 * @returns {string} 经过格式化的数字字符串
 */
var getStatFormatNumber = exports.getStatFormatNumber = function getStatFormatNumber(num) {
    return num >= 0 ? '<em>+' + num.toLocaleString() + '</em>' : '<ins>' + num.toLocaleString() + '</ins>';
};

/**
 * 检测浏览器是否为Opera
 * @returns {boolean} 是否为Opera
 */
var isOpera = exports.isOpera = function isOpera() {
    return typeof _Info2.default.w.opera !== 'undefined';
};

/**
 * 检测浏览器是否为Edge
 * @returns {boolean} 是否为Edge
 */
var isEdge = exports.isEdge = function isEdge() {
    return navigator.appVersion && navigator.appVersion.includes('Edge');
};

/**
 * 比较神秘等级高低
 * @param {string} a
 * @param {string} b
 * @returns {number} 比较结果，-1：a小于b；0：a等于b；1：a大于b
 */
var compareSmLevel = exports.compareSmLevel = function compareSmLevel(a, b) {
    var x = a.toUpperCase() === 'MAX' ? Number.MAX_VALUE : parseInt(a);
    var y = b.toUpperCase() === 'MAX' ? Number.MAX_VALUE : parseInt(b);
    if (x > y) return 1;else if (x < y) return -1;else return 0;
};

/**
 * 获取帖子当前所在的页数
 * @returns {number} 帖子当前所在的页数
 */
var getCurrentThreadPage = exports.getCurrentThreadPage = function getCurrentThreadPage() {
    var matches = /- (\d+) -/.exec($('.pages:first > li > a[href="javascript:;"]').text());
    return matches ? parseInt(matches[1]) : 1;
};

/**
 * 获取指定小数位的本地字符串
 * @param {number} num 数字
 * @param {number} digit 指定小数位
 * @returns {string} 指定小数位的本地字符串
 */
var getFixedNumLocStr = exports.getFixedNumLocStr = function getFixedNumLocStr(num) {
    var digit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var _num$toFixed$split = num.toFixed(digit).split('.'),
        _num$toFixed$split2 = _slicedToArray(_num$toFixed$split, 2),
        iNum = _num$toFixed$split2[0],
        dNum = _num$toFixed$split2[1];

    var iStr = parseInt(iNum).toLocaleString();
    var dStr = '';
    if (typeof dNum !== 'undefined') dStr = '.' + dNum;
    return iStr + dStr;
};

/**
 * 去除不配对的BBCode
 * @param {string} content 引用内容
 * @returns {string} 去除了不配对BBCode的内容
 */
var removeUnpairedBBCodeContent = exports.removeUnpairedBBCodeContent = function removeUnpairedBBCodeContent(content) {
    var startCodeList = [/\[color=.+?\]/g, /\[backcolor=.+?\]/g, /\[size=.+?\]/g, /\[font=.+?\]/g, /\[align=.+?\]/g, /\[b\]/g, /\[i\]/g, /\[u\]/g, /\[strike\]/g, /\[sup\]/g, /\[sub\]/g];
    var endCodeList = [/\[\/color\]/g, /\[\/backcolor\]/g, /\[\/size\]/g, /\[\/font\]/g, /\[\/align\]/g, /\[\/b\]/g, /\[\/i\]/g, /\[\/u\]/g, /\[\/strike\]/g, /\[\/sup\]/g, /\[\/sub\]/g];
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
};

/**
 * 获取指定字符串的字节长度（1个GBK字符按2个字节来算）
 * @param {string} str 指定字符串
 * @returns {number} 字符串的长度
 */
var getStrByteLen = exports.getStrByteLen = function getStrByteLen(str) {
    var len = 0;
    var cLen = 2;
    for (var i = 0; i < str.length; i++) {
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
var addCode = exports.addCode = function addCode(textArea, code) {
    var selText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var startPos = !selText ? code.indexOf(']') + 1 : code.indexOf(selText);
    if (typeof textArea.selectionStart !== 'undefined') {
        var prePos = textArea.selectionStart;
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
var getSelText = exports.getSelText = function getSelText(textArea) {
    return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
};

/**
 * 复制文本
 * @param {jQuery} $target 要复制文本的目标元素
 * @param {string} msg 复制成功的消息
 * @param {jQuery} $excludeElem 要排除复制的元素
 * @returns {boolean} 是否复制成功
 */
var copyText = exports.copyText = function copyText($target) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var $excludeElem = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (!('execCommand' in document) || !$target.length) return false;
    var copyText = $target.data('copy-text');
    if (copyText) {
        $target = $('<span class="pd_hide">' + copyText.replace(/\n/g, '<br>') + '</span>').insertAfter($target);
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
};

/**
 * 获取服务器返回的消息
 * @param {string} html HTML代码
 * @returns {{type: number, msg: string, url: string}} 服务器返回的消息对象
 */
var getResponseMsg = exports.getResponseMsg = function getResponseMsg(html) {
    var type = 0;
    var msg = '',
        url = '';
    var matches = /<span style=".+?">(.+?)<\/span><br\s*\/?><a href="(.+?)">/i.exec(html);
    if (matches) {
        type = 1;
        msg = matches[1];
        url = matches[2];
    } else {
        var _matches = /操作提示<br\s*\/?>\r\n(.+?)<br\s*\/?>\r\n<a href="javascript:history\.go\(-1\);">返回上一步操作<\/a>/i.exec(html);
        if (_matches) {
            type = -1;
            msg = _matches[1];
        }
    }
    return { type: type, msg: msg ? msg : '未能获得预期的回应', url: url };
};

/**
 * 返回指定对象由可枚举属性名和对应属性值组成的的键值对
 * @param {Object} obj 指定对象
 */
var entries = exports.entries = regeneratorRuntime.mark(function entries(obj) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return regeneratorRuntime.wrap(function entries$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 3;
                    _iterator = Object.keys(obj)[Symbol.iterator]();

                case 5:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context.next = 12;
                        break;
                    }

                    key = _step.value;
                    _context.next = 9;
                    return [key, obj[key]];

                case 9:
                    _iteratorNormalCompletion = true;
                    _context.next = 5;
                    break;

                case 12:
                    _context.next = 18;
                    break;

                case 14:
                    _context.prev = 14;
                    _context.t0 = _context['catch'](3);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                case 18:
                    _context.prev = 18;
                    _context.prev = 19;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }

                case 21:
                    _context.prev = 21;

                    if (!_didIteratorError) {
                        _context.next = 24;
                        break;
                    }

                    throw _iteratorError;

                case 24:
                    return _context.finish(21);

                case 25:
                    return _context.finish(18);

                case 26:
                case 'end':
                    return _context.stop();
            }
        }
    }, entries, this, [[3, 14, 18, 26], [19,, 21, 25]]);
});

/**
 * 获取指定用户名在关注或屏蔽列表中的索引号
 * @param {string} name 指定用户名
 * @param {Array} list 指定列表
 * @returns {number} 指定用户在列表中的索引号，-1表示不在该列表中
 */
var inFollowOrBlockUserList = exports.inFollowOrBlockUserList = function inFollowOrBlockUserList(name, list) {
    return list.findIndex(function (data) {
        return data.name && data.name === name;
    });
};

/**
 * 全选
 * @param {jQuery} $nodes 想要全选的节点的jQuery对象
 * @returns {boolean} 返回false
 */
var selectAll = exports.selectAll = function selectAll($nodes) {
    $nodes.prop('checked', true);
    return false;
};

/**
 * 反选
 * @param {jQuery} $nodes 想要反选的节点的jQuery对象
 * @returns {boolean} 返回false
 */
var selectInverse = exports.selectInverse = function selectInverse($nodes) {
    $nodes.each(function () {
        var $this = $(this);
        $this.prop('checked', !$this.prop('checked'));
    });
    return false;
};

/**
 * 读取数据
 * @param {string} key 关键字
 * @param {string} storageType 存储类型
 */
var readData = exports.readData = function readData(key) {
    var storageType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Info2.default.storageType;

    return storageType === 'ByUid' || storageType === 'Global' ? GM_getValue(key) : localStorage.getItem(key);
};

/**
 * 写入数据
 * @param {string} key 关键字
 * @param {string} value 值
 * @param {string} storageType 存储类型
 */
var writeData = exports.writeData = function writeData(key, value) {
    var storageType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Info2.default.storageType;

    if (storageType === 'ByUid' || storageType === 'Global') GM_setValue(key, value);else localStorage.setItem(key, value);
};

/**
 * 删除数据
 * @param {string} key 关键字
 * @param {string} storageType 存储类型
 */
var deleteData = exports.deleteData = function deleteData(key) {
    var storageType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Info2.default.storageType;

    if (storageType === 'ByUid' || storageType === 'Global') GM_deleteValue(key);else localStorage.removeItem(key);
};

},{"./Const":6,"./Info":9}]},{},[1]);

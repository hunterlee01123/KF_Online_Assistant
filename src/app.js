'use strict';
import Info from './module/Info';
import {init as initConfig} from './module/Config';
import * as Util from './module/Util';
import Const from './module/Const';
import * as Msg from './module/Msg';
import * as Dialog from './module/Dialog';
import * as Log from './module/Log';
import * as TmpLog from './module/TmpLog';
import * as LootLog from './module/LootLog';
import * as Script from './module/Script';
import * as Public from './module/Public';
import * as Index from './module/Index';
import * as Read from './module/Read';
import * as Post from './module/Post';
import * as Other from './module/Other';
import * as Bank from './module/Bank';
import * as Card from './module/Card';
import * as Item from './module/Item';
import * as Loot from './module/Loot';
import * as ConfigDialog from './module/ConfigDialog';

// 版本号
const version = '9.6.3';

/**
 * 导出模块
 */
const exportModule = function () {
    try {
        Info.w.Info = require('./module/Info').default;
        Info.w.Util = require('./module/Util');
        Info.w.Const = require('./module/Const').default;
        Info.w.Msg = require('./module/Msg');
        Info.w.Dialog = require('./module/Dialog');
        Info.w.Log = require('./module/Log');
        Info.w.TmpLog = require('./module/TmpLog');
        Info.w.LootLog = require('./module/LootLog');
        Info.w.Public = require('./module/Public');
        Info.w.Index = require('./module/Index');
        Info.w.Read = require('./module/Read');
        Info.w.Post = require('./module/Post');
        Info.w.Other = require('./module/Other');
        Info.w.Bank = require('./module/Bank');
        Info.w.Card = require('./module/Card');
        Info.w.Item = require('./module/Item');
        Info.w.Loot = require('./module/Loot');
        Info.w.Script = require('./module/Script');
        const Conf = require('./module/Config');
        Info.w.readConfig = Conf.read;
        Info.w.writeConfig = Conf.write;
    }
    catch (ex) {
        console.log(ex);
    }
};

/**
 * 初始化
 */
const init = function () {
    let startDate = new Date();
    //console.log('【KF Online助手】启动');
    Info.version = version;
    if (!Public.getUidAndUserName()) return;
    Public.addPolyfill();
    exportModule();
    initConfig();
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
    if (Info.isInHomePage) {
        Index.handleIndexPersonalInfo();
        Index.handleAtTips();
        Index.addSearchTypeSelectBox();
        if (Config.smLevelUpAlertEnabled) Index.smLevelUpAlert();
        if (Config.smRankChangeAlertEnabled) Index.smRankChangeAlert();
        if (Config.showVipSurplusTimeEnabled) Index.showVipSurplusTime();
        if (Config.homePageThreadFastGotoLinkEnabled) Index.addThreadFastGotoLink();
        if (Config.fixedDepositDueAlertEnabled && !Util.getCookie(Const.fixedDepositDueAlertCookieName)) Bank.fixedDepositDueAlert();
        if (parseInt(Util.getCookie(Const.lootCompleteCookieName)) === 2)
            $('a.indbox5[href="kf_fw_ig_index.php"]').removeClass('indbox5').addClass('indbox6');
        Index.addPromoteHaloInterval();
    }
    else if (location.pathname === '/read.php') {
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
    }
    else if (location.pathname === '/thread.php') {
        if (Config.highlightNewPostEnabled) Other.highlightNewPost();
        if (Config.showFastGotoThreadPageEnabled) Other.addFastGotoThreadPageLink();
    }
    else if (location.pathname === '/post.php') {
        if (/\bmultiquote=1/i.test(location.href)) {
            if (Config.multiQuoteEnabled) Post.handleMultiQuote(2);
        }
        else if (/\baction=quote/i.test(location.href)) {
            Post.removeUnpairedBBCodeInQuoteContent();
        }
        Post.addExtraPostEditorButton();
        Post.addExtraOptionInPostPage();
        if (Config.preventCloseWindowWhenEditPostEnabled) Post.preventCloseWindowWhenEditPost();
        if (Config.autoSavePostContentWhenSubmitEnabled) Post.savePostContentWhenSubmit();
        if (Info.isInMiaolaDomain) Post.addAttachChangeAlert();
    }
    else if (/\/kf_fw_ig_my\.php$/.test(location.href)) {
        Item.enhanceMyItemsPage();
        Item.addBatchUseAndConvertOldItemTypesButton();
    }
    else if (location.pathname === '/kf_fw_ig_mybp.php') {
        Item.addBatchUseItemsButton();
        Item.hideItemTypes();
    }
    else if (location.pathname === '/kf_fw_ig_shop.php') {
        Item.addBatchBuyItemsLink();
    }
    else if (location.pathname === '/kf_fw_ig_pklist.php') {
        Loot.addUserLinkInPkListPage();
    }
    else if (location.pathname === '/kf_fw_ig_halo.php') {
        $('.kf_fw_ig1').on('click', 'a[href^="kf_fw_ig_halo.php?do=buy&id="]', () => confirm('是否提升战力光环？'));
    }
    else if (/\/hack\.php\?H_name=bank$/i.test(location.href)) {
        Bank.handleBankPage();
    }
    else if (/\/kf_fw_card_my\.php$/.test(location.href)) {
        Card.addStartBatchModeButton();
    }
    else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
        Other.addFastDrawMoneyLink();
        if (Config.modifyKfOtherDomainEnabled) Read.modifyKFOtherDomainLink();
    }
    else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
        Other.addMsgSelectButton();
    }
    else if (/\/profile\.php\?action=show/i.test(location.href)) {
        Other.handleProfilePage();
        Other.addFollowAndBlockAndMemoUserLink();
    }
    else if (/\/personal\.php\?action=post/i.test(location.href)) {
        if (Config.perPageFloorNum === 10) Other.modifyMyPostLink();
    }
    else if (location.pathname === '/kf_growup.php') {
        Other.addAutoChangeIdColorButton();
    }
    else if (location.pathname === '/guanjianci.php') {
        Other.highlightUnReadAtTipsMsg();
    }
    else if (/\/profile\.php\?action=modify$/i.test(location.href)) {
        Other.syncModifyPerPageFloorNum();
        if (Info.isInMiaolaDomain) Other.addAvatarChangeAlert();
    }
    else if (/\/job\.php\?action=preview$/i.test(location.href)) {
        Post.modifyPostPreviewPage();
    }
    else if (location.pathname === '/search.php') {
        if (Config.turnPageViaKeyboardEnabled) Public.turnPageViaKeyboard();
    }
    else if (/\/kf_fw_1wkfb\.php\?ping=(2|4)/i.test(location.href)) {
        Other.highlightRatingErrorSize();
    }
    else if (/\/kf_fw_1wkfb\.php\?do=1/i.test(location.href)) {
        Other.showSelfRatingErrorSizeSubmitWarning();
    }
    else if (location.pathname === '/kf_no1.php') {
        Other.addUserNameLinkInRankPage();
    }
    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (Info.isMobile) Public.bindElementTitleClick();
    if (Info.isInMiaolaDomain) {
        if (Config.kfSmileEnhanceExtensionEnabled && ['/read.php', '/post.php', '/message.php'].includes(location.pathname)) {
            Post.importKfSmileEnhanceExtension();
        }
        $('a[href^="login.php?action=quit"]:first').before('<a href="https://m.miaola.info/" target="_blank">移动版</a><span> | </span>');
    }

    let isAutoPromoteHaloStarted = false;
    if (Config.autoPromoteHaloEnabled && !Util.getCookie(Const.promoteHaloCookieName)) {
        isAutoPromoteHaloStarted = true;
        Loot.promoteHalo(location.pathname === '/kf_fw_ig_index.php');
    }
    if (location.pathname === '/kf_fw_ig_index.php' && !isAutoPromoteHaloStarted) Loot.init();

    let isAutoLootStarted = false;
    if (location.pathname !== '/kf_fw_ig_index.php' && !Util.getCookie(Const.lootCompleteCookieName)) {
        if (Config.autoLootEnabled) {
            if (!Util.getCookie(Const.lootAttackingCookieName)) {
                isAutoLootStarted = true;
                setTimeout(Loot.checkLoot, isAutoPromoteHaloStarted ? 20 * 1000 : 0);
            }
        }
        else if (Config.autoSaveLootLogInSpecialCaseEnabled) {
            isAutoLootStarted = true;
            Loot.autoSaveLootLog();
        }
    }

    if (Config.autoGetDailyBonusEnabled && !Util.getCookie(Const.getDailyBonusCookieName) && !isAutoLootStarted) Public.getDailyBonus();

    if (Config.autoSaveCurrentDepositEnabled && Info.isInHomePage) Public.autoSaveCurrentDeposit();

    if (Config.autoChangeIdColorEnabled && !Util.getCookie(Const.autoChangeIdColorCookieName)) Public.changeIdColor();

    if (Config.timingModeEnabled && (Info.isInHomePage || location.pathname === '/kf_fw_ig_index.php')) Public.startTimingMode();

    if (Config.customScriptEnabled) Script.runCustomScript('end');

    let endDate = new Date();
    console.log(`【KF Online助手】初始化耗时：${endDate - startDate}ms`);
};

if (typeof jQuery !== 'undefined') $(document).ready(init);

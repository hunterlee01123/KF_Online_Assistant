'use strict';
import Info from './module/Info';
import * as Util from './module/Util';
import Const from './module/Const';
import {init as initConfig} from './module/Config';
import * as Public from './module/Public';
import * as Index from './module/Index';
import * as Read from './module/Read';
import * as Post from './module/Post';
import * as Other from './module/Other';
import * as Bank from './module/Bank';
import * as Card from './module/Card';
import * as Item from './module/Item';
import * as Loot from './module/Loot';
import * as Script from './module/Script';

// 版本号
const version = '8.1.1';

$(function () {
    if (typeof jQuery === 'undefined') return;
    let startDate = new Date();
    //console.log('【KF Online助手】启动');
    Info.version = version;
    if (!Public.getUidAndUserName()) return;
    Public.addPolyfill();
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
        Read.addCopyBuyersListLink();
        Read.addStatRepliersLink();
        Read.handleBuyThreadBtn();
        if (Config.batchBuyThreadEnabled) Read.addBatchBuyThreadButton();
        if (Config.showSelfRatingLinkEnabled) Read.addSelfRatingLink();
        if (Config.userMemoEnabled) Read.addUserMemo();
        Read.addCopyCodeLink();
        Read.addMoreSmileLink();
        if ($('a[href$="#install-script"]').length > 0) Script.handleInstallScriptLink();
    }
    else if (location.pathname === '/thread.php') {
        if (Config.highlightNewPostEnabled) Other.highlightNewPost();
        if (Config.showFastGotoThreadPageEnabled) Other.addFastGotoThreadPageLink();
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
        Item.addUseItemsButton();
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
    else if (/\/post\.php\?action=reply&fid=\d+&tid=\d+&multiquote=1/i.test(location.href)) {
        if (Config.multiQuoteEnabled) Post.handleMultiQuote(2);
    }
    else if (/\/post\.php\?action=quote/i.test(location.href)) {
        Post.removeUnpairedBBCodeInQuoteContent();
    }
    else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
        Other.addFastDrawMoneyLink();
        if (Config.modifyKfOtherDomainEnabled) Read.modifyKFOtherDomainLink();
    }
    else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
        Other.addMsgSelectButton();
    }
    else if (/\/profile\.php\?action=show/i.test(location.href)) {
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
    else if (location.pathname === '/faq.php') {
        Other.modifyFaq();
    }
    if (location.pathname === '/post.php') {
        Post.addExtraPostEditorButton();
        Post.addExtraOptionInPostPage();
        if (Info.isInMiaolaDomain) Post.addAttachChangeAlert();
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

    let autoSaveCurrentDepositAvailable = Config.autoSaveCurrentDepositEnabled && Info.isInHomePage;
    let isDonationStarted = false;
    if (Config.autoDonationEnabled && !Util.getCookie(Const.donationCookieName)) {
        isDonationStarted = true;
        Public.donation(autoSaveCurrentDepositAvailable);
    }

    if (autoSaveCurrentDepositAvailable && !isDonationStarted) Public.autoSaveCurrentDeposit();

    if (Config.autoChangeIdColorEnabled && !Util.getCookie(Const.autoChangeIdColorCookieName)) Public.changeIdColor();

    if (Config.autoRefreshEnabled && Info.isInHomePage) Public.startAutoRefreshMode();

    if (Config.customScriptEnabled) Script.runCustomScript('end');

    let endDate = new Date();
    console.log(`【KF Online助手】加载完毕，加载耗时：${endDate - startDate}ms`);
});

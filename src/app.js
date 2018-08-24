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
import * as SelfRate from './module/SelfRate';
import * as ConfigDialog from './module/ConfigDialog';

// 版本号
const version = '12.8.5';

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
        Info.w.SelfRate = require('./module/SelfRate');
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
    if (Config.addFastNavMenuEnabled) Public.addFastNavMenu();
    Info.$userMenu.find('a[href^="login.php?action=quit"]').click(() => confirm('是否退出账号？'));
    //Public.changeNewRateTipsColor(); // 临时

    Public.handleSideBarLink();
    if (parseInt(Util.getCookie(Const.lootCompleteCookieName)) === 2) {
        $('#pdLoot').addClass('pd_rightbox1_gray');
    }
    if (Config.showChangePointsInfoEnabled) Public.addChangePointsInfoTips();
    if (Info.isInHomePage) {
        //Index.handleAtTips(); // 临时
        //Index.addSearchTypeSelectBox(); // 临时
        if (Config.smLevelUpAlertEnabled) Index.smLevelUpAlert();
        if (Config.smRankChangeAlertEnabled) Index.smRankChangeAlert();
        //if (Config.homePageThreadFastGotoLinkEnabled) Index.addThreadFastGotoLink(); // 临时
        Index.addPromoteHaloInterval();
    }
    else if (location.pathname === '/read.php') {
        if (Config.turnPageViaKeyboardEnabled) Public.turnPageViaKeyboard();
        //Read.fastGotoFloor(); // 临时
        Read.adjustThreadContentFontSize();
        Read.showAttachImageOutsideSellBox();
        if (Config.parseMediaTagEnabled) Read.parseMediaTag();
        if (Config.modifyKfOtherDomainEnabled) Read.modifyKFOtherDomainLink();
        if (Config.customMySmColor) Read.modifyMySmColor();
        if (Config.blockUselessThreadButtonsEnabled) Read.blockUselessThreadButtons();
        //if (Config.multiQuoteEnabled) Read.addMultiQuoteButton(); // 临时
        //Read.addFastGotoFloorInput(); // 临时
        //Read.addFloorGotoLink(); // 临时
        //Read.addStatAndBuyThreadBtn(); // 临时
        Read.handleBuyThreadBtn();
        Read.addCopyBuyersListOption();
        //if (Config.userMemoEnabled) Read.addUserMemo(); // 临时
        Read.addCopyCodeLink();
        Read.addMoreSmileLink();
        Post.addRedundantKeywordWarning();
        if ($('a[href$="#install-script"]').length > 0) Script.handleInstallScriptLink();
        if (Config.preventCloseWindowWhenEditPostEnabled) Post.preventCloseWindowWhenEditPost();
        if (Config.autoSavePostContentWhenSubmitEnabled) Post.savePostContentWhenSubmit();
        //SelfRate.handleGoodPostSubmit(); // 临时
    }
    else if (location.pathname === '/thread.php') {
        if (Config.highlightNewPostEnabled) Other.highlightNewPost();
        if (Config.showFastGotoThreadPageEnabled) Other.addFastGotoThreadPageLink();
    }
    else if (location.pathname === '/post.php') {
        Post.addRedundantKeywordWarning();
        if (/\bmultiquote=1/i.test(location.href)) {
            if (Config.multiQuoteEnabled) Post.handleMultiQuote(2);
        }
        else if (/\baction=quote/i.test(location.href)) {
            Post.removeUnpairedBBCodeInQuoteContent();
        }
        Post.addFillTitleBtn();
        Post.addExtraPostEditorButton();
        Post.addExtraOptionInPostPage();
        if (Config.preventCloseWindowWhenEditPostEnabled) Post.preventCloseWindowWhenEditPost();
        if (Config.autoSavePostContentWhenSubmitEnabled) Post.savePostContentWhenSubmit();
        if (Info.isInSpecialDomain) Post.addAttachChangeAlert();
    }
    else if (location.pathname === '/kf_fw_ig_mybp.php') {
        Item.init();
    }
    else if (location.pathname === '/kf_fw_ig_shop.php') {
        Item.showMyInfoInItemShop();
    }
    else if (location.pathname === '/kf_fw_ig_pklist.php') {
        Loot.addUserLinkInPkListPage();
    }
    else if (location.pathname === '/kf_fw_ig_halo.php') {
        $('.kf_fw_ig1:first').on('click', 'a[href^="kf_fw_ig_halo.php?do=buy&id="]', () => {
            if (!confirm('是否提升战力光环？')) return false;
            TmpLog.deleteValue(Const.haloInfoTmpLogName);
        });
        Loot.addUserLinkInHaloPage();
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
        if (Info.isInSpecialDomain) Other.addAvatarChangeAlert();
    }
    else if (/\/job\.php\?action=preview$/i.test(location.href)) {
        Post.modifyPostPreviewPage();
    }
    else if (location.pathname === '/search.php') {
        if (Config.turnPageViaKeyboardEnabled) Public.turnPageViaKeyboard();
    }
    else if (location.pathname === '/kf_fw_1wkfb.php') {
        if (/\/kf_fw_1wkfb\.php\?ping=(2|4|7)\b/.test(location.href)) {
            SelfRate.highlightRateErrorSize();
            if (/\/kf_fw_1wkfb\.php\?ping=2\b/.test(location.href)) {
                SelfRate.refreshWaitCheckRatePage();
            }
        }
        else if (/\/kf_fw_1wkfb\.php\?do=1\b/.test(location.href)) {
            SelfRate.addUnrecognizedSizeWarning();
            SelfRate.showErrorSizeSubmitWarning();
        }
        SelfRate.addLinksInPage();
    }
    else if (location.pathname === '/kf_no1.php') {
        Other.addUserNameLinkInRankPage();
    }
    else if (location.pathname === '/kf_fw_ig_mycard.php') {
        Card.handleMyCardPage();
    }

    if (Config.blockUserEnabled) Public.blockUsers();
    if (Config.blockThreadEnabled) Public.blockThread();
    if (Config.followUserEnabled) Public.followUsers();
    if (Info.isMobile) Public.bindElementTitleClick();
    if (Info.isInSpecialDomain) {
        if (['/read.php', '/post.php', '/message.php'].includes(location.pathname)) {
            if (Config.kfSmileEnhanceExtensionEnabled) Post.importKfSmileEnhanceExtension();
            Post.replaceSiteLink();
        }
    }

    $(document).clearQueue('AutoAction');

    if (Config.autoPromoteHaloEnabled && !Util.getCookie(Const.promoteHaloCookieName)) {
        $(document).queue('AutoAction', () => Loot.getPromoteHaloInfo());
    }
    if (location.pathname === '/kf_fw_ig_index.php') {
        $(document).queue('AutoAction', () => Loot.init());
    }

    if (!Util.getCookie(Const.lootCompleteCookieName)) {
        if (Config.autoLootEnabled) {
            if (location.pathname !== '/kf_fw_ig_index.php' && !Util.getCookie(Const.lootAttackingCookieName) &&
                !$.isNumeric(Util.getCookie(Const.changePointsInfoCookieName))
            ) {
                $(document).queue('AutoAction', () => Loot.checkLoot());
            }
        }
        else if (Config.autoSaveLootLogInSpecialCaseEnabled) {
            $(document).queue('AutoAction', () => Loot.autoSaveLootLog());
        }
    }

    if (Config.autoGetDailyBonusEnabled && !Util.getCookie(Const.getDailyBonusCookieName)) {
        $(document).queue('AutoAction', () => Public.getDailyBonus());
    }

    if ((Info.isInHomePage || location.pathname === '/kf_fw_ig_index.php') && Config.autoBuyItemEnabled &&
        !Util.getCookie(Const.buyItemCookieName) && !Util.getCookie(Const.buyItemReadyCookieName)
    ) {
        $(document).queue('AutoAction', () => Item.buyItems(Config.buyItemIdList));
    }

    if (Config.autoOpenBoxesAfterLootEnabled && TmpLog.getValue(Const.autoOpenBoxesAfterLootTmpLogName)) {
        if (/kf_fw_ig_mybp\.php\?openboxes=true/.test(location.href)) {
            TmpLog.deleteValue(Const.autoOpenBoxesAfterLootTmpLogName);
            $(document).queue('AutoAction', () => Item.autoOpenBoxes());
        }
        else {
            $(document).clearQueue('AutoAction');
            $(document).queue('AutoAction', function () {
                setTimeout(() => location.href = 'kf_fw_ig_mybp.php?openboxes=true', Const.minActionInterval);
            });
        }
    }

    $(document).dequeue('AutoAction');

    if (Config.autoChangeIdColorEnabled && !Util.getCookie(Const.autoChangeIdColorCookieName)) {
        Public.changeIdColor();
    }

    if (Config.showDrawCardTipsEnabled) {
        Card.showDrawCardTips();
    }

    if (Config.timingModeEnabled && (Info.isInHomePage || location.pathname === '/kf_fw_ig_index.php' || /kf_fw_ig_mybp\.php\?openboxes=true/.test(location.href))) {
        Public.startTimingMode();
    }

    if (Config.customScriptEnabled) Script.runCustomScript('end');

    let endDate = new Date();
    console.log(`【KF Online助手】初始化耗时：${endDate - startDate}ms`);
};

if (typeof jQuery !== 'undefined') {
    $(document).ready(init);
}

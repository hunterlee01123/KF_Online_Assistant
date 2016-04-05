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
        if (typeof options.deferLootTimeWhenRemainAttackNum !== 'undefined') {
            var attackNum = parseInt(options.deferLootTimeWhenRemainAttackNum);
            if (!isNaN(attackNum) && attackNum >= 1 && attackNum <= Const.maxAttackNum) settings.deferLootTimeWhenRemainAttackNum = attackNum;
            else settings.deferLootTimeWhenRemainAttackNum = defConfig.deferLootTimeWhenRemainAttackNum;
        }
        if (typeof options.autoLootEnabled !== 'undefined') {
            settings.autoLootEnabled = typeof options.autoLootEnabled === 'boolean' ?
                options.autoLootEnabled : defConfig.autoLootEnabled;
        }
        if (typeof options.noAutoLootWhen !== 'undefined') {
            if ($.isArray(options.noAutoLootWhen)) {
                settings.noAutoLootWhen = [];
                for (var i in options.noAutoLootWhen) {
                    var time = $.trim(options.noAutoLootWhen[i]);
                    if (/^(2[0-3]|[0-1][0-9]):[0-5][0-9]-(2[0-3]|[0-1][0-9]):[0-5][0-9]$/.test(time)) settings.noAutoLootWhen.push(time);
                }
            }
            else settings.noAutoLootWhen = defConfig.noAutoLootWhen;
        }
        if (typeof options.deferLootTimeWhenRemainAttackNumEnabled !== 'undefined') {
            settings.deferLootTimeWhenRemainAttackNumEnabled = typeof options.deferLootTimeWhenRemainAttackNumEnabled === 'boolean' ?
                options.deferLootTimeWhenRemainAttackNumEnabled : defConfig.deferLootTimeWhenRemainAttackNumEnabled;
        }

        if (typeof options.customMonsterNameEnabled !== 'undefined') {
            settings.customMonsterNameEnabled = typeof options.customMonsterNameEnabled === 'boolean' ?
                options.customMonsterNameEnabled : defConfig.customMonsterNameEnabled;
        }
        if (typeof options.customMonsterNameList !== 'undefined') {
            if ($.type(options.customMonsterNameList) === 'object') {
                settings.customMonsterNameList = {};
                for (var id in options.customMonsterNameList) {
                    id = parseInt(id);
                    var name = $.trim(options.customMonsterNameList[id]);
                    if (id >= 1 && id <= 5 && name !== '' && name.length <= 18) {
                        settings.customMonsterNameList[id] = name;
                    }
                }
            }
            else settings.customMonsterNameList = defConfig.customMonsterNameList;
        }
        if (typeof options.autoAttackEnabled !== 'undefined') {
            settings.autoAttackEnabled = typeof options.autoAttackEnabled === 'boolean' ?
                options.autoAttackEnabled : defConfig.autoAttackEnabled;
        }
        if (typeof options.attackAfterTime !== 'undefined') {
            var attackAfterTime = parseInt(options.attackAfterTime);
            if (!isNaN(attackAfterTime) && attackAfterTime >= Const.minAttackAfterTime && attackAfterTime <= Const.defLootInterval)
                settings.attackAfterTime = attackAfterTime;
            else settings.attackAfterTime = defConfig.attackAfterTime;
        }
        if (typeof options.attemptAttackEnabled !== 'undefined') {
            settings.attemptAttackEnabled = typeof options.attemptAttackEnabled === 'boolean' ?
                options.attemptAttackEnabled : defConfig.attemptAttackEnabled;
        }
        if (settings.attemptAttackEnabled && !settings.attackAfterTime) settings.attemptAttackEnabled = false;
        if (typeof options.maxAttemptAttackLifeNum !== 'undefined') {
            var maxAttemptAttackLifeNum = parseInt(options.maxAttemptAttackLifeNum);
            if (!isNaN(maxAttemptAttackLifeNum) && maxAttemptAttackLifeNum >= -1)
                settings.maxAttemptAttackLifeNum = maxAttemptAttackLifeNum;
            else settings.maxAttemptAttackLifeNum = defConfig.maxAttemptAttackLifeNum;
        }
        if (typeof options.batchAttackList !== 'undefined') {
            if ($.type(options.batchAttackList) === 'object') {
                settings.batchAttackList = {};
                var totalAttackNum = 0;
                for (var id in options.batchAttackList) {
                    var attackNum = parseInt(options.batchAttackList[id]);
                    if (!isNaN(attackNum) && attackNum > 0) {
                        settings.batchAttackList[parseInt(id)] = attackNum;
                        totalAttackNum += attackNum;
                    }
                }
                if (totalAttackNum > Const.maxAttackNum) settings.batchAttackList = defConfig.batchAttackList;
            }
            else settings.batchAttackList = defConfig.batchAttackList;
        }
        if (settings.autoAttackEnabled && (!settings.batchAttackList || $.isEmptyObject(settings.batchAttackList)))
            settings.autoAttackEnabled = false;
        if (typeof options.deadlyAttackId !== 'undefined') {
            var deadlyAttackId = parseInt(options.deadlyAttackId);
            if (!isNaN(deadlyAttackId) && deadlyAttackId >= 0 && deadlyAttackId <= 5) settings.deadlyAttackId = deadlyAttackId;
            else settings.deadlyAttackId = defConfig.deadlyAttackId;
        }
        if (typeof options.autoUseItemEnabled !== 'undefined') {
            settings.autoUseItemEnabled = typeof options.autoUseItemEnabled === 'boolean' ?
                options.autoUseItemEnabled : defConfig.autoUseItemEnabled;
        }
        if (typeof options.autoUseItemNames !== 'undefined') {
            var autoUseItemNames = options.autoUseItemNames;
            var allowTypes = ['被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画',
                '十六夜同人漫画', '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药'];
            if ($.isArray(autoUseItemNames)) {
                settings.autoUseItemNames = [];
                for (var i in autoUseItemNames) {
                    if ($.inArray(autoUseItemNames[i], allowTypes) > -1) {
                        settings.autoUseItemNames.push(autoUseItemNames[i]);
                    }
                }
            }
            else settings.autoUseItemNames = defConfig.autoUseItemNames;
        }

        if (typeof options.autoDrawSmbox2Enabled !== 'undefined') {
            settings.autoDrawSmbox2Enabled = typeof options.autoDrawSmbox2Enabled === 'boolean' ?
                options.autoDrawSmbox2Enabled : defConfig.autoDrawSmbox2Enabled;
        }
        if (settings.autoDrawSmbox2Enabled && settings.autoLootEnabled) settings.autoDrawSmbox2Enabled = false;
        if (typeof options.favorSmboxNumbers !== 'undefined') {
            if ($.isArray(options.favorSmboxNumbers)) {
                settings.favorSmboxNumbers = [];
                for (var i in options.favorSmboxNumbers) {
                    var num = parseInt(options.favorSmboxNumbers[i]);
                    if (num >= 1 && num <= 400) settings.favorSmboxNumbers.push(num);
                }
            }
            else settings.favorSmboxNumbers = defConfig.favorSmboxNumbers;
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
        if (typeof options.perPageFloorNum !== 'undefined') {
            var perPageFloorNum = parseInt(options.perPageFloorNum);
            if ($.inArray(perPageFloorNum, [10, 20, 30]) > -1)
                settings.perPageFloorNum = perPageFloorNum;
            else settings.perPageFloorNum = defConfig.perPageFloorNum;
        }
        if (typeof options.highlightNewPostEnabled !== 'undefined') {
            settings.highlightNewPostEnabled = typeof options.highlightNewPostEnabled === 'boolean' ?
                options.highlightNewPostEnabled : defConfig.highlightNewPostEnabled;
        }

        if (typeof options.adjustThreadContentWidthEnabled !== 'undefined') {
            settings.adjustThreadContentWidthEnabled = typeof options.adjustThreadContentWidthEnabled === 'boolean' ?
                options.adjustThreadContentWidthEnabled : defConfig.adjustThreadContentWidthEnabled;
        }
        if (typeof options.threadContentFontSize !== 'undefined') {
            var threadContentFontSize = parseInt(options.threadContentFontSize);
            if (threadContentFontSize > 0) settings.threadContentFontSize = threadContentFontSize;
            else settings.threadContentFontSize = defConfig.threadContentFontSize;
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
        if (typeof options.showLogLinkInPageEnabled !== 'undefined') {
            settings.showLogLinkInPageEnabled = typeof options.showLogLinkInPageEnabled === 'boolean' ?
                options.showLogLinkInPageEnabled : defConfig.showLogLinkInPageEnabled;
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
        if (typeof options.browseType !== 'undefined') {
            if ($.inArray(options.browseType.toLowerCase(), ['auto', 'desktop', 'mobile']) > -1)
                settings.browseType = options.browseType.toLowerCase();
            else settings.browseType = defConfig.options.browseType;
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
                        var userNameList = [];
                        if ($.isArray(obj.userName)) {
                            for (var j in obj.userName) {
                                var userName = $.trim(obj.userName[j]);
                                if (userName) userNameList.push(userName);
                            }
                        }
                        if (userNameList.length > 0) newObj.userName = userNameList;
                        var includeFid = [], excludeFid = [];
                        if ($.isArray(obj.includeFid)) {
                            for (var j in obj.includeFid) {
                                var fid = parseInt(obj.includeFid[j]);
                                if (!isNaN(fid) && fid > 0) includeFid.push(fid);
                            }
                        }
                        else if ($.isArray(obj.excludeFid)) {
                            for (var j in obj.excludeFid) {
                                var fid = parseInt(obj.excludeFid[j]);
                                if (!isNaN(fid) && fid > 0) excludeFid.push(fid);
                            }
                        }
                        if (includeFid.length > 0) newObj.includeFid = includeFid;
                        else if (excludeFid.length > 0) newObj.excludeFid = excludeFid;
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
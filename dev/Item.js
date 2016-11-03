/**
 * 道具类
 */
var Item = {
    /**
     * 获得转换指定等级道具可获得的能量点
     * @param {number} itemLevel 道具等级
     * @returns {number} 能量点
     */
    getGainEnergyNumByItemLevel: function (itemLevel) {
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
    },

    /**
     * 获得恢复指定等级道具所需的能量点
     * @param {number} itemLevel 道具等级
     * @returns {number} 能量点
     */
    getRestoreEnergyNumByItemLevel: function (itemLevel) {
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
    },

    /**
     * 获取指定等级道具的出售所得
     * @param {number} itemLevel 道具等级
     * @returns {number} 出售所得
     */
    getSellItemGainByItemLevel: function (itemLevel) {
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
    },

    /**
     * 获取指定名称的道具种类ID
     * @param {string} itemName 道具名称
     * @returns {number} 道具种类ID
     */
    getItemTypeIdByItemName: function (itemName) {
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
    },

    /**
     * 获取指定名称的道具等级
     * @param {string} itemName 道具名称
     * @returns {number} 道具等级
     */
    getItemLevelByItemName: function (itemName) {
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
    },

    /**
     * 获取指定名称的道具使用上限个数
     * @param {string} itemName 道具名称
     * @returns {number} 道具的使用上限个数
     */
    getItemMaxUsedNumByItemName: function (itemName) {
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
    },

    /**
     * 从使用道具的回应消息中获取积分数据
     * @param {string} response 使用道具的回应消息
     * @param {number} itemTypeId 道具种类ID
     * @returns {Object|number} 积分对象，-1表示使用失败
     */
    getCreditsViaResponse: function (response, itemTypeId) {
        if (/(错误的物品编号|无法再使用|该道具已经被使用)/.test(response)) {
            return -1;
        }
        if (itemTypeId >= 7 && itemTypeId <= 12) {
            if (/成功！/.test(response)) return {'效果': 1};
        }
        else {
            var matches = null;
            matches = /恢复能量增加了\s*(\d+)\s*点/i.exec(response);
            if (matches) return {'能量': parseInt(matches[1])};
            matches = /(\d+)KFB/i.exec(response);
            if (matches) return {'KFB': parseInt(matches[1])};
            matches = /(\d+)点?贡献/i.exec(response);
            if (matches) return {'贡献': parseInt(matches[1])};
            matches = /贡献\+(\d+)/i.exec(response);
            if (matches) return {'贡献': parseInt(matches[1])};
        }
        return {};
    },

    /**
     * 获取本种类指定数量的道具ID列表
     * @param {string} html 道具列表页面的HTML代码
     * @param {number} [num] 指定道具数量（留空表示获取当前所有道具）
     * @returns {number[]} 道具ID列表
     */
    getItemIdList: function (html, num) {
        var itemIdList = [];
        var matches = html.match(/kf_fw_ig_my\.php\?pro=\d+/gi);
        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                if (num && i + 1 > num) break;
                var itemIdMatches = /pro=(\d+)/i.exec(matches[i]);
                if (itemIdMatches) itemIdList.push(parseInt(itemIdMatches[1]));
            }
        }
        return itemIdList;
    },

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
    useItems: function (options, cycle) {
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
                console.log('循环使用道具Start，使用道具数量：{0}，有效道具使用次数上限：{1}，恢复道具成功次数上限：{2}'
                    .replace('{0}', cycle.itemNum)
                    .replace('{1}', cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制')
                    .replace('{2}', cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制')
                );
                $('.kf_fw_ig1:last').parent().append(
                    ('<ul class="pd_result"><li class="pd_stat"><strong>对<em>{0}</em>个【Lv.{1}：{2}】道具的循环使用开始（当前道具恢复能量<em>{3}</em>点）<br />' +
                    '（有效道具使用次数上限：<em>{4}</em>，恢复道具成功次数上限：<em>{5}</em>）</strong></li></ul>')
                        .replace('{0}', cycle.itemNum)
                        .replace('{1}', settings.itemLevel)
                        .replace('{2}', settings.itemName)
                        .replace('{3}', cycle.totalEnergyNum)
                        .replace('{4}', cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制')
                        .replace('{5}', cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制')
                );
            }
            else {
                $('.pd_result:last').append('<div class="pd_result_sep"></div>');
            }
            $('.pd_result:last').append('<li class="pd_stat" style="color:#FF3399"><strong>第{0}轮循环开始：</strong></li>'.replace('{0}', cycle.round));
        }
        if (cycle) {
            $('.pd_result:last').append('<li><strong>使用结果：</strong></li>');
        }
        else {
            $('.kf_fw_ig1:last').parent().append(
                '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】使用结果：</strong></li></ul>'
                    .replace('{0}', settings.itemLevel)
                    .replace('{1}', settings.itemName)
            );
        }

        var successNum = 0, failNum = 0;
        var stat = {'有效道具': 0, '无效道具': 0};
        var nextRoundItemIdList = [];
        var isStop = false;
        $(document).clearQueue('UseItems');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('UseItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_doit.php?id={0}&t={1}'.replace('{0}', itemId).replace('{1}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('使用道具', html);
                        var matches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                        if (matches && !/(错误的物品编号|无法再使用|该道具已经被使用)/.test(html)) {
                            successNum++;
                            nextRoundItemIdList.push(itemId);
                            var credits = Item.getCreditsViaResponse(matches[1], settings.itemTypeId);
                            if (credits !== -1) {
                                if ($.isEmptyObject(credits)) stat['无效道具']++;
                                else stat['有效道具']++;
                                if (settings.itemTypeId <= 6) {
                                    $.each(credits, function (key, credit) {
                                        if (typeof stat[key] === 'undefined')
                                            stat[key] = credit;
                                        else
                                            stat[key] += credit;
                                    });
                                }
                            }
                        }
                        else {
                            failNum++;
                            if (/无法再使用/.test(html)) nextRoundItemIdList = [];
                        }
                        $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'
                            .replace('{0}', index + 1)
                            .replace('{1}', matches ? matches[1] : '未能获得预期的回应')
                        );
                        if (cycle && cycle.maxEffectiveItemCount && cycle.stat['有效道具'] + stat['有效道具'] >= cycle.maxEffectiveItemCount) {
                            isStop = true;
                            console.log('有效道具使用次数到达设定上限，循环使用操作停止');
                            $('.pd_result:last').append('<li><span class="pd_notice">（有效道具使用次数到达设定上限，循环操作中止）</span></li>');
                        }
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) {
                            $(document).clearQueue('UseItems');
                            if (settings.isTypeBatch) $(document).clearQueue('UseItemTypes');
                        }

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (stat['有效道具'] === 0) delete stat['有效道具'];
                            if (stat['无效道具'] === 0) delete stat['无效道具'];
                            if (!cycle && successNum > 0) {
                                Log.push('使用道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具被使用'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {
                                        gain: $.extend({}, stat, {'已使用道具': successNum}),
                                        pay: {'道具': -successNum}
                                    }
                                );
                            }
                            var logStat = '', msgStat = '', resultStat = '';
                            for (var creditsType in stat) {
                                logStat += '，{0}+{1}'
                                    .replace('{0}', creditsType)
                                    .replace('{1}', stat[creditsType]);
                                msgStat += '<i>{0}<em>+{1}</em></i>'
                                    .replace('{0}', creditsType)
                                    .replace('{1}', stat[creditsType]);
                                resultStat += '<i>{0}<em>+{1}</em></i> '
                                    .replace('{0}', creditsType)
                                    .replace('{1}', stat[creditsType]);
                                if (cycle) {
                                    if (typeof cycle.stat[creditsType] === 'undefined') cycle.stat[creditsType] = stat[creditsType];
                                    else cycle.stat[creditsType] += stat[creditsType];
                                }
                            }
                            console.log('共有{0}个道具被使用{1}{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有{0}个道具未能使用'.replace('{0}', failNum) : '')
                                .replace('{2}', logStat)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具被使用{1}</strong>{2}'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具未能使用'.replace('{0}', failNum) : '')
                                    .replace('{2}', msgStat)
                                , -1);
                            if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                            $('.pd_result:last').append(
                                '<li class="pd_stat"><b>统计结果（共有<em>{0}</em>个道具被使用）：</b><br />{1}</li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', resultStat)
                            );

                            if (settings.type === 2) {
                                $('.kf_fw_ig1 input[type="checkbox"]:checked')
                                    .closest('tr')
                                    .fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                            }
                            else {
                                Item.setCurrentItemUsableAndUsedNum(settings.$itemLine, successNum, -successNum);
                                Item.showItemUsedInfo(settings.$itemLine.closest('tbody').find('tr:gt(1) > td:nth-child(2) > a'));
                            }
                            if (settings.itemName === '零时迷子的碎片') Item.showCurrentUsedItemNum();

                            if (cycle) {
                                settings.itemIdList = nextRoundItemIdList;
                                if (settings.itemIdList.length === 0) isStop = true;
                                cycle.countStat['被使用次数'] += successNum;
                                cycle.stat['道具'] -= successNum;
                                cycle.stat['已使用道具'] += successNum;
                                Item.cycleUseItems(isStop ? 0 : 2, settings, cycle);
                            }
                            else if (settings.isTypeBatch) {
                                $(document).dequeue('UseItemTypes');
                            }
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('UseItems');
                            }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('UseItems');
    },

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
    restoreItems: function (options, cycle) {
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
        }
        else {
            $('.kf_fw_ig1:last').parent().append(
                '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】恢复结果：</strong></li></ul>'
                    .replace('{0}', settings.itemLevel)
                    .replace('{1}', settings.itemName)
            );
        }

        var successNum = 0, failNum = 0, successEnergyNum = 0;
        var perEnergyNum = Item.getRestoreEnergyNumByItemLevel(settings.itemLevel);
        var isStop = false;
        var nextRoundItemIdList = [];
        $(document).clearQueue('RestoreItems');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('RestoreItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_doit.php?renew={0}&id={1}&t={2}'.replace('{0}', settings.safeId).replace('{1}', itemId).replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('恢复道具', html);
                        var msg = '';
                        var matches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                        if (matches) {
                            if (/该道具已经被恢复/.test(html)) {
                                msg = '该道具已经被恢复';
                                successNum++;
                                successEnergyNum += perEnergyNum;
                                nextRoundItemIdList.push(itemId);
                                if (cycle && cycle.maxSuccessRestoreItemCount && cycle.countStat['恢复成功次数'] + successNum >= cycle.maxSuccessRestoreItemCount) {
                                    isStop = true;
                                    msg += '<span class="pd_notice">（恢复道具成功次数已达到设定上限，恢复操作中止）</span>';
                                }
                            }
                            else if (/恢复失败/.test(html)) {
                                msg = '该道具恢复失败';
                                failNum++;
                            }
                            else if (/你的能量不足以恢复本道具/.test(html)) {
                                isStop = true;
                                msg = '你的能量不足以恢复本道具<span class="pd_notice">（恢复操作中止）</span>';
                            }
                            else {
                                msg = matches[1];
                            }
                        }
                        else {
                            msg = '未能获得预期的回应';
                        }
                        $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'
                            .replace('{0}', index + 1)
                            .replace('{1}', msg)
                        );
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('RestoreItems');

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (!cycle && (successNum > 0 || failNum > 0)) {
                                Log.push('恢复道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具恢复成功，共有`{3}`个道具恢复失败'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName)
                                        .replace('{3}', failNum),
                                    {
                                        gain: {'道具': successNum},
                                        pay: {'已使用道具': -(successNum + failNum), '能量': -successEnergyNum}
                                    }
                                );
                            }
                            console.log('共有{0}个道具恢复成功，共有{1}个道具恢复失败，能量-{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', successEnergyNum)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具恢复成功，共有<em>{1}</em>个道具恢复失败</strong><i>能量<ins>-{2}</ins></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum)
                                    .replace('{2}', successEnergyNum)
                                , -1);
                            $('.pd_result:last').append(
                                '<li class="pd_stat">共有<em>{0}</em>个道具恢复成功，共有<em>{1}</em>个道具恢复失败，<i>能量<ins>-{2}</ins></i></li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum)
                                    .replace('{2}', successEnergyNum)
                            );

                            if (settings.type === 2) {
                                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                    .closest('tr')
                                    .fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                            }
                            Item.setCurrentItemUsableAndUsedNum(settings.$itemLine, -(successNum + failNum), successNum, -successEnergyNum);

                            if (cycle) {
                                settings.itemIdList = nextRoundItemIdList;
                                if (settings.itemIdList.length === 0) isStop = true;
                                if (!isStop) cycle.round++;
                                cycle.totalEnergyNum -= successEnergyNum;
                                cycle.countStat['恢复成功次数'] += successNum;
                                cycle.countStat['恢复失败次数'] += failNum;
                                cycle.stat['能量'] -= successEnergyNum;
                                cycle.stat['道具'] += successNum;
                                cycle.stat['已使用道具'] -= successNum + failNum;
                                Item.cycleUseItems(isStop ? 0 : 1, settings, cycle);
                            }
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('RestoreItems');
                            }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('RestoreItems');
    },

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
    cycleUseItems: function (type, options, cycle) {
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

        if ($('.pd_pop_tips').length >= 5) {
            KFOL.removePopTips($('.pd_pop_tips:first'));
        }

        var showResult = function (type, stat) {
            var resultStat = '';
            for (var key in stat) {
                if (type > 0 && (key === '道具' || key === '已使用道具')) continue;
                resultStat += '<i>{0}{1}</i> '.replace('{0}', key).replace('{1}', Tools.getStatFormatNumber(cycle.stat[key]));
            }
            $('.pd_result:last').append(
                ('<li class="pd_result_sep{0}"></li>' +
                '<li class="pd_stat"><strong>{1}（当前道具恢复能量<em>{2}</em>点）：</strong></li>' +
                '<li class="pd_stat">{3}<i>被使用次数<em>+{4}</em></i> <i>恢复成功次数<em>+{5}</em></i> <i>恢复失败次数<em>+{6}</em></i></li>' +
                '<li class="pd_stat">{7}</li>')
                    .replace('{0}', type > 0 ? '_inner' : '')
                    .replace('{1}', type > 0 ? '截至目前为止的统计' :
                        '【Lv.{0}：{1}】循环使用最终统计'.replace('{0}', options.itemLevel).replace('{1}', options.itemName)
                    )
                    .replace('{2}', cycle.totalEnergyNum)
                    .replace('{3}', type > 0 ? '' :
                        '共进行了<em>{0}</em>轮循环：'.replace('{0}', cycle.round)
                    )
                    .replace('{4}', cycle.countStat['被使用次数'])
                    .replace('{5}', cycle.countStat['恢复成功次数'])
                    .replace('{6}', cycle.countStat['恢复失败次数'])
                    .replace('{7}', resultStat)
            );
        };

        if (type === 1) {
            showResult(type, cycle.stat);
            KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', options.itemIdList.length)
                , true);
            setTimeout(function () {
                Item.useItems(options, cycle);
            }, cycle.round === 1 ? 500 : typeof Const.cycleUseItemsFirstAjaxInterval === 'function' ? Const.cycleUseItemsFirstAjaxInterval() : Const.cycleUseItemsFirstAjaxInterval);
        }
        else if (type === 2) {
            KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', options.itemIdList.length)
                , true);
            setTimeout(function () {
                Item.restoreItems(options, cycle);
            }, typeof Const.cycleUseItemsFirstAjaxInterval === 'function' ? Const.cycleUseItemsFirstAjaxInterval() : Const.cycleUseItemsFirstAjaxInterval);
        }
        else {
            if (cycle.stat['道具'] === 0) delete cycle.stat['道具'];
            if (cycle.stat['已使用道具'] === 0) delete cycle.stat['已使用道具'];
            if (cycle.stat['有效道具'] === 0) delete cycle.stat['有效道具'];
            if (cycle.stat['无效道具'] === 0) delete cycle.stat['无效道具'];
            var gain = {}, pay = {};
            for (var key in cycle.stat) {
                if (cycle.stat[key] > 0) gain[key] = cycle.stat[key];
                else pay[key] = cycle.stat[key];
            }

            if (cycle.countStat['被使用次数'] > 0) {
                Log.push('循环使用道具',
                    '对`{0}`个【`Lv.{1}：{2}`】道具进行了`{3}`轮循环使用(被使用次数`+{4}`，恢复成功次数`+{5}`，恢复失败次数`+{6}`)'
                        .replace('{0}', cycle.itemNum)
                        .replace('{1}', options.itemLevel)
                        .replace('{2}', options.itemName)
                        .replace('{3}', cycle.round)
                        .replace('{4}', cycle.countStat['被使用次数'])
                        .replace('{5}', cycle.countStat['恢复成功次数'])
                        .replace('{6}', cycle.countStat['恢复失败次数']),
                    {gain: gain, pay: pay}
                );
            }

            console.log('共进行了{0}轮循环，被使用次数+{1}，恢复成功次数+{2}，恢复失败次数+{3}，能量{4}'
                .replace('{0}', cycle.round)
                .replace('{1}', cycle.countStat['被使用次数'])
                .replace('{2}', cycle.countStat['恢复成功次数'])
                .replace('{3}', cycle.countStat['恢复失败次数'])
                .replace('{4}', cycle.stat['能量'])
            );
            var $tips = KFOL.showMsg(
                ('<strong>共进行了<em>{0}</em>轮循环</strong><i>被使用次数<em>+{1}</em></i><i>恢复成功次数<em>+{2}</em></i>' +
                '<i>恢复失败次数<em>+{3}</em></i><i>能量<ins>{4}</ins></i><a href="#">清除消息框</a>')
                    .replace('{0}', cycle.round)
                    .replace('{1}', cycle.countStat['被使用次数'])
                    .replace('{2}', cycle.countStat['恢复成功次数'])
                    .replace('{3}', cycle.countStat['恢复失败次数'])
                    .replace('{4}', cycle.stat['能量'])
                , -1);
            $tips.find('a').click(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
            });
            showResult(type, cycle.stat);
        }
    },

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
    convertItemsToEnergy: function (options) {
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
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】转换结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );

        var successNum = 0, failNum = 0;
        var energyNum = Item.getGainEnergyNumByItemLevel(settings.itemLevel);
        $(document).clearQueue('ConvertItemsToEnergy');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('ConvertItemsToEnergy', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_doit.php?tomp={0}&id={1}&t={2}'.replace('{0}', settings.safeId).replace('{1}', itemId).replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('将道具转换为能量', html);
                        if (/转换为了\s*\d+\s*点能量/i.test(html)) {
                            successNum++;
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
                        if (isStop) {
                            $(document).clearQueue('ConvertItemsToEnergy');
                            if (settings.isTypeBatch) $(document).clearQueue('ConvertItemTypesToEnergy');
                        }

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            var successEnergyNum = successNum * energyNum;
                            if (successNum > 0) {
                                Log.push('将道具转换为能量',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具成功转换为能量'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {gain: {'能量': successEnergyNum}, pay: {'已使用道具': -successNum}}
                                );
                            }
                            console.log('共有{0}个道具成功转换为能量{1}，能量+{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有{0}个道具转换失败'.replace('{0}', failNum) : '')
                                .replace('{2}', successEnergyNum)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具成功转换为能量{1}</strong><i>能量<em>+{2}</em></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具转换失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', successEnergyNum)
                                , -1);
                            $('.pd_result:last').append(
                                '<li class="pd_stat">共有<em>{0}</em>个道具成功转换为能量{1}，<i>能量<em>+{2}</em></i></li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具转换失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', successEnergyNum)
                            );

                            if (settings.type === 2) {
                                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                    .closest('tr')
                                    .fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                            }
                            Item.setCurrentItemUsableAndUsedNum(settings.$itemLine, -successNum, null, successEnergyNum);
                            if (settings.isTypeBatch) $(document).dequeue('ConvertItemTypesToEnergy');
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('ConvertItemsToEnergy');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('ConvertItemsToEnergy');
    },

    /**
     * 出售指定的一系列道具
     * @param {{}} options 设置项
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     */
    sellItems: function (options) {
        var settings = {
            itemIdList: [],
            itemLevel: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】出售结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );

        var successNum = 0, failNum = 0, totalGain = 0;
        $(document).clearQueue('SellItems');
        $.each(settings.itemIdList, function (index, itemId) {
            $(document).queue('SellItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_shop.php?sell=yes&id={0}&t={1}'.replace('{0}', itemId).replace('{1}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('出售道具', html);
                        if (/出售成功/.test(html)) {
                            successNum++;
                            totalGain += Item.getSellItemGainByItemLevel(settings.itemLevel);
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
                        if (isStop) $(document).clearQueue('SellItems');

                        if (isStop || index === settings.itemIdList.length - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('出售道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具出售成功'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {
                                        gain: {'KFB': totalGain},
                                        pay: {'道具': -successNum}
                                    }
                                );
                            }
                            $('.kf_fw_ig1 input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
                                    $(this).remove();
                                });
                            console.log('共有{0}个道具出售成功，共有{1}个道具出售失败，KFB+{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', totalGain)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个道具出售成功{1}</strong><i>KFB<em>+{2}</em></i>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具出售失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', totalGain)
                                , -1);
                            $('.pd_result:last').append(
                                '<li class="pd_stat">共有<em>{0}</em>个道具出售成功{1}，<i>KFB<em>+{2}</em></i></li>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具出售失败'.replace('{0}', failNum) : '')
                                    .replace('{2}', totalGain)
                            );
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('SellItems');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('SellItems');
    },

    /**
     * 在道具列表页面上添加批量出售和使用道具的按钮
     */
    addSellAndUseItemsButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        var $lastLine = $('.kf_fw_ig1 > tbody > tr:last-child');
        var itemName = $lastLine.find('td:first-child').text();
        if (!itemName) return;
        var matches = /(\d+)级道具/.exec($lastLine.find('td:nth-child(2)').text());
        if (!matches) return;
        var itemLevel = parseInt(matches[1]);
        var itemTypeId = parseInt(Tools.getUrlParam('lv'));
        if (!itemTypeId) return;
        $('.kf_fw_ig1 > tbody > tr > td:last-child').each(function () {
            var matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
            if (!matches) return;
            $(this).css('width', '163')
                .parent()
                .append('<td style="width:20px;padding-right:5px"><input class="pd_input" type="checkbox" value="{0}" /></td>'
                    .replace('{0}', matches[1])
                );
        });
        $('.kf_fw_ig1 > tbody > tr:lt(2)').find('td').attr('colspan', 5);
        $('<div class="pd_item_btns"><button title="批量使用指定道具">使用道具</button><button>全选</button><button>反选</button></div>')
            .insertAfter('.kf_fw_ig1')
            .find('button:first-child')
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!confirm('共选择了{0}个道具，是否批量使用道具？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.useItems({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName
                });
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1 input[type="checkbox"]').prop('checked', true);
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1 input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            });
        if (itemTypeId > 1) {
            $('<button style="color:#00F" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</button>').prependTo('.pd_item_btns').click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                var value = prompt(
                    '你要循环使用多少个道具？\n（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[上限设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）'
                    , itemIdList.length);
                if (value === null) return;
                value = $.trim(value);
                if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                    alert('格式不正确');
                    return;
                }
                var arr = value.split('|');
                var num = 0, maxEffectiveItemCount = 0, maxSuccessRestoreItemCount = 0;
                num = parseInt(arr[0]);
                if (!num) return;
                if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
                if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
                KFOL.removePopTips($('.pd_pop_tips'));

                if (num > itemIdList.length) num = itemIdList.length;
                var tmpItemIdList = [];
                for (var i = 0; i < num; i++) {
                    tmpItemIdList.push(itemIdList[i]);
                }
                itemIdList = tmpItemIdList;
                KFOL.showWaitMsg('正在获取当前道具相关信息，请稍后...', true);
                $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var totalEnergyNum = Item.getCurrentEnergyNum(html);
                    Item.showCurrentUsedItemNum(html);
                    Item.cycleUseItems(1, {
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
                }, 'html');
            });
        }
        if (itemTypeId >= 7 && itemTypeId <= 12) {
            $('<button style="color:#F00" title="批量出售指定道具">出售道具</button>').prependTo('.pd_item_btns').click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!confirm('共选择了{0}个道具，是否批量出售道具？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在出售道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.sellItems({
                    itemIdList: itemIdList,
                    itemLevel: itemLevel,
                    itemName: itemName
                });
            });
        }
        Item.showCurrentUsedItemNum();
    },

    /**
     * 在已使用道具列表页面上添加批量转换能量和恢复道具的按钮
     */
    addConvertEnergyAndRestoreItemsButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        var $lastLine = $('.kf_fw_ig1:eq(1) > tbody > tr:last-child');
        var itemName = $lastLine.find('td:first-child').text();
        if (!itemName) return;
        var matches = /(\d+)级道具/.exec($lastLine.find('td:nth-child(2)').text());
        if (!matches) return;
        var itemLevel = parseInt(matches[1]);
        var itemTypeId = parseInt(Tools.getUrlParam('lv'));
        if (!itemTypeId) return;
        $('.kf_fw_ig1:eq(1) > tbody > tr > td:last-child').each(function () {
            var matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
            if (!matches) return;
            $(this).css('width', '500')
                .parent()
                .append('<td style="width:20px;padding-right:5px"><input class="pd_input" type="checkbox" value="{0}" /></td>'
                    .replace('{0}', matches[1])
                );
        });
        $('<div class="pd_item_btns"><button class="pd_highlight" title="批量将指定道具转换为能量">转换能量</button>' +
            '<button title="批量恢复指定道具">恢复道具</button><button>全选</button><button>反选</button></div>')
            .insertAfter('.kf_fw_ig1:eq(1)')
            .find('button:first-child')
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!confirm('共选择了{0}个道具，是否转换为能量？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.convertItemsToEnergy({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemName: itemName
                });
            })
            .next()
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                var totalRequiredEnergyNum = itemIdList.length * Item.getRestoreEnergyNumByItemLevel(itemLevel);
                if (!confirm('共选择了{0}个道具，共需要{1}点恢复能量，是否恢复道具？'
                        .replace('{0}', itemIdList.length)
                        .replace('{1}', totalRequiredEnergyNum)
                    )
                ) return;
                var totalEnergyNum = parseInt($('.kf_fw_ig1 td:contains("道具恢复能量")').find('span').text());
                if (!totalEnergyNum || totalEnergyNum < totalRequiredEnergyNum) {
                    alert('所需恢复能量不足');
                    return;
                }
                KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                        .replace('{0}', itemIdList.length)
                    , true);
                Item.restoreItems({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName
                });
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]').prop('checked', true);
            })
            .next()
            .click(function () {
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            });
    },

    /**
     * 在道具恢复页面上添加批量转换道具为能量和批量恢复道具的链接
     */
    addBatchConvertEnergyAndRestoreItemsLink: function () {
        var $myItems = $('.kf_fw_ig1:last');
        $myItems.find('tbody > tr').each(function (index) {
            var $this = $(this);
            if (index === 0) {
                $this.find('td').attr('colspan', 6);
            }
            else if (index === 1) {
                $this.find('td:nth-child(2)').attr('width', 200)
                    .next('td').attr('width', 100).wrapInner('<span class="pd_used_num pd_custom_tips" style="color:#000"></span>')
                    .next('td').attr('width', 130).text('批量恢复')
                    .next('td').attr('width', 160)
                    .before('<td width="160">批量转换</td>');
            }
            else {
                $this.find('td:nth-child(3)')
                    .wrapInner('<span class="pd_used_num pd_custom_tips"></span>')
                    .end()
                    .find('td:nth-child(4)')
                    .html('<a class="pd_items_batch_restore {0}" href="#" title="批量恢复指定数量的道具">批量恢复道具</a>'
                        .replace('{0}', index === 2 ? 'pd_disabled_link' : '')
                    )
                    .after('<td><a class="pd_items_batch_convert pd_highlight {0}" href="#" title="批量将指定数量的道具转换为能量">批量转换道具为能量</a></td>'
                        .replace('{0}', index === 2 ? 'pd_disabled_link' : '')
                    );
                var matches = /lv=(\d+)/i.exec($this.find('td:last-child').find('a').attr('href'));
                if (matches) $this.data('itemTypeId', parseInt(matches[1]));
            }
        });
        Item.bindItemActionLinksClick($myItems);

        var $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showUsedItemEnergyTips();
    },

    /**
     * 添加批量使用和转换指定种类的道具的按钮
     */
    addBatchUseAndConvertItemTypesButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        $('<div class="pd_item_btns"><button title="批量使用指定种类的道具" data-action="useItemTypes">批量使用</button>' +
            '<button class="pd_highlight" title="批量将指定种类的道具转换为能量" data-action="convertItemTypes">批量转换</button>' +
            '<button data-action="selectAll">全选</button><button data-action="selectInverse">反选</button></div>')
            .insertAfter('.pd_my_items')
            .on('click', 'button', function () {
                var action = $(this).data('action');
                if (action === 'useItemTypes' || action === 'convertItemTypes') {
                    var itemTypeList = [];
                    $('.pd_item_type_chk:checked').each(function () {
                        var $itemLine = $(this).closest('tr'),
                            itemLevel = parseInt($itemLine.find('td:first-child').text()),
                            itemTypeId = parseInt($itemLine.data('itemTypeId')),
                            itemName = $itemLine.find('td:nth-child(2) > a').text();
                        if (isNaN(itemTypeId) || itemTypeId <= 0) return;
                        if (action === 'convertItemTypes' && itemTypeId === 1) return;
                        var itemListUrl = $itemLine.find('td:last-child')
                                .find(action === 'useItemTypes' ? 'a:first-child' : 'a:last-child')
                                .attr('href') + '&t=' + new Date().getTime();
                        itemTypeList.push({
                            itemTypeId: itemTypeId,
                            itemLevel: itemLevel,
                            itemName: itemName,
                            $itemLine: $itemLine,
                            itemListUrl: itemListUrl
                        });
                    });
                    if (!itemTypeList.length) return;
                    var num = parseInt(prompt('在指定种类道具中你要' + (action === 'useItemTypes' ? '使用' : '转换') + '多少个道具？（0表示不限制）', 0));
                    if (isNaN(num) || num < 0) return;
                    KFOL.removePopTips($('.pd_pop_tips'));

                    var queueName = action === 'useItemTypes' ? 'UseItemTypes' : 'ConvertItemTypesToEnergy';
                    $(document).clearQueue(queueName);
                    $.each(itemTypeList, function (index, data) {
                        $(document).queue(queueName, function () {
                            var $tips = KFOL.showWaitMsg('正在获取本种类' + (action === 'useItemTypes' ? '未' : '已') + '使用道具列表，请稍后...', true);
                            $.ajax({
                                type: 'GET',
                                url: data.itemListUrl,
                                timeout: Const.defAjaxTimeout,
                                success: function (html) {
                                    KFOL.removePopTips($tips);
                                    var itemIdList = Item.getItemIdList(html, num);
                                    if (!itemIdList.length) {
                                        $(document).dequeue(queueName);
                                        return;
                                    }

                                    if (action === 'useItemTypes') {
                                        console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                                        KFOL.showWaitMsg(
                                            '<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                                                .replace('{0}', itemIdList.length)
                                            , true);
                                        Item.useItems({
                                            type: 1,
                                            itemIdList: itemIdList,
                                            safeId: safeId,
                                            itemLevel: data.itemLevel,
                                            itemTypeId: data.itemTypeId,
                                            itemName: data.itemName,
                                            $itemLine: data.$itemLine,
                                            isTypeBatch: true
                                        });
                                    }
                                    else {
                                        console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                                        KFOL.showWaitMsg(
                                            '<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                                                .replace('{0}', itemIdList.length)
                                            , true);
                                        Item.convertItemsToEnergy({
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
                                error: function () {
                                    KFOL.removePopTips($tips);
                                    $(document).dequeue(queueName);
                                }
                            });
                        });
                    });
                    $(document).dequeue(queueName);
                }
                else if (action === 'selectAll') {
                    $('.pd_item_type_chk').prop('checked', true);
                }
                else if (action === 'selectInverse') {
                    $('.pd_item_type_chk').each(function () {
                        $(this).prop('checked', !$(this).prop('checked'));
                    });
                }
            });
    },

    /**
     * 为我的道具页面中的道具操作链接绑定点击事件
     * @param {jQuery} $element 要绑定的容器元素
     */
    bindItemActionLinksClick: function ($element) {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        $element.on('click', 'a[href="#"]', function (e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.is('.pd_disabled_link')) return;
            var $itemLine = $this.closest('tr'),
                itemLevel = parseInt($itemLine.find('td:first-child').text()),
                itemTypeId = parseInt($itemLine.data('itemTypeId')),
                itemName = $itemLine.find('td:nth-child(2) > a').text(),
                itemUsableNum = parseInt($itemLine.find('td:nth-child(3) > .pd_usable_num').text()),
                itemUsedNum = parseInt($itemLine.find('td:nth-child(3) > .pd_used_num').text()),
                itemListUrl = '';
            if (isNaN(itemTypeId) || itemTypeId <= 0) return;

            if ($this.is('.pd_items_batch_use')) {
                var num = parseInt(
                    prompt('你要使用多少个【Lv.{0}：{1}】道具？（0表示不限制）'
                            .replace('{0}', itemLevel)
                            .replace('{1}', itemName)
                        , itemUsableNum ? itemUsableNum : 0)
                );
                if (isNaN(num) || num < 0) return;
                KFOL.removePopTips($('.pd_pop_tips'));

                KFOL.showWaitMsg('正在获取本种类未使用道具列表，请稍后...', true);
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有未使用的道具');
                        return;
                    }
                    console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', itemIdList.length)
                        , true);
                    Item.useItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                }, 'html');
            }
            else if ($this.is('.pd_items_cycle_use')) {
                var value = prompt(
                    ('你要循环使用多少个【Lv.{0}：{1}】道具？\n' +
                    '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）')
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                    , itemUsableNum ? itemUsableNum : 0);
                if (value === null) return;
                value = $.trim(value);
                if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                    alert('格式不正确');
                    return;
                }
                var arr = value.split('|');
                var num = 0, maxEffectiveItemCount = 0, maxSuccessRestoreItemCount = 0;
                num = parseInt(arr[0]);
                if (isNaN(num) || num < 0) return;
                if (typeof arr[1] !== 'undefined') maxEffectiveItemCount = parseInt(arr[1]);
                if (typeof arr[2] !== 'undefined') maxSuccessRestoreItemCount = parseInt(arr[2]);
                KFOL.removePopTips($('.pd_pop_tips'));

                KFOL.showWaitMsg('正在获取本种类未使用道具列表，请稍后...', true);
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href') + '&t=' + new Date().getTime();
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有未使用的道具');
                        return;
                    }
                    KFOL.showWaitMsg('正在获取当前道具相关信息，请稍后...', true);
                    $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
                        Item.showCurrentUsableItemNum(html);
                        $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            var totalEnergyNum = Item.getCurrentEnergyNum(html);
                            Item.showCurrentUsedItemNum(html);
                            Item.cycleUseItems(1, {
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
                        }, 'html');
                    }, 'html');
                }, 'html');
            }
            else if ($this.is('.pd_items_batch_restore')) {
                var num = parseInt(
                    prompt('你要恢复多少个【Lv.{0}：{1}】道具？（0表示不限制）'
                            .replace('{0}', itemLevel)
                            .replace('{1}', itemName)
                        , itemUsedNum ? itemUsedNum : 0)
                );
                if (isNaN(num) || num < 0) return;
                KFOL.removePopTips($('.pd_pop_tips'));

                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
                KFOL.showWaitMsg('正在获取本种类已使用道具列表，请稍后...', true);
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量恢复道具Start，恢复道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', itemIdList.length)
                        , true);
                    Item.restoreItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                }, 'html');
            }
            else if ($this.is('.pd_items_batch_convert')) {
                var num = parseInt(
                    prompt('你要将多少个【Lv.{0}：{1}】道具转换为能量？（0表示不限制）'
                            .replace('{0}', itemLevel)
                            .replace('{1}', itemName)
                        , itemUsedNum ? itemUsedNum : 0)
                );
                if (isNaN(num) || num < 0) return;
                KFOL.removePopTips($('.pd_pop_tips'));

                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href') + '&t=' + new Date().getTime();
                KFOL.showWaitMsg('正在获取本种类已使用道具列表，请稍后...', true);
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($('.pd_pop_tips'));
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', itemIdList.length)
                        , true);
                    Item.convertItemsToEnergy({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemName: itemName,
                        $itemLine: $itemLine
                    });
                }, 'html');
            }
        });
    },

    /**
     * 增强我的道具页面
     */
    enhanceMyItemsPage: function () {
        var $myItems = $('.kf_fw_ig1:last');
        $myItems.addClass('pd_my_items').find('tbody > tr').each(function (index) {
            var $this = $(this);
            if (index === 0) {
                $this.find('td').attr('colspan', 6);
            }
            else if (index === 1) {
                $this.find('td:first-child').css('width', '75px')
                    .end().find('td:nth-child(2)').css('width', '185px')
                    .end().find('td:nth-child(3)').css('width', '105px').html('<span class="pd_usable_num">可用数</span> / <span class="pd_used_num pd_custom_tips">已用数</span>')
                    .end().find('td:last-child').css('width', '165px')
                    .before('<td style="width:135px">使用道具</td><td style="width:135px">恢复道具 和 转换能量</td>');
            }
            else {
                $this.find('td:first-child').prepend('<input class="pd_input pd_item_type_chk" type="checkbox" />');
                $this.find('td:nth-child(3)')
                    .wrapInner('<span class="pd_usable_num" style="margin-left:5px"></span>')
                    .append(' / <span class="pd_used_num pd_custom_tips">?</span>')
                    .after(
                        ('<td><a class="pd_items_batch_use" href="#" title="批量使用指定数量的道具">批量使用</a>' +
                        '<a class="pd_items_cycle_use pd_highlight {0}" href="#" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</a></td>' +
                        '<td><a class="pd_items_batch_restore {0}" href="#" title="批量恢复指定数量的道具">批量恢复</a>' +
                        '<a class="pd_items_batch_convert pd_highlight {0}" href="#" title="批量将指定数量的道具转换为能量">批量转换</a></td>')
                            .replace(/\{0\}/g, index === 2 ? 'pd_disabled_link' : '')
                    );
                var $listLinkColumn = $this.find('td:last-child');
                var matches = /lv=(\d+)/i.exec($listLinkColumn.find('a').attr('href'));
                if (matches) {
                    var itemTypeId = parseInt(matches[1]);
                    $this.data('itemTypeId', itemTypeId);
                    $listLinkColumn.find('a').text('未使用列表')
                        .after('<a class="pd_highlight" href="kf_fw_ig_renew.php?lv={0}">已使用列表</a>'.replace('{0}', itemTypeId));
                }
            }
        });
        Item.bindItemActionLinksClick($myItems);

        var $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showCurrentUsedItemNum();
    },

    /**
     * 设定当前指定种类道具的未使用和已使用数量以及道具恢复能量
     * @param {?jQuery} $itemLine 当前道具所在的表格行
     * @param {?number} usedChangeNum 已使用道具的变化数量
     * @param {?number} [usableChangeNum] 未使用道具的变化数量
     * @param {?number} [energyChangeNum] 道具恢复能量的变化数量
     */
    setCurrentItemUsableAndUsedNum: function ($itemLine, usedChangeNum, usableChangeNum, energyChangeNum) {
        var flag = false;
        if ($itemLine) {
            var $itemUsed = $itemLine.find('td:nth-child(3) > .pd_used_num');
            var itemName = $itemLine.find('td:nth-child(2) > a').text();
            if ($itemUsed.length > 0 && itemName !== '零时迷子的碎片') {
                var num = parseInt($itemUsed.text());
                if (isNaN(num) || num + usedChangeNum < 0) {
                    flag = true;
                }
                else {
                    $itemUsed.text(num + usedChangeNum);
                    Item.showUsedItemEnergyTips();
                }
            }
            if (usableChangeNum) {
                var $itemUsable = $itemLine.find('td:nth-child(3) > .pd_usable_num');
                if ($itemUsable.length > 0) {
                    var num = parseInt($itemUsable.text());
                    if (isNaN(num) || num + usableChangeNum < 0) flag = true;
                    else $itemUsable.text(num + usableChangeNum);
                }
            }
        }
        if (energyChangeNum) {
            var $totalEnergy = $('.pd_total_energy_num');
            if (location.pathname === '/kf_fw_ig_renew.php')
                $totalEnergy = $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span');
            if ($totalEnergy.length > 0) {
                var num = parseInt($totalEnergy.text());
                if (isNaN(num) || num + energyChangeNum < 0) flag = true;
                else $totalEnergy.text(num + energyChangeNum);
            }
            else {
                flag = true;
            }
        }
        if (flag) {
            Item.showCurrentUsedItemNum();
            if (location.pathname === '/kf_fw_ig_my.php' && !Tools.getUrlParam('lv')) Item.showCurrentUsableItemNum();
        }
    },

    /**
     * 获取当前道具恢复能量
     * @param {string} html 恢复道具页面的HTML代码
     */
    getCurrentEnergyNum: function (html) {
        var energyNum = 0;
        var energyNumMatches = /道具恢复能量<br\s*\/><span.+?>(\d+)<\/span><br\s*\/>点/i.exec(html);
        if (energyNumMatches) energyNum = parseInt(energyNumMatches[1]);
        return energyNum;
    },

    /**
     * 显示已使用道具恢复所需和转换可得的能量的提示
     */
    showUsedItemEnergyTips: function () {
        var totalRestoreEnergy = 0, totalConvertEnergy = 0;
        $('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(3) > .pd_used_num').each(function () {
            var $this = $(this);
            var itemNum = parseInt($this.text());
            if (isNaN(itemNum) || itemNum < 0) return;
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var perRestoreEnergy = Item.getRestoreEnergyNumByItemLevel(itemLevel);
            var perConvertEnergy = Item.getGainEnergyNumByItemLevel(itemLevel);
            totalRestoreEnergy += perRestoreEnergy * itemNum;
            totalConvertEnergy += perConvertEnergy * itemNum;
            $this.attr('title', '全部恢复需要{0}点能量，全部转换可得{1}点能量'
                .replace('{0}', perRestoreEnergy * itemNum)
                .replace('{1}', perConvertEnergy * itemNum)
            );
        });
        $('.kf_fw_ig1:last > tbody > tr:nth-child(2) > td:nth-child(3) > .pd_used_num')
            .attr('title', '全部恢复需要{0}点能量，全部转换可得{1}点能量'
                .replace('{0}', totalRestoreEnergy)
                .replace('{1}', totalConvertEnergy)
            );
    },

    /**
     * 在我的道具页面中显示当前各种类已使用道具的数量
     * @param {string} [html] 恢复道具页面的HTML代码（留空表示自动获取HTML代码）
     */
    showCurrentUsedItemNum: function (html) {
        /**
         * 显示数量
         * @param {string} html 恢复道具页面的HTML代码
         */
        var show = function (html) {
            var energyNum = Item.getCurrentEnergyNum(html);
            var introMatches = /(1级道具转换得.+?点能量)。<br/.exec(html);
            if (location.pathname === '/kf_fw_ig_my.php') {
                $('.kf_fw_ig_title1:last').find('span:has(.pd_total_energy_num)').remove()
                    .end().append(
                    '<span class="pd_custom_tips" style="margin-left:7px" title="{0}">(道具恢复能量 <b class="pd_total_energy_num" style="font-size:14px">{1}</b> 点)</span>'
                        .replace('{0}', introMatches ? introMatches[1] : '')
                        .replace('{1}', energyNum)
                );
            }
            else {
                $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span').text(energyNum);
            }

            if ($('.pd_used_num').length > 0) {
                var matches = html.match(/">\d+<\/td><td>全部转换本级已使用道具为能量<\/td>/ig);
                if (matches) {
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
                        Item.showUsedItemEnergyTips();
                    }
                }
            }
        };

        if (html) {
            show(html);
        }
        else {
            $.get('kf_fw_ig_renew.php?t=' + new Date().getTime(), function (html) {
                show(html);
            }, 'html');
        }
    },

    /**
     * 在我的道具页面中显示当前各种类可使用道具的数量
     * @param {string} [html] 我的道具页面的HTML代码（留空表示自动获取HTML代码）
     */
    showCurrentUsableItemNum: function (html) {
        /**
         * 显示数量
         * @param {string} html 我的道具页面的HTML代码
         */
        var show = function (html) {
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
        }
        else {
            $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), function (html) {
                show(html);
            }, 'html');
        }
    },

    /**
     * 获取道具使用情况
     * @param html 争夺首页的HTML代码
     * @returns {{}} 道具使用情况对象
     */
    getItemUsedInfo: function (html) {
        var itemUsedNumList = {
            '蕾米莉亚同人漫画': 0,
            '十六夜同人漫画': 0,
            '档案室钥匙': 0,
            '傲娇LOLI娇蛮音CD': 0,
            '消逝之药': 0,
            '整形优惠卷': 0
        };
        var matches = /道具：\[(蕾米莉亚同人漫画)：(\d+)]\[(十六夜同人漫画)：(\d+)]\[(档案室钥匙)：(\d+)]\[(傲娇LOLI娇蛮音CD)：(\d+)]\[(消逝之药)：(\d+)]\[(整形优惠卷)：(\d+)]/.exec(html);
        if (matches) {
            for (var i = 1; i < matches.length; i += 2) {
                itemUsedNumList[matches[i]] = parseInt(matches[i + 1]);
            }
        }
        return itemUsedNumList;
    },

    /**
     * 显示道具使用情况
     * @param {jQuery} $links 道具名称的链接列表
     */
    showItemUsedInfo: function ($links) {
        var tipsList = [
            '仅供参考', '←谁信谁傻逼', '←不管你信不信，反正我是信了', '要是失败了出门左转找XX风', '退KFOL保一生平安', '←这一切都是XX风的阴谋',
            '这样的几率大丈夫？大丈夫，萌大奶！', '玄不救非，氪不改命', '严重警告：此地的概率学已死', '←概率对非洲人是不适用的', '要相信RP守恒定律'
        ];
        $.get('kf_fw_ig_index.php?t=' + new Date().getTime(), function (html) {
            var itemUsedNumList = Item.getItemUsedInfo(html);
            $links.next('.pd_used_item_info').remove();
            $links.each(function () {
                var $this = $(this);
                var itemName = $this.text();
                if (typeof itemUsedNumList[itemName] === 'undefined') return;
                var usedNum = itemUsedNumList[itemName];
                var maxUsedNum = Item.getItemMaxUsedNumByItemName(itemName);
                var nextSuccessPercent = 0;
                if (usedNum > maxUsedNum) nextSuccessPercent = 0;
                else nextSuccessPercent = (1 - usedNum / maxUsedNum) * 100;
                var tips = '';
                if (usedNum < maxUsedNum && usedNum > 0) tips = '（' + tipsList[Math.floor(Math.random() * tipsList.length)] + '）';
                $this.after(
                    '<span class="pd_used_item_info" title="下个道具使用成功几率：{0}{4}">(<span style="{1}">{2}</span>/<span style="color:#F00">{3}</span>)</span>'
                        .replace('{0}', usedNum >= maxUsedNum ? '无' : nextSuccessPercent.toFixed(2) + '%')
                        .replace('{1}', usedNum >= maxUsedNum ? 'color:#F00' : '')
                        .replace('{2}', usedNum)
                        .replace('{3}', maxUsedNum)
                        .replace('{4}', tips)
                );
            });
        });
    },

    /**
     * 添加道具样品的链接
     * @param {jQuery} $nodes 道具名称的节点列表
     */
    addSampleItemsLink: function ($nodes) {
        $nodes.each(function () {
            var $this = $(this);
            var itemName = $.trim($this.text());
            var itemLevel = Item.getItemLevelByItemName(itemName);
            if (itemName && typeof Const.sampleItemIdList[itemName] !== 'undefined') {
                var title = '';
                if (itemName !== '零时迷子的碎片') {
                    title = '恢复此道具需{0}点能量，转换此道具可得{1}点能量'
                        .replace('{0}', Item.getRestoreEnergyNumByItemLevel(itemLevel))
                        .replace('{1}', Item.getGainEnergyNumByItemLevel(itemLevel));
                }
                else {
                    title = '此道具不可恢复和转换';
                }
                $this.html('<a href="kf_fw_ig_my.php?pro={0}&display=1" title="{1}">{2}</a>'
                    .replace('{0}', Const.sampleItemIdList[itemName])
                    .replace('{1}', title)
                    .replace('{2}', itemName)
                );
            }
        });
    },

    /**
     * 添加道具样品提示
     */
    addSampleItemTips: function () {
        var itemId = parseInt(Tools.getUrlParam('pro'));
        if (isNaN(itemId) || itemId <= 0) return;
        for (var itemName in Const.sampleItemIdList) {
            if (itemId === Const.sampleItemIdList[itemName]) {
                $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').find('span:first').after('<span class="pd_notice" style="margin-left:5px">(展示用样品)</span>');
                break;
            }
        }
    },

    /**
     * 购买指定种类的道具
     * @param {{}} options 设置项
     * @param {number} options.itemTypeId 指定的道具种类ID
     * @param {number} options.num 欲购买的道具数量
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     */
    buyItems: function (options) {
        var settings = {
            itemTypeId: 0,
            num: 0,
            safeId: '',
            itemLevel: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1').parent().append('<ul class="pd_result"><li><strong>【Lv.{0}：{1}】购买结果：</strong></li></ul>'
            .replace('{0}', settings.itemLevel)
            .replace('{1}', settings.itemName)
        );

        var successNum = 0, failNum = 0;
        var isStop = false;
        $(document).clearQueue('BatchBuyItems');
        $.each(new Array(settings.num), function (index) {
            $(document).queue('BatchBuyItems', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_shop.php?lvid={0}&safeid={1}&t={2}'
                        .replace('{0}', settings.itemTypeId)
                        .replace('{1}', settings.safeId)
                        .replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('购买道具', html);
                        var msg = '';
                        var matches = /<a href="kf_fw_ig_my\.php\?pro=(\d+)">/i.exec(html);
                        if (matches) {
                            successNum++;
                            msg = '获得了<a target="_blank" href="kf_fw_ig_my.php?pro={0}" data-id="{0}">一个道具</a>'.replace(/\{0\}/g, matches[1]);
                        }
                        else if (/你需要持有该道具两倍市场价的KFB/i.test(html)) {
                            msg = '你需要持有该道具两倍市场价的KFB<span class="pd_notice">（购买操作中止）</span>';
                            isStop = true;
                        }
                        else {
                            msg = '未能获得预期的回应';
                        }
                        $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'.replace('{0}', index + 1).replace('{1}', msg));
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('BatchBuyItems');

                        if (isStop || index === settings.num - 1) {
                            KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('购买道具',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具购买成功'
                                        .replace('{0}', successNum)
                                        .replace('{1}', settings.itemLevel)
                                        .replace('{2}', settings.itemName),
                                    {gain: {'道具': successNum}}
                                );
                            }
                            console.log('共有{0}个【Lv.{1}：{2}】道具购买成功{3}'
                                .replace('{0}', successNum)
                                .replace('{1}', settings.itemLevel)
                                .replace('{2}', settings.itemName)
                                .replace('{3}', failNum > 0 ? '，共有{0}个道具购买失败'.replace('{0}', failNum) : '')
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>个【<em>Lv.{1}</em>{2}】道具购买成功{3}</strong>'
                                    .replace('{0}', successNum)
                                    .replace('{1}', settings.itemLevel)
                                    .replace('{2}', settings.itemName)
                                    .replace('{3}', failNum > 0 ? '，共有<em>{0}</em>个道具购买失败'.replace('{0}', failNum) : '')
                                , -1);

                            if (successNum > 0) {
                                $('<li><a href="#">统计购买价格</a></li>')
                                    .appendTo('.pd_result:last')
                                    .find('a')
                                    .click(function (e) {
                                        e.preventDefault();
                                        var $result = $(this).closest('.pd_result');
                                        $(this).parent().remove();
                                        KFOL.removePopTips($('.pd_pop_tips'));
                                        Item.statBuyItemsPrice($result, settings.itemLevel, settings.itemName);
                                    });
                                Item.showItemShopBuyInfo();
                            }
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('BatchBuyItems');
                            }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('BatchBuyItems');
    },

    /**
     * 统计批量购买道具的购买价格
     * @param {jQuery} $result 购买结果的jQuery对象
     * @param {number} itemLevel 道具等级
     * @param {string} itemName 道具名称
     */
    statBuyItemsPrice: function ($result, itemLevel, itemName) {
        var successNum = 0, failNum = 0, totalPrice = 0, minPrice = 0, maxPrice = 0, marketPrice = 0, totalNum = $result.find('li > a').length;
        $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
            var $this = $(this);
            if ($this.find('a').text() === itemName) {
                marketPrice = parseInt($.trim($this.next('td').find('.pd_item_price').text()));
                return false;
            }
        });
        if (!marketPrice) marketPrice = 1;
        KFOL.showWaitMsg('<strong>正在统计购买价格中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                .replace('{0}', totalNum)
            , true);
        $(document).clearQueue('StatBuyItemsPrice');
        $result.find('li > a').each(function (index) {
            var $this = $(this);
            var itemId = $this.data('id');
            if (!itemId) return;
            $(document).queue('StatBuyItemsPrice', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_ig_my.php?pro={0}&t={1}'.replace('{0}', itemId).replace('{1}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var matches = /从商店购买，购买价(\d+)KFB。<br>/i.exec(html);
                        if (matches) {
                            successNum++;
                            var price = parseInt(matches[1]);
                            totalPrice += price;
                            if (minPrice === 0) minPrice = price;
                            else if (price < minPrice) minPrice = price;
                            if (price > maxPrice) maxPrice = price;
                            $this.after('（购买价：<b class="pd_highlight">{0}</b>KFB）'.replace('{0}', price));
                        }
                        else {
                            failNum++;
                            $this.after('<span class="pd_notice">（未能获得预期的回应）</span>');
                        }
                    },
                    error: function () {
                        failNum++;
                        $this.after('<span class="pd_notice">（连接超时）</span>');
                    },
                    complete: function () {
                        if (index === totalNum - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            if (successNum > 0) {
                                Log.push('统计道具购买价格',
                                    '共有`{0}`个【`Lv.{1}：{2}`】道具统计成功{3}，总计价格：`{4}`，平均价格：`{5}`(`{6}%`)，最低价格：`{7}`(`{8}%`)，最高价格：`{9}`(`{10}%`)'
                                        .replace('{0}', successNum)
                                        .replace('{1}', itemLevel)
                                        .replace('{2}', itemName)
                                        .replace('{3}', failNum > 0 ? '（共有`{0}`个道具未能统计成功）'.replace('{0}', failNum) : '')
                                        .replace('{4}', totalPrice.toLocaleString())
                                        .replace('{5}', successNum > 0 ? Tools.getFixedNumberLocaleString(totalPrice / successNum, 2) : 0)
                                        .replace('{6}', successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0)
                                        .replace('{7}', minPrice.toLocaleString())
                                        .replace('{8}', Math.round(minPrice / marketPrice * 100))
                                        .replace('{9}', maxPrice.toLocaleString())
                                        .replace('{10}', Math.round(maxPrice / marketPrice * 100))
                                    , {pay: {'KFB': -totalPrice}}
                                );
                            }
                            console.log('统计道具购买价格（KFB）（共有{0}个道具未能统计成功），统计成功数量：{1}，总计价格：{2}，平均价格：{3} ({4}%)，最低价格：{5} ({6}%)，最高价格：{7} ({8}%)'
                                .replace('{0}', failNum)
                                .replace('{1}', successNum)
                                .replace('{2}', totalPrice.toLocaleString())
                                .replace('{3}', successNum > 0 ? Tools.getFixedNumberLocaleString(totalPrice / successNum, 2) : 0)
                                .replace('{4}', successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0)
                                .replace('{5}', minPrice.toLocaleString())
                                .replace('{6}', Math.round(minPrice / marketPrice * 100))
                                .replace('{7}', maxPrice.toLocaleString())
                                .replace('{8}', Math.round(maxPrice / marketPrice * 100))
                            );
                            $result.append(
                                ('<li class="pd_stat"><b>统计结果{0}：</b><br /><i>统计成功数量：<em>{1}</em></i> <i>总计价格：<em>{2}</em></i> ' +
                                '<i>平均价格：<em>{3} ({4}%)</em></i> <i>最低价格：<em>{5} ({6}%)</em></i> <i>最高价格：<em>{7} ({8}%)</em></i></li>')
                                    .replace('{0}', failNum > 0 ? '<span class="pd_notice">（共有{0}个道具未能统计成功）</span>'.replace('{0}', failNum) : '')
                                    .replace('{1}', successNum)
                                    .replace('{2}', totalPrice.toLocaleString())
                                    .replace('{3}', successNum > 0 ? Tools.getFixedNumberLocaleString(totalPrice / successNum, 2) : 0)
                                    .replace('{4}', successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0)
                                    .replace('{5}', minPrice.toLocaleString())
                                    .replace('{6}', Math.round(minPrice / marketPrice * 100))
                                    .replace('{7}', maxPrice.toLocaleString())
                                    .replace('{8}', Math.round(maxPrice / marketPrice * 100))
                            );
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('StatBuyItemsPrice');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('StatBuyItemsPrice');
    },

    /**
     * 在道具商店页面上添加批量购买道具的链接
     */
    addBatchBuyItemsLink: function () {
        var $shop = $('.kf_fw_ig1:first');

        $shop.find('tbody > tr:nth-child(2)')
            .find('td:nth-child(2)').css('width', '243px')
            .end().find('td:nth-child(3)').css('width', '155px')
            .end().find('td:last-child').css('width', '110px');

        $shop.find('tbody > tr:gt(1)').each(function () {
            $(this).find('td:nth-child(3)').wrapInner('<span class="pd_item_price"></span>')
                .end().find('td:last-child').append('<a class="pd_batch_buy_items" style="margin-left:15px" href="#">批量购买</a>');
        });

        $shop.on('click', 'a[href^="kf_fw_ig_shop.php?lvid="]', function () {
            var $this = $(this);
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
            if (!itemName) return;
            if (!confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', itemLevel).replace('{1}', itemName))) {
                return false;
            }
        }).on('click', 'a.pd_batch_buy_items', function (e) {
            e.preventDefault();
            KFOL.removePopTips($('.pd_pop_tips'));
            var $this = $(this);
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
            if (!itemName) return;
            var matches = /lvid=(\d+)&safeid=(\w+)/i.exec($this.prev('a').attr('href'));
            if (!matches) return;
            var itemTypeId = parseInt(matches[1]);
            var safeId = matches[2];
            var num = parseInt(
                $.trim(prompt('你要批量购买多少个【Lv.{0}：{1}】道具？'
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                    , 0))
            );
            if (isNaN(num) || num <= 0) return;
            KFOL.showWaitMsg('<strong>正在购买道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', num)
                , true);
            Item.buyItems({itemTypeId: itemTypeId, num: num, safeId: safeId, itemLevel: itemLevel, itemName: itemName});
        });

        $shop.find('tbody > tr:gt(1) > td:nth-child(4)').each(function () {
            var $this = $(this);
            var price = parseInt($.trim($this.prev('td').text()));
            if (isNaN(price)) return;
            $this.addClass('pd_custom_tips').attr('title', '{0}~{1}（均价：{2}）'
                .replace('{0}', Math.floor(price * 0.5))
                .replace('{1}', price * 2)
                .replace('{2}', Math.floor(price * 1.25))
            );
        });

        var $itemName = $shop.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showItemShopBuyInfo();
        $shop.find('tbody > tr:first-child > td').append(
            '<br /><span class="pd_highlight">想买道具却害怕使用失败？快来试试' +
            '<a href="read.php?tid=526110" target="_blank" title="喵拉布丁：我绝对没收广告费~">道具使用险</a>吧！</span>'
        );
    },

    /**
     * 显示道具商店可购买情况
     */
    showItemShopBuyInfo: function () {
        $.get('profile.php?action=show&uid={0}&t={1}'.replace('{0}', KFOL.uid).replace('{1}', new Date().getTime()), function (html) {
            var matches = /论坛货币：(\d+)\s*KFB<br \/>/i.exec(html);
            if (!matches) return;
            var cash = parseInt(matches[1]);
            $('.kf_fw_ig_title1:last').find('span:last').remove()
                .end().append('<span style="margin-left:7px">(当前持有 <b style="font-size:14px">{0}</b> KFB)</span>'.replace('{0}', cash));
            $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(3) > .pd_item_price').each(function () {
                var $this = $(this);
                $this.next('.pd_verify_tips').remove();
                var price = parseInt($.trim($this.text()));
                if (isNaN(price)) return;
                var tips = '', title = '';
                if (price * 2 <= cash) {
                    tips = '<span style="color:#669933">可买</span>';
                    title = '有足够KFB购买此道具';
                }
                else {
                    tips = '<span style="color:#FF0033">差{0}</span>'.replace('{0}', price * 2 - cash);
                    title = '还差{0}KFB才可购买此道具'.replace('{0}', price * 2 - cash);
                }
                $this.after('<span class="pd_verify_tips" title="{0}" style="font-size:12px;margin-left:3px">({1})</span>'.replace('{0}', title).replace('{1}', tips));
            });
        });
    },

    /**
     * 修正道具描述
     */
    modifyItemDescription: function () {
        var $area = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child');
        var matches = /道具名称：(.+)/.exec($area.find('span:first').text().trim());
        if (!matches) return;
        var itemName = matches[1];
        var itemDescReplaceList = {
            '蕾米莉亚同人漫画': ['燃烧伤害+1。上限50。', '力量+1，体质+1；满50本时，追加+700生命值。'],
            '十六夜同人漫画': ['命中+3，闪避+1。上限50。', '敏捷+1，灵活+1；满50本时，追加+100攻击速度。'],
            '档案室钥匙': ['暴击伤害加成+10%。上限30。', '增加5%盒子获得概率[原概率*(100%+追加概率)]；满30枚时，增加50点可分配点数。'],
            '傲娇LOLI娇蛮音CD': ['闪避+3，命中+1。上限30。', '降低对手生命值上限的0.5%；满30张时，追加降低对手10%攻击力。'],
            '整形优惠卷': [
                '暴击几率+3%。上限10。',
                '在获得盒子时，增加3%的几率直接获得高一级的盒子；<br>满10张时，这个概率直接提升为50%(无法将传奇盒子升级为神秘盒子)。'
            ],
            '消逝之药': ['消除伤害。<br>防御效果+7%。上限10。', '所有属性+5(不含耐力、幸运)；满10瓶时，追加200点可分配点数。']
        };
        if (itemDescReplaceList[itemName]) {
            $area.html($area.html().replace(itemDescReplaceList[itemName][0], itemDescReplaceList[itemName][1]));
        }
    }
};
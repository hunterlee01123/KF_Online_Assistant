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
            if (/成功！/.test(response)) {
                switch (itemTypeId) {
                    case 11:
                        return {'燃烧伤害': 1};
                    case 7:
                        return {'命中': 3, '闪避': 1};
                    case 8:
                        return {'暴击比例': 10};
                    case 12:
                        return {'命中': 1, '闪避': 3};
                    case 9:
                        return {'暴击几率': 3};
                    case 10:
                        return {'防御': 7};
                }
            }
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
     * 转换指定的一系列道具为能量
     * @param {{}} options 设置项
     * @param {number} options.type 转换类型，1：转换本级全部已使用的道具为能量；2：转换本级部分已使用的道具为能量
     * @param {number[]} options.itemIdList 指定的道具Url列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     */
    convertItemsToEnergy: function (options) {
        var settings = {
            type: 1,
            itemIdList: [],
            safeId: '',
            itemLevel: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】转换结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );
        var successNum = 0;
        var energyNum = Item.getGainEnergyNumByItemLevel(settings.itemLevel);
        $(document).queue('ConvertItemsToEnergy', []);
        $.each(settings.itemIdList, function (index, itemId) {
            if (!itemId) return;
            $(document).queue('ConvertItemsToEnergy', function () {
                var url = 'kf_fw_ig_doit.php?tomp={0}&id={1}1&t={2}'
                    .replace('{0}', settings.safeId)
                    .replace('{1}', itemId)
                    .replace('{2}', (new Date()).getTime());
                $.get(url, function (html) {
                    KFOL.showFormatLog('将道具转换为能量', html);
                    if (/转换为了\s*\d+\s*点能量/i.test(html)) {
                        successNum++;
                    }
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    if (index === settings.itemIdList.length - 1) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        var successEnergyNum = successNum * energyNum;
                        if (successNum > 0) {
                            Log.push('将道具转换为能量',
                                '共有`{0}`个【`Lv.{1}：{2}`】道具成功转换为能量'
                                    .replace('{0}', successNum)
                                    .replace('{1}', settings.itemLevel)
                                    .replace('{2}', settings.itemName),
                                {
                                    gain: {'能量': successEnergyNum},
                                    pay: {'已使用道具': -successNum}
                                }
                            );
                        }
                        console.log('共有{0}个道具成功转换为能量，能量+{1}'
                            .replace('{0}', successNum)
                            .replace('{1}', successEnergyNum)
                        );
                        KFOL.showMsg({
                            msg: '<strong>共有<em>{0}</em>个道具成功转换为能量</strong><i>能量<em>+{1}</em></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', successEnergyNum)
                            , duration: -1
                        });
                        $('.pd_result:last').append(
                            '<li class="pd_stat">共有<em>{0}</em>个道具成功转换为能量，<i>能量<em>+{1}</em></i></li>'
                                .replace('{0}', successNum)
                                .replace('{1}', successEnergyNum)
                        );
                        if (settings.type === 2) {
                            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
                                    $(this).remove();
                                });
                        }
                        Item.showCurrentUsedItemNum();
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('ConvertItemsToEnergy');
                    }, Config.defAjaxInterval);
                }, 'html');
            });
        });
        $(document).dequeue('ConvertItemsToEnergy');
    },

    /**
     * 恢复指定的一系列道具
     * @param {{}} options 设置项
     * @param {number} options.type 恢复类型，1：恢复本级全部已使用的道具；2：恢复本级部分已使用的道具
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {string} options.itemName 道具名称
     */
    restoreItems: function (options) {
        var settings = {
            type: 1,
            itemIdList: [],
            safeId: '',
            itemLevel: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】恢复结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );
        var successNum = 0;
        var failNum = 0;
        var energyNum = Item.getRestoreEnergyNumByItemLevel(settings.itemLevel);
        $(document).queue('RestoreItems', []);
        $.each(settings.itemIdList, function (index, itemId) {
            if (!itemId) return;
            $(document).queue('RestoreItems', function () {
                var url = 'kf_fw_ig_doit.php?renew={0}&id={1}1&t={2}'
                    .replace('{0}', settings.safeId)
                    .replace('{1}', itemId)
                    .replace('{2}', (new Date()).getTime());
                $.get(url, function (html) {
                    KFOL.showFormatLog('恢复道具', html);
                    var msg = '';
                    var matches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                    if (matches) {
                        if (/该道具已经被恢复/i.test(html)) successNum++;
                        else if (/恢复失败/i.test(html)) failNum++;
                    }
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'
                        .replace('{0}', index + 1)
                        .replace('{1}', matches ? matches[1] : '未能获得预期的回应')
                    );
                    if (index === settings.itemIdList.length - 1) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        var successEnergyNum = successNum * energyNum;
                        if (successNum > 0 || failNum > 0) {
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
                        KFOL.showMsg({
                            msg: '<strong>共有<em>{0}</em>个道具恢复成功，共有<em>{1}</em>个道具恢复失败</strong><i>能量<ins>-{2}</ins></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', successEnergyNum)
                            , duration: -1
                        });
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
                        Item.showCurrentUsedItemNum();
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('RestoreItems');
                    }, typeof Config.specialAjaxInterval === 'function' ? Config.specialAjaxInterval() : Config.specialAjaxInterval);
                }, 'html');
            });
        });
        $(document).dequeue('RestoreItems');
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
        $('.kf_fw_ig1:eq(1) > tbody > tr > td:last-child').each(function () {
            var matches = /kf_fw_ig_my\.php\?pro=(\d+)/.exec($(this).find('a').attr('href'));
            if (!matches) return;
            $(this).css('width', '500')
                .parent()
                .append('<td style="width:20px;padding-right:5px"><input class="pd_input" type="checkbox" value="{0}" /></td>'
                    .replace('{0}', matches[1])
                );
        });
        $('<div class="pd_item_btns"><button class="pd_highlight">转换能量</button><button>恢复道具</button><button>全选</button><button>反选</button></div>')
            .insertAfter('.kf_fw_ig1:eq(1)')
            .find('button:first-child')
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!window.confirm('共选择了{0}个道具，是否转换为能量？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
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
                if (!window.confirm('共选择了{0}个道具，共需要{1}点恢复能量，是否恢复道具？'
                        .replace('{0}', itemIdList.length)
                        .replace('{1}', totalRequiredEnergyNum)
                    )
                ) return;
                var totalEnergyNum = parseInt($('.kf_fw_ig1 td:contains("道具恢复能量")').find('span').text());
                if (!totalEnergyNum || totalEnergyNum < totalRequiredEnergyNum) {
                    alert('所需恢复能量不足');
                    return;
                }
                KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                    .replace('{0}', itemIdList.length)
                    , true);
                Item.restoreItems({
                    type: 2,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
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
                    .next('td').attr('width', 100)
                    .next('td').attr('width', 130).text('批量恢复')
                    .next('td').attr('width', 160)
                    .before('<td width="160">批量转换</td>');
            }
            else {
                $this.find('td:nth-child(3)')
                    .wrapInner('<span class="pd_used_num" style="color:#000"></span>')
                    .end()
                    .find('td:nth-child(4)')
                    .html('<a class="pd_items_batch_restore {0}" href="#">批量恢复道具</a>'.replace('{0}', index === 2 ? 'pd_disabled_link' : ''))
                    .after('<td><a class="pd_items_batch_convert pd_highlight {0}" href="#">批量转换道具为能量</a></td>'.replace('{0}', index === 2 ? 'pd_disabled_link' : ''));
                var matches = /lv=(\d+)/i.exec($this.find('td:last-child').find('a').attr('href'));
                if (matches) $this.data('itemTypeId', parseInt(matches[1]));
            }
        });
        Item.bindClickForItemLink($myItems);

        var $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
    },

    /**
     * 使用指定的一系列道具
     * @param {{}} options 设置项
     * @param {number} options.type 使用类型，1：使用本级全部道具；2：使用本级部分道具
     * @param {number[]} options.itemIdList 指定的道具ID列表
     * @param {string} options.safeId 用户的SafeID
     * @param {number} options.itemLevel 道具等级
     * @param {number} options.itemTypeId 道具种类ID
     * @param {string} options.itemName 道具名称
     */
    useItems: function (options) {
        var settings = {
            type: 1,
            itemIdList: [],
            safeId: '',
            itemLevel: 0,
            itemTypeId: 0,
            itemName: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1:last').parent().append(
            '<ul class="pd_result"><li><strong>【Lv.{0}：{1}】使用结果：</strong></li></ul>'
                .replace('{0}', settings.itemLevel)
                .replace('{1}', settings.itemName)
        );
        var successNum = 0, failNum = 0;
        $(document).queue('UseItems', []);
        $.each(settings.itemIdList, function (index, itemId) {
            if (!itemId) return;
            $(document).queue('UseItems', function () {
                var url = 'kf_fw_ig_doit.php?id={0}1&t={1}'.replace('{0}', itemId).replace('{1}', (new Date()).getTime());
                $.get(url, function (html) {
                    KFOL.showFormatLog('使用道具', html);
                    var matches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                    if (matches && !/错误的物品编号/i.test(html) && !/无法再使用/i.test(html)) successNum++;
                    else failNum++;
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    $('.pd_result:last').append('<li><b>第{0}次：</b>{1}</li>'
                        .replace('{0}', index + 1)
                        .replace('{1}', matches ? matches[1] : '未能获得预期的回应')
                    );
                    if (index === settings.itemIdList.length - 1) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        var stat = {'有效道具': 0, '无效道具': 0};
                        $('.pd_result').last().find('li').not(':first-child').each(function () {
                            var credits = Item.getCreditsViaResponse($(this).text(), settings.itemTypeId);
                            if (credits !== -1) {
                                if ($.isEmptyObject(credits)) stat['无效道具']++;
                                else stat['有效道具']++;
                                $.each(credits, function (index, credit) {
                                    if (typeof stat[index] === 'undefined')
                                        stat[index] = credit;
                                    else
                                        stat[index] += credit;
                                });
                            }
                        });
                        if (stat['有效道具'] === 0) delete stat['有效道具'];
                        if (stat['无效道具'] === 0) delete stat['无效道具'];
                        if (successNum > 0) {
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
                        }
                        console.log('共有{0}个道具被使用{1}{2}'
                            .replace('{0}', successNum)
                            .replace('{1}', failNum > 0 ? '，共有{0}个道具未能使用'.replace('{0}', failNum) : '')
                            .replace('{2}', logStat)
                        );
                        KFOL.showMsg({
                            msg: '<strong>共有<em>{0}</em>个道具被使用{1}</strong>{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具未能使用'.replace('{0}', failNum) : '')
                                .replace('{2}', msgStat)
                            , duration: -1
                        });
                        if (settings.type === 2) {
                            $('.kf_fw_ig1 input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
                                    $(this).remove();
                                });
                        }
                        else {
                            Item.showItemUsedInfo($('.kf_fw_ig1:last > tbody > tr:gt(1) > td:nth-child(2) > a'));
                            Item.showCurrentUsableItemNum();
                            Item.showCurrentUsedItemNum();
                        }
                        if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                        $('.pd_result:last').append(
                            '<li class="pd_stat"><b>统计结果（共有<em>{0}</em>个道具被使用）：</b><br />{1}</li>'
                                .replace('{0}', successNum)
                                .replace('{1}', resultStat)
                        );
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('UseItems');
                    }, typeof Config.specialAjaxInterval === 'function' ? Config.specialAjaxInterval() : Config.specialAjaxInterval);
                }, 'html');
            });
        });
        $(document).dequeue('UseItems');
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
        $(document).queue('SellItems', []);
        $.each(settings.itemIdList, function (index, itemId) {
            if (!itemId) return;
            $(document).queue('SellItems', function () {
                var url = 'kf_fw_ig_shop.php?sell=yes&id={0}1&t={1}'.replace('{0}', itemId).replace('{1}', (new Date()).getTime());
                $.get(url, function (html) {
                    KFOL.showFormatLog('出售道具', html);
                    if (/出售成功/.test(html)) {
                        successNum++;
                        totalGain += Item.getSellItemGainByItemLevel(settings.itemLevel);
                    }
                    else failNum++;
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    if (index === settings.itemIdList.length - 1) {
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
                        console.log('共有{0}个道具出售成功，共有{1}个道具出售失败，KFB+{2}'
                            .replace('{0}', successNum)
                            .replace('{1}', failNum)
                            .replace('{2}', totalGain)
                        );
                        KFOL.showMsg({
                            msg: '<strong>共有<em>{0}</em>个道具出售成功{1}</strong><i>KFB<em>+{2}</em></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具出售失败'.replace('{0}', failNum) : '')
                                .replace('{2}', totalGain)
                            , duration: -1
                        });
                        $('.pd_result:last').append(
                            '<li class="pd_stat">共有<em>{0}</em>个道具出售成功{1}，<i>KFB<em>+{2}</em></i></li>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>个道具出售失败'.replace('{0}', failNum) : '')
                                .replace('{2}', totalGain)
                        );
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('SellItems');
                    }, Config.defAjaxInterval);
                }, 'html');
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
        $('<div class="pd_item_btns"><button>使用道具</button><button>全选</button><button>反选</button></div>')
            .insertAfter('.kf_fw_ig1')
            .find('button:first-child')
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!window.confirm('共选择了{0}个道具，是否批量使用道具？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
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
        if (itemTypeId >= 7 && itemTypeId <= 12) {
            $('<button class="pd_highlight">出售道具</button>').prependTo('.pd_item_btns').click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var itemIdList = [];
                $('.kf_fw_ig1 input[type="checkbox"]:checked').each(function () {
                    itemIdList.push(parseInt($(this).val()));
                });
                if (itemIdList.length === 0) return;
                if (!window.confirm('共选择了{0}个道具，是否批量出售道具？'.replace('{0}', itemIdList.length))) return;
                KFOL.showWaitMsg('<strong>正在出售道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                    .replace('{0}', itemIdList.length)
                    , true);
                Item.sellItems({
                    itemIdList: itemIdList,
                    itemLevel: itemLevel,
                    itemName: itemName
                });
            });
        }
    },

    /**
     * 为我的道具道具功能链接绑定点击事件
     * @param {jQuery} $element 要绑定的容器元素
     */
    bindClickForItemLink: function ($element) {
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
                    window.prompt('你要使用多少个【Lv.{0}：{1}】道具？'
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                        , itemUsableNum ? itemUsableNum : 0)
                );
                if (isNaN(num) || num <= 0) return;

                KFOL.removePopTips($('.pd_pop_tips'));
                var $tips = KFOL.showWaitMsg('正在获取本级可用道具列表，请稍后...', true);
                itemListUrl = $itemLine.find('td:last-child').find('a:first-child').attr('href');
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($tips);
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有可用的道具');
                        return;
                    }
                    console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                        .replace('{0}', itemIdList.length)
                        , true);
                    Item.useItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemTypeId: itemTypeId,
                        itemName: itemName
                    });
                }, 'html');
            }
            else if ($this.is('.pd_items_cycle_use')) {

            }
            else if ($this.is('.pd_items_batch_restore')) {
                var num = parseInt(
                    window.prompt('你要恢复多少个【Lv.{0}：{1}】道具？'
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                        , itemUsedNum ? itemUsedNum : 0)
                );
                if (isNaN(num) || num <= 0) return;

                KFOL.removePopTips($('.pd_pop_tips'));
                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href');
                var $tips = KFOL.showWaitMsg('正在获取本级已使用道具列表，请稍后...', true);
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($tips);
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量恢复道具Start，恢复道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在恢复道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                        .replace('{0}', itemIdList.length)
                        , true);
                    Item.restoreItems({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemName: itemName
                    });
                }, 'html');
            }
            else if ($this.is('.pd_items_batch_convert')) {
                var num = parseInt(
                    window.prompt('你要将多少个【Lv.{0}：{1}】道具转换为能量？'
                        .replace('{0}', itemLevel)
                        .replace('{1}', itemName)
                        , itemUsedNum ? itemUsedNum : 0)
                );
                if (isNaN(num) || num <= 0) return;

                KFOL.removePopTips($('.pd_pop_tips'));
                itemListUrl = $itemLine.find('td:last-child').find('a:last-child').attr('href');
                var $tips = KFOL.showWaitMsg('正在获取本级已使用道具列表，请稍后...', true);
                $.get(itemListUrl, function (html) {
                    KFOL.removePopTips($tips);
                    var itemIdList = Item.getItemIdList(html, num);
                    if (itemIdList.length === 0) {
                        alert('本种类没有已使用的道具');
                        return;
                    }
                    console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                    KFOL.showWaitMsg('<strong>正在转换能量中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                        .replace('{0}', itemIdList.length)
                        , true);
                    Item.convertItemsToEnergy({
                        type: 1,
                        itemIdList: itemIdList,
                        safeId: safeId,
                        itemLevel: itemLevel,
                        itemName: itemName
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
                    .end().find('td:nth-child(3)').css('width', '105px').html('<span class="pd_usable_num">可用数</span> / <span class="pd_used_num">已用数</span>')
                    .end().find('td:last-child').css('width', '165px')
                    .before('<td style="width:135px">使用道具</td><td style="width:135px">恢复道具 和 转换能量</td>');
            }
            else {
                $this.find('td:nth-child(3)')
                    .wrapInner('<span class="pd_usable_num" style="margin-left:5px"></span>')
                    .append(' / <span class="pd_used_num">?</span>')
                    .after(
                        ('<td><a class="pd_items_batch_use" href="#" title="批量使用指定数量的道具">批量使用</a>' +
                        '<a class="pd_items_cycle_use pd_highlight {0}" href="#" title="循环使用和恢复指定数量的道具">循环使用</a></td>' +
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
        Item.bindClickForItemLink($myItems);

        var $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
        Item.addSampleItemsLink($itemName);
        Item.showItemUsedInfo($itemName.find('a'));
        Item.showCurrentUsedItemNum();
    },

    /**
     * 在我的道具页面中显示当前各种类可使用道具的数量
     */
    showCurrentUsableItemNum: function () {
        $.get('kf_fw_ig_my.php', function (html) {
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
        }, 'html');
    },

    /**
     * 在我的道具页面中显示当前各种类已使用道具的数量
     */
    showCurrentUsedItemNum: function () {
        $.get('kf_fw_ig_renew.php', function (html) {
            var energyMatches = /道具恢复能量<br\s*\/><span.+?>(\d+)<\/span><br\s*\/>点/i.exec(html);
            if (energyMatches) {
                var energy = parseInt(energyMatches[1]);
                var introMatches = /(1级道具转换得.+?点能量)。<br/.exec(html);
                if (/\/kf_fw_ig_my\.php$/i.test(location.href)) {
                    $('.kf_fw_ig_title1:last').find('span:last').remove()
                        .end().append('<span class="pd_custom_tips" style="margin-left:7px" title="{0}">(道具恢复能量 <b>{1}</b> 点)</span>'
                        .replace('{0}', introMatches ? introMatches[1] : '')
                        .replace('{1}', energy)
                    );
                }
                else {
                    $('.kf_fw_ig1 td:contains("道具恢复能量") > span').text(energy);
                }
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
                    }
                }
            }
        }, 'html');
    },

    /**
     * 添加道具样品的链接
     * @param {jQuery} $nodes 道具名称的节点列表
     */
    addSampleItemsLink: function ($nodes) {
        $nodes.each(function () {
            var $this = $(this);
            var itemName = $.trim($this.text());
            if (itemName && typeof Config.sampleItemIdList[itemName] !== 'undefined') {
                $this.html('<a href="kf_fw_ig_my.php?pro={0}&display=1">{1}</a>'.replace('{0}', Config.sampleItemIdList[itemName]).replace('{1}', itemName));
            }
        });
    },

    /**
     * 添加道具样品提示
     */
    addSampleItemTips: function () {
        var itemId = parseInt(Tools.getUrlParam('pro'));
        if (isNaN(itemId) || itemId <= 0) return;
        for (var itemName in Config.sampleItemIdList) {
            if (itemId === Config.sampleItemIdList[itemName]) {
                $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').find('span:first').after('<span class="pd_notice" style="margin-left:5px">(展示用样品)</span>');
                break;
            }
        }
    },

    /**
     * 显示道具使用情况
     * @param {jQuery} $links 道具名称的链接列表
     */
    showItemUsedInfo: function ($links) {
        $.get('kf_fw_ig_index.php', function (html) {
            var itemUsedNumList = Loot.getLootPropertyList(html)['道具使用列表'];
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
                $this.after('<span class="pd_used_item_info" title="下个道具使用成功几率：{0}">(<span style="{1}">{2}</span>/<span style="color:#F00">{3}</span>)</span>'
                    .replace('{0}', usedNum >= maxUsedNum ? '无' : nextSuccessPercent.toFixed(2) + '%')
                    .replace('{1}', usedNum >= maxUsedNum ? 'color:#F00' : '')
                    .replace('{2}', usedNum)
                    .replace('{3}', maxUsedNum)
                );
            });
        });
    },

    /**
     * 统计批量购买道具的购买价格
     * @param {jQuery} $result 购买结果的jQuery对象
     */
    statBuyItemsPrice: function ($result) {
        var successNum = 0, failNum = 0, totalPrice = 0, minPrice = 0, maxPrice = 0, totalNum = $result.find('li > a').length;
        KFOL.showWaitMsg('<strong>正在统计购买价格中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
            .replace('{0}', totalNum)
            , true);
        $(document).queue('StatBuyItemsPrice', []);
        $result.find('li > a').each(function (index) {
            var $this = $(this);
            var itemId = $this.data('id');
            if (!itemId) return;
            $(document).queue('StatBuyItemsPrice', function () {
                $.get('kf_fw_ig_my.php?pro=' + itemId, function (html) {
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
                    if (index === totalNum - 1) {
                        KFOL.removePopTips($('.pd_pop_tips'));
                        if (successNum > 0) {
                            Log.push('统计道具购买价格', '共有`{0}`个道具统计成功{1}，总计价格：`{2}`，平均价格：`{3}`，最低价格：`{4}`，最高价格：`{5}`'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '（共有`{0}`个道具未能统计成功）'.replace('{0}', failNum) : '')
                                .replace('{2}', totalPrice.toLocaleString())
                                .replace('{3}', successNum > 0 ? (totalPrice / successNum).toFixed(2).toLocaleString() : 0)
                                .replace('{4}', minPrice.toLocaleString())
                                .replace('{5}', maxPrice.toLocaleString())
                                , {pay: {'KFB': -totalPrice}}
                            );
                        }
                        console.log('统计道具购买价格（KFB）（共有{0}个道具未能统计成功），统计成功数量：{1}，总计价格：{2}，平均价格：{3}，最低价格：{4}，最高价格：{5}'
                            .replace('{0}', failNum)
                            .replace('{1}', successNum)
                            .replace('{2}', totalPrice.toLocaleString())
                            .replace('{3}', successNum > 0 ? (totalPrice / successNum).toFixed(2).toLocaleString() : 0)
                            .replace('{4}', minPrice.toLocaleString())
                            .replace('{5}', maxPrice.toLocaleString())
                        );
                        $result.append(
                            ('<li class="pd_stat"><b>统计结果{0}：</b><br /><i>统计成功数量：<em>{1}</em></i> <i>总计价格：<em>{2}</em></i> ' +
                            '<i>平均价格：<em>{3}</em></i> <i>最低价格：<em>{4}</em></i> <i>最高价格：<em>{5}</em></i></li>')
                                .replace('{0}', failNum > 0 ? '<span class="pd_notice">（共有{0}个道具未能统计成功）</span>'.replace('{0}', failNum) : '')
                                .replace('{1}', successNum)
                                .replace('{2}', totalPrice.toLocaleString())
                                .replace('{3}', successNum > 0 ? (totalPrice / successNum).toFixed(2).toLocaleString() : 0)
                                .replace('{4}', minPrice.toLocaleString())
                                .replace('{5}', maxPrice.toLocaleString())
                        );
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('StatBuyItemsPrice');
                    }, Config.defAjaxInterval);
                }, 'html');
            });
        });
        $(document).dequeue('StatBuyItemsPrice');
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
        var successNum = 0;
        $(document).queue('BatchBuyItems', []);
        $.each(new Array(settings.num), function (index) {
            $(document).queue('BatchBuyItems', function () {
                var url = 'kf_fw_ig_shop.php?lvid={0}&safeid={1}&t={2}'
                    .replace('{0}', settings.itemTypeId)
                    .replace('{1}', settings.safeId)
                    .replace('{2}', (new Date()).getTime());
                $.get(url, function (html) {
                    KFOL.showFormatLog('购买道具', html);
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    var isStop = false;
                    var matches = /<a href="kf_fw_ig_my\.php\?pro=(\d+)">/i.exec(html);
                    if (matches) {
                        successNum++;
                        $('.pd_result:last').append(
                            '<li>第{0}次：获得了<a target="_blank" href="kf_fw_ig_my.php?pro={1}" data-id="{1}">一个道具</a></li>'
                                .replace('{0}', index + 1)
                                .replace(/\{1\}/g, matches[1])
                        );
                    }
                    else if (/你需要持有该道具两倍市场价的KFB/i.test(html)) {
                        $('.pd_result:last').append('<li>第{0}次：你需要持有该道具两倍市场价的KFB，购买操作中止</li>'.replace('{0}', index + 1));
                        isStop = true;
                        $(document).queue('BatchBuyItems', []);
                    }
                    if (isStop || index === settings.num - 1) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        if (successNum > 0) {
                            Log.push('购买道具', '共有`{0}`个【`Lv.{1}：{2}`】道具购买成功'
                                .replace('{0}', successNum)
                                .replace('{1}', settings.itemLevel)
                                .replace('{2}', settings.itemName)
                                , {gain: {'道具': successNum}}
                            );
                        }
                        console.log('共有{0}个【Lv.{1}：{2}】道具购买成功'
                            .replace('{0}', successNum)
                            .replace('{1}', settings.itemLevel)
                            .replace('{2}', settings.itemName)
                        );
                        KFOL.showMsg({
                            msg: '<strong>共有<em>{0}</em>个【<em>Lv.{1}</em>{2}】道具购买成功</strong>'
                                .replace('{0}', successNum)
                                .replace('{1}', settings.itemLevel)
                                .replace('{2}', settings.itemName)
                            , duration: -1
                        });
                        if (successNum > 0) {
                            $('<li><a href="#">统计购买价格</a></li>')
                                .appendTo('.pd_result:last')
                                .find('a')
                                .click(function (e) {
                                    e.preventDefault();
                                    var $result = $(this).closest('.pd_result');
                                    $(this).parent().remove();
                                    KFOL.removePopTips($('.pd_pop_tips'));
                                    Item.statBuyItemsPrice($result, successNum);
                                });
                            Item.showItemShopBuyInfo();
                        }
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('BatchBuyItems');
                    }, typeof Config.specialAjaxInterval === 'function' ? Config.specialAjaxInterval() : Config.specialAjaxInterval);
                }, 'html');
            });
        });
        $(document).dequeue('BatchBuyItems');
    },

    /**
     * 在道具商店页面上添加批量购买道具的链接
     */
    addBatchBuyItemsLink: function () {
        var $shop = $('.kf_fw_ig1');

        $shop.find('tbody > tr:nth-child(2)')
            .find('td:nth-child(2)').css('width', '243px')
            .end().find('td:nth-child(3)').css('width', '155px')
            .end().find('td:last-child').css('width', '110px');

        $shop.find('tbody > tr:gt(1)').each(function () {
            $(this).find('td:last-child').append('<a class="pd_batch_buy_items" style="margin-left:15px" href="#">批量购买</a>');
        });

        $shop.on('click', 'a[href^="kf_fw_ig_shop.php?lvid="]', function () {
            var $this = $(this);
            var itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
            if (!itemLevel) return;
            var itemName = $this.closest('tr').find('td:nth-child(2)').text();
            if (!itemName) return;
            if (!window.confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', itemLevel).replace('{1}', itemName))) {
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
                $.trim(window.prompt('你要批量购买多少个【Lv.{0}：{1}】道具？'
                    .replace('{0}', itemLevel)
                    .replace('{1}', itemName)
                    , 0))
            );
            if (isNaN(num) || num <= 0) return;
            KFOL.showWaitMsg('<strong>正在购买道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
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
    },

    /**
     * 显示道具商店可购买情况
     */
    showItemShopBuyInfo: function () {
        $.get('profile.php?action=show&uid=' + KFOL.uid, function (html) {
            var matches = /论坛货币：(\d+)\s*KFB<br \/>/i.exec(html);
            if (!matches) return;
            var cash = parseInt(matches[1]);
            $('.kf_fw_ig_title1:last').find('span:last').remove()
                .end().append('<span style="margin-left:7px">(当前持有 <b>{0}</b> KFB)</span>'.replace('{0}', cash));
            $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(3)').each(function () {
                var $this = $(this);
                $this.find('.pd_verify_tips').remove();
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
                $this.append('<span class="pd_verify_tips" title="{0}" style="font-size:12px;margin-left:3px">({1})</span>'.replace('{0}', title).replace('{1}', tips));
            });
        });
    }
};
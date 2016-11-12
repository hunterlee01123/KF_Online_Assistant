/* 道具模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import * as Log from './Log';
import * as Public from './Public';

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
export const getTypeIdByName = function (itemName) {
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
export const getLevelByName = function (itemName) {
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
        if (/成功！/.test(response)) return {'效果': 1};
    }
    else {
        let matches = null;
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
        isTypeBatch: false,
    };
    $.extend(settings, options);

    if (cycle) {
        if (cycle.round === 1) {
            console.log(
                `循环使用道具Start，使用道具数量：${cycle.itemNum}，有效道具使用次数上限：${cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制'}，` +
                `恢复道具成功次数上限：${cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制'}`
            );
            $('.kf_fw_ig1:last').parent().append(`
<ul class="pd_result">
  <li class="pd_stat">
    <strong>
    对<em>${cycle.itemNum}</em>个【Lv.${settings.itemLevel}：${settings.itemName}】道具的循环使用开始（当前道具恢复能量<em>${cycle.totalEnergyNum}</em>点）<br>
    （有效道具使用次数上限：<em>${cycle.maxEffectiveItemCount ? cycle.maxEffectiveItemCount : '无限制'}</em>，
    恢复道具成功次数上限：<em>${cycle.maxSuccessRestoreItemCount ? cycle.maxSuccessRestoreItemCount : '无限制'}</em>）
    </strong>
  </li>
</ul>
`);
        }
        else {
            $('.pd_result:last').append('<div class="pd_result_sep"></div>');
        }
        $('.pd_result:last').append(`<li class="pd_stat" style="color: #ff3399;"><strong>第${cycle.round}轮循环开始：</strong></li>`);
    }
    if (cycle) {
        $('.pd_result:last').append('<li><strong>使用结果：</strong></li>');
    }
    else {
        $('.kf_fw_ig1:last').parent().append(
            `<ul class="pd_result"><li><strong>【Lv.${settings.itemLevel}：${settings.itemName}】使用结果：</strong></li></ul>`
        );
    }

    let successNum = 0, failNum = 0;
    let stat = {'有效道具': 0, '无效道具': 0};
    let nextRoundItemIdList = [];
    let isStop = false;
    $(document).clearQueue('UseItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('UseItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_doit.php?id=${itemId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('使用道具', html);
                    let matches = /<span style=".+?">(.+?)<\/span><br\s*\/?><a href=".+?">/i.exec(html);
                    if (matches && !/(错误的物品编号|无法再使用|该道具已经被使用)/.test(html)) {
                        successNum++;
                        nextRoundItemIdList.push(itemId);
                        let credits = getCreditsViaResponse(matches[1], settings.itemTypeId);
                        if (credits !== -1) {
                            if ($.isEmptyObject(credits)) stat['无效道具']++;
                            else stat['有效道具']++;
                            if (settings.itemTypeId <= 6) {
                                for (let key of Object.keys(credits)) {
                                    if (typeof stat[key] === 'undefined') stat[key] = credits[key];
                                    else stat[key] += credits[key];
                                }
                            }
                        }
                    }
                    else {
                        failNum++;
                        if (/无法再使用/.test(html)) nextRoundItemIdList = [];
                    }
                    $('.pd_result:last').append(
                        `<li><b>第${index + 1}次：</b>${matches ? matches[1] : '未能获得预期的回应'}</li>`
                    );
                    if (cycle && cycle.maxEffectiveItemCount && cycle.stat['有效道具'] + stat['有效道具'] >= cycle.maxEffectiveItemCount) {
                        isStop = true;
                        console.log('有效道具使用次数到达设定上限，循环使用操作停止');
                        $('.pd_result:last').append('<li><span class="pd_notice">（有效道具使用次数到达设定上限，循环操作中止）</span></li>');
                    }
                },
                error () {
                    failNum++;
                },
                complete () {
                    let $countdown = $('.pd_countdown');
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
                            Log.push(
                                '使用道具',
                                `共有\`${successNum}\`个【\`Lv.${settings.itemLevel}：${settings.itemName}\`】道具被使用`,
                                {
                                    gain: $.extend({}, stat, {'已使用道具': successNum}),
                                    pay: {'道具': -successNum}
                                }
                            );
                        }
                        let logStat = '', msgStat = '', resultStat = '';
                        for (let type of Object.keys(stat)) {
                            logStat += `，${type}+${stat[type]}`;
                            msgStat += `<i>${type}<em>+${stat[type]}</em></i>`;
                            resultStat += `<i>${type}<em>+${stat[type]}</em></i> `;
                            if (cycle) {
                                if (typeof cycle.stat[type] === 'undefined') cycle.stat[type] = stat[type];
                                else cycle.stat[type] += stat[type];
                            }
                        }
                        console.log(
                            `共有${successNum}个道具被使用${failNum > 0 ? `，共有${failNum}个道具未能使用` : ''}${logStat}`
                        );
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>个道具被使用${failNum > 0 ? `，共有<em>${failNum}</em>个道具未能使用` : ''}</strong>${msgStat}`
                            , -1
                        );
                        if (resultStat === '') resultStat = '<span class="pd_notice">无</span>';
                        $('.pd_result:last').append(
                            `<li class="pd_stat"><b>统计结果（共有<em>${successNum}</em>个道具被使用）：</b><br>${resultStat}</li>`
                        );

                        if (settings.type === 2) {
                            $('.kf_fw_ig1 input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
                                    $(this).remove();
                                });
                        }
                        else {
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
                        }
                        else if (settings.isTypeBatch) {
                            $(document).dequeue('UseItemTypes');
                        }
                    }
                    else {
                        setTimeout(
                            () => $(document).dequeue('UseItems'),
                            typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                        );
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
        $itemLine: null,
    };
    $.extend(settings, options);

    if (cycle) {
        $('.pd_result:last').append('<li class="pd_result_sep_inner"></li><li><strong>恢复结果：</strong></li>');
    }
    else {
        $('.kf_fw_ig1:last').parent().append(
            `<ul class="pd_result"><li><strong>【Lv.${settings.itemLevel}：${settings.itemName}】恢复结果：</strong></li></ul>`
        );
    }

    let successNum = 0, failNum = 0, successEnergyNum = 0;
    let perEnergyNum = getRestoreEnergyNumByLevel(settings.itemLevel);
    let isStop = false;
    let nextRoundItemIdList = [];
    $(document).clearQueue('RestoreItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('RestoreItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_doit.php?renew=${settings.safeId}&id=${itemId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('恢复道具', html);
                    let msg = '';
                    let matches = /<span style=".+?">(.+?)<\/span><br\s*\/?><a href=".+?">/i.exec(html);
                    if (matches) {
                        if (/该道具已经被恢复/.test(html)) {
                            msg = '该道具已经被恢复';
                            successNum++;
                            successEnergyNum += perEnergyNum;
                            nextRoundItemIdList.push(itemId);
                            if (cycle && cycle.maxSuccessRestoreItemCount &&
                                cycle.countStat['恢复成功次数'] + successNum >= cycle.maxSuccessRestoreItemCount
                            ) {
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
                    $('.pd_result:last').append(`<li><b>第${index + 1}次：</b>${msg}</li>`);
                },
                complete () {
                    let $countdown = $('.pd_countdown');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('RestoreItems');

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (!cycle && (successNum > 0 || failNum > 0)) {
                            Log.push(
                                '恢复道具',
                                `共有\`${successNum}\`个【\`Lv.${settings.itemLevel}：${settings.itemName}\`】道具恢复成功，共有\`${failNum}\`个道具恢复失败`,
                                {
                                    gain: {'道具': successNum},
                                    pay: {'已使用道具': -(successNum + failNum), '能量': -successEnergyNum}
                                }
                            );
                        }
                        console.log(`共有${successNum}个道具恢复成功，共有${failNum}个道具恢复失败，能量-${successEnergyNum}`);
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>个道具恢复成功，共有<em>${failNum}</em>个道具恢复失败</strong>` +
                            `<i>能量<ins>-${successEnergyNum}</ins></i>`
                            , -1
                        );
                        $('.pd_result:last').append(
                            `<li class="pd_stat">共有<em>${successNum}</em>个道具恢复成功，共有<em>${failNum}</em>个道具恢复失败，` +
                            `<i>能量<ins>-${successEnergyNum}</ins></i></li>`
                        );

                        if (settings.type === 2) {
                            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
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
                    }
                    else {
                        setTimeout(
                            () => $(document).dequeue('RestoreItems'),
                            typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                        );
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
            '恢复失败次数': 0,
        };
    }
    if (!cycle.stat || $.isEmptyObject(cycle.stat)) {
        cycle.stat = {
            '能量': 0,
            '道具': 0,
            '已使用道具': 0,
            '有效道具': 0,
            '无效道具': 0,
        };
    }

    if ($('.pd_msg').length >= 5) {
        Msg.remove($('.pd_msg:first'));
    }

    let showResult = function (type, stat) {
        let resultStat = '';
        for (let key of Object.keys(stat)) {
            if (type > 0 && (key === '道具' || key === '已使用道具')) continue;
            resultStat += `<i>${key}${Util.getStatFormatNumber(cycle.stat[key])}</i> `;
        }
        $('.pd_result:last').append(`
<li class="pd_result_sep${type > 0 ? '_inner' : ''}"></li>
<li class="pd_stat">
  <strong>
    ${type > 0 ? '截至目前为止的统计' : `【Lv.${options.itemLevel}：${options.itemName}】循环使用最终统计`}（当前道具恢复能量<em>${cycle.totalEnergyNum}</em>点）：
  </strong>
</li>
<li class="pd_stat">
  ${type > 0 ? '' : `共进行了<em>${cycle.round}</em>轮循环：`}
  <i>被使用次数<em>+${cycle.countStat['被使用次数']}</em></i>
  <i>恢复成功次数<em>+${cycle.countStat['恢复成功次数']}</em></i>
  <i>恢复失败次数<em>+${cycle.countStat['恢复失败次数']}</em></i>
</li>
<li class="pd_stat">${resultStat}</li>
`);
    };

    if (type === 1) {
        showResult(type, cycle.stat);
        Msg.wait(
            `<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${options.itemIdList.length}</em></i>` +
            `<a class="pd_stop_action" href="#">停止操作</a>`
        );
        setTimeout(function () {
            useItems(options, cycle);
        }, cycle.round === 1 ? 500 : typeof Const.cycleUseItemsFirstAjaxInterval === 'function' ? Const.cycleUseItemsFirstAjaxInterval() : Const.cycleUseItemsFirstAjaxInterval);
    }
    else if (type === 2) {
        Msg.wait(
            `<strong>正在恢复道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${options.itemIdList.length}</em></i>` +
            `<a class="pd_stop_action" href="#">停止操作</a>`
        );
        setTimeout(
            () => restoreItems(options, cycle),
            typeof Const.cycleUseItemsFirstAjaxInterval === 'function' ? Const.cycleUseItemsFirstAjaxInterval() : Const.cycleUseItemsFirstAjaxInterval
        );
    }
    else {
        if (cycle.stat['道具'] === 0) delete cycle.stat['道具'];
        if (cycle.stat['已使用道具'] === 0) delete cycle.stat['已使用道具'];
        if (cycle.stat['有效道具'] === 0) delete cycle.stat['有效道具'];
        if (cycle.stat['无效道具'] === 0) delete cycle.stat['无效道具'];
        let gain = {}, pay = {};
        for (let key in cycle.stat) {
            if (cycle.stat[key] > 0) gain[key] = cycle.stat[key];
            else pay[key] = cycle.stat[key];
        }

        if (cycle.countStat['被使用次数'] > 0) {
            Log.push(
                '循环使用道具',
                `对\`${cycle.itemNum}\`个【\`Lv.${options.itemLevel}：${options.itemName}\`】道具进行了\`${cycle.round}\`轮循环使用` +
                `(被使用次数\`+${cycle.countStat['被使用次数']}\`，恢复成功次数\`+${cycle.countStat['恢复成功次数']}\`，` +
                `恢复失败次数\`+${cycle.countStat['恢复失败次数']}\`)`,
                {gain: gain, pay: pay}
            );
        }

        console.log(
            `共进行了${cycle.round}轮循环，被使用次数+${cycle.countStat['被使用次数']}，恢复成功次数+${cycle.countStat['恢复成功次数']}，` +
            `恢复失败次数+${cycle.countStat['恢复失败次数']}，能量${cycle.stat['能量']}`
        );
        Msg.show(
            `<strong>共进行了<em>${cycle.round}</em>轮循环</strong><i>被使用次数<em>+${cycle.countStat['被使用次数']}</em></i>` +
            `<i>恢复成功次数<em>+${cycle.countStat['恢复成功次数']}</em></i><i>恢复失败次数<em>+${cycle.countStat['恢复失败次数']}</em></i>` +
            `<i>能量<ins>${cycle.stat['能量']}</ins></i><a href="#">清除消息框</a>`
            , -1
        ).find('a').click(function (e) {
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
        isTypeBatch: false,
    };
    $.extend(settings, options);
    $('.kf_fw_ig1:last').parent().append(
        `<ul class="pd_result"><li><strong>【Lv.${settings.itemLevel}：${settings.itemName}】转换结果：</strong></li></ul>`
    );

    let successNum = 0, failNum = 0;
    let energyNum = getGainEnergyNumByLevel(settings.itemLevel);
    $(document).clearQueue('ConvertItemsToEnergy');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('ConvertItemsToEnergy', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_doit.php?tomp=${settings.safeId}&id=${itemId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('将道具转换为能量', html);
                    if (/转换为了\s*\d+\s*点能量/.test(html)) {
                        successNum++;
                    }
                    else failNum++;
                },
                error () {
                    failNum++;
                },
                complete () {
                    let $countdown = $('.pd_countdown');
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
                            Log.push(
                                '将道具转换为能量',
                                `共有\`${successNum}\`个【\`Lv.${settings.itemLevel}：${settings.itemName}\`】道具成功转换为能量`,
                                {gain: {'能量': successEnergyNum}, pay: {'已使用道具': -successNum}}
                            );
                        }
                        console.log(
                            `共有${successNum}个道具成功转换为能量${failNum > 0 ? `，共有${failNum}个道具转换失败` : ''}，能量+${successEnergyNum}`
                        );
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>个道具成功转换为能量${failNum > 0 ? `，共有<em>${failNum}</em>个道具转换失败` : ''}</strong>` +
                            `<i>能量<em>+${successEnergyNum}</em></i>`
                            , -1
                        );
                        $('.pd_result:last').append(
                            `<li class="pd_stat">共有<em>${successNum}</em>个道具成功转换为能量${failNum > 0 ? `，共有<em>${failNum}</em>个道具转换失败` : ''}，` +
                            `<i>能量<em>+${successEnergyNum}</em></i></li>`
                        );

                        if (settings.type === 2) {
                            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked')
                                .closest('tr')
                                .fadeOut('normal', function () {
                                    $(this).remove();
                                });
                        }
                        setCurrentItemUsableAndUsedNum(settings.$itemLine, -successNum, null, successEnergyNum);
                        if (settings.isTypeBatch) $(document).dequeue('ConvertItemTypesToEnergy');
                    }
                    else {
                        setTimeout(() => $(document).dequeue('ConvertItemsToEnergy'), Const.defAjaxInterval);
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
        itemName: '',
    };
    $.extend(settings, options);
    $('.kf_fw_ig1:last').parent().append(
        `<ul class="pd_result"><li><strong>【Lv.${settings.itemLevel}：${settings.itemName}】出售结果：</strong></li></ul>`
    );

    let successNum = 0, failNum = 0, totalGain = 0;
    $(document).clearQueue('SellItems');
    $.each(settings.itemIdList, function (index, itemId) {
        $(document).queue('SellItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_shop.php?sell=yes&id=${itemId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('出售道具', html);
                    if (/出售成功/.test(html)) {
                        successNum++;
                        totalGain += getSellItemGainByLevel(settings.itemLevel);
                    }
                    else failNum++;
                },
                error () {
                    failNum++;
                },
                complete () {
                    let $countdown = $('.pd_countdown');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('SellItems');

                    if (isStop || index === settings.itemIdList.length - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (successNum > 0) {
                            Log.push(
                                '出售道具',
                                `共有\`${successNum}\`个【\`Lv.${settings.itemLevel}：${settings.itemName}\`】道具出售成功`,
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
                        console.log(`共有${successNum}个道具出售成功，共有${failNum}个道具出售失败，KFB+${totalGain}`);
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>个道具出售成功${failNum > 0 ? `，共有<em>${failNum}</em>个道具出售失败` : ''}</strong>` +
                            `<i>KFB<em>+${totalGain}</em></i>`
                            , -1
                        );
                        $('.pd_result:last').append(
                            `<li class="pd_stat">共有<em>${successNum}</em>个道具出售成功${failNum > 0 ? `，共有<em>${failNum}</em>个道具出售失败` : ''}，` +
                            `<i>KFB<em>+${totalGain}</em></i></li>`
                        );
                    }
                    else {
                        setTimeout(() => $(document).dequeue('SellItems'), Const.defAjaxInterval);
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
export const addSellAndUseItemsButton = function () {
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
        $(this).css('width', '163')
            .parent()
            .append(`<td style="width: 20px; padding-right: 5px;"><input class="pd_input" type="checkbox" value="${matches[1]}"></td>`);
    });
    $('.kf_fw_ig1 > tbody > tr:lt(2)').find('td').attr('colspan', 5);

    $(`
<div class="pd_item_btns">
  ${itemTypeId >= 7 && itemTypeId <= 12 ? '<button name="sellItem" style="color: #f00;" title="批量出售指定道具">出售道具</button>' : ''}
  ${itemTypeId > 1 ? '<button name="cycleUseItem" style="color: #00f;" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</button>' : ''}
  <button name="useItem" title="批量使用指定道具">使用道具</button>
  <button name="selectAll">全选</button>
  <button name="selectInverse">反选</button>
</div>
`).insertAfter('.kf_fw_ig1')
        .find('[name="useItem"]')
        .click(function () {
            Msg.destroy();
            let itemIdList = [];
            $('.kf_fw_ig1 [type="checkbox"]:checked').each(function () {
                itemIdList.push(parseInt($(this).val()));
            });
            if (!itemIdList.length) return;
            if (!confirm(`共选择了${itemIdList.length}个道具，是否批量使用道具？`)) return;
            Msg.wait(
                `<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                `<a class="pd_stop_action" href="#">停止操作</a>`
            );
            useItems({
                type: 2,
                itemIdList: itemIdList,
                safeId: safeId,
                itemLevel: itemLevel,
                itemTypeId: itemTypeId,
                itemName: itemName,
            });
        })
        .end()
        .find('[name="selectAll"]')
        .click(function () {
            $('.kf_fw_ig1 [type="checkbox"]').prop('checked', true);
        })
        .end()
        .find('[name="selectInverse"]')
        .click(function () {
            $('.kf_fw_ig1 [type="checkbox"]').each(function () {
                $(this).prop('checked', !$(this).prop('checked'));
            });
        })
        .end()
        .find('[name="cycleUseItem"]')
        .click(function () {
            Msg.destroy();
            let itemIdList = [];
            $('.kf_fw_ig1 [type="checkbox"]:checked').each(function () {
                itemIdList.push(parseInt($(this).val()));
            });
            if (!itemIdList.length) return;
            let value = prompt(
                '你要循环使用多少个道具？\n' +
                '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）'
                , itemIdList.length
            );
            if (value === null) return;
            value = $.trim(value);
            if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                alert('格式不正确');
                return;
            }
            let arr = value.split('|');
            let num = parseInt(arr[0]), maxEffectiveItemCount = 0, maxSuccessRestoreItemCount = 0;
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
                    itemName: itemName,
                }, {
                    itemNum: itemIdList.length,
                    round: 1,
                    totalEnergyNum: totalEnergyNum,
                    countStat: {},
                    stat: {},
                    maxEffectiveItemCount: maxEffectiveItemCount,
                    maxSuccessRestoreItemCount: maxSuccessRestoreItemCount,
                });
            });
        })
        .end()
        .find('[name="sellItem"]')
        .click(function () {
            Msg.destroy();
            let itemIdList = [];
            $('.kf_fw_ig1 [type="checkbox"]:checked').each(function () {
                itemIdList.push(parseInt($(this).val()));
            });
            if (!itemIdList.length) return;
            if (!confirm(`共选择了${itemIdList.length}个道具，是否批量出售道具？`)) return;
            Msg.wait(
                `<strong>正在出售道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                `<a class="pd_stop_action" href="#">停止操作</a>`
            );
            sellItems({
                itemIdList: itemIdList,
                itemLevel: itemLevel,
                itemName: itemName,
            });
        });

    showCurrentUsedItemNum();
};

/**
 * 在已使用道具列表页面上添加批量转换能量和恢复道具的按钮
 */
export const addConvertEnergyAndRestoreItemsButton = function () {
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
        $(this).css('width', '500')
            .parent()
            .append(`<td style="width: 20px; padding-right: 5px;"><input class="pd_input" type="checkbox" value="${matches[1]}"></td>`);
    });
    $(`
<div class="pd_item_btns">
  <button class="pd_highlight" name="convertEnergy" title="批量将指定道具转换为能量">转换能量</button>
  <button name="restoreItem" title="批量恢复指定道具">恢复道具</button>
  <button name="selectAll">全选</button>
  <button name="selectInverse">反选</button>
</div>
`).insertAfter('.kf_fw_ig1:eq(1)')
        .find('[name="convertEnergy"]')
        .click(function () {
            Msg.destroy();
            let itemIdList = [];
            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                itemIdList.push(parseInt($(this).val()));
            });
            if (!itemIdList.length) return;
            if (!confirm(`共选择了${itemIdList.length}个道具，是否转换为能量？`)) return;
            Msg.wait(
                `<strong>正在转换能量中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                `<a class="pd_stop_action" href="#">停止操作</a>`
            );
            convertItemsToEnergy({
                type: 2,
                itemIdList: itemIdList,
                safeId: safeId,
                itemLevel: itemLevel,
                itemName: itemName,
            });
        })
        .end()
        .find('[name="restoreItem"]')
        .click(function () {
            Msg.destroy();
            let itemIdList = [];
            $('.kf_fw_ig1:eq(1) input[type="checkbox"]:checked').each(function () {
                itemIdList.push(parseInt($(this).val()));
            });
            if (!itemIdList.length) return;
            let totalRequiredEnergyNum = itemIdList.length * getRestoreEnergyNumByLevel(itemLevel);
            if (!confirm(`共选择了${itemIdList.length}个道具，共需要${totalRequiredEnergyNum}点恢复能量，是否恢复道具？`)) return;
            let totalEnergyNum = parseInt($('.kf_fw_ig1 td:contains("道具恢复能量")').find('span').text());
            if (!totalEnergyNum || totalEnergyNum < totalRequiredEnergyNum) {
                alert('所需恢复能量不足');
                return;
            }
            Msg.wait(
                `<strong>正在恢复道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                `<a class="pd_stop_action" href="#">停止操作</a>`
            );
            restoreItems({
                type: 2,
                itemIdList: itemIdList,
                safeId: safeId,
                itemLevel: itemLevel,
                itemTypeId: itemTypeId,
                itemName: itemName,
            });
        })
        .end()
        .find('[name="selectAll"]')
        .click(function () {
            $('.kf_fw_ig1:eq(1) input[type="checkbox"]').prop('checked', true);
        })
        .end()
        .find('[name="selectInverse"]')
        .click(function () {
            $('.kf_fw_ig1:eq(1) input[type="checkbox"]').each(function () {
                $(this).prop('checked', !$(this).prop('checked'));
            });
        });
};

/**
 * 在道具恢复页面上添加批量转换道具为能量和批量恢复道具的链接
 */
export const addBatchConvertEnergyAndRestoreItemsLink = function () {
    let $myItems = $('.kf_fw_ig1:last');
    $myItems.find('tbody > tr').each(function (index) {
        let $this = $(this);
        if (index === 0) {
            $this.find('td').attr('colspan', 6);
        }
        else if (index === 1) {
            $this.find('td:nth-child(2)').attr('width', 200)
                .next('td').attr('width', 100).wrapInner('<span class="pd_used_num pd_custom_tips" style="color: #000;"></span>')
                .next('td').attr('width', 130).text('批量恢复')
                .next('td').attr('width', 160)
                .before('<td width="160">批量转换</td>');
        }
        else {
            $this.find('td:nth-child(3)')
                .wrapInner('<span class="pd_used_num pd_custom_tips"></span>')
                .end()
                .find('td:nth-child(4)')
                .html(
                    `<a class="pd_items_batch_restore ${index === 2 ? 'pd_disabled_link' : ''}" href="#" title="批量恢复指定数量的道具">批量恢复道具</a>`
                )
                .after(
                    `<td><a class="pd_items_batch_convert pd_highlight ${index === 2 ? 'pd_disabled_link' : ''}" href="#" ` +
                    `title="批量将指定数量的道具转换为能量">批量转换道具为能量</a></td>`
                );
            let matches = /lv=(\d+)/i.exec($this.find('td:last-child').find('a').attr('href'));
            if (matches) $this.data('itemTypeId', parseInt(matches[1]));
        }
    });
    bindItemActionLinksClick($myItems);

    let $itemName = $myItems.find('tbody > tr:gt(1) > td:nth-child(2)');
    addSampleItemsLink($itemName);
    showItemUsedInfo($itemName.find('a'));
    showUsedItemEnergyTips();
};

/**
 * 添加批量使用和转换指定种类的道具的按钮
 */
export const addBatchUseAndConvertItemTypesButton = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    $(`
<div class="pd_item_btns">
  <button title="批量使用指定种类的道具" data-action="useItemTypes">批量使用</button>
  <button class="pd_highlight" title="批量将指定种类的道具转换为能量" data-action="convertItemTypes">批量转换</button>
  <button data-action="selectAll">全选</button>
  <button data-action="selectInverse">反选</button>
</div>
`).insertAfter('.pd_my_items')
        .on('click', 'button', function () {
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
                    let itemListUrl = $itemLine.find('td:last-child')
                            .find(action === 'useItemTypes' ? 'a:first-child' : 'a:last-child')
                            .attr('href') + '&t=' + new Date().getTime();
                    itemTypeList.push({
                        itemTypeId: itemTypeId,
                        itemLevel: itemLevel,
                        itemName: itemName,
                        $itemLine: $itemLine,
                        itemListUrl: itemListUrl,
                    });
                });
                if (!itemTypeList.length) return;
                let num = parseInt(prompt(`在指定种类道具中你要${action === 'useItemTypes' ? '使用' : '转换'}多少个道具？（0表示不限制）`, 0));
                if (isNaN(num) || num < 0) return;
                Msg.destroy();

                let queueName = action === 'useItemTypes' ? 'UseItemTypes' : 'ConvertItemTypesToEnergy';
                $(document).clearQueue(queueName);
                $.each(itemTypeList, function (index, data) {
                    $(document).queue(queueName, function () {
                        let $wait = Msg.wait(`正在获取本种类${action === 'useItemTypes' ? '未' : '已'}使用道具列表，请稍后&hellip;`);
                        $.ajax({
                            type: 'GET',
                            url: data.itemListUrl,
                            timeout: Const.defAjaxTimeout,
                            success (html) {
                                Msg.remove($wait);
                                let itemIdList = getItemIdList(html, num);
                                if (!itemIdList.length) {
                                    $(document).dequeue(queueName);
                                    return;
                                }

                                if (action === 'useItemTypes') {
                                    console.log('批量使用道具Start，使用道具数量：' + itemIdList.length);
                                    Msg.wait(
                                        `<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                                        `<a class="pd_stop_action" href="#">停止操作</a>`
                                    );
                                    useItems({
                                        type: 1,
                                        itemIdList: itemIdList,
                                        safeId: safeId,
                                        itemLevel: data.itemLevel,
                                        itemTypeId: data.itemTypeId,
                                        itemName: data.itemName,
                                        $itemLine: data.$itemLine,
                                        isTypeBatch: true,
                                    });
                                }
                                else {
                                    console.log('批量转换道具为能量Start，转换道具数量：' + itemIdList.length);
                                    Msg.wait(
                                        `<strong>正在转换能量中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                                        `<a class="pd_stop_action" href="#">停止操作</a>`
                                    );
                                    convertItemsToEnergy({
                                        type: 1,
                                        itemIdList: itemIdList,
                                        safeId: safeId,
                                        itemLevel: data.itemLevel,
                                        itemName: data.itemName,
                                        $itemLine: data.$itemLine,
                                        isTypeBatch: true,
                                    });
                                }
                            },
                            error () {
                                Msg.remove($wait);
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
            let num = parseInt(
                prompt(
                    `你要使用多少个【Lv.${itemLevel}：${itemName}】道具？（0表示不限制）`,
                    itemUsableNum ? itemUsableNum : 0
                )
            );
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
                Msg.wait(
                    `<strong>正在使用道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                    `<a class="pd_stop_action" href="#">停止操作</a>`
                );
                useItems({
                    type: 1,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName,
                    $itemLine: $itemLine,
                });
            });
        }
        else if ($this.is('.pd_items_cycle_use')) {
            let value = prompt(
                `你要循环使用多少个【Lv.${itemLevel}：${itemName}】道具？\n` +
                '（可直接填写道具数量，也可使用“道具数量|有效道具使用次数上限|恢复道具成功次数上限”的格式[设为0表示不限制]，例一：7；例二：5|3；例三：3|0|6）'
                , itemUsableNum ? itemUsableNum : 0
            );
            if (value === null) return;
            value = $.trim(value);
            if (!/\d+(\|\d+)?(\|\d+)?/.test(value)) {
                alert('格式不正确');
                return;
            }
            let arr = value.split('|');
            let num = 0, maxEffectiveItemCount = 0, maxSuccessRestoreItemCount = 0;
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
                            $itemLine: $itemLine,
                        }, {
                            itemNum: itemIdList.length,
                            round: 1,
                            totalEnergyNum: totalEnergyNum,
                            countStat: {},
                            stat: {},
                            maxEffectiveItemCount: maxEffectiveItemCount,
                            maxSuccessRestoreItemCount: maxSuccessRestoreItemCount,
                        });
                    });
                });
            });
        }
        else if ($this.is('.pd_items_batch_restore')) {
            let num = parseInt(
                prompt(`你要恢复多少个【Lv.${itemLevel}：${itemName}】道具？（0表示不限制）`, itemUsedNum ? itemUsedNum : 0)
            );
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
                Msg.wait(
                    `<strong>正在恢复道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                    `<a class="pd_stop_action" href="#">停止操作</a>`
                );
                restoreItems({
                    type: 1,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemTypeId: itemTypeId,
                    itemName: itemName,
                    $itemLine: $itemLine,
                });
            });
        }
        else if ($this.is('.pd_items_batch_convert')) {
            let num = parseInt(
                prompt(`你要将多少个【Lv.${itemLevel}：${itemName}】道具转换为能量？（0表示不限制）`, itemUsedNum ? itemUsedNum : 0)
            );
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
                Msg.wait(
                    `<strong>正在转换能量中&hellip;</strong><i>剩余：<em class="pd_countdown">${itemIdList.length}</em></i>` +
                    `<a class="pd_stop_action" href="#">停止操作</a>`
                );
                convertItemsToEnergy({
                    type: 1,
                    itemIdList: itemIdList,
                    safeId: safeId,
                    itemLevel: itemLevel,
                    itemName: itemName,
                    $itemLine: $itemLine,
                });
            });
        }
    });
};

/**
 * 增强我的道具页面
 */
export const enhanceMyItemsPage = function () {
    let $myItems = $('.kf_fw_ig1:last');
    $myItems.addClass('pd_my_items').find('tbody > tr').each(function (index) {
        let $this = $(this);
        if (index === 0) {
            $this.find('td').attr('colspan', 6);
        }
        else if (index === 1) {
            $this.find('td:first-child').css('width', '75px')
                .end().find('td:nth-child(2)').css('width', '185px')
                .end().find('td:nth-child(3)').css('width', '105px')
                .html('<span class="pd_usable_num">可用数</span> / <span class="pd_used_num pd_custom_tips">已用数</span>')
                .end().find('td:last-child').css('width', '165px')
                .before('<td style="width: 135px;">使用道具</td><td style="width: 135px;">恢复道具 和 转换能量</td>');
        }
        else {
            $this.find('td:first-child').prepend('<input class="pd_input pd_item_type_chk" type="checkbox">');
            let isDisabledLink = index === 2 ? 'pd_disabled_link' : '';
            $this.find('td:nth-child(3)')
                .wrapInner('<span class="pd_usable_num" style="margin-left: 5px;"></span>')
                .append(' / <span class="pd_used_num pd_custom_tips">?</span>')
                .after(`
<td>
  <a class="pd_items_batch_use" href="#" title="批量使用指定数量的道具">批量使用</a>
  <a class="pd_items_cycle_use pd_highlight ${isDisabledLink}" href="#" title="循环使用和恢复指定数量的道具，直至停止操作或没有道具可以恢复">循环使用</a>
</td>
<td>
  <a class="pd_items_batch_restore ${isDisabledLink}" href="#" title="批量恢复指定数量的道具">批量恢复</a>
  <a class="pd_items_batch_convert pd_highlight ${isDisabledLink}" href="#" title="批量将指定数量的道具转换为能量">批量转换</a>
</td>
`);
            let $listLinkColumn = $this.find('td:last-child');
            let matches = /lv=(\d+)/i.exec($listLinkColumn.find('a').attr('href'));
            if (matches) {
                let itemTypeId = parseInt(matches[1]);
                $this.data('itemTypeId', itemTypeId);
                $listLinkColumn.find('a').text('未使用列表')
                    .after(`<a class="pd_highlight" href="kf_fw_ig_renew.php?lv=${itemTypeId}">已使用列表</a>`);
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
            }
            else {
                $itemUsed.text(num + usedChangeNum);
                showUsedItemEnergyTips();
            }
        }
        if (usableChangeNum) {
            let $itemUsable = $itemLine.find('td:nth-child(3) > .pd_usable_num');
            if ($itemUsable.length > 0) {
                let num = parseInt($itemUsable.text());
                if (isNaN(num) || num + usableChangeNum < 0) flag = true;
                else $itemUsable.text(num + usableChangeNum);
            }
        }
    }
    if (energyChangeNum) {
        let $totalEnergy = $('.pd_total_energy_num');
        if (location.pathname === '/kf_fw_ig_renew.php')
            $totalEnergy = $('.kf_fw_ig1:first > tbody > tr:nth-child(2) > td:contains("道具恢复能量") > span');
        if ($totalEnergy.length > 0) {
            let num = parseInt($totalEnergy.text());
            if (isNaN(num) || num + energyChangeNum < 0) flag = true;
            else $totalEnergy.text(num + energyChangeNum);
        }
        else {
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
    let totalRestoreEnergy = 0, totalConvertEnergy = 0;
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
        $this.attr('title', `全部恢复需要${perRestoreEnergy * itemNum}点能量，全部转换可得${perConvertEnergy * itemNum}点能量`);
    });
    $('.kf_fw_ig1:last > tbody > tr:nth-child(2) > td:nth-child(3) > .pd_used_num')
        .attr('title', `全部恢复需要${totalRestoreEnergy}点能量，全部转换可得${totalConvertEnergy}点能量`);
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
    let show = function (html) {
        let energyNum = getCurrentEnergyNum(html);
        let introMatches = /(1级道具转换得.+?点能量)。<br/.exec(html);
        if (location.pathname === '/kf_fw_ig_my.php') {
            $('.kf_fw_ig_title1:last').find('span:has(.pd_total_energy_num)').remove()
                .end()
                .append(
                    `<span class="pd_custom_tips" style="margin-left: 7px;" title="${introMatches ? introMatches[1] : ''}">` +
                    `(道具恢复能量 <b class="pd_total_energy_num" style="font-size: 14px;">${energyNum}</b> 点)</span>`
                );
        }
        else {
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
    }
    else {
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
    let show = function (html) {
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
    }
    else {
        $.get('kf_fw_ig_my.php?t=' + new Date().getTime(), html => show(html));
    }
};

/**
 * 获取道具使用情况
 * @param html 争夺首页的HTML代码
 * @returns {Map} 道具使用情况对象
 */
export const getItemUsedInfo = function (html) {
    let itemUsedNumList = new Map([
        ['蕾米莉亚同人漫画', 0],
        ['十六夜同人漫画', 0],
        ['档案室钥匙', 0],
        ['傲娇LOLI娇蛮音CD', 0],
        ['消逝之药', 0],
        ['整形优惠卷', 0],
    ]);
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
    let tipsList = [
        '仅供参考', '←谁信谁傻逼', '←不管你信不信，反正我是信了', '要是失败了出门左转找XX风', '退KFOL保一生平安', '←这一切都是XX风的阴谋',
        '这样的几率大丈夫？大丈夫，萌大奶！', '玄不救非，氪不改命', '严重警告：此地的概率学已死', '←概率对非洲人是不适用的', '要相信RP守恒定律',
    ];
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
            if (usedNum > maxUsedNum) nextSuccessPercent = 0;
            else nextSuccessPercent = (1 - usedNum / maxUsedNum) * 100;
            let tips = '';
            if (usedNum < maxUsedNum && usedNum > 0) tips = `（${tipsList[Math.floor(Math.random() * tipsList.length)]}）`;
            $this.after(
                `<span class="pd_used_item_info" title="下个道具使用成功几率：${usedNum >= maxUsedNum ? '无' : nextSuccessPercent.toFixed(2) + '%'}${tips}">` +
                `(<span style="${usedNum >= maxUsedNum ? 'color: #f00;' : ''}">${usedNum}</span>/<span style="color: #f00;">${maxUsedNum}</span>)</span>`
            );
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
        if (itemName && Const.sampleItemIdList.has(itemName)) {
            let title = '';
            if (itemName !== '零时迷子的碎片') {
                title = `恢复此道具需${getRestoreEnergyNumByLevel(itemLevel)}点能量，转换此道具可得${getGainEnergyNumByLevel(itemLevel)}点能量`;
            }
            else {
                title = '此道具不可恢复和转换';
            }
            $this.html(`<a href="kf_fw_ig_my.php?pro=${Const.sampleItemIdList.get(itemName)}&display=1" title="${title}">${itemName}</a>`);
        }
    });
};

/**
 * 添加道具样品提示
 */
export const addSampleItemTips = function () {
    let id = parseInt(Util.getUrlParam('pro'));
    if (isNaN(id) || id <= 0) return;
    for (let itemId of Const.sampleItemIdList.values()) {
        if (id === itemId) {
            $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child')
                .find('span:first')
                .after('<span class="pd_notice" style="margin-left: 5px;">(展示用样品)</span>');
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
        itemName: '',
    };
    $.extend(settings, options);
    $('.kf_fw_ig1').parent().append(
        `<ul class="pd_result"><li><strong>【Lv.${settings.itemLevel}：${settings.itemName}】购买结果：</strong></li></ul>`
    );

    let successNum = 0, failNum = 0;
    let isStop = false;
    $(document).clearQueue('BatchBuyItems');
    $.each(new Array(settings.num), function (index) {
        $(document).queue('BatchBuyItems', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_shop.php?lvid=${settings.itemTypeId}&safeid=${settings.safeId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('购买道具', html);
                    let msg = '';
                    let matches = /<a href="kf_fw_ig_my\.php\?pro=(\d+)">/i.exec(html);
                    if (matches) {
                        successNum++;
                        msg = `获得了<a target="_blank" href="kf_fw_ig_my.php?pro=${matches[1]}" data-id="${matches[1]}">一个道具</a>`;
                    }
                    else if (/你需要持有该道具两倍市场价的KFB/i.test(html)) {
                        msg = '你需要持有该道具两倍市场价的KFB<span class="pd_notice">（购买操作中止）</span>';
                        isStop = true;
                    }
                    else {
                        msg = '未能获得预期的回应';
                    }
                    $('.pd_result:last').append(`<li><b>第${index + 1}次：</b>${msg}</li>`);
                },
                error () {
                    failNum++;
                },
                complete () {
                    let $countdown = $('.pd_countdown');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('BatchBuyItems');

                    if (isStop || index === settings.num - 1) {
                        Msg.remove($countdown.closest('.pd_msg'));
                        if (successNum > 0) {
                            Log.push(
                                '购买道具',
                                `共有\`${successNum}\`个【\`Lv.${settings.itemLevel}：${settings.itemName}\`】道具购买成功`,
                                {gain: {'道具': successNum}}
                            );
                        }
                        console.log(
                            `共有${successNum}个【Lv.${settings.itemLevel}：${settings.itemName}】道具购买成功` +
                            (failNum > 0 ? `，共有${failNum}个道具购买失败` : '')
                        );
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>个【<em>Lv.${settings.itemLevel}</em>${settings.itemName}】道具购买成功` +
                            `${failNum > 0 ? `，共有<em>${failNum}</em>个道具购买失败` : ''}</strong>`
                            , -1
                        );

                        if (successNum > 0) {
                            $('<li><a href="#">统计购买价格</a></li>')
                                .appendTo('.pd_result:last')
                                .find('a')
                                .click(function (e) {
                                    e.preventDefault();
                                    let $result = $(this).closest('.pd_result');
                                    $(this).parent().remove();
                                    Msg.destroy();
                                    statBuyItemsPrice($result, settings.itemLevel, settings.itemName);
                                });
                            showItemShopBuyInfo();
                        }
                    }
                    else {
                        setTimeout(
                            () => $(document).dequeue('BatchBuyItems'),
                            typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                        );
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
    let successNum = 0, failNum = 0, totalPrice = 0, minPrice = 0, maxPrice = 0, marketPrice = 0, totalNum = $result.find('li > a').length;
    $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        if ($this.find('a').text() === itemName) {
            marketPrice = parseInt($this.next('td').find('.pd_item_price').text());
            return false;
        }
    });
    if (!marketPrice) marketPrice = 1;
    Msg.wait(`<strong>正在统计购买价格中&hellip;</strong><i>剩余：<em class="pd_countdown">${totalNum}</em></i>`);
    $(document).clearQueue('StatBuyItemsPrice');
    $result.find('li > a').each(function (index) {
        let $this = $(this);
        let itemId = $this.data('id');
        if (!itemId) return;
        $(document).queue('StatBuyItemsPrice', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_ig_my.php?pro=${itemId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    let $countdown = $('.pd_countdown');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let matches = /从商店购买，购买价(\d+)KFB。<br/.exec(html);
                    if (matches) {
                        successNum++;
                        let price = parseInt(matches[1]);
                        totalPrice += price;
                        if (minPrice === 0) minPrice = price;
                        else if (price < minPrice) minPrice = price;
                        if (price > maxPrice) maxPrice = price;
                        $this.after(`（购买价：<b class="pd_highlight">${price}</b>KFB）`);
                    }
                    else {
                        failNum++;
                        $this.after('<span class="pd_notice">（未能获得预期的回应）</span>');
                    }
                },
                error () {
                    failNum++;
                    $this.after('<span class="pd_notice">（连接超时）</span>');
                },
                complete () {
                    if (index === totalNum - 1) {
                        Msg.destroy();
                        if (successNum > 0) {
                            Log.push(
                                '统计道具购买价格',
                                `共有\`${successNum}\`个【\`Lv.${itemLevel}：${itemName}\`】道具统计成功` +
                                `${failNum > 0 ? `（共有\`${failNum}\`个道具未能统计成功）` : ''}，总计价格：\`${totalPrice.toLocaleString()}\`，` +
                                `平均价格：\`${successNum > 0 ? Util.getFixedNumLocStr(totalPrice / successNum, 2) : 0}\`` +
                                `(\`${successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0}%\`)，` +
                                `最低价格：\`${minPrice.toLocaleString()}\`(\`${Math.round(minPrice / marketPrice * 100)}%\`)，` +
                                `最高价格：\`${maxPrice.toLocaleString()}\`(\`${Math.round(maxPrice / marketPrice * 100)}%\`)`,
                                {pay: {'KFB': -totalPrice}}
                            );
                        }
                        console.log(
                            `统计道具购买价格（KFB）（共有${failNum}个道具未能统计成功），统计成功数量：${successNum}，总计价格：${totalPrice.toLocaleString()}，` +
                            `平均价格：${successNum > 0 ? Util.getFixedNumLocStr(totalPrice / successNum, 2) : 0} ` +
                            `(${successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0}%)，最低价格：${minPrice.toLocaleString()} ` +
                            `(${Math.round(minPrice / marketPrice * 100)}%)，最高价格：${maxPrice.toLocaleString()} (${Math.round(maxPrice / marketPrice * 100)}%)`
                        );
                        $result.append(`
<li class="pd_stat">
  <b>统计结果${failNum > 0 ? `<span class="pd_notice">（共有${failNum}个道具未能统计成功）</span>` : ''}：</b><br>
  <i>统计成功数量：<em>${successNum}</em></i>
  <i>总计价格：<em>${totalPrice.toLocaleString()}</em></i>
  <i>平均价格：<em>${successNum > 0 ? Util.getFixedNumLocStr(totalPrice / successNum, 2) : 0} 
(${successNum > 0 ? Math.round(totalPrice / successNum / marketPrice * 100) : 0}%)</em></i>
  <i>最低价格：<em>${minPrice.toLocaleString()} (${Math.round(minPrice / marketPrice * 100)}%)</em></i>
  <i>最高价格：<em>${maxPrice.toLocaleString()} (${Math.round(maxPrice / marketPrice * 100)}%)</em></i>
</li>
`);
                    }
                    else {
                        setTimeout(() => $(document).dequeue('StatBuyItemsPrice'), Const.defAjaxInterval);
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
export const addBatchBuyItemsLink = function () {
    let $shop = $('.kf_fw_ig1:first');

    $shop.find('tbody > tr:nth-child(2)')
        .find('td:nth-child(2)').css('width', '243px')
        .end().find('td:nth-child(3)').css('width', '155px')
        .end().find('td:last-child').css('width', '110px');

    $shop.find('tbody > tr:gt(1)').each(function () {
        $(this).find('td:nth-child(3)').wrapInner('<span class="pd_item_price"></span>')
            .end().find('td:last-child').append('<a class="pd_batch_buy_items" style="margin-left: 15px;" href="#">批量购买</a>');
    });

    $shop.on('click', 'a[href^="kf_fw_ig_shop.php?lvid="]', function () {
        let $this = $(this);
        let itemLevel = parseInt($this.closest('tr').find('td:first-child').text());
        if (!itemLevel) return;
        let itemName = $this.closest('tr').find('td:nth-child(2) > a').text();
        if (!itemName) return;
        if (!confirm(`是否购买【Lv.${itemLevel}：${itemName}】道具？`)) {
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
        let num = parseInt(
            prompt(`你要批量购买多少个【Lv.${itemLevel}：${itemName}】道具？`, 0)
        );
        if (!num || num < 0) return;
        Msg.wait(
            `<strong>正在购买道具中&hellip;</strong><i>剩余：<em class="pd_countdown">${num}</em></i><a class="pd_stop_action" href="#">停止操作</a>`
        );
        buyItems({itemTypeId, num, safeId, itemLevel, itemName});
    });

    $shop.find('tbody > tr:gt(1) > td:nth-child(4)').each(function () {
        let $this = $(this);
        let price = parseInt($this.prev('td').text());
        if (isNaN(price)) return;
        $this.addClass('pd_custom_tips')
            .attr('title', `${Math.floor(price * 0.5)}~${price * 2}（均价：${Math.floor(price * 1.25)}）`);
    });

    let $itemName = $shop.find('tbody > tr:gt(1) > td:nth-child(2)');
    addSampleItemsLink($itemName);
    showItemUsedInfo($itemName.find('a'));
    showItemShopBuyInfo();
    $shop.find('tbody > tr:first-child > td').append(
        '<br><span class="pd_highlight">想买道具却害怕使用失败？快来试试' +
        '<a href="read.php?tid=526110" target="_blank" title="喵拉布丁：我绝对没收广告费~">道具使用险</a>吧！</span>'
    );
};

/**
 * 显示道具商店可购买情况
 */
const showItemShopBuyInfo = function () {
    $.get(`profile.php?action=show&uid=${Info.uid}&t=${new Date().getTime()}`, function (html) {
        let matches = /论坛货币：(\d+)\s*KFB<br/i.exec(html);
        if (!matches) return;
        let cash = parseInt(matches[1]);
        $('.kf_fw_ig_title1:last').find('span:last').remove()
            .end().append(`<span style="margin-left: 7px;">(当前持有 <b style="font-size: 14px;">${cash}</b> KFB)</span>`);
        $('.kf_fw_ig1:first > tbody > tr:gt(1) > td:nth-child(3) > .pd_item_price').each(function () {
            let $this = $(this);
            $this.next('.pd_verify_tips').remove();
            let price = parseInt($this.text());
            if (isNaN(price)) return;
            let tips = '', title = '';
            if (price * 2 <= cash) {
                tips = '<span style="color: #669933;">可买</span>';
                title = '有足够KFB购买此道具';
            }
            else {
                tips = `<span style="color: #ff0033;">差${price * 2 - cash}</span>`;
                title = `还差${price * 2 - cash}KFB才可购买此道具`;
            }
            $this.after(`<span class="pd_verify_tips" title="${title}" style="font-size: 12px; margin-left: 3px;">(${tips})</span>`);
        });
    });
};

/**
 * 修正道具描述
 */
export const modifyItemDescription = function () {
    let $area = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child');
    let matches = /道具名称：(.+)/.exec($area.find('span:first').text().trim());
    if (!matches) return;
    let itemName = matches[1];
    let itemDescReplaceList = new Map([
        ['蕾米莉亚同人漫画', ['燃烧伤害+1。上限50。', '力量+1，体质+1；满50本时，追加+700生命值。']],
        ['十六夜同人漫画', ['命中+3，闪避+1。上限50。', '敏捷+1，灵活+1；满50本时，追加+100攻击速度。']],
        ['档案室钥匙', ['暴击伤害加成+10%。上限30。', '增加5%盒子获得概率[原概率*(100%+追加概率)]；满30枚时，增加50点可分配点数。']],
        ['傲娇LOLI娇蛮音CD', ['闪避+3，命中+1。上限30。', '降低对手生命值上限的0.5%；满30张时，追加降低对手10%攻击力。']],
        ['整形优惠卷', [
            ['暴击几率+3%。上限10。'],
            ['在获得盒子时，增加3%的几率直接获得高一级的盒子；<br>满10张时，这个概率直接提升为50%(无法将传奇盒子升级为神秘盒子)。']
        ]],
        ['消逝之药', ['消除伤害。<br>防御效果+7%。上限10。', '所有属性+5(不含耐力、幸运)；满10瓶时，追加200点可分配点数。']],
    ]);
    if (itemDescReplaceList.has(itemName)) {
        $area.html($area.html().replace(itemDescReplaceList.get(itemName)[0], itemDescReplaceList.get(itemName)[1]));
    }
};

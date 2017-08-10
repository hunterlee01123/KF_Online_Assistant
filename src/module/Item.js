/* 物品模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import * as Dialog from './Dialog';
import Const from './Const';
import {read as readConfig, write as writeConfig} from './Config';
import * as Log from './Log';
import * as Script from './Script';
import * as Public from './Public';
import * as Loot from './Loot';

// 盒子区域
let $boxArea;
// 装备区域
let $armArea;
// 物品区域
let $itemArea;
// SafeID
let safeId;

// 盒子种类列表
export const boxTypeList = ['普通盒子', '幸运盒子', '稀有盒子', '传奇盒子', '神秘盒子'];

// 装备组别列表
export const armGroupList = ['长剑', '短弓', '法杖'];
// 装备种类列表
export const armTypeList = ['普通的装备', '幸运的装备', '稀有的装备', '传奇的装备', '神秘的装备'];

// 道具种类列表
export const itemTypeList = [
    '零时迷子的碎片', '被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画', '十六夜同人漫画',
    '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药',
];

/**
 * 初始化
 */
export const init = function () {
    safeId = Public.getSafeId();
    if (!safeId) return;
    $boxArea = $('.kf_fw_ig1:eq(0)');
    $armArea = $('.kf_fw_ig4:eq(0)');
    $itemArea = $('.kf_fw_ig1:eq(1)');

    addBatchOpenBoxesLink();
    addOpenAllBoxesButton();

    handleArmArea($armArea);
    bindArmLinkClickEvent($armArea, safeId);

    addArmsButton();
    addBatchUseAndSellItemsButton();

    if (localStorage.getItem(Const.storagePrefix + 'myObjectsInfo_' + Info.uid)) {
        localStorage.removeItem(Const.storagePrefix + 'myObjectsInfo_' + Info.uid);
    }
};

/**
 * 获取下一批物品
 * @param {number} sequence 下一批物品的插入顺序，1：向前插入；2：往后添加
 * @param {function} callback 回调函数
 */
export const getNextObjects = function (sequence, callback = null) {
    console.log('获取下一批物品Start');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_mybp.php?t=' + $.now(),
        timeout: Const.defAjaxTimeout,
    }).done(function (html) {
        for (let index = 1; index <= 2; index++) {
            let matches = null;
            if (index === 1) {
                matches = /<tr><td width="\d+%">装备.+?\r\n(<tr.+?<\/tr>)<tr><td colspan="4">/.exec(html);
            }
            else {
                matches = /<tr><td width="\d+%">使用.+?\r\n(<tr.+?<\/tr>)<tr><td colspan="4">/.exec(html);
            }
            if (!matches) continue;
            let trMatches = matches[1].match(/<tr(.+?)<\/tr>/g);
            let $area = index === 1 ? $armArea : $itemArea;
            let addHtml = '';
            for (let i in trMatches) {
                let idMatches = /"wp_(\d+)"/.exec(trMatches[i]);
                if (!idMatches) continue;
                if (!$area.has(`[id="wp_${idMatches[1]}"]`).length) {
                    addHtml += trMatches[i];
                }
            }
            if (addHtml) {
                if (sequence === 2) {
                    $area.find('> tbody > tr:last-child').before(addHtml);
                }
                else {
                    $area.find('> tbody > tr:nth-child(2)').after(addHtml);
                }
                if (index === 1) {
                    handleArmArea($armArea);
                }
            }
        }
        if (typeof callback === 'function') callback();
    }).fail(function () {
        setTimeout(() => getNextObjects(sequence, callback), Const.defAjaxInterval);
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
        $armArea.find('> tbody > tr:nth-child(2)').after('<tr><td colspan="3" style="color: #777;">以上为新装备</td></tr>');
        Msg.destroy();
        openBoxes({id, boxType, num, safeId});
    });
};

/**
 * 添加一键开盒按钮
 */
const addOpenAllBoxesButton = function () {
    $(`
<div class="pd_item_btns" data-name="openBoxesBtns">
  <button name="clearMsg" type="button" title="清除页面上所有的消息框">清除消息框</button>
  <button name="openAllBoxes" type="button" style="color: #f00;" title="打开全部盒子">一键开盒</button>
</div>
`).insertAfter($boxArea).find('[name="clearMsg"]').click(Msg.destroy)
        .end().find('[name="openAllBoxes"]').click(showOpenAllBoxesDialog);
    Public.addSlowActionChecked($('.pd_item_btns[data-name="openBoxesBtns"]'));
};

/**
 * 显示一键开盒对话框
 */
const showOpenAllBoxesDialog = function () {
    const dialogName = 'pdOpenAllBoxesDialog';
    if ($('#' + dialogName).length > 0) return;
    Msg.destroy();
    readConfig();

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
        readConfig();
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
            if (typeList.length > 0) Config.defSmeltArmTypeList = typeList;
            else Config.smeltArmsAfterOpenBoxesEnabled = false;
        }
        if (Config.useItemsAfterOpenBoxesEnabled) {
            let typeList = $dialog.find('select[name="useItemTypes"]').val();
            if (Array.isArray(typeList)) Config.defUseItemTypeList = typeList;
            else Config.useItemsAfterOpenBoxesEnabled = false;
        }
        if (Config.sellItemsAfterOpenBoxesEnabled) {
            let typeList = $dialog.find('select[name="sellItemTypes"]').val();
            if (Array.isArray(typeList)) Config.defSellItemTypeList = typeList;
            else Config.sellItemsAfterOpenBoxesEnabled = false;
        }

        writeConfig();
        if (!Config.defOpenBoxTypeList.length) {
            alert('未选择盒子种类');
            return;
        }
        if (!confirm('是否一键开盒（并执行所选操作）？')) return;
        Dialog.close(dialogName);
        $armArea.find('> tbody > tr:nth-child(2)').after('<tr><td colspan="3" style="color: #777;">以上为新装备</td></tr>');
        $(document).clearQueue('OpenAllBoxes');
        $boxArea.find('> tbody > tr:nth-child(2) > td').each(function (index) {
            let $this = $(this);
            let boxType = $this.find('span:first').text().trim() + '盒子';
            if (!Config.defOpenBoxTypeList.includes(boxType)) return;
            let num = parseInt($this.find('span:last').text());
            if (!num || num < 0) return;
            let id = parseInt($boxArea.find(`> tbody > tr:nth-child(3) > td:nth-child(${index + 1}) > a[data-name="openBoxes"]`).data('id'));
            if (!id) return;
            $(document).queue('OpenAllBoxes', () => openBoxes({id, boxType, num, safeId, nextActionEnabled: true}));
        });
        $(document).dequeue('OpenAllBoxes');
    }).end().find('a[data-name="selectAll"]').click(() => Util.selectAll($smeltArmTypeList.find('input[name="smeltArmsType"]')))
        .end().find('a[data-name="selectInverse"]').click(() => Util.selectInverse($smeltArmTypeList.find('input[name="smeltArmsType"]')));

    $dialog.on('keydown', 'select[name$="Types"]', (function (e) {
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            $(this).children().prop('selected', true);
        }
    })).find('legend [type="checkbox"]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            $this.prop('checked', Config[name] === true);
        }
    });

    $dialog.find('select[name$="Types"]').each(function (index) {
        let $this = $(this);
        let typeList = Config.defOpenBoxTypeList;
        if (index === 1) typeList = Config.defUseItemTypeList;
        else if (index === 2) typeList = Config.defSellItemTypeList;
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
const openBoxes = function ({id, boxType, num, safeId, nextActionEnabled = false}) {
    let successNum = 0, failNum = 0, index = 0;
    let randomTotalNum = 0, randomTotalCount = 0;
    let isStop = false;
    let stat = {'KFB': 0, '经验值': 0, '道具': 0, '装备': 0, item: {}, arm: {}};

    /**
     * 打开
     */
    const open = function () {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=3&id=${id}&safeid=${safeId}`,
            timeout: Const.defAjaxTimeout,
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
            }
            else if (msg.includes('操作过快')) {
                $(document).queue('OpenBoxes', open);
            }
            else if (msg.includes('盒子不足')) {
                $(document).clearQueue('OpenBoxes');
                isStop = true;
            }
            else {
                failNum++;
            }

            console.log(`第${index}次：${msg}`);
            $('.pd_result[data-name="boxResult"]:last').append(`<li><b>第${index}次：</b>${msg}</li>`);
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
                    if (!value || ($.type(value) === 'object' && $.isEmptyObject(value))) {
                        delete stat[key];
                    }
                }
                if (!$.isEmptyObject(stat)) {
                    Log.push(
                        '打开盒子',
                        `共有\`${successNum}\`个【\`${boxType}\`】打开成功 (平均随机值【\`${avgRandomNum}\`】)`,
                        {
                            gain: stat,
                            pay: {'盒子': -successNum}
                        }
                    );
                }

                let $currentNum = $boxArea.find(`> tbody > tr:nth-child(2) > td:nth-child(${id}) > span:last`);
                let prevNum = parseInt($currentNum.text());
                if (prevNum > 0) {
                    $currentNum.text(prevNum - successNum);
                }

                let resultStatHtml = '', msgStatHtml = '';
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
                    }
                    else {
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
                console.log(
                    `共有${successNum}个【${boxType}】打开成功（平均随机值【${avgRandomNum}】）${failNum > 0 ? `，共有${failNum}个盒子打开失败` : ''}`
                );
                Msg.show(
                    `<strong>共有<em>${successNum}</em>个【${boxType}】打开成功（平均随机值【<em>${avgRandomNum}</em>】）` +
                    `${failNum > 0 ? `，共有<em>${failNum}</em>个盒子打开失败` : ''}</strong>${msgStatHtml.length > 25 ? '<br>' + msgStatHtml : msgStatHtml}`,
                    -1
                );

                Script.runFunc('Item.openBoxes_after_', stat);
                setTimeout(() => getNextObjects(1), Const.defAjaxInterval);
                if ($(document).queue('OpenAllBoxes').length > 0) {
                    setTimeout(
                        () => $(document).dequeue('OpenAllBoxes'),
                        typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                    );
                }
                else if (nextActionEnabled) {
                    let action = null;
                    if (Config.smeltArmsAfterOpenBoxesEnabled) {
                        action = () => smeltArms(Config.defSmeltArmTypeList, safeId, nextActionEnabled);
                    }
                    else if (Config.useItemsAfterOpenBoxesEnabled) {
                        action = () => useItems(Config.defUseItemTypeList, safeId, nextActionEnabled);
                    }
                    else if (Config.sellItemsAfterOpenBoxesEnabled) {
                        action = () => sellItems(Config.defSellItemTypeList, safeId, nextActionEnabled);
                    }
                    if (action) {
                        setTimeout(action, Const.minActionInterval);
                    }
                }
            }
            else {
                if (index % 10 === 0) {
                    setTimeout(() => getNextObjects(1), Const.defAjaxInterval);
                }
                setTimeout(
                    () => $(document).dequeue('OpenBoxes'),
                    typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                );
            }
        });
    };

    $boxArea.parent().append(`<ul class="pd_result" data-name="boxResult"><li><strong>【${boxType}】打开结果：</strong></li></ul>`);
    let $wait = Msg.wait(
        `<strong>正在打开盒子中&hellip;</strong><i>剩余：<em class="pd_countdown">${num}</em></i><a class="pd_stop_action" href="#">停止操作</a>`
    );
    $(document).clearQueue('OpenBoxes');
    $.each(new Array(num), function () {
        $(document).queue('OpenBoxes', open);
    });
    $(document).dequeue('OpenBoxes');
};

/**
 * 处理装备区域
 * @param {jQuery} $armArea 装备区域节点
 * @param {number} type 页面类型，0：我的物品页面；1：争夺首页点数分配对话框
 */
export const handleArmArea = function ($armArea, type = 0) {
    $armArea.find('a[onclick^="cdzb"]').removeAttr('onclick').attr('data-name', 'equip');
    $armArea.find('a[onclick^="rlzb"]').removeAttr('onclick').attr('data-name', 'smelt');

    let $equipped = $armArea.find('tr[id^="wp_"]');
    if ($equipped.length > 0) {
        let id = $equipped.attr('id');
        let $td = $equipped.find('td');
        $td.removeAttr('colspan').removeAttr('style').css({'text-align': 'left', 'padding-left': '5px'});
        $td.html($td.html().replace('（装备中）', ''));
        $equipped.removeAttr('id').prepend(
            `<td id="${id}"><a data-name="equip" href="javascript:;">装备</a></td><td><a data-name="smelt" href="javascript:;">熔炼</a></td>`
        ).addClass('pd_arm_equipped');
    }

    $armArea.find('tr:not([data-id]) > td[id^="wp_"]').each(function () {
        let $this = $(this);
        let matches = /wp_(\d+)/.exec($this.attr('id'));
        if (!matches) return;
        let id = parseInt(matches[1]);
        let $tr = $this.parent('tr');
        $tr.attr('data-id', id);
        if (Config.armsMemo[id]) {
            $tr.find('> td:nth-child(3)').attr('data-memo', Config.armsMemo[id].slice(0, 12).replace(/"/g, ''));
        }
        if (type === 0) {
            $this.prepend(`<input name="armCheck" type="checkbox" value="${id}">`);
        }
    });

    if (type === 1) {
        $armArea.find('a[data-name="equip"]').attr('data-name', 'add').text('加入');
    }
};

/**
 * 绑定装备点击事件
 * @param {jQuery} $armArea 装备区域节点
 * @param {string} safeId SafeID
 * @param {number} type 页面类型，0：我的物品页面；1：争夺首页
 */
export const bindArmLinkClickEvent = function ($armArea, safeId, type = 0) {
    $armArea.on('click', 'a[data-name="equip"]', function () {
        let $this = $(this);
        let id = parseInt($this.closest('tr').data('id'));
        $.post('kf_fw_ig_mybpdt.php', `do=4&id=${id}&safeid=${safeId}`, function (html) {
            if (/装备完毕/.test(html)) {
                $armArea.find('.pd_arm_equipped').removeClass('pd_arm_equipped');
                $this.closest('tr').addClass('pd_arm_equipped');
                if (type === 1) {
                    let $wait = Msg.wait('<strong>正在获取争夺首页信息&hellip;</strong>');
                    Loot.updateLootInfo(function () {
                        Msg.remove($wait);
                        $('#pdChangeArmDialog').parent().hide();
                        let $armId = $('input[name="armId"]:first');
                        let $armMemo = $('input[name="armMemo"]:first');
                        $armId.val(id);
                        $armMemo.val($('#pdArmArea > span:first').text().trim());
                        $.each([$armId, $armMemo], function () {
                            this.get(0).defaultValue = '';
                        });
                    });
                }
            }
            else {
                alert(Util.removeHtmlTag(html));
            }
        });
    }).on('click', 'a[data-name="smelt"]', function () {
        if (!confirm('确定熔炼此装备吗？')) return;
        let $this = $(this);
        let armId = parseInt($this.closest('tr').data('id'));
        $.post('kf_fw_ig_mybpdt.php', `do=5&id=${armId}&safeid=${safeId}`, function (html) {
            let msg = Util.removeHtmlTag(html);
            if (/装备消失/.test(msg)) {
                $this.closest('tr').html(`<td colspan="3">${msg}</td>`);
                if (armId in Config.armsMemo) {
                    readConfig();
                    delete Config.armsMemo[armId];
                    writeConfig();
                }
            }
            else {
                alert(msg);
            }
        });
    }).on('click', 'a[data-name="add"]', function () {
        let $tr = $(this).closest('tr');
        let id = parseInt($tr.data('id'));
        let armInfo = getArmInfo($tr.find('> td:nth-child(3)').html());
        $('#pdAddArmDialog').parent().hide();
        $('#pdAddArmMemo').val(armInfo['名称']);
        $('#pdAddArmId').val(id).focus();
    }).on('mouseenter', 'tr', function () {
        let $this = $(this);
        if (!$this.has('> td[id^="wp_"]').length) return;
        let $td = $this.find('> td:nth-child(3)');
        $td.append('<a class="show_arm_info" data-name="showArmInfo" href="#" title="查看装备信息">查</a>');
    }).on('mouseleave', 'tr', function () {
        let $this = $(this);
        if (!$this.has('> td[id^="wp_"]').length) return;
        $this.find('> td:nth-child(3) .show_arm_info').remove();
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
    <label>武器参数设置：</label>
    <a class="pd_btn_link" data-name="copy" data-target="[name=armInfo]" href="#">复制</a><br>
    <textarea name="armInfo" rows="6" style="width: 550px;" wrap="off" style="white-space: pre;" readonly></textarea>
  </div>
  <div style="margin-top: 5px;">
    <label>
      装备备注：<input name="armMemo" type="text" maxlength="20" style="width: 180px;">
    </label>
  </div>
</div>
<div class="pd_cfg_btns">
  <button name="saveMemo" type="button">保存备注</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '装备信息', html, 'z-index: 1001;');

    $dialog.on('click', 'a[data-name="copy"]', function (e) {
        e.preventDefault();
        let $target = $dialog.find($(this).data('target'));
        if (!Util.copyText($target)) {
            $target.select().focus();
        }
        Script.runFunc('Item.showArmInfoDialog_copy_');
    }).find('[name="saveMemo"]').click(function (e) {
        e.preventDefault();
        readConfig();
        let value = $.trim($dialog.find('input[name="armMemo"]').val());
        let $node = $armArea.find(`tr[data-id="${armId}"] > td:nth-child(3)`);
        if (value) {
            Config.armsMemo[armId] = value;
            $node.attr('data-memo', value.slice(0, 12).replace(/"/g, ''));
        }
        else {
            delete Config.armsMemo[armId];
            $node.removeAttr('data-memo');
        }
        writeConfig();
        Dialog.close(dialogName);
    });

    $dialog.find('textarea[name="armInfo"]').val(getWeaponParameterSetting(armInfo));
    if (Config.armsMemo[armId]) {
        $dialog.find('input[name="armMemo"]').val(Config.armsMemo[armId]);
    }
    Dialog.show(dialogName);
    Script.runFunc('Item.showArmInfoDialog_after_');
};

/**
 * 获取计算器武器参数设置
 * @param {{}} armInfo 装备信息
 * @returns {string} 武器参数设置
 */
export const getWeaponParameterSetting = function (armInfo) {
    let info = {
        '组别': '',
        '神秘属性数量': 0,
        '所有的神秘属性': '',
        '主属性数量': 0,
        '所有的主属性': '',
        '从属性数量': 0,
        '所有的从属性': '',
    };

    let groupKeyList = new Map([['长剑', 'Sword'], ['短弓', 'Bow'], ['法杖', 'Staff']]);
    info['组别'] = groupKeyList.get(armInfo['组别']);

    let smKeyList = new Map([['火神秘', 'FMT'], ['雷神秘', 'LMT'], ['风神秘', 'AMT']]);
    for (let [key, value] of smKeyList) {
        if (key in armInfo) {
            info['神秘属性数量']++;
            info['所有的神秘属性'] += value + ' ';
        }
    }

    let mainPropertyKeyList = new Map([
        ['增加攻击力', 'ATK'], ['增加暴击伤害', 'CRT'], ['增加技能伤害', 'SKL'], ['穿透对方意志', 'BRC'], ['生命夺取', 'LCH'], ['增加速度', 'SPD'],
        ['攻击', 'ATK'], ['暴击', 'CRT'], ['技能', 'SKL'], ['穿透', 'BRC'], ['吸血', 'LCH'], ['速度', 'SPD']
    ]);
    for (let value of armInfo['主属性']) {
        let [property = ''] = value.split('(', 1);
        property = property.trim();
        if (property) {
            info['主属性数量']++;
            info['所有的主属性'] += mainPropertyKeyList.get(property) + ' ';
        }
    }

    let subPropertyKeyList = new Map([['系数(x3)', 'COF'], ['力量', 'STR'], ['敏捷', 'AGI'], ['智力', 'INT']]);
    for (let value of armInfo['从属性']) {
        value = $.trim(value);
        if (!value) continue;
        let matches = /(?:\[.])?(\S+?)\((\S+?)x([\d\.]+)%\)/.exec(value);
        if (matches) {
            info['从属性数量']++;
            info['所有的从属性'] += mainPropertyKeyList.get(matches[1]) + ' ' + subPropertyKeyList.get(matches[2]) + ' ' +
                Math.floor(parseFloat(matches[3]) * 10) + ' ';
        }
    }

    let content = `
[组别]
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
 * 添加装备相关按钮
 */
const addArmsButton = function () {
    $(`
<div class="pd_item_btns" data-name="handleArmBtns">
  <button name="selectInverse" type="button" title="全选或反选">选择</button>
  <button name="copyWeaponParameterSetting" type="button" title="复制所选装备的武器参数设置">复制武器参数</button>
  <button name="clearArmsMemo" type="button" style="color: #f00;" title="清除所有装备的备注">清除备注</button>
  <button name="showArmsFinalAddition" type="button" style="color: #00f;" title="显示当前页面上所有装备的最终加成信息">显示最终加成</button>
  <button name="smeltArms" type="button" style="color: #f00;" title="批量熔炼指定装备">批量熔炼</button>
</div>
`).insertAfter($armArea).find('[name="selectInverse"]').click(() => Util.selectInverse($armArea.find('input[name="armCheck"]')))
        .end().find('[name="copyWeaponParameterSetting"]')
        .click(function () {
            let $this = $(this);
            let armInfoList = [];
            $armArea.find('input[name="armCheck"]:checked').each(function () {
                let $this = $(this);
                let html = $this.closest('tr').find('> td:nth-child(3)').html();
                if (!html) return;
                armInfoList.push(getArmInfo(html));
            });
            if (!armInfoList.length) return;
            let copyData = '';
            for (let info of armInfoList) {
                copyData += getWeaponParameterSetting(info) + '\n\n';
            }
            $this.data('copy-text', copyData.trim());
            console.log('所选装备的武器参数设置：\n\n' + copyData.trim());
            if (!Util.copyText($this, '所选装备的武器参数设置已复制')) {
                alert('你的浏览器不支持复制，请打开Web控制台查看');
            }
        }).end().find('[name="clearArmsMemo"]')
        .click(function () {
            if (!confirm('是否清除所有装备的备注？')) return;
            readConfig();
            Config.armsMemo = {};
            writeConfig();
        })
        .end().find('[name="showArmsFinalAddition"]')
        .click(function () {
            if (!confirm('是否显示当前页面上所有装备的最终加成信息？')) return;
            Msg.destroy();
            let oriEquippedArmId = 0;
            let armIdList = [];
            $armArea.find('td[id^="wp_"]').each(function () {
                let $this = $(this);
                let id = parseInt($this.parent('tr').data('id'));
                if (id) {
                    armIdList.push(id);
                }
                if ($this.parent('tr').hasClass('pd_arm_equipped')) {
                    oriEquippedArmId = id;
                }
            });
            if (!oriEquippedArmId && !confirm('当前页面未发现有已装备的武器，显示最终加成信息后将用最后一件武器进行装备，是否继续？')) return;
            if (armIdList.length > 0) {
                showArmsFinalAddition(armIdList, oriEquippedArmId, safeId);
            }
        }).end().find('[name="smeltArms"]').click(() => showBatchSmeltArmsDialog(safeId));
};

/**
 * 显示装备最终加成信息
 * @param {number[]} armIdList 装备ID列表
 * @param {number} oriEquippedArmId 原先的装备ID
 * @param {string} safeId SafeID
 */
const showArmsFinalAddition = function (armIdList, oriEquippedArmId, safeId) {
    let index = 0;

    /**
     * 装备
     * @param {number} armId 装备ID
     * @param {boolean} isComplete 是否操作完成
     */
    const equip = function (armId, isComplete = false) {
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=4&id=${armId}&safeid=${safeId}`,
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            let msg = Util.removeHtmlTag(html);
            console.log(`装备ID[${armId}]：${msg.replace('\n', ' ')}`);
            if (isComplete) return;
            if (!/装备完毕/.test(msg)) index++;
            if (index >= armIdList.length) {
                complete();
                return;
            }
            if (!/装备完毕/.test(msg)) {
                setTimeout(() => equip(armIdList[index]), Const.minActionInterval);
            }
            else {
                setTimeout(() => getFinalAddition(armId), Const.defAjaxInterval);
            }
        }).fail(() => setTimeout(() => equip(armId), Const.minActionInterval));
    };

    /**
     * 获取当前装备的最终加成
     */
    const getFinalAddition = function (armId) {
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_index.php?t=' + $.now(),
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            $wait.find('.pd_countdown').text(armIdList.length - (index + 1));
            if ($wait.data('stop')) {
                complete();
                return;
            }

            let matches = />(最终加成：[^<>]+)</.exec(html);
            if (matches) {
                let info = matches[1];
                console.log(`装备ID[${armId}]：${info}`);
                let $armInfo = $armArea.find(`td[id="wp_${armId}"]`).parent('tr').find('td:nth-child(3)');
                $armInfo.find('.pd_final_addition_info').remove();
                $armInfo.append(`<span class="pd_final_addition_info"><br>${info}</span>`);
            }

            index++;
            if (index >= armIdList.length) {
                complete();
                return;
            }
            setTimeout(() => equip(armIdList[index]), Const.minActionInterval);
            Script.runFunc('Item.showArmsFinalAddition_show_', armId);
        }).fail(() => setTimeout(() => getFinalAddition(armId), Const.defAjaxInterval));
    };

    /**
     * 操作完成
     */
    const complete = function () {
        Msg.remove($wait);
        if (oriEquippedArmId) {
            setTimeout(() => equip(oriEquippedArmId, true), Const.minActionInterval);
        }
        Script.runFunc('Item.showArmsFinalAddition_complete_');
    };

    let $wait = Msg.wait(
        `<strong>正在获取装备最终加成信息&hellip;</strong><i>剩余：<em class="pd_countdown">${armIdList.length}</em></i>` +
        `<a class="pd_stop_action" href="#">停止操作</a>`
    );
    equip(armIdList[0]);
};

/**
 * 显示批量熔炼装备对话框
 */
const showBatchSmeltArmsDialog = function () {
    const dialogName = 'pdBatchSmeltArmsDialog';
    if ($('#' + dialogName).length > 0) return;
    Msg.destroy();
    readConfig();

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
        readConfig();
        Config.defSmeltArmTypeList = typeList;
        writeConfig();
        if (!confirm('是否熔炼所选装备种类？')) return;
        Dialog.close(dialogName);
        smeltArms(typeList, safeId);
    }).end().find('[name="selectAll"]').click(() => Util.selectAll($smeltArmTypeList.find('input[name="smeltArmsType"]')))
        .end().find('[name="selectInverse"]').click(() => Util.selectInverse($smeltArmTypeList.find('input[name="smeltArmsType"]')));

    Dialog.show(dialogName);
    Script.runFunc('Item.showBatchSmeltArmsDialog_after_');
};

/**
 * 熔炼装备
 * @param {string[]} typeList 想要熔炼的装备种类
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const smeltArms = function (typeList, safeId, nextActionEnabled = false) {
    let successNum = 0, index = 0;
    let smeltInfo = {};
    let isDeleteMemo = false;

    /**
     * 熔炼
     * @param {number} armId 装备ID
     * @param {string} armGroup 装备组别
     * @param {string} armName 装备名称
     * @param {number} armNum 本轮熔炼的装备数量
     */
    const smelt = function (armId, armGroup, armName, armNum) {
        index++;
        $.ajax({
            type: 'POST',
            url: 'kf_fw_ig_mybpdt.php',
            data: `do=5&id=${armId}&safeid=${safeId}`,
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            if (!html) return;
            let msg = Util.removeHtmlTag(html);
            console.log(`【${armName}】 ${msg}`);
            $('.pd_result[data-name="armResult"]:last').append(`<li>【${armName}】 ${msg}</li>`);
            $armArea.find(`td[id="wp_${armId}"]`).parent('tr').fadeOut('normal', function () {
                $(this).remove();
            });

            let matches = /获得对应装备经验\[\+(\d+)]/.exec(msg);
            if (!matches) return;
            successNum++;
            if (armId in Config.armsMemo) {
                isDeleteMemo = true;
                delete Config.armsMemo[armId];
            }
            if (!(armGroup in smeltInfo)) smeltInfo[armGroup] = {num: 0, exp: 0};
            smeltInfo[armGroup].num++;
            smeltInfo[armGroup].exp += parseInt(matches[1]);
            $wait.find('.pd_countdown').text(successNum);
            Script.runFunc('Item.smeltArms_after_');
        }).fail(function () {
            $('.pd_result[data-name="armResult"]:last').append(`<li>【${armName}】 <span class="pd_notice">连接超时</span></li>`);
        }).always(function () {
            if ($wait.data('stop')) complete();
            else {
                if (index === armNum) setTimeout(getNextArms, Const.minActionInterval);
                else setTimeout(() => $(document).dequeue('SmeltArms'), Const.minActionInterval);
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
            let $tr = $(this).parent('tr');
            if ($tr.hasClass('pd_arm_equipped')) return;
            let armId = parseInt($tr.data('id'));
            let armName = $tr.find('> td:nth-child(3) > span:first').text().trim();
            let [, armGroup] = armName.split('的');
            if (armName && armGroup && typeList.includes(armName)) {
                armList.push({armId, armGroup, armName});
            }
        });
        if (!armList.length) {
            complete();
            return;
        }

        index = 0;
        $(document).clearQueue('SmeltArms');
        $.each(armList, function (i, {armId, armGroup, armName}) {
            $(document).queue('SmeltArms', () => smelt(armId, armGroup, armName, armList.length));
        });
        $(document).dequeue('SmeltArms');
    };

    /**
     * 获取下一批装备
     */
    const getNextArms = function () {
        getNextObjects(2, () => {
            if ($wait.data('stop')) complete();
            else setTimeout(getCurrentArms, Const.defAjaxInterval);
        });
    };

    /**
     * 执行后续操作
     */
    const nextAction = function () {
        let action = null;
        if (Config.useItemsAfterOpenBoxesEnabled) {
            action = () => useItems(Config.defUseItemTypeList, safeId, nextActionEnabled);
        }
        else if (Config.sellItemsAfterOpenBoxesEnabled) {
            action = () => sellItems(Config.defSellItemTypeList, safeId, nextActionEnabled);
        }
        if (action) {
            setTimeout(action, Const.minActionInterval);
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
            if (nextActionEnabled) nextAction();
            return;
        }

        let armGroupNum = 0, totalExp = 0;
        let resultStat = '';
        for (let armGroup of Util.getSortedObjectKeyList(armGroupList, smeltInfo)) {
            armGroupNum++;
            let {exp, num} = smeltInfo[armGroup];
            totalExp += exp;
            resultStat += `【${armGroup}】 <i>装备<ins>-${num}</ins></i> <i>武器经验<em>+${exp.toLocaleString()}</em></i><br>`;
            Log.push(
                '熔炼装备',
                `共有\`${num}\`个【\`${armGroup}\`】装备熔炼成功`,
                {gain: {'武器经验': totalExp}, pay: {'装备': -num}}
            );
        }
        $('.pd_result[data-name="armResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（共有<em>${armGroupNum}</em>个组别中的<em>${successNum}</em>个装备熔炼成功）：</b> <i>武器经验<em>+${totalExp.toLocaleString()}</em></i><br>
  ${resultStat}
</li>`);
        console.log(`共有${armGroupNum}个组别中的${successNum}个装备熔炼成功，武器经验+${totalExp}`);
        Msg.show(
            `<strong>共有<em>${armGroupNum}</em>个组别中的<em>${successNum}</em>个装备熔炼成功</strong><i>武器经验<em>+${totalExp.toLocaleString()}</em></i>`, -1
        );

        if (isDeleteMemo) writeConfig();
        setTimeout(() => getNextObjects(2), Const.defAjaxInterval);
        if (nextActionEnabled) nextAction();
        Script.runFunc('Item.smeltArms_complete_');
    };

    if (!$.isEmptyObject(Config.armsMemo)) readConfig();
    $armArea.parent().append('<ul class="pd_result" data-name="armResult"><li><strong>熔炼结果：</strong></li></ul>');
    let $wait = Msg.wait(
        '<strong>正在熔炼装备中&hellip;</strong><i>已熔炼：<em class="pd_countdown">0</em></i><a class="pd_stop_action" href="#">停止操作</a>'
    );
    getCurrentArms();
};

/**
 * 获取指定装备情况
 * @param html 装备的HTML代码
 * @returns {{}} 当前装备情况
 */
export const getArmInfo = function (html) {
    let armInfo = {
        '名称': '',
        '颜色': '#000',
        '组别': '',
        '描述': '',
        '作用': '',
        '主属性': [],
        '从属性': [],
        '最终加成': [],
    };
    let matches = /<span style="color:([^<>]+);">([^<>]+)<\/span>/.exec(html);
    if (!matches) return armInfo;

    armInfo['颜色'] = matches[1];
    armInfo['名称'] = matches[2];
    [, armInfo['组别'] = ''] = matches[2].split('的');

    [, armInfo['描述'] = ''] = html.split('</span> - ', 2);
    let description = Util.removeHtmlTag(armInfo['描述']);
    [armInfo['作用'] = ''] = description.split('\n', 1);

    matches = /主属性：(.+?)\n/.exec(description);
    if (matches) armInfo['主属性'] = matches[1].split('。');

    matches = /从属性：(.+?)(\n|$)/.exec(description);
    if (matches) armInfo['从属性'] = matches[1].split('。');

    matches = /最终加成：(.+?)(\n|$)/.exec(description);
    if (matches) armInfo['最终加成'] = matches[1].split(' | ');

    let smMatches = description.match(/(.神秘)：(.+?)。/g);
    for (let i in smMatches) {
        let subMatches = /(.神秘)：(.+?)。/.exec(smMatches[i]);
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
export const getArmsLevelInfo = function (html) {
    let armsLevelList = new Map([
        ['武器', 0],
        ['护甲', 0],
        ['项链', 0],
    ]);
    let matches = html.match(/value="(\S+?)等级\[\s*(\d+)\s*] 经验:\d+"/g);
    for (let i in matches) {
        let subMatches = /value="(\S+?)等级\[\s*(\d+)\s*] 经验:\d+"/.exec(matches[i]);
        armsLevelList.set(subMatches[1], parseInt(subMatches[2]));
    }
    return armsLevelList;
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
 * 获取道具使用情况
 * @param html 争夺首页的HTML代码
 * @returns {Map} 道具使用情况列表
 */
export const getItemsUsedNumInfo = function (html) {
    let itemUsedNumList = new Map([
        ['蕾米莉亚同人漫画', 0],
        ['十六夜同人漫画', 0],
        ['档案室钥匙', 0],
        ['傲娇LOLI娇蛮音CD', 0],
        ['消逝之药', 0],
        ['整形优惠卷', 0],
    ]);
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
`).insertAfter($itemArea).find('[name="useItems"]').click(() => showBatchUseAndSellItemsDialog(1, safeId))
        .end().find('[name="sellItems"]').click(() => showBatchUseAndSellItemsDialog(2, safeId));

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
    readConfig();

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
        readConfig();
        if (type === 1) Config.defUseItemTypeList = typeList;
        else Config.defSellItemTypeList = typeList;
        writeConfig();
        if (!confirm(`是否${typeName}所选道具种类？`)) return;
        Dialog.close(dialogName);
        if (type === 1) useItems(typeList, safeId);
        else sellItems(typeList, safeId);
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
 * @param {string[]} typeList 想要使用的道具种类
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const useItems = function (typeList, safeId, nextActionEnabled = false) {
    let totalSuccessNum = 0, totalValidNum = 0, totalInvalidNum = 0, index = 0;
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
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            if (!html) return;
            let msg = Util.removeHtmlTag(html);
            let isDelete = false;
            if (/(成功|失败)！/.test(msg)) {
                totalSuccessNum++;
                if (!(itemName in useInfo)) useInfo[itemName] = {'道具': 0, '有效道具': 0, '无效道具': 0};
                useInfo[itemName]['道具']++;
                if (/成功！/.test(msg)) {
                    useInfo[itemName]['有效道具']++;
                    totalValidNum++;
                }
                else {
                    useInfo[itemName]['无效道具']++;
                    totalInvalidNum++;
                }
                $wait.find('.pd_countdown').text(totalSuccessNum);
                isDelete = true;
            }
            else if (/无法再使用/.test(msg)) {
                index = itemNum;
                let typeIndex = tmpItemTypeList.indexOf(itemName);
                if (typeIndex > -1) tmpItemTypeList.splice(typeIndex, 1);
            }
            else {
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
            $('.pd_result[data-name="itemResult"]:last').append(
                `<li>【Lv.${getLevelByName(itemName)}：${itemName}】 <span class="pd_notice">连接超时</span></li>`
            );
        }).always(function () {
            if ($wait.data('stop')) complete();
            else {
                if (index === itemNum) setTimeout(
                    getNextItems,
                    typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                );
                else setTimeout(
                    () => $(document).dequeue('UseItems'),
                    typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                );
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
            if (tmpItemTypeList.includes(itemName)) itemList.push({itemId, itemName});
        });
        if (!itemList.length) {
            complete();
            return;
        }

        index = 0;
        $(document).clearQueue('UseItems');
        $.each(itemList, function (i, {itemId, itemName}) {
            $(document).queue('UseItems', () => use(itemId, itemName, itemList.length));
        });
        $(document).dequeue('UseItems');
    };

    /**
     * 获取下一批道具
     */
    const getNextItems = function () {
        getNextObjects(2, () => {
            if ($wait.data('stop')) complete();
            else setTimeout(getCurrentItems, Const.defAjaxInterval);
        });
    };

    /**
     * 执行后续操作
     */
    const nextAction = function () {
        let action = null;
        if (Config.sellItemsAfterOpenBoxesEnabled) {
            action = () => sellItems(Config.defSellItemTypeList, safeId, nextActionEnabled);
        }
        if (action) {
            setTimeout(action, Const.minActionInterval);
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
                Log.push(
                    '使用道具',
                    `共有\`${successNum}\`个【\`Lv.${itemLevel}：${itemName}\`】道具被使用`,
                    {gain: stat, pay: {'道具': -successNum}}
                );
            }
        }
        $('.pd_result[data-name="itemResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（共有<em>${itemTypeNum}</em>个种类中的<em>${totalSuccessNum}</em>个道具被使用，
<i>有效道具<em>+${totalValidNum}</em></i><i>无效道具<em>+${totalInvalidNum}</em></i>）：</b><br>
  ${resultStat}
</li>`);
        console.log(`共有${itemTypeNum}个种类中的${totalSuccessNum}个道具被使用，有效道具+${totalValidNum}，无效道具+${totalInvalidNum}`);
        Msg.show(
            `<strong>共有<em>${itemTypeNum}</em>个种类中的<em>${totalSuccessNum}</em>个道具被使用</strong>` +
            `<i>有效道具<em>+${totalValidNum}</em></i><i>无效道具<em>+${totalInvalidNum}</em></i>`,
            -1
        );

        setTimeout(() => getNextObjects(2), Const.defAjaxInterval);
        if (nextActionEnabled) nextAction();
        Script.runFunc('Item.useItems_complete_');
    };

    $itemArea.parent().append('<ul class="pd_result" data-name="itemResult"><li><strong>使用结果：</strong></li></ul>');
    let $wait = Msg.wait(
        '<strong>正在使用道具中&hellip;</strong><i>已使用：<em class="pd_countdown">0</em></i><a class="pd_stop_action" href="#">停止操作</a>'
    );
    getCurrentItems();
};

/**
 * 出售道具
 * @param {string[]} itemTypeList 想要出售的道具种类
 * @param {string} safeId SafeID
 * @param {boolean} nextActionEnabled 是否执行后续操作
 */
const sellItems = function (itemTypeList, safeId, nextActionEnabled = false) {
    let successNum = 0, index = 0;
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
            timeout: Const.defAjaxTimeout,
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
            if (!(itemName in sellInfo)) sellInfo[itemName] = {num: 0, sell: 0};
            sellInfo[itemName].num++;
            sellInfo[itemName].sell += parseInt(matches[1]);
            $wait.find('.pd_countdown').text(successNum);
            Script.runFunc('Item.sellItems_after_');
        }).fail(function () {
            $('.pd_result[data-name="itemResult"]:last').append(
                `<li>【Lv.${getLevelByName(itemName)}：${itemName}】 <span class="pd_notice">连接超时</span></li>`
            );
        }).always(function () {
            if ($wait.data('stop')) {
                complete();
            }
            else {
                if (index === itemNum) setTimeout(getNextItems, Const.minActionInterval);
                else setTimeout(() => $(document).dequeue('SellItems'), Const.minActionInterval);
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
            if (itemTypeList.includes(itemName)) itemList.push({itemId, itemName});
        });
        if (!itemList.length) {
            complete();
            return;
        }

        index = 0;
        $(document).clearQueue('SellItems');
        $.each(itemList, function (i, {itemId, itemName}) {
            $(document).queue('SellItems', () => sell(itemId, itemName, itemList.length));
        });
        $(document).dequeue('SellItems');
    };

    /**
     * 获取下一批道具
     */
    const getNextItems = function () {
        getNextObjects(2, () => {
            if ($wait.data('stop')) complete();
            else setTimeout(getCurrentItems, Const.defAjaxInterval);
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

        let itemTypeNum = 0, totalSell = 0;
        let resultStat = '';
        for (let itemName of Util.getSortedObjectKeyList(itemTypeList, sellInfo)) {
            itemTypeNum++;
            let itemLevel = getLevelByName(itemName);
            let {sell, num} = sellInfo[itemName];
            totalSell += sell;
            resultStat += `【Lv.${itemLevel}：${itemName}】 <i>道具<ins>-${num}</ins></i> <i>KFB<em>+${sell.toLocaleString()}</em></i><br>`;
            Log.push(
                '出售道具',
                `共有\`${num}\`个【\`Lv.${itemLevel}：${itemName}\`】道具出售成功`,
                {gain: {'KFB': sell}, pay: {'道具': -num}}
            );
        }
        $('.pd_result[data-name="itemResult"]:last').append(`
<li class="pd_stat">
  <b>统计结果（共有<em>${itemTypeNum}</em>个种类中的<em>${successNum}</em>个道具出售成功）：</b> <i>KFB<em>+${totalSell.toLocaleString()}</em></i><br>
  ${resultStat}
</li>`);
        console.log(`共有${itemTypeNum}个种类中的${successNum}个道具出售成功，KFB+${totalSell}`);
        Msg.show(
            `<strong>共有<em>${itemTypeNum}</em>个种类中的<em>${successNum}</em>个道具出售成功</strong><i>KFB<em>+${totalSell.toLocaleString()}</em></i>`, -1
        );
        setTimeout(() => getNextObjects(2), Const.defAjaxInterval);
        Script.runFunc('Item.sellItems_complete_');
    };

    $itemArea.parent().append(`<ul class="pd_result" data-name="itemResult"><li><strong>出售结果：</strong></li></ul>`);
    let $wait = Msg.wait(
        '<strong>正在出售道具中&hellip;</strong><i>已出售：<em class="pd_countdown">0</em></i><a class="pd_stop_action" href="#">停止操作</a>'
    );
    getCurrentItems();
};

/**
 * 购买物品
 * @param {string[]} itemIdList 购买物品ID列表
 */
const buyItems = function (itemIdList) {
    let successNum = 0, totalKfb = 0;
    let myItemUrlList = [];
    let itemList = {};
    let isStop = false;

    /**
     * 购买
     */
    const buy = function () {
        $.ajax({
            type: 'GET',
            url: url + '&t=' + $.now(),
            timeout: Const.defAjaxTimeout,
            success(html) {
                Public.showFormatLog('购买道具', html);
                let {msg} = Util.getResponseMsg(html);
                if (/购买成功，返回我的背包/.test(msg)) {
                    successNum++;
                    totalKfb += kfb;
                }
                else {
                    isStop = true;
                    $('.pd_result:last').append(`<li>${msg}<span class="pd_notice">（购买中止）</span></li>`);
                }
                setTimeout(getNewItemInfo, Const.defAjaxInterval);
            },
            error() {
                setTimeout(buy, Const.defAjaxInterval);
            }
        });
    };

    /**
     * 获取新道具的信息
     * @param {boolean} isFirst 购买前第一次获取信息
     */
    const getNewItemInfo = function (isFirst = false) {
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_mybp.php?t=' + $.now(),
            timeout: Const.defAjaxTimeout,
            success(html) {
                let list = [];
                $('.kf_fw_ig1 a[href^="kf_fw_ig_mybp.php?do=1&id="]', html).each(function () {
                    let $this = $(this);
                    let url = $this.attr('href');
                    list.push(url);
                    if (isFirst || myItemUrlList.includes(url)) return;
                    let itemName = $this.closest('tr').find('td:nth-child(3)').text().trim();
                    if (!itemTypeList.includes(itemName)) return;
                    if (!(itemName in itemList)) itemList[itemName] = 0;
                    itemList[itemName]++;
                    console.log(`获得了一个【Lv.${getLevelByName(itemName)}：${itemName}】道具`);
                    $('.pd_result:last').append(
                        `<li>获得了一个【<b class="pd_highlight">Lv.${getLevelByName(itemName)}：${itemName}</b>】道具</li>`
                    );
                });
                myItemUrlList = list;

                let $countdown = $('.pd_countdown:last');
                $countdown.text(buyNum - successNum);
                isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                if (isStop || successNum === buyNum) {
                    Msg.remove($countdown.closest('.pd_msg'));
                    for (let [itemName, num] of Util.entries(itemList)) {
                        if (!num) delete itemList[itemName];
                    }
                    if (successNum > 0 && !$.isEmptyObject(itemList)) {
                        Log.push(
                            '购买道具',
                            `共有\`${successNum}\`个【\`${type}\`】购买成功`,
                            {gain: {'道具': successNum, 'item': itemList}, pay: {'KFB': -totalKfb}}
                        );
                    }

                    let itemStatHtml = '';
                    for (let itemName of Util.getSortedObjectKeyList(itemTypeList, itemList)) {
                        itemStatHtml += `<i>${itemName}<em>+${itemList[itemName]}</em></i> `;
                    }
                    $('.pd_result:last').append(`
<li class="pd_stat">
  <b>统计结果：</b><br>
  共有<em>${successNum}</em>个道具购买成功，<i>KFB<ins>-${totalKfb.toLocaleString()}</ins></i> ${itemStatHtml}<br>
  <span style="color: #666;">(请到<a href="kf_fw_ig_mybp.php">角色/物品页面</a>查看)</span>
</li>
`);

                    console.log(`共有${successNum}个【${type}】购买成功，KFB-${totalKfb}`);
                    Msg.show(`<strong>共有<em>${successNum}</em>个【${type}】购买成功</strong><i>KFB<ins>-${totalKfb.toLocaleString()}</ins></i>`, -1);
                    showKfbInItemShop();
                }
                else {
                    let interval = typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval;
                    setTimeout(buy, isFirst ? Const.defAjaxInterval : interval);
                }
            },
            error() {
                setTimeout(() => getNewItemInfo(isFirst), Const.defAjaxInterval);
            }
        });
    };

    $('.kf_fw_ig1:last').parent().append(`<ul class="pd_result"><li><strong>【${type}】购买结果：</strong></li></ul>`);
    getNewItemInfo(true);
};

/**
 * 在物品商店显示当前持有的KFB和贡献
 */
export const showMyInfoInItemShop = function () {
    $.get(`profile.php?action=show&uid=${Info.uid}&t=${$.now()}`, function (html) {
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

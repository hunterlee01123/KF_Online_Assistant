/* 争夺模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import * as Dialog from './Dialog';
import Const from './Const';
import {read as readConfig, write as writeConfig} from './Config';
import * as Log from './Log';
import * as TmpLog from './TmpLog';
import * as LootLog from './LootLog';
import * as Script from './Script';
import * as Public from './Public';
import * as Item from './Item';

// 争夺首页区域
let $lootArea;
// 争夺属性区域
let $properties;
// 点数区域
let $points;
// 道具信息区域
let $itemInfo;
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
// 道具使用情况列表
let itemUsedNumList = new Map();
// 修改点数可用次数
let changePointsAvailableCount = 0;
// 点数分配记录列表
let pointsLogList = [];

/**
 * 初始化
 */
export const init = function () {
    $lootArea = $('.kf_fw_ig1:first');
    $properties = $lootArea.find('> tbody > tr:nth-child(2) > td:first-child');
    $points = $lootArea.find('> tbody > tr:nth-child(2) > td:nth-child(2)');
    $itemInfo = $lootArea.find('> tbody > tr:nth-child(3) > td');
    $itemInfo.css({
        'line-height': '2em',
        'padding': '3px 5px',
    });

    let tmpHaloInfo = TmpLog.getValue(Const.haloInfoTmpLogName);
    if (tmpHaloInfo && $.type(tmpHaloInfo) === 'object') {
        let diff = new Date().getTime() - tmpHaloInfo.time;
        if (diff >= 0 && diff < Const.tmpHaloInfoExpires * 60 * 1000) {
            delete tmpHaloInfo.time;
            setHaloInfo(tmpHaloInfo);
            enhanceLootIndexPage();
        }
        else readHaloInfo(true);
    }
    else readHaloInfo(true);
};

/**
 * 增强争夺首页
 */
export const enhanceLootIndexPage = function () {
    Script.runFunc('Loot.enhanceLootIndexPage_before_');
    propertyList = getLootPropertyList();
    itemUsedNumList = Item.getItemUsedInfo($itemInfo.html());

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

    if (log.includes('本日无争夺记录'))
        $log.html(log.replace(/点击这里/g, '点击上方的攻击按钮').replace('战斗记录框内任意地方点击自动战斗下一层', '请点击上方的攻击按钮开始争夺战斗'));
    addLootLogHeader();
    showLogStat(levelInfoList);

    if (Config.autoLootEnabled && !/你被击败了/.test(log) && !parseInt(Util.getCookie(Const.changePointsCountDownCookieName))) {
        $(document).ready(setTimeout(autoLoot, 500));
    }
    Script.runFunc('Loot.enhanceLootIndexPage_after_');
};

/**
 * 处理争夺属性区域
 */
const handlePropertiesArea = function () {
    let tipsIntro = '灵活和智力的抵消机制：\n战斗开始前，会重新计算战斗双方的灵活和智力；灵活=(自己的灵活值-(双方灵活值之和 x 33%))；智力=(自己的智力值-(双方智力值之和 x 33%))';
    let html = $properties.html()
        .replace(/(攻击力：)(\d+)/, '$1<span id="pdPro_s1" title="原值：$2">$2</span> <span id="pdNew_s1"></span>')
        .replace(
            /(生命值：)(\d+)\s*\(最大(\d+)\)/,
            '$1<span id="pdCurrentLife">$2</span> (最大<span id="pdPro_s2" title="原值：$3">$3</span>) <span id="pdNew_s2"></span>'
        )
        .replace(/(攻击速度：)(\d+)/, '$1<span id="pdPro_d1" title="原值：$2">$2</span> <span id="pdNew_d1"></span>')
        .replace(
            /(暴击几率：)(\d+)%\s*\(抵消机制见说明\)/,
            `$1<span id="pdPro_d2" title="原值：$2">$2</span>% <span class="pd_cfg_tips" id="pdReal_d2" style="color: #666;"></span> ` +
            `<span id="pdNew_d2"></span> <span class="pd_cfg_tips" title="${tipsIntro}">[?]</span>`
        )
        .replace(
            /(技能释放概率：)(\d+)%\s*\(抵消机制见说明\)/,
            `$1<span id="pdPro_i1" title="原值：$2">$2</span>% <span class="pd_cfg_tips" id="pdReal_i1" style="color: #666;"></span> ` +
            `<span id="pdNew_i1"></span> <span class="pd_cfg_tips" title="${tipsIntro}">[?]</span>`
        )
        .replace(/(防御：)(\d+)%减伤/, '$1<span id="pdPro_i2" title="原值：$2">$2</span>%减伤 <span id="pdNew_i2"></span>')
        .replace(
            '技能伤害：攻击+(体质*5)+(智力*5)',
            '技能伤害：<span class="pd_custom_tips" id="pdSkillAttack" title="[飞身劈斩]伤害：攻击+体质值*5+智力值*5"></span>'
        );
    $properties.html(html).find('br:first').after('<span>剩余属性点：<span id="pdSurplusPoint"></span></span><br>');

    $properties.on('click', '[id^="pdPro_"]', function () {
        let $this = $(this);
        $this.hide();
        let name = $this.attr('id').replace('pdPro_', '');
        let step = 1;
        if (name === 's1') step = 5;
        else if (name === 's2') step = 20;
        else if (name === 'd1') step = 2;
        $(`<input class="pd_input" data-name="${name}" type="number" value="${parseInt($this.text())}" min="1" step="${step}" ` +
            `style="width: 65px; margin-right: 5px;" title="${$this.attr('title')}">`
        ).insertAfter($this).focus().select()
            .blur(function () {
                let $this = $(this);
                let name = $this.data('name');
                let num = parseInt($this.val());
                if (num > 0) {
                    $points.find(`[name="${name}"]`).val(getPointByProperty(getPointNameByFieldName(name), num)).trigger('change');
                }
                $this.prev().show().end().remove();
            })
            .keydown(function (e) {
                let $this = $(this);
                if (e.keyCode === 13) $this.blur();
                else if (e.keyCode === 27) $this.val('').blur();
            });
    }).find('[id^=pdPro_]').css('cursor', 'pointer');
};

/**
 * 处理点数区域
 */
const handlePointsArea = function () {
    $points.find('[type="text"]:not([readonly])').attr('type', 'number').attr('min', 1).attr('max', 9999)
        .prop('required', true).css('width', '60px').addClass('pd_point').next('span').addClass('pd_extra_point')
        .after('<span class="pd_sum_point" style="color: #f03; cursor: pointer;" title="点击：给该项加上或减去剩余属性点"></span>');
    $points.find('input[readonly]').attr('type', 'number').prop('disabled', true).css('width', '60px');

    let $changeCount = $points.find('[name="rvrc1"]').contents().eq(-3);
    let changeCountMatches = /当前修改配点可用\[(\d+)]次/.exec($changeCount.get(0).textContent);
    if (changeCountMatches) {
        changePointsAvailableCount = parseInt(changeCountMatches[1]);
        $changeCount.wrap('<span id="pdChangeCount"></span>');
        $points.find('#pdChangeCount').css('margin-left', '5px');
    }

    let countDownMatches = /\(下次修改配点还需\[(\d+)]分钟\)/.exec($points.text());
    if (countDownMatches) {
        let nextTime = Util.getDate(`+${countDownMatches[1]}m`);
        Util.setCookie(Const.changePointsCountDownCookieName, nextTime.getTime(), nextTime);
    }
    else Util.setCookie(Const.changePointsCountDownCookieName, 0, Util.getDate(`+${Const.changePointsCountDownExpires}m`));

    extraPointsList = {
        '耐力': parseInt($points.find('[name="p"]').next('span').text()),
        '幸运': parseInt($points.find('[name="l"]').next('span').text()),
    };

    /**
     * 显示剩余属性点
     */
    const showSurplusPoint = function () {
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
        $('#pdSurplusPoint').text(surplusPoint)
            .css('color', surplusPoint !== 0 ? '#f00' : '#000')
            .css('font-weight', surplusPoint !== 0 ? 'bold' : 'normal');
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
        $('#pdSkillAttack').text(
            getSkillAttack(
                parseInt($lootArea.find('[name="s1"]').val()) + parseInt($lootArea.find('[name="s1"]').next('.pd_extra_point').text()),
                parseInt($lootArea.find('[name="s2"]').val()) + parseInt($lootArea.find('[name="s2"]').next('.pd_extra_point').text()),
                parseInt($lootArea.find('[name="i1"]').val()) + parseInt($lootArea.find('[name="i1"]').next('.pd_extra_point').text())
            )
        );
    };

    $points.on('change', '.pd_point', function () {
        let $this = $(this);
        showSurplusPoint();
        showNewLootProperty($this);
        showExtraPoint($this);
        showSumOfPoint($this);
        showSkillAttack();
    }).on('click', '.pd_sum_point', function () {
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($points.find('.pd_point'));
        if (!surplusPoint) return;
        let $point = $(this).prev('span').prev('.pd_point');
        if (!$point.length) return;
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        num = num + surplusPoint;
        $point.val(num < 1 ? 1 : num).trigger('change');
    }).find('form').submit(() => checkPoints($points)).find('.pd_point').trigger('change');
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
    }
    else if (surplusPoint > 0) {
        if (!confirm('可分配属性点尚未用完，是否继续？')) return false;
    }
    Util.deleteCookie(Const.changePointsCountDownCookieName);
    return true;
};

/**
 * 获取争夺属性列表
 * @returns {{}} 争夺属性
 */
const getLootPropertyList = function () {
    let propertyList = {
        '攻击力': 0,
        '生命值': 0,
        '最大生命值': 0,
        '攻击速度': 0,
        '暴击几率': 0,
        '技能伤害': 0,
        '技能释放概率': 0,
        '防御': 0,
        '可分配属性点': 0,
    };
    let content = $properties.text();
    let matches = /攻击力：(\d+)/.exec(content);
    if (matches) propertyList['攻击力'] = parseInt(matches[1]);
    matches = /生命值：(\d+)\s*\(最大(\d+)\)/.exec(content);
    if (matches) {
        propertyList['生命值'] = parseInt(matches[1]);
        propertyList['最大生命值'] = parseInt(matches[2]);
    }
    matches = /攻击速度：(\d+)/.exec(content);
    if (matches) propertyList['攻击速度'] = parseInt(matches[1]);
    matches = /暴击几率：(\d+)%/.exec(content);
    if (matches) propertyList['暴击几率'] = parseInt(matches[1]);
    matches = /技能伤害：(\d+)/.exec(content);
    if (matches) propertyList['技能伤害'] = parseInt(matches[1]);
    matches = /技能释放概率：(\d+)%/.exec(content);
    if (matches) propertyList['技能释放概率'] = parseInt(matches[1]);
    matches = /防御：(\d+)%/.exec(content);
    if (matches) propertyList['防御'] = parseInt(matches[1]);
    matches = /可分配属性点：(\d+)/.exec(content);
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
    let newValue = getPropertyByPoint(pointName, point), diffValue = 0;
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
        }
        else {
            text = getRealProperty(pointName, point + extraPoint, nextLevel, '普通') + '%';
            text += '|' + getRealProperty(pointName, point + extraPoint, nextLevel, '快速') + '%';
        }
        $properties.find('#pdReal_' + name).text(`(${text})`)
            .attr('title', `第${nextLevel}层的实际${pointName === '灵活' ? '暴击几率' : '技能释放概率'} (${nextLevel % 10 === 0 ? 'BOSS' : '普通|快速'})`);
    }

    if (diffValue !== 0 || oriPoint !== point)
        $properties.find('#pdNew_' + name).text(`(${(diffValue >= 0 ? '+' : '') + diffValue})`).css('color', diffValue >= 0 ? '#f03' : '#393');
    else $properties.find('#pdNew_' + name).text('');
};

/**
 * 获取当前已分配的点数
 * @param {jQuery} $points 点数字段对象
 * @returns {number} 当前已分配的点数
 */
export const getCurrentAssignedPoint = function ($points) {
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
export const getSkillAttack = (power, life, intelligence) => power * 5 + life * 5 + intelligence * 5;

/**
 * 根据字段名称获取点数名称
 * @param {string} fieldName 字段名称
 * @returns {string} 点数名称
 */
export const getPointNameByFieldName = function (fieldName) {
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
export const getFieldNameByPointName = function (pointName) {
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
 * 根据指定的点数获得相应额外加成点数
 * @param {string} pointName 点数名称
 * @param {number} point 点数的值
 * @returns {number} 额外加成点数
 */
export const getExtraPoint = function (pointName, point) {
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
            return Math.floor(point * haloPercent) + elapsedMedicine;
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
export const getPropertyByPoint = function (pointName, point) {
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
export const getPointByProperty = function (pointName, num) {
    let elapsedMedicine = itemUsedNumList.get('消逝之药') * 5;
    let haloPercent = 1 + haloInfo['全属性'];
    let value = 0;
    switch (pointName) {
        case '力量':
            value = Math.ceil((Math.ceil((num - haloInfo['攻击力']) / 5) - itemUsedNumList.get('蕾米莉亚同人漫画') - elapsedMedicine) / haloPercent);
            break;
        case '体质':
            value = Math.ceil(
                (Math.ceil(((num - haloInfo['生命值']) - (itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0)) / 20)
                - itemUsedNumList.get('蕾米莉亚同人漫画') - elapsedMedicine) / haloPercent
            );
            break;
        case '敏捷':
            value = Math.ceil(
                (Math.ceil((num - (itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0)) / 2) - itemUsedNumList.get('十六夜同人漫画')
                - elapsedMedicine) / haloPercent
            );
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
export const getRealProperty = function (pointName, totalPoint, level, enemy) {
    const npcStepNum = 2; // NPC递增数值
    const antiCoefficient = 3; // 抵消系数
    const coefficient = {'普通': 1, '强壮': 1, '快速': 1.5, '脆弱': 1, '缓慢': 1, 'BOSS': 1.2}; // NPC强化系数列表
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
<select id="pdLevelPointListSelect" style="margin: 5px 0;">
  <option>点数分配方案</option>
  <option value="0">默认</option>
</select>
<a class="pd_btn_link" data-name="save" href="#" title="将当前点数设置保存为新的方案">保存</a>
<a class="pd_btn_link" data-name="edit" href="#" title="编辑各层点数分配方案">编辑</a>
<a class="pd_btn_link" data-name="fill" href="#" title="输入一串数字按顺序填充到各个点数字段中">填充</a><br>
`).prependTo($points).filter('#pdLevelPointListSelect').change(function () {
        let level = parseInt($(this).val());
        if (level > 0) {
            let points = Config.levelPointList[parseInt(level)];
            if (typeof points !== 'object') return;
            $points.find('.pd_point').each(function () {
                let $this = $(this);
                let pointName = getPointNameByFieldName($this.attr('name'));
                $this.val(points[pointName]);
            }).trigger('change');
        }
        else if (level === 0) {
            $points.find('.pd_point').each(function () {
                $(this).val(this.defaultValue);
            }).trigger('change');
        }
    }).end().filter('[data-name="save"]').click(function (e) {
        e.preventDefault();
        if (!checkPoints($points)) return;
        let $levelPointListSelect = $('#pdLevelPointListSelect');
        let level = parseInt($levelPointListSelect.val());
        level = parseInt(prompt('请输入层数：', level ? level : ''));
        if (!level || level < 0) return;

        readConfig();
        if (level in Config.levelPointList) {
            if (!confirm('该层数已存在，是否覆盖？')) return;
        }
        let points = {};
        for (let elem of Array.from($points.find('.pd_point'))) {
            let $elem = $(elem);
            let point = parseInt($elem.val());
            if (!point || point < 0) return;
            let pointName = getPointNameByFieldName($elem.attr('name'));
            points[pointName] = point;
        }
        Config.levelPointList[level] = points;
        writeConfig();
        setLevelPointListSelect(Config.levelPointList);
        $levelPointListSelect.val(level);
    }).end().filter('[data-name="edit"]').click(function (e) {
        e.preventDefault();
        showLevelPointListConfigDialog();
    }).end().filter('[data-name="fill"]').click(function (e) {
        e.preventDefault();
        let value = $.trim(prompt('请输入以空格分隔的一串数字，按顺序填充到各个点数字段中：'));
        if (!value) return;
        let points = value.split(' ');
        $points.find('.pd_point').each(function (index) {
            if (index < points.length) $(this).val(parseInt(points[index])).trigger('change');
            else return false;
        });
    });
    setLevelPointListSelect(Config.levelPointList);
};

/**
 * 设置各层点数分配方案选择框
 * @param {{}} levelPointList 各层点数分配列表
 */
const setLevelPointListSelect = function (levelPointList) {
    let pointListHtml = '';
    for (let level of Object.keys(levelPointList)) {
        if (!$.isNumeric(level)) continue;
        pointListHtml += `<option value="${level}">第${level}层</option>`;
    }
    $('#pdLevelPointListSelect').find('option:gt(1)').remove().end().append(pointListHtml);
};

/**
 * 显示各层点数分配方案对话框
 */
const showLevelPointListConfigDialog = function (callback) {
    const dialogName = 'pdLevelPointListConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let html = `
<div class="pd_cfg_main">
  <div style="margin: 5px 0; line-height: 1.6em;">
    请填写各层对应的点数分配方案，相邻层数如数值完全相同的话，则只保留最前面的一层<br>
    （例：11-19层点数相同的话，则只保留第11层）<br>
    自定义点数分配方案脚本的参考范例请参见<a href="read.php?tid=500968&spid=13270735" target="_blank">此贴53楼</a>
  </div>
  <div style="overflow-y: auto; max-height: 400px;">
    <table id="pdLevelPointList" style="text-align: center; white-space: nowrap;">
      <tbody>
        <tr><th></th><th>层数</th><th>力量</th><th>体质</th><th>敏捷</th><th>灵活</th><th>智力</th><th>意志</th><th></th></tr>
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
    let $dialog = Dialog.create(dialogName, '各层点数分配方案', html, 'min-width: 665px;');
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
  <td style="text-align: left;">
    <a class="pd_btn_link" data-name="fill" href="#">填充</a>
    <a class="pd_btn_link pd_highlight" data-name="delete" href="#">删除</a>
  </td>
</tr>
<tr>
  <td></td>
  <td class="pd_custom_tips" title="剩余属性点">剩余：<span data-id="surplusPoint">0</span></td>
  <td title="攻击力">
    攻：<span data-id="pro_s1" style="cursor: pointer;">0</span> <a data-id="opt_s1" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="最大生命值">
    命：<span data-id="pro_s2" style="cursor: pointer;">0</span> <a data-id="opt_s2" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="攻击速度">
    速：<span data-id="pro_d1" style="cursor: pointer;">0</span> <a data-id="opt_d1" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="暴击几率">
    暴：<span data-id="pro_d2" style="cursor: pointer;">0</span>% <a data-id="opt_d2" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="技能释放概率">
    技：<span data-id="pro_i1" style="cursor: pointer;">0</span>% <a data-id="opt_i1" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td title="防御减伤">
    防：<span data-id="pro_i2" style="cursor: pointer;">0</span>% <a data-id="opt_i2" href="#" title="点击：给该项加上或减去剩余属性点">&#177;</a>
  </td>
  <td class="pd_custom_tips" title="[飞身劈斩]伤害：攻击+体质值*5+智力值*5">技伤：<span data-id="skillAttack">0</span></td>
</tr>
`).appendTo($levelPointList).find('.pd_point').trigger('change');
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        readConfig();
        let levelPointList = {};
        let prevPoints = {};
        let isError = false, isSurplus = false;
        $levelPointList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            if (!$this.find('.pd_point').length) return;
            let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint($this.find('.pd_point'));
            if (surplusPoint > 0) isSurplus = true;
            else if (surplusPoint < 0) {
                isError = true;
                return false;
            }

            let level = parseInt($this.find('[name="level"]').val());
            if (!level || level < 0) return;
            let points = {};
            for (let elem of Array.from($this.find('.pd_point'))) {
                let $elem = $(elem);
                let point = parseInt($elem.val());
                if (!point || point < 0) return;
                points[getPointNameByFieldName($elem.attr('name'))] = point;
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
        writeConfig();
        Dialog.close(dialogName);
        setLevelPointListSelect(Config.levelPointList);
    }).find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        let points = {'力量': 1, '体质': 1, '敏捷': 1, '灵活': 1, '智力': 1, '意志': 1};
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
        Public.showCommonImportOrExportConfigDialog(
            '各层点数分配方案',
            'levelPointList',
            null,
            function () {
                $('#pdLevelPointListConfigDialog').remove();
                showLevelPointListConfigDialog($dialog => $dialog.submit());
            }
        );
    }).end().find('[data-name="selectAll"]').click(() => Util.selectAll($levelPointList.find('[type="checkbox"]')))
        .end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($levelPointList.find('[type="checkbox"]')));

    $levelPointList.on('click', '[data-name="fill"]', function (e) {
        e.preventDefault();
        let $line = $(this).closest('tr');
        let value = $.trim(prompt('请输入以空格分隔的一串数字，按顺序填充到各个点数字段中：'));
        if (!value) return;
        let points = value.split(' ');
        $line.find('.pd_point').each(function (index) {
            if (index < points.length) $(this).val(parseInt(points[index])).trigger('change');
            else return false;
        });
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        let $line = $(this).closest('tr');
        $line.next('tr').addBack().remove();
        Dialog.resize(dialogName);
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
        $properties.find('[data-id="skillAttack"]').text(
            getSkillAttack(
                power + getExtraPoint('力量', power),
                life + getExtraPoint('体质', life),
                intelligence + getExtraPoint('智力', intelligence)
            )
        );


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
            if (typeof matches[1] !== 'undefined') data[name].action = matches[1] === '+' ? 'add' : 'minus';
            else data[name].action = 'equal';
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
                    point += (data[name].action === 'add' ? data[name].value : -data[name].value);
                    $this.val(point > 1 ? point : 1);
                }
                else $this.val(data[name].value);
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
 * 添加攻击相关按钮
 */
const addAttackBtns = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    $logBox.off('click');

    $(`
<div id="pdAttackBtns" style="line-height: 2.2em; margin-bottom: 5px;">
  <label>
    <input class="pd_input" name="autoChangeLevelPointsEnabled" type="checkbox" ${Config.autoChangeLevelPointsEnabled ? 'checked' : ''}>
    自动修改点数分配方案
    <span class="pd_cfg_tips" title="在攻击时可自动修改为相应层数的点数分配方案（仅限自动攻击相关按钮有效）">[?]</span>
  </label>
  <label>
    <input class="pd_input" name="customPointsScriptEnabled" type="checkbox" ${Config.customPointsScriptEnabled ? 'checked' : ''} 
${typeof Const.getCustomPoints !== 'function' ? 'disabled' : ''}> 使用自定义脚本
    <span class="pd_cfg_tips" title="使用自定义点数分配脚本（仅限自动攻击相关按钮有效，需正确安装自定义脚本后此项才可勾选）">[?]</span>
  </label><br>
  <label>
    <input class="pd_input" name="unusedPointNumAlertEnabled" type="checkbox" ${Config.unusedPointNumAlertEnabled ? 'checked' : ''}>
    有剩余属性点时提醒
    <span class="pd_cfg_tips" title="在攻击时如有剩余属性点则进行提醒（仅限自动攻击相关按钮有效）">[?]</span>
  </label>
  <label>
    <input class="pd_input" name="slowAttackEnabled" type="checkbox" ${Config.slowAttackEnabled ? 'checked' : ''}> 慢速
    <span class="pd_cfg_tips" title="延长每次攻击的时间间隔（在4~6秒之间）">[?]</span>
  </label><br>
  <button name="autoAttack" type="button" title="自动攻击到指定层数">自动攻击</button>
  <button name="onceAttack" type="button" title="自动攻击一层">一层</button>
  <span style="color: #888;">|</span>
  <button name="manualAttack" type="button" title="手动攻击一层，会自动提交当前页面上的点数设置">手动攻击</button>
</div>
`).appendTo($points).on('click', 'button[name$="Attack"]', function () {
        if (/你被击败了/.test(log)) {
            alert('你已经被击败了');
            return;
        }
        if ($('.pd_mask').length > 0) return;
        let $this = $(this);
        let name = $this.attr('name');
        let type = name === 'manualAttack' ? 'manual' : 'auto';
        let targetLevel = 0;
        if (type === 'auto') {
            let value = '+1';
            if (name === 'autoAttack') {
                let prevTargetLevel = $this.data('prevTargetLevel');
                value = $.trim(
                    prompt('攻击到第几层？（0表示攻击到被击败为止，+n表示攻击到当前层数+n层）', prevTargetLevel ? prevTargetLevel : Config.attackTargetLevel)
                );
            }
            if (!/\+?\d+/.test(value)) return;
            if (value.startsWith('+')) {
                let currentLevel = getCurrentLevel(logList);
                targetLevel = currentLevel + parseInt(value);
            }
            else targetLevel = parseInt(value);
            if (isNaN(targetLevel) || targetLevel < 0) return;
            if (name === 'autoAttack') $this.data('prevTargetLevel', value);
        }
        Msg.destroy();
        $('#pdLootLogHeader').find('[data-name="end"]').click();
        let autoChangePointsEnabled = (Config.autoChangeLevelPointsEnabled ||
            Config.customPointsScriptEnabled && typeof Const.getCustomPoints === 'function') && type === 'auto';
        if (!autoChangePointsEnabled && !checkPoints($points)) return;
        lootAttack({type, targetLevel, autoChangePointsEnabled, safeId});
    }).on('click', '.pd_cfg_tips', () => false)
        .on('click', '[type="checkbox"]', function () {
            let $this = $(this);
            let name = $this.attr('name');
            let checked = $this.prop('checked');
            if (name in Config && Config[name] !== checked) {
                readConfig();
                Config[name] = $this.prop('checked');
                writeConfig();
            }
        }).find('[name="customPointsScriptEnabled"]')
        .click(function () {
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
export const lootAttack = function ({type, targetLevel, autoChangePointsEnabled, safeId}) {
    let initCurrentLevel = getCurrentLevel(logList);
    if (targetLevel > 0 && targetLevel <= initCurrentLevel) return;
    let $wait = Msg.wait(
        `<strong>正在攻击中，请稍等&hellip;</strong><i>当前层数：<em class="pd_countdown">${initCurrentLevel}</em></i>` +
        '<a class="pd_stop_action pd_highlight" href="#">停止操作</a><a href="/" target="_blank">浏览其它页面</a>'
    );

    /**
     * 记录点数分配记录
     * @param {boolean} isSubmit 是否提交分配点数
     */
    const recordPointsLog = function (isSubmit = false) {
        propertyList = getLootPropertyList();
        let pointsText = '', propertiesText = '';
        $points.find('.pd_point').each(function () {
            let $this = $(this);
            let pointName = getPointNameByFieldName($this.attr('name'));
            let point = parseInt($.trim($this.val()));
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
        pointsLogList[getCurrentLevel(logList) + 1] = `点数方案（${pointsText}）\n争夺属性（${propertiesText}）`;
        sessionStorage.setItem(Const.tempPointsLogListStorageName, JSON.stringify(pointsLogList));
        if (isSubmit) console.log(`【分配点数】点数方案（${pointsText}）；争夺属性（${propertiesText}）`);
    };

    /**
     * 修改点数分配方案
     * @param {number} nextLevel 下一层（设为-1表示采用当前点数分配方案）
     * @returns {Deferred} Deferred对象
     */
    const changePoints = function (nextLevel) {
        if (nextLevel > 0 && Config.customPointsScriptEnabled && typeof Const.getCustomPoints === 'function') {
            let points = null;
            try {
                points = Const.getCustomPoints(
                    $.extend(getLootInfo(), {getExtraPoint, getPointByProperty, getPropertyByPoint})
                );
            }
            catch (ex) {
                console.log(ex);
            }
            if ($.type(points) === 'object') {
                for (let key of Object.keys(points)) {
                    $points.find(`[name="${getFieldNameByPointName(key)}"]`).val(points[key]).trigger('change');
                }
                nextLevel = -1;
            }
            else if (typeof points === 'number') {
                nextLevel = parseInt(points);
                nextLevel = nextLevel > 1 ? nextLevel : 1;
            }
            else if (points === false) {
                recordPointsLog();
                return $.Deferred().resolve('success');
            }
            else return $.Deferred().resolve('error');
        }

        let nextLevelText = getCurrentLevel(logList) + 1;
        let changeLevel = nextLevel > 0 ? Math.max(...Object.keys(Config.levelPointList).filter(level => level <= nextLevel)) : -1;
        let $levelPointListSelect = $('#pdLevelPointListSelect');
        if (changeLevel > 0) $levelPointListSelect.val(changeLevel).trigger('change');
        else $levelPointListSelect.get(0).selectedIndex = 0;
        let isChange = false;
        $points.find('.pd_point').each(function () {
            if (this.defaultValue !== $(this).val()) {
                isChange = true;
                return false;
            }
        });
        if (isChange) {
            if (Config.unusedPointNumAlertEnabled && !Info.w.unusedPointNumAlert && parseInt($('#pdSurplusPoint').text()) > 0) {
                if (confirm('可分配属性点尚未用完，是否继续？')) Info.w.unusedPointNumAlert = true;
                else return $.Deferred().resolve('error');
            }
            return $.ajax({
                type: 'POST',
                url: 'kf_fw_ig_enter.php',
                timeout: Const.defAjaxTimeout,
                data: $points.find('form').serialize(),
            }).then(function (html) {
                let {msg} = Util.getResponseMsg(html);
                if (/已经重新配置加点！/.test(msg)) {
                    Util.deleteCookie(Const.changePointsCountDownCookieName);
                    recordPointsLog(true);
                    changePointsAvailableCount = changePointsAvailableCount > 0 ? changePointsAvailableCount - 1 : 0;
                    $points.find('#pdChangeCount').text(`(当前修改配点可用[${changePointsAvailableCount}]次)`);
                    $points.find('.pd_point').each(function () {
                        this.defaultValue = $(this).val();
                    });
                    Script.runFunc('Loot.lootAttack_changePoints_success_', msg);
                    return 'success';
                }
                else {
                    let matches = /你还需要等待(\d+)分钟/.exec(msg);
                    if (matches) {
                        let nextTime = Util.getDate(`+${parseInt(matches[1])}m`);
                        Util.setCookie(Const.changePointsCountDownCookieName, nextTime.getTime(), nextTime);
                    }
                    Msg.show((`<strong>第<em>${nextLevelText}</em>层方案：${msg}</strong>`), -1);
                    Script.runFunc('Loot.lootAttack_changePoints_error_', msg);
                    return 'error';
                }
            }, () => 'timeout');
        }
        else {
            if (nextLevelText === 1) recordPointsLog();
            return $.Deferred().resolve('success');
        }
    };

    /**
     * 准备攻击（用于自动修改点数分配方案）
     * @param {number} currentLevel 当前层数（设为-1表示采用当前点数分配方案）
     * @param {number} interval 下次攻击的间隔时间
     */
    const ready = function (currentLevel, interval = Const.lootAttackInterval) {
        changePoints(currentLevel >= 0 ? currentLevel + 1 : -1).done(function (result) {
            if (result === 'success') setTimeout(attack, typeof interval === 'function' ? interval() : interval);
        }).fail(function (result) {
            if (result === 'timeout') setTimeout(() => ready(currentLevel, interval), Const.defAjaxInterval);
        }).always(function (result) {
            if (result !== 'success' && result !== 'timeout') {
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
            data: {'safeid': safeId},
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            if (Config.autoLootEnabled) Util.setCookie(Const.lootAttackingCookieName, 1, Util.getDate(`+${Const.lootAttackingExpires}m`));
            if (!/你\(\d+\)遭遇了/.test(html)) {
                setTimeout(check, Const.defAjaxInterval);
                return;
            }
            log = html + log;
            after();
            Script.runFunc('Loot.lootAttack_attack_after_', html);
        }).fail(function () {
            console.log('【争夺攻击】超时重试...');
            setTimeout(check, typeof Const.lootAttackInterval === 'function' ? Const.lootAttackInterval() : Const.lootAttackInterval);
        });
    };

    /**
     * 攻击之后
     * @param {boolean} isChecked 是否已检查过争夺记录
     */
    const after = function (isChecked = false) {
        logList = getLogList(log);
        levelInfoList = getLevelInfoList(logList);
        showEnhanceLog(logList, levelInfoList, pointsLogList);
        showLogStat(levelInfoList);
        let currentLevel = getCurrentLevel(logList);
        console.log('【争夺攻击】当前层数：' + currentLevel);
        let $countdown = $('.pd_countdown:last');
        $countdown.text(currentLevel);
        $points.find('.pd_point').each(function () {
            showNewLootProperty($(this));
        });
        let info = levelInfoList[currentLevel];
        $properties.find('#pdCurrentLife').text(info ? info.life : 0);

        let isFail = /你被击败了/.test(log);
        let isStop = isFail || type !== 'auto' || (targetLevel && currentLevel >= targetLevel) || $countdown.closest('.pd_msg').data('stop');
        if (isStop) {
            if (Config.autoLootEnabled) {
                Util.deleteCookie(Const.lootCheckingCookieName);
                Util.deleteCookie(Const.lootAttackingCookieName);
                Util.setCookie(Const.lootCompleteCookieName, 1, getAutoLootCookieDate());
            }
            if (isFail) {
                if (isChecked) {
                    Msg.remove($wait);
                    recordLootInfo(logList, levelInfoList, pointsLogList);
                }
                else setTimeout(check, Const.defAjaxInterval);
            }
            else {
                Msg.remove($wait);
                Msg.show(`<strong>你成功击败了第<em>${currentLevel}</em>层的NPC</strong>`, -1);
            }
        }
        else {
            if (autoChangePointsEnabled) setTimeout(() => ready(currentLevel), Const.defAjaxInterval);
            else setTimeout(attack, typeof Const.lootAttackInterval === 'function' ? Const.lootAttackInterval() : Const.lootAttackInterval);
        }
    };

    /**
     * 检查争夺记录
     */
    const check = function () {
        console.log('检查争夺记录Start');
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            let $log = $('#pk_text', html);
            if (!$log.length) {
                Msg.remove($wait);
                return;
            }
            log = $log.html();

            let countDownMatches = /\(下次修改配点还需\[(\d+)]分钟\)/.exec(html);
            if (countDownMatches) {
                changePointsAvailableCount = 0;
                let nextTime = Util.getDate(`+${countDownMatches[1]}m`);
                Util.setCookie(Const.changePointsCountDownCookieName, nextTime.getTime(), nextTime);
            }
            let changeCountMatches = /当前修改配点可用\[(\d+)]次/.exec(html);
            if (changeCountMatches) {
                changePointsAvailableCount = parseInt(changeCountMatches[1]);
                Util.setCookie(Const.changePointsCountDownCookieName, 0, Util.getDate(`+${Const.changePointsCountDownExpires}m`));
            }
            $points.find('#pdChangeCount').text(`(当前修改配点可用[${changePointsAvailableCount}]次)`);
            after(true);
            Script.runFunc('Loot.lootAttack_check_after_', html);
        }).fail(() => setTimeout(check, Const.defAjaxInterval));
    };

    ready(autoChangePointsEnabled ? initCurrentLevel : -1, 0);
};

/**
 * 获取当前争夺信息
 * @returns {{}} 当前争夺信息
 */
export const getLootInfo = function () {
    let currentLevel = getCurrentLevel(logList);
    let info = levelInfoList[currentLevel];
    let currentLife = 0, currentInitLife = 0;
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
        changePointsAvailableCount,
        log,
        logList,
        enemyList,
    };
};

/**
 * 记录争夺信息
 * @param {string[]} logList 各层争夺记录列表
 * @param {{}[]} levelInfoList 各层战斗信息列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
const recordLootInfo = function (logList, levelInfoList, pointsLogList) {
    Util.setCookie(Const.lootCompleteCookieName, 2, getAutoLootCookieDate());
    sessionStorage.removeItem(Const.tempPointsLogListStorageName);

    let allEnemyList = {};
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList))) {
        allEnemyList[enemy] = num;
    }
    let allEnemyStat = '';
    for (let [enemy, num] of Util.entries(allEnemyList)) {
        allEnemyStat += enemy + '`+' + num + '` ';
    }

    let latestEnemyList = {};
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList.filter((elem, level) => level >= logList.length - Const.enemyStatLatestLevelNum)))) {
        latestEnemyList[enemy] = num;
    }
    let latestEnemyStat = '';
    for (let [enemy, num] of Util.entries(latestEnemyList)) {
        latestEnemyStat += enemy + '`+' + num + '` ';
    }

    let currentLevel = getCurrentLevel(logList);
    let {kfb, exp} = getTotalGain(levelInfoList);
    if (kfb > 0 && exp > 0) {
        Log.push(
            '争夺攻击',
            `你成功击败了第\`${currentLevel - 1}\`层的NPC (全部：${allEnemyStat.trim()}；最近${Const.enemyStatLatestLevelNum}层：${latestEnemyStat.trim()})`,
            {gain: {'KFB': kfb, '经验值': exp}}
        );
        LootLog.record(logList, pointsLogList);
    }
    Msg.show(
        `<strong>你被第<em>${currentLevel}</em>层的NPC击败了</strong>` +
        `<i>KFB<em>+${kfb.toLocaleString()}</em></i><i>经验值<em>+${exp.toLocaleString()}</em></i>`,
        -1
    );

    if (Config.autoGetDailyBonusEnabled && Config.getBonusAfterLootCompleteEnabled) {
        Util.deleteCookie(Const.getDailyBonusCookieName);
        Public.getDailyBonus();
    }
    Script.runFunc('Loot.recordLootLog_after_');
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
            readConfig();
            Config[name] = $this.prop('checked');
            writeConfig();
            if (name === 'showLiteLootLogEnabled') showEnhanceLog(logList, levelInfoList, pointsLogList);
            else if (name === 'showLevelEnemyStatEnabled') showLogStat(levelInfoList);
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
        }
        catch (ex) {
            alert('争夺记录有错误');
            return;
        }
        if (!newLog || $.type(newLog) !== 'object') {
            alert('争夺记录有错误');
            return;
        }
        if (name === 'merge') log = LootLog.getMergeLog(log, newLog);
        else log = newLog;
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
        if (!/你被击败了/.test(log) || latestKey <= Util.getDate('-1d').getTime() || historyLogs[latestKey].log.join('').trim() !== logList.join('').trim())
            keyList.push(0);
    }
    else keyList.push(0);
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
        }
        else if (name === 'prev') {
            if (curIndex > 0) curIndex--;
            else return;
        }
        else if (name === 'next') {
            if (curIndex < keyList.length - 1) curIndex++;
            else return;
        }
        else if (name === 'end') {
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
        }
        else {
            $logNav.find('[data-name="start"], [data-name="prev"]').removeAttr('title').addClass('pd_disabled_link');
        }
        if (curIndex < keyList.length - 1) {
            $logNav.find('[data-name="next"]').attr('title', getKeyTitleStr(keyList[curIndex + 1])).removeClass('pd_disabled_link');
            $logNav.find('[data-name="end"]').attr('title', getKeyTitleStr(keyList[keyList.length - 1])).removeClass('pd_disabled_link');
        }
        else {
            $logNav.find('[data-name="next"], [data-name="end"]').removeAttr('title').addClass('pd_disabled_link');
        }
    });

    if (!log.includes('本日无争夺记录')) {
        let curLogList = keyList[curIndex] === 0 ? logList : historyLogs[keyList[curIndex]].log;
        let curLevelInfoList = getLevelInfoList(curLogList);
        let curPointsLogList = keyList[curIndex] === 0 ? pointsLogList : historyLogs[keyList[curIndex]].points;
        showEnhanceLog(curLogList, curLevelInfoList, curPointsLogList);

        if (Config.autoSaveLootLogInSpecialCaseEnabled && /你被击败了/.test(log) && keyList[curIndex] === 0) {
            Util.deleteCookie(Const.lootCompleteCookieName);
            autoSaveLootLog();
        }
    }
};

/**
 * 显示争夺记录统计
 * @param {{}[]} levelInfoList 各层战斗信息列表
 */
const showLogStat = function (levelInfoList) {
    let {exp, kfb} = getTotalGain(levelInfoList);
    let allEnemyStatHtml = '';
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList))) {
        allEnemyStatHtml += `<i>${enemy}<em>+${num}</em></i> `;
    }
    let latestEnemyStatHtml = '';
    for (let [enemy, num] of Util.entries(getEnemyStatList(levelInfoList.filter((elem, level) => level >= levelInfoList.length - Const.enemyStatLatestLevelNum)))) {
        latestEnemyStatHtml += `<i>${enemy}<em>+${num}</em></i> `;
    }
    let $logStat = $('#pdLogStat');
    $logStat.html(`
<li><b>收获统计：</b><i>KFB<em>+${kfb.toLocaleString()}</em></i> <i>经验值<em>+${exp.toLocaleString()}</em></i></li>
<li>
  <b>全部层数：</b>${allEnemyStatHtml}<br>
  <b>最近${Const.enemyStatLatestLevelNum}层：</b>${latestEnemyStatHtml}
</li>
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
        list[level] = levelLog.replace(matches[0], `<span style="background-color: ${color};">[${enemy}的]</span>NPC`);

        if (pointsLogList[level]) {
            let levelPointsLog = pointsLogList[level];
            enemy = enemy.replace('特别', '');
            let pointMatches = /灵活：\d+\+\d+=(\d+)/.exec(levelPointsLog);
            if (pointMatches) {
                let realCriticalStrikePercent = getRealProperty('灵活', parseInt(pointMatches[1]), level, enemy);
                levelPointsLog = levelPointsLog.replace(
                    /(暴击几率：\d+%)/, `$1<span class="pd_custom_tips" title="实际暴击几率">(${realCriticalStrikePercent}%)</span>`
                );
            }
            pointMatches = /智力：\d+\+\d+=(\d+)/.exec(levelPointsLog);
            if (pointMatches) {
                let realSkillPercent = getRealProperty('智力', parseInt(pointMatches[1]), level, enemy);
                levelPointsLog = levelPointsLog.replace(
                    /(技能释放概率：\d+%)/, `$1<span class="pd_custom_tips" title="实际技能释放概率">(${realSkillPercent}%)</span>`
                );
            }
            list[level] = list[level].replace(
                '</li>', `</li><li class="pk_log_g" style="color: #666;">${levelPointsLog}</li>`.replace(/\n/g, '<br>')
            );
        }
    });
    $log.html(list.reverse().join(''));

    if (Config.showLiteLootLogEnabled) {
        if (!$('#pdLiteLootLogStyle').length) {
            $('head').append('<style id="pdLiteLootLogStyle">.pk_log_g, .pk_log_i, .pk_log_u, .pk_log_v { display: none; }</style>');
        }
    }
    else $('#pdLiteLootLogStyle').remove();
    Script.runFunc('Loot.showEnhanceLog_after_');
};

/**
 * 获取争夺记录
 * @returns {string} 争夺记录
 */
export const getLog = () => log;

/**
 * 获取各层争夺记录列表
 * @param log 争夺记录
 * @returns {string[]} 各层争夺记录列表
 */
export const getLogList = function (log) {
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
 * @returns {{enemy: string, life: number, initLife: number, kfb: number, exp: number}} enemy：遭遇敌人名称；life：该层剩余生命值；initLife：该层初始生命值；kfb：KFB；exp：经验
 */
export const getLevelInfo = function (levelLog) {
    let info = {enemy: '', life: 0, initLife: 0, kfb: 0, exp: 0};
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
export const getLevelInfoList = function (logList) {
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
 * @returns {{kfb: number, exp: number}} kfb：KFB；exp：经验
 */
const getTotalGain = function (levelInfoList) {
    let totalKfb = 0, totalExp = 0;
    $.each(levelInfoList, function (level, info) {
        if (!info) return;
        totalKfb += info.kfb;
        totalExp += info.exp;
    });
    return {kfb: totalKfb, exp: totalExp};
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
        '脆弱': 0,
        '缓慢': 0,
        'BOSS': 0,
        '大魔王': 0,
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
    let pointsLogList = sessionStorage.getItem(Const.tempPointsLogListStorageName);
    if (!pointsLogList) return [];
    try {
        pointsLogList = JSON.parse(pointsLogList);
    }
    catch (ex) {
        return [];
    }
    if (!pointsLogList || !Array.isArray(pointsLogList)) return [];
    if (pointsLogList.length > logList.length) {
        sessionStorage.removeItem(Const.tempPointsLogListStorageName);
        return [];
    }
    return pointsLogList;
};

/**
 * 获取自动争夺Cookies有效期
 * @returns {Date} Cookies有效期的Date对象
 */
const getAutoLootCookieDate = function () {
    let now = new Date();
    let date = Util.getTimezoneDateByTime('02:30:00');
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
export const checkLoot = function () {
    if (new Date() < Util.getDateByTime(Config.checkLootAfterTime)) return;

    console.log('检查争夺情况Start');
    let $wait = Msg.wait('<strong>正在检查争夺情况中&hellip;</strong>');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
        timeout: Const.defAjaxTimeout,
        success (html) {
            Msg.remove($wait);
            if (!/你被击败了/.test(html)) {
                if (Util.getCookie(Const.lootCheckingCookieName)) return;
                let $log = $('#pk_text', html);
                if (!$log.length) {
                    Util.setCookie(Const.lootCompleteCookieName, -1, Util.getDate(`+${Const.checkLootInterval}m`));
                    return;
                }
                if (Config.attackTargetLevel > 0) {
                    let log = $log.html();
                    let logList = getLogList(log);
                    let currentLevel = getCurrentLevel(logList);
                    if (Config.attackTargetLevel <= currentLevel) {
                        Util.setCookie(Const.lootCompleteCookieName, 1, getAutoLootCookieDate());
                        return;
                    }
                }
                Util.setCookie(Const.lootCheckingCookieName, 1, Util.getDate('+1m'));
                Msg.destroy();
                location.href = 'kf_fw_ig_index.php';
            }
            else {
                Util.setCookie(Const.lootCompleteCookieName, 2, getAutoLootCookieDate());
            }
        },
        error () {
            Msg.remove($wait);
            setTimeout(checkLoot, Const.defAjaxInterval);
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
        Util.setCookie(Const.lootCompleteCookieName, 1, getAutoLootCookieDate());
        return;
    }
    Util.setCookie(Const.lootAttackingCookieName, 1, Util.getDate(`+${Const.lootAttackingExpires}m`));
    Util.deleteCookie(Const.lootCompleteCookieName);
    let autoChangePointsEnabled = Config.autoChangeLevelPointsEnabled || Config.customPointsScriptEnabled && typeof Const.getCustomPoints === 'function';
    lootAttack({type: 'auto', targetLevel: Config.attackTargetLevel, autoChangePointsEnabled, safeId});
};

/**
 * 自动保存争夺记录
 */
export const autoSaveLootLog = function () {
    console.log('检查争夺情况Start');
    let $wait = Msg.wait('<strong>正在检查争夺情况中&hellip;</strong>');
    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
        timeout: Const.defAjaxTimeout,
        success (html) {
            Msg.remove($wait);
            if (Util.getCookie(Const.lootCompleteCookieName)) return;
            let $log = $('#pk_text', html);
            let log = $log.html();
            if (/你被击败了/.test(log)) {
                Util.setCookie(Const.lootCompleteCookieName, 2, getAutoLootCookieDate());
                let logList = getLogList(log);
                let levelInfoList = getLevelInfoList(logList);
                let historyLogs = LootLog.read();
                if (!$.isEmptyObject(historyLogs)) {
                    let keyList = Util.getObjectKeyList(historyLogs, 1);
                    let latestKey = parseInt(keyList[keyList.length - 1]);
                    if (latestKey > Util.getDate('-1d').getTime() && historyLogs[latestKey].log.join('').trim() === logList.join('').trim()) return;
                }
                recordLootInfo(logList, levelInfoList, []);
            }
            else {
                Util.setCookie(Const.lootCompleteCookieName, -1, Util.getDate(`+${Const.checkLootInterval}m`));
            }
        },
        error () {
            Msg.remove($wait);
            setTimeout(autoSaveLootLog, Const.defAjaxInterval);
        }
    });
};

/**
 * 获取改点倒计时
 * @returns {Deferred} Deferred对象
 */
export const getChangePointsCountDown = function () {
    console.log('获取改点倒计时Start');
    return $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
        timeout: Const.defAjaxTimeout,
    }).then(function (html) {
        let matches = /\(下次修改配点还需\[(\d+)]分钟\)/.exec(html);
        if (matches) {
            let nextTime = Util.getDate(`+${matches[1]}m`);
            Util.setCookie(Const.changePointsCountDownCookieName, nextTime.getTime(), nextTime);
            return nextTime.getTime();
        }
        else {
            Util.setCookie(Const.changePointsCountDownCookieName, 0, Util.getDate(`+${Const.changePointsCountDownExpires}m`));
            return 0;
        }
    }, () => 'timeout');
};

/**
 * 在争夺排行页面添加用户链接
 */
export const addUserLinkInPkListPage = function () {
    $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === Info.userName) $this.find('a').addClass('pd_highlight');
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
            if (isInitLootPage) enhanceLootIndexPage();
            else $points.find('.pd_point').trigger('change');
        }
    }).always(function (result) {
        Msg.remove($wait);
        if (result === 'timeout') setTimeout(() => readHaloInfo(isInitLootPage), Const.defAjaxInterval);
        else if (result === 'error') Msg.show('<strong>战力光环信息获取失败！</strong>');
    });
};

/**
 * 获取战力光环信息
 * @returns {Deferred} Deferred对象
 */
export const getHaloInfo = function () {
    return $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_halo.php?t=' + new Date().getTime(),
        timeout: Const.defAjaxTimeout,
    }).then(function (html) {
        let haloInfo = {'全属性': 0, '攻击力': 0, '生命值': 0};
        let matches = /全属性\s*\+\s*(\d+(?:\.\d+)?)%/.exec(html);
        if (matches) {
            haloInfo['全属性'] = parseFloat(matches[1]) * 10 / 1000;
            let extraMatches = /福利加成\s*\+\s*(\d+)攻击力\s*&\s*\+\s*(\d+)生命值/.exec(html);
            if (extraMatches) {
                haloInfo['攻击力'] = parseInt(extraMatches[1]);
                haloInfo['生命值'] = parseInt(extraMatches[2]);
            }
            TmpLog.setValue(Const.haloInfoTmpLogName, $.extend(haloInfo, {time: new Date().getTime()}));
            return haloInfo;
        }
        else return 'error';
    }, () => 'timeout');
};

/**
 * 设置战力光环信息
 * @param {{}} newHaloInfo 光环信息对象
 */
export const setHaloInfo = function (newHaloInfo) {
    haloInfo = newHaloInfo;
    if (!$lootArea.find('#pdHaloInfo').length) {
        $('<span id="pdHaloInfo"></span> <a class="pd_btn_link" data-name="reloadHaloInfo" href="#" title="如战力光环信息不正确时，请点此重新读取">重新读取</a><br>')
            .appendTo($itemInfo)
            .filter('[data-name="reloadHaloInfo"]')
            .click(function (e) {
                e.preventDefault();
                if (confirm('是否重新读取战力光环信息？')) {
                    TmpLog.deleteValue(Const.haloInfoTmpLogName);
                    readHaloInfo();
                }
            });
    }
    $lootArea.find('#pdHaloInfo').text(`战力光环：[全属性+${haloInfo['全属性'] * 1000 / 10}%][攻击力+${haloInfo['攻击力']}][生命值+${haloInfo['生命值']}]`);
};

/**
 * 获取战力光环页面信息
 * @param {boolean} isInitLootPage 是否初始化争夺首页
 */
export const getPromoteHaloInfo = function (isInitLootPage = false) {
    Script.runFunc('Loot.getPromoteHaloInfo_before_');
    console.log('获取战力光环页面信息Start');
    let $wait = Msg.wait('<strong>正在获取战力光环信息，请稍候&hellip;</strong>');

    $.ajax({
        type: 'GET',
        url: 'kf_fw_ig_halo.php?t=' + new Date().getTime(),
        timeout: Const.defAjaxTimeout,
    }).done(function (html) {
        Msg.remove($wait);

        let safeIdMatches = /safeid=(\w+)"/.exec(html);
        if (!safeIdMatches) {
            let nextTime = Util.getDate('+1h');
            Util.setCookie(Const.promoteHaloCookieName, nextTime.getTime(), nextTime);
            if (isInitLootPage) init();
            return;
        }
        let safeId = safeIdMatches[1];

        let surplusMatches = /下次随机还需\[(\d+)]分钟/.exec(html);
        if (surplusMatches) {
            let promoteHaloInterval = Config.promoteHaloAutoIntervalEnabled ? Const.minPromoteHaloInterval : Config.promoteHaloInterval * 60;
            let nextTime = Util.getDate(`+${promoteHaloInterval - (Const.minPromoteHaloInterval - parseInt(surplusMatches[1]))}m`);
            Util.setCookie(Const.promoteHaloCookieName, nextTime.getTime(), nextTime);
            if (isInitLootPage) init();
            return;
        }

        let totalCount = 1;
        let countMatches = /当前光环随机可用\[(\d+)]次/.exec(html);
        if (Config.promoteHaloAutoIntervalEnabled && countMatches) totalCount = parseInt(countMatches[1]);

        promoteHalo(totalCount, Config.promoteHaloCostType, safeId, isInitLootPage);
    }).fail(function () {
        Msg.remove($wait);
        setTimeout(getPromoteHaloInfo, Const.defAjaxInterval);
    });
};

/**
 * 提升战力光环
 * @param {number} totalCount 总次数
 * @param {number} promoteHaloCostType 自动提升战力光环的花费类型，参见{@link Config.promoteHaloCostType}
 * @param {string} safeId SafeID
 * @param {boolean} isInitLootPage 是否初始化争夺首页
 */
export const promoteHalo = function (totalCount, promoteHaloCostType, safeId, isInitLootPage = false) {
    console.log('提升战力光环Start');
    let $wait = Msg.wait(
        `<strong>正在提升战力光环&hellip;</strong><i>剩余：<em class="pd_countdown">${totalCount}</em></i><a class="pd_stop_action" href="#">停止操作</a>`
    );
    TmpLog.deleteValue(Const.haloInfoTmpLogName);
    let isStop = false;
    let index = 0;
    let nextTime = Util.getDate('+10m').getTime();

    /**
     * 提升
     */
    const promote = function () {
        $.ajax({
            type: 'GET',
            url: `kf_fw_ig_halo.php?do=buy&id=${promoteHaloCostType}&safeid=${safeId}&t=${new Date().getTime()}`,
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            Public.showFormatLog('提升战力光环', html);
            let {msg} = Util.getResponseMsg(html);

            let matches = /(新数值为|随机值为)\[(\d+(?:\.\d+)?)%]/.exec(msg);
            if (matches) {
                let isNew = matches[1] === '新数值为';

                nextTime = Config.promoteHaloAutoIntervalEnabled ? 0 : Util.getDate(`+${Config.promoteHaloInterval}h`).getTime();
                let randomNum = parseFloat(matches[2]);
                let costResult = getPromoteHaloCostByTypeId(promoteHaloCostType);
                Msg.show(
                    '<strong>' +
                    (isNew ?
                        `恭喜你提升了光环的效果！新数值为【<em>${randomNum}%</em>】` : `你本次随机值为【<em>${randomNum}%</em>】，未超过光环效果`) +
                    `</strong><i>${costResult.type}<ins>${(-costResult.num).toLocaleString()}</ins></i>`
                    , -1
                );

                let pay = {};
                pay[costResult.type] = -costResult.num;
                Log.push(
                    '提升战力光环',
                    isNew ? `恭喜你提升了光环的效果！新数值为【\`${randomNum}%\`】` : `你本次随机值为【\`${randomNum}%\`】，未超过光环效果`,
                    {pay}
                );
                index++;
            }
            else {
                if (/两次操作间隔过短/.test(msg)) nextTime = Util.getDate('+10s').getTime();
                else isStop = true;

                matches = /你的(贡献点数|KFB)不足/.exec(msg);
                if (matches) {
                    nextTime = Util.getDate(`+${Config.promoteHaloInterval}h`).getTime();
                    Msg.show(`<strong>${matches[1]}不足，无法提升战力光环</strong><a href="kf_fw_ig_halo.php" target="_blank">手动选择</a>`, -1);
                }

                matches = /你还需要等待(\d+)分钟/.exec(msg);
                if (matches) {
                    nextTime = Util.getDate(`+${Config.promoteHaloInterval * 60 - (Const.minPromoteHaloInterval - parseInt(matches[1]))}m`).getTime();
                }
            }
        }).always(function () {
            $wait.find('.pd_countdown').text(totalCount - index);
            isStop = isStop || $wait.data('stop');
            if (isStop || index === totalCount) {
                Msg.remove($wait);
                if (nextTime > 0 || isStop) {
                    Util.setCookie(Const.promoteHaloCookieName, nextTime, new Date(nextTime));
                }
                else {
                    Util.deleteCookie(Const.promoteHaloCookieName);
                    getPromoteHaloInfo();
                }
                if (isInitLootPage) init();
                Script.runFunc('Loot.promoteHalo_after_');
            }
            else {
                setTimeout(promote, Const.promoteHaloActionInterval);
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
export const getPromoteHaloCostByTypeId = function (id) {
    switch (id) {
        case 1:
            return {type: 'KFB', num: 100};
        case 2:
            return {type: 'KFB', num: 1000};
        case 11:
            return {type: '贡献', num: 0.2};
        case 12:
            return {type: '贡献', num: 2};
        default:
            return {type: 'KFB', num: 0};
    }
};

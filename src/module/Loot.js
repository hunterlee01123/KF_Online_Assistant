/* 争夺模块 */
'use strict';
import * as Item from './Item';

// 争夺首页区域
let $lootArea;
// 争夺属性区域
let $properties;
// 属性点区域
let $points;
// 当前争夺属性
let propertyList;
// 附加属性点列表
let extraPointList;
// 道具使用情况
let itemUsedNumList;

/**
 * 增强争夺首页
 */
export const enhanceLootIndexPage = function () {
    $lootArea = $('.kf_fw_ig1:first');
    $properties = $lootArea.find('> tbody > tr:nth-child(3) > td:first-child');
    $points = $lootArea.find('> tbody > tr:nth-child(3) > td:nth-child(2)');
    propertyList = getLootPropertyList();
    extraPointList = getExtraPointList();
    itemUsedNumList = Item.getItemUsedInfo($lootArea.find('> tbody > tr:nth-child(4) > td').html());
    handlePropertiesArea();
    handlePointsArea();
    enhanceLootLog();
};

/**
 * 处理争夺属性区域
 */
const handlePropertiesArea = function () {
    let html = $properties.html()
        .replace(/(攻击力：)(\d+)/, '$1<span id="pdPro_s1" title="原值：$2">$2</span> <span id="pdNew_s1"></span>')
        .replace(/(生命值：\d+)\s*\(最大(\d+)\)/, '$1 (最大<span id="pdPro_s2" title="原值：$2">$2</span>) <span id="pdNew_s2"></span>')
        .replace(/(攻击速度：)(\d+)/, '$1<span id="pdPro_d1" title="原值：$2">$2</span> <span id="pdNew_d1"></span>')
        .replace(/(暴击几率：)(\d+)%/, '$1<span id="pdPro_d2" title="原值：$2">$2</span>% <span id="pdNew_d2"></span>')
        .replace(/(技能释放概率：)(\d+)%/, '$1<span id="pdPro_i1" title="原值：$2">$2</span>% <span id="pdNew_i1"></span>')
        .replace(/(防御：)(\d+)%减伤/, '$1<span id="pdPro_i2" title="原值：$2">$2</span>%减伤 <span id="pdNew_i2"></span>')
        .replace('技能伤害：攻击伤害+(体质点数*4)', '技能伤害：<span class="pd_custom_tips" id="pdSkillAttack" title="攻击伤害+(体质点数*4)"></span>');
    $properties.html(html);

    $properties.on('click', '[id^="pdPro_"]', function () {
        let $this = $(this);
        $this.hide();
        let name = $this.attr('id').replace('pdPro_', '');
        let step = 1;
        if (name === 's1') step = 5;
        else if (name === 's2') step = 20;
        else if (name === 'd1') step = 2;
        $(`<input data-name="${name}" type="number" value="${parseInt($this.text())}" min="1" step="${step}" ` +
            `style="width: 65px; margin-right: 5px;" title="${$this.attr('title')}">`
        ).insertAfter($this)
            .focus()
            .select()
            .blur(function () {
                let $this = $(this);
                let name = $this.data('name');
                let num = parseInt($this.val());
                if (num > 0) {
                    let newValue = 0;
                    switch (getPointNameByFieldName(name)) {
                        case '力量':
                            newValue = Math.round(num / 5) - extraPointList.get('力量');
                            break;
                        case '体质':
                            newValue = Math.round((itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? num - 700 : num) / 20) - extraPointList.get('体质');
                            break;
                        case '敏捷':
                            newValue = Math.round((itemUsedNumList.get('十六夜同人漫画') === 50 ? num - 100 : num) / 2) - extraPointList.get('敏捷');
                            break;
                        case '灵活':
                            newValue = Math.round(100 * num / (100 - num)) - extraPointList.get('灵活');
                            break;
                        case '智力':
                            newValue = Math.round(120 * num / (100 - num)) - extraPointList.get('智力');
                            break;
                        case '意志':
                            newValue = Math.round(150 * num / (100 - num)) - extraPointList.get('意志');
                            break;
                    }
                    if (!isFinite(newValue) || newValue <= 0) newValue = 1;
                    $points.find(`[name="${name}"]`).val(newValue).trigger('change');
                }
                $this.prev().show().end().remove();
            })
            .keyup(function (e) {
                let $this = $(this);
                if (e.keyCode === 13) $this.blur();
                else if (e.keyCode === 27) $this.val('').blur();
            });
    }).find('[id^=pdPro_]').css('cursor', 'pointer');
};

/**
 * 处理属性点区域
 */
const handlePointsArea = function () {
    $points.find('[type="text"]').attr('type', 'number').attr('min', 1).attr('max', 999).prop('required', true).css('width', '60px');
    $points.find('input[readonly]').attr('min', 0).prop('disabled', true).removeProp('required', true);
    $points.prepend('<span class="pd_highlight">剩余属性点：<span id="pdSurplusPoint"></span></span><br>');

    $points.on('change', '[type="number"]', function () {
        let $this = $(this);
        $('#pdSurplusPoint').text(propertyList.get('可分配属性点') - getCurrentAssignedPoint());
        showNewLootProperty($this);
        showSumOfPoint($this);

        let skillAttack = 0;
        let matches = /\d+/.exec($lootArea.find('[name="s1"]').next('span').next('.pd_point_sum').text());
        if (matches) skillAttack = parseInt(matches[0]) * 5;
        skillAttack += parseInt($lootArea.find('[name="s2"]').val()) * 4;
        $('#pdSkillAttack').text(skillAttack);
    }).on('click', '.pd_point_sum', function () {
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint();
        if (!surplusPoint) return;
        let $point = $(this).prev('span').prev('[type="number"]');
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        $point.val(num + surplusPoint).trigger('change');
    }).find('form').submit(function () {
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint();
        if (surplusPoint < 0) {
            alert('剩余属性点为负，请重新填写');
            return false;
        }
        else if (surplusPoint > 0) {
            return confirm('你的可分配属性点尚未用完，是否提交？');
        }
    }).find('[type="number"]').trigger('change');
};

/**
 * 获取争夺属性列表
 * @returns {Map} 争夺属性
 */
const getLootPropertyList = function () {
    let propertyList = new Map([
        ['攻击力', 0],
        ['最大生命值', 0],
        ['攻击速度', 0],
        ['暴击几率', 0],
        ['技能释放概率', 0],
        ['防御', 0],
        ['可分配属性点', 0],
    ]);
    let html = $properties.html();
    let matches = /攻击力：(\d+)/.exec(html);
    if (matches) propertyList.set('攻击力', parseInt(matches[1]));
    matches = /生命值：\d+\s*\(最大(\d+)\)/.exec(html);
    if (matches) propertyList.set('最大生命值', parseInt(matches[1]));
    matches = /攻击速度：(\d+)/.exec(html);
    if (matches) propertyList.set('攻击速度', parseInt(matches[1]));
    matches = /暴击几率：(\d+)%/.exec(html);
    if (matches) propertyList.set('暴击几率', parseInt(matches[1]));
    matches = /技能释放概率：(\d+)%/.exec(html);
    if (matches) propertyList.set('技能释放概率', parseInt(matches[1]));
    matches = /防御：(\d+)%/.exec(html);
    if (matches) propertyList.set('防御', parseInt(matches[1]));
    matches = /可分配属性点：(\d+)/.exec(html);
    if (matches) propertyList.set('可分配属性点', parseInt(matches[1]));
    return propertyList;
};

/**
 * 获取当前已分配的属性点
 * @returns {number} 当前已分配的属性点
 */
const getCurrentAssignedPoint = function () {
    let usedPoint = 0;
    $points.find('[type="number"]').each(function () {
        let point = parseInt($(this).val());
        if (point && point > 0) usedPoint += point;
    });
    return usedPoint;
};

/**
 * 显示各项属性点的和值
 * @param {jQuery} $point 属性点字段对象
 */
const showSumOfPoint = function ($point) {
    let num = parseInt($point.val());
    if (isNaN(num) || num < 0) num = 0;
    let extraNum = parseInt($point.next('span').text());
    let $sum = $point.next('span').next('.pd_point_sum');
    if (!$sum.length) {
        $sum = $('<span class="pd_point_sum" style="color: #ff0033; cursor: pointer;" title="点击：给该项加上或减去剩余属性点"></span>')
            .insertAfter($point.next('span'));
    }
    $sum.text('=' + (num + extraNum));
};

/**
 * 获取附加属性点列表
 * @returns {Map} 附加属性点列表
 */
const getExtraPointList = function () {
    let extraPointList = new Map([
        ['力量', 0],
        ['体质', 0],
        ['敏捷', 0],
        ['灵活', 0],
        ['智力', 0],
        ['意志', 0],
        ['耐力', 0],
        ['幸运', 0],
    ]);
    $points.find('[type="text"]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        let num = parseInt($this.next('span').text());
        let key = getPointNameByFieldName(name);
        if (!isNaN(num) && key) {
            extraPointList.set(key, num);
        }
    });
    return extraPointList;
};

/**
 * 根据字段名称获取属性点名称
 * @param {string} fieldName 字段名称
 * @returns {string} 属性点名称
 */
const getPointNameByFieldName = function (fieldName) {
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
 * 显示新的争夺属性
 * @param {jQuery} $point 属性点字段对象
 */
const showNewLootProperty = function ($point) {
    let name = $point.attr('name');
    let num = parseInt($point.val());
    if (isNaN(num) || num < 0) num = 0;
    let oriNum = parseInt($point.get(0).defaultValue);
    let extraNum = parseInt($point.next('span').text());
    let newValue = 0, diffValue = 0;
    switch (name) {
        case 's1':
            newValue = (num + extraNum) * 5;
            diffValue = newValue - propertyList.get('攻击力');
            break;
        case 's2':
            newValue = (num + extraNum) * 20 + (itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0);
            diffValue = newValue - propertyList.get('最大生命值');
            break;
        case 'd1':
            newValue = (num + extraNum) * 2 + (itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0);
            diffValue = newValue - propertyList.get('攻击速度');
            break;
        case 'd2':
            newValue = num + extraNum;
            newValue = Math.round(newValue / (newValue + 100) * 100);
            diffValue = newValue - propertyList.get('暴击几率');
            break;
        case 'i1':
            newValue = num + extraNum;
            newValue = Math.round(newValue / (newValue + 120) * 100);
            diffValue = newValue - propertyList.get('技能释放概率');
            break;
        case 'i2':
            newValue = num + extraNum;
            newValue = Math.round(newValue / (newValue + 150) * 100);
            diffValue = newValue - propertyList.get('防御');
            break;
    }
    $('#pdPro_' + name).text(newValue).css('color', num !== oriNum ? '#00f' : '#000');

    if (num !== oriNum)
        $('#pdNew_' + name).text(`(${(diffValue >= 0 ? '+' : '') + diffValue})`).css('color', diffValue >= 0 ? '#ff0033' : '#339933');
    else
        $('#pdNew_' + name).text('');
};

/**
 * 增强争夺记录
 */
const enhanceLootLog = function () {
    let $log = $lootArea.find('> tbody > tr:nth-child(5) > td');
    let matches = $log.html().match(/获得\d+经验和\d+KFB/g);
    let exp = 0, kfb = 0;
    for (let i in matches) {
        let logMatches = /获得(\d+)经验和(\d+)KFB/.exec(matches[i]);
        exp += parseInt(logMatches[1]);
        kfb += parseInt(logMatches[2]);
    }
    if (exp || kfb) {
        $log.prepend(`<b class="pd_stat">你总共获得了<em>${exp.toLocaleString()}</em>经验和<em>${kfb.toLocaleString()}</em>KFB</b><br>`);
    }
};

/**
 * 在争夺排行页面添加用户链接
 */
export const addUserLinkInPkListPage = function () {
    $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
    });
};

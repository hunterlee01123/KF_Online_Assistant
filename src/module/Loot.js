/* 争夺模块 */
'use strict';
import * as Item from './Item';

/**
 * 增强争夺首页
 */
export const enhanceLootIndexPage = function () {
    let $area = $('.kf_fw_ig1');
    let $properties = $area.find('> tbody > tr:nth-child(3) > td:first-child');
    let $points = $properties.next('td');
    let propertyList = getCurrentLootPropertyList();
    let itemUsedNumList = Item.getItemUsedInfo($area.find('> tbody > tr:nth-child(4) > td').html());

    $properties.html(
        $properties.html().replace(
            '技能伤害：攻击伤害+(体质点数*4)',
            '技能伤害：<span class="pd_custom_tips" id="pd_skill_attack" title="攻击伤害+(体质点数*4)"></span>'
        )
    );
    $properties.find('br').each(function (index) {
        let name = '';
        switch (index) {
            case 1:
                name = 's1';
                break;
            case 2:
                name = 's2';
                break;
            case 3:
                name = 'd1';
                break;
            case 4:
                name = 'd2';
                break;
            case 6:
                name = 'i1';
                break;
            case 7:
                name = 'i2';
                break;
        }
        if (name) {
            $(this).before(` <span style="color:#777" id="pd_new_${name}"></span>`);
        }
    });

    $points.find('[type="text"]').attr('type', 'number').attr('min', 1).attr('max', 999).prop('required', true).css('width', '60px');
    $points.find('input[readonly]').attr('min', 0).prop('disabled', true).removeProp('required', true);
    $points.prepend('<span class="pd_highlight">剩余属性点：<span id="pd_surplus_point"></span></span><br>');

    $points.on('change', '[type="number"]', function () {
        let $this = $(this);
        $('#pd_surplus_point').text(propertyList['可分配属性点'] - getCurrentAssignedPoint());
        showNewLootProperty($this, propertyList, itemUsedNumList);
        showSumOfPoint($this);

        let skillAttack = 0;
        let matches = /\d+/.exec($area.find('[name="s1"]').next('span').next('.pd_point_sum').text());
        if (matches) skillAttack = parseInt(matches[0]) * 5;
        skillAttack += parseInt($area.find('[name="s2"]').val()) * 4;
        $('#pd_skill_attack').text(skillAttack);
    }).on('click', '.pd_point_sum', function () {
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint();
        if (!surplusPoint) return;
        let $point = $(this).prev('span').prev('[type="number"]');
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        $point.val(num + surplusPoint).trigger('change');
    }).find('form').submit(function () {
        let surplusPoint = propertyList['可分配属性点'] - getCurrentAssignedPoint();
        if (surplusPoint < 0) {
            alert('剩余属性点为负，请重新填写');
            return false;
        }
        else if (surplusPoint > 0) {
            return confirm('你的可分配属性点尚未用完，是否提交？');
        }
    }).find('[type="number"]').trigger('change');

    enhanceLootLog();
};

/**
 * 获取当前已分配的属性点
 * @returns {number} 当前已分配的属性点
 */
const getCurrentAssignedPoint = function () {
    let usedPoint = 0;
    $('.kf_fw_ig1').find('[type="number"]').each(function () {
        let point = parseInt($(this).val());
        if (point && point > 0) usedPoint += point;
    });
    return usedPoint;
};

/**
 * 显示各项属性点的和值
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
 * 获取当前的争夺属性
 * @returns {{}} 争夺属性
 */
const getCurrentLootPropertyList = function () {
    let propertyList = {
        '攻击力': 0,
        '最大生命值': 0,
        '攻击速度': 0,
        '暴击几率': 0,
        '技能释放概率': 0,
        '防御': 0,
        '可分配属性点': 0,
    };
    let html = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:first-child').html();
    let matches = /攻击力：(\d+)/.exec(html);
    if (matches) propertyList['攻击力'] = parseInt(matches[1]);
    matches = /生命值：\d+\s*\(最大(\d+)\)/.exec(html);
    if (matches) propertyList['最大生命值'] = parseInt(matches[1]);
    matches = /攻击速度：(\d+)/.exec(html);
    if (matches) propertyList['攻击速度'] = parseInt(matches[1]);
    matches = /暴击几率：(\d+)%/.exec(html);
    if (matches) propertyList['暴击几率'] = parseInt(matches[1]);
    matches = /技能释放概率：(\d+)%/.exec(html);
    if (matches) propertyList['技能释放概率'] = parseInt(matches[1]);
    matches = /防御：(\d+)%/.exec(html);
    if (matches) propertyList['防御'] = parseInt(matches[1]);
    matches = /可分配属性点：(\d+)/.exec(html);
    if (matches) propertyList['可分配属性点'] = parseInt(matches[1]);
    return propertyList;
};

/**
 * 显示新的争夺属性
 * @param {jQuery} $point 属性字段
 * @param {{}} currentLootProperty 当前的争夺属性
 * @param {{}} itemUsedNumList 道具使用情况对象
 */
const showNewLootProperty = function ($point, currentLootProperty, itemUsedNumList) {
    let name = $point.attr('name');
    let num = parseInt($point.val());
    if (isNaN(num) || num < 0) num = 0;
    let oriNum = parseInt($point.get(0).defaultValue);
    let extraNum = parseInt($point.next('span').text());
    let newValue = 0, diffValue = 0, unit = '';
    switch (name) {
        case 's1':
            newValue = (num + extraNum) * 5;
            diffValue = newValue - currentLootProperty['攻击力'];
            break;
        case 's2':
            newValue = (num + extraNum) * 20 + (itemUsedNumList['蕾米莉亚同人漫画'] === 50 ? 700 : 0);
            diffValue = newValue - currentLootProperty['最大生命值'];
            break;
        case 'd1':
            newValue = (num + extraNum) * 2 + (itemUsedNumList['十六夜同人漫画'] === 50 ? 100 : 0);
            diffValue = newValue - currentLootProperty['攻击速度'];
            break;
        case 'd2':
            newValue = num + extraNum;
            newValue = Math.round(newValue / (newValue + 100) * 100);
            diffValue = newValue - currentLootProperty['暴击几率'];
            unit = '%';
            break;
        case 'i1':
            newValue = num + extraNum;
            newValue = Math.round(newValue / (newValue + 120) * 100);
            diffValue = newValue - currentLootProperty['技能释放概率'];
            unit = '%';
            break;
        case 'i2':
            newValue = num + extraNum;
            newValue = Math.round(newValue / (newValue + 150) * 100);
            diffValue = newValue - currentLootProperty['防御'];
            unit = '%';
            break;
    }
    if (num !== oriNum) {
        $('#pd_new_' + name).html(
            ` (<span style="color:#00F">${newValue}${unit}</span>|<span style="color:${diffValue >= 0 ? '#ff0033' : '#339933'}">` +
            `${(diffValue >= 0 ? '+' : '') + diffValue}</span>)`
        );
    }
    else {
        $('#pd_new_' + name).html('');
    }
};

/**
 * 增强争夺记录
 */
const enhanceLootLog = function () {
    let $log = $('.kf_fw_ig1 > tbody > tr:nth-child(5) > td');
    let matches = $log.html().match(/获得\d+经验和\d+KFB/g);
    let exp = 0, kfb = 0;
    for (let match of matches) {
        let logMatches = /获得(\d+)经验和(\d+)KFB/.exec(match);
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

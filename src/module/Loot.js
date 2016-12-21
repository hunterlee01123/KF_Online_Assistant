/* 争夺模块 */
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
import * as Item from './Item';

// 争夺首页区域
let $lootArea;
// 争夺属性区域
let $properties;
// 点数区域
let $points;
// 争夺记录区域容器
let $logBox;
// 争夺记录区域
let $log;
// 争夺记录
let log;
// 各层争夺记录列表
let logList;
// 当前争夺属性
let propertyList;
// 道具加成点数列表
let extraPointList;
// 道具使用情况列表
let itemUsedNumList;
// 点数分配日志列表
let pointsLogList = [];

/**
 * 增强争夺首页
 */
export const enhanceLootIndexPage = function () {
    $lootArea = $('.kf_fw_ig1:first');
    $properties = $lootArea.find('> tbody > tr:nth-child(2) > td:first-child');
    $points = $lootArea.find('> tbody > tr:nth-child(2) > td:nth-child(2)');
    propertyList = getLootPropertyList();
    extraPointList = getExtraPointList();
    itemUsedNumList = Item.getItemUsedInfo($lootArea.find('> tbody > tr:nth-child(3) > td').html());
    $logBox = $('#pk_text_div');
    $log = $('#pk_text');

    handlePropertiesArea();
    handlePointsArea();
    addLevelPointListSelect();
    addAttackBtns();

    log = $log.html();
    logList = getLogList(log);
    if (log.includes('本日无争夺记录'))
        $log.html(log.replace(/点击这里/g, '点击上方的攻击按钮').replace('战斗记录框内任意地方点击自动战斗下一层', '请点击上方的攻击按钮开始争夺战斗'));
    else showEnhanceLog(logList);
    showLogStat(logList);
};

/**
 * 处理争夺属性区域
 */
const handlePropertiesArea = function () {
    let tipsIntro = '灵活和智力的抵消机制：\n战斗开始前，会重新计算战斗双方的灵活和智力；灵活=(自己的灵活值-(双方灵活值之和 x 33%))；智力=(自己的智力值-(双方智力值之和 x 33%))';
    let html = $properties.html()
        .replace(/(攻击力：)(\d+)/, '$1<span id="pdPro_s1" title="原值：$2">$2</span> <span id="pdNew_s1"></span>')
        .replace(/(生命值：\d+)\s*\(最大(\d+)\)/, '$1 (最大<span id="pdPro_s2" title="原值：$2">$2</span>) <span id="pdNew_s2"></span>')
        .replace(/(攻击速度：)(\d+)/, '$1<span id="pdPro_d1" title="原值：$2">$2</span> <span id="pdNew_d1"></span>')
        .replace(
            /(暴击几率：)(\d+)%\s*\(抵消机制见说明\)/,
            `$1<span id="pdPro_d2" title="原值：$2">$2</span>% <span class="pd_cfg_tips" title="${tipsIntro}">[?]</span> <span id="pdNew_d2"></span>`
        )
        .replace(
            /(技能释放概率：)(\d+)%\s*\(抵消机制见说明\)/,
            `$1<span id="pdPro_i1" title="原值：$2">$2</span>% <span class="pd_cfg_tips" title="${tipsIntro}">[?]</span> <span id="pdNew_i1"></span>`
        )
        .replace(/(防御：)(\d+)%减伤/, '$1<span id="pdPro_i2" title="原值：$2">$2</span>%减伤 <span id="pdNew_i2"></span>')
        .replace('技能伤害：攻击+(体质*5)+(智力*5)', '技能伤害：<span class="pd_custom_tips" id="pdSkillAttack" title="技能伤害：攻击+(体质*5)+(智力*5)"></span>');
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
        .prop('required', true).css('width', '60px').addClass('pd_point');
    $points.find('input[readonly]').attr('type', 'number').prop('disabled', true).css('width', '60px');

    /**
     * 显示各项点数的和值
     * @param {jQuery} $point 点数字段对象
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

    $points.on('change', '.pd_point', function () {
        let $this = $(this);
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
        $('#pdSurplusPoint').text(surplusPoint)
            .css('color', surplusPoint !== 0 ? '#f00' : '#000')
            .css('font-weight', surplusPoint !== 0 ? 'bold' : 'normal');
        showNewLootProperty($this);
        showSumOfPoint($this);
        $('#pdSkillAttack').text(
            getSkillAttack(
                parseInt($lootArea.find('[name="s1"]').val()),
                parseInt($lootArea.find('[name="s2"]').val()),
                parseInt($lootArea.find('[name="i1"]').val())
            )
        );
    }).on('click', '.pd_point_sum', function () {
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
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
    let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
    if (surplusPoint < 0) {
        alert('剩余属性点为负，请重新填写');
        return false;
    }
    else if (surplusPoint > 0) {
        return confirm('你的可分配属性点尚未用完，是否提交？');
    }
    return true;
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
        ['技能伤害', 0],
        ['技能释放概率', 0],
        ['防御', 0],
        ['可分配属性点', 0],
    ]);
    let content = $properties.text();
    let matches = /攻击力：(\d+)/.exec(content);
    if (matches) propertyList.set('攻击力', parseInt(matches[1]));
    matches = /生命值：\d+\s*\(最大(\d+)\)/.exec(content);
    if (matches) propertyList.set('最大生命值', parseInt(matches[1]));
    matches = /攻击速度：(\d+)/.exec(content);
    if (matches) propertyList.set('攻击速度', parseInt(matches[1]));
    matches = /暴击几率：(\d+)%/.exec(content);
    if (matches) propertyList.set('暴击几率', parseInt(matches[1]));
    matches = /技能伤害：(\d+)/.exec(content);
    if (matches) propertyList.set('技能伤害', parseInt(matches[1]));
    matches = /技能释放概率：(\d+)%/.exec(content);
    if (matches) propertyList.set('技能释放概率', parseInt(matches[1]));
    matches = /防御：(\d+)%/.exec(content);
    if (matches) propertyList.set('防御', parseInt(matches[1]));
    matches = /可分配属性点：(\d+)/.exec(content);
    if (matches) propertyList.set('可分配属性点', parseInt(matches[1]));
    return propertyList;
};

/**
 * 获取当前已分配的点数
 * @param {jQuery} $points 点数字段对象
 * @returns {number} 当前已分配的点数
 */
const getCurrentAssignedPoint = function ($points) {
    let usedPoint = 0;
    $points.each(function () {
        let point = parseInt($(this).val());
        if (point && point > 0) usedPoint += point;
    });
    return usedPoint;
};

/**
 * 获取技能伤害的值
 * @param {number} s1 力量
 * @param {number} s2 体质
 * @param {number} i1 智力
 * @returns {number} 技能伤害的值
 */
const getSkillAttack = (s1, s2, i1) => (s1 + extraPointList.get('力量')) * 5 + s2 * 5 + i1 * 5;

/**
 * 获取附加点数列表
 * @returns {Map} 附加点数列表
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
 * 根据字段名称获取点数名称
 * @param {string} fieldName 字段名称
 * @returns {string} 点数名称
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
 * 根据点数名称获取字段名称
 * @param {string} pointName 点数名称
 * @returns {string} 字段名称
 */
const getFieldNameByPointName = function (pointName) {
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
            diffValue = newValue - propertyList.get('攻击力');
            break;
        case '体质':
            diffValue = newValue - propertyList.get('最大生命值');
            break;
        case '敏捷':
            diffValue = newValue - propertyList.get('攻击速度');
            break;
        case '灵活':
            diffValue = newValue - propertyList.get('暴击几率');
            break;
        case '智力':
            diffValue = newValue - propertyList.get('技能释放概率');
            break;
        case '意志':
            diffValue = newValue - propertyList.get('防御');
            break;
    }
    $('#pdPro_' + name).text(newValue).css('color', point !== oriPoint ? '#00f' : '#000');

    if (point !== oriPoint)
        $('#pdNew_' + name).text(`(${(diffValue >= 0 ? '+' : '') + diffValue})`).css('color', diffValue >= 0 ? '#ff0033' : '#339933');
    else
        $('#pdNew_' + name).text('');
};

/**
 * 根据指定的点数获得相应争夺属性的值
 * @param pointName 点数名称
 * @param point 点数的值
 * @returns {number} 争夺属性的值
 */
const getPropertyByPoint = function (pointName, point) {
    let extraPoint = extraPointList.get(pointName);
    if (!extraPoint) extraPoint = 0;
    let value = 0;
    switch (pointName) {
        case '力量':
            value = (point + extraPoint) * 5;
            break;
        case '体质':
            value = (point + extraPoint) * 20 + (itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0);
            break;
        case '敏捷':
            value = (point + extraPoint) * 2 + (itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0);
            break;
        case '灵活':
            value = point + extraPoint;
            value = Math.round(value / (value + 100) * 100);
            break;
        case '智力':
            value = point + extraPoint;
            value = Math.round(value / (value + 90) * 100);
            break;
        case '意志':
            value = point + extraPoint;
            value = Math.round(value / (value + 150) * 100);
            break;
    }
    return value;
};

/**
 * 根据指定的争夺属性获得相应点数的值
 * @param pointName 点数名称
 * @param num 争夺属性的值
 * @returns {number} 点数的值
 */
const getPointByProperty = function (pointName, num) {
    let value = 0;
    switch (pointName) {
        case '力量':
            value = Math.ceil(num / 5) - extraPointList.get('力量');
            break;
        case '体质':
            value = Math.ceil((itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? num - 700 : num) / 20) - extraPointList.get('体质');
            break;
        case '敏捷':
            value = Math.ceil((itemUsedNumList.get('十六夜同人漫画') === 50 ? num - 100 : num) / 2) - extraPointList.get('敏捷');
            break;
        case '灵活':
            value = Math.ceil(100 * num / (100 - num)) - extraPointList.get('灵活');
            break;
        case '智力':
            value = Math.ceil(90 * num / (100 - num)) - extraPointList.get('智力');
            break;
        case '意志':
            value = Math.ceil(150 * num / (100 - num)) - extraPointList.get('意志');
            break;
    }
    if (!isFinite(value) || value <= 0) value = 1;
    return value;
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
<a class="pd_btn_link" data-name="edit" href="#" title="编辑各层点数分配方案">编辑</a><br>
`).prependTo($points).filter('#pdLevelPointListSelect').change(function () {
        let level = parseInt($(this).val());
        if (level > 0) {
            let points = Config.levelPointList[parseInt(level)];
            if (typeof points !== 'object') return;
            $points.find('.pd_point').each(function () {
                let $this = $(this);
                $this.val(points[getPointNameByFieldName($this.attr('name'))]);
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
            points[getPointNameByFieldName($elem.attr('name'))] = point;
        }
        Config.levelPointList[level] = points;
        writeConfig();
        setLevelPointListSelect(Config.levelPointList);
        $levelPointListSelect.val(level);
    }).end().filter('[data-name="edit"]').click(function (e) {
        e.preventDefault();
        showLevelPointListConfigDialog();
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
        pointListHtml += `<option value="${level}">第${level}层</option>`;
    }
    $('#pdLevelPointListSelect').find('option:gt(2)').remove().end().append(pointListHtml);
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
    <input name="s1" type="text" maxlength="4" title="力量" placeholder="力量" style="width: 35px;">
    <input name="s2" type="text" maxlength="4" title="体质" placeholder="体质" style="width: 35px;">
    <input name="d1" type="text" maxlength="4" title="敏捷" placeholder="敏捷" style="width: 35px;">
    <input name="d2" type="text" maxlength="4" title="灵活" placeholder="灵活" style="width: 35px;">
    <input name="i1" type="text" maxlength="4" title="智力" placeholder="智力" style="width: 35px;">
    <input name="i2" type="text" maxlength="4" title="意志" placeholder="意志" style="width: 35px;">
    <a class="pd_btn_link" data-name="clear" href="#" title="清空各修改字段">清空</a>
    <button type="button" name="modify">修改</button>
    <span class="pd_cfg_tips" title="可将所选择的层数的相应属性修改为指定的数值；数字前可设+/-号，表示增加/减少相应数量；例：100、+5或-2">[?]</span>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExLevelPointListConfigDialog" href="#">导入/导出分配方案</a></span>
  <button type="submit">确定</button>
  <button type="button" name="cancel">取消</button>
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
  <td><input class="pd_point" name="s1" type="number" min="1" max="9999" value="${points['力量']}" style="width: 50px;" required></td>
  <td><input class="pd_point" name="s2" type="number" min="1" max="9999" value="${points['体质']}" style="width: 50px;" required></td>
  <td><input class="pd_point" name="d1" type="number" min="1" max="9999" value="${points['敏捷']}" style="width: 50px;" required></td>
  <td><input class="pd_point" name="d2" type="number" min="1" max="9999" value="${points['灵活']}" style="width: 50px;" required></td>
  <td><input class="pd_point" name="i1" type="number" min="1" max="9999" value="${points['智力']}" style="width: 50px;" required></td>
  <td><input class="pd_point" name="i2" type="number" min="1" max="9999" value="${points['意志']}" style="width: 50px;" required></td>
  <td style="text-align: left;"><a class="pd_btn_link" data-name="delete" href="#">删除</a></td>
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
  <td class="pd_custom_tips" title="技能伤害：攻击+(体质*5)+(智力*5)">技伤：<span data-id="skillAttack">0</span></td>
</tr>
`).appendTo($levelPointList).find('.pd_point').trigger('change');
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        readConfig();
        Config.levelPointList = {};
        let prevPoints = {};
        let isError = false, isSurplus = false;
        $levelPointList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            if (!$this.find('.pd_point').length) return;
            let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($this.find('.pd_point'));
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
            Config.levelPointList[level] = points;
            prevPoints = points;
        });
        if (isSurplus) {
            if (!confirm('部分层数的可分配属性点尚未用完，是否提交？')) return;
        }
        if (isError) {
            alert('部分层数的剩余属性点为负，请重新填写');
            return;
        }
        writeConfig();
        Dialog.close(dialogName);
        setLevelPointListSelect(Config.levelPointList);
    }).find('[data-name="selectAll"]').click(() => Util.selectAll($levelPointList.find('[type="checkbox"]')))
        .end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($levelPointList.find('[type="checkbox"]')))
        .end().find('[data-name="add"]')
        .click(function (e) {
            e.preventDefault();
            addLevelPointHtml(0, {'力量': 1, '体质': 1, '敏捷': 1, '灵活': 1, '智力': 1, '意志': 1});
            Dialog.show(dialogName);
        }).end().find('[data-name="deleteSelect"]')
        .click(function (e) {
            e.preventDefault();
            let $checked = $levelPointList.find('[type="checkbox"]:checked');
            if (!$checked.length || !confirm('是否删除所选层数？')) return;
            let $line = $checked.closest('tr');
            $line.next('tr').addBack().remove();
            Dialog.show(dialogName);
        }).end().find('[data-name="openImOrExLevelPointListConfigDialog"]')
        .click(function (e) {
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
        }).end().find('[data-name="openCustomScriptDialog"]').click(() => Script.showDialog())
        .end().find('[name="cancel"]').click(() => Dialog.close(dialogName));

    $levelPointList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        let $line = $(this).closest('tr');
        $line.next('tr').addBack().remove();
        Dialog.show(dialogName);
    }).on('change', '.pd_point', function () {
        let $this = $(this);
        let name = $this.attr('name');
        let point = parseInt($this.val());
        if (!point || point < 0) return;

        let $points = $this.closest('tr');
        let $properties = $points.next('tr');
        $properties.find(`[data-id="pro_${name}"]`)
            .text(getPropertyByPoint(getPointNameByFieldName(name), point))
            .end().find('[data-id="skillAttack"]')
            .text(
                getSkillAttack(
                    parseInt($points.find('[name="s1"]').val()),
                    parseInt($points.find('[name="s2"]').val()),
                    parseInt($points.find('[name="i1"]').val())
                )
            );

        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
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
        let surplusPoint = propertyList.get('可分配属性点') - getCurrentAssignedPoint($points.find('.pd_point'));
        if (!surplusPoint) return;
        let $point = $points.find(`[name="${name}"]`);
        if (!$point.length) return;
        let num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        num = num + surplusPoint;
        $point.val(num < 1 ? 1 : num).trigger('change');
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
        addLevelPointHtml(level, points);
    }

    Dialog.show(dialogName);
    $dialog.find('input:first').focus();
    if (typeof callback === 'function') callback($dialog);
};

/**
 * 添加攻击相关按钮
 */
const addAttackBtns = function () {
    $logBox.off('click');
    $(`
<div id="pdAttackBtns">
  <label>
    <input class="pd_input" name="autoChangeLevelPointsEnabled" type="checkbox"> 自动修改点数分配方案
    <span class="pd_cfg_tips" title="在攻击时可自动修改为相应层数的点数分配方案（仅限自动攻击有效）">[?]</span>
  </label>
  ${typeof Const.getCustomPoints === 'function' ? `<label>
    <input class="pd_input" name="customPointsScriptEnabled" type="checkbox"> 使用自定义脚本
    <span class="pd_cfg_tips" title="使用自定义点数分配脚本（仅限自动攻击有效）">[?]</span>
  </label>` : ''}
  <label>
    <input class="pd_input" name="slowAttackEnabled" type="checkbox"> 慢速
    <span class="pd_cfg_tips" title="延长每次攻击的时间间隔（在3~5秒之间）">[?]</span>
  </label><br>
  <button name="autoAttack" type="button" title="连续攻击到指定层数">自动攻击</button>
  <button name="manualAttack" type="button" title="每次只攻击一层，会自动提交当前页面上的点数设置">手动攻击</button>
</div>
`).appendTo($points).on('click', '[name="autoAttack"], [name="manualAttack"]', function () {
        let safeId = Public.getSafeId();
        if (!safeId) return;
        if (/你被击败了/.test(log)) {
            alert('你已经被击败了');
            return;
        }
        let $this = $(this);
        let type = $this.is('[name="autoAttack"]') ? 'auto' : 'manual';
        let targetLevel = 0;
        if (type === 'auto') {
            let prevTargetLevel = $this.data('prevTargetLevel');
            let value = $.trim(prompt('攻击到第几层？（0表示攻击到被击败为止，+n表示攻击到当前层数+n层）', prevTargetLevel ? prevTargetLevel : 0));
            if (!/\+?\d+/.test(value)) return;
            if (value.startsWith('+')) {
                let currentLevel = getCurrentLevel(logList);
                targetLevel = currentLevel + parseInt(value);
            }
            else targetLevel = parseInt(value);
            if (isNaN(targetLevel) || targetLevel < 0) return;
            $this.data('prevTargetLevel', value);
        }
        $this.blur();
        Msg.destroy();
        let autoChangeLevelPointsEnabled = (Config.autoChangeLevelPointsEnabled ||
            Config.customPointsScriptEnabled && typeof Const.getCustomPoints === 'function') && type === 'auto';
        if (!autoChangeLevelPointsEnabled && !checkPoints($points)) return;
        lootAttack({type, targetLevel, autoChangeLevelPointsEnabled, safeId});
    }).on('click', '.pd_cfg_tips', () => false)
        .find('[name="autoChangeLevelPointsEnabled"]')
        .click(function () {
            readConfig();
            Config.autoChangeLevelPointsEnabled = $(this).prop('checked');
            writeConfig();
        }).prop('checked', Config.autoChangeLevelPointsEnabled)
        .end().find('[name="slowAttackEnabled"]')
        .click(function () {
            readConfig();
            Config.slowAttackEnabled = $(this).prop('checked');
            writeConfig();
        }).prop('checked', Config.slowAttackEnabled)
        .end().find('[name="customPointsScriptEnabled"]')
        .click(function () {
            let checked = $(this).prop('checked');
            $('[name="autoChangeLevelPointsEnabled"]').prop('disabled', checked);
            if (Config.customPointsScriptEnabled !== checked) {
                readConfig();
                Config.customPointsScriptEnabled = checked;
                writeConfig();
            }
        }).prop('checked', Config.customPointsScriptEnabled).triggerHandler('click');
};

/**
 * 争夺攻击
 * @param {string} type 攻击类型，auto：自动攻击；manual：手动攻击
 * @param {number} targetLevel 目标层数（设为0表示攻击到被击败为止，仅限自动攻击有效）
 * @param {boolean} autoChangeLevelPointsEnabled 是否自动修改为相应层数的点数分配方案
 * @param {string} safeId SafeID
 */
const lootAttack = function ({type, targetLevel, autoChangeLevelPointsEnabled, safeId}) {
    let currentLevel = getCurrentLevel(logList);
    if (targetLevel > 0 && targetLevel <= currentLevel) return;
    let $wait = Msg.wait(
        `<strong>正在攻击中，请稍等&hellip;</strong><i>当前层数：<em class="pd_countdown">${currentLevel}</em></i>` +
        '<a class="pd_stop_action pd_highlight" href="#">停止操作</a><a href="/" target="_blank">浏览其它页面</a>'
    );
    let retryNum = 0;

    /**
     * 修改点数分配方案
     * @param {number} nextLevel 下一层（设为-1表示采用当前点数分配方案）
     * @returns {Deferred} Deferred对象
     */
    const changePoints = function (nextLevel) {
        if (nextLevel > 0 && Config.customPointsScriptEnabled && typeof Const.getCustomPoints === 'function') {
            let currentLevel = getCurrentLevel(logList);
            let currentLife = 0, currentInitLife = 0;
            let initLifeMatches = /你\((\d+)\)遭遇了/.exec(logList[currentLevel]);
            if (initLifeMatches) currentInitLife = parseInt(initLifeMatches[1]);
            let lifeMatches = /生命值(?:\[回复最大值的\d+%]至\[(\d+)]|回复至\[(满值)])/.exec(logList[currentLevel]);
            if (lifeMatches) currentLife = lifeMatches[2] === '满值' ? currentInitLife : parseInt(lifeMatches[1]);
            let enemyList = getEnemyList(logList);
            let points = null;
            try {
                points = Const.getCustomPoints({
                    currentLevel,
                    currentLife,
                    currentInitLife,
                    levelPointList: Config.levelPointList,
                    availablePoint: propertyList.get('可分配属性点'),
                    propertyList,
                    extraPointList,
                    itemUsedNumList,
                    log,
                    logList,
                    enemyList,
                    getPointByProperty,
                    getPropertyByPoint,
                });
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
            else if (points === false) return $.Deferred().resolve('success');
            else return $.Deferred().resolve('error');
        }

        let changeLevel = nextLevel > 0 ? Math.max(...Object.keys(Config.levelPointList).filter(level => level <= nextLevel)) : -1;
        let isChange = false;
        $points.find('.pd_point').each(function () {
            if (this.defaultValue !== $(this).val()) {
                isChange = true;
                return false;
            }
        });
        let $levelPointListSelect = $('#pdLevelPointListSelect');
        if (isChange || (changeLevel > 0 && changeLevel !== parseInt($levelPointListSelect.val()))) {
            if (changeLevel > 0) $levelPointListSelect.val(changeLevel).trigger('change');
            else $levelPointListSelect.get(0).selectedIndex = 0;
            return $.ajax({
                type: 'POST',
                url: 'kf_fw_ig_enter.php',
                timeout: Const.defAjaxTimeout,
                data: $points.find('form').serialize(),
            }).then(function (html) {
                let {msg} = Util.getResponseMsg(html);
                if (/已经重新配置加点！/.test(msg)) {
                    propertyList = getLootPropertyList();
                    let pointsText = '', propertiesText = '';
                    $points.find('.pd_point').each(function () {
                        let $this = $(this);
                        let name = $this.attr('name');
                        let value = $.trim($this.val());
                        pointsText += `${getPointNameByFieldName(name)}：${value}，`;
                    });
                    pointsText = pointsText.replace(/，$/, '');
                    for (let [key, value] of propertyList) {
                        if (key === '可分配属性点') continue;
                        let unit = '';
                        if (key.endsWith('率') || key === '防御') unit = '%';
                        propertiesText += `${key}：${value}${unit}，`;
                    }
                    propertiesText = propertiesText.replace(/，$/, '');
                    pointsLogList[getCurrentLevel(logList) + 1] = `点数方案（${pointsText}）\n争夺属性（${propertiesText}）`;
                    console.log(
                        `【分配点数】${changeLevel > 0 ? `已修改为第${changeLevel}层的方案` : '已修改点数设置'}；` +
                        `点数方案（${pointsText}）；争夺属性（${propertiesText}）`
                    );

                    $points.find('.pd_point').each(function () {
                        this.defaultValue = $(this).val();
                    }).trigger('change');
                    return 'success';
                }
                else {
                    alert((changeLevel ? `第${changeLevel}层方案：` : '') + msg);
                    return 'error';
                }
            }, (XMLHttpRequest, textStatus) => textStatus);
        }
        else return $.Deferred().resolve('success');
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
            if (!/你\(\d+\)遭遇了/.test(html)) {
                if (!$.trim(html)) {
                    retryNum++;
                    if (retryNum < 5) {
                        setTimeout(attack, Const.defAjaxInterval);
                        return;
                    }
                }
                completeAttack();
                return;
            }
            retryNum = 0;

            log = html + log;
            logList = getLogList(log);
            showEnhanceLog(logList);
            showLogStat(logList);
            let currentLevel = getCurrentLevel(logList);
            console.log('【争夺攻击】当前层数：' + currentLevel);
            let $countdown = $('.pd_countdown:last');
            $countdown.text(currentLevel);

            let isFail = /你被击败了/.test(html);
            let isStop = isFail || type !== 'auto' || (targetLevel && currentLevel >= targetLevel) ||
                $countdown.closest('.pd_msg').data('stop');
            if (isStop) {
                if (isFail) {
                    completeAttack();
                }
                else {
                    Msg.remove($wait);
                    Msg.show(`<strong>你成功击败了第<em>${currentLevel}</em>层的NPC</strong>`, -1);
                }
            }
            else {
                if (autoChangeLevelPointsEnabled) {
                    setTimeout(() => readyAttack(currentLevel), Const.defAjaxInterval);
                }
                else {
                    setTimeout(attack, typeof Const.lootAttackInterval === 'function' ? Const.lootAttackInterval() : Const.lootAttackInterval);
                }
            }
        }).fail(function (XMLHttpRequest, textStatus) {
            if ($('.pd_countdown:last').closest('.pd_msg').data('stop')) {
                Msg.remove($wait);
                return;
            }
            if (textStatus === 'timeout') {
                console.log('【争夺攻击】超时重试...');
                $('#pdAttackProcess').append('<li>【争夺攻击】超时重试&hellip;</li>');
                setTimeout(attack, typeof Const.lootAttackInterval === 'function' ? Const.lootAttackInterval() : Const.lootAttackInterval);
            }
        });
    };

    /**
     * 准备攻击（用于自动修改各层点数分配方案）
     * @param {number} currentLevel 当前层数（设为-1表示采用当前点数分配方案）
     * @param {number} interval 下次攻击的间隔时间
     */
    const readyAttack = function (currentLevel, interval = Const.lootAttackInterval) {
        changePoints(currentLevel >= 0 ? currentLevel + 1 : -1).done(function (result) {
            if (result === 'success') setTimeout(attack, typeof interval === 'function' ? interval() : interval);
        }).fail(function (result) {
            if (result === 'timeout') setTimeout(() => readyAttack(currentLevel, interval), Const.defAjaxInterval);
        }).always(function (result) {
            if (result !== 'success' && result !== 'timeout') {
                Msg.remove($wait);
            }
        });
    };

    /**
     * 完成攻击
     */
    const completeAttack = function () {
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_index.php?t=' + new Date().getTime(),
            timeout: Const.defAjaxTimeout,
            success (html) {
                Msg.remove($wait);
                let logHtml = $('#pk_text', html).html();
                if (!/你被击败了/.test(logHtml)) return;
                log = logHtml;
                logList = getLogList(log);
                showEnhanceLog(logList);

                let allEnemyList = {};
                for (let [enemy, num] of Util.entries(getEnemyStatList(logList))) {
                    allEnemyList[enemy.replace('特别', '')] = num;
                }
                let allEnemyStat = '';
                for (let [enemy, num] of Util.entries(allEnemyList)) {
                    allEnemyStat += enemy + '`+' + num + '` ';
                }

                let latestEnemyList = {};
                for (let [enemy, num] of Util.entries(getEnemyStatList(logList.filter((elem, level) => level >= logList.length - 10)))) {
                    latestEnemyList[enemy.replace('特别', '')] = num;
                }
                let latestEnemyStat = '';
                for (let [enemy, num] of Util.entries(latestEnemyList)) {
                    latestEnemyStat += enemy + '`+' + num + '` ';
                }

                let currentLevel = getCurrentLevel(logList);
                let {exp, kfb} = getTotalGain(logList);
                if (exp > 0 && kfb > 0) {
                    Log.push(
                        '争夺攻击',
                        `你成功击败了第\`${currentLevel - 1}\`层的NPC (全部：${allEnemyStat.trim()}；最近10层：${latestEnemyStat.trim()})`,
                        {gain: {'KFB': kfb, '经验值': exp}}
                    );
                }
                Msg.show(`<strong>你被第<em>${currentLevel}</em>层的NPC击败了</strong>`, -1);

                if (Config.autoGetDailyBonusEnabled && Config.getBonusAfterLootCompleteEnabled) {
                    Util.deleteCookie(Const.getDailyBonusCookieName);
                    Public.getDailyBonus();
                }
                Script.runFunc('Loot.lootAttack_complete_');
            },
            error (XMLHttpRequest, textStatus) {
                if (textStatus === 'timeout') {
                    setTimeout(completeAttack, Const.defAjaxInterval);
                }
            }
        })
    };

    readyAttack(autoChangeLevelPointsEnabled ? currentLevel : -1, 0);
};

/**
 * 显示争夺记录统计
 * @param {string[]} logList 各层争夺记录列表
 */
const showLogStat = function (logList) {
    let {exp, kfb} = getTotalGain(logList);
    if (!exp || !kfb) return;

    let allEnemyStatHtml = '';
    for (let [enemy, num] of Util.entries(getEnemyStatList(logList))) {
        allEnemyStatHtml += `<i>${enemy}<em>+${num}</em></i> `;
    }
    let latestEnemyStatHtml = '';
    for (let [enemy, num] of Util.entries(getEnemyStatList(logList.filter((elem, level) => level >= logList.length - 10)))) {
        latestEnemyStatHtml += `<i>${enemy}<em>+${num}</em></i> `;
    }

    let $logStat = $('#pdLogStat');
    if (!$logStat.length) {
        $logStat = $('<ul id="pdLogStat" style="padding: 5px; line-height: 2em;"></ul>').insertBefore($logBox);
    }
    $logStat.html(`
<li class="pd_stat"><b>收获统计：</b><i>KFB<em>+${kfb.toLocaleString()}</em></i> <i>经验值<em>+${exp.toLocaleString()}</em></i></li>
<li class="pd_stat">
  <b>全部层数：</b>${allEnemyStatHtml}<br>
  <b>最近10层：</b>${latestEnemyStatHtml}
</li>
`);
};

/**
 * 显示经过增强的争夺记录
 * @param {string[]} logList 各层争夺记录列表
 */
const showEnhanceLog = function (logList) {
    let list = [];
    $.each(logList, function (level, levelLog) {
        if (!levelLog) return;
        list[level] = levelLog.replace(/\[([^\]]+)的]NPC/g, function (match, enemy) {
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
            return `<span style="background-color: ${color};">[${enemy}的]</span>NPC`;
        });

        if (pointsLogList[level]) {
            list[level] = list[level].replace(
                '</li>', `</li><li class="pk_log_g" style="color: #666;">${pointsLogList[level]}</li>`.replace(/\n/g, '<br>')
            );
        }
    });
    $log.html(list.reverse().join(''));
};

/**
 * 获取各层争夺记录列表
 * @param log 争夺记录
 * @returns {string[]} 各层争夺记录列表
 */
const getLogList = function (log) {
    let logList = [];
    let matches = log.match(/<li class="pk_log_j">.+?(?=\s*<li class="pk_log_j">|\s*$)/g);
    for (let i in matches) {
        let levelMatches = /在\[\s*(\d+)\s*层]/.exec(Util.removeHtmlTag(matches[i]));
        if (levelMatches) logList[parseInt(levelMatches[1])] = matches[i];
    }
    return logList;
};

/**
 * 获取当前的争夺总收获
 * @param {string[]} logList 各层争夺记录列表
 * @returns {{exp: number, kfb: number}} exp：经验；kfb：KFB
 */
const getTotalGain = function (logList) {
    let exp = 0, kfb = 0;
    $.each(logList, function (level, levelLog) {
        if (!levelLog) return;
        let matches = /获得\s*\[\s*(\d+)\s*]\s*经验和\s*\[\s*(\d+)\s*]\s*KFB/.exec(Util.removeHtmlTag(levelLog));
        if (matches) {
            exp += parseInt(matches[1]);
            kfb += parseInt(matches[2]);
        }
    });
    return {exp, kfb};
};

/**
 * 获取遭遇敌人统计列表
 * @param {string[]} logList 各层争夺记录列表
 * @returns {{}} 遭遇敌人列表
 */
const getEnemyStatList = function (logList) {
    let enemyStatList = {
        '普通': 0,
        '特别强壮': 0,
        '特别快速': 0,
        '特别脆弱': 0,
        '特别缓慢': 0,
        'BOSS': 0,
        '大魔王': 0,
    };
    $.each(getEnemyList(logList), function (level, enemy) {
        if (!enemy || !(enemy in enemyStatList)) return;
        enemyStatList[enemy]++;
    });
    for (let [enemy, num] of Util.entries(enemyStatList)) {
        if (!num) delete enemyStatList[enemy];
    }
    return enemyStatList;
};

/**
 * 获取各层敌人列表
 * @param {string[]} logList 各层争夺记录列表
 * @returns {[]} 各层敌人列表
 */
const getEnemyList = function (logList) {
    let enemyList = [];
    for (let level in logList) {
        let levelLog = logList[level];
        if (!levelLog) continue;
        let matches = /\[([^\]]+)的]NPC/.exec(Util.removeHtmlTag(levelLog));
        if (matches) {
            let enemy = matches[1];
            enemy = enemy.replace('(后续更新前此路不通)', '');
            enemyList[level] = enemy;
        }
    }
    return enemyList;
};

/**
 * 获取当前层数
 * @param {string[]} logList 各层争夺记录列表
 * @returns {number} 当前层数
 */
const getCurrentLevel = logList => logList.length - 1 >= 1 ? logList.length - 1 : 0;

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

// ==UserScript==
// @name        在一键打开盒子后自动获取装备最终加成
// @version     1.0
// @trigger     start
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13737242
// @description 在一键打开盒子后（且完成指定的后续操作后），自动获取页面上所有装备的最终加成信息
// ==/UserScript==
'use strict';
/**
 * 设置在一键打开盒子后（且在完成指定的后续操作后），才获取装备最终加成的操作类型
 * 0：在一键打开盒子后
 * 1：在批量熔炼装备后
 * 2：在批量使用道具后
 * 3：在批量出售道具后
 */
const type = 1;

let funcName = '';
switch (type) {
    case 1:
        funcName = 'Item.smeltArms_complete_';
        break;
    case 2:
        funcName = 'Item.useItems_complete_';
        break;
    case 3:
        funcName = 'Item.sellItems_complete_';
        break;
    default:
        funcName = 'Item.openBoxes_after_';
        break;
}

addFunc(funcName, function (data) {
    if (type > 0 && (!data || !data.nextActionEnabled)) return;

    const Item = require('./Item');
    const Public = require('./Public');
    let safeId = Public.getSafeId();
    if (!safeId) return;

    let oriEquippedArmList = [];
    let armList = [];
    let $armArea = data.$armArea ? data.$armArea : $('.kf_fw_ig4');
    $armArea.find('tr[data-id]').each(function () {
        let $this = $(this);
        let armId = parseInt($this.data('id'));
        let armClass = $this.data('class');
        if (armId && armClass) {
            armList.push({armId, armClass});
        }
        if ($this.hasClass('pd_arm_equipped')) {
            oriEquippedArmList.push({armId, armClass});
        }
    });
    if (oriEquippedArmList.length < 2 && !confirm('未在当前页面上存在已装备的该类别装备，在操作后将装备为该页面上其类别的最后一件装备，是否继续？')) return;
    if (armList.length > 0) {
        console.log('在批量打开盒子后自动显示装备最终加成Start');
        console.log(oriEquippedArmList);
        Item.showArmsFinalAddition(armList, oriEquippedArmList, safeId);
    }
});
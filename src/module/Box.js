/* 盒子模块 */
'use strict';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import * as Log from './Log';
import * as Script from './Script';
import * as Item from './Item';
import * as Public from './Public';

/**
 * 盒子种类列表
 */
export const boxTypeList = ['普通盒子', '幸运盒子', '稀有盒子', '传奇盒子', '神秘盒子'];

// 盒子区域
let $area;
// SafeID
let safeId;

/**
 * 初始化
 */
export const init = function () {
    safeId = Public.getSafeId();
    if (!safeId) return;
    $area = $('.kf_fw_ig1:first');
    addBatchOpenBoxesLink();
    addOpenAllBoxesButton();
};

/**
 * 添加批量打开盒子链接
 */
const addBatchOpenBoxesLink = function () {
    $area = $('.kf_fw_ig1:first');
    $area.find('> tbody > tr:nth-child(3) > td > a[onclick^="dkhz"]').each(function () {
        let $this = $(this);
        let matches = /dkhz\('(\d+)'\)/.exec($this.attr('onclick'));
        if (!matches) return;
        $this.after(`<a class="pd_highlight" href="#" data-name="openBoxes" data-id="${matches[1]}" style="margin-left: 10px;">批量打开</a>`);
    });

    $area.on('click', 'a[data-name="openBoxes"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let id = parseInt($this.data('id'));
        let $info = $area.find(`> tbody > tr:nth-child(2) > td:nth-child(${id})`);
        let boxType = $info.find('span:first').text().trim() + '盒子';
        if (!boxTypeList.includes(boxType)) return;
        let currentNum = parseInt($info.find('span:last').text());
        let num = parseInt(prompt(`你要打开多少个【${boxType}】？`, currentNum));
        if (!num || num < 0) return;
        openBoxes({id, boxType, num, safeId});
    });
};

/**
 * 添加打开全部盒子按钮
 */
const addOpenAllBoxesButton = function () {
    $(`
<div class="pd_item_btns">
  <button name="openAllBoxes" type="button" style="color: #f00;" title="打开全部盒子">一键开盒</button>
</div>
`).insertAfter($area).find('[name="openAllBoxes"]').click(function () {
        if (!confirm('是否打开全部盒子？')) return;
        Msg.destroy();
        $(document).clearQueue('OpenAllBoxes');
        $area.find('> tbody > tr:nth-child(2) > td').each(function (index) {
            let $this = $(this);
            $(document).queue('OpenAllBoxes', function () {
                let boxType = $this.find('span:first').text().trim() + '盒子';
                if (!boxTypeList.includes(boxType)) return;
                let num = parseInt($this.find('span:last').text());
                if (!num || num < 0) return;
                let id = parseInt($area.find(`> tbody > tr:nth-child(3) > td:nth-child(${index + 1}) > a[data-name="openBoxes"]`).data('id'));
                if (!id) return;
                openBoxes({id, boxType, num, safeId});
            });
        });
        $(document).dequeue('OpenAllBoxes');
    });

    Public.addSimulateManualActionChecked($('.pd_item_btns:first'));
};

/**
 * 打开盒子
 * @param {number} id 盒子类型ID
 * @param {string} boxType 盒子类型名称
 * @param {number} num 打开盒子数量
 * @param {string} safeId SafeID
 */
const openBoxes = function ({id, boxType, num, safeId}) {
    let successNum = 0, failNum = 0, index = 0;
    let isStop = false;
    let stat = {'KFB': 0, '经验值': 0, '道具': 0, '装备': 0, item: {}, arm: {}};
    $area.parent().append(`<ul class="pd_result" data-name="boxResult"><li><strong>【${boxType}】打开结果：</strong></li></ul>`);
    let $wait = Msg.wait(
        `<strong>正在打开盒子中&hellip;</strong><i>剩余：<em class="pd_countdown">${num}</em></i><a class="pd_stop_action" href="#">停止操作</a>`
    );

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
            if (isPause) $(document).clearQueue('OpenAllBoxes');

            if (isStop || !length) {
                Msg.remove($wait);
                for (let [key, value] of Util.entries(stat)) {
                    if (!value || ($.type(value) === 'object' && $.isEmptyObject(value))) {
                        delete stat[key];
                    }
                }
                if (!$.isEmptyObject(stat)) {
                    Log.push(
                        '打开盒子',
                        `共有\`${successNum}\`个【\`${boxType}\`】打开成功`,
                        {
                            gain: stat,
                            pay: {'盒子': -successNum}
                        }
                    );
                }

                let $currentNum = $area.find(`> tbody > tr:nth-child(2) > td:nth-child(${id}) > span:last`);
                let prevNum = parseInt($currentNum.text());
                if (prevNum > 0) {
                    $currentNum.text(prevNum - successNum);
                }

                let resultStatHtml = '';
                for (let [key, value] of Util.entries(stat)) {
                    if ($.type(value) === 'object') {
                        let typeList = key === '道具' ? Item.itemTypeList : Item.armTypeList;
                        if (resultStatHtml) resultStatHtml += '<br>';
                        for (let name of Util.getSortedObjectKeyList(typeList, value)) {
                            resultStatHtml += `<i>${name}<em>+${value[name].toLocaleString()}</em></i> `;
                        }
                    }
                    else {
                        resultStatHtml += `<i>${key}<em>+${value.toLocaleString()}</em></i> `;
                    }
                }
                $('.pd_result[data-name="boxResult"]:last').append(
                    `<li class="pd_stat"><b>统计结果：</b><br>${resultStatHtml ? resultStatHtml : '无'}</li>`
                );
                console.log(`共有${successNum}个【${boxType}】打开成功${failNum > 0 ? `，共有${failNum}个盒子打开失败` : ''}`);
                Msg.show(
                    `<strong>共有<em>${successNum}</em>个【${boxType}】打开成功${failNum > 0 ? `，共有<em>${failNum}</em>个盒子打开失败` : ''}</strong>`,
                    -1
                );

                Script.runFunc('Box.openBoxes_after_', stat);
                setTimeout(
                    () => $(document).dequeue('OpenAllBoxes'),
                    typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                );
            }
            else {
                setTimeout(
                    () => $(document).dequeue('OpenBoxes'),
                    typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval
                );
            }
        });
    };

    $(document).clearQueue('OpenBoxes');
    $.each(new Array(num), function () {
        $(document).queue('OpenBoxes', open);
    });
    $(document).dequeue('OpenBoxes');
};

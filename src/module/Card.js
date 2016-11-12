/* 卡片模块 */
'use strict';
import * as Util from './Util';
import Const from './Const';
import * as Msg from './Msg';
import * as Log from './Log';
import * as Public from './Public';

/**
 * 将指定的一系列卡片转换为VIP时间
 * @param {number[]} cardList 卡片ID列表
 * @param {string} safeId 用户的SafeID
 */
const convertCardsToVipTime = function (cardList, safeId) {
    let successNum = 0, failNum = 0, totalVipTime = 0, totalEnergy = 0;
    $(document).clearQueue('ConvertCardsToVipTime');
    $.each(cardList, function (index, cardId) {
        $(document).queue('ConvertCardsToVipTime', function () {
            $.ajax({
                type: 'GET',
                url: `kf_fw_card_doit.php?do=recard&id=${cardId}&safeid=${safeId}&t=${new Date().getTime()}`,
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('将卡片转换为VIP时间', html);
                    let {msg} = Util.getResponseMsg(html);
                    let matches = /增加(\d+)小时VIP时间(?:.*?获得(\d+)点恢复能量)?/.exec(msg);
                    if (matches) {
                        successNum++;
                        totalVipTime += parseInt(matches[1]);
                        if (typeof matches[2] !== 'undefined') totalEnergy += parseInt(matches[2]);
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
                    if (isStop) $(document).clearQueue('ConvertCardsToVipTime');

                    if (isStop || index === cardList.length - 1) {
                        if (successNum > 0) {
                            Log.push(
                                '将卡片转换为VIP时间',
                                `共有\`${successNum}\`张卡片成功为VIP时间`,
                                {
                                    gain: {'VIP小时': totalVipTime, '能量': totalEnergy},
                                    pay: {'卡片': -successNum}
                                }
                            );
                        }
                        Msg.destroy();
                        console.log(`共有${successNum}张卡片转换成功，共有${failNum}张卡片转换失败，VIP小时+${totalVipTime}，能量+${totalEnergy}`);
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>张卡片转换成功${failNum > 0 ? `，共有<em>${failNum}</em>张卡片转换失败` : ''}</strong>` +
                            `<i>VIP小时<em>+${totalVipTime}</em></i><i>能量<em>+${totalEnergy}</em></i>`
                            , -1
                        );
                        $('.kf_fw_ig2 .pd_card_chk:checked')
                            .closest('td')
                            .fadeOut('normal', function () {
                                let $parent = $(this).parent();
                                $(this).remove();
                                if (!$parent.children().length) $parent.remove();
                            });
                    }
                    else {
                        setTimeout(function () {
                            $(document).dequeue('ConvertCardsToVipTime');
                        }, Const.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('ConvertCardsToVipTime');
};

/**
 * 添加开启批量模式的按钮
 */
export const addStartBatchModeButton = function () {
    let safeId = Public.getSafeId();
    if (!safeId) return;
    if (!$('.kf_fw_ig2 a[href^="kf_fw_card_my.php?id="]').length) return;
    $('<div class="pd_item_btns"><button>开启批量模式</button></div>').insertAfter('.kf_fw_ig2')
        .find('button').click(function () {
        let $this = $(this);
        let $cardLines = $('.kf_fw_ig2 > tbody > tr:gt(2)');
        if ($this.text() === '开启批量模式') {
            $this.text('关闭批量模式');
            $cardLines.on('click', 'a', function (e) {
                e.preventDefault();
                $(this).next('.pd_card_chk').click();
            }).find('td').has('a').each(function () {
                let matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                if (matches) {
                    $(this).css('position', 'relative').append(`<input class="pd_card_chk" type="checkbox" value="${matches[1]}">`);
                }
            });
            let playedCardList = [];
            $('.kf_fw_ig2 > tbody > tr:nth-child(2) > td').each(function () {
                let matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                if (!matches) return;
                playedCardList.push(parseInt(matches[1]));
            });

            /**
             * 不选择已出战的卡片
             */
            const uncheckPlayedCard = function () {
                for (let id of playedCardList) {
                    $cardLines.find('td').has(`a[href="kf_fw_card_my.php?id=${id}"]`).find('input:checked').prop('checked', false);
                }
            };

            let $btns = $(`
<label><input name="uncheckPlayedCard" type="checkbox" checked> 不选已出战的卡片</label>
<button name="selectOnlyOne">每类只保留一张</button>
<button name="selectAll">全选</button>
<button name="selectInverse">反选</button><br>
<button name="convertCardsToVipTime">转换为VIP时间</button>
`).insertBefore($this);
            $btns.filter('[name="selectOnlyOne"]').click(function () {
                $cardLines.find('input').prop('checked', true);
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
                let cardTypeList = new Set();
                $cardLines.find('a > img').each(function () {
                    cardTypeList.add($(this).attr('src'));
                });
                for (let src of cardTypeList) {
                    let $cardElems = $cardLines.find('td').has(`img[src="${src}"]`);
                    let totalNum = $cardElems.length;
                    let checkedNum = $cardElems.has('input:checked').length;
                    if (totalNum > 1) {
                        if (totalNum === checkedNum) {
                            $cardElems.eq(0).find('input:checked').prop('checked', false);
                        }
                    }
                    else {
                        $cardElems.find('input:checked').prop('checked', false);
                    }
                }
            }).end().filter('[name="selectAll"]').click(function () {
                $cardLines.find('input').prop('checked', true);
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
            }).end().filter('[name="selectInverse"]').click(function () {
                $cardLines.find('input').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
                if ($btns.find('[name="uncheckPlayedCard"]').prop('checked')) uncheckPlayedCard();
            }).end().filter('[name="convertCardsToVipTime"]').click(function () {
                Msg.destroy();
                let cardList = [];
                $cardLines.find('input:checked').each(function () {
                    cardList.push(parseInt($(this).val()));
                });
                if (!cardList.length) return;
                if (!confirm(`共选择了${cardList.length}张卡片，是否将卡片批量转换为VIP时间？`)) return;
                Msg.wait(
                    `<strong>正在批量转换中&hellip;</strong><i>剩余：<em class="pd_countdown">${cardList.length}</em></i>` +
                    `<a class="pd_stop_action" href="#">停止操作</a>`
                );
                convertCardsToVipTime(cardList, safeId);
            });
        }
        else {
            $this.text('开启批量模式');
            $cardLines.off('click').find('.pd_card_chk').remove();
            $this.prevAll().remove();
        }
    });
};
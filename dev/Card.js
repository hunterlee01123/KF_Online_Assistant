/**
 * 卡片类
 */
var Card = {
    /**
     * 将指定的一系列卡片转换为VIP时间
     * @param {number[]} cardList 卡片ID列表
     * @param {string} safeId 用户的SafeID
     */
    convertCardsToVipTime: function (cardList, safeId) {
        var successNum = 0, failNum = 0, totalVipTime = 0, totalEnergy = 0;
        $(document).clearQueue('ConvertCardsToVipTime');
        $.each(cardList, function (index, cardId) {
            $(document).queue('ConvertCardsToVipTime', function () {
                $.ajax({
                    type: 'GET',
                    url: 'kf_fw_card_doit.php?do=recard&id={0}&safeid={1}&t={2}'
                        .replace('{0}', cardId)
                        .replace('{1}', safeId)
                        .replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        KFOL.showFormatLog('将卡片转换为VIP时间', html);
                        var matches = /增加(\d+)小时VIP时间(?:.*?获得(\d+)点恢复能量)?/i.exec(html);
                        if (matches) {
                            successNum++;
                            totalVipTime += parseInt(matches[1]);
                            if (typeof matches[2] !== 'undefined') totalEnergy += parseInt(matches[2]);
                        }
                        else failNum++;
                    },
                    error: function () {
                        failNum++;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('ConvertCardsToVipTime');

                        if (isStop || index === cardList.length - 1) {
                            if (successNum > 0) {
                                Log.push('将卡片转换为VIP时间', '共有`{0}`张卡片成功为VIP时间'.replace('{0}', successNum),
                                    {
                                        gain: {'VIP小时': totalVipTime, '能量': totalEnergy},
                                        pay: {'卡片': -successNum}
                                    }
                                );
                            }
                            KFOL.removePopTips($('.pd_pop_tips'));
                            console.log('共有{0}张卡片转换成功，共有{1}张卡片转换失败，VIP小时+{2}，能量+{3}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', totalVipTime)
                                .replace('{3}', totalEnergy)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>张卡片转换成功{1}</strong><i>VIP小时<em>+{2}</em></i><i>能量<em>+{3}</em></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>张卡片转换失败'.replace('{0}', failNum) : '')
                                .replace('{2}', totalVipTime)
                                .replace('{3}', totalEnergy)
                                , -1);
                            $('.kf_fw_ig2 .pd_card_chk:checked')
                                .closest('td')
                                .fadeOut('normal', function () {
                                    var $parent = $(this).parent();
                                    $(this).remove();
                                    if ($parent.children().length === 0) $parent.remove();
                                });
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('ConvertCardsToVipTime');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('ConvertCardsToVipTime');
    },

    /**
     * 添加开启批量模式的按钮
     */
    addStartBatchModeButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        if ($('.kf_fw_ig2 a[href^="kf_fw_card_my.php?id="]').length === 0) return;
        $('<div class="pd_item_btns"><button>开启批量模式</button></div>').insertAfter('.kf_fw_ig2')
            .find('button').click(function () {
            var $this = $(this);
            var $cardLines = $('.kf_fw_ig2 > tbody > tr:gt(2)');
            if ($this.text() === '开启批量模式') {
                $this.text('关闭批量模式');
                $cardLines.on('click', 'a', function (e) {
                    e.preventDefault();
                    $(this).next('.pd_card_chk').click();
                }).find('td').has('a').each(function () {
                    var matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                    if (!matches) return;
                    $(this).css('position', 'relative')
                        .append('<input class="pd_card_chk" type="checkbox" value="{0}" />'
                            .replace('{0}', matches[1]));
                });
                var playedCardList = [];
                $('.kf_fw_ig2 > tbody > tr:nth-child(2) > td').each(function () {
                    var matches = /kf_fw_card_my\.php\?id=(\d+)/.exec($(this).find('a').attr('href'));
                    if (!matches) return;
                    playedCardList.push(parseInt(matches[1]));
                });
                var uncheckPlayedCard = function () {
                    for (var i in playedCardList) {
                        $cardLines.find('td').has('a[href="kf_fw_card_my.php?id={0}"]'.replace('{0}', playedCardList[i]))
                            .find('input:checked').prop('checked', false);
                    }
                };
                $this.before('<label><input id="uncheckPlayedCard" type="checkbox" checked="checked" /> 不选已出战的卡片</label>' +
                        '<button>每类只保留一张</button><button>全选</button><button>反选</button><br /><button>转换为VIP时间</button>')
                    .prev()
                    .click(function () {
                        KFOL.removePopTips($('.pd_pop_tips'));
                        var cardList = [];
                        $cardLines.find('input:checked').each(function () {
                            cardList.push(parseInt($(this).val()));
                        });
                        if (cardList.length === 0) return;
                        if (!confirm('共选择了{0}张卡片，是否将卡片批量转换为VIP时间？'.replace('{0}', cardList.length))) return;
                        KFOL.showWaitMsg('<strong>正在批量转换中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                            .replace('{0}', cardList.length)
                            , true);
                        Card.convertCardsToVipTime(cardList, safeId);
                    })
                    .prev()
                    .prev()
                    .click(function () {
                        $cardLines.find('input').each(function () {
                            $(this).prop('checked', !$(this).prop('checked'));
                        });
                        if ($('#uncheckPlayedCard').prop('checked')) uncheckPlayedCard();
                    })
                    .prev()
                    .click(function () {
                        $cardLines.find('input').prop('checked', true);
                        if ($('#uncheckPlayedCard').prop('checked')) uncheckPlayedCard();
                    })
                    .prev()
                    .click(function () {
                        $cardLines.find('input').prop('checked', true);
                        if ($('#uncheckPlayedCard').prop('checked')) uncheckPlayedCard();
                        var cardTypeList = [];
                        $cardLines.find('a > img').each(function () {
                            var src = $(this).attr('src');
                            if ($.inArray(src, cardTypeList) === -1) cardTypeList.push(src);
                        });
                        for (var i in cardTypeList) {
                            var $cardElems = $cardLines.find('td').has('img[src="{0}"]'.replace('{0}', cardTypeList[i]));
                            var totalNum = $cardElems.length;
                            var checkedNum = $cardElems.has('input:checked').length;
                            if (totalNum > 1) {
                                if (totalNum === checkedNum) {
                                    $cardElems.eq(0).find('input:checked').prop('checked', false);
                                }
                            }
                            else {
                                $cardElems.find('input:checked').prop('checked', false);
                            }
                        }
                    });
            }
            else {
                $this.text('开启批量模式');
                $cardLines.off('click').find('.pd_card_chk').remove();
                $this.prevAll().remove();
            }
        });
    }
};
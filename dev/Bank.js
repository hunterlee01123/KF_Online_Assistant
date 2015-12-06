/**
 * 银行类
 */
var Bank = {
    // 最低转账金额
    minTransferMoney: 20,

    /**
     * 给活期帐户存款
     * @param {number} money 存款金额（KFB）
     * @param {number} cash 现金（KFB）
     * @param {number} currentDeposit 现有活期存款（KFB）
     */
    saveCurrentDeposit: function (money, cash, currentDeposit) {
        var $tips = KFOL.showWaitMsg('正在存款中...', true);
        $.post('hack.php?H_name=bank',
            {action: 'save', btype: 1, savemoney: money},
            function (html) {
                if (/完成存款/.test(html)) {
                    KFOL.showFormatLog('存款', html);
                    KFOL.removePopTips($tips);
                    console.log('共有{0}KFB存入活期存款'.replace('{0}', money));
                    var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
                    $account.html($account.html().replace(/当前所持：-?\d+KFB/i,
                        '当前所持：{0}KFB'.replace('{0}', cash - money)
                        ).replace(/活期存款：-?\d+KFB/i,
                        '活期存款：{0}KFB'.replace('{0}', currentDeposit + money)
                        )
                    );
                    window.setTimeout(function () {
                        $(document).dequeue('Bank');
                    }, 5000);
                }
                else {
                    $(document).queue('Bank', []);
                    alert('存款失败');
                }
            }, 'html');
    },

    /**
     * 从活期帐户取款
     * @param {number} money 取款金额（KFB）
     */
    drawCurrentDeposit: function (money) {
        var $tips = KFOL.showWaitMsg('正在取款中...', true);
        $.post('hack.php?H_name=bank',
            {action: 'draw', btype: 1, drawmoney: money},
            function (html) {
                KFOL.removePopTips($tips);
                if (/完成取款/.test(html)) {
                    KFOL.showFormatLog('取款', html);
                    console.log('从活期存款中取出了{0}KFB'.replace('{0}', money));
                    KFOL.showMsg('从活期存款中取出了<em>{0}</em>KFB'.replace('{0}', money), -1);
                }
                else if (/取款金额大于您的存款金额/.test(html)) {
                    KFOL.showMsg('取款金额大于当前活期存款金额', -1);
                }
                else if (/\d+秒内不允许重新交易/.test(html)) {
                    KFOL.showMsg('提交速度过快', -1);
                }
                else {
                    KFOL.showMsg('取款失败', -1);
                }
            }, 'html');
    },

    /**
     * 批量转账
     * @param {Array} users 用户列表
     * @param {string} msg 转帐附言
     * @param {boolean} isDeposited 是否已存款
     * @param {number} currentDeposit 现有活期存款
     */
    batchTransfer: function (users, msg, isDeposited, currentDeposit) {
        var successNum = 0, failNum = 0, successMoney = 0;
        $.each(users, function (index, key) {
            $(document).queue('Bank', function () {
                $.ajax({
                    url: 'hack.php?H_name=bank',
                    type: 'post',
                    data: '&action=virement&pwuser={0}&to_money={1}&memo={2}'
                        .replace('{0}', Tools.getGBKEncodeString(key[0]))
                        .replace('{1}', key[1])
                        .replace('{2}', Tools.getGBKEncodeString(msg))
                    ,
                    success: function (html) {
                        KFOL.showFormatLog('批量转账', html);
                        var statMsg = '';
                        if (/完成转帐!<\/span>/.test(html)) {
                            successNum++;
                            successMoney += key[1];
                            statMsg = '<em>+{0}</em>'.replace('{0}', key[1]);
                        }
                        else {
                            failNum++;
                            if (/用户<b>.+?<\/b>不存在<br \/>/.test(html)) {
                                statMsg = '用户不存在';
                            }
                            else if (/您的存款不够支付转帐/.test(html)) {
                                statMsg = '存款不足';
                            }
                            else if (/转账额度不足/.test(html)) {
                                statMsg = '转账额度不足';
                            }
                            else if (/当前等级无法使用该功能/.test(html)) {
                                statMsg = '当前等级无法使用转账功能';
                            }
                            else if (/转帐数目填写不正确/.test(html)) {
                                statMsg = '转帐金额不正确';
                            }
                            else if (/自己无法给自己转帐/.test(html)) {
                                statMsg = '无法给自己转帐';
                            }
                            else if (/\d+秒内不允许重新交易/.test(html)) {
                                statMsg = '提交速度过快';
                            }
                            else {
                                statMsg = '未能获得预期的回应';
                            }
                            statMsg = '<span class="pd_notice">({0})</span>'.replace('{0}', statMsg);
                        }
                        $('.pd_result').last().append('<li>{0} {1}</li>'.replace('{0}', key[0]).replace('{1}', statMsg));
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        if (index === users.length - 1) {
                            if (successNum > 0) {
                                Log.push('批量转账', '共有`{0}`名用户转账成功'.replace('{0}', successNum), {pay: {'KFB': -successMoney}});
                            }
                            KFOL.removePopTips($('.pd_pop_tips'));
                            var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("活期存款：")');
                            $account.html($account.html().replace(/活期存款：-?\d+KFB/i,
                                '活期存款：{0}KFB'.replace('{0}', currentDeposit - successMoney)
                                )
                            );
                            console.log('共有{0}名用户转账成功，共有{1}名用户转账失败，KFB-{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum)
                                .replace('{2}', successMoney)
                            );
                            $('.pd_result').last().append('<li><b>共有<em>{0}</em>名用户转账成功{1}：</b>KFB <ins>-{2}</ins></li>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>名用户转账失败'.replace('{0}', failNum) : '')
                                .replace('{2}', successMoney)
                            );
                            KFOL.showMsg('<strong>共有<em>{0}</em>名用户转账成功{1}</strong><i>KFB<ins>-{2}</ins></i>'
                                .replace('{0}', successNum)
                                .replace('{1}', failNum > 0 ? '，共有<em>{0}</em>名用户转账失败'.replace('{0}', failNum) : '')
                                .replace('{2}', successMoney)
                            );
                        }
                        window.setTimeout(function () {
                            $(document).dequeue('Bank');
                        }, 5000);
                    },
                    dataType: 'html'
                });
            });
        });
        if (!isDeposited) $(document).dequeue('Bank');
    },

    /**
     * 验证批量转账的字段值是否正确
     * @returns {boolean} 是否正确
     */
    batchTransferVerify: function () {
        var $bankUsers = $('#pd_bank_users');
        var users = $bankUsers.val();
        if (!/^\s*\S+\s*$/m.test(users) || /^\s*:/m.test(users) || /:/.test(users) && /:(\D|$)/m.test(users)) {
            alert('用户列表格式不正确');
            $bankUsers.select();
            $bankUsers.focus();
            return false;
        }
        if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
            alert('转帐金额不能小于{0}KFB'.replace('{0}', Bank.minTransferMoney));
            $bankUsers.select();
            $bankUsers.focus();
            return false;
        }
        var $bankMoney = $('#pd_bank_money');
        var money = parseInt($.trim($bankMoney.val()));
        if (/^\s*[^:]+\s*$/m.test(users)) {
            if (!$.isNumeric(money)) {
                alert('通用转账金额格式不正确');
                $bankMoney.select();
                $bankMoney.focus();
                return false;
            }
            else if (money < Bank.minTransferMoney) {
                alert('转帐金额不能小于{0}KFB'.replace('{0}', Bank.minTransferMoney));
                $bankMoney.select();
                $bankMoney.focus();
                return false;
            }
        }
        return true;
    },

    /**
     * 添加批量转账的按钮
     */
    addBatchTransferButton: function () {
        var html =
            '<tr id="pd_bank_transfer">' +
            '  <td style="vertical-align:top">使用说明：<br />每行一名用户，<br />如需单独设定金额，<br />可写为“用户名:金额”<br />（注意是<b>英文冒号</b>）<br />' +
            '例子：<br /><pre style="border:1px solid #9999FF;padding:5px">张三\n李四:200\n王五:500\n信仰风</pre></td>' +
            '  <td>' +
            '  <form>' +
            '    <div style="display:inline-block"><label>用户列表：<br />' +
            '<textarea class="pd_textarea" id="pd_bank_users" style="width:270px;height:250px"></textarea></label></div>' +
            '    <div style="display:inline-block;margin-left:10px;">' +
            '      <label>通用转帐金额（如所有用户都已设定单独金额则可留空）：<br />' +
            '<input class="pd_input" id="pd_bank_money" type="text" style="width:217px" maxlength="15" /></label><br />' +
            '      <label style="margin-top:5px">转帐附言（可留空）：<br />' +
            '<textarea class="pd_textarea" id="pd_bank_msg" style="width:225px;height:206px" id="pd_bank_users"></textarea></label>' +
            '    </div>' +
            '    <div><label><input class="pd_input" type="submit" value="批量转账" /></label>' +
            '<label style="margin-left:3px"><input class="pd_input" type="reset" value="重置" /></label>' +
            '<label style="margin-left:3px"><input class="pd_input" type="button" value="随机金额" title="为用户列表上的每个用户设定指定范围内的随机金额" /></label>' +
            ' （活期存款不足时，将自动进行存款；批量转账金额不会从定期存款中扣除）</div>' +
            '  </form>' +
            '  </td>' +
            '</tr>';
        $(html).appendTo('.bank1 > tbody')
            .find('form')
            .submit(function (e) {
                e.preventDefault();
                KFOL.removePopTips($('.pd_pop_tips'));
                if (!Bank.batchTransferVerify()) return;
                var commonMoney = parseInt($.trim($('#pd_bank_money').val()));
                if (!commonMoney) commonMoney = 0;
                var msg = $('#pd_bank_msg').val();
                var users = [];
                $.each($('#pd_bank_users').val().split('\n'), function (index, line) {
                    line = $.trim(line);
                    if (!line) return;
                    if (line.indexOf(':') > -1) {
                        var arr = line.split(':');
                        if (arr.length < 2) return;
                        users.push([$.trim(arr[0]), parseInt(arr[1])]);
                    }
                    else {
                        users.push([line, commonMoney]);
                    }
                });
                if (users.length === 0) return;

                var matches = /\(手续费(\d+)%\)/.exec($('td:contains("(手续费")').text());
                if (!matches) return;
                var fee = parseInt(matches[1]) / 100;
                var totalMoney = 0;
                for (var i in users) {
                    totalMoney += users[i][1];
                }
                totalMoney = Math.floor(totalMoney * (1 + fee));
                if (!window.confirm('共计{0}名用户，总额{1}KFB，是否转账？'
                        .replace('{0}', users.length)
                        .replace('{1}', totalMoney)
                    )
                ) return;

                var $tips = KFOL.showWaitMsg('正在获取存款信息中...', true);
                $.get('hack.php?H_name=bank', function (html) {
                    KFOL.removePopTips($tips);
                    var cash = 0, currentDeposit = 0;
                    var matches = /当前所持：(-?\d+)KFB<br/i.exec(html);
                    if (!matches) return;
                    cash = parseInt(matches[1]);
                    matches = /活期存款：(-?\d+)KFB<br/i.exec(html);
                    if (!matches) return;
                    currentDeposit = parseInt(matches[1]);
                    if (totalMoney > cash + currentDeposit) {
                        alert('资金不足');
                        return;
                    }

                    $(document).queue('Bank', []);
                    var isDeposited = false;
                    var difference = totalMoney - currentDeposit;
                    if (difference > 0) {
                        isDeposited = true;
                        $(document).queue('Bank', function () {
                            Bank.saveCurrentDeposit(difference, cash, currentDeposit);
                            cash -= difference;
                            currentDeposit += difference;
                        });
                        $(document).dequeue('Bank');
                    }
                    KFOL.showWaitMsg('<strong>正在批量转账中，请耐心等待...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i>'
                        .replace('{0}', users.length)
                        , true);
                    $('#pd_bank_transfer > td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
                    Bank.batchTransfer(users, msg, isDeposited, currentDeposit);
                }, 'html');
            })
            .end()
            .find('.pd_input[type="button"]')
            .click(function (e) {
                e.preventDefault();
                var userList = [];
                $.each($('#pd_bank_users').val().split('\n'), function (index, line) {
                    line = $.trim(line);
                    if (!line) return;
                    userList.push($.trim(line.split(':')[0]));
                });
                if (userList.length === 0) return;

                var range = window.prompt('设定随机金额的范围（注：最低转账金额为20KFB）', '20-100');
                if (range === null) return;
                range = $.trim(range);
                if (!/^\d+-\d+$/.test(range)) {
                    alert('随机金额范围格式不正确');
                    return;
                }
                var arr = range.split('-');
                var min = parseInt(arr[0]), max = parseInt(arr[1]);
                if (max < min) {
                    alert('最大值不能低于最小值');
                    return;
                }

                var content = '';
                for (var i in userList) {
                    content += userList[i] + ':' + Math.floor(Math.random() * (max - min + 1) + min) + '\n';
                }
                $('#pd_bank_users').val(content);
            });
    },

    /**
     * 在银行页面对页面元素进行处理
     */
    handleInBankPage: function () {
        var $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("可获利息：")');
        var interestHtml = $account.html();
        var matches = /可获利息：(\d+)\(/i.exec(interestHtml);
        var interest = 0;
        if (matches) {
            interest = parseInt(matches[1]);
            if (interest > 0) {
                $account.html(interestHtml.replace(/可获利息：\d+\(/i,
                    '可获利息：<b class="pd_highlight">{0}</b>('.replace('{0}', interest)
                    )
                );
            }
        }

        var fixedDepositHtml = $account.html();
        matches = /定期存款：(\d+)KFB/i.exec(fixedDepositHtml);
        if (matches) {
            var fixedDeposit = parseInt(matches[1]);
            if (fixedDeposit > 0 && interest === 0) {
                var time = parseInt(TmpLog.getValue(Config.fixedDepositDueTmpLogName));
                if (!isNaN(time) && time > (new Date()).getTime()) {
                    $account.html(
                        fixedDepositHtml.replace('期间不存取定期，才可以获得利息）',
                            '期间不存取定期，才可以获得利息）<span style="color:#999">（到期时间：{0} {1}）</span>'
                                .replace('{0}', Tools.getDateString(new Date(time)))
                                .replace('{1}', Tools.getTimeString(new Date(time), ':', false))
                        )
                    );
                }
            }
        }

        $('form[name="form1"], form[name="form2"]').submit(function () {
            var $this = $(this);
            var money = 0;
            if ($this.is('[name="form2"]')) money = parseInt($.trim($this.find('input[name="drawmoney"]').val()));
            else money = parseInt($.trim($this.find('input[name="savemoney"]').val()));
            if (parseInt($this.find('input[name="btype"]:checked').val()) === 2 && money > 0) {
                TmpLog.setValue(Config.fixedDepositDueTmpLogName, Tools.getDate('+90d').getTime());
            }
        });

        $('form[name="form3"]').submit(function () {
            var matches = /活期存款：(-?\d+)KFB/i.exec($('td:contains("活期存款：")').text());
            if (!matches) return;
            var currentDeposit = parseInt(matches[1]);
            matches = /定期存款：(\d+)KFB/i.exec($('td:contains("定期存款：")').text());
            if (!matches) return;
            var fixedDeposit = parseInt(matches[1]);
            var money = parseInt($.trim($('input[name="to_money"]').val()));
            if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
                if (!window.confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                    $(this).find('input[type="submit"]').prop('disabled', false);
                    return false;
                }
            }
        });
    },

    /**
     * 定期存款到期提醒
     */
    fixedDepositDueAlert: function () {
        console.log('定期存款到期提醒Start');
        $.get('hack.php?H_name=bank', function (html) {
            Tools.setCookie(Config.fixedDepositDueAlertCookieName, 1, Tools.getMidnightHourDate(1));
            var matches = /可获利息：(\d+)\(/.exec(html);
            if (!matches) return;
            var interest = parseInt(matches[1]);
            if (interest > 0) {
                Tools.setCookie(Config.fixedDepositDueAlertCookieName, 1, Tools.getMidnightHourDate(7));
                if (window.confirm('您的定期存款已到期，共产生利息{0}KFB，是否前往银行取款？'.replace('{0}', interest))) {
                    location.href = 'hack.php?H_name=bank';
                }
            }
        }, 'html');
    }
};
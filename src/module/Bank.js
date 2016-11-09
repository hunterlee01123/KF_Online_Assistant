/* 银行模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import {push as pushLog} from './Log';
import * as TmpLog from './TmpLog';
import * as Public from './Public';

// 最低转账金额
const minTransferMoney = 20;

/**
 * 给活期帐户存款
 * @param {number} money 存款金额（KFB）
 * @param {number} cash 现金（KFB）
 * @param {number} currentDeposit 现有活期存款（KFB）
 */
const saveCurrentDeposit = function (money, cash, currentDeposit) {
    let $wait = Msg.wait('正在存款中&hellip;');
    $.post('hack.php?H_name=bank',
        {action: 'save', btype: 1, savemoney: money},
        function (html) {
            if (/完成存款/.test(html)) {
                Public.showFormatLog('存款', html);
                Msg.remove($wait);
                console.log(`共有${money}KFB存入活期存款`);
                let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
                $account.html(
                    $account.html()
                        .replace(/当前所持：-?\d+KFB/, `当前所持：${cash - money}KFB`)
                        .replace(/活期存款：-?\d+KFB/, `活期存款：${currentDeposit + money}KFB`)
                );
                setTimeout(function () {
                    $(document).dequeue('Bank');
                }, 5000);
            }
            else {
                $(document).clearQueue('Bank');
                alert('存款失败');
            }
        });
};

/**
 * 从活期帐户取款
 * @param {number} money 取款金额（KFB）
 */
export const drawCurrentDeposit = function (money) {
    let $wait = Msg.wait('正在取款中&hellip;');
    $.post('hack.php?H_name=bank',
        {action: 'draw', btype: 1, drawmoney: money},
        function (html) {
            Msg.remove($wait);
            if (/完成取款/.test(html)) {
                Public.showFormatLog('取款', html);
                console.log(`从活期存款中取出了${money}KFB`);
                Msg.show(`从活期存款中取出了<em>${money}</em>KFB`, -1);
            }
            else if (/取款金额大于您的存款金额/.test(html)) {
                Msg.show('取款金额大于当前活期存款金额', -1);
            }
            else if (/\d+秒内不允许重新交易/.test(html)) {
                Msg.show('提交速度过快', -1);
            }
            else {
                Msg.show('取款失败', -1);
            }
        });
};

/**
 * 批量转账
 * @param {Array} users 用户列表
 * @param {string} msg 转帐附言
 * @param {boolean} isDeposited 是否已存款
 * @param {number} currentDeposit 现有活期存款
 */
const batchTransfer = function (users, msg, isDeposited, currentDeposit) {
    let successNum = 0, failNum = 0, successMoney = 0;
    $.each(users, function (index, [userName, money]) {
        $(document).queue('Bank', function () {
            $.ajax({
                type: 'POST',
                url: 'hack.php?H_name=bank',
                timeout: Const.defAjaxTimeout,
                data: `&action=virement&pwuser=${Util.getGBKEncodeString(userName)}&to_money=${money}&memo=${Util.getGBKEncodeString(msg)}`,
                success (html) {
                    Public.showFormatLog('批量转账', html);
                    let msg = '';
                    if (/完成转帐!<\/span>/.test(html)) {
                        successNum++;
                        successMoney += money;
                        msg = `${userName} <em>+${money}</em>`;
                    }
                    else {
                        failNum++;
                        let errorMsg = '';
                        if (/用户<b>.+?<\/b>不存在<br \/>/.test(html)) {
                            errorMsg = '用户不存在';
                        }
                        else if (/您的存款不够支付转帐/.test(html)) {
                            errorMsg = '存款不足';
                        }
                        else if (/转账额度不足/.test(html)) {
                            errorMsg = '转账额度不足';
                        }
                        else if (/当前等级无法使用该功能/.test(html)) {
                            errorMsg = '当前等级无法使用转账功能';
                        }
                        else if (/转帐数目填写不正确/.test(html)) {
                            errorMsg = '转帐金额不正确';
                        }
                        else if (/自己无法给自己转帐/.test(html)) {
                            errorMsg = '无法给自己转帐';
                        }
                        else if (/\d+秒内不允许重新交易/.test(html)) {
                            errorMsg = '提交速度过快';
                        }
                        else {
                            errorMsg = '未能获得预期的回应';
                        }
                        msg = `${userName}:${money} <span class="pd_notice">(${errorMsg})</span>`;
                    }
                    $('.pd_result:last').append(`<li>${msg}</li>`);
                },
                error () {
                    failNum++;
                    $('.pd_result:last').append(
                        `<li>${userName}:${money} <span class="pd_notice">(连接超时，转账可能失败，请到` +
                        '<a target="_blank" href="hack.php?H_name=bank&action=log">银行日志</a>里进行确认)</span></li>'
                    );
                },
                complete () {
                    let $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    let isStop = $remainingNum.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('Bank');

                    if (isStop || index === users.length - 1) {
                        if (successNum > 0) {
                            pushLog('批量转账', `共有\`${successNum}\`名用户转账成功`, {pay: {'KFB': -successMoney}});
                        }
                        Msg.destroy();
                        let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("活期存款：")');
                        $account.html($account.html().replace(/活期存款：-?\d+KFB/, `活期存款：${currentDeposit - successMoney}KFB`));
                        console.log(`共有${successNum}名用户转账成功，共有${failNum}名用户转账失败，KFB-${successMoney}`);
                        $('.pd_result:last').append(
                            `<li><b>共有<em>${successNum}</em>名用户转账成功` +
                            `${failNum > 0 ? `，共有<em>${failNum}</em>名用户转账失败` : ''}：</b>KFB <ins>-${successMoney}</ins></li>`
                        );
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>名用户转账成功` +
                            `${failNum > 0 ? `，共有<em>${failNum}</em>名用户转账失败` : ''}</strong><i>KFB<ins>-${successMoney}</ins></i>`
                            , -1
                        );
                    }
                    else {
                        setTimeout(() => $(document).dequeue('Bank'), 5000);
                    }
                }
            });
        });
    });
    if (!isDeposited) $(document).dequeue('Bank');
};

/**
 * 验证批量转账的字段值是否正确
 * @returns {boolean} 是否正确
 */
const batchTransferVerify = function () {
    let $bankUsers = $('#pd_bank_users');
    let users = $bankUsers.val();
    if (!/^\s*\S+\s*$/m.test(users) || /^\s*:/m.test(users) || /:/.test(users) && /:(\D|$)/m.test(users)) {
        alert('用户列表格式不正确');
        $bankUsers.select();
        $bankUsers.focus();
        return false;
    }
    if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
        alert(`转帐金额不能小于${minTransferMoney}KFB`);
        $bankUsers.select();
        $bankUsers.focus();
        return false;
    }
    let $bankMoney = $('#pd_bank_money');
    let money = parseInt($.trim($bankMoney.val()));
    if (/^\s*[^:]+\s*$/m.test(users)) {
        if (!$.isNumeric(money)) {
            alert('通用转账金额格式不正确');
            $bankMoney.select();
            $bankMoney.focus();
            return false;
        }
        else if (money < minTransferMoney) {
            alert(`转帐金额不能小于${minTransferMoney}KFB`);
            $bankMoney.select();
            $bankMoney.focus();
            return false;
        }
    }
    return true;
};

/**
 * 添加批量转账的按钮
 */
export const addBatchTransferButton = function () {
    let html = `
<tr id="pd_bank_transfer">
  <td style="vertical-align: top;">使用说明：<br>每行一名用户，<br>如需单独设定金额，<br>可写为“用户名:金额”<br>（注意是<b>英文冒号</b>）<br>
例子：<br><pre style="border: 1px solid #9999ff; padding: 5px;">张三\n李四:200\n王五:500\n信仰风</pre></td>
  <td>
  <form>
    <div style="display: inline-block;">
      <label>用户列表：<br>
        <textarea class="pd_textarea" id="pd_bank_users" style="width: 270px; height: 250px;"></textarea>
      </label>
    </div>
    <div style="display: inline-block; margin-left: 10px;">
      <label>通用转帐金额（如所有用户都已设定单独金额则可留空）：<br>
        <input class="pd_input" id="pd_bank_money" type="text" style="width: 217px;" maxlength="15">
      </label><br>
      <label style="margin-top: 5px;">转帐附言（可留空）：<br>
        <textarea class="pd_textarea" id="pd_bank_msg" style="width: 225px; height: 206px;"></textarea>
      </label>
    </div>
    <div>
      <label><input class="pd_input" type="submit" value="批量转账"></label>
      <label style="margin-left: 3px;"><input class="pd_input" type="reset" value="重置"></label>
      <label style="margin-left: 3px;">
        <input class="pd_input" type="button" value="随机金额" title="为用户列表上的每个用户设定指定范围内的随机金额">
      </label>
      （活期存款不足时，将自动进行存款；批量转账金额不会从定期存款中扣除）
    </div>
  </form>
  </td>
</tr>`;
    $(html).appendTo('.bank1 > tbody')
        .find('form')
        .submit(function (e) {
            e.preventDefault();
            Msg.destroy();
            if (!batchTransferVerify()) return;
            let commonMoney = parseInt($.trim($('#pd_bank_money').val()));
            if (!commonMoney) commonMoney = 0;
            let msg = $('#pd_bank_msg').val();
            let users = [];
            for (let line of $('#pd_bank_users').val().split('\n')) {
                line = $.trim(line);
                if (!line) continue;
                if (line.includes(':')) {
                    let [userName, money] = line.split(':');
                    if (typeof money === 'undefined') continue;
                    users.push([$.trim(userName), parseInt(money)]);
                }
                else {
                    users.push([line, commonMoney]);
                }
            }
            if (!users.length) return;

            let matches = /\(手续费(\d+)%\)/.exec($('td:contains("(手续费")').text());
            if (!matches) return;
            let fee = parseInt(matches[1]) / 100;
            let totalMoney = 0;
            for (let [userName, money] of users) {
                totalMoney += money;
            }
            totalMoney = Math.floor(totalMoney * (1 + fee));
            if (!confirm(`共计${users.length}名用户，总额${totalMoney.toLocaleString()}KFB，是否转账？`)) return;

            let $wait = Msg.wait('正在获取存款信息中&hellip;');
            $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
                Msg.remove($wait);
                let cash = 0, currentDeposit = 0;
                let matches = /当前所持：(-?\d+)KFB<br/i.exec(html);
                if (!matches) return;
                cash = parseInt(matches[1]);
                matches = /活期存款：(-?\d+)KFB<br/i.exec(html);
                if (!matches) return;
                currentDeposit = parseInt(matches[1]);
                if (totalMoney > cash + currentDeposit) {
                    alert('资金不足');
                    return;
                }

                $(document).clearQueue('Bank');
                let isDeposited = false;
                let difference = totalMoney - currentDeposit;
                if (difference > 0) {
                    isDeposited = true;
                    $(document).queue('Bank', function () {
                        saveCurrentDeposit(difference, cash, currentDeposit);
                        cash -= difference;
                        currentDeposit += difference;
                    });
                    $(document).dequeue('Bank');
                }
                Msg.wait(
                    `<strong>正在批量转账中，请耐心等待&hellip;</strong><i>剩余：<em id="pd_remaining_num">${users.length}</em></i>` +
                    `<a class="pd_stop_action" href="#">停止操作</a>`
                );
                $('#pd_bank_transfer > td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
                batchTransfer(users, msg, isDeposited, currentDeposit);
            });
        })
        .end()
        .find('.pd_input[type="button"]')
        .click(function (e) {
            e.preventDefault();
            let userList = [];
            for (let line of $('#pd_bank_users').val().split('\n')) {
                line = $.trim(line);
                if (!line) continue;
                userList.push($.trim(line.split(':')[0]));
            }
            if (!userList.length) return;

            let range = prompt('设定随机金额的范围（注：最低转账金额为20KFB）', '20-100');
            if (range === null) return;
            range = $.trim(range);
            if (!/^\d+-\d+$/.test(range)) {
                alert('随机金额范围格式不正确');
                return;
            }
            let arr = range.split('-');
            let min = parseInt(arr[0]), max = parseInt(arr[1]);
            if (max < min) {
                alert('最大值不能低于最小值');
                return;
            }

            let content = '';
            for (let userName of userList) {
                content += userName + ':' + Math.floor(Math.random() * (max - min + 1) + min) + '\n';
            }
            $('#pd_bank_users').val(content);
        });
};

/**
 * 在银行页面对页面元素进行处理
 */
export const handleInBankPage = function () {
    let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("可获利息：")');
    let interestHtml = $account.html();
    let matches = /可获利息：(\d+)\(/i.exec(interestHtml);
    let interest = 0;
    if (matches) {
        interest = parseInt(matches[1]);
        if (interest > 0) {
            $account.html(
                interestHtml.replace(/可获利息：\d+\(/i, `可获利息：<b class="pd_highlight">${interest}</b>(`)
            );
        }
    }

    let fixedDepositHtml = $account.html();
    matches = /定期存款：(\d+)KFB/i.exec(fixedDepositHtml);
    if (matches) {
        let fixedDeposit = parseInt(matches[1]);
        if (fixedDeposit > 0 && interest === 0) {
            let time = parseInt(TmpLog.getValue(Const.fixedDepositDueTmpLogName));
            if (!isNaN(time) && time > new Date().getTime()) {
                fixedDepositHtml = fixedDepositHtml.replace(
                    '期间不存取定期，才可以获得利息）',
                    `期间不存取定期，才可以获得利息）<span style="color: #339933;"> (到期时间：${Util.getDateString(new Date(time))} ` +
                    `${Util.getTimeString(new Date(time), ':', false)})</span>`
                );
                $account.html(fixedDepositHtml);
            }

            matches = /定期利息：([\d\.]+)%/.exec(fixedDepositHtml);
            if (matches) {
                let interestRate = parseFloat(matches[1]) / 100;
                let anticipatedInterest = Math.round(fixedDeposit * interestRate * Const.fixedDepositDueTime);
                fixedDepositHtml = fixedDepositHtml.replace(
                    '取出定期将获得该数额的KFB利息)',
                    `取出定期将获得该数额的KFB利息)<span style="color: #339933;"> (预期利息：${anticipatedInterest} KFB)</span>`
                );
                $account.html(fixedDepositHtml);
            }
        }
    }

    $('form[name="form1"], form[name="form2"]').submit(function () {
        let $this = $(this);
        let money = 0;
        if ($this.is('[name="form2"]')) money = parseInt($this.find('input[name="drawmoney"]').val());
        else money = parseInt($this.find('input[name="savemoney"]').val());
        if (parseInt($this.find('input[name="btype"]:checked').val()) === 2 && money > 0) {
            TmpLog.setValue(Const.fixedDepositDueTmpLogName, Util.getDate(`+${Const.fixedDepositDueTime}d`).getTime());
        }
    });

    $('form[name="form3"]').submit(function () {
        let matches = /活期存款：(-?\d+)KFB/.exec($('td:contains("活期存款：")').text());
        if (!matches) return;
        let currentDeposit = parseInt(matches[1]);
        matches = /定期存款：(\d+)KFB/.exec($('td:contains("定期存款：")').text());
        if (!matches) return;
        let fixedDeposit = parseInt(matches[1]);
        let money = parseInt($('input[name="to_money"]').val());
        if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
            if (!confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                $(this).find('input[type="submit"]').prop('disabled', false);
                return false;
            }
        }
    });
};

/**
 * 定期存款到期提醒
 */
export const fixedDepositDueAlert = function () {
    console.log('定期存款到期提醒Start');
    $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
        Util.setCookie(Const.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(1));
        let matches = /可获利息：(\d+)\(/.exec(html);
        if (!matches) return;
        let interest = parseInt(matches[1]);
        if (interest > 0) {
            Util.setCookie(Const.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(7));
            if (confirm(`您的定期存款已到期，共产生利息${interest}KFB，是否前往银行取款？`)) {
                location.href = 'hack.php?H_name=bank';
            }
        }
    });
};

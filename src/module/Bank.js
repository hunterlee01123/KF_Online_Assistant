/* 银行模块 */
'use strict';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import * as Log from './Log';
import * as TmpLog from './TmpLog';
import * as Public from './Public';

// 最低转账金额
const minTransferMoney = 20;

/**
 * 对银行页面元素进行处理
 */
export const handleBankPage = function () {
    let $account = $('.bank1 > tbody > tr:nth-child(2) > td:contains("当前所持：")');
    if (!$account.length) return;
    let html = $account.html();
    $account.html(
        html.replace(/当前所持：(-?\d+)KFB/, (m, kfb) => `当前所持：<b id="pdCash" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB`)
            .replace(/活期存款：(-?\d+)KFB/, (m, kfb) => `活期存款：<b id="pdCurrentDeposit" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB`)
            .replace(/定期存款：(-?\d+)KFB/, (m, kfb) => `定期存款：<b id="pdFixedDeposit" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB`)
            .replace(/可获利息：(-?\d+)/, (m, kfb) => `可获利息：<b id="pdInterest" data-num="${kfb}">${parseInt(kfb).toLocaleString()}</b> KFB `)
            .replace(/定期利息：([\d\.]+)%/, '定期利息：<b id="pdInterestRate" data-num="$1">$1</b>%')
            .replace(/(，才可以获得利息）)/, '$1 <span id="pdExpireTime" style="color: #393;"></span>')
            .replace(/(，取出定期将获得该数额的KFB利息\))/, '$1 <span id="pdExpectedInterest" style="color: #393;"></span>')
    );
    $account.find('[data-num]').css('color', '#f60');

    let $interest = $('#pdInterest');
    let interest = parseInt($interest.data('num'));
    if (interest > 0) $interest.css('color', '#393');

    let fixedDeposit = parseInt($('#pdFixedDeposit').data('num'));
    if (fixedDeposit > 0 && interest === 0) {
        let time = parseInt(TmpLog.getValue(Const.fixedDepositDueTmpLogName));
        if (!isNaN(time) && time > $.now()) {
            $('#pdExpireTime').text(`(到期时间：${Util.getDateString(new Date(time))} ${Util.getTimeString(new Date(time), ':', false)})`);
        }

        let interestRate = parseFloat($('#pdInterestRate').data('num')) / 100;
        let anticipatedInterest = Math.round(fixedDeposit * interestRate * Const.fixedDepositDueTime);
        $('#pdExpectedInterest').text(`(预期利息：${anticipatedInterest.toLocaleString()} KFB)`);
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
        let currentDeposit = parseInt($('#pdCurrentDeposit').data('num'));
        let fixedDeposit = parseInt($('#pdFixedDeposit').data('num'));
        let money = parseInt($('[name="to_money"]').val());
        if (!isNaN(money) && fixedDeposit > 0 && money > currentDeposit) {
            if (!confirm('你的活期存款不足，转账金额将从定期存款里扣除，是否继续？')) {
                $(this).find('[type="submit"]').prop('disabled', false);
                return false;
            }
        }
    });

    let $fee = $('a[href="hack.php?H_name=bank&action=log"]').parent();
    $fee.html($fee.html().replace(/\(手续费(\d+)%\)/, '(手续费<span id="pdFee" data-num="$1">$1</span>%)'));

    let $transferLimit = $('form[name="form3"] > span:first');
    $transferLimit.html(
        $transferLimit.html()
            .replace(/可转账额度：(\d+)/, (m, num) => `可转账额度：<b id="pdTransferLimit" data-num="${num}">${parseInt(num).toLocaleString()}</b>`)
            .replace('额度通过发帖(每个主题帖200额度/回复帖10额度)和被评分（评分数x120%额度）获得', '额度可通过领取每日奖励获得')
    );
    addBatchTransferButton();

    $(document).on('change', '[name="savemoney"], [name="drawmoney"], [name="to_money"], [name="to_money"], [name="transfer_money"]', function () {
        let $this = $(this);
        let value = $.trim($this.val());
        if (value) $this.val(value.replace(/,/g, ''));
    });
};

/**
 * 给活期帐户存款
 * @param {number} money 存款金额（KFB）
 * @param {number} cash 现金（KFB）
 * @param {number} currentDeposit 现有活期存款（KFB）
 */
const saveCurrentDeposit = function (money, cash, currentDeposit) {
    let $wait = Msg.wait('<strong>正在存款中&hellip;</strong>');
    $.post('hack.php?H_name=bank',
        {action: 'save', btype: 1, savemoney: money},
        function (html) {
            Public.showFormatLog('存款', html);
            let {msg} = Util.getResponseMsg(html);
            if (/完成存款/.test(msg)) {
                Msg.remove($wait);
                console.log(`共有${money}KFB存入活期存款`);
                $('#pdCash').text((cash - money).toLocaleString()).data('num', cash - money);
                $('#pdCurrentDeposit').text((currentDeposit + money).toLocaleString()).data('num', currentDeposit + money);
                setTimeout(function () {
                    $(document).dequeue('Bank');
                }, Const.bankActionInterval);
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
    let $wait = Msg.wait('<strong>正在取款中&hellip;</strong>');
    $.post('hack.php?H_name=bank',
        {action: 'draw', btype: 1, drawmoney: money},
        function (html) {
            Public.showFormatLog('取款', html);
            let {msg} = Util.getResponseMsg(html);
            Msg.remove($wait);
            if (/完成取款/.test(msg)) {
                console.log(`从活期存款中取出了${money}KFB`);
                Msg.show(`<strong>从活期存款中取出了<em>${money.toLocaleString()}</em>KFB</strong>`, -1);
            }
            else Msg.show(msg, -1);
        });
};

/**
 * 批量转账
 * @param {Array} users 用户列表
 * @param {string} msg 转帐附言
 * @param {boolean} isDeposited 是否已存款
 * @param {number} currentDeposit 现有活期存款
 * @param {number} transferLimit 现有转账额度
 */
const batchTransfer = function (users, msg, isDeposited, currentDeposit, transferLimit) {
    let successNum = 0, failNum = 0, successMoney = 0;
    $.each(users, function (index, [userName, money]) {
        $(document).queue('Bank', function () {
            $.ajax({
                type: 'POST',
                url: 'hack.php?H_name=bank',
                timeout: Const.defAjaxTimeout,
                data: `&action=virement&pwuser=${Util.getGBKEncodeString(userName)}&to_money=${money}&memo=${Util.getGBKEncodeString(msg)}`,
                success(html) {
                    Public.showFormatLog('批量转账', html);
                    let {msg} = Util.getResponseMsg(html);
                    let msgHtml = `${userName} <em>+${money.toLocaleString()}</em>`;
                    if (/完成转帐!/.test(msg)) {
                        successNum++;
                        successMoney += money;
                    }
                    else {
                        failNum++;
                        if (/用户<b>.+?<\/b>不存在/.test(msg)) msg = '用户不存在';
                        msgHtml += ` <span class="pd_notice">(错误：${msg})</span>`;
                    }
                    $('.pd_result:last').append(`<li>${msgHtml}</li>`);
                },
                error() {
                    failNum++;
                    $('.pd_result:last').append(`
<li>
  ${userName}:${money.toLocaleString()}
  <span class="pd_notice">(错误：连接超时，转账可能失败，请到<a target="_blank" href="hack.php?H_name=bank&action=log">银行日志</a>里进行确认)</span>
</li>
`);
                },
                complete() {
                    let $countdown = $('.pd_countdown:last');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('Bank');

                    if (isStop || index === users.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) Log.push('批量转账', `共有\`${successNum}\`名用户转账成功`, {pay: {'KFB': -successMoney}});
                        $('#pdCurrentDeposit').text((currentDeposit - successMoney).toLocaleString()).data('num', currentDeposit - successMoney);
                        $('#pdTransferLimit').text((transferLimit - successMoney).toLocaleString()).data('num', transferLimit - successMoney);
                        console.log(`共有${successNum}名用户转账成功，共有${failNum}名用户转账失败，KFB-${successMoney}`);
                        $('.pd_result:last').append(
                            `<li><b>共有<em>${successNum}</em>名用户转账成功` +
                            `${failNum > 0 ? `，共有<em>${failNum}</em>名用户转账失败` : ''}：</b>KFB <ins>-${successMoney.toLocaleString()}</ins></li>`
                        );
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>名用户转账成功` +
                            `${failNum > 0 ? `，共有<em>${failNum}</em>名用户转账失败` : ''}</strong><i>KFB<ins>-${successMoney.toLocaleString()}</ins></i>`
                            , -1
                        );
                    }
                    else {
                        setTimeout(() => $(document).dequeue('Bank'), Const.bankActionInterval);
                    }
                }
            });
        });
    });
    if (!isDeposited) $(document).dequeue('Bank');
};

/**
 * 验证批量转账的字段值是否正确
 * @param {jQuery} $transfer 批量转账区域对象
 * @returns {boolean} 是否正确
 */
const batchTransferVerify = function ($transfer) {
    let $bankUsers = $transfer.find('[name="users"]');
    let users = $bankUsers.val();
    if (!/^\s*\S+\s*$/m.test(users) || /^\s*:/m.test(users) || /:/.test(users) && /:(\D|$)/m.test(users)) {
        alert('用户列表格式不正确');
        $bankUsers.select().focus();
        return false;
    }
    if (/^\s*\S+?:0*[0-1]?\d\s*$/m.test(users)) {
        alert(`转帐金额不能小于${minTransferMoney}KFB`);
        $bankUsers.select().focus();
        return false;
    }
    let $bankMoney = $transfer.find('[name="transfer_money"]');
    let money = parseInt($bankMoney.val());
    if (/^\s*[^:]+\s*$/m.test(users)) {
        if (!$.isNumeric(money)) {
            alert('通用转账金额格式不正确');
            $bankMoney.select().focus();
            return false;
        }
        else if (money < minTransferMoney) {
            alert(`转帐金额不能小于${minTransferMoney}KFB`);
            $bankMoney.select().focus();
            return false;
        }
    }
    return true;
};

/**
 * 添加批量转账的按钮
 */
const addBatchTransferButton = function () {
    let $area = $(`
<tr id="pdBankTransferArea">
  <td style="vertical-align: top;">
    使用说明：<br>每行一名用户，<br>如需单独设定金额，<br>可写为“用户名:金额”<br>（注意是<b>英文冒号</b>）<br>例子：<br>
    <pre style="border: 1px solid #9999ff; padding: 5px;">张三\n李四:200\n王五:500\n信仰风</pre>
  </td>
  <td>
  <form>
    <div style="display: inline-block;">
      <label>用户列表：<br>
        <textarea class="pd_textarea" name="users" style="width: 270px; height: 250px;"></textarea>
      </label>
    </div>
    <div style="display: inline-block; margin-left: 10px;">
      <label>通用转帐金额（如所有用户都已设定单独金额则可留空）：<br>
        <input class="pd_input" name="transfer_money" type="text" style="width: 217px;">
      </label><br>
      <label style="margin-top: 5px;">转帐附言（可留空）：<br>
        <textarea class="pd_textarea" name="msg" style="width: 225px; height: 206px;"></textarea>
      </label>
    </div>
    <div>
      <button type="submit">批量转账</button>
      <button type="reset">重置</button>
      <button name="random" type="button" title="为用户列表上的每个用户设定指定范围内的随机金额">随机金额</button>
      （活期存款不足时，将自动进行存款；批量转账金额不会从定期存款中扣除）
      ${Util.isIE() || Util.isEdge() ? '<br><span class="pd_highlight">注：IE和Edge浏览器在批量转账给中文名用户时会出现乱码，请使用其它浏览器进行批量转账</span>' : ''}
    </div>
  </form>
  </td>
</tr>
`).appendTo('.bank1 > tbody');

    $area.find('form').submit(function (e) {
        e.preventDefault();
        Msg.destroy();
        if (!batchTransferVerify($area)) return;
        let commonMoney = parseInt($area.find('[name="transfer_money"]').val());
        if (!commonMoney) commonMoney = 0;
        let msg = $area.find('[name="msg"]').val();
        let users = [];
        for (let line of $area.find('[name="users"]').val().split('\n')) {
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

        let fee = parseInt($('#pdFee').data('num'));
        if (isNaN(fee)) fee = 0;
        let totalMoney = 0;
        for (let [, money] of users) {
            totalMoney += money;
        }
        totalMoney = Math.floor(totalMoney * (1 + fee));
        if (!confirm(`共计 ${users.length} 名用户，总额 ${totalMoney.toLocaleString()} KFB，是否转账？`)) return;

        let $wait = Msg.wait('<strong>正在获取银行账户信息中&hellip;</strong>');
        $.get('hack.php?H_name=bank&t=' + $.now(), function (html) {
            Msg.remove($wait);
            let cash = 0, currentDeposit = 0, transferLimit = 0;
            let matches = /当前所持：(-?\d+)KFB/.exec(html);
            if (!matches) return;
            cash = parseInt(matches[1]);
            matches = /活期存款：(-?\d+)KFB/.exec(html);
            if (!matches) return;
            currentDeposit = parseInt(matches[1]);
            matches = /可转账额度：(\d+)/.exec(html);
            if (!matches) return;
            transferLimit = parseInt(matches[1]);
            if (totalMoney > cash + currentDeposit) {
                alert('资金不足');
                return;
            }
            if (totalMoney > transferLimit) {
                alert('转账额度不足');
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
                `<strong>正在批量转账中，请耐心等待&hellip;</strong><i>剩余：<em class="pd_countdown">${users.length}</em></i>` +
                `<a class="pd_stop_action" href="#">停止操作</a>`
            );
            $area.find('> td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
            batchTransfer(users, msg, isDeposited, currentDeposit, transferLimit);
        });
    }).find('[name="random"]').click(function () {
        let userList = [];
        for (let line of $area.find('[name="users"]').val().split('\n')) {
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
        $area.find('[name="users"]').val(content);
    });
};

/**
 * 定期存款到期提醒
 */
export const fixedDepositDueAlert = function () {
    console.log('定期存款到期提醒Start');
    $.get('hack.php?H_name=bank&t=' + $.now(), function (html) {
        Util.setCookie(Const.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(1));
        let matches = /可获利息：(\d+)/.exec(html);
        if (!matches) return;
        let interest = parseInt(matches[1]);
        if (interest > 0) {
            Util.setCookie(Const.fixedDepositDueAlertCookieName, 1, Util.getMidnightHourDate(7));
            if (confirm(`您的定期存款已到期，共产生利息 ${interest.toLocaleString()} KFB，是否前往银行取款？`)) {
                location.href = 'hack.php?H_name=bank';
            }
        }
    });
};

/* 银行模块 */
'use strict';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import * as Log from './Log';
import * as TmpLog from './TmpLog';
import * as Public from './Public';
import * as Script from './Script';

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
            .replace('额度通过发帖(每个主题帖200额度/回复帖10额度)和被评分（评分数x120%额度）获得', '在转账时会扣除相应额度，额度是一次性的，可通过领取每日奖励获得')
    );
    addBatchTransferButton();

    $(document).on('change', '[name="savemoney"], [name="drawmoney"], [name="to_money"], [name="to_money"], [name="transfer_money"]', function () {
        let $this = $(this);
        let value = $.trim($this.val());
        if (value) $this.val(value.replace(/,/g, ''));
    });
};

/**
 * 存取款
 * @param {string} action 操作类型，save：存款，draw：取款
 * @param {number} type 存取款类型，1：活期，2：定期
 * @param {number} money 存款金额（KFB）
 * @param {function} callback 回调函数
 */
export const saveOrDrawMoney = function (action, type, money, callback = null) {
    let data = {action: action, btype: type};
    if (action === 'draw') data['drawmoney'] = money;
    else data['savemoney'] = money;
    $.ajax({
        type: 'POST',
        url: 'hack.php?H_name=bank',
        timeout: Const.defAjaxTimeout,
        data: data,
    }).done(function (html) {
        Public.showFormatLog('存取款', html);
        let {msg} = Util.getResponseMsg(html);
        if (typeof  callback === 'function') callback(msg);
    }).fail(function () {
        if (typeof  callback === 'function') callback('timeout');
    });
};

/**
 * 将指定账户金额节点设置为指定值
 * @param {jQuery} $node 账户金额节点
 * @param {number|string} value 数值（可设为相对值，如+=50、-=100）
 */
export const setNodeValue = function ($node, value) {
    if (!$node.length) return;
    let num = 0;
    if (!$.isNumeric(value)) {
        let matches = /(\+|-)=(\d+)/.exec(value);
        if (!matches) return;
        let diff = parseInt(matches[2]);
        let oldNum = parseInt($node.data('num'));
        oldNum = oldNum ? oldNum : 0;
        num = value.startsWith('+') ? oldNum + diff : oldNum - diff;
    }
    else {
        num = parseInt(value);
    }
    $node.text(num.toLocaleString()).data('num', num);
};

/**
 * 批量转账
 * @param {Array} users 用户列表
 * @param {string} msg 转帐附言
 * @param {boolean} isDeposited 是否已存款
 */
const batchTransfer = function (users, msg, isDeposited) {
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
                        setNodeValue($('#pdCurrentDeposit'), '-=' + successMoney);
                        setNodeValue($('#pdTransferLimit'), '-=' + successMoney);
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
            let matches = /当前所持：(-?\d+)KFB/.exec(html);
            if (!matches) return;
            let cash = parseInt(matches[1]);
            matches = /活期存款：(-?\d+)KFB/.exec(html);
            if (!matches) return;
            let currentDeposit = parseInt(matches[1]);
            matches = /可转账额度：(\d+)/.exec(html);
            if (!matches) return;
            let transferLimit = parseInt(matches[1]);
            if (totalMoney > cash + currentDeposit) {
                alert('资金不足');
                return;
            }
            if (totalMoney > transferLimit) {
                alert('转账额度不足');
                return;
            }
            setNodeValue($('#pdCash'), cash);
            setNodeValue($('#pdCurrentDeposit'), currentDeposit);
            setNodeValue($('#pdTransferLimit'), transferLimit);

            $(document).clearQueue('Bank');
            let isDeposited = false;
            let diff = totalMoney - currentDeposit;
            if (diff > 0) {
                isDeposited = true;
                let $wait = Msg.wait('<strong>正在存款中&hellip;</strong>');
                saveOrDrawMoney('save', 1, diff, function (msg) {
                    Msg.remove($wait);
                    if (/完成存款/.test(msg)) {
                        setNodeValue($('#pdCash'), '-=' + diff);
                        setNodeValue($('#pdCurrentDeposit'), '+=' + diff);
                        setTimeout(() => $(document).dequeue('Bank'), Const.bankActionInterval);
                    }
                    else {
                        alert('存款失败');
                    }
                });
            }
            Msg.wait(
                `<strong>正在批量转账中，请耐心等待&hellip;</strong><i>剩余：<em class="pd_countdown">${users.length}</em></i>` +
                `<a class="pd_stop_action" href="#">停止操作</a>`
            );
            $area.find('> td:last-child').append('<ul class="pd_result pd_stat"><li><strong>转账结果：</strong></li></ul>');
            batchTransfer(users, msg, isDeposited);
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
            let $msg = Msg.show(
                `<strong>您的定期存款已到期，共产生利息<em>${interest.toLocaleString()}</em>KFB，是否前往银行取款？</strong><br>` +
                '<a class="pd_highlight" href="hack.php?H_name=bank">前往</a><a data-name="cancel" href="#">取消</a>',
                -1
            );
            $msg.find('[data-name="cancel"]').click(function (e) {
                e.preventDefault();
                $msg.click();
            });
            Script.runFunc('Bank.fixedDepositDueAlert_success_', {html, interest});
        }
    });
};

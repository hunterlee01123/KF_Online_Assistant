// ==UserScript==
// @name        在定期存款到期后自动取出利息
// @version     1.0
// @trigger     start
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13812235
// @description 在定期存款到期后自动取出利息，以便余下定期存款继续生效（需在助手设置界面开启“定期存款到期提醒”功能）
// ==/UserScript==
'use strict';
addFunc('Bank.fixedDepositDueAlert_success_', function (data) {
    const Msg = require('./Msg');
    const Bank = require('./Bank');

    let $wait = Msg.wait('<strong>正在取出利息&hellip;</strong>');
    Bank.saveOrDrawMoney('draw', 2, data.interest, function (msg) {
        Msg.remove($wait);
        if (msg.includes('完成取款')) {
            Msg.show('<strong>已成功将利息取出，余下定期存款可继续生效</strong>');
        }
        else {
            alert(msg);
        }
    });
});
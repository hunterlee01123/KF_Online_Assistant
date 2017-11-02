// ==UserScript==
// @name        在定期存款到期后自动存取款
// @version     2.0
// @trigger     start
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13812235
// @description 在定期存款到期后自动对定期账户进行存取款（需在助手设置界面开启“定期存款到期提醒”功能）
// ==/UserScript==
'use strict';
addFunc('Bank.fixedDepositDueAlert_success_', function (data) {
    // 操作类型，save：存款；draw：取款
    const type = 'draw';
    // 存取款金额，设为数字表示存取固定金额，如：'100'；设为cash XX%表示存取现金的指定百分比，如：'cash 50%'；
    // 设为interest表示存取跟利息同样的金额；设为fixed表示存取跟定期存款同样的金额；设为fixed+interest表示存取跟定期存款加利息同样的金额
    const money = 'interest';

    const Msg = require('./Msg');
    const Bank = require('./Bank');

    let realMoney = 0;
    if (money.startsWith('fixed')) {
        let matches = /定期存款：(\d+)KFB/.exec(data.html);
        if (!matches) return;
        realMoney = parseInt(matches[1]);
        if (money.endsWith('interest')) {
            realMoney += data.interest;
        }
    }
    else if (money === 'interest') {
        realMoney = parseInt(data.interest);
    }
    else if (money.startsWith('cash')) {
        let matches = /当前所持：(\d+)KFB/.exec(data.html);
        let percentMatches = /cash (\d+(?:\.\d+)?)%/.exec(money);
        if (!matches || !percentMatches) return;
        realMoney = Math.floor(parseInt(matches[1]) * parseFloat(percentMatches[1]) / 100);
    }
    else {
        realMoney = parseInt(money);
    }

    console.log(`正在${type === 'save' ? '存款' : '取款'}中，金额：${realMoney}`);
    let $wait = Msg.wait(`<strong>正在${type === 'save' ? '存款' : '取款'}中&hellip;</strong>`);
    Bank.saveOrDrawMoney(type, 2, realMoney, function (msg) {
        Msg.remove($wait);
        if (msg.includes('完成')) {
            Msg.show(`<strong>已成功${type === 'save' ? '存入' : '取出'}<em>${realMoney}</em>KFB</strong>`);
        }
        else {
            alert(msg);
        }
    });
});
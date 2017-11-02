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
    var type = 'draw';
    /**
     * 存取款金额
     * 设为 数字 表示存取固定金额，如：'100'
     * 设为 cash XX% 表示存取现金的指定百分比，如：'cash 50%'
     * 设为 interest 表示存取跟利息同样的金额
     * 设为 fixed 表示存取跟定期存款同样的金额
     * 设为 fixed+interest 表示存取跟定期存款加利息同样的金额
     */
    var money = 'interest';

    var Msg = require('./Msg');
    var Bank = require('./Bank');

    var realMoney = 0;
    if (money.startsWith('fixed')) {
        var matches = /定期存款：(\d+)KFB/.exec(data.html);
        if (!matches) return;
        realMoney = parseInt(matches[1]);
        if (money.endsWith('interest')) {
            realMoney += data.interest;
        }
    } else if (money === 'interest') {
        realMoney = parseInt(data.interest);
    } else if (money.startsWith('cash')) {
        var _matches = /当前所持：(\d+)KFB/.exec(data.html);
        var percentMatches = /cash (\d+(?:\.\d+)?)%/.exec(money);
        if (!_matches || !percentMatches) return;
        realMoney = Math.floor(parseInt(_matches[1]) * parseFloat(percentMatches[1]) / 100);
    } else {
        realMoney = parseInt(money);
    }

    console.log('\u6B63\u5728' + (type === 'save' ? '存款' : '取款') + '\u4E2D\uFF0C\u91D1\u989D\uFF1A' + realMoney);
    var $wait = Msg.wait('<strong>\u6B63\u5728' + (type === 'save' ? '存款' : '取款') + '\u4E2D&hellip;</strong>');
    Bank.saveOrDrawMoney(type, 2, realMoney, function (msg) {
        Msg.remove($wait);
        if (msg.includes('完成')) {
            Msg.show('<strong>\u5DF2\u6210\u529F' + (type === 'save' ? '存入' : '取出') + '<em>' + realMoney + '</em>KFB</strong>');
        } else {
            alert(msg);
        }
    });
});
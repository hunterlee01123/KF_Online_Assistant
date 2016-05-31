/**
 * 自定义道具类
 */
var CustomItem = {
    // 道具价格浮动的最低百分比
    minItemPricePercent: 0,
    // 道具价格浮动的最高百分比
    maxItemPricePercent: 200,

    // 自定义道具列表
    itemList: {
        /*
         * 自定义道具范例
         * id: { // 道具ID号
         *     level: 3, // 道具等级
         *     name: '测试道具', // 道具名称
         *     price: 233, // 道具价格
         *     intro: '这是一个自定义道具', // 道具介绍
         *     image: 'custom_item_1.jpg', // 道具图片
         *     notSell: true, // 是否禁止出售道具
         *     configName: 'rainbowSmColorEnabled', // 与Extra.Config相关联的、标识道具是否使用的配置项的名称
         *     configValue: true, // 标识道具已使用的配置项的值，设为*表示可以为任意值
         *     resAlert: true, // 是否对图片资源可用性进行提示
         *     // 使用道具时所执行的方法
         *     use: function () {
         *         Extra.Config[this.configName] = this.configValue;
         *         KFOL.showMsg('<strong>使用自定义道具时所显示的消息</strong>', -1);
         *     },
         *     // 还原道具使用效果时所执行的方法
         *     cancel: function () {
         *         KFOL.showMsg('<strong>还原道具使用效果时所显示的消息</strong>', -1);
         *     }
         * },
         */
        1: {
            level: 3,
            name: '神秘彩虹',
            price: 233,
            intro: '可将自己的神秘颜色变换成彩虹色，让你拥有超越一般玩家的尊贵身份！<br /><span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_1.jpg',
            configName: 'rainbowSmColorEnabled',
            configValue: true,
            resAlert: true,
            use: function () {
                Extra.Config[this.configName] = this.configValue;
                KFOL.showMsg('<strong>雨过天晴，彩虹小马们欢快的飞过天空，架起一道神秘的彩虹，哦卖力头破你~~</strong>', -1);
            },
            cancel: function () {
                KFOL.showMsg('<strong>虚幻的彩虹总是短暂的，天空中已不见彩虹小马们玩乐的身影，那道神秘的彩虹也再无踪迹……</strong>', -1);
            }
        },
        2: {
            level: 3,
            name: '猫耳',
            price: 233,
            intro: '这里有一对猫耳，戴上去就能变成一只猫，喵~~~<br />给你自己的头像戴上一对猫耳<span class="pd_highlight">（仅限卡片或140px宽度的图像）</span><br />' +
            '<span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_2.jpg',
            configName: 'nekoMiMiAvatarEnabled',
            configValue: true,
            resAlert: true,
            use: function () {
                Extra.Config[this.configName] = this.configValue;
                KFOL.showMsg('<strong>咦？地上放着一对猫耳，戴上去试试看？</strong><br />……喵？喵喵喵~~~', -1);
            },
            cancel: function () {
                KFOL.showMsg('<strong>你依依不舍地摘下了猫耳，重新变回了人类……</strong>', -1);
            }
        },
        3: {
            level: 5,
            name: '其实整个KF只有我一个人',
            price: 6666,
            intro: '少年（少女），其实整个KF只有你一个人，你相信吗？<br />纳尼？你不信？那就试试吧，到时候别哭喊着“妈妈，我再也不想一个人玩了”就好了~~',
            image: 'custom_item_3.jpg',
            configName: 'kfOnlyYouEnabled',
            configValue: true,
            use: function () {
                Extra.Config[this.configName] = this.configValue;
                KFOL.showMsg(
                    '<strong>少年（少女），告诉你个秘密：</strong><br />其实整个KF只有你一个人，我们都是你臆想出来的人格，KF上所有的会员其实都是你<br />' +
                    '我们已经骗了你好久，是时候向你展现真相了……'
                    , -1
                );
            },
            cancel: function () {
                KFOL.showMsg('<strong>“妈妈，我再也不想一个人玩了！”</strong><br />你的精神分裂症治好了，KF再次恢复为平日的模样', -1);
            }
        },
        4: {
            level: 3,
            name: '逆天改命符',
            price: 233,
            intro: '对自己如此low的神秘等级感到不甘心？觉得MAX等级无法体现自己的逼格？<br />快来试试逆天改命符吧！可将自己的神秘等级改成任意字符！<br />' +
            '<span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_4.jpg',
            configName: 'customSmLevel',
            configValue: '*',
            use: function () {
                var smLevel = $.trim(window.prompt('请输入你想自定义的神秘等级（普通头像最多限8个字符，卡片头像最多限5个字符）：'));
                if (!smLevel) return false;
                var type = window.confirm('是否只在帖子页面里修改神秘等级？否则将在所有可能的页面里修改') ? 1 : 0;
                smLevel = smLevel.substr(0, 8);
                Extra.Config[this.configName] = smLevel;
                Extra.Config.customSmLevelType = type;
                KFOL.showMsg('<strong>凡人，汝还妄图逆天改命？</strong><br />……嗯，看汝还算心诚，改改命也无不可……', -1);
            },
            cancel: function () {
                KFOL.showMsg('<strong>逆天改命终违天道，你被打回了原型……</strong>', -1);
            }
        },
        5: {
            level: 5,
            name: '灰企鹅之友',
            price: 6666,
            intro: '你将获得灰企鹅的友谊，能够与灰企鹅进行沟通，并可对灰企鹅们进行指挥。<br />可在帖子页面任意操纵灰企鹅表情，请尽情发挥你的想象力吧！<br />' +
            '注：双击灰企鹅表情可弹出菜单<br /><span class="pd_highlight">（移动浏览器可能不适用）</span>',
            image: 'custom_item_5.jpg',
            configName: 'grayPenguinFriendEnabled',
            configValue: true,
            use: function () {
                Extra.Config[this.configName] = this.configValue;
                KFOL.showMsg('<strong>你帮助了迷路的小灰企鹅，将其送回家，从此获得了灰企鹅们的友谊！</strong>', -1);
            },
            cancel: function () {
                KFOL.showMsg('<strong>友谊的小船说翻就翻，你和灰企鹅从此友尽了……</strong>', -1);
            }
        },
        6: {
            level: 4,
            name: 'KF表情增强插件',
            price: 998,
            onlyInMiaolaDomain: true,
            intro: '看腻了单调的表情？想在论坛上使用更多更有趣的表情？快来试试KF表情增强插件吧！<br />' +
            '<span class="pd_highlight">（由<a target="_blank" href="profile.php?action=show&uid=116467">eddie32</a>开发）</span>',
            image: 'custom_item_6.jpg',
            configName: 'kfSmileEnhanceExtensionEnabled',
            configValue: true,
            use: function () {
                Extra.Config[this.configName] = this.configValue;
                KFOL.showMsg('<strong>一大堆表情从天而降，你开始日日夜夜地磨练表情技能……</strong>', -1);
            },
            cancel: function () {
                KFOL.showMsg('<strong>表情技能的修炼暂告一段落，你暂时休息去了……</strong>', -1);
            }
        },
    },

    /**
     * 购买指定的道具种类ID的自定义道具
     * @param {number} itemTypeId 指定的道具种类ID
     * @param {{}} item 指定的自定义道具类
     */
    buyItem: function (itemTypeId, item) {
        var buyPrice = Math.round(item.price * (Math.random() * (CustomItem.maxItemPricePercent - CustomItem.minItemPricePercent) +
            CustomItem.minItemPricePercent) / 100);
        Extra.Config.jieCao -= buyPrice;
        Extra.Config.myItemList[itemTypeId] = {buyTime: new Date().getTime(), buyPrice: buyPrice};
        Extra.writeConfig();
        if (location.pathname === '/kf_fw_ig_my.php') CustomItem.showItemInfo(itemTypeId);
        else $('.pd_jiecao_num').text(Extra.Config.jieCao);
        console.log('【Lv.{0}：{1}】道具购买成功，节操-{2} ({3}%)'
            .replace('{0}', item.level)
            .replace('{1}', item.name)
            .replace('{2}', buyPrice)
            .replace('{3}', Math.round(buyPrice / item.price * 100))
        );
        KFOL.showMsg(
            '<strong>【<em>Lv.{0}</em>{1}】道具购买成功</strong><i>节操<ins>-{2} ({3}%)</ins></i>'
                .replace('{0}', item.level)
                .replace('{1}', item.name)
                .replace('{2}', buyPrice)
                .replace('{3}', Math.round(buyPrice / item.price * 100))
            , -1);
    },

    /**
     * 出售指定的道具种类ID的自定义道具
     * @param {number} itemTypeId 指定的道具种类ID
     * @param {{}} item 指定的自定义道具类
     */
    sellItem: function (itemTypeId, item) {
        Extra.Config[item.configName] = Extra.defConfig[item.configName];
        delete Extra.Config.myItemList[itemTypeId];
        var sellPrice = Math.round(item.price * (Math.random() * (CustomItem.maxItemPricePercent - CustomItem.minItemPricePercent) +
            CustomItem.minItemPricePercent) / 100);
        Extra.Config.jieCao += sellPrice;
        Extra.writeConfig();
        if (location.pathname === '/kf_fw_ig_my.php') CustomItem.showItemInfo(itemTypeId);
        else $('.pd_jiecao_num').text(Extra.Config.jieCao);
        console.log('【Lv.{0}：{1}】道具出售成功，节操+{2} ({3}%)'
            .replace('{0}', item.level)
            .replace('{1}', item.name)
            .replace('{2}', sellPrice)
            .replace('{3}', Math.round(sellPrice / item.price * 100))
        );
        KFOL.showMsg('<strong>【<em>Lv.{0}</em>{1}】道具出售成功</strong><i>节操<em>+{2} ({3}%)</em></i>'
                .replace('{0}', item.level)
                .replace('{1}', item.name)
                .replace('{2}', sellPrice)
                .replace('{3}', Math.round(sellPrice / item.price * 100))
            , -1);
    },

    /**
     * 显示指定的自定义道具的详细信息
     * @param {number} itemTypeId 指定的道具种类ID
     */
    showItemInfo: function (itemTypeId) {
        if (!itemTypeId) return;
        var item = CustomItem.itemList[itemTypeId];
        if (!item || item.onlyInMiaolaDomain && !Extra.isInMiaolaDomain) return;
        var configValue = Extra.Config[item.configName];
        var isUsed = (configValue && item.configValue === '*') || configValue === item.configValue;
        var myItem = Extra.Config.myItemList[itemTypeId];
        var $node = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').html(
            '<span style="color:#00F">道具名称：{0}</span><br />'.replace('{0}', item.name) +
            '道具等级：{0}级道具<br />'.replace('{0}', item.level) +
            item.intro +
            (item.resAlert ? '<br /><span style="color:#666">注：如未在此段文字末尾看见一个打钩的图片（或图片载入很慢），说明你可能难以连接上存放图片资源的服务器，此道具的效果将可能无法看见，' +
            '<a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98Extra#2">详情请参见问题2</a></span> ' +
            '<img style="width:16px;height:16px;vertical-align:middle" src="{0}img/check.png" alt="[载入中...]" />'.replace('{0}', Extra.resHostUrl) : '') +
            '<br /><br />' +
            '<span style="color:#00F">现持有者：{0}</span><br />'.replace('{0}', myItem ? KFOL.userName : '布丁道具商店') +
            '使用状态：<span class="pd_custom_item_is_used" style="color:{0}">{1}</span><br />'
                .replace('{0}', isUsed ? '#999' : '#090')
                .replace('{1}', isUsed ? '已使用' : '未使用') +
            '交易类型：' + (item.notSell ? '<span style="color:#999">无法交易</span>' : '<span style="color:#090">可以交易</span>') + '<br />' +
            '当前市场价：{0} 节操<br />'.replace('{0}', item.price)
        );
        if (myItem) {
            $('<span>购入价格：{0} 节操</span><br />'.replace('{0}', myItem.buyPrice) +
                '<div>' +
                (isUsed ? '[<a class="pd_highlight" href="#">还原此道具使用效果</a>]' : '[<a href="#">使用此道具</a>]') +
                (item.notSell ? '' : ' | [<a href="#">出售此道具</a>]') +
                '</div>'
            ).appendTo($node)
                .find('a')
                .click(function (e) {
                    e.preventDefault();
                    Extra.readConfig();
                    if (!Extra.Config.myItemList[itemTypeId]) {
                        alert('你尚未购买此道具');
                        return;
                    }
                    var $this = $(this);
                    var text = $this.text();
                    if (text.indexOf('出售') > -1) {
                        if (window.confirm('是否出售此道具？\n（出售道具后使用道具的效果也将一并还原）')) {
                            CustomItem.sellItem(itemTypeId, item);
                        }
                    }
                    else if (text.indexOf('还原') > -1) {
                        if (item.cancel() === false) return;
                        Extra.Config[item.configName] = Extra.defConfig[item.configName];
                        $this.text('使用此道具').removeClass('pd_highlight');
                        $('.pd_custom_item_is_used').text('未使用').css('color', '#090');
                        Extra.writeConfig();
                    }
                    else {
                        if (item.use() === false) return;
                        $this.text('还原此道具使用效果').addClass('pd_highlight');
                        $('.pd_custom_item_is_used').text('已使用').css('color', '#999');
                        Extra.writeConfig();
                    }
                });
        }
        else {
            $('<div>[<a href="#">购买此道具</a>]</div>')
                .appendTo($node)
                .find('a')
                .click(function (e) {
                    e.preventDefault();
                    Extra.readConfig();
                    if (Extra.Config.myItemList[itemTypeId]) {
                        alert('你已购买过此道具');
                        return;
                    }
                    if (Extra.Config.jieCao < item.price * 2) {
                        alert('你当前的节操值不足此道具市场价的两倍');
                        return;
                    }
                    if (!window.confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', item.level).replace('{1}', item.name))) return;
                    CustomItem.buyItem(itemTypeId, item);
                });
        }
        $node.prev('td').find('img').attr('src', Extra.resHostUrl + 'img/' + item.image);
        $node.parent('tr').next('tr').find('td').html(
            myItem ? '[历史记载]<br />本道具于{0}被{1}取得。'.replace('{0}', Tools.getDateString(new Date(myItem.buyTime))).replace('{1}', KFOL.userName) : ''
        );
    },

    /**
     * 添加自定义道具商店
     */
    addItemShop: function () {
        var itemList = [];
        for (var itemTypeId in CustomItem.itemList) {
            var obj = CustomItem.itemList[itemTypeId];
            obj.itemTypeId = itemTypeId;
            itemList.push(obj);
        }
        itemList.sort(function (a, b) {
            return a.level > b.level;
        });
        var myItemList = Extra.Config.myItemList;
        var itemListHtml = '';
        $.each(itemList, function (index, item) {
            if (item.onlyInMiaolaDomain && !Extra.isInMiaolaDomain) return;
            var isOwn = $.type(myItemList[item.itemTypeId]) === 'object';
            itemListHtml +=
                '<tr data-item_type_id="{0}">'.replace('{0}', item.itemTypeId) +
                ('  <td>{0}</td><td><a href="kf_fw_ig_my.php?pro=1000888&pd_typeid={1}">{2}</a></td><td style="color:{3}">{4}</td><td>{5} 节操</td>' +
                '<td class="pd_custom_tips" title="{6}~{7}（均价：{8}）">{9}%~{10}%</td><td><a href="#">购买</a><a class="{11}" style="margin-left:15px" href="#">出售</a></td>')
                    .replace('{0}', item.level)
                    .replace('{1}', item.itemTypeId)
                    .replace('{2}', item.name)
                    .replace('{3}', isOwn ? '#669933' : '#FF0033')
                    .replace('{4}', isOwn ? '是' : '否')
                    .replace('{5}', item.price)
                    .replace('{6}', Math.round(item.price * CustomItem.minItemPricePercent / 100))
                    .replace('{7}', Math.round(item.price * CustomItem.maxItemPricePercent / 100))
                    .replace('{8}', Math.round(item.price * (CustomItem.maxItemPricePercent - CustomItem.minItemPricePercent) / 2 / 100))
                    .replace('{9}', CustomItem.minItemPricePercent)
                    .replace('{10}', CustomItem.maxItemPricePercent)
                    .replace('{11}', item.notSell ? 'pd_disabled_link' : '') +
                '</tr>';
        });

        var $itemShop = $(
            '<div>' +
            '<div class="pd_custom_item_shop_title">布丁道具商店 ' +
            '(当前持有 <b title="一种并没有什么卵用、随时可以丢掉的的东西（不Click试试么？）" class="pd_jiecao_num" style="font-size:14px;cursor:pointer">{0}</b> 节操)</div>'
                .replace('{0}', Extra.Config.jieCao) +
            '<table class="pd_custom_item_shop" cellpadding="0" cellspacing="0">' +
            '  <tbody>' +
            '    <tr>' +
            '      <td colspan="6">由喵拉布丁开设的<b>良心</b>道具商店，<strike>与↑上面的那家黑店截然不同</strike>，宗旨是为各位KFer服务，只需付出少许节操即可获得强力的氪金道具。<br />' +
            '由于新店刚开张，道具种类暂时较少，以后将推出更多新品，敬请期待！<br />' +
            '<strike>（友情提醒：↑上面那家是黑店，切勿听信该店老板XX风的花言巧语，否则必将付出惨痛的代价！）</strike></td>' +
            '    </tr>' +
            '    <tr>' +
            '      <th style="width:100px">道具等级</th><th style="width:220px">道具名称</th><th style="width:90px">是否持有</th>' +
            '<th style="width:150px">当前市场价</th><th style="width:150px">价格浮动</th><th style="width:150px">详细</th>' +
            '    </tr>' +
            itemListHtml +
            '  </tbody>' +
            '</table>' +
            '</div>'
        ).insertAfter($('.kf_fw_ig1:last').parent());

        $itemShop.on('click', 'td:last-child > a', function (e) {
            e.preventDefault();
            var $this = $(this);
            var itemTypeId = parseInt($this.closest('tr').data('item_type_id'));
            if (!itemTypeId) return;
            var item = CustomItem.itemList[itemTypeId];
            if (!item) return;
            Extra.readConfig();
            var myItem = Extra.Config.myItemList[itemTypeId];
            if ($this.text() === '出售') {
                if (item.notSell) return;
                if (!myItem) {
                    alert('你尚未购买此道具');
                    return;
                }
                var isAlerted = $this.data('sell_alerted');
                if (!isAlerted && !window.confirm('是否出售【Lv.{0}：{1}】道具？\n（出售道具后使用道具的效果也将一并还原）'.replace('{0}', item.level).replace('{1}', item.name)))
                    return;
                $this.data('sell_alerted', true);
                CustomItem.sellItem(itemTypeId, item);
                $this.closest('tr').find('td:nth-child(3)').css('color', '#FF0033').text('否');
            }
            else {
                if (myItem) {
                    alert('你已购买过此道具');
                    return;
                }
                if (Extra.Config.jieCao < item.price * 2) {
                    alert('你当前的节操值不足此道具市场价的两倍');
                    return;
                }
                var isAlerted = $this.data('buy_alerted');
                if (!isAlerted && !window.confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', item.level).replace('{1}', item.name))) return;
                $this.data('buy_alerted', true);
                CustomItem.buyItem(itemTypeId, item);
                $this.closest('tr').find('td:nth-child(3)').css('color', '#669933').text('是');
            }
        }).on('click', '.pd_jiecao_num', function () {
            var $this = $(this);
            var clickCount = parseInt($this.data('click_count'));
            if (!clickCount) clickCount = 1;
            if (clickCount >= 5) {
                $this.removeData('click_count');
                if (window.confirm('是否将节操值重置为{0}？'.replace('{0}', Extra.defConfig.jieCao))) {
                    Extra.readConfig();
                    Extra.Config.jieCao = Extra.defConfig.jieCao;
                    Extra.writeConfig();
                    $('.pd_jiecao_num').text(Extra.Config.jieCao);
                    alert('你的节操值已重置');
                }
            }
            else {
                $this.data('click_count', clickCount + 1);
            }
        });
    }
};
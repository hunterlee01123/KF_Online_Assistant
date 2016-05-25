// ==UserScript==
// @name        KF Online助手 Extra
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KF Online助手的额外脚本，可提供更丰富的玩法（需配合KFOL助手使用，请先安装KFOL助手再安装此脚本）
// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/Extra.meta.js
// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/Extra.user.js
// @require     https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/jquery-ui.custom.min.js
// @include     http://*2dgal.com/*
// @include     http://*ddgal.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     2.0.0-dev
// @grant       none
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// ==/UserScript==
// Extra版本号
var extraVersion = '2.0.0';
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
        1: {
            level: 3,
            name: '神秘彩虹',
            price: 233,
            canSell: true,
            intro: '可将自己的神秘颜色变换成彩虹色，让你拥有超越一般玩家的尊贵身份！<br /><span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_1.jpg',
            configName: 'rainbowSmColorEnabled',
            configValue: true,
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
            canSell: true,
            intro: '这里有一对猫耳，戴上去就能变成一只猫，喵~~~<br />给你自己的头像戴上一对猫耳<span class="pd_highlight">（仅限卡片或140px宽度的图像）</span><br />' +
            '<span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_2.jpg',
            configName: 'nekoMiMiAvatarEnabled',
            configValue: true,
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
            canSell: true,
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
            canSell: true,
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
    },

    /**
     * 获取我的自定义道具列表
     * @returns {{}} 我的自定义道具列表
     */
    getMyItemList: function () {
        var myItemList = TmpLog.getValue(Const.myCustomItemTmpLogName);
        if ($.type(myItemList) !== 'object') myItemList = {};
        return myItemList;
    },

    /**
     * 获取我的自定义道具列表中指定的道具种类ID的道具信息
     * @param {number} itemTypeId 指定的道具种类ID
     * @returns {?{}} 指定的道具种类ID的自定义道具信息
     */
    getMyItem: function (itemTypeId) {
        var myItemList = CustomItem.getMyItemList();
        var myItem = null;
        if ($.type(myItemList[itemTypeId]) === 'object') myItem = myItemList[itemTypeId];
        return myItem;
    },

    /**
     * 将指定的道具种类ID的道具信息写入我的自定义道具列表中
     * @param {number} itemTypeId 指定的道具种类ID
     * @param {{}} myItem 我的自定义道具信息
     */
    setMyItem: function (itemTypeId, myItem) {
        var myItemList = CustomItem.getMyItemList();
        myItemList[itemTypeId] = myItem;
        TmpLog.setValue(Const.myCustomItemTmpLogName, myItemList);
    },

    /**
     * 购买指定的道具种类ID的自定义道具
     * @param {number} itemTypeId 指定的道具种类ID
     * @param {{}} item 指定的自定义道具类
     * @param {number} jieCao 当前节操值
     */
    buyItem: function (itemTypeId, item, jieCao) {
        var buyPrice = Math.round(item.price * (Math.random() * (CustomItem.maxItemPricePercent - CustomItem.minItemPricePercent) +
            CustomItem.minItemPricePercent) / 100);
        jieCao -= buyPrice;
        Extra.setJieCao(jieCao);
        CustomItem.setMyItem(itemTypeId, {buyTime: new Date().getTime(), buyPrice: buyPrice});
        if (location.pathname === '/kf_fw_ig_my.php') CustomItem.showItemInfo(itemTypeId);
        else $('.pd_jiecao_num').text(jieCao);
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
        Extra.readConfig();
        if (Extra.Config[item.configName] !== Extra.defConfig[item.configName]) {
            Extra.Config[item.configName] = Extra.defConfig[item.configName];
            Extra.writeConfig();
        }
        var myItemList = CustomItem.getMyItemList();
        delete myItemList[itemTypeId];
        if ($.isEmptyObject(myItemList))
            TmpLog.deleteValue(Const.myCustomItemTmpLogName);
        else
            TmpLog.setValue(Const.myCustomItemTmpLogName, myItemList);
        var sellPrice = Math.round(item.price * (Math.random() * (CustomItem.maxItemPricePercent - CustomItem.minItemPricePercent) +
            CustomItem.minItemPricePercent) / 100);
        var jieCao = Extra.getJieCao() + sellPrice;
        Extra.setJieCao(jieCao);
        if (location.pathname === '/kf_fw_ig_my.php') CustomItem.showItemInfo(itemTypeId);
        else $('.pd_jiecao_num').text(jieCao);
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
        if (!item) return;
        var configValue = Extra.Config[item.configName];
        var isUsed = (configValue && item.configValue === '*') || configValue === item.configValue;
        var myItem = CustomItem.getMyItem(itemTypeId);
        var $node = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').html(
            '<span style="color:#00F">道具名称：{0}</span><br />'.replace('{0}', item.name) +
            '道具等级：{0}级道具<br />'.replace('{0}', item.level) +
            item.intro +
            '<br /><br />' +
            '<span style="color:#00F">现持有者：{0}</span><br />'.replace('{0}', myItem ? KFOL.userName : '布丁道具商店') +
            '使用状态：<span class="pd_custom_item_is_used" style="color:{0}">{1}</span><br />'
                .replace('{0}', isUsed ? '#999' : '#090')
                .replace('{1}', isUsed ? '已使用' : '未使用') +
            '交易类型：' + (item.canSell ? '<span style="color:#090">可以交易</span>' : '<span style="color:#999">无法交易</span>') + '<br />' +
            '当前市场价：{0} 节操<br />'.replace('{0}', item.price)
        );
        if (myItem) {
            $('<span>购入价格：{0} 节操</span><br />'.replace('{0}', myItem.buyPrice) +
                '<div>' +
                (isUsed ? '[<a class="pd_highlight" href="#">还原此道具使用效果</a>]' : '[<a href="#">使用此道具</a>]') +
                (item.canSell ? ' | [<a href="#">出售此道具</a>]' : '') +
                '</div>'
            ).appendTo($node)
                .find('a')
                .click(function (e) {
                    e.preventDefault();
                    if (!CustomItem.getMyItem(itemTypeId)) {
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
                        Extra.readConfig();
                        if (item.cancel() === false) return;
                        Extra.Config[item.configName] = Extra.defConfig[item.configName];
                        $this.text('使用此道具').removeClass('pd_highlight');
                        $('.pd_custom_item_is_used').text('未使用').css('color', '#090');
                        Extra.writeConfig();
                    }
                    else {
                        Extra.readConfig();
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
                    if (myItem) {
                        alert('你已购买过此道具');
                        return;
                    }
                    var jieCao = Extra.getJieCao();
                    if (jieCao < item.price * 2) {
                        alert('你当前的节操值不足此道具市场价的两倍');
                        return;
                    }
                    if (!window.confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', item.level).replace('{1}', item.name))) return;
                    CustomItem.buyItem(itemTypeId, item, jieCao);
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
        var myItemList = CustomItem.getMyItemList();
        var itemListHtml = '';
        $.each(itemList, function (index, item) {
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
                    .replace('{11}', item.canSell ? '' : 'pd_disabled_link') +
                '</tr>';
        });

        var $itemShop = $(
            '<div>' +
            '<div class="pd_custom_item_shop_title">布丁道具商店 ' +
            '(当前持有 <b title="一种并没有什么卵用、随时可以丢掉的的东西（不Click试试么？）" class="pd_jiecao_num" style="font-size:14px;cursor:pointer">{0}</b> 节操)</div>'
                .replace('{0}', Extra.getJieCao()) +
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
            var myItem = CustomItem.getMyItem(itemTypeId);
            if ($this.text() === '出售') {
                if (!item.canSell) return;
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
                var jieCao = Extra.getJieCao();
                if (jieCao < item.price * 2) {
                    alert('你当前的节操值不足此道具市场价的两倍');
                    return;
                }
                var isAlerted = $this.data('buy_alerted');
                if (!isAlerted && !window.confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', item.level).replace('{1}', item.name))) return;
                $this.data('buy_alerted', true);
                CustomItem.buyItem(itemTypeId, item, jieCao);
                $this.closest('tr').find('td:nth-child(3)').css('color', '#669933').text('是');
            }
        }).on('click', '.pd_jiecao_num', function () {
            var $this = $(this);
            var clickCount = parseInt($this.data('click_count'));
            if (!clickCount) clickCount = 1;
            if (clickCount >= 5) {
                $this.removeData('click_count');
                if (window.confirm('是否将节操值重置为{0}？'.replace('{0}', Extra.defJieCao))) {
                    TmpLog.deleteValue(Const.jieCaoTmpLogName);
                    $('.pd_jiecao_num').text(Extra.defJieCao);
                    alert('你的节操值已重置');
                }
            }
            else {
                $this.data('click_count', clickCount + 1);
            }
        });
    },
};

/**
 * 额外脚本类
 */
var Extra = {
    /**
     * Extra配置类
     */
    Config: {
        // 是否开启多彩神秘颜色，true：开启；false：关闭
        rainbowSmColorEnabled: false,
        // 是否为头像加上猫耳，true：开启；false：关闭
        nekoMiMiAvatarEnabled: false,
        // 是否进入【其实整个KF只有我一个人】模式，true：开启；false：关闭
        kfOnlyYouEnabled: false,
        // 【其实整个KF只有我一个人】模式的排除用户列表，例：['信仰风','喵拉布丁']
        kfOnlyYouExcludeUserList: [],
        // 自定义自己的神秘等级，例：MAX
        customSmLevel: '',
        // 在哪些页面自定义自己的神秘等级的类型，0：在所有可能的页面；1：只在帖子页面
        customSmLevelType: 0,
    },

    // 保存设置的键值名称
    configName: 'pd_extra_config',
    // 默认的Extra Config对象
    defConfig: {},
    // 当前域名是否在miaola.info下
    isInMiaolaDomain: location.host.indexOf('miaola.info') > -1,
    // 存放资源的URL，备选：https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/res/
    resHostUrl: 'https://kf.miaola.info/res/',
    // 初始的节操值
    defJieCao: 50000,
    // 多彩神秘颜色的默认用户列表
    defRainbowSmColorUseList: ['信仰风', '喵拉布丁'],
    // 为头像加上猫耳的默认用户列表
    defNekoMiMiUseList: ['信仰风', '喵拉布丁'],
    // 其实整个KF只有我一个人】模式的默认的排除用户列表
    defKfOnlyYouExcludeUserList: ['SYSTEM'],

    /**
     * 初始化
     */
    initConfig: function () {
        $.extend(true, Extra.defConfig, Extra.Config);
        Extra.readConfig();
    },

    /**
     * 读取设置
     */
    readConfig: function () {
        var options = localStorage.getItem(Extra.configName);
        if (!options) return;
        try {
            options = JSON.parse(options);
        }
        catch (ex) {
            return;
        }
        if (!options || $.type(options) !== 'object' || $.isEmptyObject(options)) return;
        options = Extra.normalizeConfig(options);
        Extra.Config = $.extend(true, {}, Extra.defConfig, options);
    },

    /**
     * 写入设置
     */
    writeConfig: function () {
        var options = Tools.getDifferentValueOfObject(Extra.defConfig, Extra.Config);
        localStorage.setItem(Extra.configName, JSON.stringify(options));
    },

    /**
     * 清空设置
     */
    clearConfig: function () {
        localStorage.removeItem(Extra.configName);
    },

    /**
     * 获取经过规范化的Config对象
     * @param {Extra.Config} options 待处理的Config对象
     * @returns {Extra.Config} 经过规范化的Config对象
     */
    normalizeConfig: function (options) {
        var settings = {};
        var defConfig = Extra.defConfig;
        if ($.type(options) !== 'object') return settings;

        if (typeof options.rainbowSmColorEnabled !== 'undefined') {
            settings.rainbowSmColorEnabled = typeof options.rainbowSmColorEnabled === 'boolean' ?
                options.rainbowSmColorEnabled : defConfig.rainbowSmColorEnabled;
        }
        if (typeof options.nekoMiMiAvatarEnabled !== 'undefined') {
            settings.nekoMiMiAvatarEnabled = typeof options.nekoMiMiAvatarEnabled === 'boolean' ?
                options.nekoMiMiAvatarEnabled : defConfig.nekoMiMiAvatarEnabled;
        }
        if (typeof options.kfOnlyYouEnabled !== 'undefined') {
            settings.kfOnlyYouEnabled = typeof options.kfOnlyYouEnabled === 'boolean' ?
                options.kfOnlyYouEnabled : defConfig.kfOnlyYouEnabled;
        }
        if (typeof options.kfOnlyYouExcludeUserList !== 'undefined') {
            if ($.isArray(options.kfOnlyYouExcludeUserList)) settings.kfOnlyYouExcludeUserList = options.kfOnlyYouExcludeUserList;
            else settings.kfOnlyYouExcludeUserList = defConfig.kfOnlyYouExcludeUserList;
        }
        if (typeof options.customSmLevel !== 'undefined') {
            var customSmLevel = $.trim(options.customSmLevel);
            if (customSmLevel) settings.customSmLevel = customSmLevel;
            else settings.customSmLevel = defConfig.options.customSmLevel;
        }
        if (typeof options.customSmLevelType !== 'undefined') {
            if (options.customSmLevelType && $.type(options.customSmLevelType) === 'number') settings.customSmLevelType = parseInt(options.customSmLevelType);
            else settings.customSmLevelType = defConfig.options.customSmLevelType;
        }

        return settings;
    },

    /**
     * 准备操作
     */
    prepare: function () {
        Extra.version = extraVersion;
        KFOL.window.Extra = Extra;
        KFOL.window.CustomItem = CustomItem;
        // 我的节操值的临时日志名称
        Const.jieCaoTmpLogName = 'JieCao';
        // 我的自定义道具的临时日志名称
        Const.myCustomItemTmpLogName = 'MyCustomItem';
    },

    /**
     * 添加CSS样式
     */
    appendCss: function () {
        $('head').append(
            '<style type="text/css">' +
            '.pd_nekomimi { position: absolute; opacity: 0.95; cursor: pointer; }' +
            '#r_menu { z-index: 1; }' +
            '.readtext { overflow-x: visible; }' +

            /* 自定义道具商店 */
            '.pd_custom_item_shop_title { color: #FFF; background-color: #9999FF; padding: 5px; margin-top: 10px; }' +
            '.pd_custom_item_shop { width: 860px; border-top: 1px solid #9999FF; border-right: 1px solid #9999FF; }' +
            '.pd_custom_item_shop th, .pd_custom_item_shop td {' +
            '  text-align: left; font-weight: normal; height: 30px; border-bottom: 1px solid #9999FF; border-left: 1px solid #9999FF; line-height: 24px; padding: 5px;' +
            '}' +
            '.pd_custom_item_shop td:nth-child(4), .pd_custom_item_shop td:nth-child(5) { font-size: 14px; }' +
            '</style>'
        );
    },

    /**
     * 在设置界面上添加Extra脚本的版本信息
     */
    addVersionInfoInConfigDialog: function () {
        Func.add('ConfigDialog.show_after_', function () {
            if (Extra.version) {
                $('#pd_config .pd_cfg_about').append(
                    '<span style="color:#666"> | <a target="_blank" href="read.php?tid=553895">Extra</a> (V{0})</span>'.replace('{0}', Extra.version)
                );
            }
        });
    },

    /**
     * 执行Extra自定义脚本
     * @param {number} type 脚本类型，1：脚本开始时执行；2：脚本结束时执行
     */
    runCustomScript: function (type) {
        var script = '';
        if (type === 2) script = KFOL.window.extraCustomScriptStartFunc;
        else script = KFOL.window.extraCustomScriptEndFunc;
        if (typeof script === 'function') {
            try {
                script();
            }
            catch (ex) {
                console.log(ex);
            }
        }
    },

    /**
     * 获取当前持有的节操值
     * @returns {number} 节操值
     */
    getJieCao: function () {
        var jieCao = parseInt(TmpLog.getValue(Const.jieCaoTmpLogName));
        if (isNaN(jieCao)) jieCao = Extra.defJieCao;
        if (jieCao < 0) jieCao = 0;
        return jieCao;
    },

    /**
     * 写入当前持有的节操值
     * @param {number} jieCao
     */
    setJieCao: function (jieCao) {
        TmpLog.setValue(Const.jieCaoTmpLogName, jieCao);
    },

    /**
     * 多彩神秘颜色
     */
    modifyRainbowSmColor: function () {
        var userList = Extra.defRainbowSmColorUseList;
        if (Extra.Config.rainbowSmColorEnabled) userList.push(KFOL.userName);
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            if ($.inArray($this.text(), userList) === -1 && Math.floor(Math.random() * 100) !== 39) return;
            var css = 'url("{0}img/{filename}") 1 stretch'.replace('{0}', Extra.resHostUrl);
            $this.closest('.readtext').css('border-image', css.replace('{filename}', 'border_rainbow_middle.png'))
                .prev('.readlou').css('border-image', css.replace('{filename}', 'border_rainbow_top.png'))
                .next().next('.readlou').css('border-image', css.replace('{filename}', 'border_rainbow_bottom.png'));
        });
    },

    /**
     * 为头像加上猫耳
     */
    addNekoMiMiAboveAvatar: function () {
        var userList = Extra.defNekoMiMiUseList;
        if (Extra.Config.nekoMiMiAvatarEnabled) userList.push(KFOL.userName);
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            if ($.inArray($this.text(), userList) === -1 && Math.floor(Math.random() * 100) !== 67) return;
            var $parent = $this.parent();
            var type = 1;
            if ($parent.is('.readidmleft')) type = 2;
            var $avatar = null;
            if (type === 2) $avatar = $parent.closest('.readidm');
            else $avatar = $parent.prev('.readidmstop').find('img.pic');
            if (!$avatar || !$avatar.length || /none\.gif$/.test($avatar.attr('src'))) return;
            if (type === 1 && parseInt($avatar.attr('width')) !== 140) return;
            var $nekoMiMi = $('<img class="pd_nekomimi" src="{0}img/nekomimi_{1}.png" />'.replace('{0}', Extra.resHostUrl).replace('{1}', type));
            if (type === 2) {
                $nekoMiMi.prependTo($avatar).css('top', -29).css('left', -1);
                $avatar.css('position', 'relative').css('overflow', 'visible').closest('.readtext').css('overflow-x', 'visible');
            }
            else {
                $nekoMiMi.insertBefore($avatar).css('top', -22).css('left', 16);
                $avatar.parent('.readidmstop').css('position', 'relative').closest('.readtext').css('overflow-x', 'visible');
            }
        });
        if ($('.pd_nekomimi').length > 0) {
            $(document).on('click', '.pd_nekomimi', function () {
                var $nekoMiMiVoice = $('#pd_nekomimi_voice');
                if ($nekoMiMiVoice.length > 0) {
                    $nekoMiMiVoice.get(0).play();
                }
                else {
                    $('body').append(
                        '<audio id="pd_nekomimi_voice" src="{0}sound/nyanpass.mp3" autoplay="autoplay" style="display:none"></audio>'
                            .replace('{0}', Extra.resHostUrl)
                    );
                }
            });
        }
    },

    /**
     * 其实整个KF只有我一个人
     */
    kfOnlyYou: function () {
        var excludeUserList = Extra.defKfOnlyYouExcludeUserList;
        excludeUserList.push(KFOL.userName);
        excludeUserList = excludeUserList.concat(Extra.Config.kfOnlyYouExcludeUserList);

        var commonReplace = function ($elem) {
            var user = $elem.text();
            if ($.inArray(user, excludeUserList) === -1) {
                $elem.text(KFOL.userName).attr('title', user);
                if (!$elem.is('a')) $elem.addClass('pd_custom_tips');
            }
        };

        if (KFOL.isInHomePage) {
            $('<div class="line"></div><div style="width:300px;"><a href="#" title="添加想从替换中被排除的用户" class="indbox5">邀请想在KF一起玩的朋友</a>' +
                '<div class="c"></div></div>')
                .insertAfter($('div > a[href="kf_fw_1wkfb.php"]').parent())
                .click(function (e) {
                    e.preventDefault();
                    var value = window.prompt('添加想从替换中被排除的用户名单（多个用户名请用英文逗号分隔）：', Extra.Config.kfOnlyYouExcludeUserList.join(','));
                    if (value === null) return;
                    value = $.trim(value);
                    Extra.readConfig();
                    if (value) {
                        Extra.Config.kfOnlyYouExcludeUserList = value.split(',');
                        alert('有几位朋友来和你一起玩了，你的孤独症减轻了一些');
                    }
                    else {
                        Extra.Config.kfOnlyYouExcludeUserList = Extra.defConfig.kfOnlyYouExcludeUserList;
                    }
                    Extra.writeConfig();
                });

            $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
                var $this = $(this);
                var matches = /》by：(.+)/.exec($this.attr('title'));
                if (matches) {
                    if ($.inArray(matches[1], excludeUserList) === -1) {
                        $this.attr('title', $this.attr('title').replace('》by：' + matches[1], '》by：' + KFOL.userName));
                    }
                }
            });
        }
        else if (location.pathname === '/thread.php') {
            $('.thread1 > tbody > tr > td:last-child').each(function () {
                var $this = $(this);
                commonReplace($this.find('a.bl'));

                var html = $this.html();
                var matches = /<br>\n\s*(.+?)\s*\|\s*\d+[:\-]\d+$/.exec(html);
                if (matches) {
                    if ($.inArray(matches[1], excludeUserList) === -1) {
                        $this.html(
                            html.replace(matches[0],
                                matches[0].replace(
                                    matches[1] + ' |',
                                    '<span class="pd_custom_tips" title="{0}">{1}</span> |'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                                )
                            )
                        );
                    }
                }
            });
        }
        else if (location.pathname === '/search.php') {
            $('.thread1 > tbody > tr > td:last-child > a[href^="profile.php?action=show&uid="]').each(function () {
                commonReplace($(this));
            });
        }
        else if (location.pathname === '/read.php') {
            $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a[href^="profile.php?action=show&uid="]').each(function () {
                commonReplace($(this));
            });

            $('.readtext fieldset > legend:contains("Quote:")').each(function () {
                var $quote = $(this).parent();
                var html = $quote.html();
                var matches = /<\/legend>引用<a.+?>第\d+楼<\/a>(.+?)于\d+-\d+-\d+\s*\d+:\d+发表的/.exec(html);
                if (matches) {
                    if ($.inArray(matches[1], excludeUserList) === -1) {
                        $quote.html(
                            html.replace(matches[0],
                                matches[0].replace(
                                    '</a>' + matches[1],
                                    '</a><span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                                )
                            )
                        );
                    }
                }
                else {
                    matches = /<\/legend>回\s*\d+楼\((.+?)\)\s*的帖子/.exec(html);
                    if (matches) {
                        if ($.inArray(matches[1], excludeUserList) === -1) {
                            $quote.html(
                                html.replace(matches[0],
                                    matches[0].replace(
                                        '楼(' + matches[1],
                                        '楼(<span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                                    )
                                )
                            );
                        }
                    }
                }
            });
        }
        else if (location.pathname === '/guanjianci.php') {
            $('.kf_share1:last > tbody > tr:gt(0) > td:last-child').each(function () {
                commonReplace($(this));
            });
        }
        else if (/\/profile\.php\?action=show/i.test(location.href)) {
            var $user1 = $('.log1 > tbody > tr:first-child > td:first-child');
            var matches = /(.+) 详细信息/.exec($user1.text());
            if (matches) {
                if ($.inArray(matches[1], excludeUserList) === -1) {
                    $user1.html(KFOL.userName + ' 详细信息').attr('title', matches[1]).addClass('pd_custom_tips');
                }
            }

            var $user2 = $('.log1 > tbody > tr:nth-child(2) > td:nth-child(2)');
            var html = $user2.html();
            matches = /用户名称：(.+?)\s*\(/.exec($user2.text());
            if (matches) {
                if ($.inArray(matches[1], excludeUserList) === -1) {
                    $user2.html(
                        html.replace(matches[0],
                            matches[0].replace(
                                '用户名称：' + matches[1],
                                '用户名称：<span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                            )
                        )
                    );
                }
            }
        }
        else if (/\/profile\.php\?action=favor/i.test(location.href)) {
            $('td > a[href^="profile.php?action=show&uid="]').each(function () {
                commonReplace($(this));
            });
        }
        else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
            commonReplace($('.thread2 > tbody > tr:nth-child(2) > td:last-child'));
            commonReplace($('td > a[href^="profile.php?action=show&username="]'));
        }
        else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
            $('.thread1 > tbody > tr > td:nth-child(3) > a').each(function () {
                commonReplace($(this));
            });
        }
        else if (location.pathname === '/kf_no1.php') {
            $('.kf_no11:last > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
                commonReplace($(this));
            });
        }
        else if (location.pathname === '/kf_share.php') {
            $('.kf_share1:last > tbody > tr:gt(0) > td:last-child').each(function () {
                commonReplace($(this));
            });
        }
        else if (/\/hack\.php\?H_name=bank/i.test(location.href)) {
            if (Tools.getUrlParam('action') === 'log') {
                $('.bank1 > tbody > tr:gt(1) > td:nth-child(3) > div > b').each(function () {
                    commonReplace($(this));
                });
            }
            else {
                $('td > table > tbody > tr:first-child > td:contains("活期存款排行")').closest('tbody').find('tr:gt(0) > td:nth-child(2)').each(function () {
                    commonReplace($(this));
                });
            }
        }
        else if (/\/personal\.php\?action=post/i.test(location.href)) {
            $('td > a[href^="profile.php?action=show&uid="]').each(function () {
                commonReplace($(this));
            });
        }
        else if (/\/kf_fw_ig_my\.php\?pro=\d+/i.test(location.href)) {
            if (Tools.getCookie(Const.kfOnlyYouCookieName) === Extra.customItemList[3].cookieValue) return;
            var $owner = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child > span:contains("现持有者：")');
            var matches = /现持有者：(.+)/.exec($owner.text());
            if (matches) {
                if ($.inArray(matches[1], excludeUserList) === -1) {
                    $owner.text('现持有者：' + KFOL.userName).attr('title', matches[1]).addClass('pd_custom_tips');
                }
            }

            var $itemLog = $('.kf_fw_ig1 > tbody > tr:last-child > td');
            var html = $itemLog.html();
            var oriHtml = html;

            matches = html.match(/被[^<>]+?(取|于)/g);
            for (var i in matches) {
                var userMatches = /被([^<>]+?)(取|于)/.exec(matches[i]);
                if (userMatches) {
                    if ($.inArray(userMatches[1], excludeUserList) === -1) {
                        html = html.replace(userMatches[0],
                            '被<span class="pd_custom_tips" title="{0}">{1}</span>{2}'
                                .replace('{0}', userMatches[1]).replace('{1}', KFOL.userName).replace('{2}', userMatches[2])
                        );
                    }
                }
            }
            if (html !== oriHtml) $itemLog.html(html);
        }
    },

    /**
     * 自定义自己的神秘等级
     */
    modifyCustomSmLevel: function () {
        var smLevel = Extra.Config.customSmLevel;
        var type = Extra.Config.customSmLevelType;
        if (KFOL.isInHomePage) {
            if (type) return;
            var $smLevel = $('a[href="kf_growup.php"][title="用户等级和权限"]');
            $smLevel.html($smLevel.html().replace(/神秘(.+?)级/, '<span title="$1级神秘">神秘' + smLevel + '级</span>'));
        }
        else if (location.pathname === '/read.php') {
            $('.readidmsbottom > a[href="profile.php?action=show&uid={0}"], .readidmleft > a[href="profile.php?action=show&uid={0}"]'
                .replace(/\{0\}/g, KFOL.uid)
            ).each(function () {
                var $this = $(this);
                var $parent = $this.parent();
                if ($parent.is('.readidmleft')) {
                    var smLevelText = smLevel.substr(0, 5);
                    var $smLevel = $parent.next('.readidmright');
                    var oriSmLevel = $smLevel.text();
                    $smLevel.css('font-size', smLevelText.length === 4 ? '14px' : '13px')
                        .text(smLevelText)
                        .attr('title', oriSmLevel + '级神秘')
                        .addClass('pd_custom_tips');
                }
                else {
                    var smLevelText = smLevel.substr(0, 8);
                    var $smLevel = $parent.contents().last();
                    var matches = /(\d+)级神秘/.exec($smLevel.text());
                    if (matches) {
                        $smLevel.get(0).textContent = smLevelText + '级神秘';
                        $smLevel.wrap('<span title="' + matches[1] + '级神秘" class="pd_custom_tips"></span>');
                    }
                }
            });
        }
        else if (/\/profile\.php\?action=show&uid=\d+/i.test(location.href)) {
            if (type || Tools.getUrlParam('uid') !== KFOL.uid.toString()) return;
            var $userInfo = $('.log1 > tbody > tr:nth-child(2) > td:nth-child(2)');
            $userInfo.html($userInfo.html().replace(/神秘等级：(\d+)\s*级/i, '神秘等级：<span title="$1级神秘" class="pd_custom_tips">' + smLevel + ' 级</span>'));
        }
        else if (location.pathname === '/kf_growup.php') {
            if (type) return;
            var $smLevel = $('#alldiv > table:first > tbody > tr:first-child > td:nth-child(2) > div:first > div:first-child > b:first');
            var oriSmLevel = $smLevel.text();
            $smLevel.text(smLevel).attr('title', oriSmLevel + '级神秘').addClass('pd_custom_tips');
        }
    },

    /**
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined' || !KFOL.uid) return;
        var startDate = new Date();
        Extra.prepare();
        Extra.initConfig();
        Extra.appendCss();
        Extra.addVersionInfoInConfigDialog();

        Extra.runCustomScript(1);

        if (location.pathname === '/read.php') {
            Extra.modifyRainbowSmColor();
            Extra.addNekoMiMiAboveAvatar();
            $('img[src*="/post/smile/em/"]').draggable({scroll: true, cursor: "move"});
        }
        else if (location.pathname === '/kf_fw_ig_shop.php') {
            CustomItem.addItemShop();
        }
        else if (/\/kf_fw_ig_my\.php\?pro=\d+&pd_typeid=\d+/i.exec(location.href)) {
            CustomItem.showItemInfo(parseInt(Tools.getUrlParam('pd_typeid')));
        }
        if (Extra.Config.customSmLevel) Extra.modifyCustomSmLevel();
        if (Extra.Config.kfOnlyYouEnabled) Extra.kfOnlyYou();

        Extra.runCustomScript(2);

        var endDate = new Date();
        console.log('【KF Online助手 Extra】加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

if (typeof KFOL !== 'undefined') Extra.init();
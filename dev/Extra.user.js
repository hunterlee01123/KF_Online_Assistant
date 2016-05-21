// ==UserScript==
// @name        KF Online助手 Extra
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KF Online助手的额外脚本，可提供更丰富的玩法（需配合KFOL助手使用）
// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/Extra.meta.js
// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/release/Extra.user.js
// @include     http://*2dgal.com/*
// @include     http://*ddgal.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     1.0.3
// @grant       none
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// ==/UserScript==

/**
 * 额外脚本类
 */
var Extra = {
    // 当前域名是否在miaola.info下
    isInMiaolaDomain: location.host.indexOf('miaola.info') > -1,
    // 存放图片资源的URL
    imgResHostUrl: location.host.indexOf('miaola.info') > -1 ? 'pd/img/' : 'https://kf.miaola.info/pd/img/',
    // 初始的节操值
    defJieCao: 50000,
    // 道具价格浮动的最低百分比
    minItemPricePercent: 0,
    // 道具价格浮动的最高百分比
    maxItemPricePercent: 200,

    /**
     * 设置常量
     */
    setConst: function () {
        // 我的节操值的临时日志名称
        Const.jieCaoTmpLogName = 'JieCao';
        // 我的自定义道具的临时日志名称
        Const.myCustomItemTmpLogName = 'MyCustomItem';
        // 标记是否开启多彩神秘颜色的Cookie名称
        Const.rainbowSmColorCookieName = Extra.customItemList[1].cookieName;
        // 标记是否为头像加上猫耳的Cookie名称
        Const.nekoMiMiAvatarCookieName = Extra.customItemList[2].cookieName;
        // 标记是否进入【其实整个KF只有我一个人】模式的Cookie名称
        Const.kfOnlyYouCookieName = Extra.customItemList[3].cookieName;
        // 自定义排除用户列表的Cookie名称
        Const.excludeUsersCookieName = 'pd_exclude_users';
    },

    appendCss: function () {
        $('head').append(
            '<style type="text/css">' +
            /* 自定义道具商店 */
            '.pd_custom_item_shop { width: 860px; border-top: 1px solid #9999FF; border-right: 1px solid #9999FF; }' +
            '.pd_custom_item_shop th, .pd_custom_item_shop td {' +
            '  text-align: left; font-weight: normal; height: 30px; border-bottom: 1px solid #9999FF; border-left: 1px solid #9999FF; line-height: 24px; padding: 5px;' +
            '}' +
            '.pd_custom_item_shop td:nth-child(4), .pd_custom_item_shop td:nth-child(5) { font-size: 14px; }' +

            '.pd_nekomimi { position: absolute; opacity: 0.95; }' +
            '#r_menu { z-index: 1; }' +
            '</style>'
        );
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

    // 自定义道具列表
    customItemList: {
        1: {
            level: 3,
            name: '神秘彩虹',
            price: 233,
            canSell: true,
            intro: '可将自己的神秘颜色变换成彩虹色，让你拥有超越一般玩家的尊贵身份！<br /><span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_1.jpg',
            cookieName: 'pd_rainbow_sm_color',
            cookieValue: '1',
            use: function () {
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
            intro: '这里有一对猫耳，戴上去就能变成一只猫，喵~~~<br />给你自己的头像戴上一对猫耳（适合140px宽度的图像）<br /><span class="pd_highlight">（效果仅限自己可见）</span>',
            image: 'custom_item_2.jpg',
            cookieName: 'pd_nekomimi_avatar',
            cookieValue: '1',
            use: function () {
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
            cookieName: 'pd_kf_only_you',
            cookieValue: '1',
            use: function () {
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
    },

    /**
     * 添加自定义道具商店
     */
    addCustomItemShop: function () {
        var customItemList = [];
        for (var id in Extra.customItemList) {
            var obj = Extra.customItemList[id];
            obj.itemTypeId = id;
            customItemList.push(obj);
        }
        customItemList.sort(function (a, b) {
            return a.level > b.level;
        });
        var myItemList = Extra.getMyCustomItemList();
        var itemListHtml = '';
        $.each(customItemList, function (index, item) {
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
                    .replace('{6}', Math.round(item.price * Extra.minItemPricePercent / 100))
                    .replace('{7}', Math.round(item.price * Extra.maxItemPricePercent / 100))
                    .replace('{8}', Math.round(item.price * (Extra.maxItemPricePercent - Extra.minItemPricePercent) / 2 / 100))
                    .replace('{9}', Extra.minItemPricePercent)
                    .replace('{10}', Extra.maxItemPricePercent)
                    .replace('{11}', item.canSell ? '' : 'pd_disabled_link') +
                '</tr>';
        });

        var $customItemShop = $(
            '<div style="color:#FFF;background-color:#9999FF;padding:5px;margin-top:10px;"><b>良心</b>道具商店 ' +
            '(当前持有 <b title="一种并没有什么卵用、随时可以抛弃的的东西" class="pd_jiecao_num pd_custom_tips" style="font-size:14px">{0}</b> 节操)</div>'
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
            '</table>'
        ).insertAfter('.kf_fw_ig1:last');

        $customItemShop.on('click', 'td:last-child > a', function (e) {
            e.preventDefault();
            var $this = $(this);
            var itemTypeId = parseInt($this.closest('tr').data('item_type_id'));
            if (!itemTypeId) return;
            var item = Extra.customItemList[itemTypeId];
            if (!item) return;
            var myItemList = Extra.getMyCustomItemList();
            if ($this.text() === '出售') {
                if (!item.canSell) return;
                if ($.type(myItemList[itemTypeId]) !== 'object') {
                    alert('你尚未购买此道具');
                    return;
                }
                if (window.confirm('是否出售【Lv.{0}：{1}】道具？'.replace('{0}', item.level).replace('{1}', item.name))) {
                    Extra.sellCustomItem(itemTypeId, item);
                    $this.closest('tr').find('td:nth-child(3)').css('color', '#FF0033').text('否');
                }
            }
            else {
                if ($.type(myItemList[itemTypeId]) === 'object') {
                    alert('你已购买过此道具');
                    return;
                }
                var jieCao = Extra.getJieCao();
                if (jieCao < item.price * 2) {
                    alert('你当前的节操值不足此道具市场价的两倍');
                    return;
                }
                if (!window.confirm('是否购买【Lv.{0}：{1}】道具？'.replace('{0}', item.level).replace('{1}', item.name))) return;

                var buyPrice = Math.round(item.price * (Math.random() * (Extra.maxItemPricePercent - Extra.minItemPricePercent) + Extra.minItemPricePercent) / 100);
                jieCao -= buyPrice;
                myItemList[itemTypeId] = {buyTime: new Date().getTime(), buyPrice: buyPrice};
                TmpLog.setValue(Const.myCustomItemTmpLogName, myItemList);
                TmpLog.setValue(Const.jieCaoTmpLogName, jieCao);
                $('.pd_jiecao_num').text(jieCao);
                $this.closest('tr').find('td:nth-child(3)').css('color', '#669933').text('是');
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
            }
        });
    },

    /**
     * 出售指定种类ID的道具
     * @param {number} itemTypeId 指定种类ID
     * @param {{}} item 指定自定义道具类
     */
    sellCustomItem: function (itemTypeId, item) {
        Tools.setCookie(item.cookieName, '', Tools.getDate('-1d'));
        var myItemList = Extra.getMyCustomItemList();
        delete myItemList[itemTypeId];
        if ($.isEmptyObject(myItemList))
            TmpLog.deleteValue(Const.myCustomItemTmpLogName);
        else
            TmpLog.setValue(Const.myCustomItemTmpLogName, myItemList);
        var sellPrice = Math.round(item.price * (Math.random() * (Extra.maxItemPricePercent - Extra.minItemPricePercent) + Extra.minItemPricePercent) / 100);
        var jieCao = Extra.getJieCao() + sellPrice;
        TmpLog.setValue(Const.jieCaoTmpLogName, jieCao);
        if (location.pathname === '/kf_fw_ig_my.php') Extra.showCustomItemInfo();
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
     * 获得我的自定义道具列表
     * @returns {{}} 我的自定义道具列表
     */
    getMyCustomItemList: function () {
        var myItemList = TmpLog.getValue(Const.myCustomItemTmpLogName);
        if ($.type(myItemList) !== 'object') myItemList = {};
        return myItemList;
    },

    /**
     * 获得我的自定义道具中指定种类ID的道具
     * @param {number} itemTypeId 指定种类ID
     * @returns {?{}} 指定种类ID的道具
     */
    getMyCustomItem: function (itemTypeId) {
        var myItemList = TmpLog.getValue(Const.myCustomItemTmpLogName);
        var myItem = null;
        if ($.type(myItemList) === 'object' && $.type(myItemList[itemTypeId]) === 'object')
            myItem = myItemList[itemTypeId];
        return myItem;
    },

    /**
     * 显示指定的自定义道具的详细信息
     */
    showCustomItemInfo: function () {
        var itemTypeId = parseInt(Tools.getUrlParam('pd_typeid'));
        if (!itemTypeId) return;
        var item = Extra.customItemList[itemTypeId];
        if (!item) return;
        var cookieValue = Tools.getCookie(item.cookieName);
        var myItem = Extra.getMyCustomItem(itemTypeId);
        var $node = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child').html(
            '<span style="color:#00F">道具名称：{0}</span><br />'.replace('{0}', item.name) +
            '道具等级：{0}级道具<br />'.replace('{0}', item.level) +
            item.intro +
            '<br /><br />' +
            '<span style="color:#00F">现持有者：{0}</span><br />'.replace('{0}', myItem ? KFOL.userName : '良心道具商店') +
            '使用状态：<span class="pd_custom_item_is_used" style="color:{0}">{1}</span><br />'
                .replace('{0}', cookieValue === item.cookieValue ? '#999' : '#090')
                .replace('{1}', cookieValue === item.cookieValue ? '已使用' : '未使用') +
            '交易类型：' + (item.canSell ? '<span style="color:#090">可以交易</span>' : '<span style="color:#999">无法交易</span>') + '<br />' +
            '当前市场价：{0} 节操<br />'.replace('{0}', item.price)
        );
        if (myItem) {
            $('<span>购入价格：{0} 节操</span><br />'.replace('{0}', myItem.buyPrice) +
                '<div>' +
                (cookieValue === item.cookieValue ? '[<a class="pd_highlight" href="#">还原此道具使用效果</a>]' : '[<a href="#">使用此道具</a>]') +
                (item.canSell ? ' | [<a href="#">出售此道具</a>]' : '') +
                '</div>'
            ).appendTo($node)
                .find('a')
                .click(function (e) {
                    e.preventDefault();
                    var myItem = Extra.getMyCustomItem(itemTypeId);
                    if (!myItem) {
                        alert('你尚未购买此道具');
                        return;
                    }
                    var $this = $(this);
                    var text = $this.text();
                    if (text.indexOf('出售') > -1) {
                        if (window.confirm('是否出售此道具？')) {
                            Extra.sellCustomItem(itemTypeId, item);
                        }
                    }
                    else if (text.indexOf('还原') > -1) {
                        if (item.cancel() === false) return;
                        Tools.setCookie(item.cookieName, '', Tools.getDate('-1d'));
                        $this.text('使用此道具').removeClass('pd_highlight');
                        $('.pd_custom_item_is_used').text('未使用').css('color', '#090');
                    }
                    else {
                        if (item.use() === false) return;
                        Tools.setCookie(item.cookieName, item.cookieValue, Tools.getDate('+1M'));
                        $this.text('还原此道具使用效果').addClass('pd_highlight');
                        $('.pd_custom_item_is_used').text('已使用').css('color', '#999');
                    }
                });
        }
        $node.prev('td').find('img').attr('src', Extra.imgResHostUrl + item.image);
        $node.parent('tr').next('tr').find('td').html(
            myItem ? '[历史记载]<br />本道具于{0}被{1}取得。'.replace('{0}', Tools.getDateString(new Date(myItem.buyTime))).replace('{1}', KFOL.userName) : ''
        );
    },

    /**
     * 为头像加上猫耳
     */
    addNekoMiMiAboveAvatar: function () {
        var userList = ['信仰风', '喵拉布丁'];
        if (Tools.getCookie(Const.nekoMiMiAvatarCookieName) === Extra.customItemList[2].cookieValue) userList.push(KFOL.userName);
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            if ($.inArray($this.text(), userList) === -1) return;
            var $parent = $this.parent();
            var type = 1;
            if ($parent.is('.readidmleft')) type = 2;
            var $avatar = null;
            if (type === 2) $avatar = $parent.closest('.readidm');
            else $avatar = $parent.prev('.readidmstop').find('img.pic');
            if (!$avatar || !$avatar.length || /none\.gif$/.test($avatar.attr('src'))) return;
            var $nekoMiMi = $('<img class="pd_nekomimi" src="{0}" />'.replace('{0}', Extra.imgResHostUrl + 'nekomimi_' + type + '.png'));
            if (type === 2) {
                $nekoMiMi.prependTo($avatar).css('top', -29).css('left', -1);
                $avatar.css('position', 'relative').css('overflow', 'visible').closest('.readtext').css('overflow-x', 'visible');
            }
            else {
                $nekoMiMi.insertBefore($avatar).css('top', -22).css('left', 16);
                $avatar.parent('.readidmstop').css('position', 'relative').closest('.readtext').css('overflow-x', 'visible');
            }
        });
    },

    /**
     * 多彩神秘颜色
     */
    modifyRainbowSmColor: function () {
        var userList = ['信仰风', '喵拉布丁'];
        if (Tools.getCookie(Const.rainbowSmColorCookieName) === Extra.customItemList[1].cookieValue) userList.push(KFOL.userName);
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            if ($.inArray($this.text(), userList) === -1) return;
            var css = 'url("{0}{filename}") 1 stretch'.replace('{0}', Extra.imgResHostUrl);
            $this.closest('.readtext').css('border-image', css.replace('{filename}', 'border_rainbow_middle.png'))
                .prev('.readlou').css('border-image', css.replace('{filename}', 'border_rainbow_top.png'))
                .next().next('.readlou').css('border-image', css.replace('{filename}', 'border_rainbow_bottom.png'));
        });
    },

    /**
     * 其实整个KF只有我一个人
     */
    kfOnlyYou: function () {
        // 排除用户列表，例：['SYSTEM','信仰风']
        var excludeUserList = ['SYSTEM'];

        var commonReplace = function ($elem) {
            var user = $elem.text();
            if ($.inArray(user, excludeUserList) === -1) {
                $elem.text(KFOL.userName).attr('title', user);
                if (!$elem.is('a')) $elem.addClass('pd_custom_tips');
            }
        };

        excludeUserList.push(KFOL.userName);
        var value = Tools.getCookie(Const.excludeUsersCookieName);
        if (value) {
            $.each(value.split(','), function (i, user) {
                user = $.trim(user);
                if (user) excludeUserList.push(user);
            });
        }

        if (KFOL.isInHomePage) {
            $('<div class="line"></div><div style="width:300px;"><a href="#" title="添加想从替换中被排除的用户" class="indbox5">邀请想在KF一起玩的朋友</a>' +
                '<div class="c"></div></div>')
                .insertAfter($('div > a[href="kf_fw_1wkfb.php"]').parent())
                .click(function (e) {
                    e.preventDefault();
                    var value = Tools.getCookie(Const.excludeUsersCookieName);
                    value = window.prompt('添加想从替换中被排除的用户名单（多个用户名请用英文逗号分隔）：', value ? value : '');
                    if (value) {
                        Tools.setCookie(Const.excludeUsersCookieName, value, Tools.getDate('+1M'));
                        alert('有几位朋友来和你一起玩了，你的孤独症减轻了一些');
                    }
                    else if (value !== null) {
                        Tools.setCookie(Const.excludeUsersCookieName, '', Tools.getDate('-1d'));
                    }
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
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined' || !KFOL.uid) return;
        var startDate = new Date();
        KFOL.window.Extra = Extra;
        Extra.setConst();
        Extra.appendCss();

        if (location.pathname === '/read.php') {
            Extra.modifyRainbowSmColor();
            Extra.addNekoMiMiAboveAvatar();
        }
        else if (location.pathname === '/kf_fw_ig_shop.php') {
            Extra.addCustomItemShop();
        }
        else if (/\/kf_fw_ig_my\.php\?pro=\d+&pd_typeid=\d+/i.exec(location.href)) {
            Extra.showCustomItemInfo();
        }
        if (Tools.getCookie(Const.kfOnlyYouCookieName) === Extra.customItemList[3].cookieValue) Extra.kfOnlyYou();

        var endDate = new Date();
        console.log('【KF Online助手 Extra】加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

if (typeof KFOL !== 'undefined') Extra.init();
// ==UserScript==
// @name        KF Online助手 Extra
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description KF Online助手的额外脚本，可提供更丰富有趣的玩法（需配合最新版的KFOL助手使用，请先安装KFOL助手再安装此脚本）
// @pd-update-url-placeholder
// @require     https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/jquery-ui.custom.min.js?V1.12.1
// @pd-require-start
// @require     https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/dev/CustomItem.js
// @pd-require-end
// @include     http://*2dkf.com/*
// @include     http://*ddgal.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @version     2.2.7
// @grant       none
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// ==/UserScript==
'use strict';
// Extra版本号
var extraVersion = '2.2.7';

/* {PartFileContent} */
/**
 * 额外脚本类
 */
var Extra = {
    /**
     * Extra配置类
     */
    Config: {
        // 节操值
        jieCao: 50000,
        // 我的自定义道具列表
        myItemList: {},
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
        // 是否成为灰企鹅之友，true：开启；false：关闭
        grayPenguinFriendEnabled: false,
        // 是否开启KF表情增强插件，true：开启；false：关闭
        kfSmileEnhanceExtensionEnabled: false
    },

    // 保存设置的键值名称
    configName: 'pd_extra_config',
    // 默认的Extra Config对象
    defConfig: {},
    // 当前域名是否在miaola.info下
    isInMiaolaDomain: location.host.indexOf('miaola.info') > -1,
    // 存放资源的URL，备选：https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/res/
    resHostUrl: 'https://kf.miaola.info/res/',
    //resHostUrl: 'http://127.0.0.1/res/',
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

        if (typeof options.jieCao !== 'undefined') {
            if ($.type(options.jieCao) === 'number' && options.jieCao >= 0) settings.jieCao = parseInt(options.jieCao);
            else settings.jieCao = defConfig.options.jieCao;
        }
        if (typeof options.myItemList !== 'undefined') {
            if ($.type(options.myItemList) === 'object') {
                var myItemList = {};
                for (var i in options.myItemList) {
                    if ($.type(options.myItemList[i]) === 'object' && $.type(options.myItemList[i].buyPrice) === 'number' &&
                        $.type(options.myItemList[i].buyTime) === 'number') {
                        myItemList[i] = options.myItemList[i];
                    }
                }
                settings.myItemList = myItemList;
            }
            else settings.myItemList = defConfig.options.myItemList;
        }

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
        if (typeof options.grayPenguinFriendEnabled !== 'undefined') {
            settings.grayPenguinFriendEnabled = typeof options.grayPenguinFriendEnabled === 'boolean' ?
                options.grayPenguinFriendEnabled : defConfig.grayPenguinFriendEnabled;
        }
        if (typeof options.kfSmileEnhanceExtensionEnabled !== 'undefined') {
            settings.kfSmileEnhanceExtensionEnabled = typeof options.kfSmileEnhanceExtensionEnabled === 'boolean' ?
                options.kfSmileEnhanceExtensionEnabled : defConfig.kfSmileEnhanceExtensionEnabled;
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
        Const.mobileAlertCookieName = 'pd_mobile_alert';
    },

    /**
     * 添加CSS样式
     */
    appendCss: function () {
        $('head').append(
            '<style type="text/css">' +
            '.pd_nekomimi { position: absolute; opacity: 0.95; cursor: pointer; }' +
            '#r_menu { z-index: 1; }' +
            '#pd_gray_penguin_menu { z-index: 3; }' +
            '#pd_gray_penguin_menu th+th, #pd_gray_penguin_menu td+td { border-left: 1px solid #9191FF; }' +
            '#pd_gray_penguin_menu th, #pd_gray_penguin_menu td { padding: 0 5px; line-height: 2em; cursor: pointer; min-width: 60px; }' +
            '#pd_gray_penguin_menu td:hover { color: #FFF; background-color: #9191FF; }' +
            '#pd_gray_penguin_menu th { border-bottom: 1px solid #9191FF; cursor: default; }' +

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
                    '<span style="color:#666"> | <a target="_blank" href="read.php?tid=554795">Extra</a> (V{0})</span>'.replace('{0}', Extra.version)
                );
            }
        });
    },

    /**
     * 多彩神秘颜色
     */
    modifyRainbowSmColor: function () {
        var userList = Extra.defRainbowSmColorUseList;
        if (Extra.Config.rainbowSmColorEnabled) userList.push(KFOL.userName);
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
            var $this = $(this);
            if ($.inArray($this.text(), userList) === -1 && Math.floor(Math.random() * 800) !== 539) return;
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
            if ($.inArray($this.text(), userList) === -1 && Math.floor(Math.random() * 800) !== 379) return;
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
                    var smLevelText = smLevel.substring(0, 5);
                    var $smLevel = $parent.next('.readidmright');
                    var oriSmLevel = $smLevel.text();
                    $smLevel.css('font-size', smLevelText.length === 4 ? '14px' : '13px')
                        .text(smLevelText)
                        .attr('title', oriSmLevel + '级神秘')
                        .addClass('pd_custom_tips');
                }
                else {
                    var smLevelText = smLevel.substring(0, 8);
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
     * 阻止持续刷新页面
     */
    preventContinueRefreshPage: function () {
        Const.continueRefreshCookieName = 'pd_continue_refresh';
        var value = Tools.getCookie(Const.continueRefreshCookieName);
        var count = 0;
        if (value && /^\d+|.+$/.test(value) && !/page=e/.test(value)) {
            var arr = value.split('|');
            count = parseInt(arr[0]);
            var url = arr[1];
            if (url === location.pathname + location.search) {
                if (count >= 40 || KFOL.isInHomePage && count >= 20) {
                    Tools.setCookie(Const.continueRefreshCookieName, '', Tools.getDate('-1d'));
                    location.href = 'https://www.baidu.com/';
                    return;
                }
            }
            else {
                count = 0;
            }
        }
        Tools.setCookie(Const.continueRefreshCookieName, ++count + '|' + location.pathname + location.search, Tools.getDate('+1m'));
    },

    /**
     * 操纵灰企鹅表情
     */
    controlGrayPenguinSmile: function () {
        /**
         * 添加CSS样式
         */
        var appendCss = function () {
            $('head').append(
                '<style id="pd_gray_penguin_style" type="text/css">' +
                '.readtext { overflow-x: visible; }' +
                '.readtext img[src*="/post/smile/em/"] { z-index: 2; }' +
                '</style>'
            );
        };

        $('.readtext img[src*="/post/smile/em/"]').dblclick(function () {
            if (!$('#pd_gray_penguin_style').length) appendCss();
            $(this).addClass('pd_draggable_move');
        }).draggable({
            scroll: true,
            cursor: 'move',
            start: function () {
                if (!$('#pd_gray_penguin_style').length) appendCss();
                $(this).addClass('pd_draggable_move');
            }
        });

        Func.add('KFOL.addMoreSmileLink_after_click_', function () {
            $('#pd_smile_panel img[src*="/post/smile/em/"]').draggable({
                scroll: true,
                cursor: 'move',
                start: function () {
                    if (!$('#pd_gray_penguin_style').length) appendCss();
                    $(this).addClass('pd_draggable_move');
                    var $this = $(this);
                    var offset = $this.offset();
                    $this.clone().appendTo('body').css({
                        'position': 'absolute',
                        'top': offset.top,
                        'left': offset.left
                    }).draggable({
                        scroll: true,
                        cursor: 'move',
                        start: function () {
                            $(this).addClass('pd_draggable_move');
                        }
                    });
                    $this.css('visibility', 'hidden').draggable('disable');
                }
            });
        });

        var documentWidth = $(window).width(), documentHeight = $(document).height();
        $(document).on('dblclick', 'img.pd_draggable_move', function () {
            var $this = $(this);
            $('.pd_draggable_move').removeClass('pd_draggable_move_selected');
            $this.addClass('pd_draggable_move_selected');
            var $menu = $('#pd_gray_penguin_menu');
            if ($menu.length > 0) $menu.remove();
            var offset = $this.offset();
            $menu = $(
                '<table id="pd_gray_penguin_menu" class="pd_panel" cellpadding="0" cellspacing="0">' +
                '  <tbody>' +
                '    <tr><td colspan="2" style="text-align:center;border-bottom:1px solid #9191FF;">关闭菜单</td></tr>' +
                '    <tr><th>全体</th><th>个体</th></tr>' +
                '    <tr data-action="停止"><td>停止</td><td>停止</td></tr>' +
                '    <tr data-action="移动"><td>移动</td><td>移动</td></tr>' +
                '    <tr data-action="布朗运动"><td>布朗运动</td><td>布朗运动</td></tr>' +
                '    <tr data-action="自杀"><td>自杀</td><td>自杀</td></tr>' +
                '    <tr data-action="自定义"><td>自定义</td><td>自定义</td></tr>' +
                '  </tbody>' +
                '</table>'
            ).appendTo('body').css('top', offset.top + 45).css('left', offset.left - 45);

            $menu.on('click', 'td', function () {
                var $this = $(this);
                var action = $this.parent('tr').data('action');
                var type = $this.is('td:nth-child(2)') ? 1 : 0;
                $menu.remove();
                if (action === '停止') {
                    $(type ? '.pd_draggable_move_selected' : '.pd_draggable_move').stop(true);
                }
                else if (action === '移动') {
                    var value = $.trim(window.prompt('移动多少像素？（格式：上下,左右；例：200,-100）', '0,0'));
                    if (!value) return;
                    if (!/^-?\d+,-?\d+$/.test(value)) {
                        alert('格式错误');
                        return;
                    }
                    var moveArr = value.split(',');
                    var topMove = moveArr[0];
                    var leftMove = moveArr[1];
                    var maxMove = Math.abs(topMove) > Math.abs(leftMove) ? Math.abs(topMove) : Math.abs(leftMove);
                    $(type ? '.pd_draggable_move_selected' : '.pd_draggable_move').stop(true).animate({
                        'top': '+=' + topMove + 'px',
                        'left': '+=' + leftMove + 'px'
                    }, maxMove * 3, 'easeInOutCubic');
                }
                else if (action === '布朗运动') {
                    var func = function () {
                        $(type ? '.pd_draggable_move_selected' : '.pd_draggable_move').stop(true).each(function () {
                            var topMove = (Math.floor(Math.random() * 2) ? 1 : -1) * Math.floor(Math.random() * 300 + 1);
                            var leftMove = (Math.floor(Math.random() * 2) ? 1 : -1) * Math.floor(Math.random() * 300 + 1);
                            var offset = $(this).offset();
                            if (offset.top + topMove > documentHeight || offset.top + topMove < 0) topMove *= -1;
                            if (offset.left + leftMove > documentWidth || offset.left + leftMove < 0) leftMove *= -1;
                            $(this).animate({
                                'top': '+=' + topMove + 'px',
                                'left': '+=' + leftMove + 'px'
                            }, 1500, 'easeInOutCubic', function () {
                                func();
                            });
                        });
                    };
                    func();
                }
                else if (action === '自杀') {
                    var windowHeight = $(window).height();
                    $(document).clearQueue('suicide');
                    $(type ? '.pd_draggable_move_selected' : '.pd_draggable_move').stop(true).each(function () {
                        var $this = $(this);
                        $(document).queue('suicide', function () {
                            var topMove = -Math.floor(Math.random() * 250 + 100);
                            var leftMove = (Math.floor(Math.random() * 2) ? 1 : -1) * Math.floor(Math.random() * 300 + 100);
                            if ($this.offset().left + leftMove > documentWidth) leftMove *= -1;
                            $this.animate({
                                'top': '+=' + topMove + 'px',
                                'left': '+=' + leftMove + 'px'
                            }, 1000, 'easeInOutCubic').animate({
                                'top': '+=' + windowHeight + 'px',
                                'left': '+=' + (leftMove > 0 ? 1 : -1) * 300 + 'px'
                            }, 1000, 'easeInOutCubic', function () {
                                $(this).removeClass('pd_draggable_move')
                                    .removeClass('pd_draggable_move_selected')
                                    .css('visibility', 'hidden')
                                    .draggable('disable');
                                $(document).dequeue('suicide');
                            });
                        });
                    });
                    $(document).dequeue('suicide');
                }
                else if (action === '自定义') {
                    if ($('#pd_control_gray_penguin_face_custom').length > 0) return;
                    var content =
                        "/* 动作范例 */\n" +
                        "$('{0}')\n".replace('{0}', type ? '.pd_draggable_move_selected' : '.pd_draggable_move') +
                        "    .stop(true)\n" +
                        "    // 第一个动画\n" +
                        "    .animate({\n" +
                        "            'top': '+=200px', // 往下移动200像素\n" +
                        "            'left': '-=150px' // 往左移动150像素\n" +
                        "        },\n" +
                        "        1000, // 动画持续时间（毫秒）\n" +
                        "        'linear' // easing效果名称\n" +
                        "    )\n" +
                        "    // 第二个动画\n" +
                        "    .animate({\n" +
                        "            'top': '+=' + Math.floor(Math.random() * 250 + 200) + 'px', // 往下移动200-450像素\n" +
                        "            'left': '+=' + Math.floor(Math.random() * 250 + 50) + 'px' // 往右移动50-300像素\n" +
                        "        },\n" +
                        "        1000, // 动画持续时间（毫秒）\n" +
                        "        'swing', // easing效果名称\n" +
                        "        function () {\n" +
                        "            // 动画完成后所执行的方法\n" +
                        "        });";
                    var html =
                        '<div class="pd_cfg_main">' +
                        '  <textarea wrap="off" style="width:600px;height:400px;white-space:pre">{0}</textarea>'.replace('{0}', content) +
                        '</div>' +
                        '<div class="pd_cfg_btns">' +
                        '  <button>运行</button><button>关闭</button>' +
                        '</div>';
                    var $dialog = Dialog.create('pd_control_gray_penguin_face_custom', '自定义动作', html);
                    $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
                        e.preventDefault();
                        var content = $dialog.find('textarea').val();
                        if (!$.trim(content)) return;
                        try {
                            eval(content);
                            Dialog.close('pd_control_gray_penguin_face_custom');
                        }
                        catch (ex) {
                            alert('自定义动作出错');
                        }
                    }).next('button').click(function () {
                        return Dialog.close('pd_control_gray_penguin_face_custom');
                    });
                    Dialog.show('pd_control_gray_penguin_face_custom');
                    $dialog.find('textarea').focus();
                }
            });
            Func.run('Extra.controlGrayPenguinFace_after_menu_');
        });
    },

    /**
     * 引入KF表情增强插件
     */
    importKfSmileEnhanceExtension: function () {
        if (location.pathname !== '/read.php' && location.pathname !== '/post.php' && location.pathname !== '/message.php') return;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = (Extra.isInMiaolaDomain ? '' : 'https://kf.miaola.info/') + 'kfe.min.user.js?' + Tools.getDateString(new Date(), '');
        document.body.appendChild(script);
    },

    /**
     * 旋转顶部LOGO
     */
    rotateTopLogo: function () {
        var $logo = $('img[src^="res/img/top_logo.png"]');

        /**
         * 旋转
         */
        var rotate = function () {
            $logo.animate(
                {endVal: $logo.data('direction') ? 0 : 180},
                {
                    step: function (now) {
                        $(this).css('transform', 'rotateY(' + now + 'deg)');
                    },
                    complete: function () {
                        var $this = $(this);
                        $this.data('direction', !$this.data('direction'));
                        if ($this.data('rotate')) rotate();
                    },
                    duration: 1000
                }
            );
        };

        $logo.parent('div').mouseenter(function () {
            $logo.stop(false, true).data('rotate', true);
            rotate();
        }).mouseleave(function () {
            $logo.removeData('rotate');
        });
    },

    /**
     * 翻转头像
     */
    rotateAvatar: function () {
        $('.readidms, .readidm').each(function () {
            if (Math.floor(Math.random() * 1800) !== 1137) return;
            $(this).css('transform', 'rotateY(180deg)');
        });
    },

    /**
     * 添加移动版链接
     */
    addMobileSiteLink: function () {
        $('.topright > a[href^="login.php?action=quit"]')
            .before('<a href="https://m.miaola.info/" target="_blank">移动版</a><span> | </span>');
    },

    /**
     * 提示移动浏览器
     */
    mobileAlert: function () {
        if (Tools.getUrlParam('nomobile')) {
            Tools.setCookie(Const.mobileAlertCookieName, 1, Tools.getDate('+1M'));
            return;
        }
        var $msg = KFOL.showWaitMsg(
            '<strong>你当前正在使用移动浏览器的样子，是否需要跳转到移动版网站？</strong><br />' +
            '<a href="https://m.miaola.info/" target="_blank">跳转到移动版</a><a class="pd_highlight" href="#">不再提示</a>'
        );
        $msg.find('a').click(function (e) {
            if ($(this).is('a[href="#"]')) {
                e.preventDefault();
                Tools.setCookie(Const.mobileAlertCookieName, 1, Tools.getDate('+1M'));
            }
            else {
                Tools.setCookie(Const.mobileAlertCookieName, 1);
            }
            KFOL.removePopTips($msg);
        });
    },

    /**
     * 在设置页面添加更换头像提醒
     */
    addAvatarChangeAlert: function () {
        $('input[name="uploadurl[2]"]')
            .parent().append('<div class="pd_highlight">本反向代理服务器为了提高性能对图片设置了缓存，更换头像后可能需等待<b>最多30分钟</b>才能看到效果</div>');
    },

    /**
     * 在发帖页面添加更新附件提醒
     */
    addAttachChangeAlert: function () {
        $(document).on('click', '.abtn[id^="md_"]', function () {
            if (!$(document).data('attachUpdateAlert')) {
                alert('本反向代理服务器为了提高性能对图片设置了缓存，更新附件图片后可能需等待最多30分钟才能看到效果');
                $(document).data('attachUpdateAlert', true);
            }
        });
    },

    /**
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined' || !KFOL.uid) return;
        var startDate = new Date();
        Extra.initConfig();
        Extra.prepare();
        Extra.appendCss();
        Extra.addVersionInfoInConfigDialog();

        Func.run('Extra.init_before_');

        if (location.pathname === '/read.php') {
            if (Extra.Config.rainbowSmColorEnabled) Extra.modifyRainbowSmColor();
            if (Extra.Config.nekoMiMiAvatarEnabled) Extra.addNekoMiMiAboveAvatar();
            if (Extra.Config.grayPenguinFriendEnabled && typeof jQuery.ui !== 'undefined') Extra.controlGrayPenguinSmile();
            //Extra.rotateAvatar();
        }
        else if (location.pathname === '/kf_fw_ig_shop.php') {
            CustomItem.addItemShop();
        }
        else if (/\/kf_fw_ig_my\.php\?pro=\d+&pd_typeid=\d+/i.exec(location.href)) {
            CustomItem.showItemInfo(parseInt(Tools.getUrlParam('pd_typeid')));
        }
        if (Extra.Config.customSmLevel) Extra.modifyCustomSmLevel();
        if (Extra.Config.kfOnlyYouEnabled) Extra.kfOnlyYou();
        if (Extra.isInMiaolaDomain) {
            Extra.addMobileSiteLink();
            if (Extra.Config.kfSmileEnhanceExtensionEnabled) Extra.importKfSmileEnhanceExtension();
            Extra.preventContinueRefreshPage();
            Extra.rotateTopLogo();
            if (KFOL.isMobile && KFOL.isInHomePage && !Tools.getCookie(Const.mobileAlertCookieName)) Extra.mobileAlert();
            if (/\/profile\.php\?action=modify/i.exec(location.href)) {
                Extra.addAvatarChangeAlert();
            }
            else if (location.pathname === '/post.php') {
                Extra.addAttachChangeAlert();
            }
        }

        Func.run('Extra.init_after_');

        var endDate = new Date();
        console.log('【KF Online助手 Extra】加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

if (typeof KFOL !== 'undefined') Extra.init();
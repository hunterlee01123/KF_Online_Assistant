// ==UserScript==
// @name        绯月表情增强插件
// @namespace   https://greasyfork.org/users/5415
// @version     4.5.0.1
// @author      eddie32
// @description KF论坛专用的回复表情，插图扩展插件，在发帖时快速输入自定义表情和论坛BBCODE
// @icon        https://blog.nekohand.moe/favicon.ico
// @homepage    https://github.com/liu599/KF-Emotion-UserScript
// @include     http*://*2dkf.com/*
// @include     http*://*9moe.com/*
// @include     http*://*kfgal.com/*
// @include     https://*miaola.info/*
// @copyright   2014-2017, eddie32
// @grant       none
// @license     MIT
// @run-at      document-end
// @modifier    喵拉布丁
// @modifier-source https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/scripts/es6/KfEmotion.user.js
// ==/UserScript==
'use strict';
// 版本号

var version = '4.5.0.1';
// 网站是否为KfMobile
var isKfMobile = typeof Info !== 'undefined' && typeof Info.imgPath !== 'undefined';

// 灰企鹅
var KfSmileList = [];
var KfSmileCodeList = [];
var kfImgPath = typeof imgpath !== 'undefined' ? imgpath : '';
if (isKfMobile) kfImgPath = Info.imgPath;
for (var i = 1; i < 49; i++) {
    KfSmileList.push('/' + kfImgPath + '/post/smile/em/em' + (i > 9 ? i : '0' + i) + '.gif');
    KfSmileCodeList.push('[s:' + (i + 9) + ']');
}

// AC娘表情
var AcSmileList = [];
for (var _i = 1; _i < 51; _i++) {
    AcSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds6/' + _i + '.png');
}
for (var _i2 = 1; _i2 < 40; _i2++) {
    AcSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds5/' + (_i2 > 9 ? _i2 : '0' + _i2) + '.gif');
}

// 常用表情
var CommonSmileList = [];
for (var _i3 = 2; _i3 < 64; _i3++) {
    CommonSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds4/0xx' + _i3 + '.png');
}

// 阿卡林 from 摇曳百合
var AkarinSmileList = [];
for (var _i4 = 1; _i4 < 21; _i4++) {
    AkarinSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds2/akari' + _i4 + '.gif');
}
for (var _i5 = 1; _i5 < 72; _i5++) {
    AkarinSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds3/akari' + _i5 + '.png');
}

// B站和tora酱表情
var BiliBiliSmileList = [];
for (var _i6 = 1; _i6 < 17; _i6++) {
    BiliBiliSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds/2233 (' + _i6 + ').gif');
}
for (var _i7 = 1; _i7 < 14; _i7++) {
    BiliBiliSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds/' + _i7 + '.png');
}
for (var _i8 = 0; _i8 < 14; _i8++) {
    BiliBiliSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds/bilibiliTV (' + _i8 + ').png');
}
for (var _i9 = 1; _i9 < 14; _i9++) {
    BiliBiliSmileList.push('http://o6smnd6uw.bkt.clouddn.com/xds2/0' + (_i9 > 9 ? _i9 : '0' + _i9) + '.jpg');
}

// lovelive表情（小）
var LoveliveSmallSmileList = [];
for (var _i10 = 1; _i10 < 41; _i10++) {
    LoveliveSmallSmileList.push('http://o6smnd6uw.bkt.clouddn.com/lovelive/Lovelive2nd' + _i10 + '.png');
}
for (var _i11 = 1; _i11 < 41; _i11++) {
    LoveliveSmallSmileList.push('http://o6smnd6uw.bkt.clouddn.com/lovelive/Lovelive' + _i11 + '.png');
}

/**
 * 表情菜单
 */
var MenuList = {
    KfSmile: { datatype: 'imageLink', title: 'KF自带', addr: KfSmileList, ref: KfSmileCodeList },
    Shortcut: {
        datatype: 'plain',
        title: '快捷',
        addr: ['[sell=100][/sell]', '[quote][/quote]', '[hide=100][/hide]', '[code][/code]', '[strike][/strike]', '[fly][/fly]', '[color=#00FF00][/color]', '[b][/b]', '[u][/u]', '[i][/i]', '[hr]', '[backcolor=][/backcolor]', '[url=][/url]', '[img][/img]'],
        ref: ['出售贴sell=售价', '引用', '隐藏hide=神秘等级', '插入代码', '删除线', '跑马灯', '文字颜色', '粗体', '下划线', '斜体', '水平线', '背景色', '插入链接', '插入图片']
    },
    Emoji: {
        datatype: 'plain',
        title: '颜文字',
        addr: ['(●・ 8 ・●)', '╰(๑◕ ▽ ◕๑)╯', '(ゝω・)', '〜♪♪', '(ﾟДﾟ≡ﾟДﾟ)', '(＾o＾)ﾉ', '(|||ﾟДﾟ)', '(`ε´ )', '(╬ﾟдﾟ)', '(|||ﾟдﾟ)', '(￣∇￣)', '(￣3￣)', '(￣ｰ￣)', '(￣ . ￣)', '(￣︿￣)', '(￣︶￣)', '(*´ω`*)', '(・ω・)', '(⌒▽⌒)', '(￣▽￣）', '(=・ω・=)', '(｀・ω・´)', '(〜￣△￣)〜', '(･∀･)', '(°∀°)ﾉ', '(￣3￣)', '╮(￣▽￣)╭', '( ´_ゝ｀)', 'のヮの', '(ﾉ؂< ๑）诶嘿☆～', '(&lt;_&lt;)', '(&gt;_&gt;)', '(;¬_¬)', '(▔□▔)/', '(ﾟДﾟ≡ﾟдﾟ)!?', 'Σ(ﾟдﾟ;)', 'Σ( ￣□￣||)', '(´；ω；`)', '（/TДT)/', '(^・ω・^ )', '(｡･ω･｡)', '(●￣(ｴ)￣●)', 'ε=ε=(ノ≧∇≦)ノ', '(´･_･`)', '(-_-#)', '（￣へ￣）', '(￣ε(#￣) Σ', 'ヽ(`Д´)ﾉ', '(╯°口°)╯(┴—┴', '（#-_-)┯━┯', '_(:3」∠)_', '(笑)', '(汗)', '(泣)', '(苦笑)', '(´・ω・`)', '(╯°□°）╯︵ ┻━┻', '(╯‵□′)╯︵┻━┻', '( ´ρ`)', '( ﾟωﾟ)', '(oﾟωﾟo)', '(　^ω^)', '(｡◕∀◕｡)', '/( ◕‿‿◕ )\\', 'ε٩( º∀º )۶з', '(￣ε(#￣)☆╰╮(￣▽￣///)', '（●´3｀）~♪', '_(:з」∠)_', 'хорошо!', '＼(^o^)／', '(•̅灬•̅ )', '(ﾟДﾟ)', 'まったく、小学生は最高だぜ！！', 'ε=ε=ε=┏(゜ロ゜;)┛', '(；°ほ°)', '⎝≧⏝⏝≦⎠', 'ヽ(✿ﾟ▽ﾟ)ノ', '焔に舞い上がるスパークよ、邪悪な異性交際に、天罰を与え！', '|•ω•`)']
    },
    Acfun: { datatype: 'image', title: 'ACFUN', addr: AcSmileList },
    Common: { datatype: 'image', title: '常用', addr: CommonSmileList },
    Akari: { datatype: 'image', title: 'Akari', addr: AkarinSmileList },
    BiliBili: { datatype: 'image', title: 'BiliBili', addr: BiliBiliSmileList },
    LoveLive: { datatype: 'image', title: 'LoveLive', addr: LoveliveSmallSmileList }
};

/**
 * 添加BBCode
 * @param textArea 文本框
 * @param {string} code BBCode
 * @param {string} selText 选择文本
 */
var addCode = function addCode(textArea, code) {
    var selText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var startPos = !selText ? code.indexOf('[img]') > -1 || code.indexOf(']') < 0 ? code.length : code.indexOf(']') + 1 : code.indexOf(selText);
    if (typeof textArea.selectionStart !== 'undefined') {
        var prePos = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
        textArea.selectionStart = prePos + startPos;
        textArea.selectionEnd = prePos + startPos + selText.length;
    } else {
        textArea.value += code;
    }
};

/**
 * 显示放大的表情图片
 * @param {jQuery} $img 表情图片对象
 */
var showZoomInImage = function showZoomInImage($img) {
    if ($img.get(0).naturalWidth <= $img.height()) return;
    var offset = $img.offset();
    var $zoomIn = $('<img class="kfe-zoom-in" src="' + $img.attr('src') + '" alt="[\u9884\u89C8\u56FE\u7247]">').appendTo('body');
    var windowWidth = $(window).width();
    var zoomInWidth = $zoomIn.outerWidth();
    var top = offset.top - $zoomIn.outerHeight() - 5;
    var left = offset.left + $img.width() / 2 - zoomInWidth / 2;
    if (left < 0) left = 0;else if (left + zoomInWidth > windowWidth) left = windowWidth - zoomInWidth;
    $zoomIn.css({ top: top, left: left });
};

/**
 * 获取表情面板的HTML代码
 * @param {string} key 菜单关键字
 * @returns {string} 表情面板内容
 */
var getSmilePanelHtml = function getSmilePanelHtml(key) {
    var data = MenuList[key];
    if (!data) return '';
    var html = '';
    for (var _i12 = 0; _i12 < data.addr.length; _i12++) {
        if (data.datatype === 'image') {
            html += '<img class="kfe-smile" src="' + data.addr[_i12] + '" alt="[\u8868\u60C5]">';
        } else if (data.datatype === 'imageLink') {
            var ref = typeof data.ref !== 'undefined' && typeof data.ref[_i12] !== 'undefined' ? data.ref[_i12] : '';
            html += '<img class="kfe-smile" data-code="' + ref + '" src="' + data.addr[_i12] + '" alt="[\u8868\u60C5]">';
        } else if (data.datatype === 'plain') {
            var _ref = typeof data.ref !== 'undefined' && typeof data.ref[_i12] !== 'undefined' ? data.ref[_i12] : data.addr[_i12];
            html += '<a class="kfe-smile-text" data-code="' + data.addr[_i12] + '" href="#">' + _ref + '</a>';
        }
    }
    return '<div class="kfe-smile-panel" data-key="' + key + '">' + html + '</div>';
};

/**
 * 获取子菜单的HTML代码
 * @returns {string} 子菜单内容
 */
var getSubMenuHtml = function getSubMenuHtml() {
    var html = '';
    $.each(MenuList, function (key, data) {
        html += '<a class="kfe-sub-menu" data-key="' + key + '" href="#" title="' + data.title + '">' + data.title + '</a>';
    });
    return html;
};

/**
 * 创建容器
 * @param textArea 文本框
 */
var createContainer = function createContainer(textArea) {
    var $container = $('\n<div class="kfe-container">\n  <div class="kfe-menu">\n    <span title="made by eddie32 version ' + version + '; modified by \u55B5\u62C9\u5E03\u4E01" style="cursor: pointer;"><b>\u56E7\u2468</b></span>\n    ' + getSubMenuHtml() + '\n    <span class="kfe-close-panel">[-]</span>\n  </div>\n</div>\n').insertBefore($(textArea));
    $container.on('click', '.kfe-sub-menu', function (e) {
        e.preventDefault();
        var $this = $(this);
        var key = $this.data('key');
        if (!key) return;
        $container.find('.kfe-sub-menu').removeClass('kfe-sub-menu-active');
        $this.addClass('kfe-sub-menu-active');
        $container.find('.kfe-smile-panel').hide();
        var $panel = $container.find('.kfe-smile-panel[data-key="' + key + '"]');
        if ($panel.length > 0) $panel.show();else $(getSmilePanelHtml(key)).appendTo($container).show();
    }).on('click', '.kfe-smile, .kfe-smile-text', function (e) {
        e.preventDefault();
        var $this = $(this);
        var code = $this.data('code');
        if (!code) code = '[img]' + $this.attr('src') + '[/img]';
        addCode(textArea, code);
        if (/(Mobile|MIDP)/i.test(navigator.userAgent)) textArea.blur();else textArea.focus();
    }).on('mouseenter', '.kfe-smile', function () {
        $('.kfe-zoom-in').remove();
        showZoomInImage($(this));
    }).on('mouseleave', '.kfe-smile', function () {
        $('.kfe-zoom-in').remove();
    }).find('.kfe-close-panel').click(function () {
        $container.find('.kfe-smile-panel').hide();
    });
};

/**
 * 添加CSS
 */
var appendCss = function appendCss() {
    $('head').append('\n<style>\n  .kfe-container { padding: 5px; vertical-align: middle; font: 12px/1.7em "sans-serif"; }\n  .kfe-menu { margin-bottom: 5px; }\n  .kfe-sub-menu { margin: 0 7px; text-decoration: none; border-bottom: 2px solid transparent; }\n  .kfe-sub-menu:hover, .kfe-sub-menu:focus { text-decoration: none; border-color: deeppink; }\n  a.kfe-sub-menu-active { color: black }\n  .kfe-smile-panel { display: none; height: 120px; padding: 5px 3px; overflow-y: auto; border-top: 1px solid #ddd; }\n  .kfe-smile-panel[data-key="Shortcut"] { height: auto; }\n  .kfe-smile { display: inline-block; max-width: 60px; max-height: 60px; cursor: pointer; }\n  .kfe-smile-text { display: inline-block; padding: 3px 5px; }\n  .kfe-smile-text:hover { color: #fff !important; background-color: #2b2b2b; text-decoration: none; }\n  .kfe-close-panel { cursor: pointer; }\n  .kfe-zoom-in {\n    position: absolute; max-width: 150px; max-height: 150px; background-color: #fcfcfc; border: 3px solid rgba(242, 242, 242, 0.6);\n    border-radius: 2px; box-shadow: 0 0 3px rgb(102, 102, 102);\n  }\n</style>\n');
    if (isKfMobile) {
        $('head').append('\n<style>\n  #readPage .kfe-container, #writeMessagePage .kfe-container { margin-top: -10px; }\n  .kfe-menu { white-space: nowrap; overflow-x: auto; }\n</style>\n');
    }
};

/**
 * 初始化
 */
var init = function init() {
    var $textAreas = $('textarea');
    if (!$textAreas.length) return;
    appendCss();
    $textAreas.each(function () {
        createContainer(this);
    });
};

init();
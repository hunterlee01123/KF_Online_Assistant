// ==UserScript==
// @name        绯月表情增强插件
// @namespace   https://greasyfork.org/users/5415
// @version     4.1.0.5
// @author      eddie32
// @description KF论坛专用的回复表情，插图扩展插件，在发帖时快速输入自定义表情和论坛BBCODE
// @icon        https://blog.nekohand.moe/favicon.ico
// @homepage    https://github.com/liu599/KF-Emotion-UserScript
// @include     http://*2dkf.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @include     https://*miaola.info/*
// @copyright   2014-2017, eddie32
// @grant       none
// @license     MIT
// @run-at      document-end
// @modifier    喵拉布丁
// @modifier-source  https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/scripts/es6/KfEmotion.user.js
// ==/UserScript==
'use strict';
// 版本号
const version = '4.1.0.5';
// 网站是否为KfMobile
const isKfMobile = typeof Info !== 'undefined' && typeof Info.imgPath !== 'undefined';

// 灰企鹅
const KfSmileList = [];
const KFSmileCodeList = [];
let kfImgPath = typeof imgpath !== 'undefined' ? imgpath : '';
if (isKfMobile) kfImgPath = Info.imgPath;
for (let i = 0; i < 48; i++) {
    KfSmileList.push(`/${kfImgPath}/post/smile/em/em${(i) >= 9 ? (i + 1) : ('0' + (i + 1))}.gif`);
    KFSmileCodeList.push(`[s:${i + 10}]`);
}

// AC娘表情
const AcSmileList = [];
for (let i = 0; i < 50; i++) {
    AcSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/ACFUN/New/${i + 1}.png`);
}
for (let i = 50; i < 90; i++) {
    AcSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/ACFUN/Niming/${(i - 50) >= 9 ? (i - 49) : ('0' + (i - 49))}.gif`);
}

// 常用表情
const CommonSmileList = [];
for (let i = 0; i < 62; i++) {
    CommonSmileList.push(`http://nekohand.moe/spsmile/01Sora/0xx${i + 2}.png`);
}
for (let i = 0; i < 19; i++) {
    CommonSmileList.push(`http://ss.nekohand.moe/Asource/EmotionPic/KFEM (${i + 1}).gif`);
}

// 阿卡林表情
const AkarinSmileList = [];
for (let i = 0; i < 71; i++) {
    AkarinSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/akari/akari${i + 1}.png`);
}
for (let i = 0; i < 20; i++) {
    AkarinSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/Dynamic/akari${i + 1}.gif`);
}

// B站和tora酱表情
const BiliBiliSmileList = [];
for (let i = 0; i < 16; i++) {
    BiliBiliSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/BiliBili/2233 (${i + 1}).gif`);
}
for (let i = 16; i < 30; i++) {
    BiliBiliSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/BiliBili/bilibiliTV (${i + 1 - 17}).png`);
}
for (let i = 0; i < 14; i++) {
    BiliBiliSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/tora/0${(i) >= 9 ? (i + 1) : ('0' + (i + 1))}.jpg`);
}

// lovelive表情（小）
const LoveliveSmallSmileList = [];
for (let i = 0; i < 40; i++) {
    LoveliveSmallSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion02/Small/Lovelive2nd${i + 1}.png`);
    LoveliveSmallSmileList.push(`http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/Small/Lovelive${i + 1}.png`);
}

/**
 * 表情菜单
 */
const MenuList = {
    KfSmile: {datatype: 'imageLink', title: 'KF自带', addr: KfSmileList, ref: KFSmileCodeList},
    Shortcut: {
        datatype: 'plain',
        title: '快捷',
        addr: [
            '[sell=100][/sell]', '[quote][/quote]', '[hide=100][/hide]', '[code][/code]', '[strike][/strike]', '[fly][/fly]',
            '[color=#00FF00][/color]', '[b][/b]', '[u][/u]', '[i][/i]', '[hr]', '[backcolor=][/backcolor]', '[img][/img]'
        ],
        ref: [
            '出售贴sell=售价', '引用', '隐藏hide=神秘等级', '插入代码', '删除线', '跑马灯', '文字颜色', '粗体', '下划线', '斜体', '水平线', '背景色', '插入图片'
        ]
    },
    Emoji: {
        datatype: 'plain',
        title: '颜文字',
        addr: [
            '(●・ 8 ・●)', '╰(๑◕ ▽ ◕๑)╯', '(﹡ˆˆ﹡)', '〜♪♪', '(ﾟДﾟ≡ﾟДﾟ)', '(＾o＾)ﾉ', '(|||ﾟДﾟ)', '(`ε´ )', '(╬ﾟдﾟ)', '(|||ﾟдﾟ)', '(￣∇￣)',
            '(￣3￣)', '(￣ｰ￣)', '(￣ . ￣)', '(￣︿￣)', '(￣︶￣)', '(*´ω`*)', '(・ω・)', '(⌒▽⌒)', '(￣▽￣）', '(=・ω・=)', '(｀・ω・´)',
            '(〜￣△￣)〜', '(･∀･)', '(°∀°)ﾉ', '(￣3￣)', '╮(￣▽￣)╭', '( ´_ゝ｀)', '←_←', '→_→', '(&lt;_&lt;)', '(&gt;_&gt;)', '(;¬_¬)',
            '(▔□▔)/', '(ﾟДﾟ≡ﾟдﾟ)!?', 'Σ(ﾟдﾟ;)', 'Σ( ￣□￣||)', '(´；ω；`)', '（/TДT)/', '(^・ω・^ )', '(｡･ω･｡)', '(●￣(ｴ)￣●)', 'ε=ε=(ノ≧∇≦)ノ',
            '(´･_･`)', '(-_-#)', '（￣へ￣）', '(￣ε(#￣) Σ', 'ヽ(`Д´)ﾉ', '(╯°口°)╯(┴—┴', '（#-_-)┯━┯', '_(:3」∠)_', '(笑)', '(汗)', '(泣)',
            '(苦笑)', '(´・ω・`)', '(╯°□°）╯︵ ┻━┻', '(╯‵□′)╯︵┻━┻', '( ´ρ`)', '( ﾟωﾟ)', '(oﾟωﾟo)', '(　^ω^)', '(｡◕∀◕｡)', '/( ◕‿‿◕ )\\',
            'ε٩( º∀º )۶з', '(￣ε(#￣)☆╰╮(￣▽￣///)', '（●´3｀）~♪', '_(:з」∠)_', 'хорошо!', '＼(^o^)／', '(•̅灬•̅ )', '(ﾟДﾟ)',
            'まったく、小学生は最高だぜ！！', 'ε=ε=ε=┏(゜ロ゜;)┛', '(；°ほ°)', 'もうこの国は駄目だぁ', 'ヽ(✿ﾟ▽ﾟ)ノ',
            '焔に舞い上がるスパークよ、邪悪な異性交際に、天罰を与え！', 'お疲れ様でした'
        ]
    },
    Acfun: {datatype: 'image', title: 'ACFUN', addr: AcSmileList},
    Common: {datatype: 'image', title: '常用', addr: CommonSmileList},
    Akari: {datatype: 'image', title: 'Akari', addr: AkarinSmileList},
    BiliBili: {datatype: 'image', title: 'BiliBili', addr: BiliBiliSmileList},
    LoveLive: {datatype: 'image', title: 'LoveLive', addr: LoveliveSmallSmileList},
};

/**
 * 添加BBCode
 * @param textArea 文本框
 * @param {string} code BBCode
 * @param {string} selText 选择文本
 */
const addCode = function (textArea, code, selText = '') {
    let startPos = !selText ? (code.indexOf('[img]') > -1 || code.indexOf(']') < 0 ? code.length : code.indexOf(']') + 1) : code.indexOf(selText);
    if (typeof textArea.selectionStart !== 'undefined') {
        let prePos = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
        textArea.selectionStart = prePos + startPos;
        textArea.selectionEnd = prePos + startPos + selText.length;
    }
    else {
        textArea.value += code;
    }
};

/**
 * 显示放大的表情图片
 * @param {jQuery} $img 表情图片对象
 */
const showZoomInImage = function ($img) {
    if ($img.get(0).naturalWidth <= $img.height()) return;
    let offset = $img.offset();
    let $zoomIn = $(`<img class="kfe-zoom-in" src="${$img.attr('src')}" alt="[预览图片]">`).appendTo('body');
    $zoomIn.css({top: offset.top - $zoomIn.outerHeight(), left: offset.left});
};

/**
 * 获取表情面板的HTML代码
 * @param {string} key 菜单关键字
 * @returns {string} 表情面板内容
 */
const getSmilePanelHtml = function (key) {
    let data = MenuList[key];
    if (!data) return '';
    let html = '';
    for (let i = 0; i < data.addr.length; i++) {
        if (data.datatype === 'image') {
            html += `<img class="kfe-smile" src="${data.addr[i]}" alt="[表情]">`;
        }
        else if (data.datatype === 'imageLink') {
            let ref = typeof data.ref !== 'undefined' && typeof data.ref[i] !== 'undefined' ? data.ref[i] : '';
            html += `<img class="kfe-smile" data-code="${ref}" src="${data.addr[i]}" alt="[表情]">`;
        }
        else if (data.datatype === 'plain') {
            let ref = typeof data.ref !== 'undefined' && typeof data.ref[i] !== 'undefined' ? data.ref[i] : data.addr[i];
            html += `<a class="kfe-smile-text" data-code="${data.addr[i]}" href="#">${ref}</a>`;
        }
    }
    return `<div class="kfe-smile-panel" data-key="${key}">${html}</div>`;
};

/**
 * 获取子菜单的HTML代码
 * @returns {string} 子菜单内容
 */
const getSubMenuHtml = function () {
    let html = '';
    $.each(MenuList, function (key, data) {
        html += `<a class="kfe-sub-menu" data-key="${key}" href="#" title="${data.title}">${data.title}</a>`;
    });
    return html;
};

/**
 * 创建容器
 * @param textArea 文本框
 */
const createContainer = function (textArea) {
    let $container = $(`
<div class="kfe-container">
  <div class="kfe-menu">
    <span title="made by eddie32 version ${version}; modified by 喵拉布丁" style="cursor: pointer;"><b>囧⑨</b></span>
    ${getSubMenuHtml()}
    <span class="kfe-close-panel">[-]</span>
  </div>
</div>
`).insertBefore($(textArea));
    $container.on('click', '.kfe-sub-menu', function (e) {
        e.preventDefault();
        let key = $(this).data('key');
        if (!key) return;
        $container.find(`.kfe-smile-panel`).hide();
        let $panel = $container.find(`.kfe-smile-panel[data-key="${key}"]`);
        if ($panel.length > 0) $panel.show();
        else $(getSmilePanelHtml(key)).appendTo($container).show();
    }).on('click', '.kfe-smile, .kfe-smile-text', function (e) {
        e.preventDefault();
        let $this = $(this);
        let code = $this.data('code');
        if (!code) code = `[img]${$this.attr('src')}[/img]`;
        addCode(textArea, code);
        if (/(Mobile|MIDP)/i.test(navigator.userAgent)) textArea.blur();
        else textArea.focus();
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
const appendCss = function () {
    $('head').append(`
<style>
  .kfe-container { padding: 5px; vertical-align: middle; font: 12px/1.7em "sans-serif"; }
  .kfe-menu { margin-bottom: 5px; }
  .kfe-sub-menu { margin: 0 7px; text-decoration: none; border-bottom: 2px solid transparent; }
  .kfe-sub-menu:hover { text-decoration: none; border-color: deeppink; }
  .kfe-smile-panel { display: none; height: 120px; padding: 5px 3px; overflow-y: auto; border-top: 1px solid #ddd; }
  .kfe-smile-panel[data-key="Shortcut"] { height: auto; }
  .kfe-smile { display: inline-block; max-width: 60px; max-height: 60px; cursor: pointer; }
  .kfe-smile-text { display: inline-block; padding: 3px 5px; }
  .kfe-smile-text:hover { color: #fff !important; background-color: #2b2b2b; text-decoration: none; }
  .kfe-close-panel { cursor: pointer; }
  .kfe-zoom-in {
    position: absolute; max-width: 150px; max-height: 150px; background-color: #fcfcfc; border: 3px solid rgba(242, 242, 242, 0.6);
    border-radius: 2px; box-shadow: 0 0 3px rgb(102, 102, 102);
  }
</style>
`);
    if (isKfMobile) {
        $('head').append(`
<style>
  #readPage .kfe-container, #writeMessagePage .kfe-container { margin-top: -10px; }
  .kfe-menu { white-space: nowrap; overflow-x: auto; }
</style>
`);
    }
};

/**
 * 初始化
 */
const init = function () {
    let $textAreas = $('textarea');
    if (!$textAreas.length) return;
    appendCss();
    $textAreas.each(function () {
        createContainer(this);
    });
};

init();

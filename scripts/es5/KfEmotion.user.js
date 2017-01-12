// ==UserScript==
// @name        绯月表情增强插件
// @namespace   https://greasyfork.org/users/5415
// @version     4.1.0
// @author      eddie32
// @description KF论坛专用的回复表情, 插图扩展插件, 在发帖时快速输入自定义表情和论坛BBCODE
// @icon        https://blog.nekohand.moe/favicon.ico
// @homepage    https://github.com/liu599/KF-Emotion-UserScript
// @include     https://*miaola.info/*
// @include     http://*2dkf.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @copyright   2014-2017, eddie32
// @grant       none
// @license     MIT
// @run-at      document-end
// ==/UserScript==
'use strict';

// B站和tora酱

var w4 = [];
for (var j = 0; j < 16; j++) {
    w4[j] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/BiliBili/2233 (' + (j + 1) + ').gif';
}
for (var _j = 16; _j < 30; _j++) {
    w4[_j] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/BiliBili/bilibiliTV (' + (_j + 1 - 17) + ').png';
}
// tora酱
var w5 = [];
for (var _j2 = 0; _j2 < 14; _j2++) {
    w5[_j2] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/tora/0' + (_j2 >= 9 ? _j2 + 1 : '0' + (_j2 + 1)) + '.jpg';
}
w4 = w4.concat(w5);

//阿卡林
var ACSmile1 = [];
for (var _j3 = 0; _j3 < 20; _j3++) {
    ACSmile1[_j3] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/Dynamic/akari' + (_j3 + 1) + '.gif';
}

var AkariSmile1 = [];
for (var _j4 = 0; _j4 < 71; _j4++) {
    AkariSmile1[_j4] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/akari/akari' + (_j4 + 1) + '.png';
}
AkariSmile1 = AkariSmile1.concat(ACSmile1);

// KF拓展, New Game以及巫女控
var kfaux = [];
for (var _j5 = 0; _j5 < 19; _j5++) {
    kfaux[_j5] = 'http://ss.nekohand.moe/Asource/EmotionPic/KFEM (' + (_j5 + 1) + ').gif';
}

var NG = [];
for (var _j6 = 0; _j6 < 62; _j6++) {
    NG[_j6] = 'http://nekohand.moe/spsmile/01Sora/0xx' + (_j6 + 2) + '.png';
}
NG = NG.concat(kfaux);

// ACFUN new
var ACSmile4 = [];
for (var _j7 = 0; _j7 < 50; _j7++) {
    ACSmile4[_j7] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/ACFUN/New/' + (_j7 + 1) + '.png';
}
for (var _j8 = 50; _j8 < 90; _j8++) {
    ACSmile4[_j8] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/EmCol/ACFUN/Niming/' + (_j8 - 50 >= 9 ? _j8 - 49 : '0' + (_j8 - 49)) + '.gif';
}

var functionDescription = ["出售贴sell=售价", "引用", "隐藏hide=神秘等级", "插入代码", "删除线", "跑马灯", "文字颜色", "粗体", "下划线", "斜体", "水平线", "背景色", "插入图片"];

// KF 内置
var KFSmileURL = [];
var KFSmileCode = [];
for (var _j9 = 0; _j9 < 48; _j9++) {
    KFSmileURL[_j9] = (typeof imgpath != 'undefined' ? imgpath : '') + '/post/smile/em/em' + (_j9 >= 9 ? _j9 + 1 : '0' + (_j9 + 1)) + '.gif';
    KFSmileCode[_j9] = '[s:' + (_j9 + 10) + ']';
}

// lovelive专用小
var LoveliveSmalltargetURL = [];
for (var _j10 = 0; _j10 < 40; _j10++) {
    LoveliveSmalltargetURL[_j10] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion02/Small/Lovelive2nd' + (_j10 + 1) + '.png';
    LoveliveSmalltargetURL[_j10 + 40] = 'http://smile.nekohand.moe/blogAcc/LoveliveEmotion01/Small/Lovelive' + (_j10 + 1) + '.png';
}

// 表情菜单
var MenuList = {
    item4: { datatype: 'imageLink', title: 'kf固有', addr: KFSmileURL, ref: KFSmileCode },
    item1: {
        datatype: 'plain',
        title: '快捷',
        addr: ["[sell=100][/sell]", "[quote][/quote]", "[hide=100][/hide]", "[code][/code]", "[strike][/strike]", "[fly][/fly]", "[color=#00FF00][/color]", "[b][/b]", "[u][/u]", "[i][/i]", "[hr]", "[backcolor=][/backcolor]", "[img][/img]"],
        ref: functionDescription
    },
    item2: {
        datatype: 'plain', title: '颜文字', addr: ["(●・ 8 ・●)", "╰(๑◕ ▽ ◕๑)╯", "(﹡ˆˆ﹡)", "〜♪♪", "(ﾟДﾟ≡ﾟДﾟ)", "(＾o＾)ﾉ", "(|||ﾟДﾟ)", "(`ε´ )", "(╬ﾟдﾟ)", "(|||ﾟдﾟ)", "(￣∇￣)", "(￣3￣)", "(￣ｰ￣)", "(￣ . ￣)", "(￣︿￣)", "(￣︶￣)", "(*´ω`*)", "(・ω・)", "(⌒▽⌒)", "(￣▽￣）", "(=・ω・=)", "(｀・ω・´)", "(〜￣△￣)〜", "(･∀･)", "(°∀°)ﾉ", "(￣3￣)", "╮(￣▽￣)╭", "( ´_ゝ｀)", "←_←", "→_→", "(&lt;_&lt;)", "(&gt;_&gt;)", "(;¬_¬)", "(▔□▔)/", "(ﾟДﾟ≡ﾟдﾟ)!?", "Σ(ﾟдﾟ;)", "Σ( ￣□￣||)", "(´；ω；`)", "（/TДT)/", "(^・ω・^ )", "(｡･ω･｡)", "(●￣(ｴ)￣●)", "ε=ε=(ノ≧∇≦)ノ", "(´･_･`)", "(-_-#)", "（￣へ￣）", "(￣ε(#￣) Σ", "ヽ(`Д´)ﾉ", "(╯°口°)╯(┴—┴", "（#-_-)┯━┯", "_(:3」∠)_", "(笑)", "(汗)", "(泣)", "(苦笑)", "(´・ω・`)", "(╯°□°）╯︵ ┻━┻", "(╯‵□′)╯︵┻━┻", "( ´ρ`)", "( ﾟωﾟ)", "(oﾟωﾟo)", "(　^ω^)", "(｡◕∀◕｡)", "/( ◕‿‿◕ )\\", "ε٩( º∀º )۶з", "(￣ε(#￣)☆╰╮(￣▽￣///)", "（●´3｀）~♪", "_(:з」∠)_", "хорошо!", "＼(^o^)／", "(•̅灬•̅ )", "(ﾟДﾟ)", "まったく、小学生は最高だぜ！！", "ε=ε=ε=┏(゜ロ゜;)┛", "(；°ほ°)", "もうこの国は駄目だぁ", "ヽ(✿ﾟ▽ﾟ)ノ", "焔に舞い上がるスパークよ、邪悪な異性交際に、天罰を与え！", "お疲れ様でした"]
    },
    item5: { datatype: 'image', title: 'ACFUN', addr: ACSmile4 },
    item6: { datatype: 'image', title: '常用', addr: NG },
    item7: { datatype: 'image', title: 'Akari', addr: AkariSmile1 },
    item8: { datatype: 'image', title: 'BiliBili', addr: w4 },
    item3: { datatype: 'image', title: 'LoveLive', addr: LoveliveSmalltargetURL }
};

/* Event 函数 */
var EventUtil = {
    getEvent: function getEvent(event) {
        return event ? event : window.event;
    },
    getTarget: function getTarget(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function preventDefault(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function stopPropagation(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    addHandler: function addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false); //DOM2
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler); //IE
        } else {
            element["on" + type] = handler; //DOM 0 
        }
    },
    removeHandler: function removeHandler(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false); //DOM2
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler); //IE
        } else {
            element["on" + type] = null; //DOM 0 
        }
    }
};

var EleUtil = {
    create: function create(ele) {
        return document.createElement(ele);
    },
    selectID: function selectID(ele) {
        return document.getElementById(ele);
    },
    select: function select(selector) {
        return document.querySelector(selector);
    }
};

var createItems = {
    createContainer: function createContainer(key) {
        var ItemContainer = EleUtil.create('div');
        ItemContainer.id = 'eddie32' + key;
        EleUtil.selectID("toggleWindow").style.height = '100px';
        EleUtil.selectID("toggleWindow").appendChild(ItemContainer);
        return ItemContainer;
    },
    createImages: function createImages(key) {
        var outerContainer = createItems.createContainer(key);
        //console.log(MenuList[key]);
        var imgList = MenuList[key].addr;
        var imgLength = imgList.length;
        for (var k = 0; k < imgLength; k++) {
            var imgItem = EleUtil.create('img');
            imgItem.src = imgList[k];
            imgItem.className = 'Ems';
            imgItem.onclick = expandMenu.attachEmotion;
            //imgItem.style.cssText = 'cursor:pointer;padding: 10px 10px:width: 75px;height: 75px;';
            outerContainer.appendChild(imgItem);
        }
    },
    createPlainText: function createPlainText(key) {
        var outerContainer = createItems.createContainer(key);
        //console.log(MenuList[key]);
        var txtList = MenuList[key].addr;
        var txtLength = txtList.length;
        for (var k = 0; k < txtLength; k++) {
            var txtItem = EleUtil.create('span');
            txtItem.style.cssText = "cursor:pointer; margin: 10px 10px;";
            txtItem.innerHTML = '<a data-sign=' + encodeURI(txtList[k]) + ' class="txtBtnEmotion">' + txtList[k] + '</a>';
            if (MenuList[key].ref) {
                txtItem.innerHTML = '<a data-sign=' + encodeURI(txtList[k]) + ' class="txtBtnEmotion">' + MenuList[key].ref[k] + '</a>';
                EleUtil.selectID("toggleWindow").style.height = '50px';
            }
            txtItem.onclick = expandMenu.attachEmotion;
            txtItem.style.cssText = 'cursor:pointer;padding: 10px 10px:width: 50px;';
            outerContainer.appendChild(txtItem);
        }
    },
    createImageLink: function createImageLink(key) {
        //console.log(MenuList[key]);
        var outerContainer = createItems.createContainer(key);
        var imgList = MenuList[key].addr;
        var refList = MenuList[key].ref;
        var imgLength = imgList.length;
        for (var k = 0; k < imgLength; k++) {
            var imgItem = EleUtil.create('img');
            imgItem.dataset.link = refList[k];
            imgItem.src = imgList[k];
            imgItem.className = 'Ems';
            imgItem.onclick = expandMenu.attachEmotion;
            imgItem.style.cssText = 'width: 50px !important;height: 50px !important;';
            outerContainer.appendChild(imgItem);
        }
    }
};

var expandMenu = {
    init: function init(event) {
        createMenu.clear();
        var eventTarget = EventUtil.getTarget(event);
        EleUtil.selectID("toggleWindow").style.display = "block";
        EleUtil.selectID("toggleWindow").style.width = EleUtil.select("textarea").style.width;
        var dataType = eventTarget.attributes[2].nodeValue;
        var dataKey = eventTarget.attributes[1].nodeValue;
        if (EleUtil.select("#eddie32" + dataKey)) {
            console.log(EleUtil.select("#eddie32" + dataKey));
            EleUtil.select("#eddie32" + dataKey).style.display = 'block';
            if (dataKey == 'item1') EleUtil.selectID("toggleWindow").style.height = '50px';else EleUtil.selectID("toggleWindow").style.height = '100px';
            return;
        }
        if (dataType == 'plain') {
            createItems.createPlainText(dataKey);
        } else if (dataType == 'image') {
            createItems.createImages(dataKey);
        } else if (dataType == 'imageLink') {
            createItems.createImageLink(dataKey);
        }
    },
    attachEmotion: function attachEmotion(event) {
        var eventTarget = EventUtil.getTarget(event);
        console.log(eventTarget);
        var emotionAddress = void 0;

        if (eventTarget.attributes.length == 2) {
            if (eventTarget.src) {
                var addressTarget = eventTarget.src;
                emotionAddress = expandMenu.addressParse(addressTarget, 'image');
            } else {
                console.log(eventTarget.attributes);
                var _addressTarget = eventTarget.attributes[0].nodeValue;
                emotionAddress = expandMenu.addressParse(_addressTarget, 'plain');
            }
        } else {
            console.log(eventTarget.attributes);
            var _addressTarget2 = eventTarget.attributes[0].nodeValue;
            emotionAddress = expandMenu.addressParse(_addressTarget2, 'plain');
        }

        var selectTextArea = EleUtil.select("textarea");
        var ovalue = selectTextArea.value;
        var startPos = selectTextArea.selectionStart;
        var endPos = selectTextArea.selectionEnd;
        selectTextArea.value = ovalue.slice(0, startPos) + emotionAddress + ovalue.slice(startPos);
        // console.log(eventTarget);
        // console.log(emotionAddress);
    },
    addressParse: function addressParse(addStr, pattern) {
        var stringReturn = void 0;
        if (pattern === 'image') {
            stringReturn = '[img]' + addStr + '[/img]';
        }
        if (pattern === 'plain') {
            stringReturn = decodeURI(addStr);
        }
        if (pattern === 'imageLink') {
            stringReturn = addStr;
        }
        return stringReturn;
    }
};

var createMenu = {
    defaultID: 'emotion0000',
    main: function main() {
        var mainMenu = EleUtil.create('div');
        mainMenu.innerHTML = '<span title="made by eddie32 version 4.0.0" style="cursor:pointer;"><b>囧⑨</b></span>';
        mainMenu.id = createMenu.defaultID;
        // mainMenu.style.cssText = 'padding:5px 5px;width: 780px; vertical-align: middle;  \
        //                        font: 14px/20px "Hiragino Sans GB","Microsoft YaHei","Arial","sans-serif"';
        var MenuLength = Object.keys(MenuList).length;
        for (var i = 0; i < MenuLength; i++) {
            var MenuKey = Object.keys(MenuList)[i];
            var MenuTitle = MenuList[MenuKey].title;
            var MenuType = MenuList[MenuKey].datatype;
            if (!MenuType || !MenuTitle) console.log('dataerror  ' + MenuKey);
            var testMenu = createMenu.subs(MenuTitle, expandMenu.init, MenuKey, MenuType);
            mainMenu.appendChild(testMenu);
        }
        var closeBtn = EleUtil.create('span');
        closeBtn.innerHTML = '[-]';
        closeBtn.className = "subMenu";
        closeBtn.id = 'closeEM';
        closeBtn.onclick = createMenu.clear;
        mainMenu.appendChild(closeBtn);
        var itemWindow = EleUtil.create('div');
        itemWindow.id = "toggleWindow";
        //itemWindow.style.cssText = '';
        //itemWindow.style.display = 'none';
        mainMenu.appendChild(itemWindow);
        var styleItem = EleUtil.create('style');
        styleItem.innerHTML = '#emotion0000 {padding:5px 5px; vertical-align: middle;  \
                                 font: 14px/20px "Hiragino Sans GB","Microsoft YaHei","Arial","sans-serif"} \
                               #toggleWindow a{padding: 3px 3px;line-height:2} \
                               #toggleWindow { height: 120px; padding: 3px 3px; overflow: auto; margin-top:14px;display:none}\
                               a.subBut{text-decoration: none;} \
                               .Ems{cursor:pointer;padding: 10px 10px:width: 75px;height: 75px;display:inline-block;} \
                               a.subBut:hover{color: deeppink;} \
                               a.txtBtnEmotion{text-decoration:none;} \
                               a.txtBtnEmotion:hover{background: #2b2b2b;color: #fff} \
                               .subMenu{cursor:pointer; width:200px; margin-left: 7px; margin-right: 5px; margin-bottom:5px; background: #fff !important; \
                                 font: 14px/16px "Hiragino Sans GB","Microsoft YaHei","Arial","sans-serif"} \
                               .subMenu:hover{border-bottom: 2px solid deeppink}';
        mainMenu.appendChild(styleItem);
        return mainMenu;
    },
    subs: function subs(title, func, subid, subtype) {
        var subMenu = EleUtil.create('span');
        subMenu.id = subid;
        subMenu.className = "subMenu";
        var subcontent = '<a class="subBut" data-kid=' + subid + ' date-type=' + subtype + '>' + title + '</a>';
        //EleUtil.selectClass(".subBut").style.cssText = 'width: 30px; margin-right: 5px';
        subMenu.onclick = func;
        subMenu.title = title;
        // subMenu.dataset.hook = 'item1';
        subMenu.innerHTML = subcontent;
        return subMenu;
    },
    clear: function clear() {
        //EleUtil.selectID("toggleWindow").innerHTML = '';
        var toggleWindow = EleUtil.selectID("toggleWindow");
        toggleWindow.style.display = "none";
        var togWinChildren = toggleWindow.childNodes;
        for (var _j11 = 0; _j11 < togWinChildren.length; _j11++) {
            //console.log(togWinChildren[j]);
            togWinChildren[_j11].style.display = 'none';
        }
    }
};

var KFE = {
    init: function init() {
        var mainEmotionMenu = createMenu.main();
        //console.log(mainEmotionMenu);
        var textareas = document.getElementsByTagName('textarea');
        if (!textareas.length) {
            return;
        }
        var textarea = EleUtil.select("textarea");
        textarea.parentNode.insertBefore(mainEmotionMenu, textarea);
    }
};

KFE.init();
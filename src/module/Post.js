/* 发帖模块 */
'use strict';
import * as Util from './Util';
import * as Msg from './Msg';
import * as Func from './Func';
import Const from './Const';

/**
 * 处理多重回复和多重引用
 * @param {number} type 处理类型，1：多重回复；2：多重引用
 */
export const handleMultiQuote = function (type = 1) {
    Func.run('Post.handleMultiQuote_before_', type);
    if (!$('#pdClearMultiQuoteData').length) {
        $('<a id="pdClearMultiQuoteData" style="margin-left: 7px;" title="清除在浏览器中保存的多重引用数据" href="#">清除引用数据</a>')
            .insertAfter('input[name="diy_guanjianci"]').click(function (e) {
            e.preventDefault();
            localStorage.removeItem(Const.multiQuoteStorageName);
            $('input[name="diy_guanjianci"]').val('');
            if (type === 2) $('#textarea').val('');
            else $('textarea[name="atc_content"]').val('');
            alert('多重引用数据已被清除');
        });
    }
    let data = localStorage[Const.multiQuoteStorageName];
    if (!data) return;
    try {
        data = JSON.parse(data);
    }
    catch (ex) {
        return;
    }
    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) return;
    let tid = parseInt(Util.getUrlParam('tid')),
        fid = parseInt(Util.getUrlParam('fid'));
    if (!tid || typeof data.tid === 'undefined' || data.tid !== tid || !Array.isArray(data.quoteList)) return;
    if (type === 2 && !fid) return;
    let list = [];
    for (let quote of data.quoteList) {
        if (!Array.isArray(quote)) continue;
        for (let data of quote) {
            list.push(data);
        }
    }
    if (!list.length) {
        localStorage.removeItem(Const.multiQuoteStorageName);
        return;
    }
    let keywords = new Set();
    let content = '';
    if (type === 2) {
        Msg.wait(`<strong>正在获取引用内容中&hellip;</strong><i>剩余：<em class="pd_countdown">${list.length}</em></i>`);
        $(document).clearQueue('MultiQuote');
    }
    $.each(list, function (index, data) {
        if (typeof data.floor === 'undefined' || typeof data.pid === 'undefined') return;
        keywords.add(data.userName);
        if (type === 2) {
            $(document).queue('MultiQuote', function () {
                $.get(`post.php?action=quote&fid=${fid}&tid=${tid}&pid=${data.pid}&article=${data.floor}&t=${new Date().getTime()}`,
                    function (html) {
                        let matches = /<textarea id="textarea".*?>((.|\n)+?)<\/textarea>/i.exec(html);
                        if (matches) {
                            content += Util.removeUnpairedBBCodeContent(
                                    Util.htmlDecode(matches[1]).replace(/\n{2,}/g, '\n')
                                ) + (index === list.length - 1 ? '' : '\n');
                        }
                        let $countdown = $('.pd_countdown:last');
                        $countdown.text(parseInt($countdown.text()) - 1);
                        if (index === list.length - 1) {
                            Msg.destroy();
                            $('#textarea').val(content).focus();
                        }
                        else {
                            setTimeout(function () {
                                $(document).dequeue('MultiQuote');
                            }, 100);
                        }
                    });
            });
        }
        else {
            content += `[quote]回 ${data.floor}楼(${data.userName}) 的帖子[/quote]\n`;
        }
    });
    $('input[name="diy_guanjianci"]').val([...keywords].join(','));
    $('form[name="FORM"]').submit(function () {
        localStorage.removeItem(Const.multiQuoteStorageName);
    });
    if (type === 2) $(document).dequeue('MultiQuote');
    else $('textarea[name="atc_content"]').val(content).focus();
    Func.run('Post.handleMultiQuote_after_', type);
};

/**
 * 去除引用内容中不配对的BBCode
 */
export const removeUnpairedBBCodeInQuoteContent = function () {
    let $content = $('#textarea');
    let content = $content.val();
    let matches = /\[quote\](.|\r|\n)+?\[\/quote\]/.exec(content);
    if (matches) {
        let workedContent = Util.removeUnpairedBBCodeContent(matches[0]);
        if (matches[0] !== workedContent) {
            $content.val(content.replace(matches[0], workedContent));
        }
    }
};

/**
 * 在发帖页面的发帖框上添加额外的按钮
 */
export const addExtraPostEditorButton = function () {
    let textArea = $('textarea[name="atc_content"]').get(0);
    if (!textArea) return;

    $(`
<span id="wy_post" title="插入隐藏内容" data-type="hide" style="background-position: 0 -280px;">插入隐藏内容</span>
<span id="wy_justifyleft" title="左对齐" data-type="left" style="background-position: 0 -360px;">左对齐</span>
<span id="wy_justifycenter" title="居中" data-type="center" style="background-position: 0 -380px;">居中</span>
<span id="wy_justifyright" title="右对齐" data-type="right" style="background-position: 0 -400px;">右对齐</span>
<span id="wy_subscript" title="下标" data-type="sub" style="background-position: 0 -80px;">下标</span>
<span id="wy_superscript" title="上标" data-type="sup" style="background-position: 0 -100px;">上标</span>
<span class="pd_editor_btn" title="插入飞行文字" data-type="fly">F</span>
<span class="pd_editor_btn" title="插入HTML5音频" data-type="audio">A</span>
<span class="pd_editor_btn" title="插入HTML5视频" data-type="video">V</span>
`).appendTo('#editor-button .editor-button').click(function () {
        let $this = $(this);
        let type = $this.data('type');
        let text = '';
        switch (type) {
            case 'hide':
                text = prompt('请输入神秘等级：', 5);
                break;
            case 'audio': {
                text = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐或虾米的单曲地址，将自动转换为外链地址）', 'http://');
                let matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(text);
                if (matches) text = `http://music.miaola.info/163/${matches[1]}.mp3`;
                matches = /^https?:\/\/www\.xiami\.com\/song\/(\d+)/i.exec(text);
                if (matches) text = `http://music.miaola.info/xiami/${matches[1]}.mp3`;
            }
                break;
            case 'video': {
                text = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，将自动转换为外链地址）', 'http://');
                let matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(text);
                if (matches) text = `http://video.miaola.info/youtube/${matches[1]}`;
                matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(text);
                if (matches) text = `http://video.miaola.info/youtube/${matches[1]}`;
            }
                break;
        }
        if (text === null) return;

        let selText = '';
        let code = '';
        switch (type) {
            case 'hide':
                selText = Util.getSelText(textArea);
                code = `[hide=${text}]${selText}[/hide]`;
                break;
            case 'left':
                selText = Util.getSelText(textArea);
                code = `[align=left]${selText}[/align]`;
                break;
            case 'center':
                selText = Util.getSelText(textArea);
                code = `[align=center]${selText}[/align]`;
                break;
            case 'right':
                selText = Util.getSelText(textArea);
                code = `[align=right]${selText}[/align]`;
                break;
            case 'fly':
                selText = Util.getSelText(textArea);
                code = `[fly]${selText}[/fly]`;
                break;
            case 'sub':
                selText = Util.getSelText(textArea);
                code = `[sub]${selText}[/sub]`;
                break;
            case 'sup':
                selText = Util.getSelText(textArea);
                code = `[sup]${selText}[/sup]`;
                break;
            case 'audio':
                code = `[audio]${text}[/audio]`;
                break;
            case 'video':
                code = `[video]${text}[/video]`;
                break;
        }
        if (!code) return;
        Util.addCode(textArea, code, selText);
        textArea.focus();
    }).mouseenter(function () {
        $(this).addClass('buttonHover');
    }).mouseleave(function () {
        $(this).removeClass('buttonHover');
    });
};

/**
 * 在发帖页面上添加额外的选项
 */
export const addExtraOptionInPostPage = function () {
    $(`
<div class="pd_post_extra_option">
  <label><input type="checkbox" name="autoAnalyzeUrl" checked> 自动分析url</label><br>
  <label><input type="checkbox" name="windCodeAutoConvert" checked> Wind Code自动转换</label>
</div>
`).appendTo($('#menu_show')
        .closest('td'))
        .on('click', '[type="checkbox"]', function () {
            let $this = $(this);
            let inputName = $this.is('[name="autoAnalyzeUrl"]') ? 'atc_autourl' : 'atc_convert';
            $('form[name="FORM"]').find(`[name="${inputName}"]`).val($this.prop('checked') ? 1 : 0);
        });

    $('<input type="button" value="预览帖子" style="margin-left: 7px;">')
        .insertAfter('[type="submit"][name="Submit"]')
        .click(function (e) {
            e.preventDefault();
            let $form = $('form[name="preview"]');
            $form.find('input[name="atc_content"]').val($('#textarea').val());
            $form.submit();
        });
};

/**
 * 修正发帖预览页面
 */
export const modifyPostPreviewPage = function () {
    $('table > tbody > tr.tr1 > th').css({
        'text-align': 'left',
        'font-weight': 'normal',
        'border': '1px solid #9191ff',
        'padding': '10px',
    });
};

/**
 * 在发帖页面添加更新附件提醒
 */
export const addAttachChangeAlert = function () {
    $(document).on('click', '.abtn[id^="md_"]', function () {
        if (!$(document).data('attachUpdateAlert')) {
            alert('本反向代理服务器为了提高性能对图片设置了缓存，更新附件图片后可能需等待最多30分钟才能看到效果');
            $(document).data('attachUpdateAlert', true);
        }
    });
};

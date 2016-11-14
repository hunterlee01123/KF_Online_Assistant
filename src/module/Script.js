/* 自定义脚本模块 */
'use strict';
import Info from './Info';
import * as Dialog from './Dialog';
import {read as readConfig, write as writeConfig} from './Config';

import * as Util from './Util';
import * as Func from './Func';
import Const from './Const';
import * as Msg from './Msg';
import * as Log from './Log';
import * as TmpLog from './TmpLog';
import * as Public from './Public';
import * as Index from './Index';
import * as Read from './Read';
import * as Post from './Post';
import * as Other from './Other';
import * as Bank from './Bank';
import * as Card from './Card';
import * as Item from './Item';
import * as Loot from './Loot';

// 默认脚本名称
const defScriptName = '未命名脚本';
// 脚本meta信息的正则表达式
const metaRegexp = /\/\/\s*==UserScript==((?:.|\n)+?)\/\/\s*==\/UserScript==/i;

/**
 * 执行自定义脚本
 * @param {string} type 脚本执行时机，start：在脚本开始时执行；end：在脚本结束时执行
 */
export const runCustomScript = function (type = 'end') {
    for (let {enabled, trigger, content} of Config.customScriptList) {
        if (enabled && trigger === type && content) {
            runCmd(content);
        }
    }
};

/**
 * 运行命令
 * @param {string} cmd 命令
 * @param {boolean} isOutput 是否在控制台上显示结果
 * @returns {string} 运行结果
 */
export const runCmd = function (cmd, isOutput = false) {
    let result = '';
    try {
        result = eval(cmd);
        if (isOutput) console.log(result);
    }
    catch (ex) {
        result = ex;
        console.log(ex);
    }
    return String(result);
};

/**
 * 获取脚本meta信息
 * @param {string} content 脚本内容
 * @returns {{}} 脚本meta信息
 */
const getScriptMeta = function (content) {
    let meta = {
        name: defScriptName,
        version: '',
        trigger: 'end',
        homepage: '',
        author: '',
    };
    let matches = metaRegexp.exec(content);
    if (!matches) return meta;
    let metaContent = matches[1];
    matches = /@name[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.name = matches[1];
    matches = /@version[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.version = matches[1];
    matches = /@trigger[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.trigger = matches[1].toLowerCase() === 'start' ? 'start' : 'end';
    matches = /@homepage[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.homepage = matches[1];
    matches = /@author[ \t]+(.*)/i.exec(metaContent);
    if (matches) meta.author = matches[1];
    return meta;
};

/**
 * 显示自定义脚本对话框
 * @param {?number} showIndex 要显示的脚本的序号（-1表示最后一个）
 */
export const showDialog = function (showIndex = null) {
    const dialogName = 'pd_custom_script';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px;">
    <a class="pd_highlight pd_btn_link" data-name="addNewScript" href="#">添加新脚本</a>
    <a class="pd_btn_link" data-name="insertSample" href="#">插入范例</a>
  </div>
  <div data-name="customScriptList"></div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500968">其他人分享的自定义脚本</a></span>
  <button name="ok">确定</button> <button name="cancel">取消</button> <button class="pd_highlight" name="clear">清空</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义脚本', html, 'min-width: 776px;');
    let $customScriptList = $dialog.find('[data-name="customScriptList"]');

    $dialog.find('[name="ok"]').click(function (e) {
        e.preventDefault();
        Config.customScriptList = [];
        $customScriptList.find('.pd_custom_script_content').each(function () {
            let $this = $(this);
            let content = $this.val();
            if (!$.trim(content)) return;
            let enabled = $this.prev().find('[type="checkbox"]').prop('checked');
            Config.customScriptList.push($.extend(getScriptMeta(content), {enabled, content}));
        });
        writeConfig();
        Dialog.close(dialogName);
    }).end().find('[name="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清空所有脚本？')) {
            $customScriptList.html('');
            Dialog.show(dialogName);
        }
    }).end().find('[name="cancel"]').click(() => Dialog.close(dialogName));

    /**
     * 添加自定义脚本
     * @param {boolean} enabled 是否启用脚本
     * @param {string} name 脚本名称
     * @param {string} version 版本号
     * @param {url} homepage 首页
     * @param {string} trigger 脚本执行时机
     * @param {string} content 脚本内容
     */
    const addCustomScript = function ({
        enabled = true,
        name = defScriptName,
        version = '',
        homepage = '',
        trigger = 'end',
        content = '',
    } = {}) {
        $customScriptList.append(`
<div class="pd_custom_script_header">
  <input type="checkbox" ${enabled ? 'checked' : ''} title="是否启用此脚本">
  <a class="pd_custom_script_name" href="#" style="margin-left: 5px;">[${name}]</a>
  <span data-name="version" style="margin-left: 5px; color: #666;" ${!version ? 'hidden' : ''}>${version}</span>
  <span data-name="trigger" style="margin-left: 5px; color: ${trigger === 'start' ? '#f00' : '#00f'};" title="脚本执行时机">
    [${trigger === 'start' ? '开始时' : '结束时'}]
  </span>
  <a data-name="homepage" href="${homepage}" target="_blank" style="margin-left: 5px;" ${!homepage ? 'hidden' : ''}>[主页]</a>
  <a data-name="delete" href="#" style="margin-left: 5px; color: #666;">[删除]</a>
</div>
<textarea class="pd_custom_script_content" wrap="off">${content}</textarea>
`);
    };

    for (let data of Config.customScriptList) {
        addCustomScript(data);
    }

    $dialog.find('[data-name="addNewScript"]').click(function (e) {
        e.preventDefault();
        $customScriptList.find('.pd_custom_script_content').hide();
        addCustomScript();
        $customScriptList.find('.pd_custom_script_content:last').show().focus();
        Dialog.show(dialogName);
    }).end().find('[data-name="insertSample"]').click(function (e) {
        e.preventDefault();
        let $content = $customScriptList.find('.pd_custom_script_content:visible');
        $content.val(`
// ==UserScript==
// @name        ${defScriptName}
// @version     1.0
// @author      ${Info.userName}
// @trigger     end
// @homepage    read.php?tid=500968&spid=12318348
// @description 这是一个未命名脚本
// ==/UserScript==
`.trim() + '\n' + $content.val()).focus();
    });

    $customScriptList.on('click', '.pd_custom_script_name', function (e) {
        e.preventDefault();
        $dialog.find('.pd_custom_script_content').hide();
        $(this).parent().next().show().focus();
        Dialog.show(dialogName);
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        if (!confirm('是否删除此脚本？')) return;
        let $header = $(this).closest('.pd_custom_script_header');
        $header.next().remove();
        $header.remove();
        Dialog.show(dialogName);
    }).on('change', '.pd_custom_script_content', function () {
        let $this = $(this);
        let {name, version, homepage, trigger} = getScriptMeta($this.val());
        let $header = $this.prev();
        $header.find('.pd_custom_script_name').text(`[${name ? name : defScriptName}]`);
        $header.find('[data-name="version"]').text(version).prop('hidden', !version);
        $header.find('[data-name="homepage"]').attr('href', homepage ? homepage : '').prop('hidden', !homepage);
        $header.find('[data-name="trigger"]').html(`[${trigger === 'start' ? '开始时' : '结束时'}]`)
            .css('color', trigger === 'start' ? '#f00' : '#00f');
    });


    Dialog.show(dialogName);
    if (typeof showIndex === 'number') {
        $customScriptList.find('.pd_custom_script_name').eq(showIndex).click();
    }
    else {
        $dialog.find('a:first').focus();
    }
};

/**
 * 处理安装自定义脚本按钮
 */
export const handleInstallScriptLink = function () {
    $(document).on('click', 'a[href$="#install-script"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $area = $this.nextAll('.pd_code_area').eq(0);
        if (!$area.length) return;
        let content = Util.htmlDecode($area.html().replace(/<legend>.+?<\/legend>/i, '')).trim();
        if (!metaRegexp.test(content)) return;
        readConfig();
        let meta = getScriptMeta(content);
        let index = Config.customScriptList.findIndex(script => script.name === meta.name && script.author === meta.author);
        let type = index > -1 ? 1 : 0;
        if (!confirm(`是否${type === 1 ? '更新' : '安装'}此脚本？`)) return;
        let script = $.extend(meta, {enabled: true, content});
        if (type === 1) Config.customScriptList[index] = script;
        else Config.customScriptList.push(script);
        writeConfig();
        Dialog.close('pd_custom_script');
        showDialog(index);
    });
};

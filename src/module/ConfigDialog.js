/* 设置对话框模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Dialog from './Dialog';
import Const from './Const';
import {
    read as readConfig,
    write as writeConfig,
    clear as clearConfig,
    changeStorageType,
    normalize as normalizeConfig,
    Config as defConfig,
} from './Config';
import * as TmpLog from './TmpLog';
import * as Public from './Public';
import * as Script from './Script';

/**
 * 显示设置对话框
 */
export const show = function () {
    const dialogName = 'pdConfigDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    Script.runFunc('ConfigDialog.show_before_');
    let html = `
<div class="pd_cfg_main">
  <div class="pd_cfg_nav">
    <a class="pd_btn_link" data-name="clearTmpData" title="清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）" href="#">清除临时数据</a>
    <a class="pd_btn_link" data-name="openRumCommandDialog" href="#">运行命令</a>
    <a class="pd_btn_link" data-name="openImportOrExportSettingDialog" href="#">导入/导出设置</a>
  </div>

  <div class="pd_cfg_panel" style="margin-bottom: 5px;">
    <fieldset>
      <legend>
        <label>
          <input name="timingModeEnabled" type="checkbox"> 定时模式
          <span class="pd_cfg_tips" title="可按时进行自动操作（包括自动领取每日奖励、自动提升战力光环、自动争夺，需开启相关功能）
只在论坛首页和争夺首页生效（不开启此模式的话只能在刷新页面后才会进行操作）">[?]</span>
        </label>
      </legend>
      <label>
        标题提示方案
        <select name="showTimingModeTipsType">
          <option value="auto">停留一分钟后显示</option>
          <option value="always">总是显示</option>
          <option value="never">不显示</option>
        </select>
        <span class="pd_cfg_tips" title="在首页的网页标题上显示定时模式提示的方案">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label><input name="autoGetDailyBonusEnabled" type="checkbox"> 自动领取每日奖励</label>
      </legend>
      <label>
        <input name="getBonusAfterLootCompleteEnabled" type="checkbox"> 完成争夺后才领取
        <span class="pd_cfg_tips" title="在完成争夺奖励后才领取每日奖励">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="getBonusAfterSpeakCompleteEnabled" type="checkbox"> 完成发言后才领取
        <span class="pd_cfg_tips" title="在完成发言奖励后才领取每日奖励">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>
        <label><input name="autoPromoteHaloEnabled" type="checkbox"> 自动提升战力光环</label>
      </legend>
      <label>
        花费
        <select name="promoteHaloCostType" required>
          <option value="1">100KFB</option>
          <option value="2">1000KFB</option>
          <option value="11">0.2贡献</option>
          <option value="12">2贡献</option>
        </select>
        <span class="pd_cfg_tips" title="提升战力光环的花费类型">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        每隔 <input name="promoteHaloInterval" type="number" min="8" style="width: 40px;" required> 小时
        <span class="pd_cfg_tips" title="自动提升战力光环的间隔时间，最低值：8小时">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="promoteHaloAutoIntervalEnabled" type="checkbox" data-mutex="[name=promoteHaloInterval]"> 自动判断
        <span class="pd_cfg_tips" title="自动判断提升战力光环的间隔时间（在有剩余次数时尽可能使用）">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>争夺相关</legend>
      <label>
        <input name="autoLootEnabled" type="checkbox" data-mutex="[name=autoSaveLootLogInSpecialCaseEnabled]"> 自动争夺
        <span class="pd_cfg_tips" title="当发现可以进行争夺时，会跳转到争夺首页进行自动攻击（点数分配等相关功能请在争夺首页上设置）">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        攻击到第 <input name="attackTargetLevel" type="number" min="0" style="width: 40px;" required> 层
        <span class="pd_cfg_tips" title="自动争夺的目标攻击层数（设为0表示攻击到被击败为止）">[?]</span>
      </label><br>
      <label>
        <input name="autoSaveLootLogInSpecialCaseEnabled" type="checkbox"> 在不使用助手争夺的情况下自动保存争夺记录
        <span class="pd_cfg_tips" title="在不使用助手争夺的情况下自动检查并保存争夺记录（使用助手进行争夺的用户请勿勾选此选项）">[?]</span>
      </label><br>
      <label>
        在 <input name="checkLootAfterTime" type="text" maxlength="8" style="width: 55px;" required> 之后争夺
        <span class="pd_cfg_tips" title="在当天的指定时间之后检查争夺情况（本地时间），例：00:05:00">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        争夺记录保存天数 <input name="lootLogSaveDays" type="number" min="1" max="90" style="width: 40px;" required>
        <span class="pd_cfg_tips" title="默认值：${defConfig.lootLogSaveDays}">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>帖子页面相关</legend>
      <label>
        帖子每页楼层数量
        <select name="perPageFloorNum">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <span class="pd_cfg_tips" title="用于电梯直达和帖子页数快捷链接等功能，如果修改了论坛设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        帖子内容字体大小 <input name="threadContentFontSize" type="number" min="7" max="72" style="width: 40px;"> px
        <span class="pd_cfg_tips" title="帖子内容字体大小，留空表示使用默认大小，推荐值：14">[?]</span>
      </label><br>
      <label>
        <input name="adjustThreadContentWidthEnabled" type="checkbox"> 调整帖子内容宽度
        <span class="pd_cfg_tips" title="调整帖子内容宽度，使其保持一致">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="turnPageViaKeyboardEnabled" type="checkbox"> 通过左右键翻页
        <span class="pd_cfg_tips" title="在帖子和搜索页面通过左右键进行翻页">[?]</span>
      </label><br>
      <label>
        <input name="autoChangeIdColorEnabled" type="checkbox" data-disabled="[data-name=openAutoChangeSmColorPage]"> 自动更换ID颜色
        <span class="pd_cfg_tips" title="可自动更换ID颜色，请点击详细设置前往相应页面进行自定义设置">[?]</span>
      </label>
      <a data-name="openAutoChangeSmColorPage" class="pd_cfg_ml" target="_blank" href="kf_growup.php">详细设置&raquo;</a><br>
      <label>
        自定义本人的神秘颜色 <input name="customMySmColor" maxlength="7" style="width: 50px;" type="text">
        <input style="margin-left: 0;" type="color" data-name="customMySmColorSelect">
        <span class="pd_cfg_tips" title="自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009cff，如无需求可留空">[?]</span>
      </label><br>
      <label>
        <input name="customSmColorEnabled" type="checkbox" data-disabled="[data-name=openCustomSmColorDialog]"> 自定义各等级神秘颜色
        <span class="pd_cfg_tips" title="自定义各等级神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），请点击详细设置自定义各等级颜色">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openCustomSmColorDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="userMemoEnabled" type="checkbox" data-disabled="[data-name=openUserMemoDialog]"> 显示用户备注
        <span class="pd_cfg_tips" title="在楼层内的用户名旁显示该用户的自定义备注，请点击详细设置自定义用户备注">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openUserMemoDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="modifyKfOtherDomainEnabled" type="checkbox"> 将绯月其它域名的链接修改为当前域名
        <span class="pd_cfg_tips" title="将帖子和短消息中的绯月其它域名的链接修改为当前域名">[?]</span>
      </label><br>
      <label>
        <input name="multiQuoteEnabled" type="checkbox"> 开启多重引用功能
        <span class="pd_cfg_tips" title="在帖子页面开启多重回复和多重引用功能">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="parseMediaTagEnabled" type="checkbox"> 解析多媒体标签
        <span class="pd_cfg_tips" title="在帖子页面解析HTML5多媒体标签，详见【常见问题12】">[?]</span>
      </label><br>
      <label>
        <input name="buyThreadNoJumpEnabled" type="checkbox"> 购买帖子时不跳转
        <span class="pd_cfg_tips" title="使用Ajax的方式购买帖子，购买时页面不会跳转">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="kfSmileEnhanceExtensionEnabled" type="checkbox" ${Info.isInMiaolaDomain ? '' : 'disabled'}> 开启绯月表情增强插件
        <span class="pd_cfg_tips" title="在发帖框上显示绯月表情增强插件（仅在miaola.info域名下生效），该插件由eddie32开发">[?]</span>
      </label><br>
      <label>
        <input name="preventCloseWindowWhenEditPostEnabled" type="checkbox"> 写帖子时阻止关闭页面
        <span class="pd_cfg_tips" title="在撰写发帖内容时，如不小心关闭了页面会进行提示">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="autoSavePostContentWhenSubmitEnabled" type="checkbox"> 提交时保存发帖内容
        <span class="pd_cfg_tips" title="在提交时自动保存发帖内容，以便在出现意外情况时能够恢复发帖内容（需在不关闭当前标签页的情况下才能起效）">[?]</span>
      </label>
    </fieldset>
  </div>

  <div class="pd_cfg_panel">
    <fieldset>
      <legend>首页相关</legend>
      <label>
        @提醒
        <select name="atTipsHandleType" style="width: 130px;">
          <option value="no_highlight">取消已读提醒高亮</option>
          <option value="no_highlight_extra">取消已读提醒高亮，并在无提醒时补上消息框</option>
          <option value="hide_box_1">不显示已读提醒的消息框</option>
          <option value="hide_box_2">永不显示消息框</option>
          <option value="default">保持默认</option>
          <option value="at_change_to_cao">将@改为艹(其他和方式2相同)</option>
        </select>
        <span class="pd_cfg_tips" title="对首页上的有人@你的消息框进行处理的方案">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="smLevelUpAlertEnabled" type="checkbox"> 神秘等级升级提醒
        <span class="pd_cfg_tips" title="在神秘等级升级后进行提醒，只在首页生效">[?]</span>
      </label><br>
      <label>
        <input name="fixedDepositDueAlertEnabled" type="checkbox"> 定期存款到期提醒
        <span class="pd_cfg_tips" title="在定时存款到期时进行提醒，只在首页生效">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="smRankChangeAlertEnabled" type="checkbox"> 系数排名变化提醒
        <span class="pd_cfg_tips" title="在神秘系数排名发生变化时进行提醒，只在首页生效">[?]</span>
      </label><br>
      <label>
        <input name="homePageThreadFastGotoLinkEnabled" type="checkbox"> 在首页帖子旁显示跳转链接
        <span class="pd_cfg_tips" title="在首页帖子链接旁显示快速跳转至页末的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="showVipSurplusTimeEnabled" type="checkbox"> 显示VIP剩余时间
        <span class="pd_cfg_tips" title="在首页显示VIP剩余时间">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>版块页面相关</legend>
      <label>
        <input name="showFastGotoThreadPageEnabled" type="checkbox" data-disabled="[name=maxFastGotoThreadPageNum]"> 显示帖子页数快捷链接
        <span class="pd_cfg_tips" title="在版块页面中显示帖子页数快捷链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        页数链接最大数量 <input name="maxFastGotoThreadPageNum" type="number" min="1" max="10" style="width: 40px;" required>
        <span class="pd_cfg_tips" title="在帖子页数快捷链接中显示页数链接的最大数量">[?]</span>
      </label><br>
      <label>
        <input name="highlightNewPostEnabled" type="checkbox"> 高亮今日的新帖
        <span class="pd_cfg_tips" title="在版块页面中高亮今日新发表帖子的发表时间">[?]</span>
      </label>
    </fieldset>
    <fieldset>
      <legend>其它设置</legend>
      <label class="pd_highlight">
        存储类型
        <select data-name="storageType">
          <option value="Default">默认</option>
          <option value="ByUid">按uid</option>
          <option value="Global">全局</option>
        </select>
        <span class="pd_cfg_tips" title="助手设置和日志的存储方式，详情参见【常见问题1】">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        浏览器类型
        <select name="browseType">
          <option value="auto">自动检测</option>
          <option value="desktop">桌面版</option>
          <option value="mobile">移动版</option>
        </select>
        <span class="pd_cfg_tips" title="用于在KFOL助手上判断浏览器的类型，一般使用自动检测即可；
如果当前浏览器与自动检测的类型不相符（移动版会在设置界面标题上显示“For Mobile”的字样），请手动设置为正确的类型">[?]</span>
      </label><br>
      <label>
        消息显示时间 <input name="defShowMsgDuration" type="number" min="-1" style="width: 46px;" required> 秒
        <span class="pd_cfg_tips" title="默认的消息显示时间（秒），设置为-1表示永久显示，例：15">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        日志保存天数 <input name="logSaveDays" type="number" min="1" max="365" style="width: 46px;" required>
        <span class="pd_cfg_tips" title="默认值：${defConfig.logSaveDays}">[?]</span>
      </label><br>
      <label>
        <input name="showSearchLinkEnabled" type="checkbox"> 显示搜索链接
        <span class="pd_cfg_tips" title="在页面上方显示搜索对话框的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="animationEffectOffEnabled" type="checkbox"> 禁用动画效果
        <span class="pd_cfg_tips" title="禁用jQuery的动画效果（推荐在配置较差的机器上使用）">[?]</span>
      </label><br>
      <label>
        <input name="addSideBarFastNavEnabled" type="checkbox"> 为侧边栏添加快捷导航
        <span class="pd_cfg_tips" title="为侧边栏添加快捷导航的链接">[?]</span>
      </label>
      <label class="pd_cfg_ml">
        <input name="modifySideBarEnabled" type="checkbox"> 将侧边栏修改为平铺样式
        <span class="pd_cfg_tips" title="将侧边栏修改为和手机相同的平铺样式">[?]</span>
      </label><br>
      <label>
        <input name="customCssEnabled" type="checkbox" data-disabled="[data-name=openCustomCssDialog]"> 添加自定义CSS
        <span class="pd_cfg_tips" title="为页面添加自定义的CSS内容，请点击详细设置填入自定义的CSS内容">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openCustomCssDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="customScriptEnabled" type="checkbox" data-disabled="[data-name=openCustomScriptDialog]"> 执行自定义脚本
        <span class="pd_cfg_tips" title="执行自定义的javascript脚本，请点击详细设置填入自定义的脚本内容">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openCustomScriptDialog" href="#">详细设置&raquo;</a>
    </fieldset>
    <fieldset>
      <legend>关注和屏蔽</legend>
      <label>
        <input name="followUserEnabled" type="checkbox" data-disabled="[data-name=openFollowUserDialog]"> 关注用户
        <span class="pd_cfg_tips" title="开启关注用户的功能，所关注的用户将被加注记号，请点击详细设置管理关注用户">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openFollowUserDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="blockUserEnabled" type="checkbox" data-disabled="[data-name=openBlockUserDialog]"> 屏蔽用户
        <span class="pd_cfg_tips" title="开启屏蔽用户的功能，你将看不见所屏蔽用户的发言，请点击详细设置管理屏蔽用户">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openBlockUserDialog" href="#">详细设置&raquo;</a><br>
      <label>
        <input name="blockThreadEnabled" type="checkbox" data-disabled="[data-name=openBlockThreadDialog]"> 屏蔽帖子
        <span class="pd_cfg_tips" title="开启屏蔽标题中包含指定关键字的帖子的功能，请点击详细设置管理屏蔽关键字">[?]</span>
      </label>
      <a class="pd_cfg_ml" data-name="openBlockThreadDialog" href="#">详细设置&raquo;</a><br>
    </fieldset>
    <fieldset>
      <legend>
        <label>
          <input name="autoSaveCurrentDepositEnabled" type="checkbox"> 自动活期存款
          <span class="pd_cfg_tips" title="在当前收入满足指定额度之后自动将指定数额存入活期存款中，只会在首页触发">[?]</span>
        </label>
      </legend>
      <label>
        在当前收入已满 <input name="saveCurrentDepositAfterKfb" type="number" min="1" style="width: 80px;"> KFB之后
        <span class="pd_cfg_tips" title="在当前收入已满指定KFB额度之后自动进行活期存款，例：1000">[?]</span>
      </label><br>
      <label>
        将 <input name="saveCurrentDepositKfb" type="number" min="1" style="width: 80px;"> KFB存入活期存款
        <span class="pd_cfg_tips" title="将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800">[?]</span>
      </label>
    </fieldset>
  </div>
</div>

<div class="pd_cfg_btns">
  <span class="pd_cfg_about">
    <a target="_blank" href="read.php?tid=508450">By 喵拉布丁</a>
    <i style="color: #666; font-style: normal;">(V${Info.version})</i>
    <a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">[常见问题]</a>
  </span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
  <button name="default" type="button">默认值</button>
</div>`;
    let $dialog = Dialog.create(dialogName, 'KFOL助手设置' + (Info.isMobile ? ' (For Mobile)' : ''), html);

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!verifyMainConfig($dialog)) return;
        let oriAutoRefreshEnabled = Config.timingModeEnabled;
        readConfig();
        let options = getMainConfigValue($dialog);
        options = normalizeConfig(options);
        $.extend(Config, options);
        writeConfig();
        let storageType = $dialog.find('[data-name="storageType"]').val();
        if (storageType !== Info.storageType) {
            if (!confirm('是否修改存储类型？')) return;
            changeStorageType(storageType);
            alert('存储类型已修改');
            location.reload();
            return;
        }
        Dialog.close(dialogName);
        if (oriAutoRefreshEnabled !== options.timingModeEnabled) {
            if (confirm('你已修改了定时模式的设置，需要刷新页面才能生效，是否立即刷新？')) {
                location.reload();
            }
        }
    }).find('[name="default"]').click(function () {
        if (confirm('是否重置所有设置？')) {
            clearConfig();
            alert('设置已重置');
            location.reload();
        }
    }).end().find('[data-name="clearTmpData"]').click(function (e) {
        e.preventDefault();
        let type = prompt(
            '可清除与助手有关的Cookies和本地临时数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地临时数据', 0
        );
        if (type === null) return;
        type = parseInt(type);
        if (!isNaN(type) && type >= 0) {
            clearTmpData(type);
            alert('缓存已清除');
        }
    });

    $dialog.on('click', 'a[data-name^="open"][href="#"]', function (e) {
        e.preventDefault();
        let $this = $(this);
        if ($this.hasClass('pd_disabled_link')) return;
        let name = $this.data('name');
        if (name === 'openRumCommandDialog') showRunCommandDialog();
        if (name === 'openImportOrExportSettingDialog') showImportOrExportSettingDialog();
        if (name === 'openCustomSmColorDialog') showCustomSmColorDialog();
        else if (name === 'openUserMemoDialog') showUserMemoDialog();
        else if (name === 'openCustomCssDialog') showCustomCssDialog();
        else if (name === 'openCustomScriptDialog') Script.showDialog();
        else if (name === 'openFollowUserDialog') showFollowUserDialog();
        else if (name === 'openBlockUserDialog') showBlockUserDialog();
        else if (name === 'openBlockThreadDialog') showBlockThreadDialog();
    }).find('[data-name="customMySmColorSelect"]').change(function () {
        $dialog.find('[name="customMySmColor"]').val($(this).val().toString().toLowerCase());
    }).end().find('[name="customMySmColor"]').change(function () {
        let color = $.trim($(this).val());
        if (/^#[0-9a-fA-F]{6}$/.test(color)) $dialog.find('[data-name="customMySmColorSelect"]').val(color.toLowerCase());
    });

    setMainConfigValue($dialog);
    Dialog.show(dialogName);
    Script.runFunc('ConfigDialog.show_after_');
};

/**
 * 设置主对话框中的字段值
 * @param {jQuery} $dialog 助手设置对话框对象
 */
const setMainConfigValue = function ($dialog) {
    $dialog.find('input[name], select[name]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean') $this.prop('checked', Config[name] === true);
            else $this.val(Config[name]);
        }
    });
    $dialog.find('[name="threadContentFontSize"]').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
    $dialog.find('[data-name="customMySmColorSelect"]').val(Config.customMySmColor);

    $dialog.find('[data-name="storageType"]').val(Info.storageType);
    if (typeof GM_getValue === 'undefined') $dialog.find('[data-name="storageType"] > option:gt(0)').prop('disabled', true);
};

/**
 * 获取主对话框中字段值的Config对象
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {{}} 字段值的Config对象
 */
const getMainConfigValue = function ($dialog) {
    let options = {};
    $dialog.find('input[name], select[name]').each(function () {
        let $this = $(this);
        let name = $this.attr('name');
        if (name in Config) {
            if ($this.is('[type="checkbox"]') && typeof Config[name] === 'boolean')
                options[name] = Boolean($this.prop('checked'));
            else if (typeof Config[name] === 'number') {
                options[name] = parseInt($this.val());
                if (name === 'threadContentFontSize' && isNaN(options[name])) options[name] = 0;
            }
            else options[name] = $.trim($this.val());
        }
    });
    return options;
};

/**
 * 验证主对话框设置是否正确
 * @param {jQuery} $dialog 助手设置对话框对象
 * @returns {boolean} 是否验证通过
 */
const verifyMainConfig = function ($dialog) {
    let $txtCheckLootAfterTime = $dialog.find('[name="checkLootAfterTime"]');
    let checkLootAfterTime = $.trim($txtCheckLootAfterTime.val());
    if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(checkLootAfterTime)) {
        alert('在指定时间之后争夺格式不正确');
        $txtCheckLootAfterTime.select().focus();
        return false;
    }

    let $txtCustomMySmColor = $dialog.find('[name="customMySmColor"]');
    let customMySmColor = $.trim($txtCustomMySmColor.val());
    if (customMySmColor && !/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
        alert('自定义本人的神秘颜色格式不正确，例：#009cff');
        $txtCustomMySmColor.select().focus();
        return false;
    }

    let $txtSaveCurrentDepositAfterKfb = $dialog.find('[name="saveCurrentDepositAfterKfb"]');
    let $txtSaveCurrentDepositKfb = $dialog.find('[name="saveCurrentDepositKfb"]');
    let saveCurrentDepositAfterKfb = parseInt($txtSaveCurrentDepositAfterKfb.val());
    let saveCurrentDepositKfb = parseInt($txtSaveCurrentDepositKfb.val());
    if (saveCurrentDepositAfterKfb || saveCurrentDepositKfb) {
        if (!saveCurrentDepositAfterKfb || saveCurrentDepositAfterKfb <= 0) {
            alert('自动活期存款满足额度格式不正确');
            $txtSaveCurrentDepositAfterKfb.select().focus();
            return false;
        }
        if (!saveCurrentDepositKfb || saveCurrentDepositKfb <= 0 || saveCurrentDepositKfb > saveCurrentDepositAfterKfb) {
            alert('想要存款的金额格式不正确');
            $txtSaveCurrentDepositKfb.select().focus();
            return false;
        }
    }

    return true;
};

/**
 * 清除临时数据
 * @param {number} type 清除类别，0：全部清除；1：清除Cookies；2：清除本地临时数据
 */
const clearTmpData = function (type = 0) {
    if (type === 0 || type === 1) {
        for (let key in Const) {
            if (/CookieName$/.test(key)) {
                Util.deleteCookie(Const[key]);
            }
        }
    }
    if (type === 0 || type === 2) {
        TmpLog.clear();
        localStorage.removeItem(Const.multiQuoteStorageName);
    }
};

/**
 * 显示运行命令对话框
 */
const showRunCommandDialog = function () {
    const dialogName = 'pdRunCommandDialog';
    if ($('#' + dialogName).length > 0) return;
    Dialog.close('pdConfigDialog');
    let html = `
<div class="pd_cfg_main">
  <div style="margin: 5px 0;">
    运行命令快捷键：<b>Ctrl+Enter</b>；清除命令快捷键：<b>Ctrl+退格键</b><br>
    按<b>F12键</b>可打开浏览器控制台查看消息（需切换至控制台或Console标签）
  </div>
  <textarea name="cmd" wrap="off" style="width: 750px; height: 300px; white-space: pre;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button type="submit">运行</button>
  <button name="clear" type="button">清除</button>
  <button data-action="close" type="button">关闭</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '运行命令', html);
    let $cmd = $dialog.find('[name="cmd"]');

    $dialog.submit(function (e) {
        e.preventDefault();
        let content = $cmd.val();
        if (content) Script.runCmd(content, true);
    }).end().find('[name="clear"]').click(function () {
        $cmd.val('').focus();
    });

    $cmd.keydown(function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
            $dialog.submit();
        }
        else if (e.ctrlKey && e.keyCode === 8) {
            $dialog.find('[name="clear"]').click();
        }
    });

    Dialog.show(dialogName);
    $cmd.focus();
};

/**
 * 显示导入或导出设置对话框
 */
const showImportOrExportSettingDialog = function () {
    const dialogName = 'pdImOrExSettingDialog';
    if ($('#' + dialogName).length > 0) return;
    readConfig();
    let html = `
<div class="pd_cfg_main">
  <div>
    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br>
    <strong>导出设置：</strong>复制文本框里的内容并粘贴到别处即可
  </div>
  <textarea name="setting" style="width: 600px; height: 400px; word-break: break-all;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '导入或导出设置', html);
    let $setting = $dialog.find('[name="setting"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        if (!confirm('是否导入文本框中的设置？')) return;
        let options = $.trim($setting.val());
        if (!options) return;
        try {
            options = JSON.parse(options);
        }
        catch (ex) {
            alert('设置有错误');
            return;
        }
        if (!options || $.type(options) !== 'object') {
            alert('设置有错误');
            return;
        }
        options = normalizeConfig(options);
        Info.w.Config = $.extend(true, {}, defConfig, options);
        writeConfig();
        alert('设置已导入');
        location.reload();
    });
    Dialog.show(dialogName);
    $setting.val(JSON.stringify(Util.getDifferenceSetOfObject(defConfig, Config))).select().focus();
};

/**
 * 显示自定义各等级神秘颜色设置对话框
 */
const showCustomSmColorDialog = function () {
    const dialogName = 'pdCustomSmColorDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="border-bottom: 1px solid #9191ff; margin-bottom: 7px; padding-bottom: 5px;">
    <strong>
      示例（<a target="_blank" href="http://www.35ui.cn/jsnote/peise.html">常用配色表</a> / 
      <a target="_blank" href="read.php?tid=488016">配色方案收集贴</a>）：
    </strong><br>
    <b>等级范围：</b>4-4 <b>颜色：</b><span style="color: #0000ff;">#0000ff</span><br>
    <b>等级范围：</b>10-99 <b>颜色：</b><span style="color: #5ad465;">#5ad465</span><br>
    <b>等级范围：</b>5000-MAX <b>颜色：</b><span style="color: #ff0000;">#ff0000</span>
  </div>
  <ul data-name="smColorList"></ul>
  <div style="margin-top: 5px;" data-name="customSmColorAddBtns">
    <a class="pd_btn_link" data-action="addOne" href="#">增加1个</a>
    <a class="pd_btn_link" data-action="addFive" href="#">增加5个</a>
    <a class="pd_btn_link" data-action="clear" href="#">清除所有</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExCustomSmColorConfigDialog" href="#">导入/导出配色方案</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义各等级神秘颜色', html, 'min-width: 327px;');
    let $customSmColorList = $dialog.find('[data-name="smColorList"]');

    $customSmColorList.on('change', '[name="color"]', function () {
        let $this = $(this);
        let color = $.trim($this.val());
        if (/^#[0-9a-fA-F]{6}$/.test(color)) {
            $this.next('[type="color"]').val(color.toLowerCase());
        }
    }).on('change', '[type="color"]', function () {
        let $this = $(this);
        $this.prev('[type="text"]').val($this.val().toString().toLowerCase());
    }).on('click', 'a', function (e) {
        e.preventDefault();
        $(this).closest('li').remove();
    });

    /**
     * 获取每列神秘颜色的HTML内容
     * @param {string} min 最小神秘等级
     * @param {string} max 最大神秘等级
     * @param {string} color 颜色
     * @returns {string} 每列神秘颜色的HTML内容
     */
    const getSmColorLineHtml = function ({min = '', max = '', color = ''} = {}) {
        return `
<li>
  <label>等级范围 <input name="min" type="text" maxlength="5" style="width: 30px;" value="${min}"></label>
  <label>- <input name="max" type="text" maxlength="5" style="width: 30px;" value="${max}"></label>
  <label>
    &nbsp;颜色 <input name="color" type="text" maxlength="7" style="width: 50px;" value="${color}">
    <input style="margin-left: 0;" type="color" value="${color}">
  </label>
  <a href="#">删除</a>
</li>`;
    };

    let smColorHtml = '';
    for (let data of Config.customSmColorConfigList) {
        smColorHtml += getSmColorLineHtml(data);
    }
    $customSmColorList.html(smColorHtml);

    $dialog.submit(function (e) {
        e.preventDefault();
        let list = [];
        let verification = true;
        $customSmColorList.find('li').each(function () {
            let $this = $(this);
            let $txtSmMin = $this.find('[name="min"]');
            let min = $.trim($txtSmMin.val()).toUpperCase();
            if (min === '') return;
            if (!/^(-?\d+|MAX)$/i.test(min)) {
                verification = false;
                $txtSmMin.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            let $txtSmMax = $this.find('[name="max"]');
            let max = $.trim($txtSmMax.val()).toUpperCase();
            if (max === '') return;
            if (!/^(-?\d+|MAX)$/i.test(max)) {
                verification = false;
                $txtSmMax.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            if (Util.compareSmLevel(max, min) < 0) {
                verification = false;
                $txtSmMin.select().focus();
                alert('等级范围格式不正确');
                return false;
            }
            let $txtSmColor = $this.find('[name="color"]');
            let color = $.trim($txtSmColor.val()).toLowerCase();
            if (color === '') return;
            if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
                verification = false;
                $txtSmColor.select().focus();
                alert('颜色格式不正确');
                return false;
            }
            list.push({min, max, color});
        });
        if (verification) {
            list.sort((a, b) => Util.compareSmLevel(a.min, b.min) > 0 ? 1 : -1);
            Config.customSmColorConfigList = list;
            writeConfig();
            Dialog.close(dialogName);
        }
    }).find('[data-action="addOne"], [data-action="addFive"]').click(function (e) {
        e.preventDefault();
        let num = 1;
        if ($(this).is('[data-action="addFive"]')) num = 5;
        for (let i = 1; i <= num; i++) {
            $customSmColorList.append(getSmColorLineHtml());
        }
        Dialog.resize(dialogName);
    }).end().find('[data-action="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有颜色？')) {
            $customSmColorList.empty();
            Dialog.resize(dialogName);
        }
    }).end().find('[data-name="openImOrExCustomSmColorConfigDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog(
            '配色方案',
            'customSmColorConfigList',
            $dialog => $dialog.find('.pd_cfg_about').append('<a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a>')
        );
    });

    Dialog.show(dialogName);
};

/**
 * 显示自定义CSS对话框
 */
const showCustomCssDialog = function () {
    const dialogName = 'pdCustomCssDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <strong>自定义CSS内容：</strong><br>
  <textarea name="customCssContent" wrap="off" style="width: 750px; height: 400px; white-space: pre;"></textarea>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500969">CSS规则收集贴</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '自定义CSS', html);
    let $content = $dialog.find('[name="customCssContent"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        Config.customCssContent = $.trim($content.val());
        writeConfig();
        Dialog.close(dialogName);
        alert('自定义CSS修改成功（需刷新页面后才可生效）');
    });
    $content.val(Config.customCssContent);
    Dialog.show(dialogName);
    $content.focus();
};

/**
 * 显示用户备注对话框
 */
const showUserMemoDialog = function () {
    const dialogName = 'pdUserMemoDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  按照“用户名:备注”的格式（注意是英文冒号），每行一个<br>
  <textarea name="userMemoList" wrap="off" style="width: 320px; height: 400px; white-space: pre;"></textarea>
</div>
<div class="pd_cfg_btns">
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '用户备注', html);
    let $userMemoList = $dialog.find('[name="userMemoList"]');
    $dialog.submit(function (e) {
        e.preventDefault();
        let content = $.trim($userMemoList.val());
        Config.userMemoList = {};
        for (let line of content.split('\n')) {
            line = $.trim(line);
            if (!line) continue;
            if (!/.+?:.+/.test(line)) {
                alert('用户备注格式不正确');
                $userMemoList.focus();
                return;
            }
            let [user, memo = ''] = line.split(':');
            if (!memo) continue;
            Config.userMemoList[user.trim()] = memo.trim();
        }
        writeConfig();
        Dialog.close(dialogName);
    });
    let content = '';
    for (let [user, memo] of Util.entries(Config.userMemoList)) {
        content += `${user}:${memo}\n`;
    }
    $userMemoList.val(content);
    Dialog.show(dialogName);
    $userMemoList.focus();
};

/**
 * 显示关注用户对话框
 */
const showFollowUserDialog = function () {
    const dialogName = 'pdFollowUserDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px;">
    <label>
      <input name="highlightFollowUserThreadInHpEnabled" type="checkbox"> 高亮所关注用户的首页帖子链接
      <span class="pd_cfg_tips" title="高亮所关注用户在首页下的帖子链接">[?]</span>
    </label><br>
    <label>
      <input name="highlightFollowUserThreadLinkEnabled" type="checkbox"> 高亮所关注用户的帖子链接
      <span class="pd_cfg_tips" title="高亮所关注用户在版块页面下的帖子链接">[?]</span>
    </label><br>
  </div>
  <ul id="pdFollowUserList" style="margin-top: 5px; min-width: 274px; line-height: 24px;"></ul>
  <div style="margin-top: 5px;">
    <div style="display: inline-block;">
      <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
      <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
    </div>
    <div style="float: right;">
      <a class="pd_btn_link" data-name="deleteSelect" href="#">删除</a>
    </div>
  </div>
  <div style="margin-top: 5px;" title="添加多个用户请用英文逗号分隔">
    <input name="addFollowUser" style="width: 200px;" type="text">
    <a class="pd_btn_link" data-name="add" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExFollowUserListDialog" href="#">导入/导出关注用户</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '关注用户', html);
    let $followUserList = $dialog.find('#pdFollowUserList');

    /**
     * 添加关注用户
     * @param {string} name 用户名
     */
    const addFollowUser = function (name) {
        $(`
<li>
  <input type="checkbox">
  <input name="username" type="text" style="width: 178px; margin-left: 5px;" maxlength="15" value="${name}">
  <a class="pd_btn_link" data-name="delete" href="#">删除</a>
</li>
`).appendTo($followUserList);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.highlightFollowUserThreadInHPEnabled = $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked');
        Config.highlightFollowUserThreadLinkEnabled = $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked');
        Config.followUserList = [];
        $followUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[name="username"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                Config.followUserList.push({name});
            }
        });
        writeConfig();
        Dialog.close(dialogName);
    });

    $followUserList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="selectAll"]').click(() => Util.selectAll($followUserList.find('[type="checkbox"]')))
        .end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($followUserList.find('[type="checkbox"]')))
        .end().find('[data-name="deleteSelect"]')
        .click(function (e) {
            e.preventDefault();
            let $checked = $followUserList.find('li:has([type="checkbox"]:checked)');
            if (!$checked.length) return;
            if (confirm('是否删除所选用户？')) {
                $checked.remove();
                Dialog.resize(dialogName);
            }
        });

    $dialog.find('[name="addFollowUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next('a').click();
        }
    }).end().find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        for (let name of $.trim($dialog.find('[name="addFollowUser"]').val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                addFollowUser(name);
            }
        }
        $dialog.find('[name="addFollowUser"]').val('');
        Dialog.resize(dialogName);
    }).end().find('[data-name="openImOrExFollowUserListDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('关注用户', 'followUserList');
    });

    $dialog.find('[name="highlightFollowUserThreadInHpEnabled"]').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
    $dialog.find('[name="highlightFollowUserThreadLinkEnabled"]').prop('checked', Config.highlightFollowUserThreadLinkEnabled);
    for (let user of Config.followUserList) {
        addFollowUser(user.name);
    }
    Dialog.show(dialogName);
};

/**
 * 显示屏蔽用户对话框
 */
const showBlockUserDialog = function () {
    const dialogName = 'pdBlockUserDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="margin-top: 5px; line-height: 24px;">
    <label>
      默认屏蔽类型
      <select name="blockUserDefaultType">
        <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
      </select>
    </label>
    <label class="pd_cfg_ml">
      <input name="blockUserAtTipsEnabled" type="checkbox"> 屏蔽@提醒 <span class="pd_cfg_tips" title="屏蔽被屏蔽用户的@提醒">[?]</span>
    </label><br>
    <label>版块屏蔽范围
      <select name="blockUserForumType">
        <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
      </select>
    </label><br>
    <label>版块ID列表
      <input name="blockUserFidList" type="text" style="width: 220px;"> 
      <span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span>
    </label>
  </div>
  <ul id="pdBlockUserList" style="margin-top: 5px; min-width: 362px; line-height: 24px;"></ul>
  <div style="margin-top: 5px;">
    <div style="display: inline-block;">
      <a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
      <a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
    </div>
    <div style="float: right;">
      <a class="pd_btn_link" data-name="modify" href="#">修改为</a>
      <select>
        <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
      </select>
      <a class="pd_btn_link" data-name="deleteSelect" href="#">删除</a>
    </div>
  </div>
  <div style="margin-top: 5px;" title="添加多个用户请用英文逗号分隔">
    <input name="addBlockUser" style="width: 200px;" type="text">
    <a class="pd_btn_link" data-name="add" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExBlockUserListDialog" href="#">导入/导出屏蔽用户</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '屏蔽用户', html);
    let $blockUserList = $dialog.find('#pdBlockUserList');

    /**
     * 添加屏蔽用户
     * @param {string} name 用户名
     * @param {number} type 屏蔽类型
     */
    const addBlockUser = function (name, type) {
        $(`
<li>
  <input type="checkbox">
  <input name="username" type="text" style="width: 150px; margin-left: 5px;" maxlength="15" value="${name}">
  <select name="blockType" style="margin-left: 5px;">
    <option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option>
  </select>
  <a class="pd_btn_link" data-name="delete" href="#">删除</a>
</li>`).appendTo($blockUserList).find('[name="blockType"]').val(type);
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        Config.blockUserDefaultType = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        Config.blockUserAtTipsEnabled = $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked');
        Config.blockUserForumType = parseInt($dialog.find('[name="blockUserForumType"]').val());
        let blockUserFidList = new Set();
        for (let fid of $.trim($dialog.find('[name="blockUserFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) blockUserFidList.add(fid);
        }
        Config.blockUserFidList = [...blockUserFidList];
        Config.blockUserList = [];
        $blockUserList.find('li').each(function () {
            let $this = $(this);
            let name = $.trim($this.find('[name="username"]').val());
            if (name !== '' && Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                let type = parseInt($this.find('[name="blockType"]').val());
                Config.blockUserList.push({name, type});
            }
        });
        writeConfig();
        Dialog.close(dialogName);
    });

    $blockUserList.on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    $dialog.find('[data-name="selectAll"]').click(() => Util.selectAll($blockUserList.find('input[type="checkbox"]')))
        .end().find('[data-name="selectInverse"]').click(() => Util.selectInverse($blockUserList.find('input[type="checkbox"]')))
        .end().find('[data-name="modify"]')
        .click(function (e) {
            e.preventDefault();
            let value = $(this).next('select').val();
            $blockUserList.find('li:has([type="checkbox"]:checked) > select').val(value);
        })
        .end().find('[data-name="deleteSelect"]')
        .click(function (e) {
            e.preventDefault();
            let $checked = $blockUserList.find('li:has([type="checkbox"]:checked)');
            if (!$checked.length) return;
            if (confirm('是否删除所选用户？')) {
                $checked.remove();
                Dialog.resize(dialogName);
            }
        });

    $dialog.find('[name="addBlockUser"]').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $(this).next('a').click();
        }
    }).end().find('[data-name="add"]').click(function (e) {
        e.preventDefault();
        let type = parseInt($dialog.find('[name="blockUserDefaultType"]').val());
        for (let name of $.trim($dialog.find('[name="addBlockUser"]').val()).split(',')) {
            name = $.trim(name);
            if (!name) continue;
            if (Util.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                addBlockUser(name, type);
            }
        }
        $dialog.find('[name="addBlockUser"]').val('');
        Dialog.resize(dialogName);
    }).end().find('[name="blockUserForumType"]').change(function () {
        $dialog.find('[name="blockUserFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[data-name="openImOrExBlockUserListDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('屏蔽用户', 'blockUserList');
    });

    $dialog.find('[name="blockUserDefaultType"]').val(Config.blockUserDefaultType);
    $dialog.find('[name="blockUserAtTipsEnabled"]').prop('checked', Config.blockUserAtTipsEnabled);
    $dialog.find('[name="blockUserForumType"]').val(Config.blockUserForumType).triggerHandler('change');
    $dialog.find('[name="blockUserFidList"]').val(Config.blockUserFidList.join(','));
    for (let user of Config.blockUserList) {
        addBlockUser(user.name, user.type);
    }
    Dialog.show(dialogName);
};

/**
 * 显示屏蔽帖子对话框
 */
const showBlockThreadDialog = function () {
    const dialogName = 'pdBlockThreadDialog';
    if ($('#' + dialogName).length > 0) return;
    let html = `
<div class="pd_cfg_main">
  <div style="border-bottom: 1px solid #9191ff; margin-bottom: 7px; padding-bottom: 5px;">
    标题关键字可使用普通字符串或正则表达式，正则表达式请使用<code>/abc/</code>的格式，例：<code>/关键字A.*关键字B/i</code><br>
    用户名和版块ID为可选项（多个用户名或版块ID请用英文逗号分隔）<br>
    <label>
      默认版块屏蔽范围
      <select name="blockThreadDefForumType">
        <option value="0">所有版块</option><option value="1">包括指定版块</option><option value="2">排除指定版块</option>
      </select>
    </label>
    <label style="margin-left: 5px;">默认版块ID列表 <input name="blockThreadDefFidList" type="text" style="width: 150px;"></label>
  </div>
  <table id="pdBlockThreadList" style="line-height: 22px; text-align: center;">
    <tbody>
      <tr>
        <th style="width: 220px;">标题关键字(必填)</th>
        <th style="width: 62px;">屏蔽用户</th>
        <th style="width: 200px;">用户名 <span class="pd_cfg_tips" title="多个用户名请用英文逗号分隔">[?]</span></th>
        <th style="width: 62px;">屏蔽范围</th>
        <th style="width: 132px;">版块ID <span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span></th>
        <th style="width: 35px;"></th>
      </tr>
    </tbody>
  </table>
  <div data-name="blockThreadAddBtns" style="margin-top: 5px;">
    <a class="pd_btn_link" data-name="addOne" href="#">增加1个</a>
    <a class="pd_btn_link" data-name="addFive" href="#">增加5个</a>
    <a class="pd_btn_link pd_highlight" data-name="clear" href="#">清除所有</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <span class="pd_cfg_about"><a data-name="openImOrExBlockThreadListDialog" href="#">导入/导出屏蔽帖子</a></span>
  <button type="submit">保存</button>
  <button data-action="close" type="button">取消</button>
</div>`;
    let $dialog = Dialog.create(dialogName, '屏蔽帖子', html, 'width: 768px;');
    let $blockThreadList = $dialog.find('#pdBlockThreadList');

    /**
     * 添加屏蔽帖子
     * @param {string} keyWord 标题关键字
     * @param {number} userType 屏蔽用户，0：所有；1：包括；2：排除
     * @param {string[]} userList 用户名
     * @param {number} fidType 屏蔽范围，0：所有；1：包括；2：排除
     * @param {number[]} fidList 版块ID列表
     */
    const addBlockThread = function (keyWord, userType, userList, fidType, fidList) {
        $(`
<tr>
  <td><input name="keyWord" type="text" style="width: 208px;" value="${keyWord}"></td>
  <td><select name="userType"><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>
  <td><input name="userList" type="text" style="width: 188px;" value="${userList.join(',')}" ${userType === 0 ? 'disabled' : ''}></td>
  <td><select name="fidType"><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>
  <td><input name="fidList" type="text" style="width: 120px;" value="${fidList.join(',')}" ${fidType === 0 ? 'disabled' : ''}></td>
  <td><a href="#" data-name="delete">删除</a></td>
</tr>
`).appendTo($blockThreadList).find('[name="userType"]').val(userType)
            .end().find('[name="fidType"]').val(fidType);
    };

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    const verify = function () {
        let flag = true;
        $blockThreadList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            let $txtKeyWord = $this.find('[name="keyWord"]');
            let keyWord = $txtKeyWord.val();
            if ($.trim(keyWord) === '') return;
            if (/^\/.+\/[gimuy]*$/.test(keyWord)) {
                try {
                    eval(keyWord);
                }
                catch (ex) {
                    alert('正则表达式不正确');
                    $txtKeyWord.select().focus();
                    flag = false;
                    return false;
                }
            }
        });
        return flag;
    };

    $dialog.submit(function (e) {
        e.preventDefault();
        if (!verify()) return;
        Config.blockThreadDefForumType = parseInt($dialog.find('[name="blockThreadDefForumType"]').val());
        let blockThreadDefFidList = new Set();
        for (let fid of $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')) {
            fid = parseInt(fid);
            if (!isNaN(fid) && fid > 0) blockThreadDefFidList.add(fid);
        }
        Config.blockThreadDefFidList = [...blockThreadDefFidList];
        Config.blockThreadList = [];
        $blockThreadList.find('tr:gt(0)').each(function () {
            let $this = $(this);
            let keyWord = $this.find('[name="keyWord"]').val();
            if ($.trim(keyWord) === '') return;
            let newObj = {keyWord};

            let userType = parseInt($this.find('[name="userType"]').val());
            if (userType > 0) {
                let userList = new Set();
                for (let user of $.trim($this.find('[name="userList"]').val()).split(',')) {
                    user = $.trim(user);
                    if (user) userList.add(user);
                }
                if (userList.size > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = [...userList];
            }

            let fidType = parseInt($this.find('[name="fidType"]').val());
            if (fidType > 0) {
                let fidList = new Set();
                for (let fid of $.trim($this.find('[name="fidList"]').val()).split(',')) {
                    fid = parseInt(fid);
                    if (!isNaN(fid) && fid > 0) fidList.add(fid);
                }
                if (fidList.size > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = [...fidList];
            }
            Config.blockThreadList.push(newObj);
        });
        writeConfig();
        Dialog.close(dialogName);
    });

    $blockThreadList.on('change', 'select', function () {
        let $this = $(this);
        $this.parent('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
    }).on('click', '[data-name="delete"]', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove();
    });

    $dialog.find('[data-name="addOne"], [data-name="addFive"]').click(function (e) {
        e.preventDefault();
        let num = 1;
        if ($(this).is('[data-name="addFive"]')) num = 5;
        for (let i = 1; i <= num; i++) {
            addBlockThread('', 0, [],
                parseInt($dialog.find('[name="blockThreadDefForumType"]').val()),
                $.trim($dialog.find('[name="blockThreadDefFidList"]').val()).split(',')
            );
        }
        Dialog.resize(dialogName);
    }).end().find('[data-name="clear"]').click(function (e) {
        e.preventDefault();
        if (confirm('是否清除所有屏蔽关键字？')) {
            $blockThreadList.find('tbody > tr:gt(0)').remove();
            Dialog.resize(dialogName);
        }
    }).end().find('[name="blockThreadDefForumType"]').change(function () {
        $dialog.find('[name="blockThreadDefFidList"]').prop('disabled', parseInt($(this).val()) === 0);
    }).end().find('[data-name="openImOrExBlockThreadListDialog"]').click(function (e) {
        e.preventDefault();
        Public.showCommonImportOrExportConfigDialog('屏蔽帖子', 'blockThreadList');
    });

    $dialog.find('[name="blockThreadDefForumType"]').val(Config.blockThreadDefForumType).triggerHandler('change');
    $dialog.find('[name="blockThreadDefFidList"]').val(Config.blockThreadDefFidList.join(','));
    for (let data of Config.blockThreadList) {
        let {keyWord, includeUser, excludeUser, includeFid, excludeFid} = data;
        let userType = 0;
        let userList = [];
        if (typeof includeUser !== 'undefined') {
            userType = 1;
            userList = includeUser;
        }
        else if (typeof excludeUser !== 'undefined') {
            userType = 2;
            userList = excludeUser;
        }

        let fidType = 0;
        let fidList = [];
        if (typeof includeFid !== 'undefined') {
            fidType = 1;
            fidList = includeFid;
        }
        else if (typeof excludeFid !== 'undefined') {
            fidType = 2;
            fidList = excludeFid;
        }
        addBlockThread(keyWord, userType, userList, fidType, fidList);
    }
    Dialog.show(dialogName);
};

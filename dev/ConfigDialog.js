/**
 * 设置对话框类
 */
var ConfigDialog = {
    /**
     * 显示设置对话框
     */
    show: function () {
        if ($('#pd_config').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div class="pd_cfg_nav"><a title="清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）" href="#">清除缓存</a>' +
            '<a href="#">查看日志</a><a href="#">导入/导出设置</a></div>' +
            '  <div class="pd_cfg_panel" style="margin-bottom:5px">' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_refresh_enabled" type="checkbox" />定时模式 ' +
            '<a class="pd_cfg_tips" href="#" title="可按时进行自动操作（包括捐款、争夺、抽取神秘盒子，需开启相关功能），只在论坛首页生效">[?]</a></label></legend>' +
            '      <label>标题提示方案<select id="pd_cfg_show_refresh_mode_tips_type"><option value="auto">停留一分钟后显示</option>' +
            '<option value="always">总是显示</option><option value="never">不显示</option></select>' +
            '<a class="pd_cfg_tips" href="#" title="在首页的网页标题上显示定时模式提示的方案">[?]</a></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_donation_enabled" type="checkbox" />自动KFB捐款</label></legend>' +
            '      <label>KFB捐款额度<input id="pd_cfg_donation_kfb" maxlength="4" style="width:32px" type="text" />' +
            '<a class="pd_cfg_tips" href="#" title="取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前收入的百分比（最多不超过5000KFB），例：80%">[?]</a></label>' +
            '      <label style="margin-left:10px">在<input id="pd_cfg_donation_after_time" maxlength="8" style="width:55px" type="text" />' +
            '之后捐款 <a class="pd_cfg_tips" href="#" title="在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_donation_after_vip_enabled" type="checkbox" />在获得VIP后才进行捐款 ' +
            '<a class="pd_cfg_tips" href="#" title="在获得VIP资格后才进行捐款，如开启此选项，将只能在首页进行捐款">[?]</a></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_loot_enabled" type="checkbox" />自动争夺 ' +
            '<a class="pd_cfg_tips" href="#" title="可自动领取争夺奖励，并可自动进行批量攻击（可选）">[?]</a></label></legend>' +
            '      <label>在<input placeholder="例：07:00-08:15,17:00-18:15" id="pd_cfg_no_auto_loot_when" maxlength="23" style="width:150px" type="text" />内不自动领取争夺奖励 ' +
            '<a class="pd_cfg_tips" href="#" title="在指定的时间段内不自动领取争夺奖励（主要与在指定时间内才攻击配合使用），例：07:00-08:15,17:00-18:15，留空表示不启用">[?]</a>' +
            '</label><br />' +
            '      <label><input id="pd_cfg_custom_monster_name_enabled" type="checkbox" />自定义怪物名称 ' +
            '<a class="pd_cfg_tips" href="#" title="自定义怪物名称，请点击详细设置自定义各怪物的名称">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_monster_name_dialog" href="#">详细设置&raquo;</a>' +
            '      <fieldset>' +
            '        <legend><label><input id="pd_cfg_auto_attack_enabled" type="checkbox" />自动攻击 ' +
            '<a class="pd_cfg_tips" href="#" title="在自动领取争夺奖励后，自动进行批量攻击（需指定攻击目标）">[?]</a></label></legend>' +
            '      <label><input id="pd_cfg_attack_when_zero_life_enabled" type="checkbox" />当生命值不超过低保线时进行试探攻击 ' +
            '<a class="pd_cfg_tips" href="#" title="当生命值不超过低保线时自动进行试探攻击，需同时设置在距本回合结束前指定分钟内才完成(剩余)攻击">[?]</a></label><br />' +
            '      <label>在距本回合结束前<input id="pd_cfg_attack_after_time" maxlength="3" style="width:23px" type="text" />分钟内才完成(剩余)攻击 ' +
            '<a class="pd_cfg_tips" href="#" title="在距本回合结束前指定时间内才自动完成(剩余)批量攻击，取值范围：{0}-{1}，留空表示不启用">[?]</a></label>'
                .replace('{0}', Config.defLootInterval).replace('{1}', Config.minAttackAfterTime) +
            '        <table id="pd_cfg_batch_attack_list" style="margin-top:5px">' +
            '          <tbody>' +
            '            <tr><td style="width:110px">Lv.1：小史莱姆</td><td style="width:70px"><label><input style="width:15px" type="text" maxlength="2" data-id="1" />次' +
            '</label></td><td style="width:62px">Lv.2：笨蛋</td><td><label><input style="width:15px" type="text" maxlength="2" data-id="2" />次</label></td></tr>' +
            '            <tr><td>Lv.3：大果冻史莱姆</td><td><label><input style="width:15px" type="text" maxlength="2" data-id="3" />次</label></td>' +
            '<td>Lv.4：肉山</td><td><label><input style="width:15px" type="text" maxlength="2" data-id="4" />次</label></td></tr>' +
            '            <tr><td>Lv.5：大魔王</td><td><label><input style="width:15px" type="text" maxlength="2" data-id="5" />次</label></td></tr>' +
            '          </tbody>' +
            '        </table>' +
            '        <label>拥有致命一击时的攻击目标<select id="pd_cfg_deadly_attack_id" style="width:130px"><option value="0">保持默认</option>' +
            '<option value="1">Lv.1：小史莱姆</option><option value="2">Lv.2：笨蛋</option><option value="3">Lv.3：大果冻史莱姆</option><option value="4">Lv.4：肉山</option>' +
            '<option value="5">Lv.5：大魔王</option></select><a class="pd_cfg_tips" href="#" title="当拥有致命一击时的自动攻击目标">[?]</a></label>' +
            '      </fieldset>' +
            '      <label><input id="pd_cfg_auto_use_item_enabled" type="checkbox" data-disabled="#pd_cfg_auto_use_item_names" />自动使用刚掉落的道具 ' +
            '<a class="pd_cfg_tips" href="#" title="自动使用批量攻击后刚掉落的道具，需指定自动使用的道具名称，按Shift或Ctrl键可多选">[?]</a></label><br />' +
            '      <label><select id="pd_cfg_auto_use_item_names" multiple="multiple" size="4">' +
            '<option value="被遗弃的告白信">Lv.1：被遗弃的告白信</option><option value="学校天台的钥匙">Lv.1：学校天台的钥匙</option>' +
            '<option value="TMA最新作压缩包">Lv.1：TMA最新作压缩包</option><option value="LOLI的钱包">Lv.2：LOLI的钱包</option>' +
            '<option value="棒棒糖">Lv.2：棒棒糖</option><option value="蕾米莉亚同人漫画">Lv.3：蕾米莉亚同人漫画</option>' +
            '<option value="十六夜同人漫画">Lv.3：十六夜同人漫画</option><option value="档案室钥匙">Lv.4：档案室钥匙</option>' +
            '<option value="傲娇LOLI娇蛮音CD">Lv.4：傲娇LOLI娇蛮音CD</option><option value="整形优惠卷">Lv.5：整形优惠卷</option>' +
            '<option value="消逝之药">Lv.5：消逝之药</option></select></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_draw_smbox_enabled" type="checkbox" />自动抽取神秘盒子 ' +
            '<a class="pd_cfg_tips" href="#" title="注意：抽取神秘盒子将延长争夺奖励的领取时间">[?]</a></label></legend>' +
            '      <label>偏好的神秘盒子数字<input placeholder="例: 52,1,28,400" id="pd_cfg_favor_smbox_numbers" style="width:180px" type="text" />' +
            '<a class="pd_cfg_tips" href="#" title="例：52,1,28,400（以英文逗号分隔，按优先级排序），如设定的数字都不可用，则从剩余的盒子中随机抽选一个，如无需求可留空">' +
            '[?]</a></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>首页相关</legend>' +
            '      <label>@提醒<select id="pd_cfg_at_tips_handle_type" style="width:130px"><option value="no_highlight_1">取消已读提醒高亮，并在无提醒时补上消息框</option>' +
            '<option value="no_highlight_2">取消已读提醒高亮</option><option value="hide_box_1">不显示已读提醒的消息框</option><option value="hide_box_2">永不显示消息框</option>' +
            '<option value="default">保持默认</option><option value="at_change_to_cao">将@改为艹(其他和方式1相同)</option></select>' +
            '<a class="pd_cfg_tips" href="#" title="对首页上的有人@你的消息框进行处理的方案">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_hide_none_vip_enabled" type="checkbox" />无VIP时取消高亮 ' +
            '<a class="pd_cfg_tips" href="#" title="在无VIP时去除首页的VIP标识高亮">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_sm_level_up_alert_enabled" type="checkbox" />神秘等级升级提醒 ' +
            '<a class="pd_cfg_tips" href="#" title="在神秘等级升级后进行提醒，只在首页生效">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_home_page_thread_fast_goto_link_enabled" type="checkbox" />在首页帖子旁显示跳转链接 ' +
            '<a class="pd_cfg_tips" href="#" title="在首页帖子链接旁显示快速跳转至页末的链接">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_fixed_deposit_due_alert_enabled" type="checkbox" />定期存款到期提醒 ' +
            '<a class="pd_cfg_tips" href="#" title="在定时存款到期时进行提醒，只在首页生效">[?]</a></label>' +
            '    </fieldset>' +
            '  </div>' +
            '  <div class="pd_cfg_panel">' +
            '    <fieldset>' +
            '      <legend>帖子列表页面相关</legend>' +
            '      <label><input id="pd_cfg_show_fast_goto_thread_page_enabled" type="checkbox" data-disabled="#pd_cfg_max_fast_goto_thread_page_num" />' +
            '显示帖子页数快捷链接 <a class="pd_cfg_tips" href="#" title="在帖子列表页面中显示帖子页数快捷链接">[?]</a></label>' +
            '      <label style="margin-left:10px">页数链接最大数量<input id="pd_cfg_max_fast_goto_thread_page_num" style="width:25px" maxlength="4" type="text" />' +
            '<a class="pd_cfg_tips" href="#" title="在帖子页数快捷链接中显示页数链接的最大数量">[?]</a></label><br />' +
            '      <label>帖子每页楼层数量<select id="pd_cfg_per_page_floor_num"><option value="10">10</option>' +
            '<option value="20">20</option><option value="30">30</option></select>' +
            '<a class="pd_cfg_tips" href="#" title="用于电梯直达和帖子页数快捷链接功能，如果修改了KF设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_highlight_new_post_enabled" type="checkbox" />高亮今日的新帖 ' +
            '<a class="pd_cfg_tips" href="#" title="在帖子列表中高亮今日新发表帖子的发表时间">[?]</a></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>帖子页面相关</legend>' +
            '      <label><input id="pd_cfg_adjust_thread_content_width_enabled" type="checkbox" />调整帖子内容宽度 ' +
            '<a class="pd_cfg_tips" href="#" title="调整帖子内容宽度，使其保持一致">[?]</a></label>' +
            '      <label style="margin-left:10px">帖子内容字体大小<input id="pd_cfg_thread_content_font_size" maxlength="2" style="width:20px" type="text" />px ' +
            '<a class="pd_cfg_tips" href="#" title="帖子内容字体大小，留空表示使用默认大小，推荐值：14">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_auto_change_sm_color_enabled_2" type="checkbox" />自动更换神秘颜色 ' +
            '<a class="pd_cfg_tips" href="#" title="可自动更换神秘颜色，请点击详细设置前往相应页面进行自定义设置">[?]</a></label>' +
            '<a style="margin-left:10px" target="_blank" href="kf_growup.php">详细设置&raquo;</a><br />' +
            '      <label>自定义本人的神秘颜色<input id="pd_cfg_custom_my_sm_color" maxlength="7" style="width:50px" type="text" />' +
            '<input style="margin-left:0" type="color" id="pd_cfg_custom_my_sm_color_select">' +
            '<a class="pd_cfg_tips" href="#" title="自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009CFF，如无需求可留空">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_custom_sm_color_enabled" type="checkbox" />自定义各等级神秘颜色 ' +
            '<a class="pd_cfg_tips" href="#" title="自定义各等级神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），请点击详细设置自定义各等级颜色">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_sm_color_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_modify_kf_other_domain_enabled" type="checkbox" />将绯月其它域名的链接修改为当前域名 ' +
            '<a class="pd_cfg_tips" href="#" title="将帖子和短消息中的绯月其它域名的链接修改为当前域名">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_multi_quote_enabled" type="checkbox" />开启多重引用功能 ' +
            '<a class="pd_cfg_tips" href="#" title="在帖子页面开启多重回复和多重引用功能">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_batch_buy_thread_enabled" type="checkbox" />开启批量购买帖子功能 ' +
            '<a class="pd_cfg_tips" href="#" title="在帖子页面开启批量购买帖子的功能">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_user_memo_enabled" type="checkbox" />显示用户备注 ' +
            '<a class="pd_cfg_tips" href="#" title="显示用户的自定义备注，请点击详细设置自定义用户备注">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_user_memo_dialog" href="#">详细设置&raquo;</a>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>其它设置</legend>' +
            '      <label>默认提示消息的持续时间<input id="pd_cfg_def_show_msg_duration" maxlength="5" style="width:30px" type="text" />秒 ' +
            '<a class="pd_cfg_tips" href="#" title="设置为-1表示永久显示，默认值：15">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_animation_effect_off_enabled" type="checkbox" />禁用动画效果 ' +
            '<a class="pd_cfg_tips" href="#" title="禁用jQuery的动画效果（推荐在配置较差的机器上使用）">[?]</a></label><br />' +
            '      <label>日志保存天数<input id="pd_cfg_log_save_days" maxlength="3" style="width:25px" type="text" />' +
            '<a class="pd_cfg_tips" href="#" title="默认值：10">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_show_log_link_in_page_enabled" type="checkbox" />在页面上方显示日志链接 ' +
            '<a class="pd_cfg_tips" href="#" title="在论坛页面上方显示助手日志的链接">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_add_side_bar_fast_nav_enabled" type="checkbox" />为侧边栏添加快捷导航 ' +
            '<a class="pd_cfg_tips" href="#" title="为侧边栏添加快捷导航的链接">[?]</a></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_modify_side_bar_enabled" type="checkbox" />将侧边栏修改为平铺样式 ' +
            '<a class="pd_cfg_tips" href="#" title="将侧边栏修改为和手机相同的平铺样式">[?]</a></label><br />' +
            '      <label><input id="pd_cfg_custom_css_enabled" type="checkbox" />添加自定义CSS ' +
            '<a class="pd_cfg_tips" href="#" title="为页面添加自定义的CSS内容，请点击详细设置填入自定义的CSS内容">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_css_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_custom_script_enabled" type="checkbox" />执行自定义脚本 ' +
            '<a class="pd_cfg_tips" href="#" title="执行自定义的javascript脚本，请点击详细设置填入自定义的脚本内容">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_script_dialog" href="#">详细设置&raquo;</a>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>关注和屏蔽用户</legend>' +
            '      <label><input id="pd_cfg_follow_user_enabled" type="checkbox" />关注用户 ' +
            '<a class="pd_cfg_tips" href="#" title="开启关注用户的功能，所关注的用户将被加注记号，请点击详细设置管理关注用户">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_follow_user_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_block_user_enabled" type="checkbox" />屏蔽用户 ' +
            '<a class="pd_cfg_tips" href="#" title="开启屏蔽用户的功能，你将看不见所屏蔽用户的发言，请点击详细设置管理屏蔽用户">[?]</a></label>' +
            '<a style="margin-left:10px" id="pd_cfg_block_user_dialog" href="#">详细设置&raquo;</a>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_save_current_deposit_enabled" type="checkbox" />自动活期存款 ' +
            '<a class="pd_cfg_tips" href="#" title="在当前收入满足指定额度之后自动将指定数额存入活期存款中，只会在首页触发">[?]</a></label></legend>' +
            '      <label>在当前收入已满<input id="pd_cfg_save_current_deposit_after_kfb" maxlength="10" style="width:45px" type="text" />KFB之后 ' +
            '<a class="pd_cfg_tips" href="#" title="在当前收入已满指定KFB额度之后自动进行活期存款，例：1000">[?]</a></label><br />' +
            '      <label>将<input id="pd_cfg_save_current_deposit_kfb" maxlength="10" style="width:45px" type="text" />KFB存入活期存款 ' +
            '<a class="pd_cfg_tips" href="#" title="将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800">[?]</a></label>' +
            '    </fieldset>' +
            '  </div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/8615">By 喵拉布丁</a> ' +
            '<i style="color:#666;font-style:normal">(V{0})</i></span>'.replace('{0}', version) +
            '  <button>确定</button><button>取消</button><button>默认值</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_config', 'KF Online助手设置', html);

        $dialog.find('.pd_cfg_btns > button:eq(1)').click(function () {
            return Dialog.close('pd_config');
        }).end().find('.pd_cfg_btns > button:eq(2)').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否重置所有设置？')) {
                ConfigMethod.clear();
                alert('设置已重置');
                location.reload();
            }
        }).end().find('.pd_cfg_nav > a:first-child').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否清除与助手有关的Cookies和本地存储数据？（不包括助手设置和日志）')) {
                ConfigMethod.clearCache();
                alert('缓存已清除');
            }
        }).next().click(function (e) {
            e.preventDefault();
            Log.show();
        }).next().click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportSettingDialog();
        });

        $dialog.find('#pd_cfg_custom_monster_name_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCustomMonsterNameDialog();
        });

        $dialog.find('#pd_cfg_auto_use_item_names').keydown(function (e) {
            if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 97)) {
                e.preventDefault();
                $(this).children().each(function () {
                    $(this).prop('selected', true);
                });
            }
        });

        $dialog.find('#pd_cfg_custom_my_sm_color_select').change(function () {
            $('#pd_cfg_custom_my_sm_color').val($(this).val().toString().toUpperCase());
        });

        $dialog.find('#pd_cfg_custom_my_sm_color').keyup(function () {
            var customMySmColor = $.trim($(this).val());
            if (/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
                $('#pd_cfg_custom_my_sm_color_select').val(customMySmColor.toUpperCase());
            }
        });

        $dialog.find('#pd_cfg_custom_sm_color_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCustomSmColorDialog();
        });

        $dialog.find('#pd_cfg_user_memo_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showUserMemoDialog();
        });

        $dialog.find('#pd_cfg_custom_css_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCustomCssDialog();
        });

        $dialog.find('#pd_cfg_custom_script_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCustomScriptDialog();
        });

        $dialog.find('#pd_cfg_follow_user_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showFollowUserDialog();
        });

        $dialog.find('#pd_cfg_block_user_dialog').click(function (e) {
            e.preventDefault();
            ConfigDialog.showBlockUserDialog();
        });

        ConfigDialog.setValue();
        $dialog.submit(function (e) {
            e.preventDefault();
            $('.pd_cfg_btns > button:first').click();
        }).end().find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!ConfigDialog.verify()) return;
            var oriAutoRefreshEnabled = Config.autoRefreshEnabled;
            ConfigMethod.read();
            var options = ConfigDialog.getValue();
            options = ConfigMethod.normalize(options);
            $.extend(Config, options);
            ConfigMethod.write();
            Dialog.close('pd_config');
            if (oriAutoRefreshEnabled !== options.autoRefreshEnabled) {
                if (window.confirm('你已修改了定时模式的设置，需要刷新页面才能生效，是否立即刷新？')) {
                    location.reload();
                }
            }
        }).end().find('legend input[type="checkbox"]').click(function () {
            var checked = $(this).prop('checked');
            if (Tools.isOpera())
                $(this).closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);
            else
                $(this).closest('fieldset').prop('disabled', !checked);
        }).each(function () {
            $(this).triggerHandler('click');
        }).end().find('input[data-disabled]').click(function () {
            var checked = $(this).prop('checked');
            $($(this).data('disabled')).prop('disabled', !checked);
        }).each(function () {
            $(this).triggerHandler('click');
        });

        Dialog.show('pd_config');
    },

    /**
     * 设置对话框中的字段值
     */
    setValue: function () {
        $('#pd_cfg_auto_refresh_enabled').prop('checked', Config.autoRefreshEnabled);
        $('#pd_cfg_show_refresh_mode_tips_type').val(Config.showRefreshModeTipsType.toLowerCase());

        $('#pd_cfg_auto_donation_enabled').prop('checked', Config.autoDonationEnabled);
        $('#pd_cfg_donation_kfb').val(Config.donationKfb);
        $('#pd_cfg_donation_after_time').val(Config.donationAfterTime);
        $('#pd_cfg_donation_after_vip_enabled').prop('checked', Config.donationAfterVipEnabled);

        $('#pd_cfg_auto_loot_enabled').prop('checked', Config.autoLootEnabled);
        $('#pd_cfg_no_auto_loot_when').val(Config.noAutoLootWhen.join(','));
        $('#pd_cfg_custom_monster_name_enabled').prop('checked', Config.customMonsterNameEnabled);
        $('#pd_cfg_auto_attack_enabled').prop('checked', Config.autoAttackEnabled);
        $('#pd_cfg_attack_when_zero_life_enabled').prop('checked', Config.attackWhenZeroLifeEnabled);
        if (Config.attackAfterTime > 0) $('#pd_cfg_attack_after_time').val(Config.attackAfterTime);
        $.each(Config.batchAttackList, function (id, num) {
            $('#pd_cfg_batch_attack_list input[data-id="{0}"]'.replace('{0}', id)).val(num);
        });
        $('#pd_cfg_deadly_attack_id').val(Config.deadlyAttackId);
        $('#pd_cfg_auto_use_item_enabled').prop('checked', Config.autoUseItemEnabled);
        $('#pd_cfg_auto_use_item_names').val(Config.autoUseItemNames);

        $('#pd_cfg_auto_draw_smbox_enabled').prop('checked', Config.autoDrawSmbox2Enabled);
        $('#pd_cfg_favor_smbox_numbers').val(Config.favorSmboxNumbers.join(','));

        $('#pd_cfg_at_tips_handle_type').val(Config.atTipsHandleType.toLowerCase());
        $('#pd_cfg_hide_none_vip_enabled').prop('checked', Config.hideNoneVipEnabled);
        $('#pd_cfg_sm_level_up_alert_enabled').prop('checked', Config.smLevelUpAlertEnabled);
        $('#pd_cfg_home_page_thread_fast_goto_link_enabled').prop('checked', Config.homePageThreadFastGotoLinkEnabled);
        $('#pd_cfg_fixed_deposit_due_alert_enabled').prop('checked', Config.fixedDepositDueAlertEnabled);

        $('#pd_cfg_show_fast_goto_thread_page_enabled').prop('checked', Config.showFastGotoThreadPageEnabled);
        $('#pd_cfg_max_fast_goto_thread_page_num').val(Config.maxFastGotoThreadPageNum);
        $('#pd_cfg_per_page_floor_num').val(Config.perPageFloorNum);
        $('#pd_cfg_highlight_new_post_enabled').prop('checked', Config.highlightNewPostEnabled);

        $('#pd_cfg_adjust_thread_content_width_enabled').prop('checked', Config.adjustThreadContentWidthEnabled);
        $('#pd_cfg_thread_content_font_size').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
        $('#pd_cfg_custom_my_sm_color').val(Config.customMySmColor);
        if (Config.customMySmColor) $('#pd_cfg_custom_my_sm_color_select').val(Config.customMySmColor);
        $('#pd_cfg_custom_sm_color_enabled').prop('checked', Config.customSmColorEnabled);
        $('#pd_cfg_modify_kf_other_domain_enabled').prop('checked', Config.modifyKFOtherDomainEnabled);
        $('#pd_cfg_multi_quote_enabled').prop('checked', Config.multiQuoteEnabled);
        $('#pd_cfg_batch_buy_thread_enabled').prop('checked', Config.batchBuyThreadEnabled);
        $('#pd_cfg_user_memo_enabled').prop('checked', Config.userMemoEnabled);
        $('#pd_cfg_auto_change_sm_color_enabled_2').prop('checked', Config.autoChangeSMColorEnabled);

        $('#pd_cfg_def_show_msg_duration').val(Config.defShowMsgDuration);
        $('#pd_cfg_animation_effect_off_enabled').prop('checked', Config.animationEffectOffEnabled);
        $('#pd_cfg_log_save_days').val(Config.logSaveDays);
        $('#pd_cfg_show_log_link_in_page_enabled').prop('checked', Config.showLogLinkInPageEnabled);
        $('#pd_cfg_add_side_bar_fast_nav_enabled').prop('checked', Config.addSideBarFastNavEnabled);
        $('#pd_cfg_modify_side_bar_enabled').prop('checked', Config.modifySideBarEnabled);
        $('#pd_cfg_custom_css_enabled').prop('checked', Config.customCssEnabled);
        $('#pd_cfg_custom_script_enabled').prop('checked', Config.customScriptEnabled);

        $('#pd_cfg_follow_user_enabled').prop('checked', Config.followUserEnabled);
        $('#pd_cfg_block_user_enabled').prop('checked', Config.blockUserEnabled);

        $('#pd_cfg_auto_save_current_deposit_enabled').prop('checked', Config.autoSaveCurrentDepositEnabled);
        if (Config.saveCurrentDepositAfterKfb > 0) $('#pd_cfg_save_current_deposit_after_kfb').val(Config.saveCurrentDepositAfterKfb);
        if (Config.saveCurrentDepositKfb > 0) $('#pd_cfg_save_current_deposit_kfb').val(Config.saveCurrentDepositKfb);
    },

    /**
     * 获取对话框中字段值的Config对象
     * @returns {Config} 字段值的Config对象
     */
    getValue: function () {
        var options = {};
        options.autoRefreshEnabled = $('#pd_cfg_auto_refresh_enabled').prop('checked');
        options.showRefreshModeTipsType = $('#pd_cfg_show_refresh_mode_tips_type').val();

        options.autoDonationEnabled = $('#pd_cfg_auto_donation_enabled').prop('checked');
        options.donationKfb = $.trim($('#pd_cfg_donation_kfb').val());
        options.donationKfb = $.isNumeric(options.donationKfb) ? parseInt(options.donationKfb) : options.donationKfb;
        options.donationAfterVipEnabled = $('#pd_cfg_donation_after_vip_enabled').prop('checked');
        options.donationAfterTime = $('#pd_cfg_donation_after_time').val();

        options.autoLootEnabled = $('#pd_cfg_auto_loot_enabled').prop('checked');
        options.noAutoLootWhen = $.trim($('#pd_cfg_no_auto_loot_when').val()).split(',');
        options.customMonsterNameEnabled = $('#pd_cfg_custom_monster_name_enabled').prop('checked');
        options.autoAttackEnabled = $('#pd_cfg_auto_attack_enabled').prop('checked');
        options.attackWhenZeroLifeEnabled = $('#pd_cfg_attack_when_zero_life_enabled').prop('checked');
        options.attackAfterTime = parseInt($.trim($('#pd_cfg_attack_after_time').val()));
        options.batchAttackList = {};
        $('#pd_cfg_batch_attack_list input').each(function () {
            var $this = $(this);
            var attackNum = $.trim($this.val());
            if (!attackNum) return;
            attackNum = parseInt(attackNum);
            if (attackNum <= 0) return;
            var id = parseInt($this.data('id'));
            if (!id) return;
            options.batchAttackList[id] = attackNum;
        });
        options.deadlyAttackId = parseInt($('#pd_cfg_deadly_attack_id').val());
        options.autoUseItemEnabled = $('#pd_cfg_auto_use_item_enabled').prop('checked');
        options.autoUseItemNames = $('#pd_cfg_auto_use_item_names').val();

        options.autoDrawSmbox2Enabled = $('#pd_cfg_auto_draw_smbox_enabled').prop('checked');
        options.favorSmboxNumbers = $.trim($('#pd_cfg_favor_smbox_numbers').val()).split(',');

        options.atTipsHandleType = $('#pd_cfg_at_tips_handle_type').val();
        options.hideNoneVipEnabled = $('#pd_cfg_hide_none_vip_enabled').prop('checked');
        options.smLevelUpAlertEnabled = $('#pd_cfg_sm_level_up_alert_enabled').prop('checked');
        options.homePageThreadFastGotoLinkEnabled = $('#pd_cfg_home_page_thread_fast_goto_link_enabled').prop('checked');
        options.fixedDepositDueAlertEnabled = $('#pd_cfg_fixed_deposit_due_alert_enabled').prop('checked');
        options.showFastGotoThreadPageEnabled = $('#pd_cfg_show_fast_goto_thread_page_enabled').prop('checked');
        options.maxFastGotoThreadPageNum = parseInt($.trim($('#pd_cfg_max_fast_goto_thread_page_num').val()));
        options.perPageFloorNum = $('#pd_cfg_per_page_floor_num').val();
        options.highlightNewPostEnabled = $('#pd_cfg_highlight_new_post_enabled').prop('checked');

        options.adjustThreadContentWidthEnabled = $('#pd_cfg_adjust_thread_content_width_enabled').prop('checked');
        options.threadContentFontSize = parseInt($.trim($('#pd_cfg_thread_content_font_size').val()));
        options.customMySmColor = $.trim($('#pd_cfg_custom_my_sm_color').val()).toUpperCase();
        options.customSmColorEnabled = $('#pd_cfg_custom_sm_color_enabled').prop('checked');
        options.modifyKFOtherDomainEnabled = $('#pd_cfg_modify_kf_other_domain_enabled').prop('checked');
        options.multiQuoteEnabled = $('#pd_cfg_multi_quote_enabled').prop('checked');
        options.batchBuyThreadEnabled = $('#pd_cfg_batch_buy_thread_enabled').prop('checked');
        options.userMemoEnabled = $('#pd_cfg_user_memo_enabled').prop('checked');
        options.autoChangeSMColorEnabled = $('#pd_cfg_auto_change_sm_color_enabled_2').prop('checked');

        options.defShowMsgDuration = parseInt($.trim($('#pd_cfg_def_show_msg_duration').val()));
        options.animationEffectOffEnabled = $('#pd_cfg_animation_effect_off_enabled').prop('checked');
        options.logSaveDays = parseInt($.trim($('#pd_cfg_log_save_days').val()));
        options.showLogLinkInPageEnabled = $('#pd_cfg_show_log_link_in_page_enabled').prop('checked');
        options.addSideBarFastNavEnabled = $('#pd_cfg_add_side_bar_fast_nav_enabled').prop('checked');
        options.modifySideBarEnabled = $('#pd_cfg_modify_side_bar_enabled').prop('checked');
        options.customCssEnabled = $('#pd_cfg_custom_css_enabled').prop('checked');
        options.customScriptEnabled = $('#pd_cfg_custom_script_enabled').prop('checked');

        options.followUserEnabled = $('#pd_cfg_follow_user_enabled').prop('checked');
        options.blockUserEnabled = $('#pd_cfg_block_user_enabled').prop('checked');

        options.autoSaveCurrentDepositEnabled = $('#pd_cfg_auto_save_current_deposit_enabled').prop('checked');
        options.saveCurrentDepositAfterKfb = parseInt($.trim($('#pd_cfg_save_current_deposit_after_kfb').val()));
        options.saveCurrentDepositKfb = parseInt($.trim($('#pd_cfg_save_current_deposit_kfb').val()));
        return options;
    },

    /**
     * 验证设置是否正确
     * @returns {boolean} 是否验证通过
     */
    verify: function () {
        var $txtDonationKfb = $('#pd_cfg_donation_kfb');
        var donationKfb = $.trim($txtDonationKfb.val());
        if (/%$/.test(donationKfb)) {
            if (!/^1?\d?\d%$/.test(donationKfb)) {
                alert('KFB捐款额度格式不正确');
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
            if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > 100) {
                alert('KFB捐款额度百分比的取值范围在1-100之间');
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
        }
        else {
            if (!$.isNumeric(donationKfb)) {
                alert('KFB捐款额度格式不正确');
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
            if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > Config.maxDonationKfb) {
                alert('KFB捐款额度的取值范围在1-{0}之间'.replace('{0}', Config.maxDonationKfb));
                $txtDonationKfb.select();
                $txtDonationKfb.focus();
                return false;
            }
        }

        var $txtDonationAfterTime = $('#pd_cfg_donation_after_time');
        var donationAfterTime = $.trim($txtDonationAfterTime.val());
        if (!/^(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(donationAfterTime)) {
            alert('在指定时间之后捐款格式不正确');
            $txtDonationAfterTime.select();
            $txtDonationAfterTime.focus();
            return false;
        }

        var $txtNoAutoLootWhen = $('#pd_cfg_no_auto_loot_when');
        var noAutoLootWhen = $.trim($txtNoAutoLootWhen.val());
        if (noAutoLootWhen) {
            if (!/^((2[0-3]|[0-1][0-9]):[0-5][0-9]-(2[0-3]|[0-1][0-9]):[0-5][0-9],?){1,2}$/.test(noAutoLootWhen)) {
                alert('在指定时间段内不自动领取争夺奖励格式不正确');
                $txtNoAutoLootWhen.select();
                $txtNoAutoLootWhen.focus();
                return false;
            }
        }

        var $txtAttackAfterTime = $('#pd_cfg_attack_after_time');
        var attackAfterTime = $.trim($txtAttackAfterTime.val());
        if (attackAfterTime) {
            attackAfterTime = parseInt(attackAfterTime);
            if (isNaN(attackAfterTime) || attackAfterTime > Config.defLootInterval || attackAfterTime < Config.minAttackAfterTime) {
                alert('在指定时间之内才完成攻击的取值范围为：{0}-{1}'.replace('{0}', Config.defLootInterval).replace('{1}', Config.minAttackAfterTime));
                $txtAttackAfterTime.select();
                $txtAttackAfterTime.focus();
                return false;
            }
        }
        else {
            if ($('#pd_cfg_attack_when_zero_life_enabled').prop('checked')) {
                alert('开启“当生命值不超过低保线时进行试探攻击”必须同时设置“在指定时间之内才完成攻击”');
                $txtAttackAfterTime.select();
                $txtAttackAfterTime.focus();
                return false;
            }
        }

        var totalAttackNum = 0;
        var isAttackVerification = true;
        $('#pd_cfg_batch_attack_list input').each(function () {
            var $this = $(this);
            var attackNum = $.trim($this.val());
            if (!attackNum) return;
            attackNum = parseInt(attackNum);
            if (isNaN(attackNum) || attackNum < 0) {
                isAttackVerification = false;
                alert('攻击次数格式不正确');
                $this.select();
                $this.focus();
                return false;
            }
            totalAttackNum += attackNum;
        });
        if (!isAttackVerification) return false;
        if (totalAttackNum > Config.maxAttackNum) {
            alert('攻击次数不得超过{0}次'.replace('{0}', Config.maxAttackNum));
            return false;
        }
        if ($('#pd_cfg_auto_attack_enabled').prop('checked') && !totalAttackNum) {
            alert('请填写自动攻击的目标次数');
            return false;
        }

        if ($('#pd_cfg_auto_draw_smbox_enabled').prop('checked') && $('#pd_cfg_auto_loot_enabled').prop('checked')) {
            alert('请不要将自动争夺与自动抽取神秘盒子一起使用');
            return false;
        }

        var $txtFavorSmboxNumbers = $('#pd_cfg_favor_smbox_numbers');
        var favorSmboxNumbers = $.trim($txtFavorSmboxNumbers.val());
        if (favorSmboxNumbers) {
            if (!/^\d+(,\d+)*$/.test(favorSmboxNumbers)) {
                alert('偏好的神秘盒子数字格式不正确');
                $txtFavorSmboxNumbers.select();
                $txtFavorSmboxNumbers.focus();
                return false;
            }
            if (/(\b\d{4,}\b|\b0+\b|\b[05-9]\d{2}\b|\b4\d[1-9]\b)/.test(favorSmboxNumbers)) {
                alert('每个神秘盒子数字的取值范围在1-400之间');
                $txtFavorSmboxNumbers.select();
                $txtFavorSmboxNumbers.focus();
                return false;
            }
        }

        var $txtMaxFastGotoThreadPageNum = $('#pd_cfg_max_fast_goto_thread_page_num');
        var maxFastGotoThreadPageNum = $.trim($txtMaxFastGotoThreadPageNum.val());
        if (!$.isNumeric(maxFastGotoThreadPageNum) || parseInt(maxFastGotoThreadPageNum) <= 0) {
            alert('页数链接最大数量格式不正确');
            $txtMaxFastGotoThreadPageNum.select();
            $txtMaxFastGotoThreadPageNum.focus();
            return false;
        }

        var $txtThreadContentFontSize = $('#pd_cfg_thread_content_font_size');
        var threadContentFontSize = $.trim($txtThreadContentFontSize.val());
        if (threadContentFontSize && (isNaN(parseInt(threadContentFontSize)) || parseInt(threadContentFontSize) < 0)) {
            alert('帖子内容字体大小格式不正确');
            $txtThreadContentFontSize.select();
            $txtThreadContentFontSize.focus();
            return false;
        }

        var $txtCustomMySmColor = $('#pd_cfg_custom_my_sm_color');
        var customMySmColor = $.trim($txtCustomMySmColor.val());
        if (customMySmColor && !/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
            alert('自定义本人的神秘颜色格式不正确，例：#009CFF');
            $txtCustomMySmColor.select();
            $txtCustomMySmColor.focus();
            return false;
        }

        var $txtDefShowMsgDuration = $('#pd_cfg_def_show_msg_duration');
        var defShowMsgDuration = $.trim($txtDefShowMsgDuration.val());
        if (!$.isNumeric(defShowMsgDuration) || parseInt(defShowMsgDuration) < -1) {
            alert('默认提示消息的持续时间格式不正确');
            $txtDefShowMsgDuration.select();
            $txtDefShowMsgDuration.focus();
            return false;
        }

        var $txtLogSaveDays = $('#pd_cfg_log_save_days');
        var logSaveDays = $.trim($txtLogSaveDays.val());
        if (!$.isNumeric(logSaveDays) || parseInt(logSaveDays) < 1) {
            alert('日志保存天数格式不正确');
            $txtLogSaveDays.select();
            $txtLogSaveDays.focus();
            return false;
        }

        var $txtSaveCurrentDepositAfterKfb = $('#pd_cfg_save_current_deposit_after_kfb');
        var $txtSaveCurrentDepositKfb = $('#pd_cfg_save_current_deposit_kfb');
        var saveCurrentDepositAfterKfb = parseInt($.trim($txtSaveCurrentDepositAfterKfb.val()));
        var saveCurrentDepositKfb = parseInt($.trim($txtSaveCurrentDepositKfb.val()));
        if (saveCurrentDepositAfterKfb || saveCurrentDepositKfb) {
            if (!saveCurrentDepositAfterKfb || saveCurrentDepositAfterKfb <= 0) {
                alert('自动活期存款满足额度格式不正确');
                $txtSaveCurrentDepositAfterKfb.select();
                $txtSaveCurrentDepositAfterKfb.focus();
                return false;
            }
            if (!saveCurrentDepositKfb || saveCurrentDepositKfb <= 0 || saveCurrentDepositKfb > saveCurrentDepositAfterKfb) {
                alert('想要存款的金额格式不正确');
                $txtSaveCurrentDepositKfb.select();
                $txtSaveCurrentDepositKfb.focus();
                return false;
            }
        }

        return true;
    },

    /**
     * 清除缓存
     */
    clearCache: function () {
        for (var key in Config) {
            if (/CookieName$/.test(key)) {
                Tools.setCookie(Config[key], '', Tools.getDate('-1d'));
            }
        }
        TmpLog.clear();
        localStorage.removeItem(Config.multiQuoteStorageName);
    },

    /**
     * 显示导入或导出设置对话框
     */
    showImportOrExportSettingDialog: function () {
        if ($('#pd_im_or_ex_setting').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_setting" style="width:600px;height:400px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_setting', '导入或导出设置', html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!window.confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_setting').val());
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
            options = ConfigMethod.normalize(options);
            Config = $.extend(true, {}, ConfigMethod.defConfig, options);
            ConfigMethod.write();
            alert('设置已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_im_or_ex_setting');
        });
        Dialog.show('pd_im_or_ex_setting');
        $('#pd_cfg_setting').val(JSON.stringify(Tools.getDifferentValueOfObject(ConfigMethod.defConfig, Config))).select();
    },

    /**
     * 显示自定义各等级神秘颜色设置对话框
     */
    showCustomSmColorDialog: function () {
        if ($('#pd_custom_sm_color').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="border-bottom:1px solid #9191FF;margin-bottom:7px;padding-bottom:5px"><strong>示例' +
            '（<a target="_blank" href="http://www.35ui.cn/jsnote/peise.html">常用配色表</a> / <a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a>）：' +
            '</strong><br /><b>等级范围：</b>4-4 <b>颜色：</b><span style="color:#0000FF">#0000FF</span><br /><b>等级范围：</b>10-99 <b>颜色：</b>' +
            '<span style="color:#5AD465">#5AD465</span><br /><b>等级范围：</b>5000-MAX <b>颜色：</b><span style="color:#FF0000">#FF0000</span></div>' +
            '  <ul id="pd_cfg_custom_sm_color_list"></ul>' +
            '  <div style="margin-top:5px" id="pd_cfg_custom_sm_color_add_btns"><a href="#">增加1个</a><a href="#" style="margin-left:7px">增加5个</a>' +
            '<a href="#" style="margin-left:7px">清除所有</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出配色方案</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_sm_color', '自定义各等级神秘颜色', html);
        $dialog.find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_custom_sm_color');
        });

        $dialog.find('#pd_cfg_custom_sm_color_list').on('keyup', '.pd_cfg_sm_color', function () {
            var $this = $(this);
            var color = $.trim($this.val());
            if (/^#[0-9a-fA-F]{6}$/.test(color)) {
                $this.next('input[type="color"]').val(color.toUpperCase());
            }
        }).on('change', 'input[type="color"]', function () {
            var $this = $(this);
            $this.prev('input').val($this.val().toString().toUpperCase());
        }).on('click', 'a', function (e) {
            e.preventDefault();
            $(this).closest('li').remove();
        });

        var getSmColorListLine = function (data) {
            if (!data) data = {};
            return ('<li><label>等级范围<input class="pd_cfg_sm_min" type="text" maxlength="5" style="width:30px" value="{0}" /></label>' +
            '<label>-<input class="pd_cfg_sm_max" type="text" maxlength="5" style="width:30px" value="{1}" /></label>' +
            '<label>颜色<input class="pd_cfg_sm_color" type="text" maxlength="7" style="width:50px" value="{2}" />' +
            '<input style="margin-left:0" type="color" value="{2}"></label> <a href="#">删除</a></li>')
                .replace('{0}', typeof data.min === 'undefined' ? '' : data.min)
                .replace('{1}', typeof data.max === 'undefined' ? '' : data.max)
                .replace(/\{2\}/g, typeof data.color === 'undefined' ? '' : data.color);
        };

        $dialog.find('#pd_cfg_custom_sm_color_add_btns').find('a:lt(2)').click(function (e) {
            e.preventDefault();
            var num = 1;
            if ($(this).is('#pd_cfg_custom_sm_color_add_btns > a:eq(1)')) num = 5;
            for (var i = 1; i <= num; i++) {
                $('#pd_cfg_custom_sm_color_list').append(getSmColorListLine());
            }
            Dialog.show('pd_custom_sm_color');
        }).end().find('a:last').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否清除所有设置？')) {
                $('#pd_cfg_custom_sm_color_list').empty();
                Dialog.show('pd_custom_sm_color');
            }
        });

        $dialog.find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportSmColorConfigDialog();
        });

        var smColorHtml = '';
        $.each(Config.customSmColorConfigList, function (index, data) {
            smColorHtml += getSmColorListLine(data);
        });
        $('#pd_cfg_custom_sm_color_list').html(smColorHtml);

        $dialog.submit(function (e) {
            e.preventDefault();
            var list = [];
            var verification = true;
            $('#pd_cfg_custom_sm_color_list > li').each(function () {
                var $this = $(this);
                var $txtSmMin = $this.find('.pd_cfg_sm_min');
                var smMin = $.trim($txtSmMin.val()).toUpperCase();
                if (smMin === '') return;
                if (!/^(-?\d+|MAX)$/i.test(smMin)) {
                    verification = false;
                    $txtSmMin.select();
                    $txtSmMin.focus();
                    alert('等级范围格式不正确');
                    return false;
                }
                var $txtSmMax = $this.find('.pd_cfg_sm_max');
                var smMax = $.trim($txtSmMax.val()).toUpperCase();
                if (smMax === '') return;
                if (!/^(-?\d+|MAX)$/i.test(smMax)) {
                    verification = false;
                    $txtSmMax.select();
                    $txtSmMax.focus();
                    alert('等级范围格式不正确');
                    return false;
                }
                if (Tools.compareSmLevel(smMax, smMin) < 0) {
                    verification = false;
                    $txtSmMin.select();
                    $txtSmMin.focus();
                    alert('等级范围格式不正确');
                    return false;
                }
                var $txtSmColor = $this.find('.pd_cfg_sm_color');
                var smColor = $.trim($txtSmColor.val()).toUpperCase();
                if (smColor === '') return;
                if (!/^#[0-9a-fA-F]{6}$/.test(smColor)) {
                    verification = false;
                    $txtSmColor.select();
                    $txtSmColor.focus();
                    alert('颜色格式不正确');
                    return false;
                }
                list.push({min: smMin, max: smMax, color: smColor});
            });
            if (verification) {
                list.sort(function (a, b) {
                    return Tools.compareSmLevel(a.min, b.min) > 0;
                });
                Config.customSmColorConfigList = list;
                ConfigMethod.write();
                Dialog.close('pd_custom_sm_color');
            }
        });

        Dialog.show('pd_custom_sm_color');
    },

    /**
     * 显示导入或导出配色方案对话框
     */
    showImportOrExportSmColorConfigDialog: function () {
        if ($('#pd_im_or_ex_sm_color_config').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入配色方案：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出配色方案：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_sm_color_config" style="width:420px;height:200px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=488016">其他人分享的配色方案</a></span>' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_sm_color_config', '导入或导出配色方案', html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!window.confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_sm_color_config').val());
            if (!options) return;
            try {
                options = JSON.parse(options);
            }
            catch (ex) {
                alert('配色方案有错误');
                return;
            }
            if (!options || $.type(options) !== 'array') {
                alert('配色方案有错误');
                return;
            }
            Config.customSmColorConfigList = options;
            ConfigMethod.write();
            alert('配色方案已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_im_or_ex_sm_color_config');
        });
        Dialog.show('pd_im_or_ex_sm_color_config');
        $dialog.find('#pd_cfg_sm_color_config').val(JSON.stringify(Config.customSmColorConfigList)).select();
    },

    /**
     * 显示自定义怪物名称对话框
     */
    showCustomMonsterNameDialog: function () {
        if ($('#pd_custom_monster_name').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <table id="pd_cfg_custom_monster_name_list">' +
            '    <tbody>' +
            '      <tr><th style="width:120px">怪物</th><th>自定义名称</th></tr>' +
            '      <tr><td>Lv.1：小史莱姆</td><td><input type="text" maxlength="18" data-id="1" /></td></tr>' +
            '      <tr><td>Lv.2：笨蛋</td><td><input type="text" maxlength="18" data-id="2" /></td></tr>' +
            '      <tr><td>Lv.3：大果冻史莱姆</td><td><input type="text" maxlength="18" data-id="3" /></td></tr>' +
            '      <tr><td>Lv.4：肉山</td><td><input type="text" maxlength="18" data-id="4" /></td></tr>' +
            '      <tr><td>Lv.5：大魔王</td><td><input type="text" maxlength="18" data-id="5" /></td></tr>' +
            '    </tbody>' +
            '  </table>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>确定</button><button>取消</button><button>重置</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_monster_name', '自定义怪物名称', html);
        $dialog.submit(function (e) {
            e.preventDefault();
            Config.customMonsterNameList = {};
            $('#pd_cfg_custom_monster_name_list input').each(function () {
                var $this = $(this);
                var name = $.trim($this.val());
                if (name !== '') {
                    Config.customMonsterNameList[parseInt($this.data('id'))] = name;
                }
            });
            ConfigMethod.write();
            Dialog.close('pd_custom_monster_name');
        }).find('.pd_cfg_btns > button:eq(1)').click(function () {
            return Dialog.close('pd_custom_monster_name');
        }).next('button').click(function (e) {
            e.preventDefault();
            $('#pd_cfg_custom_monster_name_list input').val('');
        });
        $.each(Config.customMonsterNameList, function (id, name) {
            $('#pd_cfg_custom_monster_name_list input[data-id="{0}"]'.replace('{0}', id)).val(name);
        });
        Dialog.show('pd_custom_monster_name');
        $('#pd_cfg_custom_monster_name_list input:first').focus();
    },

    /**
     * 显示自定义CSS对话框
     */
    showCustomCssDialog: function () {
        if ($('#pd_custom_css').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <strong>自定义CSS内容：</strong><br />' +
            '  <textarea wrap="off" style="width:750px;height:400px;white-space:pre"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500969">其他人分享的CSS规则</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_css', '自定义CSS', html);
        var $content = $dialog.find('textarea');
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.customCssContent = $.trim($content.val());
            ConfigMethod.write();
            Dialog.close('pd_custom_css');
        }).next('button').click(function () {
            return Dialog.close('pd_custom_css');
        });
        $content.val(Config.customCssContent);
        Dialog.show('pd_custom_css');
        $content.focus();
    },

    /**
     * 显示自定义脚本对话框
     */
    showCustomScriptDialog: function () {
        if ($('#pd_custom_script').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <label><strong>在脚本开始后执行的内容：</strong><br />' +
            '<textarea wrap="off" id="pd_custom_script_start_content" style="width:750px;height:250px;white-space:pre;margin-bottom:10px"></textarea></label><br />' +
            '  <label><strong>在脚本结束后执行的内容：</strong><br />' +
            '<textarea wrap="off" id="pd_custom_script_end_content" style="width:750px;height:250px;white-space:pre"></textarea></label>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a target="_blank" href="read.php?tid=500968">其他人分享的自定义脚本</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_custom_script', '自定义脚本', html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.customScriptStartContent = $('#pd_custom_script_start_content').val();
            Config.customScriptEndContent = $('#pd_custom_script_end_content').val();
            ConfigMethod.write();
            Dialog.close('pd_custom_script');
        }).next('button').click(function () {
            return Dialog.close('pd_custom_script');
        });
        $dialog.find('#pd_custom_script_start_content').val(Config.customScriptStartContent)
            .end().find('#pd_custom_script_end_content').val(Config.customScriptEndContent);
        Dialog.show('pd_custom_script');
        $dialog.find('#pd_custom_script_start_content').focus();
    },

    /**
     * 显示用户备注对话框
     */
    showUserMemoDialog: function () {
        if ($('#pd_user_memo').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  按照“用户名:备注”的格式（注意是英文冒号），每行一个<br />' +
            '  <textarea wrap="off" style="width:320px;height:400px;white-space:pre"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_user_memo', '用户备注', html);
        var $userMemoList = $dialog.find('textarea');
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            var content = $.trim($userMemoList.val());
            Config.userMemoList = {};
            var lines = content.split('\n');
            for (var i in lines) {
                var line = $.trim(lines[i]);
                if (!line) continue;
                if (!/.+?:.+/.test(line)) {
                    alert('用户备注格式不正确');
                    $userMemoList.focus();
                    return;
                }
                var valueArr = line.split(':');
                if (valueArr.length < 2) continue;
                var user = $.trim(valueArr[0]);
                var memo = $.trim(valueArr[1]);
                if (!user || !memo) continue;
                Config.userMemoList[user] = memo;
            }
            ConfigMethod.write();
            Dialog.close('pd_user_memo');
        }).next('button').click(function () {
            return Dialog.close('pd_user_memo');
        });
        var content = '';
        for (var user in Config.userMemoList) {
            content += '{0}:{1}\n'.replace('{0}', user).replace('{1}', Config.userMemoList[user]);
        }
        $userMemoList.val(content);
        Dialog.show('pd_user_memo');
        $userMemoList.focus();
    },

    /**
     * 显示关注用户对话框
     */
    showFollowUserDialog: function () {
        if ($('#pd_follow_user').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin-top:5px">' +
            '    <label><input id="pd_cfg_highlight_follow_user_thread_in_hp_enabled" type="checkbox" />高亮所关注用户的首页帖子链接 ' +
            '<a class="pd_cfg_tips" href="#" title="高亮所关注用户在首页下的帖子链接">[?]</a></label><br />' +
            '    <label><input id="pd_cfg_highlight_follow_user_thread_link_enabled" type="checkbox" />高亮所关注用户的帖子链接 ' +
            '<a class="pd_cfg_tips" href="#" title="高亮所关注用户在帖子列表页面下的帖子链接">[?]</a></label><br />' +
            '  </div>' +
            '  <ul id="pd_cfg_follow_user_list" style="margin-top:5px;width:274px;"></ul>' +
            '  <div id="pd_cfg_follow_user_btns" style="margin-top:5px;">' +
            '    <div style="display:inline-block"><a href="#">全选</a><a style="margin-left:7px" href="#">反选</a></div>' +
            '    <div style="float:right"><a style="margin-left:7px" href="#">删除</a></div>' +
            '  </div>' +
            '  <div style="margin-top:5px" title="添加多个用户请用英文逗号分隔"><input id="pd_cfg_add_follow_user" style="width:200px" type="text" />' +
            '<a style="margin-left:7px" href="#">添加</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出关注用户</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_follow_user', '关注用户', html);
        var $followUserList = $dialog.find('#pd_cfg_follow_user_list');
        $dialog.submit(function (e) {
            e.preventDefault();
            $dialog.find('.pd_cfg_btns > button:first').click();
        }).find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.highlightFollowUserThreadInHPEnabled = $('#pd_cfg_highlight_follow_user_thread_in_hp_enabled').prop('checked');
            Config.highlightFollowUserThreadLinkEnabled = $('#pd_cfg_highlight_follow_user_thread_link_enabled').prop('checked');
            Config.followUserList = [];
            $followUserList.find('li').each(function () {
                var $this = $(this);
                var name = $.trim($this.find('input[type="text"]').val());
                if (name !== '' && Tools.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                    Config.followUserList.push({name: name});
                }
            });
            ConfigMethod.write();
            Dialog.close('pd_follow_user');
        }).end().find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_follow_user');
        });

        $('#pd_cfg_highlight_follow_user_thread_in_hp_enabled').prop('checked', Config.highlightFollowUserThreadInHPEnabled);
        $('#pd_cfg_highlight_follow_user_thread_link_enabled').prop('checked', Config.highlightFollowUserThreadLinkEnabled);

        /**
         * 添加关注用户
         * @param {string} name 用户名
         */
        var addFollowUser = function (name) {
            $(
                ('<li style="line-height:24px"><input type="checkbox" /><input type="text" style="width:178px;margin-left:5px" maxlength="15" value="{0}" />' +
                '<a style="margin-left:7px" href="#">删除</a></li>')
                    .replace('{0}', name)
            ).appendTo($followUserList);
        };

        for (var i in Config.followUserList) {
            addFollowUser(Config.followUserList[i].name);
        }

        $followUserList.on('click', 'a', function (e) {
            e.preventDefault();
            $(this).parent().remove();
        });

        $('#pd_cfg_follow_user_btns').find('a:first')
            .click(function (e) {
                e.preventDefault();
                $followUserList.find('input[type="checkbox"]').prop('checked', true);
            })
            .end()
            .find('a:eq(1)')
            .click(function (e) {
                e.preventDefault();
                $followUserList.find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            })
            .end()
            .find('a:last')
            .click(function (e) {
                e.preventDefault();
                var $checked = $followUserList.find('li:has(input[type="checkbox"]:checked)');
                if ($checked.length === 0) return;
                if (window.confirm('是否删除所选用户？')) {
                    $checked.remove();
                }
            });

        $dialog.find('#pd_cfg_add_follow_user').keydown(function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                $(this).next('a').click();
            }
        }).next('a').click(function (e) {
            e.preventDefault();
            var users = $.trim($('#pd_cfg_add_follow_user').val()).split(',');
            if (!users || $.trim(users[0]) === '') return;
            for (var i in users) {
                var name = $.trim(users[i]);
                if (name === '') continue;
                if (Tools.inFollowOrBlockUserList(name, Config.followUserList) === -1) {
                    addFollowUser(name);
                }
            }
            $('#pd_cfg_add_follow_user').val('');
        });

        $dialog.find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportFollowOrBlockUserConfigDialog(1);
        });

        Dialog.show('pd_follow_user');
        $('#pd_cfg_highlight_follow_user_thread_in_hp_enabled').focus();
    },

    /**
     * 显示屏蔽用户对话框
     */
    showBlockUserDialog: function () {
        if ($('#pd_block_user').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin-top:5px">' +
            '    <label>默认屏蔽类型<select id="pd_cfg_block_user_default_type"><option value="0">屏蔽主题和回帖</option>' +
            '<option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option></select></label>' +
            '<label style="margin-left:10px"><input id="pd_cfg_block_user_at_tips_enabled" type="checkbox" />屏蔽@提醒 ' +
            '<a class="pd_cfg_tips" href="#" title="屏蔽被屏蔽用户的@提醒">[?]</a></label>' +
            '  </div>' +
            '  <ul id="pd_cfg_block_user_list" style="margin-top:5px;width:362px;"></ul>' +
            '  <div id="pd_cfg_block_user_btns" style="margin-top:5px;">' +
            '    <div style="display:inline-block"><a href="#">全选</a><a style="margin-left:7px" href="#">反选</a></div>' +
            '    <div style="float:right"><a href="#">修改为</a><select style="margin-left:7px"><option value="0">屏蔽主题和回帖</option>' +
            '<option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option></select><a style="margin-left:7px" href="#">删除</a></div>' +
            '  </div>' +
            '  <div style="margin-top:5px" title="添加多个用户请用英文逗号分隔"><input id="pd_cfg_add_block_user" style="width:200px" type="text" />' +
            '<a style="margin-left:7px" href="#">添加</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出屏蔽用户</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_block_user', '屏蔽用户', html);
        var $blockUserList = $dialog.find('#pd_cfg_block_user_list');
        $dialog.submit(function (e) {
            e.preventDefault();
            $dialog.find('.pd_cfg_btns > button:first').click();
        }).find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            Config.blockUserDefaultType = $('#pd_cfg_block_user_default_type').val();
            Config.blockUserAtTipsEnabled = $('#pd_cfg_block_user_at_tips_enabled').prop('checked');
            Config.blockUserList = [];
            $blockUserList.find('li').each(function () {
                var $this = $(this);
                var name = $.trim($this.find('input[type="text"]').val());
                if (name !== '' && Tools.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                    var type = parseInt($this.find('select').val());
                    Config.blockUserList.push({name: name, type: type});
                }
            });
            ConfigMethod.write();
            Dialog.close('pd_block_user');
        }).end().find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_block_user');
        });

        $('#pd_cfg_block_user_default_type').val(Config.blockUserDefaultType);
        $('#pd_cfg_block_user_at_tips_enabled').prop('checked', Config.blockUserAtTipsEnabled);

        /**
         * 添加屏蔽用户
         * @param {string} name 用户名
         * @param {number} type 屏蔽类型
         */
        var addBlockUser = function (name, type) {
            $(
                ('<li style="line-height:24px"><input type="checkbox" /><input type="text" style="width:150px;margin-left:5px" maxlength="15" value="{0}" />' +
                '<select style="margin-left:5px"><option value="0">屏蔽主题和回帖</option><option value="1">仅屏蔽主题</option>' +
                '<option value="2">仅屏蔽回帖</option></select><a style="margin-left:7px" href="#">删除</a></li>')
                    .replace('{0}', name)
            ).appendTo($blockUserList)
                .find('select').val(type);
        };

        for (var i in Config.blockUserList) {
            addBlockUser(Config.blockUserList[i].name, Config.blockUserList[i].type);
        }

        $blockUserList.on('click', 'a', function (e) {
            e.preventDefault();
            $(this).parent().remove();
        });

        $('#pd_cfg_block_user_btns').find('a:first')
            .click(function (e) {
                e.preventDefault();
                $blockUserList.find('input[type="checkbox"]').prop('checked', true);
            })
            .end()
            .find('a:eq(1)')
            .click(function (e) {
                e.preventDefault();
                $blockUserList.find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
            })
            .end()
            .find('a:eq(2)')
            .click(function (e) {
                e.preventDefault();
                var value = $(this).next('select').val();
                $blockUserList.find('li:has(input[type="checkbox"]:checked) > select').val(value);
            })
            .end()
            .find('a:last')
            .click(function (e) {
                e.preventDefault();
                var $checked = $blockUserList.find('li:has(input[type="checkbox"]:checked)');
                if ($checked.length === 0) return;
                if (window.confirm('是否删除所选用户？')) {
                    $checked.remove();
                }
            });

        $dialog.find('#pd_cfg_add_block_user').keydown(function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                $(this).next('a').click();
            }
        }).next('a').click(function (e) {
            e.preventDefault();
            var users = $.trim($('#pd_cfg_add_block_user').val()).split(',');
            var type = parseInt($('#pd_cfg_block_user_default_type').val());
            if (!users || $.trim(users[0]) === '') return;
            for (var i in users) {
                var name = $.trim(users[i]);
                if (name === '') continue;
                if (Tools.inFollowOrBlockUserList(name, Config.blockUserList) === -1) {
                    addBlockUser(name, type);
                }
            }
            $('#pd_cfg_add_block_user').val('');
        });
        $dialog.find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportFollowOrBlockUserConfigDialog(2);
        });

        Dialog.show('pd_block_user');
        $('#pd_cfg_block_user_default_type').focus();
    },

    /**
     * 显示导入/导出关注或屏蔽用户对话框
     * @param {number} type 1：关注用户；2：屏蔽用户
     */
    showImportOrExportFollowOrBlockUserConfigDialog: function (type) {
        if ($('#pd_im_or_ex_follow_or_block_user_config').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_follow_or_block_user_config" style="width:420px;height:200px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_follow_or_block_user_config', '导入或导出{0}用户'.replace('{0}', type === 2 ? '屏蔽' : '关注'), html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!window.confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_follow_or_block_user_config').val());
            if (!options) return;
            try {
                options = JSON.parse(options);
            }
            catch (ex) {
                alert('设置有错误');
                return;
            }
            if (!options || $.type(options) !== 'array') {
                alert('设置有错误');
                return;
            }
            if (type === 2) Config.blockUserList = options;
            else Config.followUserList = options;
            ConfigMethod.write();
            alert('设置已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_im_or_ex_follow_or_block_user_config');
        });
        Dialog.show('pd_im_or_ex_follow_or_block_user_config');
        $dialog.find('#pd_cfg_follow_or_block_user_config').val(JSON.stringify(type === 2 ? Config.blockUserList : Config.followUserList)).select();
    }
};
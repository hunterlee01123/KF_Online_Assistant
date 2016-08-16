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
        Func.run('ConfigDialog.show_before_');
        var html =
            '<div class="pd_cfg_main">' +
            '  <div class="pd_cfg_nav">' +
            '    <a title="清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）" href="#">清除缓存</a>' +
            '    <a href="#">运行命令</a>' +
            '    <a href="#">查看日志</a>' +
            '    <a href="#">导入/导出设置</a>' +
            '  </div>' +
            '  <div class="pd_cfg_panel" style="margin-bottom:5px">' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_refresh_enabled" type="checkbox" />定时模式 ' +
            '<span class="pd_cfg_tips" title="可按时进行自动操作（包括捐款、争夺、抽取神秘盒子、自动更换神秘颜色，需开启相关功能），只在论坛首页生效' +
            '（不开启此模式的话只能在刷新页面后才会进行操作）">[?]</span></label></legend>' +
            '      <label>标题提示方案<select id="pd_cfg_show_refresh_mode_tips_type"><option value="auto">停留一分钟后显示</option>' +
            '<option value="always">总是显示</option><option value="never">不显示</option></select>' +
            '<span class="pd_cfg_tips" title="在首页的网页标题上显示定时模式提示的方案">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_donation_enabled" type="checkbox" />自动KFB捐款</label></legend>' +
            '      <label>KFB捐款额度<input id="pd_cfg_donation_kfb" maxlength="4" style="width:32px" type="text" />' +
            '<span class="pd_cfg_tips" title="取值范围在1-5000的整数之间；可设置为百分比，表示捐款额度为当前收入的百分比（最多不超过5000KFB），例：80%">[?]</span></label>' +
            '      <label style="margin-left:10px">在<input id="pd_cfg_donation_after_time" maxlength="8" style="width:55px" type="text" />' +
            '之后捐款 <span class="pd_cfg_tips" title="在当天的指定时间之后捐款（24小时制），例：22:30:00（注意不要设置得太接近零点，以免错过捐款）">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_loot_enabled" type="checkbox" />自动争夺 ' +
            '<span class="pd_cfg_tips" title="可自动领取争夺奖励，并可自动进行批量攻击（可选）">[?]</span></label></legend>' +
            '      <label>在<input placeholder="例：07:00-08:15,17:00-18:15" id="pd_cfg_no_auto_loot_when" maxlength="23" style="width:150px" type="text" />内不自动领取争夺奖励 ' +
            '<span class="pd_cfg_tips" title="在指定的时间段内不自动领取争夺奖励（主要与在指定时间内才攻击配合使用），例：07:00-08:15,17:00-18:15，留空表示不启用">[?]</span>' +
            '</label><br />' +
            '      <label><input id="pd_cfg_defer_loot_time_when_remain_attack_num_enabled" type="checkbox" data-disabled="#pd_cfg_defer_loot_time_when_remain_attack_num" />' +
            '在剩余攻击次数不低于</label><label><input id="pd_cfg_defer_loot_time_when_remain_attack_num" maxlength="2" style="width:15px" type="text" />次时，抽盒子延长争夺时间 ' +
            '<span class="pd_cfg_tips" title="在领取争夺奖励时，当本回合剩余攻击次数不低于指定次数的情况下，抽取神秘盒子以延长争夺时间">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_custom_monster_name_enabled" type="checkbox" data-disabled="#pd_cfg_custom_monster_name_dialog" />自定义怪物名称 ' +
            '<span class="pd_cfg_tips" title="自定义怪物名称，请点击详细设置自定义各怪物的名称">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_monster_name_dialog" href="#">详细设置&raquo;</a>' +
            '      <fieldset>' +
            '        <legend><label><input id="pd_cfg_auto_attack_enabled" type="checkbox" />自动攻击 ' +
            '<span class="pd_cfg_tips" title="在自动领取争夺奖励后，自动进行批量攻击（需指定攻击目标）">[?]</span></label></legend>' +
            '      <label>在距本回合结束前<input id="pd_cfg_attack_after_time" maxlength="3" style="width:23px" type="text" />分钟内才完成(剩余)攻击 ' +
            '<span class="pd_cfg_tips" title="在距本回合结束前指定时间内才自动完成(剩余)批量攻击，取值范围：{0}-{1}，留空表示不启用">[?]</span></label><br />'
                .replace('{0}', Const.defLootInterval).replace('{1}', Const.minAttackAfterTime) +
            '      <label><input id="pd_cfg_attempt_attack_enabled" type="checkbox" data-disabled="#pd_cfg_attempt_attack_after_time_enabled" />在生命值不超过{0}时进行试探攻击 '
                .replace('{0}', Const.maxAttemptAttackLifeNum) +
            '<span class="pd_cfg_tips" title="当实际生命值不超过指定值时自动进行试探攻击，需同时设置攻击时限，适用于较低等级玩家，详见【常见问题10】">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_attempt_attack_after_time_enabled" type="checkbox" />在攻击时限之前的{0}分钟内才进行试探攻击 '
                .replace('{0}', Const.attemptAttackAfterTime) +
            '<span class="pd_cfg_tips" title="在自动攻击时限之前的指定时间内才进行试探攻击，可有效减少被怪物攻击次数（适合有时间挂机的较低等级玩家），' +
            '例：攻击时限设为80分钟，则在距本回合结束前{0}分钟内才进行试探攻击">[?]</span></label>'.replace('{0}', 80 + Const.attemptAttackAfterTime) +
            '        <table id="pd_cfg_batch_attack_list">' +
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
            '<option value="5">Lv.5：大魔王</option></select><span class="pd_cfg_tips" title="当拥有致命一击时的自动攻击目标">[?]</span></label>' +
            '      </fieldset>' +
            '      <label><input id="pd_cfg_auto_use_item_enabled" type="checkbox" data-disabled="#pd_cfg_auto_use_item_names" />自动使用刚掉落的道具 ' +
            '<span class="pd_cfg_tips" title="自动使用批量攻击后刚掉落的道具，需指定自动使用的道具名称，按Shift或Ctrl键可多选">[?]</span></label><br />' +
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
            '<span class="pd_cfg_tips" title="注意：抽取神秘盒子将延长争夺奖励的领取时间">[?]</span></label></legend>' +
            '      <label>偏好的神秘盒子数字<input placeholder="例: 52,1,28,400" id="pd_cfg_favor_smbox_numbers" style="width:180px" type="text" />' +
            '<span class="pd_cfg_tips" title="例：52,1,28,400（以英文逗号分隔，按优先级排序），如设定的数字都不可用，则从剩余的盒子中随机抽选一个，如无需求可留空">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>首页相关</legend>' +
            '      <label>@提醒<select id="pd_cfg_at_tips_handle_type" style="width:130px"><option value="no_highlight">取消已读提醒高亮</option>' +
            '<option value="no_highlight_extra">取消已读提醒高亮，并在无提醒时补上消息框</option><option value="hide_box_1">不显示已读提醒的消息框</option>' +
            '<option value="hide_box_2">永不显示消息框</option><option value="default">保持默认</option>' +
            '<option value="at_change_to_cao">将@改为艹(其他和方式2相同)</option></select>' +
            '<span class="pd_cfg_tips" title="对首页上的有人@你的消息框进行处理的方案">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_sm_level_up_alert_enabled" type="checkbox" />神秘等级升级提醒 ' +
            '<span class="pd_cfg_tips" title="在神秘等级升级后进行提醒，只在首页生效">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_fixed_deposit_due_alert_enabled" type="checkbox" />定期存款到期提醒 ' +
            '<span class="pd_cfg_tips" title="在定时存款到期时进行提醒，只在首页生效">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_sm_rank_change_alert_enabled" type="checkbox" />系数排名变化提醒 ' +
            '<span class="pd_cfg_tips" title="在神秘系数排名发生变化时进行提醒，只在首页生效">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_home_page_thread_fast_goto_link_enabled" type="checkbox" />在首页帖子旁显示跳转链接 ' +
            '<span class="pd_cfg_tips" title="在首页帖子链接旁显示快速跳转至页末的链接">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_show_vip_surplus_time_enabled" type="checkbox" />显示VIP剩余时间 ' +
            '<span class="pd_cfg_tips" title="在首页显示VIP剩余时间">[?]</span></label>' +
            '    </fieldset>' +
            '  </div>' +
            '  <div class="pd_cfg_panel">' +
            '    <fieldset>' +
            '      <legend>版块页面相关</legend>' +
            '      <label><input id="pd_cfg_show_fast_goto_thread_page_enabled" type="checkbox" data-disabled="#pd_cfg_max_fast_goto_thread_page_num" />' +
            '显示帖子页数快捷链接 <span class="pd_cfg_tips" title="在版块页面中显示帖子页数快捷链接">[?]</span></label>' +
            '      <label style="margin-left:10px">页数链接最大数量<input id="pd_cfg_max_fast_goto_thread_page_num" style="width:25px" maxlength="4" type="text" />' +
            '<span class="pd_cfg_tips" title="在帖子页数快捷链接中显示页数链接的最大数量">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_highlight_new_post_enabled" type="checkbox" />高亮今日的新帖 ' +
            '<span class="pd_cfg_tips" title="在版块页面中高亮今日新发表帖子的发表时间">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>帖子页面相关</legend>' +
            '      <label>帖子每页楼层数量<select id="pd_cfg_per_page_floor_num"><option value="10">10</option>' +
            '<option value="20">20</option><option value="30">30</option></select>' +
            '<span class="pd_cfg_tips" title="用于电梯直达和帖子页数快捷链接功能，如果修改了KF设置里的“文章列表每页个数”，请在此修改成相同的数目">[?]</span></label>' +
            '      <label style="margin-left:10px">帖子内容字体大小<input id="pd_cfg_thread_content_font_size" maxlength="2" style="width:20px" type="text" />px ' +
            '<span class="pd_cfg_tips" title="帖子内容字体大小，留空表示使用默认大小，推荐值：14">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_adjust_thread_content_width_enabled" type="checkbox" />调整帖子内容宽度 ' +
            '<span class="pd_cfg_tips" title="调整帖子内容宽度，使其保持一致">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_turn_page_via_keyboard_enabled" type="checkbox" />通过左右键翻页 ' +
            '<span class="pd_cfg_tips" title="在帖子和搜索页面通过左右键进行翻页">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_auto_change_sm_color_enabled_2" type="checkbox" data-disabled="#pd_cfg_auto_change_sm_color_page" />自动更换神秘颜色 ' +
            '<span class="pd_cfg_tips" title="可自动更换神秘颜色，请点击详细设置前往相应页面进行自定义设置">[?]</span></label>' +
            '<a id="pd_cfg_auto_change_sm_color_page" style="margin-left:10px" target="_blank" href="kf_growup.php">详细设置&raquo;</a><br />' +
            '      <label>自定义本人的神秘颜色<input id="pd_cfg_custom_my_sm_color" maxlength="7" style="width:50px" type="text" />' +
            '<input style="margin-left:0" type="color" id="pd_cfg_custom_my_sm_color_select">' +
            '<span class="pd_cfg_tips" title="自定义本人的神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），例：#009CFF，如无需求可留空">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_custom_sm_color_enabled" type="checkbox" data-disabled="#pd_cfg_custom_sm_color_dialog" />自定义各等级神秘颜色 ' +
            '<span class="pd_cfg_tips" title="自定义各等级神秘颜色（包括帖子页面的ID显示颜色和楼层边框颜色，仅自己可见），请点击详细设置自定义各等级颜色">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_sm_color_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_modify_kf_other_domain_enabled" type="checkbox" />将绯月其它域名的链接修改为当前域名 ' +
            '<span class="pd_cfg_tips" title="将帖子和短消息中的绯月其它域名的链接修改为当前域名">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_multi_quote_enabled" type="checkbox" />开启多重引用功能 ' +
            '<span class="pd_cfg_tips" title="在帖子页面开启多重回复和多重引用功能">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_batch_buy_thread_enabled" type="checkbox" />开启批量购买帖子功能 ' +
            '<span class="pd_cfg_tips" title="在帖子页面开启批量购买帖子的功能">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_user_memo_enabled" type="checkbox" data-disabled="#pd_cfg_user_memo_dialog" />显示用户备注 ' +
            '<span class="pd_cfg_tips" title="显示用户的自定义备注，请点击详细设置自定义用户备注">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_user_memo_dialog" href="#">详细设置&raquo;</a>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_parse_media_tag_enabled" type="checkbox" />解析多媒体标签 ' +
            '<span class="pd_cfg_tips" title="在帖子页面解析HTML5多媒体标签，详见【常见问题15】">[?]</span></label>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>其它设置</legend>' +
            '      <label>默认提示消息的持续时间<input id="pd_cfg_def_show_msg_duration" maxlength="5" style="width:30px" type="text" />秒 ' +
            '<span class="pd_cfg_tips" title="设置为-1表示永久显示，例：15">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_animation_effect_off_enabled" type="checkbox" />禁用动画效果 ' +
            '<span class="pd_cfg_tips" title="禁用jQuery的动画效果（推荐在配置较差的机器上使用）">[?]</span></label><br />' +
            '      <label>日志保存天数<input id="pd_cfg_log_save_days" maxlength="3" style="width:25px" type="text" />' +
            '<span class="pd_cfg_tips" title="默认值：{0}">[?]</span></label>'.replace('{0}', ConfigMethod.defConfig.logSaveDays) +
            '      <label style="margin-left:10px">浏览器类型<select id="pd_cfg_browse_type"><option value="auto">自动检测</option>' +
            '<option value="desktop">桌面版</option><option value="mobile">移动版</option></select>' +
            '<span class="pd_cfg_tips" title="用于在KFOL助手上判断浏览器的类型，一般使用自动检测即可；如果当前浏览器与自动检测的类型不相符' +
            '（移动版会在设置界面标题上显示“For Mobile”的字样），请手动设置为正确的类型">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_show_log_link_enabled" type="checkbox" />显示日志链接 ' +
            '<span class="pd_cfg_tips" title="在页面上方显示助手日志的链接">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_show_search_link_enabled" type="checkbox" />显示搜索链接 ' +
            '<span class="pd_cfg_tips" title="在页面上方显示搜索对话框的链接">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_add_side_bar_fast_nav_enabled" type="checkbox" />为侧边栏添加快捷导航 ' +
            '<span class="pd_cfg_tips" title="为侧边栏添加快捷导航的链接">[?]</span></label>' +
            '      <label style="margin-left:10px"><input id="pd_cfg_modify_side_bar_enabled" type="checkbox" />将侧边栏修改为平铺样式 ' +
            '<span class="pd_cfg_tips" title="将侧边栏修改为和手机相同的平铺样式">[?]</span></label><br />' +
            '      <label><input id="pd_cfg_custom_css_enabled" type="checkbox" data-disabled="#pd_cfg_custom_css_dialog" />添加自定义CSS ' +
            '<span class="pd_cfg_tips" title="为页面添加自定义的CSS内容，请点击详细设置填入自定义的CSS内容">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_css_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_custom_script_enabled" type="checkbox" data-disabled="#pd_cfg_custom_script_dialog" />执行自定义脚本 ' +
            '<span class="pd_cfg_tips" title="执行自定义的javascript脚本，请点击详细设置填入自定义的脚本内容">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_custom_script_dialog" href="#">详细设置&raquo;</a>' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend>关注和屏蔽</legend>' +
            '      <label><input id="pd_cfg_follow_user_enabled" type="checkbox" data-disabled="#pd_cfg_follow_user_dialog" />关注用户 ' +
            '<span class="pd_cfg_tips" title="开启关注用户的功能，所关注的用户将被加注记号，请点击详细设置管理关注用户">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_follow_user_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_block_user_enabled" type="checkbox" data-disabled="#pd_cfg_block_user_dialog" />屏蔽用户 ' +
            '<span class="pd_cfg_tips" title="开启屏蔽用户的功能，你将看不见所屏蔽用户的发言，请点击详细设置管理屏蔽用户">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_block_user_dialog" href="#">详细设置&raquo;</a><br />' +
            '      <label><input id="pd_cfg_block_thread_enabled" type="checkbox" data-disabled="#pd_cfg_block_thread_dialog" />屏蔽帖子 ' +
            '<span class="pd_cfg_tips" title="开启屏蔽标题包含指定关键字的帖子的功能，请点击详细设置管理屏蔽关键字">[?]</span></label>' +
            '<a style="margin-left:10px" id="pd_cfg_block_thread_dialog" href="#">详细设置&raquo;</a><br />' +
            '    </fieldset>' +
            '    <fieldset>' +
            '      <legend><label><input id="pd_cfg_auto_save_current_deposit_enabled" type="checkbox" />自动活期存款 ' +
            '<span class="pd_cfg_tips" title="在当前收入满足指定额度之后自动将指定数额存入活期存款中，只会在首页触发">[?]</span></label></legend>' +
            '      <label>在当前收入已满<input id="pd_cfg_save_current_deposit_after_kfb" maxlength="10" style="width:45px" type="text" />KFB之后 ' +
            '<span class="pd_cfg_tips" title="在当前收入已满指定KFB额度之后自动进行活期存款，例：1000">[?]</span></label><br />' +
            '      <label>将<input id="pd_cfg_save_current_deposit_kfb" maxlength="10" style="width:45px" type="text" />KFB存入活期存款 ' +
            '<span class="pd_cfg_tips" title="将指定额度的KFB存入活期存款中，例：900；举例：设定已满1000存900，当前收入为2000，则自动存入金额为1800">[?]</span></label>' +
            '    </fieldset>' +
            '  </div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about">' +
            '    <a target="_blank" href="https://greasyfork.org/zh-CN/scripts/8615">By 喵拉布丁</a>' +
            '    <i style="color:#666;font-style:normal">(V{0})</i>'.replace('{0}', version) +
            '    <a target="_blank" href="https://git.oschina.net/miaolapd/KF_Online_Assistant/wikis/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98">[常见问题]</a>' +
            '    <a target="_blank" href="read.php?tid=508450">[讨论帖]</a>' +
            '  </span>' +
            '  <button>确定</button><button>取消</button><button>默认值</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_config', 'KF Online助手设置' + (KFOL.isMobile ? ' (For Mobile)' : ''), html);

        $dialog.find('.pd_cfg_btns > button:eq(1)').click(function () {
            return Dialog.close('pd_config');
        }).end().find('.pd_cfg_btns > button:eq(2)').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否重置所有设置？')) {
                ConfigMethod.clear();
                if (typeof Extra !== 'undefined' && typeof Extra.clearConfig !== 'undefined') {
                    Extra.clearConfig();
                }
                alert('设置已重置');
                location.reload();
            }
        }).end().find('.pd_cfg_nav > a:first-child').click(function (e) {
            e.preventDefault();
            var type = window.prompt('可清除与助手有关的Cookies和本地存储数据（不包括助手设置和日志）\n请填写清除类型，0：全部清除；1：清除Cookies；2：清除本地缓存', 0);
            if (type === null) return;
            type = parseInt($.trim(type));
            if (!isNaN(type) && type >= 0) {
                ConfigDialog.clearCache(type);
                alert('缓存已清除');
            }
        }).next('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showRunCommandDialog();
        }).next('a').click(function (e) {
            e.preventDefault();
            Log.show();
        }).next('a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showImportOrExportSettingDialog();
        });

        $dialog.on('click', 'a[id^="pd_cfg_"][href="#"]', function (e) {
            e.preventDefault();
            if ($(this).hasClass('pd_disabled_link')) return;
            if (this.id === 'pd_cfg_custom_monster_name_dialog') ConfigDialog.showCustomMonsterNameDialog();
            else if (this.id === 'pd_cfg_custom_sm_color_dialog') ConfigDialog.showCustomSmColorDialog();
            else if (this.id === 'pd_cfg_user_memo_dialog') ConfigDialog.showUserMemoDialog();
            else if (this.id === 'pd_cfg_custom_css_dialog') ConfigDialog.showCustomCssDialog();
            else if (this.id === 'pd_cfg_custom_script_dialog') ConfigDialog.showCustomScriptDialog();
            else if (this.id === 'pd_cfg_follow_user_dialog') ConfigDialog.showFollowUserDialog();
            else if (this.id === 'pd_cfg_block_user_dialog') ConfigDialog.showBlockUserDialog();
            else if (this.id === 'pd_cfg_block_thread_dialog') ConfigDialog.showBlockThreadDialog();
        }).end().find('#pd_cfg_custom_my_sm_color_select').change(function () {
            $('#pd_cfg_custom_my_sm_color').val($(this).val().toString().toUpperCase());
        }).end().find('pd_cfg_custom_my_sm_color').keyup(function () {
            var customMySmColor = $.trim($(this).val());
            if (/^#[0-9a-fA-F]{6}$/.test(customMySmColor)) {
                $('pd_cfg_custom_my_sm_color_select').val(customMySmColor.toUpperCase());
            }
        }).end().find('#pd_cfg_auto_use_item_names').keydown(function (e) {
            if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 97)) {
                e.preventDefault();
                $(this).children().each(function () {
                    $(this).prop('selected', true);
                });
            }
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
        });

        Dialog.show('pd_config');
        $dialog.find('a:first').focus();
        Func.run('ConfigDialog.show_after_');
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

        $('#pd_cfg_auto_loot_enabled').prop('checked', Config.autoLootEnabled);
        $('#pd_cfg_no_auto_loot_when').val(Config.noAutoLootWhen.join(','));
        $('#pd_cfg_defer_loot_time_when_remain_attack_num_enabled').prop('checked', Config.deferLootTimeWhenRemainAttackNumEnabled);
        $('#pd_cfg_defer_loot_time_when_remain_attack_num').val(Config.deferLootTimeWhenRemainAttackNum);
        $('#pd_cfg_custom_monster_name_enabled').prop('checked', Config.customMonsterNameEnabled);
        $('#pd_cfg_auto_attack_enabled').prop('checked', Config.autoAttackEnabled);
        if (Config.attackAfterTime > 0) $('#pd_cfg_attack_after_time').val(Config.attackAfterTime);
        $('#pd_cfg_attempt_attack_enabled').prop('checked', Config.attemptAttackEnabled);
        $('#pd_cfg_attempt_attack_after_time_enabled').prop('checked', Config.attemptAttackAfterTimeEnabled);
        $.each(Config.batchAttackList, function (id, num) {
            $('#pd_cfg_batch_attack_list input[data-id="{0}"]'.replace('{0}', id)).val(num);
        });
        $('#pd_cfg_deadly_attack_id').val(Config.deadlyAttackId);
        $('#pd_cfg_auto_use_item_enabled').prop('checked', Config.autoUseItemEnabled);
        $('#pd_cfg_auto_use_item_names').val(Config.autoUseItemNames);

        $('#pd_cfg_auto_draw_smbox_enabled').prop('checked', Config.autoDrawSmbox2Enabled);
        $('#pd_cfg_favor_smbox_numbers').val(Config.favorSmboxNumbers.join(','));

        $('#pd_cfg_at_tips_handle_type').val(Config.atTipsHandleType.toLowerCase());
        $('#pd_cfg_sm_level_up_alert_enabled').prop('checked', Config.smLevelUpAlertEnabled);
        $('#pd_cfg_fixed_deposit_due_alert_enabled').prop('checked', Config.fixedDepositDueAlertEnabled);
        $('#pd_cfg_sm_rank_change_alert_enabled').prop('checked', Config.smRankChangeAlertEnabled);
        $('#pd_cfg_home_page_thread_fast_goto_link_enabled').prop('checked', Config.homePageThreadFastGotoLinkEnabled);
        $('#pd_cfg_show_vip_surplus_time_enabled').prop('checked', Config.showVipSurplusTimeEnabled);

        $('#pd_cfg_show_fast_goto_thread_page_enabled').prop('checked', Config.showFastGotoThreadPageEnabled);
        $('#pd_cfg_max_fast_goto_thread_page_num').val(Config.maxFastGotoThreadPageNum);
        $('#pd_cfg_highlight_new_post_enabled').prop('checked', Config.highlightNewPostEnabled);

        $('#pd_cfg_per_page_floor_num').val(Config.perPageFloorNum);
        $('#pd_cfg_thread_content_font_size').val(Config.threadContentFontSize > 0 ? Config.threadContentFontSize : '');
        $('#pd_cfg_adjust_thread_content_width_enabled').prop('checked', Config.adjustThreadContentWidthEnabled);
        $('#pd_cfg_turn_page_via_keyboard_enabled').prop('checked', Config.turnPageViaKeyboardEnabled);
        $('#pd_cfg_auto_change_sm_color_enabled_2').prop('checked', Config.autoChangeSMColorEnabled);
        $('#pd_cfg_custom_my_sm_color').val(Config.customMySmColor);
        if (Config.customMySmColor) $('#pd_cfg_custom_my_sm_color_select').val(Config.customMySmColor);
        $('#pd_cfg_custom_sm_color_enabled').prop('checked', Config.customSmColorEnabled);
        $('#pd_cfg_modify_kf_other_domain_enabled').prop('checked', Config.modifyKFOtherDomainEnabled);
        $('#pd_cfg_multi_quote_enabled').prop('checked', Config.multiQuoteEnabled);
        $('#pd_cfg_batch_buy_thread_enabled').prop('checked', Config.batchBuyThreadEnabled);
        $('#pd_cfg_user_memo_enabled').prop('checked', Config.userMemoEnabled);
        $('#pd_cfg_parse_media_tag_enabled').prop('checked', Config.parseMediaTagEnabled);

        $('#pd_cfg_def_show_msg_duration').val(Config.defShowMsgDuration);
        $('#pd_cfg_animation_effect_off_enabled').prop('checked', Config.animationEffectOffEnabled);
        $('#pd_cfg_log_save_days').val(Config.logSaveDays);
        $('#pd_cfg_browse_type').val(Config.browseType);
        $('#pd_cfg_show_log_link_enabled').prop('checked', Config.showLogLinkEnabled);
        $('#pd_cfg_show_search_link_enabled').prop('checked', Config.showSearchLinkEnabled);
        $('#pd_cfg_add_side_bar_fast_nav_enabled').prop('checked', Config.addSideBarFastNavEnabled);
        $('#pd_cfg_modify_side_bar_enabled').prop('checked', Config.modifySideBarEnabled);
        $('#pd_cfg_custom_css_enabled').prop('checked', Config.customCssEnabled);
        $('#pd_cfg_custom_script_enabled').prop('checked', Config.customScriptEnabled);

        $('#pd_cfg_follow_user_enabled').prop('checked', Config.followUserEnabled);
        $('#pd_cfg_block_user_enabled').prop('checked', Config.blockUserEnabled);
        $('#pd_cfg_block_thread_enabled').prop('checked', Config.blockThreadEnabled);

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
        options.donationAfterTime = $('#pd_cfg_donation_after_time').val();

        options.autoLootEnabled = $('#pd_cfg_auto_loot_enabled').prop('checked');
        options.noAutoLootWhen = $.trim($('#pd_cfg_no_auto_loot_when').val()).split(',');
        options.deferLootTimeWhenRemainAttackNumEnabled = $('#pd_cfg_defer_loot_time_when_remain_attack_num_enabled').prop('checked');
        options.deferLootTimeWhenRemainAttackNum = parseInt($.trim($('#pd_cfg_defer_loot_time_when_remain_attack_num').val()));
        options.customMonsterNameEnabled = $('#pd_cfg_custom_monster_name_enabled').prop('checked');
        options.autoAttackEnabled = $('#pd_cfg_auto_attack_enabled').prop('checked');
        options.attackAfterTime = parseInt($.trim($('#pd_cfg_attack_after_time').val()));
        options.attemptAttackEnabled = $('#pd_cfg_attempt_attack_enabled').prop('checked');
        options.attemptAttackAfterTimeEnabled = $('#pd_cfg_attempt_attack_after_time_enabled').prop('checked');
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
        options.smLevelUpAlertEnabled = $('#pd_cfg_sm_level_up_alert_enabled').prop('checked');
        options.fixedDepositDueAlertEnabled = $('#pd_cfg_fixed_deposit_due_alert_enabled').prop('checked');
        options.smRankChangeAlertEnabled = $('#pd_cfg_sm_rank_change_alert_enabled').prop('checked');
        options.homePageThreadFastGotoLinkEnabled = $('#pd_cfg_home_page_thread_fast_goto_link_enabled').prop('checked');
        options.showVipSurplusTimeEnabled = $('#pd_cfg_show_vip_surplus_time_enabled').prop('checked');

        options.showFastGotoThreadPageEnabled = $('#pd_cfg_show_fast_goto_thread_page_enabled').prop('checked');
        options.maxFastGotoThreadPageNum = parseInt($.trim($('#pd_cfg_max_fast_goto_thread_page_num').val()));
        options.highlightNewPostEnabled = $('#pd_cfg_highlight_new_post_enabled').prop('checked');

        options.perPageFloorNum = $('#pd_cfg_per_page_floor_num').val();
        options.threadContentFontSize = parseInt($.trim($('#pd_cfg_thread_content_font_size').val()));
        options.adjustThreadContentWidthEnabled = $('#pd_cfg_adjust_thread_content_width_enabled').prop('checked');
        options.turnPageViaKeyboardEnabled = $('#pd_cfg_turn_page_via_keyboard_enabled').prop('checked');
        options.autoChangeSMColorEnabled = $('#pd_cfg_auto_change_sm_color_enabled_2').prop('checked');
        options.customMySmColor = $.trim($('#pd_cfg_custom_my_sm_color').val()).toUpperCase();
        options.customSmColorEnabled = $('#pd_cfg_custom_sm_color_enabled').prop('checked');
        options.modifyKFOtherDomainEnabled = $('#pd_cfg_modify_kf_other_domain_enabled').prop('checked');
        options.multiQuoteEnabled = $('#pd_cfg_multi_quote_enabled').prop('checked');
        options.batchBuyThreadEnabled = $('#pd_cfg_batch_buy_thread_enabled').prop('checked');
        options.userMemoEnabled = $('#pd_cfg_user_memo_enabled').prop('checked');
        options.parseMediaTagEnabled = $('#pd_cfg_parse_media_tag_enabled').prop('checked');

        options.defShowMsgDuration = parseInt($.trim($('#pd_cfg_def_show_msg_duration').val()));
        options.animationEffectOffEnabled = $('#pd_cfg_animation_effect_off_enabled').prop('checked');
        options.logSaveDays = parseInt($.trim($('#pd_cfg_log_save_days').val()));
        options.browseType = $('#pd_cfg_browse_type').val();
        options.showLogLinkEnabled = $('#pd_cfg_show_log_link_enabled').prop('checked');
        options.showSearchLinkEnabled = $('#pd_cfg_show_search_link_enabled').prop('checked');
        options.addSideBarFastNavEnabled = $('#pd_cfg_add_side_bar_fast_nav_enabled').prop('checked');
        options.modifySideBarEnabled = $('#pd_cfg_modify_side_bar_enabled').prop('checked');
        options.customCssEnabled = $('#pd_cfg_custom_css_enabled').prop('checked');
        options.customScriptEnabled = $('#pd_cfg_custom_script_enabled').prop('checked');

        options.followUserEnabled = $('#pd_cfg_follow_user_enabled').prop('checked');
        options.blockUserEnabled = $('#pd_cfg_block_user_enabled').prop('checked');
        options.blockThreadEnabled = $('#pd_cfg_block_thread_enabled').prop('checked');

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
            if (parseInt(donationKfb) <= 0 || parseInt(donationKfb) > Const.maxDonationKfb) {
                alert('KFB捐款额度的取值范围在1-{0}之间'.replace('{0}', Const.maxDonationKfb));
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

        var $txtDeferLootTimeWhenRemainAttackNum = $('#pd_cfg_defer_loot_time_when_remain_attack_num');
        var deferLootTimeWhenRemainAttackNum = parseInt($.trim($txtDeferLootTimeWhenRemainAttackNum.val()));
        if (isNaN(deferLootTimeWhenRemainAttackNum)) {
            alert('剩余攻击次数上限格式不正确');
            $txtDeferLootTimeWhenRemainAttackNum.select();
            $txtDeferLootTimeWhenRemainAttackNum.focus();
            return false;
        }
        else if (deferLootTimeWhenRemainAttackNum < 1 || deferLootTimeWhenRemainAttackNum > Const.maxAttackNum) {
            alert('剩余攻击次数上限范围在1-{0}之间'.replace('{0}', Const.maxAttackNum));
            $txtDeferLootTimeWhenRemainAttackNum.select();
            $txtDeferLootTimeWhenRemainAttackNum.focus();
            return false;
        }

        var $txtAttackAfterTime = $('#pd_cfg_attack_after_time');
        var attackAfterTime = $.trim($txtAttackAfterTime.val());
        if (attackAfterTime) {
            attackAfterTime = parseInt(attackAfterTime);
            if (isNaN(attackAfterTime) || attackAfterTime > Const.defLootInterval || attackAfterTime < Const.minAttackAfterTime) {
                alert('在指定时间之内才完成攻击的取值范围为：{0}-{1}'.replace('{0}', Const.defLootInterval).replace('{1}', Const.minAttackAfterTime));
                $txtAttackAfterTime.select();
                $txtAttackAfterTime.focus();
                return false;
            }
        }
        else {
            if ($('#pd_cfg_attempt_attack_enabled').prop('checked')) {
                alert('开启“试探攻击”必须同时设置“在指定时间之内才完成攻击”');
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
        if (totalAttackNum > Const.maxAttackNum) {
            alert('攻击次数不得超过{0}次'.replace('{0}', Const.maxAttackNum));
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
     * @param {number} type 清除类别，0：全部清除；1：清除Cookies；2：清除本地缓存
     */
    clearCache: function (type) {
        if (type === 0 || type === 1) {
            for (var key in Const) {
                if (/CookieName$/.test(key)) {
                    Tools.setCookie(Const[key], '', Tools.getDate('-1d'));
                }
            }
        }
        if (type === 0 || type === 2) {
            TmpLog.clear();
            localStorage.removeItem(Const.multiQuoteStorageName);
        }
    },

    /**
     * 显示运行命令对话框
     */
    showRunCommandDialog: function () {
        if ($('#pd_run_command').length > 0) return;
        Dialog.close('pd_config');
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="margin:5px 0">运行命令快捷键：<b>Ctrl+Enter</b>；清除命令快捷键：<b>Ctrl+退格键</b><br />' +
            '按<b>F12键</b>可打开浏览器控制台查看消息（需切换至控制台或Console标签）</div>' +
            '  <textarea wrap="off" style="width:750px;height:300px;white-space:pre"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>运行</button><button>清除</button><button>关闭</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_run_command', '运行命令', html);
        var $textArea = $dialog.find('textarea');
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            var content = $textArea.val();
            if (!content) return;
            try {
                console.log(eval(content));
            }
            catch (ex) {
                console.log(ex);
            }
        }).next('button').click(function (e) {
            e.preventDefault();
            $textArea.val('').focus();
        }).next('button').click(function () {
            return Dialog.close('pd_run_command');
        });
        Dialog.show('pd_run_command');
        $textArea.keyup(function (e) {
            if (e.ctrlKey && e.keyCode === 13) {
                $dialog.find('.pd_cfg_btns > button:first').click();
            }
            else if (e.ctrlKey && e.keyCode === 8) {
                $dialog.find('.pd_cfg_btns > button:eq(1)').click();
            }
        }).focus();
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
        var $customSmColorList = $dialog.find('#pd_cfg_custom_sm_color_list');
        $dialog.find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_custom_sm_color');
        });

        $customSmColorList.on('keyup', '.pd_cfg_sm_color', function () {
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
                $customSmColorList.append(getSmColorListLine());
            }
            Dialog.show('pd_custom_sm_color');
        }).end().find('a:last').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否清除所有设置？')) {
                $customSmColorList.empty();
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
        $customSmColorList.html(smColorHtml);

        $dialog.submit(function (e) {
            e.preventDefault();
            var list = [];
            var verification = true;
            $customSmColorList.find('li').each(function () {
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
        if ($customSmColorList.find('input').length > 0) $customSmColorList.find('input:first').focus();
        else $('#pd_cfg_custom_sm_color_add_btns > a:first').focus();
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
            '  <div style="margin:5px 0">' +
            '    <label style="color:#F00"><input type="radio" name="pd_custom_script_type" value="start" checked="checked" /> 在脚本开始时执行的内容</label>' +
            '    <label style="color:#00F"><input type="radio" name="pd_custom_script_type" value="end" /> 在脚本结束时执行的内容</label>' +
            '  </div>' +
            '  <textarea wrap="off" id="pd_custom_script_start_content" style="width:750px;height:500px;white-space:pre"></textarea>' +
            '  <textarea wrap="off" id="pd_custom_script_end_content" style="width:750px;height:500px;white-space:pre;display:none"></textarea>' +
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
            .end().find('#pd_custom_script_end_content').val(Config.customScriptEndContent)
            .end().find('input[name="pd_custom_script_type"]').click(function () {
            var type = $(this).val();
            $('#pd_custom_script_' + (type === 'end' ? 'start' : 'end') + '_content').hide();
            $('#pd_custom_script_' + (type === 'end' ? 'end' : 'start') + '_content').show();
        });
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
            '<span class="pd_cfg_tips" title="高亮所关注用户在首页下的帖子链接">[?]</span></label><br />' +
            '    <label><input id="pd_cfg_highlight_follow_user_thread_link_enabled" type="checkbox" />高亮所关注用户的帖子链接 ' +
            '<span class="pd_cfg_tips" title="高亮所关注用户在版块页面下的帖子链接">[?]</span></label><br />' +
            '  </div>' +
            '  <ul id="pd_cfg_follow_user_list" style="margin-top:5px;width:274px;line-height:24px"></ul>' +
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
                ('<li><input type="checkbox" /><input type="text" style="width:178px;margin-left:5px" maxlength="15" value="{0}" />' +
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
                    Dialog.show('pd_follow_user');
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
            Dialog.show('pd_follow_user');
        });

        $dialog.find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCommonImportOrExportConfigDialog(1);
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
            '  <div style="margin-top:5px;line-height:24px">' +
            '    <label>默认屏蔽类型<select id="pd_cfg_block_user_default_type"><option value="0">屏蔽主题和回帖</option>' +
            '<option value="1">仅屏蔽主题</option><option value="2">仅屏蔽回帖</option></select></label>' +
            '    <label style="margin-left:10px"><input id="pd_cfg_block_user_at_tips_enabled" type="checkbox" />屏蔽@提醒 ' +
            '<span class="pd_cfg_tips" title="屏蔽被屏蔽用户的@提醒">[?]</span></label><br />' +
            '    <label>版块屏蔽范围<select id="pd_cfg_block_user_forum_type"><option value="0">所有版块</option><option value="1">包括指定版块</option>' +
            '<option value="2">排除指定版块</option></select></label><br />' +
            '    <label>版块ID列表<input id="pd_cfg_block_user_fid_list" type="text" style="width:220px" /> ' +
            '<span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span></label>' +
            '  </div>' +
            '  <ul id="pd_cfg_block_user_list" style="margin-top:5px;width:362px;line-height:24px"></ul>' +
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
            Config.blockUserForumType = parseInt($('#pd_cfg_block_user_forum_type').val());
            Config.blockUserFidList = [];
            $.each($.trim($('#pd_cfg_block_user_fid_list').val()).split(','), function (i, fid) {
                fid = parseInt($.trim(fid));
                if (!isNaN(fid) && fid > 0) Config.blockUserFidList.push(fid);
            });
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
        $('#pd_cfg_block_user_forum_type').val(Config.blockUserForumType);
        $('#pd_cfg_block_user_fid_list').val(Config.blockUserFidList.join(','));

        /**
         * 添加屏蔽用户
         * @param {string} name 用户名
         * @param {number} type 屏蔽类型
         */
        var addBlockUser = function (name, type) {
            $(
                ('<li><input type="checkbox" /><input type="text" style="width:150px;margin-left:5px" maxlength="15" value="{0}" />' +
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
                    Dialog.show('pd_block_user');
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
            Dialog.show('pd_block_user');
        });

        $dialog.find('#pd_cfg_block_user_forum_type').change(function () {
            $('#pd_cfg_block_user_fid_list').prop('disabled', parseInt($(this).val()) === 0);
        }).end().find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCommonImportOrExportConfigDialog(2);
        });

        Dialog.show('pd_block_user');
        $('#pd_cfg_block_user_forum_type').triggerHandler('change');
        $('#pd_cfg_block_user_default_type').focus();
    },

    /**
     * 显示屏蔽帖子对话框
     */
    showBlockThreadDialog: function () {
        if ($('#pd_block_thread').length > 0) return;
        var html =
            '<div class="pd_cfg_main">' +
            '  <div style="border-bottom:1px solid #9191FF;margin-bottom:7px;padding-bottom:5px">' +
            '    标题关键字可使用普通字符串或正则表达式，正则表达式请使用/abc/的格式，例：/关键字A.*关键字B/i<br />' +
            '    用户名和版块ID为可选项（多个用户名或版块ID请用英文逗号分隔）<br />' +
            '    <label>默认版块屏蔽范围<select id="pd_cfg_block_thread_def_forum_type"><option value="0">所有版块</option><option value="1">包括指定版块</option>' +
            '<option value="2">排除指定版块</option></select></label>' +
            '    <label style="margin-left:5px">默认版块ID列表<input id="pd_cfg_block_thread_def_fid_list" type="text" style="width:150px" /></label>' +
            '  </div>' +
            '  <table id="pd_cfg_block_thread_list" style="line-height:22px;text-align:center">' +
            '    <tbody>' +
            '      <tr>' +
            '        <th style="width:220px">标题关键字(必填)</th>' +
            '        <th style="width:62px">屏蔽用户</th>' +
            '        <th style="width:200px">用户名 <span class="pd_cfg_tips" title="多个用户名请用英文逗号分隔">[?]</span></th>' +
            '        <th style="width:62px">屏蔽范围</th>' +
            '        <th style="width:132px">版块ID <span class="pd_cfg_tips" title="版块URL中的fid参数，多个ID请用英文逗号分隔">[?]</span></th>' +
            '        <th style="width:35px"></th>' +
            '      </tr>' +
            '    </tbody>' +
            '  </table>' +
            '  <div style="margin-top:5px" id="pd_cfg_block_thread_add_btns"><a href="#">增加1个</a><a href="#" style="margin-left:7px">增加5个</a>' +
            '<a href="#" style="margin-left:7px">清除所有</a></div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a href="#">导入/导出屏蔽帖子</a></span>' +
            '  <button>确定</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_block_thread', '屏蔽帖子', html, 'width:768px');
        var $blockThreadList = $dialog.find('#pd_cfg_block_thread_list');

        /**
         * 验证设置是否正确
         * @returns {boolean} 是否验证通过
         */
        var verify = function () {
            var flag = true;
            $blockThreadList.find('tr:gt(0)').each(function () {
                var $this = $(this);
                var $txtKeyWord = $this.find('td:first-child > input');
                var keyWord = $txtKeyWord.val();
                if ($.trim(keyWord) === '') return;
                if (/^\/.+\/[gimy]*$/.test(keyWord)) {
                    try {
                        eval(keyWord);
                    }
                    catch (ex) {
                        alert('正则表达式不正确');
                        $txtKeyWord.select();
                        $txtKeyWord.focus();
                        flag = false;
                        return false;
                    }
                }
            });
            return flag;
        };

        $dialog.submit(function (e) {
            e.preventDefault();
            $dialog.find('.pd_cfg_btns > button:first').click();
        }).find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!verify()) return;
            Config.blockThreadDefForumType = parseInt($('#pd_cfg_block_thread_def_forum_type').val());
            Config.blockThreadDefFidList = [];
            $.each($.trim($('#pd_cfg_block_thread_def_fid_list').val()).split(','), function (i, fid) {
                fid = parseInt($.trim(fid));
                if (!isNaN(fid) && fid > 0) Config.blockThreadDefFidList.push(fid);
            });
            Config.blockThreadList = [];
            $blockThreadList.find('tr:gt(0)').each(function () {
                var $this = $(this);
                var keyWord = $this.find('td:first-child > input').val();
                if ($.trim(keyWord) === '') return;
                var newObj = {keyWord: keyWord};

                var userType = parseInt($this.find('td:nth-child(2) > select').val());
                if (userType > 0) {
                    var userList = [];
                    $.each($.trim($this.find('td:nth-child(3) > input').val()).split(','), function (i, user) {
                        user = $.trim(user);
                        if (user) userList.push(user);
                    });
                    if (userList.length > 0) newObj[userType === 2 ? 'excludeUser' : 'includeUser'] = userList;
                }

                var fidType = parseInt($this.find('td:nth-child(4) > select').val());
                if (fidType > 0) {
                    var fidList = [];
                    $.each($.trim($this.find('td:nth-child(5) > input').val()).split(','), function (i, fid) {
                        fid = parseInt($.trim(fid));
                        if (!isNaN(fid) && fid > 0) fidList.push(fid);
                    });
                    if (fidList.length > 0) newObj[fidType === 2 ? 'excludeFid' : 'includeFid'] = fidList;
                }
                Config.blockThreadList.push(newObj);
            });
            ConfigMethod.write();
            Dialog.close('pd_block_thread');
        }).end().find('.pd_cfg_btns > button:last').click(function () {
            return Dialog.close('pd_block_thread');
        });

        $blockThreadList.on('change', 'select', function () {
            var $this = $(this);
            $this.parent('td').next('td').find('input').prop('disabled', parseInt($this.val()) === 0);
        }).on('click', 'td > a', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
        });

        /**
         * 添加屏蔽帖子
         * @param {string} keyWord 标题关键字
         * @param {number} userType 屏蔽用户，0：所有；1：包括；2：排除
         * @param {string[]} userList 用户名
         * @param {number} fidType 屏蔽范围，0：所有；1：包括；2：排除
         * @param {number[]} fidList 版块ID列表
         */
        var addBlockThread = function (keyWord, userType, userList, fidType, fidList) {
            $(
                ('<tr>' +
                '  <td><input type="text" style="width:208px" value="{0}" /></td>' +
                '  <td><select><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>' +
                '  <td><input type="text" style="width:188px" value="{1}" {2} /></td>' +
                '  <td><select><option value="0">所有</option><option value="1">包括</option><option value="2">排除</option></select></td>' +
                '  <td><input type="text" style="width:120px" value="{3}" {4} /></td>' +
                '  <td><a href="#">删除</a></td>' +
                '</tr>')
                    .replace('{0}', keyWord)
                    .replace('{1}', userList.join(','))
                    .replace('{2}', userType === 0 ? 'disabled="disabled"' : '')
                    .replace('{3}', fidList.join(','))
                    .replace('{4}', fidType === 0 ? 'disabled="disabled"' : '')
            ).appendTo($blockThreadList)
                .find('td:nth-child(2) > select').val(userType)
                .end().find('td:nth-child(4) > select').val(fidType);
        };

        for (var i in Config.blockThreadList) {
            var userType = 0;
            var userList = [];
            if (typeof Config.blockThreadList[i].includeUser !== 'undefined') {
                userType = 1;
                userList = Config.blockThreadList[i].includeUser;
            }
            else if (typeof Config.blockThreadList[i].excludeUser !== 'undefined') {
                userType = 2;
                userList = Config.blockThreadList[i].excludeUser;
            }

            var fidType = 0;
            var fidList = [];
            if (typeof Config.blockThreadList[i].includeFid !== 'undefined') {
                fidType = 1;
                fidList = Config.blockThreadList[i].includeFid;
            }
            else if (typeof Config.blockThreadList[i].excludeFid !== 'undefined') {
                fidType = 2;
                fidList = Config.blockThreadList[i].excludeFid;
            }
            addBlockThread(Config.blockThreadList[i].keyWord, userType, userList, fidType, fidList);
        }

        $('#pd_cfg_block_thread_add_btns').find('a:lt(2)').click(function (e) {
            e.preventDefault();
            var num = 1;
            if ($(this).is('#pd_cfg_block_thread_add_btns > a:eq(1)')) num = 5;
            for (var i = 1; i <= num; i++) {
                addBlockThread('', 0, [], parseInt($('#pd_cfg_block_thread_def_forum_type').val()), $.trim($('#pd_cfg_block_thread_def_fid_list').val()).split(','));
            }
            Dialog.show('pd_block_thread');
        }).end().find('a:last').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否清除所有屏蔽关键字？')) {
                $blockThreadList.find('tbody > tr:gt(0)').remove();
                Dialog.show('pd_block_thread');
            }
        });

        $dialog.find('#pd_cfg_block_thread_def_forum_type').change(function () {
            $('#pd_cfg_block_thread_def_fid_list').prop('disabled', parseInt($(this).val()) === 0);
        }).end().find('.pd_cfg_about > a').click(function (e) {
            e.preventDefault();
            ConfigDialog.showCommonImportOrExportConfigDialog(3);
        });

        Dialog.show('pd_block_thread');
        $('#pd_cfg_block_thread_def_forum_type').val(Config.blockThreadDefForumType).focus().triggerHandler('change');
        $('#pd_cfg_block_thread_def_fid_list').val(Config.blockThreadDefFidList.join(','));
    },

    /**
     * 显示通用的导入/导出设置对话框
     * @param {number} type 1：关注用户；2：屏蔽用户；3：屏蔽帖子
     */
    showCommonImportOrExportConfigDialog: function (type) {
        if ($('#pd_common_im_or_ex_config').length > 0) return;
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入设置：</strong>将设置内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出设置：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_cfg_common_config" style="width:420px;height:200px;word-break:break-all"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var title = '关注用户';
        if (type === 2) title = '屏蔽用户';
        else if (type === 3) title = '屏蔽帖子';
        var $dialog = Dialog.create('pd_common_im_or_ex_config', '导入或导出{0}'.replace('{0}', title), html);
        $dialog.find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!window.confirm('是否导入文本框中的设置？')) return;
            var options = $.trim($('#pd_cfg_common_config').val());
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
            else if (type === 3) Config.blockThreadList = options;
            else Config.followUserList = options;
            ConfigMethod.write();
            alert('设置已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_common_im_or_ex_config');
        });
        Dialog.show('pd_common_im_or_ex_config');

        var options = Config.followUserList;
        if (type === 2) options = Config.blockUserList;
        else if (type === 3) options = Config.blockThreadList;
        $dialog.find('#pd_cfg_common_config').val(JSON.stringify(options)).select();
    }
};
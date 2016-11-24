/* 其它模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import {
    read as readConfig,
    write as writeConfig,
    Config as defConfig,
} from './Config';
import {show as showConfigDialog} from './ConfigDialog';
import * as TmpLog from './TmpLog';
import * as Public from './Public';
import * as Bank from './Bank';

/**
 * 高亮今日新发表帖子的发表时间
 */
export const highlightNewPost = function () {
    $('.thread1 > tbody > tr > td:last-child').has('a.bl').each(function () {
        let html = $(this).html();
        if (/\|\s*\d{2}:\d{2}<br>\n.*\d{2}:\d{2}/.test(html)) {
            html = html.replace(/(\d{2}:\d{2})<br>/, '<span class="pd_highlight">$1</span><br>');
            $(this).html(html);
        }
    });
};

/**
 * 在版块页面中添加帖子页数快捷链接
 */
export const addFastGotoThreadPageLink = function () {
    $('.threadtit1 > a[href^="read.php"]').each(function () {
        let $link = $(this);
        let floorNum = $link.closest('td').next().find('ul > li > a').contents().eq(0).text();
        if (!floorNum || floorNum < Config.perPageFloorNum) return;
        let url = $link.attr('href');
        let totalPageNum = Math.floor(floorNum / Config.perPageFloorNum) + 1;
        let html = '';
        for (let i = 1; i < totalPageNum; i++) {
            if (i > Config.maxFastGotoThreadPageNum) {
                if (i + 1 <= totalPageNum) {
                    html += `..<a href="${url}&page=${totalPageNum}">${totalPageNum}</a>`;
                }
                break;
            }
            html += `<a href="${url}&page=${i + 1}">${i + 1}</a>`;
        }
        html = `<span class="pd_thread_page">&hellip;${html}</span>`;
        $link.after(html).parent().css('white-space', 'normal');
    });
};

/**
 * 高亮at提醒页面中未读的消息
 */
export const highlightUnReadAtTipsMsg = function () {
    if ($('.kf_share1:first').text().trim() !== `含有关键词 “${Info.userName}” 的内容`) return;
    let timeString = Util.getCookie(Const.prevReadAtTipsCookieName);
    if (!timeString || !/^\d+日\d+时\d+分$/.test(timeString)) return;
    let prevString = '';
    $('.kf_share1:eq(1) > tbody > tr:gt(0) > td:first-child').each(function (index) {
        let $this = $(this);
        let curString = $this.text().trim();
        if (index === 0) prevString = curString;
        if (timeString < curString && prevString >= curString) {
            $this.addClass('pd_highlight');
            prevString = curString;
        }
        else return false;
    });
    $('.kf_share1').on('click', 'td > a', function () {
        Util.deleteCookie(Const.prevReadAtTipsCookieName);
    });
};

/**
 * 在短消息页面中添加快速取款的链接
 */
export const addFastDrawMoneyLink = function () {
    if (!$('td:contains("SYSTEM")').length || !$('td:contains("收到了他人转账的KFB")').length) return;
    let $msg = $('.thread2 > tbody > tr:eq(-2) > td:last');
    let html = $msg.html();
    let matches = /给你转帐(\d+)KFB/i.exec(html);
    if (matches) {
        let money = parseInt(matches[1]);
        $msg.html(
            html.replace(/会员\[(.+?)\]通过论坛银行/, '会员[<a target="_blank" href="profile.php?action=show&username=$1">$1</a>]通过论坛银行')
                .replace(matches[0], `给你转帐<span class="pd_stat"><em>${money.toLocaleString()}</em></span>KFB`)
        );

        $('<br><a title="从活期存款中取出当前转账的金额" href="#">快速取款</a> | <a title="取出银行账户中的所有活期存款" href="#">取出所有存款</a>')
            .appendTo($msg)
            .filter('a:eq(0)')
            .click(function (e) {
                e.preventDefault();
                Msg.destroy();
                Bank.drawCurrentDeposit(money);
            })
            .end()
            .filter('a:eq(1)')
            .click(function (e) {
                e.preventDefault();
                Msg.destroy();
                Msg.wait('<strong>正在获取当前活期存款金额&hellip;</strong>');
                $.get('hack.php?H_name=bank&t=' + new Date().getTime(), function (html) {
                    Msg.destroy();
                    let matches = /活期存款：(\d+)KFB<br/.exec(html);
                    if (!matches) {
                        alert('获取当前活期存款金额失败');
                        return;
                    }
                    let money = parseInt(matches[1]);
                    if (money <= 0) {
                        Msg.show('当前活期存款余额为零', -1);
                        return;
                    }
                    Bank.drawCurrentDeposit(money);
                });
            });

        $('a[href^="message.php?action=write&remid="]').attr('href', '#').addClass('pd_disabled_link').click(function (e) {
            e.preventDefault();
            alert('本短消息由系统发送，请勿直接回复；如需回复，请点击给你转账的用户链接，向其发送短消息');
        });
    }
};

/**
 * 添加关注和屏蔽用户以及用户备注的链接
 */
export const addFollowAndBlockAndMemoUserLink = function () {
    let matches = /(.+?)\s*详细信息/.exec($('td:contains("详细信息")').text());
    if (!matches) return;
    let userName = $.trim(matches[1]);
    $('<span>[<a href="#">关注用户</a>] [<a href="#">屏蔽用户</a>]</span><br><span>[<a href="#">添加备注</a>]</span><br>')
        .appendTo($('a[href^="message.php?action=write&touid="]').parent())
        .find('a').each(function () {
        let $this = $(this);
        if ($this.is('a:contains("备注")')) {
            let str = '';
            for (let [name, memo] of Util.entries(Config.userMemoList)) {
                if (name === userName) {
                    str = memo;
                    break;
                }
            }
            if (str !== '') {
                $this.text('修改备注').data('memo', str);
                let $info = $('.log1 > tbody > tr:last-child > td:last-child');
                $info.html(`备注：${str}<br>${$info.html()}`);
            }
        }
        else {
            let str = '关注';
            let userList = Config.followUserList;
            if ($this.text().indexOf('屏蔽') > -1) {
                str = '屏蔽';
                userList = Config.blockUserList;
            }
            if (Util.inFollowOrBlockUserList(userName, userList) > -1) {
                $this.addClass('pd_highlight').text('解除' + str);
            }
        }
    }).click(function (e) {
        e.preventDefault();
        readConfig();
        let $this = $(this);
        if ($this.is('a:contains("备注")')) {
            let memo = $this.data('memo');
            if (!memo) memo = '';
            let value = prompt('为此用户添加备注（要删除备注请留空）：', memo);
            if (value === null) return;
            if (!Config.userMemoEnabled) Config.userMemoEnabled = true;
            value = $.trim(value);
            if (value) {
                Config.userMemoList[userName] = value;
                $this.text('修改备注');
            }
            else {
                delete Config.userMemoList[userName];
                $this.text('添加备注');
            }
            $this.data('memo', value);
            writeConfig();
        }
        else {
            let str = '关注';
            let userList = Config.followUserList;
            if ($this.text().includes('屏蔽')) {
                str = '屏蔽';
                userList = Config.blockUserList;
                if (!Config.blockUserEnabled) Config.blockUserEnabled = true;
            }
            else {
                if (!Config.followUserEnabled) Config.followUserEnabled = true;
            }
            if ($this.text() === '解除' + str) {
                let index = Util.inFollowOrBlockUserList(userName, userList);
                if (index > -1) {
                    userList.splice(index, 1);
                    writeConfig();
                }
                $this.removeClass('pd_highlight').text(str + '用户');
                alert('该用户已被解除' + str);
            }
            else {
                if (Util.inFollowOrBlockUserList(userName, userList) === -1) {
                    if (str === '屏蔽') {
                        let type = Config.blockUserDefaultType;
                        type = prompt('请填写屏蔽类型，0：屏蔽主题和回帖；1：仅屏蔽主题；2：仅屏蔽回帖', type);
                        if (type === null) return;
                        type = parseInt(type);
                        if (isNaN(type) || type < 0 || type > 2) type = Config.blockUserDefaultType;
                        userList.push({name: userName, type: type});
                    }
                    else {
                        userList.push({name: userName});
                    }
                    writeConfig();
                }
                $this.addClass('pd_highlight').text('解除' + str);
                alert('该用户已被' + str);
            }
        }
    });
};

/**
 * 修改我的回复页面里的帖子链接
 */
export const modifyMyPostLink = function () {
    $('.t a[href^="read.php?tid="]').each(function () {
        let $this = $(this);
        $this.attr('href', $this.attr('href').replace(/&uid=\d+#(\d+)/, '&spid=$1'));
    });
};

/**
 * 在短消息页面添加选择指定短消息的按钮
 */
export const addMsgSelectButton = function () {
    let $checkeds = $('.thread1 > tbody > tr > td:last-child > [type="checkbox"]');
    $('<input value="自定义" type="button" style="margin-right: 3px;">').insertBefore('[type="button"][value="全选"]')
        .click(function (e) {
            e.preventDefault();
            let value = $.trim(
                prompt('请填写所要选择的包含指定字符串的短消息标题（可用|符号分隔多个标题）', '收到了他人转账的KFB|银行汇款通知|您的文章被评分|您的文章被删除')
            );
            if (value !== '') {
                $checkeds.prop('checked', false);
                let titleArr = value.split('|');
                $('.thread1 > tbody > tr > td:nth-child(2) > a').each(function () {
                    let $this = $(this);
                    for (let title of titleArr) {
                        if ($this.text().toLowerCase().includes(title.toLowerCase())) {
                            $this.closest('tr').find('td:last-child > input[type="checkbox"]').prop('checked', true);
                        }
                    }
                });
            }
        })
        .parent()
        .attr('colspan', 4)
        .prev('td')
        .attr('colspan', 3);

    $('<input value="反选" type="button" style="margin-left: 5px; margin-right: 1px;">')
        .insertAfter('[type="button"][value="全选"]')
        .click(() => Util.selectInverse($checkeds));
};

/**
 * 添加自动更换ID颜色的按钮
 */
export const addAutoChangeIdColorButton = function () {
    let $autoChangeIdColor = $('table div > table > tbody > tr > td:contains("自定义ID颜色")');
    $('<span class="pd_highlight">低等级没人权？没有自己喜欢的颜色？快来试试助手的<a href="#">自定义本人神秘颜色</a>的功能吧！（虽然仅限自己可见 ╮(╯▽╰)╭）</span><br>')
        .appendTo($autoChangeIdColor)
        .find('a')
        .click(function (e) {
            e.preventDefault();
            showConfigDialog();
        });

    let $idColors = $autoChangeIdColor.parent('tr').nextAll('tr').not('tr:last');
    if ($idColors.find('a').length <= 1) return;
    let $area = $(`
<form>
<div data-name="autoChangeIdColorBtns" style="margin-top: 5px;">
  <label><input name="autoChangeIdColorEnabled" class="pd_input" type="checkbox"> 自动更换ID颜色</label>
</div>
</form>
`).appendTo($autoChangeIdColor);
    $area.find('[name="autoChangeIdColorEnabled"]').click(function () {
        let $this = $(this);
        let enabled = $this.prop('checked');
        if (enabled !== Config.autoChangeIdColorEnabled) {
            readConfig();
            Config.autoChangeIdColorEnabled = enabled;
            writeConfig();
        }

        if (enabled) {
            $idColors.addClass('pd_id_color_select').find('td:not(:has(a))').css('cursor', 'not-allowed');
            $(`
<label class="pd_cfg_ml">
  更换顺序
  <select name="autoChangeIdColorType" style="font-size: 12px;">
    <option value="random">随机</option><option value="sequence">顺序</option>
  </select>
</label>&nbsp;
<label>每隔 <input name="autoChangeIdColorInterval" class="pd_input" style="width: 25px;" type="text" maxlength="5"> 小时</label>
<button name="save" type="button">保存</button>
<button name="reset" type="button" style="margin-left: 3px;">重置</button><br>
<a class="pd_btn_link" data-name="selectAll" href="#">全选</a>
<a class="pd_btn_link" data-name="selectInverse" href="#">反选</a>
<label><input name="changeAllAvailableIdColorEnabled" class="pd_input" type="checkbox"> 选择当前所有可用的ID颜色</label>
`).insertAfter($this.parent()).filter('[name="save"]').click(function () {
                let $autoChangeIdColorInterval = $area.find('[name="autoChangeIdColorInterval"]');
                let interval = parseInt($autoChangeIdColorInterval.val());
                if (isNaN(interval) || interval <= 0) {
                    alert('ID颜色更换时间间隔格式不正确');
                    $autoChangeIdColorInterval.select().focus();
                    return;
                }
                let changeAllAvailableSMColorEnabled = $area.find('[name="changeAllAvailableIdColorEnabled"]').prop('checked');
                let customChangeSMColorList = [];
                $idColors.find('[type="checkbox"]:checked').each(function () {
                    customChangeSMColorList.push(parseInt($(this).val()));
                });
                if (!changeAllAvailableSMColorEnabled && customChangeSMColorList.length <= 1) {
                    alert('必须选择2种或以上的ID颜色');
                    return;
                }
                if (customChangeSMColorList.length <= 1) customChangeSMColorList = [];

                let oriInterval = Config.autoChangeIdColorInterval;
                readConfig();
                Config.autoChangeIdColorType = $area.find('[name="autoChangeIdColorType"]').val().toLowerCase();
                Config.autoChangeIdColorInterval = interval;
                Config.changeAllAvailableIdColorEnabled = changeAllAvailableSMColorEnabled;
                Config.customAutoChangeIdColorList = customChangeSMColorList;
                writeConfig();
                if (oriInterval !== Config.autoChangeIdColorInterval)
                    Util.deleteCookie(Const.autoChangeIdColorCookieName);
                alert('设置保存成功');
            }).end().filter('[name="reset"]').click(function () {
                readConfig();
                Config.autoChangeIdColorEnabled = defConfig.autoChangeIdColorEnabled;
                Config.autoChangeIdColorType = defConfig.autoChangeIdColorType;
                Config.autoChangeIdColorInterval = defConfig.autoChangeIdColorInterval;
                Config.changeAllAvailableIdColorEnabled = defConfig.changeAllAvailableIdColorEnabled;
                Config.customAutoChangeIdColorList = defConfig.customAutoChangeIdColorList;
                writeConfig();
                Util.deleteCookie(Const.autoChangeIdColorCookieName);
                TmpLog.deleteValue(Const.prevAutoChangeIdColorTmpLogName);
                alert('设置已重置');
                location.reload();
            }).end().filter('[data-name="selectAll"], [data-name="selectInverse"]').click(function (e) {
                e.preventDefault();
                if ($idColors.find('input[disabled]').length > 0) {
                    alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                    $area.find('[name="changeAllAvailableIdColorEnabled"]').focus();
                    return;
                }
                if ($(this).is('[data-name="selectAll"]')) Util.selectAll($idColors.find('[type="checkbox"]'));
                else Util.selectInverse($idColors.find('[type="checkbox"]'));
            });

            $idColors.find('td:has(a)').each(function () {
                let $this = $(this);
                let matches = /&color=(\d+)/i.exec($this.find('a').attr('href'));
                if (matches) $this.append(`<input type="checkbox" class="pd_input" value="${matches[1]}">`);
            });

            $area.find('[name="autoChangeIdColorType"]').val(Config.autoChangeIdColorType);
            $area.find('[name="autoChangeIdColorInterval"]').val(Config.autoChangeIdColorInterval);
            $area.find('[name="changeAllAvailableIdColorEnabled"]').click(function () {
                $idColors.find('input').prop('disabled', $(this).prop('checked'));
            }).prop('checked', Config.changeAllAvailableIdColorEnabled).triggerHandler('click');
            for (let id of Config.customAutoChangeIdColorList) {
                $idColors.find(`input[value="${id}"]`).prop('checked', true);
            }
        }
        else {
            $this.parent().nextAll().remove();
            $idColors.removeClass('pd_id_color_select').find('input').remove();
        }
    });

    $idColors.on('click', 'td', function (e) {
        if (!$(e.target).is('a')) {
            let $this = $(this);
            if ($this.find('input[disabled]').length > 0) {
                alert('请先取消勾选“选择当前所有可用的ID颜色”复选框');
                $area.find('[name="changeAllAvailableIdColorEnabled"]').focus();
            }
            else if (!$(e.target).is('input')) {
                $this.find('input').click();
            }
        }
    });

    if (Config.autoChangeIdColorEnabled) {
        $area.find('[name="autoChangeIdColorEnabled"]').prop('checked', true).triggerHandler('click');
    }

    $('div[style="float:right;color:#8080C0"]:contains("每天捐款附送100经验值")').html('每天捐款附送50经验值');
    $('div[style="border-bottom:#8000FF 1px dashed;"] > div:contains("帖子被奖励KFB")').html('帖子被奖励KFB(被协管评分)');
};

/**
 * 同步修改帖子每页楼层数量
 */
export const syncModifyPerPageFloorNum = function () {
    const syncConfig = function () {
        let perPageFloorNum = parseInt($('select[name="p_num"]').val());
        if (isNaN(perPageFloorNum)) return;
        if (!perPageFloorNum) perPageFloorNum = 10;
        if (perPageFloorNum !== Config.perPageFloorNum) {
            Config.perPageFloorNum = perPageFloorNum;
            writeConfig();
        }
    };
    $('form#creator').submit(() => {
        readConfig();
        syncConfig();
    });
    syncConfig();
};

/**
 * 在设置页面添加更换头像提醒
 */
export const addAvatarChangeAlert = function () {
    $('input[name="uploadurl[2]"]')
        .parent().append('<div class="pd_highlight">本反向代理服务器为了提高性能对图片设置了缓存，更换头像后可能需等待<b>最多30分钟</b>才能看到效果</div>');
};

/**
 * 高亮自助评分错标文件大小
 */
export const highlightRatingErrorSize = function () {
    $('.adp1 a[href^="read.php?tid="]').each(function () {
        let $this = $(this);
        let title = $this.text();
        let ratingSize = 0;
        let $ratingCell = $this.parent('td').next('td');
        let matches = /认定\[(\d+)\]/i.exec($ratingCell.text());
        if (matches) {
            ratingSize = parseInt(matches[1]);
        }

        let {type, titleSize} = Public.checkRatingSize(title, ratingSize);
        if (type === -1) {
            $ratingCell.css('color', '#ff9933').attr('title', '标题文件大小无法解析').addClass('pd_custom_tips');
        }
        else if (type === 1) {
            $ratingCell.addClass('pd_highlight pd_custom_tips')
                .attr('title', `标题文件大小(${titleSize.toLocaleString()}M)与认定文件大小(${ratingSize.toLocaleString()}M)不一致`);
        }
    });
};

/**
 * 在提交自助评分时显示错标文件大小警告
 */
export const showSelfRatingErrorSizeSubmitWarning = function () {
    $('form[name="mail1"]').submit(function () {
        let ratingSize = parseFloat($('[name="psize"]').val());
        if (isNaN(ratingSize) || ratingSize <= 0) return;
        if (parseInt($('[name="psizegb"]').val()) === 2) ratingSize *= 1024;
        let title = $('.adp1 a[href^="read.php?tid="]').text();
        let {type, titleSize} = Public.checkRatingSize(title, ratingSize);
        if (type === 1) {
            return confirm(`标题文件大小(${titleSize.toLocaleString()}M)与认定文件大小(${ratingSize.toLocaleString()}M)不一致，是否继续？`);
        }
    });
};

/**
 * 在论坛排行页面为用户名添加链接
 */
export const addUserNameLinkInRankPage = function () {
    $('.kf_no11:eq(2) > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === Info.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 修改帮助页面
 */
export const modifyFaq = function () {
    let id = parseInt(Util.getUrlParam('id'));
    let $faq = $('.kf_share1 > tbody > tr:nth-child(2) > td:last-child > div:last-child');
    if (id === 1) {
        if ($faq.html().length !== 848) return;
        $faq.html(`
你可以通过发帖/回贴、参与<a href="kf_fw_ig_index.php" target="_blank">争夺奖励</a>等方式获取KFB（论坛货币）和经验。<br><br>
发帖/回贴时会获得基本的KFB奖励，每天第一次发帖/回贴还可获得额外经验奖励。<br>
发帖请先阅读规定避免违规，在你还没有时间阅读全部规定之前，请至少注意以下几点：<br>
不要发表纯水帖；不要纯复制发帖；不要发表政治、广告、恶心的内容；不要攻击、讽刺、挑衅他人；<br>
不要发表成人图片、视频、小说等内容；不要伪造原创、盗取他人原创。<br><br>
升级（神秘系数）可以获得不同的等级权限，你可以在<a href="kf_growup.php" target="_blank">等级经验页面</a>进行KFB捐款，
根据不同的捐款数额获得相应的经验来提升神秘系数。<br>
注册初始神秘系数为0，为“通常版”等级，拥有大部分的日常权限；提升为神秘系数4时，升级为“初回限定版”等级，拥有部分追加的权限。<br>
部分板块需要一定神秘系数以上才可进入，如打开帖子时出现“error&hellip;”的提示，说明你当前的神秘系数无法进入该板块。<br><br>
神秘等级的值以神秘系数为基础，基本上是装饰用的属性，可见于帖子页面各楼层用户名称旁，还可用于选择自定义ID颜色。
`);
    }
};

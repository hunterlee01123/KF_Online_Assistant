/* 首页模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import * as Log from './Log';
import * as TmpLog from './TmpLog';
import * as Loot from './Loot';

/**
 * 处理首页链接
 */
export const handleIndexLink = function () {
    let $kfb = $('a[href="javascript:;"][title="网站虚拟货币"]');
    $kfb.attr('id', 'pdKfb');
    let matches = /(-?\d+)KFB\s*\|\s*(-?\d+(?:\.\d+)?)贡献/.exec($kfb.text());
    if (matches) {
        let kfb = parseInt(matches[1]);
        let gongXian = parseFloat(matches[2]);
        $kfb.html(`<b>${kfb.toLocaleString()}</b>KFB | <b>${gongXian.toLocaleString()}</b>贡献`)
            .attr('data-kfb', kfb)
            .attr('data-gongxian', gongXian);
    }

    let $smLevel = $('a.indbox5[href="kf_growup.php"]');
    $smLevel.attr('id', 'pdSmLevel');
    matches = /神秘(-?\d+)级 \(系数排名第\s*(\d+\+?)\s*位/.exec($smLevel.text());
    if (matches) {
        let smLevel = parseInt(matches[1]);
        let smRank = matches[2];
        $smLevel.html(`神秘<b>${smLevel}</b>级 (系数排名第<b style="color: #00f;">${smRank}</b>位)`)
            .attr('data-sm-level', smLevel)
            .attr('data-sm-rank', smRank);
    }

    $('a.indbox5[href="kf_fw_ig_index.php"]').attr('id', 'pdLoot');
};

/**
 * 处理首页有人@你的消息框
 */
export const handleAtTips = function () {
    let type = Config.atTipsHandleType;
    if (type === 'default') return;
    let $atTips = $('a.indbox5[href^="guanjianci.php?gjc="]');
    let noHighlight = () => $atTips.removeClass('indbox5').addClass('indbox6');
    let hideBox = () => $atTips.parent().next('div.line').addBack().remove();
    let handleBox = noHighlight;
    if (type === 'hide_box_1' || type === 'hide_box_2') handleBox = hideBox;
    if (['no_highlight', 'no_highlight_extra', 'hide_box_1', 'at_change_to_cao'].includes(type)) {
        if ($atTips.length > 0) {
            let cookieText = Util.getCookie(Const.hideReadAtTipsCookieName);
            let atTipsText = $.trim($atTips.text());
            let matches = /\d+日\d+时\d+分/.exec(atTipsText);
            if (matches) atTipsText = matches[0];
            if (cookieText && cookieText === atTipsText) {
                handleBox();
            }
            else {
                $atTips.click(function () {
                    let $this = $(this);
                    if ($this.data('disabled')) return;
                    let cookieText = Util.getCookie(Const.hideReadAtTipsCookieName);
                    if (!cookieText) {
                        let curDate = (new Date()).getDate().toString();
                        Util.setCookie(Const.prevReadAtTipsCookieName, curDate.padStart(2, '0') + '日00时00分');
                    }
                    else if (cookieText !== atTipsText) {
                        Util.setCookie(Const.prevReadAtTipsCookieName, cookieText);
                    }
                    Util.setCookie(Const.hideReadAtTipsCookieName,
                        atTipsText,
                        Util.getDate(`+${Const.hideMarkReadAtTipsExpires}d`)
                    );
                    $this.data('disabled', true);
                    handleBox();
                });
            }
            if (type === 'at_change_to_cao') {
                $atTips.text($atTips.text().replace('@', '艹'));
            }
        }
        else if (!$atTips.length && (type === 'no_highlight_extra' || type === 'at_change_to_cao')) {
            let html = `
<div style="width: 300px;">
  <a class="indbox6" href="guanjianci.php?gjc=${Info.userName}" target="_blank">最近无人${type === 'at_change_to_cao' ? '艹' : '@'}你</a><br>
  <div class="line"></div>
  <div class="c"></div>
</div>
<div class="line"></div>`;
            $('#pdKfb').parent().before(html);
        }
    }
    else if (type === 'hide_box_2') {
        if ($atTips.length > 0) handleBox();
    }
};

/**
 * 在神秘等级升级后进行提醒
 */
export const smLevelUpAlert = function () {
    let smLevel = parseInt($('#pdSmLevel').data('sm-level'));
    if (!smLevel) return;

    /**
     * 写入神秘等级数据
     * @param {number} smLevel 神秘等级
     */
    const writeData = function (smLevel) {
        TmpLog.setValue(Const.smLevelUpTmpLogName, {time: $.now(), smLevel});
    };

    let data = TmpLog.getValue(Const.smLevelUpTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smLevel) !== 'number') {
        writeData(smLevel);
    }
    else if (smLevel > data.smLevel) {
        let diff = Math.floor(($.now() - data.time) / 60 / 60 / 1000);
        if (diff >= Const.smLevelUpAlertInterval) {
            let date = new Date(data.time);
            writeData(smLevel);
            Log.push(
                '神秘等级升级',
                `自\`${Util.getDateString(date)}\`以来，你的神秘等级共上升了\`${smLevel - data.smLevel}\`级 (Lv.\`${data.smLevel}\`->Lv.\`${smLevel}\`)`
            );
            Msg.show(`自<em>${Util.getDateString(date)}</em>以来，你的神秘等级共上升了<em>${smLevel - data.smLevel}</em>级`);
        }
        else if (diff < 0) {
            writeData(smLevel);
        }
    }
    else if (smLevel < data.smLevel) {
        writeData(smLevel);
    }
};

/**
 * 在神秘系数排名发生变化时进行提醒
 */
export const smRankChangeAlert = function () {
    let smRank = $('#pdSmLevel').data('sm-rank');
    if (!smRank || smRank.toString().endsWith('+')) return;
    smRank = parseInt(smRank);

    /**
     * 写入神秘系数排名数据
     * @param {number} smRank 神秘系数排名
     */
    const writeData = smRank => TmpLog.setValue(Const.smRankChangeTmpLogName, {time: $.now(), smRank});

    let data = TmpLog.getValue(Const.smRankChangeTmpLogName);
    if (!data || $.type(data.time) !== 'number' || $.type(data.smRank) !== 'number') {
        writeData(smRank);
    }
    else if (smRank !== data.smRank) {
        let diff = Math.floor(($.now() - data.time) / 60 / 60 / 1000);
        if (diff >= Const.smRankChangeAlertInterval) {
            let date = new Date(data.time);
            let isUp = smRank < data.smRank;
            writeData(smRank);
            Log.push(
                '神秘系数排名变化',
                `自\`${Util.getDateString(date)}\`以来，你的神秘系数排名共\`${isUp ? '上升' : '下降'}\`了\`${Math.abs(smRank - data.smRank)}\`名 ` +
                `(No.\`${data.smRank}\`->No.\`${smRank}\`)`
            );
            Msg.show(
                `自<em>${Util.getDateString(date)}</em>以来，你的神秘系数排名共<b style="color: ${isUp ? '#F00' : '#393'}">${isUp ? '上升' : '下降'}</b>了` +
                `<em>${Math.abs(smRank - data.smRank)}</em>名`
            );
        }
        else if (diff < 0) {
            writeData(smRank);
        }
    }
};

/**
 * 在首页帖子链接旁添加快速跳转至页末的链接
 */
export const addThreadFastGotoLink = function () {
    $('.index1').on('mouseenter', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        let $this = $(this);
        $this.css('position', 'relative')
            .prepend(`<a class="pd_thread_goto" href="${$this.find('a').attr('href')}&page=e#a">&raquo;</a>`);
    }).on('mouseleave', 'li.b_tit4:has("a"), li.b_tit4_1:has("a")', function () {
        $(this).css('position', 'static').find('.pd_thread_goto').remove();
    });
};

/**
 * 在首页上添加搜索类型选择框
 */
export const addSearchTypeSelectBox = function () {
    let $form = $('form[action="search.php?"]');
    $form.attr('name', 'pdSearchForm');
    let $keyWord = $form.find('[type="text"][name="keyword"]');
    $keyWord.css('width', '116px');
    $('<div class="pd_search_type"><span>标题</span><i>&#8744;</i></div>').insertAfter($keyWord);
};

/**
 * 添加提升战力光环间隔时间
 */
export const addPromoteHaloInterval = function () {
    let nextTime = parseInt(Util.getCookie(Const.promoteHaloCookieName));
    if (!nextTime) return;
    let interval = nextTime - $.now();
    if (interval > 0) {
        let minutes = Math.ceil(interval / 60 / 1000);
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        $('#pdLoot').append(`<span id="pdHaloInterval"> (光环：${hours > 0 ? hours + '时' : ''}${minutes}分)</span>`);
    }
};

/**
 * 添加改点剩余次数信息提示
 */
export const addChangePointsInfoTips = function () {
    let value = Util.getCookie(Const.changePointsInfoCookieName);
    if (!value) {
        Loot.getChangePointsCountDown()
            .done(addChangePointsInfoTips)
            .fail(() => setTimeout(addChangePointsInfoTips, Const.defAjaxInterval));
        return;
    }

    let tipsText = '';
    if ($.isNumeric(value)) {
        let nextTime = parseInt(value);
        let interval = nextTime - $.now();
        if (interval > 0) {
            let minutes = Math.ceil(interval / 60 / 1000);
            let hours = Math.floor(minutes / 60);
            minutes -= hours * 60;
            tipsText = `${hours > 0 ? hours + '时' : ''}${minutes}分`;
        }
    }
    else tipsText = parseInt(value) + '次';
    if (tipsText) $('#pdLoot').append(`<span id="pdChangePointsTips"> (改点：${tipsText})</span>`);
};

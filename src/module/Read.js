/* 帖子模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import * as Dialog from './Dialog';
import * as Func from './Func';
import Const from './Const';
import * as Log from './Log';
import * as Public from './Public';
import * as Post from './Post';

/**
 * 为帖子里的每个楼层添加跳转链接
 */
export const addFloorGotoLink = function () {
    $('.readlou > div:nth-child(2) > span').each(function () {
        let $this = $(this);
        let floorText = $this.text();
        if (!/^\d+楼$/.test(floorText)) return;
        let linkName = $this.closest('.readlou').prev().attr('name');
        if (!linkName || !/^\d+$/.test(linkName)) return;
        let url = `${Util.getHostNameUrl()}read.php?tid=${Util.getUrlParam('tid')}&spid=${linkName}`;
        $this.html(`<a class="pd_goto_link" href="${url}" title="复制楼层链接">${floorText}</a>`);
        $this.find('a').click(function (e) {
            e.preventDefault();
            let $this = $(this);
            let url = $this.attr('href');
            $this.data('copy-text', url);
            if (!Util.copyText($this, '楼层链接已复制')) {
                prompt('本楼的跳转链接（请按Ctrl+C复制）：', url);
            }
        });
    });
};

/**
 * 添加快速跳转到指定楼层的输入框
 */
export const addFastGotoFloorInput = function () {
    $('<form><li class="pd_fast_goto_floor">电梯直达 <input class="pd_input" style="width:30px" type="text" maxlength="8"> <span>楼</span></li></form>')
        .prependTo($('.readtext:first').prev('.readlou').find('> div:first-child > ul'))
        .submit(function (e) {
            e.preventDefault();
            let floor = parseInt($(this).find('input').val());
            if (!floor || floor < 0) return;
            location.href = `${Util.getHostNameUrl}read.php?tid=${Util.getUrlParam('tid')}&page=${parseInt(floor / Config.perPageFloorNum) + 1}&floor=${floor}`;
        })
        .find('span')
        .click(function () {
            $(this).closest('form').submit();
        })
        .end()
        .closest('div')
        .next()
        .css({'max-width': '505px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'});
};

/**
 * 将页面滚动到指定楼层
 */
export const fastGotoFloor = function () {
    let floor = parseInt(Util.getUrlParam('floor'));
    if (!floor || floor < 0) return;
    let $floorNode = $(`.readlou > div:nth-child(2) > span:contains("${floor}楼")`);
    if (!$floorNode.length) return;
    let linkName = $floorNode.closest('.readlou').prev().attr('name');
    if (!linkName || !/^\d+$/.test(linkName)) return;
    location.hash = '#' + linkName;
};

/**
 * 修改指定楼层的神秘颜色
 * @param {jQuery} $elem 指定楼层的发帖者的用户名链接的jQuery对象
 * @param {string} color 神秘颜色
 */
export const modifyFloorSmColor = function ($elem, color) {
    if ($elem.is('.readidmsbottom > a')) $elem.css('color', color);
    $elem.closest('.readtext').css('border-color', color)
        .prev('.readlou').css('border-color', color)
        .next().next('.readlou').css('border-color', color);
};

/**
 * 修改本人的神秘颜色
 */
export const modifyMySmColor = function () {
    let $my = $(`.readidmsbottom > a[href="profile.php?action=show&uid=${Info.uid}"]`);
    if (!$my.length) $my = $(`.readidmleft > a[href="profile.php?action=show&uid=${Info.uid}"]`);
    if ($my.length > 0) modifyFloorSmColor($my, Config.customMySmColor);
};

/**
 * 修改各等级神秘颜色
 */
export const modifySmColor = function () {
    if (!Config.customSmColorConfigList.length) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        let $this = $(this);
        let smLevel = '';
        if ($this.is('.readidmleft > a')) {
            smLevel = $this.parent().next('.readidmright').text().toUpperCase();
            if (!/(-?\d+|MAX)/i.test(smLevel)) return;
        }
        else {
            let matches = /(-?\d+|MAX)级神秘/i.exec($this.parent().contents().last().text());
            if (!matches) return;
            smLevel = matches[1].toUpperCase();
        }
        for (let {min, max, color} of Config.customSmColorConfigList) {
            if (Util.compareSmLevel(smLevel, min) >= 0 && Util.compareSmLevel(smLevel, max) <= 0) {
                modifyFloorSmColor($this, color);
                break;
            }
        }
    });
};

/**
 * 调整帖子内容宽度，使其保持一致
 */
export const adjustThreadContentWidth = function () {
    $('head').append(`
<style>
  .readtext > table > tbody > tr > td { padding-left: 192px; }
  .readidms, .readidm { margin-left: -192px !important; }
</style>
`);
};

/**
 * 调整帖子内容字体大小
 */
export const adjustThreadContentFontSize = function () {
    if (Config.threadContentFontSize > 0 && Config.threadContentFontSize !== 12) {
        $('head').append(`
<style>
  .readtext td { font-size: ${Config.threadContentFontSize}px; line-height: 1.6em; }
  .readtext td > div, .readtext td > .read_fds { font-size: 12px; }
</style>
`);
    }
};

/**
 * 添加复制购买人名单的链接
 */
export const addCopyBuyersListLink = function () {
    $('<a style="margin:0 2px 0 5px;" href="#">复制名单</a>')
        .insertAfter('.readtext select[name="buyers"]')
        .click(function (e) {
            e.preventDefault();
            let buyerList = [];
            $(this).prev('select').children('option').each(function (index) {
                let name = $(this).text();
                if (!index || name === '-'.repeat(11)) return;
                buyerList.push(name);
            });
            if (!buyerList.length) {
                alert('暂时无人购买');
                return;
            }
            const dialogName = 'pd_copy_buyer_list';
            if ($('#' + dialogName).length > 0) return;
            let html = `
<div class="pd_cfg_main">
  <textarea style="width: 200px; height: 300px; margin: 5px 0;" readonly></textarea>
</div>`;
            let $dialog = Dialog.create(dialogName, '购买人名单', html);
            Dialog.show(dialogName);
            $dialog.find('textarea').val(buyerList.join('\n')).select().focus();
        });
};

/**
 * 显示统计回帖者名单对话框
 * @param {string[]} replierList 回帖者名单列表
 */
export const showStatRepliersDialog = function (replierList) {
    const dialogName = 'pd_replier_list';
    let html = `
<div class="pd_cfg_main">
  <div data-name="replierListFilter" style="margin-top: 5px;">
    <label><input type="checkbox" checked> 显示楼层号</label>
    <label><input type="checkbox"> 去除重复</label>
    <label><input type="checkbox"> 去除楼主</label>
  </div>
  <div style="color: #f00;" id="pd_replier_list_stat"></div>
  <textarea style="width: 250px; height: 300px; margin: 5px 0;" readonly></textarea>
</div>`;
    let $dialog = Dialog.create(dialogName, '回帖者名单', html);

    let $filterNodes = $dialog.find('[data-name="replierListFilter"] input');
    $filterNodes.click(function () {
        let list = [...replierList];
        let isShowFloor = $filterNodes.eq(0).prop('checked'),
            isRemoveRepeated = $filterNodes.eq(1).prop('checked'),
            isRemoveTopFloor = $filterNodes.eq(2).prop('checked');
        if (isRemoveRepeated) {
            list = list.map((elem, index, list) => list.indexOf(elem) === index ? elem : null);
        }
        if (isRemoveTopFloor) {
            let topFloor = $('.readtext:first').find('.readidmsbottom, .readidmleft').find('a').text();
            list = list.map(elem => elem !== topFloor ? elem : null);
        }
        let content = '';
        let num = 0;
        for (let [floor, userName] of list.entries()) {
            if (!userName) continue;
            content += (isShowFloor ? floor + 'L：' : '') + userName + '\n';
            num++;
        }
        $dialog.find('textarea').val(content);
        $('#pd_replier_list_stat').html(`共有<b>${num}</b>条项目`);
    });
    $dialog.find('[data-name="replierListFilter"] input:first').triggerHandler('click');

    Dialog.show(dialogName);
    $dialog.find('input:first').focus();
};

/**
 * 添加统计回帖者名单的链接
 */
export const addStatRepliersLink = function () {
    if (Util.getCurrentThreadPage() !== 1) return;
    $('<li><a href="#" title="统计回帖者名单">[统计回帖]</a></li>').prependTo('.readtext:first + .readlou > div > .pages')
        .find('a').click(function (e) {
        e.preventDefault();
        if ($('#pd_replier_list').length > 0) return;

        let tid = Util.getUrlParam('tid');
        if (!tid) return;
        let value = $.trim(prompt('统计到第几楼？（0表示统计所有楼层，可用m-n的方式来设定统计楼层的区间范围）', 0));
        if (value === '') return;
        if (!/^\d+(-\d+)?$/.test(value)) {
            alert('统计楼层格式不正确');
            return;
        }
        let startFloor = 0, endFloor = 0;
        let valueArr = value.split('-');
        if (valueArr.length === 2) {
            startFloor = parseInt(valueArr[0]);
            endFloor = parseInt(valueArr[1]);
        }
        else endFloor = parseInt(valueArr[0]);
        if (endFloor < startFloor) {
            alert('统计楼层格式不正确');
            return;
        }
        let matches = /(\d+)页/.exec($('.pages:eq(0) > li:last-child > a').text());
        let maxPage = matches ? parseInt(matches[1]) : 1;
        if (startFloor === 0) startFloor = 1;
        if (endFloor === 0) endFloor = maxPage * Config.perPageFloorNum - 1;
        let startPage = Math.floor(startFloor / Config.perPageFloorNum) + 1;
        let endPage = Math.floor(endFloor / Config.perPageFloorNum) + 1;
        if (endPage > maxPage) endPage = maxPage;
        if (endPage - startPage > Const.statRepliersMaxPage) {
            alert('需访问的总页数不可超过' + Const.statRepliersMaxPage);
            return;
        }

        Msg.wait(
            `<strong>正在统计回帖名单中&hellip;</strong><i>剩余页数：<em class="pd_countdown">${endPage - startPage + 1}</em></i>` +
            `<a class="pd_stop_action" href="#">停止操作</a>`
        );
        let isStop = false;
        $(document).clearQueue('StatRepliers');
        let replierList = [];
        $.each(new Array(endPage), function (index) {
            if (index + 1 < startPage) return;
            $(document).queue('StatRepliers', function () {
                $.ajax({
                    type: 'GET',
                    url: `read.php?tid=${tid}&page=${index + 1}&t=${new Date().getTime()}`,
                    timeout: Const.defAjaxTimeout,
                    success (html) {
                        let matches = html.match(/<span style=".+?">\d+楼<\/span> <span style=".+?">(.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+" target="_blank" style=".+?">.+?<\/a>/gi);
                        for (let match of matches) {
                            let floorMatches = /<span style=".+?">(\d+)楼<\/span>(?:.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+".+?>(.+?)<\/a>/i.exec(match);
                            if (!floorMatches) continue;
                            let floor = parseInt(floorMatches[1]);
                            if (floor < startFloor) continue;
                            if (floor > endFloor) {
                                isStop = true;
                                break;
                            }
                            replierList[floor] = floorMatches[2];
                        }
                    },
                    error () {
                        isStop = true;
                        alert('因连接超时，统计回帖名单操作中止');
                    },
                    complete () {
                        let $countdown = $('.pd_countdown');
                        $countdown.text(parseInt($countdown.text()) - 1);
                        isStop = isStop || $countdown.closest('.pd_msg').data('stop');
                        if (isStop) $(document).clearQueue('StatRepliers');

                        if (isStop || index === endPage - 1) {
                            Msg.destroy();
                            showStatRepliersDialog(replierList);
                        }
                        else {
                            setTimeout(() => $(document).dequeue('StatRepliers'), Const.defAjaxInterval);
                        }
                    }
                });
            });
        });
        $(document).dequeue('StatRepliers');
    });
};


/**
 * 获取多重引用数据
 * @returns {Object[]} 多重引用数据列表
 */
export const getMultiQuoteData = function () {
    let quoteList = [];
    $('.pd_multi_quote_chk input:checked').each(function () {
        let $readLou = $(this).closest('.readlou');
        let matches = /(\d+)楼/.exec($readLou.find('.pd_goto_link').text());
        let floor = matches ? parseInt(matches[1]) : 0;
        let pid = $readLou.prev('a').attr('name');
        let userName = $readLou.next('.readtext').find('.readidmsbottom > a, .readidmleft > a').text();
        if (!userName) return;
        quoteList.push({floor: floor, pid: pid, userName: userName});
    });
    return quoteList;
};

/**
 * 添加多重回复和多重引用的按钮
 */
export const addMultiQuoteButton = function () {
    let replyUrl = $('a[href^="post.php?action=reply"].b_tit2').attr('href');
    if (!replyUrl) return;
    $('<li class="pd_multi_quote_chk"><label title="多重引用"><input type="checkbox"> 引</label></li>')
        .prependTo($('.readlou > div:first-child > ul').has('a[title="引用回复这个帖子"]'))
        .find('input')
        .click(function () {
            let tid = parseInt(Util.getUrlParam('tid'));
            let data = localStorage[Const.multiQuoteStorageName];
            if (data) {
                try {
                    data = JSON.parse(data);
                    if (!data || $.type(data) !== 'object' || $.isEmptyObject(data)) data = null;
                    else if (typeof data.tid === 'undefined' || data.tid !== tid || !Array.isArray(data.quoteList)) data = null;
                }
                catch (ex) {
                    data = null;
                }
            }
            else {
                data = null;
            }
            let quoteList = getMultiQuoteData();
            if (!data) {
                localStorage.removeItem(Const.multiQuoteStorageName);
                data = {tid: tid, quoteList: []};
            }
            let page = Util.getCurrentThreadPage();
            if (quoteList.length > 0) data.quoteList[page] = quoteList;
            else delete data.quoteList[page];
            localStorage[Const.multiQuoteStorageName] = JSON.stringify(data);
        });
    $('.readlou:last').next('div')
        .find('table > tbody > tr > td:last-child')
        .css({'text-align': 'right', 'width': '320px'})
        .append(`<span class="b_tit2" style="margin-left: 5px;"><a style="display: inline-block;" href="#" title="多重回复">回复</a> ` +
            `<a style="display: inline-block;" href="${replyUrl}&multiquote=1" title="多重引用">引用</a></span>`)
        .find('.b_tit2 > a:eq(0)')
        .click(function (e) {
            e.preventDefault();
            Post.handleMultiQuote(1);
        });
};

/**
 * 将帖子和短消息中的绯月其它域名的链接修改为当前域名
 */
export const modifyKFOtherDomainLink = function () {
    $('.readtext a, .thread2 a').each(function () {
        let $this = $(this);
        let url = $this.attr('href');
        if (/m\.miaola\.info\//i.test(url)) return;
        let matches = /^(https?:\/\/(?:[\w\.]+?\.)?(?:2dgal|ddgal|9gal|9baka|9moe|kfgal|2dkf|miaola|kfer)\.\w+?\/).+/i.exec(url);
        if (matches) $this.attr('href', url.replace(matches[1], Util.getHostNameUrl()));
    });
};

/**
 * 处理购买帖子按钮
 */
export const handleBuyThreadBtn = function () {
    $('.readtext input[type="button"][value="愿意购买,支付KFB"]').each(function () {
        let $this = $(this);
        let matches = /此帖售价\s*(\d+)\s*KFB/i.exec($this.closest('legend').contents().eq(0).text());
        if (!matches) return;
        let sell = parseInt(matches[1]);
        matches = /location\.href="(.+?)"/i.exec($this.attr('onclick'));
        if (!matches) return;
        $this.data('sell', sell).data('url', matches[1]).removeAttr('onclick').click(function (e) {
            e.preventDefault();
            let $this = $(this);
            let sell = $this.data('sell');
            let url = $this.data('url');
            if (!sell || !url) return;
            if (sell >= Const.minBuyThreadWarningSell && !confirm(`此贴售价${sell}KFB，是否购买？`)) return;
            if (Config.buyThreadViaAjaxEnabled) {
                let $wait = Msg.wait('正在购买帖子&hellip;');
                $.get(url, function (html) {
                    Public.showFormatLog('购买帖子', html);
                    let {msg} = Util.getResponseMsg(html);
                    Msg.remove($wait);
                    if (/操作完成/.test(msg)) {
                        location.reload();
                    }
                    else if (/您已经购买此帖/.test(msg)) {
                        alert('你已经购买过此帖');
                        location.reload();
                    }
                    else {
                        alert('帖子购买失败');
                    }
                });
            }
            else location.href = url;
        });
    });
};

/**
 * 添加批量购买帖子的按钮
 */
export const addBatchBuyThreadButton = function () {
    let $btns = $('.readtext input[type="button"][value="愿意购买,支付KFB"]');
    if ($btns.length === 0) return;
    $btns.each(function () {
        let $this = $(this);
        let sell = $this.data('sell');
        let url = $this.data('url');
        if (!sell || !url) return;
        $this.after(
            `<input class="pd_buy_thread" style="margin-left: 10px; vertical-align: middle;" type="checkbox" data-sell="${sell}" data-url="${url}">`
        );
    });
    $('<span style="margin: 0 5px;">|</span><a class="pd_buy_thread_btn" title="批量购买所选帖子" href="#">批量购买</a>')
        .insertAfter('td > a[href^="kf_tidfavor.php?action=favor&tid="]')
        .filter('a')
        .click(function (e) {
            e.preventDefault();
            Msg.destroy();
            let threadList = [];
            let totalSell = 0;
            $('.pd_buy_thread:checked').each(function () {
                let $this = $(this);
                let url = $this.data('url');
                let sell = parseInt($this.data('sell'));
                if (url && !isNaN(sell)) {
                    threadList.push({url, sell});
                    totalSell += sell;
                }
            });
            if (!threadList.length) {
                alert('请选择要购买的帖子');
                return;
            }
            if (confirm(
                    `你共选择了${threadList.length}个帖子，总售价${totalSell.toLocaleString()}KFB，` +
                    `均价${Util.getFixedNumLocStr(totalSell / threadList.length, 2)}KFB，是否批量购买？`
                )
            ) {
                Msg.wait(
                    `<strong>正在购买帖子中&hellip;</strong><i>剩余：<em class="pd_countdown">${threadList.length}</em></i>` +
                    `<a class="pd_stop_action" href="#">停止操作</a>`
                );
                buyThreads(threadList);
            }
        }).parent().mouseenter(function () {
        $('<span style="margin-left: 5px;">[<a class="pd_btn_link" href="#">全选</a><a class="pd_btn_link" href="#">反选</a>]</span>')
            .insertAfter($(this).find('.pd_buy_thread_btn'))
            .find('a:first')
            .click(function (e) {
                e.preventDefault();
                let $buyThread = $('.pd_buy_thread');
                $buyThread.prop('checked', true);
                alert(`共选择了${$buyThread.length}项`);
            })
            .next('a')
            .click(function (e) {
                e.preventDefault();
                let totalNum = 0;
                $('.pd_buy_thread').each(function () {
                    let $this = $(this);
                    $this.prop('checked', !$this.prop('checked'));
                    if ($this.prop('checked')) totalNum++;
                });
                alert(`共选择了${totalNum}项`);
            });
    }).mouseleave(function () {
        $(this).find('.pd_buy_thread_btn').next('span').remove();
    });
};

/**
 * 购买指定的一系列帖子
 * @param {{}[]} threadList 购买帖子列表，{url}：购买帖子的URL；{sell}：购买帖子的售价
 */
export const buyThreads = function (threadList) {
    let successNum = 0, failNum = 0, totalSell = 0;
    $(document).clearQueue('BuyThreads');
    $.each(threadList, function (index, {url, sell}) {
        $(document).queue('BuyThreads', function () {
            $.ajax({
                type: 'GET',
                url: url + '&t=' + new Date().getTime(),
                timeout: Const.defAjaxTimeout,
                success (html) {
                    Public.showFormatLog('购买帖子', html);
                    let {msg} = Util.getResponseMsg(html);
                    if (/操作完成/.test(msg)) {
                        successNum++;
                        totalSell += sell;
                    }
                    else failNum++;
                },
                error () {
                    failNum++;
                },
                complete () {
                    let $countdown = $('.pd_countdown');
                    $countdown.text(parseInt($countdown.text()) - 1);
                    let isStop = $countdown.closest('.pd_msg').data('stop');
                    if (isStop) $(document).clearQueue('BuyThreads');

                    if (isStop || index === threadList.length - 1) {
                        Msg.destroy();
                        if (successNum > 0) {
                            Log.push('购买帖子', `共有\`${successNum}\`个帖子购买成功`, {pay: {'KFB': -totalSell}});
                        }
                        console.log(`共有${successNum}个帖子购买成功，共有${failNum}个帖子购买失败，KFB-${totalSell}`);
                        Msg.show(
                            `<strong>共有<em>${successNum}</em>个帖子购买成功${failNum > 0 ? `，共有<em>${failNum}</em>个帖子购买失败` : ''}</strong>` +
                            `<i>KFB<ins>-${totalSell}</ins></i>`
                            , -1
                        );
                        Func.run('Read.buyThreads_after_', threadList);
                    }
                    else {
                        setTimeout(() => $(document).dequeue('BuyThreads'), Const.defAjaxInterval);
                    }
                }
            });
        });
    });
    $(document).dequeue('BuyThreads');
};

/**
 * 添加用户自定义备注
 */
export const addUserMemo = function () {
    if ($.isEmptyObject(Config.userMemoList)) return;
    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        let memo = '';
        for (let name of Object.keys(Config.userMemoList)) {
            if (name === userName) {
                memo = Config.userMemoList[name];
                break;
            }
        }
        if (!memo) return;
        if ($this.is('.readidmleft > a')) {
            $this.after(`<span class="pd_user_memo_tips" title="备注：${memo}">[?]</span>`);
        }
        else {
            let memoText = memo;
            let maxLength = 24;
            if (memo.length > maxLength) memoText = memoText.substring(0, maxLength) + '&hellip;';
            $this.after(`<br><span class="pd_user_memo" title="备注：${memo}">(${memoText})</span>`);
        }
    });
};

/**
 * 添加复制代码的链接
 */
export const addCopyCodeLink = function () {
    $('.readtext fieldset > legend:contains("Copy code")').html('<a class="pd_copy_code" href="#">复制代码</a>')
        .parent('fieldset').addClass('pd_code_area');
    if (!$('.pd_copy_code').length) return;
    $('#alldiv').on('click', 'a.pd_copy_code', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $fieldset = $this.closest('fieldset');
        if (Util.copyText($fieldset, '代码已复制', $this.parent())) return;

        let content = $fieldset.data('content');
        if (content) {
            $fieldset.html('<legend><a class="pd_copy_code" href="#">复制代码</a></legend>' + content).removeData('content');
        }
        else {
            let html = $fieldset.html();
            html = html.replace(/<legend>.+?<\/legend>/i, '');
            $fieldset.data('content', html);
            html = Util.htmlDecode(html);
            let height = $fieldset.height();
            height -= 17;
            if (height < 50) height = 50;
            if (height > 540) height = 540;
            $fieldset.html(`
<legend><a class="pd_copy_code" href="#">还原代码</a></legend>
<textarea wrap="off" class="pd_textarea" style="width: 100%; height: ${height}px; line-height: 1.4em; white-space: pre;">${html}</textarea>
`);
            $fieldset.find('textarea').select().focus();
        }
    });
};

/**
 * 在帖子页面添加更多表情的链接
 */
export const addMoreSmileLink = function () {
    /**
     * 添加表情代码
     * @param {string} id 表情ID
     */
    const addSmileCode = function (id) {
        let textArea = $('textarea[name="atc_content"]').get(0);
        if (!textArea) return;
        let code = `[s:${id}]`;
        Util.addCode(textArea, code);
        if (Info.isMobile) textArea.blur();
        else textArea.focus();
    };

    let $parent = $('input[name="diy_guanjianci"]').parent();
    $parent.on('click', 'a[href="javascript:;"]', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        if (id) addSmileCode(id);
    }).find('a[onclick^="javascript:addsmile"]').each(function () {
        let $this = $(this);
        let matches = /addsmile\((\d+)\)/i.exec($this.attr('onclick'));
        if (matches) {
            $this.data('id', matches[1]).removeAttr('onclick').attr('href', 'javascript:;');
        }
    });

    $('<a class="pd_highlight" href="#">[更多]</a>')
        .appendTo($parent)
        .click(function (e) {
            e.preventDefault();
            let $this = $(this);
            let $panel = $('#pd_smile_panel');
            if ($panel.length > 0) {
                $this.text('[更多]');
                $panel.remove();
                return;
            }
            $this.text('[关闭]');

            let smileImageIdList = ['48', '35', '34', '33', '32', '31', '30', '29', '28', '27', '26', '36', '37', '47', '46', '45', '44',
                '43', '42', '41', '40', '39', '38', '25', '24', '11', '10', '09', '08', '01', '02', '03', '04', '05', '06', '12', '13', '23',
                '22', '21', '20', '19', '18', '17', '16', '15', '14', '07'];
            let smileCodeIdList = [57, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 45, 46, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 34, 33, 20,
                19, 18, 17, 10, 11, 12, 13, 14, 15, 21, 22, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 16];
            let html = '';
            for (let i = 0; i < smileImageIdList.length; i++) {
                html += `<img src="${Info.w.imgpath}/post/smile/em/em${smileImageIdList[i]}.gif" alt="[表情]" data-id="${smileCodeIdList[i]}">`;
            }
            html = `<div class="pd_panel" id="pd_smile_panel" style="width: 308px; height: 185px;">${html}</div>`;

            let offset = $parent.offset();
            $panel = $(html).appendTo('body');
            $panel.css('top', offset.top + $parent.height() + 4)
                .css('left', offset.left + $parent.width() - $panel.width() + 9)
                .on('click', 'img', function () {
                    let id = $(this).data('id');
                    if (id) addSmileCode(id);
                });
            Func.run('Read.addMoreSmileLink_after_click_');
        });
};

/**
 * 在帖子页面解析多媒体标签
 */
export const parseMediaTag = function () {
    $('.readtext > table > tbody > tr > td').each(function () {
        let $this = $(this);
        let html = $this.html();
        if (/\[(audio|video)\](http|ftp)[^<>]+\[\/(audio|video)\]/.test(html)) {
            $this.html(
                html.replace(
                    /\[audio\]((?:http|ftp)[^<>]+?)\[\/audio\](?!<\/fieldset>)/g,
                    '<audio src="$1" controls preload="none" style="margin:3px 0;">[你的浏览器不支持audio标签]</audio>'
                ).replace(
                    /\[video\]((?:http|ftp)[^<>]+?)\[\/video\](?!<\/fieldset>)/g,
                    `<video src="$1" controls preload="none" style="max-width: ${Config.adjustThreadContentWidthEnabled ? 627 : 820}px; margin:3px 0;">` +
                    `[你的浏览器不支持video标签]</video>`
                )
            );
        }
    });
};

/**
 * 显示在购买框之外的附件图片
 */
export const showAttachImageOutsideSellBox = function () {
    $('.readtext > table > tbody > tr > td').each(function () {
        let $this = $(this);
        let html = $this.html();
        if (/\[attachment=\d+\]/.test(html)) {
            let pid = $this.closest('.readtext').prev('.readlou').prev('a').attr('name');
            let tid = Util.getUrlParam('tid');
            $this.html(
                html.replace(
                    /\[attachment=(\d+)\]/g,
                    `<img src="job.php?action=download&pid=${pid}&tid=${tid}&aid=$1" alt="[附件图片]" style="max-width:550px" ` +
                    `onclick="if(this.width>=550) window.open('job.php?action=download&pid=${pid}&tid=${tid}&aid=$1');">`
                )
            );
        }
    });
};

/**
 * 在帖子页面添加自助评分链接
 */
export const addSelfRatingLink = function () {
    let fid = parseInt($('input[name="fid"]:first').val());
    if (!fid || !Const.selfRatingFidList.includes(fid)) return;
    let tid = parseInt($('input[name="tid"]:first').val());
    let safeId = Public.getSafeId();
    if (!safeId || !tid) return;
    if ($('.readtext:first fieldset legend:contains("本帖最近评分记录")').length > 0) return;
    $('a[href^="kf_tidfavor.php?action=favor"]').after(
        `<span style="margin: 0 5px;">|</span><a href="kf_fw_1wkfb.php?do=1&safeid=${safeId}&ptid=${tid}" title="仅限自助评分测试人员使用">自助评分</a>`
    );
};

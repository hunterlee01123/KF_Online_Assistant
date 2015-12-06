/* 自定义脚本 */

// 在不同时间段内采用不同的自动攻击方式 V1.2
(function () {
    var settings = {'19:00-01:00': 660, '08:00-19:00': 90}; // 格式：{'时间段': 分钟数, '时间段': 分钟数}
    var now = new Date();
    for (var range in settings) {
        var newValue = settings[range];
        if (Config.attackAfterTime === newValue) continue;
        if (Tools.isBetweenInTimeRange(now, range)) {
            console.log('【在距本回合结束前指定时间内才完成攻击】的设置被修改为：' + newValue + '分钟');
            Config.attackAfterTime = newValue;
            ConfigMethod.write();
            break;
        }
    }
}());

/*==========================================*/

// 自定义指定用户的头像 V1.0
(function () {
    if (location.pathname !== '/read.php') return;
    // 格式：{userName: '用户名', url: '新头像URL', width: 头像宽度(可选), height: 头像高度(可选), oldUrlString: '原头像URL的文件名(可选)'}
    // 注：oldUrlString表示仅当指定用户的原头像URL包含了指定文件名的情况下，才替换成新头像（意即在该用户再次更换了新头像后就不进行替换了），如无需求请留空
    var avatarList = [
        {userName: '张三', url: 'xxx.jpg', width: 140, height: 140},
        {userName: '李四', url: 'http://xxx/xxx.jpg', width: 140, height: 140, oldUrlString: '93957.jpg'},
        {userName: '信仰风', url: 'ys/card/30002.png', oldUrlString: '20002.png'},
    ];

    $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a').each(function () {
        var $this = $(this);
        var userName = $.trim($this.text());
        var avatar = null;
        for (var i in avatarList) {
            if (avatarList[i].userName === userName) {
                avatar = avatarList[i];
                break;
            }
        }
        if (!avatar) return;
        var type = $this.is('.readidmleft > a') ? 2 : 1;
        var $img = null;
        if (type === 2) $img = $this.closest('.readidm');
        else $img = $this.parent('.readidmsbottom').prev('.readidmstop').find('img.pic');
        if (avatar.oldUrlString) {
            var url = '';
            if (type === 2) url = $img.css('background-image');
            else url = $img.attr('src');
            if (url.indexOf(avatar.oldUrlString) === -1) return;
        }
        //console.log('替换了【' + avatar.userName + '】的头像：' + avatar.url);
        if (type === 2) {
            $img.css('background-image', 'url("' + avatar.url + '")');
        }
        else {
            $img.attr('src', avatar.url);
            if (avatar.width) $img.css('width', avatar.width + 'px');
            if (avatar.height) $img.css('height', avatar.height + 'px');
        }
    });
}());

/*==========================================*/

// 随机设置批量攻击时每次攻击的时间间隔（毫秒） V1.0
// 设随机间隔范围为m-n毫秒，公式：Math.random()*(n-m)+m
Config.perAttackInterval = function () {
    var t = Math.floor(Math.random() * 3000 + 2000);
    console.log('间隔：' + t + 'ms');
    return t;
};

/*==========================================*/

// 在生命值不超过低保线时检查是否进行攻击的间隔时间列表，格式：{'距本回合开始已经过的分钟数A-距本回合开始已经过的分钟数B':间隔分钟数}，例：{'190-205': 3, '205-225': 5, '225-600': 10}
// （不在此列表里的时间段将按照Config.defZeroLifeCheckAttackInterval所设定的默认间隔时间）
Config.zeroLifeCheckAttackIntervalList = {'190-205': 3, '205-225': 5, '225-600': 10};

/*==========================================*/

// 统计各楼层的彩票数字（ft1073833专用版） V1.1
(function () {
    var numberRegex = /【\s*(\d{2,})\s*】/; // 匹配彩票数字的正则表达式
    var levelRangeList = [0, 5, 50]; // 各等奖中与中奖数字相差的范围
    var threadTitle = '每周红包'; // 在标题包含指定关键字的帖子里显示彩票统计的按钮（留空表示任意标题均可）

    if (location.pathname !== '/read.php' || Tools.getCurrentThreadPage() !== 1) return;
    if (threadTitle && $('form[name="delatc"] > div:first > table > tbody > tr > td > span:contains("{0}")'.replace('{0}', threadTitle)).length === 0) return;
    $('<span style="margin-left:5px;margin-right:5px;">|</span><a href="#">彩票统计</a>')
        .appendTo($('a[href^="kf_tidfavor.php?action=favor"]:first').parent())
        .click(function (e) {
            e.preventDefault();
            var tid = Tools.getUrlParam('tid');
            if (!tid) return;
            var targetNumber = window.prompt('请输入本次的中奖数字', 0);
            if (targetNumber === null) return;
            targetNumber = parseInt($.trim(targetNumber));
            if (isNaN(targetNumber) || targetNumber < 0) {
                alert('中奖数字格式不正确');
                return;
            }

            var matches = /(\d+)页/.exec($('.pages:eq(0) > li:last-child > a').text());
            var maxPage = matches ? parseInt(matches[1]) : 1;
            KFOL.showWaitMsg('<strong>正在统计数字中...</strong><i>剩余页数：<em id="pd_remaining_num">{0}</em></i>'
                .replace('{0}', maxPage)
                , true);
            $(document).queue('StatLottery', []);
            var floorList = [];
            $.each(new Array(maxPage), function (index) {
                $(document).queue('StatLottery', function () {
                    var url = 'read.php?tid={0}&page={1}'.replace('{0}', tid).replace('{1}', index + 1);
                    $.get(url, function (html) {
                        var matches = html.match(/<a name=\d+><\/a>(.|\n|\r\n)+?<span style=".+?">\d+楼<\/span> <span style=".+?">(.|\n|\r\n)+?<\/td><\/tr><\/table>\r\n<\/div>/gi);
                        for (var i in matches) {
                            var floorMatches = /<a name=(\d+)><\/a>(?:.|\n|\r\n)+?<span style=".+?">(\d+)楼<\/span>(?:.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=\d+".+?>(.+?)<\/a>((?:.|\n|\r\n)+)$/i.exec(matches[i]);
                            if (!floorMatches) continue;
                            var pid = parseInt(floorMatches[1]);
                            var floor = parseInt(floorMatches[2]);
                            var name = floorMatches[3];
                            var content = floorMatches[4].replace(/<fieldset>(.|\n|\r\n)+?<\/fieldset>/gi, '');
                            var numberMatches = numberRegex.exec(content);
                            floorList[floor] = {
                                pid: pid,
                                name: name,
                                number: numberMatches ? parseInt(numberMatches[1]) : -1
                            };
                        }
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);

                        if (index === maxPage - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            //console.log(floorList);
                            var numberList = {};
                            for (var i = 1; i < floorList.length; i++) {
                                var obj = floorList[i];
                                if (obj && obj.number >= 0) {
                                    if (typeof numberList[obj.name] === 'undefined') {
                                        numberList[obj.name] = {floor: i, pid: obj.pid, number: obj.number};
                                    }
                                    else {
                                        floorList[i].number = -2;
                                    }
                                }
                            }
                            //console.log(numberList);

                            var dialogHtml =
                                '<div class="pd_cfg_main">' +
                                '  <div style="width:400px;max-height:550px;overflow:auto;background-color:#FFF;margin:5px 0;line-height:20px;" id="pd_stat_lottery_list"></div>' +
                                '</div>';
                            var $dialog = Dialog.create('pd_stat_lottery', '彩票统计', dialogHtml);

                            var floorContent = '';
                            var normalNum = 0, errorNum = 0, repeatNum = 0;
                            for (var i = 1; i < floorList.length; i++) {
                                var obj = floorList[i];
                                if (obj) {
                                    floorContent += '<li>【<a target="_blank" href="read.php?tid={0}&spid={1}">{2}楼</a>】{3}：{4}</li>'
                                        .replace('{0}', tid)
                                        .replace('{1}', obj.pid)
                                        .replace('{2}', i)
                                        .replace('{3}', obj.name)
                                        .replace('{4}', obj.number > 0 ?
                                            '<span class="pd_highlight">{0}</span>'.replace('{0}', obj.number) :
                                            '<span class="pd_notice">{0}</span>'.replace('{0}', obj.number === -2 ? '重复回贴' : '格式不正确'));
                                    if (obj.number === -1) errorNum++;
                                    else if (obj.number === -2) repeatNum++;
                                    else if (obj.number >= 0) normalNum++;
                                }
                                else {
                                    floorContent += '<li>【{0}楼】<span class="pd_notice">未找到该楼层</span></li>'.replace('{0}', i);
                                }
                            }
                            floorContent = ('<ul><li><strong>楼层统计情况：</strong></li><li>（正常统计：<b class="pd_highlight">{0}</b>个；' +
                            '格式不正确：<b class="pd_highlight">{1}</b>个；重复回贴：<b class="pd_highlight">{2}</b>个）</li>{3}</ul>')
                                .replace('{0}', normalNum)
                                .replace('{1}', errorNum)
                                .replace('{2}', repeatNum)
                                .replace('{3}', floorContent ? floorContent : '<li class="pd_notice">无</li>');

                            var levelContentList = new Array(levelRangeList.length);
                            for (var name in numberList) {
                                var obj = numberList[name];
                                if (obj.number >= 0) {
                                    for (var i = 0; i < levelContentList.length; i++) {
                                        if (obj.number >= targetNumber - levelRangeList[i] && obj.number <= targetNumber + levelRangeList[i]) {
                                            if (typeof levelContentList[i] === 'undefined') levelContentList[i] = '';
                                            levelContentList[i] +=
                                                '<li>【<a target="_blank" href="read.php?tid={0}&spid={1}">{2}楼</a>】{3}：<span class="pd_highlight">{4}</span></li>'
                                                    .replace('{0}', tid)
                                                    .replace('{1}', obj.pid)
                                                    .replace('{2}', obj.floor)
                                                    .replace('{3}', name)
                                                    .replace('{4}', obj.number);
                                            break;
                                        }
                                    }
                                }
                            }
                            var resultContent = '<div style="margin-top:10px"><strong>中奖情况 (中奖数字【<span class="pd_highlight">{0}</span>】)：</strong></div>'
                                .replace('{0}', targetNumber);
                            for (var i = 0; i < levelContentList.length; i++) {
                                resultContent += '<ul><li><b class="pd_highlight">{0}等奖(±{1})：</b></li>'.replace('{0}', i + 1).replace('{1}', levelRangeList[i]);
                                if (levelContentList[i]) resultContent += levelContentList[i];
                                else resultContent += '<li class="pd_notice">空缺</li>';
                                resultContent += '</ul>';
                            }

                            $dialog.find('#pd_stat_lottery_list').html(floorContent + resultContent);
                            Dialog.show('pd_stat_lottery');
                        }
                        window.setTimeout(function () {
                            $(document).dequeue('StatLottery');
                        }, Config.defAjaxInterval);
                    }, 'html');
                });
            });
            $(document).dequeue('StatLottery');
        });
}());

/*==========================================*/

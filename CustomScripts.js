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
Const.perAttackInterval = function () {
    var t = Math.floor(Math.random() * 3000 + 2000);
    console.log('间隔：' + t + 'ms');
    return t;
};

/*==========================================*/

// 统计各楼层的彩票数字（ft1073833专用版） V1.2
(function () {
    var numberRegex = /【\s*(\d+)\s*】/; // 匹配彩票数字的正则表达式
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
                            var content = floorMatches[4].replace(/<fieldset><legend>Quote:(.|\n|\r\n)+?<\/fieldset>/gi, '');
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
                            floorContent = ('<ul style="margin-top:10px"><li><strong>楼层统计情况：</strong></li><li>（正常统计：<b class="pd_highlight">{0}</b>个；' +
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
                            var resultContent = '<div><strong>中奖情况 (中奖数字【<span class="pd_highlight">{0}</span>】)：</strong></div>'
                                .replace('{0}', targetNumber);
                            for (var i = 0; i < levelContentList.length; i++) {
                                resultContent += '<ul><li><b class="pd_highlight">{0}等奖(±{1})：</b></li>'.replace('{0}', i + 1).replace('{1}', levelRangeList[i]);
                                if (levelContentList[i]) resultContent += levelContentList[i];
                                else resultContent += '<li class="pd_notice">空缺</li>';
                                resultContent += '</ul>';
                            }

                            $dialog.find('#pd_stat_lottery_list').html(resultContent + floorContent);
                            Dialog.show('pd_stat_lottery');
                        }
                        window.setTimeout(function () {
                            $(document).dequeue('StatLottery');
                        }, Const.defAjaxInterval);
                    }, 'html');
                });
            });
            $(document).dequeue('StatLottery');
        });
}());

/*==========================================*/

// 发帖时自动附加额外内容 V1.3
(function () {
    if (location.pathname !== '/read.php' && location.pathname !== '/post.php') return;
    var options = {
        // 附加在内容末尾的文本，如不需要则留空，可设置多组文本（发帖时将随机挑选一个进行附加），还可设置为函数（\n表示换行符）
        // 例：['\n文本1'] 或 ['\n文本1','\n文本2'] 或 function() { return '\n文本3'; }
        addText: [''],
        // 附加在内容开头的文本，如不需要则留空，可设置多组文本（发帖时将随机挑选一个进行附加），还可设置为函数（\n表示换行符）
        // 例：['文本1\n'] 或 ['文本1\n','文本2\n'] 或 function() { return '文本3\n'; }
        insertText: [''],
        // 如果原文本框内容包含了指定文本则不附加，留空表示不启用，可使用正则表达式，例：'文本4'或/Text.*4/i
        excludeText: '',
        // 附加内容的类型，0：任何时候都附加；1：只在发表新主题时附加；2：只在发表新回复时附加
        attachType: 0,
        // 在原文本框内容的字数不超过指定字数时才附加，-1表示不限制
        attachWhenLteWordNum: -1
    };

    var action = Tools.getUrlParam('action');
    if (action === 'modify') return;
    else if (options.attachType === 1 && (location.pathname === '/read.php' || action === 'reply' || action === 'quote')) return;
    else if (options.attachType === 2 && location.pathname === '/post.php' && !action) return;

    var $form = $('form[name="FORM"][action="post.php?"]');
    var switchHtml = '<label style="margin-left:7px"><input type="checkbox" id="pd_no_attach" class="pd_input" /> 不附加额外内容</label>';
    if (location.pathname === '/post.php') $form.find('input[name="diy_guanjianci"]').after(switchHtml);
    else $form.find('input[name="Submit"]').after(switchHtml);
    $form.submit(function () {
        var $this = $(this);
        var $textArea = $this.find('#textarea, textarea[name="atc_content"]').eq(0);
        var content = $textArea.val();
        if (!content) return;
        if ($this.find('#pd_no_attach').prop('checked')) return;
        if (options.excludeText) {
            if ($.type(options.excludeText) === 'regexp') {
                if (options.excludeText.test(content)) return;
            }
            else {
                if (content.toLowerCase().indexOf(options.excludeText.toLowerCase()) > -1) return;
            }
        }
        if (options.attachWhenLteWordNum > -1 && content.length > options.attachWhenLteWordNum) return;

        var handleText = function (text) {
            text = text.substr(0, 250).replace(/\[(img|url|sell).+?\/(img|url|sell)\]/gi, '[代码已屏蔽]');
            var matches = text.match(/\[size=\d+\]/gi);
            for (var i in matches) {
                var size = parseInt(/\d+/.exec(matches[i])[0]);
                if (size >= 4) text = text.replace(matches[i], '[size=1]');
            }
            return text;
        };
        var getText = function (text) {
            if (typeof text === 'function')
                return handleText(text().toString());
            else
                return handleText(text[Math.floor(Math.random() * text.length)]);
        };
        if (handleText('[img]a[/img]').indexOf('[img]') > -1) return;
        $textArea.val(getText(options.insertText) + content + getText(options.addText));
    });
}());

/*==========================================*/

// 记录被怪物攻击日志 V1.0
(function () {
    if (!KFOL.isInHomePage && location.pathname !== '/kf_fw_ig_index.php') return;
    var recordInterval = 5; // 记录的时间间隔（分钟）
    var autoRecordType = 0; // 自动记录的类型，0：不自动记录；1：只在争夺首页自动记录；2：只在论坛首页自动记录；3：在论坛首页和争夺首页均自动记录
    var recordStorageName = 'pd_monster_attack_log'; // 保存日志的键值名称
    var recordItvFunc = null;

    /**
     * 读取被怪物攻击日志
     * @returns {string[]} 日志列表
     */
    var readLog = function () {
        var log = localStorage.getItem(recordStorageName + '_' + KFOL.uid);
        if (log) {
            try {
                log = JSON.parse(log);
            }
            catch (ex) {
                log = [];
            }
            if (!log || $.type(log) !== 'array') log = [];
        }
        else {
            log = [];
        }
        return log;
    };

    /**
     * 写入被怪物攻击日志
     * @param {string[]} log 日志列表
     */
    var writeLog = function (log) {
        localStorage.setItem(recordStorageName + '_' + KFOL.uid, JSON.stringify(log));
    };

    /**
     * 记录被怪物攻击日志
     */
    var recordMonsterAttackLog = function () {
        if (!parseInt(recordInterval)) return;
        console.log('记录被怪物攻击日志Start(间隔：{0}分钟)'.replace('{0}', recordInterval));
        $.get('kf_fw_ig_index.php', function (html) {
            var attackLogMatches = /<tr><td colspan="\d+">\r\n<span style=".+?">(\d+:\d+:\d+ \|.+?)<br \/><\/td><\/tr>/i.exec(html);
            if (!attackLogMatches || !/发起争夺/.test(attackLogMatches[1])) {
                console.log('未发现日志');
                return;
            }
            var attackLogList = readLog();
            var newAttackLogList = [];
            newAttackLogList = attackLogMatches[1].replace(/<br \/>/ig, '\n').replace(/(<.+?>|<.+?\/>)/g, '').split('\n');
            var tmpAttackLogList = attackLogList.slice(-newAttackLogList.length);
            var index = 0;
            if (tmpAttackLogList.length < newAttackLogList.length) {
                for (index = 0; index < newAttackLogList.length; index++) {
                    if ($.inArray(newAttackLogList[index], tmpAttackLogList) > -1) break;
                }
                index--;
            }
            else {
                for (index = newAttackLogList.length - 1; index >= 0; index--) {
                    if ($.inArray(newAttackLogList[index], tmpAttackLogList) === -1) break;
                }
            }
            if (index >= 0) {
                for (var i = index; i >= 0; i--) {
                    attackLogList.push(newAttackLogList[i]);
                }
                console.log('新增日志{0}条'.replace('{0}', index + 1));
                writeLog(attackLogList);
            }
            else {
                console.log('暂无新增日志');
            }
        }, 'html');
    };

    /**
     * 获取选中文本的日志统计结果
     * @param {string} content 选中文本
     * @returns {{}} 日志统计结果
     */
    var statLog = function (content) {
        var stat = {};
        var matches = content.match(/发起争夺/g);
        if (matches) stat['攻击次数'] = matches.length;
        else return {};

        matches = content.match(/(被实际夺取\d+KFB|被实际燃烧\d+KFB)/ig);
        if (matches) {
            var totalKfb = 0;
            for (var i in matches) {
                var kfbMatches = /(\d+)KFB/i.exec(matches[i]);
                totalKfb += parseInt(kfbMatches[1]);
            }
            stat['损失KFB'] = totalKfb;
        }

        matches = content.match(/被对方闪避/g);
        if (matches) stat['闪避'] = matches.length;

        matches = content.match(/触发暴击/g);
        if (matches) stat['暴击'] = matches.length;

        matches = content.match(/清空生命值，被实际燃烧/g);
        if (matches) stat['清空生命值'] = matches.length;

        var monsterList = ['小史莱姆', '笨蛋', '大果冻史莱姆', '肉山', '大魔王'];
        stat['怪物攻击次数'] = {};
        for (var i in monsterList) {
            matches = content.match(new RegExp('\\[' + monsterList[i] + '\\]', 'g'));
            if (matches) stat['怪物攻击次数'][monsterList[i]] = matches.length;
        }
        return stat;
    };

    if (KFOL.isInHomePage && autoRecordType >= 2) {
        window.setTimeout(function () {
            recordMonsterAttackLog();
            recordItvFunc = window.setInterval(recordMonsterAttackLog, Math.floor((recordInterval * 60 + Math.random() * 5) * 1000));
        }, Math.floor((30 + Math.random() * 5) * 1000));
    }
    else if (location.pathname === '/kf_fw_ig_index.php') {
        $('<div id="pd_record_monster_attack_log"><button style="color:#00F" title="记录被怪物攻击日志">开始记录</button> <button title="查看被怪物攻击日志">查看日志</button> ' +
            '<button title="清除被怪物攻击日志">清除日志</button></div>')
            .appendTo('.kf_fw_ig1 > tbody > tr:last-child > td')
            .find('button:first')
            .click(function (e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.text() === '开始记录') {
                    $this.text('停止记录').css('color', '#F00');
                    recordMonsterAttackLog();
                    recordItvFunc = window.setInterval(recordMonsterAttackLog, Math.floor((recordInterval * 60 + Math.random() * 5) * 1000));
                }
                else {
                    $this.text('开始记录').css('color', '#00F');
                    if (recordItvFunc) window.clearInterval(recordItvFunc);
                }
            })
            .end()
            .find('button:eq(1)')
            .click(function (e) {
                e.preventDefault();
                if ($('#pd_monster_attack_log').length > 0) return;
                var attackLogList = readLog();
                if (attackLogList.length === 0) {
                    alert('目前暂无日志');
                    return;
                }
                attackLogList.reverse();

                var html =
                    '<div class="pd_cfg_main">' +
                    '  <textarea style="width:850px;height:404px;margin:5px 0;line-height:1.6em;white-space:pre" wrap="off" readonly="readonly"></textarea><br />' +
                    '  <div id="pd_monster_attack_log_stat" class="pd_stat" style="margin-bottom:5px">' +
                    '    <strong>统计结果（需选中相应文本）：</strong><br /><span class="pd_notice">无</span><br />' +
                    '    <strong>怪物攻击次数：</strong><br /><span class="pd_notice">无</span>' +
                    '  </div>' +
                    '</div>';
                var $dialog = Dialog.create('pd_monster_attack_log', '怪物攻击日志', html);

                $dialog.find('textarea').val(attackLogList.join('\n')).select(function () {
                    if (typeof this.selectionStart === 'undefined') return;
                    var selectedContent = this.value.substring(this.selectionStart, this.selectionEnd);
                    if (!selectedContent) return;
                    var stat = statLog(selectedContent);
                    var result = '<strong>统计结果（已选中{0}行）：</strong><br />'.replace('{0}', selectedContent.split('\n').length);
                    if ($.isEmptyObject(stat)) {
                        result += '<span class="pd_notice">无</span>';
                    }
                    else {
                        $.each(stat, function (key, value) {
                            if (key === '怪物攻击次数') return;
                            result += '<i>{0}<em>+{1}</em></i> '.replace('{0}', key).replace('{1}', value);
                        });
                        result += '<br /><strong>怪物攻击次数：</strong><br />';
                        if (!$.isEmptyObject(stat['怪物攻击次数'])) {
                            $.each(stat['怪物攻击次数'], function (monsterName, num) {
                                result += '<i>{0}<em>+{1}</em></i> '.replace('{0}', monsterName).replace('{1}', num);
                            });
                        }
                        else {
                            result += '<span class="pd_notice">无</span>';
                        }
                    }
                    $dialog.find('#pd_monster_attack_log_stat').html(result);
                });

                Dialog.show('pd_monster_attack_log');
                $dialog.find('textarea').focus();
            })
            .end()
            .find('button:last')
            .click(function (e) {
                e.preventDefault();
                var num = window.prompt('你想保留最近几条日志？（0表示全部删除）', 0);
                if (num === null) return;
                num = parseInt($.trim(num));
                if (num < 0) return;
                if (num === 0) {
                    localStorage.removeItem(recordStorageName + '_' + KFOL.uid);
                    alert('日志已全部清除');
                }
                else {
                    var attackLogList = readLog();
                    if (attackLogList.length > 0) writeLog(attackLogList.slice(-num));
                    alert('除最近{0}条外的日志已删除'.replace('{0}', num));
                }
            });

        if (autoRecordType === 1 || autoRecordType === 3)
            $('#pd_record_monster_attack_log > button:first').triggerHandler('click');
    }
}());

/*==========================================*/

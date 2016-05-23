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

// 统计各楼层的彩票数字（ft1073833专用版） V1.4
(function () {
    var numberRegex = /【\s*(\d+)\s*】/; // 匹配彩票数字的正则表达式
    var levelRangeList = [0, 5, 50]; // 各等奖中与中奖数字相差的范围
    var threadTitle = '每周红包'; // 在标题包含指定关键字的帖子里显示彩票统计的按钮（留空表示任意标题均可）

    if (location.pathname !== '/read.php' || Tools.getCurrentThreadPage() !== 1) return;
    if (threadTitle && $('form[name="delatc"] > div:first > table > tbody > tr > td > span:contains("{0}")'.replace('{0}', threadTitle)).length === 0) return;
    $('<li><a href="#" title="统计各楼层的彩票数字">[彩票统计]</a></li>')
        .insertBefore('.readtext:first + .readlou > div > .pages > li:first-child')
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
            KFOL.showWaitMsg('<strong>正在统计数字中...</strong><i>剩余页数：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                    .replace('{0}', maxPage)
                , true);
            var isStop = false;
            $(document).clearQueue('StatLottery');
            var floorList = [];
            $.each(new Array(maxPage), function (index) {
                $(document).queue('StatLottery', function () {
                    var url = 'read.php?tid={0}&page={1}&t={2}'.replace('{0}', tid).replace('{1}', index + 1).replace('{2}', new Date().getTime());
                    $.ajax({
                        type: 'GET',
                        url: url,
                        timeout: Const.defAjaxTimeout,
                        success: function (html) {
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
                        },
                        error: function () {
                            isStop = true;
                            alert('因连接超时，统计彩票数字操作中止');
                        },
                        complete: function () {
                            var $remainingNum = $('#pd_remaining_num');
                            $remainingNum.text(parseInt($remainingNum.text()) - 1);
                            isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                            if (isStop) $(document).clearQueue('StatLottery');

                            if (isStop || index === maxPage - 1) {
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
                            else {
                                window.setTimeout(function () {
                                    $(document).dequeue('StatLottery');
                                }, Const.defAjaxInterval);
                            }
                        },
                        dataType: 'html'
                    });
                });
            });
            $(document).dequeue('StatLottery');
        });
}());

/*==========================================*/

// 发帖时自动附加额外内容 V1.5
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
        attachWhenLteWordNum: -1,
        // 在发帖框旁显示“不附加额外内容”的选项，true：开启；false：关闭
        showNoAttachOptionEnabled: false
    };

    var action = Tools.getUrlParam('action');
    if (action === 'modify') return;
    else if (options.attachType === 1 && (location.pathname === '/read.php' || action === 'reply' || action === 'quote')) return;
    else if (options.attachType === 2 && location.pathname === '/post.php' && !action) return;

    var _strlen = KFOL.window.strlen;
    KFOL.window.strlen = function (str) {
        var length = typeof _strlen !== 'undefined' ? _strlen(str) : str.length;
        if (length > 0 && length < 12) length = 12;
        return length;
    };

    var $form = $('form[name="FORM"][action="post.php?"]');
    if (options.showNoAttachOptionEnabled) {
        var switchHtml = '<label style="margin-left:7px"><input type="checkbox" id="pd_no_attach" class="pd_input" /> 不附加额外内容</label>';
        if (location.pathname === '/post.php') $form.find('input[name="diy_guanjianci"]').after(switchHtml);
        else $form.find('input[name="Submit"]').after(switchHtml);
    }
    $form.submit(function () {
        var $this = $(this);
        var $textArea = $this.find('#textarea, textarea[name="atc_content"]').eq(0);
        var content = $textArea.val();
        if (!content) return;
        if (options.showNoAttachOptionEnabled && $this.find('#pd_no_attach').prop('checked')) return;
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
            text = text.substr(0, 250).replace(/\[(img|url|sell|audio|video).+?\/(img|url|sell|audio|video)\]/gi, '[代码已屏蔽]');
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
        $.get('kf_fw_ig_index.php?t=' + new Date().getTime(), function (html) {
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

// 屏蔽首页神秘系数排名 V1.0
(function () {
    if (KFOL.isInHomePage) {
        var $smRank = $('a.indbox5[href="kf_growup.php"]');
        var matches = /神秘\d+级/.exec($smRank.text());
        if (matches) $smRank.html(matches[0]);
    }
}());

/*==========================================*/

// 按pid顺序统计楼层名单（conans1009专用版） V1.5
(function () {
    if (location.pathname !== '/read.php' || Tools.getCurrentThreadPage() !== 1) return;

    /**
     * 判断中奖楼层
     * @param {number} floor 楼层号
     * @returns {boolean} 是否中奖
     */
    var isWinner = function (floor) {
        return floor >= 500 && floor <= 5000 && floor % 100 === 0;
    };

    /**
     * 获取KFB奖励
     * @param {number} smCoefficient 神秘系数
     * @param {number} floor 楼层号
     * @returns {number} KFB奖励
     */
    var getPrize = function (smCoefficient, floor) {
        if (smCoefficient < 0) return 0;
        if (floor % 1000 === 0) {
            if (smCoefficient >= 30) return 100000;
            else if (smCoefficient >= 20 && smCoefficient < 30) return 50000;
            else if (smCoefficient >= 10 && smCoefficient < 20) return 10000;
            else return 3000;
        }
        else if (floor % 100 === 0) {
            if (smCoefficient >= 20) return 10000;
            else if (smCoefficient >= 10 && smCoefficient < 20) return 5000;
            else return 2000;
        }
        else return 0;
    };

    $('<li><a href="#" title="按pid顺序统计楼层名单">[统计楼层]</a></li>').prependTo('.readtext:first + .readlou > div > .pages')
        .find('a').click(function (e) {
        e.preventDefault();
        if ($('#pd_stat_floor_list').length > 0) return;
        if (!window.confirm('是否开始按pid顺序统计楼层名单？')) return;
        var tid = parseInt(Tools.getUrlParam('tid'));
        if (!tid) return;
        var startFloor = 1, endFloor = 0;
        var matches = /(\d+)页/.exec($('.pages:eq(0) > li:last-child > a').text());
        var maxPage = matches ? parseInt(matches[1]) : 1;
        endFloor = maxPage * Config.perPageFloorNum - 1;
        if (tid === 535683) endFloor = 5099;
        var startPage = Math.floor(startFloor / Config.perPageFloorNum) + 1;
        var endPage = Math.floor(endFloor / Config.perPageFloorNum) + 1;
        if (endPage > maxPage) endPage = maxPage;
        if (endPage - startPage > 600) {
            alert('需访问的总页数不可超过600');
            return;
        }
        KFOL.showWaitMsg('<strong>正在统计楼层中...</strong><i>剩余页数：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                .replace('{0}', endPage - startPage + 1)
            , true);

        $(document).clearQueue('StatFloor');
        var floorList = {};
        var errorMsg = '';
        var isStop = false;
        $.each(new Array(endPage), function (index) {
            if (index + 1 < startPage) return;
            $(document).queue('StatFloor', function () {
                $.ajax({
                    type: 'GET',
                    url: 'read.php?tid={0}&page={1}&t={2}'.replace('{0}', tid).replace('{1}', index + 1).replace('{2}', new Date().getTime()),
                    timeout: Const.defAjaxTimeout,
                    success: function (html) {
                        var matches = html.match(/<a name=\d+><\/a>(.|\n|\r\n)+?(?=\r\n<\/div><div class="c"><\/div><\/div>\r\n)/gi);
                        if (index + 1 > 1 && index + 1 < maxPage && matches.length % 10 !== 0) {
                            errorMsg += '错误：第{0}页只统计了{1}层楼<br />'.replace('{0}', index + 1).replace('{1}', matches.length);
                            console.log('错误：第{0}页只统计了{1}层楼'.replace('{0}', index + 1).replace('{1}', matches.length));
                        }
                        for (var i in matches) {
                            var floorMatches = /<a name=(\d+)><\/a>(?:.|\n|\r\n)+?<span style=".+?">(\d+)楼<\/span>(?:.|\n|\r\n)+?<a href="profile\.php\?action=show&uid=(\d+)".+?>(.+?)<\/a>(?:<\/div>|<br \/>)\r\n(?:<div class="readidmright".+?>(.+?)<\/div>|(.+?)级神秘)\r\n/i.exec(matches[i]);
                            if (!floorMatches) {
                                errorMsg += '错误：第{0}页有楼层统计失败<br />'.replace('{0}', index + 1);
                                console.log(matches[i]);
                                continue;
                            }
                            var pid = parseInt(floorMatches[1]),
                                floor = parseInt(floorMatches[2]),
                                uid = parseInt(floorMatches[3]),
                                userName = floorMatches[4],
                                smLevel = floorMatches[5] ? floorMatches[5] : floorMatches[6];
                            if (floor < startFloor) continue;
                            if (floor > endFloor) {
                                isStop = true;
                                break;
                            }
                            if (typeof floorList[pid] !== 'undefined') {
                                errorMsg += '错误：【pid：{0}，floor：{1}，用户名：{2}】重复统计<br />'.replace('{0}', pid).replace('{1}', floor).replace('{2}', userName);
                                console.log('错误：【pid：{0}，floor：{1}，用户名：{2}】重复统计'.replace('{0}', pid).replace('{1}', floor).replace('{2}', userName));
                                continue;
                            }
                            floorList[pid] = {floor: floor, uid: uid, userName: userName, smLevel: smLevel};
                        }
                    },
                    error: function () {
                        errorMsg += '错误：第{0}页统计超时<br />'.replace('{0}', index + 1);
                        isStop = true;
                    },
                    complete: function () {
                        var $remainingNum = $('#pd_remaining_num');
                        $remainingNum.text(parseInt($remainingNum.text()) - 1);
                        isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                        if (isStop) $(document).clearQueue('StatFloor');

                        if (isStop || index === endPage - 1) {
                            KFOL.removePopTips($('.pd_pop_tips'));
                            getStatFloorContent(floorList, errorMsg);
                        }
                        else {
                            window.setTimeout(function () {
                                $(document).dequeue('StatFloor');
                            }, Const.defAjaxInterval);
                        }
                    },
                    dataType: 'html'
                });
            });
        });
        $(document).dequeue('StatFloor');
    });

    /**
     * 获取楼层统计结果内容
     * @param {{}} floorList 楼层统计列表
     * @param {string} errorMsg 错误消息
     */
    var getStatFloorContent = function (floorList, errorMsg) {
        var tid = parseInt(Tools.getUrlParam('tid'));
        var allFloorStatContent =
            '<tr>' +
            '  <th style="width:75px;text-align:left">实际楼层号</th>' +
            '  <th style="width:75px;text-align:left">显示楼层号</th>' +
            '  <th style="width:100px;text-align:left">pid</th>' +
            '  <th style="width:150px;text-align:left">用户名</th>' +
            '  <th style="width:75px;text-align:left">神秘等级</th>' +
            '</tr>';
        var index = 1, prevPid = 0, allDifferentNum = 0, winnerUserNum = 0;
        var pidWinnerList = [], displayWinnerList = [];
        var winnerUserList = {};
        $.each(floorList, function (pid, data) {
            if (pid < prevPid) {
                errorMsg += '错误：pid（{0}）小于前一位pid（{1}）<br />'.replace('{0}', pid).replace('{1}', prevPid);
                return false;
            }
            var isDifferent = index !== data.floor;
            allFloorStatContent +=
                '<tr>' +
                '  <td style="background-color:{0}">{1}</td>'
                    .replace('{0}', isDifferent ? '#99CC33' : 'inherit').replace('{1}', index) +
                '  <td style="background-color:{0}">{1}</td>'
                    .replace('{0}', isDifferent ? '#FF9999' : 'inherit')
                    .replace('{1}', data.floor) +
                '  <td><a target="_blank" href="read.php?tid={0}&spid={1}">{1}</a></td>'
                    .replace('{0}', tid)
                    .replace(/\{1\}/g, pid) +
                '  <td><a target="_blank" href="profile.php?action=show&uid={0}">{1}</a></td>'
                    .replace('{0}', data.uid)
                    .replace('{1}', data.userName) +
                '  <td>{0}</td>'.replace('{0}', data.smLevel) +
                '</tr>';
            if (isDifferent) allDifferentNum++;
            if (isWinner(index)) {
                pidWinnerList.push($.extend({pid: pid, index: index}, data));
                if (typeof winnerUserList[data.uid] === 'undefined') {
                    winnerUserList[data.uid] = {userName: data.userName};
                    winnerUserNum++;
                }
            }
            if (isWinner(data.floor)) {
                displayWinnerList.push($.extend({pid: pid, index: index}, data));
                if (typeof winnerUserList[data.uid] === 'undefined') {
                    winnerUserList[data.uid] = {userName: data.userName};
                    winnerUserNum++;
                }
            }
            prevPid = pid;
            index++;
        });

        KFOL.showWaitMsg('<strong>正在统计中奖用户中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                .replace('{0}', winnerUserNum)
            , true);
        $(document).clearQueue('StatWinnerUser');
        var index = 0;
        $.each(winnerUserList, function (uid, data) {
            $(document).queue('StatWinnerUser', function () {
                var url = 'profile.php?action=show&uid={0}&t={1}'.replace('{0}', uid).replace('{1}', new Date().getTime());
                $.get(url, function (html) {
                    var matches = /神秘系数：(\d+)\s*<br/i.exec(html);
                    if (matches) {
                        data.smCoefficient = parseInt(matches[1]);
                    }
                    else {
                        errorMsg += '错误：用户【{0}】统计失败<br />'.replace('{0}', data.userName);
                        console.log('错误：用户【{0}】统计失败'.replace('{0}', data.userName));
                    }

                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                    if (isStop) $(document).clearQueue('StatWinnerUser');

                    if (isStop || index === winnerUserNum - 1) {
                        KFOL.removePopTips($('.pd_pop_tips'));
                        var pidWinnerFloorStatContent = '', displayWinnerFloorStatContent = '';
                        pidWinnerFloorStatContent = displayWinnerFloorStatContent =
                            '<tr>' +
                            '  <th style="width:75px;text-align:left">实际楼层号</th>' +
                            '  <th style="width:75px;text-align:left">显示楼层号</th>' +
                            '  <th style="width:100px;text-align:left">pid</th>' +
                            '  <th style="width:150px;text-align:left">用户名</th>' +
                            '  <th style="width:70px;text-align:left">神秘系数</th>' +
                            '  <th style="width:75px;text-align:left">奖金</th>' +
                            '</tr>';
                        var pidWinnerDifferentNum = 0, displayWinnerDifferentNum = 0;
                        var pidWinnerTotalPrize = 0, displayWinnerTotalPrize = 0;
                        $.each(pidWinnerList, function (i, data) {
                            var isDifferent = data.index !== data.floor;
                            if (isDifferent) pidWinnerDifferentNum++;
                            var smCoefficient = typeof winnerUserList[data.uid] !== 'undefined' ? winnerUserList[data.uid].smCoefficient : -1;
                            if (typeof smCoefficient === 'undefined') smCoefficient = -1;
                            var prize = getPrize(smCoefficient, data.index);
                            pidWinnerTotalPrize += prize;
                            pidWinnerFloorStatContent +=
                                '<tr>' +
                                '  <td style="background-color:{0}">{1}</td>'
                                    .replace('{0}', isDifferent ? '#99CC33' : 'inherit').replace('{1}', data.index) +
                                '  <td style="background-color:{0}">{1}</td>'
                                    .replace('{0}', isDifferent ? '#FF9999' : 'inherit')
                                    .replace('{1}', data.floor) +
                                '  <td><a target="_blank" href="read.php?tid={0}&spid={1}">{1}</a></td>'
                                    .replace('{0}', tid)
                                    .replace(/\{1\}/g, data.pid) +
                                '  <td><a target="_blank" href="profile.php?action=show&uid={0}">{1}</a></td>'
                                    .replace('{0}', data.uid)
                                    .replace('{1}', data.userName) +
                                '  <td>{0}</td>'.replace('{0}', smCoefficient) +
                                '  <td style="background-color:{0}">{1}</td>'
                                    .replace('{0}', data.index % 1000 === 0 ? '#FFCC00' : 'inherit')
                                    .replace('{1}', prize) +
                                '</tr>';
                        });
                        $.each(displayWinnerList, function (i, data) {
                            var isDifferent = data.index !== data.floor;
                            if (isDifferent) displayWinnerDifferentNum++;
                            var smCoefficient = typeof winnerUserList[data.uid] !== 'undefined' ? winnerUserList[data.uid].smCoefficient : -1;
                            if (typeof smCoefficient === 'undefined') smCoefficient = -1;
                            var prize = getPrize(smCoefficient, data.floor);
                            displayWinnerTotalPrize += prize;
                            displayWinnerFloorStatContent +=
                                '<tr>' +
                                '  <td style="background-color:{0}">{1}</td>'
                                    .replace('{0}', isDifferent ? '#99CC33' : 'inherit').replace('{1}', data.index) +
                                '  <td style="background-color:{0}">{1}</td>'
                                    .replace('{0}', isDifferent ? '#FF9999' : 'inherit')
                                    .replace('{1}', data.floor) +
                                '  <td><a target="_blank" href="read.php?tid={0}&spid={1}">{1}</a></td>'
                                    .replace('{0}', tid)
                                    .replace(/\{1\}/g, data.pid) +
                                '  <td><a target="_blank" href="profile.php?action=show&uid={0}">{1}</a></td>'
                                    .replace('{0}', data.uid)
                                    .replace('{1}', data.userName) +
                                '  <td>{0}</td>'.replace('{0}', smCoefficient) +
                                '  <td style="background-color:{0}">{1}</td>'
                                    .replace('{0}', data.floor % 1000 === 0 ? '#FFCC00' : 'inherit')
                                    .replace('{1}', prize) +
                                '</tr>';
                        });
                        showDialog(allFloorStatContent, allDifferentNum, pidWinnerFloorStatContent, pidWinnerDifferentNum, pidWinnerTotalPrize,
                            displayWinnerFloorStatContent, displayWinnerDifferentNum, displayWinnerTotalPrize, errorMsg);
                    }
                    else {
                        index++;
                        window.setTimeout(function () {
                            $(document).dequeue('StatWinnerUser');
                        }, Const.defAjaxInterval);
                    }
                }, 'html');
            });
        });
        $(document).dequeue('StatWinnerUser');
        if ($.isEmptyObject(winnerUserList)) {
            KFOL.removePopTips($('.pd_pop_tips'));
            showDialog(allFloorStatContent, allDifferentNum, '', 0, 0, '', 0, 0, errorMsg);
        }
    };

    /***
     * 显示楼层统计名单对话框
     * @param {string} allFloorStatContent 所有楼层统计名单内容
     * @param {number} allDifferentNum 所有楼层中不相符的楼层数
     * @param {string} pidWinnerFloorStatContent 按pid排序的中奖楼层统计名单内容
     * @param {number} pidWinnerDifferentNum 按pid排序的中奖楼层中不相符的楼层数
     * @param {number} pidWinnerTotalPrize 按pid排序的中奖楼层的奖金合计
     * @param {string} displayWinnerFloorStatContent 按显示楼层排序的中奖楼层统计名单内容
     * @param {number} displayWinnerDifferentNum 按显示楼层排序的中奖楼层中不相符的楼层数
     * @param {number} displayWinnerTotalPrize 按显示楼层排序的中奖楼层的奖金合计
     * @param {string} errorMsg 错误信息
     */
    var showDialog = function (allFloorStatContent, allDifferentNum, pidWinnerFloorStatContent, pidWinnerDifferentNum, pidWinnerTotalPrize,
                               displayWinnerFloorStatContent, displayWinnerDifferentNum, displayWinnerTotalPrize, errorMsg) {
        var noWinnerTips = '<tr><td colspan="6" class="pd_notice">没有中奖楼层</td></tr>';
        var statTime = Tools.getDateString() + ' ' + Tools.getTimeString();
        var html =
            '<div class="pd_cfg_main">' +
            '  <h2 style="font-size:14px;text-align:center;color:#F00">中奖楼层（按pid）</h2>' +
            '  <span class="pd_notice">统计时间：{0}</span>'.replace('{0}', statTime) +
            '  <a class="pd_stat_floor_hide_extra_info" style="float:right" data-sort="pid" href="#">[隐藏额外信息]</a>' +
            '  <table style="clear:both">' +
            '    <tbody>{0}</tbody>'.replace('{0}', pidWinnerFloorStatContent ? pidWinnerFloorStatContent : noWinnerTips) +
            '  </table>' +
            '  <strong>不相符的楼层数：{0}</strong><br />'.replace('{0}', pidWinnerDifferentNum) +
            '  <strong>奖金合计：{0}</strong>'.replace('{0}', pidWinnerTotalPrize) +
            '  <hr />' +
            '  <h2 style="font-size:14px;text-align:center;color:#F00">中奖楼层（按显示楼层）</h2>' +
            '  <span class="pd_notice">统计时间：{0}</span>'.replace('{0}', statTime) +
            '  <a class="pd_stat_floor_hide_extra_info" style="float:right" data-sort="display" href="#">[隐藏额外信息]</a>' +
            '  <table style="clear:both">' +
            '    <tbody>{0}</tbody>'.replace('{0}', displayWinnerFloorStatContent ? displayWinnerFloorStatContent : noWinnerTips) +
            '  </table>' +
            '  <strong>不相符的楼层数：{0}</strong><br />'.replace('{0}', displayWinnerDifferentNum) +
            '  <strong>奖金合计：{0}</strong>'.replace('{0}', displayWinnerTotalPrize) +
            '  <hr />' +
            '  <h2 style="font-size:14px;text-align:center;color:#F00">所有楼层（按pid排序）</h2>' +
            '  <span class="pd_notice">统计时间：{0}</span>'.replace('{0}', statTime) +
            '  <table>' +
            '    <tbody>{0}</tbody>'.replace('{0}', allFloorStatContent) +
            '  </table>' +
            '  <strong>不相符的楼层数：{0}</strong>'.replace('{0}', allDifferentNum) +
            '</div>';
        var $dialog = Dialog.create('pd_stat_floor_list', '楼层统计名单', html);
        if (errorMsg) {
            $dialog.find('.pd_cfg_main').prepend(
                '  <h2 style="font-size:14px;text-align:center;color:#F00">错误信息</h2>' +
                '  <p style="color:#F00">{0}</p>'.replace('{0}', errorMsg) +
                '  <hr />'
            );
        }
        $dialog.on('click', '.pd_stat_floor_hide_extra_info', function (e) {
            e.preventDefault();
            var $this = $(this);
            var sortType = $this.data('sort');
            var $table = $this.next('table');
            $table.find('tbody > tr > th:nth-child(3), tbody > tr > td:nth-child(3)')
                .remove()
                .end()
                .find('tbody > tr > th:nth-child({0}), tbody > tr > td:nth-child({0})'.replace(/\{0\}/g, sortType === 'pid' ? 2 : 1))
                .remove()
                .end()
                .find('tbody > tr > td:first-child')
                .css('background-color', 'inherit')
                .end()
                .next('strong')
                .remove();
            $this.remove();
        });
        Dialog.show('pd_stat_floor_list');
    };
}());

/*==========================================*/

// 道具掉落情况统计格式整理（ft1073833专用版） V1.1
(function () {
    if (location.pathname !== '/read.php' || parseInt(Tools.getUrlParam('tid')) !== 537909) return;

    var getItemNumText = function (matches) {
        var num = 0;
        for (var i in matches) {
            var numMatches = /\d+/.exec(matches[i]);
            if (numMatches) num += parseInt(numMatches[0]);
        }
        return num + '\t';
    };

    $('<a title="将文本框中的KFOL助手争夺道具收获信息整理成专门的格式" style="margin-left:10px" href="#">整理格式</a>')
        .insertAfter('input[type="submit"][name="Submit"]')
        .click(function (e) {
            e.preventDefault();
            var $textArea = $('textarea[name="atc_content"]');
            var content = $textArea.val();
            if (!content) return;
            var stat = '';

            var matches = content.match(/零时迷子的碎片\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/被遗弃的告白信\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/学校天台的钥匙\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/TMA最新作压缩包\+\d+/ig);
            stat += getItemNumText(matches);
            matches = content.match(/LOLI的钱包\+\d+/ig);
            stat += getItemNumText(matches);
            matches = content.match(/棒棒糖\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/蕾米莉亚同人漫画\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/十六夜同人漫画\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/档案室钥匙\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/傲娇LOLI娇蛮音CD\+\d+/ig);
            stat += getItemNumText(matches);
            matches = content.match(/整形优惠卷\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/消逝之药\+\d+/g);
            stat += getItemNumText(matches);
            matches = content.match(/道具\+\d+/g);
            stat += getItemNumText(matches);

            $textArea.val('零时迷子的碎片\t被遗弃的告白信\t学校天台的钥匙\tTMA最新作压缩包\tLOLI的钱包\t棒棒糖\t蕾米莉亚同人漫画\t十六夜同人漫画\t档案室钥匙\t傲娇LOLI娇蛮音CD\t' +
                '整形优惠卷\t消逝之药\t道具掉落总个数\n' + stat);
        });
}());

/*==========================================*/

// 发帖常用文本 V1.2
(function () {
    if (location.pathname !== '/read.php' && location.pathname !== '/post.php') return;

    /**
     * 常用文本列表
     * 可在此增删自定义的常用文本，有三种定义方式：
     * 1. 只在option标签内定义了文本的项目：
     *    常用文本列表框和发帖框里最终显示的均为option标签内的文本，例：'<option>常用文本1</option>'
     * 2. 定义了value属性的项目：
     *    option标签内的文本会显示在常用文本列表框内，而发帖框里最终显示的将是value属性里的文本
     *    例：'<option value="这里是常用文本2！">常用文本2</option>'
     * 3. 定义了data-action属性的项目：
     *    option标签内的文本会显示在常用文本列表框内，而发帖框里最终显示的将是经过（动作列表中与data-action相匹配的）自定义函数所处理过的文本
     *    例：'<option data-action="动作标签">常用文本3...</option>'
     */
    var textList = [
        '<option data-action="红包">快捷红包...</option>',
        '<option>感谢楼主的分享！</option>',
        '<option value="恭喜楼主！[s:44]">恭喜楼主！</option>',
    ];

    // 动作列表：用于定义常用文本列表中与data-action属性相匹配的自定义函数，返回经过自定义函数处理的字符串
    var actionList = {
        '默认': function () {
            return '';
        },
        '红包': function () {
            var kfb = parseInt(window.prompt('请输入价格：', 100)); // 此处可以修改购买框的预设价格
            return !isNaN(kfb) ? '[sell={0}]感谢楼主的红包！[/sell]'.replace('{0}', kfb) : '';
        },
    };

    $('<select style="width:110px;margin-left:10px"><option data-action="默认" selected="selected">发帖常用文本</option>' + textList.join('') + '</select>')
        .insertAfter(location.pathname === '/read.php' ? 'input[name="Submit"]' : 'input[name="diy_guanjianci"]')
        .change(function () {
            var $selectItem = $(this.selectedOptions[0]);
            var text = '';
            var action = $selectItem.data('action');
            if (action) {
                if (typeof actionList[action] === 'function') text = actionList[action]();
            }
            else {
                text = $selectItem.val();
            }
            if (text) {
                var $textArea = $(location.pathname === '/read.php' ? 'textArea[name="atc_content"]' : '#textarea');
                var content = $textArea.val();
                content += (content && !/\n$/.test(content) ? '\n' : '') + text;
                $textArea.val(content).focus();
                $textArea.get(0).selectionStart = content.length;
                $textArea.get(0).selectionEnd = content.length;
                this.selectedIndex = 0;
            }
        }).find('option[data-action]').not(':first-child').css('color', '#F00');
}());

/*==========================================*/

// 其实整个KF只有我一个人 V1.0
var kfOnlyYou = function () {
    // 排除用户列表，例：['SYSTEM','信仰风']
    var excludeUserList = ['SYSTEM'];
    Const.excludeUsersCookieName = 'pd_exclude_users'; // 自定义排除用户列表的Cookie名称

    var commonReplace = function ($elem) {
        var user = $elem.text();
        if ($.inArray(user, excludeUserList) === -1) {
            $elem.text(KFOL.userName).attr('title', user);
            if (!$elem.is('a')) $elem.addClass('pd_custom_tips');
        }
    };

    excludeUserList.push(KFOL.userName);
    var value = Tools.getCookie(Const.excludeUsersCookieName);
    if (value) {
        $.each(value.split(','), function (i, user) {
            user = $.trim(user);
            if (user) excludeUserList.push(user);
        });
    }

    if (KFOL.isInHomePage) {
        var $node = $('div > a[href="kf_fw_1wkfb.php"]').parent();

        $('<div class="line"></div><div style="width:300px;"><a href="#" title="退出【其实整个KF只有我一个人】模式" class="indbox5">妈妈，我再也不想一个人玩了</a>' +
            '<div class="c"></div></div>')
            .insertAfter($node)
            .click(function (e) {
                e.preventDefault();
                if (window.confirm('是否退出【其实整个KF只有我一个人】模式？')) {
                    Tools.setCookie(Const.kfOnlyYouCookieName, '', Tools.getDate('-1d'));
                    alert('你的精神分裂症治好了，KF再次恢复了正常');
                    location.reload();
                }
            });

        $('<div class="line"></div><div style="width:300px;"><a href="#" title="添加想从替换中被排除的用户" class="indbox5">邀请想在KF一起玩的朋友</a>' +
            '<div class="c"></div></div>')
            .insertAfter($node)
            .click(function (e) {
                e.preventDefault();
                var value = Tools.getCookie(Const.excludeUsersCookieName);
                value = window.prompt('添加想从替换中被排除的用户名单（多个用户名请用英文逗号分隔）：', value ? value : '');
                if (value) {
                    Tools.setCookie(Const.excludeUsersCookieName, value, Tools.getDate('+3M'));
                    alert('有几位朋友来和你一起玩了，你的孤独症减轻了一些');
                }
                else if (value !== null) {
                    Tools.setCookie(Const.excludeUsersCookieName, '', Tools.getDate('-1d'));
                }
            });

        $('.b_tit4 > a, .b_tit4_1 > a').each(function () {
            var $this = $(this);
            var matches = /》by：(.+)/.exec($this.attr('title'));
            if (matches) {
                if ($.inArray(matches[1], excludeUserList) === -1) {
                    $this.attr('title', $this.attr('title').replace('》by：' + matches[1], '》by：' + KFOL.userName));
                }
            }
        });
    }
    else if (location.pathname === '/thread.php') {
        $('.thread1 > tbody > tr > td:last-child').each(function () {
            var $this = $(this);
            commonReplace($this.find('a.bl'));

            var html = $this.html();
            var matches = /<br>\n\s*(.+?)\s*\|\s*\d+[:\-]\d+$/.exec(html);
            if (matches) {
                if ($.inArray(matches[1], excludeUserList) === -1) {
                    $this.html(
                        html.replace(matches[0],
                            matches[0].replace(
                                matches[1] + ' |',
                                '<span class="pd_custom_tips" title="{0}">{1}</span> |'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                            )
                        )
                    );
                }
            }
        });
    }
    else if (location.pathname === '/search.php') {
        $('.thread1 > tbody > tr > td:last-child > a[href^="profile.php?action=show&uid="]').each(function () {
            commonReplace($(this));
        });
    }
    else if (location.pathname === '/read.php') {
        $('.readidmsbottom > a[href^="profile.php?action=show&uid="], .readidmleft > a[href^="profile.php?action=show&uid="]').each(function () {
            commonReplace($(this));
        });

        $('.readtext fieldset > legend:contains("Quote:")').each(function () {
            var $quote = $(this).parent();
            var html = $quote.html();
            var matches = /<\/legend>引用<a.+?>第\d+楼<\/a>(.+?)于\d+-\d+-\d+\s*\d+:\d+发表的/.exec(html);
            if (matches) {
                if ($.inArray(matches[1], excludeUserList) === -1) {
                    $quote.html(
                        html.replace(matches[0],
                            matches[0].replace(
                                '</a>' + matches[1],
                                '</a><span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                            )
                        )
                    );
                }
            }
            else {
                matches = /<\/legend>回\s*\d+楼\((.+?)\)\s*的帖子/.exec(html);
                if (matches) {
                    if ($.inArray(matches[1], excludeUserList) === -1) {
                        $quote.html(
                            html.replace(matches[0],
                                matches[0].replace(
                                    '楼(' + matches[1],
                                    '楼(<span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                                )
                            )
                        );
                    }
                }
            }
        });
    }
    else if (location.pathname === '/guanjianci.php') {
        $('.kf_share1:last > tbody > tr:gt(0) > td:last-child').each(function () {
            commonReplace($(this));
        });
    }
    else if (/\/profile\.php\?action=show/i.test(location.href)) {
        var $user1 = $('.log1 > tbody > tr:first-child > td:first-child');
        var matches = /(.+) 详细信息/.exec($user1.text());
        if (matches) {
            if ($.inArray(matches[1], excludeUserList) === -1) {
                $user1.html(KFOL.userName + ' 详细信息').attr('title', matches[1]).addClass('pd_custom_tips');
            }
        }

        var $user2 = $('.log1 > tbody > tr:nth-child(2) > td:nth-child(2)');
        var html = $user2.html();
        matches = /用户名称：(.+?)\s*\(/.exec($user2.text());
        if (matches) {
            if ($.inArray(matches[1], excludeUserList) === -1) {
                $user2.html(
                    html.replace(matches[0],
                        matches[0].replace(
                            '用户名称：' + matches[1],
                            '用户名称：<span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', matches[1]).replace('{1}', KFOL.userName)
                        )
                    )
                );
            }
        }
    }
    else if (/\/profile\.php\?action=favor/i.test(location.href)) {
        $('td > a[href^="profile.php?action=show&uid="]').each(function () {
            commonReplace($(this));
        });
    }
    else if (/\/message\.php\?action=read&mid=\d+/i.test(location.href)) {
        commonReplace($('.thread2 > tbody > tr:nth-child(2) > td:last-child'));
        commonReplace($('td > a[href^="profile.php?action=show&username="]'));
    }
    else if (/\/message\.php($|\?action=receivebox)/i.test(location.href)) {
        $('.thread1 > tbody > tr > td:nth-child(3) > a').each(function () {
            commonReplace($(this));
        });
    }
    else if (location.pathname === '/kf_no1.php') {
        $('.kf_no11:last > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
            commonReplace($(this));
        });
    }
    else if (location.pathname === '/kf_share.php') {
        $('.kf_share1:last > tbody > tr:gt(0) > td:last-child').each(function () {
            commonReplace($(this));
        });
    }
    else if (/\/hack\.php\?H_name=bank/i.test(location.href)) {
        if (Tools.getUrlParam('action') === 'log') {
            $('.bank1 > tbody > tr:gt(1) > td:nth-child(3) > div > b').each(function () {
                commonReplace($(this));
            });
        }
        else {
            $('td > table > tbody > tr:first-child > td:contains("活期存款排行")').closest('tbody').find('tr:gt(0) > td:nth-child(2)').each(function () {
                commonReplace($(this));
            });
        }
    }
    else if (/\/personal\.php\?action=post/i.test(location.href)) {
        $('td > a[href^="profile.php?action=show&uid="]').each(function () {
            commonReplace($(this));
        });
    }
    else if (/\/kf_fw_ig_my\.php\?pro=\d+/i.test(location.href)) {
        var $owner = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:last-child > span:contains("现持有者：")');
        var matches = /现持有者：(.+)/.exec($owner.text());
        if (matches) {
            if ($.inArray(matches[1], excludeUserList) === -1) {
                $owner.text('现持有者：' + KFOL.userName).attr('title', matches[1]).addClass('pd_custom_tips');
            }
        }

        var $itemLog = $('.kf_fw_ig1 > tbody > tr:last-child > td');
        var html = $itemLog.html();
        var oriHtml = html;

        matches = html.match(/被[^<>]+?(取|于)/g);
        for (var i in matches) {
            var userMatches = /被([^<>]+?)(取|于)/.exec(matches[i]);
            if (userMatches) {
                if ($.inArray(userMatches[1], excludeUserList) === -1) {
                    html = html.replace(userMatches[0],
                        '被<span class="pd_custom_tips" title="{0}">{1}</span>{2}'
                            .replace('{0}', userMatches[1]).replace('{1}', KFOL.userName).replace('{2}', userMatches[2])
                    );
                }
            }
        }
        if (html !== oriHtml) $itemLog.html(html);
    }
};

(function () {
    Const.kfOnlyYouCookieName = 'pd_kf_only_you'; // 标记是否进入【其实整个KF只有我一个人】模式的Cookie名称

    var value = parseInt(Tools.getCookie(Const.kfOnlyYouCookieName));
    if (value === 1) {
        kfOnlyYou();
    }
    else if (isNaN(value) && KFOL.isInHomePage) {
        if (Math.floor(Math.random() * 15) !== 9) return;

        var $tips = KFOL.showWaitMsg('<strong>少年（少女），其实整个KF只有你一个人，你相信吗？</strong><br />' +
            '<a data-action="yes" href="#">我相信</a><a data-action="no" href="#">我不相信</a><a data-action="hide" style="color:#F00" href="#">不再提示</a>',
            true);
        $tips.on('click', 'a', function (e) {
            e.preventDefault();
            var action = $(this).data('action');
            if (action === 'yes') {
                Tools.setCookie(Const.kfOnlyYouCookieName, 1, Tools.getDate('+1M'));
                kfOnlyYou();
            }
            else if (action === 'hide') {
                Tools.setCookie(Const.kfOnlyYouCookieName, -1, Tools.getDate('+1M'));
            }
            else {
                Tools.setCookie(Const.kfOnlyYouCookieName, -1, Tools.getDate('+1d'));
                alert('啧，算你走运，居然没被骗到~~');
            }
            KFOL.removePopTips($tips);
        })
    }
}());

/*==========================================*/

// 去除帖子列表页面的帖子链接里的fpage参数 V1.0
(function () {
    if (location.pathname !== '/thread.php') return;
    $('.threadtit1 > a[href*="fpage="]').each(function () {
        var $this = $(this);
        $this.attr('href', $this.attr('href').replace(/&fpage=\d+/i, ''));
    });
}());

/*==========================================*/

// 统计可用道具样品 V1.0
var statSampleItem = function (totalNum, startId) {
    if (!startId) startId = 1;
    KFOL.showWaitMsg('<strong>正在统计道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
            .replace('{0}', totalNum)
        , true);
    var sampleItemList = {};
    $(document).clearQueue('StatSampleItem');
    $.each(new Array(totalNum), function (index) {
        $(document).queue('StatSampleItem', function () {
            var itemId = index + startId;
            $.ajax({
                type: 'GET',
                url: 'kf_fw_ig_my.php?pro=' + itemId,
                timeout: 10000,
                success: function (html) {
                    if (!/现持有者：苍雪道具商店</.test(html)) return;
                    var itemLevelMatches = /道具等级：(\d+)级道具</.exec(html);
                    if (!itemLevelMatches) return;
                    var itemLevel = parseInt(itemLevelMatches[1]);
                    var itemNameMatches = /道具名称：(.+?)</.exec(html);
                    if (!itemNameMatches) return;
                    var key = 'Lv.' + itemLevel + '：' + itemNameMatches[1];
                    if (typeof sampleItemList[key] === 'undefined') sampleItemList[key] = [];
                    sampleItemList[key].push(itemId);
                    console.log('【{0}】：{1}'.replace('{0}', key).replace('{1}', Tools.getHostNameUrl() + 'kf_fw_ig_my.php?pro=' + itemId));
                },
                complete: function () {
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(parseInt($remainingNum.text()) - 1);
                    var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                    if (isStop) $(document).clearQueue('StatSampleItem');

                    if (isStop || index === totalNum - 1) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        var result = '<span class="pd_notice">最后统计的道具ID：{0}</span><br />'.replace('{0}', itemId);
                        $.each(sampleItemList, function (key, list) {
                            result += '<b>{0}</b><br />'.replace('{0}', key);
                            for (var i in list) {
                                result += '<a target="_blank" href="kf_fw_ig_my.php?pro={0}">{0}</a><br />'.replace(/\{0\}/g, list[i]);
                            }
                        });

                        var dialogHtml =
                            '<div class="pd_cfg_main">' +
                            '  <div style="width:300px;background-color:#FFF;margin:5px 0;line-height:20px;">{0}</div>'.replace('{0}', result) +
                            '</div>';
                        Dialog.create('pd_stat_sample_item', '统计可用道具样品', dialogHtml);
                        Dialog.show('pd_stat_sample_item');
                    }
                    else {
                        window.setTimeout(function () {
                            $(document).dequeue('StatSampleItem');
                        }, Const.defAjaxInterval);
                    }
                },
                dataType: 'html'
            });
        });
    });
    $(document).dequeue('StatSampleItem');
};

(function () {
    if (!/\/kf_fw_ig_my\.php$/i.test(location.href)) return;
    $('<span> | </span><a title="统计可用的道具样品" href="#">统计道具样品</a>').insertAfter('a[href^="kf_fw_card_pk.php?safeid="]')
        .filter('a').click(function (e) {
        e.preventDefault();
        var value = window.prompt('请输入准备统计的道具总数以及统计的起始ID：', '100|1');
        if (!value) return;
        if (!/^\d+(\|\d+)?$/.test(value)) return;
        var arr = value.split('|');
        var totalNum = parseInt(arr[0]);
        if (totalNum <= 0) totalNum = 1;
        var startId = 1;
        if (typeof arr[1] !== 'undefined') startId = parseInt(arr[1]);
        statSampleItem(totalNum, startId);
    });
}());

/*==========================================*/

// 多彩神秘颜色 V1.0
(function () {
    if (location.pathname !== '/read.php') return;
    var imgResUrl = 'https://kf.miaola.info/pd/img/';
    $('.readidmsbottom > a[href="profile.php?action=show&uid={0}"], .readidmleft > a[href="profile.php?action=show&uid={0}"]'
        .replace(/\{0\}/g, KFOL.uid)
    ).each(function () {
        $(this).closest('.readtext').css('border-image', 'url("' + imgResUrl + 'border_rainbow_middle.png") 1 stretch')
            .prev('.readlou').css('border-image', 'url("' + imgResUrl + 'border_rainbow_top.png") 1 stretch')
            .next().next('.readlou').css('border-image', 'url("' + imgResUrl + 'border_rainbow_bottom.png") 1 stretch');
    });
}());

/*==========================================*/

// 为自己的头像加上猫耳 V1.1
(function () {
    if (location.pathname !== '/read.php') return;
    $('.readidmsbottom > a[href="profile.php?action=show&uid={0}"], .readidmleft > a[href="profile.php?action=show&uid={0}"]'
        .replace(/\{0\}/g, KFOL.uid)
    ).each(function () {
        var $this = $(this);
        var $parent = $this.parent();
        var type = 1;
        if ($parent.is('.readidmleft')) type = 2;
        var $avatar = null;
        if (type === 2) $avatar = $parent.closest('.readidm');
        else $avatar = $parent.prev('.readidmstop').find('img.pic');
        if (!$avatar || !$avatar.length || /none\.gif$/.test($avatar.attr('src'))) return;
        var $nekoMiMi = $('<img class="pd_nekomimi" src="{0}" />'.replace('{0}', 'https://kf.miaola.info/pd/img/nekomimi_' + type + '.png'));
        if (type === 2) {
            $nekoMiMi.prependTo($avatar).css('top', -29).css('left', -1);
            $avatar.css('position', 'relative').css('overflow', 'visible').closest('.readtext').css('overflow-x', 'visible');
        }
        else {
            $nekoMiMi.insertBefore($avatar).css('top', -22).css('left', 16);
            $avatar.parent('.readidmstop').css('position', 'relative').closest('.readtext').css('overflow-x', 'visible');
        }
    });
    if ($('.pd_nekomimi').length > 0) {
        $(document).on('click', '.pd_nekomimi', function () {
            var $nekoMiMiVoice = $('#pd_nekomimi_voice');
            if ($nekoMiMiVoice.length > 0) {
                $nekoMiMiVoice.get(0).play();
            }
            else {
                $('body').append('<audio id="pd_nekomimi_voice" src="https://kf.miaola.info/pd/nyanpass.mp3" autoplay="autoplay" style="display:none"></audio>');
            }
        });
    }
}());

/*==========================================*/

// 自定义自己的神秘等级 V1.0
(function () {
    var smLevel = ''; //自定义的神秘等级（普通头像最多限8个字符，卡片头像最多限5个字符）
    var type = 0; //设为1表示只在帖子页面里修改神秘等级

    if (!smLevel) return;
    smLevel = smLevel.substr(0, 8);
    if (KFOL.isInHomePage) {
        if (type) return;
        var $smLevel = $('a[href="kf_growup.php"][title="用户等级和权限"]');
        $smLevel.html($smLevel.html().replace(/神秘(.+?)级/, '<span title="$1级神秘">神秘' + smLevel + '级</span>'));
    }
    else if (location.pathname === '/read.php') {
        $('.readidmsbottom > a[href="profile.php?action=show&uid={0}"], .readidmleft > a[href="profile.php?action=show&uid={0}"]'
            .replace(/\{0\}/g, KFOL.uid)
        ).each(function () {
            var $this = $(this);
            var $parent = $this.parent();
            if ($parent.is('.readidmleft')) {
                var smLevelText = smLevel.substr(0, 5);
                var $smLevel = $parent.next('.readidmright');
                var oriSmLevel = $smLevel.text();
                $smLevel.css('font-size', smLevelText.length === 4 ? '14px' : '13px')
                    .text(smLevelText)
                    .attr('title', oriSmLevel + '级神秘')
                    .addClass('pd_custom_tips');
            }
            else {
                var smLevelText = smLevel;
                var $smLevel = $parent.contents().last();
                var matches = /(\d+)级神秘/.exec($smLevel.text());
                if (matches) {
                    $smLevel.get(0).textContent = smLevelText + '级神秘';
                    $smLevel.wrap('<span title="' + matches[1] + '级神秘" class="pd_custom_tips"></span>');
                }
            }
        });
    }
    else if (/\/profile\.php\?action=show&uid=\d+/i.test(location.href)) {
        if (type || Tools.getUrlParam('uid') !== KFOL.uid.toString()) return;
        var $userInfo = $('.log1 > tbody > tr:nth-child(2) > td:nth-child(2)');
        $userInfo.html($userInfo.html().replace(/神秘等级：(\d+)\s*级/i, '神秘等级：<span title="$1级神秘" class="pd_custom_tips">' + smLevel + ' 级</span>'));
    }
    else if (location.pathname === '/kf_growup.php') {
        if (type) return;
        var $smLevel = $('#alldiv > table:first > tbody > tr:first-child > td:nth-child(2) > div:first > div:first-child > b:first');
        var oriSmLevel = $smLevel.text();
        $smLevel.text(smLevel).attr('title', oriSmLevel + '级神秘').addClass('pd_custom_tips');
    }
}());

/*==========================================*/

/**
 * 日志类
 */
var Log = {
    // 保存日志的键值名称
    name: 'pd_log',
    // 日志对象
    log: {},

    /**
     * 读取日志
     */
    read: function () {
        Log.log = {};
        var log = null;
        if (storageType === 'Script' || storageType === 'Global') log = GM_getValue(Log.name + '_' + KFOL.uid);
        else log = localStorage.getItem(Log.name + '_' + KFOL.uid);
        if (!log) return;
        try {
            log = JSON.parse(log);
        }
        catch (ex) {
            return;
        }
        if (!log || $.type(log) !== 'object') return;
        Log.log = log;
        if (!Tools.getCookie(Const.checkOverdueLogCookieName)) Log.deleteOverdueLog();
    },

    /**
     * 写入日志
     */
    write: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_setValue(Log.name + '_' + KFOL.uid, JSON.stringify(Log.log));
        else localStorage.setItem(Log.name + '_' + KFOL.uid, JSON.stringify(Log.log));
    },

    /**
     * 清除日志
     */
    clear: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_deleteValue(Log.name + '_' + KFOL.uid);
        else localStorage.removeItem(Log.name + '_' + KFOL.uid);
    },

    /**
     * 删除过期日志
     */
    deleteOverdueLog: function () {
        var dateList = Tools.getObjectKeyList(Log.log, 1);
        var overdueDate = Tools.getDateString(Tools.getDate('-' + Config.logSaveDays + 'd'));
        var isDeleted = false;
        for (var i in dateList) {
            if (dateList[i] <= overdueDate) {
                delete Log.log[dateList[i]];
                isDeleted = true;
            }
            else break;
        }
        if (isDeleted) Log.write();
        Tools.setCookie(Const.checkOverdueLogCookieName, 1, Tools.getMidnightHourDate(1));
    },

    /**
     * 记录一条新日志
     * @param {string} type 日志类别
     * @param {string} action 行为
     * @param {{}} [options] 设置对象
     * @param {{}} [options.gain] 收获
     * @param {{}} [options.pay] 付出
     * @param {boolean} [options.notStat=false] 是否不参与统计
     */
    push: function (type, action, options) {
        var defaults = {
            time: 0,
            type: '',
            action: '',
            gain: {},
            pay: {},
            notStat: false
        };
        var settings = $.extend({}, defaults);
        if ($.type(options) === 'object') {
            $.extend(settings, options);
        }
        settings.type = type;
        settings.action = action;
        var date = new Date();
        settings.time = date.getTime();
        var today = Tools.getDateString(date);
        Log.read();
        if ($.type(Log.log[today]) !== 'array') Log.log[today] = [];
        Log.log[today].push(Tools.getDifferentValueOfObject(defaults, settings));
        Log.write();
    },

    /**
     * 显示日志对话框
     */
    show: function () {
        if ($('#pd_log').length > 0) return;
        Dialog.close('pd_config');
        ConfigMethod.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div class="pd_log_nav">' +
            '    <a class="pd_disabled_link" href="#">&lt;&lt;</a>' +
            '    <a style="padding:0 7px" class="pd_disabled_link" href="#">&lt;</a>' +
            '    <h2 class="pd_custom_tips">暂无日志</h2>' +
            '    <a style="padding:0 7px" class="pd_disabled_link" href="#">&gt;</a>' +
            '    <a class="pd_disabled_link" href="#">&gt;&gt;</a>' +
            '  </div>' +
            '  <fieldset>' +
            '    <legend>日志内容</legend>' +
            '    <div>' +
            '      <strong>排序方式：</strong>' +
            '      <label title="按时间顺序排序"><input type="radio" name="pd_log_sort_type" value="time" checked="checked" />按时间</label>' +
            '      <label title="按日志类别排序"><input type="radio" name="pd_log_sort_type" value="type" />按类别</label>' +
            '    </div>' +
            '    <div class="pd_stat" id="pd_log_content">暂无日志</div>' +
            '  </fieldset>' +
            '  <fieldset>' +
            '    <legend>统计结果</legend>' +
            '    <div>' +
            '      <strong>统计范围：</strong>' +
            '      <label title="显示当天的统计结果"><input type="radio" name="pd_log_stat_type" value="cur" checked="checked" />当天</label>' +
            '      <label title="显示距该日N天内的统计结果"><input type="radio" name="pd_log_stat_type" value="custom" /></label>' +
            '<label title="显示距该日N天内的统计结果"><input id="pd_log_stat_days" type="text" style="width:22px" maxlength="3" />天内</label>' +
            '      <label title="显示全部统计结果"><input type="radio" name="pd_log_stat_type" value="all" />全部</label>' +
            '    </div>' +
            '    <div class="pd_stat" id="pd_log_stat">暂无日志</div>' +
            '  </fieldset>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <span class="pd_cfg_about"><a id="pd_log_im_or_ex_log_dialog" href="#">导入/导出日志</a></span>' +
            '  <button>关闭</button><button>清除日志</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_log', 'KF Online助手日志', html);

        Log.read();
        var dateList = [];
        var curIndex = 0;
        if (!$.isEmptyObject(Log.log)) {
            dateList = Tools.getObjectKeyList(Log.log, 1);
            curIndex = dateList.length - 1;
            $dialog.find('.pd_log_nav h2').attr('title', '总共记录了{0}天的日志'.replace('{0}', dateList.length)).text(dateList[curIndex]);
            if (dateList.length > 1) {
                $dialog.find('.pd_log_nav > a:eq(0)').attr('title', dateList[0]).removeClass('pd_disabled_link');
                $dialog.find('.pd_log_nav > a:eq(1)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
            }
        }
        $dialog.find('.pd_log_nav a').click(function (e) {
            e.preventDefault();
            if ($(this).is('.pd_log_nav a:eq(0)')) {
                curIndex = 0;
            }
            else if ($(this).is('.pd_log_nav a:eq(1)')) {
                if (curIndex > 0) curIndex--;
                else return;
            }
            else if ($(this).is('.pd_log_nav a:eq(2)')) {
                if (curIndex < dateList.length - 1) curIndex++;
                else return;
            }
            else if ($(this).is('.pd_log_nav a:eq(3)')) {
                curIndex = dateList.length - 1;
            }
            $dialog.find('.pd_log_nav h2').text(dateList[curIndex]);
            Log.showLogContent(dateList[curIndex]);
            Log.showLogStat(dateList[curIndex]);
            if (curIndex > 0) {
                $dialog.find('.pd_log_nav > a:eq(0)').attr('title', dateList[0]).removeClass('pd_disabled_link');
                $dialog.find('.pd_log_nav > a:eq(1)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
            }
            else {
                $dialog.find('.pd_log_nav > a:lt(2)').removeAttr('title').addClass('pd_disabled_link');
            }
            if (curIndex < dateList.length - 1) {
                $dialog.find('.pd_log_nav > a:eq(2)').attr('title', dateList[curIndex - 1]).removeClass('pd_disabled_link');
                $dialog.find('.pd_log_nav > a:eq(3)').attr('title', dateList[dateList.length - 1]).removeClass('pd_disabled_link');
            }
            else {
                $dialog.find('.pd_log_nav > a:gt(1)').removeAttr('title').addClass('pd_disabled_link');
            }
        }).end().find('input[name="pd_log_sort_type"]').click(function () {
            var value = $(this).val();
            if (Config.logSortType !== value) {
                Config.logSortType = value;
                ConfigMethod.write();
                Log.showLogContent(dateList[curIndex]);
            }
        }).end().find('input[name="pd_log_stat_type"]').click(function () {
            var value = $(this).val();
            if (Config.logStatType !== value) {
                Config.logStatType = value;
                ConfigMethod.write();
                Log.showLogStat(dateList[curIndex]);
            }
        }).end().find('#pd_log_stat_days').keyup(function () {
            var days = parseInt($.trim($(this).val()));
            if (days > 0 && Config.logStatDays !== days) {
                Config.logStatDays = days;
                ConfigMethod.write();
                $('input[name="pd_log_stat_type"][value="custom"]:not(:checked)').click();
                Log.showLogStat(dateList[curIndex]);
            }
        }).end().find('input[name="pd_log_sort_type"][value="{0}"]'.replace('{0}', Config.logSortType)).click()
            .end().find('input[name="pd_log_stat_type"][value="{0}"]'.replace('{0}', Config.logStatType)).click()
            .end().find('#pd_log_stat_days').val(Config.logStatDays);

        $dialog.find('.pd_cfg_btns > button:first').click(function () {
            return Dialog.close('pd_log');
        }).next('button').click(function (e) {
            e.preventDefault();
            if (window.confirm('是否清除所有日志？')) {
                Log.clear();
                alert('日志已清除');
                location.reload();
            }
        });

        $('#pd_log_im_or_ex_log_dialog').click(function (e) {
            e.preventDefault();
            Log.showImportOrExportLogDialog();
        });

        Log.showLogContent(dateList[curIndex]);
        Log.showLogStat(dateList[curIndex]);

        if ($(window).height() <= 720) $dialog.find('#pd_log_content').css('height', '216px');
        Dialog.show('pd_log');
        $dialog.find('input:first').focus();
    },

    /**
     * 显示指定日期的日志内容
     * @param {string} date 日志对象关键字
     */
    showLogContent: function (date) {
        if ($.type(Log.log[date]) !== 'array') return;
        $('#pd_log_content').html(Log.getLogContent(date, Config.logSortType))
            .parent().find('legend:first-child').text('日志内容 (共{0}项)'.replace('{0}', Log.log[date].length));
    },

    /**
     * 获取指定日期的日志内容
     * @param {string} date 日志对象关键字
     * @param {string} logSortType 日志内容的排序方式
     * @returns {string} 指定日期的日志内容
     */
    getLogContent: function (date, logSortType) {
        var logList = Log.log[date];
        if (logSortType === 'type') {
            var sortTypeList = ['捐款', '领取争夺奖励', '批量攻击', '试探攻击', '抽取神秘盒子', '抽取道具或卡片', '使用道具', '恢复道具', '循环使用道具', '将道具转换为能量',
                '将卡片转换为VIP时间', '购买道具', '统计道具购买价格', '出售道具', '神秘抽奖', '统计神秘抽奖结果', '神秘等级升级', '神秘系数排名变化', '批量转账', '购买帖子',
                '自动存款'];
            logList.sort(function (a, b) {
                return $.inArray(a.type, sortTypeList) > $.inArray(b.type, sortTypeList);
            });
        }
        else {
            logList.sort(function (a, b) {
                return a.time > b.time;
            });
        }

        var content = '', curType = '';
        $.each(logList, function (index, key) {
            if (typeof key.time === 'undefined' || typeof key.type === 'undefined' || typeof key.action === 'undefined') return;
            var d = new Date(key.time);
            if (logSortType === 'type') {
                if (curType !== key.type) {
                    content += '<h3>【{0}】</h3>'.replace('{0}', key.type);
                    curType = key.type;
                }
                content += '<p><b>{0}：</b>{1}'
                    .replace('{0}', Tools.getTimeString(d))
                    .replace('{1}', key.action.replace(/`([^`]+?)`/g, '<b style="color:#F00">$1</b>'));
            }
            else {
                content += '<p><b>{0} ({1})：</b>{2}'
                    .replace('{0}', Tools.getTimeString(d))
                    .replace('{1}', key.type)
                    .replace('{2}', key.action.replace(/`([^`]+?)`/g, '<b style="color:#F00">$1</b>'));
            }

            var stat = '';
            if ($.type(key.gain) === 'object' && !$.isEmptyObject(key.gain)) {
                stat += '，';
                for (var k in key.gain) {
                    if (k === 'item') {
                        for (var itemName in key.gain['item']) {
                            stat += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', key.gain['item'][itemName].toLocaleString());
                        }
                    }
                    else {
                        stat += '<i>{0}<em>+{1}</em></i> '.replace('{0}', k).replace('{1}', key.gain[k].toLocaleString());
                    }
                }
            }
            if ($.type(key.pay) === 'object' && !$.isEmptyObject(key.pay)) {
                if (!stat) stat += '，';
                for (var k in key.pay) {
                    if (k === 'item') {
                        for (var itemName in key.pay['item']) {
                            stat += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', itemName).replace('{1}', key.pay['item'][itemName].toLocaleString());
                        }
                    }
                    else {
                        stat += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', k).replace('{1}', key.pay[k].toLocaleString());
                    }
                }
            }

            content += stat + '</p>';
        });

        return content;
    },

    /**
     * 显示指定日期的日志统计结果
     * @param {string} date 日志对象关键字
     */
    showLogStat: function (date) {
        if ($.type(Log.log[date]) !== 'array') return;
        $('#pd_log_stat').html(Log.getLogStat(date, Config.logStatType));
    },

    /**
     * 获取指定日期的日志统计结果
     * @param {string} date 日志对象关键字
     * @param {string} logStatType 日志统计范围类型
     * @returns {string} 指定日期的日志统计结果
     */
    getLogStat: function (date, logStatType) {
        var log = {};

        if (logStatType === 'custom') {
            var dateList = Tools.getObjectKeyList(Log.log, 1);
            var minDate = new Date(date);
            minDate.setDate(minDate.getDate() - Config.logStatDays + 1);
            minDate = Tools.getDateString(minDate);
            for (var k in dateList) {
                if (dateList[k] >= minDate && dateList[k] <= date) {
                    log[dateList[k]] = Log.log[dateList[k]];
                }
            }
        }
        else if (logStatType === 'all') {
            log = Log.log;
        }
        else {
            log[date] = Log.log[date];
        }

        var income = {}, expense = {}, profit = {};
        var smBoxGain = [], lootGain = [], lootItemGain = {};
        var lootCount = 0, lootAttackedCount = 0, minLootAttackedCount = -1, maxLootAttackedCount = -1,
            lootAttackKfb = 0, minLootAttackKfb = -1, maxLootAttackKfb = -1,
            lootAttackedKfb = 0, minLootAttackedKfb = -1, maxLootAttackedKfb = -1;
        var attackCount = 0, attemptAttackCount = 0, attackKfb = 0, attackExp = 0,
            strongAttackCount = 0, minStrongAttackCount = -1, maxStrongAttackCount = -1, deadlyAttackCount = 0;
        for (var d in log) {
            $.each(log[d], function (index, key) {
                if (key.notStat || typeof key.type === 'undefined') return;
                if ($.type(key.gain) === 'object') {
                    for (var k in key.gain) {
                        if (k === 'item' || k === '夺取KFB') continue;
                        if (typeof income[k] === 'undefined') income[k] = key.gain[k];
                        else income[k] += key.gain[k];
                    }
                    if (key.type === '领取争夺奖励') {
                        if (typeof key.gain['KFB'] !== 'undefined')lootGain.push(key.gain['KFB']);

                        var matches = /`(\d+)`次攻击/.exec(key.action);
                        if (matches && $.type(key.pay) === 'object' && typeof key.gain['夺取KFB'] !== 'undefined' && typeof key.pay['夺取KFB'] !== 'undefined') {
                            lootCount++;
                            var count = parseInt(matches[1]);
                            lootAttackedCount += count;
                            if (minLootAttackedCount < 0 || count < minLootAttackedCount) minLootAttackedCount = count;
                            if (count > maxLootAttackedCount) maxLootAttackedCount = count;
                            var kfb = parseInt(key.gain['夺取KFB']);
                            lootAttackKfb += kfb;
                            if (minLootAttackKfb < 0 || kfb < minLootAttackKfb) minLootAttackKfb = kfb;
                            if (kfb > maxLootAttackKfb) maxLootAttackKfb = kfb;
                            var kfb = Math.abs(parseInt(key.pay['夺取KFB']));
                            lootAttackedKfb += kfb;
                            if (minLootAttackedKfb < 0 || kfb < minLootAttackedKfb) minLootAttackedKfb = kfb;
                            if (kfb > maxLootAttackedKfb) maxLootAttackedKfb = kfb;
                        }
                    }
                    else if ((key.type === '批量攻击' || key.type === '试探攻击')) {
                        var matches = /`(\d+)`次/.exec(key.action);
                        if (matches) {
                            if (key.type === '试探攻击') attemptAttackCount++;
                            if (typeof key.gain['夺取KFB'] !== 'undefined') attackKfb += parseInt(key.gain['夺取KFB']);
                            if (typeof key.gain['经验值'] !== 'undefined') attackExp += parseInt(key.gain['经验值']);
                            attackCount += parseInt(matches[1]);
                            matches = /暴击`\+(\d+)`/.exec(key.action);
                            if (matches) {
                                var count = parseInt(matches[1]);
                                strongAttackCount += count;
                                if (key.type === '批量攻击') {
                                    if (minStrongAttackCount < 0 || count < minStrongAttackCount) minStrongAttackCount = count;
                                    if (count > maxStrongAttackCount) maxStrongAttackCount = count;
                                }
                            }
                            matches = /致命一击`\+(\d+)`/.exec(key.action);
                            if (matches) deadlyAttackCount += parseInt(matches[1]);
                        }

                        if ($.type(key.gain['item']) === 'object') {
                            for (var itemName in key.gain['item']) {
                                var num = parseInt(key.gain['item'][itemName]);
                                if (typeof lootItemGain[itemName] === 'undefined') lootItemGain[itemName] = num;
                                else lootItemGain[itemName] += num;
                            }
                        }
                    }
                    else if (key.type === '抽取神秘盒子' && typeof key.gain['KFB'] !== 'undefined') {
                        smBoxGain.push(key.gain['KFB']);
                    }
                }
                if ($.type(key.pay) === 'object') {
                    for (var k in key.pay) {
                        if (k === 'item' || k === '夺取KFB') continue;
                        if (typeof expense[k] === 'undefined') expense[k] = key.pay[k];
                        else expense[k] += key.pay[k];
                    }
                }
            });
        }

        /**
         * 为统计项目排序
         * @param {{}} obj 统计结果列表
         * @returns {string[]} 经过排序项目列表
         */
        var sortStatItemList = function (obj) {
            var sortTypeList = ['KFB', '经验值', '能量', 'VIP小时', '贡献', '神秘', '燃烧伤害', '命中', '闪避', '暴击比例', '暴击几率',
                '防御', '道具', '已使用道具', '有效道具', '无效道具', '卡片'];
            var list = Tools.getObjectKeyList(obj, 0);
            list.sort(function (a, b) {
                return $.inArray(a, sortTypeList) > $.inArray(b, sortTypeList);
            });
            return list;
        };

        var content = '';
        content += '<strong>收获：</strong>';
        $.each(sortStatItemList(income), function (index, key) {
            profit[key] = income[key];
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', key).replace('{1}', income[key].toLocaleString());
        });
        content += '<br /><strong>付出：</strong>';
        $.each(sortStatItemList(expense), function (index, key) {
            if (typeof profit[key] === 'undefined') profit[key] = expense[key];
            else profit[key] += expense[key];
            content += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', key).replace('{1}', expense[key].toLocaleString());
        });
        content += '<br /><strong>结余：</strong>';
        $.each(sortStatItemList(profit), function (index, key) {
            content += '<i>{0}{1}</i> '.replace('{0}', key).replace('{1}', Tools.getStatFormatNumber(profit[key]));
        });

        content += '<div style="margin:5px 0;border-bottom:1px dashed #CCCCFF"></div>';
        if (Config.autoDrawSmbox2Enabled) {
            var smBoxIncome = 0, minSmBox = 0, maxSmBox = 0;
            $.each(smBoxGain, function (index, kfb) {
                smBoxIncome += kfb;
                if (index === 0) minSmBox = kfb;
                if (minSmBox > kfb) minSmBox = kfb;
                if (maxSmBox < kfb) maxSmBox = kfb;
            });
            content += ('\n<strong>神秘盒子KFB收获：</strong><i>抽取次数<em>+{0}</em></i> <i>合计<em>+{1}</em></i> <i>平均值<em>+{2}</em></i> ' +
            '<i>最小值<em>+{3}</em></i> <i>最大值<em>+{4}</em></i>')
                .replace('{0}', smBoxGain.length.toLocaleString())
                .replace('{1}', smBoxIncome.toLocaleString())
                .replace('{2}', smBoxGain.length > 0 ? Tools.getFixedNumberLocaleString(smBoxIncome / smBoxGain.length, 2) : 0)
                .replace('{3}', minSmBox.toLocaleString())
                .replace('{4}', maxSmBox.toLocaleString());
        }
        else {
            var lootIncome = 0, minLoot = 0, maxLoot = 0;
            $.each(lootGain, function (index, kfb) {
                lootIncome += kfb;
                if (index === 0) minLoot = kfb;
                if (minLoot > kfb) minLoot = kfb;
                if (maxLoot < kfb) maxLoot = kfb;
            });
            content += ('\n<strong>争夺KFB收获：</strong><i>回合数<em>+{0}</em></i> <i>合计<em>+{1}</em></i> <i>平均值<em>+{2}</em></i> ' +
            '<i>最小值<em>+{3}</em></i> <i>最大值<em>+{4}</em></i>')
                .replace('{0}', lootGain.length.toLocaleString())
                .replace('{1}', lootIncome.toLocaleString())
                .replace('{2}', lootGain.length > 0 ? Tools.getFixedNumberLocaleString(lootIncome / lootGain.length, 2) : 0)
                .replace('{3}', minLoot.toLocaleString())
                .replace('{4}', maxLoot.toLocaleString());

            if (Config.autoLootEnabled) {
                content += ('<br /><strong>争夺详情统计：</strong><i class="pd_custom_tips" title="只有至少连续两次记录的争夺才会被统计">回合数<em>+{0}</em></i> ' +
                '<i>被攻击次数<em>+{1}</em><span class="pd_stat_extra">(<em title="平均值">+{2}</em>|<em title="最小值">+{3}</em>|<em title="最大值">+{4}</em>)</span></i> ' +
                '<i>夺取KFB<em>+{5}</em><span class="pd_stat_extra">(<em title="平均值">+{6}</em>|<em title="最小值">+{7}</em>|<em title="最大值">+{8}</em>)</span></i> ' +
                '<i>夺取KFB<ins>-{9}</ins><span class="pd_stat_extra">(<ins title="平均值">-{10}</ins>|<ins title="最小值">-{11}</ins>|<ins title="最大值">-{12}</ins>)</span></i> ')
                    .replace('{0}', lootCount.toLocaleString())
                    .replace('{1}', lootAttackedCount.toLocaleString())
                    .replace('{2}', lootCount > 0 ? Tools.getFixedNumberLocaleString(lootAttackedCount / lootCount, 2) : 0)
                    .replace('{3}', minLootAttackedCount > 0 ? minLootAttackedCount.toLocaleString() : 0)
                    .replace('{4}', maxLootAttackedCount > 0 ? maxLootAttackedCount.toLocaleString() : 0)
                    .replace('{5}', lootAttackKfb.toLocaleString())
                    .replace('{6}', lootCount > 0 ? Tools.getFixedNumberLocaleString(lootAttackKfb / lootCount, 2) : 0)
                    .replace('{7}', minLootAttackKfb > 0 ? minLootAttackKfb.toLocaleString() : 0)
                    .replace('{8}', maxLootAttackKfb > 0 ? maxLootAttackKfb.toLocaleString() : 0)
                    .replace('{9}', lootAttackedKfb.toLocaleString())
                    .replace('{10}', lootCount > 0 ? Tools.getFixedNumberLocaleString(lootAttackedKfb / lootCount, 2) : 0)
                    .replace('{11}', minLootAttackedKfb > 0 ? minLootAttackedKfb.toLocaleString() : 0)
                    .replace('{12}', maxLootAttackedKfb > 0 ? maxLootAttackedKfb.toLocaleString() : 0);
            }

            content += ('<br /><strong>攻击详情统计：</strong>' +
            '<i>攻击次数<em>+{0}</em><span class="pd_stat_extra">(<em title="试探攻击次数">+{1}</em>)</span></i> <i>夺取KFB<em>+{2}</em></i> <i>经验值<em>+{3}</em></i> ' +
            '<i>暴击次数<em>+{4}</em><span class="pd_stat_extra">(<em title="暴击几率">{5}%</em>|<em title="最小值（批量攻击）">+{6}</em>|' +
            '<em title="最大值（批量攻击）">+{7}</em>)</span></i> <i>致命一击次数<em>+{8}</em></i>')
                .replace('{0}', attackCount.toLocaleString())
                .replace('{1}', attemptAttackCount.toLocaleString())
                .replace('{2}', attackKfb.toLocaleString())
                .replace('{3}', attackExp.toLocaleString())
                .replace('{4}', strongAttackCount.toLocaleString())
                .replace('{5}', attackCount > 0 ? (strongAttackCount / attackCount * 100).toFixed(2) : 0)
                .replace('{6}', minStrongAttackCount > 0 ? minStrongAttackCount.toLocaleString() : 0)
                .replace('{7}', maxStrongAttackCount > 0 ? maxStrongAttackCount.toLocaleString() : 0)
                .replace('{8}', deadlyAttackCount.toLocaleString());

            var lootItemGainContent = '';
            var lootItemGainKeyList = Tools.getObjectKeyList(lootItemGain, 0);
            lootItemGainKeyList.sort(function (a, b) {
                return Item.getItemLevelByItemName(a) > Item.getItemLevelByItemName(b);
            });
            var lootItemGainTotalNum = 0;
            $.each(lootItemGainKeyList, function (index, key) {
                lootItemGainTotalNum += lootItemGain[key];
                lootItemGainContent += '<i>{0}<em>+{1}</em></i> '.replace('{0}', key).replace('{1}', lootItemGain[key]);
            });
            content += '<br /><strong>争夺道具收获：</strong><i>道具<em>+{0}</em></i> {1}'.replace('{0}', lootItemGainTotalNum).replace('{1}', lootItemGainContent);
        }

        return content;
    },

    /**
     * 显示导入或导出日志对话框
     */
    showImportOrExportLogDialog: function () {
        if ($('#pd_im_or_ex_log').length > 0) return;
        Log.read();
        var html =
            '<div class="pd_cfg_main">' +
            '  <div>' +
            '    <strong>导入日志：</strong>将日志内容粘贴到文本框中并点击保存按钮即可<br />' +
            '    <strong>导出日志：</strong>复制文本框里的内容并粘贴到文本文件里即可' +
            '  </div>' +
            '  <textarea id="pd_log_setting" style="width:600px;height:200px;word-break:break-all"></textarea>' +
            '  <div style="margin-top:10px">' +
            '    <strong>导出日志文本</strong>：复制文本框里的内容并粘贴到文本文件里即可<br />' +
            '    <div>' +
            '      <label title="按时间顺序排序"><input type="radio" name="pd_log_sort_type_2" value="time" checked="checked" />按时间</label>' +
            '      <label title="按日志类别排序"><input type="radio" name="pd_log_sort_type_2" value="type" />按类别</label>' +
            '      <label title="在日志文本里显示每日以及全部数据的统计结果"><input type="checkbox" id="pd_log_show_stat" checked="checked" />显示统计</label>' +
            '    </div>' +
            '  </div>' +
            '  <textarea id="pd_log_text" style="width:600px;height:270px" readonly="readonly"></textarea>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button>保存</button><button>取消</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_log', '导入或导出日志', html);
        $dialog.find('input[name="pd_log_sort_type_2"], #pd_log_show_stat').click(function () {
            Log.showLogText();
        }).end().find('.pd_cfg_btns > button:first').click(function (e) {
            e.preventDefault();
            if (!window.confirm('是否导入文本框中的日志？')) return;
            var log = $.trim($('#pd_log_setting').val());
            if (!log) return;
            try {
                log = JSON.parse(log);
            }
            catch (ex) {
                alert('日志有错误');
                return;
            }
            if (!log || $.type(log) !== 'object') {
                alert('日志有错误');
                return;
            }
            Log.log = log;
            Log.write();
            alert('日志已导入');
            location.reload();
        }).next('button').click(function () {
            return Dialog.close('pd_im_or_ex_log');
        });
        Dialog.show('pd_im_or_ex_log');
        $('#pd_log_setting').val(JSON.stringify(Log.log)).select();
        $('input[name="pd_log_sort_type_2"][value="{0}"]'.replace('{0}', Config.logSortType)).prop('checked', true).click();
    },

    /**
     * 显示日志文本
     */
    showLogText: function () {
        var logSortType = $('input[name="pd_log_sort_type_2"]:checked').val();
        var isShowStat = $('#pd_log_show_stat').prop('checked');
        var content = '', lastDate = '';
        for (var date in Log.log) {
            if ($.type(Log.log[date]) !== 'array') continue;
            if (lastDate > date) lastDate = date;
            content +=
                '【{0}】(共{1}项)\n{2}'
                    .replace('{0}', date)
                    .replace('{1}', Log.log[date].length)
                    .replace('{2}', logSortType === 'type' ? '' : '\n') +
                Log.getLogContent(date, logSortType)
                    .replace(/<h3>/g, '\n')
                    .replace(/<\/h3>/g, '\n')
                    .replace(/<\/p>/g, '\n')
                    .replace(/(<.+?>|<\/.+?>)/g, '')
                    .replace(/`/g, '');
            if (isShowStat) {
                content +=
                    '----------------------------------------------\n' +
                    '合计：\n' +
                    Log.getLogStat(date, 'cur')
                        .replace(/<br \/>/g, '\n')
                        .replace(/(<.+?>|<\/.+?>)/g, '') +
                    '\n';
            }
            content += '==============================================\n';
        }
        if (content && isShowStat) {
            content +=
                '\n总计：\n' +
                Log.getLogStat(lastDate, 'all')
                    .replace(/<br \/>/g, '\n')
                    .replace(/(<.+?>|<\/.+?>)/g, '');
        }
        $('#pd_log_text').val(content);
    }
};
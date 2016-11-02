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
        Func.run('Log.show_before_');
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
            if (confirm('是否清除所有日志？')) {
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

        if ($(window).height() <= 750) $dialog.find('#pd_log_content').css('height', '216px');
        Dialog.show('pd_log');
        $dialog.find('input:first').focus();
        Func.run('Log.show_after_');
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
        var validItemNum = 0, highValidItemNum = 0, validItemStat = {}, invalidItemNum = 0, highInvalidItemNum = 0, invalidItemStat = {};
        var buyItemTotalNum = 0, buyItemTotalPrice = 0, totalBuyItemPricePercent = 0, minBuyItemPricePercent = 0,
            maxBuyItemPricePercent = 0, buyItemStat = {};
        var invalidKeyList = ['item', '夺取KFB', 'VIP小时', '神秘', '燃烧伤害', '命中', '闪避', '暴击比例', '暴击几率', '防御', '有效道具', '无效道具'];
        for (var d in log) {
            $.each(log[d], function (index, key) {
                if (key.notStat || typeof key.type === 'undefined') return;
                if ($.type(key.gain) === 'object') {
                    for (var k in key.gain) {
                        if ($.inArray(k, invalidKeyList) > -1) continue;
                        if (typeof income[k] === 'undefined') income[k] = key.gain[k];
                        else income[k] += key.gain[k];
                    }
                }
                if ($.type(key.pay) === 'object') {
                    for (var k in key.pay) {
                        if ($.inArray(k, invalidKeyList) > -1) continue;
                        if (typeof expense[k] === 'undefined') expense[k] = key.pay[k];
                        else expense[k] += key.pay[k];
                    }
                }
                if ((key.type === '使用道具' || key.type === '循环使用道具') && $.type(key.gain) === 'object') {
                    var matches = /【`Lv.(\d+)：(.+?)`】/.exec(key.action);
                    if (matches) {
                        var itemLevel = parseInt(matches[1]);
                        var itemName = matches[2];
                        if (key.gain['有效道具'] > 0) {
                            validItemNum += key.gain['有效道具'];
                            if (itemLevel >= 3) highValidItemNum += key.gain['有效道具'];
                            if (typeof validItemStat[itemName] === 'undefined') validItemStat[itemName] = 0;
                            validItemStat[itemName] += key.gain['有效道具'];
                        }
                        if (key.gain['无效道具'] > 0) {
                            invalidItemNum += key.gain['无效道具'];
                            if (itemLevel >= 3) highInvalidItemNum += key.gain['无效道具'];
                            if (typeof invalidItemStat[itemName] === 'undefined') invalidItemStat[itemName] = 0;
                            invalidItemStat[itemName] += key.gain['无效道具'];
                        }
                    }
                }
                else if (key.type === '统计道具购买价格' && $.type(key.pay) === 'object' && typeof key.pay['KFB'] !== 'undefined') {
                    var matches = /共有`(\d+)`个【`Lv.\d+：(.+?)`】道具统计成功，总计价格：`[^`]+?`，平均价格：`[^`]+?`\(`(\d+)%`\)，最低价格：`[^`]+?`\(`(\d+)%`\)，最高价格：`[^`]+?`\(`(\d+)%`\)/.exec(key.action);
                    if (matches) {
                        var itemNum = parseInt(matches[1]);
                        var itemName = matches[2];
                        if (typeof buyItemStat[itemName] === 'undefined') {
                            buyItemStat[itemName] = {
                                '道具数量': 0,
                                '总计价格': 0,
                                '总计价格比例': 0,
                                '最低价格比例': 0,
                                '最高价格比例': 0
                            };
                        }
                        buyItemTotalNum += itemNum;
                        buyItemStat[itemName]['道具数量'] += itemNum;
                        buyItemTotalPrice += Math.abs(key.pay['KFB']);
                        buyItemStat[itemName]['总计价格'] += Math.abs(key.pay['KFB']);
                        totalBuyItemPricePercent += parseInt(matches[3]) * itemNum;
                        buyItemStat[itemName]['总计价格比例'] += parseInt(matches[3]) * itemNum;
                        if (minBuyItemPricePercent <= 0 || parseInt(matches[4]) < minBuyItemPricePercent) minBuyItemPricePercent = parseInt(matches[4]);
                        if (parseInt(matches[5]) > maxBuyItemPricePercent) maxBuyItemPricePercent = parseInt(matches[5]);
                        if (buyItemStat[itemName]['最低价格比例'] <= 0 || parseInt(matches[4]) < buyItemStat[itemName]['最低价格比例'])
                            buyItemStat[itemName]['最低价格比例'] = parseInt(matches[4]);
                        if (parseInt(matches[5]) > buyItemStat[itemName]['最高价格比例']) buyItemStat[itemName]['最高价格比例'] = parseInt(matches[5]);
                    }
                }
            });
        }

        var content = '';
        var sortStatTypeList = ['KFB', '经验值', '能量', '贡献', '道具', '已使用道具', '卡片'];
        content += '<strong>收获：</strong>';
        $.each(Tools.getSortedObjectKeyList(sortStatTypeList, income), function (index, key) {
            profit[key] = income[key];
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', key).replace('{1}', income[key].toLocaleString());
        });
        content += '<br /><strong>付出：</strong>';
        $.each(Tools.getSortedObjectKeyList(sortStatTypeList, expense), function (index, key) {
            if (typeof profit[key] === 'undefined') profit[key] = expense[key];
            else profit[key] += expense[key];
            content += '<i>{0}<ins>{1}</ins></i> '.replace('{0}', key).replace('{1}', expense[key].toLocaleString());
        });
        content += '<br /><strong>结余：</strong>';
        $.each(Tools.getSortedObjectKeyList(sortStatTypeList, profit), function (index, key) {
            content += '<i>{0}{1}</i> '.replace('{0}', key).replace('{1}', Tools.getStatFormatNumber(profit[key]));
        });

        content += '<div style="margin:5px 0;border-bottom:1px dashed #CCCCFF"></div>';

        var sortItemTypeList = ['零时迷子的碎片', '被遗弃的告白信', '学校天台的钥匙', 'TMA最新作压缩包', 'LOLI的钱包', '棒棒糖', '蕾米莉亚同人漫画',
            '十六夜同人漫画', '档案室钥匙', '傲娇LOLI娇蛮音CD', '整形优惠卷', '消逝之药'];
        content += '\n<strong>有效道具统计：</strong><i>有效道具<span class="pd_stat_extra"><em>+{0}</em>(<em title="3级以上有效道具">+{1}</em>)</i></span> '
            .replace('{0}', validItemNum.toLocaleString())
            .replace('{1}', highValidItemNum.toLocaleString());
        $.each(Tools.getSortedObjectKeyList(sortItemTypeList, validItemStat), function (i, itemName) {
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', validItemStat[itemName].toLocaleString());
        });
        content += '<br /><strong>无效道具统计：</strong><i>无效道具<span class="pd_stat_extra"><em>+{0}</em>(<em title="3级以上无效道具">+{1}</em>)</i></span> '
            .replace('{0}', invalidItemNum.toLocaleString())
            .replace('{1}', highInvalidItemNum.toLocaleString());
        $.each(Tools.getSortedObjectKeyList(sortItemTypeList, invalidItemStat), function (i, itemName) {
            content += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', invalidItemStat[itemName].toLocaleString());
        });

        var buyItemStatContent = '';
        var buyItemStatKeyList = Tools.getObjectKeyList(buyItemStat, 0);
        buyItemStatKeyList.sort(function (a, b) {
            return Item.getItemLevelByItemName(a) > Item.getItemLevelByItemName(b);
        });
        $.each(buyItemStatKeyList, function (index, key) {
            var item = buyItemStat[key];
            buyItemStatContent += '<i class="pd_custom_tips" title="总价：{0}，平均价格比例：{1}%，最低价格比例：{2}%，最高价格比例：{3}%">{4}<em>+{5}</em></i> '
                .replace('{0}', item['总计价格'].toLocaleString())
                .replace('{1}', item['道具数量'] > 0 ? Tools.getFixedNumberLocaleString(item['总计价格比例'] / item['道具数量'], 2) : 0)
                .replace('{2}', item['最低价格比例'])
                .replace('{3}', item['最高价格比例'])
                .replace('{4}', key)
                .replace('{5}', item['道具数量']);
        });
        content += ('<br /><strong>购买道具统计：</strong><i>道具<em>+{0}</em></i> <i>道具价格<span class="pd_stat_extra"><em title="道具总价">+{1}</em>' +
        '(<em title="平均价格比例">{2}%</em>|<em title="最低价格比例">{3}%</em>|<em title="最高价格比例">{4}%</em>)</span></i> {5}')
            .replace('{0}', buyItemTotalNum)
            .replace('{1}', buyItemTotalPrice.toLocaleString())
            .replace('{2}', buyItemTotalNum > 0 ? Tools.getFixedNumberLocaleString(totalBuyItemPricePercent / buyItemTotalNum, 2) : 0)
            .replace('{3}', minBuyItemPricePercent)
            .replace('{4}', maxBuyItemPricePercent)
            .replace('{5}', buyItemStatContent);

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
            '  <div style="margin-top:5px">' +
            '    <label style="color:#F00"><input type="radio" name="pd_im_or_ex_log_type" value="setting" checked="checked" /> 导入/导出日志</label>' +
            '    <label style="color:#00F"><input type="radio" name="pd_im_or_ex_log_type" value="text" /> 导出日志文本</label>' +
            '  </div>' +
            '  <div id="pd_im_or_ex_log_setting">' +
            '    <strong>导入日志：</strong>将日志内容粘贴到文本框中并点击合并或覆盖按钮即可<br />' +
            '    <strong>导出日志：</strong>复制文本框里的内容并粘贴到文本文件里即可<br />' +
            '    <textarea id="pd_log_setting" style="width:600px;height:400px;word-break:break-all"></textarea>' +
            '  </div>' +
            '  <div id="pd_im_or_ex_log_text" style="display:none">' +
            '    <strong>导出日志文本</strong>：复制文本框里的内容并粘贴到文本文件里即可' +
            '    <div>' +
            '      <label title="按时间顺序排序"><input type="radio" name="pd_log_sort_type_2" value="time" checked="checked" />按时间</label>' +
            '      <label title="按日志类别排序"><input type="radio" name="pd_log_sort_type_2" value="type" />按类别</label>' +
            '      <label title="在日志文本里显示每日以及全部数据的统计结果"><input type="checkbox" id="pd_log_show_stat" checked="checked" />显示统计</label>' +
            '    </div>' +
            '    <textarea id="pd_log_text" style="width:600px;height:400px" readonly="readonly"></textarea>' +
            '  </div>' +
            '</div>' +
            '<div class="pd_cfg_btns">' +
            '  <button data-action="merge">合并日志</button><button data-action="overwrite" style="color:#F00">覆盖日志</button><button>关闭</button>' +
            '</div>';
        var $dialog = Dialog.create('pd_im_or_ex_log', '导入或导出日志', html);
        $dialog.find('input[name="pd_log_sort_type_2"], #pd_log_show_stat').click(function () {
            Log.showLogText();
            $('#pd_log_text').select();
        }).end().find('input[name="pd_im_or_ex_log_type"]').click(function () {
            var type = $(this).val();
            $('#pd_im_or_ex_log_' + (type === 'text' ? 'setting' : 'text')).hide();
            $('#pd_im_or_ex_log_' + (type === 'text' ? 'text' : 'setting')).show();
            $('#pd_log_' + (type === 'text' ? 'text' : 'setting')).select();
        }).end().find('.pd_cfg_btns > button').click(function (e) {
            e.preventDefault();
            var action = $(this).data('action');
            if (action === 'merge' || action === 'overwrite') {
                if (!confirm('是否将文本框中的日志{0}到本地日志？'.replace('{0}', action === 'overwrite' ? '覆盖' : '合并'))) return;
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
                if (action === 'merge') log = Log.getMergeLog(Log.log, log);
                Log.log = log;
                Log.write();
                alert('日志已导入');
                location.reload();
            }
            else {
                return Dialog.close('pd_im_or_ex_log');
            }
        });
        Dialog.show('pd_im_or_ex_log');
        $('#pd_log_setting').val(JSON.stringify(Log.log)).select();
        $('input[name="pd_log_sort_type_2"][value="{0}"]'.replace('{0}', Config.logSortType)).prop('checked', true).triggerHandler('click');
        Func.run('Log.showImportOrExportLogDialog_after_');
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
                        .replace(/<br\s*\/?>/g, '\n')
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
    },

    /**
     * 获取合并后的日志
     * @param {{}} log 当前日志
     * @param {{}} newLog 新日志
     * @returns {{}} 合并后的日志
     */
    getMergeLog: function (log, newLog) {
        /**
         * 获取指定日志项目在指定日志项目列表中的索引号
         * @param {{}} item 指定日志项目
         * @param {[]} list 指定日志项目列表
         * @returns {number} 指定日志项目在列表中的索引号，-1表示不在该列表中
         */
        var inArray = function (item, list) {
            for (var i = 0; i < list.length; i++) {
                if (item['time'] === list[i]['time'] && item['type'] === list[i]['type']) return i;
            }
            return -1;
        };

        for (var date in newLog) {
            if ($.type(log[date]) !== 'array') {
                log[date] = newLog[date];
            }
            else {
                for (var i = 0; i < newLog[date].length; i++) {
                    if ($.type(newLog[date][i].time) !== 'number' || $.type(newLog[date][i].type) !== 'string') continue;
                    var index = inArray(newLog[date][i], log[date]);
                    if (index > -1) log[date][index] = newLog[date][i];
                    else log[date].push(newLog[date][i]);
                }
                log[date].sort(function (a, b) {
                    return a.time > b.time;
                });
            }
        }
        return log;
    }
};
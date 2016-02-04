/**
 * 争夺类
 */
var Loot = {
    /**
     * 领取争夺奖励
     * @param {boolean} [isAutoDonation=false] 是否自动捐款
     * @param {boolean} [isAutoSaveCurrentDeposit=false] 是否自动活期存款
     */
    getLootAward: function (isAutoDonation, isAutoSaveCurrentDeposit) {
        if (Config.noAutoLootWhen.length > 0) {
            var now = new Date();
            for (var i in Config.noAutoLootWhen) {
                if (Tools.isBetweenInTimeRange(now, Config.noAutoLootWhen[i])) {
                    if (isAutoDonation) KFOL.donation();
                    return;
                }
            }
        }

        /**
         * 自动攻击
         * @param {string} safeId 用户的SafeID
         * @param {number} deadlyAttackNum 致命一击的攻击次数
         */
        var autoAttack = function (safeId, deadlyAttackNum) {
            if (Config.autoAttackEnabled && !$.isEmptyObject(Config.batchAttackList) && safeId) {
                if (Loot.isAutoAttackNow()) {
                    Tools.setCookie(Const.autoAttackReadyCookieName, '1|' + safeId);
                    Loot.autoAttack(safeId, deadlyAttackNum);
                }
                else {
                    Tools.setCookie(Const.autoAttackReadyCookieName, '2|' + safeId, Tools.getDate('+' + Const.defLootInterval + 'm'));
                }
            }
        };

        console.log('领取争夺奖励Start');
        $.get('kf_fw_ig_index.php', function (html) {
            var matches = /<INPUT name="submit1" type="submit" value="(.+?)"/i.exec(html);
            if (!matches) {
                Tools.setCookie(Const.getLootAwardCookieName, 1, Tools.getDate('+' + Const.defLootInterval + 'm'));
                return;
            }

            var safeIdMatches = /<a href="kf_fw_card_pk\.php\?safeid=(\w+)">/i.exec(html);
            var safeId = '';
            if (safeIdMatches) safeId = safeIdMatches[1];

            var deadlyAttackNum = 0;
            if (Config.deadlyAttackId > 0) {
                var deadlyAttackMatches = /致命一击剩余攻击次数\s*(\d+)\s*次/i.exec(html);
                if (deadlyAttackMatches) deadlyAttackNum = parseInt(deadlyAttackMatches[1]);
                if (deadlyAttackNum > Const.maxAttackNum) deadlyAttackNum = Const.maxAttackNum;
            }

            var remainingMatches = /还有(\d+)(分钟|小时)领取/i.exec(matches[1]);
            if (remainingMatches) {
                var lootInterval = parseInt(remainingMatches[1]);
                if (remainingMatches[2] === '小时') lootInterval = lootInterval * 60;
                lootInterval++;
                if (!Loot.getNextLootAwardTime().type) {
                    var nextTime = Tools.getDate('+' + lootInterval + 'm');
                    Tools.setCookie(Const.getLootAwardCookieName,
                        '{0}|{1}'.replace('{0}', remainingMatches[2] === '小时' ? 1 : 2).replace('{1}', nextTime.getTime()),
                        nextTime
                    );
                    if (Config.attemptAttackEnabled) {
                        var nextCheckInterval = Const.firstCheckLifeInterval - (Const.defLootInterval - lootInterval);
                        if (nextCheckInterval <= 0) nextCheckInterval = 1;
                        var nextCheckTime = Tools.getDate('+' + nextCheckInterval + 'm');
                        Tools.setCookie(Const.checkLifeCookieName, nextCheckTime.getTime(), nextCheckTime);
                        Tools.setCookie(Const.attackCountCookieName, 0, Tools.getDate('+' + Const.defLootInterval + 'm'));
                    }
                    var attackedCountMatches = /总计被争夺\s*(\d+)\s*次<br/i.exec(html);
                    if (attackedCountMatches) {
                        var timeDiff = Const.defLootInterval - lootInterval;
                        if (timeDiff > 0 && timeDiff <= 3 * 60) {
                            TmpLog.setValue(Const.attackedCountTmpLogName, {
                                time: Tools.getDate('-' + timeDiff + 'm').getTime(),
                                count: parseInt(attackedCountMatches[1])
                            });
                        }
                    }
                }
                var attackNumMatches = />本回合剩余攻击次数\s*(\d+)\s*次<\/span><br/.exec(html);
                if (attackNumMatches && parseInt(attackNumMatches[1]) > 0) {
                    autoAttack(safeId, deadlyAttackNum);
                }
                if (isAutoDonation) KFOL.donation();
            }
            else if (/(点击这里预领KFB|已经可以领取KFB)/i.test(matches[1])) {
                if (Config.deferLootTimeWhenRemainAttackNumEnabled) {
                    var remainAttackNumMatches = /本回合剩余攻击次数\s*(\d+)\s*次/.exec(html);
                    var remainAttackNum = 0;
                    if (remainAttackNumMatches) remainAttackNum = parseInt(remainAttackNumMatches[1]);
                    if (remainAttackNum >= Config.deferLootTimeWhenRemainAttackNum && !Tools.getCookie(Const.drawSmboxCookieName)) {
                        console.log('检测到本回合剩余攻击次数还有{0}次，抽取神秘盒子以延长争夺时间'.replace('{0}', remainAttackNum));
                        KFOL.drawSmbox();
                        if (isAutoDonation) KFOL.donation();
                        return;
                    }
                }

                var gainMatches = /当前拥有\s*<span style=".+?">(\d+)<\/span>\s*预领KFB<br \/>/i.exec(html);
                var gain = 0;
                if (gainMatches) gain = parseInt(gainMatches[1]);

                var attackLogList = Loot.getMonsterAttackLogList(html);

                var attackedCountMatches = /总计被争夺\s*(\d+)\s*次<br/i.exec(html);
                var attackedCount = -1;
                if (attackedCountMatches) attackedCount = parseInt(attackedCountMatches[1]);

                $.post('kf_fw_ig_index.php',
                    {submit1: 1, one: 1},
                    function (html) {
                        var nextTime = Tools.getDate('+' + Const.defLootInterval + 'm');
                        Tools.setCookie(Const.getLootAwardCookieName, '2|' + nextTime.getTime(), nextTime);
                        if (Config.attemptAttackEnabled) {
                            var nextCheckTime = Tools.getDate('+' + Const.firstCheckLifeInterval + 'm');
                            Tools.setCookie(Const.checkLifeCookieName, nextCheckTime.getTime(), nextCheckTime);
                            Tools.setCookie(Const.attackCountCookieName, 0, Tools.getDate('+' + Const.defLootInterval + 'm'));
                        }
                        KFOL.showFormatLog('领取争夺奖励', html);
                        if (/(领取成功！|已经预领\d+KFB)/i.test(html)) {
                            var attackedCountDiff = 0;
                            if (attackedCount > -1) {
                                var now = (new Date()).getTime();
                                var attackedCountInfo = TmpLog.getValue(Const.attackedCountTmpLogName);
                                if (attackedCountInfo && $.type(attackedCountInfo) === 'object' && $.type(attackedCountInfo.time) === 'number' &&
                                    $.type(attackedCountInfo.count) === 'number' && attackedCountInfo.time > 0 && attackedCountInfo.count >= 0) {
                                    attackedCountDiff = attackedCount - attackedCountInfo.count;
                                    if (now - attackedCountInfo.time <= 0) attackedCountDiff = 0;
                                    else if (now - attackedCountInfo.time >= Const.defLootInterval * 60 * 1000 * 2 && attackedCountDiff >= 20)
                                        attackedCountDiff = 0;
                                }
                                TmpLog.setValue(Const.attackedCountTmpLogName, {time: now, count: attackedCount});
                            }
                            if (/已经预领\d+KFB/i.test(html)) {
                                gain = 0;
                            }
                            else {
                                Log.push('领取争夺奖励',
                                    '领取争夺奖励{0}'.replace('{0}', attackedCountDiff > 0 ? '(共受到`{0}`次攻击)'.replace('{0}', attackedCountDiff) : ''),
                                    {gain: {'KFB': gain}}
                                );
                            }
                            console.log('领取争夺奖励{0}，KFB+{1}'
                                .replace('{0}', attackedCountDiff > 0 ? '(共受到{0}次攻击)'.replace('{0}', attackedCountDiff) : '')
                                .replace('{1}', gain)
                            );
                            var $msg = KFOL.showMsg('<strong>领取争夺奖励{0}</strong><i>KFB<em>+{1}</em></i>{2}{3}'
                                .replace('{0}', attackedCountDiff > 0 ? ' (共受到<em>{0}</em>次攻击)'.replace('{0}', attackedCountDiff) : '')
                                .replace('{1}', gain)
                                .replace('{2}', attackLogList.length > 0 ? '<a href="#">查看日志</a>' : '')
                                .replace('{3}', !Config.autoAttackEnabled ? '<a target="_blank" href="kf_fw_ig_pklist.php">手动攻击</a>' : '')
                            );
                            $msg.find('a[href="#"]:first').click(function (e) {
                                e.preventDefault();
                                Loot.showAttackLogDialog(2, attackLogList);
                            });
                            autoAttack(safeId, deadlyAttackNum);
                            if (isAutoDonation) KFOL.donation();
                            if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit(true);
                        }
                    }, 'html');
            }
            else {
                Tools.setCookie(Const.getLootAwardCookieName, 1, Tools.getDate('+' + Const.defLootInterval + 'm'));
                if (isAutoDonation) KFOL.donation();
            }
        }, 'html');
    },

    /**
     * 自动攻击
     * @param {string} safeId 用户的SafeID
     * @param {number} [deadlyAttackNum=-1] 致命一击的攻击次数（-1表示自动检查致命一击的剩余次数）
     */
    autoAttack: function (safeId, deadlyAttackNum) {
        var $remainingTips = $('#pd_remaining_num').closest('.pd_pop_tips');
        if ($remainingTips.length > 0 && !$remainingTips.data('retry')) {
            Tools.setCookie(Const.autoAttackingCookieName, 1, Tools.getDate('+' + Const.checkAutoAttackingInterval + 'm'));
            $remainingTips.data('retry', 1);
            return;
        }
        KFOL.removePopTips($remainingTips);

        /**
         * 攻击
         * @param {number} [deadlyAttackId=0] 致命一击的攻击目标ID
         * @param {number} [deadlyAttackNum=0] 致命一击的攻击次数
         */
        var attack = function (deadlyAttackId, deadlyAttackNum) {
            if (!deadlyAttackId) deadlyAttackId = 0;
            if (!deadlyAttackNum) deadlyAttackNum = 0;
            var attackList = {};
            if (deadlyAttackNum > 0) attackList['0' + deadlyAttackId] = deadlyAttackNum;
            if (Config.attemptAttackEnabled) {
                var attackCount = parseInt(Tools.getCookie(Const.attackCountCookieName));
                if (isNaN(attackCount) || attackCount < 0) attackCount = 0;
                var num = 0;
                for (var id in Config.batchAttackList) {
                    for (var i = 1; i <= Config.batchAttackList[id]; i++) {
                        num++;
                        if (num > Const.maxAttackNum - deadlyAttackNum) break;
                        if (num > attackCount) {
                            if (typeof attackList['0' + id] === 'undefined') attackList['0' + id] = 1;
                            else attackList['0' + id]++;
                        }
                    }
                }
            }
            else if (deadlyAttackNum > 0) {
                var num = 0;
                for (var id in Config.batchAttackList) {
                    for (var i = 1; i <= Config.batchAttackList[id]; i++) {
                        num++;
                        if (num > Const.maxAttackNum - deadlyAttackNum) break;
                        if (typeof attackList['0' + id] === 'undefined') attackList['0' + id] = 1;
                        else attackList['0' + id]++;
                    }
                }
            }
            if ($.isEmptyObject(attackList)) attackList = Config.batchAttackList;
            var totalAttackNum = 0;
            for (var id in attackList) {
                totalAttackNum += attackList[id];
            }
            if (!totalAttackNum) return;
            Tools.setCookie(Const.autoAttackingCookieName, 1, Tools.getDate('+' + Const.checkAutoAttackingInterval + 'm'));
            KFOL.showWaitMsg(
                ('<strong>正在批量攻击中，请耐心等待...</strong><i>攻击次数：<em id="pd_remaining_num">{0}</em></i>' +
                '<a target="_blank" href="{1}">浏览其它页面</a><a class="pd_stop_action pd_highlight" href="#">停止操作</a>')
                    .replace('{0}', totalAttackNum)
                    .replace('{1}', location.href)
                , true);
            Loot.batchAttack({
                type: 2,
                totalAttackNum: totalAttackNum,
                attackList: attackList,
                safeId: safeId
            });
        };

        if (!$.isNumeric(deadlyAttackNum)) deadlyAttackNum = -1;
        if (Config.deadlyAttackId > 0) {
            if (deadlyAttackNum === -1) {
                console.log('检查致命一击剩余攻击次数Start');
                $.get('kf_fw_ig_index.php', function (html) {
                    var deadlyAttackNum = 0;
                    var matches = /致命一击剩余攻击次数\s*(\d+)\s*次/i.exec(html);
                    if (matches) deadlyAttackNum = parseInt(matches[1]);
                    if (deadlyAttackNum > Const.maxAttackNum) deadlyAttackNum = Const.maxAttackNum;
                    if (deadlyAttackNum > 0) attack(Config.deadlyAttackId, deadlyAttackNum);
                    else attack();
                }, 'html');
            }
            else {
                attack(Config.deadlyAttackId, deadlyAttackNum);
            }
        }
        else {
            attack();
        }
    },

    /**
     * 通过回应获取攻击收获
     * @param {string} msg 攻击回应
     * @returns {{}} 攻击收获
     */
    getGainViaMsg: function (msg) {
        var gain = {};
        var matches = /被实际夺取(\d+)KFB/i.exec(msg);
        if (matches) gain['夺取KFB'] = parseInt(matches[1]);
        matches = /被实际燃烧(\d+)KFB/i.exec(msg);
        if (matches) gain['经验值'] = parseInt(matches[1]);
        matches = /掉落道具!(.+?)$/.exec(msg);
        if (matches) {
            gain['道具'] = 1;
            var item = {};
            item[matches[1]] = 1;
            gain['item'] = item;
        }
        return gain;
    },

    /**
     * 批量攻击
     * @param {{}} options 设置项
     * @param {number} options.type 攻击类型，1：在争夺页面中进行批量攻击；2：在自动争夺中进行批量攻击；3：进行试探攻击
     * @param {number} options.totalAttackNum 总攻击次数
     * @param {{}} options.attackList 攻击目标列表
     * @param {string} options.safeId 用户的SafeID
     * @param {string} [options.life] 当前实际生命值（用于试探攻击）
     * @param {string} [options.recentMonsterAttackLog] 最近一次的被怪物攻击日志（用于试探攻击）
     */
    batchAttack: function (options) {
        var settings = {
            type: 1,
            totalAttackNum: 0,
            attackList: {},
            safeId: '',
            life: 0,
            recentMonsterAttackLog: ''
        };
        $.extend(settings, options);
        if (settings.type === 1)
            $('.kf_fw_ig1').parent().append('<div class="pd_result"><strong>攻击结果：</strong><ul></ul></div>');
        var count = 0, successNum = 0, failNum = 0, strongAttackNum = 0, criticalStrikeNum = 0;
        var gain = {'夺取KFB': 0, '经验值': 0};
        var isStop = false, isRetakeSafeId = false;
        var attackLogList = [];
        var oriHtml = '', customHtml = '';

        /**
         * 攻击指定ID的怪物
         * @param {number} id 攻击ID
         */
        var attack = function (id) {
            count++;
            $.ajax({
                type: 'POST',
                url: 'kf_fw_ig_pkhit.php',
                data: {uid: id, safeid: settings.safeId},
                success: function (msg) {
                    if (/发起争夺/.test(msg)) {
                        successNum++;
                        if (/触发暴击!/.test(msg)) strongAttackNum++;
                        if (/致命一击!/.test(msg)) criticalStrikeNum++;
                        $.each(Loot.getGainViaMsg(msg), function (key, data) {
                            if (key === 'item') {
                                if (typeof gain[key] === 'undefined') gain['item'] = {};
                                for (var k in data) {
                                    if (typeof gain['item'][k] === 'undefined') gain['item'][k] = data[k];
                                    else gain['item'][k] += data[k];
                                }
                            }
                            else {
                                if (typeof gain[key] === 'undefined') gain[key] = data;
                                else gain[key] += data;
                            }
                        });
                    }
                    else if (/每次攻击间隔\d+秒/.test(msg)) {
                        failNum++;
                        $(document).queue('BatchAttack', function () {
                            attack(id);
                        });
                    }
                    else if (/⑧2/.test(msg)) {
                        msg = 'SafeID错误（尝试重新获取SafeID）';
                        isRetakeSafeId = true;
                        failNum++;
                        $(document).queue('BatchAttack', function () {
                            attack(id);
                        });
                    }
                    else {
                        isStop = true;
                    }
                    attackLogList.push('第{0}次：{1}{2}'.replace('{0}', count).replace('{1}', msg).replace('{2}', isStop ? '（攻击已中止）' : ''));
                    if (settings.type === 3)
                        console.log('【试探攻击】{0}{1}'.replace('{0}', msg).replace('{1}', isStop ? '（攻击已中止）' : ''));
                    else
                        console.log('【批量攻击】第{0}次：{1}{2}'.replace('{0}', count).replace('{1}', msg).replace('{2}', isStop ? '（攻击已中止）' : ''));
                    if (settings.type === 1) {
                        var html = '<li><b>第{0}次：</b>{1}{2}</li>'
                            .replace('{0}', count)
                            .replace('{1}', msg)
                            .replace('{2}', isStop ? '<span class="pd_notice">（攻击已中止）</span>' : '');
                        oriHtml += html;
                        if (Config.customMonsterNameEnabled && !$.isEmptyObject(Config.customMonsterNameList)) {
                            $.each(Config.customMonsterNameList, function (id, name) {
                                var oriName = Loot.getMonsterNameById(parseInt(id));
                                html = html.replace(
                                    '对[{0}]'.replace('{0}', oriName),
                                    '对<span class="pd_custom_tips" title="{0}">[{1}]</span>'.replace('{0}', oriName).replace('{1}', name)
                                );
                            });
                            customHtml += html;
                        }
                        $('.pd_result:last > ul').append(html);
                    }

                },
                error: function () {
                    failNum++;
                    attackLogList.push('第{0}次：{1}'.replace('{0}', count).replace('{1}', '连接超时'));
                    console.log('【{0}攻击】第{1}次：{2}'.replace('{0}', settings.type === 3 ? '试探' : '批量').replace('{1}', count).replace('{2}', '连接超时'));
                    if (settings.type === 1) {
                        var html = '<li><b>第{0}次：</b>{1}</li>'
                            .replace('{0}', count)
                            .replace('{1}', '<span class="pd_notice">连接超时</span>');
                        $('.pd_result:last > ul').append(html);
                    }
                    $(document).queue('BatchAttack', function () {
                        attack(id);
                    });
                },
                complete: function () {
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(settings.totalAttackNum + failNum - count);
                    isStop = isStop || $remainingNum.closest('.pd_pop_tips').data('stop');
                    if (isStop) $(document).clearQueue('BatchAttack');

                    if (isStop || count === settings.totalAttackNum + failNum) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        if (gain['夺取KFB'] === 0) delete gain['夺取KFB'];
                        if (gain['经验值'] === 0) delete gain['经验值'];
                        if (successNum > 0) {
                            var extraLog = '';
                            if (strongAttackNum > 0) extraLog += '暴击`+{0}`'.replace('{0}', strongAttackNum);
                            if (criticalStrikeNum > 0) extraLog += (extraLog ? '，' : '') + '致命一击`+{0}`'.replace('{0}', criticalStrikeNum);
                            if (extraLog) extraLog = '(' + extraLog + ')';
                            if (settings.type === 3) Log.push('试探攻击', '成功进行了`{0}`次试探攻击'.replace('{0}', successNum) + extraLog, {gain: gain});
                            else Log.push('批量攻击', '共有`{0}`次攻击成功'.replace('{0}', successNum) + extraLog, {gain: gain});
                        }

                        var msgStat = '', logStat = '', resultStat = '';
                        for (var key in gain) {
                            if (key === 'item') {
                                msgStat += '<br />';
                                for (var itemName in gain['item']) {
                                    msgStat += '<i>{0}<em>+{1}</em></i>'.replace('{0}', itemName).replace('{1}', gain['item'][itemName]);
                                    logStat += '，{0}+{1}'.replace('{0}', itemName).replace('{1}', gain['item'][itemName]);
                                    resultStat += '<i>{0}<em>+{1}</em></i> '.replace('{0}', itemName).replace('{1}', gain['item'][itemName]);
                                }
                            }
                            else {
                                msgStat += '<i>{0}<em>+{1}</em></i>'.replace('{0}', key).replace('{1}', gain[key]);
                                logStat += '，{0}+{1}'.replace('{0}', key).replace('{1}', gain[key]);
                                resultStat += '<i>{0}<em>+{1}</em></i> '.replace('{0}', key).replace('{1}', gain[key]);
                            }
                        }
                        console.log((settings.type === 3 ? '成功进行了{0}次试探攻击'.replace('{0}', successNum) : '共有{0}次攻击成功'.replace('{0}', successNum)) + logStat);

                        var duration = Config.defShowMsgDuration;
                        if (settings.type === 1 || duration === -1) duration = -1;
                        else if (settings.type === 3 && duration > 0 && duration < 30) duration = 30;
                        else if (settings.type === 2 && duration > 0 && duration < 480) duration = 480;
                        var extraMsg = '';
                        if (strongAttackNum > 0) extraMsg += '暴击<em>+{0}</em>'.replace('{0}', strongAttackNum);
                        if (criticalStrikeNum > 0) extraMsg += (extraMsg ? ' ' : '') + '致命一击<em>+{0}</em>'.replace('{0}', criticalStrikeNum);
                        if (extraMsg) extraMsg = '（' + extraMsg + '）';
                        var $msg = KFOL.showMsg('<strong>{0}{1}</strong>{2}{3}'
                            .replace('{0}', settings.type === 3 ?
                                '成功进行了<em>{0}</em>次试探攻击'.replace('{0}', successNum)
                                : '共有<em>{0}</em>次攻击成功'.replace('{0}', successNum))
                            .replace('{1}', extraMsg)
                            .replace('{2}', msgStat)
                            .replace('{3}', settings.type >= 2 ? '<a href="#">查看日志</a>' : '')
                            , duration
                        );

                        if (isStop || settings.type === 2 || count >= Const.maxAttackNum) {
                            Tools.setCookie(Const.autoAttackingCookieName, '', Tools.getDate('-1d'));
                            Tools.setCookie(Const.autoAttackReadyCookieName, '', Tools.getDate('-1d'));
                            if (Config.attemptAttackEnabled) {
                                Tools.setCookie(Const.checkLifeCookieName, '', Tools.getDate('-1d'));
                                Tools.setCookie(Const.attackCountCookieName, '', Tools.getDate('-1d'));
                                Tools.setCookie(Const.prevAttemptAttackLogCookieName, '', Tools.getDate('-1d'));
                            }
                        }
                        else if (settings.type === 3) {
                            var attackCount = parseInt(Tools.getCookie(Const.attackCountCookieName));
                            if (isNaN(attackCount) || attackCount < 0) attackCount = 0;
                            attackCount++;
                            if (attackCount >= Const.maxAttackNum) {
                                Tools.setCookie(Const.autoAttackReadyCookieName, '', Tools.getDate('-1d'));
                                Tools.setCookie(Const.prevAttemptAttackLogCookieName, '', Tools.getDate('-1d'));
                            }
                            else {
                                Tools.setCookie(Const.attackCountCookieName, attackCount, new Date(Loot.getNextLootAwardTime().time));
                                if (options.recentMonsterAttackLog) {
                                    var thisGainKfb = 0;
                                    if (gain['夺取KFB']) thisGainKfb = gain['夺取KFB'];
                                    Tools.setCookie(Const.prevAttemptAttackLogCookieName,
                                        (thisGainKfb + options.life) + '/' + options.recentMonsterAttackLog,
                                        new Date(Loot.getNextLootAwardTime().time)
                                    );
                                }
                            }
                        }
                        if (settings.type >= 2) {
                            $msg.find('a:last').click(function (e) {
                                e.preventDefault();
                                Loot.showAttackLogDialog(1, attackLogList, resultStat);
                            });
                            if (settings.type === 2 && KFOL.isInHomePage) {
                                $('a.indbox5[href="kf_fw_ig_index.php"]').removeClass('indbox5').addClass('indbox6');
                            }
                        }
                        else {
                            var $result = $('.pd_result:last');
                            $result.append('<div class="pd_stat"><b>统计结果{0}：</b><br />{1}</div>'
                                .replace('{0}', extraMsg)
                                .replace('{1}', resultStat ? resultStat : '无')
                            );
                            if (Config.customMonsterNameEnabled && !$.isEmptyObject(Config.customMonsterNameList)) {
                                $('<label><input class="pd_input" type="radio" name="pd_custom_attack_log" value="ori" /> 原版</label>' +
                                    '<label style="margin-left:7px"><input class="pd_input" type="radio" name="pd_custom_attack_log" value="custom" checked="checked" />' +
                                    ' 自定义</label><br />')
                                    .prependTo($result)
                                    .find('input[name="pd_custom_attack_log"]')
                                    .click(function () {
                                        if ($(this).val() === 'custom') {
                                            $result.find('ul').html(customHtml);
                                        }
                                        else {
                                            $result.find('ul').html(oriHtml);
                                        }
                                    });
                            }
                        }

                        if (Config.autoUseItemEnabled && Config.autoUseItemNames.length > 0 && typeof gain['item'] !== 'undefined') {
                            var itemNameList = {};
                            for (var itemName in gain['item']) {
                                if ($.inArray(itemName, Config.autoUseItemNames) > -1) {
                                    itemNameList[itemName] = gain['item'][itemName];
                                }
                            }
                            if (!$.isEmptyObject(itemNameList)) Loot.useItemsAfterBatchAttack(itemNameList);
                        }
                    }
                    else {
                        if (isRetakeSafeId) {
                            isRetakeSafeId = false;
                            console.log('重新获取SafeID Start');
                            $.get('kf_fw_ig_index.php', function (html) {
                                var safeIdMatches = /<a href="kf_fw_card_pk\.php\?safeid=(\w+)">/i.exec(html);
                                var safeId = '';
                                if (safeIdMatches) safeId = safeIdMatches[1];
                                if (!safeId) return;
                                settings.safeId = safeId;
                                if (Tools.getCookie(Const.autoAttackReadyCookieName))
                                    Tools.setCookie(Const.autoAttackReadyCookieName, '2|' + safeId, new Date(Loot.getNextLootAwardTime().time));
                                $(document).dequeue('BatchAttack');
                            }, 'html');
                        }
                        else {
                            window.setTimeout(function () {
                                $(document).dequeue('BatchAttack');
                            }, typeof Const.perAttackInterval === 'function' ? Const.perAttackInterval() : Const.perAttackInterval);
                        }
                    }
                },
                dataType: 'html'
            });
        };

        $(document).clearQueue('BatchAttack');
        $.each(settings.attackList, function (id, num) {
            $.each(new Array(num), function () {
                $(document).queue('BatchAttack', function () {
                    attack(parseInt(id));
                });
            });
        });
        $(document).dequeue('BatchAttack');
    },

    /**
     * 添加批量攻击按钮
     */
    addBatchAttackButton: function () {
        var safeId = KFOL.getSafeId();
        if (!safeId) return;
        $('.kf_fw_ig1 > tbody > tr:gt(3) > td > a.kfigpk_hit').each(function () {
            var $this = $(this);
            var hitId = parseInt($this.attr('hitid'));
            if (!hitId) return;
            $this.parent().attr('colspan', '3')
                .after(('<td class="pd_batch_attack" style="text-align:center"><label>' +
                    '<input style="width:15px" class="pd_input" type="text" maxlength="2" data-id="{0}" value="{1}" /> 次</label></td>')
                    .replace('{0}', hitId)
                    .replace('{1}', Config.batchAttackList[hitId] ? Config.batchAttackList[hitId] : '')
                );
        });
        $('.pd_batch_attack .pd_input').keydown(function (e) {
            if (e.keyCode === 13) {
                $('.pd_item_btns > button:last-child').click();
            }
        });

        /**
         * 获取攻击列表和总次数
         * @param {{}} attackList 攻击目标列表
         * @returns {number} 攻击总次数
         */
        var getAttackNum = function (attackList) {
            var totalAttackNum = 0;
            $('.pd_batch_attack .pd_input').each(function () {
                var $this = $(this);
                var attackNum = $.trim($this.val());
                if (!attackNum) return 0;
                attackNum = parseInt(attackNum);
                if (isNaN(attackNum) || attackNum < 0) {
                    alert('攻击次数格式不正确');
                    $this.select();
                    $this.focus();
                    return 0;
                }
                attackList[parseInt($this.data('id'))] = attackNum;
                totalAttackNum += attackNum;
            });
            if ($.isEmptyObject(attackList)) return 0;
            if (totalAttackNum > Const.maxAttackNum) {
                alert('攻击次数不得超过{0}次'.replace('{0}', Const.maxAttackNum));
                return 0;
            }
            return totalAttackNum;
        };

        $('<div class="pd_item_btns"><button>保存设置</button><button>清除设置</button><button><b>批量攻击</b></button></div>')
            .insertAfter('.kf_fw_ig1')
            .find('button:first-child')
            .click(function () {
                var attackList = {};
                var totalAttackNum = getAttackNum(attackList);
                if (totalAttackNum == 0) return;
                ConfigMethod.read();
                Config.batchAttackList = attackList;
                ConfigMethod.write();
                alert('设置已保存');
            })
            .next()
            .click(function () {
                ConfigMethod.read();
                Config.batchAttackList = {};
                ConfigMethod.write();
                alert('设置已清除');
            })
            .next()
            .click(function () {
                KFOL.removePopTips($('.pd_pop_tips'));
                var attackList = {};
                var totalAttackNum = getAttackNum(attackList);
                if (!totalAttackNum) return;
                if (!window.confirm('准备进行{0}次批量攻击，是否开始攻击？'.replace('{0}', totalAttackNum))) return;
                KFOL.showWaitMsg(
                    ('<strong>正在批量攻击中，请耐心等待...</strong><i>攻击次数：<em id="pd_remaining_num">{0}</em></i>' +
                    '<a target="_blank" href="/">浏览其它页面</a><a class="pd_stop_action pd_highlight" href="#">停止操作</a>')
                        .replace('{0}', totalAttackNum)
                    , true);
                Loot.batchAttack({type: 1, totalAttackNum: totalAttackNum, attackList: attackList, safeId: safeId});
            });
    },

    /**
     * 在争夺首页进行对页面元素进行相关处理
     */
    handleInLootIndexPage: function () {
        var $btn = $('input[name="submit1"][value="已经可以领取KFB，请点击这里获取"]');
        if ($btn.length > 0) {
            if (Config.autoLootEnabled && Tools.getCookie(Const.getLootAwardCookieName)) {
                $btn.prop('disabled', true);
                Tools.setCookie(Const.getLootAwardCookieName, '', Tools.getDate('-1d'));
                Loot.getLootAward();
            }
            else {
                $('form[name="rvrc1"]').submit(function () {
                    var gain = parseInt($btn.parent('td').find('span:eq(0)').text());
                    if (!isNaN(gain) && gain >= 0) {
                        var nextTime = Tools.getDate('+' + Const.defLootInterval + 'm').getTime() + 10 * 1000;
                        Tools.setCookie(Const.getLootAwardCookieName, '2|' + nextTime, new Date(nextTime));
                        Log.push('领取争夺奖励', '领取争夺奖励', {gain: {'KFB': gain}});
                    }
                });
            }
        }

        var $submit = $('input[name="submit1"][value$="领取，点击这里抢别人的"]');
        if ($submit.length > 0) {
            (function () {
                var timeLog = Loot.getNextLootAwardTime();
                if (timeLog.type >= 1) {
                    var diff = Tools.getTimeDiffInfo(timeLog.time);
                    if (diff.hours === 0 && diff.minutes === 0 && diff.seconds === 0) return;
                    var matches = /还有(\d+)小时领取，点击这里抢别人的/.exec($submit.val());
                    if (timeLog.type === 2 && matches) {
                        if (matches) {
                            if (diff.hours !== parseInt(matches[1])) return;
                            $submit.css('width', '270px').val('还有{0}小时{1}分领取，点击这里抢别人的'.replace('{0}', diff.hours).replace('{1}', diff.minutes));
                        }
                        else {
                            if (diff.hours !== 0) return;
                        }
                    }
                    var end1 = new Date(timeLog.time);
                    var end2 = new Date(timeLog.time + 60 * 60 * 1000);
                    $submit.prev().prev().before('<span class="pd_highlight">可领取时间：{0} {1}{2}</span>'
                        .replace('{0}', Tools.getDateString(end1))
                        .replace('{1}', Tools.getTimeString(end1, ':', false))
                        .replace('{2}', timeLog.type === 1 ? '~' + Tools.getTimeString(end2, ':', false) : '')
                    );
                }
            }());
        }

        if (Tools.getCookie(Const.checkLifeCookieName)) {
            var value = Tools.getCookie(Const.prevAttemptAttackLogCookieName);
            if (value) {
                var arr = value.split('/');
                if (arr.length === 2 && !isNaN(parseInt(arr[0]))) {
                    var realLife = parseInt(arr[0]);
                    var prevMonsterAttackLog = $.trim(arr[1]);
                    var recentMonsterAttackLogTime = '';
                    var attackLogMatches = />(\d+:\d+:\d+)\s*\|/.exec($('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:first-child').html());
                    if (attackLogMatches) recentMonsterAttackLogTime = attackLogMatches[1];

                    var $lifeNode = $('.kf_fw_ig1 > tbody > tr:nth-child(2) > td:first-child');
                    var text = $lifeNode.text();
                    var life = 0, minLife = 0;
                    var lifeMatches = /当前拥有\s*(\d+)\s*预领KFB/i.exec(text);
                    if (lifeMatches) life = parseInt(lifeMatches[1]);
                    var minLifeMatches = /则你可以领取(\d+)KFB\)/i.exec(text);
                    if (minLifeMatches) minLife = parseInt(minLifeMatches[1]);
                    if (minLife > 0 && life === minLife && recentMonsterAttackLogTime && prevMonsterAttackLog.indexOf(recentMonsterAttackLogTime) === 0) {
                        $lifeNode.find('br:first').before(
                            '<span class="pd_custom_tips" style="color:#339933" title="当前实际生命值（在少数情况下可能会不准确）"> (生命值：<b>{0}</b>)</span>'
                                .replace('{0}', realLife)
                        );
                    }
                }
            }
        }

        var $lootInfo = $('.kf_fw_ig1 > tbody > tr:nth-child(2) > td:nth-child(2)');
        if ($lootInfo.length > 0) {
            var html = $lootInfo.html();
            var lootInfoMatches = html.match(/>.+?\s*\d+\(\+\d+(\+\d+)?\)\s*(点|%)<\/span>/gi);
            if (lootInfoMatches) {
                for (var i in lootInfoMatches) {
                    var lineMatches = /(\d+)\(\+(\d+)(\+\d+)?\)/.exec(lootInfoMatches[i]);
                    if (!lineMatches) continue;
                    var totalNum = 0;
                    for (var j = 1; j < lineMatches.length; j++) {
                        var num = parseInt(lineMatches[j]);
                        if (isNaN(num)) continue;
                        totalNum += num;
                    }
                    if (totalNum > 0) {
                        var replace = lootInfoMatches[i].replace(lineMatches[0], lineMatches[0] + '=' + totalNum);
                        html = html.replace(lootInfoMatches[i], replace);
                    }
                }
                $lootInfo.html(html);
            }
            $lootInfo.find('span[title]').addClass('pd_custom_tips');

            $lootInfo.css('position', 'relative');
            $('<a style="position:absolute;top:4px;right:5px;" href="#">[合计]</a>').appendTo($lootInfo).click(function (e) {
                e.preventDefault();
                var $this = $(this);
                var $panel = $('#pd_attack_sum_panel');
                if ($panel.length > 0) {
                    $this.text('[合计]');
                    $panel.remove();
                    return;
                }
                $this.text('[关闭]');

                var attackNum = 0, attackBurnNum = 0, strongAttackPercent = 0;
                var content = $lootInfo.html();
                var matches = /争夺攻击\s*\d+\(\+\d+\)=(\d+)\s*点/.exec(content);
                if (matches) attackNum = parseInt(matches[1]);
                matches = /争夺燃烧\s*\d+\(\+\d+\)=(\d+)\s*点/.exec(content);
                if (matches) attackBurnNum = parseInt(matches[1]);
                matches = /争夺暴击比例\s*\d+\(\+\d+\)=(\d+)\s*%/.exec(content);
                if (matches) strongAttackPercent = parseInt(matches[1]) / 100;

                var html =
                    '<table class="pd_panel" id="pd_attack_sum_panel" style="text-align:center;opacity:0.9;padding:0 5px">' +
                    '  <tbody>' +
                    '    <tr>' +
                    '      <th style="width:95px;text-align:left">攻击|攻击+燃烧</th>' +
                    '      <th style="width:120px">正常</th>' +
                    '      <th style="width:120px">致命一击(如果有)</th>' +
                    '    </tr>' +
                    '    <tr>' +
                    '      <th style="text-align:left">普通攻击</th>' +
                    '      <td class="pd_custom_tips" title="争夺攻击+争夺燃烧">{0} | <span class="pd_highlight">{1}</span></td>'
                        .replace('{0}', attackNum)
                        .replace('{1}', attackNum + attackBurnNum) +
                    '      <td class="pd_custom_tips" title="争夺攻击×致命一击比例+争夺燃烧">{0} | <span class="pd_highlight">{1}</span></td>'
                        .replace('{0}', Math.round(attackNum * Const.deadlyAttackPercent))
                        .replace('{1}', Math.round(attackNum * Const.deadlyAttackPercent) + attackBurnNum) +
                    '    </tr>' +
                    '    <tr>' +
                    '      <th style="text-align:left">暴击(如果有)</th>' +
                    '      <td class="pd_custom_tips" title="争夺攻击×暴击比例+争夺燃烧">{0} | <span class="pd_highlight">{1}</span></td>'
                        .replace('{0}', Math.round(attackNum * strongAttackPercent))
                        .replace('{1}', Math.round(attackNum * strongAttackPercent) + attackBurnNum) +
                    '      <td class="pd_custom_tips" title="争夺攻击×致命一击比例×暴击比例+争夺燃烧">{0} | <span class="pd_highlight">{1}</span></td>'
                        .replace('{0}', Math.round(Math.round(attackNum * Const.deadlyAttackPercent) * strongAttackPercent))
                        .replace('{1}', Math.round(Math.round(attackNum * Const.deadlyAttackPercent) * strongAttackPercent) + attackBurnNum) +
                    '    </tr>' +
                    '  </tbody>' +
                    '</table>';
                var offset = $lootInfo.offset();
                $panel = $(html).appendTo('body');
                $panel.css('top', offset.top - $panel.height() - 2).css('left', offset.left);
            });
        }
    },

    /**
     * 获取下次领取争夺奖励的时间对象
     * @returns {{type: number, time: number}} 下次领取争夺奖励的时间对象，type：时间类型（0：获取失败；1：估计时间；2：精确时间）；time：下次领取时间
     */
    getNextLootAwardTime: function () {
        var log = Tools.getCookie(Const.getLootAwardCookieName);
        if (log) {
            log = log.split('|');
            if (log.length === 2) {
                var type = parseInt(log[0]);
                var time = parseInt(log[1]);
                if (!isNaN(type) && !isNaN(time) && type > 0 && time > 0) {
                    return {type: parseInt(type), time: parseInt(time)};
                }
            }
        }
        return {type: 0, time: 0};
    },

    /**
     * 判断当前是否可以自动攻击
     * @returns {boolean} 是否可以自动攻击
     */
    isAutoAttackNow: function () {
        if (!Config.attackAfterTime) return true;
        var timeLog = Loot.getNextLootAwardTime();
        if (timeLog.type > 0) {
            var end = timeLog.time - Config.attackAfterTime * 60 * 1000;
            if (end > (new Date()).getTime()) return false;
        }
        return true;
    },

    /**
     * 检查自动攻击是否已完成
     */
    checkAutoAttack: function () {
        var value = Tools.getCookie(Const.autoAttackReadyCookieName);
        if (!value) return;
        var valueArr = value.split('|');
        if (valueArr.length !== 2) return;
        var type = parseInt(valueArr[0]);
        if (isNaN(type)) return;
        var safeId = valueArr[1];
        if (!safeId) safeId = KFOL.getSafeId();
        if (!safeId) return;
        if (type === 2 && Config.attackAfterTime > 0) {
            if (Loot.isAutoAttackNow())
                Loot.autoAttack(safeId);
            else if (Config.attemptAttackEnabled && !Tools.getCookie(Const.checkLifeCookieName))
                Loot.checkLife();
        }
        else {
            Loot.autoAttack(safeId);
        }
    },

    /**
     * 检查当前生命值
     */
    checkLife: function () {
        console.log('检查生命值Start');
        $.get('kf_fw_ig_index.php', function (html) {
            if (Tools.getCookie(Const.checkLifeCookieName)) return;
            if (/本回合剩余攻击次数\s*0\s*次/.test(html)) {
                Tools.setCookie(Const.autoAttackReadyCookieName, '', Tools.getDate('-1d'));
                Tools.setCookie(Const.checkLifeCookieName, '', Tools.getDate('-1d'));
                Tools.setCookie(Const.attackCountCookieName, '', Tools.getDate('-1d'));
                Tools.setCookie(Const.prevAttemptAttackLogCookieName, '', Tools.getDate('-1d'));
            }
            var safeIdMatches = /<a href="kf_fw_card_pk\.php\?safeid=(\w+)">/i.exec(html);
            var safeId = '';
            if (safeIdMatches) safeId = safeIdMatches[1];
            if (!safeId) return;

            var checkLifeInterval = Const.defCheckLifeInterval;
            var lifeMatches = />(\d+)<\/span>\s*预领KFB<br/i.exec(html);
            var minLifeMatches = /你的神秘系数\]，则你可以领取(\d+)KFB\)<br/i.exec(html);
            var life = 0, minLife = 0;
            var isLteMinLife = false;
            if (lifeMatches && minLifeMatches) {
                life = parseInt(lifeMatches[1]);
                minLife = parseInt(minLifeMatches[1]);
                if (life <= minLife) {
                    checkLifeInterval = Const.checkLifeAfterAttemptAttackInterval;
                    isLteMinLife = true;
                }
            }
            var maxCheckAttackLifeNum = Config.maxAttemptAttackLifeNum;
            if (maxCheckAttackLifeNum > minLife || maxCheckAttackLifeNum < 0) maxCheckAttackLifeNum = minLife;
            var recentMonsterAttackLog = '';
            var monsterAttackLogList = Loot.getMonsterAttackLogList(html);
            if (monsterAttackLogList.length > 0) recentMonsterAttackLog = $.trim(monsterAttackLogList[0]);
            if (Const.debug) console.log('最近一次的被攻击日志：' + (recentMonsterAttackLog ? recentMonsterAttackLog : '无'));
            var deadlyAttackNum = 0;
            if (Config.deadlyAttackId > 0) {
                var deadlyAttackMatches = /致命一击剩余攻击次数\s*(\d+)\s*次/i.exec(html);
                if (deadlyAttackMatches) deadlyAttackNum = parseInt(deadlyAttackMatches[1]);
                if (deadlyAttackNum > Const.maxAttackNum) deadlyAttackNum = Const.maxAttackNum;
            }

            /**
             * 写入下次检查生命值的Cookie信息
             * @param {number} life 当前实际生命值
             * @param {number} interval 下次检查生命值的时间间隔（分钟）
             * @param {string} msg 提示消息
             */
            var writeNextCheckLifeCookie = function (life, interval, msg) {
                var nextTime = Tools.getDate('+' + interval + 'm');
                Tools.setCookie(Const.checkLifeCookieName, nextTime.getTime(), nextTime);

                var lootInfo = Loot.getNextLootAwardTime();
                if (lootInfo.time > 0) {
                    console.log('【检查生命值】当前生命值：{0}，低保线：{1}，攻击阈值：{2}；距本回合开始已经过{3}分钟{4}，下一次检查生命值的时间间隔为{5}分钟\n{6}'
                        .replace('{0}', life)
                        .replace('{1}', minLife)
                        .replace('{2}', maxCheckAttackLifeNum)
                        .replace('{3}', Const.defLootInterval - Math.floor((lootInfo.time - (new Date()).getTime()) / 60 / 1000))
                        .replace('{4}', lootInfo.type === 1 ? '(估计时间)' : '')
                        .replace('{5}', interval)
                        .replace('{6}', msg)
                    );
                }
            };

            /**
             * 试探攻击
             * @param {number} life 当前实际生命值
             * @param {string} recentMonsterAttackLog 最近一次的被怪物攻击日志
             * @param {string} msg 提示消息
             */
            var attemptAttack = function (life, recentMonsterAttackLog, msg) {
                writeNextCheckLifeCookie(life, checkLifeInterval, msg);
                KFOL.removePopTips($('#pd_remaining_num').closest('.pd_pop_tips'));
                var attackCount = parseInt(Tools.getCookie(Const.attackCountCookieName));
                if (isNaN(attackCount) || attackCount < 0) attackCount = 0;
                var num = 0, attackId = 0;
                for (var id in Config.batchAttackList) {
                    for (var i = 1; i <= Config.batchAttackList[id]; i++) {
                        if (attackCount === num) {
                            attackId = id;
                            break;
                        }
                        num++;
                    }
                    if (attackId > 0) break;
                }
                if (!attackId) return;
                if (deadlyAttackNum > 0) attackId = Config.deadlyAttackId;
                var attackList = {};
                attackList[attackId] = 1;
                KFOL.showWaitMsg('<strong>正在进行试探攻击中...</strong><i>攻击次数：<em id="pd_remaining_num">1</em></i>', true);
                Loot.batchAttack({
                    type: 3,
                    totalAttackNum: 1,
                    attackList: attackList,
                    safeId: safeId,
                    life: life,
                    recentMonsterAttackLog: recentMonsterAttackLog
                });
            };

            if (!isLteMinLife) {
                writeNextCheckLifeCookie(life, checkLifeInterval, '当前生命值大于低保线，不进行试探攻击');
                if (recentMonsterAttackLog)
                    Tools.setCookie(Const.prevAttemptAttackLogCookieName, life + '/' + recentMonsterAttackLog, new Date(Loot.getNextLootAwardTime().time));
                else
                    Tools.setCookie(Const.prevAttemptAttackLogCookieName, '', Tools.getDate('-1d'));
                return;
            }

            var prevCheckAttackInfo = Tools.getCookie(Const.prevAttemptAttackLogCookieName);
            if (prevCheckAttackInfo && recentMonsterAttackLog) {
                var arr = prevCheckAttackInfo.split('/');
                if (arr.length === 2 && $.type(parseInt(arr[0])) === 'number') {
                    var realLife = parseInt(arr[0]), loss = 0;
                    if (realLife < 0) realLife = 0;
                    var prevMonsterAttackLog = $.trim(arr[1]);
                    if (Const.debug) console.log('上次记录的被攻击日志：' + prevMonsterAttackLog);
                    var index = 0;
                    for (; index <= monsterAttackLogList.length; index++) {
                        if ($.trim(monsterAttackLogList[index]) === prevMonsterAttackLog) break;
                        if (/清空生命值/.test(monsterAttackLogList[index])) {
                            attemptAttack(0, recentMonsterAttackLog, '自上次检查生命值以来，在后续的被攻击日志中发现被清空生命值的情况，需要进行试探攻击');
                            return;
                        }
                        var matches = /被实际夺取(\d+)KFB.+被实际燃烧(\d+)KFB/i.exec(monsterAttackLogList[index]);
                        if (matches) loss += parseInt(matches[1]) + parseInt(matches[2]);
                    }
                    realLife -= loss;
                    if (realLife < 0) realLife = 0;
                    if (index > monsterAttackLogList.length) {
                        attemptAttack(0, recentMonsterAttackLog, '在当前被攻击日志中未找到上次记录的被攻击日志，需要进行试探攻击');
                    }
                    else {
                        if (index === 0 && realLife <= maxCheckAttackLifeNum) {
                            attemptAttack(realLife, prevMonsterAttackLog, '当前生命值未超过阈值，继续进行试探攻击');
                        }
                        else {
                            if (realLife > maxCheckAttackLifeNum) {
                                var msg = '';
                                if (recentMonsterAttackLog === prevMonsterAttackLog) msg = '未遭到新的攻击';
                                else msg = '共损失{0}KFB'.replace('{0}', loss);
                                writeNextCheckLifeCookie(realLife,
                                    Const.defCheckLifeInterval,
                                    '自上次检查生命值以来，{0}，生命值高于阈值，暂无试探攻击的必要'.replace('{0}', msg)
                                );
                                Tools.setCookie(Const.prevAttemptAttackLogCookieName,
                                    realLife + '/' + recentMonsterAttackLog,
                                    new Date(Loot.getNextLootAwardTime().time)
                                );
                            }
                            else {
                                attemptAttack(realLife,
                                    recentMonsterAttackLog,
                                    '自上次检查生命值以来，共损失{0}KFB，生命值未超过阈值，需要进行试探攻击'.replace('{0}', loss)
                                );
                            }
                        }
                    }
                }
                else {
                    attemptAttack(0, recentMonsterAttackLog, '未发现检查生命值的记录，需要进行试探攻击');
                }
            }
            else {
                attemptAttack(0, recentMonsterAttackLog, '未发现检查生命值的记录，需要进行试探攻击');
            }
        }, 'html');
    },

    /**
     * 显示批量攻击或被NPC攻击的日志对话框
     * @param {number} type 对话框类型，1：批量攻击日志；2：被NPC攻击日志
     * @param {string[]} logList 攻击日志列表
     * @param {string} [stat] 批量攻击收获
     */
    showAttackLogDialog: function (type, logList, stat) {
        if ($('#pd_attack_log').length > 0) return;
        var log = '<li>' + logList.join('</li><li>') + '</li>';
        var strongAttackNum = 0, criticalStrikeNum = 0;
        var matches = log.match(/触发暴击!/g);
        if (matches) strongAttackNum = matches.length;
        matches = log.match(/致命一击!/g);
        if (matches) criticalStrikeNum = matches.length;
        var html =
            '<div class="pd_cfg_main">' +
            '<div style="margin-top:5px">' +
            '  <label><input class="pd_input" type="radio" name="pd_custom_attack_log" value="ori" checked="checked" /> 原版</label>' +
            '  <label style="margin-left:7px"><input class="pd_input" type="radio" name="pd_custom_attack_log" value="custom" /> 自定义</label>' +
            '</div>' +
            '  <ul id="pd_attack_log_content"></ul>' +
            '</div>';
        var $dialog = Dialog.create('pd_attack_log', '{0}日志'.replace('{0}', type === 2 ? 'NPC攻击' : '批量攻击'), html);

        /**
         * 显示日志
         * @param {string} log 攻击日志
         */
        var showLog = function (log) {
            var extraLog = '';
            if (strongAttackNum > 0) extraLog += '暴击<em>+{0}</em>'.replace('{0}', strongAttackNum);
            if (criticalStrikeNum > 0) extraLog += (extraLog ? ' ' : '') + '致命一击<em>+{0}</em>'.replace('{0}', criticalStrikeNum);
            if (extraLog) extraLog = '（' + extraLog + '）';
            if (type === 1) {
                log += '<li class="pd_stat" style="margin-top:10px"><b>统计结果{0}：</b><br />{1}</li>'
                    .replace('{0}', extraLog)
                    .replace('{1}', stat ? stat : '无');
            }
            $dialog.find('#pd_attack_log_content').html(log);
        };

        $dialog.find('input[name="pd_custom_attack_log"]').click(function () {
            var content = '';
            if ($(this).val() === 'custom') {
                var customLog = log;
                $.each(Config.customMonsterNameList, function (id, name) {
                    var oriName = Loot.getMonsterNameById(parseInt(id));
                    if (type === 2) {
                        customLog = customLog.replace(
                            new RegExp('\\[{0}\\]对'.replace('{0}', oriName), 'g'),
                            '[{0}]对'.replace('{0}', name)
                        );
                    }
                    else {
                        customLog = customLog.replace(
                            new RegExp('对\\[{0}\\]'.replace('{0}', oriName), 'g'),
                            '对[{0}]'.replace('{0}', name)
                        );
                    }
                });
                content = customLog;
            }
            else {
                content = log;
            }
            showLog(content);
        });

        if (Config.customMonsterNameEnabled && !$.isEmptyObject(Config.customMonsterNameList)) {
            $dialog.find('input[name="pd_custom_attack_log"][value="custom"]')
                .prop('checked', true)
                .triggerHandler('click');
        }
        else {
            $dialog.find('input[name="pd_custom_attack_log"][value="custom"]').prop('disabled', true);
            showLog(log);
        }
        Dialog.show('pd_attack_log');
        $dialog.find('input:first').focus();
    },

    /**
     * 通过怪物ID获取怪物原始名称
     * @param {number} id 怪物ID
     * @returns {string} 怪物原始名称
     */
    getMonsterNameById: function (id) {
        switch (id) {
            case 1:
                return '小史莱姆';
            case 2:
                return '笨蛋';
            case 3:
                return '大果冻史莱姆';
            case 4:
                return '肉山';
            case 5:
                return '大魔王';
            default:
                return '';
        }
    },

    /**
     * 自定义怪物名称
     */
    customMonsterName: function () {
        if ($.isEmptyObject(Config.customMonsterNameList)) return;
        if (location.pathname === '/kf_fw_ig_index.php') {
            var $log = $('.kf_fw_ig1 > tbody > tr:nth-last-child(2) > td');
            var oriLog = $log.html();
            if (!$.trim(oriLog)) return;
            $log.wrapInner('<div></div>');
            $('<label><input class="pd_input" type="radio" name="pd_custom_attack_log" value="ori" /> 原版</label>' +
                '<label style="margin-left:7px"><input class="pd_input" type="radio" name="pd_custom_attack_log" value="custom" checked="checked" /> 自定义</label><br />')
                .prependTo($log)
                .find('input[name="pd_custom_attack_log"]')
                .click(function () {
                    if ($(this).val() === 'custom') {
                        var customLog = oriLog;
                        $.each(Config.customMonsterNameList, function (id, name) {
                            var oriName = Loot.getMonsterNameById(parseInt(id));
                            customLog = customLog.replace(
                                new RegExp('\\[{0}\\]对'.replace('{0}', oriName), 'g'),
                                '<span class="pd_custom_tips" title="{0}">[{1}]</span>对'.replace('{0}', oriName).replace('{1}', name)
                            );
                        });
                        $log.find('div:last-child').html(customLog);
                    }
                    else {
                        $log.find('div:last-child').html(oriLog);
                    }
                })
                .end()
                .find('input[value="custom"]')
                .triggerHandler('click');
        }
        else if (/\/kf_fw_ig_pklist\.php(\?l=s)?$/i.test(location.href)) {
            $('.kf_fw_ig1 > tbody > tr:gt(2):nth-child(3n+1) > td:first-child').each(function () {
                var $this = $(this);
                var html = $this.html();
                $.each(Config.customMonsterNameList, function (id, name) {
                    var oriName = Loot.getMonsterNameById(parseInt(id));
                    html = html.replace(oriName, '<span class="pd_custom_tips" title="{0}">{1}</span>'.replace('{0}', oriName).replace('{1}', name));
                });
                $this.html(html);
            });
            $('a.kfigpk_hit').each(function () {
                var $this = $(this);
                var html = $this.html();
                $.each(Config.customMonsterNameList, function (id, name) {
                    html = html.replace(Loot.getMonsterNameById(parseInt(id)), name);
                });
                $this.html(html);
            });
            $(function () {
                $('a.kfigpk_hit').off('click').click(function () {
                    var $this = $(this);
                    $.post('kf_fw_ig_pkhit.php',
                        {uid: $this.attr('hitid'), safeid: $this.attr('safeid')},
                        function (msg) {
                            $.each(Config.customMonsterNameList, function (id, name) {
                                msg = msg.replace(
                                    '对[{0}]'.replace('{0}', Loot.getMonsterNameById(parseInt(id))),
                                    '对[{0}]'.replace('{0}', name)
                                );
                            });
                            $this.html(msg);
                        }, 'html');
                });
            });
        }
    },

    /**
     * 获取争夺属性列表
     * @param {string} html 争夺首页的HTML代码
     * @returns {{}} 争夺属性列表
     */
    getLootPropertyList: function (html) {
        var lootPropertyList = {
            '剩余攻击次数': 0,
            '致命一击剩余攻击次数': 0,
            '争夺攻击': 0,
            '神秘系数': 0,
            '争夺燃烧': 0,
            '争夺暴击几率': 0,
            '争夺暴击比例': 0,
            '命中': 0,
            '闪避': 0,
            '防御': 0,
            '道具使用列表': {}
        };
        var itemUsedNumList = {'蕾米莉亚同人漫画': 0, '十六夜同人漫画': 0, '档案室钥匙': 0, '傲娇LOLI娇蛮音CD': 0, '整形优惠卷': 0, '消逝之药': 0};

        var matches = /本回合剩余攻击次数\s*(\d+)\s*次/.exec(html);
        if (matches) lootPropertyList['剩余攻击次数'] = parseInt(matches[1]);

        matches = /致命一击剩余攻击次数\s*(\d+)\s*次/.exec(html);
        if (matches) lootPropertyList['致命一击剩余攻击次数'] = parseInt(matches[1]);

        matches = /争夺攻击\s*(\d+)\(\+(\d+)\)\s*点/.exec(html);
        if (matches) {
            lootPropertyList['争夺攻击'] = parseInt(matches[1]) + parseInt(matches[2]);
            lootPropertyList['神秘系数'] = parseInt(matches[2]);
        }

        matches = /争夺燃烧\s*(\d+)\(\+(\d+)\)\s*点/.exec(html);
        if (matches) {
            lootPropertyList['争夺燃烧'] = parseInt(matches[1]) + parseInt(matches[2]);
            itemUsedNumList['蕾米莉亚同人漫画'] = parseInt(matches[2]);
        }

        matches = /争夺暴击几率\s*(\d+)\s*%/.exec(html);
        if (matches) {
            lootPropertyList['争夺暴击几率'] = parseInt(matches[1]);
            itemUsedNumList['整形优惠卷'] = Math.floor(parseInt(matches[1]) / 3);
        }

        matches = /争夺暴击比例\s*(\d+)\(\+(\d+)\)\s*%/.exec(html);
        if (matches) {
            lootPropertyList['争夺暴击比例'] = parseInt(matches[1]) + parseInt(matches[2]);
            itemUsedNumList['档案室钥匙'] = Math.floor(parseInt(matches[2]) / 10);
        }

        matches = /命中\s*(\d+)\(\+(\d+)\+(\d+)\)\s*点/.exec(html);
        if (matches) {
            lootPropertyList['命中'] = parseInt(matches[1]) + parseInt(matches[2]) + parseInt(matches[3]);
            itemUsedNumList['傲娇LOLI娇蛮音CD'] = parseInt(matches[3]);
        }

        matches = /闪避\s*(\d+)\(\+(\d+)\+(\d+)\)\s*点/.exec(html);
        if (matches) {
            lootPropertyList['闪避'] = parseInt(matches[1]) + parseInt(matches[2]) + parseInt(matches[3]);
            itemUsedNumList['十六夜同人漫画'] = parseInt(matches[2]);
        }

        matches = /防御\s*(\d+)\s*%/.exec(html);
        if (matches) {
            lootPropertyList['防御'] = parseInt(matches[1]);
            itemUsedNumList['消逝之药'] = Math.floor(parseInt(matches[1]) / 7);
        }

        lootPropertyList['道具使用列表'] = itemUsedNumList;
        return lootPropertyList;
    },

    /**
     * 添加怪物争夺信息的提示
     */
    addMonsterLootInfoTips: function () {
        $.get('kf_fw_ig_index.php', function (html) {
            var lootPropertyList = Loot.getLootPropertyList(html);
            $('.kf_fw_ig1 > tbody > tr').each(function (index) {
                var $this = $(this);
                if (index === 0) {
                    $this.find('td').append(
                        ('<span style="color:#FFF;margin-left:7px;font-weight:normal;font-size:12px">' +
                        '(本回合剩余攻击次数 <b style="font-size:14px">{0}</b> 次，致命一击剩余次数 <b style="font-size:14px">{1}</b> 次)</span>')
                            .replace('{0}', lootPropertyList['剩余攻击次数'])
                            .replace('{1}', lootPropertyList['致命一击剩余攻击次数'])
                    );
                    return;
                }
                if (index === 1 || $this.children('td').length !== 4) return;
                $this.children('td:gt(0)').each(function (index) {
                    var $this = $(this);
                    var html = $this.html();
                    if (index === 0) {
                        var matches = /(\d+)生命值\s*\|\s*(\d+)闪避\s*\|\s*\((\d+)x(\d+)\)%防御/.exec(html);
                        if (!matches) return;
                        var life = parseInt(matches[1]), avoid = parseInt(matches[2]), defense = parseInt(matches[3]) * parseInt(matches[4]) / 100;

                        var clearLife = false;
                        var tipsClassName = '';
                        if (life <= Math.round(lootPropertyList['争夺攻击'] * (1 - defense)) + lootPropertyList['争夺燃烧']) {
                            clearLife = true;
                            tipsClassName = 'pd_verify_tips_ok';
                        }
                        else {
                            if (life <= Math.round(Math.round(lootPropertyList['争夺攻击'] * Const.deadlyAttackPercent) * (1 - defense)) + lootPropertyList['争夺燃烧'])
                                clearLife = true;
                            else if (life <= Math.round(Math.round(lootPropertyList['争夺攻击'] * lootPropertyList['争夺暴击比例'] / 100) * (1 - defense))
                                + lootPropertyList['争夺燃烧']
                            )
                                clearLife = true;
                            else if (life <= Math.round(Math.round(Math.round(lootPropertyList['争夺攻击'] * Const.deadlyAttackPercent)
                                        * lootPropertyList['争夺暴击比例'] / 100) * (1 - defense)) + lootPropertyList['争夺燃烧']
                            )
                                clearLife = true;
                            if (clearLife) tipsClassName = 'pd_verify_tips_conditional';
                            else tipsClassName = 'pd_verify_tips_unable';
                        }
                        var lifeTips = '<span class="pd_verify_tips pd_verify_tips_details" data-life="{0}" data-defense="{1}">[<b class="{2}">{3}</b>]</span>'
                            .replace('{0}', life)
                            .replace('{1}', defense)
                            .replace('{2}', tipsClassName)
                            .replace('{3}', clearLife ? '&#10003;' : '&times;');
                        html = html.replace('生命值', '生命值' + lifeTips);

                        var avoidTips = '';
                        if (avoid <= lootPropertyList['命中']) {
                            avoidTips = '<span class="pd_verify_tips" title="攻击此怪物可100%命中">[<b class="pd_verify_tips_ok">&#10003;</b>]</span>';
                        }
                        else {
                            avoidTips = '<span class="pd_verify_tips" title="攻击此怪物有40%的几率命中（还差{0}点可100%命中）">[<b class="pd_verify_tips_unable">&times;</b>]</span>'
                                .replace('{0}', avoid - lootPropertyList['命中']);
                        }
                        html = html.replace('闪避', '闪避' + avoidTips);

                        $this.html(html);
                    }
                    else if (index === 1) {
                        matches = /(\d+)攻击\s*\|\s*(\d+)燃烧\s*\|\s*(\d+)命中.+?(\((\d+)%\+(\d+)x(\d+)%\)暴击伤害)/.exec(html);
                        if (!matches) return;
                        var attack = parseInt(matches[1]), burn = parseInt(matches[2]), hit = parseInt(matches[3]);
                        var strongAttackText = matches[4];
                        var strongAttackPercent = parseInt(matches[5]) + Math.round(parseInt(matches[6]) * parseInt(matches[7]));

                        var attackTips = '<span class="pd_custom_tips" title="可实际夺取{0}KFB">{1}攻击</span>'
                            .replace('{0}', Math.round(attack * (100 - lootPropertyList['防御']) / 100))
                            .replace('{1}', attack);
                        html = html.replace(attack + '攻击', attackTips);

                        var burnTips = '<span class="pd_custom_tips" title="实际夺取KFB+燃烧KFB={0}KFB">{1}燃烧</span>'
                            .replace('{0}', Math.round(attack * (100 - lootPropertyList['防御']) / 100) + burn)
                            .replace('{1}', burn);
                        html = html.replace(burn + '燃烧', burnTips);

                        var htiTips = '';
                        if (hit < lootPropertyList['闪避']) {
                            htiTips = '<span class="pd_verify_tips" title="有60%的几率可闪避此怪物的攻击">[<b class="pd_verify_tips_ok">&#10003;</b>]</span>';
                        }
                        else {
                            htiTips = '<span class="pd_verify_tips" title="无法闪避此怪物的攻击（还差{0}点可全部闪避）">[<b class="pd_verify_tips_unable">&times;</b>]</span>'
                                .replace('{0}', hit - lootPropertyList['闪避'] + 1);
                        }
                        html = html.replace('命中', '命中' + htiTips);

                        var strongAttackTips = '<span class="pd_custom_tips" title="暴击可实际夺取{0}KFB">{1}</span>'
                            .replace('{0}', Math.round(Math.round(attack * strongAttackPercent / 100) * (100 - lootPropertyList['防御']) / 100))
                            .replace('{1}', strongAttackText);
                        html = html.replace(strongAttackText, strongAttackTips);

                        $this.html(html);
                    }
                    else if (index === 2) {
                        var itemDropPercent = parseInt($.trim($this.text()));
                        if (isNaN(itemDropPercent)) return;
                        $this.addClass('pd_custom_tips').attr('title', '在20次攻击中预计可掉落{0}个道具'.replace('{0}', (itemDropPercent / 100 * 20).toFixed(1)));
                    }
                });
            });

            $(document).on('click', '.pd_verify_tips_details[data-life]', function () {
                var $this = $(this);
                var life = parseInt($this.data('life'));
                if (isNaN(life)) return;
                var defense = parseFloat($this.data('defense'));
                if (isNaN(defense)) return;
                var $panel = $('#pd_monster_loot_info_panel');
                if ($panel.length > 0) $panel.remove();

                var tipsList = new Array(4);
                for (var i = 0; i < tipsList.length; i++) {
                    var attack = 0, burn = lootPropertyList['争夺燃烧'], totalAttack = 0;
                    switch (i) {
                        case 0:
                            attack = Math.round(lootPropertyList['争夺攻击'] * (1 - defense));
                            break;
                        case 1:
                            attack = Math.round(Math.round(lootPropertyList['争夺攻击'] * Const.deadlyAttackPercent) * (1 - defense));
                            break;
                        case 2:
                            attack = Math.round(Math.round(lootPropertyList['争夺攻击'] * lootPropertyList['争夺暴击比例'] / 100) * (1 - defense));
                            break;
                        case 3:
                            attack = Math.round(Math.round(Math.round(lootPropertyList['争夺攻击'] * Const.deadlyAttackPercent)
                                    * lootPropertyList['争夺暴击比例'] / 100) * (1 - defense));
                            break;
                    }
                    totalAttack = attack + burn;

                    var attackOverflow = attack - life;
                    if (attackOverflow < 0) attackOverflow = 0;
                    var burnOverflow = totalAttack - life;
                    if (burnOverflow < 0) burnOverflow = 0;
                    else if (burnOverflow > lootPropertyList['争夺燃烧']) burnOverflow = lootPropertyList['争夺燃烧'];
                    var totalAttackDiff = life - totalAttack;
                    if (totalAttackDiff < 0) totalAttackDiff = 0;

                    tipsList[i] = '<em title="夺取KFB">{0}</em>{1} | <em style="font-weight:bold" title="夺取KFB+燃烧KFB">{2}</em>{3}'
                        .replace('{0}', attack)
                        .replace('{1}', attackOverflow > 0 || burnOverflow > 0 ?
                            ' (<em style="color:#0099CC" title="夺取KFB溢出">+{0}</em>'.replace('{0}', attackOverflow) +
                            ' <em style="color:#FF0033" title="燃烧KFB溢出">+{0}</em>)'.replace('{0}', burnOverflow)
                                : ''
                        )
                        .replace('{2}', totalAttack)
                        .replace('{3}', totalAttackDiff > 0 ? ' (<em style="color:#339933" title="距清空生命值的差额">-{0}</em>)'.replace('{0}', totalAttackDiff) : '');
                }

                var html =
                    '<table class="pd_panel" id="pd_monster_loot_info_panel" style="text-align:center;opacity:0.9;padding:0 5px">' +
                    '  <tbody>' +
                    '    <tr>' +
                    '      <th style="width:87px;text-align:left"></th>' +
                    '      <th style="width:175px">正常</th>' +
                    '      <th style="width:175px">致命一击(如果有)</th>' +
                    '    </tr>' +
                    '    <tr>' +
                    '      <th style="text-align:left">普通攻击</th>' +
                    '      <td>{0}</td>'.replace('{0}', tipsList[0]) +
                    '      <td>{0}</td>'.replace('{0}', tipsList[1]) +
                    '    </tr>' +
                    '    <tr>' +
                    '      <th style="text-align:left">暴击(如果有)</th>' +
                    '      <td>{0}</td>'.replace('{0}', tipsList[2]) +
                    '      <td>{0}</td>'.replace('{0}', tipsList[3]) +
                    '    </tr>' +
                    '  </tbody>' +
                    '</table>';
                var offset = $this.closest('tr').offset();
                $panel = $(html).appendTo('body');
                $panel.css('top', offset.top - $panel.height() - 2).css('left', offset.left);
            }).on('click', function (e) {
                var $target = $(e.target);
                if (!($target.is('.pd_panel') || $target.closest('.pd_panel').length || $target.is('.pd_verify_tips_details')
                    || $target.closest('.pd_verify_tips_details').length)
                ) {
                    $('#pd_monster_loot_info_panel').remove();
                }
            });
        }, 'html');
    },

    /**
     * 获取被怪物攻击日志列表
     * @param {string} html 争夺首页的HTML代码
     * @returns {string[]} 被怪物攻击日志列表
     */
    getMonsterAttackLogList: function (html) {
        var matches = /<tr><td colspan="\d+">\r\n<span style=".+?">(\d+:\d+:\d+ \|.+?)<br \/><\/td><\/tr>/i.exec(html);
        var attackLogList = [];
        if (matches && /发起争夺/.test(matches[1])) {
            attackLogList = matches[1].replace(/<br \/>/ig, '\n').replace(/(<.+?>|<.+?\/>)/g, '').split('\n');
        }
        return attackLogList;
    },

    /**
     * 在批量攻击后使用刚掉落的指定种类ID列表的道具
     * @param {{}} itemNameList 刚掉落的道具名称列表
     */
    useItemsAfterBatchAttack: function (itemNameList) {
        var totalCount = 0;
        for (var k in itemNameList) {
            totalCount++;
        }
        if (!totalCount) return;
        var $getItemListMsg = KFOL.showWaitMsg('正在获取刚掉落道具的信息，请稍后...', true);
        var itemList = [];
        var count = 0;
        $(document).clearQueue('GetItemList');
        $.each(itemNameList, function (itemName, num) {
            var itemTypeId = Item.getItemTypeIdByItemName(itemName);
            if (!itemTypeId) return;
            $(document).queue('GetItemList', function () {
                $.get('kf_fw_ig_my.php?lv=' + itemTypeId, function (html) {
                    count++;
                    var matches = html.match(/<tr><td>.+?<\/td><td>\d+级道具<\/td><td>.+?<\/td><td><a href="kf_fw_ig_my\.php\?pro=\d+">查看详细<\/a><\/td><\/tr>/gi);
                    if (matches) {
                        var totalNum = matches.length - num;
                        if (totalNum < 0) totalNum = 0;
                        for (var i = matches.length - 1; i >= totalNum; i--) {
                            var itemIdMatches = /kf_fw_ig_my\.php\?pro=(\d+)/i.exec(matches[i]);
                            var itemLevelMatches = /<td>(\d+)级道具<\/td>/i.exec(matches[i]);
                            var itemNameMatches = /<tr><td>(.+?)<\/td>/i.exec(matches[i]);
                            itemList.push({
                                itemId: parseInt(itemIdMatches[1]),
                                itemLevel: parseInt(itemLevelMatches[1]),
                                itemTypeId: itemTypeId,
                                itemName: itemNameMatches[1]
                            });
                        }
                    }
                    if (count === totalCount) {
                        KFOL.removePopTips($getItemListMsg);
                        if (itemList.length > 0) {
                            KFOL.showWaitMsg('<strong>正在使用道具中...</strong><i>剩余数量：<em id="pd_remaining_num">{0}</em></i><a class="pd_stop_action" href="#">停止操作</a>'
                                .replace('{0}', itemList.length)
                                , true);
                            useItemList(itemList);
                        }
                    }
                    else {
                        window.setTimeout(function () {
                            $(document).dequeue('GetItemList');
                        }, Const.defAjaxInterval);
                    }
                }, 'html');
            });
        });

        /**
         * 使用指定列表的道具
         * @param {{}[]} itemList 道具列表
         */
        var useItemList = function (itemList) {
            $(document).clearQueue('UseItemList');
            $.each(itemList, function (index, item) {
                $(document).queue('UseItemList', function () {
                    $.ajax({
                        type: 'GET',
                        url: 'kf_fw_ig_doit.php?id={0}&t={1}'.replace('{0}', item.itemId).replace('{1}', (new Date()).getTime()),
                        success: function (html) {
                            var msgMatches = /<span style=".+?">(.+?)<\/span><br \/><a href=".+?">/i.exec(html);
                            if (msgMatches) {
                                var stat = {'有效道具': 0, '无效道具': 0};
                                var credits = Item.getCreditsViaResponse(msgMatches[1], item.itemTypeId);
                                if (credits !== -1) {
                                    if ($.isEmptyObject(credits)) stat['无效道具']++;
                                    else stat['有效道具']++;
                                    $.each(credits, function (key, credit) {
                                        if (typeof stat[key] === 'undefined')
                                            stat[key] = credit;
                                        else
                                            stat[key] += credit;
                                    });
                                }
                                if (stat['有效道具'] === 0) delete stat['有效道具'];
                                if (stat['无效道具'] === 0) delete stat['无效道具'];
                                if (credits !== -1) {
                                    Log.push('使用道具',
                                        '共有`1`个道具【`Lv.{0}：{1}`】被使用'
                                            .replace('{0}', item.itemLevel)
                                            .replace('{1}', item.itemName),
                                        {
                                            gain: $.extend({}, stat, {'已使用道具': 1}),
                                            pay: {'道具': -1}
                                        }
                                    );
                                }
                                var logStat = '', msgStat = '';
                                for (var creditsType in stat) {
                                    logStat += '，{0}+{1}'
                                        .replace('{0}', creditsType)
                                        .replace('{1}', stat[creditsType]);
                                    msgStat += '<i>{0}<em>+{1}</em></i>'
                                        .replace('{0}', creditsType)
                                        .replace('{1}', stat[creditsType]);
                                }
                                console.log('道具【Lv.{0}：{1}】被使用{2}【{3}】'
                                    .replace('{0}', item.itemLevel)
                                    .replace('{1}', item.itemName)
                                    .replace('{2}', logStat)
                                    .replace('{3}', msgMatches[1])
                                );
                                KFOL.showMsg('道具【<b><em>Lv.{0}</em>{1}</b>】被使用{2}<br /><span style="font-style:italic">{3}</span>'
                                    .replace('{0}', item.itemLevel)
                                    .replace('{1}', item.itemName)
                                    .replace('{2}', msgStat)
                                    .replace('{3}', msgMatches[1])
                                    , -1);
                            }
                        },
                        complete: function () {
                            var $remainingNum = $('#pd_remaining_num');
                            $remainingNum.text(parseInt($remainingNum.text()) - 1);
                            var isStop = $remainingNum.closest('.pd_pop_tips').data('stop');
                            if (isStop) $(document).clearQueue('UseItemList');

                            if (isStop || index === itemList.length - 1) {
                                KFOL.removePopTips($('#pd_remaining_num').closest('.pd_pop_tips'));
                            }
                            else {
                                window.setTimeout(function () {
                                    $(document).dequeue('UseItemList');
                                }, typeof Const.specialAjaxInterval === 'function' ? Const.specialAjaxInterval() : Const.specialAjaxInterval);
                            }
                        },
                        dataType: 'html'
                    });
                });
            });
            $(document).dequeue('UseItemList');
        };
        $(document).dequeue('GetItemList');
    }
};
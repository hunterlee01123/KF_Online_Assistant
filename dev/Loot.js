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
        console.log('领取争夺奖励Start');
        /**
         * 自动攻击
         * @param {string} safeId 用户的SafeID
         * @param {int} deadlyAttackNum 致命一击的攻击次数
         */
        var autoAttack = function (safeId, deadlyAttackNum) {
            if (Config.autoAttackEnabled && !$.isEmptyObject(Config.batchAttackList) && safeId) {
                if (Loot.isAutoAttackNow()) {
                    Tools.setCookie(Config.autoAttackReadyCookieName, '1|' + safeId);
                    Loot.autoAttack(safeId, deadlyAttackNum);
                }
                else {
                    Tools.setCookie(Config.autoAttackReadyCookieName, '2|' + safeId, Tools.getDate('+' + Config.defLootInterval + 'm'));
                }
            }
        };
        $.get('kf_fw_ig_index.php', function (html) {
            var matches = /<INPUT name="submit1" type="submit" value="(.+?)"/i.exec(html);
            if (!matches) {
                Tools.setCookie(Config.getLootAwardCookieName, 1, Tools.getDate('+' + Config.defLootInterval + 'm'));
                return;
            }

            var safeIdMatches = /<a href="kf_fw_card_pk\.php\?safeid=(\w+)">/i.exec(html);
            var safeId = '';
            if (safeIdMatches) safeId = safeIdMatches[1];

            var deadlyAttackNum = 0;
            if (Config.deadlyAttackId > 0) {
                var deadlyAttackMatches = /致命一击剩余攻击次数\s*(\d+)\s*次/i.exec(html);
                if (deadlyAttackMatches) deadlyAttackNum = parseInt(deadlyAttackMatches[1]);
                if (deadlyAttackNum > Config.maxAttackNum) deadlyAttackNum = Config.maxAttackNum;
            }

            var remainingMatches = /还有(\d+)(分钟|小时)领取/i.exec(matches[1]);
            if (remainingMatches) {
                var lootInterval = parseInt(remainingMatches[1]);
                if (remainingMatches[2] === '小时') lootInterval = lootInterval * 60;
                lootInterval++;
                if (!Loot.getNextLootAwardTime().type) {
                    var nextTime = Tools.getDate('+' + lootInterval + 'm');
                    Tools.setCookie(Config.getLootAwardCookieName,
                        '{0}|{1}'.replace('{0}', remainingMatches[2] === '小时' ? 1 : 2).replace('{1}', nextTime.getTime()),
                        nextTime
                    );
                    if (Config.attackWhenZeroLifeEnabled) {
                        var nextCheckInterval = Config.firstCheckAttackInterval - (Config.defLootInterval - lootInterval);
                        if (nextCheckInterval <= 0) nextCheckInterval = 1;
                        var nextCheckTime = Tools.getDate('+' + nextCheckInterval + 'm');
                        Tools.setCookie(Config.attackCheckCookieName, nextCheckTime.getTime(), nextCheckTime);
                        Tools.setCookie(Config.attackCountCookieName, 0, Tools.getDate('+' + Config.defLootInterval + 'm'));
                    }
                    var attackedCountMatches = /总计被争夺\s*(\d+)\s*次<br/i.exec(html);
                    if (attackedCountMatches) {
                        var timeDiff = Config.defLootInterval - lootInterval;
                        if (timeDiff > 0 && timeDiff <= 3 * 60) {
                            TmpLog.setValue(Config.attackedCountTmpLogName, {
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
                    if (remainAttackNum >= Config.deferLootTimeWhenRemainAttackNum && !Tools.getCookie(Config.drawSmboxCookieName)) {
                        console.log('检测到本回合剩余攻击次数还有{0}次，抽取神秘盒子以延长争夺时间'.replace('{0}', remainAttackNum));
                        KFOL.drawSmbox();
                        if (isAutoDonation) KFOL.donation();
                        return;
                    }
                }

                var gainMatches = /当前拥有\s*<span style=".+?">(\d+)<\/span>\s*预领KFB<br \/>/i.exec(html);
                var gain = 0;
                if (gainMatches) gain = parseInt(gainMatches[1]);

                var attackLogMatches = /<tr><td colspan="\d+">\r\n<span style=".+?">(\d+:\d+:\d+ \|.+?<br \/>)<\/td><\/tr>/i.exec(html);
                var attackLog = '';
                if (attackLogMatches && /发起争夺/.test(attackLogMatches[1])) {
                    attackLog = attackLogMatches[1].replace(/<br \/>/ig, '\n').replace(/(<.+?>|<.+?\/>)/g, '');
                }

                var attackedCountMatches = /总计被争夺\s*(\d+)\s*次<br/i.exec(html);
                var attackedCount = -1;
                if (attackedCountMatches) attackedCount = parseInt(attackedCountMatches[1]);

                $.post('kf_fw_ig_index.php',
                    {submit1: 1, one: 1},
                    function (html) {
                        var nextTime = Tools.getDate('+' + Config.defLootInterval + 'm');
                        Tools.setCookie(Config.getLootAwardCookieName, '2|' + nextTime.getTime(), nextTime);
                        if (Config.attackWhenZeroLifeEnabled) {
                            var nextCheckTime = Tools.getDate('+' + Config.firstCheckAttackInterval + 'm');
                            Tools.setCookie(Config.attackCheckCookieName, nextCheckTime.getTime(), nextCheckTime);
                            Tools.setCookie(Config.attackCountCookieName, 0, Tools.getDate('+' + Config.defLootInterval + 'm'));
                        }
                        KFOL.showFormatLog('领取争夺奖励', html);
                        if (/(领取成功！|已经预领\d+KFB)/i.test(html)) {
                            var attackedCountDiff = 0;
                            if (attackedCount > -1) {
                                var now = (new Date()).getTime();
                                var attackedCountInfo = TmpLog.getValue(Config.attackedCountTmpLogName);
                                if (attackedCountInfo && $.type(attackedCountInfo) === 'object' && $.type(attackedCountInfo.time) === 'number' &&
                                    $.type(attackedCountInfo.count) === 'number' && attackedCountInfo.time > 0 && attackedCountInfo.count >= 0) {
                                    attackedCountDiff = attackedCount - attackedCountInfo.count;
                                    if (now - attackedCountInfo.time <= 0) attackedCountDiff = 0;
                                    else if (now - attackedCountInfo.time >= Config.defLootInterval * 60 * 1000 * 2 && attackedCountDiff >= 20)
                                        attackedCountDiff = 0;
                                }
                                TmpLog.setValue(Config.attackedCountTmpLogName, {time: now, count: attackedCount});
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
                                .replace('{2}', attackLog ? '<a href="#">查看日志</a>' : '')
                                .replace('{3}', !Config.autoAttackEnabled ? '<a target="_blank" href="kf_fw_ig_pklist.php">手动攻击</a>' : '')
                            );
                            $msg.find('a[href="#"]:first').click(function (e) {
                                e.preventDefault();
                                Loot.showAttackLogDialog(2, attackLog);
                            });
                            autoAttack(safeId, deadlyAttackNum);
                            if (isAutoDonation) KFOL.donation();
                            if (isAutoSaveCurrentDeposit) KFOL.autoSaveCurrentDeposit(true);
                        }
                    }, 'html');
            }
            else {
                Tools.setCookie(Config.getLootAwardCookieName, 1, Tools.getDate('+' + Config.defLootInterval + 'm'));
                if (isAutoDonation) KFOL.donation();
            }
        }, 'html');
    },

    /**
     * 自动攻击
     * @param {string} safeId 用户的SafeID
     * @param {int} [deadlyAttackNum=-1] 致命一击的攻击次数（-1表示自动检查致命一击的剩余次数）
     */
    autoAttack: function (safeId, deadlyAttackNum) {
        if (!$.isNumeric(deadlyAttackNum)) deadlyAttackNum = -1;
        /**
         * 攻击
         * @param {int} [deadlyAttackId=0] 致命一击的攻击目标ID
         * @param {int} [deadlyAttackNum=0] 致命一击的攻击次数
         */
        var attack = function (deadlyAttackId, deadlyAttackNum) {
            if (!deadlyAttackId) deadlyAttackId = 0;
            if (!deadlyAttackNum) deadlyAttackNum = 0;
            var attackList = {};
            if (deadlyAttackNum > 0) attackList['0' + deadlyAttackId] = deadlyAttackNum;
            if (Config.attackWhenZeroLifeEnabled) {
                var attackCount = parseInt(Tools.getCookie(Config.attackCountCookieName));
                if (isNaN(attackCount) || attackCount < 0) attackCount = 0;
                var num = 0;
                for (var id in Config.batchAttackList) {
                    for (var i = 1; i <= Config.batchAttackList[id]; i++) {
                        num++;
                        if (num > Config.maxAttackNum - deadlyAttackNum) break;
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
                        if (num > Config.maxAttackNum - deadlyAttackNum) break;
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
            Tools.setCookie(Config.autoAttackingCookieName, 1, Tools.getDate('+' + Config.checkAutoAttackingInterval + 'm'));
            KFOL.showWaitMsg('<strong>正在批量攻击中，请耐心等待...</strong><i>攻击次数：<em id="pd_remaining_num">{0}</em></i><a target="_blank" href="{1}">浏览其它页面</a>'
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

        if (Config.deadlyAttackId > 0) {
            if (deadlyAttackNum === -1) {
                console.log('检查致命一击剩余攻击次数Start');
                $.get('kf_fw_ig_index.php', function (html) {
                    var deadlyAttackNum = 0;
                    var matches = /致命一击剩余攻击次数\s*(\d+)\s*次/i.exec(html);
                    if (matches) deadlyAttackNum = parseInt(matches[1]);
                    if (deadlyAttackNum > Config.maxAttackNum) deadlyAttackNum = Config.maxAttackNum;
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
     * @returns {Object} 攻击收获
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
     * @param {Object} options 设置项
     * @param {number} options.type 攻击类型，1：在争夺页面中进行批量攻击；2：在自动争夺中进行批量攻击；3：只进行一次试探攻击
     * @param {number} options.totalAttackNum 总攻击次数
     * @param {Object} options.attackList 攻击目标列表
     * @param {string} options.safeId 用户的SafeID
     */
    batchAttack: function (options) {
        var settings = {
            type: 1,
            totalAttackNum: 0,
            attackList: {},
            safeId: ''
        };
        $.extend(settings, options);
        if (settings.type === 1)
            $('.kf_fw_ig1').parent().append('<div class="pd_result"><strong>攻击结果：</strong><ul></ul></div>');
        var count = 0, successNum = 0, failNum = 0, strongAttackNum = 0, criticalStrikeNum = 0;
        var gain = {'夺取KFB': 0, '经验值': 0};
        var isStop = false, isRetakeSafeId = false;
        var attackLog = '', oriHtml = '', customHtml = '';
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
                        isRetakeSafeId = true;
                        failNum++;
                        $(document).queue('BatchAttack', function () {
                            attack(id);
                        });
                    }
                    else {
                        isStop = true;
                        $(document).queue('BatchAttack', []);
                    }
                    attackLog += '第{0}次：{1}{2}\n'.replace('{0}', count).replace('{1}', msg).replace('{2}', isStop ? '（攻击已中止）' : '');
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
                    attackLog += '第{0}次：{1}\n'.replace('{0}', count).replace('{1}', '网络超时');
                    console.log('【批量攻击】第{0}次：{1}'.replace('{0}', count).replace('{1}', '网络超时'));
                    if (settings.type === 1) {
                        var html = '<li><b>第{0}次：</b>{1}</li>'
                            .replace('{0}', count)
                            .replace('{1}', '<span class="pd_notice">网络超时</span>');
                        $('.pd_result:last > ul').append(html);
                    }
                    $(document).queue('BatchAttack', function () {
                        attack(id);
                    });
                },
                complete: function () {
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(settings.totalAttackNum + failNum - count);
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
                        if (settings.type === 1 || Config.defShowMsgDuration === -1) duration = -1;
                        else if (settings.type === 3 && Config.defShowMsgDuration > 0 && Config.defShowMsgDuration < 30) duration = 30;
                        else if (settings.type === 2 && Config.defShowMsgDuration > 0 && Config.defShowMsgDuration < 480) duration = 480;
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
                            , duration);

                        if (settings.type === 2 || count >= Config.maxAttackNum || isStop) {
                            Tools.setCookie(Config.autoAttackingCookieName, '', Tools.getDate('-1d'));
                            Tools.setCookie(Config.autoAttackReadyCookieName, '', Tools.getDate('-1d'));
                            if (Config.attackWhenZeroLifeEnabled) {
                                Tools.setCookie(Config.attackCheckCookieName, '', Tools.getDate('-1d'));
                                Tools.setCookie(Config.attackCountCookieName, '', Tools.getDate('-1d'));
                            }
                        }
                        else if (settings.type === 3) {
                            var attackCount = parseInt(Tools.getCookie(Config.attackCountCookieName));
                            if (isNaN(attackCount) || attackCount < 0) attackCount = 0;
                            attackCount++;
                            if (attackCount >= Config.maxAttackNum) {
                                Tools.setCookie(Config.autoAttackReadyCookieName, '', Tools.getDate('-1d'));
                            }
                            else {
                                Tools.setCookie(Config.attackCountCookieName, attackCount, Tools.getDate('+' + Config.defLootInterval + 'm'));
                            }
                        }
                        if (settings.type >= 2) {
                            $('.pd_layer').remove();
                            $msg.find('a:last').click(function (e) {
                                e.preventDefault();
                                Loot.showAttackLogDialog(1, attackLog, resultStat);
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
                            if (!$.isEmptyObject(itemNameList)) Item.useItemsAfterBatchAttack(itemNameList);
                        }
                    }
                    if (isRetakeSafeId) {
                        isRetakeSafeId = false;
                        console.log('重新获取SafeID Start');
                        $.get('kf_fw_ig_index.php', function (html) {
                            var safeIdMatches = /<a href="kf_fw_card_pk\.php\?safeid=(\w+)">/i.exec(html);
                            var safeId = '';
                            if (safeIdMatches) safeId = safeIdMatches[1];
                            if (!safeId) return;
                            settings.safeId = safeId;
                            if (Tools.getCookie(Config.autoAttackReadyCookieName))
                                Tools.setCookie(Config.autoAttackReadyCookieName, '2|' + safeId, Tools.getDate('+' + Config.defLootInterval + 'm'));
                            $(document).dequeue('BatchAttack');
                        }, 'html');
                    }
                    else {
                        window.setTimeout(function () {
                            $(document).dequeue('BatchAttack');
                        }, $.type(Config.perAttackInterval) === 'function' ? Config.perAttackInterval() : Config.perAttackInterval);
                    }
                },
                dataType: 'html'
            });
        };
        $(document).queue('BatchAttack', []);
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
         * @param {Object} attackList 攻击目标列表
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
            if (totalAttackNum > Config.maxAttackNum) {
                alert('攻击次数不得超过{0}次'.replace('{0}', Config.maxAttackNum));
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
                KFOL.showWaitMsg('<strong>正在批量攻击中，请耐心等待...</strong><i>攻击次数：<em id="pd_remaining_num">{0}</em></i><a target="_blank" href="/">浏览其它页面</a>'
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
            if (Config.autoLootEnabled && Tools.getCookie(Config.getLootAwardCookieName)) {
                $btn.prop('disabled', true);
                Tools.setCookie(Config.getLootAwardCookieName, '', Tools.getDate('-1d'));
                Loot.getLootAward();
            }
            else {
                $('form[name="rvrc1"]').submit(function () {
                    var gain = parseInt($btn.parent('td').find('span:eq(0)').text());
                    if (!isNaN(gain) && gain >= 0) {
                        var nextTime = Tools.getDate('+' + Config.defLootInterval + 'm').getTime() + 10 * 1000;
                        Tools.setCookie(Config.getLootAwardCookieName, '2|' + nextTime, new Date(nextTime));
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
                if ($('#pd_attack_sum').length > 0) return;

                var attackNum = 0, attackBurnNum = 0, strongAttackPercent = 0, deadlyAttackPercent = 1.5;
                var content = $lootInfo.html();
                var matches = /争夺攻击\s*\d+\(\+\d+\)=(\d+)\s*点/.exec(content);
                if (matches) attackNum = parseInt(matches[1]);
                matches = /争夺燃烧\s*\d+\(\+\d+\)=(\d+)\s*点/.exec(content);
                if (matches) attackBurnNum = parseInt(matches[1]);
                matches = /争夺暴击比例\s*\d+\(\+\d+\)=(\d+)\s*%/.exec(content);
                if (matches) strongAttackPercent = parseInt(matches[1]) / 100;

                var html =
                    '<div class="pd_cfg_main">' +
                    '  <table style="text-align:center">' +
                    '    <tbody>' +
                    '      <tr><th style="width:95px"></th><th style="width:120px">正常</th><th style="width:120px">致命一击(如果有)</th></tr>' +
                    '      <tr>' +
                    '        <th style="text-align:left">普通攻击</th>' +
                    '        <td class="pd_custom_tips" title="争夺攻击+争夺燃烧">{0}+{1}={2}</td>'
                        .replace('{0}', attackNum)
                        .replace('{1}', attackBurnNum)
                        .replace('{2}', attackNum + attackBurnNum) +
                    '        <td class="pd_custom_tips" title="争夺攻击×150%+争夺燃烧">{0}+{1}={2}</td>'
                        .replace('{0}', Math.round(attackNum * deadlyAttackPercent))
                        .replace('{1}', attackBurnNum)
                        .replace('{2}', Math.round(attackNum * deadlyAttackPercent) + attackBurnNum) +
                    '      </tr>' +
                    '      <tr>' +
                    '        <th style="text-align:left">暴击(如果有)</th>' +
                    '        <td class="pd_custom_tips" title="争夺攻击×暴击比例+争夺燃烧">{0}+{1}={2}</td>'
                        .replace('{0}', Math.round(attackNum * strongAttackPercent))
                        .replace('{1}', attackBurnNum)
                        .replace('{2}', Math.round(attackNum * strongAttackPercent) + attackBurnNum) +
                    '        <td class="pd_custom_tips" title="争夺攻击×暴击比例×150%+争夺燃烧">{0}+{1}={2}</td>'
                        .replace('{0}', Math.round(attackNum * strongAttackPercent * deadlyAttackPercent))
                        .replace('{1}', attackBurnNum)
                        .replace('{2}', Math.round(attackNum * strongAttackPercent * deadlyAttackPercent) + attackBurnNum) +
                    '      </tr>' +
                    '    </tbody>' +
                    '  </table>' +
                    '</div>';
                Dialog.create('pd_attack_sum', '攻击合计', html);
                Dialog.show('pd_attack_sum');
            });
        }
    },

    /**
     * 获取下次领取争夺奖励的时间对象
     * @returns {{type: number, time: number}} 下次领取争夺奖励的时间对象，type：时间类型（0：获取失败；1：估计时间；2：精确时间）；time：下次领取时间
     */
    getNextLootAwardTime: function () {
        var log = Tools.getCookie(Config.getLootAwardCookieName);
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
        var value = Tools.getCookie(Config.autoAttackReadyCookieName);
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
            else if (Config.attackWhenZeroLifeEnabled && !Tools.getCookie(Config.attackCheckCookieName))
                Loot.checkLife(safeId);
        }
        else {
            Loot.autoAttack(safeId);
        }
    },

    /**
     * 检查当前生命值是否不超过低保线
     * @param {string} safeId 用户的SafeID
     */
    checkLife: function (safeId) {
        console.log('检查生命值Start');
        $.get('kf_fw_ig_index.php', function (html) {
            if (Tools.getCookie(Config.attackCheckCookieName)) return;
            if (/本回合剩余攻击次数\s*0\s*次/.test(html)) {
                Tools.setCookie(Config.autoAttackReadyCookieName, '', Tools.getDate('-1d'));
                Tools.setCookie(Config.attackCheckCookieName, '', Tools.getDate('-1d'));
                Tools.setCookie(Config.attackCountCookieName, '', Tools.getDate('-1d'));
            }
            var time = Config.defCheckAttackInterval;
            var lifeMatches = />(\d+)<\/span>\s*预领KFB<br/i.exec(html);
            var minMatches = /你的神秘系数\]，则你可以领取(\d+)KFB\)<br/i.exec(html);
            var isAttack = false;
            if (lifeMatches && minMatches) {
                if (parseInt(lifeMatches[1]) <= parseInt(minMatches[1])) {
                    time = Loot.getZeroLifeCheckAttackInterval();
                    isAttack = true;
                }
            }
            var deadlyAttackNum = 0;
            if (Config.deadlyAttackId > 0) {
                var deadlyAttackMatches = /致命一击剩余攻击次数\s*(\d+)\s*次/i.exec(html);
                if (deadlyAttackMatches) deadlyAttackNum = parseInt(deadlyAttackMatches[1]);
                if (deadlyAttackNum > Config.maxAttackNum) deadlyAttackNum = Config.maxAttackNum;
            }
            var nextTime = Tools.getDate('+' + time + 'm');
            Tools.setCookie(Config.attackCheckCookieName, nextTime.getTime(), nextTime);
            if (isAttack) {
                var attackCount = parseInt(Tools.getCookie(Config.attackCountCookieName));
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
                KFOL.showWaitMsg('<strong>正在进行试探攻击中...</strong><i>攻击次数：<em id="pd_remaining_num">{0}</em></i>'
                    .replace('{0}', 1)
                    , true);
                Loot.batchAttack({
                    type: 3,
                    totalAttackNum: 1,
                    attackList: attackList,
                    safeId: safeId
                });
            }
        }, 'html');
    },

    /**
     * 获取在生命值不超过低保线时检查是否进行攻击的间隔时间（分钟）
     * @returns {number} 间隔时间（分钟）
     */
    getZeroLifeCheckAttackInterval: function () {
        var nextTime = Loot.getNextLootAwardTime().time;
        if (nextTime > 0) {
            var minutes = Config.defLootInterval - Math.floor((nextTime - (new Date()).getTime()) / 60 / 1000);
            if (minutes > 0) {
                for (var range in Config.zeroLifeCheckAttackIntervalList) {
                    var rangeArr = range.split('-');
                    if (rangeArr.length !== 2) continue;
                    var start = parseInt(rangeArr[0]), end = parseInt(rangeArr[1]);
                    if (minutes >= start && minutes <= end) {
                        console.log('距本回合开始已经过{0}分钟，下一次检查生命值的间隔时间为{1}分钟'
                            .replace('{0}', minutes)
                            .replace('{1}', Config.zeroLifeCheckAttackIntervalList[range])
                        );
                        return Config.zeroLifeCheckAttackIntervalList[range];
                    }
                }
            }
        }
        return Config.defZeroLifeCheckAttackInterval;
    },

    /**
     * 显示批量攻击或被NPC攻击的日志对话框
     * @param {number} type 对话框类型，1：批量攻击日志；2：被NPC攻击日志
     * @param {string} log 批量攻击日志
     * @param {string} stat 批量攻击收获
     */
    showAttackLogDialog: function (type, log, stat) {
        if ($('#pd_attack_log').length > 0) return;
        log = log.replace(/\n/g, '<br />');
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
            '  <div id="pd_attack_log_content" class="pd_stat"></div>' +
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
            if (type === 1) log += '<br /><b>统计结果{0}：</b><br />'.replace('{0}', extraLog) + (stat ? stat : '无');
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
    }
};
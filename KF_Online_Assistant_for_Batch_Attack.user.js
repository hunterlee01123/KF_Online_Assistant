// ==UserScript==
// @name        KF Online助手 for 批量攻击
// @namespace   https://greasyfork.org/users/4514
// @icon        https://raw.githubusercontent.com/miaolapd/KF_Online_Assistant/master/icon.png
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/KF_Online_Assistant
// @description 专用于批量攻击的KFOL助手脚本
// @include     http://2dgal.com/*
// @include     http://*.2dgal.com/*
// @include     http://9baka.com/*
// @include     http://*.9baka.com/*
// @version     1.0.0
// @grant       none
// @run-at      document-end
// @license     MIT
// ==/UserScript==
/**
 * 配置类
 */
var Config = {
    // 当脚本加载完毕后无需确定即可自动进行批量攻击，true：开启；false：关闭
    autoAttackEnabled: false,
    // 批量攻击的目标列表，格式：{怪物ID:次数}，例：{1:10,2:10}
    batchAttackList: {},

    // 每回合攻击的最大次数
    maxAttackNum: 20,
    // 每次攻击的时间间隔（毫秒）
    perAttackInterval: 2000,
    // 默认提示消息的持续时间（秒），设置为-1表示永久显示
    defShowMsgDuration: -1
};

/**
 * 设置对话框类
 */
var ConfigDialog = {
    // 保存设置的键值名称
    name: 'pd_attack_config',
    // 默认的Config对象
    defConfig: {},

    /**
     * 初始化
     */
    init: function () {
        $.extend(true, ConfigDialog.defConfig, Config);
        ConfigDialog.read();
    },

    /**
     * 获取经过规范化的Config对象
     * @param {Config} options 待处理的Config对象
     * @returns {Config} 经过规范化的Config对象
     */
    getNormalizationConfig: function (options) {
        var settings = {};
        var defConfig = ConfigDialog.defConfig;
        if ($.type(options) != 'object') return settings;
        settings.autoAttackEnabled = typeof options.autoAttackEnabled === 'boolean' ?
            options.autoAttackEnabled : defConfig.autoAttackEnabled;
        if (typeof options.batchAttackList != 'undefined') {
            if ($.type(options.batchAttackList) == 'object') {
                settings.batchAttackList = {};
                var totalAttackNum = 0;
                for (var id in options.batchAttackList) {
                    var attackNum = parseInt(options.batchAttackList[id]);
                    if (!isNaN(attackNum) && attackNum > 0) {
                        settings.batchAttackList[parseInt(id)] = attackNum;
                        totalAttackNum += attackNum;
                    }
                }
                if (totalAttackNum > Config.maxAttackNum) settings.batchAttackList = defConfig.batchAttackList;
            }
            else settings.batchAttackList = defConfig.batchAttackList;
        }
        return settings;
    },

    /**
     * 读取设置
     */
    read: function () {
        var options = localStorage[ConfigDialog.name];
        if (!options) return;
        try {
            options = JSON.parse(options);
        }
        catch (ex) {
            return;
        }
        if (!options || $.type(options) != 'object' || $.isEmptyObject(options)) return;
        options = ConfigDialog.getNormalizationConfig(options);
        Config = $.extend(true, {}, ConfigDialog.defConfig, options);
    },

    /**
     * 写入设置
     */
    write: function () {
        var options = KFOL.getDifferentValueOfObject(ConfigDialog.defConfig, Config);
        localStorage[ConfigDialog.name] = JSON.stringify(options);
    },

    /**
     * 清空设置
     */
    clear: function () {
        localStorage.removeItem(ConfigDialog.name);
    }
};

/**
 * KFOL主类
 */
var KFOL = {
    // 用户ID
    uid: 0,
    // 用户名
    userName: '',

    /**
     * 获取B对象中与A对象拥有同样字段并且值不同的新对象
     * @param {Object} a 对象A
     * @param {Object} b 对象B
     * @returns {Object} 新的对象
     */
    getDifferentValueOfObject: function (a, b) {
        var c = {};
        if ($.type(a) !== 'object' || $.type(b) !== 'object') return c;
        $.each(b, function (index, key) {
            if (typeof a[index] !== 'undefined') {
                if (!KFOL.deepEqual(a[index], key)) c[index] = key;
            }
        });
        return c;
    },

    /**
     * 深度比较两个对象是否相等
     * @param {*} a
     * @param {*} b
     * @returns {boolean} 是否相等
     */
    deepEqual: function (a, b) {
        if (a === b) return true;
        if ($.type(a) !== $.type(b)) return false;
        if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
        if ($.isArray(a) && $.isArray(b) || $.type(a) === 'object' && $.type(b) === 'object') {
            if (a.length !== b.length) return false;
            var c = $.extend($.isArray(a) ? [] : {}, a, b);
            for (var i in c) {
                if (typeof a[i] === 'undefined' || typeof b[i] === 'undefined') return false;
                if (!KFOL.deepEqual(a[i], b[i])) return false;
            }
            return true;
        }
        return false;
    },

    /**
     * 获取Uid和用户名
     * @returns {boolean} 是否获取成功
     */
    getUidAndUserName: function () {
        var $user = $('.topright a[href^="profile.php?action=show&uid="]').eq(0);
        if ($user.length == 0) return false;
        KFOL.userName = $user.text();
        if (!KFOL.userName) return false;
        var matches = /&uid=(\d+)/.exec($user.attr('href'));
        if (!matches) return false;
        KFOL.uid = matches[1];
        return true;
    },

    /**
     * 获取用户的SafeID
     */
    getSafeId: function () {
        var matches = /safeid=(\w+)/i.exec($('a[href*="safeid="]').eq(0).attr('href'));
        if (!matches) return '';
        else return matches[1];
    },

    /**
     * 添加CSS样式
     */
    appendCss: function () {
        $('head').append(
            '<style type="text/css">' +
            '.pd_layer { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 1000; }' +
            '.pd_pop_box { position: fixed; width: 100%; z-index: 1001; }' +
            '.pd_pop_tips {' +
            '  border: 1px solid #6ca7c0; text-shadow: 0 0 3px rgba(0,0,0,0.1); border-radius: 3px; padding: 12px 40px; text-align: center;' +
            '  font-size: 14px; position: absolute; display: none; color: #333; background: #f8fcfe; background-repeat: no-repeat;' +
            '  background-image: -webkit-linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: -moz-linear-gradient(top, #F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: -o-linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: -ms-linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '  background-image: linear-gradient(#F9FCFE, #F6FBFE 25%, #EFF7FC);' +
            '}' +
            '.pd_pop_tips strong { margin-right: 5px; }' +
            '.pd_pop_tips i { font-style: normal; padding-left: 10px; }' +
            '.pd_pop_tips em, .pd_stat em, .pd_pop_tips ins, .pd_stat ins { font-weight: 700; font-style: normal; color:#FF6600; padding: 0 5px; }' +
            '.pd_pop_tips ins, .pd_stat ins { text-decoration: none; color: #339933; }' +
            '.pd_pop_tips a { font-weight: bold; margin-left: 15px; }' +
            '.pd_stat i { font-style: normal; margin-right: 3px; }' +
            '.pd_stat .pd_notice { margin-left: 5px; }' +
            '.pd_highlight { color: #FF0000 !important; }' +
            '.pd_notice, .pd_pop_tips .pd_notice { font-style: italic; color: #666; }' +
            '.pd_input { vertical-align: middle; height: inherit; margin-right: 0; line-height: 22px; font-size: 12px; }' +
            '.pd_input[type="text"] { height: 18px; line-height: 18px; }' +
            '.pd_input:focus { border-color: #7EB4EA; }' +
            '.pd_item_btns { text-align: right; margin-top: 5px;  }' +
            '.pd_item_btns button, .pd_item_btns input { margin-left: 3px; margin-bottom: 2px; vertical-align: middle; }' +
            '.pd_result { border: 1px solid #99F; padding: 5px; margin-top: 10px; line-height: 2em; }' +
            '</style>'
        );
    },

    /**
     * 显示提示消息
     * @param {(string|Object)} options 提示消息或设置对象
     * @param {string} [options.msg] 提示消息
     * @param {number} [options.duration={@link Config.defShowMsgDuration}] 提示消息持续时间（秒），-1为永久显示
     * @param {boolean} [options.clickable=true] 消息框可否手动点击消除
     * @param {boolean} [options.preventable=false] 是否阻止点击网页上的其它元素
     * @param {number} [duration] 提示消息持续时间（秒），-1为永久显示
     * @example
     * KFOL.showMsg('<strong>抽取道具或卡片</strong><i>道具<em>+1</em></i>');
     * KFOL.showMsg({msg: '<strong>抽取神秘盒子</strong><i>KFB<em>+8</em></i>', duration: 20, clickable: false});
     * @returns {jQuery} 消息框的jQuery对象
     */
    showMsg: function (options, duration) {
        var settings = {
            msg: '',
            duration: Config.defShowMsgDuration,
            clickable: true,
            preventable: false
        };
        if ($.type(options) == 'object') {
            $.extend(settings, options);
        }
        else {
            settings.msg = options;
            settings.duration = typeof duration == 'undefined' ? Config.defShowMsgDuration : duration;
        }
        var $popBox = $('.pd_pop_box');
        var isFirst = $popBox.length == 0;
        if (settings.preventable && $('.pd_layer').length == 0) {
            $('<div class="pd_layer"></div>').appendTo('body');
        }
        if (isFirst) {
            $popBox = $('<div class="pd_pop_box"></div>').appendTo('body');
        }
        var $popTips = $('<div class="pd_pop_tips">' + settings.msg + '</div>').appendTo($popBox);
        if (settings.clickable) {
            $popTips.css('cursor', 'pointer').click(function () {
                $(this).stop(true, true).fadeOut('slow', function () {
                    KFOL.removePopTips($(this));
                });
            }).find('a').click(function (event) {
                event.stopPropagation();
            });
        }
        var popTipsHeight = $popTips.outerHeight();
        var popTipsWidth = $popTips.outerWidth();
        if (isFirst) {
            $popBox.css('top', $(window).height() / 2 - popTipsHeight / 2);
        }
        else {
            $popBox.animate({'top': '-=' + popTipsHeight / 1.5});
        }
        var $prev = $popTips.prev('.pd_pop_tips');
        $popTips.css('top', $prev.length > 0 ? parseInt($prev.css('top')) + $prev.outerHeight() + 5 : 0)
            .css('left', $(window).width() / 2 - popTipsWidth / 2)
            .fadeIn('slow');
        if (settings.duration != -1) {
            $popTips.delay(settings.duration * 1000).fadeOut('slow', function () {
                KFOL.removePopTips($(this));
            });
        }
        return $popTips;
    },

    /**
     * 显示等待消息
     * @param {string} msg 等待消息
     * @param {boolean} [preventable=false] 是否阻止点击网页上的其它元素
     * @returns {jQuery} 消息框的jQuery对象
     */
    showWaitMsg: function (msg, preventable) {
        return KFOL.showMsg({msg: msg, duration: -1, clickable: false, preventable: preventable == true});
    },

    /**
     * 移除指定的提示消息框
     * @param {jQuery} $popTips 指定的消息框节点
     */
    removePopTips: function ($popTips) {
        var $parent = $popTips.parent();
        $popTips.remove();
        if ($('.pd_pop_tips').length == 0) {
            $parent.remove();
            $('.pd_layer').remove();
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
     * @param {number} options.totalAttackNum 总攻击次数
     * @param {Object} options.attackList 攻击目标列表
     * @param {string} options.safeId 用户的SafeID
     */
    batchAttack: function (options) {
        var settings = {
            totalAttackNum: 0,
            attackList: {},
            safeId: ''
        };
        $.extend(settings, options);
        $('.kf_fw_ig1').parent().append('<div class="pd_result"><strong>攻击结果：</strong><ul></ul></div>');
        var count = 0, successNum = 0, failNum = 0, strongAttackNum = 0, criticalStrikeNum = 0;
        var gain = {'夺取KFB': 0, '经验值': 0};
        var isStop = false;
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
                        $.each(KFOL.getGainViaMsg(msg), function (key, data) {
                            if (key == 'item') {
                                if (typeof gain[key] == 'undefined') gain['item'] = {};
                                for (var k in data) {
                                    if (typeof gain['item'][k] == 'undefined') gain['item'][k] = data[k];
                                    else gain['item'][k] += data[k];
                                }
                            }
                            else {
                                if (typeof gain[key] == 'undefined') gain[key] = data;
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
                    else {
                        isStop = true;
                        $(document).queue('BatchAttack', []);
                    }
                    console.log('【批量攻击】第{0}次：{1}{2}'.replace('{0}', count).replace('{1}', msg).replace('{2}', isStop ? '（攻击已中止）' : ''));
                    var html = '<li><b>第{0}次：</b>{1}{2}</li>'
                        .replace('{0}', count)
                        .replace('{1}', msg)
                        .replace('{2}', isStop ? '<span class="pd_notice">（攻击已中止）</span>' : '');
                    $('.pd_result:last > ul').append(html);

                },
                error: function () {
                    failNum++;
                    console.log('【批量攻击】第{0}次：{1}'.replace('{0}', count).replace('{1}', '网络超时'));
                    var html = '<li><b>第{0}次：</b>{1}</li>'
                        .replace('{0}', count)
                        .replace('{1}', '<span class="pd_notice">网络超时</span>');
                    $('.pd_result:last > ul').append(html);
                    $(document).queue('BatchAttack', function () {
                        attack(id);
                    });
                },
                complete: function () {
                    var $remainingNum = $('#pd_remaining_num');
                    $remainingNum.text(settings.totalAttackNum + failNum - count);
                    if (isStop || count == settings.totalAttackNum + failNum) {
                        KFOL.removePopTips($remainingNum.closest('.pd_pop_tips'));
                        if (gain['夺取KFB'] == 0) delete gain['夺取KFB'];
                        if (gain['经验值'] == 0) delete gain['经验值'];
                        var msgStat = '', logStat = '', resultStat = '';
                        for (var key in gain) {
                            if (key == 'item') {
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
                        console.log('共有{0}次攻击成功'.replace('{0}', successNum) + logStat);
                        var extraMsg = '';
                        if (strongAttackNum > 0) extraMsg += '暴击<em>+{0}</em>'.replace('{0}', strongAttackNum);
                        if (criticalStrikeNum > 0) extraMsg += (extraMsg ? ' ' : '') + '致命一击<em>+{0}</em>'.replace('{0}', criticalStrikeNum);
                        if (extraMsg) extraMsg = '（' + extraMsg + '）';
                        KFOL.showMsg('<strong>共有<em>{0}</em>次攻击成功{1}</strong>{2}'
                                .replace('{0}', successNum)
                                .replace('{1}', extraMsg)
                                .replace('{2}', msgStat)
                            , -1);
                        var $result = $('.pd_result:last');
                        $result.append('<div class="pd_stat"><b>统计结果{0}：</b><br />{1}</div>'
                                .replace('{0}', extraMsg)
                                .replace('{1}', resultStat ? resultStat : '无')
                        );
                    }
                    window.setTimeout(function () {
                        $(document).dequeue('BatchAttack');
                    }, Config.perAttackInterval);
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
        $('.pd_batch_attack .pd_input').keydown(function (event) {
            if (event.keyCode == 13) {
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
        /**
         * 开始攻击
         */
        var startAttack = function () {
            KFOL.removePopTips($('.pd_pop_tips'));
            var attackList = {};
            var totalAttackNum = getAttackNum(attackList);
            if (!totalAttackNum) return;
            if (Config.autoAttackEnabled || window.confirm('准备进行{0}次批量攻击，是否开始攻击？'.replace('{0}', totalAttackNum))) {
                KFOL.showWaitMsg('<strong>正在批量攻击中，请耐心等待...</strong><i>攻击次数：<em id="pd_remaining_num">{0}</em></i><a target="_blank" href="/">浏览其它页面</a>'
                        .replace('{0}', totalAttackNum)
                    , true);
                KFOL.batchAttack({type: 1, totalAttackNum: totalAttackNum, attackList: attackList, safeId: safeId});
            }
        };
        $('<div class="pd_item_btns"><label><input id="pd_auto_attack_enabled" class="pd_input" type="checkbox" title="当脚本加载完毕后无需确定即可自动进行批量攻击" />' +
        ' 自动开始攻击</label> <button>保存设置</button><button>清除设置</button><button><b>批量攻击</b></button></div>')
            .insertAfter('.kf_fw_ig1')
            .find('button:first')
            .click(function () {
                var attackList = {};
                var totalAttackNum = getAttackNum(attackList);
                if (totalAttackNum == 0) return;
                Config.batchAttackList = attackList;
                Config.autoAttackEnabled = $('#pd_auto_attack_enabled').prop('checked');
                ConfigDialog.write();
                alert('设置已保存');
            })
            .next()
            .click(function () {
                ConfigDialog.clear();
                alert('设置已清除');
            })
            .next()
            .click(startAttack);
        if (Config.autoAttackEnabled) {
            $('#pd_auto_attack_enabled').prop('checked', true);
            startAttack();
        }
    },

    /**
     * 初始化
     */
    init: function () {
        if (location.pathname != '/kf_fw_ig_pklist.php') return;
        if (typeof jQuery == 'undefined') return;
        var startDate = new Date();
        //console.log('【KF Online助手 for 批量攻击】启动');
        ConfigDialog.init();
        if (!KFOL.getUidAndUserName()) return;
        KFOL.appendCss();
        KFOL.addBatchAttackButton();
        var endDate = new Date();
        console.log('【KF Online助手 for 批量攻击】加载完毕，加载耗时：{0}ms'.replace('{0}', endDate - startDate));
    }
};

KFOL.init();
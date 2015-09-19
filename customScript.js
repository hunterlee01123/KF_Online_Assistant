// 在不同时间段内采用不同的自动攻击方式 V1.1
(function () {
    var settings = {'19:00-01:00': 660, '08:00-19:00': 90}; // 格式：{'时间段': 分钟数, '时间段': 分钟数}
    var now = new Date();
    for (var range in settings) {
        var newValue = settings[range];
        if (Config.attackAfterTime === newValue) continue;
        if (Tools.isBetweenInTimeRange(now, range)) {
            console.log('【在距本回合结束前指定时间内才完成攻击】的设置被修改为：' + newValue + '分钟');
            Config.attackAfterTime = newValue;
            ConfigDialog.write();
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

// 屏蔽标题包含指定关键词的帖子 V1.0
(function () {
    // 屏蔽关键词列表，可使用普通关键词及正则表达式，例：['标题1', /Title.*2/i]
    var keyWords = ['标题1'];

    var isInclude = function (str) {
        for (var i in keyWords) {
            var re = null;
            if (typeof keyWords[i].test === 'undefined') re = new RegExp(keyWords[i], 'i');
            else re = keyWords[i];
            if (re.test(str)) return true;
        }
        return false;
    };

    var num = 0;
    if (KFOL.isInHomePage) {
        $('.b_tit4 a, .b_tit4_1 a').each(function () {
            var $this = $(this);
            if (isInclude($this.text())) {
                num++;
                $this.parent('li').remove();
            }
        });
    }
    else if (location.pathname === '/thread.php') {
        $('.threadtit1 a').each(function () {
            var $this = $(this);
            if (isInclude($this.text())) {
                num++;
                $this.closest('tr').remove();
            }
        });
    }
    else if (location.pathname === '/read.php') {
        var title = $('a[href^="kf_tidfavor.php?action=favor"]:first').closest('tr').prev('tr').find('td > span').text();
        if (isInclude(title)) {
            alert('此帖子标题包含屏蔽关键词，建议立即关闭页面！');
        }
    }
    if (num > 0) console.log('共有{0}个帖子被屏蔽'.replace('{0}', num));
}());

/*==========================================*/

// 在本回合剩余攻击次数不小于指定次数的情况下，抽取神秘盒子以延长争夺时间 V1.0
(function () {
    var maxAttackCount = 10; // 在不小于指定剩余攻击次数时触发提示
    var checkAttackCountCookieName = 'pd_check_attack_count';

    if (Config.autoLootEnabled && !Tools.getCookie(Config.getLootAwardCookieName)) {
        Config.autoLootEnabled = false;
        var oriAutoRefreshEnabled = Config.autoRefreshEnabled;
        if (oriAutoRefreshEnabled && KFOL.isInHomePage) Config.autoRefreshEnabled = false;
        if (location.pathname === '/kf_smbox.php') return;
        if (Tools.getCookie(checkAttackCountCookieName)) return;
        console.log('检查剩余攻击次数Start');
        $.get('kf_fw_ig_index.php', function (html) {
            if (Tools.getCookie(checkAttackCountCookieName)) return;
            Tools.setCookie(checkAttackCountCookieName, 1, Tools.getDate('+1m'));
            if (!/已经可以领取KFB/i.test(html)) {
                if (!Tools.getCookie(Config.getLootAwardCookieName)) continueLoot();
                return;
            }
            var matches = /本回合剩余攻击次数\s*(\d+)\s*次/.exec(html);
            var count = 0;
            if (matches) count = parseInt(matches[1]);
            if (count >= maxAttackCount) {
                if (window.confirm('检测到本回合剩余攻击次数还有{0}次，是否抽取神秘盒子以延长争夺时间？'.replace('{0}', count))) {
                    KFOL.drawSmbox();
                }
            }
            else {
                continueLoot();
            }
        }, 'html');

        var continueLoot = function () {
            Config.autoLootEnabled = true;
            if (!Tools.getCookie(Config.getLootAwardCookieName)) Loot.getLootAward();
            if (oriAutoRefreshEnabled && KFOL.isInHomePage) {
                Config.autoRefreshEnabled = true;
                setTimeout(KFOL.startAutoRefreshMode, 60 * 1000);
            }
        }
    }
}());

/*==========================================*/

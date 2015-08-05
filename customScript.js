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

// ==UserScript==
// @name        屏蔽首页神秘系数排名
// @version     1.1
// @trigger     end
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=12708083
// ==/UserScript==
'use strict';
(function () {
    const Info = _interopRequireDefault(require('./Info')).default;
    if (Info.isInHomePage) {
        let $smRank = $('a[href="kf_growup.php"]');
        let matches = /神秘\d+级/.exec($smRank.text());
        if (matches) $smRank.html(matches[0]);
    }
})();
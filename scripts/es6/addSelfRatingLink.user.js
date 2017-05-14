// ==UserScript==
// @name        在帖子页面添加自助评分链接
// @version     1.1
// @trigger     end
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13292185
// @description 在帖子页面添加自助评分链接（仅限自助评分测试人员使用）
// ==/UserScript==
'use strict';
(function () {
    if (location.pathname !== '/read.php') return;
    // 可进行自助评分的版块ID列表
    const selfRatingFidList = [41, 67, 92, 127, 68];
    const Public = require('./Public');

    let fid = parseInt($('input[name="fid"]:first').val());
    if (!fid || !selfRatingFidList.includes(fid)) return;
    let tid = parseInt($('input[name="tid"]:first').val());
    let safeId = Public.getSafeId();
    if (!safeId || !tid) return;
    if ($('.readtext:first fieldset legend:contains("本帖最近评分记录")').length > 0) return;
    $('a[href^="kf_tidfavor.php?action=favor"]').parent().append(
        `<span style="margin: 0 5px;">|</span><a href="kf_fw_1wkfb.php?do=1&safeid=${safeId}&ptid=${tid}">自助评分</a>`
    );
})();
// ==UserScript==
// @name        在帖子页面添加自助评分链接
// @version     1.0
// @trigger     end
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13292185
// @description 在帖子页面添加自助评分链接（仅限自助评分测试人员使用）
// ==/UserScript==
'use strict';

(function () {
    if (location.pathname !== '/read.php') return;
    // 可进行自助评分的版块ID列表
    var selfRatingFidList = [41, 67, 92, 127, 68];
    var Public = require('./Public');

    var fid = parseInt($('input[name="fid"]:first').val());
    if (!fid || !selfRatingFidList.includes(fid)) return;
    var tid = parseInt($('input[name="tid"]:first').val());
    var safeId = Public.getSafeId();
    if (!safeId || !tid) return;
    if ($('.readtext:first fieldset legend:contains("本帖最近评分记录")').length > 0) return;
    $('a[href^="kf_tidfavor.php?action=favor"]').after('<span style="margin: 0 5px;">|</span><a href="kf_fw_1wkfb.php?do=1&safeid=' + safeId + '&ptid=' + tid + '">\u81EA\u52A9\u8BC4\u5206</a>');
})();
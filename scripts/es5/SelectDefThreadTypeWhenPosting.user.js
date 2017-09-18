// ==UserScript==
// @name        在发帖时为指定版块自动选择默认分类
// @version     1.0
// @trigger     end
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13742299
// @description 在发帖时为指定版块自动选择所设定的默认分类
// ==/UserScript==
'use strict';

(function () {
    if (location.pathname !== '/post.php' || $('input[name="action"]').val() !== 'new') return;

    // 默认帖子分类列表，格式：{版块ID: '帖子分类名称'}，例：{92: '完结动画', 68: '动漫音乐'}
    var defThreadTypeList = { 92: '完结动画', 68: '动漫音乐' };

    var fid = parseInt($('input[name="fid"]').val());
    if (!(fid in defThreadTypeList)) return;
    var $threadType = $('select[name="p_type"]');
    var threadTypeId = $threadType.find('option').filter(function (i, elem) {
        return $(elem).text() === defThreadTypeList[fid];
    }).attr('value');
    if (threadTypeId) {
        $threadType.val(threadTypeId);
    }
})();
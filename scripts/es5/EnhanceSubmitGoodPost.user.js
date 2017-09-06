// ==UserScript==
// @name        增强提交优秀帖
// @version     1.0
// @trigger     end
// @author      喵拉布丁
// @homepage    read.php?tid=500968&spid=13719455
// @description 在提交优秀帖时，检查当前页面该会员的回帖是否已被评为优秀帖，并高亮显示当前楼层
// ==/UserScript==
'use strict';

(function () {
    if (location.pathname !== '/read.php') return;

    $('a[id^="cztz"]').attr('data-onclick', function () {
        return $(this).attr('onclick');
    }).removeAttr('onclick');

    $('#alldiv').on('click', 'a[id^="cztz"]', function () {
        var $this = $(this);
        var $floor = $this.closest('div[id^="floor"]').next('.readtext');

        var url = $floor.find('.readidmsbottom, .readidmleft').find('a[href^="profile.php?action=show"]').attr('href');
        var flag = false;
        $('.readidmsbottom, .readidmleft').find('a[href="' + url + '"]').each(function () {
            if ($(this).closest('.readtext').find('.read_fds:contains("本帖为优秀帖")').length > 0) {
                flag = true;
                return false;
            }
        });
        if (flag && !confirm('在当前页面中该会员已经有回帖被评为优秀帖，是否继续？')) return;

        $floor.css({ 'outline': '3px solid #f00', 'outline-offset': '-3px' });

        try {
            eval($this.data('onclick'));
        } catch (ex) {
            console.log(ex);
        }
    });
})();
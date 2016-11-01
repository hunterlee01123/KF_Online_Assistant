/**
 * 争夺类
 */
var Loot = {
    /**
     * 增强争夺首页
     */
    enhanceLootIndexPage: function () {
        var $area = $('.kf_fw_ig1');
        var $property = $area.find('tbody > tr:nth-child(2) > td:first-child');
        var maxPoint = 0;
        var matches = /可分配属性点：(\d+)/.exec($property.html());
        if (matches) maxPoint = parseInt(matches[1]);

        $area.find('[type="text"]').attr('type', 'number').attr('min', 1).attr('max', 999).css('width', '60px');
        $area.find('input[readonly]').attr('min', 0).prop('disabled', true);

        /**
         * 获取已分配的属性点
         * @returns {number}
         */
        var getUsedPoint = function () {
            var usedPoint = 0;
            $area.find('[type="number"]').each(function () {
                var point = parseInt($(this).val());
                if (point && point > 0) usedPoint += point;
            });
            return usedPoint;
        };

        $property.next('td').prepend(
            '<span class="pd_highlight">剩余属性点：<span id="pd_surplus_point">{0}</span></span><br>'.replace('{0}', maxPoint - getUsedPoint())
        );

        $area.on('change', '[type="number"]', function () {
            $('#pd_surplus_point').text(maxPoint - getUsedPoint());
        });

        $area.closest('form').submit(function () {
            var surplusPoint = maxPoint - getUsedPoint();
            if (surplusPoint < 0) {
                alert('剩余属性点为负，请重新填写');
                return false;
            }
            else if (surplusPoint > 0) {
                return confirm('你的可分配属性点尚未用完，是否提交？');
            }
        });
    },

    /**
     * 在争夺排行页面添加用户链接
     */
    addUserLinkInPkListPage: function () {
        $('.kf_fw_ig1 > tbody > tr:gt(0) > td:nth-child(2)').each(function () {
            var $this = $(this);
            $this.html('<a href="profile.php?action=show&username={0}" target="_blank">{0}</a>'.replace(/\{0}/g, $this.text().trim()));
        });
    }
};
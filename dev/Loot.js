/**
 * 争夺类
 */
var Loot = {
    /**
     * 增强争夺首页
     */
    enhanceLootIndexPage: function () {
        var $area = $('.kf_fw_ig1');
        var $properties = $area.find('> tbody > tr:nth-child(3) > td:first-child');
        var $points = $properties.next('td');
        var propertyList = Loot.getCurrentLootPropertyList();
        var itemUsedNumList = Item.getItemUsedInfo($area.find('> tbody > tr:nth-child(4) > td').html());

        $properties.html(
            $properties.html().replace(
                '技能伤害：攻击伤害+(体质点数*4)', '技能伤害：<span class="pd_custom_tips" id="pd_skill_attack" title="攻击伤害+(体质点数*4)"></span>'
            )
        );
        $properties.find('br').each(function (index) {
            var name = '';
            switch (index) {
                case 1:
                    name = 's1';
                    break;
                case 2:
                    name = 's2';
                    break;
                case 3:
                    name = 'd1';
                    break;
                case 4:
                    name = 'd2';
                    break;
                case 6:
                    name = 'i1';
                    break;
                case 7:
                    name = 'i2';
                    break;
            }
            if (name) {
                $(this).before(' <span style="color:#777" id="pd_new_{0}"></span>'.replace('{0}', name));
            }
        });

        $points.find('[type="text"]').attr('type', 'number').attr('min', 1).attr('max', 999).prop('required', true).css('width', '60px');
        $points.find('input[readonly]').attr('min', 0).prop('disabled', true).removeProp('required', true);
        $points.prepend('<span class="pd_highlight">剩余属性点：<span id="pd_surplus_point"></span></span><br>');

        $points.on('change', '[type="number"]', function () {
            var $this = $(this);
            $('#pd_surplus_point').text(propertyList['可分配属性点'] - Loot.getCurrentAssignedPoint());
            Loot.showNewLootProperty($this, propertyList, itemUsedNumList);
            Loot.showSumOfPoint($this);

            var skillAttack = 0;
            var matches = /\d+/.exec($area.find('[name="s1"]').next('span').next('.pd_point_sum').text());
            if (matches) skillAttack = parseInt(matches[0]) * 5;
            skillAttack += parseInt($area.find('[name="s2"]').val()) * 4;
            $('#pd_skill_attack').text(skillAttack);
        }).on('click', '.pd_point_sum', function () {
            var surplusPoint = propertyList['可分配属性点'] - Loot.getCurrentAssignedPoint();
            if (!surplusPoint) return;
            var $point = $(this).prev('span').prev('[type="number"]');
            var num = parseInt($point.val());
            if (isNaN(num) || num < 0) num = 0;
            $point.val(num + surplusPoint).trigger('change');
        }).find('form').submit(function () {
            var surplusPoint = propertyList['可分配属性点'] - Loot.getCurrentAssignedPoint();
            if (surplusPoint < 0) {
                alert('剩余属性点为负，请重新填写');
                return false;
            }
            else if (surplusPoint > 0) {
                return confirm('你的可分配属性点尚未用完，是否提交？');
            }
        }).find('[type="number"]').trigger('change');

        Loot.enhanceLootLog();
    },

    /**
     * 获取当前已分配的属性点
     * @returns {number} 当前已分配的属性点
     */
    getCurrentAssignedPoint: function () {
        var usedPoint = 0;
        $('.kf_fw_ig1').find('[type="number"]').each(function () {
            var point = parseInt($(this).val());
            if (point && point > 0) usedPoint += point;
        });
        return usedPoint;
    },

    /**
     * 显示各项属性点的和值
     */
    showSumOfPoint: function ($point) {
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        var extraNum = parseInt($point.next('span').text());
        var $sum = $point.next('span').next('.pd_point_sum');
        if (!$sum.length) {
            $sum = $('<span class="pd_point_sum" style="color:#FF0033;cursor:pointer" title="点击：给该项加上或减去剩余属性点"></span>')
                .insertAfter($point.next('span'));
        }
        $sum.text('=' + (num + extraNum));
    },

    /**
     * 获取当前的争夺属性
     * @returns {{}} 争夺属性
     */
    getCurrentLootPropertyList: function () {
        var propertyList = {
            '攻击力': 0,
            '最大生命值': 0,
            '攻击速度': 0,
            '暴击几率': 0,
            '技能释放概率': 0,
            '防御': 0,
            '可分配属性点': 0
        };
        var html = $('.kf_fw_ig1 > tbody > tr:nth-child(3) > td:first-child').html();
        var matches = /攻击力：(\d+)/.exec(html);
        if (matches) propertyList['攻击力'] = parseInt(matches[1]);
        matches = /生命值：\d+\s*\(最大(\d+)\)/.exec(html);
        if (matches) propertyList['最大生命值'] = parseInt(matches[1]);
        matches = /攻击速度：(\d+)/.exec(html);
        if (matches) propertyList['攻击速度'] = parseInt(matches[1]);
        matches = /暴击几率：(\d+)%/.exec(html);
        if (matches) propertyList['暴击几率'] = parseInt(matches[1]);
        matches = /技能释放概率：(\d+)%/.exec(html);
        if (matches) propertyList['技能释放概率'] = parseInt(matches[1]);
        matches = /防御：(\d+)%/.exec(html);
        if (matches) propertyList['防御'] = parseInt(matches[1]);
        matches = /可分配属性点：(\d+)/.exec(html);
        if (matches) propertyList['可分配属性点'] = parseInt(matches[1]);
        return propertyList;
    },

    /**
     * 显示新的争夺属性
     * @param {jQuery} $point 属性字段
     * @param {{}} currentLootProperty 当前的争夺属性
     * @param {{}} itemUsedNumList 道具使用情况对象
     */
    showNewLootProperty: function ($point, currentLootProperty, itemUsedNumList) {
        var name = $point.attr('name');
        var num = parseInt($point.val());
        if (isNaN(num) || num < 0) num = 0;
        var oriNum = parseInt($point.get(0).defaultValue);
        var extraNum = parseInt($point.next('span').text());
        var newValue = 0, diffValue = 0, unit = '';
        switch (name) {
            case 's1':
                newValue = (num + extraNum) * 5;
                diffValue = newValue - currentLootProperty['攻击力'];
                break;
            case 's2':
                newValue = (num + extraNum) * 20 + (itemUsedNumList['蕾米莉亚同人漫画'] === 50 ? 700 : 0);
                diffValue = newValue - currentLootProperty['最大生命值'];
                break;
            case 'd1':
                newValue = (num + extraNum) * 2 + (itemUsedNumList['十六夜同人漫画'] === 50 ? 100 : 0);
                diffValue = newValue - currentLootProperty['攻击速度'];
                break;
            case 'd2':
                newValue = num + extraNum;
                newValue = Math.round(newValue / (newValue + 100) * 100);
                diffValue = newValue - currentLootProperty['暴击几率'];
                unit = '%';
                break;
            case 'i1':
                newValue = num + extraNum;
                newValue = Math.round(newValue / (newValue + 120) * 100);
                diffValue = newValue - currentLootProperty['技能释放概率'];
                unit = '%';
                break;
            case 'i2':
                newValue = num + extraNum;
                newValue = Math.round(newValue / (newValue + 150) * 100);
                diffValue = newValue - currentLootProperty['防御'];
                unit = '%';
                break;
        }
        if (num !== oriNum) {
            $('#pd_new_' + name).html(
                ' (<span style="color:#00F">{0}{1}</span>|<span style="color:{2}">{3}</span>)'
                    .replace('{0}', newValue)
                    .replace('{1}', unit)
                    .replace('{2}', diffValue >= 0 ? '#FF0033' : '#339933')
                    .replace('{3}', (diffValue >= 0 ? '+' : '') + diffValue)
            );
        }
        else {
            $('#pd_new_' + name).html('');
        }
    },

    /**
     * 增强争夺记录
     */
    enhanceLootLog: function () {
        var $log = $('.kf_fw_ig1 > tbody > tr:nth-child(5) > td');
        var matches = $log.html().match(/获得\d+经验和\d+KFB/g);
        var exp = 0, kfb = 0;
        for (var i in matches) {
            var logMatches = /获得(\d+)经验和(\d+)KFB/.exec(matches[i]);
            exp += parseInt(logMatches[1]);
            kfb += parseInt(logMatches[2]);
        }
        if (exp || kfb) {
            $log.prepend(
                '<b class="pd_stat">你总共获得了<em>{0}</em>经验和<em>{1}</em>KFB</b><br>'
                    .replace('{0}', exp.toLocaleString())
                    .replace('{1}', kfb.toLocaleString())
            );
        }
    },

    /**
     * 在争夺排行页面添加用户链接
     */
    addUserLinkInPkListPage: function () {
        $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
            var $this = $(this);
            $this.html('<a href="profile.php?action=show&username={0}" target="_blank">{0}</a>'.replace(/\{0}/g, $this.text().trim()));
        });
    }
};
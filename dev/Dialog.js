/**
 * 对话框类
 */
var Dialog = {
    /**
     * 创建对话框
     * @param {string} id 对话框ID
     * @param {string} title 对话框标题
     * @param {string} content 对话框内容
     * @param {string} [style] 对话框样式
     * @returns {jQuery} 对话框的jQuery对象
     */
    create: function (id, title, content, style) {
        var html =
            '<form>' +
            '<div class="pd_cfg_box" id="{0}" style="{1}">'.replace('{0}', id).replace('{1}', style ? style : '') +
            '  <h1>{0}<span>&times;</span></h1>'.replace('{0}', title) +
            content +
            '</div>' +
            '</form>';
        var $dialog = $(html).appendTo('body');
        $dialog.on('click', '.pd_cfg_tips', function (e) {
            if (KFOL.isMobile) KFOL.showElementTitleTips(e, this.title);
            return false;
        }).on('click', 'a.pd_disabled_link', function () {
            return false;
        }).keydown(function (e) {
            if (e.keyCode === 27) {
                return Dialog.close(id);
            }
        }).find('h1 > span').click(function () {
            return Dialog.close(id);
        }).end().find('legend input[type="checkbox"]').click(function () {
            var $this = $(this);
            var checked = $this.prop('checked');
            if (Tools.isOpera() || Tools.isEdge())
                $this.closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);
            else
                $this.closest('fieldset').prop('disabled', !checked);
        }).end().find('input[data-disabled]').click(function () {
            var $this = $(this);
            var checked = $this.prop('checked');
            $($this.data('disabled')).each(function () {
                var $this = $(this);
                if ($this.is('a')) {
                    if (checked) $this.removeClass('pd_disabled_link');
                    else $this.addClass('pd_disabled_link');
                }
                else {
                    $this.prop('disabled', !checked);
                }
            });
        });
        if (!KFOL.isMobile) {
            $(window).on('resize.' + id, function () {
                Dialog.show(id);
            });
        }
        return $dialog;
    },

    /**
     * 显示或调整对话框
     * @param {string} id 对话框ID
     */
    show: function (id) {
        var $box = $('#' + id);
        if ($box.length === 0) return;
        $box.find('.pd_cfg_main').css('max-height', $(window).height() - 80)
            .end().find('legend input[type="checkbox"]').each(function () {
            $(this).triggerHandler('click');
        }).end().find('input[data-disabled]').each(function () {
            $(this).triggerHandler('click');
        });
        var boxWidth = $box.width(), windowWidth = $(window).width(), windowHeight = $(window).height();
        if (KFOL.isMobile && windowHeight > 1000) windowHeight /= 2;
        var scrollTop = $(window).scrollTop();
        if (scrollTop < windowHeight / 2) scrollTop = 0;
        var left = windowWidth / 2 + (KFOL.isMobile ? $(window).scrollLeft() / 3 : 0) - boxWidth / 2;
        if (left + boxWidth > windowWidth) left = windowWidth - boxWidth - 20;
        $box.css('top', windowHeight / 2 + (KFOL.isMobile ? scrollTop : 0) - $box.height() / 2)
            .css('left', left)
            .fadeIn('fast');
    },

    /**
     * 关闭对话框
     * @param {string} id 对话框ID
     * @returns {boolean} 返回false
     */
    close: function (id) {
        $('#' + id).fadeOut('fast', function () {
            $(this).parent('form').remove();
        });
        if (!KFOL.isMobile) {
            $(window).off('resize.' + id);
        }
        return false;
    }
};
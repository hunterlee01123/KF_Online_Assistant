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
        $dialog.on('click', '.pd_cfg_tips', function () {
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
            if (Tools.isOpera())
                $this.closest('fieldset').find('input, select, textarea, button').not('legend input').prop('disabled', !checked);
            else
                $this.closest('fieldset').prop('disabled', !checked);
        }).end().find('input[data-disabled]').click(function () {
            var $this = $(this);
            var checked = $this.prop('checked');
            $($this.data('disabled')).prop('disabled', !checked);
        });
        $(window).on('resize.' + id, function () {
            Dialog.show(id);
        });
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
        $box.css('top', $(window).height() / 2 - $box.height() / 2)
            .css('left', $(window).width() / 2 - $box.width() / 2)
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
        $(window).off('resize.' + id);
        return false;
    }
};
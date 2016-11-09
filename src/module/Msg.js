'use strict';
import Info from './Info';

/**
 * 显示消息
 * @param {string} msg 消息
 * @param {number} duration 消息持续时间（秒），-1为永久显示
 * @param {boolean} clickable 消息框可否手动点击消除
 * @param {boolean} preventable 是否阻止点击网页上的其它元素
 * @example
 * show('<strong>抽取道具或卡片</strong><i>道具<em>+1</em></i>', -1);
 * show({msg: '<strong>抽取神秘盒子</strong><i>KFB<em>+8</em></i>', duration: 20, clickable: false});
 * @returns {jQuery} 消息框对象
 */
export const show = function ({
    msg = '',
    duration = Config.defShowMsgDuration,
    clickable = true,
    preventable = false,
} = {}) {
    if (arguments.length > 0) {
        if (typeof arguments[0] === 'string') msg = arguments[0];
        if (typeof arguments[1] === 'number') duration = arguments[1];
    }

    if ($('.pd_msg').length > 20) destroy();
    let $container = $('.pd_msg_container');
    let isFirst = $container.length === 0;
    if (!isFirst && !$('.pd_mask').length) {
        let $lastTips = $('.pd_msg:last');
        if ($lastTips.length > 0) {
            let top = $lastTips.offset().top;
            let winScrollTop = $(window).scrollTop();
            if (top < winScrollTop || top >= winScrollTop + $(window).height() - $lastTips.outerHeight() - 10) {
                destroy();
                isFirst = true;
            }
        }
    }
    if (preventable && !$('.pd_mask').length) {
        $('<div class="pd_mask"></div>').appendTo('body');
    }
    if (isFirst) {
        $container = $('<div class="pd_msg_container"></div>').appendTo('body');
    }

    let $msg = $(`<div class="pd_msg">${msg}</div>`).appendTo($container);
    $msg.on('click', 'a.pd_stop_action', function (e) {
        e.preventDefault();
        $(this).html('正在停止&hellip;').closest('.pd_msg').data('stop', true);
    });
    if (clickable) {
        $msg.css('cursor', 'pointer').click(function () {
            $(this).stop(true, true).fadeOut('slow', function () {
                remove($(this));
            });
        }).find('a').click(function (e) {
            e.stopPropagation();
        });
    }

    let windowWidth = $(window).width();
    let popTipsWidth = $msg.outerWidth(), popTipsHeight = $msg.outerHeight();
    let left = windowWidth / 2 - popTipsWidth / 2;
    if (left + popTipsWidth > windowWidth) left = windowWidth - popTipsWidth - 20;
    if (left < 0) left = 0;
    if (isFirst) {
        $container.css('top', $(window).height() / 2 - popTipsHeight / 2);
    }
    else {
        $container.stop(false, true).animate({'top': '-=' + popTipsHeight / 1.75});
    }
    let $prev = $msg.prev('.pd_msg');
    $msg.css({
        'top': $prev.length > 0 ? parseInt($prev.css('top')) + $prev.outerHeight() + 5 : 0,
        left
    }).fadeIn('slow');
    if (duration !== -1) {
        $msg.delay(duration * 1000).fadeOut('slow', function () {
            remove($(this));
        });
    }
    return $msg;
};

/**
 * 显示等待消息
 * @param {string} msg 等待消息
 * @param {boolean} preventable 是否阻止点击网页上的其它元素
 * @returns {jQuery} 消息框对象
 */
export const wait = function (msg, preventable = true) {
    return show({msg, duration: -1, clickable: false, preventable});
};

/**
 * 移除指定消息框
 * @param {jQuery} $msg 消息框对象
 */
export const remove = function ($msg) {
    let $parent = $msg.parent();
    $msg.remove();
    if (!$('.pd_msg').length) {
        $parent.remove();
        $('.pd_mask').remove();
    }
    else if (!$('#pd_remaining_num').length) {
        $('.pd_mask').remove();
    }
};

/**
 * 销毁所有消息框
 */
export const destroy = function () {
    $('.pd_msg_container').remove();
    $('.pd_mask').remove();
};

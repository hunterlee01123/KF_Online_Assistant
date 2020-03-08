/* 争夺模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import * as Msg from './Msg';
import Const from './Const';
import * as Log from './Log';
import * as TmpLog from './TmpLog';
import * as Script from './Script';
import * as Public from './Public';

/**
 * 在争夺排行页面添加用户链接
 */
export const addUserLinkInPkListPage = function () {
    $('.kf_fw_ig1 > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a class="${!Config.adminMemberEnabled ? 'pd_not_click_link' : ''}" href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === Info.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 在战力光环排行上添加用户链接
 */
export const addUserLinkInHaloPage = function () {
    $('.kf_fw_ig1:eq(1) > tbody > tr:gt(1) > td:nth-child(2)').each(function () {
        let $this = $(this);
        let userName = $this.text().trim();
        $this.html(`<a class="${!Config.adminMemberEnabled ? 'pd_not_click_link' : ''}" href="profile.php?action=show&username=${userName}" target="_blank">${userName}</a>`);
        if (userName === Info.userName) $this.find('a').addClass('pd_highlight');
    });
};

/**
 * 获取战力光环页面信息
 */
export const getPromoteHaloInfo = function () {
    Script.runFunc('Loot.getPromoteHaloInfo_before_');
    console.log('获取战力光环页面信息Start');
    let $wait = Msg.wait('<strong>正在获取战力光环信息，请稍候&hellip;</strong>');

    /**
     * 写入Cookie
     * @param {string} value 指定（相对）时间量
     * @returns {boolean} 返回false
     */
    const setCookie = function (value) {
        let nextTime = Util.getDate(value);
        Util.setCookie(Const.promoteHaloCookieName, nextTime.getTime(), nextTime);
        $(document).dequeue('AutoAction');
        return false;
    };

    /**
     * 获取个人信息
     */
    const getPersonalInfo = function () {
        $.ajax({
            type: 'GET',
            url: `profile.php?action=show&uid=${Info.uid}&t=${$.now()}`,
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            Msg.remove($wait);
            let regex = Config.promoteHaloCostType >= 11 ? /贡献数值：(\d+(?:\.\d+)?)/ : /论坛货币：(-?\d+)\s*KFB/;
            let matches = regex.exec(html);
            if (!matches) return setCookie(`+${Const.promoteHaloLimitNextActionInterval}m`);
            let currency = parseFloat(matches[1]);
            if (currency > Config.promoteHaloLimit) {
                let {num} = getPromoteHaloCostByTypeId(Config.promoteHaloCostType);
                let maxCount = Math.floor((currency - Config.promoteHaloLimit) / num);
                if (maxCount > 0) {
                    $wait = Msg.wait('<strong>正在获取战力光环信息，请稍候&hellip;</strong>');
                    getHaloInfo(maxCount);
                }
                else return setCookie(`+${Const.promoteHaloLimitNextActionInterval}m`);
            }
            else return setCookie(`+${Const.promoteHaloLimitNextActionInterval}m`);
        }).fail(() => setTimeout(getPersonalInfo, Const.defAjaxInterval));
    };

    /**
     * 获取光环信息
     * @param {number} maxCount 最大提升战力光环次数（设为-1表示不限制）
     */
    const getHaloInfo = function (maxCount = -1) {
        $.ajax({
            type: 'GET',
            url: 'kf_fw_ig_halo.php?t=' + $.now(),
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            Msg.remove($wait);

            let safeIdMatches = /safeid=(\w+)"/.exec(html);
            if (!safeIdMatches) return setCookie('+1h');
            let safeId = safeIdMatches[1];

            let surplusMatches = /下次随机还需\[(\d+)]分钟/.exec(html);
            if (surplusMatches) {
                let promoteHaloInterval = Config.promoteHaloAutoIntervalEnabled ? Const.minPromoteHaloInterval : Config.promoteHaloInterval * 60;
                promoteHaloInterval = promoteHaloInterval < Const.minPromoteHaloInterval ? Const.minPromoteHaloInterval : promoteHaloInterval;
                return setCookie(`+${promoteHaloInterval - (Const.minPromoteHaloInterval - parseInt(surplusMatches[1]))}m`);
            }

            let totalCount = 1;
            let countMatches = /当前光环随机可用\[(\d+)]次/.exec(html);
            if (Config.promoteHaloAutoIntervalEnabled && countMatches) {
                totalCount = parseInt(countMatches[1]);
                if (maxCount > -1) totalCount = totalCount > maxCount ? maxCount : totalCount;
            }

            promoteHalo(totalCount, Config.promoteHaloCostType, safeId);
        }).fail(function () {
            Msg.remove($wait);
            setTimeout(getPromoteHaloInfo, Const.defAjaxInterval);
        });
    };

    if (Config.promoteHaloLimit > 0) getPersonalInfo();
    else getHaloInfo();
};

/**
 * 提升战力光环
 * @param {number} totalCount 提升战力光环总次数
 * @param {number} promoteHaloCostType 自动提升战力光环的花费类型，参见{@link Config.promoteHaloCostType}
 * @param {string} safeId SafeID
 */
export const promoteHalo = function (totalCount, promoteHaloCostType, safeId) {
    console.log('提升战力光环Start');
    let $wait = Msg.wait(
        `<strong>正在提升战力光环&hellip;</strong><i>剩余：<em class="pd_countdown">${totalCount}</em></i><a class="pd_stop_action" href="#">停止操作</a>`
    );
    TmpLog.deleteValue(Const.haloInfoTmpLogName);
    let isStop = false;
    let index = 0;
    let nextTime = Util.getDate('+10m').getTime();

    /**
     * 提升
     */
    const promote = function () {
        $.ajax({
            type: 'GET',
            url: `kf_fw_ig_halo.php?do=buy&id=${promoteHaloCostType}&safeid=${safeId}&t=${$.now()}`,
            timeout: Const.defAjaxTimeout,
        }).done(function (html) {
            Public.showFormatLog('提升战力光环', html);
            let {msg} = Util.getResponseMsg(html);

            let matches = /(新数值为|随机值为)\[(\d+(?:\.\d+)?)%]/.exec(msg);
            if (matches) {
                let isNew = matches[1] === '新数值为';

                nextTime = Config.promoteHaloAutoIntervalEnabled ? 0 : Util.getDate(`+${Config.promoteHaloInterval}h`).getTime();
                let randomNum = parseFloat(matches[2]);
                let costResult = getPromoteHaloCostByTypeId(promoteHaloCostType);
                Msg.show(
                    '<strong>' +
                    (isNew ?
                        `恭喜你提升了光环的效果！新数值为【<em>${randomNum}%</em>】` : `你本次随机值为【<em>${randomNum}%</em>】，未超过光环效果`) +
                    `</strong><i>${costResult.type}<ins>${(-costResult.num).toLocaleString()}</ins></i>`
                );

                let pay = {};
                pay[costResult.type] = -costResult.num;
                Log.push(
                    '提升战力光环',
                    isNew ? `恭喜你提升了光环的效果！新数值为【\`${randomNum}%\`】` : `你本次随机值为【\`${randomNum}%\`】，未超过光环效果`,
                    {pay}
                );
                index++;
            }
            else {
                if (/两次操作间隔过短/.test(msg)) nextTime = Util.getDate('+10s').getTime();
                else isStop = true;

                matches = /你的(贡献点数|KFB)不足/.exec(msg);
                if (matches) {
                    nextTime = Util.getDate(`+${Config.promoteHaloInterval}h`).getTime();
                    Msg.show(`<strong>${matches[1]}不足，无法提升战力光环</strong><a href="kf_fw_ig_halo.php" target="_blank">手动选择</a>`, -1);
                }

                matches = /你还需要等待(\d+)分钟/.exec(msg);
                if (matches) {
                    let promoteHaloInterval = Config.promoteHaloInterval * 60;
                    promoteHaloInterval = promoteHaloInterval < Const.minPromoteHaloInterval ? Const.minPromoteHaloInterval : promoteHaloInterval;
                    nextTime = Util.getDate(`+${Config.promoteHaloInterval * 60 - (Const.minPromoteHaloInterval - parseInt(matches[1]))}m`).getTime();
                }
            }
        }).always(function () {
            $wait.find('.pd_countdown').text(totalCount - index);
            isStop = isStop || $wait.data('stop');
            if (isStop || index === totalCount) {
                Msg.remove($wait);
                if (nextTime > 0 || isStop) {
                    Util.setCookie(Const.promoteHaloCookieName, nextTime, new Date(nextTime));
                    setTimeout(() => $(document).dequeue('AutoAction'), Const.minActionInterval);
                }
                else {
                    Util.deleteCookie(Const.promoteHaloCookieName);
                    getPromoteHaloInfo();
                }
                Script.runFunc('Loot.promoteHalo_after_');
            }
            else {
                setTimeout(promote, Const.promoteHaloActionInterval);
            }
        });
    };

    promote();
};

/**
 * 通过获取类型ID获取提升战力光环花费
 * @param {number} id 提升战力光环的类型ID
 * @returns {{type: string, num: number}} type：花费类型；num：花费数额
 */
export const getPromoteHaloCostByTypeId = function (id) {
    switch (id) {
        case 1:
            return {type: 'KFB', num: 100};
        case 2:
            return {type: 'KFB', num: 1000};
        case 11:
            return {type: '贡献', num: 0.2};
        case 12:
            return {type: '贡献', num: 2};
        default:
            return {type: 'KFB', num: 0};
    }
};

/* 日志模块 */
'use strict';
import Info from './Info';
import * as Util from './Util';
import Const from './Const';

// 保存日志的键值名称
const name = 'pd_log';

/**
 * 初始化
 */
export const init = function () {
    if (typeof unsafeWindow === 'undefined') window.Log = {};
    else unsafeWindow.Log = {};
};

/**
 * 读取日志
 */
export const read = function () {
    Info.w.Log = {};
    let options = null;
    if (Info.storageType === 'ByUid' || Info.storageType === 'Global') options = GM_getValue(name + '_' + Info.uid);
    else options = localStorage.getItem(name + '_' + Info.uid);
    if (!options) return;
    try {
        options = JSON.parse(options);
    }
    catch (ex) {
        return;
    }
    if (!options || $.type(options) !== 'object') return;
    Info.w.Log = options;
    if (!Util.getCookie(Const.checkOverdueLogCookieName)) deleteOverdueLog();
};

/**
 * 写入日志
 */
export const write = function () {
    if (Info.storageType === 'ByUid' || Info.storageType === 'Global')
        GM_setValue(name + '_' + Info.uid, JSON.stringify(Info.w.Log));
    else localStorage.setItem(name + '_' + Info.uid, JSON.stringify(Info.w.Log));
};

/**
 * 清除日志
 */
export const clear = function () {
    if (Info.storageType === 'ByUid' || Info.storageType === 'Global') GM_deleteValue(name + '_' + Info.uid);
    else localStorage.removeItem(name + '_' + Info.uid);
};

/**
 * 删除过期日志
 */
const deleteOverdueLog = function () {
    let dateList = Util.getObjectKeyList(Log, 1);
    let overdueDate = Util.getDateString(Util.getDate(`-${Config.logSaveDays}d`));
    let isDeleted = false;
    for (let date of dateList) {
        if (date <= overdueDate) {
            delete Log[date];
            isDeleted = true;
        }
        else break;
    }
    if (isDeleted) write();
    Util.setCookie(Const.checkOverdueLogCookieName, 1, Util.getMidnightHourDate(1));
};

/**
 * 记录一条新日志
 * @param {string} type 日志类别
 * @param {string} action 行为
 * @param {?{}} gain 收获
 * @param {?{}} pay 付出
 */
export const push = function (type, action, {gain = null, pay = null} = {}) {
    let date = new Date();
    let time = date.getTime();
    let today = Util.getDateString(date);
    let settings = {time, type, action};
    if (gain) settings['gain'] = gain;
    if (pay) settings['pay'] = pay;
    read();
    if (!Array.isArray(Info.w.Log[today])) Info.w.Log[today] = [];
    Info.w.Log[today].push(settings);
    write();
};

/**
 * 获取合并后的日志
 * @param {{}} log 当前日志
 * @param {{}} newLog 新日志
 * @returns {{}} 合并后的日志
 */
export const getMergeLog = function (log, newLog) {
    for (let date in newLog) {
        if (!Array.isArray(log[date])) {
            log[date] = newLog[date];
        }
        else {
            for (let newItem of newLog[date]) {
                if (typeof newItem.time !== 'number' || typeof newItem.type !== 'string') continue;
                let index = log[date].findIndex(item => newItem['time'] === item['time'] && newItem['type'] === item['type']);
                if (index > -1) log[date][index] = newItem;
                else log[date].push(newItem);
            }
            log[date].sort((a, b) => a.time > b.time);
        }
    }
    return log;
};

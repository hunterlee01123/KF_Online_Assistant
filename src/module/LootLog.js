/* 争夺记录模块 */
'use strict';
import Info from './Info';
import Const from './Const';
import * as Util from './Util';

// 保存争夺记录的键值名称
const name = Const.storagePrefix + 'loot_log';

/**
 * 读取争夺记录
 * @returns {{}} 争夺记录对象
 */
export const read = function () {
    let log = {};
    let options = Util.readData(name + '_' + Info.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    }
    catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    log = options;
    return log;
};

/**
 * 写入争夺记录
 * @param {{}} log 争夺记录对象
 */
export const write = log => Util.writeData(name + '_' + Info.uid, JSON.stringify(log));

/**
 * 清除临时日志
 */
export const clear = () => Util.deleteData(name + '_' + Info.uid);

/**
 * 记录新的争夺记录
 * @param {string[]} logList 各层争夺记录列表
 * @param {string[]} pointsLogList 点数分配记录列表
 */
export const record = function (logList, pointsLogList) {
    let log = read();
    let overdueDate = Util.getDate(`-${Config.lootLogSaveDays}d`).getTime();
    $.each(Util.getObjectKeyList(log, 1), function (i, key) {
        key = parseInt(key);
        if (isNaN(key) || key <= overdueDate) delete log[key];
        else return false;
    });
    log[new Date().getTime()] = {log: logList, points: pointsLogList};
    write(log);
};

/**
 * 获取合并后的争夺记录
 * @param {{}} log 当前争夺记录
 * @param {{}} newLog 新争夺记录
 * @returns {{}} 合并后的争夺记录
 */
export const getMergeLog = function (log, newLog) {
    for (let key in newLog) {
        if (!$.isNumeric(key) || parseInt(key) <= 0) continue;
        if ($.type(newLog[key]) !== 'object' || !Array.isArray(newLog[key].log) || !Array.isArray(newLog[key].points)) continue;
        log[key] = newLog[key];
    }
    return log;
};

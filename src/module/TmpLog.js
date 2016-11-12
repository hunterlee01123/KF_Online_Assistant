/* 临时日志模块 */
'use strict';
import Info from './Info';
import Const from './Const';

// 保存临时日志的键值名称
const name = Const.storagePrefix + 'tmp_log';

/**
 * 读取临时日志
 * @returns {{}} 临时日志对象
 */
export const read = function () {
    let log = {};
    let options = null;
    if (Info.storageType === 'ByUid' || Info.storageType === 'Global') options = GM_getValue(name + '_' + Info.uid);
    else options = localStorage.getItem(name + '_' + Info.uid);
    if (!options) return log;
    try {
        options = JSON.parse(options);
    }
    catch (ex) {
        return log;
    }
    if (!options || $.type(options) !== 'object') return log;
    let allowKeys = [];
    for (let k in Const) {
        if (k.endsWith('TmpLogName')) allowKeys.push(Const[k]);
    }
    for (let k of Object.keys(options)) {
        if (!allowKeys.includes(k)) delete options[k];
    }
    log = options;
    return log;
};

/**
 * 写入临时日志
 */
export const write = function (log) {
    if (Info.storageType === 'ByUid' || Info.storageType === 'Global')
        GM_setValue(name + '_' + Info.uid, JSON.stringify(log));
    else localStorage.setItem(name + '_' + Info.uid, JSON.stringify(log));
};

/**
 * 清除临时日志
 */
export const clear = function () {
    if (Info.storageType === 'ByUid' || Info.storageType === 'Global') GM_deleteValue(name + '_' + Info.uid);
    else localStorage.removeItem(name + '_' + Info.uid);
};

/**
 * 获取指定名称的临时日志内容
 * @param {string} key 日志名称
 * @returns {*} 日志内容
 */
export const getValue = function (key) {
    let log = read();
    return key in log ? log[key] : null;
};

/**
 * 设置指定名称的临时日志内容
 * @param {string} key 日志名称
 * @param {*} value 日志内容
 */
export const setValue = function (key, value) {
    let log = read();
    log[key] = value;
    write(log);
};

/**
 * 删除指定名称的临时日志
 * @param {string} key 日志名称
 */
export const deleteValue = function (key) {
    let log = read();
    if (key in log) {
        delete log[key];
        write(log);
    }
};

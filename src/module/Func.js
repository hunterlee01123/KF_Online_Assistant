'use strict';

// 自定义方法列表
const funcList = new Map();

/**
 * 添加自定义方法
 * @param {string} name 自定义方法名称
 * @param {function} func 自定义方法
 */
export const add = function (name, func) {
    if (!funcList.has(name)) funcList[name] = [];
    funcList[name].push(func);
};

/**
 * 执行自定义方法
 * @param {string} name 自定义方法名称
 * @param {*} [data] 自定义方法参数
 * @returns {boolean} 是否执行了自定义方法
 */
export const run = function (name, data) {
    if (funcList.has(name)) {
        for (let func of funcList.get(name)) {
            if (typeof func === 'function') {
                try {
                    func(data);
                }
                catch (ex) {
                    console.log(ex);
                    return false;
                }
            }
        }
        return true;
    }
    else return false;
};

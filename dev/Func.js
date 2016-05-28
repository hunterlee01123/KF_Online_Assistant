/**
 * 自定义方法类
 */
var Func = {
    // 自定义方法列表
    funcList: {},

    /**
     * 添加自定义方法
     * @param {string} name 自定义方法名称
     * @param {function} func 自定义方法
     */
    add: function (name, func) {
        name = name.replace(/\./g, '_');
        if (typeof Func.funcList[name] === 'undefined') Func.funcList[name] = [];
        Func.funcList[name].push(func);
    },

    /**
     * 执行自定义方法
     * @param {string} name 自定义方法名称
     * @param {*} [data] 自定义方法参数
     * @returns {boolean} 是否执行了自定义方法
     */
    run: function (name, data) {
        name = name.replace(/\./g, '_');
        if (typeof Func.funcList[name] !== 'undefined') {
            for (var i in Func.funcList[name]) {
                if (typeof Func.funcList[name][i] === 'function') {
                    try {
                        Func.funcList[name][i](data);
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }
            }
            return true;
        }
        else return false;
    }
};
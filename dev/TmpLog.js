/**
 * 临时日志类
 */
var TmpLog = {
    // 保存临时日志的键值名称
    name: 'pd_tmp_log',
    // 临时日志对象
    log: {},

    /**
     * 读取临时日志
     */
    read: function () {
        TmpLog.log = {};
        var log = null;
        if (storageType === 'Script' || storageType === 'Global') log = GM_getValue(TmpLog.name + '_' + KFOL.uid);
        else log = localStorage.getItem(TmpLog.name + '_' + KFOL.uid);
        if (!log) return;
        try {
            log = JSON.parse(log);
        }
        catch (ex) {
            return;
        }
        if (!log || $.type(log) !== 'object') return;
        var allowKey = [];
        for (var k in Const) {
            if (k.indexOf('TmpLogName') > -1) allowKey.push(Const[k]);
        }
        for (var k in log) {
            if ($.inArray(k, allowKey) === -1) delete log[k];
        }
        TmpLog.log = log;
    },

    /**
     * 写入临时日志
     */
    write: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_setValue(TmpLog.name + '_' + KFOL.uid, JSON.stringify(TmpLog.log));
        else localStorage.setItem(TmpLog.name + '_' + KFOL.uid, JSON.stringify(TmpLog.log));
    },

    /**
     * 清除临时日志
     */
    clear: function () {
        if (storageType === 'Script' || storageType === 'Global') GM_deleteValue(TmpLog.name + '_' + KFOL.uid);
        else localStorage.removeItem(TmpLog.name + '_' + KFOL.uid);
    },

    /**
     * 获取指定名称的临时日志内容
     * @param {string} key 日志名称
     * @returns {*} 日志内容
     */
    getValue: function (key) {
        TmpLog.read();
        if (typeof TmpLog.log[key] !== 'undefined') return TmpLog.log[key];
        else return null;
    },

    /**
     * 设置指定名称的临时日志内容
     * @param {string} key 日志名称
     * @param {*} value 日志内容
     */
    setValue: function (key, value) {
        TmpLog.read();
        TmpLog.log[key] = value;
        TmpLog.write();
    },

    /**
     * 删除指定名称的临时日志
     * @param {string} key 日志名称
     */
    deleteValue: function (key) {
        TmpLog.read();
        if (typeof TmpLog.log[key] !== 'undefined') {
            delete TmpLog.log[key];
            TmpLog.write();
        }
    }
};
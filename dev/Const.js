/**
 * 配置常量类
 */
// （注意：以下代码如非必要请勿修改）
var Const = {
    // 开启调试模式，true：开启；false：关闭
    debug: false,
    // KFB捐款额度的最大值
    maxDonationKfb: 5000,
    // 争夺的默认领取间隔（分钟）
    defLootInterval: 660,
    // 所允许的在距本回合结束前指定时间后才进行自动批量攻击的最小时间（分钟）
    minAttackAfterTime: 63,
    // 每回合攻击的最大次数
    maxAttackNum: 20,
    // 在批量攻击中每次攻击的时间间隔（毫秒），可设置为函数来返回值
    perAttackInterval: function () {
        return Math.floor(Math.random() * 1000) + 2000;
    },
    // 检查正在进行的自动攻击是否已完成的时间间隔（分钟）
    checkAutoAttackingInterval: 4,
    // 在领取争夺奖励后首次检查生命值的时间间隔（分钟）
    firstCheckLifeInterval: 145,
    // 检查生命值的默认时间间隔（分钟）
    defCheckLifeInterval: 20,
    // 在进行试探攻击后检查生命值的时间间隔（分钟）
    checkLifeAfterAttemptAttackInterval: 2,
    // 神秘盒子的默认抽取间隔（分钟）
    defDrawSmboxInterval: 300,
    // 定时操作结束后的再判断间隔（秒），用于在定时模式中进行下一次定时时间的再判断
    actionFinishRetryInterval: 30,
    // 在连接超时的情况下获取剩余时间失败后的重试间隔（分钟），用于定时模式
    errorRefreshInterval: 1,
    // 在网页标题上显示定时模式提示的更新间隔（分钟）
    showRefreshModeTipsInterval: 1,
    // 标记已去除首页已读at高亮提示的Cookie有效期（天）
    hideMarkReadAtTipsExpires: 3,
    // 神秘系数排名变化的提醒间隔（小时）
    smRankChangeAlertInterval: 12,
    // 存储VIP剩余时间的Cookie有效期（分钟）
    vipSurplusTimeExpires: 60,
    // ajax请求的默认时间间隔（毫秒）
    defAjaxInterval: 200,
    // 特殊情况下的ajax请求（如使用、恢复、购买道具等）的时间间隔（毫秒），可设置为函数来返回值
    specialAjaxInterval: function () {
        return Math.floor(Math.random() * 150) + 200;
    },
    // 循环使用道具中每轮第一次ajax请求的时间间隔（毫秒）
    cycleUseItemsFirstAjaxInterval: 2000,
    // 购买帖子提醒的最低售价（KFB）
    minBuyThreadWarningSell: 6,
    // 道具样品ID列表
    sampleItemIdList: {
        '零时迷子的碎片': 2257935,
        '被遗弃的告白信': 2005272,
        '学校天台的钥匙': 2001303,
        'TMA最新作压缩包': 1990834,
        'LOLI的钱包': 1836588,
        '棒棒糖': 2015243,
        '蕾米莉亚同人漫画': 2231073,
        '十六夜同人漫画': 2025284,
        '档案室钥匙': 2025904,
        '傲娇LOLI娇蛮音CD': 2003056,
        '整形优惠卷': 2122387,
        '消逝之药': 1587342
    },
    // 存储多重引用数据的LocalStorage名称
    multiQuoteStorageName: 'pd_multi_quote',
    // 神秘升级提醒的临时日志名称
    smLevelUpTmpLogName: 'SmLevelUp',
    // 神秘系数排名变化提醒的临时日志名称
    smRankChangeTmpLogName: 'SmRankChange',
    // 定期存款到期时间的临时日志名称
    fixedDepositDueTmpLogName: 'FixedDepositDue',
    // 上一次领取争夺奖励时被怪物攻击的总次数信息的临时日志名称
    attackedCountTmpLogName: 'AttackedCount',
    // 上一次自动更换神秘颜色的ID的临时日志名称
    prevAutoChangeSMColorIdTmpLogName: 'PrevAutoChangeSMColorId',
    // 标记已KFB捐款的Cookie名称
    donationCookieName: 'pd_donation',
    // 标记已领取争夺奖励的Cookie名称
    getLootAwardCookieName: 'pd_get_loot_award',
    // 标记自动攻击已准备就绪的Cookie名称
    autoAttackReadyCookieName: 'pd_auto_attack_ready',
    // 标记正在进行自动攻击的Cookie名称
    autoAttackingCookieName: 'pd_auto_attacking',
    // 标记已检查生命值的Cookie名称
    checkLifeCookieName: 'pd_check_life',
    // 标记已完成的试探攻击次数的Cookie名称
    attackCountCookieName: 'pd_attack_count',
    // 存储上一次试探攻击日志的Cookie名称
    prevAttemptAttackLogCookieName: 'pd_prev_attempt_attack_log',
    // 标记已抽取神秘盒子的Cookie名称
    drawSmboxCookieName: 'pd_draw_smbox',
    // 标记已去除首页已读at高亮提示的Cookie名称
    hideMarkReadAtTipsCookieName: 'pd_hide_mark_read_at_tips',
    // 存储之前已读的at提醒信息的Cookie名称
    prevReadAtTipsCookieName: 'pd_prev_read_at_tips',
    // 标记已进行定期存款到期提醒的Cookie名称
    fixedDepositDueAlertCookieName: 'pd_fixed_deposit_due_alert',
    // 存储VIP剩余时间的Cookie名称
    vipSurplusTimeCookieName: 'pd_vip_surplus_time',
    // 标记已自动更换神秘颜色的Cookie名称
    autoChangeSMColorCookieName: 'pd_auto_change_sm_color',
    // 标记已检查过期日志的Cookie名称
    checkOverdueLogCookieName: 'pd_check_overdue_log'
};
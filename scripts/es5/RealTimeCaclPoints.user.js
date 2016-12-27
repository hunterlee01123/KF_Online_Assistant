// ==UserScript==
// @name        实时计算点数分配方案
// @version     2.0.8-beta
// @trigger     start
// @author      bch
// @homepage    read.php?tid=589364
// @description 根据当前状态实时计算点数分配方案（仅限自动攻击有效）
// ==/UserScript==
'use strict';

var Const = require('./Const').default;

// 玩家当前状态
var currentLevel = void 0; // 当前层数
var currentLife = void 0; // 当前剩余生命值
var availablePoint = void 0; // 可分配属性点
var extraPointList = void 0; // 道具加成点数列表
var itemUsedNumList = void 0; // 道具使用情况列表
var basePoints = void 0; // 基础点数对象
var enemyList = void 0; // 各层遭遇NPC列表
var totalStrongNum = void 0; // 目前出现强化怪个数

// 基础参数（全局变量）

var playerAttackCoefficient = 5; // 玩家攻系数
var playerHPCoefficient = 20; // 玩家血系数
var playerSpeedCoefficient = 2; // 玩家速系数

var CHCardinal = 100; // 暴击率基数
var SKLCardinal = 90; // 技能率基数
var DFCardinal = 150; // 防御基数

var antiAgilityCoefficient = 3; // 灵活抵消系数
var antiInteligenceCoefficient = 3; // 智力抵消系数

var CDNum = void 0; // CD使用数量
var CDCoefficient = 0.008; // 1张CD减npc血系数
var fullCDCoefficient = void 0; // 满CD减npc攻系数

var fullRemiHP = void 0; // 满蕾米加成生命，注意在技能伤害中不等同于35点数
var fullIzayoiSpeed = void 0; // 满16夜加成攻速


// npc参数

// npc参数基础数据（全局变量）

var npcPowerStepNum = 6; // npc力量递增数值
var npcHealthStepNum = 7; // npc体质递增数值
var npcQuickStepNum = 3; // npc敏捷递增数值
var npcAgilityStepNum = 2; // npc灵活递增数值
var npcInteligenceStepNum = 2; // npc智力递增数值
var npcWillStepNum = 2; // npc意志递增数值

var npcAttackCoefficient = 3; // npc攻系数
var npcHPCoefficient = 10; // npc血系数
var npcSpeedCoefficient = 2; // npc速系数

var npcSKLAttack = 0.25; // npc技能伤害加成

// npc强化系数（全局变量） 索引：普通npc为0，boss为1，壮汉为2，记者为3 （待增加代码，可根据npc数据自动计算系数）

var npcPowerIntensiveCoefficient = [1, 1.5, 2, 1]; // npc力量强化系数
var npcHealthIntensiveCoefficient = [1, 2, 1.5, 1]; // npc体质强化系数
var npcQuickIntensiveCoefficient = [1, 1.5, 1, 2]; // npc敏捷强化系数
var npcAgilityIntensiveCoefficient = [1, 1.2, 1, 1.5]; // npc灵活强化系数
var npcInteligenceIntensiveCoefficient = [1, 1.2, 1, 1.5]; // npc智力强化系数
var npcWillIntensiveCoefficient = [1, 1.2, 1.5, 1]; // npc意志强化系数

// 各类npc最优方案搜索范围
var searchRangeNormal = { "攻速比下限": 1, "攻速比上限": 3, "被攻击次数下限": 0, "被攻击次数上限": 2 }; //  普通怪的方案搜索范围
var searchRangeBoss = { "攻速比下限": 1, "攻速比上限": 2, "被攻击次数下限": 1, "被攻击次数上限": 5 }; //  boss的方案搜索范围
var searchRangeStrong = { "攻速比下限": 1, "攻速比上限": 3, "被攻击次数下限": 1, "被攻击次数上限": 5 }; //  壮汉的方案搜索范围
var searchRangeSwift = { "攻速比下限": 0.5, "攻速比上限": 1.5, "被攻击次数下限": 0, "被攻击次数上限": 5 }; //  记者的方案搜索范围

// 需要玩家自行调整的变量，希望提供可视化接口
var playerPropability0 = 0.8; // 默认事件发生概率初始值，脸越黑设得越大
var npcPropability0 = 0.3; // 默认npc事件发生概率初始值，脸越黑设得越小
var restLifeRatioUnlucky0 = 0.3; // 针对强化npc的加点在遭遇强化npc时保留血量的百分比，将数值调小时，收入更稳定，但是收入期望会减少，为1或0时忽略强化怪
var recoverLevel = 2.5; // 预计回复楼层系数，根据连续几层不碰到强化npc进行估算，脸越黑设得越小
var strongHoldLevel0 = 20; // （初始值）针对强化npc加点（牺牲点数）应至少能撑过的最大楼层数，将数值调小（不能为0）时，收入更稳定，但是收入期望会减少
var strongHoldLevel = strongHoldLevel0; // 需要计算中调整
var restLifeRatioLucky = 1 - 1 / strongHoldLevel;

// 冒险机制的选项参数  
var riskingOption = 1; // 冒险机制的选项开关，为0时冒险机制失效
var riskingProbability = 0.875; // 当某些条件的概率大于此值，将启用冒险机制，调得越大越保险，但是点数、生命损耗越快
var tempPlayerPropabilityCoefficient = 8; // 冒险机制下调节默认事件发生概率的系数
var tempNPCPropabilityCoefficient = 7; // 冒险机制下调节默认npc事件发生概率的系数
var lifePercent = 1; // 当前生命值与下一层最大生命值之比的临界（为回血提供参考）

// 冒险机制下能调节的关键参数
var playerPropability = playerPropability0; // 因冒险机制，作为变量可以调节
var npcPropability = npcPropability0; // 因冒险机制，作为变量可以调节
var restLifeRatioUnlucky = restLifeRatioUnlucky0; // 因冒险机制，作为变量可以调节


// 数学计算用函数

function factorial(intNum) {
    // 计算阶乘
    var factnum = 1;
    for (var i = 1; i <= intNum; i++) {
        factnum *= i;
    }
    return factnum;
}

function CritBinom(trials, Probablity_s, Alpha) {
    // 仿制Excel函数，计算二项分布累积概率的临界次数
    if (Alpha === 0) {
        // Alpha只能取(0,1)间的值，取1或0时应按出错处理
        return 0;
    }
    if (Alpha === 1) {
        // Alpha只能取(0,1)间的值，取1或0时应按出错处理
        return trials;
    }

    if (Probablity_s === 0 || Probablity_s === 1) {
        // Probablity_s只能取(0,1)间的值，取1或0时应按出错处理
        return 0;
    }

    var exprimentTimes = 0; // 累积概率对应的事件发生次数
    var cumulativeProb = 0; // 累积概率
    while (cumulativeProb < Alpha) {
        // 二项分布概率
        var tempProb = factorial(trials) / factorial(trials - exprimentTimes) / factorial(exprimentTimes) * Math.pow(1 - Probablity_s, trials - exprimentTimes) * Math.pow(Probablity_s, exprimentTimes);
        // 计算累积概率
        cumulativeProb += tempProb;
        exprimentTimes++;
    }
    exprimentTimes--;
    return exprimentTimes;
}

function getEventProbability(happenningTimes, trials, defaultProbablity) {
    // 计算二项分布在总次数(trials)下成功次数至少为happenningTimes的概率大于defaultProbablity时，单次事件成功概率的临界值
    if (happenningTimes === 0) {
        // 至少发生0次概率始终为1，返回单次事件成功概率的最小值

        return 0.000001;
    }
    if (defaultProbablity === 0) {
        // defaultProbablity只能取(0,1)间的值，取1或0时应按出错处理

        return 0;
    }
    if (defaultProbablity === 1) {
        // defaultProbablity只能取(0,1)间的值，取1或0时应按出错处理

        return 1;
    }

    var eventProbability = 0; // 单次事件成功概率 * 100，取整数便于迭代
    var eventProbability1 = 0; // 二分法下限
    var eventProbability2 = 100; // 二分法上限
    while (eventProbability1 < eventProbability2) {
        // 使用二分法迭代找出合适的单次事件成功概率
        eventProbability = Math.floor((eventProbability1 + eventProbability2) / 2);
        var hTimes = trials - CritBinom(trials, 1 - eventProbability / 100, defaultProbablity); // 概率不小于defaultProbablity时，事件至少发生次数
        if (hTimes < happenningTimes) {
            // eventProbability偏小，需要将二分法下限提高
            eventProbability1 = Math.ceil((eventProbability1 + eventProbability2) / 2);
        } else {
            // eventProbability偏大，需要将二分法上限降低
            eventProbability2 = Math.floor((eventProbability1 + eventProbability2) / 2);
        }
    }
    eventProbability = eventProbability1;
    return eventProbability / 100;
}

// 策略计算

function getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints) {
    // 计算下一层npc参数，npcFlag，即npc强化系数中对应索引，返回npc参数对象

    var npcHP = Math.ceil(Math.ceil(npcHealthStepNum * (currentLevel + 1) * npcHealthIntensiveCoefficient[npcFlag]) * npcHPCoefficient * (1 - CDNum * CDCoefficient)); // npc血
    var npcAttack = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[npcFlag]) * npcAttackCoefficient * fullCDCoefficient); // npc攻
    var npcSpeed = Math.ceil(npcQuickStepNum * (currentLevel + 1) * npcQuickIntensiveCoefficient[npcFlag]) * npcSpeedCoefficient; // npc速

    var npcAgility = Math.round(npcAgilityStepNum * (currentLevel + 1) * npcAgilityIntensiveCoefficient[npcFlag]); // npc灵活
    npcAgility = npcAgility - Math.round((npcAgility + extraPointList.get('灵活') + levelPoints["灵活"]) / antiAgilityCoefficient);
    var npcCHPer = Math.max(Math.ceil(npcAgility / (npcAgility + CHCardinal) * 100) / 100, 0.000001); // npc暴击率

    var npcInteligence = Math.round(npcInteligenceStepNum * (currentLevel + 1) * npcInteligenceIntensiveCoefficient[npcFlag]); // npc智力
    npcInteligence = npcInteligence - Math.round((npcInteligence + extraPointList.get('智力') + levelPoints["智力"]) / antiInteligenceCoefficient);
    var npcSKLPer = Math.max(Math.ceil(npcInteligence / (npcInteligence + SKLCardinal) * 100) / 100, 0.000001); // npc技能率

    var npcWill = Math.ceil(npcWillStepNum * (currentLevel + 1) * npcWillIntensiveCoefficient[npcFlag]); // npc意志
    var npcDefence = Math.round(npcWill / (npcWill + DFCardinal) * 100) / 100; // npc防

    return { "血": npcHP, "攻": npcAttack, "速": npcSpeed, "暴击率": npcCHPer, "技能率": npcSKLPer, "防": npcDefence };
}

function getPropertyByPoint(propertyName, pointNum) {
    // 因调用问题重写点数及属性计算函数
    var propertyNum = 1;
    switch (propertyName) {
        case "力量":
            propertyNum = (pointNum + basePoints["力量"]) * playerAttackCoefficient;
            break;
        case "体质":
            propertyNum = (pointNum + basePoints["体质"]) * playerHPCoefficient + fullRemiHP;
            break;
        case "敏捷":
            propertyNum = (pointNum + basePoints["敏捷"]) * playerSpeedCoefficient + fullIzayoiSpeed;
            break;
        case "意志":
            propertyNum = Math.floor((pointNum + basePoints["意志"]) / (pointNum + basePoints["意志"] + DFCardinal) * 100) / 100;
            break;
        default:
            // 出错处理
            propertyNum = 1;
    }
    return propertyNum;
}

function getPointByProperty(propertyName, propertyNum) {
    // 因调用问题重写点数及属性计算函数，防御等百分数用2位小数表示，如25%=0.25
    var pointNum = 1;
    switch (propertyName) {
        case "力量":
            pointNum = Math.max(Math.ceil(propertyNum / playerAttackCoefficient) - basePoints["力量"], 1);
            break;
        case "体质":
            pointNum = Math.max(Math.ceil((propertyNum - fullRemiHP) / playerHPCoefficient) - basePoints["体质"], 1);
            break;
        case "敏捷":
            pointNum = Math.max(Math.ceil((propertyNum - fullIzayoiSpeed) / playerSpeedCoefficient) - basePoints["敏捷"], 1);
            break;
        case "意志":
            pointNum = Math.max(Math.ceil(DFCardinal / (1 - propertyNum) - DFCardinal) - basePoints["意志"], 1);
            break;
        default:
            // 出错处理
            pointNum = 1;
    }
    return pointNum;
}

function getPerByPoint(propertyName, currentLevel, npcFlag, pointNum) {
    // 计算玩家（npc）暴击、技能率,npcFlag，即npc强化系数中对应索引
    var propertyNum = 0.000001;
    switch (propertyName) {
        case "灵活":
            pointNum = pointNum + basePoints["灵活"] - Math.round((pointNum + basePoints["灵活"] + Math.round(npcAgilityStepNum * currentLevel * npcAgilityIntensiveCoefficient[npcFlag])) / antiAgilityCoefficient);
            propertyNum = Math.max(Math.round(pointNum / (pointNum + CHCardinal) * 100) / 100, 0.000001);
            break;
        case "智力":
            pointNum = pointNum + basePoints["智力"] - Math.round((pointNum + basePoints["智力"] + Math.round(npcInteligenceStepNum * currentLevel * npcInteligenceIntensiveCoefficient[npcFlag])) / antiInteligenceCoefficient);
            propertyNum = Math.max(Math.round(pointNum / (pointNum + SKLCardinal) * 100) / 100, 0.000001);
            break;
        default:
            // 出错处理
            propertyNum = 0.000001;
    }
    return propertyNum;
}

function getPointByPer(propertyName, currentLevel, npcFlag, propertyNum, pnflag) {
    // 计算保持玩家（npc）暴击、技能率所需参数，npcFlag，即npc强化系数中对应索引，暴击率等百分数用2位小数表示，如25%=0.25；pnflag：玩家为0，npc为1
    var pointNum = 1;
    if (propertyNum < 0.01 && pnflag === 0) {
        // 不需要发动玩家暴击、技能
        return 1;
    }
    if (propertyNum > 0.99 && pnflag === 1) {
        // 不需要抑制npc暴击、技能
        return 1;
    }
    switch (propertyName) {
        case "灵活":
            var npcAgility = Math.ceil(npcAgilityStepNum * currentLevel * npcAgilityIntensiveCoefficient[npcFlag]);
            if (pnflag === 0) {
                pointNum = Math.max(Math.ceil((CHCardinal * antiAgilityCoefficient / (1 - propertyNum) - CHCardinal * antiAgilityCoefficient + npcAgility) / (antiAgilityCoefficient - 1)) - basePoints["灵活"], 1);
            } else if (pnflag === 1) {
                pointNum = Math.max(Math.ceil(CHCardinal * antiAgilityCoefficient + npcAgility * (antiAgilityCoefficient - 1) - CHCardinal * antiAgilityCoefficient / (1 - propertyNum)) - basePoints["灵活"], 1);
            }
            break;
        case "智力":
            var npcInteligence = Math.ceil(npcInteligenceStepNum * currentLevel * npcInteligenceIntensiveCoefficient[npcFlag]);
            if (pnflag === 0) {
                pointNum = Math.max(Math.ceil((SKLCardinal * antiInteligenceCoefficient / (1 - propertyNum) - SKLCardinal * antiInteligenceCoefficient + npcInteligence) / (antiInteligenceCoefficient - 1)) - basePoints["智力"], 1);
            } else if (pnflag === 1) {
                pointNum = Math.max(Math.ceil(SKLCardinal * antiInteligenceCoefficient + npcInteligence * (antiInteligenceCoefficient - 1) - SKLCardinal * antiInteligenceCoefficient / (1 - propertyNum)) - basePoints["智力"], 1);
            }
            break;
        default:
            // 出错处理
            pointNum = 1;
    }
    return pointNum;
}

function getPointForSP(propertyName, currentLevel, npcFlag, spTimes, attackTimes, defaultProbablity) {
    // 暴击流或技能流加点，propertyName为灵活或智力，spTimes为暴击(技能)次数，attackTimes为总攻击次数，defaultProbablity为默认事件发生概率，函数返回相应灵活(智力)
    var spProbablity = getEventProbability(spTimes, attackTimes, defaultProbablity); // 计算玩家暴击（技能）率
    var spPoint = getPointByPer(propertyName, currentLevel, npcFlag, spProbablity, 0);
    return spPoint;
}

function getPointAgainstSP(propertyName, currentLevel, npcFlag, spTimes, attackedTimes, defaultProbablity) {
    // 封住npc暴击或技能，propertyName为灵活或智力，spTimes为暴击(技能)次数，attackedTimes为总被攻击次数，defaultProbablity为默认npc事件发生概率，函数返回相应灵活(智力)
    var spProbablity = Math.max(getEventProbability(spTimes + 1, attackedTimes, defaultProbablity) - 0.01, 0.000001); // 计算npc暴击（技能）率
    var spPoint = getPointByPer(propertyName, currentLevel, npcFlag, spProbablity, 1);
    return spPoint;
}

function getNextLevelPoints(currentLevel, npcFlag, levelStrategy) {
    // 通过方案参数，结合npc种类(npcFlag，即npc强化系数中对应索引)，计算出下一层点数分配方案
    var playerPower = 1; // 玩家力量点数
    var playerHealth = 1; // 玩家体质点数
    var playerQuick = 1; // 玩家敏捷点数

    // 计算玩家敏捷点数
    var npcSpeed = Math.ceil(npcQuickStepNum * npcSpeedCoefficient * (currentLevel + 1) * npcQuickIntensiveCoefficient[npcFlag]); // npc速度
    playerQuick = getPointByProperty('敏捷', npcSpeed * levelStrategy["攻速比"] + 1 * npcSpeedCoefficient); // 计算玩家敏捷加点

    // 计算玩家力量点数
    var playerSpeed = getPropertyByPoint('敏捷', playerQuick); // 玩家速度
    var attackedNum = levelStrategy["被攻击次数"];
    var attackTimes = Math.floor((attackedNum + 1) * playerSpeed / npcSpeed); // 玩家攻击npc次数
    var expectCriticalHitNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("灵活", currentLevel + 1, npcFlag, levelStrategy["灵活"]), playerPropability); // 期望玩家暴击次数
    var expectSkillNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("智力", currentLevel + 1, npcFlag, levelStrategy["智力"]), playerPropability); // 期望玩家技能次数
    var expectCHSNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("灵活", currentLevel + 1, npcFlag, levelStrategy["灵活"]) * getPerByPoint("智力", currentLevel + 1, npcFlag, levelStrategy["智力"]), playerPropability); // 期望玩家技能、暴击叠加次数

    var npcHP = Math.ceil(Math.ceil(npcHealthStepNum * npcHPCoefficient * (currentLevel + 1) * npcHealthIntensiveCoefficient[npcFlag]) * (1 - CDNum * CDCoefficient)); // npc血
    var npcWill = Math.ceil(npcWillStepNum * (currentLevel + 1) * npcWillIntensiveCoefficient[npcFlag]); // npc意志
    var npcDefence = Math.round(npcWill / (npcWill + DFCardinal) * 100) / 100; // npc防

    var basePower = basePoints["力量"]; // 计算基础力量
    var baseInteligence = basePoints["智力"]; // 计算基础智力
    var baseHealth = basePoints["体质"]; // 计算基础体质

    playerPower = npcHP + 4 - Math.floor(playerAttackCoefficient * basePower * (1 - npcDefence) * (attackTimes + expectCriticalHitNum)) - Math.floor(playerAttackCoefficient * (basePoints["分配点"] - levelStrategy["灵活"] - levelStrategy["意志"] - playerQuick - Math.round((levelStrategy["智力"] + basePoints["智力"] + Math.round(npcInteligenceStepNum * (currentLevel + 1) * npcInteligenceIntensiveCoefficient[npcFlag])) / antiInteligenceCoefficient) + baseHealth + baseInteligence) * (1 - npcDefence) * (expectSkillNum + expectCHSNum));
    playerPower = Math.ceil((playerPower + (attackTimes + expectCriticalHitNum - expectSkillNum - expectCHSNum)) / (playerAttackCoefficient * (1 - npcDefence) * (attackTimes + expectCriticalHitNum - expectSkillNum - expectCHSNum)));
    playerPower = Math.max(playerPower, 1); // 计算玩家力量加点

    playerHealth = basePoints["分配点"] - levelStrategy["灵活"] - levelStrategy["意志"] - levelStrategy["智力"] - playerPower - playerQuick; // 计算玩家体质加点

    // 生成下一层分配点方案
    return {
        "力量": playerPower,
        "体质": playerHealth,
        "敏捷": playerQuick,
        "灵活": levelStrategy["灵活"],
        "智力": levelStrategy["智力"],
        "意志": levelStrategy["意志"]
    };
}

function restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy) {
    // 通过方案参数计算攻略下一层玩家的剩余生命值，注意方案与npc种类对应，比如用针对普通npc的方案去算面对强化npc的结果就不对

    var levelPoints = getNextLevelPoints(currentLevel, npcFlag, levelStrategy);
    var npcParam = getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints); //计算下一层npc参数

    var playerDamage = 0; // 计算受到伤害
    var attackedTimes = levelStrategy["被攻击次数"]; // 玩家被攻击次数

    var expectCriticalHitNum = attackedTimes - CritBinom(attackedTimes, 1 - npcParam["暴击率"], npcPropability); // 期望npc暴击次数
    var expectSkillNum = attackedTimes - CritBinom(attackedTimes, 1 - npcParam["技能率"], npcPropability); // 期望npc技能次数
    playerDamage += Math.ceil((attackedTimes + expectCriticalHitNum) * (1 - getPropertyByPoint("意志", levelPoints["意志"])) * npcParam["攻"]); //+暴击
    playerDamage += Math.ceil((expectSkillNum * (expectSkillNum + 1) / 2 + expectSkillNum * (attackedTimes - expectSkillNum - 1)) * npcSKLAttack * npcParam["攻"]); //+技能
    if (currentLife === 0) {
        // currentLife为0表示刚开始打
        return Math.max(getPropertyByPoint("体质", levelPoints["体质"]) - playerDamage, 0);
    }
    if (currentLife <= playerDamage) {
        // 被击败，来不及回血
        return 0;
    }
    playerDamage -= Math.floor(extraPointList.get('耐力') / 100 * getPropertyByPoint("体质", levelPoints["体质"]));
    return Math.min(currentLife - playerDamage, getPropertyByPoint("体质", levelPoints["体质"]));
}

function getNextAttackedTimes(currentLevel, npcFlag, levelPoints) {
    // 通过配点参数计算攻略下一层玩家受攻击次数

    var npcParam = getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints); //计算下一层npc参数

    var attackTimes = Math.ceil(npcParam["血"] / Math.floor(getPropertyByPoint("力量", levelPoints["力量"]) * (1 - npcParam["防"]))); // 计算攻击npc次数，上限为不发生暴击（技能）的情况
    var npcHP = -1;
    while (npcHP <= 0 && attackTimes > 0) {
        // 计算打倒npc所需攻击次数临界值
        npcHP = npcParam["血"];
        attackTimes--;
        var expectCriticalHitNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("灵活", currentLevel + 1, npcFlag, levelPoints["灵活"]), playerPropability); // 期望玩家暴击次数
        var expectSkillNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("智力", currentLevel + 1, npcFlag, levelPoints["智力"]), playerPropability); // 期望玩家技能次数
        var expectCHSNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("灵活", currentLevel + 1, npcFlag, levelPoints["灵活"]) * getPerByPoint("智力", currentLevel + 1, npcFlag, levelPoints["智力"]), playerPropability); // 期望玩家技能、暴击叠加次数
        var npcDamage = Math.floor(getPropertyByPoint("力量", levelPoints["力量"]) * (1 - npcParam["防"])) * (attackTimes + expectCriticalHitNum); //+暴击伤害
        var antiInteligence = Math.round((levelPoints["智力"] + basePoints["智力"] + Math.ceil(npcInteligenceStepNum * (currentLevel + 1) * npcInteligenceIntensiveCoefficient[npcFlag])) / antiInteligenceCoefficient);
        var sumHealthInteligence = basePoints["体质"] + levelPoints["体质"] + basePoints["智力"] + levelPoints["智力"] - antiInteligence;
        npcDamage += Math.floor(sumHealthInteligence * 5 * (1 - npcParam["防"])) * expectSkillNum; //+技能伤害
        npcDamage += Math.floor(sumHealthInteligence * 5 * (1 - npcParam["防"])) * expectCHSNum; //+暴击、技能叠加伤害
        npcHP = npcHP - npcDamage;
    }
    attackTimes++;

    return Math.floor(attackTimes * npcParam["速"] / getPropertyByPoint('敏捷', levelPoints["敏捷"]));
}

function restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints) {
    // 通过配点参数计算攻略下一层玩家的剩余生命值，加点参数是独立存在，不依赖与npc种类，故可以随便用（计算量更大）

    var npcParam = getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints); //计算下一层npc参数
    var attackedTimes = getNextAttackedTimes(currentLevel, npcFlag, levelPoints); // 玩家被攻击次数
    var playerDamage = 0; // 计算受到伤害


    var expectCriticalHitNum = attackedTimes - CritBinom(attackedTimes, 1 - npcParam["暴击率"], npcPropability); // 期望npc暴击次数
    var expectSkillNum = attackedTimes - CritBinom(attackedTimes, 1 - npcParam["技能率"], npcPropability); // 期望npc技能次数
    playerDamage += Math.ceil((attackedTimes + expectCriticalHitNum) * (1 - getPropertyByPoint("意志", levelPoints["意志"])) * npcParam["攻"]); //+暴击
    playerDamage += Math.ceil((expectSkillNum * (expectSkillNum + 1) / 2 + expectSkillNum * (attackedTimes - expectSkillNum - 1)) * npcSKLAttack * npcParam["攻"]); //+技能
    if (currentLife === 0) {
        // currentLife为0表示刚开始打
        return Math.max(getPropertyByPoint("体质", levelPoints["体质"]) - playerDamage, 0);
    }
    if (currentLife <= playerDamage) {
        // 被击败，来不及回血
        return 0;
    }
    playerDamage -= Math.floor(extraPointList.get('耐力') / 100 * getPropertyByPoint("体质", levelPoints["体质"]));
    return Math.min(currentLife - playerDamage, getPropertyByPoint("体质", levelPoints["体质"]));
}

function sortNumber(a, b) {
    // 排序用
    return a - b;
}

function getOptimalNextLevelStrategy(currentLevel, currentLife, npcFlag, searchRange, restLifeRatioLucky, restLifeRatioUnlucky) {
    // 根据下一层各种npc数值及玩家属性及剩余生命情况，计算出最优方案参数,minSpeedRatio,maxSpeedRatio为攻速比上下限，minAttackedNum,maxAttackedNum受攻击次数上下限，为寻找最优解提供搜索范围
    // restLifeRatioLucky为当前加点遇到普通npc后剩余生命与当前生命之比的临界点，为0时将忽略；restLifeRatioUnlucky为当前加点遭遇强化npc剩余生命与当前生命之比的临界点，为0时将忽略
    var levelStrategy = { "灵活": 1, "智力": 1, "意志": 1, "攻速比": 1, "被攻击次数": -1 }; // 最优方案存储变量，被攻击次数取-1作为搜索失败的flag
    var levelStrategy1 = { "灵活": 1, "智力": 1, "意志": 1, "攻速比": 1, "被攻击次数": 1 }; // 最优方案临时存储变量

    var speedRatiosForAN = []; // 固定被攻击次数后，根据攻击npc多少次确定攻速比的临界值列表
    var agilitysForHalfAN = []; // 固定攻击次数后，根据暴击次数确定灵活的临界值列表
    var inteligencesForHalfAN = []; // 固定被攻击次数后，根据技能次数确定智力的临界值列表

    // 搜索范围
    var minSpeedRatio = searchRange["攻速比下限"];
    var maxSpeedRatio = searchRange["攻速比上限"];
    var minAttackedNum = searchRange["被攻击次数下限"];
    var maxAttackedNum = searchRange["被攻击次数上限"];
    var willStep = 20; // 局部搜索最优意志的步长

    for (var attackedNum = minAttackedNum; attackedNum <= maxAttackedNum; attackedNum++) {
        // 受攻击次数固定下，对攻速比作循环
        for (var attackNum = Math.floor(minSpeedRatio * (attackedNum + 1)); attackNum <= Math.floor(maxSpeedRatio * (attackedNum + 1)); attackNum++) {
            // 计算攻速比的临界值列表
            speedRatiosForAN[attackNum] = Math.max(Math.ceil(attackNum / (attackedNum + 1) * 100) / 100, 0.5); // 计算对应攻击npc次数下所需攻速比
        }
        for (var _attackNum = Math.floor(minSpeedRatio * (attackedNum + 1)); _attackNum <= Math.floor(maxSpeedRatio * (attackedNum + 1)); _attackNum++) {
            // 受攻击次数固定，由攻速比决定攻击次数，作循环
            if (_attackNum === 0) {
                // 攻击npc次数不能为0
                continue;
            }
            levelStrategy1["灵活"] = 1;
            levelStrategy1["智力"] = 1;
            levelStrategy1["意志"] = 1;
            levelStrategy1["攻速比"] = speedRatiosForAN[_attackNum]; // 获取对应攻击npc次数下所需攻速比
            levelStrategy1["被攻击次数"] = attackedNum;
            var levelPoints = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
            /*
             if (levelPoints["体质"] <= 0) {
             // 分配点数不够，不用再计算灵活及智力
             continue;
             }
             */
            var testRestLife = restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy1);
            if (levelPoints["体质"] >= 0 && testRestLife === getPropertyByPoint("体质", levelPoints["体质"])) {
                // 体质已达最大化且生命值仅损失在其它加点上，无需再计算灵活及智力
                var restNextLevelLife1 = restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy1);
                var restNextLevelLife = levelStrategy["被攻击次数"] === -1 ? 0 : restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy);
                if (restLifeRatioLucky > 0 && restLifeRatioLucky < 1) {
                    // 考虑遇到普通npc后剩余生命与当前生命之比
                    var levelPointsLucky = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                    var restNextLevelLifeLucky = restLifeInNextLevelByPoints(currentLevel, currentLife, 0, levelPointsLucky);
                    if (restNextLevelLifeLucky / currentLife < restLifeRatioLucky) {
                        // 遇到普通npc后剩余生命与当前生命之比小于临界值，该加点不符合要求
                        continue;
                    }
                }
                if (restLifeRatioUnlucky > 0 && restLifeRatioUnlucky < 1) {
                    // 考虑遇到强化npc后剩余生命与当前生命之比
                    var levelPointsUnLucky = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                    var restNextLevelLifeUnlucky = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag === 2 ? 3 : 2, levelPointsUnLucky); // 遭遇另一种强化npc的损失
                    if (restNextLevelLife1 / currentLife < restLifeRatioUnlucky || restNextLevelLifeUnlucky / currentLife < restLifeRatioUnlucky) {
                        // 遇到强化npc后剩余生命与当前生命之比小于临界值，该加点不符合要求
                        continue;
                    }
                }
                if (restNextLevelLife < restNextLevelLife1) {
                    // 找到更优方案，进行替换
                    levelStrategy["灵活"] = levelStrategy1["灵活"];
                    levelStrategy["智力"] = levelStrategy1["智力"];
                    levelStrategy["意志"] = levelStrategy1["意志"];
                    levelStrategy["攻速比"] = levelStrategy1["攻速比"];
                    levelStrategy["被攻击次数"] = levelStrategy1["被攻击次数"];
                }
                continue;
            }

            // 获取概率阀值对应的灵活及智力临界值列表
            for (var CriticalHitNum = 0; CriticalHitNum <= Math.floor(_attackNum / 2); CriticalHitNum++) {
                // 计算攻击次数固定下暴击次数从0至1/2的攻击次数的所需相应的灵活临界值列表
                agilitysForHalfAN[CriticalHitNum] = getPointForSP("灵活", currentLevel + 1, npcFlag, CriticalHitNum, _attackNum, playerPropability);
            }
            var playerAgility = getPointAgainstSP("灵活", currentLevel + 1, npcFlag, 0, attackedNum, npcPropability);
            agilitysForHalfAN[Math.floor(_attackNum / 2) + 1] = playerAgility; // 封住npc暴击所需灵活
            agilitysForHalfAN.sort(sortNumber);
            for (var SkillNum = 0; SkillNum <= Math.floor(_attackNum / 2); SkillNum++) {
                // 对技能率（技能次数从0至1/2的总攻击次数的相应技能率及封住npc技能所需技能率为临界值）作循环
                var playerInteligence = getPointForSP("智力", currentLevel + 1, npcFlag, SkillNum, _attackNum, playerPropability);
                inteligencesForHalfAN[SkillNum] = playerAgility;
            }
            inteligencesForHalfAN[Math.floor(_attackNum / 2) + 1] = getPointAgainstSP("智力", currentLevel + 1, npcFlag, 0, attackedNum, npcPropability); // 封住npc技能所需灵活
            inteligencesForHalfAN.sort(sortNumber);
            // 比较方案参数的优劣
            for (var _CriticalHitNum = 0; _CriticalHitNum <= Math.floor(_attackNum / 2) + 1; _CriticalHitNum++) {
                // 固定灵活，变动智力
                levelStrategy1["灵活"] = agilitysForHalfAN[_CriticalHitNum];
                levelStrategy1["智力"] = 1;
                levelStrategy1["意志"] = 1;
                levelStrategy1["攻速比"] = speedRatiosForAN[_attackNum]; // 获取对应攻击npc次数下所需攻速比
                levelStrategy1["被攻击次数"] = attackedNum;
                var _levelPoints = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                if (_levelPoints["灵活"] + _levelPoints["敏捷"] + 4 >= availablePoint) {
                    // 分配点数不够，不用再计算智力
                    break;
                }
                /*
                 if (levelPoints["体质"] <= 0) {
                 // 分配点数不够，不用再计算智力
                 break;
                 }
                 */
                for (var _SkillNum = 0; _SkillNum <= Math.floor(_attackNum / 2) + 1; _SkillNum++) {
                    // 固定灵活、智力
                    levelStrategy1["灵活"] = agilitysForHalfAN[_CriticalHitNum];
                    levelStrategy1["智力"] = inteligencesForHalfAN[_SkillNum];
                    levelStrategy1["意志"] = 1;
                    levelStrategy1["攻速比"] = speedRatiosForAN[_attackNum];
                    levelStrategy1["被攻击次数"] = attackedNum;
                    var _levelPoints2 = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                    if (_levelPoints2["灵活"] + _levelPoints2["智力"] + _levelPoints2["敏捷"] + 3 >= availablePoint) {
                        // 分配点数不够，不用再计算智力
                        break;
                    }
                    /*
                     if (levelPoints["体质"] <= 0) {
                     // 分配点数不够，不用再计算意志
                     break;
                     }
                     */
                    var restNextLevelLife0 = restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, {
                        "灵活": agilitysForHalfAN[_CriticalHitNum],
                        "智力": inteligencesForHalfAN[_SkillNum],
                        "意志": 1,
                        "攻速比": speedRatiosForAN[_attackNum],
                        "被攻击次数": attackedNum
                    });
                    var playerWill0 = 1; // 记录整体最优点，以便局部放大计算
                    for (var playerWill = 1; playerWill <= 2 * DFCardinal; playerWill += willStep) {
                        // 灵活、智力、攻速比、被攻击次数确定的情况下，计算意志
                        levelStrategy1["灵活"] = agilitysForHalfAN[_CriticalHitNum];
                        levelStrategy1["智力"] = inteligencesForHalfAN[_SkillNum];
                        levelStrategy1["意志"] = playerWill;
                        levelStrategy1["攻速比"] = speedRatiosForAN[_attackNum];
                        levelStrategy1["被攻击次数"] = attackedNum;
                        var _levelPoints3 = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                        if (_levelPoints3["体质"] <= 0) {
                            // 分配点数不够，不用再计算意志
                            break;
                        }
                        var _restNextLevelLife = restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy1);
                        var _restNextLevelLife2 = levelStrategy["被攻击次数"] === -1 ? 0 : restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy);

                        if (restLifeRatioLucky > 0 && restLifeRatioLucky < 1) {
                            // 考虑遇到普通npc后剩余生命与当前生命之比
                            var _levelPointsLucky = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                            var _restNextLevelLifeLucky = restLifeInNextLevelByPoints(currentLevel, currentLife, 0, _levelPointsLucky);
                            if (_restNextLevelLifeLucky / currentLife < restLifeRatioLucky) {
                                // 遇到普通npc后剩余生命与当前生命之比小于临界值，该加点不符合要求
                                continue;
                            }
                        }
                        if (restLifeRatioUnlucky > 0 && restLifeRatioUnlucky < 1) {
                            // 考虑遇到普通npc后剩余生命与当前生命之比
                            var _levelPointsUnLucky = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                            var _restNextLevelLifeUnlucky = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag === 2 ? 3 : 2, _levelPointsUnLucky); // 遭遇另一种强化npc的损失
                            if (_restNextLevelLife / currentLife < restLifeRatioUnlucky || _restNextLevelLifeUnlucky / currentLife < restLifeRatioUnlucky) {
                                // 遇到强化npc后剩余生命与当前生命之比小于临界值，该加点不符合要求
                                continue;
                            }
                        }

                        if (_restNextLevelLife2 < _restNextLevelLife) {
                            // 找到更优方案，进行替换
                            levelStrategy["灵活"] = levelStrategy1["灵活"];
                            levelStrategy["智力"] = levelStrategy1["智力"];
                            levelStrategy["意志"] = levelStrategy1["意志"];
                            levelStrategy["攻速比"] = levelStrategy1["攻速比"];
                            levelStrategy["被攻击次数"] = levelStrategy1["被攻击次数"];

                            playerWill0 = playerWill; // 记录整体最优点，以便局部放大计算
                        } else if (_restNextLevelLife / restNextLevelLife0 < 0.9) {
                            // 优化算法，剩余生命值随意志增加开始大幅减少时，停止计算
                            break;
                        }
                        restNextLevelLife0 = _restNextLevelLife;
                    }

                    // 局部放大计算
                    var minPlayerWill = playerWill0 - Math.ceil(willStep / 2); // 局部放大意志上限
                    var maxPlayerWill = playerWill0 + Math.ceil(willStep / 2); // 局部放大意志下限
                    if (minPlayerWill < 0) {
                        minPlayerWill = 1;
                        maxPlayerWill = 1 + willStep;
                    }
                    for (var _playerWill = minPlayerWill; _playerWill <= maxPlayerWill; _playerWill++) {
                        // 灵活、智力、攻速比、被攻击次数确定的情况下，计算意志
                        levelStrategy1["灵活"] = agilitysForHalfAN[_CriticalHitNum];
                        levelStrategy1["智力"] = inteligencesForHalfAN[_SkillNum];
                        levelStrategy1["意志"] = _playerWill;
                        levelStrategy1["攻速比"] = speedRatiosForAN[_attackNum];
                        levelStrategy1["被攻击次数"] = attackedNum;
                        var _levelPoints4 = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                        if (_levelPoints4["体质"] <= 0) {
                            // 分配点数不够，不用再计算意志
                            break;
                        }
                        var _restNextLevelLife3 = restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy1);
                        var _restNextLevelLife4 = levelStrategy["被攻击次数"] === -1 ? 0 : restLifeInNextLevelByStrategy(currentLevel, currentLife, npcFlag, levelStrategy);

                        if (restLifeRatioLucky > 0 && restLifeRatioLucky < 1) {
                            // 考虑遇到普通npc后剩余生命与当前生命之比
                            var _levelPointsLucky2 = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                            var _restNextLevelLifeLucky2 = restLifeInNextLevelByPoints(currentLevel, currentLife, 0, _levelPointsLucky2);
                            if (_restNextLevelLifeLucky2 / currentLife < restLifeRatioLucky) {
                                // 遇到普通npc后剩余生命与当前生命之比小于临界值，该加点不符合要求
                                continue;
                            }
                        }
                        if (restLifeRatioUnlucky > 0 && restLifeRatioUnlucky < 1) {
                            // 考虑遇到普通npc后剩余生命与当前生命之比
                            var _levelPointsUnLucky2 = getNextLevelPoints(currentLevel, npcFlag, levelStrategy1);
                            var _restNextLevelLifeUnlucky2 = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag === 2 ? 3 : 2, _levelPointsUnLucky2); // 遭遇另一种强化npc的损失
                            if (_restNextLevelLife3 / currentLife < restLifeRatioUnlucky || _restNextLevelLifeUnlucky2 / currentLife < restLifeRatioUnlucky) {
                                // 遇到强化npc后剩余生命与当前生命之比小于临界值，该加点不符合要求
                                continue;
                            }
                        }

                        if (_restNextLevelLife4 < _restNextLevelLife3) {
                            // 找到更优方案，进行替换
                            levelStrategy["灵活"] = levelStrategy1["灵活"];
                            levelStrategy["智力"] = levelStrategy1["智力"];
                            levelStrategy["意志"] = levelStrategy1["意志"];
                            levelStrategy["攻速比"] = levelStrategy1["攻速比"];
                            levelStrategy["被攻击次数"] = levelStrategy1["被攻击次数"];
                            // console.log(levelStrategy);
                            // console.log("剩余生命值：" + restNextLevelLife1);
                        }
                    }
                }
            }
        }
    }
    return levelStrategy;
}

var restLifeRatioByTenth = 0.85; // 预计到达每10层boss的血的保留比
var minRestLifeRatioUnlucky = 0.1; // 极限区的遭遇强化怪血的保留比

function getOptimalNextLevelStrategyStronger(currentLevel, currentLife) {
    // 计算最优方案将考虑强化npc的场合

    // 记录npc种类，供控制台返回加点信息
    var npcFlag = 0;

    if (currentLevel % 10 === 9) {
        // boss楼层加点
        npcFlag = 1;
        var _levelStrategy = getOptimalNextLevelStrategy(currentLevel, currentLife, npcFlag, searchRangeBoss, 1, 1);
        return { levelStrategy: _levelStrategy, npcFlag: npcFlag };
    }

    var levelStrategy = getOptimalNextLevelStrategy(currentLevel, currentLife, 0, searchRangeNormal, 0, 0); // 最优方案存储变量
    if (levelStrategy["被攻击次数"] === -1 || restLifeRatioUnlucky === 1 || restLifeRatioUnlucky0 === 0) {
        return { levelStrategy: levelStrategy, npcFlag: npcFlag };
    }
    var levelStrategy1 = { "灵活": 1, "智力": 1, "意志": 1, "攻速比": 1, "被攻击次数": 1 }; // 最优方案临时存储变量

    var restLife = restLifeInNextLevelByStrategy(currentLevel, currentLife, 0, levelStrategy); // 打普通怪后剩余生命值

    if (strongHoldLevel < strongHoldLevel0) {
        // strongHoldLevel已经过调整，需逐层调整缩小极限区，避免遇强化怪不针对加点的风险
        strongHoldLevel = 9 - currentLevel % 10;
        restLifeRatioLucky = 1 - 1 / strongHoldLevel;
        restLifeRatioUnlucky = minRestLifeRatioUnlucky;
    } else {
        // 在每10层第1楼预测攻击boss情况，调整对强化怪的牺牲加点
        playerPropability = Math.max(playerPropability0 - 0.2, 0.01); // 放宽打败boss条件
        npcPropability = Math.min(npcPropability0 + 0.2, 0.99); // 放宽打败boss条件
        var levelStrategyTenth = getOptimalNextLevelStrategy(currentLevel - currentLevel % 10 + 9, Math.floor(currentLife * (restLifeRatioByTenth + (1 - restLifeRatioByTenth) / 9 * (currentLevel % 10))), 1, searchRangeBoss, 1, 1);
        playerPropability = playerPropability0; // 恢复默认概率
        npcPropability = npcPropability0; // 恢复默认概率

        if (levelStrategyTenth["被攻击次数"] === -1) {
            // 打不过boss，进入极限区
            strongHoldLevel = 9 - currentLevel % 10;
            restLifeRatioLucky = 1 - 1 / strongHoldLevel;
            restLifeRatioUnlucky = minRestLifeRatioUnlucky;
        }
    }

    if (restLife / currentLife <= 0.85) {
        // 进入极限区，最后7、8层听天由命
        return { levelStrategy: levelStrategy, npcFlag: npcFlag };
    }

    var levelPoints = getNextLevelPoints(currentLevel, 0, levelStrategy); // 加点参数，供计算遭遇强化npc损失使用
    var unluckyRestLifeStrong = restLifeInNextLevelByPoints(currentLevel, currentLife, 2, levelPoints); // 遭遇壮汉后剩余生命值
    var unluckyRestLifeSwift = restLifeInNextLevelByPoints(currentLevel, currentLife, 3, levelPoints); // 遭遇记者后剩余生命值
    if (unluckyRestLifeStrong === getPropertyByPoint("体质", levelPoints["体质"]) && unluckyRestLifeSwift === getPropertyByPoint("体质", levelPoints["体质"])) {
        // 碾压楼层，遭遇强化怪无损失
        return { levelStrategy: levelStrategy, npcFlag: npcFlag };
    }
    var resurreLifeStrong = 0;
    if (unluckyRestLifeStrong === 0) {
        // 被强化怪击败
        resurreLifeStrong = 0;
    } else {
        var levelStrategyStrongNext = getOptimalNextLevelStrategy(currentLevel + 1, unluckyRestLifeStrong, 0, searchRangeStrong, 0, 0); // 遭遇壮汉后下一层普通怪最优方案
        resurreLifeStrong = restLifeInNextLevelByStrategy(currentLevel + 1, unluckyRestLifeStrong, 0, levelStrategyStrongNext) - unluckyRestLifeStrong; // 遭遇壮汉后下一层打普通怪预计回复生命值
    }
    var resurreLifeSwift = 0;
    if (unluckyRestLifeStrong === 0) {
        // 被强化怪击败
        resurreLifeSwift = 0;
    } else {
        var levelStrategySwiftNext = getOptimalNextLevelStrategy(currentLevel + 1, unluckyRestLifeSwift, 0, searchRangeSwift, 0, 0); // 遭遇记者后下一层普通怪最优方案
        resurreLifeSwift = restLifeInNextLevelByStrategy(currentLevel + 1, unluckyRestLifeSwift, 0, levelStrategySwiftNext) - unluckyRestLifeSwift; // 遭遇记者后下一层打普通怪预计回复生命值
    }

    if (restLife - unluckyRestLifeStrong <= resurreLifeStrong * recoverLevel && restLife - unluckyRestLifeSwift <= resurreLifeSwift * recoverLevel) {
        // 可通过打几层普通怪回复遭遇强化怪损失的HP，recoverLevel自行设定，一般认为接下来2至3层内不再遇强化怪，觉得脸黑可以减小recoverLevel
        return { levelStrategy: levelStrategy, npcFlag: npcFlag };
    }

    // 缓冲区（针对强化怪加点有减少损失的可能）的处理
    if (restLife - unluckyRestLifeStrong > resurreLifeStrong * recoverLevel) {
        // 针对壮汉的对策
        var levelStrategy2 = getOptimalNextLevelStrategy(currentLevel, currentLife, 2, searchRangeStrong, restLifeRatioLucky, restLifeRatioUnlucky); // 针对壮汉的最优加点
        if (levelStrategy2["被攻击次数"] > -1) {
            // 找到壮汉搜索方案,进行处理
            var RestLifeStrong = restLifeInNextLevelByStrategy(currentLevel, currentLife, 2, levelStrategy2); //  此时加点面对壮汉剩余生命
            var levelPoints1 = getNextLevelPoints(currentLevel, 2, levelStrategy2); // 加点参数，供计算遇到普通npc剩余生命使用
            var luckyRestLifeStrong = restLifeInNextLevelByPoints(currentLevel, currentLife, 0, levelPoints1); //  此时加点面对普通npc剩余生命
            if (luckyRestLifeStrong > unluckyRestLifeStrong && levelStrategy2["被攻击次数"] > -1) {
                // 采用针对壮汉最优加点的条件，前者为针对壮汉加点遇普通怪剩余生命大于普通怪加点遭遇壮汉剩余生命，后者为找到方案；是否该考虑(luckyRestLifeStrong - unluckyRestLifeStrong)与currentLife之比？
                levelStrategy["灵活"] = levelStrategy2["灵活"];
                levelStrategy["智力"] = levelStrategy2["智力"];
                levelStrategy["意志"] = levelStrategy2["意志"];
                levelStrategy["攻速比"] = levelStrategy2["攻速比"];
                levelStrategy["被攻击次数"] = levelStrategy2["被攻击次数"];
                npcFlag = 2;
            }
        }
    }
    if (restLife - unluckyRestLifeSwift > resurreLifeStrong * recoverLevel) {
        // 针对记者的对策
        var levelStrategy3 = getOptimalNextLevelStrategy(currentLevel, currentLife, 3, searchRangeSwift, restLifeRatioLucky, restLifeRatioUnlucky); // 针对记者的最优加点
        var RestLifeSwift = restLifeInNextLevelByStrategy(currentLevel, currentLife, 3, levelStrategy3); //  针对记者最优加点面对记者剩余生命
        var levelPoints2 = getNextLevelPoints(currentLevel, 3, levelStrategy3); // 加点参数，供计算遇到普通npc剩余生命使用
        var luckyRestLifeSwift = restLifeInNextLevelByPoints(currentLevel, currentLife, 0, levelPoints2); //  针对记者最优加点面对普通npc剩余生命
        var UnluckyRestLifeSwiftStrong = restLifeInNextLevelByPoints(currentLevel, currentLife, 2, levelPoints2); //  针对记者最优加点面对壮汉剩余生命
        if (luckyRestLifeSwift > unluckyRestLifeSwift && levelStrategy3["被攻击次数"] > -1) {
            // 采用针对记者最优加点的条件，前者为针对记者加点遇普通怪剩余生命大于当前怪加点遭遇记者剩余生命，后者为找到方案；是否该考虑(luckyRestLifeSwift - unluckyRestLifeSwift)与data.currentLife之比？
            var _levelPoints5 = getNextLevelPoints(currentLevel, npcFlag, levelStrategy); // 当前采用方案的加点参数，计算伤害用
            restLife = restLifeInNextLevelByPoints(currentLevel, currentLife, 3, _levelPoints5); // 重新计算当前加点遭遇记者后剩余生命值
            var _RestLifeStrong = restLifeInNextLevelByPoints(currentLevel, currentLife, 2, _levelPoints5); // 重新计算当前加点遭遇壮汉后剩余生命值
            if (restLife + _RestLifeStrong < RestLifeSwift + UnluckyRestLifeSwiftStrong) {
                // 综合考虑原加点或壮汉的最优加点不如记者的最优加点
                levelStrategy["灵活"] = levelStrategy3["灵活"];
                levelStrategy["智力"] = levelStrategy3["智力"];
                levelStrategy["意志"] = levelStrategy3["意志"];
                levelStrategy["攻速比"] = levelStrategy3["攻速比"];
                levelStrategy["被攻击次数"] = levelStrategy3["被攻击次数"];
                npcFlag = 3;
            }
        }
    }
    return { levelStrategy: levelStrategy, npcFlag: npcFlag };
}

// 冒险机制计算强化怪出现概率用到的参数

var strongProbability = 0.2; // 预计出现强化怪概率
var maxLevel = 40; // 预计能到达的最大楼层，也可以通过助手统计上一次战斗数据
var maxStrongNum = 8; // 预计总共碰到的强化怪个数，也可以通过助手统计上一次战斗数据
var strongSecNum = 8; // 因强化怪分布可能存在前期稀疏，后期扎堆的可能，故分段进行统计，该值为分段的数目

function getTotalStrongNum() {
    // 统计目前出现强化怪个数，需要用到统计npc的数组
    var totalStrongNum = 0;
    // 因强化怪分布可能存在前期稀疏，后期扎堆的可能，故分段进行统计
    var startNum = currentLevel - currentLevel % strongSecNum;
    for (var i = startNum; i <= currentLevel; i++) {
        if (enemyList[i] == "特别强壮" || enemyList[i] == "特别快速") {
            totalStrongNum++;
        }
    }
    return totalStrongNum;
}

function getNextLevelStrongProbabilitySimple() {
    // 计算下一层出现强化怪概率，使用玩家预设值maxLevel、maxStrongNum直接计算
    if (currentLevel % 10 === 9) {
        // 下一层出现boss
        return 0;
    }
    var strongProbability = (maxStrongNum - getTotalStrongNum()) / (maxLevel * 0.9 - currentLevel);
    strongProbability = Math.ceil(strongProbability * 100) / 100;
    return strongProbability;
}

function getNextLevelStrongProbability() {
    // 计算下一层出现强化怪概率，通过统计二项分布计算
    if (currentLevel % 10 === 9) {
        // 下一层出现boss
        return 0;
    }
    if (riskingProbability === 0) {
        // 必开启冒险机制
        return 0;
    }
    if (riskingProbability >= 1) {
        // 必关闭冒险机制
        return 1;
    }
    var riskingNextStrongNum = CritBinom((currentLevel + 1) % strongSecNum, strongProbability, riskingProbability); // 下一层出现强化怪的总个数小于该值的概率大于riskingProbability
    //let riskingNextStrongNum = CritBinom((currentLevel + 1) % strongSecNum - Math.floor(((currentLevel + 1) % strongSecNum) / 10), strongProbability, riskingProbability); // 该计算除去了boss的场合，没有上面一行保险
    var strongAppearProbability = riskingNextStrongNum >= getTotalStrongNum() + 1 ? 1 : 0; // 目前出现强化怪个数+1小于等于预计值时，认为下一层必然出现强化怪
    console.log("比较强化怪个数: " + riskingNextStrongNum + "  " + (getTotalStrongNum() + 1));
    return strongAppearProbability;
}

function riskingForHP() {
    // 冒险机制，根据情况在预测不会遇到强化怪时调节关键参数保证回血或控制点数损失，前2个参数为冒险机制下默认事件概率，后1个参数为预计下一层最大生命值
    if (riskingOption === 0 || currentLevel % 10 == 9) {
        // 未启用冒险机制或boss楼层不启用冒险机制
        playerPropability = playerPropability0; // 默认事件发生概率恢复初始值
        npcPropability = npcPropability0; // 默认npc事件发生概率恢复初始值
        restLifeRatioUnlucky = restLifeRatioUnlucky0; // 针对强化npc的加点在遭遇强化npc时保留血量的百分比恢复初始值
        return false;
    }
    var tempProbability = currentLevel % 10 == 2 || currentLevel % 10 == 7 ? 1 : 0; // 每10层中试用2层，启用冒险机制
    playerPropability = Math.max(playerPropability0 - (playerPropability0 - 0) / tempPlayerPropabilityCoefficient, 0.01); // 调整事件发生概率
    npcPropability = Math.min(npcPropability0 + (1 - npcPropability0) / tempNPCPropabilityCoefficient, 0.99); // 调整npc事件发生概率

    //playerPropability = Math.max(tempPlayerPropabilityCoefficient * playerPropability0,0.01); // 调整事件发生概率
    //npcPropability = Math.min(tempNPCPropabilityCoefficient * npcPropability0,0.99); // 调整npc事件发生概率

    var levelStrategy = getOptimalNextLevelStrategy(currentLevel, currentLife, 0, searchRangeNormal, 1, 1);
    var levelPoints = getNextLevelPoints(currentLevel, 0, levelStrategy);
    var maxLife = getPropertyByPoint("体质", levelPoints["体质"]); // 下一层最大生命值
    //if((tempProbability >= riskingProbability) && (currentLife / maxLife < lifePercent)){
    if (1 - getNextLevelStrongProbability() >= riskingProbability && currentLife / maxLife < lifePercent) {
        // 符合冒险机制条件，启用冒险机制（本例为每10层中2层，且最大生命值下有效回血）
        console.log("启用冒险机制");
        restLifeRatioUnlucky = 1; // 冒险机制下忽略强化怪
        return true;
    } else {
        // 不符合冒险机制条件，恢复所有关键参数的初始值
        playerPropability = playerPropability0; // 默认事件发生概率恢复初始值
        npcPropability = npcPropability0; // 默认npc事件发生概率恢复初始值
        restLifeRatioUnlucky = restLifeRatioUnlucky0; // 针对强化npc的加点在遭遇强化npc时保留血量的百分比恢复初始值
        return false;
    }
}

if (location.pathname === '/kf_fw_ig_index.php') {
    $(function () {
        $('#pdAttackBtns').append('<fieldset style="margin-bottom: 10px; margin-right: 7px; padding: 0 6px 6px; border: 1px solid #ccccff;">' + '  <legend>自定义脚本参数</legend>' + '  <label>' + '    默认事件发生概率' + '    <input class="pd_input" name="playerPropability0" type="number" value="' + playerPropability0 + '" min="0.1" max="0.9" step="0.1" style="width: 42px;">' + '    <span class="pd_cfg_tips" title="默认事件发生概率，取值在0到1之间（不含0和1），取值越大越保险，但是更消耗点数（损失最大生命值）">[?]</span>' + '  </label><br>' + '  <label>' + '    默认NPC事件发生概率' + '    <input class="pd_input" name="npcPropability0" type="number" value="' + npcPropability0 + '" min="0.1" max="0.9" step="0.1" style="width: 42px;">' + '    <span class="pd_cfg_tips" title="默认NPC事件发生概率，取值在0到1之间（不含0和1），取值越小越保险，但是更消耗点数（损失最大生命值）">[?]</span>' + '  </label><br>' + '  <label>' + '    遭遇强化怪时剩余血量与当前血量之比的临界值' + '    <input class="pd_input" name="restLifeRatioUnlucky0" type="number" value="' + restLifeRatioUnlucky0 + '" min="0" max="1" step="0.1" style="width: 42px;">' + '    <span class="pd_cfg_tips" title="针对强化怪加点后在遭遇强化怪时剩余血量与当前血量之比的临界值，取值在0到1之间（含0和1），取0或1时将忽略强化怪（计算快、赌运气，适合回血和省点数）。' + '计算时若针对强化怪加点后在遭遇强化怪时剩余血量与当前血量之比小于该值，仍忽略强化怪，只针对普通怪最优加点。将数值调小时，收入更稳定，但是收入期望会减少">[?]</span>' + '  </label><br>' + '  <label>' + '    冒险机制所需条件发生概率的临界值' + '    <input class="pd_input" name="riskingProbability" type="number" value="' + riskingProbability + '" min="0" step="0.001" style="width: 56px;">' + '    <span class="pd_cfg_tips" title="采取冒险机制所需条件发生的概率的临界值，一般取值0到1。取0则一直使用冒险机制，取大于1的数将停用冒险机制。' + '目前等同于下一层强化怪不出现的概率的临界值，即下一层强化怪不出现的概率大于该值时，采用冒险机制。该值调得越大越保险，但是点数、生命损耗越快">[?]</span>' + '  </label>' + '</fieldset>');
    });
}

var lastTryingFlag = 1; // 最后一层搜索失败，若该标志为1，则放宽条件搜索，最终失败则返回当前楼层加点

Const.getCustomPoints = function (data) {
    // let getCustomPoints = function (data) {
    currentLevel = data.currentLevel;
    currentLife = data.currentLife;
    availablePoint = data.availablePoint;
    extraPointList = data.extraPointList;
    itemUsedNumList = data.itemUsedNumList;
    enemyList = data.enemyList;
    totalStrongNum = getTotalStrongNum();
    basePoints = {
        "分配点": availablePoint,
        "力量": extraPointList.get('力量'),
        "体质": extraPointList.get('体质'),
        "敏捷": extraPointList.get('敏捷'),
        "灵活": extraPointList.get('灵活'),
        "智力": extraPointList.get('智力'),
        "意志": extraPointList.get('意志')
    };

    strongHoldLevel0 = Math.ceil((availablePoint + basePoints["力量"] + basePoints["体质"] + basePoints["敏捷"] + basePoints["灵活"] + basePoints["智力"] + basePoints["意志"]) / 400 * 10);
    strongHoldLevel = strongHoldLevel0; // 需要计算中调整
    restLifeRatioLucky = 1 - 1 / strongHoldLevel;
    strongSecNum = Math.ceil(strongHoldLevel0 * 1.3);

    console.log(data);
    console.log("统计强化怪个数： " + totalStrongNum);
    CDNum = itemUsedNumList.get('傲娇LOLI娇蛮音CD');
    fullCDCoefficient = CDNum === 30 ? 0.9 : 1;
    fullRemiHP = itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0;
    fullIzayoiSpeed = itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0;

    var $attackBtns = $('#pdAttackBtns');
    if ($attackBtns.find('[name="playerPropability0"]').length > 0) {
        if ($attackBtns.find('input:invalid').length > 0) {
            alert('参数错误');
            return null;
        }
        playerPropability0 = parseFloat($attackBtns.find('[name="playerPropability0"]').val());
        npcPropability0 = parseFloat($attackBtns.find('[name="npcPropability0"]').val());
        restLifeRatioUnlucky0 = parseFloat($attackBtns.find('[name="restLifeRatioUnlucky0"]').val());
        riskingProbability = parseFloat($attackBtns.find('[name="riskingProbability"]').val());
    }

    riskingForHP();
    var npcflag = 0;
    var levelStrategy = void 0;
    if (currentLevel % 10 === 9) {
        // boss楼层加点
        npcflag = 1;
        levelStrategy = getOptimalNextLevelStrategy(currentLevel, currentLife, npcflag, searchRangeBoss, 1, 1);
    } else {
        // 普通npc楼层加点
        var result = getOptimalNextLevelStrategyStronger(currentLevel, currentLife);
        levelStrategy = result.levelStrategy;
        npcflag = result.npcFlag;
    }
    if (levelStrategy["被攻击次数"] === -1) {
        // 搜索方案失败的处理
        if (lastTryingFlag === 1) {
            var tryingTimes = 1;
            playerPropability -= 0.1;
            npcPropability += 0.1;
            while (playerPropability > 0.01 && npcPropability < 0.99 && tryingTimes <= 3) {
                // 修改默认概率，放宽条件
                console.log(tryingTimes + "次尝试最终搜索：  默认事件概率 " + playerPropability + "  默认npc事件概率 " + npcPropability);
                var lastResult = getOptimalNextLevelStrategyStronger(currentLevel, currentLife);
                var lastLevelStrategy = lastResult.levelStrategy;
                console.log(lastLevelStrategy);
                if (lastLevelStrategy["被攻击次数"] >= 0) {
                    // 最后尝试方宽条件搜索成功，返回方案
                    levelStrategy["灵活"] = lastLevelStrategy["灵活"];
                    levelStrategy["智力"] = lastLevelStrategy["智力"];
                    levelStrategy["意志"] = lastLevelStrategy["意志"];
                    levelStrategy["攻速比"] = lastLevelStrategy["攻速比"];
                    levelStrategy["被攻击次数"] = lastLevelStrategy["被攻击次数"];
                    npcflag = lastResult.npcFlag;
                    break;
                }
                playerPropability -= 0.1;
                npcPropability += 0.1;
                tryingTimes++;
            }
            if (tryingTimes > 3) {
                // 搜索最优方案失败，返回当前加点
                console.log('搜索最优方案失败，暂停攻击，请修改相关参数或手动攻击');
                // alert('搜索最优方案失败，暂停攻击，请修改相关参数或手动攻击');
                return false;
            }
        } else {
            // 搜索最优方案失败，暂停攻击，由玩家手动加点
            // alert('搜索最优方案失败，暂停攻击，请修改相关参数或手动攻击');
            return null;
        }
    }
    var levelPoints = getNextLevelPoints(currentLevel, npcflag, levelStrategy);
    console.log(levelStrategy);
    console.log(levelPoints);
    console.log(currentLevel + 1 + "层，" + npcflag + "类怪物，预计剩余生命值：" + restLifeInNextLevelByStrategy(currentLevel, currentLife, npcflag, levelStrategy));
    return levelPoints;
};
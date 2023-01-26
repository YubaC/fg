// 每个游戏日刷新
function newDay() {
    console.log("newday");

    // 每日刷新
    usedPlayClass = false;
    eventHappend = false;

    // 每日开销、心情（宿舍、食堂）
    money -= costPerLevel * (diningHallLevel + dormitoryLevel);
    mood += moodPerLevel * (diningHallLevel - diningHallMaxLevel / 2 + dormitoryLevel - dormitoryMaxLevel / 2);

    if (Math.round(Math.random() * 9) < 3) { //今天天气不错（30%）（<200）
        airPollution = Math.round(Math.random() * 200);
        // 今天赚的钱-50%
        receive_now = receive_per_100px / 2;
    } else { //今天污染严重（70%）（200-500）
        airPollution = Math.round(Math.random() * 300) + 200;
        // 空气治理专项拨款：每100px额外收入空气污染指数/10 元
        receive_now = receive_per_100px + airPollution / 10;

        if (complainDays > 0) { //受理投诉期间收益减半
            receive_now /= 2;
        }
    }

    // 投诉处理时间-1天
    if (complainDays > 0) {
        complainDays -= 1;
    }

    if (classFundDays > 0) {
        classFundDays -= 1;
    }

    if (todayInTerm < term) {
        todayInTerm += 1;
    } else {
        todayInTerm = 1;
        setTimeout(() => {
            newTerm();
        }, 1000);
    }

    if (!justLoadedFromSave && todayInTerm != 1) { //不是招生日并且不是刚读取存档
        if (mood < 20) {
            if (mood <= 0) { //心情小于等于0直接触发投诉（不在受理投诉日期内）
                mood = 0;
                if (!complainDays) {
                    complain();
                }
            } else { //心情低于20大于0每天60%概率触发投诉
                if (!complainDays && Math.round(Math.random() * 9) > 3) {
                    complain();
                }
            }
        } else if (mood < 10 && Math.round(Math.random() * 9) > 4) { //心情小于10的时候50%触发媒体判定
            digOut();
        } else if (Math.round(Math.random() * 9) < 3) { //每天30%概率触发小事件
            miniEvent();
        }
    } else if (justLoadedFromSave) {
        justLoadedFromSave = false;
    }

    // 退休
    if (day > 150) {
        retire();
    }
}

// 最终收入支出判定以及事件判定
function judge() {
    l = getTotalDistance();
    // 超出5000px后每多100px会扣1点心情
    if (airPollution <= 200) {
        if (l > 5000) {
            mood -= (l - 5000) / 100;
        }
        money += Math.round(receive_now / 100 * l);
    } else {
        // 每跑1000px扣空气质量 / 500 *2 点心情
        mood -= airPollution / 500 * l / 100 * 2;
        money += Math.round(receive_now * class_number / 100 * l);
        money -= dailyCostEachClass * class_number;
    }

    if (l >= 7500) { //跑得太远了，取消投诉保护
        complainDays = 0;
    }

    if (money <= 0) {
        gameover("Bad End", "原因：入不敷出");
    }
}

// 小事件
function miniEvent() {
    moneyToGive = Math.round(Math.random() * 9000);
    nowGameAt = "miniEvent";
    stringToFormat = [flow.text.miniEventText[Math.round(Math.random() * (flow.text.miniEventText.length - 1))], moneyToGive];
    money -= moneyToGive;
    nextStep();
}

// 班费
function classFund() {
    if (classFundDays == 0) {
        money += 1000 * class_number;
        classFundNumber = 0;
        classFundDays = 3;

        setTimeout(() => {
            stringToFormat = [1000 * class_number];
            nowGameAt = "classFund1";
            nextStep();
        }, 1000);

    } else {
        money += 1000 * class_number;
        classFundNumber += 1;
        mood -= 5 * 3 ** classFundNumber;
        classFundDays = 3;

        setTimeout(() => {
            stringToFormat = [1000 * class_number, classFundNumber + 1, 5 * 3 ** classFundNumber];
            nowGameAt = "classFund2";
            nextStep();
            document.getElementById("class").innerHTML = "";
            exercisePrepare();
        }, 1000);
    }
}

// function
function operate() {
    nowGameAt = "operate";
    nextStep();
}

// 新学年
function newTerm() {
    grade3 = grade2;
    grade3Special = grade2Special;
    grade2 = grade1;
    grade2Special = grade1Special;

    stringToFormat = [grade2, grade2Special];
    nowGameAt = "newTerm";
    nextStep();
}

// 招生
function askEnroll() {
    if (!grade1OK) {
        grade1 = Number(window.prompt("今年高一普通班级（每个班级可收入学费800元，最多招收12个班）招生数："));
        if (isNaN(grade1) || grade1 <= 0 || grade1 > 12) {
            askEnroll();
        } else {
            grade1OK = true;
            askEnroll();
        }
    } else {
        grade1Special = Number(window.prompt("今年高一校企合作班级（每个班级可收入学费30000元，最多招收三个班）招生数："));
        if (isNaN(grade1Special) || grade1Special <= 0 || grade1Special > 3) {
            askEnroll();
        } else {
            grade1OK = false;
            class_number = grade1 + grade2 + grade3 + grade1Special + grade2Special + grade3Special; //当前班级数
            money += grade1 * 800 + grade1Special * 30000;

            stringToFormat = [grade1 + grade1Special, grade1, grade1Special, class_number, grade1 * 800 + grade1Special * 30000];

            exercisePrepare();

            // nowGameAt = "askEnroll";
            nextStep();
        }
    }
}

// 放假
function vacation() {
    day += 1;
    mood += 20;
    if (mood > 100) {
        mood = 100;
    }

    document.getElementById("class").innerHTML = "";

    money -= Math.round(dailyCostEachClass / 5 * class_number);
    if (money <= 0) {
        gameover("Bad End", "原因：入不敷出");
    }

    setTimeout(() => {
        exercisePrepare();
        showDay();
    }, 1000);
}

// 体活课
function playClass() {
    if (!usedPlayClass) {
        mood += 5;
        if (mood > 100) {
            mood = 100;
        }
        document.getElementById("class").innerHTML = "";
        exercisePrepare();
        usedPlayClass = true;
    } else {
        setTimeout(() => {
            document.getElementById("musk").style.display = "block";
        }, 1000);
        setTimeout(() => {
            nowGameAt = "alreadyHavedPlayClass";
            nextStep();
        }, 2000);
    }
}

// 修改基建
function rebuildConstruction() {
    if (!diningHallLevelOK) {
        newDiningHallLevel = Number(window.prompt(`你要将食堂的基建等级调整为lv.？（当前的等级为lv.${diningHallLevel}/${diningHallMaxLevel}）`));
        if (isNaN(newDiningHallLevel) || newDiningHallLevel < 0 || newDiningHallLevel > diningHallMaxLevel) {
            rebuildConstruction();
        } else {
            diningHallLevelOK = true;
            if (newDiningHallLevel != null) {
                levelChanged = newDiningHallLevel - diningHallLevel;
                diningHallLevel = newDiningHallLevel;
            }
            rebuildConstruction();
        }
    } else {
        nweDormitoryLevel = Number(window.prompt(`你要将宿舍的基建等级调整为lv.？（当前的等级为lv.${dormitoryLevel}/${dormitoryMaxLevel}）`));
        if (isNaN(nweDormitoryLevel) || nweDormitoryLevel < 0 || nweDormitoryLevel > dormitoryMaxLevel) {
            rebuildConstruction();
        } else {
            diningHallLevelOK = false;
            if (nweDormitoryLevel != null) {
                levelChanged += nweDormitoryLevel - dormitoryLevel;
                dormitoryLevel = nweDormitoryLevel;
            }

            stringToFormat = [diningHallLevel, diningHallMaxLevel, dormitoryLevel, dormitoryMaxLevel, costPerLevel * (diningHallLevel + dormitoryLevel), moodPerLevel * (diningHallLevel - diningHallMaxLevel / 2 + dormitoryLevel - dormitoryMaxLevel / 2)];

            if (levelChanged <= 0) {
                stringToFormat.unshift(`修改基建收入了${-levelChanged*costPerLevel}元。`);
                stringToFormat.push(flow.text.rebuildConstructionReturnText[Math.round(Math.random() * (flow.text.rebuildConstructionReturnText.length - 1))]);
            } else if (money - costPerLevel * (diningHallLevel + dormitoryLevel) >= 0) {
                stringToFormat.unshift(`修改基建花费了${levelChanged*costPerLevel}元。`);
                stringToFormat.push("......");
            } else {
                window.alert("余额不足！")
            }

            money -= levelChanged * costPerLevel;

            nowGameAt = "rebuildConstructionReturn";

            document.getElementById("musk").style.display = "block";
            setTimeout(() => {
                nextStep();
            }, 1000);
        }
    }
}

// 投诉
function complain() {
    complainDays = 7;
    if (!complainedBefore) {
        nowGameAt = "complain";
        complainedBefore = true;
    } else {
        nowGameAt = "quickComplain";
    }
    nextStep();
}

// 媒体曝光
function digOut() {
    nowGameAt = "digOut";
    nextStep();
}

// 拒绝给上级教育机构封口费
function refuse1() {
    stain += Math.round(Math.random() * 90);
    if (stain >= 100) {
        gameover("Bad End", "原因：声名狼藉");
    }
}

// 给上级教育机构封口费
function giveMoney1() {
    moneyToGive = Math.round(Number(window.prompt(`你要给多少封口费？（现在学校的账面还有${money}元）`)));
    if (isNaN(moneyToGive) || moneyToGive > money) {
        giveMoney1();
    } else {
        // console.log(000000000000);
        money -= moneyToGive;
        received1 += moneyToGive;
        console.log(received1);
        if (received1 < expect1) {
            askMore1();
        } else {
            if (received1 - expect1 > 1000) {
                expect1 += (received1 - expect1) / 2;
                expect1 += 300;
            }
            complainDays -= Math.floor(complainDays / 2);
            satisfied();
        }
    }
}

// 拒绝给媒体封口费
function refuse2() {
    gameover("Bad End", "原因：声名狼藉");
}

// 给媒体封口费
function giveMoney2() {
    moneyToGive = Math.round(Number(window.prompt(`你要给多少封口费？（现在学校的账面还有${money}元）`)));
    if (isNaN(moneyToGive) || moneyToGive > money) {
        giveMoney2();
    } else {
        // console.log(000000000000);
        money -= moneyToGive;
        received2 += moneyToGive;
        console.log(received2);
        if (received2 < expect2) {
            askMore2();
        } else {
            if (received2 - expect2 > 1000) {
                expect2 += (received2 - expect2) / 2;
                expect2 += 300;
            }
            satisfied();
        }
    }
}

// 封口费没给够，再要一点
function askMore1() {
    setTimeout(() => {
        nowGameAt = "askMore1";
        nextStep();
    }, 1000);
}

// 封口费没给够，再要一点
function askMore2() {
    setTimeout(() => {
        nowGameAt = "askMore2";
        nextStep();
    }, 1000);
}

// 再给一点封口费
function giveMore1() {
    setTimeout(() => {
        giveMoney1();
    }, 1000);
}

// 再给一点封口费
function giveMore2() {
    setTimeout(() => {
        giveMoney2();
    }, 1000);
}

// 封口费给足了，心满意足的离开了
function satisfied() {
    setTimeout(() => {
        nowGameAt = "satisfied";
        nextStep();
    }, 1000);
}

// 获取总跑操路程（px）
function getTotalDistance() {
    var l = 0;
    for (i = 1; i < path_list.length; i++) {
        l += ((parseFloat(path_list[i][0]) - parseFloat(path_list[i - 1][0])) ** 2 + (parseFloat(path_list[i]
            [
                1
            ]) - parseFloat(path_list[i - 1][1])) ** 2) ** 0.5;
    }
    return l;
}

//退休
function retire() {
    gameover("Happy End", '成功退休！<span id="retired" style="display:none">......吗？</span>');

    retired = document.getElementById("retired");
    setTimeout(() => {
        fadeIn(retired, 40, 100);
        // 播放Ending Theme
        new Audio(flow.bgm.ed).play();
    }, 5000);
}
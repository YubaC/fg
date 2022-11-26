// 每个游戏日刷新
function newDay() {
    console.log("newday");
    usedPlayClass = false;
    if (Math.round(Math.random() * 10) < 3) { //今天天气不错（30%）（<200）
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

    if (todayInTerm < term) {
        todayInTerm += 1;
    } else {
        todayInTerm = 1;
        setTimeout(() => {
            newTerm();
        }, 1000);
    }

    if (mood < 20) {
        if (mood <= 0) { //心情小于等于0直接触发投诉（不在受理投诉日期内）
            mood = 0;
            if (!complainDays) {
                complain();
            }
        } else { //心情低于20大于0每天60%概率触发投诉
            if (!complainDays && Math.round(Math.random() * 10) > 3) {
                complain();
            }
        }
    }
}

// 最终收入支出判定
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
        money += Math.round(receive_now / 100 * l);
    }
}

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
        grade1 = Number(window.prompt("今年高一普通班级（每个班级可收入学费800元）招生数："));
        if (isNaN(grade1) || grade1 <= 0) {
            askEnroll();
        } else {
            grade1OK = true;
            askEnroll();
        }
    } else {
        grade1Special = Number(window.prompt("今年高一校企合作班级（每个班级可收入学费30000元）招生数："));
        if (isNaN(grade1Special) || grade1Special <= 0) {
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
    showDay();
    day += 1;
    mood += 20;
    if (mood > 100) {
        mood = 100;
    }

    document.getElementById("class").innerHTML = "";

    setTimeout(() => {
        exercisePrepare();
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

// 拒绝给上级教育机构封口费
function refuse1() {
    stain += Math.round(Math.random() * 100);
    if (stain >= 100) {
        gameover();
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
            askMore();
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

// 封口费没给够，再要一点
function askMore() {
    setTimeout(() => {
        nowGameAt = "askMore";
        nextStep();
    }, 1000);
}

// 再给一点封口费
function giveMore() {
    setTimeout(() => {
        giveMoney1();
    }, 1000);
}

// 封口费给足了，心满意足的离开了
function satisfied() {
    setTimeout(() => {
        nowGameAt = "satisfied";
        nextStep();
    }, timeout);
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
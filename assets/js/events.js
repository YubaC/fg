// 每个游戏日刷新
function newDay() {
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

    if (complainDays > 0) {
        complainDays -= 1;
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

// 放假
function vacation() {
    showDay();
    mood += 20;
    if (mood > 100) {
        mood = 100;
    }

    exerciseFinish();
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
    nowGameAt = "complain";
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
    nowGameAt = "askMore";
    nextStep();
}

// 再给一点封口费
function giveMore() {
    setTimeout(() => {
        giveMoney1();
    }, 1000);
}

// 封口费给足了，心满意足的离开了
function satisfied() {
    nowGameAt = "satisfied";
    nextStep();
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
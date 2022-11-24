// 每个游戏日刷新
function newDay() {
    if (Math.round(Math.random() * 10) < 3) { //今天天气不错（30%）（<200）
        airPollution = Math.round(Math.random() * 200);
        // 今天赚的钱-50%
        receive_now = receive_per_100px / 2;
    } else { //今天污染严重（70%）（200-500）
        airPollution = Math.round(Math.random() * 300) + 200;
        // 空气治理专项拨款：每100px额外收入空气污染指数/10 元
        receive_now = receive_per_100px + airPollution / 10;
    }

    if (mood < 0) {

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
        money += receive_now / 100 * l;
    } else {
        // 每跑100px扣空气质量/500 点心情
        mood -= airPollution / 500 * l;
        money += receive_now / 100 * l;
    }
}

function vacation() {
    showDay();
    mood += 20;
}

function playClass() {
    mood += 5;
}

function refuse1() {
    stain += Math.round(Math.random() * 50);
    if (stain >= 100) {
        gameover();
    }
}

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
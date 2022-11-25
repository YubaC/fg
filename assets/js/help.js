function teach() {
    nowGameAt = "teach";
    nextStep();
}

function teachMood() {
    nowGameAt = "teachMood";
    nextStep();
}

function showWeather() {
    hideChoice(); //首先隐藏问题选项
    nowGameAt = "showWeather";
    showDialog(); //显示对话框
    speakerAt = 0;
    paraList = [{
                "type": "say",
                "text": `    今天的污染指数：${airPollution}<br>    今天的空气治理专项拨款：${receive_now}元/100px。`,
                "img": "assets/images/m0.png"
            },
            {
                "type": "function",
                "name": "teach"
            }
        ],

        say();
    document.querySelector("html").style.overflow = "hidden";
}

function showMoney() {
    hideChoice(); //首先隐藏问题选项
    nowGameAt = "showMoney";
    showDialog(); //显示对话框
    speakerAt = 0;
    paraList = [{
                "type": "say",
                "text": `    现在学校的账面还有${money}元。`,
                "img": "assets/images/m0.png"
            },
            {
                "type": "function",
                "name": "teach"
            }
        ],

        say();
    document.querySelector("html").style.overflow = "hidden";
}

function showMood() {
    hideChoice(); //首先隐藏问题选项
    nowGameAt = "showMood";
    showDialog(); //显示对话框
    speakerAt = 0;
    faceToShow = Math.floor(mood / (100 / (faceList.length - 1)));
    paraList = [{
                "type": "say",
                "text": `    现在学生的心情值为${mood}。<br>    总体心情为：${faceList[faceToShow]}。`,
                "img": "assets/images/m0.png"
            },
            {
                "type": "function",
                "name": "teach"
            }
        ],

        say();
    document.querySelector("html").style.overflow = "hidden";
}

function exitTeach() {
    hideDialog();
    hideChoice();
}
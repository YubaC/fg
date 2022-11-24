// 对话框：说
function say() {
    textok = false; //没打完字

    document.querySelector("#dialog_musk img").src = paraList[speakerAt].img; //说话者的图片

    text_to_type = paraList[speakerAt].text;
    let str_ = ''; //已经打出来的字
    let i = 0;
    content = document.getElementById('dialog');
    timer = setInterval(() => { //一秒打十个字
        if (str_.length < text_to_type.length) {
            str_ += text_to_type[i++];
            content.innerHTML = '<p>' + str_ + '_</p>'; //打印时加光标
        } else {
            clearInterval(timer);
            textok = true;
            content.innerHTML = '<p>' + str_ + '</p>';
        }
    }, 100);
}

// ask提出的问题作答后的回调函数
function returnChoice(choice) {
    // return (choice);
    console.log(choice);
    speakerAt += 1; //说话的位置+1
    next(); //说下一句话
    // hideDialog();
    // hideChoice();

    continueGame(choice); //对做出的选择进行处理
}

//对做出的选择进行处理
function continueGame(choice) {
    // console.log(flow.flow[nowGameAt][choice]);
    if (typeof(flow.flow[nowGameAt]) == "object") { //如果这一段对话有选择
        nowGameAt = flow.flow[nowGameAt][choice]; //更新对话章节
    } else { //我 莫得选择
        nowGameAt = flow.flow[nowGameAt]; //更新对话章节
    }
    window[nowGameAt](); // 运行这个对话章节所需要执行的函数（函数以该章节命名）
}

function showDialog() {
    scrollTo(0, 0);

    document.getElementById("dialog").style.display = "block";
    document.getElementById("dialog_musk").style.display = "block";
    document.querySelector("html").style.overflow = "hidden";

    TweenMax.staggerTo(
        [
            // "#choice",
            "#dialog",
            "#dialog_musk",
        ],
        1, {
            scaleX: 1,
            // scaleY: 1,
            transformOrigin: "left",
            ease: Power0,
            stagger: 0,
            duration: 0.2,
        }
    );

    setTimeout(() => {
        enable_text_touch = true;
    }, 0.5);

    // tl2.remove();
}

function showChoice() {
    document.getElementById("choice").style.display = "block";
    tl2 = new TimelineMax();
    tl2
        .staggerTo(
            [
                "#choice",
            ],
            1, {
                scaleX: 1,
                transformOrigin: "bottom",
                ease: Power0,
                // stagger: 0,
                duration: 0.1,
            }
        )

    // tl2.remove();
}

function hideDialog() {
    enable_text_touch = false;

    tl2 = new TimelineMax();
    tl2
        .staggerTo(
            [
                // "#choice",
                "#dialog",
                "#dialog_musk",
            ],
            1, {
                scaleX: 0,
                // scaleY: 0,
                transformOrigin: "left",
                ease: Power0,
                stagger: 0,
                duration: 0.2,
            }
        )

    setTimeout(() => {
        document.getElementById("dialog").style.display = "none";
        document.getElementById("dialog_musk").style.display = "none";
        document.querySelector("html").style.overflow = "auto";
    }, 1000);
}

function hideChoice() {
    tl2 = new TimelineMax();
    tl2
        .staggerTo(
            [
                "#choice",
                // "#dialog",
                // "#dialog_musk",
            ],
            1, {
                scaleX: 0,
                transformOrigin: "bottom",
                ease: Power0,
                stagger: 0,
                duration: 0.1,
                onComplete: function() {
                    document.getElementById("choice").style.display = "none";
                }
            }
        )
}

// 换下一句对话用
function next() {
    if (enable_text_touch) {
        if (!textok) {
            if (paraList[speakerAt].type == "say") {
                clearInterval(timer);
                content.innerHTML = '<p>' + text_to_type + '_</p>';
            } else if (paraList[speakerAt].type == "ask") {
                str_ = text_to_type;

            }
            textok = true;

        } else if (speakerAt < paraList.length - 1 && paraList[speakerAt].type != "ask") {
            speakerAt += 1;
            if (paraList[speakerAt].type == "say") {
                hideChoice();
                say();

            } else if (paraList[speakerAt].type == "ask") {
                ask();
            }
        }

        if (paraList[speakerAt].type == "exit") {
            hideDialog();
            hideChoice();
            if (speakerAt < paraList.length - 1) {
                speakerAt += 1;
                next();
            }
        }
    }
    if (paraList[speakerAt].type == "function") {
        window[paraList[speakerAt].name]();

    }
}

function ask() {
    textok = false;
    // speakerAt = 0;

    question = paraList[speakerAt].question;
    text_to_type = str = question.question;
    str_ = '';
    let i = 0;
    content = document.getElementById('dialog');
    choice = document.getElementById('choice');

    document.querySelector("#dialog_musk img").src = paraList[speakerAt].img;

    // content.innerHTML += '<div class="ask">';
    timer = setInterval(() => {
        if (str_.length < str.length) {
            str_ += str[i++];
            content.innerHTML = '<p>' + str_ + '_</p>'; //打印时加光标
        } else {
            clearInterval(timer);
            content.innerHTML = '<p>' + str_ + '</p>';

            // content.innerHTML += '</div>';
            showChoice();
            textok = true;
            // setTimeout(() => {
            choice.innerHTML = '';
            choice.innerHTML += '<ul id="choices">';
            for (i = 0; i < question.choice.length; i++) {
                choice.innerHTML += `<li value="${i}" onclick="returnChoice(this.value)">${question.choice[i]}</li>`;
            }
            choice.innerHTML += '</ul>';

            if (document.querySelector("#choice li").clientWidth < 100) {
                for (i = 0; i < document.querySelectorAll("#choice li").length; i++) {
                    document.querySelectorAll("#choice li")[i].style.width = "100px";
                }
            }
            // }, 500);

        }
    }, 100);
}

// 换大对话章节用
function nextStep() {
    hideChoice();
    if (flow.text[nowGameAt] != "none") {
        showDialog();
        paraList = flow.text[nowGameAt];
        speakerAt = 0;

        if (paraList[0].type == "say") {
            say();
        } else if (paraList[0].type == "ask") {
            ask();
        }

    }
}

function askSave() {
    hideDialog();
    hideChoice();

    document.querySelector("html").style.overflow = "hidden";

    document.getElementById("loading_musk").innerHTML += '<div id="upload"><div><input type="file" id="file"><button id="button" onclick="receiveSave()">上传</button></div></div>';
}

function receiveSave() {
    var file_ele = document.getElementById('file');

    var reader = new FileReader(); //新建一个FileReader
    reader.readAsText(file_ele.files[0], "UTF-8"); //读取文件
    reader.onload = function(evt) { //读取完文件之后会回来这里
        var fileString = evt.target.result; // 读取文件内容
        console.log(fileString);

        // if (fileString.search("flow") != -1 && fileString.search(",") == -1 && fileString.search("\\[") && fileString.search("\\]")) {
        if (fileString.search("class_number") != -1 && fileString.search("day") != -1 && fileString.search("mood") != -1 && fileString.search("money") != -1 && fileString.search("path_list") != -1 && fileString.search("point_list") != -1 && fileString.search("speed") != -1 && fileString.search("version") != -1) {
            console.log("in3-");
            alert("读取成功！");

            loadedSave = JSON.parse(fileString);

            class_number = loadedSave.class_number;
            exercisePrepare();
            money = loadedSave.money;
            day = loadedSave.day;
            mood = loadedSave.mood;
            now_speed = loadedSave.speed;

            // justLoadedFromSave = true;

            path_list = loadedSave.path_list;
            point_list = [];
            for (i = 0; i < loadedSave.point_list.length; i++) {
                point_list.push(document.querySelector(loadedSave.point_list[i]));
            }

            for (i = 0; i < point_list.length - 1; i++) {
                from_x = point_list[i].cx["animVal"]["valueAsString"];
                from_y = point_list[i].cy["animVal"]["valueAsString"];
                to_x = point_list[i + 1].cx["animVal"]["valueAsString"];
                to_y = point_list[i + 1].cy["animVal"]["valueAsString"];
                // console.log(from_x, from_y, to_x, to_y);

                document.getElementById("path_lines").innerHTML +=
                    `<line x1="${from_x}" y1="${from_y}" x2="${to_x}" y2="${to_y}" style="stroke:#fa9668; stroke-width:3px; "></line>`;
            }

            clicked1 = point_list[point_list.length - 1];
            if (clicked1 == end) {
                document.getElementById("go").disabled = false;
            }

            setTimeout(() => {
                fadeOut(document.querySelector("#loading_musk"), 40, 0);
                // fadeOut(document.querySelector("#loading_musk p"), 40, 0);
                // startGame();

            }, 1000);

            setTimeout(() => {
                document.getElementById("top").style.display = "block";
                document.querySelector("html").style.overflow = "auto";
                tl.play();
            }, 2000);

            setTimeout(() => {
                nextStep();
                // say();
            }, 5000);
            // return true;
        } else {
            console.log("in4-");
            alert("ERROR:存档不符合要求或已损坏");
        }
    }
}

function reStart() {
    // hideChoice();
    exercisePrepare();

    // ask({ "question": "你记得怎么操作吗？", "choice": ["能", "不能"] });
    setTimeout(() => {
        fadeOut(document.querySelector("#loading_musk"), 40, 0);
        // fadeOut(document.querySelector("#loading_musk p"), 40, 0);
        // startGame();

    }, 1000);

    setTimeout(() => {
        document.getElementById("top").style.display = "block";
        document.querySelector("html").style.overflow = "auto";
        tl.play();
    }, 2000);

    setTimeout(() => {
        nextStep();
        // say();
    }, 5000);
}

function goStart() {
    //     paraList = flow.text[nowGameAt];
    //     speakerAt = 0;
    nextStep();
    console.log(nowGameAt);
    // setTimeout(() => {
    //     showDay();
    // }, 3000);
}

function showDay() {
    document.querySelector("#day h1").innerHTML = "DAY " + day;

    document.querySelector("#day p").innerHTML = "当前班级数： " + class_number;

    timeline = new TimelineMax();

    timeline.to("#day", 1, {
        scaleX: 1,
        transformOrigin: "right",
        ease: Power0,
        // stagger: 0
    });

    timeline.to("#day", 1, {
        scaleX: 0,
        transformOrigin: "left",
        ease: Power0,
        stagger: 0,
        delay: 1,
    });

}

function teachPlay() {
    paraList = flow.text[nowGameAt];
    speakerAt = 0;
    hideChoice();
    nextStep();
}

function getCSSPath(node) {
    let parts = [];
    while (node.parentElement) {
        let str = node.tagName.toLowerCase()
        if (node.id) {
            str += `#${node.id}`;
            parts.unshift(str);
            break;
        }

        let siblingsArr = Array.prototype.slice.call(node.parentElement.childNodes);
        let ind = siblingsArr.filter((n) => n.attributes).indexOf(node);
        parts.unshift(str + `:nth-child(${ind + 1})`);
        node = node.parentElement;
    }

    return parts.join(' > ');
}

function save() {
    var date = new Date();
    var year = date.getFullYear(); //  返回的是年份
    var month = date.getMonth() + 1; //  返回的月份上个月的月份，记得+1才是当月
    var dates = date.getDate();
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    var time = year + "-" + month + "-" + dates;
    console.log(time);
    //返回的是： yyyy-mm-dd

    pointToSave = [];
    for (i = 0; i < point_list.length; i++) {
        pointToSave.push(getCSSPath(point_list[i]));
    }

    let data = {
        "version": "0.99",
        "class_number": class_number, //当前班级数
        "day": day,
        "mood": mood,
        "money": money,
        "speed": speed_now,
        "path_list": path_list,
        "point_list": pointToSave
    };
    var content = JSON.stringify(data);
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, `${time}某副高校长工作日志.json`);

}

// function 


// say(
//     '    什么是永远？有生之年就是永远。分手不是一定坏事，只是证明那个人不是你的地久天长。在时间线上，是有一个人在等你，时间到了，就会相遇。<br/>    我好像没有特别喜欢的事情,<br>但是和喜欢的朋友一起随便聊聊天,打打游戏 ,花时间做点无聊的事情,就很高兴了,因为和舒服的人一起挥霍时间本身就是很轻松快乐的事情。<br/>--红叶都枫了@163');
// ques = {
//     "question": "???",
//     // "question": '    什么是永远？有生之年就是永远。分手不是一定坏事，只是证明那个人不是你的地久天长。在时间线上，是有一个人在等你，时间到了，就会相遇。<br/>    我好像没有特别喜欢的事情,<br>但是和喜欢的朋友一起随便聊聊天,打打游戏 ,花时间做点无聊的事情,就很高兴了,因为和舒服的人一起挥霍时间本身就是很轻松快乐的事情。<br/>--红叶都枫了@163',
//     "choice": [03424564354343521342354, 1232332323434345, 2, 3, 4, 5, 6, 7]
// }

// ask(ques);

function startGame() {
    //发起get请求
    var url = 'assets/data/flow.json';

    var promise = fetch(url).then(function(response) {

        //response.status表示响应的http状态码
        if (response.status === 200) {
            //json是返回的response提供的一个方法,会把返回的json字符串反序列化成对象,也被包装成一个Promise了
            return response.json();
        } else {
            return {}
        }
    });

    promise = promise.then(function(data) {
        flow = data;
        nowGameAt = "startGame";

        paraList = data.text.startGame;
        // return data;
        //响应的内容
        console.log(data.flow[nowGameAt]);
        // map = data.map;
        // drawmap();

        document.querySelector("html").style.overflow = "hidden";
        dialogMusk = document.getElementById("dialog_musk");
        dialog = document.getElementById("dialog");

        dialog.style.display = "block";
        dialogMusk.style.display = "block";

        showDialog();

        setTimeout(() => {
            ask();
        }, 1000);

    }).catch(function(err) {
        console.log(err);
    })


}
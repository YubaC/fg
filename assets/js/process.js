/*
对话框调用方法：
设置好nowGameAt （选项的同名函数不用）
nextStep()
*/

// 自定义格式化字符串，调用方法：String.format(["","",...,""])
String.prototype.format = function() {
    if (arguments.length == 0) {
        return this;
    }
    for (var s = this, i = 0; i < arguments[0].length; i++) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[0][i]);
    }
    return s;
};

// 这个函数什么也不做,用于避免ask的回调函数因找不到函数而报错
function none() {}

// 对话框：说
function say() {
    textok = false; //没打完字

    document.querySelector("#dialog_musk img").src = paraList[speakerAt].img; //说话者的图片

    text_to_type = paraList[speakerAt].text.format(stringToFormat);
    let str_ = ''; //已经打出来的字
    let i = 0;
    content = document.getElementById('dialog');
    paraList.innerHTML = "";
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
    if (enable_choice_touch) {
        console.log(choice);
        speakerAt += 1; //说话的位置+1
        next(); //说下一句话
        // hideDialog();
        // hideChoice();

        continueGame(choice); //对做出的选择进行处理
        enable_choice_touch = false;
    }
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

// 显示对话框
function showDialog() {
    scrollTo(0, 0);

    document.getElementById("dialog").style.display = "block";
    document.getElementById("dialog_musk").style.display = "block";
    document.getElementById("musk").style.display = "block";
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
    }, 900);

    // tl2.remove();
}

// 显示提问的选项
function showChoice() {
    document.getElementById("choice").style.display = "block";
    enable_choice_touch = true;
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

// 隐藏对话框
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
        document.getElementById("musk").style.display = "none";
    }, 1000);
}

// 隐藏提问的选项
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
    if (enable_text_touch) { //如果允许点击
        if (!textok) { //如果没打完字 => 补全没打完的字（通过点击的方式加速对话）
            if (paraList[speakerAt].type == "say") {
                clearInterval(timer);
                content.innerHTML = '<p>' + text_to_type + '_</p>';
            } else if (paraList[speakerAt].type == "ask") {
                str_ = text_to_type;

            }
            textok = true; //现在打完字了

        } else if (speakerAt < paraList.length - 1 && paraList[speakerAt].type != "ask") { //否则已经打完字了 => 继续下一句话
            speakerAt += 1;
            if (paraList[speakerAt].type == "say") {
                hideChoice();
                say();

            } else if (paraList[speakerAt].type == "ask") {
                ask();
            }
        }

        if (paraList[speakerAt].type == "exit") { //如果下一句话是type="exit"（要求退出对话）
            hideDialog();
            hideChoice();
            if (speakerAt < paraList.length - 1) { //如果这条命令后还有命令 => 一定是要执行函数
                speakerAt += 1;
                // next(); //执行这个函数
            }
        }

        if (paraList[speakerAt].type == "function") { //执行函数
            window[paraList[speakerAt].name]();
            // console.log("next");
        }
    }

    if (speakerAt == paraList.length - 1) { //完成对话后清空用于格式化的字符串
        stringToFormat = [];
    }
}

// 提问
function ask() {
    textok = false; //没打完字
    // speakerAt = 0;

    question = paraList[speakerAt].question;
    text_to_type = str = question.question.format(stringToFormat); //问题文本
    str_ = ''; //正在打的字
    let i = 0;
    content = document.getElementById('dialog');
    choice = document.getElementById('choice');
    paraList.innerHTML = "";

    document.querySelector("#dialog_musk img").src = paraList[speakerAt].img;

    // content.innerHTML += '<div class="ask">';
    timer = setInterval(() => {
        if (str_.length < str.length) {
            str_ += str[i++];
            content.innerHTML = '<p>' + str_ + '_</p>'; //打印时加光标
        } else { //打完字了
            clearInterval(timer);
            content.innerHTML = '<p>' + str_ + '</p>';

            // content.innerHTML += '</div>';
            showChoice(); //显示选项
            textok = true;
            // setTimeout(() => {
            // 构建问题选项------------
            choice.innerHTML = '';
            choice.innerHTML += '<ul id="choices">';
            for (i = 0; i < question.choice.length; i++) {
                choice.innerHTML += `<li value="${i}" onclick="returnChoice(this.value)">${question.choice[i]}</li>`;
            }
            choice.innerHTML += '</ul>';
            // ------------

            // 如果问题选项宽度过小（不太好看） => 设置宽度100px
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
    hideChoice(); //首先隐藏问题选项
    if (flow.text[nowGameAt] != "none") { //如果有对话
        showDialog(); //显示对话框
        paraList = flow.text[nowGameAt]; //获取对应的对话列表
        speakerAt = 0;
        document.getElementById("dialog").innerHTML = "";

        if (paraList[0].type == "say") {
            say();
            document.querySelector("html").style.overflow = "hidden";
        } else if (paraList[0].type == "ask") {
            ask();
            document.querySelector("html").style.overflow = "hidden";
        }

    }
}

// 读取存档
function askSave() {
    hideDialog();
    hideChoice();
    document.getElementById("musk").style.display = "block";

    document.querySelector("html").style.overflow = "hidden";

    clearInterval(titleColorChange);
    // document.getElementById("musk").classList.remove("titlePNG");
    // document.getElementById("musk").classList.remove("muskPNG");
    if (fadeOut1) {
        document.getElementById("musk").classList.add("fadeOut1");
    } else {
        document.getElementById("musk").classList.add("fadeOut2");
    }

    setTimeout(() => {
        document.getElementById("musk").style.display = "none";
        player.load();

        document.getElementById("musk").classList.remove("fadeOut1");
        document.getElementById("musk").classList.remove("fadeOut2");
        document.getElementById("musk").classList.remove("titlePNG");
        document.getElementById("musk").classList.remove("muskPNG");

        document.getElementById("loading_musk").innerHTML += '<div id="upload"><div><input type="file" id="file"><button id="button" onclick="receiveSave()">上传</button></div></div>';

    }, 1000);
}

// 存档上传回调函数
function receiveSave() {
    alreadyLoaded = true;

    var file_ele = document.getElementById('file');

    var reader = new FileReader(); //新建一个FileReader
    reader.readAsText(file_ele.files[0], "UTF-8"); //读取文件
    reader.onload = function(evt) { //读取完文件之后会回来这里
        var fileString = evt.target.result; // 读取文件内容
        console.log(fileString);

        // 检查存档是否完好
        if (fileString.search("version") != -1 && JSON.parse(fileString).version == flow.version) {
            console.log("in3-");
            justLoadedFromSave = true;
            alert("读取成功！");

            document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景

            loadedSave = JSON.parse(fileString); //JSON解码存档

            // 从存档中读取数据
            class_number = loadedSave.class_number;
            money = loadedSave.money;
            day = loadedSave.day + 1;
            mood = loadedSave.mood;
            speed_now = loadedSave.speed;

            grade1 = loadedSave.grade1;
            grade1Special = loadedSave.grade1Special;
            grade2 = loadedSave.grade2;
            grade2Special = loadedSave.grade2Special;
            grade3 = loadedSave.grade3;
            grade3Special = loadedSave.grade3Special;

            class_number = grade1 + grade2 + grade3 + grade1Special + grade2Special + grade3Special; //当前班级数

            diningHallLevel - loadedSave.diningHallLevel;
            dormitoryLevel = loadedSave.dormitoryLevel;

            todayInTerm = loadedSave.todayInTerm; //今天是这个学期中的第几天

            stain = loadedSave.stain; //满100失业

            complainDays = loadedSave.complainDays; // >0 => 投诉处理中，处理期间暂不受理新的投诉，处理期间收入减半

            expect1 = loadedSave.expect1; //上级教育机构预期的封口费
            expect2 = loadedSave.expect2; //媒体预期的封口费

            complainedBefore = loadedSave.complainedBefore;

            exercisePrepare();

            // 从存档中读取并绘制跑操路径------------
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
            // ------------
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

// 回答“找不到工作日志”后的回调函数
function reStart() {
    alreadyLoaded = true;

    // hideChoice();
    clearInterval(titleColorChange);
    // document.getElementById("musk").classList.remove("colorChange");
    // document.getElementById("musk").classList.remove("muskPNG");
    if (fadeOut1) {
        document.getElementById("musk").classList.add("fadeOut1");
    } else {
        document.getElementById("musk").classList.add("fadeOut2");
    }

    setTimeout(() => {
        player.load();
        document.getElementById("musk").classList.remove("fadeOut1");
        document.getElementById("musk").classList.remove("fadeOut2");
        document.getElementById("musk").classList.remove("titlePNG");
        document.getElementById("musk").classList.remove("muskPNG");
        document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景
    }, 1000);

    document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景

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
        nextStep(); //换下一个对话章节（询问是否记得如何管理学校，即是否跳过新手教程）
        // say();
    }, 5000);
}

// 跳过新手教程
function goStart() {
    //     paraList = flow.text[nowGameAt];
    //     speakerAt = 0;
    nextStep();
    console.log(nowGameAt);
    // setTimeout(() => {
    //     showDay();
    // }, 3000);
}

// 从保存的cookie中读取地图
function loadFromCookie() {
    var fileString = getCookie("mapSaved"); // 读取文件内容
    // console.log(fileString);

    // 检查存档是否完好
    if (fileString.search("version") != -1 && JSON.parse(fileString).version == flow.version) {
        console.log("in3-");
        justLoadedFromSave = true;
        // alert("读取成功！");

        document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景

        loadedSave = JSON.parse(fileString); //JSON解码存档

        // 从存档中读取数据
        class_number = loadedSave.class_number;
        money = loadedSave.money;
        day = loadedSave.day + 1;
        mood = loadedSave.mood;
        speed_now = loadedSave.speed;

        grade1 = loadedSave.grade1;
        grade1Special = loadedSave.grade1Special;
        grade2 = loadedSave.grade2;
        grade2Special = loadedSave.grade2Special;
        grade3 = loadedSave.grade3;
        grade3Special = loadedSave.grade3Special;

        class_number = grade1 + grade2 + grade3 + grade1Special + grade2Special + grade3Special; //当前班级数

        diningHallLevel - loadedSave.diningHallLevel;
        dormitoryLevel = loadedSave.dormitoryLevel;

        todayInTerm = loadedSave.todayInTerm; //今天是这个学期中的第几天

        stain = loadedSave.stain; //满100失业

        complainDays = loadedSave.complainDays; // >0 => 投诉处理中，处理期间暂不受理新的投诉，处理期间收入减半

        expect1 = loadedSave.expect1; //上级教育机构预期的封口费
        expect2 = loadedSave.expect2; //媒体预期的封口费

        complainedBefore = loadedSave.complainedBefore;

        exercisePrepare();

        // 从存档中读取并绘制跑操路径------------
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

        clearInterval(titleColorChange);
        // document.getElementById("musk").classList.remove("colorChange");
        // document.getElementById("musk").classList.remove("muskPNG");
        if (fadeOut1) {
            document.getElementById("musk").classList.add("fadeOut1");
        } else {
            document.getElementById("musk").classList.add("fadeOut2");
        }

        setTimeout(() => {
            player.load();
            document.getElementById("musk").classList.remove("fadeOut1");
            document.getElementById("musk").classList.remove("fadeOut2");
            document.getElementById("musk").classList.remove("titlePNG");
            document.getElementById("musk").classList.remove("muskPNG");
            document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景
        }, 1000);

        document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景

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
            nextStep(); //换下一个对话章节（询问是否记得如何管理学校，即是否跳过新手教程）
            // say();
        }, 5000);
    }
}

// 展示当前游戏日
function showDay() {
    newDay();

    document.querySelector("#day h1").innerHTML = "DAY " + day;

    document.querySelector("#day p").innerHTML = `今日空气污染：${airPollution}&emsp;学期日${todayInTerm}/${term}`;

    // 对话框会在1s后关掉musk，这里补一下
    setTimeout(() => {
        document.getElementById("musk").style.display = "block";
    }, 1000);

    timeline = new TimelineMax({
        onComplete: function() {
            console.log("finised")
            document.getElementById("musk").style.display = "none";
        },
        onStart: function() {
            document.getElementById("musk").style.display = "block";
        }
    });

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

// 新手教程
function teachPlay() {
    paraList = flow.text[nowGameAt];
    speakerAt = 0;
    hideChoice();
    nextStep();
}

// 获取css路径
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

// 保存
function save(saveType) {
    // 获取当前时间
    var date = new Date();
    var year = date.getFullYear(); //  返回的是年份
    var month = date.getMonth() + 1; //  返回的月份上个月的月份，记得+1才是当月
    var dates = date.getDate();
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    var time = year + "-" + month + "-" + dates;
    console.log(time);
    //返回的是： yyyy-mm-dd

    // 将point_list中保存的html DOM元素转为css的路径保存
    pointToSave = [];
    for (i = 0; i < point_list.length; i++) {
        pointToSave.push(getCSSPath(point_list[i]));
    }

    let data = {
        "version": flow.version,
        "todayInTerm": todayInTerm, //今天是这个学期中的第几天

        "grade1": grade1,
        "grade1Special": grade1Special,
        "grade2": grade2,
        "grade2Special": grade2Special,
        "grade3": grade3,
        "grade3Special": grade3Special,

        "stain": stain, //满100失业

        "complainDays": complainDays, // >0 => 投诉处理中，处理期间暂不受理新的投诉，处理期间收入减半

        "expect1": expect1, //上级教育机构预期的封口费
        "expect2": expect2, //媒体预期的封口费

        "complainedBefore": complainedBefore,

        "diningHallLevel": diningHallLevel,
        "dormitoryLevel": dormitoryLevel,

        // "class_number": class_number, //当前班级数
        "day": day,
        "mood": mood,
        "money": money,
        "speed": speed_now,
        "path_list": path_list,
        "point_list": pointToSave
    };
    var content = JSON.stringify(data); //JSON格式化保存

    switch (saveType) {
        case ("json"):
            var blob = new Blob([content], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, `${time}某高中校长工作日志.json`);
            setCookie("mapSaved", content, 30 * 365);
            break;
        case ("cookie"):
            setCookie("mapSaved", content, 30 * 365);
            break;
    }


}

// 初始化游戏
function startGame() {
    paraList = flow.text[nowGameAt];
    // return flow;
    //响应的内容
    console.log(flow.flow[nowGameAt]);
    // map = flow.map;
    // drawmap();

    // --------------------------------
    // TODO: 以下代码用于判断是否为chrome浏览器，如果是chrome浏览器则加载chrome字体，否则加载微软雅黑字体
    // TODO: 但是目前在移动端钉钉浏览器上似乎有问题，所以暂时注释掉
    // if (isChrome) {
    //     document.body.classList.add("emojiFont");
    // }
    // --------------------------------

    document.querySelector("html").style.overflow = "hidden";
    dialogMusk = document.getElementById("dialog_musk");
    dialog = document.getElementById("dialog");

    dialog.style.display = "block";
    dialogMusk.style.display = "block";

    showDialog();

    document.getElementById("musk").classList.add("muskPNG");
    // fadeIn(document.getElementById("titlePNG"), 40, 100);

    player = new Audio(flow.bgm.theme);
    player.loop = "loop";
    player.play();

    setTimeout(() => {
        ask(); //询问是否读取存档
    }, 1000);

    titleColorChange = setTimeout(() => {
        fadeOut1 = false;
        document.getElementById("musk").classList.add("titlePNG");
    }, 16000);
}

// 游戏结束
function gameover(endType, reason) {
    document.getElementById("exercise_line_edit").style.display = "none";
    loading_musk = document.getElementById("loading_musk");
    loading_musk.innerHTML = "";
    gameOverText = document.createElement("h1");
    gameOverText.innerHTML = `<b style="color:#FFF">${endType}</b>`;
    gameOverReason = document.createElement("p");
    gameOverReason.innerHTML = `<b style="color:#FFF">${reason}</b>`;
    gameOverReason.style.textAlign = "center";
    loading_musk.appendChild(gameOverText);
    loading_musk.appendChild(gameOverReason);
    loading_musk.style.zIndex = 999;
    fadeIn(loading_musk, 40, 100);
}
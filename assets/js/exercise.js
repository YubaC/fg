// 跑操前的准备（集合班级） => 画出所有班级
function exercisePrepare() {

    for (i = 0; i < class_number; i++) {
        // <text transform="matrix(1 0 0 1 155.5776 203.8384)" class="st12">&#128512;</text>
        faceToShow = Math.floor(mood / (100 / (faceList.length - 1)));
        // console.log(faceToShow);
        faceToShow += Math.round(Math.random() * 2 - 1);
        // console.log(faceToShow);
        if (faceToShow > faceList.length - 1) {
            faceToShow = faceList.length - 1;
        } else if (faceToShow < 0) {
            faceToShow = 0;
        }
        // console.log(faceToShow);

        // console.log(faceList[faceToShow]);

        document.getElementById("class").innerHTML +=
            `<text transform="matrix(1 0 0 1 168.9 196.9)" class="st12 classes">${faceList[faceToShow]}</text>`;
    }
}

// 加载完进入游戏时构建操场的动画
function animateBike() {
    document.getElementsByTagName("svg")[0].style.display = "block";

    tl = new TimelineMax();
    tl
        .staggerFrom(
            [
                "#playground1",
                "#basketball_field1",
                "#badminton_field1",
                "#wall",
            ],
            1, {
                scaleY: 0,
                scaleX: 0,
                transformOrigin: "center",
                ease: Bounce.easeOut,
                stagger: 0.2
            }
        )
        .staggerFrom(
            [
                "#basketball_field2",
                "#basketball_field3",
                "#basketball_field4",
                "#playground2",
                "#soccer_field",
                // "#图层10",
            ],
            1, {
                scaleX: 0,
                transformOrigin: "left",
                ease: Bounce.easeOut,
                stagger: 0
            }
        );

    tl.pause(); //先暂停动画，等会再继续
}

// 编辑跑操路径
function editPath() {
    document.getElementById("edit").disabled = true;
    document.getElementById("edit_done").disabled = false;
    document.getElementById("points").style.display = "block";
    document.getElementById("path_lines").style.display = "block";
    if (point_list.length > 1) {
        document.getElementById("undo").disabled = false;
    }
    if (undo_list.length != 0) {
        document.getElementById("redo").disabled = false;
    }
}

// 编辑结束
function editDone() {
    document.getElementById("edit").disabled = false;
    document.getElementById("edit_done").disabled = true;
    document.getElementById("points").style.display = "none";
    document.getElementById("path_lines").style.display = "none";
    document.getElementById("undo").disabled = true;
    document.getElementById("redo").disabled = true;
}

// 撤销
function undo() {
    if (point_list.length > 1) {
        clicked1 = point_list[point_list.length - 2];
        clicked1.classList.add("clicked");
        point_list[point_list.length - 1].classList.remove("clicked");

        undo_list.push(point_list[point_list.length - 1]);

        point_list.length -= 1;
        path_list.length -= 1;

        lines = document.getElementById("path_lines").childNodes;
        document.getElementById("path_lines").removeChild(lines[lines.length - 1]);

        document.getElementById("redo").disabled = false;
        if (point_list.length == 1) {
            document.getElementById("undo").disabled = true;
        }
        document.getElementById("go").disabled = false;
    }
}

// 重做
function redo() {
    if (undo_list.length != 0) {
        from_x = point_list[point_list.length - 1].cx["animVal"]["valueAsString"];
        from_y = point_list[point_list.length - 1].cy["animVal"]["valueAsString"];
        to_x = undo_list[undo_list.length - 1].cx["animVal"]["valueAsString"];
        to_y = undo_list[undo_list.length - 1].cy["animVal"]["valueAsString"];

        clicked1.classList.remove("clicked");
        undo_list[undo_list.length - 1].classList.add("clicked");

        document.getElementById("path_lines").innerHTML +=
            `<line x1="${from_x}" y1="${from_y}" x2="${to_x}" y2="${to_y}" style="stroke:#fa9668; stroke-width:3px; "></line>`;
        clicked1 = undo_list[undo_list.length - 1];

        path_list.push([to_x, to_y]);
        point_list.push(undo_list[undo_list.length - 1]);

        document.getElementById("undo").disabled = false;

        undo_list.length -= 1;
        if (undo_list.length == 0) {
            document.getElementById("redo").disabled = true;
        }

        if (point_list[point_list.length - 1] == end) {
            document.getElementById("go").disabled = false;
        }
    }
}

// 跑操结束后的回调函数
function exerciseFinish() {
    document.getElementById("exercise_line_edit").style.display = "block";
    document.getElementById("exercising").style.display = "none";
    document.getElementById("class").innerHTML = "";
    // window.alert("one tern finished!");
    day += 1;
    showDay();
}

// 开始跑操
function exercise() {
    judge();

    document.getElementById("exercise_line_edit").style.display = "none";
    document.getElementById("exercising").style.display = "block";

    // run = new TimelineMax();
    classes = document.getElementsByClassName("classes");
    // class_running = [];
    for (this_class = 0; this_class < class_number; this_class++) {
        run = window["class" + this_class] = new TimelineMax({
            onComplete: function() {
                document.querySelector(`#class > text.st12:nth-child(${this_class+1})`).style
                    .display = "none";
                this_class += 1;
                if (this_class == class_number) {
                    exerciseFinish();
                    exercisePrepare();
                    for (i = 0; i < class_number; i++) {
                        delete window["class" + this_class];
                    }
                }
            }
        });
        // class_running.push(window["class" + this_class]);
        for (i = 1; i < path_list.length; i++) {
            l = ((parseFloat(path_list[i][0]) - parseFloat(path_list[i - 1][0])) ** 2 + (parseFloat(path_list[i]
                [
                    1
                ]) - parseFloat(path_list[i - 1][1])) ** 2) ** 0.5;
            t = l / px_per_second;

            run.add(TweenLite.to(`#class > text.st12:nth-child(${this_class+1})`, {
                duration: t,
                // duration: 5,
                x: parseFloat(path_list[i][0]),
                y: parseFloat(path_list[i][1]),
                // stagger: 1,
                ease: "none",
            }));

            run.delay(this_class);
        }


        // run.delay(this_class);
    }
    this_class = 0;

    // if (justLoadedFromSave) {
    for (using_class = 0; using_class < class_number; using_class++) {
        // now_timeScale -= 0.1;
        window["class" + using_class].timeScale(speed_now); //调速
    }
    // justLoadedFromSave = false;
    // }
}

// 班级间距大一点！
function farther() {
    timescale_before = window["class0"].timeScale();

    document.getElementById("father").disabled = true;
    document.getElementById("closer").disabled = true;

    for (using_class = 0; using_class < class_number; using_class++) {
        /* 前一半减速，后一半加速
        第一个加速0.5，最后一个减速0.5
        即1-(-0.5--+0.5)
        (using_class - 0.5 * class_number) / class_number ∈ [-0.5, +0.5] 且单调递减
        */
        // window["class" + using_class].timeScale(using_class);
        window["class" + using_class].timeScale(timescale_before - (using_class - 0.5 * class_number) * 1.3 / class_number);
        // console.log(window["class" + using_class]);
    }
    setTimeout(() => {
        for (using_class = 0; using_class < class_number; using_class++) {
            window["class" + using_class].timeScale(timescale_before);
        }
        document.getElementById("father").disabled = false;
        document.getElementById("closer").disabled = false;
    }, px_per_second * 10);
}

// 班级间距小一点！
function closer() {
    timescale_before = window["class0"].timeScale();

    document.getElementById("father").disabled = true;
    document.getElementById("closer").disabled = true;

    for (using_class = 0; using_class < class_number; using_class++) {
        /* 前一半减速，后一半加速
        第一个加速0.5，最后一个减速0.5
        即1-(-0.5--+0.5)
        (using_class - 0.5 * class_number) / class_number ∈ [-0.5, +0.5] 且单调递减
        */
        // window["class" + using_class].timeScale(using_class);
        window["class" + using_class].timeScale(timescale_before + (using_class - 0.5 * class_number) * 1.3 / class_number);
        console.log(timescale_before + (using_class - 0.5 * class_number) * 1.3 / class_number);
    }
    setTimeout(() => {
        for (using_class = 0; using_class < class_number; using_class++) {
            window["class" + using_class].timeScale(timescale_before);
        }
        document.getElementById("father").disabled = false;
        document.getElementById("closer").disabled = false;
    }, px_per_second * 10);
}

// 跑快一点！
function faster() {
    for (using_class = 0; using_class < class_number; using_class++) {
        // now_timeScale += 0.1;
        window["class" + using_class].timeScale(window["class" + using_class].timeScale() + 0.1);
    }
    speed_now = window["class0"].timeScale();
}

// 跑慢一点！
function slower() {
    for (using_class = 0; using_class < class_number; using_class++) {
        // now_timeScale -= 0.1;
        window["class" + using_class].timeScale(window["class" + using_class].timeScale() - 0.1);
    }
    speed_now = window["class0"].timeScale();
}

// 路径点的点击事件
document.getElementById("points").onclick = function(e) {
    if (e.target != clicked1) {
        console.log(clicked1);

        from_x = clicked1.cx["animVal"]["valueAsString"];
        from_y = clicked1.cy["animVal"]["valueAsString"];
        to_x = e.target.cx["animVal"]["valueAsString"];
        to_y = e.target.cy["animVal"]["valueAsString"];

        clicked1.classList.remove("clicked");
        e.target.classList.add("clicked");

        document.getElementById("path_lines").innerHTML +=
            `<line x1="${from_x}" y1="${from_y}" x2="${to_x}" y2="${to_y}" style="stroke:#fa9668; stroke-width:3px; "></line>`;
        clicked1 = e.target;

        path_list.push([to_x, to_y]);
        point_list.push(e.target);

        undo_list = [];
        document.getElementById("undo").disabled = false;
        document.getElementById("redo").disabled = true;

        if (e.target == end) {
            document.getElementById("go").disabled = false;
        }
    }
}
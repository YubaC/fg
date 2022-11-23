// clicked_points = 0; //已选中的标记点个数
clicked1 = ""; //选中的标记点1
path_list = []; //路线
point_list = []; //定位点

class_number = 30; //当前班级数
day = 0;
mood = 100;
money = 10000;

// now_timeScale = 1; //当前速度

px_per_second = 80; //每秒钟移动的px

undo_list = [];
// redo_list = [];

document.getElementById("go").disabled = true;
document.getElementById("undo").disabled = true;
document.getElementById("redo").disabled = true;

document.getElementById("exercising").style.display = "none";

start = document.getElementById("exerciseStart");
end = document.getElementById("exerciseEnd");

start.classList.add("path_start");
clicked1 = start;
// clicked1.setAttribute("class", "clicked");
path_list.push([start.cx["animVal"]["valueAsString"], start.cy["animVal"][
    "valueAsString"
]]);
point_list.push(start);

document.getElementsByTagName("svg")[0].style.display = "none";

// document.querySelector("html").classList.add("loading");
load = 0;

textok = false;

paraList = [];
speakerAt = 0;

enable_text_touch = false;

window.onload = function() {
    document.getElementById("dialog").style.display = "none";
    document.getElementById("dialog_musk").style.display = "none";
    document.getElementById("choice").style.display = "none";

    TweenMax.staggerTo(
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
    );

    hideChoice();

    animateBike();
    editDone();
    show_load(0);
}
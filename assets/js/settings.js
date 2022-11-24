// clicked_points = 0; //已选中的标记点个数
clicked1 = ""; //选中的标记点1
path_list = []; //路线
point_list = []; //定位点

class_number = 30; //当前班级数
day = 0;
mood = 100;
money = 10000;

speed_now = 1;

stain = 0; //满100失业

airPollution = 0; //空气污染程度（每天刷新）
receive_per_100px = 100; //每跑操100px的收入
receive_now = receive_per_100px;

// 😀🙂😐🙁😖😠😡🤬😈
faceList = ["&#128512;", "&#128578;", "&#128528;", "&#128577;", "&#128543;", "&#128544;", "&#128545;", "&#129324;", "&#128520;"];
faceList.reverse();
// // justLoadedFromSave = false; //用于在上传存档后统一速度，上传前=false，上传后=true，第一次跑操开始后=false

// now_timeScale = 1; //当前速度

px_per_second = 80; //每秒钟移动的px

undo_list = []; //撤销的序列，撤销一个多一个
// redo_list = [];

document.getElementById("go").disabled = true;
document.getElementById("undo").disabled = true;
document.getElementById("redo").disabled = true;

document.getElementById("exercising").style.display = "none";

start = document.getElementById("exerciseStart"); //出发点
end = document.getElementById("exerciseEnd"); //结束点

// 设置起始点（出发点）-------------
start.classList.add("path_start");
clicked1 = start;
// clicked1.setAttribute("class", "clicked");
path_list.push([start.cx["animVal"]["valueAsString"], start.cy["animVal"][
    "valueAsString"
]]);
point_list.push(start);

document.getElementsByTagName("svg")[0].style.display = "none";
// ------------------
// document.querySelector("html").classList.add("loading");
load = 0; //加载进度，数值0-100

textok = false; //对话框是否打全了所有文字，打全了=true，否则false

paraList = []; //这一次要说的话的整体集合，包含一句或多句话（在对话框里分开说）
speakerAt = 0; //现在说的话在paraList中的位置（说的第几句话）

enable_text_touch = false; //是否允许通过点击的方式加速对话或说下一句话

// 判断元素是否在数组内的函数，使用方法：contains(Array，元素)，返回true或false
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

imagesToLoad = [];

window.onload = function() {
    // 隐藏对话框------------
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

    hideChoice(); //隐藏选项框
    // -------------


    //发起get请求
    var url = 'assets/data/flow.json'; //读取flow.json

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

        keys = Object.keys(flow.text);
        for (i = 0; i < keys.length; i++) {
            para = flow.text[keys[i]];
            for (j = 0; j < para.length; j++) {
                if (para[j].type == "say" || para[j].type == "ask" | para[j].type == "source") {
                    // console.log(para[j].img);
                    if (para[j].img != "" && !contains(imagesToLoad, para[j].img)) {
                        imagesToLoad.push(para[j].img);
                    }
                }
            }
        }

        // console.log(imagesToLoad);

        for (let i = 0; i < imagesToLoad.length; i++) {
            let img = new Image();
            img.src = imagesToLoad[i];
            img.onload = function() {
                load += 100 / imagesToLoad.length;
                show_load(load);
            }
        }

        animateBike(); //添加操场出现的动画
        editDone(); //禁用一些按钮
        show_load(0); //加载进度条归零
        // startGame(); //开始游戏

    }).catch(function(err) {
        console.log(err);
    });
}
alreadyLoaded = false;

// clicked_points = 0; //已选中的标记点个数
clicked1 = ""; //选中的标记点1
path_list = []; //路线
point_list = []; //定位点

// 高一，高二，高三班级数
grade1 = 10;
grade1Special = 1;
grade2 = 10;
grade2Special = 1;
grade3 = 10;
grade3Special = 1;

grade1OK = false;
diningHallLevelOK = false;

class_number = grade1 + grade2 + grade3 + grade1Special + grade2Special + grade3Special; //当前班级数
day = 1;
mood = 100;
money = 100000;

term = 15; //一学期15天
todayInTerm = 1; //今天是这个学期中的第几天

speed_now = 1;

stain = 0; //满100失业

dailyCostEachClass = 2000; //学校每日每个班级开销
receive_per_100px = 100; //每跑操100px的收入
receive_now = receive_per_100px;

complainDays = 0; // >0 => 投诉处理中，处理期间暂不受理新的投诉，处理期间收入减半
classFundDays = 0; // >0 => 刚收了班费，等两天再割韭菜，如果再收=>心情 - 5 * classFundNumber
classFundNumber = 0; //班费收取次数

expect1 = 30000; //上级教育机构预期的封口费
expect2 = 30000; //媒体预期的封口费

received1 = 0; //上级教育机构收到的封口费
received2 = 0; //媒体收到的封口费

usedPlayClass = false; //今天是否加了体活课

airPollution = 0; //空气污染程度（每天刷新）

diningHallLevel = 5;
diningHallMaxLevel = 10;

dormitoryLevel = 5;
dormitoryMaxLevel = 10;

costPerLevel = 1000;
moodPerLevel = 2;

complainedBefore = false;

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

stringToFormat = []; //用于格式化的字符串

paraList = []; //这一次要说的话的整体集合，包含一句或多句话（在对话框里分开说）
speakerAt = 0; //现在说的话在paraList中的位置（说的第几句话）

enable_text_touch = false; //是否允许通过点击的方式加速对话或说下一句话
enable_choice_touch = false; //是否允许点击对话选项

fadeOut1 = true; //开始页面变色后更换fadeOut动画

// 退出提示
window.onbeforeunload = function() {
    if (alreadyLoaded) {
        save("cookie");
        console.log("leave");
        return "确认离开当前页面吗？未保存的数据将会丢失";
    }
}

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

// cookie操作
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; SameSite=None; Secure";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getOs() { //浏览器类型判定
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        return "IE"; //InternetExplor
    } else if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        return "FF"; //firefox
    } else if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
        return "SF"; //Safari
    } else if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
        return "C"; //Camino
    } else if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
        return "G"; //Gecko
    } else if (isMozilla = navigator.userAgent.indexOf("Opera") >= 0) {
        return "O"; //opera
    } else {
        return 'Other';
    }
}

assetsToLoad = []; //预加载的资源列表（无须手动编辑）

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


    //发起get请求，获取flow.json
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
        if (getCookie("mapSaved") != "") {
            nowGameAt = "startGame2";
        } else {
            nowGameAt = "startGame";
        }

        keys = Object.keys(flow.text);

        // 提取所有需要加载的资源，包括对话里的人物img、source里规定需要加载的资源
        for (i = 0; i < keys.length; i++) {
            para = flow.text[keys[i]];
            for (j = 0; j < para.length; j++) {
                if (para[j].type == "say" || para[j].type == "ask" || para[j].type == "source") {
                    // console.log(para[j].img);
                    if (para[j].img != "" && !contains(assetsToLoad, para[j].img)) {
                        assetsToLoad.push(para[j].img);
                    }
                }
            }

        }
        // assetsToLoad = ["https://fastly.jsdelivr.net/gh/YubaC/2810security.github.io@latest/images/%E6%A0%A1%E5%9B%AD%E9%A3%8E%E6%99%AF/IMG_6837.JPG",
        //     "https://fastly.jsdelivr.net/gh/YubaC/2810security.github.io@latest/images/%E6%A0%A1%E5%9B%AD%E9%A3%8E%E6%99%AF/IMG_6842.JPG",
        //     "https://fastly.jsdelivr.net/gh/YubaC/2810security.github.io@latest/images/%E6%A0%A1%E5%9B%AD%E9%A3%8E%E6%99%AF/IMG_6843.JPG"
        // ];
        // console.log(assetsToLoad);

        // for (let i = 0; i < assetsToLoad.length; i++) {
        //     let img = new Image();
        //     img.src = assetsToLoad[i];
        //     img.onload = function() {
        //         load += 100 / assetsToLoad.length;
        //         show_load(load);
        //     }
        // }

        loadAssets(); //加载资源

        animateBike(); //添加操场出现的动画
        editDone(); //禁用一些按钮
        // show_load(0); //加载进度条归零
        // startGame(); //开始游戏

    }).catch(function(err) {
        console.log(err);
    });
}
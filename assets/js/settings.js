"use strict";

const version = "v0.10.2";
const updateText = "v0.10.2更新：修复了刷金钱的漏洞。";

var flow; // 整个游戏的流程
var nowGameAt; // 当前游戏进行到的位置

// 读取version的cookie
if (getCookie("version") == "" || getCookie("version") != version) {
    window.alert("更新日志：\n" + updateText);
    setCookie("version", version, 30 * 365);
}

var alreadyLoaded = false;

// *取消移动端不预加载Theme
// PC = !IsPc();
const PC = true;

// clicked_points = 0; //已选中的标记点个数
var clicked1 = ""; //选中的标记点1
var path_list = []; //路线
var point_list = []; //定位点

// 高一，高二，高三班级数
var grade1 = 10;
var grade1Special = 1;
var grade2 = 10;
var grade2Special = 1;
var grade3 = 10;
var grade3Special = 1;

var grade1OK = false;
var diningHallLevelOK = false;

var class_number =
    grade1 + grade2 + grade3 + grade1Special + grade2Special + grade3Special; //当前班级数
var day = 1;
var mood = 100;
var money = 100000;

var term = 15; //一学期15天
var todayInTerm = 0; //今天是这个学期中的第几天

var speed_now = 1;

var stain = 0; //满100失业

var dailyCostEachClass = 2000; //学校每日每个班级开销
var receive_per_100px = 100; //每跑操100px的收入
var receive_now = receive_per_100px;

var complainDays = 0; // >0 => 投诉处理中，处理期间暂不受理新的投诉，处理期间收入减半
var classFundDays = 0; // >0 => 刚收了班费，等两天再割韭菜，如果再收=>心情 - 5 * classFundNumber
var classFundNumber = 0; //班费收取次数

var expect1 = 30000; //上级教育机构预期的封口费
var expect2 = 30000; //媒体预期的封口费

var received1 = 0; //上级教育机构收到的封口费
var received2 = 0; //媒体收到的封口费

var usedPlayClass = false; //今天是否加了体活课

var airPollution = 0; //空气污染程度（每天刷新）

var diningHallLevel = 5;
const diningHallMaxLevel = 10;

var dormitoryLevel = 5;
const dormitoryMaxLevel = 10;

const costPerLevel = 1000;
const moodPerLevel = 2;

var complainedBefore = false;

// 😀🙂😐🙁😖😠😡🤬😈
const faceList = [
    "&#128512;",
    "&#128578;",
    "&#128528;",
    "&#128577;",
    "&#128543;",
    "&#128544;",
    "&#128545;",
    "&#129324;",
    "&#128520;",
];
faceList.reverse();
var justLoadedFromSave = false; //用于在上传存档后第一天避免事件的干扰，上传前=false，上传后=true，第一次跑操开始后=false

// now_timeScale = 1; //当前速度

var px_per_second = 80; //每秒钟移动的px

var undo_list = []; //撤销的序列，撤销一个多一个
// redo_list = [];

document.getElementById("go").disabled = true;
document.getElementById("undo").disabled = true;
document.getElementById("redo").disabled = true;

document.getElementById("exercising").style.display = "none";

const start = document.getElementById("exerciseStart"); //出发点
const end = document.getElementById("exerciseEnd"); //结束点

// 设置起始点（出发点）-------------
start.classList.add("path_start");
var clicked1 = start;
// clicked1.setAttribute("class", "clicked");
path_list.push([
    start.cx["animVal"]["valueAsString"],
    start.cy["animVal"]["valueAsString"],
]);
point_list.push(start);

document.getElementsByTagName("svg")[0].style.display = "none";
// ------------------
// document.querySelector("html").classList.add("loading");
// load = 0; //加载进度，数值0-100

var textok = false; //对话框是否打全了所有文字，打全了=true，否则false

var stringToFormat = []; //用于格式化的字符串

var paraList = []; //这一次要说的话的整体集合，包含一句或多句话（在对话框里分开说）
var speakerAt = 0; //现在说的话在paraList中的位置（说的第几句话）

var enable_text_touch = false; //是否允许通过点击的方式加速对话或说下一句话
var enable_choice_touch = false; //是否允许点击对话选项

var fadeOut1 = true; //开始页面变色后更换fadeOut动画

// 退出提示
window.onbeforeunload = function () {
    if (alreadyLoaded) {
        save("cookie");
        console.log("leave");
        return "确认离开当前页面吗？未保存的数据将会丢失";
    }
};

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function loadSave(fileString) {
    // 检查存档是否完好
    if (fileString.search("version") != -1) {
        console.log("in3-");
        justLoadedFromSave = true;
        // alert("读取成功！");

        document.getElementById("musk").style.display = "block"; //用于在对话框出现前遮挡背景

        const loadedSave = JSON.parse(fileString); //JSON解码存档

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

        class_number =
            grade1 +
            grade2 +
            grade3 +
            grade1Special +
            grade2Special +
            grade3Special; //当前班级数

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
            const from_x = point_list[i].cx["animVal"]["valueAsString"];
            const from_y = point_list[i].cy["animVal"]["valueAsString"];
            const to_x = point_list[i + 1].cx["animVal"]["valueAsString"];
            const to_y = point_list[i + 1].cy["animVal"]["valueAsString"];
            // console.log(from_x, from_y, to_x, to_y);

            document.getElementById(
                "path_lines"
            ).innerHTML += `<line x1="${from_x}" y1="${from_y}" x2="${to_x}" y2="${to_y}" style="stroke:#fa9668; stroke-width:3px; "></line>`;
        }

        return true;
    } else {
        return false;
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
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toGMTString();
    document.cookie =
        cname + "=" + cvalue + "; " + expires + "; SameSite=None; Secure";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function IsPc() {
    //是PC→false，是移动端→true
    let userAgent = navigator.userAgent,
        Agents = [
            "Android",
            "iPhone",
            "SymbianOS",
            "Windows Phone",
            "iPad",
            "iPod",
        ];
    console.log("userAgent:", userAgent);
    return Agents.some((i) => {
        return userAgent.includes(i);
    });
}

window.onload = function () {
    // 提示浏览器
    var browser = {
        versions: (function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                //移动终端浏览器版本信息
                trident: u.indexOf("Trident") > -1, //IE内核
                presto: u.indexOf("Presto") > -1, //opera内核
                webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
                iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1, //是否iPad
                webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
            };
        })(),
        language: (
            navigator.browserLanguage || navigator.language
        ).toLowerCase(),
    };

    if (browser.versions.mobile) {
        //判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //在微信中打开
            window.alert(
                "您正在使用微信内置的浏览器，将无法进行存档，如需存档请在浏览器里打开本网页！"
            );
        }
        if (ua.match(/WeiBo/i) == "weibo") {
            //在新浪微博客户端打开
            window.alert(
                "您正在使用新浪微博客户端内置的浏览器，将无法进行存档，如需存档请在浏览器里打开本网页！"
            );
        }
        if (ua.match(/QQ/i) == "qq") {
            //在QQ空间打开
            window.alert(
                "您正在使用QQ内置的浏览器，将无法进行存档，如需存档请在浏览器里打开本网页！"
            );
        }
    }

    // 如果是移动端则提示最好在PC端打开
    if (IsPc()) {
        window.alert("我们推荐在PC端打开本网页，以获得最佳体验。");
    }

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
        1,
        {
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

    // 如果getURLParam("onVisit")为true，就进行参观模式的设置
    if (getUrlParam("onVisit") == "true") {
        // 移除saveBtn、rankingListBtn、renameBtn
        document.getElementById("saveBtn").style.display = "none";
        document.getElementById("rankingListBtn").style.display = "none";
        document.getElementById("renameBtn").style.display = "none";

        // 移除退出提示
        window.onbeforeunload = function () {};

        // 获取地图
        const fileName = "rankingList.json";
        // 获取fileName的sha
        fetch(
            "https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" +
                fileName,
            {
                method: "get",
            }
        )
            .then((res) => {
                // console.log(res);
                return res.json();
            })
            .then((data) => {
                return JSON.parse(b64DecodeUnicode(data.content));
            })
            .then((data) => {
                // 取出地图
                const schools = data.list;
                console.log(schools);
                const targetSchool = decodeURI(
                    decodeURI(getUrlParam("targetSchool"))
                );

                let map;
                for (const school of schools) {
                    if (school.schoolName == targetSchool) {
                        map = school.data;
                        break;
                    }
                }

                // 加载存档
                loadSave(JSON.stringify(map));
                // 隐藏#musk
                document.getElementById("musk").style.display = "none";
                window.alert(`您正在参观${targetSchool}，您的操作不会被记录。`);

                // 设置title为targetSchool
                document.title = targetSchool;
            });
    }

    //发起get请求，获取flow.json
    var flowJSONUrl = "assets/data/flow.json";
    fetch(flowJSONUrl)
        .then((response) => response.json())
        .then((data) => {
            flow = data;
            if (getCookie("mapSaved") != "") {
                nowGameAt = "startGame2";
            } else {
                nowGameAt = "startGame";
            }

            // --------------------------------
            // TODO: 以下代码用于判断是否为chrome浏览器，如果是chrome浏览器则加载chrome字体，否则加载微软雅黑字体
            // TODO: 但是目前在移动端钉钉浏览器上似乎有问题，所以暂时注释掉
            // // 判断是否为chrome浏览器
            // isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
            // // alert(isChrome);
            // if (isChrome) {
            //     assetsToLoad.push(flow.font.chrome);
            // }

            // --------------------------------

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
        })
        .catch(function (err) {
            console.log(err);
        });
};

this_asset = 0;
total_size = 0;
loaded = 0;

// this_img = 0;

function loadAssets() {
    switch (window.location.protocol) {
        case "http:":
        case "https:":
            load();
            break;
        case "file:":
            //local file
            show_load(100);
            break;
        default:
            load();
            break;
        //some other protocol
    }

    showAdText(0);
}

// 滚动循环播放flow.text.adText里的内容
let adText = 0;
function showAdText() {
    document.getElementById("adText").innerText = flow.text.adText[adText];
    adText = (adText + 1) % flow.text.adText.length;
    setTimeout(showAdText, 5000);
}

function getTotalSize(assetsToLoad) {
    let totalSize = 0;
    for (const asset of assetsToLoad) {
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", asset, false);
        xhr.send();
        if (xhr.status === 200) {
            const contentLength = Number(
                xhr.getResponseHeader("Content-Length")
            );
            // console.log(contentLength);
            totalSize += contentLength;
        } else {
            alert("ERROR");
            continue;
        }
    }
    return totalSize;
}

function load() {
    const assetsToLoad = new Set();
    for (const key of Object.keys(flow.text)) {
        const para = flow.text[key];
        for (const { type, img, mobile } of para) {
            if (
                ["say", "ask", "source"].includes(type) &&
                img &&
                !assetsToLoad.has(img)
            ) {
                if ((!PC && mobile !== "none") || PC) {
                    assetsToLoad.add(img);
                    console.log(img);
                }
            }
        }
    }

    // Get total size
    const totalSize = getTotalSize(assetsToLoad);
    let loaded = 0;

    // console.log("0")
    // if (this_asset < assetsToLoad.length && assetsToLoad[this_asset].type == "img") {
    for (const asset of assetsToLoad) {
        const xhr = new XMLHttpRequest();
        xhr.open("get", asset, true);
        xhr.responseType = "blob";
        xhr.send();
        xhr.addEventListener("progress", function (oEvent) {
            if (oEvent.lengthComputable) {
                const percentComplete =
                    ((oEvent.loaded + loaded) / totalSize) * 100;
                show_load(percentComplete);
            }
        });
        xhr.addEventListener("load", function (oEvent) {
            const blob = xhr.response;
            loaded += oEvent.total;
            // 遍历flow.text，将img的src替换为blob
            const blobURL = URL.createObjectURL(blob);
            for (const key of Object.keys(flow.text)) {
                const para = flow.text[key];
                // 将para内img和asset对应的src替换为blobURL
                for (let step of para) {
                    if (step.img === asset) {
                        step.img = blobURL;
                    }
                }
            }
            for (const key of Object.keys(flow.bgm)) {
                if (flow.bgm[key] === asset) {
                    flow.bgm[key] = blobURL;
                }
            }

            if (loaded === totalSize) {
                done();
            }
        });
    }
}

function done() {
    //加载完成
    console.log("----------------Loaded!----------------");
    document.querySelector("#process").innerHTML =
        '<p style="border: 1px solid white">PRESS TO START</p>';
    document.getElementById("loading_musk").onclick = function () {
        // loading界面淡出
        fadeOut(document.querySelector("#loading_musk svg"), 40, 0);
        fadeOut(document.querySelector("#loading_musk p"), 40, 0);
        fadeOut(document.querySelector("#process"), 40, 0);
        fadeOut(document.querySelector("#adText"), 40, 0);
        fadeOut(document.getElementById("process"), 40, 0);
        // document.getElementById("top").style.display = "block";
        clearInterval(adText);
        document.getElementById("loading_musk").onclick = "";
        setTimeout(() => {
            startGame(); //开始游戏
        }, 2000);
    };
}

// 用于展示加载进度（由黑色变成白色的LOGO箭头）
function show_load(nowLoaded) {
    let arrowSize = (nowLoaded / 10) * 7;
    document.getElementById(
        "loadingArrow"
    ).style.clipPath = `circle(${arrowSize}%)`;
    document.getElementById("process").innerHTML = `Loading......${nowLoaded}%`;

    if (nowLoaded < 100) {
        // setTimeout("show_load(load)", 100);
        // setTimeout("show_load(load)", 10);
        // load += 1;
    } else {
    }
}

// 用于淡入淡出
// https://www.jb51.net/article/74424.htm
// 底层共用
const iBase = {
    Id: function (name) {
        return document.getElementById(name);
    },
    //设置元素透明度,透明度值按IE规则计,即0~100
    SetOpacity: function (ev, v) {
        ev.filters
            ? (ev.style.filter = "alpha(opacity=" + v + ")")
            : (ev.style.opacity = v / 100);
    },
};

function fadeOut(elem, speed, opacity) {
    /*
     * 参数说明
     * elem==>需要淡入的元素
     * speed==>淡入速度,正整数(可选)
     * opacity==>淡入到指定的透明度,0~100(可选)
     */
    speedspeed = speed || 20;
    opacityopacity = opacity || 0;
    //初始化透明度变化值为0
    var val = 100;
    //循环将透明值以5递减,即淡出效果
    (function () {
        iBase.SetOpacity(elem, val);
        val -= 5;
        if (val >= opacity) {
            setTimeout(arguments.callee, speed);
        } else if (val < 0) {
            //元素透明度为0后隐藏元素
            elem.style.display = "none";
        }
    })();
}

//淡入效果(含淡入到指定透明度)
function fadeIn(elem, speed, opacity) {
    /*
     * 参数说明
     * elem==>需要淡入的元素
     * speed==>淡入速度,正整数(可选)
     * opacity==>淡入到指定的透明度,0~100(可选)
     */
    speedspeed = speed || 20;
    opacityopacity = opacity || 100;
    //显示元素,并将元素值为0透明度(不可见)
    elem.style.display = "block";
    iBase.SetOpacity(elem, 0);
    //初始化透明度变化值为0
    var val = 0;
    //循环将透明值以5递增,即淡入效果
    (function () {
        iBase.SetOpacity(elem, val);
        val += 5;
        if (val <= opacity) {
            setTimeout(arguments.callee, speed);
        }
    })();
}

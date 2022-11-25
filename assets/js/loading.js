this_asset = 0;
total_size = 0;
loaded = 0;

// this_img = 0;

function loadAssets() {
    switch (window.location.protocol) {
        case 'http:':
        case 'https:':
            getSize();
            break;
        case 'file:':
            //local file
            show_load(100);
            break;
        default:
            //some other protocol
    }
}

function getSize() {
    var xhr = new XMLHttpRequest();

    xhr.open('HEAD', assetsToLoad[this_asset], true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.getResponseHeader('Content-Length'));
                total_size += Number(xhr.getResponseHeader('Content-Length'));

                // if (assetsToLoad[this_asset].type == "audio") {
                //     assetsToLoad[this_asset].size = Number(xhr.getResponseHeader('Content-Length'));
                // }

                if (this_asset < assetsToLoad.length - 1) {
                    this_asset += 1;
                    getSize();
                } else {
                    this_asset = 0;
                    load();
                }
                // alert('Size in bytes: ' + xhr.getResponseHeader('Content-Length'));
            } else {
                alert('ERROR');
                getSize();
            }
        }
    };
}

function load() {
    // console.log("0")
    // if (this_asset < assetsToLoad.length && assetsToLoad[this_asset].type == "img") {
    if (this_asset < assetsToLoad.length) {
        // for (i = 0; i < assetsToLoad.length; i++) {
        let req = new XMLHttpRequest();
        // console.log(0)

        req.open("get", assetsToLoad[this_asset], true);
        req.responseType = "blob"; // 加载二进制数据
        req.send();

        // total_size += req.total;
        // console.log(req);

        req.addEventListener("progress", function(oEvent) {
            if (oEvent.lengthComputable) {
                var percentComplete = (oEvent.loaded + loaded) / total_size * 100;
                console.log(percentComplete + "%");
                show_load(percentComplete);
                // pro.innerHTML = percentComplete + "%";
            } else {
                // 总大小未知时不能计算进程信息
            }
        });
        // 加载完毕
        req.addEventListener("load", function(oEvent) {
            let blob = req.response; //  不是 responseText
            loaded += oEvent.total;
            // pro.innerHTML = "图片加载完毕";
            // box.innerHTML += `<img src = ${window.URL.createObjectURL(blob)} >`;
            this_asset += 1;
            console.log(this_asset);
            if (this_asset < assetsToLoad.length) {
                load();
            } else {
                this_asset = 0;
            }
        });
    } else if (this_asset < assetsToLoad.length - 1) {
        this_asset += 1;
        load();
    } else {
        this_asset = 0;
    }
}

// 用于展示加载进度（由黑色变成白色的LOGO箭头）
function show_load(now_at) {
    now_loaded = now_at / 10 * 7;
    document.getElementById("loadingArrow").style.clipPath = `circle(${now_loaded}%)`;

    if (now_at < 100) {
        // setTimeout("show_load(load)", 100);
        // setTimeout("show_load(load)", 10);
        // load += 1;
    } else { //加载完成
        console.log("done");
        setTimeout(() => {
            // loading界面淡出
            fadeOut(document.querySelector("#loading_musk svg"), 40, 0);
            fadeOut(document.querySelector("#loading_musk p"), 40, 0);
            // document.getElementById("top").style.display = "block";
        }, 1000);

        setTimeout(() => {
            startGame(); //开始游戏
        }, 2000);

    }
}

// 用于淡入淡出
// https://www.jb51.net/article/74424.htm
// 底层共用 
iBase = {
    Id: function(name) {
        return document.getElementById(name);
    },
    //设置元素透明度,透明度值按IE规则计,即0~100 
    SetOpacity: function(ev, v) {
        ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
    }
}

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
    (function() {
        iBase.SetOpacity(elem, val);
        val -= 5;
        if (val >= opacity) {
            setTimeout(arguments.callee, speed);
        } else if (val < 0) {
            //元素透明度为0后隐藏元素 
            elem.style.display = 'none';
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
    elem.style.display = 'block';
    iBase.SetOpacity(elem, 0);
    //初始化透明度变化值为0 
    var val = 0;
    //循环将透明值以5递增,即淡入效果 
    (function() {
        iBase.SetOpacity(elem, val);
        val += 5;
        if (val <= opacity) {
            setTimeout(arguments.callee, speed)
        }
    })();
}
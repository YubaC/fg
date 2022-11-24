// 用于展示加载进度（由黑色变成白色的LOGO箭头）
function show_load(now_at) {
    loaded = now_at / 10 * 7;
    document.getElementById("loadingArrow").style.clipPath = `circle(${loaded}%)`;

    if (load < 100) {
        // setTimeout("show_load(load)", 100);
        setTimeout("show_load(load)", 10);
        load += 1;
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

// 用于淡出
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
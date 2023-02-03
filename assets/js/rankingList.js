var token = "Z2l0aHViX3BhdF8xMUFMM0xYTlEwMmRSVmE4RDF6WFhYX3kzaExPVkRvb2NhSHJoN3Z3dFJDYTc5aFFKSmYxaUZMSDJ6WGZuR0RBTUlMVUVCTU1SVGtVRUZtbDMz";
var rankingListBtn = document.getElementById("rankingListBtn");
var renameBtn = document.getElementById("renameBtn");

// base64加密的函数
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

// base64解密的函数
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function updateList() {
    // 禁用按钮
    rankingListBtn.innerHTML = "正在上传...";
    rankingListBtn.disabled = true;
    // 保存游戏
    save("cookie");
    // 读取游戏
    // var fileString = getCookie("mapSaved");
    var mapData = {
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

    // 如果有名称为schoolName的cookie就读取，没有就创建
    if (getCookie("schoolName") == "") {
        var schoolName = window.prompt("请输入你的学校名称", "雾高");
        setCookie("schoolName", schoolName, 30 * 365);
    }

    if (getCookie("schoolName") != "" && schoolName != "") {
        var fileName = "rankingList.json"
            // 获取fileName的sha
        fetch("https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" + fileName, {
            method: "get",
        }).then((res) => {
            // console.log(res);
            return res.json();
        }).then((data) => {
            // 从data.download_url获取json文件
            // console.log(res);
            rankingList = JSON.parse(b64DecodeUnicode(data.content));
            console.log(rankingList);

            // rankingList示例：{"list": [{schooName: "雾高", data: fileString}]}
            var schoolName = getCookie("schoolName");
            console.log(schoolName);

            // 遍历rankingList.list，如果有schoolName的记录就更新，没有就添加
            var flag = 0;
            for (var i = 0; i < rankingList.list.length; i++) {
                if (rankingList.list[i].schoolName == schoolName) {
                    rankingList.list[i].data = mapData;
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                rankingList.list.push({ schoolName: schoolName, data: mapData });
            }

            // base64加密fileString
            var fileStringBase64 = b64EncodeUnicode(JSON.stringify(rankingList));
            // var fileName = Date.now() + "_" + ".txt"
            //本次上传的message,类似于每次commit添加的信息
            // var message = "测试信息"
            fetch("https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" + fileName, {
                method: "put",
                headers: {
                    Authorization: "token " + b64DecodeUnicode(token),
                    Accept: "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    "message": "Update " + schoolName + "'s ranking list",
                    "committer": {
                        "name": "Begonia",
                        "email": "octocat@github.com"
                    },
                    "content": fileStringBase64,
                    "sha": data.sha
                }),
            }).then((res) => {
                console.log(res);
                window.alert("提交成功！");
                rankingListBtn.innerHTML = "提交到排行榜";
                rankingListBtn.disabled = false;
            });
        });
    }
}

// 查看排行榜
function showList() {
    // 保存游戏
    save("cookie");
    // 跳转页面
    window.location.href = "https://yubac.github.io/FG-Ranking-List/index.html";
}

// 重命名学校
function renameSchool() {
    // 禁用按钮
    renameBtn.disabled = true;
    renameBtn.innerHTML = "正在重命名...";

    var schoolNameOld = getCookie("schoolName");
    var schoolName = window.prompt("请输入你的学校名称", schoolNameOld);
    setCookie("schoolName", schoolName, 30 * 365);

    if (getCookie("schoolName") != "") {
        var fileName = "rankingList.json"
            // 获取fileName的sha
        fetch("https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" + fileName, {
            method: "get",
        }).then((res) => {
            // console.log(res);
            return res.json();
        }).then((data) => {
            // 从data.download_url获取json文件
            // console.log(res);
            rankingList = JSON.parse(b64DecodeUnicode(data.content));
            console.log(rankingList);

            // rankingList示例：{"list": [{schooName: "雾高", data: fileString}]}
            // var schoolName = getCookie("schoolName");
            // console.log(schoolName);

            // 遍历rankingList.list
            for (var i = 0; i < rankingList.list.length; i++) {
                if (rankingList.list[i].schoolName == schoolNameOld) {
                    rankingList.list[i].schoolName = schoolName;
                    break;
                }
            }

            // base64加密fileString
            var fileStringBase64 = b64EncodeUnicode(JSON.stringify(rankingList));
            // var fileName = Date.now() + "_" + ".txt"
            //本次上传的message,类似于每次commit添加的信息
            // var message = "测试信息"
            fetch("https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" + fileName, {
                method: "put",
                headers: {
                    Authorization: "token " + b64DecodeUnicode(token),
                    Accept: "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    "message": "Rename " + schoolNameOld + " to " + schoolName,
                    "committer": {
                        "name": "Begonia",
                        "email": "octocat@github.com"
                    },
                    "content": fileStringBase64,
                    "sha": data.sha
                }),
            }).then((res) => {
                console.log(res);
                window.alert("提交成功！");
                renameBtn.innerHTML = "重命名学校";
                renameBtn.disabled = false;
            });
        });
    }
}
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
    // 保存游戏
    save("cookie");
    // 读取游戏
    var fileString = getCookie("mapSaved");

    // 如果有名称为schoolName的cookie就读取，没有就创建
    if (getCookie("schoolName") == "") {
        schoolName = window.prompt("请输入你的学校名称", "雾高");
        setCookie("schoolName", schoolName, 30 * 365);
    }

    if (getCookie("schoolName") != "") {
        var fileName = "rankingList.json"
            // 获取fileName的sha
        fetch("https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" + fileName, {
            method: "get",
        }).then((res) => {
            // console.log(res);
            return res.json();
        }).then((data) => {
            console.log(data);
            return (data);
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
                    rankingList.list[i].data = JSON.parse(fileString);
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                rankingList.list.push({ schoolName: schoolName, data: JSON.parse(fileString) });
            }

            // base64加密fileString
            var fileStringBase64 = b64EncodeUnicode(JSON.stringify(rankingList));
            // var fileName = Date.now() + "_" + ".txt"
            //本次上传的message,类似于每次commit添加的信息
            // var message = "测试信息"
            fetch("https://api.github.com/repos/YubaC/FG-Ranking-List/contents/" + fileName, {
                method: "put",
                headers: {
                    Authorization: "token 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",
                    Accept: "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    "message": "my commit message",
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
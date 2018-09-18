// JavaScript outside file for screen stucture. 

/* run code module void type
 * args 1->language 'js', 'php'...
 * args 2->style 1:comparison 2:verification
*/
function updatePreview(lang, st) {   
    var previewFrame = document.getElementById('preview');
    var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
    preview.open();
    preview.write(editor.getValue());
    preview.close();
    var enterCode = editor.getValue();
    var previewBody = preview.getElementsByTagName('body');
    var ans = previewBody[0].innerText;
    console.log(enterCode);
    console.log(document.getElementById("dst").innerText);
    isSuccess(ans, enterCode, lang, st);
}
function isSuccess(ans, enterCode, lang, st) {
    // 期待する出力値と同じ出力値かどうか比較
    var correct = document.getElementById('successview').innerText;
    console.log(ans);
    console.log(correct);
    if (ans != correct && st == "1") {
        document.getElementById("batsu-image").style.display ="block";
        timer(3);
    } else {
        // sequencing code
        var enterCodeArray = enterCode.split(/\r\n|\r|\n/);
        switch (lang) {
            case "js":
            var isSuccess = isCheck_js(enterCodeArray, st);
            break;
            case "php":
            var isSuccess = isCheck_php(enterCodeArray, st);
            break;
            default:
            break;
        }
        
        if (isSuccess) {
            document.getElementById("maru-image").style.display ="block";
            dispTime();
            clearInterval(interval);
            timer(3);
        } else {
            document.getElementById("batsu-image").style.display ="block";
            timer(3);
        }         
    }
}

function timer(s) {
    timerId = setTimeout(vanishImage, s * 1000);
}

// delete image
function vanishImage() {
    document.getElementById("maru-image").style.display = "none";
    document.getElementById("batsu-image").style.display = "none";
    document.getElementById("one-image").style.display = "none";
    document.getElementById("two-image").style.display = "none";
    document.getElementById("three-image").style.display = "none";
}

function fnReload() {
    clearInterval(interval);
    window.location.reload();
}

// body onload
function loadScreen() {
    var nowSlide = window.sessionStorage.getItem(['nowSlide']);
    if (nowSlide == null) {
        nowSlide = 0;
    }
    $('.slider').slick('slickGoTo', nowSlide);
    document.getElementById("makeCode").style.visibility = "visible";
    document.getElementById("code_editor").style.visibility = "hidden";
    document.getElementById("remakeCode").style.visibility = "hidden";
    document.getElementById("runCode").style.visibility = "hidden";
}

// countdown module
function countDown() {
    document.getElementById("makeCode").style.visibility = "hidden";
    var count = 4;
    var id = setInterval(function(){
        count--;
        document.querySelector("#countTimer").textContent = count;
        if(count === 3) {
            document.getElementById("three-image").style.display ="block";
            timer(0.8);
        } else if (count === 2) {
            document.getElementById("two-image").style.display ="block";
            timer(0.8);
        } else if (count === 1) {
            document.getElementById("one-image").style.display ="block";
            timer(0.8);
        }
        if(count <= 0) {
            clearInterval(id);
            startTime();
            document.getElementById("code_editor").style.visibility = "visible";
            document.getElementById("remakeCode").style.visibility = "visible";
            document.getElementById("runCode").style.visibility = "visible";
        }
    }, 1000);
}

function startTime() {
    startTime = new Date();
    interval = setInterval("dispTime()", 1);
}

function dispTime() {
    stopTime = new Date();
    nowTime = stopTime.getTime() - startTime.getTime();
    nowHour = Math.floor(nowTime / (60 * 60 * 1000));
    nowTime = nowTime - (nowHour * 60 * 60 * 1000);
    nowMinute = Math.floor(nowTime / (60 * 1000));
    nowTime = nowTime - (nowMinute * 60 * 1000);
    nowSecond = Math.floor(nowTime / 1000);
    document.getElementById("durationTime").value = ("0" + nowHour).slice(-2) + ":" + ("0" + nowMinute).slice(-2) + ":" + ("0" + nowSecond).slice(-2);
}

function makeRandomStr(len) {
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";
    var cl = c.length;
    var r = "";
    for (var i=0; i < len; i++) {
        r+= c[Math.floor(Math.random() * cl)];
    }
    return r;
}

function runClick() {
    document.getElementById("run_Code").click();
}

function cleardst() {
    document.getElementById("cleardst").click();
}

/* JavaScript code check */
function isCheck_js(enterCodeArray, st) {
    var isSuccess = false;
    // miss count
    var miss = 0;
    var used = 0;
    var scriptCodeArray = [];
    var commentFlg = false;
    
    // extrac javascript code
    for (var i=0, j=enterCodeArray.length; i < j; i++) {
        enterCodeArray[i] = enterCodeArray[i].replace(/^[\s|　]+|[\s|　]+$/g,'');
        var le = enterCodeArray[i].length;
        if (enterCodeArray[i].substr(0, 2) === "//" || enterCodeArray[i].substr(0, 1) === "<" || enterCodeArray[i].substr(le - 1, 1) === ">" || commentFlg) {
            
        } else if (enterCodeArray[i].substr(0, 2) === "/*" && enterCodeArray[i].substr(le - 2, 2) === "*/") {
            commentFlg = false;         
        } else if (enterCodeArray[i].substr(0, 2) === "/*" && enterCodeArray[i].substr(le - 2, 2) !== "*/") {
            commentFlg = true;           
        } else if (enterCodeArray[i].substr(0, 2) !== "/*" && enterCodeArray[i].substr(le - 2, 2) === "*/") {
            commentFlg = false; 
        } else if (enterCodeArray[i].length === 0) {

        } else {
            scriptCodeArray.push(enterCodeArray[i]);
        }
    }
    // semicolon check
    for (var i=0, j=scriptCodeArray.length; i < j; i++) {
        var le = scriptCodeArray[i].length;
        if (scriptCodeArray[i].substr(le - 1, 1) === "{" || scriptCodeArray[i].substr(le - 1, 1) === "}") {
            
        } else if (scriptCodeArray[i].substr(le - 1, 1) !== ";") {
            miss++;
        } else if (scriptCodeArray[i].substr(le - 1, 1) === ";" && scriptCodeArray[i].substr(le - 2, 1) !== ";") {

        } else {
            miss++;
        }
    }
    // unfair check
    if (st == "1") {
        var correct = document.getElementById('successview').innerText;
        var correctArray = correct.split(/\r\n|\r|\n/);
        for (var i=0, j=scriptCodeArray.length; i < j; i++) {
            for (var k=0, l=correctArray.length; k < l; k++) {
                if (~scriptCodeArray[i].indexOf("document.write('" + correctArray[k] + "');") || 
                    ~scriptCodeArray[i].indexOf('document.write("' + correctArray[k] + '");')) {
                    miss++;
                }
            } 
            if (scriptCodeArray[i].substr(0, 2) === "if" || ~scriptCodeArray[i].indexOf("if")) {
                used++;
            } else if (scriptCodeArray[i].substr(0, 3) === "for" || ~scriptCodeArray[i].indexOf("for")) {
                used++;
            }
        }
        if (used === 0) {
            miss++;
        }
    }
    console.log(miss);
    if (miss === 0) {
        isSuccess = true;
    }
    return isSuccess;
}

/* php code check */
function isCheck_php(enterCodeArray) {
    var isSuccess = false;
    // miss count
    var miss = 0;
    var used = 0;
    var copyArray = [];
    var scriptCodeArray = [];
    var phpFlg = false;
    var commentFlg = false;
    var i = 0;
    // extrac php code
    for (i=0, j=enterCodeArray.length; i < j; i++) {
        var le = enterCodeArray[i].length;
        copyArray.push(enterCodeArray[i].replace(/^[\s|　]+|[\s|　]+$/g,''));
        if (copyArray[i].substr(0, 2) == "<?" || copyArray[i].substr(0, 5) == "<?php") {
            phpFlg = true;
        }
        if ((copyArray[i].substr(0, 2) == "?>" || copyArray[i].substr(le - 2, 2) == "?>") && phpFlg) {
            scriptCodeArray.push(enterCodeArray[i]);
            phpFlg = false;
        } else if ((copyArray[i].substr(0, 2) !== "?>" || copyArray[i].substr(le - 2, 2) !== "?>") && phpFlg) {
            scriptCodeArray.push(enterCodeArray[i]);
        } else if (copyArray[i].substr(0,2) == "#!") {
            scriptCodeArray.push(enterCodeArray[i]);
        } else {

        }
    }

    for (i=0, j=scriptCodeArray.length; i < j; i++) {
        console.log(scriptCodeArray[i]);
    }
    // semicolon check
    for (var i=0, j=scriptCodeArray.length; i < j; i++) {
        var le = scriptCodeArray[i].length;
        if (scriptCodeArray[i].substr(le - 1, 1) === "{" || scriptCodeArray[i].substr(le - 1, 1) === "}" ||
            scriptCodeArray[i].substr(0, 2) == "<?" || scriptCodeArray[i].substr(0, 2) == "//" ||
            scriptCodeArray[i].substr(0, 2) == "/*" || scriptCodeArray[i].substr(le - 2, 2) == "*/" ||
            scriptCodeArray[i].substr(le - 2, 2) == "?>" || scriptCodeArray[i].length == 0) {
            
        } else if (scriptCodeArray[i].substr(le - 1, 1) !== ";") {
            miss++;
        } else if (scriptCodeArray[i].substr(le - 1, 1) === ";" && scriptCodeArray[i].substr(le - 2, 1) !== ";") {

        } else {
            miss++;
        }
    }
    var codeText = scriptCodeArray.join('\n');
    var original_random = Math.random;
    var randomStr = makeRandomStr(30);
    var fileDataName = randomStr + "temp.php";

    var blob = new Blob([codeText], {type: "text/plain"});

    if(window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileDataName);
    } else {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.setAttribute('download', fileDataName);
        a.dispatchEvent(new CustomEvent('click'));
        //a.target = "_blank";
        //a.download = fileDataName;
        //a.click();
    }

    // unfair check
    var correct = document.getElementById('successview').innerText;
    var correctArray = correct.split(/\r\n|\r|\n/);
    for (var i=0, j=scriptCodeArray.length; i < j; i++) {
        for (var k=0, l=correctArray.length; k < l; k++) {
            if (~scriptCodeArray[i].indexOf("echo'" + correctArray[k] + "';") || 
                ~scriptCodeArray[i].indexOf('echo"' + correctArray[k] + '";') || 
                ~scriptCodeArray[i].indexOf("echo('" + correctArray[k] + "');") || 
                ~scriptCodeArray[i].indexOf('echo("' + correctArray[k] + '");') ||
                ~scriptCodeArray[i].indexOf("print'" + correctArray[k] + "';") || 
                ~scriptCodeArray[i].indexOf('print"' + correctArray[k] + '";') || 
                ~scriptCodeArray[i].indexOf("print('" + correctArray[k] + "');") || 
                ~scriptCodeArray[i].indexOf('print("' + correctArray[k] + '");')) {
                miss++;
            }
        } 
        if (copyArray[i].substr(0, 2) === "if" || ~copyArray[i].indexOf("if")) {
            used++;
        } else if (copyArray[i].substr(0, 3) === "for" || ~copyArray[i].indexOf("for")) {
            used++;
        }
    }
    if (used === 0) {
        miss++;
    }
    console.log(miss);
    if (miss === 0) {
        isSuccess = true;
    }
    return isSuccess;
}



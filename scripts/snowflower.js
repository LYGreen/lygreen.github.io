/*
来自
https://blog.csdn.net/qq_45457134/article/details/132164258
*/

// 雪花数量
var snowmax = 40 
// 设置雪的颜色，可添加任意颜色
var snowcolor = ["#FFDA65","#00AADD","#aaaacc","#a0c4ff","#ccccdd","#caffbf","#bbf7f9","#ffc6ff","#ffd6a5"]
// 设置创建雪花的字体，可添加任意字体
var snowtype = ["Times","Arial","Verdana"]
// 设置创建雪花的字母（推荐：*）
var snowletter = "❉"
// 设置下沉速度（建议值范围为0.3到2）
var sinkspeed = 0.6
// 设置雪花的最大大小
var snowmaxsize = 32
// 设置雪花的最小大小
var snowminsize = 12
// 设置下雪区，1：全屏，2：左侧，3：中间，4：右侧
var snowingzone = 1
// var snowmaxopacity = 1
// var snowminopacity = 0.6

var snow = []
var marginbottom
var marginright
var timer
var i_snow = 0
var x_mv = []
var crds = []
var lftrght = []
var browserinfos = navigator.userAgent
var ie5 = document.all && document.getElementById && !browserinfos.match(/Opera/)
var ns6 = document.getElementById && !document.all
var opera = browserinfos.match(/Opera/)
var browserok = ie5 || ns6 || opera
 
function randommaker(range) {
    rand = Math.floor(range * Math.random())
    return rand
}
 
function initsnow() {
    if (ie5 || opera) {
        marginbottom = document.body.scrollHeight - 80
        marginright = document.body.clientWidth - 15
    } else if (ns6) {
        marginbottom = document.body.scrollHeight - 80
        marginright = window.innerWidth - 15
    }
    var snowsizerange = snowmaxsize - snowminsize

    for (var i = 0;i <= snowmax;i++) {
        crds[i] = 0;
        lftrght[i] = Math.random()*15;
        x_mv[i] = 0.03 + Math.random()/10;
        snow[i] = document.getElementById("s"+i)
        snow[i].style.fontFamily = snowtype[randommaker(snowtype.length)]
        snow[i].size = randommaker(snowsizerange)+snowminsize
        snow[i].style.fontSize = snow[i].size+'px';
        snow[i].style.color = '#ffffff'
        snow[i].style.zIndex = 1000
        snow[i].sink = sinkspeed*snow[i].size/5
        if (snowingzone==1) {snow[i].posx = randommaker(marginright-snow[i].size)}
        if (snowingzone==2) {snow[i].posx = randommaker(marginright/2-snow[i].size)}
        if (snowingzone==3) {snow[i].posx = randommaker(marginright/2-snow[i].size)+marginright/4}
        if (snowingzone==4) {snow[i].posx = randommaker(marginright/2-snow[i].size)+marginright/2}
        snow[i].posy = randommaker(2*marginbottom-marginbottom-2*snow[i].size)
        snow[i].style.left=snow[i].posx+'px';
        snow[i].style.top=snow[i].posy+'px';
    }
    movesnow()
}
 
function movesnow() {
    for (var i = 0;i <= snowmax;i++) {
        crds[i] += x_mv[i];
        snow[i].posy+=snow[i].sink
        snow[i].style.left = snow[i].posx+lftrght[i]*Math.sin(crds[i])+'px';
        snow[i].style.top = snow[i].posy+'px';
 
        if (snow[i].posy>=marginbottom-2*snow[i].size || parseInt(snow[i].style.left)>(marginright-3*lftrght[i])){
            if (snowingzone==1) {snow[i].posx = randommaker(marginright-snow[i].size)}
            if (snowingzone==2) {snow[i].posx = randommaker(marginright/2-snow[i].size)}
            if (snowingzone==3) {snow[i].posx = randommaker(marginright/2-snow[i].size)+marginright/4}
            if (snowingzone==4) {snow[i].posx = randommaker(marginright/2-snow[i].size)+marginright/2}
            snow[i].posy = 0
        }
    }
    var timer = setTimeout("movesnow()", 50)
}
 
for (var i = 0;i <= snowmax;i++) {
    document.write("<span id='s"+i+"' style='position:absolute;top:-"+snowmaxsize+"'>"+snowletter+"</span>")
}
if (browserok) {
    window.onload = initsnow
}
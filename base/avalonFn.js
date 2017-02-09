/**
 * Created by Xcar on 2017/1/24.
 */
var SOU = window.SOU = {
    lastScript : 0,//搜索框中动态script的src是随机的，设置初始值
    locationArr : [],//百度地图
    loadJScript: function (locationArr) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=cGH4QZGSqaXZzLqcGs5tx9SKOY6mAgeG&callback=init(SOU.locationArr)";
        document.body.appendChild(script);
        }
}


avalon.loadScript = avalon.fn.loadScript = function (url){
    var f = document.createElement("script");
    var d = new Date().getTime();
    f.type = "text/javascript";
    f.id = d;
    f.src = url;
    document.getElementsByTagName("head")[0].appendChild(f);
    if (SOU.lastScript && document.getElementById(SOU.lastScript)){
        document.getElementById(SOU.lastScript).parentNode.removeChild(document.getElementById(SOU.lastScript));
    }
    SOU.lastScript = d;
}
//转换字符串
avalon.heredoc = avalon.fn.heredoc = function(fn){
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
        replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}

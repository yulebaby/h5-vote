$(function () {
    document.documentElement.style.fontSize = innerWidth/3.2 + 'px';
    window.onresize = function(){
        document.documentElement.style.fontSize = innerWidth/3.2 + 'px';
    };
})
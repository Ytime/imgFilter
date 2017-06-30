
require("./index.html");  //改变html，webpack-dev-server无法监听html，通过require方法通知
import "./style/style.css";

//获取id
var $ = function(id){
    return "string" === typeof id ? document.getElementById(id) : id;
}
//追加class
var addClass = function(ele, className){
    if (ele.classList){
        ele.classList.add(className);
    }else{
        if (ele.className.indexOf(className) === -1){
            ele.className += ' ' + className;
        }
    }
}

//删除class
var removeClass = function(ele, className){
    if (ele.classList){
        ele.classList.remove(className);
    }else{
        ele.className = ele.className.replace(new  RegExp("(\\s|^)" + className + "(\\s|$)"),'');
    }
}

//获取页面元素
var oCanvas = $('canvas'),
    oDropper = $('wrapper'),
    oUl = $('filter-li'),
    oBtn = $('apply-btn'),
    oCtx = oCanvas.getContext && oCanvas.getContext('2d'),
    oFliter;

//绑定事件
oUl.addEventListener('click', applyPresetFliter, false);
//oDropper在dragenter阶段需要取消默认行为
oDropper.addEventListener('dragenter',preventDefault,false);
oDropper.addEventListener('dragover',preventDefault,false);
oDropper.addEventListener('drop', dropHandler, false);


//取消默认事件
function preventDefault(event){
    var evt = event || window.event;
    evt.preventDefault();
}

//drop放置事件处理函数
function dropHandler(event){
    preventDefault(event);
    //获取文件
    var oFile = event.dataTransfer.files[0];
    var oReader = new FileReader();
    //读取image
    if(/image/.test(oFile.type)){

        //取消拖放提示
        addClass(this, 'active');
        //读完文件
        oReader.onload = function(){
            console.log(oFile)
            //创建image对象保存图片
            var oImg = new Image();

            oImg.onload = function(){
                var iWid = this.width;
                var iHei = this.height;
                removeClass(oCanvas,'init');
                oCanvas.width = iWid;  //要注意使用canvasobj.设置width，否则会图片会变形
                oCanvas.height = iHei;
                oCtx.drawImage(oImg, 0, 0, iWid, iHei);

            }
            oImg.src = oReader.result;
        }

        oReader.readAsDataURL(oFile);

    }

}

//应用预置滤镜
function applyPresetFliter(event){
    var tar = event.target || event.srcElement;
    //事件委托
    if (tar.tagName.toLocaleLowerCase() === 'li'){
        var preTar = this.getElementsByClassName('active')[0];
        if(preTar){
            preTar.className = '';
        }
        var filterName = tar.getAttribute('data-filter');
        console.log('apply ' + filterName);
        addClass(tar, 'active');
    }
}

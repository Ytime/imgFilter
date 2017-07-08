
require("./index.html");  //改变html，webpack-dev-server无法监听html，通过require方法通知
import "./style/style.css";
import Filters from './Filters.js';

//获取id
const $ = function(id){
    return "string" === typeof id ? document.getElementById(id) : id;
}
//获取页面元素
let oCanvas = $('canvas'),
    oDropper = $('wrapper'),
    oUl = $('filter-li'),
    oMat = $('mat-con'),
    oBtn = $('apply-btn'),
    oCtx = oCanvas.getContext && oCanvas.getContext('2d'),
    oFliter = null;

//绑定事件
oUl.addEventListener('click', applyPresetFliter, false);
//oDropper在dragenter阶段需要取消默认行为
oDropper.addEventListener('dragenter',preventDefault,false);
oDropper.addEventListener('dragover',preventDefault,false);
oDropper.addEventListener('drop', dropHandler, false);

oMat.addEventListener('input', checkInput, false);
oMat.addEventListener('keyup', postInput, false);
oBtn.addEventListener('click', applyMat, false);


//取消默认事件
function preventDefault(event){
    let evt = event || window.event;
    evt.preventDefault();
}
function clearActive(){
    let tar = oUl.getElementsByClassName('active')[0];
    if(tar){
        tar.classList.remove('active');
    }
}
//drop放置事件处理函数
function dropHandler(event){
    preventDefault(event);
    //获取文件
    let oFile = event.dataTransfer.files[0],
        oReader = new FileReader();
    //读取image
    if(/image/.test(oFile.type)){

        //取消拖放提示
        this.classList.add('active');
        //读完文件
        oReader.onload = function(){
            console.log(oFile)
            //创建image对象保存图片
            let oImg = new Image();

            oImg.onload = function(){
                let iWid = this.width,
                    iHei = this.height;
                oCanvas.classList.remove('init');
                oMat.classList.add('active');
                clearActive();
                oCanvas.width = iWid;  //要注意使用canvasobj.width设置width，否则会图片会变形
                oCanvas.height = iHei;
                oCtx.drawImage(oImg, 0, 0, iWid, iHei);

                //创建滤镜对象
                oFliter = new Filters(this);

            }
            oImg.src = oReader.result;
        }

        oReader.readAsDataURL(oFile);

    }

}

//应用预置滤镜
function applyPresetFliter(event){
    let tar = event.target || event.srcElement;
    //事件委托
    if (tar.tagName.toLocaleLowerCase() === 'li'){

        let filterName = tar.getAttribute('data-filter');

        if (oFliter){
            clearActive()
            oCtx.putImageData(oFliter[filterName](), 0, 0);
            console.log('apply ' + filterName);
            tar.classList.add('active');
        }
    }
}

//应用矩阵卷积
function applyMat(){
    let aInputs = oMat.getElementsByTagName('input'),
        mat = [],
        val;
    for (let i = 0, len = aInputs.length; i < len; i++){
        val = aInputs[i].value - 0;
        if (Number.isNaN(val)){
            val = 0;
        }
        aInputs[i].value = val;
        mat.push(val);
    }
    clearActive();
    oCtx.putImageData(oFliter.conv(mat), 0, 0);
}

//输入矩阵校验
function checkInput(event){
    let tar = event.target || event.srcElement;
    if (tar.tagName.toLocaleLowerCase() === 'input'){
        tar.value = tar.value.replace(/[^\+\/\-\d\.]*/g,'');
    }
}
//enter提交
function postInput(event){
    let tar = event.target || event.srcElement;
    if (tar.tagName.toLocaleLowerCase() === 'input'){
        if(event.keyCode === 13){
            applyMat.apply(this);
        }
    }
}

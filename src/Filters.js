/**
 * Created by 风稻人 on 2017/7/1.
 */

export default class Filters {
    //构造函数，每个实例保存原始图片数据
    constructor(img){
        //创建一个canvas保存原始图像
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }
    //获取图像数据
    getImageData(x, y, w, h){
        return this.ctx.getImageData(x || 0, y || 0, w || this.width, h || this.height);
    }

    //img图像数据通过canvas复制一份
    copyImageData(imgData){
        imgData = imgData || this.getImageData();
        let canvas =  document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            w = imgData.width,
            h = imgData.height;
        canvas.width = w;
        canvas.height = h;
        ctx.putImageData(imgData, 0, 0);
        return ctx.getImageData(0, 0, w, h);
    }
    //灰度
    greyScale(imgData) {
        //图片像素数据
        imgData = imgData || this.getImageData();
        let data = imgData.data,
            r, g, b, v;
        for(let i = 0, len = data.length; i < len; i += 4){
            r = data[i]; g = data[i + 1]; b = data[i + 2];
            //加权取值
            v = .299 * r + .587 * g + .114 * b;
            data[i] = data[i + 1] = data[i + 2] = v;
        }
        return imgData;
    }
    //黑白效果，二值化
    black(imgData, threshold = 100){
        imgData = imgData || this.getImageData();
        let data = imgData.data,
            v;
        for(let i = 0, len = data.length; i < len; i += 4){
            v = (.2 * data[i] + .7 * data[i + 1] + .1 * data[i + 2]) >= threshold ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = v;
        }
        return imgData;
    }
    //连环画效果
    comic(imgData){
        imgData = imgData || this.getImageData();
        let data = imgData.data,
            r, g, b;
        for(let i = 0, len = data.length; i < len; i += 4){
            r = data[i]; g = data[i + 1]; b = data[i + 2];
            data[i]     = Math.abs((g - b + g + r)) * r /256;
            data[i + 1] = Math.abs((b - g + r + b)) * r /256;
            data[i + 2] = Math.abs((b - g + r + b)) * g /256;
        }
        return imgData;
    }
    //怀旧风格
    sepia(imgData){
        imgData = imgData || this.getImageData();
        let data = imgData.data,
            r, g, b;
        for(let i = 0, len = data.length; i < len; i += 4){
            r = data[i]; g = data[i + 1]; b = data[i + 2];
            data[i]     = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
            data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
            data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
        }
        return imgData;
    }
    //底片
    invert(imgData){
        imgData = imgData || this.getImageData();
        let data = imgData.data
        for(let i = 0, len = data.length; i < len; i += 4){
            data[i]     = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        return imgData;
    }
    //加亮
    brightness(imgData, deta = 50){
        imgData = imgData || this.getImageData();
        let data = imgData.data;
        for(let i = 0, len = data.length; i < len; i += 4){
            data[i]     += deta;
            data[i + 1] += deta;
            data[i + 2] += deta;
        }
        return imgData;

    }
    //高斯模糊
    //理论值遵循3σ原则，这里根据效果适当调大，在较小的阶数下也能有比较好的效果
    gaussBlur(imgData, radius = 1, sigma = radius){
        imgData = imgData || this.getImageData();
        let order = radius*2 + 1,
            a = -1 / (2 * sigma * sigma),
            b = -a / Math.PI,
            gaussMat = new Array(order * order),
            gaussSum = 0;
        for (let x = -radius, i = 0; x <= radius; x++){
            for (let y = -radius; y <= radius; y++, i++){
                gaussMat[i] = b * Math.exp(a * (x*x + y*y));
                gaussSum += gaussMat[i];
            }
        }
        //归一化
        for (let i = 0; i < gaussMat.length; i++){
            gaussMat[i] /= gaussSum;
        }
        //gaussMat = [16, 26, 16, 26, 41, 26, 16, 26, 16];
        //let gaussMat = [1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 16, 26, 16, 4, 1, 4, 7, 4, 1]
        return this.conv(gaussMat, imgData, 1, order);
    }
    //素描
    sketch(imgData){
        imgData = imgData || this.getImageData();
        let imgGrey = this.greyScale(imgData),  //灰度去色
            imgInvert = this.invert(this.copyImageData(imgGrey)),  //复制一份反向imgInvert
            imgBlur = this.gaussBlur(imgInvert), //对imgInvert进行高斯模糊
            data = imgGrey.data,
            dataBlur = imgBlur.data,
            v1, v2, v, k;
        //颜色减淡
        for(let i = 0, len = data.length; i < len; i += 4){
            for (let j = 0; j < 3; j++){
                k = i + j;
                v1 = data[k]; v2 = dataBlur[k];
                v = v1 + v1 * v2 / (255 - v2);
                v = v > 255 ? 255 : v;
                data[k] = v;
            }

        }
        return imgGrey;
    }

    //核卷积
    conv(mat, imgData, divisor = 1, order = 3){

        imgData = imgData || this.getImageData();
        let data = imgData.data,
            w = this.width,
            h = this.height,
            outputImg = this.ctx.createImageData(w, h),
            outData = outputImg.data,
            radius = Math.floor(order  / 2);

        //先遍历图片像素(x, y)
        for(let y = 0; y < h; y++){
            for(let x = 0; x < w; x++){
                //遍历r,g,b三通道，做一样的处理
                for(let z = 0; z < 3; z++){
                    let i = (y * w + x) * 4 + z;  //中心点像素(x, y)在data中的索引

                    //边界处理使用最简单的方法，即不做处理
                    if (x < radius || y < radius || x >= w - radius || y >= h - radius){
                        outData[i] = data[i];
                    }
                    //非边界处矩阵卷积
                    else{
                        //卷积和
                        let convSum = 0,
                            matIndex = 0,
                            gaussSum = 0;
                        //遍历矩阵行
                        for (let m = -radius; m <= radius; m++ ){
                            //矩阵列
                            let rowIndex = i + w*4*m;   //(x-m,y)


                            for (let n = -radius; n <= radius; n++){
                                let colIndex = rowIndex + n*4;  //(x-m, y-n)
                                convSum = convSum + mat[matIndex] * data[colIndex];
                                gaussSum += mat[matIndex]
                                matIndex++;

                            }
                        }
                        outData[i] = convSum / divisor;
                    }
                }
                // 设置透明度
                outData[(y * w + x) * 4 + 3] = 255;
            }
        }
        return outputImg;
    }

}

//Filters.prototype = {
//
//}




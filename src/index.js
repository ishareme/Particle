import utils from './utils';

function Circle(x, y, vx, vy, r, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.color = color;
}

function Particle(...options) {
    this.init(options);
    console.log('options', options);
}

Particle.prototype = {
    init(options){
        if (!options[0] || !utils.$(options[0])) return new Error(`未含有${options[0]}的canvas`);
        console.log('utils.isMobile()',utils.isMobile())
        if (utils.isMobile()){
            this.optionsDefault = {
                background: '#FFF',
                particleNum: 300,
                particleR: 0.5,
                particleSpeed: 20,
                lineLength: 10,
                lineWidth: 0.2,
                mousePointColor: '#000',
            };
        }
        else {
            this.optionsDefault = {
                background: '#FFF',
                particleNum: 300,
                particleR: 1,
                particleSpeed: 20,
                lineLength: 60,
                lineWidth: 0.5,
                mousePointColor: '#000',
            };
        }
        this.options = utils.extend(true, this.optionsDefault, options[1]);

        this.canvas = utils.$(options[0]);

        //不含鼠标点
        this.circleArr = [];
        //含有鼠标点
        this.circleArrAll = []
        //鼠标点
        this.mousePoint = new Circle(0,0,0,0, 2, this.options.mousePointColor);

        this.createCanvas();
        this.createCircle();
        this.bind(this.canvas, this.event.touchStart, this.event.touchMove, this.event.touchEnd);
        this.draw();
    },
    createCanvas(){
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.drawBackground();
    },
    drawBackground(){
        this.ctx.fillStyle = this.options.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    createCircle(){
        for(let i = 0; i < this.options.particleNum; i++){
            let circleX = utils.randomNumber(this.canvas.width);
            let circleY = utils.randomNumber(this.canvas.height);
            let circleVX = utils.randomNumber(this.options.particleSpeed, this.options.particleSpeed * -1) / 20;
            let circleVY = utils.randomNumber(this.options.particleSpeed, this.options.particleSpeed * -1) / 20;
            let circleR = this.options.particleR;
            let circleColor = utils.randomColor();
            this.circleArr.push(new Circle(circleX, circleY, circleVX, circleVY, circleR, circleColor));
        }

        this.circleArrAll = [this.mousePoint].concat(this.circleArr);
    },
    bind(ele, touchStartEvent, touchMoveEvent, touchEndEvent){
        if (!ele) return new Error('未传入元素');
        let isTouch = utils.isMobile(), myEvent;
        let touchStart = isTouch ? 'touchstart' : 'mousedown';
        let touchMove = isTouch ? 'touchmove' : 'mousemove';
        let touchEnd = isTouch ? 'touchend' : 'mouseup';

        function getPoint(event) {
            console.log('event',event)
            myEvent = event || window.event;
            console.log('myEvent',myEvent)
            console.log('isTouch',isTouch)
            console.log('event.touches[0]',event.touches[0])
            myEvent = isTouch ? event.touches[0] : event;
            console.log('myEvent2',myEvent)

            let x = myEvent.pageX || myEvent.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
            x -= ele.offsetLeft;
            let y = myEvent.pageY || myEvent.clientY + document.documentElement.scrollLeft + document.body.scrollLeft;
            y -= ele.offsetTop;

            return {
                x: x,
                y: y,
            };
        }

        ele.addEventListener(touchStart, function (event) {
            event.point = getPoint(event);
            touchStartEvent && touchStartEvent.call(this, event);
        }, false);
        ele.addEventListener(touchMove, (event) => {
            event.point = getPoint(event);
            touchMoveEvent && touchMoveEvent.call(this, event);
        }, false);
        ele.addEventListener(touchEnd, function (event) {
            event.point = getPoint(event);
            touchEndEvent && touchEndEvent.call(this, event);
        });
    },
    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground()
        this.ctx.save();
        this.drawCircle();
        this.ctx.restore();
        requestAnimationFrame(() => this.draw());
    },
    drawCircle(){
        this.circleArr.forEach((item) => {
            this.ctx.fillStyle = item.color;
            this.ctx.beginPath();

            //圆点移动
            this.circleMove(item);

            this.ctx.arc(item.x, item.y, item.r, 0, 2 * Math.PI, true);
            this.ctx.fill();

            for (var i=0; i < this.circleArrAll.length; i++){
                var currCircle = this.circleArrAll[i];
                //如果是同项 或者 当 mousePoint 还未赋值就跳过
                if (item === currCircle || currCircle.x === null || currCircle.y === null) continue;
                //每两个圆点之间在一定距离(this.options.lineLength)之内，绘制线
                if (utils.dis(item, currCircle) < this.options.lineLength){
                    //当鼠标移入的时候，让内部的圆点跟随鼠标的移动
                    //在 距离(utils.dis2(item, currCircle) > (this.options.lineLength * this.options.lineLength) /2)内 圆点跟随鼠标的移动
                    if (currCircle === this.mousePoint && utils.dis2(item, currCircle) > (this.options.lineLength * this.options.lineLength) /2){
                        //圆点跟随鼠标的移动
                        this.moveToMousePoint(item, currCircle);
                    }
                    //绘制线
                    this.drawLine(item, currCircle);
                }
            }
        });
    },
    circleMove(item){
        item.x += item.vx;
        item.y += item.vy;
        //圆点移动到边框的时候需要回弹
        item.vx *= (item.x <= 0 || item.x >= (this.canvas.width - item.r)) ? -1 : 1;
        item.vy *= (item.y <= 0 || item.y >= (this.canvas.height - item.r)) ? -1 : 1;
    },
    moveToMousePoint(item, currCircle){
        // 小圆点的向鼠标点移动
        item.x -= (item.x - currCircle.x) * 0.03;
        item.y -= (item.y - currCircle.y) * 0.03;
    },
    drawLine(item, currCircle){
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.2;
        this.ctx.strokeStyle = utils.lineColor(this.ctx, item, currCircle);
        this.ctx.moveTo(item.x, item.y);
        this.ctx.lineTo(currCircle.x, currCircle.y);
        this.ctx.stroke();
        this.ctx.closePath();
    },

    event: {
        touchStart(event) {
            console.log('mouseDown', event);
        },
        touchMove(event) {
            this.mousePoint.x = event.point.x;
            this.mousePoint.y = event.point.y;
        },
        touchEnd(event) {
            console.log('mouseUp', event);
        },
    },
};

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
window.cancelAnimationFrame = (window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.clearTimeout);

export default Particle;

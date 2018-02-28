(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Particle = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utils = {
    $: function $(ele) {
        if (document.querySelector) {
            return document.querySelector(ele);
        } else {
            if (ele.indexOf('#') > -1) {
                return document.getElementById(ele.replace('#', ''));
            } else if (ele.indexOf('.') > -1) {
                return document.getElementsByClassName(ele.replace('.', ''))[0];
            } else {
                return document.getElementsByTagName(ele)[0];
            }
        }
    },
    extend: function extend() {
        var options = void 0,
            name = void 0,
            clone = void 0,
            copy = void 0,
            source = void 0,
            copyIsArray = void 0,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && type(target) !== 'function') {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            //
            if ((options = arguments[i]) !== null) {
                // for in source object
                for (name in options) {

                    source = target[name];
                    copy = options[name];

                    if (target == copy) {
                        continue;
                    }

                    // deep clone
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        // if copy is array
                        if (copyIsArray) {
                            copyIsArray = false;
                            // if is not array, set it to array
                            clone = source && Array.isArray(source) ? source : [];
                        } else {
                            // if copy is not a object, set it to object
                            clone = source && isPlainObject(source) ? source : {};
                        }

                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    },
    randomNumber: function randomNumber() {
        var _len = arguments.length;
        switch (_len) {
            case 1:
                return Math.floor(Math.random() * arguments[0]);
            case 2:
                return Math.floor(Math.random() * (arguments[1] - arguments[0]) + arguments[0]);
            default:
                return Math.floor(Math.random() * 10);
        }
    },
    randomColor: function randomColor() {
        return '#' + Math.random().toString(16).substring(2).substr(0, 6);
    },
    dis: function dis(obj1, obj2) {
        return Math.sqrt((obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y) * (obj1.y - obj2.y));
    },
    dis2: function dis2(obj1, obj2) {
        return (obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y) * (obj1.y - obj2.y);
    },

    //线颜色渐变
    lineColor: function lineColor(ctx, dot1, dot2) {
        var linear = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y);
        linear.addColorStop(0, dot1.color);
        linear.addColorStop(1, dot2.color);
        return linear;
    },
    isMobile: function isMobile() {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }
};

function type(object) {
    var class2type = {},
        type = class2type.toString.call(object),
        typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) {
        return object + '';
    }

    typeString.split(' ').forEach(function (type) {
        class2type['[object ' + type + ']'] = type.toLowerCase();
    });

    return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' || typeof object === 'function' ? class2type[type] || 'object' : typeof object === 'undefined' ? 'undefined' : _typeof(object);
}

function isPlainObject(object) {
    var proto = void 0,
        ctor = void 0,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,
        fnToString = hasOwn.toString,
        ObjectFunctionString = fnToString.call(Object);

    if (!object || toString.call(object) !== '[object Object]') return false;

    proto = Object.getPrototypeOf(object);

    if (!proto) return true;

    ctor = hasOwn.call(proto, 'constructor') && proto.constructor;

    return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
}

function Circle(x, y, vx, vy, r, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.color = color;
}

function Particle() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
    }

    this.init(options);
    console.log('options', options);
}

Particle.prototype = {
    init: function init(options) {
        if (!options[0] || !utils.$(options[0])) return new Error('\u672A\u542B\u6709' + options[0] + '\u7684canvas');
        console.log('utils.isMobile()', utils.isMobile());
        if (utils.isMobile()) {
            this.optionsDefault = {
                background: '#FFF',
                particleNum: 300,
                particleR: 0.5,
                particleSpeed: 20,
                lineLength: 10,
                lineWidth: 0.2,
                mousePointColor: '#000'
            };
        } else {
            this.optionsDefault = {
                background: '#FFF',
                particleNum: 300,
                particleR: 1,
                particleSpeed: 20,
                lineLength: 60,
                lineWidth: 0.5,
                mousePointColor: '#000'
            };
        }
        this.options = utils.extend(true, this.optionsDefault, options[1]);

        this.canvas = utils.$(options[0]);

        //不含鼠标点
        this.circleArr = [];
        //含有鼠标点
        this.circleArrAll = [];
        //鼠标点
        this.mousePoint = new Circle(0, 0, 0, 0, 2, this.options.mousePointColor);

        this.createCanvas();
        this.createCircle();
        this.bind(this.canvas, this.event.touchStart, this.event.touchMove, this.event.touchEnd);
        this.draw();
    },
    createCanvas: function createCanvas() {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.drawBackground();
    },
    drawBackground: function drawBackground() {
        this.ctx.fillStyle = this.options.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    createCircle: function createCircle() {
        for (var i = 0; i < this.options.particleNum; i++) {
            var circleX = utils.randomNumber(this.canvas.width);
            var circleY = utils.randomNumber(this.canvas.height);
            var circleVX = utils.randomNumber(this.options.particleSpeed, this.options.particleSpeed * -1) / 20;
            var circleVY = utils.randomNumber(this.options.particleSpeed, this.options.particleSpeed * -1) / 20;
            var circleR = this.options.particleR;
            var circleColor = utils.randomColor();
            this.circleArr.push(new Circle(circleX, circleY, circleVX, circleVY, circleR, circleColor));
        }

        this.circleArrAll = [this.mousePoint].concat(this.circleArr);
    },
    bind: function bind(ele, touchStartEvent, touchMoveEvent, touchEndEvent) {
        var _this = this;

        if (!ele) return new Error('未传入元素');
        var isTouch = utils.isMobile(),
            myEvent = void 0;
        var touchStart = isTouch ? 'touchstart' : 'mousedown';
        var touchMove = isTouch ? 'touchmove' : 'mousemove';
        var touchEnd = isTouch ? 'touchend' : 'mouseup';

        function getPoint(event) {
            console.log('event', event);
            myEvent = event || window.event;
            console.log('myEvent', myEvent);
            console.log('isTouch', isTouch);
            console.log('event.touches[0]', event.touches[0]);
            myEvent = isTouch ? event.touches[0] : event;
            console.log('myEvent2', myEvent);

            var x = myEvent.pageX || myEvent.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
            x -= ele.offsetLeft;
            var y = myEvent.pageY || myEvent.clientY + document.documentElement.scrollLeft + document.body.scrollLeft;
            y -= ele.offsetTop;

            return {
                x: x,
                y: y
            };
        }

        ele.addEventListener(touchStart, function (event) {
            event.point = getPoint(event);
            touchStartEvent && touchStartEvent.call(this, event);
        }, false);
        ele.addEventListener(touchMove, function (event) {
            event.point = getPoint(event);
            touchMoveEvent && touchMoveEvent.call(_this, event);
        }, false);
        ele.addEventListener(touchEnd, function (event) {
            event.point = getPoint(event);
            touchEndEvent && touchEndEvent.call(this, event);
        });
    },
    draw: function draw() {
        var _this2 = this;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.ctx.save();
        this.drawCircle();
        this.ctx.restore();
        requestAnimationFrame(function () {
            return _this2.draw();
        });
    },
    drawCircle: function drawCircle() {
        var _this3 = this;

        this.circleArr.forEach(function (item) {
            _this3.ctx.fillStyle = item.color;
            _this3.ctx.beginPath();

            //圆点移动
            _this3.circleMove(item);

            _this3.ctx.arc(item.x, item.y, item.r, 0, 2 * Math.PI, true);
            _this3.ctx.fill();

            for (var i = 0; i < _this3.circleArrAll.length; i++) {
                var currCircle = _this3.circleArrAll[i];
                //如果是同项 或者 当 mousePoint 还未赋值就跳过
                if (item === currCircle || currCircle.x === null || currCircle.y === null) continue;
                //每两个圆点之间在一定距离(this.options.lineLength)之内，绘制线
                if (utils.dis(item, currCircle) < _this3.options.lineLength) {
                    //当鼠标移入的时候，让内部的圆点跟随鼠标的移动
                    //在 距离(utils.dis2(item, currCircle) > (this.options.lineLength * this.options.lineLength) /2)内 圆点跟随鼠标的移动
                    if (currCircle === _this3.mousePoint && utils.dis2(item, currCircle) > _this3.options.lineLength * _this3.options.lineLength / 2) {
                        //圆点跟随鼠标的移动
                        _this3.moveToMousePoint(item, currCircle);
                    }
                    //绘制线
                    _this3.drawLine(item, currCircle);
                }
            }
        });
    },
    circleMove: function circleMove(item) {
        item.x += item.vx;
        item.y += item.vy;
        //圆点移动到边框的时候需要回弹
        item.vx *= item.x <= 0 || item.x >= this.canvas.width - item.r ? -1 : 1;
        item.vy *= item.y <= 0 || item.y >= this.canvas.height - item.r ? -1 : 1;
    },
    moveToMousePoint: function moveToMousePoint(item, currCircle) {
        // 小圆点的向鼠标点移动
        item.x -= (item.x - currCircle.x) * 0.03;
        item.y -= (item.y - currCircle.y) * 0.03;
    },
    drawLine: function drawLine(item, currCircle) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.2;
        this.ctx.strokeStyle = utils.lineColor(this.ctx, item, currCircle);
        this.ctx.moveTo(item.x, item.y);
        this.ctx.lineTo(currCircle.x, currCircle.y);
        this.ctx.stroke();
        this.ctx.closePath();
    },


    event: {
        touchStart: function touchStart(event) {
            console.log('mouseDown', event);
        },
        touchMove: function touchMove(event) {
            this.mousePoint.x = event.point.x;
            this.mousePoint.y = event.point.y;
        },
        touchEnd: function touchEnd(event) {
            console.log('mouseUp', event);
        }
    }
};

window.requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();
window.cancelAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.clearTimeout;

return Particle;

})));

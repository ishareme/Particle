export default {
    $(ele){
        if(document.querySelector){
            return document.querySelector(ele);
        } else {
            if (ele.indexOf('#') > -1){
                return document.getElementById(ele.replace('#',''));
            } else if (ele.indexOf('.') > -1){
                return document.getElementsByClassName(ele.replace('.',''))[0];
            } else {
                return document.getElementsByTagName(ele)[0];
            }
        }
    },
    extend(){
        let options, name, clone, copy, source, copyIsArray,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && type(target) !== 'function') {
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
    randomNumber() {
        var _len = arguments.length;
        switch (_len){
            case 1: return Math.floor(Math.random() * arguments[0]);
            case 2: return Math.floor(Math.random() * (arguments[1] - arguments[0]) + arguments[0]);
            default: return Math.floor(Math.random() * 10);
        }
    },
    randomColor() {
        return '#' + Math.random().toString(16).substring(2).substr(0,6);
    },
    dis(obj1, obj2) {
        return Math.sqrt((obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y)*(obj1.y - obj2.y));
    },
    dis2(obj1, obj2) {
        return (obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y)*(obj1.y - obj2.y);
    },
    //线颜色渐变
    lineColor(ctx, dot1, dot2) {
        var linear = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y);
        linear.addColorStop(0, dot1.color);
        linear.addColorStop(1, dot2.color);
        return linear;
    },

    isMobile(){
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    },
};

function type(object) {
    let class2type = {},
        type = class2type.toString.call(object),
        typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) {
        return object + '';
    }

    typeString.split(' ').forEach((type) => {
        class2type[`[object ${type}]`] = type.toLowerCase();
    });

    return (
        typeof object === 'object' ||
        typeof object === 'function' ?
            class2type[type] || 'object' :
            typeof object
    );
}

function isPlainObject(object) {
    let proto,
        ctor,
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
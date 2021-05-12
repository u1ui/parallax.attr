import 'https://cdn.jsdelivr.net/npm/wicked-elements@3.1.2/min.js';

const pool = new Map();
function add(el){
    let obj = new parallax(el);
    pool.set(el, obj);
    if (pool.size === 1) addGlobalListeners();
    return obj;
}
function remove(el){
    pool.delete(el);
    if (pool.size === 0) removeGlobalListeners();
}

const parallax = class {
    constructor(el){
        this.el = el;
    }
    connect(){
        this.positionChange();
        let style = getComputedStyle(this.el);
        //let direction = parseFloat(style.getPropertyValue('--u1-parallax-direction'));
        //if (isNaN(direction)) direction = 180;
        //this.angle = (direction + 90) / 180 * Math.PI;
        this.speed = parseFloat(style.getPropertyValue('--u1-parallax-speed'));
    }
    positionChange(){
        this.oRect = vpRectWithoutTransform(this.el);
        this.oRect.centerY = this.oRect.top + this.oRect.height/2;
    }
    onScroll(pageCenterY, pageCenterX){ // this has to be very fast, can it be improved?
        const centerDiff = pageCenterY - this.oRect.centerY;
        const yRoute = (this.speed-1) * -centerDiff;
        //const y = yRoute * Math.sin(this.angle);
        //const x = yRoute * Math.cos(this.angle);
        //this.el.style.setProperty('transform', 'translate3d('+x+'px,'+y+'px,0)');
        // todo, only transform if visible?
        //this.el.style.setProperty('transform', 'translate3d('+0+'px,'+yRoute+'px,0)');
        this.el.style.transform = 'translate3d('+0+'px,'+yRoute+'px,0)';
    }
};


function calcViewportRects(e){
    pool.forEach(obj => obj.positionChange());
}
function onScroll(e){
    const pageCenterY = document.scrollingElement.scrollTop + winHeight/2;
    const pageCenterX = document.scrollingElement.scrollLeft + winWidth/2;
    requestAnimationFrame(()=>{
        pool.forEach(obj => obj.onScroll(pageCenterY, pageCenterX));
    });
}

function addGlobalListeners(){
    addEventListener('resize',calcViewportRects);
    addEventListener('DOMContentLoaded',calcViewportRects);
    addEventListener('load',calcViewportRects);
    addEventListener('resize', onScroll);
    addEventListener('load', onScroll);
    document.addEventListener('scroll', onScroll);
}
function removeGlobalListeners(){
    removeEventListener('resize',calcViewportRects);
    removeEventListener('DOMContentLoaded',calcViewportRects);
    removeEventListener('load',calcViewportRects);
    removeEventListener('resize', onScroll);
    removeEventListener('load', onScroll);
    document.addEventListener('scroll', onScroll);
}

// cache innerHeight, Is that of any use?
let winHeight = innerHeight;
let winWidth = innerWidth;
addEventListener('resize',(e)=>{
    winHeight = innerHeight;
    winWidth = innerWidth;
});


/* helpers */
function vpRectWithoutTransform(el){
    let rect = {
        left  : 0,
        top   : 0,
        width : el.offsetWidth,
        height: el.offsetHeight,
    }
    do {
        rect.left += el.offsetLeft;
        rect.top  += el.offsetTop;
        el = el.offsetParent;
    } while (el);
    return rect;
}

wickedElements.define(
    '[u1-parallax]', {
        init() {
            this.parallaxObj = add(this.element);
        },
        connected() {
            this.parallaxObj.connect();
        },
        disconnected() {
            remove(this.element)
        },
    }
);

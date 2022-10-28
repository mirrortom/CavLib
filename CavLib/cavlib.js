//================================================================================//
// canvas画图工具,包含简单的直线,曲线,图标绘画等
// window上的对象"cavlib"
//=================================================================================//
// 
((win) => {
    "use strict";
    /**
     * 获取canvalib库的操作对象,包含当前操作的canvas元素属性"this.canvas",和2d对象"this.ctx",和库提供的工具方法
     * @param {string} canvasId canvasDom的id
     * @returns {any} 返回this
     */
    function canvalib(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas)
            throw new Error('canvasId not found');
        //
        this.ctx = this.canvas.getContext('2d');
        //
        return this;
    }
    /**
     * 画布元素.给canva元素设置style
     * @param {number} num 风格代码 0,1,..0(博客用的风格)
     * @returns {any} 返回this
     */
    canvalib.prototype.style = function (num = 0) {
        if (num == 0) {
            this.canvas.style.display = 'block';
            //this.canv.style.margin = 'auto';
            this.canvas.style.backgroundColor = '#f0f0f0';
        }
        return this;
    }
    //================================================================================//
    // 工厂函数factory,返回canvalib对象
    // 其它静态方法都绑定在factory上
    //================================================================================//
    let factory = (canvasId) => {
        return new canvalib(canvasId);
    };
    /**
     * 为canvalib对象添加实例方法 prototype
     * @param {any} json 一个方法名和函数值的json对像.方法名要用""号包起来.
     */
    factory.extend = (json) => {
        for (var name in json) {
            canvalib.prototype[name] = json[name];
        }
    };
// 一些帮助方法
/**
 * 检查参数个数,返回2个点的坐标.一个对象,p{ax,ay,bx,by}
 * @param {any} x1
 * @param {any} y1
 * @param {any} x2
 * @param {any} y2
 */
_checkP2 = (p1, p2, p2x, p2y) => {
    if (typeof p2x === "undefined") {
        return { ax: p1.x, ay: p1.y, bx: p2.x, by: p2.y };
    } else {
        return { ax: p1, ay: p2, bx: p2x, by: p2y };
    }
}
/**直线相关计算 */
let line = {};
/**
 * 获取两个点所在直线的斜率.如果与 X 轴平行,返回 0 ,与 Y 轴平行返回 null
 * 参数是2个包含x,y属性的对象,或者4个表示坐标的数值x1,y1,x2,y2 参数不会检查
 * @param {{x:number,y:number}} p1 点1或点1的x坐标
 * @param {{x:number,y:number}} p2 点2或点1的y坐标
 * @param {number} p2x 点2的x坐标
 * @param {number} p2y 点2的y坐标
 * @returns {number} 返回斜率(弧度)
 */
line.getK = (p1, p2, p2x, p2y) => {
    let p = _checkP2(p1, p2, p2x, p2y);
    let x = p.bx - p.ax, y = p.by - p.ay;
    // 水平线时
    if (y === 0) {
        return 0;
    }
    // 垂直线时
    if (x === 0) {
        return null;
    }
    return y / x;
};
/**
 * 获取两点间距离
 * 参数是2个包含x,y属性的对象,或者4个表示坐标的数值x1,y1,x2,y2 参数不会检查
 * @param {{x:number,y:number}} p1 点1
 * @param {{x:number,y:number}} p2 点2
 * @returns {number} 返回距离
 * */
line.dist = (p1, p2, p2x, p2y) => {
    let p = _checkP2(p1, p2, p2x, p2y);
    return Math.sqrt(Math.pow(p.ax - p.bx, 2) + Math.pow(p.ay - p.by, 2));
}
// 
factory.line = line;
/**圆相关计算 */
let cirs = {};
/**
 * 获取两个圆的切点坐标.如果相切,返回切点坐标,如果相交,返回公共弦与圆心连线交点坐标.
 * @param {{x:number,y:number,r:number}} cir1 圆1
 * @param {{x:number,y:number,r:number}} cir2 圆2
 * @returns {{x:number,y:number,istag:boolean}} istag:相切时为true,其它为false 没有切点或者交点,返回null.
 */
cirs.getTangent = (cir1, cir2) => {
    let r1 = cir1, r2 = cir2;
    // 圆心连线长度
    let m = Math.sqrt((r1.x - r2.x) * (r1.x - r2.x) + (r1.y - r2.y) * (r1.y - r2.y));
    
    // 相离 ,重叠, 相容 时,没有切点
    // 两个圆相交当且仅当两个圆心之间的距离严格小于两圆的半径之和,并严格大于两圆的半径之差
    if (m > r1.r + r2.r || m < Math.abs(r1.r - r2.r))
        return null;

    // 圆心连线与公共弦交点到r1圆心的距离,如果两个圆相切,那么这个交点就是切点
    let x = (r1.r * r1.r - r2.r * r2.r + m * m) / (2 * m);
    // 连线与公共弦交点坐标 (定比分点公式求出)
    let od = { x: 0, y: 0, istag: false }, p = x / (m - x);
    od.x = (r1.x + p * r2.x) / (1 + p);
    od.y = (r1.y + p * r2.y) / (1 + p);
    // 1位小数误差范围
    od.istag = parseFloat(m.toFixed(1)) == r1.r + r2.r || parseFloat(m.toFixed(1)) == Math.abs(r1.r - r2.r);

    return od;
};
/**
 * 获取两个圆的交点坐标
 * @param {{x:number,y:number,r:number}} cir1 圆1
 * @param {{x:number,y:number,r:number}} cir2 圆2
 * @returns {{x1:number,y1:number,x2:number,y2:number}} 没有交点返回null
 */
cirs.getCrossLine = (cir1, cir2) => {
    let r1 = cir1, r2 = cir2;
    // 圆心连线长度
    let m = Math.sqrt((r1.x - r2.x) * (r1.x - r2.x) + (r1.y - r2.y) * (r1.y - r2.y));

    // 1. 相离 ,重叠, 相容 时,没有交点(不相交)
    // 两个圆相交当且仅当两个圆心之间的距离严格小于两圆的半径之和,并严格大于两圆的半径之差
    if (m > r1.r + r2.r || m < Math.abs(r1.r - r2.r))
        return null;

    // 公式计算出的坐标值,其参照坐标系是以圆心连线为 X 轴,并且以 r1 的圆心为原点的.(r1 是圆心坐标的 x 值较小的那个圆.)
    // 所以,坐标值要经过旋转和平移变换计算,得到原坐标系中的坐标值
    // 旋转变换角度,是圆心连线斜率对应角度,如果是y轴平行线,角度为-90度. 平移变换,以 r1 圆心坐标为平移点,

    // 比较两个圆心的 X 值,以较小者为r1
    if (cir1.x > cir2.x)
        r1 = cir2, r2 = cir1;
    // 如果连线垂直, Y 值小的为r1
    if (cir1.x == cir2.x && cir1.y > cir2.y)
        r1 = cir2, r2 = cir1;

    // 圆心连线和公共弦交点到圆心1的距离
    let x = (r1.r * r1.r - r2.r * r2.r + m * m) / (2 * m);

    // 公共弦长度/2
    let y = Math.sqrt(r1.r * r1.r - x * x);

    // 交点坐标
    let x1 = x, y1 = y, x2 = x, y2 = -y;

    // 变换到原来的坐标
    let x0 = x1, y0 = y1;

    // 1.旋转
    // 圆心连线斜率
    let k = cavlib.line.getK({ x: r1.x, y: -r1.y }, { x: r2.x, y: -r2.y });
    // 对应角度
    let angle = k == null ? -Math.PI / 2 : Math.atan(k);
    // Math.cos(Math.PI / 2)的值应该为0, 但是JS的精度问题, 其值是个非常接近0的数 6.123233995736766e-17
    let cK = Math.cos(angle), sK = Math.sin(angle);
    // 
    x1 = x0 * cK + y0 * sK;
    y1 = y0 * cK - x0 * sK;
    x0 = x2, y0 = y2;
    x2 = x0 * cK + y0 * sK;
    y2 = y0 * cK - x0 * sK;
    // 2.平移
    x0 = x1, y0 = y1;
    x1 = x0 + r1.x, y1 = y0 + r1.y;
    x0 = x2, y0 = y2;
    x2 = x0 + r1.x, y2 = y0 + r1.y;
    return {
        x1: parseFloat(x1.toFixed(4)), y1: parseFloat(y1.toFixed(4))
        , x2: parseFloat(x2.toFixed(4)), y2: parseFloat(y2.toFixed(4))
    };
};
// 
factory.cirs = cirs;
// ====
// 辅助方法,比如画坐标系箭头辅助线等等.
// 实例方法
// ====
factory.extend({
    /**
     * 带箭头的线,从points的第1组坐标开始到最后一组坐标,结束时画上箭头.箭头底边与线段最后一段垂直
     * points:[p1x,p1y,p2x,p2y....],side:箭头底边,height:箭头高,fill=true(实心)false(空心)
     * @param {Array<number>} points x1,y1,x2,y2,....
     * @param {number} side 箭头底边长
     * @param {number} height 箭头高
     * @param {boolean} fill true(实心)false(空心)
     * @returns {any} return this
     */
    'lineArrow': function (points, side = 12, height = 10, fill = true) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(points[0], points[1]);
        for (var i = 2, len = points.length; i < len; i += 2) {
            this.ctx.lineTo(points[i], points[i + 1]);
        }
        this.ctx.stroke();
        // 箭头的底边与线条最后一段垂直
        let endP = { x: points[points.length - 2], y: points[points.length - 1] };
        let lastP = { x: points[points.length - 4], y: points[points.length - 3] };
        // 调整画布坐标状态到合适的位置,以使用统一的方法画箭头.(统一使用X轴正方向画箭头)
        let topAngerX = 0;
        if (endP.x == lastP.x) {
            // 垂直线情况
            this.ctx.translate(endP.x, endP.y);
            this.ctx.rotate(Math.PI / 2);
            this.ctx.beginPath();
            topAngerX = endP.y > lastP.y ? height : -height;
        } else {
            let k = (endP.y - lastP.y) / (lastP.x - endP.x);
            this.ctx.translate(endP.x, endP.y);
            this.ctx.rotate(-Math.atan(k))
            topAngerX = endP.x > lastP.x ? height : -height;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(0, -side / 2);
        this.ctx.lineTo(0, side / 2);
        this.ctx.lineTo(topAngerX, 0);
        this.ctx.closePath();
        if (fill == true) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
        this.ctx.restore();
        return this;
    }
});

factory.extend({
    /**
     * 画直角坐标轴辅助线:箭头方向:,X轴右方向,Y轴上方向
     * 
     * @param {number} style 风格: 0(原点在中心,轴长等于画布长,虚线),1(同0,实线),2或以上(自定义原点位置和轴长,偶数时虚线)
     * @param {number} oX 原点x坐标
     * @param {number} oY 原点y坐标
     * @param {number} oXLen x正轴长度
     * @param {number} oYLen y正轴长度
     * @param {number} oXLen1 x负轴长度
     * @param {number} oYLen1 y负轴长度
     * @returns {any} return this
     */
    'xyAxis': function (style = 0, oX = 0, oY = 0, oXLen = 0, oYLen = 0, oXLen1 = 0, oYLen1 = 0) {
        let x = oX, y = oY, y, xlen = oXLen, ylen = oYLen, xlen1 = oXLen1, ylen1 = oYLen1;
        if (style < 2) {
            x = this.canvas.width / 2;
            y = this.canvas.height / 2;
            xlen = x;
            ylen = y;
            xlen1 = x;
            ylen1 = y;
        }
        //
        this.ctx.save();
        this.ctx.translate(x, y);
        // 线条风格
        if (style % 2 == 0) {
            this.ctx.setLineDash([2]);
        }
        // x,y轴
        this.ctx.beginPath();
        this.lineArrow([-xlen1, 0, xlen - 10, 0]);
        this.lineArrow([0, ylen1, 0, -ylen + 10]);
        this.ctx.restore();
        return this;
    }
});

factory.extend({
    /**
     * 根据对角线上2点画出矩形
     * 
     * @param {number} x1 点x坐标
     * @param {number} y1 点y坐标
     * @param {number} x2 对角点x坐标
     * @param {number} y2 对角点y坐标
     * @param {number} style 风格: 0偶数时虚线,1实线
     * @returns {any} return this
     */
    'p2Rect': function (x1, y1, x2, y2, style = 0) {
        //
        this.ctx.save();
        // 线条风格
        if (style % 2 == 0) {
            this.ctx.setLineDash([2]);
        }
        // 水平线
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x1, y2);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
        return this;
    }
});

factory.extend({
    /**
     * 画坐标系中的一点到x/y轴的垂直和水平连线
     * 
     * @param {number} x 点x坐标
     * @param {number} y 点y坐标
     * @param {number} style 风格: 0(原点在中心,虚线),1(同0,实线) 其它:指定原点,偶数虚线奇数实线
     * @param {number} oX 原点x坐标
     * @param {number} oY 原点y坐标
     * @returns {any} return this
     */
    'pointVH': function (x, y, style = 0, oX = 0, oY = 0) {
        if (style < 2) {
            oX = this.canvas.width / 2;
            oY = this.canvas.height / 2;
        }
        //
        this.ctx.save();
        this.ctx.translate(oX, oY);
        // 线条风格
        if (style % 2 == 0) {
            this.ctx.setLineDash([2]);
        }
        // 水平线
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(0, y);
        // 垂直线
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, 0);
        this.ctx.stroke();
        this.ctx.restore();
        return this;
    }
});

factory.extend({
    /**
     * 标记一个点,用于放大显示
     * 
     * @param {number} x 点x坐标
     * @param {number} y 点y坐标
     * @param {number} style 风格: 0(圆点),1(正方形)
     * @param {number} cir 圆半径/正方形半边长
     * @param {string} color 填充颜色.(fillStyle)
     * @returns {any} return this
     */
    'pointTag': function (x, y, style = 0, cir = 3, color = 'black') {
        //
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        // 线条风格
        if (style === 0) {
            this.ctx.arc(0, 0, cir, 0, Math.PI * 2);
        } else {
            this.ctx.rect(-cir, -cir, cir * 2, cir * 2);
        }
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
        return this;
    }
});

factory.extend({
    /**
     * 用字母标记一个点
     * 
     * @param {number} x 点x坐标
     * @param {number} y 点y坐标
     * @param {string} char 字母
     * @param {number} deg 极角(0~359). 点为圆心,字母标记在圆周的一个点上.X轴正方向为0度,顺时针.
     * @param {number} cir 极径. 字母到点半径.
     * @param {string} color 字母颜色.(fillStyle)
     * @returns {any} return this
     */
    'pointChar': function (x, y, char, deg = 0, cir = 20, color = 'black') {
        //
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        //
        let degR = deg * Math.PI / 180;
        let charX = Math.cos(degR) * cir;
        let charY = Math.sin(degR) * cir;
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillText(char, charX, charY);
        this.ctx.restore();
        return this;
    }
});

// ====
// 平面图案绘画,比如画坐标系箭头辅助线等等.
// 实例方法
// ====
factory.extend({
    /**
     * 两点间连线.
     * @param {number} x1 点1的x坐标
     * @param {number} y1 点1的y坐标
     * @param {number} x2 点2的x坐标
     * @param {number} y2 点2的y坐标
     * @param {string} color 线条颜色
     * @param {number} color 线条厚度
     * @returns {any} return this
     */
    'line': function (x1, y1, x2, y2, color = 'black', lineWidth = 1) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        this.ctx.restore();
        return this;
        return this;
    }
});
// window上的引用名 "cavlib"
win.cavlib = factory;
}) (window);
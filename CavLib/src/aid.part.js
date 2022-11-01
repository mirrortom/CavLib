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
     * @param {number} oX 原点x坐标(以画布左上角为(0,0)的坐标)
     * @param {number} oY 原点y坐标
     * @param {number} oXLen x正轴长度
     * @param {number} oYLen y正轴长度
     * @param {number} oXLen1 x负轴长度
     * @param {number} oYLen1 y负轴长度
     * @returns {any} return this
     */
    'xyAxis': function (style = 0, oX = 0, oY = 0, oXLen = 0, oYLen = 0, oXLen1 = 0, oYLen1 = 0) {
        let x = oX, y = oY, y, xlen = oXLen, ylen = oYLen, xlen1 = oXLen1, ylen1 = oYLen1;
        let w = this.canvas.width, h = this.canvas.height;
        if (style < 2) {
            x = w / 2;
            y = h / 2;
        }
        if (xlen == 0)
            xlen = w - x;
        if (ylen == 0)
            ylen = y;
        if (xlen1 == 0)
            xlen1 = x;
        if (ylen1 == 0)
            ylen1 = h - y;
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
     * @param {string} color 线条颜色.(strokeStyle)
     * @returns {any} return this
     */
    'p2Rect': function (x1, y1, x2, y2, style = 0, color = 'black') {
        //
        this.ctx.save();
        // 线条风格
        if (style % 2 == 0) {
            this.ctx.setLineDash([2]);
        }
        this.ctx.strokeStyle = color;
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
     * @param {number} x 点x坐标(在以oX,oY为原点的坐标系)
     * @param {number} y 点y坐标
     * @param {number} style 风格: 0(原点在中心,虚线),1(同0,实线) 其它:指定原点,偶数虚线奇数实线
     * @param {string} color 线条颜色.(strokeStyle)
     * @param {number} oX 原点x坐标
     * @param {number} oY 原点y坐标
     * @returns {any} return this
     */
    'pointVH': function (x, y, style = 0, color = 'black', oX = 0, oY = 0) {
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
        this.ctx.strokeStyle = color;
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
     * @param {string} color 填充颜色.(fillStyle)
     * @param {number} style 风格: 0(圆点),1(正方形)
     * @param {number} cir 圆半径/正方形半边长
     * @returns {any} return this
     */
    'pointTag': function (x, y, color = 'black', style = 0, cir = 3) {
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
     * @param {string} color 字母颜色.(fillStyle)
     * @param {number} cir 极径. 字母到点半径.
     * @returns {any} return this
     */
    'pointChar': function (x, y, char, deg = 0, color = 'black', cir = 20) {
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
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
     * @param {number} lineWidth 线条厚度
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
    }
});
factory.extend({
    /**
     * 填充路径区域
     * @param {Array<Array<number>>} points 构成路径区域的坐标点数组,每个元素是含2个坐标值的数组[[x,y],[x1,y1],]
     * @param {string} color 填充颜色
     * @param {number} rule 0=nonzero(非零环绕规则,默认),1=evenodd(奇偶环绕规则)
     */
    'fillArea': function (points, color = 'black', rule = 0) {
        this.ctx.save();
        this.ctx.beginPath();
        for (var i = 0; i < points.length; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        this.ctx.fillStyle = color;
        if (rule === 0)
            this.ctx.fill();
        else
            this.ctx.fill('evenodd');
        this.ctx.restore();
        return this;
    }
});
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
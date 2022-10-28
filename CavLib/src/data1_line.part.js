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
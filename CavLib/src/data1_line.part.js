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
    let x = 0, y = 0;
    if (typeof p2x == "undefined") {
        y = p2.y - p1.y
        x = p2.x - p1.x;
    } else {
        y = p2y - p2;
        x = p2x - p1;
    }

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
    if (typeof p2x == "undefined") {
        let xd = p1.x - p2.x, yd = p1.y - p2.y;
        return Math.sqrt(xd * xd + yd * yd);
    } else {
        let xd = p1 - p2x, yd = p2 - p2y;
        return Math.sqrt(xd * xd + yd * yd);
    }
}
// 
factory.line = line;
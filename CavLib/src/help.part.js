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
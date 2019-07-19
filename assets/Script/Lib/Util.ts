
export default class Util {

    /**
     * 生成随机整数
     * @param min 最小值 包含
     * @param max 最大值 包含
     * @returns number
     */
    static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + 1 + min;
    }
}

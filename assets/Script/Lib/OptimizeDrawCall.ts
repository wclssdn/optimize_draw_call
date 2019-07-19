const { ccclass, property } = cc._decorator;

/**
 * Draw Call优化组件
 * 通过把相同类型的节点放在一起，合并draw call实现降低draw call效果
 * @author Nemo
 * @thanks mister_akai
 * @version 1.1
 * @link https://forum.cocos.com/t/draw-call/80902
 * @source https://github.com/wclssdn/optimize_draw_call/
 */
@ccclass
export default class OptimizeDC extends cc.Component {

    @property({
        displayName: '开启优化',
        tooltip: '用于对比优化效果'
    })
    enabledOptimize: boolean = true

    /**
     * 待优化节点所属根节点
     * 从此节点下获取指定路径指定名称的子节点进行优化
     */
    @property({
        type: cc.Node,
        displayName: '待优化根节点',
        tooltip: '从此节点下获取指定路径指定名称的子节点进行优化'
    })
    rootNode: cc.Node = null;

    /**
     * 待优化节点的路径，层级使用斜线分隔
     * 例如：nodeNameA/nodeNameB/nodeNameC
     */
    @property({
        type: cc.String,
        displayName: '待优化节点路径',
        tooltip: '相对于待优化根节点计算，顺序决定zIndex，索引低的在底层'
    })
    pathToNode: string[] = [];

    /**
     * 存放分层节点的节点
     * 要考虑好和优化节点的联动
     */
    @property({
        type: cc.Node,
        displayName: '分层容器',
        tooltip: '所有优化后的节点挂到此节点上'
    })
    container: cc.Node = null;

    /**
     * 分层节点的zIndex
     */
    @property({
        type: cc.Integer,
        displayName: '分层节点zIndex',
        tooltip: '如层级不对，可自行调整，一般节点层级默认为0'
    })
    containerZIndex: number = 1;

    start() {
        this.enabledOptimize && this.do()
    }

    async do() {
        await 0;
        this.pathToNode.forEach((nodePath, zIndex) => {
            this.findTarget(this.rootNode, nodePath).forEach(node => {
                let pos = this.container.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec2.ZERO))
                node.parent = this.container;
                node.position = pos
                node.zIndex = zIndex
            })
        })
        this.container.zIndex = this.containerZIndex
    }

    findTarget(rootNode: cc.Node, nodePath: string): cc.Node[] {
        if (!rootNode) {
            return []
        }
        let path = nodePath.split('/').filter(v => v.length > 0);
        let firstPath = path.shift()
        if (path.length == 0) {
            return rootNode.children.filter(v => v.name == firstPath)
        }
        let target = []
        rootNode.children.forEach(v => {
            if (v.name == firstPath) {
                target = target.concat(this.findTarget(v, path.join('/')))
            }
        })
        return target
    }
}

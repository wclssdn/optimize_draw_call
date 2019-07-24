const { ccclass, property, menu, executionOrder, help } = cc._decorator;

@ccclass("OptimizeDrawCallOptions")
export class OptimizeDrawCallOptions {

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
        tooltip: '相对于待优化根节点计算，顺序决定zIndex，索引低的在底层。例如：nodeNameA/nodeNameB/nodeNameC'
    })
    pathToNode: string[] = [];

    /**
     * 待隐藏节点的路径，层级使用斜线分隔
     * 例如：nodeNameA/nodeNameB/nodeNameC
     */
    @property({
        type: cc.String,
        displayName: '待隐藏节点路径',
        tooltip: '相对于待优化根节点计算，用于移除占用高度的空节点（子节点全部被优化的父节点）。例如：nodeNameA/nodeNameB/nodeNameC'
    })
    pathToNode4Hide: string[] = [];

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
}


/**
 * Draw Call优化组件
 * 通过把相同类型的节点放在一起，合并draw call实现降低draw call效果
 * @author Nemo
 * @thanks mister_akai
 * @version 1.2
 * @link https://forum.cocos.com/t/draw-call/80902
 * @source https://github.com/wclssdn/optimize_draw_call/
 */
@ccclass
@menu("优化组件/DrawCall")
@executionOrder(1)
@help("https://github.com/wclssdn/optimize_draw_call/")
export default class OptimizeDrawCall extends cc.Component {

    @property({
        type: OptimizeDrawCallOptions,
        displayName: '优化项',
        tooltip: '不共享同一个根节点，更灵活'
    })
    options: OptimizeDrawCallOptions[] = []

    start() {
        this.do()
    }

    /**
     * 执行优化操作
     * 当节点内容发生动态变化时，可手动调用
     */
    do() {
        this.options.forEach(option => {
            cc.log("option", option.enabledOptimize)
            if (!option.enabledOptimize){
                return 
            }
            let widget = option.rootNode.getComponent(cc.Widget)
            if (widget) {
                widget.updateAlignment()
            }
            let layout = option.rootNode.getComponent(cc.Layout)
            if (layout) {
                layout.updateLayout()
            }
            option.container.width = option.rootNode.width
            option.container.height = option.rootNode.height
            option.rootNode.on(cc.Node.EventType.SIZE_CHANGED, () => {
                option.container.width = option.rootNode.width
                option.container.height = option.rootNode.height
            })
            option.pathToNode.forEach((nodePath, zIndex) => {
                this.findTarget(option.rootNode, nodePath).forEach(node => {
                    let pos = option.container.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec2.ZERO))
                    node.parent = option.container;
                    node.position = pos
                    node.zIndex = zIndex
                })
            })
            // 子节点均被优化掉，隐藏对应节点，释放位置
            option.pathToNode4Hide.forEach(nodePath => {
                this.findTarget(option.rootNode, nodePath).forEach(node => node.active = false)
            })
            option.container.zIndex = option.containerZIndex
        })
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

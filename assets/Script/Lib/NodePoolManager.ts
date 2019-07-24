const { ccclass, property, menu } = cc._decorator;

@ccclass("NodePoolOptions")
export class NodePoolOptions {

    @property({
        type: cc.Prefab,
        displayName: 'Prefab'
    })
    prefab: cc.Prefab = undefined

    @property({
        type: cc.Integer,
        displayName: '初始化大小'
    })
    size = 1

    @property({
        displayName: 'handler组件名',
        tooltip: '挂载在Prefab上的组件，需要实现reuse、unuse方法。类需要指定类名，例如：@ccclass("className")'
    })
    handlerName: string = ''
}

/**
 * 对象池管理组件
 * @author Nemo
 * @version 1.0
 */
@ccclass
@menu("优化组件/对象池管理")
export default class NodepoolManager extends cc.Component {

    @property({
        type: NodePoolOptions,
        displayName: '对象池',
    })
    options: NodePoolOptions[] = []

    pool: { [index: string]: cc.NodePool } = {}

    onLoad() {
        this.options.forEach(option => {
            this.pool[option.prefab.name] = new cc.NodePool(option.handlerName)
            for (let i = 0; i < option.size; i++) {
                this.pool[option.prefab.name].put(cc.instantiate(option.prefab))
            }
        })
    }

    get(prefab: cc.Prefab): cc.Node {
        if (typeof this.pool[prefab.name] == "undefined") {
            cc.error("init pool without handler", prefab.name, prefab)
            this.pool[prefab.name] = new cc.NodePool()
        }
        if (this.pool[prefab.name].size() > 0) {
            return this.pool[prefab.name].get()
        }
        cc.warn("pool init", prefab.name, prefab)
        return cc.instantiate(prefab)
    }

    put(node: cc.Node) {
        this.pool[node.name].put(node)
    }

}
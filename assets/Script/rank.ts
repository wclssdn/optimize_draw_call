import OptimizeDrawCall from "./Lib/OptimizeDrawCall";
import NodepoolManager from "./Lib/NodePoolManager";
import RankItem from "../Prefab/rankItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rank extends cc.Component {

    @property(cc.Node)
    list: cc.Node = null

    @property(cc.Prefab)
    item: cc.Prefab = null

    @property(OptimizeDrawCall)
    optimizeDrawCall: OptimizeDrawCall = null

    @property(NodepoolManager)
    nodePoolManager: NodepoolManager = null

    start() {
        for (let i = 0; i < 30; ++i) {
            let item = this.nodePoolManager.get(this.item)
            item.getComponent(RankItem).init(i + 1, "Nemo_" + i, 100 - i)
            this.list.addChild(item)
        }
        // 模拟下一页数据
        setTimeout(() => {
            for (let i = 30; i < 60; ++i) {
                let item = this.nodePoolManager.get(this.item)
                item.getComponent(RankItem).init(i + 1, "Nemo_" + i, 100 - i)
                this.list.addChild(item)
            }
            this.optimizeDrawCall.do()
        }, 5000);
    }

    back() {
        cc.director.loadScene("main")
    }
}

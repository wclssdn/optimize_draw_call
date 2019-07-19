const {ccclass, property} = cc._decorator;

@ccclass
export default class FlowLine extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
    }

    unuse(){
        cc.log("unuse line", this.node.uuid, this.node)
    }

    reuse(){
        cc.log("reuse line", this.node.uuid, this.node)
    }

    // update (dt) {}
}

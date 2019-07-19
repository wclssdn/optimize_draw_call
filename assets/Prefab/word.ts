const { ccclass, property } = cc._decorator;

@ccclass
export default class Word extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    callback = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    setWord(word: string) {
        this.label.string = word
    }

    unuse(){
        cc.log("unuse word", this.node.uuid, this.node)
    }

    reuse(){
        cc.log("reuse word", this.node.uuid, this.node)
    }
    // update (dt) {}
}

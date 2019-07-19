import Util from "./Lib/Util";
import Word from "../Prefab/word";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    word: cc.Prefab = null;

    @property(cc.Prefab)
    line: cc.Prefab = null;

    start() {
        for (let i = 0; i < 30; ++i) {
            let line = cc.instantiate(this.line);
            for (let j = 0; j < 5; j++) {
                let word = cc.instantiate(this.word);
                line.addChild(word)
                line.setPosition(Util.random(-this.node.width / 2, this.node.width / 2), Util.random(-this.node.height / 2, this.node.height))
                word.setPosition(Util.random(-this.node.width / 2, this.node.width / 2), Util.random(-this.node.height / 2, this.node.height))
                word.getComponent(Word).setWord(Util.random(1, 9).toString())
                // TODO：无法消除，需要使用替换的方式，使用代理节点替换待优化节点。当有任何动作时，通知已优化节点做同样操作
                word.on(cc.Node.EventType.TOUCH_START, event => this.destroy())
            }
            this.node.addChild(line)
        }
    }

    // update (dt) {}
}

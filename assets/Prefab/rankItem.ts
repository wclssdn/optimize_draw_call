const { ccclass, property } = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {
    @property(cc.Label)
    rank: cc.Label = null;
    @property(cc.Label)
    nickname: cc.Label = null;
    @property(cc.Label)
    score: cc.Label = null;

    init(rank: number, nickname: string, score: number) {
        this.rank.string = rank.toString()
        this.nickname.string = nickname
        this.score.string = score.toString()
    }
}

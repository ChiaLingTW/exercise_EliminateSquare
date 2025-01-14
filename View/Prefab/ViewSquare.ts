import { _decorator, Component, Animation, EventMouse, Input, Label, log, Node, tween, Vec3 } from 'cc';
import GameMap from '../../GameMap';
import { View } from '../View';
import { Model } from '../../Model/Model';
const { ccclass, property } = _decorator;

@ccclass('ViewSquare')
export class ViewSquare extends Component {

    public gameView: View;
    public model: Model;

    start() {
        this.model = Model.Instance(Model);

        // 監聽滑鼠
        this.node.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.squareMove();
    }

    // 鼠標進入 square 節點
    private onMouseMove(event: EventMouse) {
        if (this.model.target == this.model.addTarget()) {
            // 依目標 target 消除 square
            let testName = this.node.getChildByName("Label").getComponent(Label).string;
            if (this.model.target.toString() == testName) {
                this.node.getComponent(Animation).play(GameMap.GAME_SQUARQ_TARGET);
                // 取消監聽滑鼠
                this.node.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

                // this.scheduleOnce(
                //     function () {
                //         this.clearOut();
                //     }, 0.2);
                // 上面一段的 schedule 可簡寫為下面這行
                this.scheduleOnce(this.clearOut, 0.2);
                // this.unschedule(this.clearOut)

                // 停止遊戲
                this.gameView.informStopGame();
            }
            return;
        }
    }

    // square 左右上下移動，每 0.5 秒 ~ 2 秒變換位置
    private squareMove() {
        let newLevel = this.model.getLevel();
        for (let i = 1; i <= newLevel; i++) {
            var randomTimer = this.model.delayTime();
            log("延遲 :: " + randomTimer);
        }

        this.scheduleOnce(
            function () {
                // 移動的時間
                let tweenDuration: number = this.model.moveTime();
                log("移動秒數 :: " + tweenDuration);
                let testReset = this.model.getTargetPosition();
                // 使用 tween 緩動系統讓 square 移動到新座標
                let t1 = tween(this.node)
                    .to(tweenDuration, { position: new Vec3(testReset.x, testReset.y, testReset.z) })
                    // callback function 
                    .call(() => { this.squareMove(); })
                    .start();
            }, randomTimer);
    }

    // 清除 square
    private clearOut() {
        // 執行 model 的 target +1
        this.model.setTarget();
        // 刷新 target 的值
        this.gameView.infomTarget();
        // 銷毀當前 square 節點
        this.node.destroy();
    }

    update(deltaTime: number) {
        // 每幀判斷 square 是否皆被消除
        //     if (this.model.getLevel() == (this.model.target - 1)) {
        //         // 停止遊戲
        //         this.gameView.gameOver.active = true;
        //         this.gameView.gameOver.getChildByName("Final").getComponent(Label).string = "Time:000";
        //         return;
        //     }
    }

}

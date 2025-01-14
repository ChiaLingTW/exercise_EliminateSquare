import { _decorator, Component, Animation, Label, log, Node, Prefab, AnimationState, instantiate, CCInteger, UITransform, v3, Input, input, EventMouse, Vec3, Vec2, tween, Button, director } from 'cc';
import GameMap from '../GameMap';
import { Model } from '../Model/Model';
import { ViewSquare } from './Prefab/ViewSquare';
import { Controller } from '../Controller/Controller';
const { ccclass, property } = _decorator;

// 依 level 生成幾個方塊，level = target
// 隨機生成方塊位置
// 指標碰到方塊消失，target +1
// 計時


@ccclass('View')
export class View extends Component {

    @property(Animation)
    public gameStartAni: Animation = null;      // ready go
    @property({ type: Node })
    public gameInfo: Node = null;               // info of game
    @property({ type: Node })
    public board: Node = null;                  // level
    @property({ type: Node })
    public gamePlaying: Node = null;            // on playing
    @property({ type: Prefab })
    public squarePrefab: Prefab = null;         // new square
    @property({ type: Node })
    public gameOver: Node = null;               // game over

    public model: Model = null;
    //public controller: Controller = null;

    start() {
        this.model = Model.Instance(Model);

        // 監聽事件
        this.gameStartAni.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    private chooseLevel(target, eventLevel) {
        log("click :: " + eventLevel);
        this.board.active = false;
        // 防呆條件
        if (eventLevel == 5 || eventLevel == 10 || eventLevel == 15) {
            this.gameStartAni.play(GameMap.GAME_READY_START);
        } else {
            log("wrong :: chooseLevel");
        }

        // 傳值 level 給 controller
        this.node.emit(GameMap.EVENT_START, eventLevel);
    }

    private onFinished(type: Animation.EventType, state: AnimationState) {
        this.node.getChildByName("PlayAni").getChildByName("ReadyGo").active = false;
        // log(state.clip.name);
        this.gameInfo.active = true;
        // 通知 controller 開始生成 square
        this.node.emit(GameMap.EVENT_PLAYING_GAME);

        // game info about level 難度
        let newLevel = this.model.getLevel();
        this.gameInfo.getChildByName("Total").getComponent(Label).string = "Total: " + newLevel.toString();
    }

    // 隨機生成 square
    public spawnSquare() {
        let newLevel = this.model.getLevel();
        for (let i = 1; i <= newLevel; i++) {
            let initPosition = this.model.getTargetPosition();
            var newSquare = instantiate(this.squarePrefab);
            this.gamePlaying.addChild(newSquare);
            newSquare.setPosition(initPosition);
            newSquare.getChildByName("Label").getComponent(Label).string = i.toString();
            newSquare.setSiblingIndex(-i);
            newSquare.getComponent(Animation).play(GameMap.GAME_SQUARE);
            // 在 viewSquare 腳本左右上下移動，0.5 秒 ~ 2 秒變換位置
            newSquare.getComponent(ViewSquare).gameView = this;         // 在 viewSquare 腳本组件上保存 Game 的引用
        }

        // game info about timer 計時
        this.schedule(this.changeTimerInfo, 1);
    }

    // 刷新 game info about timer 計時
    public changeTimerInfo() {
        let newTimer = this.model.getTimer();
        this.gameInfo.getChildByName("Time").getComponent(Label).string = "Time: " + newTimer.toString();
    }

    // 通知 controller 有個 square 消除
    public infomTarget() {
        this.node.emit(GameMap.EVENT_CLEAR_SQUARE);
    }

    // 刷新 game info about target 目標方塊
    public changeTargetInfo() {
        let newTarget = this.model.addTarget();
        this.gameInfo.getChildByName("Target").getComponent(Label).string = "Target: " + newTarget.toString();
    }

    // 通知 controller 停止遊戲
    public informStopGame() {
        this.node.emit(GameMap.EVENT_OVER);
    }

    // 停止遊戲 
    public stopPlaying() {
        this.gameInfo.active = false;
        this.gameOver.active = true;
        this.gameOver.getChildByName("Final").getComponent(Label).string = "Time: " + this.model.timer.toString();
        // 停止 timer 計時
        this.unschedule(this.changeTimerInfo);
    }

    // 通知 controller 重載遊戲
    public infomNewGame() {
        this.node.emit(GameMap.EVENT_RELOAD);
    }

}

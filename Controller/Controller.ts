import { _decorator, Component, director, find, log, Node } from 'cc';
import { View } from '../View/View';
import { Model } from '../Model/Model';
import GameMap from '../GameMap';
const { ccclass, property } = _decorator;

// 判斷得分
// 執行遊戲成功失敗
// 遊戲要重新開始，加載回最初的遊戲場景


@ccclass('Controller')
export class Controller extends Component {

    public view: View = null;
    public model: Model = null;

    start() {
        this.model = Model.Instance(Model);

        // 監聽事件、接收
        // game start event
        this.node.on(GameMap.EVENT_START, this.gameReady, this);
        // playing game
        this.node.on(GameMap.EVENT_PLAYING_GAME, this.gamePlaying, this);
        // clear a square
        this.node.on(GameMap.EVENT_CLEAR_SQUARE, this.updateTargetInfo, this);
        // game over event
        this.node.on(GameMap.EVENT_OVER, this.gameOver, this);
        // reload new game
        this.node.on(GameMap.EVENT_RELOAD, this.newGame, this);

        this.view = find("Canvas/view").getComponent(View);
        // log("test::" + this.view);
    }

    private gameReady(eventLevel) {
        this.model.setLevel(eventLevel);
        // log("controller :: Ready()");
    }

    private gamePlaying() {
        this.view.spawnSquare();
        // log("controller :: Playing()");
    }

    private updateTargetInfo() {
        this.view.changeTargetInfo();
        // log("controller :: changeTarget()");
    }

    private gameOver() {
        if (this.model.getLevel() == (this.model.addTarget())) {
            // 停止遊戲
            this.view.stopPlaying();
            return;
        }
        log("controller :: gameOver()");
    }

    private newGame() {
        // 初始化
        this.model.level = 12;
        this.model.timer = 0;
        this.model.target = 1;
        // 重新加載遊戲場景
        director.loadScene("game");
        log("controller :: newGame()");
    }

}


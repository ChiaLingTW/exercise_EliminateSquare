import { _decorator, Component, log, Node, UITransform, v3, } from 'cc';
import { View } from '../View/View';
import { Controller } from '../Controller/Controller';
const { ccclass, property } = _decorator;


@ccclass('Model')
export class Model extends Component {

    // 泛型單例
    private static instance: any = null;
    public static Instance<T>(Model: { new(): T; }): T {
        if (this.instance == null) {
            this.instance = new Model();
        }
        return this.instance;
    }

    public level: number = 12;
    public timer: number = 0;
    public target: number = 1;

    public view: View = null;
    public controller: Controller = null;

    // level of game
    public setLevel(eventLevel) {
        log("setLevel :: " + eventLevel);
        this.level = eventLevel;
    }
    public getLevel() {
        return this.level;
    }

    // 計時器
    public getTimer() {
        return this.timer += 1;
    }

    // 消除 square，tatget +1
    public setTarget() {
        this.target += 1;
    }
    public addTarget() {
        return this.target;
    }

    // 取得 square 座標 (初始座標 + 更新座標)
    public getTargetPosition() {
        // 根據 灰色背景 寬度，隨機取得 x 座標
        let randonP_X = (960) * (Math.random() - 0.5);
        // 根據 灰色背景 高度，隨機取得 y 座標
        let randonP_Y = (640) * (Math.random() - 0.5);
        // log("model_P of X :: " + randonP_X + " /// model_P of Y :: " + randonP_Y);
        // 返回 square 座標
        return v3(randonP_X, randonP_Y, 0);
    }

    // 延遲秒數
    public delayTime() {
        return Math.round(Math.random() * 10) / 10 + 1;
    }
    // 移動秒數
    public moveTime() {
        return Math.round(Math.random() * 10) / 10 + 0.5;
    }
}

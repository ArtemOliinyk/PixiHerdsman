import {Application, UPDATE_PRIORITY} from "pixi.js";
import {ApplicationOptions} from "pixi.js/lib/app/Application";
import {update} from "@tweenjs/tween.js";
import {GameField} from "./gameApp/GameField";
import {ScoresUI} from "./gameApp/ScoresUI";

const main = new class Main {
    private readonly _pixiApp: Application;
    private _appOptions: Partial<ApplicationOptions> = {
        antialias: true,
    };
    gameField: GameField;
    private _scoresCounter: ScoresUI;

    constructor() {
        this._pixiApp = new Application();
        this._pixiApp.init({...this._appOptions, height: window.innerHeight, width: window.innerWidth}).then(() => {
            this.gameReady();
            document.body.appendChild(this._pixiApp.canvas);
        });
    }

    gameReady() {
        this.gameField = new GameField(this._pixiApp.stage, this._pixiApp.screen.width, this._pixiApp.screen.height);
        this._scoresCounter = new ScoresUI(this._pixiApp.stage);

        this._pixiApp.ticker.add(() => update(this._pixiApp.ticker.lastTime), this, UPDATE_PRIORITY.HIGH);
    }

    getPixiApp() {
        return this._pixiApp;
    }
};

// @ts-ignore
window.__PIXI_DEVTOOLS__ = {
    app: main.getPixiApp(),
    // If you are not using a pixi app, you can pass the renderer and stage directly
    // renderer: main.gameApplication.getPixiApp().renderer,
    // stage: main.gameApplication.getPixiApp().stage,
};


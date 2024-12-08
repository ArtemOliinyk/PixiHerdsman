import {BaseUI} from "./Base/BaseUI";
import {Container, Graphics, Text} from "pixi.js";
import {ScoresColor} from "./GameConfig";
import {UPDATE_SCORE_EVENT} from "./GameField";

export class ScoresUI extends BaseUI {
    private _score: number = 0;
    private _textElementScore: Text;

    constructor(parentElement: Container) {
        super(parentElement);
        this.createScoreText();
        this.addListeners()
    }

    getUIElement(): Graphics {
        const uiElement = new Graphics();
        uiElement.rect(0, 0, 180, 30);
        uiElement.fill(ScoresColor);
        uiElement.label = "Scores";

        return uiElement;
    }

    createScoreText() {
        this._textElementScore = new Text({
            text: `Scores: ${this._score}`,
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: "#000000",
            }
        });
        this._uiElement.addChild(this._textElementScore);
    }

    updateScore(): void {
        this._score += 1;
        this._textElementScore.text = `Scores: ${this._score}`;
    }

    addListeners() {
        window.addEventListener(UPDATE_SCORE_EVENT, () => this.updateScore());
    }
}
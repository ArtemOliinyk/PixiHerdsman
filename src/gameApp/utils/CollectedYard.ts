import {BaseUI} from "../Base/BaseUI";
import {Container, Graphics, Point, Text} from "pixi.js";
import {YardColor} from "../GameConfig";

export type YardData = {
    width: number;
    height: number;
}

export class CollectedYard extends BaseUI<YardData> {
    private _width: number;
    private _height: number;

    constructor(parentElement: Container, width: number, height: number) {
        super(parentElement, {width, height});
    }

    storeUIData(data: YardData): void {
        this._width = data.width;
        this._height = data.height;
    }

    getUIElement(): Graphics {
        const uiElement = new Graphics();
        uiElement.rect(0, 0, this._width, this._height);
        uiElement.fill(YardColor);
        uiElement.label = "CollectedYard";

        const textLabel = new Text({
            text: "Move Here ↓",
            style: {
                fontFamily: "Arial",
                fontSize: 20,
                fill: "#000000",
            }
        });
        uiElement.addChild(textLabel);
        return uiElement;
    }

    getInitialPosition(): Point {
        return new Point(0, this._uiElement.parent.height - this._height);
    }
}
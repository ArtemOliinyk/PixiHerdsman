import {IBaseUI} from "./IBaseUI";
import {Container, Graphics, Point} from "pixi.js";

export class BaseUI<D = unknown> implements IBaseUI<Graphics, D> {
    protected _uiElement: Graphics;

    protected _parentElement: Container;

    get uiElement(): Graphics {
        return this._uiElement;
    }

    constructor(parentElement: Container, data?: D) {
        this._parentElement = parentElement;
        this.storeUIData(data);
        this.initUIElement();
    }

    storeUIData(data: D): void {
    }

    initUIElement(): void {
        this._uiElement = this.getUIElement();
        this._parentElement.addChild(this._uiElement);
        this._uiElement.position.set(this.getInitialPosition().x, this.getInitialPosition().y);
    }

    getUIElement(): Graphics {
        throw new Error("Method not implemented.");
    }

    getInitialPosition(): Point {
        return new Point(0, 0);
    }

}
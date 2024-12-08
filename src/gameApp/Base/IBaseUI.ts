import {Point} from "pixi.js";

export interface IBaseUI<T, D> {
    initUIElement(): void;
    storeUIData(data: D): void;
    getUIElement(): T;
    getInitialPosition(): Point;
}
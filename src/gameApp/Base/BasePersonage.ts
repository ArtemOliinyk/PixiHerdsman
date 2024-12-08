import {BaseUI} from "./BaseUI";
import {Easing, Tween} from "@tweenjs/tween.js";
import {Container, Graphics, Point} from "pixi.js";
import type {ColorSource} from "pixi.js/lib/color/Color";

export type PersonageData = {
    radius: number,
    color: ColorSource,
    label: string
}

export class BasePersonage extends BaseUI<PersonageData> {
    protected _radius: number;
    protected _color: ColorSource;
    protected _label: string;
    protected _moveTween: Tween<unknown>;

    protected _onUpdatePosition: () => void;

    constructor(parentElement: Container, data?: PersonageData) {
        super(parentElement, data);
        this.setVisibilityAnimation(true).then(() => {
            this.onAfterShown();
        });
    }

    initUIElement(): void {
        super.initUIElement();
        this.uiElement.alpha = 0;
    }

    storeUIData(data: PersonageData) {
        super.storeUIData(data);
        this._radius = data.radius;
        this._color = data.color;
        this._label = data.label;
    }

    getUIElement(): Graphics {
        const personage = new Graphics();
        personage.circle(0, 0, this._radius);
        personage.stroke({color: "black", width: 2});
        personage.fill(this._color);
        personage.label = this._label;

        return personage;
    }

    set onUpdatePosition(value: () => void) {
        this._onUpdatePosition = value;
    }

    moveToPoint(point: Point, time: number): Promise<void> {
        this._moveTween?.stop();
        return new Promise<void>(resolve => {
            this._moveTween = new Tween(this._uiElement)
                .to({x: point.x, y: point.y}, time)
                .onUpdate(() => {
                    if (this._onUpdatePosition) {
                        this._onUpdatePosition();
                    }
                })
                .onComplete(() => resolve())
                .easing(Easing.Quadratic.Out)
                .onStop(() => {
                    this._moveTween = null
                })
                .start()
        })
    }

    stopMoving() {
        this._moveTween?.stop();
        this._moveTween = null;
    }

    setPosition(position: Point) {
        this._uiElement.position.set(position.x, position.y);
    }

    setVisibilityAnimation(isVisible: boolean) {
        return new Promise<void>(resolve => {
            new Tween(this._uiElement)
                .to({alpha: isVisible ? 1 : 0}, 500)
                .onComplete(() => resolve())
                .start();
        });
    }

    onAfterShown() {
    }

    startIdleAnimation() {
    }
}

import {BasePersonage} from "./Base/BasePersonage";
import {Easing, Tween} from "@tweenjs/tween.js";
import {Container, Point, Text} from "pixi.js";

export class Animal extends BasePersonage {
    protected _scoreValue: number = 1;

    onAfterShown() {
        this?.startIdleAnimation()
    }

    startIdleAnimation() {
        this._moveTween = new Tween(this._uiElement.scale)
            .to({x: 1.3, y: 1.3}, 1000)
            .repeat(Infinity)
            .yoyo(true)
            .onStop(() => {
                this._uiElement.scale.set(1);
                this._moveTween?.stop();
                this._moveTween = null;
            })
            .start();
    }

    followElement(element: Container) {
        this._moveTween?.stop();
        this._moveTween = new Tween(this.uiElement.position)
            .to({}, Infinity)
            .onUpdate(() => {
                if (!this._uiElement.parent) {
                    return;
                }
                const localAnimalHolderPosition = this.uiElement.parent.toLocal(element.toGlobal(new Point(0, 0)));

                const speed = 0.1;
                this.uiElement.position.x += (localAnimalHolderPosition.x - this.uiElement.position.x) * speed;
                this.uiElement.position.y += (localAnimalHolderPosition.y - this.uiElement.position.y) * speed;

                if (this._onUpdatePosition) {
                    this._onUpdatePosition();
                }

            })
            .easing(Easing.Quadratic.Out)
            .onStop(() => {
                this.stopMoving();
            })
            .start()
    }

    boomAnimation() {
        return new Promise<void>(resolve => {
            new Tween(this._uiElement.scale)
                .to({x: 2, y: 2}, 200)
                .easing(Easing.Quartic.In)
                .onComplete(() => {
                    new Tween(this._uiElement)
                        .to({alpha: 0}, 200)
                        .onComplete(() => resolve())
                        .start()
                })
                .start();
        })
    }

    showScoreValueAfterBoom() {
        const textScore = new Text({
            text: `+${this._scoreValue}`,
            style: {
                fontFamily: "Arial",
                fontSize: 14,
                fill: "#000000",
            }
        });
        textScore.position.set(this.uiElement.position.x, this.uiElement.position.y);
        this._uiElement.parent.addChild(textScore);

        textScore.anchor.set(0.5);
        const startTweenData = {
            y: textScore.position.y,
            scale: 1,
        };

        const endTweenData = {
            y: textScore.position.y - 10,
            scale: 1.5,
        };

        return new Promise<void>(resolve => {
            new Tween(startTweenData)
                .to(endTweenData, 400)
                .onUpdate(data => {
                    textScore.position.y = data.y;
                    textScore.scale.set(data.scale);
                })
                .onComplete(() => {
                    textScore.destroy();
                    resolve();
                })
                .easing(Easing.Quadratic.Out)
                .start();
        });
    }
}
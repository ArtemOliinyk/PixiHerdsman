import {BasePersonage} from "./Base/BasePersonage";
import {Container, Point} from "pixi.js";
import {Animal} from "./Animal";
import {MaxAnimalsInHeroGroup} from "./GameConfig";

export class MainHero extends BasePersonage {
    private _maxAnimalInGroup: number = MaxAnimalsInHeroGroup;
    static AnimalHolderName: string = "animalHolder_";
    private _followedAnimals: Animal[] = [];

    onAfterShown() {
        this.initAnimalHolders();
    }

    initUIElement() {
        super.initUIElement();
        this._uiElement.zIndex = 10;
    }

    private initAnimalHolders() {
        for (let i = 0; i < this._maxAnimalInGroup; i++) {
            const animalHolder = new Container();
            animalHolder.label = MainHero.AnimalHolderName + i;
            const position = this.getPositionHolderAroundCircleById(i);
            animalHolder.position.set(position.x, position.y);
            this._uiElement.addChild(animalHolder);
        }
    }

    addAnimalToHolder(animal: Animal) {
        const animalHolder = this.getAnimalHolder(this._followedAnimals.length);
        animal.followElement(animalHolder);
        this._followedAnimals.push(animal);
    }

    getFollowedAnimals() {
        return this._followedAnimals;
    }

    removeFromFollowedAnimals(animal: Animal) {
        const index = this._followedAnimals.findIndex(followed => followed.uiElement.label === animal.uiElement.label);
        if (index !== -1) {
            this._followedAnimals.splice(index, 1);
        }
    }

    private getAnimalHolder(index: number): Container {
        return this._uiElement.getChildAt(index) as Container;
    }

    isFreePlace(): boolean {
        return this._followedAnimals.length < this._maxAnimalInGroup;
    }

    getPositionHolderAroundCircleById(id: number): Point {
        const circleRadius = this._radius + 10;
        const angle = 360 / this._maxAnimalInGroup * id;
        const angleInRadians = angle * (Math.PI / 180);
        const x = Math.cos(angleInRadians) * circleRadius;
        const y = Math.sin(angleInRadians) * circleRadius;
        return new Point(x, y);
    }

}
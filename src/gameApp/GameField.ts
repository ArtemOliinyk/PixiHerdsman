import {Container, Graphics, Point} from "pixi.js";
import {BaseUI} from "./Base/BaseUI";
import {AnimalColor, AnimalRadius, GameFieldColor, HeroColor, HeroMoving, HeroRadius, YardHeight} from "./GameConfig";
import {MainHero} from "./MainHero";
import {SpawnGenerator} from "./utils/SpawnGenerator";
import {Animal} from "./Animal";
import {CollectedYard} from "./utils/CollectedYard";

type RectangleData = {
    width: number;
    height: number;
};

export const UPDATE_SCORE_EVENT = "UPDATE_SCORE_EVENT";

export class GameField extends BaseUI<RectangleData> {
    private _width: number;
    private _height: number;
    private _hero: MainHero;
    private _animalSpawnGenerator: SpawnGenerator<Animal>;
    private _collectedYard: CollectedYard;

    constructor(parentElement: Container, width: number, height: number) {
        super(parentElement, {width, height});
        this.createHero();
        this.createCollectedYard();

        this.startSpawnGenerator();
        this.addEventListeners();
    }

    storeUIData(data: RectangleData): void {
        this._width = data.width;
        this._height = data.height;
    }

    getUIElement(): Graphics {
        const uiElement = new Graphics();
        uiElement.rect(0, 0, this._width, this._height);
        uiElement.fill(GameFieldColor);
        uiElement.label = "GameField";

        return uiElement;
    }

    createHero() {
        this._hero = new MainHero(this._uiElement, {radius: HeroRadius, label: "Hero", color: HeroColor});
        this._hero.onUpdatePosition = this.onUpdateHeroPosition.bind(this);
        const heroPosition = new Point(this._uiElement.width / 2, this._uiElement.height / 2);
        this._hero.setPosition(heroPosition);
    }

    createCollectedYard() {
        this._collectedYard = new CollectedYard(this.uiElement, this.uiElement.width, YardHeight);
    }

    addEventListeners() {
        this._uiElement.interactive = true;
        this._uiElement.on("pointerup", (event) => {
            event.stopPropagation();
            const destPoint = new Point(event.screenX, event.screenY);
            this._hero.moveToPoint(destPoint, HeroMoving);
        })
    }

    onUpdateHeroPosition() {
        const generatedAnimals = this._animalSpawnGenerator.getGeneratedItems();
        for (let i = 0; i < generatedAnimals.length; i++) {
            const animal = generatedAnimals[i];
            if (this.checkCollisionBetweenElements(this._hero, animal) && this._hero.isFreePlace()) {
                this._hero.addAnimalToHolder(animal);
                this._animalSpawnGenerator.removeItem(animal);
                return;
            }
        }
    }

    async onUpdateAnimalPosition() {
        const followedAnimals = this._hero.getFollowedAnimals();
        for (let i = 0; i < followedAnimals.length; i++) {
            const animal = followedAnimals[i];
            if (this.checkCollisionBetweenElements(animal, this._collectedYard)) {
                this._hero.removeFromFollowedAnimals(animal);
                // add timeout for better ui part
                setTimeout(() => {
                    animal.stopMoving();
                    animal.boomAnimation().then(() => {
                        animal.showScoreValueAfterBoom().then(() => {
                            animal.uiElement.destroy({children: true});
                        });
                        this.sendUpdateScoreEvent();
                    });
                }, 150);
                return;
            }
        }
    }

    startSpawnGenerator() {
        const newAnimal = (id: number) => {
            const animal = new Animal(this._uiElement, {
                color: AnimalColor,
                radius: AnimalRadius,
                label: `Animal_${id}`
            });
            animal.onUpdatePosition = this.onUpdateAnimalPosition.bind(this);
            return animal;
        };
        this._animalSpawnGenerator = new SpawnGenerator<Animal>(this._uiElement, newAnimal);
        this._animalSpawnGenerator.startGenerating();
    }

    checkCollisionBetweenElements(element1: BaseUI, element2: BaseUI) {
        const element1Bounds = element1.uiElement.getBounds();
        const element2Bounds = element2.uiElement.getBounds();

        return (
            element1Bounds.x < element2Bounds.x + element2Bounds.width
            && element1Bounds.x + element1Bounds.width > element2Bounds.x
            && element1Bounds.y < element2Bounds.y + element2Bounds.height
            && element1Bounds.y + element1Bounds.height > element2Bounds.y
        );
    }

    sendUpdateScoreEvent() {
        let scoreEvent = new CustomEvent(UPDATE_SCORE_EVENT);
        window.dispatchEvent(scoreEvent);
    }

}
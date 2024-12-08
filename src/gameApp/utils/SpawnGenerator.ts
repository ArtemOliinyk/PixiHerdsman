import {Container, Point} from "pixi.js";
import {AnimalRadius, SpawnAnimalInterval, SpawnOffsetX, SpawnOffsetYBottom, SpawnOffsetYTop} from "../GameConfig";
import {BasePersonage} from "../Base/BasePersonage";

export class SpawnGenerator<T extends BasePersonage> {
    private elementHolderToSpawnItems: Container;
    private _generatedItems: T[] = [];
    private _timerId: number;
    _countGeneratedItems: number = 0;
    private readonly createItem: (id: number) => T;

    constructor(elementHolder: Container, createItem: (id: number) => T ) {
        this.elementHolderToSpawnItems = elementHolder;
        this.createItem = createItem;
    }

    public startGenerating() {
        this._timerId = setInterval(() => {
            this.generateItem();
        }, SpawnAnimalInterval);
    }

    private generateItem() {
        this._countGeneratedItems += 1;
        const newItem = this.createItem(this._countGeneratedItems);
        this._generatedItems.push(newItem);
        this.elementHolderToSpawnItems.addChild(newItem.uiElement);
        const randomPos = new Point(
            this.getRandomInt(SpawnOffsetX, this.elementHolderToSpawnItems.width - SpawnOffsetX),
            this.getRandomInt(SpawnOffsetYTop, this.elementHolderToSpawnItems.height - SpawnOffsetYBottom - (AnimalRadius * 2)),
        );
        newItem.setPosition(randomPos);
    }

    stopGenerating() {
        clearInterval(this._timerId);
    }

    getGeneratedItems() {
        return this._generatedItems;
    }

    removeItem(removeItem: T) {
        const index: number = this._generatedItems.findIndex(item => item.uiElement.label === removeItem.uiElement.label);
        if (index !== -1) {
            this._generatedItems.splice(index, 1);
        }
    }

    private getRandomInt(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

}
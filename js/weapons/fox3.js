import { BaseMissile } from './baseMissile.js';

export class FOX3 extends BaseMissile {

    constructor(owner, target) {
        super(owner, target);

        this.speed = 750;
        this.turnRate = 0.04;
        this.type = "RADAR";
    }
}

import { BaseMissile } from './baseMissile.js';

export class FOX2 extends BaseMissile {

    constructor(owner, target) {
        super(owner, target);

        this.speed = 900;
        this.turnRate = 0.08;
        this.type = "IR";
    }
}

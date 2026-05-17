import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

export class Flare {

    constructor(position) {

        this.mesh =
            new THREE.Mesh(
                new THREE.SphereGeometry(0.5),
                new THREE.MeshBasicMaterial({ color: 0xffaa00 })
            );

        this.mesh.position.copy(position);

        this.life = 2.0;
    }

    update(delta) {

        this.life -= delta;

        this.mesh.position.y += 20 * delta;

        this.mesh.material.opacity = this.life;

        return this.life > 0;
    }
}

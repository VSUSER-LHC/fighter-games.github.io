import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

export class Explosion {

    constructor(position) {

        this.life = 1.0;

        this.mesh =
            new THREE.Mesh(

                new THREE.SphereGeometry(1, 8, 8),

                new THREE.MeshBasicMaterial({
                    color: 0xff6600,
                    transparent: true,
                    opacity: 1
                })
            );

        this.mesh.position.copy(position);
    }

    update(delta) {

        this.life -= delta * 2;

        this.mesh.scale.multiplyScalar(1.05);

        this.mesh.material.opacity = this.life;

        return this.life > 0;
    }
}

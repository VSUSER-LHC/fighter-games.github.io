import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

export class EnemyAI {

    constructor() {

        this.speed = 250;

        this.mesh = this.createEnemy();
    }

    createEnemy() {

        const mesh =
            new THREE.Mesh(

                new THREE.ConeGeometry(
                    1,
                    6,
                    4
                ),

                new THREE.MeshPhongMaterial({
                    color: 0xff3333
                })
            );

        mesh.rotation.x = Math.PI / 2;

        return mesh;
    }

    update(player, delta) {

        //////////////////////////////////////////////////
        // CHASE PLAYER
        //////////////////////////////////////////////////

        const dir =
            player.mesh.position
                .clone()
                .sub(this.mesh.position)
                .normalize();

        this.mesh.position.add(

            dir.multiplyScalar(
                this.speed * delta
            )
        );

        this.mesh.lookAt(
            player.mesh.position
        );
    }
}

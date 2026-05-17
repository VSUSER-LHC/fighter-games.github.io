import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

export class BaseMissile {

    constructor(owner, target) {

        this.owner = owner;
        this.target = target;

        this.speed = 800;
        this.turnRate = 0.05;

        this.mesh =
            new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 3),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );

        this.mesh.rotation.z = Math.PI / 2;

        this.mesh.position.copy(owner.mesh.position);

        this.velocity = new THREE.Vector3(0, 0, -1);
    }

    update(delta) {

        if (!this.target) return;

        const desired =
            this.target.mesh.position
                .clone()
                .sub(this.mesh.position)
                .normalize();

        this.velocity.lerp(desired, this.turnRate);

        this.mesh.position.add(
            this.velocity.clone().multiplyScalar(this.speed * delta)
        );

        this.mesh.lookAt(this.target.mesh.position);
    }
}

import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

export class EnemyAI {

    constructor() {

        this.speed = 220;
        this.maxSpeed = 320;

        this.mesh = this.createEnemy();

        this.state = "PATROL";

        this.evadeTimer = 0;
        this.attackCooldown = 0;
    }

    createEnemy() {

        const mesh =
            new THREE.Mesh(

                new THREE.ConeGeometry(1, 6, 4),

                new THREE.MeshPhongMaterial({
                    color: 0xff3333
                })
            );

        mesh.rotation.x = Math.PI / 2;

        return mesh;
    }

    //////////////////////////////////////////////////
    // MAIN UPDATE
    //////////////////////////////////////////////////

    update(player, missiles = [], delta) {

        const distToPlayer =
            this.mesh.position.distanceTo(
                player.mesh.position
            );

        //////////////////////////////////////////////////
        // STATE DECISION
        //////////////////////////////////////////////////

        if (distToPlayer < 1200) {
            this.state = "ATTACK";
        } else {
            this.state = "CHASE";
        }

        if (this.evadeTimer > 0) {
            this.state = "EVADE";
            this.evadeTimer -= delta;
        }

        //////////////////////////////////////////////////
        // MISSILE AVOIDANCE TRIGGER
        //////////////////////////////////////////////////

        for (const m of missiles) {

            const dist =
                this.mesh.position.distanceTo(
                    m.mesh.position
                );

            if (dist < 250) {
                this.evadeTimer = 2.0;
            }
        }

        //////////////////////////////////////////////////
        // STATE BEHAVIOR
        //////////////////////////////////////////////////

        if (this.state === "CHASE") {

            this.chase(player, delta);
        }

        if (this.state === "ATTACK") {

            this.attack(player, delta);
        }

        if (this.state === "EVADE") {

            this.evade(missiles, delta);
        }
    }

    //////////////////////////////////////////////////
    // CHASE
    //////////////////////////////////////////////////

    chase(player, delta) {

        const dir =
            player.mesh.position
                .clone()
                .sub(this.mesh.position)
                .normalize();

        this.move(dir, delta);

        this.mesh.lookAt(player.mesh.position);
    }

    //////////////////////////////////////////////////
    // ATTACK (distance control)
    //////////////////////////////////////////////////

    attack(player, delta) {

        const toPlayer =
            player.mesh.position
                .clone()
                .sub(this.mesh.position);

        const distance = toPlayer.length();

        let dir = toPlayer.normalize();

        // 距離が近すぎたら離れる
        if (distance < 600) {
            dir.multiplyScalar(-1);
        }

        // 少し横揺れ（戦闘機っぽさ）
        dir.x += (Math.random() - 0.5) * 0.3;
        dir.y += (Math.random() - 0.5) * 0.2;
        dir.z += (Math.random() - 0.5) * 0.3;

        this.move(dir, delta);

        this.mesh.lookAt(player.mesh.position);
    }

    //////////////////////////////////////////////////
    // EVADE (missile dodge)
    //////////////////////////////////////////////////

    evade(missiles, delta) {

        let avoid = new THREE.Vector3();

        for (const m of missiles) {

            const dist =
                this.mesh.position.distanceTo(
                    m.mesh.position
                );

            if (dist < 300) {

                avoid.add(
                    this.mesh.position
                        .clone()
                        .sub(m.mesh.position)
                );
            }
        }

        // 逃げ方向がない場合は横移動
        if (avoid.length() === 0) {

            avoid.set(
                (Math.random() - 0.5),
                0,
                (Math.random() - 0.5)
            );
        }

        avoid.normalize();

        this.move(avoid, delta);

        this.mesh.lookAt(
            this.mesh.position.clone().add(avoid)
        );
    }

    //////////////////////////////////////////////////
    // MOVEMENT CORE
    //////////////////////////////////////////////////

    move(dir, delta) {

        this.mesh.position.add(
            dir.multiplyScalar(this.speed * delta)
        );
    }
}

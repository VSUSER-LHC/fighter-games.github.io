import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

import { Flare } from '../effects/flares.js';

export class EnemyAI {

    constructor() {

        this.speed = 220;
        this.maxSpeed = 320;

        this.mesh = this.createEnemy();

        // 状態
        this.state = "CHASE";

        // 回避タイマー
        this.evadeTimer = 0;

        // フレア管理
        this.flares = [];
    }

    //////////////////////////////////////////////////
    // MODEL
    //////////////////////////////////////////////////

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

        //////////////////////////////////////////////////
        // MISSILE DETECTION
        //////////////////////////////////////////////////

        for (const m of missiles) {

            const dist =
                this.mesh.position.distanceTo(
                    m.mesh.position
                );

            if (dist < 300) {

                // 回避状態に入る
                this.evadeTimer = 2.0;

                this.state = "EVADE";

                // IRミサイルならフレア
                if (m.type === "IR") {

                    this.spawnFlare();
                }
            }
        }

        //////////////////////////////////////////////////
        // STATE UPDATE
        //////////////////////////////////////////////////

        if (this.evadeTimer > 0) {

            this.evadeTimer -= delta;

            this.evade(player, missiles, delta);

            return;
        }

        const distance =
            this.mesh.position.distanceTo(
                player.mesh.position
            );

        if (distance < 1200) {
            this.state = "ATTACK";
        } else {
            this.state = "CHASE";
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
    // ATTACK
    //////////////////////////////////////////////////

    attack(player, delta) {

        const toPlayer =
            player.mesh.position
                .clone()
                .sub(this.mesh.position);

        const dist = toPlayer.length();

        let dir = toPlayer.normalize();

        // 距離調整（近すぎたら離れる）
        if (dist < 600) {
            dir.multiplyScalar(-1);
        }

        // 揺れ（戦闘機っぽさ）
        dir.x += (Math.random() - 0.5) * 0.3;
        dir.y += (Math.random() - 0.5) * 0.2;
        dir.z += (Math.random() - 0.5) * 0.3;

        this.move(dir, delta);

        this.mesh.lookAt(player.mesh.position);
    }

    //////////////////////////////////////////////////
    // EVADE
    //////////////////////////////////////////////////

    evade(player, missiles, delta) {

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

        // 回避方向がない場合ランダム
        if (avoid.length() === 0) {

            avoid.set(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            );
        }

        avoid.normalize();

        this.move(avoid, delta);

        this.mesh.lookAt(
            this.mesh.position.clone().add(avoid)
        );
    }

    //////////////////////////////////////////////////
    // MOVE CORE
    //////////////////////////////////////////////////

    move(dir, delta) {

        this.mesh.position.add(
            dir.multiplyScalar(this.speed * delta)
        );
    }

    //////////////////////////////////////////////////
    // FLARE
    //////////////////////////////////////////////////

    spawnFlare() {

        const flare =
            new Flare(this.mesh.position.clone());

        this.flares.push(flare);
    }

    updateFlares(delta, scene) {

        for (let i = this.flares.length - 1; i >= 0; i--) {

            const f = this.flares[i];

            const alive = f.update(delta);

            if (!f.mesh.parent) {
                scene.add(f.mesh);
            }

            if (!alive) {

                scene.remove(f.mesh);
                this.flares.splice(i, 1);
            }
        }
    }
}

import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

import { setupScene } from './core/engine.js';

import { Player } from './entities/player.js';

import { EnemyAI } from './ai/enemyAI.js';

import { AIM120 } from './weapons/aim120.js';

import { setupHUD, drawHUD }
from './ui/hud.js';

const {
    scene,
    camera,
    renderer
} = setupScene();

//////////////////////////////////////////////////////
// PLAYER
//////////////////////////////////////////////////////

const player = new Player();

scene.add(player.mesh);

//////////////////////////////////////////////////////
// ENEMIES
//////////////////////////////////////////////////////

const enemies = [];

for(let i = 0; i < 5; i++) {

    const enemy = new EnemyAI();

    enemy.mesh.position.set(
        Math.random() * 4000 - 2000,
        Math.random() * 500,
        -3000 - Math.random() * 4000
    );

    enemies.push(enemy);

    scene.add(enemy.mesh);
}

//////////////////////////////////////////////////////
// MISSILES
//////////////////////////////////////////////////////

const missiles = [];

//////////////////////////////////////////////////////
// HUD
//////////////////////////////////////////////////////

const hud = setupHUD();

//////////////////////////////////////////////////////
// LOCK
//////////////////////////////////////////////////////

let currentTarget = null;
let lockTime = 0;
let locked = false;

//////////////////////////////////////////////////////
// INPUT
//////////////////////////////////////////////////////

const keys = {};

window.addEventListener('keydown', e => {

    keys[e.key] = true;

    if(e.key === ' ') {

        if(locked && currentTarget) {

            const missile =
                new AIM120(player, currentTarget);

            missiles.push(missile);

            scene.add(missile.mesh);
        }
    }
});

window.addEventListener('keyup', e => {

    keys[e.key] = false;
});

//////////////////////////////////////////////////////
// TARGET SEARCH
//////////////////////////////////////////////////////

function updateLock(delta) {

    currentTarget = null;

    let bestDot = 0.95;

    const forward = new THREE.Vector3(0,0,-1)
        .applyQuaternion(player.mesh.quaternion);

    for(const enemy of enemies) {

        const dir = enemy.mesh.position
            .clone()
            .sub(player.mesh.position)
            .normalize();

        const dot = forward.dot(dir);

        if(dot > bestDot) {

            bestDot = dot;

            currentTarget = enemy;
        }
    }

    if(currentTarget) {

        lockTime += delta;

        if(lockTime > 2) {

            locked = true;
        }
    }
    else {

        lockTime = 0;
        locked = false;
    }
}

//////////////////////////////////////////////////////
// LOOP
//////////////////////////////////////////////////////

let last = performance.now();

function loop(now) {

    const delta = (now - last) / 1000;

    last = now;

    //////////////////////////////////////////////////
    // PLAYER
    //////////////////////////////////////////////////

    player.update(keys, delta);

    //////////////////////////////////////////////////
    // CAMERA
    //////////////////////////////////////////////////

    camera.position.lerp(

        new THREE.Vector3(
            player.mesh.position.x,
            player.mesh.position.y + 8,
            player.mesh.position.z + 25
        ),

        0.1
    );

    camera.lookAt(player.mesh.position);

    //////////////////////////////////////////////////
    // AI
    //////////////////////////////////////////////////

    for(const enemy of enemies) {

        enemy.update(player, delta);
    }

    //////////////////////////////////////////////////
    // MISSILES
    //////////////////////////////////////////////////

    for(const missile of missiles) {

        missile.update(delta);
    }

    //////////////////////////////////////////////////
    // LOCK
    //////////////////////////////////////////////////

    updateLock(delta);

    //////////////////////////////////////////////////
    // RENDER
    //////////////////////////////////////////////////

    renderer.render(scene, camera);

    //////////////////////////////////////////////////
    // HUD
    //////////////////////////////////////////////////

    drawHUD(
        hud,
        player,
        currentTarget,
        lockTime,
        locked
    );

    requestAnimationFrame(loop);
}

loop(last);

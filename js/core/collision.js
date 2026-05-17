export function checkMissileHit(missile, target) {

    const dx = missile.mesh.position.x - target.mesh.position.x;
    const dy = missile.mesh.position.y - target.mesh.position.y;
    const dz = missile.mesh.position.z - target.mesh.position.z;

    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    return dist < 15;
}

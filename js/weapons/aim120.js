update(delta) {

    if(!this.target) return;

    const dir = this.target.mesh.position
        .clone()
        .sub(this.mesh.position)
        .normalize();

    // 超重要：追尾強さ
    this.velocity =
        this.velocity
        ? this.velocity.lerp(dir, 0.08)
        : dir;

    this.mesh.position.add(

        this.velocity.clone().multiplyScalar(
            this.speed * delta
        )
    );

    this.mesh.lookAt(
        this.target.mesh.position
    );
}

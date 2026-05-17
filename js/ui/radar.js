export class Radar {

    constructor(range = 10000) {

        this.range = range;

        this.size = 160;

        this.centerX = 120;
        this.centerY = 120;
    }

    //////////////////////////////////////////////////
    // MAIN DRAW
    //////////////////////////////////////////////////

    draw(ctx, player, enemies = [], missiles = []) {

        this.drawBase(ctx);

        this.drawEntities(ctx, player, enemies, missiles);
    }

    //////////////////////////////////////////////////
    // BASE UI
    //////////////////////////////////////////////////

    drawBase(ctx) {

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(
            this.centerX,
            this.centerY,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        // クロスライン
        ctx.beginPath();
        ctx.moveTo(this.centerX - this.size / 2, this.centerY);
        ctx.lineTo(this.centerX + this.size / 2, this.centerY);

        ctx.moveTo(this.centerX, this.centerY - this.size / 2);
        ctx.lineTo(this.centerX, this.centerY + this.size / 2);

        ctx.stroke();
    }

    //////////////////////////////////////////////////
    // ENTITIES
    //////////////////////////////////////////////////

    drawEntities(ctx, player, enemies, missiles) {

        const scale = this.size / this.range;

        //////////////////////////////////////////////////
        // ENEMIES
        //////////////////////////////////////////////////

        for (const e of enemies) {

            const rel = e.mesh.position.clone()
                .sub(player.mesh.position);

            this.drawDot(ctx, rel, scale, "red");
        }

        //////////////////////////////////////////////////
        // MISSILES
        //////////////////////////////////////////////////

        for (const m of missiles) {

            const rel = m.mesh.position.clone()
                .sub(player.mesh.position);

            // IRミサイルは黄色
            const color = m.type === "IR" ? "yellow" : "white";

            this.drawDot(ctx, rel, scale, color);
        }
    }

    //////////////////////////////////////////////////
    // DOT DRAW
    //////////////////////////////////////////////////

    drawDot(ctx, rel, scale, color) {

        // 前方基準に回転（プレイヤー向き補正）
        const angle = 0; // 今は簡易版（後でクォータニオン対応）

        const x = rel.x * scale;
        const z = rel.z * scale;

        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const ry = x * Math.sin(angle) + z * Math.cos(angle);

        const px = this.centerX + rx;
        const py = this.centerY + ry;

        // 範囲外カット
        if (Math.hypot(rx, ry) > this.size / 2) return;

        ctx.fillStyle = color;
        ctx.fillRect(px, py, 4, 4);
    }
}

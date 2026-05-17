export function setupHUD() {

    const canvas =
        document.getElementById('hud');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const ctx = canvas.getContext('2d');

    return {
        canvas,
        ctx
    };
}

export function drawHUD(
    hud,
    player,
    target,
    lockTime,
    locked
) {

    const ctx = hud.ctx;

    ctx.clearRect(
        0,
        0,
        hud.canvas.width,
        hud.canvas.height
    );

    //////////////////////////////////////////////////
    // CROSSHAIR
    //////////////////////////////////////////////////

    ctx.strokeStyle = 'lime';

    ctx.beginPath();

    ctx.moveTo(
        innerWidth/2 - 20,
        innerHeight/2
    );

    ctx.lineTo(
        innerWidth/2 + 20,
        innerHeight/2
    );

    ctx.moveTo(
        innerWidth/2,
        innerHeight/2 - 20
    );

    ctx.lineTo(
        innerWidth/2,
        innerHeight/2 + 20
    );

    ctx.stroke();

    //////////////////////////////////////////////////
    // TEXT
    //////////////////////////////////////////////////

    ctx.fillStyle = 'lime';

    ctx.font = '20px monospace';

    ctx.fillText(
        'SPD ' + player.speed,
        30,
        40
    );

    //////////////////////////////////////////////////
    // LOCK
    //////////////////////////////////////////////////

    if(target) {

        ctx.fillStyle =
            locked ? 'red' : 'yellow';

        ctx.fillText(

            locked
                ? 'LOCK'
                : 'LOCKING',

            innerWidth/2 - 40,
            innerHeight/2 - 60
        );

        //////////////////////////////////////////////////
        // LOCK BAR
        //////////////////////////////////////////////////

        ctx.strokeRect(
            innerWidth/2 - 50,
            innerHeight/2 - 90,
            100,
            10
        );

        ctx.fillRect(
            innerWidth/2 - 50,
            innerHeight/2 - 90,
            lockTime * 50,
            10
        );
    }
}

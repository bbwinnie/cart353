const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1800;
canvas.height = 1000;

let twinkles = [
    {
        name: "Twinkle A",
        x: 100,
        y: 75,
        vx: 5,
        vy: 5
    },
    {
        name: "Twinkle B",
        x: 200,
        y: 150,
        vx: 3,
        vy: 5
    },
    {
        name: "Twinkle C",
        x: 300,
        y: 150,
        vx: 3,
        vy: 7
    },
    {
        name: "Twinkle D",
        x: 400,
        y: 150,
        vx: 3,
        vy: 4
    },
    {
        name: "Twinkle E",
        x: 500,
        y: 150,
        vx: 3,
        vy: 2
    }];


function animate() {

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let twinkle of twinkles) {

        ctx.beginPath();
        ctx.arc(twinkle.x, twinkle.y, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "orange";
        ctx.fill();

        twinkle.x += twinkle.vx
        twinkle.y += twinkle.vy

        if (twinkle.x >= canvas.width - 30 || twinkle.x <= 30) {
            twinkle.vx = -twinkle.vx
        }

        if (twinkle.y >= canvas.height - 30 || twinkle.y <= 30) {
            twinkle.vy = -twinkle.vy
        }
    }

    //call requestAnimationFrame
    requestAnimationFrame(animate)

}

animate();
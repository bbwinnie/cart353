const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1800;
canvas.height = 1000;

let x = 100;
let y = 75;
let vx = 5;
let vy = 5;


function animate() {

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //update x and y
    x += vx
    y += vy

    //draw the circle again
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();

    //call requestAnimationFrame
    requestAnimationFrame(animate)

}

animate();
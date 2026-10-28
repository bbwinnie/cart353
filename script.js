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
        vy: 5,

        anxiety: 0,
        energy: 80,
        personality: "social",
        color: "orange",

        isColliding: false

    },
    {
        name: "Twinkle B",
        x: 200,
        y: 150,
        vx: 3,
        vy: 5,

        anxiety: 0,
        energy: 80,
        personality: "sensitive",
        color: "pink",

        isColliding: false
    },
    {
        name: "Twinkle C",
        x: 240,
        y: 150,
        vx: 3,
        vy: 7,

        anxiety: 0,
        energy: 80,
        personality: "independent",
        color: "blue",

        isColliding: false

    },
    {
        name: "Twinkle D",
        x: 400,
        y: 150,
        vx: 3,
        vy: 4,

        anxiety: 0,
        energy: 80,
        personality: "calm",
        color: "black",

        isColliding: false
    },
    {
        name: "Twinkle E",
        x: 500,
        y: 150,
        vx: 3,
        vy: 2,

        anxiety: 0,
        energy: 80,
        personality: "needs_space",
        color: "red",

        isColliding: false
    }];



function animate() {

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //loop through each Twinkle
    for (let twinkle of twinkles) {

        //draw each Twinkle as an circle
        ctx.beginPath();
        ctx.arc(twinkle.x, twinkle.y, 30, 0, 2 * Math.PI);
        ctx.fillStyle = twinkle.color;
        ctx.fill();

        //update the Twinkle's position
        twinkle.x += twinkle.vx;
        twinkle.y += twinkle.vy;

        //bounce off the left and right edge
        if (twinkle.x >= canvas.width - 30 || twinkle.x <= 30) {
            twinkle.vx = -twinkle.vx
        }

        //bounce off the bottom and top edge
        if (twinkle.y >= canvas.height - 30 || twinkle.y <= 30) {
            twinkle.vy = -twinkle.vy
        }

        //compare every pair of Twinkles
        for (let i = 0; i < twinkles.length; i++) {
            for (let j = i + 1; j < twinkles.length; j++) {

                //get the two Twinklew being compared
                let twinkleX = twinkles[i]
                let twinkleY = twinkles[j]

                //Calculate the horizontal and vertical distance
                let dx = twinkleX.x - twinkleY.x
                let dy = twinkleX.y - twinkleY.y

                //calculate the distance between the two Twinkles
                let distance = Math.sqrt(dx * dx + dy * dy)

                //Increase anxiety if collides depends on the different personality
                // if (distance < 60 && twinkleX.personality == "needs_space") {
                //     twinkleX.anxiety += 20;

                //     console.log(
                //         twinkleX.name,
                //         "collision!",
                //         twinkleX.anxiety
                //     );

                if (distance < 60) {


                    if (twinkleX.personality === "needs_space") {
                        twinkleX.anxiety += 20;
                        twinkleX.vx = -twinkleX.vx;
                        twinkleX.vy = -twinkleX.vy;
                    }

                    if (twinkleY.personality === "needs_space") {
                        twinkleY.anxiety += 20;
                        twinkleY.vx = -twinkleY.vx;
                        twinkleY.vy = -twinkleY.vy;
                    }

                    console.log(
                        twinkleX.name, twinkleX.anxiety,
                        "hit",
                        twinkleY.name, twinkleY.anxiety,

                    );
                }
            }
        }
    }



    //call requestAnimationFrame
    requestAnimationFrame(animate)
}

animate();
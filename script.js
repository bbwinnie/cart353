const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1800;
canvas.height = 1000;

let twinkles = [
    {
        name: "Twinkle A",
        x: 100,
        y: 75,
        vx: 2,
        vy: 3,

        anxiety: 0,
        energy: 80,
        personality: "social",
        color: "orange",
        speedMultiplier: 1
    },
    {
        name: "Twinkle B",
        x: 200,
        y: 150,
        vx: -3,
        vy: 2,

        anxiety: 0,
        energy: 80,
        personality: "sensitive",
        color: "pink",
        speedMultiplier: 1

    },
    {
        name: "Twinkle C",
        x: 240,
        y: 150,
        vx: 2,
        vy: -4,

        anxiety: 0,
        energy: 80,
        personality: "independent",
        color: "blue",
        speedMultiplier: 1

    },
    {
        name: "Twinkle D",
        x: 400,
        y: 150,
        vx: -4,
        vy: -2,

        anxiety: 0,
        energy: 80,
        personality: "calm",
        color: "black",
        speedMultiplier: 1
    },
    {
        name: "Twinkle E",
        x: 500,
        y: 150,
        vx: 3,
        vy: 3,

        anxiety: 0,
        energy: 80,
        personality: "needs_space",
        color: "red",
        speedMultiplier: 1
    }];

let activeCollisions = new Set();


function animate() {

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //loop through each Twinkle
    for (let twinkle of twinkles) {

        // Change speed based on anxiety
        if (twinkle.anxiety < 20) {
            twinkle.speedMultiplier = 1;
        } else if (twinkle.anxiety < 40) {
            twinkle.speedMultiplier = 1.4;
        } else if (twinkle.anxiety < 60) {
            twinkle.speedMultiplier = 1.8;
        } else if (twinkle.anxiety < 80) {
            twinkle.speedMultiplier = 2.2;
        } else {
            twinkle.speedMultiplier = 2.8;
        }

        //draw each Twinkle as an circle
        ctx.beginPath();
        ctx.arc(twinkle.x, twinkle.y, 30, 0, 2 * Math.PI);
        ctx.fillStyle = twinkle.color;
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";

        ctx.fillText(
            twinkle.name,
            twinkle.x + 40,
            twinkle.y
        )

        ctx.fillText(
            "Anxiety: " + twinkle.anxiety,
            twinkle.x + 40,
            twinkle.y + 25
        );

        ctx.fillText(
            "personality:" + twinkle.personality,
            twinkle.x + 40,
            twinkle.y + 50
        );

        // Update position
        twinkle.x += twinkle.vx * twinkle.speedMultiplier;
        twinkle.y += twinkle.vy * twinkle.speedMultiplier;

        // //update the Twinkle's position
        // twinkle.x += twinkle.vx;
        // twinkle.y += twinkle.vy;

        //bounce off the left and right edge
        if (twinkle.x >= canvas.width - 30 || twinkle.x <= 30) {
            twinkle.vx = -twinkle.vx
        }

        //bounce off the bottom and top edge
        if (twinkle.y >= canvas.height - 30 || twinkle.y <= 30) {
            twinkle.vy = -twinkle.vy
        }
    }

    //compare every pair of Twinkles
    for (let i = 0; i < twinkles.length; i++) {
        for (let j = i + 1; j < twinkles.length; j++) {

            //get the two Twinkles being compared
            let twinkleX = twinkles[i]
            let twinkleY = twinkles[j]

            //Calculate the horizontal and vertical distance
            let dx = twinkleX.x - twinkleY.x
            let dy = twinkleX.y - twinkleY.y

            //calculate the distance between the two Twinkles
            let distance = Math.sqrt(dx * dx + dy * dy)

            // record collision pair 
            let collisionKey = i + "-" + j;

            //if collision
            if (distance < 60) {

                // if the two characters are not in the record
                if (!activeCollisions.has(collisionKey)) {

                    // also the personality is need_space, adding anxiety level and bounce  
                    if (twinkleX.personality === "needs_space") {
                        twinkleX.anxiety += 5;
                        twinkleX.vx = -twinkleX.vx;
                        twinkleX.vy = -twinkleX.vy;

                        if (twinkleX.anxiety > 100) {
                            twinkleX.anxiety = 100;
                        }
                    }

                    if (twinkleY.personality === "needs_space") {
                        twinkleY.anxiety += 5;
                        twinkleY.vx = -twinkleY.vx;
                        twinkleY.vy = -twinkleY.vy;

                        if (twinkleY.anxiety > 100) {
                            twinkleY.anxiety = 100;
                        }
                    }

                    //adding the record
                    activeCollisions.add(collisionKey);
                }

            } else {

                // delete the record
                activeCollisions.delete(collisionKey);
            }

        }

        console.log(twinkles[4].anxiety);
    }

    //call requestAnimationFrame
    requestAnimationFrame(animate)

}


animate();
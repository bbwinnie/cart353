//get the canvas 
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//set the canvas size
canvas.width = 1800;
canvas.height = 1000;

//store the current theme information
let currentThemeData = {
    title: "Important Exam",
    text: "Tomorrow is the final exam",
}

//get the theme introduction elements
const themeIntro = document.getElementById("themeIntro");
const themeTitle = document.getElementById("themeTitle");
const themeText = document.getElementById("themeText");

//get the theme display elements
const themeDisplay = document.getElementById("themeDisplay");
const currentTheme = document.getElementById("currentTheme");

const startThemeBtn = document.getElementById("startThemeBtn");

//get the choice box elements
const choiceBox = document.getElementById("choiceBox");
const choiceboxCharacter = document.getElementById("characterName");
const choiceContainer = document.getElementById("choiceContainer");

//display the theme information
themeTitle.textContent = currentThemeData.title;
themeText.textContent = currentThemeData.text;
currentTheme.textContent = currentThemeData.title;

//hide the introduction and show the theme at play stage
startThemeBtn.addEventListener("click", function () {
    themeIntro.style.display = "none";
    themeDisplay.style.display = "block";
})

//5 Twinkle characters with different personalities and properties 
let twinkles = [
    {
        name: "Twinkle A",
        x: 100,
        y: 75,
        vx: 2,
        vy: 3,

        anxiety: 30,
        energy: 80,
        personality: "social",
        color: "orange",
        speedMultiplier: 1,
        preparation: 30,
        socialSupport: 20
    },
    {
        name: "Twinkle B",
        x: 200,
        y: 150,
        vx: -3,
        vy: 2,

        anxiety: 60,
        energy: 80,
        personality: "sensitive",
        color: "pink",
        speedMultiplier: 1,
        preparation: 30,
        socialSupport: 20

    },
    {
        name: "Twinkle C",
        x: 240,
        y: 150,
        vx: 2,
        vy: -4,

        anxiety: 40,
        energy: 80,
        personality: "independent",
        color: "blue",
        speedMultiplier: 1,
        preparation: 30,
        socialSupport: 20

    },
    {
        name: "Twinkle D",
        x: 400,
        y: 150,
        vx: -4,
        vy: -2,

        anxiety: 70,
        energy: 80,
        personality: "perfectionist",
        color: "black",
        speedMultiplier: 1,
        preparation: 30,
        socialSupport: 20
    },
    {
        name: "Twinkle E",
        x: 500,
        y: 150,
        vx: 3,
        vy: 3,

        anxiety: 20,
        energy: 80,
        personality: "needs_space",
        color: "red",
        speedMultiplier: 1,
        preparation: 30,
        socialSupport: 20
    }];

//keep track of active collisions to avoid counting the same collision every frame
let activeCollisions = new Set();

//store the Twinkle selected by the player
let selectedTwinkle = null;

//store the event data loaded from the JSON file
let eventsData = {};

//load the events and coping choices from JSON
fetch("twinkleEventsChoice.json")
    .then(response => response.json())
    .then(data => {
        eventsData = data;
        console.log(eventsData);
    })

//when the player clicks the character
canvas.addEventListener("click", function (event) {

    //get the mouse position
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    //check each twinkle to see if it was clicked
    for (let twinkle of twinkles) {
        let dx = twinkle.x - mouseX
        let dy = twinkle.y - mouseY

        let distance = Math.sqrt(dx * dx + dy * dy)

        //select the Twinkle if the mouse is close enough
        if (distance < 50) {

            //store the selected Twinkle and display itsname
            selectedTwinkle = twinkle
            choiceboxCharacter.textContent = selectedTwinkle.name

            //find the event that matches the selected Twinkle's personality
            let currentEvent = eventsData[selectedTwinkle.personality];

            //clear the previous choice buttons
            choiceContainer.innerHTML = "";

            //create a button for each coping choice
            for (let choice of currentEvent.choices) {
                let button = document.createElement("button");

                //display the choice text on the button
                button.textContent = choice.text;

                button.addEventListener("click", function () {
                    console.log("player chose:", button.textContent);
                    console.log("selected Twinkle:", selectedTwinkle.name);
                    selectedTwinkle.anxiety = Math.max(
                        0,
                        Math.min(100, selectedTwinkle.anxiety + choice.anxietyChange)
                    );
                })
                //add button
                choiceContainer.appendChild(button);


            }

            //show the choice box
            choiceBox.style.display = "block";
        }
    }
})



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
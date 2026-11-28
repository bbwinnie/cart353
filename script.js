//get the canvas 
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//set the canvas size
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

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
const choiceTitle = document.getElementById("eventTitle");
const choiceText = document.getElementById("eventText");
const choiceBox = document.getElementById("choiceBox");
const choiceboxCharacter = document.getElementById("characterName");
const choiceContainer = document.getElementById("choiceContainer");

//get the characterBar 
const characterBar = document.getElementById("characterBar");

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
        socialSupport: 20,
        currentCell: null,
        path: [],
        pathIndex: 0,
        baseSpeed: 2,
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
        socialSupport: 20,
        currentCell: null,
        path: [],
        pathIndex: 0,
        baseSpeed: 2,

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
        socialSupport: 20,
        currentCell: null,
        path: [],
        pathIndex: 0,
        baseSpeed: 2,

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
        socialSupport: 20,
        currentCell: null,
        path: [],
        pathIndex: 0,
        baseSpeed: 2,
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
        socialSupport: 20,
        currentCell: null,
        path: [],
        pathIndex: 0,
        baseSpeed: 2,
    }];

for (let twinkle of twinkles) {
    let button = document.createElement("button");
    button.textContent = twinkle.name;

    button.addEventListener("click", function () {
        openChoiceBox(twinkle);
    });

    characterBar.appendChild(button);
}

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

            openChoiceBox(twinkle);
            break;
        }
    }

})

//set random starting positions for all twinkles
function initializeTwinkles() {

    //store all possible starting cells
    let availableCells = [];

    //find all corridor cells
    for (let i = 0; i < grid.length; i++) {

        let isRoom = false;

        //check if the cell belongs to a room
        for (let room of mapRooms) {
            if (room.cells.includes(i)) {
                isRoom = true;
                break;
            }
        }

        //only use corridor cell
        if (isRoom === false) {
            availableCells.push(i);
        }
    }

    //assign a random starting cell to each twinkle
    for (let twinkle of twinkles) {

        let randomIndex = Math.floor(Math.random() * availableCells.length);

        let cellIndex = availableCells[randomIndex];

        //store the current cell index
        twinkle.currentCell = cellIndex;

        //get the center position of the cell
        let position = getCellCenter(cellIndex);

        //update the character position
        twinkle.x = position.x;
        twinkle.y = position.y;

        //remove the selected cell to avoid overlapping
        availableCells.splice(randomIndex, 1);
    }
}

//move a twinkle along its path
function moveTwinkle(twinkle) {

    //stop if there is no path or the destionation is reached
    if (twinkle.pathIndex >= twinkle.path.length) {
        return;
    }

    //get the next cell index from the path
    let targetCell = twinkle.path[twinkle.pathIndex];

    //get the center position of the target cell
    let target = getCellCenter(targetCell);

    //calculate the distanve between the Twinkle and the target
    let dx = target.x - twinkle.x;
    let dy = target.y - twinkle.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    //calculate movement speed based on anxiety
    let speed = twinkle.baseSpeed * twinkle.speedMultiplier;

    //check if the twinkle can reach the target in this frame
    if (distance <= speed) {

        //set the exact position of the target
        twinkle.x = target.x;
        twinkle.y = target.y;

        //update the current cell
        twinkle.currentCell = targetCell;

        //move to the next cell in the path
        twinkle.pathIndex++;
    } else {
        //move towards the target
        twinkle.x += (dx / distance) * speed;
        twinkle.y += (dy / distance) * speed;

    }
}

function animate() {

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx);

    // draw the rooms on top of the map
    drawRooms(ctx);

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

        //move the twinkle along its bfs path
        moveTwinkle(twinkle);

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

        // console.log(twinkles[4].anxiety);
    }

    //call requestAnimationFrame
    requestAnimationFrame(animate)

}

function openChoiceBox(twinkle) {

    //find the event that matches the personality
    let currentEvent = eventsData[twinkle.personality];

    //make sure the event data is loaded
    if (!currentEvent) {
        return;
    }

    //store the selected Twinkle and display itsname
    selectedTwinkle = twinkle;
    choiceboxCharacter.textContent = selectedTwinkle.name;

    //display the event tittle and description
    choiceTitle.textContent = currentEvent.title;
    choiceText.textContent = currentEvent.text;

    //clear the previous choice buttons
    choiceContainer.innerHTML = "";

    //create a button for each coping choice
    for (let choice of currentEvent.choices) {
        let button = document.createElement("button");

        //display the choice text on the button
        button.textContent = choice.text;

        button.addEventListener("click", function () {
            //update anxiety level 
            twinkle.anxiety = Math.max(0, Math.min(100, twinkle.anxiety + choice.anxietyChange));

            choiceBox.style.display = "none";
        });

        //add button
        choiceContainer.appendChild(button);

    }

    choiceBox.style.display = "block";

}

//initialize the character after the map is generated
if (mapSuccess === true) {

    initializeTwinkles();

    //assign a temporary path to each twinkle
    for (let twinkle of twinkles) {

        //randomly select a target room
        let randomIndex = Math.floor(Math.random() * mapRooms.length);

        let targetRoom = mapRooms[randomIndex];

        //select a cell inside the target room
        let targetCell = targetRoom.cells[0];

        //generate the shortest path
        twinkle.path = findPath(twinkle.currentCell, targetCell);

        //skip the starting cell
        twinkle.pathIndex = 1;

    }

    animate();
}

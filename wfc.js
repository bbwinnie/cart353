//set the tile size
const tileSize = 200;

//set the grid size
const cols = 9;
const rows = 5;

let tiles = [
    {
        name: "wall",
        edges: [0, 0, 0, 0]
    },
    {
        name: "horizontal",
        edges: [0, 1, 0, 1]
    },
    {
        name: "vertical",
        edges: [1, 0, 1, 0]
    },
    {
        name: "leftTopCorner",
        edges: [1, 0, 0, 1]
    },
    {
        name: "rightTopCorner",
        edges: [1, 1, 0, 0]
    },
    {
        name: "leftBottomCorner",
        edges: [0, 0, 1, 1]
    },
    {
        name: "rightBottomCorner",
        edges: [0, 1, 1, 0]
    },
    {
        name: "topDeadEnd",
        edges: [1, 0, 0, 0]
    },
    {
        name: "bottomDeadEnd",
        edges: [0, 0, 1, 0]
    },
    {
        name: "rightDeadEnd",
        edges: [0, 1, 0, 0]
    },
    {
        name: "leftDeadEnd",
        edges: [0, 0, 0, 1]
    },
    {
        name: "topT",
        edges: [1, 1, 0, 1]
    },
    {
        name: "bottomT",
        edges: [0, 1, 1, 1]
    },
    {
        name: "leftT",
        edges: [1, 0, 1, 1]
    },
    {
        name: "rightT",
        edges: [1, 1, 1, 0]
    },
    {
        name: "cross",
        edges: [1, 1, 1, 1]
    }
];

const opposite = [2, 3, 0, 1];

function canConnect(tileA, tileB, direction) {
    if (tileA.edges[direction] === tileB.edges[opposite[direction]]) {
        return true;
    } else {
        return false;
    }
}

console.log(canConnect(tiles[1], tiles[2], 1))
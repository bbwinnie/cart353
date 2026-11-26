//set the tile size
const tileSize = 200;

//set the grid size
const cols = 9;
const rows = 5;

//set the 16 different position tiles
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

//stroe all the cells in the map
let grid = []

//run all the cell 
for (let i = 0; i < cols * rows; i++) {
    //give each cell a collapsed and array
    let cell = {
        collapsed: false,
        options: []
    };

    //storage all the tiles in to cell.options
    for (let j = 0; j < tiles.length; j++) {
        cell.options.push(j)
    }

    //storge the cell into grid array
    grid.push(cell);
}

// console.log(grid[0]);
console.log(grid.length);

//store the opposite direction of each edge
//top,right,bottom,left
const opposite = [2, 3, 0, 1];

//check each tile
for (let tile of tiles) {

    //create four arrays to store matching tile indexes
    tile.neighbors = [[], [], [], []];

    //check all four direction of the current tile
    for (let direction = 0; direction < 4; direction++) {
        //console.log(tile.name, direction);

        //compare the current tile with every tile in the array
        for (let i = 0; i < tiles.length; i++) {
            if (canConnect(tile, tiles[i], direction)) {

                //storge the matching tile index in the correct direction
                tile.neighbors[direction].push(i);
            }
        }

    }
}



//check if two tiles have matching edges
function canConnect(tileA, tileB, direction) {

    //compare the current edge with the opposite edge of the other tile
    if (tileA.edges[direction] === tileB.edges[opposite[direction]]) {
        return true;
    } else {
        return false;
    }
}

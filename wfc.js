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

//find all the uncollapsed cells with the fewest possible tiles
function findMinEntropy() {

    //set the initial minimum value higher than all possible option counts
    let minOption = tiles.length + 1;

    //store the indexes of cells with the minimum number of options
    let minCells = [];

    //go through all the cells in the grid
    for (let i = 0; i < grid.length; i++) {

        //only check the cells that have not been collapsed
        if (grid[i].collapsed === false) {

            //check if the current cell has fewer options
            if (minOption > grid[i].options.length) {

                //update the minmun number of options
                minOption = grid[i].options.length

                //clear the previously stored cell indexes
                minCells = [];

                //store the current cell index
                minCells.push(i);

                //check if the current cell has the same minimum number of options
            } else if (minOption === grid[i].options.length) {

                //adding the cell index without clearing the array
                minCells.push(i);
            }
        }


    }

    // return all cell indexes with the minimum number of options
    return minCells;
}

//randomly select a cell and collapse it into one tile
function collapse() {

    //get the indexes of cells with the fewest options
    let minEntropy = findMinEntropy();

    //stop if all cells has been collapsed
    if (minEntropy.length === 0) {
        return;
    }

    //generate a random index form the minimum entropy array
    let randomIndex = Math.floor(Math.random() * minEntropy.length);

    //get the index of the selected cell
    let selectedCellIndex = minEntropy[randomIndex];

    //get the selected cell object from the grid
    let selectedCell = grid[selectedCellIndex];

    //generate a random index from the cell's available otions
    let randomTileIndex = Math.floor(Math.random() * selectedCell.options.length);

    //get the selected tile index 
    let selectedTile = selectedCell.options[randomTileIndex];

    //check if the selected cell has no available tiles
    if (selectedCell.options.length === 0) {
        console.log("Contradiction");
        return;
    }

    //mark the selected cell as collapsed
    selectedCell.collapsed = true;

    //replace all possible options with the selected tile
    selectedCell.options = [selectedTile];

    return selectedCellIndex;
}


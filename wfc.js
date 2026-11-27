//set the tile size
const tileSize = 150;

//set the grid size
const cols = 12;
const rows = 7;

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
let grid = [];

//store all rooms in the map
let mapRooms = [];

//initialize all cells in the grid
function initializeGrid() {
    //clear the previous grid 
    grid.length = 0;

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
        console.log("Contradiction at cell:", selectedCellIndex);
        console.log(selectedCell);
        return;
    }

    //mark the selected cell as collapsed
    selectedCell.collapsed = true;

    //replace all possible options with the selected tile
    selectedCell.options = [selectedTile];

    return selectedCellIndex;
}

function getNeighborIndexes(cellIndex) {
    //store the indexes of the four neighboring cells
    let neighborIndexs = [cellIndex - cols, cellIndex + 1, cellIndex + cols, cellIndex - 1];

    //top boundary
    if (cellIndex < cols) {
        neighborIndexs[0] = null;
    }

    //right boundary
    if (cellIndex % cols === cols - 1) {
        neighborIndexs[1] = null;
    }

    //bottom boundary
    if (cellIndex >= cols * (rows - 1)) {
        neighborIndexs[2] = null;
    }

    //left boundary
    if (cellIndex % cols === 0) {
        neighborIndexs[3] = null;
    }

    return neighborIndexs;
}

//propagate constraints
function propagate(cellIndex) {

    //store the cells that need to be checked
    let queue = [cellIndex]

    while (queue.length > 0) {

        //get the first cell index from the queue
        let currentIndex = queue.shift();

        //get the current cell object
        let currentCell = grid[currentIndex];

        let neighborIndexs = getNeighborIndexes(currentIndex);

        //go through all four directions
        for (let i = 0; i < neighborIndexs.length; i++) {

            //only check existing neighbors
            if (neighborIndexs[i] !== null) {

                let neighborIndex = neighborIndexs[i];
                let neighborCell = grid[neighborIndex];

                //store all allowed tile indexes
                let allowedTiles = [];

                //check all possible tilew of the current cell
                for (let currentTileIndex of currentCell.options) {
                    let currentTile = tiles[currentTileIndex];

                    //get the matching tiles in the current direction
                    let matchingTiles = currentTile.neighbors[i];

                    //combine all matching tiles
                    for (let matchingTile of matchingTiles) {

                        //avoid adding duplicate tile indexes 
                        if (!allowedTiles.includes(matchingTile)) {
                            allowedTiles.push(matchingTile);
                        }
                    }
                }

                //store the filtered options
                let newOptions = [];

                //compare the allowed tiles with the existing options
                for (let j = 0; j < allowedTiles.length; j++) {

                    for (let k = 0; k < neighborCell.options.length; k++) {

                        if (allowedTiles[j] === neighborCell.options[k]) {
                            newOptions.push(neighborCell.options[k]);
                        }
                    }
                }

                //check if the number of options has decreased
                if (newOptions.length < neighborCell.options.length) {

                    //update the available options
                    neighborCell.options = newOptions

                    //stop if there are no available tiles
                    if (newOptions.length === 0) {
                        console.log("contradiction");
                        return false;
                    }

                    //add the changed cell index to the queue
                    queue.push(neighborIndex)
                }
            }
        }
    }

    //propagation completed successfully
    return true;

}

//prevent tiles from opening outside the map
function applyBoundaryConstraints() {

    //go through all cells in the gird
    for (let i = 0; i < grid.length; i++) {

        let cell = grid[i];
        let newOptions = [];

        //check all available tiles of the current cell
        for (let tileIndex of cell.options) {
            let tile = tiles[tileIndex];


            //top boundary
            if (i < cols && tile.edges[0] === 1) {
                continue;
            }

            //right boundary
            if (i % cols === cols - 1 && tile.edges[1] === 1) {
                continue;
            }

            //bottom boundary
            if (i >= cols * (rows - 1) && tile.edges[2] === 1) {
                continue;
            }

            //left boundary
            if (i % cols === 0 && tile.edges[3] === 1) {
                continue;
            }

            // Keep the valid tile
            newOptions.push(tileIndex);

        }

        // Update the options after checking all tiles
        cell.options = newOptions;

    }
}
//Generate the entire map
function generateMap() {

    // keep generating until all cells are collapsed
    while (findMinEntropy().length > 0) {

        //call collapse and store the selected cell index
        let cellIndex = collapse();

        //stop if the collapse fails
        if (cellIndex === undefined) {
            return false;
        }

        //propagate constraints from the collapsed cell
        let success = propagate(cellIndex);

        //stop if propagteion fails
        if (success === false) {
            return false;
        }
    }

    //the map has been successfully generated
    return true;
}

//find the neighboring cells that can be reached
function getOpenNeighbors(cellIndex) {

    //get the current cell and its tile
    let cell = grid[cellIndex];
    let tileIndex = cell.options[0];
    let tile = tiles[tileIndex];

    //get the indexes of the four neighboring cells
    let neighborIndexs = getNeighborIndexes(cellIndex);

    //store all reachabel neighbors
    let openNeighbors = [];

    for (let i = 0; i < neighborIndexs.length; i++) {

        //check if the neighbor exists and the edge is open
        if (neighborIndexs[i] !== null && tile.edges[i] === 1) {

            openNeighbors.push(neighborIndexs[i]);
        }
    }

    return openNeighbors;
}

//find all cells connected to the starting cell
function getConnectedCells(startIndex) {

    //store the cells that need to be checked
    let queue = [startIndex];

    //store the cells that have already been visited
    let visited = [startIndex];

    while (queue.length > 0) {
        //get the current cell index 
        let currentIndex = queue.shift();

        //get all reachabel neighbors
        let openNeighbors = getOpenNeighbors(currentIndex);

        //check each reachable neighbor
        for (let neighborIndex of openNeighbors) {
            //only visit cells that have not been checked
            if (!visited.includes(neighborIndex)) {
                visited.push(neighborIndex);
                queue.push(neighborIndex);
            }
        }
    }

    return visited;
}

// Check if all walkable cells are connected
function checkMapConnectivity() {

    //store all walkable cell indexes
    let walkableCells = [];

    for (let i = 0; i < grid.length; i++) {
        let tileIndex = grid[i].options[0];

        let tile = tiles[tileIndex];

        //a walkable tile must have a least one open edge
        if (tile.edges.includes(1)) {
            walkableCells.push(i)
        }
    }

    //make sure there are enough cells for four rooms
    if (walkableCells.length < 4) {
        return false
    }

    //find all connected cells from the first walkable cell
    let connectedCells = getConnectedCells(walkableCells[0]);

    //check if all walkable cells can be reached
    if (connectedCells.length === walkableCells.length) {
        return true;
    } else {
        return false;
    }

}

//randomly generate four rooms
function generateRooms() {

    //clear previous rooms
    mapRooms.length = 0;

    //store the four room types
    let roomTypes = ["study", "work", "social", "rest"];

    //define four room areas
    let areas = [
        { col: 0, row: 0, width: 5, height: 3 },
        { col: 7, row: 0, width: 5, height: 3 },
        { col: 0, row: 4, width: 5, height: 3 },
        { col: 7, row: 4, width: 5, height: 3 }
    ];

    for (let area of areas) {
        //randomly select a room type
        let randomTypeIndex = Math.floor(Math.random() * roomTypes.length);

        let roomType = roomTypes[randomTypeIndex];

        //remove the slected room type
        roomTypes.splice(randomTypeIndex, 1);

        //randomly select the room direction
        let roomWidth = 3;
        let roomHeight = 2;

        if (Math.random() < 0.5) {
            roomWidth = 2;
            roomHeight = 3;
        }

        //randomly select a position inside the area
        let startCol = area.col + Math.floor(Math.random() * (area.width - roomWidth + 1));

        let startRow = area.row + Math.floor(Math.random() * (area.height - roomHeight + 1));

        let roomCells = [];

        for (let y = 0; y < roomHeight; y++) {
            for (let x = 0; x < roomWidth; x++) {
                let cellIndex = (startRow + y) * cols + (startCol + x);

                roomCells.push(cellIndex);
            }
        }

        //store the room information
        mapRooms.push({
            type: roomType,
            col: startCol,
            row: startRow,
            width: roomWidth,
            height: roomHeight,
            cells: roomCells
        })
    }


}

//apply constraints to all rooms
function applyRoomConstraints() {
    for (let room of mapRooms) {

        // store all possible entrances
        let entrances = [];

        for (let cellIndex of room.cells) {

            let neighborIndexs = getNeighborIndexes(cellIndex);

            for (let i = 0; i < neighborIndexs.length; i++) {

                let neighborIndex = neighborIndexs[i];

                //find neighbors outside the room
                if (neighborIndex !== null && !room.cells.includes(neighborIndex)) {

                    entrances.push({
                        cellIndex: cellIndex,
                        direction: i,
                        neighborIndex: neighborIndex
                    });
                }
            }
        }

        //randomly select one entrance
        let randomIndex = Math.floor(Math.random() * entrances.length);

        room.entrance = entrances[randomIndex];

        //set the edges of each room cell
        for (let cellIndex of room.cells) {

            let neighborIndexs = getNeighborIndexes(cellIndex);

            let roomEdges = [0, 0, 0, 0];

            for (let i = 0; i < neighborIndexs.length; i++) {

                //open edges inside the same room
                if (room.cells.includes(neighborIndexs[i])) {
                    roomEdges[i] = 1
                }

                //open the room entrance
                if (cellIndex === room.entrance.cellIndex && i === room.entrance.direction) {
                    roomEdges[i] = 1;

                }
            }

            //find the tile with matching edges
            let newOptions = [];

            for (let tileIndex of grid[cellIndex].options) {
                let tile = tiles[tileIndex];

                if (tile.edges[0] === roomEdges[0] && tile.edges[1] === roomEdges[1] && tile.edges[2] === roomEdges[2] && tile.edges[3] === roomEdges[3]) {
                    newOptions.push(tileIndex);
                }
            }

            //update the room cell options
            grid[cellIndex].options = newOptions;
        }

    }
}

//keep tiles with an open edeg in the required direction
function requireOpenEdge(cellIndex, direction) {
    let cell = grid[cellIndex];

    let newOptions = [];

    for (let tileIndex of cell.options) {
        let tile = tiles[tileIndex];

        if (tile.edges[direction] === 1) {
            newOptions.push(tileIndex);
        }
    }

    cell.options = newOptions;

    return newOptions.length > 0;
}

//Gnerate a connected path structure
function applyPathConstraints() {

    //store all room cell indexes
    let roomCells = [];

    //go through each room
    for (let room of mapRooms) {

        //get all cell indexes inside the current room
        for (let cellIndex of room.cells) {
            roomCells.push(cellIndex);
        }
    }

    //start from the corridor outside the first room
    let startIndex = mapRooms[0].entrance.neighborIndex;

    //store all connected corridor cells
    let visited = [startIndex];

    //calculate the number of corridor cells
    let corridorCount = grid.length - roomCells.length;

    //keep expanding the spanning tree until all corridor cells are included
    while (visited.length < corridorCount) {
        //store possible connections
        let candidates = [];

        //go through all cells already included in the spanning tree
        for (let cellIndex of visited) {

            //get the four neighboring cell indexes
            let neighborIndexs = getNeighborIndexes(cellIndex);

            //check each direction
            for (let i = 0; i < neighborIndexs.length; i++) {
                let neighborIndex = neighborIndexs[i];

                //make sure the neighbor is inside the map, does not belong to a room, and has not been visited yet
                if (neighborIndex !== null && !roomCells.includes(neighborIndex) && !visited.includes(neighborIndex)) {

                    //store the current cell
                    candidates.push({
                        cellIndex: cellIndex,
                        direction: i,
                        neighborIndex: neighborIndex
                    });
                }
            }
        }

        //stop if no connection is possible
        if (candidates.length === 0) {
            return false;
        }

        //randomly select a connection 
        let randomIndex = Math.floor(Math.random() * candidates.length);

        let connection = candidates[randomIndex];

        //require open edges on both sides
        if (!requireOpenEdge(connection.cellIndex, connection.direction) || !requireOpenEdge(connection.neighborIndex, opposite[connection.direction])) {
            return false;
        }

        //add the new corridor cell
        visited.push(connection.neighborIndex);
    }

    //connect each room entrance to the corridors
    for (let room of mapRooms) {
        if (!requireOpenEdge(room.entrance.neighborIndex, opposite[room.entrance.direction])) {
            return false;
        }
    }
    return true;
}

//generate a valid and connected map
function generateValidMap() {

    //Set the maximum number of attempts
    let maxAttempts = 200;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {

        //reset the grid
        initializeGrid();

        //generate four rooms
        generateRooms();

        //apply boundary and room constraints 
        applyBoundaryConstraints();
        applyRoomConstraints();

        //generate the spanning tree
        if (applyPathConstraints() === false) {
            continue;
        }

        //generate a new map
        let success = generateMap();

        //only check connectivity if wfc generation is successful
        if (success === true) {

            //find all reachable cells starting from the first room
            let connectedCells = getConnectedCells(mapRooms[0].cells[0]);

            //check if all grid cells are reachable and the entire map is connected
            if (connectedCells.length === grid.length && checkMapConnectivity() === true) {

                //display the successful generation result
                console.log("valid map generated")
                console.log("attempts:", attempt + 1);

                return true;
            }
        }
    }

    //stop if no valid map can be generated
    console.log("failed to generate a valid map");
    return false;

}

//draw the generated map
function drawMap(ctx) {

    //stop if the map generation failed
    if (mapSuccess === false) {
        return;
    }

    //draw the map background
    ctx.fillStyle = "#41454e";
    ctx.fillRect(0, 0, cols * tileSize, rows * tileSize);

    //set the width of the corridros
    let roadWidth = tileSize * 0.6;

    //calculate the space on each side of the road
    let offset = (tileSize - roadWidth) / 2

    //go through all cells in the grds
    for (let i = 0; i < grid.length; i++) {

        //get the position of the current cell
        let x = (i % cols) * tileSize;
        let y = Math.floor(i / cols) * tileSize;

        //get the selected tile
        let tileIndex = grid[i].options[0];
        let tile = tiles[tileIndex];

        //skip wall tiles
        if (tileIndex === 0) {
            continue;
        }

        //set the road color
        ctx.fillStyle = "#e5dfd0";

        //draw the center of the road
        ctx.fillRect(
            x + offset,
            y + offset,
            roadWidth,
            roadWidth
        );

        // Draw the top connection
        if (tile.edges[0] === 1) {
            ctx.fillRect(x + offset, y, roadWidth, offset);
        }

        // Draw the right connection
        if (tile.edges[1] === 1) {
            ctx.fillRect(x + offset + roadWidth, y + offset, offset, roadWidth);
        }

        // Draw the bottom connection
        if (tile.edges[2] === 1) {
            ctx.fillRect(x + offset, y + offset + roadWidth, roadWidth, offset);
        }

        // Draw the left connection
        if (tile.edges[3] === 1) {
            ctx.fillRect(x, y + offset, offset, roadWidth);
        }

    }
}

let mapSuccess = generateValidMap();

console.log("Map success:", mapSuccess);

if (mapSuccess === true) {

    console.table(mapRooms);

    let connectedCells = getConnectedCells(mapRooms[0].cells[0]);

    console.log("Connected cells:", connectedCells.length);

    console.log("Total cells:", grid.length);
}
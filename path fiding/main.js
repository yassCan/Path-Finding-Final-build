// <!>
// TODO: make sure that the path don't go back towads the "start"
// by calculating the distance btween the current node and the start, and make sure that that distance
// is incrementing
// <!>

// BOARD_HEIGHT OR WIDTH: number of cells 

const cells = [...document.querySelectorAll(".cell")];
let AlgorithmType = "ASTAR";

const cellsTable = cells2Darray();
let cellsClass = cells.map(x => new Cell(x));
let cellsClassTable = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH));
cellsClass.forEach(cell => {
    cellsClassTable[cell.y][cell.x] = cell;
});
const cellMap = new Map(cellsClass.map(cell => [cell.element, cell]));
let timeBeetweenAnimationFrames = 1500;
let count = 0;
let [start, end] = [document.querySelector(".START"), document.querySelector(".END")];
let [startNodeClass] = cellsClass.filter(cellClass => cellClass.element.classList.contains("START"));
let loop = false
const d = new Dweller();

// debug()
// cellsTable[1][1].classList.add("START");
// cellsTable[BOARD_HEIGHT-1][BOARD_WIDTH-1].classList.add("END");
function maze() {
    clearBoard();
    for(let i = 0;i < cellsTable.length;i++) {
        for(let j = 0;j < cellsTable[i].length;j++) {
            if(j % 2 === 0 || i % 2 === 0) {
                cellsTable[i][j].classList.add("obstacle")
            } else {
                cellsTable[i][j].classList.remove("obstacle")
            }
        }
    }
    // b.begin with a cell that is not on the border, otherwise it will be stuck in an infinite loop]

    d.begin(cellsClassTable[5][7])
}

// logic for dragging elements and events
setEventListener();

function setObstacles() {
   cells.forEach(c => {
        c.classList.remove("obstacle")
        c.classList.remove("searchCell")
        c.classList.remove("path")
        c.classList.remove("validCell")
    })
    cells.forEach(c => {
        if(Math.random()*100 < 20) {
            if(c.classList.contains("START") || c.classList.contains("END")) return
            c.classList.add("obstacle")
        }
    })
}

function changeAlgorithm(){
    // select the element with the id "algorithm-name" and change its text to the current algorithm
    clearPath();
    document.getElementById("algorithm-name").textContent = AlgorithmType === "ASTAR" ? "DIJKSTRA" : "ASTAR";
    AlgorithmType = AlgorithmType === "ASTAR" ? "DIJKSTRA" : "ASTAR";
    queueAStarUpdate();
}

function clearBoard() {
    cells.forEach(c => {
        c.classList.remove("obstacle")
        c.classList.remove("searchCell")
        c.classList.remove("path-astar")
        c.classList.remove("path-dijkstra")
        c.classList.remove("validCell")
    })
    cellsClass.forEach(c => {
        c.isVisited = false;
        c.g = undefined;
        c.h = dist(c.element, document.querySelector(".START"));
        c.f = undefined;
        c.previous = null;
    })
}
// function that clears the path and the search, but not the obstacles
function clearPath() {
    cells.forEach(c => {
        c.classList.remove("searchCell")
        c.classList.remove(`path-${AlgorithmType.toLowerCase()}`)
        c.classList.remove("validCell")
    }
    )
    cellsClass.forEach(c => {
        c.isVisited = false;
        c.g = undefined;
        c.f = undefined;
        c.previous = null;
    })
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

// return a grid of cells, 2d array of the cells( divs )
function cells2Darray() {
    const arr = [[]];
    let count = 0;
    for(let i = 0;i < cells.length;i++) {
        if(( i + 1 ) % BOARD_WIDTH !== 0) {
            arr[count].push(cells[i]);
            continue;
        } 
        arr.push([]);
        arr[count].push(cells[i]);
        count++;
    }
    arr.pop();
    return arr;
}

function getPos(element) {
    let y = 0;
    for(let x = 0;x < cells.length;x++) {
        if(x % BOARD_WIDTH === 0 && x !== 0) y++;
        if(cells[x] !== element) continue;
        let widths = Math.floor(x / BOARD_WIDTH);
        x -= BOARD_WIDTH * widths;
        return [x, y];
    }    
    // if the element is not found
    return [0, 0];
}






function dist(a, b) {
    const aElem = a?.element ?? a;
    const bElem = b?.element ?? b;
    const [aX, aY] = getPos(aElem);
    const [bX, bY] = getPos(bElem);
    // return Math.abs(aX - bX) + Math.abs(aY - bY);
    if(AlgorithmType === "ASTAR") {
        return Math.abs(aX - bX) + Math.abs(aY - bY);
    } 
    return 0
}



function removeFromArray(arr, elm) {
    for(let i = arr.length -1; i >= 0;i--) {
        if(arr[i] === elm) arr.splice(i, 1)
    }
}
function neighborsOf(elm) {
    const key = elm?.element ?? elm;
    const c = cellMap.get(key);
    if (!c) {
        console.warn("neighborsOf: cell not found for element", elm);
        return [];
    }
    return c.neighboors();
}

async function reconstructPath(cameFrom, current) {
    const path = [];
    while(current && !current.element.classList.contains("START")) {
        if(!current.element.classList.contains("END")) {
            path.push(current);
        }
        current = cameFrom.get(current);
    }
    path.reverse().forEach(cell => {
        cell.element.classList.add(`path-${AlgorithmType.toLowerCase()}`);
    });
}

function AStar() {
    const startCell = cellMap.get(start);
    const endCell = cellMap.get(end);
    if (!startCell || !endCell) {
        console.warn("AStar: start or end cell is missing");
        return;
    }

    const openSet = [startCell];
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map([[startCell, 0]]);
    const fScore = new Map([[startCell, dist(startCell, endCell)]]);

    while(openSet.length !== 0) {
        let currentIndex = 0;
        for(let i = 1; i < openSet.length; i++) {
            if((fScore.get(openSet[i]) ?? Infinity) < (fScore.get(openSet[currentIndex]) ?? Infinity)) {
                currentIndex = i;
            }
        }
        const current = openSet[currentIndex];
        // current.element.classList.add("searchCell");
        if(current === endCell) {
            reconstructPath(cameFrom, current);
            return;
        }
        removeFromArray(openSet, current);
        closedSet.add(current);

        for(const neighbor of neighborsOf(current)) {
            if(closedSet.has(neighbor)) continue;

            const tentativeG = (gScore.get(current) ?? Infinity) + 1;
            if(openSet.includes(neighbor) && tentativeG >= (gScore.get(neighbor) ?? Infinity)) {
                continue;
            }
            // paint the searched cells with cyan
        
            cameFrom.set(neighbor, current);
            gScore.set(neighbor, tentativeG);
            fScore.set(neighbor, tentativeG + dist(neighbor, endCell));

            if(!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            }
        }
    }
}

 
window.addEventListener("keydown", ({ keyCode }) => (keyCode !== 13) ? "" : startSearch())

function startSearch() {
    if(loop) {
        setObstacles()
        count=0
    } 
    cells.forEach(c => {
        c.classList.remove("searchCell")
        c.classList.remove(`path-${AlgorithmType.toLowerCase()}`)
        c.classList.remove("validCell")
    })
    AStar()
}


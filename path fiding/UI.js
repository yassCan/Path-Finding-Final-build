const board = document.querySelector(".board");
let showBorders = true;
let dragAStarFrameId = null;
let diagonalMovement = false;
let slowDweller = false;
let isDragging = false


// board width:  1000px &&
// board height: 1000px to work with
// clientWidth: board width: 1000
// clientHeight: board height: 1000

// add a input slider to control width and height of the board, and update the board accordingly

let BOARD_HEIGHT = 30 // number of cells
let BOARD_WIDTH = 30 // number of cells
let CELL_HEIGHT = board.clientHeight / BOARD_HEIGHT
let CELL_WIDTH = board.clientWidth / BOARD_WIDTH
// n: total number of cells
 

let n = BOARD_HEIGHT * BOARD_WIDTH

for(let i = 0;i < n;i++) {
    // c: cell element
    let c = document.createElement("div")
    c.classList.add("cell")
    board.append(c)
}

board.style["grid-template-columns"] = `repeat(${BOARD_WIDTH}, ${CELL_WIDTH}px)`
board.style["grid-template-rows"] = `repeat(${BOARD_HEIGHT}, ${CELL_HEIGHT}px)`;



board.children[BOARD_WIDTH+1].classList.add("START");
board.children[BOARD_WIDTH*(BOARD_HEIGHT-1)+BOARD_WIDTH-1].classList.add("END");

[...document.querySelectorAll(".cell")].forEach(cell => {
    cell.style.border = "none"
    let dot = document.createElement("div");
    dot.classList.add("dot");
    cell.append(dot)
})

function queueAStarUpdate() {
    if (dragAStarFrameId !== null) {
        cancelAnimationFrame(dragAStarFrameId);
    }
    dragAStarFrameId = requestAnimationFrame(() => {
        dragAStarFrameId = null;
        startSearch();
    });
}

function setEventListener() {   

    for(const cell of cells) {
        cell.draggable = true;
        if(cell === start || cell === end) continue;
        cell.ondrag =  _ => {
            _.preventDefault();
            isDragging = true;
            for(const _cell of cells) {
                _cell.ondragover = ({ target }) => {
                    if(target.classList.contains("obstacle")) {
                        target.classList.remove("obstacle")
                    } if(target.classList.contains('path-astar') || target.classList.contains('path-dijkstra')) {
                        queueAStarUpdate()
                        target.classList.add("obstacle");

                    } else {
                        target.classList.add("obstacle");
                    } 
                    _cell.ondragover = null;
                }
            }
            cell.ondrag = null;
        }

        cell.onclick = ({ target }) => {
            if(target.classList.contains("obstacle")) {
                target.classList.remove("obstacle")
                queueAStarUpdate()

            } else {
                if(target.classList.contains('path-astar') || target.classList.contains('path-dijkstra')) {
                    queueAStarUpdate()
                }
                target.classList.add("obstacle")
            }
        }
        cell.ondragend = _ => clearCellsEvent(false);
    }

    start.addEventListener("dragstart", (e) => {
        clearCellsEvent(false);
        isDragging = true;
        cells.forEach(cell => {
            if(cell.classList.contains("END") || cell.classList.contains("obstacle")) return;
            cell.ondragover = (evt) => {
                const {target} = evt;
                evt.preventDefault();
                // s for start the lime cell
                let s = document.querySelector(".START");
                s.classList.remove("START");
                target.classList.add("START");
                start.draggable = false;
                start = target;
                start.draggable = true;
                queueAStarUpdate();
            };
        });

    });
    
    end.addEventListener("dragstart", _ => {
        clearCellsEvent(false);
        isDragging = true;
        cells.forEach(cell => {
            if(cell.classList.contains("START") || cell.classList.contains("obstacle")) return;
            cell.ondragover = (evt) => {
                const {target} = evt;
                evt.preventDefault();
                // e for end the red cell
                let e = document.querySelector(".END");
                e.classList.remove("END");
                target.classList.add("END");
                end.draggable = false;
                end = target;
                end.draggable = true;
                queueAStarUpdate();
            };
        });
    });

    
    start.addEventListener("dragend", clearCellsEvent);
    end.addEventListener("dragend", clearCellsEvent);
}


function clearCellsEvent(startAgain=true) {
    isDragging = false;
    cells.forEach(c => {
        c.ondragover = null;
        c.ondrag = null;
    });
    if(startAgain) startSearch();
    setEventListener();
    // startSearch()

}


function debug() {
    showBorders = !showBorders;
    if(showBorders) {
        [...document.querySelectorAll(".cell")].forEach(cell => {
            cell.style.border = "none"
            // let dot = document.createElement("div");
            // dot.classList.add("dot");
            // cell.append(dot)
            cell.childNodes[0].style.visibility = "visible"
        })
        return;
    }


    [...document.querySelectorAll(".cell")].forEach(cell => {
        cell.style.border = "1px solid black"
        cell.childNodes[0].style.visibility = "hidden"
    })
}

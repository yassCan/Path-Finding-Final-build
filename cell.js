class Cell {
    constructor(element) {
        this.x = getPos(element)[0];
        this.y = getPos(element)[1];
        this.element = element;
        this.g = undefined
        this.h = dist(this.element, document.querySelector(".START"))
        this.f;
        this.previous = null;
        this.isVisited = false;
    }

    isConnectedTo(node, diagonal = false) {
        return this.neighboors(diagonal).includes(node);
    }

    neighboors(diagonal = false) {

        let n = []
        let x = this.x;
        let y = this.y
        if(y > 0 && !cellsTable[y-1][x].classList.contains("obstacle")) {
            n.push(cellsClassTable[y-1][x])
        }
        if(x > 0 && !cellsTable[y][x-1].classList.contains("obstacle")) {
            n.push(cellsClassTable[y][x-1])
        }
        if(x < BOARD_WIDTH-1 && !cellsTable[y][x+1].classList.contains("obstacle")) {
            n.push(cellsClassTable[y][x+1])
        }
        if(y < BOARD_HEIGHT-1 && !cellsTable[y+1][x].classList.contains("obstacle")) {
            try {
                n.push(cellsClassTable[y+1][x])
            } catch(e) {
                console.log(y);
            }
        }
        if (diagonal) {
            if(y > 0 && x > 0 && !cellsTable[y-1][x-1].classList.contains("obstacle")) {
                n.push(cellsClassTable[y-1][x-1])
            }
            if(y > 0 && x < BOARD_WIDTH-1 && !cellsTable[y-1][x+1].classList.contains("obstacle")) {
                n.push(cellsClassTable[y-1][x+1])
            }
            if(y < BOARD_HEIGHT-1 && x > 0 && !cellsTable[y+1][x-1].classList.contains("obstacle")) {
                n.push(cellsClassTable[y+1][x-1])
            }
            if(y < BOARD_HEIGHT-1 && x < BOARD_WIDTH-1 && !cellsTable[y+1][x+1].classList.contains("obstacle")) {
                n.push(cellsClassTable[y+1][x+1])
            }
        }
        
        return n
    }

    distantNeighbors() {
        // returns neighbors 2 units away, like jumping over a wall
        let n = []
        let x = this.x;
        let y = this.y
        if(y-2 >= 0) {
            n.push(cellsClassTable[y-2][x])
        }
        if(x-2 >= 0) {
            n.push(cellsClassTable[y][x-2])
        }
        if(x < BOARD_WIDTH-2) {
            n.push(cellsClassTable[y][x+2])
        }

        if(y < BOARD_HEIGHT-2) {
            n.push(cellsClassTable[y+2][x])
        }
        
        return n
    }
 

}
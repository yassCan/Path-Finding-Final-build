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


class Dweller {
    constructor() {
        this.memory = [] 
    }

    begin(startCell) {
        
        startCell.isVisited = true;
        
        const unvisited = startCell.distantNeighbors().filter(n => !n.isVisited);
        
        if (unvisited.length > 0) {
            this.memory.push(startCell);
            const next = unvisited[Math.floor(Math.random() * unvisited.length)];
            const [wallX, wallY] = [(startCell.x + next.x) / 2, (startCell.y + next.y) / 2];
            cellsTable[wallY][wallX].classList.remove("obstacle");
            next.isVisited = true;
            this.begin(next);
            return
        }

            // if there are no unvisited neighbors, backtrack
        this.memory.pop();
        if (this.memory.length > 0) {
            this.begin(this.memory[this.memory.length - 1]);
        }
    }
}


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

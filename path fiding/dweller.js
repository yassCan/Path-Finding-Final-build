
class Dweller {
    constructor() {
        this.memory = [] 
    }

    async begin(startCell) {
        
        startCell.isVisited = true;
        // if slowDweller is true make the current cell the dweller is at green for 50ms to visualize the process

        const unvisited = startCell.distantNeighbors().filter(n => !n.isVisited && (!n.element.classList.contains("START") || !n.element.classList.contains("END")));
        
        if (unvisited.length > 0) {
            this.memory.push(startCell);
            const next = unvisited[Math.floor(Math.random() * unvisited.length)];
            const [wallX, wallY] = [(startCell.x + next.x) / 2, (startCell.y + next.y) / 2];
            if(slowDweller) {
                startCell.element.classList.add("dweller");
                await sleep(100);
                startCell.element.classList.remove("dweller");
            }
            cellsTable[wallY][wallX].classList.remove("obstacle");
            next.isVisited = true;
            await this.begin(next);
            return
        }

            // if there are no unvisited neighbors, backtrack
        this.memory.pop();
        if (this.memory.length > 0) {
            await this.begin(this.memory[this.memory.length - 1]);
        }
    }
}
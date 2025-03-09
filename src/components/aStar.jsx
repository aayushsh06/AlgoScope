export const runAStar = (grid, startNodes, targetNode, weights) => {
    if (!startNodes || startNodes.length === 0 || !targetNode) {
        return { visitedNodesInOrder: [], path: [] };
    }
    
    const rows = grid.length;
    const cols = grid[0].length;
    ;
    
    const visited = Array.from(
        { length: rows }, 
        () => Array(cols).fill(false)
    );
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === "barrier-node") {
                visited[row][col] = true;
            }
        }
    }
    
    const heuristic = (row, col) => {
        return Math.abs(row - targetNode.row) + Math.abs(col - targetNode.col);
    };
    
    const visitedNodesInOrder = [];
    let finalPath = [];
    
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    
    const isValid = (row, col) => {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    };
    
    const getEdgeCost = (row, col) => {
        if (!weights) return 1;
        
        const index = row * cols + col;
        if (Array.isArray(weights) && weights[index] !== undefined) {
            return weights[index];
        }
        
        if (Array.isArray(weights) && weights[row] && weights[row][col] !== undefined) {
            return weights[row][col];
        }
        
        const key = `${row}-${col}`;
        if (weights[key] !== undefined) {
            return weights[key];
        }
        
        return 1;
    };
    
    class PriorityQueue {
        constructor() {
            this.elements = [];
        }
        
        enqueue(element, priority) {
            this.elements.push({ element, priority });
            
            let i = this.elements.length - 1;
            while (i > 0 && this.elements[i].priority < this.elements[i-1].priority) {
                [this.elements[i], this.elements[i-1]] = [this.elements[i-1], this.elements[i]];
                i--;
            }
        }
        
        dequeue() {
            if (this.isEmpty()) return null;
            return this.elements.shift().element;
        }
        
        isEmpty() {
            return this.elements.length === 0;
        }
        
        contains(row, col) {
            return this.elements.some(item => 
                item.element.row === row && item.element.col === col
            );
        }
        
        updatePriority(element, priority) {
            const index = this.elements.findIndex(item => 
                item.element.row === element.row && item.element.col === element.col
            );
            
            if (index !== -1) {
                this.elements[index].priority = priority;
                
                let i = index;
                while (i > 0 && this.elements[i].priority < this.elements[i-1].priority) {
                    [this.elements[i], this.elements[i-1]] = [this.elements[i-1], this.elements[i]];
                    i--;
                }
            }
        }
    }
    
    const astar = (startNode) => {
        const openSet = new PriorityQueue();
        const cameFrom = {};
        const gScore = {};
        const fScore = {};
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const key = `${row}-${col}`;
                gScore[key] = Infinity;
                fScore[key] = Infinity;
            }
        }
        
        const startKey = `${startNode.row}-${startNode.col}`;
        gScore[startKey] = 0;
        fScore[startKey] = heuristic(startNode.row, startNode.col);
        
        openSet.enqueue(startNode, fScore[startKey]);
        
        while (!openSet.isEmpty()) {
            const current = openSet.dequeue();
            const currentKey = `${current.row}-${current.col}`;
            
            visitedNodesInOrder.push(current);
            
            if (current.row === targetNode.row && current.col === targetNode.col) {
                let pathNode = current;
                const path = [pathNode];
                
                while (cameFrom[`${pathNode.row}-${pathNode.col}`]) {
                    pathNode = cameFrom[`${pathNode.row}-${pathNode.col}`];
                    path.unshift(pathNode);
                }
                
                finalPath = path;
                return true;
            }
            
            if (visited[current.row][current.col]) continue;
            visited[current.row][current.col] = true;
            
            for (let i = 0; i < 4; i++) {
                const newRow = current.row + dr[i];
                const newCol = current.col + dc[i];
                
                if (!isValid(newRow, newCol) || visited[newRow][newCol]) continue;
                
                const neighbor = { row: newRow, col: newCol };
                const neighborKey = `${newRow}-${newCol}`;
                
                const moveCost = getEdgeCost(newRow, newCol);
                const tentativeGScore = gScore[currentKey] + moveCost;
                
                if (tentativeGScore < gScore[neighborKey]) {
                    cameFrom[neighborKey] = current;
                    gScore[neighborKey] = tentativeGScore;
                    fScore[neighborKey] = tentativeGScore + heuristic(newRow, newCol);
                    
                    if (openSet.contains(newRow, newCol)) {
                        openSet.updatePriority(neighbor, fScore[neighborKey]);
                    } else {
                        openSet.enqueue(neighbor, fScore[neighborKey]);
                    }
                }
            }
        }
        
        return false;
    };
    
    for (const startNode of startNodes) {
        if (astar(startNode)) {
            break;
        }
    }
    
    return {
        visitedNodesInOrder,
        path: finalPath
    };
};
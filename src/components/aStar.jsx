export const runAStar = (grid, startNodes, targetNode) => {
    if (!startNodes || startNodes.length === 0 || !targetNode) {
        return { visitedNodesInOrder: [], path: [] };
    }
    
    const rows = grid.length;
    const cols = grid[0].length;
    
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
    
    class PriorityQueue {
        constructor() {
            this.elements = [];
        }
        
        enqueue(element, priority) {
            this.elements.push({ element, priority });
            this.elements.sort((a, b) => a.priority - b.priority);
        }
        
        dequeue() {
            return this.elements.shift().element;
        }
        
        isEmpty() {
            return this.elements.length === 0;
        }
    }
    
    const astar = (startNode) => {
        const openSet = new PriorityQueue();
        const cameFrom = {};
        const gScore = {};
        const fScore = {};
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                gScore[`${row}-${col}`] = Infinity;
                fScore[`${row}-${col}`] = Infinity;
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
            
            visited[current.row][current.col] = true;
            
            for (let i = 0; i < 4; i++) {
                const newRow = current.row + dr[i];
                const newCol = current.col + dc[i];
                
                if (!isValid(newRow, newCol) || visited[newRow][newCol]) continue;
                
                const neighbor = { row: newRow, col: newCol };
                const neighborKey = `${newRow}-${newCol}`;
                
                const tentativeGScore = gScore[currentKey] + 1;
                
                if (tentativeGScore < gScore[neighborKey]) {
                    cameFrom[neighborKey] = current;
                    gScore[neighborKey] = tentativeGScore;
                    fScore[neighborKey] = tentativeGScore + heuristic(newRow, newCol);
                    
                    openSet.enqueue(neighbor, fScore[neighborKey]);
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
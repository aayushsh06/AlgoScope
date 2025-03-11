export const runAStar = (grid, startNodes, targetNode, weights) => {
    if (!startNodes || startNodes.length === 0 || !targetNode) {
        return { visitedNodesInOrder: [], path: [] };
    }
    
    const rows = grid.length;
    const cols = grid[0].length;
    
    const visited = Array.from(
        { length: rows }, 
        (_, r) => Array.from(
            { length: cols },
            (_, c) => grid[r][c] === "barrier-node"
        )
    );
    
    const heuristic = (row, col) => {
        return Math.abs(row - targetNode.row) + Math.abs(col - targetNode.col);
    };
    
    const getEdgeCost = (row, col) => {
        if (!weights) return 1;
        
        const key = `${row}-${col}`;
        if (typeof weights === 'object') {
            if (Array.isArray(weights) && Array.isArray(weights[row])) {
                return weights[row][col] ?? 1;
            }
            if (Array.isArray(weights)) {
                const index = row * cols + col;
                return weights[index] ?? 1;
            }
            return weights[key] ?? 1;
        }
        return 1;
    };
    
    class PriorityQueue {
        constructor() {
            this.elements = [];
            this.nodeMap = new Map();
        }
        
        enqueue(element, priority) {
            const entry = { element, priority };
            this.elements.push(entry);
            this.nodeMap.set(`${element.row}-${element.col}`, entry);
            this.siftUp(this.elements.length - 1);
        }
        
        dequeue() {
            if (this.isEmpty()) return null;
            const top = this.elements[0].element;
            const end = this.elements.pop();
            this.nodeMap.delete(`${top.row}-${top.col}`);
            if (this.elements.length > 0) {
                this.elements[0] = end;
                this.siftDown(0);
            }
            return top;
        }
        
        isEmpty() {
            return this.elements.length === 0;
        }
        
        contains(row, col) {
            return this.nodeMap.has(`${row}-${col}`);
        }
        
        updatePriority(element, priority) {
            const key = `${element.row}-${element.col}`;
            const entry = this.nodeMap.get(key);
            if (entry && entry.priority > priority) {
                const oldPriority = entry.priority;
                entry.priority = priority;
                const index = this.elements.indexOf(entry);
                this.siftUp(index);
            }
        }
        
        siftUp(idx) {
            const item = this.elements[idx];
            while (idx > 0) {
                const parentIdx = Math.floor((idx - 1) / 2);
                const parent = this.elements[parentIdx];
                if (item.priority >= parent.priority) break;
                this.elements[parentIdx] = item;
                this.elements[idx] = parent;
                idx = parentIdx;
            }
        }
        
        siftDown(idx) {
            const item = this.elements[idx];
            const length = this.elements.length;
            while (true) {
                const leftChildIdx = 2 * idx + 1;
                const rightChildIdx = 2 * idx + 2;
                let swapIdx = null;
                if (leftChildIdx < length) {
                    const leftChild = this.elements[leftChildIdx];
                    if (leftChild.priority < item.priority) {
                        swapIdx = leftChildIdx;
                    }
                }
                if (rightChildIdx < length) {
                    const rightChild = this.elements[rightChildIdx];
                    if (
                        (swapIdx === null && rightChild.priority < item.priority) ||
                        (swapIdx !== null && rightChild.priority < this.elements[swapIdx].priority)
                    ) {
                        swapIdx = rightChildIdx;
                    }
                }
                if (swapIdx === null) break;
                this.elements[idx] = this.elements[swapIdx];
                this.elements[swapIdx] = item;
                idx = swapIdx;
            }
        }
    }
    
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    
    const isValid = (row, col) => {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    };
    
    const visitedNodesInOrder = [];
    let bestPath = [];
    let bestPathCost = Infinity;
    
    const runAStarFromStart = (startNode) => {
        const localVisited = Array.from(
            { length: rows }, 
            (_, r) => [...visited[r]]
        );
        
        const openSet = new PriorityQueue();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const startKey = `${startNode.row}-${startNode.col}`;
        gScore.set(startKey, 0);
        fScore.set(startKey, heuristic(startNode.row, startNode.col));
        
        openSet.enqueue(startNode, fScore.get(startKey));
        
        const localVisitedNodes = [];
        let foundPath = false;
        
        while (!openSet.isEmpty() && !foundPath) {
            const current = openSet.dequeue();
            const currentKey = `${current.row}-${current.col}`;
            localVisitedNodes.push(current);
            
            if (current.row === targetNode.row && current.col === targetNode.col) {
                let currentPathCost = gScore.get(currentKey);
                if (currentPathCost < bestPathCost) {
                    let pathNode = current;
                    bestPath = [pathNode];
                    while (cameFrom.has(`${pathNode.row}-${pathNode.col}`)) {
                        pathNode = cameFrom.get(`${pathNode.row}-${pathNode.col}`);
                        bestPath.unshift(pathNode);
                    }
                    bestPathCost = currentPathCost;
                }
                foundPath = true;
                break;
            }
            
            if (localVisited[current.row][current.col]) continue;
            localVisited[current.row][current.col] = true;
            
            for (let i = 0; i < 4; i++) {
                const newRow = current.row + dr[i];
                const newCol = current.col + dc[i];
                if (!isValid(newRow, newCol) || localVisited[newRow][newCol]) continue;
                const neighbor = { row: newRow, col: newCol };
                const neighborKey = `${newRow}-${newCol}`;
                const moveCost = getEdgeCost(newRow, newCol);
                const tentativeGScore = (gScore.get(currentKey) || 0) + moveCost;
                if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    const fScoreValue = tentativeGScore + heuristic(newRow, newCol);
                    fScore.set(neighborKey, fScoreValue);
                    if (openSet.contains(newRow, newCol)) {
                        openSet.updatePriority(neighbor, fScoreValue);
                    } else {
                        openSet.enqueue(neighbor, fScoreValue);
                    }
                }
            }
        }
        
        visitedNodesInOrder.push(...localVisitedNodes);
        return foundPath;
    };
    
    let foundAnyPath = false;
    for (const startNode of startNodes) {
        const foundPathFromThisStart = runAStarFromStart(startNode);
        foundAnyPath = foundAnyPath || foundPathFromThisStart;
    }
    
    return {
        visitedNodesInOrder,
        path: foundAnyPath ? bestPath : []
    };
};

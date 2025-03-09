class Deque {
    constructor() {
        this.items = [];
        this.size = 0;
    }
    enqueue(element) {
        this.items.push(element);
        this.size++;
    }
    dequeue() {
        if (this.isEmpty()) return undefined;
        this.size--;
        return this.items.shift();
    }
    isEmpty() {
        return this.size === 0;
    }
    peekFront() {
        return this.items[0];
    }
    getSize() {
        return this.size;
    }
}

export const runBFS = (grid, startNodes, targetNode) => {
    if (!startNodes || startNodes.length === 0 || !targetNode) {
        return { visitedNodesInOrder: [], path: [] };
    }
    
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from(
        { length: rows },
        () => Array(cols).fill(false)
    );
    
    for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < cols; ++col) {
            if (grid[row][col] === 'barrier-node') {
                visited[row][col] = true;
            }
        }
    }
    
    const parentMap = Array.from(
        { length: rows },
        () => Array(cols).fill(null)
    );
    
    let queue = new Deque();
    const visitedNodesInOrder = [];
    
    for (const node of startNodes) {
        queue.enqueue(node);
        visited[node.row][node.col] = true;
        visitedNodesInOrder.push(node);
    }

    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    const isValid = (row, col) => {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    };
    
    while (!queue.isEmpty()) {
        const currentNode = queue.dequeue();
        
        if (currentNode.row === targetNode.row && currentNode.col === targetNode.col) {
            const path = [];
            let current = {row: targetNode.row, col: targetNode.col};
            
            while (current !== null) {
                path.unshift(current);
                current = parentMap[current.row][current.col];
            }
            console.log(path);
            return { visitedNodesInOrder, path };
        }
        
        for (let i = 0; i < dr.length; ++i) {
            const newRow = currentNode.row + dr[i];
            const newCol = currentNode.col + dc[i];
            
            if (isValid(newRow, newCol) && !visited[newRow][newCol]) {
                const neighbor = { row: newRow, col: newCol };
                
                visited[newRow][newCol] = true;
                visitedNodesInOrder.push(neighbor);
                
                parentMap[newRow][newCol] = {row: currentNode.row, col: currentNode.col};
                
                queue.enqueue(neighbor);
            }
        }
    }
    return { visitedNodesInOrder, path: [] };
}
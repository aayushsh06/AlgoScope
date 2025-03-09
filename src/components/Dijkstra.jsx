class PriorityQueue {
    constructor() {
        this.heap = [];
    }
    
    enqueue(element, priority) {
        this.heap.push({ element, priority });
        this.bubbleUp();
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        this.swap(0, this.heap.length - 1);
        const min = this.heap.pop();
        this.bubbleDown();
        return min.element;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }
    
    bubbleDown() {
        let index = 0;
        const length = this.heap.length;
        while (true) {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            let smallest = index;
            
            if (leftIndex < length && this.heap[leftIndex].priority < this.heap[smallest].priority) {
                smallest = leftIndex;
            }
            if (rightIndex < length && this.heap[rightIndex].priority < this.heap[smallest].priority) {
                smallest = rightIndex;
            }
            if (smallest === index) break;
            this.swap(index, smallest);
            index = smallest;
        }
    }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}

export function runDijkstra(grid, startNodes, targetNode, weights) {
    if (!startNodes || startNodes.length === 0 || !targetNode) {
        return { visitedNodesInOrder: [], path: [] };
    }
    const rows = grid.length;
    const cols = grid[0].length;
    const visitedNodesInOrder = [];

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
    
    const dist = Array.from(
        { length: rows },
        () => Array(cols).fill(Infinity)
    );
    
    const prev = Array.from(
        { length: rows },
        () => Array(cols).fill(null)
    );
    
    const getWeight = (row, col) => {
        if (!weights || !weights[row] || weights[row][col] === undefined) {
            return 1;
        }
        return weights[row][col];
    };
    
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    
    const pq = new PriorityQueue();
    for (const startNode of startNodes) {
        dist[startNode.row][startNode.col] = 0;
        pq.enqueue(startNode, 0);
    }
    
    let targetFound = false;
    
    while (!pq.isEmpty() && !targetFound) {
        const current = pq.dequeue();
        const { row, col } = current;
        
        if (visited[row][col]) continue;
        
        visited[row][col] = true;
        visitedNodesInOrder.push(current);
        
        if (row === targetNode.row && col === targetNode.col) {
            targetFound = true;
            break;
        }
        
        for (let i = 0; i < 4; i++) {
            const newRow = row + dr[i];
            const newCol = col + dc[i];
            
            if (
                newRow >= 0 && 
                newRow < rows && 
                newCol >= 0 && 
                newCol < cols && 
                !visited[newRow][newCol]
            ) {
                const weight = getWeight(newRow, newCol);
                const newDist = dist[row][col] + weight;
                
                if (newDist < dist[newRow][newCol]) {
                    dist[newRow][newCol] = newDist;
                    prev[newRow][newCol] = { row, col };
                    pq.enqueue({ row: newRow, col: newCol }, newDist);
                }
            }
        }
    }
    
    const path = [];
    if (targetFound) {
        let current = { row: targetNode.row, col: targetNode.col };
        while (current) {
            path.unshift(current);
            current = prev[current.row][current.col];
        }
    }
    
    return { visitedNodesInOrder, path };
}

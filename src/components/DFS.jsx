export const runDFS = (grid, startNodes, targetNode) => {
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
    
    const visitedNodesInOrder = [];
    let foundPath = false;
    let finalPath = [];
    
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    
    const isValid = (row, col) => {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    };
    
    const dfs = (row, col, path = []) => {
        if (!isValid(row, col) || visited[row][col] || foundPath) return;
        
        visited[row][col] = true;
        visitedNodesInOrder.push({ row, col });
        
        const currentPath = [...path, { row, col }];
        
        if (row === targetNode.row && col === targetNode.col) {
            foundPath = true;
            finalPath = currentPath;
            return;
        }
        
        for (let i = 0; i < 4; i++) {
            const newRow = row + dr[i];
            const newCol = col + dc[i];
            dfs(newRow, newCol, currentPath);
        }
    };
    
    for (const node of startNodes) {
        if (!foundPath) {
            dfs(node.row, node.col);
        }
    }
    
    return {
        visitedNodesInOrder,
        path: finalPath
    };
};
export function genMaze(grid, startNode, targetNode) {
    if (!startNode || !targetNode) {
        return [];
    }

    const rows = grid.length;
    const cols = grid[0].length;
    
    const walls = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if ((r !== startNode.row || c !== startNode.col) && 
                (r !== targetNode.row || c !== targetNode.col)) {
                walls.push({row: r, col: c});
            }
        }
    }
    
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const dr = [-2, 0, 2, 0]; 
    const dc = [0, 2, 0, -2];
    
    const pathNodes = new Set();
    
    const dfs = (row, col) => {
        visited[row][col] = true;
        pathNodes.add(`${row},${col}`); 
        
        const directions = [0, 1, 2, 3];
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        
        for (const dir of directions) {
            const newRow = row + dr[dir];
            const newCol = col + dc[dir];
            
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol]) {
                const wallRow = row + dr[dir]/2;
                const wallCol = col + dc[dir]/2;
                pathNodes.add(`${wallRow},${wallCol}`);
                
                dfs(newRow, newCol);
            }
        }
    };
    
    dfs(startNode.row, startNode.col);
    
    pathNodes.add(`${targetNode.row},${targetNode.col}`);
    
    const wallsToReturn = walls.filter(cell => !pathNodes.has(`${cell.row},${cell.col}`));
    
    return wallsToReturn;
}
export function genWeights(grid, setWeights, setIsRunningAlgorithm) {
  setIsRunningAlgorithm(true);
  
  const rows = grid.length;
  const cols = grid[0].length;
  
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ row: r, col: c });
    }
  }
  
  let initialWeights = Array.from({ length: rows }, () => Array(cols).fill(null));
  setWeights(initialWeights);
  
  const weightValues = {};
  cells.forEach(cell => {
    const key = `${cell.row}-${cell.col}`;
    weightValues[key] = Math.floor(Math.random() * 10);
  });
  
  const totalDuration = 1500; 
  const delayPerCell = totalDuration / cells.length;
  
  cells.forEach((cell, index) => {
    setTimeout(() => {
      setWeights(prevWeights => {
        const newWeights = JSON.parse(JSON.stringify(prevWeights));
        const weight = weightValues[`${cell.row}-${cell.col}`];
        newWeights[cell.row][cell.col] = weight;
        return newWeights;
      });

      if (index === cells.length - 1) {
        setTimeout(() => {
          setIsRunningAlgorithm(false);
        }, 100);
      }
    }, index * delayPerCell);
  });
}
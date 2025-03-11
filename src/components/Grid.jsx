import React from 'react'
import { useState, useEffect, useRef } from 'react';
import '../styles/Grid.css'
import { runDFS } from './DFS';
import { runBFS } from './BFS';
import { runDijkstra } from './Dijkstra';
import { runAStar } from './aStar';
import { genMaze } from './genMaze';
import { genWeights } from './genWeights';
import Introduction from './Introduction';
import Stats from './Stats';


const Grid = () => {
    const [drawMode, setDrawMode] = useState(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [startNodes, setStartNodes] = useState([]);
    const [targetNode, setTargetNode] = useState(null);
    const [isRunningAlgorithm, setIsRunningAlgorithm] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [pathNodes, setPathNodes] = useState([]);
    const [weights, setWeights] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

    const [stats, setStats] = useState(true);
    const [displayStats, setDisplayStats] = useState(null);

    const [introOpen, setIntroOpen] = useState(true);
    const header = useRef(null);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        headerHeight: 100
    });

    const rows = Math.floor((windowSize.height - windowSize.headerHeight) / 23);
    const cols = Math.floor(windowSize.width / 23);

    const [grid, setGrid] = useState(
        Array.from({ length: rows }, () => Array(cols).fill("unvisited-node"))
    );

    const resizeWeights = (newRows, newCols) => {
        if (!weights) return null;

        const newWeights = Array.from({ length: newRows }, (_, rowIndex) =>
            Array.from({ length: newCols }, (_, colIndex) => {
                if (rowIndex < weights.length && colIndex < weights[0].length) {
                    return weights[rowIndex][colIndex];
                }
                return Math.floor(Math.random() * 9) + 1;
            })
        );

        return newWeights;
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowSize(prev => ({
                width: window.innerWidth,
                height: window.innerHeight,
                headerHeight: header.current ? header.current.offsetHeight : prev.headerHeight
            }));
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const headerHeight = entries[0].target.offsetHeight;
                setWindowSize(prev => ({
                    ...prev,
                    headerHeight: headerHeight
                }));
            }
        });

        if (header.current) {
            observer.observe(header.current);
        }

        return () => {
            if (header.current) {
                observer.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const newRows = Math.floor((windowSize.height - windowSize.headerHeight) / 23);
        const newCols = Math.floor(windowSize.width / 23);

        if (newRows !== grid.length || newCols !== grid[0].length) {
            const newGrid = Array.from(
                { length: newRows },
                (_, rowIndex) => Array.from(
                    { length: newCols },
                    (_, colIndex) => {
                        if (rowIndex < grid.length && colIndex < grid[0].length) {
                            return grid[rowIndex][colIndex];
                        }
                        return "unvisited-node";
                    }
                )
            );

            setGrid(newGrid);

            if (weights) {
                const newWeights = resizeWeights(newRows, newCols);
                setWeights(newWeights);
            }

            setStartNodes(prevStartNodes =>
                prevStartNodes.filter(node =>
                    node.row < newRows && node.col < newCols
                )
            );

            if (targetNode && (targetNode.row >= newRows || targetNode.col >= newCols)) {
                setTargetNode(null);
            }
        }
    }, [windowSize]);

    const colorCell = (row, col) => {
        if (!drawMode || isRunningAlgorithm) return;

        clearVisualization();
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];

            for (let i = 0; i < newGrid.length; i++) {
                newGrid[i] = [...newGrid[i]];
            }

            if (drawMode === 'start-node') {
                const existingIndex = startNodes.findIndex(
                    node => node.row === row && node.col === col
                );

                if (existingIndex >= 0) {
                    const newStartNodes = [...startNodes];
                    newStartNodes.splice(existingIndex, 1);
                    setStartNodes(newStartNodes);
                    newGrid[row][col] = "unvisited-node";
                } else {
                    if (targetNode && targetNode.row === row && targetNode.col === col) {
                        setTargetNode(null);
                    }

                    const newStartNode = { row, col };
                    setStartNodes(prevStartNodes => {
                        const nodeExists = prevStartNodes.some(
                            node => node.row === row && node.col === col
                        );
                        if (nodeExists) return prevStartNodes;
                        return [...prevStartNodes, newStartNode];
                    });
                    newGrid[row][col] = drawMode;
                }
            } else if (drawMode === 'target-node') {
                if (targetNode && targetNode.row === row && targetNode.col === col) {
                    setTargetNode(null);
                    newGrid[row][col] = "unvisited-node";
                } else {
                    for (let r = 0; r < newGrid.length; r++) {
                        for (let c = 0; c < newGrid[r].length; c++) {
                            if (newGrid[r][c] === 'target-node') {
                                newGrid[r][c] = 'unvisited-node';
                            }
                        }
                    }

                    const startNodeIndex = startNodes.findIndex(
                        node => node.row === row && node.col === col
                    );

                    if (startNodeIndex >= 0) {
                        const newStartNodes = [...startNodes];
                        newStartNodes.splice(startNodeIndex, 1);
                        setStartNodes(newStartNodes);
                    }

                    setTargetNode({ row, col });
                    newGrid[row][col] = drawMode;
                }
            } else {
                const startNodeIndex = startNodes.findIndex(
                    node => node.row === row && node.col === col
                );

                if (startNodeIndex >= 0) {
                    const newStartNodes = [...startNodes];
                    newStartNodes.splice(startNodeIndex, 1);
                    setStartNodes(newStartNodes);
                }

                if (targetNode && targetNode.row === row && targetNode.col === col) {
                    setTargetNode(null);
                }

                newGrid[row][col] = drawMode;
            }

            return newGrid;
        });
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    const handleMouseDown = (row, col) => {
        setMouseDown(true);
        colorCell(row, col);
    };

    const handleGridClick = (row, col) => {
        if (mouseDown) {
            colorCell(row, col);
        }
    };

    const visualizeAlgorithm = () => {
        if (startNodes.length === 0 || !targetNode || isRunningAlgorithm || !selectedAlgorithm) return;

        setIsRunningAlgorithm(true);
        setVisitedNodes([]);
        setPathNodes([]);

        let visitedNodesInOrder = [];
        let path = [];


        if (selectedAlgorithm === 'Depth First Search') {
            const { visitedNodesInOrder: dfsVisitedNodes, path: dfsPath } = runDFS(grid, startNodes, targetNode);
            visitedNodesInOrder = dfsVisitedNodes;
            path = dfsPath;
        }
        else if (selectedAlgorithm === 'Breadth First Search') {
            const { visitedNodesInOrder: bfsVisitedNodes, path: bfsPath } = runBFS(grid, startNodes, targetNode);
            visitedNodesInOrder = bfsVisitedNodes;
            path = bfsPath;
        }
        else if (selectedAlgorithm === 'A*') {
            const { visitedNodesInOrder: a_starVisitedNodes, path: a_starPath } = runAStar(grid, startNodes, targetNode, weights);
            visitedNodesInOrder = a_starVisitedNodes;
            path = a_starPath;
        }
        else if (selectedAlgorithm === 'Dijkstra') {
            const { visitedNodesInOrder: disjkstraVisitedNodes, path: disjkstraPath } = runDijkstra(grid, startNodes, targetNode, weights);
            visitedNodesInOrder = disjkstraVisitedNodes;
            path = disjkstraPath;
        }

        let statsData = null;

        if(stats){
            statsData = 
            {
                algorithmRan: selectedAlgorithm,
                pathFound: path.length > 0,
                numNodesPath: path.length,
                numNodesVisited: new Set(visitedNodesInOrder.map(node => `${node.row},${node.col}`)).size,
                cost:path.reduce((sum, node) => sum + (weights && weights[node.row] && weights[node.row][node.col] !== undefined ? weights[node.row][node.col] : 1), 0),
                setDisplayStats: setDisplayStats
            }
        }



        const animateVisitedNodes = () => {
            const totalDuration = 3000;
            const delayPerIteration = totalDuration / visitedNodesInOrder.length;

            for (let i = 0; i < visitedNodesInOrder.length; i++) {
                setTimeout(() => {
                    setVisitedNodes(prev => [...prev, visitedNodesInOrder[i]]);

                    if (i === visitedNodesInOrder.length - 1) {
                        setTimeout(() => {
                            animatePath();
                        }, 500);
                    }
                }, i * delayPerIteration);
            }
        };

        const animatePath = () => {
            const totalDuration = 3000;
            const delayPerIteration = totalDuration / path.length;

            if (path.length > 0) {
                for (let i = 0; i < path.length; i++) {
                    setTimeout(() => {
                        setPathNodes(prev => [...prev, path[i]]);

                        if (i === path.length - 1) {
                            setIsRunningAlgorithm(false);
                            setDisplayStats(
                                statsData
                            )
                        }
                    }, i * delayPerIteration);
                }
            } else {
                setIsRunningAlgorithm(false);
                if (stats) {
                    setDisplayStats(
                        statsData
                    )
                }
            }
        };

        if (visitedNodesInOrder.length > 0) {
            animateVisitedNodes();
        } else {
            setIsRunningAlgorithm(false);
            if (stats) {
                setDisplayStats(
                    statsData
                )
            }
        }
    };

    const createMaze = () => {
        resetMaze();
        clearVisualization();
        setIsRunningAlgorithm(true);
        if (!startNodes) { return; }

        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            for (let i = 1; i < startNodes.length; ++i) {
                const node = startNodes[i];
                newGrid[node.row][node.col] = 'unvisited-node';
            }
            return newGrid;
        })


        setStartNodes(prevNodes => [prevNodes[0]]);

        const setToBarrier = genMaze(grid, startNodes[0], targetNode);

        const animateMaze = () => {
            const totalDuration = 3000;
            const delayPerIteration = totalDuration / setToBarrier.length;

            for (let i = 0; i < setToBarrier.length; i++) {
                setTimeout(() => {
                    const node = setToBarrier[i];
                    setGrid(prevGrid => {
                        const newGrid = [...prevGrid];
                        newGrid[node.row][node.col] = 'barrier-node';
                        return newGrid;
                    });
                    if (i === setToBarrier.length - 1) {
                        setIsRunningAlgorithm(false);
                    }

                }, i * delayPerIteration);
            }
        };

        if (setToBarrier.length > 0) {
            animateMaze();
        }
        else {
            setIsRunningAlgorithm(false);
        }
    }

    const resetMaze = () => {
        setGrid(prevGrid => {
            const newGrid = [...prevGrid]
            for (let row = 0; row < newGrid.length; row++) {
                for (let col = 0; col < newGrid[0].length; col++) {

                    const isStartNode = startNodes && startNodes[0].row == row &&
                        startNodes[0].col == col;
                    const isTargetNode = targetNode &&
                        targetNode.row === row && targetNode.col === col;

                    if (!isStartNode && !isTargetNode) {
                        newGrid[row][col] = 'unvisited-node';
                    }
                }
            }
            return newGrid;
        })
    }

    const clearVisualization = () => {
        setVisitedNodes([]);
        setPathNodes([]);
    };

    const resetGrid = () => {
        setGrid(Array.from({ length: rows }, () => Array(cols).fill("unvisited-node")));
        setStartNodes([]);
        setTargetNode(null);
        setVisitedNodes([]);
        setPathNodes([]);
        setWeights(null);
    };

    return (
        <>
            {introOpen && <Introduction introOpen={introOpen} setIntroOpen={setIntroOpen} />}
            {(displayStats && stats) && <Stats {...displayStats}/>}
            <div className='drawing-select' ref={header}>
                <div className='title'>
                    <h1 className='header'>Algorithm Visualizer</h1>
                </div>

                <div className="button-group node-controls">
                    <button
                        onClick={() => setDrawMode('barrier-node')}
                        className={drawMode === 'barrier-node' ? 'active' : ''}
                    >
                        Barrier Node
                    </button>
                    <button
                        onClick={() => setDrawMode('start-node')}
                        className={drawMode === 'start-node' ? 'active' : ''}
                    >
                        Start Node
                    </button>
                    <button
                        onClick={() => setDrawMode('target-node')}
                        className={drawMode === 'target-node' ? 'active' : ''}
                    >
                        Target Node
                    </button>
                    <button
                        onClick={() => setDrawMode('unvisited-node')}
                        className={drawMode === 'unvisited-node' ? 'active' : ''}
                    >
                        Erase Node
                    </button>
                </div>

                <div className="button-group maze-controls">
                    <button
                        onClick={() => createMaze()}
                        disabled={isRunningAlgorithm || startNodes.length === 0 || !targetNode}
                        className='generate-maze-button'
                    >
                        Generate Maze
                    </button>
                    <button
                        onClick={() => { genWeights(grid, setWeights, setIsRunningAlgorithm); clearVisualization(); }}
                        disabled={isRunningAlgorithm}
                        className='generate-weights-button'
                    >
                        Generate Weights
                    </button>
                    <button
                        onClick={() => { setWeights(null); clearVisualization(); }}
                        disabled={isRunningAlgorithm}
                        className='remove-weights-button'
                    >
                        Remove Weights
                    </button>
                    <button
                        onClick={() => { setStats(prev => !prev) }}
                        disabled={isRunningAlgorithm}
                        className='configureStats'>
                        Toggle Statistics
                    </button>
                </div>

                <div className="button-group algorithm-controls">
                    <div className="select-container">
                        <select
                            id="algorithm-select"
                            value={selectedAlgorithm}
                            onChange={(e) => setSelectedAlgorithm(e.target.value)}
                            className="algorithm-select"
                            disabled={isRunningAlgorithm}
                        >
                            <option value="" >Select Algorithm</option>
                            <option value="Depth First Search">Depth-First Search (DFS)</option>
                            <option value="Breadth First Search">Breadth-First Search (BFS)</option>
                            <option value="Dijkstra">Dijkstra's Algorithm</option>
                            <option value="A*">A* Search</option>
                        </select>
                    </div>
                    <button
                        onClick={visualizeAlgorithm}
                        disabled={isRunningAlgorithm || startNodes.length === 0 || !targetNode || !selectedAlgorithm}
                        className='run-algorithm-button'
                    >
                        Visualize
                    </button>
                    <button
                        onClick={clearVisualization}
                        disabled={isRunningAlgorithm}
                        className='clear-visualization-button'
                    >
                        Clear Visualization
                    </button>
                    <button
                        onClick={resetGrid}
                        disabled={isRunningAlgorithm}
                        className='reset-grid-button'
                    >
                        Reset Grid
                    </button>
                </div>

                <div className="status-info">
                    {startNodes.length > 0 ?
                        <span>Start Nodes: {startNodes.length}</span> :
                        <span>No start nodes set</span>
                    }
                    {targetNode ?
                        <span>Target Node: ({targetNode.row}, {targetNode.col})</span> :
                        <span>No target node set</span>
                    }
                    {selectedAlgorithm && <span>Algorithm: {
                        selectedAlgorithm === 'Depth First Search' ? 'DFS' :
                            selectedAlgorithm === 'Breadth First Search' ? 'BFS' :
                                selectedAlgorithm === 'A*' ? 'A*' : 'Dijkstra'
                    }</span>}
                    {stats ?
                        <span>Algorithm Stats: ON</span> :
                        <span>Algorithm Stats: OFF</span>

                    }
                </div>
            </div>
            <div
                onMouseUp={handleMouseUp}
                className='grid'
            >
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((col, colIndex) => {
                            let cellClass = grid[rowIndex][colIndex];

                            const isOnPath = pathNodes.some(
                                node => node.row === rowIndex && node.col === colIndex
                            );

                            const isVisited = visitedNodes.some(
                                node => node.row === rowIndex && node.col === colIndex
                            );

                            const isSpecialNode =
                                startNodes.some(node => node.row === rowIndex && node.col === colIndex) ||
                                (targetNode && targetNode.row === rowIndex && targetNode.col === colIndex);

                            if (isOnPath && !isSpecialNode) {
                                cellClass = "path-node";
                            } else if (isVisited && !isSpecialNode && !isOnPath) {
                                cellClass = "visited-node";
                            }

                            return (
                                <div
                                    key={colIndex}
                                    className={cellClass}
                                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                    onMouseEnter={() => handleGridClick(rowIndex, colIndex)}
                                >
                                    {weights ? weights[rowIndex][colIndex] : null}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Grid
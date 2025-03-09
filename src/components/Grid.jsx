import React from 'react'
import { useState, useEffect } from 'react';
import '../styles/Grid.css'
import { runDFS } from './DFS';
import { runBFS } from './BFS';
import Introduction from './Introduction';

const Grid = () => {
    const [drawMode, setDrawMode] = useState(null);
    const [mouseDown, setMouseDown] = useState(false);
    const [startNodes, setStartNodes] = useState([]);
    const [targetNode, setTargetNode] = useState(null);
    const [isRunningAlgorithm, setIsRunningAlgorithm] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [pathNodes, setPathNodes] = useState([]);

    const [introOpen, setIntroOpen] = useState(true);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const rows = Math.floor((windowSize.height - 100) / 23);
    const cols = Math.floor(windowSize.width / 23);

    const [grid, setGrid] = useState(
        Array.from({ length: rows }, () => Array(cols).fill("unvisited-node"))
    );

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const newRows = Math.floor((windowSize.height - 100) / 23);
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

        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            newGrid[row] = [...newGrid[row]];

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
                    if (targetNode) {
                        const { row: prevRow, col: prevCol } = targetNode;
                        newGrid[prevRow] = [...newGrid[prevRow]];
                        newGrid[prevRow][prevCol] = "unvisited-node";
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

    const visualizeAlgorithm = (algorithm) => {
        if (startNodes.length === 0 || !targetNode || isRunningAlgorithm) return;

        setIsRunningAlgorithm(true);
        setVisitedNodes([]);
        setPathNodes([]);

        let visitedNodesInOrder = [];
        let path = [];

        if (algorithm === 'dfs') {
            const { visitedNodesInOrder: dfsVisitedNodes, path: dfsPath } = runDFS(grid, startNodes, targetNode);
            visitedNodesInOrder = dfsVisitedNodes;
            path = dfsPath;
        }
        else if (algorithm == 'bfs') {
            const { visitedNodesInOrder: bfsVisitedNodes, path: bfsPath } = runBFS(grid, startNodes, targetNode);
            visitedNodesInOrder = bfsVisitedNodes;
            path = bfsPath;
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
                        }
                    }, i * delayPerIteration);
                }
            } else {
                setIsRunningAlgorithm(false);
            }
        };

        if (visitedNodesInOrder.length > 0) {
            animateVisitedNodes();
        } else {
            setIsRunningAlgorithm(false);
        }
    };

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
    };

    return (
        <>
            {introOpen && <Introduction introOpen={introOpen} setIntroOpen={setIntroOpen}/>}
            <div className='drawing-select'>
                <h1 className ='header'>Algorithm Visualizer</h1>
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
                <button
                    onClick={() => visualizeAlgorithm('dfs')}
                    disabled={isRunningAlgorithm || startNodes.length === 0 || !targetNode}
                >
                    Run DFS
                </button>
                <button
                    onClick={() => visualizeAlgorithm('bfs')}
                    disabled={isRunningAlgorithm || startNodes.length === 0 || !targetNode}
                >
                    Run BFS
                </button>
                <button
                    onClick={clearVisualization}
                    disabled={isRunningAlgorithm}
                >
                    Clear Visualization
                </button>
                <button
                    onClick={resetGrid}
                    disabled={isRunningAlgorithm}
                >
                    Reset Grid
                </button>
                <div className="status-info">
                    {startNodes.length > 0 ?
                        <span>Start Nodes: {startNodes.length}</span> :
                        <span>No start nodes set</span>
                    }
                    {targetNode ?
                        <span>Target Node: ({targetNode.row}, {targetNode.col})</span> :
                        <span>No target node set</span>
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
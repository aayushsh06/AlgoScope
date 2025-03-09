import React from 'react'
import '../styles/Introduction.css'

const Introduction = ({ introOpen, setIntroOpen }) => {
    if (introOpen === false) {
        return null;
    }
    const closeModal = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setIntroOpen(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content">
                <h1>Instructions:</h1>
                <p>
                    <span>1. </span>Set Up the Grid:
                    Select node type, then click and drag to place:
                </p>
                    <ul>
                        <li>Barrier Nodes (to block paths)</li>
                        <li>Start Nodes (where the algorithm begins)</li>
                        <li>Target Node (where the algorithm ends)</li>
                        <li>Click Erase Node to remove any placed node.</li>
                    </ul>
                
                <p>
                    <span>2. </span>
                    Run the Algorithm:

                    Choose DFS or BFS to run the pathfinding algorithm. Make sure you’ve set both a Start Node and a Target Node first. More algorithms soon to come!
                </p>
                <p>
                    
                    <span>3. </span>
                    Control the Visualization:
                    Click Clear Visualization to remove the path and visited nodes.
                    Click Reset Grid to clear all nodes and barriers, resetting the grid.
                </p>
                <button onClick={() => setIntroOpen(false)}>Close</button>
            </div>
        </div>
    );
};

export default Introduction;


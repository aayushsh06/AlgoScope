import React, { useEffect, useState } from 'react';
import '../styles/Stats.css';

const Stats = ({ algorithmRan, pathFound, numNodesPath, numNodesVisited, cost, setDisplayStats }) => {
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true);
        }, 50);
        
        return () => clearTimeout(timer);
    }, []);
    
    const handleClose = () => {
        setIsActive(false);
        setTimeout(() => {
            setDisplayStats(null);
        }, 300);
    };
    
    return (
        <>
            <div className={`modal-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}></div>
            <div className={`stats ${isActive ? 'active' : ''}`}>
                <h1>{algorithmRan} Performance Statistics</h1>
                {!pathFound ? (
                    <p>No Path to Target Found</p>
                ) : (
                    <div className='foundStats'>
                        <p>Number of Nodes in Path: {numNodesPath}</p>
                        <p>Number of Nodes Visited: {numNodesVisited}</p>
                        <p>Path Cost: {cost}</p>
                    </div>
                )}
                <button onClick={handleClose}>Close</button>
            </div>
        </>
    );
};

export default Stats;
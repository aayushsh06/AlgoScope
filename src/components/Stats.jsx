import React from 'react'
import '../styles/Stats.css'
const Stats = ({algorithmRan, pathFound, numNodesPath, numNodesVisited, cost, setDisplayStats}) => {
    return (
        <div className='stats'>
            <h1>{algorithmRan} Performance Statistics</h1>
            {!pathFound ? <p>No Path to Target Found</p> :

                <div className='foundStats'>
                    <p>Number of Nodes in Path: {numNodesPath}</p>
                    <p>Number of Nodes Visited: {numNodesVisited}</p>
                    <p>Path Cost: {cost}</p>
                </div>
            }
            <button onClick={() => setDisplayStats(null)}>Close</button>
        </div>
    )
}

export default Stats

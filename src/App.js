import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 30;
const numCols = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, -1],
  [-1, 1],
  [-1, 0],
  [1, 0],
  [1, 1],
];

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array(numCols).fill(0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numRows; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 500);
  }, []);

  return (
    <div style={{ marginLeft: "25%", marginTop: "5%", marginBottom: "5%" }}>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 22px)`,
        }}
      >
        {grid.map((row, i) => {
          return row.map((_, k) => {
            return (
              <div
                key={`${i}-${k}`}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? "yellow" : undefined,
                  border: "solid 1px lightgrey",
                }}
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = !gridCopy[i][k];
                  });
                  setGrid(newGrid);
                }}
              ></div>
            );
          });
        })}
      </div>
    </div>
  );
}

export default App;

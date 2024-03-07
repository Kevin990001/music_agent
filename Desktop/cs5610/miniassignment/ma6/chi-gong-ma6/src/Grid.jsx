import React, { useState } from 'react';
import Cell from './Cell'; 
import './Grid.css'; 

const Grid = () => {
  const [onCount, setOnCount] = useState(0); 


  const handleCellToggle = (isOn) => {
    setOnCount(prevCount => isOn ? prevCount + 1 : prevCount - 1); 
  };

  return (
    <div className="grid-container"> 
      <div>
        <h2>Count of black Cells: {onCount}</h2>
        <div className="grid">
          <Cell onToggle={handleCellToggle} />
          <Cell onToggle={handleCellToggle} />
          <Cell onToggle={handleCellToggle} />
          <Cell onToggle={handleCellToggle} />
        </div>
      </div>
    </div>
  );
};

export default Grid;

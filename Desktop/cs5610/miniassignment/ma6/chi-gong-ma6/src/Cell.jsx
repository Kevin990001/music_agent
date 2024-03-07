import React, { useState } from 'react';
import './Cell.css'; 


const Cell = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false); 

 
  const toggleCell = () => {
    setIsOn(!isOn); 
    onToggle(!isOn); 
  };

  
  const cellStyle = {
    backgroundColor: isOn ? 'black' : 'white',
  };

  return (
    <div className="cell" style={cellStyle} onClick={toggleCell}></div>
  );
};

export default Cell;


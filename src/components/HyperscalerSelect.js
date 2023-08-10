import React from "react";
import jsonData from '../data.json'

const HyperscalerSelect = ({ selectedHyperscaler, handleHyperscalerChange }) => {
    
    return (
      <div>
        <p className="form-title">Chosen Hyperscaler</p>
        <select
        id="hyperscaler"
        className="form-select"
        // value={selectedHyperscaler.key}
        onChange={handleHyperscalerChange}      >
          {jsonData.hyperscalers.map((hyperscaler) => (
            <option key={hyperscaler.key} value={hyperscaler.key}>
              {hyperscaler.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

export default HyperscalerSelect;

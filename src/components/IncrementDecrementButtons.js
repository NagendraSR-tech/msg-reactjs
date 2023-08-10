import React from "react";
import { HiPlus } from "react-icons/hi";
import { HiMinus } from "react-icons/hi";
import PopoverC from "./PopoverC";

const IncrementDecrementButtons = ({
  updatedMetrics,
  handleIncrement,
  handleDecrement,
  handleInputChange,
  handleManualEntry,
}) => {
  return (
    <>
      <h4 className="form-title">Calculate by Data Size</h4>
      {updatedMetrics.map((metric) => (
        <div key={metric.key}>
          <label htmlFor={metric.key}>{metric.name}</label>
          <div className="data-size-form">
            <div className="input-group input-group-sm mb-3">
              <button
                className="btn btn-outline-secondary border"
                type="button"
                onClick={() => handleDecrement(metric.key)}
                disabled={!metric.enabled || metric.volume <= metric.minimum}
              >
                <HiMinus />
              </button>
              <input
                type="number"
                className="form-control border"
                id={metric.key}
                name={metric.key}
                value={metric.volume}
                // value={metric.minimum}
                disabled={!metric.enabled}
                step={metric.stepping}
                min={metric.minimum}
                max={metric.maximum}
                onChange={handleInputChange}
                onClick={() => handleManualEntry(metric.key)}
              />
              <button
                className="btn btn-outline-secondary border"
                type="button"
                onClick={() => handleIncrement(metric.key)}
                disabled={!metric.enabled || metric.volume >= metric.maximum}
              >
                <HiPlus />
              </button>
            </div>
            <div>
              <span className="p-2">{metric.unit}</span>
              <span className="p-2">
                <PopoverC id={metric.key} content={metric.description} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default IncrementDecrementButtons;

import React from "react";
import PopoverC from "./PopoverC";

const UseCase = ({ useCases, selectedUseCase, handleUseCaseChange }) => {
  return (
    <>
      <h4 className="form-title">Calculate by Use Case</h4>
      {useCases.map((useCase) => (
        <div key={useCase.key} className="form-check mb-2">
          <label htmlFor={useCase.key}>
            <input
              type="radio"
              id={useCase.key}
              className="form-check-input"
              name="useCase"
              value={useCase.key}
              checked={selectedUseCase === useCase.key}
              onChange={handleUseCaseChange}
            />
            {useCase.name}
          </label>
          <PopoverC id={useCase.key} content={useCase.description} />
        </div>
      ))}
    </>
  );
};

export default UseCase;

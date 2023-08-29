import "./App.css";
import React, { useState } from "react";
import DataSizes from "./components/DataSizes";
import jsonData from "./data.json";
import LoadModal from "./components/LoadModal";

function App() {
  // const [selectedUseCase, setSelectedUseCase] = useState("");
  const [selectedHyperscaler, setSelectedHyperscaler] = useState( jsonData.hyperscalers[0] );

  const handleHyperscalerChange = (e) => {
    const selectedHyperscalerKey = e.target.value;
    const selectedHyperscaler = jsonData.hyperscalers.find(
      (hyperscaler) => hyperscaler.key === selectedHyperscalerKey
    );
    setSelectedHyperscaler(selectedHyperscaler);
    // setSelectedHyperscaler(selectedHyperscaler, selectedUseCase);
    // updateInputFields(selectedHyperscaler, selectedUseCase);
  };

  return (
    <>
      <main>
        <DataSizes
          selectedHyperscaler={selectedHyperscaler}
          handleHyperscalerChange={handleHyperscalerChange}
        />
        <LoadModal/>
      </main>
    </>
  );
}

export default App;

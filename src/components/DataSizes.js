import React, { useState, useEffect } from "react";
import Header from "./Header";
import IncrementDecrementButtons from "./IncrementDecrementButtons";
import jsonData from "../data.json";
import awsMemorySteps from "../awsData.json";
import azureMemorySteps from "../azureData.json";
import UseCase from "./UseCase";

const DataSizes = ({ selectedHyperscaler, handleHyperscalerChange }) => {
  const [selectedUseCase, setSelectedUseCase] = useState(jsonData.useCases[0].key);
  const [updatedMetrics, setUpdatedMetrics] = useState(jsonData.metrics);
  const [isManualEntry, setIsManualEntry] = useState(false);
  // const [memoryValues] = useState(memorySteps);
  const [memorySteps, setMemorySteps] = useState([]);

  const totalVolume = updatedMetrics.reduce((total, metric) => total + metric.volume,0);

  useEffect(() => {
    const updateMetrics = () => {
      const metricsData = [...jsonData.metrics];
      if (selectedHyperscaler.key === "azure") {
        const memoryMetric = metricsData.find((metric) => metric.key === "memory");
        if (memoryMetric.enabled) {
          memoryMetric.stepping = 16;
        }
      } else {
        const memoryMetric = metricsData.find((metric) => metric.key === "memory");
        if (memoryMetric.enabled) {
          memoryMetric.stepping = 15;
        }
      }
      setUpdatedMetrics(metricsData);
    };
    updateMetrics();
  }, [selectedHyperscaler]);

  useEffect(() => {
    if (selectedHyperscaler.key === "aws") {
      setMemorySteps(awsMemorySteps);
    } else if (selectedHyperscaler.key === "azure") {
      setMemorySteps(azureMemorySteps);
    }
  }, [selectedHyperscaler]);

  const handleUseCaseChange = (e) => {
    setSelectedUseCase(e.target.value);
    // updateMetricValues(selectedHyperscaler.key, e.target.value);
  };

  const updateInputFields = (selectedUseCase) => {
    const selectedHyperscaler = jsonData.hyperscalers.find(
      (hyperscaler) => hyperscaler.metricValuesByUseCase[selectedUseCase]
    );

    if (selectedHyperscaler) {
      const metricValues =
        selectedHyperscaler.metricValuesByUseCase[selectedUseCase];

      const updatedMetrics = jsonData.metrics.map((metric) => {
        if (metric.key in metricValues) {
          return {
            ...metric,
            volume: metricValues[metric.key],
            // minimum: metricValues[metric.key]
          };
        }
        return metric;
      });
      setUpdatedMetrics(updatedMetrics);
    }
  };

  // useEffect(() => {
  //   updateInputFields(selectedUseCase);
  // }, [selectedUseCase, jsonData]);

  useEffect(() => {
    updateInputFields(selectedUseCase);
  }, [selectedUseCase]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIsManualEntry(true);

    setUpdatedMetrics((prevMetrics) => {
      return prevMetrics.map((metric) => {
        if (metric.key === name) {
          return {
            ...metric,
            volume: parseInt(value, 10),
          };
        }
        return metric;
      });
    });
  };

  useEffect(() => {
    setIsManualEntry(false);
  }, [selectedUseCase]);

  const handleManualEntry = (key) => {
    setSelectedUseCase("manual");
    setUpdatedMetrics((prevMetrics) => {
      return prevMetrics.map((metric) => {
        if (metric.key === key) {
          return {
            ...metric,
            volume: parseInt(metric.volume, 10) || 0,
          };
        }
        return metric;
      });
    });
  };

  // useEffect(() => {
  //   setSelectedUseCase(null);
  // }, [selectedUseCase]);

  const updatedMetricMinMax = (metric) => {
    const metricConfig = jsonData.metrics.find((m) => m.key === metric.key);

    if (metricConfig) {
      const newVolume = Math.min(
        Math.max(metric.volume, metricConfig.minimum),
        metricConfig.maximum
      );
      return { ...metric, volume: newVolume };
    }
    return metric;
  };

  const handleIncrement = (key) => {
    setUpdatedMetrics((prevMetrics) =>
      prevMetrics.map((metric) => {
        if (metric.key === key) {

          if (metric.key === "memory") {
            const currentValue = metric.volume;
            let newValue;

          if (selectedHyperscaler.key === "aws") {
            const currentStepIndex = awsMemorySteps.findIndex(
              (step) => step.memory === currentValue
            );

            if (currentStepIndex === -1) {
              return metric;
            }

            const nextStepIndex = currentStepIndex + 1;
            if (nextStepIndex < awsMemorySteps.length) {
              newValue = awsMemorySteps[nextStepIndex].memory;
              prevMetrics.find((m) => m.key === "compute").volume = awsMemorySteps[nextStepIndex].compute;
              prevMetrics.find((m) => m.key === "storage").volume = awsMemorySteps[nextStepIndex].storage;
            }
          } else if (selectedHyperscaler.key === "azure") {
            const currentStepIndex = azureMemorySteps.findIndex(
              (step) => step.memory === currentValue
            );

            if (currentStepIndex === -1) {
              return metric;
            }

            const nextStepIndex = currentStepIndex + 1;
            if (nextStepIndex < azureMemorySteps.length) {
              newValue = azureMemorySteps[nextStepIndex].memory;
              prevMetrics.find((m) => m.key === "compute").volume = azureMemorySteps[nextStepIndex].compute;
              prevMetrics.find((m) => m.key === "storage").volume = azureMemorySteps[nextStepIndex].storage;
            } else {
              newValue = currentValue;
            }
          }
          // Update metric volume value based on the new step
          return updatedMetricMinMax({ ...metric, volume: newValue });
          } else if (metric.key === "data_lake") {
            const newValue = metric.volume + 1;
            const dataLakeComputeMetric = prevMetrics.find(
              (m) => m.key === "data_lake_compute"
            );
            const dataLakeComputeValue = dataLakeComputeMetric.volume + metric.stepping;
            dataLakeComputeMetric.volume = dataLakeComputeValue;

            return updatedMetricMinMax({ ...metric, volume: newValue });
          } else if (metric.key === "network_transfer") {
            const newValue = metric.volume + metric.stepping;
            return updatedMetricMinMax({ ...metric, volume: newValue });
          }
        }
        return metric;
      })
    );
  };

  const handleDecrement = (key) => {
    setUpdatedMetrics((prevMetrics) =>
      prevMetrics.map((metric) => {
        if (metric.key === key) {

          if (metric.key === "memory") {
            const currentValue = metric.volume;
          let newValue;

          if (selectedHyperscaler.key === "aws") {
            const currentStepIndex = awsMemorySteps.findIndex(
              (step) => step.memory === currentValue
            );

            if (currentStepIndex === -1) {
              return metric;
            }

            const prevStepIndex = currentStepIndex - 1;
            if (prevStepIndex >= 0) {
              newValue = awsMemorySteps[prevStepIndex].memory;
              prevMetrics.find((m) => m.key === "compute").volume = awsMemorySteps[prevStepIndex].compute;
              prevMetrics.find((m) => m.key === "storage").volume = awsMemorySteps[prevStepIndex].storage;
            }
          } else if (selectedHyperscaler.key === "azure") {
            const currentStepIndex = azureMemorySteps.findIndex(
              (step) => step.memory === currentValue
            );

            if (currentStepIndex === -1) {
              return metric;
            }

            const prevStepIndex = currentStepIndex - 1;
            if (prevStepIndex >= 0) {
              newValue = azureMemorySteps[prevStepIndex].memory;
              prevMetrics.find((m) => m.key === "compute").volume = azureMemorySteps[prevStepIndex].compute;
              prevMetrics.find((m) => m.key === "storage").volume = azureMemorySteps[prevStepIndex].storage;
            } else {
              newValue = currentValue; 
            } 
          }
          // Update the specific metric volume value based on the new step
          return updatedMetricMinMax({ ...metric, volume: newValue });
          } else if (metric.key === "data_lake") {
            const newValue = metric.volume - 1;
            const dataLakeComputeMetric = prevMetrics.find(
              (m) => m.key === "data_lake_compute"
            );
            const dataLakeComputeValue = dataLakeComputeMetric.volume - metric.stepping;
            dataLakeComputeMetric.volume = dataLakeComputeValue;

            return updatedMetricMinMax({ ...metric, volume: newValue });
          } else if (metric.key === "network_transfer") {
            const newValue = metric.volume - metric.stepping;
            return updatedMetricMinMax({ ...metric, volume: newValue });
            }
          }
        return metric;
      })
    );
  };

  // Update metric values based on the selected hyperscaler and use case
  useEffect(() => {
    updateMetricValues(selectedHyperscaler.key, selectedUseCase);
  }, [selectedHyperscaler, selectedUseCase]);

  // Update memory, data_lake, and network_transfer fields based on the selected usecase
  const updateMetricValues = (hyperscalerKey, useCaseKey) => {
    let metricValues;
    if (hyperscalerKey === "aws") {
      metricValues = jsonData.hyperscalers.find((h) => h.key === hyperscalerKey)
        .metricValuesByUseCase[useCaseKey];
    } else if (hyperscalerKey === "azure") {
      const azureHyperscaler = jsonData.hyperscalers.find(
        (h) => h.key === hyperscalerKey
      );
      if (
        azureHyperscaler &&
        azureHyperscaler.metricValuesByUseCase[useCaseKey]
      ) {
        metricValues = azureHyperscaler.metricValuesByUseCase[useCaseKey];
      }
    }

    setUpdatedMetrics((prevMetrics) => {
      return prevMetrics.map((metric) => {
        const updatedMetric = { ...metric };

        if (metric.key === "memory") {
          updatedMetric.volume = metricValues.memory || 0;
        } else if (metric.key === "data_lake") {
          updatedMetric.volume = metricValues.data_lake || 0;
        } else if (metric.key === "network_transfer") {
          updatedMetric.volume = metricValues.network_transfer || 0;
        }
        return updatedMetric;
      });
    });
  };

  return (
    <>
      <Header
        totalVolume={totalVolume}
        selectedHyperscaler={selectedHyperscaler}
        handleHyperscalerChange={handleHyperscalerChange}
      />
      <section className="border-bottom pt-4 mb-3">
        <div className="container">
          <header>
            <div className="section-title">CONFIGURATION</div>
          </header>
        </div>
      </section>
      <form>
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-12 col-md-6">
              <UseCase
                useCases={jsonData.useCases}
                selectedUseCase={selectedUseCase}
                handleUseCaseChange={handleUseCaseChange}
              />
            </div>
            <div className="col-12 col-md-6">
              <IncrementDecrementButtons
                updatedMetrics={updatedMetrics}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
                handleInputChange={handleInputChange}
                handleManualEntry={handleManualEntry}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default DataSizes;

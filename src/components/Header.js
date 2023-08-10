import React from "react";
import PageHeader from "./PageHeader";
import HeaderTitle from "./HeaderTitle";
import HyperscalerSelect from "./HyperscalerSelect";

function Header({ totalVolume, selectedHyperscaler, handleHyperscalerChange }) {
  return (
    <>
      <header>
        <nav className="navbar navbar-dark border-bottom text-white">
          <div className="container-fluid">
            <div className="row">
              <PageHeader />
            </div>
          </div>
        </nav>
      </header>
      <header className="border-bottom sizing-calc-header">
        <nav className="border-bottom shadow-sm">
          <div className="container-fluid">
            <div className="row">
              <HeaderTitle />
            </div>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="header-content py-4">
              <div>
                <form>
                  <HyperscalerSelect
                    selectedHyperscaler={selectedHyperscaler}
                    handleHyperscalerChange={handleHyperscalerChange}
                  />
                </form>
              </div>
              <div className="capacity-units">
                <p>Total Capacity Units</p>
                <p>
                  <strong>{totalVolume}</strong> per month
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

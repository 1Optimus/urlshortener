import React from 'react';
import { Loader } from "rsuite";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loader">
      <Loader size="lg" content="Redirecting" />
      </div>
    </div>
  );
};

export default LoadingOverlay;

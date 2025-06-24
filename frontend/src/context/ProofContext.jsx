import React, { createContext, useContext, useState } from "react";

const ProofContext = createContext();

export function ProofProvider({ children }) {
  const [sample, setSample] = useState(null);
  const [proof, setProof] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [verified, setVerified] = useState(null);

  // Reset function for cycling demo
  function resetAll() {
    setSample(null);
    setProof(null);
    setPrediction(null);
    setVerified(null);
  }

  return (
    <ProofContext.Provider value={{
      sample, setSample,
      proof, setProof,
      prediction, setPrediction,
      verified, setVerified,
      resetAll
    }}>
      {children}
    </ProofContext.Provider>
  );
}

export function useProof() {
  return useContext(ProofContext);
}

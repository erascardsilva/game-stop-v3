import React, { createContext, useContext, useState } from 'react';

const ChildNameContext = createContext();

export const useChildName = () => {
  const context = useContext(ChildNameContext);
  if (context === undefined) {
    throw new Error('useChildName must be used within a ChildNameProvider');
  }
  return context;
};

export const ChildNameProvider = ({ children }) => {
  const [childName, setChildName] = useState('');

  return (
    <ChildNameContext.Provider value={{ childName, setChildName }}>
      {children}
    </ChildNameContext.Provider>
  );
};
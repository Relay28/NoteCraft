import React, { createContext, useState } from 'react';

// Create the context
export const PersonalInfoContext = createContext();

// Provider component
export const PersonalInfoProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState(null); // You can initialize this with default values if needed

  return (
    <PersonalInfoContext.Provider value={{ personalInfo, setPersonalInfo }}>
      {children}
    </PersonalInfoContext.Provider>
  );
};

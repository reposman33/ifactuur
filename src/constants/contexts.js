// Create and export all contexts used in this application
import React from "react";

// API to persist stuff in any way...
export const PersistenceContext = React.createContext();
export const PersistenceContextProvider = PersistenceContext.Provider;
export const PersistenceContextConsumer = PersistenceContext.Consumer;

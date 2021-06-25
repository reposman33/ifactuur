import React from "react";

// Context API to persist data when switching between tabs. For now only SessionStorage is supported.
export const PersistenceContext = React.createContext();
export const PersistenceContextProvider = PersistenceContext.Provider;

export const PersistenceContextConsumer = (Component) => ({...props}) => 
<PersistenceContext.Consumer>
  {(value) => <Component storage={value} {...props} />}
</PersistenceContext.Consumer>;

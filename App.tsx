import React from "react";
import Navigation from "~/Navigation/Navigation";
import { ContextProvider } from "~/Components/ContextProvider";

const App = () => {
  return (
    <ContextProvider>
      <Navigation />
    </ContextProvider>
  );
};

export default App;

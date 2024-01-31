import React from 'react';

import { Provider } from 'react-redux';

import { ConfigModules } from '~/Config/configModules';
import MainContextEffects from '~/Context/MainContextEffects';
import { ContextProvider } from '~/Context/MainContextProvider';
import { store } from '~/Context/ReduxStore/Store';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <Provider store={store}>
      <ContextProvider>
        <MainContextEffects>
              <Navigation />
        </MainContextEffects>
      </ContextProvider>
    </Provider>
  );
}

export default App;

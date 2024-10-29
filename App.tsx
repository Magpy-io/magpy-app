import React from 'react';
import { StatusBar } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { LoadingScreenContextProvider } from '~/Components/CommonComponents/LoadingScreen/LoadingScreenContext';
import { PopupMessageModalContextProvider } from '~/Components/CommonComponents/PopupMessageModal/PopupMessageModalContext';
import { ConfigModules } from '~/Config/configModules';
import { ThemeContextProvider } from '~/Context/Contexts/ThemeContext';
import { GlobalContexts } from '~/Context/GlobalContexts';
import { GlobalEffects } from '~/Context/GlobalEffects';
import { store } from '~/Context/ReduxStore/Store';
import { LOG } from '~/Helpers/Logging/Logger';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  LOG.info('App starting');
  ConfigModules();
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeContextProvider>
          <LoadingScreenContextProvider>
            <GlobalContexts>
              <GlobalEffects>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <PopupMessageModalContextProvider>
                    <StatusBar backgroundColor={'transparent'} translucent />
                    <Navigation />
                    <Toast />
                  </PopupMessageModalContextProvider>
                </GestureHandlerRootView>
              </GlobalEffects>
            </GlobalContexts>
          </LoadingScreenContextProvider>
        </ThemeContextProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;

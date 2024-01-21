import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '~/Context/AuthContext';
import { ContextProvider } from '~/Context/ContextProvider';
import { ServerClaimProvider } from '~/Context/ServerClaimContext';
import { ServerProvider } from '~/Context/ServerContext';
import { ConfigModules } from '~/Global/configModules';
import Navigation from '~/Navigation/Navigation';

function App(): React.JSX.Element {
  ConfigModules();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ServerClaimProvider>
          <ServerProvider>
            <ContextProvider>
              <SafeAreaProvider>
                <Navigation />
              </SafeAreaProvider>
            </ContextProvider>
          </ServerProvider>
        </ServerClaimProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;

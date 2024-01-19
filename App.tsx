import React from 'react';
import {ContextProvider} from '~/Components/ContextProvider';
import {AuthProvider} from '~/Context/AuthContext';
import {ServerClaimProvider} from '~/Context/ServerClaimContext';
import {ServerProvider} from '~/Context/ServerContext';
import {ConfigModules} from '~/Global/configModules';
import Navigation from '~/Navigation/Navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
/*  Import + Object.assign
 *  Fix for error : "Error: Requiring module "src/Helpers/BackendQueries/index.ts", which threw an exception: ReferenceError: Property 'TextEncoder' doesn't exist, js engine: hermes"
 *  the syntax 'export * as Package from "path/to/package"' is not recognised
 *  After adding this code, problem was fixed
 */
const TextEncodingPolyfill = require('text-encoding');
const BigInt = require('big-integer');
Object.assign(global, {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
    BigInt: BigInt,
});

const App = () => {
    ConfigModules();
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <AuthProvider>
                <ServerClaimProvider>
                    <ServerProvider>
                        <ContextProvider>
                            <Navigation />
                        </ContextProvider>
                    </ServerProvider>
                </ServerClaimProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
};

export default App;

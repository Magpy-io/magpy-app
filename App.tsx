import React from 'react';
import {ContextProvider} from '~/Components/ContextProvider';
import {AuthProvider} from '~/Context/AuthContext';
import {ServerProvider} from '~/Context/ServerContext';
import {ConfigModules} from '~/Global/configModules';
import Navigation from '~/Navigation/Navigation';

const App = () => {
    ConfigModules();
    return (
        <AuthProvider>
            <ServerProvider>
                <ContextProvider>
                    <Navigation />
                </ContextProvider>
            </ServerProvider>
        </AuthProvider>
    );
};

export default App;

import React from 'react';
import Navigation from '~/Navigation/Navigation';
import {ContextProvider} from '~/Components/ContextProvider';
import {ConfigModules} from '~/Global/configModules';
import {AuthProvider} from '~/Components/AuthContext';

const App = () => {
    ConfigModules();
    return (
        <AuthProvider>
            <ContextProvider>
                <Navigation />
            </ContextProvider>
        </AuthProvider>
    );
};

export default App;

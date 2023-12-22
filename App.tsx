import React from 'react';
import Navigation from '~/Navigation/Navigation';
import {ContextProvider} from '~/Components/ContextProvider';
import {ConfigModules} from '~/Global/configModules';

const App = () => {
    ConfigModules();
    return (
        <ContextProvider>
            <Navigation />
        </ContextProvider>
    );
};

export default App;

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';
//Screens
import LoginScreen from '~/Navigation/Screens/LoginScreen';
import PhotoGalleryLocalScreen from '~/Navigation/Screens/PhotoGalleryLocalScreen';
import PhotoGalleryServerScreen from '~/Navigation/Screens/PhotoGalleryServerScreen';
import ServerSelectScreen from '~/Navigation/Screens/ServerSelectScreen';
import TestScreen from '~/Navigation/Screens/Test';

import type {NavigatorScreenParams} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from './Screens/RegisterScreen';

const Drawer = createDrawerNavigator();

const LoginStack = createNativeStackNavigator();

function LoginStackNavigator() {
    return (
        <LoginStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <LoginStack.Screen name="Login" component={LoginScreen} />
            <LoginStack.Screen name="Register" component={RegisterScreen} />
        </LoginStack.Navigator>
    );
}

const Navigation = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="ServerSelectScreen">
                <Drawer.Screen name="Server" component={PhotoGalleryServerScreen} />
                <Drawer.Screen name="Local" component={PhotoGalleryLocalScreen} />
                <Drawer.Screen name="ServerSelectScreen" component={ServerSelectScreen} />
                <Drawer.Screen name="Test" component={TestScreen} />
                <Drawer.Screen name="LoginStackNavigator" component={LoginStackNavigator} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export type RootStackParamList = {
    Home: NavigatorScreenParams<LocalStackParamList>;
};

export type LocalStackParamList = {
    LocalPage: undefined;
};

export default Navigation;

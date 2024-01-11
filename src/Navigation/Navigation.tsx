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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {appColors, colors} from '~/styles/colors';

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
            <LoginStack.Screen name="ServerSelect" component={ServerSelectScreen} />
        </LoginStack.Navigator>
    );
}

const HomeStack = createNativeStackNavigator();
function HomeStackNavigator() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <HomeStack.Screen name="Local" component={PhotoGalleryLocalScreen} />
            <HomeStack.Screen name="RegisterScreen" component={RegisterScreen} />
        </HomeStack.Navigator>
    );
}

const ServerStack = createNativeStackNavigator();
function ServerStackNavigator() {
    return (
        <ServerStack.Navigator screenOptions={{headerShown: false}}>
            <ServerStack.Screen name="ServerScreen" component={PhotoGalleryServerScreen} />
        </ServerStack.Navigator>
    );
}

const SettingsStack = createNativeStackNavigator();
function SettingsStackNavigator() {
    return (
        <SettingsStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <SettingsStack.Screen name="Test" component={TestScreen} />
        </SettingsStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName = 'home-outline';
                    if (route.name === 'Home') {
                        iconName = focused ? 'home-sharp' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings-sharp' : 'settings-outline';
                    } else if (route.name === 'Server') {
                        iconName = focused ? 'server-sharp' : 'server-outline';
                    }
                    return <Icon name={iconName} type="ionicon" size={size} color={color} />;
                },
                tabBarActiveTintColor: appColors.PRIMARY,
                tabBarInactiveTintColor: colors.LIGHT_GREEN,
                tabBarStyle: {height: 120, paddingTop: 8},
                tabBarLabelStyle: {fontSize: 10, paddingBottom: 12, fontWeight: 'bold'},
                headerShown: false,
            })}>
            <Tab.Screen name="Server" component={ServerStackNavigator} />
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Settings" component={SettingsStackNavigator} />
        </Tab.Navigator>
    );
}

const Navigation = () => {
    const isSignedIn = true;
    return (
        <NavigationContainer>
            {isSignedIn ? <TabNavigator /> : <LoginStackNavigator />}
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

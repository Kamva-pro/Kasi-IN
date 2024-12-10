// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './components/login';
import RegisterScreen from './components/register';
import HomePage from './components/home';
import BusinessProfile from './components/profile';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name='Home' component={HomePage} />
        <Stack.Screen name='Profile' component={BusinessProfile} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

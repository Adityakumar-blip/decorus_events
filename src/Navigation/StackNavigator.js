import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../Screens/Public/LoginScreen';
import BottomNavigation from './BottomNavigation';
import ChatRoom from '../Screens/Private/Chat/ChatRoom';
import SplashScreen from '../Screens/Public/SplashScreen';
import LoginWithEmail from '../Screens/Public/LoginWithEmail';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginWithEmail"
        component={LoginWithEmail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

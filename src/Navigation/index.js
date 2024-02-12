import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import StackNavigator from './StackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {GetUser, setSession} from '../Utils/Slices/AuthSlice';

const Index = () => {
  const [initializing, setInitializing] = useState(true);

  const dispatch = useDispatch();
  const {session} = useSelector(({AuthSlice}) => AuthSlice);

  // Handle user state changes
  function onAuthStateChanged(user) {
    if (initializing) setInitializing(false);
    dispatch(GetUser(user?.uid));
    dispatch(setSession(user));
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      console.log('AUTH STATE', user);
      onAuthStateChanged(user);
    });
    return subscriber;
  }, []);

  console.log('Session', session);

  return (
    <NavigationContainer>
      {session ? <BottomNavigation /> : <StackNavigator />}
    </NavigationContainer>
  );
};

export default Index;

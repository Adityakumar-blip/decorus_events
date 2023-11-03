import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Platform, PermissionsAndroid} from 'react-native';

import LoginScreen from '../Screens/Public/LoginScreen';
import CreateBill from '../Screens/Private/Bills/Bill';
import Teams from '../Screens/Private/Teams/Teams';
import Payment from '../Screens/Private/Payments/Payment';
import Invoice from '../Screens/Private/Invoice/Invoice';
import Profile from '../Screens/Private/Profile/Profile';
import ChatRoom from '../Screens/Private/Chat/ChatRoom';
import {useSelector} from 'react-redux';
import Contact from '../Screens/Private/Contact/Contact';
import Group from '../Screens/Private/Contact/Group';
import GroupDescription from '../Screens/Private/Chat/GroupDescription';
import ImagePreview from '../Components/ImagePreview';
import BankDetails from '../Screens/Private/Profile/BankDetails';
import FileDecoder from '../Components/QrCoderReader';
import CreateSlips from '../Screens/Private/Salary Slips/SalarySlip';
import Checkout from '../Components/Checkout';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const {user} = useSelector(({AuthSlice}) => AuthSlice);
  const isAuth = user?._data?.isApproved;
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="/" component={TabStack} />
      <Stack.Screen name="ChatScreen" component={ChatRoom} />
      <Stack.Screen name="Contacts" component={Contact} />
      <Stack.Screen name="Group" component={Group} />
      <Stack.Screen name="Description" component={GroupDescription} />
      <Stack.Screen name="Preview" component={ImagePreview} />
      <Stack.Screen name="Bank" component={BankDetails} />
      <Stack.Screen name="Decode" component={FileDecoder} />
      <Stack.Screen name="Checkout" component={Checkout} />
    </Stack.Navigator>
  );
}
const TabStack = ({navigation, route}) => {
  const {user} = useSelector(({AuthSlice}) => AuthSlice);

  useEffect(() => {
    const requestMediaPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Decorus Needs Media Permission',
              message: 'Decorus needs access to your camera ',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the media');
          } else {
            console.log('Media permission denied');
          }
        } else if (Platform.OS === 'ios') {
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestMediaPermission();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarLabelStyle: {fontSize: 13, fontWeight: '400', color: 'white'},
        tabBarStyle: {height: 60, backgroundColor: '#6485FF'},
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'Team') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Payment') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Invoice') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Salary Slips') {
            iconName = focused ? 'cash' : 'cash-outline';
          }
          console.log(size, color);

          const validIconName = iconName || 'home';
          return (
            <Ionicons
              name={validIconName}
              size={size}
              color={'white'}
              // style={{borderTopWidth: focused ? 2 : 0, borderTopColor: 'white'}} // Show white top border on active tab
            />
          );
        },
      })}>
      <Tab.Screen
        name="Team"
        component={Teams}
        options={{
          headerShown: false,
        }}
      />
      {user?.role === 'admin' && (
        <>
          <Tab.Screen
            name="Payment"
            component={Payment}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Invoice"
            component={CreateBill}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Salary Slips"
            component={CreateSlips}
            options={{headerShown: false}}
          />
        </>
      )}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

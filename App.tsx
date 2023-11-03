import React , {useEffect} from 'react';
import {StyleSheet, Text, View , Platform , PermissionsAndroid} from 'react-native';
import Index from './src/Navigation';
import {Provider} from 'react-redux';
import store from './src/Utils/Store/Store';

export default function App() {
  useEffect(() => {
    const requestMediaPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);
          if (
            granted['android.permission.CAMERA'] === 'granted' &&
            granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          ) { 
            console.log("Permission granted")
          } else {
            console.log('Permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // For iOS, you don't need to request permissions.
       
      }
    };

    requestMediaPermission();
  }, []);
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

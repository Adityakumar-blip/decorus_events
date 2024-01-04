import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Index from './src/Navigation';
import {Provider} from 'react-redux';
import store from './src/Utils/Store/Store';
import {requestMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default function App() {
  useEffect(() => {
    const requestMediaPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const result = await requestMultiple([
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          ]);

          if (
            result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED &&
            result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ===
              RESULTS.GRANTED &&
            result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
              RESULTS.GRANTED
          ) {
            console.log('Permission granted');
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

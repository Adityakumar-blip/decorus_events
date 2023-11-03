import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fontPixel, heightPixel, widthPixel} from '../Utils/constants';
import useImagePicker from '../Components/useImagePicker';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

export default function MessageInput({
  value,
  onChange,
  roomPath,
  headerName,
  members,
  imageUrl,
}) {
  const [fileUri, setFilePath] = useState('');

  console.log('MESSAGE INPUT HEADER', headerName);

  const {choose, clearFile, filePath} = useImagePicker();

  console.log('image file path', filePath);

  const navigation = useNavigation();

  const checkAndRequestPermissions = async () => {
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
          launchNativeImageLibrary();
        } else {
          console.log('Permission denied.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // For iOS, you don't need to request permissions.
      launchNativeImageLibrary();
    }
  };

  const launchNativeImageLibrary = () => {
    console.log('heree');
    try {
      let options = {
        includeBase64: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const source = {uri: response.assets.uri};
          setFilePath(response.assets[0].uri);
          navigation.navigate('Preview', {
            fileUri: response.assets[0].uri,
            path: roomPath,
            headerName,
            members,
            imageUrl,
            type: 'send',
          });
        }
      });
    } catch (error) {
      console.error(
        'An error occurred during image selection and navigation:',
        error,
      );
    }
  };

  return (
    <View style={styles.Container}>
      <TextInput
        value={value}
        style={styles.TextInputContainer}
        placeholder="Enter Your Message"
        placeholderTextColor={'grey'}
        onChange={text => onChange && onChange(text?.nativeEvent?.text)}
      />
      <TouchableOpacity onPress={() => launchNativeImageLibrary()}>
        <Image source={require('../Assets/Images/Camera_1.png')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: widthPixel(130),
    height: heightPixel(80),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextInputContainer: {
    width: widthPixel(150),
    height: heightPixel(80),
    fontSize: fontPixel(30),
    letterSpacing: 0.5,
    color: 'black',
  },
});

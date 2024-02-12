import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  NativeModules,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {fontPixel, heightPixel, widthPixel} from '../Utils/constants';
import useImagePicker from '../Components/useImagePicker';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {QRreader} from 'react-native-qr-decode-image-camera';
import RNFS from 'react-native-fs';
import {BottomSheet} from 'react-native-btr';

export default function MessageInput({
  value,
  onChange,
  roomPath,
  headerName,
  members,
  imageUrl,
}) {
  const [fileUri, setFilePath] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  console.log('MESSAGE INPUT HEADER', headerName);

  const {choose, clearFile, filePath, capture} = useImagePicker();

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

          const fileUri = response.assets[0].uri;

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

  const handleOpenCamera = async () => {
    try {
      console.log('hereee');
      capture('photo');
    } catch (error) {
      console.log('Camera error', error);
    }
  };

  console.log('filepath', filePath);

  useEffect(() => {
    if (filePath) {
      navigation.navigate('Preview', {
        fileUri: filePath.assets[0].uri,
        path: roomPath,
        headerName,
        members,
        imageUrl,
        type: 'send',
      });
    }
  }, [filePath]);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
      }}>
      <View style={styles.Container}>
        <TextInput
          value={value}
          style={styles.TextInputContainer}
          placeholder="Enter Your Message"
          placeholderTextColor={'grey'}
          onChange={text => onChange && onChange(text?.nativeEvent?.text)}
        />

        <BottomSheet
          visible={bottomSheetVisible}
          onBackButtonPress={() => setBottomSheetVisible(false)}
          onBackdropPress={() => setBottomSheetVisible(false)}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity onPress={() => launchNativeImageLibrary()}>
              <Image source={require('../Assets/Images/image.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOpenCamera()}>
              <Image source={require('../Assets/Images/camera_2.png')} />
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
      <TouchableOpacity
        onPress={() => setBottomSheetVisible(true)}
        style={{position: 'absolute', right: -60}}>
        <Image
          height={10}
          width={10}
          source={require('../Assets/Images/attach-file.png')}
        />
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
    height: heightPixel(90),
    fontSize: fontPixel(30),
    letterSpacing: 0.5,
    color: 'black',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 45,
    height: 150,
  },
  bottomSheetOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  bottomSheetOptionText: {
    fontSize: 18,
    color: 'black',
  },
});

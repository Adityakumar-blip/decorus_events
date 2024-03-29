import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert, // Import ActivityIndicator for loader
} from 'react-native';
import storage from '@react-native-firebase/storage';
import useImagePicker from './useImagePicker';
import {useSelector} from 'react-redux';
import {isURL} from '../Utils/constants';
import DeviceInfo from 'react-native-device-info';

export default function ImageC({source, style, imageStyle, onChange, ...rest}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const {session} = useSelector(({AuthSlice}) => AuthSlice);
  const {choose, clearFile, filePath} = useImagePicker();

  const uploadImage = async () => {
    try {
      const {uri} = filePath;
      const filename = `${session?.uid}_${Date.now()}`;
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      setUploading(true);
      setTransferred(0);

      const task = storage().ref(`groups/${filename}`).putFile(uploadUri);
      // set progress state
      task.on('state_changed', snapshot => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
      });

      try {
        await task;
        onChange(`groups/${filename}`);
        clearFile();
        Alert.alert('Success', 'Image uploaded successfully!');
      } catch (e) {
        Alert.alert('Error', 'Error uploading image');
      } finally {
        setUploading(false);
        setImage(null);
      }
    } catch (error) {
      console.error('UPLOAD ERROR', error);
    }
  };

  useEffect(() => {
    const requestMediaPermission = async () => {
      try {
        const API_LEVEL = await DeviceInfo.getApiLevel();
        if (Platform.OS === 'android' && API_LEVEL < 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Decorus App Needs Media Permission',
              message: 'Decorus App needs access to your media ',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if (filePath && filePath.uri) {
              await uploadImage();
            }
            console.log('You can use the media');
          } else {
            console.log('Media permission denied');
          }
        } else {
          if (filePath && filePath.uri) {
            await uploadImage();
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    requestMediaPermission();
  }, [filePath?.uri]);

  useEffect(() => {
    if (source) {
      if (isURL(source)) {
        setImageUrl(source);
      } else {
        storage()
          .ref('/' + source)
          .getDownloadURL()
          .then(url => {
            setImageUrl(url);
            onChange(url);
          })
          .catch(e => console.log('Errors while downloading => ', e));
      }
    }
  }, [source]);

  return (
    <TouchableOpacity
      onPress={() => {
        choose('photo');
      }}>
      <View style={[style, ImageStyle.ProfileImageView]}>
        <Image
          style={ImageStyle.ImageProfile}
          source={
            filePath ? {uri: filePath?.uri} : imageUrl ? {uri: imageUrl} : ''
          }
          {...rest}
        />
        {uploading && (
          <ActivityIndicator
            style={ImageStyle.loader}
            size="large"
            color="#4287f5"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const ImageStyle = StyleSheet.create({
  ProfileImageView: {
    height: 60,
    width: 60,
    borderColor: '#4287f5',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderRadius: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cancleIcon: {
    position: 'absolute',
    top: 2,
    right: 5,
    zIndex: 1,
  },
  ImageProfile: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
  },
});

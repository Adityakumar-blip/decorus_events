import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator for loader
} from 'react-native';
import storage from '@react-native-firebase/storage';
import useImagePicker from './useImagePicker';
import {useSelector} from 'react-redux';
import {isURL} from '../Utils/constants';

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
        ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
      } catch (e) {
        console.error('Error uploading image:', e);
        ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
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
            if (filePath && filePath.uri) {
              await uploadImage();
            }
            console.log('You can use the media');
          } else {
            console.log('Media permission denied');
          }
        } else if (Platform.OS === 'ios') {
          if (filePath && filePath.uri) {
            await uploadImage();
          }
        }
      } catch (err) {
        console.warn(err);
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
            console.log('FETCHED', url);
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

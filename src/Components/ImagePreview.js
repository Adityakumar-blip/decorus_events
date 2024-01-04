import {
  SafeAreaView,
  TouchableOpacity,
  View,
  NativeModules,
  LayoutAnimation,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  ScrollView,
  PermissionsAndroid,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {firebase} from '@react-native-firebase/storage';
import useImagePicker from '../Components/useImagePicker';
import {useState} from 'react';
import ImagePreviewStyle from '../Utils/Styles/ImagePreviewStyle';
import {SendMessageByRoom} from '../Utils/Slices/ChatSlice';
import RNQRGenerator from 'rn-qr-generator';
import {useEffect} from 'react';
import {fontPixel, heightPixel, widthPixel} from '../Utils/constants';

const ImagePreview = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {clearFile} = useImagePicker();
  const {session, user} = useSelector(({AuthSlice}) => AuthSlice);
  const [paused, setPaused] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [imageText, setImageText] = useState('');

  console.log('ROUTE PARAMS IN HEADER', route?.params);

  const roomPath = route?.params?.path;
  const header = route?.params?.headerName;
  const membersCount = route?.params?.members;
  const type = route?.params?.type;
  const mediaType = route?.params?.mediaType;

  console.log('HEADER', header);

  // const Decode = () => {
  //   RNQRGenerator.detect({
  //     uri: route.params.fileUri,
  //   })
  //     .then(response => {
  //       const {values} = response;
  //       console.log('Decoded result', response);
  //     })
  //     .catch(error => console.log('Cannot detect QR code in image', error));
  // };

  // useEffect(() => {
  //   Decode();
  // }, [route.params.fileUri]);

  const handleSendImage = url => {
    const messageObj = {
      message: url,
      imgMessage: imageText ? imageText : '',
      senderId: user?.userId,
      image: user?.image ? user?.image : '',
      fullName: user?.fullName,
      roomPath,
      mediaType: 'image',
    };

    dispatch(SendMessageByRoom(messageObj)).then(() => {
      navigation.navigate('ChatScreen', {
        path: roomPath,
        header,
        membersCount,
      });
    });
    clearFile();
  };

  const handleImageUpload = async () => {
    try {
      const {fileUri} = route?.params;
      const filename = `${session?.uid}_${Date.now()}`;
      const uploadUri =
        Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;

      const task = storage().ref(`chat/${filename}`).putFile(uploadUri);
      try {
        await task;
        var storage1 = firebase.storage();
        const url = `chat/${filename}`;
        var imageRef = storage1.ref().child(url);
        imageRef
          .getDownloadURL()
          .then(function (url) {
            handleSendImage(url);
          })
          .catch(function (error) {
            console.log('chat image error', error);
          });
      } catch (e) {
        console.error(e);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const toggleIcon = () => {
    setShowIcon(!showIcon);
  };

  const handleBuffer = buffer => {
    console.log('buffer', buffer);
  };

  return (
    <View style={ImagePreviewStyle.PreviewM}>
      <View style={ImagePreviewStyle.PreviewH}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../Assets/Images/back_icon.png')} />
        </TouchableOpacity>
        <Text style={{color: 'white'}}>{header}</Text>

        <Text></Text>
      </View>
      <View>
        <Image
          source={{
            uri: route.params.fileUri,
          }}
          style={ImagePreviewStyle.PreviewImg}
        />
      </View>
      <View style={ImagePreviewStyle.SendM}>
        {type === 'send' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              height: 50,
            }}>
            <TextInput
              placeholder="Amount"
              placeholderTextColor={'grey'}
              style={styles.TextInputContainer}
              onChange={text => setImageText(text?.nativeEvent?.text)}
            />
            <TextInput
              placeholder="Remarks"
              placeholderTextColor={'grey'}
              style={styles.TextInputContainer}
              onChange={text => setImageText(text?.nativeEvent?.text)}
            />
            <TouchableOpacity
              onPress={() => handleImageUpload()}
              style={ImagePreviewStyle.SendB}>
              <Text style={ImagePreviewStyle.SendT}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(100px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 40,
    color: 'white',
    fontSize: 24,
    cursor: 'pointer',
  },
  TextInputContainer: {
    width: '35%',
    height: heightPixel(110),
    fontSize: fontPixel(30),
    letterSpacing: 0.5,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
  },
});
export default ImagePreview;

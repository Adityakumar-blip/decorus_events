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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {firebase} from '@react-native-firebase/storage';
import useImagePicker from '../Components/useImagePicker';
import {useState} from 'react';
import ImagePreviewStyle from '../Utils/Styles/ImagePreviewStyle';
import {SendMessageByRoom} from '../Utils/Slices/ChatSlice';

const ImagePreview = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {clearFile} = useImagePicker();
  const {session, user} = useSelector(({AuthSlice}) => AuthSlice);
  const [paused, setPaused] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  console.log('ROUTE PARAMS IN HEADER', route?.params);

  const roomPath = route?.params?.path;
  const header = route?.params?.headerName;
  const membersCount = route?.params?.members;
  const type = route?.params?.type;
  const mediaType = route?.params?.mediaType;

  console.log('HEADER', header);

  const handleSendImage = url => {
    const messageObj = {
      message: url,
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

  const handleImageUplaod = async () => {
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
          <TouchableOpacity
            onPress={() => handleImageUplaod()}
            style={ImagePreviewStyle.SendB}>
            <Text style={ImagePreviewStyle.SendT}>Send</Text>
          </TouchableOpacity>
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
});
export default ImagePreview;

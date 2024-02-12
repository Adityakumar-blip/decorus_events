import React, {useRef, useState, useEffect} from 'react';
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
  Animated,
  Alert,
  Button,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ChatStyle from '../../../Utils/Styles/ChatStyle';
import {heightPixel, isURL} from '../../../Utils/constants';
import MessageInput from '../../../Components/MessageInput';
import TabHeader from '../../../Components/TabHeader';
import firestore from '@react-native-firebase/firestore';
import ChatMessageWithCallout from '../../../Components/MessageCallout';
import {SendMessageByRoom} from '../../../Utils/Slices/ChatSlice';
// import FileDecoder from '../../../Components/QrCoderReader';
import {BottomSheet} from '../../../Components/UPIFound';
// import RNQRGenerator from 'rn-qr-generator';
import {CameraKitCamera} from 'react-native-camera-kit';
import RNFS from 'react-native-fs';
import CheckBox from '@react-native-community/checkbox';
import {PaymentsByRoom} from '../../../Utils/Slices/ExpenseSlice';
import RNFetchBlob from 'rn-fetch-blob';
// import ReactNativeBlobUtil from 'react-native-blob-util';

export default function ChatRoom(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const flatlistRef = useRef();

  //STATESFLAG
  const [isLastMessageAvailable, setIsLastMessageAvailable] = useState(false);
  const [isMediaFile, setIsMediaFile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [fileUri, setFileUri] = useState('');
  const [isStartRecording, setStartRecording] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [isSelected, setSelection] = useState(false);
  const bounceValue = useRef(new Animated.Value(150)).current;

  const {user, session} = useSelector(({AuthSlice}) => AuthSlice);
  // const {capture, filePath, clearFile} = useImagePicker();

  // useEffect(() => {
  //   const values = {
  //     roomPath,
  //     userId: user?.userId,
  //   };
  //   dispatch(GetDefinedMessages());
  //   dispatch(MarkMessageAsRead(values));
  // }, []);

  //STATE
  const [Message, setMessage] = useState('');

  //ANIMATION
  const {UIManager} = NativeModules;
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

  //getHeaderName
  const HeaderName = props?.route?.params?.header;
  const roomPath = props?.route?.params?.path;
  const members = props?.route?.params?.membersCount;
  const item = props?.route?.params?.item;
  const imageUrl = props?.route?.params?.imageUrl;
  // const group = props?.route?.params?.group;

  //onBackPress()
  const onBackPress = () => {
    navigation.goBack();
  };

  // ** handling capture image
  const handleOpenCamera = async () => {
    try {
      capture('photo');
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (filePath) {
  //     props.navigation.navigate(ScreenName.ImagePreview, {
  //       fileUri: filePath.assets[0].uri,
  //       path: roomPath,
  //       group: group,
  //       type: 'send',
  //       mediaType: filePath.assets[0].type === 'image/jpeg' ? 'image' : 'video',
  //     });
  //   }
  // }, [filePath]);

  // handle text message
  const messageObj = {
    message: Message,
    senderId: user?.userId || '',
    fullName: user?.fullName || '',
    mediaType: 'text',
    roomPath: roomPath,
    groupId: item?.groupId,
  };
  const handleTextMessage = () => {
    if (Message !== '') {
      dispatch(SendMessageByRoom(messageObj));
    } else {
      Alert.alert('Message Error', 'Cannot send empty messages');
    }
    setMessage('');
  };

  // get messages
  const handleGetMessages = async () => {
    try {
      const messageRef = firestore()
        .collection(roomPath)
        .orderBy('createdAt', 'asc');

      const snapshot = await messageRef.get();
      const messages = snapshot?.docs?.map(res => {
        return res.data();
      });

      setMessages(messages);
      handleScrollToBottom();

      messageRef.onSnapshot(snap => {
        const messages = snap?.docs?.map(res => {
          return res.data();
        });
        setMessages(messages);
        handleScrollToBottom();
      });
    } catch (error) {
      console.log('error while fetching messages', error);
    }
  };

  useEffect(() => {
    handleGetMessages();
    // handleScrollToBottom();
  }, []);

  // const handleDownloadImage = async FileUrl => {
  //   // setIsLoader(true);
  //   const {config, fs} = ReactNativeBlobUtil;
  //   const Download = fs?.dirs?.DownloadDir;
  //   return config({
  //     fileCache: true,
  //     indicator: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       path: Download + '/' + 'Image',
  //     },
  //   })
  //     .fetch('GET', FileUrl)
  //     .then(res => {
  //       // setIsLoader(false);
  //       Alert.alert('Success', 'Download successfully.');
  //     })
  //     .catch(error => {
  //       Alert.alert('Success', 'Download error.');
  //     });
  // };

  const renderItem = ({item, index}) => {
    const isEnd = index === messages.length - 1;
    const isImage = isURL(item.text);
    const sender = item?.senderId === user?.userId;
    const isImageType =
      item?.mediaType && item?.mediaType === 'image' ? true : false;
    if (item.isDelete) {
      return null;
    }
    return (
      <View>
        <View style={sender ? ChatStyle.leftChat : ChatStyle.rightChat}>
          <View
            style={
              sender ? ChatStyle.RightMessageView : ChatStyle.LeftMessageView
            }>
            <View>
              <View>
                {!sender && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('UserDetail', {
                          userId: item?.senderId,
                        })
                      }>
                      <Text style={ChatStyle.UserName}>{item?.fullName}</Text>
                    </TouchableOpacity>
                    {item?.mediaType === 'image' && (
                      <TouchableOpacity
                        onPress={() => {
                          handleDownloadImage(item?.message);
                        }}>
                        <Image
                          source={require('../../../Assets/Images/download-black.png')}
                          height={10}
                          width={10}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {item?.mediaType === 'image' ? (
                  <TouchableOpacity onPress={() => ImagePreview(item?.message)}>
                    <Image
                      source={{uri: item?.message}}
                      style={{
                        height: 200,
                        width: 'auto',
                        minWidth: 230,
                        borderRadius: 10,
                        marginTop: 2,
                      }}
                    />
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                        marginTop: 20,
                      }}></View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyItems: 'center',
                        gap: 10,
                      }}>
                      {item?.amount !== null && (
                        <Text style={{color: sender ? 'white' : 'black'}}>
                          Amount: {item?.amount}
                        </Text>
                      )}

                      {item?.remarks && (
                        <Text style={{color: sender ? 'white' : 'black'}}>
                          Remarks: {item?.remarks}
                        </Text>
                      )}

                      {user?.role === 'admin' && item?.amount !== null && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#4287f5',
                            padding: 15,
                            borderRadius: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          disabled={item?.isPaid}
                          onPress={() => {
                            if (item?.amount > 0) {
                              handlePaymentChange({
                                ...item,
                                isPaid: item?.isPaid ? false : true,
                              });
                            } else {
                              Alert.alert('Error', 'Amount is not available');
                            }
                          }}>
                          <Text style={{color: 'white', fontWeight: 600}}>
                            {item?.isPaid ? 'Paid' : 'Mark as paid'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={
                      !sender
                        ? ChatStyle.LeftTextMessage
                        : ChatStyle.TextMessage
                    }>
                    {item.message}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {isEnd && (
          <Image
            source={{uri: item?.image}}
            style={{
              width: 20,
              height: 20,
              borderRadius: 50,
              alignSelf: 'flex-end',
            }}
          />
        )}
      </View>
    );
  };

  const launchNativeImageLibrary = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    onMediaPress();
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets.uri};
        setFileUri(response.assets[0].uri);

        props.navigation.navigate(ScreenName.ImagePreview, {
          fileUri: response.assets[0].uri,
          path: roomPath,
          group: group,
          type: 'send',
        });
      }
    });
  };

  const ImagePreview = file => {
    props.navigation.navigate('ImagePreview', {
      fileUri: file,
      path: roomPath,
      group: item,
      type: 'preview',
      mediaType: 'image',
      headerName: HeaderName,
    });
  };

  const handleScrollToBottom = () => {
    if (flatlistRef.current) {
      flatlistRef?.current?.scrollToEnd({animating: true});
    }
  };

  const hide = () => {
    setShowBottomSheet(false);
  };

  const handlePaymentChange = item1 => {
    try {
      const messagePath = `chats/${item?.groupId}/messages`;

      // Update the document and then get the updated data
      firestore()
        .collection(messagePath)
        .doc(item1?.messageId)
        .update({isPaid: item1?.isPaid})
        .then(() => {
          // Retrieve the updated document
          return firestore()
            .collection(messagePath)
            .doc(item1?.messageId)
            .get();
        })
        .then(updatedDoc => {
          // Access the updated data
          const updatedData = updatedDoc.data();
          console.log('updaated Data', updatedData, item1);
          const paymentPath = `expenses/${item.groupId}`;
          const paymentObj = {
            path: paymentPath,
            item,
            amount: updatedData.amount,
            remarks: item1?.remarks,
            isPaid: item1?.isPaid,
            paidBy: {name: user?.fullName, userId: user?.userId},
          };
          dispatch(PaymentsByRoom(paymentObj));
        })
        .catch(error => {
          console.log('Error retrieving updated data', error);
        });
    } catch (error) {
      console.log('Message updated error', error);
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <TabHeader
          isBackAvailable
          title={HeaderName}
          imageUrl={item?.imageUrl}
          para={`${members} members available`}
          item={item}
          onBackPress={() => onBackPress()}
        />
        <View style={ChatStyle.Container}>
          <View style={ChatStyle.ChatMView}>
            <FlatList
              data={messages}
              ref={flatlistRef}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              // inverted={true}
              // scrollToEnd
            />
          </View>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS == 'ios' ? heightPixel(200) : 0}
            behavior={Platform.OS == 'ios' && 'padding'}
            style={ChatStyle.EnterMView}>
            <View style={ChatStyle.EnterMessageView}>
              <View>
                <MessageInput
                  value={Message}
                  onChange={text => setMessage(text)}
                  roomPath={roomPath}
                  headerName={HeaderName}
                  members={members}
                  imageUrl={imageUrl}
                />
              </View>
            </View>
            <View style={ChatStyle.MediaView}>
              <TouchableOpacity onPress={() => handleTextMessage()}>
                <Image source={require('../../../Assets/Images/Send.png')} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
        <BottomSheet show={showBottomSheet} height={200} onOuterClick={hide} />
      </SafeAreaView>
    </>
  );
}

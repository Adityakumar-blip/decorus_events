import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {HistoryStyles} from '../Utils/Styles/HistoryStyles';
import fileicon from '../Assets/Svg/fileicon.svg';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {GetAllBills} from '../Utils/Slices/ChatSlice';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const BillHistory = ({data}) => {
  const downloadFile = async (url, fileName) => {
    try {
      const fileDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
        toFile: fileDest,
      };

      const downloadResult = await RNFS.downloadFile(options).promise;

      console.log('Download result', downloadResult);

      if (downloadResult.statusCode === 200) {
        Alert.alert('Success', `File downloaded to ${fileDest}`);
      } else {
        Alert.alert('Error', 'Failed to download the file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', error.message);
    }
  };

  const shareFile = async (filePath, fileName) => {
    try {
      const options = {
        title: 'Share File',
        message: `Sharing ${fileName}`,
        url: filePath,
        type: 'application/pdf',
      };

      await Share.open(options);
    } catch (error) {
      Alert.alert('Error', 'Failed to share the file');
    }
  };

  const renderItem = ({item, index}) => {
    console.log('item', item);
    return (
      <View style={HistoryStyles.Bills}>
        <View
          style={{
            backgroundColor: '#6485FF',
            width: 60,
            height: 60,
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../Assets/Images/fileicon.png')}
            height={80}
            width={80}
          />
        </View>
        <View>
          <Text style={HistoryStyles.BillHeading}>{item?.groupName}</Text>
          <Text style={HistoryStyles.BillTime}>1 Oct 2023|12:30 pm</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#6485ff',
            borderRadius: 50,
            width: 35,
            height: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => downloadFile(item?.invoice, item?.groupName)}>
          <Image
            source={require('../Assets/Images/downloads.png')}
            height={10}
            width={10}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#6485ff',
            borderRadius: 50,
            width: 35,
            height: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => shareFile(item?.invoice)}>
          <Image
            source={require('../Assets/Images/share.png')}
            height={10}
            width={10}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      <View style={HistoryStyles.HistoryHead}>
        <Text style={{fontWeight: 600, color: 'black', fontSize: 15}}>
          Recent Bills
        </Text>
        <Text>See All</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default BillHistory;

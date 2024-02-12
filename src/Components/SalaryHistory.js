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
import {GetAllBills, GetAllSalary} from '../Utils/Slices/ChatSlice';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const SalaryHistory = ({data}) => {
  const dispatch = useDispatch();

  const {salaryArray} = useSelector(({ChatSlice}) => ChatSlice);

  useEffect(() => {
    dispatch(GetAllSalary());
  }, []);

  const downloadFile = async (url, fileName) => {
    try {
      const fileDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
        toFile: fileDest,
      };

      const downloadResult = await RNFS.downloadFile(options).promise;

      if (downloadResult.statusCode === 200) {
        Alert.alert('Success', `File downloaded to ${fileDest}`);
      } else {
        Alert.alert('Error', 'Failed to download the file');
      }
    } catch (error) {
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
          <Text style={HistoryStyles.BillHeading}>{item?.PayeeName}</Text>
          <Text style={HistoryStyles.BillTime}>
            {item.createdAt.toDate().toLocaleString()}
          </Text>
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
          onPress={() => downloadFile(item?.slip, item?.PayeeName)}>
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
          onPress={() => shareFile(item?.slip, item?.PayeeName)}>
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
        data={salaryArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default SalaryHistory;

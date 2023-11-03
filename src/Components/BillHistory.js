import React from 'react';
import {View, Text, Image} from 'react-native';
import {HistoryStyles} from '../Utils/Styles/HistoryStyles';
import fileicon from '../Assets/Svg/fileicon.svg';
import Feather from 'react-native-vector-icons/Feather';

const BillHistory = () => {
  return (
    <View>
      <View style={HistoryStyles.HistoryHead}>
        <Text style={{fontWeight: 600, color: 'black', fontSize: 15}}>
          Recent Bills
        </Text>
        <Text>See All</Text>
      </View>
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
          <Text style={HistoryStyles.BillHeading}>Vihar Wedding Event</Text>
          <Text style={HistoryStyles.BillTime}>1 Oct 2023|12:30 pm</Text>
        </View>
        <View
          style={{
            backgroundColor: '#6485ff',
            borderRadius: 50,
            width: 35,
            height: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../Assets/Images/downloads.png')}
            height={10}
            width={10}
          />
        </View>
        <View
          style={{
            backgroundColor: '#6485ff',
            borderRadius: 50,
            width: 35,
            height: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../Assets/Images/share.png')}
            height={10}
            width={10}
          />
        </View>
      </View>
    </View>
  );
};

export default BillHistory;

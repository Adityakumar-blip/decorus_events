import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {BillStyle} from '../../../Utils/Styles/BillStyles';
import BillComponent from '../../../Components/BillComponent';
import BillHistory from '../../../Components/BillHistory';
import SalaryComponent from '../../../Components/SalaryComponent';

const CreateSlips = () => {
  const [activeButton, setActiveButton] = useState('CreateSlips');

  return (
    <ScrollView>
      <View>
        <View style={{padding: 20}}>
          <Text style={BillStyle.BillHeading}>Salary Slips</Text>
        </View>
        <View style={BillStyle.BillTabs}>
          <TouchableOpacity
            onPress={() => setActiveButton('CreateSlips')}
            style={
              activeButton === 'CreateSlips'
                ? {...BillStyle.BillButton, backgroundColor: 'blue', flex: 1}
                : {...BillStyle.BillButton, flex: 1}
            }>
            <Text
              style={
                activeButton === 'CreateSlips'
                  ? {color: 'white', fontWeight: '600'}
                  : {fontWeight: '600', color: 'black'}
              }>
              Create Slips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveButton('billHistory')}
            style={
              activeButton === 'billHistory'
                ? {...BillStyle.BillButton, backgroundColor: 'blue', flex: 1}
                : {...BillStyle.BillButton, flex: 1}
            }>
            <Text
              style={
                activeButton === 'billHistory'
                  ? {color: 'white', fontWeight: '600'}
                  : {fontWeight: '600', color: 'black'}
              }>
              Salary History
            </Text>
          </TouchableOpacity>
        </View>
        {activeButton === 'CreateSlips' ? <SalaryComponent /> : <BillHistory />}
      </View>
    </ScrollView>
  );
};

export default CreateSlips;

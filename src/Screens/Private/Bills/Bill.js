import React, { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { BillStyle } from '../../../Utils/Styles/BillStyles';
import BillComponent from '../../../Components/BillComponent';
import BillHistory from '../../../Components/BillHistory';

const CreateBill = () => {
  const [activeButton, setActiveButton] = useState('createBill');

  return (
    <ScrollView>
      <View>
        <View style={{ padding: 20 }}>
          <Text style={BillStyle.BillHeading}>Billing And Invoice</Text>
        </View>
        <View style={BillStyle.BillTabs}>
          <TouchableOpacity
            onPress={() => setActiveButton('createBill')}
            style={
              activeButton === 'createBill'
                ? { ...BillStyle.BillButton, backgroundColor: 'blue', flex: 1 }
                : { ...BillStyle.BillButton, flex: 1 }
            }>
            <Text
              style={
                activeButton === 'createBill'
                  ? { color: 'white', fontWeight: '600' }
                  : { fontWeight: '600', color: 'black' }
              }>
              Create a Bill
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveButton('billHistory')}
            style={
              activeButton === 'billHistory'
                ? { ...BillStyle.BillButton, backgroundColor: 'blue', flex: 1 }
                : { ...BillStyle.BillButton, flex: 1 }
            }>
            <Text
              style={
                activeButton === 'billHistory'
                  ? { color: 'white', fontWeight: '600' }
                  : { fontWeight: '600', color: 'black' }
              }>
              Bill History
            </Text>
          </TouchableOpacity>
        </View>
        {activeButton === 'createBill' ? <BillComponent /> : <BillHistory />}
      </View>
      </ScrollView>
  );
};

export default CreateBill;

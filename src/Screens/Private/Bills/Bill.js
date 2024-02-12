import React, {useState, useEffect} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {GetAllBills} from '../../../Utils/Slices/ChatSlice';

const CreateBill = ({route}) => {
  const [activeButton, setActiveButton] = useState('createBill');
  const item = route?.params?.item;
  const dispatch = useDispatch();

  const {invoiceArray} = useSelector(({ChatSlice}) => ChatSlice);

  useEffect(() => {
    dispatch(GetAllBills());
  }, []);

  console.log('Invoice array', invoiceArray);
  return (
    <ScrollView>
      <View>
        <View style={{padding: 20}}>
          <Text style={BillStyle.BillHeading}>Billing And Invoice</Text>
        </View>
        <View style={BillStyle.BillTabs}>
          <TouchableOpacity
            onPress={() => setActiveButton('createBill')}
            style={
              activeButton === 'createBill'
                ? {...BillStyle.BillButton, backgroundColor: 'blue', flex: 1}
                : {...BillStyle.BillButton, flex: 1}
            }>
            <Text
              style={
                activeButton === 'createBill'
                  ? {color: 'white', fontWeight: '600'}
                  : {fontWeight: '600', color: 'black'}
              }>
              Create a Bill
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
              Bill History
            </Text>
          </TouchableOpacity>
        </View>
        {activeButton === 'createBill' ? (
          <BillComponent item={item} />
        ) : (
          <BillHistory data={invoiceArray} />
        )}
      </View>
    </ScrollView>
  );
};

export default CreateBill;

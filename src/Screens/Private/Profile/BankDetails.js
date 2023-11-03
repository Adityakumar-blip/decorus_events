import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {BillStyle} from '../../../Utils/Styles/BillStyles';
import {BankStyle} from '../../../Utils/Styles/BankStyles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {UpdateUser} from '../../../Utils/Slices/AuthSlice';

const initialValues = {
  name: '',
  branch: '',
  accountNo: '',
  ifsc: '',
};

const BankDetails = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const bank = route?.params?.bank;

  const showToast = () => {
    ToastAndroid.show('Bank details added successfully', ToastAndroid.LONG);
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: values => {
      setLoading(true);
      dispatch(UpdateUser({bank: {...values}}));
      setLoading(false);
      showToast();
    },
  });

  useEffect(() => {
    if (bank) {
      formik.setFieldValue('name', bank?.name);
      formik.setFieldValue('branch', bank?.branch);
      formik.setFieldValue('accountNo', bank?.accountNo);
      formik.setFieldValue('ifsc', bank?.ifsc);
    }
  }, [bank]);
  return (
    <View style={BankStyle.BankContainer}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../Assets/Images/back_blue.png')} />
        </TouchableOpacity>
        <Text style={{color: '#4369F6', fontSize: 20, fontWeight: '600'}}>
          Bank Details
        </Text>
      </View>
      <View style={{marginTop: 40, marginBottom: 20}}>
        <TextInput
          style={BankStyle.InputFields}
          placeholder="Enter Name"
          onChangeText={formik.handleChange('name')}
          value={formik.values.name}
          placeholderTextColor="#4369F6"
        />
        <TextInput
          style={BankStyle.InputFields}
          placeholder="Enter Branch Name"
          onChangeText={formik.handleChange('branch')}
          value={formik.values.branch}
          placeholderTextColor="#4369F6"
        />
        <TextInput
          style={BankStyle.InputFields}
          placeholder="Enter Account Number"
          onChangeText={formik.handleChange('accountNo')}
          value={formik.values.accountNo}
          placeholderTextColor="#4369F6"
        />
        <TextInput
          style={BankStyle.InputFields}
          placeholder="Enter IFSC Code"
          onChangeText={formik.handleChange('ifsc')}
          value={formik.values.ifsc}
          placeholderTextColor="#4369F6"
        />
      </View>
      <TouchableOpacity
        onPress={() => formik.handleSubmit()}
        style={[BankStyle.DetailsBtn, bank ? {backgroundColor: 'gray'} : null]}
        disabled={!!bank}>
        <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>
          {bank ? 'Details Added' : 'Add Details'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BankDetails;

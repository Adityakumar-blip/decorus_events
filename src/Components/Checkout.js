import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {TeamStyle} from '../Utils/Styles/TeamsStyle';
import {useFormik} from 'formik';
import {Login} from '../Utils/Styles/LoginStyles';

import RazorpayCheckout from 'react-native-razorpay';

const initialValues = {
  upi: '',
  amount: '',
  note: '',
};

const Checkout = () => {
  const handlePayment = values => {
    var options = {
      description: `${values?.note}`,
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_test_dvck550vhkZqt3',
      amount: `${values?.amount}`,
      name: 'Decorus Events',
      order_id: '', //Replace this with an order_id created using Orders API.
      prefill: {
        email: 'gaurav.kumar@example.com',
        contact: '9191919191',
        name: 'Gaurav Kumar',
      },
      theme: {color: '#6583F3'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      handlePayment(values);
    },
  });
  return (
    <View>
      <View style={TeamStyle.TeamHeader}>
        <Text style={{fontSize: 32, fontWeight: '700', color: '#4369F6'}}>
          Checkout
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
        <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <Text style={{color: 'black', fontWeight: '700'}}>UPI ID</Text>
          <TextInput
            style={Login.InputFields}
            name="upi"
            onChangeText={formik.handleChange('upi')}
            value={formik.values.email}
            placeholder="UPI ID"
            placeholderTextColor="black"
          />
        </View>
        <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <Text style={{color: 'black', fontWeight: '700'}}>Amount</Text>
          <TextInput
            style={Login.InputFields}
            name="upi"
            onChangeText={formik.handleChange('amount')}
            value={formik.values.email}
            placeholder="Amount"
            placeholderTextColor="black"
          />
        </View>
        <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <Text style={{color: 'black', fontWeight: '700'}}>Note</Text>
          <TextInput
            style={Login.InputFields}
            name="upi"
            onChangeText={formik.handleChange('note')}
            value={formik.values.email}
            placeholder="Note"
            placeholderTextColor="black"
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#4369F6',
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPress={() => formik.handleSubmit()}>
          <Text style={{color: 'white'}}>Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import {Login} from '../../Utils/Styles/LoginStyles';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import auth from '@react-native-firebase/auth';
import OTPScreen from './OTPScreen';
import {useDispatch} from 'react-redux';
import {UpdateUser} from '../../Utils/Slices/AuthSlice';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmState, setConfirmState] = useState();
  const [loading , setLoading] = useState(false)
  const [isOtp, setIsOtp] = useState('');

  const dispatch = useDispatch();

  const receiveDataFromChild = data => {
    setIsOtp(data);
  };

  const initialValues = {
    fullName: '',
    phoneNo: '',
    email: '',
  };

  const handleOtp = values => {
    setLoading(true)
    try {
      auth()
        .signInWithPhoneNumber(`+91 ${formik.values.phoneNo}`)
        .then(res => {
          setConfirmState(res);
          setLoading(false)
        })
        .catch(error => {
          console.log('sign in error', error);
          setLoading(false)
        });
    } catch (error) {
      console.log('error while signing in', error);
      setLoading(false)
    }
  };

  const handleLogin = async () => {
    try {
      if (confirmState?.confirm) {
        await confirmState?.confirm(isOtp);
        dispatch(UpdateUser(formik.values));
      } else if (confirmProps?.confirm) {
        await confirmProps?.confirm(isOtp);
      }
    } catch (error) {
      console.error('Failed Verification', error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: values => {
      handleOtp(values);
    },
  });

  return (
    <KeyboardAvoidingView behavior="padding" style={Login.LoginContainer}>
      <Image
        source={require('../../Assets/Images/login.png')}
        style={Login.LoginImage}
      />
      {confirmState ? (
        <OTPScreen
          confirmProps={confirmState}
          phoneNumber={formik.values.phoneNo}
          sendDataToParent={receiveDataFromChild}
        />
      ) : (
        <>
          <View style={Login.TextContainer}>
            <Text style={Login.LoginHeading}>Welcome Back</Text>
            <Text style={Login.LoginPara}>
              We missed you. Now, we are happy to see you back again. Let’s sign
              you in.
            </Text>
          </View>
          <TextInput
            style={Login.InputFields}
            name="fullName"
            id="fullName"
            onChangeText={formik.handleChange('fullName')}
            value={formik.values.fullName}
            placeholder="Full Name"
            placeholderTextColor="black"
          />
          <TextInput
            style={Login.InputFields}
            name="phoneNo"
            onChangeText={formik.handleChange('phoneNo')}
            value={formik.values.phoneNo}
            placeholder="Mobile Number"
            placeholderTextColor="black"
          />
          <TextInput
            style={Login.InputFields}
            name="email"
            onChangeText={formik.handleChange('email')}
            value={formik.values.email}
            placeholder="Email Address"
            placeholderTextColor="black"
          />
        </>
      )}
      <TouchableOpacity
        style={Login.OtpButton}
        onPress={() => (confirmState ? handleLogin() : handleOtp())}>
        <Text style={Login.ButtonText}>
         {
          loading ? <ActivityIndicator color="white"/> :
         confirmState ? 'Login' : 'Send OTP' }
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

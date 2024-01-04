import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Login} from '../../Utils/Styles/LoginStyles';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import auth from '@react-native-firebase/auth';
import OTPScreen from './OTPScreen';
import {useDispatch} from 'react-redux';
import {LoginUserWithEmail, UpdateUser} from '../../Utils/Slices/AuthSlice';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmState, setConfirmState] = useState();
  const [loading, setLoading] = useState(false);
  const [isOtp, setIsOtp] = useState('');
  const [login, setLogin] = useState(false);

  const dispatch = useDispatch();

  const receiveDataFromChild = data => {
    setIsOtp(data);
  };

  const initialValues = {
    fullName: '',
    phoneNo: '',
    email: '',
    password: '',
    role: 'user',
  };

  const createUser = (email, password) => {
    try {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          console.log('EMail user response', res);
        });
    } catch (error) {
      alert(error);
    }
  };

  const signin = (email, password) => {
    try {
      dispatch(LoginUserWithEmail({email, password}));
    } catch (error) {
      alert(error);
    }
  };

  const handleOtp = values => {
    setLoading(true);
    try {
      auth()
        .signInWithPhoneNumber(`+91 ${formik.values.phoneNo}`)
        .then(res => {
          setConfirmState(res);
          setLoading(false);
        })
        .catch(error => {
          console.log('sign in error', error);
          setLoading(false);
        });
    } catch (error) {
      console.log('error while signing in', error);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      if (confirmState?.confirm) {
        await confirmState?.confirm(isOtp);
        // createUser(formik?.values?.email, formik?.values?.password);
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

  const loginWithEmail = () => {};

  return (
    <ScrollView>
      <KeyboardAvoidingView style={Login.LoginContainer}>
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
            {login ? (
              <>
                <TextInput
                  style={Login.InputFields}
                  name="email"
                  onChangeText={formik.handleChange('email')}
                  value={formik.values.email}
                  placeholder="Email Address"
                  placeholderTextColor="black"
                />
                <TextInput
                  style={Login.InputFields}
                  name="password"
                  onChangeText={formik.handleChange('password')}
                  value={formik.values.password}
                  placeholder="Password "
                  placeholderTextColor="black"
                />
              </>
            ) : (
              <>
                <View style={Login.TextContainer}>
                  <Text style={Login.LoginHeading}>Welcome Back</Text>
                  <Text style={Login.LoginPara}>
                    We missed you. Now, we are happy to see you back again.
                    Let’s sign you in.
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
                <TextInput
                  style={Login.InputFields}
                  name="password"
                  onChangeText={formik.handleChange('password')}
                  value={formik.values.password}
                  placeholder="Password "
                  placeholderTextColor="black"
                />
              </>
            )}
          </>
        )}
        <TouchableOpacity
          style={Login.OtpButton}
          onPress={() =>
            confirmState
              ? handleLogin()
              : login
              ? signin(formik.values.email, formik.values.password)
              : handleOtp()
          }>
          <Text style={Login.ButtonText}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : confirmState || login ? (
              'Login'
            ) : (
              'Send OTP'
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLogin(!login)}>
          {login ? (
            <Text style={{color: 'black', paddingTop: 20}}>
              New user ? Signup
            </Text>
          ) : (
            <Text style={{color: 'black', paddingTop: 20}}>
              Already have an account? Login
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default LoginScreen;

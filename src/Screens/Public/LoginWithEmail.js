import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Login} from '../../Utils/Styles/LoginStyles';
import {useFormik} from 'formik';
import {
  loginUserWithEmail,
  setSession,
  setUser,
} from '../../Utils/Slices/AuthSlice';
import {useDispatch} from 'react-redux';

const LoginWithEmail = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {email: '', password: ''},
    onSubmit: values => {
      console.log('Values', values);
      dispatch(loginUserWithEmail(values)).then(res => {
        console.log('Response', res);
        dispatch(setSession(res?.payload));
        dispatch(setUser(res?.payload));
      });
    },
  });
  return (
    <ScrollView>
      <KeyboardAvoidingView style={Login.LoginContainer}>
        <Image
          source={require('../../Assets/Images/login.png')}
          style={Login.LoginImage}
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

        <TouchableOpacity
          style={Login.OtpButton}
          onPress={() => formik.handleSubmit()}>
          <Text style={Login.ButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLogin(!login)}>
          <Text style={{color: 'black', paddingTop: 20}}>
            New user ? Signup
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default LoginWithEmail;

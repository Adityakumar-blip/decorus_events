import {Text, View, Dimensions} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import auth from '@react-native-firebase/auth';
import OTPInput from '../../Components/OTPInput';
import OtpStyle from '../../Utils/Styles/OtpStyle';
import {Login} from '../../Utils/Styles/LoginStyles';
export default function OTPScreen({
  confirmProps,
  phoneNumber,
  sendDataToParent,
}) {
  const [confirmState, setConfirmState] = useState({
    confirm: null,
    verificationId: null,
    phoneNumber: null,
  });
  const [OTP, setOTP] = useState('');
  const [seconds, setSeconds] = useState(120);

  useEffect(() => {
    const handleSendOtp = () => {
      sendDataToParent(OTP);
    };
    handleSendOtp();
  }, [OTP]);

  const verify = async value => {
    try {
      if (confirmState?.confirm) {
        await confirmState?.confirm(value);
      } else if (confirmProps?.confirm) {
        await confirmProps?.confirm(value);
      }
    } catch (error) {
      console.error('Failed Verification', error);
    }
  };
  const resendOTP = async () => {
    try {
      const result = await auth().signInWithPhoneNumber(
        `+91 ${phoneNumber}`,
        true,
      );
      setConfirmState(result);
      setSeconds(120);
    } catch (error) {
      console.error('RESEND', error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const {Height} = Dimensions.get('window');

  return (
    <View style={{height: Height}}>
      <View style={Login.TextContainer}>
        <Text style={Login.LoginHeading}>Get Verification</Text>
        <Text style={Login.LoginPara}>
          {` Enter 6 digit verification code sent to your mobile number ${phoneNumber}. If not obtain try resend option.`}
        </Text>
      </View>
      <OTPInput
        onChange={value => {
          setOTP(value);
        }}
        inputStyle={OtpStyle.OtpInput}
      />
      <View style={OtpStyle.TimerView}>
        {/* <Images.timer /> */}
        <Text style={OtpStyle.TimerText}>
          {new Date(seconds * 1000).toISOString().substring(14, 19)}
        </Text>
      </View>
      {!seconds && (
        <Text onPress={() => resendOTP()} style={OtpStyle.ResendText}>
          Resend
        </Text>
      )}
    </View>
  );
}

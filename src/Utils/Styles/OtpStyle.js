import {StyleSheet} from 'react-native';
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../constants.js';

export default OtpStyle = StyleSheet.create({
  OtpContainer: {
    paddingHorizontal: pixelSizeHorizontal(10),
  },
  TitleView: {
    marginTop: pixelSizeVertical(50),
  },
  Title: {
    // fontFamily: fontsfamily.DMSansMedium,
    fontSize: fontPixel(30),
    // color: colors.colorBlack,
  },
  textInputStyle: {
    borderRadius: 4,
    borderWidth: 2,
  },
  EnterOtpTitle: {
    // fontFamily: fontsfamily.DMSansMedium,
    fontSize: fontPixel(34),
    // color: colors.colorBlack,
    marginTop: pixelSizeVertical(70),
    marginBottom: pixelSizeVertical(20),
  },
  TimerView: {
    alignSelf: 'center',
    marginTop: pixelSizeVertical(40),
    flexDirection: 'row',
    alignItems: 'center',
  },
  TimerText: {
    // fontFamily: fontsfamily.DMSansMedium,
    fontSize: fontPixel(40),
    color: "black",
    marginTop: pixelSizeVertical(2),
  },
  ResendText: {
    // fontFamily: fontsfamily.DMSansMedium,
    fontSize: fontPixel(40),
    color: "#4287f5",
    marginTop: pixelSizeVertical(40),
    alignSelf: 'center',
  },
  VerifyText: {
    // color: colors.colorWhite9,
  },
  VerifyButton: {
    marginTop: pixelSizeVertical(40),
  },
  OtpInput: {
    borderRadius: 4,
    borderWidth: 2,

  },
});

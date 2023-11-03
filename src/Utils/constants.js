import {Buffer} from 'buffer';

// response code for check from bakand side
export const responseCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BED_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIME_OUT: 408,
  UNPROCESSED_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BED_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATE_WAY_TIMEOUT: 504,
  NETWORK_AUTH_REQUIRED: 511,
};

export const decodeBase64 = value => {
  return Buffer.from(value, 'base64').toString('ascii');
};

//TOAST
export const ShowAlert = (
  message,
  title,
  onOkPress,
  onCanclePress,
  doubleButton,
  ButtonTitle1,
  ButtonTitle2,
) => {
  return doubleButton
    ? Alert.alert(title, message, [
        {
          text: ButtonTitle1 ? ButtonTitle1 : 'Cancel',
          onPress: () => console.log('Cancel'),
        },
        {
          text: 'OK',
          onPress: () => console.log('OK'),
        },
      ])
    : Alert.alert(title, message, [
        {
          text: ButtonTitle2 ? ButtonTitle2 : 'OK',
          onPress: () => console.log('OK'),
        },
      ]);
};

export function isURL(str) {
  var urlPattern =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  return urlPattern.test(str);
}

//Dimensions for respon UI
import {Alert, Dimensions, PixelRatio} from 'react-native';
const {width, height} = Dimensions.get('window');

export const HEIGHT = height;
export const WIDTH = width;

const widthBaseScale = HEIGHT / 414;
const heightBaseScale = WIDTH / 896;

function normalize(size, based = 'width') {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

//for width  pixel
const widthPixel = size => {
  return normalize(size, 'width');
};
//for height  pixel
const heightPixel = size => {
  return normalize(size, 'height');
};
//for font  pixel
const fontPixel = size => {
  return heightPixel(size);
};
//for Margin and Padding vertical pixel
const pixelSizeVertical = size => {
  return heightPixel(size);
};
//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = size => {
  return widthPixel(size);
};
export {
  widthPixel,
  heightPixel,
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
};

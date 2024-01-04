import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';

const QRreader = () => {
  const Decode = fileuri => {
    RNQRGenerator.detect({
      uri: fileuri,
    })
      .then(response => {
        const {values} = response;
        console.log('Decoded result', response);
      })
      .catch(error => console.log('Cannot detect QR code in image', error));
  };

  const launchNativeImageLibrary = () => {
    console.log('heree');
    try {
      let options = {
        includeBase64: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const source = {uri: response.assets.uri};

          const fileUri = response.assets[0].uri;
          console.log('file uri', fileUri);
          Decode(fileUri); // Replace with your file URI
        }
      });
    } catch (error) {
      console.error(
        'An error occurred during image selection and navigation:',
        error,
      );
    }
  };
  return (
    <TouchableOpacity onPress={() => launchNativeImageLibrary()}>
      <Text>decode qr</Text>
    </TouchableOpacity>
  );
};

export default QRreader;

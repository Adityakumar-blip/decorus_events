import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, Button, Alert, Linking } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import QrCodeReader from 'qrcode-reader';
import { Buffer } from 'buffer';

const QR_CODE_FILE_URI = 'https://firebasestorage.googleapis.com/v0/b/dercorus.appspot.com/o/chat%2F5mKH66fRzTQLg24EnmFuc2r7fR03_1698581013232?alt=media&token=e2eb2878-f3ad-4540-90b7-81df83d089c6';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color : "red"
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const FileDecoder = () => {
  const [loading, setLoading] = useState(true);
  const [decoding, setDecoding] = useState(false);
  const [qrCodeFileUri , setQrCodeFileUri] = useState(QR_CODE_FILE_URI);
  const [fileError, setFileError] = useState('');
  const [decodingError, setDecodingError] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [base64, setBase64] = useState('');
  const [decodingResult, setDecodingResult] = useState('');

  const loadImageData = async (uri) => {
    const result = {};
    const { fs } = RNFetchBlob;

    try {
      const res = await RNFetchBlob.config({ fileCache: true }).fetch('GET', uri);
      result.base64 = await res.readFile('base64');
      const imageLocalFilePath = await res.path();
      fs.unlink(imageLocalFilePath);
    } catch (error) {
      result.fileError = `Error getting image base64: ${error}`;
    }

    return result;
  };

  useEffect(() => {
    const loadData = async () => {
      const { base64, fileError } = await loadImageData(qrCodeFileUri);

      if (fileError) {
        setFileError(fileError);
        setLoading(false);
        return;
      }

      Image.getSize(qrCodeFileUri, (imgWidth, imgHeight) => {
        console.log(imgHeight , imgWidth)
        setBase64(base64);
        setWidth(imgWidth);
        setHeight(imgHeight);
        setLoading(false);
      });
    };

    loadData();
  }, []);

  const decodeFile = async () => {
    setDecoding(true);
    const buffer = Buffer.from(base64, 'base64');

    const decodeQrCode = () => {
        console.log("heree")
      const qr = new QrCodeReader();
      qr.callback = (error, res) => {
        console.log(error , res)
        if (error || !res) {
          setDecodingError(error);
          setDecodingResult('');
        } else {
          setDecodingError('');
          setDecodingResult(res.result);
          console.log("qr code result" , res?.result)
        }
        setDecoding(false);
      };

      qr.decode({ width, height }, buffer);
    };

    decodeQrCode();
  };

  const openLink = (link) => {
    console.log("heree")
    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) Linking.openURL(link);
        else Alert.alert('Oops!', 'Can not open link!');
      })
      .catch(() => {
        Alert.alert('Oops!', 'Can not open link!');
      });
  };

  if (fileError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Unable to load file</Text>
        <Text style={styles.error}>{fileError}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  console.log("decoding result",decodingResult)

  return (
    <View style={styles.container}>
      <Image source={{ uri: qrCodeFileUri }} style={{ width : 50, height : 50 }} />
      <View style={{ marginVertical: 8 }}>
        <Button  title="Decode File" onPress={() => decodeFile()} />
      </View>

      {decodingResult ? (
        <View style={styles.center}>
          <View style={{ marginBottom: 4 }}>
            <Text style={styles.title}>Decoding Result</Text>
          </View>
          <Button title={decodingResult} onPress={() => openLink(decodingResult)} />
          <Text style={styles.error}>{decodingError}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default FileDecoder;

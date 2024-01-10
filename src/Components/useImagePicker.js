import React, {useState} from 'react';
import {StyleSheet, Platform, PermissionsAndroid} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import { PERMISSIONS } from "react-native-permissions";
// import { checkMultiplePermissions } from "./PermissionService";

const useImagePicker = () => {
  const [filePath, setFilePath] = useState(undefined);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // const permission = [PERMISSIONS.ANDROID.CAMERA];
        // const isPermissionGranted = await checkMultiplePermissions(permission);
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const capture = async type => {
    let options = {
      mediaType: type,
      // maxWidth: 300,
      // maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 60, //Video max duration in seconds
      saveToPhotos: true,
    };
    // let isCameraPermitted = await requestCameraPermission();
    // let isStoragePermitted = await requestExternalWritePermission();
    // if (isCameraPermitted && isStoragePermitted) {
    launchCamera(options, response => {
      if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      if (response?.assets?.length) {
        setFilePath(response);
      }
    });
    // }
  };

  const choose = type => {
    try {
      let options = {
        mediaType: type || 'mixed',
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
      };
      launchImageLibrary(options, response => {
        if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        if (response?.assets?.length) {
          setFilePath(response.assets[0]);
        }
      });
    } catch (error) {
      console.error('ERROR', error);
    }
  };

  return {
    capture,
    choose,
    clearFile: () => setFilePath(undefined),
    filePath,
  };
};

export default useImagePicker;

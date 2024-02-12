import * as RNFS from 'react-native-fs';
import * as Permissions from 'react-native-permissions';
import {Platform, Alert} from 'react-native';
import {Parser} from '@json2csv/plainjs';

export const downloadJsonAsCsv = async (jsonData, filename) => {
  const hasPermission = await Permissions.check(
    Permissions.WRITE_EXTERNAL_STORAGE,
  );

  if (!hasPermission) {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      // Show permission modal for API level 33 or higher
      const granted = await Permissions.request(
        Permissions.MANAGE_EXTERNAL_STORAGE,
      );

      if (granted !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Storage permission is needed to download the CSV file. Please grant the permission in app settings.',
        );
        return;
      }
    } else {
      // Request write storage permission for other cases
      const granted = await Permissions.request(
        Permissions.WRITE_EXTERNAL_STORAGE,
      );

      if (granted !== 'granted') {
        console.warn(
          'Write storage permission is not granted. Downloading cancelled.',
        );
        return;
      }
    }
  }

  // Proceed with download process
  try {
    // Convert JSON to CSV data
    const opts = {};
    const parser = new Parser(opts);
    const csvData = parser.parse(myData);

    // Get the Downloads directory path based on API level
    const downloadsPath = await (Build.VERSION.SDK_INT <
    Build.VERSION_CODES.TIRAMISU
      ? RNFS.DocumentDirectoryPath
      : RNFS.ExternalStorageDirectoryPath);
    const filePath = `${downloadsPath}/${filename}.csv`;

    // Write CSV data to file
    await RNFS.writeFile(filePath, csvData);

    // Trigger native download manager
    RNFS.downloadFile({
      fromUrl: filePath,
      toFile: filePath,
    })
      .promise.then(() => {
        console.log('File downloaded successfully!');
      })
      .catch(err => {
        console.error('Error downloading file:', err);
      });
  } catch (error) {
    console.error('Error converting or saving CSV:', error);
  }
};

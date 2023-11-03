import React, {useState} from 'react';
import {BillStyle} from '../Utils/Styles/BillStyles';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {useFormik} from 'formik';
import RNFetchBlob from 'rn-fetch-blob';

const initialValues = {
  Client: '',
  Address: '',
  GSTIN: '',
  Brand: '',
  Location: '',
  Invoice_Number: '',
  Event_Date: '',
  Estimate_Number: '',
  PO_Number: '',
  PAN_Number: '',
  TAN_Number: '',
  HSNSAC: '',
  Detail: '',
  Elements: '',
  Quantity: '',
  Rate: '',
  Days: '',
  Amount: '',
};

const SalaryComponent = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const BillFields = [
    {
      id: 0,
      name: 'PhoneNo',
    },
    {
      id: 1,
      name: 'FullName',
    },
    {
      id: 2,
      name: 'AccountNo',
    },
    {
      id: 3,
      name: 'DOB',
    },
    {
      id: 5,
      name: 'LOP Days',
    },
    {
      id: 6,
      name: 'PF Number',
    },
    {
      id: 7,
      name: 'STD Days',
    },
    {
      id: 8,
      name: 'Location',
    },
    {
      id: 9,
      name: 'Working Days',
    },
    {
      id: 10,
      name: 'Department',
    },
    {
      id: 11,
      name: 'Designation',
    },
    {
      id: 12,
      name: 'Basic',
    },
    {
      id: 13,
      name: 'PF',
    },
    {
      id: 14,
      name: 'HR Allowance',
    },
    {
      id: 15,
      name: 'Income Tax',
    },
    {
      id: 16,
      name: 'Conveneince',
    },
    {
      id: 17,
      name: 'Shift Allowance',
    },
    {
      id: 18,
      name: 'Bonus',
    },
    {
      id: 19,
      name: 'Medical Allowance',
    },
    {
      id: 20,
      name: 'Gross Earnings',
    },
    {
      id: 21,
      name: 'Gross Deduction',
    },
    {
      id: 22,
      name: 'Net pay',
    },
  ];

  const orderLines = [
    {
      id: 1,
      product: 'Product 1',
      quantity: 1,
      price: '$10.00',
    },
    {
      id: 2,
      product: 'Product 2',
      quantity: 2,
      price: '$20.00',
    },
    {
      id: 3,
      product: 'Product 3',
      quantity: 3,
      price: '$30.00',
    },
  ];

  const movePdfToDocumentsFolder = async (sourcePath, destinationPath) => {
    console.log('Various Paths are as follows', sourcePath, destinationPath);
    try {
      const result = RNFetchBlob.fs.mv(sourcePath, destinationPath);
      console.log('result path', result);
      if (result) {
        return destinationPath;
      } else {
        throw new Error('Failed to move PDF to documents folder');
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const generatePDF = async values => {
    try {
      const html = `<html>
      <head>
      <style>
      table{
      width: 100%;
      border-collapse:collapse;
      border: 1px solid black;
      }
      table td{line-height:25px;padding-left:15px;}
      table th{background-color:#fbc403; color:#363636;}
      </style>
      
      </head>
      <body>
      <table border="1">
      <tr height="100px" style="background-color:#363636;color:#ffffff;text-align:center;font-size:24px; font-weight:600;">
      <td colspan='4'>Decorus Events</td>
      </tr>
      <tr>
      <th>Personel NO:</th>
      <td>${values?.PhoneNo}</td>
      <th>Name</th>
      <td>${values?.FullName}</td>
      </tr>
      <!-----2 row--->
      <tr>
      <th>Bank</th>
      <td>x0x0x0</td>
      <th>Bank A/c No.</th>
      <td>${values?.AccountNo}</td>
      </tr>
      <!------3 row---->
      <tr>
      <th>DOB</th>
      <td>${values?.DOB}</td>
      <th>Lop Days</th>
      <td>${values['LOP Days']}</td>
      </tr>
      <!------4 row---->
      <tr>
      <th>PF No.</th>
      <td>${values['PF Number']}</td>
      <th>STD days</th>
      <td>${values['STD Days']}</td>
      </tr>
      <!------5 row---->
      <tr>
      <th>Location</th>
      <td>${values?.Location}</td>
      <th>Working Days</th>
      <td>${values['Working Days']}</td>
      </tr>
      <!------6 row---->
      <tr>
      <th>Department</th>
      <td>${values?.Department}</td>
      <th>Designation</th>
      <td>${values?.Designation}</td>
      </tr>
      </table>
      <tr></tr>
      <br/>
      <table border="1">
      <tr>
      <th >Earnings</th>
      <th>Amount</th>
      <th >Deductions</th>
      <th>Amount</th>
      </tr>
      <tr>
      <td>Basic</td>
      <td>${values?.Basic}</td>
      <td>provident fund</td>
      <td>${values?.PF}</td>
      </tr>
      <tr>
      <td>House Rent Allowance</td>
      <td>${values['HR Allowance']}</td>
      <td>professional tax</td>
      <td>600</td>
      </tr>
      <tr>
      <td>special Allowance</td>
      <td>400</td>
      <td>Income tax</td>
      <td>${values['Income Tax']}</td>
      </tr>
      <tr>
      <td>conveyance</td>
      <td>${values?.Conveneince}</td>
      </tr>
      <tr>
      <td>ADD Special allowance</td>
      <td>2000</td>
      </tr>
      <tr>
      <td>shift Allowance</td>
      <td>${values['Shift Allowance']}</td>
      </tr>
      <tr>
      <td>bonus</td>
      <td>${values?.Bonus}</td>
      </tr>
      <tr>
      <td>medical Allowance</td>
      <td>${values['Medical Allowance']}</td>
      </tr>
      <tr>
      <th>Gross Earnings</th>
      <td>Rs. ${values['Gross Earnings']}</td>
      <th >Gross Deductions</th>
      <td>Rs. ${values['Gross Deduction']}</td>
      </tr>
      <tr>
      <td></td>
      <td><strong>NET PAY</strong></td>
      <td>Rs.${values['Net Pay']}</td>
      <td></td>
      </tr>
      </table>
      </body>
      </html>`;
      const options = {
        html,
        fileName: `${values?.FullName}`,
        directory: 'Invoices',
      };
      const file = await RNHTMLtoPDF.convert(options);

      const documentsFolderPath = RNFetchBlob.fs.dirs.DocumentDir;
      const destinationPath = `${documentsFolderPath}/${values?.FullName}.pdf`;

      const movedFilePath = await movePdfToDocumentsFolder(
        file.filePath,
        destinationPath,
      );

      setPdfFile(movedFilePath);

      Alert.alert('Success', `PDF saved to ${movedFilePath}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: values => {
      console.log('formik values', values);
      generatePDF(values);
    },
  });

  return (
    <SafeAreaView>
      <View style={{padding: 15}}>
        <FlatList
          data={BillFields}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TextInput
              style={BillStyle.InputFields}
              placeholder={item.name}
              onChangeText={formik.handleChange(item.name)}
              value={formik.values[item.name]}
              placeholderTextColor="#407BFF"
            />
          )}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          style={BillStyle.DownloadButton}
          onPress={() => formik.handleSubmit()}>
          <Text style={{color: 'white', fontWeight: '600'}}>Download Slip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SalaryComponent;

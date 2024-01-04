import React, {useEffect, useState} from 'react';
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
import {firebase} from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {UploadSalarySlips} from '../Utils/Slices/ChatSlice';
import Index from '../Navigation';
// import logo from '../Assets/Images/decorus_logo'

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

  const clientArray = [
    {
      name: 'Louis vuiton',
      quantity: '4',
      days: '3',
      amount: '3242342',
    },
  ];

  const generatePDF = async values => {
    try {
      const html = `<html>
      <head>
         <style>
            table{
            width: 100%;
            border-collapse:collapse;
            border: 1px solid black;
            margin-top: 20px;
            }
            table td{line-height:25px;padding-left:15px;}
            table th{background-color:#7d2caa; color:#ffff;}
            .head {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              margin-bottom: 20px;
            }
            .first-table{
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 20px;
            }
            .company{
              font-size: 30px;
              color: #7d2caa;
            }
            .footer-one {
              background-color: #7d2caa;
              color: white;
              text-align: center;
              padding: 1px;
            }
            .footer-two{
              height: 20px;
               background-color: #7d2caa;
            }
         </style>
      </head>
      <body>
        <div class="head">
          <h3 class="company">Decorus Services Pvt. Ltd.</h3>
          <img src="https://firebasestorage.googleapis.com/v0/b/dercorus.appspot.com/o/decorus_logo.png?alt=media&token=b04f4178-f4f0-47be-929a-ff433cbc1727" height="100px" ></img>
        </div>
        <div class="first-table">
         <table border="1">
            <tr>
               <th>Client</th>
               <td>Aditya kumar</td>
            </tr>
            <!-----2 row--->
            <tr>
               <th>Client Address</th>
               <td>Prahlad nagar , Ahmedabad</td>
            </tr>
            <!------3 row---->
            <tr>
               <th>Client GSTIN</th>
               <td>2BJY23456q2</td>
            </tr>
            <!------4 row---->
            <tr>
               <th>Brand</th>
               <td>Unsolved Solutions</td>
            </tr>
            <!------5 row---->
            <tr>
               <th>Location</th>
               <td>Ahmedabad</td>
            </tr>
            <!------6 row---->
            <tr>
               <th>Detail</th>
               <td>Invoice</td>
            </tr>
         </table>
          <table border="1">
            <tr>
               <th>Estimate No.</th>
               <td>10</td>
            </tr>
            <!-----2 row--->
            <tr>
               <th>Estimate Date</th>
               <td>18/12/2023</td>
            </tr>
            <!------3 row---->
            <tr>
               <th>Event Date</th>
               <td>01/01/2024</td>
            </tr>
            <!------4 row---->
            <tr>
               <th>Estimate No.</th>
               <td>10</td>
            </tr>
            <!------5 row---->
            <tr>
               <th>PO Number</th>
               <td>456461</td>
            </tr>
            <!------6 row---->
            <tr>
               <th>HSN/SAC</th>
               <td>998596</td>
            </tr>
         </table>
         </div>
         <table border="1">
            <tr>
               <th>Registered Name</th>
               <td>Decorus Services Pvt. Ltd.</td>
            </tr>
            <!-----2 row--->
            <tr>
               <th>GSTIN</th>
               <td>5461321</td>
            </tr>
            <!------3 row---->
            <tr>
               <th>PAN NO</th>
               <td>AAKCD867868</td>
            </tr>
            <!------4 row---->
            <tr>
               <th>TAN NO</th>
               <td>65432132</td>
            </tr>
         </table>
         <tr></tr>
         <br/>
         <table border="1">
            <tr>
              <th>Sr. No.</th>
               <th >Elements</th>
               <th>QTY</th>
               <th >Rate</th>
               <th >Days</th>
               <th>Amount</th>
            </tr>
            ${clientArray.map((client, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{client.name}</td>
                <td>{client.quantity}</td>
                <td></td>
                <td>{client.days}</td>
                <td>{client.amount}</td>
              </tr>
            ))}
             
            <tr>
              <td></td>
               <td>As per annexure</td>
               <td></td>
               <td></td>
               <td></td>
            </tr>
            <tr>
              <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
   
            </tr>
            <tr>
               <th></th>
               <th>Subtotal</th>
               <th></th>
               <th></th>
               <th></th>
               <th>678768</th>
            </tr>
            <tr>
                <td></td>
                <td><strong>Add:Agency Fees-15%</strong></td>
                <td></td>
               <td></td>
               <td></td>
            </tr>
            <tr>
               <th></th>
               <th>Total Amount</th>
               <th></th>
               <th></th>
               <th></th>
               <th>678768</th>
            </tr>
            <tr>
               <td></td>
               <td><strong>Add:SGST 9%</strong></td>
               <td></td>
              <td></td>
              <td></td>
              <td>1200</td>
           </tr>
           <tr>
               <td></td>
               <td><strong>Add:CGST 9%</strong></td>
               <td></td>
              <td></td>
              <td></td>
              <td>1200</td>
           </tr>
           <tr>
               <th></th>
               <th></th>
               <th></th>
               <th></th>
               <th>Grand Total</th>
               <th>678768</th>
            </tr>
         </table>
         <div>
           <p>Account Holder: DECORUS SERVICES PRIVATE LIMITED</p>
           <p>ACCOUNT NUMBER: 502000082384709</p>
           <p>IFSC: HDFC0000485</p>
           <p>BRANCH: UDHYOG NAGAR</p>
           <p>ACCOUNT TYPE: CURRENT</p>
           <p>VPA: 9899696992@hdfcbank</p>
         </div>
         <div class="footer-one">
           <p>Decorus Services Pvt. Ltd.</p>
         </div>
         <p style="text-align:center">Yinchuan iBi Yucheng Center, No. 490 Ning’an Street, Jinfeng District, Yinchuan City, Ningxia</p>
          <div class="footer-two">
         </div>
      </body>
   </html>`;
      const options = {
        html,
        fileName: `${values?.FullName}`,
        directory: 'Downloads',
      };
      const file = await RNHTMLtoPDF.convert(options);

      const downloadDirectory = RNFS.DownloadDirectoryPath;
      const destinationPath = `${downloadDirectory}/${values.FullName}_salary_slip.pdf`;

      await RNFS.moveFile(file.filePath, destinationPath);
      setPdfFile(file.filePath);

      Alert.alert('Success', `PDF saved to ${destinationPath}`);
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

  useEffect(() => {
    if (pdfFile) {
      const uploadToStorage = async () => {
        try {
          const reference = storage().ref(
            `/SalarySlip/${formik.values.FullName}_SalarySlip.pdf`,
          );
          await reference.putFile(pdfUrl);

          const downloadURL = await reference.getDownloadURL();
          console.log('Download URL', downloadURL);

          dispatch(
            UploadSalarySlips({
              ...formik.values,
              groupId: item?.groupId,
              groupName: item?.groupName,
              invoiceUrl: downloadURL,
            }),
          );
          setLoading(false);
          Alert.alert('Success', 'PDF uploaded successfully');
        } catch (error) {
          console.error('Upload Error', error);
          Alert.alert('Error', 'Failed to upload PDF');
          setLoading(false);
        }
      };

      uploadToStorage();
    }
  }, [pdfFile]);

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

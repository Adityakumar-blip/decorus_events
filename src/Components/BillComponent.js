import React, {useEffect, useState} from 'react';
import {BillStyle} from '../Utils/Styles/BillStyles';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import RNFS from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import {UploadBills} from '../Utils/Slices/ChatSlice';
import storage from '@react-native-firebase/storage';
import {PERMISSIONS, request} from 'react-native-permissions';

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
  dynamicFields: [{elements: '', quantity: '', rate: '', days: '', amount: ''}],
};

const BillComponent = ({item}) => {
  const dispatch = useDispatch();
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isIgst, setIsIgst] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      const uploadToStorage = async () => {
        try {
          const reference = storage().ref(
            `/invoices/${formik.values.Client}_invoice.pdf`,
          );
          await reference.putFile(pdfUrl);

          const downloadURL = await reference.getDownloadURL();
          console.log('Download URL', downloadURL);

          dispatch(
            UploadBills({
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
  }, [pdfUrl]);

  const generatePDF = async values => {
    setLoading(true);
    try {
      const calculateTotalAmount = () => {
        return formik.values.dynamicFields.reduce(
          (total, client) => total + parseFloat(client.amount || 0),
          0,
        );
      };

      const Subtotal = calculateTotalAmount();
      // Calculate agency fees (15% of the total amount)
      const agencyFees = 0.15 * Subtotal;

      // Calculate the total amount after adding agency fees
      const totalAmount = Subtotal + agencyFees;

      // Calculate SGST (9% of the total amount after agency fees)
      const sgst = 0.09 * totalAmount;

      // Calculate CGST (9% of the total amount after agency fees)
      const cgst = 0.09 * totalAmount;

      const igst = 0.18 * totalAmount;

      // Calculate the final total amount after adding SGST and CGST
      const grandTotal1 = totalAmount + sgst + cgst;
      const grandTotal2 = totalAmount + sgst + cgst + igst;
      const clientTableRows = formik.values.dynamicFields
        .map(
          (client, index) =>
            `<tr key=${index + 1}>
          <td>${index + 1}</td>
          <td>${client.elements}</td>
          <td>${client.quantity}</td>
          <td>${client.rate}</td>
          <td>${client.days}</td>
          <td>${client.amount}</td>
        </tr>`,
        )
        .join('');
      const html = `<html>
        <head>
           <style>
           @page {
            size: A4;
            margin: 0;
          }
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
                font-size: 40px;
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
                 <td>${formik.values.Client}</td>
              </tr>
              <!-----2 row--->
              <tr>
                 <th>Client Address</th>
                 <td>${formik.values.Address}</td>
              </tr>
              <!------3 row---->
              <tr>
                 <th>Client GSTIN</th>
                 <td>${formik.values.GSTIN}</td>
              </tr>
              <!------4 row---->
              <tr>
                 <th>Brand</th>
                 <td>${formik.values.Brand}</td>
              </tr>
              <!------5 row---->
              <tr>
                 <th>Location</th>
                 <td>${formik.values.Location}</td>
              </tr>
              <!------6 row---->
              <tr>
                 <th>Detail</th>
                 <td>${formik.values.Detail}</td>
              </tr>
           </table>
            <table border="1">
              <tr>
                 <th>Estimate No.</th>
                 <td>${formik.values.Estimate_Number}</td>
              </tr>
              <!-----2 row--->
              <tr>
                 <th>Estimate Date</th>
                 <td>${formik.values.Estimate_Number}</td></td>
                 </tr>
                 <!------3 row---->
                 <tr>
                 <th>Event Date</th>
                 <td>${formik.values.Event_Date}</td></td>
                 
                 </tr>
                 <!------4 row---->
                 <tr>
                 <th>Estimate No.</th>
                 <td>${formik.values.Estimate_Number}</td></td>
              </tr>
              <!------5 row---->
              <tr>
                 <th>PO Number</th>
                 <td>${formik.values.PO_Number}</td>
              </tr>
              <!------6 row---->
              <tr>
                 <th>HSN/SAC</th>
                 <td>${formik.values.HSNSAC}</td>
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
                 <td>${formik.values.GSTIN}</td>
              </tr>
              <!------3 row---->
              <tr>
                 <th>PAN NO</th>
                 <td>${formik.values.PAN_Number}</td>
              </tr>
              <!------4 row---->
              <tr>
                 <th>TAN NO</th>
                 <td>${formik.values.TAN_Number}</td>
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
              ${clientTableRows}
               
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
                 <th>${Subtotal}</th>
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
                 <th>${totalAmount}</th>
              </tr>
              <tr>
                 <td></td>
                 <td><strong>Add:SGST 9%</strong></td>
                 <td></td>
                <td></td>
                <td></td>
                <td>${sgst}</td>
             </tr>
             <tr>
                 <td></td>
                 <td><strong>Add:CGST 9%</strong></td>
                 <td></td>
                <td></td>
                <td></td>
                <td>${cgst}</td>
             </tr>
             <tr>
             <td></td>
             <td><strong>Add:IGST 18%</strong></td>
             <td></td>
            <td></td>
            <td></td>
            <td>${igst}</td>
            </tr>
             <tr>
                 <th></th>
                 <th></th>
                 <th></th>
                 <th></th>
                 <th>Grand Total</th>
                 <th>${isIgst ? grandTotal2 : grandTotal1}</th>
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
        fileName: `invoice_789x`,
        directory: 'Download',
      };

      const storagePermission = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );

      if (storagePermission === 'granted') {
        const file = await RNHTMLtoPDF.convert(options);

        const downloadDirectory = RNFS.DownloadDirectoryPath;
        const destinationPath = `${downloadDirectory}/${formik.values.Client}.pdf`;

        await RNFS.moveFile(file.filePath, destinationPath);

        setPdfUrl(destinationPath);

        Alert.alert('Success', `PDF saved to ${destinationPath}`);
        setLoading(false);
      } else {
        const file = await RNHTMLtoPDF.convert(options);

        const downloadDirectory = RNFS.DownloadDirectoryPath;
        const destinationPath = `${downloadDirectory}/${formik.values.Client}.pdf`;

        await RNFS.moveFile(file.filePath, destinationPath);

        setPdfUrl(destinationPath);

        Alert.alert('Success', `PDF saved to ${destinationPath}`);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      setLoading(true);
      console.log('formik values', values);
      await generatePDF(values);
    },
  });

  const handleAddField = () => {
    formik.setValues({
      ...formik.values,
      dynamicFields: [
        ...formik.values.dynamicFields,
        {elements: '', quantity: '', rate: '', days: '', amount: ''},
      ],
    });
  };

  const handleRemove = index => {
    formik.setValues({
      ...formik.values,
      dynamicFields: formik.values.dynamicFields.filter((_, i) => i !== index),
    });
  };

  const handleIGST = () => {
    setIsIgst(!isIgst);
    console.log('igst', isIgst);
    const isIGSTAdded = isIgst === true;
    const isIGSTRemoved = isIgst === false;

    if (isIGSTAdded || isIGSTRemoved) {
      Alert.alert(
        'IGST Change',
        isIGSTAdded ? 'IGST has been added.' : 'IGST has been removed.',
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={{padding: 15}}>
        <TextInput
          placeholder="Client"
          onChangeText={formik.handleChange('Client')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Address"
          onChangeText={formik.handleChange('Address')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="GSTIN"
          onChangeText={formik.handleChange('GSTIN')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Brand"
          onChangeText={formik.handleChange('Brand')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Location"
          onChangeText={formik.handleChange('Location')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Invoice_Number"
          onChangeText={formik.handleChange('Invoice_Number')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Event_Date"
          onChangeText={formik.handleChange('Event_Date')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Estimate_Number"
          onChangeText={formik.handleChange('Estimate_Number')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="PO_Number"
          onChangeText={formik.handleChange('PO_Number')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="PAN_Number"
          onChangeText={formik.handleChange('PAN_Number')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="TAN_Number"
          onChangeText={formik.handleChange('TAN_Number')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="HSNSAC"
          onChangeText={formik.handleChange('HSNSAC')}
          style={BillStyle.InputFields}
        />
        <TextInput
          placeholder="Detail"
          onChangeText={formik.handleChange('Detail')}
          style={BillStyle.InputFields}
        />
        {formik.values.dynamicFields.map((field, index) => (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 600,
                }}>{`Element ${index + 1}`}</Text>
              {formik.values.dynamicFields.length > 1 && (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4287f5',
                    padding: 15,
                    borderRadius: 10,
                  }}
                  onPress={() => handleRemove(index)}>
                  <Text style={{color: 'white', fontWeight: 600}}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              placeholder="Element"
              onChangeText={formik.handleChange(
                `dynamicFields[${index}].elements`,
              )}
              style={BillStyle.InputFields}
              key={index}
            />
            <TextInput
              placeholder="Quantity"
              onChangeText={formik.handleChange(
                `dynamicFields[${index}].quantity`,
              )}
              style={BillStyle.InputFields}
            />
            <TextInput
              placeholder="Rate"
              onChangeText={formik.handleChange(`dynamicFields[${index}].rate`)}
              style={BillStyle.InputFields}
            />
            <TextInput
              placeholder="Days"
              onChangeText={formik.handleChange(`dynamicFields[${index}].days`)}
              style={BillStyle.InputFields}
            />
            <TextInput
              placeholder="Amount"
              onChangeText={formik.handleChange(
                `dynamicFields[${index}].amount`,
              )}
              style={BillStyle.InputFields}
            />
          </>
        ))}

        {/* <Button onPress={addDynamicField} title="Add Dynamic Field" /> */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={BillStyle.DownloadButton}
            onPress={handleAddField}>
            <Text style={{color: 'white', fontWeight: 600}}>Add Element</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={BillStyle.DownloadButton}
            onPress={() => handleIGST()}>
            <Text style={{color: 'white', fontWeight: 600}}>Add IGST</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={BillStyle.DownloadButton}
          onPress={formik.handleSubmit}>
          {loading ? (
            <ActivityIndicator size={'small'} color="white" />
          ) : (
            <Text style={{color: 'white', fontWeight: 600}}>
              Download a Bill
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BillComponent;

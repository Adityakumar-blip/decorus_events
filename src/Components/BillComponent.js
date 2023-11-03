import React from 'react';
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

const BillComponent = () => {
  const BillFields = [
    {
      id: 0,
      name: 'Client',
    },
    {
      id: 1,
      name: 'Address',
    },
    {
      id: 2,
      name: 'GSTIN',
    },
    {
      id: 3,
      name: 'Brand',
    },
    {
      id: 5,
      name: 'Location',
    },
    {
      id: 6,
      name: 'Invoice Number',
    },
    {
      id: 7,
      name: 'Event Date',
    },
    {
      id: 8,
      name: 'Estimate Number',
    },
    {
      id: 9,
      name: 'Po Number',
    },
    {
      id: 10,
      name: 'PAN Number',
    },
    {
      id: 11,
      name: 'TAN Number',
    },
    {
      id: 12,
      name: 'HSN/SAC',
    },
    {
      id: 13,
      name: 'Detail',
    },
    {
      id: 14,
      name: 'Elements',
    },
    {
      id: 15,
      name: 'Quantity',
    },
    {
      id: 16,
      name: 'Rate',
    },
    {
      id: 17,
      name: 'Days',
    },
    {
      id: 18,
      name: 'Amount',
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

  const generatePDF = async values => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica';
                font-size: 12px;
              }
              header, footer {
                height: 50px;
                background-color: #fff;
                color: #000;
                display: flex;
                justify-content: center;
                padding: 0 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #000;
                padding: 5px;
              }
              th {
                background-color: #ccc;
              }
            </style>
          </head>
          <body>
            <header>
              <h1>Invoice for Order #2580</h1>
            </header>
            <h1>Order Details</h1>
            <table>
              <tr>
                <th>Order ID</th>
                <td>789</td> 
              </tr>
              <tr>
                <th>Order Date</th>
                <td>28/10/2023</td>
              </tr>
              <tr>
                <th>Order Status</th>
                <td>Completed</td>
              </tr>
              <tr>
                <th>Order Total</th>
                <td>Rs. 13232</td>
              </tr>
            </table>
            <h1>Order Lines</h1>
            <table>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Qty</th>
                <th>Product Price</th>
              </tr>
              ${orderLines
                .map(
                  line => `
                <tr>
                  <td>${line.id}</td>
                  <td>${line.product}</td>
                  <td>${line.quantity}</td>
                  <td>${line.price}</td>
                </tr>
              `,
                )
                .join('')}
            </table>
            <footer>
              <p>Thank you for your business!</p>
            </footer>
          </body>
        </html>
      `;
      const options = {
        html,
        fileName: `invoice_789x`,
        directory: 'Invoices',
      };
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF saved to ${file.filePath}`);
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
          <Text style={{color: 'white', fontWeight: 600}}>Download a Bill</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BillComponent;

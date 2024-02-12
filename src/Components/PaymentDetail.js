import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageC from './ImageC';
import {useDispatch, useSelector} from 'react-redux';
import {GetPaymentsById, UpdatePaymentById} from '../Utils/Slices/ExpenseSlice';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

// import {downloadJsonAsCsv, exportDataToExcel} from '../Utils/Functions';

const PaymentDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const data = route.params.item;

  const {paymentById} = useSelector(({ExpenseSlice}) => ExpenseSlice);

  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log('Data', data, paymentById);

  // Calculate total amount
  const totalAmount = paymentById.reduce((acc, item) => acc + item.amount, 0);

  useEffect(() => {
    dispatch(GetPaymentsById(data?.groupId));
  }, [dispatch, data?.groupId]);

  useEffect(() => {
    const paymentData = {
      id: data?.groupId,
      amount: totalAmount,
    };
    dispatch(UpdatePaymentById(paymentData));
  }, [totalAmount]);

  console.log('Payment by id ', paymentById);

  const generateHTML = data1 => {
    const totalAmount = data1.reduce((sum, item) => sum + item.amount, 0);
    return `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            @page {
              size: A4;
              margin: 20mm 5mm;
            }
            .title {
              text-align : center;
            }
            .group {
              text-align : center;
            }
          </style>
        </head>
        <body>
        <div class="title"><h1>Decorus Events</h1></div>
        <h4 class="group" >Group Name: ${data?.groupName}</h4>
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Group Name</th>
                <th>Paid To</th>
                <th>Paid By</th>
                <th>Amount</th>
                <th>Remarks</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${data1
                .map(
                  (item, index) => `
                  <tr key=${index + 1}>
                    <td>${index + 1}</td>
                    <td>${item.group}</td>
                    <td>${item.paidBy.name}</td>
                    <td>${item.paidTo}</td>
                    <td>${item.amount}</td>
                    <td>${item.remarks ? item?.remarks : ''}</td>
                    <td>${item.createdAt.toDate().toLocaleString()}</td>
                  </tr>
                `,
                )
                .join('')}
            </tbody>
          </table>
          <h4>Total Amount: ${totalAmount}</h4>
        </body>
      </html>
    `;
  };

  // Download group details
  const handleFileDownload = async () => {
    try {
      const options = {
        html: generateHTML(paymentById),
        fileName: `${data?.groupName}`,
        directory: 'Download',
      };

      const file = await RNHTMLtoPDF.convert(options);

      const downloadDirectory = RNFS.DownloadDirectoryPath;
      const destinationPath = `${downloadDirectory}/${data?.groupName}_Report.pdf`;

      await RNFS.copyFile(file.filePath, destinationPath);

      console.log('File path', file.filePath);
      setPdfFile(file.filePath);

      Alert.alert('Success', `PDF saved to ${destinationPath}`);
    } catch (error) {
      console.log('Error in downloading excel', error);
      Alert.alert('Error', `${error}`);
    }
  };

  return (
    <ScrollView>
      <View>
        <View
          style={{
            backgroundColor: '#6485FF',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            padding: 20,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../Assets/Images/back_icon.png')} />
            </TouchableOpacity>
            <Image
              source={{
                uri: 'https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg',
              }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 18,
              }}>
              <View style={{marginVertical: 20}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 17,
                    fontWeight: '500',
                    width: 200,
                  }}>
                  {data?.groupName}
                  {/* Test */}
                </Text>
                <Text
                  style={{
                    maxWidth: 250,
                    color: 'white',
                    fontWeight: '400',
                    fontSize: 10,
                  }}>
                  Members
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleFileDownload()}>
                <Image
                  source={require('../Assets/Images/downloads.png')}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            marginTop: 20,
            paddingHorizontal: 40,
          }}>
          <View
            style={{
              display: 'flex',
              backgroundColor: '#E9EFFF',
              alignItems: 'center',
              height: '50px',
              padding: 10,
              borderRadius: 10,
              width: 140,
            }}>
            <Text style={{color: 'black'}}>Total Expenses</Text>
            <Text style={{color: 'black', fontWeight: 700}}>
              {totalAmount} INR
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              backgroundColor: '#E9EFFF',
              justifyContent: 'center',
              padding: 10,
              width: 140,
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: 'black'}}>Total Transaction</Text>
            <Text style={{color: 'black', fontWeight: 700}}>
              {paymentById.length}
            </Text>
          </View>
        </View>

        <View style={{marginHorizontal: 20, paddingVertical: 10}}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={{color: 'black', fontWeight: 700}}>All Payments</Text>
          </View>
          {paymentById?.map((item, index) => (
            <View
              style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 40,
                borderBottomColor: '#6485FF',
                borderBottomWidth: 0.5,
                paddingBottom: 15,
              }}
              key={index}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <Image
                    source={{
                      uri: item?.image
                        ? item?.image
                        : 'https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg',
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <Text style={{color: 'black', fontWeight: 600}}>
                      {item?.paidTo}
                    </Text>
                    <Text style={{color: '#6485FF'}}>
                      Paid by {item?.paidBy?.name}
                    </Text>
                  </View>
                </View>
                <Text style={{color: '#6485FF', fontWeight: 700}}>
                  {item?.amount} INR
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentDetail;

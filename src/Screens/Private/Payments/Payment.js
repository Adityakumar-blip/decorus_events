import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import {PaymentStyle} from '../../../Utils/Styles/PaymentStyles';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const {width} = Dimensions.get('window');

const Payment = () => {
  const data = [
    {
      value: 2500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Jan',
    },

    {
      value: 3500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Feb',
    },

    {
      value: 4500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Mar',
    },

    {
      value: 5200,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Apr',
    },

    {
      value: 3400,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'May',
    },
    {
      value: 3900,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Jun',
    },
    {
      value: 3000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Jul',
    },
    {
      value: 3100,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Aug',
    },
    {
      value: 2000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Sep',
    },
    {
      value: 1000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 9,
      label: 'Oct',
    },
  ];

  const countries = ['January', 'February', 'March', 'April'];
  return (
    <View>
      <View style={TeamStyle.TeamHeader}>
        <Text style={{fontSize: 32, fontWeight: '700', color: '#4369F6'}}>
          Payments
        </Text>
        <Image
          source={require('../../../Assets/Images/search.png')}
          height={20}
          width={20}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 20,
        }}>
        <View>
          <Text style={{color: '#171717', fontWeight: '600', fontSize: 15}}>
            Total Expenses
          </Text>
          <Text style={{color: '#011A52', fontSize: 25}}>INR 90,000</Text>
        </View>
        <View>
          <SelectDropdown
            data={countries}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              citiesDropdownRef.current.reset();
              setCities([]);
              setCities(selectedItem.cities);
            }}
            defaultButtonText={'Select month'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.title;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return (
                <FontAwesome
                  name={isOpened ? 'chevron-up' : 'chevron-down'}
                  color={'#444'}
                  size={18}
                />
              );
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />
        </View>
      </View>
      <View
        style={{
          padding: 15,
          alignItems: 'center',
          backgroundColor: '#bfcdff',
          margin: 20,
          borderRadius: 20,
        }}>
        <BarChart
          data={data}
          barWidth={20}
          initialSpacing={1}
          spacing={20}
          barBorderRadius={10}
          showGradient
          yAxisThickness={0}
          xAxisType={'dashed'}
          xAxisColor={'white'}
          yAxisTextStyle={{color: 'white'}}
          stepValue={1000}
          maxValue={6000}
          noOfSections={6}
          yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
          labelWidth={40}
          isAnimated
          xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
        />
      </View>
      <View style={PaymentStyle.PaymentT}>
        <Text style={{color: 'black', fontWeight: '600', fontSize: 19}}>
          Team Transactions
        </Text>
        <Text style={{color: 'black'}}>See All</Text>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#000'},
  viewContainer: {flex: 1, width, backgroundColor: '#000'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
  },
  dropdownsRow: {flexDirection: 'row', width: '100%', paddingHorizontal: '5%'},

  dropdown1BtnStyle: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#444',
    width: 150,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#000'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  divider: {width: 12},
  dropdown2BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown2BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown2DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown2RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {color: '#444', textAlign: 'left'},
});

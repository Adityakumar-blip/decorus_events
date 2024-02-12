import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {TeamStyle} from '../../../Utils/Styles/TeamsStyle';
import {PaymentStyle} from '../../../Utils/Styles/PaymentStyles';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetAllPayments,
  GetPaymentsByMonth,
  MonthwiseData,
} from '../../../Utils/Slices/ExpenseSlice';
import Arrow from '../../../Assets/Svg/Arrow.svg';
const {width} = Dimensions.get('window');

const Payment = ({navigation}) => {
  const dispatch = useDispatch();
  const [scrollY] = useState(new Animated.Value(0));
  const [totalParentAmount, setTotalParentAmount] = useState();
  const [cities, setCities] = useState('');
  const citiesDropdownRef = useRef();

  const headerHeight = 200;

  const translateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false},
  );
  const {payments, paymentsByMonth} = useSelector(
    ({ExpenseSlice}) => ExpenseSlice,
  );

  console.log('Payments by months', paymentsByMonth);

  const maxValue = 100000;
  const stepValue = 10000;
  const noOfSections = 10;

  // Generate y-axis label texts based on maxValue and stepValue
  const yAxisLabelTexts = Array.from({length: noOfSections + 1}, (_, index) => {
    const value = stepValue * index;
    return value >= 1000 ? `${value / 1000}k` : value.toString();
  });

  const data = paymentsByMonth?.map((month, index) => ({
    value: month?.amount,
    frontColor: '#006DFF',
    gradientColor: '#009FFF',
    spacing: 5,
    label: month?.id,
  }));

  const reversedData = [...data].reverse();

  useEffect(() => {
    dispatch(GetPaymentsByMonth(setCities));
  }, []);

  const countries = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const total = payments.reduce((acc, item) => acc + item.totalAmount, 0);
  useEffect(() => {
    setTotalParentAmount(total);
  }, [total]);

  const renderRooms = ({item}) => {
    // if (item.userId === user.userId) {
    //   return null;
    // }

    console.log('Payment Data', item);

    const handleGroupClick = item => {
      navigation.navigate('PaymentDetail', {
        item,
      });
    };

    return (
      <View style={{marginHorizontal: 10, marginVertical: 5}}>
        <TouchableOpacity
          onPress={() => handleGroupClick(item)}
          style={TeamStyle.TeamChat}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              marginBottom: 5,
            }}>
            <Image
              source={{
                uri: item?.imageUrl
                  ? item?.imageUrl
                  : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGdyb3VwfGVufDB8fDB8fHww',
              }}
              height={60}
              width={60}
              style={{borderRadius: 10}}
            />
            <View>
              <Text style={{color: 'black', fontSize: 17, fontWeight: '500'}}>
                {item?.groupName}
              </Text>
              {/* <Text style={{maxWidth: 250, color: 'black'}}>
                {item?.fullName && `${item?.fullName}: ${item?.message}`}
              </Text> */}
            </View>
          </View>

          <View style={{}}>
            <Image
              source={require('../../../Assets/Svg/Arrow.svg')}
              height={20}
              width={20}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    dispatch(GetAllPayments(cities));
  }, [dispatch, cities]);

  return (
    <View>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={10}>
        <View style={TeamStyle.TeamHeader}>
          <Text style={{fontSize: 32, fontWeight: '700', color: '#4369F6'}}>
            Payments
          </Text>
          {/* <Image
            source={require('../../../Assets/Images/search.png')}
            height={20}
            width={20}
          /> */}
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
            <Text style={{color: '#011A52', fontSize: 25}}>
              {totalParentAmount} INR
            </Text>
          </View>
          <View>
            <SelectDropdown
              data={countries}
              onSelect={(selectedItem, index) => {
                setCities(selectedItem);
                return selectedItem;
              }}
              defaultButtonText={'Select month'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
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
        <Animated.View
          style={{
            transform: [{translateY}],
          }}>
          <View
            style={{
              padding: 15,
              alignItems: 'center',
              backgroundColor: '#bfcdff',
              margin: 20,
              borderRadius: 20,
            }}>
            <BarChart
              data={reversedData}
              barWidth={20}
              initialSpacing={1}
              spacing={25}
              barBorderRadius={10}
              showGradient
              yAxisThickness={0}
              xAxisType={'dashed'}
              xAxisColor={'white'}
              yAxisTextStyle={{color: 'white'}}
              stepValue={stepValue}
              maxValue={maxValue}
              noOfSections={noOfSections}
              yAxisLabelTexts={yAxisLabelTexts}
              labelWidth={25}
              isAnimated
              xAxisLabelTextStyle={{color: 'white', textAlign: 'center'}}
            />
          </View>
        </Animated.View>

        <View style={PaymentStyle.PaymentT}>
          <Text style={{color: 'black', fontWeight: '600', fontSize: 19}}>
            Team Transactions
          </Text>
        </View>
        <FlatList
          data={payments}
          renderItem={renderRooms}
          keyExtractor={item => item.groupId}
        />
      </ScrollView>
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

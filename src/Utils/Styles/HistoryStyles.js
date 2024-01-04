import {StyleSheet} from 'react-native';

export const HistoryStyles = StyleSheet.create({
  HistoryHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  Bills: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    paddingBottom: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  BillHeading: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    width: 150,
  },
  BillTime: {
    color: '#707070',
    fontSize: 12,
    fontWeight: '500',
  },
});

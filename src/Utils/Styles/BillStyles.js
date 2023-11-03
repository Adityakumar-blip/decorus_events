const {StyleSheet} = require('react-native');

export const BillStyle = StyleSheet.create({
  BillHeading: {
    color: '#4369F6',
    fontSize: 32,
    fontWeight: '700',
  },
  BillTabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BillButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  InputFields: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#4287f5',
    marginBottom: 10,
    borderRadius: 10,
    color: '#7DA5FF',
    fontFamily: 'Lato',
    fontSize: 12.988,
    fontWeight: '700',
    letterSpacing: 0.26,
  },
  DownloadButton: {
    backgroundColor: '#4287f5',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
});

const { StyleSheet } = require("react-native");

export const Login = StyleSheet.create({
   LoginContainer :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25,
    marginBottom : 30
   }, 
   LoginImage  :{
    width: 250,
    height: 250,
    marginBottom: 20,
   },
   TextContainer :{
    width: '100%',
    marginBottom: 20,
   },
   LoginHeading :{
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 10,
    fontWeight: 'bold',
   },
   LoginPara  :{
    textAlign: 'left',
    fontSize: 16,
    color: '#333',
   },
   InputFields : {
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
   OtpButton : {
    backgroundColor: '#4287f5',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    
   },
   ButtonText :{
    color: 'white',
    fontWeight: 'bold',
   }
})
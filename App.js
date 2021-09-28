import 'react-native-gesture-handler';
import React from 'react';
import HomeNavigation from './navigation/HomeNavigation'
import { NavigationContainer  } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ShipmentUpdateNavigation from './navigation/ShipmentUpdateNavigation'
import DrawerContent from './shared/DrawerContent';
import { ActivityIndicator } from 'react-native-paper';
import { View, Alert } from 'react-native';
import { AuthContext } from './components/context';
import LoginScreen from './screens/auth/login'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Drawer = createDrawerNavigator();


export default function App() {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userId: null,
    userToken: null,
  }
  
  const loginReducer = (prevState, action) => {
    switch(action.type){
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userName: action.name,
          userId: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.name,
          userId: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userId: null,
          userToken: null,
          isLoading: false,
        };
    }
  };
  
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  
  const authContext = React.useMemo(()=>({
    signIn: (email, password) => {
      axios({
          method: "POST",
          url: 'https://courier.graphiccourier.com/api/stuff/login',
          data: {
            email, password
          }
      }).then(async (response) => {
        let userToken = null;
        let userName = null;  
        let userId = null;  

            if(!response.data.result.token){
              Alert.alert('Error', response.data.result.message)
            }else{
              userToken = response.data.result.token;
              userName = response.data.result.user_name;
              userId = JSON.stringify(response.data.result.user_id);


              let newDate = new Date()
              let date = `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`

              try {
                await AsyncStorage.setItem('token', userToken)
                await AsyncStorage.setItem('name', userName)
                await AsyncStorage.setItem('id', userId)
                await AsyncStorage.setItem('date', date)
                
                Alert.alert('Success', response.data.result.message)
                dispatch({type: 'LOGIN', token: userToken, name: userName, id: userId})
              } catch(e){
                // nothing
                
              }
              
            }
        }).catch(error => {
          console.log(error)
          Alert.alert('Error', 'Please check the internet connection')
        })
        
    }, 

    signOut: async () => {
      try{
        let userToken = null;
         const getData = async () => {
          userToken = await AsyncStorage.getItem('token')
        }
        getData();

        if(userToken !== null){
            axios({
              method: "POST",
              url: 'https://courier.graphiccourier.com/api/stuff/logout',
              headers: {Authorization: 'Bearer ' + userToken  }

            }).then(async (response) => {        

            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('name')
            await AsyncStorage.removeItem('id')
            await AsyncStorage.removeItem('date')
            }).catch(e=> {console.log(e)})

          }

      }catch(e){
        //nothing
      }
      dispatch({type: 'LOGOUT'})
    },
    getUserDetails: () => {
      return {
        user_token: loginState.userToken,
        user_name: loginState.userName,
        user_id: loginState.userId,
      }
    },

  }))
   
  React.useEffect(()=>{
    const getData = async () => {
      try {
        let userToken = null;
        let userName = null;
        let userId = null;

        userToken = await AsyncStorage.getItem('token')
        userName = await AsyncStorage.getItem('name')
        userId = await AsyncStorage.getItem('id')
        oldDate = await AsyncStorage.getItem('date')

        date = new Date()
        let newDate;
        newDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`

        if(oldDate != newDate && userToken !== null){
          
          axios({
            method: "POST",
            url: 'https://courier.graphiccourier.com/api/stuff/logout',
            headers: {Authorization: 'Bearer ' + userToken  }

          }).then(async (response) => {

            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('name')
            await AsyncStorage.removeItem('id')
            await AsyncStorage.removeItem('date')

            dispatch({type: 'LOGOUT'})

          }).catch(e=> {console.log(e)})       

        }
        

        if(userToken !== null) {
          dispatch({type: 'RETRIEVE_TOKEN', token: userToken, name: userName, id: userId})
        }else(
          dispatch({type: 'RETRIEVE_TOKEN', token: null, name: null, id: null})
        )
      } catch(e) {
        // error reading value
      }
    } 
    getData();

  }, [])

  if(loginState.isLoading){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}} >
        <ActivityIndicator />
      </View>
    )
  }


  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken != null && !loginState.isLoading ? (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props} /> }>
            <Drawer.Screen name="Home" component={HomeNavigation} />
            <Drawer.Screen name="ShipmentUpdate" component={ShipmentUpdateNavigation} />
          </Drawer.Navigator>
          ) :  (
            <LoginScreen /> 
          )      
        }
          
      </NavigationContainer> 
    </AuthContext.Provider>
  );
}


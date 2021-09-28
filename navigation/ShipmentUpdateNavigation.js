import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ArrivedScreen from '../screens/shipmentupdate/arrived'
import DispatchScreen from '../screens/shipmentupdate/dispatch'
import HomeScreen from '../screens/shipmentupdate/home'
import OutForDeliveryScreen from '../screens/shipmentupdate/outfordelivery'
import DeliveredScreen from '../screens/shipmentupdate/delivered'
import HoldScreen from '../screens/shipmentupdate/hold'
import ReturnScreen from '../screens/shipmentupdate/return'
import Header from '../shared/header'

const Stack = createStackNavigator();

export default function shipmentupdateStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomColor: '#DC2626',
          borderBottomWidth: 2
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          
        },
      }}
    >
      <Stack.Screen name="Home" 
        options={{title: 'Shipment Update' }} 
        component={HomeScreen} 
        options={({navigation})=>{
          return {headerTitle: () => <Header navigation={navigation} />
      }}}
      />
      <Stack.Screen name="Dispatch" component={DispatchScreen} />
      <Stack.Screen name="Arrived" component={ArrivedScreen} />
      <Stack.Screen name="OutForDelivery" options={{title: 'Out for Delivery' }} component={OutForDeliveryScreen} />
      <Stack.Screen name="Delivered" component={DeliveredScreen} />
      <Stack.Screen name="Hold" options={{title: 'Hold/Lost' }} component={HoldScreen} />
      <Stack.Screen name="Return" component={ReturnScreen} />
    </Stack.Navigator>
  )
}

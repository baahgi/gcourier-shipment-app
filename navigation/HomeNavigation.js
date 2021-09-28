import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Header from '../shared/header'
import HomeScreen from '../screens/home/home'


const Stack = createStackNavigator();
export default function HomeNavigation() {
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
            <Stack.Screen
                name="Home" 
                component={HomeScreen}
                options={({navigation})=>{
                    return {headerTitle: () => <Header navigation={navigation} />
                }}}
            />
        </Stack.Navigator>
    )
}

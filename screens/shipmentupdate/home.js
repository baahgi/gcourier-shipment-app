import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import NavButton from '../../shared/NavButton'
 

export default function Home({navigation}) {
    return (
        <ScrollView style={tw`p-2 bg-red-50`}>
            <View style={tw`my-4`}>
                <Text style={tw`text-2xl font-semibold text-center text-gray-900 underline`}>Shipment Updates</Text>
            </View>
            <NavButton nav={()=>{navigation.navigate('Dispatch')}} name="Dispatch"/>
            <NavButton nav={()=>{navigation.navigate('Arrived')}} name="Arrived"/>
            <NavButton nav={()=>{navigation.navigate('OutForDelivery')}} name="Out For Delivery"/>
            <NavButton nav={()=>{navigation.navigate('Delivered')}} name="Delivered"/>
            <NavButton nav={()=>{navigation.navigate('Hold')}} name="Hold/Lost"/>
            <NavButton nav={()=>{navigation.navigate('Return')}} name="Return"/>
                       
        </ScrollView>
    )
}

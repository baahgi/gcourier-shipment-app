import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Avatar } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import tw from 'tailwind-react-native-classnames'


export default function Header({ navigation }){
    return (
      <View style={tw`flex flex-row items-center`}>    
        <MaterialIcons 
          name="menu" 
          size={32} 
          style={tw`text-red-600`}
          onPress={() => navigation.openDrawer()}
        />
        <View style={tw`items-center flex-1`}>
            <Image 
              // size={5} 
              style={tw`w-12 h-12`}
              source={require('../assets/images/gcourier_logo.png')}
            />
        </View>
      </View>
      );
}

const stlyes = StyleSheet.create({

})
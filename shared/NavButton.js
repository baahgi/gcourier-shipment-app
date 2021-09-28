import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames'


export default function NavButton({ name, nav}) {
    return (
        <TouchableOpacity 
            style={tw`flex-row justify-center flex-1 py-3 my-4 bg-red-600 rounded-lg`}
            onPress={nav}
        >
            <Text style={tw`text-xl font-semibold tracking-wider text-white`}>{name}</Text>
        </TouchableOpacity>
    )
}

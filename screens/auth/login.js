import React, {useState} from 'react'
import { View,Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { useValidation } from 'react-native-form-validator';

import { AuthContext } from '../../components/context'

export default function signinScreen() {

    const { signIn } = React.useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: { email, password },
    });

    const handleSubmit = ()=>{
        const passValidation = validate({
            email: { email: true, required: true },
            password: { required: true }
        })
        if(passValidation){
            signIn(email, password)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={tw`items-center justify-center flex-1 bg-red-100`}>
            <View style={tw`w-64 rounded-lg`}>
                <Text style={tw`text-xl font-bold text-center text-gray-900 underline`}>Login</Text>
                <View style={tw`mt-4`}>
                    <Text style={tw`text-base font-semibold text-gray-600`}>Email: 
                        <Text style={tw`text-red-500`}> *</Text>
                    </Text>
                    <TextInput
                        placeholder="email"
                        onChangeText={(value) => setEmail(value)}
                        autoCapitalize="none"
                        value={email}
                        style={tw`h-10 px-4 mt-1 text-lg text-gray-700 border-2 border-gray-400 rounded-lg`}
                    />
                    {isFieldInError('email') &&
                    getErrorsInField('email').map((errorMessage, index) => (
                    <Text key={index} style={tw`text-xs text-red-500`}>{errorMessage}</Text>
                    ))}
                </View>
                <View style={tw`mt-4`}>
                    <Text style={tw`text-base font-semibold text-gray-600`}>Password: 
                        <Text style={tw`text-red-500`}> *</Text>
                    </Text>
                    <TextInput
                        // keyboardType='numeric'
                        placeholder="password"
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        style={tw`h-10 px-4 mt-1 text-lg text-gray-700 border-2 border-gray-400 rounded-lg`}
                    />
                    {isFieldInError('password') &&
                    getErrorsInField('password').map((errorMessage, index) => (
                    <Text key={index} style={tw`text-xs text-red-500`}>{errorMessage}</Text>
                    ))}
                </View>
                <View>
                    <View style={tw`flex-row justify-between mt-8`}>
                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={tw`px-16 py-1 text-lg tracking-wide text-red-500 bg-red-200 border border-red-500 rounded-lg`}>Login</Text>
                        </TouchableOpacity>                               
                    </View>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

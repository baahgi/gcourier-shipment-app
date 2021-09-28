import React, { useState, useEffect } from 'react'
import {
    View, Text,
    TextInput, TouchableWithoutFeedback, Keyboard,
    ScrollView, TouchableOpacity, Alert
} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import tw from 'tailwind-react-native-classnames'
import axios from 'axios'
import { useValidation } from 'react-native-form-validator';
import { MaterialIcons } from '@expo/vector-icons'
import { AuthContext } from '../../components/context'

import { Badge, ActivityIndicator } from 'react-native-paper';

export default function Return({ navigation }) {

    const { getUserDetails } = React.useContext(AuthContext)

    const [consignmentnos, setConsignmentnos] = useState([])
    const [number, setNumber] = useState('')

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true)
    const [updating, setUpdating] = useState(false)

    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: {number},
    });

    const addConsignmentno = () => {

        validate({
            number: { numbers: true, minlength: 12 },
        })
        if (number.length >= 12) {
            setConsignmentnos((prestate) => [...prestate, number]);
            setNumber('')
        }
    }

    const resetConsignmentnos = () => {
        setConsignmentnos([])
    }

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted')
        })()
    }

    useEffect(()=> {
        askForCameraPermission();
    }, [])

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setConsignmentnos((prestate) => [...prestate, data]);
    }
    const updateShipment = () => {
        setUpdating(true)

            axios({
                method: 'post',
    
                url: 'https://courier.graphiccourier.com/api/shipment/bulkupdate',
                data: {
                    status_id: 7,
                    consignmentno: consignmentnos,
                    user_id: getUserDetails().user_id,
                },

                headers: {Authorization: 'Bearer ' + getUserDetails().user_token}
            })
                .then((response) => {
                    setConsignmentnos([])

                    setUpdating(false)
                    Alert.alert(
                        response.data.status,
                        response.data.message
                    )
                })
                .catch(error => {
                    setUpdating(false)
                    Alert.alert('Network Error', 'Please check your internet connection')
                })

    }



    if(hasPermission === null){
        return (
            <View style={tw`items-center justify-center flex-1`}>
                <Text style={tw`text-lg tracking-wider`}>Requesting for camera permission</Text>
            </View>
        )
    }
    if(hasPermission === false){
        return (
            <View style={tw`items-center justify-center flex-1`}>
                <Text style={tw`text-lg tracking-wider`}>No access to camera</Text>
            </View>
        )
    }

    if(!scanned){
        return(
             <View style={tw`bg-red-50 `}>
                <TouchableOpacity style={tw`self-end`} onPress={() => setScanned(true)}>
                    <MaterialIcons name="cancel" size={48} style={tw`ml-2 bg-red-400 rounded-full`} color="white"/>
                </TouchableOpacity>
                <View>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{height: 540}}
                    />  
                </View>
            </View>
        )
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <ScrollView style={tw`bg-red-50`}>
                {scanned && 
                <View style={tw`flex-row justify-end`}>
                    <TouchableOpacity  onPress={() => setScanned(false)}>
                        <Text 
                            style={tw`p-4 text-sm font-bold tracking-wider text-red-500 bg-red-200 rounded-l-xl`}>
                            Tap to Scan
                        </Text>
                    </TouchableOpacity>
                </View>
                }        
               

                {/* form */}
                    <View style={tw`px-4 py-4 mx-2 my-8 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-xl font-bold text-center text-gray-900 underline`}>Update return status</Text>
                        <View style={tw`mt-4`}>
                            <Text style={tw`text-base font-semibold text-gray-600`}>Consignment Numbers: 
                                <Text style={tw`text-red-500`}> *</Text>
                            </Text>
                            <TextInput
                                keyboardType='numeric'
                                placeholder="consignment numbers"
                                onChangeText={(value) => setNumber(value)}
                                value={number}
                                style={tw`h-10 px-4 mt-1 text-lg text-gray-700 border-2 border-gray-400 rounded-lg`}
                            />
                            {isFieldInError('number') &&
                            getErrorsInField('number').map((errorMessage, index) => (
                            <Text key={index} style={tw`text-red-500`}>{errorMessage}</Text>
                            ))}
                            <View>
                            <View style={tw`flex-row justify-between mt-6`}>
                                <TouchableOpacity onPress={addConsignmentno}>
                                    <Text style={tw`px-16 py-1 text-lg tracking-wide text-red-500 bg-red-200 border border-red-500 rounded-lg`}>Add</Text>
                                </TouchableOpacity>
                            
                                <TouchableOpacity onPress={resetConsignmentnos}>
                                    <Text style={tw`px-6 py-1 text-lg text-gray-500 border border-gray-600 rounded-lg`}>Reset</Text>
                                </TouchableOpacity>                                
                            </View>
                            </View>
                        </View>
                        <View style={tw`pb-2 mt-6 text-lg bg-gray-100 rounded-lg`}>
                            <View style={tw`flex-row px-3 py-1 mb-1 bg-gray-200 border-b border-gray-100`}>
                                <Badge size={24}>{consignmentnos.length}</Badge>
                                <Text style={tw`ml-4 text-base`}>items added</Text>
                            </View>
                           
                                <View style={tw`p-1 px-3 rounded-lg`}>
                                    {consignmentnos.map((item, index) => {
                                        return (
                                            <View style={tw`flex-row `} key={index}>
                                                <Text style={tw`mr-4 text-gray-700`}>{index + 1}.</Text>
                                                <Text style={tw`text-gray-700`}>{item}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                        </View>
                                        
                        {consignmentnos.length > 0 && !updating &&
                        <View style={tw`mt-8 `}>
                            <TouchableOpacity onPress={updateShipment}>
                                <Text style={tw`px-6 py-2 text-xl text-center text-red-100 bg-red-600 rounded-lg`}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        {updating &&
                        <View style={tw`mt-8`}>
                            <ActivityIndicator color='red'></ActivityIndicator>
                        </View>
                        }
                    </View>

                
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}


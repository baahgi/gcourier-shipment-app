import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { useValidation } from 'react-native-form-validator';
import { BarCodeScanner } from 'expo-barcode-scanner'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../../components/context'

export default function Home() {

    const { getUserDetails } = React.useContext(AuthContext)


    const [number, setNumber] = useState('')
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true)
    const [data, setDate] = useState(null);
    const [searching, setSearching] = useState(false);

    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: {number},
    });

    const handleSearch = () => {
        const passValidation =validate({
            number: { numbers: true, minlength: 12, required: true },
        })

        if(passValidation){
            setSearching(true);
            axios({
                method: "POST",
                url: 'https://courier.graphiccourier.com/api/shipment/track',
                data: {
                    consignment_no: number
                },
                headers: {Authorization: 'Bearer ' + getUserDetails().user_token}
            }).then(response => {
                setDate(response.data);
                setNumber('')
                setSearching(false);
    
            }).catch(error => {
                console.log(error)
            })
        }
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
        setNumber(data);
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

    if(searching){
        return (
            <View style={tw`items-center justify-center flex-1`}>
                <ActivityIndicator color='red' size={24}/>
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
        <ScrollView style={tw`bg-red-50`}>
                {scanned && 
                    <TouchableOpacity style={tw`flex-row justify-end mb-2`} onPress={() => setScanned(false)}>
                        <Text 
                            style={tw`p-4 text-sm font-bold tracking-wider text-red-500 bg-red-200 rounded-l-xl`}>
                            Tap to Scan
                        </Text>
                    </TouchableOpacity>
                }


                <View style={tw`flex-row items-center justify-between mx-1 mt-4`}>
                    <View style={tw`flex-1`}>
                    <TextInput
                        keyboardType='numeric'
                        placeholder="consignment number"
                        onChangeText={(value) => setNumber(value)}
                        value={number}
                        style={tw`h-10 px-4 text-lg w-full text-gray-700 border-2 border-gray-400 rounded-lg`}
                    />                   
                    
                    </View>
                    <View style={tw``}>
                        <TouchableOpacity onPress={handleSearch}>
                            <Text style={tw`px-4 py-1 text-lg ml-4 tracking-wide text-red-500 bg-red-200 border border-red-500 rounded-lg`}>Search</Text>
                        </TouchableOpacity>                              
                    </View>
                </View>
                    {isFieldInError('number') &&
                        getErrorsInField('number').map((errorMessage, index) => (
                    <Text key={index} style={tw`text-red-500 ml-6 text-xs`}>{errorMessage}</Text>
                    ))}

                {data &&
                    <View style={tw` pb-2 mt-6 text-lg bg-gray-100 rounded-lg`}>
                    
                    
                    <View style={tw` py-1 mb-1 bg-gray-200 border-b border-gray-100`}>
                        <View style={tw`flex-row justify-between`}>
                            <Text style={tw`ml-2 text-base underline font-bold`}>Details</Text>
                            <Text style={tw`mr-2 text-base bg-gray-400 rounded-full px-2 font-bold`}>{data.shipment.status}</Text>
                        </View>
                        <View style={tw`ml-2`}>
                            <View style={tw`flex-row mt-1`}>
                                <Text style={tw`text-gray-700`}>Consignmentno: </Text>
                                <Text style={tw`ml-2 text-gray-500`}>{data.consignment_no}</Text>
                            </View>
                            <View style={tw`flex-row mt-1`}>
                                <Text style={tw`text-gray-700`}>Sender Name: </Text>
                                <Text style={tw`ml-2 text-gray-500`}>{data.shipment.sender_name}</Text>
                            </View>
                            <View style={tw`flex-row mt-1`}>
                                <Text style={tw`text-gray-700`}>Receiver Name: </Text>
                                <Text style={tw`ml-2 text-gray-500`}>{data.shipment.receiver_name}</Text>
                            </View>
                            <View style={tw`flex-row mt-1`}>
                                <Text style={tw`text-gray-700`}>Origin: </Text>
                                <Text style={tw`ml-2 text-gray-500`}>{data.shipment.origin}</Text>
                            </View>
                            <View style={tw`flex-row mt-1`}>
                                <Text style={tw`text-gray-700`}>Destination: </Text>
                                <Text style={tw`ml-2 text-gray-500`}>{data.shipment.destination}</Text>
                            </View>
                            
                        </View>
                    </View>
                    {/* <Text>{data.shipment.status_updates}</Text> */}
                    {data.shipment.status_updates.map((status, index)=>{
                        return (
                            <View key={index} style={tw`ml-4 text-base flex-row justify-between items-center`}>
                                <View style={tw`pr-4 py-4`}>
                                    <Text style={tw`text-gray-600 text-xs`}>
                                        {new Date(status.updated_at).getDate()}-{new Date(status.updated_at).getMonth()}-{new Date(status.updated_at).getFullYear()}
                                    </Text>
                                    <Text style={tw`text-gray-600 text-xs`}>
                                        {new Date(status.updated_at).getHours()} : {new Date(status.updated_at).getMinutes()} : {new Date(status.updated_at).getSeconds()} 
                                    </Text>
                                </View>
                                <View style={tw`flex-1 pl-6 `}>
                                    <Text style={tw`font-bold text-xl`}>{status.status} </Text>
                                    <Text style={tw`text-gray-600 text-xs`}>{status.station} </Text>
                                </View>
                            </View>   
                        )
                    })}
                               
                                             
                </View>
                }
            </ScrollView>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import {
    View, Text,  Image, TextInput, 
    TouchableWithoutFeedback, Keyboard,
    ScrollView, TouchableOpacity, Alert
} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import tw from 'tailwind-react-native-classnames'
import axios from 'axios'
import { useValidation } from 'react-native-form-validator';
import { Picker } from '@react-native-picker/picker'
import { Camera } from 'expo-camera'
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AuthContext } from '../../components/context'

import { Badge, ActivityIndicator } from 'react-native-paper';


export default function Delivered({ navigation }) {

    const { getUserDetails } = React.useContext(AuthContext)

    const [consignmentnos, setConsignmentnos] = useState([])
    const [number, setNumber] = useState('')
    const [name, setName] = useState('')
    const [idtype, setIdtype] = useState('Electrol Card')
    const [idnumber, setIdnumber] = useState('')
    const [pod, setPod] = useState('')
    const [datetime, setDatetime] = useState(new Date())
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true)
    const [updating, setUpdating] = useState(false)
    //for camera
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [isPreview, setIsPreview] = useState(false)
    const [isCameraReady, setIsCameraReady] = useState(false)
    const cameraRef = useRef()
    //for datetime
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: { name, number },
    });

    const addConsignmentno = () => {
        validate({
            number: { numbers: true, minlength: 11 },
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
            // const { status } = await Camera.requestPermissionsAsync();
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


    const onSnap = async () => {
        if(cameraRef.current) {
            const option = {  quality: 0.1, base64: true }
            let photo = await cameraRef.current.takePictureAsync(option);
            const source = photo.base64

            if(source){
                let base64Img =`data:image/png;base64,${source}`;
                setPod(base64Img);
                setIsCameraReady(false)
                setIsPreview(true)
            }
        }        
    }

    const cancelPreview = () => {
        setIsPreview(false)
        setPod('')
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || datetime;
        setShow(Platform.OS === 'ios');
        setDatetime(currentDate);
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };
    
      const showTimepicker = () => {
        showMode('time');
      };

    const updateShipment = () => {
        setUpdating(true)

        axios({
            method: 'post',
            url: 'https://courier.graphiccourier.com/api/shipment/bulkupdate',
            data: {
                status_id: 6,
                name: name,
                consignmentno: consignmentnos,
                idtype: idtype,
                idnumber: idnumber,
                pod: pod,
                datetime: datetime,
                user_id: getUserDetails().user_id,
            },
            headers: {Authorization: 'Bearer ' + getUserDetails().user_token}
        })
        .then((response) => {
            setIsPreview(false)
            setConsignmentnos([])
            setName('')
            setNumber('')
            setIdnumber('')
            setPod('')
            setDatetime(new Date())
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
            {isCameraReady ?
                (
                    <View style={tw`z-20 h-full bg-gray-100`}>
                        <TouchableOpacity style={tw`z-30 self-end`}  onPress={() => setIsCameraReady(false)}>
                            <MaterialIcons name="cancel" size={32} style={tw`ml-2 bg-red-500 rounded-full right-2 top-2`} color="white"/>
                        </TouchableOpacity>
                        <View  style={{}}>
                            <Camera
                                ref={cameraRef}
                                type={cameraType}
                                style={tw`h-96`}
                            />  

                            <TouchableOpacity style={tw`flex-row justify-center mt-8 `} onPress={onSnap}>
                                <MaterialIcons name="camera" size={48} style={tw`text-red-500`} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    
            <ScrollView style={tw`bg-red-50`}>
                 {scanned && 
                    (
                    <View style={tw`flex-row justify-end`}>
                        <TouchableOpacity onPress={() => setScanned(false)}>
                            <Text 
                                style={tw`p-4 text-sm font-bold tracking-wider text-red-500 bg-red-200 rounded-l-xl`}>
                                Tap to Scan
                            </Text>
                        </TouchableOpacity>
                    </View>
                    )
                }
                  

                {/* form */}
                    <View style={tw`px-4 py-4 mx-2 my-8 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-xl font-bold text-center text-gray-900 underline`}>Update Delivered Status</Text>
                        <View style={tw`mt-4`}>
                            <Text style={tw`text-base font-semibold text-gray-600`}>Consignment Numbers: 
                                <Text style={tw`text-red-500`}> *</Text>
                            </Text>
                            <TextInput
                                keyboardType='numeric'
                                placeholder="consignment numbers"
                                onChangeText={(value) => setNumber(value)}
                                value={number}
                                style={tw`h-10 px-4 mt-1 text-lg text-gray-600 border-2 border-red-200 rounded-lg`}
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
                         
                        
                        <View style={tw`mt-8`}>
                            <Text style={tw`text-base font-semibold`}>Name:</Text>
                            <TextInput
                                placeholder="Name of Receiver"
                                onChangeText={(value) => setName(value)}
                                value={name}
                                style={tw`h-10 px-4 mt-1 text-lg text-gray-600 border-2 border-red-200 rounded-lg`}
                            />
                        </View>
                        <View style={tw`mt-4`}>
                            <Text style={tw`text-base font-semibold`}>ID Type:</Text>
                            <Picker
                            // style={{ height: 50, width: 150 }}
                            selectedValue={idtype}
                            onValueChange={(itemValue) => setIdtype(itemValue)}
                            style={tw`h-10 px-4 mt-1 text-lg text-gray-600 border-2 border-red-200 rounded-lg`}
                            >
                                <Picker.Item label="Electrol Card" value="Electrol Card" />
                                <Picker.Item label="Driving License" value="Driving License" />
                                <Picker.Item label="Passport" value="Passport" />
                            </Picker>
                        </View>
                        <View style={tw`mt-4`}>
                            <Text style={tw`text-base font-semibold`}>ID Number:</Text>
                            <TextInput
                                placeholder="Enter ID Number"
                                onChangeText={(value) => setIdnumber(value)}
                                value={idnumber}
                                style={tw`h-10 px-4 mt-1 text-lg text-gray-600 border-2 border-red-200 rounded-lg`}
                            />
                        </View>
                        <View style={tw`mt-4`}>
                            <Text style={tw`text-base font-semibold`}>Proof of Delivery:</Text>
                        
                        {isPreview ?
                            (
                            <View style={tw`flex-row justify-center py-1 mt-8 border`}>
                                <Image style={tw`w-64 h-96`} source={{uri: pod}}/>
                                <TouchableOpacity onPress={cancelPreview}>
                                    <MaterialIcons name="cancel" size={32} style={tw`ml-2 bg-red-500 rounded-full`} color="white"/>
                                </TouchableOpacity>
                            </View>
                            ): (
                            <View style={tw`flex-row flex-1 mt-8`}>
                                <TouchableOpacity style={tw`px-4 py-2 bg-red-500 rounded `} onPress={()=> setIsCameraReady(true)}>
                                    <MaterialIcons name="camera-alt" size={32} color="white"/>
                                </TouchableOpacity>
                            </View>
                            )
                        }
                        </View>

                        <View style={tw`mt-6`}>
                            <Text style={tw`text-base font-semibold`}>Actual Delivery Date & Time:</Text>
                            <View style={tw`flex flex-row px-4 py-2 my-4 bg-red-300 rounded`}>
                                <Text style={tw`text-lg font-medium text-gray-900`}>
                                    {datetime.getDate()} / {datetime.getMonth()} / {datetime.getFullYear()} --- {datetime.getHours()}:{datetime.getMinutes()}
                                </Text>
                            </View>
                            <View>
                            <View style={tw`flex-row justify-center`}>
                                <TouchableOpacity onPress={showDatepicker} style={tw`px-4 py-2 bg-red-500 rounded`}>
                                    <MaterialIcons name="calendar-today" size={32} color="white"/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={showTimepicker} style={tw`px-4 py-2 ml-8 bg-red-500 rounded`}>
                                    <MaterialIcons name="access-time" size={32} color="white"/>
                                </TouchableOpacity>
                            </View>
                     
                            {show && (
                                <DateTimePicker
                                testID="dateTimePicker"
                                value={datetime}
                                mode={mode}
                                is24Hour={true}
                                display="spinner"
                                onChange={onChange}
                                />
                            )}
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
        )
        }
        </TouchableWithoutFeedback>
    )
}

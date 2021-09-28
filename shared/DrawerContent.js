import React from 'react'
import { View,} from 'react-native'
import { Drawer, Text} from 'react-native-paper'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import tw from 'tailwind-react-native-classnames'
import { MaterialIcons } from '@expo/vector-icons'

import { AuthContext } from '../components/context'


export default function DrawerContent( props ) {
    const [active, setActive] = React.useState('');

    const { signOut, getUserDetails } = React.useContext(AuthContext)
    
    return (
        <View style={{flex:1}} >
            <DrawerContentScrollView {...props}>
                {/* <DrawerItemList {...props} /> */}
                    {/* <Text>{JSON.stringify(props)}</Text> */}
                <View style={tw`flex-row items-center px-4 py-6 bg-red-100`}>
                    <Text style={tw`w-3 h-3 bg-green-500 rounded-full`}>  </Text>
                    <Text style={tw`ml-4 font-medium capitalize`}>
                         {getUserDetails().user_name}
                    </Text>                    
                </View>
                <Drawer.Section title="Menu" >
                    <Drawer.Item
                        label="Home"
                        active={active === 'first'}
                        onPress={() => {
                            setActive('first')
                            props.navigation.navigate('Home')
                        }}
                    />
                    <Drawer.Item
                        label="Shipment Update"
                        active={active === 'second'}
                        onPress={() => {
                            setActive('second')
                            props.navigation.navigate('ShipmentUpdate')
                        }}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={tw`mb-4 border-t-2 border-gray-400`}>
                <DrawerItem 
                    icon={()=>(
                        <MaterialIcons name="logout" 
                            size={32} 
                            color="black"
                        />
                    )}
                    label="sign  out"
                    onPress={()=>{signOut()}}
                />
            </Drawer.Section>
        </View>
    )
}

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useLinkTo } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ImagePickerTest from './screens/ImagePickerTest';
import React from 'react';


import Otp from './src';
import SignupScreen from './screens/SignupScreen';
import PhoneScreen from './screens/PhoneScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import ScanScreen from './screens/ScanScreen';
import FriendScreen from './screens/FriendScreen';

import * as Notifications from 'expo-notifications';

import * as Linking from 'expo-linking'

const Stack = createNativeStackNavigator();


// const prefix = Linking.makeUrl('/')

export default function App() {

const universal = Linking.createURL('https://app.example.com')
const prefix = Linking.createURL('://app')

const linkTo = useLinkTo();


React.useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.url;
    console.log("RESPONSE DATA : ", response.notification.request.content.data.url)
    Linking.openURL(prefix + url)
  });
  return () => subscription.remove();
}, []);


  return (
    <NavigationContainer linking={{
      prefixes: [prefix],
      config: {
        screens: {
          Friend: {
            path: "friend/:name",
            parse:{
              name: (name) => `${name}`
            }
          },
          Home: "home",
        }
      }
    }}>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Otp" component={PhoneScreen} options={{presentation: 'modal'}} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen name="Friend" component={FriendScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} options={{presentation: 'modal'}} />
        <Stack.Screen name="Scan" component={ScanScreen} options={{presentation: 'modal'}} />
        {/* <Stack.Screen name="Image" component={ImagePickerTest} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

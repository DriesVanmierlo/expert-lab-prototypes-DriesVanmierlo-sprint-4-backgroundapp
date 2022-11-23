import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'
import { useNavigation } from '@react-navigation/native'

const QRCodeScreen = () => {

  const navigation = useNavigation()
  const payload = { uid: 'ds56f1d6s', name: 'Matthias Van De Casteele', pushToken: 'ExponentPushToken[hn6RZLHd0jNJw73wSRZi16]'}


  return (
    <View>
      <QRCode value={JSON.stringify(payload)} />
      <Button title='Go scanner' onPress={() => navigation.navigate('Scan')} />
    </View>
  )
}

export default QRCodeScreen

const styles = StyleSheet.create({})
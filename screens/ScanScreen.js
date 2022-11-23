import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'

const ScanScreen = () => {

    const [loading, setLoading] = useState(true)
    const [scanData, setScanData] = useState(null)
    const [permission, setPermission] = useState(true)

    useEffect(() => {
        requestCameraPermission()
    },[])

    const requestCameraPermission = async () => {
        try{
            const {status, granted} = await BarCodeScanner.requestPermissionsAsync()
            console.log(`status: ${status}, granted: ${granted}`)

            if(status === 'granted'){
                console.log('Acces granted');
                setPermission(true)
            } else {
                setPermission(false)
            }
        } catch (error) {
            console.log(error)
            setPermission(false)
        } finally {
            setLoading(false)
        }
    }

    if(loading) return (<View style={styles.container}><Text>Requesting permission ...</Text></View>)
    if(scanData) return (
        <View style={styles.container}>
            <Text>UID: {scanData.uid}, Name: {scanData.name}, pushToken: {scanData.pushToken}</Text>
            <Button title="Scan again" onPress={() => setScanData(undefined)} />
        </View>)
    if(permission) return (
        <BarCodeScanner 
        style={[styles.container]}
        onBarCodeScanned={({type, data}) => {
            try {
                console.log(type)
                console.log(data)
                let _data = JSON.parse(data)
                setScanData(_data)
            } catch (error) {
                console.log('Unable to parse: ', error)
            }
        }}
        >
            <Text style={styles.text}>Scan the QR code</Text>
        </BarCodeScanner>
    )

  return (
    <View style={styles.container}>
    </View>
  )
}

export default ScanScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        backgroundColor: 'black',
        color: 'white'
    }
})
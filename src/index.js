import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../config'
import firebase from 'firebase/compat/app'

const Otp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
        .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
        .then(setVerificationId);
        setPhoneNumber('');
  };

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
    );
    firebase.auth().signInWithCredential(credential)
        .then(() => {
            setCode('')
        })
        .catch((error) => {
            //show an alert in case of error
            alert(error);
        })
        Alert.alert(
            'Login succesfull. welcome to Dashboard'
        );
  }

  return (
    <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal 
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
        />
        <Text style={styles.otpText}>
            Login using OTP
        </Text>
        <TextInput
            placeholder='Phone number with country code'
            onChangeText={setPhoneNumber}
            keyboardType='phone-pad'
            autoCompleteType='tel'
            style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendVerification} onPress={sendVerification}>
            <Text style={styles.buttonText}>
                Send verification
            </Text>
        </TouchableOpacity>
        <TextInput
            placeholder='Confirm code'
            onChangeText={setCode}
            keyboardType='number-pad'
            style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
            <Text style={styles.buttonText}>
                Confirm verification
            </Text>
        </TouchableOpacity>
    </View>
  )

}

export default Otp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        padding: 12,
        backgroundColor: '#ddd',
        marginTop: 24
    },
    sendVerification: {
        marginTop: 6,
        color: '#fff',
        padding: 12,
        backgroundColor: '#55f'
    },
    sendCode: {
        marginTop: 6,
        color: '#fff',
        padding: 12,
        backgroundColor: '#2f2' 
    }
})
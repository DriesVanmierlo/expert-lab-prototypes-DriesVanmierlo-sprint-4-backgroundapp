import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebaseConfig, auth, upload} from '../config'
import firebase from 'firebase/compat/app'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const handleSignup = () => {
        navigation.navigate("Signup")
    }

    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
            })
            .catch(error => alert(error.message))
    }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
        placeholder='Email'
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        />
        <TextInput
        placeholder='Password'
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
        >
            <Text style={styles.buttonText}>Login</Text>

        </TouchableOpacity>
        <TouchableOpacity
            onPress={handleSignup}
            style={[styles.button, styles.buttonOutline]}
        >
            <Text style={styles.buttonOutlineText}>Go to signup</Text>

        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: '#fff',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    },
})
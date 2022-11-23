import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FriendScreen = ({ route }) => {

    const {
        params: { name },
      } = route;

  return (
    <View style={styles.container}>
      <Text>{name} is your new friend!</Text>
    </View>
  )
}

export default FriendScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
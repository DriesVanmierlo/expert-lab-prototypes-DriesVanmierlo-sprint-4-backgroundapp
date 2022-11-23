import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { auth } from '../config';
import * as Location from "expo-location"


const BACKGROUND_FETCH_TASK = 'background-fetch';

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null


// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function BackgroundFetchScreen () {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [position, setPosition] = useState({})

  // 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
  
    const user = {
        "location": {
            "latitude": position.latitude,
            "longitude": position.longitude
        }
    }
    
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()} from user ${auth.currentUser.uid} and location ${user.location.latitude}`);
    
  
    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  // Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error(error)
      return
    }
    if (data) {
      // Extract location coordinates from data
      const { locations } = data
      const location = locations[0]
      if (location) {
        console.log("Location in background", location.coords)
        setPosition(location.coords)
      }
    }
  })

  useEffect(() => {
    console.log("CURRENT POSITION: ",position)
  }, [position])

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

    // Request permissions right after starting the app
    useEffect(() => {
        const requestPermissions = async () => {
          const foreground = await Location.requestForegroundPermissionsAsync()
          if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
        }
        requestPermissions()
      }, [])
    
      // Start location tracking in background
      const startBackgroundUpdate = async () => {
        // Don't track position if permission is not granted
        const { granted } = await Location.getBackgroundPermissionsAsync()
        if (!granted) {
          console.log("location tracking denied")
          return
        }
    
        // Make sure the task is defined otherwise do not start tracking
        const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
        if (!isTaskDefined) {
          console.log("Task is not defined")
          return
        }
    
        // Don't track if it is already running in background
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
          LOCATION_TASK_NAME
        )
        if (hasStarted) {
          console.log("Already started")
          return
        }
    
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          // For better logs, we set the accuracy to the most sensitive option
          accuracy: Location.Accuracy.BestForNavigation,
          // Make sure to enable this notification if you want to consistently track in the background
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Location",
            notificationBody: "Location tracking in background",
            notificationColor: "#fff",
          },
        })
      }
    
      // Stop location tracking in background
      const stopBackgroundUpdate = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
          LOCATION_TASK_NAME
        )
        if (hasStarted) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
          console.log("Location tacking stopped")
        }
      }

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background fetch status:{' '}
          <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background fetch task name:{' '}
          <Text style={styles.boldText}>
            {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
          </Text>
        </Text>
      </View>
      <View style={styles.textContainer}></View>
      <Button
        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
        onPress={toggleFetchTask}
      />


      <View style={styles.container}>
      <View style={styles.controls}>
      <Text>Longitude: {position?.longitude}</Text>
      <Text>Latitude: {position?.latitude}</Text>
      <View style={styles.separator} />
      <Button
        onPress={startBackgroundUpdate}
        title="Start in background"
        color="green"
      />
      <View style={styles.separator} />
      <Button
        onPress={stopBackgroundUpdate}
        title="Stop in background"
        color="red"
      />
    </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
});
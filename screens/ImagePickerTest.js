import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth , upload } from '../config';
import UserPermissions from '../utilities/UserPermissions';
import ImgToBase64 from 'react-native-image-base64';


import {getStorage, ref, uploadBytes} from 'firebase/storage'

export default function ImagePickerTest() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log(image);
  }, [image])

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.cancelled) {
//       setImage(result.uri);
//     }
//   };


//   const handlePickImage = async () => {
//     UserPermissions.getCameraPermission()
//     let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4,3]
//     })

//     if(!result.canceled){
//         console.log(result.assets[0].uri)
//         ImgToBase64.getBase64String(result.assets[0].uri)
//         .then(base64String => setImage(base64String))
//         .catch(error => alert(error.message))
//     }
//   }

const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1]
    })

    if (!result.canceled) {
        setImage(result.assets[0].uri)
    }

    upload(image, )
}

//   const storage = getStorage();
//   const filename = "test.jpg"
//   const storageRef = ref(storage, filename);

//   uploadBytes(storageRef, image).then((snapshot) => {
//     console.log('Uploaded a blob or file!');
//   });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={handlePickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

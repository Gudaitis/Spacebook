
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Button} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Camera } from 'expo-camera';

class CameraScreen extends Component{
    constructor(props){
      super(props);
  
      this.state = {
        hasPermission: null,
        type: Camera.Constants.Type.back
      }
    }


sendToServer = async (data) => {
    // Get these from AsyncStorage
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
        method: "POST",
        headers: {
            "Content-Type": "image/png",
            "X-Authorization": value
        },
        body: blob
    })
    .then((response) => {
        console.log("Picture added", response);
        this.props.navigation.navigate("Profile")
    })
    .catch((err) => {
        console.log(err);
    })
    
}

  takePicture = async () => {
      if(this.camera){
          const options = {
              quality: 0.5, 
              base64: true,
              onPictureSaved: (data) => this.sendToServer(data)
          };
          await this.camera.takePictureAsync(options); 
      } 
  }
  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});  
}
       

render(){
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else{
      return(
        <Text>No access to camera</Text>
      );
    }
}
}


  export default CameraScreen


  const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
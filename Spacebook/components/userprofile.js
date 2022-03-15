import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Button, Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Camera } from 'expo-camera';


class UserProfileScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: {},
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        newEmail: '',
        newPassword: '',
        newFirstName: '',
        newLastName: '',
        photo: null,

      }
    }
      componentDidMount() {
          this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getUserProfile();
          this.get_profile_image();
        });  
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }
    
    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
      };

    getUserProfile = async () => {
        const user_id = await AsyncStorage.getItem('@user_id');
        const value = await AsyncStorage.getItem('@session_token');
        console.log(user_id)
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
              method: 'get',
              'headers': {
              'X-Authorization':  value,
              },
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                    throw 'Unauthorised';
                }else if(response.status === 404){
                    throw 'Not found';
                }else if(response.status === 500){
                    throw 'Server error';
                }
            })
            
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson
                })
              })

            .catch((error) => {
                console.log(error);
            })

      }

      updateUserProfile = async () => {
        const newInfo = {}


        if (this.state.newFirstName != this.state.first_name) {
          newInfo['first_name'] = this.state.first_name;
        }
        if (this.state.newLastName != this.state.last_name) {
          newInfo['last_name'] = this.state.last_name;
        }
        if (this.state.newEmail != this.state.email) {
          newInfo['email'] = this.state.email;
        }
        if (this.state.newPassword != this.state.password) {
          newInfo['password'] = this.state.password;
        }

        
        const user_id = await AsyncStorage.getItem('@user_id');
        const value = await AsyncStorage.getItem('@session_token');
        console.log(user_id)
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
              method: 'PATCH',
              'headers': {
              'content-type': 'application/json',
              'X-Authorization': value
              },
              body: JSON.stringify(newInfo)
            })
            .then((res) => {
              this.getUserProfile();
            })
            .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 400){
                  throw 'Bad request'
              }else if(response.status === 401){
                  throw 'Unauthorised';
              }else if(response.status === 403){
                  throw 'Forbidden'
              }else if(response.status === 404){
                  throw 'Not found';
              }else if(response.status === 500){
                  throw 'Server error';
              }
          })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson
                })
              })
            .catch((error) => {
                console.log(error);
            })
      }
      get_profile_image = async () => {
        const user_id = await AsyncStorage.getItem('@user_id');
        const value = await AsyncStorage.getItem('@session_token');
        fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
          method: 'GET',
          headers: {
            'X-Authorization': value
          }
        })
        .then((res) => {
          return res.blob();
        })
        .then((resBlob) => {
          let data = URL.createObjectURL(resBlob);
          this.setState({
            photo: data,
            isLoading: false
          });
        })
        .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
              throw 'Unauthorised';
          }else if(response.status === 404){
              throw 'Not found';
          }else if(response.status === 500){
              throw 'Server error';
          }
      })
        .catch((err) => {
          console.log("error", err)
        });
      }
    


      logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render() {

      if (this.state.isLoading){
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Loading..</Text>
        
          </View>
  
          
        );
    
        }else{
          return (
            <View>
              <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: 200,
              height: 200,
              borderWidth: 5 
            }}
          />
              
                <Text>{"Hello " + this.state.listData.first_name + " " + this.state.listData.last_name + "\n" + "Your current email address is: " + this.state.listData.email + "\n" + "You currently have: " + this.state.listData.friend_count + " friends!"} </Text>

                <Button
                title="Update your profile picture"
                onPress={() => this.props.navigation.navigate("Camera")}/>
                
                <TextInput
               placeholder='Enter your first name'
               onChangeText={(first_name) => this.setState({first_name})}
               value={this.state.first_name}
               style={{padding:5, borderWidth:1, margin:5}}
               ></TextInput>

              <TextInput
               placeholder='Enter your second name'
               onChangeText={(last_name) => this.setState({last_name})}
               value={this.state.last_name}
               style={{padding:5, borderWidth:1, margin:5}}
               ></TextInput>

               <TextInput
               placeholder='Enter your new email address'
               onChangeText={(email) => this.setState({email})}
               value={this.state.email}
               style={{padding:5, borderWidth:1, margin:5}}
               ></TextInput>
        

              <TextInput
               placeholder='Enter your new password'
               onChangeText={(password) => this.setState({password})}
               value={this.state.password}
               secureTextEntry
               style={{padding:5, borderWidth:1, margin:5}}
               ></TextInput>
        
               <Button
               title="Update your details"
               onPress={() => this.updateUserProfile()}
              
               ></Button>
               
                <ScrollView>
                    <Button
                    title="Logout"
                    onPress={() => this.logout()}>    
                    </Button>
                </ScrollView>
                  <View>
                  </View>
            </View>
          );
    }
}}







export default UserProfileScreen


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
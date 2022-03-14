import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, TouchableOpacity, ScrollView, Button} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


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
        newLastName: ''

      }
    }
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getUserProfile();
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
      console.log(this.state)
      console.log(this.listData)
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
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
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
                }else if(response.status === 401){
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
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
                <Text>{"Hello " + this.state.listData.first_name + " " + this.state.listData.last_name + "\n" + "Your current email address is: " + this.state.listData.email + "\n" + "You currently have: " + this.state.listData.friend_count + " friends!"} </Text>
               
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
    }


}







export default UserProfileScreen
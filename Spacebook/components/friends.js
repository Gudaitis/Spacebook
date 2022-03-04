import React, {Component} from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';



class FriendScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: []
      }
    }
    friendsList = async () => {

        //Validation here...

        return fetch("http://localhost:3333/api/1.0.0/user/{user_id}/friends", {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                this.props.navigation.navigate("Main");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    
    render(){
        return (
           <View></View>
        )
    }
}

export default FriendScreen;
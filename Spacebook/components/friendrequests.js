import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, TouchableOpacity} from 'react-native';


class FriendRequestsScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: []

      }
    }

request = async () => {

    //Validation here...
    const value = await AsyncStorage.getItem('@session_token')

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
        method: 'get',
        headers: {
            'X-Authorization': value
        },
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
.then((responseJson) => {
    this.setState({
        isLoading:false,
        listData: responseJson
    })
})
.catch((error) => {
    console.log(error)
})
} 
    addFriend = async () => {

    //Validation here...
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token')

    return fetch("http://localhost:3333/api/1.0.0/friendrequests" + user_id, {
        method: 'post',
        headers: {
            'X-Authorization': value
        },
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
.then((responseJson) => {
    this.setState({
        isLoading:false,
        listData: responseJson
    })
})
.catch((error) => {
    console.log(error)
})
} 
delFriend = async () => {

    //Validation here...
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token')

    return fetch("http://localhost:3333/api/1.0.0/friendrequests" + user_id, {
        method: 'delete',
        headers: {
            'X-Authorization': value
        },
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
.then((responseJson) => {
    this.setState({
        isLoading:false,
        listData: responseJson
    })
})
.catch((error) => {
    console.log(error)
})
} 


componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.request();
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
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>{"You've got a new friend request from" + item.first_name +  " " + item.last_name}</Text>
                      <TouchableOpacity
                      onPress={() => this.addFriend(item.user_id)}>
                          <Text>Accept friend</Text>

                      </TouchableOpacity>
                      <TouchableOpacity
                      onPress={() => this.delFriend(item.user_id)}>
                          <Text>Delete friend</Text>

                      </TouchableOpacity>
                    </View>
                )}
              />
              <View>
              </View>
        </View>
      );
    }
}
}

    export default FriendRequestsScreen;
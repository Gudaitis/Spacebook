import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';


class FriendRequestsScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: [],
        friend: 0

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
        }else if(response.status === 401){
            throw 'Unauthorised';
        }else if(response.status === 500){
            throw 'Server error';
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

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + this.state.friend, {
        method: 'post',
        headers: {
            'X-Authorization': value
        },
    })
    .then((res) => {
        this.request();
      })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        }else if(response.status === 401){
            throw 'Unauthorised';
        }else if(response.status === 404){
            throw 'Not found'
        }else if(response.status === 500){
            throw 'Server error';
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

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + this.state.friend, {
        method: 'delete',
        headers: {
            'X-Authorization': value
        },
    })
    .then((res) => {
        this.request();
      })
      .then((response) => {
        if(response.status === 200){
            return response.json()
        }else if(response.status === 401){
            throw 'Unauthorised';
        }else if(response.status === 404){
            throw 'Not found'
        }else if(response.status === 500){
            throw 'Server error';
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
      this.request();
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
        <View style={styles.container}>
            <ImageBackground source={require('../assets/header.jpg')} style={styles.bgImage}>
             <View style={styles.welcomeContainer}>
                <Text style={styles.welcome}>Your friend requests</Text>
            </View>
            </ImageBackground>
                <View style={styles.flatlistContainer}>
                    <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <View>
                                <Text style={{fontSize: 15, color: 'black', fontWeight: "bold", alignSelf: 'center'}}>{"You've got a new friend request from: " + item.first_name +  " " + item.last_name}</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                    <TouchableOpacity
                                        onPress={()=> {this.setState({friend: item.user_id})  
                                            this.addFriend()}}>
                                        <Text style={{color: '#00ff00', paddingBottom: 10}}>Accept friend</Text>
                                    </TouchableOpacity>
                      
                        <TouchableOpacity
                            onPress={()=> {this.setState({friend: item.user_id})  
                                this.delFriend()}}>
                          <Text style={{color: 'red', paddingBottom: 10}}>Delete friend</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                )}/>
        </View>       
              
              <View>
              </View>
        </View>
      );
    }
}
}

    export default FriendRequestsScreen;


    const styles = StyleSheet.create({
        container: 
        {
          backgroundColor: "dodgerblue",
          flex: 1,
        },
        welcomeContainer:
        {
            alignItems: "center",
            flex: 0.5,
            paddingBottom: 60,
        },
        flatlistContainer:
        {
          backgroundColor: 'white',
          flex: 3,
          paddingHorizontal: 15,
          justifyContent: 'center'
        },
        welcome:
        {
         marginTop: 45,
         alignSelf: 'center',
         fontSize: 25,
         color: '#fff',
         fontWeight: "bold",
        },
        bgImage: 
        {
          resizeMode: 'stretch',
        }
      });
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, StyleSheet, ImageBackground} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        const user_id = await AsyncStorage.getItem('@user_id');
        const value = await AsyncStorage.getItem('@session_token')

        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
              throw 'Unauthorised';
          }else if(response.status === 403){
            throw 'Can only view the friends of yourself or your friends'
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
          this.friendsList();
        });
      
        this.friendsList();
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
      

  getUserPost = async (id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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
          }else if(response.status === 403){
            throw 'Can only view the posts of yourself or your friends'
          }else if(response.status === 404){
              throw 'Not found'
          }else if(response.status === 500){
              throw 'Server error';
          }
      
  })
        .then((responseJson) => {
          console.log("Redirected to user profile", responseJson)
          this.props.navigation.navigate("Posts");
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
              <Text></Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Search")}>
                  <Text>Loading..</Text>
              </TouchableOpacity>
          
            </View>
    
            
          );
    
    
        }else {
          return (

            <View style={styles.container}>
              <ImageBackground source={require('../assets/header.jpg')} style={styles.bgImage}>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcome}>See your friends here</Text>
              </View>
              </ImageBackground>

              <View style={styles.flatlistContainer}>
              <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                          <Text style={{fontSize: 15, color: 'black', fontWeight: "bold"}}>{item.user_givenname} {item.user_familyname}</Text>
                          <TouchableOpacity
                          onPress={() => this.props.navigation.navigate("Posts", {"friend_id": item.user_id})}>
                            
                            <Text style={{paddingBottom: 10}}>View Posts</Text>

                          </TouchableOpacity>
                        </View>
                    )}
                      
                  />
              </View>        
            </View>
          );
        }
        
      }
    }

export default FriendScreen;

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
  },
  welcomeContainer:
  {
    alignItems: "center",
    flex: 1,
    paddingBottom: 60,
  },
  flatlistContainer:
  {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    justifyContent: 'center',
    flex: 1,
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
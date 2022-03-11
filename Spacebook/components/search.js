import React, { Component } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Input } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class SearchScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: [],
        friendSearch: "",
        addedFriend: 0
      }
    }


    searchFriend = async () => {

        //Validation here...
        const value = await AsyncStorage.getItem('@session_token')

        return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.friendSearch, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
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
        console.log(this.state.listData)
    })
    .catch((error) => {
        console.log(error)
    })
    } 

    addFriend = async () => {

      //Validation here...
      const user_id = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token')
  
      return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.addedFriend + "/friends", {
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
  
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
      
        this.searchFriend();
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
                <TextInput
                    placeholder="Search for your friend"
                    onChangeText={(friendSearch) => this.setState({friendSearch})} 
                    value={this.state.friendSearch}
                />
                <TouchableOpacity
                    onPress={()=> this.searchFriend()}>
                    <Text>Find</Text>
               </TouchableOpacity>
              <FlatList
                    
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                          
                          <TouchableOpacity
                          value={item}
                          onPress={()=> {this.setState({addedFriend: item.user_id})  
                          this.addFriend()}}>
                          <Text>Add friend</Text>
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

export default SearchScreen;
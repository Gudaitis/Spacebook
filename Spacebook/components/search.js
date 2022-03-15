import React, { Component } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Input, StyleSheet } from 'react-native';
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
            <View style={styles.container}>
              <View style={styles.welcomeContainer}><Text style={{fontSize: 25, color: 'white'}}>Find your friends here!</Text>
              <TextInput style={styles.textinput}
                    placeholder="Search for your friend"
                    onChangeText={(friendSearch) => this.setState({friendSearch})} 
                    value={this.state.friendSearch}
                />
              <TouchableOpacity 
                    onPress={()=> this.searchFriend()}>
                    <Text>Find</Text>
               </TouchableOpacity>
              </View>
               
              <View style={styles.flatlistContainer}>
              <FlatList 
                    
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                          <Text style={{fontSize: 15, color: 'black', fontWeight: "bold"}}>{item.user_givenname} {item.user_familyname}</Text>

                          <View> <TouchableOpacity
                          value={item}
                          onPress={()=> {this.setState({addedFriend: item.user_id})  
                          this.addFriend()}}>
                          <Text style={{color: '#00ff00', paddingBottom: 10}}>Add friend</Text>
                          </TouchableOpacity></View>
                        </View>
                    )}
                  />
                  <View>
                  </View>
              </View> 
            </View>
          );
        }
        
      }
    }

export default SearchScreen;

const styles = StyleSheet.create({
  container: 
  {
    backgroundColor: "dodgerblue",
    flex: 1,
  },
  welcomeContainer:
  {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: -50,
    borderBottomWidth: 2,
    borderBottomColor: 'white'
  },
  flatlistContainer:
  {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 15,
  },
  textinput:
  {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 0.3
    },
    shadowRadius: 1,
    shadowOpacity: 1.0
  },
});
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




class SinglePostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      // listData: [],
      listData: [{
        post_id: '',
        text: '',
        timestamp: '',
        author: [{
          user_id: '', first_name: '', last_name: '', email: '',
        }],
        numLikes: '',
      }],
    }
  }
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.viewSinglePost()

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
  
  viewSinglePost = async () => {
    let {id} = this.props.route.params;
    let {post_id} = this.props.route.params;
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
     
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
            isLoading:false,
            listData: responseJson,
  
        })
        console.log(responseJson)
    })
      .catch((error) => {
        console.log(error);
      });
  };



  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>

        </View>
      );
    }else{
    return (
        <View style={styles.container}>
        <ImageBackground source={require('../assets/header.jpg')} style={styles.bgImage}>
            <View>
            <Text >Viewing a single post!</Text>
            </View> 
        </ImageBackground>
        <View style={styles.flatlistContainer}>
        <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <>
                      <View style={styles.postContainer}>
                        <Text>{this.state.author.first_name + ": " + item.text}</Text>
                      </View></>
                        
                    )}/>
        </View>  
            
      </View>

    );
  }
}
}


    export default SinglePostScreen;


    const styles = StyleSheet.create({
        container:
        {
          flex: 1,
        },
      
        flatlistContainer:
        {
          paddingTop: '5%',
          backgroundColor: 'white',
          flex: 3,
          paddingHorizontal: 15,
        },
      
        postContainer:
        {
          flex: 1,
          backgroundColor: 'white',
          borderWidth: 1,
          marginVertical: '3%',
      
        },
        welcome:
        {
          alignSelf: 'center',
          fontSize: 25,
          color: '#fff',
          fontWeight: 'bold',
        },
        welcomeContainer:
        {
          flex: 0.5,
          alignItems: 'center',
          paddingBottom: 20,
      
        },
        textinput:
        {
          color: 'white',
          borderRadius: 25,
          borderWidth: 1,
          borderColor: '#fff',
          justifyContent: 'center',
          marginTop: '15%',
          paddingBottom: '3%',
          paddingTop: '3%',
          paddingLeft: '5%',
          paddingRight: '5%',
          placeholderTextColor: 'white',
          fontWeight: 'bold',
      
        },
        text:
        {
          fontSize: 15,
          justifyContent: 'flex-start',
          paddingBottom: 5,
      
        },
      
        userMessage:
        {
          flexShrink: 0.5,
          fontWeight: 'bold',
          color: 'black',
          fontSize: 15,
          alignSelf: 'center',
          borderColor: 'dodgerblue',
          backgroundColor: '#1084ff',
          marginHorizontal: '10%',
          paddingHorizontal: 25,
          paddingTop: 10,
          paddingBottom: 15,
          marginVertical: '7%',
          borderRadius: 20,
          shadowColor: '#000000',
          shadowOffset: {
            width: 1,
            height: 3,
          },
          shadowRadius: 3,
          shadowOpacity: 1.0,
        },
        bgImage:
        {
          resizeMode: 'stretch',
        },
      
      });
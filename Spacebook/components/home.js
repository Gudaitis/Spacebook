import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';


const Tab = createBottomTabNavigator();



class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      post: "",
      updatePost: ""

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search", {
          'headers': {
            'X-Authorization':  value
          }
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


  addPost = async (post) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
          method: 'post',
          'headers': {
          'X-Authorization':  value,
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({text:post})
        })
        .then((res) => {
          this.getPost();
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
        .catch((error) => {
            console.log(error);
        })
  }

  getPost = async () => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
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

  delPost = async (post_id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
          method: 'delete',
          'headers': {
          'X-Authorization':  value,
          },
        })
        .then((res) => {
          this.getPost();
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
        .catch((error) => {
            console.log(error);
        })
  }
  updatePost = async (post_id, post) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
          method: 'PATCH',
          'headers': {
          'X-Authorization':  value,
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({text:post})
        })
        .then((res) => {
          this.getPost();
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
        .catch((error) => {
            console.log(error);
        })
  }

  likePost = async (post_id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
          method: 'post',
          'headers': {
          'X-Authorization':  value,
          },
        })
        .then((res) => {
          this.getPost();
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
        .catch((error) => {
            console.log(error);
        })
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
          placeholder='Type your message here...'
          onChangeText={(post) => this.setState({post})}
          value = {this.state.post}
          />
          
          <Button
          title="Post message"
          onPress={() => this.addPost(this.state.post)}>
          </Button>
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>{"Post from " + item.author.first_name + ": " + item.text}</Text>
                      <Text>{"Likes: " + item.numLikes}</Text>
                      <TouchableOpacity
                      onPress={() => this.delPost(item.post_id)}
                      >
                      <Text>Delete</Text>
                      </TouchableOpacity>


                      <TextInput
                        placeholder='Update your post...'
                        onChangeText={(updatePost) => this.setState({updatePost})}
                        value = {this.state.updatePost}
                      />
                      <TouchableOpacity
                      onPress={() => this.updatePost(item.post_id, this.state.updatePost)}
                      >
                      <Text>Update post...</Text>

                      </TouchableOpacity>

                      <TouchableOpacity 
                      onPress={() => this.likePost(item.post_id)}
                      >
                        <Text>Like?</Text>
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



export default HomeScreen;
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {

      isLoading: true,
      listData: [],
      post: '',
      updatePost: '',
      getValue: '',

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
      AsyncStorage.getItem('savedPost').then((saveMessage) => this.setState({ getValue: saveMessage }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  addPost = async (post) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
      method: 'post',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: post }),
    })
      .then((res) => {
        this.getPost();
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 201) {
          throw 'Created';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  _getPost = async () => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
      method: 'get',
      headers: {
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
          isLoading: false,
          listData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  get getPost() {
    return this._getPost;
  }
  set getPost(value) {
    this._getPost = value;
  }

  delPost = async (post_id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
      method: 'delete',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((res) => {
        this.getPost();
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - you can only delete your own posts';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updatePost = async (post_id, post) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: post }),
    })
      .then((res) => {
        this.getPost();
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'Bad Request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  likePost = async (post_id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
      method: 'post',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((res) => {
        this.getPost();
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - You have already liked this post';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  unlikeUserPost = async (post_id) => {
    const user_id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
      method: 'delete',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - You have not liked this post';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      })
      .then((res) => {
        this.getPost();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  postValidation = () => {
    const { post } = this.state;
    if (post != '') {
      this.addPost(this.state.post);
    } else {
      console.log('Cannot post an empty message!');
    }
  };

  setValueLocally = () => {
    const { post } = this.state;
    if (post == '') {
      console.log('You cannot save an empty message!');
    } else {
      AsyncStorage.removeItem('savedPost');
      AsyncStorage.setItem('savedPost', this.state.post);
      console.log('You have saved your message' + this.state.post);
    }
  };

  getValueLocally = () => {
    AsyncStorage.getItem('savedPost').then((saveMessage) => this.setState({ getValue: saveMessage }));
    this.addPost(this.state.getValue);
  };

  catch(error) {
    console.log(error);
  }

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
    }
    return (

      <View style={styles.container}>
        <ImageBackground source={require('../assets/header.jpg')} style={styles.bgImage}>
          <View style={styles.welcomeContainer} multiline>
            <Text style={styles.welcome}>{'Welcome to your feed' + ' ' }</Text>
            <TextInput
              style={styles.textinput}
              placeholder="Type your message here..."
              onChangeText={(post) => this.setState({ post })}
            />
            <TouchableOpacity
              onPress={() => this.postValidation()}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Post Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setValueLocally()}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Save message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.getValueLocally()}
              onLongPress={() => alert('Your saved message is: ' + ` ${this.state.getValue}`)}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Post your saved message</Text>
            </TouchableOpacity>
            <Text style={{ color: 'white' }} />
          </View>
        </ImageBackground>
        <View style={{ backgroundColor: 'white' }}>
          <Text style={{
            fontSize: 15, fontWeight: 'bold', alignSelf: 'center', color: 'black',
          }}
          >
            View your posts here:
          </Text>
        </View>

        <View style={styles.flatlistContainer}>
          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <Text>{`Likes: ${item.numLikes}`}</Text>
                </View>
                <Text style={styles.userMessage}>{`${item.author.first_name}: ${item.text}`}</Text>

                <View style={{
                  flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-end', paddingTop: 5,
                }}
                >
                  <TextInput
                    placeholder="Update your post"
                    onChangeText={(updatePost) => this.setState({ updatePost })}
                  />

                  <TouchableOpacity
                    onPress={() => { this.updatePost(item.post_id, this.state.updatePost); }}
                  >
                    <Text>Update post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.delPost(item.post_id)}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.likePost(item.post_id)}
                  >
                    <Text>Like?</Text>
                  </TouchableOpacity>
                </View>

              </View>
            )}
          />
        </View>
      </View>

    );
  }
}

export default HomeScreen;

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
    color: 'white',
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

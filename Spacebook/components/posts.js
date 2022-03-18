import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';


class PostsScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: [],
      }
    }
    componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
        this.getUserPost(friend_id);
      });
      let {friend_id} = this.props.route.params;
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }

    getUserPost = async (id) => {
        console.log(id)
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
                throw 'Unauthorised'
              }else if(response.status === 403){
                throw 'Can only view the posts of yourself or your friends';
              }else if(response.status === 404){
                throw 'Not found';
              }else if(response.status === 500){
                throw 'Server Error';
              }
          })
            
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson,
                })
                console.log(responseJson)
              })
            .catch((error) => {
                console.log(error);
            })
      }

      likeUserPost = async (user_id, post_id) => {
          console.log(user_id)
          console.log(post_id)
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
              method: 'post',
              'headers': {
              'X-Authorization':  value,
              },
            })
            .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 401){
                throw 'Unauthorised'
              }else if(response.status === 403){
                throw 'Forbidden - You have already liked this post';
              }else if(response.status === 404){
                throw 'Not found';
              }else if(response.status === 500){
                throw 'Server Error';
              }
          })
          .then((res) => {
            this.getUserPost(friend_id);
          })

            .catch((error) => {
                console.log(error);
            })
      }

      unlikeUserPost = async (user_id, post_id) => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
              method: 'delete',
              'headers': {
              'X-Authorization':  value,
              },
            })
            .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 401){
                throw 'Unauthorised'
              }else if(response.status === 403){
                throw 'Forbidden - You have not liked this post';
              }else if(response.status === 404){
                throw 'Not found';
              }else if(response.status === 500){
                throw 'Server Error';
              }
          })
              .then((res) => {
                this.getUserPost();
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
              <TouchableOpacity>
                  <Text>Loading..</Text>
              </TouchableOpacity>
          
            </View>
    
            
          );
    
    
        }else {
          return (
            <View style={styles.container}>
              <ImageBackground source={require('../assets/header.jpg')} style={styles.bgImage}>
                  <View style={styles.welcomeContainer}>
                  <Text style={styles.welcome}>View your friends post here</Text>
                  </View> 
              </ImageBackground>
              <View style={styles.flatlistContainer}>
              <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <>
                        
                      <View style={styles.postContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly", }}>
                          <Text style={{fontWeight: 'bold'}}>{"Likes: " + item.numLikes}</Text>
                        </View>
                        <Text style={styles.userMessage}>{item.author.first_name + ": " + item.text}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-end", paddingTop: 5,}}>
                          <TouchableOpacity
                            onPress={() => this.likeUserPost(item.author.user_id, item.post_id)}>
                            <Text style={{fontWeight: 'bold', color: 'green'}}>Like?</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => this.unlikeUserPost(item.author.user_id, item.post_id)}>
                            <Text style={{fontWeight: 'bold', color: 'red'}}>Unlike?</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                          onPress={() => this.props.navigation.navigate("Single Post", {"id":item.author.user_id, "post_id": item.post_id})}>
                            <Text>View post</Text>
                          </TouchableOpacity>
                      </View>
                      </View></>
                        
                    )}/>
              </View>  
                  
            </View>
          );
        }
        
      }

}


export default PostsScreen

const styles = StyleSheet.create({
  container: 
  {
    backgroundColor: "dodgerblue",
    flex: 1,
  },

  flatlistContainer:
  {
    paddingTop: "5%",
    backgroundColor: "white",
    flex: 3,
    paddingHorizontal: 15,
  },

  postContainer:
  {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    marginVertical: '3%',
    marginHorizontal: '3%'
    
      
  },
  welcome:
  {
   marginTop: 45,
   alignSelf: 'center',
   fontSize: 25,
   color: '#fff',
   fontWeight: "bold",
  },
  welcomeContainer:
  {
    flex: 1,
    alignItems: "center",
    paddingBottom: 60,

  },
  userMessage:
  {
    flexShrink: 0.5,
    fontWeight: 'bold',
    color: "white",
    fontSize: 15,
    alignSelf: "center",
    borderColor: 'dodgerblue',
    backgroundColor: "#1084ff",
    paddingHorizontal: 40,
    marginHorizontal: '10%',
    paddingTop: 10,
    paddingBottom: 15,
    marginVertical: '7%',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 1.0
  },
  bgImage: 
  {
    resizeMode: 'stretch',
  }
})
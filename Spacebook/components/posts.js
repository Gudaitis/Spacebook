import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, TouchableOpacity} from 'react-native';


class PostsScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: [],

      }
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
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
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
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
                }
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
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
                }
              })
              .then((res) => {
                this.getUserPost();
              })
            .catch((error) => {
                console.log(error);
            })
      }

      componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getUserPost(friend_id);
        });
        let {friend_id} = this.props.route.params;
        this.getUserPost(friend_id);
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
              <TouchableOpacity>
                  <Text>Loading..</Text>
              </TouchableOpacity>
          
            </View>
    
            
          );
    
    
        }else {
          return (
            <View>
              <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                          <Text>{"Post from " + item.author.first_name + ": " + item.text}</Text>
                            <Text>{"Likes: " + item.numLikes}</Text>
                            <TouchableOpacity 
                                onPress={() => this.likeUserPost(item.author.user_id, item.post_id)}>
                        <Text>Like?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => this.unlikeUserPost(item.author.user_id, item.post_id)}>
                            <Text>Unlike?</Text>

                        </TouchableOpacity>
                        </View>
                    )}
                  />
            </View>
          );
        }
        
      }











}


export default PostsScreen
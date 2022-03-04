import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View} from 'react-native';



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
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                    )}
                  />
            </View>
          );
        }
        
      }
    }

export default FriendScreen;
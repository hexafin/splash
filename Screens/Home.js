import React from 'react';
import {Text, View, Button } from 'react-native';
import Icon from '@expo/vector-icons/Entypo'

 class HomeScreen extends React.Component {
   static navigationOptions = ({ navigation}) => ({
    title: 'Hexa',
    headerRight: <Icon.Button name="new-message" color="white" backgroundColor="#401584" size={28.22} onPress={() => navigation.navigate('Compose')}/>,
    headerLeft: <Icon.Button name="menu" color="white" backgroundColor="#401584" size={25.97} onPress={() => navigation.navigate('DrawerOpen')}/>,
  });
    render() {
       return (
         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <Text>Home Screen</Text>
         </View>
       );
     }
  }

export default HomeScreen;

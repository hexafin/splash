import React from 'react';
import {Text, View, Button } from 'react-native';
import Icon from '@expo/vector-icons/Entypo'

 class ComposeScreen extends React.Component {
   static navigationOptions = ({ navigation}) => ({
      title: 'Add Recipients',
      headerLeft: <Button color='white' title='cancel' onPress={() => navigation.goBack()}/>,
    });

    render() {
       return (
         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <Text>Compose Transaction</Text>
         </View>
       );
     }
  }

export default ComposeScreen;

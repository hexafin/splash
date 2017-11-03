import { DrawerNavigator, DrawerItems } from 'react-navigation';
import {Text, View, Image, StyleSheet } from 'react-native';
import React from 'react';
import  HomeScreen from '../Screens/Home';
import  MainNavigator from './MainStackNavigator';
import Icon from '@expo/vector-icons/FontAwesome'


const CustomDrawerContentComponent = (props) => (
  <View style={styles.container}>
  <Image
      style={styles.image}
      source={{uri: 'https://graph.facebook.com/100003125070004/picture?type=large'}}
    />
  <View style={{ alignItems: 'center', padding: 20, }}>
    <Text style={styles.userInfo}>Bryce Bjork</Text>
    <Text style={styles.userInfo}>$100</Text>
    <Text style={styles.userInfo}>0.017 <Icon size={22} name='bitcoin'/> </Text>
  </View>
    <DrawerItems {...props}  activeTintColor='#2196f3' activeBackgroundColor='rgba(0, 0, 0, .04)' inactiveTintColor='rgba(0, 0, 0, .87)' inactiveBackgroundColor='transparent' style={{backgroundColor: '#000000'}} labelStyle={{color: '#ffffff'}}/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#210B45',
    alignItems: 'center',
    padding: 33,
  },
  image: {
    width: 127,
    height: 127,
    borderRadius: 64,
  },
  userInfo: {
    color: 'white',
    padding: 10,
    fontSize: 24,
  },
});

const ProfileDrawer = DrawerNavigator ({
    MainNavigator: { screen: MainNavigator },
},
{
  initialRouteName: 'MainNavigator',
  drawerWidth: 261,
  drawerPosition: 'left',
  contentComponent: CustomDrawerContentComponent,
  drawerBackgroundColor: 'transparent'
}
);

export default ProfileDrawer;

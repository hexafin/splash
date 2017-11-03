import { DrawerNavigator, DrawerItems } from 'react-navigation';
import {Text, View, Image, StyleSheet } from 'react-native';
import React from 'react';
import MainNavigator from './MainStackNavigator';
import FriendsScreen from '../Screens/Friends'
import NotificationsScreen from '../Screens/Notifications'
import SettingsScreen from '../Screens/Settings'
import Icon from '@expo/vector-icons/Entypo'
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome'


const CustomDrawerContentComponent = (props) => (
  <View style={styles.container}>
  <View style={{ alignItems: 'center', flex: 3, }}>
    <Image
        style={styles.image}
        source={{uri: 'https://graph.facebook.com/100003125070004/picture?type=large'}}
      />
    <View style={{ alignItems: 'center', padding: 20, }}>
      <Text style={styles.userInfo}>Bryce Bjork</Text>
      <Text style={styles.userInfo}>$100</Text>
      <Text style={styles.userInfo}>0.017 <FontAwesomeIcon size={22} name='bitcoin'/> </Text>
    </View>
  </View>
    <View style={{ flex: 3, }}>
      <DrawerItems {...props} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#210B45',
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
    MainNavigator: {
      screen: MainNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: ({ tintColor }) => (<Text size={16} style={{ color: tintColor, fontWeight: 'bold', padding: 12, }}>Home</Text>),
        drawerIcon: ({ tintColor }) => (<Icon name="home" size={24} style={{ color: tintColor }} />),
    },
  },
  Friends: {
    screen: FriendsScreen,
    navigationOptions: {
      title: 'Friends',
      drawerLabel: ({ tintColor }) => (<Text size={16} style={{ color: tintColor, fontWeight: 'bold', padding: 12, }}>Friends</Text>),
      drawerIcon: ({ tintColor }) => (<Icon name="users" size={24} style={{ color: tintColor }} />),
    },
  },
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: {
      title: 'Notifications',
      drawerLabel: ({ tintColor }) => (<Text size={16} style={{ color: tintColor, fontWeight: 'bold', padding: 12, }}>Notifications</Text>),
      drawerIcon: ({ tintColor }) => (<Icon name="notification" size={24} style={{ color: tintColor }} />),
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Settings',
      drawerLabel: ({ tintColor }) => (<Text size={16} style={{ color: tintColor, fontWeight: 'bold', padding: 12, }}>Settings</Text>),
      drawerIcon: ({ tintColor }) => (<FontAwesomeIcon name="gear" size={24} style={{ color: tintColor }} />),
    },
  },
},
{
  initialRouteName: 'MainNavigator',
  drawerWidth: 261,
  drawerPosition: 'left',
  contentOptions: {
    activeTintColor: 'white',
    inactiveTintColor: 'white',
  },
  contentComponent: CustomDrawerContentComponent,
}
);

export default ProfileDrawer;

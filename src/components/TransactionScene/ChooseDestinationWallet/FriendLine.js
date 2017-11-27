import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';


export default class FriendLine extends Component {
  render() {
    const wallet = this.props.wallet;

    return (
      <TouchableOpacity style={styles.container} onPress={this.props.clickCallback}>
        <View style={styles.imageView}>
          <Image
          style={styles.image}
          source={{uri: wallet.picture_url}}
          />
        </View>
        <View style={styles.nameView}>
          <Text style={{fontSize: 15}}>{wallet.name}</Text>
          <Text style={{fontSize: 14}}>@{wallet.hex}</Text>
        </View>
        <View style={styles.iconView}>
          <Icon color={'#C7C7CC'} size={13} name={'chevron-thin-right'} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  imageView: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  image: {
    height: 33,
    width: 33,
    borderRadius: 16.5,
  },
  nameView: {
    flex: 7,
    justifyContent: 'center',
    borderBottomWidth: .5,
    borderBottomColor: '#C7C7CC',
  },
  iconView: {
    flex: 1,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderBottomWidth: .5,
    borderBottomColor: '#C7C7CC',
  },
});

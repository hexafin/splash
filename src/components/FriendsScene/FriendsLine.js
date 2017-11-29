import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


export default class FriendLine extends Component {
  render() {
    const wallet = this.props.wallet;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={{flex: 5, flexDirection: 'row'}} onPress={this.props.clickCallback}>
          {/* wallet picture */}
          <View style={styles.imageView}>
            <Image
            style={styles.image}
            source={{uri: wallet.picture_url}}
            />
          </View>
          {/* wallet info */}
          <View style={styles.nameView}>
            <Text style={{fontSize: 15}}>{wallet.name}</Text>
            <Text style={{fontSize: 14}}>@{wallet.hex}</Text>
          </View>
        </TouchableOpacity>

        {/* request/pay buttons */}
        <View style={styles.buttonsView}>
          <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={this.props.requestCallback}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#401584'}}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={this.props.payCallback}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#401584'}}>Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'center',
  },
  image: {
    height: 33,
    width: 33,
    borderRadius: 16.5,
  },
  nameView: {
    flex: 4,
    justifyContent: 'center',
    borderBottomWidth: .5,
    borderBottomColor: '#C7C7CC',
  },
  buttonsView: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: .5,
    borderBottomColor: '#C7C7CC',
  },
  buttonLeft: {
    flex: 4,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  buttonRight: {
    flex: 3,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 29,
  },
});

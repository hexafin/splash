import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default class TransactionLine extends Component {
  render() {
    let tranDescription = '';
    let btcColor = '';
    let btc = ''
    if (this.props.request) {
      btc = "-" + this.props.btcValue;
      btcColor = '#FF3B30';
      tranDescription = "You paid " + this.props.tranParty + " $" + this.props.usdValue;
    } else {
      btc = "+" + this.props.btcValue;
      btcColor = '#4CD964';
      tranDescription = this.props.tranParty + " paid you $" + this.props.usdValue;
    }
    if (this.props.pendingRequest) {
      tranDescription = this.props.tranParty + " requests $" + this.props.usdValue;
      btcColor = '#777777';
    }
    return (
      <View style={styles.transaction}>
        <View style={styles.imageView}>
          <Image
          style={styles.image}
          source={{uri: this.props.imgUrl}}
          />
        </View>
        <View style={styles.descriptionView}>
          <View style={styles.lineView}>
            <Text style={{ fontSize: 15 }}>{tranDescription}</Text>
            <Text style={{ fontSize: 12, color: btcColor }}>{btc} BTC</Text>
          </View>
          <View style={styles.lineView}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{fontSize: 14, marginRight: 12, fontWeight: 'bold'}}>{this.props.tranCategory}</Text>
              <Text style={{fontSize: 14}}>{this.props.tranNote}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
            {this.props.pendingRequest &&
              [
              <Text style={{fontSize: 14, marginRight: 12, color: '#4CD964', fontWeight: 'bold' }} onPress={this.props.acceptCallback}>Accept</Text>,
              <Text style={{fontSize: 14, color: '#FF3B30', fontWeight: 'bold' }} onPress={this.props.declineCallback}>Decline</Text>
              ]
            }
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transaction: {
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 71,
    borderBottomColor: '#C7C7CC',
    borderBottomWidth: 1,
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: 33,
    width: 33,
    borderRadius: 16.5,
  },
  descriptionView: {
    marginVertical: 10,
    flex: 6,
    justifyContent: 'space-around',
  },
  lineView: {
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

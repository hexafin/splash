import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default class TransactionLine extends Component {
  render() {
    const transaction = this.props.transaction;
    const activeWallet = this.props.activeWallet;
    const person = this.props.person;
    const personName = person.first_name + " " + person.last_name;
    const request = (transaction.to_wallet == activeWallet && !transaction.completed)
    const owe = (transaction.to_wallet != activeWallet && !transaction.completed)

    let tranDescription = '';
    let btcColor = '';
    let btc = ''

    if (transaction.to_wallet != activeWallet && transaction.completed) {
      btc = "-" + transaction.amount_crypto;
      btcColor = '#FF3B30';
      tranDescription = "You paid " + personName + " $" + transaction.amount_fiat;
    } else if (transaction.to_wallet == activeWallet && transaction.completed) {
      btc = "+" + transaction.amount_crypto;
      btcColor = '#4CD964';
      tranDescription = personName + " paid you $" + transaction.amount_fiat;
    } else if (request) {
      btc = "-" + transaction.amount_crypto;
      tranDescription = personName + " requests $" + transaction.amount_fiat;
      btcColor = '#777777';
    } else if (owe) {
      btc = "+" + transaction.amount_crypto;
      tranDescription = personName + " owes you $" + transaction.amount_fiat;
      btcColor = '#777777';
    }

    return (
      <View style={styles.transaction}>
          <Image
          style={styles.image}
          source={{uri: person.picture_url}}
          />
        <View style={styles.descriptionView}>
            <View style={styles.lineView}>
              <Text style={{ fontSize: 15 }}>{tranDescription}</Text>
              <Text style={{ fontSize: 12, color: btcColor }}>{btc} BTC</Text>
            </View>
            <View style={styles.lineView}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{fontSize: 14, marginRight: 12, fontWeight: 'bold'}}>{transaction.category}</Text>
                <Text style={{fontSize: 14}}>{transaction.memo}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
              {request &&
                [
                <Text key={0} style={{fontSize: 14, marginRight: 12, color: '#4CD964', fontWeight: 'bold' }} onPress={this.props.acceptCallback}>Accept</Text>,
                <Text key={1} style={{fontSize: 14, color: '#FF3B30', fontWeight: 'bold' }} onPress={this.props.declineCallback}>Decline</Text>
                ]
              }
              {owe &&
                [
                <Text key={0} style={{fontSize: 14, color: '#8E8E93', fontWeight: 'bold' }} onPress={this.props.remindCallback}>Remind</Text>
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
  },
  image: {
    alignSelf: 'center',
    height: 33,
    width: 33,
    borderRadius: 16.5,
    marginHorizontal: 10,
  },
  descriptionView: {
    paddingVertical: 10,
    justifyContent: 'space-around',
    flex: 6,
    borderBottomColor: '#C7C7CC',
    borderBottomWidth: 1,
  },
  lineView: {
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

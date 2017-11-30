/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import Header from '../header'
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { colors } from '../../../lib/colors';

//needs props btcExchange and transaction type

export default class SetAmount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usdAmount: 0,
      btcAmount: (0).toFixed(5),
      valid: false,
    };
  }

  handleAmount(text) {
    // checks to see if number is entered
    let val = parseFloat(text);
    if (!isNaN(val) && val !== 0) {
      // convert to btc (now using hardcoded value)
      //TODO: use real btc exchange rate

      const btcVal = (0.00012 * val).toFixed(5)

      // TODO: write a validator on the amount to check if its possible
      // set valid to true if it is

      this.setState({btcAmount: btcVal, usdAmount: val, valid: true});
    } else {
      this.setState({btcAmount: (0).toFixed(5), usdAmount: 0, valid: false});
    }
  }

  render() {
    const {type, activeWallet, destinationWallet, go_back_key} = this.props.navigation.state.params;
    const {navigate, goBack} = this.props.navigation;

    return (
      <View style={styles.container}>
        <Header type={type} picture_url={activeWallet.picture_url} cancelCallback={() => goBack(go_back_key)}/>
        <View style={styles.page}>
        <View style={styles.topLine}>
          <Image
          style={styles.image}
          source={{uri: destinationWallet.picture_url}}
          />
          <View style={{marginLeft: 15, justifyContent: 'space-around'}}>
            <Text style={{fontSize: 17}}>{destinationWallet.name}</Text>
            <Text style={{fontSize: 17, color: colors.purple}}>@{destinationWallet.hex}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 15}}>
            <View style={{flexDirection: 'column'}}>
              <View style={styles.textInputView}>
                <Text style={{fontSize:20, color: colors.mediumGray2, paddingLeft: 10}}>$</Text>
                <TextInput autoFocus={true} keyboardType={'numeric'} style={{flex:1}} onChangeText={(text) => this.handleAmount(text)}/>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 12}}>
                <FontAwesomeIcon color={colors.mediumGray2} size={12.5} name={'btc'} style={{paddingRight:10}}/>
                <Text style={{fontSize: 17, color: colors.mediumGray2}}>{this.state.btcAmount}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.listHeader}>
          <Text style={{fontSize:17}}>Select Category</Text>
        </View>

        <FlatList
          data={[{key: 'a', icon: 'bowl', name: 'Food'},
                 {key: 'b', icon: 'cup', name: 'Drinks'},
                 {key: 'c', icon: 'rocket', name: 'Travel'},
                 {key: 'e', icon: 'exchange', name: 'Trade'},
                 {key: 'd', icon: 'ticket', name: 'Event'},
                 {key: 'f', icon: 'list', name: 'Other'}]}
          renderItem={({item}) => <TouchableOpacity disabled={!this.state.valid} style={styles.categoryLine} onPress={() => navigate('Confirmation', {type: type, activeWallet: activeWallet, destinationWallet: destinationWallet, category: item.name, icon: item.icon, usdAmount: this.state.usdAmount, btcAmount: this.state.btcAmount, go_back_key: go_back_key})}>
                                    {item.key !== 'e' && [<Icon key={0} name={item.icon} color={colors.purple} size={25}/>]}
                                    {item.key == 'e' && [<FontAwesomeIcon key={1} name={item.icon} color={colors.purple} size={25}/>]}
                                    <View style={styles.categoryLineText}>
                                      <Text style={{color: colors.purple, fontSize: 17, fontWeight: 'bold'}}>{item.name}</Text>
                                      <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                                    </View>
                                  </TouchableOpacity>}
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingLeft: 15,
    backgroundColor: colors.white,
  },
  image: {
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 67,
  },
  textInputView: {
    flexDirection: 'row',
    backgroundColor: colors.mediumGray3,
    alignItems: 'center',
    width: 107,
    height: 33,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.mediumGray4,
  },
  categoryLine: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLineText: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    paddingRight: 10,
    borderBottomWidth: .5,
    borderBottomColor: colors.darkGray,
  },
  listHeader: {
    paddingBottom: 15,
    borderBottomWidth: .5,
    borderBottomColor: colors.darkGray,
  }
});

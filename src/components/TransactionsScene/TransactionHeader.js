import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TransactionHeader extends Component {
  render() {
    const activeWallet = this.props.activeWallet;

    return (
      <View style={styles.header}>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginTop: 30, }} onPress={this.props.walletCallback}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
            style={{ height: 45, width: 45, borderRadius: 22.5 }}
            source={{uri: activeWallet.picture_url}} />
          </View>
          <View style={{flex: 5, justifyContent: 'center'}}>
            <View style={styles.lineView}>
              <Text style={{fontSize:17}}>{activeWallet.name}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center' }}>
                <Icon style={{ marginRight: 2, color: '#525252' }} size={14.5} name={'btc'} />
                <Text style={{color:'#525252', fontWeight: 'bold', fontSize: 17}}>
                  {this.props.btcBalance}
                </Text>
              </View>
            </View>
            <View style={styles.lineView}>
              <Text style={{fontSize:15, color:'#401584'}}>@{activeWallet.hex}</Text>
              <Text style={{color:'#525252', fontWeight: 'bold', fontSize: 17}}>=${this.props.usdBalance}</Text>
            </View>
          </View>
          </TouchableOpacity>
        <View style={styles.searchBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <Icon style={{ color: '#8E8E93', marginRight: 8 }} size={14} name={'search'}/>
            <TextInput style={{ fontSize: 17, }}
                       placeholder={'Search Transactions'}
                       placeholderTextColor={'#8E8E93'}
                       onChangeText={(text) => { this.props.searchCallback(text)}}/>
          </View>
          <Text style={{ color: '#8E8E93', fontSize: 25, fontWeight: 'bold', marginRight: 10 }}>Hexa</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 120.08,
    backgroundColor: '#F7F7F7',
    borderBottomWidth: .5,
    borderBottomColor: '#95989A',
  },
  lineView: {
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#E8E9EA',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius:10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems:'center',
  },
});

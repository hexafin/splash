import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

//props for activeWallet and walletCallback

export default class FriendsHeader extends Component {
  render() {
    const activeWallet = this.props.activeWallet;
    //TODO: add button for chats
    return (
      <View style={styles.header}>

          {/* top Line button */}

          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginTop: 30, }} onPress={this.props.walletCallback}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* active Wallet picture */}
            <Image
            style={{ height: 45, width: 45, borderRadius: 22.5 }}
            source={{uri: activeWallet.picture_url}} />
          </View>
          <View style={{flex: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {/* active Wallet info */}
            <View style={styles.infoView}>
              <Text style={{fontSize:17}}>{activeWallet.name}</Text>
              <Text style={{fontSize:15, color:'#401584'}}>@{activeWallet.hex}</Text>
            </View>
            {/* icon */}
            <View style={styles.iconView}>
              <Icon name={'chat'} size={30} color={'#401584'}/>
            </View>
          </View>
          </TouchableOpacity>

        {/* search bar */}

        <View style={styles.searchBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <FontAwesomeIcon style={{ color: '#8E8E93', marginRight: 8 }} size={14} name={'search'}/>
            <TextInput style={{ fontSize: 17, }}
                       placeholder={'Search Friends'}
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
  infoView: {
    justifyContent: 'space-between'
  },
  iconView: {
    marginRight: 15,
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

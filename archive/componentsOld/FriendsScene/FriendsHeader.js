import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { colors } from '../../lib/colors';

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
              <Text style={{fontSize:15, color: colors.purple }}>@{activeWallet.hex}</Text>
            </View>
            {/* icon */}
            <View style={styles.iconView}>
              <Icon name={'chat'} size={30} color={colors.purple}/>
            </View>
          </View>
          </TouchableOpacity>

        {/* search bar */}

        <View style={styles.searchBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <FontAwesomeIcon style={{ color: colors.mediumGray2, marginRight: 8 }} size={14} name={'search'}/>
            <TextInput style={{ fontSize: 17, }}
                       placeholder={'Search Friends'}
                       placeholderTextColor={colors.mediumGray2}
                       onChangeText={(text) => { this.props.searchCallback(text)}}/>
          </View>
          <Text style={{ color: colors.mediumGray2, fontSize: 25, fontWeight: 'bold', marginRight: 10 }}>Hexa</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 120.08,
    backgroundColor: colors.lightGray,
    borderBottomWidth: .5,
    borderBottomColor: colors.darkGray2,
  },
  infoView: {
    justifyContent: 'space-between'
  },
  iconView: {
    marginRight: 15,
  },
  searchBar: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius:10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems:'center',
  },
});

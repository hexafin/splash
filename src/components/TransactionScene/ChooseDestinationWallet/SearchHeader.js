import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class SearchHeader extends Component {
  render() {
    // capitalize first letter of title
    const title = this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1);
    return (
      <View style={styles.header}>
        <View style={styles.topBar}>
          <Icon name={'cross'} size={30} color={'#401584'} onPress={this.props.cancelCallback}/>
          <Text style={{fontSize:22, fontWeight: '600'}}>{title}</Text>
          <Image
          style={styles.image}
          source={{uri: this.props.picture_url}}
          />
        </View>
        <View style={styles.searchBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <FontAwesomeIcon style={{ color: '#8E8E93', marginRight: 8 }} size={14} name={'search'}/>
            <TextInput style={{ fontSize: 17}}
                       autoFocus={true}
                       placeholder={'Search Hex, Name, Phone, Email'}
                       placeholderTextColor={'#8E8E93'}
                       onChangeText={(text) => { this.props.searchCallback(text)}}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 120,
    backgroundColor: '#F7F7F7',
    borderBottomWidth: .5,
    paddingHorizontal: 15,
    borderBottomColor: '#95989A',
    justifyContent: 'space-around',

  },
  topBar: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  searchBar: {
    height: 36,
    backgroundColor: '#E8E9EA',
    marginBottom: 10,
    borderRadius:10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems:'center',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

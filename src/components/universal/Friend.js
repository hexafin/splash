// presentational component for friend entry

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native"
// import SvgUri from 'react-native-svg-uri';
// import arrow from '../../assets/icons/arrow-right.svg';
import {colors} from "../../lib/colors"
import { createIconSetFromFontello } from 'react-native-vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fontelloConfig from '../../assets/fonts/config.json';
const Icon = createIconSetFromFontello(fontelloConfig);

const Friend = ({picture_url, name, username, type, emoji, date, relative_amount, amount, currency, friendCallback, leftCallback, rightCallback}) => {
    return (
        <TouchableOpacity activeOpacity={(type !== 'friend') ? 1 : 0.5} style={styles.container} onPress={friendCallback}>
          <Image
            style={styles.image}
            source={{ uri: picture_url}}
          />
          <View style={styles.userInfo}>
          {type !== 'transaction' && type !== 'request' && type !== 'waiting' && [
            <Text key={0} style={styles.nameText}>{name}</Text>,
            <Text key={1} style={styles.userText}>@{username}</Text>
          ]}
          {(type == 'transaction' || type == 'request' || type == 'waiting') && [
            <View key={0} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.usdText}>${relative_amount}</Text>
              <Text style={styles.btcText}>{amount} {currency}</Text>
            </View>,
            <Text key={1} style={styles.nameText}>{name}</Text>,
            <View key={2} style={{ flexDirection: 'row'}}>
              <Text style={[styles.userText, {alignSelf: 'center'}]}>@{username}</Text>
              <Text style={{fontSize: 13, paddingBottom: 5, paddingLeft: 5}}>{emoji}</Text>
            </View>
          ]}
          </View>
          <View style={{flex:1, justifyContent: 'flex-end', flexDirection: 'row'}}>
          {type === 'emoji' && [<Text key={0} style={styles.emojiText}>{emoji}</Text>]}
          {type === 'friend' && [<Icon key={0} name={'chevron-right'} color={colors.lightGrey} size={15}/>]}
          {type === 'request' && [
            <View key={0} style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.leftButton} onPress={leftCallback}>
                <Icon name={'xshape'} color={colors.red} size={13}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton} onPress={rightCallback}>
                <Icon name={'checkmark'} color={colors.purple} size={15}/>
              </TouchableOpacity>
            </View>
            ]}
          {type === 'waiting' && [
            <View key={0} style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.leftButton} onPress={leftCallback}>
                <Feather name={'trash'} color={colors.lightGrey} size={17}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton} onPress={rightCallback}>
                <MaterialIcons name={'access-alarm'} color={colors.grey} size={20}/>
              </TouchableOpacity>
            </View>
            ]}
          {type === 'transaction' && [<Text key={0} style={styles.dateText}>{date}</Text>]}
          </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderRadius: 5,
        shadowColor: colors.lightShadow,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
      shadowColor: '#3F3F3F',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 7,
    },
    userInfo: {
      paddingLeft: 14,
      justifyContent: 'space-around',
    },
    nameText: {
      fontSize: 13,
      color: '#A1A1A1',
      fontWeight: '400',
    },
    userText: {
      fontSize: 13,
      color: '#333333',
      fontWeight: '600',
    },
    usdText: {
      fontWeight: '600',
      fontSize: 16,
      color: colors.purple,
    },
    btcText: {
      paddingLeft: 5,
      fontSize: 12,
      color: '#A1A1A1',
    },
    emojiText: {
      padding: 3,
      fontSize: 30,
      alignSelf: 'center'
    },
    dateText: {
      color: colors.lightGrey,
      fontSize: 15,
    },
    leftButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      width: 38,
      borderRadius: 19,
      shadowColor: '#3F3F3F',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      marginRight: 8,
    },
    rightButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      width: 38,
      borderRadius: 19,
      shadowColor: '#3F3F3F',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
});

export default Friend

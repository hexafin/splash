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
import fontelloConfig from '../../assets/fonts/config.json';
const Icon = createIconSetFromFontello(fontelloConfig);

const Friend = ({picture_url, name, username, type, emoji, usdValue, btcValue, friendCallback, acceptCallback, rejectCallback}) => {
    return (
        <TouchableOpacity activeOpacity={(type !== 'friend') ? 1 : 0.5} style={styles.container} onPress={friendCallback}>
          <Image
            style={styles.image}
            source={{ uri: picture_url}}
          />
          <View style={styles.userInfo}>
          {type !== 'transaction' && type !== 'request' && [
            <Text key={0} style={styles.nameText}>{name}</Text>,
            <Text key={1} style={styles.userText}>@{username}</Text>
          ]}
          {(type == 'transaction' || type == 'request') && [
            <View key={0} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.usdText}>${usdValue}</Text>
              <Text style={styles.btcText}>{btcValue} BTC</Text>
            </View>,
            <Text key={1} style={styles.nameText}>{name}</Text>,
            <View key={2} style={{ flexDirection: 'row'}}>
              <Text style={styles.userText}>@{username}</Text>
            </View>
          ]}
          </View>
          <View style={{flex:1, justifyContent: 'flex-end', flexDirection: 'row'}}>
          {type === 'emoji' && [<Text key={0} style={styles.emojiText}>{emoji}</Text>]}
          {type === 'friend' && [<Icon key={0} name={'chevron-right'} color={colors.lightGrey} size={15}/>]}
          {type === 'request' && [
            <View key={0} style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.acceptButton} onPress={rejectCallback}>
                <Icon name={'xshape'} color={colors.red} size={13}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={acceptCallback}>
                <Icon name={'checkmark'} color={colors.purple} size={15}/>
              </TouchableOpacity>
            </View>
            ]}
          </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderRadius: 5,
        shadowColor: '#3F3F3F',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.1,
        shadowRadius: 24,
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
    acceptButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      width: 38,
      borderRadius: 19,
      shadowColor: '#3F3F3F',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 24,
      marginRight: 8,
    },
    rejectButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      width: 38,
      borderRadius: 19,
      shadowColor: '#3F3F3F',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 24,
    }
});

export default Friend

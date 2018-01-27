
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
import api from '../../api';
const Icon = createIconSetFromFontello(fontelloConfig);
const SATOSHI_CONVERSION = 100000000;

// presentational component for friend or transaction entry
//can have type waiting, request, transaction, friend, emoji, or none depending on usage
const GenericLine = ({id, facebook_id, first_name, last_name, username, type, emoji, timestamp_completed, relative_amount, amount, currency, friendCallback, leftCallback, rightCallback}) => {
    const convertedAmount = Math.abs(amount*1.0/SATOSHI_CONVERSION).toFixed(4)
    const name = first_name + ' ' + last_name
    const date = api.ConvertTimestampToDate(timestamp_completed)
    const picture_url = "https://graph.facebook.com/"+facebook_id+"/picture?type=large"
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
              {amount !== null && amount >= 0 && <Text style={styles.positiveRelativeAmountText}>+${relative_amount}</Text>}
              {amount !== null && amount < 0 && <Text style={styles.negativeRelativeAmountText}>-${relative_amount}</Text>}
              {amount !== null && <Text style={styles.amountText}>{convertedAmount} {currency}</Text>}
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
              <TouchableOpacity style={styles.leftButton} onPress={() => leftCallback(id)}>
                <Icon name={'xshape'} color={colors.red} size={13}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton} onPress={() => rightCallback(id)}>
                <Icon name={'checkmark'} color={colors.purple} size={15}/>
              </TouchableOpacity>
            </View>
            ]}
          {type === 'waiting' && [
            <View key={0} style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.leftButton} onPress={() => leftCallback(id)}>
                <Feather name={'trash'} color={colors.lightGrey} size={17}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton} onPress={() => rightCallback(id)}>
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
    positiveRelativeAmountText: {
      fontWeight: '600',
      fontSize: 16,
      color: colors.green,
    },
    negativeRelativeAmountText: {
      fontWeight: '600',
      fontSize: 16,
      color: colors.red,
    },
    amountText: {
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

export default GenericLine

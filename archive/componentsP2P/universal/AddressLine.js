import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import api from '../../api';
import {defaults} from "../../lib/styles";

import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import fontelloConfig from '../../assets/fonts/config.json';
const Icon = createIconSetFromFontello(fontelloConfig);
const SATOSHI_CONVERSION = 100000000;

const AddressLine = ({to_address, type, currency, friendCallback, emoji, amount, relative_amount, timestamp_completed}) => {
    const convertedAmount = Math.abs(amount * 1.0 / SATOSHI_CONVERSION).toFixed(4)
    const date = api.ConvertTimestampToDate(timestamp_completed)
    const truncatedAddress = to_address.substring(0, 15) + "..."

    return (
        <TouchableOpacity activeOpacity={(type !== 'friend') ? 1 : 0.5} style={styles.container}
                          onPress={friendCallback}>
            <View style={styles.currency}>
              {currency == 'BTC' && <FontAwesome name={'btc'} color={colors.red} size={25}/>}
            </View>
            <View style={styles.addressInfo}>
                {(type == 'friend' || type == 'none') && [
                    <Text key={0} style={styles.nameText}>Send money outside of Splash</Text>,
                    <Text key={1} style={styles.addressText}>{to_address}</Text>
                ]}
                {(type == 'emoji') && [
                    <Text key={0} style={styles.nameText}>Money sent from Splash</Text>,
                    <Text key={1} style={styles.addressText}>{to_address}</Text>
                ]}
                {(type == 'transaction') && [
                    <View key={0} style={{flexDirection: 'row', alignItems: 'center'}}>
                        {amount !== null && amount >= 0 &&
                        <Text style={styles.positiveRelativeAmountText}>+${relative_amount}</Text>}
                        {amount !== null && amount < 0 &&
                        <Text style={styles.negativeRelativeAmountText}>-${relative_amount}</Text>}
                        {amount == null && <Text style={styles.relativeAmountText}>${relative_amount}</Text>}
                        {amount !== null && <Text style={styles.amountText}>{convertedAmount} {currency}</Text>}
                    </View>,
                    <View key={1} style={{flexDirection: 'row'}}>
                        <Text style={[styles.addressText, {alignSelf: 'center'}]}>{truncatedAddress}</Text>
                        <Text style={{fontSize: 13, paddingBottom: 5, paddingLeft: 5}}>{emoji}</Text>
                    </View>
                ]}
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
                {type === 'friend' && [<Icon key={0} name={'chevron-right'} color={colors.lightGrey} size={15}/>]}
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
                                 currency: {
                                   height: 50,
                                   width: 50,
                                   borderRadius: 25,
                                   shadowColor: '#3F3F3F',
                                   shadowOffset: {width: 0, height: 2},
                                   shadowOpacity: 0.1,
                                   shadowRadius: 7,
                                   justifyContent: 'center',
                                   alignItems: 'center'
                                 },
                                     addressInfo: {
                                     paddingLeft: 14,
                                     justifyContent: 'space-around',
                                 },
                                     nameText: {
                                     fontSize: 13,
                                     color: '#A1A1A1',
                                     fontWeight: '400',
                                     paddingBottom: 5,
                                 },
                                     addressText: {
                                     fontSize: 10,
                                     color: '#333333',
                                     fontWeight: '600',
                                 },
                                     relativeAmountText: {
                                     fontWeight: '600',
                                     fontSize: 16,
                                     color: colors.purple,
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
                                     padding: 2,
                                     margin: 2,
                                     fontSize: 30,
                                     alignSelf: 'center'
                                 },
                                     emojiDescription: {
                                     padding: 2,
                                     margin: 2,
                                     height: 20
                                 },
                                     dateText: {
                                     color: colors.lightGray,
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

export default AddressLine

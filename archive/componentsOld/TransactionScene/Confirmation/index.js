/* @flow */

import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Header from '../header';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {NavigationActions} from 'react-navigation'

import { colors } from '../../../lib/colors';

export default class Confirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            memo: '',
        };
        this.confirmTransaction = this.confirmTransaction.bind(this);
    }

    confirmTransaction() {
        //TODO: process real btc transaction
        const {navigate} = this.props.navigation;
        //TODO: reset navigation state

        navigate('Base');
    }


    render() {
        const {type, activeWallet, destinationWallet, category, icon, usdAmount, btcAmount, go_back_key} = this.props.navigation.state.params;
        const {goBack} = this.props.navigation;
        // add the correct decimals
        const fixedBtcAmount = parseFloat(btcAmount).toFixed(5);
        const fixedUsdAmount = parseFloat(usdAmount).toFixed(2);

        return (
            <View style={styles.container}>
                <Header type={type} picture_url={activeWallet.picture_url} cancelCallback={() => goBack(go_back_key)}/>
                <ScrollView style={styles.page}>
                    <View style={styles.topLine}>
                        <Image
                            style={styles.image}
                            source={{uri: destinationWallet.picture_url}}
                        />
                        <View style={{marginLeft: 15, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 17}}>{destinationWallet.name}</Text>
                            <Text style={{fontSize: 17, color: colors.purple}}>@{destinationWallet.hex}</Text>
                        </View>
                        <View style={{marginLeft: 30, alignItems: 'center'}}>
                            {icon !== 'exchange' && [<Icon key={0} size={37} name={icon}/>]}
                            {icon == 'exchange' && [<FontAwesomeIcon key={1} size={37} name={icon}/>]}
                            <Text style={{fontSize: 17}}>{category}</Text>
                        </View>
                        <View style={{flex: 1, height: 74, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize: 20, fontWeight: '600'}}>$</Text>
                                <Text style={{fontSize: 17, fontWeight: '600', marginLeft: 5}}>{fixedUsdAmount}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesomeIcon size={12.5} name={'btc'}/>
                                <Text style={{fontSize: 17, fontWeight: '600', marginLeft: 5}}>{fixedBtcAmount}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.memoBox}>
                        <TextInput
                            style={{margin: 10, flex: 1, fontSize: 20}}
                            placeholder={'Memo (Optional)'}
                            placeholderTextColor={colors.mediumGray2}
                            multiline={true}
                            autoFocus={true}
                            autoCorrect={false}
                            onChangeText={(text) => {
                                this.setState({memo: text})
                            }}
                        />
                    </View>
                    <View style={styles.walletBox}>
                        <Text style={{fontSize: 20, color: colors.mediumGray2, marginLeft: 15}}>Wallet</Text>
                        <View style={{justifyContent: 'space-around', paddingLeft: 27}}>
                            <Text style={{fontSize: 17}}>{activeWallet.name}</Text>
                            <Text style={{fontSize: 15, color: colors.purple}}>@{activeWallet.hex}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
                            <Image
                                style={styles.image}
                                source={{uri: activeWallet.picture_url}}
                            />
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.footer} onPress={() => this.confirmTransaction()}>
                    <Icon color={colors.purple} size={28} name={'fingerprint'}/>
                    <Text style={{fontSize: 17, color: colors.purple, fontWeight: 'bold', paddingLeft: 15}}>Confirm</Text>
                </TouchableOpacity>
                <KeyboardSpacer/>
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
        paddingHorizontal: 15,
        backgroundColor: colors.white,
    },
    topLine: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 74,
    },
    image: {
        height: 44,
        width: 44,
        borderRadius: 22,
    },
    memoBox: {
        height: 156,
        backgroundColor: colors.lightGray,
        borderRadius: 20,
        justifyContent: 'flex-start',
        borderColor: colors.mediumGray4,
        borderWidth: 1,
    },
    walletBox: {
        height: 61,
        marginVertical: 15,
        backgroundColor: colors.lightGray,
        borderRadius: 31.5,
        borderWidth: 1,
        borderColor: colors.mediumGray4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        height: 58,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.mediumGray4,
    },
});

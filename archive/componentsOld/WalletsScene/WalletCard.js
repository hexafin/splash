import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {colors} from '../../lib/colors';

export default class WalletCard extends Component {
    render() {
        const wallet = this.props.wallet;

        return (
            <View style={styles.walletCardWrapper}>
                <Image
                    style={styles.walletCardImage}
                    source={{uri: wallet.picture_url}}
                />
                <View style={{flexDirection: "column", justifyContent: "center", flex: 1}}>
                    <Text style={styles.walletCardName}>{wallet.name}</Text>
                    <Text style={styles.walletCardHex}>@{wallet.hex}</Text>
                </View>
                <View style={{flex: 0, flexDirection: "row"}}>
                    <View style={{flexDirection: "column", justifyContent: "center"}}>
                        <View style={{flexDirection: "row", alignContent: "flex-end"}}>
                            <FontAwesomeIcon style={{ marginTop: 2, marginRight: 2, color: colors.darkGray3 }} size={14.5} name={'btc'} />
                            <Text style={{color:colors.darkGray3, fontWeight: 'bold', fontSize: 17}}>0.05</Text>
                        </View>
                        <Text style={{color:colors.darkGray3, fontWeight: 'bold', fontSize: 17}}>=$500</Text>
                    </View>
                    <View style={{paddingLeft: 10, paddingTop: 10, paddingBottom: 10}} onPress={() => {console.log("more options for wallet")}}>
                        <Icon name={"dots-three-vertical"} size={30} color={colors.darkGray3}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    walletCardWrapper: {
        flex: 1,
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        shadowColor: colors.black,
        shadowOpacity: .3,
        shadowOffset: {height: 0},
        margin: 20
    },
    walletCardImage: {
        alignSelf: 'center',
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 10
    },
    walletCardName: {
        fontSize: 20
    },
    walletCardHex: {
        fontSize: 18,
        color: colors.purple
    }
});

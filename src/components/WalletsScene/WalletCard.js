import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default class WalletCard extends Component {
    render() {
        const wallet = this.props.wallet;

        return (
            <View style={styles.walletCardWrapper}>
                <Image
                    style={styles.walletCardImage}
                    source={{url: wallet.picture_url}}
                />
                <Text style={styles.walletCardHex}>{wallet.hex}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    walletCardWrapper: {
        flex: 1,
        borderRadius: 5,
        padding: 20,
        flexDirection: 'row',
        borderWidth: .5,
        borderColor: "#95989A",
        backgroundColor: "#FAFAFA",
        margin: 20
    },
    walletCardImage: {
        alignSelf: 'center',
        height: 33,
        width: 33,
        borderRadius: 16.5,
        marginHorizontal: 10,
    },
    walletCardHex: {

    }
});

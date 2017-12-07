/* @flow weak */
import React from "react"
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Modal
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import Button from "../universal/Button"
import Friend from "../universal/Friend"
import {Input} from "../universal/Input"
import BackButton from "../universal/BackButton"
import {Actions} from "react-native-router-flux"

const Wallet = () => {

    return (
        <View style={styles.container}>
            <BackButton onPress={() => Actions.pop()} type="right"/>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your wallet</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.balance}>
                    <Text style={styles.sectionHeader}>Balance</Text>
                    <Text style={styles.balanceUSD}></Text>
                    <Text style={styles.balanceBTC}></Text>
                </View>
            </View>

        </View>
    )

};

export default Wallet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 30
    },
    headerTitle: {
        color: colors.nearBlack,
        fontSize: 26,
        fontWeight: '900',
    },
    sectionHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingTop: 5,
        color: colors.nearBlack,
        fontWeight: '900',
        fontSize: 19,
    },
});

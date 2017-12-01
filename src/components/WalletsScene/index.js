import React, {Component} from 'react';
import {
    View,
    SectionList,
    Text,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import { colors } from '../../lib/colors';

import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

// needs type prop of either 'request' or 'pay'

export default class Wallets extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     personalWallets: [],
        //     groupWallets: []
        // };
    };

    componentWillMount() {

        // TODO: get personRef from redux state
        var personRef = "TODO";

        // sample data
        // this.setState({
        //     personalWallets: [
        //         {name: "wallet1"}
        //     ],
        //     groupWallets: [
        //         {name: "wallet2"}
        //     ]
        // });

        // // get all personal wallets
        // firestore.collection("wallets").where(["type", "=", "personal"], ["person", "=", personRef])
        //     .onSnapshot().then(personalWallets => {
        //     this.setState({personalWallets: personalWallets.data()});
        // });
        //
        // // get all group wallets
        // var membersProp = "members." + personRef;
        // firestore.collection("wallets").where(["type", "=", "group"], [membersProp, "=", true])
        //     .onSnapshot().then(groupWallets => {
        //     this.setState({groupWallets: groupWallets.data()});
        // });

    }

    render() {
        const key = this.props.navigation.state.key;

        // TODO: get active wallet from redux state

        const {navigate, goBack} = this.props.navigation;

        return (

            <View style={styles.header}>
                <View style={styles.topBar}>
                    <Icon name={'cross'} size={30} color={colors.purple} onPress={() => goBack(key)}/>
                    <Text style={{fontSize: 22, fontWeight: '600'}}>Wallets</Text>
                    <Icon name={'cog'} size={30} color={colors.purple} onPress={() => navigate("Settings")}/>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 74,
        backgroundColor: colors.lightGray,
        borderBottomWidth: .5,
        paddingHorizontal: 15,
        borderBottomColor: colors.darkGray2,
        justifyContent: 'space-around',

    },
    topBar: {
        flex: 1,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
});

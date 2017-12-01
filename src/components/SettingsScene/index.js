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

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultCurrency: "usd"
        };
    };

    componentDidMount() {

        // TODO: get person reference from redux state
        var personRef = "TODO";

        // get personal details
        // firestore.collection("people").doc(personRef)
        //     .onSnapshot().then(person => {
        //     this.setState({person: person.data()});
        // });

    }

    render() {
        const key = this.props.navigation.state.key;

        // TODO: get active wallet from redux state

        const {navigate, goBack} = this.props.navigation;

        return (

            <View style={styles.header}>
                <View style={styles.topBar}>
                    <Icon name={'cross'} size={30} color={colors.purple} style={styles.backButton} onPress={() => goBack(key)}/>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.topBarSpacer}/>
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
    },
    backButton: {
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
    },
    topBarSpacer: {
        width: 30
    }
});

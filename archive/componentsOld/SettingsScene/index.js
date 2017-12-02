import React, {Component} from 'react';
import {
    View,
    SectionList,
    Text,
    StyleSheet,
    TouchableOpacity,
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
          <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <Icon name={'cross'} size={30} color={colors.purple} style={styles.backButton} onPress={() => goBack(key)}/>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.topBarSpacer}/>
                </View>
            </View>
            <View style={styles.page}>
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={{fontSize: 13, color: colors.mediumGray2}}>PROFILE</Text>
                </View>
                <TouchableOpacity style={[styles.item, styles.itemBorder]}>
                  <Text style={{ fontSize: 17 }}>Edit Details</Text>
                  <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.item, styles.itemBorder]}>
                  <Text style={{ fontSize: 17 }}>Link to Facebook</Text>
                  <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <Text style={{ fontSize: 17 }}>Link to Coinbase</Text>
                  <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                </TouchableOpacity>
                <View style={styles.sectionHeader}>
                  <Text style={{fontSize: 13, color: colors.mediumGray2}}>PREFERENCES</Text>
                </View>
                <TouchableOpacity style={[styles.item, styles.itemBorder]}>
                  <Text style={{ fontSize: 17 }}>Benchmark Currency</Text>
                  <Text style={{ fontSize: 17, color: colors.darkGray }}>USD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <Text style={{ fontSize: 17 }}>Push Notifications</Text>
                  <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                </TouchableOpacity>
                <View style={styles.sectionHeader}>
                  <Text style={{fontSize: 13, color: colors.mediumGray2}}>SECURITY</Text>
                </View>
                <TouchableOpacity style={[styles.item, styles.itemBorder]}>
                  <Text style={{ fontSize: 17 }}>Reset PIN</Text>
                  <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <Text style={{ fontSize: 17 }}>Private Keys</Text>
                  <Icon color={colors.darkGray} size={13} name={'chevron-thin-right'} />
                </TouchableOpacity>
              </View>
              <Text style={styles.footerText}>hexa</Text>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
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
    },
    page: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: colors.mediumGray3,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 13,
      backgroundColor: colors.white,
    },
    itemBorder: {
      borderBottomWidth: .5,
      borderBottomColor: colors.darkGray,
    },
    sectionHeader: {
      paddingTop: 15,
      paddingBottom: 5,
      paddingLeft: 15,
    },
    footerText: {
      paddingBottom: 20,
      alignSelf: 'center',
      fontWeight: 'bold',
      color: colors.mediumGray2,
      fontSize: 40,
    },
});

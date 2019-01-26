import React, {Component} from 'react';
import {
    View,
    SectionList,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import { colors } from '../../lib/colors';

import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

import { NewPerson } from '../../firestore/Person';
import WalletCard from "./WalletCard";

// needs type prop of either 'request' or 'pay'

function CreateTestWallet() {
    NewPerson("Bryce", "Bjork", "brycedbjork@gmail.com",
        "9785012350", null, "http://graph.facebook.com/1424111897702966/picture?type=square",
        "338 College Road", "Concord", "MA",
        "01742", "USA");

}

export default class Wallets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            activeWallet: null
        };
    };

    componentWillMount() {

        // TODO: get personRef from redux state
        var personRef = "vgCWLFAWKaqorm5G9kZS";

        // get all personal wallets
        firestore.collection("wallets").where(["type", "=", "personal"], ["person", "=", personRef])
            .onSnapshot(personalWallets => {
                if (!personalWallets.empty) {
                    console.log(personalWallets.docs[0].data());
                    this.setState({sections: [{title: "Personal Wallets", data: [personalWallets.docs[0].data()]}]});
                }
        });

        // // get all group wallets
        // var membersProp = "members." + personRef;
        // firestore.collection("wallets").where(["type", "=", "group"], [membersProp, "=", true])
        //     .onSnapshot(groupWallets => {
        //         console.log(groupWallets);
        //     this.setState(previousState => {
        //         if (groupWallets.empty == true) {
        //             return previousState;
        //         }
        //         var groupWalletState = previousState["sections"].push({title: "Group Wallets", data: [groupWallets.size]});
        //         console.log(groupWalletState);
        //         return groupWalletState;
        //     });
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
                        <Icon name={'cross'} size={30} color={colors.purple} onPress={() => goBack(key)}/>
                        <Text style={{fontSize: 22, fontWeight: '600'}}>Wallets</Text>
                        <Icon name={'cog'} size={30} color={colors.purple} onPress={() => navigate("Settings")}/>
                    </View>
                </View>

                <SectionList style={styles.sectionWrapper}
                             sections={this.state.sections}
                             keyExtractor={item => item.hex}
                             renderSectionHeader={({section}) => <View style={styles.sectionHeader}>
                                 <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
                             </View>}
                             renderItem={({item}) => <WalletCard wallet={item} />}
                />

                <TouchableOpacity style={styles.bottomButton}
                                  onPress={() => CreateTestWallet()}>
                    <Icon name={'wallet'} size={35} color={colors.purple}/>
                    <View style={{flexDirection: "column", justifyContent:"center"}}>
                        <Text style={styles.bottomButtonTitle}>New Wallet</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.white
    },
    header: {
        padding: 33,
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
    body: {
        flex: 1
    },
    sectionWrapper: {
        backgroundColor: colors.white
    },
    sectionHeader: {
        marginLeft: 15,
        borderBottomWidth: .5,
        borderBottomColor: colors.darkGray,
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: colors.white
    },
    sectionHeaderTitle: {
        fontSize: 18
    },
    bottomButtonTitle: {
        fontSize: 20,
        color: "#401584",
        marginLeft: 15,
        fontWeight: "bold"
    },
    bottomButton: {
        flex: 0,
        width: "100%",
        padding: 12,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#F7F7F7",
        borderTopWidth: .5,
        borderTopColor: '#95989A'
    }
});

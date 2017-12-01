import React, {Component} from "react";
import {View, Image, Text, StyleSheet, SectionList, TouchableOpacity} from "react-native";
import FriendsHeader from "./FriendsHeader";
import FriendsLine from "./FriendsLine";
import Icon from 'react-native-vector-icons/Entypo';

// import selected icon
// import unselected icon

export default class Friends extends Component {
    //--- switches the displayed icon if screen is in view ---//
    // static navigationOptions = {
    // 	tabBarIcon: ({ tintColor }) =>
    // 		tintColor == "#FFFFFF" ? (
    // 			<Image source={selected icon} style={styles.icon} />
    // 		) : (
    // 			<Image source={unselected icon}} style={styles.icon} />
    // 		),
    // };

    constructor(props) {
        super(props);
        this.state = {
            popular: [],
            allFriends: [],
            sections: [],
        };
        // binds to this so we can call in jsx
        this.updateSections = this.updateSections.bind(this);
    };

    updateSections = (search) => {
        let sections = [];
        let popularArray = [];
        let allFriendsArray = [];
        const allFriends = this.state.allFriends;
        const popular = this.state.popular;

        //iterate through lists of popular and allfriends and add them to the corresponding arrays

        for (let wallet of allFriends) {
            if (!search || (wallet.name).toLowerCase().search(search.toLowerCase()) !== -1) {
                allFriendsArray.push(wallet);
            }
        }
        for (let wallet of popular) {
            if (!search || (wallet.name).toLowerCase().search(search.toLowerCase()) !== -1) {
                popularArray.push(wallet);
            }
        }

        //put arrays into section format

        if (popularArray.length !== 0) {
            sections.push({data: popularArray, icon: 'clock', title: 'Popular'});
        }
        if (allFriendsArray.length !== 0) {
            sections.push({data: allFriendsArray, icon: 'users', title: 'All Friends'});
        }

        //add the sections to state

        this.setState({sections: sections});
    }


    componentDidMount() {
        const lukas_person = {
            name: 'Lukas Burger',
            phone_id: 1,
            hex: 'lukas',
            phone_number: '9179401662',
            email: 'lburger98@gmail.com',
            picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
        };

        const mike_person = {
            name: 'Mike John',
            phone_id: 2,
            hex: 'mike',
            phone_number: '2129410440',
            email: 'lburger98@gmail.com',
            picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
        };

        // load real data to state here
        // TODO: need to sort popular and add them
        this.setState({
            allFriends: [lukas_person, mike_person],
            popular: [mike_person],
            sections: [
                {
                    data: [lukas_person, mike_person],
                    title: 'Popular'
                },
                {
                    data: [lukas_person, mike_person],
                    title: 'All Friends'
                }
            ]
        }, function () {
            this.updateSections('');
        });

    }


    render() {
        const activeWallet = {
            name: 'Bryce Bjork',
            hex: 'bryce',
            picture_url: 'https://graph.facebook.com/100003125070004/picture?type=large',
        };
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                {/* header */}
                <FriendsHeader activeWallet={activeWallet}
                               walletCallback={() => navigate("Wallets")}
                               searchCallback={this.updateSections}/>
                {/* render Friends */}
                <SectionList style={{backgroundColor: '#FFFFFF', marginLeft: 15}}
                             sections={this.state.sections}
                             keyExtractor={item => item.hex}
                             renderSectionHeader={({section}) => <View style={styles.sectionHeader}>
                                 <Text style={{fontSize: 17}}>{section.title}</Text>
                             </View>}
                             renderItem={({item}) => <FriendsLine wallet={item}
                                                                  clickCallback={() => console.log('click')}
                                                                  requestCallback={() => navigate('SetAmount', {
                                                                      type: 'request',
                                                                      activeWallet: activeWallet,
                                                                      destinationWallet: item,
                                                                      go_back_key: ''
                                                                  })} payCallback={() => navigate('SetAmount', {
                                 type: 'pay',
                                 activeWallet: activeWallet,
                                 destinationWallet: item,
                                 go_back_key: ''
                             })}/>}
                />

                {/* footer */}
                <TouchableOpacity style={styles.footer}>
                    <Icon name={'add-user'} size={17} color={'#401584'}/>
                    <Text style={{color: '#401584', fontSize: 17, fontWeight: 'bold', marginLeft: 10}}>Invite
                        Friends</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    sectionHeader: {
        height: 44,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: .5,
        borderBottomColor: '#C7C7CC',
    },
    footer: {
        height: 43,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#C7C7CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

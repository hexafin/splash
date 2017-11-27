import React, { Component } from 'react';
import {
  View,
  SectionList,
  Text,
  StyleSheet,
} from 'react-native';
import FriendLine from './FriendLine';
import SearchHeader from './SearchHeader';
import Icon from 'react-native-vector-icons/Entypo';

// needs type prop of either 'request' or 'pay'

export default class ChooseDestinationWallet extends Component {
  constructor (props) {
    super(props);
    this.state = {
      recents: [],
      allFriends: [],
      sections: [],
    };
  };

  updateSections = (search) => {
    let sections = [];
		let recentArray = [];
		let allFriendsArray = [];
		const allFriends = this.state.allFriends;
    const recents = this.state.recents;

    //iterate through lists of recents and allfriends and add them to the corresponding sections

		for (let wallet of allFriends){
			if (!search || (wallet.name).toLowerCase().search(search.toLowerCase()) !== -1 ||
        (wallet.email).toLowerCase().search(search.toLowerCase()) !== -1 || (wallet.phone_number).toLowerCase().search(search.toLowerCase()) !== -1 || (wallet.hex).toLowerCase().search(search.toLowerCase()) !== -1) {
        allFriendsArray.push(wallet);
			}
		}
    for (let wallet of recents){
      if (!search || (wallet.name).toLowerCase().search(search.toLowerCase()) !== -1 ||
        (wallet.email).toLowerCase().search(search.toLowerCase()) !== -1 || (wallet.phone_number).toLowerCase().search(search.toLowerCase()) !== -1 || (wallet.hex).toLowerCase().search(search.toLowerCase()) !== -1) {
        recentArray.push(wallet);
      }
    }

    //put arrays into section format

		if (recentArray.length !== 0) {
			sections.push({data: recentArray, icon: 'clock', title: 'Recent'});
		}
		if (allFriendsArray.length !== 0) {
			sections.push({data: allFriendsArray, icon: 'users', title: 'All Friends'});
		}

    //add the sections to state

		this.setState({sections: sections });
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
    // need to sort recents and add them
    this.setState({allFriends: [lukas_person, mike_person], recents: []}, function () {
      this.updateSections('');
    });

  }

  render() {
    const { type, activeWallet } = this.props.navigation.state.params;
    const key = this.props.navigation.state.key;

    const {navigate, goBack} = this.props.navigation;

    return (
      <View style={{flex: 1}}>
        <SearchHeader type={type} picture_url={activeWallet.picture_url} searchCallback={this.updateSections.bind(this)} cancelCallback={() => goBack()}/>
        <SectionList style={{backgroundColor: '#FFFFFF'}}
          sections={this.state.sections}
          keyExtractor={item => item.hex}
          renderSectionHeader={({section}) => <View style={styles.sectionHeader}>
                                                <View style={{flex:1, paddingLeft: 15}}>
                                                  <Icon style={{paddingLeft:10}} name={section.icon} size={15.5} color={'#8E8E93'}/>
                                                </View>
                                                <View style={{flex:8}}>
                                                  <Text style={{color: '#8E8E93', fontSize: 15}}>{section.title}</Text>
                                                </View>
                                              </View>}
          renderItem={({item}) => <FriendLine wallet={item} clickCallback={() => navigate('SetAmount', {type: type, activeWallet, activeWallet, destinationWallet: item, go_back_key: key})}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
		backgroundColor: '#F0F0F0',
		height: 26,
		alignItems: 'center',
		flexDirection: 'row',
	},
});

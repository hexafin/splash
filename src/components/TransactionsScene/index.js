import React, { Component } from "react";
import { View, Image, Text, StyleSheet, SectionList, TouchableOpacity } from "react-native";
import TransactionHeader from './TransactionHeader'
import TransactionLine from './TransactionLine'
import Icon from 'react-native-vector-icons/Entypo';
// import firebase from 'react-native-firebase';
// let firestore = firebase.firestore();



// import selected icon
// import unselected icon

export default class Transactions extends Component {
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
			sections: [],
			transactions: null,
			activeWallet: {},
		};
		this.updateSections = this.updateSections.bind(this);
	}

	updateSections = (search) => {
		let sections = [];
		let oweArray = [];
		let requestArray = [];
		let completedArray = [];
		const transactions = this.state.transactions;
		//dummy person data
		const person = {
			first_name: 'Lukas',
			last_name: 'Burger',
			picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
		};

		for (let transaction of transactions){
			//logic for pulling in person stored on firestore
			// if (transaction.to_wallet !== this.state.activeWallet){
			// 	const person = firestore.collection("person").get(transaction.to_person);
			// } else {
			// 	const person = firestore.collection("person").get(transaction.from_person);
			// }
			if (!search || (transaction.category).toLowerCase().search(search.toLowerCase()) !== -1 || (transaction.memo).toLowerCase().search(search.toLowerCase()) !== -1 || (person.first_name).toLowerCase().search(search.toLowerCase()) !== -1 || (person.last_name).toLowerCase().search(search.toLowerCase()) !== -1) {
				if (transaction.to_wallet != this.state.activeWallet && !transaction.completed) {
					oweArray.push([transaction, person]);
				} else if (transaction.to_wallet == this.state.activeWallet && !transaction.completed) {
					requestArray.push([transaction, person]);
				} else {
					completedArray.push([transaction, person]);
				}
			}
		}
		if (requestArray.length !== 0) {
			sections.push({data: requestArray, icon: 'inbox', number: requestArray.length});
		}
		if (oweArray.length !== 0) {
			sections.push({data: oweArray, icon: 'stopwatch'});
		}
		if (completedArray.length !== 0) {
			sections.push({data: completedArray, icon: 'archive'});
		}
		this.setState({sections: sections });
	}

	componentDidMount() {
		// dummy data
		const activeWallet = {
			name: 'Bryce Bjork',
			hex: 'bryce',
			picture_url: 'https://graph.facebook.com/100003125070004/picture?type=large',
		};
		const transaction1 = {
			transaction_id: 3,
			to_wallet: 'mike',
			completed: false,
			amount_crypto: 0.012,
			amount_fiat: 50,
			category: 'Food',
			memo: 'Work',
		};
		const transaction2 = {
			transaction_id: 1,
			to_wallet: activeWallet,
			completed: false,
			amount_crypto: 0.012,
			amount_fiat: 50,
			category: 'Food',
			memo: 'money',
		};
		const transaction3 = {
			transaction_id: 0,
			to_wallet: activeWallet,
			completed: true,
			amount_crypto: 0.012,
			amount_fiat: 50,
			category: 'Food',
			memo: 'dogs',
		};

		//load in active wallet state and transactions ordered by most recent
		//set dummy data and sort into sections
		//this where we load initial firebase
		this.setState({activeWallet: activeWallet, transactions: [transaction1, transaction3, transaction2]}, function () {
			this.updateSections('');
		});
	}

	render() {
		const {navigate} = this.props.navigation;
		const updateSections = this.updateSections;
		//TODO: get real btc and usd balance
		return (
						<View style={styles.container}>
							<TransactionHeader activeWallet={this.state.activeWallet}
																 btcBalance={0.06813}
																 usdBalance={500}
																 walletCallback={() => navigate("Wallets")}
																 searchCallback={updateSections.bind(this)}/>
							<SectionList
							sections={this.state.sections}
							renderSectionHeader={({section}) => <View style={styles.sectionHeader}>
																									<Icon name={section.icon} size={14} style={[{color: '#8E8E93', marginLeft:22}, section.number && {color:'#401584'}]}/>
																									{section.number &&
																									<Text style={{fontSize:14, color: '#401584', marginBottom: 2, marginLeft: 2}}>{section.number}</Text>}
																									</View>}
							keyExtractor={item => item[0].transaction_id}
							renderItem={({item}) => <TransactionLine
																		transaction={item[0]}
																		person={item[1]}
																		activeWallet={this.state.activeWallet}
																		remindCallback={() => { console.log('remind');}}
																		acceptCallback={() => { console.log('accept');}}
																		declineCallback={() => { console.log('decline');}}/>} />

							<View style={styles.footer}>
								<TouchableOpacity style={styles.footerButton} onPress={() => navigate('ChooseDestinationWallet', {type: 'request', activeWallet: this.state.activeWallet})}>
									<Icon name={'hand'} color={'#401584'} size={18}/>
									<Text style={{fontSize: 17, fontWeight: 'bold', color: '#401584', marginLeft: 5}}>
										Request
									</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.footerButton} onPress={() => navigate('ChooseDestinationWallet', {type: 'pay', activeWallet: this.state.activeWallet})}>
									<Icon name={'paper-plane'} color={'#401584'} size={18}/>
									<Text style={{fontSize: 17, fontWeight: 'bold', color: '#401584', marginLeft: 5}}>
										Pay
									</Text>
								</TouchableOpacity>
							</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		backgroundColor: '#F7F7F7',
	},
	sectionHeader: {
		backgroundColor: '#F0F0F0',
		height: 26,
		alignItems: 'center',
		flexDirection: 'row',
	},
	footer: {
		height: 40,
		flexDirection: 'row',
		backgroundColor: '#F7F7F7',
	},
	footerButton: {
		width: "50%",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
});

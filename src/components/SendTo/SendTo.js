import React, { Component } from "react";
import {
	Animated,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	FlatList,
	Text,
	Alert,
	Keyboard,
	ScrollView,
	StyleSheet,
	Image,
	TextInput,
	Clipboard
} from "react-native";
import { defaults, icons } from "../../lib/styles";
import { colors } from "../../lib/colors";
import { unitsToDecimal, cryptoTitleDict, cryptoNameDict, erc20Names } from "../../lib/cryptos";
import { isIphoneX } from "react-native-iphone-x-helper";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import CloseButton from "../universal/CloseButton";
import Button from "../universal/Button";
import FlatBackButton from "../universal/FlatBackButton";

import SendButton from "./SendButton";
import Hits from "./Hits";
import SendLineItem from "./SendLineItem";
import { Sentry } from "react-native-sentry";
import NextButton from "../universal/NextButton";
import { algoliaKeys } from "../../../env/keys.json";
import { InstantSearch } from "react-instantsearch/native";
import SearchBox from "./SearchBox";
import api from "../../api";
import firebase from "react-native-firebase";
import Permissions from "react-native-permissions";
import Contacts from "react-native-contacts";
import moment from "moment";

/*
Page in Pay flow where you choose the recipient
*/

let firestore = firebase.firestore();

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class SendTo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
			sendCurrency: props.sendCurrency,
			sendAmount: props.sendAmount,
			capturedQr: false,
			userFromAddress: null,
			pastedAddress: false,
			selectedId: null,
			selectedAddress: null,
			selectedSplashtag: null,
			typedAddress: null,
			askPermission: false
		};
		this.getUserFromAddress = this.getUserFromAddress.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.address != this.props.address) {
			// new address coming from captured qr
			this.setState({
				value: nextProps.address,
				capturedQr: nextProps.capturedQr,
				sendCurrency: nextProps.sendCurrency,
				sendAmount: nextProps.sendAmount,
				typedAddress: false,
				pastedAddress: false
			});
		} else if (
			nextProps.sendCurrency != this.props.sendCurrency ||
			nextProps.sendAmount != this.props.sendAmount
		) {
			// change in enter amount page
			this.setState({
				value: nextProps.address,
				capturedQr: nextProps.capturedQr,
				sendCurrency: nextProps.sendCurrency,
				sendAmount: nextProps.sendAmount
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			(nextState.capturedQr != this.state.capturedQr && nextState.capturedQr) ||
			(nextState.pastedAddress != this.state.pastedAddress && nextState.pastedAddress)
		) {
			// just captured a QR or pasted an address, look for a user with this address
			this.getUserFromAddress(nextState.value);
		}

		if (nextState.value != this.state.value && !nextState.pastedAddress && !nextState.capturedQr) {
			const isAddress = api.IsValidAddress(
				nextState.value,
				nextProps.activeCryptoCurrency,
				nextProps.network
			);
			this.setState({ typedAddress: isAddress });
			this.getUserFromAddress(nextState.value);
		}

		if (nextState.value != this.state.value) {
			return true;
		} else if (
			nextState.typedAddress != this.state.typedAddress ||
			nextState.selectedId != this.state.selectedId ||
			nextState.askPermission != this.state.askPermission
		) {
			return true;
		} else if (
			nextState.userFromAddress != this.state.userFromAddress &&
			nextState.userFromAddress != null
		) {
			return true;
		} else if (nextProps.contacts != this.props.contacts) {
			return true;
		} else {
			return false;
		}
	}

	componentWillMount() {
		this.yOffset = new Animated.Value(0);
	}

	componentDidMount() {
		let contacts = [];
		if (typeof this.props.contacts != "undefined") contacts = this.props.contacts;

		Contacts.checkPermission((err, permission) => {
			if (err) throw err;
			if (permission === "undefined") {
				this.props.addContactsInfo(() => {
					Contacts.requestPermission((err, permission) => {
						if (err) throw err;
						if (permission === "authorized") {
							this.props.LoadContacts();
							this.setState({ askPermission: false });
						}
						if (permission === "denied") {
							if (Permissions.canOpenSettings()) {
								this.setState({ askPermission: true });
							} else {
								this.setState({ askPermission: false });
							}
						}
					});
				});
			}
			// if permission is authorized and there are either no contacts or it is time to check again (one day has passed)
			if (permission === "authorized" && contacts.length == 0) {
				this.props.LoadContacts();
				this.setState({ askPermission: false });
			}
			if (permission === "denied") {
				if (Permissions.canOpenSettings()) {
					this.setState({ askPermission: true });
				} else {
					this.setState({ askPermission: false });
				}
			}
		});
	}

	getUserFromAddress(address) {
		let activeCryptoCurrency = this.props.activeCryptoCurrency;
		if (erc20Names.indexOf(activeCryptoCurrency) > -1) activeCryptoCurrency = "ETH";

		const query = "wallets." + activeCryptoCurrency + "." + this.props.network + ".address";
		firestore
			.collection("users")
			.where(query, "==", address)
			.get()
			.then(query => {
				if (!query.empty) {
					const userData = {
						id: query.docs[0].id,
						...query.docs[0].data()
					};
					this.setState({
						userFromAddress: userData,
						selectedId: userData.id,
						selectedSplashtag: userData.splashtag,
						selectedAddress: userData.wallets[activeCryptoCurrency][this.props.network].address
					});
				} else {
					// could not find a user for this address
				}
			})
			.catch(error => {
				Sentry.captureMessage(error);
			});
	}

	render() {
		let {
			sendCurrency,
			sendAmount,
			sendTo,
			userId,
			address,
			showApproveModal,
			activeCryptoCurrency,
			LoadTransactions
		} = this.props;

		let contacts = [];
		if (typeof this.props.contacts != "undefined") contacts = this.props.contacts;

		if (erc20Names.indexOf(activeCryptoCurrency) > -1) activeCryptoCurrency = "ETH";

		const isAddressEntered =
			this.state.pastedAddress || this.state.capturedQr || this.state.typedAddress;

		const animatedHeader = {
			transform: [
				{
					translateY: this.yOffset.interpolate({
						inputRange: [-1, 0, 140, 141],
						outputRange: [0, 0, -140, -140]
					})
				}
			]
		};

		const animatedSendButtons = {
			opacity: this.yOffset.interpolate({
				inputRange: [-1, 0, 140, 141],
				outputRange: [1, 1, 0, 0]
			})
		};

		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.wrapper}>
					<CloseButton
						color="dark"
						onPress={() => {
							Keyboard.dismiss();
							this.props.navigation.navigate("SwipeApp");
						}}
					/>
					<FlatBackButton
						color="dark"
						onPress={() => {
							Keyboard.dismiss();
							this.props.navigation.goBack(null);
						}}
					/>

					<View style={styles.header} pointerEvents="none">
						<Text style={styles.title}>
							Sending {cryptoTitleDict[this.props.activeCryptoCurrency]}
						</Text>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionLabel}>AMOUNT</Text>
						<Text style={styles.amount}>
							{sendCurrency} {sendCurrency == "USD" && "$"}
							{unitsToDecimal(sendAmount, sendCurrency)}
						</Text>
					</View>

					<InstantSearch {...algoliaKeys}>
						{!isAddressEntered && (
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>SEARCH</Text>
								<SearchBox
									onChange={value => {
										this.setState({ value, selectedId: null });
									}}
								/>
							</View>
						)}

						{isAddressEntered && (
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>ADDRESS</Text>
								<View style={styles.inputWrapper}>
									<TextInput
										onChangeText={value => {
											this.setState({
												value: "",
												pastedAddress: false,
												capturedQr: false,
												userFromAddress: null
											});
										}}
										value={this.state.value}
										style={styles.input}
									/>
								</View>
							</View>
						)}

						<Animated.View style={[styles.sendButtons, animatedSendButtons]}>
							<SendButton
								image={icons.copyPaste}
								title={"Paste\naddress"}
								onPress={() => {
									Clipboard.getString()
										.then(clipboard => {
											if (clipboard == address) {
												Alert.alert("You cannot send money to yourself");
												return;
											}
											if (api.IsValidAddress(clipboard, activeCryptoCurrency, this.props.network)) {
												console.log(clipboard, this.props.network, true);
												this.setState({
													value: clipboard,
													pastedAddress: true,
													typedAddress: false,
													capturedQr: false
												});
											} else {
												Alert.alert(
													"Invalid " + cryptoNameDict[this.props.activeCryptoCurrency] + " address"
												);
											}
										})
										.catch(error => {
											Alert.alert("Could not get copied address");
										});
								}}
							/>
							<SendButton
								image={icons.qrIcon}
								title={"Scan\nQR-Code"}
								onPress={() => {
									this.props.navigation.navigate("ScanQrCode");
								}}
							/>
						</Animated.View>

						{this.state.capturedQr && (
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>CAPTURED QR CODE</Text>
								<SendLineItem
									selected={true}
									title={
										this.state.userFromAddress
											? `@${this.state.userFromAddress.splashtag}`
											: "A  " + cryptoNameDict[this.props.activeCryptoCurrency] + "  wallet"
									}
									subtitle={"Valid Address"}
									address={this.state.value}
									circleText={this.state.userFromAddress ? null : "B"}
									extraContent="From QR-Code Scan"
								/>
							</View>
						)}

						{this.state.pastedAddress && (
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>SENDING TO</Text>
								<SendLineItem
									selected={true}
									title={
										this.state.userFromAddress
											? `@${this.state.userFromAddress.splashtag}`
											: "A  " + cryptoNameDict[this.props.activeCryptoCurrency] + "   wallet"
									}
									subtitle={"Valid Address"}
									address={this.state.value}
									circleText={this.state.userFromAddress ? null : "B"}
									extraContent="From Clipboard"
								/>
							</View>
						)}

						{this.state.typedAddress && (
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>FROM ENTRY</Text>
								<SendLineItem
									selected={true}
									title={
										this.state.userFromAddress
											? `@${this.state.userFromAddress.splashtag}`
											: "A  " + cryptoNameDict[this.props.activeCryptoCurrency] + "   wallet"
									}
									subtitle={"Valid Address"}
									address={this.state.value}
									circleText={this.state.userFromAddress ? null : "B"}
									extraContent="From Text Entry"
								/>
							</View>
						)}

						{!isAddressEntered &&
							this.state.value == "" &&
							contacts.length == 0 &&
							this.state.askPermission && (
								<View style={styles.section}>
									<Button
										primary={false}
										title={"Add Contacts"}
										small={true}
										onPress={() => this.props.addContactsInfo(Permissions.openSettings)}
									/>
								</View>
							)}

						{!isAddressEntered && (contacts.length != 0 || this.state.value != "") && (
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>YOUR CONTACTS</Text>
							</View>
						)}

						{!isAddressEntered && this.state.value != "" && (
							<View style={styles.hits}>
								<Hits
									currency={activeCryptoCurrency}
									contacts={contacts}
									userId={userId}
									selectedId={this.state.selectedId}
									callback={item => {
										// user selected contact from algolia query
										const selectedId = item.objectID;
										const selectedSplashtag = item.splashtag;
										const selectedAddress =
											item.wallets[activeCryptoCurrency][this.props.network].address;
										if (selectedId != this.state.selectedId) {
											this.setState({
												selectedId,
												selectedAddress,
												selectedSplashtag
											});
										} else {
											this.setState({
												selectedId: null,
												selectedAddress: null,
												selectedSplashtag: null
											});
										}
									}}
								/>
							</View>
						)}

						{!isAddressEntered && this.state.value == "" && contacts.length != 0 && (
							<View style={styles.hits}>
								<FlatList
									data={contacts}
									contentContainerStyle={{
										overflow: "hidden",
										paddingHorizontal: 20,
										paddingBottom: 130
									}}
									keyExtractor={(item, index) => "contact-" + item.objectID}
									renderItem={({ item }) => {
										if (
											item.objectID != userId &&
											typeof item.wallets !== "undefined" &&
											typeof item.wallets[activeCryptoCurrency] !== "undefined"
										) {
											return (
												<SendLineItem
													title={`@${item.splashtag}`}
													selected={item.objectID == this.state.selectedId}
													subtitle={"Your Contact"}
													onPress={() => {
														const selectedId = item.objectID;
														const selectedSplashtag = item.splashtag;
														const selectedAddress =
															item.wallets[activeCryptoCurrency][this.props.network].address;
														if (selectedId != this.state.selectedId) {
															this.setState({
																selectedId,
																selectedAddress,
																selectedSplashtag
															});
														} else {
															this.setState({
																selectedId: null,
																selectedAddress: null,
																selectedSplashtag: null
															});
														}
													}}
												/>
											);
										}
									}}
									ListFooterComponent={
										<TouchableOpacity
											style={styles.refreshButton}
											onPress={this.props.LoadContacts}
										>
											<Text style={styles.newNumberText}>Added new numbers?</Text>
											<Text style={styles.refreshText}>Refresh Contacts</Text>
										</TouchableOpacity>
									}
								/>
							</View>
						)}
					</InstantSearch>

					<NextButton
						title="Preview Send"
						disabled={
							!(
								this.state.pastedAddress ||
								this.state.typedAddress ||
								this.state.capturedQr ||
								this.state.selectedId
							)
						}
						onPress={() => {
							showApproveModal({
								toAddress: this.state.selectedId ? this.state.selectedAddress : this.state.value,
								toId: this.state.selectedId ? this.state.selectedId : null,
								toSplashtag: this.state.selectedSplashtag ? this.state.selectedSplashtag : null,
								amount: this.state.sendAmount,
								currency: this.state.sendCurrency,
								successCallback: () => {
									this.props.navigation.navigate("SwipeApp");
									LoadTransactions(this.props.activeCryptoCurrency);
								},
								dismissCallback: () => {
									this.props.DismissTransaction();
								}
							});
						}}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		paddingTop: isIphoneX() ? 60 : 40,
		backgroundColor: colors.white,
		flexDirection: "column",
		paddingBottom: isIphoneX() ? 40 : 20
	},
	headerImage: {
		position: "absolute",
		width: SCREEN_WIDTH,
		height: 300,
		top: isIphoneX() ? -10 : -30
	},
	header: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10
	},
	title: {
		color: colors.darkGray,
		fontSize: 24,
		fontWeight: "600",
		marginBottom: 4
	},
	section: {
		paddingVertical: 10,
		paddingHorizontal: 20
		// backgroundColor: colors.primary
	},
	sectionLabel: {
		color: colors.gray,
		fontSize: 18,
		fontWeight: "500",
		letterSpacing: 1,
		marginBottom: 2
	},
	hits: {
		flex: 1,
		minHeight: 400
	},
	amount: {
		color: colors.darkGray,
		fontSize: 20,
		fontWeight: "700"
	},
	input: {
		padding: 20,
		fontSize: 20,
		fontWeight: "500",
		color: colors.gray
	},
	inputWrapper: {
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.05,
		shadowRadius: 12,
		marginTop: 5,
		marginBottom: 15,
		borderRadius: 5,
		// paddingLeft: 50,
		backgroundColor: colors.white
	},
	sendButtons: {
		paddingBottom: 20,
		paddingHorizontal: 25,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: SCREEN_WIDTH
	},
	scrollContainer: {
		position: "relative"
		// minHeight: SCREEN_HEIGHT,
	},
	refreshButton: {
		paddingVertical: 25,
		alignItems: "center"
	},
	newNumberText: {
		fontSize: 16,
		color: colors.gray,
		marginBottom: 8
	},
	refreshText: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.primary
	}
});

export default SendTo;

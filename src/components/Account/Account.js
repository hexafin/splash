import React, { Component } from "react";
import {
	View,
	Alert,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { isIphoneX } from "react-native-iphone-x-helper"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import { Sentry } from "react-native-sentry"
import {Input} from "../universal/Input"
import Setting from "./Setting"
import TouchID from "react-native-touch-id"
import Permissions from 'react-native-permissions'
import Contacts from 'react-native-contacts';
import api from '../../api'

const Account = ({splashtag, userId, navigation, deleteAccount, LoadContacts, isLoadingContacts, setBiometric, biometricEnabled, resetTransactions, toggleLockout, ToggleNetwork, lockoutEnabled, showLockInfo, showMainnetInfo, showDeleteModal, addContactsInfo, bitcoinNetwork}) => {

		const handleLockoutSwitch = (enabled) => {
			if (enabled) {
				navigation.navigate('SetPasscode', {
					successCallback: (newCode) => {
						api.AddToKeychain(userId, 'passcode', newCode).then(() => {
							navigation.navigate('SwipeApp')	
							toggleLockout(enabled)
						}).catch(e => {
							Sentry.captureException(e)
							Alert.alert("An error occurred. Please try again later.")
						})
					}
				})
			} else {
				navigation.navigate("Unlock", {
					closable: true,
					successCallback: () => {
						api.AddToKeychain(userId, 'passcode', '').then(() => {
							setBiometric(false)
							navigation.navigate('SwipeApp')	
							toggleLockout(enabled)
						}).catch(e => {
							Sentry.captureException(e)
							Alert.alert("An error occurred. Please try again later.")
						})
					}
				})
			}
		}

		const handleNetworkSwitch = () => {
			if (bitcoinNetwork == 'testnet') {
				showMainnetInfo(() => {
					resetTransactions()
					ToggleNetwork()
				})
			} else {
				resetTransactions()
				ToggleNetwork()
			}
		}

		const handleBiometricSwitch = (enabled) => {
			if (enabled) {
				if (lockoutEnabled) {
					TouchID.authenticate("Secure account with biometric").then(success => {
						if (success) {
							navigation.navigate("Unlock", {
								closable: true,
								successCallback: () => {
									setBiometric(true)
									navigation.navigate("SwipeApp")
								},
								cancelCallback: () => {
									setBiometric(false)
								},
							})
						}
						else {
							setBiometric(false)
						}
					}).catch(() => setBiometric(false));
				}
				else {
					Alert.alert("You must set a PIN to enable biometric security")
					setBiometric(false)
				}
			}
			else {
				navigation.navigate("Unlock", {
					closable: true,
					successCallback: () => {
						navigation.navigate("SwipeApp")
						setBiometric(false)
					}
				})
			}
		}

		const handleDelete = () => {
			showDeleteModal(() => {
				navigation.navigate("Landing")
				deleteAccount()
			})
		}


		const passcodeTitle = 'Set a PIN'
		const passcodeDescription = 'Set a four digit passcode to secure your Splash wallet.'
		const networkTitle = 'Use bitcoin mainnet'
		const networkDescription = 'On the mainnet your coins hold real value. If unselected your app will use testnet tokens.'
		const biometricTitle = "Use biometric security"
		const biometricDescription = "Secure your account with Touch ID or Face ID."

		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={styles.header}>
						<Text style={styles.title}>@{splashtag}</Text>
					</View>
					<View style={styles.body}>
						<View style={styles.section}>
							<Text style={styles.accountText}>Your account</Text>
							<Text style={styles.splashtagText}>Splashtag</Text>
							<TouchableOpacity onPress={() => navigation.navigate("UpdateUsername")}>
								<View pointerEvents='none'>
									<Input editable={false} input={{value: splashtag}} />
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.section}>
							<Text style={styles.sectionText}>Settings</Text>
							<Setting title={networkTitle} description={networkDescription} toggleCallback={handleNetworkSwitch} toggleState={(bitcoinNetwork == 'mainnet')}/>
							<Setting title={passcodeTitle} description={passcodeDescription} toggleCallback={handleLockoutSwitch} infoCallback={showLockInfo} toggleState={lockoutEnabled} help={true}/>
							<Setting title={biometricTitle} description={biometricDescription} toggleCallback={handleBiometricSwitch} toggleState={biometricEnabled}/>
							<TouchableOpacity style={{marginTop: 42}} onPress={handleDelete}>
								<Text style={styles.logoutText}>Delete Account</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		);
}

const styles = StyleSheet.create({
	container: {
		...defaults.container,
		backgroundColor: "transparent"
	},
	header: {
		height: 150,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 40,
		paddingTop: 60
	},
	title: {
		color: colors.white,
		fontSize: 27,
		fontWeight: "700"
	},
	section: {
		paddingBottom: 30
	},
	body: {
		flex: 1,
		padding: 20,
		flexDirection: "column",
		backgroundColor: colors.white
	},
	accountText: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700"
	},
	splashtagText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#B3B3B3",
		paddingVertical: 10,
	},
	sectionText: {
		fontSize: 18,
		fontWeight: '600',
		paddingBottom: 10,
		color: colors.nearBlack, 
	},
	logoutText: {
		fontSize: 17,
		fontWeight: "700",
		color: 'red',
		alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0)'
	}
});

export default Account;
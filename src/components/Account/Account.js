import React, { Component } from "react";
import {
	View,
	Alert,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { isIphoneX } from "react-native-iphone-x-helper"
import FlatBackButton from "../universal/FlatBackButton"
import {Input} from "../universal/Input"
import Setting from "../universal/Setting"
import api from '../../api'

const Account = ({splashtag, userId, logout, navigation, toggleLockout, lockoutEnabled}) => {

		const handleLogout = () => {
			Alert.alert(
			  'Confirm Delete',
			  'Are you sure you want to delete your account? Your funds will be irretrievable.',
			  [
			    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			    {text: 'Yes', onPress: () => logout(userId)},
			  ],
			)
		}

		const handleLockoutSwitch = (enabled) => {
			console.log(enabled)
			if (enabled) {
				navigation.navigate('SetPasscode', {
					successCallback: (newCode) => {

						api.AddToKeychain(userId, 'passcode', newCode).then(() => {
							navigation.navigate('SwipeApp')	
							toggleLockout(enabled)
						}).catch(e => console.log(e))

					}
				})
			} else {
				navigation.navigate("Unlock", {
					successCallback: () => {

						api.AddToKeychain(userId, 'passcode', '').then(() => {
							console.log('made it', toggleLockout, enabled)
							navigation.navigate('SwipeApp')	
							toggleLockout(enabled)
						}).catch(e => console.log(e))

					}
				})
			}
		}

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>@{splashtag}</Text>
				</View>
				<View style={styles.body}>
					<View style={styles.section}>
						<Text style={styles.sectionText}>Your account</Text>
						<Text style={styles.splashtagText}>Splashtag</Text>
						<TouchableOpacity onPress={() => navigation.navigate("UpdateUsername")}>
							<View pointerEvents='none'>
								<Input editable={false} input={{value: splashtag}} />
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.section}>
						<Text style={styles.sectionText}>Settings</Text>
						<Setting toggleCallback={handleLockoutSwitch} toggleState={lockoutEnabled} help={true}/>
						<TouchableOpacity style={{marginTop: 42}} onPress={handleLogout}>
							<Text style={styles.logoutText}>Delete Account</Text>
						</TouchableOpacity>
					</View>
				</View>
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
		paddingBottom: 40
	},
	body: {
		flex: 1,
		padding: 24,
		flexDirection: "column",
		backgroundColor: colors.white
	},
	accountText: {
		fontSize: 18,
		fontWeight: "500",
		color: colors.nearBlack
	},
	splashtagText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#B3B3B3",
		paddingVertical: 6,
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
		color: '#3F41FA',
		alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0)'
	}
});

export default Account;
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

const Account = ({splashtag, logout, navigation}) => {

		const handleLogout = () => {
			Alert.alert(
			  'Confirm Delete',
			  'Are you sure you want to delete your account? Your funds will be irretrievable.',
			  [
			    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			    {text: 'Yes', onPress: () => logout()},
			  ],
			)
		}

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>@{splashtag}</Text>
				</View>
				<View style={styles.body}>
					<Text style={styles.accountText}>Your account</Text>
					<Text style={styles.splashtagText}>Splashtag</Text>
					<TouchableOpacity onPress={() => navigation.navigate("UpdateUsername")}>
						<View pointerEvents='none'>
							<Input editable={false} input={{value: splashtag}} />
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{marginTop: 42}} onPress={handleLogout}>
						<Text style={styles.logoutText}>Delete Account</Text>
					</TouchableOpacity>
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
	body: {
		flex: 1,
		padding: 24,
		flexDirection: "column",
		backgroundColor: colors.white
	},
	accountText: {
		paddingBottom: 22,
		fontSize: 18,
		fontWeight: "700",
		color: colors.nearBlack
	},
	splashtagText: {
		fontSize: 15,
		fontWeight: "700",
		color: "#B3B3B3",
		paddingBottom: 6
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
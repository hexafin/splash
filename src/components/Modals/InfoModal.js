import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { colors } from "../../lib/colors";
import { icons, defaults } from "../../lib/styles";
import Button from "../universal/Button";

/*
Simple modal for displaying information
*/

const InfoModal = ({ title, body, handleClose, buttonTitle, buttonCallback }) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.closeButton} />
				<Text style={styles.title}>{title}</Text>
				<TouchableOpacity onPress={handleClose}>
					<Image style={styles.closeButton} source={require("../../assets/icons/Xbutton.png")} />
				</TouchableOpacity>
			</View>
			<Text style={styles.content}>{body}</Text>
			{buttonTitle && buttonCallback && (
				<Button
					style={styles.button}
					title={buttonTitle}
					primary={true}
					onPress={() => {
						buttonCallback();
						handleClose();
					}}
				/>
			)}
		</View>
	);
};

export default InfoModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 17
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		color: colors.nearBlack,
		textAlign: "center"
	},
	closeButton: {
		height: 20,
		width: 20,
		margin: 8
	},
	content: {
		fontSize: 18,
		color: colors.nearBlack,
		textAlign: "center",
		alignSelf: "center"
	},
	button: {
		marginTop: 20,
		marginHorizontal: 10
	}
});

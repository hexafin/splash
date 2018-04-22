import React from "react"
import {
	View,
	Text,
	Image,
	TouchableWithoutFeedback,
	StyleSheet
} from "react-native"
import { icons, defaults } from "../../lib/styles";
import { colors } from "../../lib/colors";

const TransactionLine = ({ direction, amount, date, title, onPress }) => {
	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.wrapper}>
				<View style={styles.letterPreview}>
					<Text style={styles.letterPreviewText}>{title[0]}</Text>
				</View>
				<View style={styles.body}>
					<View>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.date}>{date}</Text>
					</View>
					<View style={styles.rightBody}>
						<Image source={icons.arrow[direction]} style={styles.arrow} resizeMode="cover"/>
						<Text style={styles.amount}>{amount}</Text>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.05,
		shadowRadius: 12,
		marginTop: 15,
		borderRadius: 5
	},
	letterPreview: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: colors.primaryLight,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15
	},
	letterPreviewText: {
		fontSize: 14,
		color: colors.primary
	},
	body: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	rightBody: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-end"
	},
	title: {
		color: colors.primaryDarkText,
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 3
	},
	date: {
		color: colors.lightGray,
		fontSize: 10
	},
	arrow: {
		width: 48,
		height: 24,
		right: -3
	},
	amount: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.primary
	}
})

export default TransactionLine
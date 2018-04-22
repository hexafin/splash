import React from "react"
import {
	View,
	Text,
	Image,
	TouchableWithoutFeedback,
	StyleSheet
} from "react-native"
import { icons } from "../../lib/styles";
import { colors } from "../../lib/colors";

const TransactionLine = ({ direction, amount, date, title, onPress }) => {
	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.wrapper}>
				<View style={styles.letterPreview}>
					<Text style={styles.letterPreviewText}>{title[0]}</Text>
				</View>
				<View style={styles.section}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.date}>{date}</Text>
				</View>
				<View style={styles.section}>
					<Image source={icons.arrow[direction]} style={styles.arrow}/>
					<Text style={styles.amount}>{amount}</Text>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	wrapper: {},
	letterPreview: {},
	letterPreviewText: {},
	section: {},
	title: {},
	date: {},
	arrow: {},
	amount: {}
})

export default TransactionLine
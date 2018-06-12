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
import Shimmer from 'react-native-shimmer';

const TransactionLine = ({ direction, amount, date, title, onPress, pending=false, loading=false, currency=null }) => {
	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.wrapper}>
				<View style={[styles.letterPreview, (loading && {backgroundColor: '#EDEEF2'})]}>
					{!currency && !loading && <Text style={styles.letterPreviewText}>{title[0]}</Text>}
					{currency=='BTC' && !loading && <Image source={icons.btcLetter} style={{height: 15.75, width: 12}} resizeMode={"contain"}/>}
				</View>
				<View style={[styles.body, (loading && {alignItems: 'flex-start'})]}>
					<View>
						{!loading && <Text style={styles.title}>{title}</Text>}
						{loading && <Shimmer style={{marginBottom: 15}}><Image style={styles.titleLoadingBar} source={icons.placeholder}/></Shimmer>}
						{!loading && !pending && <Text style={styles.date}>{date}</Text>}
						{!loading && pending && <Text style={styles.date}>Pending</Text>}
						{loading && <Shimmer style={{width: 66}}><Image style={styles.dateLoadingBar} source={icons.placeholder}/></Shimmer>}
					</View>
					<View style={styles.rightBody}>
						{!loading && <Image source={icons.arrow[direction]} style={styles.arrow} resizeMode="cover"/>}
						{loading && <Shimmer><Image source={icons.placeholder} style={styles.balanceLoadingBar}/></Shimmer>}
						{!loading && <Text style={styles.amount}>{amount}</Text>}
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
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 3
	},
	date: {
		color: colors.lightGray,
		fontSize: 14
	},
	arrow: {
		width: 48,
		height: 24,
		right: -3,
		overflow: "visible"
	},
	amount: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.primary
	},
	titleLoadingBar: {
		backgroundColor: '#EDEEF2',
		height: 10,
		width: 144,
	},
	dateLoadingBar: {
		backgroundColor: '#EDEEF2',
		height: 10,
		width: 66,
	},
	balanceLoadingBar: {
		backgroundColor: '#EDEEF2',
		height: 10,
		width: 40,
	}
})

export default TransactionLine
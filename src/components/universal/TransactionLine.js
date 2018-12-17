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
import { cryptoNameDict } from "../../lib/cryptos";
import Shimmer from 'react-native-shimmer';
import moment from "moment"


const TransactionLine = ({transaction, direction, amount, onPress, loading=false }) => {
	
	let title = "A " + cryptoNameDict[transaction.currency] + " wallet"
	if (direction == 'to' && transaction.toSplashtag) title = transaction.toSplashtag
	if (direction == 'from' && transaction.fromSplashtag) title = transaction.fromSplashtag
	title = (transaction.type == "card") ? transaction.domain[0].toUpperCase() + transaction.domain.slice(1)
										 : title

	const date = moment.unix(transaction.timestamp).fromNow()
	const pending = transaction.pending
	const currency = (transaction.type == 'blockchain') ? transaction.currency : null
	const isSplashtag = (direction == 'to' && transaction.toSplashtag) || (direction == 'from' && transaction.fromSplashtag)

	const pendingCircles = (confirmations, currency) => {
		const total_confirmation = (currency != 'BTC') ? 12 : 6
		return (
			<View style={{flexDirection: 'row'}}>
				<View style={[styles.pendingDarkLine, {width: confirmations*(70/total_confirmation)}, (confirmations == total_confirmation) ? {borderRadius: 3.5} : {}, (confirmations == 0) ? {borderWidth: 0} : {}]} />
				<View style={[styles.pendingLightLine, {width: 70-confirmations*(70/total_confirmation)}, (confirmations == 0) ? {borderRadius: 3.5} : {}]} />				
			</View>
		)
	}

	return (
		<TouchableWithoutFeedback onPress={onPress} disabled={loading}>
			<View style={styles.wrapper}>
				<View style={[styles.letterPreview, (loading && {backgroundColor: '#EDEEF2'})]}>
					{!isSplashtag && !currency && !loading && <Text style={styles.letterPreviewText}>{title[0]}</Text>}
					{currency=='BTC' && !isSplashtag && !loading && <Image source={icons.btcLetter} style={{height: 15.75, width: 12, marginLeft: 2}} resizeMode={"contain"}/>}
					{currency=='ETH' && !isSplashtag && !loading && <Image source={icons.ethLetter} style={{height: 15.75, width: 12, marginLeft: 2}} resizeMode={"contain"}/>}
					{currency=='GUSD' && !isSplashtag && !loading && <Image source={icons.gusdLetter} style={{height: 15.75, width: 12, marginLeft: 2}} resizeMode={"contain"}/>}
					{isSplashtag && !loading && <Image
						style={styles.circleSplash} 
						resizeMode="contain" 
						source={require("../../assets/icons/primarySplash.png")}/>}
				</View>
				<View style={[styles.body, (loading && {alignItems: 'flex-start'})]}>
					<View>

						{!loading && <View style={styles.row}>
							<Text style={styles.title}>{title}</Text>
							{isSplashtag && <Image
								style={styles.verified}
								resizeMode="contain"
								source={require("../../assets/icons/checkmarkGreen.png")}/>}
						</View>}

						{loading && <Shimmer style={{marginBottom: 15}}><Image style={styles.titleLoadingBar} source={icons.placeholder}/></Shimmer>}
						{!loading && !pending && <Text style={styles.date}>{date}</Text>}
						{!loading && pending && pendingCircles(transaction.confirmations, transaction.currency)}
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
		borderRadius: 5,
		backgroundColor: colors.white
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
	circleSplash: {
		width: 20,
		height: 20,
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
	row: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	title: {
		color: colors.primaryDarkText,
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 3
	},
	verified: {
		width: 18,
		height: 18,
		marginLeft: 5,
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
	},
	pendingDarkLine: {
		height: 7,
		borderTopLeftRadius: 3.5,
		borderBottomLeftRadius: 3.5,
		borderColor: colors.primary,
		borderWidth: 0.1,
		backgroundColor: colors.primary,
		marginTop: 2,
		opacity: 1,
	},
	pendingLightLine: {
		height: 7,
		borderTopRightRadius: 3.5,
		borderBottomRightRadius: 3.5,
		opacity: 0.2,
		backgroundColor: colors.primary,
		marginTop: 2,
		marginRight: 3,
	}
})

export default TransactionLine
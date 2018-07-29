import React, {Component} from "react"
import {
	Animated,
	View,
	Text,
	TouchableWithoutFeedback,
	Image,
	StyleSheet,
} from "react-native"
import {colors} from "../../lib/colors"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"

class SendLineItem extends Component {
	componentWillMount() {
		this.scale = new Animated.Value(1)
	}
	render() {

		const {
			selected=false,
			title,
			subtitle,
			circleText=null,
			address=null,
			extraContent=null,
			verified=true,
		} = this.props

		const animatedScale = {
			transform: [{scale: this.scale}]
		}

		let wrapperStyles = [styles.wrapperBase, animatedScale]
		wrapperStyles.push(selected ? styles.wrapperSelected : styles.wrapperUnselected)

		return (
			<TouchableWithoutFeedback onPressIn={() => {
				ReactNativeHapticFeedback.trigger("impactLight", true)
		        Animated.spring(this.scale, {
		            toValue: .8
		        }).start()
			}} onPressOut={() => {
				ReactNativeHapticFeedback.trigger("impactLight", true)
		        Animated.spring(this.scale, {
		            toValue: 1.0
		        }).start()
			}} onPress={this.props.onPress}>
				<Animated.View style={wrapperStyles}>

					<View style={styles.row}>
						<View style={styles.circle}>
							{circleText && <Text style={styles.circleText}>{circleText}</Text>}
							{!circleText &&
								<Image
									style={styles.circleSplash} 
									resizeMode="contain" 
									source={require("../../assets/icons/primarySplash.png")}/>}
						</View>
						<View style={styles.column}>
							<View style={styles.row}>
								<Text style={styles.title}>{title}</Text>
								{verified && <Image
									style={styles.verified}
									resizeMode="contain"
									source={require("../../assets/icons/checkmarkGreen.png")}/>}
							</View>
							<Text style={styles.subtitle}>{subtitle}</Text>
						</View>
					</View>
					{address && <Text style={styles.address}>{address}</Text>}
					{extraContent && <Text style={styles.extraContent}>{extraContent}</Text>}
				</Animated.View>
			</TouchableWithoutFeedback>
		)
	}
}

export default SendLineItem

const styles = StyleSheet.create({
	wrapperBase: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		padding: 15,
		marginTop: 10,
		borderRadius: 5,
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.white,
	},
	wrapperSelected: {
		borderWidth: 1,
		borderColor: colors.primary,
	},
	wrapperUnselected: {
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.08,
		shadowColor: colors.shadowPrimary,
		shadowRadius: 10,
	},
	circle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
		backgroundColor: colors.primaryLight,
		justifyContent: "center",
		alignItems: "center",
	},
	circleText: {
		color: colors.primary,
		fontSize: 18,
		fontWeight: "600",
	},
	circleSplash: {
		width: 25,
		height: 25,
	},
	verified: {
		width: 18,
		height: 18,
		marginLeft: 5,
	},
	row: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	column: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
	},
	extraContent: {
		color: colors.gray,
		fontSize: 16,
		textAlign: "left",
		marginTop: 5,
	},
	address: {
		color: colors.primary,
		fontSize: 16,
		textAlign: "left",
		marginTop: 5,
	},
	title: {
		color: colors.darkGray,
		// opacity: 0.9,
		fontSize: 18,
		textAlign: "left",
		fontWeight: "700",
	},
	subtitle: {
		color: colors.gray,
		fontSize: 16,
		textAlign: "left",
		marginTop: 5,
	},
})
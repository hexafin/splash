import React, {Component} from "react"
import {
	View,
	Text,
	Image,
	TouchableWithoutFeedback,
	Animated,
	StyleSheet,
} from "react-native"
import {icons} from "../../lib/styles"
import {colors} from "../../lib/colors"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {setActiveCurrency} from "../../redux/crypto/actions"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

/*
	example usage:
	<CurrencySwitcher fiat="USD" crypto="BTC" textColor={colors.primary} switcherColor={"purple"} activeCurrencySize={22}/>
*/

class CurrencySwitcherLight extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeCurrency: props.activeCurrency,
		}
		this.constants = {
			activeScale: 1.0,
			inactiveScale: 0.5,
			activeXOffset: 78,
			inactiveXOffset: 0,
			activeOpacity: 1.0,
			inactiveOpacity: 0.7,
		}
	}
	componentWillMount() {
		this.wrapperScale = new Animated.Value(1)
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeCurrency != this.state.activeCurrency) {
			this.setState({activeCurrency: nextProps.activeCurrency})
		}
	}
	render() {

		const {
			crypto,
			fiat,
			textColor,
			textSize=24,
			switcherColor,
			setActiveCurrency,
			style,
			onPressIn=()=>{},
			onPressOut=()=>{},
			onSwitch=()=>{},
		} = this.props

		const switchIcon = switcherColor == "purple" ? icons.purpleSwitcherVertical : null

		const wrapperAnimatedStyle = {
			transform: [
				{scale: this.wrapperScale},
			]
		}

		return (
			<TouchableWithoutFeedback
				onPressIn={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true)
					Animated.spring(this.wrapperScale, {
						toValue: 0.8,
						bounciness: 6,
						speed: 8,
					}).start()
					onPressIn()
				}}
				onPressOut={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true)
					Animated.spring(this.wrapperScale, {
						toValue: 1,
						bounciness: 10,
						speed: 8,
					}).start()
					onPressOut()
				}}
				onPress={() => {
					const nextCurrency = this.state.activeCurrency == crypto ? fiat : crypto
					this.setState({activeCurrency: nextCurrency})
					setActiveCurrency(nextCurrency)
					onSwitch(nextCurrency)
				}}
			>
				<Animated.View style={[wrapperAnimatedStyle, styles.wrapper, style]}>
					<Image source={switchIcon} style={styles.switchIcon} resizeMode="contain"/>
					<Text style={[styles.currencyText, {fontSize: textSize, color: textColor}]}>
						{this.state.activeCurrency == fiat ? crypto : fiat}
					</Text>
				</Animated.View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		// backgroundColor: colors.gray,
		padding: 10,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	currencyText: {
		fontWeight: "700",
		opacity: 0.7,
	},
	switchIcon: {
		width: 18,
		height: 18,
		marginBottom: 5,
	}
})

const mapStateToProps = (state) => {
    return {
    	activeCurrency: state.crypto.activeCurrency
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	setActiveCurrency
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySwitcherLight)
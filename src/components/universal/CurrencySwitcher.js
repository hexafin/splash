import React, { Component } from "react";
import {
	View,
	Text,
	Image,
	TouchableWithoutFeedback,
	Animated,
	StyleSheet
} from "react-native";
import { icons } from "../../lib/styles";
import { colors } from "../../lib/colors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setActiveCurrency } from "../../redux/crypto/actions";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

/*
	example usage:
	<CurrencySwitcher fiat="USD" crypto="BTC" textColor={colors.primary} switcherColor={"purple"} activeCurrencySize={22}/>
*/

export class CurrencySwitcher extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeCurrency: props.activeCurrency
		};
		this.constants = {
			activeScale: 1.0,
			inactiveScale: 0.5,
			activeXOffset: 78,
			inactiveXOffset: -10,
			activeOpacity: 1.0,
			inactiveOpacity: 0.7
		};
	}
	componentWillMount() {
		this.wrapperScale = new Animated.Value(1);
		this.fiatScale = new Animated.Value(
			this.state.activeCurrency == this.props.fiat
				? this.constants.activeScale
				: this.constants.inactiveScale
		);
		this.cryptoScale = new Animated.Value(
			this.state.activeCurrency == this.props.crypto
				? this.constants.activeScale
				: this.constants.inactiveScale
		);
		this.fiatXOffset = new Animated.Value(
			this.state.activeCurrency == this.props.fiat
				? this.constants.activeXOffset
				: this.constants.inactiveXOffset
		);
		this.cryptoXOffset = new Animated.Value(
			this.state.activeCurrency == this.props.crypto
				? this.constants.activeXOffset
				: this.constants.inactiveXOffset
		);
		this.fiatOpacity = new Animated.Value(
			this.state.activeCurrency == this.props.fiat
				? this.constants.activeOpacity
				: this.constants.inactiveOpacity
		);
		this.cryptoOpacity = new Animated.Value(
			this.state.activeCurrency == this.props.crypto
				? this.constants.activeOpacity
				: this.constants.inactiveOpacity
		);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeCurrency != this.state.activeCurrency) {
			this.setState({ activeCurrency: nextProps.activeCurrency });
		}
	}
	render() {
		const {
			crypto,
			fiat,
			textColor,
			textSize = 24,
			switcherColor,
			setActiveCurrency,
			switcherBottom = 36,
			style,
			onPressIn = () => {},
			onPressOut = () => {},
			onSwitch = () => {}
		} = this.props;

		const switchIcon =
			switcherColor == "purple" ? icons.purpleSwitcher : icons.whiteSwitcher;

		const wrapperAnimatedStyle = {
			transform: [{ scale: this.wrapperScale }]
		};

		const fiatAnimatedStyle = {
			transform: [{ scale: this.fiatScale }, { translateX: this.fiatXOffset }],
			opacity: this.fiatOpacity
		};

		const cryptoAnimatedStyle = {
			transform: [
				{ scale: this.cryptoScale },
				{ translateX: this.cryptoXOffset }
			],
			opacity: this.cryptoOpacity
		};

		return (
			<TouchableWithoutFeedback
				onPressIn={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true);
					Animated.spring(this.wrapperScale, {
						toValue: 0.8,
						bounciness: 6,
						speed: 8
					}).start();
					onPressIn();
				}}
				onPressOut={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true);
					Animated.spring(this.wrapperScale, {
						toValue: 1,
						bounciness: 10,
						speed: 8
					}).start();
					onPressOut();
				}}
				onPress={() => {
					const nextCurrency =
						this.state.activeCurrency == crypto ? fiat : crypto;
					this.setState({ activeCurrency: nextCurrency });
					setActiveCurrency(nextCurrency);
					onSwitch(nextCurrency);
					Animated.parallel([
						Animated.spring(this.fiatScale, {
							toValue:
								fiat == nextCurrency
									? this.constants.activeScale
									: this.constants.inactiveScale,
							bounciness: 6,
							speed: 6
						}),
						Animated.spring(this.cryptoScale, {
							toValue:
								crypto == nextCurrency
									? this.constants.activeScale
									: this.constants.inactiveScale,
							bounciness: 6,
							speed: 6
						}),
						Animated.spring(this.fiatXOffset, {
							toValue:
								fiat == nextCurrency
									? this.constants.activeXOffset
									: this.constants.inactiveXOffset,
							bounciness: 6,
							speed: 2
						}),
						Animated.spring(this.cryptoXOffset, {
							toValue:
								crypto == nextCurrency
									? this.constants.activeXOffset
									: this.constants.inactiveXOffset,
							bounciness: 6,
							speed: 2
						}),
						Animated.timing(this.fiatOpacity, {
							toValue:
								fiat == nextCurrency
									? this.constants.activeOpacity
									: this.constants.inactiveOpacity,
							duration: 50
						}),
						Animated.timing(this.cryptoOpacity, {
							toValue:
								crypto == nextCurrency
									? this.constants.activeOpacity
									: this.constants.inactiveOpacity,
							duration: 50
						})
					]).start();
				}}
			>
				<Animated.View style={[wrapperAnimatedStyle, styles.wrapper, style]}>
					<Image
						source={switchIcon}
						style={[styles.switchIcon, { bottom: switcherBottom }]}
						resizeMode="contain"
					/>
					<Animated.View style={[fiatAnimatedStyle, styles.currencyView]}>
						<Text
							style={[
								styles.currencyText,
								{ color: textColor, fontSize: textSize }
							]}
						>
							{fiat}
						</Text>
					</Animated.View>
					<Animated.View style={[cryptoAnimatedStyle, styles.currencyView]}>
						<Text
							style={[
								styles.currencyText,
								{ color: textColor, fontSize: textSize }
							]}
						>
							{crypto}
						</Text>
					</Animated.View>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: 120,
		height: 30,
		position: "relative",
		// backgroundColor: colors.gray,
		padding: 40
	},
	currencyView: {
		position: "absolute",
		left: 0,
		bottom: 30,
		width: 80,
		flexDirection: "row",
		justifyContent: "flex-start"
		// backgroundColor: colors.gray,
	},
	currencyText: {
		fontWeight: "600"
	},
	switchIcon: {
		width: 18,
		height: 18,
		opacity: 0.7,
		position: "absolute",
		left: 50
	}
});

const mapStateToProps = state => {
	return {
		activeCurrency: state.crypto.activeCurrency,
		cryptoCurrency: state.crypto.activeCryptoCurrency
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			setActiveCurrency
		},
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CurrencySwitcher);

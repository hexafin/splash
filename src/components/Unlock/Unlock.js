import React, { Component } from "react"
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Animated
} from "react-native"
import { colors } from "../../lib/colors"
import { defaults, icons } from "../../lib/styles"
import Keypad from '../universal/Keypad'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
import TouchID from "react-native-touch-id"


class Unlock extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: '',
		}
		this.onChangeText = this.onChangeText.bind(this)
		this.shakeAnimation = new Animated.Value(0)
	}

	componentDidMount() {
		TouchID.authenticate("Login with biometric").then(success => {
			if (success) {
				this.props.navigation.navigate('SwipeApp')
			}
		})
	}

	onChangeText(text) {
		if (text.length <= 4) {
			this.setState({value: text})
			ReactNativeHapticFeedback.trigger("impactLight", true)

			// if correct passcode TODO: use real passcode
			if (text == '1234') {
				this.props.navigation.navigate('SwipeApp')
			} else if (text.length == 4) {
				// if incorrect passcode
				Animated.spring(this.shakeAnimation, {
					toValue: 1,
					useNativeDriver: true,
				}).start(() => {
					this.shakeAnimation.setValue(0)
					this.setState({value: ''})
				})
				ReactNativeHapticFeedback.trigger("impactHeavy", true)
			}
		}
	}

	render() {
		const dropIcon = (index) => (this.state.value.length >= index) ? 'whiteDrop' : 'purpleDrop'
		const shakeTransform =  {
			transform: [
				{
					translateX: this.shakeAnimation.interpolate({
						inputRange: [0, 0.25, 0.5, 0.75, 1],
						outputRange: [0, 40, 0, -40, 0]
					})
				}
			]
		}

		return (
			<LinearGradient colors={['#5759D5', '#4E50E6']} style={styles.container}>
				<Image source={icons.whiteSplash} style={styles.splashLogo} resizeMode={'contain'}/>
				<Animated.View style={[styles.drops, shakeTransform]}>
					<Image source={icons[dropIcon(1)]} style={styles.drop} resizeMode={'contain'}/>
					<Image source={icons[dropIcon(2)]} style={styles.drop} resizeMode={'contain'}/>
					<Image source={icons[dropIcon(3)]} style={styles.drop} resizeMode={'contain'}/>
					<Image source={icons[dropIcon(4)]} style={styles.drop} resizeMode={'contain'}/>
				</Animated.View>
				<Keypad primaryColor={'#484AD4'}
						pressColor={'#6466F6'}
						textColor={'#FFFFF'}
						onChange={(text) => this.onChangeText(text)}
						disabled={(this.state.value.length >= 4) ? true : false}
						decimal={false}
						value={this.state.value}
						arrow={'white'} />
				{/*<TouchableOpacity onPress={() => console.log('forgot')}>
					<Text style={styles.forgotText}>Forgot?</Text>
				</TouchableOpacity>*/}
			</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 75,
	},
	splashLogo: {
		height: 34,
		width: 26,
		marginBottom: 76,
		alignSelf: 'center'
	},
	drops: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 113,
		paddingHorizontal: 105,
	},
	drop: {
		height: 15,
		width: 12,
	},
	forgotText: {
		fontSize: 14,
		color: colors.white,
		paddingTop: 38,
		alignSelf: 'center'
	},
})

export default Unlock

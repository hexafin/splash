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
import * as Keychain from 'react-native-keychain';


class Unlock extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: '',
			passcode: null,
		}
		this.onChangeText = this.onChangeText.bind(this)
		this.shakeAnimation = new Animated.Value(0)
	}

	componentDidMount() {
		TouchID.authenticate("Login with FaceID").then(success => {
			if (success) {
				this.props.navigation.state.params.successCallback()
			}
		})

		Keychain.getGenericPassword().then(data => {
			const passcode = JSON.parse(data.password).passcode
			this.setState({passcode})
		})
	}

	onChangeText(char) {
		if (this.state.value.length < 4 && char != 'delete') {

			const newValue = (this.state.value+char)
			this.setState({value: newValue})
			ReactNativeHapticFeedback.trigger("impactLight", true)

			// if correct passcode 
			if (this.state.passcode && newValue == this.state.passcode) {

				this.props.navigation.state.params.successCallback()

			} else if (newValue.length == 4) {
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
		} else if (char == 'delete') {
			this.setState({value: this.state.value.slice(0, -1)})
		}
	}

	render() {
		
		const dropIcon = (index) => (this.state.value.length >= index) ? <Image source={icons['whiteDrop']} style={styles.drop} resizeMode={'contain'}/>
																	   : <Image source={icons['purpleDrop']} style={styles.drop} resizeMode={'contain'}/>
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
					{dropIcon(1)}
					{dropIcon(2)}
					{dropIcon(3)}
					{dropIcon(4)}
				</Animated.View>
				<Keypad primaryColor={'#484AD4'}
						pressColor={'#6466F6'}
						textColor={'white'}
						onChange={(char) => this.onChangeText(char)}
						disabled={(this.state.value.length >= 4) ? true : false}
						decimal={false}
						delete={true}
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

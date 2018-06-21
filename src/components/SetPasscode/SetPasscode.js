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

class SetPasscode extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: '',
			confirmValue: null,
		}
		this.onChangeText = this.onChangeText.bind(this)
		this.shakeAnimation = new Animated.Value(0)
	}

	onChangeText(char) {
		if (this.state.value.length < 4 && char != 'delete') {

			const newValue = (this.state.value+char)
			this.setState({value: newValue})
			ReactNativeHapticFeedback.trigger("impactLight", true)

			if (newValue.length == 4 && !this.state.confirmValue) {
				this.setState({confirmValue: newValue, value: ''})
			} else if (newValue.length == 4 && newValue == this.state.confirmValue) {

				this.props.navigation.state.params.successCallback(newValue)

			} else if (newValue.length == 4 && newValue != this.state.confirmValue) {
				Animated.spring(this.shakeAnimation, {
					toValue: 1,
					useNativeDriver: true,
				}).start(() => {
					this.shakeAnimation.setValue(0)
					this.setState({value: '', confirmValue: null})
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
				{!this.state.confirmValue && 
				<View>
					<Text style={styles.title}>Type your new passcode</Text>
					<Text style={styles.subtitle}>Splash will lock when you leave</Text>
					<Text style={[styles.subtitle, {marginBottom: 49}]}>for more than 5 minutes.</Text>
				</View>}
				{this.state.confirmValue && <Text style={styles.confirmTitle}>Confirm your passcode</Text>}
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
		alignContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.white,
		paddingTop: 69,
		paddingBottom: 10,
		alignSelf: 'center'
	},
	confirmTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.white,
		alignSelf: 'center',
		paddingTop: 81,
		paddingBottom: 81,
	},
	subtitle: {
		fontSize: 16,
		color: '#A4A5F6',
		alignSelf: 'center',
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

export default SetPasscode

import React, { Component } from "react";
import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    Text,
    Image,
	Animated,
	Dimensions,
} from "react-native"
import {colors} from "../../lib/colors"
import { icons } from "../../lib/styles";
const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

// example usage
// <Keypad primaryColor={'#484AD4'}
//		pressColor={'#6466F6'}
//		textColor={'white'}
//		onChange={(char) => console.log(char)}
//		disabled={false}
//		decimal={true}
//		delete={true}
//		arrow={'white'} />
// arrow prop must be either 'white' or 'purple'
class Keypad extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	index: null,
	  }
	  this.pressIn = this.pressIn.bind(this)
	  this.pressOut = this.pressOut.bind(this)
	  this.changeValue = this.changeValue.bind(this)
	  this.animation = new Animated.Value(0)
	}

	changeValue(char) {
		this.props.onChange(char)
	}

	pressIn(x) {
		this.setState({index: x}, () => {
			Animated.timing(this.animation, {
				toValue: 1,
				duration: 20,
			}).start()
		})
	}

	pressOut(x) {
		this.setState({index: x}, () => {
			Animated.timing(this.animation, {
				toValue: 0,
				duration: 20,
			}).start()
		})
	}

	render() {

		const { style={} } = this.props

		const buttonStyle = [styles.button, {backgroundColor: this.props.primaryColor}]
		const textStyle = [styles.numberText, {color: this.props.textColor}]

		const buttonTransform = (x) => {
			if (x == this.state.index) {
				return {
					backgroundColor: this.animation.interpolate({
						inputRange: [0, 1],
						outputRange: [this.props.primaryColor, this.props.pressColor]
					})
				}
			} else {
				return {}
			}
		}

		return (
	    <View style={[styles.container, style]}>
	    	<View style={styles.row}>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('1')} onPressIn={() => this.pressIn(1)} onPressOut={() => this.pressOut(1)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(1)]}>
		    			<Text style={textStyle}>1</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => this.changeValue('2')} onPressIn={() => this.pressIn(2)} onPressOut={() => this.pressOut(2)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(2)]}>
		    			<Text style={textStyle}>2</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('3')} onPressIn={() => this.pressIn(3)} onPressOut={() => this.pressOut(3)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(3)]}>
		    			<Text style={textStyle}>3</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    	</View>
	    	<View style={styles.row}>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('4')} onPressIn={() => this.pressIn(4)} onPressOut={() => this.pressOut(4)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(4)]}>
		    			<Text style={textStyle}>4</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('5')} onPressIn={() => this.pressIn(5)} onPressOut={() => this.pressOut(5)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(5)]}>
		    			<Text style={textStyle}>5</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('6')} onPressIn={() => this.pressIn(6)} onPressOut={() => this.pressOut(6)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(6)]}>
		    			<Text style={textStyle}>6</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    	</View>
	    	<View style={styles.row}>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('7')} onPressIn={() => this.pressIn(7)} onPressOut={() => this.pressOut(7)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(7)]}>
		    			<Text style={textStyle}>7</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('8')} onPressIn={() => this.pressIn(8)} onPressOut={() => this.pressOut(8)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(8)]}>
		    			<Text style={textStyle}>8</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('9')} onPressIn={() => this.pressIn(9)} onPressOut={() => this.pressOut(9)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(9)]}>
		    			<Text style={textStyle}>9</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    	</View>
	    	<View style={styles.row}>
	    		{this.props.decimal && <TouchableOpacity style={[buttonStyle, {backgroundColor: 'rgba(0,0,0,0)'}]} onPress={() => this.changeValue('.')}>
	    			<Text style={textStyle}>.</Text>
	    		</TouchableOpacity>}
	    		{!this.props.decimal && <View style={[buttonStyle, {backgroundColor: 'rgba(0,0,0,0)'}]} />}
	    		<TouchableWithoutFeedback onPress={() => this.changeValue('0')} onPressIn={() => this.pressIn(0)} onPressOut={() => this.pressOut(0)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(0)]}>
		    			<Text style={textStyle}>0</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		{this.props.delete && <TouchableOpacity style={styles.deleteButton} onPress={() => this.changeValue('delete')}>
					<Image source={icons[this.props.arrow+'Arrow']} style={styles.arrow} resizeMode="contain"/>
	    		</TouchableOpacity>}	
	    		{!this.props.delete && <View style={[buttonStyle, {backgroundColor: 'rgba(0,0,0,0)'}]} />}
	    	</View>
	    </View>

		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 43
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',

	},
	button: {
		height: SCREEN_HEIGHT*0.109,
		width: SCREEN_HEIGHT*0.109,
		backgroundColor: '#484AD4',
		borderRadius: SCREEN_HEIGHT*0.0545,
		marginBottom: 11,
		justifyContent: 'center',
		alignItems: 'center'
	},
	deleteButton: {
		height: SCREEN_HEIGHT*0.109,
		width: SCREEN_HEIGHT*0.109,
		borderRadius: SCREEN_HEIGHT*0.0545,
		marginBottom: 11,
		backgroundColor: 'rgba(0,0,0,0)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	numberText: {
		fontSize: 32,
	},
	bottomRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'

	},
	arrow: {
		flex: 1,
		alignSelf: 'center',
		justifyContent: 'center',
		width: 30,
		height: 16,
	}
})

export default Keypad

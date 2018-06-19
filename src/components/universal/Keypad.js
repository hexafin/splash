import React, { Component } from "react";
import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    Text,
    Image,
	Animated,
} from "react-native"
import {colors} from "../../lib/colors"
import { icons } from "../../lib/styles";

// example usage
// <Keypad primaryColor={'#484AD4'} pressColor={'#6466F6'} textColor={'#FFFFF'} onChange={(text) => console.log(text)} decimal={true} arrow={'white'} />
// arrow prop must be either 'white' or 'purple'
class Keypad extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	value: '',
	  	decimal: false,
	  	index: null,
	  };
	  this.addValue = this.addValue.bind(this)
	  this.deleteValue = this.deleteValue.bind(this)
	  this.pressIn = this.pressIn.bind(this)
	  this.pressOut = this.pressOut.bind(this)
	  this.animation = new Animated.Value(0)
	}

	addValue(char) {
		if (char != '.') {
			this.setState({value: this.state.value+char})
			this.props.onChange(this.state.value+char)
		} else if (char == '.' && !this.state.decimal) {
			this.setState({value: this.state.value+char, decimal: true})
			this.props.onChange(this.state.value+char)
		}
	}

	deleteValue() {
		if (this.state.value.slice(-1) == '.') {
			this.setState({decimal: false})
		}
		this.setState({value: this.state.value.slice(0, -1)})
		this.props.onChange(this.state.value.slice(0, -1))
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
	    <View style={styles.container}>
	    	<View style={styles.row}>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(1)} onPressIn={() => this.pressIn(1)} onPressOut={() => this.pressOut(1)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(1)]}>
		    			<Text style={styles.numberText}>1</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => this.addValue(2)} onPressIn={() => this.pressIn(2)} onPressOut={() => this.pressOut(2)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(2)]}>
		    			<Text style={styles.numberText}>2</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(3)} onPressIn={() => this.pressIn(3)} onPressOut={() => this.pressOut(3)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(3)]}>
		    			<Text style={styles.numberText}>3</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    	</View>
	    	<View style={styles.row}>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(4)} onPressIn={() => this.pressIn(4)} onPressOut={() => this.pressOut(4)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(4)]}>
		    			<Text style={styles.numberText}>4</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(5)} onPressIn={() => this.pressIn(5)} onPressOut={() => this.pressOut(5)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(5)]}>
		    			<Text style={styles.numberText}>5</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(6)} onPressIn={() => this.pressIn(6)} onPressOut={() => this.pressOut(6)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(6)]}>
		    			<Text style={styles.numberText}>6</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    	</View>
	    	<View style={styles.row}>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(7)} onPressIn={() => this.pressIn(7)} onPressOut={() => this.pressOut(7)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(7)]}>
		    			<Text style={styles.numberText}>7</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(8)} onPressIn={() => this.pressIn(8)} onPressOut={() => this.pressOut(8)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(8)]}>
		    			<Text style={styles.numberText}>8</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableWithoutFeedback onPress={() => this.addValue(9)} onPressIn={() => this.pressIn(9)} onPressOut={() => this.pressOut(9)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(9)]}>
		    			<Text style={styles.numberText}>9</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    	</View>
	    	<View style={styles.row}>
	    		{this.props.decimal && <TouchableOpacity style={[buttonStyle, {backgroundColor: 'rgba(0,0,0,0)'}]} onPress={() => this.addValue('.')}>
	    			<Text style={styles.numberText}>.</Text>
	    		</TouchableOpacity>}
	    		{!this.props.decimal && <View style={[buttonStyle, {backgroundColor: 'rgba(0,0,0,0)'}]} />}
	    		<TouchableWithoutFeedback onPress={() => this.addValue(0)} onPressIn={() => this.pressIn(0)} onPressOut={() => this.pressOut(0)}>
	    			<Animated.View style={[buttonStyle, buttonTransform(0)]}>
		    			<Text style={styles.numberText}>0</Text>
	    			</Animated.View>
	    		</TouchableWithoutFeedback>
	    		<TouchableOpacity style={styles.deleteButton} onPress={this.deleteValue}>
					<Image source={icons[this.props.arrow+'Arrow']} style={styles.arrow} resizeMode="contain"/>
	    		</TouchableOpacity>	    		
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
		height: 89,
		width: 89,
		backgroundColor: '#484AD4',
		borderRadius: 44.5,
		marginBottom: 11,
		justifyContent: 'center',
		alignItems: 'center'
	},
	deleteButton: {
		height: 89,
		width: 89,
		borderRadius: 44.5,
		marginBottom: 11,
		backgroundColor: 'rgba(0,0,0,0)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	numberText: {
		fontSize: 32,
		color: 'white'
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

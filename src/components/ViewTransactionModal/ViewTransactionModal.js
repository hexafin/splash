import React, { Component } from "react"
import {
	Animated,
	Easing,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Image
} from "react-native";
import { colors } from "../../lib/colors"
import { icons, defaults } from "../../lib/styles";
import LoadingCircle from "../universal/LoadingCircle"
import LetterCircle from "../universal/LetterCircle"
import Button from "../universal/Button"
import moment from "moment"

class ViewTransactionModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			backgroundOpacity: new Animated.Value(0.0)
		};
	}

	componentDidMount() {
		Animated.sequence([
			Animated.delay(300),
			Animated.timing(this.state.backgroundOpacity, {
				toValue: 1,
				easing: Easing.linear(),
				duration: 200
			})
		]).start();
	}

	render() {

		const {
			direction,
			domain,
			relativeAmount,
			amount,
			timestamp
		} = this.props.navigation.state.params
	    const letter = domain[0].toUpperCase()
	    const domainCapitalized = domain[0].toUpperCase() + domain.slice(1)
	    const date = moment.unix(timestamp).format('LLL')
	    const rate = (1.0*relativeAmount/amount).toFixed(2)

		const dismiss = () => {
			Animated.timing(this.state.backgroundOpacity, {
				toValue: 0,
				duration: 200,
				easing: Easing.linear()
			}).start(({ finished }) => {
				if (finished) {
					this.props.navigation.goBack();
				}
			});
		};

		return (
			<Animated.View
				style={[styles.container, {
						backgroundColor: this.state.backgroundOpacity.interpolate(
							{inputRange: [0, 1], outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.2)"]}
						)
					}
				]}
			>

			<View style={styles.popup}>
				<View style={styles.content}>
					<View style={styles.header}>
					  <View style={{flexDirection: 'row', alignItems: 'center'}}>
		                  <Text style={styles.title}>You {(direction == 'in') ? 'received' : 'sent'}</Text>
						  <Image source={icons.arrow[direction]} style={styles.arrow} resizeMode="cover"/>
					  </View>	                  
	                  <TouchableOpacity onPress={dismiss}>
	                    <Image style={{height: 20, width: 20}} source={require('../../assets/icons/Xbutton.png')}/>
	                  </TouchableOpacity>
	                </View>
	                <View style={styles.amountBox}>
	                  <Text style={{fontSize: 28, color: colors.white, fontWeight: '600'}}>USD ${relativeAmount.toFixed(2)}</Text>
	                  <Text style={{fontSize: 18, opacity: 0.77, color: colors.white, fontWeight: '600'}}>{amount.toFixed(5)} BTC</Text>
	                </View>
	                <Text style={styles.subtitle}>Created on</Text>
	                <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 12}}>
	                    <LetterCircle size={32} letter={letter}/>
	                    <Text style={{color: colors.nearBlack, fontSize: 15, paddingLeft: 10}}>{domainCapitalized}</Text>
	                </View>
	                <Text style={styles.subtitle}>Date</Text>
	                <Text style={{color: colors.nearBlack, fontSize: 15, paddingBottom: 15}}>{date}</Text>
	                <Text style={styles.subtitle}>Exchange rate</Text>
	                <Text style={{color: colors.nearBlack, fontSize: 15, paddingBottom: 32}}>1 Bitcoin = USD ${rate}</Text>
	                <Button primary={true} title={'Got it'} onPress={dismiss} />
				</View>
			</View>

			</Animated.View>
		);
	}
}

export default ViewTransactionModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0)",
		justifyContent: "center",
		alignItems: 'center'
	},
	popup: {
		backgroundColor: colors.white,
		width: 338,
		height: 481,
		borderRadius: 10,
	},
	content: {
		flex: 1,
		padding: 30,
	},
	header: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    paddingBottom: 17,
	},
	title: {
	    fontSize: 20,
	    fontWeight: "600",
	    color: colors.nearBlack,
	},
	arrow: {
		width: 48,
		height: 24,
		marginTop: 9,
		marginLeft: 5,
		overflow: "visible"
	},
	amountBox: {
	    height: 83,
	    justifyContent: 'center',
	    alignItems: 'center',
	    alignSelf: 'stretch',
	    borderRadius: 8,
	    backgroundColor: '#6364F1',
	    marginBottom: 30,
	    marginHorizontal: 11,
	},
	subtitle: {
		fontSize: 14,
		color: '#B1B1B1',
		paddingBottom: 5,
	},

});

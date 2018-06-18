import React, { Component } from "react"
import {
	Animated,
	Easing,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	findNodeHandle,
	PanResponder,
	StyleSheet,
	Image,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors"
import { icons, defaults } from "../../lib/styles";
import LoadingCircle from "../universal/LoadingCircle"
import LetterCircle from "../universal/LetterCircle"
import Button from "../universal/Button"
import moment from "moment"
import { cryptoUnits } from '../../lib/cryptos'
import debounce from 'lodash/debounce';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

class ViewTransactionModal extends Component {

  constructor(props) {
    super(props)
    this.state = {dismissed: false}
    this.dismiss = props.dismiss
    this.position = new Animated.ValueXY({x: SCREEN_WIDTH+70, y: 0})
	this.opacityAnimation = new Animated.Value(0.0)
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }
	this.handleClose = this.handleClose.bind(this)
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
	      onStartShouldSetPanResponder: (evt, gestureState) => true,
	      onPanResponderMove: (evt, gestureState) => {
	        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
	      },
	      onPanResponderRelease: (evt, gestureState) => {

	        if (gestureState.dx > 120) {
	          Animated.spring(this.position, {
	            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
				useNativeDriver: true,
	          }).start()
	        }
	        else if (gestureState.dx < -120) {
	          Animated.spring(this.position, {
	            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
				useNativeDriver: true,
	          }).start()
	        }
	        else if (gestureState.dy > 120) {
	          Animated.spring(this.position, {
	            toValue: { x: gestureState.dx, y: SCREEN_HEIGHT + 100 },
				useNativeDriver: true,
	          }).start()
	        }
	        else if (gestureState.dy < -120) {
	          Animated.spring(this.position, {
	            toValue: { x: gestureState.dx, y: -SCREEN_HEIGHT - 100 },
				useNativeDriver: true,
	          }).start()
	        }
	        else {
	          Animated.spring(this.position, {
	            toValue: { x: 0, y: 0 },
	            friction: 4,
				useNativeDriver: true,
	          }).start()
	        }
	      },
	      onMoveShouldSetPanResponder: (evt, gestureState) => {
			    //return true if user is swiping, return false if it's a single click
                return !(gestureState.dx === 0 && gestureState.dy === 0)                  
			}
	    })

    	this.position.addListener(({x, y}) => {
	    	if (x >= SCREEN_WIDTH+80 || x <= -SCREEN_WIDTH-80 || y >= SCREEN_HEIGHT+80 || y <= -SCREEN_HEIGHT-80) {
	    			Animated.timing(this.position).stop()
		        	Animated.spring(this.opacityAnimation, {
			            toValue: 0.0,
			        }).start(() => this.setState({dismissed: true}, () => this.dismiss()))
	    		}
    	})
  	}

  	handleClose()  {
      Animated.spring(this.position, {
        toValue: { x: -SCREEN_WIDTH - 120, y: 0 },
        friction: 20,
		useNativeDriver: true,
      }).start()
  	}

  	componentDidMount() {
		Animated.sequence([
			Animated.delay(10),
			Animated.parallel([
		        Animated.spring(this.position, {
		            toValue: { x: 0, y: 0 },
		            friction: 50,
					useNativeDriver: true,
		        }),
		        Animated.spring(this.opacityAnimation, {
		            toValue: 1.0,
		        }),
		    ])
		]).start();
  	}

  	componentWillUnmount() {
  		this.position.removeAllListeners()
  	}

	render() {

		const {
			transaction,
			direction,
			exchangeRate,
			address,
		} = this.props
		const {
			domain,
			currency,
			relativeAmount,
			relativeCurrency,
			amount,
			type,
			timestamp,
		} = transaction
	    const letter = (type == 'card') ? domain[0].toUpperCase() : null
	    const domainCapitalized = (type == 'card') ? domain[0].toUpperCase() + domain.slice(1) : null
	    const date = moment.unix(timestamp).format('LLL')
	    const cryptoAmount = (type == 'card') ? amount/cryptoUnits.BTC : amount.subtotal/cryptoUnits.BTC
	    const rate = (relativeCurrency !== null && typeof relativeCurrency !== 'undefined') ? parseFloat(1.0*relativeAmount/cryptoAmount).toFixed(2) : parseFloat(exchangeRate)
	    const infoMessage = (direction == 'from') ? 'Received from' : 'Sent to'

		return (
		<TouchableWithoutFeedback onPress={this.handleClose}>
			<Animated.View pointerEvents={this.state.dismissed ? 'none' : 'auto'}
						   style={[styles.container, {backgroundColor: this.opacityAnimation.interpolate(
																								{inputRange: [0, 1], outputRange: ['rgba(0,0,0,0)', 'rgba(67,68,167,0.32)']}
																								)}]}>
					{!this.state.dismissed && <Animated.View 
						{...this.PanResponder.panHandlers}
						style={[styles.popup, this.rotateAndTranslate]}>
						<View style={styles.content}>
							<View style={styles.header}>
							  <View style={{flexDirection: 'row', alignItems: 'center'}}>
				                  <Text style={styles.title}>You {(direction == 'from') ? 'received' : 'sent'}</Text>
								  <Image source={icons.arrow[direction]} style={styles.arrow} resizeMode="cover"/>
							  </View>	                  
			                  <TouchableOpacity onPress={this.handleClose}>
			                    <Image style={{height: 20, width: 20}} source={require('../../assets/icons/Xbutton.png')}/>
			                  </TouchableOpacity>
			                </View>
			                <View style={styles.amountBox}>
			                  <Text style={{fontSize: 28, color: colors.white, fontWeight: '600'}}>USD ${parseFloat(rate*cryptoAmount).toFixed(2)}</Text>
			                  <Text style={{fontSize: 18, opacity: 0.77, color: colors.white, fontWeight: '600'}}>{parseFloat(cryptoAmount).toFixed(5)} BTC</Text>
			                </View>
			                {type == 'card' && <Text style={styles.subtitle}>Created on</Text>}
			                {type == 'blockchain' && <Text style={styles.subtitle}>{infoMessage}</Text>}
			                <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 12}}>
			                    <LetterCircle size={32} letter={letter} currency={currency}/>
			                    {type == 'card' && <Text style={{color: colors.nearBlack, fontSize: 15, paddingLeft: 10}}>{domainCapitalized}</Text>}
			                    {type == 'blockchain' && <Text style={{color: colors.nearBlack, fontSize: 10, paddingLeft: 5, fontWeight: '600'}}>{address}</Text>}
			                </View>
			                <Text style={styles.subtitle}>{(!!relativeCurrency) ? 'Worth' : 'Date'}</Text>
			                <Text style={{color: colors.nearBlack, fontSize: 15, paddingBottom: 15}}>{(!!relativeCurrency) ? '$'+String(parseFloat(relativeAmount).toFixed(2))+' '+relativeCurrency+' on ': ''}{date}</Text>
			                <Text style={styles.subtitle}>{(!!relativeCurrency) ? 'Exchange rate used' : 'Current exchange rate'}</Text>
			                <Text style={{color: colors.nearBlack, fontSize: 15, paddingBottom: 32}}>1 Bitcoin = USD ${rate}</Text>
			                <Button primary={true} title={'Got it'} onPress={this.handleClose} />
						</View>    							
					</Animated.View>}
			</Animated.View>
		</TouchableWithoutFeedback >
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
	blurView: {
	    position: 'absolute',
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0,
	},
	popup: {
		position: 'absolute',
		backgroundColor: colors.white,
		width: 338,
		height: 481,
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 15,
		},
		shadowRadius: 25,
		shadowOpacity: 0.3
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
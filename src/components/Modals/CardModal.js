import React, { Component } from "react";
import {
	Animated,
	Easing,
	View,
	TouchableWithoutFeedback,
	PanResponder,
	StyleSheet,
	Dimensions
} from "react-native"
import {colors} from "../../lib/colors"

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const CardModal = Child => {
 return class extends Component {
	  constructor(props) {
	    super(props)
	    this.state = {dismissed: false}
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
				  Animated.spring(this.opacityAnimation, {
			        toValue: 0.0,
			      }).start(() => this.props.hideModal())
		        }
		        else if (gestureState.dx < -120) {
		          Animated.spring(this.position, {
		            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
					useNativeDriver: true,
		          }).start()
				  Animated.spring(this.opacityAnimation, {
			        toValue: 0.0,
			      }).start(() => this.props.hideModal())
		        }
		        else if (gestureState.dy > 120) {
		          Animated.spring(this.position, {
		            toValue: { x: gestureState.dx, y: SCREEN_HEIGHT + 100 },
					useNativeDriver: true,
		          }).start()
				  Animated.spring(this.opacityAnimation, {
			        toValue: 0.0,
			      }).start(() => this.props.hideModal())
		        }
		        else if (gestureState.dy < -120) {
		          Animated.spring(this.position, {
		            toValue: { x: gestureState.dx, y: -SCREEN_HEIGHT - 100 },
					useNativeDriver: true,
		          }).start()
				  Animated.spring(this.opacityAnimation, {
			        toValue: 0.0,
			      }).start(() => this.props.hideModal())
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
		    			this.setState({dismissed: true}, () => {
			    			Animated.timing(this.position).stop()
		    			})
		    		}
	    	})
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

	  	handleClose()  {
	      Animated.spring(this.position, {
	        toValue: { x: -SCREEN_WIDTH - 120, y: 0 },
	        friction: 20,
			useNativeDriver: true,
	      }).start()
		  Animated.spring(this.opacityAnimation, {
	        toValue: 0.0,
	      }).start(() => this.props.hideModal())
	  	}

		render() {

			let backgroundColor = 'rgba(67,68,167,0.32)'
			if (this.props.backgroundColor) {
				backgroundColor = this.props.backgroundColor
			}

			return (
			<TouchableWithoutFeedback onPress={this.handleClose} disabled={this.state.dismissed} pointerEvents={this.state.dismissed ? 'none' : 'auto'}>
				<Animated.View pointerEvents={this.state.dismissed ? 'none' : 'auto'}
							   style={[styles.container, {backgroundColor: this.opacityAnimation.interpolate(
																									{inputRange: [0, 1], outputRange: ['rgba(0,0,0,0)', backgroundColor]}
																									)}]}>
						{!this.state.dismissed && <Animated.View 
							{...this.PanResponder.panHandlers}
							style={[styles.popup, this.rotateAndTranslate]}>

							<Child {...this.props} handleClose={this.handleClose} />

						</Animated.View>}
				</Animated.View>
			</TouchableWithoutFeedback>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0)",
		justifyContent: "center",
		alignItems: 'center',
		paddingHorizontal: 18,
		paddingVertical: 160,
	},
	popup: {
		position: 'absolute',
		backgroundColor: colors.white,
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 15,
		},
		shadowRadius: 25,
		shadowOpacity: 0.3
	},
})

export default CardModal

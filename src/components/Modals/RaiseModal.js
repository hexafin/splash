import React, { Component } from "react";
import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    Text,
    Image,
    Easing,
	Animated,
} from "react-native"
import {colors} from "../../lib/colors"
import { icons } from "../../lib/styles";

const RaiseModal = Child => {
 return class extends Component {

		constructor(props) {
			super(props)
			this.animation = new Animated.Value(0.0)
			this.backgroundOpacity = new Animated.Value(0)
		}

		componentDidMount() {
			Animated.sequence([
				Animated.delay(10),
		        Animated.spring(this.animation, {
		            toValue: 1.0,
		        }),
			]).start();
		}

		render() {

			const modalTransform = () => {
				return {
					transform: [
						{
							translateY: this.animation.interpolate({
								inputRange: [0, 1],
								outputRange: [400, 0]
							})
						}
					]
				}
			}


			const dismiss = (success=false) => {
				Animated.timing(this.animation, {
					toValue: 0,
					duration: 200,
					easing: Easing.linear(),
				}).start(({finished}) => {
					if (finished) {
						if(success && this.props.successCallback) {
							this.props.successCallback()
						}
						this.props.hideModal()
						if (this.props.dismissCallback) {
							this.props.dismissCallback()
						}
					}
				})
			}

			return (
				<TouchableWithoutFeedback onPress={() => dismiss()}>
				<Animated.View style={[styles.container, {backgroundColor: this.animation.interpolate({inputRange: [0, 1], outputRange: ['rgba(0,0,0,0)', 'rgba(67,68,167,0.32)']})}]}>
					<View style={{ flexDirection: "row" }}>
						<TouchableWithoutFeedback onPress={() => {}}>
						<Animated.View style={[styles.popup, modalTransform()]}>

							<Child {...this.props} dismiss={dismiss} />

					</Animated.View>
					</TouchableWithoutFeedback>
				</View>
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
    justifyContent: 'flex-end'
	},
  popup: {
    flex: 1,
    flexDirection: "column",
    height: 400,
    alignItems: "center",
    borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
    backgroundColor: colors.white
  },	
})

export default RaiseModal

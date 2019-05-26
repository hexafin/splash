import React, { Component } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import PropTypes from "prop-types";
import { isIphoneX } from "react-native-iphone-x-helper";

export default class AnimatedWaves extends Component {
	componentDidMount() {
		if (!!this.animation) {
			this.animation.play();
		}
	}

	render() {
		const width = 900;
		const height = 600;

		const bottomProp = this.props.bottom || -40;

		const defaultBottom = isIphoneX() ? bottomProp + 20 : bottomProp;

		return (
			<View
				style={[
					{
						position: "absolute",
						height: height,
						width: width,
						bottom: this.props.bottom || defaultBottom,
						left: -100
					},
					this.props.style || {}
				]}
			>
				<LottieView
					ref={animation => {
						this.animation = animation;
					}}
					source={require("../../assets/animations/animatedWaves.json")}
					style={{
						height: height,
						width: width
					}}
					loop={true}
					autoplay={true}
				/>
			</View>
		);
	}
}

AnimatedWaves.propTypes = {
	bottom: PropTypes.number
};

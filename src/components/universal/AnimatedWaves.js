import React, { Component } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import PropTypes from "prop-types";
import { isIphoneX } from "react-native-iphone-x-helper";

export default class AnimatedWaves extends Component {
	componentDidMount() {
		this.animation.play();
	}

	render() {
		const width = 800;
		const height = 400;

		const defaultBottom = isIphoneX() ? -20 : -40;

		return (
			<View
				style={[
					{
						position: "absolute",
						height: height,
						width: width,
						bottom: this.props.bottom || defaultBottom,
						left: -40
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

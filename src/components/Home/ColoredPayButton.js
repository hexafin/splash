import React, {Component} from "react"
import Svg, {Circle} from "react-native-svg"
import {
	Animated, 
    View,
	Dimensions,
    Image,
    TouchableWithoutFeedback
} from "react-native"
import Color from 'color';
import { defaults, icons } from "../../lib/styles";
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height
import extractBrush from 'react-native-svg/lib/extract/extractBrush';
import {isIphoneX} from "react-native-iphone-x-helper"

let AnimatedCircle = Animated.createAnimatedComponent(Circle)

class ColoredPayButton extends Component {
    componentDidMount() {
        this.props.fillInput.addListener(f => {
            this._component && this._component.setNativeProps({fill: extractBrush(this.props.fill.__getValue())})
        })
    }
    render() {

        return (
            <View style={{
                    position: "absolute",
                    bottom: isIphoneX() ? 40 : 20,
                    width: SCREEN_WIDTH,
                    flexDirection: "row",
                    justifyContent: "center",
                }}>
                <TouchableWithoutFeedback
                    onPress={this.props.onPress}>
                    
                    	<Svg
                    		width={70} 
                    		height={70} 
                    		viewBox="0 0 70 70">
            			    <AnimatedCircle
                                ref={component => {this._component = component}}
                                fill={this.props.fill.__getValue()}
                                cx="35" cy="35" r="35"/>
                            <Image
                                style={{
                                    position: "absolute",
                                    top: 18,
                                    left: 16,
                                    width: 35,
                                    height: 35,
                                }}
                                source={icons.startPay} resizeMode="contain"/>
            			</Svg>
                        
                    
                </TouchableWithoutFeedback>
            </View>
        );
    }
}
export default ColoredPayButton
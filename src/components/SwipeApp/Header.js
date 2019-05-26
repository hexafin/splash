import React, { Component } from "react";
import Svg, { G, Path } from "react-native-svg";
import { Animated, Dimensions } from "react-native";
import Color from "color";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
import extractBrush from "react-native-svg/lib/extract/extractBrush";

/*
Header wave which animates on position and color depending on swipe positions
<Header fillInput={animated value driving color fill} fill={color} />
*/

let AnimatedG = Animated.createAnimatedComponent(G);

class Header extends Component {
    componentDidMount() {
        this.props.fillInput.addListener(f => {
            this._component &&
                this._component.setNativeProps({
                    fill: extractBrush(this.props.fill.__getValue())
                });
        });
    }
    render() {
        return (
            <Svg width={SCREEN_WIDTH} height={(396 / 375) * SCREEN_WIDTH} viewBox="0 0 375 396">
                <AnimatedG
                    ref={component => {
                        this._component = component;
                    }}
                    fill={this.props.fill.__getValue()}
                >
                    <Path d="M0,0 L375,0 L375,387.179245 C339.355325,393.704622 309.789941,396.485791 286.303847,395.522753 C225.328718,393.02249 169.084364,374.698552 110.07317,377.843259 C51.3417556,380.973056 14.6506989,385.197965 0,390.517986 L0,0 Z" />
                </AnimatedG>
            </Svg>
        );
    }
}
export default Header;

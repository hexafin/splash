import React, {Component} from "react"
import {
    View
} from "react-native"
import LottieView from 'lottie-react-native'
import PropTypes from "prop-types"

export default class Checkmark extends Component {
    componentDidMount() {
        this.animation.play()
    }

    render() {

        const wrapperSize = this.props.size || 20
        const animationSize = wrapperSize * 3

        return (
            <View style={[
                {
                    position: 'relative',
                    height: wrapperSize,
                    width: wrapperSize
                },
                this.props.style || {}
            ]}>
                <View style={{
                    position: 'absolute',
                    left: wrapperSize * -1,
                    top: wrapperSize * -1,
                    height: animationSize,
                    width: animationSize,
                }}>
                    <LottieView
                        ref={animation => {
                            this.animation = animation
                        }} source={require('../../assets/animations/checkmark.json')}
                        style={{
                            height: animationSize,
                            width: animationSize,
                        }}
                        loop={false}
                        autoplay={true}
                    />
                </View>
            </View>
        )
    }
}

Checkmark.propTypes = {
    size: PropTypes.number
}

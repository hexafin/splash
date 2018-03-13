import React, {Component} from "react"
import {
    View
} from "react-native"
import LottieView from 'lottie-react-native'
import PropTypes from "prop-types"

export default class AnimatedWaves extends Component {
    componentDidMount() {
        this.animation.play()
    }

    render() {

        const bottom = this.props.bottom || -50

        const width = 600
        const height = 200

        return (
            <View style={[
                {
                    position: 'absolute',
                    height: height,
                    width: width,
                    bottom: bottom
                },
                this.props.style || {}
            ]}>
                <LottieView
                    ref={animation => {
                        this.animation = animation
                    }} source={require('../../assets/animations/animatedWaves.json')}
                    style={{
                        height: height,
                        width: width,
                    }}
                    loop={true}
                    autoplay={true}
                />
            </View>
        )
    }
}

AnimatedWaves.propTypes = {
    bottom: PropTypes.number
}

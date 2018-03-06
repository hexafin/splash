import React, {Component} from "react"
import {
    View
} from "react-native"
import LottieView from 'lottie-react-native'

export default class LoadingCircle extends Component {
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
                        }} source={require('../../assets/animations/loadingCircle.json')}
                        style={{
                            height: animationSize,
                            width: animationSize,
                        }}
                        loop={true}
                        autoplay={true}
                    />
                </View>
            </View>
        )
    }
}

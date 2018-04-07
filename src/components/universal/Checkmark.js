import React, {Component} from "react"
import {
    View,
    Animated,
    Easing
} from "react-native"
import LottieView from 'lottie-react-native'
import PropTypes from "prop-types"

export default class Checkmark extends Component {
    constructor(props) {
      super(props)
      this.state = {
        progress: new Animated.Value(0)
      }
    }

    componentDidMount() {
      if (this.props.callback) {
        Animated.timing(this.state.progress, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
        }).start(({finished}) => {
          if (finished) {
            this.props.callback()
          }
        })
      } else {
        this.animation.play()
      }
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
                        progress={this.state.progress}
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

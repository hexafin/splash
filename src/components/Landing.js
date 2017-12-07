import React, {Component} from "react"
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native"
import Button from "./universal/Button"
import {LoadApp} from "../actions/general"
import {colors} from "../lib/colors"
import {defaults} from "../lib/styles"
import TimerMixin from 'react-timer-mixin'

class Landing extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        if (this.props.authenticated) {
            Actions.home()
        }
    }

    render() {
        return (
            <View style={styles.container} onPress={() => LoadApp()}>

                <Image style={styles.loadingLogo} source={require("../lib/images/splash-logo-xlarge.png")}/>

                <Button style={styles.landingButton} onPress={() => Actions.splash()} title="Sign Up"/>

                <Button style={styles.landingButton} onPress={() => Actions.home()} title="Login"/>

            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    loadingLogo: {
        width: 400,
        height: 400
    },
    landingButton: {
        flex: 1
    }
})

const mapStateToProps = (state) => {
    return {
        authenticated: state.general.authenticated
    }
}

export default connect(mapStateToProps)(Landing)
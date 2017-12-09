import React, {Component} from "react"
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import {
    View,
    StyleSheet,
    Image
} from "react-native"
import Button from "../universal/Button"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"

class Landing extends Component {

    constructor(props) {
        super(props)

    }

    componentWillMount() {
      //  this.props.LoadApp();
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.loadingLogo} source={require("../../lib/images/splash-logo-xlarge.png")}/>
                <Button style={styles.landingButton} onPress={() => Actions.splash()} title="Sign Up"/>
                <Button style={styles.landingButton} onPress={() => this.props.LoadApp()} title="Login"/>
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

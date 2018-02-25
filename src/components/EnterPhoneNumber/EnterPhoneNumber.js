import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard
} from "react-native"
import {Input} from "../universal/Input"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import { Field, reduxForm } from 'redux-form'

class EnterPhoneNumber extends Component {

    componentWillMount() {
        if (this.props.splashtag == "") {
            this.props.navigation.navigate("ChooseSplashtag")
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={"height"}>

                <View style={styles.body}>

                    <Text style={styles.title}>
                        Welcome, @{this.props.splashtag}
                    </Text>

                    <Text style={styles.subtitle}>
                        Verify your number to claim your splashtag
                    </Text>

                    <Field style={styles.phoneNumber} name='phoneNumber' placeholder={"### ### ####"} component={Input}
                           autoCapitalize="none" autoCorrect={false} spellCheck={false} autoFocus={true}/>

                   <Text style={styles.description}>
                       We'll text you a verification code to make sure it's you
                   </Text>

                    <Button onPress={() => {
                        // TODO: sms authentication function
                        this.props.navigation.navigate("VerifyPhoneNumber")
                    }}
                        style={styles.footerButton} title={"Text me the code"}
                        primary={true}
                        disabled={this.props.phoneNumber == ""}/>

                </View>


                <FlatBackButton onPress={() => {
                    this.props.navigation.navigate("ChooseSplashtag")
                }}/>
            </KeyboardAvoidingView>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: 0,
        paddingTop: 60
    },
    wavesImage: {
        position: "absolute",
        bottom: -50,
        left: 0,
        right: 0,
        width: 400,
        height: 400
    },
    body: {
        flex: 1,
        padding: 20,
        paddingBottom: 0,
        flexDirection: "column",
        justifyContent: "space-around"
    },
    title: {
        fontSize: 30,
        fontWeight: '500',
        color: colors.nearBlack,
        marginBottom: 20,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 20,
        textAlign: "center",
        color: colors.nearBlack,
        marginBottom: 20
    },
    description: {
        fontSize: 20,
        textAlign: "center",
        color: colors.lightGray,
        marginBottom: 20,
        marginTop: 15,
        zIndex: 40
    },
    phoneNumber: {
        zIndex: 50
    }
})


export default reduxForm({
   form: 'enterPhoneNumber',
   destroyOnUnmount: false,
})(EnterPhoneNumber)

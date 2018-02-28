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
import CountryCodeInput from "../universal/CountryCodeInput"

// function that formats and restricts phone number input - used with redux-form's normalize
const normalizePhone = (value, previousValue) => {
    if (!value) {
        return value
    }
    const onlyNums = value.replace(/[^\d]/g, '')
    if (!previousValue || value.length > previousValue.length) {
        // typing forward
        if (onlyNums.length === 3) {
            return onlyNums + ' '
        }
        if (onlyNums.length === 6) {
            return onlyNums.slice(0, 3) + ' ' + onlyNums.slice(3) + ' '
        }
    }
    if (onlyNums.length <= 3) {
        return onlyNums
    }
    if (onlyNums.length <= 6) {
        return onlyNums.slice(0, 3) + ' ' + onlyNums.slice(3)
    }
    return onlyNums.slice(0, 3) + ' ' + onlyNums.slice(3, 6) + ' ' + onlyNums.slice(6, 10)
}

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

                    <View style={styles.fieldsWrapper}>
                        <CountryCodeInput style={styles.countryCode}/>
                        <Field style={styles.phoneNumber} name='phoneNumber'
                                placeholder={"### ### ####"} component={Input}
                                autoCapitalize="none" autoCorrect={false}
                                spellCheck={false} autoFocus={true}
                                normalize={normalizePhone}/>
                    </View>

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
    fieldsWrapper: {
        flexDirection: "row"
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
        zIndex: 50,
        height: 50
    }
})


export default reduxForm({
   form: 'enterPhoneNumber',
   destroyOnUnmount: false,
})(EnterPhoneNumber)

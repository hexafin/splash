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
import PhoneNumberInput from "../universal/PhoneNumberInput"

class EnterPhoneNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: {
                countryName: null,
                countryFlag: null,
                countryCode: null,
                number: null
            }
        }
    }

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
                        Welcome,{"\n"}
                        @{this.props.splashtag}
                    </Text>

                    <Text style={styles.subtitle}>
                        Verify your number to claim{"\n"}
                        your splashtag
                    </Text>

                    <PhoneNumberInput autoFocus callback={(phoneNumber) => {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                phoneNumber
                            }
                        })
                    }}/>

                   <Text style={styles.description}>
                       We'll text you a verification code{"\n"}
                       to make sure it's you
                   </Text>

                   <Button
                       onPress={() => {
                           // TODO: sms authentication function
                           console.log(this.state)
                           // this.props.navigation.navigate("VerifyPhoneNumber")
                       }}
                       style={styles.footerButton} title={"Text me the code"}
                       primary={true}
                       disabled={false}/>

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
        paddingTop: 40
    },
    body: {
        flex: 1,
        padding: 20,
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
        marginBottom: 20,
        zIndex: 10
    },
    description: {
        fontSize: 20,
        textAlign: "center",
        color: colors.lightGray,
        marginBottom: 20,
        marginTop: 15,
        zIndex: 40
    }
})


export default reduxForm({
   form: 'enterPhoneNumber',
   destroyOnUnmount: false,
})(EnterPhoneNumber)

import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
    Alert,
    KeyboardAvoidingView,
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import NumericCodeInput from "../universal/NumericCodeInput"

class VerifyPhoneNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: ""
        }
    }

    componentDidUpdate(prevProps) {
      if((this.props.confirmError != prevProps.confirmError && this.props.confirmError) || (this.props.claimError != prevProps.claimError && this.props.claimError)) {
        Alert.alert('An error occurred!', 'Sorry about this. Our team has been notified and we should fix this shortly!', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'Ok',
                onPress: () => console.log('OK Pressed')
            }
        ])
      }
    }

    render() {

        return (<KeyboardAvoidingView style={styles.container} behavior={"padding"}>

            <View style={styles.body}>

                <Text style={styles.title}>
                    Enter the 6-digit code we{"\n"}
                    just texted you
                </Text>

                <View>
                    <NumericCodeInput size={6} autoFocus={true} callback={(code) => {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                code: code
                            }
                        })
                    }}/>

                    <View style={styles.resendWrapper}>
                        <Text style={styles.resendText}>Didn{"'"}t get your code?</Text>
                        <Button
                            onPress={() => {
                                this.props.SmsAuthenticate(this.props.phoneNumber, this.props.countryName)
                            }} style={styles.resendButton} title={"Resend"}
                            primary={false} loading={this.props.isSmsAuthenticating} small/>
                    </View>
                </View>

                <Button onPress={() => {
                        // TODO: sms authentication function
                        Keyboard.dismiss()
                        this.props.SmsConfirm(this.state.code)
                    }} style={styles.footerButton} title={"Claim splashtag"}
                    primary={true}
                    loading={this.props.isSmsConfirming}
                    disabled={this.state.code.length < 6}/>

            </View>

            <FlatBackButton onPress={() => {
                Keyboard.dismiss()
                this.props.navigation.navigate("EnterPhoneNumber")
            }}/>
        </KeyboardAvoidingView>)

    }

}

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: 27,
        paddingTop: 80
    },
    body: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 23,
        color: colors.nearBlack,
        marginTop: 20,
        marginBottom: 20,
        textAlign: "center"
    },
    resendWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 16,
        color: colors.lightGray
    },
    resendButton: {
        width: 90,
        marginLeft: 10,
    }
})

export default VerifyPhoneNumber

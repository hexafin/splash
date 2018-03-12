import React, {Component} from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard
} from "react-native"
import {Input} from "../universal/Input"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import PhoneNumberInput from "../universal/PhoneNumberInput"

class EnterPhoneNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: {
                countryName: "",
                countryFlag: "",
                countryCode: "",
                number: ""
            },
            isLoading: false
        }
    }

    componentWillMount() {
        if (this.props.splashtag == "") {
            this.props.navigation.navigate("ChooseSplashtag")
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.smsError != prevProps.smsError && this.props.smsError) {
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
        return (<KeyboardAvoidingView style={styles.container} behavior={"height"}>

            <View style={styles.body}>

                <Text style={styles.title}>
                    Welcome,{"\n"}
                    @{this.props.splashtag}
                </Text>

                <Text style={styles.subtitle}>
                    Verify your number to claim{"\n"}
                    your splashtag
                </Text>

                <PhoneNumberInput autoFocus={true} callback={(phoneNumber) => {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                phoneNumber
                            }
                        })
                    }}/>

                <Text style={styles.description}>
                    We{"'"}ll text you a verification code{"\n"}
                    to make sure it{"'"}s you
                </Text>

                <Button onPress={() => {

                        // remove spaces from phone number
                        var fullNumber = this.state.phoneNumber.countryCode + this.state.phoneNumber.number
                        fullNumber = fullNumber.replace(/\s/g, '')

                        // initiate animation
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                isLoading: true
                            }
                        })

                        // intitiate authentication process
                        this.props.SmsAuthenticate(fullNumber, this.state.phoneNumber.countryName)
                        Keyboard.dismiss()

                    }} style={styles.footerButton}
                    title={"Text me the code"}
                    primary={true} loading={true}
                    loading={this.state.isLoading}
                    disabled={this.state.phoneNumber.number.length < 12}/>

            </View>

            <FlatBackButton onPress={() => {
                    // Keyboard.dismiss()
                    this.props.navigation.navigate("ChooseSplashtag")
                }}/>
        </KeyboardAvoidingView>)

    }

}

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: 0,
        paddingTop: 80
    },
    body: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-between"
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

export default EnterPhoneNumber

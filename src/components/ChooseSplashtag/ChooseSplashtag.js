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

class ChooseSplashtag extends Component {

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={"height"}>

                <View style={styles.body}>

                    <Text style={styles.title}>
                        Let's get you setup
                    </Text>

                    <Text style={styles.description}>
                        Your splashtag is your unique username, how others find you on Splash
                    </Text>

                    <Field style={styles.splashtag} name='splashtag' placeholder='Choose splashtag' component={Input}
                           autoCapitalize="none" autoCorrect={false} spellCheck={false} autoFocus={true}/>

                    <Button
                        onPress={() => {
                            Keyboard.dismiss()
                            this.props.navigation.navigate("EnterPhoneNumber")
                        }}
                        style={styles.footerButton} title={"Claim splashtag"}
                        primary={true}
                        disabled={this.props.splashtag == ""}/>

                </View>


                <FlatBackButton onPress={() => {
                    Keyboard.dismiss()
                    this.props.navigation.navigate("Landing")
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
    description: {
        fontSize: 20,
        textAlign: "center",
        color: colors.lightGray,
        marginBottom: 20
    },
    footerButton: {

    }
})


export default reduxForm({
   form: 'chooseSplashtag',
   destroyOnUnmount: false,
})(ChooseSplashtag)

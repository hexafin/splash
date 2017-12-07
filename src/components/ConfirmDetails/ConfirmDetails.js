
import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"
import BackButton from "../universal/BackButton"

import {Actions} from "react-native-router-flux"
import { MultiInputBlock } from '../universal/Input'
import { reduxForm } from 'redux-form'


const ConfirmDetails = ({CreateNewAccount}) => {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <BackButton onPress={() => Actions.pop()} />
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>👌</Text>
                <Text style={styles.headerText}>Everything looking good?</Text>
            </View>
            <View style={styles.body}>
                <MultiInputBlock 
                    inputs={[
                        {
                            name: 'first_name',
                            placeholder: 'Your first name'
                        },
                        {
                            name: 'last_name',
                            placeholder: 'Your last name'
                        },
                        {
                            name: 'email',
                            placeholder: 'Your email'
                        }
                    ]}
                />
            </View>
            <View style={styles.footer}>
                <Button title="Finish setup" onPress={() => CreateNewAccount()}/>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: colors.white
    },
    header: {
        flexDirection: "column",
        justifyContent: "center",
        flex: 1
    },
    headerEmoji: {
        fontSize: 40,
        flexDirection: "row",
        textAlign: "center",
        padding: 5
    },
    headerText: {
        flexDirection: "row",
        fontSize: 25,
        textAlign: "center",
        paddingTop: 5,
        fontWeight: "600",
        color: colors.nearBlack
    },
    body: {
        padding: 20,
        paddingTop: 10,
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    footer: {
        flex: 0,
        padding: 20
    }
})

export default reduxForm({
   form: 'onboarding',
   destroyOnUnmount: false,
})(ConfirmDetails)
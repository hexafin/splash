// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"
import BackButton from "../universal/BackButton";
import {Actions} from "react-native-router-flux"
import { Input } from '../universal/Input'
import { Field, reduxForm } from 'redux-form'


const ChooseUsername = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => Actions.pop()} />
                <Text style={styles.headerEmoji}>🎅</Text>
                <Text style={styles.headerText}>Choose your username</Text>
                <Text style={styles.headerText}>- it's yours, forever.</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.usernameWrapper}>
                    <Text style={styles.atSign}>@</Text>
                    <Field style={styles.usernameField} name='username' placeholder='Choose username' component={Input}
                           autoCapitalize="none" spellbryceCheck={false} autoCorrect={false}></Field>
                </View>
                <Text style={styles.bodyText}>
                    Your username will be the way people can find you in the app and send money to you.
                </Text>
            </View>
            <Button style={{flex: 0}} title="Set username" onPress={() => Actions.welcome()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        padding: 20,
        paddingTop: 50,
        paddingBottom: 50
    },
    header: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
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
    usernameWrapper: {
        flexDirection: "row",
        justifyContent: "center"
    },
    atSign: {
        fontSize: 28,
        color: colors.gray,
        paddingTop: 14,
        paddingRight: 10
    },
    usernameField: {
        flex: 1
    },
    body: {
        paddingTop: 50,
        flex: 2,
        flexDirection: "column",
        justifyContent: "center"
    },
    bodyText: {
        flex: 1,
        marginTop: 20,
        color: colors.gray,
        textAlign: "center",
        fontSize: 20,
        paddingLeft: 20,
        paddingRight: 20,
        fontWeight: "500",
        backgroundColor: 'rgba(0,0,0,0)'
    }
})

export default reduxForm({
   form: 'onboarding',
   destroyOnUnmount: false,
})(ChooseUsername)
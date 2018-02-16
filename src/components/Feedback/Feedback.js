
import React from "react"
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import Button from "../universal/Button"
import {Input} from "../universal/Input"
import BackButton from "../universal/BackButton"
import {Actions} from "react-native-router-flux"
import {reduxForm, Field} from "redux-form"

const Feedback = ({feedbackType = "negative", SubmitFeedback}) => {

    let placeholder = "Your favorite part"
    if (feedbackType == "negative") {
        placeholder = "Describe the problem"
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <BackButton type="right" onPress={() => Actions.pop()} />
            <View style={styles.header}>
                {feedbackType == "positive" && <Text style={styles.headerEmoji}>💁‍♀️</Text>}
                {feedbackType == "negative" && <Text style={styles.headerEmoji}>🤦‍♀️‍</Text>}

                {feedbackType == "positive" && <Text style={styles.headerText}>Hey! What did you like?</Text>}
                {feedbackType == "negative" && <Text style={styles.headerText}>Ugh! What happened?</Text>}
            </View>
            <View style={styles.body}>
            <Field style={styles.feedbackField} name='feedback'
                placeholder={placeholder}
                component={Input} autoCapitalize="none"
                autoCorrect={false} spellCheck={false} autoFocus={true}/>
            </View>
            <View style={styles.footer}>
                <Button title="Leave feedback" onPress={() => SubmitFeedback(feedbackType)}/>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        paddingTop: 30
    },
    body: {
        flex: 1,
        padding: 30
    },
    feedbackField: {
        flex: 1
    },
    header: {
        padding: 30,
        flex: 3,
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
    footer: {
        flex: 0
    }
})

export default reduxForm({
    form: 'feedback',
    destroyOnUnmount: true
})(Feedback)

// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import Button from '../universal/Button'
import { Input, MultiInput } from '../universal/Input'
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import { Field, reduxForm } from 'redux-form'


const Splash = ({SignIn}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Splash Page</Text>
            <Button title="Log in" onPress={() => SignIn()}/>
            <View style={styles.multiInputContainer}>
            <Field name='email' placeholder="email" component={MultiInput} inputPosition="firstInput" />
            <Field name='name' placeholder="name" component={MultiInput}  />
            <Field name='phone' placeholder="phone" component={MultiInput} inputPosition="lastInput" />
            </View>
   

        </View>
    )
}

export default reduxForm({
  form: 'test'
})(Splash)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: 30
    },
    multiInputContainer: {
        ...defaults.shadow,
        backgroundColor: 'rgba(63,63,63, 0)',
    }
})

// export default Splash
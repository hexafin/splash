import React, {Component} from "react"
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import PropTypes from "prop-types"

/*

Takes props:
- autofocus boolean (defualts to false)
- size integer (defaults to 6)
- callback function (code) => {}

*/



class NumericCodeInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: props.code || "",
        }
        this.handleCodeChange.bind(this)
        this.normalizeCode.bind(this)
    }

    handleCodeChange(code) {

        this.setState((prevState) => {
            return {
                code: this.normalizeCode(code)
            }
        })

        if (this.props.callback) {
            this.props.callback(code)
        }
    }

    normalizeCode (value) {
        const size = this.props.size ? this.props.size : 6
        if (!value) {
            return value
        }
        let normalizedValue = value.replace(/[^\d]/g, '')
        if (normalizedValue.length > size) {
            normalizedValue = normalizedValue.slice(0, size)
        }
        return normalizedValue
    }

    render() {

        const size = this.props.size ? this.props.size : 6

        let placeholder = ""
        for (let i = 0; i < size; i++) {
            placeholder += "#"
        }

        return (
            <View style={styles.wrapper}>
                <TextInput style={styles.codeInput}
                    onChangeText={(text) => this.handleCodeChange(text)}
                    keyboardType={"number-pad"}
                    placeholder={placeholder}
                    maxLength={this.props.size ? this.props.size : 6}
                    autoFocus={this.props.autoFocus || false}
                    value={this.state.code}/>
            </View>
        )
    }
}

NumericCodeInput.propTypes = {
    autofocus: PropTypes.bool,
    size: PropTypes.number,
    code: PropTypes.string,
    callback: PropTypes.func
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 10,
        borderRadius: 5,
        backgroundColor: colors.white
    },
    codeInput: {
        flex: 1,
        fontSize: 36,
        textAlign: "center"
    }

})

export default NumericCodeInput

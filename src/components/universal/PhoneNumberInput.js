import React, {Component} from "react"
import {
    View,
    Picker,
    StyleSheet,
    Text,
    TextInput,
    ActionSheetIOS,
    TouchableWithoutFeedback
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import {Input} from "./Input"
import {Field} from "redux-form"
import PropTypes from "prop-types"

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

const countryList = [
    "China",
    "South Korea",
    "Venezuela",
    "Mexico",
    "Germany",
    "France",
    "United States",
    "Canada",
    "United Kingdom",
    "Italy",
    "Spain",
]

const countryData = {
    "United States": {
        code: "+1",
        flag: "🇺🇸"
    },
    "Mexico": {
        code: "+52",
        flag: "🇲🇽"
    },
    "Canada": {
        code: "+1",
        flag: "🇨🇦"
    },
    "Germany": {
        code: "+49",
        flag: "🇩🇪"
    },
    "France": {
        code: "+33",
        flag: "🇫🇷"
    },
    "Italy": {
        code: "+39",
        flag: "🇮🇹"
    },
    "Spain": {
        code: "+34",
        flag: "🇪🇸"
    },
    "China": {
        code: "+86",
        flag: "🇨🇳"
    },
    "South Korea": {
        code: "+82",
        flag: "🇰🇷"
    },
    "Venezuela": {
        code: "+58",
        flag: "🇻🇪"
    },
    "United Kingdom": {
        code: "+44",
        flag: "🇬🇧"
    }
}

/*

Takes props:
- autofocus boolean (defualts to false)
- countryName string (defaults to "United States")
- countryCode string (defaults to "+1")
- countryFlag string (defualts to "🇺🇸")
- number string (defualts to "")
- callback function (state) => {}

*/

class PhoneNumberInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            countryName: props.countryName || "US",
            countryCode: props.countryCode || "+1",
            countryFlag: props.countryFlag || "🇺🇸",
            number: normalizePhone(props.number, "") || ""
        }
        this.handleCountryChange.bind(this)
        this.handlePhoneNumberChange.bind(this)
        this.handleCountryClick.bind(this)
    }

    handleCountryChange(countryIndex) {

        const country = countryList[countryIndex]

        this.setState((prevState) => {
            return {
                ...prevState,
                countryName: country,
                countryCode: countryData[country].code,
                countryFlag: countryData[country].flag
            }
        })

        if (this.props.callback) {
            this.props.callback(this.state)
        }

    }

    handlePhoneNumberChange(number)  {
        const normalizedNumber = normalizePhone(number, this.state.number)
        this.setState((prevState) => {
            return {
                ...prevState,
                number: normalizedNumber
            }
        })

        if (this.props.callback) {
            this.props.callback(this.state)
        }
    }

    handleCountryClick() {

        const countryButtons = []
        for (let i = 0; i < countryList.length; i++) {
            const country = countryList[i];
            countryButtons.push(countryData[country].flag + " " + country)
        }

        ActionSheetIOS.showActionSheetWithOptions({
            options: countryButtons
        },
        (buttonIndex) => {
            this.handleCountryChange(buttonIndex)
        })
    }

    render() {

        return (
            <View style={styles.normalWrapper}>
                <TouchableWithoutFeedback style={styles.countryCode}
                        onPress={() => this.handleCountryClick()}>
                    <View>
                        <Text style={styles.countryCodeText}>
                            {this.state.countryFlag} {this.state.countryCode}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.divider}/>
                <TextInput
                    style={styles.phoneNumber}
                    onChangeText={(text) => this.handlePhoneNumberChange(text)}
                    value={this.state.number}
                    keyboardType={"number-pad"}
                    placeholder={"### ### ####"}
                    autoFocus={this.props.autoFocus || false}/>
            </View>
        )
    }
}

PhoneNumberInput.PropTypes = {
    autofocus: PropTypes.bool,
    countryName: PropTypes.string,
    countryCode: PropTypes.string,
    countryFlag: PropTypes.string,
    number: PropTypes.string,
    callback: PropTypes.func
}

const styles = StyleSheet.create({
    normalWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 10,
        borderRadius: 5
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    countryCode: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10,
        height: 60,
        backgroundColor: colors.white
    },
    countryCodeText: {
        padding: 10,
        fontSize: 22,
        color: colors.nearBlack
    },
    phoneNumber: {
        flex: 3,
        height: 60,
        padding: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 22,
        color: colors.nearBlack
    },

})

export default PhoneNumberInput

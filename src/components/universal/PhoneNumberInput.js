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
    "US",
    "Canada"
]

const countryData = {
    "US": {
        code: "+1",
        flag: "🇺🇸"
    },
    "Canada": {
        code: "+1",
        flag: "🇨🇦"
    }
}

class PhoneNumberInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            countryName: "US",
            countryCode: "+1",
            countryFlag: "🇺🇸",
            phoneNumber: ""
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

    }

    handlePhoneNumberChange(number)  {
        const normalizedNumber = normalizePhone(number, this.state.phoneNumber)
        this.setState((prevState) => {
            return {
                ...prevState,
                phoneNumber: normalizedNumber
            }
        })
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

        const genCountryOptions = () => {
            const options = []
            for (let i = 0; i < countryList.length; i++) {
                const country = countryList[i]
                options.push(<Picker.Item key={"countryPicker"+i}
                    label={countryData[country].flag+" "+countryData[country].code}
                    value={country}/>)
            }
            return options
        }

        const pickingView = (
            <View style={styles.pickingWrapper}>
                <Picker selectedValue={this.state.countryName}
                        onValueChange={(itemValue, itemIndex) => {
                            this.handleCountryChange(itemValue)
                        }}>
                    {genCountryOptions()}
                </Picker>
            </View>
        )

        const normalView = (
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
                    value={this.state.phoneNumber}
                    keyboardType={"number-pad"}
                    placeholder={"### ### ####"}
                    autoFocus={this.props.autoFocus}/>
            </View>
        )

        return (
            <View>
                {this.state.isPickingCountry && pickingView}
                {!this.state.isPickingCountry && normalView}
            </View>
        )
    }
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
        marginRight: 10,
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

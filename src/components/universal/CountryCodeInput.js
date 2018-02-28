import React, {Component} from "react"
import {
    Picker,
    StyleSheet
} from "react-native"
import {colors} from "../../lib/colors"

class CountryCodeInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            country: "US"
        }
    }

    render() {
        const countries = [
            ["🇺🇸", "+1", "US"],
            ["🇨🇦", "+1", "Canada"],
            ["🇺🇸", "+1", "US"],
            ["🇺🇸", "+1", "US"],
        ]

        return (
            <Picker selectedValue={this.state.country} style={[styles.wrapper, this.props.style]}
                    onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
                <Picker.Item label="US" value="US"/>
                <Picker.Item label="CAN" value="CAN"/>
            </Picker>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: 80
    }
})

export default CountryCodeInput

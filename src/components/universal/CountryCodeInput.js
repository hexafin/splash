import React, {Component} from "react"
import {
    Picker
} from "react-native"

const CountryCodeInput = ({value, name, ...inputProps, input}) => {

    const genCountryPickers = () => {

        const countries = [
            ["🇺🇸", "+1", "US"],
            ["🇨🇦", "+1", "Canada"],
            ["🇺🇸", "+1", "US"],
            ["🇺🇸", "+1", "US"],
        ]

        let countryPickers = []
        for (let i = 0; i < countries.length; i++) {
            const country = countries[i]
            countryPickers.push(
                <Picker.Item label={country[0] + " " + country[1]}
                    value={country[2]} />
            )
        }
        return countryPickers
    }

    return (
        <Picker selectedValue={value}
                onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
            {genCountryPickers}
        </Picker>
    )
}

export default CountryCodeInput

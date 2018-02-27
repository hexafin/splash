import React, {Component} from "react"
import {
    Picker,
    StyleSheet
} from "react-native"
import {colors} from "../../lib/colors"

class PhoneNumberInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            country: "US"
        }
    }

    render() {

        const genCountryPickers = () = {
            const countries = [
                ["🇺🇸", "+1", "US"],
                ["🇨🇦", "+1", "Canada"],
                ["🇺🇸", "+1", "US"],
                ["🇺🇸", "+1", "US"],
            ]
            countryPickers = []
            for (let i = 0; i < countries.length; i++) {
                const country = countries[i]
                countryPickers.push(<Picker.Item label={country[0] + " " + country[1]} value={country[2]}/>)
            }
            return countryPickers
        }

        return (
            <Picker selectedValue={this.state.country} style={[styles.wrapper, this.props.style]}
                    onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
                {genCountryPickers()}
            </Picker>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: 80
    }
})

export default PhoneNumberInput

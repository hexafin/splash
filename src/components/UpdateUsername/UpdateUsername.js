import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Alert,
	TouchableOpacity,
	Keyboard,
	KeyboardAvoidingView,
	Image
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import {Input} from "../universal/Input"
import Button from "../universal/Button"
import { Field, reduxForm } from 'redux-form'
import debounce from 'lodash/debounce';
import axios from "axios"


class UpdateUsername extends Component {

    constructor(props) {
        super(props)
        this.state = {
            splashtagAvailable: false,
            checkingSplashtag: false
        }
        this.checkSplashtag = this.checkSplashtag.bind(this);
        this.debouncedOnChange = debounce(this.checkSplashtag, 250);
    }

    checkSplashtag(splashtag) {
        this.setState((prevState) => {
            return {
                ...prevState,
                checkingSplashtag: true
            }
        })
        axios.get("https://us-central1-hexa-splash.cloudfunctions.net/splashtagAvailable?splashtag="+splashtag).then(response => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    splashtagAvailable: response.data.available,
                    checkingSplashtag: false,
                }
            })
        }).catch(error => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    checkingSplashtag: false,
                }
            })
        })
    }

	render() {
		return (
			<KeyboardAvoidingView behavior={"padding"} style={styles.container}>
				<View>
					<View style={styles.header}>
						<Text style={{fontSize: 18, fontWeight: '700', color: colors.nearBlack}}>Update Splashtag</Text>
						<TouchableOpacity onPress={() => {
															Keyboard.dismiss()
															this.props.navigation.goBack()
														}}>
		                    <Image style={{height: 14, width: 14}} source={require('../../assets/icons/Xbutton.png')}/>
		                 </TouchableOpacity>
					</View>
					<Text style={styles.splashtagText}>Splashtag</Text>
	                <Field
	                    name='updateUsername' defaultValue={this.props.splashtag} component={Input}
	                    autoCapitalize="none" autoCorrect={false} spellCheck={false}
	                    autoFocus={true}
	                    checkmark={this.state.splashtagAvailable && !this.state.checkingSplashtag && this.props.usernameValue.length > 0}
	                    onChange={this.debouncedOnChange}
	                    />
	           </View>
                <Button
                	onPress={() => {
                		Keyboard.dismiss()
                		this.props.ChangeUsername().then(() => {
                			this.props.navigation.navigate("Account")
                		}).catch(error => {
                			Alert.alert("An error occurred while updating your splashtag. Please try again later")
                		})
                	}}
                	title='Update Splashtag'
                	style={styles.footerButton}
                	primary={true}
                    loading={this.props.isUpdatingUsername}
                    disabled={this.props.isUpdatingUsername || !this.state.splashtagAvailable || this.state.checkingSplashtag}
                    />
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...defaults.container,
		justifyContent: 'space-between',
		paddingHorizontal: 26,
	},
	header: {
		paddingTop: 66,
		paddingRight: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	splashtagText: {
		fontSize: 15,
		fontWeight: "700",
		color: "#B3B3B3",
		paddingBottom: 6,
		paddingTop: 21,
	},
	footerButton: {
		marginBottom: 32,
	}
});

export default reduxForm({
   form: 'updateSplashtag',
   destroyOnUnmount: true,
})(UpdateUsername)

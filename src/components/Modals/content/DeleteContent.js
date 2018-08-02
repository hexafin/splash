import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import { colors } from "../../../lib/colors";
import { defaults, icons } from "../../../lib/styles";
import Button from "../../universal/Button"

class DeleteContent extends Component {

	constructor(props) {
		super(props)
		this.state = {
			dots: [false, false, false],
			deleteEnabled: false,
		}
		this.handleClick = this.handleClick.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}

	handleClick(index) {
		let newDots = this.state.dots
		if (newDots[index] == false) {
			newDots[index] = true
			this.setState({dots: newDots})
		} else {
			newDots[index] = false
			this.setState({dots: newDots})
		}
		if(newDots[0] && newDots[1] && newDots[2]) {
			this.setState({deleteEnabled: true})
		} else {
			this.setState({deleteEnabled: false})
		}
	}

	handleDelete() {
		if (this.state.deleteEnabled) {
			this.props.handleClose()
			this.props.deleteCallback()
		} else {
			this.props.handleClose()
		}
	}

	render() {
		return (
			<View style={styles.content}>
				<View style={styles.header}>
				  <View style={styles.titleView}>
	                  <Text style={styles.title}>Are you sure?</Text>
				  </View>	                  
                  <TouchableOpacity onPress={this.props.handleClose}>
                    <Image style={styles.closeButton} source={require('../../../assets/icons/Xbutton.png')}/>
                  </TouchableOpacity>
                </View>
				<TouchableOpacity style={styles.deleteLine} onPress={() => this.handleClick(0)}>
					<View style={styles.clickedCircle}>
						{this.state.dots[0] && <View style={styles.redCross} />}
					</View>
					<Text style={styles.lineText}>Your splashtag will be deleted.</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.deleteLine} onPress={() => this.handleClick(1)}>
					<View style={styles.clickedCircle}>
						{this.state.dots[1] && <View style={styles.redCross} />}
					</View>
					<Text style={styles.lineText}>Your private key will be discarded.</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.deleteLine} onPress={() => this.handleClick(2)}>
					<View style={styles.clickedCircle}>
						{this.state.dots[2] && <View style={styles.redCross} />}
					</View>
					<Text style={styles.lineText}>Your money will be gone forever.</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.deleteButton, (this.state.deleteEnabled) ? {backgroundColor: 'red'}
																						  : {backgroundColor: colors.white}]}
								  onPress={this.handleDelete}>
					<Text style={[styles.buttonText, (this.state.deleteEnabled) ? {color: colors.white}
																				: {color: colors.nearBlack}]}>
						{(this.state.deleteEnabled) ? 'Yes, delete my account.' : 'No, save my money!'}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 30,
	},
	header: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    paddingBottom: 17,
	},
	titleView: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	title: {
	    fontSize: 20,
	    fontWeight: "600",
	    color: 'red',
	},
	closeButton: {
		height: 20,
		width: 20,
		margin: 8,
	},
	deleteLine: {
		flexDirection: 'row',
		paddingBottom: 10,
		alignItems: 'center',
	},
	lineText: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.nearBlack,
	},
	clickedCircle: {
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
		height: 25,
		width: 25,
		borderRadius: 12.5,
		borderWidth: 1,
		borderColor: 'red',
	},
	redCross: {
		height: 15,
		width: 15,
		borderRadius: 7.5,
		backgroundColor: 'red',
	},
	deleteButton: {
        shadowColor: colors.lightShadow,
        shadowOffset: defaults.shadowOffset,
        shadowOpacity: defaults.shadowOpacity,
        shadowRadius: defaults.shadowRadius,
        paddingVertical: 15,
        marginHorizontal: 10,
        marginTop: 10,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'red',
	},
	buttonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600'
	}
});

export default DeleteContent;
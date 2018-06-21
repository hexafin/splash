import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Switch,
} from "react-native"
import {colors} from "../../lib/colors"

const Setting = ({toggleCallback, toggleState, help}) => {
	return (
	    <View style={styles.container}>
	    	<View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
		    	<View style={styles.topRow}>
			    	<Text style={styles.title}>Lock your account</Text>
			    	{help && <View style={styles.helpCircle}>
			    		<Text style={styles.questionMark}>?</Text>
			    	</View>}
		    	</View>
		    	<Switch onTintColor={'#5153E9'} onValueChange={toggleCallback} value={toggleState}/>
	    	</View>
	    	<Text style={styles.description}>Set a four digit passcode to secure your Splash wallet.</Text>
	    </View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 5,
		backgroundColor: colors.white,
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 5,
	},
	title: {
		fontSize: 15,
		fontWeight: "500",
		paddingRight: 10,
		color: colors.nearBlack,
	},
	helpCircle: {
		width: 23,
		height: 23,
		backgroundColor: '#EFEFFD',
		borderRadius: 11.5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	questionMark: {
		color: colors.purple,
		fontSize: 15,
	},
	description: {
		fontSize: 14,
		color: '#919191',
		paddingRight: 78,
	},
})

export default Setting

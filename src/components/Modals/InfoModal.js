import React from "react"
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image
} from "react-native";
import { colors } from "../../lib/colors"
import { icons, defaults } from "../../lib/styles";

const InfoModal = ({title, body, handleClose}) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
			  <View />
              <Text style={styles.title}>{title}</Text>
	          <TouchableOpacity onPress={handleClose}>
	            <Image style={styles.closeButton} source={require('../../assets/icons/Xbutton.png')}/>
	          </TouchableOpacity>
	        </View>
	        <Text style={styles.content}>{body}</Text>
		</View>    							
	);
}

export default InfoModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30,
	},
	header: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    paddingBottom: 17,
	},
	title: {
	    fontSize: 20,
	    fontWeight: "600",
	    color: colors.nearBlack,
	    alignSelf: 'center'
	},
	closeButton: {
	    alignSelf: 'center',
		height: 20,
		width: 20
	},
	content: {
		fontSize: 18,
		color: colors.nearBlack,
		textAlign: 'center',
		alignSelf: 'center'
	}
});
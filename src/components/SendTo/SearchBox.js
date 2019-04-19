import React from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { colors } from "../../lib/colors";
import {
	connectInfiniteHits,
	connectSearchBox
} from "react-instantsearch/connectors";

export const SearchBox = ({ refine, currentRefinement, onChange }) => {
	return (
		<View style={styles.inputWrapper}>
			<TextInput
				onChangeText={text => {
					refine(text);
					onChange(text);
				}}
				value={currentRefinement}
				autoCapitalize={"none"}
				placeholder={"Splashtag, Phone or Address"}
				style={styles.input}
				autoCorrect={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		padding: 20,
		fontSize: 20,
		fontWeight: "500",
		color: colors.darkGray
	},
	inputWrapper: {
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.05,
		shadowRadius: 12,
		marginTop: 10,
		marginBottom: 15,
		borderRadius: 5,
		// paddingLeft: 50,
		backgroundColor: colors.white
	}
});

export default connectSearchBox(SearchBox);

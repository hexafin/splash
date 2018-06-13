import React from "react"
import {
    StyleSheet,
    View,
    TextInput,
    Text
} from "react-native"
import {colors} from "../../lib/colors"
import {
  connectInfiniteHits,
  connectSearchBox,
} from 'react-instantsearch/connectors';


const SearchBox = connectSearchBox(({ refine, currentRefinement }) => {

    return (
		<View style={styles.splashtagInputWrapper}>
			<Text style={styles.inputPrefix}>@</Text>
			<TextInput
			    onChangeText={text => refine(text)}
			    value={currentRefinement}
   				autoCapitalize={"none"}
				placeholder={"yourfriend"}
				style={styles.splashtagInput}
		        autoCorrect={false}
	        />
        </View>
    )
})

const styles = StyleSheet.create({
	inputPrefix: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.gray,
		position: "absolute",
		left: 20,
		top: 20
	},
	splashtagInput: {
		padding: 20,
		fontSize: 22,
		fontWeight: "600"
	},
	splashtagInputWrapper: {
		shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: colors.white
	}
})

export default SearchBox
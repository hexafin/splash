import React, {Component} from "react"
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import {
	StyleSheet,
	FlatList,
	View,
	Text
} from 'react-native';
import SendLineItem from "./SendLineItem"
import { colors } from "../../lib/colors"

const Hits = connectInfiniteHits(({ hits, hasMore, refine, callback, userId, selectedId }) => {

  /* if there are still results, you can
  call the refine function to load more */
  const onEndReached = function() {
    if (hasMore) {
      refine();
    }
  };
  if (hits.length != 0) {
	  return (
		    <FlatList
		      data={hits}
		      contentContainerStyle={styles.wrapper}
		      onEndReached={onEndReached}
		      keyExtractor={(item, index) => item.objectID}
		      renderItem={({ item }) => {
		      	if (item.objectID != userId) {
		      		return (
			          <SendLineItem
			            title={`@${item.splashtag}`}
			            selected={item.objectID == selectedId}
			            subtitle={"Valid Address"}
			            onPress={() => callback(item)}/>
			        )
		      	}
		      }}
		    />   
  		)
  } else {
  	return (
  		<View style={styles.emptyWrapper}>
	  		<Text style={styles.emptyText}>No results found</Text>
  		</View>
  	)
  }
});

const styles = StyleSheet.create({
	wrapper: {
		overflow: "visible",
		paddingHorizontal: 20,
	},
	emptyWrapper: {
		alignItems: 'center',
		marginBottom: 10,
	},
	emptyText: {
		color: colors.gray,
		fontSize: 16,
		fontWeight: "500",
	},
})

export default Hits
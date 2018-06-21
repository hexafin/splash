import React, {Component} from "react"
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import {
	StyleSheet,
	FlatList,
	View,
} from 'react-native';
import SendLineItem from "./SendLineItem"

const Hits = connectInfiniteHits(({ hits, hasMore, refine, callback, userId, selectedId }) => {

  /* if there are still results, you can
  call the refine function to load more */
  const onEndReached = function() {
    if (hasMore) {
      refine();
    }
  };

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
		            subtitle={item.phoneNumber}
		            onPress={() => callback(item)}/>
		        )
	      	}
	      }}
	    />   
  );
});

const styles = StyleSheet.create({
	wrapper: {
		overflow: "visible",
		paddingHorizontal: 20,
	}
})

export default Hits
import React, {Component} from "react"
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import {
	StyleSheet,
	FlatList,
	View,
} from 'react-native';
import SendLineItem from "./SendLineItem"

const Hits = connectInfiniteHits(({ hits, hasMore, refine, callback, userSplashtag }) => {

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
	      	console.log(item)
	      	if (item.splashtag != userSplashtag) {
	      		return (
		          <SendLineItem
		            title={`@${item.splashtag}`}
		            subtitle={item.phoneNumber}
		            circleText={item.splashtag.slice(0,2).toUpperCase()}
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
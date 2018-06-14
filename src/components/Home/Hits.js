import React, {Component} from "react"
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import { StyleSheet, FlatList } from 'react-native';
import SplashtagButton from "./SplashtagButton"

const Hits = connectInfiniteHits(({ hits, hasMore, refine, callback }) => {

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
      onEndReached={onEndReached}
      keyExtractor={(item, index) => item.objectID}
      renderItem={({ item }) => {
        return (
          <SplashtagButton
            user={item}
            onPress={() => callback(item)}/>
        )}}
       />       
  );
});

export default Hits
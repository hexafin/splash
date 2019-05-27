import React, { Component } from "react";
import { connectInfiniteHits } from "react-instantsearch/connectors";
import { StyleSheet, FlatList, View, Text } from "react-native";
import SendLineItem from "./SendLineItem";
import { colors } from "../../lib/colors";

/*
Component that takes search entry and runs it through Algolia search indexing and returns results
<Hits
	currency={currency code}
	contacts={array of contact objects}
	userId={userId}
	selectedId={boolean}
	callback={function}
	/>
*/

export const Hits = ({
	hits,
	hasMore,
	refine,
	callback,
	userId,
	contacts,
	selectedId,
	currency
}) => {
	/* if there are still results, you can
  call the refine function to load more */
	const onEndReached = function() {
		if (hasMore) {
			refine();
		}
	};

	let contactIds = contacts.map(a => a.objectID);

	// show contacts first
	const sortResults = () => {
		if (contacts.length > 0) {
			return hits.sort((a, b) => {
				if (contactIds.includes(a.objectID)) return -1;
				if (contactIds.includes(b.objectID)) return 1;
				return 0;
			});
		} else {
			return hits;
		}
	};

	if (hits.length != 0) {
		return (
			<FlatList
				data={sortResults()}
				contentContainerStyle={styles.wrapper}
				onEndReached={onEndReached}
				keyExtractor={(item, index) => item.objectID}
				renderItem={({ item }) => {
					if (
						item.objectID != userId &&
						typeof item.wallets !== "undefined" &&
						typeof item.wallets[currency] !== "undefined"
					) {
						return (
							<SendLineItem
								title={`@${item.splashtag}`}
								selected={item.objectID == selectedId}
								subtitle={contactIds.includes(item.objectID) ? "Your Contact" : "Valid Address"}
								onPress={() => callback(item)}
							/>
						);
					}
				}}
			/>
		);
	} else {
		return (
			<View style={styles.emptyWrapper}>
				<Text style={styles.emptyText}>No results found</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	wrapper: {
		overflow: "visible",
		paddingHorizontal: 20,
		paddingBottom: 130
	},
	emptyWrapper: {
		alignItems: "center",
		marginBottom: 10
	},
	emptyText: {
		color: colors.gray,
		fontSize: 16,
		fontWeight: "500"
	}
});

export default connectInfiniteHits(Hits);

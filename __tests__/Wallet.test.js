import "react-native";
import React from "react";
import Wallet from "../src/components/Wallet/Wallet";

it("Wallet renders correctly", () => {
	const snap = shallow(
		<Wallet
			navigation={{
				state: {
					params: {}
				},
				navigate: () => {}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

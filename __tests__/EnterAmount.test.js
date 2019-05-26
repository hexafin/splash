import "react-native";
import React from "react";
import EnterAmount from "../src/components/EnterAmount/EnterAmount";

it("Enter Amount renders correctly", () => {
	const snap = shallow(
		<EnterAmount
			balance={{
				BTC: 100
			}}
			activeCryptoCurrency={"BTC"}
			exchangeRates={{
				BTC: {
					USD: 1000
				}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

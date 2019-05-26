import "react-native";
import React from "react";
import ViewTransactionModal from "../src/components/ViewTransactionModal/ViewTransactionModal";

it("View Transaction Modal renders correctly", () => {
	const snap = shallow(
		<ViewTransactionModal
			transaction={{
				toSplashtag: "testTo",
				fromSplashtag: "testFrom",
				domain: "https://www.airbnb.com",
				currency: "BTC",
				thanked: true,
				relativeAmount: "100",
				relativeCurrency: "USD",
				amount: {
					subtotal: 100,
					total: 102
				}
			}}
			exchangeRate={{
				USD: 1000
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

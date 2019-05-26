import "react-native";
import React from "react";
import ApproveTransactionModal from "../src/components/ApproveTransactionModal/ApproveTransactionModal";

it("ApproveTransactionModal renders correctly", () => {
	const snap = shallow(
		<ApproveTransactionModal
			toAddress={"testAddress"}
			toId={"testId"}
			toSplashtag={"@testSplash"}
			amount={100}
			currency={"BTC"}
			exchangeRate={0.01}
			biometricEnabled={true}
			activeCryptoCurrency={"BTC"}
		/>
	);
	expect(snap).toMatchSnapshot();
});

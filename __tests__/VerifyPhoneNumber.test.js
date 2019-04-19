import "react-native";
import React from "react";
import VerifyPhoneNumber from "../src/components/VerifyPhoneNumber/VerifyPhoneNumber";

it("Verify Phone Number renders correctly", () => {
	const snap = shallow(
		<VerifyPhoneNumber
			navigation={{
				state: {
					params: {}
				},
				setParams: () => {},
				navigate: () => {}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

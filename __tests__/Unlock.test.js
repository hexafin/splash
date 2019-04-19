import "react-native";
import React from "react";
import Unlock from "../src/components/Unlock/Unlock";

it("Unlock renders correctly", () => {
	const snap = shallow(
		<Unlock
			navigation={{
				state: {
					params: {}
				}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

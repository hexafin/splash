import "react-native";
import React from "react";
import ApproveCardModal from "../src/components/ApproveCardModal/ApproveCardModal";

it("ApproveCardModal renders correctly", () => {
	const snap = shallow(
		<ApproveCardModal
			navigation={{
				state: {
					params: {
						domain: "https://github.com"
					}
				}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

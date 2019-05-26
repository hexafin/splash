import "react-native";
import React from "react";
import EnterPhoneNumber from "../src/components/EnterPhoneNumber/EnterPhoneNumber";

it("Enter Phone Number renders correctly", () => {
	const snap = shallow(<EnterPhoneNumber />);
	expect(snap).toMatchSnapshot();
});

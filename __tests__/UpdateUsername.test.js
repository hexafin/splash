import "react-native";
import React from "react";
import UpdateUsername from "../src/components/UpdateUsername/UpdateUsername";

it("Update Username renders correctly", () => {
	const snap = shallow(<UpdateUsername />);
	expect(snap).toMatchSnapshot();
});

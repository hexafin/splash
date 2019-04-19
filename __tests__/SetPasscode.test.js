import "react-native";
import React from "react";
import SetPasscode from "../src/components/SetPasscode/SetPasscode";

it("Set Passcode renders correctly", () => {
	const snap = shallow(<SetPasscode />);
	expect(snap).toMatchSnapshot();
});

import "react-native";
import React from "react";
import PhoneNumberInput from "../src/components/universal/PhoneNumberInput";

it("Phone Number Input renders correctly", () => {
	const snap = shallow(<PhoneNumberInput />);
	expect(snap).toMatchSnapshot();
});

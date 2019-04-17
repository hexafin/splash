import "react-native";
import React from "react";
import Account from "../src/components/Account/Account";
import Setting from "../src/components/Account/Setting";

it("Account renders correctly", () => {
	const snap = shallow(<Account />);
	expect(snap).toMatchSnapshot();
});

it("Setting renders correctly", () => {
	const snap = shallow(<Setting />);
	expect(snap).toMatchSnapshot();
});

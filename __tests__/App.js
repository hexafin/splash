import "react-native";
import React from "react";
import { App } from "../src";

it("App renders correctly", () => {
	const snap = shallow(<App />);
	expect(snap).toMatchSnapshot();
});

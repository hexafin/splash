import "react-native";
import React from "react";
import SwipeApp, { onScroll } from "../src/components/SwipeApp/SwipeApp";

global.onScroll = onScroll;

it("App renders correctly", () => {
	const snap = shallow(<SwipeApp />);
	expect(snap).toMatchSnapshot();
});

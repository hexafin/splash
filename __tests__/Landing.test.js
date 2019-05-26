import "react-native";
import React from "react";
import Landing from "../src/components/Landing/Landing";
import LandingSwipeView from "../src/components/Landing/LandingSwipeView";

it("Landing Swipe View renders correctly", () => {
	const snap = shallow(<LandingSwipeView />);
	expect(snap).toMatchSnapshot();
});

it("Landing renders correctly", () => {
	const snap = shallow(<Landing />);
	expect(snap).toMatchSnapshot();
});

import "react-native";
import React from "react";
import Home from "../src/components/Home/Home";
import { History } from "../src/components/Home/History";
import ColoredPayButton from "../src/components/Home/ColoredPayButton";

it("Home renders correctly", () => {
	const snap = shallow(
		<Home
			yOffset={{
				addListener: () => {}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("History renders correctly", () => {
	const snap = shallow(<History transactions={[]} />);
	expect(snap).toMatchSnapshot();
});

it("Colored Pay Button renders correctly", () => {
	const snap = shallow(
		<ColoredPayButton
			fill={{
				__getValue: () => {}
			}}
			fillInput={{
				addListener: () => {}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

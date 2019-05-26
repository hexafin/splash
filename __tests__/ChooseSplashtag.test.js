import "react-native";
import React from "react";
import ChooseSplashtag from "../src/components/ChooseSplashtag/ChooseSplashtag";

it("Choose Splashtag renders correctly", () => {
	const snap = shallow(<ChooseSplashtag />);
	expect(snap).toMatchSnapshot();
});

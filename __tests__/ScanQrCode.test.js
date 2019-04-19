import "react-native";
import React from "react";
import { ScanQrCode } from "../src/components/ScanQrCode";

it("ScanQrCode renders correctly", () => {
	const snap = shallow(<ScanQrCode />);
	expect(snap).toMatchSnapshot();
});

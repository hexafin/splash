import "react-native";
import React from "react";
import CardModal from "../src/components/Modals/CardModal";
import InfoModal from "../src/components/Modals/InfoModal";
import { ModalRoot } from "../src/components/Modals/ModalRoot";
import RaiseModal from "../src/components/Modals/RaiseModal";

it("Card Modal renders correctly", () => {
	const snap = shallow(<CardModal />);
	expect(snap).toMatchSnapshot();
});

it("Info Modal renders correctly", () => {
	const snap = shallow(<InfoModal />);
	expect(snap).toMatchSnapshot();
});

it("Modal Root renders correctly", () => {
	const snap = shallow(<ModalRoot />);
	expect(snap).toMatchSnapshot();
});

it("Raise Modal renders correctly", () => {
	const snap = shallow(<RaiseModal />);
	expect(snap).toMatchSnapshot();
});

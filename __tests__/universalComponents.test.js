import "react-native";
import React from "react";
import AnimatedWaves from "../src/components/universal/AnimatedWaves";
import Button from "../src/components/universal/Button";
import Checkmark from "../src/components/universal/Checkmark";
import CloseButton from "../src/components/universal/CloseButton";
import { CurrencySwitcher } from "../src/components/universal/CurrencySwitcher";
import CurrencySwitcherLight from "../src/components/universal/CurrencySwitcherLight";
import FlatBackButton from "../src/components/universal/FlatBackButton";
import {
	Input,
	MultiInput,
	MultiInputBlock
} from "../src/components/universal/Input";
import Keypad from "../src/components/universal/Keypad";
import LetterCircle from "../src/components/universal/LetterCircle";
import Loading from "../src/components/universal/Loading";
import LoadingCircle from "../src/components/universal/LoadingCircle";
import NextButton from "../src/components/universal/NextButton";
import NumericCodeInput from "../src/components/universal/NumericCodeInput";
import Ring from "../src/components/universal/Ring";
import TransactionLine from "../src/components/universal/TransactionLine";

it("AnimatedWaves renders correctly", () => {
	const snap = shallow(<AnimatedWaves />);
	expect(snap).toMatchSnapshot();
});

it("Button renders correctly", () => {
	const snap = shallow(<Button title="testButton" />);
	expect(snap).toMatchSnapshot();
});

it("Checkmark renders correctly", () => {
	const snap = shallow(<Checkmark />);
	expect(snap).toMatchSnapshot();
});

it("CloseButton renders correctly", () => {
	const snap = shallow(<CloseButton />);
	expect(snap).toMatchSnapshot();
});

it("CurrencySwitcher renders correctly", () => {
	const snap = shallow(<CurrencySwitcher />);
	expect(snap).toMatchSnapshot();
});

it("CurrencySwitcherLight renders correctly", () => {
	const snap = shallow(<CurrencySwitcherLight />);
	expect(snap).toMatchSnapshot();
});

it("FlatBackButton renders correctly", () => {
	const snap = shallow(<FlatBackButton />);
	expect(snap).toMatchSnapshot();
});

it("Input renders correctly", () => {
	const snap = shallow(<Input />);
	expect(snap).toMatchSnapshot();
});

it("MultiInput renders correctly", () => {
	const snap = shallow(
		<MultiInput
			input={{
				name: "test",
				placeholder: "testPlaceholder",
				onBlur: () => {}
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("MultiInputBlock renders correctly", () => {
	const snap = shallow(
		<MultiInputBlock
			inputs={[
				{
					name: "test",
					placeholder: "testPlaceholder",
					onBlur: () => {}
				}
			]}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Keypad renders correctly", () => {
	const snap = shallow(<Keypad />);
	expect(snap).toMatchSnapshot();
});

it("LetterCircle renders correctly", () => {
	const snap = shallow(<LetterCircle />);
	expect(snap).toMatchSnapshot();
});

it("Loading renders correctly", () => {
	const snap = shallow(<Loading />);
	expect(snap).toMatchSnapshot();
});

it("LoadingCircle renders correctly", () => {
	const snap = shallow(<LoadingCircle />);
	expect(snap).toMatchSnapshot();
});

it("NextButton renders correctly", () => {
	const snap = shallow(<NextButton />);
	expect(snap).toMatchSnapshot();
});

it("NumericCodeInput renders correctly", () => {
	const snap = shallow(<NumericCodeInput />);
	expect(snap).toMatchSnapshot();
});

it("Ring renders correctly", () => {
	const snap = shallow(<Ring />);
	expect(snap).toMatchSnapshot();
});

it("TransactionLine renders correctly", () => {
	const snap = shallow(
		<TransactionLine
			transaction={{
				toSplashtag: "testTo",
				fromSplashtag: "testFrom",
				domain: "https://www.airbnb.com",
				currency: "BTC"
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

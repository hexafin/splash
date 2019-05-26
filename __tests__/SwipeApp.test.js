import "react-native";
import React from "react";
import SwipeApp, { onScroll } from "../src/components/SwipeApp/SwipeApp";
import { ReturnToHome } from "../src/components/SwipeApp/ReturnToHome";
import Header from "../src/components/SwipeApp/Header";
import { CurrencySwitch } from "../src/components/SwipeApp/CurrencySwitch";
import { Balance } from "../src/components/SwipeApp/Balance";

global.onScroll = onScroll;

const mockAnimated = {
	interpolate: () => {
		return 50;
	},
	__getValue: () => {
		return 50;
	},
	addListener: () => {}
};

it("Swipe App renders correctly", () => {
	const snap = shallow(
		<SwipeApp
			Load={() => {}}
			setNotifsRequested={() => {}}
			notificationPermissionInfo={() => {
				return Promise.resolve();
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Return To Home renders correctly", () => {
	const snap = shallow(
		<ReturnToHome
			xOffset={mockAnimated}
			yOffsets={{
				home: mockAnimated
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Header renders correctly", () => {
	const snap = shallow(
		<Header
			fill={mockAnimated}
			fillInput={mockAnimated}
			xOffset={mockAnimated}
			yOffsets={{
				home: mockAnimated
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Currency Switch renders correctly", () => {
	const snap = shallow(
		<CurrencySwitch
			activeCurrency={"USD"}
			activeCryptoCurrency={"BTC"}
			loading={false}
			xOffset={mockAnimated}
			yOffsets={{
				home: mockAnimated
			}}
			switchXOffset={mockAnimated}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Balance renders correctly", () => {
	const snap = shallow(
		<Balance
			setActiveCurrency={() => {}}
			currency={"USD"}
			cryptoCurrency={"BTC"}
			balance={{
				BTC: 100,
				ETH: 0,
				GUSD: 0
			}}
			exchangeRates={{
				USD: {
					BTC: 100
				}
			}}
			isLoadingExchangeRates={false}
			isLoadingTransactions={false}
			isLoadingBalance={false}
			loadingBalanceCurrency={"ETH"}
			successLoadingBalance={true}
			xOffset={mockAnimated}
			yOffsets={{
				home: mockAnimated
			}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

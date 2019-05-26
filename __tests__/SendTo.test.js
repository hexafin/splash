import "react-native";
import React from "react";
import SendTo from "../src/components/SendTo/SendTo";
import { Hits } from "../src/components/SendTo/Hits";
import { SearchBox } from "../src/components/SendTo/SearchBox";
import SendButton from "../src/components/SendTo/SendButton";
import SendLineItem from "../src/components/SendTo/SendLineItem";

global.window = {};

it("Send To renders correctly", () => {
	const snap = shallow(
		<SendTo
			activeCryptoCurrency={"BTC"}
			sendCurrency={"USD"}
			sendAmount={5.0}
			network={"mainnet"}
			address={"testAddress"}
			capturedQr={false}
			userId={"testUserId"}
			contacts={[
				{
					splashtag: "userman",
					phoneNumber: "+19785012350",
					objectID: "uid",
					wallets: {
						BTC: "testAddress"
					}
				}
			]}
			showApproveModal={false}
			LoadTransactions={() => {
				return Promise.resolve();
			}}
			LoadContacts={() => {
				return Promise.resolve();
			}}
			DismissTransaction={() => {}}
			addContactsInfo={() => {}}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Hits renders correctly", () => {
	const snap = shallow(
		<Hits
			contacts={[
				{
					splashtag: "userman",
					phoneNumber: "+19785012350",
					objectID: "uid",
					wallets: {
						BTC: "testAddress"
					}
				}
			]}
			hits={[
				{
					splashtag: "userman"
				}
			]}
			hasMore={true}
			refine={false}
			callback={() => {}}
			userId={"testUserId"}
			selectedId={"selectedUserId"}
			currency={"USD"}
		/>
	);
	expect(snap).toMatchSnapshot();
});

it("Search Box renders correctly", () => {
	const snap = shallow(<SearchBox />);
	expect(snap).toMatchSnapshot();
});

it("SendButton renders correctly", () => {
	const snap = shallow(<SendButton />);
	expect(snap).toMatchSnapshot();
});

it("SendLineItem renders correctly", () => {
	const snap = shallow(<SendLineItem />);
	expect(snap).toMatchSnapshot();
});

import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-native-permissions");
jest.mock("react-native-code-push");
jest.mock("react-native-firebase");
jest.mock("react-native-sentry");
jest.mock("react-native-iphone-x-helper");
jest.mock("react-native-touch-id");
jest.mock("react-native-haptic-feedback");
jest.mock("react-native-keychain");
jest.mock("react-native-randombytes");
jest.mock("react-native-qrcode-scanner");
jest.mock("react-native-shimmer");
jest.mock("react-native-svg");
jest.mock("react-native-interactable");
jest.mock("react-native-svg/lib/extract/extractBrush", value => {
	return "";
});
jest.mock("react-native-contacts");

jest.mock("lottie-react-native");

if (typeof window !== "object") {
	global.window = global;
	global.window.navigator = {};
}
global.XMLHttpRequest = class XMLHttpRequest {
	constructor() {}
};

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.renderer = renderer;

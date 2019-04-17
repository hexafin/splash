export default class ReactNativePermissions {
	static check = jest.fn(name => {
		return Promise.resolve();
	});
	static request = jest.fn(name => {
		return Promise.resolve();
	});
}

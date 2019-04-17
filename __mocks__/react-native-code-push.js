const cp = (_: any) => (app: any) => app;
Object.assign(cp, {
	InstallMode: {},
	CheckFrequency: {},
	SyncStatus: {},
	UpdateState: {},
	DeploymentStatus: {},
	DEFAULT_UPDATE_DIALOG: {},

	checkForUpdate: jest.fn(),
	codePushify: jest.fn(),
	getConfiguration: jest.fn(),
	getCurrentPackage: jest.fn(),
	getUpdateMetadata: jest.fn(),
	log: jest.fn(),
	notifyAppReady: jest.fn(),
	notifyApplicationReady: jest.fn(),
	sync: jest.fn()
});
export default cp;
